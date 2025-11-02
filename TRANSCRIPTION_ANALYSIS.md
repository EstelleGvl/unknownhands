# Transcription System Analysis & Recommendations

## Current State Assessment

### 🔍 What I Found

Your transcription system is **functionally working** but has organizational and UX issues. Here's the current architecture:

#### Data Flow
```
eScriptorium (HTR) 
    ↓ export
PAGE-XML files (in /exports/<slug>/)
    ↓ processing
pagexml_to_iiif.py script
    ↓ converts to
IIIF Annotations (/data/annos/<slug>/p1.ap.json, p2.ap.json, ...)
    + mapping.json (canvas → annotation page map)
    ↓ indexed by
build_transcription_corpus.py
    ↓ creates
Search index (/assets/search/transcriptions.json)
    ↓ used by
Search UI (pages/search-transcriptions.md)
Viewer UI (viewer/index.html)
```

#### Current File Organization Issues

**Problem 1: Multiple Viewer Implementations**
- `pages/mirador_viewer.md` - Basic Mirador viewer (NO transcription sidebar)
- `viewer/index.html` - Full viewer WITH transcription sidebar
- `viewer/raw.html` - Purpose unclear
- **Result:** Confusion about which is the "real" viewer

**Problem 2: Disconnected URLs**
- From explore-database.md: `/viewer/?manifest=...` (uses pages/mirador_viewer.md - NO transcriptions!)
- From search-transcriptions.md: `/viewer/{slug}/?canvas=...` (expects viewer/index.html - WITH transcriptions)
- **Result:** Users get different viewers depending on entry point

**Problem 3: Data Scattered Everywhere**
- Transcription annotations: `/data/annos/<slug>/`
- Search index: `/assets/search/transcriptions.json`
- Scripts: `/scripts/`
- Viewer code: `/viewer/` AND `/pages/`
- Source PAGE-XML: `/exports/<slug>/`
- **Result:** Hard to maintain, unclear dependencies

**Problem 4: Mapping.json References Local Paths**
```json
"manifest": "scripts/tmp/irht-fr1dgmfio4zw.json"  ← NOT A PUBLIC URL!
```
This breaks when the viewer tries to load the manifest from the browser.

---

## 🎯 Recommended Solution

### Option A: Unified Viewer (RECOMMENDED)

**Goal:** One viewer that works for all cases, with transcriptions when available.

#### 1. Consolidate Viewer Code

**Keep:** `viewer/index.html` (it's more feature-complete)
**Remove:** `pages/mirador_viewer.md` (redundant, less capable)

**New viewer URL pattern:**
```
/viewer/?manifest=<url>&annos=<mapping-url>
```

- If `annos` parameter present → show transcription sidebar
- If `annos` parameter missing → still work, just no transcriptions

#### 2. Reorganize Files

```
/viewer/
  ├── index.html                  ← Main viewer (keep existing)
  └── README.md                   ← Documentation

/data/
  └── transcriptions/             ← NEW: consolidate transcription data
      ├── <slug>/
      │   ├── manifest.json       ← Copy of IIIF manifest (for offline work)
      │   ├── mapping.json        ← Canvas → annotation mapping
      │   └── annotations/
      │       ├── p1.json         ← Annotations (rename from .ap.json)
      │       ├── p2.json
      │       └── ...
      └── index.json              ← Search corpus (move from assets/search)

/scripts/
  ├── 1_pagexml_to_iiif.py       ← Rename for clarity (step 1)
  ├── 2_build_search_index.py    ← Rename for clarity (step 2)
  └── README.md                   ← Document workflow

/exports/                         ← Keep as-is (source PAGE-XML files)
  └── <slug>/
      └── *.xml
```

#### 3. Update Scripts

**pagexml_to_iiif.py changes:**
```python
# Fix manifest reference in mapping.json
mapping = {
    "manifest": manifest_url,  # ← Use actual URL, not local path!
    "items": [...]
}

# Output to new location
out_path = f"/data/transcriptions/{slug}/"
```

**build_search_index.py changes:**
```python
# Read from new location
DATA = os.path.join(ROOT, "data", "transcriptions")

# Output to new location
OUTDIR = os.path.join(ROOT, "data", "transcriptions")
out_file = os.path.join(OUTDIR, "index.json")
```

#### 4. Update All Viewer Links

**In explore-database.md:**
```javascript
// OLD:
const viewerHref = `${BASE}/viewer/?manifest=${encodeURIComponent(manifestUrl)}`;

// NEW:
const mappingUrl = `${BASE}/data/transcriptions/${slug}/mapping.json`;
const viewerHref = `${BASE}/viewer/?manifest=${encodeURIComponent(manifestUrl)}&annos=${encodeURIComponent(mappingUrl)}`;
```

**In search-transcriptions.md:**
```javascript
// NEW: Build URL with both parameters
const mappingUrl = `{{ site.baseurl }}/data/transcriptions/${d.slug}/mapping.json`;
const href = `{{ site.baseurl }}/viewer/?manifest=${encodeURIComponent(manifestUrl)}&annos=${encodeURIComponent(mappingUrl)}&canvas=${encodeURIComponent(d.canvas)}`;
```

#### 5. Enhance Viewer UX

**Add to viewer/index.html:**

```html
<!-- Better loading states -->
<div id="text-status">
  Loading transcription... <div class="spinner"></div>
</div>

<!-- Line highlighting on click -->
<script>
// When user clicks a transcription line, highlight the region on the image
function highlightLine(xywh) {
  // Use Mirador's annotation overlay feature
  // This requires adding a custom plugin
}
</script>

<!-- Keyboard shortcuts -->
<script>
// Arrow keys: next/previous page + update transcription
// Ctrl+F: search within current page transcription
</script>

<!-- Export transcription button -->
<button onclick="exportTranscription()">
  📄 Export Page Text
</button>
```

---

### Option B: Keep Separate Viewers (NOT RECOMMENDED)

If you really need two viewers:

**Simple Viewer** (`/viewer-simple/`) - Just IIIF images, no transcriptions
**Full Viewer** (`/viewer/`) - IIIF + transcriptions

But this adds complexity with little benefit.

---

## 🚀 Migration Plan

### Phase 1: Fix Critical Issues (1-2 hours)

1. **Fix manifest URLs in mapping.json**
   ```bash
   # Run script to update all mapping.json files
   python scripts/fix_manifest_urls.py
   ```

2. **Unify viewer URL pattern**
   - Update explore-database.md to use `/viewer/?manifest=...&annos=...`
   - Update search-transcriptions.md to use same pattern

3. **Test both entry points** → Same viewer, consistent experience

### Phase 2: Reorganize Files (2-3 hours)

1. **Create new structure**
   ```bash
   mkdir -p data/transcriptions
   ```

2. **Move annotation data**
   ```bash
   # Move each manuscript's annotations
   for slug in data/annos/*; do
     mkdir -p data/transcriptions/$(basename $slug)/annotations
     mv $slug/*.ap.json data/transcriptions/$(basename $slug)/annotations/
     mv $slug/mapping.json data/transcriptions/$(basename $slug)/
   done
   ```

3. **Update scripts** to use new paths

4. **Move search index**
   ```bash
   mv assets/search/transcriptions.json data/transcriptions/index.json
   ```

5. **Update search page** to load from new location

### Phase 3: UX Improvements (3-4 hours)

1. **Add line highlighting** (click transcription → highlight on image)
2. **Add export button** (copy/download current page text)
3. **Add keyboard shortcuts** (arrows for navigation)
4. **Better loading states** (spinners, progress indicators)
5. **Error handling** (graceful fallback when transcriptions missing)

### Phase 4: Documentation (1 hour)

1. Create `/scripts/README.md` with workflow
2. Create `/data/transcriptions/README.md` with data structure
3. Update main README.md with transcription system overview

---



2. **Unify viewer URL pattern**
   - Update explore-database.md to use `/viewer/?manifest=...&annos=...`
   - Update search-transcriptions.md to use same pattern

3. **Test both entry points** → Same viewer, consistent experience

### Phase 2: Reorganize Files (2-3 hours) ✅ COMPLETED

1. **Create new structure** ✅
   ```bash
   mkdir -p data/transcriptions
   ```
   - Created `/data/transcriptions/<slug>/annotations/` structure
   - Migrated 458 transcription pages from test manuscript (irht-fr1dgmfio4zw)

2. **Move annotation data** ✅
   - Created migration script: `scripts/migrate_transcriptions.py`
   - Successfully moved 1 manuscript, skipped 230 empty directories
   - Files renamed: `*.ap.json` → `*.json`
   - Structure now: `/data/transcriptions/<slug>/annotations/p1.json, p2.json, ...`

3. **Update annotation paths** ✅
   - Created path fix script: `scripts/fix_mapping_files.py`
   - Updated all 458 annotation references in mapping.json
   - Paths updated: `/data/annos/` → `/data/transcriptions/.../annotations/`

4. **Fix manifest URLs** ✅
   - Updated mapping.json manifest from local path to public URL
   - Old: `scripts/tmp/irht-fr1dgmfio4zw.json`
   - New: `https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json`
   - Created automation script: `scripts/update_manifest_urls.py`
   - Verified public URL is accessible (HTTP 200 OK)

5. **Move search index** ⏳ PENDING
   ```bash
   mv assets/search/transcriptions.json data/transcriptions/index.json
   ```

6. **Update search page** ⏳ PENDING (to load from new location)

### Phase 3: UX Improvements (3-4 hours) ⏳ PENDING

1. **Add line highlighting** (click transcription → highlight on image)
2. **Add export button** (copy/download current page text)
3. **Add keyboard shortcuts** (arrows for navigation)
4. **Better loading states** (spinners, progress indicators)
5. **Error handling** (graceful fallback when transcriptions missing)

### Phase 4: Documentation (1 hour) ⏳ PENDING

1. Create `/scripts/README.md` with workflow
2. Create `/data/transcriptions/README.md` with data structure
3. Update main README.md with transcription system overview

---

## 📋 Specific Fixes Needed

````

---

## 🎨 UX Improvements Checklist

### Must-Have (High Priority)

- [ ] **Unified viewer** - Same viewer from all entry points
- [ ] **Consistent URL pattern** - Always include both manifest and annos params
- [ ] **Graceful degradation** - Viewer works even if no transcriptions
- [ ] **Loading indicators** - Show what's happening
- [ ] **Error messages** - Clear feedback when things fail

### Should-Have (Medium Priority)

- [ ] **Line highlighting** - Click transcription line → highlight on image
- [ ] **Keyboard navigation** - Arrow keys change pages + update transcription
- [ ] **Export text** - Button to copy/download page transcription
- [ ] **Search within page** - Ctrl+F searches current page transcription
- [ ] **Line numbers** - Show line numbers in transcription sidebar

### Nice-to-Have (Low Priority)

- [ ] **Dual-pane comparison** - View two pages side-by-side
- [ ] **Text editing** - Correct transcription errors inline (with save to Heurist)
- [ ] **Annotation tools** - Draw boxes, add notes
- [ ] **Permalink to lines** - Share link that highlights specific line
- [ ] **Transcription confidence** - Show HTR confidence scores per line

---

## 🔧 Quick Fix Script

Here's a script to fix the most critical issues immediately:

```python
#!/usr/bin/env python3
"""
fix_viewer_integration.py
Fixes manifest URLs and updates viewer links
"""
import json
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent
ANNOS = ROOT / "data" / "annos"

# Fix 1: Update manifest URLs in mapping.json
for slug_dir in ANNOS.iterdir():
    if not slug_dir.is_dir():
        continue
    
    mapping_path = slug_dir / "mapping.json"
    if not mapping_path.exists():
        continue
    
    with open(mapping_path, 'r') as f:
        mapping = json.load(f)
    
    # Check if manifest is a local path
    manifest = mapping.get('manifest', '')
    if manifest.startswith('scripts/') or not manifest.startswith('http'):
        print(f"⚠️  {slug_dir.name}: Local manifest path detected")
        print(f"    Current: {manifest}")
        print(f"    Action needed: Manually update to public URL")
        # You'll need to look up the correct URL for each manuscript
        # This can't be automated without a manifest registry
    
    # Optional: Rename .ap.json to .json for cleaner URLs
    for ap_file in slug_dir.glob("*.ap.json"):
        new_name = ap_file.stem.replace('.ap', '') + '.json'
        # ap_file.rename(slug_dir / new_name)  # Uncomment to execute

print("✅ Check complete")
```

---

## 📊 Complexity Assessment

| Task | Complexity | Time | Impact |
|------|-----------|------|--------|
| Fix manifest URLs | Low | 1h | **Critical** |
| Unify viewer URLs | Medium | 2h | **Critical** |
| Reorganize files | Medium | 3h | High |
| Add line highlighting | High | 4h | High |
| Add export feature | Low | 1h | Medium |
| Full documentation | Low | 2h | Medium |

**Total estimated time:** 13-15 hours for complete overhaul

---

## 💡 Recommendations Summary

### Do This First (Critical)
1. ✅ Fix manifest URLs in all mapping.json files
2. ✅ Update explore-database.md viewer links to include `annos` parameter
3. ✅ Test that transcriptions appear from database entry point

### Do This Soon (High Priority)
4. Reorganize file structure (`data/transcriptions/`)
5. Remove redundant viewer (`pages/mirador_viewer.md`)
6. Update scripts to use new paths
7. Add better loading states and error handling

### Do This Later (Nice to Have)
8. Add line highlighting on click
9. Add export transcription button
10. Add keyboard shortcuts
11. Create comprehensive documentation

---

## 🤔 Questions to Clarify

1. **How do you currently run the scripts?**
   - Manual after each eScriptorium export?
   - Automated pipeline?
   - This affects how we reorganize

2. **Do you need to support offline viewing?**
   - If yes, we should copy manifests locally
   - If no, we can use external manifest URLs directly

3. **Are transcriptions editable?**
   - If users can correct errors, we need a save mechanism
   - If read-only, simpler implementation

4. **How many manuscripts have transcriptions?**
   - I saw 232 directories but many seem empty
   - Knowing the scale helps prioritize

5. **Do you want bidirectional highlighting?**
   - Click line → highlight region on image? (easier)
   - Click region on image → scroll to line? (harder, needs Mirador plugin)

---

## Next Steps

**What would you like me to do?**

A. **Quick fix** (2-3 hours) - Fix the critical URL issues so transcriptions work consistently
B. **Full reorganization** (1-2 days) - Implement the recommended structure and UX improvements
C. **Just guidance** - I provide detailed instructions, you implement at your pace

Let me know your preference and I'll proceed accordingly!
