/**
 * Global state management for the Explore Database
 */

import { getRes } from './utils.js';

/**
 * State manager class
 */
export class StateManager {
  constructor() {
    this.DATA = { su: [], ms: [], pu: [], hi: [], mi: [], hp: [], tx: [], rel: [] };
    this.IDX = { su: {}, ms: {}, pu: {}, hi: {}, mi: {}, hp: {}, tx: {} };
    this.INBOUND = { su: {}, ms: {}, pu: {}, hi: {}, mi: {}, hp: {}, tx: {} };
    this.REL_INDEX = { bySource: {}, byTarget: {} };
    this.REC_TYPE_TO_ENTITY = {
      '107': 'tx',
      '113': 'hi',
      '114': 'hp',
      '115': 'mi',
      '116': 'pu',
      '118': 'ms',
      '119': 'su'
    };
  }

  /**
   * Set data and indexes
   */
  setData(data, idx, recTypeMap) {
    this.DATA = data;
    this.IDX = idx;
    this.REC_TYPE_TO_ENTITY = recTypeMap;
  }

  /**
   * Reset inbound pointer index
   */
  resetInbound() {
    this.INBOUND = { su: {}, ms: {}, pu: {}, hi: {}, mi: {}, hp: {}, tx: {} };
  }

  /**
   * Index pointer relationships (inbound references)
   */
  indexPointers() {
    this.resetInbound();
    const all = Object.entries(this.DATA).flatMap(([t, arr]) => 
      arr.map(r => [t, r])
    );
    
    for (const [fromType, rec] of all) {
      (rec.details || []).forEach(d => {
        const v = d?.value;
        if (v && typeof v === 'object' && v.id && v.type) {
          const toType = this.REC_TYPE_TO_ENTITY[String(v.type)] || null;
          if (!toType) return;
          
          const toId = String(v.id);
          const inboundList = this.INBOUND[toType][toId] || [];
          inboundList.push({
            fromType,
            fromId: String(rec.rec_ID),
            fromTitle: rec.rec_Title || '',
            fieldName: d.fieldName || ''
          });
          this.INBOUND[toType][toId] = inboundList;
        }
      });
    }
  }

  /**
   * Index relationships (source/target mapping)
   */
  indexRelationships() {
    this.REL_INDEX = { bySource: {}, byTarget: {} };
    
    this.DATA.rel.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const srcId = src?.id ? String(src.id) : null;
      const tgtId = tgt?.id ? String(tgt.id) : null;
      
      if (srcId) {
        if (!this.REL_INDEX.bySource[srcId]) {
          this.REL_INDEX.bySource[srcId] = [];
        }
        this.REL_INDEX.bySource[srcId].push(rel);
      }
      
      if (tgtId) {
        if (!this.REL_INDEX.byTarget[tgtId]) {
          this.REL_INDEX.byTarget[tgtId] = [];
        }
        this.REL_INDEX.byTarget[tgtId].push(rel);
      }
    });
  }

  /**
   * Build all indexes
   */
  buildIndexes() {
    this.indexPointers();
    this.indexRelationships();
  }
}

// Create singleton instance
export const state = new StateManager();
