#!/usr/bin/env python3
"""
Generate a JSON map of manifest URLs to annos paths from manifests.yml
"""
import yaml
import json

# Read manifests.yml
with open('data/manifests.yml', 'r') as f:
    manifests = yaml.safe_load(f)

# Create map of manifest URL -> annos path
manifest_map = {}
for ms in manifests:
    if ms.get('manifest') and ms.get('annos'):
        manifest_map[ms['manifest']] = ms['annos']

# Add Arras (IRHT) which is in a different location
manifest_map['https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json'] = '/data/transcriptions/irht-fr1dgmfio4zw/mapping.json'

# Write to JSON
with open('data/manifest-annos-map.json', 'w') as f:
    json.dump(manifest_map, f, indent=2)

print(f"Generated manifest-annos-map.json with {len(manifest_map)} entries")
