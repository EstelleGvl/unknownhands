#!/usr/bin/env python3
"""Summarise catalogue coverage from the Heurist exports without changing data."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TYPES = {'118': 'manuscripts', '116': 'production_units', '119': 'scribal_units',
         '114': 'historical_people', '113': 'holding_institutions',
         '115': 'monastic_institutions', '107': 'texts', '1': 'relationships'}

def values(record, field):
    return [detail.get('termLabel', detail.get('value')) for detail in record.get('details', []) if detail.get('fieldName') == field]

def main():
    records = {}
    for rectype, filename in TYPES.items():
        path = ROOT / 'data' / 'heurist' / f'{filename}.json'
        source = json.loads(path.read_text())['heurist']['records']
        selected = {str(r['rec_ID']): r for r in source if str(r.get('rec_RecTypeID')) == rectype}
        records.update(selected)
        print(f'{filename}: {len(selected)} distinct records')
    missing = Counter()
    for record in records.values():
        for detail in record.get('details', []):
            pointer = detail.get('value')
            if isinstance(pointer, dict) and pointer.get('id') and str(pointer['id']) not in records:
                missing[detail.get('fieldName', 'Unlabelled field')] += 1
    print('\nPointers outside the exported record set (coverage observations):')
    for field, count in sorted(missing.items()):
        print(f'  {field}: {count}')
    pus = [r for r in records.values() if str(r.get('rec_RecTypeID')) == '116']
    linked = sum(any(isinstance(v, dict) and v.get('id') for v in values(r, 'Manuscript')) for r in pus)
    transcribed = sum(any(str(v or '').strip() for v in values(r, 'Colophon transcription')) for r in pus)
    flags = Counter(str(values(r, 'Colophon Presence')[0]) if values(r, 'Colophon Presence') else 'Unrecorded' for r in pus)
    print(f'\nProduction Units with a manuscript pointer: {linked}/{len(pus)}')
    print(f'Production Units with a colophon transcription: {transcribed}/{len(pus)}')
    print('Colophon presence observations: ' + ', '.join(f'{key}: {value}' for key, value in sorted(flags.items())))

if __name__ == '__main__':
    main()
