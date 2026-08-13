/* ============================================================
   Unknown Hands — Explore page (unified, stable)
   ============================================================ */
(function(){
/* ---------- Endpoints ---------- */
const SU_ENDPOINT = window.ExploreHeadConfig.SU_ENDPOINT;
const MS_ENDPOINT = window.ExploreHeadConfig.MS_ENDPOINT;
const PU_ENDPOINT = window.ExploreHeadConfig.PU_ENDPOINT;
const HI_ENDPOINT = window.ExploreHeadConfig.HI_ENDPOINT;
const MI_ENDPOINT = window.ExploreHeadConfig.MI_ENDPOINT;
const HP_ENDPOINT = window.ExploreHeadConfig.HP_ENDPOINT;
const TX_ENDPOINT = window.ExploreHeadConfig.TX_ENDPOINT;
const REL_ENDPOINT = window.ExploreHeadConfig.REL_ENDPOINT;
const BASE = window.ExploreHeadConfig.BASE;

/* ---------- Load manifest-annos map ---------- */
let manifestAnnosMap = {};
fetch(`${BASE}/data/manifest-annos-map.json`)
  .then(r => r.ok ? r.json() : {})
  .then(map => {
    manifestAnnosMap = map;
  })

/* ---------- DOM ---------- */
const $mount   = document.getElementById('facet-mount');
const $results = document.getElementById('db-results');
const $status  = document.getElementById('db-status');
const $pager   = document.getElementById('db-pager');
const $prev    = document.getElementById('db-prev');
const $next    = document.getElementById('db-next');
const $page    = document.getElementById('db-page');
const $pageJump = document.getElementById('db-page-jump');
const $pageGo   = document.getElementById('db-page-go');
const $search  = document.getElementById('db-search');
const $field   = document.getElementById('db-field');
const $sort    = document.getElementById('db-sort');
const $viz     = document.getElementById('db-viz');
const $btnClear  = document.getElementById('btn-clear');
const $btnExport = document.getElementById('btn-export');
const $btnAdvanced = document.getElementById('btn-advanced-search');
const $advancedPanel = document.getElementById('advanced-search-panel');
const $advancedResultType = document.getElementById('advanced-result-type');
const $advancedMatchMode = document.getElementById('advanced-match-mode');
const $advancedAdd = document.getElementById('advanced-add-condition');
const $advancedList = document.getElementById('advanced-condition-list');
const $advancedApply = document.getElementById('advanced-apply');
const $advancedClear = document.getElementById('advanced-clear');
const $advancedStatus = document.getElementById('advanced-search-status');

const $right = document.querySelector('.db-right');
const $tabs = {
  wrap: document.getElementById('view-tabs'),
  results: document.querySelector('[data-view="results"]'),
  map: document.querySelector('[data-view="map"]'),
  timeline: document.querySelector('[data-view="timeline"]'),
  network: document.querySelector('[data-view="network"]'),
  analytics: document.querySelector('[data-view="analytics"]'),
  switchBtn: document.getElementById('btn-switch')
};
const $panes = {
  map: document.getElementById('pane-map'),
  timeline: document.getElementById('pane-timeline'),
  network: document.getElementById('pane-network'),
  analytics: document.getElementById('pane-analytics'),
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
const isKnownCategory = value => {
  if (value === null || value === undefined) return false;
  const normalized = String(value).replace(/\s+/g, ' ').trim();
  if (!normalized) return false;
  return !/^(?:(?:unknown|tbc)(?:\s+(?:location|scribe|institution|manuscript|ms|production unit|pu|order))?|not known|to be (?:confirmed|completed))$/i.test(normalized);
};
const flat = rec => { 
  const bits=[rec.rec_Title||'']; 
  (rec.details||[]).forEach(d=>{ 
    if (d.termLabel) bits.push(d.termLabel); 
    if (typeof d.value==='string') bits.push(d.value); 
    if (d.value && typeof d.value==='object' && d.value.title) bits.push(d.value.title); 
  }); 
  // Include relationship metadata in searchable text
  if (rec.rec_ID) {
    const relText = getRelationshipSearchText(rec.rec_ID);
    if (relText) bits.push(relText);
  }
  return bits.join(' ').toLowerCase(); 
};
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
// All details for a field name
const getDetailsAll = (rec, name) => (rec?.details || []).filter(d => d.fieldName === name);

// Convert a detail to displayable string
const detailToString = d => val(d);

// All values (strings) for a field, flattening multi-valued terms
const getValsAll = (rec, field) =>
  getDetailsAll(rec, field).map(detailToString).filter(Boolean);

// Values from controlled-vocabulary fields only. Narrative text stored in a
// similarly named field is deliberately ignored so it cannot become a chart
// category. Each term is returned once, preserving uncertain/multiple values.
const getControlledValsAll = (rec, field) => [...new Set(
  getDetailsAll(rec, field)
    .map(detail => detail?.termLabel)
    .filter(isKnownCategory)
    .map(value => String(value).trim())
)];

const FIELD_ALIASES = {
  'Colophon presence': ['Colophon presence', 'Colophon Presence'],
  'Colophon Presence': ['Colophon Presence', 'Colophon presence'],
  'Number of folios': ['Number of folios', 'Number of Folios'],
  'Number of Folios': ['Number of Folios', 'Number of folios'],
  'Extent comments': ['Extent comments', 'Extent Comments'],
  'Extent Comments': ['Extent Comments', 'Extent comments'],
  'Ruling': ['Ruling', 'ruling_type'],
  'ruling_type': ['ruling_type', 'Ruling'],
  'GeoNames': ['GeoNames', 'Geonames', 'geonames_id'],
  'Geonames': ['Geonames', 'GeoNames', 'geonames_id'],
  'VIAF': ['VIAF', 'viaf_id'],
  'GND ID': ['GND ID', 'gnd_id'],
  'ISNI': ['ISNI', 'isni_id'],
  'Bibliothèque nationale de France ID': ['Bibliothèque nationale de France ID', 'bnf_id'],
  'Library of Congress authority ID': ['Library of Congress authority ID', 'loc_id'],
};

function fieldNames(field){
  const raw = Array.isArray(field) ? field : [field];
  const out = [];
  raw.filter(Boolean).forEach(name => {
    const aliases = FIELD_ALIASES[name] || [name];
    aliases.forEach(alias => {
      if (alias && !out.includes(alias)) out.push(alias);
    });
  });
  return out;
}

function getDetailsAny(rec, field){
  return fieldNames(field).flatMap(name => getDetailsAll(rec, name));
}

function getValAny(rec, field){
  const first = getDetailsAny(rec, field)[0];
  return val(first);
}

function getValsAny(rec, field){
  return getDetailsAny(rec, field).map(detailToString).filter(Boolean);
}

/**
 * Get unique values for a field across all records of a given type
 * @param {string} entityType - Entity type (su, ms, pu, hi, mi, hp, tx)
 * @param {string} fieldName - Field name to extract values from
 * @param {boolean} multi - Whether to extract from multi-valued fields
 * @returns {Array<string>} Sorted array of unique values
 */
function getUniqueValues(entityType, fieldName, multi = false) {
  const records = DATA[entityType] || [];
  const values = new Set();
  
  records.forEach(rec => {
    if (multi) {
      // For multi-valued fields, get all values
      const vals = getValsAll(rec, fieldName);
      vals.forEach(v => {
        if (v && v.trim()) values.add(v.trim());
      });
    } else {
      // For single-valued fields, get one value
      const val = getVal(rec, fieldName);
      if (val && val.trim()) values.add(val.trim());
    }
  });
  
  return Array.from(values).sort();
}


/* EXPORT UTILITIES EXTRACTED */

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

let DATA = { su:[], ms:[], pu:[], hi:[], mi:[], hp:[], tx:[], rel:[] };
let IDX  = { su:{}, ms:{}, pu:{}, hi:{}, mi:{}, hp:{}, tx:{} };
function indexAll(){ for (const k of Object.keys(DATA)){ if (k === 'rel') continue; IDX[k]={}; DATA[k].forEach(r=>{ IDX[k][String(r.rec_ID)] = r; }); } }
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

/* ---------- Relationship index ---------- */
let REL_INDEX = { bySource: {}, byTarget: {} };
function indexRelationships(){
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

/* ---------- Relationship metadata extraction ---------- */
/**
 * Get all relationships (incoming and outgoing) for a record
 * @param {string} recId - Record ID
 * @returns {Array} Array of relationship objects
 */
function getRecordRelationships(recId) {
  const id = String(recId);
  const outgoing = REL_INDEX.bySource[id] || [];
  const incoming = REL_INDEX.byTarget[id] || [];
  return [...outgoing, ...incoming];
}

/**
 * Extract searchable text from all relationships for a record
 * This includes: scribe certainty, role, language, folio info, etc.
 * @param {string} recId - Record ID
 * @returns {string} Space-separated string of all relationship metadata
 */
function getRelationshipSearchText(recId) {
  const rels = getRecordRelationships(recId);
  const texts = [];
  
  rels.forEach(rel => {
    // Extract all relevant metadata fields from relationships
    const fields = [
      'scribe certainty',
      'Scribe role',
      'Function of Copying',
      'Scribe Comments',
      'Production info',
      'Folio range in PU',
      'Folio range',
      'Text Language(s)',
      'Text(s) comments',
      'Expression',
      'Style',
      'Relationship type',
      'Attribution status',
      'Confidence level'
    ];
    
    fields.forEach(field => {
      const val = getVal(rel, field);
      if (val) texts.push(String(val));
    });
  });
  
  return texts.join(' ').toLowerCase();
}

/**
 * Get specific relationship metadata values for filtering
 * For example: all languages used in texts related to this entity
 * @param {string} recId - Record ID
 * @param {string} fieldName - Name of the field to extract from relationships
 * @returns {Array} Array of unique values
 */
function getRelationshipValues(recId, fieldName) {
  const rels = getRecordRelationships(recId);
  const values = new Set();
  
  rels.forEach(rel => {
    const vals = getValsAny(rel, fieldName);
    vals.forEach(v => values.add(v));
  });
  
  return Array.from(values);
}

function getRelatedRecordValues(recId, entityType, fieldName) {
  const related = [];
  const valuesFrom = record => fieldName === '$title'
    ? [record?.rec_Title].filter(Boolean)
    : getValsAny(record, fieldName);
  const collect = (relationships, endpointField) => {
    relationships.forEach(rel => {
      const endpoint = getRes(rel, endpointField);
      if (!endpoint?.id) return;
      const endpointType = REC_TYPE_TO_ENTITY[String(endpoint.type)];
      if (endpointType !== entityType) return;
      const record = IDX[entityType]?.[String(endpoint.id)];
      if (record) related.push(...valuesFrom(record));
    });
  };
  collect(REL_INDEX.bySource[String(recId)] || [], 'Target record');
  collect(REL_INDEX.byTarget[String(recId)] || [], 'Source record');

  // Follow ordinary Heurist pointers from this record to the related entity.
  const current = Object.values(IDX).map(index => index?.[String(recId)]).find(Boolean);
  (current?.details || []).forEach(detail => {
    const pointer = detail?.value;
    if (!pointer?.id || typeof pointer !== 'object') return;
    const pointerType = REC_TYPE_TO_ENTITY[String(pointer.type)];
    if (pointerType !== entityType) return;
    const record = IDX[entityType]?.[String(pointer.id)];
    if (record) related.push(...valuesFrom(record));
  });

  // Follow reverse pointers, e.g. Production Units pointing to a Manuscript.
  Object.entries(INBOUND).forEach(([targetType, targets]) => {
    const links = targets?.[String(recId)] || [];
    links.forEach(link => {
      if (link.fromType !== entityType) return;
      const record = IDX[entityType]?.[String(link.fromId)];
      if (record) related.push(...valuesFrom(record));
    });
  });
  return [...new Set(related.filter(Boolean))];
}

/* ---------- Facets config ---------- */
const FACETS = {
  su: [
    { key:'manuscript', label:'Manuscript', type:'resource', field:'Manuscript' },
    { key:'century', label:'Normalized century of production', type:'century', field:'Normalized century of production' },
    { key:'post', label:'Terminus post quem', type:'year-range', field:'Normalized terminus post quem' },
    { key:'ante', label:'Terminus ante quem', type:'year-range', field:'Normalized terminus ante quem' },
    { key:'su_dating', label:'SU dating', type:'text', field:'SU dating' },
    { key:'extent', label:'Extent', type:'text', field:'Extent' },
    { key:'folio_range', label:'Folio range', type:'text', field:'Folio range' },
    { key:'script', label:'Normalized script(s)', type:'enum-multi', field:'Normalised script(s)' },
    { key:'scribe_certainty', label:'Scribe certainty (from relationships)', type:'relationship-enum-multi', field:'scribe certainty' },
    { key:'scribe_role', label:'Scribe role (from relationships)', type:'relationship-enum-multi', field:'Scribe role' },
    { key:'function_copying', label:'Function of copying (from relationships)', type:'relationship-enum-multi', field:'Function of Copying' },
    { key:'text_language_rel', label:'Text language (from relationships)', type:'relationship-enum-multi', field:'Text Language(s)' },
    { key:'text_dialect_rel', label:'Text dialect (from relationships)', type:'relationship-enum-multi', field:'Text Dialect(s)' },
    { key:'expression_rel', label:'Expression (from relationships)', type:'relationship-enum-search', field:'Expression' },
    { key:'style_rel', label:'Style (from relationships)', type:'relationship-enum-multi', field:'Style' },
    { key:'colophon_presence', label:'Colophon presence', type:'enum', field:'Colophon presence' },
    { key:'colophon_language', label:'Colophon language', type:'enum-multi', field:'Colophon language' },
    { key:'watermark', label:'Watermark present', type:'related-record-enum', relatedEntity:'pu', field:'Watermark Present' },
    { key:'decoration', label:'Decoration presence', type:'related-record-enum', relatedEntity:'pu', field:'Decoration Presence' },
    { key:'music', label:'Musical notation presence', type:'related-record-enum', relatedEntity:'pu', field:'Musical Notation Presence' },
  ],
  ms: [
    { key:'holding', label:'Holding Institution', type:'resource', field:'Holding Institution' },
    { key:'callno', label:'Call number', type:'text', field:'Call number' },
    { key:'ms_date', label:'Ms Dating (YYYY)', type:'year-range', field:'Ms Dating' },
    { key:'country', label:'Holding country', type:'related-record-search', relatedEntity:'hi', field:'Country' },
    { key:'city', label:'Holding city', type:'related-record-search', relatedEntity:'hi', field:'City' },
    { key:'Watermark', label:'Watermark Present', type:'related-record-enum', relatedEntity:'pu', field:'Watermark Present' },
    { key:'watermark_id', label:'Watermark identification', type:'text', field:'Watermark Identification' },
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
    { key:'region', label:'Region', type:'enum-search', field:'PU region' },
    { key:'manuscript', label:'Manuscript', type:'resource', field:'Manuscript' },
    { key:'monastery', label:'Monastic Institution', type:'resource', field:'Monastic Institution' },
    { key:'material',label:'Material',type:'enum', field:'Material' },
    { key:'century', label:'Century', type:'century', field:'Normalized century of production' },
    { key:'post',    label:'Post quem', type:'year-range', field:'Normalized terminus post quem' },
    { key:'ante',    label:'Ante quem', type:'year-range', field:'Normalized terminus ante quem' },
    { key:'pu_dating', label:'PU dating', type:'text', field:'PU dating' },
    { key:'text_language_rel', label:'Text language (from relationships)', type:'relationship-enum-multi', field:'Text Language(s)' },
    { key:'text_dialect_rel', label:'Text dialect (from relationships)', type:'relationship-enum-multi', field:'Text Dialect(s)' },
    { key:'expression_rel', label:'Expression (from relationships)', type:'relationship-enum-search', field:'Expression' },
    { key:'style_rel', label:'Style (from relationships)', type:'relationship-enum-multi', field:'Style' },
    { key:'colophon_presence', label:'Colophon presence', type:'enum', field:'Colophon Presence' },
    { key:'colophon_language', label:'Colophon language', type:'enum-multi', field:'Colophon language' },
    { key:'musical_notation', label:'Musical Notation Presence', type:'enum', field:'Musical Notation Presence' },
    { key:'decoration', label:'Decoration Presence', type:'enum', field:'Decoration Presence' },
    { key:'Watermark', label:'Watermark Present', type:'enum-multi', field:'Watermark Present' },
    { key:'folios', label:'Folios', type:'num-range', field:'Number of Folios' },
    { key:'text_h', label:'Text block height', type:'num-range', field:'Text block height' },
    { key:'text_w', label:'Text block width',  type:'num-range', field:'Text block width' },
    { key:'ruling', label:'Ruling',  type:'enum-multi', field:'ruling_type' },
    { key:'catchwords', label:'Catchwords Presence',  type:'enum-multi', field:'catchwords' },
    { key:'signatures', label:'Signatures Presence',  type:'enum-multi', field:'signatures' },
    { key:'Quire types', label:'Quires',  type:'enum-multi', field:'Quire types' },
    { key:'columns', label:'Number of columns', type:'num-range', field:'Number of Columns' },
    { key:'min_lines', label:'Minimum lines', type:'num-range', field:'min_lines' },
    { key:'max_lines', label:'Maximum lines', type:'num-range', field:'max_lines' },
  ],
  hi: [
    { key:'country', label:'Country', type:'enum-search', field:'Country' },
    { key:'city',    label:'City',    type:'enum-search', field:'City' },
    { key:'itype',   label:'Institution type', type:'enum', field:'Institution type' },
    { key:'geonames', label:'GeoNames', type:'text', field:'GeoNames' },
  ],
  mi: [
    { key:'country', label:'Country', type:'enum-search', field:'Country' },
    { key:'city',    label:'City',    type:'enum-search', field:'City' },
    { key:'order',   label:'Religious order', type:'enum-search', field:'Religious order' },
    { key:'mtype',   label:'Type of monastery', type:'enum', field:'Type of institution' },
    { key:'rule', label:'Rule', type:'enum-search', field:'Rule' },
    { key:'form', label:'Form of life', type:'enum', field:'Form of life' },
    { key:'movement', label:'Movement / Reform / Observance', type:'enum-search', field:'Movement / Reform / Observance' },
    { key:'created', label:'Creation year', type:'year-range', field:'Creation date' },
    { key:'supp',    label:'Suppression year', type:'year-range', field:'Suppression date' },
    { key:'reform', label:'Reform year', type:'year-range', field:'Reform date' },
    { key:'geonames', label:'GeoNames', type:'text', field:'GeoNames' },
  ],
  hp: [
    { key:'gender',  label:'Gender', type:'enum', field:'Gender' },
    { key:'gcert',   label:'Gender certainty', type:'enum', field:'Gender certainty' },
    { key:'ptype', label:'Person type', type:'enum', field:'Person type' },
    { key:'status', label:'Religious / lay status', type:'enum', field:'Religious or Lay Status' },
    { key:'activity',   label:'Century of Activity', type:'century', field:'Century of Activity' },
    { key:'birth', label:'Birth year', type:'year-range', field:'Normalized Date of Birth' },
    { key:'death', label:'Death year', type:'year-range', field:'Normalized Date of Death' },
    { key:'wikidata', label:'Wikidata', type:'text', field:'Wikidata' },
    { key:'viaf', label:'VIAF', type:'text', field:'VIAF' },
    { key:'scribe_role_rel', label:'Scribe role (from relationships)', type:'relationship-enum-multi', field:'Scribe role' },
    { key:'scribe_certainty_rel', label:'Scribe certainty (from relationships)', type:'relationship-enum-multi', field:'scribe certainty' },
  ],
  tx: [
    { key:'genre',   label:'Genre', type:'enum', field:'Genre' },
    { key:'subgenre',label:'Subgenre', type:'enum-search', field:'Subgenre' },
    { key:'ntitle',  label:'Normalized Title', type:'enum-search', field:'Normalized Title' },
    { key:'language', label:'Language of Text', type:'enum-multi', field:'Language of Text' },
    { key:'author',  label:'Author', type:'related-record-search', relatedEntity:'hp', field:'$title' },
    { key:'expression_rel', label:'Expression (from relationships)', type:'relationship-enum-search', field:'Expression' },
    { key:'text_language_rel', label:'Text language (from relationships)', type:'relationship-enum-multi', field:'Text Language(s)' },
    { key:'style_rel', label:'Style (from relationships)', type:'relationship-enum-multi', field:'Style' },
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
  hp: { title: r => r.rec_Title || ('Person '+r.rec_ID), gender: r => getVal(r,'Gender'), gcert:  r => getVal(r,'Gender certainty'), ptype:  r => getVal(r,'Person type'), viaf: r => getVal(r,'VIAF'), wikidata: r => getVal(r,'Wikidata'), flat },
  tx: { title: r => r.rec_Title || ('Text '+r.rec_ID), ntitle: r => getVal(r,'Normalized Title'), genre:  r => getVal(r,'Genre'), sub:    r => getVal(r,'Subgenre'), flat },
};

/* ---------- Advanced graph search ---------- */
const ENTITY_LABELS = {
  ms: 'Manuscripts',
  pu: 'Production Units',
  su: 'Scribal Units',
  hi: 'Holding Institutions',
  mi: 'Monastic Institutions',
  hp: 'Historical People',
  tx: 'Texts',
  rel: 'Relationship Metadata'
};
const RESULT_ENTITY_TYPES = ['ms', 'pu', 'su', 'hi', 'mi', 'hp', 'tx'];
const CONDITION_ENTITY_TYPES = ['ms', 'pu', 'su', 'hi', 'mi', 'hp', 'tx', 'rel'];
const ADVANCED_OPERATORS = [
  ['contains', 'contains'],
  ['equals', 'equals'],
  ['not_contains', 'does not contain'],
  ['present', 'is present'],
  ['empty', 'is empty'],
  ['before', 'date/year before'],
  ['after', 'date/year after'],
  ['between', 'date/year between']
];
let advancedSearchActive = false;
let advancedFieldCache = {};
let relatedRecordCache = new Map();

function resetAdvancedCaches(){
  advancedFieldCache = {};
  relatedRecordCache = new Map();
}

function fieldLabel(field){
  if (field === '__all') return 'All fields';
  if (field === '__title') return 'Title';
  return LABEL_RENAMES[field] || field;
}

function fieldsForEntity(type){
  if (advancedFieldCache[type]) return advancedFieldCache[type];
  const fields = new Set(['__all', '__title']);
  (DATA[type] || []).forEach(rec => {
    (rec.details || []).forEach(d => {
      const name = (d.fieldName || '').trim();
      if (name && !HIDE_FIELDS.has(name)) fields.add(name);
    });
  });
  advancedFieldCache[type] = Array.from(fields)
    .sort((a, b) => fieldLabel(a).localeCompare(fieldLabel(b)));
  return advancedFieldCache[type];
}

function isOpenTextField(field){
  return /comment|transcription|translation|description|note|manifest|link|url|identifier|(^|_)id$|dating|date|year/i.test(field);
}

function detailValueString(d){
  if (!d) return '';
  if (d.termLabel) return String(d.termLabel);
  if (d.value && typeof d.value === 'object' && d.value.title) return String(d.value.title);
  if (typeof d.value === 'string' || typeof d.value === 'number' || typeof d.value === 'boolean') return String(d.value);
  return '';
}

function controlledOptionsForField(type, field){
  if (!type || !field || field === '__all' || field === '__title') return null;
  const options = new Set();
  let controlledSignal = false;

  (DATA[type] || []).forEach(rec => {
    getDetailsAll(rec, field).forEach(d => {
      if (d.termLabel || (d.value && typeof d.value === 'object' && d.value.title)) controlledSignal = true;
      const value = detailValueString(d).trim();
      if (value && value !== '—') options.add(value);
    });
  });

  const values = Array.from(options).sort((a, b) => a.localeCompare(b));
  if (!values.length) return null;
  const looksEnumerated = values.length <= 80 && values.every(v => v.length <= 80);
  if (controlledSignal || (looksEnumerated && !isOpenTextField(field))) return values;
  return null;
}

function recordKey(type, id){
  return `${type}:${String(id)}`;
}

function inferRecordType(rec){
  if (!rec) return null;
  if (String(rec.rec_RecTypeID || '') === '1') return 'rel';
  return REC_TYPE_TO_ENTITY[String(rec.rec_RecTypeID)] || null;
}

function addGraphNeighbor(map, type, id, rec){
  if (!type || !id || !rec) return;
  map.set(recordKey(type, id), { type, rec });
}

function getGraphNeighbors(type, rec){
  const neighbors = new Map();

  (rec.details || []).forEach(d => {
    const v = d?.value;
    if (v && typeof v === 'object' && v.id && v.type) {
      const toType = REC_TYPE_TO_ENTITY[String(v.type)];
      addGraphNeighbor(neighbors, toType, v.id, IDX[toType]?.[String(v.id)]);
    }
  });

  (INBOUND[type]?.[String(rec.rec_ID)] || []).forEach(ptr => {
    addGraphNeighbor(neighbors, ptr.fromType, ptr.fromId, IDX[ptr.fromType]?.[String(ptr.fromId)]);
  });

  const recId = String(rec.rec_ID);
  const rels = type === 'rel' ? [rec] : [
    ...(REL_INDEX.bySource[recId] || []),
    ...(REL_INDEX.byTarget[recId] || [])
  ];

  rels.forEach(rel => {
    if (type !== 'rel') addGraphNeighbor(neighbors, 'rel', rel.rec_ID, rel);
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const srcType = REC_TYPE_TO_ENTITY[String(src?.type)];
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt?.type)];
    if (srcType) addGraphNeighbor(neighbors, srcType, src.id, IDX[srcType]?.[String(src.id)]);
    if (tgtType) addGraphNeighbor(neighbors, tgtType, tgt.id, IDX[tgtType]?.[String(tgt.id)]);
  });

  return Array.from(neighbors.values());
}

function getConnectedRecords(rootType, rec, targetType, maxDepth = 3){
  if (!rec) return [];
  if (rootType === targetType) return [rec];
  const cacheKey = `${rootType}:${rec.rec_ID}:${targetType}:${maxDepth}`;
  if (relatedRecordCache.has(cacheKey)) return relatedRecordCache.get(cacheKey);

  const found = [];
  const seen = new Set([recordKey(rootType, rec.rec_ID)]);
  let frontier = [{ type: rootType, rec, depth: 0 }];

  while (frontier.length) {
    const next = [];
    frontier.forEach(node => {
      if (node.depth >= maxDepth) return;
      getGraphNeighbors(node.type, node.rec).forEach(neighbor => {
        const key = recordKey(neighbor.type, neighbor.rec.rec_ID);
        if (seen.has(key)) return;
        seen.add(key);
        if (neighbor.type === targetType) found.push(neighbor.rec);
        next.push({ ...neighbor, depth: node.depth + 1 });
      });
    });
    frontier = next;
  }

  const deduped = uniqBy(found, r => String(r.rec_ID));
  relatedRecordCache.set(cacheKey, deduped);
  return deduped;
}

function valueTextsForField(rec, field){
  if (!rec) return [];
  if (field === '__title') return [rec.rec_Title || ''];
  if (field === '__all') {
    const type = inferRecordType(rec);
    return [type && MAP[type]?.flat ? MAP[type].flat(rec) : flat(rec)];
  }
  return getValsAll(rec, field);
}

function valueTextForField(rec, field){
  return valueTextsForField(rec, field).join(' ');
}

function numericYearForValue(value){
  const year = firstYear(value);
  if (year != null) return year;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function recordMatchesAdvancedCondition(rec, condition){
  const values = valueTextsForField(rec, condition.field).map(v => String(v || '').toLowerCase());
  const haystack = values.join(' ');
  const needle = String(condition.value || '').trim().toLowerCase();
  const op = condition.operator || 'contains';

  if (op === 'present') return values.some(v => v.trim().length > 0);
  if (op === 'empty') return values.every(v => v.trim().length === 0);
  if (!needle && !['present', 'empty'].includes(op)) return true;
  if (op === 'contains') return values.some(v => v.includes(needle));
  if (op === 'equals') return values.some(v => v === needle);
  if (op === 'not_contains') return values.every(v => !v.includes(needle));

  const actualYear = numericYearForValue(value);
  if (actualYear == null) return false;
  if (op === 'before') return actualYear <= parseFloat(needle);
  if (op === 'after') return actualYear >= parseFloat(needle);
  if (op === 'between') {
    const parts = needle.split(/\s*(?:,|\.{2}|-|to)\s*/i).map(parseFloat).filter(Number.isFinite);
    if (parts.length < 2) return false;
    return actualYear >= Math.min(parts[0], parts[1]) && actualYear <= Math.max(parts[0], parts[1]);
  }
  return haystack.includes(needle);
}

function readAdvancedConditions(){
  if (!$advancedList) return [];
  return [...$advancedList.querySelectorAll('.advanced-condition')].map(row => ({
    entity: row.querySelector('.condition-entity')?.value || ENTITY,
    field: row.querySelector('.condition-field')?.value || '__all',
    operator: row.querySelector('.condition-operator')?.value || 'contains',
    value: row.querySelector('.condition-value')?.value || ''
  })).filter(c => c.entity && c.field);
}

function conditionIsMeaningful(condition){
  return ['present', 'empty'].includes(condition.operator) || String(condition.value || '').trim().length > 0;
}

function recordMatchesAdvancedSearch(rec, rootType, conditions, matchMode){
  const meaningful = conditions.filter(conditionIsMeaningful);
  if (!meaningful.length) return true;
  const checks = meaningful.map(condition => {
    const candidates = getConnectedRecords(rootType, rec, condition.entity, 3);
    return candidates.some(candidate => recordMatchesAdvancedCondition(candidate, condition));
  });
  return matchMode === 'any' ? checks.some(Boolean) : checks.every(Boolean);
}

function applyAdvancedSearch(list){
  if (!advancedSearchActive) return list;
  const conditions = readAdvancedConditions();
  if (!conditions.some(conditionIsMeaningful)) return list;
  const matchMode = $advancedMatchMode?.value || 'all';
  return list.filter(rec => recordMatchesAdvancedSearch(rec, ENTITY, conditions, matchMode));
}

function populateAdvancedSelect(select, options, selected){
  if (!select) return;
  select.innerHTML = '';
  options.forEach(([value, label]) => {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    if (value === selected) opt.selected = true;
    select.appendChild(opt);
  });
}

function updateConditionValueControl(row, selectedValue = ''){
  const entity = row.querySelector('.condition-entity')?.value || ENTITY;
  const field = row.querySelector('.condition-field')?.value || '__all';
  const oldControl = row.querySelector('.condition-value');
  if (!oldControl) return;

  const vocab = controlledOptionsForField(entity, field);
  let nextControl;
  if (vocab && vocab.length) {
    nextControl = document.createElement('select');
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Select a value';
    nextControl.appendChild(blank);
    vocab.forEach(value => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      nextControl.appendChild(opt);
    });
  } else {
    nextControl = document.createElement('input');
    nextControl.type = 'search';
    nextControl.placeholder = 'Value, word, date, or range';
  }

  nextControl.className = 'condition-value';
  nextControl.setAttribute('aria-label', 'Condition value');
  nextControl.value = selectedValue || oldControl.value || '';
  oldControl.replaceWith(nextControl);
}

function populateConditionFields(row, selected, selectedValue = ''){
  const entity = row.querySelector('.condition-entity')?.value || ENTITY;
  const fieldSelect = row.querySelector('.condition-field');
  const options = fieldsForEntity(entity).map(field => [field, fieldLabel(field)]);
  populateAdvancedSelect(fieldSelect, options, selected && fieldsForEntity(entity).includes(selected) ? selected : '__all');
  updateConditionValueControl(row, selectedValue);
}

function addAdvancedCondition(condition = {}){
  if (!$advancedList) return;
  const row = document.createElement('div');
  row.className = 'advanced-condition';
  row.innerHTML = `
    <select class="condition-entity" aria-label="Condition entity"></select>
    <select class="condition-field" aria-label="Condition field"></select>
    <select class="condition-operator" aria-label="Condition operator"></select>
    <input class="condition-value" type="search" aria-label="Condition value" placeholder="Value, word, date, or range" />
    <button class="chip condition-remove" type="button" aria-label="Remove condition">Remove</button>
  `;
  populateAdvancedSelect(
    row.querySelector('.condition-entity'),
    CONDITION_ENTITY_TYPES.map(type => [type, ENTITY_LABELS[type]]),
    condition.entity || ENTITY
  );
  populateAdvancedSelect(row.querySelector('.condition-operator'), ADVANCED_OPERATORS, condition.operator || 'contains');
  populateConditionFields(row, condition.field, condition.value);
  row.querySelector('.condition-value').value = condition.value || '';
  $advancedList.appendChild(row);
}

function updateAdvancedStatus(){
  if (!$advancedStatus) return;
  if (!advancedSearchActive) {
    $advancedStatus.textContent = '';
    return;
  }
  const count = readAdvancedConditions().filter(conditionIsMeaningful).length;
  $advancedStatus.textContent = count ? `Advanced search active: ${count} condition${count === 1 ? '' : 's'}` : '';
}

function setAdvancedSearchActive(active){
  advancedSearchActive = active;
  $btnAdvanced?.classList.toggle('is-on', active);
  updateAdvancedStatus();
}

function initAdvancedSearchUI(){
  if (!$advancedPanel) return;
  populateAdvancedSelect(
    $advancedResultType,
    RESULT_ENTITY_TYPES.map(type => [type, ENTITY_LABELS[type]]),
    ENTITY
  );
  if (!$advancedList.children.length) addAdvancedCondition({ entity: ENTITY });
}

/* ---------- Facets UI ---------- */
function buildFacets(records, config, prevState = {}) {
  $mount.innerHTML = '';
  config.forEach(f=>{
    const box=document.createElement('div'); box.className='facet';
    const title=document.createElement('div'); title.className='facet-title'; title.textContent=f.label;
    box.appendChild(title);

    if (f.type==='enum') {
      // Multi-select: Use checkboxes instead of single-select chips
      const counts={}; records.forEach(r=>{ const v=getValAny(r,f.field); if (!v||v==='—') return; counts[v]=(counts[v]||0)+1; });
      const wrap=document.createElement('div'); wrap.className='check-list';
      const values = Object.keys(counts).sort((a, b) => {
        if (!f.presence) return a.localeCompare(b);
        const order = { true: 0, false: 1, unknown: 2 };
        return (order[a.toLowerCase()] ?? 99) - (order[b.toLowerCase()] ?? 99);
      });
      values.forEach(v=>{
        const lab=document.createElement('label'); lab.className='check-item';
        const cb=document.createElement('input'); cb.type='checkbox'; cb.dataset.fkey=f.key; cb.value=v;
        if (prevState[f.key]?.values?.has(v)) cb.checked=true;
        const displayValue = f.presence
          ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
          : v;
        lab.appendChild(cb); lab.append(` ${displayValue} (${counts[v]||0})`);
        wrap.appendChild(lab);
      });
      box.appendChild(wrap);

    } else if (f.type==='enum-search') {
      const counts = {};
      records.forEach(r => getValsAny(r, f.field).forEach(v => {
        if (!v || v === '—') return;
        counts[v] = (counts[v] || 0) + 1;
      }));
      const options = Object.keys(counts).sort();
      const wrap = document.createElement('div'); wrap.className = 'range';
      const select = document.createElement('select'); select.dataset.fkey=f.key;
      const placeholder = document.createElement('option'); placeholder.value=''; placeholder.textContent='All options'; select.appendChild(placeholder);
      options.forEach(opt=>{ const o=document.createElement('option'); o.value=opt; o.textContent=`${opt} (${counts[opt]})`; select.appendChild(o); });
      select.value = options.find(opt => opt.toLowerCase() === (prevState[f.key]?.q || '')) || '';
      wrap.appendChild(select); box.appendChild(wrap);

    } else if (f.type==='enum-multi' || f.type==='century') {
      const counts = {};
      records.forEach(r => {
        const values = getValsAny(r, f.field);
        values.forEach(v => {
          if (!v || v === '—') return;
          counts[v] = (counts[v] || 0) + 1;
        });
      });
      const wrap = document.createElement('div'); wrap.className='check-list';
      Object.keys(counts)
        .sort((a,b) => {
          if (f.presence) {
            const order = { true: 0, false: 1, unknown: 2 };
            return (order[a.toLowerCase()] ?? 99) - (order[b.toLowerCase()] ?? 99);
          }
          const numeric = parseInt(a) - parseInt(b);
          return Number.isNaN(numeric) ? a.localeCompare(b) : numeric;
        })
        .forEach(v=>{
          const lab=document.createElement('label'); lab.className='check-item';
          const cb=document.createElement('input'); cb.type='checkbox'; cb.dataset.fkey=f.key; cb.value=v;
          if (prevState[f.key]?.values?.has(v)) cb.checked=true;
          const displayValue = f.presence
            ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
            : v;
          lab.appendChild(cb); lab.append(` ${displayValue} (${counts[v]||0})`);
          wrap.appendChild(lab);
        });
      box.appendChild(wrap);

    } else if (f.type==='relationship-enum-multi') {
      // Build facets from relationship metadata
      const counts = {};
      records.forEach(r => {
        const values = getRelationshipValues(r.rec_ID, f.field);
        values.forEach(v => {
          if (!v || v === '—') return;
          counts[v] = (counts[v] || 0) + 1;
        });
      });
      const wrap = document.createElement('div'); wrap.className='check-list';
      Object.keys(counts)
        .sort()
        .forEach(v=>{
          const lab=document.createElement('label'); lab.className='check-item';
          const cb=document.createElement('input'); cb.type='checkbox'; cb.dataset.fkey=f.key; cb.value=v;
          if (prevState[f.key]?.values?.has(v)) cb.checked=true;
          lab.appendChild(cb); lab.append(` ${v} (${counts[v]||0})`);
          wrap.appendChild(lab);
        });
      box.appendChild(wrap);

    } else if (f.type==='related-record-enum') {
      const counts = {};
      records.forEach(record => {
        getRelatedRecordValues(record.rec_ID, f.relatedEntity, f.field).forEach(value => {
          if (!value || value === '—') return;
          counts[value] = (counts[value] || 0) + 1;
        });
      });
      const order = { false: 0, true: 1, unknown: 2 };
      const wrap = document.createElement('div'); wrap.className='check-list';
      Object.keys(counts)
        .sort((a, b) => (order[a.toLowerCase()] ?? 99) - (order[b.toLowerCase()] ?? 99))
        .forEach(value => {
          const label = document.createElement('label'); label.className='check-item';
          const checkbox = document.createElement('input'); checkbox.type='checkbox'; checkbox.dataset.fkey=f.key; checkbox.value=value;
          if (prevState[f.key]?.values?.has(value)) checkbox.checked=true;
          label.appendChild(checkbox); label.append(` ${value} (${counts[value]})`);
          wrap.appendChild(label);
        });
      box.appendChild(wrap);

    } else if (f.type==='related-record-search') {
      const counts = {};
      records.forEach(record => {
        getRelatedRecordValues(record.rec_ID, f.relatedEntity, f.field).forEach(value => {
          if (!value || value === '—') return;
          counts[value] = (counts[value] || 0) + 1;
        });
      });
      const options = Object.keys(counts).sort((a, b) => a.localeCompare(b));
      const wrap = document.createElement('div'); wrap.className='range';
      const select = document.createElement('select'); select.dataset.fkey=f.key;
      const placeholder = document.createElement('option'); placeholder.value=''; placeholder.textContent='All options'; select.appendChild(placeholder);
      options.forEach(value => {
        const option = document.createElement('option'); option.value=value; option.textContent=`${value} (${counts[value]})`; select.appendChild(option);
      });
      select.value = options.find(value => value.toLowerCase() === (prevState[f.key]?.q || '')) || '';
      wrap.appendChild(select); box.appendChild(wrap);

    } else if (f.type==='relationship-enum-search') {
      const counts = {};
      records.forEach(r => {
        const values = getRelationshipValues(r.rec_ID, f.field);
        values.forEach(v => {
          if (!v || v === '—') return;
          counts[v] = (counts[v] || 0) + 1;
        });
      });
      const options = Object.keys(counts).sort();
      const wrap = document.createElement('div'); wrap.className = 'range';
      const select = document.createElement('select'); select.dataset.fkey=f.key;
      const placeholder = document.createElement('option'); placeholder.value=''; placeholder.textContent='All options'; select.appendChild(placeholder);
      options.forEach(opt=>{ const o=document.createElement('option'); o.value=opt; o.textContent=`${opt} (${counts[opt]})`; select.appendChild(o); });
      select.value = options.find(opt => opt.toLowerCase() === (prevState[f.key]?.q || '')) || '';
      wrap.appendChild(select); box.appendChild(wrap);

    } else if (f.type==='year-range' || f.type==='num-range') {
      const vals = records.map(r=>{
        if (f.type==='year-range') return firstYear(getValAny(r,f.field));
        const d=getDetailsAny(r,f.field)[0]; const n=parseFloat(val(d)); return isNaN(n)?null:n;
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
}
function readFacetState(config){
  const st={};
  config.forEach(f=>{
    if (f.type==='enum'){
      // Now using checkboxes for multi-select
      const onCbs=[...document.querySelectorAll(`input[type="checkbox"][data-fkey="${f.key}"]:checked`)].map(n=>n.value);
      st[f.key]={type:f.type, values:new Set(onCbs)};
    } else if (f.type==='enum-multi' || f.type==='century' || f.type==='relationship-enum-multi' || f.type==='related-record-enum'){
      const onCbs=[...document.querySelectorAll(`input[type="checkbox"][data-fkey="${f.key}"]:checked`)].map(n=>n.value);
      st[f.key]={type:f.type, values:new Set(onCbs)};
    } else if (f.type==='year-range' || f.type==='num-range'){
      const [min,max]=[...document.querySelectorAll(`.range input[data-fkey="${f.key}"]`)].map(i=>i.value);
      st[f.key]={type:f.type, min:min?parseFloat(min):null, max:max?parseFloat(max):null};
    } else if (f.type==='text' || f.type==='resource' || f.type==='enum-search' || f.type==='relationship-enum-search' || f.type==='related-record-search'){
      const input=document.querySelector(`[data-fkey="${f.key}"]`);
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
        // Multi-select: record must have one of the selected values
        if (s.values.size) {
          const v=getValAny(rec,f.field);
          if (!s.values.has(v)) return false;
        }
      } else if (f.type==='enum-multi' || f.type==='century'){
        const values = getValsAny(rec, f.field);
        // if there are selected values, the record must have at least one of them
        if (s.values.size && !values.some(v => s.values.has(v))) return false;
      } else if (f.type==='relationship-enum-multi'){
        // Filter based on relationship metadata
        const values = getRelationshipValues(rec.rec_ID, f.field);
        // if there are selected values, the record must have at least one of them
        if (s.values.size && !values.some(v => s.values.has(v))) return false;
      } else if (f.type==='related-record-enum'){
        const values = getRelatedRecordValues(rec.rec_ID, f.relatedEntity, f.field);
        if (s.values.size && !values.some(v => s.values.has(v))) return false;
      } else if (f.type==='related-record-search'){
        const q=s.q;
        if (q) {
          const values = getRelatedRecordValues(rec.rec_ID, f.relatedEntity, f.field);
          if (!values.some(value => value.toLowerCase() === q)) return false;
        }
      } else if (f.type==='relationship-enum-search'){
        const q=s.q; if (q){
          const values = getRelationshipValues(rec.rec_ID, f.field);
          if (!values.join(' ').toLowerCase().includes(q)) return false;
        }
      } else if (f.type==='year-range'){
        const y = firstYear(getValAny(rec,f.field));
        if (s.min!=null && y!=null && y < s.min) return false;
        if (s.max!=null && y!=null && y > s.max) return false;
      } else if (f.type==='num-range'){
        const d = getDetailsAny(rec,f.field)[0]; const n = parseFloat(val(d));
        if (isNaN(n)) continue;
        if (s.min!=null && n < s.min) return false;
        if (s.max!=null && n > s.max) return false;
      } else if (f.type==='text'){
        const q=s.q; if (q && getValsAny(rec,f.field).join(' ').toLowerCase().indexOf(q)===-1) return false;
      } else if (f.type==='resource' || f.type==='enum-search'){
        const q=s.q; if (q){
          const res = fieldNames(f.field).map(name => getRes(rec, name)).find(Boolean);
          const t = (res?.title || getValAny(rec,f.field) || '').toLowerCase();
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
  // Switch to browse mode first if we're in a different mode
  if (ACTIVE_MODE !== 'browse') {
    setMode('browse');
  }
  
  // External navigation should always land on the target record, not a stale filter state.
  ENTITY = type;
  document.querySelectorAll('#entity-switch .entity-btn').forEach(c=>c.classList.toggle('is-on', c.dataset.entity===type));
  $search.value=''; $field.value=''; $sort.value='';
  page=1;
  
  // Rebuild facets before rendering the selected record.
  const cfg = FACETS[type];
  const browseList = computeList();
  buildFacets(browseList, cfg, {});
  updateAvailableViews();
  
  // Now render with the selected record
  const selIndex = indexOfRecord(browseList, id);
  if (selIndex >= 0) page = Math.floor(selIndex / pageSize) + 1;
  render(browseList, type, String(id));
}

// Expose jumpTo to window for onclick handlers
window.jumpTo = jumpTo;

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

function renderDirectPointers(rec, type){
  const recId = String(rec.rec_ID);
  const outgoing = [];
  (rec.details || []).forEach(d => {
    const v = d?.value;
    if (!v || typeof v !== 'object' || !v.id || !v.type) return;
    const toType = REC_TYPE_TO_ENTITY[String(v.type)];
    if (!toType || !IDX[toType]?.[String(v.id)]) return;
    outgoing.push({
      fieldName: d.fieldName || 'Linked record',
      type: toType,
      id: String(v.id),
      title: MAP[toType]?.title(IDX[toType][String(v.id)]) || v.title || String(v.id),
    });
  });

  const incoming = (INBOUND[type]?.[recId] || [])
    .map(link => {
      const source = IDX[link.fromType]?.[String(link.fromId)];
      if (!source) return null;
      return {
        fieldName: link.fieldName || 'Linked record',
        type: link.fromType,
        id: String(link.fromId),
        title: MAP[link.fromType]?.title(source) || link.fromTitle || String(link.fromId),
      };
    })
    .filter(Boolean);

  const unique = items => uniqBy(items, item => `${item.type}:${item.id}:${item.fieldName}`);
  let html = '';
  const renderGroup = (title, items) => {
    const links = uniqBy(unique(items), item => `${item.type}:${item.id}`);
    const out = links.slice(0,200)
      .map(item => `<div>${linkTo(item.type, item.id, item.title)}</div>`)
      .join('');
    return out ? `<div class="section"><strong>${esc(title)}</strong>${out}</div>` : '';
  };

  html += renderGroup('Direct pointers from this record', outgoing);
  // Holding institutions already render the same incoming manuscript links in
  // the purpose-built "Manuscripts at this institution" section below.
  if (type !== 'hi') {
    html += renderGroup('Records that point to this record', incoming);
  }
  return html;
}

/* Hide these field labels in the Details panel */
const HIDE_FIELDS = new Set([
  'Cataloguing',
  'Seen in Person',
]);

const LABEL_RENAMES = {
  'Normalized terminus post quem': 'Terminus post quem',
  'Normalized terminus ante quem': 'Terminus ante quem',
  'Normalised script(s)': 'Script(s)',
  'viaf_id': 'VIAF',
  'gnd_id': 'GND',
  'geonames_id': 'GeoNames',
  'isni_id': 'ISNI',
  'bnf_id': 'BnF',
  'loc_id': 'LoC',
  'Bibliothèque nationale de France ID': 'BnF',
  'GND ID': 'GND',
  'Library of Congress authority ID': 'LoC'
};

/* Order the Details fields per entity into logical sections.
   List each fieldName EXACTLY as it appears in the JSON data
   (can be renamed via LABEL_RENAMES). */
const SECTIONED_FIELDS = {
  su: [
    { title: "Manuscript & Extent", fields: ['Manuscript', 'Extent', 'Folio range', 'Folio range in PU', 'Extent comments'] },
    { title: "Dating", fields: ['SU dating', 'Normalized century of production', 'Normalized terminus post quem', 'Normalized terminus ante quem', 'Dating Comments'] },
    { title: "Script & Hand", fields: ['Normalised script(s)', 'Script Comments', 'Scribe Comments'] },
    { title: "Textual Contents", fields: ['Text Language(s)', 'Text Dialect(s)', 'Expression', 'Style', 'Text(s) comments'] },
    { title: "Colophon", fields: ['Colophon presence', 'Colophon language', 'Colophon transcription', 'Colophon translation', 'Colophon comments'] },
    { title: "Production Context", fields: ['PU dating', 'PU country', 'PU region', 'PU City', 'Monastic Institution', 'PU Comments', 'Scriptorium Comments'] },
    { title: "Codicology & Features", fields: ['Material', 'Watermark Present', 'watermark', 'Watermark Identification', 'Musical Notation Presence', 'Musical Notation Comments', 'Decoration Presence', 'Decoration Comments', 'Codicology comments', 'Comments'] },
    { title: "Linked Data", fields: ['viaf_id', 'gnd_id', 'geonames_id', 'isni_id', 'bnf_id', 'loc_id', 'VIAF', 'Wikidata', 'Bibliothèque nationale de France ID', 'GND ID', 'ISNI', 'Library of Congress authority ID', 'Geonames'] }
  ],
  ms: [
    { title: "Holding & Shelfmark", fields: ['Holding Institution', 'Call number', 'Country', 'City'] },
    { title: "Dating", fields: ['Ms Dating', 'Dating Comments'] },
    { title: "Physical Description", fields: ['Number of folios', 'Codex height', 'Codex width', 'Watermark Present', 'watermark', 'Watermark Identification', 'Codicology comments', 'Comments'] },
    { title: "Digitization & Access", fields: ['Digitization Status', 'Digitization Type', 'IIIF Status', 'Catalogue Record Link(s)', 'Digitization link(s)', 'IIIF Manifest Link(s)', 'Digitization Comments'] },
    { title: "Linked Data", fields: ['viaf_id', 'gnd_id', 'geonames_id', 'isni_id', 'bnf_id', 'loc_id', 'VIAF', 'Wikidata', 'Bibliothèque nationale de France ID', 'GND ID', 'ISNI', 'Library of Congress authority ID', 'Geonames'] }
  ],
  pu: [
    { title: "Manuscript & Extent", fields: ['Manuscript', 'Extent', 'Folio range', 'Folio range in PU', 'Extent comments'] },
    { title: "Location & Dating", fields: ['Material', 'PU dating', 'Normalized century of production', 'Normalized terminus post quem', 'Normalized terminus ante quem', 'Dating Comments', 'PU country', 'PU region', 'PU City', 'PU Latitude', 'PU Longitude', 'Monastic Institution', 'PU Comments'] },
    { title: "Textual Contents", fields: ['Normalized Title', 'Genre', 'Subgenre', 'other titles', 'Text Language(s)', 'Text Dialect(s)', 'Expression', 'Style', 'Text(s) comments', 'Genre Comments', 'Identification comments'] },
    { title: "Colophon", fields: ['Colophon Presence', 'Colophon language', 'Colophon transcription', 'Colophon translation', 'Colophon comments'] },
    { title: "Codicology", fields: ['Number of Folios', 'Number of Quires', 'Quire types', 'collation', 'signatures', 'catchwords', 'ruling_type', 'justification : height (mm)', 'justification : width (mm)', 'Number of Columns', 'min_lines', 'max_lines', 'Codicology comments', 'Comments'] },
    { title: "Decoration, Music & Watermarks", fields: ['Watermark Present', 'watermark', 'Watermark Identification', 'Musical Notation Presence', 'Musical Notation Comments', 'Decoration Presence', 'Decoration Comments'] },
    { title: "Linked Data", fields: ['viaf_id', 'gnd_id', 'geonames_id', 'isni_id', 'bnf_id', 'loc_id', 'VIAF', 'Wikidata', 'Bibliothèque nationale de France ID', 'GND ID', 'ISNI', 'Library of Congress authority ID', 'Geonames'] }
  ],
  hi: [
    { title: "Institution", fields: ['Institution name', 'Institution type', 'Institution City', 'City', 'Website link'] },
    { title: "Location", fields: ['Country', 'Latitude', 'Longitude', 'GeoNames'] },
    { title: "Names & Notes", fields: ['Other names', 'Other name(s)', 'Name Comments', 'Identification comments', 'Comments'] },
    { title: "Linked Data", fields: ['viaf_id', 'gnd_id', 'geonames_id', 'isni_id', 'bnf_id', 'loc_id', 'VIAF', 'Wikidata', 'Bibliothèque nationale de France ID', 'GND ID', 'ISNI', 'Library of Congress authority ID', 'Geonames'] }
  ],
  hp: [
    { title: "Identity", fields: ['Name of Person', 'Other names', 'Other name(s)', 'Other name', 'Gender', 'Gender certainty', 'Person type', 'Religious or Lay Status', 'Name Comments'] },
    { title: "Life & Activity", fields: ['Century of Activity', 'activity years', 'Normalized Date of Birth', 'Place of birth', 'Country of birth', 'Normalized Date of Death', 'Place of death', 'Country of death'] },
    { title: "Biography", fields: ['Short biography', 'Biography Link', 'Personal Data Comments', 'Biography Comments', 'Comments'] },
    { title: "Linked Data", fields: ['viaf_id', 'gnd_id', 'geonames_id', 'isni_id', 'bnf_id', 'loc_id', 'VIAF', 'Wikidata', 'Bibliothèque nationale de France ID', 'GND ID', 'ISNI', 'Library of Congress authority ID', 'Geonames'] }
  ],
  mi: [
    { title: "Identity", fields: ['Monastery name', 'Other names', 'Other name(s)', 'Type of monastery', 'Type of institution', 'Religious order', 'Religious Order Certainty', 'Rule', 'Form of life', 'Name Comments'] },
    { title: "History & Observance", fields: ['Creation date', 'Suppression date', 'Reform date', 'Movement / Reform / Observance', 'Religious Information Comments'] },
    { title: "Location", fields: ['Country', 'City', 'Monastery Location', 'Latitude', 'Longitude', 'GeoNames'] },
    { title: "Scriptorium & Resources", fields: ['Monastic Matrix link', 'Website link', 'Scriptorium Comments', 'Comments'] },
    { title: "Linked Data", fields: ['viaf_id', 'gnd_id', 'geonames_id', 'isni_id', 'bnf_id', 'loc_id', 'VIAF', 'Wikidata', 'Bibliothèque nationale de France ID', 'GND ID', 'ISNI', 'Library of Congress authority ID', 'Geonames'] }
  ],
  tx: [
    { title: "Identification & Genre", fields: ['Normalized Title', 'other titles', 'Other titles', 'Genre', 'Subgenre', 'Creator', 'Language of Text', 'Genre Comments', 'Identification comments', 'Comments'] },
    { title: "Linked Data", fields: ['viaf_id', 'gnd_id', 'geonames_id', 'isni_id', 'bnf_id', 'loc_id', 'VIAF', 'Wikidata', 'Bibliothèque nationale de France ID', 'GND ID', 'ISNI', 'Library of Congress authority ID', 'Geonames'] }
  ]
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

  // Helper to render one detail to HTML
  const renderVal = (d) => {
    if (d.termLabel) return esc(d.termLabel);
    
    if (d.value && typeof d.value === 'object') {
      if (d.value.title || d.value.id) {
        const tEnt = REC_TYPE_TO_ENTITY[String(d.value.type)] || null;
        const tId  = String(d.value.id || '');
        if (tEnt && IDX[tEnt] && IDX[tEnt][tId]) return linkTo(tEnt, tId, d.value.title || tId);
        return esc(d.value.title || tId);
      }
      if (d.value.geo && d.value.geo.wkt) {
        const wkt = d.value.geo.wkt;
        const match = wkt.match(/POINT\(([\d.\-]+)\s+([\d.\-]+)\)/);
        if (match) {
          const lon = match[1], lat = match[2];
          if (d.fieldName === 'Latitude') return esc(lat);
          if (d.fieldName === 'Longitude') return esc(lon);
          return esc(`${lat}, ${lon}`);
        }
      }
      if ('value' in d.value) return esc(String(d.value.value));
      if ('lat' in d.value) return esc(String(d.value.lat));
      if ('lon' in d.value) return esc(String(d.value.lon));
      return esc(JSON.stringify(d.value));
    }
    
    // Explicitly parse URLs for VIAF, BNF, etc. if they arrive as strings
    const raw = rawValue(d);
    if (typeof raw === 'string' && /^https?:\/\//i.test(raw)){
      return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    }
    
    // Generate links manually if data just contains the raw ID without base URL
    if ((d.fieldName === 'viaf_id' || d.fieldName === 'VIAF') && raw) {
      if (/^https?:/.test(raw)) return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
      return `<a href="https://viaf.org/viaf/${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    } else if ((d.fieldName === 'gnd_id' || d.fieldName === 'GND ID') && raw) {
      if (/^https?:/.test(raw)) return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
      return `<a href="https://d-nb.info/gnd/${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    } else if ((d.fieldName === 'geonames_id' || d.fieldName === 'Geonames') && raw) {
      if (/^https?:/.test(raw)) return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
      return `<a href="https://www.geonames.org/${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    } else if ((d.fieldName === 'isni_id' || d.fieldName === 'ISNI') && raw) {
      if (/^https?:/.test(raw)) return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
      return `<a href="https://isni.org/isni/${esc(raw).replace(/\s/g, '')}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    } else if ((d.fieldName === 'bnf_id' || d.fieldName === 'Bibliothèque nationale de France ID') && raw) {
      if (/^https?:/.test(raw)) return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
      return `<a href="https://catalogue.bnf.fr/ark:/12148/${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    } else if ((d.fieldName === 'loc_id' || d.fieldName === 'Library of Congress authority ID') && raw) {
      if (/^https?:/.test(raw)) return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
      return `<a href="https://id.loc.gov/authorities/names/${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    }
    
    return esc(raw ?? '');
  };

  let html = '';
  const sections = SECTIONED_FIELDS[entity] || [];
  const seen = new Set();
  
  for (const section of sections) {
    let sectionHtml = '';
    for (const key of section.fields) {
      const matchingKeys = fieldNames(key).filter(name => byField.has(name));
      const arr = matchingKeys.flatMap(name => byField.get(name) || []);
      if (!arr || !arr.length) continue;
      const label = esc(LABEL_RENAMES[key] || key);
      for (const d of arr) {
        const valHtml = renderVal(d);
        if (valHtml) {
          sectionHtml += `<dt>${label}</dt><dd>${valHtml}</dd>`;
        }
      }
      matchingKeys.forEach(name => seen.add(name));
    }
    if (sectionHtml) {
      html += `
        <div class="detail-section-header">
          ${esc(section.title)}
        </div>
        <div class="kv">${sectionHtml}</div>
      `;
    }
  }

  // Append remaining fields
  if (INCLUDE_REST) {
    let restHtml = '';
    const rest = [...byField.keys()].filter(k => !seen.has(k)).sort((a,b)=>a.localeCompare(b));
    for (const key of rest) {
      const label = esc(LABEL_RENAMES[key] || key);
      for (const d of byField.get(key)) {
        const valHtml = renderVal(d);
        if (valHtml) {
          restHtml += `<dt>${label}</dt><dd>${valHtml}</dd>`;
        }
      }
    }
    if (restHtml) {
      html += `
        <div class="detail-section-header">
          Other Details
        </div>
        <div class="kv">${restHtml}</div>
      `;
    }
  }

  return html || '<div class="muted">No details available.</div>';
}

const RELATIONSHIP_SECTIONED_FIELDS = [
  { title: 'Scribal Attribution', fields: ['scribe certainty', 'Scribe role', 'Function of Copying', 'Production info', 'Scribe Comments'] },
  { title: 'Textual Contents', fields: ['Folio range', 'Folio range in PU', 'Text Language(s)', 'Text Dialect(s)', 'Expression', 'Style', 'Text(s) comments'] },
  { title: 'Production Context', fields: ['PU Comments'] },
];

function renderRelationshipMetadataRows(rel){
  // Source, target and relationship type are already expressed by the link and
  // its group heading; repeating them here adds no information.
  const seen = new Set(['Source record', 'Target record', 'Relationship type']);
  let html = '';
  for (const section of RELATIONSHIP_SECTIONED_FIELDS) {
    let rows = '';
    for (const key of section.fields) {
      const values = getValsAny(rel, key);
      if (!values.length) continue;
      seen.add(key);
      fieldNames(key).forEach(name => seen.add(name));
      const label = esc(LABEL_RENAMES[key] || key);
      values.forEach(value => {
        if (value) rows += `<dt>${label}</dt><dd>${esc(value)}</dd>`;
      });
    }
    if (rows) {
      html += `<div class="rel-metadata-section"><div class="kv rel-kv">${rows}</div></div>`;
    }
  }

  if (INCLUDE_REST) {
    let rows = '';
    const rest = (rel.details || [])
      .map(d => d.fieldName)
      .filter(name => name && !seen.has(name) && !HIDE_FIELDS.has(name));
    [...new Set(rest)].sort((a,b)=>a.localeCompare(b)).forEach(key => {
      const label = esc(LABEL_RENAMES[key] || key);
      getValsAny(rel, key).forEach(value => {
        if (value) rows += `<dt>${label}</dt><dd>${esc(value)}</dd>`;
      });
    });
    if (rows) html += `<div class="rel-metadata-section"><div class="kv rel-kv">${rows}</div></div>`;
  }

  return html;
}

/* ---------- Relationship helpers ---------- */
function groupByRelType(relationships) {
  const grouped = new Map();
  relationships.forEach(r => {
    const relType = normalizeRelationshipType(getVal(r, 'Relationship type'));
    
    if (!grouped.has(relType)) grouped.set(relType, []);
    grouped.get(relType).push(r);
  });
  return grouped;
}

function normalizeRelationshipType(value) {
  const relType = String(value || '').trim();
  const key = relType.toLowerCase().replace(/[\s_-]+/g, '');
  return key === 'relatedto' || key === 'isrelatedto'
    ? 'Related to'
    : (relType || 'Related to');
}

function uniqueRelationshipsByEndpoint(relationships, endpointField) {
  const unique = new Map();
  relationships.forEach(rel => {
    const endpoint = getRes(rel, endpointField);
    if (!endpoint?.id) return;
    const key = `${endpoint.type || ''}:${endpoint.id}`;
    const current = unique.get(key);
    // If duplicate records exist, retain the one carrying the most metadata.
    if (!current || (rel.details?.length || 0) > (current.details?.length || 0)) {
      unique.set(key, rel);
    }
  });
  return [...unique.values()];
}

function getRelationshipMetadata(rel) {
  const parts = [];
  
  // Scribe-related metadata
  const certainty = getVal(rel, 'scribe certainty');
  if (certainty) parts.push(`certainty: ${certainty}`);
  
  const role = getVal(rel, 'Scribe role');
  if (role) parts.push(role);
  
  const func = getVal(rel, 'Function of Copying');
  if (func) parts.push(func);
  
  const scribeComments = getVal(rel, 'Scribe Comments');
  if (scribeComments) parts.push(`comments: "${scribeComments.substring(0, 50)}${scribeComments.length > 50 ? '...' : ''}"`);
  
  const prodInfo = getVal(rel, 'Production info');
  if (prodInfo) parts.push(`info: ${prodInfo}`);
  
  // Folio/location info
  const folioRange = getVal(rel, 'Folio range in PU') || getVal(rel, 'Folio range');
  if (folioRange) parts.push(`folios: ${folioRange}`);
  
  // Text-related metadata
  const textLang = getVal(rel, 'Text Language(s)');
  if (textLang) parts.push(`language: ${textLang}`);
  
  const textComments = getVal(rel, 'Text(s) comments');
  if (textComments) parts.push(`text: "${textComments.substring(0, 50)}${textComments.length > 50 ? '...' : ''}"`);
  
  const expression = getVal(rel, 'Expression');
  if (expression) parts.push(`expr: ${expression}`);
  
  const style = getVal(rel, 'Style');
  if (style) parts.push(`style: ${style}`);
  
  return parts.length ? parts.join(' | ') : '';
}

/* ============================================================
   NETWORK NODE DETAILS PANEL
   ============================================================ */
function showNetworkNodeDetails(type, id, rec) {
  const detailsPanel = document.getElementById('network-node-details');
  if (!detailsPanel) return;
  
  const typeLabels = {
    su: 'Scribal Unit',
    ms: 'Manuscript',
    pu: 'Production Unit',
    hi: 'Holding Institution',
    mi: 'Monastic Institution',
    hp: 'Historical Person',
    tx: 'Text'
  };
  
  const typeLabel = typeLabels[type] || type.toUpperCase();
  const title = MAP[type]?.title(rec) || 'Unknown';
  
  // Get a few key details based on entity type
  let detailsHTML = '';
  if (type === 'su') {
    const ms = getRes(rec, 'Manuscript');
    const scribe = getRes(rec, 'Scribe');
    if (ms) detailsHTML += `<div class="metadata-item"><strong>Manuscript:</strong> ${ms.title}</div>`;
    if (scribe) detailsHTML += `<div class="metadata-item"><strong>Scribe:</strong> ${scribe.title}</div>`;
  } else if (type === 'ms') {

    const role = getVal(rec, 'Role / function');
    const gender = getVal(rec, 'Gender');
    if (role && role !== '—') detailsHTML += `<div class="metadata-item"><strong>Role:</strong> ${role}</div>`;
    if (gender && gender !== '—') detailsHTML += `<div class="metadata-item"><strong>Gender:</strong> ${gender}</div>`;
  }
  
  detailsPanel.innerHTML = `
    <div class="node-details-header">
      <div>
        <div class="node-title">${title}</div>
        <div class="node-type-label">${typeLabel}</div>
      </div>
      <button id="close-node-details" class="node-close-btn" title="Close">&times;</button>
    </div>
    ${detailsHTML}
    <div class="node-details-footer">
      <button id="view-in-browse-btn" class="chip node-action-btn">
        View Full Record in Browse Mode
      </button>
    </div>
  `;
  
  detailsPanel.style.display = 'block';
  
  // Add event listeners
  document.getElementById('close-node-details')?.addEventListener('click', () => {
    detailsPanel.style.display = 'none';
  });
  
  document.getElementById('view-in-browse-btn')?.addEventListener('click', () => {
    jumpTo(type, id);
  });
}

function showDetails(rec, type){
  if (!rec){
    $viz.innerHTML = `<h3 class="db-viz-title">Details</h3><div class="db-viz-body muted">No record selected.</div>`;
    return;
  }
  
  // Track record engagement
  if (window.plausible) {
    plausible('Record Viewed', { 
      props: { 
        entity: type, 
        record_id: rec.rec_ID || rec.id,
        title: (MAP[type].title(rec) || 'Untitled').substring(0, 100)
      } 
    });
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
      // Build viewer URL with manifest
      let viewerHref = `${BASE}/viewer/?manifest=${encodeURIComponent(manifestUrl)}`;
      
      // Add transcriptions if available in the map
      if (manifestAnnosMap[manifestUrl]) {
        viewerHref += `&annos=${encodeURIComponent(BASE + manifestAnnosMap[manifestUrl])}`;
      }
      
      html += `<div class="viewer-links">
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
    html += `<div class="section"><div>${[MAP.hp.ptype(rec), MAP.hp.gender(rec), MAP.hp.viaf(rec) ? '(VIAF)' : '', MAP.hp.wikidata(rec) ? '(Wikidata)' : ''].filter(Boolean).join(' — ')}</div></div>`;
  } else if (type==='tx'){
    html += `<div class="section"><div>${[MAP.tx.genre(rec)].filter(Boolean).join(' — ')}</div></div>`;
  }

html += `<div class="section">${renderDetailRows(rec, type)}</div>`;
html += renderDirectPointers(rec, type);

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
        html += `<div class="field-group"><em>${esc(label)}</em>${items.slice(0,150).map(t=>`<div>${linkTo('tx', t.id, t.title)}</div>`).join('')}</div>`;
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

  // Add relationship records
  // renderRelationships: build outgoing and incoming relationship HTML for a record
  function renderRelationships(localRec, localType) {
    const recId = String(localRec.rec_ID);
    const outgoing = REL_INDEX.bySource[recId] || [];
    const incoming = REL_INDEX.byTarget[recId] || [];
    let outHtml = '';

    const groupByRelType = (relationships) => {
      const grouped = new Map();
      relationships.forEach(r => {
        const relType = normalizeRelationshipType(getVal(r, 'Relationship type'));
        if (!grouped.has(relType)) grouped.set(relType, []);
        grouped.get(relType).push(r);
      });
      return grouped;
    };

    const getRelationshipMetadata = (rel) => {
      const parts = [];
      const certainty = getVal(rel, 'scribe certainty'); if (certainty) parts.push(`certainty: ${certainty}`);
      const role = getVal(rel, 'Scribe role'); if (role) parts.push(role);
      const func = getVal(rel, 'Function of Copying'); if (func) parts.push(func);
      const scribeComments = getVal(rel, 'Scribe Comments'); if (scribeComments) parts.push(`comments: "${(scribeComments||'').substring(0,50)}${scribeComments && scribeComments.length>50 ? '...' : ''}"`);
      const prodInfo = getVal(rel, 'Production info'); if (prodInfo) parts.push(`info: ${prodInfo}`);
      const folioRange = getVal(rel, 'Folio range in PU') || getVal(rel, 'Folio range'); if (folioRange) parts.push(`folios: ${folioRange}`);
      const textLang = getVal(rel, 'Text Language(s)'); if (textLang) parts.push(`language: ${textLang}`);
      const textComments = getVal(rel, 'Text(s) comments'); if (textComments) parts.push(`text: "${(textComments||'').substring(0,50)}${textComments && textComments.length>50 ? '...' : ''}"`);
      const expression = getVal(rel, 'Expression'); if (expression) parts.push(`expr: ${expression}`);
      const style = getVal(rel, 'Style'); if (style) parts.push(`style: ${style}`);
      return parts.length ? parts.join(' | ') : '';
    };

    // Outgoing
    if (outgoing.length) {
      outHtml += '<div class="section"><strong>Relationships</strong>';
      const grouped = groupByRelType(outgoing);
      for (const [relType, rels] of grouped.entries()) {
        outHtml += `<div class="rel-type-section"><strong class="rel-type-label">${esc(relType)}</strong>`;
        uniqueRelationshipsByEndpoint(rels, 'Target record').forEach(r => {
          const tgt = getRes(r, 'Target record'); if (!tgt || !tgt.id) return;
          const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)]; if (!tgtType) return;
          const tgtRec = IDX[tgtType]?.[String(tgt.id)]; if (!tgtRec) return;
          const meta = renderRelationshipMetadataRows(r);
          outHtml += `<div class="rel-item-indent">${linkTo(tgtType, tgt.id, MAP[tgtType].title(tgtRec))}${meta ? `<div class="rel-metadata">${meta}</div>` : ''}</div>`;
        });
        outHtml += '</div>';
      }
      outHtml += '</div>';
    }

    // Incoming
    if (incoming.length) {
      outHtml += '<div class="section"><strong>Referenced by</strong>';
      const grouped = groupByRelType(incoming);
      for (const [relType, rels] of grouped.entries()) {
        outHtml += `<div class="rel-type-section"><strong class="rel-type-label">${esc(relType)}</strong>`;
        uniqueRelationshipsByEndpoint(rels, 'Source record').forEach(r => {
          const src = getRes(r, 'Source record'); if (!src || !src.id) return;
          const srcType = REC_TYPE_TO_ENTITY[String(src.type)]; if (!srcType) return;
          const srcRec = IDX[srcType]?.[String(src.id)]; if (!srcRec) return;
          const meta = renderRelationshipMetadataRows(r);
          outHtml += `<div class="rel-item-indent">${linkTo(srcType, src.id, MAP[srcType].title(srcRec))}${meta ? `<div class="rel-metadata">${meta}</div>` : ''}</div>`;
        });
        outHtml += '</div>';
      }
      outHtml += '</div>';
    }

    return outHtml;
  }

  // Text records already expose their useful contextual links elsewhere in the
  // detail view; the generic relationship blocks are redundant and confusing.
  if (type !== 'tx') {
    html += renderRelationships(rec, type);
  }

  // Add Find Connection button
  html += `<div class="section section-bottom-margin">
    <button class="chip chip-padding" id="btn-find-connection">Find Connection to...</button>
  </div>`;

  $viz.innerHTML = html;
  
  // Always update the current network record (for when user switches to network view)
  NETWORK_CURRENT_REC = rec;
  NETWORK_CURRENT_TYPE = type;
  
  // If network view is currently active, rebuild it
  if (ACTIVE_MODE === 'network') {
    buildNetworkView();
  }
  
  // Find Connection button handler
  document.getElementById('btn-find-connection')?.addEventListener('click', () => {
    showPathFindingDialog(rec, type);
  });
  
  $viz.querySelectorAll('[data-jump]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const [t,id] = btn.getAttribute('data-jump').split(':');
      jumpTo(t, id);
    });
  });
}

/* PATH FINDING EXTRACTED */

/* ---------- Results grid ---------- */
let ENTITY = 'su';
let page=1, pageSize=24;
let selectedCard=null;
let ACTIVE_MODE = 'browse';
let NETWORK_CURRENT_REC = null;
let NETWORK_CURRENT_TYPE = null;
let APPLYING_EXPLORE_HISTORY = false;

const OVERVIEW_MODE_TO_TAB = {
  analytics: 'summary',
  map: 'map',
  network: 'network'
};
const OVERVIEW_TAB_TO_MODE = {
  summary: 'analytics',
  analytics: 'analytics',
  map: 'map',
  network: 'network'
};
const EXPLORE_TAB_SELECTORS = {
  tree: '.tree-tab-btn',
  scribes: '.scribe-tab-btn',
  multilingualism: '.multilingualism-tab-btn',
  'colophon-analysis': '.colophon-tab-btn',
  'text-genres': '.genre-tab-btn'
};
const EXPLORE_TAB_ALIASES = {
  'colophon-analysis': {
    sentiment: 'overview',
    themes: 'overview',
    linguistic: 'overview',
    'content-expression': 'overview',
    patterns: 'contexts',
    'explore-formulae': 'formulae',
    'browse-colophons': 'browse'
  }
};
const EXPLORE_MODES = new Set([
  'browse', 'analytics', 'map', 'network', 'tree', 'scribes',
  'multilingualism', 'colophon-analysis', 'text-genres'
]);

function getActiveSubtab(mode) {
  if (OVERVIEW_MODE_TO_TAB[mode]) return OVERVIEW_MODE_TO_TAB[mode];
  const selector = EXPLORE_TAB_SELECTORS[mode];
  return selector ? document.querySelector(`${selector}.is-on`)?.dataset.tab || null : null;
}

function updateExploreUrl(mode = ACTIVE_MODE, tab = getActiveSubtab(mode), options = {}) {
  if (APPLYING_EXPLORE_HISTORY || window.location.search.includes('embed=true')) return;

  const url = new URL(window.location.href);
  const isOverview = Boolean(OVERVIEW_MODE_TO_TAB[mode]);
  url.searchParams.set('mode', isOverview ? 'overview' : mode);

  const publicTab = isOverview ? OVERVIEW_MODE_TO_TAB[mode] : tab;
  if (publicTab) url.searchParams.set('tab', publicTab);
  else url.searchParams.delete('tab');

  if (mode !== 'browse') {
    ['browse', 'id', 'slug', 'entity', 'type'].forEach(key => url.searchParams.delete(key));
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl === currentUrl) return;

  window.history[options.replace ? 'replaceState' : 'pushState'](
    { exploreMode: mode, exploreTab: publicTab || null },
    '',
    nextUrl
  );
}

function syncExploreTabList(tabList, activeButton, panel = null) {
  if (!tabList || !activeButton) return;
  const buttons = Array.from(tabList.children).filter(child => child.matches('button'));
  buttons.forEach(button => {
    const isActive = button === activeButton;
    button.classList.toggle('is-on', isActive);
    button.setAttribute('aria-selected', String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  if (panel) {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', activeButton.id);
    panel.tabIndex = 0;
  }
  if (tabList.scrollWidth > tabList.clientWidth && typeof activeButton.scrollIntoView === 'function') {
    activeButton.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
}

function enhanceExploreTabList(tabList, panel = null) {
  if (!tabList) return;
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-orientation', 'horizontal');

  const buttons = Array.from(tabList.children).filter(child => child.matches('button'));
  const listId = tabList.id || `explore-tablist-${Math.random().toString(36).slice(2, 9)}`;
  tabList.id = listId;
  if (panel && !panel.id) panel.id = `${listId}-panel`;

  buttons.forEach((button, index) => {
    button.setAttribute('role', 'tab');
    if (!button.id) button.id = `${listId}-tab-${button.dataset.tab || button.dataset.mode || index}`;
    if (panel) button.setAttribute('aria-controls', panel.id);
  });

  const activeButton = buttons.find(button => button.classList.contains('is-on')) || buttons[0];
  if (activeButton) syncExploreTabList(tabList, activeButton, panel);

  if (tabList.dataset.keyboardTabsInitialized === 'true') return;
  tabList.dataset.keyboardTabsInitialized = 'true';
  tabList.addEventListener('keydown', event => {
    const current = event.target.closest('[role="tab"]');
    if (!current || !tabList.contains(current)) return;
    const currentIndex = buttons.indexOf(current);
    let nextIndex = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = buttons.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    buttons[nextIndex].focus();
    buttons[nextIndex].click();
  });
}

function applyExploreLocation() {
  const params = new URLSearchParams(window.location.search);
  const requestedMode = params.get('mode') || 'browse';
  const requestedTab = params.get('tab');

  const mode = requestedMode === 'overview'
    ? (OVERVIEW_TAB_TO_MODE[requestedTab] || 'analytics')
    : requestedMode;
  if (!EXPLORE_MODES.has(mode)) return;

  APPLYING_EXPLORE_HISTORY = true;
  try {
    setMode(mode, { updateUrl: false });
    const tabSelector = EXPLORE_TAB_SELECTORS[mode];
    if (tabSelector) {
      const buttons = Array.from(document.querySelectorAll(tabSelector));
      const targetTab = EXPLORE_TAB_ALIASES[mode]?.[requestedTab] || requestedTab || 'overview';
      const button = buttons.find(candidate => candidate.dataset.tab === targetTab) || buttons[0];
      if (button && !button.classList.contains('is-on')) button.click();
    }
  } finally {
    APPLYING_EXPLORE_HISTORY = false;
  }
}

function alignDetailsPanelToCard(card){
  if (!$viz) return;

  // Keep the desktop details panel anchored at the top of its grid column.
  // The panel itself is sticky, so selected records remain readable while the
  // page scrolls; only its own content needs returning to the top on selection.
  $viz.style.marginTop = '';

  const stacked = window.matchMedia('(max-width: 1440px)').matches;
  if (stacked) {
    if (card) $viz.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }

  $viz.scrollTop = 0;
}

window.addEventListener('resize', debounce(() => alignDetailsPanelToCard(selectedCard), 150));

function render(list, type, selectId=null){
  const map = MAP[type];
  if (!map) {
    return;
  }
  const sort = $sort.value;
  if (sort && sorters(map)[sort]) list=[...list].sort(sorters(map)[sort]);

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
      meta.textContent = [MAP.hp.ptype(rec), MAP.hp.gender(rec), MAP.hp.viaf(rec) ? '(VIAF)' : '', MAP.hp.wikidata(rec) ? '(Wikidata)' : ''].filter(Boolean).join(' — ');
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
      alignDetailsPanelToCard(card);
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
  
  // Update page jump input
  if ($pageJump) {
    $pageJump.max = totalPages;
    $pageJump.value = page;
  }

  const toSelect = $results.querySelector('.db-card[data-autoselect="1"]') || $results.querySelector('.db-card');
  if (toSelect){ toSelect.click(); toSelect.scrollIntoView({block:'nearest'}); }
  else { showDetails(null, type); selectedCard=null; alignDetailsPanelToCard(null); }
}
function computeList(){
  const cfg  = FACETS[ENTITY];
  const map  = MAP[ENTITY];
  let list = DATA[ENTITY] || [];
  list = applyFacets(list, cfg);
  list = applySearch(list, map, $search.value.trim(), $field.value);
  list = applyAdvancedSearch(list);
  return list;
}
function renderCurrent(){
  const list = computeList();
  render(list, ENTITY);
}
function recompute(clearFacets = false){
  const cfg = FACETS[ENTITY];
  
  // If switching entities, clear the facet DOM first to prevent old facets from being read
  if (clearFacets) {
    $mount.innerHTML = '';
  }
  
  const prevState = clearFacets ? {} : readFacetState(cfg);
  const fullList = DATA[ENTITY] || []; // Use full unfiltered data for facet counts
  const filteredList = computeList(); // Use filtered data for results
  buildFacets(fullList, cfg, prevState); // Build facets from full dataset
  render(filteredList, ENTITY); // Render filtered results
}

/* ---------- Views (Results / Map / Timeline / Network) ---------- */
let ACTIVE_VIEW = 'results';

function supportsMap(entity){ return true; } // Map now supports all entity types (view selector handles different data)
function supportsTimeline(entity){ return true; } // Timeline now supports all entity types (view selector handles different data)
function supportsNetwork(entity){ return true; } // All entities support network view
function supportsAnalytics(entity){ return true; } // Analytics available for all entities

function setView(view){
  ACTIVE_VIEW = view;

  // Tabs
  $tabs.results?.classList.toggle('is-on', view==='results');
  $tabs.map?.classList.toggle('is-on',     view==='map');
  $tabs.timeline?.classList.toggle('is-on',view==='timeline');
  $tabs.network?.classList.toggle('is-on', view==='network');
  $tabs.analytics?.classList.toggle('is-on', view==='analytics');

  // Layout
  const vizOn = (view!=='results');
  $right.classList.toggle('viz-mode', vizOn);
  $panes.map.classList.toggle('is-on', view==='map');
  $panes.timeline.classList.toggle('is-on', view==='timeline');
  $panes.network.classList.toggle('is-on', view==='network');
  $panes.analytics.classList.toggle('is-on', view==='analytics');
  $panes.map.setAttribute('aria-hidden', String(view!=='map'));
  $panes.timeline.setAttribute('aria-hidden', String(view!=='timeline'));
  $panes.network.setAttribute('aria-hidden', String(view!=='network'));
  $panes.analytics.setAttribute('aria-hidden', String(view!=='analytics'));

  if (view==='map') buildMap();
  if (view==='timeline') buildTimeline();
  if (view==='network') buildNetworkView();
  if (view==='analytics') buildAnalytics();
}

function updateAvailableViews(){
  const mapOk = supportsMap(ENTITY);
  const tlOk  = supportsTimeline(ENTITY);
  const netOk = supportsNetwork(ENTITY);
  const analyticsOk = supportsAnalytics(ENTITY);
  
  if (ACTIVE_VIEW==='map' && mapOk) buildMap();
  if (ACTIVE_VIEW==='timeline' && tlOk) buildTimeline();
  if (ACTIVE_VIEW==='network' && netOk) buildNetworkView();
  if (ACTIVE_VIEW==='analytics' && analyticsOk) buildAnalytics();
}

function setMode(mode, options = {}) {
  if (ACTIVE_MODE === mode) return;
  if (ACTIVE_MODE === 'network') NetworkModule?.dispose?.();
  if (ACTIVE_MODE === 'text-genres') TextGenresModule?.disposeNetworks?.();
  ACTIVE_MODE = mode;

  const overviewModes = ['analytics', 'map', 'network'];
  const isOverviewMode = overviewModes.includes(mode);

  // Track mode navigation
  if (window.plausible) {
    plausible('Mode Changed', { props: { mode: mode } });
  }

  // Update main navigation buttons
  document.querySelectorAll('.main-nav-btn').forEach(btn => {
    const representsOverview = btn.dataset.modeGroup === 'overview' && isOverviewMode;
    const isActive = btn.dataset.mode === mode || representsOverview;
    btn.classList.toggle('is-on', isActive);
    if (isActive) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
  const mainNav = document.getElementById('main-nav-tabs');
  const activeMainButton = mainNav?.querySelector('.main-nav-btn.is-on');
  if (mainNav && activeMainButton) syncExploreTabList(mainNav, activeMainButton);

  // Show the Overview sub-navigation and identify its active view.
  const overviewNav = document.getElementById('overview-nav-tabs');
  if (overviewNav) {
    overviewNav.hidden = !isOverviewMode;
    if (isOverviewMode) {
      const activeHeader = document.querySelector(`#mode-${mode} .explore-module-shell > .viz-head`);
      if (activeHeader && overviewNav.previousElementSibling !== activeHeader) {
        activeHeader.insertAdjacentElement('afterend', overviewNav);
      }
      const activeOverviewPanel = document.querySelector(`#mode-${mode} .explore-module-content`);
      enhanceExploreTabList(overviewNav, activeOverviewPanel);
    }
  }
  document.querySelectorAll('.overview-nav-btn').forEach(btn => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle('is-on', isActive);
    if (isActive) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });

  // Show/hide mode containers
  const modes = ['browse', 'map', 'timeline', 'network', 'analytics', 'tree', 'scribes', 'multilingualism', 'colophon-analysis', 'text-genres'];
  modes.forEach(m => {
    const container = document.getElementById(`mode-${m}`);
    if (container) {
      const isActive = (m === mode);
      container.setAttribute('aria-hidden', String(!isActive));
      // For accessibility
      if (isActive) container.focus();
    }
  });

  // Build content for visualization modes
  if (mode === 'map') buildMap();
  if (mode === 'timeline') buildTimeline();
  if (mode === 'network') buildNetworkView();
  if (mode === 'analytics') buildAnalytics();
  if (mode === 'tree') buildHierarchicalTree();
  if (mode === 'scribes') buildScribes();
  if (mode === 'multilingualism') buildMultilingualism();
  if (mode === 'colophon-analysis') buildColophonAnalysis();
  if (mode === 'text-genres') buildTextGenres();
  if (options.updateUrl !== false) {
    updateExploreUrl(mode, getActiveSubtab(mode), { replace: options.replaceHistory === true });
  }
}

// Expose to global scope for debugging
window.setMode = setMode;

function initModeNavigation() {
  enhanceExploreTabList(document.getElementById('main-nav-tabs'));

  // Set up primary and Overview navigation listeners.
  document.querySelectorAll('.main-nav-btn, .overview-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode) setMode(mode);
    });
  });

  if (!window.explorePopstateInitialized) {
    window.addEventListener('popstate', applyExploreLocation);
    window.explorePopstateInitialized = true;
  }
}

/* ---------- Switch entity ---------- */
function switchEntity(ent){
  if (ENTITY===ent) {
    return;
  }
  
  // Track entity switch
  if (window.plausible) {
    plausible('Entity Changed', { props: { from: ENTITY, to: ent } });
  }
  
  ENTITY = ent;
  document.querySelectorAll('#entity-switch .entity-btn').forEach(c=>c.classList.toggle('is-on', c.dataset.entity===ent));
  $search.value=''; $field.value=''; $sort.value='';
  if ($advancedResultType) $advancedResultType.value = ent;
  page=1;
  recompute(true); // Clear facets when switching entities
  updateAvailableViews();
}


/* Map Module delegated to window.ExploreMap */
let MapModule = null; // Will inject initialized map core
function ensureLeaflet() { return MapModule.ensureLeaflet(); }
function buildMap(filtered) { return MapModule.buildMap(filtered); }


/* Timeline Module delegated to window.ExploreTimeline */
let TimelineModule = null;
function buildTimeline() { if(TimelineModule) return TimelineModule.buildTimeline(); }


/* Network Module delegated to window.ExploreNetwork */
let NetworkModule = null;
let TextGenresModule = null;
/* Path Finding Module delegated to window.ExplorePathFinding */

let PathFindingModule = null;
function showPathFindingDialog(rec, type) { if(PathFindingModule) return PathFindingModule.showPathFindingDialog(rec, type); }
function findPaths(typeA, idA, typeB, idB, maxDepth) { if(PathFindingModule) return PathFindingModule.findPaths(typeA, idA, typeB, idB, maxDepth); }

function buildNetworkView() { if(NetworkModule) return NetworkModule.buildNetworkView(); }
function buildNetwork() { if(NetworkModule) return NetworkModule.buildNetworkView(); }
function buildRecordNetwork(rec, type) { if(NetworkModule) return NetworkModule.buildRecordNetwork(rec, type); }

/* ---------- High-Quality Image Export Functions ---------- */

/**
 * Download file helper - converts content to blob and triggers download
 * @param {string|Blob} content - Content to download (string or Blob)
 * @param {string} filename - Filename for the download
 * @param {string} mimeType - MIME type for the content
 */
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

/**
 * Export SVG element as SVG file
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - The filename for the export
 */
function exportSvgAsSvg(svgElement, filename) {
  if (!svgElement) {
    alert('No visualization to export');
    return;
  }
  
  // Track SVG export
  if (window.plausible) {
    plausible('Export', { props: { type: 'Visualization', format: 'SVG' } });
  }
  
  // Clone the SVG to avoid modifying the original
  const svgClone = svgElement.cloneNode(true);
  
  // Ensure proper dimensions
  const bbox = svgElement.getBBox();
  svgClone.setAttribute('width', bbox.width);
  svgClone.setAttribute('height', bbox.height);
  svgClone.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
  
  // Add XML namespace if not present
  if (!svgClone.getAttribute('xmlns')) {
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  
  // Inline all styles from stylesheets
  const styleSheets = document.styleSheets;
  let allStyles = '';
  
  try {
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            allStyles += rules[j].cssText + '\n';
          }
        }
      } catch (e) {
        // Skip stylesheets from other domains
      }
    }
  } catch (e) {
  }
  
  // Add style element with all styles
  if (allStyles) {
    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleElement.textContent = allStyles;
    svgClone.insertBefore(styleElement, svgClone.firstChild);
  }
  
  // Serialize SVG to string
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  
  // Create blob and download
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadFile(blob, filename, 'image/svg+xml');
}

/**
 * Export SVG element as high-resolution PNG (300 DPI)
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - The filename for the export
 * @param {number} scaleFactor - Scale factor for resolution (3 = 300 DPI, 4 = 400 DPI)
 */
function exportSvgAsPng(svgElement, filename, scaleFactor = 3) {
  if (!svgElement) {
    alert('No visualization to export');
    return;
  }
  
  // Track PNG export
  if (window.plausible) {
    plausible('Export', { props: { type: 'Visualization', format: 'PNG', dpi: scaleFactor * 100 } });
  }
  
  // Prefer viewBox dimensions over getBBox() for accurate capture
  let width, height, viewBoxX = 0, viewBoxY = 0;
  const viewBox = svgElement.getAttribute('viewBox');
  
  if (viewBox) {
    // Parse viewBox: "minX minY width height"
    const parts = viewBox.trim().split(/\s+/);
    if (parts.length === 4) {
      viewBoxX = parseFloat(parts[0]);
      viewBoxY = parseFloat(parts[1]);
      width = parseFloat(parts[2]);
      height = parseFloat(parts[3]);
    }
  }
  
  // Fallback to getBBox if viewBox not available or invalid
  if (!width || !height || width === 0 || height === 0) {
    try {
      const bbox = svgElement.getBBox();
      width = bbox.width;
      height = bbox.height;
      viewBoxX = bbox.x;
      viewBoxY = bbox.y;
    } catch (e) {
    }
  }
  
  // Fallback to clientWidth/clientHeight if still zero
  if (!width || !height || width === 0 || height === 0) {
    width = svgElement.clientWidth || svgElement.parentElement?.clientWidth || 800;
    height = svgElement.clientHeight || svgElement.parentElement?.clientHeight || 600;
    viewBoxX = 0;
    viewBoxY = 0;
  }
  
  // Final validation - ensure we have valid dimensions
  if (width === 0 || height === 0) {
    alert('Cannot export: visualization has no visible dimensions. Please ensure the visualization is properly rendered.');
    return;
  }
  
  // Create a canvas with scaled dimensions
  const canvas = document.createElement('canvas');
  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;
  const ctx = canvas.getContext('2d');
  
  // Scale the context
  ctx.scale(scaleFactor, scaleFactor);
  
  // Set white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);
  
  // Clone and prepare SVG
  const svgClone = svgElement.cloneNode(true);
  svgClone.setAttribute('width', width);
  svgClone.setAttribute('height', height);
  svgClone.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${width} ${height}`);
  
  if (!svgClone.getAttribute('xmlns')) {
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  
  // Inline styles
  const styleSheets = document.styleSheets;
  let allStyles = '';
  
  try {
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            allStyles += rules[j].cssText + '\n';
          }
        }
      } catch (e) {
      }
    }
  } catch (e) {
  }
  
  if (allStyles) {
    const styleElement = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styleElement.textContent = allStyles;
    svgClone.insertBefore(styleElement, svgClone.firstChild);
  }
  
  // Serialize SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  // Load SVG into image
  const img = new Image();
  img.onload = function() {
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);
    
    // Convert canvas to PNG blob
    canvas.toBlob(function(blob) {
      downloadFile(blob, filename, 'image/png');
    }, 'image/png');
  };
  
  img.onerror = function(e) {
    URL.revokeObjectURL(url);
    alert('Failed to export PNG. Please try SVG export instead.');
  };
  
  img.src = url;
}

/**
 * Export map as PNG using html2canvas
 * @param {string} containerId - The ID of the map container
 * @param {string} filename - The filename for the export
 */
function exportMapAsPng(containerId, filename) {
  const mapElement = document.getElementById(containerId);
  
  if (!mapElement) {
    alert('No map to export');
    return;
  }
  
  // Track map export
  if (window.plausible) {
    const viewSelector = document.getElementById('map-view-selector');
    const mapView = viewSelector ? viewSelector.value : 'unknown';
    plausible('Export', { props: { type: 'Map', format: 'PNG', view: mapView } });
  }
  
  // Show loading indicator
  const originalCursor = mapElement.style.cursor;
  mapElement.style.cursor = 'wait';
  
  // Store current map view to restore later
  const currentZoom = window.globalMap ? window.globalMap.getZoom() : null;
  const currentCenter = window.globalMap ? window.globalMap.getCenter() : null;
  
  // Reset map to show all bounds before exporting to prevent coordinate misplacement
  if (window.globalMap && window.globalMapBounds) {
    window.globalMap.fitBounds(window.globalMapBounds, { padding: [50, 50], animate: false });
    
    // Wait for map to finish rendering at new bounds
    // Listen for moveend event to know when map has finished repositioning
    const handleMoveEnd = () => {
      window.globalMap.off('moveend', handleMoveEnd);
      
      // Additional wait for tiles to load
      setTimeout(() => {
        captureAndExport();
      }, 800);
    };
    
    window.globalMap.on('moveend', handleMoveEnd);
    
    // Fallback timeout in case moveend doesn't fire
    setTimeout(() => {
      window.globalMap.off('moveend', handleMoveEnd);
      captureAndExport();
    }, 2000);
  } else {
    // No bounds available, capture as-is
    setTimeout(() => {
      captureAndExport();
    }, 500);
  }
  
  function captureAndExport() {
    // Use html2canvas to capture the map
    html2canvas(mapElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 3, // 3x scale for ~300 DPI
      logging: false
    }).then(canvas => {
      canvas.toBlob(function(blob) {
        downloadFile(blob, filename, 'image/png');
        mapElement.style.cursor = originalCursor;
        
        // Restore original view
        if (window.globalMap && currentZoom && currentCenter) {
          window.globalMap.setView(currentCenter, currentZoom, { animate: false });
        }
      }, 'image/png');
    }).catch(error => {
      mapElement.style.cursor = originalCursor;
      
      // Restore original view on error too
      if (window.globalMap && currentZoom && currentCenter) {
        window.globalMap.setView(currentCenter, currentZoom, { animate: false });
      }
      
      alert('Failed to export map. Please try again or use a screenshot tool.');
    });
  }
}

/**
 * Export analytics visualization (handles multiple viz types)
 * @param {string} format - 'svg' or 'png'
 */
function exportAnalyticsVisualization(format) {
  const analyticsMount = document.getElementById('analytics-mount');
  
  // Track analytics export
  if (window.plausible) {
    plausible('Export', { props: { type: 'Analytics', format: format } });
  }
  
  if (!analyticsMount) {
    alert('No analytics visualization to export');
    return;
  }
  
  // Check if there's actual content
  if (!analyticsMount.innerHTML.trim()) {
    alert('No visualization content to export. Please generate a visualization first.');
    return;
  }
  
  // Check if element has dimensions - with a small delay to ensure rendering
  setTimeout(() => {
    const rect = analyticsMount.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      alert('Visualization has no visible dimensions. Please ensure the Analytics view is active and the visualization is properly rendered.');
      return;
    }
    
    // Try to find SVG element (most analytics use D3 SVG)
    const svgElement = analyticsMount.querySelector('svg');
    
    const entityFilter = document.getElementById('entity-filter-select')?.value || 'su';
    const filename = `unknownhands-analytics-${entityFilter}-${Date.now()}.${format}`;
    
    if (!svgElement) {
      // If no SVG, use html2canvas for HTML content
      if (format === 'png') {
        // Ensure html2canvas is loaded
        if (typeof html2canvas === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          script.onload = () => {
            exportHtmlVisualizationAsPng(analyticsMount, filename).catch(err => {
              alert('Export failed: ' + err.message);
            });
          };
          script.onerror = () => {
            alert('Failed to load export library. Please check your internet connection.');
          };
          document.head.appendChild(script);
        } else {
          exportHtmlVisualizationAsPng(analyticsMount, filename).catch(err => {
            alert('Export failed: ' + err.message);
          });
        }
      } else {
        alert('This visualization type does not support SVG export. Please use PNG export instead.');
      }
      return;
    }
    
    // Export SVG
    if (format === 'svg') {
      exportSvgAsSvg(svgElement, filename);
    } else if (format === 'png') {
      exportSvgAsPng(svgElement, filename, 3);
    }
  }, 100); // Small delay to ensure DOM is fully rendered
}

/**
 * Export HTML-based visualization as PNG using html2canvas
 */
async function exportHtmlVisualizationAsPng(element, filename) {
  try {
    // Check if html2canvas is available
    if (typeof html2canvas === 'undefined') {
      throw new Error('html2canvas library is not loaded');
    }
    
    // Wait for any animations or rendering to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Ensure element is visible
    const rect = element.getBoundingClientRect();
    
    if (rect.width === 0 || rect.height === 0) {
      throw new Error('Element has no visible dimensions. Please ensure the visualization is fully rendered before exporting.');
    }
    
    // Get scrollable dimensions
    const scrollWidth = element.scrollWidth || rect.width;
    const scrollHeight = element.scrollHeight || rect.height;
    
    if (scrollWidth === 0 || scrollHeight === 0) {
      throw new Error('Element scroll dimensions are zero. Cannot export.');
    }
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: false,
      removeContainer: true,
      windowWidth: scrollWidth,
      windowHeight: scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure all elements with zero dimensions are handled
        // This prevents the createPattern error
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          const width = parseFloat(style.width);
          const height = parseFloat(style.height);
          
          // If element has zero width or height, give it minimum dimensions or hide it
          if ((width === 0 || height === 0) && el.tagName !== 'BR') {
            // For divs used as visual bars/elements, ensure minimum size
            if (el.style.background || el.style.backgroundColor) {
              if (width === 0) el.style.minWidth = '1px';
              if (height === 0) el.style.minHeight = '1px';
            } else {
              // Otherwise hide the element
              el.style.display = 'none';
            }
          }
        });
      }
    });
    
    // Validate canvas dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Generated canvas has zero dimensions');
    }
    
    // Convert to blob and download
    canvas.toBlob(blob => {
      if (!blob) {
        alert('Failed to create image blob');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    throw error; // Re-throw so the caller can handle it
  }
}

/**
 * Export individual manuscript tree item as SVG using foreignObject
 * @param {HTMLElement} treeItem - The manuscript tree item div
 * @param {string} msId - The manuscript ID for filename
 */
function exportTreeItemAsSvg(treeItem, msId) {
  if (!treeItem) {
    alert('No tree item to export');
    return;
  }
  
  // Track tree SVG export
  if (window.plausible) {
    plausible('Export', { props: { type: 'Tree', format: 'SVG', manuscript: msId } });
  }
  
  // Clone the tree item
  const clone = treeItem.cloneNode(true);
  
  // Remove export buttons from clone
  clone.querySelectorAll('.tree-export-svg-btn, .tree-export-png-btn').forEach(btn => btn.remove());
  
  // Get dimensions
  const rect = treeItem.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  
  // Create SVG with foreignObject
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  
  // Add white background
  const rect_bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect_bg.setAttribute('width', '100%');
  rect_bg.setAttribute('height', '100%');
  rect_bg.setAttribute('fill', 'white');
  svg.appendChild(rect_bg);
  
  // Inline all styles
  const styleSheets = document.styleSheets;
  let allStyles = '';
  
  try {
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            allStyles += rules[j].cssText + '\n';
          }
        }
      } catch (e) {
      }
    }
  } catch (e) {
  }
  
  // Create foreignObject with HTML content
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  foreignObject.setAttribute('width', '100%');
  foreignObject.setAttribute('height', '100%');
  
  // Wrap content in div with styles
  const wrapper = document.createElement('div');
  wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  
  if (allStyles) {
    const style = document.createElement('style');
    style.textContent = allStyles;
    wrapper.appendChild(style);
  }
  
  wrapper.appendChild(clone);
  foreignObject.appendChild(wrapper);
  svg.appendChild(foreignObject);
  
  // Serialize and download
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  
  const msTitle = treeItem.getAttribute('data-ms-title') || 'manuscript';
  const safeMsTitle = msTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const filename = `unknownhands-tree-${safeMsTitle}-${Date.now()}.svg`;
  
  downloadFile(blob, filename, 'image/svg+xml');
}

/**
 * Export individual manuscript tree item as PNG
 * @param {HTMLElement} treeItem - The manuscript tree item div
 * @param {string} msId - The manuscript ID for filename
 */
function exportTreeItemAsPng(treeItem, msId) {
  if (!treeItem) {
    alert('No tree item to export');
    return;
  }
  
  // Track tree PNG export
  if (window.plausible) {
    plausible('Export', { props: { type: 'Tree', format: 'PNG', manuscript: msId } });
  }
  
  // Clone the tree item to avoid modifying original
  const clone = treeItem.cloneNode(true);
  
  // Remove export buttons from clone
  clone.querySelectorAll('.tree-export-svg-btn, .tree-export-png-btn').forEach(btn => btn.remove());
  
  // Create a temporary container with white background
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.background = 'white';
  tempContainer.style.padding = '20px';
  tempContainer.appendChild(clone);
  document.body.appendChild(tempContainer);
  
  // Show cursor wait
  treeItem.style.cursor = 'wait';
  
  // Wait a bit for rendering
  setTimeout(() => {
    // Validate dimensions before capture
    const rect = tempContainer.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      document.body.removeChild(tempContainer);
      treeItem.style.cursor = '';
      alert('Cannot export: tree item has no visible dimensions.');
      return;
    }
    
    // Use html2canvas to capture the clone
    html2canvas(tempContainer, {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scale: 3, // 3x scale for ~300 DPI
      logging: false,
      windowWidth: tempContainer.scrollWidth || rect.width,
      windowHeight: tempContainer.scrollHeight || rect.height,
      onclone: (clonedDoc) => {
        // Ensure all elements with zero dimensions are handled
        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach(el => {
          const style = window.getComputedStyle(el);
          const width = parseFloat(style.width);
          const height = parseFloat(style.height);
          
          // If element has zero width or height, give it minimum dimensions or hide it
          if ((width === 0 || height === 0) && el.tagName !== 'BR') {
            if (el.style.background || el.style.backgroundColor) {
              if (width === 0) el.style.minWidth = '1px';
              if (height === 0) el.style.minHeight = '1px';
            } else {
              el.style.display = 'none';
            }
          }
        });
      }
    }).then(canvas => {
      // Validate canvas
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Generated canvas has zero dimensions');
      }
      
      canvas.toBlob(function(blob) {
        const msTitle = treeItem.getAttribute('data-ms-title') || 'manuscript';
        const safeMsTitle = msTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        const filename = `unknownhands-tree-${safeMsTitle}-${Date.now()}.png`;
        downloadFile(blob, filename, 'image/png');
        
        // Cleanup
        document.body.removeChild(tempContainer);
        treeItem.style.cursor = '';
      }, 'image/png');
    }).catch(error => {
      document.body.removeChild(tempContainer);
      treeItem.style.cursor = '';
      alert('Failed to export tree: ' + error.message);
    });
  }, 200);
}

/* ---------- CSV ---------- */
const csvCell = v => `"${String(v ?? '').replace(/"/g,'""')}"`;
const access = {
  field: (label, fieldName) => ({ label, get: r => getExportFieldValue(r, fieldName) || getVal(r, fieldName) }),
  resTitle: (label, fieldName) => ({ label, get: r => (getRes(r, fieldName)?.title) || getVal(r, fieldName) || '' }),
  details: (label, fieldName) => ({ label, get: r => getExportFieldValue(r, fieldName) }),
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
    access.field('VIAF','VIAF'), access.field('Wikidata','Wikidata'),
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

function detailExportValue(d){
  if (!d) return '';
  if (d.termLabel) return d.termLabel;
  if (d.value && typeof d.value === 'object') {
    if (d.value.title || d.value.id) return d.value.title || d.value.id || '';
    if (d.value.geo && d.value.geo.wkt) {
      const match = d.value.geo.wkt.match(/POINT\(([\d.\-]+)\s+([\d.\-]+)\)/);
      if (match) return `${match[2]}, ${match[1]}`;
    }
    if ('value' in d.value) return d.value.value;
    if ('lat' in d.value && 'lon' in d.value) return `${d.value.lat}, ${d.value.lon}`;
    return JSON.stringify(d.value);
  }
  return rawValue(d);
}

function getExportFieldValue(rec, fieldName){
  const values = [];
  fieldNames(fieldName).forEach(name => {
    (rec?.details || []).forEach(d => {
      if (d.fieldName !== name) return;
      const value = detailExportValue(d);
      if (value !== null && value !== undefined && String(value).trim() !== '') values.push(String(value));
    });
  });
  return [...new Set(values)].join(' | ');
}

function exportFieldKey(field){
  return (field.label || '').trim().toLowerCase();
}

function buildExportFields(entity){
  const fields = [...(FIELDSETS[entity] || [])];
  const seen = new Set(fields.map(exportFieldKey));
  const records = DATA[entity] || [];
  const names = new Set();

  records.forEach(rec => {
    (rec.details || []).forEach(d => {
      const fieldName = (d.fieldName || '').trim();
      if (!fieldName || HIDE_FIELDS.has(fieldName)) return;
      names.add(fieldName);
    });
  });

  [...names].sort((a, b) => a.localeCompare(b)).forEach(fieldName => {
    const label = LABEL_RENAMES[fieldName] || fieldName;
    const key = label.trim().toLowerCase();
    if (seen.has(key)) return;
    fields.push(access.details(label, fieldName));
    seen.add(key);
  });

  return fields;
}

function openCSVDialog(){
  const fields = buildExportFields(ENTITY);
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
  const fields = buildExportFields(ENTITY);
  return [...$csvFields.querySelectorAll('input[type="checkbox"]')].filter(cb=>cb.checked).map(cb=>fields[parseInt(cb.dataset.idx,10)]);
}
function buildCSV(list, picks, includeHeader){
  const headers = picks.map(p=>csvCell(p.label)).join(',');
  const rows = list.map(r => picks.map(p => csvCell(p.get(r))).join(','));
  return (includeHeader ? headers+'\n' : '') + rows.join('\n');
}
function downloadCSVFromList(){
  // Track CSV export
  if (window.plausible) {
    plausible('Export', { props: { type: 'Browse', format: 'CSV', entity: ENTITY } });
  }
  
  const picks = selectedFieldAccessors();
  if (!picks.length){ alert('Select at least one field.'); return; }
  const list = computeList();
  const csv = buildCSV(list, picks, $csvHeader.checked);
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `export_${ENTITY}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

/* ---------- Events Initialization ---------- */
function initEventListeners() {
  // Entity switching
  const entitySwitch = document.getElementById('entity-switch');
  if (entitySwitch) {
    entitySwitch.addEventListener('click', (e)=>{
      const btn = e.target.closest('.entity-btn'); if (!btn) return;
      switchEntity(btn.dataset.entity);
    });
  } else {
  }
  
  // Pagination
  if ($prev) $prev.addEventListener('click',()=>{ page=Math.max(1,page-1); renderCurrent(); updateAvailableViews(); });
  if ($next) $next.addEventListener('click',()=>{ page=page+1; renderCurrent(); updateAvailableViews(); });
  
  // Page jump functionality
  if ($pageGo) {
    $pageGo.addEventListener('click', ()=>{
      const jumpTo = parseInt($pageJump.value, 10);
      if (jumpTo && jumpTo >= 1) {
        page = jumpTo;
        renderCurrent();
        updateAvailableViews();
      }
    });
  }
  if ($pageJump) {
    $pageJump.addEventListener('keypress', (e)=>{
      if (e.key === 'Enter') {
        const jumpTo = parseInt($pageJump.value, 10);
        if (jumpTo && jumpTo >= 1) {
          page = jumpTo;
          renderCurrent();
          updateAvailableViews();
        }
      }
    });
  }
  
  // Sort and filter
  if ($sort) $sort.addEventListener('change',()=>{ page=1; renderCurrent(); updateAvailableViews(); });
  if ($field) $field.addEventListener('change',()=>{ page=1; renderCurrent(); updateAvailableViews(); });
  if ($search) $search.addEventListener('input', debounce(()=>{ 
    if ($search.value.length > 2) {
      // Track search usage (only for meaningful searches)
      if (window.plausible) {
        plausible('Search', { props: { entity: ENTITY, query_length: $search.value.length } });
      }
    }
    page=1; renderCurrent(); updateAvailableViews(); 
  }, 200));
  
  // Facet clicks
  if ($mount) {
    $mount.addEventListener('click',e=>{
      const chip=e.target.closest('.chip'); if (!chip) return;
      const isActive = chip.classList.contains('is-on');
      const facetText = chip.textContent.trim();
      
      // Track facet usage
      if (window.plausible && !isActive) { // Only track when activating (not deactivating)
        plausible('Facet Used', { props: { entity: ENTITY, facet: facetText.substring(0, 50) } });
      }
      
      chip.classList.toggle('is-on'); page=1; recompute(); updateAvailableViews();
    });
    $mount.addEventListener('change', debounce(()=>{ page=1; recompute(); updateAvailableViews(); },150));
  }
  
  // Clear all filters
  const btnClear = document.getElementById('btn-clear');
  if (btnClear) {
    btnClear.addEventListener('click', ()=>{
      if ($mount) {
        $mount.querySelectorAll('input').forEach(i=>{ if (i.type==='checkbox') i.checked=false; else i.value=''; });
        $mount.querySelectorAll('.chip.is-on').forEach(c=>c.classList.remove('is-on'));
      }
      if ($search) $search.value='';
      if ($field) $field.value='';
      if ($sort) $sort.value='';
      setAdvancedSearchActive(false);
      page=1;
      recompute(); updateAvailableViews();
    });
  }

  if ($btnAdvanced && $advancedPanel) {
    $btnAdvanced.addEventListener('click', () => {
      const open = $advancedPanel.hidden;
      $advancedPanel.hidden = !open;
      $btnAdvanced.setAttribute('aria-expanded', String(open));
    });
  }

  if ($advancedAdd) {
    $advancedAdd.addEventListener('click', () => {
      addAdvancedCondition({ entity: $advancedResultType?.value || ENTITY });
    });
  }

  if ($advancedList) {
    $advancedList.addEventListener('change', e => {
      const row = e.target.closest('.advanced-condition');
      if (!row) return;
      if (e.target.classList.contains('condition-entity')) {
        populateConditionFields(row);
      } else if (e.target.classList.contains('condition-field')) {
        updateConditionValueControl(row);
      }
    });
    $advancedList.addEventListener('click', e => {
      const btn = e.target.closest('.condition-remove');
      if (!btn) return;
      const row = btn.closest('.advanced-condition');
      if (row) row.remove();
      if (!$advancedList.children.length) addAdvancedCondition({ entity: $advancedResultType?.value || ENTITY });
      updateAdvancedStatus();
      if (advancedSearchActive) { page = 1; recompute(); updateAvailableViews(); }
    });
  }

  if ($advancedApply) {
    $advancedApply.addEventListener('click', () => {
      const targetType = $advancedResultType?.value || ENTITY;
      if (targetType !== ENTITY) {
        ENTITY = targetType;
        document.querySelectorAll('#entity-switch .entity-btn').forEach(c=>c.classList.toggle('is-on', c.dataset.entity===targetType));
        $search.value=''; $field.value=''; $sort.value='';
        $mount.innerHTML = '';
      }
      setAdvancedSearchActive(true);
      page = 1;
      recompute(true);
      updateAvailableViews();
    });
  }

  if ($advancedClear) {
    $advancedClear.addEventListener('click', () => {
      setAdvancedSearchActive(false);
      if ($advancedList) {
        $advancedList.innerHTML = '';
        addAdvancedCondition({ entity: $advancedResultType?.value || ENTITY });
      }
      page = 1;
      recompute();
      updateAvailableViews();
    });
  }
  
  // Export
  if ($btnExport) $btnExport.addEventListener('click', openCSVDialog);
  if ($csvAll) $csvAll.addEventListener('click', ()=>{ $csvFields.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.checked=true); });
  if ($csvNone) $csvNone.addEventListener('click', ()=>{ $csvFields.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.checked=false); });
  if ($csvGo) $csvGo.addEventListener('click', (e)=>{ e.preventDefault(); downloadCSVFromList(); $csvDialog.close(); });
  
  // Results card clicks
  if ($results) {
    $results.addEventListener('click', e=>{
      const card=e.target.closest('.db-card');
      if (!card) return;
      e.preventDefault();
      const rid=card.dataset.rid, type=card.dataset.type;
      if (!rid||!type) return;
      const rec=IDX[type][rid]; if (!rec) return;
      if (e.ctrlKey||e.metaKey){ jumpTo(rec,type); return; }
      document.querySelectorAll('.db-card.is-selected').forEach(c=>c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      showDetails(rec,type);
    });
  }
  
  // Network view selector
  const networkViewSelector = document.getElementById('network-view-selector');
  if (networkViewSelector) {
    networkViewSelector.addEventListener('change', () => {
      const url = new URL(window.location.href);
      url.searchParams.set('networkView', networkViewSelector.value);
      if (networkViewSelector.value !== 'sample') {
        ['networkSeed', 'networkSample', 'networkTypes'].forEach(key => url.searchParams.delete(key));
      }
      window.history.replaceState({}, '', url);
      if (ACTIVE_MODE === 'network') buildNetworkView();
    });
  }
  
  // Network search
  const networkSearchInput = document.getElementById('network-search-input');
  if (networkSearchInput) {
    networkSearchInput.addEventListener('input', debounce(() => {
      const query = networkSearchInput.value.trim().toLowerCase();
      const resultsDiv = document.getElementById('network-search-results');
      if (!resultsDiv) return;
      
      if (query.length < 2) {
        resultsDiv.innerHTML = '';
        return;
      }
      
      // Search across all entity types
      const allRecords = Object.entries(DATA)
        .filter(([type]) => type !== 'rel')
        .flatMap(([type, records]) => records.map(rec => ({ rec, type })));
      
      const matches = allRecords.filter(({ rec, type }) => {
        const title = MAP[type].title(rec).toLowerCase();
        return title.includes(query);
      }).slice(0, 20);
      
      if (matches.length === 0) {
        resultsDiv.innerHTML = '<div class="empty-search-message">No records found</div>';
        return;
      }
      
      resultsDiv.innerHTML = matches.map(({ rec, type }) => {
        const title = esc(MAP[type].title(rec));
        const entityLabel = type.toUpperCase();
        return `<div class="network-search-result" data-type="${type}" data-id="${rec.rec_ID}">
          <strong>${title}</strong> <span class="search-result-entity-label">[${entityLabel}]</span>
        </div>`;
      }).join('');
    }, 300));
  }
  
  // Network search results click
  const networkSearchResults = document.getElementById('network-search-results');
  if (networkSearchResults) {
    networkSearchResults.addEventListener('click', (e) => {
      const result = e.target.closest('.network-search-result');
      if (!result) return;
      
      const type = result.dataset.type;
      const id = result.dataset.id;
      const rec = IDX[type][String(id)];
      if (!rec) return;
      
      NETWORK_CURRENT_REC = rec;
      NETWORK_CURRENT_TYPE = type;
      buildRecordNetwork(rec, type);
    });
  }
  
  // Network filters toggle
  document.getElementById('network-filters-toggle')?.addEventListener('click', () => {
    const panel = document.getElementById('network-filters-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  });
  
  // Network entity type filters
  document.querySelectorAll('.network-entity-filter').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (ACTIVE_MODE === 'network') buildNetworkView();
    });
  });
  
  // Clear all filters
  document.getElementById('network-clear-filters')?.addEventListener('click', () => {
    // Reset entity type checkboxes
    document.querySelectorAll('.network-entity-filter').forEach(cb => cb.checked = true);
    // Reset color scheme and link density
    const colorScheme = document.getElementById('network-color-scheme');
    if (colorScheme) colorScheme.value = 'type';
    const linkDensity = document.getElementById('network-link-density');
    if (linkDensity) {
      linkDensity.value = 100;
      document.getElementById('network-link-density-value').textContent = '100%';
    }
    // Rebuild
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network zoom controls
  document.getElementById('network-zoom-in')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._svg && mount._zoom) {
      mount._svg.transition().duration(300).call(mount._zoom.scaleBy, 1.3);
    }
  });
  
  document.getElementById('network-zoom-out')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._svg && mount._zoom) {
      mount._svg.transition().duration(300).call(mount._zoom.scaleBy, 0.7);
    }
  });
  
  document.getElementById('network-zoom-reset')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._svg && mount._zoom) {
      mount._svg.transition().duration(500).call(mount._zoom.transform, d3.zoomIdentity);
    }
  });
  
  document.getElementById('network-zoom-fit')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._svg && mount._zoom && mount._g) {
      // Get bounds of all nodes
      try {
        const bounds = mount._g.node().getBBox();
        const width = mount.clientWidth || 800;
        const height = mount.clientHeight || 600;
        
        const dx = bounds.width;
        const dy = bounds.height;
        const x = bounds.x + bounds.width / 2;
        const y = bounds.y + bounds.height / 2;
        
        const scale = Math.min(0.9 / Math.max(dx / width, dy / height), 3);
        const translate = [width / 2 - scale * x, height / 2 - scale * y];
        
        const transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
        mount._svg.transition().duration(750).call(mount._zoom.transform, transform);
      } catch (e) {
      }
    }
  });
  
  // Network refresh
  document.getElementById('network-refresh')?.addEventListener('click', () => {
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network show labels
  document.getElementById('network-show-labels')?.addEventListener('change', () => {
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network depth control
  document.getElementById('network-depth')?.addEventListener('change', () => {
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network color scheme selector
  document.getElementById('network-color-scheme')?.addEventListener('change', () => {
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network dark mode toggle
  document.getElementById('network-dark-mode')?.addEventListener('change', (e) => {
    const isDark = e.target.checked;
    const mount = document.getElementById('network-mount');
    const controls = document.getElementById('network-controls');
    const legend = document.getElementById('network-legend');
    
    if (isDark) {
      mount.style.background = '#0a0e1a';
      controls.style.background = '#1a1e2a';
      controls.style.color = '#e0e0e0';
      if (legend) {
        legend.style.background = 'rgba(26, 30, 42, 0.95)';
        legend.style.color = '#e0e0e0';
        legend.style.borderColor = '#3a3e4a';
      }
      // Store dark mode state for label rendering
      mount.dataset.darkMode = 'true';
    } else {
      mount.style.background = '#fff';
      controls.style.background = '#fff';
      controls.style.color = '#333';
      if (legend) {
        legend.style.background = 'rgba(255, 255, 255, 0.95)';
        legend.style.color = '#333';
        legend.style.borderColor = '#ddd';
      }
      mount.dataset.darkMode = 'false';
    }
    
    // Rebuild network to update label colors
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network link density slider
  document.getElementById('network-link-density')?.addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('network-link-density-value').textContent = value + '%';
  });
  
  document.getElementById('network-link-density')?.addEventListener('change', () => {
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network relationship filter
  document.getElementById('network-rel-filter')?.addEventListener('change', () => {
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  document.getElementById('network-clear-filter')?.addEventListener('click', () => {
    const select = document.getElementById('network-rel-filter');
    if (select) {
      select.value = '';
      if (ACTIVE_MODE === 'network') buildNetworkView();
    }
  });
  
  // Network export dropdown
  document.getElementById('network-export-format')?.addEventListener('change', (e) => {
    const format = e.target.value;
    if (format) {
      exportCurrentNetwork(format);
      // Reset dropdown to placeholder
      e.target.value = '';
    }
  });
  
  // === IMAGE EXPORT LISTENERS ===
  
  // Map PNG export
  document.getElementById('map-export-image')?.addEventListener('click', () => {
    const filename = `unknownhands-map-${Date.now()}.png`;
    exportMapAsPng('map-mount', filename);
  });
  
  // Network SVG export
  document.getElementById('network-export-svg')?.addEventListener('click', () => {
    // Track network SVG export
    if (window.plausible) {
      const depth = document.getElementById('network-depth')?.value || '1';
      plausible('Export', { props: { type: 'Network', format: 'SVG', depth: depth } });
    }
    
    const mount = document.getElementById('network-mount');
    // Check for SVG either as D3 selection or direct query
    let svg = null;
    if (mount?._d3Svg) {
      svg = mount._d3Svg.node ? mount._d3Svg.node() : mount._d3Svg;
    } else {
      svg = mount?.querySelector('svg');
    }
    
    if (svg) {
      const depth = document.getElementById('network-depth')?.value || '1';
      const filename = `unknownhands-network-depth${depth}-${Date.now()}.svg`;
      exportSvgAsSvg(svg, filename);
    } else {
      alert('No network visualization to export\n\nPlease generate a network first.');
    }
  });
  
  // Network PNG export
  document.getElementById('network-export-png')?.addEventListener('click', () => {
    // Track network PNG export
    if (window.plausible) {
      const depth = document.getElementById('network-depth')?.value || '1';
      plausible('Export', { props: { type: 'Network', format: 'PNG', depth: depth } });
    }
    
    const mount = document.getElementById('network-mount');
    // Check for SVG either as D3 selection or direct query
    let svg = null;
    if (mount?._d3Svg) {
      svg = mount._d3Svg.node ? mount._d3Svg.node() : mount._d3Svg;
    } else {
      svg = mount?.querySelector('svg');
    }
    
    if (svg) {
      const depth = document.getElementById('network-depth')?.value || '1';
      const filename = `unknownhands-network-depth${depth}-${Date.now()}.png`;
      exportSvgAsPng(svg, filename, 3); // 3x scale for ~300 DPI
    } else {
      alert('No network visualization to export\n\nPlease generate a network first.');
    }
  });
  
  // Timeline SVG export
  document.getElementById('timeline-export-svg')?.addEventListener('click', () => {
    // Track timeline SVG export
    if (window.plausible) {
      plausible('Export', { props: { type: 'Timeline', format: 'SVG' } });
    }
    
    const mount = document.getElementById('timeline-mount');
    const svg = mount?.querySelector('svg');
    if (svg) {
      const filename = `unknownhands-timeline-${Date.now()}.svg`;
      exportSvgAsSvg(svg, filename);
    } else {
      alert('No timeline visualization to export\n\nPlease switch to Timeline view first.');
    }
  });
  
  // Timeline PNG export
  document.getElementById('timeline-export-png')?.addEventListener('click', () => {
    // Track timeline PNG export
    if (window.plausible) {
      plausible('Export', { props: { type: 'Timeline', format: 'PNG' } });
    }
    
    const mount = document.getElementById('timeline-mount');
    const svg = mount?.querySelector('svg');
    if (svg) {
      const filename = `unknownhands-timeline-${Date.now()}.png`;
      exportSvgAsPng(svg, filename, 3); // 3x scale for ~300 DPI
    } else {
      alert('No timeline visualization to export\n\nPlease switch to Timeline view first.');
    }
  });
  
  // Analytics PNG export
  document.getElementById('analytics-export-png')?.addEventListener('click', () => {
    exportAnalyticsVisualization('png');
  });
}


/* PATH FINDING DIALOG REMOVED */

/* EXPORTS EXTRACTED */

/* Analytics Module delegated to window.ExploreAnalytics */
let AnalyticsModule = null;
function buildAnalytics() { if(AnalyticsModule) return AnalyticsModule.buildAnalytics(); }
let HierarchicalTreeModule = null;
function buildHierarchicalTree() { if(HierarchicalTreeModule) return HierarchicalTreeModule.buildHierarchicalTree(); }
let ScribesModule = null;
function buildScribes() { if(ScribesModule) return ScribesModule.buildScribes(); }
let ColophonAnalysisModule = null;
function buildColophonAnalysis() { if(ColophonAnalysisModule) return ColophonAnalysisModule.buildColophonAnalysis(); }
let ExportModule = null;


/* Multilingualism Module delegated to window.ExploreMultilingualism */
let MultilingualismModule = null;
function buildMultilingualism() { if(MultilingualismModule) return MultilingualismModule.buildMultilingualism(); }

/* ---------- Initialization of submodules ---------- */
const Core = {
  get DATA() { return DATA; },
  get IDX() { return IDX; },
  get activeEntity() { return activeEntity; },
  get ENTITY() { return ENTITY; },
  get REL_INDEX() { return REL_INDEX; },
  get REC_TYPE_TO_ENTITY() { return REC_TYPE_TO_ENTITY; },
  get INBOUND() { return INBOUND; },
  getDATA: () => DATA,
  getIDX: () => IDX,
  getREL_INDEX: () => REL_INDEX,
  getREC_TYPE_TO_ENTITY: () => REC_TYPE_TO_ENTITY,
  getACTIVE_MODE: () => ACTIVE_MODE,
  val, getVal, getDetail,
    getRes,
    getVal, getRes, getDetailsAll, getValsAll, getControlledValsAll, esc,
  $panes, $tabs, $mapTitle, supportsTimeline, 
  TimelineModule, formatYear, 
  exportMapAsPng, exportAnalyticsVisualization, ensureLeaflet,
  exportTreeItemAsSvg, exportTreeItemAsPng,
  createExportButton: (...args) => window.createExportButton(...args),
  createEmbedButton: (...args) => window.createEmbedButton(...args),
  linkTo, jumpTo, debounce, flat,
  showNetworkNodeDetails,
  MAP,
  // Browse functions
  buildFacets, readFacetState, applyFacets, applySearch, sorters,
  computeList, renderCurrent, recompute, render, showDetails,
  // State
  ACTIVE_MODE, ACTIVE_VIEW, ENTITY, page, pageSize,
  setMode, setView, switchEntity,
  updateExploreUrl, enhanceExploreTabList, syncExploreTabList,
  isKnownCategory,
  updateAvailableViews,
  // Page refs
  $search: document.getElementById('db-search'),
  $field: document.getElementById('db-field'),
  $sort: document.getElementById('db-sort'),
  $results: document.getElementById('db-results'),
  $status: document.getElementById('db-status'),
  $pager: document.getElementById('db-pager'),
  $page: document.getElementById('db-page'),
  $pageJump: document.getElementById('db-page-jump'),
  $mount: document.getElementById('facet-mount'),
  $viz: document.getElementById('db-viz'),
  $prev: document.getElementById('db-prev'),
  $next: document.getElementById('db-next'),
  getRelationshipValues,
  FACETS,
  HIDE_FIELDS, LABEL_RENAMES, SECTIONED_FIELDS, INCLUDE_REST,
  renderDetailRows,
  NETWORK_CURRENT_REC, NETWORK_CURRENT_TYPE
};
// Export helpers are required by several dynamically rendered feature modules.
if (window.ExploreExport && typeof window.ExploreExport.init === 'function') {
  ExportModule = window.ExploreExport.init(Core);
  Core.ExportModule = ExportModule;
}
MapModule = window.ExploreMap.init(Core);
TimelineModule = window.ExploreTimeline.init(Core);
// Initialize utils module for shared helpers
UtilsModule = window.ExploreUtils.init(Core);
Core.UtilsModule = UtilsModule;
NetworkModule = window.ExploreNetwork.init(Core);
AnalyticsModule = window.ExploreAnalytics.init(Core);
HierarchicalTreeModule = window.ExploreHierarchicalTree.init(Core);
MultilingualismModule = window.ExploreMultilingualism.init(Core);
Core.MultilingualismModule = MultilingualismModule;
ScribesModule = window.ExploreScribes.init(Core);
ColophonAnalysisModule = window.ExploreColophonAnalysis.init(Core);
TextGenresModule = window.ExploreTextGenres.init(Core);
PathFindingModule = window.ExplorePathFinding.init(Core);
// Expose legacy global aliases expected by some modules/templates
try { if (typeof exportMapAsPng === 'function') window.exportMapAsPNG = exportMapAsPng; } catch(e){}
try { if (typeof exportAnalyticsVisualization === 'function') window.exportAnalyticsVisualization = exportAnalyticsVisualization; } catch(e){}
try { if (typeof exportTreeItemAsPng === 'function') window.exportTreeItemAsPng = exportTreeItemAsPng; } catch(e){}
try { if (typeof exportTreeItemAsSvg === 'function') window.exportTreeItemAsSvg = exportTreeItemAsSvg; } catch(e){}

/* ---------- UI Generation from Config ---------- */
function initUIFromConfig() {
  if (!window.ExploreConfig) return; // config not loaded
  const config = window.ExploreConfig;
  
  // Populate search field dropdown
  const dbField = document.getElementById('db-field');
  if (dbField) {
    dbField.innerHTML = '';
    config.browse.searchFields.forEach(field => {
      const opt = document.createElement('option');
      opt.value = field.value;
      opt.textContent = field.label;
      dbField.appendChild(opt);
    });
  }
  
  // Populate sort dropdown
  const dbSort = document.getElementById('db-sort');
  if (dbSort) {
    dbSort.innerHTML = '';
    config.browse.sortOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.label;
      dbSort.appendChild(opt);
    });
  }
  
  // Populate map view selector
  const mapViewSelector = document.getElementById('map-view-selector');
  if (mapViewSelector) {
    mapViewSelector.innerHTML = '';
    config.map.views.forEach(view => {
      const opt = document.createElement('option');
      opt.value = view.value;
      opt.textContent = view.label;
      mapViewSelector.appendChild(opt);
    });
  }
  
  // Populate timeline color scheme
  const timelineColorBy = document.getElementById('timeline-color-by');
  if (timelineColorBy) {
    timelineColorBy.innerHTML = '';
    config.timeline.colorByOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.label;
      timelineColorBy.appendChild(opt);
    });
  }
  
  // Populate network view selector
  const networkViewSelector = document.getElementById('network-view-selector');
  if (networkViewSelector) {
    networkViewSelector.innerHTML = '';
    config.network.views.forEach(view => {
      const opt = document.createElement('option');
      opt.value = view.value;
      opt.textContent = view.label;
      networkViewSelector.appendChild(opt);
    });
    const requestedNetworkView = new URLSearchParams(window.location.search).get('networkView');
    if (config.network.views.some(view => view.value === requestedNetworkView)) {
      networkViewSelector.value = requestedNetworkView;
    }
  }
  
  // Populate network color scheme
  const networkColorScheme = document.getElementById('network-color-scheme');
  if (networkColorScheme) {
    networkColorScheme.innerHTML = '';
    config.network.colorByOptions.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.value;
      opt.textContent = option.label;
      networkColorScheme.appendChild(opt);
    });
  }
}

/* ---------- Boot ---------- */
async function boot(){
  // Initialize UI from config (populate dropdowns, etc.)
  initUIFromConfig();
  
  $status.textContent='Loading data…';
  const [su, ms, pu, hi, mi, hp, tx, rel] = await Promise.all([
    fetchHeuristRecords(SU_ENDPOINT, EXPECT_TYPE.su),
    fetchHeuristRecords(MS_ENDPOINT, EXPECT_TYPE.ms),
    fetchHeuristRecords(PU_ENDPOINT, EXPECT_TYPE.pu),
    fetchHeuristRecords(HI_ENDPOINT, EXPECT_TYPE.hi),
    fetchHeuristRecords(MI_ENDPOINT, EXPECT_TYPE.mi),
    fetchHeuristRecords(HP_ENDPOINT, EXPECT_TYPE.hp),
    fetchHeuristRecords(TX_ENDPOINT, EXPECT_TYPE.tx),
    fetchHeuristRecords(REL_ENDPOINT, 1)
  ]);
  DATA = { su:dedupeById(su), ms:dedupeById(ms), pu:dedupeById(pu), hi:dedupeById(hi), mi:dedupeById(mi), hp:dedupeById(hp), tx:dedupeById(tx), rel:dedupeById(rel) };
  indexAll(); buildTypeMap(); indexPointers(); indexRelationships();
  
  // Filter Historical People to only show those linked to Scribal Units via "scribe of" relationship
  const linkedHPIds = new Set();
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const relType = getVal(rel, 'Relationship type');
    
    // Check if relationship is "scribe of" from SU to HP
    if (src && tgt && relType && relType.toLowerCase().includes('scribe')) {
      const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
      
      if (srcType === 'su' && tgtType === 'hp') {
        linkedHPIds.add(String(tgt.id));
      }
    }
  });
  DATA.hp = DATA.hp.filter(hp => linkedHPIds.has(String(hp.rec_ID)));
  
  // Filter Monastic Institutions to show only those linked to PUs or HPs
  const linkedMIIds = new Set();
  
  // Check for PUs pointing to MIs (pointer field)
  DATA.pu.forEach(pu => {
    (pu.details || []).forEach(d => {
      const v = d?.value;
      if (v && typeof v === 'object' && v.id && v.type) {
        const toType = REC_TYPE_TO_ENTITY[String(v.type)];
        if (toType === 'mi') {
          linkedMIIds.add(String(v.id));
        }
      }
    });
  });
  
  // Check for relationships from HPs to MIs (nun, prioress, abbess, etc.)
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const relType = getVal(rel, 'Relationship type');
    
    if (src && tgt && relType) {
      const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
      const relTypeLower = relType.toLowerCase();
      
      // Check if relationship is from HP to MI with relevant relationship types
      if (srcType === 'hp' && tgtType === 'mi' && 
          (relTypeLower.includes('nun') || relTypeLower.includes('prioress') || 
           relTypeLower.includes('abbess') || relTypeLower.includes('sister') || 
           relTypeLower.includes('member'))) {
        linkedMIIds.add(String(tgt.id));
      }
    }
  });
  
  DATA.mi = DATA.mi.filter(mi => linkedMIIds.has(String(mi.rec_ID)));
  
  // Filter Texts to show only those linked to PUs or SUs via "contains" relationship
  const linkedTXIds = new Set();
  
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const relType = getVal(rel, 'Relationship type');
    
    if (src && tgt && relType) {
      const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
      const relTypeLower = relType.toLowerCase();
      
      // Check if relationship is "contains" from PU or SU to Text
      if ((srcType === 'pu' || srcType === 'su') && tgtType === 'tx' && relTypeLower.includes('contains')) {
        linkedTXIds.add(String(tgt.id));
      }
    }
  });
  
  DATA.tx = DATA.tx.filter(tx => linkedTXIds.has(String(tx.rec_ID)));
  
  // Re-index after filtering
  indexAll(); buildTypeMap(); indexPointers();
  resetAdvancedCaches();
  
  // Initialize all event listeners
  initModeNavigation();
  initEventListeners();
  initAdvancedSearchUI();
  
  buildFacets(DATA.su, FACETS.su);
  render(DATA.su, 'su');
  updateAvailableViews();
  $status.textContent='';
  
  // Check for embed mode and URL parameters
  const params = new URLSearchParams(window.location.search);
  const embedMode = params.get('embed') === 'true';
  const networkParam = params.get('network'); // e.g., 'manuscript-genre', 'institution-subgenre', 'scribe-genre'
  const modeParam = params.get('mode'); // e.g., 'text-genres', 'scribes'
  const tabParam = params.get('tab'); // e.g., 'manuscript-networks', 'institution-networks'
  const browseTypeParam = params.get('type') || params.get('entity');
  const browseIdParam = params.get('id') || params.get('browse');
  
  if (embedMode) {
    // Hide header, footer, and main navigation for clean embed
    document.body.classList.add('embed-mode');
    
    // Force full width on html and body elements
    document.documentElement.style.cssText = 'width: 100%; max-width: 100%; margin: 0; padding: 0;';
    document.body.style.cssText = 'width: 100%; max-width: 100%; margin: 0; padding: 0; overflow-x: hidden;';
    
    // Hide all page elements except the network
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const mainNav = document.getElementById('main-nav-tabs');
    const banner = document.querySelector('.page-banner');
    const pageHeader = document.querySelector('.page-header');
    const siteHeader = document.querySelector('.site-header');
    const navBar = document.querySelector('nav');
    const allBanners = document.querySelectorAll('[class*="banner"]');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (mainNav) mainNav.style.display = 'none';
    if (banner) banner.style.display = 'none';
    if (pageHeader) pageHeader.style.display = 'none';
    if (siteHeader) siteHeader.style.display = 'none';
    if (navBar) navBar.style.display = 'none';
    allBanners.forEach(b => b.style.display = 'none');
    
    // Add embed-specific styles
    const embedStyles = document.createElement('style');
    embedStyles.textContent = `
      .embed-mode header,
      .embed-mode footer,
      .embed-mode nav,
      .embed-mode .page-header,
      .embed-mode .site-header,
      .embed-mode .page-banner,
      .embed-mode [class*="banner"] { display: none !important; }
      
      .embed-mode .explore-fullwidth { 
        padding: 0 !important; 
        margin: 0 !important; 
        width: 100% !important;
        max-width: 100% !important; 
      }
      .embed-mode .db-shell { 
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .embed-mode h1 { display: none !important; }
      .embed-mode body { 
        margin: 0 !important; 
        padding: 0 !important; 
        overflow-x: hidden !important; 
      }
      .embed-mode .genre-tabs { display: none !important; }
      .embed-mode .scribe-tabs { display: none !important; }
      .embed-mode .mode-container > div:first-child { border: none !important; }
      .embed-mode .viz-head { display: none !important; }
      .embed-mode .mode-container { 
        width: 100% !important; 
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .embed-mode #genre-tab-content { 
        padding: 1rem !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .embed-mode #genre-tab-content > div { 
        width: 100% !important;
        max-width: 100% !important; 
        margin: 0 !important; 
      }
      .embed-mode .mode-container > .viz-card {
        box-shadow: none !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .embed-mode .viz-body {
        width: 100% !important;
        max-width: 100% !important;
        padding: 1rem !important;
      }
    `;
    document.head.appendChild(embedStyles);
    
    // Handle different embed modes
    if (modeParam === 'text-genres' && tabParam) {
      // Embed specific network from Text Genres mode
      setTimeout(() => {
        const modeBtn = document.querySelector('[data-mode="text-genres"]');
        if (modeBtn) {
          modeBtn.click();
          
          setTimeout(() => {
            const tabBtn = document.querySelector(`.genre-tab-btn[data-tab="${tabParam}"]`);
            if (tabBtn) {
              tabBtn.click();
              
              // Wait for network to render, then apply embed-specific changes
              setTimeout(() => {
                // Hide description paragraphs
                const descParagraphs = document.querySelectorAll('#genre-tab-content > div > p');
                descParagraphs.forEach(p => p.style.display = 'none');
                
                // Force width recalculation
                setTimeout(() => {
                  const containers = document.querySelectorAll('#ms-network-viz, #inst-network-viz, #scribe-network-viz');
                  containers.forEach(container => {
                    const svg = container.querySelector('svg');
                    if (svg && container.clientWidth) {
                      const width = container.clientWidth;
                      const height = 900;
                      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                    }
                  });
                }, 500);
                
                // Apply network-specific parameters
                if (networkParam && networkParam.includes('subgenre')) {
                  const subgenreBtn = document.querySelector('.network-mode-btn[data-mode="subgenre"]');
                  if (subgenreBtn && !subgenreBtn.classList.contains('is-active')) {
                    subgenreBtn.click();
                  }
                }
                
                const layoutParam = params.get('layout');
                if (layoutParam === 'radial') {
                  setTimeout(() => {
                    const radialBtn = document.querySelector('[data-layout="radial"]');
                    if (radialBtn && !radialBtn.classList.contains('is-active')) {
                      radialBtn.click();
                    }
                  }, 200);
                }
              }, 500);
            }
          }, 300);
        }
      }, 100);
    } else if (modeParam === 'scribes') {
      // Embed from Scribes mode
      setTimeout(() => {
        const modeBtn = document.querySelector('[data-mode="scribes"]');
        if (modeBtn) {
          modeBtn.click();
          
          // If a specific tab is requested (e.g., collaboration)
          if (tabParam) {
            setTimeout(() => {
              const tabBtn = document.querySelector(`.scribe-tab-btn[data-tab="${tabParam}"]`);
              if (tabBtn) {
                tabBtn.click();
                
                // Handle layout parameter for collaboration network
                setTimeout(() => {
                  const layoutParam = params.get('layout');
                  if (layoutParam === 'force') {
                    const forceBtn = document.querySelector('[data-layout="force"].collab-layout-toggle-btn');
                    if (forceBtn && !forceBtn.classList.contains('is-active')) {
                      forceBtn.click();
                    }
                  }
                }, 500);
              }
            }, 300);
          }
        }
      }, 100);
    } else if (networkParam === 'scribe-collaborations') {
      // Embed scribe collaborations network
      setTimeout(() => {
        const scribesBtn = document.querySelector('[data-mode="scribes"]');
        if (scribesBtn) {
          scribesBtn.click();
          
          setTimeout(() => {
            const collabTab = document.querySelector('.scribe-tab-btn[data-tab="collaboration"]');
            if (collabTab) {
              collabTab.click();
              
              // Handle layout parameter
              setTimeout(() => {
                const layoutParam = params.get('layout');
                if (layoutParam === 'force') {
                  const forceBtn = document.querySelector('[data-layout="force"].collab-layout-toggle-btn');
                  if (forceBtn && !forceBtn.classList.contains('is-active')) {
                    forceBtn.click();
                  }
                }
              }, 500);
            }
          }, 300);
        }
      }, 100);
    } else if (networkParam) {
      // Embed from Network mode
      setTimeout(() => {
        const networkModeBtn = document.querySelector('[data-mode="network"]');
        if (networkModeBtn) {
          networkModeBtn.click();
          
          setTimeout(() => {
            const tabMap = {
              'manuscript-genre': 'manuscript-networks',
              'manuscript-subgenre': 'manuscript-networks',
              'institution-genre': 'institution-networks',
              'institution-subgenre': 'institution-networks',
              'scribe-genre': 'scribe-networks',
              'scribe-subgenre': 'scribe-networks'
            };
            
            const tabName = tabMap[networkParam];
            if (tabName) {
              const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
              if (tabBtn) {
                tabBtn.click();
                
                setTimeout(() => {
                  const descParagraphs = document.querySelectorAll('#genre-tab-content > div > p');
                  descParagraphs.forEach(p => p.style.display = 'none');
                  
                  // Force width recalculation
                  setTimeout(() => {
                    const containers = document.querySelectorAll('#ms-network-viz, #inst-network-viz, #scribe-network-viz');
                    containers.forEach(container => {
                      const svg = container.querySelector('svg');
                      if (svg && container.clientWidth) {
                        const width = container.clientWidth;
                        const height = 900;
                        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
                      }
                    });
                  }, 500);
                  
                  if (networkParam.includes('subgenre')) {
                    const subgenreBtn = document.querySelector('.network-mode-btn[data-mode="subgenre"]');
                    if (subgenreBtn && !subgenreBtn.classList.contains('is-active')) {
                      subgenreBtn.click();
                    }
                  }
                  
                  const layoutParam = params.get('layout');
                  if (layoutParam === 'radial') {
                    setTimeout(() => {
                      const radialBtn = document.querySelector('[data-layout="radial"]');
                      if (radialBtn && !radialBtn.classList.contains('is-active')) {
                        radialBtn.click();
                      }
                    }, 200);
                  }
                }, 500);
              }
            }
          }, 300);
        }
      }, 100);
    }
  }

  // Normal (non-embed) links can open any mode and thematic subtab directly.
  if (!embedMode && modeParam && modeParam !== 'browse') {
    applyExploreLocation();
  }
  
  // Check for URL parameters to auto-navigate to a specific record
  const slugParam = params.get('slug');
  const typeParam = params.get('type') || 'ms';
  
  if (slugParam && typeParam === 'ms') {
    const manuscripts = Object.values(IDX.ms || {});
    for (const ms of manuscripts) {
      const msSlug = `ms-${ms.rec_ID}`;
      if (msSlug === slugParam) {
        setTimeout(() => jumpTo('ms', String(ms.rec_ID)), 100);
        break;
      }
    }
  }

  if (modeParam === 'browse' || browseTypeParam || browseIdParam) {
    const targetType = browseTypeParam || ENTITY;
    if (targetType && targetType !== ENTITY) {
      switchEntity(targetType);
    }
    if (browseIdParam) {
      jumpTo(targetType, browseIdParam);
    } else {
      setMode('browse');
    }
  }
}


function buildTextGenres() { if(TextGenresModule) return TextGenresModule.buildTextGenres(); }
function buildManuscriptGenreNetwork() { if(TextGenresModule) return TextGenresModule.buildManuscriptGenreNetwork(); }
function buildManuscriptSubgenreNetwork() { if(TextGenresModule) return TextGenresModule.buildManuscriptSubgenreNetwork(); }
function buildManuscriptNetwork(levelFilter = 'genre', layout = 'horizontal') { if(TextGenresModule) return TextGenresModule.buildManuscriptNetwork(levelFilter, layout); }
function buildGenreDistributions() { if(TextGenresModule) return TextGenresModule.buildGenreDistributions(); }
function buildGenresByInstitution() { if(TextGenresModule) return TextGenresModule.buildGenresByInstitution(); }
function buildGenresByLocation() { if(TextGenresModule) return TextGenresModule.buildGenresByLocation(); }
function buildGenresOverTime() { if(TextGenresModule) return TextGenresModule.buildGenresOverTime(); }
function buildInstitutionGenreNetwork() { if(TextGenresModule) return TextGenresModule.buildInstitutionGenreNetwork(); }
function buildInstitutionSubgenreNetwork() { if(TextGenresModule) return TextGenresModule.buildInstitutionSubgenreNetwork(); }
function buildInstitutionNetwork(levelFilter = 'genre', layout = 'horizontal') { if(TextGenresModule) return TextGenresModule.buildInstitutionNetwork(levelFilter, layout); }
function buildScribeGenreNetwork() { if(TextGenresModule) return TextGenresModule.buildScribeGenreNetwork(); }
function buildScribeSubgenreNetwork() { if(TextGenresModule) return TextGenresModule.buildScribeSubgenreNetwork(); }
function buildScribeNetwork(levelFilter = 'genre', layout = 'horizontal') { if(TextGenresModule) return TextGenresModule.buildScribeNetwork(levelFilter, layout); }

boot();

/* Expose a couple for debugging */
window.jumpTo = jumpTo;
window.renderCurrent = renderCurrent;
})();
