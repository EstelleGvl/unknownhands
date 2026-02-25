import json

with open('_site/assets/data/production_units.json') as f:
    data = json.load(f)

has_colophon = 0
has_manuscript = 0
has_both = 0
has_colophon_no_ms = 0

for pu in data['heurist']['records']:
    details = pu.get('details', [])
    
    # Check for colophon (flag OR text)
    has_colo = any(
        (d.get('fieldName') == 'Colophon Presence' and str(d.get('value')) == '5444') or
        (d.get('fieldName') == 'Colophon transcription' and d.get('value') and str(d.get('value')).strip())
        for d in details
    )
    
    # Check for manuscript reference
    has_ms = any(
        d.get('fieldName') == 'Manuscript' and d.get('fieldType') == 'resource' and d.get('value', {}).get('type') == '118'
        for d in details
    )
    
    if has_colo:
        has_colophon += 1
    if has_ms:
        has_manuscript += 1
    if has_colo and has_ms:
        has_both += 1
    if has_colo and not has_ms:
        has_colophon_no_ms += 1

print(f"Total Production Units: {len(data['heurist']['records'])}")
print(f"\nProduction Units with colophon: {has_colophon}")
print(f"Production Units with manuscript ref: {has_manuscript}")
print(f"Production Units with BOTH colophon AND manuscript: {has_both}")
print(f"Production Units with colophon but NO manuscript: {has_colophon_no_ms}")
