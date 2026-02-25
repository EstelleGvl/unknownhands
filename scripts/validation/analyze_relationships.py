import json

with open('_site/assets/data/relationships.json') as f:
    data = json.load(f)

print(f"Total relationships: {len(data['heurist']['records'])}\n")

# Count relationships by type combination
type_combos = {}
pu_ms_relationships = []

for rel in data['heurist']['records']:
    details = rel.get('details', [])
    source = next((d['value'] for d in details if d['fieldName'] == 'Source record'), None)
    target = next((d['value'] for d in details if d['fieldName'] == 'Target record'), None)
    
    if source and target:
        source_type = source.get('type', 'unknown')
        target_type = target.get('type', 'unknown')
        combo = f"{source_type} -> {target_type}"
        type_combos[combo] = type_combos.get(combo, 0) + 1
        
        # Track Production Unit (116) to Manuscript (118) relationships
        if source_type == '116' and target_type == '118':
            rel_type = next((d.get('termLabel', '') for d in details if d['fieldName'] == 'Relationship type'), '')
            pu_ms_relationships.append({
                'pu_id': source['id'],
                'ms_id': target['id'],
                'rel_type': rel_type
            })

print("Relationship type combinations:")
for combo, count in sorted(type_combos.items(), key=lambda x: -x[1])[:15]:
    print(f"  {combo}: {count}")

print(f"\nProduction Unit (116) -> Manuscript (118): {len(pu_ms_relationships)}")

# Check if there are production units NOT linked to manuscripts
with open('_site/assets/data/production_units.json') as f:
    pu_data = json.load(f)
    total_pus = len(pu_data['heurist']['records'])
    linked_pu_ids = set(rel['pu_id'] for rel in pu_ms_relationships)
    print(f"Total Production Units: {total_pus}")
    print(f"Production Units linked to Manuscripts: {len(linked_pu_ids)}")
    print(f"Production Units NOT linked: {total_pus - len(linked_pu_ids)}")
