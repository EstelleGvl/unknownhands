---
layout: page
title: Chatbot Assistant
permalink: /chatbot/
---

<div class="container">
  <h1>Ask about the Unknown Hands corpus</h1>
  <p>Ask questions about manuscripts, production units, scribal units, texts, scribes, monasteries, and more. The chatbot can help you search by dates, locations, religious orders, and other criteria.</p>
  
  <!-- Test Mode Box (for local testing before Railway deployment) -->
  <div id="test-mode-box" style="background-color: #fff3cd; padding: 15px; margin-bottom: 20px; border-radius: 5px; border-left: 4px solid #ffc107;">
    <h5 style="margin-top: 0;">🧪 Test Mode</h5>
    <p style="margin-bottom: 10px; font-size: 14px;">For local testing: Enter your Gemini API key below. It will be used instead of the Railway proxy.</p>
    <input type="text" id="api-key-input" placeholder="Enter your Gemini API key (optional)" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
    <button onclick="setLocalApiKey()" style="padding: 8px 16px; background-color: #ffc107; border: none; border-radius: 4px; cursor: pointer;">Set API Key</button>
    <p id="api-key-status" style="margin-top: 10px; margin-bottom: 0; font-size: 12px; color: #666;"></p>
  </div>
  
  <div class="chatbot-container" style="max-width: 900px; margin: 0 auto;">
    <div id="chat-messages" style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; min-height: 400px; max-height: 600px; overflow-y: auto; margin-bottom: 20px; background-color: #f9f9f9;">
      <div class="bot-message" style="margin-bottom: 15px; padding: 12px; background-color: #e3f2fd; border-radius: 8px;">
        <strong>Assistant:</strong> Hello! I'm your AI assistant for exploring the Unknown Hands corpus. I can help you in two ways:
        
        <div style="margin-top: 10px; padding: 10px; background-color: white; border-radius: 4px;">
          <strong>🔍 Structured Search</strong> - Find specific records:
          <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px;">
            <li>"Show me manuscripts from the 15th century"</li>
            <li>"Find Cistercian monasteries in Germany"</li>
            <li>"Which production units have colophons?"</li>
          </ul>
        </div>
        
        <div style="margin-top: 10px; padding: 10px; background-color: white; border-radius: 4px;">
          <strong>🧠 Semantic Analysis</strong> - Analyze & interpret content:
          <ul style="margin: 5px 0; padding-left: 20px; font-size: 14px;">
            <li>"What do colophons say about prayer?"</li>
            <li>"How do women scribes describe themselves?"</li>
            <li>"What themes appear in 15th century colophons?"</li>
            <li>"Are there regional differences in scribal practices?"</li>
          </ul>
        </div>
        
        <p style="margin-top: 10px; font-size: 14px; color: #666;">You can also ask follow-up questions or request deeper analysis of search results!</p>
      </div>
    </div>
    
    <div style="display: flex; gap: 10px;">
      <input 
        type="text" 
        id="user-input" 
        placeholder="Ask a question about the corpus..." 
        style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;"
        onkeypress="if(event.key === 'Enter') sendMessage()"
      >
      <button 
        onclick="sendMessage()" 
        style="padding: 12px 24px; background-color: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;"
      >
        Send
      </button>
    </div>
    
    <div id="loading-indicator" style="display: none; text-align: center; margin-top: 15px; color: #666;">
      <span>Processing your question...</span>
    </div>
  </div>
</div>

<style>
.bot-message {
  margin-bottom: 15px;
  padding: 12px;
  background-color: #e3f2fd;
  border-radius: 8px;
}

.user-message {
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: right;
}

.result-card {
  margin: 10px 0;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.result-card h4 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
}

.result-meta {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.result-meta strong {
  color: #333;
}

.colophon-excerpt {
  background-color: #fffbf0;
  border-left: 4px solid #ffc107;
  padding: 10px;
  margin: 10px 0;
  font-style: italic;
}
</style>

<script>
// Global state
let localApiKey = null;
let dataLoaded = false;
let vocabulary = null;
let manuscripts = null;
let productionUnits = null;
let scribalUnits = null;
let texts = null;
let people = null;
let holdingInstitutions = null;
let monasticInstitutions = null;
let relationships = null;

// Conversation state
let conversationHistory = [];
let lastQueryResults = null;

// Indexes for fast lookups
let manuscriptById = {};
let productionUnitById = {};
let scribalUnitById = {};
let textById = {};
let personById = {};
let holdingInstitutionById = {};
let monasticInstitutionById = {};
let productionUnitsByManuscript = {};
let manuscriptsByProductionUnit = {};

// Set local API key for testing
function setLocalApiKey() {
  const input = document.getElementById('api-key-input');
  localApiKey = input.value.trim();
  const status = document.getElementById('api-key-status');
  if (localApiKey) {
    status.textContent = '✅ Local API key set. Queries will use direct Gemini API instead of Railway proxy.';
    status.style.color = '#28a745';
  } else {
    status.textContent = '❌ No API key entered. Will use Railway proxy (if deployed).';
    status.style.color = '#dc3545';
  }
}

// Load vocabulary and data on page load
async function loadAllData() {
  if (dataLoaded) return;
  
  try {
    addBotMessage('Loading corpus data (68MB total). This may take 30-60 seconds...<div id="load-progress" style="margin-top: 10px;"></div>');
    
    const updateProgress = (message) => {
      const progressDiv = document.getElementById('load-progress');
      if (progressDiv) {
        progressDiv.innerHTML += message + '<br>';
      }
    };
    
    // Load vocabulary (271KB)
    updateProgress('⏳ Loading vocabulary (271KB)...');
    const vocabResponse = await fetch('{{ site.baseurl }}/assets/data/vocabulary.json');
    if (!vocabResponse.ok) throw new Error('Failed to load vocabulary: ' + vocabResponse.status);
    vocabulary = await vocabResponse.json();
    updateProgress('✅ Vocabulary loaded: ' + Object.keys(vocabulary.vocabulary).length + ' terms');
    
    // Load manuscripts (4.3MB)
    updateProgress('⏳ Loading manuscripts (4.3MB)...');
    const msResp = await fetch('{{ site.baseurl }}/assets/data/manuscripts.json');
    if (!msResp.ok) throw new Error('Failed to load manuscripts: ' + msResp.status);
    manuscripts = await msResp.json();
    updateProgress('✅ Manuscripts: ' + manuscripts.heurist.records.length + ' records');
    
    // Load production units (12MB)
    updateProgress('⏳ Loading production units (12MB)...');
    const puResp = await fetch('{{ site.baseurl }}/assets/data/production_units.json');
    if (!puResp.ok) throw new Error('Failed to load production units: ' + puResp.status);
    productionUnits = await puResp.json();
    updateProgress('✅ Production units: ' + productionUnits.heurist.records.length + ' records');
    
    // Load scribal units (28MB - largest file!)
    updateProgress('⏳ Loading scribal units (28MB - this may take a minute)...');
    const suResp = await fetch('{{ site.baseurl }}/assets/data/scribal_units.json');
    if (!suResp.ok) throw new Error('Failed to load scribal units: ' + suResp.status);
    scribalUnits = await suResp.json();
    updateProgress('✅ Scribal units: ' + scribalUnits.heurist.records.length + ' records');
    
    // Load texts (2.8MB)
    updateProgress('⏳ Loading texts (2.8MB)...');
    const txtResp = await fetch('{{ site.baseurl }}/assets/data/texts.json');
    if (!txtResp.ok) throw new Error('Failed to load texts: ' + txtResp.status);
    texts = await txtResp.json();
    updateProgress('✅ Texts: ' + texts.heurist.records.length + ' records');
    
    // Load people (2.7MB)
    updateProgress('⏳ Loading historical people (2.7MB)...');
    const pplResp = await fetch('{{ site.baseurl }}/assets/data/historical_people.json');
    if (!pplResp.ok) throw new Error('Failed to load people: ' + pplResp.status);
    people = await pplResp.json();
    updateProgress('✅ Historical people: ' + people.heurist.records.length + ' records');
    
    // Load holding institutions (327KB)
    updateProgress('⏳ Loading holding institutions (327KB)...');
    const hiResp = await fetch('{{ site.baseurl }}/assets/data/holding_institutions.json');
    if (!hiResp.ok) throw new Error('Failed to load holding institutions: ' + hiResp.status);
    holdingInstitutions = await hiResp.json();
    updateProgress('✅ Holding institutions: ' + holdingInstitutions.heurist.records.length + ' records');
    
    // Load monastic institutions (5.5MB)
    updateProgress('⏳ Loading monastic institutions (5.5MB)...');
    const miResp = await fetch('{{ site.baseurl }}/assets/data/monastic_institutions.json');
    if (!miResp.ok) throw new Error('Failed to load monastic institutions: ' + miResp.status);
    monasticInstitutions = await miResp.json();
    updateProgress('✅ Monastic institutions: ' + monasticInstitutions.heurist.records.length + ' records');
    
    // Load relationships (13MB)
    updateProgress('⏳ Loading relationships (13MB)...');
    const relResp = await fetch('{{ site.baseurl }}/assets/data/relationships.json');
    if (!relResp.ok) throw new Error('Failed to load relationships: ' + relResp.status);
    relationships = await relResp.json();
    updateProgress('✅ Relationships: ' + relationships.heurist.records.length + ' records');
    
    updateProgress('<strong style="color: green;">✅ All data loaded successfully!</strong>');
    
    // Build indexes
    updateProgress('⏳ Building indexes...');
    buildIndexes();
    updateProgress('✅ Indexes built. Ready to search!');
    
    dataLoaded = true;
    
    // Calculate production units with manuscript references (the searchable corpus)
    const productionUnitsWithManuscripts = productionUnits.heurist.records.filter(pu => 
      pu.details.some(d => 
        d.fieldName === 'Manuscript' && 
        d.fieldType === 'resource' && 
        d.value && 
        d.value.type === '118'
      )
    ).length;
    
    // Clear the messages and show ready state
    setTimeout(() => {
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.innerHTML = '<div class="bot-message" style="margin-bottom: 15px; padding: 12px; background-color: #d4edda; border-radius: 8px;"><strong>✅ System ready!</strong> Loaded ' + manuscripts.heurist.records.length + ' manuscripts, ' + productionUnitsWithManuscripts + ' production units (in corpus), ' + scribalUnits.heurist.records.length + ' scribal units, ' + texts.heurist.records.length + ' texts, ' + people.heurist.records.length + ' people, ' + monasticInstitutions.heurist.records.length + ' monasteries, and more. Ask me anything!</div>';
    }, 1000);
  } catch (error) {
    console.error('❌ Error loading data:', error);
    addBotMessage('❌ Error loading data: ' + error.message + '. Please check the browser console for more details.');
    dataLoaded = true; // Set to true to prevent infinite retry loops
  }
}

// Build indexes for fast lookups
function buildIndexes() {
  // Index by ID
  manuscripts.heurist.records.forEach(rec => {
    manuscriptById[rec.rec_ID] = rec;
  });
  
  productionUnits.heurist.records.forEach(rec => {
    productionUnitById[rec.rec_ID] = rec;
  });
  
  scribalUnits.heurist.records.forEach(rec => {
    scribalUnitById[rec.rec_ID] = rec;
  });
  
  texts.heurist.records.forEach(rec => {
    textById[rec.rec_ID] = rec;
  });
  
  people.heurist.records.forEach(rec => {
    personById[rec.rec_ID] = rec;
  });
  
  holdingInstitutions.heurist.records.forEach(rec => {
    holdingInstitutionById[rec.rec_ID] = rec;
  });
  
  monasticInstitutions.heurist.records.forEach(rec => {
    monasticInstitutionById[rec.rec_ID] = rec;
  });
  
  // Build production unit <-> manuscript relationships
  productionUnits.heurist.records.forEach(pu => {
    const manuscriptField = pu.details.find(d => d.fieldName === 'Manuscript');
    if (manuscriptField && manuscriptField.value && manuscriptField.value.id) {
      const manuscriptId = manuscriptField.value.id;
      if (!productionUnitsByManuscript[manuscriptId]) {
        productionUnitsByManuscript[manuscriptId] = [];
      }
      productionUnitsByManuscript[manuscriptId].push(pu);
      
      if (!manuscriptsByProductionUnit[pu.rec_ID]) {
        manuscriptsByProductionUnit[pu.rec_ID] = [];
      }
      manuscriptsByProductionUnit[pu.rec_ID].push(manuscriptId);
    }
  });
  
  console.log('✅ Indexes built:');
  console.log('  - Manuscripts:', Object.keys(manuscriptById).length);
  console.log('  - Production units:', Object.keys(productionUnitById).length);
  console.log('  - Scribal units:', Object.keys(scribalUnitById).length);
  console.log('  - Texts:', Object.keys(textById).length);
  console.log('  - People:', Object.keys(personById).length);
  console.log('  - Holding institutions:', Object.keys(holdingInstitutionById).length);
  console.log('  - Monastic institutions:', Object.keys(monasticInstitutionById).length);
}

// Helper: Get term label from vocabulary
function getTermLabel(termId, fieldName = null) {
  if (!vocabulary) return termId;
  
  // Try field-specific vocabulary first
  if (fieldName && vocabulary.field_vocabularies && vocabulary.field_vocabularies[fieldName]) {
    const label = vocabulary.field_vocabularies[fieldName][String(termId)];
    if (label) return label;
  }
  
  // Fall back to global vocabulary
  const label = vocabulary.vocabulary[String(termId)];
  return label || termId;
}

// Helper: Find city term ID by name
function findCityTermId(cityName) {
  if (!vocabulary || !vocabulary.field_vocabularies || !vocabulary.field_vocabularies['PU City']) {
    return null;
  }
  
  const cityVocab = vocabulary.field_vocabularies['PU City'];
  const normalizedSearch = cityName.toLowerCase().trim();
  
  for (const [termId, label] of Object.entries(cityVocab)) {
    if (label.toLowerCase() === normalizedSearch) {
      return termId;
    }
  }
  
  return null;
}

// Helper: Find country term ID by name
function findCountryTermId(countryName) {
  if (!vocabulary || !vocabulary.field_vocabularies || !vocabulary.field_vocabularies['PU country']) {
    return null;
  }
  
  const countryVocab = vocabulary.field_vocabularies['PU country'];
  const normalizedSearch = countryName.toLowerCase().trim();
  
  for (const [termId, label] of Object.entries(countryVocab)) {
    if (label.toLowerCase() === normalizedSearch) {
      return termId;
    }
  }
  
  return null;
}

// Helper: Find religious order term ID by name
function findOrderTermId(orderName) {
  if (!vocabulary || !vocabulary.field_vocabularies || !vocabulary.field_vocabularies['Religious Order']) {
    return null;
  }
  
  const orderVocab = vocabulary.field_vocabularies['Religious Order'];
  const normalizedSearch = orderName.toLowerCase().trim();
  
  for (const [termId, label] of Object.entries(orderVocab)) {
    if (label.toLowerCase().includes(normalizedSearch) || normalizedSearch.includes(label.toLowerCase())) {
      return termId;
    }
  }
  
  return null;
}

// Helper: Convert century term to year range
function centuryToYearRange(centuryTerm) {
  const centuryMap = {
    '9748': [701, 800],   // 8th century
    '9749': [801, 900],   // 9th
    '9750': [901, 1000],  // 10th
    '9751': [1001, 1100], // 11th
    '9752': [1101, 1200], // 12th
    '9753': [1201, 1300], // 13th
    '9754': [1301, 1400], // 14th
    '9755': [1401, 1500], // 15th
    '9756': [1501, 1600], // 16th
    '9757': [1601, 1700]  // 17th
  };
  
  return centuryMap[String(centuryTerm)] || null;
}

// Helper: Check if production unit has a colophon (either flagged OR has actual text)
function hasColophon(pu) {
  const colophonPresenceField = pu.details.find(d => d.fieldName === 'Colophon Presence');
  const colophonTextField = pu.details.find(d => d.fieldName === 'Colophon transcription');
  
  const hasPresenceFlag = colophonPresenceField && String(colophonPresenceField.value) === '5444';
  const hasActualText = colophonTextField && colophonTextField.value && colophonTextField.value.trim().length > 0;
  
  return hasPresenceFlag || hasActualText;
}

// Filter production units by criteria
function filterProductionUnits(filters) {
  let results = [...productionUnits.heurist.records];
  
  // BY DEFAULT: Only include production units with manuscript references (the "real" corpus)
  // This filters from 5161 to ~1230 production units that are actually linked to manuscripts
  // Skip this filter only if explicitly requested via includeAllProductionUnits flag
  if (!filters.includeAllProductionUnits) {
    results = results.filter(pu => {
      return pu.details.some(d => 
        d.fieldName === 'Manuscript' && 
        d.fieldType === 'resource' && 
        d.value && 
        d.value.type === '118'
      );
    });
  }
  
  // Filter by date range
  if (filters.dateRange && filters.dateRange.length === 2) {
    const [startYear, endYear] = filters.dateRange;
    results = results.filter(pu => {
      const tpqField = pu.details.find(d => d.fieldName === 'Normalized terminus post quem');
      const taqField = pu.details.find(d => d.fieldName === 'Normalized terminus ante quem');
      
      if (!tpqField || !taqField) return false;
      
      const tpq = tpqField.value ? new Date(tpqField.value).getFullYear() : null;
      const taq = taqField.value ? new Date(taqField.value).getFullYear() : null;
      
      if (!tpq || !taq) return false;
      
      // Check if date ranges overlap
      return tpq <= endYear && taq >= startYear;
    });
  }
  
  // Filter by production city
  if (filters.productionCity) {
    const cityTermId = findCityTermId(filters.productionCity);
    if (cityTermId) {
      console.log('Looking for city "' + filters.productionCity + '" → term ID:', cityTermId);
      results = results.filter(pu => {
        const cityField = pu.details.find(d => d.fieldName === 'PU City');
        return cityField && String(cityField.value) === String(cityTermId);
      });
    } else {
      console.warn('City not found in vocabulary:', filters.productionCity);
      return [];
    }
  }
  
  // Filter by production country
  if (filters.productionCountry) {
    const countryTermId = findCountryTermId(filters.productionCountry);
    if (countryTermId) {
      console.log('Looking for country "' + filters.productionCountry + '" → term ID:', countryTermId);
      results = results.filter(pu => {
        const countryField = pu.details.find(d => d.fieldName === 'PU country');
        return countryField && String(countryField.value) === String(countryTermId);
      });
    } else {
      console.warn('Country not found in vocabulary:', filters.productionCountry);
      return [];
    }
  }
  
  // Filter by colophon presence
  if (filters.hasColophon !== undefined) {
    if (filters.hasColophon) {
      // Has colophon = TRUE: Either Colophon Presence field is TRUE, OR has actual colophon transcription text
      results = results.filter(pu => hasColophon(pu));
    } else {
      // Has colophon = FALSE: No presence flag AND no text
      results = results.filter(pu => !hasColophon(pu));
    }
  }
  
  return results;
}

// Filter monastic institutions by criteria
function filterMonasticInstitutions(filters) {
  let results = [...monasticInstitutions.heurist.records];
  
  // Filter by religious order
  if (filters.religiousOrder) {
    const orderTermId = findOrderTermId(filters.religiousOrder);
    if (orderTermId) {
      console.log('Looking for order "' + filters.religiousOrder + '" → term ID:', orderTermId);
      results = results.filter(mi => {
        const orderField = mi.details.find(d => d.fieldName === 'Religious Order');
        return orderField && String(orderField.value) === String(orderTermId);
      });
    } else {
      console.warn('Religious order not found in vocabulary:', filters.religiousOrder);
      return [];
    }
  }
  
  // Filter by city
  if (filters.city) {
    const cityTermId = findCityTermId(filters.city);
    if (cityTermId) {
      results = results.filter(mi => {
        const cityField = mi.details.find(d => d.fieldName === 'City');
        return cityField && String(cityField.value) === String(cityTermId);
      });
    }
  }
  
  // Filter by country
  if (filters.country) {
    const countryTermId = findCountryTermId(filters.country);
    if (countryTermId) {
      results = results.filter(mi => {
        const countryField = mi.details.find(d => d.fieldName === 'Country');
        return countryField && String(countryField.value) === String(countryTermId);
      });
    }
  }
  
  return results;
}

// Filter manuscripts (via production units)
function filterManuscripts(filters) {
  // First, filter production units
  const filteredPUs = filterProductionUnits(filters);
  
  // Get unique manuscript IDs from filtered production units
  const manuscriptIds = new Set();
  filteredPUs.forEach(pu => {
    const manuscriptField = pu.details.find(d => d.fieldName === 'Manuscript');
    if (manuscriptField && manuscriptField.value && manuscriptField.value.id) {
      manuscriptIds.add(manuscriptField.value.id);
    }
  });
  
  // Get manuscript records
  const results = Array.from(manuscriptIds).map(id => manuscriptById[id]).filter(Boolean);
  
  // Filter by holding institution if specified
  if (filters.holdingInstitution) {
    return results.filter(ms => {
      const hiField = ms.details.find(d => d.fieldName === 'Holding Institution');
      if (!hiField || !hiField.value || !hiField.value.id) return false;
      
      const hiId = hiField.value.id;
      const hi = holdingInstitutionById[hiId];
      if (!hi) return false;
      
      const searchTerm = filters.holdingInstitution.toLowerCase();
      return hi.rec_Title.toLowerCase().includes(searchTerm);
    });
  }
  
  return results;
}

// Format manuscript result with rich context
function formatManuscriptResult(manuscript) {
  let html = '<div class="result-card">';
  html += '<h4>' + escapeHtml(manuscript.rec_Title) + '</h4>';
  html += '<div class="result-meta">';
  
  // Holding institution
  const hiField = manuscript.details.find(d => d.fieldName === 'Holding Institution');
  if (hiField && hiField.value && hiField.value.id) {
    const hi = holdingInstitutionById[hiField.value.id];
    if (hi) {
      html += '<strong>Holding Institution:</strong> ' + escapeHtml(hi.rec_Title) + '<br>';
    }
  }
  
  // Production units with dates and locations
  const pus = productionUnitsByManuscript[manuscript.rec_ID] || [];
  if (pus.length > 0) {
    html += '<strong>Production:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
    pus.forEach(pu => {
      let puInfo = '';
      
      // Dating
      const puDatingField = pu.details.find(d => d.fieldName === 'PU dating');
      if (puDatingField && puDatingField.value) {
        puInfo += escapeHtml(puDatingField.value) + ' ';
      }
      
      // City
      const cityField = pu.details.find(d => d.fieldName === 'PU City');
      if (cityField && cityField.value) {
        const cityLabel = getTermLabel(cityField.value, 'PU City');
        puInfo += cityLabel + ', ';
      }
      
      // Country
      const countryField = pu.details.find(d => d.fieldName === 'PU country');
      if (countryField && countryField.value) {
        const countryLabel = getTermLabel(countryField.value, 'PU country');
        puInfo += countryLabel;
      }
      
      // Monastery
      const monasteryField = pu.details.find(d => d.fieldName === 'Monastic Institution');
      if (monasteryField && monasteryField.value && monasteryField.value.id) {
        const monastery = monasticInstitutionById[monasteryField.value.id];
        if (monastery) {
          puInfo += ' (' + escapeHtml(monastery.rec_Title) + ')';
        }
      }
      
      if (puInfo) {
        html += '<li>' + puInfo + '</li>';
      }
      
      // Colophon excerpt
      const colophonField = pu.details.find(d => d.fieldName === 'Colophon transcription');
      if (colophonField && colophonField.value) {
        const excerpt = colophonField.value.substring(0, 200);
        html += '<div class="colophon-excerpt">Colophon: "' + escapeHtml(excerpt) + (colophonField.value.length > 200 ? '...' : '') + '"</div>';
      }
    });
    html += '</ul>';
  }
  
  // Physical features
  const supportField = manuscript.details.find(d => d.fieldName === 'Support');
  const layoutField = manuscript.details.find(d => d.fieldName === 'Layout');
  if (supportField || layoutField) {
    html += '<strong>Physical:</strong> ';
    if (supportField && supportField.value) {
      html += 'Support: ' + getTermLabel(supportField.value, 'Support') + '; ';
    }
    if (layoutField && layoutField.value) {
      html += 'Layout: ' + getTermLabel(layoutField.value, 'Layout');
    }
    html += '<br>';
  }
  
  // Digitization
  const digiField = manuscript.details.find(d => d.fieldName === 'Digitization');
  if (digiField && digiField.value) {
    html += '<strong>Digitization:</strong> <a href="' + escapeHtml(digiField.value) + '" target="_blank">View online</a><br>';
  }
  
  html += '</div></div>';
  return html;
}

// Format monastic institution result
function formatMonasticInstitutionResult(institution) {
  let html = '<div class="result-card">';
  html += '<h4>' + escapeHtml(institution.rec_Title) + '</h4>';
  html += '<div class="result-meta">';
  
  // Religious order
  const orderField = institution.details.find(d => d.fieldName === 'Religious Order');
  if (orderField && orderField.value) {
    html += '<strong>Religious Order:</strong> ' + getTermLabel(orderField.value, 'Religious Order') + '<br>';
  }
  
  // Location
  const cityField = institution.details.find(d => d.fieldName === 'City');
  const countryField = institution.details.find(d => d.fieldName === 'Country');
  if (cityField || countryField) {
    html += '<strong>Location:</strong> ';
    if (cityField && cityField.value) {
      html += getTermLabel(cityField.value, 'City') + ', ';
    }
    if (countryField && countryField.value) {
      html += getTermLabel(countryField.value, 'Country');
    }
    html += '<br>';
  }
  
  // Gender
  const genderField = institution.details.find(d => d.fieldName === 'Gender');
  if (genderField && genderField.value) {
    html += '<strong>Gender:</strong> ' + getTermLabel(genderField.value, 'Gender') + '<br>';
  }
  
  // Dates
  const foundationField = institution.details.find(d => d.fieldName === 'Foundation');
  const dissolutionField = institution.details.find(d => d.fieldName === 'Dissolution');
  if (foundationField || dissolutionField) {
    html += '<strong>Active:</strong> ';
    if (foundationField && foundationField.value) {
      html += escapeHtml(foundationField.value);
    }
    if (dissolutionField && dissolutionField.value) {
      html += ' - ' + escapeHtml(dissolutionField.value);
    }
    html += '<br>';
  }
  
  html += '</div></div>';
  return html;
}

// Format production unit result
function formatProductionUnitResult(pu) {
  let html = '<div class="result-card">';
  html += '<h4>Production Unit: ' + escapeHtml(pu.rec_Title) + '</h4>';
  html += '<div class="result-meta">';
  
  // Manuscript
  const manuscriptField = pu.details.find(d => d.fieldName === 'Manuscript');
  if (manuscriptField && manuscriptField.value && manuscriptField.value.id) {
    const ms = manuscriptById[manuscriptField.value.id];
    if (ms) {
      html += '<strong>Manuscript:</strong> ' + escapeHtml(ms.rec_Title) + '<br>';
    }
  }
  
  // Dating
  const puDatingField = pu.details.find(d => d.fieldName === 'PU dating');
  if (puDatingField && puDatingField.value) {
    html += '<strong>Dating:</strong> ' + escapeHtml(puDatingField.value) + '<br>';
  }
  
  // Location
  const cityField = pu.details.find(d => d.fieldName === 'PU City');
  const countryField = pu.details.find(d => d.fieldName === 'PU country');
  if (cityField || countryField) {
    html += '<strong>Location:</strong> ';
    if (cityField && cityField.value) {
      html += getTermLabel(cityField.value, 'PU City') + ', ';
    }
    if (countryField && countryField.value) {
      html += getTermLabel(countryField.value, 'PU country');
    }
    html += '<br>';
  }
  
  // Monastery
  const monasteryField = pu.details.find(d => d.fieldName === 'Monastic Institution');
  if (monasteryField && monasteryField.value && monasteryField.value.id) {
    const monastery = monasticInstitutionById[monasteryField.value.id];
    if (monastery) {
      html += '<strong>Monastic Institution:</strong> ' + escapeHtml(monastery.rec_Title) + '<br>';
    }
  }
  
  // Colophon
  const colophonPresenceField = pu.details.find(d => d.fieldName === 'Colophon Presence');
  if (colophonPresenceField && String(colophonPresenceField.value) === '5444') {
    const colophonField = pu.details.find(d => d.fieldName === 'Colophon transcription');
    if (colophonField && colophonField.value) {
      const excerpt = colophonField.value.substring(0, 300);
      html += '<div class="colophon-excerpt">"' + escapeHtml(excerpt) + (colophonField.value.length > 300 ? '...' : '') + '"</div>';
    }
  }
  
  html += '</div></div>';
  return html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Classify query and parse with Gemini
async function parseQueryWithGemini(userQuery) {
  const conversationContext = conversationHistory.length > 0 
    ? '\n\nPrevious conversation:\n' + conversationHistory.slice(-3).map(h => `User: ${h.user}\nAssistant: ${h.assistant}`).join('\n')
    : '';

  const prompt = `You are an intelligent assistant for a medieval manuscript database. 

The database has these entity types:

1. **Manuscript** - Physical codex records (2,205 records) with:
   - Holding Institution (current library)
   - Physical features (Support, Layout, Dimensions)
   - Digitization links
   - NO dates or production locations (those are in Production Units)

2. **Production Unit** - Codicological units (1,230 in corpus; 5,161 total in database) with:
   - Manuscript (resource pointer to type 118) - BY DEFAULT only search production units WITH this field (the real corpus)
   - Dating fields: "PU dating" (text), "Normalized terminus post quem" (YYYY-MM-DD), "Normalized terminus ante quem" (YYYY-MM-DD), "Normalized century of production" (term ID)
   - Location: "PU City" (term ID), "PU country" (term ID)
   - "Monastic Institution" (resource pointer)
   - "Colophon Presence" (enum: 5444=TRUE, 5442=FALSE)
   - "Colophon transcription" (text - the actual colophon content)
   - "Colophon translation" (text - English translation)
   - "Colophon language" (term ID)
   - "Colophon comments" (text)

3. **Scribal Unit** - Copying units (15,162 records) with:
   - Production Unit link
   - Scribe information
   - Script type, Execution quality

4. **Text** - Works copied (2,575 records) with:
   - Title, Author
   - Text type

5. **Historical People** - Scribes, authors, patrons (2,417 records) with:
   - Name, Gender, Role
   - Religious status

6. **Monastic Institution** - Monasteries/convents (3,674 records) with:
   - Religious Order (term ID)
   - City, Country (term IDs)
   - Gender (term ID)
   - Foundation/Dissolution dates

7. **Holding Institution** - Current libraries (230 records) with:
   - Institution name
   - City, Country

8. **Relationships** - Connections between entities (9,465 records)

IMPORTANT: 
- Dates and production locations are in Production Units, NOT in Manuscripts
- To find "manuscripts from X century" or "manuscripts from Y city", you must filter Production Units first, then get their manuscripts
- City/country names will be resolved to term IDs automatically
- Century ranges: 15th = 1401-1500, 16th = 1501-1600, etc.
- All entities are fully loaded and available for querying

**QUERY TYPES:**

**Type A - STRUCTURED_SEARCH**: Queries asking for specific records/filtering
Examples: "Show me manuscripts from 15th century", "Find Cistercian monasteries in Germany", "Which production units have colophons?"
→ Return filters for database search

**Type B - SEMANTIC_ANALYSIS**: Queries asking to analyze/interpret/summarize TEXT CONTENT
Examples: "What do colophons say about prayer?", "How do women describe themselves?", "What themes appear in colophons?", "Summarize the colophons about X"
→ Return filters to get relevant records, PLUS indicate this needs AI text analysis

CRITICAL for SEMANTIC_ANALYSIS:
- If query asks about "colophons", MUST include: hasColophon: true
- If query asks about specific topic (e.g., "prayer", "humility"), include: textKeywords: ["prayer"] (for filtering relevant texts)
- Always limit scope to relevant subset, never analyze all 5161 production units

Parse this query and return JSON with:
- queryType: "STRUCTURED_SEARCH" | "SEMANTIC_ANALYSIS"
- analysisQuestion: (for SEMANTIC_ANALYSIS) the question to answer by reading the texts
- textKeywords: (for SEMANTIC_ANALYSIS) array of keywords to filter text content (e.g., ["prayer", "pray", "orison"])
- entityType: "Manuscript" | "ProductionUnit" | "MonasticInstitution" | "ScribalUnit" | "Text" | "HistoricalPerson"
- filters: object with filtering criteria - MUST include hasColophon:true if asking about colophons
- contextText: Brief explanation of what you understood from the query (will be shown to user)

Current query: "${userQuery}"${conversationContext}

Return ONLY valid JSON, no explanation.`;

  try {
    let response;
    
    if (localApiKey) {
      // Use direct Gemini API with local key
      console.log('Using local API key (test mode)');
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + localApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
    } else {
      // Use Railway proxy (or return error if not configured)
      console.log('Using Railway proxy');
      const railwayUrl = 'https://YOUR-APP.up.railway.app/api/gemini';
      if (railwayUrl.includes('YOUR-APP')) {
        throw new Error('Railway URL not configured. Please either: (1) Enter your Gemini API key in the test box above, or (2) Deploy to Railway and update the URL in the code.');
      }
      response = await fetch(railwayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      throw new Error('API request failed: ' + response.status);
    }
    
    const data = await response.json();
    console.log('Gemini response:', data);
    
    // Extract text from response
    let text;
    if (localApiKey) {
      text = data.candidates[0].content.parts[0].text;
    } else {
      text = data.text;
    }
    
    // Extract JSON from response (may be wrapped in markdown code blocks)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    // Find first { and last }
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    
    const filters = JSON.parse(jsonText);
    console.log('Parsed filters:', filters);
    return filters;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Perform semantic analysis on text content using Gemini
async function performSemanticAnalysis(question, results, entityType, keywords) {
  console.log('Performing semantic analysis on', results.length, 'results with keywords:', keywords);
  
  // Extract relevant text content from results
  let textContent = [];
  
  if (entityType === 'ProductionUnit') {
    results.forEach((pu, idx) => {
      const colophonField = pu.details.find(d => d.fieldName === 'Colophon transcription');
      const translationField = pu.details.find(d => d.fieldName === 'Colophon translation');
      
      if (colophonField && colophonField.value) {
        // If keywords provided, filter to only colophons containing those keywords
        if (keywords && keywords.length > 0) {
          const textToSearch = (colophonField.value + ' ' + (translationField?.value || '')).toLowerCase();
          const hasKeyword = keywords.some(kw => textToSearch.includes(kw.toLowerCase()));
          if (!hasKeyword) return; // Skip this colophon
        }
        
        textContent.push({
          id: textContent.length + 1,
          manuscript: pu.rec_Title,
          transcription: colophonField.value,
          translation: translationField?.value || null
        });
      }
    });
  }
  
  if (textContent.length === 0) {
    if (keywords && keywords.length > 0) {
      return `I searched through ${results.length} production units with colophons, but none of them contain the keywords: ${keywords.join(', ')}. Try broadening your search terms or asking about a different topic.`;
    }
    return "I couldn't find any text content to analyze in the filtered results.";
  }
  
  // Limit to first 30 for performance
  const analysisSet = textContent.slice(0, 30);
  
  // Build analysis prompt
  const keywordContext = keywords && keywords.length > 0 
    ? `\nNote: These colophons were pre-filtered to contain keywords related to: ${keywords.join(', ')}`
    : '';
  
  const analysisPrompt = `You are a medieval manuscript expert analyzing colophons from female scribes.

I have ${analysisSet.length} colophon texts to analyze${textContent.length > 30 ? ' (selected from ' + textContent.length + ' matching colophons)' : ''}.${keywordContext}

**Research Question**: ${question}

**Colophon Texts**:
${analysisSet.map(c => `
[${c.id}] Manuscript: ${c.manuscript}
Transcription: ${c.transcription}
${c.translation ? 'Translation: ' + c.translation : ''}
`).join('\n---\n')}

Please provide a scholarly analysis:
1. **Direct Answer**: Answer the research question clearly
2. **Evidence**: Provide specific quotes from the colophons (reference by number like [1], [2])
3. **Patterns**: What recurring themes, phrases, or formulas do you notice?
4. **Context**: What does this tell us about medieval female scribal culture?
5. **Summary**: Brief conclusion (2-3 sentences)

Quote the original Latin/vernacular text when relevant, followed by translation in parentheses. Be specific and cite your sources.`;

  try {
    let response;
    
    if (localApiKey) {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + localApiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: analysisPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      });
    } else {
      const railwayUrl = 'https://YOUR-APP.up.railway.app/api/gemini';
      if (railwayUrl.includes('YOUR-APP')) {
        throw new Error('Railway URL not configured. Please enter your Gemini API key in the test box above.');
      }
      response = await fetch(railwayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: analysisPrompt })
      });
    }
    
    if (!response.ok) {
      throw new Error('Analysis request failed: ' + response.status);
    }
    
    const data = await response.json();
    let analysisText;
    
    if (localApiKey) {
      analysisText = data.candidates[0].content.parts[0].text;
    } else {
      analysisText = data.text;
    }
    
    return analysisText;
  } catch (error) {
    console.error('Error performing semantic analysis:', error);
    throw error;
  }
}

// Send user message
async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Ensure data is loaded
  if (!dataLoaded) {
    await loadAllData();
  }
  
  // Check if data actually loaded successfully
  if (!manuscripts || !productionUnits || !vocabulary || !scribalUnits || !texts || !people || !monasticInstitutions) {
    addBotMessage('❌ Data is still loading or failed to load. Please wait for all data to finish loading, then try again.');
    return;
  }
  
  // Add user message to chat
  addUserMessage(message);
  input.value = '';
  
  // Show loading indicator
  document.getElementById('loading-indicator').style.display = 'block';
  
  try {
    // Parse query with Gemini
    const queryPlan = await parseQueryWithGemini(message);
    console.log('Query plan:', queryPlan);
    
    // Show what we understood
    if (queryPlan.contextText) {
      addBotMessage('<em style="color: #666;">' + queryPlan.contextText + '</em>');
    }
    
    // Execute structured search based on entity type
    let results;
    let formatter;
    const filters = queryPlan.filters || queryPlan; // Support both new and old format
    
    if (queryPlan.entityType === 'Manuscript' || filters.entityType === 'Manuscript') {
      results = filterManuscripts(filters);
      formatter = formatManuscriptResult;
    } else if (queryPlan.entityType === 'ProductionUnit' || filters.entityType === 'ProductionUnit') {
      results = filterProductionUnits(filters);
      formatter = formatProductionUnitResult;
    } else if (queryPlan.entityType === 'MonasticInstitution' || filters.entityType === 'MonasticInstitution') {
      results = filterMonasticInstitutions(filters);
      formatter = formatMonasticInstitutionResult;
    } else {
      addBotMessage('Sorry, I can currently only search for Manuscripts, Production Units, and Monastic Institutions. Support for other entity types is coming soon!');
      return;
    }
    
    // Store results for follow-up queries
    lastQueryResults = results;
    
    // Check if this is a semantic analysis query
    if (queryPlan.queryType === 'SEMANTIC_ANALYSIS' && queryPlan.analysisQuestion) {
      // First show how many results we found
      const filteredCount = queryPlan.textKeywords && queryPlan.textKeywords.length > 0
        ? results.filter(r => {
            const colophonField = r.details.find(d => d.fieldName === 'Colophon transcription');
            const translationField = r.details.find(d => d.fieldName === 'Colophon translation');
            if (!colophonField || !colophonField.value) return false;
            const textToSearch = (colophonField.value + ' ' + (translationField?.value || '')).toLowerCase();
            return queryPlan.textKeywords.some(kw => textToSearch.includes(kw.toLowerCase()));
          }).length
        : results.length;
      
      addBotMessage(`📊 Found ${results.length} production units with colophons${queryPlan.textKeywords ? ', filtering for relevant content...' : '. Now analyzing the content...'}${filteredCount < results.length ? ' (' + filteredCount + ' contain relevant keywords)' : ''}`);
      
      // Perform AI analysis on the text content
      const analysis = await performSemanticAnalysis(
        queryPlan.analysisQuestion, 
        results, 
        queryPlan.entityType || filters.entityType,
        queryPlan.textKeywords || []
      );
      
      // Display the analysis
      addBotMessage('<div style="background-color: #f0f8ff; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0; border-radius: 4px;"><strong>📝 Analysis:</strong><br><br>' + 
        analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') + 
        '</div>');
      
      // Show a few example results
      if (results.length > 0) {
        addBotMessage('<strong>Example records from the analysis:</strong>');
        const exampleCount = Math.min(5, results.length);
        let html = '';
        for (let i = 0; i < exampleCount; i++) {
          html += formatter(results[i]);
        }
        if (results.length > exampleCount) {
          html += '<p style="text-align: center; color: #666; font-style: italic;">Showing 5 of ' + results.length + ' results.</p>';
        }
        addBotMessage(html);
      }
      
      // Save to conversation history
      conversationHistory.push({
        user: message,
        assistant: 'Analyzed ' + results.length + ' records: ' + analysis.substring(0, 200) + '...'
      });
      
    } else {
      // Standard structured search - show all results
      if (results.length === 0) {
        addBotMessage('No results found for your query. Try adjusting your search criteria or rephrasing your question.');
      } else {
        let html = '<strong>Found ' + results.length + ' result' + (results.length === 1 ? '' : 's') + ':</strong><br><br>';
        
        // Limit to first 20 results
        const displayResults = results.slice(0, 20);
        displayResults.forEach(result => {
          html += formatter(result);
        });
        
        if (results.length > 20) {
          html += '<p style="text-align: center; color: #666; font-style: italic;">Showing first 20 of ' + results.length + ' results. Try refining your search or ask me to analyze specific aspects of these results.</p>';
        }
        
        addBotMessage(html);
        
        // Save to conversation history
        conversationHistory.push({
          user: message,
          assistant: 'Found ' + results.length + ' results'
        });
      }
    }
    
  } catch (error) {
    console.error('Error processing query:', error);
    addBotMessage('Sorry, there was an error processing your query: ' + error.message + '. Please try again or rephrase your question.');
  } finally {
    document.getElementById('loading-indicator').style.display = 'none';
  }
}

// Add bot message to chat
function addBotMessage(html) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'bot-message';
  messageDiv.innerHTML = '<strong>Assistant:</strong> ' + html;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add user message to chat
function addUserMessage(text) {
  const chatMessages = document.getElementById('chat-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'user-message';
  messageDiv.innerHTML = '<strong>You:</strong> ' + escapeHtml(text);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadAllData();
});
</script>
