import os
import json
import yaml

MAPPING_FILE = "data/paleography/scribe_to_manuscript.json"
SCRIBES_DIR = "_scribes"
MANIFESTS_YML = "data/manifests.yml"

if not os.path.exists(MAPPING_FILE):
    print("Mapping file not found; run map_scribes_to_manuscripts.py first")
    raise SystemExit(1)

with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
    mapping = json.load(f)

mappings = mapping.get('mappings', {})

# load manifest slug/title map
ms_titles = {}
if os.path.exists(MANIFESTS_YML):
    try:
        with open(MANIFESTS_YML, 'r', encoding='utf-8') as f:
            import yaml as _yaml
            manifests = _yaml.safe_load(f) or []
            for m in manifests:
                slug = m.get('slug')
                title = m.get('title')
                if slug and title:
                    ms_titles[slug] = title
    except Exception:
        pass

for fname in os.listdir(SCRIBES_DIR):
    if not fname.endswith('.md'):
        continue
    path = os.path.join(SCRIBES_DIR, fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # parse frontmatter
    if not content.startswith('---'):
        continue
    parts = content.split('---')
    if len(parts) < 3:
        continue
    fm_raw = parts[1]
    body = '---'.join(parts[2:])
    try:
        fm = yaml.safe_load(fm_raw) or {}
    except Exception:
        fm = {}
    # derive folder/name to try to match mapping key
    key = os.path.splitext(fname)[0]
    # try to find scribe mapping by folder name
    scribe_ids = [k for k in mappings.keys() if k.endswith(key) or k == key]
    if not scribe_ids:
        # also try numeric keys
        if key in mappings:
            scribe_ids = [key]
    if scribe_ids:
        scribe_id = scribe_ids[0]
        fm['scribe_id'] = scribe_id
        # attach manuscripts list
        ms_list = mappings.get(scribe_id, [])
        fm['manuscripts'] = []
        for msid in ms_list:
            title = ms_titles.get(msid, f"Manuscript {msid}")
            fm['manuscripts'].append({'id': msid, 'title': title})
        # write back
        new_fm = yaml.dump(fm, sort_keys=False, allow_unicode=True)
        new_content = '---\n' + new_fm + '---\n' + body.lstrip('\n')
        with open(path, 'w', encoding='utf-8') as out:
            out.write(new_content)
        print(f"Updated {fname} with scribe_id {scribe_id} and {len(ms_list)} manuscripts")
    else:
        print(f"No mapping found for {fname}; skipped")
