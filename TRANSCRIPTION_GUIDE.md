# Transcription System - Complete Guide
**Last Updated: November 11, 2025**

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Adding New Transcriptions](#adding-new-transcriptions)
3. [System Architecture](#system-architecture)
4. [Performance & Optimization](#performance--optimization)
5. [Troubleshooting](#troubleshooting)

---

## System Overview

The Unknown Hands transcription system allows you to:
- Import transcriptions from eScriptorium PAGE-XML exports
- Search across all transcribed manuscripts (currently 5 manuscripts, 88,902 lines)
- View transcriptions overlaid on manuscript images in the IIIF viewer
- Compare multiple search results side-by-side

### Current Statistics
- **Total manuscripts with transcriptions**: 5
  - France, Arras, fonds principal, 0766 (CGM 742)
  - Cologne, Erzbischöfliche Diözesan- und Dombibliothekx, Ms. 65
  - Cologne, Erzbischöfliche Diözesan- und Dombibliothekx, Ms. 67
  - Laon, Bibliothèque municipale, Ms.423
  - Munich, Bayerische Staatsbibliothek, Clm 22016
- **Total manuscripts in database**: 230 (225 still need transcriptions)
- **Search corpus size**: 31MB

---

## Adding New Transcriptions

### Prerequisites
- PAGE-XML files exported from eScriptorium (one XML file per manuscript page)
- Python 3.9+ with PyYAML installed
- Manuscript must be listed in `data/manuscripts.csv` with IIIF manifest URL

### Step-by-Step Process

#### 1. Organize Your Export Files

After exporting from eScriptorium, rename the folder to match the manuscript:

```bash
# Example: rename eScriptorium export folder
mv ~/Downloads/export_doc9509_laon_... ~/Downloads/LaonBibliothequemunicipaleMs423
```

#### 2. Find the Correct Slug

The slug is the folder name in `data/annos/`. Find it by searching for your manuscript:

```bash
# Search for the manuscript in manifests.yml
grep -i "laon.*423" data/manifests.yml

# Output shows:
# - slug: ms-423
#   title: Laon, Bibliothèque municipale, Ms.423
#   manifest: https://bibliotheque-numerique.ville-laon.fr/iiif/1465/manifest
#   annos: /data/annos/ms-423/mapping.json
```

**Important**: Use the exact slug from `data/annos/` folder, not the full title.

#### 3. Find the IIIF Manifest URL

Get the manifest URL from `data/manuscripts.csv`:

```bash
grep -i "laon.*423" data/manuscripts.csv

# Output:
# 15908,"Laon, Bibliothèque municipale, Ms.423",700–800,Ms.423,https://bibliotheque-numerique.ville-laon.fr/iiif/1465/manifest
```

#### 4. Run the Conversion Script

```bash
python scripts/pagexml_to_iiif.py \
  <MANIFEST_URL> \
  <PATH_TO_PAGEXML_FOLDER> \
  ./data/annos \
  <SLUG>
```

**Example:**
```bash
python scripts/pagexml_to_iiif.py \
  https://bibliotheque-numerique.ville-laon.fr/iiif/1465/manifest \
  ~/Downloads/LaonBibliothequemunicipaleMs423/ \
  ./data/annos \
  ms-423
```

This creates:
- `data/annos/ms-423/p1.ap.json` (page 1 annotations)
- `data/annos/ms-423/p2.ap.json` (page 2 annotations)
- ... (one per page)
- `data/annos/ms-423/mapping.json` (maps canvas IDs to annotation files)

#### 5. Update the Manifest-Annos Map

```bash
python scripts/generate_manifest_map.py
```

This regenerates `data/manifest-annos-map.json` which the viewer uses to find transcriptions.

#### 6. Rebuild the Search Corpus

```bash
python scripts/build_transcription_corpus.py
```

This creates/updates `assets/search/transcriptions.json` with all transcription text for searching.

Output example:
```
ms-423: fetched title from manifest
ms-65: fetched title from manifest
...
Wrote 88902 lines to assets/search/transcriptions.json
```

#### 7. Rebuild the Jekyll Site

```bash
bundle exec jekyll build
```

#### 8. Test

1. **Viewer**: Go to the manuscript in the database and click "View in Mirador". Transcriptions should appear in the sidebar.
2. **Search**: Go to "Search Transcriptions" and search for a word you know is in the transcription.

### Batch Processing Multiple Manuscripts

For multiple manuscripts, create a shell script:

```bash
#!/bin/bash
# batch_add_transcriptions.sh

manuscripts=(
  "ms-65|https://digital.dombibliothek-koeln.de/hs/i3f/v20/276608/manifest|~/Downloads/CologneMs65"
  "ms-67|https://digital.dombibliothek-koeln.de/hs/i3f/v20/221601/manifest|~/Downloads/CologneMs67"
  "clm-22016|https://api.digitale-sammlungen.de/iiif/presentation/v2/bsb00034225/manifest|~/Downloads/MunichClm22016"
)

for ms in "${manuscripts[@]}"; do
  IFS='|' read -r slug manifest folder <<< "$ms"
  echo "Processing $slug..."
  python scripts/pagexml_to_iiif.py "$manifest" "$folder" ./data/annos "$slug"
done

echo "Updating manifest map..."
python scripts/generate_manifest_map.py

echo "Rebuilding search corpus..."
python scripts/build_transcription_corpus.py

echo "Rebuilding Jekyll site..."
bundle exec jekyll build

echo "Done!"
```

---

## System Architecture

### Directory Structure

```
data/
├── annos/                          # Transcription annotations
│   ├── ms-423/                     # One folder per manuscript (slug name)
│   │   ├── mapping.json            # Maps canvas URLs to annotation files
│   │   ├── p1.ap.json              # Page 1 annotations (IIIF Web Annotations)
│   │   ├── p2.ap.json              # Page 2 annotations
│   │   └── ...
│   └── ms-65/
│       └── ...
├── transcriptions/                 # Legacy location (Arras only)
│   └── irht-fr1dgmfio4zw/
│       └── annotations/
│           ├── mapping.json
│           └── p*.json
├── manuscripts.csv                 # Database of all manuscripts
├── manifests.yml                   # IIIF manifest URLs and metadata
└── manifest-annos-map.json         # Generated map (manifest URL → annos path)

scripts/
├── pagexml_to_iiif.py             # Converts PAGE-XML → IIIF annotations
├── build_transcription_corpus.py  # Builds searchable JSON corpus
└── generate_manifest_map.py       # Generates manifest-annos-map.json

assets/search/
└── transcriptions.json             # Searchable corpus (31MB, 88,902 lines)

pages/
├── search-transcriptions.md        # Search interface
└── explore-database.md             # Database with links to viewer

viewer/
└── index.html                      # IIIF Mirador viewer with transcriptions
```

### Data Flow

```
eScriptorium Export (PAGE-XML)
         ↓
pagexml_to_iiif.py
         ↓
data/annos/{slug}/p*.ap.json (IIIF Web Annotations)
         ↓
generate_manifest_map.py
         ↓
data/manifest-annos-map.json (viewer loads this)
         ↓
build_transcription_corpus.py
         ↓
assets/search/transcriptions.json (search loads this)
         ↓
Jekyll Build
         ↓
_site/ (deployed website)
```

### File Formats

#### PAGE-XML (Input)
```xml
<PcGts>
  <Metadata externalRef="https://...image.jpg"/>
  <Page imageWidth="3480" imageHeight="4491">
    <TextRegion>
      <TextLine id="eSc_line_123">
        <Coords points="267,146 386,194 ..."/>
        <Baseline points="267,194 386,194"/>
        <TextEquiv conf="0.999">
          <Unicode>Transcribed text here</Unicode>
        </TextEquiv>
      </TextLine>
    </TextRegion>
  </Page>
</PcGts>
```

#### IIIF Web Annotation (Output)
```json
{
  "id": "data/annos/ms-423/p1.ap.json",
  "type": "AnnotationPage",
  "items": [
    {
      "id": "https://...canvas/1#anno-1",
      "type": "Annotation",
      "motivation": "supplementing",
      "body": {
        "type": "TextualBody",
        "value": "Transcribed text here",
        "format": "text/plain"
      },
      "target": {
        "source": "https://...canvas/1",
        "selector": {
          "type": "FragmentSelector",
          "value": "xywh=267,146,119,48"
        }
      }
    }
  ]
}
```

#### Mapping JSON
```json
{
  "manifest": "https://...manifest.json",
  "items": [
    {
      "canvas": "https://...canvas/1",
      "annotationPage": "/data/annos/ms-423/p1.ap.json"
    }
  ]
}
```

#### Search Corpus JSON
```json
{
  "manuscripts": [
    {
      "slug": "ms-423",
      "title": "Laon, Bibliothèque municipale, Ms.423",
      "manifest": "https://...manifest",
      "annos": "/data/annos/ms-423/mapping.json"
    }
  ],
  "docs": [
    {
      "id": "ms-423::0::0",
      "slug": "ms-423",
      "title": "Laon, Bibliothèque municipale, Ms.423",
      "page": 1,
      "line": 1,
      "text": "Transcribed text here",
      "text_norm": "transcribed text here",
      "canvas": "https://...canvas/1",
      "anno": "/data/annos/ms-423/p1.ap.json#anno-1"
    }
  ]
}
```

---

## Performance & Optimization

### Current Performance Issues

**Problem**: The search corpus is 31MB (88,902 lines from 5 manuscripts). With 230 manuscripts, this could grow to **1.5GB+**, making the search page unusably slow.

### Solutions

#### ✅ Implemented: Lazy Loading
The search corpus now loads in the background and shows a loading message. This prevents the page from freezing on load.

#### 🔄 Recommended for Future:

1. **Chunked Loading** (Medium effort, high impact)
   - Split the corpus into multiple files by manuscript
   - Load only the chunks needed for the search
   - Implementation: Modify `build_transcription_corpus.py` to create separate files

2. **Server-Side Search** (High effort, highest impact)
   - Use Elasticsearch, Solr, or similar
   - Only fetch results from server, not entire corpus
   - Requires backend infrastructure

3. **Index Compression** (Low effort, medium impact)
   - Use Brotli/Gzip compression on the JSON file
   - Configure server to serve compressed files
   - Can reduce size by 70-80%

4. **Lightweight Index** (Medium effort, high impact)
   - Create a small index with just IDs and word positions
   - Fetch full text only for displayed results
   - Could reduce initial load from 31MB to ~5MB

5. **Incremental Indexing** (High effort, medium impact)
   - Build index client-side as user types
   - Store index in browser IndexedDB
   - Only download corpus once per session

### Recommended Immediate Action

Before adding more transcriptions:

1. **Test with current corpus** (31MB) - how slow is it really?
2. **Implement chunked loading** - split by manuscript
3. **Add gzip compression** - easiest quick win
4. **Monitor**: Set up analytics to track search performance

---

## Troubleshooting

### Transcriptions Don't Appear in Viewer

**Symptoms**: Viewer loads manuscript but sidebar is empty or says "No transcriptions available"

**Causes & Solutions**:

1. **Wrong slug used**
   ```bash
   # Check the actual slug in data/annos/
   ls data/annos/ | grep -i cologne
   
   # Use the exact slug from the folder name
   python scripts/pagexml_to_iiif.py ... ./data/annos ms-65
   # NOT cologne-ms-65!
   ```

2. **Mapping not generated**
   ```bash
   # Regenerate the manifest-annos map
   python scripts/generate_manifest_map.py
   
   # Check it includes your manuscript
   grep "276608" data/manifest-annos-map.json
   ```

3. **Jekyll not rebuilt**
   ```bash
   bundle exec jekyll build
   ```

4. **Browser cache**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Check browser console for errors

### Search Shows Wrong Titles

**Problem**: Search shows technical slugs like "ms-423" instead of "Laon, Bibliothèque municipale, Ms.423"

**Solution**: Titles are fetched from IIIF manifests during corpus build. If a manifest is unreachable:

```bash
# Rebuild corpus with fresh manifest fetches
python scripts/build_transcription_corpus.py

# Look for "fetched title from manifest" messages
# If you see "using slug as title", the manifest couldn't be reached
```

### Conversion Script Errors

**"No canvases found in manifest JSON"**
- The IIIF manifest might be malformed or unreachable
- Check the manifest URL in a browser
- Verify it's a valid IIIF Presentation API manifest

**"No PAGE-XML files found"**
- Check the folder path is correct
- Ensure files have `.xml` extension
- Files should be named like `0_xxxxx_default.xml`

**Mismatched page count**
- Warning: "X PAGE-XML files vs Y canvases"
- The script will use the minimum of both
- Check if export is complete or manifest has extra pages

### Search is Slow

See [Performance & Optimization](#performance--optimization) section above.

---

## Appendix: Key Script Options

### pagexml_to_iiif.py

```bash
python scripts/pagexml_to_iiif.py <MANIFEST> <PAGEXML_DIR> <OUTPUT_DIR> <SLUG>
```

- **MANIFEST**: Full IIIF manifest URL
- **PAGEXML_DIR**: Path to folder with PAGE-XML files
- **OUTPUT_DIR**: Usually `./data/annos`
- **SLUG**: Short identifier (must match folder in data/annos/)

**Granularity**: The script is configured for "line" level (default). To change to "word" level, edit line 10 of the script:
```python
GRANULARITY = "line"   # or "word"
```

### build_transcription_corpus.py

```bash
python scripts/build_transcription_corpus.py
```

No arguments needed. It:
1. Reads `data/manifests.yml` for manuscript metadata
2. Scans `data/annos/` for annotation files
3. Fetches titles from IIIF manifests
4. Outputs to `assets/search/transcriptions.json`

**Note**: Requires network access to fetch manifest titles.

### generate_manifest_map.py

```bash
python scripts/generate_manifest_map.py
```

Reads `data/manifests.yml` and generates `data/manifest-annos-map.json`.

Run this after adding manuscripts to `manifests.yml` or after running the conversion script.

---

## Quick Reference

### Adding One Manuscript (5 minutes)

```bash
# 1. Find slug and manifest URL
grep -i "YOUR_MANUSCRIPT" data/manuscripts.csv
ls data/annos/ | grep -i "your-manuscript"

# 2. Convert
python scripts/pagexml_to_iiif.py \
  <MANIFEST_URL> \
  ~/Downloads/YourExportFolder/ \
  ./data/annos \
  <SLUG>

# 3. Update map & corpus
python scripts/generate_manifest_map.py
python scripts/build_transcription_corpus.py

# 4. Rebuild
bundle exec jekyll build
```

### File Locations Cheat Sheet

- **Input**: PAGE-XML from eScriptorium export
- **Output**: `data/annos/{slug}/p*.ap.json`
- **Viewer map**: `data/manifest-annos-map.json` (auto-loaded by viewer)
- **Search corpus**: `assets/search/transcriptions.json` (auto-loaded by search)
- **Manuscript list**: `data/manuscripts.csv` (database)
- **Manifest metadata**: `data/manifests.yml` (for titles & URLs)

---

**Questions or issues?** Check the [Troubleshooting](#troubleshooting) section or open a GitHub issue.
