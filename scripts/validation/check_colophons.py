import json

with open('assets/data/production_units.json') as f:
    data = json.load(f)

presence_true = 0
has_transcription = 0

for rec in data['heurist']['records']:
    has_presence = False
    has_text = False
    
    for detail in rec['details']:
        if detail.get('fieldName') == 'Colophon Presence' and str(detail.get('value')) == '5444':
            has_presence = True
        if detail.get('fieldName') == 'Colophon transcription' and detail.get('value'):
            has_text = True
    
    if has_presence:
        presence_true += 1
    if has_text:
        has_transcription += 1

print(f"Total production units: {len(data['heurist']['records'])}")
print(f"Colophon Presence = TRUE (5444): {presence_true}")
print(f"Has Colophon transcription text: {has_transcription}")
