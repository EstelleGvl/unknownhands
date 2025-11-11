import json, os, sys, re, unicodedata

ROOT = os.path.dirname(os.path.dirname(__file__))  # repo root
DATA = os.path.join(ROOT, "data", "annos")

def norm(s):
    if not s: return ""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    return s

def fetch_manifest_title(manifest_url, timeout=10):
    """Fetch title from IIIF manifest URL"""
    if not manifest_url or not manifest_url.startswith("http"):
        return ""
    try:
        import requests
        r = requests.get(manifest_url, timeout=timeout)
        r.raise_for_status()
        data = r.json()
        label = data.get("label", "")
        # Handle IIIF v3 format (dict with language keys)
        if isinstance(label, dict):
            # Get first language's first value
            for lang_values in label.values():
                if isinstance(lang_values, list) and lang_values:
                    return lang_values[0]
                return str(lang_values)
        # Handle IIIF v2 format (string)
        elif isinstance(label, str):
            return label
        return ""
    except Exception as e:
        print(f"  Warning: Could not fetch title from {manifest_url}: {e}")
        return ""

docs = []      # [{id, slug, title, canvas, line_id, text, text_norm}]
manus = []     # [{slug, title}]

# read manifests.yml once (optional, for titles)
title_lookup = {}
try:
    import yaml
    # Fixed path: was "_data", now "data"
    ypath = os.path.join(ROOT, "data", "manifests.yml")
    if os.path.exists(ypath):
        for m in yaml.safe_load(open(ypath)):
            title_lookup[m["slug"]] = m.get("title","")
        print(f"Loaded {len(title_lookup)} titles from manifests.yml")
except Exception as e:
    print(f"Could not load manifests.yml: {e}")
    pass

for slug in sorted(os.listdir(DATA)):
    base = os.path.join(DATA, slug)
    if not os.path.isdir(base): continue
    map_path = os.path.join(base, "mapping.json")
    if not os.path.exists(map_path): continue

    mapping = json.load(open(map_path))
    items = mapping.get("items", [])
    
    # Try to get title (priority order):
    # 1. From manifests.yml
    title = title_lookup.get(slug, "")
    
    # 2. If not found, try fetching from manifest URL
    if not title:
        manifest_url = mapping.get("manifest", "")
        if manifest_url:
            # Fix local paths to proper IRHT URLs
            if manifest_url.startswith("scripts/tmp/") and slug.startswith("irht-"):
                ark_id = slug.replace("irht-", "")
                manifest_url = f"https://api.irht.cnrs.fr/ark:/63955/{ark_id}/manifest.json"
            
            # Fetch title from manifest
            if manifest_url.startswith("http"):
                title = fetch_manifest_title(manifest_url)
                if title:
                    print(f"  {slug}: fetched title from manifest")
    
    # 3. Fallback to slug if still no title
    if not title:
        title = slug
        print(f"  {slug}: using slug as title (no manifest title found)")
    
    manus.append({"slug": slug, "title": title})

    # index each annotation page
    for page_idx, it in enumerate(items):
        canvas = it.get("canvas","")
        ap_rel = it.get("annotationPage","")
        ap_path = os.path.join(base, os.path.basename(ap_rel))
        if not os.path.exists(ap_path): continue
        ap = json.load(open(ap_path))
        for i, ann in enumerate(ap.get("items", [])):
            txt = (ann.get("body", {}) or {}).get("value", "") if isinstance(ann.get("body"), dict) \
                  else (ann.get("body",[{}])[0].get("value","") if isinstance(ann.get("body"), list) else "")
            if not txt: continue
            line_id = f"line-{i}"
            docs.append({
                "id": f"{slug}::{page_idx}::{i}",
                "slug": slug,
                "title": title,  # Use the title we already determined for this manuscript
                "canvas": canvas,
                "line_id": line_id,
                "text": txt,
                "text_norm": norm(txt)
            })

OUTDIR = os.path.join(ROOT, "assets", "search")
os.makedirs(OUTDIR, exist_ok=True)
with open(os.path.join(OUTDIR, "transcriptions.json"), "w", encoding="utf-8") as f:
    json.dump({"docs": docs, "manuscripts": manus}, f, ensure_ascii=False)
print(f"Wrote {len(docs)} lines to assets/search/transcriptions.json")