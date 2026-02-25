import json

files = [
    ('Manuscript', 'assets/data/manuscripts.json'),
    ('Production Unit', 'assets/data/production_units.json'),
    ('Scribal Unit', 'assets/data/scribal_units.json'),
    ('Text', 'assets/data/texts.json'),
    ('Historical Person', 'assets/data/historical_people.json'),
    ('Monastic Institution', 'assets/data/monastic_institutions.json'),
    ('Holding Institution', 'assets/data/holding_institutions.json'),
    ('Relationships', 'assets/data/relationships.json')
]

print("=== ACTUAL JSON FILE COUNTS (assets/data) ===")
for name, path in files:
    try:
        with open(path) as f:
            data = json.load(f)
            count = len(data['heurist']['records'])
            print(f"{name}: {count}")
    except Exception as e:
        print(f"{name}: ERROR - {e}")

print("\n=== EXPECTED (from your database screenshot) ===")
print("Historical Person: 1580")
print("Holding Institution: 230")
print("Manuscript: 1191")
print("Monastic Institution: 3674")
print("Production Unit: 1241")
print("Scribal Unit: 1896")
print("Text: 1140")
