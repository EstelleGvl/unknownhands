import json, os, re, unicodedata
from pathlib import Path
from lxml import etree

ROOT = os.path.dirname(os.path.dirname(__file__))  # repo root
DATA = os.path.join(ROOT, "data", "annos")
ALTO = os.path.join(ROOT, "exports", "alto")
ALTO_NS = {"alto": "http://www.loc.gov/standards/alto/ns-v4#"}

def norm(s):
    if not s: return ""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    return s

def natural_key(path):
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", Path(path).name)]

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

def docs_from_alto_folder(slug, title):
    docs = []
    folder = Path(ALTO) / slug
    if not folder.is_dir():
        return docs
    xml_files = sorted(
        [path for path in folder.glob("*.xml") if path.name.lower() != "mets.xml"],
        key=natural_key,
    )
    for page_idx, xml_path in enumerate(xml_files):
        try:
            root = etree.parse(str(xml_path)).getroot()
        except Exception as exc:
            print(f"  Warning: Could not parse {xml_path}: {exc}")
            continue
        line_idx = 0
        for line in root.findall(".//alto:TextLine", ALTO_NS):
            txt = alto_line_text(line)
            if not txt:
                continue
            line_id = line.get("ID") or f"line-{line_idx}"
            docs.append({
                "id": f"{slug}::{page_idx}::{line_idx}",
                "slug": slug,
                "title": title,
                "canvas": "",
                "line_id": line_id,
                "text": txt,
                "text_norm": norm(txt),
                "source": "alto",
            })
            line_idx += 1
    return docs

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
            title = m.get("title", "")
            slug = m["slug"]
            title_lookup[slug] = title
        print(f"Loaded {len(title_lookup)} titles from manifests.yml")
except Exception as e:
    print(f"Could not load manifests.yml: {e}")
    pass

indexed_slugs = set()

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
            # Fetch title from manifest
            if manifest_url.startswith("http"):
                title = fetch_manifest_title(manifest_url)
                if title:
                    print(f"  {slug}: fetched title from manifest")
    
    # 3. Fallback to slug if still no title
    if not title:
        title = slug
        print(f"  {slug}: using slug as title (no manifest title found)")
    
    before_doc_count = len(docs)
    indexed_slugs.add(slug)

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
                "text_norm": norm(txt),
                "source": "iiif-annotation",
            })
    if len(docs) > before_doc_count:
        manus.append({"slug": slug, "title": title})
    else:
        print(f"  {slug}: no searchable transcription lines found, skipping corpus manuscript entry")

if os.path.isdir(ALTO):
    for slug in sorted(os.listdir(ALTO)):
        if slug in indexed_slugs:
            continue
        folder = os.path.join(ALTO, slug)
        if not os.path.isdir(folder):
            continue
        if not any(name.lower().endswith(".xml") and name.lower() != "mets.xml" for name in os.listdir(folder)):
            continue
        title = title_lookup.get(slug, slug)
        alto_docs = docs_from_alto_folder(slug, title)
        if not alto_docs:
            continue
        print(f"  {slug}: indexed {len(alto_docs)} ALTO-only lines without IIIF annotation mapping")
        manus.append({"slug": slug, "title": title})
        docs.extend(alto_docs)
        indexed_slugs.add(slug)

OUTDIR = os.path.join(ROOT, "assets", "search")
os.makedirs(OUTDIR, exist_ok=True)
with open(os.path.join(OUTDIR, "transcriptions.json"), "w", encoding="utf-8") as f:
    json.dump({"docs": docs, "manuscripts": manus}, f, ensure_ascii=False)
print(f"Wrote {len(docs)} lines to assets/search/transcriptions.json")
