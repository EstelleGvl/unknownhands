---
layout: page
title: Text Analysis
permalink: /text-analysis/
show_title: false
---

<style>
.analysis-container { max-width: 100%; margin: 0; padding: 0; }
.card { background: white; border-radius: 4px; padding: 0.5rem; margin-bottom: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.card h3 { margin-top: 0; margin-bottom: 0.4rem; color: #333; font-size: 1rem; }
.card h4 { margin: 0.5rem 0 0.4rem 0; font-size: 0.95rem; }
.config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin: 0.5rem 0; }
.form-group { margin-bottom: 0.4rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.2rem; color: #555; font-size: 0.85rem; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.35rem; border: 1px solid #ddd; border-radius: 3px; font-family: inherit; font-size: 0.85rem; }
.form-group textarea { min-height: 100px; font-family: monospace; }
.btn { padding: 0.5rem 1rem; border: none; border-radius: 3px; cursor: pointer; font-weight: 600; transition: all 0.2s; font-size: 0.85rem; }
.btn-primary { background: #667eea; color: white; }
.btn-primary:hover { background: #5568d3; }
.btn-secondary { background: #48bb78; color: white; }
.btn-secondary:hover { background: #38a169; }
.btn-danger { background: #f56565; color: white; }
.btn-danger:hover { background: #e53e3e; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.corpus-item { background: #f7fafc; padding: 0.5rem; border-radius: 3px; margin-bottom: 0.4rem; border-left: 3px solid #667eea; }
.corpus-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
.corpus-item-label { font-weight: 600; color: #333; font-size: 0.9rem; }
.corpus-item-info { font-size: 0.8rem; color: #666; }
.results-section { margin-top: 1rem; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; margin: 0.5rem 0; }
.stat-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.8rem; border-radius: 5px; text-align: center; }
.stat-card-value { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.2rem; }
.stat-card-label { font-size: 0.75rem; opacity: 0.9; }
.error-message { background: #fed7d7; color: #c53030; padding: 0.5rem; border-radius: 3px; margin: 0.4rem 0; font-size: 0.85rem; }
.success-message { background: #c6f6d5; color: #2f855a; padding: 0.5rem; border-radius: 3px; margin: 0.4rem 0; font-size: 0.85rem; }
.loading { text-align: center; padding: 0.8rem; }
.spinner { border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 35px; height: 35px; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.tabs { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 0.5rem; }
.tab { padding: 0.5rem 1.2rem; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; transition: all 0.2s; font-size: 0.9rem; }
.tab:hover { background: #f7fafc; }
.tab.active { color: #667eea; border-bottom-color: #667eea; }
.tab-content { display: none; }
.tab-content.active { display: block; }
#plot-container { min-height: 550px; }
.feature-table { width: 100%; border-collapse: collapse; margin-top: 0.4rem; font-size: 0.85rem; }
.feature-table th, .feature-table td { padding: 0.4rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
.feature-table th { background: #f7fafc; font-weight: 600; color: #555; }
.feature-table tr:hover { background: #f7fafc; }
.manuscript-list { max-height: 220px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 3px; padding: 0.4rem; }
.manuscript-checkbox { display: flex; align-items: center; padding: 0.3rem; margin-bottom: 0.25rem; }
.manuscript-checkbox:hover { background: #f7fafc; }
.manuscript-checkbox input { margin-right: 0.4rem; }
.analysis-section { display: none; }
.analysis-section.active { display: block; }
.loading-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  background: rgba(0, 0, 0, 0.7); 
  display: none; 
  justify-content: center; 
  align-items: center; 
  z-index: 9999;
  flex-direction: column;
  gap: 1rem;
}
.loading-overlay.active { display: flex; }
.loading-spinner { 
  border: 5px solid #f3f3f3; 
  border-top: 5px solid #667eea; 
  border-radius: 50%; 
  width: 60px; 
  height: 60px; 
  animation: spin 1s linear infinite; 
}
.loading-text { 
  color: white; 
  font-size: 1.2rem; 
  font-weight: 600; 
  text-align: center;
  max-width: 400px;
}
.loading-subtext {
  color: #e2e8f0;
  font-size: 0.9rem;
  text-align: center;
}
</style>

<!-- Loading Overlay -->
<div id="loading-overlay" class="loading-overlay">
  <div class="loading-spinner"></div>
  <div class="loading-text" id="loading-text">Processing...</div>
  <div class="loading-subtext" id="loading-subtext">Please wait</div>
</div>

<div class="analysis-container">
  <h1 style="font-size: 1.4rem; margin: 0.5rem 0;">📊 Text Analysis Laboratory</h1>
  <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.8rem;">
    Perform various stylometric and computational text analyses on manuscript transcriptions.
    All processing happens in your browser - no server required!
  </p>

  <!-- Main Analysis Type Tabs -->
  <div class="tabs">
    <div class="tab active" onclick="switchAnalysisType('tfidf-pca')">TF-IDF / PCA</div>
    <div class="tab" onclick="switchAnalysisType('rolling-stylo')">Rolling Stylometry</div>
    <div class="tab" onclick="switchAnalysisType('burrows-delta')" style="opacity: 0.5; cursor: not-allowed;" title="Coming soon">Burrows' Delta</div>
  </div>

  <!-- ========================================================================= -->
  <!-- TF-IDF / PCA ANALYSIS -->
  <!-- ========================================================================= -->
  <div id="analysis-tfidf-pca" class="analysis-section active">
    <div class="card">
      <h3>TF-IDF / PCA Analysis - Exploratory Unsupervised Analysis</h3>
      <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.8rem;">
        Add multiple texts to explore stylistic patterns. Use meaningful labels (e.g., <code>ms123_500pp_france_1450</code>) 
        to help identify patterns in the visualization. Best for exploring relationships between 3+ texts.
      </p>
      
      <!-- Sub-tabs for TF-IDF/PCA workflow -->
      <div class="tabs" style="font-size: 0.85rem;">
        <div class="tab active" onclick="switchTab('tfidf', 'select-corpus')">1. Select Corpus</div>
        <div class="tab" onclick="switchTab('tfidf', 'configure')">2. Configure</div>
        <div class="tab" onclick="switchTab('tfidf', 'results')">3. Results</div>
      </div>

      <!-- TF-IDF: Select Corpus -->
      <div id="tab-tfidf-select-corpus" class="tab-content active">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.8rem;">
          <!-- Database Manuscripts -->
          <div>
            <h4 style="margin-bottom: 0.6rem;">📚 From Database</h4>
            <div id="tfidf-manuscript-list" class="manuscript-list">
              <div class="loading">Loading manuscripts...</div>
            </div>
            <div class="form-group" style="margin-top: 0.6rem; padding: 0.5rem; background: #f7fafc; border-radius: 4px;">
              <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">
                Manuscript Granularity
              </label>
              <div style="display: flex; gap: 1rem;">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.85rem;">
                  <input type="radio" name="tfidf-granularity" value="manuscript" checked style="margin-right: 0.3rem;">
                  Entire manuscript
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.85rem;">
                  <input type="radio" name="tfidf-granularity" value="page" style="margin-right: 0.3rem;">
                  Each page separately
                </label>
              </div>
              <small style="color: #666; font-size: 0.75rem; display: block; margin-top: 0.3rem;">
                "Each page separately" helps detect scribal changes within a manuscript by clustering similar pages.
              </small>
            </div>
            <button class="btn btn-secondary" onclick="loadSelectedManuscriptsTFIDF()" style="margin-top: 0.6rem; width: 100%;">
              Load Selected Manuscripts
            </button>
          </div>

          <!-- Upload Custom Text -->
          <div>
            <h4 style="margin-bottom: 0.6rem;">📤 Upload Custom Text</h4>
            <div class="form-group">
              <label>Text Label (use metadata: ms_pages_location_date)</label>
              <input type="text" id="tfidf-custom-label" placeholder="e.g., ms456_300pp_italy_1475">
            </div>
            <div class="form-group">
              <label>Text Content</label>
              <textarea id="tfidf-custom-text" placeholder="Paste or type your text here..."></textarea>
            </div>
            <button class="btn btn-secondary" onclick="addCustomTextTFIDF()" style="width: 100%;">
              Add to Corpus
            </button>
            <div style="margin-top: 0.6rem;">
              <label class="form-group" style="display: flex; align-items: center; cursor: pointer;">
                <input type="file" id="tfidf-file-upload" accept=".txt" multiple style="display: none;">
                <button class="btn btn-primary" onclick="document.getElementById('tfidf-file-upload').click()" style="width: 100%;">
                  📁 Upload .txt Files
                </button>
              </label>
            </div>
          </div>
        </div>

        <!-- Current Corpus -->
        <div style="margin-top: 1rem;">
          <h4>Current Corpus (<span id="tfidf-corpus-count">0</span> texts) - Minimum 3 recommended</h4>
          <div id="tfidf-corpus-list"></div>
        </div>

        <button class="btn btn-primary" onclick="switchTab('tfidf', 'configure')" style="margin-top: 0.8rem;">
          Next: Configure Analysis →
        </button>
      </div>

      <!-- TF-IDF: Configure -->
      <div id="tab-tfidf-configure" class="tab-content">
        <div class="config-grid" style="margin-top: 0.8rem;">
          <div class="form-group">
            <label>N-gram Type</label>
            <select id="tfidf-config-ngram-type">
              <option value="char">Character n-grams</option>
              <option value="word">Word n-grams</option>
            </select>
            <small style="color: #666; font-size: 0.75rem;">Character n-grams capture writing style</small>
          </div>

          <div class="form-group">
            <label>N-gram Size</label>
            <input type="number" id="tfidf-config-ngram-size" value="4" min="1" max="10">
            <small style="color: #666; font-size: 0.75rem;">3-5 for characters, 1-3 for words</small>
          </div>

          <div class="form-group">
            <label>Min Document Frequency</label>
            <input type="number" id="tfidf-config-min-df" value="2" min="1">
            <small style="color: #666; font-size: 0.75rem;">Ignore rare features (< N docs)</small>
          </div>

          <div class="form-group">
            <label>Max Document Frequency</label>
            <input type="number" id="tfidf-config-max-df" value="0.9" min="0" max="1" step="0.05">
            <small style="color: #666; font-size: 0.75rem;">Ignore common features (> N%)</small>
          </div>

          <div class="form-group">
            <label>Chunk Size (characters)</label>
            <input type="number" id="tfidf-config-chunk-size" value="2000" min="500" step="500">
            <small style="color: #666; font-size: 0.75rem;">Split texts into chunks</small>
          </div>

          <div class="form-group">
            <label>PCA Components</label>
            <input type="number" id="tfidf-config-n-components" value="3" min="2" max="10">
            <small style="color: #666; font-size: 0.75rem;">2D or 3D visualization</small>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="tfidf-config-lowercase"> Convert to lowercase
            </label>
            <small style="color: #666; display: block; margin-top: 0.3rem; font-size: 0.75rem;">
              Usually disabled for stylometry
            </small>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; margin-top: 1rem;">
          <button class="btn btn-secondary" onclick="switchTab('tfidf', 'select-corpus')">
            ← Back
          </button>
          <button class="btn btn-primary" onclick="runTFIDFAnalysis()" id="tfidf-run-btn">
            🚀 Run Analysis
          </button>
        </div>
      </div>

      <!-- TF-IDF: Results -->
      <div id="tab-tfidf-results" class="tab-content">
        <div id="tfidf-results-container">
          <p style="color: #666;">Run an analysis to see results here.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- ROLLING STYLOMETRY ANALYSIS -->
  <!-- ========================================================================= -->
  <div id="analysis-rolling-stylo" class="analysis-section" style="display: none;">
    <div class="card">
      <h3>Rolling Stylometry - Authorship Attribution</h3>
      <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.8rem;">
        Compare a disputed/unknown text against reference corpora to detect stylistic shifts. 
        The analysis slides a window through the test text and measures similarity to each reference corpus at each position.
      </p>

      <!-- Sub-tabs for Rolling Stylo workflow -->
      <div class="tabs" style="font-size: 0.85rem;">
        <div class="tab active" onclick="switchTab('rolling', 'setup')">1. Setup Corpora</div>
        <div class="tab" onclick="switchTab('rolling', 'configure')">2. Configure</div>
        <div class="tab" onclick="switchTab('rolling', 'results')">3. Results</div>
      </div>

      <!-- Rolling: Setup -->
      <div id="tab-rolling-setup" class="tab-content active">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 0.8rem;">
          
          <!-- Reference Corpus A -->
          <div style="border: 2px solid #667eea; border-radius: 4px; padding: 0.6rem;">
            <h4 style="margin-bottom: 0.6rem; color: #667eea;">📖 Reference Corpus A</h4>
            <div class="form-group">
              <label>Corpus A Label</label>
              <input type="text" id="rolling-corpus-a-label" placeholder="e.g., Author A" value="Corpus A">
            </div>
            <div class="form-group">
              <label>Select from database or upload:</label>
              <select id="rolling-corpus-a-source" class="manuscript-list" style="max-height: 120px;" multiple>
              </select>
            </div>
            <button class="btn btn-secondary" onclick="loadManuscriptRolling('a')" style="width: 100%; font-size: 0.8rem;">
              Load Selected
            </button>
            <div class="form-group" style="margin-top: 0.6rem;">
              <label>Or paste text:</label>
              <textarea id="rolling-corpus-a-text" placeholder="Paste reference text A..." style="min-height: 80px;"></textarea>
            </div>
            <button class="btn btn-primary" onclick="addCustomCorpusRolling('a')" style="width: 100%; font-size: 0.8rem;">
              Add Custom Text
            </button>
            <div id="rolling-corpus-a-status" style="margin-top: 0.4rem; font-size: 0.8rem; color: #666;">
              No text loaded
            </div>
          </div>

          <!-- Reference Corpus B -->
          <div style="border: 2px solid #48bb78; border-radius: 4px; padding: 0.6rem;">
            <h4 style="margin-bottom: 0.6rem; color: #48bb78;">📖 Reference Corpus B</h4>
            <div class="form-group">
              <label>Corpus B Label</label>
              <input type="text" id="rolling-corpus-b-label" placeholder="e.g., Author B" value="Corpus B">
            </div>
            <div class="form-group">
              <label>Select from database or upload:</label>
              <select id="rolling-corpus-b-source" class="manuscript-list" style="max-height: 120px;" multiple>
              </select>
            </div>
            <button class="btn btn-secondary" onclick="loadManuscriptRolling('b')" style="width: 100%; font-size: 0.8rem;">
              Load Selected
            </button>
            <div class="form-group" style="margin-top: 0.6rem;">
              <label>Or paste text:</label>
              <textarea id="rolling-corpus-b-text" placeholder="Paste reference text B..." style="min-height: 80px;"></textarea>
            </div>
            <button class="btn btn-primary" onclick="addCustomCorpusRolling('b')" style="width: 100%; font-size: 0.8rem;">
              Add Custom Text
            </button>
            <div id="rolling-corpus-b-status" style="margin-top: 0.4rem; font-size: 0.8rem; color: #666;">
              No text loaded
            </div>
          </div>

          <!-- Test Text -->
          <div style="border: 2px solid #ed8936; border-radius: 4px; padding: 0.6rem;">
            <h4 style="margin-bottom: 0.6rem; color: #ed8936;">🔍 Test Text (to analyze)</h4>
            <div class="form-group">
              <label>Test Text Label</label>
              <input type="text" id="rolling-test-label" placeholder="e.g., Disputed Work" value="Test Text">
            </div>
            <div class="form-group">
              <label>Select from database or upload:</label>
              <select id="rolling-test-source" class="manuscript-list" style="max-height: 120px;" multiple>
              </select>
            </div>
            <button class="btn btn-secondary" onclick="loadManuscriptRolling('test')" style="width: 100%; font-size: 0.8rem;">
              Load Selected
            </button>
            <div class="form-group" style="margin-top: 0.6rem;">
              <label>Or paste text:</label>
              <textarea id="rolling-test-text" placeholder="Paste text to analyze..." style="min-height: 80px;"></textarea>
            </div>
            <button class="btn btn-primary" onclick="addCustomCorpusRolling('test')" style="width: 100%; font-size: 0.8rem;">
              Add Custom Text
            </button>
            <div id="rolling-test-status" style="margin-top: 0.4rem; font-size: 0.8rem; color: #666;">
              No text loaded
            </div>
          </div>

        </div>

        <button class="btn btn-primary" onclick="switchTab('rolling', 'configure')" style="margin-top: 0.8rem;">
          Next: Configure Analysis →
        </button>
      </div>

      <!-- Rolling: Configure -->
      <div id="tab-rolling-configure" class="tab-content">
        <div class="config-grid" style="margin-top: 0.8rem;">
          <div class="form-group">
            <label>Window Size (words)</label>
            <input type="number" id="rolling-config-window-size" value="5000" min="1000" step="500">
            <small style="color: #666; font-size: 0.75rem;">Size of sliding window</small>
          </div>

          <div class="form-group">
            <label>Step Size (words)</label>
            <input type="number" id="rolling-config-step-size" value="500" min="100" step="100">
            <small style="color: #666; font-size: 0.75rem;">How far to move window each step</small>
          </div>

          <div class="form-group">
            <label>N-gram Type</label>
            <select id="rolling-config-ngram-type">
              <option value="char">Character n-grams</option>
              <option value="word">Word n-grams</option>
            </select>
            <small style="color: #666; font-size: 0.75rem;">Feature type for comparison</small>
          </div>

          <div class="form-group">
            <label>N-gram Size</label>
            <input type="number" id="rolling-config-ngram-size" value="4" min="1" max="10">
            <small style="color: #666; font-size: 0.75rem;">3-5 for characters, 1-3 for words</small>
          </div>

          <div class="form-group">
            <label>Number of Features (MFW)</label>
            <input type="number" id="rolling-config-mfw" value="100" min="50" max="1000" step="50">
            <small style="color: #666; font-size: 0.75rem;">Most Frequent Words/n-grams to use</small>
          </div>

          <div class="form-group">
            <label>Distance Metric</label>
            <select id="rolling-config-distance">
              <option value="cosine">Cosine Distance</option>
              <option value="manhattan">Manhattan Distance</option>
              <option value="euclidean">Euclidean Distance</option>
            </select>
            <small style="color: #666; font-size: 0.75rem;">How to measure similarity</small>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="rolling-config-lowercase" checked> Convert to lowercase
            </label>
            <small style="color: #666; display: block; margin-top: 0.3rem; font-size: 0.75rem;">
              Recommended for word-based analysis
            </small>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; margin-top: 1rem;">
          <button class="btn btn-secondary" onclick="switchTab('rolling', 'setup')">
            ← Back
          </button>
          <button class="btn btn-primary" onclick="runRollingStyloAnalysis()" id="rolling-run-btn">
            🚀 Run Rolling Analysis
          </button>
        </div>
      </div>

      <!-- Rolling: Results -->
      <div id="tab-rolling-results" class="tab-content">
        <div id="rolling-results-container">
          <p style="color: #666;">Run an analysis to see results here.</p>
        </div>
      </div>
    </div>
  </div>

</div>

<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/compromise@14.10.0/builds/compromise.min.js"></script>
<script>
const BASE_URL = '{{ site.baseurl }}' || '';

// ============================================================================
// GLOBAL STATE
// ============================================================================
let tfidfCorpus = [];
let rollingCorpusA = null;
let rollingCorpusB = null;
let rollingTestText = null;
let tfidfResults = null;
let rollingResults = null;

// ============================================================================
// LOADING OVERLAY FUNCTIONS
// ============================================================================

function showLoading(mainText = 'Processing...', subText = 'Please wait') {
  const overlay = document.getElementById('loading-overlay');
  const textEl = document.getElementById('loading-text');
  const subTextEl = document.getElementById('loading-subtext');
  
  if (textEl) textEl.textContent = mainText;
  if (subTextEl) subTextEl.textContent = subText;
  if (overlay) overlay.classList.add('active');
}

function updateLoading(mainText, subText) {
  const textEl = document.getElementById('loading-text');
  const subTextEl = document.getElementById('loading-subtext');
  
  if (textEl) textEl.textContent = mainText;
  if (subText && subTextEl) subTextEl.textContent = subText;
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('active');
}

function showSuccessMessage(message, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = 'success-message';
  msgDiv.textContent = message;
  container.parentNode.insertBefore(msgDiv, container.nextSibling);
  
  setTimeout(() => msgDiv.remove(), 3000);
}

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

// Switch between analysis types (TF-IDF/PCA, Rolling Stylo, etc.)
function switchAnalysisType(type) {
  // Update tabs
  const clickedTab = event ? event.target : null;
  document.querySelectorAll('.analysis-container > .tabs .tab').forEach(t => t.classList.remove('active'));
  if (clickedTab) {
    clickedTab.classList.add('active');
  }
  
  // Hide all analysis sections
  document.querySelectorAll('.analysis-section').forEach(s => s.style.display = 'none');
  
  // Show selected section
  const section = document.getElementById(`analysis-${type}`);
  if (section) {
    section.style.display = 'block';
  }
}

// Switch between sub-tabs within an analysis type
function switchTab(analysisType, tabName) {
  const prefix = `${analysisType}-`;
  
  // Update tab buttons within this analysis section
  const analysisSection = document.getElementById(`analysis-${analysisType === 'tfidf' ? 'tfidf-pca' : 'rolling-stylo'}`);
  if (!analysisSection) return;
  
  const clickedTab = event ? event.target : null;
  analysisSection.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  if (clickedTab) {
    clickedTab.classList.add('active');
  }
  
  // Update tab content
  analysisSection.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  const targetTab = document.getElementById(`tab-${prefix}${tabName}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

// ============================================================================
// TF-IDF/PCA ANALYSIS FUNCTIONS
// ============================================================================

// Load available manuscripts for TF-IDF
async function loadManuscriptsTFIDF() {
  try {
    // Load the search index which has transcription data
    const response = await fetch(`${BASE_URL}/assets/search/transcriptions.json`);
    const data = await response.json();
    
    // The JSON has docs (array of LINE entries, not pages)
    // Each line has an ID like "manuscript::page::line"
    const searchDocs = data.docs || [];
    
    // Extract unique manuscripts with ACTUAL page counts (not line counts)
    const manuscripts = {};
    searchDocs.forEach(item => {
      if (!item.id || !item.slug) return;
      
      // Parse the ID to get page identifier (manuscript::page)
      const idParts = item.id.split('::');
      if (idParts.length < 2) return;
      const pageId = `${idParts[0]}::${idParts[1]}`;
      
      if (!manuscripts[item.slug]) {
        manuscripts[item.slug] = {
          slug: item.slug,
          pages: new Set()
        };
      }
      manuscripts[item.slug].pages.add(pageId);
    });
    
    // Convert to list with page counts
    const manuscriptList = Object.values(manuscripts).map(ms => ({
      slug: ms.slug,
      page_count: ms.pages.size
    }));
    
    const listEl = document.getElementById('tfidf-manuscript-list');
    if (manuscriptList.length === 0) {
      listEl.innerHTML = '<p style="color: #666;">No transcriptions available.</p>';
      return;
    }
    
    listEl.innerHTML = manuscriptList.map(ms => `
      <div class="manuscript-checkbox">
        <input type="checkbox" id="tfidf-ms-${ms.slug}" value="${ms.slug}" data-pages="${ms.page_count}">
        <label for="tfidf-ms-${ms.slug}" style="cursor: pointer; flex: 1;">
          <strong>${ms.slug}</strong>
          <span style="color: #666; font-size: 0.875rem;"> (${ms.page_count} pages)</span>
        </label>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading manuscripts:', error);
    document.getElementById('tfidf-manuscript-list').innerHTML = `
      <div class="error-message">
        Could not load manuscripts. Error: ${error.message}
      </div>
    `;
  }
}

// Load selected manuscripts for TF-IDF
async function loadSelectedManuscriptsTFIDF() {
  const checked = document.querySelectorAll('#tfidf-manuscript-list input:checked');
  if (checked.length === 0) {
    alert('Please select at least one manuscript');
    return;
  }
  
  // Check granularity option
  const granularity = document.querySelector('input[name="tfidf-granularity"]:checked').value;
  const isPageLevel = granularity === 'page';
  
  // Show loading
  showLoading('Loading manuscripts...', 'Fetching transcription data');
  
  try {
    // Load search index to get all transcription text (contains LINES, not pages)
    const response = await fetch(`${BASE_URL}/assets/search/transcriptions.json`);
    const data = await response.json();
    const searchDocs = data.docs || [];
    
    let addedCount = 0;
    
    for (const checkbox of checked) {
      const slug = checkbox.value;
      
      // Group lines by page
      const pageMap = {};
      searchDocs.filter(item => item.slug === slug).forEach(line => {
        if (!line.id) return;
        const idParts = line.id.split('::');
        if (idParts.length < 2) return;
        const pageId = `${idParts[0]}::${idParts[1]}`;
        
        if (!pageMap[pageId]) {
          pageMap[pageId] = [];
        }
        if (line.text) {
          pageMap[pageId].push(line.text);
        }
      });
      
      if (isPageLevel) {
        // Add each page as a separate document
        updateLoading(`Processing ${slug}...`, `Adding ${Object.keys(pageMap).length} pages separately`);
        
        Object.entries(pageMap).forEach(([pageId, lines]) => {
          // Extract page number from pageId (manuscript::pageNum)
          const pageNum = pageId.split('::')[1];
          const label = `${slug}_page_${pageNum}`;
          
          // Check if already loaded
          if (!tfidfCorpus.find(c => c.label === label)) {
            const text = lines.join(' ');
            if (text.trim()) {
              tfidfCorpus.push({
                label: label,
                text: text,
                source: 'database',
                manuscript: slug,
                page: pageNum
              });
              addedCount++;
            }
          }
        });
      } else {
        // Add entire manuscript as one document
        if (tfidfCorpus.find(c => c.label === slug)) {
          continue; // Already loaded
        }
        
        updateLoading(`Processing ${slug}...`, 'Concatenating all pages');
        
        // Concatenate all pages into one text (each page's lines joined with space, pages with newline)
        const text = Object.values(pageMap)
          .map(lines => lines.join(' '))
          .join('\n');
        
        if (text.trim()) {
          tfidfCorpus.push({
            label: slug,
            text: text,
            source: 'database',
            page_count: Object.keys(pageMap).length
          });
          addedCount++;
        }
      }
    }
    
    updateCorpusListTFIDF();
    checked.forEach(cb => cb.checked = false);
    
    hideLoading();
    
    if (addedCount > 0) {
      const unit = isPageLevel ? 'page(s)' : 'manuscript(s)';
      showSuccessMessage(`Added ${addedCount} ${unit} to corpus`, 'tfidf-manuscript-list');
    }
  } catch (error) {
    hideLoading();
    console.error('Error loading manuscripts:', error);
    alert('Failed to load manuscripts: ' + error.message);
  }
}

// Add custom text to TF-IDF corpus
function addCustomTextTFIDF() {
  const label = document.getElementById('tfidf-custom-label').value.trim();
  const text = document.getElementById('tfidf-custom-text').value.trim();
  
  if (!label || !text) {
    alert('Please provide both a label and text content');
    return;
  }
  
  tfidfCorpus.push({ label, text, source: 'custom' });
  document.getElementById('tfidf-custom-label').value = '';
  document.getElementById('tfidf-custom-text').value = '';
  updateCorpusListTFIDF();
}

// Handle file upload for TF-IDF
function handleFileUploadTFIDF(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (text && text.trim()) {
        tfidfCorpus.push({
          label: file.name.replace('.txt', ''),
          text: text,
          source: 'upload'
        });
        updateCorpusListTFIDF();
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

// Update corpus list display for TF-IDF
function updateCorpusListTFIDF() {
  document.getElementById('tfidf-corpus-count').textContent = tfidfCorpus.length;
  
  const listEl = document.getElementById('tfidf-corpus-list');
  if (tfidfCorpus.length === 0) {
    listEl.innerHTML = '<p style="color: #666;">No texts added yet.</p>';
    return;
  }
  
  listEl.innerHTML = tfidfCorpus.map((item, idx) => {
    const pageInfo = item.page_count ? ` | ${item.page_count} pages` : '';
    return `
    <div class="corpus-item">
      <div class="corpus-item-header">
        <span class="corpus-item-label">${item.label}</span>
        <button class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="removeFromCorpusTFIDF(${idx})">
          Remove
        </button>
      </div>
      <div class="corpus-item-info">
        Source: ${item.source}${pageInfo} | Length: ${item.text.length.toLocaleString()} characters
      </div>
    </div>
  `;
  }).join('');
}

function removeFromCorpusTFIDF(idx) {
  tfidfCorpus.splice(idx, 1);
  updateCorpusListTFIDF();
}

// Run TF-IDF Analysis
async function runTFIDFAnalysis() {
  if (tfidfCorpus.length < 2) {
    alert('Please add at least 2 texts to analyze');
    return;
  }
  
  const btn = document.getElementById('tfidf-run-btn');
  btn.disabled = true;
  
  showLoading('Starting analysis...', 'Initializing');
  
  try {
    const config = {
      ngram_type: document.getElementById('tfidf-config-ngram-type').value,
      ngram_size: parseInt(document.getElementById('tfidf-config-ngram-size').value),
      min_df: parseInt(document.getElementById('tfidf-config-min-df').value),
      max_df: parseFloat(document.getElementById('tfidf-config-max-df').value),
      lowercase: document.getElementById('tfidf-config-lowercase').checked,
      chunk_size: parseInt(document.getElementById('tfidf-config-chunk-size').value),
      n_components: parseInt(document.getElementById('tfidf-config-n-components').value)
    };
    
    console.log('Starting TF-IDF analysis...', config);
    
    // Prepare corpus - chunk texts
    updateLoading('Preparing corpus...', `Processing ${tfidfCorpus.length} documents`);
    await sleep(50); // Allow UI to update
    
    const chunks = [];
    const chunkMetadata = [];
    
    tfidfCorpus.forEach((item, docIdx) => {
      updateLoading('Chunking texts...', `Processing ${item.label} (${docIdx + 1}/${tfidfCorpus.length})`);
      
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
    
    console.log(`Prepared ${chunks.length} chunks from ${tfidfCorpus.length} documents`);
    
    // Calculate TF-IDF
    updateLoading('Computing TF-IDF...', `Analyzing ${chunks.length} text chunks`);
    await sleep(50);
    
    const { matrix, features } = calculateTFIDF(chunks, config);
    console.log(`TF-IDF matrix: ${matrix.length} × ${features.length}`);
    
    // Calculate PCA
    updateLoading('Computing PCA...', 'Dimensionality reduction in progress');
    await sleep(50);
    
    const actualComponents = Math.min(config.n_components, matrix.length - 1, features.length);
    const pca = calculatePCA(matrix, actualComponents);
    console.log(`PCA complete: ${actualComponents} components`);
    
    // Build results
    updateLoading('Building results...', 'Preparing visualization');
    await sleep(50);
    
    tfidfResults = {
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
      tfidfResults.chunks.push(point);
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
      tfidfResults.pages.push(avgPoint);
    });
    
    // Find most distinctive features (highest variance)
    const featureVariances = features.map((feature, idx) => {
      const values = matrix.map(row => row[idx]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      return { feature, variance };
    });
    
    featureVariances.sort((a, b) => b.variance - a.variance);
    
    tfidfCorpus.forEach(item => {
      tfidfResults.features.top_features.push({
        class: item.label,
        features: featureVariances.slice(0, 25).map(f => ({
          feature: f.feature,
          weight: f.variance
        }))
      });
    });
    
    console.log('Analysis complete!', tfidfResults);
    
    hideLoading();
    displayTFIDFResults();
    switchTab('tfidf', 'results');
    
  } catch (error) {
    console.error('Analysis failed:', error);
    hideLoading();
    alert('Analysis failed: ' + error.message + '\n\nCheck browser console (F12) for details.');
  } finally {
    btn.disabled = false;
    btn.textContent = '🚀 Run Analysis';
  }
}

// Helper function to allow UI updates
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Display TF-IDF results
function displayTFIDFResults() {
  const container = document.getElementById('tfidf-results-container');
  
  if (!tfidfResults) {
    container.innerHTML = '<div class="error-message">No results to display.</div>';
    return;
  }
  
  console.log('Displaying TF-IDF results...');
  
  // Calculate total variance explained (sum of first 3 components)
  const varExplained = tfidfResults.variance_explained || [0, 0, 0];
  const totalVar3D = varExplained.slice(0, 3).reduce((a, b) => a + b, 0) * 100;
  
  // Statistics
  let html = '<div class="stat-grid">';
  html += `
    <div class="stat-card">
      <div class="stat-card-value">${tfidfResults.features.total}</div>
      <div class="stat-card-label">Total Features</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${tfidfResults.chunks.length}</div>
      <div class="stat-card-label">Text Chunks</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${tfidfResults.pages.length}</div>
      <div class="stat-card-label">Documents</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${totalVar3D.toFixed(1)}%</div>
      <div class="stat-card-label">Variance (3D)</div>
    </div>
  `;
  html += '</div>';
  
  // PCA Plot
  html += '<h4 style="margin-top: 1rem;">3D Visualization (PCA)</h4>';
  html += '<div id="tfidf-plot-3d" style="height: 550px;"></div>';
  
  // Top features
  if (tfidfResults.features.top_features.length > 0) {
    html += '<h4 style="margin-top: 1rem;">Most Discriminative Features</h4>';
    tfidfResults.features.top_features.forEach(classFeatures => {
      html += `<h5 style="font-size: 0.9rem; margin: 0.5rem 0 0.3rem 0;">${classFeatures.class}</h5>`;
      html += '<table class="feature-table"><thead><tr><th>Feature</th><th>Weight</th></tr></thead><tbody>';
      classFeatures.features.slice(0, 15).forEach(f => {
        html += `<tr><td><code>${f.feature}</code></td><td>${f.weight.toFixed(3)}</td></tr>`;
      });
      html += '</tbody></table>';
    });
  }
  
  container.innerHTML = html;
  
  // Render 3D plot after DOM update
  setTimeout(() => render3DPlotTFIDF(), 100);
}

function render3DPlotTFIDF() {
  if (!tfidfResults || !tfidfResults.chunks || tfidfResults.chunks.length === 0) {
    console.error('No PCA results to display');
    return;
  }
  
  const plotDiv = document.getElementById('tfidf-plot-3d');
  if (!plotDiv) {
    console.error('Plot container not found');
    return;
  }
  
  console.log('Rendering 3D plot with', tfidfResults.chunks.length, 'chunks and', tfidfResults.pages.length, 'documents');
  
  // Create distinct colors for better visibility
  const colors = [
    '#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea',
    '#38b2ac', '#ecc94b', '#ed64a6', '#4299e1', '#f6ad55'
  ];
  const uniqueLabels = [...new Set(tfidfResults.chunks.map(c => c.label))];
  const colorMap = {};
  uniqueLabels.forEach((label, i) => {
    colorMap[label] = colors[i % colors.length];
  });
  
  const data = [];
  
  // Plot individual chunks (smaller, semi-transparent)
  uniqueLabels.forEach(label => {
    const points = tfidfResults.chunks.filter(c => c.label === label);
    data.push({
      x: points.map(p => p.PC1),
      y: points.map(p => p.PC2),
      z: points.map(p => p.PC3),
      text: points.map(p => `${p.label}<br>Chunk ${p.chunk_idx + 1}<br>${p.text_preview}`),
      mode: 'markers',
      marker: {
        size: 6,
        color: colorMap[label],
        opacity: 0.4,
        line: { width: 0.5, color: 'white' }
      },
      name: `${label} (chunks)`,
      type: 'scatter3d',
      showlegend: true,
      hoverinfo: 'text',
      legendgroup: label
    });
  });
  
  // Plot document centers (larger, opaque) with text labels
  uniqueLabels.forEach(label => {
    const docPoint = tfidfResults.pages.find(p => p.label === label);
    if (docPoint) {
      data.push({
        x: [docPoint.PC1],
        y: [docPoint.PC2],
        z: [docPoint.PC3],
        text: [label],
        mode: 'markers+text',
        marker: {
          size: 16,
          color: colorMap[label],
          opacity: 1,
          line: { width: 3, color: 'white' },
          symbol: 'diamond'
        },
        textposition: 'top center',
        textfont: {
          size: 12,
          color: colorMap[label],
          family: 'Arial, sans-serif',
          weight: 'bold'
        },
        name: `${label} (center)`,
        type: 'scatter3d',
        hoverinfo: 'text',
        showlegend: true,
        legendgroup: label
      });
    }
  });
  
  // Calculate variance explained percentages
  const varExplained = tfidfResults.variance_explained || [0, 0, 0];
  const pc1Var = (varExplained[0] * 100).toFixed(1);
  const pc2Var = (varExplained[1] * 100).toFixed(1);
  const pc3Var = (varExplained[2] * 100).toFixed(1);
  
  const layout = {
    title: {
      text: '3D PCA Visualization<br><sub>Each dot is a text chunk, diamonds show document centers</sub>',
      font: { size: 16 }
    },
    scene: {
      xaxis: {
        title: `PC1 (${pc1Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      yaxis: {
        title: `PC2 (${pc2Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      zaxis: {
        title: `PC3 (${pc3Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.3 }
      }
    },
    height: 550,
    margin: { l: 0, r: 0, t: 40, b: 0 },
    showlegend: true,
    legend: {
      x: 1.02,
      y: 0.5,
      xanchor: 'left',
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#cbd5e0',
      borderwidth: 1
    },
    hovermode: 'closest',
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };
  
  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['toImage'],
    displaylogo: false
  };
  
  Plotly.newPlot('tfidf-plot-3d', data, layout, config);
}

// ============================================================================
// ROLLING STYLOMETRY FUNCTIONS
// ============================================================================

async function loadManuscriptsRolling() {
  try {
    showLoading('Loading manuscripts...', 'Fetching available texts');
    
    // Load the search index
    const response = await fetch(`${BASE_URL}/assets/search/transcriptions.json`);
    const data = await response.json();
    const searchDocs = data.docs || [];
    
    // Extract unique manuscripts with page counts
    const manuscripts = {};
    searchDocs.forEach(item => {
      if (!item.id || !item.slug) return;
      
      const idParts = item.id.split('::');
      if (idParts.length < 2) return;
      const pageId = `${idParts[0]}::${idParts[1]}`;
      
      if (!manuscripts[item.slug]) {
        manuscripts[item.slug] = {
          slug: item.slug,
          pages: new Set()
        };
      }
      manuscripts[item.slug].pages.add(pageId);
    });
    
    // Convert to list with page counts
    const manuscriptList = Object.values(manuscripts).map(ms => ({
      slug: ms.slug,
      page_count: ms.pages.size
    }));
    
    // Populate all three dropdowns
    const selects = ['rolling-corpus-a-source', 'rolling-corpus-b-source', 'rolling-test-source'];
    selects.forEach(selectId => {
      const selectEl = document.getElementById(selectId);
      if (!selectEl) return;
      
      if (manuscriptList.length === 0) {
        selectEl.innerHTML = '<option>No manuscripts available</option>';
        return;
      }
      
      selectEl.innerHTML = manuscriptList.map(ms => 
        `<option value="${ms.slug}">${ms.slug} (${ms.page_count} pages)</option>`
      ).join('');
    });
    
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error('Error loading manuscripts for rolling stylometry:', error);
    alert('Failed to load manuscripts: ' + error.message);
  }
}

async function loadManuscriptRolling(type) {
  const selectId = `rolling-corpus-${type}-source`;
  const statusId = `rolling-corpus-${type}-status`;
  const labelId = `rolling-${type === 'test' ? 'test' : `corpus-${type}`}-label`;
  
  const selectEl = document.getElementById(selectId);
  const selectedOptions = Array.from(selectEl.selectedOptions);
  
  if (selectedOptions.length === 0) {
    alert('Please select at least one manuscript');
    return;
  }
  
  showLoading('Loading manuscript...', 'Processing text data');
  
  try {
    // Load search index
    const response = await fetch(`${BASE_URL}/assets/search/transcriptions.json`);
    const data = await response.json();
    const searchDocs = data.docs || [];
    
    // Combine all selected manuscripts
    let combinedText = '';
    
    for (const option of selectedOptions) {
      const slug = option.value;
      updateLoading(`Loading ${slug}...`, 'Grouping pages');
      
      // Group lines by page
      const pageMap = {};
      searchDocs.filter(item => item.slug === slug).forEach(line => {
        if (!line.id) return;
        const idParts = line.id.split('::');
        if (idParts.length < 2) return;
        const pageId = `${idParts[0]}::${idParts[1]}`;
        
        if (!pageMap[pageId]) {
          pageMap[pageId] = [];
        }
        if (line.text) {
          pageMap[pageId].push(line.text);
        }
      });
      
      // Concatenate all pages
      const text = Object.values(pageMap)
        .map(lines => lines.join(' '))
        .join('\n');
      
      if (text.trim()) {
        combinedText += (combinedText ? '\n\n' : '') + text;
      }
    }
    
    // Store in appropriate corpus
    if (type === 'a') {
      rollingCorpusA = combinedText;
    } else if (type === 'b') {
      rollingCorpusB = combinedText;
    } else if (type === 'test') {
      rollingTestText = combinedText;
    }
    
    // Update status
    const wordCount = combinedText.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = combinedText.length;
    const statusEl = document.getElementById(statusId);
    if (statusEl) {
      statusEl.innerHTML = `<span style="color: #48bb78;">✓ Loaded: ${wordCount.toLocaleString()} words, ${charCount.toLocaleString()} characters</span>`;
    }
    
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error('Error loading manuscript:', error);
    alert('Failed to load manuscript: ' + error.message);
  }
}

function addCustomCorpusRolling(type) {
  const textId = `rolling-${type === 'test' ? 'test' : `corpus-${type}`}-text`;
  const statusId = `rolling-${type === 'test' ? 'test' : `corpus-${type}`}-status`;
  
  const textEl = document.getElementById(textId);
  const text = textEl.value.trim();
  
  if (!text) {
    alert('Please paste some text first');
    return;
  }
  
  // Store in appropriate corpus
  if (type === 'a') {
    rollingCorpusA = text;
  } else if (type === 'b') {
    rollingCorpusB = text;
  } else if (type === 'test') {
    rollingTestText = text;
  }
  
  // Update status
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;
  const statusEl = document.getElementById(statusId);
  if (statusEl) {
    statusEl.innerHTML = `<span style="color: #48bb78;">✓ Loaded: ${wordCount.toLocaleString()} words, ${charCount.toLocaleString()} characters</span>`;
  }
  
  // Clear textarea
  textEl.value = '';
}

async function runRollingStyloAnalysis() {
  // Check if all corpora are loaded
  if (!rollingCorpusA || !rollingCorpusB || !rollingTestText) {
    alert('Please load all three texts: Reference Corpus A, Reference Corpus B, and Test Text');
    return;
  }
  
  showLoading('Starting rolling stylometry...', 'Initializing analysis');
  
  try {
    // Get configuration
    const config = {
      windowSize: parseInt(document.getElementById('rolling-config-window-size').value),
      stepSize: parseInt(document.getElementById('rolling-config-step-size').value),
      ngramType: document.getElementById('rolling-config-ngram-type').value,
      ngramSize: parseInt(document.getElementById('rolling-config-ngram-size').value),
      mfw: parseInt(document.getElementById('rolling-config-mfw').value),
      distance: document.getElementById('rolling-config-distance').value,
      lowercase: document.getElementById('rolling-config-lowercase').checked
    };
    
    const labelA = document.getElementById('rolling-corpus-a-label').value || 'Corpus A';
    const labelB = document.getElementById('rolling-corpus-b-label').value || 'Corpus B';
    const labelTest = document.getElementById('rolling-test-label').value || 'Test Text';
    
    console.log('Rolling stylometry config:', config);
    
    // Prepare texts
    updateLoading('Preparing texts...', 'Converting to lowercase if needed');
    await sleep(50);
    
    let textA = config.lowercase ? rollingCorpusA.toLowerCase() : rollingCorpusA;
    let textB = config.lowercase ? rollingCorpusB.toLowerCase() : rollingCorpusB;
    let testText = config.lowercase ? rollingTestText.toLowerCase() : rollingTestText;
    
    // Split test text into words for windowing
    updateLoading('Tokenizing test text...', 'Creating sliding windows');
    await sleep(50);
    
    const testWords = testText.split(/\s+/).filter(w => w.length > 0);
    console.log(`Test text: ${testWords.length} words`);
    
    if (testWords.length < config.windowSize) {
      throw new Error(`Test text (${testWords.length} words) is shorter than window size (${config.windowSize} words). Please reduce window size.`);
    }
    
    // Extract n-grams from reference corpora
    updateLoading('Extracting features from reference corpora...', 'Computing n-gram frequencies');
    await sleep(50);
    
    const ngramsA = extractNgrams(textA, config.ngramSize, config.ngramType);
    const ngramsB = extractNgrams(textB, config.ngramSize, config.ngramType);
    
    // Get most frequent n-grams across both corpora
    const allNgrams = {};
    Object.keys(ngramsA).forEach(ng => {
      allNgrams[ng] = (allNgrams[ng] || 0) + ngramsA[ng];
    });
    Object.keys(ngramsB).forEach(ng => {
      allNgrams[ng] = (allNgrams[ng] || 0) + ngramsB[ng];
    });
    
    const sortedNgrams = Object.entries(allNgrams)
      .sort((a, b) => b[1] - a[1])
      .slice(0, config.mfw)
      .map(([ng, _]) => ng);
    
    console.log(`Using ${sortedNgrams.length} most frequent features`);
    
    // Create feature vectors for reference corpora
    updateLoading('Creating feature vectors...', 'Building reference profiles');
    await sleep(50);
    
    const vectorA = sortedNgrams.map(ng => ngramsA[ng] || 0);
    const vectorB = sortedNgrams.map(ng => ngramsB[ng] || 0);
    
    // Normalize vectors (relative frequencies)
    const totalA = vectorA.reduce((a, b) => a + b, 0);
    const totalB = vectorB.reduce((a, b) => a + b, 0);
    const normVectorA = vectorA.map(v => v / totalA);
    const normVectorB = vectorB.map(v => v / totalB);
    
    // Slide window through test text
    updateLoading('Sliding window through test text...', 'Computing distances at each position');
    await sleep(50);
    
    const results = [];
    const numWindows = Math.floor((testWords.length - config.windowSize) / config.stepSize) + 1;
    
    for (let i = 0; i < numWindows; i++) {
      const startIdx = i * config.stepSize;
      const endIdx = startIdx + config.windowSize;
      
      if (endIdx > testWords.length) break;
      
      if (i % 5 === 0) {
        updateLoading('Analyzing windows...', `Processing window ${i + 1}/${numWindows}`);
        await sleep(10);
      }
      
      // Extract window text
      const windowWords = testWords.slice(startIdx, endIdx);
      const windowText = windowWords.join(' ');
      
      // Extract n-grams from window
      const windowNgrams = extractNgrams(windowText, config.ngramSize, config.ngramType);
      
      // Create feature vector for window
      const windowVector = sortedNgrams.map(ng => windowNgrams[ng] || 0);
      const totalWindow = windowVector.reduce((a, b) => a + b, 0);
      const normWindowVector = windowVector.map(v => v / (totalWindow || 1));
      
      // Calculate distances to both corpora
      const distA = calculateDistance(normWindowVector, normVectorA, config.distance);
      const distB = calculateDistance(normWindowVector, normVectorB, config.distance);
      
      results.push({
        position: startIdx,
        endPosition: endIdx,
        distanceToA: distA,
        distanceToB: distB,
        similarity: distA < distB ? 'A' : 'B',
        confidence: Math.abs(distA - distB)
      });
    }
    
    console.log(`Analyzed ${results.length} windows`);
    
    // Store results
    rollingResults = {
      results: results,
      config: config,
      labels: { a: labelA, b: labelB, test: labelTest },
      testWordCount: testWords.length
    };
    
    hideLoading();
    displayRollingResults();
    switchTab('rolling', 'results');
    
  } catch (error) {
    hideLoading();
    console.error('Rolling stylometry failed:', error);
    alert('Analysis failed: ' + error.message + '\n\nCheck browser console (F12) for details.');
  }
}

function displayRollingResults() {
  const container = document.getElementById('rolling-results-container');
  
  if (!rollingResults) {
    container.innerHTML = '<div class="error-message">No results to display.</div>';
    return;
  }
  
  console.log('Displaying rolling stylometry results...');
  
  const { results, config, labels, testWordCount } = rollingResults;
  
  // Statistics
  let html = '<div class="stat-grid">';
  
  const aCount = results.filter(r => r.similarity === 'A').length;
  const bCount = results.filter(r => r.similarity === 'B').length;
  const aPercent = ((aCount / results.length) * 100).toFixed(1);
  const bPercent = ((bCount / results.length) * 100).toFixed(1);
  
  html += `
    <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="stat-card-value">${results.length}</div>
      <div class="stat-card-label">Windows Analyzed</div>
    </div>
    <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #5a67d8 100%);">
      <div class="stat-card-value">${aPercent}%</div>
      <div class="stat-card-label">Similar to ${labels.a}</div>
    </div>
    <div class="stat-card" style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">
      <div class="stat-card-value">${bPercent}%</div>
      <div class="stat-card-label">Similar to ${labels.b}</div>
    </div>
    <div class="stat-card" style="background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);">
      <div class="stat-card-value">${testWordCount.toLocaleString()}</div>
      <div class="stat-card-label">Test Text Words</div>
    </div>
  `;
  html += '</div>';
  
  // Rolling plot
  html += '<h4 style="margin-top: 1rem;">Stylometric Profile Over Text Position</h4>';
  html += '<div id="rolling-plot" style="height: 450px;"></div>';
  
  container.innerHTML = html;
  
  // Render plot after DOM update
  setTimeout(() => renderRollingPlot(), 100);
}

function renderRollingPlot() {
  if (!rollingResults || !rollingResults.results) {
    console.error('No rolling results to plot');
    return;
  }
  
  const { results, labels } = rollingResults;
  
  // Create traces for both corpora
  const traceA = {
    x: results.map(r => r.position),
    y: results.map(r => r.distanceToA),
    mode: 'lines',
    name: `Distance to ${labels.a}`,
    line: { color: '#667eea', width: 2 }
  };
  
  const traceB = {
    x: results.map(r => r.position),
    y: results.map(r => r.distanceToB),
    mode: 'lines',
    name: `Distance to ${labels.b}`,
    line: { color: '#48bb78', width: 2 }
  };
  
  const data = [traceA, traceB];
  
  const layout = {
    title: {
      text: 'Stylistic Distance Over Text Position<br><sub>Lower distance = higher similarity</sub>',
      font: { size: 16 }
    },
    xaxis: {
      title: 'Word Position in Test Text',
      gridcolor: '#e2e8f0'
    },
    yaxis: {
      title: 'Distance',
      gridcolor: '#e2e8f0'
    },
    height: 450,
    margin: { l: 60, r: 20, t: 60, b: 60 },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      xanchor: 'left',
      yanchor: 'top',
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#cbd5e0',
      borderwidth: 1
    },
    hovermode: 'x unified',
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };
  
  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false
  };
  
  Plotly.newPlot('rolling-plot', data, layout, config);
}

// Calculate distance between two vectors
function calculateDistance(vec1, vec2, metric = 'cosine') {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length');
  }
  
  if (metric === 'cosine') {
    // Cosine distance = 1 - cosine similarity
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) return 1;
    
    const cosineSim = dotProduct / (mag1 * mag2);
    return 1 - cosineSim;
    
  } else if (metric === 'manhattan') {
    // Manhattan distance (L1)
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.abs(vec1[i] - vec2[i]);
    }
    return sum;
    
  } else if (metric === 'euclidean') {
    // Euclidean distance (L2)
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      const diff = vec1[i] - vec2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }
  
  return 0;
}

// ============================================================================
// SHARED HELPER FUNCTIONS
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
  
  // Calculate total variance explained (sum of first 3 components)
  const varExplained = analysisResults.variance_explained || [0, 0, 0];
  const totalVar3D = varExplained.slice(0, 3).reduce((a, b) => a + b, 0) * 100;
  
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
      <div class="stat-card-value">${totalVar3D.toFixed(1)}%</div>
      <div class="stat-card-label">Variance (3D)</div>
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
  html += '<h4 style="margin-top: 1rem;">3D Visualization (PCA)</h4>';
  html += '<div id="plot-3d" style="height: 550px;"></div>';
  
  // Top features
  if (analysisResults.features.top_features.length > 0) {
    html += '<h4 style="margin-top: 1rem;">Most Discriminative Features</h4>';
    analysisResults.features.top_features.forEach(classFeatures => {
      html += `<h5 style="font-size: 0.9rem; margin: 0.5rem 0 0.3rem 0;">${classFeatures.class}</h5>`;
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
  
  // Create distinct colors for better visibility
  const colors = [
    '#667eea', '#f56565', '#48bb78', '#ed8936', '#9f7aea', 
    '#38b2ac', '#ecc94b', '#ed64a6', '#4299e1', '#f6ad55'
  ];
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
      text: points.map(p => `${p.label}<br>Chunk ${p.chunk_idx + 1}<br>${p.text_preview}`),
      mode: 'markers',
      marker: {
        size: 6,
        color: colorMap[label],
        opacity: 0.4,
        line: { width: 0.5, color: 'white' }
      },
      name: `${label} (chunks)`,
      type: 'scatter3d',
      showlegend: true,
      hoverinfo: 'text',
      legendgroup: label
    });
  });
  
  // Plot document centers (larger, opaque) with text labels
  uniqueLabels.forEach(label => {
    const docPoint = analysisResults.pages.find(p => p.label === label);
    if (docPoint) {
      data.push({
        x: [docPoint.PC1],
        y: [docPoint.PC2],
        z: [docPoint.PC3],
        text: [label],
        mode: 'markers+text',
        marker: {
          size: 16,
          color: colorMap[label],
          opacity: 1,
          line: { width: 3, color: 'white' },
          symbol: 'diamond'
        },
        textposition: 'top center',
        textfont: { 
          size: 12, 
          color: colorMap[label],
          family: 'Arial, sans-serif',
          weight: 'bold'
        },
        name: `${label} (center)`,
        type: 'scatter3d',
        hoverinfo: 'text',
        showlegend: true,
        legendgroup: label
      });
    }
  });
  
  // Calculate variance explained percentages
  const varExplained = analysisResults.variance_explained || [0, 0, 0];
  const pc1Var = (varExplained[0] * 100).toFixed(1);
  const pc2Var = (varExplained[1] * 100).toFixed(1);
  const pc3Var = (varExplained[2] * 100).toFixed(1);
  
  const layout = {
    title: {
      text: '3D PCA Visualization<br><sub>Each dot is a text chunk, diamonds show document centers</sub>',
      font: { size: 16 }
    },
    scene: {
      xaxis: {
        title: `PC1 (${pc1Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      yaxis: {
        title: `PC2 (${pc2Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      zaxis: {
        title: `PC3 (${pc3Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.3 }
      }
    },
    height: 550,
    margin: { l: 0, r: 0, t: 40, b: 0 },
    showlegend: true,
    legend: {
      x: 1.02,
      y: 0.5,
      xanchor: 'left',
      bgcolor: 'rgba(255,255,255,0.9)',
      bordercolor: '#cbd5e0',
      borderwidth: 1
    },
    hovermode: 'closest',
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['toImage'],
    displaylogo: false
  };
  
  Plotly.newPlot('plot-3d', data, layout, config);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Load manuscripts for TF-IDF tab
  loadManuscriptsTFIDF();
  
  // Attach file upload handler for TF-IDF
  const fileInput = document.getElementById('tfidf-file-upload');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUploadTFIDF);
  }
  
  // Load manuscripts for Rolling Stylometry
  loadManuscriptsRolling();
});
</script>
