#!/usr/bin/env python3
"""
Update manifest URLs in mapping.json files from local paths to public URLs
"""

import json
from pathlib import Path

# Define paths
ROOT = Path(__file__).parent.parent
TRANS_BASE = ROOT / "data" / "transcriptions"
SCRIPTS_TMP = ROOT / "scripts" / "tmp"

def get_manifest_id_from_file(manifest_path):
    """Extract @id from a local manifest file"""
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest_data = json.load(f)
            return manifest_data.get('@id')
    except Exception as e:
        print(f"   Error reading {manifest_path}: {e}")
        return None

def update_mapping_file(mapping_path, slug):
    """Update manifest URL in a mapping.json file"""
    with open(mapping_path, 'r', encoding='utf-8') as f:
        mapping = json.load(f)
    
    current_manifest = mapping.get("manifest", "")
    
    # Skip if already a public URL
    if current_manifest.startswith(("http://", "https://")):
        print(f"✓ {slug}: Already has public URL")
        return False
    
    # Try to get URL from local manifest file
    if current_manifest.startswith("scripts/tmp/"):
        local_manifest = ROOT / current_manifest
        if local_manifest.exists():
            public_url = get_manifest_id_from_file(local_manifest)
            if public_url:
                mapping["manifest"] = public_url
                with open(mapping_path, 'w', encoding='utf-8') as f:
                    json.dump(mapping, f, ensure_ascii=False, indent=2)
                print(f"✅ {slug}: Updated to {public_url}")
                return True
            else:
                print(f"⚠️  {slug}: Could not extract @id from local manifest")
                return False
        else:
            print(f"⚠️  {slug}: Local manifest file not found: {local_manifest}")
            return False
    
    print(f"⚠️  {slug}: Manifest path format not recognized: {current_manifest}")
    return False

def main():
    """Main function to update all mapping files"""
    print("🔄 Updating manifest URLs in mapping.json files...\n")
    
    updated_count = 0
    skipped_count = 0
    error_count = 0
    
    # Find all mapping.json files
    for ms_dir in sorted(TRANS_BASE.iterdir()):
        if not ms_dir.is_dir():
            continue
        
        slug = ms_dir.name
        mapping_file = ms_dir / "mapping.json"
        
        if not mapping_file.exists():
            continue
        
        try:
            result = update_mapping_file(mapping_file, slug)
            if result:
                updated_count += 1
            elif result is False:
                skipped_count += 1
        except Exception as e:
            print(f"❌ {slug}: Error - {e}")
            error_count += 1
    
    print(f"\n{'='*60}")
    print("✅ Update complete:")
    print(f"   Updated: {updated_count} manuscripts")
    print(f"   Skipped (already public or errors): {skipped_count} manuscripts")
    if error_count > 0:
        print(f"   Errors: {error_count} manuscripts")

if __name__ == "__main__":
    main()
