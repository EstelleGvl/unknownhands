/**
 * Data loading and fetching utilities
 */

import { dedupeById } from './utils.js';

/**
 * Fetch Heurist records from a JSON endpoint
 * @param {string} url - API endpoint URL
 * @param {number} expectType - Expected record type ID
 * @returns {Promise<Array>} Filtered records
 */
export async function fetchHeuristRecords(url, expectType) {
  const r = await fetch(url, { credentials: 'omit' });
  if (!r.ok) return [];
  
  const j = await r.json();
  const recs = (j && j.heurist && Array.isArray(j.heurist.records)) 
    ? j.heurist.records 
    : [];
  
  return recs.filter(rec => {
    const vis = (rec.rec_NonOwnerVisibility || '').toLowerCase();
    if (vis === 'private') return false;
    if (!rec.rec_ID) return false;
    if (expectType && String(rec.rec_RecTypeID) !== String(expectType)) return false;
    return true;
  });
}

/**
 * Load all data from endpoints
 * @param {Object} endpoints - Object with entity keys and endpoint URLs
 * @param {Object} expectTypes - Object with entity keys and expected type IDs
 * @returns {Promise<Object>} DATA object with all loaded records
 */
export async function loadAllData(endpoints, expectTypes) {
  const DATA = {
    su: [],
    ms: [],
    pu: [],
    hi: [],
    mi: [],
    hp: [],
    tx: [],
    rel: []
  };

  try {
    const [su, ms, pu, hi, mi, hp, tx, rel] = await Promise.all([
      fetchHeuristRecords(endpoints.SU_ENDPOINT, expectTypes.su),
      fetchHeuristRecords(endpoints.MS_ENDPOINT, expectTypes.ms),
      fetchHeuristRecords(endpoints.PU_ENDPOINT, expectTypes.pu),
      fetchHeuristRecords(endpoints.HI_ENDPOINT, expectTypes.hi),
      fetchHeuristRecords(endpoints.MI_ENDPOINT, expectTypes.mi),
      fetchHeuristRecords(endpoints.HP_ENDPOINT, expectTypes.hp),
      fetchHeuristRecords(endpoints.TX_ENDPOINT, expectTypes.tx),
      fetchHeuristRecords(endpoints.REL_ENDPOINT, null)
    ]);

    DATA.su = dedupeById(su);
    DATA.ms = dedupeById(ms);
    DATA.pu = dedupeById(pu);
    DATA.hi = dedupeById(hi);
    DATA.mi = dedupeById(mi);
    DATA.hp = dedupeById(hp);
    DATA.tx = dedupeById(tx);
    DATA.rel = dedupeById(rel);

    return DATA;
  } catch (err) {
    console.error('Error loading data:', err);
    return DATA;
  }
}

/**
 * Index all records by ID
 * @param {Object} DATA - DATA object with entity arrays
 * @returns {Object} IDX object with indexed records
 */
export function indexAll(DATA) {
  const IDX = { su: {}, ms: {}, pu: {}, hi: {}, mi: {}, hp: {}, tx: {} };
  
  for (const k of Object.keys(DATA)) {
    if (k === 'rel') continue;
    IDX[k] = {};
    DATA[k].forEach(r => {
      IDX[k][String(r.rec_ID)] = r;
    });
  }
  
  return IDX;
}

/**
 * Build record type to entity mapping
 * @param {Object} DATA - DATA object
 * @returns {Object} Mapping of record type IDs to entity keys
 */
export function buildTypeMap(DATA) {
  const FIXED = {
    '107': 'tx',
    '113': 'hi',
    '114': 'hp',
    '115': 'mi',
    '116': 'pu',
    '118': 'ms',
    '119': 'su'
  };
  
  const REC_TYPE_TO_ENTITY = { ...FIXED };
  
  Object.entries(DATA).forEach(([ekey, arr]) => {
    arr.forEach(r => {
      if (r.rec_RecTypeID) {
        REC_TYPE_TO_ENTITY[String(r.rec_RecTypeID)] = ekey;
      }
    });
  });
  
  return REC_TYPE_TO_ENTITY;
}
