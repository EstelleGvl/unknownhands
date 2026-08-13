import json

files = [
    ('manuscripts', '_site/assets/data/manuscripts.json'),
    ('production_units', '_site/assets/data/production_units.json'),
    ('scribal_units', '_site/assets/data/scribal_units.json'),
    ('texts', '_site/assets/data/texts.json'),
    ('people', '_site/assets/data/people.json'),
    ('monastic_institutions', '_site/assets/data/monastic_institutions.json'),
    ('holding_institutions', '_site/assets/data/holding_institutions.json')
]

print("=== JSON FILE COUNTS ===")
for name, path in files:
    try:
        with open(path) as f:
            data = json.load(f)
            count = len(data['heurist']['records'])
            print(f"{name}: {count}")
    except Exception as e:
        print(f"{name}: ERROR - {e}")

print("\n=== EXPECTED (from Heurist database) ===")
print("Historical Person: 1580")
print("Holding Institution: 230")
print("Manuscript: 1191")
print("Monastic Institution: 3674")
print("Production Unit: 1241")
print("Scribal Unit: 1896")
print("Text: 1140")
