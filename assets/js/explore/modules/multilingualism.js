window.ExploreMultilingualism = (function() {
  return {
    init: function(Core) {
      const {
        val, getVal, getDetail, getRes, getDetailsAll, getValsAll, getControlledValsAll, esc,
        $panes, $tabs, $mapTitle, exportMapAsPng, TimelineModule, ensureLeaflet
      } = Core;
      const REC_TYPE_TO_ENTITY = Core.REC_TYPE_TO_ENTITY || {};
      const isKnownCategory = Core.isKnownCategory;

      const getRecordRelationships = (recId) => {
        const id = String(recId);
        const outgoing = Core.REL_INDEX?.bySource?.[id] || [];
        const incoming = Core.REL_INDEX?.byTarget?.[id] || [];
        return [...outgoing, ...incoming];
      };
      
      const getTIMELINE_SELECTED = () => null;

      // Local debounce helper (modules load before app.js global helpers)
      const debounce = (fn, ms) => {
        let t;
        return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
      };

/* ---------- Multilingualism Module ---------- */

// Track current multilingualism tab
let CURRENT_MULTILINGUALISM_TAB = 'overview';
let MULTILINGUALISM_RENDER_TOKEN = 0;
let MULTILINGUALISM_OVERVIEW_HTML = null;

// The corpus is static for the lifetime of the page. Cache relationship-derived
// values so the five views do not repeatedly traverse the same records.
const LANGUAGE_INFO_CACHE = new Map();
const SCRIBES_BY_SU_CACHE = new Map();
const INSTITUTIONS_BY_PU_CACHE = new Map();
const PU_IDS_BY_SU_CACHE = new Map();
const MS_ID_BY_RECORD_CACHE = new Map();
let STRUCTURE_INDEX_CACHE = null;
const MULTILINGUALISM_PAGE_SIZE = 20;
const MULTILINGUALISM_PAGE_STATE = {
  manuscripts: 1,
  scribes: 1,
  institutions: 1,
  colophons: 1
};

function getPaginatedItems(items, key) {
  const totalPages = Math.max(1, Math.ceil(items.length / MULTILINGUALISM_PAGE_SIZE));
  const page = Math.min(Math.max(1, MULTILINGUALISM_PAGE_STATE[key] || 1), totalPages);
  MULTILINGUALISM_PAGE_STATE[key] = page;
  const start = (page - 1) * MULTILINGUALISM_PAGE_SIZE;
  return {
    items: items.slice(start, start + MULTILINGUALISM_PAGE_SIZE),
    page,
    totalPages,
    start
  };
}

function buildResultPagination(key, totalItems, page, totalPages) {
  if (totalItems <= MULTILINGUALISM_PAGE_SIZE) {
    return `<div class="explore-pagination-status">Showing all ${totalItems} result${totalItems !== 1 ? 's' : ''}</div>`;
  }
  const firstItem = ((page - 1) * MULTILINGUALISM_PAGE_SIZE) + 1;
  const lastItem = Math.min(page * MULTILINGUALISM_PAGE_SIZE, totalItems);
  return `
    <nav class="explore-results-pagination" aria-label="Results pages" data-pagination-key="${key}">
      <button type="button" class="explore-action-btn explore-pagination-btn" data-page="${page - 1}" ${page === 1 ? 'disabled' : ''}>Previous</button>
      <span aria-live="polite">Page ${page} of ${totalPages} · ${firstItem}–${lastItem} of ${totalItems}</span>
      <button type="button" class="explore-action-btn explore-pagination-btn" data-page="${page + 1}" ${page === totalPages ? 'disabled' : ''}>Next</button>
    </nav>
  `;
}

function bindResultPagination(mount, key, renderPage) {
  mount.querySelectorAll(`[data-pagination-key="${key}"] button[data-page]`).forEach(button => {
    button.addEventListener('click', () => {
      MULTILINGUALISM_PAGE_STATE[key] = Number(button.dataset.page);
      renderPage();
      if (typeof mount.focus === 'function') mount.focus({ preventScroll: true });
      mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// Main entry point for multilingualism mode
function buildMultilingualism() {
  // Initialize tab navigation if first time
  if (!window.multilingualismTabsInitialized) {
    initMultilingualismTabs();
    window.multilingualismTabsInitialized = true;
  }
  
  // Build the current tab
  buildMultilingualismTab(CURRENT_MULTILINGUALISM_TAB);
}

// Initialize tab navigation
function initMultilingualismTabs() {
  const tabList = document.querySelector('#mode-multilingualism .explore-module-tabs');
  const panel = document.getElementById('multilingualism-mount');
  Core.enhanceExploreTabList(tabList, panel);

  document.querySelectorAll('.multilingualism-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) {
        CURRENT_MULTILINGUALISM_TAB = tab;
        
        // Update tab button styles
        document.querySelectorAll('.multilingualism-tab-btn').forEach(b => {
          const isActive = b.dataset.tab === tab;
          b.classList.toggle('is-on', isActive);
        });
        Core.syncExploreTabList(tabList, btn, panel);
        Core.updateExploreUrl('multilingualism', tab);
        
        // Build the selected tab
        buildMultilingualismTab(tab);
      }
    });
  });
}

// Build specific tab content
function buildMultilingualismTab(tab) {
  const mount = document.getElementById('multilingualism-mount');
  if (!mount) return;

  const renderToken = ++MULTILINGUALISM_RENDER_TOKEN;
  mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">Loading...</div>';

  // Let the loading state paint without imposing an arbitrary delay. The token
  // prevents an earlier render from replacing a newer tab selection.
  requestAnimationFrame(() => {
    if (renderToken !== MULTILINGUALISM_RENDER_TOKEN) return;
    switch(tab) {
      case 'overview':
        buildMultilingualismOverview(mount);
        break;
      case 'manuscripts':
        buildMultilingualManuscripts(mount);
        break;
      case 'scribes':
        buildScribalMultilingualism(mount);
        break;
      case 'institutions':
        buildInstitutionalMultilingualism(mount);
        break;
      case 'colophons':
        buildColophonTextDivergence(mount);
        break;
      default:
        mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">Select a tab to explore.</div>';
    }
  });
}

// ===== getDATA() EXTRACTION FUNCTIONS =====

/**
 * Get all language information for a record (SU/PU/Text)
 * Returns: { text: [], colophon: [], all: [], isMultilingual: bool, hasColophonDivergence: bool }
 */
function getLanguageInfo(record, recordType) {
  const cacheKey = `${recordType}:${record.rec_ID}`;
  if (LANGUAGE_INFO_CACHE.has(cacheKey)) return LANGUAGE_INFO_CACHE.get(cacheKey);

  const languages = {
    text: [],
    colophon: [],
    dialect: [],
    all: new Set()
  };
  
  // 1. Get colophon language (direct field in SU/PU)
  const colophonLang = getVal(record, 'Colophon language');
  if (colophonLang) {
    // Handle multi-value fields
    const colophonLangs = Array.isArray(colophonLang) ? colophonLang : [colophonLang];
    colophonLangs.forEach(lang => {
      if (isKnownCategory(lang)) {
        languages.colophon.push(lang.trim());
        languages.all.add(lang.trim());
      }
    });
  }
  
  // 2. Get text languages from relationships
  const recordId = String(record.rec_ID);
  const rels = [
    ...((Core.REL_INDEX || {}).bySource?.[recordId] || []),
    ...((Core.REL_INDEX || {}).byTarget?.[recordId] || [])
  ];
  
  for (const rel of rels) {
    // Get language from relationship metadata
    const textLang = getVal(rel, 'Text Language(s)') || getVal(rel, 'Language of Text');
    if (textLang) {
      const textLangs = Array.isArray(textLang) ? textLang : [textLang];
      textLangs.forEach(lang => {
        if (isKnownCategory(lang)) {
          languages.text.push(lang.trim());
          languages.all.add(lang.trim());
        }
      });
    }
    
    // Check if this relationship is to a text
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const textId = Core.IDX.tx?.[String(src?.id)] ? String(src.id) : 
                   Core.IDX.tx?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (textId) {
      const textRec = Core.IDX.tx[textId];
      if (textRec) {
        // Get language from text record itself
        const lang = getVal(textRec, 'Text Language(s)') || getVal(textRec, 'Language of Text');
        if (lang) {
          const langs = Array.isArray(lang) ? lang : [lang];
          langs.forEach(l => {
            if (isKnownCategory(l) && !languages.text.includes(l.trim())) {
              languages.text.push(l.trim());
              languages.all.add(l.trim());
            }
          });
        }
      }
    }
  }
  
  // For texts themselves, check their own language field
  if (recordType === 'tx') {
    const textLang = getVal(record, 'Text Language(s)') || getVal(record, 'Language of Text');
    if (textLang) {
      const langs = Array.isArray(textLang) ? textLang : [textLang];
      langs.forEach(lang => {
        if (isKnownCategory(lang) && !languages.text.includes(lang.trim())) {
          languages.text.push(lang.trim());
          languages.all.add(lang.trim());
        }
      });
    }
  }
  
  const languageInfo = {
    text: languages.text,
    colophon: languages.colophon,
    dialect: languages.dialect,
    all: Array.from(languages.all),
    isMultilingual: languages.all.size > 1,
    hasColophonDivergence: languages.colophon.length > 0 && 
                           languages.text.length > 0 &&
                           !languages.text.some(t => languages.colophon.includes(t))
  };
  LANGUAGE_INFO_CACHE.set(cacheKey, languageInfo);
  return languageInfo;
}

/**
 * Get scribe(s) for a scribal unit
 * Returns: [{ scribeId, scribeName, role, certainty }]
 * Excludes male scribes (filters by gender field)
 */
function getScribesForSU(su) {
  const suId = String(su.rec_ID);
  if (SCRIBES_BY_SU_CACHE.has(suId)) return SCRIBES_BY_SU_CACHE.get(suId);

  const scribes = [];
  const rels = [
    ...((Core.REL_INDEX || {}).bySource?.[suId] || []),
    ...((Core.REL_INDEX || {}).byTarget?.[suId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    
    // Check if this is a relationship to a historical person
    const hpId = Core.IDX.hp?.[String(src?.id)] ? String(src.id) :
                 Core.IDX.hp?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (hpId) {
      const hp = Core.IDX.hp[hpId];
      
      // Filter out male scribes - only include female or unknown gender
      const gender = getVal(hp, 'Gender');
      const genderStr = gender ? String(gender).toLowerCase() : '';
      if (genderStr === 'male') {
        continue; // Skip male scribes
      }
      
      const role = getVal(rel, 'Scribe role') || 'scribe';
      const certainty = getVal(rel, 'scribe certainty') || '';
      
      const scribeName = Core.MAP.hp?.title(hp);
      if (!isKnownCategory(scribeName)) continue;
      scribes.push({
        scribeId: hpId,
        scribeName,
        role: role,
        certainty: certainty
      });
    }
  }
  
  SCRIBES_BY_SU_CACHE.set(suId, scribes);
  return scribes;
}

/**
 * Get institution(s) for a production unit
 * Returns: [{ institutionId, institutionName, institutionType }]
 */
function getInstitutionsForPU(pu) {
  const puId = String(pu.rec_ID);
  if (INSTITUTIONS_BY_PU_CACHE.has(puId)) return INSTITUTIONS_BY_PU_CACHE.get(puId);

  const institutions = [];
  
  // First check pointer fields in the PU record
  (pu.details || []).forEach(d => {
    const v = d?.value;
    if (v && typeof v === 'object' && v.id && v.type) {
      const toId = String(v.id);
      if (Core.IDX.mi?.[toId]) {
        const mi = Core.IDX.mi[toId];
        const institutionName = Core.MAP.mi?.title(mi);
        if (!isKnownCategory(institutionName)) return;
        institutions.push({
          institutionId: toId,
          institutionName,
          institutionType: isKnownCategory(getVal(mi, 'Institution type')) ? getVal(mi, 'Institution type') : ''
        });
      }
    }
  });
  
  // Then check relationships
  const rels = [
    ...((Core.REL_INDEX || {}).bySource?.[puId] || []),
    ...((Core.REL_INDEX || {}).byTarget?.[puId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    
    // Check if this is a relationship to a monastic institution
    const miId = Core.IDX.mi?.[String(src?.id)] ? String(src.id) :
                 Core.IDX.mi?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (miId && !institutions.find(inst => inst.institutionId === miId)) {
      const mi = Core.IDX.mi[miId];
      const institutionName = Core.MAP.mi?.title(mi);
      if (!isKnownCategory(institutionName)) continue;
      institutions.push({
        institutionId: miId,
        institutionName,
        institutionType: isKnownCategory(getVal(mi, 'Institution type')) ? getVal(mi, 'Institution type') : ''
      });
    }
  }
  
  INSTITUTIONS_BY_PU_CACHE.set(puId, institutions);
  return institutions;
}

/**
 * Get monastic institution(s) for a scribe (historical person)
 * Follows: Historical Person → Monastic Institution relationship
 * Returns: [{ institutionId, institutionName, institutionType }]
 */
function getInstitutionsForScribe(hpId) {
  const institutions = [];
  
  // Get all relationships for this historical person
  const rels = [
    ...((Core.REL_INDEX || {}).bySource?.[hpId] || []),
    ...((Core.REL_INDEX || {}).byTarget?.[hpId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    
    // Check if this is a relationship to a monastic institution
    const miId = Core.IDX.mi?.[String(src?.id)] ? String(src.id) :
                 Core.IDX.mi?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (miId && !institutions.find(inst => inst.institutionId === miId)) {
      const mi = Core.IDX.mi[miId];
      const institutionName = Core.MAP.mi?.title(mi);
      if (!isKnownCategory(institutionName)) continue;
      institutions.push({
        institutionId: miId,
        institutionName,
        institutionType: isKnownCategory(getVal(mi, 'Institution type')) ? getVal(mi, 'Institution type') : ''
      });
    }
  }
  
  return institutions;
}

/**
 * Get production unit(s) for a scribal unit
 * Returns: [puId, ...]
 */
function getPUsForSU(su) {
  const suId = String(su.rec_ID);
  if (PU_IDS_BY_SU_CACHE.has(suId)) return PU_IDS_BY_SU_CACHE.get(suId);

  const pus = new Set();
  
  // Check if this SU is itself a PU (many SUs are also PUs)
  if (Core.IDX.pu?.[suId]) {
    pus.add(suId);
  }
  
  // Check pointer fields
  (su.details || []).forEach(d => {
    const v = d?.value;
    if (v && typeof v === 'object' && v.id && v.type) {
      const toId = String(v.id);
      if (Core.IDX.pu?.[toId]) {
        pus.add(toId);
      }
    }
  });
  
  // Check relationships
  const rels = [
    ...((Core.REL_INDEX || {}).bySource?.[suId] || []),
    ...((Core.REL_INDEX || {}).byTarget?.[suId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const puId = Core.IDX.pu?.[String(src?.id)] ? String(src.id) :
                 Core.IDX.pu?.[String(tgt?.id)] ? String(tgt.id) : null;
    if (puId) pus.add(puId);
  }
  
  const puIds = Array.from(pus);
  PU_IDS_BY_SU_CACHE.set(suId, puIds);
  return puIds;
}

function getStructureIndex() {
  if (STRUCTURE_INDEX_CACHE) return STRUCTURE_INDEX_CACHE;

  const puIdsByMs = new Map();
  const suIdsByPu = new Map();

  (Core.DATA.pu || []).forEach(pu => {
    const msId = getMSForSU(pu);
    if (!msId) return;
    if (!puIdsByMs.has(msId)) puIdsByMs.set(msId, new Set());
    puIdsByMs.get(msId).add(String(pu.rec_ID));
  });

  (Core.DATA.su || []).forEach(su => {
    getPUsForSU(su).forEach(puId => {
      if (!suIdsByPu.has(puId)) suIdsByPu.set(puId, new Set());
      suIdsByPu.get(puId).add(String(su.rec_ID));
    });
  });

  STRUCTURE_INDEX_CACHE = { puIdsByMs, suIdsByPu };
  return STRUCTURE_INDEX_CACHE;
}

// ===== OVERVIEW TAB =====

function buildMultilingualismOverview(mount) {
  if (MULTILINGUALISM_OVERVIEW_HTML) {
    mount.innerHTML = MULTILINGUALISM_OVERVIEW_HTML;
    return;
  }

  // Aggregate data
  const stats = {
    totalLanguages: new Set(),
    multilingualMss: 0,
    multilingualScribes: 0,
    multilingualInstitutions: 0,
    colophonDivergences: 0,
    languageCounts: {},
    languageCooccurrence: {}
  };
  
  // Process all SUs
  const allSUs = Core.DATA.su || [];
  const allPUs = Core.DATA.pu || [];
  const allMSs = Core.DATA.ms || [];
  const { puIdsByMs, suIdsByPu } = getStructureIndex();
  
  const suByMs = {};
  const scribeLanguages = {};
  const institutionLanguages = {};
  
  // Process all SUs for language counts and scribe tracking
  allSUs.forEach(su => {
    const langInfo = getLanguageInfo(su, 'su');
    
    // Count languages
    langInfo.all.forEach(lang => {
      stats.totalLanguages.add(lang);
      stats.languageCounts[lang] = (stats.languageCounts[lang] || 0) + 1;
    });
    
    // Count colophon divergences
    if (langInfo.hasColophonDivergence) {
      stats.colophonDivergences++;
    }
    
    // Track scribe languages
    const scribes = getScribesForSU(su);
    scribes.forEach(scribe => {
      if (!scribeLanguages[scribe.scribeId]) {
        scribeLanguages[scribe.scribeId] = { name: scribe.scribeName, languages: new Set() };
      }
      langInfo.all.forEach(lang => scribeLanguages[scribe.scribeId].languages.add(lang));
    });
  });
  
  // Count multilingual manuscripts (using SAME logic as buildMultilingualManuscripts)
  // For each MS, collect all languages from its PUs and their SUs
  allMSs.forEach(ms => {
    const msId = String(ms.rec_ID);
    
    // Resolve manuscript structure through the precomputed indexes.
    const puIds = puIdsByMs.get(msId) || new Set();
    
    if (puIds.size === 0) return;
    
    // Collect all languages in this manuscript
    const allMsLanguages = new Set();
    
    puIds.forEach(puId => {
      const pu = Core.IDX.pu[puId];
      if (!pu) return;
      
      const puLangInfo = getLanguageInfo(pu, 'pu');
      puLangInfo.all.forEach(lang => allMsLanguages.add(lang));
      
      // Find all SUs in this PU without rescanning the entire corpus.
      (suIdsByPu.get(puId) || []).forEach(suId => {
        const su = Core.IDX.su?.[suId];
        if (!su) return;
        const suLangInfo = getLanguageInfo(su, 'su');
        suLangInfo.all.forEach(lang => allMsLanguages.add(lang));
      });
    });
    
    // Count as multilingual if 2+ languages
    if (allMsLanguages.size > 1) {
      stats.multilingualMss++;
    }
  });
  
  // Count multilingual scribes
  Object.values(scribeLanguages).forEach(scribe => {
    if (scribe.languages.size > 1) stats.multilingualScribes++;
  });
  
  // Process institutions comprehensively (PUs, SUs, scribes, manuscripts)
  // Build comprehensive institution language data matching buildInstitutionalMultilingualism
  const comprehensiveInstitutionData = {};
  
  // Process all PUs
  allPUs.forEach(pu => {
    const puId = String(pu.rec_ID);
    const langInfo = getLanguageInfo(pu, 'pu');
    const msId = getMSForSU(pu);
    const institutions = getInstitutionsForPU(pu);
    
    institutions.forEach(inst => {
      if (!comprehensiveInstitutionData[inst.institutionId]) {
        comprehensiveInstitutionData[inst.institutionId] = {
          id: inst.institutionId,
          name: inst.institutionName,
          languages: new Set(),
          manuscripts: new Set(),
          scribes: new Set()
        };
      }
      
      const instData = comprehensiveInstitutionData[inst.institutionId];
      if (msId) instData.manuscripts.add(msId);
      langInfo.all.forEach(lang => instData.languages.add(lang));
    });
  });
  
  // Process all SUs to add their languages and scribes
  allSUs.forEach(su => {
    const langInfo = getLanguageInfo(su, 'su');
    if (langInfo.all.length === 0) return;
    
    const msId = getMSForSU(su);
    const puIds = getPUsForSU(su);
    const scribes = getScribesForSU(su);
    
    // Get institutions from the PUs this SU belongs to
    const institutions = new Set();
    puIds.forEach(puId => {
      const pu = Core.IDX.pu[puId];
      if (pu) {
        const puInsts = getInstitutionsForPU(pu);
        puInsts.forEach(inst => institutions.add(JSON.stringify(inst)));
      }
    });
    
    institutions.forEach(instStr => {
      const inst = JSON.parse(instStr);
      if (!comprehensiveInstitutionData[inst.institutionId]) return;
      
      const instData = comprehensiveInstitutionData[inst.institutionId];
      if (msId) instData.manuscripts.add(msId);
      langInfo.all.forEach(lang => instData.languages.add(lang));
      scribes.forEach(scribe => instData.scribes.add(scribe.scribeId));
    });
  });
  
  // Count multilingual institutions (institutions with 2+ languages from ANY source)
  Object.values(comprehensiveInstitutionData).forEach(inst => {
    if (inst.languages.size > 1) stats.multilingualInstitutions++;
  });
  
  // Build co-occurrence matrix
  Object.values(suByMs).forEach(suLangs => {
    const msLangs = Array.from(new Set(suLangs.flatMap(l => l.all)));
    for (let i = 0; i < msLangs.length; i++) {
      for (let j = i + 1; j < msLangs.length; j++) {
        const pair = [msLangs[i], msLangs[j]].sort().join('|');
        stats.languageCooccurrence[pair] = (stats.languageCooccurrence[pair] || 0) + 1;
      }
    }
  });
  
  // Sort languages by frequency
  const sortedLanguages = Object.entries(stats.languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  // === PATTERN ANALYSIS ===
  // Analyze geographical, temporal, and institutional patterns of multilingualism
  const patternData = {
    byCountry: {},
    byPeriod: {},
    byReligiousOrder: {},
    byInstitution: {}
  };
  
  // Analyze multilingual manuscripts by patterns (allMSs, allPUs, allSUs already declared above)
  allMSs.forEach(ms => {
    const msId = String(ms.rec_ID);
    const msTitle = Core.MAP.ms?.title(ms) || 'Untitled';
    
    // Check if multilingual using the same indexed manuscript structure.
    const puIds = puIdsByMs.get(msId) || new Set();
    
    if (puIds.size === 0) return;
    
    // Collect all languages in this manuscript
    const msLanguages = new Set();
    puIds.forEach(puId => {
      const pu = Core.IDX.pu[puId];
      if (!pu) return;
      
      const puLangInfo = getLanguageInfo(pu, 'pu');
      puLangInfo.all.forEach(lang => msLanguages.add(lang));
      
      (suIdsByPu.get(puId) || []).forEach(suId => {
        const su = Core.IDX.su?.[suId];
        if (!su) return;
        const suLangInfo = getLanguageInfo(su, 'su');
        suLangInfo.all.forEach(lang => msLanguages.add(lang));
      });
    });
    
    if (msLanguages.size < 2) return; // Only multilingual manuscripts
    
    // Analyze each PU for patterns
    puIds.forEach(puId => {
      const pu = Core.IDX.pu[puId];
      if (!pu) return;
      
      // Geographical pattern (from PU)
      getControlledValsAll(pu, 'PU country').forEach(countryKey => {
        if (!patternData.byCountry[countryKey]) {
          patternData.byCountry[countryKey] = { count: 0, languages: new Set() };
        }
        patternData.byCountry[countryKey].count++;
        msLanguages.forEach(lang => patternData.byCountry[countryKey].languages.add(lang));
      });
      
      // Temporal pattern (from PU dating)
      getControlledValsAll(pu, 'Normalized century of production').forEach(century => {
        const periodKey = `${century}th century`;
        if (!patternData.byPeriod[periodKey]) {
          patternData.byPeriod[periodKey] = { count: 0, languages: new Set() };
        }
        patternData.byPeriod[periodKey].count++;
        msLanguages.forEach(lang => patternData.byPeriod[periodKey].languages.add(lang));
      });
      
      // Institutional pattern (from linked monastic institutions)
      const institutions = getInstitutionsForPU(pu);
      institutions.forEach(inst => {
        const miRecord = Core.IDX.mi?.[inst.institutionId];
        if (miRecord) {
          const religiousOrders = getControlledValsAll(miRecord, 'Religious order');
          religiousOrders.forEach(order => {
            if (!patternData.byReligiousOrder[order]) {
              patternData.byReligiousOrder[order] = { count: 0, languages: new Set(), institutions: new Set() };
            }
            patternData.byReligiousOrder[order].count++;
            patternData.byReligiousOrder[order].institutions.add(inst.institutionName);
            msLanguages.forEach(lang => patternData.byReligiousOrder[order].languages.add(lang));
          });
          
          // Individual institution tracking
          if (!patternData.byInstitution[inst.institutionName]) {
            patternData.byInstitution[inst.institutionName] = { 
              count: 0, 
              languages: new Set(), 
              order: religiousOrders.join(', '),
              location: `${Core.MAP.mi?.city(miRecord) || ''}, ${Core.MAP.mi?.country(miRecord) || ''}`.trim()
            };
          }
          patternData.byInstitution[inst.institutionName].count++;
          msLanguages.forEach(lang => patternData.byInstitution[inst.institutionName].languages.add(lang));
        }
      });
    });
  });
  
  // Sort pattern data
  const topCountries = Object.entries(patternData.byCountry)
    .map(([name, data]) => ({ name, count: data.count, langCount: data.languages.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const periodsSorted = Object.entries(patternData.byPeriod)
    .map(([name, data]) => ({ name, count: data.count, langCount: data.languages.size }))
    .sort((a, b) => {
      const aCentury = parseInt(a.name);
      const bCentury = parseInt(b.name);
      return aCentury - bCentury;
    });
  
  const topOrders = Object.entries(patternData.byReligiousOrder)
    .map(([name, data]) => ({ 
      name, 
      count: data.count, 
      langCount: data.languages.size,
      instCount: data.institutions.size
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  
  const topInstitutions = Object.entries(patternData.byInstitution)
    .map(([name, data]) => ({ 
      name, 
      count: data.count, 
      langCount: data.languages.size,
      order: data.order,
      location: data.location
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const knownLanguageTotal = Object.values(stats.languageCounts).reduce((sum, count) => sum + count, 0);
  const knownCountryTotal = Object.values(patternData.byCountry).reduce((sum, item) => sum + item.count, 0);
  const knownPeriodTotal = Object.values(patternData.byPeriod).reduce((sum, item) => sum + item.count, 0);
  const knownOrderTotal = Object.values(patternData.byReligiousOrder).reduce((sum, item) => sum + item.count, 0);
  
  // Render overview
  MULTILINGUALISM_OVERVIEW_HTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Multilingualism in the Corpus</h2>
      
      <!-- Key Statistics -->
      <div class="explore-metric-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div class="explore-metric-card">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.totalLanguages.size}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Languages/Dialects</div>
        </div>
        <div class="explore-metric-card">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualMss}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Manuscripts</div>
        </div>
        <div class="explore-metric-card">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualScribes}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Scribes</div>
        </div>
        <div class="explore-metric-card">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualInstitutions}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Institutions</div>
        </div>
        <div class="explore-metric-card">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.colophonDivergences}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Colophon-Text Divergences</div>
        </div>
      </div>
      
      <!-- Language Distribution Chart -->
      <div id="multilingual-languages-chart" class="explore-visualization-card" style="margin-bottom: 2rem;">
        <div class="explore-viz-card-header">
          <h3 style="margin: 0 0 0.25rem; color: #333;">Most Common Languages</h3>
          ${createExportButton('multilingual-languages-chart', 'multilingual-language-distribution.png')}
        </div>
        <p style="margin: 0 0 1rem; color: #666; font-size: 0.8rem;">Bar length shows the share of known language occurrences.</p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${sortedLanguages.map(([lang, count]) => {
            const percentage = knownLanguageTotal > 0 ? (count / knownLanguageTotal) * 100 : 0;
            return `
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                  <span style="font-weight: 600;">${lang}</span>
                  <span style="color: #666;">${count} occurrences · ${percentage.toFixed(1)}%</span>
                </div>
                <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                  <div style="background:#b88912;height:100%;width:${percentage}%;transition:width 0.3s;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- PATTERN ANALYSIS SECTION -->
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem; color: #1a1a1a; font-size: 1.5rem;">Multilingualism Patterns</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
          Recorded language combinations by place, period, and institution.
        </p>
        
        <!-- Geographical Patterns -->
        <div id="multilingual-geography-chart" class="explore-visualization-card" style="margin-bottom: 1.5rem;">
          <div class="explore-viz-card-header" style="margin-bottom:1rem;">
          <h3 style="margin:0; color: #333;">Geographical Distribution</h3>
          ${createExportButton('multilingual-geography-chart', 'multilingual-geography.png')}
          </div>
          ${topCountries.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${topCountries.map(item => {
                const percentage = knownCountryTotal > 0 ? (item.count / knownCountryTotal) * 100 : 0;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                      <span style="font-weight: 600;">${item.name}</span>
                      <span style="color: #666;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''} · ${percentage.toFixed(1)}% • ${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                      <div style="background:#3b82a0;height:100%;width:${percentage}%;transition:width 0.3s;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No geographical data available</p>'}
        </div>
        
        <!-- Temporal Patterns -->
        <div id="multilingual-temporal-chart" class="explore-visualization-card" style="margin-bottom: 1.5rem;">
          <div class="explore-viz-card-header" style="margin-bottom:1rem;">
          <h3 style="margin:0; color: #333;">Temporal Distribution</h3>
          ${createExportButton('multilingual-temporal-chart', 'multilingual-temporal-distribution.png')}
          </div>
          ${periodsSorted.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${periodsSorted.map(item => {
                const percentage = knownPeriodTotal > 0 ? (item.count / knownPeriodTotal) * 100 : 0;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                      <span style="font-weight: 600;">${item.name}</span>
                      <span style="color: #666;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''} · ${percentage.toFixed(1)}% • ${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                      <div style="background:#3f8067;height:100%;width:${percentage}%;transition:width 0.3s;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No temporal data available</p>'}
        </div>
        
        <!-- Religious Order Patterns -->
        <div id="multilingual-orders-chart" class="explore-visualization-card" style="margin-bottom: 1.5rem;">
          <div class="explore-viz-card-header" style="margin-bottom:1rem;">
          <h3 style="margin:0; color: #333; display: flex; align-items: center; gap: 0.5rem;">
            Religious Order Patterns
          </h3>
          ${createExportButton('multilingual-orders-chart', 'multilingual-religious-orders.png')}
          </div>
          ${topOrders.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${topOrders.map(item => {
                const percentage = knownOrderTotal > 0 ? (item.count / knownOrderTotal) * 100 : 0;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                      <span style="font-weight: 600;">${item.name}</span>
                      <span style="color: #666;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''} · ${percentage.toFixed(1)}% • ${item.instCount} institution${item.instCount !== 1 ? 's' : ''} • ${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                      <div style="background:#9b6b73;height:100%;width:${percentage}%;transition:width 0.3s;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No religious order data available</p>'}
        </div>
        
        <!-- Top Multilingual Institutions -->
        <div class="explore-panel-card" style="margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333;">Most Multilingual Institutions</h3>
          ${topInstitutions.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
              ${topInstitutions.map(item => `
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.375rem; border-left: 3px solid #9b59b6;">
                  <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; font-size: 0.9rem;">${item.name}</div>
                  <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">
                    <div>${item.order}</div>
                    ${item.location ? `<div>${item.location}</div>` : ''}
                  </div>
                  <div style="display: flex; gap: 1rem; font-size: 0.75rem;">
                    <span style="background: #d4af37; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''}</span>
                    <span style="background: #c4941f; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No institutional data available</p>'}
        </div>
        
      </div>
    </div>
  `;
  mount.innerHTML = MULTILINGUALISM_OVERVIEW_HTML;
}

// Helper function to get manuscript ID for a scribal unit
function getMSForSU(su) {
  const suId = String(su.rec_ID);
  if (MS_ID_BY_RECORD_CACHE.has(suId)) return MS_ID_BY_RECORD_CACHE.get(suId);
  
  // Check pointer fields first
  const details = su.details || [];
  for (const d of details) {
    const v = d?.value;
    if (v && typeof v === 'object' && v.id && v.type) {
      const toId = String(v.id);
      if (Core.IDX.ms?.[toId]) {
        MS_ID_BY_RECORD_CACHE.set(suId, toId);
        return toId;
      }
    }
  }
  
  // Check relationships
  const rels = [
    ...((Core.REL_INDEX || {}).bySource?.[suId] || []),
    ...((Core.REL_INDEX || {}).byTarget?.[suId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const msId = Core.IDX.ms?.[String(src?.id)] ? String(src.id) :
                 Core.IDX.ms?.[String(tgt?.id)] ? String(tgt.id) : null;
    if (msId) {
      MS_ID_BY_RECORD_CACHE.set(suId, msId);
      return msId;
    }
  }

  MS_ID_BY_RECORD_CACHE.set(suId, null);
  return null;
}

// ===== MULTILINGUAL MANUSCRIPTS TAB =====

function buildMultilingualManuscripts(mount) {
  // Strategy: For each manuscript, collect ALL languages from:
  // - All PUs in the manuscript (their colophons)
  // - All SUs in those PUs (their colophons)  
  // - All Texts linked to those SUs (their text languages)
  
  const allMSs = Core.DATA.ms || [];
  const msLanguageData = [];
  const { puIdsByMs, suIdsByPu } = getStructureIndex();
  
  allMSs.forEach(ms => {
    const msId = String(ms.rec_ID);
    const msTitle = Core.MAP.ms?.title(ms) || 'Untitled Manuscript';
    
    // Resolve all PUs in this manuscript from the shared structure index.
    const puIds = puIdsByMs.get(msId) || new Set();
    
    if (puIds.size === 0) return; // No PUs in this manuscript
    
    // Collect languages organized by PU
    const puData = {};
    const allMsLanguages = new Set();
    
    puIds.forEach(puId => {
      const pu = Core.IDX.pu[puId];
      if (!pu) return;
      
      const puTitle = Core.MAP.pu?.title(pu) || 'Untitled PU';
      const puLangInfo = getLanguageInfo(pu, 'pu');
      
      puData[puId] = {
        id: puId,
        title: puTitle,
        languages: new Set(puLangInfo.all),
        colophonLangs: puLangInfo.colophon,
        textLangs: puLangInfo.text,
        sus: []
      };
      
      // Add PU languages to manuscript total
      puLangInfo.all.forEach(lang => allMsLanguages.add(lang));
      
      // Find all SUs in this PU without scanning every SU.
      (suIdsByPu.get(puId) || []).forEach(suId => {
        const su = Core.IDX.su?.[suId];
        if (su) {
          const suTitle = Core.MAP.su?.title(su) || 'Untitled SU';
          const suLangInfo = getLanguageInfo(su, 'su');
          const scribes = getScribesForSU(su);
          
          // Track scribes and languages
          puData[puId].sus.push({
            id: suId,
            title: suTitle,
            languages: suLangInfo.all,
            colophonLangs: suLangInfo.colophon,
            textLangs: suLangInfo.text,
            scribes: scribes,
            hasColophonDivergence: suLangInfo.hasColophonDivergence
          });
          
          // Add SU languages to PU and manuscript totals
          suLangInfo.all.forEach(lang => {
            puData[puId].languages.add(lang);
            allMsLanguages.add(lang);
          });
        }
      });
    });
    
    // Only include manuscripts with 2+ languages
    if (allMsLanguages.size > 1) {
      // Determine if multilingualism is cross-PU or within-PU
      const multilingualPUs = Object.values(puData).filter(pu => pu.languages.size > 1);
      const multilingualismType = multilingualPUs.length > 0 ? 'within-pu' : 'cross-pu';
      
      msLanguageData.push({
        id: msId,
        title: msTitle,
        languages: Array.from(allMsLanguages),
        languageCount: allMsLanguages.size,
        puCount: puIds.size,
        pus: puData,
        multilingualismType: multilingualismType,
        multilingualPUCount: multilingualPUs.length
      });
    }
  });
  
  // Sort by language count (most multilingual first)
  msLanguageData.sort((a, b) => b.languageCount - a.languageCount);
  
  if (msLanguageData.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <h3 style="color: #333; margin-bottom: 1rem;">No Multilingual Manuscripts Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No manuscripts with texts in multiple languages were found. This requires manuscripts to have 
          production units with language data recorded for colophons and/or linked texts.
        </p>
      </div>
    `;
    return;
  }
  
  const manuscriptPage = getPaginatedItems(msLanguageData, 'manuscripts');

  // Build only the cards needed for the current page.
  const msCards = manuscriptPage.items.map((ms, idx) => {
    const langBadges = ms.languages.map(lang =>
      `<span style="display:inline-block;padding:0.25rem 0.55rem;background:#f2efe7;color:#574a2a;border:1px solid #d8d2c5;border-radius:0.2rem;font-size:0.75rem;margin-right:0.5rem;margin-bottom:0.5rem;font-weight:600;">${lang}</span>`
    ).join('');
    
    // Multilingualism type badge
    const typeBadge = ms.multilingualismType === 'within-pu'
      ? `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: #4caf50; color: white; border-radius: 0.75rem; font-size: 0.7rem; font-weight: 600;">Within-PU multilingualism (${ms.multilingualPUCount} PU${ms.multilingualPUCount > 1 ? 's' : ''})</span>`
      : `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: #ff9800; color: white; border-radius: 0.75rem; font-size: 0.7rem; font-weight: 600;">Cross-PU compilation</span>`;
    
    // Build PU breakdown
    const puBreakdown = Object.values(ms.pus).map(pu => {
      // Create detailed language badges for PU showing source
      let puLangBadges = '';
      if (pu.colophonLangs && pu.colophonLangs.length > 0) {
        puLangBadges += pu.colophonLangs.map(lang =>
          `<span style="padding: 0.2rem 0.5rem; background: #2196f3; color: white; border-radius: 0.5rem; font-size: 0.7rem; margin-right: 0.25rem;" title="From PU colophon">${lang}</span>`
        ).join('');
      }
      if (pu.textLangs && pu.textLangs.length > 0) {
        puLangBadges += pu.textLangs.map(lang =>
          `<span style="padding: 0.2rem 0.5rem; background: #4a90e2; color: white; border-radius: 0.5rem; font-size: 0.7rem; margin-right: 0.25rem;" title="From linked text at PU level">${lang}</span>`
        ).join('');
      }
      
      const suList = pu.sus.map(su => {
        // Create detailed language badges for SU showing source
        let suLangBadges = '';
        if (su.colophonLangs && su.colophonLangs.length > 0) {
          suLangBadges += su.colophonLangs.map(lang =>
            `<span style="padding: 0.15rem 0.4rem; background: #ff9800; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-right: 0.25rem;" title="From SU colophon">${lang}</span>`
          ).join('');
        }
        if (su.textLangs && su.textLangs.length > 0 && JSON.stringify(su.textLangs) !== JSON.stringify(su.colophonLangs)) {
          suLangBadges += su.textLangs.map(lang =>
            `<span style="padding: 0.15rem 0.4rem; background: #ffa726; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-right: 0.25rem;" title="From linked text at SU level">${lang}</span>`
          ).join('');
        }
        
        const scribeInfo = su.scribes.length > 0
          ? su.scribes.map(s => `<span style="color: #666; font-size: 0.7rem;">${s.scribeName}</span>`).join(', ')
          : '';
        
        const divergenceBadge = su.hasColophonDivergence
          ? `<span style="padding: 0.15rem 0.4rem; background: #f44336; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-left: 0.25rem;">Colophon≠Text</span>`
          : '';
        
        return `
          <div style="font-size: 0.75rem; padding: 0.5rem; margin: 0.25rem 0; background: #fafafa; border-left: 3px solid #ff9800; border-radius: 0.25rem;">
            <div style="font-weight: 600; color: #333; margin-bottom: 0.25rem;">
              ${su.title} ${divergenceBadge}
            </div>
            <div style="margin-bottom: 0.25rem;">${suLangBadges}</div>
            ${scribeInfo ? `<div style="margin-top: 0.25rem;">${scribeInfo}</div>` : ''}
          </div>
        `;
      }).join('');
      
      return `
        <div style="margin-bottom: 1rem; padding: 0.75rem; background: #f0f4ff; border-left: 4px solid #2196f3; border-radius: 0.375rem;">
          <div style="font-weight: 600; color: #1565c0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span>${pu.title}</span>
            ${puLangBadges}
            <span style="font-size: 0.7rem; color: #666; font-weight: 400;">(${pu.sus.length} SU${pu.sus.length !== 1 ? 's' : ''})</span>
          </div>
          ${suList}
        </div>
      `;
    }).join('');
    
    return `
      <div class="ms-card explore-panel-card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 300px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">MS #${manuscriptPage.start + idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${ms.title}</h3>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              ${langBadges}
            </div>
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <span style="font-size: 0.8rem; color: #666;"><strong>${ms.languageCount}</strong> language${ms.languageCount !== 1 ? 's' : ''}</span>
              <span style="font-size: 0.8rem; color: #666;"><strong>${ms.puCount}</strong> PU${ms.puCount !== 1 ? 's' : ''}</span>
              ${typeBadge}
            </div>
          </div>
          <div>
            <button class="explore-action-btn explore-action-btn--primary explore-action-btn--compact" onclick="window.jumpTo('ms', '${ms.id}')">
              View Details
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">Production Units & Scribal Units:</div>
          ${puBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Multilingual Manuscripts</h2>
        <div class="explore-summary-grid">
        </div>
      </div>
      
      <div class="editorial-note">
        <strong>How to Read the Cards:</strong><br>
        <div style="margin-top: 0.5rem;">
          • <strong>Gold badges at top</strong> = All languages found in this manuscript<br>
          • <strong>Green badge</strong> = Within-PU multilingualism (multiple languages in same production unit)<br>
          • <strong>Orange badge</strong> = Cross-PU compilation (different languages in different production units)<br>
          • <strong>Blue badges in breakdown</strong> = Languages from Production Unit colophons/texts<br>
          • <strong>Orange badges in breakdown</strong> = Languages from Scribal Unit colophons/texts<br>
          • <strong>Red "Colophon≠Text" badge</strong> = Colophon language differs from text language
        </div>
      </div>
      
      ${msLanguageData.length > MULTILINGUALISM_PAGE_SIZE ? buildResultPagination('manuscripts', msLanguageData.length, manuscriptPage.page, manuscriptPage.totalPages) : ''}

      ${msCards}
      
      ${buildResultPagination('manuscripts', msLanguageData.length, manuscriptPage.page, manuscriptPage.totalPages)}
    </div>
  `;
  bindResultPagination(mount, 'manuscripts', () => buildMultilingualManuscripts(mount));
}

function buildScribalMultilingualism(mount) {
  // Collect scribe language data
  const allSUs = Core.DATA.su || [];
  const scribeData = {};
  
  allSUs.forEach(su => {
    const langInfo = getLanguageInfo(su, 'su');
    if (langInfo.all.length === 0) return;
    
    const scribes = getScribesForSU(su);
    const ms = getMSForSU(su);
    
    scribes.forEach(scribe => {
      if (!scribeData[scribe.scribeId]) {
        scribeData[scribe.scribeId] = {
          id: scribe.scribeId,
          name: scribe.scribeName,
          languages: new Set(),
          manuscripts: new Set(),
          sus: [],
          languageDetails: {} // language -> list of SUs
        };
      }
      
      // Add languages
      langInfo.all.forEach(lang => {
        scribeData[scribe.scribeId].languages.add(lang);
        
        if (!scribeData[scribe.scribeId].languageDetails[lang]) {
          scribeData[scribe.scribeId].languageDetails[lang] = [];
        }
        
        scribeData[scribe.scribeId].languageDetails[lang].push({
          suId: String(su.rec_ID),
          suTitle: Core.MAP.su?.title(su) || 'Untitled SU',
          msId: ms,
          msTitle: ms && Core.IDX.ms?.[ms] ? (Core.MAP.ms?.title(Core.IDX.ms[ms]) || 'Untitled MS') : '',
          role: scribe.role,
          certainty: scribe.certainty
        });
      });
      
      if (ms) scribeData[scribe.scribeId].manuscripts.add(ms);
      
      scribeData[scribe.scribeId].sus.push({
        id: String(su.rec_ID),
        title: Core.MAP.su?.title(su) || 'Untitled SU',
        languages: langInfo.all,
        ms: ms,
        role: scribe.role
      });
    });
  });
  
  // Filter to multilingual scribes
  const multilingualScribes = Object.values(scribeData)
    .filter(scribe => scribe.languages.size > 1)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  // All scribes (for optional viewing)
  const allScribes = Object.values(scribeData)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  if (allScribes.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <h3 style="color: #333; margin-bottom: 1rem;">No Scribe Language Data Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No scribes with language information were found in the dataset. 
          Make sure scribal units are linked to historical people (scribes) and have language data recorded.
        </p>
      </div>
    `;
    return;
  }
  
  const scribePage = getPaginatedItems(multilingualScribes, 'scribes');

  // Build only the cards needed for the current page.
  const scribeCards = scribePage.items.map((scribe, idx) => {
    const langArray = Array.from(scribe.languages).sort();
    const msCount = scribe.manuscripts.size;
    const suCount = scribe.sus.length;
    
    // Language badges
    const langBadges = langArray.map(lang =>
      `<span style="display:inline-block;padding:0.25rem 0.55rem;background:#eef3f5;color:#365663;border:1px solid #cbd9df;border-radius:0.2rem;font-size:0.75rem;margin-right:0.5rem;margin-bottom:0.5rem;font-weight:600;">${lang}</span>`
    ).join('');
    
    // Language breakdown
    const langBreakdown = Object.entries(scribe.languageDetails).map(([lang, sus]) => {
      const suList = sus.slice(0, 5).map(su => // Show first 5
        `<div style="font-size: 0.75rem; color: #666; padding: 0.25rem 0; border-bottom: 1px solid #f0f0f0;">
          <span style="font-weight: 600;">${su.suTitle}</span> 
          <span style="color: #999;">in</span> 
          <span style="color: #d4af37;">${su.msTitle}</span>
          ${su.role !== 'scribe' ? `<span style="color: #999; font-style: italic;"> (${su.role})</span>` : ''}
        </div>`
      ).join('');
      
      const moreCount = sus.length - 5;
      const moreText = moreCount > 0 ? `<div style="font-size: 0.7rem; color: #999; padding: 0.5rem 0; font-style: italic;">...and ${moreCount} more</div>` : '';
      
      return `
        <div style="margin-bottom: 1rem;">
          <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span style="padding: 0.2rem 0.6rem; background: #e3f2fd; color: #1976d2; border-radius: 0.75rem; font-size: 0.8rem;">${lang}</span>
            <span style="font-size: 0.8rem; color: #666;">${sus.length} scribal unit${sus.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="margin-left: 1rem; max-height: 200px; overflow-y: auto;">
            ${suList}
            ${moreText}
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="scribe-card explore-panel-card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">Scribe #${scribePage.start + idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${scribe.name}</h3>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              ${langBadges}
            </div>
            <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: #666;">
              <span><strong>${langArray.length}</strong> language${langArray.length !== 1 ? 's' : ''}</span>
              <span><strong>${msCount}</strong> manuscript${msCount !== 1 ? 's' : ''}</span>
              <span><strong>${suCount}</strong> scribal unit${suCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div>
            <button class="explore-action-btn explore-action-btn--primary explore-action-btn--compact" onclick="window.jumpTo('hp', '${scribe.id}')">
              View Scribe
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">Work by Language:</div>
          ${langBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Scribal Multilingualism</h2>
        <div class="explore-summary-grid">
          <div class="explore-summary-card">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${multilingualScribes.length}</span>
            <span style="opacity: 0.9;">multilingual scribe${multilingualScribes.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="explore-summary-card">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${allScribes.length}</span>
            <span style="opacity: 0.9;">total scribe${allScribes.length !== 1 ? 's' : ''} with language data</span>
          </div>
        </div>
      </div>
      
      ${multilingualScribes.length === 0 ? `
        <div class="editorial-note">
          <div style="font-weight: 600; margin-bottom: 0.5rem; color: #856404;">No Multilingual Scribes Found</div>
          <p style="color: #856404; margin: 0; line-height: 1.6;">
            No records meet the current definition. Missing language data may affect this result.
          </p>
        </div>
      ` : ''}
      
      ${multilingualScribes.length > MULTILINGUALISM_PAGE_SIZE ? buildResultPagination('scribes', multilingualScribes.length, scribePage.page, scribePage.totalPages) : ''}

      ${scribeCards}
      
      ${multilingualScribes.length > 0 ? buildResultPagination('scribes', multilingualScribes.length, scribePage.page, scribePage.totalPages) : ''}
    </div>
  `;
  bindResultPagination(mount, 'scribes', () => buildScribalMultilingualism(mount));
}

function buildInstitutionalMultilingualism(mount) {
  // Collect institution language data from ALL sources:
  // 1. PU colophon languages
  // 2. SU colophon languages  
  // 3. Text languages from relationships
  // 4. Manuscripts produced at the institution (even if monolingual individually)
  // 5. Scribes working at the institution
  
  const allPUs = Core.DATA.pu || [];
  const allSUs = Core.DATA.su || [];
  const institutionData = {};
  
  // Process all PUs
  allPUs.forEach(pu => {
    const puId = String(pu.rec_ID);
    const langInfo = getLanguageInfo(pu, 'pu');
    const msId = getMSForSU(pu); // PUs are also SUs
    
    const institutions = getInstitutionsForPU(pu);
    
    institutions.forEach(inst => {
      if (!institutionData[inst.institutionId]) {
        institutionData[inst.institutionId] = {
          id: inst.institutionId,
          name: inst.institutionName,
          languages: new Set(),
          manuscripts: new Set(),
          scribes: new Set(),
          pus: [],
          languageDetails: {}, // language -> list of sources (PU/SU/scribe)
          scribeLanguages: {}, // scribeId -> Set of languages
          msLanguages: {} // msId -> Set of languages
        };
      }
      
      const instData = institutionData[inst.institutionId];
      
      // Track manuscript
      if (msId) {
        instData.manuscripts.add(msId);
        if (!instData.msLanguages[msId]) {
          instData.msLanguages[msId] = new Set();
        }
      }
      
      // Add PU languages
      langInfo.all.forEach(lang => {
        instData.languages.add(lang);
        if (msId) instData.msLanguages[msId].add(lang);
        
        if (!instData.languageDetails[lang]) {
          instData.languageDetails[lang] = [];
        }
        
        instData.languageDetails[lang].push({
          type: 'pu',
          id: puId,
          title: Core.MAP.pu?.title(pu) || 'Untitled PU',
          msId: msId,
          msTitle: msId && Core.IDX.ms?.[msId] ? (Core.MAP.ms?.title(Core.IDX.ms[msId]) || 'Untitled MS') : '',
          sources: []
        });
      });
      
      instData.pus.push({
        id: puId,
        title: Core.MAP.pu?.title(pu) || 'Untitled PU',
        languages: Array.from(langInfo.all),
        ms: msId
      });
    });
  });
  
  // Process all SUs
  allSUs.forEach(su => {
    const suId = String(su.rec_ID);
    const langInfo = getLanguageInfo(su, 'su');
    if (langInfo.all.length === 0) return;
    
    const msId = getMSForSU(su);
    const puIds = getPUsForSU(su);
    const scribes = getScribesForSU(su);
    
    // Get institutions from the PUs this SU belongs to
    const institutions = new Set();
    puIds.forEach(puId => {
      const pu = Core.IDX.pu[puId];
      if (pu) {
        const puInsts = getInstitutionsForPU(pu);
        puInsts.forEach(inst => institutions.add(JSON.stringify(inst)));
      }
    });
    
    institutions.forEach(instStr => {
      const inst = JSON.parse(instStr);
      if (!institutionData[inst.institutionId]) return; // Should already exist from PU processing
      
      const instData = institutionData[inst.institutionId];
      
      // Track manuscript
      if (msId) {
        instData.manuscripts.add(msId);
        if (!instData.msLanguages[msId]) {
          instData.msLanguages[msId] = new Set();
        }
      }
      
      // Add SU languages
      langInfo.all.forEach(lang => {
        instData.languages.add(lang);
        if (msId) instData.msLanguages[msId].add(lang);
        
        if (!instData.languageDetails[lang]) {
          instData.languageDetails[lang] = [];
        }
        
        // Check if we already have this info from PU
        const existingEntry = instData.languageDetails[lang].find(entry => 
          entry.msId === msId && entry.type === 'pu'
        );
        
        if (!existingEntry) {
          instData.languageDetails[lang].push({
            type: 'su',
            id: suId,
            title: Core.MAP.su?.title(su) || 'Untitled SU',
            msId: msId,
            msTitle: msId && Core.IDX.ms?.[msId] ? (Core.MAP.ms?.title(Core.IDX.ms[msId]) || 'Untitled MS') : '',
            sources: []
          });
        }
      });
      
      // Track scribes and their languages
      scribes.forEach(scribe => {
        instData.scribes.add(scribe.scribeId);
        
        if (!instData.scribeLanguages[scribe.scribeId]) {
          instData.scribeLanguages[scribe.scribeId] = {
            name: scribe.scribeName,
            languages: new Set()
          };
        }
        
        langInfo.all.forEach(lang => {
          instData.scribeLanguages[scribe.scribeId].languages.add(lang);
        });
      });
    });
  });
  
  // Filter to multilingual institutions (institutions with 2+ languages across ALL sources)
  const multilingualInstitutions = Object.values(institutionData)
    .filter(inst => inst.languages.size > 1)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  // All institutions (for optional viewing)
  const allInstitutions = Object.values(institutionData)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  if (allInstitutions.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <h3 style="color: #333; margin-bottom: 1rem;">No Institutional Language Data Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No monastic institutions with language information were found in the dataset. 
          Make sure production units are linked to monastic institutions and have language data recorded.
        </p>
      </div>
    `;
    return;
  }
  
  const institutionPage = getPaginatedItems(multilingualInstitutions, 'institutions');

  // Build only the cards needed for the current page.
  const instCards = institutionPage.items.map((inst, idx) => {
    const langArray = Array.from(inst.languages).sort();
    const msCount = inst.manuscripts.size;
    const puCount = inst.pus.length;
    const scribeCount = inst.scribes.size;
    
    // Count multilingual scribes
    const multilingualScribes = Object.values(inst.scribeLanguages)
      .filter(scribe => scribe.languages.size > 1);
    
    // Count multilingual manuscripts (manuscripts with 2+ languages)
    const multilingualMss = Object.entries(inst.msLanguages)
      .filter(([msId, langs]) => langs.size > 1);
    
    // Determine type of multilingualism
    const types = [];
    if (multilingualMss.length > 0) types.push(`${multilingualMss.length} multilingual manuscript${multilingualMss.length !== 1 ? 's' : ''}`);
    if (multilingualScribes.length > 0) types.push(`${multilingualScribes.length} multilingual scribe${multilingualScribes.length !== 1 ? 's' : ''}`);
    if (msCount > 1 && langArray.length > 1) types.push('institutional specialization');
    
    // Language badges
    const langBadges = langArray.map(lang =>
      `<span style="display:inline-block;padding:0.25rem 0.55rem;background:#f2efe7;color:#574a2a;border:1px solid #d8d2c5;border-radius:0.2rem;font-size:0.75rem;margin-right:0.5rem;margin-bottom:0.5rem;font-weight:600;">${lang}</span>`
    ).join('');
    
    // Language breakdown
    const langBreakdown = Object.entries(inst.languageDetails).map(([lang, sources]) => {
      const sourceList = sources.slice(0, 5).map(src => // Show first 5
        `<div style="font-size: 0.75rem; color: #666; padding: 0.25rem 0; border-bottom: 1px solid #f0f0f0;">
          <span style="font-weight: 600;">${src.title}</span> 
          <span style="color: #999;">in</span> 
          <span style="color: #d4af37;">${src.msTitle}</span>
        </div>`
      ).join('');
      
      const moreCount = sources.length - 5;
      const moreText = moreCount > 0 ? `<div style="font-size: 0.7rem; color: #999; padding: 0.5rem 0; font-style: italic;">...and ${moreCount} more</div>` : '';
      
      return `
        <div style="margin-bottom: 1rem;">
          <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span style="padding: 0.2rem 0.6rem; background: #fce4ec; color: #c2185b; border-radius: 0.75rem; font-size: 0.8rem;">${lang}</span>
            <span style="font-size: 0.8rem; color: #666;">${sources.length} source${sources.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="margin-left: 1rem; max-height: 200px; overflow-y: auto;">
            ${sourceList}
            ${moreText}
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="institution-card explore-panel-card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">Institution #${institutionPage.start + idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${inst.name}</h3>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              ${langBadges}
            </div>
            <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: #666; margin-bottom: 0.5rem;">
              <span><strong>${langArray.length}</strong> language${langArray.length !== 1 ? 's' : ''}</span>
              <span><strong>${msCount}</strong> manuscript${msCount !== 1 ? 's' : ''}</span>
              <span><strong>${scribeCount}</strong> scribe${scribeCount !== 1 ? 's' : ''}</span>
            </div>
            <div style="font-size: 0.75rem; color: #888; font-style: italic;">
              ${types.join(' • ')}
            </div>
          </div>
          <div>
            <button class="explore-action-btn explore-action-btn--primary explore-action-btn--compact" onclick="window.jumpTo('mi', '${inst.id}')">
              View Institution
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">Productions by Language:</div>
          ${langBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Institutional Multilingualism</h2>
        <div class="explore-summary-grid">
          <div class="explore-summary-card">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${multilingualInstitutions.length}</span>
            <span style="opacity: 0.9;">multilingual institution${multilingualInstitutions.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="explore-summary-card">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${allInstitutions.length}</span>
            <span style="opacity: 0.9;">total institution${allInstitutions.length !== 1 ? 's' : ''} with language data</span>
          </div>
        </div>
      </div>
      
      ${multilingualInstitutions.length === 0 ? `
        <div class="editorial-note">
          <div style="font-weight: 600; margin-bottom: 0.5rem; color: #856404;">No Multilingual Institutions Found</div>
          <p style="color: #856404; margin: 0; line-height: 1.6;">
            No records meet the current definition. Missing language data may affect this result.
          </p>
        </div>
      ` : ''}
      
      ${multilingualInstitutions.length > MULTILINGUALISM_PAGE_SIZE ? buildResultPagination('institutions', multilingualInstitutions.length, institutionPage.page, institutionPage.totalPages) : ''}

      ${instCards}
      
      ${multilingualInstitutions.length > 0 ? buildResultPagination('institutions', multilingualInstitutions.length, institutionPage.page, institutionPage.totalPages) : ''}
    </div>
  `;
  bindResultPagination(mount, 'institutions', () => buildInstitutionalMultilingualism(mount));
}

function buildColophonTextDivergence(mount) {
  // Find SUs where colophon language differs from text language(s)
  const allSUs = Core.DATA.su || [];
  const divergences = [];
  
  allSUs.forEach(su => {
    const langInfo = getLanguageInfo(su, 'su');
    
    // Check if we have both colophon and text language
    if (langInfo.colophon.length > 0 && langInfo.text.length > 0) {
      // Check if colophon language is different from any text language
      const colophonSet = new Set(langInfo.colophon);
      const textSet = new Set(langInfo.text);
      
      // Divergence exists if colophon language is not in text languages
      const isDivergent = !langInfo.colophon.some(cl => textSet.has(cl));
      
      if (isDivergent) {
        const ms = getMSForSU(su);
        const scribes = getScribesForSU(su);
        const pus = getPUsForSU(su);
        
        divergences.push({
          suId: String(su.rec_ID),
          suTitle: Core.MAP.su?.title(su) || 'Untitled SU',
          msId: ms,
          msTitle: ms && Core.IDX.ms?.[ms] ? (Core.MAP.ms?.title(Core.IDX.ms[ms]) || 'Untitled MS') : '',
          colophonLangs: langInfo.colophon,
          textLangs: langInfo.text,
          scribes: scribes,
          puCount: pus.length,
          record: su
        });
      }
    }
  });
  
  if (divergences.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <h3 style="color: #333; margin-bottom: 1rem;">No Colophon-Text Divergences Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No scribal units were found where the colophon language differs from the text language(s). 
          This requires both colophon language and text language fields to be populated.
        </p>
      </div>
    `;
    return;
  }
  
  // Sort by manuscript
  divergences.sort((a, b) => {
    if (a.msTitle < b.msTitle) return -1;
    if (a.msTitle > b.msTitle) return 1;
    return 0;
  });
  
  const divergencePage = getPaginatedItems(divergences, 'colophons');

  // Build only the cards needed for the current page.
  const divergenceCards = divergencePage.items.map((div, idx) => {
    const colophonBadges = div.colophonLangs.map(lang =>
      `<span style="display:inline-block;padding:0.25rem 0.55rem;background:#f5eeee;color:#68454b;border:1px solid #dfcccc;border-radius:0.2rem;font-size:0.75rem;margin-right:0.5rem;margin-bottom:0.5rem;font-weight:600;">${lang}</span>`
    ).join('');
    
    const textBadges = div.textLangs.map(lang =>
      `<span style="display:inline-block;padding:0.25rem 0.55rem;background:#eef3f5;color:#365663;border:1px solid #cbd9df;border-radius:0.2rem;font-size:0.75rem;margin-right:0.5rem;margin-bottom:0.5rem;font-weight:600;">${lang}</span>`
    ).join('');
    
    const scribeInfo = div.scribes.length > 0
      ? div.scribes.map(s =>
          `<span style="font-size: 0.8rem; color: #666; margin-right: 1rem;">
            <span style="font-weight: 600; color: #333;">${s.scribeName}</span>
            ${s.role !== 'scribe' ? `<span style="color: #999; font-style: italic;"> (${s.role})</span>` : ''}
          </span>`
        ).join('')
      : '<span style="font-size: 0.8rem; color: #999;">No scribe attribution</span>';
    
    return `
      <div class="divergence-card explore-panel-card" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">Divergence #${divergencePage.start + idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${div.suTitle}</h3>
            </div>
            <div style="font-size: 0.85rem; color: #d4af37; margin-bottom: 0.75rem;">
              ${div.msTitle}
            </div>
          </div>
          <div>
            <button class="explore-action-btn explore-action-btn--primary explore-action-btn--compact" onclick="window.jumpTo('su', '${div.suId}')">
              View SU
            </button>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; padding: 1rem; background: #fafafa; border-radius: 0.375rem; margin-bottom: 1rem;">
          <div>
            <div style="font-weight: 600; font-size: 0.85rem; color: #555; margin-bottom: 0.5rem;">Colophon Language:</div>
            <div>${colophonBadges}</div>
          </div>
          <div style="font-size: 1.5rem; color: #ccc;">→</div>
          <div>
            <div style="font-weight: 600; font-size: 0.85rem; color: #555; margin-bottom: 0.5rem;">Text Language(s):</div>
            <div>${textBadges}</div>
          </div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #f0f0f0;">
          ${scribeInfo}
        </div>
      </div>
    `;
  }).join('');
  
  // Calculate patterns
  const patterns = {};
  divergences.forEach(div => {
    const key = `${div.colophonLangs.sort().join(', ')} → ${div.textLangs.sort().join(', ')}`;
    if (!patterns[key]) patterns[key] = 0;
    patterns[key]++;
  });
  
  const topPatterns = Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern, count]) => 
      `<div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">
        <span style="color: #333;">${pattern}</span>
        <span style="font-weight: 600; color: #fa709a;">${count}×</span>
      </div>`
    ).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Colophon-Text Language Divergence</h2>
        <div class="explore-summary-grid">
          <div class="explore-summary-card">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${divergences.length}</span>
            <span style="opacity: 0.9;">divergent case${divergences.length !== 1 ? 's' : ''}</span>
          </div>
          <div class="explore-summary-card">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${Object.keys(patterns).length}</span>
            <span style="opacity: 0.9;">unique pattern${Object.keys(patterns).length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        ${topPatterns ? `
          <div id="multilingual-divergence-patterns" class="explore-visualization-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 2rem;">
            <div class="explore-viz-card-header" style="margin-bottom:1rem;">
              <h3 style="margin:0; font-size: 1rem; color: #333;">Most Common Divergence Patterns</h3>
              ${createExportButton('multilingual-divergence-patterns', 'colophon-text-divergence-patterns.png')}
            </div>
            ${topPatterns}
          </div>
        ` : ''}
      </div>
      
      ${divergences.length > MULTILINGUALISM_PAGE_SIZE ? buildResultPagination('colophons', divergences.length, divergencePage.page, divergencePage.totalPages) : ''}

      ${divergenceCards}
      
      ${buildResultPagination('colophons', divergences.length, divergencePage.page, divergencePage.totalPages)}
    </div>
  `;
  bindResultPagination(mount, 'colophons', () => buildColophonTextDivergence(mount));
}

      return { buildMultilingualism };
    }
  };
})();
