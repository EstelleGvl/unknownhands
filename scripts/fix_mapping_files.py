#!/usr/bin/env python3
"""
fix_mapping_files.py
Updates mapping.json files to use correct paths and manifest URLs
"""
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
TRANS_DIR = ROOT / "data" / "transcriptions"

def fix_mappings():
    """Fix mapping.json files in transcriptions directory"""
    
    for ms_dir in sorted(TRANS_DIR.iterdir()):
        if not ms_dir.is_dir() or ms_dir.name.startswith('.'):
            continue
        
        mapping_path = ms_dir / "mapping.json"
        if not mapping_path.exists():
            continue
        
        slug = ms_dir.name
        
        # Read mapping
        with open(mapping_path, 'r', encoding='utf-8') as f:
            mapping = json.load(f)
        
        # Fix manifest reference (if it's a local path, note it)
        manifest = mapping.get('manifest', '')
        if manifest.startswith('scripts/') or (manifest and not manifest.startswith('http')):
            print(f"⚠️  {slug}: Local manifest path detected: {manifest}")
            print(f"   Please update with public IIIF manifest URL")
            # Keep it for now, but flag it
        
        # Update annotation page paths to new structure
        items = mapping.get('items', [])
        updated_items = []
        
        for item in items:
            old_path = item.get('annotationPage', '')
            # Old: /data/annos/slug/p1.ap.json
            # New: /data/transcriptions/slug/annotations/p1.json
            if old_path:
                # Extract page number (p1.ap.json → p1)
                filename = old_path.split('/')[-1]
                page_num = filename.replace('.ap.json', '')
                new_path = f"/data/transcriptions/{slug}/annotations/{page_num}.json"
                
                updated_item = item.copy()
                updated_item['annotationPage'] = new_path
                updated_items.append(updated_item)
        
        # Update mapping
        mapping['items'] = updated_items
        
        # Write back
        with open(mapping_path, 'w', encoding='utf-8') as f:
            json.dump(mapping, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Fixed {slug}: {len(updated_items)} annotation paths updated")
    
    print(f"\n✅ Mapping files fixed")

if __name__ == "__main__":
    fix_mappings()
