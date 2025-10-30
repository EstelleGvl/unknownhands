#!/usr/bin/env python3
import csv, os, re, json, yaml, sys

# Usage: python3 scripts/setup_manuscripts.py data/manuscripts.csv

if len(sys.argv) != 2:
    print("Usage: setup_manuscripts.py <path/to/manuscripts.csv>")
    sys.exit(1)

csv_path = sys.argv[1]
annos_root = "data/annos"
yaml_path = "data/manifests.yml"

os.makedirs(annos_root, exist_ok=True)

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text

entries = []
with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        title = row["Title"].strip()
        call = row["Call number"].strip()
        date = row["Date (Ms Dating)"].strip() if "Date (Ms Dating)" in row else row.get("Date","").strip()
        manifest = row["IIIF Manifest Link(s)"].strip()
        if not manifest:
            continue

        slug = slugify(call or title)
        annos_dir = os.path.join(annos_root, slug)
        os.makedirs(annos_dir, exist_ok=True)

        # Create a dummy mapping.json if not exists
        mapping_path = os.path.join(annos_dir, "mapping.json")
        if not os.path.exists(mapping_path):
            dummy = { "type": "Mapping", "items": [] }
            with open(mapping_path, "w", encoding="utf-8") as out:
                json.dump(dummy, out, ensure_ascii=False, indent=2)

        entries.append({
            "slug": slug,
            "title": title,
            "call_number": call,
            "date": date,
            "manifest": manifest,
            "annos": f"/data/annos/{slug}/mapping.json"
        })

# Write YAML registry
with open(yaml_path, "w", encoding="utf-8") as out:
    yaml.dump(entries, out, sort_keys=False, allow_unicode=True)

print(f"✅ Created/updated {len(entries)} entries in {yaml_path}")
print(f"✅ Annotation folders at {annos_root}/<slug>/")