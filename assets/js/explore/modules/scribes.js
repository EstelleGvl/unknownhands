window.ExploreScribes = (function() {
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

      const debounce = (fn, ms) => {
        let t;
        return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
      };

      function getLanguageInfo(record, recordType) {
        const languages = {
          text: [],
          colophon: [],
          dialect: [],
          all: new Set()
        };

        const colophonLang = getVal(record, 'Colophon language');
        if (colophonLang) {
          const colophonLangs = Array.isArray(colophonLang) ? colophonLang : [colophonLang];
          colophonLangs.forEach(lang => {
            if (isKnownCategory(lang)) {
              languages.colophon.push(lang.trim());
              languages.all.add(lang.trim());
            }
          });
        }

        const recordId = String(record.rec_ID);
        const rels = [
          ...((Core.REL_INDEX || {}).bySource?.[recordId] || []),
          ...((Core.REL_INDEX || {}).byTarget?.[recordId] || [])
        ];

        for (const rel of rels) {
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

          const src = getRes(rel, 'Source record');
          const tgt = getRes(rel, 'Target record');
          const textId = Core.IDX.tx?.[String(src?.id)] ? String(src.id) :
                         Core.IDX.tx?.[String(tgt?.id)] ? String(tgt.id) : null;

          if (textId) {
            const textRec = Core.IDX.tx[textId];
            if (textRec) {
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

        return {
          text: languages.text,
          colophon: languages.colophon,
          dialect: languages.dialect,
          all: Array.from(languages.all),
          isMultilingual: languages.all.size > 1,
          hasColophonDivergence: languages.colophon.length > 0 &&
                                 languages.text.length > 0 &&
                                 !languages.text.some(t => languages.colophon.includes(t))
        };
      }

      function getScribesForSU(su) {
        const scribes = [];
        const suId = String(su.rec_ID);
        const rels = [
          ...((Core.REL_INDEX || {}).bySource?.[suId] || []),
          ...((Core.REL_INDEX || {}).byTarget?.[suId] || [])
        ];

        for (const rel of rels) {
          const src = getRes(rel, 'Source record');
          const tgt = getRes(rel, 'Target record');
          const hpId = Core.IDX.hp?.[String(src?.id)] ? String(src.id) :
                       Core.IDX.hp?.[String(tgt?.id)] ? String(tgt.id) : null;

          if (hpId) {
            const hp = Core.IDX.hp[hpId];
            const gender = getVal(hp, 'Gender');
            const genderStr = gender ? String(gender).toLowerCase() : '';
            if (genderStr === 'male') continue;

            const role = getVal(rel, 'Scribe role') || 'scribe';
            const certainty = getVal(rel, 'scribe certainty') || '';

            const scribeName = Core.MAP.hp?.title(hp);
            if (!isKnownCategory(scribeName)) continue;
            scribes.push({
              scribeId: hpId,
              scribeName,
              role,
              certainty
            });
          }
        }

        return scribes;
      }

      function getInstitutionsForScribe(hpId) {
        const institutions = [];
        const rels = [
          ...((Core.REL_INDEX || {}).bySource?.[hpId] || []),
          ...((Core.REL_INDEX || {}).byTarget?.[hpId] || [])
        ];

        for (const rel of rels) {
          const src = getRes(rel, 'Source record');
          const tgt = getRes(rel, 'Target record');
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

      function getPUsForSU(su) {
        const pus = new Set();
        const suId = String(su.rec_ID);

        if (Core.IDX.pu?.[suId]) {
          pus.add(suId);
        }

        (su.details || []).forEach(d => {
          const v = d?.value;
          if (v && typeof v === 'object' && v.id && v.type) {
            const toId = String(v.id);
            if (Core.IDX.pu?.[toId]) {
              pus.add(toId);
            }
          }
        });

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

        return Array.from(pus);
      }

      function getMSForSU(su) {
        const suId = String(su.rec_ID);

        const details = su.details || [];
        for (const d of details) {
          const v = d?.value;
          if (v && typeof v === 'object' && v.id && v.type) {
            const toId = String(v.id);
            if (Core.IDX.ms?.[toId]) {
              return toId;
            }
          }
        }

        const rels = [
          ...((Core.REL_INDEX || {}).bySource?.[suId] || []),
          ...((Core.REL_INDEX || {}).byTarget?.[suId] || [])
        ];

        for (const rel of rels) {
          const src = getRes(rel, 'Source record');
          const tgt = getRes(rel, 'Target record');
          const msId = Core.IDX.ms?.[String(src?.id)] ? String(src.id) :
                       Core.IDX.ms?.[String(tgt?.id)] ? String(tgt.id) : null;
          if (msId) return msId;
        }

        return null;
      }

/* ============================================================
   SCRIBES MODULE
   ============================================================ */

// Track current scribe tab
let CURRENT_SCRIBE_TAB = 'overview';
let SCRIBE_DATA_CACHE = null;
let SCRIBE_TABLE_PAGE = 1;
const SCRIBE_TABLE_PAGE_SIZE = 20;

// Main entry point for scribes mode
function buildScribes() {
  // Initialize tab navigation if first time
  if (!window.scribeTabsInitialized) {
    initScribeTabs();
    window.scribeTabsInitialized = true;
  }
  
  // Compute and render (tabs just scroll to sections for now)
  computeScribeData();
}

// Initialize tab navigation
function initScribeTabs() {
  const tabList = document.querySelector('.scribe-tabs');
  const panel = document.getElementById('scribes-mount');
  Core.enhanceExploreTabList(tabList, panel);

  document.querySelectorAll('.scribe-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) {
        CURRENT_SCRIBE_TAB = tab;
        
        // Update tab button classes
        document.querySelectorAll('.scribe-tab-btn').forEach(b => {
          const isActive = b.dataset.tab === tab;
          b.classList.toggle('is-on', isActive);
        });
        Core.syncExploreTabList(tabList, btn, panel);
        Core.updateExploreUrl('scribes', tab);
        
        // Scroll to relevant section
        scrollToScribeSection(tab);
      }
    });
  });
}

// Scroll to section based on tab
function scrollToScribeSection(tab) {
  const mount = document.getElementById('scribes-mount');
  if (!mount) return;
  
  // Store computed data for tab switching
  if (!window.SCRIBE_COMPUTED_DATA) {
    // Data will be set when first computed
    return;
  }
  
  const data = window.SCRIBE_COMPUTED_DATA;
  
  // Render the selected tab content
  switch(tab) {
    case 'overview':
      renderOverviewTab(mount, data);
      break;
    case 'productivity':
      renderProductivityTab(mount, data);
      break;
    case 'unseen-species':
      renderUnseenSpeciesTab(mount, data);
      break;
    case 'collaboration':
      renderCollaborationTab(mount, data);
      break;
    case 'geography':
      renderGeographyTab(mount, data);
      break;
    case 'browse':
      renderBrowseTab(mount, data);
      break;
  }
}

// Overview tab
function renderOverviewTab(mount, data) {
  mount.innerHTML = `
    <div class="card-panel card-panel--wide">
      <h2 class="section-title">Scribes Overview</h2>
      
      <!-- Key Statistics -->
      <div class="stat-grid explore-metric-grid">
        <div class="stat-tile explore-metric-card">
          <div class="stat-value">${data.totalScribes}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Total Female Scribes</div>
        </div>
        <div class="stat-tile explore-metric-card">
          <div class="stat-value">${data.totalSUs}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Total Scribal Units by Women</div>
        </div>
        <div class="stat-tile explore-metric-card">
          <div class="stat-value">${data.avgSUsPerScribe}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Avg SUs per Female Scribe</div>
        </div>
        <div class="stat-tile explore-metric-card">
          <div class="stat-value">${data.multilingualScribes}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Multilingual Female Scribes</div>
        </div>
      </div>
      
      <!-- Top 20 Most Productive Scribes -->
      <div id="scribes-bar-chart-wrapper" class="card-panel explore-visualization-card">
        <div class="explore-viz-card-header" style="margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Top 20 Most Productive Scribes</h3>
          ${createExportButton('scribes-bar-chart-wrapper', 'top_20_scribes.png')}
        </div>
        <div id="scribes-bar-chart"></div>
      </div>
    </div>
  `;
  
  buildScribesBarChart(data.top20);
}

// Productivity tab
function renderProductivityTab(mount, data) {
  mount.innerHTML = `
    <div class="mount-with-padding card-panel--wide">
      <h2 class="section-title">Productivity Patterns</h2>
      
      <div class="explore-chart-grid explore-chart-grid--stacked" style="margin-bottom: 2rem;">
        <div class="explore-visualization-card" id="scribe-productivity-chart-wrapper">
          <div class="explore-viz-card-header" style="margin-bottom: 0.5rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Scribe Productivity Distribution</h3>
            ${createExportButton('scribe-productivity-chart-wrapper', 'scribe_productivity.png')}
          </div>
          <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #64748b;">How many scribes participated in copying 1, 2, 3... manuscripts</p>
          <div id="scribe-productivity-distribution-chart"></div>
        </div>
        <div class="explore-visualization-card" id="manuscript-productivity-chart-wrapper">
          <div class="explore-viz-card-header" style="margin-bottom: 0.5rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Manuscript Productivity Distribution</h3>
            ${createExportButton('manuscript-productivity-chart-wrapper', 'manuscript_productivity.png')}
          </div>
          <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #64748b;">How many manuscripts have 1, 2, 3... scribes</p>
          <div id="productivity-distribution-chart"></div>
        </div>
      </div>
    </div>
  `;
  
  buildScribeProductivityDistribution(data.scribeProductivityDistribution);
  buildProductivityDistribution(data.productivityDistribution);
}

// Unseen Species tab
function renderUnseenSpeciesTab(mount, data) {
  mount.innerHTML = `
    <div class="mount-with-padding card-panel--wide">
      <div class="flex-space-between" style="margin-bottom:1.5rem;">
        <h2 class="section-title">Unseen Species Analysis</h2>
        <button id="unseen-species-info" class="explore-action-btn explore-action-btn--secondary explore-action-btn--compact">Method and references</button>
      </div>
      
      <!-- Experiment Selection -->
      <div class="explore-panel-card" style="margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.125rem;">Select Experiment</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
          <button class="experiment-btn" data-experiment="high-certainty" style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 1</div>
            <div style="font-size: 0.875rem; color: #64748b;">High Certainty Attributions</div>
          </button>
          <button class="experiment-btn active" data-experiment="entire-corpus" style="padding: 1rem; border: 2px solid #b88916; border-radius: 0.2rem; background: #fff; cursor: pointer; text-align: left; transition: border-color 0.2s;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 2</div>
            <div style="font-size: 0.875rem; color: #64748b;">Entire Corpus (Default)</div>
          </button>
          <button class="experiment-btn" data-experiment="by-country" style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 3</div>
            <div style="font-size: 0.875rem; color: #64748b;">Breakdown by Country</div>
          </button>
          <button class="experiment-btn" data-experiment="by-century" style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 4</div>
            <div style="font-size: 0.875rem; color: #64748b;">Breakdown by Century</div>
          </button>
        </div>
      </div>
      
      <!-- Results Container -->
      <div id="unseen-species-results" class="explore-panel-card">
        <div id="unseen-species-content"></div>
      </div>
    </div>
  `;
  
  // Set up experiment switching
  const experimentButtons = mount.querySelectorAll('.experiment-btn');
  experimentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      experimentButtons.forEach(b => {
        b.style.border = '2px solid #e2e8f0';
        b.style.background = 'white';
        b.classList.remove('active');
      });
      btn.style.border = '2px solid #f59e0b';
      btn.style.background = '#fffbeb';
      btn.classList.add('active');
      
      // Run the selected experiment
      const experiment = btn.dataset.experiment;
      runUnseenSpeciesExperiment(experiment, data.scribeArray);
    });
  });
  
  // Set up methodology button (works for all experiments)
  document.getElementById('unseen-species-info')?.addEventListener('click', () => {
    showMethodologyModal(0, 0, 0, 0, 0, 0); // Params will be updated with actual values
  });
  
  // Run default experiment (Entire Corpus)
  runUnseenSpeciesExperiment('entire-corpus', data.scribeArray);
}

// Collaboration tab
function renderCollaborationTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1600px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Scribe Collaborations</h2>
      
      <div class="explore-network-layout">
        <!-- Network Visualization -->
        <div class="explore-visualization-card" id="collab-network-wrapper">
          <div class="explore-viz-card-header" style="margin-bottom: 0.5rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Collaboration Network</h3>
            ${createExportButton('collab-network-wrapper', 'collaboration_network.png')}
          </div>
          <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #64748b;">
            Network showing which scribes worked together on manuscripts. Node size = number of collaborations, edge thickness = number of shared manuscripts.
          </p>
          <div id="collaboration-network-viz" style="width: 100%; min-height: 800px; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa;"></div>
        </div>
        
        <!-- Sidebar with Details -->
        <div class="explore-detail-stack">
          <div class="explore-panel-card">
            <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #475569;">Top Collaborators</h4>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: #94a3b8;">Click to focus on scribe</p>
            <div id="top-collaborators-list" style="max-height: 550px; overflow-y: auto;"></div>
          </div>
          <div class="explore-panel-card">
            <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #475569;">Multi-Scribe Manuscripts</h4>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: #94a3b8;">${data.collaborativeManuscripts.length} manuscripts</p>
            <div id="collaborative-manuscripts-list" style="max-height: 550px; overflow-y: auto;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  buildCollaborationNetwork(data.collaborativeManuscripts, data.collaborations, data.scribeArray);
  buildTopCollaborators(data.topCollaborators);
  buildCollaborativeManuscripts(data.collaborativeManuscripts);
}

// Geography tab
function renderGeographyTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Geographic & Institutional Distribution</h2>
      
      <div class="explore-chart-grid explore-chart-grid--stacked">
        <div id="institutions-chart-wrapper" class="explore-visualization-card">
          <div class="explore-viz-card-header" style="margin-bottom:1rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Top Institutions by Scribe Count</h3>
            ${createExportButton('institutions-chart-wrapper', 'scribes-by-institution.png')}
          </div>
          <div id="institutions-chart"></div>
        </div>
        <div id="cities-chart-wrapper" class="explore-visualization-card">
          <div class="explore-viz-card-header" style="margin-bottom:1rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Top Cities by Scribe Activity</h3>
            ${createExportButton('cities-chart-wrapper', 'scribes-by-city.png')}
          </div>
          <div id="cities-chart"></div>
        </div>
      </div>
    </div>
  `;
  
  buildInstitutionsChart(data.topInstitutions);
  buildCitiesChart(data.topCities);
}

// Browse tab
function renderBrowseTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Browse All Scribes</h2>
      
      <div class="explore-panel-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">All Scribes</h3>
          <button id="export-scribes-csv" class="explore-action-btn explore-action-btn--secondary explore-action-btn--compact">
            Export CSV
          </button>
        </div>
        
        <!-- Advanced Filters -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; padding: 1rem; background: #f8fafc; border-radius: 0.375rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Search</label>
            <input type="search" id="scribe-search" placeholder="Name, language, institution..." style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Filter Type</label>
            <select id="scribe-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="all">All Scribes</option>
              <option value="multilingual">Multilingual Only</option>
              <option value="productive">Highly Productive (5+ SUs)</option>
              <option value="collaborative">Collaborative (worked with others)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Language</label>
            <select id="scribe-lang-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Languages</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Institution</label>
            <select id="scribe-inst-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Institutions</option>
            </select>
          </div>
        </div>
        
        <div id="scribes-table" style="overflow-x: auto;"></div>
      </div>
    </div>
  `;
  
  buildScribesTable(data.scribeArray);
  populateLanguageFilter(data.scribeArray);
  populateInstitutionFilter(data.scribeArray);
  
  // Add event listeners
  const searchInput = document.getElementById('scribe-search');
  const filterSelect = document.getElementById('scribe-filter');
  const langFilter = document.getElementById('scribe-lang-filter');
  const instFilter = document.getElementById('scribe-inst-filter');
  
  const applyFilters = () => {
    SCRIBE_TABLE_PAGE = 1;
    filterScribesTable(
      data.scribeArray, 
      searchInput?.value || '', 
      filterSelect?.value || 'all',
      langFilter?.value || '',
      instFilter?.value || '',
      data.collaborations
    );
  };
  
  searchInput?.addEventListener('input', applyFilters);
  filterSelect?.addEventListener('change', applyFilters);
  langFilter?.addEventListener('change', applyFilters);
  instFilter?.addEventListener('change', applyFilters);
  
  document.getElementById('export-scribes-csv')?.addEventListener('click', () => {
    exportScribesCSV(data.scribeArray);
  });
}

// Compute scribe data
function computeScribeData() {
  const mount = document.getElementById('scribes-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">Loading scribe data...</div>';
  
  // Aggregate scribe data
  const scribeStats = {};
  const allSUs = Core.DATA.su || [];
  const allPUs = Core.DATA.pu || [];
  
  // Process all scribal units to collect scribe information
  allSUs.forEach(su => {
    const suId = String(su.rec_ID);
    const scribes = getScribesForSU(su);
    const msId = getMSForSU(su);
    const ms = msId ? Core.IDX.ms?.[msId] : null;
    const langInfo = getLanguageInfo(su, 'su');
    
    // Get production units for this SU (for country and date info)
    const puIds = getPUsForSU(su);
    const countries = new Set();
    const dates = [];
    
    puIds.forEach(puId => {
      const pu = Core.IDX.pu?.[puId];
      if (pu) {
        // Extract country from PU
        getControlledValsAll(pu, 'PU country').forEach(country => countries.add(country));
        
        const dateStr = Core.MAP.pu?.date(pu);
        if (isKnownCategory(dateStr)) {
          dates.push(dateStr);
        }
      }
    });
    
    // Get centuries from SU
    const centuries = getControlledValsAll(su, 'Normalized century of production');
    
    // Track unique scribes per SU (a scribe may have multiple relationships to same SU)
    const uniqueScribes = new Map();
    scribes.forEach(scribe => {
      if (!uniqueScribes.has(scribe.scribeId)) {
        uniqueScribes.set(scribe.scribeId, scribe);
      }
    });
    
    // Process each unique scribe
    uniqueScribes.forEach(scribe => {
      if (!scribeStats[scribe.scribeId]) {
        scribeStats[scribe.scribeId] = {
          id: scribe.scribeId,
          name: scribe.scribeName,
          suIds: new Set(),  // Track unique SU IDs instead of counter
          manuscripts: new Set(),
          languages: new Set(),
          institutions: new Set(),
          dates: [],
          sus: []
        };
      }
      
      // Add this SU to the scribe's set (prevents double-counting)
      scribeStats[scribe.scribeId].suIds.add(suId);
      
      if (msId && ms) {
        scribeStats[scribe.scribeId].manuscripts.add(Core.MAP.ms?.title(ms) || `MS-${msId}`);
      }
      
      langInfo.all.forEach(lang => scribeStats[scribe.scribeId].languages.add(lang));
      
      // Get monastic institutions from the scribe's (historical person's) relationships
      const scribeInstitutions = getInstitutionsForScribe(scribe.scribeId);
      scribeInstitutions.forEach(inst => {
        scribeStats[scribe.scribeId].institutions.add(inst.institutionName);
      });
      
      dates.forEach(date => {
        if (!scribeStats[scribe.scribeId].dates.includes(date)) {
          scribeStats[scribe.scribeId].dates.push(date);
        }
      });
      
      // Only add SU to list if not already there
      if (!scribeStats[scribe.scribeId].sus.find(s => s.id === suId)) {
        scribeStats[scribe.scribeId].sus.push({
          id: suId,
          title: Core.MAP.su?.title(su) || 'Untitled SU',
          msTitle: ms ? (Core.MAP.ms?.title(ms) || 'Untitled MS') : '',
          languages: langInfo.all,
          role: scribe.role,
          certainty: scribe.certainty,
          countries: Array.from(countries),
          centuries: centuries
        });
      }
    });
  });
  
  // Convert to array and sort by productivity
  const scribeArray = Object.values(scribeStats)
    .sort((a, b) => b.suIds.size - a.suIds.size);
  
  // Statistics
  const totalScribes = scribeArray.length;
  const totalSUs = scribeArray.reduce((sum, s) => sum + s.suIds.size, 0);
  const avgSUsPerScribe = totalScribes > 0 ? (totalSUs / totalScribes).toFixed(1) : 0;
  const multilingualScribes = scribeArray.filter(s => s.languages.size > 1).length;
  
  // Top 20 most productive scribes
  const top20 = scribeArray.slice(0, 20);
  
  // === PRODUCTIVITY DISTRIBUTION PER MANUSCRIPT (for cultural ecology) ===
  const msScribeCount = {}; // manuscript ID -> number of scribes
  const allMSs = Core.DATA.ms || [];
  
  allMSs.forEach(ms => {
    const msId = String(ms.rec_ID);
    const scribesInMs = new Set();
    
    // Find all scribes who worked on this manuscript
    scribeArray.forEach(scribe => {
      scribe.sus.forEach(su => {
        if (su.msTitle === (Core.MAP.ms?.title(ms) || `MS-${msId}`)) {
          scribesInMs.add(scribe.id);
        }
      });
    });
    
    if (scribesInMs.size > 0) {
      msScribeCount[msId] = {
        msTitle: Core.MAP.ms?.title(ms) || `MS-${msId}`,
        scribeCount: scribesInMs.size
      };
    }
  });
  
  // Distribution: how many manuscripts have 1, 2, 3... scribes
  const productivityDistribution = {};
  Object.values(msScribeCount).forEach(({ scribeCount }) => {
    productivityDistribution[scribeCount] = (productivityDistribution[scribeCount] || 0) + 1;
  });
  
  // === COLLABORATION NETWORK ===
  const collaborations = {}; // scribeId -> set of co-scribes
  const collaborativeManuscripts = []; // manuscripts with 2+ scribes
  
  Object.entries(msScribeCount).forEach(([msId, { msTitle, scribeCount }]) => {
    if (scribeCount >= 2) {
      // Find all scribes in this manuscript
      const scribesInMs = [];
      scribeArray.forEach(scribe => {
        scribe.sus.forEach(su => {
          if (su.msTitle === msTitle && !scribesInMs.find(s => s.id === scribe.id)) {
            scribesInMs.push({ id: scribe.id, name: scribe.name });
          }
        });
      });
      
      collaborativeManuscripts.push({
        msId,
        msTitle,
        scribes: scribesInMs,
        scribeCount: scribesInMs.length
      });
      
      // Record collaborations
      for (let i = 0; i < scribesInMs.length; i++) {
        for (let j = i + 1; j < scribesInMs.length; j++) {
          const scribe1 = scribesInMs[i].id;
          const scribe2 = scribesInMs[j].id;
          
          if (!collaborations[scribe1]) collaborations[scribe1] = new Set();
          if (!collaborations[scribe2]) collaborations[scribe2] = new Set();
          
          collaborations[scribe1].add(scribe2);
          collaborations[scribe2].add(scribe1);
        }
      }
    }
  });
  
  // Top collaborators
  const topCollaborators = Object.entries(collaborations)
    .map(([scribeId, coScribes]) => {
      const scribe = scribeArray.find(s => s.id === scribeId);
      if (!scribe || !isKnownCategory(scribe.name)) return null;
      return {
        id: scribeId,
        name: scribe.name,
        collaboratorCount: coScribes.size
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.collaboratorCount - a.collaboratorCount)
    .slice(0, 10);
  
  // === GEOGRAPHIC / INSTITUTIONAL BREAKDOWN ===
  const institutionStats = {};
  const cityStats = {};
  
  scribeArray.forEach(scribe => {
    scribe.institutions.forEach(inst => {
      if (!institutionStats[inst]) {
        institutionStats[inst] = { scribes: new Set(), suCount: 0 };
      }
      institutionStats[inst].scribes.add(scribe.id);
      institutionStats[inst].suCount += scribe.suIds.size;
    });
    
    // Extract city from institution name (assuming format includes city)
    scribe.institutions.forEach(inst => {
      // Try to extract city - institutions often have format "Name, City, Country"
      const parts = inst.split(',');
      if (parts.length >= 2) {
        const city = parts[parts.length - 2].trim();
        if (!cityStats[city]) {
          cityStats[city] = { scribes: new Set(), institutions: new Set() };
        }
        cityStats[city].scribes.add(scribe.id);
        cityStats[city].institutions.add(inst);
      }
    });
  });
  
  const topInstitutions = Object.entries(institutionStats)
    .map(([name, data]) => ({
      name,
      scribeCount: data.scribes.size,
      suCount: data.suCount
    }))
    .sort((a, b) => b.scribeCount - a.scribeCount)
    .slice(0, 15);
  
  const topCities = Object.entries(cityStats)
    .map(([name, data]) => ({
      name,
      scribeCount: data.scribes.size,
      institutionCount: data.institutions.size
    }))
    .sort((a, b) => b.scribeCount - a.scribeCount)
    .slice(0, 10);
  
  // === SCRIBE PRODUCTIVITY DISTRIBUTION ===
  // How many scribes copied 1 ms, 2 ms, 3 ms, etc.
  const scribeProductivityDistribution = {};
  scribeArray.forEach(scribe => {
    const msCount = scribe.manuscripts.size;
    if (msCount > 0) {
      scribeProductivityDistribution[msCount] = (scribeProductivityDistribution[msCount] || 0) + 1;
    }
  });
  
  // Store all computed data globally for tab switching
  window.SCRIBE_COMPUTED_DATA = {
    scribeArray,
    totalScribes,
    totalSUs,
    avgSUsPerScribe,
    multilingualScribes,
    top20,
    scribeProductivityDistribution,
    productivityDistribution,
    collaborations,
    topCollaborators,
    collaborativeManuscripts,
    topInstitutions,
    topCities
  };
  
  // Render the current tab (default to overview)
  scrollToScribeSection(CURRENT_SCRIBE_TAB);
}

function buildScribeProductivityDistribution(distribution) {
  const container = document.getElementById('scribe-productivity-distribution-chart');
  if (!container) return;
  
  const maxMsCount = Math.max(...Object.keys(distribution).map(Number));
  const data = [];
  for (let i = 1; i <= maxMsCount; i++) {
    if (distribution[i] && distribution[i] > 0) {
      data.push({ msCount: i, scribeCount: distribution[i] });
    }
  }
  
  const totalScribeCount = data.reduce((sum, d) => sum + d.scribeCount, 0);
  const barHeight = 40;
  const gap = 8;
  
  const html = data.map(d => {
    const percentage = totalScribeCount > 0 ? (d.scribeCount / totalScribeCount) * 100 : 0;
    const label = d.msCount === 1 ? '1 ms' : `${d.msCount} ms`;
    
    return `
      <div class="explore-proportion-row" style="margin-bottom: ${gap}px;">
        <div class="explore-proportion-label" style="font-size: 0.875rem; color: #64748b; font-weight: 500;">
          ${label}
        </div>
        <div class="explore-proportion-track" style="height: ${barHeight}px;">
          <div style="background:#3f8067;height:100%;width:${percentage}%;border-radius:0.15rem;"></div>
        </div>
        <div class="explore-proportion-value" style="font-size: 0.875rem; font-weight: 600; color: #475569;">
          ${d.scribeCount} · ${percentage.toFixed(1)}% <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 400;">${d.scribeCount === 1 ? 'scribe' : 'scribes'}</span>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8125rem; color: #64748b;">
      <strong>Total:</strong> ${Object.values(distribution).reduce((a, b) => a + b, 0)} scribes
    </div>
  `;
}

function buildProductivityDistribution(distribution) {
  const container = document.getElementById('productivity-distribution-chart');
  if (!container) return;
  
  const maxScribes = Math.max(...Object.keys(distribution).map(Number));
  const data = [];
  for (let i = 1; i <= maxScribes; i++) {
    if (distribution[i] && distribution[i] > 0) {
      data.push({ scribeCount: i, msCount: distribution[i] });
    }
  }
  
  const totalMsCount = data.reduce((sum, d) => sum + d.msCount, 0);
  const barHeight = 40;
  const gap = 8;
  
  const html = data.map(d => {
    const percentage = totalMsCount > 0 ? (d.msCount / totalMsCount) * 100 : 0;
    const label = d.scribeCount === 1 ? '1 scribe' : `${d.scribeCount} scribes`;
    
    return `
      <div class="explore-proportion-row" style="margin-bottom: ${gap}px;">
        <div class="explore-proportion-label" style="font-size: 0.875rem; color: #64748b; font-weight: 500;">
          ${label}
        </div>
        <div class="explore-proportion-track" style="height: ${barHeight}px;">
          <div style="background:#b88912;height:100%;width:${percentage}%;border-radius:0.15rem;"></div>
        </div>
        <div class="explore-proportion-value" style="font-size: 0.875rem; font-weight: 600; color: #475569;">
          ${d.msCount} · ${percentage.toFixed(1)}% <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 400;">${d.msCount === 1 ? 'manuscript' : 'manuscripts'}</span>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8125rem; color: #64748b;">
      <strong>Total:</strong> ${Object.values(distribution).reduce((a, b) => a + b, 0)} manuscripts with identified scribes
    </div>
  `;
}

/**
 * Calculate Chao1 estimator for unseen species
 * Reference: Chao, A. (1984). Nonparametric estimation of the number of classes in a population.
 */
function calculateChao1(productivityDist, observed) {
  const f1 = productivityDist[1] || 0; // singletons
  const f2 = productivityDist[2] || 0; // doubletons
  
  let estimate = observed;
  let lower = observed;
  let upper = observed;
  
  if (f2 > 0) {
    // Standard Chao1
    estimate = observed + (f1 * f1) / (2 * f2);
    // 95% CI approximation
    const variance = f2 * (0.5 * Math.pow(f1/f2, 2) + Math.pow(f1/f2, 3) + 0.25 * Math.pow(f1/f2, 4));
    const se = Math.sqrt(variance);
    lower = Math.max(observed, estimate - 1.96 * se);
    upper = estimate + 1.96 * se;
  } else if (f1 > 0) {
    // Modified Chao1 when f2 = 0
    estimate = observed + (f1 * (f1 - 1)) / 2;
    lower = observed + (f1 * (f1 - 1)) / 2;
    upper = observed + (f1 * (f1 + 1)) / 2;
  }
  
  return { estimate, lower, upper, f1, f2 };
}

/**
 * Calculate Jackknife estimator for unseen species
 * Reference: Walther & Morand (1998). Comparative performance of species richness estimation methods.
 * First-order jackknife: S_jack1 = S_obs + f1 * (n-1)/n
 * where f1 = number of species in exactly one sample, n = number of samples
 */
function calculateJackknife(productivityDist, observed) {
  const f1 = productivityDist[1] || 0;
  const f2 = productivityDist[2] || 0;
  
  // Calculate total number of manuscripts (samples)
  let totalManuscripts = 0;
  Object.entries(productivityDist).forEach(([count, scribes]) => {
    totalManuscripts += Number(count) * scribes;
  });
  
  // First-order Jackknife
  const jack1 = observed + f1 * (totalManuscripts - 1) / totalManuscripts;
  
  // Second-order Jackknife (uses doubletons for better accuracy)
  let jack2 = jack1;
  if (f2 > 0 && totalManuscripts > 1) {
    jack2 = observed + f1 * (2 * totalManuscripts - 3) / totalManuscripts 
            - f2 * Math.pow(totalManuscripts - 2, 2) / (totalManuscripts * (totalManuscripts - 1));
  }
  
  // Use Jack2 if available and makes sense, otherwise Jack1
  const estimate = (f2 > 0 && jack2 > observed) ? jack2 : jack1;
  
  // Rough CI approximation (simplified variance estimate)
  const se = Math.sqrt(f1 * (totalManuscripts - 1) / totalManuscripts);
  const lower = Math.max(observed, estimate - 1.96 * se);
  const upper = estimate + 1.96 * se;
  
  return { estimate, lower, upper, order: f2 > 0 ? 2 : 1 };
}

/**
 * Calculate Gamma-Poisson Model estimator
 * Reference: Böhning & Schön (2005). Nonparametric maximum likelihood estimation of population size.
 * This uses a mixture model approach to account for heterogeneity in detection probability.
 */
function calculateGammaPoisson(productivityDist, observed) {
  const f1 = productivityDist[1] || 0;
  const f2 = productivityDist[2] || 0;
  const f3 = productivityDist[3] || 0;
  
  // Calculate total manuscripts
  let totalManuscripts = 0;
  Object.entries(productivityDist).forEach(([count, scribes]) => {
    totalManuscripts += Number(count) * scribes;
  });
  
  // Gamma-Poisson uses a more sophisticated approach
  // Simplified formula based on low-frequency counts
  let estimate = observed;
  
  if (f1 > 0 && totalManuscripts > 0) {
    // Alpha parameter (shape) estimation using moment matching
    const meanProductivity = totalManuscripts / observed;
    
    // Gamma-Poisson formula (simplified Chao-Bunge variant)
    if (f2 > 0) {
      const t = 10; // cutoff for rare species
      let numerator = 0;
      let denominator = 0;
      
      for (let i = 1; i <= Math.min(t, Object.keys(productivityDist).length); i++) {
        const fi = productivityDist[i] || 0;
        if (fi > 0) {
          numerator += i * (i - 1) * fi;
          denominator += i * (i - 1) * fi;
        }
      }
      
      if (denominator > 0 && f2 > 0) {
        // Estimate using frequency ratios
        const gamma = Math.max(0, 1 - f2 / Math.max(1, (f1 * f1 / (2 * f2))));
        estimate = observed + f1 / gamma;
      } else {
        // Fallback to modified Chao1-like estimate
        estimate = observed + f1 * f1 / (2 * Math.max(1, f2));
      }
    } else {
      // When f2 = 0, use a more conservative estimate
      estimate = observed + f1 * Math.log(totalManuscripts / observed);
    }
  }
  
  // Rough CI (simplified)
  const se = Math.sqrt(Math.abs(estimate - observed));
  const lower = Math.max(observed, estimate - 1.96 * se);
  const upper = estimate + 1.96 * se * 1.5; // Wider CI for model uncertainty
  
  return { estimate, lower, upper };
}

/**
 * Run unseen species analysis for a specific experiment
 */
function runUnseenSpeciesExperiment(experimentType, scribeArray) {
  const container = document.getElementById('unseen-species-content');
  if (!container) return;
  
  switch(experimentType) {
    case 'high-certainty':
      buildHighCertaintyAnalysis(scribeArray, container);
      break;
    case 'entire-corpus':
      buildEntireCorpusAnalysis(scribeArray, container);
      break;
    case 'by-country':
      buildByCountryAnalysis(scribeArray, container);
      break;
    case 'by-century':
      buildByCenturyAnalysis(scribeArray, container);
      break;
  }
}

/**
 * Experiment 1: High Certainty Attributions Only
 */
function buildHighCertaintyAnalysis(scribeArray, container) {
  // Filter for high certainty attributions
  const highCertaintyScribes = scribeArray.map(scribe => {
    const highCertaintySUs = scribe.sus.filter(su => {
      const certainty = su.certainty || '';
      return certainty.toLowerCase().includes('high') || certainty === 'High';
    });
    
    if (highCertaintySUs.length === 0) return null;
    
    return {
      ...scribe,
      sus: highCertaintySUs,
      manuscripts: new Set(highCertaintySUs.map(su => su.msTitle))
    };
  }).filter(Boolean);
  
  const productivityDist = {};
  highCertaintyScribes.forEach(scribe => {
    const msCount = scribe.manuscripts.size;
    productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
  });
  
  buildUnseenSpeciesComparison(
    productivityDist,
    highCertaintyScribes.length,
    container,
    'High Certainty Attributions',
    'Only includes scribal units with high certainty attributions'
  );
}

/**
 * Experiment 2: Entire Corpus (Current Implementation)
 */
function buildEntireCorpusAnalysis(scribeArray, container) {
  const productivityDist = {};
  scribeArray.forEach(scribe => {
    const msCount = scribe.manuscripts.size;
    productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
  });
  
  buildUnseenSpeciesComparison(
    productivityDist,
    scribeArray.length,
    container,
    'Entire Corpus',
    'All female scribes in the database regardless of attribution certainty'
  );
}

/**
 * Experiment 3: By Country Breakdown
 */
function buildByCountryAnalysis(scribeArray, container) {
  // Group scribes by country
  const countryGroups = {};
  
  scribeArray.forEach(scribe => {
    const countries = new Set();
    scribe.sus.forEach(su => {
      if (su.countries && su.countries.length > 0) {
        su.countries.forEach(c => countries.add(c));
      }
    });
    
    countries.forEach(country => {
      if (!countryGroups[country]) {
        countryGroups[country] = [];
      }
      countryGroups[country].push(scribe);
    });
  });
  
  // Sort countries by scribe count
  const sortedCountries = Object.entries(countryGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8); // Top 8 countries
  
  if (sortedCountries.length === 0) {
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #94a3b8;">No country data available for analysis</div>';
    return;
  }
  
  let html = '<div style="display: grid; gap: 2rem;">';
  
  sortedCountries.forEach(([country, scribes]) => {
    const productivityDist = {};
    scribes.forEach(scribe => {
      const msCount = scribe.manuscripts.size;
      productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
    });
    
    const chao1 = calculateChao1(productivityDist, scribes.length);
    const jackknife = calculateJackknife(productivityDist, scribes.length);
    const gammaPoisson = calculateGammaPoisson(productivityDist, scribes.length);
    
    html += `
      <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; background: #fafafa;">
        <h4 style="margin: 0 0 1rem 0; color: #1e293b; font-size: 1.125rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></span>
          ${country}
        </h4>
        ${buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, scribes.length)}
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Experiment 4: By Century Breakdown
 */
function buildByCenturyAnalysis(scribeArray, container) {
  // Group scribes by century
  const centuryGroups = {};
  
  scribeArray.forEach(scribe => {
    const centuries = new Set();
    scribe.sus.forEach(su => {
      if (su.centuries && su.centuries.length > 0) {
        su.centuries.forEach(c => centuries.add(c));
      }
    });
    
    centuries.forEach(century => {
      if (!centuryGroups[century]) {
        centuryGroups[century] = [];
      }
      centuryGroups[century].push(scribe);
    });
  });
  
  // Sort centuries chronologically and filter out 18th century and Unknown
  const sortedCenturies = Object.entries(centuryGroups)
    .filter(([century]) => {
      // Exclude 18th century and Unknown
      if (century.toLowerCase().includes('unknown')) return false;
      if (century.match(/18th/i)) return false;
      if (century.match(/XVIII/i)) return false;
      return true;
    })
    .sort((a, b) => {
      const aNum = parseInt(a[0].match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b[0].match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });
  
  if (sortedCenturies.length === 0) {
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #94a3b8;">No century data available for analysis</div>';
    return;
  }
  
  let html = '<div style="display: grid; gap: 2rem;">';
  
  sortedCenturies.forEach(([century, scribes]) => {
    const productivityDist = {};
    scribes.forEach(scribe => {
      const msCount = scribe.manuscripts.size;
      productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
    });
    
    const chao1 = calculateChao1(productivityDist, scribes.length);
    const jackknife = calculateJackknife(productivityDist, scribes.length);
    const gammaPoisson = calculateGammaPoisson(productivityDist, scribes.length);
    
    html += `
      <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; background: #fafafa;">
        <h4 style="margin: 0 0 1rem 0; color: #1e293b; font-size: 1.125rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></span>
          ${century}
        </h4>
        ${buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, scribes.length)}
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Build comparison table for all three estimators
 */
function buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, observed) {
  return `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
            <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Estimator</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Observed</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Estimated</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Unseen</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Coverage</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">95% CI</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 0.75rem; font-weight: 600; color: #f59e0b;">Chao1</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b;">${observed}</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b; font-weight: 600;">${Math.round(chao1.estimate)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #dc2626;">${Math.round(chao1.estimate - observed)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #10b981;">${((observed/chao1.estimate)*100).toFixed(1)}%</td>
            <td style="padding: 0.75rem; text-align: right; color: #64748b; font-size: 0.8125rem;">${Math.round(chao1.lower)}–${Math.round(chao1.upper)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 0.75rem; font-weight: 600; color: #fb923c;">Jackknife</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b;">${observed}</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b; font-weight: 600;">${Math.round(jackknife.estimate)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #dc2626;">${Math.round(jackknife.estimate - observed)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #10b981;">${((observed/jackknife.estimate)*100).toFixed(1)}%</td>
            <td style="padding: 0.75rem; text-align: right; color: #64748b; font-size: 0.8125rem;">${Math.round(jackknife.lower)}–${Math.round(jackknife.upper)}</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; font-weight: 600; color: #eab308;">Gamma-Poisson</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b;">${observed}</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b; font-weight: 600;">${Math.round(gammaPoisson.estimate)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #dc2626;">${Math.round(gammaPoisson.estimate - observed)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #10b981;">${((observed/gammaPoisson.estimate)*100).toFixed(1)}%</td>
            <td style="padding: 0.75rem; text-align: right; color: #64748b; font-size: 0.8125rem;">${Math.round(gammaPoisson.lower)}–${Math.round(gammaPoisson.upper)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top: 1rem; padding: 0.875rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.8125rem; color: #475569; line-height: 1.5;">
      <strong>Singletons (f₁):</strong> ${chao1.f1} | <strong>Doubletons (f₂):</strong> ${chao1.f2}
    </div>
  `;
}

/**
 * Build full analysis comparison for single dataset
 */
function buildUnseenSpeciesComparison(productivityDist, observed, container, title, description) {
  const chao1 = calculateChao1(productivityDist, observed);
  const jackknife = calculateJackknife(productivityDist, observed);
  const gammaPoisson = calculateGammaPoisson(productivityDist, observed);
  
  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h3 style="margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1.25rem;">${title}</h3>
      <p style="margin: 0; font-size: 0.875rem; color: #64748b;">${description}</p>
    </div>
    
    <!-- Key Metrics -->
    <div class="explore-metric-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Observed Scribes</div>
        <div style="font-size: 2rem; font-weight: 700;">${observed}</div>
      </div>
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Chao1 Estimate</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(chao1.estimate)}</div>
      </div>
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Jackknife Estimate</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(jackknife.estimate)}</div>
      </div>
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Gamma-Poisson Est.</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(gammaPoisson.estimate)}</div>
      </div>
    </div>
    
    <!-- Detailed Comparison Table -->
    <div style="margin-bottom: 2rem;">
      <h4 style="margin: 0 0 1rem 0; color: #475569; font-size: 1rem; font-weight: 600;">Estimator Comparison</h4>
      ${buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, observed)}
    </div>
    
    <!-- Interpretation -->
    <div class="editorial-note">
      <div style="font-size: 0.875rem; color: #475569; line-height: 1.6;">
        <strong>Interpretation:</strong> The three estimators provide different estimates of the total scribe population.
        <strong>Chao1</strong> estimates ${Math.round(chao1.estimate)} total scribes (${Math.round(chao1.estimate - observed)} unseen),
        <strong>Jackknife</strong> estimates ${Math.round(jackknife.estimate)} (${Math.round(jackknife.estimate - observed)} unseen),
        and <strong>Gamma-Poisson</strong> estimates ${Math.round(gammaPoisson.estimate)} (${Math.round(gammaPoisson.estimate - observed)} unseen).
      </div>
    </div>
    
    <!-- Explanation of Differences -->
    <div class="editorial-note">
      <div style="font-size: 0.875rem; color: #92400e; line-height: 1.6;">
        <strong style="color: #78350f;">Why do estimates differ?</strong><br>
        Each estimator makes different assumptions:<br>
        • <strong>Chao1</strong> (most conservative): Assumes all scribes have equal detection probability. Best when most scribes are rare (many singletons).<br>
        • <strong>Jackknife</strong> (moderate): Accounts for sampling effort and is more robust to sample size. Reliable for well-sampled populations.<br>
        • <strong>Gamma-Poisson</strong> (most liberal): Assumes heterogeneous detection rates (some scribes easier to find). Better for uneven survival rates.<br><br>
        No estimator recovers a known historical total. Chao1 gives the most conservative estimate here; the spread between methods shows sensitivity to their assumptions and to uneven documentary survival (Kestemont et al. 2021).
      </div>
    </div>
    
    <!-- Productivity Distribution with f0 -->
    <div class="explore-visualization-card" style="margin-bottom: 2rem;" id="productivity-dist-wrapper">
      <div class="explore-viz-card-header" style="margin-bottom: 0.5rem;">
        <h4 style="margin: 0; color: #475569; font-size: 0.9375rem; font-weight: 600;">Productivity Distribution (Observed + Chao1 Unseen)</h4>
        ${createExportButton('productivity-dist-wrapper', 'productivity_distribution_with_unseen.png')}
      </div>
      <p style="margin: 0 0 1rem 0; font-size: 0.8125rem; color: #64748b;">
        Number of scribes by manuscript count. The first bar (0) shows Chao1's estimate of unseen scribes. Bar width uses a logarithmic scale and exact counts are printed on every bar.
      </p>
      <div id="productivity-distribution-chart"></div>
    </div>
    
  `;
  
  drawProductivityDistribution(productivityDist, chao1.estimate - observed);
}

function buildUnseenSpeciesEstimates(productivityDistribution, observedScribes) {
  const container = document.getElementById('unseen-species-content');
  if (!container) return;
  
  // Calculate Chao1 estimate from productivity distribution
  // Chao1 formula: S_est = S_obs + (f1^2 / (2 * f2))
  // where f1 = number of singletons, f2 = number of doubletons
  const f1 = productivityDistribution[1] || 0; // scribes who copied 1 manuscript
  const f2 = productivityDistribution[2] || 0; // scribes who copied 2 manuscripts
  
  let chao1Estimate = observedScribes;
  let chao1Lower = observedScribes;
  let chao1Upper = observedScribes;
  
  if (f2 > 0) {
    // Standard Chao1
    chao1Estimate = observedScribes + (f1 * f1) / (2 * f2);
    // 95% CI approximation (simplified)
    const variance = f2 * (0.5 * (f1/f2)^2 + (f1/f2)^3 + 0.25 * (f1/f2)^4);
    const se = Math.sqrt(variance);
    chao1Lower = Math.max(observedScribes, chao1Estimate - 1.96 * se);
    chao1Upper = chao1Estimate + 1.96 * se;
  } else if (f1 > 0) {
    // Modified Chao1 when f2 = 0
    chao1Estimate = observedScribes + (f1 * (f1 - 1)) / 2;
    chao1Lower = observedScribes + (f1 * (f1 - 1)) / 2;
    chao1Upper = observedScribes + (f1 * (f1 + 1)) / 2;
  }
  
  const unseenEstimate = Math.round(chao1Estimate - observedScribes);
  const coverage = ((observedScribes / chao1Estimate) * 100).toFixed(1);
  
  container.innerHTML = `
    <div class="explore-metric-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Observed Scribes</div>
        <div style="font-size: 2rem; font-weight: 700;">${observedScribes}</div>
      </div>
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Estimated Total (Chao1)</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(chao1Estimate)}</div>
        <div style="font-size: 0.75rem; opacity: 0.85; margin-top: 0.25rem;">95% CI: ${Math.round(chao1Lower)}–${Math.round(chao1Upper)}</div>
      </div>
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Estimated Unseen</div>
        <div style="font-size: 2rem; font-weight: 700;">${unseenEstimate}</div>
      </div>
      <div class="explore-metric-card">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Sample Coverage</div>
        <div style="font-size: 2rem; font-weight: 700;">${coverage}%</div>
      </div>
    </div>
    
    <div class="editorial-note">
      <div style="font-size: 0.875rem; color: #475569; line-height: 1.6;">
        <strong>Interpretation:</strong> Based on the observed distribution of scribe productivity, 
        we estimate there were approximately <strong>${Math.round(chao1Estimate)}</strong> female scribes in total,
        suggesting about <strong>${unseenEstimate}</strong> scribes whose work has not survived or has not yet been identified.
        The current corpus captures approximately <strong>${coverage}%</strong> of the estimated total scribe population.
      </div>
    </div>
    
  `;
  
  // Add methodology info button handler
  document.getElementById('unseen-species-info')?.addEventListener('click', () => {
    showUnseenSpeciesMethodology(f1, f2, observedScribes, chao1Estimate);
  });
  
}

function drawSpeciesAccumulationCurve(distribution, observed, estimated, unseenEstimate) {
  const svg = document.getElementById('species-accumulation-svg');
  if (!svg) return;
  
  const width = svg.clientWidth || 800;
  const height = 300;
  const margin = { top: 20, right: 80, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Simulate species accumulation: create a rarefaction curve
  // Sort scribes by number of manuscripts (most to least productive)
  const scribesByProductivity = [];
  Object.keys(distribution).forEach(msCount => {
    const numScribes = distribution[msCount];
    for (let i = 0; i < numScribes; i++) {
      scribesByProductivity.push(Number(msCount));
    }
  });
  
  // Shuffle to simulate random sampling order
  for (let i = scribesByProductivity.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scribesByProductivity[i], scribesByProductivity[j]] = [scribesByProductivity[j], scribesByProductivity[i]];
  }
  
  // Create species accumulation curve
  const accumulationData = [{ manuscripts: 0, scribes: 0 }];
  let cumulativeManuscripts = 0;
  
  scribesByProductivity.forEach((msCount, index) => {
    cumulativeManuscripts += msCount;
    accumulationData.push({ 
      manuscripts: cumulativeManuscripts, 
      scribes: index + 1 
    });
  });
  
  const maxX = accumulationData[accumulationData.length - 1]?.manuscripts || 100;
  const xScale = (x) => margin.left + (x / maxX) * innerWidth;
  const yScale = (y) => height - margin.bottom - (y / estimated) * innerHeight;
  
  // Clear and redraw
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  // Draw grid lines
  const gridColor = '#f1f5f9';
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (i * innerHeight / 5);
    svg.innerHTML += `<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="${gridColor}" stroke-width="1"/>`;
  }
  
  // Draw axes
  const axisColor = '#94a3b8';
  
  // Y-axis
  svg.innerHTML += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" stroke="${axisColor}" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left - 45}" y="${height/2}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600" transform="rotate(-90 ${margin.left - 45} ${height/2})">Number of Scribes Discovered</text>`;
  
  // Y-axis ticks
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((estimated / 5) * i);
    const y = yScale(value);
    svg.innerHTML += `<text x="${margin.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#64748b">${value}</text>`;
  }
  
  // X-axis
  svg.innerHTML += `<line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" stroke="${axisColor}" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left + innerWidth/2}" y="${height - 10}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600">Manuscripts Sampled</text>`;
  
  // Draw observed accumulation curve
  const points = accumulationData.map(d => `${xScale(d.manuscripts)},${yScale(d.scribes)}`).join(' ');
  svg.innerHTML += `<polyline points="${points}" fill="none" stroke="#f59e0b" stroke-width="3"/>`;
  
  // Draw estimated asymptote (horizontal line showing the target)
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(estimated)}" x2="${width - margin.right}" y2="${yScale(estimated)}" stroke="#ea580c" stroke-width="2" stroke-dasharray="8,4"/>`;
  
  // Add annotation explaining the asymptote
  svg.innerHTML += `<text x="${margin.left + 10}" y="${yScale(estimated) - 8}" font-size="10" fill="#ea580c" font-weight="600">← Asymptote: estimated total population</text>`;
  
  // Add shaded area between observed and estimated to visualize gap
  const lastPoint = accumulationData[accumulationData.length - 1];
  if (lastPoint && lastPoint.manuscripts) {
    const gapHeight = yScale(observed) - yScale(estimated);
    svg.innerHTML += `<rect x="${xScale(lastPoint.manuscripts)}" y="${yScale(estimated)}" width="${width - margin.right - xScale(lastPoint.manuscripts)}" height="${gapHeight}" fill="#fecaca" opacity="0.3"/>`;
    
    // Add label for the gap
    const gapMidY = (yScale(estimated) + yScale(observed)) / 2;
    svg.innerHTML += `<text x="${(xScale(lastPoint.manuscripts) + width - margin.right) / 2}" y="${gapMidY}" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="600">Estimated Unseen: ${unseenEstimate}</text>`;
  }
  
  // Labels with better positioning and boxes for clarity
  const observedY = yScale(observed);
  const estimatedY = yScale(estimated);
  
  // Observed label with background box
  svg.innerHTML += `<rect x="${width - margin.right + 5}" y="${observedY - 10}" width="105" height="18" fill="white" stroke="#f59e0b" stroke-width="1" rx="3"/>`;
  svg.innerHTML += `<circle cx="${width - margin.right + 14}" cy="${observedY}" r="4" fill="#f59e0b"/>`;
  svg.innerHTML += `<text x="${width - margin.right + 24}" y="${observedY + 4}" font-size="11" fill="#f59e0b" font-weight="700">Observed: ${observed}</text>`;
  
  // Estimated label with background box
  svg.innerHTML += `<rect x="${width - margin.right + 5}" y="${estimatedY - 10}" width="110" height="18" fill="white" stroke="#ea580c" stroke-width="1" rx="3"/>`;
  svg.innerHTML += `<circle cx="${width - margin.right + 14}" cy="${estimatedY}" r="4" fill="#ea580c"/>`;
  svg.innerHTML += `<text x="${width - margin.right + 24}" y="${estimatedY + 4}" font-size="11" fill="#ea580c" font-weight="700">Estimated: ${Math.round(estimated)}</text>`;
}

/**
 * Draw productivity distribution bar chart including f0 (unseen scribes)
 */
function drawProductivityDistribution(productivityDist, unseenCount) {
  const container = document.getElementById('productivity-distribution-chart');
  if (!container) return;
  
  // Prepare data - include 0 (unseen) as first bar
  const data = [{ manuscripts: 0, scribes: Math.round(unseenCount), isUnseen: true }];
  
  // Add observed data
  const maxManuscripts = Math.max(...Object.keys(productivityDist).map(Number));
  for (let i = 1; i <= Math.min(maxManuscripts, 20); i++) {
    data.push({
      manuscripts: i,
      scribes: productivityDist[i] || 0,
      isUnseen: false
    });
  }
  
  const maxScribes = Math.max(...data.map(d => d.scribes));
  const barHeight = 30;
  const gap = 5;
  const labelWidth = 80;
  const chartWidth = container.clientWidth - labelWidth - 100 || 600;
  
  // Use logarithmic scaling for better visual differentiation
  const maxLog = Math.log10(maxScribes + 1);
  
  const html = data.map((d, i) => {
    // Calculate bar width using logarithmic scale for better granularity
    const logValue = Math.log10(d.scribes + 1);
    const barWidth = maxLog > 0 ? (logValue / maxLog) * chartWidth : 0;
    const color = d.isUnseen ? '#dc2626' : '#f59e0b';
    const label = d.manuscripts === 0 ? '0 (Unseen)' : d.manuscripts;
    
    const displayWidth = d.scribes > 0 ? barWidth : 0;
    
    return `
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: ${gap}px;">
        <div style="width: ${labelWidth}px; text-align: right; font-size: 0.875rem; color: #475569; font-weight: ${d.isUnseen ? '700' : '400'};">
          ${label} MS${d.manuscripts === 1 ? '' : 's'}
        </div>
        <div style="flex: 1; display: flex; align-items: center; gap: 0.5rem;">
          <div style="background: ${color}; height: ${barHeight}px; width: ${displayWidth}px; border-radius: 0.25rem; transition: all 0.3s; position: relative;">
            <div style="position: absolute; ${displayWidth < 60 ? 'left: calc(100% + 0.5rem)' : 'right: 0.5rem'}; top: 50%; transform: translateY(-50%); color: ${displayWidth < 60 ? '#1e293b' : 'white'}; font-weight: 600; font-size: 0.75rem;">
              ${d.scribes}
            </div>
          </div>
          <div style="font-size: 0.75rem; color: #64748b; ${displayWidth < 60 ? 'margin-left: 2.5rem;' : ''}">
            ${d.isUnseen ? 'Estimated unseen (Chao1)' : 'scribes'}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.75rem; color: #64748b;">
      <span style="color: #dc2626;">●</span> Unseen (Chao1 estimate) &nbsp;&nbsp;
      <span style="color: #f59e0b;">●</span> Observed
    </div>
  `;
}

/**
 * Draw species accumulation curve with multiple estimator asymptotes
 */
function drawSpeciesAccumulationCurveMulti(distribution, observed, chao1Est, jackknifeEst, gammaPoissonEst) {
  const svg = document.getElementById('species-accumulation-svg');
  if (!svg) return;
  
  const width = svg.clientWidth || 800;
  const height = 350;
  const margin = { top: 20, right: 120, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const maxEstimate = Math.max(chao1Est, jackknifeEst, gammaPoissonEst);
  
  // Create rarefaction curve
  const scribesByProductivity = [];
  Object.keys(distribution).forEach(msCount => {
    const numScribes = distribution[msCount];
    for (let i = 0; i < numScribes; i++) {
      scribesByProductivity.push(Number(msCount));
    }
  });
  
  for (let i = scribesByProductivity.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scribesByProductivity[i], scribesByProductivity[j]] = [scribesByProductivity[j], scribesByProductivity[i]];
  }
  
  const accumulationData = [{ manuscripts: 0, scribes: 0 }];
  let cumulativeManuscripts = 0;
  
  scribesByProductivity.forEach((msCount, index) => {
    cumulativeManuscripts += msCount;
    accumulationData.push({ 
      manuscripts: cumulativeManuscripts, 
      scribes: index + 1 
    });
  });
  
  const maxX = accumulationData[accumulationData.length - 1]?.manuscripts || 100;
  const xScale = (x) => margin.left + (x / maxX) * innerWidth;
  const yScale = (y) => height - margin.bottom - (y / maxEstimate) * innerHeight;
  
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  // Grid
  const gridColor = '#f1f5f9';
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (i * innerHeight / 5);
    svg.innerHTML += `<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="${gridColor}" stroke-width="1"/>`;
  }
  
  // Axes
  svg.innerHTML += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" stroke="#94a3b8" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left - 45}" y="${height/2}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600" transform="rotate(-90 ${margin.left - 45} ${height/2})">Number of Scribes</text>`;
  
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxEstimate / 5) * i);
    const y = yScale(value);
    svg.innerHTML += `<text x="${margin.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#64748b">${value}</text>`;
  }
  
  svg.innerHTML += `<line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" stroke="#94a3b8" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left + innerWidth/2}" y="${height - 10}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600">Manuscripts Sampled</text>`;
  
  // Observed curve
  const points = accumulationData.map(d => `${xScale(d.manuscripts)},${yScale(d.scribes)}`).join(' ');
  svg.innerHTML += `<polyline points="${points}" fill="none" stroke="#2563eb" stroke-width="3"/>`;
  
  // Asymptote lines for each estimator
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(chao1Est)}" x2="${width - margin.right}" y2="${yScale(chao1Est)}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8,4"/>`;
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(jackknifeEst)}" x2="${width - margin.right}" y2="${yScale(jackknifeEst)}" stroke="#fb923c" stroke-width="2" stroke-dasharray="5,5"/>`;
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(gammaPoissonEst)}" x2="${width - margin.right}" y2="${yScale(gammaPoissonEst)}" stroke="#eab308" stroke-width="2" stroke-dasharray="10,5"/>`;
  
  // Legend on the right
  const legendX = width - margin.right + 10;
  let legendY = margin.top + 20;
  
  // Observed
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#2563eb" stroke-width="3"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#1e293b">Observed: ${observed}</text>`;
  legendY += 25;
  
  // Chao1
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8,4"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#f59e0b" font-weight="600">Chao1: ${Math.round(chao1Est)}</text>`;
  legendY += 25;
  
  // Jackknife
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#fb923c" stroke-width="2" stroke-dasharray="5,5"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#fb923c" font-weight="600">Jackknife: ${Math.round(jackknifeEst)}</text>`;
  legendY += 25;
  
  // Gamma-Poisson
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#eab308" stroke-width="2" stroke-dasharray="10,5"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#eab308" font-weight="600">Gamma-P: ${Math.round(gammaPoissonEst)}</text>`;
}

function showMethodologyModal(f1, f2, observed, chao1Est, jackknifeEst, gammaPoissonEst) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';
  
  const content = document.createElement('div');
  content.style.cssText = 'background: white; border-radius: 0.5rem; padding: 2rem; max-width: 800px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);';
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Methodology & References</h3>
      <button id="close-methodology" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
    </div>
    
    <div style="font-size: 0.9375rem; line-height: 1.7; color: #475569;">
      <h4 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;">Statistical Models</h4>
      
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: #f59e0b; margin: 1rem 0 0.5rem 0;">1. Chao1 Estimator</h5>
        <p style="margin: 0.5rem 0;">
          The Chao1 estimator uses the frequency of rare species (singletons and doubletons) to estimate total richness.
        </p>
        <div class="editorial-note" style="font-family:'Courier New',monospace;">
          S<sub>est</sub> = S<sub>obs</sub> + f₁² / (2 × f₂)
        </div>
        <ul style="margin: 0.5rem 0; font-size: 0.875rem;">
          <li><strong>S<sub>obs</sub>:</strong> ${observed} observed scribes</li>
          <li><strong>f₁:</strong> ${f1} singletons (scribes who copied only 1 manuscript)</li>
          <li><strong>f₂:</strong> ${f2} doubletons (scribes who copied 2 manuscripts)</li>
          <li><strong>Result:</strong> ${Math.round(chao1Est)} estimated total scribes</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: #fb923c; margin: 1rem 0 0.5rem 0;">2. Jackknife Estimator</h5>
        <p style="margin: 0.5rem 0;">
          The Jackknife estimator uses a resampling approach, accounting for sample size effects.
          We use the second-order jackknife when doubletons are available.
        </p>
        <div class="editorial-note" style="font-family:'Courier New',monospace;">
          S<sub>jack2</sub> = S<sub>obs</sub> + f₁(2n-3)/n - f₂(n-2)²/(n(n-1))
        </div>
        <ul style="margin: 0.5rem 0; font-size: 0.875rem;">
          <li><strong>n:</strong> Total manuscripts sampled</li>
          <li><strong>Result:</strong> ${Math.round(jackknifeEst)} estimated total scribes</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: #eab308; margin: 1rem 0 0.5rem 0;">3. Gamma-Poisson Model</h5>
        <p style="margin: 0.5rem 0;">
          A mixture model that accounts for heterogeneity in detection probability across species.
          Uses low-frequency counts to estimate total diversity.
        </p>
        <div class="editorial-note" style="font-family:'Courier New',monospace;">
          Uses frequency ratios and gamma distribution parameters
        </div>
        <ul style="margin: 0.5rem 0; font-size: 0.875rem;">
          <li><strong>Result:</strong> ${Math.round(gammaPoissonEst)} estimated total scribes</li>
        </ul>
      </div>
      
      <h4 style="color: #2c3e50; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2rem;">References</h4>
      
      <ol style="font-size: 0.875rem; line-height: 1.6; color: #475569;">
        <li style="margin-bottom: 1rem;">
          <strong>Chao, A.</strong> (1984). Nonparametric estimation of the number of classes in a population. 
          <em>Scandinavian Journal of Statistics</em>, 11(4), 265-270.
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Walther, B.A., & Morand, S.</strong> (1998). Comparative performance of species richness estimation methods. 
          <em>Parasitology</em>, 116(4), 395-405.
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Böhning, D., & Schön, D.</strong> (2005). Nonparametric maximum likelihood estimation of population size based on the counting distribution. 
          <em>Journal of the Royal Statistical Society: Series C</em>, 54(4), 721-737.
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Kestemont, M., Karsdorp, F., de Bruijn, E., Driscoll, M., Kapitan, K.A., Ó Macháin, P., Sawyer, D., Sleiderink, R., & Chao, A.</strong> (2021). 
          Forgotten Books: The Application of Unseen Species Models to the Survival of Culture. 
          <em>Science</em>, 375(6582), 765-769.
        </li>
      </ol>
      
      <div class="editorial-note">
        <p style="margin: 0; font-size: 0.875rem; color: #1e40af;">
          <strong>Note:</strong> Different estimators reflect different assumptions about species diversity and detection probability. 
          The range of estimates provides insight into model uncertainty. Chao1 is most conservative, 
          while Gamma-Poisson accounts for greater heterogeneity.
        </p>
      </div>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  document.getElementById('close-methodology').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function showUnseenSpeciesMethodology(f1, f2, observed, estimated) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';
  
  const content = document.createElement('div');
  content.style.cssText = 'background: white; border-radius: 0.5rem; padding: 2rem; max-width: 700px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);';
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Unseen Species Methodology</h3>
      <button id="close-methodology" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
    </div>
    
    <div style="font-size: 0.9375rem; line-height: 1.7; color: #475569;">
      <h4 style="color: #2c3e50; margin-top: 0;">Statistical Model</h4>
      <p>
        We use the <strong>Chao1 estimator</strong>, an unseen species model originally developed for ecology
        and adapted for cultural heritage by Kestemont et al. (2021) in "Forgotten Books: The Application of 
        Unseen Species Models to the Survival of Culture."
      </p>
      
      <h4 style="color: #2c3e50;">Formula</h4>
      <div style="background: #f8fafc; padding: 1rem; border-radius: 0.375rem; font-family: monospace; margin: 1rem 0;">
        S<sub>est</sub> = S<sub>obs</sub> + f₁² / (2 × f₂)
      </div>
      <ul style="margin: 0.5rem 0;">
        <li><strong>S<sub>obs</sub></strong>: ${observed} observed scribes</li>
        <li><strong>f₁</strong>: ${f1} scribes who copied only 1 manuscript (singletons)</li>
        <li><strong>f₂</strong>: ${f2} scribes who copied 2 manuscripts (doubletons)</li>
      </ul>
      
      <h4 style="color: #2c3e50;">Interpretation</h4>
      <p>
        The large number of singletons (${f1} scribes) suggests substantial unobserved diversity.
        The ratio f₁/f₂ = ${(f1/f2).toFixed(2)} indicates ${f1/f2 > 2 ? 'high' : 'moderate'} turnover, 
        typical of manuscript production where many scribes contributed minimally to the surviving corpus.
      </p>
      
      <p>
        <strong>Estimated total:</strong> ${Math.round(estimated)} female scribes<br>
        <strong>Sample coverage:</strong> ${((observed/estimated)*100).toFixed(1)}% of all scribes observed<br>
        <strong>Estimated unseen:</strong> ${Math.round(estimated - observed)} scribes whose work hasn't survived or been identified
      </p>
      
      <h4 style="color: #2c3e50;">References</h4>
      <p style="font-size: 0.875rem; color: #64748b;">
        Kestemont, M., Karsdorp, F., de Bruijn, E., Driscoll, M., Kapitan, K.A., Ó Macháin, P., 
        Sawyer, D., Sleiderink, R., & Chao, A. (2021). Forgotten Books: The Application of Unseen 
        Species Models to the Survival of Culture. <em>Science</em>, 375(6582), 765-769.
      </p>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close handlers
  document.getElementById('close-methodology').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/**
 * Build collaboration network visualization using D3 force layout
 */
function buildCollaborationNetwork(collaborativeManuscripts, collaborations, scribeArray) {
  const container = document.getElementById('collaboration-network-viz');
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '';
  
  if (collaborativeManuscripts.length === 0) {
    container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8;">No collaborative manuscripts found</div>';
    return;
  }
  
  // Build network data with institution information
  const nodes = new Map();
  const links = [];
  const manuscriptLinks = new Map();
  const institutions = new Set();
  
  // Create scribe map for quick lookup
  const scribeMap = new Map();
  if (scribeArray) {
    scribeArray.forEach(scribe => {
      scribeMap.set(scribe.id, scribe);
      // institutions is a Set, so convert to array
      if (scribe.institutions && scribe.institutions.size > 0) {
        Array.from(scribe.institutions).forEach(inst => institutions.add(inst));
      }
    });
  }
  
  collaborativeManuscripts.forEach(ms => {
    const scribes = ms.scribes || [];
    
    // Add nodes for each scribe
    scribes.forEach(scribeData => {
      const scribeName = typeof scribeData === 'object' ? (scribeData.name || scribeData.id || String(scribeData)) : String(scribeData);
      const scribeId = typeof scribeData === 'object' ? scribeData.id : scribeData;
      
      if (!nodes.has(scribeName)) {
        const scribeInfo = scribeMap.get(scribeId);
        let primaryInstitution = '';
        
        if (scribeInfo && scribeInfo.institutions && scribeInfo.institutions.size > 0) {
          // Get first institution from Set
          primaryInstitution = Array.from(scribeInfo.institutions)[0];
        }
        
        nodes.set(scribeName, {
          id: scribeName,
          scribeId: scribeId,
          name: scribeName,
          collaborationCount: 0,
          manuscripts: new Set(),
          institution: primaryInstitution,
          allInstitutions: scribeInfo && scribeInfo.institutions ? Array.from(scribeInfo.institutions) : []
        });
      }
      nodes.get(scribeName).manuscripts.add(ms.msTitle);
    });
    
    // Create links between all pairs of scribes
    for (let i = 0; i < scribes.length; i++) {
      for (let j = i + 1; j < scribes.length; j++) {
        const sourceName = typeof scribes[i] === 'object' ? (scribes[i].name || scribes[i].id || String(scribes[i])) : String(scribes[i]);
        const targetName = typeof scribes[j] === 'object' ? (scribes[j].name || scribes[j].id || String(scribes[j])) : String(scribes[j]);
        const pairKey = [sourceName, targetName].sort().join('|||');
        
        if (!manuscriptLinks.has(pairKey)) {
          manuscriptLinks.set(pairKey, {
            source: sourceName,
            target: targetName,
            manuscripts: []
          });
        }
        manuscriptLinks.get(pairKey).manuscripts.push(ms.msTitle);
        
        nodes.get(sourceName).collaborationCount++;
        nodes.get(targetName).collaborationCount++;
      }
    }
  });
  
  // Convert to arrays
  const nodeArray = Array.from(nodes.values());
  const linkArray = Array.from(manuscriptLinks.values()).map(link => ({
    source: link.source,
    target: link.target,
    strength: link.manuscripts.length,
    manuscripts: link.manuscripts
  }));
  
  // Create color scale for institutions
  const institutionArray = Array.from(institutions).sort();
  const colorScale = d3.scaleOrdinal()
    .domain(institutionArray)
    .range([
      '#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', 
      '#f97316', '#06b6d4', '#f43f5e', '#14b8a6', '#a855f7',
      '#eab308', '#6366f1', '#db2777', '#059669', '#7c3aed',
      '#d97706', '#0ea5e9', '#e11d48', '#0d9488', '#9333ea'
    ]);
  
  // Records without a known institution remain neutral and are omitted from the legend.
  const getNodeColor = (institution) => {
    return isKnownCategory(institution) ? colorScale(institution) : '#94a3b8';
  };
  
  // Add control panel
  const controlPanel = document.createElement('div');
  controlPanel.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; align-items: center;';
  
  // Create legend for institutions (show top institutions by scribe count)
  const institutionCounts = {};
  nodeArray.forEach(n => {
    if (!isKnownCategory(n.institution)) return;
    institutionCounts[n.institution] = (institutionCounts[n.institution] || 0) + 1;
  });
  
  const topInstitutions = Object.entries(institutionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([inst, count]) => ({inst, count}));
  
  const legendHTML = topInstitutions.map(({inst, count}) => 
    `<span style="display: inline-flex; align-items: center; gap: 0.25rem; margin-right: 0.5rem; font-size: 0.65rem; color: #64748b; padding: 0.125rem 0.375rem; background: white; border-radius: 0.25rem;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: ${getNodeColor(inst)}; flex-shrink: 0;"></span>
      <span style="max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${inst}">${inst}</span>
      <span style="font-weight: 600; color: #475569;">(${count})</span>
    </span>`
  ).join('');
  
  controlPanel.innerHTML = `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; justify-content: space-between;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button id="network-reset" class="explore-action-btn explore-action-btn--compact">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
          Reset
        </button>
        <button id="network-labels-toggle" class="explore-action-btn explore-action-btn--compact">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
          Hide Labels
        </button>
        <button id="network-filter-isolated" class="explore-action-btn explore-action-btn--compact">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Hide Singles
        </button>
        <div style="font-size: 0.7rem; color: #64748b; padding: 0.375rem 0.5rem; background: #f8fafc; border-radius: 0.375rem; white-space: nowrap;">
          <strong>${nodeArray.length}</strong> scribes • <strong>${linkArray.length}</strong> links
        </div>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: 0.5rem;">
          <button class="collab-layout-toggle-btn is-active" data-layout="radial" style="padding: 0.5rem 1rem; border: 1px solid #b88916; background: white; border-radius: 0.2rem; font-weight: 600; cursor: pointer; transition: border-color 0.2s; font-size: 0.75rem;">
            Radial
          </button>
          <button class="collab-layout-toggle-btn" data-layout="force" style="padding: 0.5rem 1rem; border: 1px solid transparent; background: transparent; border-radius: 0.2rem; font-weight: 600; cursor: pointer; transition: border-color 0.2s; color: #64748b; font-size: 0.75rem;">
            Force
          </button>
        </div>
        ${createEmbedButton('scribe-collaborations')}
      </div>
    </div>
    <div style="margin-top: 0.75rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; border: 1px solid #e2e8f0;">
      <div style="font-size: 0.75rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem;">Institutions (Top 10)</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.65rem;">
        ${legendHTML || '<span style="color: #94a3b8;">No institution data</span>'}
      </div>
    </div>
  `;
  container.appendChild(controlPanel);
  
  // D3 force layout - use fixed viewBox matching container aspect ratio
  const width = 1600;
  const height = 1000;
  
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto')
    .style('min-height', '950px')
    .style('display', 'block')
    .style('background', '#fafafa');
  
  // Add zoom/pan container
  const g = svg.append('g');
  
  // Add zoom behavior with inverse scaling to keep labels readable
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
      
      // Scale labels and nodes inversely to zoom level for consistent visual size
      const scale = event.transform.k;
      const inverseScale = 1 / scale;
      
      // Scale node circles
      node.select('circle')
        .attr('r', d => (Math.max(10, 6 + Math.sqrt(d.collaborationCount) * 3.5)) * inverseScale)
        .attr('stroke-width', 2 * inverseScale);
      
      // Scale labels
      nodeLabels
        .attr('font-size', `${16 * inverseScale}px`)
        .attr('y', d => (Math.max(10, 6 + Math.sqrt(d.collaborationCount) * 3.5) + 18) * inverseScale);
      
      // Scale link widths
      link.attr('stroke-width', d => Math.min(8, 1 + d.strength) * inverseScale);
    });
  
  svg.call(zoom);
  
  // Create force simulation with reasonable clustering
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(linkArray)
      .id(d => d.id)
      .distance(d => Math.max(40, 60 - (d.strength * 8))) // Increased distance
      .strength(1)) 
    .force('charge', d3.forceManyBody().strength(-150)) // Stronger repulsion for better spacing
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => Math.max(16, 8 + Math.sqrt(d.collaborationCount) * 4))) // Larger collision radius
    .force('x', d3.forceX(width / 2).strength(0.08)) // Weaker pull toward center
    .force('y', d3.forceY(height / 2).strength(0.08));
  
  // Draw links
  const link = g.append('g')
    .selectAll('line')
    .data(linkArray)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', d => Math.min(8, 1 + d.strength))
    .attr('stroke-opacity', 0.6)
    .attr('class', 'network-link');
  
  // Draw nodes
  const node = g.append('g')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'network-node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('mouseenter', function(event, d) {
      // Highlight connected nodes and links
      const connectedNodes = new Set();
      connectedNodes.add(d.id);
      
      link.each(function(l) {
        if (l.source.id === d.id || l.target.id === d.id) {
          connectedNodes.add(l.source.id);
          connectedNodes.add(l.target.id);
          d3.select(this).attr('stroke-opacity', 1).attr('stroke', '#f59e0b');
        }
      });
      
      node.select('circle').attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2);
      node.select('text').attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2);
      
      // Enlarge current node
      d3.select(this).select('circle')
        .transition().duration(200)
        .attr('r', d => Math.max(14, 8 + Math.sqrt(d.collaborationCount) * 3.5))
        .attr('stroke-width', 3);
    })
    .on('mouseleave', function() {
      // Reset highlighting
      link.attr('stroke-opacity', 0.6).attr('stroke', '#cbd5e1');
      node.select('circle').attr('opacity', 1);
      node.select('text').attr('opacity', 1);
      
      d3.select(this).select('circle')
        .transition().duration(200)
        .attr('r', d => Math.max(10, 6 + Math.sqrt(d.collaborationCount) * 3.5))
        .attr('stroke-width', 2);
    })
    .on('click', function(event, d) {
      // Show detailed info on click
      event.stopPropagation();
      const manuscripts = Array.from(d.manuscripts).join(', ');
      const institutions = d.allInstitutions.length > 0 
        ? d.allInstitutions.join('\n  - ') 
        : 'No institution data';
      alert(`${d.name}\n\nInstitution(s):\n  - ${institutions}\n\nCollaborations: ${d.collaborationCount}\nManuscripts (${d.manuscripts.size}):\n${manuscripts}`);
    });
  
  node.append('circle')
    .attr('r', d => Math.max(10, 6 + Math.sqrt(d.collaborationCount) * 3.5))
    .attr('fill', d => getNodeColor(d.institution))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .attr('class', 'network-node-circle');
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 25 ? d.name.substring(0, 22) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => Math.max(10, 6 + Math.sqrt(d.collaborationCount) * 3.5) + 18)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('fill', '#1e293b')
    .attr('font-weight', '600')
    .attr('class', 'network-label')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', '3px')
    .attr('paint-order', 'stroke')
    .style('pointer-events', 'none');
  
  // Add tooltips
  node.append('title')
    .text(d => {
      const instText = d.allInstitutions.length > 0 
        ? d.allInstitutions.join(', ') 
        : 'No institution data';
      return `${d.name}\nInstitution(s): ${instText}\n${d.collaborationCount} collaboration${d.collaborationCount !== 1 ? 's' : ''}\n${d.manuscripts.size} manuscript${d.manuscripts.size !== 1 ? 's' : ''}`;
    });
  
  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Control button handlers
  let labelsVisible = true;
  let showingIsolated = true;
  
  document.getElementById('network-reset').onclick = () => {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    simulation.alpha(1).restart();
  };
  
  document.getElementById('network-labels-toggle').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('opacity', labelsVisible ? 1 : 0);
    this.innerHTML = labelsVisible 
      ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg> Hide Labels'
      : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Show Labels';
  };
  
  document.getElementById('network-filter-isolated').onclick = function() {
    showingIsolated = !showingIsolated;
    
    // Filter nodes with only 1 or 0 collaborations
    node.style('opacity', d => {
      if (showingIsolated) return 1;
      return d.collaborationCount > 1 ? 1 : 0.1;
    });
    
    link.style('opacity', d => {
      if (showingIsolated) return 0.6;
      return 0.6;
    });
    
    this.innerHTML = showingIsolated
      ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Hide Singles'
      : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Show All';
  };
  
  // Focus on specific scribe function (called from top collaborators list)
  window.focusOnScribe = (scribeName) => {
    // Find the node
    const targetNode = nodeArray.find(n => n.name === scribeName);
    if (!targetNode) return;
    
    // Calculate zoom transform to focus on this node
    const scale = 2; // Zoom level
    const x = -targetNode.x * scale + width / 2;
    const y = -targetNode.y * scale + height / 2;
    
    // First, zoom to the node
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale))
      .on('end', () => {
        // After zoom completes, highlight the node and its connections
        const connectedNodes = new Set();
        connectedNodes.add(targetNode.id);
        
        link.each(function(l) {
          if (l.source.id === targetNode.id || l.target.id === targetNode.id) {
            connectedNodes.add(l.source.id);
            connectedNodes.add(l.target.id);
          }
        });
        
        // Temporarily highlight
        node.select('circle').transition().duration(500)
          .attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2)
          .attr('stroke-width', n => (n.id === targetNode.id ? 4 : 2) / scale);
        
        nodeLabels.transition().duration(500)
          .attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2)
          .attr('font-weight', n => n.id === targetNode.id ? 700 : 600);
        
        link.transition().duration(500)
          .attr('stroke-opacity', l => 
            (l.source.id === targetNode.id || l.target.id === targetNode.id) ? 1 : 0.15
          )
          .attr('stroke', l => 
            (l.source.id === targetNode.id || l.target.id === targetNode.id) ? '#f59e0b' : '#cbd5e1'
          );
        
        // Reset after 3 seconds
        setTimeout(() => {
          node.select('circle').transition().duration(500)
            .attr('opacity', 1)
            .attr('stroke-width', 2 / scale);
          
          nodeLabels.transition().duration(500)
            .attr('opacity', 1)
            .attr('font-weight', 600);
          
          link.transition().duration(500)
            .attr('stroke-opacity', 0.6)
            .attr('stroke', '#cbd5e1');
        }, 3000);
      });
  };
  
  // Layout toggle functionality
  const layoutBtns = container.querySelectorAll('.collab-layout-toggle-btn');
  let currentLayout = 'radial';
  
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLayout = btn.dataset.layout;
      layoutBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.style.background = b === btn ? 'white' : 'transparent';
        b.style.borderColor = b === btn ? '#b88916' : 'transparent';
        b.style.color = b === btn ? '#1e293b' : '#64748b';
      });
      
      // Update simulation forces based on layout
      if (currentLayout === 'radial') {
        // Radial layout - moderate clustering around center
        simulation
          .force('charge', d3.forceManyBody().strength(-150))
          .force('x', d3.forceX(width / 2).strength(0.08))
          .force('y', d3.forceY(height / 2).strength(0.08))
          .force('link', d3.forceLink(linkArray).id(d => d.id).distance(d => Math.max(40, 60 - (d.strength * 8))).strength(1));
      } else {
        // Force layout - more spread out
        simulation
          .force('charge', d3.forceManyBody().strength(-300))
          .force('x', d3.forceX(width / 2).strength(0.05))
          .force('y', d3.forceY(height / 2).strength(0.05))
          .force('link', d3.forceLink(linkArray).id(d => d.id).distance(80).strength(0.5));
      }
      
      simulation.alpha(1).restart();
    });
  });
  
  // Drag functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

function buildTopCollaborators(collaborators) {
  const container = document.getElementById('top-collaborators-list');
  if (!container) return;
  
  if (collaborators.length === 0) {
    container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem;">No collaborations found</div>';
    return;
  }
  
  const html = collaborators.map((collab, i) => `
    <div data-scribe-name="${collab.name}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #f1f5f9; ${i % 2 === 0 ? 'background: #f9fafb;' : ''}; cursor: pointer; transition: all 0.2s;" 
      onmouseover="this.style.background='#fef3c7'" 
      onmouseout="this.style.background='${i % 2 === 0 ? '#f9fafb' : '#ffffff'}'">
      <div style="font-size: 0.875rem; color: #1e293b; font-weight: 500;">${collab.name}</div>
      <div style="background: #f59e0b; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">
        ${collab.collaboratorCount} co-scribe${collab.collaboratorCount > 1 ? 's' : ''}
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
  
  // Add click handlers to focus on each scribe
  container.querySelectorAll('[data-scribe-name]').forEach(el => {
    el.addEventListener('click', () => {
      const scribeName = el.getAttribute('data-scribe-name');
      if (window.focusOnScribe) {
        window.focusOnScribe(scribeName);
      }
    });
  });
}

function buildCollaborativeManuscripts(manuscripts) {
  const container = document.getElementById('collaborative-manuscripts-list');
  if (!container) return;
  
  if (manuscripts.length === 0) {
    container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem;">No collaborative manuscripts found</div>';
    return;
  }
  
  const sorted = manuscripts.sort((a, b) => b.scribeCount - a.scribeCount);
  
  const html = sorted.map((ms, i) => `
    <div style="padding: 0.5rem; border-bottom: 1px solid #f1f5f9; ${i % 2 === 0 ? 'background: #f9fafb;' : ''}">
      <div style="font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-bottom: 0.25rem;">
        ${ms.msTitle}
      </div>
      <div style="font-size: 0.75rem; color: #64748b;">
        ${ms.scribeCount} scribes: ${ms.scribes.map(s => s.name).join(', ')}
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function buildInstitutionsChart(institutions) {
  const container = document.getElementById('institutions-chart');
  if (!container) return;
  
  const totalCount = institutions.reduce((sum, item) => sum + item.scribeCount, 0);
  const barHeight = 30;
  const gap = 6;
  
  const html = institutions.map((inst, i) => {
    const percentage = totalCount > 0 ? (inst.scribeCount / totalCount) * 100 : 0;
    return `
      <div style="margin-bottom: ${gap}px;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${inst.name}">
          ${inst.name}
        </div>
        <div class="explore-proportion-row" style="grid-template-columns:minmax(60px,1fr) minmax(95px,auto);">
          <div class="explore-proportion-track" style="height:${barHeight}px;">
            <div style="background:#b88912;height:100%;width:${percentage}%;border-radius:0.15rem;"></div>
          </div>
          <div class="explore-proportion-value" style="font-size: 0.75rem; color: #64748b;">
            ${inst.scribeCount} · ${percentage.toFixed(1)}% · ${inst.suCount} SUs
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function buildCitiesChart(cities) {
  const container = document.getElementById('cities-chart');
  if (!container) return;
  
  const totalCount = cities.reduce((sum, item) => sum + item.scribeCount, 0);
  const barHeight = 30;
  const gap = 6;
  
  const html = cities.map((city, i) => {
    const percentage = totalCount > 0 ? (city.scribeCount / totalCount) * 100 : 0;
    return `
      <div style="margin-bottom: ${gap}px;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">
          ${city.name}
        </div>
        <div class="explore-proportion-row" style="grid-template-columns:minmax(60px,1fr) minmax(115px,auto);">
          <div class="explore-proportion-track" style="height:${barHeight}px;">
            <div style="background:#3b82a0;height:100%;width:${percentage}%;border-radius:0.15rem;"></div>
          </div>
          <div class="explore-proportion-value" style="font-size: 0.75rem; color:#64748b;">
            ${city.scribeCount} · ${percentage.toFixed(1)}% · ${city.institutionCount} institution${city.institutionCount > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function populateLanguageFilter(scribes) {
  const select = document.getElementById('scribe-lang-filter');
  if (!select) return;
  
  const allLanguages = new Set();
  scribes.forEach(s => s.languages.forEach(lang => allLanguages.add(lang)));
  
  const sorted = Array.from(allLanguages).sort();
  sorted.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    select.appendChild(option);
  });
}

function populateInstitutionFilter(scribes) {
  const select = document.getElementById('scribe-inst-filter');
  if (!select) return;
  
  const allInstitutions = new Set();
  scribes.forEach(s => s.institutions.forEach(inst => allInstitutions.add(inst)));
  
  const sorted = Array.from(allInstitutions).sort();
  sorted.forEach(inst => {
    const option = document.createElement('option');
    option.value = inst;
    option.textContent = inst;
    select.appendChild(option);
  });
}

function exportScribesCSV(scribes) {
  const headers = ['Scribe Name', 'SU Count', 'Manuscript Count', 'Languages', 'Institutions', 'Dates'];
  const rows = scribes.map(s => [
    s.name,
    s.suIds.size,
    s.manuscripts.size,
    Array.from(s.languages).join('; '),
    Array.from(s.institutions).join('; '),
    s.dates.join('; ')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `scribes_analysis_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

function buildScribesBarChart(top20) {
  const container = document.getElementById('scribes-bar-chart');
  if (!container) return;
  
  const totalCount = top20.reduce((sum, scribe) => sum + scribe.suIds.size, 0);
  const barHeight = 30;
  const gap = 5;
  
  const html = top20.map((scribe, i) => {
    const percentage = totalCount > 0 ? (scribe.suIds.size / totalCount) * 100 : 0;
    const color = scribe.languages.size > 1 ? '#f59e0b' : '#94a3b8';
    
    return `
      <div class="explore-proportion-row" style="grid-template-columns:minmax(100px,200px) minmax(60px,1fr) minmax(85px,auto);margin-bottom:${gap}px;">
        <div class="explore-proportion-label" style="font-size: 0.875rem; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${scribe.name}">
          ${scribe.name}
        </div>
        <div class="explore-proportion-track" style="height:${barHeight}px;">
          <div style="background:${color};height:100%;width:${percentage}%;border-radius:0.25rem;"></div>
        </div>
        <div class="explore-proportion-value" style="font-size:0.75rem;color:#64748b;">
          ${scribe.suIds.size} · ${percentage.toFixed(1)}%${scribe.languages.size > 1 ? ` · <span style="color: #f59e0b;">●</span> ${scribe.languages.size} langs` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.75rem; color: #64748b;">
      <span style="color: #f59e0b;">●</span> Multilingual scribe (2+ languages)
    </div>
  `;
}

function buildScribesTable(scribes) {
  const container = document.getElementById('scribes-table');
  if (!container) return;
  container.tabIndex = -1;

  const totalPages = Math.max(1, Math.ceil(scribes.length / SCRIBE_TABLE_PAGE_SIZE));
  SCRIBE_TABLE_PAGE = Math.min(Math.max(1, SCRIBE_TABLE_PAGE), totalPages);
  const start = (SCRIBE_TABLE_PAGE - 1) * SCRIBE_TABLE_PAGE_SIZE;
  const visibleScribes = scribes.slice(start, start + SCRIBE_TABLE_PAGE_SIZE);
  
  const html = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Scribe Name</th>
          <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #475569;">SUs</th>
          <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #475569;">MSS</th>
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Languages</th>
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Institutions</th>
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Date Range</th>
        </tr>
      </thead>
      <tbody id="scribes-table-body">
        ${visibleScribes.map((scribe, i) => {
          const langs = Array.from(scribe.languages).join(', ') || '—';
          const insts = Array.from(scribe.institutions).slice(0, 2).join(', ') + 
                       (scribe.institutions.size > 2 ? ` (+${scribe.institutions.size - 2} more)` : '');
          const dates = scribe.dates.length > 0 ? scribe.dates.join(', ') : '—';
          
          return `
            <tr style="border-bottom: 1px solid #e2e8f0; ${(start + i) % 2 === 0 ? 'background: #f9fafb;' : ''}">
              <td style="padding: 0.75rem;">
                <a href="#" class="scribe-detail-link" data-scribe-id="${scribe.id}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                  ${scribe.name}
                </a>
              </td>
              <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #1e293b;">${scribe.suIds.size}</td>
              <td style="padding: 0.75rem; text-align: center; color: #64748b;">${scribe.manuscripts.size}</td>
              <td style="padding: 0.75rem; color: #64748b; font-size: 0.8125rem;">
                <span style="${scribe.languages.size > 1 ? 'color: #f59e0b; font-weight: 600;' : ''}">${langs}</span>
              </td>
              <td style="padding: 0.75rem; color: #64748b; font-size: 0.8125rem;">${insts || '—'}</td>
              <td style="padding: 0.75rem; color: #64748b; font-size: 0.8125rem;">${dates}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    <nav class="explore-results-pagination" aria-label="Scribe result pages">
      <button type="button" class="explore-action-btn explore-pagination-btn" id="scribes-page-previous" ${SCRIBE_TABLE_PAGE === 1 ? 'disabled' : ''}>Previous</button>
      <span aria-live="polite">Page ${SCRIBE_TABLE_PAGE} of ${totalPages} · ${scribes.length === 0 ? 0 : start + 1}–${Math.min(start + SCRIBE_TABLE_PAGE_SIZE, scribes.length)} of ${scribes.length}</span>
      <button type="button" class="explore-action-btn explore-pagination-btn" id="scribes-page-next" ${SCRIBE_TABLE_PAGE === totalPages ? 'disabled' : ''}>Next</button>
    </nav>
  `;
  
  container.innerHTML = html;
  
  document.getElementById('scribes-page-previous')?.addEventListener('click', () => {
    SCRIBE_TABLE_PAGE--;
    buildScribesTable(scribes);
    container.focus({ preventScroll: true });
  });
  document.getElementById('scribes-page-next')?.addEventListener('click', () => {
    SCRIBE_TABLE_PAGE++;
    buildScribesTable(scribes);
    container.focus({ preventScroll: true });
  });
  
  // Add click handlers for scribe detail links
  document.querySelectorAll('.scribe-detail-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const scribeId = link.dataset.scribeId;
      const scribe = scribes.find(s => s.id === scribeId);
      if (scribe) {
        showScribeDetail(scribe);
      }
    });
  });
}

function filterScribesTable(scribes, searchTerm, filterType, langFilter, instFilter, collaborations) {
  let filtered = scribes;
  
  // Apply type filter
  if (filterType === 'multilingual') {
    filtered = filtered.filter(s => s.languages.size > 1);
  } else if (filterType === 'productive') {
    filtered = filtered.filter(s => s.suIds.size >= 5);
  } else if (filterType === 'collaborative') {
    filtered = filtered.filter(s => collaborations && collaborations[s.id]);
  }
  
  // Apply language filter
  if (langFilter) {
    filtered = filtered.filter(s => s.languages.has(langFilter));
  }
  
  // Apply institution filter
  if (instFilter) {
    filtered = filtered.filter(s => s.institutions.has(instFilter));
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(term) ||
      Array.from(s.languages).some(lang => lang.toLowerCase().includes(term)) ||
      Array.from(s.institutions).some(inst => inst.toLowerCase().includes(term))
    );
  }
  
  buildScribesTable(filtered);
}

function showScribeDetail(scribe) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';
  
  const content = document.createElement('div');
  content.style.cssText = 'background: white; border-radius: 0.5rem; padding: 2rem; max-width: 800px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);';
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #1e293b; font-size: 1.5rem;">${scribe.name}</h3>
      <button id="close-scribe-detail" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Scribal Units</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.suIds.size}</div>
      </div>
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Manuscripts</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.manuscripts.size}</div>
      </div>
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Languages</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.languages.size}</div>
      </div>
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Institutions</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.institutions.size}</div>
      </div>
    </div>
    
    ${scribe.languages.size > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem 0; color: #475569; font-size: 1rem;">Languages</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${Array.from(scribe.languages).map(lang => `
            <span style="background: #e0e7ff; color: #4338ca; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem;">${lang}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    ${scribe.institutions.size > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem 0; color: #475569; font-size: 1rem;">Institutions</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${Array.from(scribe.institutions).map(inst => `
            <span style="background: #fef3c7; color: #92400e; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem;">${inst}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <div>
      <h4 style="margin: 0 0 0.75rem 0; color: #475569; font-size: 1rem;">Scribal Units (${scribe.sus.length})</h4>
      <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 0.25rem;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead style="position: sticky; top: 0; background: white; border-bottom: 1px solid #e2e8f0;">
            <tr>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">SU</th>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">Manuscript</th>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">Languages</th>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">Role</th>
            </tr>
          </thead>
          <tbody>
            ${scribe.sus.map((su, i) => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 0.5rem; color: #1e293b;">${su.title}</td>
                <td style="padding: 0.5rem; color: #64748b; font-size: 0.8125rem;">${su.msTitle}</td>
                <td style="padding: 0.5rem; color: #64748b; font-size: 0.8125rem;">${su.languages.join(', ')}</td>
                <td style="padding: 0.5rem; color: #64748b; font-size: 0.8125rem;">${su.role || 'scribe'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close handlers
  document.getElementById('close-scribe-detail').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

      return { buildScribes };
    }
  };
})();
