#!/usr/bin/env python3
import argparse, json, os, re, sys
from pathlib import Path
from lxml import etree
from urllib.parse import urlparse
import requests

NS = {
    "alto": "http://www.loc.gov/standards/alto/ns-v4#",
}

def format_xywh(xywh):
    x, y, w, h = xywh
    return f"{x},{y},{w},{h}"

def alto_xywh(node):
    try:
        x = int(round(float(node.get("HPOS"))))
        y = int(round(float(node.get("VPOS"))))
        w = int(round(float(node.get("WIDTH"))))
        h = int(round(float(node.get("HEIGHT"))))
        return (x, y, w, h)
    except (TypeError, ValueError):
        return None

def alto_line_text(line):
    parts = []
    for child in line:
        tag = etree.QName(child).localname
        if tag == "String":
            content = child.get("CONTENT", "")
            if content:
                parts.append(content)
        elif tag == "SP":
            parts.append(" ")
    return re.sub(r"\s+", " ", "".join(parts)).strip()

def items_from_alto(xml_path, canvas):
    root = etree.parse(str(xml_path)).getroot()
    annos = []
    seq = 0
    canvas_id = canvas["id"]

    for line in root.findall(".//alto:TextLine", NS):
        raw_xywh = alto_xywh(line)
        txt = alto_line_text(line)
        if not raw_xywh or not txt:
            continue
        xywh = format_xywh(raw_xywh)
        seq += 1
        line_id = line.get("ID") or f"line-{seq}"
        annos.append({
            "id": f"{canvas_id}#{line_id}",
            "type": "Annotation",
            "motivation": "supplementing",
            "body": {
                "type": "TextualBody",
                "value": txt,
                "format": "text/plain",
                "purpose": "transcribing",
            },
            "target": {
                "source": canvas_id,
                "selector": { "type": "FragmentSelector", "value": f"xywh={xywh}" }
            }
        })
    return annos

def alto_source_info(xml_path):
    root = etree.parse(str(xml_path)).getroot()
    info = root.find(".//alto:sourceImageInformation", NS)
    file_name = ""
    file_identifier = ""
    if info is not None:
        file_name_node = info.find("./alto:fileName", NS)
        file_id_node = info.find("./alto:fileIdentifier", NS)
        file_name = (file_name_node.text or "").strip() if file_name_node is not None else ""
        file_identifier = (file_id_node.text or "").strip() if file_id_node is not None else ""
    return {
        "path": xml_path,
        "file_name": file_name,
        "file_identifier": file_identifier,
        "keys": identifier_keys(file_identifier, file_name),
    }

# ---------------- IIIF helpers ----------------

def _is_url(s: str) -> bool:
    try:
        return urlparse(s).scheme in ("http", "https")
    except Exception:
        return False

def _read_json(path_or_url):
    if _is_url(path_or_url):
        r = requests.get(
            path_or_url,
            timeout=40,
            headers={"User-Agent": "UnknownHands/1.0 (+https://unknownhands.netlify.app)"},
        )
        r.raise_for_status()
        return r.json()
    with open(path_or_url, "r", encoding="utf-8") as f:
        return json.load(f)

def body_from_annotation(anno):
    body = anno.get("body") or anno.get("resource") or anno.get("items")
    if isinstance(body, list) and body:
        body = body[0].get("body") if isinstance(body[0], dict) else body[0]
    return body if isinstance(body, dict) else {}

def label_text(value):
    if isinstance(value, dict):
        parts = []
        for values in value.values():
            if isinstance(values, list):
                parts.extend(str(item) for item in values if item)
            elif values:
                parts.append(str(values))
        return " ".join(parts)
    return str(value or "")

def image_id_from_canvas(canvas):
    image_annos = canvas.get("items") or canvas.get("images") or []
    for anno in image_annos:
        body = body_from_annotation(anno)
        image_id = body.get("id") or body.get("@id")
        if image_id:
            return image_id
    return ""

def canvas_dimensions(canvas):
    def as_int(value):
        try:
            return int(round(float(value)))
        except (TypeError, ValueError):
            return None

    width = as_int(canvas.get("width"))
    height = as_int(canvas.get("height"))
    if width and height:
        return width, height

    image_annos = canvas.get("items") or canvas.get("images") or []
    for anno in image_annos:
        body = body_from_annotation(anno)
        width = as_int(body.get("width"))
        height = as_int(body.get("height"))
        if width and height:
            return width, height
    return None, None

def identifier_keys(*values):
    keys = set()
    for value in values:
        if not value:
            continue
        value = str(value).strip()
        no_query = value.split("?", 1)[0].split("#", 1)[0].rstrip("/")
        keys.add(no_query)
        basename = os.path.basename(no_query)
        if basename:
            keys.add(basename.lower())
            keys.add(os.path.splitext(basename)[0].lower())
        match = re.search(r"ark:/[^/]+/([^/]+)/", no_query)
        if match:
            keys.add(match.group(1).lower())
    return {key for key in keys if key}

def load_manifest_canvases(path_or_url):
    """
    Return a list of canvas records, working with IIIF v2 or v3.
    v2: manifest['sequences'][0]['canvases'][i]['@id']
    v3: manifest['items'][i]['id']    where type == 'Canvas'
    """
    j = _read_json(path_or_url)

    canvases = []

    # Try v2
    if isinstance(j, dict) and "sequences" in j:
        try:
            for c in (j["sequences"][0].get("canvases") or []):
                cid = c.get("@id") or c.get("id")
                if cid:
                    image_id = image_id_from_canvas(c)
                    width, height = canvas_dimensions(c)
                    canvases.append({"id": cid, "label": label_text(c.get("label")), "image_id": image_id, "width": width, "height": height, "keys": identifier_keys(image_id)})
        except Exception:
            pass
        if canvases:
            print(f"Detected IIIF v2 manifest — {len(canvases)} canvases.")
            return canvases

    # Try v3
    if isinstance(j, dict) and "items" in j:
        for it in (j.get("items") or []):
            if isinstance(it, dict) and (it.get("type") == "Canvas" or it.get("@type") == "sc:Canvas"):
                cid = it.get("id") or it.get("@id")
                if cid:
                    image_id = image_id_from_canvas(it)
                    width, height = canvas_dimensions(it)
                    canvases.append({"id": cid, "label": label_text(it.get("label")), "image_id": image_id, "width": width, "height": height, "keys": identifier_keys(image_id)})
        if canvases:
            print(f"Detected IIIF v3 manifest — {len(canvases)} canvases.")
            return canvases

    raise RuntimeError("No canvases found in manifest JSON")

# ---------------- main pipeline ----------------

def natural_key(path):
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", Path(path).name)]

def match_xml_to_canvases(xml_files, canvases):
    xml_infos = [alto_source_info(path) for path in xml_files]
    canvas_by_key = {}
    for canvas in canvases:
        for key in canvas.get("keys", set()):
            canvas_by_key.setdefault(key, canvas)

    pairs = []
    matched_canvases = set()
    for i, info in enumerate(xml_infos):
        canvas = None
        for key in info.get("keys", set()):
            candidate = canvas_by_key.get(key)
            if candidate and candidate["id"] not in matched_canvases:
                canvas = candidate
                break
        if not canvas and len(xml_infos) == len(canvases):
            canvas = canvases[i]
        if not canvas:
            continue
        matched_canvases.add(canvas["id"])
        pairs.append((info["path"], canvas))
    return pairs

def write_annotation_pages(manifest_ref, xml_dir, out_dir, manifest_key):
    out_dir = Path(out_dir); out_dir.mkdir(parents=True, exist_ok=True)

    # /data/annos/<manifest_key>/
    ms_dir = out_dir / manifest_key
    ms_dir.mkdir(parents=True, exist_ok=True)

    # Fetch canvases from URL or local JSON path
    try:
        canvases = load_manifest_canvases(first_manifest_url(manifest_ref))
    except Exception as e:
        raise RuntimeError(e) from e

    xml_files = sorted(
        [path for path in Path(xml_dir).glob("*.xml") if path.name != "METS.xml"],
        key=natural_key,
    )
    if not xml_files:
        raise RuntimeError(f"No XML files found in {xml_dir}")

    pairs = match_xml_to_canvases(xml_files, canvases)
    if len(pairs) != len(xml_files):
        print(f"WARNING: matched {len(pairs)}/{len(xml_files)} XML files to {len(canvases)} canvases.")

    mapping = { "manifest": manifest_ref, "items": [] }

    for i, (xml_path, canvas) in enumerate(pairs):
        canvas_id = canvas["id"]
        items = items_from_alto(xml_path, canvas)

        ap = {
            "id": f"{ms_dir.as_posix()}/p{i+1}.ap.json",  # local file id (not strictly required)
            "type": "AnnotationPage",
            "items": items
        }
        ap_path = ms_dir / f"p{i+1}.ap.json"
        ap_path.write_text(json.dumps(ap, ensure_ascii=False, indent=2), encoding="utf-8")

        # public, site-relative path used by the Mirador plugin:
        mapping["items"].append({
            "canvas": canvas_id,
            "label": canvas.get("label") or "",
            "annotationPage": f"/data/annos/{manifest_key}/p{i+1}.ap.json"
        })

        if (i+1) % 25 == 0 or i == len(pairs)-1:
            print(f"  Wrote {i+1}/{len(pairs)} pages...")

    # mapping.json
    map_path = ms_dir / "mapping.json"
    map_path.write_text(json.dumps(mapping, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Done. Wrote {len(pairs)} annotation pages and mapping at {map_path}")
    return len(pairs)

def first_manifest_url(manifest_ref):
    return str(manifest_ref).split("|", 1)[0].strip()

def clean_yaml_value(value):
    return value.strip().strip('"').strip("'")

def load_registry(path):
    entries = []
    current = None
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            slug_match = re.match(r"^-\s+slug:\s*(.+)$", line)
            if slug_match:
                current = {"slug": clean_yaml_value(slug_match.group(1))}
                entries.append(current)
                continue
            if current is None:
                continue
            field_match = re.match(r"^\s+([a-zA-Z0-9_]+):\s*(.+)$", line)
            if field_match:
                current[field_match.group(1)] = clean_yaml_value(field_match.group(2))
    return entries

def update_manifest_annos_map(registry_entries, processed_slugs, map_path="data/manifest-annos-map.json"):
    if os.path.exists(map_path):
        with open(map_path, "r", encoding="utf-8") as f:
            manifest_map = json.load(f)
    else:
        manifest_map = {}
    by_slug = {entry["slug"]: entry for entry in registry_entries}
    for slug in processed_slugs:
        entry = by_slug.get(slug)
        if not entry:
            continue
        mapping_path = entry.get("annos") or f"/data/annos/{slug}/mapping.json"
        if os.path.exists(mapping_path.lstrip("/")):
            manifest_map[entry["manifest"]] = mapping_path
    with open(map_path, "w", encoding="utf-8") as f:
        json.dump(manifest_map, f, ensure_ascii=False, indent=2)
    print(f"Updated {map_path} ({len(manifest_map)} entries).")

def discover_alto_slugs(export_root):
    slugs = []
    root = Path(export_root)
    if not root.exists():
        return slugs
    for folder in sorted(path for path in root.iterdir() if path.is_dir()):
        if any(path.suffix.lower() == ".xml" for path in folder.iterdir() if path.is_file()):
            slugs.append(folder.name)
    return slugs

def ingest_registry(registry_path, export_root, out_dir, slugs):
    entries = load_registry(registry_path)
    by_slug = {entry["slug"]: entry for entry in entries}
    processed = []
    failed = []
    for slug in slugs:
        entry = by_slug.get(slug)
        if not entry:
            print(f"Skipping {slug}: not found in {registry_path}")
            continue
        xml_dir = Path(export_root) / slug
        if not xml_dir.exists():
            print(f"Skipping {slug}: missing {xml_dir}")
            continue
        print(f"\n{slug}: {entry.get('title', slug)}")
        try:
            count = write_annotation_pages(entry["manifest"], xml_dir, out_dir, slug)
        except Exception as exc:
            failed.append((slug, str(exc)))
            print(f"ERROR: {slug}: {exc}")
            continue
        if count:
            processed.append(slug)
    update_manifest_annos_map(entries, processed)
    if failed:
        print("\nFailed conversions:")
        for slug, reason in failed:
            print(f"- {slug}: {reason}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert ALTO XML exports to IIIF annotation pages.")
    parser.add_argument("slugs", nargs="*", help="Registry slugs to ingest, e.g. ms-15504")
    parser.add_argument("--all", action="store_true", help="Ingest every exports/alto/ms-*/ folder containing ALTO XML.")
    parser.add_argument("--registry", default="data/manifests.yml")
    parser.add_argument("--exports", default="exports/alto")
    parser.add_argument("--out", default="data/annos")
    args = parser.parse_args()
    slugs = discover_alto_slugs(args.exports) if args.all else args.slugs
    if not slugs:
        parser.error("provide one or more slugs, or use --all")
    ingest_registry(args.registry, args.exports, args.out, slugs)
