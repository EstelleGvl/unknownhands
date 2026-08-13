/**
 * Search, sort, and pagination functionality
 */

import { getVal } from '../core/utils.js';

/**
 * Apply search filter to records
 * @param {Array} list - Records to search
 * @param {Object} map - Mapping functions for the entity type
 * @param {string} q - Search query
 * @param {string} field - Specific field to search, or empty for all fields
 * @returns {Array} Filtered records
 */
export function applySearch(list, map, q, field) {
  if (!q) return list;
  
  const s = q.toLowerCase();
  
  return list.filter(rec => {
    if (!field) return map.flat(rec).includes(s);
    
    if (field === 'title') {
      return (map.title(rec) || '').toLowerCase().includes(s);
    }
    
    if (field === 'date') {
      return (map.date?.(rec) || '').toLowerCase().includes(s);
    }
    
    if (field === 'manuscript') {
      return ((map.manuscriptTitle?.(rec)) || '').toLowerCase().includes(s);
    }
    
    if (field === 'holding') {
      return ((map.holdingTitle?.(rec)) || '').toLowerCase().includes(s);
    }
    
    if (field === 'place') {
      return ((map.place?.(rec)) || '').toLowerCase().includes(s) ||
        [getVal(rec, 'Country'), getVal(rec, 'City')].join(' ').toLowerCase().includes(s);
    }
    
    if (field === 'comments') {
      return (
        getVal(rec, 'Scribe Comments') + ' ' +
        getVal(rec, 'Text(s) comments') + ' ' +
        getVal(rec, 'PU Comments') + ' ' +
        getVal(rec, 'Identification comments')
      ).toLowerCase().includes(s);
    }
    
    return map.flat(rec).includes(s);
  });
}

/**
 * Get sorter functions for a given entity map
 * @param {Object} map - Mapping functions for the entity type
 * @returns {Object} Sorting functions keyed by sort type
 */
export function getSorters(map) {
  return {
    title_asc: (a, b) => (map.title(a) || '').localeCompare(map.title(b) || ''),
    title_desc: (a, b) => (map.title(b) || '').localeCompare(map.title(a) || ''),
    date_asc: (a, b) => (map.date?.(a) || '').localeCompare(map.date?.(b) || ''),
    date_desc: (a, b) => (map.date?.(b) || '').localeCompare(map.date?.(a) || ''),
  };
}

/**
 * Apply sorting to a list
 * @param {Array} list - Records to sort
 * @param {string} sortType - Sort type key
 * @param {Object} sorters - Sorter functions object
 * @returns {Array} Sorted records
 */
export function applySort(list, sortType, sorters) {
  if (!sortType || !sorters[sortType]) return list;
  return [...list].sort(sorters[sortType]);
}

/**
 * Paginate a list
 * @param {Array} list - Records to paginate
 * @param {number} page - Current page (1-indexed)
 * @param {number} pageSize - Number of records per page
 * @returns {Object} Pagination result with items, totalPages, etc.
 */
export function paginate(list, page, pageSize) {
  const totalRecords = list.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const items = list.slice(startIdx, endIdx);
  
  return {
    items,
    currentPage,
    totalPages,
    totalRecords,
    startIdx,
    endIdx,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages
  };
}

/**
 * Update pagination UI
 * @param {Object} paginationResult - Result from paginate()
 * @param {Object} elements - DOM elements { prev, next, page, pager }
 */
export function updatePaginationUI(paginationResult, elements) {
  const { currentPage, totalPages, hasPrev, hasNext } = paginationResult;
  const { prev, next, page, pager } = elements;
  
  if (prev) {
    prev.disabled = !hasPrev;
  }
  
  if (next) {
    next.disabled = !hasNext;
  }
  
  if (page) {
    page.textContent = `Page ${currentPage} / ${totalPages}`;
  }
  
  if (pager) {
    pager.hidden = totalPages <= 1;
  }
}

/**
 * Find index of a record in a list by ID
 * @param {Array} list - List of records
 * @param {string|number} id - Record ID to find
 * @returns {number} Index of record, or -1 if not found
 */
export function indexOfRecord(list, id) {
  const sId = String(id);
  for (let i = 0; i < list.length; i++) {
    if (String(list[i].rec_ID) === sId) return i;
  }
  return -1;
}
