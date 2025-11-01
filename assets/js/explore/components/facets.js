/**
 * Facets component for filtering records
 */

import { getVal, getDetail, val, getValsAll, getRes, flat } from '../core/utils.js';

/**
 * Year helper functions
 */
export function firstYear(s) {
  if (!s) return null;
  const m = String(s).match(/(^|[^0-9])([0-9]{3,4})(?![0-9])/);
  if (!m) return null;
  const y = parseInt(m[2], 10);
  if (isNaN(y) || y < 1 || y > 2100) return null;
  return y;
}

export function rangeYears(s) {
  if (!s) return null;
  const m = String(s).match(/([0-9]{3,4}).*?([0-9]{3,4})/);
  if (!m) return null;
  const a = parseInt(m[1], 10);
  const b = parseInt(m[2], 10);
  if ([a, b].some(x => isNaN(x) || x < 1 || x > 2100)) return null;
  return [a, b];
}

export function formatYear(input) {
  const r = rangeYears(input);
  if (r) return r[0] === r[1] ? String(r[0]) : `${r[0]}–${r[1]}`;
  const y = firstYear(input);
  return y ? String(y) : '';
}

export function joinYearRange(pq, aq) {
  const y1 = firstYear(pq);
  const y2 = firstYear(aq);
  if (y1 && y2) return y1 === y2 ? String(y1) : `${y1}–${y2}`;
  return (y1 || y2) ? String(y1 || y2) : '';
}

/**
 * Mapping functions for titles, dates, and other derived fields
 */
export const MAP = {
  su: {
    title: r => r.rec_Title || ('Record ' + r.rec_ID),
    date: r => joinYearRange(
      getVal(r, 'Normalized terminus post quem'),
      getVal(r, 'Normalized terminus ante quem')
    ) || formatYear(getVal(r, 'SU dating')),
    manuscriptTitle: r => (getRes(r, 'Manuscript')?.title) || '',
    manuscriptId: r => (getRes(r, 'Manuscript')?.id) || '',
    flat,
  },
  ms: {
    title: r => r.rec_Title || ('Manuscript ' + r.rec_ID),
    date: r => formatYear(getVal(r, 'Ms Dating')),
    callno: r => getVal(r, 'Call number') || '',
    holdingTitle: r => (getRes(r, 'Holding Institution')?.title) || '',
    holdingId: r => (getRes(r, 'Holding Institution')?.id) || '',
    iiifManifest: r => {
      const d = (r.details || []).find(x =>
        (x.fieldName || '').toLowerCase().includes('manifest')
      );
      return d
        ? (typeof d.value === 'string' ? d.value : (d.value?.url || ''))
        : '';
    },
    flat,
  },
  pu: {
    title: r => r.rec_Title || ('Production Unit ' + r.rec_ID),
    date: r => joinYearRange(
      getVal(r, 'Normalized terminus post quem'),
      getVal(r, 'Normalized terminus ante quem')
    ) || formatYear(getVal(r, 'PU dating')),
    place: r => [getVal(r, 'PU country'), getVal(r, 'PU City')]
      .filter(Boolean)
      .join(', '),
    manuscriptTitle: r => (getRes(r, 'Manuscript')?.title) || '',
    manuscriptId: r => (getRes(r, 'Manuscript')?.id) || '',
    flat,
  },
  hi: {
    title: r => r.rec_Title || ('Holding ' + r.rec_ID),
    country: r => getVal(r, 'Country'),
    city: r => getVal(r, 'City'),
    itype: r => getVal(r, 'Institution type'),
    flat
  },
  mi: {
    title: r => r.rec_Title || ('Monastic ' + r.rec_ID),
    dates: r => joinYearRange(
      getDetail(r, 'Creation date')?.value,
      getDetail(r, 'Suppression date')?.value
    ),
    order: r => getVal(r, 'Religious order'),
    city: r => getVal(r, 'City'),
    country: r => getVal(r, 'Country'),
    flat
  },
  hp: {
    title: r => r.rec_Title || ('Person ' + r.rec_ID),
    gender: r => getVal(r, 'Gender'),
    gcert: r => getVal(r, 'Gender certainty'),
    ptype: r => getVal(r, 'Person type'),
    flat
  },
  tx: {
    title: r => r.rec_Title || ('Text ' + r.rec_ID),
    ntitle: r => getVal(r, 'Normalized Title'),
    genre: r => getVal(r, 'Genre'),
    sub: r => getVal(r, 'Subgenre'),
    flat
  },
};

/**
 * Build facet UI elements
 * @param {HTMLElement} mount - DOM element to mount facets
 * @param {Array} records - Records to build facets from
 * @param {Array} config - Facet configuration
 * @param {Object} prevState - Previous facet state to restore
 */
export function buildFacets(mount, records, config, prevState = {}) {
  mount.innerHTML = '';
  
  config.forEach(f => {
    const box = document.createElement('div');
    box.className = 'facet';
    
    const title = document.createElement('div');
    title.className = 'facet-title';
    title.textContent = f.label;
    box.appendChild(title);

    if (f.type === 'enum') {
      const counts = {};
      records.forEach(r => {
        const v = getVal(r, f.field);
        if (!v || v === '—') return;
        counts[v] = (counts[v] || 0) + 1;
      });
      
      const wrap = document.createElement('div');
      wrap.className = 'chip-list';
      
      Object.keys(counts).sort().forEach(v => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.dataset.fkey = f.key;
        b.dataset.value = v;
        b.textContent = `${v} (${counts[v] || 0})`;
        if (prevState[f.key]?.values?.has(v)) b.classList.add('is-on');
        wrap.appendChild(b);
      });
      
      box.appendChild(wrap);

    } else if (f.type === 'enum-search') {
      const counts = {};
      records.forEach(r => {
        const v = getVal(r, f.field);
        if (!v || v === '—') return;
        counts[v] = (counts[v] || 0) + 1;
      });
      
      const options = Object.keys(counts).sort();
      const wrap = document.createElement('div');
      wrap.className = 'range';
      
      const inp = document.createElement('input');
      inp.type = 'search';
      inp.placeholder = 'Type to search…';
      inp.dataset.fkey = f.key;
      inp.setAttribute('list', `dl-${f.key}`);
      inp.value = prevState[f.key]?.q || '';
      
      const dl = document.createElement('datalist');
      dl.id = `dl-${f.key}`;
      options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        dl.appendChild(o);
      });
      
      wrap.appendChild(inp);
      wrap.appendChild(dl);
      box.appendChild(wrap);

    } else if (f.type === 'enum-multi' || f.type === 'century') {
      const counts = {};
      
      records.forEach(r => {
        const values = (f.type === 'century')
          ? getValsAll(r, 'Normalized century of production')
          : getValsAll(r, f.field);
        
        values.forEach(v => {
          if (!v || v === '—') return;
          counts[v] = (counts[v] || 0) + 1;
        });
      });
      
      const wrap = document.createElement('div');
      wrap.className = 'check-list';
      
      Object.keys(counts)
        .sort((a, b) => parseInt(a) - parseInt(b)) // OK for century
        .forEach(v => {
          const lab = document.createElement('label');
          lab.className = 'check-item';
          
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.dataset.fkey = f.key;
          cb.value = v;
          if (prevState[f.key]?.values?.has(v)) cb.checked = true;
          
          lab.appendChild(cb);
          lab.append(` ${v} (${counts[v] || 0})`);
          wrap.appendChild(lab);
        });
      
      box.appendChild(wrap);

    } else if (f.type === 'year-range' || f.type === 'num-range') {
      const vals = records.map(r => {
        if (f.type === 'year-range') return firstYear(getVal(r, f.field));
        const d = getDetail(r, f.field);
        const n = parseFloat(val(d));
        return isNaN(n) ? null : n;
      }).filter(v => v != null);
      
      const lo = vals.length ? Math.min(...vals) : '';
      const hi = vals.length ? Math.max(...vals) : '';
      
      const rng = document.createElement('div');
      rng.className = 'range';
      
      const min = document.createElement('input');
      min.type = 'number';
      min.step = '1';
      min.dataset.fkey = f.key;
      
      const max = document.createElement('input');
      max.type = 'number';
      max.step = '1';
      max.dataset.fkey = f.key;
      
      min.value = prevState[f.key]?.min ?? lo;
      max.value = prevState[f.key]?.max ?? hi;
      
      if (lo !== '') {
        min.min = lo;
        max.min = lo;
      }
      if (hi !== '') {
        min.max = hi;
        max.max = hi;
      }
      
      rng.appendChild(min);
      rng.append(' to ');
      rng.appendChild(max);
      box.appendChild(rng);
      
      const hint = document.createElement('small');
      hint.className = 'muted';
      hint.textContent = (f.type === 'year-range' ? 'Year range (YYYY)' : 'Numeric range');
      box.appendChild(hint);

    } else if (f.type === 'text' || f.type === 'resource') {
      const inp = document.createElement('input');
      inp.type = 'search';
      inp.placeholder = 'Type to filter…';
      inp.dataset.fkey = f.key;
      inp.value = prevState[f.key]?.q || '';
      box.appendChild(inp);
    }

    mount.appendChild(box);
  });
}

/**
 * Read current facet state from DOM
 * @param {Array} config - Facet configuration
 * @returns {Object} Current facet state
 */
export function readFacetState(config) {
  const st = {};
  
  config.forEach(f => {
    if (f.type === 'enum') {
      const onChips = [...document.querySelectorAll(`.chip[data-fkey="${f.key}"].is-on`)]
        .map(n => n.dataset.value);
      st[f.key] = { type: f.type, values: new Set(onChips) };
      
    } else if (f.type === 'enum-multi' || f.type === 'century') {
      const onCbs = [...document.querySelectorAll(`input[type="checkbox"][data-fkey="${f.key}"]:checked`)]
        .map(n => n.value);
      st[f.key] = { type: f.type, values: new Set(onCbs) };
      
    } else if (f.type === 'year-range' || f.type === 'num-range') {
      const [min, max] = [...document.querySelectorAll(`.range input[data-fkey="${f.key}"]`)]
        .map(i => i.value);
      st[f.key] = {
        type: f.type,
        min: min ? parseFloat(min) : null,
        max: max ? parseFloat(max) : null
      };
      
    } else if (f.type === 'text' || f.type === 'resource' || f.type === 'enum-search') {
      const input = document.querySelector(`input[data-fkey="${f.key}"]`);
      st[f.key] = {
        type: f.type,
        q: (input?.value || '').trim().toLowerCase()
      };
    }
  });
  
  return st;
}

/**
 * Apply facet filters to a list of records
 * @param {Array} list - Records to filter
 * @param {Array} config - Facet configuration
 * @returns {Array} Filtered records
 */
export function applyFacets(list, config) {
  const st = readFacetState(config);
  
  return list.filter(rec => {
    for (const f of config) {
      const s = st[f.key];
      if (!s) continue;
      
      if (f.type === 'enum') {
        const v = getVal(rec, f.field);
        if (s.values.size && !s.values.has(v)) return false;
        
      } else if (f.type === 'enum-multi' || f.type === 'century') {
        const values = (f.type === 'century')
          ? getValsAll(rec, 'Normalized century of production')
          : getValsAll(rec, f.field);
        
        // If there are selected values, the record must have at least one of them
        if (s.values.size && !values.some(v => s.values.has(v))) return false;
        
      } else if (f.type === 'year-range') {
        const y = firstYear(getVal(rec, f.field));
        if (s.min != null && y != null && y < s.min) return false;
        if (s.max != null && y != null && y > s.max) return false;
        
      } else if (f.type === 'num-range') {
        const d = getDetail(rec, f.field);
        const n = parseFloat(val(d));
        if (isNaN(n)) continue;
        if (s.min != null && n < s.min) return false;
        if (s.max != null && n > s.max) return false;
        
      } else if (f.type === 'text') {
        const q = s.q;
        if (q && (getVal(rec, f.field) || '').toLowerCase().indexOf(q) === -1) {
          return false;
        }
        
      } else if (f.type === 'resource' || f.type === 'enum-search') {
        const q = s.q;
        if (q) {
          const t = (getRes(rec, f.field)?.title || getVal(rec, f.field) || '').toLowerCase();
          if (!t.includes(q)) return false;
        }
      }
    }
    
    return true;
  });
}
