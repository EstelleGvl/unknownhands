#!/usr/bin/env python3
"""Build a compact, browser-facing index of safely selectable scribal text segments."""

from __future__ import annotations

import json
import re
import csv
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROFILE_PATH = ROOT / "data" / "paleography" / "scribe_to_manuscript_v2.json"
TRANSCRIPTION_INDEX_PATH = ROOT / "assets" / "search" / "manuscripts" / "index.json"
TRANSCRIPTION_DIR = ROOT / "assets" / "search" / "manuscripts"
MAPPING_DIR = ROOT / "data" / "annos"
MANIFESTS_PATH = ROOT / "data" / "manifests.yml"
MANUSCRIPTS_CSV_PATH = ROOT / "data" / "manuscripts.csv"
OUTPUT_PATH = ROOT / "assets" / "analysis" / "scribe-text-index.json"


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def public_scribe_title(value: object) -> str:
    title = clean(value)
    return re.sub(r",\s*(Female|Male|TBC|Unknown)\s*$", "", title, flags=re.IGNORECASE)


def is_generic_scribe(profile: dict) -> bool:
    person = profile.get("person") or {}
    combined = " ".join(
        clean(value).lower()
        for value in (
            profile.get("scribe_title"),
            profile.get("scribal_unit_title"),
            person.get("name"),
        )
    )
    return bool(re.search(r"\b(unidentified|unknown|tbc)\b", combined))


def roman_to_int(value: str) -> int:
    values = {"i": 1, "v": 5, "x": 10, "l": 50, "c": 100, "d": 500, "m": 1000}
    total = previous = 0
    for character in reversed(value.lower()):
        current = values.get(character, 0)
        total += -current if current < previous else current
        previous = max(previous, current)
    return total


def folio_key(number: str, side: str) -> int:
    # Roman-numbered preliminary leaves sort before the Arabic foliation.
    base = int(number) if number.isdigit() else -1000 + roman_to_int(number)
    return base * 2 + (1 if side.lower() == "v" else 0)


def folio_intervals(value: object) -> list[tuple[int, int]]:
    """Parse common folio expressions, inferring r/v at open range boundaries."""
    text = clean(value).lower()
    if not text or "full manuscript" in text or text == "rest":
        return []
    text = text.replace("–", "-").replace("—", "-")
    token = r"(?:\d+|[ivxlcdm]+)"
    # Expand abbreviated same-folio ranges (102r-v) and open endings (138v-end).
    text = re.sub(
        rf"\b({token})\s*([rv])\s*-\s*([rv])\b",
        lambda match: f"{match.group(1)}{match.group(2)}-{match.group(1)}{match.group(3)}",
        text,
    )
    text = re.sub(r"-\s*(?:end|back)\b", "-999999v", text)
    pattern = re.compile(rf"\b({token})\s*([rv])?[abcd]?(?:\s*-\s*({token})\s*([rv])?[abcd]?)?")
    intervals = []
    for start_number, start_side, end_number, end_side in pattern.findall(text):
        if end_number:
            start = folio_key(start_number, start_side or "r")
            end = folio_key(end_number, end_side or "v")
        elif start_side:
            start = end = folio_key(start_number, start_side)
        else:
            start = folio_key(start_number, "r")
            end = folio_key(start_number, "v")
        intervals.append((min(start, end), max(start, end)))
    return intervals


def parse_canvas_folio(value: object) -> int | None:
    label = clean(value).lower()
    match = re.search(r"(?:f(?:ol)?\.?\s*)?(\d+|[ivxlcdm]+)\s*([rv])[abcd]?\b", label)
    if not match:
        return None
    return folio_key(match.group(1), match.group(2))


def selected_canvas_ids(mapping_items: list[dict], source_range: str) -> set[str] | None:
    intervals = folio_intervals(source_range)
    if not intervals:
        return None
    selected = set()
    saw_folio_labels = False
    for item in mapping_items:
        key = parse_canvas_folio(item.get("label"))
        if key is None:
            continue
        saw_folio_labels = True
        if any(start <= key <= end for start, end in intervals):
            selected.add(clean(item.get("canvas")).rstrip("/"))
    return selected if saw_folio_labels else None


def arabic_folio_keys(value: object) -> list[int]:
    """Return explicit Arabic folio sides from a canvas label."""
    label = clean(value).lower()
    return [folio_key(number, side) for number, side in re.findall(r"\b(\d+)\s*([rv])\b", label)]


def numbered_canvas(value: object) -> int | None:
    """Recognise repositories whose body canvases are labelled 1, 2, 3, ... ."""
    match = re.fullmatch(r"\s*(\d+)\s*", clean(value))
    return int(match.group(1)) if match else None


def main_text_canvas_ids(
    mapping_items: list[dict], pages: dict[str, dict]
) -> tuple[set[str] | None, str, str, str, list[str]]:
    """Locate the foliated text body and stop at its last transcribed canvas.

    Explicit Arabic foliation is preferred. Some repositories expose a numbered
    body sequence between named binding/flyleaf canvases; that is accepted as a
    secondary IIIF boundary. If neither exists, returning None prevents an
    unbounded whole-manuscript sample from entering the analysis.
    """
    text_canvases = {
        page["canvas"] for page in pages.values()
        if page["canvas"] and page["word_count"] > 0
    }
    mapped = [
        (index, item, clean(item.get("canvas")).rstrip("/"))
        for index, item in enumerate(mapping_items)
        if clean(item.get("canvas"))
    ]
    indexed = [row for row in mapped if row[2] in text_canvases]
    warnings: list[str] = []

    folio_rows = [
        (index, item, canvas, arabic_folio_keys(item.get("label")))
        for index, item, canvas in mapped
        if arabic_folio_keys(item.get("label"))
    ]
    first_recto = folio_key("1", "r")
    starts = [row for row in folio_rows if first_recto in row[3]]
    if starts:
        start_index, first_item, _, _ = starts[0]
        eligible_ends = [row for row in folio_rows if row[0] >= start_index and row[2] in text_canvases]
        if not eligible_ends:
            return None, "", "", "", warnings
        end_index, last_item, _, _ = eligible_ends[-1]
        allowed = {
            canvas for index, _, canvas in indexed
            if start_index <= index <= end_index
        }
        first_label = clean(first_item.get("label"))
        last_label = clean(last_item.get("label"))
        if re.search(
            r"unnumbered|unnumeriert|uncounted|non foli|\b[ivxlcdm]+v\s*-\s*1r",
            first_label,
            re.IGNORECASE,
        ):
            warnings.append(
                "The first included canvas combines preliminary material with f. 1r; page-level text cannot separate them."
            )
        if re.search(r"unnumbered|unnumeriert|uncounted|non foli", last_label, re.IGNORECASE):
            warnings.append(
                "The last included canvas combines the final folio with an unnumbered leaf; page-level text cannot separate them."
            )
        return allowed, "IIIF foliation from f. 1r to the last transcribed folio", first_label, last_label, warnings

    numbered_rows = [
        (index, item, canvas, numbered_canvas(item.get("label")))
        for index, item, canvas in mapped
        if numbered_canvas(item.get("label")) is not None
    ]
    starts = [row for row in numbered_rows if row[3] == 1]
    if starts:
        start_index, first_item, _, _ = starts[0]
        eligible_ends = [row for row in numbered_rows if row[0] >= start_index and row[2] in text_canvases]
        if not eligible_ends:
            return None, "", "", "", warnings
        end_index, last_item, _, _ = eligible_ends[-1]
        allowed = {
            canvas for index, _, canvas in indexed
            if start_index <= index <= end_index
        }
        return (
            allowed,
            "IIIF numbered text-body sequence from page 1 to the last transcribed numbered canvas",
            clean(first_item.get("label")),
            clean(last_item.get("label")),
            warnings,
        )

    return None, "", "", "", warnings


def load_manifest_metadata(path: Path) -> dict[str, dict[str, str]]:
    """Read the small subset of the simple manifests YAML needed by this index."""
    records: dict[str, dict[str, str]] = {}
    current: dict[str, str] | None = None
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        slug_match = re.match(r"^- slug:\s*(.+)$", raw_line)
        if slug_match:
            slug = slug_match.group(1).strip().strip("\"'")
            current = records.setdefault(slug, {})
            continue
        if current is None:
            continue
        field_match = re.match(r"^\s+(manifest|annos):\s*(.+)$", raw_line)
        if field_match:
            current[field_match.group(1)] = field_match.group(2).strip().strip("\"'")
    return records


def load_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def load_manuscript_catalog(path: Path) -> dict[str, dict[str, str]]:
    records = {}
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            manuscript_id = clean(row.get("Manuscript H-ID"))
            if not manuscript_id:
                continue
            records[f"ms-{manuscript_id}"] = {
                "institution": clean(row.get("Holding Institution Record Title")),
                "call_number": clean(row.get("Call number")),
                "title": clean(row.get("Manuscript Record Title")),
            }
    return records


def page_id(doc: dict) -> str | None:
    parts = clean(doc.get("id")).split("::")
    return parts[1] if len(parts) >= 2 else None


def build_index() -> dict:
    profile_data = load_json(PROFILE_PATH)
    transcription_index = load_json(TRANSCRIPTION_INDEX_PATH)
    available = {item["slug"]: item for item in transcription_index.get("manuscripts", [])}
    manifests = load_manifest_metadata(MANIFESTS_PATH)
    manuscript_catalog = load_manuscript_catalog(MANUSCRIPTS_CSV_PATH)

    profiles_by_manuscript = defaultdict(list)
    for profile in profile_data.get("manuscript_profiles", {}).values():
        slug = f"ms-{profile.get('manuscript_id')}"
        if slug in available:
            profiles_by_manuscript[slug].append(profile)

    scribes = defaultdict(lambda: {"segments": []})
    skipped = defaultdict(int)
    source_counts = defaultdict(int)
    shared_boundary_pages_excluded = 0
    manuscript_contexts: dict[str, dict] = {}
    manuscript_bodies: dict[str, dict] = {}

    def manuscript_context(slug: str) -> dict:
        if slug in manuscript_contexts:
            return manuscript_contexts[slug]
        transcription = load_json(TRANSCRIPTION_DIR / f"{slug}.json")
        pages: dict[str, dict] = {}
        for doc in transcription.get("docs", []):
            identifier = page_id(doc)
            if identifier is None:
                continue
            page = pages.setdefault(
                identifier,
                {
                    "canvas": str(doc.get("canvas") or "").strip().rstrip("/"),
                    "word_count": 0,
                    "character_count": 0,
                    "sources": set(),
                },
            )
            text = str(doc.get("text") or "").strip()
            if text:
                page["word_count"] += len(text.split())
                page["character_count"] += len(text) + (1 if page["character_count"] else 0)
            source = str(doc.get("source") or "").strip()
            if source:
                page["sources"].add(source)
        mapping_path = MAPPING_DIR / slug / "mapping.json"
        mapping_items = load_json(mapping_path).get("items", []) if mapping_path.exists() else []
        context = {"transcription": transcription, "pages": pages, "mapping_items": mapping_items}
        manuscript_contexts[slug] = context
        return context

    # Whole-text controls use the same bounded body definition as scribal samples.
    # Records without a defensible f. 1r/body-sequence boundary are not offered.
    for slug in sorted(available):
        context = manuscript_context(slug)
        allowed, basis, first_label, last_label, body_warnings = main_text_canvas_ids(
            context["mapping_items"], context["pages"]
        )
        if not allowed:
            skipped["unmappable_main_text_boundary"] += 1
            continue
        selected_page_ids = sorted(
            (
                identifier for identifier, page in context["pages"].items()
                if page["canvas"] in allowed and page["word_count"] > 0
            ),
            key=lambda value: (int(value) if value.isdigit() else 10**9, value),
        )
        selected_canvases = {
            context["pages"][identifier]["canvas"] for identifier in selected_page_ids
        }
        ordered_items = [
            item for item in context["mapping_items"]
            if clean(item.get("canvas")).rstrip("/") in selected_canvases
        ]
        manifest_meta = manifests.get(slug, {})
        catalog_meta = manuscript_catalog.get(slug, {})
        manuscript_bodies[slug] = {
            "page_ids": selected_page_ids,
            "page_count": len(selected_page_ids),
            "word_count": sum(context["pages"][identifier]["word_count"] for identifier in selected_page_ids),
            "selection_basis": basis,
            "mapped_first_label": first_label,
            "mapped_last_label": last_label,
            "first_canvas": clean(ordered_items[0].get("canvas")) if ordered_items else "",
            "last_canvas": clean(ordered_items[-1].get("canvas")) if ordered_items else "",
            "manifest": clean(manifest_meta.get("manifest")),
            "annos": clean(manifest_meta.get("annos")),
            "institution": clean(catalog_meta.get("institution")),
            "call_number": clean(catalog_meta.get("call_number")),
            "manuscript_title": clean(catalog_meta.get("title")) or clean(available[slug].get("title")),
            "warnings": body_warnings,
        }

    for slug, profiles in sorted(profiles_by_manuscript.items()):
        context = manuscript_context(slug)
        transcription = context["transcription"]
        pages = context["pages"]
        mapping_items = context["mapping_items"]
        # A canvas assigned to more than one range cannot be separated safely with
        # page-level transcription. Exclude it from every affected scribal sample.
        candidate_canvases: dict[str, set[str]] = {}
        canvas_owners: defaultdict[str, set[str]] = defaultdict(set)
        for profile in profiles:
            scribal_unit = profile.get("scribal_unit") or {}
            source_range = clean(scribal_unit.get("folio_range") or scribal_unit.get("extent"))
            if not (profile.get("requires_segment_filter") or folio_intervals(source_range)):
                continue
            selected = selected_canvas_ids(mapping_items, source_range)
            if selected:
                key = clean(profile.get("profile_key"))
                candidate_canvases[key] = selected
                for canvas in selected:
                    canvas_owners[canvas].add(key)
        contested_canvases = {
            canvas for canvas, owners in canvas_owners.items() if len(owners) > 1
        }

        for profile in profiles:
            if is_generic_scribe(profile):
                skipped["generic_scribe"] += 1
                continue

            scribal_unit = profile.get("scribal_unit") or {}
            relationship = profile.get("scribal_relationship") or {}
            production = profile.get("production_unit") or {}
            source_range = clean(scribal_unit.get("folio_range") or scribal_unit.get("extent"))
            needs_filter = bool(profile.get("requires_segment_filter") or folio_intervals(source_range))
            profile_key = clean(profile.get("profile_key"))
            body_meta = manuscript_bodies.get(slug)
            allowed_canvases = candidate_canvases.get(profile_key) if needs_filter else (
                {
                    pages[identifier]["canvas"]
                    for identifier in body_meta.get("page_ids", [])
                    if identifier in pages
                }
                if body_meta else None
            )

            if allowed_canvases is None:
                skipped["unmappable_folio_labels" if needs_filter else "unmappable_main_text_boundary"] += 1
                continue
            if not allowed_canvases:
                skipped["empty_folio_range" if needs_filter else "empty_main_text_body"] += 1
                continue

            excluded_shared = len(allowed_canvases & contested_canvases) if allowed_canvases else 0
            if allowed_canvases:
                allowed_canvases = allowed_canvases - contested_canvases
            shared_boundary_pages_excluded += excluded_shared

            selected_page_stats = {
                identifier: page
                for identifier, page in pages.items()
                if page["canvas"] in allowed_canvases
            }
            if not selected_page_stats:
                skipped["no_transcribed_text"] += 1
                continue

            selected_pages = sorted(
                selected_page_stats,
                key=lambda value: (int(value) if value.isdigit() else 10**9, value),
            )
            word_count = sum(page["word_count"] for page in selected_page_stats.values())
            character_count = sum(page["character_count"] for page in selected_page_stats.values())
            if word_count == 0:
                skipped["no_transcribed_text"] += 1
                continue

            sources = sorted(
                {source for page in selected_page_stats.values() for source in page["sources"]}
            )
            for source in sources:
                source_counts[source] += 1

            selected_canvases = {page["canvas"] for page in selected_page_stats.values()}
            mapped_items = [
                item for item in mapping_items
                if clean(item.get("canvas")).rstrip("/") in selected_canvases
            ]
            mapped_labels = [clean(item.get("label")) for item in mapped_items if clean(item.get("label"))]
            first_canvas = clean(mapped_items[0].get("canvas")) if mapped_items else ""
            last_canvas = clean(mapped_items[-1].get("canvas")) if mapped_items else ""
            manifest_meta = manifests.get(slug, {})
            catalog_meta = manuscript_catalog.get(slug, {})

            scribe_id = clean(profile.get("scribe_id"))
            scribe_name = public_scribe_title(profile.get("scribe_title")) or f"Scribe {scribe_id}"
            person = profile.get("person") or {}
            entry = scribes[scribe_id]
            entry.update(
                {
                    "id": scribe_id,
                    "name": scribe_name,
                    "person_url": clean(person.get("database_url")),
                }
            )
            warnings = []
            if not needs_filter and body_meta:
                warnings.extend(body_meta.get("warnings", []))
            if "passim" in source_range.lower():
                warnings.append("The source range includes 'passim'; only explicitly numbered folios are included.")
            if clean(relationship.get("scribe_certainty")).lower() not in {"", "high"}:
                warnings.append("The database records this scribal attribution with less than high certainty.")
            if excluded_shared:
                warnings.append(
                    f"{excluded_shared} shared boundary or collaboration page"
                    f"{'s were' if excluded_shared != 1 else ' was'} excluded because page-level text cannot separate hands."
                )

            entry["segments"].append(
                {
                    "id": profile_key,
                    "manuscript_slug": slug,
                    "manuscript_id": clean(profile.get("manuscript_id")),
                    "manuscript_title": clean(catalog_meta.get("title")) or clean(profile.get("manuscript_title")) or transcription.get("title", slug),
                    "institution": clean(catalog_meta.get("institution")),
                    "call_number": clean(catalog_meta.get("call_number")) or clean(profile.get("call_number")),
                    "scribal_unit_id": clean(profile.get("scribal_unit_id")),
                    "scribal_unit_title": clean(profile.get("scribal_unit_title")),
                    "folio_range": source_range or "Full manuscript",
                    "page_ids": selected_pages,
                    "page_count": len(selected_pages),
                    "word_count": word_count,
                    "character_count": character_count,
                    "certainty": clean(relationship.get("scribe_certainty")),
                    "role": clean(relationship.get("scribe_role")),
                    "script": clean(scribal_unit.get("script")),
                    "languages": scribal_unit.get("languages") or [],
                    "date": clean(scribal_unit.get("date") or production.get("date")),
                    "place": ", ".join(
                        part
                        for part in (
                            clean(production.get("city")),
                            clean(production.get("region")),
                            clean(production.get("country")),
                        )
                        if part
                    ),
                    "sources": sources,
                    "whole_manuscript": not needs_filter,
                    "selection_basis": "folio range mapped through IIIF canvases" if needs_filter else body_meta["selection_basis"],
                    "mapped_first_label": mapped_labels[0] if mapped_labels else "",
                    "mapped_last_label": mapped_labels[-1] if mapped_labels else "",
                    "first_canvas": first_canvas,
                    "last_canvas": last_canvas,
                    "manifest": clean(manifest_meta.get("manifest")),
                    "annos": clean(manifest_meta.get("annos")),
                    "excluded_shared_pages": excluded_shared,
                    "warnings": warnings,
                }
            )

    output_scribes = []
    for entry in scribes.values():
        entry["segments"].sort(key=lambda item: (item["manuscript_title"], item["folio_range"]))
        entry["total_words"] = sum(item["word_count"] for item in entry["segments"])
        entry["sample_count"] = len(entry["segments"])
        entry["manuscript_count"] = len({item["manuscript_slug"] for item in entry["segments"]})
        output_scribes.append(entry)
    output_scribes.sort(key=lambda item: item["name"].casefold())

    segment_count = sum(len(item["segments"]) for item in output_scribes)
    whole_count = sum(
        segment["whole_manuscript"]
        for item in output_scribes
        for segment in item["segments"]
    )
    return {
        "version": 3,
        "transcription_policy": (
            "Texts use the available project transcription. Transcription and HTR conventions are not "
            "uniform across manuscripts, so no diplomatic/normalized distinction is asserted."
        ),
        "summary": {
            "scribes": len(output_scribes),
            "segments": segment_count,
            "whole_manuscript_segments": whole_count,
            "range_filtered_segments": segment_count - whole_count,
            "skipped": dict(sorted(skipped.items())),
            "transcription_sources": dict(sorted(source_counts.items())),
            "shared_page_assignments_excluded": shared_boundary_pages_excluded,
            "bounded_manuscript_bodies": len(manuscript_bodies),
        },
        "manuscript_bodies": manuscript_bodies,
        "scribes": output_scribes,
    }


def validate_index(output: dict) -> None:
    """Reject duplicate sample IDs and page overlap between mapped scribal ranges."""
    sample_ids: set[str] = set()
    pages_by_manuscript: defaultdict[str, dict[str, str]] = defaultdict(dict)
    for manuscript, body in output.get("manuscript_bodies", {}).items():
        if not body.get("page_ids"):
            raise ValueError(f"Bounded manuscript body {manuscript} has no page IDs")
        if not body.get("mapped_first_label") or not body.get("mapped_last_label"):
            raise ValueError(f"Bounded manuscript body {manuscript} has no canvas labels")
    for scribe in output.get("scribes", []):
        for segment in scribe.get("segments", []):
            segment_id = clean(segment.get("id"))
            if not segment_id or segment_id in sample_ids:
                raise ValueError(f"Duplicate or empty scribal sample ID: {segment_id!r}")
            sample_ids.add(segment_id)
            if segment.get("whole_manuscript"):
                continue
            page_ids = segment.get("page_ids") or []
            if not page_ids:
                raise ValueError(f"Mapped sample {segment_id} has no page IDs")
            manuscript = clean(segment.get("manuscript_slug"))
            for page_id_value in page_ids:
                page_id_text = clean(page_id_value)
                previous = pages_by_manuscript[manuscript].get(page_id_text)
                if previous:
                    raise ValueError(
                        f"Mapped page overlap in {manuscript}, page {page_id_text}: "
                        f"{previous} and {segment_id}"
                    )
                pages_by_manuscript[manuscript][page_id_text] = segment_id


def main() -> None:
    output = build_index()
    validate_index(output)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump(output, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    summary = output["summary"]
    print(
        f"Wrote {OUTPUT_PATH.relative_to(ROOT)} with {summary['scribes']} scribes and "
        f"{summary['segments']} selectable segments."
    )


if __name__ == "__main__":
    main()
