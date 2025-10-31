# Relationship Records Integration Proposal

## Overview
Your Heurist database includes explicit **relationship records** that connect different entities with rich metadata. These are separate from the simple pointer fields already displayed.

## Current State
- ✅ Pointer fields (e.g., Manuscript → Holding Institution) are already working
- ❌ Relationship records with metadata are not yet integrated

## Relationship Record Structure
From `relationships.json`:
- **Source record**: The originating entity (could be any type: SU, MS, PU, HP, TX, etc.)
- **Target record**: The destination entity
- **Relationship type**: The nature of the connection (examples below)
- **Metadata**: Additional context (certainty, comments, folio ranges, etc.)

### Example Relationship Types Found:
1. **scribe of** - Person → Scribal Unit
2. **author of** - Person → Text
3. **Contains** - Scribal Unit/Manuscript → Text
4. **IsRelatedTo** - Generic connection between entities
5. **Nun** - Person → Monastic Institution
6. **Produced by** - Manuscript → Monastic Institution
7. **owner of** - Scribal Unit → Person

### Rich Metadata Examples:
- Scribe certainty (High, Medium, Low)
- Function of Copying (Main Text, etc.)
- Scribe role (Main copyist, etc.)
- Production info
- Folio ranges
- Comments

## Proposed Implementation

### Phase 1: Basic Integration (Recommended Start)

#### 1. Load Relationship Data
```javascript
const REL_ENDPOINT = "{{ site.baseurl }}/assets/data/relationships.json";

// Load relationships
const rels = await fetchHeuristRecords(REL_ENDPOINT, 1); // type 1 = relationships
DATA.rel = dedupeById(rels);
```

#### 2. Index Relationships
Create bidirectional indexes for fast lookup:
```javascript
// Index: sourceId → [relationship records]
// Index: targetId → [relationship records]
let REL_INDEX = { bySource: {}, byTarget: {} };

function indexRelationships() {
  REL_INDEX = { bySource: {}, byTarget: {} };
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const srcId = src?.id ? String(src.id) : null;
    const tgtId = tgt?.id ? String(tgt.id) : null;
    
    if (srcId) {
      if (!REL_INDEX.bySource[srcId]) REL_INDEX.bySource[srcId] = [];
      REL_INDEX.bySource[srcId].push(rel);
    }
    if (tgtId) {
      if (!REL_INDEX.byTarget[tgtId]) REL_INDEX.byTarget[tgtId] = [];
      REL_INDEX.byTarget[tgtId].push(rel);
    }
  });
}
```

#### 3. Display in Details Panel
Add a new section showing relationships:
```javascript
function showRelationships(rec, type) {
  const recId = String(rec.rec_ID);
  const outgoing = REL_INDEX.bySource[recId] || [];
  const incoming = REL_INDEX.byTarget[recId] || [];
  
  let html = '';
  
  // Outgoing relationships (this record → other records)
  if (outgoing.length) {
    html += '<div class="section"><strong>Relationships</strong>';
    const grouped = groupByRelType(outgoing);
    for (const [relType, rels] of grouped.entries()) {
      html += `<div><em>${esc(relType)}</em>`;
      rels.forEach(r => {
        const tgt = getRes(r, 'Target record');
        if (!tgt) return;
        const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
        const tgtRec = IDX[tgtType]?.[String(tgt.id)];
        if (!tgtRec) return;
        html += `<div>${linkTo(tgtType, tgt.id, MAP[tgtType].title(tgtRec))}`;
        
        // Add metadata if present
        const meta = getRelationshipMetadata(r);
        if (meta) html += ` <span class="muted">(${esc(meta)})</span>`;
        html += `</div>`;
      });
      html += '</div>';
    }
    html += '</div>';
  }
  
  // Incoming relationships (other records → this record)
  if (incoming.length) {
    html += '<div class="section"><strong>Referenced by</strong>';
    const grouped = groupByRelType(incoming);
    for (const [relType, rels] of grouped.entries()) {
      html += `<div><em>${esc(relType)}</em>`;
      rels.forEach(r => {
        const src = getRes(r, 'Source record');
        if (!src) return;
        const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
        const srcRec = IDX[srcType]?.[String(src.id)];
        if (!srcRec) return;
        html += `<div>${linkTo(srcType, src.id, MAP[srcType].title(srcRec))}</div>`;
      });
      html += '</div>';
    }
    html += '</div>';
  }
  
  return html;
}

function groupByRelType(relationships) {
  const grouped = new Map();
  relationships.forEach(r => {
    const relType = getVal(r, 'Relationship type') || 'Related to';
    if (!grouped.has(relType)) grouped.set(relType, []);
    grouped.get(relType).push(r);
  });
  return grouped;
}

function getRelationshipMetadata(rel) {
  const parts = [];
  const certainty = getVal(rel, 'scribe certainty');
  if (certainty) parts.push(certainty);
  
  const folioRange = getVal(rel, 'Folio range in PU') || getVal(rel, 'Folio range');
  if (folioRange) parts.push(folioRange);
  
  return parts.join(', ');
}
```

### Phase 2: Enhanced Features (Optional)

#### 1. Relationship-Based Filtering
Add a facet to search/filter by relationship type:
```javascript
// In FACETS config, add:
{ key:'has_rel', label:'Has relationship', type:'enum-multi', 
  field:'_relationship_types' } // special computed field
```

#### 2. Relationship Network Visualization
Create a simple network diagram showing connections:
- Use D3.js or Cytoscape.js
- Show the current record at center
- Display connected records around it
- Color-code by relationship type

#### 3. Relationship Search
Add ability to search within relationship metadata:
```javascript
// Search across relationship comments, certainty levels, etc.
function searchRelationships(query, records) {
  return records.filter(rec => {
    const recId = String(rec.rec_ID);
    const rels = [...(REL_INDEX.bySource[recId] || []), 
                  ...(REL_INDEX.byTarget[recId] || [])];
    return rels.some(r => flat(r).includes(query.toLowerCase()));
  });
}
```

### Phase 3: Advanced Visualizations (Future)

#### 1. Relationship Timeline
Show when relationships were created (scribes active in which periods)

#### 2. Relationship Matrix
For comparing patterns (e.g., which monasteries produced which types of texts)

#### 3. Path Finding
"Find connections between Person X and Manuscript Y"

## Implementation Steps

### Step 1: Minimal Integration (Immediate)
1. Load relationships.json
2. Add indexRelationships() function
3. Display relationships in details panel
4. Test with a few records

**Estimated time**: 2-3 hours
**Impact**: High - reveals hidden connections in your data

### Step 2: Enhanced Display (Short-term)
1. Group relationships by type
2. Show relationship metadata (certainty, folios, etc.)
3. Add collapsible sections if many relationships
4. Style relationship types differently

**Estimated time**: 2-3 hours
**Impact**: Medium - better usability

### Step 3: Search & Filter (Medium-term)
1. Add relationship-based facets
2. Enable searching within relationships
3. Add "show only records with relationships" filter

**Estimated time**: 4-6 hours
**Impact**: Medium - improves discoverability

### Step 4: Visualization (Long-term)
1. Add network diagram view
2. Implement relationship browser
3. Add relationship statistics

**Estimated time**: 8-12 hours
**Impact**: High - major feature addition

## Example Use Cases

### Use Case 1: Scribe Research
**Question**: "Who were the scribes of manuscripts at monastery X?"
1. View Monastic Institution record
2. See "Referenced by" section with relationship type "Nun"
3. Click through to see all Historical People linked as nuns
4. For each person, see their "scribe of" relationships to Scribal Units

### Use Case 2: Text Transmission
**Question**: "Which manuscripts contain Text Y?"
1. View Text record
2. See "Referenced by" section with relationship type "Contains"
3. See all Scribal Units that contain this text
4. Click through to see the parent manuscripts

### Use Case 3: Provenance Tracking
**Question**: "What is the production history of Manuscript Z?"
1. View Manuscript record
2. See "Produced by" relationships to Monastic Institutions
3. See "Contains" relationships showing which scribes worked on it
4. Follow scribe relationships to see their certainty levels and folio ranges

## Data Quality Considerations

1. **Duplicate relationships**: Some may exist as both pointer fields AND relationship records
   - Solution: Deduplicate when displaying
   
2. **Orphaned relationships**: Source/target records may not exist in other files
   - Solution: Check existence before displaying
   
3. **Relationship type variations**: Many different types exist
   - Solution: Create mapping/grouping of similar types

## Recommended Starting Point

I recommend implementing **Phase 1** first. This will:
- Reveal the rich relationship data you already have
- Take minimal time to implement
- Provide immediate value
- Allow you to assess what additional features would be most useful

Would you like me to implement Phase 1 for you? I can:
1. Add the relationship loading code
2. Create the indexing functions  
3. Integrate relationships into the details panel
4. Add proper styling for relationship display

Let me know if you'd like to proceed, or if you'd like to discuss the approach first!
