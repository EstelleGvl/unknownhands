/* ============================================================
   Unknown Hands — Utilities Module
   Shared helpers used across all modules
   ============================================================ */
window.ExploreUtils = (function(){

  function init(Core){
    const { val, esc, getDetail, getVal, getRes, getDetails, getValsAll } = Core;

    // ---------- Debounce ----------
    const debounce = (fn, ms) => {
      let t;
      return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), ms);
      };
    };

    // ---------- Array flattening for search ----------
    const flat = rec => {
      const bits = [rec.rec_Title || ''];
      (rec.details || []).forEach(d => {
        if (d.termLabel) bits.push(d.termLabel);
        if (typeof d.value === 'string') bits.push(d.value);
        if (d.value && typeof d.value === 'object' && d.value.title) bits.push(d.value.title);
      });
      // Include relationship metadata in searchable text
      if (rec.rec_ID) {
        const relText = getRelationshipSearchText(rec.rec_ID);
        if (relText) bits.push(relText);
      }
      return bits.join(' ').toLowerCase();
    };

    // ---------- Relationship search text helper ----------
    function getRelationshipSearchText(recId) {
      const rels = (Core.REL_INDEX?.bySource?.[String(recId)] || [])
        .concat(Core.REL_INDEX?.byTarget?.[String(recId)] || []);
      return rels.map(r => {
        const parts = [];
        ['Relationship type', 'scribe certainty', 'Scribe role', 'Function of Copying',
         'Text Language(s)', 'Style', 'Expression'].forEach(field => {
          const v = getVal(r, field);
          if (v) parts.push(v);
        });
        return parts.join(' ');
      }).join(' ');
    }

    // ---------- Download helper for exports ----------
    function downloadFile(filename, content, mimeType = 'text/plain') {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // ---------- Link helpers ----------
    function linkTo(type, id, text) {
      if (!id) return esc(text || '');
      return `<button type="button" class="linklike" data-jump='${type}:${String(id)}'>${esc(text || '')}</button>`;
    }

    function jumpTo(type, id) {
      // Switch to browse mode first if we're in a different mode
      if (Core.ACTIVE_MODE !== 'browse') {
        Core.setMode('browse');
      }

      // External navigation should always land on the target record, not a stale filter state.
      Core.ENTITY = type;
      document.querySelectorAll('#entity-switch .entity-btn').forEach(c => c.classList.toggle('is-on', c.dataset.entity === type));
      document.getElementById('db-search').value = '';
      document.getElementById('db-field').value = '';
      document.getElementById('db-sort').value = '';
      Core.page = 1;

      // Rebuild facets before rendering the selected record.
      const cfg = Core.FACETS[type];
      const browseList = Core.computeList();
      Core.buildFacets(browseList, cfg, {});
      Core.updateAvailableViews();

      // Now render with the selected record
      const selIndex = indexOfRecord(browseList, id);
      if (selIndex >= 0) Core.page = Math.floor(selIndex / Core.pageSize) + 1;
      Core.render(browseList, type, String(id));
    }

    // Expose to window for onclick handlers
    window.jumpTo = jumpTo;

    // ---------- Record helpers ----------
    function indexOfRecord(list, id) {
      const sId = String(id);
      for (let i = 0; i < list.length; i++) {
        if (String(list[i].rec_ID) === sId) return i;
      }
      return -1;
    }

    const uniqBy = (arr, keyFn) => {
      const seen = new Set();
      const out = [];
      arr.forEach(x => {
        const k = keyFn(x);
        if (!seen.has(k)) {
          seen.add(k);
          out.push(x);
        }
      });
      return out;
    };

    // ---------- Export functions (from export module) ----------
    async function exportElementToPNG(element, filename) {
      if (typeof html2canvas === 'undefined') {
        alert('html2canvas not loaded');
        return;
      }
      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: true,
          scale: 2
        });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        link.click();
      } catch (err) {
        console.error('Export to PNG failed:', err);
        alert('Failed to export: ' + err.message);
      }
    }

    function exportSvgAsSvg(svgElement, filename) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }

    async function exportSvgAsPng(svgElement, filename) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        link.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    async function exportMapAsPng(mapId, filename) {
      const mapContainer = document.getElementById(mapId);
      if (!mapContainer) {
        alert('Map container not found');
        return;
      }
      await exportElementToPNG(mapContainer, filename);
    }

    async function exportAnalyticsVisualization(containerId, filename) {
      const container = document.getElementById(containerId);
      if (!container) {
        alert('Visualization container not found');
        return;
      }
      await exportElementToPNG(container, filename);
    }

    async function exportTreeItemAsSvg(treeItemId, filename) {
      const element = document.getElementById(treeItemId);
      if (!element) {
        alert('Tree item not found');
        return;
      }
      const svgElement = element.querySelector('svg');
      if (svgElement) {
        exportSvgAsSvg(svgElement, filename);
      } else {
        alert('No SVG found in tree item');
      }
    }

    async function exportTreeItemAsPng(treeItemId, filename) {
      const element = document.getElementById(treeItemId);
      if (!element) {
        alert('Tree item not found');
        return;
      }
      const svgElement = element.querySelector('svg');
      if (svgElement) {
        await exportSvgAsPng(svgElement, filename);
      } else {
        alert('No SVG found in tree item');
      }
    }

    return {
      debounce,
      flat,
      linkTo,
      jumpTo,
      downloadFile,
      indexOfRecord,
      uniqBy,
      exportElementToPNG,
      exportSvgAsSvg,
      exportSvgAsPng,
      exportMapAsPng,
      exportAnalyticsVisualization,
      exportTreeItemAsSvg,
      exportTreeItemAsPng
    };
  }

  return { init };
})();
