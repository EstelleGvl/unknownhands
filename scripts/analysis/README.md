# Text Analysis Module

This module provides TF-IDF analysis, PCA visualization, and stylometric comparison for manuscript transcriptions.

## Client-Side Analysis

The text analysis page now runs **entirely in your browser** using JavaScript. No Python server needed for basic usage!

- Works on any device with a modern browser
- No installation required
- Privacy-friendly (data never leaves your computer)
- Loads only the manuscript files selected for analysis

Just visit the page and start analyzing: `/text-analysis/`

## Features

- **TF-IDF Analysis**: Character or word n-gram frequency analysis
- **PCA Visualization**: 2D or 3D plots of selected text samples
- **Hierarchical clustering**: Complete-sample dendrograms with configurable distance and linkage
- **Bootstrap consensus**: `stylo`-style unrooted majority-rule consensus trees assembled from repeated cluster analyses over cumulative MFW and culling settings
- **Scribal samples**: Attributed scribal units grouped by scribe and linked to their mapped folios
- **Rolling comparison**: Compare overlapping test windows with two reference corpora using Burrows’ Classic Delta, Eder’s Delta, Argamon’s Linear Delta, Eder’s Simple, cosine, Canberra, Manhattan, or Euclidean distance
- **Dual rolling views**: Inspect both the signed A-versus-B contrast and the two absolute distance curves
- **Feature Analysis**: View high-variance n-grams in the selected corpus
- **Flexible Input**: Use database transcriptions or upload custom texts

## Local Setup

No Python analysis server is required for the website module. Build and serve the Jekyll site:

```bash
BUNDLE_IGNORE_CONFIG=1 bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

Then visit `http://localhost:4000/unknownhands/text-analysis/`

The Flask files in this directory are retained for experimental and batch workflows; the public page does not call them.

## Usage

### Analyzing Database Transcriptions

1. Navigate to **Text Analysis**
2. Open a scribe heading and select one or more mapped scribal samples, or expand **Manuscript text bodies**
3. Add the selected samples to the corpus
4. Configure analysis parameters (defaults work well)
5. Click "Run Analysis"

### Uploading Custom Texts

1. Click the "Upload Custom Text" section
2. Either:
   - Paste text directly into the text area
   - Upload one or more `.txt` files
3. Provide a label for each text
4. Click "Add to Corpus"

### Configuration Options

- **N-gram Type**: 
  - `char` (character n-grams): Better for stylometry, captures orthographic style
  - `word` (word n-grams): Better for topic/content analysis

- **N-gram Size**: 
  - Characters: 3-5 recommended (4 is typical)
  - Words: 1-3 recommended

- **Min/Max Document Frequency**: Filter out rare or very common features

- **Chunk Size**: Split long texts into word-count chunks (2,000 words is the default)

- **PCA Components**: Number of dimensions (2-3 for visualization)

### Scribal ranges and collaborations

Run `python3 scripts/analysis/build_scribe_text_index.py` after changing scribe profiles, manuscript mappings, or transcription indexes. The generated `assets/analysis/scribe-text-index.json` joins catalogue folio ranges to IIIF canvas labels and then to the page IDs used by the transcription corpus.

User-facing manuscript labels come from the separate holding-institution and call-number columns in `data/manuscripts.csv`; internal `ms-…` slugs remain identifiers only.

All project-supplied samples are canvas-bounded. Whole-text and “main text” attributions begin with the canvas containing f. 1r and end with the last transcribed folio. For repositories that expose the manuscript body as a numbered IIIF sequence between named binding canvases, page 1 through the last transcribed numbered canvas is used. A manuscript without either defensible boundary is omitted from whole-text selection. This avoids silently including covers, pastedowns, flyleaves, rulers, colour cards, and other material outside the foliated body.

For multi-hand manuscripts, only lines attached to canvases inside the mapped range are loaded. If two scribal ranges include the same canvas, that page is excluded from both samples: page-level IIIF annotation or ALTO text cannot separate hands that share a folio. Such pages require line- or region-level hand attribution before they can be assigned safely.

## Optional Experimental Flask API

The following endpoints belong to `api.py`; they are not used by the public Jekyll page. To experiment with them locally, install `requirements.txt` and run `python scripts/analysis/api.py`.

### `GET /api/health`
Health check - returns `{"status": "ok"}`

### `GET /api/manuscripts`
List available manuscripts with transcriptions
```json
[
  {"slug": "ms-15636", "page_count": 458},
  ...
]
```

### `GET /api/load-transcription/<slug>`
Load full transcription text for a manuscript
```json
{
  "slug": "ms-15636",
  "text": "...",
  "length": 123456
}
```

### `POST /api/analyze`
Run TF-IDF + PCA analysis

**Request:**
```json
{
  "texts": [
    {"label": "Manuscript1", "text": "..."},
    {"label": "Manuscript2", "text": "..."}
  ],
  "config": {
    "ngram_type": "char",
    "ngram_size": 4,
    "min_df": 2,
    "max_df": 0.9,
    "lowercase": false,
    "chunk_size": 2000,
    "n_components": 3
  }
}
```

**Response:**
```json
{
  "chunks": [...],
  "pages": [...],
  "features": {
    "total": 5432,
    "top_features": [...]
  },
  "variance_explained": [0.25, 0.18, 0.12],
  "total_variance": 0.55,
  "classification": {
    "accuracy_mean": 0.92,
    "accuracy_std": 0.03
  }
}
```

## Example Use Cases

### 1. Scribe Comparison
Explore whether an anonymous manuscript resembles reference manuscripts:
- Load transcriptions from known scribes (Diemut, Scribe A, etc.)
- Load anonymous manuscript
- Run analysis with character 4-grams
- Inspect where the anonymous text falls in the exploratory plot

This visualization is exploratory and does not by itself establish authorship or scribal identity.

### 2. Historical Period Detection
Compare texts from different centuries:
- Upload samples from 12th, 13th, 14th centuries
- Use character 3-grams to capture orthographic changes
- View temporal clustering in PCA plot

### 3. Genre Classification
Compare different text types:
- Legal documents vs. religious texts vs. literary works
- Word 2-grams capture content differences
- View separation in feature space

### 4. Regional Variation
Compare manuscripts from different scriptoria:
- Group by production location
- Character 4-grams capture regional spelling
- Identify geographic clusters

## Troubleshooting

### API Won't Start
- Check Python version (3.8+ required)
- Install dependencies: `pip install -r requirements.txt`
- Check port 5001 isn't in use: `lsof -i :5001`

### "Could not load manuscripts" Error
- Verify `assets/search/manuscripts/index.json` exists
- Verify the selected per-manuscript JSON file exists
- Check the browser network panel for a failed static-file request

### Analysis Fails
- Need at least 2 texts
- Texts should have sufficient length (>500 characters)
- Try adjusting `min_df` and `max_df` parameters
- Check for empty texts in corpus

### Visualizations Don't Appear
- Verify Plotly CDN is accessible
- Check browser console for JavaScript errors
- Try refreshing the page

## Advanced Usage

### Batch Analysis Script

For analyzing multiple manuscripts programmatically:

```python
import requests

# Load texts
texts = [
    {"label": "MS1", "text": "..."},
    {"label": "MS2", "text": "..."}
]

# Run analysis
response = requests.post('http://localhost:5001/api/analyze', json={
    "texts": texts,
    "config": {
        "ngram_type": "char",
        "ngram_size": 4,
        "min_df": 2,
        "max_df": 0.9
    }
})

results = response.json()
print(f"Accuracy: {results['classification']['accuracy_mean']:.2f}")
```

### Custom Visualizations

Results include raw PCA coordinates - you can create custom plots:

```python
import plotly.graph_objects as go

# Extract coordinates
pages = results['pages']
x = [p['PC1'] for p in pages]
y = [p['PC2'] for p in pages]
labels = [p['label'] for p in pages]

# Custom 2D plot
fig = go.Figure(data=go.Scatter(x=x, y=y, text=labels, mode='markers+text'))
fig.show()
```

## Future Enhancements

- [x] Rolling stylometry (exploratory windowed comparison)
- [x] Hierarchical cluster analysis
- [x] Frequency-band bootstrap consensus with node support
- [ ] Export results (CSV, JSON)
- [ ] Save/load analysis sessions
- [x] Delta-family distances for rolling comparison and multi-sample clustering
- [ ] Burrows’ Delta as a validated supervised classifier with manuscript-level train/test separation
- [ ] Support for more languages
- [ ] Batch comparison mode

## References

- Burrows, J. (2002). "Delta: A measure of stylistic difference"
- Eder, M. et al. (2016). "Stylometry with R: A package for computational text analysis"
- TF-IDF: Salton & Buckley (1988)

## Credits

Created for the Unknown Hands project by Estelle Guéville, 2025.
