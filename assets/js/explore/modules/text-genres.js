window.ExploreTextGenres = (function() {
  return {
    init: function(Core) {
      const getDATA = () => Core.DATA;
      const getIDX = () => Core.IDX;
      const getActiveEntity = () => Core.activeEntity;
      const getREL_INDEX = () => Core.REL_INDEX;
      const getREC_TYPE_TO_ENTITY = () => Core.REC_TYPE_TO_ENTITY;
      const getINBOUND = () => Core.INBOUND;
      const MAP = Core.MAP;
      const isKnownCategory = Core.isKnownCategory;
      
      const {
        val, getVal, getDetail, getRes, getDetailsAll, getValsAll, getControlledValsAll, esc,
        $panes, $tabs, formatYear,
      } = Core;

      function getInstitutionsForPU(pu) {
        const institutions = [];
        const puId = String(pu.rec_ID);

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

        const rels = [
          ...((Core.REL_INDEX || {}).bySource?.[puId] || []),
          ...((Core.REL_INDEX || {}).byTarget?.[puId] || [])
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

          if (!hpId) continue;

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

        return scribes;
      }

/* =========================================
   TEXT GENRES ANALYSIS MODULE
   ========================================= */

let CURRENT_TEXT_GENRE_TAB = 'overview';
const activeNetworkDisposers = new Map();

function disposeNetwork(kind) {
  const dispose = activeNetworkDisposers.get(kind);
  if (dispose) dispose();
  activeNetworkDisposers.delete(kind);
}

function registerNetworkDisposer(kind, dispose) {
  disposeNetwork(kind);
  activeNetworkDisposers.set(kind, dispose);
}

function disposeAllNetworks() {
  [...activeNetworkDisposers.keys()].forEach(disposeNetwork);
}

function buildTextGenres() {
  const mount = document.getElementById('text-genres-mount');
  if (!mount) {
    return;
  }
  
  // The outer module shell is defined in the shared Explore markup.
  mount.innerHTML = `
    <div class="genre-tabs explore-module-tabs">
      <button type="button" class="genre-tab-btn${CURRENT_TEXT_GENRE_TAB === 'overview' ? ' is-on' : ''}" data-tab="overview">Overview</button>
      <button type="button" class="genre-tab-btn${CURRENT_TEXT_GENRE_TAB === 'manuscript-networks' ? ' is-on' : ''}" data-tab="manuscript-networks">Manuscript Networks</button>
      <button type="button" class="genre-tab-btn${CURRENT_TEXT_GENRE_TAB === 'institution-networks' ? ' is-on' : ''}" data-tab="institution-networks">Institution Networks</button>
      <button type="button" class="genre-tab-btn${CURRENT_TEXT_GENRE_TAB === 'scribe-networks' ? ' is-on' : ''}" data-tab="scribe-networks">Scribe Networks</button>
      <button type="button" class="genre-tab-btn${CURRENT_TEXT_GENRE_TAB === 'distributions' ? ' is-on' : ''}" data-tab="distributions">Distributions</button>
    </div>
    <div id="genre-tab-content" class="explore-module-body" style="overflow: auto; min-height: 60vh;">
      <!-- Content will be rendered here -->
    </div>
  `;
  
  // Tab switching
  const tabBtns = mount.querySelectorAll('.genre-tab-btn');
  const contentArea = mount.querySelector('#genre-tab-content');
  const tabList = mount.querySelector('.genre-tabs');
  Core.enhanceExploreTabList(tabList, contentArea);
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      CURRENT_TEXT_GENRE_TAB = tab;
      tabBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('is-on', isActive);
      });
      Core.syncExploreTabList(tabList, btn, contentArea);
      Core.updateExploreUrl('text-genres', tab);
      renderGenreTab(tab, contentArea);
    });
  });
  
  // Render initial tab
  renderGenreTab(CURRENT_TEXT_GENRE_TAB, contentArea);
}

function renderGenreTab(tab, container) {
  disposeAllNetworks();
  if (tab === 'overview') renderGenreOverview(container);
  else if (tab === 'manuscript-networks') renderManuscriptNetworks(container);
  else if (tab === 'institution-networks') renderInstitutionNetworks(container);
  else if (tab === 'scribe-networks') renderScribeNetworks(container);
  else if (tab === 'distributions') renderGenreDistributions(container);
}

function renderGenreOverview(container) {
  container.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Text Subgenre Analysis</h2>
      
      <div class="explore-metric-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div class="explore-metric-card">
          <h3 style="margin: 0 0 0.5rem 0; color: #92400e; font-size: 1.125rem;">Total Texts</h3>
          <div id="total-texts" style="font-size: 2.5rem; font-weight: 700; color: #92400e;">Loading...</div>
        </div>
        <div class="explore-metric-card">
          <h3 style="margin: 0 0 0.5rem 0; color: #1e40af; font-size: 1.125rem;">Texts with Known Subgenre</h3>
          <div id="texts-with-subgenre" style="font-size: 2.5rem; font-weight: 700; color: #1e40af;">Loading...</div>
        </div>
        <div class="explore-metric-card">
          <h3 style="margin: 0 0 0.5rem 0; color: #166534; font-size: 1.125rem;">Unique Subgenres</h3>
          <div id="total-subgenres" style="font-size: 2.5rem; font-weight: 700; color: #166534;">Loading...</div>
        </div>
      </div>
      
      <div class="explore-chart-grid explore-chart-grid--stacked" style="margin-bottom: 1.5rem;">
        <div id="top-subgenres-chart-wrapper" class="explore-visualization-card">
          <div class="explore-viz-card-header">
            <h3 style="margin: 0 0 0.25rem 0; color: #2c3e50; font-size: 1.25rem;">Top Subgenres by Text Count</h3>
            ${createExportButton('top-subgenres-chart-wrapper', 'top-text-subgenres.png')}
          </div>
          <p style="margin: 0 0 1rem; color: #64748b; font-size: 0.75rem;">Bar length shows the share of known subgenre assignments.</p>
          <div id="top-subgenres-chart"></div>
        </div>
      </div>
    </div>
  `;
  
  // Calculate statistics
  const allTexts = (getDATA() || {}).tx || [];
  const subgenreCounts = {};
  let textsWithSubgenre = 0;
  
  allTexts.forEach(text => {
    const subgenres = getKnownValues(text, 'Subgenre');
    if (subgenres.length) {
      textsWithSubgenre += 1;
      subgenres.forEach(subgenre => {
        subgenreCounts[subgenre] = (subgenreCounts[subgenre] || 0) + 1;
      });
    }
  });
  
  const totalTextsEl = document.getElementById('total-texts');
  const textsWithSubgenreEl = document.getElementById('texts-with-subgenre');
  const totalSubgenresEl = document.getElementById('total-subgenres');
  
  if (totalTextsEl) totalTextsEl.textContent = allTexts.length;
  if (textsWithSubgenreEl) textsWithSubgenreEl.textContent = textsWithSubgenre;
  if (totalSubgenresEl) totalSubgenresEl.textContent = Object.keys(subgenreCounts).length;
  
  // Top subgenres chart
  const topSubgenres = Object.entries(subgenreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  const totalSubgenreAssignments = Object.values(subgenreCounts).reduce((sum, count) => sum + count, 0);
  const subgenreChartHTML = topSubgenres.map(([subgenre, count]) => {
    const percentage = totalSubgenreAssignments > 0 ? (count / totalSubgenreAssignments) * 100 : 0;
    return `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
        <div style="width: 180px; font-size: 0.875rem; color: #64748b; font-weight: 500; text-align: right;">
          ${subgenre.length > 25 ? subgenre.substring(0, 22) + '...' : subgenre}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display:flex;justify-content:flex-end;margin-bottom:0.2rem;color:#64748b;font-size:0.75rem;">${count} · ${percentage.toFixed(1)}%</div>
          <div style="height: 28px; background:#f1f5f9; border-radius:0.25rem; overflow:hidden;">
            <div style="background:${subgenreColor(subgenre)}; height: 100%; width: ${percentage}%;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  const topSubgenresChartEl = document.getElementById('top-subgenres-chart');
  if (topSubgenresChartEl) topSubgenresChartEl.innerHTML = subgenreChartHTML;
}

function syncNetworkToggle(buttons, activeButton) {
  buttons.forEach(button => {
    const isActive = button === activeButton;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function renderNetworkTooltip(tooltip, title, rows, flags = {}) {
  tooltip.replaceChildren();

  const heading = document.createElement('div');
  heading.style.cssText = 'font-weight:700;color:#1e293b;margin-bottom:.5rem;';
  heading.textContent = title;
  tooltip.appendChild(heading);

  const details = document.createElement('div');
  details.style.cssText = 'color:#64748b;line-height:1.5;';
  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.textContent = `${label}: ${value}`;
    details.appendChild(row);
  });

  if (flags.isBridge) {
    const bridge = document.createElement('div');
    bridge.style.cssText = 'color:#dc2626;margin-top:.25rem;';
    bridge.textContent = 'Bridge';
    details.appendChild(bridge);
  }
  if (flags.isHub) {
    const hub = document.createElement('div');
    hub.style.cssText = 'color:#f59e0b;margin-top:.25rem;';
    hub.textContent = 'Hub';
    details.appendChild(hub);
  }

  tooltip.appendChild(details);
}

function renderBipartiteNetworkTab(container, config) {
  container.innerHTML = `
    <div class="text-network-tab">
      <div class="text-network-toolbar">
        <h2>${config.title}</h2>
        <div class="network-toggle-groups">
          <div class="network-toggle-group" role="group" aria-label="Classification level">
            <button type="button" class="network-mode-btn is-active" data-mode="genre" aria-pressed="true">Genres</button>
            <button type="button" class="network-mode-btn" data-mode="subgenre" aria-pressed="false">Subgenres</button>
          </div>
          <div class="network-toggle-group" role="group" aria-label="Network layout">
            <button type="button" class="layout-toggle-btn is-active" data-layout="horizontal" aria-pressed="true">Horizontal</button>
            <button type="button" class="layout-toggle-btn" data-layout="radial" aria-pressed="false">Radial</button>
          </div>
        </div>
      </div>
      <p class="text-network-description">${config.description}</p>
      <div class="text-network-card" id="${config.wrapperId}">
        <div class="text-network-viz" id="${config.vizId}"></div>
      </div>
    </div>
  `;

  const modeBtns = container.querySelectorAll('.network-mode-btn');
  const layoutBtns = container.querySelectorAll('.layout-toggle-btn');
  let currentMode = 'genre';
  let currentLayout = 'horizontal';

  function rebuildNetwork() {
    setTimeout(() => config.build(currentMode, currentLayout), 0);
  }

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      syncNetworkToggle(modeBtns, btn);
      const label = currentMode === 'genre' ? 'genres' : 'subgenres';
      container.querySelectorAll('[data-network-level]').forEach(element => {
        element.textContent = label;
      });
      rebuildNetwork();
    });
  });

  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLayout = btn.dataset.layout;
      syncNetworkToggle(layoutBtns, btn);
      rebuildNetwork();
    });
  });

  rebuildNetwork();
}

function renderManuscriptNetworks(container) {
  renderBipartiteNetworkTab(container, {
    title: 'Manuscript Networks',
    description: 'This network shows which manuscripts contain which <span data-network-level>genres</span>. Manuscripts are on the left (blue), with <span data-network-level>genres</span> on the right (colored by category). Edge thickness indicates frequency and helps reveal co-occurrence patterns.',
    wrapperId: 'ms-network-wrapper',
    vizId: 'ms-network-viz',
    build: buildManuscriptNetwork
  });
}

function renderInstitutionNetworks(container) {
  renderBipartiteNetworkTab(container, {
    title: 'Institution Networks',
    description: 'This network connects monastic institutions to the <span data-network-level>genres</span> they produced or preserved. Node size reflects activity level and can reveal institutional specializations across monasteries.',
    wrapperId: 'inst-network-wrapper',
    vizId: 'inst-network-viz',
    build: buildInstitutionNetwork
  });
}

function renderScribeNetworks(container) {
  renderBipartiteNetworkTab(container, {
    title: 'Scribe Networks',
    description: 'This network shows which scribes actively copied which <span data-network-level>genres</span>. Scribes are on the left (green), with <span data-network-level>genres</span> on the right (colored by category). Bridges indicate diverse repertoires; hubs indicate specialist scribes or popular <span data-network-level>genres</span>.',
    wrapperId: 'scribe-network-wrapper',
    vizId: 'scribe-network-viz',
    build: buildScribeNetwork
  });
}

function renderGenreDistributions(container) {
  container.innerHTML = `
    <div style="max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Subgenre Distribution Analysis</h2>
      
      <div class="explore-chart-grid explore-chart-grid--stacked" style="margin-bottom: 1.5rem;">
        <div id="genres-by-institution-wrapper" class="explore-visualization-card">
          <div class="explore-viz-card-header" style="margin-bottom:1rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.125rem;">Subgenres by Institution</h3>
            ${createExportButton('genres-by-institution-wrapper', 'subgenres-by-institution.png')}
          </div>
          <p class="explore-chart-note">Top institutions by known text–institution assignments with a subgenre. Bar length is the institution's share of all known assignments; colored segments show its internal subgenre composition.</p>
          <div id="genres-by-institution"></div>
        </div>
        <div id="genres-by-location-wrapper" class="explore-visualization-card">
          <div class="explore-viz-card-header" style="margin-bottom:1rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.125rem;">Subgenres by Location</h3>
            ${createExportButton('genres-by-location-wrapper', 'subgenres-by-location.png')}
          </div>
          <p class="explore-chart-note">Top production countries by known text–country assignments with a subgenre. Colored segments show each country's proportional subgenre composition; uncertain places contribute to each stated country.</p>
          <div id="genres-by-location"></div>
        </div>
      </div>
      
      <div id="genres-over-time-wrapper" class="explore-visualization-card">
        <div class="explore-viz-card-header" style="margin-bottom:.5rem;">
          <h3 style="margin:0;color:#2c3e50;font-size:1.125rem;">Subgenre Popularity Over Time</h3>
          ${createExportButton('genres-over-time-wrapper', 'subgenre-popularity-over-time.png')}
        </div>
        <p class="explore-chart-note">Share of known subgenre assignments in each century, with every known subgenre represented. Uncertain date ranges contribute once to every plausible century.</p>
        <div id="genres-over-time"></div>
      </div>
    </div>
  `;
  
  // Wait for DOM to update before building charts
  setTimeout(() => buildGenreDistributions(), 0);
}

// Network visualization functions
function buildManuscriptGenreNetwork() {
  buildManuscriptNetwork('genre', 'horizontal');
}

function buildManuscriptSubgenreNetwork() {
  buildManuscriptNetwork('subgenre', 'horizontal');
}

function buildManuscriptNetwork(levelFilter = 'genre', layout = 'horizontal') {
  disposeNetwork('manuscript');
  const container = document.getElementById('ms-network-viz');
  if (!container) {
    return;
  }
  
  // Build bipartite network data
  const manuscriptNodes = new Map();
  const genreNodes = new Map();
  const links = [];
  
  
  // Debug: Check first PU structure
  if ((getDATA() || {}).pu && (getDATA() || {}).pu[0]) {
  }
  
  // Debug: Check relationship structure
  if ((getDATA() || {}).rel && (getDATA() || {}).rel[0]) {
  }
  
  let pusHavingManuscript = 0;
  let pusHavingTexts = 0;
  let relationshipsChecked = 0;
  
  // Process production units to connect manuscripts to genres and subgenres
  // Path: Production Unit → Manuscript (pointer field) + Production Unit → Text (via "contains" relationship in relationships.json)
  ((getDATA() || {}).pu || []).forEach(pu => {
    const puId = String(pu.rec_ID);
    
    // Get manuscript linked to this production unit (pointer field)
    const msRes = getRes(pu, 'Manuscript');
    if (!msRes || !msRes.id) return;
    pusHavingManuscript++;
    
    const msId = String(msRes.id);
    const ms = (getIDX() || {}).ms?.[msId];
    if (!ms) return;
    
    const msTitle = MAP.ms?.title(ms) || `MS-${msId}`;
    
    // Get texts linked to this production unit via relationships
    const textGenresAndSubs = new Set();  // Store genres or subgenres based on levelFilter
    
    // Use the REL_INDEX to get relationships for this PU
    const puRels = [
      ...((getREL_INDEX() || {}).bySource?.[puId] || []),
      ...((getREL_INDEX() || {}).byTarget?.[puId] || [])
    ];
    
    puRels.forEach(rel => {
      relationshipsChecked++;
      
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const srcId = src?.id ? String(src.id) : null;
      const tgtId = tgt?.id ? String(tgt.id) : null;
      
      // Get the other record (the one that's not the PU)
      const otherId = srcId === puId ? tgtId : (tgtId === puId ? srcId : null);
      if (!otherId) return;
      
      const text = (getIDX() || {}).tx?.[otherId];
      
      if (text) {
        const fieldName = levelFilter === 'genre' ? 'Genre' : 'Subgenre';
        const prefix = levelFilter === 'genre' ? 'genre' : 'sub';
        getControlledValsAll(text, fieldName).forEach(value => {
          textGenresAndSubs.add(`${prefix}:${value}`);
        });
      }
    });
    
    if (textGenresAndSubs.size > 0) {
      pusHavingTexts++;
      if (!manuscriptNodes.has(msId)) {
        manuscriptNodes.set(msId, {
          id: `ms-${msId}`,
          name: msTitle.length > 40 ? msTitle.substring(0, 37) + '...' : msTitle,
          fullName: msTitle,
          type: 'manuscript',
          genreCount: 0,
          uniqueGenres: new Set()
        });
      }
      
      const msNode = manuscriptNodes.get(msId);
      msNode.genreCount += textGenresAndSubs.size;
      
      textGenresAndSubs.forEach(genreKey => {
        const [type, name] = genreKey.split(':');
        const isSubgenre = type === 'sub';
        const nodeId = genreKey;
        
        // Track unique genre types for bridge detection
        msNode.uniqueGenres.add(name);
        
        if (!genreNodes.has(nodeId)) {
          genreNodes.set(nodeId, {
            id: nodeId,
            name: name,
            type: isSubgenre ? 'subgenre' : 'genre',
            msCount: 0,
            uniqueManuscripts: new Set()
          });
        }
        const genreNode = genreNodes.get(nodeId);
        genreNode.msCount++;
        genreNode.uniqueManuscripts.add(msId);
        
        links.push({
          source: `ms-${msId}`,
          target: nodeId,
          value: 1
        });
      });
    }
  });
  
  const nodeArray = [...manuscriptNodes.values(), ...genreNodes.values()];
  
  if (!manuscriptNodes.size || !genreNodes.size || !links.length) {
    container.innerHTML = `<div class="explore-empty-state">No manuscript–${levelFilter} relationships found.</div>`;
    return;
  }
  
  // Clear container and create wrapper
  container.innerHTML = '';
  
  // Detect embed mode
  const isEmbedMode = document.documentElement.classList.contains('embed-mode');
  
  // Detect bridge nodes (manuscripts connecting many different genres, genres connecting many manuscripts)
  const avgMsGenres = Array.from(manuscriptNodes.values()).reduce((sum, n) => sum + n.uniqueGenres.size, 0) / manuscriptNodes.size;
  const avgGenreMs = Array.from(genreNodes.values()).reduce((sum, n) => sum + n.uniqueManuscripts.size, 0) / genreNodes.size;
  
  manuscriptNodes.forEach(node => {
    node.isBridge = node.uniqueGenres.size > avgMsGenres * 1.5;  // 50% above average
    node.isHub = node.genreCount > avgMsGenres * 2;  // Major hub if 2x average
  });
  
  genreNodes.forEach(node => {
    node.isBridge = node.uniqueManuscripts.size > avgGenreMs * 1.5;
    node.isHub = node.msCount > avgGenreMs * 2;
  });
  
  const bridgeCount = Array.from(manuscriptNodes.values()).filter(n => n.isBridge).length + 
                      Array.from(genreNodes.values()).filter(n => n.isBridge).length;
  const hubCount = Array.from(manuscriptNodes.values()).filter(n => n.isHub).length + 
                   Array.from(genreNodes.values()).filter(n => n.isHub).length;
  
  const itemCount = genreNodes.size;
  const itemLabel = levelFilter === 'genre' ? 'genres' : 'subgenres';
  
  // Controls bar
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; flex-wrap: wrap; gap: 0.75rem;';
  controlsDiv.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      <button id="ms-zoom-in" class="explore-action-btn explore-action-btn--compact">Zoom in</button>
      <button id="ms-zoom-out" class="explore-action-btn explore-action-btn--compact">Zoom out</button>
      <button id="ms-reset" style="padding: 0.375rem 0.75rem; background: #64748b; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Reset View</button>
      <button id="ms-toggle-labels" class="explore-action-btn explore-action-btn--compact">Hide labels</button>
      <button id="ms-toggle-singles" style="padding: 0.375rem 0.75rem; background: #ec4899; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Singles</button>
    </div>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <span style="font-size: 0.875rem; color: #64748b; font-weight: 600;">${manuscriptNodes.size} manuscripts • ${itemCount} ${itemLabel} • ${bridgeCount} bridges • ${hubCount} hubs</span>
      ${createEmbedButton(`manuscript-${levelFilter}`)}
      ${createExportButton('ms-network-viz', `manuscript-${itemLabel}-network.png`)}
    </div>
  `;
  container.appendChild(controlsDiv);
  
  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.875rem;';
  legendDiv.innerHTML = `
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600;">Manuscripts (circles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 12px; background: ${levelFilter === 'genre' ? '#f59e0b' : '#a855f7'}; border-radius: 3px; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${itemLabel} (rectangles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: white; border-radius: 50%; border: 3px solid #dc2626;"></div>
        <span style="color: #1e293b; font-weight: 600;">Bridge Nodes</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 20px; height: 20px; background: white; border-radius: 50%; border: 3px solid #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);"></div>
        <span style="color: #1e293b; font-weight: 600;">Major Hubs</span>
      </div>
    </div>
    <div style="color: #64748b; font-size: 0.75rem;">
      Manuscripts at top, ${itemLabel} at bottom | Node size = connections | Bridges connect diverse ${itemLabel} | Hubs have many connections | Hover to highlight | Drag to reposition | Click to focus
    </div>
  `;
  container.appendChild(legendDiv);
  
  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.style.cssText = 'width: 100%; min-height: 1200px; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa; overflow: hidden; position: relative; box-sizing: border-box;';
  container.appendChild(svgDiv);
  
  // Create tooltip div
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position: absolute; background: white; border: 2px solid #3b82f6; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.875rem; pointer-events: none; opacity: 0; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 300px;';
  svgDiv.appendChild(tooltip);
  
  // Get actual container dimensions
  function getSize(el) {
    const r = el.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }
  
  // Get container dimensions for viewBox
  function getSize(el) {
    const r = el.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }
  
  let { w: width, h: height } = getSize(svgDiv);
  if (width <= 50 || height <= 50) {
    width = 1200;
    height = 1200;
  }
  
  const svg = d3.select(svgDiv)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'block');
  
  const g = svg.append('g');
  
  // Zoom behavior
  let currentTransform = d3.zoomIdentity;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      currentTransform = event.transform;
      g.attr('transform', event.transform);
      updateNodeSizes(event.transform.k);
    });
  
  svg.call(zoom);
  
  // Fit network to view - centers and scales to fit container
  function fitToView() {
    const { w, h } = getSize(svgDiv);
    if (w <= 1 || h <= 1) {
      return;
    }
    
    try {
      const bbox = g.node().getBBox();
      if (!bbox.width || !bbox.height) {
        return;
      }
      
      const pad = 40;
      const scale = Math.min(
        (w - pad) / bbox.width,
        (h - pad) / bbox.height,
        1.5  // Don't zoom in too much
      );
      
      const tx = (w / 2) - scale * (bbox.x + bbox.width / 2);
      const ty = (h / 2) - scale * (bbox.y + bbox.height / 2);
      
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
      
      // Verify transform was applied
      setTimeout(() => {
        const actualTransform = g.attr('transform');
      }, 600);
    } catch (e) {
      // If bbox fails, just reset to identity
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    }
  }
  
  // Zoom controls
  document.getElementById('ms-zoom-in').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1.3);
  };
  document.getElementById('ms-zoom-out').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 0.7);
  };
  document.getElementById('ms-reset').onclick = () => {
    fitToView();
  };
  
  // Toggle labels
  let labelsVisible = true;
  document.getElementById('ms-toggle-labels').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('display', labelsVisible ? 'block' : 'none');
    this.textContent = labelsVisible ? 'Hide labels' : 'Show labels';
  };
  
  // Toggle singles (nodes with only 1 connection)
  let singlesVisible = true;
  document.getElementById('ms-toggle-singles').onclick = function() {
    singlesVisible = !singlesVisible;
    node.style('display', d => {
      const connectionCount = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
      return (!singlesVisible && connectionCount === 1) ? 'none' : 'block';
    });
    link.style('display', l => {
      const sourceCount = links.filter(lnk => lnk.source.id === l.source.id || lnk.target.id === l.source.id).length;
      const targetCount = links.filter(lnk => lnk.source.id === l.target.id || lnk.target.id === l.target.id).length;
      return (!singlesVisible && (sourceCount === 1 || targetCount === 1)) ? 'none' : 'block';
    });
    this.textContent = singlesVisible ? 'Hide Singles' : 'Show Singles';
  };
  
  // Calculate node sizes based on connections
  const maxMsGenres = Math.max(...Array.from(manuscriptNodes.values()).map(d => d.genreCount), 1);
  const maxGenreMs = Math.max(...Array.from(genreNodes.values()).map(d => d.msCount), 1);
  
  // Configure force simulation based on layout
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.isGenreLink ? 80 : 120).strength(d => d.isGenreLink ? 0.3 : 0.5))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('collision', d3.forceCollide().radius(d => {
      const baseR = d.type === 'manuscript' ? 4 + (d.genreCount / maxMsGenres) * 8 : 5 + (d.msCount / maxGenreMs) * 12;
      return baseR + 5;
    }));

  registerNetworkDisposer('manuscript', () => {
    simulation.stop();
    simulation.on('tick', null).on('end', null);
    svg.interrupt();
  });
  
  if (layout === 'horizontal') {
    // Horizontal layout: manuscripts at top, genres at bottom
    simulation
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(d => d.type === 'manuscript' ? height * 0.25 : height * 0.75).strength(0.9));
  } else {
    // Radial layout: force-directed with center gravity
    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));
  }
  
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.4);
  
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Main shapes - circles for manuscripts, rectangles for genres/subgenres
  const shapes = node.append(d => {
    if (d.type === 'manuscript') {
      return document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    } else {
      return document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    }
  });
  
  // Style circles (manuscripts)
  shapes.filter(function(d) { return d.type === 'manuscript'; })
    .attr('r', d => 4 + (d.genreCount / maxMsGenres) * 8)
    .attr('fill', '#3b82f6')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  // Style rectangles (genres/subgenres)
  shapes.filter(function(d) { return d.type !== 'manuscript'; })
    .attr('width', d => (5 + (d.msCount / maxGenreMs) * 12) * 2)
    .attr('height', d => (5 + (d.msCount / maxGenreMs) * 12) * 1.5)
    .attr('x', d => -(5 + (d.msCount / maxGenreMs) * 12))
    .attr('y', d => -(5 + (d.msCount / maxGenreMs) * 12) * 0.75)
    .attr('rx', 3)
    .attr('fill', levelFilter === 'genre' ? '#f59e0b' : '#a855f7')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  const circles = shapes;
  
  // Add glow effect for hubs
  node.filter(d => d.isHub).each(function(d) {
    const hubNode = d3.select(this);
    if (d.type === 'manuscript') {
      hubNode.append('circle')
        .attr('r', (4 + (d.genreCount / maxMsGenres) * 8) + 4)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    } else {
      hubNode.append('rect')
        .attr('width', ((5 + (d.msCount / maxGenreMs) * 12) * 2) + 8)
        .attr('height', ((5 + (d.msCount / maxGenreMs) * 12) * 1.5) + 6)
        .attr('x', -((5 + (d.msCount / maxGenreMs) * 12) + 4))
        .attr('y', -((5 + (d.msCount / maxGenreMs) * 12) * 0.75 + 3))
        .attr('rx', 3)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    }
  });
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 30 ? d.name.substring(0, 27) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => {
      if (d.type === 'manuscript') {
        return (4 + (d.genreCount / maxMsGenres) * 8) + 14;
      } else {
        return ((5 + (d.msCount / maxGenreMs) * 12) * 0.75) + 16;
      }
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', d => d.isHub || d.isBridge ? '10px' : '9px')
    .attr('font-weight', d => d.isHub || d.isBridge ? '700' : '600')
    .attr('fill', '#1e293b')
    .style('pointer-events', 'none')
    .style('user-select', 'none');
  
  node.append('title')
    .text(d => {
      if (d.type === 'manuscript') {
        return `${d.name}\n${d.genreCount} genre${d.genreCount !== 1 ? 's' : ''}`;
      } else {
        return `${d.name}\n${d.msCount} manuscript${d.msCount !== 1 ? 's' : ''}`;
      }
    });
  
  // Enhanced hover with tooltip
  let tooltipRect = null;
  node.on('mouseenter', function(event, d) {
    // Cache bounding rect
    tooltipRect = svgDiv.getBoundingClientRect();
    
    const rows = d.type === 'manuscript'
      ? [['Type', 'Manuscript'], [`Total ${itemLabel}`, d.genreCount], [`Unique ${itemLabel}`, d.uniqueGenres.size]]
      : [['Type', d.type === 'genre' ? 'Genre' : 'Subgenre'], ['Manuscripts', d.msCount], ['Unique', d.uniqueManuscripts.size]];
    renderNetworkTooltip(tooltip, d.name, rows, d);
    tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
    tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    tooltip.style.opacity = '1';
    
    // Highlight connections
    const connectedNodeIds = new Set();
    link.style('stroke-opacity', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        connectedNodeIds.add(l.source.id);
        connectedNodeIds.add(l.target.id);
        return 0.8;
      }
      return 0.1;
    }).style('stroke-width', l => {
      if (l.source.id === d.id || l.target.id === d.id) return 2.5;
      return 1;
    }).style('stroke', l => {
      if (l.source.id === d.id || l.target.id === d.id) return '#2563eb';
      return '#cbd5e1';
    });
    
    node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.3);
  })
  .on('mousemove', function(event) {
    if (tooltipRect) {
      tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
      tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    }
  })
  .on('mouseleave', function() {
    tooltip.style.opacity = '0';
    tooltipRect = null;
    link.style('stroke-opacity', 0.4)
        .style('stroke-width', 1)
        .style('stroke', '#cbd5e1');
    node.style('opacity', 1);
  });
  
  // Click to focus
  node.on('click', function(event, d) {
    event.stopPropagation();
    const scale = 1.5;
    const x = -d.x * scale + width / 2;
    const y = -d.y * scale + height / 2;
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  });
  
  function updateNodeSizes(scale) {
    const inverseScale = 1 / scale;
    shapes.each(function(d) {
      const shape = d3.select(this);
      if (d.type === 'manuscript') {
        shape.attr('r', (4 + (d.genreCount / maxMsGenres) * 8) * inverseScale);
      } else {
        const baseSize = 5 + (d.msCount / maxGenreMs) * 12;
        shape.attr('width', baseSize * 2 * inverseScale)
             .attr('height', baseSize * 1.5 * inverseScale)
             .attr('x', -baseSize * inverseScale)
             .attr('y', -baseSize * 0.75 * inverseScale);
      }
    });
    nodeLabels.attr('font-size', `${9 * inverseScale}px`)
      .attr('y', d => {
        if (d.type === 'manuscript') {
          return ((4 + (d.genreCount / maxMsGenres) * 8) + 14) * inverseScale;
        } else {
          return (((5 + (d.msCount / maxGenreMs) * 12) * 0.75) + 16) * inverseScale;
        }
      });
    link.attr('stroke-width', function(l) {
      const currentOpacity = parseFloat(d3.select(this).style('stroke-opacity'));
      return (currentOpacity > 0.5 ? 2.5 : 1) * inverseScale;
    });
  }
  
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
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Fit to view after simulation stabilizes
  simulation.on('end', () => {
    setTimeout(() => fitToView(), 100);
  });
}

function buildGenreDistributions() {
  buildGenresByInstitution();
  buildGenresByLocation();
  buildGenresOverTime();
}

function getGenreAssignmentsForPU(pu) {
  const assignments = new Map();
  const puId = String(pu.rec_ID);
  const relationships = [
    ...((getREL_INDEX() || {}).bySource?.[puId] || []),
    ...((getREL_INDEX() || {}).byTarget?.[puId] || [])
  ];

  relationships.forEach(relationship => {
    const source = getRes(relationship, 'Source record');
    const target = getRes(relationship, 'Target record');
    const sourceId = String(source?.id || '');
    const targetId = String(target?.id || '');
    const textId = (getIDX() || {}).tx?.[sourceId] ? sourceId : (getIDX() || {}).tx?.[targetId] ? targetId : null;
    if (!textId) return;
    const text = (getIDX() || {}).tx[textId];
    getKnownValues(text, 'Subgenre').forEach(subgenre => {
      assignments.set(`${textId}\u0000${subgenre}`, { textId, subgenre });
    });
  });

  return [...assignments.values()];
}

function getKnownValues(record, fieldName) {
  return getControlledValsAll(record, fieldName);
}

function parseCenturyValues(value) {
  if (!isKnownCategory(value)) return [];
  const normalized = String(value).replace(/[–—]/g, '-');
  const range = normalized.match(/(\d{1,2})\s*(?:st|nd|rd|th)?\s*-\s*(\d{1,2})/i);
  if (range) {
    const start = Number(range[1]);
    const end = Number(range[2]);
    if (start <= end && end - start <= 20) {
      return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }
  }
  return [...new Set((normalized.match(/\d{1,2}/g) || []).map(Number))];
}

function addDimensionAssignments(store, dimensions, assignments) {
  dimensions.forEach(dimension => {
    if (!isKnownCategory(dimension)) return;
    if (!store.has(dimension)) store.set(dimension, { total: 0, subgenres: new Map() });
    const entry = store.get(dimension);
    assignments.forEach(({ subgenre }) => {
      entry.total += 1;
      entry.subgenres.set(subgenre, (entry.subgenres.get(subgenre) || 0) + 1);
    });
  });
}

const SUBGENRE_COLORS = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949',
  '#af7aa1', '#ff9da7', '#9c755f', '#6f4e7c', '#1f77b4', '#ff7f0e',
  '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
  '#bcbd22', '#17becf', '#393b79', '#637939', '#8c6d31', '#843c39'
];
let subgenrePaletteSource = null;
let subgenrePaletteLabels = [];
let subgenrePaletteMap = new Map();

function knownSubgenreLabels() {
  const texts = ((getDATA() || {}).tx || []);
  if (subgenrePaletteSource === texts) return [...subgenrePaletteLabels];
  const labels = new Set();
  texts.forEach(text => {
    getKnownValues(text, 'Subgenre').forEach(subgenre => labels.add(subgenre));
  });
  subgenrePaletteSource = texts;
  subgenrePaletteLabels = [...labels].sort((a, b) => a.localeCompare(b));
  subgenrePaletteMap = new Map(subgenrePaletteLabels.map((label, index) => [
    label,
    SUBGENRE_COLORS[index] || `hsl(${(index * 137.508) % 360} 72% 42%)`
  ]));
  return [...subgenrePaletteLabels];
}

function subgenreColor(label) {
  knownSubgenreLabels();
  return subgenrePaletteMap.get(String(label)) || '#64748b';
}

function renderDimensionDistribution(container, store, dimensionLabel) {
  const rows = [...store.entries()]
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
  const denominator = [...store.values()].reduce((sum, data) => sum + data.total, 0);
  if (!rows.length || !denominator) {
    container.innerHTML = '<p class="explore-empty-state">No known data available.</p>';
    return;
  }

  container.innerHTML = `<div class="genre-distribution-chart">${rows.map(row => {
    const percentage = (row.total / denominator) * 100;
    const orderedSubgenres = [...row.subgenres.entries()].sort((a, b) => b[1] - a[1]);
    const visibleLabels = orderedSubgenres.slice(0, 6);
    return `
      <div class="genre-distribution-row">
        <div class="genre-distribution-heading">
          <span title="${esc(row.name)}">${esc(row.name)}</span>
          <span>${row.total.toLocaleString()} · ${percentage.toFixed(1)}% · ${row.subgenres.size} subgenre${row.subgenres.size === 1 ? '' : 's'}</span>
        </div>
        <div class="genre-distribution-track" aria-label="${percentage.toFixed(1)} percent of known ${dimensionLabel} assignments">
          <div class="genre-distribution-stack" style="width:${percentage}%;">
            ${orderedSubgenres.map(([subgenre, count]) => `<span class="genre-distribution-segment" style="width:${(count / row.total) * 100}%;background:${subgenreColor(subgenre)};" title="${esc(subgenre)}: ${count} (${((count / row.total) * 100).toFixed(1)}% of ${esc(row.name)})"><span class="sr-only">${esc(subgenre)}: ${count}</span></span>`).join('')}
          </div>
        </div>
        <div class="genre-distribution-breakdown">
          ${visibleLabels.map(([subgenre, count]) => `<span><i style="background:${subgenreColor(subgenre)};"></i>${esc(subgenre)} (${count})</span>`).join('')}
          ${orderedSubgenres.length > visibleLabels.length ? `<span>+${orderedSubgenres.length - visibleLabels.length} more</span>` : ''}
        </div>
      </div>`;
  }).join('')}</div><p class="explore-chart-note">Denominator: ${denominator.toLocaleString()} known ${dimensionLabel} assignments across ${store.size} ${dimensionLabel === 'institution' ? 'institutions' : 'countries'}.</p>`;
}

function buildGenresByInstitution() {
  const container = document.getElementById('genres-by-institution');
  if (!container) return;
  const institutionGenres = new Map();

  ((getDATA() || {}).pu || []).forEach(pu => {
    const institutions = getInstitutionsForPU(pu);
    const assignments = getGenreAssignmentsForPU(pu);
    addDimensionAssignments(institutionGenres, [...new Set(institutions.map(inst => inst.institutionName))], assignments);
  });

  renderDimensionDistribution(container, institutionGenres, 'institution');
}

function buildGenresByLocation() {
  const container = document.getElementById('genres-by-location');
  if (!container) return;
  const locationGenres = new Map();

  ((getDATA() || {}).pu || []).forEach(pu => {
    const countries = getKnownValues(pu, 'PU country');
    addDimensionAssignments(locationGenres, countries, getGenreAssignmentsForPU(pu));
  });

  renderDimensionDistribution(container, locationGenres, 'country');
}

function buildGenresOverTime() {
  const container = document.getElementById('genres-over-time');
  if (!container) return;
  const centuryData = new Map();

  ((getDATA() || {}).pu || []).forEach(pu => {
    const centuries = getKnownValues(pu, 'Normalized century of production')
      .flatMap(parseCenturyValues)
      .filter(century => century >= 8 && century <= 16);
    const assignments = getGenreAssignmentsForPU(pu);
    [...new Set(centuries)].forEach(century => {
      if (!centuryData.has(century)) centuryData.set(century, { total: 0, subgenres: new Map() });
      const entry = centuryData.get(century);
      assignments.forEach(({ subgenre }) => {
        entry.total += 1;
        entry.subgenres.set(subgenre, (entry.subgenres.get(subgenre) || 0) + 1);
      });
    });
  });

  const centuries = [...centuryData.keys()].sort((a, b) => a - b);
  if (!centuries.length) {
    container.innerHTML = '<p class="explore-empty-state">No known date and subgenre assignments are available.</p>';
    return;
  }

  const subgenreTotals = new Map();
  centuryData.forEach(entry => entry.subgenres.forEach((count, subgenre) => subgenreTotals.set(subgenre, (subgenreTotals.get(subgenre) || 0) + count)));
  const subgenres = knownSubgenreLabels()
    .sort((a, b) => (subgenreTotals.get(b) || 0) - (subgenreTotals.get(a) || 0) || a.localeCompare(b));
  const points = subgenres.flatMap(subgenre => centuries.map(century => {
    const entry = centuryData.get(century);
    return entry.total ? ((entry.subgenres.get(subgenre) || 0) / entry.total) * 100 : 0;
  }));
  const maxObserved = Math.max(1, ...points);
  const heatColor = percentage => {
    if (percentage <= 0) return '#f8fafc';
    const intensity = Math.min(1, percentage / maxObserved);
    return `hsl(205 72% ${96 - intensity * 58}%)`;
  };

  const header = centuries.map(century => `
    <th scope="col">
      <span>${century}th</span>
      <small>n=${centuryData.get(century).total}</small>
    </th>`).join('');
  const rows = subgenres.map(subgenre => {
    const cells = centuries.map(century => {
      const entry = centuryData.get(century);
      const count = entry.subgenres.get(subgenre) || 0;
      const percentage = entry.total ? (count / entry.total) * 100 : 0;
      const intensity = percentage / maxObserved;
      const label = `${subgenre}, ${century}th century: ${count} of ${entry.total} assignments (${percentage.toFixed(1)}%)`;
      return `<td style="background:${heatColor(percentage)};color:${intensity > 0.55 ? '#fff' : '#334155'}" title="${esc(label)}" aria-label="${esc(label)}"><strong>${percentage.toFixed(1)}%</strong><small>${count}</small></td>`;
    }).join('');
    return `<tr><th scope="row">${esc(subgenre)}<small>n=${(subgenreTotals.get(subgenre) || 0).toLocaleString()}</small></th>${cells}</tr>`;
  }).join('');

  container.innerHTML = `
    <div class="subgenre-heatmap-key" aria-label="Colour scale from zero to ${maxObserved.toFixed(1)} percent">
      <span>0%</span><i></i><span>${maxObserved.toFixed(1)}%</span>
    </div>
    <div class="subgenre-heatmap-scroll">
      <table class="subgenre-heatmap">
        <caption class="sr-only">Share and count of every known subgenre assignment by century</caption>
        <thead><tr><th scope="col">Subgenre</th>${header}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="explore-chart-note">Each cell shows that subgenre’s share of the century’s known assignments, with the assignment count underneath. Darker cells indicate a larger share. Rows include all ${subgenres.length} known subgenres and are ordered by total dated assignments. Uncertain dates contribute once to every plausible century.</p>`;
}

function buildInstitutionGenreNetwork() {
  buildInstitutionNetwork('genre', 'horizontal');
}

function buildInstitutionSubgenreNetwork() {
  buildInstitutionNetwork('subgenre', 'horizontal');
}

function buildInstitutionNetwork(levelFilter = 'genre', layout = 'horizontal') {
  disposeNetwork('institution');
  const container = document.getElementById('inst-network-viz');
  if (!container) return;
  
  // Build institution-genre network with country/region data
  const institutionNodes = new Map();
  const genreNodes = new Map();
  const links = [];
  
  ((getDATA() || {}).pu || []).forEach(pu => {
    const puId = String(pu.rec_ID);
    const institutions = getInstitutionsForPU(pu);
    const countries = getControlledValsAll(pu, 'PU country');
    const regions = getControlledValsAll(pu, 'PU region');
    if (!countries.length && !regions.length) return;
    
    const rels = [...((getREL_INDEX() || {}).bySource?.[puId] || []), ...((getREL_INDEX() || {}).byTarget?.[puId] || [])];
    const genresAndSubs = new Set();  // Store genres or subgenres based on levelFilter
    
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const textId = (getIDX() || {}).tx?.[String(src?.id)] ? String(src.id) : (getIDX() || {}).tx?.[String(tgt?.id)] ? String(tgt.id) : null;
      
      if (textId) {
        const text = (getIDX() || {}).tx[textId];
        const fieldName = levelFilter === 'genre' ? 'Genre' : 'Subgenre';
        const prefix = levelFilter === 'genre' ? 'genre' : 'sub';
        getControlledValsAll(text, fieldName).forEach(value => {
          genresAndSubs.add(`${prefix}:${value}`);
        });
      }
    });
    
    institutions.forEach(inst => {
      if (!institutionNodes.has(inst.institutionName)) {
        institutionNodes.set(inst.institutionName, {
          id: `inst-${inst.institutionName}`,
          name: inst.institutionName,
          type: 'institution',
          country: '',
          region: '',
          countries: new Set(),
          regions: new Set(),
          genreCount: 0,
          totalTexts: 0,
          uniqueGenres: new Set()
        });
      }
      const instNode = institutionNodes.get(inst.institutionName);
      countries.forEach(country => instNode.countries.add(country));
      regions.forEach(region => instNode.regions.add(region));
      instNode.country = [...instNode.countries].join(' / ');
      instNode.region = [...instNode.regions].join(' / ');
      instNode.genreCount += genresAndSubs.size;
      instNode.totalTexts++;
      
      genresAndSubs.forEach(genreKey => {
        const [type, name] = genreKey.split(':');
        const isSubgenre = type === 'sub';
        const nodeId = genreKey;
        
        // Track unique genres for bridge detection
        instNode.uniqueGenres.add(name);
        
        if (!genreNodes.has(nodeId)) {
          genreNodes.set(nodeId, {
            id: nodeId,
            name: name,
            type: isSubgenre ? 'subgenre' : 'genre',
            institutionCount: 0,
            totalOccurrences: 0,
            uniqueInstitutions: new Set()
          });
        }
        const genreNode = genreNodes.get(nodeId);
        genreNode.institutionCount++;
        genreNode.uniqueInstitutions.add(inst.institutionName);
        genreNode.totalOccurrences++;
        
        const existing = links.find(l => l.source === `inst-${inst.institutionName}` && l.target === nodeId);
        if (existing) {
          existing.value++;
        } else {
          links.push({
            source: `inst-${inst.institutionName}`,
            target: nodeId,
            value: 1
          });
        }
      });
    });
  });
  
  const nodeArray = [...institutionNodes.values(), ...genreNodes.values()];
  
  if (!institutionNodes.size || !genreNodes.size || !links.length) {
    container.innerHTML = `<div class="explore-empty-state">No institution–${levelFilter} relationships found.</div>`;
    return;
  }
  
  // Clear container and create wrapper
  container.innerHTML = '';
  
  // Detect bridge nodes and hubs
  const avgInstGenres = Array.from(institutionNodes.values()).reduce((sum, n) => sum + n.uniqueGenres.size, 0) / institutionNodes.size;
  const avgGenreInsts = Array.from(genreNodes.values()).reduce((sum, n) => sum + n.uniqueInstitutions.size, 0) / genreNodes.size;
  
  institutionNodes.forEach(node => {
    node.isBridge = node.uniqueGenres.size > avgInstGenres * 1.5;
    node.isHub = node.genreCount > avgInstGenres * 2;
  });
  
  genreNodes.forEach(node => {
    node.isBridge = node.uniqueInstitutions.size > avgGenreInsts * 1.5;
    node.isHub = node.totalOccurrences > avgGenreInsts * 2;
  });
  
  const bridgeCount = Array.from(institutionNodes.values()).filter(n => n.isBridge).length + 
                      Array.from(genreNodes.values()).filter(n => n.isBridge).length;
  const hubCount = Array.from(institutionNodes.values()).filter(n => n.isHub).length + 
                   Array.from(genreNodes.values()).filter(n => n.isHub).length;
  
  const itemCount = genreNodes.size;
  const itemLabel = levelFilter === 'genre' ? 'genres' : 'subgenres';
  
  // Color scales for institutions by country
  const countryColors = {
    'Germany': '#ef4444',
    'France': '#3b82f6',
    'Italy': '#10b981',
    'Spain': '#f59e0b',
    'Austria': '#8b5cf6',
    'Switzerland': '#ec4899',
    'Belgium': '#14b8a6',
    'Netherlands': '#f97316',
    'England': '#6366f1'
  };
  const getInstColor = country => countryColors[country] || '#64748b';
  
  // Genre category colors (comprehensive categorization)
  const genreCategories = {
    'devotional': ['prayer', 'psalm', 'hour', 'devotion', 'hymn', 'liturgical', 'liturg', 'office', 'mass', 'breviary', 'missal', 'gospel', 'bible', 'saint', 'vita', 'hagiograph'],
    'medical': ['medical', 'medicine', 'remedy', 'recipe', 'herbal', 'health', 'cure', 'physician', 'surgery', 'apothecary'],
    'legal': ['legal', 'law', 'charter', 'document', 'contract', 'statute', 'decree', 'ordinance', 'privilege'],
    'scholastic': ['commentary', 'treatise', 'sermon', 'theological', 'theology', 'philosophy', 'logic', 'summa', 'quaestio', 'disputation', 'gloss'],
    'literary': ['poetry', 'poem', 'chronicle', 'history', 'letter', 'epistle', 'romance', 'fable', 'story', 'narrative', 'epic'],
    'scientific': ['astronomy', 'astrology', 'arithmetic', 'geometry', 'mathematics', 'natural', 'science', 'computation'],
    'grammatical': ['grammar', 'grammatical', 'vocabulary', 'dictionary', 'gloss', 'linguistic']
  };
  const genreCategoryColors = {
    'devotional': '#a855f7',
    'medical': '#22c55e',
    'legal': '#0ea5e9',
    'scholastic': '#f59e0b',
    'literary': '#ec4899',
    'scientific': '#8b5cf6',
    'grammatical': '#14b8a6',
    'other': '#94a3b8'
  };
  
  // Track genre categorizations for debugging
  const genreCategorizationMap = new Map();
  
  const getGenreCategory = genre => {
    if (!genre) return 'other';
    const lowerGenre = genre.toLowerCase();
    
    for (const [category, keywords] of Object.entries(genreCategories)) {
      if (keywords.some(kw => lowerGenre.includes(kw))) {
        genreCategorizationMap.set(genre, category);
        return category;
      }
    }
    genreCategorizationMap.set(genre, 'other');
    return 'other';
  };
  const getGenreColor = genre => {
    const category = getGenreCategory(genre);
    return genreCategoryColors[category];
  };
  
  // Log genre categorizations for debugging
  
  // Detect embed mode
  const isEmbedMode = document.documentElement.classList.contains('embed-mode');
  
  // Controls bar
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; flex-wrap: wrap; gap: 0.75rem;';
  controlsDiv.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      <button id="inst-zoom-in" class="explore-action-btn explore-action-btn--compact">Zoom in</button>
      <button id="inst-zoom-out" class="explore-action-btn explore-action-btn--compact">Zoom out</button>
      <button id="inst-reset" style="padding: 0.375rem 0.75rem; background: #64748b; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Reset View</button>
      <button id="inst-toggle-labels" class="explore-action-btn explore-action-btn--compact">Hide labels</button>
      <button id="inst-toggle-singles" style="padding: 0.375rem 0.75rem; background: #ec4899; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Singles</button>
    </div>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <span style="font-size: 0.875rem; color: #64748b; font-weight: 600;">${institutionNodes.size} institutions • ${itemCount} ${itemLabel} • ${bridgeCount} bridges • ${hubCount} hubs</span>
      ${createEmbedButton(`institution-${levelFilter}`)}
      ${createExportButton('inst-network-viz', `institution-${itemLabel}-network.png`)}
    </div>
  `;
  container.appendChild(controlsDiv);
  
  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.875rem;';
  legendDiv.innerHTML = `
    <div style="margin-bottom: 0.75rem; font-weight: 600; color: #1e293b;">Institutions (circles, colored by country)</div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
      ${Object.entries(countryColors).slice(0, 10).map(([country, color]) => `
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; border: 1.5px solid white;"></div>
          <span style="color: #64748b; font-size: 0.75rem;">${country}</span>
        </div>
      `).join('')}
    </div>
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 12px; background: ${levelFilter === 'genre' ? '#f59e0b' : '#a855f7'}; border-radius: 3px; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${itemLabel} (rectangles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: white; border-radius: 50%; border: 3px solid #dc2626;"></div>
        <span style="color: #1e293b; font-weight: 600;">Bridge Nodes</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 20px; height: 20px; background: white; border-radius: 50%; border: 3px solid #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);"></div>
        <span style="color: #1e293b; font-weight: 600;">Major Hubs</span>
      </div>
    </div>
    <div style="color: #64748b; font-size: 0.75rem;">
      Institutions at top, ${itemLabel} at bottom | Node size = connections | Edge thickness = frequency | Bridges connect diverse ${itemLabel} | Hubs have many connections | Hover to highlight | Drag to reposition | Click to focus
    </div>
  `;
  container.appendChild(legendDiv);
  
  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.style.cssText = 'width: 100%; max-width: 100%; min-height: 1200px; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa; overflow: hidden; position: relative; box-sizing: border-box;';
  container.appendChild(svgDiv);
  
  // Create tooltip div
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position: absolute; background: white; border: 2px solid #10b981; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.875rem; pointer-events: none; opacity: 0; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 300px;';
  svgDiv.appendChild(tooltip);
  
  // Get actual container dimensions
  function getSize(el) {
    const r = el.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }
  
  // D3 force layout - use container dimensions for viewBox
  let { w: width, h: height } = getSize(svgDiv);
  // Wait for real dimensions if container not yet sized
  if (width <= 50 || height <= 50) {
    width = 1200;
    height = 1200;
  }
  
  const svg = d3.select(svgDiv)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'block');
  
  const g = svg.append('g');
  
  // Zoom behavior
  let currentTransform = d3.zoomIdentity;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      currentTransform = event.transform;
      g.attr('transform', event.transform);
      updateNodeSizes(event.transform.k);
    });
  
  svg.call(zoom);
  
  // Fit network to view - centers and scales to fit container
  function fitToView() {
    const { w, h } = getSize(svgDiv);
    if (w <= 1 || h <= 1) return;
    
    try {
      const bbox = g.node().getBBox();
      if (!bbox.width || !bbox.height) return;
      
      const pad = 40;
      const scale = Math.min(
        (w - pad) / bbox.width,
        (h - pad) / bbox.height,
        1.5  // Don't zoom in too much
      );
      
      const tx = (w / 2) - scale * (bbox.x + bbox.width / 2);
      const ty = (h / 2) - scale * (bbox.y + bbox.height / 2);
      
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    } catch (e) {
      // If bbox fails, just reset to identity
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    }
  }
  
  // Zoom controls
  document.getElementById('inst-zoom-in').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1.3);
  };
  document.getElementById('inst-zoom-out').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 0.7);
  };
  document.getElementById('inst-reset').onclick = () => {
    fitToView();
  };
  
  // Toggle labels
  let labelsVisible = true;
  document.getElementById('inst-toggle-labels').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('display', labelsVisible ? 'block' : 'none');
    this.textContent = labelsVisible ? 'Hide labels' : 'Show labels';
  };
  
  // Toggle singles (nodes with only 1 connection)
  let singlesVisible = true;
  document.getElementById('inst-toggle-singles').onclick = function() {
    singlesVisible = !singlesVisible;
    node.style('display', d => {
      const connectionCount = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
      return (!singlesVisible && connectionCount === 1) ? 'none' : 'block';
    });
    link.style('display', l => {
      const sourceCount = links.filter(lnk => lnk.source.id === l.source.id || lnk.target.id === l.source.id).length;
      const targetCount = links.filter(lnk => lnk.source.id === l.target.id || lnk.target.id === l.target.id).length;
      return (!singlesVisible && (sourceCount === 1 || targetCount === 1)) ? 'none' : 'block';
    });
    this.textContent = singlesVisible ? 'Hide Singles' : 'Show Singles';
  };
  
  // Calculate max values for scaling
  const maxInstGenres = Math.max(...Array.from(institutionNodes.values()).map(d => d.genreCount), 1);
  const maxGenreInsts = Math.max(...Array.from(genreNodes.values()).map(d => d.totalOccurrences), 1);
  const maxLinkValue = Math.max(...links.map(l => l.value), 1);
  
  // Configure force simulation based on layout
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => 100 - (d.value / maxLinkValue) * 30).strength(0.4))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('collision', d3.forceCollide().radius(d => {
      if (d.type === 'institution') return 6 + (d.genreCount / maxInstGenres) * 12 + 5;
      return 6 + (d.totalOccurrences / maxGenreInsts) * 10 + 5;
    }));

  let resizeObserver = null;
  registerNetworkDisposer('institution', () => {
    simulation.stop();
    simulation.on('tick', null).on('end', null);
    window.removeEventListener('resize', resizeAndRecenter);
    resizeObserver?.disconnect();
    clearTimeout(resizeTimeout);
    svg.interrupt();
  });
  
  if (layout === 'horizontal') {
    // Horizontal layout: institutions at top, genres at bottom
    simulation
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(d => d.type === 'institution' ? height * 0.25 : height * 0.75).strength(0.9));
  } else {
    // Radial layout: force-directed with center gravity
    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));
  }
  
  // Resize handler to recenter when container size changes
  let resizeTimeout;
  let lastResizeWidth = width;
  let lastResizeHeight = height;
  const RESIZE_THRESHOLD = 10; // Only resize if change exceeds 10px
  const RESIZE_DEBOUNCE = 150; // Wait 150ms after last resize event
  
  function resizeAndRecenter() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const { w, h } = getSize(svgDiv);
      
      if (w <= 1 || h <= 1) {
        return;
      }
      
      // Use threshold to prevent micro-changes from triggering resize
      const widthDiff = Math.abs(w - lastResizeWidth);
      const heightDiff = Math.abs(h - lastResizeHeight);
      
      if (widthDiff < RESIZE_THRESHOLD && heightDiff < RESIZE_THRESHOLD) {
        return;
      }
      
      lastResizeWidth = w;
      lastResizeHeight = h;
      width = w;
      height = h;
      svg.attr('viewBox', `0 0 ${width} ${height}`);
      
      if (layout === 'horizontal') {
        simulation
          .force('x', d3.forceX(width / 2).strength(0.05))
          .force('y', d3.forceY(d => d.type === 'institution' ? height * 0.25 : height * 0.75).strength(0.9));
      } else {
        simulation
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('x', d3.forceX(width / 2).strength(0.03))
          .force('y', d3.forceY(height / 2).strength(0.03));
      }
      simulation.alpha(0.3).restart();
      
      // CRITICAL: Fit to view to properly center after resize
      // Wait for simulation to settle a bit before fitting
      setTimeout(() => fitToView(), 300);
    }, RESIZE_DEBOUNCE);
  }
  
  window.addEventListener('resize', resizeAndRecenter);
  // Only use ResizeObserver in non-embed mode to avoid interference
  if (!isEmbedMode && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resizeAndRecenter);
    resizeObserver.observe(svgDiv);
  }
  
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', d => 0.5 + (d.value / maxLinkValue) * 4)
    .attr('stroke-opacity', 0.4);
  
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Main shapes - circles for institutions, rectangles for genres/subgenres
  const shapes = node.append(d => {
    if (d.type === 'institution') {
      return document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    } else {
      return document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    }
  });
  
  // Style circles (institutions)
  shapes.filter(function(d) { return d.type === 'institution'; })
    .attr('r', d => 6 + (d.genreCount / maxInstGenres) * 12)
    .attr('fill', d => getInstColor(d.country))
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  // Style rectangles (genres/subgenres) - single color
  shapes.filter(function(d) { return d.type !== 'institution'; })
    .attr('width', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return (baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 2;
    })
    .attr('height', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return (baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 1.5;
    })
    .attr('x', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return -(baseSize + (d.totalOccurrences / maxGenreInsts) * 10);
    })
    .attr('y', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return -(baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 0.75;
    })
    .attr('rx', 3)
    .attr('fill', levelFilter === 'genre' ? '#f59e0b' : '#a855f7')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  const circles = shapes;
  
  // Add glow effect for hubs
  node.filter(d => d.isHub).each(function(d) {
    const hubNode = d3.select(this);
    if (d.type === 'institution') {
      hubNode.append('circle')
        .attr('r', (6 + (d.genreCount / maxInstGenres) * 12) + 4)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    } else {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      const nodeSize = baseSize + (d.totalOccurrences / maxGenreInsts) * 10;
      hubNode.append('rect')
        .attr('width', (nodeSize * 2) + 8)
        .attr('height', (nodeSize * 1.5) + 6)
        .attr('x', -(nodeSize + 4))
        .attr('y', -(nodeSize * 0.75 + 3))
        .attr('rx', 3)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    }
  });
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 30 ? d.name.substring(0, 27) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => {
      if (d.type === 'institution') {
        return (6 + (d.genreCount / maxInstGenres) * 12) + 14;
      } else {
        const baseSize = d.type === 'subgenre' ? 5 : 6;
        return ((baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 0.75) + 16;
      }
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', d => d.isHub || d.isBridge ? '10px' : '9px')
    .attr('font-weight', d => d.isHub || d.isBridge ? '700' : '600')
    .attr('fill', '#1e293b')
    .style('pointer-events', 'none')
    .style('user-select', 'none');
  
  node.append('title')
    .text(d => {
      if (d.type === 'institution') {
        return `${d.name}\n${d.country} - ${d.region}\n${d.genreCount} genre occurrences\n${d.totalTexts} texts`;
      } else {
        return `${d.name}\n${d.institutionCount} institutions\n${d.totalOccurrences} total occurrences`;
      }
    });
  
  // Hover highlighting with tooltip
  let tooltipRect = null;
  node.on('mouseenter', function(event, d) {
    // Cache bounding rect
    tooltipRect = svgDiv.getBoundingClientRect();
    
    const rows = d.type === 'institution'
      ? [['Type', 'Institution'], ['Country', d.country || '—'], ['Region', d.region || '—'], [`Total ${itemLabel}`, d.genreCount], [`Unique ${itemLabel}`, d.uniqueGenres.size], ['Texts', d.totalTexts]]
      : [['Type', d.type === 'genre' ? 'Genre' : 'Subgenre'], ['Institutions', d.institutionCount], ['Unique', d.uniqueInstitutions.size], ['Total', d.totalOccurrences]];
    renderNetworkTooltip(tooltip, d.name, rows, d);
    tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
    tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    tooltip.style.opacity = '1';
    
    const connectedNodeIds = new Set();
    link.style('stroke-opacity', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        connectedNodeIds.add(l.source.id);
        connectedNodeIds.add(l.target.id);
        return 0.8;
      }
      return 0.1;
    }).style('stroke-width', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        return (0.5 + (l.value / maxLinkValue) * 4) * 1.5;
      }
      return 0.5 + (l.value / maxLinkValue) * 4;
    }).style('stroke', l => {
      if (l.source.id === d.id || l.target.id === d.id) return '#2563eb';
      return '#cbd5e1';
    });
    
    node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.3);
  })
  .on('mousemove', function(event) {
    if (tooltipRect) {
      tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
      tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    }
  })
  .on('mouseleave', function() {
    tooltip.style.opacity = '0';
    tooltipRect = null;
    link.style('stroke-opacity', 0.4)
        .style('stroke-width', l => 0.5 + (l.value / maxLinkValue) * 4)
        .style('stroke', '#cbd5e1');
    node.style('opacity', 1);
  });
  
  // Click to focus
  node.on('click', function(event, d) {
    event.stopPropagation();
    const scale = 1.5;
    const x = -d.x * scale + width / 2;
    const y = -d.y * scale + height / 2;
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  });
  
  function updateNodeSizes(scale) {
    const inverseScale = 1 / scale;
    shapes.each(function(d) {
      const shape = d3.select(this);
      if (d.type === 'institution') {
        shape.attr('r', (6 + (d.genreCount / maxInstGenres) * 12) * inverseScale);
      } else {
        const baseSize = d.type === 'subgenre' ? 5 : 6;
        const nodeSize = baseSize + (d.totalOccurrences / maxGenreInsts) * 10;
        shape.attr('width', nodeSize * 2 * inverseScale)
             .attr('height', nodeSize * 1.5 * inverseScale)
             .attr('x', -nodeSize * inverseScale)
             .attr('y', -nodeSize * 0.75 * inverseScale);
      }
    });
    nodeLabels.attr('font-size', `${9 * inverseScale}px`)
      .attr('y', d => {
        if (d.type === 'institution') {
          return ((6 + (d.genreCount / maxInstGenres) * 12) + 14) * inverseScale;
        } else {
          const baseSize = d.type === 'subgenre' ? 5 : 6;
          return (((baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 0.75) + 16) * inverseScale;
        }
      });
    link.attr('stroke-width', function(l) {
      const currentOpacity = parseFloat(d3.select(this).style('stroke-opacity')) || 1;
      const baseWidth = 0.5 + (l.value / maxLinkValue) * 4;
      return baseWidth * (currentOpacity > 0.5 ? 1.5 : 1) * inverseScale;
    });
  }
  
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
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Fit to view after simulation stabilizes
  simulation.on('end', () => {
    setTimeout(() => fitToView(), 100);
  });
}

// Scribe-Genre/Subgenre Network Functions
function buildScribeGenreNetwork() {
  buildScribeNetwork('genre', 'horizontal');
}

function buildScribeSubgenreNetwork() {
  buildScribeNetwork('subgenre', 'horizontal');
}

function buildScribeNetwork(levelFilter = 'genre', layout = 'horizontal') {
  disposeNetwork('scribe');
  const container = document.getElementById('scribe-network-viz');
  if (!container) return;
  
  // Build network data connecting scribes to genres/subgenres
  const scribeNodes = new Map();
  const genreNodes = new Map();
  const links = [];
  
  // Process scribal units to connect scribes to genres
  // Note: Scribal units are directly linked to texts via relationship records,
  // because scribes don't necessarily copy all texts in a production unit
  ((getDATA() || {}).su || []).forEach(su => {
    const suId = String(su.rec_ID);
    const scribes = getScribesForSU(su);
    
    if (scribes.length === 0) return;
    
    // Get texts directly linked to this scribal unit via relationships
    const suRels = [
      ...((getREL_INDEX() || {}).bySource?.[suId] || []),
      ...((getREL_INDEX() || {}).byTarget?.[suId] || [])
    ];
    
    const textGenres = new Set();
    
    suRels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const srcId = src?.id ? String(src.id) : null;
      const tgtId = tgt?.id ? String(tgt.id) : null;
      
      // Get the other record (the one that's not the SU)
      const otherId = srcId === suId ? tgtId : (tgtId === suId ? srcId : null);
      if (!otherId) return;
      
      const text = (getIDX() || {}).tx?.[otherId];
      
      if (text) {
        const fieldName = levelFilter === 'genre' ? 'Genre' : 'Subgenre';
        const prefix = levelFilter === 'genre' ? 'genre' : 'sub';
        getControlledValsAll(text, fieldName).forEach(value => {
          textGenres.add(`${prefix}:${value}`);
        });
      }
    });
    
    if (textGenres.size === 0) return;
    
    // Create nodes and links for each scribe
    scribes.forEach(scribe => {
      const scribeId = `scribe-${scribe.scribeId}`;
      
      if (!scribeNodes.has(scribeId)) {
        scribeNodes.set(scribeId, {
          id: scribeId,
          name: scribe.scribeName,
          type: 'scribe',
          genreCount: 0,
          uniqueGenres: new Set()
        });
      }
      
      const scribeNode = scribeNodes.get(scribeId);
      scribeNode.genreCount += textGenres.size;
      
      textGenres.forEach(genreKey => {
        const [type, name] = genreKey.split(':');
        const isSubgenre = type === 'sub';
        
        scribeNode.uniqueGenres.add(name);
        
        if (!genreNodes.has(genreKey)) {
          genreNodes.set(genreKey, {
            id: genreKey,
            name: name,
            type: isSubgenre ? 'subgenre' : 'genre',
            scribeCount: 0,
            uniqueScribes: new Set()
          });
        }
        
        const genreNode = genreNodes.get(genreKey);
        genreNode.scribeCount++;
        genreNode.uniqueScribes.add(scribeId);
        
        links.push({
          source: scribeId,
          target: genreKey,
          value: 1
        });
      });
    });
  });
  
  const nodeArray = [...scribeNodes.values(), ...genreNodes.values()];
  
  if (!scribeNodes.size || !genreNodes.size || !links.length) {
    container.innerHTML = `<div class="explore-empty-state">No scribe–${levelFilter} relationships found.</div>`;
    return;
  }
  
  container.innerHTML = '';
  
  // Detect bridge nodes and hubs
  const avgScribeGenres = Array.from(scribeNodes.values()).reduce((sum, n) => sum + n.uniqueGenres.size, 0) / scribeNodes.size;
  const avgGenreScribes = Array.from(genreNodes.values()).reduce((sum, n) => sum + n.uniqueScribes.size, 0) / genreNodes.size;
  
  scribeNodes.forEach(node => {
    node.isBridge = node.uniqueGenres.size > avgScribeGenres * 1.5;
    node.isHub = node.genreCount > avgScribeGenres * 2;
  });
  
  genreNodes.forEach(node => {
    node.isBridge = node.uniqueScribes.size > avgGenreScribes * 1.5;
    node.isHub = node.scribeCount > avgGenreScribes * 2;
  });
  
  const bridgeCount = Array.from(scribeNodes.values()).filter(n => n.isBridge).length + 
                      Array.from(genreNodes.values()).filter(n => n.isBridge).length;
  const hubCount = Array.from(scribeNodes.values()).filter(n => n.isHub).length + 
                   Array.from(genreNodes.values()).filter(n => n.isHub).length;
  
  const itemCount = genreNodes.size;
  const itemLabel = levelFilter === 'genre' ? 'genres' : 'subgenres';
  
  // Detect embed mode
  const isEmbedMode = document.documentElement.classList.contains('embed-mode');
  
  // Controls bar
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; flex-wrap: wrap; gap: 0.75rem;';
  controlsDiv.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      <button id="scribe-zoom-in" style="padding: 0.375rem 0.75rem; background: #22c55e; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom In</button>
      <button id="scribe-zoom-out" style="padding: 0.375rem 0.75rem; background: #22c55e; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom Out</button>
      <button id="scribe-reset" style="padding: 0.375rem 0.75rem; background: #64748b; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Reset View</button>
      <button id="scribe-toggle-labels" class="explore-action-btn explore-action-btn--compact">Hide labels</button>
      <button id="scribe-toggle-singles" style="padding: 0.375rem 0.75rem; background: #ec4899; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Singles</button>
    </div>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <span style="font-size: 0.875rem; color: #64748b; font-weight: 600;">${scribeNodes.size} scribes • ${itemCount} ${itemLabel} • ${bridgeCount} bridges • ${hubCount} hubs</span>
      ${createEmbedButton(`scribe-${levelFilter}`)}
      ${createExportButton('scribe-network-viz', `scribe-${itemLabel}-network.png`)}
    </div>
  `;
  container.appendChild(controlsDiv);
  
  // Genre categorization
  const genreCategories = {
    'devotional': ['prayer', 'psalm', 'hour', 'devotion', 'hymn', 'liturgical', 'liturg', 'office', 'mass', 'breviary', 'missal', 'gospel', 'bible', 'saint', 'vita', 'hagiograph'],
    'medical': ['medical', 'medicine', 'remedy', 'recipe', 'herbal', 'health', 'cure', 'physician', 'surgery', 'apothecary'],
    'legal': ['legal', 'law', 'charter', 'document', 'contract', 'statute', 'decree', 'ordinance', 'privilege'],
    'scholastic': ['commentary', 'treatise', 'sermon', 'theological', 'theology', 'philosophy', 'logic', 'summa', 'quaestio', 'disputation', 'gloss'],
    'literary': ['poetry', 'poem', 'chronicle', 'history', 'letter', 'epistle', 'romance', 'fable', 'story', 'narrative', 'epic'],
    'scientific': ['astronomy', 'astrology', 'arithmetic', 'geometry', 'mathematics', 'natural', 'science', 'computation'],
    'grammatical': ['grammar', 'grammatical', 'vocabulary', 'dictionary', 'gloss', 'linguistic']
  };
  const genreCategoryColors = {
    'devotional': '#a855f7',
    'medical': '#22c55e',
    'legal': '#0ea5e9',
    'scholastic': '#f59e0b',
    'literary': '#ec4899',
    'scientific': '#8b5cf6',
    'grammatical': '#14b8a6',
    'other': '#94a3b8'
  };
  
  const getGenreCategory = genre => {
    if (!genre) return 'other';
    const lowerGenre = genre.toLowerCase();
    for (const [category, keywords] of Object.entries(genreCategories)) {
      if (keywords.some(kw => lowerGenre.includes(kw))) {
        return category;
      }
    }
    return 'other';
  };
  const getGenreColor = genre => {
    const category = getGenreCategory(genre);
    return genreCategoryColors[category];
  };
  
  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.875rem;';
  legendDiv.innerHTML = `
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: #22c55e; border-radius: 50%; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600;">Scribes (circles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 12px; background: ${levelFilter === 'genre' ? '#f59e0b' : '#a855f7'}; border-radius: 3px; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${itemLabel} (rectangles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: white; border-radius: 50%; border: 3px solid #dc2626;"></div>
        <span style="color: #1e293b; font-weight: 600;">Bridge Nodes</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 20px; height: 20px; background: white; border-radius: 50%; border: 3px solid #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);"></div>
        <span style="color: #1e293b; font-weight: 600;">Major Hubs</span>
      </div>
    </div>
    <div style="color: #64748b; font-size: 0.75rem;">
      Scribes at top, ${itemLabel} at bottom | Node size = connections | Bridges connect diverse ${itemLabel} | Hubs show specialists or popular ${itemLabel} | Hover to highlight | Drag to reposition | Click to focus
    </div>
  `;
  container.appendChild(legendDiv);
  
  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.style.cssText = 'width: 100%; max-width: 100%; min-height: 1200px; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa; overflow: hidden; position: relative; box-sizing: border-box;';
  container.appendChild(svgDiv);
  
  // Create tooltip div
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position: absolute; background: white; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.875rem; pointer-events: none; opacity: 0; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 300px;';
  svgDiv.appendChild(tooltip);
  
  // Get actual container dimensions
  function getSize(el) {
    const r = el.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }
  
  // D3 force layout - use container dimensions for viewBox
  let { w: width, h: height } = getSize(svgDiv);
  // Wait for real dimensions if container not yet sized
  if (width <= 50 || height <= 50) {
    width = 1200;
    height = 1200;
  }
  
  const svg = d3.select(svgDiv)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'block');
  
  const g = svg.append('g');
  
  // Zoom behavior
  let currentTransform = d3.zoomIdentity;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      currentTransform = event.transform;
      g.attr('transform', event.transform);
      updateNodeSizes(event.transform.k);
    });
  
  svg.call(zoom);
  
  // Fit network to view - centers and scales to fit container
  function fitToView() {
    const { w, h } = getSize(svgDiv);
    if (w <= 1 || h <= 1) return;
    
    try {
      const bbox = g.node().getBBox();
      if (!bbox.width || !bbox.height) return;
      
      const pad = 40;
      const scale = Math.min(
        (w - pad) / bbox.width,
        (h - pad) / bbox.height,
        1.5  // Don't zoom in too much
      );
      
      const tx = (w / 2) - scale * (bbox.x + bbox.width / 2);
      const ty = (h / 2) - scale * (bbox.y + bbox.height / 2);
      
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    } catch (e) {
      // If bbox fails, just reset to identity
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    }
  }
  
  // Zoom controls
  document.getElementById('scribe-zoom-in').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1.3);
  };
  document.getElementById('scribe-zoom-out').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 0.7);
  };
  document.getElementById('scribe-reset').onclick = () => {
    fitToView();
  };
  
  // Toggle labels
  let labelsVisible = true;
  document.getElementById('scribe-toggle-labels').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('display', labelsVisible ? 'block' : 'none');
    this.textContent = labelsVisible ? 'Hide labels' : 'Show labels';
  };
  
  // Toggle singles (nodes with only 1 connection)
  let singlesVisible = true;
  document.getElementById('scribe-toggle-singles').onclick = function() {
    singlesVisible = !singlesVisible;
    node.style('display', d => {
      const connectionCount = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
      return (!singlesVisible && connectionCount === 1) ? 'none' : 'block';
    });
    link.style('display', l => {
      const sourceCount = links.filter(lnk => lnk.source.id === l.source.id || lnk.target.id === l.source.id).length;
      const targetCount = links.filter(lnk => lnk.source.id === l.target.id || lnk.target.id === l.target.id).length;
      return (!singlesVisible && (sourceCount === 1 || targetCount === 1)) ? 'none' : 'block';
    });
    this.textContent = singlesVisible ? 'Hide Singles' : 'Show Singles';
  };
  
  // Calculate node sizes
  const maxScribeGenres = Math.max(...Array.from(scribeNodes.values()).map(d => d.genreCount), 1);
  const maxGenreScribes = Math.max(...Array.from(genreNodes.values()).map(d => d.scribeCount), 1);
  
  // Configure force simulation based on layout
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('collision', d3.forceCollide().radius(d => {
      const baseR = d.type === 'scribe' ? 4 + (d.genreCount / maxScribeGenres) * 8 : 5 + (d.scribeCount / maxGenreScribes) * 12;
      return baseR + 5;
    }));

  let resizeObserver = null;
  registerNetworkDisposer('scribe', () => {
    simulation.stop();
    simulation.on('tick', null).on('end', null);
    window.removeEventListener('resize', resizeAndRecenter);
    resizeObserver?.disconnect();
    clearTimeout(resizeTimeout);
    svg.interrupt();
  });
  
  if (layout === 'horizontal') {
    // Horizontal layout: scribes at top, genres at bottom
    simulation
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(d => d.type === 'scribe' ? height * 0.25 : height * 0.75).strength(0.9));
  } else {
    // Radial layout: force-directed with center gravity
    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));
  }
  
  // Resize handler to recenter when container size changes
  let resizeTimeout;
  let lastResizeWidth = width;
  let lastResizeHeight = height;
  const RESIZE_THRESHOLD = 10; // Only resize if change exceeds 10px
  const RESIZE_DEBOUNCE = 150; // Wait 150ms after last resize event
  
  function resizeAndRecenter() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const { w, h } = getSize(svgDiv);
      
      if (w <= 1 || h <= 1) {
        return;
      }
      
      // Use threshold to prevent micro-changes from triggering resize
      const widthDiff = Math.abs(w - lastResizeWidth);
      const heightDiff = Math.abs(h - lastResizeHeight);
      
      if (widthDiff < RESIZE_THRESHOLD && heightDiff < RESIZE_THRESHOLD) {
        return;
      }
      
      lastResizeWidth = w;
      lastResizeHeight = h;
      width = w;
      height = h;
      svg.attr('viewBox', `0 0 ${width} ${height}`);
      
      if (layout === 'horizontal') {
        simulation
          .force('x', d3.forceX(width / 2).strength(0.05))
          .force('y', d3.forceY(d => d.type === 'scribe' ? height * 0.25 : height * 0.75).strength(0.9));
      } else {
        simulation
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('x', d3.forceX(width / 2).strength(0.03))
          .force('y', d3.forceY(height / 2).strength(0.03));
      }
      simulation.alpha(0.3).restart();
      
      // CRITICAL: Fit to view to properly center after resize
      // Wait for simulation to settle a bit before fitting
      setTimeout(() => fitToView(), 300);
    }, RESIZE_DEBOUNCE);
  }
  
  window.addEventListener('resize', resizeAndRecenter);
  // Only use ResizeObserver in non-embed mode to avoid interference
  if (!isEmbedMode && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resizeAndRecenter);
    resizeObserver.observe(svgDiv);
  }
  
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.4);
  
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Main shapes - circles for scribes, rectangles for genres/subgenres
  const shapes = node.append(d => {
    if (d.type === 'scribe') {
      return document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    } else {
      return document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    }
  });
  
  // Style circles (scribes)
  shapes.filter(function(d) { return d.type === 'scribe'; })
    .attr('r', d => 4 + (d.genreCount / maxScribeGenres) * 8)
    .attr('fill', '#22c55e')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  // Style rectangles (genres/subgenres) - single color
  shapes.filter(function(d) { return d.type !== 'scribe'; })
    .attr('width', d => (5 + (d.scribeCount / maxGenreScribes) * 12) * 2)
    .attr('height', d => (5 + (d.scribeCount / maxGenreScribes) * 12) * 1.5)
    .attr('x', d => -(5 + (d.scribeCount / maxGenreScribes) * 12))
    .attr('y', d => -(5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75)
    .attr('rx', 3)
    .attr('fill', levelFilter === 'genre' ? '#f59e0b' : '#a855f7')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  const circles = shapes;
  
  // Add glow effect for hubs
  node.filter(d => d.isHub).each(function(d) {
    const hubNode = d3.select(this);
    if (d.type === 'scribe') {
      hubNode.append('circle')
        .attr('r', (4 + (d.genreCount / maxScribeGenres) * 8) + 4)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    } else {
      hubNode.append('rect')
        .attr('width', ((5 + (d.scribeCount / maxGenreScribes) * 12) * 2) + 8)
        .attr('height', ((5 + (d.scribeCount / maxGenreScribes) * 12) * 1.5) + 6)
        .attr('x', -((5 + (d.scribeCount / maxGenreScribes) * 12) + 4))
        .attr('y', -((5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75 + 3))
        .attr('rx', 3)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    }
  });
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 30 ? d.name.substring(0, 27) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => {
      if (d.type === 'scribe') {
        return (4 + (d.genreCount / maxScribeGenres) * 8) + 14;
      } else {
        return ((5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75) + 16;
      }
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', d => d.isHub || d.isBridge ? '10px' : '9px')
    .attr('font-weight', d => d.isHub || d.isBridge ? '700' : '600')
    .attr('fill', '#1e293b')
    .style('pointer-events', 'none')
    .style('user-select', 'none');
  
  node.append('title')
    .text(d => {
      if (d.type === 'scribe') {
        return `${d.name}\n${d.genreCount} ${itemLabel}`;
      } else {
        return `${d.name}\n${d.scribeCount} scribe${d.scribeCount !== 1 ? 's' : ''}`;
      }
    });
  
  // Hover highlighting with tooltip
  let tooltipRect = null;
  node.on('mouseenter', function(event, d) {
    // Cache bounding rect
    tooltipRect = svgDiv.getBoundingClientRect();
    
    const rows = d.type === 'scribe'
      ? [['Type', 'Scribe'], [`Total ${itemLabel}`, d.genreCount], [`Unique ${itemLabel}`, d.uniqueGenres.size]]
      : [['Type', d.type === 'genre' ? 'Genre' : 'Subgenre'], ['Scribes', d.scribeCount], ['Unique', d.uniqueScribes.size]];
    renderNetworkTooltip(tooltip, d.name, rows, d);
    tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
    tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    tooltip.style.opacity = '1';
    
    const connectedNodeIds = new Set();
    link.style('stroke-opacity', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        connectedNodeIds.add(l.source.id);
        connectedNodeIds.add(l.target.id);
        return 0.8;
      }
      return 0.1;
    }).style('stroke-width', l => {
      if (l.source.id === d.id || l.target.id === d.id) return 2.5;
      return 1;
    }).style('stroke', l => {
      if (l.source.id === d.id || l.target.id === d.id) return '#2563eb';
      return '#cbd5e1';
    });
    
    node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.3);
  })
  .on('mousemove', function(event) {
    if (tooltipRect) {
      tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
      tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    }
  })
  .on('mouseleave', function() {
    tooltip.style.opacity = '0';
    tooltipRect = null;
    link.style('stroke-opacity', 0.4)
        .style('stroke-width', 1)
        .style('stroke', '#cbd5e1');
    node.style('opacity', 1);
  });
  
  // Click to focus
  node.on('click', function(event, d) {
    event.stopPropagation();
    const scale = 1.5;
    const x = -d.x * scale + width / 2;
    const y = -d.y * scale + height / 2;
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  });
  
  function updateNodeSizes(scale) {
    const inverseScale = 1 / scale;
    shapes.each(function(d) {
      const shape = d3.select(this);
      if (d.type === 'scribe') {
        shape.attr('r', (4 + (d.genreCount / maxScribeGenres) * 8) * inverseScale);
      } else {
        const baseSize = 5 + (d.scribeCount / maxGenreScribes) * 12;
        shape.attr('width', baseSize * 2 * inverseScale)
             .attr('height', baseSize * 1.5 * inverseScale)
             .attr('x', -baseSize * inverseScale)
             .attr('y', -baseSize * 0.75 * inverseScale);
      }
    });
    nodeLabels.attr('font-size', `${9 * inverseScale}px`)
      .attr('y', d => {
        if (d.type === 'scribe') {
          return ((4 + (d.genreCount / maxScribeGenres) * 8) + 14) * inverseScale;
        } else {
          return (((5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75) + 16) * inverseScale;
        }
      });
    link.attr('stroke-width', function(l) {
      const currentOpacity = parseFloat(d3.select(this).style('stroke-opacity'));
      return (currentOpacity > 0.5 ? 2.5 : 1) * inverseScale;
    });
  }
  
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
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Fit to view after simulation stabilizes
  simulation.on('end', () => {
    setTimeout(() => fitToView(), 100);
  });
}


      return {
        buildTextGenres, buildManuscriptGenreNetwork, buildManuscriptSubgenreNetwork, buildManuscriptNetwork, buildGenreDistributions, buildGenresByInstitution, buildGenresByLocation, buildGenresOverTime, buildInstitutionGenreNetwork, buildInstitutionSubgenreNetwork, buildInstitutionNetwork, buildScribeGenreNetwork, buildScribeSubgenreNetwork, buildScribeNetwork, disposeNetworks: disposeAllNetworks
      };
    }
  };
})();
