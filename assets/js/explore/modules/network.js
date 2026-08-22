window.ExploreNetwork = (function() {
  return {
    init: function(Core) {
      const getDATA = () => Core.DATA;
      const getIDX = () => Core.IDX;
      const getActiveEntity = () => Core.activeEntity;
      const getENTITY = () => Core.ENTITY;
      const getREL_INDEX = () => Core.REL_INDEX;
      const getREC_TYPE_TO_ENTITY = () => Core.REC_TYPE_TO_ENTITY;
      const getINBOUND = () => Core.INBOUND;
      const MAP = Core.MAP;
      const isKnownCategory = Core.isKnownCategory;
      
      const {
        val, getVal, getDetail, getRes, getDetailsAll, getValsAll, getControlledValsAll, esc,
        $panes, $tabs, $mapTitle, TimelineModule, formatYear, 
      } = Core;

/* ---------- Network View ---------- */
let NETWORK_CURRENT_REC = null;
let NETWORK_CURRENT_TYPE = null;
let NETWORK_ALL_REL_TYPES = new Set();
let ACTIVE_NETWORK_SIMULATION = null;

function stopActiveNetworkSimulation() {
  if (!ACTIVE_NETWORK_SIMULATION) return;
  ACTIVE_NETWORK_SIMULATION.stop();
  ACTIVE_NETWORK_SIMULATION.on('tick', null).on('end', null);
  ACTIVE_NETWORK_SIMULATION = null;
}

function setActiveNetworkSimulation(simulation) {
  stopActiveNetworkSimulation();
  ACTIVE_NETWORK_SIMULATION = simulation;
}

function getInitialNetworkRecord() {
  const data = getDATA() || {};
  const preferredOrder = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'];

  for (const type of preferredOrder) {
    const records = data[type];
    if (Array.isArray(records) && records.length > 0) {
      return { rec: records[0], type };
    }
  }

  return null;
}

function updateRelationshipFilter(relTypes) {
  NETWORK_ALL_REL_TYPES = relTypes;
  const select = document.getElementById('network-rel-filter');
  if (!select) return;
  
  // Store current selection
  const currentValue = select.value;
  
  // Rebuild options
  select.innerHTML = '<option value="">All types</option>';
  const sortedTypes = Array.from(relTypes).sort();
  sortedTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    if (type === currentValue) option.selected = true;
    select.appendChild(option);
  });
}

function updateNetworkFeedback(nodeCount, linkCount) {
  const nodeCountEl = document.getElementById('network-node-count');
  const linkCountEl = document.getElementById('network-link-count');

  if (nodeCountEl) {
    nodeCountEl.textContent = `${nodeCount} node${nodeCount !== 1 ? 's' : ''}`;
  }

  if (linkCountEl) {
    linkCountEl.textContent = `${linkCount} link${linkCount !== 1 ? 's' : ''}`;
  }
}

function buildNetworkView(){
  const viewSelector = document.getElementById('network-view-selector');
  const networkView = viewSelector?.value || 'search';
  
  // Always show search panel (it's the primary interface)
  const searchPanel = document.getElementById('network-search-panel');
  if (searchPanel) {
    searchPanel.style.display = 'block';
  }
  
  // Handle different network views
  if (networkView === 'search') {
    // Search mode - wait for user to select a record or show last selected
    if (!NETWORK_CURRENT_REC) {
      const initial = getInitialNetworkRecord();
      if (initial) {
        NETWORK_CURRENT_REC = initial.rec;
        NETWORK_CURRENT_TYPE = initial.type;
      } else {
        const mount = document.getElementById('network-mount');
        if (mount) mount.innerHTML = '<div class="empty-center-message">Search for a record above to explore its network</div>';
        return;
      }
    }
    // If we have a record, show its network
    buildRecordNetwork(NETWORK_CURRENT_REC, NETWORK_CURRENT_TYPE);
  } else if (networkView === 'clusters') {
    buildClusterView();
  } else if (networkView === 'sample') {
    buildSampledNetwork(getActiveEntityFilters(), 100);
  }
}

// Get active entity type filters
function getActiveEntityFilters() {
  const checkboxes = document.querySelectorAll('.network-entity-filter:checked');
  const selected = Array.from(checkboxes).map(cb => cb.value);
  
  // If none are checked, return all entity types (show everything)
  if (selected.length === 0) {
    return ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'];
  }
  
  return selected;
}

// Get active field filters (simplified - always returns empty filters)
function getActiveFieldFilters() {
  // Since we removed the Refine View UI, always return empty filters
  return {
    century: null,
    country: null,
    genre: null,
    material: null,
    script: null,
    order: null
  };
}

// Check if a record matches field filters
function recordMatchesFilters(rec, type) {
  const filters = getActiveFieldFilters();
  
  // If no filters are active, match everything
  const hasAnyFilter = Object.values(filters).some(v => v !== null);
  if (!hasAnyFilter) return true;
  
  // === CORE FILTERS (SIMPLIFIED) ===
  
  // Century filter (scribal units, production units)
  if (filters.century && (type === 'su' || type === 'pu')) {
    const centuries = getControlledValsAll(rec, 'Normalized century of production');
    const match = centuries.some(c => c && c.toLowerCase().includes(filters.century));
    if (!match) return false;
  }
  
  // Country filter (production units, institutions)
  if (filters.country && (type === 'pu' || type === 'hi' || type === 'mi')) {
    const fieldName = type === 'pu' ? 'PU country' : 'Country';
    const countries = getControlledValsAll(rec, fieldName);
    if (!countries.some(country => country.toLowerCase().includes(filters.country.toLowerCase()))) return false;
  }
  
  // === DYNAMIC CONTENT FILTERS ===
  
  // Genre filter (texts)
  if (filters.genre && type === 'tx') {
    const genres = getControlledValsAll(rec, 'Genre');
    if (!genres.some(genre => genre.toLowerCase().includes(filters.genre))) return false;
  }
  
  // Material filter (manuscripts)
  if (filters.material && type === 'ms') {
    const materials = getControlledValsAll(rec, 'Material');
    if (!materials.some(material => material.toLowerCase().includes(filters.material))) return false;
  }
  
  // Script type filter (scribal units)
  if (filters.script && type === 'su') {
    const scripts = getControlledValsAll(rec, 'Script');
    if (!scripts.some(script => script.toLowerCase().includes(filters.script))) return false;
  }
  
  // Religious order filter (monastic institutions)
  if (filters.order && type === 'mi') {
    const orders = getControlledValsAll(rec, 'Religious order');
    if (!orders.some(order => order.toLowerCase().includes(filters.order))) return false;
  }
  
  return true;
}

// Build cluster view showing entity types and connection densities
function buildClusterView() {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div class="empty-center-message">Analyzing connection patterns...</div>';
  
  // Calculate connection statistics for each entity type
  const typeStats = {};
  const entityTypes = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'];
  
  // Entity type labels
  const typeLabels = {
    su: 'Scribal Units',
    ms: 'Manuscripts',
    pu: 'Production Units',
    hi: 'Holding Institutions',
    mi: 'Monastic Institutions',
    hp: 'Historical People',
    tx: 'Texts'
  };
  
  entityTypes.forEach(type => {
    const records = getDATA()[type] || [];
    typeStats[type] = {
      count: records.length,
      connections: 0,
      label: typeLabels[type] || type
    };
  });
  
  // Count connections from relationships
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)];
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)];
    
    if (srcType && typeStats[srcType]) typeStats[srcType].connections++;
    if (tgtType && typeStats[tgtType]) typeStats[tgtType].connections++;
  });
  
  // Create cluster visualization with entity types as large nodes
  const nodes = [];
  const links = [];
  
  // Add entity type nodes
  entityTypes.forEach(type => {
    const stats = typeStats[type];
    if (stats.count > 0) {
      nodes.push({
        id: type,
        type: type,
        label: `${stats.label}\n(${stats.count} records)`,
        size: Math.sqrt(stats.count) * 3,
        connections: stats.connections
      });
    }
  });
  
  // Add links between entity types based on relationship patterns
  const typeConnections = {};
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)];
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)];
    
    if (srcType && tgtType && srcType !== tgtType) {
      const key = [srcType, tgtType].sort().join('-');
      typeConnections[key] = (typeConnections[key] || 0) + 1;
    }
  });
  
  // Create links
  Object.entries(typeConnections).forEach(([key, count]) => {
    const [src, tgt] = key.split('-');
    links.push({
      source: src,
      target: tgt,
      weight: count,
      label: `${count} connections`
    });
  });
  
  renderD3ClusterNetwork(mount, nodes, links);
}

// Build full database network
function buildFullDatabaseNetwork() {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div class="empty-center-message">Loading full database network...</div>';
  
  // Collect all records from all entity types
  const nodes = [];
  const links = [];
  const nodeMap = new Map();
  
  // Add all records as nodes
  Object.entries(getDATA()).forEach(([entityType, records]) => {
    if (entityType === 'rel') return; // Skip relationships
    records.forEach(rec => {
      const id = `${entityType}-${rec.rec_ID}`;
      const node = {
        id,
        type: entityType,
        rec,
        label: MAP[entityType].title(rec)
      };
      nodes.push(node);
      nodeMap.set(id, node);
    });
  });
  
  // Add relationships as links
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)] || null;
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)] || null;
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      links.push({
        source: srcId,
        target: tgtId,
        type: 'relationship',
        label: getVal(rel, 'Relation type') || ''
      });
    }
  });
  
  // Limit to prevent browser crash - show warning if too large
  if (nodes.length > 500) {
    mount.innerHTML = `<div class="empty-center-message">
      Full database network contains ${nodes.length} nodes and would be too complex to visualize effectively.<br>
      Please select a specific subset view or use the search function to explore from a specific record.
    </div>`;
    return;
  }
  
  renderD3Network(mount, nodes, links);
}

// Build network for a specific record
function buildRecordNetwork(rec, type) {
  const depthInput = document.getElementById('network-depth');
  const depth = depthInput ? parseInt(depthInput.value) || 2 : 2;
  const relFilter = document.getElementById('network-rel-filter')?.value || null;
  
  buildNetworkDiagram(rec, type, depth, relFilter);
}

// Build subset network views
function buildSubsetNetwork(subsetType) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div class="empty-center-message">Analyzing network structure...</div>';
  
  // Define which entity types to include for each subset
  const subsets = {
    manuscripts: { types: ['ms', 'su', 'pu', 'hi'], label: 'Manuscripts Network' },
    scribal: { types: ['su', 'hp', 'ms'], label: 'Scribal Network' },
    institutions: { types: ['hi', 'mi', 'ms', 'pu'], label: 'Institutions Network' },
    texts: { types: ['tx', 'su', 'hp', 'ms'], label: 'Texts Network' }
  };
  
  const subset = subsets[subsetType];
  if (!subset) return;
  
  // Count total nodes in this subset
  let totalNodes = 0;
  subset.types.forEach(entityType => {
    if (getDATA()[entityType]) totalNodes += getDATA()[entityType].length;
  });
  
  // If too large, show statistics and suggest search instead
    if (totalNodes > 200) {
      mount.innerHTML = `
        <div class="card-panel card-panel--narrow">
          <h3>${subset.label}</h3>
          <div class="info-panel" style="margin:1rem 0;">
            <div style="font-size:0.875rem;color:#666;margin-bottom:0.5rem;">Network Statistics:</div>
            <div class="stat-value" style="font-size:2rem;font-weight:700;color:#d4af37;margin-bottom:0.25rem;">${totalNodes.toLocaleString()}</div>
            <div style="font-size:0.875rem;color:#666;">total entities in this network</div>
          </div>
          <div class="info-panel info-warning" style="margin:1rem 0;">
            <div style="font-weight:600;margin-bottom:0.5rem;">Network too large to visualize</div>
            <div style="font-size:0.875rem;color:#666;">Visualizing ${totalNodes.toLocaleString()} nodes would overwhelm your browser.</div>
          </div>
          <div style="margin-top:1rem;">
            <div style="font-weight:600;margin-bottom:0.75rem;">Recommended approaches:</div>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              <button id="network-sample-btn" class="chip">Show Reproducible Sample — Display 100 well-connected entities</button>
              <button id="network-hubs-btn" class="chip">Show Network Hubs — Display the 50 most connected entities</button>
              <button id="network-search-mode-btn" class="chip is-primary">Start from a record</button>
            </div>
          </div>
        </div>
      `;
      
      // Add event listeners for the buttons
      setTimeout(() => {
        document.getElementById('network-sample-btn')?.addEventListener('click', () => {
        buildSampledNetwork(subset.types, 100);
      });
      
      document.getElementById('network-hubs-btn')?.addEventListener('click', () => {
        buildHubsNetwork(subset.types, 50);
      });
      
      document.getElementById('network-search-mode-btn')?.addEventListener('click', () => {
        const viewSelector = document.getElementById('network-view-selector');
        if (viewSelector) {
          viewSelector.value = 'search';
          buildNetworkView();
        }
      });
    }, 0);
    
    return;
  }
  
  // If small enough, build the full subset network
  buildFullSubsetNetwork(subset.types);
}

// Build full network for a subset of entity types
function buildFullSubsetNetwork(entityTypes) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  const nodes = [];
  const links = [];
  const nodeMap = new Map();
  
  // Add nodes for selected entity types
  entityTypes.forEach(entityType => {
    if (!getDATA()[entityType]) return;
    getDATA()[entityType].forEach(rec => {
      const id = `${entityType}-${rec.rec_ID}`;
      const node = {
        id,
        type: entityType,
        rec,
        label: MAP[entityType].title(rec)
      };
      nodes.push(node);
      nodeMap.set(id, node);
    });
  });
  
  // Add relationships
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)] || null;
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)] || null;
    if (!srcType || !tgtType) return;
    if (!entityTypes.includes(srcType) || !entityTypes.includes(tgtType)) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      links.push({ source: srcId, target: tgtId, type: 'relationship' });
    }
  });
  
  renderD3Network(mount, nodes, links);
}

function hashNetworkSeed(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return function() {
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledWithRandom(values, random) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

// Build a connected, reproducible sample and record its seed in the URL.
function buildSampledNetwork(entityTypes, sampleSize) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div class="empty-center-message">Building connected sample network...</div>';
  
  // Handle entity type filtering
  let types;
  if (entityTypes === null || entityTypes === undefined) {
    types = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx']; // No filter = all types
  } else if (Array.isArray(entityTypes) && entityTypes.length === 0) {
    // Empty array = nothing selected, show message
    mount.innerHTML = '<div class="empty-center-message">No entity types selected. Check at least one entity type in the filters.</div>';
    return;
  } else {
    types = entityTypes;
  }

  const url = new URL(window.location.href);
  const defaultSeed = `${[...types].sort().join('-')}-${sampleSize}`;
  const seedLabel = url.searchParams.get('networkSeed') || defaultSeed;
  const random = createSeededRandom(hashNetworkSeed(seedLabel));
  url.searchParams.set('networkSeed', seedLabel);
  url.searchParams.set('networkSample', String(sampleSize));
  url.searchParams.set('networkTypes', [...types].sort().join(','));
  window.history.replaceState({}, '', url);
  
  // Build adjacency map: node ID -> array of connected node IDs
  const adjacency = new Map();
  const nodeInfo = new Map(); // Store rec and type for each node ID
  
  // Index all nodes (with field filters applied)
  types.forEach(entityType => {
    if (!getDATA()[entityType]) return;
    getDATA()[entityType].forEach(rec => {
      // Apply field filters
      if (!recordMatchesFilters(rec, entityType)) return;
      
      const id = `${entityType}-${rec.rec_ID}`;
      nodeInfo.set(id, { rec, type: entityType });
      adjacency.set(id, []);
    });
  });
  
  // Build adjacency lists
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)];
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (adjacency.has(srcId) && adjacency.has(tgtId)) {
      adjacency.get(srcId).push(tgtId);
      adjacency.get(tgtId).push(srcId);
    }
  });
  
  // Find highly connected nodes as potential seeds
  const connectionCounts = Array.from(adjacency.entries())
    .map(([id, neighbors]) => ({ id, count: neighbors.length }))
    .filter(n => n.count > 0)
    .sort((a, b) => b.count - a.count);
  
  if (connectionCounts.length === 0) {
    mount.innerHTML = '<div class="empty-center-message">No connected nodes found in the database.</div>';
    return;
  }
  
  // Start from one of the most connected nodes, selected reproducibly from the URL seed.
  const seedIndex = Math.floor(random() * Math.min(20, connectionCounts.length));
  const seedId = connectionCounts[seedIndex].id;
  
  // Grow network using BFS (breadth-first search) to ensure connectivity
  const selected = new Set([seedId]);
  const queue = [seedId];
  
  while (queue.length > 0 && selected.size < sampleSize) {
    const currentId = queue.shift();
    const neighbors = adjacency.get(currentId) || [];
    
    const shuffledNeighbors = shuffledWithRandom(neighbors, random);
    
    for (const neighborId of shuffledNeighbors) {
      if (!selected.has(neighborId)) {
        selected.add(neighborId);
        queue.push(neighborId);
        
        if (selected.size >= sampleSize) break;
      }
    }
  }
  
  // Build nodes from selected IDs
  const nodeMap = new Map();
  const nodes = Array.from(selected).map(id => {
    const info = nodeInfo.get(id);
    const neighbors = adjacency.get(id) || [];
    const connectionsInSample = neighbors.filter(nId => selected.has(nId)).length;
    
    const node = {
      id,
      type: info.type,
      rec: info.rec,
      label: MAP[info.type].title(info.rec),
      connections: connectionsInSample
    };
    nodeMap.set(id, node);
    return node;
  });
  
  // Build links - only between selected nodes
  const links = [];
  const linkSet = new Set(); // Prevent duplicates
  
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)];
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      const linkKey = [srcId, tgtId].sort().join('|');
      if (!linkSet.has(linkKey)) {
        linkSet.add(linkKey);
        links.push({ source: srcId, target: tgtId, type: 'relationship' });
      }
    }
  });
  
  renderD3Network(mount, nodes, links);
  const sampleNote = document.createElement('p');
  sampleNote.className = 'network-sample-note';
  sampleNote.style.cssText = 'margin:.5rem 0;color:#666;font-size:.8rem;text-align:center;';
  sampleNote.textContent = `Reproducible connected sample · seed: ${seedLabel} · ${nodes.length} nodes. Share this page URL to reproduce it.`;
  mount.prepend(sampleNote);
}

// Build hubs network - most connected entities with their neighborhoods
function buildHubsNetwork(entityTypes, topN) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div class="empty-center-message">Finding most connected entities...</div>';
  
  // Handle entity type filtering
  let types;
  if (entityTypes === null || entityTypes === undefined) {
    types = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx']; // No filter = all types
  } else if (Array.isArray(entityTypes) && entityTypes.length === 0) {
    // Empty array = nothing selected, show message
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">No entity types selected. Check at least one entity type in the filters.</div>';
    return;
  } else {
    types = entityTypes;
  }
  
  // Build a map of node ID -> {rec, type, connectionCount, neighbors}
  const nodeData = new Map();
  
  // Initialize all nodes (with field filters applied)
  types.forEach(entityType => {
    if (!getDATA()[entityType]) return;
    getDATA()[entityType].forEach(rec => {
      // Apply field filters
      if (!recordMatchesFilters(rec, entityType)) return;
      
      const id = `${entityType}-${rec.rec_ID}`;
      nodeData.set(id, {
        id,
        rec,
        type: entityType,
        connectionCount: 0,
        neighbors: new Set()
      });
    });
  });
  
  // Count connections efficiently
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)];
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    const srcNode = nodeData.get(srcId);
    const tgtNode = nodeData.get(tgtId);
    
    if (srcNode && tgtNode) {
      srcNode.connectionCount++;
      tgtNode.connectionCount++;
      srcNode.neighbors.add(tgtId);
      tgtNode.neighbors.add(srcId);
    }
  });
  
  // Find top N most connected nodes
  const allNodes = Array.from(nodeData.values());
  const topHubs = allNodes
    .filter(n => n.connectionCount > 0)
    .sort((a, b) => b.connectionCount - a.connectionCount)
    .slice(0, topN);
  
  if (topHubs.length === 0) {
    mount.innerHTML = '<div class="empty-center-message">No connected entities found.</div>';
    return;
  }
  
  // Include hubs and their immediate neighbors for context
  const selectedIds = new Set(topHubs.map(h => h.id));
  
  // Add some neighbors for visual context (max 3 neighbors per hub)
  topHubs.forEach(hub => {
    let added = 0;
    for (const neighborId of hub.neighbors) {
      if (!selectedIds.has(neighborId) && added < 3) {
        selectedIds.add(neighborId);
        added++;
      }
    }
  });
  
  // Build nodes for visualization
  const nodeMap = new Map();
  const nodes = [];
  
  for (const id of selectedIds) {
    const data = nodeData.get(id);
    if (!data) continue;
    
    const isHub = topHubs.some(h => h.id === id);
    const node = {
      id: data.id,
      type: data.type,
      rec: data.rec,
      label: MAP[data.type].title(data.rec),
      connections: data.connectionCount,
      size: isHub ? Math.min(20, 8 + Math.sqrt(data.connectionCount)) : 6,
      isHub
    };
    nodes.push(node);
    nodeMap.set(id, node);
  }
  
  // Build links only between selected nodes
  const links = [];
  const linkSet = new Set();
  
  getDATA().rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = (getREC_TYPE_TO_ENTITY() || {})[String(src.type)];
    const tgtType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      const linkKey = [srcId, tgtId].sort().join('|');
      if (!linkSet.has(linkKey)) {
        linkSet.add(linkKey);
        links.push({ source: srcId, target: tgtId, type: 'relationship' });
      }
    }
  });
  
  renderD3Network(mount, nodes, links);
}

// Render D3 force-directed network with zoom and pan
function renderD3Network(mount, nodes, links) {
  stopActiveNetworkSimulation();
  const visibleIds = new Set(nodes.filter(node => isKnownCategory(node.label)).map(node => node.id));
  nodes = nodes.filter(node => visibleIds.has(node.id));
  links = links.filter(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    return visibleIds.has(sourceId) && visibleIds.has(targetId);
  });

  // Store current network data for export
  CURRENT_NETWORK_DATA = { nodes: nodes.map(n => ({...n})), links: links.map(l => ({...l})) };
  
  mount.innerHTML = '';
  
  const width = mount.clientWidth || 800;
  const height = mount.clientHeight || 600;
  
  const svg = d3.select(mount)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Add zoom and pan behavior
  const g = svg.append('g');
  
  let currentZoom = 1;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on('zoom', (event) => {
      currentZoom = event.transform.k;
      g.attr('transform', event.transform);
      // Update label visibility based on zoom level
      updateLabelVisibility(currentZoom);
    });
  
  svg.call(zoom);
  
  // Store zoom object and svg for button controls on mount element
  mount._zoom = zoom;
  mount._svg = svg;
  mount._g = g;
  
  const colors = {
    su: '#e6b800',
    ms: '#3498db',
    pu: '#e74c3c',
    hi: '#2ecc71',
    mi: '#9b59b6',
    hp: '#f39c12',
    tx: '#1abc9c'
  };
  
  // Adjust forces based on network size for better layout
  // Much stronger forces to bring nodes closer together
  const linkDistance = nodes.length < 30 ? 50 : nodes.length < 100 ? 40 : 30;
  const chargeStrength = nodes.length < 30 ? -800 : nodes.length < 100 ? -600 : -400;
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(linkDistance).strength(1))
    .force('charge', d3.forceManyBody().strength(chargeStrength))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(12))
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1));
  setActiveNetworkSimulation(simulation);
  
  // Auto-fit after simulation settles
  let autoFitTimeout;
  simulation.on('end', () => {
    clearTimeout(autoFitTimeout);
    autoFitTimeout = setTimeout(() => {
      if (ACTIVE_NETWORK_SIMULATION !== simulation || !mount.isConnected) return;
      const g = svg.select('g');
      try {
        const bounds = g.node().getBBox();
        const dx = bounds.width;
        const dy = bounds.height;
        const x = bounds.x + bounds.width / 2;
        const y = bounds.y + bounds.height / 2;
        
        const scale = Math.min(0.85 / Math.max(dx / width, dy / height), 2);
        const translate = [width / 2 - scale * x, height / 2 - scale * y];
        
        const transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
        svg.transition().duration(750).call(zoom.transform, transform);
      } catch (e) {
        // Silently fail if bounds can't be calculated
      }
    }, 100);
  });
  
  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => d.weight ? Math.sqrt(d.weight) * 0.5 : 1.5);
  
  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.size || 8)
    .attr('fill', d => colors[d.type] || '#999')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      // Navigate to the record when clicked
      if (d.rec && d.type) {
        event.stopPropagation();
        jumpTo(d.rec, d.type);
      }
    })
    .on('mouseover', function() {
      d3.select(this).attr('stroke-width', 3).attr('stroke', '#ffeb3b');
    })
    .on('mouseout', function() {
      d3.select(this).attr('stroke-width', 1.5).attr('stroke', '#fff');
    })
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  node.append('title')
    .text(d => d.connections ? `${d.label} (${d.connections} connections)` : d.label);
  
  const showLabels = document.getElementById('network-show-labels')?.checked ?? true;
  let labelElements = null;
  
  if (showLabels) {
    labelElements = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.label)
      .attr('font-size', 10)
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('fill', '#333')
      .style('pointer-events', 'none');
    
    // For large networks, only show labels for highly connected nodes
    if (nodes.length > 50) {
      const threshold = nodes.length > 100 ? 10 : 5;
      labelElements.style('display', d => (d.connections || 0) >= threshold ? 'block' : 'none');
    }
    
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      labelElements
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  } else {
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }
  
  // Function to update label visibility based on zoom level
  function updateLabelVisibility(zoomLevel) {
    if (!labelElements) return;
    
    if (nodes.length > 100) {
      // For very large networks, only show labels when zoomed in
      const threshold = nodes.length > 100 ? 10 : 5;
      labelElements.style('display', d => {
        const isImportant = (d.connections || 0) >= threshold;
        const isZoomedIn = zoomLevel > 1.5;
        return (isImportant || isZoomedIn) ? 'block' : 'none';
      });
      labelElements.attr('font-size', Math.max(8, Math.min(14, 10 * zoomLevel)));
    } else if (nodes.length > 50) {
      // Medium networks: show important labels always, others when zoomed
      const threshold = 5;
      labelElements.style('display', d => {
        const isImportant = (d.connections || 0) >= threshold;
        const isZoomedIn = zoomLevel > 1;
        return (isImportant || isZoomedIn) ? 'block' : 'none';
      });
      labelElements.attr('font-size', Math.max(8, Math.min(14, 10 * zoomLevel)));
    } else {
      // Small networks: show all labels, scale with zoom
      labelElements.attr('font-size', Math.max(8, Math.min(16, 10 * zoomLevel)));
    }
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
}

// Render cluster network with larger nodes
function renderD3ClusterNetwork(mount, nodes, links) {
  stopActiveNetworkSimulation();
  mount.innerHTML = '';
  
  const width = mount.clientWidth || 800;
  const height = mount.clientHeight || 600;
  
  const svg = d3.select(mount)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Add zoom and pan behavior
  const g = svg.append('g');
  
  const zoom = d3.zoom()
    .scaleExtent([0.5, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);
  
  // Store zoom object and svg for button controls on mount element
  mount._zoom = zoom;
  mount._svg = svg;
  mount._g = g;
  
  const colors = {
    su: '#e6b800',
    ms: '#3498db',
    pu: '#e74c3c',
    hi: '#2ecc71',
    mi: '#9b59b6',
    hp: '#f39c12',
    tx: '#1abc9c'
  };
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(200))
    .force('charge', d3.forceManyBody().strength(-1000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.size + 20));
  setActiveNetworkSimulation(simulation);
  
  // Draw links with varying thickness
  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.log(d.weight + 1) * 2);
  
  // Draw nodes as circles
  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.size || 20)
    .attr('fill', d => colors[d.type] || '#999')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  node.append('title')
    .text(d => `${d.label}\n${d.connections} connections`);
  
  // Add labels to cluster nodes
  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => d.label)
    .attr('font-size', 12)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('dy', 4)
    .attr('fill', '#333')
    .style('pointer-events', 'none');
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
  
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

// Export current network for analysis
let CURRENT_NETWORK_DATA = { nodes: [], links: [] }; // Store current network data

function exportCurrentNetwork(format) {
  if (!CURRENT_NETWORK_DATA.nodes || CURRENT_NETWORK_DATA.nodes.length === 0) {
    alert('No network to export\n\nPlease generate a network first (Random Sample, Top Hubs, or search for a record).');
    return;
  }
  
  // Track network export
  if (window.plausible) {
    plausible('Export', { props: { type: 'Network', format: format } });
  }
  
  const filename = `network_export_${Date.now()}`;
  
  if (format === 'gephi') {
    // Gephi CSV format
    const nodesCsv = [
      'Id,Label,Type',
      ...CURRENT_NETWORK_DATA.nodes.map(n => 
        `"${n.id}","${(n.label || n.id).replace(/"/g, '""')}","${n.type || 'unknown'}"`
      )
    ].join('\n');
    
    const edgesCsv = [
      'Source,Target,Type',
      ...CURRENT_NETWORK_DATA.links.map(l => 
        `"${l.source.id || l.source}","${l.target.id || l.target}","${l.type || 'related'}"`
      )
    ].join('\n');
    
    downloadFile(nodesCsv, `${filename}_nodes.csv`, 'text/csv');
    setTimeout(() => {
      downloadFile(edgesCsv, `${filename}_edges.csv`, 'text/csv');
      alert('Gephi Export Complete!\n\n' +
            `Downloaded 2 files:\n` +
            `${filename}_nodes.csv (${CURRENT_NETWORK_DATA.nodes.length} nodes)\n` +
            `${filename}_edges.csv (${CURRENT_NETWORK_DATA.links.length} edges)\n\n` +
            'To import into Gephi:\n' +
            '1. Open Gephi → New Project\n' +
            '2. File → Import Spreadsheet\n' +
            '3. Select edges CSV, choose "Edges table"\n' +
            '4. Import spreadsheet again, select nodes CSV, choose "Nodes table"');
    }, 100);
    
  } else if (format === 'r') {
    // R format
    const rCsv = [
      'from_id,to_id,from_label,to_label,relationship',
      ...CURRENT_NETWORK_DATA.links.map(l => {
        const sourceNode = CURRENT_NETWORK_DATA.nodes.find(n => n.id === (l.source.id || l.source));
        const targetNode = CURRENT_NETWORK_DATA.nodes.find(n => n.id === (l.target.id || l.target));
        return `"${sourceNode?.id || ''}","${targetNode?.id || ''}","${(sourceNode?.label || '').replace(/"/g, '""')}","${(targetNode?.label || '').replace(/"/g, '""')}","${l.type || 'related'}"`;
      })
    ].join('\n');
    
    const rScript = `# Network Analysis Script
# Generated: ${new Date().toISOString()}
# Nodes: ${CURRENT_NETWORK_DATA.nodes.length}
# Edges: ${CURRENT_NETWORK_DATA.links.length}

library(igraph)
library(tidyverse)

# Load data
edges <- read_csv("${filename}.csv")

# Create graph
g <- graph_from_data_frame(edges[,1:2], directed = TRUE)

# Add edge attributes
E(g)$relationship <- edges$relationship

# Basic statistics
cat("Network Statistics:\\n")
cat("Nodes:", vcount(g), "\\n")
cat("Edges:", ecount(g), "\\n")
cat("Density:", round(edge_density(g), 4), "\\n")
cat("\\n")

# Centrality measures
V(g)$degree <- degree(g)
V(g)$betweenness <- betweenness(g, normalized = TRUE)
V(g)$closeness <- closeness(g, normalized = TRUE)

# Top nodes by degree
top_degree <- sort(V(g)$degree, decreasing = TRUE)[1:10]
cat("Top 10 nodes by degree:\\n")
print(top_degree)

# Visualization
pdf("${filename}_plot.pdf", width = 12, height = 10)
plot(g, 
     vertex.size = sqrt(V(g)$degree) * 3,
     vertex.label.cex = 0.6,
     vertex.label.color = "black",
     edge.arrow.size = 0.3,
     edge.curved = 0.2,
     layout = layout_with_fr(g),
     main = "Network Visualization")
dev.off()

cat("\\nPlot saved to: ${filename}_plot.pdf\\n")
`;
    
    downloadFile(rCsv, `${filename}.csv`, 'text/csv');
    setTimeout(() => {
      downloadFile(rScript, `${filename}.R`, 'text/plain');
      alert('R Export Complete!\n\n' +
            `Downloaded 2 files:\n` +
            `${filename}.csv (${CURRENT_NETWORK_DATA.links.length} edges)\n` +
            `${filename}.R (analysis script)\n\n` +
            'To use in R:\n' +
            '1. Place both files in the same folder\n' +
            '2. Open the .R file in RStudio\n' +
            '3. Install packages if needed:\n' +
            '   install.packages(c("igraph", "tidyverse"))\n' +
            '4. Run the script (Ctrl+Shift+S or Cmd+Shift+S)');
    }, 100);
  }
}


      /* ============================================================
   NETWORK DIAGRAM VISUALIZATION
   ============================================================ */
function buildNetworkDiagram(centerRec, centerType, depth = 2, relTypeFilter = null) {
  stopActiveNetworkSimulation();
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  // Get UI controls
  const showLabels = document.getElementById('network-show-labels')?.checked !== false;
  
  // Get active entity type filters
  const activeEntityTypes = ["su", "ms", "pu", "hi", "mi", "hp", "tx"];
  
  // Build graph data
  const nodes = [];
  const links = [];
  const visited = new Set();
  const nodeMap = new Map();
  const allRelTypes = new Set();
  
  function addNode(rec, type, level) {
    const id = `${type}:${rec.rec_ID}`;
    if (visited.has(id)) return;
    const label = MAP[type].title(rec);
    if (!isKnownCategory(label)) return;
    
    visited.add(id);
    
    const node = {
      id,
      label,
      type,
      level,
      rec
    };
    nodes.push(node);
    nodeMap.set(id, node);
    
    if (level >= depth) return;
    
    const recId = String(rec.rec_ID);
    
    // 1. Add connections from RELATIONSHIP RECORDS
    const rels = [...((getREL_INDEX() || {}).bySource[recId] || []), 
                  ...((getREL_INDEX() || {}).byTarget[recId] || [])];
    
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const relType = getVal(rel, 'Relationship type') || 'related';
      
      // Track all relationship types for filter dropdown
      allRelTypes.add(relType);
      
      // Apply filter if set
      if (relTypeFilter && relType !== relTypeFilter) return;
      
      // Determine if this is outgoing or incoming
      const isOutgoing = String(src?.id) === recId;
      const other = isOutgoing ? tgt : src;
      
      if (!other?.id) return;
      const otherType = (getREC_TYPE_TO_ENTITY() || {})[String(other.type)];
      if (!otherType) return;
      const otherRec = (getIDX() || {})[otherType]?.[String(other.id)];
      if (!otherRec) return;
      
      const otherId = `${otherType}:${other.id}`;
      
      // Add link
      links.push({
        source: id,
        target: otherId,
        type: relType,
        linkType: 'relationship',
        directed: true
      });
      
      addNode(otherRec, otherType, level + 1);
    });
    
    // 2. Add connections from POINTER FIELDS (outgoing only)
    (rec.details || []).forEach(detail => {
      const fieldValue = detail.value;
      if (!fieldValue || typeof fieldValue !== 'object' || !fieldValue.id || !fieldValue.type) return;
      
      const targetId = String(fieldValue.id);
      const targetType = (getREC_TYPE_TO_ENTITY() || {})[String(fieldValue.type)];
      if (!targetType) return;
      
      const targetRec = (getIDX() || {})[targetType]?.[targetId];
      if (!targetRec) return;
      
      const fieldName = detail.fieldName || 'linked to';
      const relType = `→ ${fieldName}`;
      
      // Track pointer fields as relationship types
      allRelTypes.add(relType);
      
      // Apply filter if set
      if (relTypeFilter && relType !== relTypeFilter) return;
      
      const otherId = `${targetType}:${targetId}`;
      
      // Add link
      links.push({
        source: id,
        target: otherId,
        type: relType,
        linkType: 'pointer',
        directed: true
      });
      
      addNode(targetRec, targetType, level + 1);
    });
    
    // 3. Add connections from POINTER FIELDS (incoming - reverse lookup)
    const inbound = (getINBOUND() || {})[type]?.[recId] || [];
    inbound.forEach(inb => {
      const sourceRec = (getIDX() || {})[inb.fromType]?.[inb.fromId];
      if (!sourceRec) return;
      
      const fieldName = inb.fieldName || 'linked from';
      const relType = `← ${fieldName}`;
      
      // Track incoming pointer fields
      allRelTypes.add(relType);
      
      // Apply filter if set
      if (relTypeFilter && relType !== relTypeFilter) return;
      
      const sourceId = `${inb.fromType}:${inb.fromId}`;
      
      // Add link (reversed direction for incoming)
      links.push({
        source: sourceId,
        target: id,
        type: relType,
        linkType: 'pointer',
        directed: true
      });
      
      addNode(sourceRec, inb.fromType, level + 1);
    });
  }
  
  addNode(centerRec, centerType, 0);
  
  // Update filter dropdown with available relationship types
  updateRelationshipFilter(allRelTypes);
  
  if (nodes.length === 0) {
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No relationships to display</div>';
    return;
  }
  
  // Filter nodes by entity type (but keep all for traversal)
  // Center node (level 0) is always visible
  let visibleNodes = nodes.filter(n => n.level === 0 || activeEntityTypes.includes(n.type));
  
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
  
  // Filter links to only show those between visible nodes
  const visibleLinks = links.filter(l => {
    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
    return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
  });
  
  // Store network data for export (use visible nodes/links)
  CURRENT_NETWORK_DATA = { 
    nodes: visibleNodes.map(n => ({...n})), 
    links: visibleLinks.map(l => ({...l})) 
  };
  
  // D3 force simulation
  const width = mount.clientWidth || 900;
  const height = mount.clientHeight || 600;
  
  const svg = d3.select(mount).html('')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  const g = svg.append('g');
  
  // Add zoom
  const zoom = d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform);
  });
  svg.call(zoom);
  
  // Store references on mount element for zoom controls
  mount._svg = svg;
  mount._zoom = zoom;
  mount._g = g;
  
  // Store zoom for reset button
  svg.datum({ zoom, initialTransform: d3.zoomIdentity });
  
  // Get selected color scheme
  const colorScheme = document.getElementById('network-color-scheme')?.value || 'type';
  
  // Color scale functions
  const typeColorScale = d3.scaleOrdinal()
    .domain(['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'])
    .range(['#e6b800', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c']);
  
  const centuryColorScale = d3.scaleOrdinal()
    .domain(['12th', '13th', '14th', '15th', '16th', '17th', '18th'])
    .range(['#8e44ad', '#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71', '#3498db']);
  
  const regionColorScale = d3.scaleOrdinal()
    .domain(['germany', 'france', 'italy', 'england', 'spain', 'low countries', 'switzerland', 'austria', 'sweden', 'belgium', 'netherlands'])
    .range(['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#e67e22', '#9b59b6', '#95a5a6', '#c0392b', '#16a085', '#d35400', '#27ae60']);
  
  const orderColorScale = d3.scaleOrdinal()
    .domain(['cistercian', 'dominican', 'franciscan', 'benedictine', 'augustinian', 'carmelite', 'carthusian', 'premonstratensian'])
    .range(['#95a5a6', '#34495e', '#8B4513', '#2c3e50', '#c0392b', '#d35400', '#7f8c8d', '#2980b9']);
  
  // Function to get node color based on scheme
  const getNodeColor = (d) => {
    if (colorScheme === 'type') {
      return typeColorScale(d.type);
    } else if (colorScheme === 'century') {
      const [century] = getControlledValsAll(d.rec, 'Normalized century of production');
      if (!century) return '#999'; // Gray for no data
      return centuryColorScale(century.toLowerCase());
    } else if (colorScheme === 'region') {
      const fieldName = d.type === 'pu' ? 'PU country' : 'Country';
      const [country] = ['pu', 'hi', 'mi'].includes(d.type) ? getControlledValsAll(d.rec, fieldName) : [];
      if (!country) return '#999'; // Gray for no data
      return regionColorScale(country.toLowerCase());
    } else if (colorScheme === 'order') {
      let orders = [];
      if (d.type === 'mi') {
        orders = getControlledValsAll(d.rec, 'Religious order');
      } else if (d.type === 'pu') {
        const monastery = getRes(d.rec, 'Monastic Institution');
        const monasteryRecord = monastery?.id ? (getIDX() || {}).mi?.[String(monastery.id)] : null;
        if (monasteryRecord) orders = getControlledValsAll(monasteryRecord, 'Religious order');
      }
      const [order] = orders;
      if (!order) return '#999'; // Gray for no data
      return orderColorScale(order.toLowerCase());
    }
    return '#999';
  };
  
  // Force simulation - use visibleNodes and visibleLinks
  
  // Apply link density filter
  const linkDensity = parseInt(document.getElementById('network-link-density')?.value || 100);
  let filteredLinks = visibleLinks;
  
  if (linkDensity < 100) {
    // Calculate node degrees to identify important links
    const nodeDegreeMap = new Map();
    visibleNodes.forEach(n => nodeDegreeMap.set(n.id, 0));
    visibleLinks.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      nodeDegreeMap.set(sid, (nodeDegreeMap.get(sid) || 0) + 1);
      nodeDegreeMap.set(tid, (nodeDegreeMap.get(tid) || 0) + 1);
    });
    
    // Prioritize links connected to high-degree nodes and relationship records
    const linkScores = visibleLinks.map((l, i) => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      const score = (nodeDegreeMap.get(sid) || 0) + (nodeDegreeMap.get(tid) || 0) + (l.linkType === 'relationship' ? 10 : 0);
      return { link: l, score, index: i };
    });
    
    // Sort by score and take top percentage
    linkScores.sort((a, b) => b.score - a.score);
    const numToShow = Math.max(1, Math.floor(visibleLinks.length * (linkDensity / 100)));
    filteredLinks = linkScores.slice(0, numToShow).map(item => item.link);
  }
  
  const simulation = d3.forceSimulation(visibleNodes)
    .force('link', d3.forceLink(filteredLinks).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(35));
  setActiveNetworkSimulation(simulation);
  
  // Draw links (use filteredLinks)
  const link = g.append('g')
    .selectAll('line')
    .data(filteredLinks)
    .join('line')
    .attr('stroke', d => d.linkType === 'pointer' ? '#bbb' : '#999')
    .attr('stroke-opacity', d => d.linkType === 'pointer' ? 0.4 : 0.6)
    .attr('stroke-width', d => d.linkType === 'pointer' ? 1.5 : 2)
    .attr('stroke-dasharray', d => d.linkType === 'pointer' ? '3,3' : 'none')
    .attr('marker-end', d => d.linkType === 'pointer' ? 'url(#arrowhead-pointer)' : 'url(#arrowhead)');
  
  // Add tooltips to links
  link.append('title')
    .text(d => d.type);
  
  // Add arrowhead markers (for relationship records)
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999');
  
  // Add arrowhead markers (for pointer fields - lighter)
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead-pointer')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#bbb');
  
  // Calculate node degrees (number of connections) for sizing
  const nodeDegrees = new Map();
  visibleNodes.forEach(n => nodeDegrees.set(n.id, 0));
  visibleLinks.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    nodeDegrees.set(sourceId, (nodeDegrees.get(sourceId) || 0) + 1);
    nodeDegrees.set(targetId, (nodeDegrees.get(targetId) || 0) + 1);
  });
  
  // Calculate radius based on degree (with min/max bounds)
  const getNodeRadius = (d) => {
    if (d.level === 0) return 16; // Center node is always prominent
    const degree = nodeDegrees.get(d.id) || 0;
    // Scale: 0 connections = 6px, 10+ connections = 14px
    return Math.min(14, Math.max(6, 6 + degree * 0.8));
  };
  
  // Draw nodes - use visibleNodes with dynamic sizing and color scheme
  const node = g.append('g')
    .selectAll('circle')
    .data(visibleNodes)
    .join('circle')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => getNodeColor(d))
    .attr('stroke', d => d.level === 0 ? '#000' : '#fff')
    .attr('stroke-width', d => d.level === 0 ? 3 : 2)
    .attr('opacity', 0.9)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Add labels
  const isDarkMode = mount?.dataset.darkMode === 'true';
  
  const label = g.append('g')
    .selectAll('text')
    .data(visibleNodes)
    .join('text')
    .text(d => {
      const maxLen = d.level === 0 ? 30 : 20;
      return d.label.length > maxLen ? d.label.substring(0, maxLen) + '...' : d.label;
    })
    .attr('font-size', d => d.level === 0 ? 12 : 10)
    .attr('font-weight', d => d.level === 0 ? 'bold' : 'normal')
    .attr('fill', isDarkMode ? '#e0e0e0' : '#333')
    .attr('dx', 15)
    .attr('dy', 4)
    .style('display', showLabels ? 'block' : 'none');
  
  // Click handler - refocus network on clicked node
  node.on('click', (event, d) => {
    const [type, id] = d.id.split(':');
    const clickedRec = (getIDX() || {})[type]?.[String(id)];
    if (clickedRec) {
      NETWORK_CURRENT_REC = clickedRec;
      NETWORK_CURRENT_TYPE = type;
      buildNetworkView();
      // Show details panel with "View in Browse" button
      const _show = (Core && Core.showNetworkNodeDetails) ? Core.showNetworkNodeDetails : (window && window.showNetworkNodeDetails ? window.showNetworkNodeDetails : null);
      if (typeof _show === 'function') _show(type, id, clickedRec);
    }
  });
  
  // Tooltip
  node.append('title')
    .text(d => `${d.label} (${d.type.toUpperCase()})\nClick to refocus network`);
  
  // Update positions
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
  
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
  
  // Update visual feedback
  updateNetworkFeedback(visibleNodes.length, visibleLinks.length);
  
  // Update legend based on color scheme
  updateNetworkLegend(colorScheme);
}

// Update network legend based on color scheme
function updateNetworkLegend(scheme) {
  const legendContent = document.getElementById('network-legend-content');
  if (!legendContent) return;
  
  let html = '';
  
  if (scheme === 'type') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Entity Types</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e6b800;"></span> Scribal Units</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#3498db;"></span> Manuscripts</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e74c3c;"></span> Production Units</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2ecc71;"></span> Holding Institutions</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#9b59b6;"></span> Monastic Institutions</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f39c12;"></span> Historical People</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#1abc9c;"></span> Texts</div>
      </div>
    `;
  } else if (scheme === 'century') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Century</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#8e44ad;"></span> 12th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e74c3c;"></span> 13th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e67e22;"></span> 14th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f39c12;"></span> 15th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f1c40f;"></span> 16th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2ecc71;"></span> 17th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#3498db;"></span> 18th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#999;"></span> No data</div>
      </div>
    `;
  } else if (scheme === 'region') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Geographic Region</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e74c3c;"></span> Germany</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#3498db;"></span> France</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2ecc71;"></span> Italy</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f39c12;"></span> England</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#9b59b6;"></span> Low Countries</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#16a085;"></span> Sweden</div>
        <div style="font-size:.75rem;color:#666;font-style:italic;margin-top:.25rem;">+ other regions</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#999;"></span> No location data</div>
      </div>
    `;
  } else if (scheme === 'order') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Religious Order</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#95a5a6;"></span> Cistercian</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#34495e;"></span> Dominican</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#8B4513;"></span> Franciscan</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2c3e50;"></span> Benedictine</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#c0392b;"></span> Augustinian</div>
      </div>
    `;
  }

  legendContent.innerHTML = html;
}
      return { buildNetworkView, buildRecordNetwork, buildNetworkDiagram, dispose: stopActiveNetworkSimulation };
    }
  };
})();
