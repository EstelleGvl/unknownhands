import json

with open('_site/assets/data/production_units.json') as f:
    data = json.load(f)

# Look at first production unit
pu = data['heurist']['records'][0]
print("=== First Production Unit ===")
print(f"ID: {pu['rec_ID']}")
print(f"Title: {pu['rec_Title'][:120]}")
print("\nFields:")
for d in pu['details']:
    fname = d.get('fieldName', 'unknown')
    ftype = d.get('fieldType', 'unknown')
    if ftype == 'resource':
        val = d.get('value', {})
        print(f"  - {fname} (resource): type={val.get('type')}, title={val.get('title', '')[:50]}")
    elif d.get('value'):
        print(f"  - {fname} ({ftype})")

# Count PUs with manuscript references
print("\n=== Checking all Production Units for Manuscript refs ===")
with_ms = 0
without_ms = 0
sample_titles = []

for pu in data['heurist']['records']:
    has_ms = False
    for d in pu.get('details', []):
        if d.get('fieldType') == 'resource':
            val = d.get('value', {})
            if val.get('type') == '118':  # Manuscript type
                has_ms = True
                if len(sample_titles) < 3:
                    sample_titles.append({
                        'field': d.get('fieldName'),
                        'ms_title': val.get('title', '')[:60],
                        'pu_title': pu['rec_Title'][:60]
                    })
                break
    
    if has_ms:
        with_ms += 1
    else:
        without_ms += 1

print(f"Production Units WITH manuscript refs: {with_ms}")
print(f"Production Units WITHOUT manuscript refs: {without_ms}")

if sample_titles:
    print("\nSample PU->MS connections:")
    for s in sample_titles:
        print(f"  Field '{s['field']}'")
        print(f"    PU: {s['pu_title']}")
        print(f"    MS: {s['ms_title']}")
