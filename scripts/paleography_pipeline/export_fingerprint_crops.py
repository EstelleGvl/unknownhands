import csv
import json
import os
import re
from pathlib import Path

import yaml

SCRIBES_DIR = Path("_scribes")
OUTPUT_DIR = Path("assets/data")
JSON_PATH = OUTPUT_DIR / "scribal-fingerprint-crops.json"
CSV_PATH = OUTPUT_DIR / "scribal-fingerprint-crops.csv"
EXCLUDED_GRAPHEME_KEYS = {"long_s", "rotund_r", "insular_d"}


def read_frontmatter(path):
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---", text, re.S)
    if not match:
        return {}
    return yaml.safe_load(match.group(1)) or {}


def csv_value(value):
    if value is None:
        return ""
    if isinstance(value, list):
        return ",".join(str(part) for part in value)
    if isinstance(value, dict):
        return json.dumps(value, ensure_ascii=False, sort_keys=True)
    return str(value)


def export_rows():
    rows = []
    for path in sorted(SCRIBES_DIR.glob("*.md")):
        profile = read_frontmatter(path)
        scribe_slug = path.stem
        metadata = profile.get("metadata") or {}
        for feature in profile.get("features") or []:
            grapheme = feature.get("letter") or feature.get("key") or ""
            grapheme_key = feature.get("key") or grapheme
            if grapheme_key in EXCLUDED_GRAPHEME_KEYS:
                continue
            for manuscript in feature.get("manuscripts") or []:
                samples = manuscript.get("samples") or []
                if not samples:
                    samples = [{"image": image} for image in manuscript.get("images") or []]
                for index, sample in enumerate(samples, start=1):
                    row = {
                        "crop_id": f"{scribe_slug}::{manuscript.get('slug', '')}::{grapheme_key}::{index}",
                        "scribe_id": profile.get("scribe_id"),
                        "scribe_slug": scribe_slug,
                        "scribe_title": profile.get("title"),
                        "scribe_url": f"/scribes/{scribe_slug}/",
                        "person_url": metadata.get("database_url"),
                        "gender": (metadata.get("person") or {}).get("gender"),
                        "religious_or_lay_status": metadata.get("religious_or_lay_status"),
                        "date": metadata.get("date"),
                        "century": metadata.get("century"),
                        "place": metadata.get("place"),
                        "script": metadata.get("script"),
                        "scripts": metadata.get("scripts"),
                        "grapheme": grapheme,
                        "grapheme_key": grapheme_key,
                        "manuscript_title": manuscript.get("title"),
                        "manuscript_slug": manuscript.get("slug"),
                        "manuscript_url": manuscript.get("database_url"),
                        "viewer_url": manuscript.get("viewer_url"),
                        "image": sample.get("image"),
                        "canvas": sample.get("canvas"),
                        "xywh": sample.get("xywh"),
                        "alto_xywh": sample.get("alto_xywh"),
                        "page_index": sample.get("page_index"),
                        "source": sample.get("source"),
                        "coordinate_level": sample.get("coordinate_level"),
                        "quality": sample.get("quality"),
                        "ink_density": sample.get("ink_density"),
                        "segmentation_mismatch": sample.get("segmentation_mismatch"),
                    }
                    rows.append(row)
    return rows


def write_outputs(rows):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema": "unknownhands.scribal_fingerprint_crops.v1",
        "count": len(rows),
        "rows": rows,
    }
    JSON_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")

    fieldnames = list(rows[0].keys()) if rows else []
    with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow({key: csv_value(value) for key, value in row.items()})


def main():
    rows = export_rows()
    write_outputs(rows)
    print(f"Wrote {len(rows)} crop records to {JSON_PATH} and {CSV_PATH}.")


if __name__ == "__main__":
    main()
