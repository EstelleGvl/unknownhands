#!/usr/bin/env python3
"""
migrate_transcriptions.py
Migrates transcription data to new organized structure
"""
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
OLD_ANNOS = ROOT / "data" / "annos"
NEW_TRANS = ROOT / "data" / "transcriptions"

def migrate():
    """Migrate existing transcription data to new structure"""
    NEW_TRANS.mkdir(parents=True, exist_ok=True)
    
    migrated = 0
    skipped = 0
    
    for slug_dir in sorted(OLD_ANNOS.iterdir()):
        if not slug_dir.is_dir() or slug_dir.name.startswith('.'):
            continue
        
        slug = slug_dir.name
        mapping_path = slug_dir / "mapping.json"
        
        # Check if this manuscript has transcriptions
        ap_files = list(slug_dir.glob("*.ap.json"))
        
        if not ap_files:
            skipped += 1
            continue
        
        # Create new structure
        new_ms_dir = NEW_TRANS / slug
        new_ms_dir.mkdir(parents=True, exist_ok=True)
        new_annos_dir = new_ms_dir / "annotations"
        new_annos_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy mapping.json
        if mapping_path.exists():
            shutil.copy2(mapping_path, new_ms_dir / "mapping.json")
        
        # Copy and rename annotation files (remove .ap extension)
        for ap_file in ap_files:
            # p1.ap.json → p1.json
            new_name = ap_file.stem.replace('.ap', '') + '.json'
            shutil.copy2(ap_file, new_annos_dir / new_name)
        
        print(f"✓ Migrated {slug}: {len(ap_files)} pages")
        migrated += 1
    
    print(f"\n✅ Migration complete:")
    print(f"   Migrated: {migrated} manuscripts")
    print(f"   Skipped (no transcriptions): {skipped} manuscripts")
    print(f"   Location: {NEW_TRANS}")

if __name__ == "__main__":
    migrate()
