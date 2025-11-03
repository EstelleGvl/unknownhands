---
layout: page
title: Text Analysis
permalink: /text-analysis/
show_title: false
---

<style>
.analysis-container { max-width: 1600px; margin: 0 auto; padding: 0.5rem; }
.card { background: white; border-radius: 6px; padding: 0.75rem; margin-bottom: 0.75rem; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.card h3 { margin-top: 0; margin-bottom: 0.5rem; color: #333; font-size: 1.1rem; }
.card h4 { margin: 0.75rem 0 0.5rem 0; font-size: 1rem; }
.config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin: 0.75rem 0; }
.form-group { margin-bottom: 0.5rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.25rem; color: #555; font-size: 0.9rem; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.4rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; font-size: 0.9rem; }
.form-group textarea { min-height: 120px; font-family: monospace; }
.btn { padding: 0.6rem 1.2rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; transition: all 0.2s; font-size: 0.9rem; }
.btn-primary { background: #667eea; color: white; }
.btn-primary:hover { background: #5568d3; }
.btn-secondary { background: #48bb78; color: white; }
.btn-secondary:hover { background: #38a169; }
.btn-danger { background: #f56565; color: white; }
.btn-danger:hover { background: #e53e3e; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.corpus-item { background: #f7fafc; padding: 0.75rem; border-radius: 4px; margin-bottom: 0.5rem; border-left: 3px solid #667eea; }
.corpus-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.corpus-item-label { font-weight: 600; color: #333; }
.corpus-item-info { font-size: 0.875rem; color: #666; }
.results-section { margin-top: 2rem; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
.stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 8px; text-align: center; }
.stat-card-value { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
.stat-card-label { font-size: 0.875rem; opacity: 0.9; }
.error-message { background: #fed7d7; color: #c53030; padding: 0.75rem; border-radius: 4px; margin: 0.5rem 0; font-size: 0.9rem; }
.success-message { background: #c6f6d5; color: #2f855a; padding: 0.75rem; border-radius: 4px; margin: 0.5rem 0; font-size: 0.9rem; }
.loading { text-align: center; padding: 1rem; }
.spinner { border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.tabs { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 0.75rem; }
.tab { padding: 0.6rem 1.5rem; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; transition: all 0.2s; font-size: 0.95rem; }
.tab:hover { background: #f7fafc; }
.tab.active { color: #667eea; border-bottom-color: #667eea; }
.tab-content { display: none; }
.tab-content.active { display: block; }
#plot-container { min-height: 600px; }
.feature-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.9rem; }
.feature-table th, .feature-table td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
.feature-table th { background: #f7fafc; font-weight: 600; color: #555; }
.feature-table tr:hover { background: #f7fafc; }
.manuscript-list { max-height: 250px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.5rem; }
.manuscript-checkbox { display: flex; align-items: center; padding: 0.4rem; margin-bottom: 0.3rem; }
.manuscript-checkbox:hover { background: #f7fafc; }
.manuscript-checkbox input { margin-right: 0.5rem; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; margin: 0.75rem 0; }
.stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem; border-radius: 6px; text-align: center; }
.stat-card-value { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
.stat-card-label { font-size: 0.8rem; opacity: 0.9; }
</style>

<div class="analysis-container">
  <h1>📊 Text Analysis Laboratory</h1>
  <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">
    Perform TF-IDF analysis, PCA visualization, and stylometric comparison on manuscript transcriptions.
    Analyze texts from the database or upload your own corpus. All processing happens in your browser - no server required!
  </p>

  <!-- Tabs -->
  <div class="tabs">
    <div class="tab active" onclick="switchTab('select-corpus')">1. Select Corpus</div>
    <div class="tab" onclick="switchTab('configure')">2. Configure Analysis</div>
    <div class="tab" onclick="switchTab('results')">3. Results</div>
  </div>

  <!-- Tab 1: Select Corpus -->
  <div id="tab-select-corpus" class="tab-content active">
    <div class="card">
      <h3>Select Texts to Analyze</h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem;">
        <!-- Database Manuscripts -->
        <div>
          <h4 style="margin-bottom: 1rem;">📚 From Database</h4>
          <div id="manuscript-list" class="manuscript-list">
            <div class="loading">Loading manuscripts...</div>
          </div>
          <button class="btn btn-secondary" onclick="loadSelectedManuscripts()" style="margin-top: 1rem; width: 100%;">
            Load Selected Manuscripts
          </button>
        </div>

        <!-- Upload Custom Text -->
        <div>
          <h4 style="margin-bottom: 1rem;">📤 Upload Custom Text</h4>
          <div class="form-group">
            <label>Text Label/Name</label>
            <input type="text" id="custom-label" placeholder="e.g., My Manuscript">
          </div>
          <div class="form-group">
            <label>Text Content</label>
            <textarea id="custom-text" placeholder="Paste or type your text here..."></textarea>
          </div>
          <button class="btn btn-secondary" onclick="addCustomText()" style="width: 100%;">
            Add to Corpus
          </button>
          <div style="margin-top: 1rem;">
            <label class="form-group" style="display: flex; align-items: center; cursor: pointer;">
              <input type="file" id="file-upload" accept=".txt" multiple style="display: none;">
              <button class="btn btn-primary" onclick="document.getElementById('file-upload').click()" style="width: 100%;">
                📁 Upload .txt Files
              </button>
            </label>
          </div>
        </div>
      </div>

      <!-- Current Corpus -->
      <div style="margin-top: 2rem;">
        <h4>Current Corpus (<span id="corpus-count">0</span> texts)</h4>
        <div id="corpus-list"></div>
      </div>

      <button class="btn btn-primary" onclick="switchTab('configure')" style="margin-top: 1.5rem;">
        Next: Configure Analysis →
      </button>
    </div>
  </div>

  <!-- Tab 2: Configure Analysis -->
  <div id="tab-configure" class="tab-content">
    <div class="card">
      <h3>Analysis Configuration</h3>
      
      <div class="config-grid">
        <div class="form-group">
          <label>N-gram Type</label>
          <select id="config-ngram-type">
            <option value="char">Character n-grams</option>
            <option value="word">Word n-grams</option>
          </select>
          <small style="color: #666;">Character n-grams are better for stylometry</small>
        </div>

        <div class="form-group">
          <label>N-gram Size</label>
          <input type="number" id="config-ngram-size" value="4" min="1" max="10">
          <small style="color: #666;">Typical: 3-5 for characters, 1-3 for words</small>
        </div>

        <div class="form-group">
          <label>Minimum Document Frequency</label>
          <input type="number" id="config-min-df" value="2" min="1">
          <small style="color: #666;">Ignore features appearing in < N documents</small>
        </div>

        <div class="form-group">
          <label>Maximum Document Frequency</label>
          <input type="number" id="config-max-df" value="0.9" min="0" max="1" step="0.05">
          <small style="color: #666;">Ignore features appearing in > N% of documents</small>
        </div>

        <div class="form-group">
          <label>Chunk Size (characters)</label>
          <input type="number" id="config-chunk-size" value="2000" min="500" step="500">
          <small style="color: #666;">Split long texts into chunks of this size</small>
        </div>

        <div class="form-group">
          <label>PCA Components</label>
          <input type="number" id="config-n-components" value="3" min="2" max="10">
          <small style="color: #666;">Dimensions for visualization (2-3 recommended)</small>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" id="config-lowercase"> Convert to lowercase
          </label>
          <small style="color: #666; display: block; margin-top: 0.5rem;">
            Usually disabled for stylometry
          </small>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button class="btn btn-secondary" onclick="switchTab('select-corpus')">
          ← Back
        </button>
        <button class="btn btn-primary" onclick="runAnalysis()" id="run-analysis-btn">
          🚀 Run Analysis
        </button>
      </div>
    </div>
  </div>

  <!-- Tab 3: Results -->
  <div id="tab-results" class="tab-content">
    <div class="card">
      <h3>Analysis Results</h3>
      <div id="results-container">
        <p style="color: #666;">Run an analysis to see results here.</p>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/compromise@14.10.0/builds/compromise.min.js"></script>
<script>
const BASE_URL = '{{ site.baseurl }}' || '';
let corpus = [];
let analysisResults = null;

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  
  // Find and activate the tab button
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab, idx) => {
    if (tab.textContent.includes(tabName.replace('-', ' '))) {
      tab.classList.add('active');
    }
  });
  
  // Activate the tab content
  const tabContent = document.getElementById('tab-' + tabName);
  if (tabContent) {
    tabContent.classList.add('active');
  }
}

// Load available manuscripts
async function loadManuscripts() {
  try {
    // Load the search index which has transcription data
    const response = await fetch(`${BASE_URL}/assets/search/transcriptions.json`);
    const data = await response.json();
    
    // The JSON has two properties: docs (array of pages) and manuscripts (array of manuscript info)
    const searchDocs = data.docs || [];
    
    // Extract unique manuscripts with page counts
    const manuscripts = {};
    searchDocs.forEach(item => {
      if (!manuscripts[item.slug]) {
        manuscripts[item.slug] = {
          slug: item.slug,
          page_count: 0
        };
      }
      manuscripts[item.slug].page_count++;
    });
    
    const manuscriptList = Object.values(manuscripts);
    
    const listEl = document.getElementById('manuscript-list');
    if (manuscriptList.length === 0) {
      listEl.innerHTML = '<p style="color: #666;">No transcriptions available.</p>';
      return;
    }
    
    listEl.innerHTML = manuscriptList.map(ms => `
      <div class="manuscript-checkbox">
        <input type="checkbox" id="ms-${ms.slug}" value="${ms.slug}" data-pages="${ms.page_count}">
        <label for="ms-${ms.slug}" style="cursor: pointer; flex: 1;">
          <strong>${ms.slug}</strong>
          <span style="color: #666; font-size: 0.875rem;"> (${ms.page_count} pages)</span>
        </label>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading manuscripts:', error);
    document.getElementById('manuscript-list').innerHTML = `
      <div class="error-message">
        Could not load manuscripts. Error: ${error.message}
      </div>
    `;
  }
}

// Load selected manuscripts
async function loadSelectedManuscripts() {
  const checked = document.querySelectorAll('#manuscript-list input:checked');
  if (checked.length === 0) {
    alert('Please select at least one manuscript');
    return;
  }
  
  // Load search index to get all transcription text
  const response = await fetch(`${BASE_URL}/assets/search/transcriptions.json`);
  const data = await response.json();
  const searchDocs = data.docs || [];
  
  for (const checkbox of checked) {
    const slug = checkbox.value;
    if (corpus.find(c => c.label === slug)) {
      continue; // Already loaded
    }
    
    // Get all pages for this manuscript and concatenate text
    const pages = searchDocs.filter(item => item.slug === slug);
    const text = pages.map(p => p.text).join('\n');
    
    if (text) {
      corpus.push({
        label: slug,
        text: text,
        source: 'database'
      });
    }
  }
  
  updateCorpusList();
  checked.forEach(cb => cb.checked = false);
}

// Add custom text
function addCustomText() {
  const label = document.getElementById('custom-label').value.trim();
  const text = document.getElementById('custom-text').value.trim();
  
  if (!label || !text) {
    alert('Please provide both a label and text content');
    return;
  }
  
  corpus.push({ label, text, source: 'custom' });
  document.getElementById('custom-label').value = '';
  document.getElementById('custom-text').value = '';
  updateCorpusList();
}

// Handle file upload
function handleFileUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (text && text.trim()) {
        corpus.push({
          label: file.name.replace('.txt', ''),
          text: text,
          source: 'upload'
        });
        updateCorpusList();
      }
    };
    reader.onerror = (e) => {
      console.error('Error reading file:', file.name, e);
      alert(`Failed to read file: ${file.name}`);
    };
    reader.readAsText(file, 'UTF-8');
  });
  event.target.value = ''; // Reset input
}

// Update corpus list display
function updateCorpusList() {
  document.getElementById('corpus-count').textContent = corpus.length;
  
  const listEl = document.getElementById('corpus-list');
  if (corpus.length === 0) {
    listEl.innerHTML = '<p style="color: #666;">No texts added yet.</p>';
    return;
  }
  
  listEl.innerHTML = corpus.map((item, idx) => `
    <div class="corpus-item">
      <div class="corpus-item-header">
        <span class="corpus-item-label">${item.label}</span>
        <button class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="removeFromCorpus(${idx})">
          Remove
        </button>
      </div>
      <div class="corpus-item-info">
        Source: ${item.source} | Length: ${item.text.length.toLocaleString()} characters
      </div>
    </div>
  `).join('');
}

function removeFromCorpus(idx) {
  corpus.splice(idx, 1);
  updateCorpusList();
}

// ============================================================================
// CLIENT-SIDE ANALYSIS FUNCTIONS
// ============================================================================

// Helper: chunk text
function chunkText(text, chunkSize = 2000, minTailRatio = 0.6) {
  const len = text.length;
  if (len === 0) return [];
  if (len <= chunkSize) return [text];
  
  const chunks = [];
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = text.substring(i, i + chunkSize);
    if (i + chunkSize < len || chunk.length >= Math.floor(minTailRatio * chunkSize)) {
      chunks.push(chunk);
    }
  }
  return chunks;
}

// Helper: extract n-grams
function extractNgrams(text, n, type = 'char') {
  const ngrams = {};
  if (type === 'char') {
    for (let i = 0; i <= text.length - n; i++) {
      const ngram = text.substring(i, i + n);
      ngrams[ngram] = (ngrams[ngram] || 0) + 1;
    }
  } else if (type === 'word') {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    for (let i = 0; i <= words.length - n; i++) {
      const ngram = words.slice(i, i + n).join(' ');
      ngrams[ngram] = (ngrams[ngram] || 0) + 1;
    }
  }
  return ngrams;
}

// Calculate TF-IDF
function calculateTFIDF(documents, config) {
  const { ngram_type, ngram_size, min_df, max_df } = config;
  
  // Extract all n-grams from all documents
  const docNgrams = documents.map(doc => extractNgrams(doc, ngram_size, ngram_type));
  const N = documents.length;
  
  // Calculate document frequency for each n-gram
  const df = {};
  docNgrams.forEach(ngrams => {
    Object.keys(ngrams).forEach(ngram => {
      df[ngram] = (df[ngram] || 0) + 1;
    });
  });
  
  // Filter by min_df and max_df
  const features = Object.keys(df).filter(ngram => {
    const docFreq = df[ngram];
    return docFreq >= min_df && docFreq / N <= max_df;
  });
  
  // Calculate TF-IDF matrix
  const matrix = [];
  docNgrams.forEach(ngrams => {
    const vector = features.map(feature => {
      const tf = ngrams[feature] || 0;
      const idf = Math.log(N / (df[feature] || 1));
      return tf * idf;
    });
    
    // L2 normalization
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    const normalized = norm > 0 ? vector.map(v => v / norm) : vector;
    matrix.push(normalized);
  });
  
  return { matrix, features };
}

// Simple PCA using power iteration (for top k components)
function calculatePCA(matrix, nComponents = 3) {
  const n = matrix.length;
  const m = matrix[0].length;
  
  // Center the data
  const means = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      means[j] += matrix[i][j];
    }
  }
  for (let j = 0; j < m; j++) means[j] /= n;
  
  const centered = matrix.map(row => 
    row.map((val, j) => val - means[j])
  );
  
  // Compute covariance matrix
  const covariance = [];
  for (let i = 0; i < m; i++) {
    covariance[i] = [];
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += centered[k][i] * centered[k][j];
      }
      covariance[i][j] = sum / (n - 1);
    }
  }
  
  // Simple power iteration for top eigenvectors (approximation for speed)
  const components = [];
  const usedVectors = [];
  
  for (let comp = 0; comp < nComponents; comp++) {
    // Random initialization
    let vector = new Array(m);
    for (let i = 0; i < m; i++) {
      vector[i] = Math.random() - 0.5;
    }
    
    // Orthogonalize against previous components
    for (let prev of usedVectors) {
      let dot = 0;
      for (let i = 0; i < m; i++) {
        dot += vector[i] * prev[i];
      }
      for (let i = 0; i < m; i++) {
        vector[i] -= dot * prev[i];
      }
    }
    
    // Power iteration
    for (let iter = 0; iter < 50; iter++) {
      const newVector = new Array(m).fill(0);
      
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
          newVector[i] += covariance[i][j] * vector[j];
        }
      }
      
      // Normalize
      let norm = 0;
      for (let i = 0; i < m; i++) {
        norm += newVector[i] * newVector[i];
      }
      norm = Math.sqrt(norm);
      
      if (norm > 0) {
        for (let i = 0; i < m; i++) {
          vector[i] = newVector[i] / norm;
        }
      }
    }
    
    components.push(vector);
    usedVectors.push(vector);
  }
  
  // Project data onto components
  const reducedData = [];
  for (let i = 0; i < n; i++) {
    reducedData[i] = [];
    for (let comp = 0; comp < nComponents; comp++) {
      let sum = 0;
      for (let j = 0; j < m; j++) {
        sum += centered[i][j] * components[comp][j];
      }
      reducedData[i][comp] = sum;
    }
  }
  
  // Calculate explained variance for each component
  const componentVariances = [];
  for (let comp = 0; comp < nComponents; comp++) {
    let variance = 0;
    for (let i = 0; i < n; i++) {
      variance += reducedData[i][comp] * reducedData[i][comp];
    }
    componentVariances.push(variance / n);
  }
  
  const totalVariance = componentVariances.reduce((a, b) => a + b, 0);
  const explainedVar = componentVariances.map(v => v / totalVariance);
  
  return {
    transformed: reducedData,
    explained_variance: explainedVar,
    total_variance: totalVariance > 0 ? componentVariances.reduce((a, b) => a + b, 0) / totalVariance : 0
  };
}

// Run analysis
async function runAnalysis() {
  if (corpus.length < 2) {
    alert('Please add at least 2 texts to analyze');
    return;
  }
  
  const btn = document.getElementById('run-analysis-btn');
  btn.disabled = true;
  btn.textContent = 'Analyzing...';
  
  try {
    const config = {
      ngram_type: document.getElementById('config-ngram-type').value,
      ngram_size: parseInt(document.getElementById('config-ngram-size').value),
      min_df: parseInt(document.getElementById('config-min-df').value),
      max_df: parseFloat(document.getElementById('config-max-df').value),
      lowercase: document.getElementById('config-lowercase').checked,
      chunk_size: parseInt(document.getElementById('config-chunk-size').value),
      n_components: parseInt(document.getElementById('config-n-components').value)
    };
    
    console.log('Starting client-side analysis...', config);
    
    // Prepare corpus - chunk texts
    const chunks = [];
    const chunkMetadata = [];
    
    corpus.forEach(item => {
      let text = item.text;
      if (config.lowercase) text = text.toLowerCase();
      
      const textChunks = chunkText(text, config.chunk_size);
      textChunks.forEach((chunk, idx) => {
        chunks.push(chunk);
        chunkMetadata.push({
          label: item.label,
          chunk_idx: idx,
          text: chunk
        });
      });
    });
    
    console.log(`Prepared ${chunks.length} chunks from ${corpus.length} documents`);
    
    // Calculate TF-IDF
    btn.textContent = 'Computing TF-IDF...';
    const { matrix, features } = calculateTFIDF(chunks, config);
    console.log(`TF-IDF matrix: ${matrix.length} × ${features.length}`);
    
    // Calculate PCA
    btn.textContent = 'Computing PCA...';
    const actualComponents = Math.min(config.n_components, matrix.length - 1, features.length);
    const pca = calculatePCA(matrix, actualComponents);
    console.log(`PCA complete: ${actualComponents} components`);
    
    // Build results
    analysisResults = {
      chunks: [],
      pages: [],
      features: {
        total: features.length,
        top_features: []
      },
      variance_explained: pca.explained_variance,
      total_variance: pca.total_variance
    };
    
    // Per-chunk results
    chunkMetadata.forEach((meta, i) => {
      const point = {
        label: meta.label,
        chunk_idx: meta.chunk_idx,
        text_preview: meta.text.substring(0, 200) + (meta.text.length > 200 ? '...' : '')
      };
      for (let j = 0; j < actualComponents; j++) {
        point[`PC${j+1}`] = pca.transformed[i][j];
      }
      analysisResults.chunks.push(point);
    });
    
    // Per-document (average of chunks)
    const docData = {};
    chunkMetadata.forEach((meta, i) => {
      if (!docData[meta.label]) {
        docData[meta.label] = { points: [], label: meta.label };
      }
      docData[meta.label].points.push(pca.transformed[i]);
    });
    
    Object.values(docData).forEach(doc => {
      const avgPoint = {};
      avgPoint.label = doc.label;
      for (let j = 0; j < actualComponents; j++) {
        const sum = doc.points.reduce((s, p) => s + p[j], 0);
        avgPoint[`PC${j+1}`] = sum / doc.points.length;
      }
      analysisResults.pages.push(avgPoint);
    });
    
    // Find most distinctive features (highest variance)
    const featureVariances = features.map((feature, idx) => {
      const values = matrix.map(row => row[idx]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      return { feature, variance };
    });
    
    featureVariances.sort((a, b) => b.variance - a.variance);
    
    corpus.forEach(item => {
      analysisResults.features.top_features.push({
        class: item.label,
        features: featureVariances.slice(0, 25).map(f => ({
          feature: f.feature,
          weight: f.variance
        }))
      });
    });
    
    console.log('Analysis complete!', analysisResults);
    displayResults();
    switchTab('results');
    
  } catch (error) {
    console.error('Analysis failed:', error);
    alert('Analysis failed: ' + error.message + '\n\nCheck browser console (F12) for details.');
  } finally {
    btn.disabled = false;
    btn.textContent = '🚀 Run Analysis';
  }
}

// Display results
function displayResults() {
  const container = document.getElementById('results-container');
  
  if (!analysisResults) {
    container.innerHTML = '<div class="error-message">No results to display.</div>';
    return;
  }
  
  console.log('Displaying results...');
  
  // Statistics
  let html = '<div class="stat-grid">';
  html += `
    <div class="stat-card">
      <div class="stat-card-value">${analysisResults.features.total}</div>
      <div class="stat-card-label">Total Features</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${analysisResults.chunks.length}</div>
      <div class="stat-card-label">Text Chunks</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${analysisResults.pages.length}</div>
      <div class="stat-card-label">Documents</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${(analysisResults.total_variance * 100).toFixed(1)}%</div>
      <div class="stat-card-label">Variance Explained</div>
    </div>
  `;
  html += '</div>';
  
  // Classification results
  if (analysisResults.classification) {
    html += '<div class="success-message">';
    html += `<strong>Classification Accuracy:</strong> ${(analysisResults.classification.accuracy_mean * 100).toFixed(1)}% `;
    html += `(± ${(analysisResults.classification.accuracy_std * 100).toFixed(1)}%)`;
    html += '</div>';
  }
  
  // PCA Plot
  html += '<h4 style="margin-top: 2rem;">3D Visualization (PCA)</h4>';
  html += '<div id="plot-3d" style="height: 600px;"></div>';
  
  // Top features
  if (analysisResults.features.top_features.length > 0) {
    html += '<h4 style="margin-top: 2rem;">Most Discriminative Features</h4>';
    analysisResults.features.top_features.forEach(classFeatures => {
      html += `<h5>${classFeatures.class}</h5>`;
      html += '<table class="feature-table"><thead><tr><th>Feature</th><th>Weight</th></tr></thead><tbody>';
      classFeatures.features.slice(0, 15).forEach(f => {
        html += `<tr><td><code>${f.feature}</code></td><td>${f.weight.toFixed(3)}</td></tr>`;
      });
      html += '</tbody></table>';
    });
  }
  
  container.innerHTML = html;
  
  // Render 3D plot after DOM update
  setTimeout(() => render3DPlot(), 100);
}

function render3DPlot() {
  if (!analysisResults || !analysisResults.chunks || analysisResults.chunks.length === 0) {
    console.error('No PCA results to display');
    return;
  }
  
  const plotDiv = document.getElementById('plot-3d');
  if (!plotDiv) {
    console.error('Plot container not found');
    return;
  }
  
  console.log('Rendering 3D plot with', analysisResults.chunks.length, 'chunks and', analysisResults.pages.length, 'documents');
  
  // Create color palette
  const colors = ['#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea', '#38b2ac', '#ecc94b', '#ed64a6'];
  const uniqueLabels = [...new Set(analysisResults.chunks.map(c => c.label))];
  const colorMap = {};
  uniqueLabels.forEach((label, i) => {
    colorMap[label] = colors[i % colors.length];
  });
  
  const data = [];
  
  // Plot individual chunks (smaller, semi-transparent)
  uniqueLabels.forEach(label => {
    const points = analysisResults.chunks.filter(c => c.label === label);
    data.push({
      x: points.map(p => p.PC1),
      y: points.map(p => p.PC2),
      z: points.map(p => p.PC3),
      text: points.map(p => `${p.label} (chunk ${p.chunk_idx})`),
      mode: 'markers',
      marker: {
        size: 4,
        color: colorMap[label],
        opacity: 0.3,
        line: { width: 0 }
      },
      name: label + ' (chunks)',
      type: 'scatter3d',
      showlegend: false,
      hoverinfo: 'text'
    });
  });
  
  // Plot document centers (larger, opaque)
  data.push({
    x: analysisResults.pages.map(p => p.PC1),
    y: analysisResults.pages.map(p => p.PC2),
    z: analysisResults.pages.map(p => p.PC3),
    text: analysisResults.pages.map(p => p.label),
    mode: 'markers+text',
    marker: {
      size: 12,
      color: analysisResults.pages.map(p => colorMap[p.label]),
      opacity: 1,
      line: { width: 2, color: 'white' },
      symbol: 'diamond'
    },
    textposition: 'top center',
    textfont: { size: 10 },
    name: 'Document Centers',
    type: 'scatter3d',
    hoverinfo: 'text'
  });
  
  const layout = {
    title: '3D PCA Visualization (Chunks + Document Centers)',
    scene: {
      xaxis: { title: 'PC1' },
      yaxis: { title: 'PC2' },
      zaxis: { title: 'PC3' }
    },
    height: 700,
    showlegend: true,
    legend: {
      x: 1,
      y: 0.5
    }
  };
  
  Plotly.newPlot('plot-3d', data, layout);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Load manuscripts on page load
  loadManuscripts();
  
  // Attach file upload handler
  const fileInput = document.getElementById('file-upload');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
});
</script>
