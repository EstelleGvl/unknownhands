window.ExplorePathFinding = (function(){
function init(Core) {
const { getDATA, getIDX, getREL_INDEX, getREC_TYPE_TO_ENTITY, getACTIVE_MODE, esc, linkTo, jumpTo, MAP, debounce, flat, getRes, getVal } = Core;

// --- PATH FINDING LOGIC ---
/* ============================================================
   PATH FINDING
   ============================================================ */
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
      visited.delete(key);
      return;
    }
    
    // Explore relationships
    const rels = [...((getREL_INDEX() || {}).bySource[String(currentId)] || []), 
                  ...((getREL_INDEX() || {}).byTarget[String(currentId)] || [])];
    
    for (const rel of rels) {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const relType = getVal(rel, 'Relationship type') || 'related';
      
      // Determine next node
      let nextId, nextType, direction;
      if (String(src?.id) === String(currentId)) {
        nextId = tgt?.id;
        nextType = (getREC_TYPE_TO_ENTITY() || {})[String(tgt?.type)];
        direction = '→';
      } else {
        nextId = src?.id;
        nextType = (getREC_TYPE_TO_ENTITY() || {})[String(src?.type)];
        direction = '←';
      }
      
      if (!nextId || !nextType) continue;
      
      const nextRec = (getIDX() || {})[nextType]?.[String(nextId)];
      if (!nextRec) continue;
      
      path.push({
        type: nextType,
        id: nextId,
        title: MAP[nextType].title(nextRec),
        via: relType,
        direction
      });
      
      search(nextType, nextId, path, depth + 1);
      
      path.pop();
    }
    
    visited.delete(key);
  }
  
  const startRec = (getIDX() || {})[startType]?.[String(startId)];
  if (!startRec) return [];
  
  search(startType, startId, [{
    type: startType,
    id: startId,
    title: MAP[startType].title(startRec),
    via: 'start',
    direction: ''
  }], 0);
  
  return paths;
}

function displayPaths(paths) {
  if (!paths.length) return '<div class="muted" style="padding:1rem;">No connection found</div>';
  
  let html = `<div style="margin-top:1rem;"><div style="font-size:1.1rem;font-weight:600;margin-bottom:.75rem;color:#2c3e50;">Found ${paths.length} Connection Path${paths.length > 1 ? 's' : ''}</div>`;
  
  paths.slice(0, 5).forEach((path, i) => {
    const stepCount = path.length - 1;
    html += `<div style="margin:.75rem 0;padding:.75rem;background:#f8f9fa;border-left:4px solid #a67c00;border-radius:.5rem;">`;
    html += `<div style="font-weight:600;margin-bottom:.5rem;color:#555;">Path ${i + 1} <span class="muted" style="font-weight:normal;">(${stepCount} relationship${stepCount > 1 ? 's' : ''})</span></div>`;
    html += `<div style="margin-left:.5rem;line-height:2;">`;
    
    path.forEach((node, j) => {
      // Add the entity
      html += `<div style="display:inline-block;vertical-align:middle;">`;
      html += linkTo(node.type, node.id, node.title);
      html += `</div>`;
      
      // Add the relationship arrow if not last item
      if (j < path.length - 1) {
        const nextNode = path[j + 1];
        const arrowColor = nextNode.direction === '→' ? '#3498db' : '#9b59b6';
        html += `<div style="display:inline-block;vertical-align:middle;margin:0 .5rem;color:${arrowColor};">`;
        html += `<div style="font-size:.85rem;font-style:italic;">${esc(nextNode.via)}</div>`;
        html += `<div style="font-size:1.2rem;">${nextNode.direction}</div>`;
        html += `</div>`;
      }
    });
    
    html += '</div></div>';
  });
  
  if (paths.length > 5) {
    html += `<div class="muted" style="margin-top:.75rem;padding:.5rem;text-align:center;background:#f8f9fa;border-radius:.5rem;">+ ${paths.length - 5} more path${paths.length > 6 ? 's' : ''} found</div>`;
  }
  
  html += '</div>';
  
  return html;
}

// --- PATH FINDING DIALOG & EXPORTS ---


/* ---------- Path Finding Dialog ---------- */
const $pathDialog = document.getElementById('path-dialog');
const $pathFrom = document.getElementById('path-from');
const $pathSearch = document.getElementById('path-search');
const $pathResults = document.getElementById('path-results');
const $pathDisplay = document.getElementById('path-display');
const $pathDepth = document.getElementById('path-depth');

let pathFindingSource = null;

function showPathFindingDialog(rec, type) {
  pathFindingSource = { rec, type };
  
  // Display source record with step indicator
  $pathFrom.innerHTML = `
    <div style="display:flex;align-items:center;gap:.5rem;">
      <span style="display:inline-block;background:#3498db;color:white;border-radius:50%;width:1.5rem;height:1.5rem;text-align:center;line-height:1.5rem;font-size:.85rem;font-weight:bold;">1</span>
      <div><strong>Starting from:</strong> ${linkTo(type, rec.rec_ID, MAP[type].title(rec))} <span class="muted">(${type.toUpperCase()})</span></div>
    </div>`;
  
  // Clear search
  $pathSearch.value = '';
  $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;">Start typing to search all records in the database...</div>';
  $pathDisplay.innerHTML = '';
  
  $pathDialog.showModal();
}

// Search for target record
$pathSearch?.addEventListener('input', debounce(() => {
  const query = $pathSearch.value.trim().toLowerCase();
  if (!query) {
    $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;">Type to search for a target record...</div>';
    return;
  }
  
  // Search across all entity types
  const results = [];
  for (const [entityType, records] of Object.entries(getDATA() || {})) {
    if (entityType === 'rel') continue;
    
    records.forEach(rec => {
      const title = MAP[entityType].title(rec);
      const searchText = flat(rec);
      
      if (searchText.includes(query)) {
        results.push({
          rec,
          type: entityType,
          title,
          score: title.toLowerCase().includes(query) ? 2 : 1
        });
      }
    });
  }
  
  // Sort by score and limit
  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, 20);
  
  if (top.length === 0) {
    $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;text-align:center;">No matching records found. Try a different search term.</div>';
    return;
  }
  
  let html = `<div style="padding:.5rem;"><div class="muted" style="padding:.5rem;font-size:.9rem;">Found ${results.length} result${results.length > 1 ? 's' : ''} ${results.length > 20 ? '(showing top 20)' : ''} — click to select:</div>`;
  
  // Group by entity type for better organization
  const typeLabels = {
    'su': 'Scribal Unit',
    'ms': 'Manuscript', 
    'pu': 'Production Unit',
    'hi': 'Holding Institution',
    'mi': 'Monastic Institution',
    'hp': 'Person',
    'tx': 'Text'
  };
  
  top.forEach(({ rec, type, title }) => {
    html += `<div style="padding:.5rem .75rem;cursor:pointer;border-radius:.25rem;border-left:3px solid transparent;transition:all 0.15s;" 
      class="path-result-item" 
      data-type="${type}" 
      data-id="${rec.rec_ID}"
      onmouseover="this.style.background='#f0f8ff';this.style.borderLeftColor='#3498db';" 
      onmouseout="this.style.background='transparent';this.style.borderLeftColor='transparent';">
      <div style="font-weight:500;">${esc(title)}</div>
      <div class="muted" style="font-size:.85rem;margin-top:.15rem;">${typeLabels[type] || type.toUpperCase()}</div>
    </div>`;
  });
  html += '</div>';
  
  $pathResults.innerHTML = html;
  
  // Add click handlers
  $pathResults.querySelectorAll('.path-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetType = item.dataset.type;
      const targetId = item.dataset.id;
      const targetRec = (getIDX() || {})[targetType]?.[String(targetId)];
      
      if (targetRec) {
        findAndDisplayPaths(pathFindingSource, { rec: targetRec, type: targetType });
      }
    });
  });
}, 300));

function findAndDisplayPaths(source, target) {
  const depth = parseInt($pathDepth.value) || 4;
  
  $pathDisplay.innerHTML = '<div style="padding:.75rem;text-align:center;"><span class="muted">Searching for connection paths...</span></div>';
  
  // Run path finding (with a small delay to show searching message)
  setTimeout(() => {
    const paths = findPaths(source.type, source.rec.rec_ID, target.type, target.rec.rec_ID, depth);
    
    let html = `<div style="margin:.75rem 0;padding:.75rem;background:#f0f8e8;border-left:3px solid #2ecc71;border-radius:.5rem;">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <div><strong>Destination:</strong> ${linkTo(target.type, target.rec.rec_ID, MAP[target.type].title(target.rec))} <span class="muted">(${target.type.toUpperCase()})</span></div>
      </div>
    </div>`;
    
    if (paths.length === 0) {
      html += `<div style="padding:1rem;text-align:center;background:#fff9e6;border-radius:.5rem;margin-top:.75rem;">
        <div style="font-size:2rem;margin-bottom:.5rem;"></div>
        <div><strong>No connection found</strong></div>
        <div class="muted" style="margin-top:.5rem;">These records aren't connected within ${depth} relationship step${depth > 1 ? 's' : ''}.</div>
        <div class="muted" style="margin-top:.25rem;">Try increasing the "Maximum steps" value or selecting a different destination record.</div>
      </div>`;
    } else {
      html += displayPaths(paths);
      
      // Add export option
      html += `<div style="margin-top:1rem;">
        <button class="chip" id="export-paths-gephi" style="padding:.5rem .75rem;">Export for Gephi</button>
        <button class="chip" id="export-paths-r" style="padding:.5rem .75rem;">Export for R</button>
      </div>`;
    }
    
    $pathDisplay.innerHTML = html;
    
    // Make links clickable
    $pathDisplay.querySelectorAll('[data-jump]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const [t,id] = btn.getAttribute('data-jump').split(':');
        $pathDialog.close();
        jumpTo(t, id);
      });
    });
    
    // Export handlers
    document.getElementById('export-paths-gephi')?.addEventListener('click', () => {
      exportPathsForGephi(paths, source, target);
    });
    
    document.getElementById('export-paths-r')?.addEventListener('click', () => {
      exportPathsForR(paths, source, target);
    });
  }, 100);
}



/* ---------- Export for Network Analysis Tools ---------- */
function exportPathsForGephi(paths, source, target) {
  // Create nodes and edges from paths
  const nodes = new Map();
  const edges = [];
  
  paths.forEach(path => {
    path.forEach((node, idx) => {
      const nodeId = `${node.type}:${node.id}`;
      if (!nodes.has(nodeId)) {
        nodes.set(nodeId, {
          Id: nodeId,
          Label: node.title,
          Type: node.type
        });
      }
      
      if (idx < path.length - 1) {
        const nextNode = path[idx + 1];
        const edgeId = `${nodeId}-${nextNode.type}:${nextNode.id}`;
        edges.push({
          Source: nodeId,
          Target: `${nextNode.type}:${nextNode.id}`,
          Type: nextNode.via,
          Weight: 1
        });
      }
    });
  });
  
  // Generate CSV files
  const nodesCsv = [
    'Id,Label,Type',
    ...Array.from(nodes.values()).map(n => `"${n.Id}","${n.Label.replace(/"/g, '""')}","${n.Type}"`)
  ].join('\n');
  
  const edgesCsv = [
    'Source,Target,Type,Weight',
    ...edges.map(e => `"${e.Source}","${e.Target}","${e.Type}",${e.Weight}`)
  ].join('\n');
  
  // Download as ZIP (simplified: two separate files)
  downloadFile(nodesCsv, `gephi_nodes_${source.type}_to_${target.type}.csv`, 'text/csv');
  setTimeout(() => {
    downloadFile(edgesCsv, `gephi_edges_${source.type}_to_${target.type}.csv`, 'text/csv');
  }, 100);
  
  alert('Downloaded 2 files:\n1. Nodes CSV\n2. Edges CSV\n\nImport both into Gephi as separate tables.');
}

function exportPathsForR(paths, source, target) {
  // Create edge list format for R (igraph)
  const edges = [];
  
  paths.forEach(path => {
    path.forEach((node, idx) => {
      if (idx < path.length - 1) {
        const nextNode = path[idx + 1];
        edges.push({
          from: node.title,
          to: nextNode.title,
          from_type: node.type,
          to_type: nextNode.type,
          rel_type: nextNode.via,
          from_id: `${node.type}:${node.id}`,
          to_id: `${nextNode.type}:${nextNode.id}`
        });
      }
    });
  });
  
  // Generate R-ready CSV
  const csv = [
    'from,to,from_type,to_type,rel_type,from_id,to_id',
    ...edges.map(e => 
      `"${e.from.replace(/"/g, '""')}","${e.to.replace(/"/g, '""')}","${e.from_type}","${e.to_type}","${e.rel_type}","${e.from_id}","${e.to_id}"`
    )
  ].join('\n');
  
  // Generate R script template
  const rScript = `# Path Analysis for Unknown Hands Database
# From: ${source.type.toUpperCase()} ${source.rec.rec_ID}
# To: ${target.type.toUpperCase()} ${target.rec.rec_ID}

library(igraph)
library(tidyverse)

# Load data
edges <- read_csv("r_paths_${source.type}_to_${target.type}.csv")

# Create graph
g <- graph_from_data_frame(edges, directed = TRUE)

# Basic statistics
cat("Number of paths:", ${paths.length}, "\\n")
cat("Number of unique nodes:", vcount(g), "\\n")
cat("Number of edges:", ecount(g), "\\n")

# Plot
plot(g, 
     vertex.label.cex = 0.7,
     vertex.size = 10,
     edge.arrow.size = 0.5,
     layout = layout_with_fr(g))

# Export for further analysis
# write_csv(as_data_frame(g, "vertices"), "vertices.csv")
# write_csv(as_data_frame(g, "edges"), "edges.csv")
`;
  
  downloadFile(csv, `r_paths_${source.type}_to_${target.type}.csv`, 'text/csv');
  setTimeout(() => {
    downloadFile(rScript, `r_analysis_${source.type}_to_${target.type}.R`, 'text/plain');
  }, 100);
  
  alert('Downloaded 2 files:\n1. CSV data file\n2. R script template\n\nOpen the R script and run it with the CSV file in the same directory.');
}

function downloadFile(content, filename, mimeType) {
  let blob;
  
  // Handle both string content and Blob objects
  if (content instanceof Blob) {
    blob = content;
  } else {
    blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
  }
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}





return {

    exportPathsForGephi: typeof exportPathsForGephi !== "undefined" ? exportPathsForGephi : null,
    exportPathsForR: typeof exportPathsForR !== "undefined" ? exportPathsForR : null
,
    showPathFindingDialog: typeof showPathFindingDialog !== 'undefined' ? showPathFindingDialog : null,
    findPaths: typeof findPaths !== 'undefined' ? findPaths : null,
    displayPaths: typeof displayPaths !== 'undefined' ? displayPaths : null
};

}

return { init };
})();
