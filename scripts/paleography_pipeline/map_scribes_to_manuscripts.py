import os
import json

HEURIST_DIR = "data/heurist"
OUT_DIR = "data/paleography"

os.makedirs(OUT_DIR, exist_ok=True)

def load_json(name):
    path = os.path.join(HEURIST_DIR, name)
    if not os.path.exists(path):
        return None
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Failed to load {path}: {e}")
        return None

scribal_units = load_json('scribal_units.json') or []
manuscripts = load_json('manuscripts.json') or []
relationships = load_json('relationships.json') or []

# Build index by rec_ID or id
def index_by_id(records):
    idx = {}
    for r in records:
        if isinstance(r, dict):
            rid = r.get('rec_ID') or r.get('id') or r.get('ID') or r.get('id')
            if not rid:
                # try nested
                for k in ('id','@id'):
                    if k in r:
                        rid = r[k]
                        break
            if rid:
                idx[str(rid)] = r
    return idx

scribes_idx = index_by_id(scribal_units)
ms_idx = index_by_id(manuscripts)

# Relationship records vary; try to detect fields
mappings = {}

for rel in relationships:
    if not isinstance(rel, dict):
        continue
    # common heurist relation fields: rec_FromID, rec_ToID, rec_RecTypeID
    from_id = rel.get('rec_FromID') or rel.get('from') or rel.get('src') or rel.get('source')
    to_id = rel.get('rec_ToID') or rel.get('to') or rel.get('dst') or rel.get('target')
    rtype = rel.get('rec_RecTypeID') or rel.get('rec_RelTypeID') or rel.get('relType') or rel.get('relationType')
    if not from_id or not to_id:
        # try alternate naming
        if 'src' in rel and 'dst' in rel:
            from_id = rel['src']; to_id = rel['dst']
    if not from_id or not to_id:
        continue
    from_id = str(from_id); to_id = str(to_id)
    # if either endpoint is a scribal unit and the other is a manuscript, map them
    if from_id in scribes_idx and to_id in ms_idx:
        mappings.setdefault(from_id, set()).add(to_id)
    elif to_id in scribes_idx and from_id in ms_idx:
        mappings.setdefault(to_id, set()).add(from_id)
    else:
        # also consider production unit -> manuscript -> scribal unit chains later
        pass

# stringify sets
mappings_clean = {k: list(v) for k, v in mappings.items()}
out_path = os.path.join(OUT_DIR, 'scribe_to_manuscript.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump({
        'mappings': mappings_clean,
        'scribes_count': len(scribes_idx),
        'manuscripts_count': len(ms_idx),
    }, f, indent=2)

print(f"Wrote mapping to {out_path}; {len(mappings_clean)} scribes mapped.")
