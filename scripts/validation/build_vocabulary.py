import json
import os

def extract_vocabulary():
    """Extract all term ID → label mappings from Heurist data"""
    
    vocab = {}  # term_id → label
    field_vocab = {}  # fieldName → {term_id → label}
    
    entity_files = [
        'assets/data/manuscripts.json',
        'assets/data/production_units.json',
        'assets/data/scribal_units.json',
        'assets/data/texts.json',
        'assets/data/historical_people.json',
        'assets/data/holding_institutions.json',
        'assets/data/monastic_institutions.json',
        'assets/data/relationships.json'
    ]
    
    for filepath in entity_files:
        if not os.path.exists(filepath):
            continue
            
        print(f"Processing {filepath}...")
        with open(filepath) as f:
            data = json.load(f)
        
        records = data.get('heurist', {}).get('records', [])
        
        for record in records:
            for detail in record.get('details', []):
                field_type = detail.get('fieldType')
                
                # Enum fields have term IDs with labels
                if field_type == 'enum':
                    term_id = str(detail.get('value', ''))
                    term_label = detail.get('termLabel', '')
                    field_name = detail.get('fieldName', '')
                    
                    if term_id and term_label:
                        # Global vocabulary
                        if term_id not in vocab:
                            vocab[term_id] = term_label
                        
                        # Field-specific vocabulary
                        if field_name not in field_vocab:
                            field_vocab[field_name] = {}
                        field_vocab[field_name][term_id] = term_label
    
    print(f"\n✅ Extracted {len(vocab)} unique terms")
    print(f"✅ Mapped {len(field_vocab)} fields")
    
    return vocab, field_vocab

vocab, field_vocab = extract_vocabulary()

# Save for inspection
output = {
    'vocabulary': vocab,
    'field_vocabularies': field_vocab
}

with open('vocabulary.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("\n📝 Saved to vocabulary.json")

# Show some examples
print("\n=== SAMPLE TERMS ===")
for term_id, label in list(vocab.items())[:20]:
    print(f"{term_id}: {label}")

print("\n=== CENTURY TERMS ===")
if 'Normalized century of production' in field_vocab:
    for term_id, label in field_vocab['Normalized century of production'].items():
        print(f"{term_id}: {label}")

print("\n=== CITY TERMS (first 20) ===")
if 'PU City' in field_vocab:
    for term_id, label in list(field_vocab['PU City'].items())[:20]:
        print(f"{term_id}: {label}")

print("\n=== COUNTRY TERMS ===")
if 'PU country' in field_vocab:
    for term_id, label in field_vocab['PU country'].items():
        print(f"{term_id}: {label}")
