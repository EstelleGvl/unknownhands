/**
 * Browse Module
 * Handles facet building, filtering, searching, sorting, and results rendering
 */
window.ExploreBrowse = (function(){
  function init(Core) {
    const { 
      DATA, IDX, MAP, REL_INDEX, FACETS, INBOUND, REC_TYPE_TO_ENTITY,
      getVal, getValsAll, getRes, getDetail, val, rawValue, esc, firstYear,
      getRelationshipValues, debounce
    } = Core;

    let ENTITY = 'su';
    let page = 1;
    let pageSize = 24;
    let selectedCard = null;
    let ACTIVE_MODE = 'browse';

    // DOM references
    const $mount = document.getElementById('facet-mount');
    const $search = document.getElementById('db-search');
    const $field = document.getElementById('db-field');
    const $sort = document.getElementById('db-sort');
    const $results = document.getElementById('db-results');
    const $status = document.getElementById('db-status');
    const $pager = document.getElementById('db-pager');
    const $page = document.getElementById('db-page');
    const $prev = document.getElementById('db-prev');
    const $next = document.getElementById('db-next');
    const $pageJump = document.getElementById('db-page-jump');
    const $pageGo = document.getElementById('db-page-go');
    const $viz = document.getElementById('details-wrap');

    // ========== Facet Building ==========
    function buildFacets(records, config, prevState = {}) {
      if (!$mount) return;
      $mount.innerHTML = '';
      config.forEach(f=>{
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
          wrap.className = 'check-list';
          Object.keys(counts).sort().forEach(v => {
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
            const values = getValsAll(r, f.field);
            values.forEach(v => {
              if (!v || v === '—') return;
              counts[v] = (counts[v] || 0) + 1;
            });
          });
          const wrap = document.createElement('div');
          wrap.className = 'check-list';
          Object.keys(counts)
            .sort((a, b) => parseInt(a) - parseInt(b))
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

        } else if (f.type === 'relationship-enum-multi') {
          const counts = {};
          records.forEach(r => {
            const values = getRelationshipValues(r.rec_ID, f.field);
            values.forEach(v => {
              if (!v || v === '—') return;
              counts[v] = (counts[v] || 0) + 1;
            });
          });
          const wrap = document.createElement('div');
          wrap.className = 'check-list';
          Object.keys(counts)
            .sort()
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
          if (lo !== '') { min.min = lo; max.min = lo; }
          if (hi !== '') { min.max = hi; max.max = hi; }
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

        $mount.appendChild(box);
      });
    }

    // ========== Facet State Reading ==========
    function readFacetState(config) {
      const st = {};
      config.forEach(f => {
        if (f.type === 'enum') {
          const onCbs = [...document.querySelectorAll(`input[type="checkbox"][data-fkey="${f.key}"]:checked`)].map(n => n.value);
          st[f.key] = { type: f.type, values: new Set(onCbs) };
        } else if (f.type === 'enum-multi' || f.type === 'century' || f.type === 'relationship-enum-multi') {
          const onCbs = [...document.querySelectorAll(`input[type="checkbox"][data-fkey="${f.key}"]:checked`)].map(n => n.value);
          st[f.key] = { type: f.type, values: new Set(onCbs) };
        } else if (f.type === 'year-range' || f.type === 'num-range') {
          const [min, max] = [...document.querySelectorAll(`.range input[data-fkey="${f.key}"]`)].map(i => i.value);
          st[f.key] = { type: f.type, min: min ? parseFloat(min) : null, max: max ? parseFloat(max) : null };
        } else if (f.type === 'text' || f.type === 'resource' || f.type === 'enum-search') {
          const input = document.querySelector(`input[data-fkey="${f.key}"]`);
          st[f.key] = { type: f.type, q: (input?.value || '').trim().toLowerCase() };
        }
      });
      return st;
    }

    // ========== Facet Filtering ==========
    function applyFacets(list, config) {
      const st = readFacetState(config);
      return list.filter(rec => {
        for (const f of config) {
          const s = st[f.key];
          if (!s) continue;
          if (f.type === 'enum') {
            if (s.values.size) {
              const v = getVal(rec, f.field);
              if (!s.values.has(v)) return false;
            }
          } else if (f.type === 'enum-multi' || f.type === 'century') {
            const values = getValsAll(rec, f.field);
            if (s.values.size && !values.some(v => s.values.has(v))) return false;
          } else if (f.type === 'relationship-enum-multi') {
            const values = getRelationshipValues(rec.rec_ID, f.field);
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
            if (q && (getVal(rec, f.field) || '').toLowerCase().indexOf(q) === -1) return false;
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

    // ========== Search & Sort ==========
    function applySearch(list, map, q, field) {
      if (!q) return list;
      const s = q.toLowerCase();
      return list.filter(rec => {
        if (!field) return map.flat(rec).includes(s);
        if (field === 'title') return (map.title(rec) || '').toLowerCase().includes(s);
        if (field === 'date') return (map.date?.(rec) || '').toLowerCase().includes(s);
        if (field === 'manuscript') return ((map.manuscriptTitle?.(rec)) || '').toLowerCase().includes(s);
        if (field === 'holding') return ((map.holdingTitle?.(rec)) || '').toLowerCase().includes(s);
        if (field === 'place') return ((map.place?.(rec)) || '').toLowerCase().includes(s) ||
                                  [getVal(rec, 'Country'), getVal(rec, 'City')].join(' ').toLowerCase().includes(s);
        if (field === 'comments') return (getVal(rec, 'Scribe Comments') + ' ' + getVal(rec, 'Text(s) comments') + ' ' + getVal(rec, 'PU Comments') + ' ' + getVal(rec, 'Identification comments')).toLowerCase().includes(s);
        return map.flat(rec).includes(s);
      });
    }

    const sorters = map => ({
      title_asc: (a, b) => (map.title(a) || '').localeCompare(map.title(b) || ''),
      title_desc: (a, b) => (map.title(b) || '').localeCompare(map.title(a) || ''),
      date_asc: (a, b) => (map.date?.(a) || '').localeCompare(map.date?.(b) || ''),
      date_desc: (a, b) => (map.date?.(b) || '').localeCompare(map.date?.(a) || ''),
    });

    // ========== Navigation Helpers ==========
    function indexOfRecord(list, id) {
      const sId = String(id);
      for (let i = 0; i < list.length; i++) {
        if (String(list[i].rec_ID) === sId) return i;
      }
      return -1;
    }

    // ========== Results Rendering ==========
    function render(list, type, selectId = null) {
      if (!$results) return;
      const map = MAP[type];
      if (!map) return;
      
      const sort = $sort?.value;
      if (sort && sorters(map)[sort]) list = [...list].sort(sorters(map)[sort]);

      const total = list.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      if (selectId) {
        const idx = indexOfRecord(list, selectId);
        if (idx >= 0) page = Math.floor(idx / pageSize) + 1;
      }
      page = Math.min(Math.max(1, page), totalPages);

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageItems = list.slice(start, end);

      const frag = document.createDocumentFragment();
      pageItems.forEach(rec => {
        const card = document.createElement('article');
        card.className = 'db-card';

        const body = document.createElement('div');
        body.className = 'db-body';
        const h = document.createElement('div');
        h.className = 'db-title';
        h.textContent = (map.title || (() => ''))(rec) || 'Untitled';
        body.appendChild(h);

        const meta = document.createElement('div');
        meta.className = 'db-meta';
        if (type === 'su') {
          const yr = map.date(rec) || '';
          const msT = map.manuscriptTitle(rec);
          const msId = map.manuscriptId(rec);
          if (yr) {
            const yd = document.createElement('span');
            yd.className = 'yeardash';
            yd.textContent = `${yr} —`;
            meta.appendChild(yd);
          }
          if (msT) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'linklike';
            btn.textContent = msT;
            if (msId) btn.dataset.jump = `ms:${String(msId)}`;
            btn.addEventListener('click', ev => {
              ev.stopPropagation();
              window.jumpTo('ms', String(msId));
            });
            meta.appendChild(btn);
          }
        } else if (type === 'ms') {
          meta.textContent = [map.date(rec)].filter(Boolean).join(' — ');
        } else if (type === 'pu') {
          const yr = map.date(rec) || '';
          const msT = map.manuscriptTitle(rec);
          const msId = map.manuscriptId(rec);
          if (yr) {
            const y = document.createElement('span');
            y.className = 'yeardash';
            y.textContent = `${yr} —`;
            meta.appendChild(y);
          }
          if (map.place(rec)) {
            const pl = document.createElement('span');
            pl.textContent = map.place(rec);
            meta.appendChild(pl);
          }
          if (msT) {
            const sep = document.createElement('span');
            sep.className = 'sep';
            sep.textContent = '—';
            meta.appendChild(sep);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'linklike';
            btn.textContent = msT;
            if (msId) btn.dataset.jump = `ms:${String(msId)}`;
            btn.addEventListener('click', ev => {
              ev.stopPropagation();
              window.jumpTo('ms', String(msId));
            });
            meta.appendChild(btn);
          }
        } else if (type === 'hi') {
          meta.textContent = [MAP.hi.country(rec), MAP.hi.city(rec), MAP.hi.itype(rec)].filter(Boolean).join(' — ');
        } else if (type === 'mi') {
          meta.textContent = [MAP.mi.dates(rec), MAP.mi.city(rec), MAP.mi.country(rec)].filter(Boolean).join(' — ');
        } else if (type === 'hp') {
          meta.textContent = [MAP.hp.ptype(rec), MAP.hp.gender(rec), MAP.hp.viaf(rec) ? '(VIAF)' : '', MAP.hp.wikidata(rec) ? '(Wikidata)' : ''].filter(Boolean).join(' — ');
        } else if (type === 'tx') {
          meta.textContent = [MAP.tx.genre(rec)].filter(Boolean).join(' — ');
        }

        body.appendChild(meta);
        card.appendChild(body);

        card.addEventListener('click', () => {
          if (selectedCard) selectedCard.classList.remove('is-selected');
          card.classList.add('is-selected');
          selectedCard = card;
          Core.showDetails(rec, type);
        });

        if (selectId && String(rec.rec_ID) === String(selectId)) card.dataset.autoselect = '1';
        frag.appendChild(card);
      });

      $results.innerHTML = '';
      $results.appendChild(frag);

      if ($status) $status.textContent = `${total} result${total === 1 ? '' : 's'}`;
      if ($pager) $pager.hidden = total <= pageSize;
      if ($page) $page.textContent = `Page ${page} / ${totalPages}`;
      if ($prev) $prev.disabled = (page <= 1);
      if ($next) $next.disabled = (page >= totalPages);

      if ($pageJump) {
        $pageJump.max = totalPages;
        $pageJump.value = page;
      }

      const toSelect = $results.querySelector('.db-card[data-autoselect="1"]') || $results.querySelector('.db-card');
      if (toSelect) {
        toSelect.click();
        toSelect.scrollIntoView({ block: 'nearest' });
      } else {
        Core.showDetails(null, type);
        selectedCard = null;
      }
    }

    // ========== Computation & Re-rendering ==========
    function computeList() {
      const cfg = FACETS[ENTITY];
      const map = MAP[ENTITY];
      let list = DATA[ENTITY] || [];
      list = applyFacets(list, cfg);
      list = applySearch(list, map, $search?.value.trim() || '', $field?.value || '');
      return list;
    }

    function renderCurrent() {
      const list = computeList();
      render(list, ENTITY);
    }

    function recompute(clearFacets = false) {
      const cfg = FACETS[ENTITY];
      if (clearFacets) {
        if ($mount) $mount.innerHTML = '';
      }
      const prevState = clearFacets ? {} : readFacetState(cfg);
      const fullList = DATA[ENTITY] || [];
      const filteredList = computeList();
      buildFacets(fullList, cfg, prevState);
      render(filteredList, ENTITY);
    }

    // ========== Public API ==========
    return {
      buildFacets,
      readFacetState,
      applyFacets,
      applySearch,
      sorters,
      render,
      computeList,
      renderCurrent,
      recompute,
      indexOfRecord,
      getEntity: () => ENTITY,
      setEntity: (e) => { ENTITY = e; },
      getPage: () => page,
      setPage: (p) => { page = p; },
      getPageSize: () => pageSize,
      setPageSize: (ps) => { pageSize = ps; }
    };
  }

  return { init };
})();
