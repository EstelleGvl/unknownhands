# Text Analysis Module

This module provides TF-IDF analysis, PCA visualization, and stylometric comparison for manuscript transcriptions.

## 🎉 NEW: Client-Side Analysis (No Server Required!)

The text analysis page now runs **entirely in your browser** using JavaScript. No Python server needed for basic usage!

- ✅ Works on any device with a modern browser
- ✅ No installation required
- ✅ Privacy-friendly (data never leaves your computer)
- ✅ Instant results

Just visit the page and start analyzing: `/text-analysis/`

## Features

- **TF-IDF Analysis**: Character or word n-gram frequency analysis
- **PCA Visualization**: 3D scatter plots showing text similarity
- **Classification**: Automatic scribe/author attribution with accuracy metrics
- **Feature Analysis**: View most discriminative n-grams per text
- **Flexible Input**: Use database transcriptions or upload custom texts

## Setup

### 1. Install Python Dependencies

```bash
cd scripts/analysis
pip install -r requirements.txt
```

Or if using conda:
```bash
conda install flask flask-cors scikit-learn pandas numpy scipy
```

### 2. Start the API Server

```bash
python scripts/analysis/api.py
```

The API will start at `http://localhost:5001`

### 3. Build and Serve Jekyll Site

In another terminal:
```bash
jekyll serve
```

Then visit `http://localhost:4000/unknownhands/text-analysis/`

## Usage

### Analyzing Database Transcriptions

1. Navigate to **Explore → Text Analysis**
2. In the "From Database" section, select manuscripts with transcriptions
3. Click "Load Selected Manuscripts"
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

- **Chunk Size**: Split long texts into chunks (2000 characters typical)

- **PCA Components**: Number of dimensions (2-3 for visualization)

## API Endpoints

### `GET /api/health`
Health check - returns `{"status": "ok"}`

### `GET /api/manuscripts`
List available manuscripts with transcriptions
```json
[
  {"slug": "irht-fr1dgmfio4zw", "page_count": 458},
  ...
]
```

### `GET /api/load-transcription/<slug>`
Load full transcription text for a manuscript
```json
{
  "slug": "irht-fr1dgmfio4zw",
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

### 1. Scribe Attribution
Compare known scribes to attribute anonymous manuscripts:
- Load transcriptions from known scribes (Diemut, Scribe A, etc.)
- Load anonymous manuscript
- Run analysis with character 4-grams
- Check which cluster the anonymous text falls into

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
- Ensure API is running: `python scripts/analysis/api.py`
- Check CORS is enabled (flask-cors installed)
- Verify transcriptions exist in `data/transcriptions/`

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

- [ ] Rolling stylometry (windowed analysis)
- [ ] Delta distance metrics
- [ ] Dendrogram clustering
- [ ] Export results (CSV, JSON)
- [ ] Save/load analysis sessions
- [ ] Burrows Delta implementation
- [ ] Support for more languages
- [ ] Batch comparison mode

## References

- Burrows, J. (2002). "Delta: A measure of stylistic difference"
- Eder, M. et al. (2016). "Stylometry with R: A package for computational text analysis"
- TF-IDF: Salton & Buckley (1988)

## Credits

Created for the Unknown Hands project by Estelle Guéville, 2025.
