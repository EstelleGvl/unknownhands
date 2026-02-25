import json
import os

def analyze_entity(filepath, entity_name):
    """Analyze a Heurist entity file and extract all field information"""
    with open(filepath) as f:
        data = json.load(f)
    
    if 'heurist' not in data or 'records' not in data['heurist']:
        return None
    
    records = data['heurist']['records']
    if not records:
        return None
    
    # Collect all unique fields across all records
    all_fields = {}
    
    for record in records[:50]:  # Sample first 50 records
        for detail in record.get('details', []):
            field_name = detail.get('fieldName', 'UNKNOWN')
            field_type = detail.get('fieldType', 'UNKNOWN')
            
            if field_name not in all_fields:
                all_fields[field_name] = {
                    'type': field_type,
                    'examples': []
                }
            
            # Collect example values
            if len(all_fields[field_name]['examples']) < 3:
                val = detail.get('value', detail.get('termLabel', 'N/A'))
                if isinstance(val, dict):
                    val = str(val)[:100]
                elif isinstance(val, str):
                    val = val[:100]
                all_fields[field_name]['examples'].append(val)
    
    return {
        'entity': entity_name,
        'total_records': len(records),
        'fields': all_fields
    }

# Analyze all entity files
entities = {
    'manuscripts': 'assets/data/manuscripts.json',
    'production_units': 'assets/data/production_units.json',
    'scribal_units': 'assets/data/scribal_units.json',
    'texts': 'assets/data/texts.json',
    'historical_people': 'assets/data/historical_people.json',
    'holding_institutions': 'assets/data/holding_institutions.json',
    'monastic_institutions': 'assets/data/monastic_institutions.json',
    'relationships': 'assets/data/relationships.json'
}

results = {}
for name, path in entities.items():
    if os.path.exists(path):
        print(f"Analyzing {name}...")
        results[name] = analyze_entity(path, name)
    else:
        print(f"⚠️  {name} not found at {path}")

# Output comprehensive report
with open('DATA_MODEL_COMPLETE.md', 'w') as f:
    f.write("# Complete Heurist Database Structure Analysis\n\n")
    f.write("Generated: 2026-02-24\n\n")
    f.write("## Summary\n\n")
    
    for name, data in results.items():
        if data:
            f.write(f"- **{name}**: {data['total_records']} records, {len(data['fields'])} fields\n")
    
    f.write("\n---\n\n")
    
    # Detailed field information for each entity
    for name, data in results.items():
        if not data:
            continue
            
        f.write(f"## {data['entity'].upper().replace('_', ' ')}\n\n")
        f.write(f"**Total Records:** {data['total_records']}\n\n")
        f.write(f"**Fields:** {len(data['fields'])}\n\n")
        
        # Sort fields alphabetically
        sorted_fields = sorted(data['fields'].items())
        
        f.write("| Field Name | Type | Example Values |\n")
        f.write("|------------|------|----------------|\n")
        
        for field_name, field_info in sorted_fields:
            field_type = field_info['type']
            examples = ' • '.join([str(ex) for ex in field_info['examples'][:2]])
            f.write(f"| {field_name} | {field_type} | {examples} |\n")
        
        f.write("\n")

print("\n✅ Analysis complete! See DATA_MODEL_COMPLETE.md")
