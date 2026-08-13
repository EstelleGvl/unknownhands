
/* ============================================================
   Explore Map Module
   ============================================================ */
window.ExploreMap = {
  init: function(Core) {
    // Unpack core dependencies dynamically because they update
    const { 
      val, getVal, getDetail, getRes, getDetailsAll, getValsAll,
      $panes, $tabs, $mapTitle, esc
    } = Core;
    
    // Bind data access getters so Map always sees latest data without re-assigning
    const getDATA = () => Core.DATA;
    const getIDX = () => Core.IDX;
    const getActiveEntity = () => Core.activeEntity;
    const getENTITY = () => Core.ENTITY;
    const MAP = Core.MAP;
    const isKnownCategory = Core.isKnownCategory;

    /* ---------- Map (Leaflet) ---------- */
let leafletLoaded=false;
let leafletPluginsLoaded=false;

function ensureLeaflet(){
  return new Promise((resolve)=>{
    if (leafletLoaded && leafletPluginsLoaded) return resolve();
    
    // Load base Leaflet first
    if (!leafletLoaded) {
      const link=document.createElement('link'); link.rel='stylesheet';
      link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
      const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload=()=>{ 
        leafletLoaded=true;
        loadLeafletPlugins(resolve);
      }; 
      document.body.appendChild(s);
    } else {
      loadLeafletPlugins(resolve);
    }
  });
}

function loadLeafletPlugins(callback) {
  if (leafletPluginsLoaded) return callback();
  
  // Load MarkerCluster CSS
  const clusterCSS = document.createElement('link');
  clusterCSS.rel = 'stylesheet';
  clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
  document.head.appendChild(clusterCSS);
  
  const clusterDefaultCSS = document.createElement('link');
  clusterDefaultCSS.rel = 'stylesheet';
  clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
  document.head.appendChild(clusterDefaultCSS);
  
  // Load MarkerCluster JS
  const clusterScript = document.createElement('script');
  clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
  clusterScript.onload = () => {
    // Load Heatmap plugin
    const heatScript = document.createElement('script');
    heatScript.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    heatScript.onload = () => {
      leafletPluginsLoaded = true;
      callback();
    };
    document.body.appendChild(heatScript);
  };
  document.body.appendChild(clusterScript);
}
function parseWKTPoint(wkt){ if (!wkt) return null; const m=String(wkt).match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/i); return m?{lng:parseFloat(m[1]),lat:parseFloat(m[2])}:null; }
function coordsFromHoldingInstitution(msRec){
  const hiRes = getRes(msRec,'Holding Institution'); if (!hiRes||!hiRes.id) return null;
  const hi = getIDX().hi[String(hiRes.id)]; if (!hi) return null;
  const latD = getDetail(hi,'Latitude')?.value; const lonD = getDetail(hi,'Longitude')?.value;
  const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
  return parseWKTPoint(wkt);
}
function coordsFromProduction(msRec){
  const msId = String(msRec.rec_ID);
  const pus = getDATA().pu.filter(p => String(getRes(p,'Manuscript')?.id) === msId);
  for (const pu of pus){
    const latD = getDetail(pu,'Latitude')?.value || getDetail(pu,'PU Latitude')?.value;
    const lonD = getDetail(pu,'Longitude')?.value || getDetail(pu,'PU Longitude')?.value;
    const wkt  = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
    const pt = parseWKTPoint(wkt); if (pt) return pt;
  }
  return null;
}
// Global map state
let MAP_INSTANCE = null;
let MAP_MARKERS_LAYER = null;
let MAP_CLUSTER_LAYER = null;
let MAP_HEATMAP_LAYER = null;
let MAP_CONNECTIONS_LAYER = null;
let MAP_ROUTES_LAYER = null;
let MAP_MARKERS_DATA = []; // Store marker data for filtering
let MAP_CURRENT_VIEW = 'ms-current'; // Current map view
let MAP_CONTROLS_INITIALIZED = false; // Flag to prevent duplicate event listeners

// Suggest appropriate map view based on current entity
function getSuggestedMapView(entity) {
  const suggestions = {
    'ms': 'ms-current',          // Manuscripts → Current Location
    'pu': 'pu-location',         // Production Units → All Locations
    'mi': 'mi-all',              // Monastic Institutions → All
    'su': 'ms-current',          // Scribal Units → default to manuscripts
    'hi': 'ms-current',          // Holding Institutions → show manuscripts there
    'hp': 'ms-current',          // Historical People → default to manuscripts
    'tx': 'ms-current'           // Texts → default to manuscripts
  };
  return suggestions[entity] || 'ms-current';
}

// Update map controls visibility and legend based on view type
function updateMapControls(viewType) {
  // Show/hide connection lines (only for movement views)
  const isMovementView = viewType === 'ms-movement';
  const connectionsControl = document.getElementById('map-control-connections');
  const connectionsCheckbox = document.getElementById('map-show-connections');
  
  if (connectionsControl) {
    connectionsControl.style.display = isMovementView ? 'flex' : 'none';
    // Auto-enable connections for movement view
    if (isMovementView && connectionsCheckbox) {
      connectionsCheckbox.checked = true;
    }
  }
  
  // Show/hide time controls (only for production views)
  const isProductionView = viewType === 'ms-production' || viewType === 'pu-location' || viewType === 'pu-monastery';
  const timeControls = document.getElementById('map-time-controls');
  
  if (timeControls) {
    timeControls.style.display = isProductionView ? 'block' : 'none';
  }
  
  // Update legend
  const legendItems = document.getElementById('map-legend-items');
  if (legendItems) {
    let html = '';
    
    // Define legend based on view type
    if (viewType === 'ms-current' || viewType === 'ms-production') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#3388ff;"></span> Manuscript</div>';
    } else if (viewType === 'ms-movement') {
      html += '<div style="display:flex;align-items:center;gap:0.5rem;">';
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#10b981;"></span> Production location</div>';
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:20px;height:3px;background:#fb923c;"></span> Movement</div>';
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ef4444;"></span> Current location</div>';
      html += '</div>';
    } else if (viewType === 'pu-location') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ff7800;"></span> Production Unit</div>';
    } else if (viewType === 'pu-monastery') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#c4941f;"></span> Monastery (with PUs)</div>';
    } else if (viewType === 'mi-all') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#d4af37;"></span> Monastic Institution</div>';
    }
    
    legendItems.innerHTML = html;
  }
}

async function buildMap(){
  await ensureLeaflet();

  // Get selected map view - default to 'ms-current'
  const viewSelector = document.getElementById('map-view-selector');
  if (!MAP_CURRENT_VIEW) {
    MAP_CURRENT_VIEW = 'ms-current';
    if (viewSelector) viewSelector.value = 'ms-current';
  }
  
  MAP_CURRENT_VIEW = viewSelector?.value || 'ms-current';
  
  // Update controls and legend for this view
  updateMapControls(MAP_CURRENT_VIEW);

  // Update title based on view
  const viewTitles = {
    'ms-current': 'Map — Manuscripts by Current Location (Holdings)',
    'ms-production': 'Map — Manuscripts by Production Location',
    'ms-movement': 'Map — Manuscript Movement (Production → Current)',
    'pu-location': 'Map — Production Units (All Locations)',
    'pu-monastery': 'Map — Production Units by Monastery',
    'mi-all': 'Map — Monastic Institutions',
    'scribes-female': 'Map — Female Scribes Work Locations',
    'scribes-all': 'Map — All Scribes Work Locations'
  };
  $mapTitle.textContent = viewTitles[MAP_CURRENT_VIEW] || 'Map';
  
  // Show hint for entity types without direct map representation
  const hintEl = document.getElementById('map-view-hint');
  const entityHasDirectMap = ['ms', 'pu', 'mi', 'su', 'hi'].includes(getENTITY());
  if (hintEl) {
    if (!entityHasDirectMap) {
      hintEl.style.display = 'block';
      hintEl.textContent = `Tip: Viewing ${getENTITY().toUpperCase()} records, but map shows related geographic data. Change "Map View" above to explore different aspects.`;
    } else {
      hintEl.style.display = 'none';
    }
  }

  // fresh mount to avoid Leaflet errors between entity switches
  let mount = document.getElementById('map-mount');
  if (!mount) return;
  if (mount._leaflet_id){ 
    if (MAP_INSTANCE) {
      MAP_INSTANCE.remove();
      MAP_INSTANCE = null;
    }
    const clone = mount.cloneNode(false); 
    mount.parentNode.replaceChild(clone, mount); 
    mount=clone; 
  }
  mount.innerHTML='';

  // Create map
  const map = L.map(mount).setView([47,8],4);
  MAP_INSTANCE = map;
  window.globalMap = map; // Store for export functionality
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap' }).addTo(map);

  // Collect marker data based on selected view
  MAP_MARKERS_DATA = collectMapData(MAP_CURRENT_VIEW);
  
  // Initial render
  renderMapLayers();
  
  // Setup event handlers (only once)
  if (!MAP_CONTROLS_INITIALIZED) {
    setupMapControls();
    MAP_CONTROLS_INITIALIZED = true;
  }
  
  // Fit bounds
  if (MAP_MARKERS_DATA.length) {
    const bounds = L.latLngBounds(MAP_MARKERS_DATA.map(m => [m.pt.lat, m.pt.lng]));
    window.globalMapBounds = bounds; // Store for export functionality
    map.fitBounds(bounds.pad(0.2));
  } else {
    map.setView([47,8],4);
    window.globalMapBounds = null;
    mount.insertAdjacentHTML('beforeend','<div class="muted" style="padding:.75rem">No mappable coordinates for this view.</div>');
  }
}

// Collect map data based on selected view
function collectMapData(viewType) {
  const markers = [];
  
  const getYear = s => {
    if (!s) return null;
    // Handle date objects
    if (typeof s === 'object' && s.value) s = s.value;
    // Convert to string
    const str = String(s);
    // Try to extract year - handle formats like "1454-12-31", "1454", or "c. 1450"
    const m = str.match(/\b([12]\d{3})\b/);
    if (!m) return null;
    const y = parseInt(m[1], 10);
    return (y >= 800 && y <= 1600) ? y : null;
  };
  
  switch(viewType) {
    case 'ms-current':
      // Manuscripts by current holding location
      getDATA().ms.forEach(rec => {
        const pt = coordsFromHoldingInstitution(rec);
        if (!pt) return;
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) || 
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.ms.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get holding institution name
        const hiRes = getRes(rec,'Holding Institution');
        const hiName = hiRes?.title || 'Unknown location';
        
        markers.push({
          rec, pt, year, id, title,
          entity: 'ms',
          subtitle: hiName,
          category: 'manuscript'
        });
      });
      break;
      
    case 'ms-production':
      // Manuscripts by their ACTUAL production location (not fallback)
      getDATA().ms.forEach(rec => {
        const prodPt = coordsFromProduction(rec);
        if (!prodPt) return; // Only show manuscripts with actual production location
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) || 
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.ms.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get production location name
        const msId = String(rec.rec_ID);
        const pus = getDATA().pu.filter(p => String(getRes(p,'Manuscript')?.id) === msId);
        const puCountry = pus.length > 0 ? getVal(pus[0], 'PU country') : null;
        const puCity = pus.length > 0 ? getVal(pus[0], 'PU City') : null;
        const prodLocation = [puCity, puCountry].filter(isKnownCategory).join(', ') || 'Production location';
        
        markers.push({
          rec, pt: prodPt, prodPt, year, id, title,
          entity: 'ms',
          subtitle: prodLocation,
          category: 'manuscript'
        });
      });
      break;
      
    case 'ms-movement':
      // Manuscript movement: production → current location
      getDATA().ms.forEach(rec => {
        const prodPt = coordsFromProduction(rec);
        const holdPt = coordsFromHoldingInstitution(rec);
        
        // Only show if we have BOTH locations and they're DIFFERENT
        if (!prodPt || !holdPt) return;
        if (Math.abs(prodPt.lat - holdPt.lat) < 0.01 && Math.abs(prodPt.lng - holdPt.lng) < 0.01) return;
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) || 
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.ms.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get location names
        const msId = String(rec.rec_ID);
        const pus = getDATA().pu.filter(p => String(getRes(p,'Manuscript')?.id) === msId);
        const puCountry = pus.length > 0 ? getVal(pus[0], 'PU country') : null;
        const puCity = pus.length > 0 ? getVal(pus[0], 'PU City') : null;
        const prodLocation = [puCity, puCountry].filter(isKnownCategory).join(', ') || 'Production';
        
        const hiRes = getRes(rec,'Holding Institution');
        const hi = hiRes?.id ? getIDX().hi[String(hiRes.id)] : null;
        const hiCountry = hi ? getVal(hi, 'Country') : null;
        const hiCity = hi ? getVal(hi, 'City') : null;
        const currentLocation = [hiCity, hiCountry].filter(isKnownCategory).join(', ') || 'Current location';
        
        markers.push({
          rec, pt: prodPt, prodPt, holdPt, year, id, title,
          entity: 'ms',
          subtitle: `${prodLocation} → ${currentLocation}`,
          movement: { from: prodLocation, to: currentLocation },
          category: 'manuscript-movement'
        });
      });
      break;
      
    case 'pu-location':
      // Production Units at their location
      getDATA().pu.forEach(rec => {
        const latD = getDetail(rec,'Latitude')?.value || getDetail(rec,'PU Latitude')?.value;
        const lonD = getDetail(rec,'Longitude')?.value || getDetail(rec,'PU Longitude')?.value;
        const wkt  = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
        const pt = parseWKTPoint(wkt);
        if (!pt) return;
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) ||
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.pu.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get linked monastery if any
        const miRes = getRes(rec,'Monastic Institution');
        const miName = miRes?.title || null;
        
        markers.push({
          rec, pt, year, id, title,
          entity: 'pu',
          subtitle: miName || 'Production Unit',
          monasteryName: miName,
          category: 'production'
        });
      });
      break;
      
    case 'pu-monastery':
      // Production Units grouped by their monastery location
      const monasteryGroups = {};
      
      getDATA().pu.forEach(rec => {
        const miRes = getRes(rec,'Monastic Institution');
        if (!miRes?.id) return;
        
        const miId = String(miRes.id);
        const mi = getIDX().mi[miId];
        if (!mi) return;
        
        // Get monastery coordinates
        const latD = getDetail(mi,'Latitude')?.value;
        const lonD = getDetail(mi,'Longitude')?.value;
        const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
        const pt = parseWKTPoint(wkt);
        if (!pt) return;
        
        if (!monasteryGroups[miId]) {
          monasteryGroups[miId] = {
            mi,
            pt,
            puList: [],
            title: (MAP.mi?.title(mi) || 'Unnamed Monastery').replace(/"/g,'&quot;'),
            id: miId
          };
        }
        monasteryGroups[miId].puList.push(rec);
      });
      
      // Convert groups to markers
      Object.values(monasteryGroups).forEach(group => {
        const year = getYear(getDetail(group.mi,'Creation date')?.value);
        markers.push({
          rec: group.mi,
          pt: group.pt,
          year,
          id: group.id,
          title: group.title,
          entity: 'mi',
          subtitle: `${group.puList.length} Production Unit${group.puList.length !== 1 ? 's' : ''}`,
          puCount: group.puList.length,
          puList: group.puList,
          category: 'monastery-pu'
        });
      });
      break;
      
    case 'mi-all':
      // All Monastic Institutions
      getDATA().mi.forEach(rec => {
        const latD = getDetail(rec,'Latitude')?.value;
        const lonD = getDetail(rec,'Longitude')?.value;
        const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
        const pt = parseWKTPoint(wkt);
        if (!pt) return;
        
        const year = getYear(getDetail(rec,'Creation date')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.mi?.title(rec) || 'Unnamed Monastery').replace(/"/g,'&quot;');
        
        // Count linked production units
        const linkedPUs = getDATA().pu.filter(pu => String(getRes(pu,'Monastic Institution')?.id) === id);
        
        markers.push({
          rec, pt, year, id, title,
          entity: 'mi',
          subtitle: linkedPUs.length ? `${linkedPUs.length} Production Unit${linkedPUs.length !== 1 ? 's' : ''}` : 'Monastic Institution',
          puCount: linkedPUs.length,
          category: 'monastery'
        });
      });
      break;
  }
  
  return markers.filter(marker =>
    isKnownCategory(marker.title) && isKnownCategory(marker.subtitle)
  );
}

// Helper: Get marker color based on category
function getMarkerColor(category) {
  const colors = {
    'manuscript': '#3388ff',      // Blue
    'manuscript-movement': '#fb923c', // Orange (for movement visualization)
    'production': '#ff7800',      // Orange
    'monastery': '#d4af37',       // Gold
    'monastery-pu': '#c4941f',    // Dark Gold
    'scribe': '#10b981'           // Green
  };
  return colors[category] || '#3388ff';
}

// Helper: Create popup HTML for marker
function createMarkerPopup(m) {
  let html = `<div style="min-width:220px">`;
  html += `<div style="font-weight:600;margin-bottom:.25rem">${m.title}</div>`;
  
  if (m.subtitle) {
    html += `<div style="font-size:0.875rem;color:#666;margin-bottom:.5rem">${m.subtitle}</div>`;
  }
  
  // Add category-specific info
  if (m.category === 'manuscript-movement') {
    if (m.productionLocation) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem"><strong>Production:</strong> ${m.productionLocation}</div>`;
    }
    if (m.currentLocation) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem"><strong>Current:</strong> ${m.currentLocation}</div>`;
    }
  }
  
  if (m.category === 'monastery-pu' && m.puCount) {
    html += `<div style="font-size:0.875rem;margin-bottom:.25rem">Production Units at this monastery:</div>`;
    html += `<div style="max-height:150px;overflow-y:auto;margin-bottom:.5rem">`;
    m.puList.slice(0, 10).forEach(pu => {
      const puTitle = (MAP.pu?.title(pu) || 'Untitled').replace(/"/g,'&quot;');
      html += `<div style="font-size:0.8rem;padding:0.125rem 0">• ${puTitle}</div>`;
    });
    if (m.puList.length > 10) {
      html += `<div style="font-size:0.8rem;color:#666;font-style:italic">+ ${m.puList.length - 10} more</div>`;
    }
    html += `</div>`;
  }
  
  if (m.category === 'scribe') {
    if (m.gender) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem">Gender: ${m.gender}</div>`;
    }
    if (m.manuscriptCount) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem">${m.manuscriptCount} manuscript${m.manuscriptCount !== 1 ? 's' : ''} at this location</div>`;
    }
  }
  
  if (m.monasteryName && m.category === 'production') {
    html += `<div style="font-size:0.875rem;color:#666;margin-bottom:.25rem">Monastery: ${m.monasteryName}</div>`;
  }
  
  if (m.puCount && m.category === 'monastery') {
    html += `<div style="font-size:0.875rem;color:#666;margin-bottom:.25rem">${m.puCount} Production Unit${m.puCount !== 1 ? 's' : ''} linked</div>`;
  }
  
  html += `<button class="chip" data-jump="${m.entity}:${m.id}">Open in results</button>`;
  html += `</div>`;
  
  return html;
}

function renderMapLayers() {
  if (!MAP_INSTANCE) return;
  
  // Clear existing layers
  if (MAP_MARKERS_LAYER) MAP_INSTANCE.removeLayer(MAP_MARKERS_LAYER);
  if (MAP_CLUSTER_LAYER) MAP_INSTANCE.removeLayer(MAP_CLUSTER_LAYER);
  if (MAP_HEATMAP_LAYER) MAP_INSTANCE.removeLayer(MAP_HEATMAP_LAYER);
  if (MAP_CONNECTIONS_LAYER) MAP_INSTANCE.removeLayer(MAP_CONNECTIONS_LAYER);
  if (MAP_ROUTES_LAYER) MAP_INSTANCE.removeLayer(MAP_ROUTES_LAYER);
  
  // Get control states
  const useClusters = document.getElementById('map-show-clusters')?.checked ?? true;
  const showConnections = document.getElementById('map-show-connections')?.checked ?? false;
  const showHeatmap = document.getElementById('map-show-heatmap')?.checked ?? false;
  const showRoutes = document.getElementById('map-show-routes')?.checked ?? false;
  
  // Get time filter
  const timeStart = parseInt(document.getElementById('map-time-start')?.value ?? 800);
  const timeEnd = parseInt(document.getElementById('map-time-end')?.value ?? 1600);
  
  // Filter markers by time
  const filtered = MAP_MARKERS_DATA.filter(m => {
    if (!m.year) return true; // Always include records without dates
    return m.year >= timeStart && m.year <= timeEnd;
  });
  
  // Update time range display
  const rangeDisplay = document.getElementById('map-time-range');
  if (rangeDisplay) {
    if (timeStart === 800 && timeEnd === 1600) {
      rangeDisplay.textContent = 'All dates';
    } else {
      rangeDisplay.textContent = `${timeStart}–${timeEnd}`;
    }
  }
  
  // Create markers
  if (useClusters) {
    // Use clustering
    MAP_CLUSTER_LAYER = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });
    
    filtered.forEach(m => {
      const markerColor = getMarkerColor(m.category);
      const marker = L.circleMarker([m.pt.lat, m.pt.lng], {radius:6, fillColor: markerColor, fillOpacity: 0.7, color: '#fff', weight: 1});
      marker.bindPopup(createMarkerPopup(m));
      marker.on('popupopen', (e)=>{
        const btn = e.popup.getElement().querySelector('[data-jump]');
        if (btn) {
          btn.addEventListener('click', ()=>{ jumpTo(m.entity, m.id); });
        }
      });
      MAP_CLUSTER_LAYER.addLayer(marker);
    });
    
    MAP_INSTANCE.addLayer(MAP_CLUSTER_LAYER);
  } else {
    // No clustering - simple markers
    MAP_MARKERS_LAYER = L.featureGroup();
    
    filtered.forEach(m => {
      const markerColor = getMarkerColor(m.category);
      const marker = L.circleMarker([m.pt.lat, m.pt.lng], {radius:6, fillColor: markerColor, fillOpacity: 0.7, color: '#fff', weight: 1});
      marker.bindPopup(createMarkerPopup(m));
      marker.on('popupopen', (e)=>{
        const btn = e.popup.getElement().querySelector('[data-jump]');
        if (btn) {
          btn.addEventListener('click', ()=>{ jumpTo(m.entity, m.id); });
        }
      });
      MAP_MARKERS_LAYER.addLayer(marker);
    });
    
    MAP_INSTANCE.addLayer(MAP_MARKERS_LAYER);
  }
  
  // Heatmap layer
  if (showHeatmap && filtered.length > 0) {
    const heatPoints = filtered.map(m => [m.pt.lat, m.pt.lng, 1]); // lat, lng, intensity
    MAP_HEATMAP_LAYER = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      max: 1.0,
      gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'}
    }).addTo(MAP_INSTANCE);
  }
  
  // Connection lines - context-dependent based on view
  if (showConnections) {
    MAP_CONNECTIONS_LAYER = L.featureGroup();
    
    filtered.forEach(m => {
      // Manuscript Movement: production → current location (show as curved arc)
      if (MAP_CURRENT_VIEW === 'ms-movement' && m.prodPt && m.holdPt) {
        // Draw line from production to current
        const line = L.polyline(
          [[m.prodPt.lat, m.prodPt.lng], [m.holdPt.lat, m.holdPt.lng]],
          {color: '#fb923c', weight: 3, opacity: 0.8}
        );
        line.bindPopup(`<div style="min-width:220px">
          <div style="font-weight:600;margin-bottom:.5rem">${m.title}</div>
          <div style="font-size:0.875rem;color:#666;margin-bottom:.25rem">
            <strong>From:</strong> ${m.movement.from}
          </div>
          <div style="font-size:0.875rem;color:#666;">
            <strong>To:</strong> ${m.movement.to}
          </div>
        </div>`);
        MAP_CONNECTIONS_LAYER.addLayer(line);
        
        // Add small markers at both ends
        const startMarker = L.circleMarker([m.prodPt.lat, m.prodPt.lng], {
          radius: 5,
          fillColor: '#10b981',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).bindPopup(`<strong>Production:</strong> ${m.movement.from}`);
        
        const endMarker = L.circleMarker([m.holdPt.lat, m.holdPt.lng], {
          radius: 5,
          fillColor: '#ef4444',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).bindPopup(`<strong>Current location:</strong> ${m.movement.to}`);
        
        MAP_CONNECTIONS_LAYER.addLayer(startMarker);
        MAP_CONNECTIONS_LAYER.addLayer(endMarker);
      }
      
      // Manuscripts production view: production → holding
      if (MAP_CURRENT_VIEW === 'ms-production' && m.prodPt && m.holdPt) {
        const line = L.polyline(
          [[m.prodPt.lat, m.prodPt.lng], [m.holdPt.lat, m.holdPt.lng]],
          {color: '#ff7800', weight: 2, opacity: 0.6, dashArray: '5, 5'}
        );
        line.bindPopup(`<div style="min-width:200px"><div style="font-weight:600;margin-bottom:.25rem">${m.title}</div><div style="font-size:0.875rem;color:#666;">Production → Holding</div></div>`);
        MAP_CONNECTIONS_LAYER.addLayer(line);
      }
      
      // Production Units: show link to monastery if available
      if ((MAP_CURRENT_VIEW === 'pu-location' || MAP_CURRENT_VIEW === 'pu-monastery') && m.monasteryName && m.category === 'production') {
        // Find the monastery coordinates
        const miRes = getRes(m.rec, 'Monastic Institution');
        if (miRes?.id) {
          const mi = getIDX().mi[String(miRes.id)];
          if (mi) {
            const latD = getDetail(mi,'Latitude')?.value;
            const lonD = getDetail(mi,'Longitude')?.value;
            const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
            const miPt = parseWKTPoint(wkt);
            if (miPt && (miPt.lat !== m.pt.lat || miPt.lng !== m.pt.lng)) {
              const line = L.polyline(
                [[miPt.lat, miPt.lng], [m.pt.lat, m.pt.lng]],
                {color: '#9333ea', weight: 2, opacity: 0.5, dashArray: '3, 3'}
              );
              line.bindPopup(`<div style="min-width:200px"><div style="font-weight:600;margin-bottom:.25rem">${m.title}</div><div style="font-size:0.875rem;color:#666;">Monastery → Production Unit</div></div>`);
              MAP_CONNECTIONS_LAYER.addLayer(line);
            }
          }
        }
      }
    });
    
    if (MAP_CONNECTIONS_LAYER.getLayers().length > 0) {
      MAP_INSTANCE.addLayer(MAP_CONNECTIONS_LAYER);
    }
  }
  
  // Route visualization (animated paths for manuscripts with multiple locations)
  if (showRoutes && getENTITY() === 'ms') {
    MAP_ROUTES_LAYER = L.featureGroup();
    
    // For each manuscript, trace its journey
    filtered.forEach(m => {
      const route = [];
      
      // Start with production location
      if (m.prodPt) {
        route.push({lat: m.prodPt.lat, lng: m.prodPt.lng, label: 'Production'});
      }
      
      // Add holding location
      if (m.holdPt && !(m.prodPt && m.prodPt.lat === m.holdPt.lat && m.prodPt.lng === m.holdPt.lng)) {
        route.push({lat: m.holdPt.lat, lng: m.holdPt.lng, label: 'Current Location'});
      }
      
      // Draw route if we have multiple points
      if (route.length > 1) {
        const coords = route.map(p => [p.lat, p.lng]);
        const routeLine = L.polyline(coords, {
          color: '#9333ea',
          weight: 3,
          opacity: 0.7
        });
        routeLine.bindPopup(`<div style="min-width:200px"><div style="font-weight:600;margin-bottom:.25rem">${m.title}</div><div style="font-size:0.875rem;color:#666;">Route: ${route.map(r => r.label).join(' → ')}</div></div>`);
        MAP_ROUTES_LAYER.addLayer(routeLine);
        
        // Add numbered markers for route points
        route.forEach((pt, idx) => {
          const marker = L.circleMarker([pt.lat, pt.lng], {
            radius: 8,
            fillColor: '#9333ea',
            fillOpacity: 0.8,
            color: '#fff',
            weight: 2
          });
          marker.bindPopup(`<div style="min-width:150px"><div style="font-weight:600;">${pt.label}</div><div style="font-size:0.875rem;color:#666;">Step ${idx + 1} of ${route.length}</div></div>`);
          MAP_ROUTES_LAYER.addLayer(marker);
        });
      }
    });
    
    if (MAP_ROUTES_LAYER.getLayers().length > 0) {
      MAP_INSTANCE.addLayer(MAP_ROUTES_LAYER);
    }
  }
}

function setupMapControls() {
  // Map view selector
  const viewSelector = document.getElementById('map-view-selector');
  if (viewSelector) {
    viewSelector.addEventListener('change', () => {
      buildMap(); // Rebuild entire map with new view
    });
  }
  
  // Clustering toggle
  const clusterCheckbox = document.getElementById('map-show-clusters');
  if (clusterCheckbox) {
    clusterCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Connection lines toggle
  const connectionsCheckbox = document.getElementById('map-show-connections');
  if (connectionsCheckbox) {
    connectionsCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Heatmap toggle
  const heatmapCheckbox = document.getElementById('map-show-heatmap');
  if (heatmapCheckbox) {
    heatmapCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Routes toggle
  const routesCheckbox = document.getElementById('map-show-routes');
  if (routesCheckbox) {
    routesCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Time sliders
  const timeStartSlider = document.getElementById('map-time-start');
  const timeEndSlider = document.getElementById('map-time-end');
  if (timeStartSlider) {
    timeStartSlider.addEventListener('input', () => {
      // Ensure start <= end
      const start = parseInt(timeStartSlider.value);
      const end = parseInt(timeEndSlider.value);
      if (start > end) {
        timeEndSlider.value = start;
      }
      renderMapLayers();
    });
  }
  if (timeEndSlider) {
    timeEndSlider.addEventListener('input', () => {
      // Ensure end >= start
      const start = parseInt(timeStartSlider.value);
      const end = parseInt(timeEndSlider.value);
      if (end < start) {
        timeStartSlider.value = end;
      }
      renderMapLayers();
    });
  }
  
  // Clear time filter
  const clearTimeBtn = document.getElementById('map-clear-time');
  if (clearTimeBtn) {
    clearTimeBtn.addEventListener('click', () => {
      if (timeStartSlider) timeStartSlider.value = 800;
      if (timeEndSlider) timeEndSlider.value = 1600;
      renderMapLayers();
    });
  }
  
  // Reset view
  const resetViewBtn = document.getElementById('map-reset-view');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      if (MAP_INSTANCE && MAP_MARKERS_DATA.length) {
        const bounds = L.latLngBounds(MAP_MARKERS_DATA.map(m => [m.pt.lat, m.pt.lng]));
        MAP_INSTANCE.fitBounds(bounds.pad(0.2));
      }
    });
  }
}



    return {
      ensureLeaflet,
      buildMap
    };
  }
};
