#!/usr/bin/env python3
"""Audit every registered IIIF manifest and all local transcription outputs.

The audit is deliberately non-destructive. It checks:

* every manifest URL in ``data/manuscripts.csv``;
* IIIF Presentation 2/3 structure and canvas identifiers;
* one representative image delivery path per manifest, including CORS headers;
* every local mapping and annotation page;
* every deployed per-manuscript transcription corpus;
* canvas alignment between manifests, mappings, annotations, and corpus documents.

Results are written as JSON and a concise Markdown report. Remote checks use a
bounded thread pool so the script is useful without overloading providers.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import csv
import json
import re
import ssl
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
# A browser-compatible token avoids a known Colenda server error triggered by
# URL-like text in custom User-Agent values while still identifying the audit.
USER_AGENT = "Mozilla/5.0 (compatible; UnknownHandsIIIFAudit/1.0)"
DEPLOYED_PROXY = "https://unknownhands.netlify.app/.netlify/functions/iiif?url="
XYWH_RE = re.compile(r"(?:^|[#&?])xywh=(?:pixel:)?\d+(?:\.\d+)?,\d+(?:\.\d+)?,\d+(?:\.\d+)?,\d+(?:\.\d+)?")
HOST_LOCKS: dict[str, threading.Lock] = {}
HOST_LAST_REQUEST: dict[str, float] = {}
HOST_LOCKS_GUARD = threading.Lock()


def host_delay(url: str) -> float:
    host = (urllib.parse.urlparse(url).hostname or "").lower()
    # Gallica throttles bursts aggressively. Its checks are intentionally
    # serialized so a complete audit does not manufacture HTTP 429 failures.
    return 1.25 if host in {"gallica.bnf.fr", "unknownhands.netlify.app"} else 0.0


def proxy_url(url: str) -> str:
    return DEPLOYED_PROXY + urllib.parse.quote(url, safe="")


def host_lock(url: str) -> tuple[str, threading.Lock]:
    host = (urllib.parse.urlparse(url).hostname or "").lower()
    with HOST_LOCKS_GUARD:
        lock = HOST_LOCKS.setdefault(host, threading.Lock())
    return host, lock


def normalize_id(value: Any) -> str:
    return re.sub(r"[?#].*$", "", str(value or "").strip()).rstrip("/")


def load_registry() -> list[dict[str, str]]:
    path = ROOT / "data/manuscripts.csv"
    with path.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    records = []
    for row in rows:
        heurist_id = (row.get("Manuscript H-ID") or "").strip()
        manifest = (row.get("IIIF Manifest Link(s)") or "").strip()
        records.append({
            "slug": f"ms-{heurist_id}" if heurist_id else "",
            "heurist_id": heurist_id,
            "title": (row.get("Manuscript Record Title") or "").strip(),
            "manifest": manifest,
        })
    return records


def body_from_annotation(annotation: Any) -> dict[str, Any]:
    if not isinstance(annotation, dict):
        return {}
    body = annotation.get("body") or annotation.get("resource") or annotation.get("items")
    if isinstance(body, list) and body:
        first = body[0]
        if isinstance(first, dict):
            body = first.get("body") or first.get("resource") or first
    return body if isinstance(body, dict) else {}


def canvas_image(canvas: dict[str, Any]) -> tuple[str, str]:
    annotations = canvas.get("items") or canvas.get("images") or []
    for annotation in annotations:
        body = body_from_annotation(annotation)
        image_id = body.get("id") or body.get("@id") or ""
        service = body.get("service")
        if isinstance(service, list):
            service = service[0] if service else None
        service_id = ""
        if isinstance(service, dict):
            service_id = service.get("id") or service.get("@id") or ""
        if image_id or service_id:
            return str(image_id), str(service_id)
    return "", ""


def manifest_canvases(data: Any) -> tuple[str, list[dict[str, str]]]:
    if not isinstance(data, dict):
        return "unknown", []
    canvases: list[dict[str, str]] = []
    sequences = data.get("sequences") or []
    if sequences and isinstance(sequences[0], dict):
        for canvas in sequences[0].get("canvases") or []:
            if not isinstance(canvas, dict):
                continue
            canvas_id = canvas.get("@id") or canvas.get("id") or ""
            image_id, service_id = canvas_image(canvas)
            canvases.append({"id": str(canvas_id), "image": image_id, "service": service_id})
        return "2", canvases
    for canvas in data.get("items") or []:
        if not isinstance(canvas, dict) or canvas.get("type") != "Canvas":
            continue
        canvas_id = canvas.get("id") or canvas.get("@id") or ""
        image_id, service_id = canvas_image(canvas)
        canvases.append({"id": str(canvas_id), "image": image_id, "service": service_id})
    return "3", canvases


def textual_body_value(body: Any) -> str:
    if isinstance(body, dict):
        return str(body.get("value") or "").strip()
    if isinstance(body, list):
        for item in body:
            value = textual_body_value(item)
            if value:
                return value
    return ""


def target_source_and_selector(target: Any) -> tuple[str, str]:
    if isinstance(target, str):
        source, _, fragment = target.partition("#")
        return source, fragment
    if not isinstance(target, dict):
        return "", ""
    source = target.get("source") or target.get("id") or target.get("@id") or ""
    if isinstance(source, dict):
        source = source.get("id") or source.get("@id") or ""
    selector = target.get("selector") or {}
    if isinstance(selector, list):
        selector = selector[0] if selector else {}
    selector_value = selector.get("value") if isinstance(selector, dict) else ""
    return str(source), str(selector_value or "")


def add_issue(result: dict[str, Any], code: str, detail: str, severity: str = "error") -> None:
    result["issues"].append({"code": code, "severity": severity, "detail": detail})


def audit_local_record(record: dict[str, str]) -> dict[str, Any]:
    slug = record["slug"]
    result: dict[str, Any] = {
        "slug": slug,
        "mapping_present": False,
        "mapping_canvases": 0,
        "annotation_pages": 0,
        "annotation_lines": 0,
        "corpus_present": False,
        "corpus_lines": 0,
        "mapping_canvas_ids": [],
        "issues": [],
    }
    mapping_path = ROOT / f"data/annos/{slug}/mapping.json"
    corpus_path = ROOT / f"assets/search/manuscripts/{slug}.json"

    mapping_items: list[dict[str, Any]] = []
    mapping_ids: set[str] = set()
    if mapping_path.exists():
        result["mapping_present"] = True
        try:
            mapping = json.loads(mapping_path.read_text(encoding="utf-8"))
            mapping_items = mapping.get("items") if isinstance(mapping, dict) else []
            if not isinstance(mapping_items, list):
                raise ValueError("items is not an array")
        except Exception as error:
            add_issue(result, "mapping_invalid", str(error))
            mapping_items = []

        seen_exact: set[str] = set()
        for index, item in enumerate(mapping_items):
            if not isinstance(item, dict):
                add_issue(result, "mapping_item_invalid", f"Item {index + 1} is not an object")
                continue
            canvas = str(item.get("canvas") or "")
            annotation_page = str(item.get("annotationPage") or "")
            if not canvas:
                add_issue(result, "mapping_canvas_missing", f"Item {index + 1}")
            elif canvas in seen_exact:
                add_issue(result, "mapping_canvas_duplicate", canvas)
            seen_exact.add(canvas)
            if canvas:
                mapping_ids.add(normalize_id(canvas))
            if not annotation_page:
                add_issue(result, "annotation_path_missing", f"Item {index + 1}")
                continue
            annotation_path = ROOT / annotation_page.lstrip("/")
            if not annotation_path.exists():
                add_issue(result, "annotation_file_missing", annotation_page)
                continue
            result["annotation_pages"] += 1
            try:
                page = json.loads(annotation_path.read_text(encoding="utf-8"))
            except Exception as error:
                add_issue(result, "annotation_invalid", f"{annotation_page}: {error}")
                continue
            items = page.get("items") if isinstance(page, dict) else []
            if not isinstance(items, list):
                add_issue(result, "annotation_items_invalid", annotation_page)
                continue
            for line_number, annotation in enumerate(items, start=1):
                if not isinstance(annotation, dict):
                    add_issue(result, "annotation_item_invalid", f"{annotation_page} item {line_number}")
                    continue
                text = textual_body_value(annotation.get("body"))
                if not text:
                    add_issue(result, "annotation_text_empty", f"{annotation_page} item {line_number}", "warning")
                    continue
                result["annotation_lines"] += 1
                source, selector = target_source_and_selector(annotation.get("target"))
                if source and canvas and normalize_id(source) != normalize_id(canvas):
                    add_issue(result, "annotation_canvas_mismatch", f"{annotation_page} item {line_number}")
                if selector and "xywh=" in selector and not XYWH_RE.search("#" + selector):
                    add_issue(result, "annotation_selector_invalid", f"{annotation_page} item {line_number}")

    result["mapping_canvases"] = len(mapping_items)
    result["mapping_canvas_ids"] = sorted(mapping_ids)

    if corpus_path.exists():
        result["corpus_present"] = True
        try:
            corpus = json.loads(corpus_path.read_text(encoding="utf-8"))
            docs = corpus.get("docs") if isinstance(corpus, dict) else []
            if not isinstance(docs, list):
                raise ValueError("docs is not an array")
            result["corpus_lines"] = len(docs)
            corpus_ids = {normalize_id(doc.get("canvas")) for doc in docs if isinstance(doc, dict) and doc.get("canvas")}
            missing_ids = sorted(corpus_ids - mapping_ids) if mapping_ids else []
            if missing_ids:
                add_issue(result, "corpus_canvas_not_mapped", f"{len(missing_ids)} canvas IDs")
            empty_docs = sum(
                1 for doc in docs
                if not isinstance(doc, dict) or not str(doc.get("text") or "").strip()
            )
            if empty_docs:
                add_issue(result, "corpus_text_empty", f"{empty_docs} documents")
        except Exception as error:
            add_issue(result, "corpus_invalid", str(error))

    if result["mapping_present"] and result["mapping_canvases"] and not result["annotation_lines"]:
        add_issue(result, "mapping_has_no_text", "Mapped annotation pages contain no transcription text", "warning")
    if result["mapping_present"] and result["annotation_lines"] and not result["corpus_present"]:
        add_issue(result, "corpus_missing", str(corpus_path.relative_to(ROOT)))
    if (
        result["mapping_present"]
        and result["corpus_present"]
        and result["annotation_lines"] != result["corpus_lines"]
    ):
        add_issue(
            result,
            "corpus_line_count_mismatch",
            f"annotations={result['annotation_lines']}, corpus={result['corpus_lines']}",
        )
    return result


def fetch_bytes(
    url: str,
    timeout: float,
    limit: int,
    headers: dict[str, str] | None = None,
    *,
    strict_limit: bool = True,
    attempts: int = 2,
) -> tuple[bytes, Any, str]:
    request_headers = {"User-Agent": USER_AGENT, **(headers or {})}
    context = ssl.create_default_context()
    last_error: Exception | None = None
    for attempt in range(max(1, attempts)):
        try:
            host, lock = host_lock(url)
            delay = host_delay(url)
            with lock:
                remaining = delay - (time.monotonic() - HOST_LAST_REQUEST.get(host, 0.0))
                if remaining > 0:
                    time.sleep(remaining)
                request = urllib.request.Request(url, headers=request_headers)
                try:
                    with urllib.request.urlopen(request, timeout=timeout, context=context) as response:
                        data = response.read(limit + 1 if strict_limit else limit)
                        if strict_limit and len(data) > limit:
                            raise ValueError(f"response exceeds {limit} bytes")
                        return data, response.headers, response.geturl()
                finally:
                    HOST_LAST_REQUEST[host] = time.monotonic()
        except Exception as error:
            last_error = error
            if attempt + 1 < attempts:
                wait = 2.0 if isinstance(error, urllib.error.HTTPError) and error.code == 429 else 0.5
                time.sleep(wait * (attempt + 1))
    assert last_error is not None
    raise last_error


def probe_resource(url: str, timeout: float) -> dict[str, Any]:
    try:
        # Some image servers ignore Range and return the whole image. Reading a
        # small prefix is sufficient to prove delivery without misclassifying
        # those valid responses as oversized.
        data, headers, final_url = fetch_bytes(
            url,
            timeout,
            4096,
            {"Range": "bytes=0-4095"},
            strict_limit=False,
        )
        return {
            "ok": bool(data),
            "url": url,
            "final_url": final_url,
            "content_type": headers.get_content_type(),
            "cors": headers.get("Access-Control-Allow-Origin") or "",
            "error": "",
        }
    except Exception as error:
        return {"ok": False, "url": url, "final_url": "", "content_type": "", "cors": "", "error": str(error)}


def audit_remote_record(record: dict[str, str], timeout: float, max_manifest_bytes: int) -> dict[str, Any]:
    result: dict[str, Any] = {
        "slug": record["slug"],
        "title": record["title"],
        "manifest": record["manifest"],
        "manifest_ok": False,
        "presentation_version": "",
        "canvas_count": 0,
        "canvas_ids": [],
        "manifest_cors": "",
        "manifest_fetch_mode": "direct",
        "image_probe": None,
        "issues": [],
    }
    if not record["manifest"]:
        add_issue(result, "manifest_url_missing", "No IIIF manifest URL")
        return result
    try:
        raw, headers, final_url = fetch_bytes(record["manifest"], timeout, max_manifest_bytes)
        result["manifest_final_url"] = final_url
        result["manifest_cors"] = headers.get("Access-Control-Allow-Origin") or ""
        data = json.loads(raw)
    except Exception as error:
        host = (urllib.parse.urlparse(record["manifest"]).hostname or "").lower()
        if host != "gallica.bnf.fr":
            add_issue(result, "manifest_fetch_failed", str(error))
            return result
        try:
            raw, headers, final_url = fetch_bytes(proxy_url(record["manifest"]), timeout, max_manifest_bytes)
            result["manifest_final_url"] = final_url
            result["manifest_cors"] = headers.get("Access-Control-Allow-Origin") or ""
            result["manifest_fetch_mode"] = "deployed_proxy"
            data = json.loads(raw)
            add_issue(result, "manifest_direct_rate_limited", str(error), "warning")
        except Exception as proxy_error:
            add_issue(result, "manifest_fetch_failed", f"direct: {error}; proxy: {proxy_error}")
            return result

    version, canvases = manifest_canvases(data)
    result["presentation_version"] = version
    result["canvas_count"] = len(canvases)
    result["canvas_ids"] = [normalize_id(canvas["id"]) for canvas in canvases if canvas["id"]]
    if not canvases:
        add_issue(result, "manifest_no_canvases", "No Presentation 2 or 3 canvases found")
        return result
    result["manifest_ok"] = True
    if not result["manifest_cors"]:
        add_issue(result, "manifest_cors_missing", "Access-Control-Allow-Origin is absent", "warning")

    missing_canvas_ids = sum(1 for canvas in canvases if not canvas["id"])
    missing_images = sum(1 for canvas in canvases if not canvas["image"] and not canvas["service"])
    if missing_canvas_ids:
        add_issue(result, "canvas_id_missing", f"{missing_canvas_ids} canvases")
    if missing_images:
        add_issue(result, "canvas_image_missing", f"{missing_images} canvases")

    representative = next((canvas for canvas in canvases if canvas["service"] or canvas["image"]), None)
    if representative:
        probe_url = (
            representative["service"].rstrip("/") + "/info.json"
            if representative["service"]
            else representative["image"]
        )
        checked_probe_url = proxy_url(probe_url) if result["manifest_fetch_mode"] == "deployed_proxy" else probe_url
        probe = probe_resource(checked_probe_url, timeout)
        if checked_probe_url != probe_url:
            probe["source_url"] = probe_url
            probe["fetch_mode"] = "deployed_proxy"
        result["image_probe"] = probe
        if not probe["ok"]:
            add_issue(result, "image_probe_failed", probe["error"])
        elif not probe["cors"]:
            add_issue(result, "image_cors_missing", "Access-Control-Allow-Origin is absent", "warning")
    return result


def summarize(records: list[dict[str, Any]], local: list[dict[str, Any]]) -> dict[str, Any]:
    remote_issue_counts = Counter(issue["code"] for record in records for issue in record["issues"])
    local_issue_counts = Counter(issue["code"] for record in local for issue in record["issues"])
    unresolved_rate_limited = sum(
        1 for record in records
        if not record["manifest_ok"]
        and any("429" in issue["detail"] for issue in record["issues"])
    )
    missing_urls = sum(
        1 for record in records
        if any(issue["code"] == "manifest_url_missing" for issue in record["issues"])
    )
    unresolved_other = sum(1 for record in records if not record["manifest_ok"]) - unresolved_rate_limited - missing_urls
    return {
        "registry_records": len(records),
        "manifest_ok": sum(1 for record in records if record["manifest_ok"]),
        "manifest_failed": sum(1 for record in records if not record["manifest_ok"]),
        "manifest_verified_via_proxy": sum(
            1 for record in records if record.get("manifest_fetch_mode") == "deployed_proxy"
        ),
        "manifest_rate_limited_unresolved": unresolved_rate_limited,
        "manifest_url_missing": missing_urls,
        "manifest_provider_or_endpoint_failed": unresolved_other,
        "image_probe_ok": sum(
            1 for record in records
            if record.get("image_probe") and record["image_probe"].get("ok")
        ),
        "image_probe_failed": sum(1 for record in records if record.get("image_probe") and not record["image_probe"]["ok"]),
        "mapping_records": sum(1 for record in local if record["mapping_present"]),
        "corpus_records": sum(1 for record in local if record["corpus_present"]),
        "annotation_pages": sum(record["annotation_pages"] for record in local),
        "annotation_lines": sum(record["annotation_lines"] for record in local),
        "corpus_lines": sum(record["corpus_lines"] for record in local),
        "remote_issue_counts": dict(sorted(remote_issue_counts.items())),
        "local_issue_counts": dict(sorted(local_issue_counts.items())),
    }


def compare_remote_local(remote: list[dict[str, Any]], local: list[dict[str, Any]]) -> None:
    remote_by_slug = {record["slug"]: record for record in remote}
    for local_record in local:
        if not local_record["mapping_present"]:
            continue
        remote_record = remote_by_slug.get(local_record["slug"])
        if not remote_record or not remote_record["manifest_ok"] or "canvas_ids" not in remote_record:
            continue
        remote_ids = set(remote_record["canvas_ids"])
        mapping_ids = set(local_record["mapping_canvas_ids"])
        missing = mapping_ids - remote_ids
        if missing:
            add_issue(local_record, "mapping_canvas_not_in_manifest", f"{len(missing)} canvas IDs")


def write_markdown(path: Path, report: dict[str, Any]) -> None:
    summary = report["summary"]
    lines = [
        "# IIIF and Transcription Audit",
        "",
        f"Generated: {report['generated_at']}",
        "",
        "## Summary",
        "",
        f"- Registry manifests: {summary['registry_records']}",
        f"- Valid/reachable manifests: {summary['manifest_ok']}",
        f"- Unresolved manifests: {summary['manifest_failed']}",
        f"  - Rate-limited after direct and proxy retries: {summary['manifest_rate_limited_unresolved']}",
        f"  - Missing manifest URL: {summary['manifest_url_missing']}",
        f"  - Provider or endpoint failure: {summary['manifest_provider_or_endpoint_failed']}",
        f"- Manifests verified through the deployed proxy: {summary['manifest_verified_via_proxy']}",
        f"- Successful representative image probes: {summary['image_probe_ok']}",
        f"- Failed representative image probes: {summary['image_probe_failed']}",
        f"- Manuscripts with annotation mappings: {summary['mapping_records']}",
        f"- Manuscripts with deployed transcription corpora: {summary['corpus_records']}",
        f"- Annotation pages checked: {summary['annotation_pages']}",
        f"- Annotation lines checked: {summary['annotation_lines']}",
        f"- Corpus lines checked: {summary['corpus_lines']}",
        "",
        "## Records requiring attention",
        "",
        "| Manuscript | Remote issues | Local issues |",
        "|---|---|---|",
    ]
    local_by_slug = {record["slug"]: record for record in report["local"]}
    for remote in report["remote"]:
        local_issues = local_by_slug.get(remote["slug"], {}).get("issues", [])
        if not remote["issues"] and not local_issues:
            continue
        remote_text = "; ".join(f"{item['code']}: {item['detail']}" for item in remote["issues"]) or "—"
        local_text = "; ".join(f"{item['code']}: {item['detail']}" for item in local_issues) or "—"
        title = (remote["title"] or remote["slug"]).replace("|", "\\|")
        lines.append(f"| {title} (`{remote['slug']}`) | {remote_text.replace('|', '/') } | {local_text.replace('|', '/')} |")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=10)
    parser.add_argument("--timeout", type=float, default=25.0)
    parser.add_argument("--max-manifest-mb", type=int, default=30)
    parser.add_argument("--json", default="reports/iiif-transcription-audit.json")
    parser.add_argument("--markdown", default="reports/iiif-transcription-audit.md")
    parser.add_argument("--local-only", action="store_true")
    parser.add_argument("--resume", action="store_true", help="Keep prior remote results and replace selected records")
    parser.add_argument("--slugs", help="Comma-separated manuscript slugs to check remotely")
    args = parser.parse_args()

    registry = load_registry()
    print(f"Auditing local transcription outputs for {len(registry)} registry records…", flush=True)
    local = []
    for index, record in enumerate(registry, start=1):
        local.append(audit_local_record(record))
        if index % 25 == 0 or index == len(registry):
            print(f"  local {index}/{len(registry)}", flush=True)

    json_path = ROOT / args.json
    selected_slugs = {
        slug.strip() for slug in (args.slugs or "").split(",") if slug.strip()
    }
    remote_by_slug: dict[str, dict[str, Any]] = {}
    if args.resume and json_path.exists():
        previous = json.loads(json_path.read_text(encoding="utf-8"))
        remote_by_slug = {
            item["slug"]: item for item in previous.get("remote", [])
            if isinstance(item, dict) and item.get("slug")
        }
    audit_registry = [
        record for record in registry
        if not selected_slugs or record["slug"] in selected_slugs
    ]

    remote: list[dict[str, Any]] = []
    if not args.local_only:
        print(f"Auditing {len(audit_registry)} remote manifests with {args.workers} workers…", flush=True)
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
            futures = {
                executor.submit(
                    audit_remote_record,
                    record,
                    args.timeout,
                    args.max_manifest_mb * 1024 * 1024,
                ): record
                for record in audit_registry
            }
            completed = 0
            for future in concurrent.futures.as_completed(futures):
                record = futures[future]
                try:
                    remote.append(future.result())
                except Exception as error:
                    failed = {
                        "slug": record["slug"], "title": record["title"], "manifest": record["manifest"],
                        "manifest_ok": False, "presentation_version": "", "canvas_count": 0,
                        "canvas_ids": [], "manifest_cors": "", "image_probe": None, "issues": [],
                    }
                    add_issue(failed, "audit_exception", str(error))
                    remote.append(failed)
                completed += 1
                if completed % 25 == 0 or completed == len(audit_registry):
                    print(f"  remote {completed}/{len(audit_registry)}", flush=True)
        remote_by_slug.update({item["slug"]: item for item in remote})
        remote = []
        for record in registry:
            item = remote_by_slug.get(record["slug"])
            if item is None:
                item = {
                    "slug": record["slug"], "title": record["title"], "manifest": record["manifest"],
                    "manifest_ok": False, "presentation_version": "", "canvas_count": 0,
                    "canvas_ids": [], "manifest_cors": "", "manifest_fetch_mode": "not_audited",
                    "image_probe": None, "issues": [],
                }
                add_issue(item, "manifest_not_audited", "Record was outside the selected audit subset")
            remote.append(item)
    else:
        remote = [
            {
                "slug": record["slug"], "title": record["title"], "manifest": record["manifest"],
                "manifest_ok": False, "presentation_version": "", "canvas_count": 0,
                "canvas_ids": [], "manifest_cors": "", "image_probe": None, "issues": [],
            }
            for record in registry
        ]

    compare_remote_local(remote, local)
    # Canvas identifiers are needed while comparing sources but make the
    # persisted report unnecessarily large. Counts and mismatch issues retain
    # the actionable result without duplicating every manifest identifier.
    for record in remote:
        record.pop("canvas_ids", None)
    for record in local:
        record.pop("mapping_canvas_ids", None)
    report = {
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S %z"),
        "summary": summarize(remote, local),
        "remote": remote,
        "local": local,
    }
    markdown_path = ROOT / args.markdown
    json_path.parent.mkdir(parents=True, exist_ok=True)
    markdown_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(markdown_path, report)
    print(json.dumps(report["summary"], indent=2), flush=True)
    print(f"Wrote {json_path.relative_to(ROOT)} and {markdown_path.relative_to(ROOT)}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
