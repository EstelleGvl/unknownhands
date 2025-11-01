/**
 * Core utility functions for the Explore Database
 */

/**
 * Get a detail object by field name
 */
export const getDetail = (rec, name) => 
  (rec?.details || []).find(d => d.fieldName === name);

/**
 * Get raw value from a detail
 */
export const rawValue = d => (d?.value ?? '');

/**
 * Extract displayable value from a detail
 */
export const val = d => {
  if (!d) return '';
  if (d.termLabel) return d.termLabel;
  if (d.value && typeof d.value === 'object' && d.value.title) return d.value.title;
  return d.value || '';
};

/**
 * Get value for a specific field
 */
export const getVal = (rec, field) => val(getDetail(rec, field));

/**
 * Get resource pointer from a detail
 */
export const getRes = (rec, field) => {
  const d = getDetail(rec, field);
  return d && d.value && d.value.id ? d.value : null;
};

/**
 * Escape HTML special characters
 */
export const esc = s => 
  (s ?? '')
    .toString()
    .replace(/[&<>"]/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[c]));

/**
 * Flatten record to searchable string
 */
export const flat = rec => {
  const bits = [rec.rec_Title || ''];
  (rec.details || []).forEach(d => {
    if (d.termLabel) bits.push(d.termLabel);
    if (typeof d.value === 'string') bits.push(d.value);
    if (d.value && typeof d.value === 'object' && d.value.title) {
      bits.push(d.value.title);
    }
  });
  return bits.join(' ').toLowerCase();
};

/**
 * Debounce function calls
 */
export const debounce = (fn, ms) => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
};

/**
 * Get all details for a field name
 */
export const getDetailsAll = (rec, name) => 
  (rec?.details || []).filter(d => d.fieldName === name);

/**
 * Convert detail to displayable string
 */
export const detailToString = d => val(d);

/**
 * Get all values for a field (multi-valued)
 */
export const getValsAll = (rec, field) =>
  getDetailsAll(rec, field)
    .map(detailToString)
    .filter(Boolean);

/**
 * Deduplicate array by record ID
 */
export const dedupeById = arr => {
  const seen = new Set();
  const out = [];
  for (const r of (arr || [])) {
    const k = String(r.rec_ID || '');
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(r);
  }
  return out;
};
