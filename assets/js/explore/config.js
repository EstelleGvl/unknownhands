/**
 * UI Configuration for Explore Database
 * This file contains all hardcoded UI elements that can be easily customized
 */

window.ExploreConfig = {
  // Entity types available in the database
  entities: [
    { id: 'ms', label: 'Manuscripts' },
    { id: 'pu', label: 'Production Units' },
    { id: 'su', label: 'Scribal Units', default: true },
    { id: 'hi', label: 'Holding Institutions' },
    { id: 'mi', label: 'Monastic Institutions' },
    { id: 'hp', label: 'Historical People' },
    { id: 'tx', label: 'Texts' }
  ],

  // Search/browse configuration
  browse: {
    pageSize: 24,
    searchFields: [
      { value: '', label: 'All fields' },
      { value: 'title', label: 'Title' },
      { value: 'date', label: 'Date / Dating' },
      { value: 'manuscript', label: 'Manuscript' },
      { value: 'holding', label: 'Holding Institution' },
      { value: 'place', label: 'Place (country / city)' },
      { value: 'comments', label: 'Comments' }
    ],
    sortOptions: [
      { value: '', label: 'Sort: Default' },
      { value: 'title_asc', label: 'Title A→Z' },
      { value: 'title_desc', label: 'Title Z→A' },
      { value: 'date_asc', label: 'Date ↑' },
      { value: 'date_desc', label: 'Date ↓' }
    ]
  },

  // Map visualization configuration
  map: {
    views: [
      { value: 'ms-current', label: 'Manuscripts - Current Location (Holdings)' },
      { value: 'ms-movement', label: 'Manuscripts - Movement (Production → Current)' },
      { value: 'pu-location', label: 'Production Units - All Locations' },
      { value: 'pu-monastery', label: 'Production Units - By Monastery' },
      { value: 'mi-all', label: 'Monastic Institutions' }
    ],
    defaultView: 'ms-current',
    clustering: true,
    heatmap: false,
    connections: false,
    timeRange: { min: 800, max: 1600, default: [800, 1600] }
  },

  // Timeline visualization configuration
  timeline: {
    showBands: true,
    showRanges: true,
    showCenturies: true,
    colorByOptions: [
      { value: 'entity', label: 'Entity Type' },
      { value: 'language', label: 'Language' },
      { value: 'script', label: 'Script Type' },
      { value: 'certainty', label: 'Date Certainty' }
    ],
    defaultColorBy: 'entity'
  },

  // Network visualization configuration
  network: {
    views: [
      { value: 'search', label: 'Search & Explore from Record (Recommended)' },
      { value: 'clusters', label: 'Cluster View by Entity Type' },
      { value: 'sample', label: 'Reproducible Connected Sample' }
    ],
    defaultView: 'search',
    defaultDepth: 2,
    maxDepth: 3,
    colorByOptions: [
      { value: 'type', label: 'Entity Type' },
      { value: 'century', label: 'Century' },
      { value: 'region', label: 'Region' },
      { value: 'order', label: 'Religious Order' }
    ],
    entityFilters: [
      { value: 'su', label: 'Scribal Units', color: '#e6b800', default: true },
      { value: 'ms', label: 'Manuscripts', color: '#3498db', default: true },
      { value: 'pu', label: 'Production Units', color: '#e74c3c', default: true },
      { value: 'hi', label: 'Holding Institutions', color: '#2ecc71', default: true },
      { value: 'mi', label: 'Monastic Institutions', color: '#9b59b6', default: true },
      { value: 'hp', label: 'Historical People', color: '#f39c12', default: true },
      { value: 'tx', label: 'Texts', color: '#1abc9c', default: true }
    ],
    exportFormats: [
      { value: 'gephi', label: 'Gephi (2 CSV files)' },
      { value: 'r', label: 'R (CSV + script)' }
    ],
    defaultLinkDensity: 100
  },

  // Analytics visualization configuration
  analytics: {
    defaultMetric: 'count'
  },

  // Modes/Tabs configuration
  modes: [
    { id: 'browse', label: 'Browse & Search' },
    { id: 'analytics', label: 'Summary', group: 'overview', groupLabel: 'Overview' },
    { id: 'map', label: 'Map', group: 'overview', groupLabel: 'Overview' },
    { id: 'network', label: 'Network', group: 'overview', groupLabel: 'Overview' },
    { id: 'tree', label: 'Manuscript Structure' },
    { id: 'scribes', label: 'Scribes' },
    { id: 'multilingualism', label: 'Multilingualism' },
    { id: 'colophon-analysis', label: 'Colophons' },
    { id: 'text-genres', label: 'Textual Genres' }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.ExploreConfig;
}
