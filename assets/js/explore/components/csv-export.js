/**
 * CSV export functionality
 */

import { getVal, getRes } from '../core/utils.js';
import { MAP } from './facets.js';

/**
 * Escape CSV cell value
 */
function csvCell(v) {
  return `"${String(v ?? '').replace(/"/g, '""')}"`;
}

/**
 * Field accessor factories
 */
const access = {
  field: (label, fieldName) => ({
    label,
    get: r => getVal(r, fieldName)
  }),
  
  resTitle: (label, fieldName) => ({
    label,
    get: r => (getRes(r, fieldName)?.title) || getVal(r, fieldName) || ''
  }),
  
  raw: (label, fn) => ({
    label,
    get: fn
  }),
};

/**
 * Field sets for CSV export per entity type
 */
export const FIELDSETS = {
  su: [
    access.raw('rec_ID', r => r.rec_ID),
    access.raw('Title', r => MAP.su.title(r)),
    access.raw('Date (normalized)', r => MAP.su.date(r)),
    access.resTitle('Manuscript', 'Manuscript'),
    access.field('Colophon presence', 'Colophon presence'),
    access.field('Colophon language', 'Colophon language'),
    access.field('Century', 'Normalized century of production'),
    access.field('Terminus post quem', 'Normalized terminus post quem'),
    access.field('Terminus ante quem', 'Normalized terminus ante quem'),
    access.field('SU dating', 'SU dating'),
    access.field('Script Comments', 'Script Comments'),
    access.field('Scribe Comments', 'Scribe Comments'),
    access.field('Text(s) comments', 'Text(s) comments'),
    access.field('PU Comments', 'PU Comments'),
  ],
  
  ms: [
    access.raw('rec_ID', r => r.rec_ID),
    access.raw('Title', r => MAP.ms.title(r)),
    access.raw('Date (Ms Dating)', r => MAP.ms.date(r)),
    access.field('Call number', 'Call number'),
    access.resTitle('Holding Institution', 'Holding Institution'),
    access.field('Digitization Status', 'Digitization Status'),
    access.field('Digitization Type', 'Digitization Type'),
    access.field('IIIF Status', 'IIIF Status'),
    access.field('Number of folios', 'Number of folios'),
    access.field('Codex height', 'Codex height'),
    access.field('Codex width', 'Codex width'),
    access.field('Catalogue Record Link(s)', 'Catalogue Record Link(s)'),
    access.field('Digitization link(s)', 'Digitization link(s)'),
    access.field('IIIF Manifest Link(s)', 'IIIF Manifest Link(s)'),
  ],
  
  pu: [
    access.raw('rec_ID', r => r.rec_ID),
    access.raw('Title', r => MAP.pu.title(r)),
    access.raw('Date (normalized)', r => MAP.pu.date(r)),
    access.field('Country', 'PU country'),
    access.field('Region', 'PU region'),
    access.field('City', 'PU City'),
    access.field('Material', 'Material'),
    access.resTitle('Manuscript', 'Manuscript'),
    access.field('Folios', 'Number of Folios'),
  ],
  
  hi: [
    access.raw('rec_ID', r => r.rec_ID),
    access.raw('Title', r => MAP.hi.title(r)),
    access.field('Country', 'Country'),
    access.field('City', 'City'),
    access.field('Institution type', 'Institution type'),
    access.field('Website link', 'Website link'),
    access.field('Latitude', 'Latitude'),
    access.field('Longitude', 'Longitude'),
  ],
  
  mi: [
    access.raw('rec_ID', r => r.rec_ID),
    access.raw('Title', r => MAP.mi.title(r)),
    access.field('Country', 'Country'),
    access.field('City', 'City'),
    access.field('Religious order', 'Religious order'),
    access.field('Type of monastery', 'Type of monastery'),
    access.field('Creation date', 'Creation date'),
    access.field('Suppression date', 'Suppression date'),
  ],
  
  hp: [
    access.raw('rec_ID', r => r.rec_ID),
    access.raw('Title', r => MAP.hp.title(r)),
    access.field('Name of Person', 'Name of Person'),
    access.field('Gender', 'Gender'),
    access.field('Gender certainty', 'Gender certainty'),
    access.field('Person type', 'Person type'),
  ],
  
  tx: [
    access.raw('rec_ID', r => r.rec_ID),
    access.raw('Title', r => MAP.tx.title(r)),
    access.field('Normalized Title', 'Normalized Title'),
    access.field('Other titles', 'other titles'),
    access.field('Genre', 'Genre'),
    access.field('Subgenre', 'Subgenre'),
    access.field('Identification comments', 'Identification comments'),
  ]
};

/**
 * Build CSV string from records
 * @param {Array} list - Records to export
 * @param {Array} picks - Selected field accessors
 * @param {boolean} includeHeader - Whether to include header row
 * @returns {string} CSV content
 */
export function buildCSV(list, picks, includeHeader) {
  const headers = picks.map(p => csvCell(p.label)).join(',');
  const rows = list.map(r =>
    picks.map(p => csvCell(p.get(r))).join(',')
  );
  
  return (includeHeader ? headers + '\n' : '') + rows.join('\n');
}

/**
 * Trigger CSV download
 * @param {string} csv - CSV content
 * @param {string} filename - Filename for download
 */
export function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
 * Open CSV export dialog
 * @param {Object} elements - Dialog DOM elements
 * @param {string} entityType - Current entity type
 */
export function openCSVDialog(elements, entityType) {
  const { dialog, fieldsContainer } = elements;
  const fields = FIELDSETS[entityType] || [];
  
  fieldsContainer.innerHTML = '';
  
  fields.forEach((f, i) => {
    const id = `csv-${entityType}-${i}`;
    const label = document.createElement('label');
    label.setAttribute('for', id);
    
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = id;
    cb.dataset.idx = String(i);
    cb.checked = (i < 4); // Check first 4 fields by default
    
    label.append(cb);
    label.append(' ' + f.label);
    fieldsContainer.appendChild(label);
  });
  
  dialog.showModal();
}

/**
 * Get selected field accessors from dialog
 * @param {HTMLElement} fieldsContainer - Container with checkboxes
 * @param {string} entityType - Current entity type
 * @returns {Array} Selected field accessors
 */
export function getSelectedFieldAccessors(fieldsContainer, entityType) {
  const fields = FIELDSETS[entityType] || [];
  return [...fieldsContainer.querySelectorAll('input[type="checkbox"]')]
    .filter(cb => cb.checked)
    .map(cb => fields[parseInt(cb.dataset.idx, 10)]);
}
