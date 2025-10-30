---
layout: page
permalink: /explore-database/
show_title: false
---

<div class="explore-fullwidth">
  <h1 class="mb-3" style="text-align:center;">Explore the Database</h1>

  <div class="db-shell">
    <!-- FACETS (left) -->
    <aside class="db-facets" aria-label="Filters">
      <div class="facet">
        <div class="facet-title">Record type</div>
        <div class="chip-list" id="entity-switch">
          <button class="chip is-on" data-entity="su">Scribal Units</button>
          <button class="chip" data-entity="ms">Manuscripts</button>
          <button class="chip" data-entity="pu">Production Units</button>
          <button class="chip" data-entity="hi">Holding Institutions</button>
          <button class="chip" data-entity="mi">Monastic Institutions</button>
          <button class="chip" data-entity="hp">Historical People</button>
          <button class="chip" data-entity="tx">Texts</button>
        </div>
      </div>

      <div id="facet-mount"></div>

      <div class="facet" id="facet-histo" hidden>
        <div class="facet-title">Dates (quick filter)</div>
        <div id="db-histo" class="histo" title="Hover bars for the exact bucket. Click to toggle the bucket."></div>
        <div class="histo-caption muted" id="histo-caption"></div>
        <small class="muted">Click a bar to filter; click again to clear.</small>
      </div>
    </aside>

    <!-- MAIN (right) -->
    <section class="db-main">
      <!-- Controls -->
      <div class="db-controls">
        <input id="db-search" type="search" placeholder="Search…" aria-label="Search records" />
        <select id="db-field" aria-label="Search field">
          <option value="">All fields</option>
          <option value="title">Title</option>
          <option value="date">Date / Dating</option>
          <option value="manuscript">Manuscript</option>
          <option value="holding">Holding Institution</option>
          <option value="place">Place (country / city)</option>
          <option value="comments">Comments</option>
        </select>
        <select id="db-sort" aria-label="Sort">
          <option value="">Sort: Default</option>
          <option value="title_asc">Title A→Z</option>
          <option value="title_desc">Title Z→A</option>
          <option value="date_asc">Date ↑</option>
          <option value="date_desc">Date ↓</option>
        </select>
        <button id="btn-clear" class="chip" type="button">Clear all filters</button>
        <button id="btn-export" class="chip" type="button">Export CSV</button>
      </div>

      <!-- View tabs -->
      <div class="view-tabs" id="view-tabs" aria-label="Views">
        <button class="chip is-on" data-view="results">Results</button>
        <button class="chip" data-view="map" hidden>Map</button>
        <button class="chip" data-view="timeline" hidden>Timeline</button>
        <button class="chip" id="btn-switch" type="button">Switch views</button>
      </div>

      <div class="db-right">
        <!-- Map pane (title + body) -->
        <div id="pane-map" class="viz-card" aria-hidden="true">
          <div class="viz-head" id="map-title">Map</div>
          <div class="viz-body">
            <div id="map-mount"></div>
          </div>
        </div>

        <!-- Timeline pane (title + body) -->
        <div id="pane-timeline" class="viz-card" aria-hidden="true">
          <div class="viz-head" id="timeline-title">Timeline</div>
          <div class="viz-body">
            <div id="timeline-mount"></div>
          </div>
        </div>

        <!-- Results list -->
        <div id="pane-results" class="db-results-wrap">
          <div id="db-status" class="db-status" role="status" aria-live="polite"></div>
          <div id="db-results" class="db-grid"></div>
          <div id="db-pager" class="db-pager" hidden>
            <button id="db-prev" disabled>Previous</button>
            <span id="db-page">Page 1 / 1</span>
            <button id="db-next" disabled>Next</button>
          </div>
        </div>

        <!-- Details -->
        <aside id="db-viz" class="db-viz" aria-label="Details">
          <h3 class="db-viz-title">Details</h3>
          <div class="db-viz-body muted">Click a result to see its full details here.</div>
        </aside>
      </div>
    </section>
  </div>
</div>

<!-- CSV dialog -->
<dialog id="csv-dialog" style="max-width:680px;border:1px solid #ddd;border-radius:.75rem;padding:1rem;">
  <form method="dialog">
    <h3 style="margin:.25rem 0 .75rem;">Export CSV</h3>
    <p class="muted" style="margin-top:-.25rem">Pick the columns to include.</p>
    <div id="csv-fields" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.4rem 1rem;margin:.5rem 0 1rem;"></div>
    <label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.75rem;">
      <input type="checkbox" id="csv-include-header" checked> Include header row
    </label>
    <div style="display:flex;gap:.5rem;justify-content:flex-end;">
      <button type="button" id="csv-all"  class="chip">Select all</button>
      <button type="button" id="csv-none" class="chip">Select none</button>
      <button type="submit" id="csv-export-go" class="chip" style="background:#fff;">Export</button>
      <button type="button" class="chip" onclick="this.closest('dialog').close()">Close</button>
    </div>
  </form>
</dialog>

<style>
  :root { --uh-gold: #a67c00; }

  .explore-fullwidth{width:100vw;max-width:100vw;margin-left:50%;transform:translateX(-50%);padding:0 8vw;}
  .db-shell{display:grid;grid-template-columns: 300px minmax(0,1fr);gap:2rem;max-width:95vw;margin:0 auto;}
  .db-right{
    display:grid;
    grid-template-columns: 420px minmax(520px, 1fr);
    gap:2rem;
    align-items:start;
  }
  @media (max-width:1200px){ .db-right{ grid-template-columns: 1fr } }

  .db-card{min-height:88px;}
  .view-tabs{display:flex;gap:.5rem;align-items:center;margin:.25rem 0 .75rem;}
  .view-tabs .chip{padding:.4rem .75rem;}
  .view-tabs .chip.is-on{background:#e9f3ff;border-color:#b3d6ff;}

  .db-facets{border:1px solid #eee;border-radius:.75rem;padding:1rem;background:#fff;}
  .facet{margin-bottom:1rem;}
  .facet-title{font-weight:600;margin-bottom:.35rem;}
  .chip-list{display:flex;flex-wrap:wrap;gap:.5rem;}
  .chip{border:1px solid #ddd;border-radius:999px;padding:.25rem .6rem;cursor:pointer;user-select:none;background:#fafafa;}
  .chip.is-on{background:#e9f3ff;border-color:#b3d6ff;}
  .muted{color:#666;}

  .check-list{display:flex;flex-wrap:wrap;gap:.4rem 1rem;max-height:220px;overflow:auto;}
  .check-item{display:flex;align-items:center;gap:.35rem;}
  .range{display:flex;align-items:center;gap:.5rem;}
  .range input{width:6.5rem;padding:.35rem .5rem;border:1px solid #ddd;border-radius:.5rem;}

  .db-controls{display:flex;gap:.5rem .75rem;align-items:center;margin:.5rem 0 1rem;flex-wrap:wrap;}
  .db-controls input{flex:1;min-width:220px;padding:.5rem .75rem;border:1px solid #ddd;border-radius:.5rem;}
  .db-controls select,.db-pager button,.db-controls .chip{padding:.5rem .75rem;border:1px solid #ddd;border-radius:.5rem;background:#fff;cursor:pointer;}
  .db-status{font-size:.95rem;color:#555;margin-bottom:.5rem;}

  .db-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem;}
  .db-card{border:1px solid #eee;border-radius:.75rem;overflow:hidden;background:#fff;display:flex;flex-direction:column;cursor:pointer;}
  .db-body{padding:.6rem .8rem;display:flex;flex-direction:column;gap:.35rem;}
  .db-title{font-weight:600;line-height:1.25;}
  .db-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:.35rem;font-size:.9rem;color:#666;}
  .db-meta .yeardash { white-space: nowrap; }
  .db-meta .sep{ opacity:.6; }
  .db-card.is-selected{outline:2px solid #cda85c; outline-offset:2px;}

  .db-viz{border:1px solid #eee;border-radius:.75rem;background:#fff;padding:1rem;min-height:200px;}
  .db-viz-title{margin:.1rem 0 .6rem;}
  .section{margin-bottom:.75rem;}
  .kv{display:grid;grid-template-columns:auto 1fr;gap:.4rem .75rem;}
  .kv dt{font-weight:600;}
  .kv dd{margin:0;}

  .db-main a, .db-results-wrap a, .db-viz a{ color: var(--uh-gold); font-weight:700; text-decoration:none; }
  .db-main a:hover, .db-results-wrap a:hover, .db-viz a:hover{ text-decoration:underline; }
  .linklike{ appearance:none;background:transparent;border:none;padding:0;margin:0;color:var(--uh-gold);
    font-weight:700;text-decoration:none;cursor:pointer;line-height:inherit;font:inherit;border-radius:0; }
  .linklike:hover{ text-decoration: underline; }
  .linklike:focus{ outline:none; box-shadow:none; }

  .histo{display:flex;gap:.25rem;align-items:flex-end;height:78px;padding:.5rem .25rem;border:1px solid #eee;border-radius:.5rem;background:#fff;overflow:hidden;}
  .hbar{flex:1;min-width:6px;background:#e6ecf5;position:relative;border-radius:3px;cursor:pointer;}
  .hbar.is-on{background:#c7d7f0;}
  .histo-caption{font-size:.85rem;margin:.25rem 0 0;min-height:1em;}

  /* Viz mode: map/timeline occupy the full right rail */
  .db-right.viz-mode{ grid-template-columns: 1fr; }
  .db-right.viz-mode #db-viz,
  .db-right.viz-mode .db-results-wrap{ display:none; }

  .viz-card{ background:#fff;border:1px solid #eee;border-radius:.75rem;padding:0;overflow:hidden;display:none; }
  .viz-card.is-on{ display:block; }
  .viz-head{ padding:.6rem .9rem;border-bottom:1px solid #eee;font-weight:600; }
  .viz-body{ padding:.5rem .75rem; }
  #map-mount{ width:100%; height: 62vh; }
  #timeline-mount{ width:100%; height: 62vh; overflow:auto; }

  /* Keep the Details panel fixed while scrolling through results */
  #db-viz {
    position: sticky;
    top: 1rem;            /* distance from top of viewport */
    align-self: start;    /* important inside CSS grid */
    max-height: calc(100vh - 2rem);
    overflow-y: auto;     /* allows internal scrolling if too tall */
    scrollbar-gutter: stable;
  }

  
</style>

<script>
/* ============================================================
   Unknown Hands — Explore page (unified, stable)
   ============================================================ */
(function(){
/* ---------- Endpoints ---------- */
const SU_ENDPOINT = "{{ site.heurist.su_json | default: '/data/scribal_units.json' | relative_url }}";
const MS_ENDPOINT = "{{ site.heurist.ms_json | default: '/data/manuscripts.json'   | relative_url }}";
const PU_ENDPOINT = "{{ site.heurist.pu_json | default: '/data/production_units.json' | relative_url }}";
const HI_ENDPOINT = "{{ site.heurist.holding_json | default: '/data/holding_institutions.json' | relative_url }}";
const MI_ENDPOINT = "{{ site.heurist.monastic_json | default: '/data/monastic_institutions.json' | relative_url }}";
const HP_ENDPOINT = "{{ site.heurist.people_json | default: '/data/historical_people.json' | relative_url }}";
const TX_ENDPOINT = "{{ site.heurist.texts_json | default: '/data/texts.json' | relative_url }}";
const BASE = "{{ site.baseurl | default: '' }}";

/* ---------- DOM ---------- */
const $mount   = document.getElementById('facet-mount');
const $results = document.getElementById('db-results');
const $status  = document.getElementById('db-status');
const $pager   = document.getElementById('db-pager');
const $prev    = document.getElementById('db-prev');
const $next    = document.getElementById('db-next');
const $page    = document.getElementById('db-page');
const $search  = document.getElementById('db-search');
const $field   = document.getElementById('db-field');
const $sort    = document.getElementById('db-sort');
const $viz     = document.getElementById('db-viz');
const $btnClear  = document.getElementById('btn-clear');
const $btnExport = document.getElementById('btn-export');

const $right = document.querySelector('.db-right');
const $tabs = {
  wrap: document.getElementById('view-tabs'),
  results: document.querySelector('[data-view="results"]'),
  map: document.querySelector('[data-view="map"]'),
  timeline: document.querySelector('[data-view="timeline"]'),
  switchBtn: document.getElementById('btn-switch')
};
const $panes = {
  map: document.getElementById('pane-map'),
  timeline: document.getElementById('pane-timeline'),
  results: document.getElementById('pane-results')
};
const $mapTitle = document.getElementById('map-title');
const $tlTitle  = document.getElementById('timeline-title');

/* ---------- Utils ---------- */
const getDetail = (rec, name) => (rec?.details||[]).find(d=>d.fieldName===name);
const rawValue  = d => (d?.value ?? '');
const val = d => { if (!d) return ''; if (d.termLabel) return d.termLabel; if (d.value && typeof d.value==='object' && d.value.title) return d.value.title; return d.value || ''; };
const getVal = (rec, field) => val(getDetail(rec, field));
const getRes = (rec, field) => { const d=getDetail(rec,field); return d&&d.value&&d.value.id? d.value : null; };
const esc = s => (s??'').toString().replace(/[&<>"]/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const flat = rec => { const bits=[rec.rec_Title||'']; (rec.details||[]).forEach(d=>{ if (d.termLabel) bits.push(d.termLabel); if (typeof d.value==='string') bits.push(d.value); if (d.value && typeof d.value==='object' && d.value.title) bits.push(d.value.title); }); return bits.join(' ').toLowerCase(); };
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
// All details for a field name
const getDetailsAll = (rec, name) => (rec?.details || []).filter(d => d.fieldName === name);

// Convert a detail to displayable string (you already have val(d))
const detailToString = d => val(d);

// All values (strings) for a field, flattening multi-valued terms
const getValsAll = (rec, field) =>
  getDetailsAll(rec, field).map(detailToString).filter(Boolean);


/* ---------- Data loading ---------- */
const EXPECT_TYPE = { su:119, ms:118, pu:116, hi:113, mi:115, hp:114, tx:107 };
async function fetchHeuristRecords(url, expectType){
  const r = await fetch(url, {credentials:'omit'});
  if (!r.ok) return [];
  const j = await r.json();
  const recs = (j && j.heurist && Array.isArray(j.heurist.records)) ? j.heurist.records : [];
  return recs.filter(rec=>{
    const vis = (rec.rec_NonOwnerVisibility||'').toLowerCase();
    if (vis==='private') return false;
    if (!rec.rec_ID) return false;
    if (expectType && String(rec.rec_RecTypeID)!==String(expectType)) return false;
    return true;
  });
}
function dedupeById(arr){ const seen=new Set(); const out=[]; for (const r of (arr||[])){ const k=String(r.rec_ID||''); if (!k||seen.has(k)) continue; seen.add(k); out.push(r);} return out; }

let DATA = { su:[], ms:[], pu:[], hi:[], mi:[], hp:[], tx:[] };
let IDX  = { su:{}, ms:{}, pu:{}, hi:{}, mi:{}, hp:{}, tx:{} };
function indexAll(){ for (const k of Object.keys(DATA)){ IDX[k]={}; DATA[k].forEach(r=>{ IDX[k][String(r.rec_ID)] = r; }); } }
const FIXED = { '107':'tx','113':'hi','114':'hp','115':'mi','116':'pu','118':'ms','119':'su' };
let REC_TYPE_TO_ENTITY = { ...FIXED };
function buildTypeMap(){ REC_TYPE_TO_ENTITY = { ...FIXED }; Object.entries(DATA).forEach(([ekey,arr])=>{ arr.forEach(r=>{ if (r.rec_RecTypeID) REC_TYPE_TO_ENTITY[String(r.rec_RecTypeID)] = ekey; }); }); }

/* ---------- Reverse pointer index ---------- */
let INBOUND = { su:{}, ms:{}, pu:{}, hi:{}, mi:{}, hp:{}, tx:{} };
function resetInbound(){ INBOUND = { su:{}, ms:{}, pu:{}, hi:{}, mi:{}, hp:{}, tx:{} }; }
function indexPointers(){
  resetInbound();
  const all = Object.entries(DATA).flatMap(([t,arr])=>arr.map(r=>[t,r]));
  for (const [fromType, rec] of all){
    (rec.details||[]).forEach(d=>{
      const v = d?.value; if (v && typeof v==='object' && v.id && v.type){
        const toType = REC_TYPE_TO_ENTITY[String(v.type)] || null; if (!toType) return;
        const toId = String(v.id);
        (INBOUND[toType][toId]||(INBOUND[toType][toId]=[])).push({ fromType, fromId:String(rec.rec_ID), fromTitle:rec.rec_Title||'', fieldName:d.fieldName||'' });
      }
    });
  }
}

/* ---------- Facets config ---------- */
const FACETS = {
  su: [
    { key:'su_dating', label:'SU dating', type:'text', field:'SU dating' },
    { key:'century', label:'Normalized century of production', type:'century', field:'Normalized century of production' },
    { key:'post', label:'Terminus post quem', type:'year-range', field:'Normalized terminus post quem' },
    { key:'ante', label:'Terminus ante quem', type:'year-range', field:'Normalized terminus ante quem' },
    { key:'script', label:'Normalized script(s)', type:'enum-multi', field:'Normalised script(s)' },
    { key:'colophon_presence', label:'Colophon presence', type:'enum', field:'Colophon presence' },
    { key:'colophon_language', label:'Colophon language', type:'enum-multi', field:'Colophon language' },
    { key:'manuscript', label:'Manuscript', type:'resource', field:'Manuscript' },
    { key:'scribe_comments', label:'Scribe Comments', type:'text', field:'Scribe Comments' },
    { key:'text_comments', label:'Text(s) comments', type:'text', field:'Text(s) comments' },
    { key:'pu_comments', label:'PU Comments', type:'text', field:'PU Comments' },
  ],
  ms: [
    { key:'holding', label:'Holding Institution', type:'resource', field:'Holding Institution' },
    { key:'callno', label:'Call number', type:'text', field:'Call number' },
    { key:'ms_date', label:'Ms Dating (YYYY ok)', type:'year-range', field:'Ms Dating' },
    { key:'digit_status', label:'Digitization Status', type:'enum', field:'Digitization Status' },
    { key:'digit_type',   label:'Digitization Type', type:'enum', field:'Digitization Type' },
    { key:'iiif_status',  label:'IIIF Status', type:'enum', field:'IIIF Status' },
    { key:'folios', label:'Number of folios', type:'num-range', field:'Number of folios' },
    { key:'h', label:'Codex height', type:'num-range', field:'Codex height' },
    { key:'w', label:'Codex width',  type:'num-range', field:'Codex width' },
  ],
  pu: [
    { key:'country', label:'Country', type:'enum-search', field:'PU country' },
    { key:'city',    label:'City',    type:'enum-search', field:'PU City' },
    { key:'material',label:'Material',type:'enum', field:'Material' },
    { key:'century', label:'Century', type:'century', field:'Normalized century of production' },
    { key:'post',    label:'Post quem', type:'year-range', field:'Normalized terminus post quem' },
    { key:'ante',    label:'Ante quem', type:'year-range', field:'Normalized terminus ante quem' },
    { key:'colophon_presence', label:'Colophon presence', type:'enum-search', field:'Colophon presence' },
    { key:'colophon_language', label:'Colophon language', type:'enum-multi', field:'Colophon language' },
    { key:'Watermark', label:'Watermark Present', type:'enum-search', field:'Watermark Present' },
    { key:'manuscript', label:'Manuscript', type:'resource', field:'Manuscript' },
    { key:'folios', label:'Folios', type:'num-range', field:'Number of Folios' },
    { key:'text_h', label:'Text block height', type:'num-range', field:'Text block height' },
    { key:'text_w', label:'Text block width',  type:'num-range', field:'Text block width' },
    { key:'ruling', label:'Ruling',  type:'enum', field:'Ruling' },
    { key:'catchwords', label:'Ruling',  type:'enum-search', field:'catchwords' },
    { key:'signatures', label:'Ruling',  type:'enum-search', field:'signatures' },
    { key:'Quire types', label:'Quires',  type:'enum-multi', field:'Quire types' },
  ],
  hi: [
    { key:'country', label:'Country', type:'enum-search', field:'Country' },
    { key:'city',    label:'City',    type:'enum-search', field:'City' },
    { key:'itype',   label:'Institution type', type:'enum', field:'Institution type' },
  ],
  mi: [
    { key:'country', label:'Country', type:'enum-search', field:'Country' },
    { key:'city',    label:'City',    type:'enum-search', field:'City' },
    { key:'order',   label:'Religious order', type:'enum-search', field:'Religious order' },
    { key:'mtype',   label:'Type of monastery', type:'enum', field:'Type of monastery' },
    { key:'created', label:'Creation year', type:'year-range', field:'Creation date' },
    { key:'supp',    label:'Suppression year', type:'year-range', field:'Suppression date' },
  ],
  hp: [
    { key:'gender',  label:'Gender', type:'enum', field:'Gender' },
    { key:'gcert',   label:'Gender certainty', type:'enum', field:'Gender certainty' },
    { key:'ptype',   label:'Person type', type:'enum', field:'Person type' },
     { key:'activity',   label:'Century of Activity', type:'century', field:'Century of Activity' },
  ],
  tx: [
    { key:'genre',   label:'Genre', type:'enum', field:'Genre' },
    { key:'subgenre',label:'Subgenre', type:'enum-search', field:'Subgenre' },
    { key:'ntitle',  label:'Normalized Title', type:'enum-search', field:'Normalized Title' },
    { key:'author',  label:'Author', type:'enum-search', field:'Creator' },
  ],
};

/* ---------- Year helpers ---------- */
function firstYear(s){ if (!s) return null; const m=String(s).match(/(^|[^0-9])([0-9]{3,4})(?![0-9])/); if(!m) return null; const y=parseInt(m[2],10); if(isNaN(y)||y<1||y>2100) return null; return y; }
function rangeYears(s){ if (!s) return null; const m=String(s).match(/([0-9]{3,4}).*?([0-9]{3,4})/); if(!m) return null; const a=parseInt(m[1],10),b=parseInt(m[2],10); if([a,b].some(x=>isNaN(x)||x<1||x>2100)) return null; return [a,b]; }
function formatYear(input){ const r=rangeYears(input); if(r) return r[0]===r[1]?String(r[0]):`${r[0]}–${r[1]}`; const y=firstYear(input); return y?String(y):''; }
function joinYearRange(pq, aq){ const y1=firstYear(pq), y2=firstYear(aq); if (y1&&y2) return y1===y2?String(y1):`${y1}–${y2}`; return (y1||y2)?String(y1||y2):''; }

/* ---------- Mapping (titles/dates) ---------- */
const MAP = {
  su: {
    title: r => r.rec_Title || ('Record '+r.rec_ID),
    date:  r => joinYearRange(getVal(r,'Normalized terminus post quem'), getVal(r,'Normalized terminus ante quem')) || formatYear(getVal(r,'SU dating')),
    manuscriptTitle: r => (getRes(r,'Manuscript')?.title) || '',
    manuscriptId:    r => (getRes(r,'Manuscript')?.id) || '',
    flat,
  },
  ms: {
    title: r => r.rec_Title || ('Manuscript '+r.rec_ID),
    date:  r => formatYear(getVal(r,'Ms Dating')),
    callno: r => getVal(r,'Call number') || '',
    holdingTitle: r => (getRes(r,'Holding Institution')?.title)||'',
    holdingId:    r => (getRes(r,'Holding Institution')?.id)||'',
    iiifManifest: r => {
      const d = (r.details||[]).find(x => (x.fieldName||'').toLowerCase().includes('manifest'));
      return d ? (typeof d.value==='string' ? d.value : (d.value?.url || '')) : '';
    },
    flat,
  },
  pu: {
    title: r => r.rec_Title || ('Production Unit '+r.rec_ID),
    date:  r => joinYearRange(getVal(r,'Normalized terminus post quem'), getVal(r,'Normalized terminus ante quem')) || formatYear(getVal(r,'PU dating')),
    place: r => [getVal(r,'PU country'), getVal(r,'PU City')].filter(Boolean).join(', '),
    manuscriptTitle: r => (getRes(r,'Manuscript')?.title) || '',
    manuscriptId:    r => (getRes(r,'Manuscript')?.id) || '',
    flat,
  },
  hi: { title: r => r.rec_Title || ('Holding '+r.rec_ID), country: r => getVal(r,'Country'), city: r => getVal(r,'City'), itype: r => getVal(r,'Institution type'), flat },
  mi: { title: r => r.rec_Title || ('Monastic '+r.rec_ID), dates: r => joinYearRange(getDetail(r,'Creation date')?.value, getDetail(r,'Suppression date')?.value), order: r => getVal(r,'Religious order'), city: r => getVal(r,'City'), country: r => getVal(r,'Country'), flat },
  hp: { title: r => r.rec_Title || ('Person '+r.rec_ID), gender: r => getVal(r,'Gender'), gcert:  r => getVal(r,'Gender certainty'), ptype:  r => getVal(r,'Person type'), flat },
  tx: { title: r => r.rec_Title || ('Text '+r.rec_ID), ntitle: r => getVal(r,'Normalized Title'), genre:  r => getVal(r,'Genre'), sub:    r => getVal(r,'Subgenre'), flat },
};

/* ---------- Histogram ---------- */
let histoBucket=null;
function buildHistogram(list){
  const wrap = document.getElementById('facet-histo');
  const $h = document.getElementById('db-histo');
  const $cap = document.getElementById('histo-caption');
  $h.innerHTML=''; $cap.textContent='';

  const years = list.map(r=>{
    if (ENTITY==='su') return firstYear(getVal(r,'Normalized terminus post quem')) || firstYear(getVal(r,'SU dating'));
    if (ENTITY==='ms') return firstYear(getVal(r,'Ms Dating'));
    if (ENTITY==='pu') return firstYear(getVal(r,'PU dating')) || firstYear(getVal(r,'Normalized terminus post quem'));
    if (ENTITY==='mi') return firstYear(getDetail(r,'Creation date')?.value);
    return null;
  }).filter(v=>typeof v==='number' && !isNaN(v));

  if (!years.length){ wrap.hidden = true; return; }
  wrap.hidden = false;

  const min = Math.min(...years), max = Math.max(...years);
  $cap.textContent = `Overall range: ${min}–${max}`;

  const buckets = Math.max(5, Math.min(12, Math.ceil(Math.sqrt(years.length))));
  const size = Math.max(1, Math.ceil((max - min + 1)/buckets));
  const counts = new Array(buckets).fill(0);
  years.forEach(y=>{ const idx = Math.min(buckets-1, Math.floor((y - min)/size)); counts[idx] += 1; });
  const peak = Math.max(...counts) || 1;

  counts.forEach((c,i)=>{
    const b = document.createElement('div');
    b.className = 'hbar' + (histoBucket===i?' is-on':'');
    b.style.height = (4 + (c/peak)*70) + 'px';
    const lo = min + i*size;
    const hi = Math.min(max, lo + size - 1);
    b.title = `${lo}–${hi}: ${c}`;
    b.addEventListener('click', ()=>{
      histoBucket = (histoBucket===i) ? null : i;
      page = 1;
      renderCurrent();
      updateAvailableViews();
    });
    $h.appendChild(b);
  });
}
function passesHistogram(rec){
  if (histoBucket==null) return true;
  const $h = document.getElementById('db-histo');
  const bars = [...$h.children];
  const b = bars[histoBucket]; if (!b) return true;
  const [lo, hi] = b.title.split(':')[0].split('–').map(s=>parseInt(s,10));
  let y=null;
  if (ENTITY==='su') y = firstYear(getVal(rec,'Normalized terminus post quem')) || firstYear(getVal(rec,'SU dating'));
  else if (ENTITY==='ms') y = firstYear(getVal(rec,'Ms Dating'));
  else if (ENTITY==='pu') y = firstYear(getVal(rec,'PU dating')) || firstYear(getVal(rec,'Normalized terminus post quem'));
  else if (ENTITY==='mi') y = firstYear(getDetail(rec,'Creation date')?.value);
  return (y!=null && y>=lo && y<=hi);
}

/* ---------- Facets UI ---------- */
function buildFacets(records, config, prevState = {}) {
  $mount.innerHTML = '';
  config.forEach(f=>{
    const box=document.createElement('div'); box.className='facet';
    const title=document.createElement('div'); title.className='facet-title'; title.textContent=f.label;
    box.appendChild(title);

    if (f.type==='enum') {
      const counts={}; records.forEach(r=>{ const v=getVal(r,f.field); if (!v||v==='—') return; counts[v]=(counts[v]||0)+1; });
      const wrap=document.createElement('div'); wrap.className='chip-list';
      Object.keys(counts).sort().forEach(v=>{
        const b=document.createElement('button'); b.type='button'; b.className='chip';
        b.dataset.fkey=f.key; b.dataset.value=v;
        b.textContent = `${v} (${counts[v]||0})`;
        if (prevState[f.key]?.values?.has(v)) b.classList.add('is-on');
        wrap.appendChild(b);
      });
      box.appendChild(wrap);

    } else if (f.type==='enum-search') {
      const counts = {}; records.forEach(r=>{ const v=getVal(r,f.field); if(!v||v==='—') return; counts[v]=(counts[v]||0)+1; });
      const options = Object.keys(counts).sort();
      const wrap = document.createElement('div'); wrap.className = 'range';
      const inp = document.createElement('input'); inp.type='search'; inp.placeholder='Type to search…'; inp.dataset.fkey=f.key;
      inp.setAttribute('list', `dl-${f.key}`); inp.value = prevState[f.key]?.q || '';
      const dl = document.createElement('datalist'); dl.id=`dl-${f.key}`; options.forEach(opt=>{ const o=document.createElement('option'); o.value=opt; dl.appendChild(o); });
      wrap.appendChild(inp); wrap.appendChild(dl); box.appendChild(wrap);

    } else if (f.type==='enum-multi' || f.type==='century') {
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
      const wrap = document.createElement('div'); wrap.className='check-list';
      Object.keys(counts)
        .sort((a,b)=>parseInt(a)-parseInt(b)) // OK for century; for scripts use .sort()
        .forEach(v=>{
          const lab=document.createElement('label'); lab.className='check-item';
          const cb=document.createElement('input'); cb.type='checkbox'; cb.dataset.fkey=f.key; cb.value=v;
          if (prevState[f.key]?.values?.has(v)) cb.checked=true;
          lab.appendChild(cb); lab.append(` ${v} (${counts[v]||0})`);
          wrap.appendChild(lab);
        });
      box.appendChild(wrap);

    } else if (f.type==='year-range' || f.type==='num-range') {
      const vals = records.map(r=>{
        if (f.type==='year-range') return firstYear(getVal(r,f.field));
        const d=getDetail(r,f.field); const n=parseFloat(val(d)); return isNaN(n)?null:n;
      }).filter(v=>v!=null);
      const lo = vals.length?Math.min(...vals):''; const hi = vals.length?Math.max(...vals):'';
      const rng=document.createElement('div'); rng.className='range';
      const min=document.createElement('input'); min.type='number'; min.step='1'; min.dataset.fkey=f.key;
      const max=document.createElement('input'); max.type='number'; max.step='1'; max.dataset.fkey=f.key;
      min.value = prevState[f.key]?.min ?? lo; max.value = prevState[f.key]?.max ?? hi;
      if (lo!==''){ min.min=lo; max.min=lo; } if (hi!==''){ min.max=hi; max.max=hi; }
      rng.appendChild(min); rng.append(' to '); rng.appendChild(max); box.appendChild(rng);
      const hint=document.createElement('small'); hint.className='muted'; hint.textContent=(f.type==='year-range'?'Year range (YYYY)':'Numeric range'); box.appendChild(hint);

    } else if (f.type==='text' || f.type==='resource') {
      const inp=document.createElement('input'); inp.type='search'; inp.placeholder='Type to filter…'; inp.dataset.fkey=f.key; inp.value = prevState[f.key]?.q || ''; box.appendChild(inp);
    }

    $mount.appendChild(box);
  });

  const showHisto = ['su','ms','pu','mi'].includes(ENTITY);
  document.getElementById('facet-histo').hidden = !showHisto;
}
function readFacetState(config){
  const st={};
  config.forEach(f=>{
    if (f.type==='enum'){
      const onChips=[...document.querySelectorAll(`.chip[data-fkey="${f.key}"].is-on`)].map(n=>n.dataset.value);
      st[f.key]={type:f.type, values:new Set(onChips)};
    } else if (f.type==='enum-multi' || f.type==='century'){
      const onCbs=[...document.querySelectorAll(`input[type="checkbox"][data-fkey="${f.key}"]:checked`)].map(n=>n.value);
      st[f.key]={type:f.type, values:new Set(onCbs)};
    } else if (f.type==='year-range' || f.type==='num-range'){
      const [min,max]=[...document.querySelectorAll(`.range input[data-fkey="${f.key}"]`)].map(i=>i.value);
      st[f.key]={type:f.type, min:min?parseFloat(min):null, max:max?parseFloat(max):null};
    } else if (f.type==='text' || f.type==='resource' || f.type==='enum-search'){
      const input=document.querySelector(`input[data-fkey="${f.key}"]`);
      st[f.key]={type:f.type, q:(input?.value||'').trim().toLowerCase()};
    }
  });
  return st;
}
function applyFacets(list, config){
  const st=readFacetState(config);
  return list.filter(rec=>{
    for (const f of config){
      const s=st[f.key]; if (!s) continue;
      if (f.type==='enum'){
        const v=getVal(rec,f.field);
        if (s.values.size && !s.values.has(v)) return false;
      } else if (f.type==='enum-multi' || f.type==='century'){
        const values = (f.type==='century')
          ? getValsAll(rec, 'Normalized century of production')
          : getValsAll(rec, f.field);
        // if there are selected values, the record must have at least one of them
        if (s.values.size && !values.some(v => s.values.has(v))) return false;
      } else if (f.type==='year-range'){
        const y = firstYear(getVal(rec,f.field));
        if (s.min!=null && y!=null && y < s.min) return false;
        if (s.max!=null && y!=null && y > s.max) return false;
      } else if (f.type==='num-range'){
        const d = getDetail(rec,f.field); const n = parseFloat(val(d));
        if (isNaN(n)) continue;
        if (s.min!=null && n < s.min) return false;
        if (s.max!=null && n > s.max) return false;
      } else if (f.type==='text'){
        const q=s.q; if (q && (getVal(rec,f.field)||'').toLowerCase().indexOf(q)===-1) return false;
      } else if (f.type==='resource' || f.type==='enum-search'){
        const q=s.q; if (q){
          const t = (getRes(rec,f.field)?.title || getVal(rec,f.field) || '').toLowerCase();
          if (!t.includes(q)) return false;
        }
      }
    }
    return true;
  });
}

/* ---------- Search/sort ---------- */
function applySearch(list, map, q, field){
  if (!q) return list;
  const s=q.toLowerCase();
  return list.filter(rec=>{
    if (!field) return map.flat(rec).includes(s);
    if (field==='title') return (map.title(rec)||'').toLowerCase().includes(s);
    if (field==='date')  return (map.date?.(rec)||'').toLowerCase().includes(s);
    if (field==='manuscript') return ((map.manuscriptTitle?.(rec))||'').toLowerCase().includes(s);
    if (field==='holding')    return ((map.holdingTitle?.(rec))||'').toLowerCase().includes(s);
    if (field==='place')      return ((map.place?.(rec))||'').toLowerCase().includes(s) ||
                                [getVal(rec,'Country'), getVal(rec,'City')].join(' ').toLowerCase().includes(s);
    if (field==='comments')   return (getVal(rec,'Scribe Comments')+' '+getVal(rec,'Text(s) comments')+' '+getVal(rec,'PU Comments')+' '+getVal(rec,'Identification comments')).toLowerCase().includes(s);
    return map.flat(rec).includes(s);
  });
}
const sorters = map => ({
  title_asc:  (a,b)=>(map.title(a)||'').localeCompare(map.title(b)||''),
  title_desc: (a,b)=>(map.title(b)||'').localeCompare(map.title(a)||''),
  date_asc:   (a,b)=>(map.date?.(a)||'').localeCompare(map.date?.(b)||''),
  date_desc:  (a,b)=>(map.date?.(b)||'').localeCompare(map.date?.(a)||''),
});

/* ---------- Jump helpers ---------- */
function indexOfRecord(list, id){ const sId=String(id); for (let i=0;i<list.length;i++){ if (String(list[i].rec_ID)===sId) return i; } return -1; }
function linkTo(type, id, text){ if (!id) return esc(text||''); return `<button type="button" class="linklike" data-jump='${type}:${String(id)}'>${esc(text||'')}</button>`; }
function jumpTo(type, id){
  switchEntity(type);
  const list = computeList();
  const selIndex = indexOfRecord(list, id);
  if (selIndex >= 0) page = Math.floor(selIndex / pageSize) + 1;
  render(list, type, String(id));
}

/* ---------- Summaries helpers (unchanged) ---------- */
const uniqBy = (arr, keyFn) => { const seen=new Set(); const out=[]; arr.forEach(x=>{ const k=keyFn(x); if(!seen.has(k)){ seen.add(k); out.push(x);} }); return out; };
function manuscriptsForText(txRec){
  const txId = String(txRec.rec_ID);
  const inbound = INBOUND.tx[txId] || [];
  const results = [];
  inbound.filter(x=>x.fromType==='ms').forEach(x=>{ const ms = IDX.ms[x.fromId]; if (ms) results.push({id:x.fromId, title: MAP.ms.title(ms)}); });
  inbound.filter(x=>x.fromType==='su').forEach(x=>{ const su = IDX.su[x.fromId]; if (!su) return; const msRes = getRes(su,'Manuscript'); if (!msRes) return; const ms = IDX.ms[String(msRes.id)]; if (!ms) return; results.push({id:String(msRes.id), title: MAP.ms.title(ms)}); });
  inbound.filter(x=>x.fromType==='pu').forEach(x=>{ const pu = IDX.pu[x.fromId]; if (!pu) return; const msRes = getRes(pu,'Manuscript'); if (!msRes) return; const ms = IDX.ms[String(msRes.id)]; if (!ms) return; results.push({id:String(msRes.id), title: MAP.ms.title(ms)}); });
  return uniqBy(results, r=>r.id);
}
const ROLE_FIELDS_RX = /(scribe|author|translator)/i;
function textsForPerson(hpRec){
  const hpId = String(hpRec.rec_ID);
  const inbound = INBOUND.hp[hpId] || [];
  const fromTexts = inbound.filter(x=>x.fromType==='tx' && ROLE_FIELDS_RX.test(x.fieldName||''));
  const grouped = new Map();
  fromTexts.forEach(x=>{
    const tx = IDX.tx[x.fromId]; if (!tx) return;
    const label = (x.fieldName||'Linked Text').replace(/_/g,' ');
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push({id:x.fromId, title: MAP.tx.title(tx)});
  });
  if (!grouped.size){
    inbound.filter(x=>x.fromType==='tx').forEach(x=>{
      const tx = IDX.tx[x.fromId]; if (!tx) return;
      if (!grouped.has('Texts')) grouped.set('Texts', []);
      grouped.get('Texts').push({id:x.fromId, title: MAP.tx.title(tx)});
    });
  }
  for (const [k, list] of grouped.entries()){ grouped.set(k, uniqBy(list, r=>r.id)); }
  return grouped;
}
function peopleForMonastic(miRec){
  const miId = String(miRec.rec_ID);
  const inbound = INBOUND.mi[miId] || [];
  const list = inbound.filter(x=>x.fromType==='hp').map(x=>{ const p = IDX.hp[x.fromId]; return p ? {id:x.fromId, title: MAP.hp.title(p)} : null; }).filter(Boolean);
  return uniqBy(list, r=>r.id);
}
function susForPU(puRec){
  const puId = String(puRec.rec_ID);
  const inbound = INBOUND.pu[puId] || [];
  const list = inbound.filter(x=>x.fromType==='su').map(x=>{ const su = IDX.su[x.fromId]; return su ? {id:x.fromId, title: MAP.su.title(su)} : null; }).filter(Boolean);
  return uniqBy(list, r=>r.id);
}

/* Hide these field labels in the Details panel */
const HIDE_FIELDS = new Set([
  'Cataloguing',
  'Catalogue Record Link(s)',   // add more if you like
  'Cataloging',                 // spelling variants, just in case
  'Seen in Person',
]);

const LABEL_RENAMES = {
  'Normalized terminus post quem': 'Terminus post quem',
  'Normalized terminus ante quem': 'Terminus ante quem',
  'Normalised script(s)': 'Script(s)',
};

/* Order the Details fields per entity.
   List each fieldName EXACTLY as it appears in your JSON (you can still rename via LABEL_RENAMES). */
const ORDER_FIELDS = {
  su: [
    'SU dating',
    'Normalized century of production',
    'Normalized terminus post quem',
    'Normalized terminus ante quem',
    'Manuscript',
    'Normalised script(s)',               // note British spelling from your JSON
    'Script Comments',
    'Scribe Comments',
    'Text(s) comments',
    'PU Comments',
  ],
  ms: [
    'Call number',
    'Ms Dating',
    'Holding Institution',
    'Number of folios',
    'Codex height',
    'Codex width',
    'Digitization Status',
    'Digitization Type',
    'IIIF Status',
    'Catalogue Record Link(s)',
    'Digitization link(s)',
    'IIIF Manifest Link(s)',
  ],
  pu: [
    'PU dating',
    'Normalized terminus post quem',
    'Normalized terminus ante quem',
    'PU country',
    'PU region',
    'PU City',
    'Material',
    'Manuscript',
    'Number of Folios',
  ],
  // add hi / mi / hp / tx as needed
};

/* If true, anything not listed in ORDER_FIELDS[entity] (and not hidden) will be appended at the end. */
const INCLUDE_REST = true;

/* ---------- Details panel ---------- */
function renderDetailRows(rec, entity){
  if (!rec) return '<div class="muted">No details available.</div>';

  const details = rec.details || [];

  // Build a map: fieldName -> [detail, detail, ...] to keep multi-values
  const byField = new Map();
  for (const d of details){
    const rawLabel = (d.fieldName || '').trim();
    if (!rawLabel) continue;
    if (HIDE_FIELDS.has(rawLabel)) continue;
    if (!byField.has(rawLabel)) byField.set(rawLabel, []);
    byField.get(rawLabel).push(d);
  }

  // Helper to render one detail to HTML (keeps your link behaviour)
  const renderVal = (d) => {
    if (d.termLabel) return esc(d.termLabel);
    if (d.value && typeof d.value === 'object' && (d.value.title || d.value.id)){
      const tEnt = REC_TYPE_TO_ENTITY[String(d.value.type)] || null;
      const tId  = String(d.value.id || '');
      if (tEnt && IDX[tEnt] && IDX[tEnt][tId]) return linkTo(tEnt, tId, d.value.title || tId);
      return esc(d.value.title || tId);
    }
    const raw = rawValue(d);
    if (typeof raw === 'string' && /^https?:\/\//i.test(raw)){
      return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    }
    return esc(raw ?? '');
  };

  const rows = [];

  // 1) Render in declared order
  const order = ORDER_FIELDS[entity] || [];
  const seen = new Set();
  for (const key of order){
    const arr = byField.get(key);
    if (!arr || !arr.length) continue;
    const label = esc(LABEL_RENAMES[key] || key);
    for (const d of arr){
      const html = renderVal(d);
      if (html) rows.push(`<dt>${label}</dt><dd>${html}</dd>`);
    }
    seen.add(key);
  }

  // 2) Optionally append remaining (not hidden) fields, alphabetically
  if (INCLUDE_REST){
    const rest = [...byField.keys()].filter(k => !seen.has(k)).sort((a,b)=>a.localeCompare(b));
    for (const key of rest){
      const label = esc(LABEL_RENAMES[key] || key);
      for (const d of byField.get(key)){
        const html = renderVal(d);
        if (html) rows.push(`<dt>${label}</dt><dd>${html}</dd>`);
      }
    }
  }

  return rows.length
    ? rows.join('')
    : '<div class="muted">No details available.</div>';
}

function showDetails(rec, type){
  if (!rec){
    $viz.innerHTML = `<h3 class="db-viz-title">Details</h3><div class="db-viz-body muted">No record selected.</div>`;
    return;
  }
  const map = MAP[type];
  let html = `<h3 class="db-viz-title">${esc(map.title(rec)||'Untitled')}</h3>`;

  if (type==='su'){
    const dt = map.date(rec)||'';
    const msT = map.manuscriptTitle(rec), msId = map.manuscriptId(rec);
    html += `<div class="section"><div>${esc(dt)}${msT ? ' — '+linkTo('ms', msId, msT) : ''}</div></div>`;
  } else if (type==='ms'){
    const dt = map.date(rec)||'';
    const hT = map.holdingTitle(rec), hId = map.holdingId(rec);
    html += `<div class="section"><div>${esc(dt)}${hT ? ' — '+linkTo('hi', hId, hT) : ''}</div></div>`;
    const manifestUrl = MAP.ms.iiifManifest(rec);
    if (manifestUrl){
      const viewerHref = `${BASE}/viewer/?manifest=${encodeURIComponent(manifestUrl)}`;
      html += `<div style="margin:.5rem 0 1rem;">
        <a class="chip" href="${viewerHref}" target="_blank" rel="noopener">Open in Mirador (new tab)</a>
        <a class="chip" href="${esc(manifestUrl)}" target="_blank" rel="noopener">Open manifest JSON</a>
      </div>`;
    }
  } else if (type==='pu'){
    const dt = map.date(rec)||'';
    const msT = map.manuscriptTitle(rec), msId = map.manuscriptId(rec);
    html += `<div class="section"><div>${esc(dt)}${map.place(rec)?' — '+esc(map.place(rec)):''}${msT ? ' — '+linkTo('ms', msId, msT) : ''}</div></div>`;
  } else if (type==='hi'){
    html += `<div class="section"><div>${esc(MAP.hi.country(rec)||'')} ${MAP.hi.city(rec)?' — '+esc(MAP.hi.city(rec)):''} ${MAP.hi.itype(rec)?' — '+esc(MAP.hi.itype(rec)):''}</div></div>`;
  } else if (type==='mi'){
    html += `<div class="section"><div>${esc(MAP.mi.dates(rec)||'')} ${MAP.mi.city(rec)?' — '+esc(MAP.mi.city(rec))+', ':''}${esc(MAP.mi.country(rec)||'')}</div></div>`;
  } else if (type==='hp'){
    html += `<div class="section"><div>${[MAP.hp.gender(rec)].filter(Boolean).join(' — ')}</div></div>`;
  } else if (type==='tx'){
    html += `<div class="section"><div>${[MAP.tx.genre(rec)].filter(Boolean).join(' — ')}</div></div>`;
  }

html += `<div class="section"><div class="kv">${renderDetailRows(rec, type)}</div></div>`;

  if (type==='ms'){
    const sus = DATA.su.filter(s => String(getRes(s,'Manuscript')?.id) === String(rec.rec_ID));
    const pus = DATA.pu.filter(p => String(getRes(p,'Manuscript')?.id) === String(rec.rec_ID));
    if (sus.length){ html += `<div class="section"><strong>Scribal Units in this manuscript</strong>${sus.slice(0,150).map(s=>`<div>${linkTo('su', s.rec_ID, MAP.su.title(s))}</div>`).join('')}</div>`; }
    if (pus.length){ html += `<div class="section"><strong>Production Units in this manuscript</strong>${pus.slice(0,150).map(p=>`<div>${linkTo('pu', p.rec_ID, MAP.pu.title(p))}</div>`).join('')}</div>`; }
  }
  if (type==='tx'){
    const mss = manuscriptsForText(rec);
    if (mss.length){ html += `<div class="section"><strong>Manuscripts containing this text</strong>${mss.slice(0,150).map(m=>`<div>${linkTo('ms', m.id, m.title)}</div>`).join('')}</div>`; }
  }
  if (type==='hp'){
    const groups = textsForPerson(rec);
    if (groups.size){
      html += `<div class="section"><strong>Texts linked to this person</strong>`;
      for (const [label, items] of groups.entries()){
        html += `<div style="margin:.25rem 0;"><em>${esc(label)}</em>${items.slice(0,150).map(t=>`<div>${linkTo('tx', t.id, t.title)}</div>`).join('')}</div>`;
      }
      html += `</div>`;
    }
  }
  if (type==='mi'){
    const ppl = peopleForMonastic(rec);
    if (ppl.length){ html += `<div class="section"><strong>People linked to this institution</strong>${ppl.slice(0,200).map(p=>`<div>${linkTo('hp', p.id, p.title)}</div>`).join('')}</div>`; }
  }
  if (type==='pu'){
    const sus = susForPU(rec);
    if (sus.length){ html += `<div class="section"><strong>Scribal Units in this Production Unit</strong>${sus.slice(0,200).map(su=>`<div>${linkTo('su', su.id, su.title)}</div>`).join('')}</div>`; }
  }
  if (type==='hi'){
    const manis = DATA.ms.filter(m => String(getRes(m,'Holding Institution')?.id) === String(rec.rec_ID));
    if (manis.length){ html += `<div class="section"><strong>Manuscripts at this institution</strong>${manis.slice(0,200).map(m=>`<div>${linkTo('ms', m.rec_ID, MAP.ms.title(m))}</div>`).join('')}</div>`; }
  }

  $viz.innerHTML = html;
  $viz.querySelectorAll('[data-jump]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const [t,id] = btn.getAttribute('data-jump').split(':');
      jumpTo(t, id);
    });
  });
}

/* ---------- Results grid ---------- */
let ENTITY = 'su';
let page=1, pageSize=24;
let selectedCard=null;

function render(list, type, selectId=null){
  const map = MAP[type];
  const sort = $sort.value;
  if (sort && sorters(map)[sort]) list=[...list].sort(sorters(map)[sort]);

  buildHistogram(list);

  const total=list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (selectId){
    const idx = indexOfRecord(list, selectId);
    if (idx>=0) page = Math.floor(idx / pageSize) + 1;
  }
  page = Math.min(Math.max(1, page), totalPages);

  const start=(page-1)*pageSize, end=start+pageSize;
  const pageItems=list.slice(start,end);

  const frag=document.createDocumentFragment();
  pageItems.forEach(rec=>{
    const card=document.createElement('article'); card.className='db-card';

    const body=document.createElement('div'); body.className='db-body';
    const h=document.createElement('div'); h.className='db-title';
    h.textContent=(map.title||(()=>''))(rec)||'Untitled';
    body.appendChild(h);

    const meta=document.createElement('div'); meta.className='db-meta';
    if (type==='su'){
      const yr = map.date(rec)||''; const msT = map.manuscriptTitle(rec); const msId = map.manuscriptId(rec);
      if (yr){ const yd=document.createElement('span'); yd.className='yeardash'; yd.textContent=`${yr} —`; meta.appendChild(yd); }
      if (msT){
        const btn=document.createElement('button'); btn.type='button'; btn.className='linklike'; btn.textContent=msT; if (msId) btn.dataset.jump=`ms:${String(msId)}`;
        btn.addEventListener('click', ev=>{ ev.stopPropagation(); jumpTo('ms', String(msId)); });
        meta.appendChild(btn);
      }
    } else if (type==='ms'){
      meta.textContent = [ map.date(rec) ].filter(Boolean).join(' — ');
    } else if (type==='pu'){
      const yr = map.date(rec)||''; const msT = map.manuscriptTitle(rec); const msId = map.manuscriptId(rec);
      if (yr){ const y=document.createElement('span'); y.className='yeardash'; y.textContent=`${yr} —`; meta.appendChild(y); }
      if (map.place(rec)){ const pl=document.createElement('span'); pl.textContent=map.place(rec); meta.appendChild(pl); }
      if (msT){
        const sep=document.createElement('span'); sep.className='sep'; sep.textContent='—'; meta.appendChild(sep);
        const btn=document.createElement('button'); btn.type='button'; btn.className='linklike'; btn.textContent=msT; if (msId) btn.dataset.jump=`ms:${String(msId)}`;
        btn.addEventListener('click', ev=>{ ev.stopPropagation(); jumpTo('ms', String(msId)); });
        meta.appendChild(btn);
      }
    } else if (type==='hi'){
      meta.textContent = [MAP.hi.country(rec), MAP.hi.city(rec), MAP.hi.itype(rec)].filter(Boolean).join(' — ');
    } else if (type==='mi'){
      meta.textContent = [MAP.mi.dates(rec), MAP.mi.city(rec), MAP.mi.country(rec)].filter(Boolean).join(' — ');
    } else if (type==='hp'){
      meta.textContent = [MAP.hp.gender(rec)].filter(Boolean).join(' — ');
    } else if (type==='tx'){
      meta.textContent = [MAP.tx.genre(rec)].filter(Boolean).join(' — ');
    }

    body.appendChild(meta);
    card.appendChild(body);

    card.addEventListener('click', ()=>{
      if (selectedCard) selectedCard.classList.remove('is-selected');
      card.classList.add('is-selected');
      selectedCard = card;
      showDetails(rec, type);
    });

    if (selectId && String(rec.rec_ID)===String(selectId)) card.dataset.autoselect = '1';
    frag.appendChild(card);
  });

  $results.innerHTML=''; $results.appendChild(frag);

  $status.textContent = `${total} result${total===1?'':'s'}`;
  $pager.hidden = total <= pageSize;
  $page.textContent = `Page ${page} / ${totalPages}`;
  $prev.disabled = (page<=1);
  $next.disabled = (page>=totalPages);

  const toSelect = $results.querySelector('.db-card[data-autoselect="1"]') || $results.querySelector('.db-card');
  if (toSelect){ toSelect.click(); toSelect.scrollIntoView({block:'nearest'}); }
  else { showDetails(null, type); selectedCard=null; }
}
function computeList(){
  const cfg  = FACETS[ENTITY];
  const map  = MAP[ENTITY];
  let list = DATA[ENTITY] || [];
  list = applyFacets(list, cfg);
  list = applySearch(list, map, $search.value.trim(), $field.value);
  if (histoBucket!=null){ list = list.filter(passesHistogram); }
  return list;
}
function renderCurrent(){
  const list = computeList();
  render(list, ENTITY);
}
function recompute(){
  const cfg = FACETS[ENTITY];
  const prevState = readFacetState(cfg);
  const list = computeList();
  buildFacets(list, cfg, prevState);
  render(list, ENTITY);
}

/* ---------- Views (Results / Map / Timeline) ---------- */
let ACTIVE_VIEW = 'results';

function supportsMap(entity){ return ['hi','ms','pu'].includes(entity); }
function supportsTimeline(entity){ return ['su','ms','pu','mi'].includes(entity); }

function setView(view){
  ACTIVE_VIEW = view;

  // Tabs
  $tabs.results?.classList.toggle('is-on', view==='results');
  $tabs.map?.classList.toggle('is-on',     view==='map');
  $tabs.timeline?.classList.toggle('is-on',view==='timeline');

  // Layout
  const vizOn = (view!=='results');
  $right.classList.toggle('viz-mode', vizOn);
  $panes.map.classList.toggle('is-on', view==='map');
  $panes.timeline.classList.toggle('is-on', view==='timeline');
  $panes.map.setAttribute('aria-hidden', String(view!=='map'));
  $panes.timeline.setAttribute('aria-hidden', String(view!=='timeline'));

  if (view==='map') buildMap();
  if (view==='timeline') buildTimeline();
}
$tabs.wrap.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-view]');
  if (!btn) return;
  setView(btn.dataset.view);
});
$tabs.switchBtn.addEventListener('click', ()=>{
  const order = ['results','map','timeline'].filter(v=>{
    if (v==='map') return supportsMap(ENTITY);
    if (v==='timeline') return supportsTimeline(ENTITY);
    return true;
  });
  const i = order.indexOf(ACTIVE_VIEW);
  setView(order[(i+1) % order.length]);
});
function updateAvailableViews(){
  const mapOk = supportsMap(ENTITY);
  const tlOk  = supportsTimeline(ENTITY);
  $tabs.map.hidden      = !mapOk;
  $tabs.timeline.hidden = !tlOk;
  if (ACTIVE_VIEW==='map' && !mapOk) setView('results');
  if (ACTIVE_VIEW==='timeline' && !tlOk) setView('results');
  if (ACTIVE_VIEW==='map' && mapOk) buildMap();
  if (ACTIVE_VIEW==='timeline' && tlOk) buildTimeline();
}

/* ---------- Switch entity ---------- */
function switchEntity(ent){
  if (ENTITY===ent) return;
  ENTITY = ent;
  document.querySelectorAll('#entity-switch .chip').forEach(c=>c.classList.toggle('is-on', c.dataset.entity===ent));
  $search.value=''; $field.value=''; $sort.value='';
  page=1; histoBucket=null;
  recompute();
  updateAvailableViews();
}

/* ---------- Map (Leaflet) ---------- */
let leafletLoaded=false;
function ensureLeaflet(){
  return new Promise((resolve)=>{
    if (leafletLoaded) return resolve();
    const link=document.createElement('link'); link.rel='stylesheet';
    link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.onload=()=>{ leafletLoaded=true; resolve(); }; document.body.appendChild(s);
  });
}
function parseWKTPoint(wkt){ if (!wkt) return null; const m=String(wkt).match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/i); return m?{lng:parseFloat(m[1]),lat:parseFloat(m[2])}:null; }
function coordsFromHoldingInstitution(msRec){
  const hiRes = getRes(msRec,'Holding Institution'); if (!hiRes||!hiRes.id) return null;
  const hi = IDX.hi[String(hiRes.id)]; if (!hi) return null;
  const latD = getDetail(hi,'Latitude')?.value; const lonD = getDetail(hi,'Longitude')?.value;
  const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
  return parseWKTPoint(wkt);
}
function coordsFromProduction(msRec){
  const msId = String(msRec.rec_ID);
  const pus = DATA.pu.filter(p => String(getRes(p,'Manuscript')?.id) === msId);
  for (const pu of pus){
    const latD = getDetail(pu,'Latitude')?.value || getDetail(pu,'PU Latitude')?.value;
    const lonD = getDetail(pu,'Longitude')?.value || getDetail(pu,'PU Longitude')?.value;
    const wkt  = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
    const pt = parseWKTPoint(wkt); if (pt) return pt;
  }
  return null;
}
async function buildMap(){
  if (!supportsMap(ENTITY)) return;
  await ensureLeaflet();

  // Title by entity
  $mapTitle.textContent = (ENTITY==='ms')
    ? 'Map — Manuscript Production (fallback: Holding Institution)'
    : (ENTITY==='pu' ? 'Map — Production Units' : 'Map — Holding Institutions');

  // fresh mount to avoid Leaflet errors between entity switches
  let mount = document.getElementById('map-mount');
  if (!mount) return;
  if (mount._leaflet_id){ const clone = mount.cloneNode(false); mount.parentNode.replaceChild(clone, mount); mount=clone; }
  mount.innerHTML='';

  const map = L.map(mount).setView([47,8],4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap' }).addTo(map);

  const list = computeList();
  const fg = L.featureGroup().addTo(map);

  list.forEach(rec=>{
    let pt=null;
    if (ENTITY==='hi'){
      const latD = getDetail(rec,'Latitude')?.value;
      const lonD = getDetail(rec,'Longitude')?.value;
      const wkt  = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
      pt = parseWKTPoint(wkt);
    } else if (ENTITY==='ms'){
      pt = coordsFromProduction(rec) || coordsFromHoldingInstitution(rec);
    } else if (ENTITY==='pu'){
      const latD = getDetail(rec,'Latitude')?.value || getDetail(rec,'PU Latitude')?.value;
      const lonD = getDetail(rec,'Longitude')?.value || getDetail(rec,'PU Longitude')?.value;
      const wkt  = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
      pt = parseWKTPoint(wkt);
    }
    if (!pt) return;
    const id = String(rec.rec_ID);
    const title = (MAP[ENTITY].title(rec) || 'Untitled').replace(/"/g,'&quot;');
    const m = L.circleMarker([pt.lat, pt.lng], {radius:6}).addTo(fg);
    m.bindPopup(`<div style="min-width:220px"><div style="font-weight:600;margin-bottom:.25rem">${title}</div><button class="chip" data-jump="${ENTITY}:${id}">Open in results</button></div>`);
    m.on('popupopen', (e)=>{
      const btn = e.popup.getElement().querySelector('[data-jump]');
      btn.addEventListener('click', ()=>{ setView('results'); jumpTo(ENTITY, id); });
    });
  });

  if (fg.getLayers().length){ map.fitBounds(fg.getBounds().pad(0.2)); }
  else { map.setView([47,8],4); mount.insertAdjacentHTML('beforeend','<div class="muted" style="padding:.75rem">No mappable coordinates in current results.</div>'); }
}

function buildTimeline(){
  // Only render where supported
  if (!supportsTimeline(ENTITY)) return;

  const mount = document.getElementById('timeline-mount');
  if (!mount) return;

  // Helper: get first 3–4 digit year safely
  const getYear = s => {
    if (!s) return null;
    const m = String(s).match(/(^|[^0-9])([0-9]{3,4})(?![0-9])/);
    if (!m) return null;
    const y = parseInt(m[2], 10);
    return (y >= 1 && y <= 2100) ? y : null;
  };

  // Pull the current filtered list
  const list = computeList();

  // Sizing
  const width  = mount.clientWidth || 900;
  const padX   = 36;
  const padY   = 28;
  const bandH  = 96;      // vertical space per band (dot cloud height)
  const gap    = 32;      // space between bands
  const hSingle = padY + bandH + padY;                // single-band total height
  const hDouble = padY + bandH + gap + bandH + padY;  // two-band total height

  // Map X position from year
  const makeX = (minY, maxY) => {
    const span = (maxY - minY) || 1;
    return y => padX + ((y - minY) / span) * (width - 2*padX);
  };

  // ————————— Monastic Institutions: two bands (Creation + Suppression)
  if (ENTITY === 'mi') {
    const Y_creation  = r => getYear(getDetail(r,'Creation date')?.value);
    const Y_suppress  = r => getYear(getDetail(r,'Suppression date')?.value);

    const creations  = list.map(r => ({ r, y: Y_creation(r)  })).filter(o => Number.isFinite(o.y));
    const suppresses = list.map(r => ({ r, y: Y_suppress(r) })).filter(o => Number.isFinite(o.y));

    if (!creations.length && !suppresses.length){
      mount.style.height = '160px';
      mount.innerHTML = '<div class="muted" style="padding:.75rem">No dates in current results.</div>';
      return;
    }

    const allYears = [...creations.map(o=>o.y), ...suppresses.map(o=>o.y)];
    const minY = Math.min(...allYears), maxY = Math.max(...allYears);
    const X = makeX(minY, maxY);

    // Center each band vertically; jitter stays within bandH
    const band1Y = padY + bandH/2;                 // Creation baseline (center)
    const band2Y = padY + bandH + gap + bandH/2;   // Suppression baseline (center)

    const jitter = () => (Math.random() - 0.5) * bandH; // ± bandH/2
    const dot = (x, cy, color, title) =>
      `<circle cx="${x.toFixed(1)}" cy="${(cy + jitter()).toFixed(1)}" r="3" fill="${color}"><title>${title}</title></circle>`;

    const svg = `
      <svg viewBox="0 0 ${width} ${hDouble}" width="100%" height="${hDouble}">
        <text x="${padX}" y="${band1Y-12}" font-size="12" fill="#666">Creation</text>
        <text x="${padX}" y="${band2Y-12}" font-size="12" fill="#666">Suppression</text>

        <line x1="${padX}" y1="${band1Y}" x2="${width-padX}" y2="${band1Y}" stroke="#ccc"/>
        <line x1="${padX}" y1="${band2Y}" x2="${width-padX}" y2="${band2Y}" stroke="#ccc"/>

        ${creations.map(o => dot(X(o.y), band1Y, '#cda85c', `${MAP.mi.title(o.r) || 'Untitled'} (Creation: ${o.y})`)).join('')}
        ${suppresses.map(o => dot(X(o.y), band2Y, '#888', `${MAP.mi.title(o.r) || 'Untitled'} (Suppression: ${o.y})`)).join('')}

        <text x="${padX}" y="${hDouble-10}" font-size="11" fill="#666">${minY}</text>
        <text x="${width/2}" y="${hDouble-10}" font-size="11" fill="#666" text-anchor="middle">${Math.round((minY+maxY)/2)}</text>
        <text x="${width-padX}" y="${hDouble-10}" font-size="11" fill="#666" text-anchor="end">${maxY}</text>
      </svg>
    `;
    mount.style.height = `${hDouble}px`;
    mount.innerHTML = svg;
    return;
  }

  // ————————— Default: single-band timeline
  const yearOf = r => {
    if (ENTITY==='su') return getYear(getVal(r,'Normalized terminus post quem')) || getYear(getVal(r,'SU dating'));
    if (ENTITY==='ms') return getYear(getVal(r,'Ms Dating'));
    if (ENTITY==='pu') return getYear(getVal(r,'PU dating')) || getYear(getVal(r,'Normalized terminus post quem'));
    return null;
  };

  const pts = list.map(r => ({ r, y: yearOf(r) })).filter(o => Number.isFinite(o.y));
  if (!pts.length){
    mount.style.height = '160px';
    mount.innerHTML = '<div class="muted" style="padding:.75rem">No dates in current results.</div>';
    return;
  }

  const minY = Math.min(...pts.map(o=>o.y));
  const maxY = Math.max(...pts.map(o=>o.y));
  const X = makeX(minY, maxY);
  const baseline = padY + bandH/2;

  const svg = `
    <svg viewBox="0 0 ${width} ${hSingle}" width="100%" height="${hSingle}">
      <line x1="${padX}" y1="${baseline}" x2="${width-padX}" y2="${baseline}" stroke="#ccc"/>
      ${pts.map(o => {
        const cy = baseline + (Math.random() - 0.5) * bandH; // centered jitter
        const t  = MAP[ENTITY].title(o.r) || 'Untitled';
        return `<circle cx="${X(o.y).toFixed(1)}" cy="${cy.toFixed(1)}" r="3" fill="#cda85c"><title>${t} (${o.y})</title></circle>`;
      }).join('')}
      <text x="${padX}" y="${hSingle-10}" font-size="11" fill="#666">${minY}</text>
      <text x="${width/2}" y="${hSingle-10}" font-size="11" fill="#666" text-anchor="middle">${Math.round((minY+maxY)/2)}</text>
      <text x="${width-padX}" y="${hSingle-10}" font-size="11" fill="#666" text-anchor="end">${maxY}</text>
    </svg>
  `;
  mount.style.height = `${hSingle}px`;
  mount.innerHTML = svg;
}

/* ---------- CSV ---------- */
const csvCell = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
const access = {
  field: (label, fieldName) => ({ label, get: r => getVal(r, fieldName) }),
  resTitle: (label, fieldName) => ({ label, get: r => (getRes(r, fieldName)?.title) || getVal(r, fieldName) || '' }),
  raw: (label, fn) => ({ label, get: fn }),
};
const FIELDSETS = {
  su: [
    access.raw('rec_ID', r=>r.rec_ID), access.raw('Title',  r=>MAP.su.title(r)), access.raw('Date (normalized)', r=>MAP.su.date(r)),
    access.resTitle('Manuscript', 'Manuscript'),
    access.field('Colophon presence','Colophon presence'), access.field('Colophon language','Colophon language'),
    access.field('Century','Normalized century of production'), access.field('Terminus post quem','Normalized terminus post quem'),
    access.field('Terminus ante quem','Normalized terminus ante quem'), access.field('SU dating','SU dating'),
    access.field('Script Comments','Script Comments'), access.field('Scribe Comments','Scribe Comments'),
    access.field('Text(s) comments','Text(s) comments'), access.field('PU Comments','PU Comments'),
  ],
  ms: [
    access.raw('rec_ID', r=>r.rec_ID), access.raw('Title',  r=>MAP.ms.title(r)), access.raw('Date (Ms Dating)', r=>MAP.ms.date(r)),
    access.field('Call number','Call number'), access.resTitle('Holding Institution','Holding Institution'),
    access.field('Digitization Status','Digitization Status'), access.field('Digitization Type','Digitization Type'),
    access.field('IIIF Status','IIIF Status'), access.field('Number of folios','Number of folios'),
    access.field('Codex height','Codex height'), access.field('Codex width','Codex width'),
    access.field('Catalogue Record Link(s)','Catalogue Record Link(s)'), access.field('Digitization link(s)','Digitization link(s)'),
    access.field('IIIF Manifest Link(s)','IIIF Manifest Link(s)'),
  ],
  pu: [
    access.raw('rec_ID', r=>r.rec_ID), access.raw('Title',  r=>MAP.pu.title(r)), access.raw('Date (normalized)', r=>MAP.pu.date(r)),
    access.field('Country','PU country'), access.field('Region','PU region'), access.field('City','PU City'),
    access.field('Material','Material'), access.resTitle('Manuscript','Manuscript'), access.field('Folios','Number of Folios'),
  ],
  hi: [
    access.raw('rec_ID', r=>r.rec_ID), access.raw('Title',  r=>MAP.hi.title(r)),
    access.field('Country','Country'), access.field('City','City'),
    access.field('Institution type','Institution type'), access.field('Website link','Website link'),
    access.field('Latitude','Latitude'), access.field('Longitude','Longitude'),
  ],
  mi: [
    access.raw('rec_ID', r=>r.rec_ID), access.raw('Title',  r=>MAP.mi.title(r)),
    access.field('Country','Country'), access.field('City','City'), access.field('Religious order','Religious order'),
    access.field('Type of monastery','Type of monastery'), access.field('Creation date','Creation date'), access.field('Suppression date','Suppression date'),
  ],
  hp: [
    access.raw('rec_ID', r=>r.rec_ID), access.raw('Title',  r=>MAP.hp.title(r)),
    access.field('Name of Person','Name of Person'), access.field('Gender','Gender'),
    access.field('Gender certainty','Gender certainty'), access.field('Person type','Person type'),
  ],
  tx: [
    access.raw('rec_ID', r=>r.rec_ID), access.raw('Title',  r=>MAP.tx.title(r)),
    access.field('Normalized Title','Normalized Title'), access.field('Other titles','other titles'),
    access.field('Genre','Genre'), access.field('Subgenre','Subgenre'), access.field('Identification comments','Identification comments'),
  ]
};
const $csvDialog = document.getElementById('csv-dialog');
const $csvFields = document.getElementById('csv-fields');
const $csvHeader = document.getElementById('csv-include-header');
const $csvAll    = document.getElementById('csv-all');
const $csvNone   = document.getElementById('csv-none');
const $csvGo     = document.getElementById('csv-export-go');
function openCSVDialog(){
  const fields = FIELDSETS[ENTITY] || [];
  $csvFields.innerHTML = '';
  fields.forEach((f, i)=>{
    const id = `csv-${ENTITY}-${i}`;
    const label = document.createElement('label');
    label.setAttribute('for', id);
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.id = id; cb.dataset.idx = String(i);
    cb.checked = (i < 4);
    label.append(cb); label.append(' '+f.label);
    $csvFields.appendChild(label);
  });
  $csvDialog.showModal();
}
function selectedFieldAccessors(){
  const fields = FIELDSETS[ENTITY] || [];
  return [...$csvFields.querySelectorAll('input[type="checkbox"]')].filter(cb=>cb.checked).map(cb=>fields[parseInt(cb.dataset.idx,10)]);
}
function buildCSV(list, picks, includeHeader){
  const headers = picks.map(p=>csvCell(p.label)).join(',');
  const rows = list.map(r => picks.map(p => csvCell(p.get(r))).join(','));
  return (includeHeader ? headers+'\n' : '') + rows.join('\n');
}
function downloadCSVFromList(){
  const picks = selectedFieldAccessors();
  if (!picks.length){ alert('Select at least one field.'); return; }
  const list = computeList();
  const csv = buildCSV(list, picks, $csvHeader.checked);
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `export_${ENTITY}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

/* ---------- Events ---------- */
document.getElementById('entity-switch').addEventListener('click', (e)=>{
  const btn = e.target.closest('.chip'); if (!btn) return;
  switchEntity(btn.dataset.entity);
});
$prev.addEventListener('click',()=>{ page=Math.max(1,page-1); renderCurrent(); updateAvailableViews(); });
$next.addEventListener('click',()=>{ page=page+1; renderCurrent(); updateAvailableViews(); });
$sort.addEventListener('change',()=>{ page=1; renderCurrent(); updateAvailableViews(); });
$field.addEventListener('change',()=>{ page=1; renderCurrent(); updateAvailableViews(); });
$search.addEventListener('input', debounce(()=>{ page=1; renderCurrent(); updateAvailableViews(); }, 200));
$mount.addEventListener('click',e=>{
  const chip=e.target.closest('.chip'); if (!chip) return;
  chip.classList.toggle('is-on'); page=1; recompute(); updateAvailableViews();
});
$mount.addEventListener('change', debounce(()=>{ page=1; recompute(); updateAvailableViews(); },150));
document.getElementById('btn-clear').addEventListener('click', ()=>{
  $mount.querySelectorAll('input').forEach(i=>{ if (i.type==='checkbox') i.checked=false; else i.value=''; });
  $mount.querySelectorAll('.chip.is-on').forEach(c=>c.classList.remove('is-on'));
  $search.value=''; $field.value=''; $sort.value='';
  histoBucket=null; page=1;
  recompute(); updateAvailableViews();
});
$btnExport.addEventListener('click', openCSVDialog);
$csvAll?.addEventListener('click', ()=>{ $csvFields.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.checked=true); });
$csvNone?.addEventListener('click', ()=>{ $csvFields.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.checked=false); });
$csvGo?.addEventListener('click', (e)=>{ e.preventDefault(); downloadCSVFromList(); $csvDialog.close(); });

/* ---------- Boot ---------- */
async function boot(){
  $status.textContent='Loading data…';
  const [su, ms, pu, hi, mi, hp, tx] = await Promise.all([
    fetchHeuristRecords(SU_ENDPOINT, EXPECT_TYPE.su),
    fetchHeuristRecords(MS_ENDPOINT, EXPECT_TYPE.ms),
    fetchHeuristRecords(PU_ENDPOINT, EXPECT_TYPE.pu),
    fetchHeuristRecords(HI_ENDPOINT, EXPECT_TYPE.hi),
    fetchHeuristRecords(MI_ENDPOINT, EXPECT_TYPE.mi),
    fetchHeuristRecords(HP_ENDPOINT, EXPECT_TYPE.hp),
    fetchHeuristRecords(TX_ENDPOINT, EXPECT_TYPE.tx)
  ]);
  DATA = { su:dedupeById(su), ms:dedupeById(ms), pu:dedupeById(pu), hi:dedupeById(hi), mi:dedupeById(mi), hp:dedupeById(hp), tx:dedupeById(tx) };
  indexAll(); buildTypeMap(); indexPointers();
  buildFacets(DATA.su, FACETS.su);
  render(DATA.su, 'su');
  updateAvailableViews();
  $status.textContent='';
}
boot();

/* Expose a couple for debugging */
window.jumpTo = jumpTo;
window.renderCurrent = renderCurrent;
})();
</script>