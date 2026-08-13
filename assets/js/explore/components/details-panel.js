/**
 * Details panel rendering for entity records
 */

import { esc, getVal, getRes, getDetail, rawValue } from '../core/utils.js';
import { MAP } from './facets.js';

/**
 * Fields to hide in details panel
 */
export const HIDE_FIELDS = new Set([
  'Cataloguing',
  'Catalogue Record Link(s)',
  'Cataloging',
  'Seen in Person',
]);

/**
 * Field label renames
 */
export const LABEL_RENAMES = {
  'Normalized terminus post quem': 'Terminus post quem',
  'Normalized terminus ante quem': 'Terminus ante quem',
  'Normalised script(s)': 'Script(s)',
};

/**
 * Field display order per entity type
 */
export const ORDER_FIELDS = {
  su: [
    'SU dating',
    'Normalized century of production',
    'Normalized terminus post quem',
    'Normalized terminus ante quem',
    'Manuscript',
    'Normalised script(s)',
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
};

/** Include fields not in ORDER_FIELDS */
const INCLUDE_REST = true;

/**
 * Create clickable link to another entity
 */
export function linkTo(type, id, text) {
  if (!id) return esc(text || '');
  return `<button type="button" class="linklike" data-jump='${type}:${String(id)}'>${esc(text || '')}</button>`;
}

/**
 * Render detail rows for an entity
 * @param {Object} rec - Record object
 * @param {string} entity - Entity type
 * @param {Object} IDX - Index of all records
 * @param {Object} REC_TYPE_TO_ENTITY - Mapping of record types
 * @returns {string} HTML string
 */
export function renderDetailRows(rec, entity, IDX, REC_TYPE_TO_ENTITY) {
  if (!rec) return '<div class="muted">No details available.</div>';

  const details = rec.details || [];

  // Build a map: fieldName -> [detail, detail, ...]
  const byField = new Map();
  for (const d of details) {
    const rawLabel = (d.fieldName || '').trim();
    if (!rawLabel) continue;
    if (HIDE_FIELDS.has(rawLabel)) continue;
    if (!byField.has(rawLabel)) byField.set(rawLabel, []);
    byField.get(rawLabel).push(d);
  }

  // Helper to render one detail to HTML
  const renderVal = (d) => {
    if (d.termLabel) return esc(d.termLabel);
    
    if (d.value && typeof d.value === 'object' && (d.value.title || d.value.id)) {
      const tEnt = REC_TYPE_TO_ENTITY[String(d.value.type)] || null;
      const tId = String(d.value.id || '');
      if (tEnt && IDX[tEnt] && IDX[tEnt][tId]) {
        return linkTo(tEnt, tId, d.value.title || tId);
      }
      return esc(d.value.title || tId);
    }
    
    const raw = rawValue(d);
    if (typeof raw === 'string' && /^https?:\/\//i.test(raw)) {
      return `<a href="${esc(raw)}" target="_blank" rel="noopener">${esc(raw)}</a>`;
    }
    
    return esc(raw ?? '');
  };

  const rows = [];

  // 1) Render in declared order
  const order = ORDER_FIELDS[entity] || [];
  const seen = new Set();
  
  for (const key of order) {
    const arr = byField.get(key);
    if (!arr || !arr.length) continue;
    
    const label = esc(LABEL_RENAMES[key] || key);
    for (const d of arr) {
      const html = renderVal(d);
      if (html) rows.push(`<dt>${label}</dt><dd>${html}</dd>`);
    }
    seen.add(key);
  }

  // 2) Optionally append remaining fields
  if (INCLUDE_REST) {
    const rest = [...byField.keys()]
      .filter(k => !seen.has(k))
      .sort((a, b) => a.localeCompare(b));
    
    for (const key of rest) {
      const label = esc(LABEL_RENAMES[key] || key);
      for (const d of byField.get(key)) {
        const html = renderVal(d);
        if (html) rows.push(`<dt>${label}</dt><dd>${html}</dd>`);
      }
    }
  }

  return rows.length
    ? rows.join('')
    : '<div class="muted">No details available.</div>';
}

/**
 * Group relationships by type
 */
function groupByRelType(relationships) {
  const grouped = new Map();
  relationships.forEach(r => {
    const relType = getVal(r, 'Relationship type') || 'Related to';
    if (!grouped.has(relType)) grouped.set(relType, []);
    grouped.get(relType).push(r);
  });
  return grouped;
}

/**
 * Get metadata from a relationship record
 */
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
  if (scribeComments) {
    parts.push(`comments: "${scribeComments.substring(0, 50)}${scribeComments.length > 50 ? '...' : ''}"`);
  }
  
  const prodInfo = getVal(rel, 'Production info');
  if (prodInfo) parts.push(`info: ${prodInfo}`);
  
  // Folio/location info
  const folioRange = getVal(rel, 'Folio range in PU') || getVal(rel, 'Folio range');
  if (folioRange) parts.push(`folios: ${folioRange}`);
  
  // Text-related metadata
  const textLang = getVal(rel, 'Text Language(s)');
  if (textLang) parts.push(`language: ${textLang}`);
  
  const textComments = getVal(rel, 'Text(s) comments');
  if (textComments) {
    parts.push(`text: "${textComments.substring(0, 50)}${textComments.length > 50 ? '...' : ''}"`);
  }
  
  const expression = getVal(rel, 'Expression');
  if (expression) parts.push(`expr: ${expression}`);
  
  const style = getVal(rel, 'Style');
  if (style) parts.push(`style: ${style}`);
  
  return parts.length ? parts.join(' | ') : '';
}

/**
 * Render relationships section
 */
export function renderRelationships(rec, type, REL_INDEX, REC_TYPE_TO_ENTITY, IDX) {
  const recId = String(rec.rec_ID);
  const outgoing = REL_INDEX.bySource[recId] || [];
  const incoming = REL_INDEX.byTarget[recId] || [];
  
  let html = '';
  
  // Outgoing relationships
  if (outgoing.length) {
    html += '<div class="section"><strong>Relationships</strong>';
    const grouped = groupByRelType(outgoing);
    
    for (const [relType, rels] of grouped.entries()) {
      html += `<div style="margin:.5rem 0"><em>${esc(relType)}</em>`;
      
      rels.forEach(r => {
        const tgt = getRes(r, 'Target record');
        if (!tgt || !tgt.id) return;
        
        const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
        if (!tgtType) return;
        
        const tgtRec = IDX[tgtType]?.[String(tgt.id)];
        if (!tgtRec) return;
        
        html += `<div style="margin-left:1rem">${linkTo(tgtType, tgt.id, MAP[tgtType].title(tgtRec))}`;
        
        const meta = getRelationshipMetadata(r);
        if (meta) html += ` <span class="muted" style="font-size:.9rem">(${esc(meta)})</span>`;
        html += `</div>`;
      });
      
      html += '</div>';
    }
    html += '</div>';
  }
  
  // Incoming relationships
  if (incoming.length) {
    html += '<div class="section"><strong>Referenced by</strong>';
    const grouped = groupByRelType(incoming);
    
    for (const [relType, rels] of grouped.entries()) {
      html += `<div style="margin:.5rem 0"><em>${esc(relType)}</em>`;
      
      rels.forEach(r => {
        const src = getRes(r, 'Source record');
        if (!src || !src.id) return;
        
        const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
        if (!srcType) return;
        
        const srcRec = IDX[srcType]?.[String(src.id)];
        if (!srcRec) return;
        
        html += `<div style="margin-left:1rem">${linkTo(srcType, src.id, MAP[srcType].title(srcRec))}`;
        
        const meta = getRelationshipMetadata(r);
        if (meta) html += ` <span class="muted" style="font-size:.9rem">(${esc(meta)})</span>`;
        html += `</div>`;
      });
      
      html += '</div>';
    }
    html += '</div>';
  }
  
  return html;
}

/**
 * Utility function to get unique records by ID
 */
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

/**
 * Get manuscripts containing a text
 */
export function manuscriptsForText(txRec, INBOUND, IDX) {
  const txId = String(txRec.rec_ID);
  const inbound = INBOUND.tx[txId] || [];
  const results = [];
  
  // Direct MS links
  inbound.filter(x => x.fromType === 'ms').forEach(x => {
    const ms = IDX.ms[x.fromId];
    if (ms) results.push({ id: x.fromId, title: MAP.ms.title(ms) });
  });
  
  // Via SU
  inbound.filter(x => x.fromType === 'su').forEach(x => {
    const su = IDX.su[x.fromId];
    if (!su) return;
    const msRes = getRes(su, 'Manuscript');
    if (!msRes) return;
    const ms = IDX.ms[String(msRes.id)];
    if (!ms) return;
    results.push({ id: String(msRes.id), title: MAP.ms.title(ms) });
  });
  
  // Via PU
  inbound.filter(x => x.fromType === 'pu').forEach(x => {
    const pu = IDX.pu[x.fromId];
    if (!pu) return;
    const msRes = getRes(pu, 'Manuscript');
    if (!msRes) return;
    const ms = IDX.ms[String(msRes.id)];
    if (!ms) return;
    results.push({ id: String(msRes.id), title: MAP.ms.title(ms) });
  });
  
  return uniqBy(results, r => r.id);
}

/**
 * Get texts for a person
 */
const ROLE_FIELDS_RX = /(scribe|author|translator)/i;

export function textsForPerson(hpRec, INBOUND, IDX) {
  const hpId = String(hpRec.rec_ID);
  const inbound = INBOUND.hp[hpId] || [];
  const fromTexts = inbound.filter(x =>
    x.fromType === 'tx' && ROLE_FIELDS_RX.test(x.fieldName || '')
  );
  
  const grouped = new Map();
  
  fromTexts.forEach(x => {
    const tx = IDX.tx[x.fromId];
    if (!tx) return;
    
    const label = (x.fieldName || 'Linked Text').replace(/_/g, ' ');
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label).push({ id: x.fromId, title: MAP.tx.title(tx) });
  });
  
  // If no role-specific texts, show all
  if (!grouped.size) {
    inbound.filter(x => x.fromType === 'tx').forEach(x => {
      const tx = IDX.tx[x.fromId];
      if (!tx) return;
      if (!grouped.has('Texts')) grouped.set('Texts', []);
      grouped.get('Texts').push({ id: x.fromId, title: MAP.tx.title(tx) });
    });
  }
  
  for (const [k, list] of grouped.entries()) {
    grouped.set(k, uniqBy(list, r => r.id));
  }
  
  return grouped;
}

/**
 * Get people for a monastic institution
 */
export function peopleForMonastic(miRec, INBOUND, IDX) {
  const miId = String(miRec.rec_ID);
  const inbound = INBOUND.mi[miId] || [];
  const list = inbound
    .filter(x => x.fromType === 'hp')
    .map(x => {
      const p = IDX.hp[x.fromId];
      return p ? { id: x.fromId, title: MAP.hp.title(p) } : null;
    })
    .filter(Boolean);
  
  return uniqBy(list, r => r.id);
}

/**
 * Get scribal units for a production unit
 */
export function susForPU(puRec, INBOUND, IDX) {
  const puId = String(puRec.rec_ID);
  const inbound = INBOUND.pu[puId] || [];
  const list = inbound
    .filter(x => x.fromType === 'su')
    .map(x => {
      const su = IDX.su[x.fromId];
      return su ? { id: x.fromId, title: MAP.su.title(su) } : null;
    })
    .filter(Boolean);
  
  return uniqBy(list, r => r.id);
}
