#!/usr/bin/env python3
import csv, os, re, json, sys

if len(sys.argv) != 2:
    print("Usage: setup_manuscripts.py <path/to/manuscripts.csv>")
    sys.exit(1)

csv_path = sys.argv[1]
annos_root = "data/annos"
alto_root = "exports/alto"
yaml_path = "data/manifests.yml"
manifest_annos_map_path = "data/manifest-annos-map.json"

os.makedirs(annos_root, exist_ok=True)
os.makedirs(alto_root, exist_ok=True)

def slugify_id(text):
    text = (text or "").lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text or "unknown"

def first_value(row, names):
    for name in names:
        value = row.get(name)
        if value is not None and str(value).strip():
            return str(value).strip()
    return ""

def write_simple_yaml(path, rows):
    with open(path, "w", encoding="utf-8") as out:
        for row in rows:
            out.write("-")
            first = True
            for key, value in row.items():
                if value is None or value == "":
                    continue
                serialized = json.dumps(str(value), ensure_ascii=False)
                if first:
                    out.write(f" {key}: {serialized}\n")
                    first = False
                else:
                    out.write(f"  {key}: {serialized}\n")

entries = []
manifest_annos_map = {}

with open(csv_path, newline='', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:
        heurist_id = first_value(row, ["Manuscript H-ID", "rec_ID", "Heurist ID", "Manuscript ID"])
        title = first_value(row, ["Manuscript Record Title", "Title", "rec_Title"])
        call = first_value(row, ["Call number", "Call Number", "Shelfmark"])
        date = first_value(row, ["Date (Ms Dating)", "Date", "Dating"])
        manifest = first_value(row, ["IIIF Manifest Link(s)", "IIIF Manifest", "Manifest"])
        holding_id = first_value(row, ["Holding Institution H-ID", "Holding Institution ID"])
        holding_title = first_value(row, ["Holding Institution Record Title", "Holding Institution", "Institution"])
        if not manifest:
            continue
        if not heurist_id:
            print(f"Skipping row without Heurist ID: {title or call or manifest}")
            continue

        slug = f"ms-{slugify_id(heurist_id)}"
        annos_dir = os.path.join(annos_root, slug)
        alto_dir = os.path.join(alto_root, slug)
        os.makedirs(alto_dir, exist_ok=True)

        annos = f"/data/annos/{slug}/mapping.json"
        entry = {
            "slug": slug,
            "heurist_id": heurist_id,
            "title": title,
            "call_number": call,
            "date": date,
            "manifest": manifest,
            "annos": annos,
            "alto": f"/exports/alto/{slug}/",
        }
        if holding_id:
            entry["holding_institution_id"] = holding_id
        if holding_title:
            entry["holding_institution"] = holding_title

        entries.append(entry)

        if os.path.exists(os.path.join(annos_dir, "mapping.json")):
            manifest_annos_map[manifest] = annos

write_simple_yaml(yaml_path, entries)

with open(manifest_annos_map_path, "w", encoding="utf-8") as out:
    json.dump(manifest_annos_map, out, ensure_ascii=False, indent=2)

print(f"Created/updated {len(entries)} entries in {yaml_path}")
print(f"Created ALTO drop folders at {alto_root}/ms-<HeuristID>/")
print(f"Mapped {len(manifest_annos_map)} manifests with existing annotation mappings in {manifest_annos_map_path}")
