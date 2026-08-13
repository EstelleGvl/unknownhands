/**
 * Configuration constants for the Explore Database
 */

/**
 * Expected record types
 */
export const EXPECT_TYPE = {
  su: 119,
  ms: 118,
  pu: 116,
  hi: 113,
  mi: 115,
  hp: 114,
  tx: 107
};

/**
 * Facet configurations for each entity type
 */
export const FACETS = {
  su: [
    { key: 'su_dating', label: 'SU dating', type: 'text', field: 'SU dating' },
    { key: 'century', label: 'Normalized century of production', type: 'century', field: 'Normalized century of production' },
    { key: 'post', label: 'Terminus post quem', type: 'year-range', field: 'Normalized terminus post quem' },
    { key: 'ante', label: 'Terminus ante quem', type: 'year-range', field: 'Normalized terminus ante quem' },
    { key: 'script', label: 'Normalized script(s)', type: 'enum-multi', field: 'Normalised script(s)' },
    { key: 'colophon_presence', label: 'Colophon presence', type: 'enum', field: 'Colophon presence' },
    { key: 'colophon_language', label: 'Colophon language', type: 'enum-multi', field: 'Colophon language' },
    { key: 'manuscript', label: 'Manuscript', type: 'resource', field: 'Manuscript' },
    { key: 'scribe_comments', label: 'Scribe Comments', type: 'text', field: 'Scribe Comments' },
    { key: 'text_comments', label: 'Text(s) comments', type: 'text', field: 'Text(s) comments' },
    { key: 'pu_comments', label: 'PU Comments', type: 'text', field: 'PU Comments' },
  ],
  ms: [
    { key: 'holding', label: 'Holding Institution', type: 'resource', field: 'Holding Institution' },
    { key: 'callno', label: 'Call number', type: 'text', field: 'Call number' },
    { key: 'ms_date', label: 'Ms Dating (YYYY ok)', type: 'year-range', field: 'Ms Dating' },
    { key: 'digit_status', label: 'Digitization Status', type: 'enum', field: 'Digitization Status' },
    { key: 'digit_type', label: 'Digitization Type', type: 'enum', field: 'Digitization Type' },
    { key: 'iiif_status', label: 'IIIF Status', type: 'enum', field: 'IIIF Status' },
    { key: 'folios', label: 'Number of folios', type: 'num-range', field: 'Number of folios' },
    { key: 'h', label: 'Codex height', type: 'num-range', field: 'Codex height' },
    { key: 'w', label: 'Codex width', type: 'num-range', field: 'Codex width' },
  ],
  pu: [
    { key: 'country', label: 'Country', type: 'enum-search', field: 'PU country' },
    { key: 'city', label: 'City', type: 'enum-search', field: 'PU City' },
    { key: 'material', label: 'Material', type: 'enum', field: 'Material' },
    { key: 'century', label: 'Century', type: 'century', field: 'Normalized century of production' },
    { key: 'post', label: 'Post quem', type: 'year-range', field: 'Normalized terminus post quem' },
    { key: 'ante', label: 'Ante quem', type: 'year-range', field: 'Normalized terminus ante quem' },
    { key: 'colophon_presence', label: 'Colophon presence', type: 'enum-search', field: 'Colophon presence' },
    { key: 'colophon_language', label: 'Colophon language', type: 'enum-multi', field: 'Colophon language' },
    { key: 'Watermark', label: 'Watermark Present', type: 'enum-search', field: 'Watermark Present' },
    { key: 'manuscript', label: 'Manuscript', type: 'resource', field: 'Manuscript' },
    { key: 'folios', label: 'Folios', type: 'num-range', field: 'Number of Folios' },
    { key: 'text_h', label: 'Text block height', type: 'num-range', field: 'Text block height' },
    { key: 'text_w', label: 'Text block width', type: 'num-range', field: 'Text block width' },
    { key: 'ruling', label: 'Ruling', type: 'enum', field: 'Ruling' },
    { key: 'catchwords', label: 'Catchwords', type: 'enum-search', field: 'catchwords' },
    { key: 'signatures', label: 'Signatures', type: 'enum-search', field: 'signatures' },
    { key: 'Quire types', label: 'Quires', type: 'enum-multi', field: 'Quire types' },
  ],
  hi: [
    { key: 'country', label: 'Country', type: 'enum-search', field: 'Country' },
    { key: 'city', label: 'City', type: 'enum-search', field: 'City' },
    { key: 'itype', label: 'Institution type', type: 'enum', field: 'Institution type' },
  ],
  mi: [
    { key: 'country', label: 'Country', type: 'enum-search', field: 'Country' },
    { key: 'city', label: 'City', type: 'enum-search', field: 'City' },
    { key: 'order', label: 'Religious order', type: 'enum-search', field: 'Religious order' },
    { key: 'mtype', label: 'Type of monastery', type: 'enum', field: 'Type of monastery' },
    { key: 'created', label: 'Creation year', type: 'year-range', field: 'Creation date' },
    { key: 'supp', label: 'Suppression year', type: 'year-range', field: 'Suppression date' },
  ],
  hp: [
    { key: 'gender', label: 'Gender', type: 'enum', field: 'Gender' },
    { key: 'gcert', label: 'Gender certainty', type: 'enum', field: 'Gender certainty' },
    { key: 'ptype', label: 'Person type', type: 'enum', field: 'Person type' },
    { key: 'activity', label: 'Century of Activity', type: 'century', field: 'Century of Activity' },
  ],
  tx: [
    { key: 'genre', label: 'Genre', type: 'enum', field: 'Genre' },
    { key: 'subgenre', label: 'Subgenre', type: 'enum-search', field: 'Subgenre' },
    { key: 'ntitle', label: 'Normalized Title', type: 'enum-search', field: 'Normalized Title' },
    { key: 'author', label: 'Author', type: 'enum-search', field: 'Creator' },
  ],
};
