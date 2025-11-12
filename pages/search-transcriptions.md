---
layout: page
permalink: /search-transcriptions/
title: Search Transcriptions
show_title: false
---

<style>
.saved-search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: #f8f8f8;
  border-radius: 4px;
  cursor: pointer;
}
.saved-search-item:hover {
  background: #f0f0f0;
}
.saved-search-delete {
  color: #999;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
}
.saved-search-delete:hover {
  color: #d44;
}
.ms-group {
  margin-bottom: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}
.ms-group-header {
  background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%);
  color: white;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
.ms-group-header:hover {
  background: linear-gradient(135deg, #c4941f 0%, #b8871a 100%);
}
.ms-group-title {
  font-weight: 500;
  font-size: 1.1rem;
}
.ms-group-count {
  background: rgba(255,255,255,0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
}
.ms-group-body {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 1rem;
}
.ms-group-body.collapsed {
  display: none;
}
.context-line {
  color: #666;
  font-size: 0.9rem;
}
.context-match {
  font-weight: 500;
  color: #333;
}
mark.search-highlight {
  background: #fff4cc;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
  font-weight: 500;
}
.result-checkbox {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.db-card {
  position: relative;
}
.comparison-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.comparison-content {
  background: white;
  border-radius: 8px;
  max-width: 95vw;
  max-height: 90vh;
  overflow: auto;
  padding: 2rem;
}
.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #d4af37;
}
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.comparison-item {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}
.comparison-item-header {
  font-weight: 600;
  color: #d4af37;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
</style>

<div class="explore-fullwidth">
  <h1 class="mb-3" style="text-align:center;">Search Transcriptions</h1>
  <p id="corpus-info" style="text-align:center; color:#666; margin-bottom:1.5rem;"></p>

  <div class="db-shell" style="grid-template-columns: 300px minmax(0,1fr);">
    <aside class="db-facets" aria-label="Filters">
      <!-- Saved Searches -->
      <div class="facet">
        <div class="facet-title" style="display:flex; justify-content:space-between; align-items:center;">
          <span>Saved Searches</span>
          <button id="save-search-btn" class="chip" style="font-size:0.8rem; padding:0.25rem 0.5rem;" title="Save current search">
            💾 Save
          </button>
        </div>
        <div id="saved-searches-list" style="max-height:200px; overflow-y:auto;"></div>
      </div>

      <div class="facet">
        <div class="facet-title">Manuscript</div>
        <select id="ms-filter" style="width:100%"></select>
      </div>
      
      <div class="facet">
        <div class="facet-title">Fuzzy distance</div>
        <input id="edits" type="number" min="0" max="2" value="0" style="width:100%">
        <small class="muted">0 = exact, 1-2 = tolerant</small>
      </div>

      <div class="facet">
        <div class="facet-title">Sort by</div>
        <select id="sort-by" style="width:100%">
          <option value="relevance">Relevance</option>
          <option value="manuscript">Manuscript (A-Z)</option>
          <option value="page">Page number</option>
        </select>
      </div>

      <div class="facet">
        <div class="facet-title">Language</div>
        <select id="lang-filter" style="width:100%">
          <option value="">All languages</option>
        </select>
        <small class="muted">Based on manuscript metadata</small>
      </div>

      <div class="facet">
        <div class="facet-title">Display</div>
        <label style="display:flex; align-items:center; margin-bottom:0.5rem;">
          <input type="checkbox" id="group-by-ms" style="margin-right:0.5rem;">
          <span>Group by manuscript</span>
        </label>
        <label style="display:flex; align-items:center; margin-bottom:0.5rem;">
          <input type="checkbox" id="show-context" checked style="margin-right:0.5rem;">
          <span>Show context</span>
        </label>
      </div>

      <div class="facet">
        <div class="facet-title">Selected for Comparison (<span id="comparison-count">0</span>)</div>
        <button id="compare-btn" class="chip" style="width:100%; background:#d4af37; color:white; border:none; padding:0.75rem; margin-bottom:0.5rem;" disabled>
          📊 Compare Selected
        </button>
        <button id="clear-selection-btn" class="chip" style="width:100%; padding:0.5rem; font-size:0.9rem;" disabled>
          Clear Selection
        </button>
      </div>

      <div class="facet">
        <button id="export-btn" class="chip" style="width:100%; background:#d4af37; color:white; border:none; padding:0.75rem;">
          📋 Export Results
        </button>
      </div>
    </aside>

    <section class="db-main">
      <div class="db-controls">
        <input id="q" type="search" placeholder="Search words, phrases…" />
        <button id="go" class="chip">Search</button>
      </div>
      <div id="status" class="db-status"></div>
      <div id="hits"></div>
    </section>
  </div>
</div>

<link rel="stylesheet" href="https://unpkg.com/lunr/lunr.css">
<script src="https://unpkg.com/lunr/lunr.js"></script>
<script>
(async function(){
  // Lazy load corpus - only load when user interacts with search
  let corpus = null;
  let docs = [];
  let byId = new Map();  // Initialize as Map, not null
  let manifestsData = {};  // Store manifest URLs by slug
  let isLoading = false;
  let isLoaded = false;
  
  const $corpusInfo = document.getElementById('corpus-info');
  $corpusInfo.innerHTML = '<em>Loading search index...</em>';
  
  // Load manifests data for correct URLs
  async function loadManifests() {
    try {
      const response = await fetch('{{ "/data/manifests.yml" | relative_url }}');
      const text = await response.text();
      // Parse YAML-ish structure for manifest URLs and annos paths
      const lines = text.split('\n');
      let currentSlug = null;
      lines.forEach(line => {
        const slugMatch = line.match(/^- slug:\s*(.+)/);
        if (slugMatch) {
          currentSlug = slugMatch[1].trim();
          manifestsData[currentSlug] = {};
        }
        if (currentSlug) {
          const manifestMatch = line.match(/^\s+manifest:\s*(.+)/);
          if (manifestMatch) {
            manifestsData[currentSlug].manifest = manifestMatch[1].trim();
          }
          const annosMatch = line.match(/^\s+annos:\s*(.+)/);
          if (annosMatch) {
            manifestsData[currentSlug].annos = annosMatch[1].trim();
          }
        }
      });
      console.log('Loaded manifest URLs for', Object.keys(manifestsData).length, 'manuscripts');
    } catch (err) {
      console.error('Failed to load manifests:', err);
    }
  }
  
  // Load manifests immediately
  loadManifests();
  
  // ============= LAZY LOADING SYSTEM =============
  let manuscriptIndex = null;
  let loadedManuscripts = new Map(); // slug -> {docs, title}
  let currentlyLoading = new Set();
  
  async function loadManuscriptIndex() {
    if (manuscriptIndex) return manuscriptIndex;
    
    $corpusInfo.innerHTML = '<em>Loading manuscript index...</em>';
    const response = await fetch('{{ "/assets/search/manuscripts/index.json" | relative_url }}');
    manuscriptIndex = await response.json();
    
    const msCount = manuscriptIndex.manuscripts.length;
    const lineCount = manuscriptIndex.total_documents;
    $corpusInfo.innerHTML = `<strong>${msCount}</strong> manuscripts · <strong>${lineCount.toLocaleString()}</strong> transcribed lines available for search`;
    
    return manuscriptIndex;
  }
  
  async function loadManuscript(slug) {
    // Return if already loaded
    if (loadedManuscripts.has(slug)) {
      return loadedManuscripts.get(slug);
    }
    
    // Wait if currently loading
    if (currentlyLoading.has(slug)) {
      while (currentlyLoading.has(slug)) {
        await new Promise(r => setTimeout(r, 50));
      }
      return loadedManuscripts.get(slug);
    }
    
    currentlyLoading.add(slug);
    
    try {
      const response = await fetch(`{{ "/assets/search/manuscripts/" | relative_url }}${slug}.json`);
      if (!response.ok) throw new Error(`Failed to load ${slug}`);
      
      const data = await response.json();
      loadedManuscripts.set(slug, data);
      
      // Add to byId map
      data.docs.forEach(d => byId.set(d.id, d));
      
      return data;
    } finally {
      currentlyLoading.delete(slug);
    }
  }
  
  async function ensureCorpusLoaded(manuscriptSlug = null) {
    // Load index first
    await loadManuscriptIndex();
    
    if (!manuscriptSlug) {
      // Load all manuscripts for unfiltered search
      $corpusInfo.innerHTML = `<em>Loading all manuscripts...</em>`;
      const slugs = manuscriptIndex.manuscripts.map(m => m.slug);
      
      let loaded = 0;
      await Promise.all(slugs.map(async slug => {
        await loadManuscript(slug);
        loaded++;
        $corpusInfo.innerHTML = `<em>Loading manuscripts... ${loaded}/${slugs.length}</em>`;
      }));
      
      // Rebuild corpus object for compatibility
      corpus = {
        manuscripts: manuscriptIndex.manuscripts,
        docs: Array.from(byId.values())
      };
      docs = corpus.docs;
      
      const msCount = manuscriptIndex.manuscripts.length;
      const lineCount = docs.length;
      $corpusInfo.innerHTML = `<strong>${msCount}</strong> manuscripts · <strong>${lineCount.toLocaleString()}</strong> transcribed lines loaded`;
      
    } else {
      // Load single manuscript
      const msData = await loadManuscript(manuscriptSlug);
      
      // Create corpus with just this manuscript
      corpus = {
        manuscripts: manuscriptIndex.manuscripts.filter(m => m.slug === manuscriptSlug),
        docs: msData.docs
      };
      docs = corpus.docs;
      
      const lineCount = docs.length;
      $corpusInfo.innerHTML = `<strong>1</strong> manuscript · <strong>${lineCount.toLocaleString()}</strong> transcribed lines loaded`;
    }
    
    isLoaded = true;
  }
  
  // DOM elements
  const $ms = document.getElementById('ms-filter');
  const $q  = document.getElementById('q');
  const $go = document.getElementById('go');
  const $ed = document.getElementById('edits');
  const $hits = document.getElementById('hits');
  const $status = document.getElementById('status');
  const $sortBy = document.getElementById('sort-by');
  const $groupByMs = document.getElementById('group-by-ms');
  const $showContext = document.getElementById('show-context');
  const $exportBtn = document.getElementById('export-btn');
  const $saveSearchBtn = document.getElementById('save-search-btn');
  const $savedSearchesList = document.getElementById('saved-searches-list');

  let idx = null;
  let sortedManuscripts = [];
  
  // Initialize search interface - load index only
  async function initializeSearch() {
    await loadManuscriptIndex();
    
    // Sort manuscripts alphabetically
    sortedManuscripts = manuscriptIndex.manuscripts.slice().sort((a, b) => {
      const titleA = (a.title || a.slug).toLowerCase();
      const titleB = (b.title || b.slug).toLowerCase();
      return titleA.localeCompare(titleB);
    });
    
    // Populate manuscript filter
    const none = document.createElement('option'); none.value=''; none.textContent='All manuscripts';
    $ms.appendChild(none);
    sortedManuscripts.forEach(m=>{
      const opt = document.createElement('option');
      opt.value = m.slug;
      opt.textContent = m.title || m.slug;
      $ms.appendChild(opt);
    });
  }
  
  // Build Lunr index from loaded documents
  function buildSearchIndex() {
    idx = lunr(function(){
      this.ref('id');
      this.field('text_norm');
      this.metadataWhitelist = ['position'];
      docs.forEach(d => this.add(d));
    });
  }
  
  // Start initialization in background
  initializeSearch();

  // ============= SAVED SEARCHES =============
  const STORAGE_KEY = 'unknownhands_saved_searches';
  
  function loadSavedSearches() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
  
  function saveSavedSearches(searches) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches.slice(0, 20))); // max 20
    renderSavedSearches();
  }
  
  function saveCurrentSearch() {
    const query = $q.value.trim();
    if (!query) {
      alert('Enter a search query first');
      return;
    }
    const name = prompt('Name this search:', query);
    if (!name) return;
    
    const searches = loadSavedSearches();
    searches.unshift({
      id: Date.now(),
      name: name,
      query: query,
      manuscript: $ms.value,
      fuzzy: $ed.value,
      date: new Date().toISOString()
    });
    saveSavedSearches(searches);
  }
  
  function loadSavedSearch(search) {
    $q.value = search.query;
    $ms.value = search.manuscript || '';
    $ed.value = search.fuzzy || '0';
    run();
  }
  
  function deleteSavedSearch(id) {
    const searches = loadSavedSearches().filter(s => s.id !== id);
    saveSavedSearches(searches);
  }
  
  function renderSavedSearches() {
    const searches = loadSavedSearches();
    if (searches.length === 0) {
      $savedSearchesList.innerHTML = '<div style="color:#999; font-size:0.9rem; padding:0.5rem;">No saved searches</div>';
      return;
    }
    $savedSearchesList.innerHTML = searches.map(s => {
      const date = new Date(s.date).toLocaleDateString();
      const msName = s.manuscript ? (sortedManuscripts.find(m => m.slug === s.manuscript)?.title || s.manuscript) : 'All';
      return `
        <div class="saved-search-item" onclick='loadSavedSearch(${JSON.stringify(s).replace(/'/g, "&apos;")})'>
          <div style="flex:1; min-width:0;">
            <div style="font-weight:500; font-size:0.9rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${esc(s.name)}</div>
            <div style="font-size:0.8rem; color:#666;">${date} · ${esc(msName)}</div>
          </div>
          <button class="saved-search-delete" onclick='event.stopPropagation(); deleteSavedSearch(${s.id}); return false;'>×</button>
        </div>`;
    }).join('');
  }
  
  // Make functions available globally for onclick handlers
  window.loadSavedSearch = loadSavedSearch;
  window.deleteSavedSearch = deleteSavedSearch;
  
  $saveSearchBtn.addEventListener('click', saveCurrentSearch);
  renderSavedSearches();

  // ============= COMPARISON FEATURE =============
  let selectedResults = [];
  const $compareBtn = document.getElementById('compare-btn');
  const $clearSelectionBtn = document.getElementById('clear-selection-btn');
  const $comparisonCount = document.getElementById('comparison-count');
  
  function updateComparisonCount() {
    $comparisonCount.textContent = selectedResults.length;
    $compareBtn.disabled = selectedResults.length < 2;
    $clearSelectionBtn.disabled = selectedResults.length === 0;
  }
  
  function toggleResultSelection(docId) {
    const idx = selectedResults.indexOf(docId);
    if (idx > -1) {
      selectedResults.splice(idx, 1);
    } else {
      selectedResults.push(docId);
    }
    updateComparisonCount();
    
    // Update checkbox
    const checkbox = document.querySelector(`input[data-doc-id="${docId}"]`);
    if (checkbox) {
      checkbox.checked = selectedResults.indexOf(docId) > -1;
    }
  }
  
  function clearSelection() {
    selectedResults = [];
    updateComparisonCount();
    // Uncheck all checkboxes
    document.querySelectorAll('.result-checkbox').forEach(cb => cb.checked = false);
  }
  
  function showComparison() {
    if (selectedResults.length < 2) return;
    
    const items = selectedResults.map(id => byId.get(id)).filter(d => d);
    if (items.length < 2) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'comparison-modal';
    modal.innerHTML = `
      <div class="comparison-content">
        <div class="comparison-header">
          <h2 style="margin:0; color:#d4af37;">Compare ${items.length} Results</h2>
          <button onclick="this.closest('.comparison-modal').remove()" style="padding:0.5rem 1rem; border:none; background:#d4af37; color:white; border-radius:4px; cursor:pointer; font-size:1rem;">Close</button>
        </div>
        <div class="comparison-grid">
          ${items.map(d => {
            const pageNum = extractPageNumber(d.id);
            const cleanedTitle = cleanTitle(d.title || d.slug);
            return `
              <div class="comparison-item">
                <div class="comparison-item-header">${esc(cleanedTitle)}</div>
                ${pageNum ? `<div style="font-size:0.9rem; color:#666; margin-bottom:0.5rem;">Page ${pageNum}</div>` : ''}
                <div style="background:#f8f8f8; padding:1rem; border-radius:4px; font-family:monospace; white-space:pre-wrap; line-height:1.6;">${esc(d.text)}</div>
                ${$showContext.checked ? renderContext(d.id) : ''}
              </div>`;
          }).join('')}
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  
  function renderContext(docId) {
    const doc = byId.get(docId);
    if (!doc) return '';
    const [slug, pageIdxStr, lineIdxStr] = docId.split('::');
    const pageIdx = parseInt(pageIdxStr, 10);
    const lineIdx = parseInt(lineIdxStr, 10);
    if (isNaN(pageIdx) || isNaN(lineIdx)) return '';
    
    const pageDocs = docs.filter(d => {
      const [s, p] = d.id.split('::');
      return s === slug && p === pageIdxStr;
    }).sort((a, b) => {
      const aIdx = parseInt(a.id.split('::')[2], 10);
      const bIdx = parseInt(b.id.split('::')[2], 10);
      return aIdx - bIdx;
    });
    
    const currentIndex = pageDocs.findIndex(d => d.id === docId);
    if (currentIndex === -1) return '';
    
    const before = pageDocs.slice(Math.max(0, currentIndex - 2), currentIndex);
    const after = pageDocs.slice(currentIndex + 1, currentIndex + 3);
    
    const contextLines = [
      ...before.map(d => `<div class="context-line">${esc(d.text)}</div>`),
      `<div class="context-match"><strong>${esc(doc.text)}</strong></div>`,
      ...after.map(d => `<div class="context-line">${esc(d.text)}</div>`)
    ];
    
    return `<div style="margin-top:1rem; padding-top:1rem; border-top:1px solid #e0e0e0;">
      <div style="font-size:0.85rem; color:#999; margin-bottom:0.5rem;">Context:</div>
      ${contextLines.join('')}
    </div>`;
  }
  
  window.toggleResultSelection = toggleResultSelection;
  $compareBtn.addEventListener('click', showComparison);
  $clearSelectionBtn.addEventListener('click', clearSelection);

  // ============= UTILITY FUNCTIONS =============
  function esc(s){ return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  
  function cleanTitle(title) {
    return title.replace(/\s*\(intégral\)\s*$/i, '').trim();
  }
  
  function extractPageNumber(docId) {
    const parts = docId.split('::');
    if (parts.length >= 2) {
      const pageIdx = parseInt(parts[1], 10);
      return !isNaN(pageIdx) ? pageIdx + 1 : null;
    }
    return null;
  }
  
  function highlightMatches(text, query) {
    if (!query) return esc(text);
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    let result = esc(text);
    terms.forEach(term => {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      result = result.replace(regex, '<mark class="search-highlight">$1</mark>');
    });
    return result;
  }
  
  function getContext(docId, contextSize = 2) {
    const parts = docId.split('::');
    const slug = parts[0];
    const pageIdx = parseInt(parts[1], 10);
    const lineIdx = parseInt(parts[2], 10);
    
    const contextDocs = docs.filter(d => {
      const dparts = d.id.split('::');
      return dparts[0] === slug && 
             parseInt(dparts[1], 10) === pageIdx &&
             Math.abs(parseInt(dparts[2], 10) - lineIdx) <= contextSize;
    }).sort((a, b) => {
      const aIdx = parseInt(a.id.split('::')[2], 10);
      const bIdx = parseInt(b.id.split('::')[2], 10);
      return aIdx - bIdx;
    });
    
    return contextDocs;
  }
  
  function getCanvasImage(canvas, slug) {
    // Extract canvas number from URL
    const canvasMatch = canvas.match(/canvas-(\d+)/);
    if (!canvasMatch) return null;
    const canvasNum = canvasMatch[1];
    // Construct IIIF image URL for thumbnail
    return `https://arca.irht.cnrs.fr/iiif/ark:/63955/${slug.replace('irht-', '')}/${canvasNum}/full/150,/0/default.jpg`;
  }

  // ============= EXPORT FUNCTION =============
  function exportResults(rows, format = 'clipboard') {
    if (rows.length === 0) {
      alert('No results to export');
      return;
    }
    
    const lines = ['Manuscript\tPage\tText'];
    rows.forEach(d => {
      const cleanedTitle = cleanTitle(d.title || d.slug);
      const page = extractPageNumber(d.id) || '';
      const text = d.text.replace(/\t/g, ' ').replace(/\n/g, ' ');
      lines.push(`${cleanedTitle}\t${page}\t${text}`);
    });
    
    const tsv = lines.join('\n');
    
    if (format === 'clipboard') {
      navigator.clipboard.writeText(tsv).then(() => {
        alert(`${rows.length} results copied to clipboard as TSV (tab-separated values).\nYou can paste into Excel or Google Sheets.`);
      }).catch(err => {
        console.error('Copy failed:', err);
        downloadAsFile(tsv, 'search-results.tsv');
      });
    } else {
      downloadAsFile(tsv, 'search-results.tsv');
    }
  }
  
  function downloadAsFile(content, filename) {
    const blob = new Blob([content], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============= SEARCH & RENDER =============
  let currentResults = [];
  
  async function run(){
    const q = ($q.value||'').trim();
    const ms = $ms.value||'';
    const edits = Math.max(0, Math.min(2, parseInt($ed.value||'0',10)));
    const sortBy = $sortBy.value;
    const groupByMs = $groupByMs.checked;
    const showContext = $showContext.checked;

    if(!q){
      $hits.innerHTML = '<p>Enter a search term above.</p>';
      $status.textContent = '';
      return;
    }
    
    // Load required manuscripts
    $status.textContent = 'Loading manuscripts...';
    try {
      await ensureCorpusLoaded(ms || null);
    } catch (err) {
      console.error('Failed to load manuscripts:', err);
      $status.textContent = 'Error loading manuscripts';
      return;
    }
    
    // Build search index
    $status.textContent = 'Building search index...';
    buildSearchIndex();
    
    // Perform search
    $status.textContent = 'Searching...';

    if (!q){ 
      $status.textContent='Type a query and hit Search.'; 
      $hits.innerHTML=''; 
      currentResults = [];
      return; 
    }

    // Build Lunr query
    const terms = q.split(/\s+/).filter(Boolean);
    const query = terms.map(t => `${t}~${edits}`).join(' ');

    let results = idx.search(query).slice(0, 500);
    let rows = [];
    for (const r of results){
      const d = byId.get(r.ref);
      if (!d) continue;
      if (ms && d.slug !== ms) continue;
      rows.push({ ...d, score: r.score });
    }
    
    currentResults = rows;

    // Sort results
    if (sortBy === 'manuscript') {
      rows.sort((a, b) => {
        const titleA = cleanTitle(a.title || a.slug).toLowerCase();
        const titleB = cleanTitle(b.title || b.slug).toLowerCase();
        return titleA.localeCompare(titleB);
      });
    } else if (sortBy === 'page') {
      rows.sort((a, b) => {
        const slugCmp = a.slug.localeCompare(b.slug);
        if (slugCmp !== 0) return slugCmp;
        return extractPageNumber(a.id) - extractPageNumber(b.id);
      });
    }
    // else: relevance (default order from lunr)

    $status.textContent = `${rows.length} match${rows.length===1?'':'es'}`;

    if (groupByMs) {
      renderGrouped(rows, q, showContext);
    } else {
      renderFlat(rows, q, showContext);
    }
  }
  
  function renderFlat(rows, query, showContext) {
    $hits.style = 'display:grid; grid-template-columns:repeat(auto-fill,minmax(420px,1fr)); gap:1rem;';
    $hits.innerHTML = rows.slice(0, 200).map(d => renderCard(d, query, showContext)).join('');
  }
  
  function renderGrouped(rows, query, showContext) {
    $hits.style = '';
    const grouped = {};
    rows.forEach(d => {
      if (!grouped[d.slug]) {
        grouped[d.slug] = { 
          title: cleanTitle(d.title || d.slug), 
          slug: d.slug,
          items: [] 
        };
      }
      grouped[d.slug].items.push(d);
    });
    
    const html = Object.values(grouped).map(group => {
      const isExpanded = Object.keys(grouped).length === 1; // auto-expand if only one MS
      return `
        <div class="ms-group">
          <div class="ms-group-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <div class="ms-group-title">${esc(group.title)}</div>
            <div class="ms-group-count">${group.items.length} match${group.items.length===1?'':'es'}</div>
          </div>
          <div class="ms-group-body${isExpanded ? '' : ' collapsed'}">
            ${group.items.slice(0, 100).map(d => renderCard(d, query, showContext)).join('')}
          </div>
        </div>`;
    }).join('');
    
    $hits.innerHTML = html;
  }
  
  function renderCard(d, query, showContext) {
    // Get correct manifest URL and annos path from loaded manifests data
    const manifestUrl = manifestsData[d.slug]?.manifest || `https://api.irht.cnrs.fr/ark:/63955/${d.slug.replace(/^irht-/, '')}/manifest.json`;
    const annosPath = manifestsData[d.slug]?.annos || `{{ site.baseurl | default: "" }}/data/annos/${d.slug}/mapping.json`;
    const href = `{{ site.baseurl | default: "" }}/viewer/?manifest=${encodeURIComponent(manifestUrl)}&annos=${encodeURIComponent(annosPath)}&canvas=${encodeURIComponent(d.canvas)}&line=${encodeURIComponent(d.line_id)}`;
    
    const pageNum = extractPageNumber(d.id);
    const pageLabel = pageNum ? `Page ${pageNum}` : '';
    const cleanedTitle = cleanTitle(d.title || d.slug);
    
    let contextHtml = '';
    if (showContext) {
      const contextDocs = getContext(d.id);
      const currentLineIdx = parseInt(d.id.split('::')[2], 10);
      contextHtml = '<div style="margin-top:0.5rem; padding:0.5rem; background:#f8f8f8; border-radius:4px; font-size:0.9rem;">' +
        contextDocs.map(cd => {
          const cdLineIdx = parseInt(cd.id.split('::')[2], 10);
          const isMatch = cdLineIdx === currentLineIdx;
          const text = isMatch ? highlightMatches(cd.text, query) : esc(cd.text);
          const style = isMatch ? 'context-match' : 'context-line';
          return `<div class="${style}">${text}</div>`;
        }).join('') +
        '</div>';
    }
    
    return `
      <article class="db-card">
        <input type="checkbox" class="result-checkbox" data-doc-id="${d.id}" onchange="toggleResultSelection('${d.id}')" ${selectedResults.includes(d.id) ? 'checked' : ''}>
        <div class="db-body" style="flex:1;">
          <div class="db-title"><a href="${href}">${esc(cleanedTitle)}</a></div>
          <div class="db-meta" style="margin-bottom:0.5rem;">
            ${pageLabel ? `<span style="color:#d4af37; font-weight:500;">${pageLabel}</span> · ` : ''}
            <span style="font-style:italic;">"${highlightMatches(d.text, query)}"</span>
          </div>
          ${contextHtml}
          <div style="margin-top:0.5rem;"><a class="chip" href="${href}">Open in viewer</a></div>
        </div>
      </article>`;
  }

  // ============= EVENT LISTENERS =============
  $go.addEventListener('click', run);
  $q.addEventListener('keydown', e=>{ if (e.key==='Enter') run(); });
  $exportBtn.addEventListener('click', () => exportResults(currentResults));
  
  // Trigger search on filter changes
  $sortBy.addEventListener('change', () => { if (currentResults.length > 0) run(); });
  $groupByMs.addEventListener('change', () => { if (currentResults.length > 0) run(); });
  $showContext.addEventListener('change', () => { if (currentResults.length > 0) run(); });
})();
</script>

