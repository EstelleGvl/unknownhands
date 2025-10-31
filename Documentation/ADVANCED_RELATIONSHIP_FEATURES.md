# Advanced Relationship Features - Implementation Plan

## Overview
Your relationship data enables sophisticated research questions that cross record boundaries. This document outlines implementations for network visualization, path finding, and advanced cross-record querying.

---

## 1. Network Diagram Visualization

### What It Does
Creates an interactive graph showing how records connect through relationships, allowing you to:
- See all connections from a record at once
- Explore relationship patterns visually
- Navigate by clicking nodes
- Filter by relationship type
- Adjust layout and zoom

### Implementation Options

#### Option A: D3.js Force-Directed Graph (Recommended)
**Pros**: Highly customizable, lightweight, great for exploration
**Cons**: Requires some learning curve

```javascript
// Add after map/timeline in the view tabs
function buildNetworkDiagram(centerRec, centerType, depth = 2) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  // Build graph data
  const nodes = [];
  const links = [];
  const visited = new Set();
  
  function addNode(rec, type, level) {
    const id = `${type}:${rec.rec_ID}`;
    if (visited.has(id)) return;
    visited.add(id);
    
    nodes.push({
      id,
      label: MAP[type].title(rec),
      type,
      level,
      rec
    });
    
    if (level >= depth) return;
    
    // Add connected records
    const recId = String(rec.rec_ID);
    const rels = [...(REL_INDEX.bySource[recId] || []), 
                  ...(REL_INDEX.byTarget[recId] || [])];
    
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const relType = getVal(rel, 'Relationship type') || 'related';
      
      // Determine if this is outgoing or incoming
      const isOutgoing = String(src?.id) === recId;
      const other = isOutgoing ? tgt : src;
      
      if (!other?.id) return;
      const otherType = REC_TYPE_TO_ENTITY[String(other.type)];
      if (!otherType) return;
      const otherRec = IDX[otherType]?.[String(other.id)];
      if (!otherRec) return;
      
      const otherId = `${otherType}:${other.id}`;
      
      links.push({
        source: id,
        target: otherId,
        type: relType,
        directed: true
      });
      
      addNode(otherRec, otherType, level + 1);
    });
  }
  
  addNode(centerRec, centerType, 0);
  
  // D3 force simulation
  const width = mount.clientWidth || 900;
  const height = 600;
  
  const svg = d3.select(mount).html('')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  const g = svg.append('g');
  
  // Add zoom
  svg.call(d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform);
  }));
  
  // Color scale by record type
  const colorScale = d3.scaleOrdinal()
    .domain(['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'])
    .range(['#e6b800', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c']);
  
  // Force simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30));
  
  // Draw links
  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', 2);
  
  // Draw nodes
  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.level === 0 ? 12 : 8)
    .attr('fill', d => colorScale(d.type))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Add labels
  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => d.label.substring(0, 20))
    .attr('font-size', 10)
    .attr('dx', 12)
    .attr('dy', 4);
  
  // Click handler
  node.on('click', (event, d) => {
    const [type, id] = d.id.split(':');
    setView('results');
    jumpTo(type, id);
  });
  
  // Tooltip
  node.append('title')
    .text(d => `${d.label} (${d.type.toUpperCase()})`);
  
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
}
```

#### Option B: Cytoscape.js (Alternative)
**Pros**: Built specifically for network graphs, great layouts, interactive
**Cons**: Larger library

```javascript
function buildNetworkCytoscape(centerRec, centerType, depth = 2) {
  // Similar node/link building as above
  const elements = {
    nodes: nodes.map(n => ({ data: n })),
    edges: links.map(l => ({ data: l }))
  };
  
  const cy = cytoscape({
    container: document.getElementById('network-mount'),
    elements,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': 'data(color)',
          'label': 'data(label)',
          'width': 30,
          'height': 30
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ],
    layout: {
      name: 'cose',
      animate: true
    }
  });
  
  cy.on('tap', 'node', function(evt) {
    const node = evt.target.data();
    jumpTo(node.type, node.rec.rec_ID);
  });
}
```

### Integration in UI

Add a "Network" view tab:
- Shows relationships graphically
- Center node = current selected record
- Color-coded by entity type
- Click nodes to navigate
- Control depth (1, 2, 3 levels)
- Filter by relationship type

---

## 2. Path Finding Between Entities

### What It Does
Discovers how two records are connected through intermediate relationships.

**Example Research Questions**:
- "How is Person X connected to Manuscript Y?"
- "What's the chain from this Text to that Monastery?"
- "Find all paths between two scribes"

### Implementation

```javascript
function findPaths(startType, startId, endType, endId, maxDepth = 4) {
  const paths = [];
  const visited = new Set();
  
  function search(currentType, currentId, path, depth) {
    if (depth > maxDepth) return;
    
    const key = `${currentType}:${currentId}`;
    if (visited.has(key)) return;
    visited.add(key);
    
    // Found target
    if (currentType === endType && String(currentId) === String(endId)) {
      paths.push([...path]);
      return;
    }
    
    // Explore relationships
    const rels = [...(REL_INDEX.bySource[String(currentId)] || []), 
                  ...(REL_INDEX.byTarget[String(currentId)] || [])];
    
    for (const rel of rels) {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const relType = getVal(rel, 'Relationship type') || 'related';
      
      // Determine next node
      let nextId, nextType;
      if (String(src?.id) === String(currentId)) {
        nextId = tgt?.id;
        nextType = REC_TYPE_TO_ENTITY[String(tgt?.type)];
      } else {
        nextId = src?.id;
        nextType = REC_TYPE_TO_ENTITY[String(src?.type)];
      }
      
      if (!nextId || !nextType) continue;
      
      const nextRec = IDX[nextType]?.[String(nextId)];
      if (!nextRec) continue;
      
      path.push({
        type: nextType,
        id: nextId,
        title: MAP[nextType].title(nextRec),
        via: relType
      });
      
      search(nextType, nextId, path, depth + 1);
      
      path.pop();
    }
    
    visited.delete(key);
  }
  
  const startRec = IDX[startType]?.[String(startId)];
  if (!startRec) return [];
  
  search(startType, startId, [{
    type: startType,
    id: startId,
    title: MAP[startType].title(startRec),
    via: 'start'
  }], 0);
  
  return paths;
}

// Display paths
function displayPaths(paths) {
  if (!paths.length) return '<div class="muted">No connection found</div>';
  
  let html = '<div class="section"><strong>Connection Paths Found</strong>';
  paths.slice(0, 5).forEach((path, i) => {
    html += `<div style="margin:.5rem 0"><em>Path ${i + 1}:</em><div style="margin-left:1rem">`;
    path.forEach((node, j) => {
      if (j > 0) html += ` → <span class="muted">(${esc(node.via)})</span> → `;
      html += linkTo(node.type, node.id, node.title);
    });
    html += '</div></div>';
  });
  if (paths.length > 5) html += `<div class="muted">...and ${paths.length - 5} more paths</div>`;
  html += '</div>';
  
  return html;
}
```

### UI Integration

Add a "Find Connection" button in the details panel:
1. User selects first record (current one)
2. User searches for second record
3. System finds all paths up to depth N
4. Display paths with relationship types
5. Click any node in path to navigate

---

## 3. Advanced Cross-Record Queries

### The Challenge
You want queries like: "Scribal units where text language ≠ colophon language"

This requires:
1. Joining data across relationships
2. Comparing fields from different records
3. Complex filtering logic

### Solution: Query Builder System

#### Architecture

```javascript
// Query definition structure
const query = {
  recordType: 'su',
  conditions: [
    {
      type: 'field_compare',
      field1: { source: 'record', field: 'Colophon language' },
      operator: '!=',
      field2: { 
        source: 'relationship', 
        relType: 'Contains',
        targetType: 'tx',
        field: 'Text Language(s)'
      }
    }
  ]
};

// Query executor
function executeComplexQuery(query) {
  let results = DATA[query.recordType] || [];
  
  for (const condition of query.conditions) {
    results = results.filter(rec => evaluateCondition(rec, condition));
  }
  
  return results;
}

function evaluateCondition(rec, condition) {
  if (condition.type === 'field_compare') {
    const val1 = getFieldValue(rec, condition.field1);
    const val2 = getFieldValue(rec, condition.field2);
    
    return compareValues(val1, val2, condition.operator);
  }
  
  if (condition.type === 'relationship_exists') {
    const recId = String(rec.rec_ID);
    const rels = REL_INDEX.bySource[recId] || [];
    return rels.some(rel => {
      const relType = getVal(rel, 'Relationship type');
      if (condition.relType && relType !== condition.relType) return false;
      
      const tgt = getRes(rel, 'Target record');
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt?.type)];
      if (condition.targetType && tgtType !== condition.targetType) return false;
      
      if (condition.fieldCondition) {
        const fieldVal = getVal(rel, condition.fieldCondition.field);
        return compareValues(fieldVal, condition.fieldCondition.value, condition.fieldCondition.operator);
      }
      
      return true;
    });
  }
  
  if (condition.type === 'related_field') {
    // Check field in related record
    const recId = String(rec.rec_ID);
    const rels = REL_INDEX.bySource[recId] || [];
    
    return rels.some(rel => {
      const relType = getVal(rel, 'Relationship type');
      if (condition.relType && relType !== condition.relType) return false;
      
      const tgt = getRes(rel, 'Target record');
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt?.type)];
      if (condition.targetType && tgtType !== condition.targetType) return false;
      
      const tgtRec = IDX[tgtType]?.[String(tgt.id)];
      if (!tgtRec) return false;
      
      const fieldVal = getVal(tgtRec, condition.field);
      return compareValues(fieldVal, condition.value, condition.operator);
    });
  }
  
  return true;
}

function getFieldValue(rec, fieldDef) {
  if (fieldDef.source === 'record') {
    return getVal(rec, fieldDef.field);
  }
  
  if (fieldDef.source === 'relationship') {
    const recId = String(rec.rec_ID);
    const rels = REL_INDEX.bySource[recId] || [];
    
    for (const rel of rels) {
      const relType = getVal(rel, 'Relationship type');
      if (fieldDef.relType && relType !== fieldDef.relType) continue;
      
      const tgt = getRes(rel, 'Target record');
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt?.type)];
      if (fieldDef.targetType && tgtType !== fieldDef.targetType) continue;
      
      return getVal(rel, fieldDef.field);
    }
  }
  
  return null;
}

function compareValues(val1, val2, operator) {
  if (operator === '==' || operator === '=') return val1 === val2;
  if (operator === '!=' || operator === '≠') return val1 !== val2;
  if (operator === 'contains') return String(val1).toLowerCase().includes(String(val2).toLowerCase());
  if (operator === 'not_contains') return !String(val1).toLowerCase().includes(String(val2).toLowerCase());
  if (operator === 'exists') return val1 != null && val1 !== '';
  if (operator === 'not_exists') return val1 == null || val1 === '';
  
  // Numeric comparisons
  const n1 = parseFloat(val1);
  const n2 = parseFloat(val2);
  if (!isNaN(n1) && !isNaN(n2)) {
    if (operator === '>') return n1 > n2;
    if (operator === '<') return n1 < n2;
    if (operator === '>=') return n1 >= n2;
    if (operator === '<=') return n1 <= n2;
  }
  
  return false;
}
```

### Query Examples

#### Example 1: Text language ≠ Colophon language
```javascript
const query1 = {
  recordType: 'su',
  conditions: [{
    type: 'field_compare',
    field1: { source: 'record', field: 'Colophon language' },
    operator: '!=',
    field2: { 
      source: 'relationship',
      relType: 'Contains',
      targetType: 'tx',
      field: 'Text Language(s)'
    }
  }]
};
```

#### Example 2: Scribes who wrote in multiple manuscripts at same monastery
```javascript
const query2 = {
  recordType: 'hp',
  conditions: [{
    type: 'custom',
    evaluate: (person) => {
      const personId = String(person.rec_ID);
      const suRels = REL_INDEX.byTarget[personId] || [];
      
      // Get all SUs this person scribed
      const sus = suRels
        .filter(r => getVal(r, 'Relationship type') === 'scribe of')
        .map(r => getRes(r, 'Source record'))
        .filter(Boolean);
      
      // Get manuscripts for these SUs
      const monasteries = new Set();
      sus.forEach(su => {
        const suRec = IDX.su?.[String(su.id)];
        if (!suRec) return;
        
        const msRes = getRes(suRec, 'Manuscript');
        if (!msRes) return;
        
        const msRec = IDX.ms?.[String(msRes.id)];
        if (!msRec) return;
        
        // Get monastery that produced this MS
        const msId = String(msRec.rec_ID);
        const msRels = REL_INDEX.byTarget[msId] || [];
        msRels.forEach(r => {
          if (getVal(r, 'Relationship type') === 'Produced by') {
            const mon = getRes(r, 'Source record');
            if (mon) monasteries.add(String(mon.id));
          }
        });
      });
      
      // At least one monastery with multiple manuscripts
      return sus.length >= 2 && monasteries.size >= 1;
    }
  }]
};
```

#### Example 3: Manuscripts containing texts by female authors
```javascript
const query3 = {
  recordType: 'ms',
  conditions: [{
    type: 'related_field',
    relType: 'Contains',
    targetType: 'tx',
    nestedCheck: {
      // Check if text's author is female
      relType: 'author of',
      targetType: 'hp',
      field: 'Gender',
      operator: '==',
      value: 'Female'
    }
  }]
};
```

### UI Implementation: Query Builder Interface

```html
<div id="query-builder" class="query-builder" hidden>
  <h3>Advanced Query Builder</h3>
  
  <div class="query-row">
    <label>Find records of type:</label>
    <select id="qb-record-type">
      <option value="su">Scribal Units</option>
      <option value="ms">Manuscripts</option>
      <option value="hp">Historical People</option>
      <option value="tx">Texts</option>
      <option value="pu">Production Units</option>
      <option value="mi">Monastic Institutions</option>
      <option value="hi">Holding Institutions</option>
    </select>
  </div>
  
  <div id="qb-conditions"></div>
  
  <button id="qb-add-condition">+ Add Condition</button>
  <button id="qb-execute">Execute Query</button>
  <button id="qb-clear">Clear</button>
</div>

<style>
.query-builder {
  border: 1px solid #ddd;
  border-radius: .5rem;
  padding: 1rem;
  margin: 1rem 0;
  background: #f9f9f9;
}

.query-row {
  display: flex;
  gap: .5rem;
  align-items: center;
  margin: .5rem 0;
}

.condition-group {
  border: 1px solid #ccc;
  padding: .75rem;
  margin: .5rem 0;
  border-radius: .5rem;
  background: white;
}
</style>
```

### Saved Query Templates

Create preset queries for common research patterns:

```javascript
const QUERY_TEMPLATES = {
  'language_mismatch': {
    name: 'Text language ≠ Colophon language',
    recordType: 'su',
    conditions: [/* as above */]
  },
  
  'multilingual_scribes': {
    name: 'Scribes who worked in multiple languages',
    recordType: 'hp',
    conditions: [/* check multiple text languages */]
  },
  
  'monastic_production': {
    name: 'Manuscripts produced at monasteries',
    recordType: 'ms',
    conditions: [{
      type: 'relationship_exists',
      relType: 'Produced by',
      targetType: 'mi'
    }]
  },
  
  'high_certainty_attributions': {
    name: 'Scribal attributions with High certainty',
    recordType: 'su',
    conditions: [{
      type: 'relationship_exists',
      relType: 'scribe of',
      fieldCondition: {
        field: 'scribe certainty',
        operator: '==',
        value: 'High'
      }
    }]
  }
};
```

---

## 4. Implementation Roadmap

### Phase 1: Enhanced Metadata Display ✅ (DONE)
- Show all relationship metadata fields

### Phase 2: Network Visualization (Next)
**Time**: 6-8 hours
**Priority**: High - Very powerful for exploration

Steps:
1. Include D3.js library
2. Add "Network" view tab
3. Implement force-directed layout
4. Add depth control
5. Style by entity type
6. Add click navigation

### Phase 3: Path Finding (Medium-term)
**Time**: 4-6 hours
**Priority**: Medium - Specific research tool

Steps:
1. Implement BFS algorithm
2. Add "Find Connection" UI
3. Display paths nicely
4. Add path filtering

### Phase 4: Query Builder (Long-term)
**Time**: 12-16 hours
**Priority**: High - Enables complex research

Steps:
1. Design query DSL (domain-specific language)
2. Build query executor
3. Create UI for building queries
4. Add saved query templates
5. Export query results

### Phase 5: Advanced Analytics (Future)
**Time**: 8-12 hours
**Priority**: Medium

Features:
- Relationship statistics dashboard
- Clustering analysis
- Temporal patterns
- Export to research tools (Gephi, R, etc.)

---

## 5. Immediate Next Steps

I recommend implementing in this order:

### 1. Network Visualization (This Week)
Would you like me to implement the D3.js network diagram? This will give you immediate visual insight into relationships.

### 2. Basic Query System (Next Week)
Start with simple queries:
- "Records with relationship type X"
- "Records connected to specific target"
- Field comparisons within relationships

### 3. Query Builder UI (Following Week)
Visual interface for building complex queries without code.

---

## Questions for You

1. **Network Diagram**: Would you like me to implement this now? Which library (D3.js or Cytoscape)?

2. **Query Priorities**: Which types of queries are most important for your research?
   - Language comparisons?
   - Certainty level analysis?
   - Monastic production patterns?
   - Cross-manuscript scribe identification?

3. **UI Location**: Where should these features appear?
   - New tab in main interface?
   - Separate "Advanced Research" page?
   - Popup modal?

4. **Data Export**: Do you need to export query results for external analysis (R, Python, Gephi)?

Let me know what you'd like to prioritize and I'll start implementing!
