import json

print("=== HOLDING INSTITUTION SAMPLE ===")
with open('assets/data/holding_institutions.json') as f:
    data = json.load(f)
    rec = data['heurist']['records'][0]
    print(f"Title: {rec['rec_Title']}")
    for d in rec['details'][:20]:
        val = d.get('value', d.get('termLabel', 'N/A'))
        print(f"  {d['fieldName']}: {str(val)[:80]}")

print("\n=== MONASTIC INSTITUTION SAMPLE ===")
with open('assets/data/monastic_institutions.json') as f:
    data = json.load(f)
    rec = data['heurist']['records'][0]
    print(f"Title: {rec['rec_Title']}")
    for d in rec['details'][:20]:
        val = d.get('value', d.get('termLabel', 'N/A'))
        print(f"  {d['fieldName']}: {str(val)[:80]}")
