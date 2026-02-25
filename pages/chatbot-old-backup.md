---
layout: page
permalink: /chatbot/
title: Ask Questions About the Manuscripts
show_title: true
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

<style>
.chatbot-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.chat-intro {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 4px solid #d4af37;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 8px;
}

.chat-intro h2 {
  margin-top: 0;
  color: #d4af37;
}

.suggested-questions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.suggested-question {
  background: white;
  border: 2px solid #e9ecef;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: start;
  gap: 0.75rem;
}

.suggested-question:hover {
  border-color: #d4af37;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
}

.suggested-question-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.suggested-question-text {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.chat-messages {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  display: flex;
  gap: 1rem;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-message.user {
  flex-direction: row-reverse;
}

.chat-message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.chat-message.user .chat-message-avatar {
  background: #d4af37;
  color: white;
}

.chat-message.bot .chat-message-avatar {
  background: #e9ecef;
  color: #666;
}

.chat-message-content {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  max-width: 70%;
}

.chat-message.user .chat-message-content {
  background: #d4af37;
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message.bot .chat-message-content {
  background: #f8f9fa;
  color: #333;
  border-bottom-left-radius: 4px;
}

.chat-input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chat-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.chat-input:focus {
  outline: none;
  border-color: #d4af37;
}

.chat-send-btn {
  padding: 1rem 2rem;
  background: #d4af37;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-send-btn:hover:not(:disabled) {
  background: #c4941f;
  transform: translateY(-1px);
}

.chat-send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.search-result-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  margin: 0.75rem 0;
}

.search-result-title {
  font-weight: 600;
  color: #d4af37;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.search-result-text {
  font-family: monospace;
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  white-space: pre-wrap;
  line-height: 1.6;
}

.search-result-highlight {
  background: #fff4cc;
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
  font-weight: 600;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-style: italic;
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4af37;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.help-text {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  padding: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
</style>

<div class="chatbot-container">
  <div class="chat-intro">
    <h2>💬 Ask Questions About the Manuscripts</h2>
    
    <!-- TEMPORARY: API Key input for testing -->
    <div style="background: #fff3cd; padding: 1rem; border-radius: 4px; border-left: 4px solid #ffc107; margin-bottom: 1rem;">
      <strong>🧪 TEST MODE:</strong> Enter your Gemini API key below to test the chatbot locally.
      <div style="margin-top: 0.75rem;">
        <label for="api-key-input" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
          Gemini API Key: 
          <a href="https://aistudio.google.com/apikey" target="_blank" style="color: #d4af37; font-weight: normal;">(Get free key here)</a>
        </label>
        <input 
          type="password" 
          id="api-key-input" 
          placeholder="Paste your API key here for testing"
          style="width: 100%; padding: 0.75rem; border: 2px solid #e9ecef; border-radius: 4px; font-family: monospace;"
        />
        <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem; margin-bottom: 0;">
          ⚠️ This is for testing only. In production, the key will be stored securely on Railway.
        </p>
      </div>
    </div>
    
    <p>
      This AI-powered search assistant uses Google Gemini to help you explore the manuscript collection and transcriptions. 
      Ask questions in natural language, and I'll accurately search through the database to find relevant information.
    </p>
    <p style="margin-bottom: 0; font-size: 0.9rem; color: #666;">
      <strong>Try asking about:</strong> specific manuscripts, scribal hands, dates, locations, text content, or themes.
    </p>
  </div>

  <div class="suggested-questions" id="suggested-questions">
    <div class="suggested-question" data-question="What manuscripts are from the 15th century?">
      <span class="suggested-question-icon">📅</span>
      <span class="suggested-question-text">What manuscripts are from the 15th century?</span>
    </div>
    <div class="suggested-question" data-question="Show me manuscripts from Deventer">
      <span class="suggested-question-icon">📍</span>
      <span class="suggested-question-text">Show me manuscripts from Deventer</span>
    </div>
    <div class="suggested-question" data-question="Find transcriptions mentioning Rome">
      <span class="suggested-question-icon">🔍</span>
      <span class="suggested-question-text">Find transcriptions mentioning Rome</span>
    </div>
    <div class="suggested-question" data-question="Manuscripts from Nuremberg">
      <span class="suggested-question-icon">🏛️</span>
      <span class="suggested-question-text">Manuscripts from Nuremberg</span>
    </div>
  </div>

  <div class="chat-messages" id="chat-messages">
    <div class="empty-state">
      <div class="empty-state-icon">💭</div>
      <p>Ask a question to get started!</p>
    </div>
  </div>

  <div class="chat-input-container">
    <input 
      type="text" 
      class="chat-input" 
      id="chat-input" 
      placeholder="Ask about manuscripts, scribes, locations, dates, or text content..."
      autocomplete="off"
    />
    <button class="chat-send-btn" id="chat-send-btn">Send</button>
  </div>

  <div class="help-text">
    <strong>Tip:</strong> Be specific in your questions for best results. Powered by Google Gemini AI.
  </div>
</div>

<script src="https://unpkg.com/lunr/lunr.js"></script>
<script>
(async function() {
  'use strict';

  // ============= GEMINI API VIA RAILWAY FUNCTION =============
  
  // TODO: Replace with your Railway deployment URL after deploying
  const RAILWAY_API_URL = 'https://YOUR-APP.up.railway.app/api/gemini';
  
  // Call our Railway function to parse queries using Gemini (or Gemini directly if testing)
  async function parseQueryWithGemini(query) {
    // Check if we're in test mode (API key input field has a value)
    const apiKeyInput = document.getElementById('api-key-input');
    const testApiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
    
    console.log('API Key Input field:', apiKeyInput);
    console.log('API Key value length:', testApiKey.length);
    
    if (testApiKey) {
      // TEST MODE: Call Gemini directly
      console.log('Using TEST MODE - calling Gemini directly');
      return await parseQueryWithGeminiDirect(query, testApiKey);
    }
    
    console.log('Using PRODUCTION MODE - calling Railway (will fail if not deployed)');
    
    // PRODUCTION MODE: Use Railway serverless function
    try {
      const response = await fetch(RAILWAY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Server error');
      }
      
      const data = await response.json();
      return data.filters || {};
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
  
  // Direct Gemini API call for testing (uses API key from input field)
  async function parseQueryWithGeminiDirect(query, apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a search query parser for a medieval manuscript database. Parse the following natural language query and extract structured filters.

Available record types: Manuscript, Scribal Unit, Production Unit, Person, Monastery, Institution, Text

The database contains fields like:
- Dates (in YYYY format or date ranges)
- Cities/Countries (for holding institutions or monastic institutions)
- Orders (monastic orders like "Benedictine", "Cistercian", etc.)
- Authors/Scribes (people's names)
- Institutions (holding libraries, monasteries)

Return a JSON object with these possible fields (omit fields that don't apply):
{
  "type": "Manuscript" | "Scribal Unit" | "Production Unit" | "Person" | "Monastery" | "Institution" | "Text",
  "dateRange": [startYear, endYear],  // for "15th century" use [1400, 1499]
  "city": "city name",
  "country": "country name",
  "order": "monastic order",
  "author": "author/scribe name",
  "institution": "institution name"
}

Examples:
- "manuscripts from the 15th century" → {"type": "Manuscript", "dateRange": [1400, 1499]}
- "monasteries in Germany" → {"type": "Monastery", "country": "Germany"}
- "scribal units from Deventer" → {"type": "Scribal Unit", "city": "Deventer"}
- "Benedictine monasteries" → {"type": "Monastery", "order": "Benedictine"}
- "manuscripts copied between 1450 and 1500" → {"type": "Manuscript", "dateRange": [1450, 1500]}

User query: "${query}"

Return ONLY valid JSON, no other text.`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const text = data.candidates[0].content.parts[0].text.trim();
      console.log('Gemini raw response:', text);
      
      // Extract JSON from response - be very robust
      let jsonText = text;
      
      // Remove markdown code blocks if present (both opening and closing)
      jsonText = jsonText.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '');
      
      // Find the JSON object - get everything between first { and last }
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        console.error('Could not find JSON braces in response:', text);
        throw new Error('Could not extract JSON from Gemini response');
      }
      
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
      console.log('Extracted JSON:', jsonText);
      
      const filters = JSON.parse(jsonText);
      console.log('Parsed filters:', filters);
      return filters;
      
    } catch (error) {
      console.error('Gemini direct API error:', error);
      throw new Error(`Failed to parse query: ${error.message}`);
    }
  }
  
  // Apply filters to structured data
  function applyFilters(records, filters) {
    console.log('Applying filters to', records.length, 'records:', filters);
    
    const filtered = records.filter(record => {
      // Type filter
      if (filters.type && record.type !== filters.type) {
        return false;
      }
      
      // City filter (partial match, case-insensitive)
      if (filters.city && (!record.city || !record.city.toLowerCase().includes(filters.city.toLowerCase()))) {
        return false;
      }
      
      // Country filter (partial match, case-insensitive)
      if (filters.country && (!record.country || !record.country.toLowerCase().includes(filters.country.toLowerCase()))) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange) {
        if (!record.date) return false; // No date = exclude
        
        const [startYear, endYear] = filters.dateRange;
        // Extract year(s) from date string
        const yearMatches = record.date.match(/\d{4}/g);
        if (!yearMatches) return false;
        
        const recordYears = yearMatches.map(y => parseInt(y));
        const recordStart = Math.min(...recordYears);
        const recordEnd = Math.max(...recordYears);
        
        // Check if ranges overlap
        if (recordEnd < startYear || recordStart > endYear) {
          return false;
        }
      }
      
      // Order filter (partial match, case-insensitive)
      if (filters.order && (!record.order || !record.order.toLowerCase().includes(filters.order.toLowerCase()))) {
        return false;
      }
      
      // Author filter (partial match, case-insensitive)
      if (filters.author && (!record.author || !record.author.toLowerCase().includes(filters.author.toLowerCase()))) {
        return false;
      }
      
      // Institution filter (partial match, case-insensitive)
      if (filters.institution && (!record.institution || !record.institution.toLowerCase().includes(filters.institution.toLowerCase()))) {
        return false;
      }
      
      // Title keyword filter (if no other filters matched)
      if (filters.keywords && !filters.type && !filters.city && !filters.country && !filters.dateRange) {
        const titleLower = record.title.toLowerCase();
        return filters.keywords.some(kw => titleLower.includes(kw.toLowerCase()));
      }
      
      return true;
    });
    
    console.log('Filtered down to', filtered.length, 'records');
    
    // Debug: if filtering by date, show some examples
    if (filters.dateRange && filtered.length > 0) {
      console.log('Sample filtered records with dates:', filtered.slice(0, 5).map(r => ({
        title: r.title,
        date: r.date
      })));
    }
    
    return filtered;
  }

  // ============= DATA LOADING =============
  
  let heuristData = {
    manuscripts: [],
    scribal_units: [],
    production_units: [],
    historical_people: [],
    holding_institutions: [],
    monastic_institutions: [],
    texts: [],
    relationships: []
  };
  
  let manuscriptIndex = null;
  let loadedManuscripts = new Map();
  let allDocs = [];
  let byId = new Map();
  let searchIdx = null;
  let isDataLoaded = false;

  // Get specific field value from Heurist record
  function getFieldValue(record, fieldName) {
    if (!record.details) return null;
    const field = record.details.find(d => d.fieldName === fieldName);
    if (!field) return null;
    
    if (field.termLabel) return field.termLabel;
    if (typeof field.value === 'string') return field.value;
    if (field.value && field.value.title) return field.value.title;
    return null;
  }

  async function loadHeuristData() {
    if (isDataLoaded) return;
    
    console.log('Loading Heurist database...');
    
    try {
      // Load all JSON files in parallel
      const [msRes, hiRes, miRes, hpRes, txRes] = await Promise.all([
        fetch('{{ "/assets/data/manuscripts.json" | relative_url }}'),
        fetch('{{ "/assets/data/holding_institutions.json" | relative_url }}'),
        fetch('{{ "/assets/data/monastic_institutions.json" | relative_url }}'),
        fetch('{{ "/assets/data/historical_people.json" | relative_url }}'),
        fetch('{{ "/assets/data/texts.json" | relative_url }}')
      ]);
      
      const [msData, hiData, miData, hpData, txData] = await Promise.all([
        msRes.json(),
        hiRes.json(),
        miRes.json(),
        hpRes.json(),
        txRes.json()
      ]);
      
      // Extract records arrays
      heuristData.manuscripts = msData.heurist?.records || [];
      heuristData.holding_institutions = hiData.heurist?.records || [];
      heuristData.monastic_institutions = miData.heurist?.records || [];
      heuristData.historical_people = hpData.heurist?.records || [];
      heuristData.texts = txData.heurist?.records || [];
      
      isDataLoaded = true;
      console.log('Loaded:', {
        manuscripts: heuristData.manuscripts.length,
        holding_institutions: heuristData.holding_institutions.length,
        monastic_institutions: heuristData.monastic_institutions.length,
        historical_people: heuristData.historical_people.length,
        texts: heuristData.texts.length
      });
    } catch (error) {
      console.error('Error loading Heurist data:', error);
    }
  }

  async function loadManuscriptIndex() {
    if (manuscriptIndex) return manuscriptIndex;
    
    const response = await fetch('{{ "/assets/search/manuscripts/index.json" | relative_url }}');
    manuscriptIndex = await response.json();
    return manuscriptIndex;
  }

  async function loadManuscript(slug) {
    if (loadedManuscripts.has(slug)) {
      return loadedManuscripts.get(slug);
    }
    
    const response = await fetch(`{{ "/assets/search/manuscripts/" | relative_url }}${slug}.json`);
    const data = await response.json();
    loadedManuscripts.set(slug, data);
    
    // Add to byId map
    data.docs.forEach(d => byId.set(d.id, d));
    
    return data;
  }

  async function loadAllManuscripts() {
    await loadManuscriptIndex();
    
    const slugs = manuscriptIndex.manuscripts.map(m => m.slug);
    await Promise.all(slugs.map(slug => loadManuscript(slug)));
    
    // Build full docs array
    allDocs = Array.from(byId.values());
  }

  function buildSearchIndexes() {
    // Build Lunr index for transcriptions only (full-text search makes sense here)
    searchIdx = lunr(function() {
      this.ref('id');
      this.field('text');
      this.field('title');
      allDocs.forEach(d => this.add(d));
    });
    
    // For metadata, build structured records array (no Lunr - direct filtering is better)
    const allRecords = [];
    
    // Add manuscripts with enhanced fields
    heuristData.manuscripts.forEach(ms => {
      const country = getFieldValue(ms, 'Country');
      const city = getFieldValue(ms, 'City');
      const date = getFieldValue(ms, 'Date');
      const institution = getFieldValue(ms, 'Institution');
      
      allRecords.push({
        id: `ms_${ms.rec_ID}`,
        type: 'Manuscript',
        title: ms.rec_Title,
        country,
        city,
        date,
        institution,
        record: ms
      });
    });
    
    // Add holding institutions
    heuristData.holding_institutions.forEach(hi => {
      const country = getFieldValue(hi, 'Country');
      const city = getFieldValue(hi, 'City');
      
      allRecords.push({
        id: `hi_${hi.rec_ID}`,
        type: 'Institution',
        title: hi.rec_Title,
        country,
        city,
        record: hi
      });
    });
    
    // Add monastic institutions
    heuristData.monastic_institutions.forEach(mi => {
      const country = getFieldValue(mi, 'Country');
      const city = getFieldValue(mi, 'City');
      const order = getFieldValue(mi, 'Religious order');
      
      allRecords.push({
        id: `mi_${mi.rec_ID}`,
        type: 'Monastery',
        title: mi.rec_Title,
        country,
        city,
        order,
        record: mi
      });
    });
    
    // Add historical people
    heuristData.historical_people.forEach(hp => {
      allRecords.push({
        id: `hp_${hp.rec_ID}`,
        type: 'Person',
        title: hp.rec_Title,
        record: hp
      });
    });
    
    // Add texts
    heuristData.texts.forEach(tx => {
      const author = getFieldValue(tx, 'Author');
      const language = getFieldValue(tx, 'Language');
      
      allRecords.push({
        id: `tx_${tx.rec_ID}`,
        type: 'Text',
        title: tx.rec_Title,
        author,
        language,
        record: tx
      });
    });
    
    // Store records globally for direct filtering (no Lunr index needed)
    window._heuristRecords = allRecords;
    console.log('Built indexes:', allDocs.length, 'transcription lines,', allRecords.length, 'database records');
  }

  // ============= CHAT INTERFACE =============
  
  const $messages = document.getElementById('chat-messages');
  const $input = document.getElementById('chat-input');
  const $sendBtn = document.getElementById('chat-send-btn');
  const $suggestedQuestions = document.getElementById('suggested-questions');

  let conversationHistory = [];

  function addMessage(text, isUser, results = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'chat-message-avatar';
    avatar.textContent = isUser ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'chat-message-content';
    
    if (isUser) {
      content.textContent = text;
    } else {
      content.innerHTML = text;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    // Remove empty state if it exists
    const emptyState = $messages.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }
    
    $messages.appendChild(messageDiv);
    $messages.scrollTop = $messages.scrollHeight;
    
    conversationHistory.push({ text, isUser, results });
  }

  function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-message bot';
    loadingDiv.id = 'loading-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'chat-message-avatar';
    avatar.textContent = '🤖';
    
    const content = document.createElement('div');
    content.className = 'chat-message-content';
    content.innerHTML = `
      <div class="loading-indicator">
        Searching...
        <div class="loading-dots">
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
          <div class="loading-dot"></div>
        </div>
      </div>
    `;
    
    loadingDiv.appendChild(avatar);
    loadingDiv.appendChild(content);
    
    $messages.appendChild(loadingDiv);
    $messages.scrollTop = $messages.scrollHeight;
  }

  function hideLoading() {
    const loading = document.getElementById('loading-message');
    if (loading) loading.remove();
  }

  function cleanTitle(title) {
    return title
      .replace(/^[^,]+,\s*/, '')
      .replace(/,\s*Ms\.?\s*/i, ', ')
      .trim();
  }

  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function highlightMatches(text, keywords) {
    let highlighted = esc(text);
    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlighted = highlighted.replace(regex, '<span class="search-result-highlight">$1</span>');
    });
    return highlighted;
  }

  function formatMetadataResults(results, keywords) {
    if (results.length === 0) {
      return '<p>No results found.</p>';
    }
    
    let html = `<p><strong>Found ${results.length} result${results.length !== 1 ? 's' : ''}:</strong></p>`;
    
    // Group by type
    const byType = {};
    results.forEach(result => {
      const record = result.record;
      if (!byType[record.type]) byType[record.type] = [];
      byType[record.type].push(result);
    });
    
    // Show results by type (show up to 10 per type)
    Object.entries(byType).forEach(([type, records]) => {
      const displayCount = Math.min(records.length, 10);
      html += `<h4 style="margin-top:1rem; color:#d4af37; font-size:1rem;">${type}s (${records.length}${records.length > 10 ? ', showing 10' : ''})</h4>`;
      
      records.slice(0, 10).forEach(result => {
        const record = result.record;
        html += `<div class="search-result-card">`;
        html += `<div class="search-result-title">${esc(record.title)}</div>`;
        
        // Add type-specific details
        if (record.country || record.city) {
          html += `<div style="font-size:0.9rem; color:#666; margin-top:0.25rem;">`;
          if (record.city) html += `📍 ${esc(record.city)}`;
          if (record.country) html += ` ${esc(record.country)}`;
          html += `</div>`;
        }
        if (record.date) {
          html += `<div style="font-size:0.9rem; color:#666;">📅 ${esc(record.date)}</div>`;
        }
        if (record.order) {
          html += `<div style="font-size:0.9rem; color:#666;">✝️ ${esc(record.order)}</div>`;
        }
        if (record.author) {
          html += `<div style="font-size:0.9rem; color:#666;">✍️ ${esc(record.author)}</div>`;
        }
        if (record.institution) {
          html += `<div style="font-size:0.9rem; color:#666;">🏛️ ${esc(record.institution)}</div>`;
        }
        
        html += `</div>`;
      });
      
      if (records.length > 10) {
        html += `<p style="font-style: italic; color: #666; font-size:0.9rem; margin-top:0.5rem;">... and ${records.length - 10} more ${type}${records.length - 10 !== 1 ? 's' : ''}.</p>`;
      }
    });
    
    return html;
  }

  function formatTranscriptionResults(results, keywords) {
    if (results.length === 0) {
      return '<p>No results found.</p>';
    }
    
    const uniqueManuscripts = new Set(results.map(r => {
      const doc = byId.get(r.ref);
      return doc ? (doc.title || doc.slug) : null;
    })).size;
    
    const displayCount = Math.min(results.length, 3);
    let html = `<p><strong>Found ${results.length} transcription line${results.length !== 1 ? 's' : ''} in ${uniqueManuscripts} manuscript${uniqueManuscripts !== 1 ? 's' : ''} (showing top ${displayCount}):</strong></p>`;
    
    // Show top 3 results (reduced from 5 for brevity)
    const topResults = results.slice(0, 3);
    topResults.forEach(result => {
      const doc = byId.get(result.ref);
      if (!doc) return;
      
      const cleanedTitle = cleanTitle(doc.title || doc.slug);
      const pageNum = doc.id.split('::')[1];
      
      html += `
        <div class="search-result-card">
          <div class="search-result-title">${esc(cleanedTitle)} ${pageNum ? `· Page ${pageNum}` : ''}</div>
          <div class="search-result-text">${highlightMatches(doc.text, keywords)}</div>
        </div>
      `;
    });
    
    if (results.length > 3) {
      html += `<p style="font-style: italic; color: #666; margin-top: 1rem;">... and ${results.length - 3} more result${results.length - 3 !== 1 ? 's' : ''}. <span style="color:#999;">Try a more specific query to see different results.</span></p>`;
    }
    
    return html;
  }

  function generateResponse(query, filters, metaResults, txResults) {
    // No results at all
    if (metaResults.length === 0 && txResults.length === 0) {
      let response = `I couldn't find any results for "${query}".`;
      
      // Show what filters were applied
      if (Object.keys(filters).length > 0) {
        response += '<br><br><strong>Filters applied:</strong><ul style="margin: 0.5rem 0;">';
        if (filters.type) response += `<li>Type: ${filters.type}</li>`;
        if (filters.dateRange) response += `<li>Date range: ${filters.dateRange[0]}-${filters.dateRange[1]}</li>`;
        if (filters.city) response += `<li>City: ${filters.city}</li>`;
        if (filters.country) response += `<li>Country: ${filters.country}</li>`;
        if (filters.order) response += `<li>Religious order: ${filters.order}</li>`;
        if (filters.author) response += `<li>Author: ${filters.author}</li>`;
        response += '</ul>';
      }
      
      response += '<br><br>Try asking about:<ul style="margin: 0.5rem 0;"><li>Manuscripts from specific places (e.g., "manuscripts from Deventer")</li><li>Date ranges (e.g., "15th century manuscripts")</li><li>Religious institutions (e.g., "Dominican monasteries in Germany")</li><li>Historical people and texts</li></ul>';
      
      return response;
    }
    
    let response = '';
    
    // Show what filters were understood
    if (Object.keys(filters).length > 0) {
      response += '<div style="background:#f8f9fa; padding:0.75rem; border-radius:6px; margin-bottom:1rem; font-size:0.9rem; color:#666;">';
      response += '<strong>Understood query:</strong> ';
      const filterParts = [];
      if (filters.type) filterParts.push(filters.type + 's');
      if (filters.dateRange) filterParts.push(`${filters.dateRange[0]}-${filters.dateRange[1]}`);
      if (filters.city) filterParts.push(`in ${filters.city}`);
      if (filters.country) filterParts.push(`in ${filters.country}`);
      if (filters.order) filterParts.push(filters.order);
      if (filters.author) filterParts.push(`by ${filters.author}`);
      response += filterParts.join(', ');
      response += '</div>';
    }
    
    // Database metadata results
    if (metaResults.length > 0) {
      response += formatMetadataResults(metaResults, []);
    }
    
    // Transcription content results
    if (txResults.length > 0) {
      if (metaResults.length > 0) {
        response += '<br><br><p style="font-weight: 600; margin-top: 1.5rem;">📝 Also found in transcription content:</p>';
      }
      response += formatTranscriptionResults(txResults, []);
    }
    
    return response;
  }

  async function handleQuery(query) {
    if (!query.trim()) return;
    
    // Add user message
    addMessage(query, true);
    
    // Clear input
    $input.value = '';
    $sendBtn.disabled = true;
    
    // Show loading
    showLoading();
    
    try {
      // Ensure data is loaded
      if (!searchIdx || !window._heuristRecords) {
        await loadHeuristData();
        await loadAllManuscripts();
        buildSearchIndexes();
      }
      
      // Use Gemini to parse the query into structured filters
      const filters = await parseQueryWithGemini(query);
      console.log('Gemini parsed filters:', filters);
      
      // Apply filters to database records
      const allRecords = window._heuristRecords || [];
      let metadataResults = applyFilters(allRecords, filters);
      
      // Convert to result format with scores
      metadataResults = metadataResults.map(record => ({
        record,
        score: 1,
        matchedFields: Object.keys(filters).filter(k => k !== 'keywords')
      }));
      
      // Search transcriptions if query mentions content/transcriptions
      let transcriptionResults = [];
      const queryLower = query.toLowerCase();
      if (/transcription|content|text|mention|writing|reference/.test(queryLower) && searchIdx) {
        // Extract simple keywords for transcription search
        const keywords = query.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length > 3 && !/(manuscripts?|transcription|content|show|find|from|century)/.test(w));
        
        if (keywords.length > 0) {
          const searchTerms = keywords.join(' ');
          transcriptionResults = searchIdx.search(searchTerms, { 
            bool: 'OR',
            expand: false 
          }).slice(0, 8);
        }
      }
      
      // Generate response
      const response = generateResponse(query, filters, metadataResults, transcriptionResults);
      
      // Hide loading and show response
      hideLoading();
      addMessage(response, false, [...metadataResults, ...transcriptionResults]);
    } catch (error) {
      hideLoading();
      const errorMsg = `Error: ${error.message}. Please try again or contact the site administrator.`;
      addMessage(errorMsg, false);
      console.error('Query error:', error);
    }
    
    $sendBtn.disabled = false;
    $input.focus();
  }

  // Event listeners
  $sendBtn.addEventListener('click', () => handleQuery($input.value));
  
  $input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleQuery($input.value);
    }
  });

  $suggestedQuestions.addEventListener('click', (e) => {
    const questionEl = e.target.closest('.suggested-question');
    if (questionEl) {
      const question = questionEl.dataset.question;
      handleQuery(question);
    }
  });

  // Initial load
  console.log('Chatbot initialized. Loading database in background...');
  console.log('Using Google Gemini AI via serverless function for query understanding.');
  
  Promise.all([
    loadHeuristData(),
    loadAllManuscripts()
  ]).then(() => {
    buildSearchIndexes();
    const total = (window._heuristRecords || []).length;
    console.log('Search indexes built:', allDocs.length, 'transcription lines,', total, 'database records');
    console.log('Ready! Try asking a question.');
  }).catch(error => {
    console.error('Error loading data:', error);
  });

})();
</script>
