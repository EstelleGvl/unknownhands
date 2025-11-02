# Adding New Transcriptions - Complete Workflow

## 📋 Overview

This guide explains how to add new manuscript transcriptions from PAGE-XML files (exported from eScriptorium) to your Unknown Hands website.

## 🎯 Prerequisites

- PAGE-XML files exported from eScriptorium
- IIIF manifest URL for the manuscript
- Manuscript slug/identifier (format: `irht-{ark_id}`)

## 📂 File Structure

Your transcriptions live in:
```
/data/transcriptions/
  {manuscript-slug}/
    mapping.json              # Links IIIF canvases to annotation files
    annotations/
      p1.json, p2.json, ...   # One file per page
```

## 🔧 Step-by-Step Process

### Step 1: Get Your PAGE-XML Files

After transcribing in eScriptorium:
1. Export transcriptions as **PAGE-XML format**
2. Download the ZIP file
3. Extract to a temporary directory (e.g., `~/Downloads/manuscript-pagexml/`)

You should have files like:
```
manuscript-pagexml/
  page_001.xml
  page_002.xml
  page_003.xml
  ...
```

### Step 2: Get the IIIF Manifest URL

You need the **public IIIF manifest URL** for your manuscript.

**For IRHT ARCA manuscripts:**
- Format: `https://api.irht.cnrs.fr/ark:/63955/{ark_id}/manifest.json`
- Example: `https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json`

**How to find it:**
1. Look at a canvas URL from your manifest (starts with `https://arca.irht.cnrs.fr/iiif/...`)
2. Extract the ARK identifier from the manifest ID
3. The slug will be: `irht-{ark_id}`

**Example:**
- Manifest ID: `https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json`
- ARK ID: `fr1dgmfio4zw`
- Slug: `irht-fr1dgmfio4zw`

### Step 3: Run the Conversion Script

Convert PAGE-XML to IIIF Web Annotations:

```bash
cd /Users/estellegueville/Documents/GitHub/unknownhands

python3 scripts/pagexml_to_iiif.py \
  <manifest-url> \
  <path-to-pagexml-directory> \
  <manuscript-slug>
```

**Example:**
```bash
python3 scripts/pagexml_to_iiif.py \
  "https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json" \
  ~/Downloads/manuscript-pagexml \
  irht-fr1dgmfio4zw
```

**What this does:**
- Reads all PAGE-XML files
- Extracts text and bounding box coordinates
- Creates one annotation JSON file per page
- Generates a `mapping.json` file linking canvas IDs to annotations
- Outputs everything to `/data/transcriptions/{slug}/`

### Step 4: Verify the Output

Check that files were created correctly:

```bash
ls -la data/transcriptions/irht-fr1dgmfio4zw/
```

You should see:
```
mapping.json
annotations/
  p1.json
  p2.json
  p3.json
  ...
```

**Verify mapping.json:**
```bash
head -20 data/transcriptions/irht-fr1dgmfio4zw/mapping.json
```

Should show:
```json
{
  "manifest": "https://api.irht.cnrs.fr/ark:/63955/fr1dgmfio4zw/manifest.json",
  "items": [
    {
      "canvas": "https://arca.irht.cnrs.fr/iiif/123663/canvas/canvas-2589305",
      "annotationPage": "/data/transcriptions/irht-fr1dgmfio4zw/annotations/p1.json"
    },
    ...
  ]
}
```

**Verify an annotation file:**
```bash
head -30 data/transcriptions/irht-fr1dgmfio4zw/annotations/p10.json
```

Should show:
```json
{
  "id": "data/transcriptions/irht-fr1dgmfio4zw/annotations/p10.json",
  "type": "AnnotationPage",
  "items": [
    {
      "id": "...",
      "type": "Annotation",
      "motivation": "supplementing",
      "body": {
        "type": "TextualBody",
        "value": "transcribed text here",
        "format": "text/plain"
      },
      "target": {
        "source": "canvas-id",
        "selector": {
          "type": "FragmentSelector",
          "value": "xywh=1152,841,1231,106"
        }
      }
    }
  ]
}
```

### Step 5: Rebuild the Search Index

After adding transcriptions, rebuild the search index:

```bash
python3 scripts/build_transcription_corpus.py
```

**What this does:**
- Scans `/data/transcriptions/` for all manuscripts
- Reads all annotation files
- Builds a searchable index with fuzzy matching
- Outputs to `/assets/search/transcriptions.json`

**Verify the index:**
```bash
wc -l assets/search/transcriptions.json
```

Should show more documents than before.

### Step 6: Add Manuscript to Database (If Needed)

If this is a new manuscript not yet in your database:

1. Add the manuscript record to your Heurist database
2. Include the IIIF manifest URL in the "IIIF Manifest" field
3. Regenerate the JSON exports from Heurist
4. Update the site data files

The database "Open in Mirador" button will automatically include the `&annos=` parameter if transcriptions exist.

### Step 7: Build and Test

```bash
# Build the site
jekyll build

# Serve locally to test
jekyll serve --port 4000
```

**Test the following:**

1. **Viewer from Database:**
   - Navigate to your manuscript in the database
   - Click "Open in Mirador (new tab)"
   - Verify: transcriptions appear in the sidebar
   - Verify: transcriptions update when you turn pages
   - Verify: if Mirador shows 2 pages, transcriptions show both

2. **Search Transcriptions:**
   - Go to `/search-transcriptions/`
   - Search for a word you know appears in the transcriptions
   - Click a result
   - Verify: jumps to correct page with highlighted line

3. **Deep Linking:**
   - Test URL format: `/viewer/?manifest=...&annos=...&canvas=...&line=...`
   - Should jump to specific page and highlight specific line

### Step 8: Commit and Deploy

```bash
git add data/transcriptions/irht-{new-slug}/
git add assets/search/transcriptions.json
git commit -m "Add transcriptions for {manuscript-name}"
git push origin main
```

Your site will rebuild automatically on GitHub Pages or Netlify.

## 🔄 Batch Processing Multiple Manuscripts

To process multiple manuscripts at once, create a batch script:

```bash
#!/bin/bash
# batch_process_transcriptions.sh

# Manuscript 1
python3 scripts/pagexml_to_iiif.py \
  "https://api.irht.cnrs.fr/ark:/63955/manuscript1/manifest.json" \
  ~/Downloads/manuscript1-pagexml \
  irht-manuscript1

# Manuscript 2  
python3 scripts/pagexml_to_iiif.py \
  "https://api.irht.cnrs.fr/ark:/63955/manuscript2/manifest.json" \
  ~/Downloads/manuscript2-pagexml \
  irht-manuscript2

# Add more as needed...

# Rebuild search index once at the end
python3 scripts/build_transcription_corpus.py

echo "✅ All transcriptions processed!"
```

Make it executable and run:
```bash
chmod +x batch_process_transcriptions.sh
./batch_process_transcriptions.sh
```

## 🐛 Troubleshooting

### Problem: "No transcription for this page"

**Causes:**
- Canvas IDs in manifest don't match canvas IDs in mapping.json
- Annotation files are empty (check file size)
- Wrong manifest URL

**Fix:**
1. Check a canvas URL from the manifest
2. Compare to canvas URLs in `mapping.json`
3. Verify manifest URL is public and accessible: `curl -I "manifest-url"`

### Problem: "Could not load mapping.json"

**Causes:**
- File doesn't exist
- Path is wrong in viewer URL
- 404 error (file not published)

**Fix:**
1. Check file exists: `ls -la data/transcriptions/{slug}/mapping.json`
2. Verify path in URL: `/data/transcriptions/{slug}/mapping.json`
3. Rebuild site: `jekyll build`

### Problem: Viewer shows pages but no transcriptions

**Causes:**
- Missing `&annos=` parameter in URL
- Annotation files have empty `items` arrays

**Fix:**
1. Check URL includes: `?manifest=...&annos=...`
2. Open an annotation file and verify it has items
3. Re-run PAGE-XML conversion if files are empty

### Problem: Search returns no results

**Causes:**
- Search index not rebuilt
- Index file is old/empty
- Manuscript slug doesn't match

**Fix:**
1. Rebuild index: `python3 scripts/build_transcription_corpus.py`
2. Check index size: `wc -l assets/search/transcriptions.json`
3. Verify slug matches in `/data/transcriptions/` directory names

## 📊 Scaling to 200-300 Manuscripts

**Performance considerations:**

1. **Search Index Size:**
   - Current: ~1 manuscript = ~5MB search index
   - 300 manuscripts ≈ 1.5GB search index (too large for browser)
   - **Solution:** Implement chunked loading or server-side search when you reach ~50 manuscripts

2. **Directory Structure:**
   - Current structure scales well to 1000+ manuscripts
   - Each manuscript is isolated in its own directory
   - Parallel processing possible

3. **Optimization Tips:**
   - Process manuscripts in batches of 10-20
   - Commit after each batch (easier rollback if issues)
   - Monitor search index file size
   - Consider splitting search by collection/century when large

## 🎓 Advanced: Understanding the Data Format

### IIIF Web Annotation Model

Each annotation follows this structure:

```json
{
  "id": "unique-id",
  "type": "Annotation",
  "motivation": "supplementing",  // Indicates this supplements the image
  "body": {
    "type": "TextualBody",
    "value": "actual transcribed text",
    "format": "text/plain"
  },
  "target": {
    "source": "canvas-id",  // Which page/canvas
    "selector": {
      "type": "FragmentSelector",
      "value": "xywh=x,y,width,height"  // Where on the page
    }
  }
}
```

### mapping.json Structure

```json
{
  "manifest": "public-iiif-manifest-url",
  "items": [
    {
      "canvas": "canvas-id-from-manifest",
      "annotationPage": "path-to-annotation-file"
    }
  ]
}
```

This links each canvas (page) in the IIIF manifest to its transcription annotation file.

## 📚 Resources

- **IIIF Presentation API**: https://iiif.io/api/presentation/
- **Web Annotation Data Model**: https://www.w3.org/TR/annotation-model/
- **eScriptorium**: https://escriptorium.readthedocs.io/
- **Mirador Viewer**: https://projectmirador.org/

## ✅ Checklist for Each New Manuscript

- [ ] Export PAGE-XML from eScriptorium
- [ ] Obtain IIIF manifest URL
- [ ] Determine manuscript slug (irht-{ark_id})
- [ ] Run `pagexml_to_iiif.py` conversion script
- [ ] Verify files created in `/data/transcriptions/{slug}/`
- [ ] Check annotation files have content (not empty)
- [ ] Rebuild search index with `build_transcription_corpus.py`
- [ ] Test viewer loads transcriptions correctly
- [ ] Test search finds text from new manuscript
- [ ] Test two-page view if manuscript is in book format
- [ ] Commit to git and push
- [ ] Verify deployed site shows transcriptions

## 🆘 Need Help?

Common issues and solutions:
1. Script errors → Check Python version (needs Python 3.7+)
2. Missing dependencies → Run `pip install -r requirements.txt` (if exists)
3. Canvas ID mismatches → Verify manifest URL is correct
4. Empty annotations → Re-export from eScriptorium with correct settings

---

**Last Updated:** November 2, 2025  
**Version:** 2.0
