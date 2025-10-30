#!/usr/bin/env python3
import json, os, re, sys
from pathlib import Path
from lxml import etree

# ---------- CONFIG YOU MAY CUSTOMIZE ----------
# switch between "line" and "word" granularity
GRANULARITY = "line"   # or "word"
# ---------------------------------------------

NS = {"pc": "http://schema.primaresearch.org/PAGE/gts/pagecontent/2019-07-15"}

def xywh_from_coords(coords_str):
    # PAGE XML points: "x,y x,y x,y ..."
    pts = []
    for pair in coords_str.split():
        x,y = pair.split(',')
        pts.append((int(float(x)), int(float(y))))
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    x = min(xs); y = min(ys); w = max(xs) - x; h = max(ys) - y
    return f"{x},{y},{w},{h}"

def text_of(node):
    # Prefer UnicodeText if present; fallback to plain TextEquiv/Text
    t = node.find(".//pc:TextEquiv/pc:Unicode", NS)
    if t is not None and (t.text or "").strip():
        return t.text.strip()
    t2 = node.find(".//pc:TextEquiv/pc:PlainText", NS)
    return (t2.text.strip() if t2 is not None and t2.text else "")

def items_from_pagexml(xml_path, canvas_id):
    root = etree.parse(str(xml_path)).getroot()
    annos = []
    seq = 0

    if GRANULARITY == "line":
        xpath = ".//pc:TextLine"
    else:
        xpath = ".//pc:Word"

    for node in root.findall(xpath, NS):
        coords = node.find("./pc:Coords", NS)
        if coords is None or not coords.get("points"): 
            continue
        xywh = xywh_from_coords(coords.get("points"))
        txt = text_of(node)
        if not txt:
            continue
        seq += 1
        annos.append({
          "id": f"{canvas_id}#anno-{seq}",
          "type": "Annotation",
          "motivation": "supplementing",
          "body": { "type": "TextualBody", "value": txt, "format": "text/plain" },
          "target": {
            "source": canvas_id,
            "selector": { "type": "FragmentSelector", "value": f"xywh={xywh}" }
          }
        })
    return annos

def load_manifest_canvases(manifest_json):
    canvases = []
    # IIIF v3: manif["items"] -> canvases; canvas["id"]
    for cv in manifest_json.get("items", []):
        cid = cv.get("id")
        if cid: canvases.append(cid)
    return canvases

def main(manifest_id, pagexml_dir, out_dir, manifest_key):
    out_dir = Path(out_dir); out_dir.mkdir(parents=True, exist_ok=True)
    # Create per-MS subdir: /data/annos/<manifest_key>/
    ms_dir = out_dir / manifest_key
    ms_dir.mkdir(exist_ok=True)

    # We need the canvas IDs in order. Fetch/require manifest JSON locally or pre-saved:
    # Easiest: user provides a local copy at scripts/tmp/<manifest_key>.json
    manifest_local = Path(__file__).parent / "tmp" / f"{manifest_key}.json"
    if not manifest_local.exists():
        print(f"ERROR: Put a copy of manifest JSON at {manifest_local}")
        sys.exit(2)
    manif = json.loads(manifest_local.read_text())
    canvases = load_manifest_canvases(manif)
    if not canvases:
        print("ERROR: No canvases found in manifest JSON")
        sys.exit(2)

    # Sort pagexml files by name, assume 1:1 with canvases
    px_files = sorted(Path(pagexml_dir).glob("*.xml"))
    if not px_files:
        print("ERROR: No PAGE-XML files found")
        sys.exit(2)

    count = min(len(px_files), len(canvases))
    mapping = { "manifest": manifest_id, "items": [] }

    for i in range(count):
        px = px_files[i]
        canvas_id = canvases[i]
        items = items_from_pagexml(px, canvas_id)
        ap = {
          "id": f"{ms_dir.as_posix()}/p{i+1}.ap.json",  # final public URL will be site baseurl + this path
          "type": "AnnotationPage",
          "items": items
        }
        ap_path = ms_dir / f"p{i+1}.ap.json"
        ap_path.write_text(json.dumps(ap, ensure_ascii=False, indent=2))
        mapping["items"].append({ "canvas": canvas_id, "annotationPage": f"/data/annos/{manifest_key}/p{i+1}.ap.json" })

    # Write mapping file for the manuscript:
    map_path = ms_dir / "mapping.json"
    map_path.write_text(json.dumps(mapping, ensure_ascii=False, indent=2))
    print(f"Wrote {count} annotation pages and mapping at {map_path}")

if __name__ == "__main__":
    # Usage:
    # python scripts/pagexml_to_iiif.py <manifest_url> <pagexml_dir> <out_dir> <manifest_key>
    if len(sys.argv) != 5:
        print("Usage: pagexml_to_iiif.py MANIFEST_URL PAGEXML_DIR OUT_DIR MANIFEST_KEY")
        print("Example: pagexml_to_iiif.py https://iiif.example/manifest.json ./exports/sg-262 ./data/annos sg-262")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])