window.ExploreTimeline = (function() {
  return {
    init: function(Core) {
      const getDATA = () => Core.DATA;
      const getIDX = () => Core.IDX;
      const getActiveEntity = () => Core.activeEntity;
      const getENTITY = () => Core.ENTITY;
      const MAP = Core.MAP;
      const getREL_INDEX = () => Core.REL_INDEX;
      const isKnownCategory = Core.isKnownCategory;
      
      const {
        val, getVal, getDetail, getRes, getDetailsAll, getValsAll, esc,
        $panes, $tabs, $mapTitle, supportsTimeline
      } = Core;

/* ---------- Timeline ---------- */
let TIMELINE_ZOOM = null; // {minYear, maxYear} for current zoom level
let TIMELINE_SVG = null; // Reference to SVG element for brushing
let TIMELINE_SELECTED = null; // Currently selected record for highlighting connections

function buildTimeline(){
  // Only render where supported
  if (!supportsTimeline(getENTITY())) return;

  const mount = document.getElementById('timeline-mount');
  if (!mount) return;

  // Get control states
  const showMultiBand = document.getElementById('timeline-show-multi')?.checked ?? true;
  const showRanges = document.getElementById('timeline-show-ranges')?.checked ?? true;
  const showCenturies = document.getElementById('timeline-show-centuries')?.checked ?? true;
  const colorBy = document.getElementById('timeline-color-by')?.value || 'entity';

  // Helper: get year safely
  const getYear = s => {
    if (!s) return null;
    const m = String(s).match(/(^|[^0-9])([0-9]{3,4})(?![0-9])/);
    if (!m) return null;
    const y = parseInt(m[2], 10);
    return (y >= 800 && y <= 1800) ? y : null;
  };

  // Helper: get linked records for highlighting
  const getLinkedRecords = (rec, entity) => {
    const linked = new Set();
    if (!rec || !rec.rec_ID) return linked;
    
    const recId = String(rec.rec_ID);
    
    // Add relationships using correct getREL_INDEX() structure
    const rels = [...(getREL_INDEX().bySource[recId] || []), 
                  ...(getREL_INDEX().byTarget[recId] || [])];
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      if (src && src.id) linked.add(String(src.id));
      if (tgt && tgt.id) linked.add(String(tgt.id));
    });
    
    // Add pointer fields
    ['details', 'details_summary'].forEach(key => {
      if (!rec[key]) return;
      Object.values(rec[key]).forEach(d => {
        if (d.recIDs) d.recIDs.forEach(id => linked.add(String(id)));
      });
    });
    
    return linked;
  };

  // Collect data for all entity types if multi-band, otherwise just current
  const collectTimelineData = () => {
    const data = {
      ms: [],
      su: [],
      pu: [],
      mi: []
    };

    if (showMultiBand) {
      // Collect ALL data across entity types
      getDATA().ms.forEach(r => {
        const tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
        const taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
        if (tpq || taq) {
          // Use midpoint for year position when range exists
          const year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq);
          data.ms.push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: 'ms'
          });
        }
      });

      getDATA().su.forEach(r => {
        const tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
        const taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
        const dating = getYear(getDetail(r,'SU dating')?.value);
        // Use midpoint for year position when range exists
        let year;
        if (tpq && taq && tpq !== taq) {
          year = Math.round((tpq + taq) / 2);
        } else {
          year = tpq || taq || dating;
        }
        if (year) {
          data.su.push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: 'su'
          });
        }
      });

      getDATA().pu.forEach(r => {
        const tpq = getYear(getDetail(r,'PU Date terminus post quem')?.value);
        const taq = getYear(getDetail(r,'PU Date terminus ante quem')?.value);
        const dating = getYear(getDetail(r,'PU dating')?.value);
        // Use midpoint for year position when range exists
        let year;
        if (tpq && taq && tpq !== taq) {
          year = Math.round((tpq + taq) / 2);
        } else {
          year = tpq || taq || dating;
        }
        if (year) {
          data.pu.push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: 'pu'
          });
        }
      });

      getDATA().mi.forEach(r => {
        const creation = getYear(getDetail(r,'Creation date')?.value);
        const suppression = getYear(getDetail(r,'Suppression date')?.value);
        if (creation) {
          data.mi.push({
            rec: r,
            year: creation,
            tpq: creation,
            taq: suppression,
            hasRange: !!(creation && suppression),
            entity: 'mi',
            type: 'creation'
          });
        }
        if (suppression && suppression !== creation) {
          data.mi.push({
            rec: r,
            year: suppression,
            tpq: creation,
            taq: suppression,
            hasRange: false,
            entity: 'mi',
            type: 'suppression'
          });
        }
      });
    } else {
      // Single entity mode - use filtered list
      const list = computeList();
      list.forEach(r => {
        let tpq, taq, year;
        if (getENTITY() === 'ms') {
          tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
          taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
          year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq);
        } else if (getENTITY() === 'su') {
          tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
          taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
          const dating = getYear(getDetail(r,'SU dating')?.value);
          year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq || dating);
        } else if (getENTITY() === 'pu') {
          tpq = getYear(getDetail(r,'PU Date terminus post quem')?.value);
          taq = getYear(getDetail(r,'PU Date terminus ante quem')?.value);
          const dating = getYear(getDetail(r,'PU dating')?.value);
          year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq || dating);
        } else if (getENTITY() === 'mi') {
          const creation = getYear(getDetail(r,'Creation date')?.value);
          const suppression = getYear(getDetail(r,'Suppression date')?.value);
          tpq = creation;
          taq = suppression;
          year = (creation && suppression) ? Math.round((creation + suppression) / 2) : (creation || suppression);
        }

        if (year) {
          data[getENTITY()].push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: getENTITY()
          });
        }
      });
    }

    return data;
  };

  const data = collectTimelineData();
  const allItems = [...data.ms, ...data.su, ...data.pu, ...data.mi].filter(item => {
    if (!isKnownCategory(MAP[item.entity]?.title(item.rec))) return false;
    if (colorBy === 'language') {
      const language = getVal(item.rec, 'Text Language(s)') || getVal(item.rec, 'Language of Text');
      return isKnownCategory(language);
    }
    if (colorBy === 'script') {
      const script = getVal(item.rec, 'Normalised script(s)') || getVal(item.rec, 'Script Comments');
      return isKnownCategory(script);
    }
    return true;
  });
  const visibleItems = new Set(allItems);

  if (allItems.length === 0) {
    mount.style.height = '160px';
    mount.innerHTML = '<div class="muted" style="padding:.75rem">No dates in current results.</div>';
    return;
  }

  // Calculate date range
  const allYears = allItems.map(d => d.tpq || d.year).concat(allItems.map(d => d.taq || d.year)).filter(y => y);
  let minYear = Math.min(...allYears);
  let maxYear = Math.max(...allYears);

  // Apply zoom if active
  if (TIMELINE_ZOOM) {
    minYear = TIMELINE_ZOOM.minYear;
    maxYear = TIMELINE_ZOOM.maxYear;
  }

  // Add padding
  const yearSpan = maxYear - minYear;
  minYear = minYear - yearSpan * 0.05;
  maxYear = maxYear + yearSpan * 0.05;

  // Dimensions
  const width = mount.clientWidth || 900;
  const padX = 60;
  const padTop = 40;
  const padBottom = 60;
  const bandHeight = 80;
  const bandGap = 20;

  const bands = showMultiBand ? 
    [{key: 'ms', label: 'Manuscripts', color: '#3388ff'},
     {key: 'su', label: 'Scribal Units', color: '#10b981'},
     {key: 'pu', label: 'Production Units', color: '#ff7800'},
     {key: 'mi', label: 'Monastic Inst.', color: '#9333ea'}] :
    [{key: getENTITY(), label: MAP[getENTITY()]?.plural || 'Items', color: '#3388ff'}];

  const totalHeight = padTop + (bands.length * bandHeight) + ((bands.length - 1) * bandGap) + padBottom;

  // Scale function
  const xScale = (year) => padX + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padX);

  // Color functions
  const getItemColor = (item) => {
    if (colorBy === 'entity') {
      const colors = {ms: '#3388ff', su: '#10b981', pu: '#ff7800', mi: '#9333ea'};
      return colors[item.entity] || '#999';
    } else if (colorBy === 'language') {
      // Get language from proper fields based on entity type
      let lang = null;
      if (item.entity === 'ms' || item.entity === 'su') {
        lang = getVal(item.rec, 'Text Language(s)') || getVal(item.rec, 'Language of Text');
      } else if (item.entity === 'tx') {
        lang = getVal(item.rec, 'Language of Text');
      }
      
      // Handle array values and termLabel
      if (!lang) return '#6b7280';
      const langStr = String(lang).trim();
      
      const langColors = {
        'Latin': '#dc2626',
        'French': '#2563eb',
        'Italian': '#16a34a',
        'German': '#ca8a04',
        'English': '#9333ea',
        'Dutch': '#10b981',
        'Hebrew': '#eab308',
        'Greek': '#fb923c',
        'Arabic': '#f59e0b'
      };
      
      // Check if string contains language name
      for (const [langName, color] of Object.entries(langColors)) {
        if (langStr.includes(langName)) return color;
      }
      
      return '#6b7280';
    } else if (colorBy === 'script') {
      // Get script from proper field
      let script = getVal(item.rec, 'Normalised script(s)') || getVal(item.rec, 'Script Comments');
      
      if (!script) return '#6b7280';
      const scriptStr = String(script).trim();
      
      const scriptColors = {
        'Gothic': '#dc2626',
        'Caroline': '#2563eb',
        'Carolingian': '#2563eb',
        'Humanistic': '#16a34a',
        'Uncial': '#ca8a04',
        'Beneventan': '#9333ea',
        'Insular': '#fb923c',
        'Textualis': '#b91c1c'
      };
      
      // Check if string contains script name
      for (const [scriptName, color] of Object.entries(scriptColors)) {
        if (scriptStr.includes(scriptName)) return color;
      }
      
      return '#6b7280';
    } else if (colorBy === 'certainty') {
      // Use presence of range as proxy for certainty
      if (item.hasRange) {
        const rangeSize = Math.abs((item.taq || item.year) - (item.tpq || item.year));
        if (rangeSize <= 10) return '#16a34a'; // High certainty (narrow range)
        if (rangeSize <= 50) return '#ca8a04'; // Medium certainty
        return '#dc2626'; // Low certainty (wide range)
      }
      return '#2563eb'; // Exact date (high certainty)
    }
    return '#999';
  };

  // Start building SVG
  let svg = `<svg id="timeline-svg" width="${width}" height="${totalHeight}" style="background: white;">`;

  // Century markers and shading
  if (showCenturies) {
    const firstCentury = Math.floor(minYear / 100) * 100;
    const lastCentury = Math.ceil(maxYear / 100) * 100;
    
    // Medieval period shading (roughly 500-1500)
    if (minYear < 1500 && maxYear > 500) {
      const medievalStart = Math.max(minYear, 500);
      const medievalEnd = Math.min(maxYear, 1500);
      svg += `<rect x="${xScale(medievalStart)}" y="${padTop}" width="${xScale(medievalEnd) - xScale(medievalStart)}" height="${totalHeight - padTop - padBottom}" fill="#f3f4f6" opacity="0.5"/>`;
      svg += `<text x="${xScale((medievalStart + medievalEnd) / 2)}" y="${padTop - 5}" text-anchor="middle" font-size="11" fill="#9ca3af">Medieval Period</text>`;
    }

    // Century lines
    for (let century = firstCentury; century <= lastCentury; century += 100) {
      if (century >= minYear && century <= maxYear) {
        const x = xScale(century);
        svg += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${totalHeight - padBottom}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="2,2"/>`;
        svg += `<text x="${x}" y="${totalHeight - padBottom + 20}" text-anchor="middle" font-size="11" fill="#6b7280">${century}</text>`;
      }
    }
  }

  // Draw bands
  bands.forEach((band, bandIndex) => {
    const bandY = padTop + (bandIndex * (bandHeight + bandGap));
    const bandMidY = bandY + bandHeight / 2;
    const items = data[band.key].filter(item => visibleItems.has(item));

    // Band baseline
    svg += `<line x1="${padX}" y1="${bandMidY}" x2="${width - padX}" y2="${bandMidY}" stroke="#d1d5db" stroke-width="1"/>`;
    
    // Band label
    svg += `<text x="${padX - 10}" y="${bandMidY + 5}" text-anchor="end" font-size="12" font-weight="600" fill="${band.color}">${band.label}</text>`;
    svg += `<text x="${padX - 10}" y="${bandMidY + 18}" text-anchor="end" font-size="10" fill="#9ca3af">(${items.length})</text>`;

    // Draw items
    items.forEach((item, idx) => {
      const color = getItemColor(item);
      const title = (MAP[item.entity]?.title(item.rec) || 'Untitled').replace(/"/g, '&quot;');
      const jitter = (Math.random() - 0.5) * (bandHeight * 0.6);
      const y = bandMidY + jitter;
      const recId = String(item.rec.rec_ID);
      const isSelected = TIMELINE_SELECTED === recId;
      
      // Check if this item is linked to the selected item
      const linkedToSelected = TIMELINE_SELECTED && TIMELINE_SELECTED !== recId && 
        (() => {
          const selectedRec = getIDX()[getENTITY() === 'all' ? item.entity : getENTITY()]?.[TIMELINE_SELECTED];
          if (!selectedRec) return false;
          return getLinkedRecords(selectedRec, item.entity).has(recId);
        })();

      if (showRanges && item.hasRange && item.tpq && item.taq) {
        // Draw as horizontal bar (more transparent)
        const x1 = xScale(item.tpq);
        const x2 = xScale(item.taq);
        // Ensure positive width by using min/max
        const xLeft = Math.min(x1, x2);
        const xRight = Math.max(x1, x2);
        const rectWidth = Math.max(0, xRight - xLeft); // Ensure non-negative width
        const xMid = xScale(item.year); // midpoint position
        const barHeight = 6;
        
        // Determine opacity based on selection state
        let barOpacity = 0.15; // Much more transparent
        let dotOpacity = 0.8;
        if (isSelected) {
          barOpacity = 0.4;
          dotOpacity = 1;
        } else if (linkedToSelected) {
          barOpacity = 0.3;
          dotOpacity = 1;
        } else if (TIMELINE_SELECTED) {
          barOpacity = 0.05; // Very faded when something else is selected
          dotOpacity = 0.2;
        }
        
        svg += `<rect class="timeline-item" data-recid="${recId}" x="${xLeft}" y="${y - barHeight/2}" width="${rectWidth}" height="${barHeight}" fill="${color}" opacity="${barOpacity}" stroke="${isSelected ? '#000' : color}" stroke-width="${isSelected ? '3' : '1'}" style="cursor: pointer;"><title>${title}\n${item.tpq}–${item.taq} (midpoint: ${item.year})</title></rect>`;
        
        // Draw dot at midpoint with stronger selection styling
        svg += `<circle class="timeline-item" data-recid="${recId}" cx="${xMid}" cy="${y}" r="${isSelected ? '7' : '4'}" fill="${color}" opacity="${dotOpacity}" stroke="${isSelected ? '#000' : (linkedToSelected ? color : 'none')}" stroke-width="${isSelected ? '3' : '2'}" style="cursor: pointer;"><title>${title} (${item.year})</title></circle>`;
      } else {
        // Draw as dot only
        const x = xScale(item.year);
        let dotOpacity = 0.8;
        if (isSelected) {
          dotOpacity = 1;
        } else if (linkedToSelected) {
          dotOpacity = 1;
        } else if (TIMELINE_SELECTED) {
          dotOpacity = 0.2;
        }
        
        svg += `<circle class="timeline-item" data-recid="${recId}" cx="${x}" cy="${y}" r="${isSelected ? '7' : '4'}" fill="${color}" opacity="${dotOpacity}" stroke="${isSelected ? '#000' : (linkedToSelected ? color : 'none')}" stroke-width="${isSelected ? '3' : '2'}" style="cursor: pointer;"><title>${title} (${item.year})</title></circle>`;
      }
    });
  });

  // X-axis labels
  svg += `<text x="${padX}" y="${totalHeight - padBottom + 40}" font-size="12" fill="#374151">${Math.round(minYear)}</text>`;
  svg += `<text x="${width/2}" y="${totalHeight - padBottom + 40}" text-anchor="middle" font-size="12" fill="#374151">${Math.round((minYear + maxYear) / 2)}</text>`;
  svg += `<text x="${width - padX}" y="${totalHeight - padBottom + 40}" text-anchor="end" font-size="12" fill="#374151">${Math.round(maxYear)}</text>`;

  svg += '</svg>';

  mount.style.height = `${totalHeight}px`;
  mount.innerHTML = svg;
  
  // Add click handlers for items
  setupTimelineItemClicks(mount);
  
  // Update legend
  updateTimelineLegend(colorBy);
  
  // Setup control handlers (including zoom buttons)
  setupTimelineControls(minYear, maxYear);
}

function updateTimelineLegend(colorBy) {
  const legendDiv = document.getElementById('timeline-legend');
  if (!legendDiv) return;

  let legendHTML = '<strong style="color: #374151;">Legend:</strong>';

  if (colorBy === 'entity') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #3388ff; border-radius: 50%;"></span> Manuscripts</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></span> Scribal Units</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ff7800; border-radius: 50%;"></span> Production Units</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #9333ea; border-radius: 50%;"></span> Monastic Inst.</span>
    `;
  } else if (colorBy === 'language') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></span> Latin</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></span> French</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></span> Italian</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ca8a04; border-radius: 50%;"></span> German</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #9333ea; border-radius: 50%;"></span> English</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #eab308; border-radius: 50%;"></span> Hebrew</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #fb923c; border-radius: 50%;"></span> Greek</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></span> Arabic</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #6b7280; border-radius: 50%;"></span> Other</span>
      <span style="font-style: italic; margin-left: 0.5rem; color: #9ca3af;">Click dots to highlight • +/− to zoom</span>
    `;
  } else if (colorBy === 'script') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></span> Gothic/Textualis</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></span> Caroline/Carolingian</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></span> Humanistic</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ca8a04; border-radius: 50%;"></span> Uncial</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #9333ea; border-radius: 50%;"></span> Beneventan</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #fb923c; border-radius: 50%;"></span> Insular</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #6b7280; border-radius: 50%;"></span> Other</span>
      <span style="font-style: italic; margin-left: 0.5rem; color: #9ca3af;">Click dots to highlight • +/− to zoom</span>
    `;
  } else if (colorBy === 'certainty') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></span> Exact Date</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></span> High Certainty (≤10 yrs)</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ca8a04; border-radius: 50%;"></span> Medium (11-50 yrs)</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></span> Low Certainty (>50 yrs)</span>
      <span style="font-style: italic; margin-left: 0.5rem; color: #9ca3af;">Click dots to highlight • +/− to zoom</span>
    `;
  }

  legendDiv.innerHTML = legendHTML;
}

function setupTimelineItemClicks(mount) {
  const items = mount.querySelectorAll('.timeline-item');
  
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const recID = item.getAttribute('data-recid'); // Keep as string
      
      if (TIMELINE_SELECTED === recID) {
        // Deselect if clicking same item
        TIMELINE_SELECTED = null;
      } else {
        // Select new item
        TIMELINE_SELECTED = recID;
        
        // Show record details in sidebar (if not already visible)
        // Try to find record in appropriate entity index
        let rec = null;
        for (const entityType of ['ms', 'su', 'pu', 'mi']) {
          if (getIDX()[entityType]?.[recID]) {
            rec = getIDX()[entityType][recID];
            break;
          }
        }
        if (rec) {
          showRecord(rec);
        }
      }
      
      // Rebuild timeline to show selection
      buildTimeline();
    });
  });
  
  // Click on background to deselect
  const svg = mount.querySelector('#timeline-svg');
  if (svg) {
    svg.addEventListener('click', (e) => {
      if (e.target === svg) {
        TIMELINE_SELECTED = null;
        buildTimeline();
      }
    });
  }
}

function setupTimelineControls(currentMinYear, currentMaxYear) {
  // Zoom in button
  const zoomInBtn = document.getElementById('timeline-zoom-in');
  if (zoomInBtn && !zoomInBtn.hasAttribute('data-timeline-listener')) {
    zoomInBtn.setAttribute('data-timeline-listener', 'true');
    zoomInBtn.addEventListener('click', () => {
      if (!TIMELINE_ZOOM) {
        // First zoom - zoom to center 50%
        const center = (currentMinYear + currentMaxYear) / 2;
        const span = (currentMaxYear - currentMinYear) * 0.5;
        TIMELINE_ZOOM = {
          minYear: Math.round(center - span / 2),
          maxYear: Math.round(center + span / 2)
        };
      } else {
        // Zoom in further by 50%
        const center = (TIMELINE_ZOOM.minYear + TIMELINE_ZOOM.maxYear) / 2;
        const span = (TIMELINE_ZOOM.maxYear - TIMELINE_ZOOM.minYear) * 0.5;
        TIMELINE_ZOOM = {
          minYear: Math.round(center - span / 2),
          maxYear: Math.round(center + span / 2)
        };
      }
      buildTimeline();
    });
  }

  // Zoom out button
  const zoomOutBtn = document.getElementById('timeline-zoom-out');
  if (zoomOutBtn && !zoomOutBtn.hasAttribute('data-timeline-listener')) {
    zoomOutBtn.setAttribute('data-timeline-listener', 'true');
    zoomOutBtn.addEventListener('click', () => {
      if (TIMELINE_ZOOM) {
        // Zoom out by 150%
        const center = (TIMELINE_ZOOM.minYear + TIMELINE_ZOOM.maxYear) / 2;
        const span = (TIMELINE_ZOOM.maxYear - TIMELINE_ZOOM.minYear) * 1.5;
        TIMELINE_ZOOM = {
          minYear: Math.round(center - span / 2),
          maxYear: Math.round(center + span / 2)
        };
        buildTimeline();
      }
    });
  }
  // Multi-band toggle
  const multiBandCheckbox = document.getElementById('timeline-show-multi');
  if (multiBandCheckbox && !multiBandCheckbox.hasAttribute('data-timeline-listener')) {
    multiBandCheckbox.setAttribute('data-timeline-listener', 'true');
    multiBandCheckbox.addEventListener('change', buildTimeline);
  }

  // Show ranges toggle
  const rangesCheckbox = document.getElementById('timeline-show-ranges');
  if (rangesCheckbox && !rangesCheckbox.hasAttribute('data-timeline-listener')) {
    rangesCheckbox.setAttribute('data-timeline-listener', 'true');
    rangesCheckbox.addEventListener('change', buildTimeline);
  }

  // Century markers toggle
  const centuriesCheckbox = document.getElementById('timeline-show-centuries');
  if (centuriesCheckbox && !centuriesCheckbox.hasAttribute('data-timeline-listener')) {
    centuriesCheckbox.setAttribute('data-timeline-listener', 'true');
    centuriesCheckbox.addEventListener('change', buildTimeline);
  }

  // Color by selector
  const colorBySelect = document.getElementById('timeline-color-by');
  if (colorBySelect && !colorBySelect.hasAttribute('data-timeline-listener')) {
    colorBySelect.setAttribute('data-timeline-listener', 'true');
    colorBySelect.addEventListener('change', (e) => {
      buildTimeline();
      updateTimelineLegend(e.target.value);
    });
  }

  // Reset zoom button
  const resetZoomBtn = document.getElementById('timeline-reset-zoom');
  if (resetZoomBtn && !resetZoomBtn.hasAttribute('data-timeline-listener')) {
    resetZoomBtn.setAttribute('data-timeline-listener', 'true');
    resetZoomBtn.addEventListener('click', () => {
      TIMELINE_ZOOM = null;
      buildTimeline();
    });
  }
}


      return { buildTimeline };
    }
  };
})();
