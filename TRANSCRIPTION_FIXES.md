# Transcription Viewer Fixes - November 2, 2025

## Issues Fixed

### 1. ✅ Transcription Sidebar Disappeared
**Problem**: The transcription reader was not showing next to the IIIF viewer. Mirador was taking the entire page without margins/padding.

**Root Cause**: The viewer was being loaded without the required URL parameters (`manifest` and `annos`).

**Solution**: 
- Fixed database links in `pages/explore-database.md` to include the `annos` parameter
- Fixed search links in `pages/search-transcriptions.md` to use the correct URL pattern
- Removed conflicting simple viewer (`pages/mirador_viewer.md.bak`)

### 2. ✅ Database Viewer Links Missing Transcriptions
**Problem**: Clicking "Open in Mirador" from the database only showed images, not transcriptions.

**Root Cause**: Database was only passing `manifest` parameter, missing the `annos` parameter for transcription mapping.

**Fix in `pages/explore-database.md` (lines 2107-2124)**:
```javascript
// Extract slug from manifest URL (e.g., "irht-fr1dgmfio4zw" from "ark:/63955/fr1dgmfio4zw")
let slug = '';
const arkMatch = manifestUrl.match(/ark:\/\d+\/([^\/]+)/);
if (arkMatch) {
  slug = 'irht-' + arkMatch[1];
}

// Build viewer URL with manifest and optionally transcriptions
let viewerHref = `${BASE}/viewer/?manifest=${encodeURIComponent(manifestUrl)}`;
if (slug) {
  const annosPath = `${BASE}/data/transcriptions/${slug}/mapping.json`;
  viewerHref += `&annos=${encodeURIComponent(annosPath)}`;
}
```

**Result**: Now includes `&annos=/data/transcriptions/{slug}/mapping.json` parameter

### 3. ✅ Search Panel Links Don't Work
**Problem**: Clicking search results gave 404 errors.

**Root Cause**: Search was using wrong URL pattern `/viewer/{slug}/?canvas=...&line=...` which doesn't exist.

**Fix in `pages/search-transcriptions.md` (lines 89-99)**:
```javascript
// Reconstruct manifest URL from slug
const arkId = d.slug.replace(/^irht-/, '');
const manifestUrl = `https://api.irht.cnrs.fr/ark:/63955/${arkId}/manifest.json`;
const annosPath = `{{ site.baseurl }}/data/transcriptions/${d.slug}/mapping.json`;

// Build viewer URL with all required parameters
const href = `{{ site.baseurl }}/viewer/?manifest=${encodeURIComponent(manifestUrl)}&annos=${encodeURIComponent(annosPath)}&canvas=${encodeURIComponent(d.canvas)}&line=${encodeURIComponent(d.line_id)}`;
```

**Result**: Proper URL with manifest, annos, canvas, and line parameters

### 4. ✅ Deep Linking from Search Results
**Enhancement**: Added support for jumping directly to a specific canvas and highlighted line.

**Fix in `viewer/index.html` (lines 155-179)**:
```javascript
const targetCanvas = params.get('canvas') || '';  // for deep linking from search
const targetLine   = params.get('line')   || '';  // highlight specific line

// If canvas is specified, open directly to that canvas
if (targetCanvas) {
  miradorConfig.windows[0].canvasId = targetCanvas;
}
```

**Line highlighting (lines 271-285)**:
```javascript
const lineId = `line-${idx}`;
const isTarget = targetLine && lineId === targetLine;
const highlightClass = isTarget ? ' style="background:#fff4cc; font-weight:bold;"' : '';

// Scroll to highlighted line if specified
if (targetLine) {
  setTimeout(() => {
    const lineElem = document.getElementById(targetLine);
    if (lineElem) {
      lineElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 300);
}
```

**Result**: Search results now jump to the correct page and highlight the matching line

### 5. ✅ Graceful Handling of Missing Transcriptions
**Enhancement**: Viewer now works for manuscripts without transcriptions.

**Fix in `viewer/index.html` (lines 166-171)**:
```javascript
if (!manifest) {
  $status.textContent = 'Missing ?manifest=… URL parameter.';
} else if (!mappingUrl) {
  $status.textContent = 'No transcriptions available for this manuscript.';
  $btnBoxes.style.display = 'none';
}
```

**Result**: Shows helpful message instead of error when no transcriptions exist

### 6. ✅ Removed Viewer Conflict
**Problem**: Two viewer files were outputting to same URL causing build conflict.

**Solution**: Renamed `pages/mirador_viewer.md` to `pages/mirador_viewer.md.bak`

**Result**: Clean build with no conflicts, unified viewer at `/viewer/`

## Testing Checklist

- [x] Database "Open in Mirador" link includes transcriptions
- [x] Search results link to correct viewer URL
- [x] Clicking search result opens to correct page
- [x] Clicked line is highlighted in transcription sidebar
- [x] Transcription sidebar shows next to viewer with proper layout
- [x] Viewer works for manuscripts without transcriptions
- [x] No build conflicts or errors

## URLs Now Working

### From Database:
```
/viewer/?manifest=https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json
  &annos=/data/transcriptions/irht-fr1dgmfio4zw/mapping.json
```

### From Search:
```
/viewer/?manifest=https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json
  &annos=/data/transcriptions/irht-fr1dgmfio4zw/mapping.json
  &canvas=https://arca.irht.cnrs.fr/iiif/123663/canvas/canvas-2589309
  &line=line-5
```

### Without Transcriptions:
```
/viewer/?manifest=https://some-other-manifest.json
```
(Shows only Mirador, gracefully indicates no transcriptions)

## Files Modified

1. **`pages/explore-database.md`** - Fixed viewer link to include annos parameter
2. **`pages/search-transcriptions.md`** - Fixed URL pattern and added proper parameters
3. **`viewer/index.html`** - Added canvas/line deep linking and graceful fallback
4. **`pages/mirador_viewer.md`** - Renamed to `.bak` to avoid conflict

## Next Steps

- ✅ Test with real manuscript (irht-fr1dgmfio4zw)
- ⏳ Add more manuscripts with transcriptions
- ⏳ Update scripts to output to new data structure
- ⏳ Rebuild search index with new paths
- ⏳ Add UX enhancements (click line to zoom, export transcription, etc.)

---

## Update - November 3, 2025

### 7. ✅ Two-Page Viewing Support
**Problem**: When Mirador shows 2 pages side-by-side (book view), transcription sidebar only showed text from the first page.

**Solution**: 
- Created `currentCanvasIds()` function to get ALL visible canvases from Mirador state
- Created `renderAllText(canvasIds)` function to fetch and combine annotations from multiple pages
- Transcriptions now display for all visible pages with position indicators

**Fix in `viewer/index.html` (lines 217-310)**:
```javascript
function currentCanvasIds(){
  const s = mir.store.getState();
  const wId = s.windows && Object.keys(s.windows)[0];
  if (!wId) return [];
  const v = s.windows[wId]?.visibleCanvases;
  return (Array.isArray(v) && v.length) ? v : [];
}

async function renderAllText(canvasIds){
  // Fetches and combines transcriptions from all visible pages
  // Adds position indicators like "(left)" and "(right)"
}
```

**Result**: Transcription sidebar now correctly shows text from both pages in book view

### 8. ✅ Added Search Button to Viewer
**Problem**: No way to navigate from viewer to search transcriptions page.

**Solution**: Added 🔍 Search button to viewer toolbar that links to `/search-transcriptions/`

**Fix in `viewer/index.html` (line 88)**:
```html
<a href="{{ site.baseurl }}/search-transcriptions/" class="chip tiny" 
   style="text-decoration:none; margin-left:auto;">🔍 Search</a>
```

**Result**: Users can now search transcriptions from the viewer

### 9. ✅ Added Database Button to Viewer  
**Problem**: No way to navigate from viewer back to the full manuscript entry in the database.

**Solution**: Added 📖 Database button that extracts the manuscript slug from the manifest URL and links back to explore-database with proper parameters.

**Fix in `viewer/index.html` (lines 165-183)**:
```javascript
// Extract slug from manifest ARK ID
const arkMatch = manifest.match(/ark:\/\d+\/([^\/]+)/);
if (arkMatch) {
  const slug = 'irht-' + arkMatch[1];
  // Link to explore-database with slug parameter
  $btnDatabase.href = `${baseUrl}/explore-database/?type=ms&slug=${encodeURIComponent(slug)}`;
  $btnDatabase.style.display = 'inline-block';
}
```

**Fix in `pages/explore-database.md` (lines 12726-12749)**:
Added URL parameter handling to automatically navigate to a specific manuscript when loaded with `?type=ms&slug=irht-xxxxx`:

```javascript
// Check for URL parameters to auto-navigate to a specific record
const params = new URLSearchParams(window.location.search);
const slugParam = params.get('slug');
const typeParam = params.get('type') || 'ms';

if (slugParam && typeParam === 'ms') {
  // Search for manuscript with matching ARK ID in manifest URL
  const manuscripts = Object.values(IDX.ms || {});
  for (const ms of manuscripts) {
    const manifestUrl = MAP.ms.iiifManifest(ms);
    if (manifestUrl) {
      const arkMatch = manifestUrl.match(/ark:\/\d+\/([^\/]+)/);
      if (arkMatch) {
        const msSlug = 'irht-' + arkMatch[1];
        if (msSlug === slugParam) {
          // Found it! Jump to this manuscript
          setTimeout(() => jumpTo('ms', String(ms.rec_ID)), 100);
          break;
        }
      }
    }
  }
}
```

**Result**: Complete circular navigation workflow:
- Database → "Open in Mirador" → Viewer ✅
- Viewer → "🔍 Search" → Search page ✅
- Viewer → "📖 Database" → Database entry ✅
- Search results → Viewer (with line highlighting) ✅

### Updated URLs

**Database Link from Viewer:**
```
/explore-database/?type=ms&slug=irht-fr1dgmfio4zw
```

When explore-database loads, it automatically:
1. Switches to browse mode
2. Switches to manuscripts (ms) entity type  
3. Searches for the manuscript with matching slug in its manifest URL
4. Jumps to that manuscript and displays its details

## Complete Workflow Now Available

Users can now seamlessly navigate between:
- **Explore Database** → View full manuscript metadata and holdings
- **Mirador Viewer** → Browse images with synchronized transcriptions
- **Search Transcriptions** → Find specific text across all manuscripts
- **Back to Database** → Return to see related manuscripts, production units, etc.

All with proper deep linking, parameter passing, and state management!
