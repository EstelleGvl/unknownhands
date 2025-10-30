#!/usr/bin/env python3
import json, os, re, sys
from pathlib import Path
from lxml import etree
from urllib.parse import urlparse
import requests

# ---------- CONFIG YOU MAY CUSTOMIZE ----------
# switch between "line" and "word" granularity
GRANULARITY = "line"   # or "word"
# ---------------------------------------------

NS = {"pc": "http://schema.primaresearch.org/PAGE/gts/pagecontent/2019-07-15"}

def xywh_from_coords(coords_str):
    # PAGE XML points: "x,y x,y x,y ..."
    pts = []
    for pair in coords_str.split():
        x, y = pair.split(',')
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
    xpath = ".//pc:TextLine" if GRANULARITY == "line" else ".//pc:Word"

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

# ---------------- IIIF helpers ----------------

def _is_url(s: str) -> bool:
    try:
        return urlparse(s).scheme in ("http", "https")
    except Exception:
        return False

def _read_json(path_or_url):
    if _is_url(path_or_url):
        r = requests.get(path_or_url, timeout=40)
        r.raise_for_status()
        return r.json()
    with open(path_or_url, "r", encoding="utf-8") as f:
        return json.load(f)

def load_manifest_canvases(path_or_url):
    """
    Return a list of canvas IDs (strings), working with IIIF v2 or v3.
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
                    canvases.append(cid)
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
                    canvases.append(cid)
        if canvases:
            print(f"Detected IIIF v3 manifest — {len(canvases)} canvases.")
            return canvases

    raise RuntimeError("No canvases found in manifest JSON")

# ---------------- main pipeline ----------------

def main(manifest_ref, pagexml_dir, out_dir, manifest_key):
    out_dir = Path(out_dir); out_dir.mkdir(parents=True, exist_ok=True)

    # /data/annos/<manifest_key>/
    ms_dir = out_dir / manifest_key
    ms_dir.mkdir(parents=True, exist_ok=True)

    # Fetch canvases from URL or local JSON path
    try:
        canvases = load_manifest_canvases(manifest_ref)
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(2)

    # Collect PAGE-XMLs
    px_files = sorted(Path(pagexml_dir).glob("*.xml"))
    if not px_files:
        print("ERROR: No PAGE-XML files found in", pagexml_dir)
        sys.exit(2)

    if len(px_files) != len(canvases):
        print(f"WARNING: {len(px_files)} PAGE-XML files vs {len(canvases)} canvases — will align by index and use the min of both.")

    count = min(len(px_files), len(canvases))
    mapping = { "manifest": manifest_ref, "items": [] }

    for i in range(count):
        px = px_files[i]
        canvas_id = canvases[i]
        items = items_from_pagexml(px, canvas_id)

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
            "annotationPage": f"/data/annos/{manifest_key}/p{i+1}.ap.json"
        })

        if (i+1) % 25 == 0 or i == count-1:
            print(f"  Wrote {i+1}/{count} pages…")

    # mapping.json
    map_path = ms_dir / "mapping.json"
    map_path.write_text(json.dumps(mapping, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Done. Wrote {count} annotation pages and mapping at {map_path}")

if __name__ == "__main__":
    # Usage:
    # python scripts/pagexml_to_iiif.py <manifest_url_or_file> <pagexml_dir> <out_dir> <manifest_key>
    if len(sys.argv) != 5:
        print("Usage: pagexml_to_iiif.py MANIFEST_URL_OR_FILE PAGEXML_DIR OUT_DIR MANIFEST_KEY")
        print("Example:")
        print("  pagexml_to_iiif.py https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json ./exports/irht-fr1dgmfio4zw ./data/annos irht-fr1dgmfio4zw")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])