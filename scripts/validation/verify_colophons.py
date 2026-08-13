import json

with open('_site/assets/data/production_units.json', 'r') as f:
    data = json.load(f)

records = data['heurist']['records']

presence_true = 0
has_text = 0
both = 0
flag_only = 0
text_only = 0

for rec in records:
    details = rec.get('details', [])
    
    has_flag = any(d.get('fieldName') == 'Colophon Presence' and str(d.get('value')) == '5444' for d in details)
    has_transcription = any(d.get('fieldName') == 'Colophon transcription' and d.get('value') and str(d.get('value')).strip() for d in details)
    
    if has_flag:
        presence_true += 1
    if has_transcription:
        has_text += 1
    if has_flag and has_transcription:
        both += 1
    elif has_flag:
        flag_only += 1
    elif has_transcription:
        text_only += 1

total = both + flag_only + text_only

print(f"Total production units: {len(records)}")
print(f"\nPresence flag = TRUE: {presence_true}")
print(f"Has transcription text: {has_text}")
print(f"\nBoth flag AND text: {both}")
print(f"Flag but NO text: {flag_only}")
print(f"Text but NO flag: {text_only}")
print(f"\n==> TOTAL UNIQUE: {total}")
