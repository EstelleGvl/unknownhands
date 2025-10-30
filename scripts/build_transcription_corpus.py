import json, os, sys, re, unicodedata

ROOT = os.path.dirname(os.path.dirname(__file__))  # repo root
DATA = os.path.join(ROOT, "data", "annos")

def norm(s):
    if not s: return ""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    return s

docs = []      # [{id, slug, title, canvas, line_id, text, text_norm}]
manus = []     # [{slug, title}]

# read manifests.yml once (optional, for titles)
title_lookup = {}
try:
    import yaml
    ypath = os.path.join(ROOT, "_data", "manifests.yml")
    if os.path.exists(ypath):
        for m in yaml.safe_load(open(ypath)):
            title_lookup[m["slug"]] = m.get("title","")
except Exception:
    pass

for slug in sorted(os.listdir(DATA)):
    base = os.path.join(DATA, slug)
    if not os.path.isdir(base): continue
    map_path = os.path.join(base, "mapping.json")
    if not os.path.exists(map_path): continue

    mapping = json.load(open(map_path))
    items = mapping.get("items", [])
    manus.append({"slug": slug, "title": title_lookup.get(slug, slug)})

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
                "title": title_lookup.get(slug, slug),
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