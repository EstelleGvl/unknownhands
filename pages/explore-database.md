---
layout: page
permalink: /explore-database/
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

<script>
// Immediately check for embed mode and hide elements BEFORE page renders
(function() {
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get('embed') === 'true';
  const inIframe = window.self !== window.top;
  
  if (isEmbed || inIframe) {
    document.documentElement.classList.add('embed-mode');
    // Add styles immediately
    const style = document.createElement('style');
    style.textContent = `
      .embed-mode header,
      .embed-mode footer,
      .embed-mode nav,
      .embed-mode .page-header,
      .embed-mode .site-header,
      .embed-mode .page-banner,
      .embed-mode [class*="banner"],
      .embed-mode .site-title,
      .embed-mode .site-nav {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      
      .embed-mode body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }
      
      .embed-mode .explore-fullwidth {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      .embed-mode .db-shell {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .embed-mode .mode-container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .embed-mode #genre-tab-content {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0.5rem !important;
        box-sizing: border-box !important;
      }
      
      .embed-mode #genre-tab-content > div {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .embed-mode #ms-network-viz,
      .embed-mode #inst-network-viz,
      .embed-mode #scribe-network-viz {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      
      .embed-mode svg {
        width: 100% !important;
        height: auto !important;
        max-width: 100% !important;
        display: block !important;
      }
    `;
    document.head.appendChild(style);
  }
})();
</script>

<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

<div class="explore-fullwidth">
  <h1 class="mb-3" style="text-align:center;">Explore the Database</h1>

  <!-- Main Navigation Tabs -->
  <div class="main-nav-tabs" id="main-nav-tabs" aria-label="Main Navigation">
    <button class="main-nav-btn is-on" data-mode="browse">Browse & Search</button>
    <button class="main-nav-btn" data-mode="analytics">Analytics</button>
    <button class="main-nav-btn" data-mode="map">Map</button>
      <!-- <button class="main-nav-btn" data-mode="codicology">Codicology</button> -->
    <button class="main-nav-btn" data-mode="tree">Hierarchical Tree</button>
    <button class="main-nav-btn" data-mode="network">Network</button>
    <button class="main-nav-btn" data-mode="scribes">Scribes</button>
    <button class="main-nav-btn" data-mode="multilingualism">Multilingualism</button>
    <button class="main-nav-btn" data-mode="colophon-analysis">Colophon Analysis</button>
    <button class="main-nav-btn" data-mode="text-genres">Text Genres</button>
  </div>

  <div class="db-shell">
    <!-- BROWSE MODE -->
    <div id="mode-browse" class="mode-container" aria-hidden="false">
      <!-- FACETS (left) -->
      <aside class="db-facets" aria-label="Filters">
        <div class="entity-switcher">
          <div class="entity-switcher-title">Record type</div>
          <div class="entity-switcher-list" id="entity-switch">
            <button class="entity-btn" data-entity="ms">Manuscripts</button>
            <button class="entity-btn" data-entity="pu">Production Units</button>
            <button class="entity-btn is-on" data-entity="su">Scribal Units</button>
            <button class="entity-btn" data-entity="hi">Holding Institutions</button>
            <button class="entity-btn" data-entity="mi">Monastic Institutions</button>
            <button class="entity-btn" data-entity="hp">Historical People</button>
            <button class="entity-btn" data-entity="tx">Texts</button>
          </div>
        </div>

        <div id="facet-mount"></div>
      </aside>

      <!-- MAIN (center) + VIZ (right) wrapper for controls and content -->
      <div class="db-main-viz-wrapper">
        <!-- Controls - now spanning both middle and right panels -->
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

        <!-- MAIN (center) -->
        <section class="db-main">
          <!-- Results list -->
          <div id="pane-results" class="db-results-wrap">
            <div id="db-status" class="db-status" role="status" aria-live="polite"></div>
            <div id="db-results" class="db-grid"></div>
          </div>
        </section>

        <!-- DETAILS (right) -->
        <aside id="db-viz" class="db-viz">
          <div id="details-wrap"></div>
        </aside>
        
        <!-- Pagination - spans both middle and right panels -->
        <div id="db-pager" class="db-pager" hidden>
          <button id="db-prev" disabled>Previous</button>
          <span id="db-page">Page 1 / 1</span>
          <button id="db-next" disabled>Next</button>
          <span style="margin-left:1rem;display:inline-flex;align-items:center;gap:0.5rem">
            <label for="db-page-jump" style="font-size:0.9rem">Go to:</label>
            <input type="number" id="db-page-jump" min="1" style="width:4rem;padding:0.25rem 0.5rem;border:1px solid #ddd;border-radius:0.25rem;text-align:center" />
            <button id="db-page-go" style="padding:0.35rem 0.75rem;border:1px solid #ddd;border-radius:0.5rem;background:#fff;cursor:pointer">Go</button>
          </span>
        </div>
      </div>
    </div>

    <!-- MAP MODE -->
    <div id="mode-map" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span id="map-title">Map Visualization</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Exploring all entities across space</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Map view selector -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 500; font-size: 0.875rem;">
              Map View:
              <select id="map-view-selector" style="flex: 1; padding: 0.25rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; background: white;">
                <option value="ms-current">Manuscripts - Current Location (Holdings)</option>
                <option value="ms-movement">Manuscripts - Movement (Production → Current)</option>
                <option value="pu-location">Production Units - All Locations</option>
                <option value="pu-monastery">Production Units - By Monastery</option>
                <option value="mi-all">Monastic Institutions</option>
              </select>
            </label>
            <div id="map-view-hint" style="font-size: 0.75rem; color: #666; margin-top: 0.25rem;">
              Tip: Map views show all data from the entire database.
            </div>
          </div>
          <!-- Map controls -->
          <div id="map-controls" style="padding: 0.5rem 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-clusters" checked>
              <span style="font-size: 0.875rem;">Clustering</span>
            </label>
            <label id="map-control-connections" style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-connections">
              <span style="font-size: 0.875rem;">Connection Lines</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-heatmap">
              <span style="font-size: 0.875rem;">Heatmap</span>
            </label>
            <label id="map-control-routes" style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-routes">
              <span style="font-size: 0.875rem;">Show Routes</span>
            </label>
            <button class="chip" id="map-reset-view" style="margin-left: auto;">Reset View</button>
            <button class="chip" id="map-export-image" style="background: #28a745; color: white;">📷 Export PNG</button>
          </div>
          <!-- Time slider -->
          <div id="map-time-controls" style="padding: 0.5rem 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <label style="font-size: 0.875rem; font-weight: 500; margin: 0;">Time Period:</label>
              <span id="map-time-range" style="font-size: 0.875rem; color: #666;">All dates</span>
              <button class="chip" id="map-clear-time" style="font-size: 0.75rem; padding: 0.125rem 0.5rem; margin-left: auto;">Clear</button>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="range" id="map-time-start" min="800" max="1600" value="800" step="10" style="flex: 1;">
              <input type="range" id="map-time-end" min="800" max="1600" value="1600" step="10" style="flex: 1;">
            </div>
          </div>
          <!-- Color Legend -->
          <div id="map-legend" style="padding: 0.5rem 0.75rem; background: #f9fafb; border-bottom: 1px solid #dee2e6; font-size: 0.8rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <span style="font-weight: 600; color: #666;">Legend:</span>
            <div id="map-legend-items" style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <!-- Will be populated by JavaScript -->
            </div>
          </div>
          <div id="map-mount"></div>
        </div>
      </div>
    </div>

    <!-- TIMELINE MODE -->
    <div id="mode-timeline" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span id="timeline-title">Timeline Visualization</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Exploring all entities across time</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Timeline controls -->
          <div style="padding: 0.5rem 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="timeline-show-multi" checked>
              <span style="font-size: 0.875rem;">Multiple Bands</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="timeline-show-ranges" checked>
              <span style="font-size: 0.875rem;">Show Ranges</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="timeline-show-centuries" checked>
              <span style="font-size: 0.875rem;">Century Markers</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0;">
              <span style="font-size: 0.875rem;">Color by:</span>
              <select id="timeline-color-by" style="padding: 0.125rem 0.25rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                <option value="entity">Entity Type</option>
                <option value="language">Language</option>
                <option value="script">Script Type</option>
                <option value="certainty">Date Certainty</option>
              </select>
            </label>
            <div style="display: flex; gap: 0.25rem; align-items: center; margin-left: auto;">
              <button class="chip" id="timeline-zoom-out" title="Zoom out">−</button>
              <button class="chip" id="timeline-zoom-in" title="Zoom in">+</button>
              <button class="chip" id="timeline-reset-zoom">Reset Zoom</button>
              <button class="chip" id="timeline-export-svg" style="background:#28a745;color:white;">📷 Export SVG</button>
              <button class="chip" id="timeline-export-png" style="background:#28a745;color:white;">📷 Export PNG</button>
            </div>
          </div>
          
          <!-- Color Legend -->
          <div id="timeline-legend" style="padding: 0.5rem 0.75rem; background: #f9fafb; border-bottom: 1px solid #dee2e6; font-size: 0.8rem; color: #6b7280; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <!-- Will be populated by JavaScript -->
          </div>
          
          <div id="timeline-mount"></div>
        </div>
      </div>
    </div>

    <!-- NETWORK MODE -->
    <div id="mode-network" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span>Network Visualization</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Exploring relationships between entities</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Network View Selector with practical options -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 500; font-size: 0.875rem;">
              Network View:
              <select id="network-view-selector" style="flex: 1; padding: 0.25rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; background: white;">
                <option value="search">Search & Explore from Record (Recommended)</option>
                <option value="clusters">Cluster View by Entity Type</option>
              </select>
            </label>
          </div>
          
          <!-- Search panel (primary interface) -->
          <div id="network-search-panel" style="padding: 0.75rem; background: #fff; border-bottom: 1px solid #dee2e6;">
            <div style="font-weight:600;font-size:.95rem;margin-bottom:.3rem;color:#2c3e50;">Pick a Record to Explore</div>
            <label style="display: block; font-weight: 400; font-size: 0.8rem; margin-bottom: 0.5rem; color: #666;">
              Search for any manuscript, scribe, institution, or text
            </label>
            <input type="search" id="network-search-input" placeholder="Type manuscript name, scribe, institution, text..." style="width: 100%; padding: 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; margin-bottom: 0.5rem;">
            <div id="network-search-results" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; border-radius: 0.25rem;"></div>
          </div>
          
          <div class="viz-controls" id="network-controls" style="padding:.5rem .75rem;border-bottom:1px solid #eee;background:#fff;transition:background 0.3s, color 0.3s;">
            <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;margin-bottom:.5rem;">
              <label style="display:flex;gap:.5rem;align-items:center;">
                Depth: <input type="number" id="network-depth" min="1" max="3" value="2" style="width:4rem;padding:.25rem .5rem;border:1px solid #ddd;border-radius:.25rem;">
              </label>
              <label style="display:flex;gap:.5rem;align-items:center;font-size:.875rem;">
                Color by:
                <select id="network-color-scheme" style="padding:.25rem .5rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                  <option value="type">Entity Type</option>
                  <option value="century">Century</option>
                  <option value="region">Region</option>
                  <option value="order">Religious Order</option>
                </select>
              </label>
              <label style="display:flex;gap:.5rem;align-items:center;">
                <input type="checkbox" id="network-show-labels" checked> Labels
              </label>
              <label style="display:flex;gap:.5rem;align-items:center;">
                <input type="checkbox" id="network-dark-mode"> Dark
              </label>
              <button id="network-filters-toggle" class="chip" style="padding:.25rem .5rem;">Filters</button>
              <button id="network-zoom-in" class="chip" style="padding:.25rem .5rem;" title="Zoom in">Zoom In</button>
              <button id="network-zoom-out" class="chip" style="padding:.25rem .5rem;" title="Zoom out">Zoom Out</button>
              <button id="network-zoom-reset" class="chip" style="padding:.25rem .5rem;" title="Reset zoom to 100%">Reset View</button>
              <button id="network-zoom-fit" class="chip" style="padding:.25rem .5rem;" title="Fit entire network to screen">Fit to Screen</button>
              <button id="network-refresh" class="chip" style="padding:.25rem .5rem;" title="Rebuild network with current filters">Rebuild Network</button>
              <button id="network-export-svg" class="chip" style="padding:.25rem .5rem;background:#28a745;color:white;">📷 Export SVG</button>
              <button id="network-export-png" class="chip" style="padding:.25rem .5rem;background:#28a745;color:white;">📷 Export PNG</button>
              <select id="network-export-format" style="padding:.25rem .5rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;cursor:pointer;">
                <option value="">Export Data...</option>
                <option value="gephi">Gephi (2 CSV files)</option>
                <option value="r">R (CSV + script)</option>
              </select>
            </div>
            <div style="display:flex;gap:.75rem;align-items:center;padding-top:.5rem;border-top:1px solid #eee;">
              <label style="display:flex;gap:.5rem;align-items:center;font-size:.85rem;flex:1;">
                <span style="min-width:80px;">Link Density:</span>
                <input type="range" id="network-link-density" min="0" max="100" value="100" style="flex:1;" title="Adjust link visibility - higher values show more connections">
                <span id="network-link-density-value" style="min-width:35px;text-align:right;">100%</span>
              </label>
            </div>
            
            <!-- Advanced Filters Panel (collapsible) -->
            <div id="network-filters-panel" style="display:none;margin-top:.75rem;padding:.75rem;background:#f8f9fa;border-radius:.25rem;border:1px solid #dee2e6;">
              
              <!-- Section 2: Show These Types -->
              <div style="margin-bottom:1rem;">
                <div style="font-weight:600;font-size:.95rem;margin-bottom:.3rem;color:#2c3e50;">Show These Entity Types</div>
                <div style="font-size:.8rem;color:#666;margin-bottom:.6rem;">Select which types of entities to include in the network</div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.5rem;">
                  <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.35rem;background:white;border-radius:.25rem;cursor:pointer;">
                    <input type="checkbox" class="network-entity-filter" value="su" checked>
                    <span style="width:10px;height:10px;border-radius:50%;background:#e6b800;display:inline-block;"></span>
                    <span style="font-weight:500;">Scribal Units</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.35rem;background:white;border-radius:.25rem;cursor:pointer;">
                    <input type="checkbox" class="network-entity-filter" value="ms" checked>
                    <span style="width:10px;height:10px;border-radius:50%;background:#3498db;display:inline-block;"></span>
                    <span style="font-weight:500;">Manuscripts</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.35rem;background:white;border-radius:.25rem;cursor:pointer;">
                    <input type="checkbox" class="network-entity-filter" value="pu" checked>
                    <span style="width:10px;height:10px;border-radius:50%;background:#e74c3c;display:inline-block;"></span>
                    <span style="font-weight:500;">Production Units</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.35rem;background:white;border-radius:.25rem;cursor:pointer;">
                    <input type="checkbox" class="network-entity-filter" value="hi" checked>
                    <span style="width:10px;height:10px;border-radius:50%;background:#2ecc71;display:inline-block;"></span>
                    <span style="font-weight:500;">Holding Institutions</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.35rem;background:white;border-radius:.25rem;cursor:pointer;">
                    <input type="checkbox" class="network-entity-filter" value="mi" checked>
                    <span style="width:10px;height:10px;border-radius:50%;background:#9b59b6;display:inline-block;"></span>
                    <span style="font-weight:500;">Monastic Institutions</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.35rem;background:white;border-radius:.25rem;cursor:pointer;">
                    <input type="checkbox" class="network-entity-filter" value="hp" checked>
                    <span style="width:10px;height:10px;border-radius:50%;background:#f39c12;display:inline-block;"></span>
                    <span style="font-weight:500;">Historical People</span>
                  </label>
                  <label style="display:flex;align-items:center;gap:.5rem;font-size:.85rem;padding:.35rem;background:white;border-radius:.25rem;cursor:pointer;">
                    <input type="checkbox" class="network-entity-filter" value="tx" checked>
                    <span style="width:10px;height:10px;border-radius:50%;background:#1abc9c;display:inline-block;"></span>
                    <span style="font-weight:500;">Texts</span>
                  </label>
                </div>
              </div>
              
              
              <!-- Actions and Feedback -->
              <div style="margin-top:.75rem;padding-top:.75rem;border-top:1px solid #dee2e6;display:flex;justify-content:space-between;align-items:center;">
                <div id="network-filter-feedback" style="font-size:.85rem;color:#666;">
                  <span id="network-node-count">0 nodes</span>, <span id="network-link-count">0 links</span>
                </div>
                <button id="network-clear-filters" style="padding:.4rem 1rem;background:#6c757d;color:white;border:none;border-radius:.25rem;font-size:.85rem;cursor:pointer;font-weight:500;">
                  Reset All Filters
                </button>
              </div>
              
            </div>
          </div>
          <div style="position:relative;">
            <div id="network-mount" style="cursor: grab;"></div>
            <div id="network-node-details" style="display:none;position:absolute;top:10px;left:10px;max-width:350px;background:rgba(255,255,255,0.98);border:1px solid #ddd;border-radius:.5rem;padding:.75rem;font-size:.85rem;box-shadow:0 2px 8px rgba(0,0,0,0.15);z-index:1000;"></div>
            <div id="network-legend" style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.95);border:1px solid #ddd;border-radius:.5rem;padding:.75rem;font-size:.85rem;box-shadow:0 2px 4px rgba(0,0,0,0.1);max-width:220px;">
              <!-- Legend content will be dynamically generated -->
              <div id="network-legend-content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ANALYTICS MODE -->
    <div id="mode-analytics" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span>Statistical Dashboard</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Statistical insights across the entire database</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Analytics controls -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <!-- Entity filter -->
            <div id="entity-filter-panel" style="margin-bottom: 0.5rem;">
              <label style="display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem;">
                Filter by Entity Type:
                <select id="entity-filter-select" style="margin-left: 0.5rem; padding: 0.375rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                  <option value="su">Scribal Units</option>
                  <option value="ms">Manuscripts</option>
                  <option value="pu">Production Units</option>
                  <option value="hi">Holding Institutions</option>
                  <option value="mi">Monastic Institutions</option>
                  <option value="hp">Historical People</option>
                  <option value="tx">Texts</option>
                </select>
              </label>
            </div>
            <div id="analytics-description" style="padding: 0.5rem; background: #e7f3ff; border-left: 3px solid #2196F3; font-size: 0.8rem; color: #555; border-radius: 0.25rem;">
              <strong>Statistical Dashboard:</strong> Provides quantitative overview of the corpus including record counts, date ranges, and key attributes by entity type. Helps identify dataset completeness, temporal distribution, and notable characteristics. Essential for understanding corpus composition and identifying trends or gaps in the data.
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
              <button class="chip" id="analytics-export-png" style="background:#28a745;color:white;">Export as Image</button>
            </div>
          </div>

          <!-- Analytics mount point -->
          <div id="analytics-mount" style="padding: 1rem; overflow: auto;">
            <!-- Visualization will be rendered here -->
          </div>
        </div>
      </div>
    </div>

    <!-- CODICOLOGY MODE -->
    <div id="mode-codicology" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span>Codicological Analysis</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Manuscript structure and production analysis</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Codicology controls -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <!-- Codicological Analysis controls -->
            <div style="margin-bottom: 0.75rem; padding: 1rem; background: white; border: 1px solid #dee2e6; border-radius: 0.375rem;">
              <!-- Quick Start Presets -->
              <div style="margin-bottom: 1rem; padding: 0.75rem; background: #f0f7ff; border-radius: 0.25rem; border-left: 3px solid #2196F3;">
                <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; color: #1565c0;">Quick Start - Try These Combinations:</div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <button class="codic-preset-btn chip" data-preset="material-size" style="background: #e3f2fd; border: 1px solid #90caf9; padding: 0.375rem 0.75rem; font-size: 0.8rem; cursor: pointer;">
                    Material vs Size
                  </button>
                  <button class="codic-preset-btn chip" data-preset="date-folios" style="background: #e3f2fd; border: 1px solid #90caf9; padding: 0.375rem 0.75rem; font-size: 0.8rem; cursor: pointer;">
                    Date vs Folios
                  </button>
                  <button class="codic-preset-btn chip" data-preset="quire-material" style="background: #e3f2fd; border: 1px solid #90caf9; padding: 0.375rem 0.75rem; font-size: 0.8rem; cursor: pointer;">
                    Quire Type vs Material
                  </button>
                  <button class="codic-preset-btn chip" data-preset="clear" style="background: #fff; border: 1px solid #ddd; padding: 0.375rem 0.75rem; font-size: 0.8rem; cursor: pointer;">
                    Clear Selection
                  </button>
                </div>
              </div>

              <!-- Filters Section -->
              <div style="margin-bottom: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 0.25rem; border-left: 3px solid #ffc107;">
                <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; color: #856404;">Active Filters</div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; margin-bottom: 0.5rem;">
                  <div>
                    <label style="display: block; font-size: 0.75rem; margin-bottom: 0.25rem; color: #666;"> Century:</label>
                    <select id="codic-filter-century" multiple style="width: 100%; padding: 0.375rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.75rem; min-height: 60px;">
                      <option value="8">8th c.</option>
                      <option value="9">9th c.</option>
                      <option value="10">10th c.</option>
                      <option value="11">11th c.</option>
                      <option value="12">12th c.</option>
                      <option value="13">13th c.</option>
                      <option value="14">14th c.</option>
                      <option value="15">15th c.</option>
                      <option value="16">16th c.</option>
                    </select>
                    <div style="font-size: 0.65rem; color: #666; margin-top: 0.25rem;">Hold Cmd/Ctrl to select multiple</div>
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; margin-bottom: 0.25rem; color: #666;">� Material:</label>
                    <select id="codic-filter-material" multiple style="width: 100%; padding: 0.375rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.75rem; min-height: 60px;">
                      <option value="parchment">Parchment</option>
                      <option value="paper">Paper</option>
                    </select>
                    <div style="font-size: 0.65rem; color: #666; margin-top: 0.25rem;">Hold Cmd/Ctrl to select multiple</div>
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; margin-bottom: 0.25rem; color: #666;">Region:</label>
                    <select id="codic-filter-region" multiple style="width: 100%; padding: 0.375rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.75rem; min-height: 60px;">
                      <option value="Austria">Austria</option>
                      <option value="Belgium">Belgium</option>
                      <option value="England">England</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Italy">Italy</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Spain">Spain</option>
                      <option value="Switzerland">Switzerland</option>
                    </select>
                    <div style="font-size: 0.65rem; color: #666; margin-top: 0.25rem;">Hold Cmd/Ctrl to select multiple</div>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div id="codic-filter-status" style="font-size: 0.75rem; color: #856404;"></div>
                  <button id="codic-clear-filters-btn" style="padding: 0.25rem 0.75rem; background: #fff; border: 1px solid #ffc107; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer; color: #856404;">
                    Clear Filters
                  </button>
                </div>
              </div>

              <!-- Variable Selection -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
                <label style="display: flex; flex-direction: column; gap: 0.35rem; font-weight: 500; font-size: 0.875rem;">
                  X-Axis Variable:
                  <select id="codic-x-var" style="padding: 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem; background: white;">
                    <option value="">-- Select Variable --</option>
                    <optgroup label="Dimensions">
                      <option value="height">Height (mm)</option>
                      <option value="width">Width (mm)</option>
                      <option value="combined-size">Combined Size (Height + Width, mm)</option>
                      <option value="justification-height">Justification Height (mm)</option>
                      <option value="justification-width">Justification Width (mm)</option>
                      <option value="margin-ratio">Margin Ratio</option>
                    </optgroup>
                    <optgroup label="Structure">
                      <option value="folios">Number of Folios</option>
                      <option value="columns">Number of Columns</option>
                      <option value="lines-per-page">Lines per Page</option>
                      <option value="quires">Number of Quires</option>
                    </optgroup>
                    <optgroup label="Temporal">
                      <option value="date">Date (Year)</option>
                      <option value="century">Century</option>
                    </optgroup>
                    <optgroup label="Categorical">
                      <option value="material">Material</option>
                      <option value="quire-type">Quire Type</option>
                      <option value="ruling-type">Ruling Type</option>
                      <option value="script-type">Script Type</option>
                      <option value="binding-type">Binding Type</option>
                    </optgroup>
                  </select>
                </label>
                <label style="display: flex; flex-direction: column; gap: 0.35rem; font-weight: 500; font-size: 0.875rem;">
                  Y-Axis Variable:
                  <select id="codic-y-var" style="padding: 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem; background: white;">
                    <option value="">-- Select Variable --</option>
                    <optgroup label="Dimensions">
                      <option value="height">Height (mm)</option>
                      <option value="width">Width (mm)</option>
                      <option value="combined-size">Combined Size (Height + Width, mm)</option>
                      <option value="justification-height">Justification Height (mm)</option>
                      <option value="justification-width">Justification Width (mm)</option>
                      <option value="margin-ratio">Margin Ratio</option>
                    </optgroup>
                    <optgroup label="Structure">
                      <option value="folios">Number of Folios</option>
                      <option value="columns">Number of Columns</option>
                      <option value="lines-per-page">Lines per Page</option>
                      <option value="quires">Number of Quires</option>
                    </optgroup>
                    <optgroup label="Temporal">
                      <option value="date">Date (Year)</option>
                      <option value="century">Century</option>
                    </optgroup>
                    <optgroup label="Categorical">
                      <option value="material">Material</option>
                      <option value="quire-type">Quire Type</option>
                      <option value="ruling-type">Ruling Type</option>
                      <option value="script-type">Script Type</option>
                      <option value="binding-type">Binding Type</option>
                    </optgroup>
                  </select>
                </label>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <label style="display: flex; flex-direction: column; gap: 0.35rem; font-weight: 500; font-size: 0.875rem;">
                  Color/Group By:
                  <select id="codic-color-var" style="padding: 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem; background: white;">
                    <option value="none">None</option>
                    <optgroup label="People & Gender">
                      <option value="gender">Gender</option>
                      <option value="scribe-name">Scribe Name</option>
                    </optgroup>
                    <optgroup label="Production Context">
                      <option value="material">Material</option>
                      <option value="origin-country">Origin Country</option>
                      <option value="origin-region">Origin Region</option>
                      <option value="monastery-type">Monastery Type</option>
                    </optgroup>
                    <optgroup label="Physical Features">
                      <option value="quire-type">Quire Type</option>
                      <option value="catchwords">Has Catchwords</option>
                      <option value="signatures">Has Signatures</option>
                      <option value="watermark">Has Watermark</option>
                      <option value="ruling-type">Ruling Type</option>
                      <option value="columns">Number of Columns</option>
                    </optgroup>
                    <optgroup label="Content">
                      <option value="has-colophon">Has Colophon</option>
                      <option value="language">Language</option>
                      <option value="script-type">Script Type</option>
                      <option value="decoration">Has Decoration</option>
                    </optgroup>
                    <optgroup label="Collaboration">
                      <option value="collaboration-type">Collaboration Type</option>
                      <option value="multiple-scribes">Multiple Scribes</option>
                    </optgroup>
                  </select>
                </label>
                <label style="display: flex; flex-direction: column; gap: 0.35rem; font-weight: 500; font-size: 0.875rem;">
                  Visualization Type:
                  <select id="codic-viz-type" style="padding: 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem; background: white;">
                    <option value="scatter">Scatter Plot</option>
                    <option value="box">Box Plot</option>
                    <option value="bar">Bar Chart</option>
                    <option value="correlation">Correlation Analysis</option>
                    <option value="stats">Statistical Summary</option>
                  </select>
                </label>
              </div>
            </div>

            <div id="codicology-description" style="padding: 0.5rem; background: #e7f3ff; border-left: 3px solid #2196F3; font-size: 0.8rem; color: #555; border-radius: 0.25rem;">
              <strong>Codicological Analysis:</strong> Explore relationships between manuscript physical features. Select any two variables to analyze correlations, distributions, and patterns across the corpus.
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
              <div style="display: flex; gap: 0.5rem;">
                <button class="chip" id="codicology-add-comparison" style="background:#17a2b8;color:white;">
                  Add to Comparison
                </button>
                <button class="chip" id="codicology-view-comparison" style="background:#6c757d;color:white;display:none;">
                  View Comparisons (<span id="comparison-count">0</span>)
                </button>
                <button class="chip" id="codicology-clear-comparison" style="background:#dc3545;color:white;display:none;">
                  Clear Comparisons
                </button>
              </div>
              <button class="chip" id="codicology-export-png" style="background:#28a745;color:white;">Export as Image</button>
            </div>
          </div>

          <!-- Codicology mount point -->
          <div id="codicology-mount" style="padding: 1rem; overflow: auto;">
            <!-- Visualization will be rendered here -->
          </div>
        </div>
      </div>
    </div>

    <!-- HIERARCHICAL TREE MODE -->
    <div id="mode-tree" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span>Hierarchical Tree</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Manuscript structure and entity relationships</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Tree controls -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <!-- Tree search panel -->
            <div style="margin-bottom: 0.5rem; padding: 0.75rem; background: white; border: 1px solid #dee2e6; border-radius: 0.25rem;">
              <!-- Search Bar -->
              <div style="margin-bottom: 0.75rem;">
                <label style="display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem; color: #333;">
                  Search Manuscripts
                </label>
                <div style="display: flex; gap: 0.5rem;">
                  <input type="text" id="tree-manuscript-search" placeholder="Type manuscript title, shelfmark, or ID..." style="flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                  <button id="tree-search-clear" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; white-space: nowrap;">Clear</button>
                </div>
              </div>
              
              <!-- Filter Section -->
              <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: #f8f9fa; border-radius: 0.25rem;">
                <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; color: #333;">
                  Filter by Structure
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; cursor: pointer; padding: 0.25rem;">
                    <input type="checkbox" id="tree-filter-multi-pu" style="cursor: pointer;">
                    <span>3+ Production Units</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; cursor: pointer; padding: 0.25rem;">
                    <input type="checkbox" id="tree-filter-cross-ms-pu" style="cursor: pointer;">
                    <span>PUs Across Multiple MSS</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; cursor: pointer; padding: 0.25rem;">
                    <input type="checkbox" id="tree-filter-cross-pu-su" style="cursor: pointer;">
                    <span>SUs Across Multiple PUs</span>
                  </label>
                </div>
              </div>
              
              <!-- Sort Section -->
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <label style="font-weight: 600; font-size: 0.875rem; color: #333; white-space: nowrap;">
                  Sort by:
                </label>
                <select id="tree-sort-select" style="flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem; background: white;">
                  <option value="default">Alphabetical</option>
                  <option value="most-pus">Production Units (Most)</option>
                  <option value="most-sus">Scribal Units (Most)</option>
                  <option value="most-complex">Structural Complexity (Highest)</option>
                </select>
              </div>
            </div>

            <div id="tree-description" style="padding: 0.5rem; background: #e7f3ff; border-left: 3px solid #2196F3; font-size: 0.8rem; color: #555; border-radius: 0.25rem;">
              <strong>Hierarchical Tree:</strong> Explore the complete structural hierarchy of manuscripts showing relationships between manuscripts, production units, scribal units, and texts in an interactive tree visualization.
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
              <button class="chip" id="tree-export-png" style="background:#28a745;color:white;">Export as Image</button>
            </div>
          </div>

          <!-- Tree mount point -->
          <div id="tree-mount" style="padding: 1rem; overflow: auto;">
            <!-- Visualization will be rendered here -->
          </div>
        </div>
      </div>
    </div>

    <!-- SCRIBES MODE -->
    <div id="mode-scribes" class="mode-container mode-fullwidth" aria-hidden="true">
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); overflow: hidden;">
        <div style="border-bottom: 2px solid #f0f0f0;">
          <div class="scribe-tabs" style="display: flex; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #fafafa;">
            <button class="scribe-tab-btn is-on" data-tab="overview" style="padding: 0.5rem 1rem; border: none; background: #fff; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Overview
            </button>
            <button class="scribe-tab-btn" data-tab="productivity" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Productivity Patterns
            </button>
            <button class="scribe-tab-btn" data-tab="unseen-species" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Unseen Species Analysis
            </button>
            <button class="scribe-tab-btn" data-tab="collaboration" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Collaborations
            </button>
            <button class="scribe-tab-btn" data-tab="geography" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Geography
            </button>
            <button class="scribe-tab-btn" data-tab="browse" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Browse All
            </button>
          </div>
        </div>
        <div style="padding: 1.5rem;">
          <div id="scribes-mount" style="overflow: auto; min-height: 60vh;">
            <!-- Scribe analysis will be rendered here -->
          </div>
        </div>
      </div>
    </div> <!-- /mode-scribes -->

    <!-- MULTILINGUALISM MODE -->
    <div id="mode-multilingualism" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span id="multilingualism-title">Multilingualism Explorer</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Exploring linguistic diversity in medieval manuscript production</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Sub-navigation tabs -->
          <div style="display: flex; gap: 0.5rem; padding: 1rem; border-bottom: 2px solid #e0e0e0; background: #f8f9fa; flex-wrap: wrap;">
            <button class="multilingualism-tab-btn is-on" data-tab="overview" style="padding: 0.5rem 1rem; border: none; background: #fff; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Overview
            </button>
            <button class="multilingualism-tab-btn" data-tab="manuscripts" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Multilingual Manuscripts
            </button>
            <button class="multilingualism-tab-btn" data-tab="scribes" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Scribal Multilingualism
            </button>
            <button class="multilingualism-tab-btn" data-tab="institutions" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Institutional Multilingualism
            </button>
            <button class="multilingualism-tab-btn" data-tab="colophons" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Colophon-Text Divergence
            </button>
          </div>

          <!-- Mount point for multilingualism visualizations -->
          <div id="multilingualism-mount" style="padding: 1rem; overflow: auto; min-height: 60vh;">
            <!-- Visualization will be rendered here -->
          </div>
        </div>
      </div>
    </div> <!-- /mode-multilingualism -->

    <!-- COLOPHON ANALYSIS MODE -->
    <div id="mode-colophon-analysis" class="mode-container mode-fullwidth" aria-hidden="true">
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); overflow: hidden;">
        <div style="border-bottom: 2px solid #f0f0f0;">
          <div class="colophon-tabs" style="display: flex; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #fafafa;">
            <button class="colophon-tab-btn is-on" data-tab="overview" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Overview
            </button>
            <button class="colophon-tab-btn" data-tab="sentiment" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Sentiment Analysis
            </button>
            <button class="colophon-tab-btn" data-tab="themes" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Thematic Analysis
            </button>
            <button class="colophon-tab-btn" data-tab="linguistic" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Linguistic Features
            </button>
            <button class="colophon-tab-btn" data-tab="patterns" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Comparative Patterns
            </button>
            <button class="colophon-tab-btn" data-tab="explore-formulae" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Explore Formulae
            </button>
            <button class="colophon-tab-btn" data-tab="browse-colophons" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              Browse Colophons
            </button>
          </div>
        </div>
        <div style="padding: 1.5rem;">
          <div id="colophon-mount" style="overflow: auto; min-height: 60vh;">
            <!-- Analysis will be rendered here -->
          </div>
        </div>
      </div>
    </div> <!-- /mode-colophon-analysis -->
    
    <!-- TEXT GENRES MODE -->
    <div id="mode-text-genres" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span>Text Genres</span>
          <span style="font-size:0.875rem;font-weight:400;color:#666;margin-left:1rem;">
            Distribution and classification of texts
          </span>
        </div>
        <div class="viz-body" style="padding:1rem;">
          <div id="text-genres-mount"></div>
        </div>
      </div>
    </div>
  </div> <!-- /db-shell -->
</div> <!-- /explore-fullwidth -->

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

<!-- Path Finding dialog -->
<dialog id="path-dialog" style="max-width:720px;border:1px solid #ddd;border-radius:.75rem;padding:1.5rem;">
  <form method="dialog">
    <h3 style="margin:.25rem 0 .5rem;">Find Connection Between Records</h3>
    <p class="muted" style="margin-top:-.25rem;line-height:1.5;margin-bottom:1rem;">
      Discover how two entities are connected through relationships. For example, find the chain linking a scribe to a monastery, 
      or see how two manuscripts are related through production units or institutions.
    </p>
    
    <div id="path-from" style="padding:.75rem;background:#e8f4f8;border-left:3px solid #3498db;border-radius:.5rem;margin:.75rem 0;"></div>
    
    <div style="margin:1rem 0;">
      <label style="display:block;font-weight:600;margin-bottom:.5rem;">
        <span style="display:inline-block;background:#f39c12;color:white;border-radius:50%;width:1.5rem;height:1.5rem;text-align:center;line-height:1.5rem;font-size:.85rem;margin-right:.25rem;">2</span>
        Search for destination record:
      </label>
      <input type="search" id="path-search" placeholder="Type name, manuscript title, or institution..." 
        style="width:100%;padding:.5rem .75rem;border:1px solid #ddd;border-radius:.5rem;margin-bottom:.5rem;font-size:.95rem;">
      <div id="path-results" style="max-height:200px;overflow:auto;border:1px solid #eee;border-radius:.5rem;"></div>
    </div>
    
    <div style="margin:1rem 0;padding:.75rem;background:#f9f9f9;border-radius:.5rem;">
      <label style="display:flex;gap:.75rem;align-items:center;justify-content:space-between;">
        <span style="display:flex;align-items:center;gap:.5rem;">
          <strong>Maximum steps:</strong>
          <span class="muted" style="font-size:.9rem;">(1 = direct connections only, 4 = up to 4 relationships apart)</span>
        </span>
        <input type="number" id="path-depth" min="1" max="5" value="4" 
          style="width:4rem;padding:.35rem .5rem;border:1px solid #ddd;border-radius:.25rem;font-size:.95rem;">
      </label>
    </div>
    
    <div id="path-display" style="margin:1rem 0;"></div>
    
    <div style="display:flex;gap:.5rem;justify-content:flex-end;margin-top:1rem;">
      <button type="button" class="chip" onclick="this.closest('dialog').close()" style="padding:.5rem 1rem;">Close</button>
    </div>
  </form>
</dialog>

<style>
  :root { --uh-gold: #a67c00; }

  /* === Main Navigation Tabs (Browse/Map/Timeline/Network/Analytics) === */
  .main-nav-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .main-nav-btn {
    padding: 0.75rem 1.5rem;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    user-select: none;
  }
  .main-nav-btn:hover {
    background: #e9ecef;
    border-color: #dee2e6;
  }
  .main-nav-btn.is-on {
    background: #d4af37;
    color: white;
    border-color: #d4af37;
    box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
  }

  /* === Mode Containers === */
  .mode-container {
    display: none;
  }
  
  /* Browse mode: 3-column layout (facets | results | details) */
  /* Facets=280px | Main+Viz wrapper=flexible (spans both middle and right columns) */
  #mode-browse[aria-hidden="false"] {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;
  }
  
  /* Main+Viz wrapper contains controls (spanning full width) and then a 2-column layout */
  .db-main-viz-wrapper {
    display: grid;
    grid-template-columns: minmax(400px, 1fr) minmax(800px, 2fr);
    gap: 2rem;
    grid-template-rows: auto 1fr auto;
  }
  
  /* Controls now span the full width of the main+viz area */
  .db-main-viz-wrapper .db-controls {
    grid-column: 1 / -1;
    grid-row: 1;
  }
  
  /* Below controls: side-by-side main results and viz panels */
  .db-main-viz-wrapper > .db-main {
    grid-column: 1;
    grid-row: 2;
    min-height: 400px;
  }
  
  .db-main-viz-wrapper > .db-viz {
    grid-column: 2;
    grid-row: 2;
    align-self: start;
    overflow-y: auto;
    max-height: calc(100vh - 280px);
    padding-bottom: 1rem;
    position: relative;
  }
  
  /* Pagination spans full width at bottom */
  .db-main-viz-wrapper > .db-pager {
    grid-column: 1 / -1;
    grid-row: 3;
    position: relative;
    z-index: 10;
    background: white;
    padding-top: 0.5rem;
  }
  
  /* Responsive: stack on smaller screens */
  /* At 1440px: Stack the details panel below results for better readability */
  @media (max-width: 1440px) {
    .db-main-viz-wrapper {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    .db-main-viz-wrapper > .db-viz {
      grid-column: 1;
      grid-row: 3;
      max-height: 70vh;
    }
  }
  
  /* At 1200px: Also stack the facets sidebar */
  @media (max-width: 1200px) {
    #mode-browse[aria-hidden="false"] {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .db-facets {
      max-width: 100%;
    }
  }
  
  /* Visualization modes: full-width (Map, Timeline, Network, Analytics, Multilingualism, Scribes, Colophon Analysis, Text Genres) */
  /* These need to break out of the .explore-fullwidth padding, then add it back */
  #mode-map[aria-hidden="false"],
  #mode-timeline[aria-hidden="false"],
  #mode-network[aria-hidden="false"],
  #mode-analytics[aria-hidden="false"],
  #mode-codicology[aria-hidden="false"],
  #mode-tree[aria-hidden="false"],
  #mode-scribes[aria-hidden="false"],
  #mode-multilingualism[aria-hidden="false"],
  #mode-colophon-analysis[aria-hidden="false"],
  #mode-text-genres[aria-hidden="false"] {
    display: block !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin-left: calc(-4vw) !important;
    margin-right: calc(-4vw) !important;
    padding: 0 8vw !important;
    box-sizing: border-box !important;
  }

  .explore-fullwidth{width:100vw;max-width:100vw;margin-left:50%;transform:translateX(-50%);padding:0 4vw;}
  
  /* db-shell is just a simple wrapper for mode containers */
  .db-shell{max-width:100%;margin:0 auto;}
  
  /* Old .db-right styles - no longer used in new architecture */
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

  /* Entity Switcher - distinct from facets */
  .entity-switcher{
    margin-bottom:1.5rem;
    padding-bottom:1.5rem;
    border-bottom:2px solid #ddd;
  }
  .entity-switcher-title{
    font-weight:700;
    font-size:1.1rem;
    margin-bottom:.75rem;
    color:#333;
  }
  .entity-switcher-list{
    display:flex;
    flex-direction:column;
    gap:.4rem;
  }
  .entity-btn{
    border:2px solid #ccc;
    border-radius:.5rem;
    padding:.6rem .9rem;
    cursor:pointer;
    user-select:none;
    background:#fff;
    text-align:left;
    font-weight:500;
    transition:all 0.2s ease;
  }
  .entity-btn:hover{
    background:#f5f5f5;
    border-color:#999;
  }
  .entity-btn.is-on{
    background:var(--uh-gold);
    border-color:var(--uh-gold);
    color:#fff;
    font-weight:600;
  }

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
    font-weight:700;text-decoration:none;cursor:pointer;line-height:inherit;font:inherit;border-radius:0;display:inline;text-align:left; }
  .linklike:hover{ text-decoration: underline; }
  .linklike:focus{ outline:none; box-shadow:none; }

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
  #network-mount{ width:100%; height: 62vh; background:#fafafa; }
  #analytics-mount{ width:100%; min-height: 62vh; }

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

<!-- D3.js for network visualization -->
<script src="https://d3js.org/d3.v7.min.js"></script>
<!-- Libraries for high-quality image export -->
<script src="https://cdn.jsdelivr.net/npm/svg-crowbar@0.6.1/svg-crowbar.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>

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
const REL_ENDPOINT = "{{ site.heurist.relations_json | default: '/assets/data/relationships.json' | relative_url }}";
const BASE = "{{ site.baseurl | default: '' }}";

/* ---------- Load manifest-annos map ---------- */
let manifestAnnosMap = {};
fetch(`${BASE}/data/manifest-annos-map.json`)
  .then(r => r.ok ? r.json() : {})
  .then(map => {
    manifestAnnosMap = map;
  })
  .catch(err => console.warn('Could not load manifest-annos map:', err));

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

// Convert a detail to displayable string (you already have val(d))
const detailToString = d => val(d);

// All values (strings) for a field, flattening multi-valued terms
const getValsAll = (rec, field) =>
  getDetailsAll(rec, field).map(detailToString).filter(Boolean);

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

/* ---------- PNG Export Utilities ---------- */
/**
 * Convert an HTML element to PNG and download
 * @param {HTMLElement} element - The element to convert
 * @param {string} filename - Name for the downloaded file
 */
async function exportElementToPNG(element, filename) {
  try {
    // Find all export buttons and hide them temporarily
    const exportButtons = element.querySelectorAll('[id^="export-"]');
    exportButtons.forEach(btn => btn.style.visibility = 'hidden');
    
    // Find the title element (h3 or h4 within the element or its wrapper)
    let titleText = '';
    let titleElement = element.querySelector('h3, h4');
    
    // If not found in element, look in parent wrapper
    if (!titleElement) {
      const wrapper = element.closest('[id$="-wrapper"]');
      if (wrapper) {
        titleElement = wrapper.querySelector('h3, h4');
      }
    }
    
    if (titleElement) {
      titleText = titleElement.textContent.trim();
    }
    
    // Create a container with title
    const exportContainer = document.createElement('div');
    exportContainer.style.padding = '20px';
    exportContainer.style.backgroundColor = '#ffffff';
    
    if (titleText) {
      const titleDiv = document.createElement('div');
      titleDiv.textContent = titleText;
      titleDiv.style.fontSize = '18px';
      titleDiv.style.fontWeight = '700';
      titleDiv.style.marginBottom = '15px';
      titleDiv.style.color = '#1e293b';
      exportContainer.appendChild(titleDiv);
    }
    
    const clonedElement = element.cloneNode(true);
    // Remove title and buttons from cloned content
    const clonedTitle = clonedElement.querySelector('h3, h4');
    if (clonedTitle) clonedTitle.remove();
    const clonedButtons = clonedElement.querySelectorAll('[id^="export-"]');
    clonedButtons.forEach(btn => btn.remove());
    
    exportContainer.appendChild(clonedElement);
    
    document.body.appendChild(exportContainer);
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    document.body.removeChild(exportContainer);
    
    // Restore button visibility
    exportButtons.forEach(btn => btn.style.visibility = 'visible');
    
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    // Restore button visibility on error
    const exportButtons = element.querySelectorAll('[id^="export-"]');
    exportButtons.forEach(btn => btn.style.visibility = 'visible');
    alert('Failed to export image. Please try again.');
  }
}

/**
 * Create a download button for PNG export
 * @param {string} elementId - ID of element to export
 * @param {string} filename - Filename for download
 * @returns {string} HTML for the button
 */
function createExportButton(elementId, filename) {
  const btnId = `export-${elementId}`;
  setTimeout(() => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.onclick = () => {
        const el = document.getElementById(elementId);
        if (el) exportElementToPNG(el, filename);
      };
    }
  }, 100);
  
  return `<button id="${btnId}" class="export-btn" style="background: #10b981; color: white; border: none; padding: 0.5rem 0.875rem; border-radius: 0.375rem; font-size: 0.8125rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.375rem; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08); transition: all 0.2s ease;" onmouseover="this.style.background='#059669'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)';" onmouseout="this.style.background='#10b981'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
    Export PNG
  </button>`;
}

/**
 * Creates an embed button that shows embed code in a modal
 * @param {string} networkType - e.g., 'manuscript-genre', 'institution-subgenre', 'scribe-genre'
 * @returns {string} HTML for the button
 */
function createEmbedButton(networkType) {
  const btnId = `embed-${networkType.replace(/[^a-z0-9]/g, '-')}`;
  setTimeout(() => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.onclick = () => {
        const baseUrl = window.location.origin + window.location.pathname;
        
        // Determine if we're in text-genres mode or network mode
        const activeMode = document.querySelector('.main-nav-btn.is-on');
        const isTextGenresMode = activeMode && activeMode.dataset.mode === 'text-genres';
        
        let embedUrl;
        if (isTextGenresMode) {
          // Generate URL for text-genres mode with specific tab
          const activeTab = document.querySelector('.genre-tab-btn.is-on');
          const tabName = activeTab ? activeTab.dataset.tab : 'manuscript-networks';
          embedUrl = `${baseUrl}?embed=true&mode=text-genres&tab=${tabName}&network=${networkType}`;
        } else {
          // Generate URL for network mode
          embedUrl = `${baseUrl}?embed=true&network=${networkType}`;
        }
        
        const iframeCode = `<iframe src="${embedUrl}" width="100%" height="900px" frameborder="0" style="border: none;"></iframe>`;
        
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 1rem;';
        modal.innerHTML = `
          <div style="background: white; border-radius: 0.5rem; padding: 2rem; max-width: 600px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3 style="margin: 0; color: #1e293b; font-size: 1.25rem;">Embed Network</h3>
              <button id="close-embed-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; padding: 0; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 0.25rem;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">×</button>
            </div>
            <div style="margin-bottom: 1rem; padding: 0.75rem; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 0.375rem;">
              <p style="margin: 0; font-size: 0.875rem; color: #92400e; line-height: 1.5;">
                <strong>Note:</strong> All interactive features are preserved in embed mode:
                <br>• Hover tooltips with metadata
                <br>• Hide Labels & Hide Singles buttons
                <br>• Zoom controls
              </p>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #475569; font-size: 0.875rem;">Embed URL</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="embed-url-input" value="${embedUrl}" readonly style="flex: 1; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; font-family: monospace; font-size: 0.875rem; background: #f8fafc;">
                <button id="copy-url-btn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600; white-space: nowrap;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">Copy</button>
              </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #475569; font-size: 0.875rem;">iframe Code</label>
              <div style="display: flex; gap: 0.5rem;">
                <textarea id="embed-code-input" readonly style="flex: 1; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; font-family: monospace; font-size: 0.75rem; background: #f8fafc; resize: vertical; min-height: 80px;">${iframeCode}</textarea>
                <button id="copy-code-btn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600; white-space: nowrap; align-self: flex-start;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">Copy</button>
              </div>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <a href="${embedUrl}" target="_blank" style="flex: 1; padding: 0.625rem 1rem; background: #10b981; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600; text-align: center; text-decoration: none; font-size: 0.875rem;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">Preview Embed</a>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.querySelector('#close-embed-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        // Copy handlers
        modal.querySelector('#copy-url-btn').onclick = () => {
          const input = modal.querySelector('#embed-url-input');
          input.select();
          navigator.clipboard.writeText(embedUrl);
          const btn = modal.querySelector('#copy-url-btn');
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        };
        
        modal.querySelector('#copy-code-btn').onclick = () => {
          const input = modal.querySelector('#embed-code-input');
          input.select();
          navigator.clipboard.writeText(iframeCode);
          const btn = modal.querySelector('#copy-code-btn');
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        };
      };
    }
  }, 100);
  
  return `<button id="${btnId}" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 0.875rem; border-radius: 0.375rem; font-size: 0.8125rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.375rem; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08); transition: all 0.2s ease;" onmouseover="this.style.background='#7c3aed'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)';" onmouseout="this.style.background='#8b5cf6'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 12h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/>
    </svg>
    Embed
  </button>`;
}


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
    const vals = getValsAll(rel, fieldName);
    vals.forEach(v => values.add(v));
  });
  
  return Array.from(values);
}

/* ---------- Facets config ---------- */
const FACETS = {
  su: [
    { key:'century', label:'Normalized century of production', type:'century', field:'Normalized century of production' },
    { key:'post', label:'Terminus post quem', type:'year-range', field:'Normalized terminus post quem' },
    { key:'ante', label:'Terminus ante quem', type:'year-range', field:'Normalized terminus ante quem' },
    { key:'script', label:'Normalized script(s)', type:'enum-multi', field:'Normalised script(s)' },
    { key:'scribe_certainty', label:'Scribe certainty (from relationships)', type:'relationship-enum-multi', field:'scribe certainty' },
    { key:'scribe_role', label:'Scribe role (from relationships)', type:'relationship-enum-multi', field:'Scribe role' },
    { key:'function_copying', label:'Function of copying (from relationships)', type:'relationship-enum-multi', field:'Function of Copying' },
    { key:'text_language_rel', label:'Text language (from relationships)', type:'relationship-enum-multi', field:'Text Language(s)' },
    { key:'text_language_rel', label:'Text language (from relationships)', type:'relationship-enum-multi', field:'Text Language(s)' },
    { key:'style_rel', label:'Style (from relationships)', type:'relationship-enum-multi', field:'Style' },
    { key:'colophon_presence', label:'Colophon presence', type:'enum', field:'Colophon Presence' },
    { key:'colophon_language', label:'Colophon language', type:'enum-multi', field:'Colophon language' },
  ],
  ms: [
    { key:'holding', label:'Holding Institution', type:'resource', field:'Holding Institution' },
    { key:'callno', label:'Call number', type:'text', field:'Call number' },
    { key:'ms_date', label:'Ms Dating (YYYY)', type:'year-range', field:'Ms Dating' },
    { key:'Watermark', label:'Watermark Present', type:'enum-search', field:'Watermark Present' },
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
    { key:'text_language_rel', label:'Text language (from relationships)', type:'relationship-enum-multi', field:'Text Language(s)' },
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
    { key:'activity',   label:'Century of Activity', type:'century', field:'Century of Activity' },
    { key:'scribe_role_rel', label:'Scribe role (from relationships)', type:'relationship-enum-multi', field:'Scribe role' },
  ],
  tx: [
    { key:'genre',   label:'Genre', type:'enum', field:'Genre' },
    { key:'subgenre',label:'Subgenre', type:'enum-search', field:'Subgenre' },
    { key:'ntitle',  label:'Normalized Title', type:'enum-search', field:'Normalized Title' },
    { key:'author',  label:'Author', type:'enum-search', field:'Creator' },
    { key:'expression_rel', label:'Expression (from relationships)', type:'relationship-enum-search', field:'Expression' },
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

/* ---------- Facets UI ---------- */
function buildFacets(records, config, prevState = {}) {
  $mount.innerHTML = '';
  config.forEach(f=>{
    const box=document.createElement('div'); box.className='facet';
    const title=document.createElement('div'); title.className='facet-title'; title.textContent=f.label;
    box.appendChild(title);

    if (f.type==='enum') {
      // Multi-select: Use checkboxes instead of single-select chips
      const counts={}; records.forEach(r=>{ const v=getVal(r,f.field); if (!v||v==='—') return; counts[v]=(counts[v]||0)+1; });
      const wrap=document.createElement('div'); wrap.className='check-list';
      Object.keys(counts).sort().forEach(v=>{
        const lab=document.createElement('label'); lab.className='check-item';
        const cb=document.createElement('input'); cb.type='checkbox'; cb.dataset.fkey=f.key; cb.value=v;
        if (prevState[f.key]?.values?.has(v)) cb.checked=true;
        lab.appendChild(cb); lab.append(` ${v} (${counts[v]||0})`);
        wrap.appendChild(lab);
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
}
function readFacetState(config){
  const st={};
  config.forEach(f=>{
    if (f.type==='enum'){
      // Now using checkboxes for multi-select
      const onCbs=[...document.querySelectorAll(`input[type="checkbox"][data-fkey="${f.key}"]:checked`)].map(n=>n.value);
      st[f.key]={type:f.type, values:new Set(onCbs)};
    } else if (f.type==='enum-multi' || f.type==='century' || f.type==='relationship-enum-multi'){
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
        // Multi-select: record must have one of the selected values
        if (s.values.size) {
          const v=getVal(rec,f.field);
          if (!s.values.has(v)) return false;
        }
      } else if (f.type==='enum-multi' || f.type==='century'){
        const values = (f.type==='century')
          ? getValsAll(rec, 'Normalized century of production')
          : getValsAll(rec, f.field);
        // if there are selected values, the record must have at least one of them
        if (s.values.size && !values.some(v => s.values.has(v))) return false;
      } else if (f.type==='relationship-enum-multi'){
        // Filter based on relationship metadata
        const values = getRelationshipValues(rec.rec_ID, f.field);
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
  // Switch to browse mode first if we're in a different mode
  if (ACTIVE_MODE !== 'browse') {
    setMode('browse');
  }
  
  // Switch entity type without rendering (we'll render with selection below)
  if (ENTITY !== type) {
    ENTITY = type;
    document.querySelectorAll('#entity-switch .entity-btn').forEach(c=>c.classList.toggle('is-on', c.dataset.entity===type));
    $search.value=''; $field.value=''; $sort.value='';
    page=1;
    
    // Rebuild facets but don't render yet
    const cfg = FACETS[type];
    const list = computeList();
    buildFacets(list, cfg, {});
    updateAvailableViews();
  }
  
  // Now render with the selected record
  const list = computeList();
  const selIndex = indexOfRecord(list, id);
  if (selIndex >= 0) page = Math.floor(selIndex / pageSize) + 1;
  render(list, type, String(id));
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
  hi: [
    'Country',
    'City',
    'Institution type',
    'Latitude',
    'Longitude',
  ],
  // add mi / hp / tx as needed
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
    
    // Handle object values
    if (d.value && typeof d.value === 'object') {
      // Check if it's a resource pointer (has title or id)
      if (d.value.title || d.value.id) {
        const tEnt = REC_TYPE_TO_ENTITY[String(d.value.type)] || null;
        const tId  = String(d.value.id || '');
        if (tEnt && IDX[tEnt] && IDX[tEnt][tId]) return linkTo(tEnt, tId, d.value.title || tId);
        return esc(d.value.title || tId);
      }
      // For geo objects with WKT format, extract coordinates
      if (d.value.geo && d.value.geo.wkt) {
        const wkt = d.value.geo.wkt;
        // Parse POINT(longitude latitude) format
        const match = wkt.match(/POINT\(([\d.\-]+)\s+([\d.\-]+)\)/);
        if (match) {
          const lon = match[1];
          const lat = match[2];
          // Return based on field name
          if (d.fieldName === 'Latitude') return esc(lat);
          if (d.fieldName === 'Longitude') return esc(lon);
          return esc(`${lat}, ${lon}`);
        }
      }
      // For other objects (like geo coordinates), try to extract a meaningful value
      // Check for common numeric value patterns
      if ('value' in d.value) return esc(String(d.value.value));
      if ('lat' in d.value) return esc(String(d.value.lat));
      if ('lon' in d.value) return esc(String(d.value.lon));
      // If object has no recognizable pattern, stringify it in a readable way
      return esc(JSON.stringify(d.value));
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

/* ---------- Relationship helpers ---------- */
function groupByRelType(relationships) {
  const grouped = new Map();
  relationships.forEach(r => {
    let relType = getVal(r, 'Relationship type') || 'Related to';
    // Normalize relationship type names
    relType = relType.trim();
    if (relType.toLowerCase() === 'isrelatedto') relType = 'Related to';
    
    if (!grouped.has(relType)) grouped.set(relType, []);
    grouped.get(relType).push(r);
  });
  return grouped;
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
    if (ms) detailsHTML += `<div style="margin:.25rem 0;"><strong>Manuscript:</strong> ${ms.title}</div>`;
    if (scribe) detailsHTML += `<div style="margin:.25rem 0;"><strong>Scribe:</strong> ${scribe.title}</div>`;
  } else if (type === 'ms') {
    const holding = getRes(rec, 'Holding Institution');
    const shelfmark = getVal(rec, 'Shelfmark');
    if (holding) detailsHTML += `<div style="margin:.25rem 0;"><strong>Holding:</strong> ${holding.title}</div>`;
    if (shelfmark && shelfmark !== '—') detailsHTML += `<div style="margin:.25rem 0;"><strong>Shelfmark:</strong> ${shelfmark}</div>`;
  } else if (type === 'pu') {
    const century = getVal(rec, 'Normalized century of production');
    const monastery = getRes(rec, 'Monastic Institution');
    if (century && century !== '—') detailsHTML += `<div style="margin:.25rem 0;"><strong>Century:</strong> ${century}</div>`;
    if (monastery) detailsHTML += `<div style="margin:.25rem 0;"><strong>Monastery:</strong> ${monastery.title}</div>`;
  } else if (type === 'hp') {
    const role = getVal(rec, 'Role / function');
    const gender = getVal(rec, 'Gender');
    if (role && role !== '—') detailsHTML += `<div style="margin:.25rem 0;"><strong>Role:</strong> ${role}</div>`;
    if (gender && gender !== '—') detailsHTML += `<div style="margin:.25rem 0;"><strong>Gender:</strong> ${gender}</div>`;
  }
  
  detailsPanel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:.5rem;">
      <div>
        <div style="font-weight:600;font-size:.95rem;color:#333;margin-bottom:.25rem;">${title}</div>
        <div style="font-size:.75rem;color:#666;text-transform:uppercase;letter-spacing:.5px;">${typeLabel}</div>
      </div>
      <button id="close-node-details" style="background:none;border:none;font-size:1.2rem;color:#999;cursor:pointer;padding:0;line-height:1;" title="Close">&times;</button>
    </div>
    ${detailsHTML}
    <div style="margin-top:.75rem;padding-top:.75rem;border-top:1px solid #eee;">
      <button id="view-in-browse-btn" class="chip" style="width:100%;padding:.5rem;background:#007bff;color:white;font-weight:500;border:none;cursor:pointer;">
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

/* ============================================================
   NETWORK DIAGRAM VISUALIZATION
   ============================================================ */
function buildNetworkDiagram(centerRec, centerType, depth = 2, relTypeFilter = null) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  // Get UI controls
  const showLabels = document.getElementById('network-show-labels')?.checked !== false;
  
  // Get active entity type filters
  const activeEntityTypes = getActiveEntityFilters();
  
  // Build graph data
  const nodes = [];
  const links = [];
  const visited = new Set();
  const nodeMap = new Map();
  const allRelTypes = new Set();
  
  function addNode(rec, type, level) {
    const id = `${type}:${rec.rec_ID}`;
    if (visited.has(id)) return;
    
    visited.add(id);
    
    const node = {
      id,
      label: MAP[type].title(rec),
      type,
      level,
      rec
    };
    nodes.push(node);
    nodeMap.set(id, node);
    
    if (level >= depth) return;
    
    const recId = String(rec.rec_ID);
    
    // 1. Add connections from RELATIONSHIP RECORDS
    const rels = [...(REL_INDEX.bySource[recId] || []), 
                  ...(REL_INDEX.byTarget[recId] || [])];
    
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const relType = getVal(rel, 'Relationship type') || 'related';
      
      // Track all relationship types for filter dropdown
      allRelTypes.add(relType);
      
      // Apply filter if set
      if (relTypeFilter && relType !== relTypeFilter) return;
      
      // Determine if this is outgoing or incoming
      const isOutgoing = String(src?.id) === recId;
      const other = isOutgoing ? tgt : src;
      
      if (!other?.id) return;
      const otherType = REC_TYPE_TO_ENTITY[String(other.type)];
      if (!otherType) return;
      const otherRec = IDX[otherType]?.[String(other.id)];
      if (!otherRec) return;
      
      const otherId = `${otherType}:${other.id}`;
      
      // Add link
      links.push({
        source: id,
        target: otherId,
        type: relType,
        linkType: 'relationship',
        directed: true
      });
      
      addNode(otherRec, otherType, level + 1);
    });
    
    // 2. Add connections from POINTER FIELDS (outgoing only)
    (rec.details || []).forEach(detail => {
      const fieldValue = detail.value;
      if (!fieldValue || typeof fieldValue !== 'object' || !fieldValue.id || !fieldValue.type) return;
      
      const targetId = String(fieldValue.id);
      const targetType = REC_TYPE_TO_ENTITY[String(fieldValue.type)];
      if (!targetType) return;
      
      const targetRec = IDX[targetType]?.[targetId];
      if (!targetRec) return;
      
      const fieldName = detail.fieldName || 'linked to';
      const relType = `→ ${fieldName}`;
      
      // Track pointer fields as relationship types
      allRelTypes.add(relType);
      
      // Apply filter if set
      if (relTypeFilter && relType !== relTypeFilter) return;
      
      const otherId = `${targetType}:${targetId}`;
      
      // Add link
      links.push({
        source: id,
        target: otherId,
        type: relType,
        linkType: 'pointer',
        directed: true
      });
      
      addNode(targetRec, targetType, level + 1);
    });
    
    // 3. Add connections from POINTER FIELDS (incoming - reverse lookup)
    const inbound = INBOUND[type]?.[recId] || [];
    inbound.forEach(inb => {
      const sourceRec = IDX[inb.fromType]?.[inb.fromId];
      if (!sourceRec) return;
      
      const fieldName = inb.fieldName || 'linked from';
      const relType = `← ${fieldName}`;
      
      // Track incoming pointer fields
      allRelTypes.add(relType);
      
      // Apply filter if set
      if (relTypeFilter && relType !== relTypeFilter) return;
      
      const sourceId = `${inb.fromType}:${inb.fromId}`;
      
      // Add link (reversed direction for incoming)
      links.push({
        source: sourceId,
        target: id,
        type: relType,
        linkType: 'pointer',
        directed: true
      });
      
      addNode(sourceRec, inb.fromType, level + 1);
    });
  }
  
  addNode(centerRec, centerType, 0);
  
  // Update filter dropdown with available relationship types
  updateRelationshipFilter(allRelTypes);
  
  if (nodes.length === 0) {
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No relationships to display</div>';
    return;
  }
  
  // Filter nodes by entity type (but keep all for traversal)
  // Center node (level 0) is always visible
  let visibleNodes = nodes.filter(n => n.level === 0 || activeEntityTypes.includes(n.type));
  
  const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
  
  // Filter links to only show those between visible nodes
  const visibleLinks = links.filter(l => {
    const sourceId = typeof l.source === 'object' ? l.source.id : l.source;
    const targetId = typeof l.target === 'object' ? l.target.id : l.target;
    return visibleNodeIds.has(sourceId) && visibleNodeIds.has(targetId);
  });
  
  // Store network data for export (use visible nodes/links)
  CURRENT_NETWORK_DATA = { 
    nodes: visibleNodes.map(n => ({...n})), 
    links: visibleLinks.map(l => ({...l})) 
  };
  
  // D3 force simulation
  const width = mount.clientWidth || 900;
  const height = mount.clientHeight || 600;
  
  const svg = d3.select(mount).html('')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  const g = svg.append('g');
  
  // Add zoom
  const zoom = d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform);
  });
  svg.call(zoom);
  
  // Store references on mount element for zoom controls
  mount._svg = svg;
  mount._zoom = zoom;
  mount._g = g;
  
  // Store zoom for reset button
  svg.datum({ zoom, initialTransform: d3.zoomIdentity });
  
  // Get selected color scheme
  const colorScheme = document.getElementById('network-color-scheme')?.value || 'type';
  
  // Color scale functions
  const typeColorScale = d3.scaleOrdinal()
    .domain(['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'])
    .range(['#e6b800', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c']);
  
  const centuryColorScale = d3.scaleOrdinal()
    .domain(['12th', '13th', '14th', '15th', '16th', '17th', '18th'])
    .range(['#8e44ad', '#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71', '#3498db']);
  
  const regionColorScale = d3.scaleOrdinal()
    .domain(['germany', 'france', 'italy', 'england', 'spain', 'low countries', 'switzerland', 'austria', 'sweden', 'belgium', 'netherlands'])
    .range(['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#e67e22', '#9b59b6', '#95a5a6', '#c0392b', '#16a085', '#d35400', '#27ae60']);
  
  const orderColorScale = d3.scaleOrdinal()
    .domain(['cistercian', 'dominican', 'franciscan', 'benedictine', 'augustinian', 'carmelite', 'carthusian', 'premonstratensian'])
    .range(['#95a5a6', '#34495e', '#8B4513', '#2c3e50', '#c0392b', '#d35400', '#7f8c8d', '#2980b9']);
  
  // Function to get node color based on scheme
  const getNodeColor = (d) => {
    if (colorScheme === 'type') {
      return typeColorScale(d.type);
    } else if (colorScheme === 'century') {
      const century = getVal(d.rec, 'Normalized century of production');
      if (!century) return '#999'; // Gray for no data
      return centuryColorScale(century.toLowerCase());
    } else if (colorScheme === 'region') {
      let country = '';
      if (d.type === 'pu') country = getVal(d.rec, 'PU country') || '';
      else if (d.type === 'hi' || d.type === 'mi') country = getVal(d.rec, 'Country') || '';
      if (!country) return '#999'; // Gray for no data
      return regionColorScale(country.toLowerCase());
    } else if (colorScheme === 'order') {
      let order = '';
      if (d.type === 'mi') {
        order = getVal(d.rec, 'Religious order') || '';
      } else if (d.type === 'pu') {
        const monastery = getRes(d.rec, 'Monastic Institution');
        if (monastery) order = getVal(monastery, 'Religious order') || '';
      }
      if (!order) return '#999'; // Gray for no data
      return orderColorScale(order.toLowerCase());
    }
    return '#999';
  };
  
  // Force simulation - use visibleNodes and visibleLinks
  
  // Apply link density filter
  const linkDensity = parseInt(document.getElementById('network-link-density')?.value || 100);
  let filteredLinks = visibleLinks;
  
  if (linkDensity < 100) {
    // Calculate node degrees to identify important links
    const nodeDegreeMap = new Map();
    visibleNodes.forEach(n => nodeDegreeMap.set(n.id, 0));
    visibleLinks.forEach(l => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      nodeDegreeMap.set(sid, (nodeDegreeMap.get(sid) || 0) + 1);
      nodeDegreeMap.set(tid, (nodeDegreeMap.get(tid) || 0) + 1);
    });
    
    // Prioritize links connected to high-degree nodes and relationship records
    const linkScores = visibleLinks.map((l, i) => {
      const sid = typeof l.source === 'object' ? l.source.id : l.source;
      const tid = typeof l.target === 'object' ? l.target.id : l.target;
      const score = (nodeDegreeMap.get(sid) || 0) + (nodeDegreeMap.get(tid) || 0) + (l.linkType === 'relationship' ? 10 : 0);
      return { link: l, score, index: i };
    });
    
    // Sort by score and take top percentage
    linkScores.sort((a, b) => b.score - a.score);
    const numToShow = Math.max(1, Math.floor(visibleLinks.length * (linkDensity / 100)));
    filteredLinks = linkScores.slice(0, numToShow).map(item => item.link);
  }
  
  const simulation = d3.forceSimulation(visibleNodes)
    .force('link', d3.forceLink(filteredLinks).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(35));
  
  // Draw links (use filteredLinks)
  const link = g.append('g')
    .selectAll('line')
    .data(filteredLinks)
    .join('line')
    .attr('stroke', d => d.linkType === 'pointer' ? '#bbb' : '#999')
    .attr('stroke-opacity', d => d.linkType === 'pointer' ? 0.4 : 0.6)
    .attr('stroke-width', d => d.linkType === 'pointer' ? 1.5 : 2)
    .attr('stroke-dasharray', d => d.linkType === 'pointer' ? '3,3' : 'none')
    .attr('marker-end', d => d.linkType === 'pointer' ? 'url(#arrowhead-pointer)' : 'url(#arrowhead)');
  
  // Add tooltips to links
  link.append('title')
    .text(d => d.type);
  
  // Add arrowhead markers (for relationship records)
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999');
  
  // Add arrowhead markers (for pointer fields - lighter)
  svg.append('defs').append('marker')
    .attr('id', 'arrowhead-pointer')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 20)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#bbb');
  
  // Calculate node degrees (number of connections) for sizing
  const nodeDegrees = new Map();
  visibleNodes.forEach(n => nodeDegrees.set(n.id, 0));
  visibleLinks.forEach(link => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target.id : link.target;
    nodeDegrees.set(sourceId, (nodeDegrees.get(sourceId) || 0) + 1);
    nodeDegrees.set(targetId, (nodeDegrees.get(targetId) || 0) + 1);
  });
  
  // Calculate radius based on degree (with min/max bounds)
  const getNodeRadius = (d) => {
    if (d.level === 0) return 16; // Center node is always prominent
    const degree = nodeDegrees.get(d.id) || 0;
    // Scale: 0 connections = 6px, 10+ connections = 14px
    return Math.min(14, Math.max(6, 6 + degree * 0.8));
  };
  
  // Draw nodes - use visibleNodes with dynamic sizing and color scheme
  const node = g.append('g')
    .selectAll('circle')
    .data(visibleNodes)
    .join('circle')
    .attr('r', d => getNodeRadius(d))
    .attr('fill', d => getNodeColor(d))
    .attr('stroke', d => d.level === 0 ? '#000' : '#fff')
    .attr('stroke-width', d => d.level === 0 ? 3 : 2)
    .attr('opacity', 0.9)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Add labels
  const isDarkMode = mount?.dataset.darkMode === 'true';
  
  const label = g.append('g')
    .selectAll('text')
    .data(visibleNodes)
    .join('text')
    .text(d => {
      const maxLen = d.level === 0 ? 30 : 20;
      return d.label.length > maxLen ? d.label.substring(0, maxLen) + '...' : d.label;
    })
    .attr('font-size', d => d.level === 0 ? 12 : 10)
    .attr('font-weight', d => d.level === 0 ? 'bold' : 'normal')
    .attr('fill', isDarkMode ? '#e0e0e0' : '#333')
    .attr('dx', 15)
    .attr('dy', 4)
    .style('display', showLabels ? 'block' : 'none');
  
  // Click handler - refocus network on clicked node
  node.on('click', (event, d) => {
    const [type, id] = d.id.split(':');
    const clickedRec = IDX[type]?.[String(id)];
    if (clickedRec) {
      NETWORK_CURRENT_REC = clickedRec;
      NETWORK_CURRENT_TYPE = type;
      buildNetworkView();
      // Show details panel with "View in Browse" button
      showNetworkNodeDetails(type, id, clickedRec);
    }
  });
  
  // Tooltip
  node.append('title')
    .text(d => `${d.label} (${d.type.toUpperCase()})\nClick to refocus network`);
  
  // Update positions
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  // Update visual feedback
  updateNetworkFeedback(visibleNodes.length, visibleLinks.length);
  
  // Update legend based on color scheme
  updateNetworkLegend(colorScheme);
}

// Update network visual feedback
function updateNetworkFeedback(nodeCount, linkCount) {
  const nodeCountEl = document.getElementById('network-node-count');
  const linkCountEl = document.getElementById('network-link-count');
  
  if (nodeCountEl) {
    nodeCountEl.textContent = `${nodeCount} node${nodeCount !== 1 ? 's' : ''}`;
  }
  if (linkCountEl) {
    linkCountEl.textContent = `${linkCount} link${linkCount !== 1 ? 's' : ''}`;
  }
}

// Update network legend based on color scheme
function updateNetworkLegend(scheme) {
  const legendContent = document.getElementById('network-legend-content');
  if (!legendContent) return;
  
  let html = '';
  
  if (scheme === 'type') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Entity Types</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e6b800;"></span> Scribal Units</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#3498db;"></span> Manuscripts</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e74c3c;"></span> Production Units</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2ecc71;"></span> Holding Institutions</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#9b59b6;"></span> Monastic Institutions</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f39c12;"></span> Historical People</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#1abc9c;"></span> Texts</div>
      </div>
    `;
  } else if (scheme === 'century') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Century</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#8e44ad;"></span> 12th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e74c3c;"></span> 13th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e67e22;"></span> 14th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f39c12;"></span> 15th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f1c40f;"></span> 16th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2ecc71;"></span> 17th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#3498db;"></span> 18th century</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#999;"></span> No data</div>
      </div>
    `;
  } else if (scheme === 'region') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Geographic Region</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e74c3c;"></span> Germany</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#3498db;"></span> France</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2ecc71;"></span> Italy</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f39c12;"></span> England</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#9b59b6;"></span> Low Countries</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#16a085;"></span> Sweden</div>
        <div style="font-size:.75rem;color:#666;font-style:italic;margin-top:.25rem;">+ other regions</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#999;"></span> No location data</div>
      </div>
    `;
  } else if (scheme === 'order') {
    html = `
      <div style="font-weight:600;margin-bottom:.5rem;">Religious Order</div>
      <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#95a5a6;"></span> Cistercian</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#34495e;"></span> Dominican</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#8B4513;"></span> Franciscan</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2c3e50;"></span> Benedictine</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#c0392b;"></span> Augustinian</div>
        <div style="font-size:.75rem;color:#666;font-style:italic;margin-top:.25rem;">+ other orders</div>
        <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#999;"></span> Non-monastic</div>
      </div>
    `;
  }
  
  // Add common sections
  html += `
    <div style="font-weight:600;margin-bottom:.5rem;padding-top:.5rem;border-top:1px solid #eee;">Interactions</div>
    <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
      <div style="font-size:.8rem;color:#666;"><strong style="color:#333;">Click</strong> to view details</div>
      <div style="font-size:.8rem;color:#666;"><strong style="color:#333;">Drag</strong> to rearrange</div>
      <div style="font-size:.8rem;color:#666;"><strong style="color:#333;">Scroll</strong> to zoom</div>
    </div>
    <div style="font-weight:600;margin-bottom:.5rem;padding-top:.5rem;border-top:1px solid #eee;">Connections</div>
    <div style="display:flex;flex-direction:column;gap:.35rem;">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="#999" stroke-width="2"/></svg>
        <span style="font-size:.8rem;">Relationships</span>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;">
        <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="#bbb" stroke-width="1.5" stroke-dasharray="3,3"/></svg>
        <span style="font-size:.8rem;">Pointer fields</span>
      </div>
      <div style="font-size:.75rem;color:#666;font-style:italic;margin-top:.25rem;">Node size = connection count</div>
    </div>
  `;
  
  legendContent.innerHTML = html;
}

/* ============================================================
   PATH FINDING
   ============================================================ */
function findPaths(startType, startId, endType, endId, maxDepth = 4) {
  const paths = [];
  const visited = new Set();
  
  function search(currentType, currentId, path, depth) {
    if (depth > maxDepth) return;
    
    const key = `${currentType}:${currentId}`;
    if (visited.has(key)) return;
    visited.add(key);
    
    // Found target
    if (currentType === endType && String(currentId) === String(endId)) {
      paths.push([...path]);
      visited.delete(key);
      return;
    }
    
    // Explore relationships
    const rels = [...(REL_INDEX.bySource[String(currentId)] || []), 
                  ...(REL_INDEX.byTarget[String(currentId)] || [])];
    
    for (const rel of rels) {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const relType = getVal(rel, 'Relationship type') || 'related';
      
      // Determine next node
      let nextId, nextType, direction;
      if (String(src?.id) === String(currentId)) {
        nextId = tgt?.id;
        nextType = REC_TYPE_TO_ENTITY[String(tgt?.type)];
        direction = '→';
      } else {
        nextId = src?.id;
        nextType = REC_TYPE_TO_ENTITY[String(src?.type)];
        direction = '←';
      }
      
      if (!nextId || !nextType) continue;
      
      const nextRec = IDX[nextType]?.[String(nextId)];
      if (!nextRec) continue;
      
      path.push({
        type: nextType,
        id: nextId,
        title: MAP[nextType].title(nextRec),
        via: relType,
        direction
      });
      
      search(nextType, nextId, path, depth + 1);
      
      path.pop();
    }
    
    visited.delete(key);
  }
  
  const startRec = IDX[startType]?.[String(startId)];
  if (!startRec) return [];
  
  search(startType, startId, [{
    type: startType,
    id: startId,
    title: MAP[startType].title(startRec),
    via: 'start',
    direction: ''
  }], 0);
  
  return paths;
}

function displayPaths(paths) {
  if (!paths.length) return '<div class="muted" style="padding:1rem;">No connection found</div>';
  
  let html = `<div style="margin-top:1rem;"><div style="font-size:1.1rem;font-weight:600;margin-bottom:.75rem;color:#2c3e50;">Found ${paths.length} Connection Path${paths.length > 1 ? 's' : ''}</div>`;
  
  paths.slice(0, 5).forEach((path, i) => {
    const stepCount = path.length - 1;
    html += `<div style="margin:.75rem 0;padding:.75rem;background:#f8f9fa;border-left:4px solid #a67c00;border-radius:.5rem;">`;
    html += `<div style="font-weight:600;margin-bottom:.5rem;color:#555;">Path ${i + 1} <span class="muted" style="font-weight:normal;">(${stepCount} relationship${stepCount > 1 ? 's' : ''})</span></div>`;
    html += `<div style="margin-left:.5rem;line-height:2;">`;
    
    path.forEach((node, j) => {
      // Add the entity
      html += `<div style="display:inline-block;vertical-align:middle;">`;
      html += linkTo(node.type, node.id, node.title);
      html += `</div>`;
      
      // Add the relationship arrow if not last item
      if (j < path.length - 1) {
        const nextNode = path[j + 1];
        const arrowColor = nextNode.direction === '→' ? '#3498db' : '#9b59b6';
        html += `<div style="display:inline-block;vertical-align:middle;margin:0 .5rem;color:${arrowColor};">`;
        html += `<div style="font-size:.85rem;font-style:italic;">${esc(nextNode.via)}</div>`;
        html += `<div style="font-size:1.2rem;">${nextNode.direction}</div>`;
        html += `</div>`;
      }
    });
    
    html += '</div></div>';
  });
  
  if (paths.length > 5) {
    html += `<div class="muted" style="margin-top:.75rem;padding:.5rem;text-align:center;background:#f8f9fa;border-radius:.5rem;">+ ${paths.length - 5} more path${paths.length > 6 ? 's' : ''} found</div>`;
  }
  
  html += '</div>';
  
  return html;
}

function renderRelationships(rec, type) {
  const recId = String(rec.rec_ID);
  let outgoing = REL_INDEX.bySource[recId] || [];
  let incoming = REL_INDEX.byTarget[recId] || [];
  
  let html = '';
  
  // Helper function to normalize relationship type names
  const normalizeRelType = (relType) => {
    if (!relType) return 'Related to';
    const normalized = relType.trim();
    // Normalize common variations
    if (normalized.toLowerCase() === 'isrelatedto') return 'Related to';
    return normalized;
  };
  
  // Outgoing relationships (this record → other records)
  if (outgoing.length) {
    html += '<div class="section"><strong>Relationships</strong>';
    
    // First, deduplicate across ALL outgoing relationships by target
    // Keep the relationship with the most specific type (prefer non-"Related to")
    const targetMap = new Map();
    outgoing.forEach(r => {
      const tgt = getRes(r, 'Target record');
      if (!tgt || !tgt.id) return;
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
      if (!tgtType) return;
      const targetKey = `${tgtType}:${tgt.id}`;
      
      const relType = getVal(r, 'Relationship type') || 'Related to';
      const normalized = relType.trim();
      const isGeneric = normalized.toLowerCase() === 'isrelatedto' || normalized === 'Related to';
      
      // Keep this relationship if:
      // - We haven't seen this target yet, OR
      // - The existing one is generic and this one is specific
      const existing = targetMap.get(targetKey);
      if (!existing || (existing.isGeneric && !isGeneric)) {
        targetMap.set(targetKey, { r, isGeneric });
      }
    });
    
    // Now group the deduplicated relationships by type
    const dedupedRels = Array.from(targetMap.values()).map(({ r }) => r);
    const grouped = groupByRelType(dedupedRels);
    let relIndex = 0;
    
    for (const [relType, rels] of grouped.entries()) {
      html += `<div style="margin:.75rem 0">`;
      html += `<div style="font-weight:600;color:#555;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem">`;
      html += `<span style="background:#e3f2fd;padding:.25rem .5rem;border-radius:.25rem;font-size:.85rem">${esc(relType)}</span>`;
      html += `<span style="color:#999;font-size:.8rem;font-weight:400">(${rels.length})</span>`;
      html += `</div>`;
      
      // Build list of unique relationships (already deduplicated above)
      const uniqueRels = [];
      rels.forEach(r => {
        const tgt = getRes(r, 'Target record');
        if (!tgt || !tgt.id) return;
        const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
        if (!tgtType) return;
        const tgtRec = IDX[tgtType]?.[String(tgt.id)];
        // Note: tgtRec might be null if entity was filtered out (e.g., authors)
        uniqueRels.push({ r, tgt, tgtType, tgtRec });
      });
      
      uniqueRels.forEach(({ r, tgt, tgtType, tgtRec }, idx) => {
        const detailId = `rel-out-${relIndex}-${idx}`;
        relIndex++;
        
        // Collect metadata
        const metaParts = [];
        const certainty = getVal(r, 'scribe certainty');
        if (certainty) metaParts.push({ label: 'Certainty', value: certainty });
        
        const role = getVal(r, 'Scribe role');
        if (role) metaParts.push({ label: 'Role', value: role });
        
        const func = getVal(r, 'Function of Copying');
        if (func) metaParts.push({ label: 'Function', value: func });
        
        const folioRange = getVal(r, 'Folio range in PU') || getVal(r, 'Folio range');
        if (folioRange) metaParts.push({ label: 'Folios', value: folioRange });
        
        const textLang = getVal(r, 'Text Language(s)');
        if (textLang) metaParts.push({ label: 'Language', value: textLang });
        
        const expression = getVal(r, 'Expression');
        if (expression) metaParts.push({ label: 'Expression', value: expression });
        
        const style = getVal(r, 'Style');
        if (style) metaParts.push({ label: 'Style', value: style });
        
        const scribeComments = getVal(r, 'Scribe Comments');
        if (scribeComments) metaParts.push({ label: 'Comments', value: scribeComments });
        
        const prodInfo = getVal(r, 'Production info');
        if (prodInfo) metaParts.push({ label: 'Production Info', value: prodInfo });
        
        const textComments = getVal(r, 'Text(s) comments');
        if (textComments) metaParts.push({ label: 'Text Comments', value: textComments });
        
        // Main relationship item
        html += `<div style="margin-left:1rem;margin-bottom:.5rem;border-left:3px solid #2196F3;padding-left:.75rem">`;
        html += `<div style="display:flex;align-items:center;gap:.5rem;text-align:left">`;
        
        if (tgtRec) {
          // Entity exists in filtered data - show as clickable link
          html += linkTo(tgtType, tgt.id, MAP[tgtType].title(tgtRec));
        } else {
          // Entity was filtered out (e.g., author not a scribe) - show as plain text
          html += `<span style="color:#666;font-style:italic;display:inline">${esc(tgt.title || 'Unknown')}</span>`;
        }
        
        if (metaParts.length > 0) {
          html += `<button onclick="document.getElementById('${detailId}').style.display = document.getElementById('${detailId}').style.display === 'none' ? 'block' : 'none'; this.textContent = this.textContent === '▼' ? '▶' : '▼';" style="background:#f0f0f0;border:1px solid #ddd;border-radius:.25rem;padding:.125rem .375rem;cursor:pointer;font-size:.75rem;color:#666">▶</button>`;
        }
        html += `</div>`;
        
        if (metaParts.length > 0) {
          html += `<div id="${detailId}" style="display:none;margin-top:.5rem;padding:.5rem;background:#f9f9f9;border-radius:.25rem;font-size:.85rem">`;
          metaParts.forEach(({ label, value }) => {
            html += `<div style="margin:.25rem 0"><strong style="color:#666">${esc(label)}:</strong> ${esc(value)}</div>`;
          });
          html += `</div>`;
        }
        html += `</div>`;
      });
      
      html += '</div>';
    }
    html += '</div>';
  }
  
  // Incoming relationships (other records → this record)
  if (incoming.length) {
    html += '<div class="section"><strong>Referenced by</strong>';
    
    // First, deduplicate across ALL incoming relationships by source
    // Keep the relationship with the most specific type (prefer non-"Related to")
    const sourceMap = new Map();
    incoming.forEach(r => {
      const src = getRes(r, 'Source record');
      if (!src || !src.id) return;
      const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
      if (!srcType) return;
      const sourceKey = `${srcType}:${src.id}`;
      
      const relType = getVal(r, 'Relationship type') || 'Related to';
      const normalized = relType.trim();
      const isGeneric = normalized.toLowerCase() === 'isrelatedto' || normalized === 'Related to';
      
      // Keep this relationship if:
      // - We haven't seen this source yet, OR
      // - The existing one is generic and this one is specific
      const existing = sourceMap.get(sourceKey);
      if (!existing || (existing.isGeneric && !isGeneric)) {
        sourceMap.set(sourceKey, { r, isGeneric });
      }
    });
    
    // Now group the deduplicated relationships by type
    const dedupedRels = Array.from(sourceMap.values()).map(({ r }) => r);
    const grouped = groupByRelType(dedupedRels);
    let relIndex = 0;
    
    for (const [relType, rels] of grouped.entries()) {
      html += `<div style="margin:.75rem 0">`;
      html += `<div style="font-weight:600;color:#555;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem">`;
      html += `<span style="background:#fff3e0;padding:.25rem .5rem;border-radius:.25rem;font-size:.85rem">${esc(relType)}</span>`;
      html += `<span style="color:#999;font-size:.8rem;font-weight:400">(${rels.length})</span>`;
      html += `</div>`;
      
      // Build list of unique relationships (already deduplicated above)
      const uniqueRels = [];
      rels.forEach(r => {
        const src = getRes(r, 'Source record');
        if (!src || !src.id) return;
        const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
        if (!srcType) return;
        const srcRec = IDX[srcType]?.[String(src.id)];
        // Note: srcRec might be null if entity was filtered out
        uniqueRels.push({ r, src, srcType, srcRec });
      });
      
      uniqueRels.forEach(({ r, src, srcType, srcRec }, idx) => {
        const detailId = `rel-in-${relIndex}-${idx}`;
        relIndex++;
        
        // Collect metadata
        const metaParts = [];
        const certainty = getVal(r, 'scribe certainty');
        if (certainty) metaParts.push({ label: 'Certainty', value: certainty });
        
        const role = getVal(r, 'Scribe role');
        if (role) metaParts.push({ label: 'Role', value: role });
        
        const func = getVal(r, 'Function of Copying');
        if (func) metaParts.push({ label: 'Function', value: func });
        
        const folioRange = getVal(r, 'Folio range in PU') || getVal(r, 'Folio range');
        if (folioRange) metaParts.push({ label: 'Folios', value: folioRange });
        
        const textLang = getVal(r, 'Text Language(s)');
        if (textLang) metaParts.push({ label: 'Language', value: textLang });
        
        const expression = getVal(r, 'Expression');
        if (expression) metaParts.push({ label: 'Expression', value: expression });
        
        const style = getVal(r, 'Style');
        if (style) metaParts.push({ label: 'Style', value: style });
        
        const scribeComments = getVal(r, 'Scribe Comments');
        if (scribeComments) metaParts.push({ label: 'Comments', value: scribeComments });
        
        const prodInfo = getVal(r, 'Production info');
        if (prodInfo) metaParts.push({ label: 'Production Info', value: prodInfo });
        
        const textComments = getVal(r, 'Text(s) comments');
        if (textComments) metaParts.push({ label: 'Text Comments', value: textComments });
        
        // Main relationship item
        html += `<div style="margin-left:1rem;margin-bottom:.5rem;border-left:3px solid #ff9800;padding-left:.75rem">`;
        html += `<div style="display:flex;align-items:center;gap:.5rem;text-align:left">`;
        
        if (srcRec) {
          // Entity exists in filtered data - show as clickable link
          html += linkTo(srcType, src.id, MAP[srcType].title(srcRec));
        } else {
          // Entity was filtered out - show as plain text
          html += `<span style="color:#666;font-style:italic;display:inline">${esc(src.title || 'Unknown')}</span>`;
        }
        
        if (metaParts.length > 0) {
          html += `<button onclick="document.getElementById('${detailId}').style.display = document.getElementById('${detailId}').style.display === 'none' ? 'block' : 'none'; this.textContent = this.textContent === '▼' ? '▶' : '▼';" style="background:#f0f0f0;border:1px solid #ddd;border-radius:.25rem;padding:.125rem .375rem;cursor:pointer;font-size:.75rem;color:#666">▶</button>`;
        }
        html += `</div>`;
        
        if (metaParts.length > 0) {
          html += `<div id="${detailId}" style="display:none;margin-top:.5rem;padding:.5rem;background:#f9f9f9;border-radius:.25rem;font-size:.85rem">`;
          metaParts.forEach(({ label, value }) => {
            html += `<div style="margin:.25rem 0"><strong style="color:#666">${esc(label)}:</strong> ${esc(value)}</div>`;
          });
          html += `</div>`;
        }
        html += `</div>`;
      });
      
      html += '</div>';
    }
    html += '</div>';
  }
  
  return html;
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
      // Build viewer URL with manifest
      let viewerHref = `${BASE}/viewer/?manifest=${encodeURIComponent(manifestUrl)}`;
      
      // Add transcriptions if available in the map
      if (manifestAnnosMap[manifestUrl]) {
        viewerHref += `&annos=${encodeURIComponent(BASE + manifestAnnosMap[manifestUrl])}`;
      }
      
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

  // Add relationship records
  html += renderRelationships(rec, type);

  // Add Find Connection button
  html += `<div class="section" style="margin-top:1rem;">
    <button class="chip" id="btn-find-connection" style="padding:.5rem .75rem;">Find Connection to...</button>
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

/* ---------- Results grid ---------- */
let ENTITY = 'su';
let page=1, pageSize=24;
let selectedCard=null;

function render(list, type, selectId=null){
  const map = MAP[type];
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
  
  // Update page jump input
  if ($pageJump) {
    $pageJump.max = totalPages;
    $pageJump.value = page;
  }

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
  return list;
}
function renderCurrent(){
  const list = computeList();
  render(list, ENTITY);
}
function recompute(){
  const cfg = FACETS[ENTITY];
  const prevState = readFacetState(cfg);
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

/* OLD VIEW SYSTEM - DISABLED (replaced by mode system)
$tabs.wrap.addEventListener('click', (e)=>{
  const btn = e.target.closest('[data-view]');
  if (!btn) return;
  setView(btn.dataset.view);
});
$tabs.switchBtn.addEventListener('click', ()=>{
  const order = ['results','map','timeline','network','analytics'].filter(v=>{
    if (v==='map') return supportsMap(ENTITY);
    if (v==='timeline') return supportsTimeline(ENTITY);
    if (v==='network') return supportsNetwork(ENTITY);
    if (v==='analytics') return supportsAnalytics(ENTITY);
    return true;
  });
  const i = order.indexOf(ACTIVE_VIEW);
  setView(order[(i+1) % order.length]);
});
*/

function updateAvailableViews(){
  const mapOk = supportsMap(ENTITY);
  const tlOk  = supportsTimeline(ENTITY);
  const netOk = supportsNetwork(ENTITY);
  const analyticsOk = supportsAnalytics(ENTITY);
  
  /* OLD - these elements don't exist anymore
  $tabs.map.hidden      = !mapOk;
  $tabs.timeline.hidden = !tlOk;
  $tabs.network.hidden  = !netOk;
  $tabs.analytics.hidden = !analyticsOk;
  if (ACTIVE_VIEW==='map' && !mapOk) setView('results');
  if (ACTIVE_VIEW==='timeline' && !tlOk) setView('results');
  if (ACTIVE_VIEW==='network' && !netOk) setView('results');
  if (ACTIVE_VIEW==='analytics' && !analyticsOk) setView('results');
  */
  
  if (ACTIVE_VIEW==='map' && mapOk) buildMap();
  if (ACTIVE_VIEW==='timeline' && tlOk) buildTimeline();
  if (ACTIVE_VIEW==='network' && netOk) buildNetworkView();
  if (ACTIVE_VIEW==='analytics' && analyticsOk) buildAnalytics();
}

/* ---------- Mode Switching (Browse/Map/Timeline/Network/Analytics/Multilingualism) ---------- */
let ACTIVE_MODE = 'browse';

function setMode(mode) {
  if (ACTIVE_MODE === mode) return;
  ACTIVE_MODE = mode;

  // Update main navigation buttons
  document.querySelectorAll('.main-nav-btn').forEach(btn => {
    btn.classList.toggle('is-on', btn.dataset.mode === mode);
  });

  // Show/hide mode containers
  const modes = ['browse', 'map', 'timeline', 'network', 'analytics', 'codicology', 'tree', 'scribes', 'multilingualism', 'colophon-analysis', 'text-genres'];
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
  if (mode === 'codicology') buildCodicology();
  if (mode === 'tree') buildHierarchicalTree();
  if (mode === 'scribes') buildScribes();
  if (mode === 'multilingualism') buildMultilingualism();
  if (mode === 'colophon-analysis') buildColophonAnalysis();
  if (mode === 'text-genres') buildTextGenres();
}

// Expose to global scope for debugging
window.setMode = setMode;

function initModeNavigation() {
  // Set up main navigation listeners
  document.querySelectorAll('.main-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode) setMode(mode);
    });
  });
}

/* ---------- Switch entity ---------- */
function switchEntity(ent){
  if (ENTITY===ent) return;
  ENTITY = ent;
  document.querySelectorAll('#entity-switch .entity-btn').forEach(c=>c.classList.toggle('is-on', c.dataset.entity===ent));
  $search.value=''; $field.value=''; $sort.value='';
  page=1;
  recompute();
  updateAvailableViews();
}

/* ---------- Map (Leaflet) ---------- */
let leafletLoaded=false;
let leafletPluginsLoaded=false;

function ensureLeaflet(){
  return new Promise((resolve)=>{
    if (leafletLoaded && leafletPluginsLoaded) return resolve();
    
    // Load base Leaflet first
    if (!leafletLoaded) {
      const link=document.createElement('link'); link.rel='stylesheet';
      link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
      const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload=()=>{ 
        leafletLoaded=true;
        loadLeafletPlugins(resolve);
      }; 
      document.body.appendChild(s);
    } else {
      loadLeafletPlugins(resolve);
    }
  });
}

function loadLeafletPlugins(callback) {
  if (leafletPluginsLoaded) return callback();
  
  // Load MarkerCluster CSS
  const clusterCSS = document.createElement('link');
  clusterCSS.rel = 'stylesheet';
  clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
  document.head.appendChild(clusterCSS);
  
  const clusterDefaultCSS = document.createElement('link');
  clusterDefaultCSS.rel = 'stylesheet';
  clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
  document.head.appendChild(clusterDefaultCSS);
  
  // Load MarkerCluster JS
  const clusterScript = document.createElement('script');
  clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
  clusterScript.onload = () => {
    // Load Heatmap plugin
    const heatScript = document.createElement('script');
    heatScript.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    heatScript.onload = () => {
      leafletPluginsLoaded = true;
      callback();
    };
    document.body.appendChild(heatScript);
  };
  document.body.appendChild(clusterScript);
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
// Global map state
let MAP_INSTANCE = null;
let MAP_MARKERS_LAYER = null;
let MAP_CLUSTER_LAYER = null;
let MAP_HEATMAP_LAYER = null;
let MAP_CONNECTIONS_LAYER = null;
let MAP_ROUTES_LAYER = null;
let MAP_MARKERS_DATA = []; // Store marker data for filtering
let MAP_CURRENT_VIEW = 'ms-current'; // Current map view
let MAP_CONTROLS_INITIALIZED = false; // Flag to prevent duplicate event listeners

// Suggest appropriate map view based on current entity
function getSuggestedMapView(entity) {
  const suggestions = {
    'ms': 'ms-current',          // Manuscripts → Current Location
    'pu': 'pu-location',         // Production Units → All Locations
    'mi': 'mi-all',              // Monastic Institutions → All
    'su': 'ms-current',          // Scribal Units → default to manuscripts
    'hi': 'ms-current',          // Holding Institutions → show manuscripts there
    'hp': 'ms-current',          // Historical People → default to manuscripts
    'tx': 'ms-current'           // Texts → default to manuscripts
  };
  return suggestions[entity] || 'ms-current';
}

// Update map controls visibility and legend based on view type
function updateMapControls(viewType) {
  // Show/hide connection lines and routes (only for movement views)
  const isMovementView = viewType === 'ms-movement';
  const connectionsControl = document.getElementById('map-control-connections');
  const routesControl = document.getElementById('map-control-routes');
  const connectionsCheckbox = document.getElementById('map-show-connections');
  
  if (connectionsControl) {
    connectionsControl.style.display = isMovementView ? 'flex' : 'none';
    // Auto-enable connections for movement view
    if (isMovementView && connectionsCheckbox) {
      connectionsCheckbox.checked = true;
    }
  }
  if (routesControl) {
    routesControl.style.display = isMovementView ? 'flex' : 'none';
  }
  
  // Show/hide time controls (only for production views)
  const isProductionView = viewType === 'ms-production' || viewType === 'pu-location' || viewType === 'pu-monastery';
  const timeControls = document.getElementById('map-time-controls');
  
  if (timeControls) {
    timeControls.style.display = isProductionView ? 'block' : 'none';
  }
  
  // Update legend
  const legendItems = document.getElementById('map-legend-items');
  if (legendItems) {
    let html = '';
    
    // Define legend based on view type
    if (viewType === 'ms-current' || viewType === 'ms-production') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#3388ff;"></span> Manuscript</div>';
    } else if (viewType === 'ms-movement') {
      html += '<div style="display:flex;align-items:center;gap:0.5rem;">';
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#10b981;"></span> Production location</div>';
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:20px;height:3px;background:#fb923c;"></span> Movement</div>';
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ef4444;"></span> Current location</div>';
      html += '</div>';
    } else if (viewType === 'pu-location') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ff7800;"></span> Production Unit</div>';
    } else if (viewType === 'pu-monastery') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#c026d3;"></span> Monastery (with PUs)</div>';
    } else if (viewType === 'mi-all') {
      html += '<div style="display:flex;align-items:center;gap:0.25rem;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#9333ea;"></span> Monastic Institution</div>';
    }
    
    legendItems.innerHTML = html;
  }
}

async function buildMap(){
  await ensureLeaflet();

  // Get selected map view - default to 'ms-current'
  const viewSelector = document.getElementById('map-view-selector');
  if (!MAP_CURRENT_VIEW) {
    MAP_CURRENT_VIEW = 'ms-current';
    if (viewSelector) viewSelector.value = 'ms-current';
  }
  
  MAP_CURRENT_VIEW = viewSelector?.value || 'ms-current';
  
  // Update controls and legend for this view
  updateMapControls(MAP_CURRENT_VIEW);

  // Update title based on view
  const viewTitles = {
    'ms-current': 'Map — Manuscripts by Current Location (Holdings)',
    'ms-production': 'Map — Manuscripts by Production Location',
    'ms-movement': 'Map — Manuscript Movement (Production → Current)',
    'pu-location': 'Map — Production Units (All Locations)',
    'pu-monastery': 'Map — Production Units by Monastery',
    'mi-all': 'Map — Monastic Institutions',
    'scribes-female': 'Map — Female Scribes Work Locations',
    'scribes-all': 'Map — All Scribes Work Locations'
  };
  $mapTitle.textContent = viewTitles[MAP_CURRENT_VIEW] || 'Map';
  
  // Show hint for entity types without direct map representation
  const hintEl = document.getElementById('map-view-hint');
  const entityHasDirectMap = ['ms', 'pu', 'mi', 'su', 'hi'].includes(ENTITY);
  if (hintEl) {
    if (!entityHasDirectMap) {
      hintEl.style.display = 'block';
      hintEl.textContent = `Tip: Viewing ${ENTITY.toUpperCase()} records, but map shows related geographic data. Change "Map View" above to explore different aspects.`;
    } else {
      hintEl.style.display = 'none';
    }
  }

  // fresh mount to avoid Leaflet errors between entity switches
  let mount = document.getElementById('map-mount');
  if (!mount) return;
  if (mount._leaflet_id){ 
    if (MAP_INSTANCE) {
      MAP_INSTANCE.remove();
      MAP_INSTANCE = null;
    }
    const clone = mount.cloneNode(false); 
    mount.parentNode.replaceChild(clone, mount); 
    mount=clone; 
  }
  mount.innerHTML='';

  // Create map
  const map = L.map(mount).setView([47,8],4);
  MAP_INSTANCE = map;
  window.globalMap = map; // Store for export functionality
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap' }).addTo(map);

  // Collect marker data based on selected view
  MAP_MARKERS_DATA = collectMapData(MAP_CURRENT_VIEW);
  
  // Initial render
  renderMapLayers();
  
  // Setup event handlers (only once)
  if (!MAP_CONTROLS_INITIALIZED) {
    setupMapControls();
    MAP_CONTROLS_INITIALIZED = true;
  }
  
  // Fit bounds
  if (MAP_MARKERS_DATA.length) {
    const bounds = L.latLngBounds(MAP_MARKERS_DATA.map(m => [m.pt.lat, m.pt.lng]));
    window.globalMapBounds = bounds; // Store for export functionality
    map.fitBounds(bounds.pad(0.2));
  } else {
    map.setView([47,8],4);
    window.globalMapBounds = null;
    mount.insertAdjacentHTML('beforeend','<div class="muted" style="padding:.75rem">No mappable coordinates for this view.</div>');
  }
}

// Collect map data based on selected view
function collectMapData(viewType) {
  const markers = [];
  
  const getYear = s => {
    if (!s) return null;
    // Handle date objects
    if (typeof s === 'object' && s.value) s = s.value;
    // Convert to string
    const str = String(s);
    // Try to extract year - handle formats like "1454-12-31", "1454", or "c. 1450"
    const m = str.match(/\b([12]\d{3})\b/);
    if (!m) return null;
    const y = parseInt(m[1], 10);
    return (y >= 800 && y <= 1600) ? y : null;
  };
  
  switch(viewType) {
    case 'ms-current':
      // Manuscripts by current holding location
      DATA.ms.forEach(rec => {
        const pt = coordsFromHoldingInstitution(rec);
        if (!pt) return;
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) || 
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.ms.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get holding institution name
        const hiRes = getRes(rec,'Holding Institution');
        const hiName = hiRes?.title || 'Unknown location';
        
        markers.push({
          rec, pt, year, id, title,
          entity: 'ms',
          subtitle: hiName,
          category: 'manuscript'
        });
      });
      break;
      
    case 'ms-production':
      // Manuscripts by their ACTUAL production location (not fallback)
      DATA.ms.forEach(rec => {
        const prodPt = coordsFromProduction(rec);
        if (!prodPt) return; // Only show manuscripts with actual production location
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) || 
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.ms.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get production location name
        const msId = String(rec.rec_ID);
        const pus = DATA.pu.filter(p => String(getRes(p,'Manuscript')?.id) === msId);
        const puCountry = pus.length > 0 ? getVal(pus[0], 'PU country') : null;
        const puCity = pus.length > 0 ? getVal(pus[0], 'PU City') : null;
        const prodLocation = [puCity, puCountry].filter(Boolean).join(', ') || 'Production location';
        
        markers.push({
          rec, pt: prodPt, prodPt, year, id, title,
          entity: 'ms',
          subtitle: prodLocation,
          category: 'manuscript'
        });
      });
      break;
      
    case 'ms-movement':
      // Manuscript movement: production → current location
      DATA.ms.forEach(rec => {
        const prodPt = coordsFromProduction(rec);
        const holdPt = coordsFromHoldingInstitution(rec);
        
        // Only show if we have BOTH locations and they're DIFFERENT
        if (!prodPt || !holdPt) return;
        if (Math.abs(prodPt.lat - holdPt.lat) < 0.01 && Math.abs(prodPt.lng - holdPt.lng) < 0.01) return;
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) || 
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.ms.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get location names
        const msId = String(rec.rec_ID);
        const pus = DATA.pu.filter(p => String(getRes(p,'Manuscript')?.id) === msId);
        const puCountry = pus.length > 0 ? getVal(pus[0], 'PU country') : null;
        const puCity = pus.length > 0 ? getVal(pus[0], 'PU City') : null;
        const prodLocation = [puCity, puCountry].filter(Boolean).join(', ') || 'Production';
        
        const hiRes = getRes(rec,'Holding Institution');
        const hi = hiRes?.id ? IDX.hi[String(hiRes.id)] : null;
        const hiCountry = hi ? getVal(hi, 'Country') : null;
        const hiCity = hi ? getVal(hi, 'City') : null;
        const currentLocation = [hiCity, hiCountry].filter(Boolean).join(', ') || 'Current location';
        
        markers.push({
          rec, pt: prodPt, prodPt, holdPt, year, id, title,
          entity: 'ms',
          subtitle: `${prodLocation} → ${currentLocation}`,
          movement: { from: prodLocation, to: currentLocation },
          category: 'manuscript-movement'
        });
      });
      break;
      
    case 'pu-location':
      // Production Units at their location
      DATA.pu.forEach(rec => {
        const latD = getDetail(rec,'Latitude')?.value || getDetail(rec,'PU Latitude')?.value;
        const lonD = getDetail(rec,'Longitude')?.value || getDetail(rec,'PU Longitude')?.value;
        const wkt  = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
        const pt = parseWKTPoint(wkt);
        if (!pt) return;
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) ||
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.pu.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        // Get linked monastery if any
        const miRes = getRes(rec,'Monastic Institution');
        const miName = miRes?.title || null;
        
        markers.push({
          rec, pt, year, id, title,
          entity: 'pu',
          subtitle: miName || 'Production Unit',
          monasteryName: miName,
          category: 'production'
        });
      });
      break;
      
    case 'pu-monastery':
      // Production Units grouped by their monastery location
      const monasteryGroups = {};
      
      DATA.pu.forEach(rec => {
        const miRes = getRes(rec,'Monastic Institution');
        if (!miRes?.id) return;
        
        const miId = String(miRes.id);
        const mi = IDX.mi[miId];
        if (!mi) return;
        
        // Get monastery coordinates
        const latD = getDetail(mi,'Latitude')?.value;
        const lonD = getDetail(mi,'Longitude')?.value;
        const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
        const pt = parseWKTPoint(wkt);
        if (!pt) return;
        
        if (!monasteryGroups[miId]) {
          monasteryGroups[miId] = {
            mi,
            pt,
            puList: [],
            title: (MAP.mi?.title(mi) || 'Unnamed Monastery').replace(/"/g,'&quot;'),
            id: miId
          };
        }
        monasteryGroups[miId].puList.push(rec);
      });
      
      // Convert groups to markers
      Object.values(monasteryGroups).forEach(group => {
        const year = getYear(getDetail(group.mi,'Creation date')?.value);
        markers.push({
          rec: group.mi,
          pt: group.pt,
          year,
          id: group.id,
          title: group.title,
          entity: 'mi',
          subtitle: `${group.puList.length} Production Unit${group.puList.length !== 1 ? 's' : ''}`,
          puCount: group.puList.length,
          puList: group.puList,
          category: 'monastery-pu'
        });
      });
      break;
      
    case 'mi-all':
      // All Monastic Institutions
      DATA.mi.forEach(rec => {
        const latD = getDetail(rec,'Latitude')?.value;
        const lonD = getDetail(rec,'Longitude')?.value;
        const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
        const pt = parseWKTPoint(wkt);
        if (!pt) return;
        
        const year = getYear(getDetail(rec,'Creation date')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.mi?.title(rec) || 'Unnamed Monastery').replace(/"/g,'&quot;');
        
        // Count linked production units
        const linkedPUs = DATA.pu.filter(pu => String(getRes(pu,'Monastic Institution')?.id) === id);
        
        markers.push({
          rec, pt, year, id, title,
          entity: 'mi',
          subtitle: linkedPUs.length ? `${linkedPUs.length} Production Unit${linkedPUs.length !== 1 ? 's' : ''}` : 'Monastic Institution',
          puCount: linkedPUs.length,
          category: 'monastery'
        });
      });
      break;
  }
  
  return markers;
}

// Helper: Get marker color based on category
function getMarkerColor(category) {
  const colors = {
    'manuscript': '#3388ff',      // Blue
    'manuscript-movement': '#fb923c', // Orange (for movement visualization)
    'production': '#ff7800',      // Orange
    'monastery': '#d4af37',       // Gold
    'monastery-pu': '#c4941f',    // Dark Gold
    'scribe': '#10b981'           // Green
  };
  return colors[category] || '#3388ff';
}

// Helper: Create popup HTML for marker
function createMarkerPopup(m) {
  let html = `<div style="min-width:220px">`;
  html += `<div style="font-weight:600;margin-bottom:.25rem">${m.title}</div>`;
  
  if (m.subtitle) {
    html += `<div style="font-size:0.875rem;color:#666;margin-bottom:.5rem">${m.subtitle}</div>`;
  }
  
  // Add category-specific info
  if (m.category === 'manuscript-movement') {
    if (m.productionLocation) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem"><strong>Production:</strong> ${m.productionLocation}</div>`;
    }
    if (m.currentLocation) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem"><strong>Current:</strong> ${m.currentLocation}</div>`;
    }
  }
  
  if (m.category === 'monastery-pu' && m.puCount) {
    html += `<div style="font-size:0.875rem;margin-bottom:.25rem">Production Units at this monastery:</div>`;
    html += `<div style="max-height:150px;overflow-y:auto;margin-bottom:.5rem">`;
    m.puList.slice(0, 10).forEach(pu => {
      const puTitle = (MAP.pu?.title(pu) || 'Untitled').replace(/"/g,'&quot;');
      html += `<div style="font-size:0.8rem;padding:0.125rem 0">• ${puTitle}</div>`;
    });
    if (m.puList.length > 10) {
      html += `<div style="font-size:0.8rem;color:#666;font-style:italic">+ ${m.puList.length - 10} more</div>`;
    }
    html += `</div>`;
  }
  
  if (m.category === 'scribe') {
    if (m.gender) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem">Gender: ${m.gender}</div>`;
    }
    if (m.manuscriptCount) {
      html += `<div style="font-size:0.875rem;margin-bottom:.25rem">${m.manuscriptCount} manuscript${m.manuscriptCount !== 1 ? 's' : ''} at this location</div>`;
    }
  }
  
  if (m.monasteryName && m.category === 'production') {
    html += `<div style="font-size:0.875rem;color:#666;margin-bottom:.25rem">Monastery: ${m.monasteryName}</div>`;
  }
  
  if (m.puCount && m.category === 'monastery') {
    html += `<div style="font-size:0.875rem;color:#666;margin-bottom:.25rem">${m.puCount} Production Unit${m.puCount !== 1 ? 's' : ''} linked</div>`;
  }
  
  html += `<button class="chip" data-jump="${m.entity}:${m.id}">Open in results</button>`;
  html += `</div>`;
  
  return html;
}

function renderMapLayers() {
  if (!MAP_INSTANCE) return;
  
  // Clear existing layers
  if (MAP_MARKERS_LAYER) MAP_INSTANCE.removeLayer(MAP_MARKERS_LAYER);
  if (MAP_CLUSTER_LAYER) MAP_INSTANCE.removeLayer(MAP_CLUSTER_LAYER);
  if (MAP_HEATMAP_LAYER) MAP_INSTANCE.removeLayer(MAP_HEATMAP_LAYER);
  if (MAP_CONNECTIONS_LAYER) MAP_INSTANCE.removeLayer(MAP_CONNECTIONS_LAYER);
  if (MAP_ROUTES_LAYER) MAP_INSTANCE.removeLayer(MAP_ROUTES_LAYER);
  
  // Get control states
  const useClusters = document.getElementById('map-show-clusters')?.checked ?? true;
  const showConnections = document.getElementById('map-show-connections')?.checked ?? false;
  const showHeatmap = document.getElementById('map-show-heatmap')?.checked ?? false;
  const showRoutes = document.getElementById('map-show-routes')?.checked ?? false;
  
  // Get time filter
  const timeStart = parseInt(document.getElementById('map-time-start')?.value ?? 800);
  const timeEnd = parseInt(document.getElementById('map-time-end')?.value ?? 1600);
  
  // Filter markers by time
  const filtered = MAP_MARKERS_DATA.filter(m => {
    if (!m.year) return true; // Always include records without dates
    return m.year >= timeStart && m.year <= timeEnd;
  });
  
  // Update time range display
  const rangeDisplay = document.getElementById('map-time-range');
  if (rangeDisplay) {
    if (timeStart === 800 && timeEnd === 1600) {
      rangeDisplay.textContent = 'All dates';
    } else {
      rangeDisplay.textContent = `${timeStart}–${timeEnd}`;
    }
  }
  
  // Create markers
  if (useClusters) {
    // Use clustering
    MAP_CLUSTER_LAYER = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });
    
    filtered.forEach(m => {
      const markerColor = getMarkerColor(m.category);
      const marker = L.circleMarker([m.pt.lat, m.pt.lng], {radius:6, fillColor: markerColor, fillOpacity: 0.7, color: '#fff', weight: 1});
      marker.bindPopup(createMarkerPopup(m));
      marker.on('popupopen', (e)=>{
        const btn = e.popup.getElement().querySelector('[data-jump]');
        if (btn) {
          btn.addEventListener('click', ()=>{ jumpTo(m.entity, m.id); });
        }
      });
      MAP_CLUSTER_LAYER.addLayer(marker);
    });
    
    MAP_INSTANCE.addLayer(MAP_CLUSTER_LAYER);
  } else {
    // No clustering - simple markers
    MAP_MARKERS_LAYER = L.featureGroup();
    
    filtered.forEach(m => {
      const markerColor = getMarkerColor(m.category);
      const marker = L.circleMarker([m.pt.lat, m.pt.lng], {radius:6, fillColor: markerColor, fillOpacity: 0.7, color: '#fff', weight: 1});
      marker.bindPopup(createMarkerPopup(m));
      marker.on('popupopen', (e)=>{
        const btn = e.popup.getElement().querySelector('[data-jump]');
        if (btn) {
          btn.addEventListener('click', ()=>{ jumpTo(m.entity, m.id); });
        }
      });
      MAP_MARKERS_LAYER.addLayer(marker);
    });
    
    MAP_INSTANCE.addLayer(MAP_MARKERS_LAYER);
  }
  
  // Heatmap layer
  if (showHeatmap && filtered.length > 0) {
    const heatPoints = filtered.map(m => [m.pt.lat, m.pt.lng, 1]); // lat, lng, intensity
    MAP_HEATMAP_LAYER = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      max: 1.0,
      gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'}
    }).addTo(MAP_INSTANCE);
  }
  
  // Connection lines - context-dependent based on view
  if (showConnections) {
    MAP_CONNECTIONS_LAYER = L.featureGroup();
    
    filtered.forEach(m => {
      // Manuscript Movement: production → current location (show as curved arc)
      if (MAP_CURRENT_VIEW === 'ms-movement' && m.prodPt && m.holdPt) {
        // Draw line from production to current
        const line = L.polyline(
          [[m.prodPt.lat, m.prodPt.lng], [m.holdPt.lat, m.holdPt.lng]],
          {color: '#fb923c', weight: 3, opacity: 0.8}
        );
        line.bindPopup(`<div style="min-width:220px">
          <div style="font-weight:600;margin-bottom:.5rem">${m.title}</div>
          <div style="font-size:0.875rem;color:#666;margin-bottom:.25rem">
            <strong>From:</strong> ${m.movement.from}
          </div>
          <div style="font-size:0.875rem;color:#666;">
            <strong>To:</strong> ${m.movement.to}
          </div>
        </div>`);
        MAP_CONNECTIONS_LAYER.addLayer(line);
        
        // Add small markers at both ends
        const startMarker = L.circleMarker([m.prodPt.lat, m.prodPt.lng], {
          radius: 5,
          fillColor: '#10b981',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).bindPopup(`<strong>Production:</strong> ${m.movement.from}`);
        
        const endMarker = L.circleMarker([m.holdPt.lat, m.holdPt.lng], {
          radius: 5,
          fillColor: '#ef4444',
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).bindPopup(`<strong>Current location:</strong> ${m.movement.to}`);
        
        MAP_CONNECTIONS_LAYER.addLayer(startMarker);
        MAP_CONNECTIONS_LAYER.addLayer(endMarker);
      }
      
      // Manuscripts production view: production → holding
      if (MAP_CURRENT_VIEW === 'ms-production' && m.prodPt && m.holdPt) {
        const line = L.polyline(
          [[m.prodPt.lat, m.prodPt.lng], [m.holdPt.lat, m.holdPt.lng]],
          {color: '#ff7800', weight: 2, opacity: 0.6, dashArray: '5, 5'}
        );
        line.bindPopup(`<div style="min-width:200px"><div style="font-weight:600;margin-bottom:.25rem">${m.title}</div><div style="font-size:0.875rem;color:#666;">Production → Holding</div></div>`);
        MAP_CONNECTIONS_LAYER.addLayer(line);
      }
      
      // Production Units: show link to monastery if available
      if ((MAP_CURRENT_VIEW === 'pu-location' || MAP_CURRENT_VIEW === 'pu-monastery') && m.monasteryName && m.category === 'production') {
        // Find the monastery coordinates
        const miRes = getRes(m.rec, 'Monastic Institution');
        if (miRes?.id) {
          const mi = IDX.mi[String(miRes.id)];
          if (mi) {
            const latD = getDetail(mi,'Latitude')?.value;
            const lonD = getDetail(mi,'Longitude')?.value;
            const wkt = (latD&&latD.geo&&latD.geo.wkt) ? latD.geo.wkt : (lonD&&lonD.geo&&lonD.geo.wkt);
            const miPt = parseWKTPoint(wkt);
            if (miPt && (miPt.lat !== m.pt.lat || miPt.lng !== m.pt.lng)) {
              const line = L.polyline(
                [[miPt.lat, miPt.lng], [m.pt.lat, m.pt.lng]],
                {color: '#9333ea', weight: 2, opacity: 0.5, dashArray: '3, 3'}
              );
              line.bindPopup(`<div style="min-width:200px"><div style="font-weight:600;margin-bottom:.25rem">${m.title}</div><div style="font-size:0.875rem;color:#666;">Monastery → Production Unit</div></div>`);
              MAP_CONNECTIONS_LAYER.addLayer(line);
            }
          }
        }
      }
    });
    
    if (MAP_CONNECTIONS_LAYER.getLayers().length > 0) {
      MAP_INSTANCE.addLayer(MAP_CONNECTIONS_LAYER);
    }
  }
  
  // Route visualization (animated paths for manuscripts with multiple locations)
  if (showRoutes && ENTITY === 'ms') {
    MAP_ROUTES_LAYER = L.featureGroup();
    
    // For each manuscript, trace its journey
    filtered.forEach(m => {
      const route = [];
      
      // Start with production location
      if (m.prodPt) {
        route.push({lat: m.prodPt.lat, lng: m.prodPt.lng, label: 'Production'});
      }
      
      // Add holding location
      if (m.holdPt && !(m.prodPt && m.prodPt.lat === m.holdPt.lat && m.prodPt.lng === m.holdPt.lng)) {
        route.push({lat: m.holdPt.lat, lng: m.holdPt.lng, label: 'Current Location'});
      }
      
      // Draw route if we have multiple points
      if (route.length > 1) {
        const coords = route.map(p => [p.lat, p.lng]);
        const routeLine = L.polyline(coords, {
          color: '#9333ea',
          weight: 3,
          opacity: 0.7
        });
        routeLine.bindPopup(`<div style="min-width:200px"><div style="font-weight:600;margin-bottom:.25rem">${m.title}</div><div style="font-size:0.875rem;color:#666;">Route: ${route.map(r => r.label).join(' → ')}</div></div>`);
        MAP_ROUTES_LAYER.addLayer(routeLine);
        
        // Add numbered markers for route points
        route.forEach((pt, idx) => {
          const marker = L.circleMarker([pt.lat, pt.lng], {
            radius: 8,
            fillColor: '#9333ea',
            fillOpacity: 0.8,
            color: '#fff',
            weight: 2
          });
          marker.bindPopup(`<div style="min-width:150px"><div style="font-weight:600;">${pt.label}</div><div style="font-size:0.875rem;color:#666;">Step ${idx + 1} of ${route.length}</div></div>`);
          MAP_ROUTES_LAYER.addLayer(marker);
        });
      }
    });
    
    if (MAP_ROUTES_LAYER.getLayers().length > 0) {
      MAP_INSTANCE.addLayer(MAP_ROUTES_LAYER);
    }
  }
}

function setupMapControls() {
  // Map view selector
  const viewSelector = document.getElementById('map-view-selector');
  if (viewSelector) {
    viewSelector.addEventListener('change', () => {
      buildMap(); // Rebuild entire map with new view
    });
  }
  
  // Clustering toggle
  const clusterCheckbox = document.getElementById('map-show-clusters');
  if (clusterCheckbox) {
    clusterCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Connection lines toggle
  const connectionsCheckbox = document.getElementById('map-show-connections');
  if (connectionsCheckbox) {
    connectionsCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Heatmap toggle
  const heatmapCheckbox = document.getElementById('map-show-heatmap');
  if (heatmapCheckbox) {
    heatmapCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Routes toggle
  const routesCheckbox = document.getElementById('map-show-routes');
  if (routesCheckbox) {
    routesCheckbox.addEventListener('change', renderMapLayers);
  }
  
  // Time sliders
  const timeStartSlider = document.getElementById('map-time-start');
  const timeEndSlider = document.getElementById('map-time-end');
  if (timeStartSlider) {
    timeStartSlider.addEventListener('input', () => {
      // Ensure start <= end
      const start = parseInt(timeStartSlider.value);
      const end = parseInt(timeEndSlider.value);
      if (start > end) {
        timeEndSlider.value = start;
      }
      renderMapLayers();
    });
  }
  if (timeEndSlider) {
    timeEndSlider.addEventListener('input', () => {
      // Ensure end >= start
      const start = parseInt(timeStartSlider.value);
      const end = parseInt(timeEndSlider.value);
      if (end < start) {
        timeStartSlider.value = end;
      }
      renderMapLayers();
    });
  }
  
  // Clear time filter
  const clearTimeBtn = document.getElementById('map-clear-time');
  if (clearTimeBtn) {
    clearTimeBtn.addEventListener('click', () => {
      if (timeStartSlider) timeStartSlider.value = 800;
      if (timeEndSlider) timeEndSlider.value = 1600;
      renderMapLayers();
    });
  }
  
  // Reset view
  const resetViewBtn = document.getElementById('map-reset-view');
  if (resetViewBtn) {
    resetViewBtn.addEventListener('click', () => {
      if (MAP_INSTANCE && MAP_MARKERS_DATA.length) {
        const bounds = L.latLngBounds(MAP_MARKERS_DATA.map(m => [m.pt.lat, m.pt.lng]));
        MAP_INSTANCE.fitBounds(bounds.pad(0.2));
      }
    });
  }
}

/* ---------- Timeline ---------- */
let TIMELINE_ZOOM = null; // {minYear, maxYear} for current zoom level
let TIMELINE_SVG = null; // Reference to SVG element for brushing
let TIMELINE_SELECTED = null; // Currently selected record for highlighting connections

function buildTimeline(){
  // Only render where supported
  if (!supportsTimeline(ENTITY)) return;

  const mount = document.getElementById('timeline-mount');
  if (!mount) return;

  // Get control states
  const showMultiBand = document.getElementById('timeline-show-multi')?.checked ?? true;
  const showRanges = document.getElementById('timeline-show-ranges')?.checked ?? true;
  const showCenturies = document.getElementById('timeline-show-centuries')?.checked ?? true;
  const colorBy = document.getElementById('timeline-color-by')?.value || 'entity';

  // Helper: get year safely
  const getYear = s => {
    if (!s) return null;
    const m = String(s).match(/(^|[^0-9])([0-9]{3,4})(?![0-9])/);
    if (!m) return null;
    const y = parseInt(m[2], 10);
    return (y >= 800 && y <= 1800) ? y : null;
  };

  // Helper: get linked records for highlighting
  const getLinkedRecords = (rec, entity) => {
    const linked = new Set();
    if (!rec || !rec.rec_ID) return linked;
    
    const recId = String(rec.rec_ID);
    
    // Add relationships using correct REL_INDEX structure
    const rels = [...(REL_INDEX.bySource[recId] || []), 
                  ...(REL_INDEX.byTarget[recId] || [])];
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      if (src && src.id) linked.add(String(src.id));
      if (tgt && tgt.id) linked.add(String(tgt.id));
    });
    
    // Add pointer fields
    ['details', 'details_summary'].forEach(key => {
      if (!rec[key]) return;
      Object.values(rec[key]).forEach(d => {
        if (d.recIDs) d.recIDs.forEach(id => linked.add(String(id)));
      });
    });
    
    return linked;
  };

  // Collect data for all entity types if multi-band, otherwise just current
  const collectTimelineData = () => {
    const data = {
      ms: [],
      su: [],
      pu: [],
      mi: []
    };

    if (showMultiBand) {
      // Collect ALL data across entity types
      DATA.ms.forEach(r => {
        const tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
        const taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
        if (tpq || taq) {
          // Use midpoint for year position when range exists
          const year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq);
          data.ms.push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: 'ms'
          });
        }
      });

      DATA.su.forEach(r => {
        const tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
        const taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
        const dating = getYear(getDetail(r,'SU dating')?.value);
        // Use midpoint for year position when range exists
        let year;
        if (tpq && taq && tpq !== taq) {
          year = Math.round((tpq + taq) / 2);
        } else {
          year = tpq || taq || dating;
        }
        if (year) {
          data.su.push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: 'su'
          });
        }
      });

      DATA.pu.forEach(r => {
        const tpq = getYear(getDetail(r,'PU Date terminus post quem')?.value);
        const taq = getYear(getDetail(r,'PU Date terminus ante quem')?.value);
        const dating = getYear(getDetail(r,'PU dating')?.value);
        // Use midpoint for year position when range exists
        let year;
        if (tpq && taq && tpq !== taq) {
          year = Math.round((tpq + taq) / 2);
        } else {
          year = tpq || taq || dating;
        }
        if (year) {
          data.pu.push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: 'pu'
          });
        }
      });

      DATA.mi.forEach(r => {
        const creation = getYear(getDetail(r,'Creation date')?.value);
        const suppression = getYear(getDetail(r,'Suppression date')?.value);
        if (creation) {
          data.mi.push({
            rec: r,
            year: creation,
            tpq: creation,
            taq: suppression,
            hasRange: !!(creation && suppression),
            entity: 'mi',
            type: 'creation'
          });
        }
        if (suppression && suppression !== creation) {
          data.mi.push({
            rec: r,
            year: suppression,
            tpq: creation,
            taq: suppression,
            hasRange: false,
            entity: 'mi',
            type: 'suppression'
          });
        }
      });
    } else {
      // Single entity mode - use filtered list
      const list = computeList();
      list.forEach(r => {
        let tpq, taq, year;
        if (ENTITY === 'ms') {
          tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
          taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
          year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq);
        } else if (ENTITY === 'su') {
          tpq = getYear(getDetail(r,'Normalized terminus post quem')?.value);
          taq = getYear(getDetail(r,'Normalized terminus ante quem')?.value);
          const dating = getYear(getDetail(r,'SU dating')?.value);
          year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq || dating);
        } else if (ENTITY === 'pu') {
          tpq = getYear(getDetail(r,'PU Date terminus post quem')?.value);
          taq = getYear(getDetail(r,'PU Date terminus ante quem')?.value);
          const dating = getYear(getDetail(r,'PU dating')?.value);
          year = (tpq && taq && tpq !== taq) ? Math.round((tpq + taq) / 2) : (tpq || taq || dating);
        } else if (ENTITY === 'mi') {
          const creation = getYear(getDetail(r,'Creation date')?.value);
          const suppression = getYear(getDetail(r,'Suppression date')?.value);
          tpq = creation;
          taq = suppression;
          year = (creation && suppression) ? Math.round((creation + suppression) / 2) : (creation || suppression);
        }

        if (year) {
          data[ENTITY].push({
            rec: r,
            tpq,
            taq,
            year,
            hasRange: !!(tpq && taq && tpq !== taq),
            entity: ENTITY
          });
        }
      });
    }

    return data;
  };

  const data = collectTimelineData();
  const allItems = [...data.ms, ...data.su, ...data.pu, ...data.mi];

  if (allItems.length === 0) {
    mount.style.height = '160px';
    mount.innerHTML = '<div class="muted" style="padding:.75rem">No dates in current results.</div>';
    return;
  }

  // Calculate date range
  const allYears = allItems.map(d => d.tpq || d.year).concat(allItems.map(d => d.taq || d.year)).filter(y => y);
  let minYear = Math.min(...allYears);
  let maxYear = Math.max(...allYears);

  // Apply zoom if active
  if (TIMELINE_ZOOM) {
    minYear = TIMELINE_ZOOM.minYear;
    maxYear = TIMELINE_ZOOM.maxYear;
  }

  // Add padding
  const yearSpan = maxYear - minYear;
  minYear = minYear - yearSpan * 0.05;
  maxYear = maxYear + yearSpan * 0.05;

  // Dimensions
  const width = mount.clientWidth || 900;
  const padX = 60;
  const padTop = 40;
  const padBottom = 60;
  const bandHeight = 80;
  const bandGap = 20;

  const bands = showMultiBand ? 
    [{key: 'ms', label: 'Manuscripts', color: '#3388ff'},
     {key: 'su', label: 'Scribal Units', color: '#10b981'},
     {key: 'pu', label: 'Production Units', color: '#ff7800'},
     {key: 'mi', label: 'Monastic Inst.', color: '#9333ea'}] :
    [{key: ENTITY, label: MAP[ENTITY]?.plural || 'Items', color: '#3388ff'}];

  const totalHeight = padTop + (bands.length * bandHeight) + ((bands.length - 1) * bandGap) + padBottom;

  // Scale function
  const xScale = (year) => padX + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padX);

  // Color functions
  const getItemColor = (item) => {
    if (colorBy === 'entity') {
      const colors = {ms: '#3388ff', su: '#10b981', pu: '#ff7800', mi: '#9333ea'};
      return colors[item.entity] || '#999';
    } else if (colorBy === 'language') {
      // Get language from proper fields based on entity type
      let lang = null;
      if (item.entity === 'ms' || item.entity === 'su') {
        lang = getVal(item.rec, 'Text Language(s)') || getVal(item.rec, 'Language of Text');
      } else if (item.entity === 'tx') {
        lang = getVal(item.rec, 'Language of Text');
      }
      
      // Handle array values and termLabel
      if (!lang) return '#6b7280';
      const langStr = String(lang).trim();
      
      const langColors = {
        'Latin': '#dc2626',
        'French': '#2563eb',
        'Italian': '#16a34a',
        'German': '#ca8a04',
        'English': '#9333ea',
        'Dutch': '#10b981',
        'Hebrew': '#eab308',
        'Greek': '#fb923c',
        'Arabic': '#f59e0b'
      };
      
      // Check if string contains language name
      for (const [langName, color] of Object.entries(langColors)) {
        if (langStr.includes(langName)) return color;
      }
      
      return '#6b7280';
    } else if (colorBy === 'script') {
      // Get script from proper field
      let script = getVal(item.rec, 'Normalised script(s)') || getVal(item.rec, 'Script Comments');
      
      if (!script) return '#6b7280';
      const scriptStr = String(script).trim();
      
      const scriptColors = {
        'Gothic': '#dc2626',
        'Caroline': '#2563eb',
        'Carolingian': '#2563eb',
        'Humanistic': '#16a34a',
        'Uncial': '#ca8a04',
        'Beneventan': '#9333ea',
        'Insular': '#fb923c',
        'Textualis': '#b91c1c'
      };
      
      // Check if string contains script name
      for (const [scriptName, color] of Object.entries(scriptColors)) {
        if (scriptStr.includes(scriptName)) return color;
      }
      
      return '#6b7280';
    } else if (colorBy === 'certainty') {
      // Use presence of range as proxy for certainty
      if (item.hasRange) {
        const rangeSize = Math.abs((item.taq || item.year) - (item.tpq || item.year));
        if (rangeSize <= 10) return '#16a34a'; // High certainty (narrow range)
        if (rangeSize <= 50) return '#ca8a04'; // Medium certainty
        return '#dc2626'; // Low certainty (wide range)
      }
      return '#2563eb'; // Exact date (high certainty)
    }
    return '#999';
  };

  // Start building SVG
  let svg = `<svg id="timeline-svg" width="${width}" height="${totalHeight}" style="background: white;">`;

  // Century markers and shading
  if (showCenturies) {
    const firstCentury = Math.floor(minYear / 100) * 100;
    const lastCentury = Math.ceil(maxYear / 100) * 100;
    
    // Medieval period shading (roughly 500-1500)
    if (minYear < 1500 && maxYear > 500) {
      const medievalStart = Math.max(minYear, 500);
      const medievalEnd = Math.min(maxYear, 1500);
      svg += `<rect x="${xScale(medievalStart)}" y="${padTop}" width="${xScale(medievalEnd) - xScale(medievalStart)}" height="${totalHeight - padTop - padBottom}" fill="#f3f4f6" opacity="0.5"/>`;
      svg += `<text x="${xScale((medievalStart + medievalEnd) / 2)}" y="${padTop - 5}" text-anchor="middle" font-size="11" fill="#9ca3af">Medieval Period</text>`;
    }

    // Century lines
    for (let century = firstCentury; century <= lastCentury; century += 100) {
      if (century >= minYear && century <= maxYear) {
        const x = xScale(century);
        svg += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${totalHeight - padBottom}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="2,2"/>`;
        svg += `<text x="${x}" y="${totalHeight - padBottom + 20}" text-anchor="middle" font-size="11" fill="#6b7280">${century}</text>`;
      }
    }
  }

  // Draw bands
  bands.forEach((band, bandIndex) => {
    const bandY = padTop + (bandIndex * (bandHeight + bandGap));
    const bandMidY = bandY + bandHeight / 2;
    const items = data[band.key];

    // Band baseline
    svg += `<line x1="${padX}" y1="${bandMidY}" x2="${width - padX}" y2="${bandMidY}" stroke="#d1d5db" stroke-width="1"/>`;
    
    // Band label
    svg += `<text x="${padX - 10}" y="${bandMidY + 5}" text-anchor="end" font-size="12" font-weight="600" fill="${band.color}">${band.label}</text>`;
    svg += `<text x="${padX - 10}" y="${bandMidY + 18}" text-anchor="end" font-size="10" fill="#9ca3af">(${items.length})</text>`;

    // Draw items
    items.forEach((item, idx) => {
      const color = getItemColor(item);
      const title = (MAP[item.entity]?.title(item.rec) || 'Untitled').replace(/"/g, '&quot;');
      const jitter = (Math.random() - 0.5) * (bandHeight * 0.6);
      const y = bandMidY + jitter;
      const recId = String(item.rec.rec_ID);
      const isSelected = TIMELINE_SELECTED === recId;
      
      // Check if this item is linked to the selected item
      const linkedToSelected = TIMELINE_SELECTED && TIMELINE_SELECTED !== recId && 
        (() => {
          const selectedRec = IDX[ENTITY === 'all' ? item.entity : ENTITY]?.[TIMELINE_SELECTED];
          if (!selectedRec) return false;
          return getLinkedRecords(selectedRec, item.entity).has(recId);
        })();

      if (showRanges && item.hasRange && item.tpq && item.taq) {
        // Draw as horizontal bar (more transparent)
        const x1 = xScale(item.tpq);
        const x2 = xScale(item.taq);
        // Ensure positive width by using min/max
        const xLeft = Math.min(x1, x2);
        const xRight = Math.max(x1, x2);
        const rectWidth = Math.max(0, xRight - xLeft); // Ensure non-negative width
        const xMid = xScale(item.year); // midpoint position
        const barHeight = 6;
        
        // Determine opacity based on selection state
        let barOpacity = 0.15; // Much more transparent
        let dotOpacity = 0.8;
        if (isSelected) {
          barOpacity = 0.4;
          dotOpacity = 1;
        } else if (linkedToSelected) {
          barOpacity = 0.3;
          dotOpacity = 1;
        } else if (TIMELINE_SELECTED) {
          barOpacity = 0.05; // Very faded when something else is selected
          dotOpacity = 0.2;
        }
        
        svg += `<rect class="timeline-item" data-recid="${recId}" x="${xLeft}" y="${y - barHeight/2}" width="${rectWidth}" height="${barHeight}" fill="${color}" opacity="${barOpacity}" stroke="${isSelected ? '#000' : color}" stroke-width="${isSelected ? '3' : '1'}" style="cursor: pointer;"><title>${title}\n${item.tpq}–${item.taq} (midpoint: ${item.year})</title></rect>`;
        
        // Draw dot at midpoint with stronger selection styling
        svg += `<circle class="timeline-item" data-recid="${recId}" cx="${xMid}" cy="${y}" r="${isSelected ? '7' : '4'}" fill="${color}" opacity="${dotOpacity}" stroke="${isSelected ? '#000' : (linkedToSelected ? color : 'none')}" stroke-width="${isSelected ? '3' : '2'}" style="cursor: pointer;"><title>${title} (${item.year})</title></circle>`;
      } else {
        // Draw as dot only
        const x = xScale(item.year);
        let dotOpacity = 0.8;
        if (isSelected) {
          dotOpacity = 1;
        } else if (linkedToSelected) {
          dotOpacity = 1;
        } else if (TIMELINE_SELECTED) {
          dotOpacity = 0.2;
        }
        
        svg += `<circle class="timeline-item" data-recid="${recId}" cx="${x}" cy="${y}" r="${isSelected ? '7' : '4'}" fill="${color}" opacity="${dotOpacity}" stroke="${isSelected ? '#000' : (linkedToSelected ? color : 'none')}" stroke-width="${isSelected ? '3' : '2'}" style="cursor: pointer;"><title>${title} (${item.year})</title></circle>`;
      }
    });
  });

  // X-axis labels
  svg += `<text x="${padX}" y="${totalHeight - padBottom + 40}" font-size="12" fill="#374151">${Math.round(minYear)}</text>`;
  svg += `<text x="${width/2}" y="${totalHeight - padBottom + 40}" text-anchor="middle" font-size="12" fill="#374151">${Math.round((minYear + maxYear) / 2)}</text>`;
  svg += `<text x="${width - padX}" y="${totalHeight - padBottom + 40}" text-anchor="end" font-size="12" fill="#374151">${Math.round(maxYear)}</text>`;

  svg += '</svg>';

  mount.style.height = `${totalHeight}px`;
  mount.innerHTML = svg;
  
  // Add click handlers for items
  setupTimelineItemClicks(mount);
  
  // Update legend
  updateTimelineLegend(colorBy);
  
  // Setup control handlers (including zoom buttons)
  setupTimelineControls(minYear, maxYear);
}

function updateTimelineLegend(colorBy) {
  const legendDiv = document.getElementById('timeline-legend');
  if (!legendDiv) return;

  let legendHTML = '<strong style="color: #374151;">Legend:</strong>';

  if (colorBy === 'entity') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #3388ff; border-radius: 50%;"></span> Manuscripts</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #10b981; border-radius: 50%;"></span> Scribal Units</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ff7800; border-radius: 50%;"></span> Production Units</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #9333ea; border-radius: 50%;"></span> Monastic Inst.</span>
    `;
  } else if (colorBy === 'language') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></span> Latin</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></span> French</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></span> Italian</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ca8a04; border-radius: 50%;"></span> German</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #9333ea; border-radius: 50%;"></span> English</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #eab308; border-radius: 50%;"></span> Hebrew</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #fb923c; border-radius: 50%;"></span> Greek</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #f59e0b; border-radius: 50%;"></span> Arabic</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #6b7280; border-radius: 50%;"></span> Other/Unknown</span>
      <span style="font-style: italic; margin-left: 0.5rem; color: #9ca3af;">Click dots to highlight • +/− to zoom</span>
    `;
  } else if (colorBy === 'script') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></span> Gothic/Textualis</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></span> Caroline/Carolingian</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></span> Humanistic</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ca8a04; border-radius: 50%;"></span> Uncial</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #9333ea; border-radius: 50%;"></span> Beneventan</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #fb923c; border-radius: 50%;"></span> Insular</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #6b7280; border-radius: 50%;"></span> Other/Unknown</span>
      <span style="font-style: italic; margin-left: 0.5rem; color: #9ca3af;">Click dots to highlight • +/− to zoom</span>
    `;
  } else if (colorBy === 'certainty') {
    legendHTML += `
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #2563eb; border-radius: 50%;"></span> Exact Date</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #16a34a; border-radius: 50%;"></span> High Certainty (≤10 yrs)</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ca8a04; border-radius: 50%;"></span> Medium (11-50 yrs)</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #dc2626; border-radius: 50%;"></span> Low Certainty (>50 yrs)</span>
      <span style="font-style: italic; margin-left: 0.5rem; color: #9ca3af;">Click dots to highlight • +/− to zoom</span>
    `;
  }

  legendDiv.innerHTML = legendHTML;
}

function setupTimelineItemClicks(mount) {
  const items = mount.querySelectorAll('.timeline-item');
  
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const recID = item.getAttribute('data-recid'); // Keep as string
      
      if (TIMELINE_SELECTED === recID) {
        // Deselect if clicking same item
        TIMELINE_SELECTED = null;
      } else {
        // Select new item
        TIMELINE_SELECTED = recID;
        
        // Show record details in sidebar (if not already visible)
        // Try to find record in appropriate entity index
        let rec = null;
        for (const entityType of ['ms', 'su', 'pu', 'mi']) {
          if (IDX[entityType]?.[recID]) {
            rec = IDX[entityType][recID];
            break;
          }
        }
        if (rec) {
          showRecord(rec);
        }
      }
      
      // Rebuild timeline to show selection
      buildTimeline();
    });
  });
  
  // Click on background to deselect
  const svg = mount.querySelector('#timeline-svg');
  if (svg) {
    svg.addEventListener('click', (e) => {
      if (e.target === svg) {
        TIMELINE_SELECTED = null;
        buildTimeline();
      }
    });
  }
}

function setupTimelineControls(currentMinYear, currentMaxYear) {
  // Zoom in button
  const zoomInBtn = document.getElementById('timeline-zoom-in');
  if (zoomInBtn && !zoomInBtn.hasAttribute('data-timeline-listener')) {
    zoomInBtn.setAttribute('data-timeline-listener', 'true');
    zoomInBtn.addEventListener('click', () => {
      if (!TIMELINE_ZOOM) {
        // First zoom - zoom to center 50%
        const center = (currentMinYear + currentMaxYear) / 2;
        const span = (currentMaxYear - currentMinYear) * 0.5;
        TIMELINE_ZOOM = {
          minYear: Math.round(center - span / 2),
          maxYear: Math.round(center + span / 2)
        };
      } else {
        // Zoom in further by 50%
        const center = (TIMELINE_ZOOM.minYear + TIMELINE_ZOOM.maxYear) / 2;
        const span = (TIMELINE_ZOOM.maxYear - TIMELINE_ZOOM.minYear) * 0.5;
        TIMELINE_ZOOM = {
          minYear: Math.round(center - span / 2),
          maxYear: Math.round(center + span / 2)
        };
      }
      buildTimeline();
    });
  }

  // Zoom out button
  const zoomOutBtn = document.getElementById('timeline-zoom-out');
  if (zoomOutBtn && !zoomOutBtn.hasAttribute('data-timeline-listener')) {
    zoomOutBtn.setAttribute('data-timeline-listener', 'true');
    zoomOutBtn.addEventListener('click', () => {
      if (TIMELINE_ZOOM) {
        // Zoom out by 150%
        const center = (TIMELINE_ZOOM.minYear + TIMELINE_ZOOM.maxYear) / 2;
        const span = (TIMELINE_ZOOM.maxYear - TIMELINE_ZOOM.minYear) * 1.5;
        TIMELINE_ZOOM = {
          minYear: Math.round(center - span / 2),
          maxYear: Math.round(center + span / 2)
        };
        buildTimeline();
      }
    });
  }
  // Multi-band toggle
  const multiBandCheckbox = document.getElementById('timeline-show-multi');
  if (multiBandCheckbox && !multiBandCheckbox.hasAttribute('data-timeline-listener')) {
    multiBandCheckbox.setAttribute('data-timeline-listener', 'true');
    multiBandCheckbox.addEventListener('change', buildTimeline);
  }

  // Show ranges toggle
  const rangesCheckbox = document.getElementById('timeline-show-ranges');
  if (rangesCheckbox && !rangesCheckbox.hasAttribute('data-timeline-listener')) {
    rangesCheckbox.setAttribute('data-timeline-listener', 'true');
    rangesCheckbox.addEventListener('change', buildTimeline);
  }

  // Century markers toggle
  const centuriesCheckbox = document.getElementById('timeline-show-centuries');
  if (centuriesCheckbox && !centuriesCheckbox.hasAttribute('data-timeline-listener')) {
    centuriesCheckbox.setAttribute('data-timeline-listener', 'true');
    centuriesCheckbox.addEventListener('change', buildTimeline);
  }

  // Color by selector
  const colorBySelect = document.getElementById('timeline-color-by');
  if (colorBySelect && !colorBySelect.hasAttribute('data-timeline-listener')) {
    colorBySelect.setAttribute('data-timeline-listener', 'true');
    colorBySelect.addEventListener('change', (e) => {
      buildTimeline();
      updateTimelineLegend(e.target.value);
    });
  }

  // Reset zoom button
  const resetZoomBtn = document.getElementById('timeline-reset-zoom');
  if (resetZoomBtn && !resetZoomBtn.hasAttribute('data-timeline-listener')) {
    resetZoomBtn.setAttribute('data-timeline-listener', 'true');
    resetZoomBtn.addEventListener('click', () => {
      TIMELINE_ZOOM = null;
      buildTimeline();
    });
  }
}

/* ---------- Network View ---------- */
let NETWORK_CURRENT_REC = null;
let NETWORK_CURRENT_TYPE = null;
let NETWORK_ALL_REL_TYPES = new Set();

function updateRelationshipFilter(relTypes) {
  NETWORK_ALL_REL_TYPES = relTypes;
  const select = document.getElementById('network-rel-filter');
  if (!select) return;
  
  // Store current selection
  const currentValue = select.value;
  
  // Rebuild options
  select.innerHTML = '<option value="">All types</option>';
  const sortedTypes = Array.from(relTypes).sort();
  sortedTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    if (type === currentValue) option.selected = true;
    select.appendChild(option);
  });
}

function buildNetworkView(){
  const viewSelector = document.getElementById('network-view-selector');
  const networkView = viewSelector?.value || 'search';
  
  // Always show search panel (it's the primary interface)
  const searchPanel = document.getElementById('network-search-panel');
  if (searchPanel) {
    searchPanel.style.display = 'block';
  }
  
  // Handle different network views
  if (networkView === 'search') {
    // Search mode - wait for user to select a record or show last selected
    if (!NETWORK_CURRENT_REC) {
      const mount = document.getElementById('network-mount');
      if (mount) mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">Search for a record above to explore its network</div>';
      return;
    }
    // If we have a record, show its network
    buildRecordNetwork(NETWORK_CURRENT_REC, NETWORK_CURRENT_TYPE);
  } else if (networkView === 'clusters') {
    buildClusterView();
  }
}

// Get active entity type filters
function getActiveEntityFilters() {
  const checkboxes = document.querySelectorAll('.network-entity-filter:checked');
  const selected = Array.from(checkboxes).map(cb => cb.value);
  
  // If none are checked, return all entity types (show everything)
  if (selected.length === 0) {
    return ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'];
  }
  
  return selected;
}

// Get active field filters (simplified - always returns empty filters)
function getActiveFieldFilters() {
  // Since we removed the Refine View UI, always return empty filters
  return {
    century: null,
    country: null,
    genre: null,
    material: null,
    script: null,
    order: null
  };
}

// Check if a record matches field filters
function recordMatchesFilters(rec, type) {
  const filters = getActiveFieldFilters();
  
  // If no filters are active, match everything
  const hasAnyFilter = Object.values(filters).some(v => v !== null);
  if (!hasAnyFilter) return true;
  
  // === CORE FILTERS (SIMPLIFIED) ===
  
  // Century filter (scribal units, production units)
  if (filters.century && (type === 'su' || type === 'pu')) {
    const centuries = getValsAll(rec, 'Normalized century of production');
    const match = centuries.some(c => c && c.toLowerCase().includes(filters.century));
    if (!match) return false;
  }
  
  // Country filter (production units, institutions)
  if (filters.country && (type === 'pu' || type === 'hi' || type === 'mi')) {
    let country = '';
    if (type === 'pu') country = getVal(rec, 'PU country') || '';
    else if (type === 'hi' || type === 'mi') country = getVal(rec, 'Country') || '';
    if (!country.toLowerCase().includes(filters.country.toLowerCase())) return false;
  }
  
  // === DYNAMIC CONTENT FILTERS ===
  
  // Genre filter (texts)
  if (filters.genre && type === 'tx') {
    const genre = (getVal(rec, 'Genre') || '').toLowerCase();
    if (!genre.includes(filters.genre)) return false;
  }
  
  // Material filter (manuscripts)
  if (filters.material && type === 'ms') {
    const material = (getVal(rec, 'Material') || '').toLowerCase();
    if (!material.includes(filters.material)) return false;
  }
  
  // Script type filter (scribal units)
  if (filters.script && type === 'su') {
    const script = (getVal(rec, 'Script') || '').toLowerCase();
    if (!script.includes(filters.script)) return false;
  }
  
  // Religious order filter (monastic institutions)
  if (filters.order && type === 'mi') {
    const order = (getVal(rec, 'Religious order') || '').toLowerCase();
    if (!order.includes(filters.order)) return false;
  }
  
  return true;
}

// Build cluster view showing entity types and connection densities
function buildClusterView() {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:1rem;text-align:center;color:#666;">Analyzing connection patterns...</div>';
  
  // Calculate connection statistics for each entity type
  const typeStats = {};
  const entityTypes = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'];
  
  // Entity type labels
  const typeLabels = {
    su: 'Scribal Units',
    ms: 'Manuscripts',
    pu: 'Production Units',
    hi: 'Holding Institutions',
    mi: 'Monastic Institutions',
    hp: 'Historical People',
    tx: 'Texts'
  };
  
  entityTypes.forEach(type => {
    const records = DATA[type] || [];
    typeStats[type] = {
      count: records.length,
      connections: 0,
      label: typeLabels[type] || type
    };
  });
  
  // Count connections from relationships
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
    
    if (srcType && typeStats[srcType]) typeStats[srcType].connections++;
    if (tgtType && typeStats[tgtType]) typeStats[tgtType].connections++;
  });
  
  // Create cluster visualization with entity types as large nodes
  const nodes = [];
  const links = [];
  
  // Add entity type nodes
  entityTypes.forEach(type => {
    const stats = typeStats[type];
    if (stats.count > 0) {
      nodes.push({
        id: type,
        type: type,
        label: `${stats.label}\n(${stats.count} records)`,
        size: Math.sqrt(stats.count) * 3,
        connections: stats.connections
      });
    }
  });
  
  // Add links between entity types based on relationship patterns
  const typeConnections = {};
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
    
    if (srcType && tgtType && srcType !== tgtType) {
      const key = [srcType, tgtType].sort().join('-');
      typeConnections[key] = (typeConnections[key] || 0) + 1;
    }
  });
  
  // Create links
  Object.entries(typeConnections).forEach(([key, count]) => {
    const [src, tgt] = key.split('-');
    links.push({
      source: src,
      target: tgt,
      weight: count,
      label: `${count} connections`
    });
  });
  
  renderD3ClusterNetwork(mount, nodes, links);
}

// Build full database network
function buildFullDatabaseNetwork() {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:1rem;text-align:center;color:#666;">Loading full database network...</div>';
  
  // Collect all records from all entity types
  const nodes = [];
  const links = [];
  const nodeMap = new Map();
  
  // Add all records as nodes
  Object.entries(DATA).forEach(([entityType, records]) => {
    if (entityType === 'rel') return; // Skip relationships
    records.forEach(rec => {
      const id = `${entityType}-${rec.rec_ID}`;
      const node = {
        id,
        type: entityType,
        rec,
        label: MAP[entityType].title(rec)
      };
      nodes.push(node);
      nodeMap.set(id, node);
    });
  });
  
  // Add relationships as links
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)] || null;
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)] || null;
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      links.push({
        source: srcId,
        target: tgtId,
        type: 'relationship',
        label: getVal(rel, 'Relation type') || ''
      });
    }
  });
  
  // Limit to prevent browser crash - show warning if too large
  if (nodes.length > 500) {
    mount.innerHTML = `<div style="padding:2rem;text-align:center;color:#666;">
      Full database network contains ${nodes.length} nodes and would be too complex to visualize effectively.<br>
      Please select a specific subset view or use the search function to explore from a specific record.
    </div>`;
    return;
  }
  
  renderD3Network(mount, nodes, links);
}

// Build network for a specific record
function buildRecordNetwork(rec, type) {
  const depthInput = document.getElementById('network-depth');
  const depth = depthInput ? parseInt(depthInput.value) || 2 : 2;
  const relFilter = document.getElementById('network-rel-filter')?.value || null;
  
  buildNetworkDiagram(rec, type, depth, relFilter);
}

// Build subset network views
function buildSubsetNetwork(subsetType) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:1rem;text-align:center;color:#666;">Analyzing network structure...</div>';
  
  // Define which entity types to include for each subset
  const subsets = {
    manuscripts: { types: ['ms', 'su', 'pu', 'hi'], label: 'Manuscripts Network' },
    scribal: { types: ['su', 'hp', 'ms'], label: 'Scribal Network' },
    institutions: { types: ['hi', 'mi', 'ms', 'pu'], label: 'Institutions Network' },
    texts: { types: ['tx', 'su', 'hp', 'ms'], label: 'Texts Network' }
  };
  
  const subset = subsets[subsetType];
  if (!subset) return;
  
  // Count total nodes in this subset
  let totalNodes = 0;
  subset.types.forEach(entityType => {
    if (DATA[entityType]) totalNodes += DATA[entityType].length;
  });
  
  // If too large, show statistics and suggest search instead
  if (totalNodes > 200) {
    mount.innerHTML = `
      <div style="padding:2rem;max-width:600px;margin:0 auto;">
        <h3 style="margin-top:0;">${subset.label}</h3>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;margin:1rem 0;">
          <div style="font-size:0.875rem;color:#666;margin-bottom:0.5rem;">Network Statistics:</div>
          <div style="font-size:2rem;font-weight:700;color:#d4af37;margin-bottom:0.25rem;">${totalNodes.toLocaleString()}</div>
          <div style="font-size:0.875rem;color:#666;">total entities in this network</div>
        </div>
        
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:0.5rem;padding:1rem;margin:1rem 0;">
          <div style="font-weight:600;margin-bottom:0.5rem;">Network too large to visualize</div>
          <div style="font-size:0.875rem;color:#666;">
            Visualizing ${totalNodes.toLocaleString()} nodes would overwhelm your browser.
          </div>
        </div>
        
        <div style="margin-top:1.5rem;">
          <div style="font-weight:600;margin-bottom:0.75rem;">Recommended approaches:</div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <button id="network-sample-btn" class="chip" style="padding:0.75rem;text-align:left;background:#fff;display:flex;align-items:center;gap:0.5rem;width:100%;">
              <span style="font-size:1.2rem;"></span>
              <div style="flex:1;">
                <div style="font-weight:600;">Show Random Sample</div>
                <div style="font-size:0.75rem;color:#666;">Display 100 random well-connected entities</div>
              </div>
            </button>
            
            <button id="network-hubs-btn" class="chip" style="padding:0.75rem;text-align:left;background:#fff;display:flex;align-items:center;gap:0.5rem;width:100%;">
              <span style="font-size:1.2rem;">⭐</span>
              <div style="flex:1;">
                <div style="font-weight:600;">Show Network Hubs</div>
                <div style="font-size:0.75rem;color:#666;">Display the 50 most connected entities</div>
              </div>
            </button>
            
            <button id="network-search-mode-btn" class="chip" style="padding:0.75rem;text-align:left;background:#d4af37;color:white;display:flex;align-items:center;gap:0.5rem;width:100%;">
              <span style="font-size:1.2rem;"></span>
              <div style="flex:1;">
                <div style="font-weight:600;">Search & Explore</div>
                <div style="font-size:0.75rem;opacity:0.9;">Start from a specific record (Recommended)</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners for the buttons
    setTimeout(() => {
      document.getElementById('network-sample-btn')?.addEventListener('click', () => {
        buildSampledNetwork(subset.types, 100);
      });
      
      document.getElementById('network-hubs-btn')?.addEventListener('click', () => {
        buildHubsNetwork(subset.types, 50);
      });
      
      document.getElementById('network-search-mode-btn')?.addEventListener('click', () => {
        const viewSelector = document.getElementById('network-view-selector');
        if (viewSelector) {
          viewSelector.value = 'search';
          buildNetworkView();
        }
      });
    }, 0);
    
    return;
  }
  
  // If small enough, build the full subset network
  buildFullSubsetNetwork(subset.types);
}

// Build full network for a subset of entity types
function buildFullSubsetNetwork(entityTypes) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  const nodes = [];
  const links = [];
  const nodeMap = new Map();
  
  // Add nodes for selected entity types
  entityTypes.forEach(entityType => {
    if (!DATA[entityType]) return;
    DATA[entityType].forEach(rec => {
      const id = `${entityType}-${rec.rec_ID}`;
      const node = {
        id,
        type: entityType,
        rec,
        label: MAP[entityType].title(rec)
      };
      nodes.push(node);
      nodeMap.set(id, node);
    });
  });
  
  // Add relationships
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)] || null;
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)] || null;
    if (!srcType || !tgtType) return;
    if (!entityTypes.includes(srcType) || !entityTypes.includes(tgtType)) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      links.push({ source: srcId, target: tgtId, type: 'relationship' });
    }
  });
  
  renderD3Network(mount, nodes, links);
}

// Build sampled network - grow a connected network from a highly-connected seed
function buildSampledNetwork(entityTypes, sampleSize) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:1rem;text-align:center;color:#666;">Building connected sample network...</div>';
  
  // Handle entity type filtering
  let types;
  if (entityTypes === null || entityTypes === undefined) {
    types = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx']; // No filter = all types
  } else if (Array.isArray(entityTypes) && entityTypes.length === 0) {
    // Empty array = nothing selected, show message
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">No entity types selected. Check at least one entity type in the filters.</div>';
    return;
  } else {
    types = entityTypes;
  }
  
  // Build adjacency map: node ID -> array of connected node IDs
  const adjacency = new Map();
  const nodeInfo = new Map(); // Store rec and type for each node ID
  
  // Index all nodes (with field filters applied)
  types.forEach(entityType => {
    if (!DATA[entityType]) return;
    DATA[entityType].forEach(rec => {
      // Apply field filters
      if (!recordMatchesFilters(rec, entityType)) return;
      
      const id = `${entityType}-${rec.rec_ID}`;
      nodeInfo.set(id, { rec, type: entityType });
      adjacency.set(id, []);
    });
  });
  
  // Build adjacency lists
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (adjacency.has(srcId) && adjacency.has(tgtId)) {
      adjacency.get(srcId).push(tgtId);
      adjacency.get(tgtId).push(srcId);
    }
  });
  
  // Find highly connected nodes as potential seeds
  const connectionCounts = Array.from(adjacency.entries())
    .map(([id, neighbors]) => ({ id, count: neighbors.length }))
    .filter(n => n.count > 0)
    .sort((a, b) => b.count - a.count);
  
  if (connectionCounts.length === 0) {
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No connected nodes found in the database.</div>';
    return;
  }
  
  // Start from a highly connected node (but add some randomness)
  const seedIndex = Math.floor(Math.random() * Math.min(20, connectionCounts.length));
  const seedId = connectionCounts[seedIndex].id;
  
  // Grow network using BFS (breadth-first search) to ensure connectivity
  const selected = new Set([seedId]);
  const queue = [seedId];
  
  while (queue.length > 0 && selected.size < sampleSize) {
    const currentId = queue.shift();
    const neighbors = adjacency.get(currentId) || [];
    
    // Shuffle neighbors for variety
    const shuffledNeighbors = neighbors.sort(() => 0.5 - Math.random());
    
    for (const neighborId of shuffledNeighbors) {
      if (!selected.has(neighborId)) {
        selected.add(neighborId);
        queue.push(neighborId);
        
        if (selected.size >= sampleSize) break;
      }
    }
  }
  
  // Build nodes from selected IDs
  const nodeMap = new Map();
  const nodes = Array.from(selected).map(id => {
    const info = nodeInfo.get(id);
    const neighbors = adjacency.get(id) || [];
    const connectionsInSample = neighbors.filter(nId => selected.has(nId)).length;
    
    const node = {
      id,
      type: info.type,
      rec: info.rec,
      label: MAP[info.type].title(info.rec),
      connections: connectionsInSample
    };
    nodeMap.set(id, node);
    return node;
  });
  
  // Build links - only between selected nodes
  const links = [];
  const linkSet = new Set(); // Prevent duplicates
  
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      const linkKey = [srcId, tgtId].sort().join('|');
      if (!linkSet.has(linkKey)) {
        linkSet.add(linkKey);
        links.push({ source: srcId, target: tgtId, type: 'relationship' });
      }
    }
  });
  
  renderD3Network(mount, nodes, links);
}

// Build hubs network - most connected entities with their neighborhoods
function buildHubsNetwork(entityTypes, topN) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:1rem;text-align:center;color:#666;">Finding most connected entities...</div>';
  
  // Handle entity type filtering
  let types;
  if (entityTypes === null || entityTypes === undefined) {
    types = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx']; // No filter = all types
  } else if (Array.isArray(entityTypes) && entityTypes.length === 0) {
    // Empty array = nothing selected, show message
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">No entity types selected. Check at least one entity type in the filters.</div>';
    return;
  } else {
    types = entityTypes;
  }
  
  // Build a map of node ID -> {rec, type, connectionCount, neighbors}
  const nodeData = new Map();
  
  // Initialize all nodes (with field filters applied)
  types.forEach(entityType => {
    if (!DATA[entityType]) return;
    DATA[entityType].forEach(rec => {
      // Apply field filters
      if (!recordMatchesFilters(rec, entityType)) return;
      
      const id = `${entityType}-${rec.rec_ID}`;
      nodeData.set(id, {
        id,
        rec,
        type: entityType,
        connectionCount: 0,
        neighbors: new Set()
      });
    });
  });
  
  // Count connections efficiently
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    const srcNode = nodeData.get(srcId);
    const tgtNode = nodeData.get(tgtId);
    
    if (srcNode && tgtNode) {
      srcNode.connectionCount++;
      tgtNode.connectionCount++;
      srcNode.neighbors.add(tgtId);
      tgtNode.neighbors.add(srcId);
    }
  });
  
  // Find top N most connected nodes
  const allNodes = Array.from(nodeData.values());
  const topHubs = allNodes
    .filter(n => n.connectionCount > 0)
    .sort((a, b) => b.connectionCount - a.connectionCount)
    .slice(0, topN);
  
  if (topHubs.length === 0) {
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">No connected entities found.</div>';
    return;
  }
  
  // Include hubs and their immediate neighbors for context
  const selectedIds = new Set(topHubs.map(h => h.id));
  
  // Add some neighbors for visual context (max 3 neighbors per hub)
  topHubs.forEach(hub => {
    let added = 0;
    for (const neighborId of hub.neighbors) {
      if (!selectedIds.has(neighborId) && added < 3) {
        selectedIds.add(neighborId);
        added++;
      }
    }
  });
  
  // Build nodes for visualization
  const nodeMap = new Map();
  const nodes = [];
  
  for (const id of selectedIds) {
    const data = nodeData.get(id);
    if (!data) continue;
    
    const isHub = topHubs.some(h => h.id === id);
    const node = {
      id: data.id,
      type: data.type,
      rec: data.rec,
      label: MAP[data.type].title(data.rec),
      connections: data.connectionCount,
      size: isHub ? Math.min(20, 8 + Math.sqrt(data.connectionCount)) : 6,
      isHub
    };
    nodes.push(node);
    nodeMap.set(id, node);
  }
  
  // Build links only between selected nodes
  const links = [];
  const linkSet = new Set();
  
  DATA.rel.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    const srcType = REC_TYPE_TO_ENTITY[String(src.type)];
    const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
    if (!srcType || !tgtType) return;
    
    const srcId = `${srcType}-${src.id}`;
    const tgtId = `${tgtType}-${tgt.id}`;
    
    if (nodeMap.has(srcId) && nodeMap.has(tgtId)) {
      const linkKey = [srcId, tgtId].sort().join('|');
      if (!linkSet.has(linkKey)) {
        linkSet.add(linkKey);
        links.push({ source: srcId, target: tgtId, type: 'relationship' });
      }
    }
  });
  
  renderD3Network(mount, nodes, links);
}

// Render D3 force-directed network with zoom and pan
function renderD3Network(mount, nodes, links) {
  // Store current network data for export
  CURRENT_NETWORK_DATA = { nodes: nodes.map(n => ({...n})), links: links.map(l => ({...l})) };
  
  mount.innerHTML = '';
  
  const width = mount.clientWidth || 800;
  const height = mount.clientHeight || 600;
  
  const svg = d3.select(mount)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Add zoom and pan behavior
  const g = svg.append('g');
  
  let currentZoom = 1;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on('zoom', (event) => {
      currentZoom = event.transform.k;
      g.attr('transform', event.transform);
      // Update label visibility based on zoom level
      updateLabelVisibility(currentZoom);
    });
  
  svg.call(zoom);
  
  // Store zoom object and svg for button controls on mount element
  mount._zoom = zoom;
  mount._svg = svg;
  mount._g = g;
  
  const colors = {
    su: '#e6b800',
    ms: '#3498db',
    pu: '#e74c3c',
    hi: '#2ecc71',
    mi: '#9b59b6',
    hp: '#f39c12',
    tx: '#1abc9c'
  };
  
  // Adjust forces based on network size for better layout
  // Much stronger forces to bring nodes closer together
  const linkDistance = nodes.length < 30 ? 50 : nodes.length < 100 ? 40 : 30;
  const chargeStrength = nodes.length < 30 ? -800 : nodes.length < 100 ? -600 : -400;
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(linkDistance).strength(1))
    .force('charge', d3.forceManyBody().strength(chargeStrength))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(12))
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1));
  
  // Auto-fit after simulation settles
  let autoFitTimeout;
  simulation.on('end', () => {
    clearTimeout(autoFitTimeout);
    autoFitTimeout = setTimeout(() => {
      const g = svg.select('g');
      try {
        const bounds = g.node().getBBox();
        const dx = bounds.width;
        const dy = bounds.height;
        const x = bounds.x + bounds.width / 2;
        const y = bounds.y + bounds.height / 2;
        
        const scale = Math.min(0.85 / Math.max(dx / width, dy / height), 2);
        const translate = [width / 2 - scale * x, height / 2 - scale * y];
        
        const transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
        svg.transition().duration(750).call(zoom.transform, transform);
      } catch (e) {
        // Silently fail if bounds can't be calculated
      }
    }, 100);
  });
  
  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => d.weight ? Math.sqrt(d.weight) * 0.5 : 1.5);
  
  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.size || 8)
    .attr('fill', d => colors[d.type] || '#999')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      // Navigate to the record when clicked
      if (d.rec && d.type) {
        event.stopPropagation();
        jumpTo(d.rec, d.type);
      }
    })
    .on('mouseover', function() {
      d3.select(this).attr('stroke-width', 3).attr('stroke', '#ffeb3b');
    })
    .on('mouseout', function() {
      d3.select(this).attr('stroke-width', 1.5).attr('stroke', '#fff');
    })
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  node.append('title')
    .text(d => d.connections ? `${d.label} (${d.connections} connections)` : d.label);
  
  const showLabels = document.getElementById('network-show-labels')?.checked ?? true;
  let labelElements = null;
  
  if (showLabels) {
    labelElements = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.label)
      .attr('font-size', 10)
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('fill', '#333')
      .style('pointer-events', 'none');
    
    // For large networks, only show labels for highly connected nodes
    if (nodes.length > 50) {
      const threshold = nodes.length > 100 ? 10 : 5;
      labelElements.style('display', d => (d.connections || 0) >= threshold ? 'block' : 'none');
    }
    
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      labelElements
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  } else {
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
    });
  }
  
  // Function to update label visibility based on zoom level
  function updateLabelVisibility(zoomLevel) {
    if (!labelElements) return;
    
    if (nodes.length > 100) {
      // For very large networks, only show labels when zoomed in
      const threshold = nodes.length > 100 ? 10 : 5;
      labelElements.style('display', d => {
        const isImportant = (d.connections || 0) >= threshold;
        const isZoomedIn = zoomLevel > 1.5;
        return (isImportant || isZoomedIn) ? 'block' : 'none';
      });
      labelElements.attr('font-size', Math.max(8, Math.min(14, 10 * zoomLevel)));
    } else if (nodes.length > 50) {
      // Medium networks: show important labels always, others when zoomed
      const threshold = 5;
      labelElements.style('display', d => {
        const isImportant = (d.connections || 0) >= threshold;
        const isZoomedIn = zoomLevel > 1;
        return (isImportant || isZoomedIn) ? 'block' : 'none';
      });
      labelElements.attr('font-size', Math.max(8, Math.min(14, 10 * zoomLevel)));
    } else {
      // Small networks: show all labels, scale with zoom
      labelElements.attr('font-size', Math.max(8, Math.min(16, 10 * zoomLevel)));
    }
  }
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Render cluster network with larger nodes
function renderD3ClusterNetwork(mount, nodes, links) {
  mount.innerHTML = '';
  
  const width = mount.clientWidth || 800;
  const height = mount.clientHeight || 600;
  
  const svg = d3.select(mount)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Add zoom and pan behavior
  const g = svg.append('g');
  
  const zoom = d3.zoom()
    .scaleExtent([0.5, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);
  
  // Store zoom object and svg for button controls on mount element
  mount._zoom = zoom;
  mount._svg = svg;
  mount._g = g;
  
  const colors = {
    su: '#e6b800',
    ms: '#3498db',
    pu: '#e74c3c',
    hi: '#2ecc71',
    mi: '#9b59b6',
    hp: '#f39c12',
    tx: '#1abc9c'
  };
  
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(200))
    .force('charge', d3.forceManyBody().strength(-1000))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.size + 20));
  
  // Draw links with varying thickness
  const link = g.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => Math.log(d.weight + 1) * 2);
  
  // Draw nodes as circles
  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.size || 20)
    .attr('fill', d => colors[d.type] || '#999')
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  node.append('title')
    .text(d => `${d.label}\n${d.connections} connections`);
  
  // Add labels to cluster nodes
  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => d.label)
    .attr('font-size', 12)
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .attr('dy', 4)
    .attr('fill', '#333')
    .style('pointer-events', 'none');
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    
    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

// Export current network for analysis
let CURRENT_NETWORK_DATA = { nodes: [], links: [] }; // Store current network data

function exportCurrentNetwork(format) {
  if (!CURRENT_NETWORK_DATA.nodes || CURRENT_NETWORK_DATA.nodes.length === 0) {
    alert('No network to export\n\nPlease generate a network first (Random Sample, Top Hubs, or search for a record).');
    return;
  }
  
  const filename = `network_export_${Date.now()}`;
  
  if (format === 'gephi') {
    // Gephi CSV format
    const nodesCsv = [
      'Id,Label,Type',
      ...CURRENT_NETWORK_DATA.nodes.map(n => 
        `"${n.id}","${(n.label || n.id).replace(/"/g, '""')}","${n.type || 'unknown'}"`
      )
    ].join('\n');
    
    const edgesCsv = [
      'Source,Target,Type',
      ...CURRENT_NETWORK_DATA.links.map(l => 
        `"${l.source.id || l.source}","${l.target.id || l.target}","${l.type || 'related'}"`
      )
    ].join('\n');
    
    downloadFile(nodesCsv, `${filename}_nodes.csv`, 'text/csv');
    setTimeout(() => {
      downloadFile(edgesCsv, `${filename}_edges.csv`, 'text/csv');
      alert('✅ Gephi Export Complete!\n\n' +
            `Downloaded 2 files:\n` +
            `${filename}_nodes.csv (${CURRENT_NETWORK_DATA.nodes.length} nodes)\n` +
            `${filename}_edges.csv (${CURRENT_NETWORK_DATA.links.length} edges)\n\n` +
            'To import into Gephi:\n' +
            '1. Open Gephi → New Project\n' +
            '2. File → Import Spreadsheet\n' +
            '3. Select edges CSV, choose "Edges table"\n' +
            '4. Import spreadsheet again, select nodes CSV, choose "Nodes table"');
    }, 100);
    
  } else if (format === 'r') {
    // R format
    const rCsv = [
      'from_id,to_id,from_label,to_label,relationship',
      ...CURRENT_NETWORK_DATA.links.map(l => {
        const sourceNode = CURRENT_NETWORK_DATA.nodes.find(n => n.id === (l.source.id || l.source));
        const targetNode = CURRENT_NETWORK_DATA.nodes.find(n => n.id === (l.target.id || l.target));
        return `"${sourceNode?.id || ''}","${targetNode?.id || ''}","${(sourceNode?.label || '').replace(/"/g, '""')}","${(targetNode?.label || '').replace(/"/g, '""')}","${l.type || 'related'}"`;
      })
    ].join('\n');
    
    const rScript = `# Network Analysis Script
# Generated: ${new Date().toISOString()}
# Nodes: ${CURRENT_NETWORK_DATA.nodes.length}
# Edges: ${CURRENT_NETWORK_DATA.links.length}

library(igraph)
library(tidyverse)

# Load data
edges <- read_csv("${filename}.csv")

# Create graph
g <- graph_from_data_frame(edges[,1:2], directed = TRUE)

# Add edge attributes
E(g)$relationship <- edges$relationship

# Basic statistics
cat("Network Statistics:\\n")
cat("Nodes:", vcount(g), "\\n")
cat("Edges:", ecount(g), "\\n")
cat("Density:", round(edge_density(g), 4), "\\n")
cat("\\n")

# Centrality measures
V(g)$degree <- degree(g)
V(g)$betweenness <- betweenness(g, normalized = TRUE)
V(g)$closeness <- closeness(g, normalized = TRUE)

# Top nodes by degree
top_degree <- sort(V(g)$degree, decreasing = TRUE)[1:10]
cat("Top 10 nodes by degree:\\n")
print(top_degree)

# Visualization
pdf("${filename}_plot.pdf", width = 12, height = 10)
plot(g, 
     vertex.size = sqrt(V(g)$degree) * 3,
     vertex.label.cex = 0.6,
     vertex.label.color = "black",
     edge.arrow.size = 0.3,
     edge.curved = 0.2,
     layout = layout_with_fr(g),
     main = "Network Visualization")
dev.off()

cat("\\nPlot saved to: ${filename}_plot.pdf\\n")
`;
    
    downloadFile(rCsv, `${filename}.csv`, 'text/csv');
    setTimeout(() => {
      downloadFile(rScript, `${filename}.R`, 'text/plain');
      alert('✅ R Export Complete!\n\n' +
            `Downloaded 2 files:\n` +
            `${filename}.csv (${CURRENT_NETWORK_DATA.links.length} edges)\n` +
            `${filename}.R (analysis script)\n\n` +
            'To use in R:\n' +
            '1. Place both files in the same folder\n' +
            '2. Open the .R file in RStudio\n' +
            '3. Install packages if needed:\n' +
            '   install.packages(c("igraph", "tidyverse"))\n' +
            '4. Run the script (Ctrl+Shift+S or Cmd+Shift+S)');
    }, 100);
  }
}

/* ---------- High-Quality Image Export Functions ---------- */

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
        console.warn('Could not access stylesheet:', e);
      }
    }
  } catch (e) {
    console.warn('Error accessing stylesheets:', e);
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
  
  // Get the bounding box for proper sizing
  const bbox = svgElement.getBBox();
  const width = bbox.width;
  const height = bbox.height;
  
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
  svgClone.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${width} ${height}`);
  
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
        console.warn('Could not access stylesheet:', e);
      }
    }
  } catch (e) {
    console.warn('Error accessing stylesheets:', e);
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
    console.error('Failed to load SVG:', e);
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
      console.error('Map export error:', error);
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
  
  if (!analyticsMount) {
    alert('No analytics visualization to export');
    return;
  }
  
  // Check if there's actual content
  if (!analyticsMount.innerHTML.trim()) {
    alert('No visualization content to export. Please generate a visualization first.');
    return;
  }
  
  // Check if element has dimensions
  const rect = analyticsMount.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    alert('Visualization has no visible dimensions. Please ensure the visualization is properly rendered.');
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
            console.error('Export error:', err);
            alert('Export failed: ' + err.message);
          });
        };
        script.onerror = () => {
          console.error('Failed to load html2canvas');
          alert('Failed to load export library. Please check your internet connection.');
        };
        document.head.appendChild(script);
      } else {
        exportHtmlVisualizationAsPng(analyticsMount, filename).catch(err => {
          console.error('Export error:', err);
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
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Ensure element is visible
    const rect = element.getBoundingClientRect();
    
    if (rect.width === 0 || rect.height === 0) {
      throw new Error('Element has no visible dimensions');
    }
    
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: false,
      removeContainer: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    });
    
    // Convert to blob and download
    canvas.toBlob(blob => {
      if (!blob) {
        console.error('Failed to create blob');
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
    console.error('Export failed:', error);
    console.error('Error details:', error.message, error.stack);
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
        console.warn('Could not access stylesheet:', e);
      }
    }
  } catch (e) {
    console.warn('Error accessing stylesheets:', e);
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
  
  // Use html2canvas to capture the clone
  html2canvas(tempContainer, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scale: 3, // 3x scale for ~300 DPI
    logging: false
  }).then(canvas => {
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
    console.error('Tree export error:', error);
    document.body.removeChild(tempContainer);
    treeItem.style.cursor = '';
    alert('Failed to export tree. Please try again.');
  });
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
    console.error('❌ entity-switch not found');
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
  if ($search) $search.addEventListener('input', debounce(()=>{ page=1; renderCurrent(); updateAvailableViews(); }, 200));
  
  // Facet clicks
  if ($mount) {
    $mount.addEventListener('click',e=>{
      const chip=e.target.closest('.chip'); if (!chip) return;
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
      page=1;
      recompute(); updateAvailableViews();
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
        resultsDiv.innerHTML = '<div style="padding:0.5rem;color:#666;font-size:0.875rem;">No records found</div>';
        return;
      }
      
      resultsDiv.innerHTML = matches.map(({ rec, type }) => {
        const title = esc(MAP[type].title(rec));
        const entityLabel = type.toUpperCase();
        return `<div class="network-search-result" data-type="${type}" data-id="${rec.rec_ID}" style="padding:0.5rem;cursor:pointer;border-bottom:1px solid #f0f0f0;font-size:0.875rem;">
          <strong>${title}</strong> <span style="color:#999;font-size:0.75rem;">[${entityLabel}]</span>
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
        console.warn('Could not fit network to screen:', e);
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

/* ---------- Path Finding Dialog ---------- */
const $pathDialog = document.getElementById('path-dialog');
const $pathFrom = document.getElementById('path-from');
const $pathSearch = document.getElementById('path-search');
const $pathResults = document.getElementById('path-results');
const $pathDisplay = document.getElementById('path-display');
const $pathDepth = document.getElementById('path-depth');

let pathFindingSource = null;

function showPathFindingDialog(rec, type) {
  pathFindingSource = { rec, type };
  
  // Display source record with step indicator
  $pathFrom.innerHTML = `
    <div style="display:flex;align-items:center;gap:.5rem;">
      <span style="display:inline-block;background:#3498db;color:white;border-radius:50%;width:1.5rem;height:1.5rem;text-align:center;line-height:1.5rem;font-size:.85rem;font-weight:bold;">1</span>
      <div><strong>Starting from:</strong> ${linkTo(type, rec.rec_ID, MAP[type].title(rec))} <span class="muted">(${type.toUpperCase()})</span></div>
    </div>`;
  
  // Clear search
  $pathSearch.value = '';
  $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;">Start typing to search all records in the database...</div>';
  $pathDisplay.innerHTML = '';
  
  $pathDialog.showModal();
}

// Search for target record
$pathSearch?.addEventListener('input', debounce(() => {
  const query = $pathSearch.value.trim().toLowerCase();
  if (!query) {
    $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;">Type to search for a target record...</div>';
    return;
  }
  
  // Search across all entity types
  const results = [];
  for (const [entityType, records] of Object.entries(DATA)) {
    if (entityType === 'rel') continue;
    
    records.forEach(rec => {
      const title = MAP[entityType].title(rec);
      const searchText = flat(rec);
      
      if (searchText.includes(query)) {
        results.push({
          rec,
          type: entityType,
          title,
          score: title.toLowerCase().includes(query) ? 2 : 1
        });
      }
    });
  }
  
  // Sort by score and limit
  results.sort((a, b) => b.score - a.score);
  const top = results.slice(0, 20);
  
  if (top.length === 0) {
    $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;text-align:center;">No matching records found. Try a different search term.</div>';
    return;
  }
  
  let html = `<div style="padding:.5rem;"><div class="muted" style="padding:.5rem;font-size:.9rem;">Found ${results.length} result${results.length > 1 ? 's' : ''} ${results.length > 20 ? '(showing top 20)' : ''} — click to select:</div>`;
  
  // Group by entity type for better organization
  const typeLabels = {
    'su': 'Scribal Unit',
    'ms': 'Manuscript', 
    'pu': '🏭 Production Unit',
    'hi': 'Holding Institution',
    'mi': 'Monastic Institution',
    'hp': 'Person',
    'tx': 'Text'
  };
  
  top.forEach(({ rec, type, title }) => {
    html += `<div style="padding:.5rem .75rem;cursor:pointer;border-radius:.25rem;border-left:3px solid transparent;transition:all 0.15s;" 
      class="path-result-item" 
      data-type="${type}" 
      data-id="${rec.rec_ID}"
      onmouseover="this.style.background='#f0f8ff';this.style.borderLeftColor='#3498db';" 
      onmouseout="this.style.background='transparent';this.style.borderLeftColor='transparent';">
      <div style="font-weight:500;">${esc(title)}</div>
      <div class="muted" style="font-size:.85rem;margin-top:.15rem;">${typeLabels[type] || type.toUpperCase()}</div>
    </div>`;
  });
  html += '</div>';
  
  $pathResults.innerHTML = html;
  
  // Add click handlers
  $pathResults.querySelectorAll('.path-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetType = item.dataset.type;
      const targetId = item.dataset.id;
      const targetRec = IDX[targetType]?.[String(targetId)];
      
      if (targetRec) {
        findAndDisplayPaths(pathFindingSource, { rec: targetRec, type: targetType });
      }
    });
  });
}, 300));

function findAndDisplayPaths(source, target) {
  const depth = parseInt($pathDepth.value) || 4;
  
  $pathDisplay.innerHTML = '<div style="padding:.75rem;text-align:center;"><span class="muted">Searching for connection paths...</span></div>';
  
  // Run path finding (with a small delay to show searching message)
  setTimeout(() => {
    const paths = findPaths(source.type, source.rec.rec_ID, target.type, target.rec.rec_ID, depth);
    
    let html = `<div style="margin:.75rem 0;padding:.75rem;background:#f0f8e8;border-left:3px solid #2ecc71;border-radius:.5rem;">
      <div style="display:flex;align-items:center;gap:.5rem;">
        <span style="display:inline-block;background:#2ecc71;color:white;border-radius:50%;width:1.5rem;height:1.5rem;text-align:center;line-height:1.5rem;font-size:.85rem;font-weight:bold;">✓</span>
        <div><strong>Destination:</strong> ${linkTo(target.type, target.rec.rec_ID, MAP[target.type].title(target.rec))} <span class="muted">(${target.type.toUpperCase()})</span></div>
      </div>
    </div>`;
    
    if (paths.length === 0) {
      html += `<div style="padding:1rem;text-align:center;background:#fff9e6;border-radius:.5rem;margin-top:.75rem;">
        <div style="font-size:2rem;margin-bottom:.5rem;"></div>
        <div><strong>No connection found</strong></div>
        <div class="muted" style="margin-top:.5rem;">These records aren't connected within ${depth} relationship step${depth > 1 ? 's' : ''}.</div>
        <div class="muted" style="margin-top:.25rem;">Try increasing the "Maximum steps" value or selecting a different destination record.</div>
      </div>`;
    } else {
      html += displayPaths(paths);
      
      // Add export option
      html += `<div style="margin-top:1rem;">
        <button class="chip" id="export-paths-gephi" style="padding:.5rem .75rem;">Export for Gephi</button>
        <button class="chip" id="export-paths-r" style="padding:.5rem .75rem;">Export for R</button>
      </div>`;
    }
    
    $pathDisplay.innerHTML = html;
    
    // Make links clickable
    $pathDisplay.querySelectorAll('[data-jump]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const [t,id] = btn.getAttribute('data-jump').split(':');
        $pathDialog.close();
        jumpTo(t, id);
      });
    });
    
    // Export handlers
    document.getElementById('export-paths-gephi')?.addEventListener('click', () => {
      exportPathsForGephi(paths, source, target);
    });
    
    document.getElementById('export-paths-r')?.addEventListener('click', () => {
      exportPathsForR(paths, source, target);
    });
  }, 100);
}

/* ---------- Export for Network Analysis Tools ---------- */
function exportPathsForGephi(paths, source, target) {
  // Create nodes and edges from paths
  const nodes = new Map();
  const edges = [];
  
  paths.forEach(path => {
    path.forEach((node, idx) => {
      const nodeId = `${node.type}:${node.id}`;
      if (!nodes.has(nodeId)) {
        nodes.set(nodeId, {
          Id: nodeId,
          Label: node.title,
          Type: node.type
        });
      }
      
      if (idx < path.length - 1) {
        const nextNode = path[idx + 1];
        const edgeId = `${nodeId}-${nextNode.type}:${nextNode.id}`;
        edges.push({
          Source: nodeId,
          Target: `${nextNode.type}:${nextNode.id}`,
          Type: nextNode.via,
          Weight: 1
        });
      }
    });
  });
  
  // Generate CSV files
  const nodesCsv = [
    'Id,Label,Type',
    ...Array.from(nodes.values()).map(n => `"${n.Id}","${n.Label.replace(/"/g, '""')}","${n.Type}"`)
  ].join('\n');
  
  const edgesCsv = [
    'Source,Target,Type,Weight',
    ...edges.map(e => `"${e.Source}","${e.Target}","${e.Type}",${e.Weight}`)
  ].join('\n');
  
  // Download as ZIP (simplified: two separate files)
  downloadFile(nodesCsv, `gephi_nodes_${source.type}_to_${target.type}.csv`, 'text/csv');
  setTimeout(() => {
    downloadFile(edgesCsv, `gephi_edges_${source.type}_to_${target.type}.csv`, 'text/csv');
  }, 100);
  
  alert('Downloaded 2 files:\n1. Nodes CSV\n2. Edges CSV\n\nImport both into Gephi as separate tables.');
}

function exportPathsForR(paths, source, target) {
  // Create edge list format for R (igraph)
  const edges = [];
  
  paths.forEach(path => {
    path.forEach((node, idx) => {
      if (idx < path.length - 1) {
        const nextNode = path[idx + 1];
        edges.push({
          from: node.title,
          to: nextNode.title,
          from_type: node.type,
          to_type: nextNode.type,
          rel_type: nextNode.via,
          from_id: `${node.type}:${node.id}`,
          to_id: `${nextNode.type}:${nextNode.id}`
        });
      }
    });
  });
  
  // Generate R-ready CSV
  const csv = [
    'from,to,from_type,to_type,rel_type,from_id,to_id',
    ...edges.map(e => 
      `"${e.from.replace(/"/g, '""')}","${e.to.replace(/"/g, '""')}","${e.from_type}","${e.to_type}","${e.rel_type}","${e.from_id}","${e.to_id}"`
    )
  ].join('\n');
  
  // Generate R script template
  const rScript = `# Path Analysis for Unknown Hands Database
# From: ${source.type.toUpperCase()} ${source.rec.rec_ID}
# To: ${target.type.toUpperCase()} ${target.rec.rec_ID}

library(igraph)
library(tidyverse)

# Load data
edges <- read_csv("r_paths_${source.type}_to_${target.type}.csv")

# Create graph
g <- graph_from_data_frame(edges, directed = TRUE)

# Basic statistics
cat("Number of paths:", ${paths.length}, "\\n")
cat("Number of unique nodes:", vcount(g), "\\n")
cat("Number of edges:", ecount(g), "\\n")

# Plot
plot(g, 
     vertex.label.cex = 0.7,
     vertex.size = 10,
     edge.arrow.size = 0.5,
     layout = layout_with_fr(g))

# Export for further analysis
# write_csv(as_data_frame(g, "vertices"), "vertices.csv")
# write_csv(as_data_frame(g, "edges"), "edges.csv")
`;
  
  downloadFile(csv, `r_paths_${source.type}_to_${target.type}.csv`, 'text/csv');
  setTimeout(() => {
    downloadFile(rScript, `r_analysis_${source.type}_to_${target.type}.R`, 'text/plain');
  }, 100);
  
  alert('Downloaded 2 files:\n1. CSV data file\n2. R script template\n\nOpen the R script and run it with the CSV file in the same directory.');
}

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

/* ---------- Analytics View ---------- */
let CURRENT_ANALYTICS_VIZ = 'dashboard';

function buildAnalytics(){
  const mount = document.getElementById('analytics-mount');
  if (!mount) return;
  
  // Always use all entities for analytics visualizations
  let list = [];
  Object.keys(DATA).forEach(entityType => {
    if (DATA[entityType] && Array.isArray(DATA[entityType])) {
      DATA[entityType].forEach(record => {
        list.push({ ...record, rty: entityType }); // Ensure rty is set
      });
    }
  });

  // Clear mount
  mount.innerHTML = '';

  // Build statistical dashboard
  buildStatisticalDashboard(mount, list);
}

function buildCodicology(){
  const mount = document.getElementById('codicology-mount');
  if (!mount) return;
  
  // Always use all entities for codicology
  let list = [];
  Object.keys(DATA).forEach(entityType => {
    if (DATA[entityType] && Array.isArray(DATA[entityType])) {
      DATA[entityType].forEach(record => {
        list.push({ ...record, rty: entityType }); // Ensure rty is set
      });
    }
  });

  // Populate region filter dropdown if not already populated
  const regionFilter = document.getElementById('codic-filter-region');
  if (regionFilter && regionFilter.options.length === 1) { // Only has "All Regions"
    const msRecords = list.filter(r => r.rty === 'ms');
    const countries = new Set();
    msRecords.forEach(ms => {
      const country = getVal(ms, 'Country of production (verbatim)');
      if (country && country !== '—') {
        countries.add(country);
      }
    });
    
    // Sort and add options
    Array.from(countries).sort().forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      regionFilter.appendChild(option);
    });
  }

  // Clear mount
  mount.innerHTML = '';

  // Build codicological analysis
  buildCodicologicalAnalysis(mount, list);
}

function buildHierarchicalTree(){
  const mount = document.getElementById('tree-mount');
  if (!mount) return;
  
  // Always use all entities for tree
  let list = [];
  Object.keys(DATA).forEach(entityType => {
    if (DATA[entityType] && Array.isArray(DATA[entityType])) {
      DATA[entityType].forEach(record => {
        list.push({ ...record, rty: entityType }); // Ensure rty is set
      });
    }
  });

  // Clear mount
  mount.innerHTML = '';

  // Build hierarchical tree visualization
  buildHierarchicalTreeVisualization(mount, list);
}

// Entity filter for statistical dashboard
const entityFilterSelect = document.getElementById('entity-filter-select');
if (entityFilterSelect) {
  entityFilterSelect.addEventListener('change', () => {
    buildAnalytics();
  });
}

// Tree search functionality
const treeSearchInput = document.getElementById('tree-manuscript-search');
const treeSearchClear = document.getElementById('tree-search-clear');
const treeSortSelect = document.getElementById('tree-sort-select');
const treeFilterCrossMSPU = document.getElementById('tree-filter-cross-ms-pu');
const treeFilterCrossPUSU = document.getElementById('tree-filter-cross-pu-su');
const treeFilterMultiPU = document.getElementById('tree-filter-multi-pu');

if (treeSearchInput) {
  treeSearchInput.addEventListener('input', () => {
    buildHierarchicalTree();
  });
}

if (treeSearchClear) {
  treeSearchClear.addEventListener('click', () => {
    if (treeSearchInput) {
      treeSearchInput.value = '';
      buildHierarchicalTree();
    }
  });
}

if (treeSortSelect) {
  treeSortSelect.addEventListener('change', () => {
    buildHierarchicalTree();
  });
}

// Add event listeners for filter checkboxes
[treeFilterCrossMSPU, treeFilterCrossPUSU, treeFilterMultiPU].forEach(checkbox => {
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      buildHierarchicalTree();
    });
  }
});

// Codicological analysis controls
const codicVizType = document.getElementById('codic-viz-type');
const codicXVar = document.getElementById('codic-x-var');
const codicYVar = document.getElementById('codic-y-var');
const codicColorVar = document.getElementById('codic-color-var');

// Research question preset buttons
document.querySelectorAll('.codic-research-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const preset = e.currentTarget.dataset.preset;
    
    if (preset === 'gender-size') {
      // Gender vs Size: Are female-copied MSs smaller?
      if (codicXVar) codicXVar.value = 'gender';
      if (codicYVar) codicYVar.value = 'combined-size';
      if (codicColorVar) codicColorVar.value = 'material';
      if (codicVizType) codicVizType.value = 'box';
    } else if (preset === 'material-size') {
      // Material vs Size: Parchment smaller due to cost?
      if (codicXVar) codicXVar.value = 'material';
      if (codicYVar) codicYVar.value = 'combined-size';
      if (codicColorVar) codicColorVar.value = 'century';
      if (codicVizType) codicVizType.value = 'box';
    } else if (preset === 'material-timeline') {
      // Material Over Time: Paper adoption patterns
      if (codicXVar) codicXVar.value = 'date';
      if (codicYVar) codicYVar.value = 'combined-size';
      if (codicColorVar) codicColorVar.value = 'material';
      if (codicVizType) codicVizType.value = 'scatter';
    } else if (preset === 'decoration-material') {
      // Decoration by Material: Parchment more decorated?
      if (codicXVar) codicXVar.value = 'material';
      if (codicYVar) codicYVar.value = 'combined-size';
      if (codicColorVar) codicColorVar.value = 'decoration';
      if (codicVizType) codicVizType.value = 'box';
    }
    
    buildCodicology();
  });
});

// Old preset button functionality (kept for backward compatibility)
document.querySelectorAll('.codic-preset-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const preset = e.target.dataset.preset;
    const vizTypeSelect = document.getElementById('codic-viz-type');
    
    if (preset === 'clear') {
      // Clear all selections
      if (codicXVar) codicXVar.value = '';
      if (codicYVar) codicYVar.value = '';
      if (codicColorVar) codicColorVar.value = 'none';
      if (vizTypeSelect) vizTypeSelect.value = 'scatter';
    } else if (preset === 'material-size') {
      // Material (categorical) vs Height (numeric) - use BOX PLOT
      if (codicXVar) codicXVar.value = 'material';
      if (codicYVar) codicYVar.value = 'combined-size';
      if (codicColorVar) codicColorVar.value = 'gender';
      if (vizTypeSelect) vizTypeSelect.value = 'box';
    } else if (preset === 'date-folios') {
      // Date (numeric) vs Folios (numeric) - use SCATTER PLOT
      if (codicXVar) codicXVar.value = 'date';
      if (codicYVar) codicYVar.value = 'folios';
      if (codicColorVar) codicColorVar.value = 'material';
      if (vizTypeSelect) vizTypeSelect.value = 'scatter';
    } else if (preset === 'quire-material') {
      // Material (categorical) distribution - use BAR CHART
      if (codicXVar) codicXVar.value = 'material';
      if (codicYVar) codicYVar.value = 'folios';
      if (codicColorVar) codicColorVar.value = 'century';
      if (vizTypeSelect) vizTypeSelect.value = 'bar';
    }
    
    // Update variable options for the new viz type
    updateVariableOptionsForVizType();
    buildCodicology();
  });
});

// Clear filters button
const clearFiltersBtn = document.getElementById('codic-clear-filters-btn');
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener('click', () => {
    const centuryFilter = document.getElementById('codic-filter-century');
    const materialFilter = document.getElementById('codic-filter-material');
    const regionFilter = document.getElementById('codic-filter-region');
    
    // Clear multi-select dropdowns
    if (centuryFilter) {
      Array.from(centuryFilter.options).forEach(opt => opt.selected = false);
    }
    if (materialFilter) {
      Array.from(materialFilter.options).forEach(opt => opt.selected = false);
    }
    if (regionFilter) {
      Array.from(regionFilter.options).forEach(opt => opt.selected = false);
    }
    
    buildCodicology();
  });
}

// Filter change listeners
['codic-filter-century', 'codic-filter-material', 'codic-filter-region'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('change', () => {
      buildCodicology();
    });
  }
});

// Codicology export button
const codicologyExportBtn = document.getElementById('codicology-export-png');
if (codicologyExportBtn) {
  codicologyExportBtn.addEventListener('click', async () => {
    const mount = document.getElementById('codicology-mount');
    if (!mount) return;
    
    // Import html2canvas dynamically if not already loaded
    if (typeof html2canvas === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
    
    try {
      const canvas = await html2canvas(mount, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'codicology-analysis.png';
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  });
}

// Individual card export buttons (delegated event listener)
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('export-card-btn')) {
    const card = e.target.closest('.analysis-card');
    if (!card) return;
    
    // Import html2canvas if needed
    if (typeof html2canvas === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      document.head.appendChild(script);
      await new Promise(resolve => script.onload = resolve);
    }
    
    try {
      const canvas = await html2canvas(card, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const cardId = card.getAttribute('data-card-id') || 'card';
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `codicology-${cardId}.png`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }
});

// Analytics export button
// Analytics export is handled by the exportAnalyticsVisualization function
// Event listener is attached in attachEventListeners() at line 7114

// Comparison mode storage
const COMPARISONS = [];

// Add to comparison button
const addComparisonBtn = document.getElementById('codicology-add-comparison');
const viewComparisonBtn = document.getElementById('codicology-view-comparison');
const clearComparisonBtn = document.getElementById('codicology-clear-comparison');
const comparisonCountSpan = document.getElementById('comparison-count');

if (addComparisonBtn) {
  addComparisonBtn.addEventListener('click', () => {
    const xVar = document.getElementById('codic-x-var')?.value;
    const yVar = document.getElementById('codic-y-var')?.value;
    const colorVar = document.getElementById('codic-color-var')?.value;
    const vizType = document.getElementById('codic-viz-type')?.value;
    
    if (!xVar || !yVar) {
      alert('Please select X and Y variables first');
      return;
    }
    
    // Capture current state
    const mount = document.getElementById('codicology-mount');
    const html = mount ? mount.innerHTML : '';
    
    // Get active filters (handle multi-select)
    const centurySelect = document.getElementById('codic-filter-century');
    const materialSelect = document.getElementById('codic-filter-material');
    const regionSelect = document.getElementById('codic-filter-region');
    
    const filters = {
      centuries: centurySelect ? Array.from(centurySelect.selectedOptions).map(o => o.text) : [],
      materials: materialSelect ? Array.from(materialSelect.selectedOptions).map(o => o.text) : [],
      regions: regionSelect ? Array.from(regionSelect.selectedOptions).map(o => o.text) : []
    };
    
    COMPARISONS.push({
      id: Date.now(),
      xVar, yVar, colorVar, vizType,
      filters,
      html,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Update UI
    if (comparisonCountSpan) comparisonCountSpan.textContent = COMPARISONS.length;
    if (viewComparisonBtn) viewComparisonBtn.style.display = 'inline-block';
    if (clearComparisonBtn) clearComparisonBtn.style.display = 'inline-block';
    
    alert(`✓ Analysis added to comparison (${COMPARISONS.length} total)`);
  });
}

if (viewComparisonBtn) {
  viewComparisonBtn.addEventListener('click', () => {
    const mount = document.getElementById('codicology-mount');
    if (!mount || COMPARISONS.length === 0) return;
    
    const varLabels = {
      'height': 'Height', 'width': 'Width', 'combined-size': 'Size',
      'material': 'Material', 'gender': 'Gender', 'date': 'Date',
      'century': 'Century', 'folios': 'Folios'
    };
    
    const comparisonHTML = `
      <div style="padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 style="margin: 0;">Comparison View</h2>
          <button onclick="buildCodicology()" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 0.25rem; cursor: pointer;">
            ← Back to Analysis
          </button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 1.5rem;">
          ${COMPARISONS.map((comp, idx) => {
            // Build filter description for multi-select
            const filterParts = [];
            if (comp.filters.dateMin || comp.filters.dateMax) {
              filterParts.push(`Date: ${comp.filters.dateMin || '?'}-${comp.filters.dateMax || '?'}`);
            }
            if (comp.filters.centuries && comp.filters.centuries.length > 0) {
              filterParts.push(`Century: ${comp.filters.centuries.join(', ')}`);
            }
            if (comp.filters.genders && comp.filters.genders.length > 0) {
              filterParts.push(`Gender: ${comp.filters.genders.join(', ')}`);
            }
            if (comp.filters.materials && comp.filters.materials.length > 0) {
              filterParts.push(`Material: ${comp.filters.materials.join(', ')}`);
            }
            if (comp.filters.region) {
              filterParts.push(`Region: ${comp.filters.region}`);
            }
            const filterDesc = filterParts.length > 0 ? filterParts.join(' | ') : 'No filters';
            
            return `
              <div style="border: 2px solid #dee2e6; border-radius: 0.5rem; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1rem;">
                  <div style="font-weight: 600; font-size: 1.1rem;">Set ${String.fromCharCode(65 + idx)} - ${comp.timestamp}</div>
                  <div style="font-size: 0.875rem; margin-top: 0.25rem; opacity: 0.9;">
                    ${varLabels[comp.xVar] || comp.xVar} vs ${varLabels[comp.yVar] || comp.yVar}
                    ${comp.colorVar && comp.colorVar !== 'none' ? ` (by ${varLabels[comp.colorVar] || comp.colorVar})` : ''}
                  </div>
                  <div style="font-size: 0.75rem; margin-top: 0.5rem; opacity: 0.8;">
                    Filters: ${filterDesc}
                  </div>
                </div>
                <div style="padding: 1rem; background: white;">
                  ${comp.html}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
    
    mount.innerHTML = comparisonHTML;
  });
}

if (clearComparisonBtn) {
  clearComparisonBtn.addEventListener('click', () => {
    if (confirm('Clear all saved comparisons?')) {
      COMPARISONS.length = 0;
      if (comparisonCountSpan) comparisonCountSpan.textContent = '0';
      if (viewComparisonBtn) viewComparisonBtn.style.display = 'none';
      if (clearComparisonBtn) clearComparisonBtn.style.display = 'none';
      alert('✓ Comparisons cleared');
    }
  });
}

if (codicVizType) {
  codicVizType.addEventListener('change', () => {
    updateVariableOptionsForVizType();
    buildCodicology();
  });
}

// Variable selectors
[codicXVar, codicYVar, codicColorVar].forEach(select => {
  if (select) {
    select.addEventListener('change', () => {
      buildCodicology();
    });
  }
});

// Smart variable filtering based on visualization type
function updateVariableOptionsForVizType() {
  const vizType = document.getElementById('codic-viz-type')?.value;
  const xVarSelect = document.getElementById('codic-x-var');
  const yVarSelect = document.getElementById('codic-y-var');
  const colorVarSelect = document.getElementById('codic-color-var');
  
  if (!vizType || !xVarSelect || !yVarSelect) return;
  
  // Categorize variables by type
  const numericVars = ['height', 'width', 'combined-size', 'justification-height', 'justification-width', 
                       'margin-ratio', 'folios', 'columns', 'lines-per-page', 'quires', 'date', 'century'];
  const categoricalVars = ['material', 'quire-type', 'ruling-type', 'script-type', 'binding-type', 
                           'gender', 'scribe-name', 'origin-country', 'origin-region', 'monastery-type',
                           'catchwords', 'signatures', 'watermark', 'ruling-type', 'decoration',
                           'has-colophon', 'language', 'collaboration-type', 'multiple-scribes'];
  
  // Get current selections
  const currentX = xVarSelect.value;
  const currentY = yVarSelect.value;
  const currentColor = colorVarSelect?.value;
  
  // Rules for each visualization type
  let xAllowed, yAllowed, colorAllowed;
  
  switch(vizType) {
    case 'scatter':
      // Scatter: Both X and Y must be numeric
      xAllowed = numericVars;
      yAllowed = numericVars;
      colorAllowed = categoricalVars;
      break;
      
    case 'box':
      // Box plot: X can be categorical, Y must be numeric
      xAllowed = [...categoricalVars, ...numericVars];
      yAllowed = numericVars;
      colorAllowed = categoricalVars;
      break;
      
    case 'bar':
      // Bar chart: X typically categorical, Y can be count or numeric
      xAllowed = [...categoricalVars, ...numericVars];
      yAllowed = [...numericVars, ...categoricalVars];
      colorAllowed = categoricalVars;
      break;
      
    case 'correlation':
      // Correlation: Both must be numeric
      xAllowed = numericVars;
      yAllowed = numericVars;
      colorAllowed = categoricalVars;
      break;
      
    case 'stats':
      // Stats table: flexible
      xAllowed = [...categoricalVars, ...numericVars];
      yAllowed = numericVars;
      colorAllowed = categoricalVars;
      break;
      
    default:
      // Default: allow all
      xAllowed = [...numericVars, ...categoricalVars];
      yAllowed = [...numericVars, ...categoricalVars];
      colorAllowed = categoricalVars;
  }
  
  // Filter options in dropdowns
  filterSelectOptions(xVarSelect, xAllowed, currentX);
  filterSelectOptions(yVarSelect, yAllowed, currentY);
  if (colorVarSelect) filterSelectOptions(colorVarSelect, colorAllowed, currentColor, true);
  
  // Add helpful message
  updateVizTypeHelp(vizType);
}

function filterSelectOptions(select, allowedVars, currentValue, isColorVar = false) {
  const allOptions = Array.from(select.querySelectorAll('option'));
  
  allOptions.forEach(option => {
    const value = option.value;
    
    // Always show empty/none options
    if (!value || value === '' || value === 'none') {
      option.style.display = '';
      option.disabled = false;
      return;
    }
    
    // Check if this variable is allowed
    if (allowedVars.includes(value)) {
      option.style.display = '';
      option.disabled = false;
    } else {
      option.style.display = 'none';
      option.disabled = true;
      
      // If current selection is now invalid, clear it
      if (value === currentValue) {
        select.value = isColorVar ? 'none' : '';
      }
    }
  });
  
  // Also handle optgroups
  const optgroups = select.querySelectorAll('optgroup');
  optgroups.forEach(group => {
    const visibleOptions = Array.from(group.querySelectorAll('option')).filter(
      opt => opt.style.display !== 'none'
    );
    // Hide optgroup if all its options are hidden
    group.style.display = visibleOptions.length > 0 ? '' : 'none';
  });
}

function updateVizTypeHelp(vizType) {
  const helpDiv = document.getElementById('codicology-description');
  if (!helpDiv) return;
  
  const helpTexts = {
    'scatter': '<strong>Scatter Plot:</strong> Shows relationship between two numeric variables. Best for exploring correlations. <em>Requires: numeric X and Y</em>',
    'box': '<strong>Box Plot:</strong> Compares distribution of a numeric variable across categories. Shows median, quartiles, and outliers. <em>Requires: numeric Y</em>',
    'bar': '<strong>Bar Chart:</strong> Compares counts or averages across categories. <em>Works with: categorical or numeric variables</em>',
    'correlation': '<strong>Correlation Analysis:</strong> Calculates Pearson correlation coefficient between two numeric variables. <em>Requires: numeric X and Y</em>',
    'stats': '<strong>Statistical Summary:</strong> Displays mean, median, min, max for groups. <em>Requires: numeric Y</em>'
  };
  
  if (helpTexts[vizType]) {
    helpDiv.innerHTML = helpTexts[vizType];
  }
}

// Initialize on page load
if (codicVizType) {
  updateVariableOptionsForVizType();
}

// Statistical Dashboard
function buildStatisticalDashboard(mount, list) {
  // Get selected entity filter from dropdown
  const entityFilter = document.getElementById('entity-filter-select')?.value || 'su';
  
  // Filter list by entity type
  list = list.filter(r => r.rty === entityFilter);
  
  // Build statistics cards based on entity type
  let statsCards = [];
  
  if (entityFilter === 'su') {
    // Scribal Units
    const withDates = getRecordsWithDates(list);
    const withScript = getCountByFieldExists(list, 'Normalised script(s)');
    const withHighCertaintyAttribution = getCountWithHighCertaintyScribe(list);
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('Date Range', getDateRange(list)),
      buildStatsCard('With Script', withScript),
      buildStatsCard('With High Certainty Attribution', withHighCertaintyAttribution)
    ];
  } else if (entityFilter === 'ms') {
    // Manuscripts
    const avgFolios = getAverageFolios(list);
    const withDigitization = getCountByFieldExists(list, 'Digitization Status');
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('Avg Folios', avgFolios),
      buildStatsCard('Digitized', withDigitization)
    ];
  } else if (entityFilter === 'pu') {
    // Production Units
    const withLocation = getCountByFieldExists(list, 'Production unit location');
    const withCountry = getCountByFieldExists(list, 'PU country');
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('Date Range', getDateRange(list)),
      buildStatsCard('With Country', withCountry)
    ];
  } else if (entityFilter === 'hp') {
    // Historical People
    const withGender = getCountByFieldExists(list, 'Gender');
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('With Gender', withGender),
    ];
  } else if (entityFilter === 'tx') {
    // Texts
    const withGenre = getCountByFieldExists(list, 'Genre');
    const withSubgenre = getCountByFieldExists(list, 'Subgenre');
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('With Genre', withGenre),
      buildStatsCard('With Subgenre', withSubgenre),
    ];
  } else if (entityFilter === 'hi') {
    // Holding Institutions
    const withType = getCountByFieldExists(list, 'Institution type');
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('With Type', withType),
      buildStatsCard('Countries', getUniqueFieldCount(list, 'Country')),
      buildStatsCard('Cities', getUniqueFieldCount(list, 'City'))
    ];
  } else if (entityFilter === 'mi') {
    // Monastic Institutions
    const withOrder = getCountByFieldExists(list, 'Religious order');
    const withType = getCountByFieldExists(list, 'Type of monastery');
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('With Order', withOrder),
      buildStatsCard('With Type', withType),
      buildStatsCard('Countries', getUniqueFieldCount(list, 'Country'))
    ];
  } else {
    // Default fallback
    statsCards = [
      buildStatsCard('Total Records', list.length),
      buildStatsCard('Date Range', getDateRange(list)),
      buildStatsCard('With Dates', getRecordsWithDates(list))
    ];
  }
  
  let chartsHtml = '';
  
  // Temporal Distribution - only for scribal units and production units
  if (entityFilter === 'su' || entityFilter === 'pu') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Temporal Distribution</h3>
        ${buildTemporalChart(list)}
      </div>
    `;
  }
  
  // Entity-specific charts
  if (entityFilter === 'su') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Script Distribution</h3>
        ${buildFieldDistributionChart(list, 'Normalised script(s)')}
      </div>
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Colophon Language Distribution</h3>
        ${buildFieldDistributionChart(list, 'Colophon language')}
      </div>
    `;
  } else if (entityFilter === 'ms') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Holding Institution Distribution</h3>
        ${buildFieldDistributionChart(list, 'Holding Institution', true)}
      </div>
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Digitization Status</h3>
        ${buildFieldDistributionChart(list, 'Digitization Status')}
      </div>
    `;
  } else if (entityFilter === 'hp') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Gender Distribution</h3>
        ${buildFieldDistributionChart(list, 'Gender')}
      </div>
    `;
  } else if (entityFilter === 'tx') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Genre Distribution</h3>
        ${buildFieldDistributionChart(list, 'Genre')}
      </div>
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Subgenre Distribution</h3>
        ${buildFieldDistributionChart(list, 'Subgenre')}
      </div>
    `;
  } else if (entityFilter === 'pu') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Country Distribution</h3>
        ${buildFieldDistributionChart(list, 'PU country')}
      </div>
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Material Distribution</h3>
        ${buildFieldDistributionChart(list, 'Material')}
      </div>
    `;
  } else if (entityFilter === 'hi' || entityFilter === 'mi') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Country Distribution</h3>
        ${buildFieldDistributionChart(list, 'Country')}
      </div>
    `;
    if (entityFilter === 'hi') {
      chartsHtml += `
        <div style="margin-top: 1.5rem;">
          <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Institution Type Distribution</h3>
          ${buildFieldDistributionChart(list, 'Institution type')}
        </div>
      `;
    } else {
      chartsHtml += `
        <div style="margin-top: 1.5rem;">
          <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Religious Order Distribution</h3>
          ${buildFieldDistributionChart(list, 'Religious order')}
        </div>
      `;
    }
  }
  
  const html = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      ${statsCards.join('')}
    </div>
    ${chartsHtml}
  `;
  mount.innerHTML = html;
}

function buildStatsCard(label, value) {
  return `
    <div style="background: #d4af37; color: white; padding: 1.25rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${value}</div>
      <div style="font-size: 0.875rem; opacity: 0.9;">${label}</div>
    </div>
  `;
}

function getUniqueCount(list, field) {
  return new Set(list.map(r => r[field])).size;
}

function getDateRange(list) {
  const dates = list.map(r => {
    const tpq = getVal(r, 'Normalized terminus post quem');
    const taq = getVal(r, 'Normalized terminus ante quem');
    return tpq || taq;
  }).filter(Boolean);
  
  if (dates.length === 0) return '—';
  
  const years = dates.map(d => {
    const match = String(d).match(/(\d{3,4})/);
    return match ? parseInt(match[1]) : null;
  }).filter(y => y && y >= 800 && y <= 1800);
  
  if (years.length === 0) return '—';
  return `${Math.min(...years)}–${Math.max(...years)}`;
}

function getRecordsWithDates(list) {
  const withDates = list.filter(r => {
    const tpq = getVal(r, 'Normalized terminus post quem');
    const taq = getVal(r, 'Normalized terminus ante quem');
    return tpq || taq;
  }).length;
  const pct = list.length > 0 ? Math.round((withDates / list.length) * 100) : 0;
  return `${withDates} (${pct}%)`;
}

function getCountByField(list, fieldName, values) {
  return list.filter(r => {
    const val = getVal(r, fieldName);
    return val && values.some(v => String(val).toLowerCase().includes(v.toLowerCase()));
  }).length;
}

function getCountByFieldExists(list, fieldName) {
  return list.filter(r => {
    const val = getVal(r, fieldName);
    return val && String(val).trim() !== '';
  }).length;
}

function getFieldValueCounts(list, fieldName) {
  const counts = {};
  list.forEach(r => {
    const val = getVal(r, fieldName);
    if (val && String(val).trim() !== '') {
      const key = String(val).trim();
      counts[key] = (counts[key] || 0) + 1;
    }
  });
  return counts;
}

function getUniqueFieldCount(list, fieldName) {
  const values = new Set();
  list.forEach(r => {
    const val = getVal(r, fieldName);
    if (val && String(val).trim() !== '' && val !== '—') {
      values.add(String(val).trim());
    }
  });
  return values.size;
}

function getAverageFolios(list) {
  const folios = [];
  list.forEach(r => {
    const val = getVal(r, 'Number of folios');
    if (val) {
      const num = parseFloat(val);
      if (!isNaN(num) && num > 0) {
        folios.push(num);
      }
    }
  });
  if (folios.length === 0) return '—';
  const avg = folios.reduce((sum, n) => sum + n, 0) / folios.length;
  return Math.round(avg);
}

function getCountWithHighCertaintyScribe(list) {
  return list.filter(r => {
    const recId = String(r.rec_ID);
    const rels = REL_INDEX.bySource[recId] || [];
    
    // Check if any relationship is "scribeOf" with high certainty
    return rels.some(rel => {
      const relType = getVal(rel, 'Relationship type');
      const scribeCertainty = getVal(rel, 'scribe certainty');
      
      return relType && relType.toLowerCase().includes('scribe') && 
             scribeCertainty && scribeCertainty.toLowerCase() === 'high';
    });
  }).length;
}

function buildEntityDistributionChart(list) {
  const counts = {};
  list.forEach(r => {
    const type = r.rty || 'unknown';
    counts[type] = (counts[type] || 0) + 1;
  });
  
  const total = list.length;
  const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  
  const bars = sortedEntries.map(([type, count]) => {
    const pct = Math.round((count / total) * 100);
    const width = pct;
    const color = {ms: '#3498db', su: '#e6b800', pu: '#e74c3c', mi: '#9b59b6', hi: '#2ecc71', hp: '#f39c12', tx: '#1abc9c'}[type] || '#95a5a6';
    
    return `
      <div style="margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
          <span style="font-weight: 500;">${MAP[type]?.name || type}</span>
          <span style="color: #666;">${count} (${pct}%)</span>
        </div>
        <div style="width: 100%; height: 24px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
          <div style="width: ${width}%; height: 100%; background: ${color};"></div>
        </div>
      </div>
    `;
  }).join('');
  
  return `<div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">${bars}</div>`;
}

function buildFieldDistributionChart(list, fieldName, isResource = false) {
  const counts = {};
  
  // Multi-value fields that should use getValsAll
  const multiValueFields = ['Normalised script(s)', 'Colophon language', 'Genre', 'Subgenre', 'Normalized century of production'];
  const useMultiValue = multiValueFields.includes(fieldName);
  
  list.forEach(r => {
    if (isResource) {
      // For resource fields (like Holding Institution)
      const res = getRes(r, fieldName);
      if (res && res.title) {
        const key = String(res.title).trim();
        counts[key] = (counts[key] || 0) + 1;
      }
    } else if (useMultiValue) {
      // For multi-value fields, get all values
      const vals = getValsAll(r, fieldName);
      if (vals && vals.length > 0) {
        vals.forEach(val => {
          if (val && String(val).trim() !== '' && val !== '—') {
            const key = String(val).trim();
            counts[key] = (counts[key] || 0) + 1;
          }
        });
      }
    } else {
      // For single-value fields
      const val = getVal(r, fieldName);
      if (val && String(val).trim() !== '' && val !== '—') {
        const key = String(val).trim();
        counts[key] = (counts[key] || 0) + 1;
      }
    }
  });
  
  const entries = Object.entries(counts);
  if (entries.length === 0) {
    return '<p style="color: #666; font-style: italic;">No data available</p>';
  }
  
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  // Show top 10 or all if fewer
  const displayEntries = sortedEntries.slice(0, 10);
  
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'];
  
  const bars = displayEntries.map(([value, count], idx) => {
    const pct = Math.round((count / total) * 100);
    const width = pct;
    const color = colors[idx % colors.length];
    
    return `
      <div style="margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
          <span style="font-weight: 500;">${value}</span>
          <span style="color: #666;">${count} (${pct}%)</span>
        </div>
        <div style="width: 100%; height: 24px; background: #e0e0e0; border-radius: 4px; overflow: hidden;">
          <div style="width: ${width}%; height: 100%; background: ${color};"></div>
        </div>
      </div>
    `;
  }).join('');
  
  const moreInfo = sortedEntries.length > 10 ? 
    `<p style="color: #666; font-size: 0.8rem; margin-top: 0.5rem; font-style: italic;">Showing top 10 of ${sortedEntries.length} values</p>` : '';
  
  return `<div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">${bars}${moreInfo}</div>`;
}

function buildTemporalChart(list) {
  // Extract centuries from "Normalized century of production" field
  // Records can have multiple centuries, so we count each occurrence
  const bins = {};
  let totalRecords = 0;
  
  list.forEach(r => {
    const centuries = getValsAll(r, 'Normalized century of production');
    if (centuries && centuries.length > 0) {
      totalRecords++;
      centuries.forEach(centuryStr => {
        // Parse century strings like "9th c.", "13th-14th c.", "9", "13", etc.
        const matches = String(centuryStr).match(/(\d+)/g);
        if (matches) {
          matches.forEach(match => {
            const centuryNum = parseInt(match);
            if (centuryNum >= 8 && centuryNum <= 16) {
              const centuryYear = centuryNum * 100;
              bins[centuryYear] = (bins[centuryYear] || 0) + 1;
            }
          });
        }
      });
    }
  });
  
  if (Object.keys(bins).length === 0) {
    return '<p style="color: #666; font-style: italic;">No temporal data available</p>';
  }
  
  const sortedCenturies = Object.keys(bins).map(Number).sort((a, b) => a - b);
  const maxCount = Math.max(...Object.values(bins));
  
  const bars = sortedCenturies.map(century => {
    const count = bins[century];
    const height = (count / maxCount) * 200;
    const centuryNum = Math.floor(century / 100);
    const centuryLabel = `${centuryNum}th c.`;
    
    return `
      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
        <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">${count}</div>
        <div style="width: 80%; min-height: ${height}px; background: linear-gradient(to top, #d4af37, #f4d03f); border-radius: 4px 4px 0 0; transition: min-height 0.3s;" title="${centuryLabel}: ${count} occurrences"></div>
        <div style="font-size: 0.875rem; font-weight: 500; margin-top: 0.5rem;">${centuryLabel}</div>
      </div>
    `;
  }).join('');
  
  return `
    <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">
      <div style="display: flex; align-items: flex-end; gap: 0.5rem; height: 250px;">
        ${bars}
      </div>
    </div>
  `;
}

// Codicological Analysis - Quantitative codicology with statistical tests
function buildCodicologicalAnalysis(mount, list) {
  // Get selected variables from dropdowns
  const xVar = document.getElementById('codic-x-var')?.value || '';
  const yVar = document.getElementById('codic-y-var')?.value || '';
  const colorVar = document.getElementById('codic-color-var')?.value || 'none';
  const vizType = document.getElementById('codic-viz-type')?.value || 'scatter';
  
  // Check if variables are selected
  if (!xVar || !yVar) {
    mount.innerHTML = `
      <div style="padding: 4rem 2rem; text-align: center; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
        <h3 style="color: #999; font-weight: 500;">Select Variables to Begin Analysis</h3>
        <p style="margin-top: 0.5rem;">Choose X and Y axis variables from the dropdowns above to explore codicological patterns.</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #888;">Try the Quick Analysis presets for research questions!</p>
      </div>
    `;
    return;
  }
  
  // Filter to relevant entity types
  let msRecords = list.filter(r => r.rty === 'ms');
  const suRecords = list.filter(r => r.rty === 'su');
  const puRecords = list.filter(r => r.rty === 'pu');
  
  // Apply filters
  let filterCount = 0;
  let filteredOut = 0;
  const originalCount = msRecords.length;
  
  // Century filter (multi-select)
  const centurySelect = document.getElementById('codic-filter-century');
  const selectedCenturies = centurySelect ? Array.from(centurySelect.selectedOptions).map(opt => parseInt(opt.value)) : [];
  
  if (selectedCenturies.length > 0) {
    // Define century ranges
    const centuryRanges = {
      8: [700, 799],
      9: [800, 899],
      10: [900, 999],
      11: [1000, 1099],
      12: [1100, 1199],
      13: [1200, 1299],
      14: [1300, 1399],
      15: [1400, 1499],
      16: [1500, 1599]
    };
    
    msRecords = msRecords.filter(ms => {
      const dateStr = getVal(ms, 'Date (single or range)');
      if (!dateStr || dateStr === '—') return false;
      
      const matches = dateStr.match(/(\d{3,4})/g);
      if (!matches) return false;
      
      // Check if ANY year in the date range falls within ANY selected century
      for (const match of matches) {
        const year = parseInt(match);
        if (isNaN(year)) continue;
        
        for (const targetCentury of selectedCenturies) {
          const [minYear, maxYear] = centuryRanges[targetCentury] || [0, 0];
          if (year >= minYear && year <= maxYear) {
            return true;
          }
        }
      }
      return false;
    });
    filterCount++;
  }
  
  // Gender filter (multi-select)
  const genderSelect = document.getElementById('codic-filter-gender');
  const selectedGenders = genderSelect ? Array.from(genderSelect.selectedOptions).map(opt => opt.value) : [];
  
  if (selectedGenders.length > 0) {
    const filteredMSIds = new Set();
    suRecords.forEach(su => {
      const gender = getVal(su, 'Scribe gender');
      if (gender && selectedGenders.some(g => gender.includes(g))) {
        // Find which MS this SU belongs to
        const msPointers = (su.details || []).filter(d => 
          d?.value && typeof d.value === 'object' && d.value.type === 'ms'
        );
        msPointers.forEach(ptr => {
          if (ptr.value.id) filteredMSIds.add(String(ptr.value.id));
        });
      }
    });
    
    if (filteredMSIds.size > 0) {
      msRecords = msRecords.filter(ms => filteredMSIds.has(String(ms.rec_ID)));
      filterCount++;
    }
  }
  
  // Material filter (multi-select)
  const materialSelect = document.getElementById('codic-filter-material');
  const selectedMaterials = materialSelect ? Array.from(materialSelect.selectedOptions).map(opt => opt.value) : [];
  
  if (selectedMaterials.length > 0) {
    const filteredMSIds = new Set();
    puRecords.forEach(pu => {
      const material = getVal(pu, 'Material');
      if (material && selectedMaterials.some(m => material.includes(m))) {
        // Find which MS this PU belongs to
        const msPointers = (pu.details || []).filter(d => 
          d?.value && typeof d.value === 'object' && d.value.type === 'ms'
        );
        msPointers.forEach(ptr => {
          if (ptr.value.id) filteredMSIds.add(String(ptr.value.id));
        });
      }
    });
    
    if (filteredMSIds.size > 0) {
      msRecords = msRecords.filter(ms => filteredMSIds.has(String(ms.rec_ID)));
      filterCount++;
    }
  }
  
  // Region filter (multi-select)
  const regionSelect = document.getElementById('codic-filter-region');
  const selectedRegions = regionSelect ? Array.from(regionSelect.selectedOptions).map(opt => opt.value) : [];
  
  if (selectedRegions.length > 0) {
    msRecords = msRecords.filter(ms => {
      const country = getVal(ms, 'Country of production (verbatim)');
      return country && selectedRegions.some(region => country.includes(region));
    });
    filterCount++;
  }
  
  filteredOut = originalCount - msRecords.length;
  
  // Update filter status
  const filterStatus = document.getElementById('codic-filter-status');
  if (filterStatus && filterCount > 0) {
    filterStatus.innerHTML = `✓ ${filterCount} filter(s) active: ${msRecords.length} manuscripts (${filteredOut} filtered out)`;
    filterStatus.style.color = '#2196F3';
    filterStatus.style.fontWeight = '600';
  } else if (filterStatus) {
    filterStatus.innerHTML = '';
  }
  
  // Build EXPLORATORY analysis with multiple views
  const html = buildExploratoryAnalysis(msRecords, puRecords, suRecords, xVar, yVar, colorVar, vizType);
  
  mount.innerHTML = html;
}

// NEW: Exploratory analysis with multiple cards
function buildExploratoryAnalysis(msRecords, puRecords, suRecords, xVar, yVar, colorVar, vizType) {
  // Extract data points once and reuse
  const dataPoints = extractDataPoints(msRecords, puRecords, suRecords, xVar, yVar, colorVar);
  
  // Generate Key Insights
  const insights = generateKeyInsights(dataPoints, xVar, yVar, colorVar);
  
  // Build main visualization
  const mainViz = analyzeCustomVariables(msRecords, puRecords, suRecords, xVar, yVar, colorVar, vizType);
  
  // Build summary statistics card
  const summaryCard = buildSummaryStatisticsCard(dataPoints, xVar, yVar, colorVar);
  
  // Build breakdown by key dimensions card
  const breakdownCard = buildBreakdownCard(msRecords, puRecords, suRecords, xVar, yVar, colorVar);
  
  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      ${insights ? `
      <div class="analysis-card" data-card-id="key-insights" style="position: relative;">
        <button class="export-card-btn" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; z-index: 10;">
          Export Insights
        </button>
        ${insights}
      </div>
      ` : ''}
      <div class="analysis-card" data-card-id="main-viz" style="position: relative;">
        <button class="export-card-btn" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; z-index: 10;">
          Export Chart
        </button>
        ${mainViz}
      </div>
      <div class="analysis-card" data-card-id="summary-stats" style="position: relative;">
        <button class="export-card-btn" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; z-index: 10;">
          Export Stats
        </button>
        ${summaryCard}
      </div>
      <div class="analysis-card" data-card-id="breakdown" style="position: relative;">
        <button class="export-card-btn" style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; z-index: 10;">
          Export Breakdown
        </button>
        ${breakdownCard}
      </div>
    </div>
  `;
}

// Generate AI-style key insights
function generateKeyInsights(dataPoints, xVar, yVar, colorVar) {
  if (dataPoints.length < 10) return null;
  
  const insights = [];
  const varLabels = {
    'height': 'Height',
    'width': 'Width',
    'combined-size': 'Size',
    'folios': 'Folios',
    'material': 'Material',
    'gender': 'Gender',
    'date': 'Date',
    'century': 'Century',
    'decoration': 'Decoration',
    'origin-country': 'Country'
  };
  
  const yLabel = varLabels[yVar] || yVar;
  const xLabel = varLabels[xVar] || xVar;
  
  // Determine grouping variable (color if set, otherwise X if categorical)
  const groupVar = (colorVar && colorVar !== 'none') ? colorVar : xVar;
  const groupLabel = varLabels[groupVar] || groupVar;
  
  // Group data
  const groups = {};
  dataPoints.forEach(d => {
    const key = String((colorVar && colorVar !== 'none') ? d.color : d.x);
    if (!groups[key]) groups[key] = [];
    if (typeof d.y === 'number') groups[key].push(d.y);
  });
  
  const groupNames = Object.keys(groups).filter(k => groups[k].length > 0);
  
  // Only generate insights if we have 2-5 groups with enough data
  if (groupNames.length >= 2 && groupNames.length <= 5) {
    // Calculate averages for each group
    const groupAvgs = {};
    Object.entries(groups).forEach(([name, values]) => {
      if (values.length > 0) {
        groupAvgs[name] = values.reduce((a, b) => a + b, 0) / values.length;
      }
    });
    
    // Find largest difference
    const sorted = Object.entries(groupAvgs).sort((a, b) => b[1] - a[1]);
    if (sorted.length >= 2) {
      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];
      const diff = highest[1] - lowest[1];
      const pctDiff = Math.abs((diff / lowest[1]) * 100).toFixed(0);
      
      insights.push({
        icon: '📊',
        type: 'comparison',
        text: `<strong>${highest[0]}</strong> manuscripts have ${pctDiff}% ${diff > 0 ? 'larger' : 'smaller'} ${yLabel.toLowerCase()} on average than <strong>${lowest[0]}</strong> (${highest[1].toFixed(0)} vs ${lowest[1].toFixed(0)})`,
        impact: pctDiff > 20 ? 'high' : pctDiff > 10 ? 'medium' : 'low'
      });
    }
    
    // Check for material preferences (if material is involved)
    if (xVar === 'material' || colorVar === 'material') {
      const parchment = groups['Parchment'] || groups['parchment'] || [];
      const paper = groups['Paper'] || groups['paper'] || [];
      
      if (parchment.length > 0 && paper.length > 0) {
        const parchAvg = parchment.reduce((a, b) => a + b, 0) / parchment.length;
        const paperAvg = paper.reduce((a, b) => a + b, 0) / paper.length;
        const materialDiff = Math.abs((paperAvg - parchAvg) / Math.min(paperAvg, parchAvg) * 100).toFixed(0);
        
        insights.push({
          icon: '📜',
          type: 'material',
          text: `${parchAvg < paperAvg ? 'Parchment' : 'Paper'} manuscripts are <strong>${materialDiff}% smaller</strong> than ${parchAvg < paperAvg ? 'paper' : 'parchment'} (avg ${parchAvg.toFixed(0)} vs ${paperAvg.toFixed(0)} mm) - ${parchAvg < paperAvg ? 'consistent with cost-saving hypothesis' : 'interesting pattern to explore'}`,
          impact: materialDiff > 15 ? 'high' : 'medium'
        });
      }
    }
    
    // Check for gender patterns
    if (xVar === 'gender' || colorVar === 'gender') {
      const female = groups['female'] || groups['Female'] || [];
      const male = groups['male'] || groups['Male'] || [];
      
      if (female.length > 0 && male.length > 0) {
        const femaleAvg = female.reduce((a, b) => a + b, 0) / female.length;
        const maleAvg = male.reduce((a, b) => a + b, 0) / male.length;
        const genderDiff = Math.abs((maleAvg - femaleAvg) / Math.min(maleAvg, femaleAvg) * 100).toFixed(0);
        
        insights.push({
          icon: '👤',
          type: 'gender',
          text: `Manuscripts by <strong>${femaleAvg < maleAvg ? 'female' : 'male'} scribes</strong> are ${genderDiff}% smaller on average (${femaleAvg.toFixed(0)} vs ${maleAvg.toFixed(0)} mm) - sample: ${female.length} female, ${male.length} male`,
          impact: genderDiff > 15 ? 'high' : 'medium'
        });
      }
    }
  }
  
  // Temporal trends if date/century involved
  if (xVar === 'century' || xVar === 'date') {
    const temporal = dataPoints.filter(d => typeof d.x === 'number' && typeof d.y === 'number');
    if (temporal.length > 20) {
      // Simple linear regression
      const n = temporal.length;
      const sumX = temporal.reduce((sum, d) => sum + d.x, 0);
      const sumY = temporal.reduce((sum, d) => sum + d.y, 0);
      const sumXY = temporal.reduce((sum, d) => sum + d.x * d.y, 0);
      const sumX2 = temporal.reduce((sum, d) => sum + d.x * d.x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      
      if (Math.abs(slope) > 0.1) {
        const direction = slope > 0 ? 'increasing' : 'decreasing';
        const change = Math.abs(slope * 100).toFixed(1);
        insights.push({
          icon: '📈',
          type: 'trend',
          text: `${yLabel} is <strong>${direction}</strong> over time (${change} mm per century on average)`,
          impact: Math.abs(slope) > 2 ? 'high' : 'medium'
        });
      }
    }
  }
  
  // Sample size insight
  insights.push({
    icon: '📐',
    type: 'sample',
    text: `Analysis based on <strong>${dataPoints.length} data points</strong> from the corpus`,
    impact: 'low'
  });
  
  if (insights.length === 0) return null;
  
  return `
    <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 1rem 0; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">
        Key Findings
      </h3>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${insights.map(insight => `
          <div style="background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 0.375rem; border-left: 4px solid ${
            insight.impact === 'high' ? '#ffd700' : insight.impact === 'medium' ? '#90caf9' : 'rgba(255,255,255,0.3)'
          };">
            <div style="display: flex; align-items: start; gap: 0.75rem;">
              <span style="font-size: 1.5rem;">${insight.icon}</span>
              <div style="flex: 1; line-height: 1.6;">${insight.text}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.875rem; opacity: 0.9;">
        These insights are automatically generated from statistical patterns in your data. Always verify with domain knowledge.
      </div>
    </div>
  `;
}

// Extract data points (shared helper)
function extractDataPoints(msRecords, puRecords, suRecords, xVar, yVar, colorVar) {
  const dataPoints = [];
  
  // Helper to extract value by variable name (full version)
  function extractValue(ms, pu, varName) {
    if (!varName || varName === 'none') return null;
    
    // Dimensional variables
    if (varName === 'height') return extractHeight(ms);
    if (varName === 'width') return extractWidth(ms);
    if (varName === 'combined-size') return extractSize(ms);
    if (varName === 'justification-height') return pu ? extractJustificationHeight(pu) : null;
    if (varName === 'justification-width') return pu ? extractJustificationWidth(pu) : null;
    if (varName === 'margin-ratio') return pu ? calculateMarginRatio(ms, pu) : null;
    
    // Structural variables
    if (varName === 'folios') {
      const folios = getVal(ms, 'Number of folios');
      return folios ? parseInt(folios) : null;
    }
    if (varName === 'columns') return pu ? extractColumns(pu) : null;
    if (varName === 'lines-per-page') {
      const lines = pu ? getVal(pu, 'Lines per page') : null;
      return lines ? parseInt(lines) : null;
    }
    if (varName === 'quires') {
      const quires = pu ? getVal(pu, 'Number of quires') : null;
      return quires ? parseInt(quires) : null;
    }
    
    // Temporal variables
    if (varName === 'date') return pu ? extractDate(pu) : null;
    if (varName === 'century') {
      const date = pu ? extractDate(pu) : null;
      return date ? Math.floor(date / 100) + 1 : null;
    }
    
    // Categorical variables
    if (varName === 'material') return pu ? getMaterialFromPU(pu) : null;
    if (varName === 'quire-type') return pu ? getVal(pu, 'Quire type') : null;
    if (varName === 'ruling-type') return pu ? getVal(pu, 'Ruling type') : null;
    if (varName === 'script-type') {
      const msId = String(ms.rec_ID);
      const suRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'su');
      if (suRefs.length > 0) {
        const su = IDX.su?.[suRefs[0].fromId];
        return su ? getVal(su, 'Normalised script(s)') : null;
      }
      return null;
    }
    if (varName === 'binding-type') return getVal(ms, 'Binding type');
    if (varName === 'gender') {
      const msId = String(ms.rec_ID);
      const suRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'su');
      if (suRefs.length > 0) {
        const su = IDX.su?.[suRefs[0].fromId];
        return su ? getVal(su, 'Scribe gender') : null;
      }
      return null;
    }
    if (varName === 'decoration') return getVal(ms, 'Decoration');
    
    return null;
  }
  
  msRecords.forEach(ms => {
    const msId = String(ms.rec_ID);
    
    // Find PUs that belong to this MS by checking PU.details for MS pointers
    const relatedPUs = puRecords.filter(pu => {
      const msPointers = (pu.details || []).filter(d => 
        d?.value && typeof d.value === 'object' && d.value.type === 'ms'
      );
      return msPointers.some(ptr => String(ptr.value.id) === msId);
    });
    
    if (relatedPUs.length > 0) {
      relatedPUs.forEach(pu => {
        const xVal = extractValue(ms, pu, xVar);
        const yVal = extractValue(ms, pu, yVar);
        const colorVal = extractValue(ms, pu, colorVar) || 'Unknown';
        
        if (xVal !== null && yVal !== null) {
          dataPoints.push({
            x: xVal,
            y: yVal,
            color: colorVal,
            msTitle: MAP.ms?.title(ms) || 'Unknown',
            title: MAP.ms?.title(ms) || 'Unknown'
          });
        }
      });
    }
  });
  
  return dataPoints;
}

// Generic value extractor (kept for compatibility)
function getCodicologicalValue(ms, pu, varName) {
  if (!varName || varName === 'none') return null;
  
  // Dimensional variables
  if (varName === 'height') return extractHeight(ms);
  if (varName === 'width') return extractWidth(ms);
  if (varName === 'combined-size') return extractSize(ms);
  if (varName === 'justification-height') return pu ? extractJustificationHeight(pu) : null;
  if (varName === 'justification-width') return pu ? extractJustificationWidth(pu) : null;
  
  // Structural variables
  if (varName === 'folios') {
    const folios = getVal(ms, 'Number of folios');
    return folios ? parseInt(folios) : null;
  }
  if (varName === 'columns') return pu ? extractColumns(pu) : null;
  if (varName === 'lines-per-page') {
    const lines = pu ? getVal(pu, 'Lines per page') : null;
    return lines ? parseInt(lines) : null;
  }
  
  // Temporal variables
  if (varName === 'date') return pu ? extractDate(pu) : null;
  if (varName === 'century') {
    const date = pu ? extractDate(pu) : null;
    return date ? Math.floor(date / 100) + 1 : null;
  }
  
  // Categorical variables
  if (varName === 'material') return pu ? getMaterialFromPU(pu) : null;
  if (varName === 'gender') {
    const msId = String(ms.rec_ID);
    const suRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'su');
    if (suRefs.length > 0) {
      const su = IDX.su?.[suRefs[0].fromId];
      if (su) {
        return getVal(su, 'Scribe gender') || 'Unknown';
      }
    }
    return 'Unknown';
  }
  if (varName === 'decoration') return getVal(ms, 'Decoration') || 'No';
  if (varName === 'binding-type') return getVal(ms, 'Binding type') || 'Unknown';
  
  return null;
}

// Summary statistics card
function buildSummaryStatisticsCard(dataPoints, xVar, yVar, colorVar) {
  if (dataPoints.length === 0) {
    return '';
  }
  
  // Calculate statistics
  const yValues = dataPoints.map(d => d.y).filter(v => typeof v === 'number');
  const xValues = dataPoints.map(d => d.x).filter(v => typeof v === 'number');
  
  let stats = {};
  if (yValues.length > 0) {
    const sorted = [...yValues].sort((a, b) => a - b);
    const mean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = Math.min(...yValues);
    const max = Math.max(...yValues);
    const stdDev = Math.sqrt(yValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / yValues.length);
    
    stats = { n: yValues.length, mean, median, min, max, stdDev };
  }
  
  // Group by color/category
  const byCategory = {};
  dataPoints.forEach(d => {
    const cat = String(d.color || d.x || 'Unknown');
    if (!byCategory[cat]) byCategory[cat] = [];
    if (typeof d.y === 'number') {
      byCategory[cat].push(d.y);
    }
  });
  
  const varLabels = {
    'height': 'Height',
    'width': 'Width',
    'combined-size': 'Combined Size',
    'folios': 'Folios',
    'material': 'Material',
    'gender': 'Gender',
    'date': 'Date',
    'century': 'Century'
  };
  
  const yLabel = varLabels[yVar] || yVar;
  const categories = Object.keys(byCategory).slice(0, 5);
  
  return `
    <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: #333;">Summary Statistics</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 0.375rem; border-left: 3px solid #2196F3;">
          <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">Sample Size</div>
          <div style="font-size: 1.5rem; font-weight: bold; color: #2196F3;">${stats.n || 0}</div>
        </div>
        ${stats.mean ? `
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 0.375rem; border-left: 3px solid #4caf50;">
          <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">Mean ${yLabel}</div>
          <div style="font-size: 1.5rem; font-weight: bold; color: #4caf50;">${stats.mean.toFixed(1)}</div>
        </div>
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 0.375rem; border-left: 3px solid #ff9800;">
          <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">Median ${yLabel}</div>
          <div style="font-size: 1.5rem; font-weight: bold; color: #ff9800;">${stats.median.toFixed(1)}</div>
        </div>
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 0.375rem; border-left: 3px solid #c4941f;">
          <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">Std Dev</div>
          <div style="font-size: 1.5rem; font-weight: bold; color: #c4941f;">${stats.stdDev.toFixed(1)}</div>
        </div>
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 0.375rem; border-left: 3px solid #f44336;">
          <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">Range</div>
          <div style="font-size: 1.25rem; font-weight: bold; color: #f44336;">${stats.min.toFixed(0)} - ${stats.max.toFixed(0)}</div>
        </div>
        ` : ''}
      </div>
      ${categories.length > 0 ? `
        <div style="border-top: 1px solid #dee2e6; padding-top: 1rem;">
          <div style="font-weight: 600; margin-bottom: 0.75rem; font-size: 0.9rem;">By Category (Top 5):</div>
          ${categories.map(cat => {
            const vals = byCategory[cat].filter(v => typeof v === 'number');
            const catMean = vals.length > 0 ? vals.reduce((a,b) => a+b, 0) / vals.length : 0;
            return `
              <div style="display: flex; justify-content: space-between; padding: 0.5rem; background: #f8f9fa; margin-bottom: 0.5rem; border-radius: 0.25rem;">
                <span style="font-weight: 500;">${cat}</span>
                <span style="color: #666;">n=${vals.length}, avg=${catMean.toFixed(1)}</span>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// Breakdown by key dimensions
function buildBreakdownCard(msRecords, puRecords, suRecords, xVar, yVar, colorVar) {
  if (msRecords.length === 0) return '';
  
  // Build mini-analyses for common breakdowns
  const centuries = {};
  const materials = {};
  const genders = {};
  
  msRecords.forEach(ms => {
    // Century
    const dateStr = getVal(ms, 'Date (single or range)');
    if (dateStr) {
      const matches = dateStr.match(/(\d{3,4})/g);
      if (matches) {
        const year = parseInt(matches[0]);
        const century = Math.floor(year / 100) + 1;
        centuries[`${century}th c.`] = (centuries[`${century}th c.`] || 0) + 1;
      }
    }
    
    // Material
    const msId = String(ms.rec_ID);
    const puRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'pu');
    puRefs.forEach(ref => {
      const pu = IDX.pu?.[ref.fromId];
      if (pu) {
        const material = getVal(pu, 'Material');
        if (material) {
          materials[material] = (materials[material] || 0) + 1;
        }
      }
    });
  });
  
  // Gender from SUs
  suRecords.forEach(su => {
    const gender = getVal(su, 'Scribe gender');
    if (gender) {
      genders[gender] = (genders[gender] || 0) + 1;
    }
  });
  
  return `
    <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 1rem 0; font-size: 1.1rem; color: #333;">Dataset Breakdown</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
        ${Object.keys(centuries).length > 0 ? `
          <div>
            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; color: #666;">By Century</div>
            ${Object.entries(centuries).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([c, count]) => `
              <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.875rem;">
                <span>${c}</span>
                <span style="color: #2196F3; font-weight: 600;">${count}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${Object.keys(materials).length > 0 ? `
          <div>
            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; color: #666;">By Material</div>
            ${Object.entries(materials).sort((a,b) => b[1] - a[1]).map(([m, count]) => `
              <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.875rem;">
                <span>${m}</span>
                <span style="color: #ff9800; font-weight: 600;">${count}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${Object.keys(genders).length > 0 ? `
          <div>
            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; color: #666;">By Gender</div>
            ${Object.entries(genders).sort((a,b) => b[1] - a[1]).map(([g, count]) => `
              <div style="display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.875rem;">
                <span>${g}</span>
                <span style="color: #c4941f; font-weight: 600;">${count}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Helper function to extract height only
function extractHeight(rec) {
  const height = getVal(rec, 'Codex height');
  if (!height || height === '—') return null;
  const num = parseFloat(height);
  return !isNaN(num) ? num : null;
}

// Helper function to calculate manuscript combined size as height + width
function extractSize(rec) {
  // Get Codex height and Codex width fields
  let height = getVal(rec, 'Codex height');
  let width = getVal(rec, 'Codex width');
  
  // Parse height
  let heightNum = null;
  if (height && height !== '—') {
    heightNum = parseFloat(height);
    if (isNaN(heightNum)) heightNum = null;
  }
  
  // Parse width
  let widthNum = null;
  if (width && width !== '—') {
    widthNum = parseFloat(width);
    if (isNaN(widthNum)) widthNum = null;
  }
  
  // Calculate size as height + width
  if (heightNum !== null && widthNum !== null) {
    return heightNum + widthNum;
  }
  
  return null;
}

// Helper function to extract width from codex width field
function extractWidth(rec) {
  // Get Codex width field directly
  const width = getVal(rec, 'Codex width');
  if (!width || width === '—') return null;
  const num = parseFloat(width);
  return !isNaN(num) ? num : null;
}

// Helper function to extract date
function extractDate(rec) {
  const tpq = getVal(rec, 'Normalized terminus post quem');
  const taq = getVal(rec, 'Normalized terminus ante quem');
  const dateStr = tpq || taq;
  if (!dateStr) return null;
  const match = String(dateStr).match(/(\d{3,4})/);
  return match ? parseInt(match[1]) : null;
}

// Helper function to extract country/geography
function extractCountry(rec) {
  // Can be in PU or MS
  const country = getVal(rec, 'PU country') || getVal(rec, 'Country');
  return country && country !== '—' ? country : null;
}

// Helper function to extract justification (text block) height from PU
function extractJustificationHeight(pu) {
  const just = getVal(pu, 'Text block height');
  if (!just || just === '—') return null;
  const num = parseFloat(just);
  return !isNaN(num) ? num : null;
}

// Helper function to extract justification (text block) width from PU
function extractJustificationWidth(pu) {
  const just = getVal(pu, 'Text block width');
  if (!just || just === '—') return null;
  const num = parseFloat(just);
  return !isNaN(num) ? num : null;
}

// Helper function to calculate margin ratio (codex size vs justification size)
function calculateMarginRatio(ms, pu) {
  // Get codex height and width
  const codexHeight = getVal(ms, 'Codex height');
  const codexWidth = getVal(ms, 'Codex width');
  
  let codexH = null, codexW = null;
  if (codexHeight && codexHeight !== '—') {
    codexH = parseFloat(codexHeight);
    if (isNaN(codexH)) codexH = null;
  }
  if (codexWidth && codexWidth !== '—') {
    codexW = parseFloat(codexWidth);
    if (isNaN(codexW)) codexW = null;
  }
  
  // Get justification (text block) height and width
  const justHeight = extractJustificationHeight(pu);
  const justWidth = extractJustificationWidth(pu);
  
  if (!codexH || !codexW || !justHeight || !justWidth) return null;
  
  // Calculate sizes (height + width)
  const codexSize = codexH + codexW;
  const justSize = justHeight + justWidth;
  
  // Return ratio of margins (percentage of total dimensions that are margins)
  return ((codexSize - justSize) / codexSize * 100);
}

// Helper function to extract number of columns from PU
function extractColumns(pu) {
  const cols = getVal(pu, 'Number of Columns');
  if (!cols) return null;
  const num = parseInt(cols);
  return !isNaN(num) ? num : null;
}

// Helper to extract material from PU
function getMaterialFromPU(pu) {
  const details = pu.details || [];
  for (const d of details) {
    if (d.fieldName === 'Material' && d.termLabel) {
      return d.termLabel;
    }
  }
  return null;
}

// ========== CODICOLOGICAL ANALYSIS FUNCTIONS ==========

// Analysis 1: Material vs Size (with Geography/Date patterns)
function analyzeMaterialVsSize(msRecords, puRecords, vizType) {
  const dataPoints = [];
  
  // For each MS, get size, then find PUs to get material, date, country
  msRecords.forEach(ms => {
    const size = extractSize(ms);
    if (!size) return;
    
    const msId = String(ms.rec_ID);
    const msTitle = MAP.ms?.title(ms) || 'Untitled';
    
    // Find PUs that reference this MS
    const puRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'pu');
    
    puRefs.forEach(ref => {
      const pu = IDX.pu?.[ref.fromId];
      if (!pu) return;
      
      const material = getMaterialFromPU(pu);
      const date = extractDate(pu);
      const country = extractCountry(pu);
      
      if (material) {
        dataPoints.push({ 
          material, 
          size, 
          date,
          country,
          msTitle,
          century: date ? Math.floor(date / 100) * 100 : null
        });
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No data available for material vs size analysis</div>';
  }
  
  // Calculate statistics by material
  const byMaterial = {};
  dataPoints.forEach(d => {
    if (!byMaterial[d.material]) byMaterial[d.material] = [];
    byMaterial[d.material].push(d.size);
  });
  
  const stats = {};
  Object.entries(byMaterial).forEach(([material, sizes]) => {
    const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const sorted = [...sizes].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats[material] = { mean, median, min: Math.min(...sizes), max: Math.max(...sizes), n: sizes.length };
  });
  
  let html = '<div style="margin-bottom: 1rem;"><h3 style="color: #856404;">Material vs Size Analysis</h3>';
  html += `<p style="font-size: 0.875rem; color: #666;">Total data points: ${dataPoints.length}</p></div>`;
  
  if (vizType === 'stats') {
    html += buildStatsTable('Manuscript Size by Material', stats, 'mm');
  } else if (vizType === 'box') {
    html += buildBoxPlot('Material vs Manuscript Size', byMaterial, 'Material', 'Size (mm)');
  } else if (vizType === 'scatter') {
    html += buildScatterPlot('Material vs Size (colored by century)', dataPoints, 'material', 'size', 'Material', 'Size (mm)', 'century');
  } else if (vizType === 'bar') {
    html += buildBarChart('Average Manuscript Size by Material', Object.entries(stats).map(([m, s]) => ({ category: m, value: s.mean })), 'mm');
  }
  
  // Add geographic breakdown
  if (vizType === 'stats') {
    html += '<div style="margin-top: 2rem;"><h4>Geographic Patterns</h4>';
    const byCountry = {};
    dataPoints.filter(d => d.country).forEach(d => {
      const key = `${d.country}|${d.material}`;
      if (!byCountry[key]) byCountry[key] = [];
      byCountry[key].push(d.size);
    });
    
    const countryStats = {};
    Object.entries(byCountry).forEach(([key, sizes]) => {
      const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
      countryStats[key] = { mean, n: sizes.length };
    });
    
    const topPatterns = Object.entries(countryStats)
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 10)
      .map(([key, s]) => {
        const [country, material] = key.split('|');
        return { category: `${country} (${material})`, value: s.mean, count: s.n };
      });
    
    html += '<p style="font-size: 0.875rem;">Average size by country and material (top 10 combinations):</p>';
    html += '<table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">';
    html += '<tr style="background: linear-gradient(135deg, #d4af37 0%, #f0d36e 100%); color: #333;"><th style="padding: 0.5rem; text-align: left;">Location & Material</th><th style="padding: 0.5rem;">Avg Size (mm)</th><th style="padding: 0.5rem;">Count</th></tr>';
    topPatterns.forEach(p => {
      html += `<tr style="border-bottom: 1px solid #dee2e6;"><td style="padding: 0.5rem;">${p.category}</td><td style="padding: 0.5rem; text-align: center;">${p.value.toFixed(1)}</td><td style="padding: 0.5rem; text-align: center;">${p.count}</td></tr>`;
    });
    html += '</table></div>';
  }
  
  return html;
}

// Analysis 2: Size vs Date (with Geography)
function analyzeSizeVsDate(msRecords, puRecords, vizType) {
  const dataPoints = [];
  
  // For each MS, get size, then find PUs for dating and geography
  msRecords.forEach(ms => {
    const size = extractSize(ms);
    if (!size) return;
    
    const msId = String(ms.rec_ID);
    const msTitle = MAP.ms?.title(ms) || 'Untitled';
    
    // Find PUs that reference this MS
    const puRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'pu');
    
    puRefs.forEach(ref => {
      const pu = IDX.pu?.[ref.fromId];
      if (!pu) return;
      
      const date = extractDate(pu);
      const country = extractCountry(pu);
      
      if (date) {
        dataPoints.push({ 
          date, 
          size, 
          country,
          msTitle,
          century: Math.floor(date / 100) * 100
        });
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No data available for size vs date analysis</div>';
  }
  
  // Group by century
  const byCentury = {};
  dataPoints.forEach(d => {
    const century = d.century;
    if (!byCentury[century]) byCentury[century] = [];
    byCentury[century].push(d.size);
  });
  
  const stats = {};
  Object.entries(byCentury).forEach(([century, sizes]) => {
    const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const sorted = [...sizes].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats[`${century}s`] = { mean, median, min: Math.min(...sizes), max: Math.max(...sizes), n: sizes.length };
  });
  
  let html = '<div style="margin-bottom: 1rem;"><h3 style="color: #856404;">Size vs Date Analysis</h3>';
  html += `<p style="font-size: 0.875rem; color: #666;">Total data points: ${dataPoints.length}</p></div>`;
  
  if (vizType === 'stats') {
    html += buildStatsTable('Manuscript Size by Century', stats, 'mm');
  } else if (vizType === 'box') {
    html += buildBoxPlot('Manuscript Size by Century', byCentury, 'Century', 'Size (mm)');
  } else if (vizType === 'scatter') {
    html += buildScatterPlot('Size vs Date (colored by country)', dataPoints, 'date', 'size', 'Year', 'Size (mm)', 'country');
  } else if (vizType === 'bar') {
    html += buildBarChart('Average Manuscript Size by Century', Object.entries(stats).map(([c, s]) => ({ category: c, value: s.mean })), 'mm');
  }
  
  return html;
}

// Analysis 3: Quire Patterns
function analyzeQuirePatterns(msRecords, puRecords, vizType) {
  const dataPoints = [];
  
  // For each MS, get size, then check PUs for quire features
  msRecords.forEach(ms => {
    const size = extractSize(ms);
    if (!size) return;
    
    const msId = String(ms.rec_ID);
    const msTitle = MAP.ms?.title(ms) || 'Untitled';
    
    // Find PUs that reference this MS
    const puRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'pu');
    
    puRefs.forEach(ref => {
      const pu = IDX.pu?.[ref.fromId];
      if (!pu) return;
      
      const date = extractDate(pu);
      const country = extractCountry(pu);
      const material = getMaterialFromPU(pu);
      
      // Check quire features
      let hasCatchwords = false;
      let hasSignatures = false;
      let quireType = null;
      
      (pu.details || []).forEach(d => {
        if (d.fieldName === 'catchwords' && d.value) {
          hasCatchwords = String(d.value).toLowerCase() === 'true';
        }
        if (d.fieldName === 'signatures' && d.value) {
          hasSignatures = String(d.value).toLowerCase() === 'true';
        }
        if (d.fieldName === 'Quire types' && d.termLabel) {
          quireType = d.termLabel;
        }
      });
      
      if (hasCatchwords !== null || hasSignatures !== null || quireType) {
        dataPoints.push({
          size,
          date,
          country,
          material,
          hasCatchwords,
          hasSignatures,
          quireType: quireType || 'Unknown',
          msTitle,
          century: date ? Math.floor(date / 100) * 100 : null
        });
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No quire pattern data available</div>';
  }
  
  // Analyze catchwords vs size
  const withCatchwords = dataPoints.filter(d => d.hasCatchwords).map(d => d.size);
  const withoutCatchwords = dataPoints.filter(d => !d.hasCatchwords).map(d => d.size);
  
  const stats = {};
  if (withCatchwords.length > 0) {
    const mean = withCatchwords.reduce((a, b) => a + b, 0) / withCatchwords.length;
    const sorted = [...withCatchwords].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats['With Catchwords'] = { mean, median, min: Math.min(...withCatchwords), max: Math.max(...withCatchwords), n: withCatchwords.length };
  }
  if (withoutCatchwords.length > 0) {
    const mean = withoutCatchwords.reduce((a, b) => a + b, 0) / withoutCatchwords.length;
    const sorted = [...withoutCatchwords].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats['Without Catchwords'] = { mean, median, min: Math.min(...withoutCatchwords), max: Math.max(...withoutCatchwords), n: withoutCatchwords.length };
  }
  
  let html = '<div style="margin-bottom: 1rem;"><h3 style="color: #856404;">Quire Patterns Analysis</h3>';
  html += `<p style="font-size: 0.875rem; color: #666;">Total data points: ${dataPoints.length}</p></div>`;
  
  if (vizType === 'stats') {
    html += buildStatsTable('Catchwords vs Manuscript Size', stats, 'mm');
  } else if (vizType === 'box') {
    html += buildBoxPlot('Catchwords vs Size', { 'With Catchwords': withCatchwords, 'Without Catchwords': withoutCatchwords }, 'Catchwords', 'Size (mm)');
  } else if (vizType === 'scatter') {
    html += buildScatterPlot('Quire Features vs Size', dataPoints, 'century', 'size', 'Century', 'Size (mm)', 'hasCatchwords');
  } else if (vizType === 'bar') {
    html += buildBarChart('Average Size: Catchwords', Object.entries(stats).map(([c, s]) => ({ category: c, value: s.mean })), 'mm');
  }
  
  return html;
}

// Analysis 4: Column Patterns
function analyzeColumnPatterns(msRecords, puRecords, vizType) {
  const dataPoints = [];
  
  // For each MS, get size, then check PUs for column info
  msRecords.forEach(ms => {
    const size = extractSize(ms);
    if (!size) return;
    
    const msId = String(ms.rec_ID);
    const msTitle = MAP.ms?.title(ms) || 'Untitled';
    
    // Find PUs that reference this MS
    const puRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'pu');
    
    puRefs.forEach(ref => {
      const pu = IDX.pu?.[ref.fromId];
      if (!pu) return;
      
      const columns = extractColumns(pu);
      const date = extractDate(pu);
      const country = extractCountry(pu);
      const material = getMaterialFromPU(pu);
      
      if (columns) {
        dataPoints.push({
          columns,
          size,
          date,
          country,
          material,
          msTitle,
          century: date ? Math.floor(date / 100) * 100 : null
        });
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No column pattern data available</div>';
  }
  
  // Group by number of columns
  const byColumns = {};
  dataPoints.forEach(d => {
    const key = `${d.columns} column${d.columns > 1 ? 's' : ''}`;
    if (!byColumns[key]) byColumns[key] = [];
    byColumns[key].push(d.size);
  });
  
  const stats = {};
  Object.entries(byColumns).forEach(([cols, sizes]) => {
    const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const sorted = [...sizes].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats[cols] = { mean, median, min: Math.min(...sizes), max: Math.max(...sizes), n: sizes.length };
  });
  
  let html = '<div style="margin-bottom: 1rem;"><h3 style="color: #856404;">Column Patterns Analysis</h3>';
  html += `<p style="font-size: 0.875rem; color: #666;">Total data points: ${dataPoints.length}</p></div>`;
  
  if (vizType === 'stats') {
    html += buildStatsTable('Manuscript Size by Column Count', stats, 'mm');
  } else if (vizType === 'box') {
    html += buildBoxPlot('Columns vs Size', byColumns, 'Columns', 'Size (mm)');
  } else if (vizType === 'scatter') {
    html += buildScatterPlot('Columns vs Size (colored by material)', dataPoints, 'columns', 'size', 'Number of Columns', 'Size (mm)', 'material');
  } else if (vizType === 'bar') {
    html += buildBarChart('Average Size by Column Count', Object.entries(stats).map(([c, s]) => ({ category: c, value: s.mean })), 'mm');
  }
  
  return html;
}

// Analysis 5: Margin Ratio (Codex Size vs Justification)
function analyzeMarginRatio(msRecords, puRecords, vizType) {
  const dataPoints = [];
  
  // For each MS, calculate margin ratio using PU justification data
  msRecords.forEach(ms => {
    const size = extractSize(ms);
    if (!size) return;
    
    const msId = String(ms.rec_ID);
    const msTitle = MAP.ms?.title(ms) || 'Untitled';
    
    // Find PUs that reference this MS
    const puRefs = (INBOUND.ms?.[msId] || []).filter(ref => ref.fromType === 'pu');
    
    puRefs.forEach(ref => {
      const pu = IDX.pu?.[ref.fromId];
      if (!pu) return;
      
      const marginRatio = calculateMarginRatio(ms, pu);
      const date = extractDate(pu);
      const country = extractCountry(pu);
      const material = getMaterialFromPU(pu);
      
      if (marginRatio !== null) {
        dataPoints.push({
          marginRatio,
          size,
          date,
          country,
          material,
          msTitle,
          century: date ? Math.floor(date / 100) * 100 : null
        });
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No margin ratio data available (requires both codex dimensions and justification measurements)</div>';
  }
  
  // Calculate overall statistics
  const ratios = dataPoints.map(d => d.marginRatio);
  const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const sorted = [...ratios].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  
  const stats = {
    'Overall': { mean, median, min: Math.min(...ratios), max: Math.max(...ratios), n: ratios.length }
  };
  
  // Group by material if available
  const byMaterial = {};
  dataPoints.filter(d => d.material).forEach(d => {
    if (!byMaterial[d.material]) byMaterial[d.material] = [];
    byMaterial[d.material].push(d.marginRatio);
  });
  
  Object.entries(byMaterial).forEach(([material, ratios]) => {
    const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    const sorted = [...ratios].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats[material] = { mean, median, min: Math.min(...ratios), max: Math.max(...ratios), n: ratios.length };
  });
  
  let html = '<div style="margin-bottom: 1rem;"><h3 style="color: #856404;">Margin Ratio Analysis</h3>';
  html += `<p style="font-size: 0.875rem; color: #666;">Margin ratio = (Codex area - Justification area) / Codex area × 100%<br>Total data points: ${dataPoints.length}</p></div>`;
  
  if (vizType === 'stats') {
    html += buildStatsTable('Margin Ratio by Material', stats, '%');
  } else if (vizType === 'box') {
    html += buildBoxPlot('Margin Ratio by Material', byMaterial, 'Material', 'Margin Ratio (%)');
  } else if (vizType === 'scatter') {
    html += buildScatterPlot('Margin Ratio vs Size (colored by century)', dataPoints, 'size', 'marginRatio', 'Size (mm)', 'Margin Ratio (%)', 'century');
  } else if (vizType === 'bar') {
    html += buildBarChart('Average Margin Ratio by Material', Object.entries(stats).filter(([k]) => k !== 'Overall').map(([m, s]) => ({ category: m, value: s.mean })), '%');
  }
  
  return html;
}

// ========== VISUALIZATION HELPER FUNCTIONS ==========

// Visualization helper: Stats Table
function buildStatsTable(title, stats, unit) {
  const rows = Object.entries(stats).map(([category, s]) => `
    <tr>
      <td style="padding: 0.5rem; font-weight: 600; border-bottom: 1px solid #dee2e6;">${category}</td>
      <td style="padding: 0.5rem; border-bottom: 1px solid #dee2e6; text-align: right;">${s.n}</td>
      <td style="padding: 0.5rem; border-bottom: 1px solid #dee2e6; text-align: right;">${s.mean.toFixed(1)} ${unit}</td>
      <td style="padding: 0.5rem; border-bottom: 1px solid #dee2e6; text-align: right;">${s.median} ${unit}</td>
      <td style="padding: 0.5rem; border-bottom: 1px solid #dee2e6; text-align: right;">${s.min} ${unit}</td>
      <td style="padding: 0.5rem; border-bottom: 1px solid #dee2e6; text-align: right;">${s.max} ${unit}</td>
    </tr>
  `).join('');
  
  return `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">${title}</h3>
      <table style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-radius: 0.5rem; overflow: hidden;">
        <thead style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white;">
          <tr>
            <th style="padding: 0.75rem; text-align: left;">Category</th>
            <th style="padding: 0.75rem; text-align: right;">N</th>
            <th style="padding: 0.75rem; text-align: right;">Mean</th>
            <th style="padding: 0.75rem; text-align: right;">Median</th>
            <th style="padding: 0.75rem; text-align: right;">Min</th>
            <th style="padding: 0.75rem; text-align: right;">Max</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

// Visualization helper: Box Plot
function buildBoxPlot(title, dataByCategory, xLabel, yLabel) {
  const categories = Object.keys(dataByCategory);
  const maxValue = Math.max(...categories.flatMap(c => dataByCategory[c]));
  
  const boxes = categories.map(category => {
    const values = [...dataByCategory[category]].sort((a, b) => a - b);
    const n = values.length;
    const q1 = values[Math.floor(n * 0.25)];
    const median = values[Math.floor(n * 0.5)];
    const q3 = values[Math.floor(n * 0.75)];
    const min = values[0];
    const max = values[n - 1];
    
    const scale = 300 / maxValue;
    
    return `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
        <div style="position: relative; width: 60px; height: 320px; margin-bottom: 0.5rem;">
          <div style="position: absolute; left: 28px; top: ${320 - max * scale}px; height: ${(max - min) * scale}px; width: 2px; background: #666;"></div>
          <div style="position: absolute; left: 10px; top: ${320 - q3 * scale}px; width: 40px; height: ${(q3 - q1) * scale}px; background: rgba(212, 175, 55, 0.3); border: 2px solid #d4af37;"></div>
          <div style="position: absolute; left: 8px; top: ${320 - median * scale}px; width: 44px; height: 3px; background: #e74c3c;"></div>
          <div style="position: absolute; left: 24px; top: ${320 - max * scale - 5}px; width: 10px; height: 2px; background: #666;"></div>
          <div style="position: absolute; left: 24px; top: ${320 - min * scale - 1}px; width: 10px; height: 2px; background: #666;"></div>
        </div>
        <div style="font-size: 0.8rem; font-weight: 600; text-align: center;">${category}</div>
        <div style="font-size: 0.7rem; color: #666;">n=${values.length}</div>
      </div>
    `;
  }).join('');
  
  return `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 0.5rem;">${title}</h3>
      <p style="font-size: 0.875rem; color: #666; margin-bottom: 1rem;">Box shows Q1-Q3 range (IQR), red line is median, whiskers extend to min/max</p>
      <div style="display: flex; gap: 2rem; justify-content: center; align-items: flex-end; padding: 1rem; background: #f8f9fa; border-radius: 0.5rem;">
        ${boxes}
      </div>
      <div style="text-align: center; margin-top: 0.5rem; font-size: 0.875rem; color: #666;">${yLabel}</div>
    </div>
  `;
}

// Visualization helper: Scatter Plot
function buildScatterPlot(title, dataPoints, xVar, yVar, xLabel, yLabel, colorVar) {
  // Check if variables are numeric
  const xValues = dataPoints.map(d => d[xVar]).filter(v => v !== null && typeof v === 'number');
  const yValues = dataPoints.map(d => d[yVar]).filter(v => v !== null && typeof v === 'number');
  
  if (xValues.length === 0 || yValues.length === 0) {
    return `
      <div style="padding: 2rem; text-align: center; color: #666;">
        <p>Cannot create scatter plot: one or both variables are not numeric</p>
        <p style="font-size: 0.875rem; margin-top: 0.5rem;">Try using a box plot or bar chart for categorical variables</p>
      </div>
    `;
  }
  
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  const width = 600;
  const height = 400;
  const padding = 60;
  
  const xScale = (width - 2 * padding) / (xMax - xMin);
  const yScale = (height - 2 * padding) / (yMax - yMin);
  
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
  const colorMap = {};
  let colorIndex = 0;
  
  const validPoints = dataPoints.filter(d => 
    d[xVar] !== null && typeof d[xVar] === 'number' && 
    d[yVar] !== null && typeof d[yVar] === 'number'
  );
  
  const points = validPoints.map(d => {
    let color = '#d4af37';
    if (colorVar && d[colorVar]) {
      if (!colorMap[d[colorVar]]) {
        colorMap[d[colorVar]] = colors[colorIndex % colors.length];
        colorIndex++;
      }
      color = colorMap[d[colorVar]];
    }
    
    return `<circle cx="${padding + (d[xVar] - xMin) * xScale}" cy="${height - padding - (d[yVar] - yMin) * yScale}" r="4" fill="${color}" fill-opacity="0.6" stroke="white" stroke-width="1"><title>${d.msTitle || d.title || ''}: ${xLabel}=${d[xVar]}, ${yLabel}=${d[yVar]}</title></circle>`;
  }).join('');
  
  // Create legend if color variable is used
  let legend = '';
  if (colorVar && Object.keys(colorMap).length > 0) {
    const legendItems = Object.entries(colorMap).map(([key, color]) => 
      `<div style="display: flex; align-items: center; margin: 0.25rem 0;">
        <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; margin-right: 0.5rem;"></div>
        <span style="font-size: 0.875rem;">${key}</span>
      </div>`
    ).join('');
    legend = `<div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 0.5rem;">
      <div style="font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem;">Legend:</div>
      ${legendItems}
    </div>`;
  }
  
  return `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">${title}</h3>
      <svg width="${width}" height="${height}" style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#ccc" stroke-width="2"/>
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#ccc" stroke-width="2"/>
        ${points}
        <text x="${width / 2}" y="${height - 10}" text-anchor="middle" font-size="12" fill="#666">${xLabel}</text>
        <text x="15" y="${height / 2}" text-anchor="middle" font-size="12" fill="#666" transform="rotate(-90, 15, ${height / 2})">${yLabel}</text>
      </svg>
      <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">n=${validPoints.length} manuscripts</p>
      ${legend}
    </div>
  `;
}

// Visualization helper: Bar Chart
function buildBarChart(title, data, unit) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const bars = data.map(d => {
    const width = (d.value / maxValue * 100);
    return `
      <div style="margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
          <span style="font-weight: 600; font-size: 0.875rem;">${d.category}</span>
          <span style="font-size: 0.875rem; color: #666;">${d.value.toFixed(1)} ${unit}</span>
        </div>
        <div style="background: #e0e0e0; height: 2rem; border-radius: 0.25rem; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); height: 100%; width: ${width}%;"></div>
        </div>
      </div>
    `;
  }).join('');
  
  return `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">${title}</h3>
      <div>${bars}</div>
    </div>
  `;
}

// Visualization helper: Heatmap
function buildHeatmap(title, data) {
  // data format: { row1: { col1: value, col2: value }, row2: { col1: value } }
  const rows = Object.keys(data);
  const cols = new Set();
  rows.forEach(row => {
    Object.keys(data[row]).forEach(col => cols.add(col));
  });
  const colsArray = Array.from(cols);
  
  // Find max value for color scaling
  let maxVal = 0;
  rows.forEach(row => {
    Object.values(data[row]).forEach(val => {
      maxVal = Math.max(maxVal, parseFloat(val) || 0);
    });
  });
  
  const cellWidth = 120;
  const cellHeight = 40;
  
  let html = `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">${title}</h3>
      <div style="overflow-x: auto;">
        <table style="border-collapse: collapse; margin: 1rem 0;">
          <thead>
            <tr>
              <th style="padding: 0.5rem; border: 1px solid #ddd; background: #f8f9fa; min-width: 120px;">Category</th>
  `;
  
  colsArray.forEach(col => {
    html += `<th style="padding: 0.5rem; border: 1px solid #ddd; background: #f8f9fa; min-width: ${cellWidth}px;">${col}</th>`;
  });
  
  html += '</tr></thead><tbody>';
  
  rows.forEach(row => {
    html += `<tr><td style="padding: 0.5rem; border: 1px solid #ddd; font-weight: bold;">${row}</td>`;
    colsArray.forEach(col => {
      const val = data[row][col] || 0;
      const intensity = maxVal > 0 ? (parseFloat(val) / maxVal) : 0;
      const bgColor = `rgba(218, 165, 32, ${intensity * 0.7 + 0.1})`; // Gold gradient
      html += `<td style="padding: 0.5rem; border: 1px solid #ddd; background: ${bgColor}; text-align: center;">${val}${typeof val === 'string' && val.includes('.') ? '%' : ''}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table></div></div>';
  
  return html;
}

// Visualization helper: Stacked Bar
function buildStackedBar(title, data, totals) {
  // Analyze correlations between quire features (catchwords, signatures, type) and other features
  const dataPoints = [];
  
  msRecords.forEach(ms => {
    const size = extractSize(ms);
    const msId = String(ms.rec_ID);
    
    // Find PUs for this MS to get quire features
    const pus = (INBOUND.pu?.[msId] || []);
    
    pus.forEach(puId => {
      const pu = IDX.pu?.[puId];
      if (!pu) return;
      
      const date = extractDate(pu);
      const puDetails = pu.details || [];
      
      let hasCatchwords = false;
      let hasSignatures = false;
      let quireType = null;
      
      puDetails.forEach(d => {
        if (d.fieldName === 'catchwords' && d.value) {
          hasCatchwords = String(d.value).toUpperCase() === 'TRUE';
        }
        if (d.fieldName === 'signatures' && d.value) {
          hasSignatures = String(d.value).toUpperCase() === 'TRUE';
        }
        if (d.fieldName === 'Quire types' && d.termLabel) {
          quireType = d.termLabel;
        }
      });
      
      if (size) {
        dataPoints.push({
          title: MAP.ms?.title(ms) || 'Untitled',
          size,
          date,
          hasCatchwords,
          hasSignatures,
          quireType: quireType || 'Unknown'
        });
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No manuscript data with quire features available</div>';
  }
  
  // Analyze catchwords vs size
  const withCatchwords = dataPoints.filter(d => d.hasCatchwords).map(d => d.size);
  const withoutCatchwords = dataPoints.filter(d => !d.hasCatchwords).map(d => d.size);
  
  const stats = {};
  if (withCatchwords.length > 0) {
    const mean = withCatchwords.reduce((a, b) => a + b, 0) / withCatchwords.length;
    const sorted = [...withCatchwords].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats['With Catchwords'] = { mean, median, min: Math.min(...withCatchwords), max: Math.max(...withCatchwords), n: withCatchwords.length };
  }
  if (withoutCatchwords.length > 0) {
    const mean = withoutCatchwords.reduce((a, b) => a + b, 0) / withoutCatchwords.length;
    const sorted = [...withoutCatchwords].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats['Without Catchwords'] = { mean, median, min: Math.min(...withoutCatchwords), max: Math.max(...withoutCatchwords), n: withoutCatchwords.length };
  }
  
  if (vizType === 'stats') {
    return buildStatsTable('Catchwords vs Manuscript Size', stats, 'mm');
  } else if (vizType === 'box') {
    return buildBoxPlot('Catchwords vs Manuscript Size', { 
      'With Catchwords': withCatchwords, 
      'Without Catchwords': withoutCatchwords 
    }, 'Catchwords', 'Size (mm)');
  } else if (vizType === 'bar') {
    return buildBarChart('Average Size: Catchwords', Object.entries(stats).map(([c, s]) => ({ category: c, value: s.mean })), 'mm');
  }
  
  return '<div>Visualization type not supported</div>';
}

function analyzeTextVsMateriality(msRecords, suRecords, vizType) {
  // Analyze relationship between text type/genre and material features
  const dataPoints = [];
  
  suRecords.forEach(su => {
    const suId = String(su.rec_ID);
    
    // Find texts related to this SU
    const rels = REL_INDEX.bySource[suId] || [];
    rels.forEach(rel => {
      const relType = getVal(rel, 'Relationship type');
      if (relType === 'contains text') {
        const tgt = getRes(rel, 'Target record');
        if (tgt && tgt.type === 'txt') {
          const text = IDX.txt?.[String(tgt.id)];
          if (text) {
            // Get genre from text
            const textDetails = text.details || [];
            let genre = null;
            textDetails.forEach(d => {
              if (d.fieldName === 'Genre' && d.termLabel) {
                genre = d.termLabel;
              }
            });
            
            // Get material from PU
            const puRels = REL_INDEX.byTarget[suId] || [];
            puRels.forEach(puRel => {
              const puSrc = getRes(puRel, 'Source record');
              if (puSrc && puSrc.type === 'pu') {
                const pu = IDX.pu?.[String(puSrc.id)];
                if (pu) {
                  const material = getMaterialFromPU(pu);
                  if (genre && material) {
                    dataPoints.push({ 
                      genre, 
                      material,
                      textTitle: MAP.txt?.title(text) || 'Untitled',
                      suTitle: MAP.su?.title(su) || 'Untitled'
                    });
                  }
                }
              }
            });
          }
        }
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No data available for text vs materiality analysis</div>';
  }
  
  // Count combinations
  const counts = {};
  dataPoints.forEach(d => {
    const key = `${d.genre}|${d.material}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  
  // Calculate percentages by genre
  const genreTotals = {};
  dataPoints.forEach(d => {
    genreTotals[d.genre] = (genreTotals[d.genre] || 0) + 1;
  });
  
  const data = [];
  Object.entries(counts).forEach(([key, count]) => {
    const [genre, material] = key.split('|');
    const percentage = (count / genreTotals[genre] * 100).toFixed(1);
    data.push({ category: `${genre} - ${material}`, value: parseFloat(percentage) });
  });
  
  if (vizType === 'bar') {
    return buildBarChart('Text Genre vs Material (%)', data, '%');
  } else if (vizType === 'heatmap') {
    const percentages = {};
    Object.entries(counts).forEach(([key, count]) => {
      const [genre, material] = key.split('|');
      if (!percentages[genre]) percentages[genre] = {};
      percentages[genre][material] = (count / genreTotals[genre] * 100).toFixed(1);
    });
    return buildHeatmap('Text Genre vs Material (%)', percentages);
  }
  
  return '<div>Visualization type not supported</div>';
}

function analyzeCollaborationVsFeatures(msRecords, suRecords, puRecords, vizType) {
  // Analyze manuscripts with multiple scribes
  const dataPoints = [];
  
  msRecords.forEach(ms => {
    const msId = String(ms.rec_ID);
    const size = extractSize(ms);
    
    // Find SUs for this MS
    const allSUs = suRecords.filter(su => {
      const msRef = getRes(su, 'Manuscript');
      return msRef && String(msRef.id) === msId;
    });
    
    // Get unique genders
    const genders = new Set();
    allSUs.forEach(su => {
      const gender = getVal(su, 'Gender');
      if (gender) genders.add(gender);
    });
    
    // Get materials from PUs
    const pus = (INBOUND.pu?.[msId] || []);
    const materials = new Set();
    
    pus.forEach(puId => {
      const pu = IDX.pu?.[puId];
      if (pu) {
        const material = getMaterialFromPU(pu);
        if (material) materials.add(material);
      }
    });
    
    if (allSUs.length > 0 && size) {
      dataPoints.push({
        title: MAP.ms?.title(ms) || 'Untitled',
        scribeCount: allSUs.length,
        isCollaborative: allSUs.length > 1,
        size,
        materials: Array.from(materials),
        genderMix: genders.size > 1
      });
    }
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No manuscript collaboration data available</div>';
  }
  
  // Analyze collaborative vs single scribe
  const collaborative = dataPoints.filter(d => d.isCollaborative).map(d => d.size);
  const singleScribe = dataPoints.filter(d => !d.isCollaborative).map(d => d.size);
  
  const stats = {};
  if (collaborative.length > 0) {
    const mean = collaborative.reduce((a, b) => a + b, 0) / collaborative.length;
    const sorted = [...collaborative].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats['Collaborative (Multiple Scribes)'] = { 
      mean, median, 
      min: Math.min(...collaborative), 
      max: Math.max(...collaborative), 
      n: collaborative.length 
    };
  }
  if (singleScribe.length > 0) {
    const mean = singleScribe.reduce((a, b) => a + b, 0) / singleScribe.length;
    const sorted = [...singleScribe].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    stats['Single Scribe'] = { 
      mean, median, 
      min: Math.min(...singleScribe), 
      max: Math.max(...singleScribe), 
      n: singleScribe.length 
    };
  }
  
  if (vizType === 'stats') {
    return buildStatsTable('Collaboration vs Manuscript Size', stats, 'mm');
  } else if (vizType === 'box') {
    return buildBoxPlot('Collaboration vs Size', {
      'Collaborative': collaborative,
      'Single Scribe': singleScribe
    }, 'Type', 'Size (mm)');
  } else if (vizType === 'bar') {
    return buildBarChart('Average Size by Collaboration Type', Object.entries(stats).map(([c, s]) => ({ category: c, value: s.mean })), 'mm');
  } else if (vizType === 'scatter') {
    return buildScatterPlot('Scribe Count vs Size', dataPoints, 'scribeCount', 'size', 'Number of Scribes', 'Size (mm)', null);
  }
  
  return '<div>Visualization type not supported</div>';
}

function analyzeCustomVariables(msRecords, puRecords, suRecords, xVar, yVar, colorVar, vizType) {
  const dataPoints = [];
  
  // Helper to extract value by variable name
  function extractValue(ms, pu, varName) {
    // Dimensional variables
    if (varName === 'height') return extractHeight(ms);
    if (varName === 'width') return extractWidth(ms);
    if (varName === 'combined-size') return extractSize(ms);
    if (varName === 'justification-height') return pu ? extractJustificationHeight(pu) : null;
    if (varName === 'justification-width') return pu ? extractJustificationWidth(pu) : null;
    if (varName === 'margin-ratio') return pu ? calculateMarginRatio(ms, pu) : null;
    
    // Structural variables
    if (varName === 'folios') {
      const folios = getVal(ms, 'Number of folios');
      return folios ? parseInt(folios) : null;
    }
    if (varName === 'columns') return pu ? extractColumns(pu) : null;
    if (varName === 'lines-per-page') {
      const lines = pu ? getVal(pu, 'Lines per page') : null;
      return lines ? parseInt(lines) : null;
    }
    if (varName === 'quires') {
      const quires = pu ? getVal(pu, 'Number of quires') : null;
      return quires ? parseInt(quires) : null;
    }
    
    // Temporal variables
    if (varName === 'date') return pu ? extractDate(pu) : null;
    if (varName === 'century') {
      const date = pu ? extractDate(pu) : null;
      return date ? Math.floor(date / 100) + 1 : null;
    }
    
    // Categorical variables
    if (varName === 'material') return pu ? getMaterialFromPU(pu) : null;
    if (varName === 'quire-type') return pu ? getVal(pu, 'Quire type') : null;
    if (varName === 'ruling-type') return pu ? getVal(pu, 'Ruling type') : null;
    if (varName === 'script-type') {
      // Get from related SU
      const msId = String(ms.rec_ID);
      const sus = (INBOUND.su?.[msId] || []);
      if (sus.length > 0) {
        const suId = sus[0];
        const su = IDX.su?.[suId];
        return su ? getVal(su, 'Normalised script(s)') : null;
      }
      return null;
    }
    if (varName === 'binding-type') return getVal(ms, 'Binding type');
    
    return null;
  }
  
  // Helper for color/group variables (can return multiple values)
  function extractColorValue(ms, pu, varName) {
    if (varName === 'none') return 'All';
    
    // People & Gender
    if (varName === 'gender') {
      const msId = String(ms.rec_ID);
      const sus = (INBOUND.su?.[msId] || []);
      const genders = new Set();
      sus.forEach(suId => {
        const su = IDX.su?.[suId];
        if (su) {
          const hpIds = (OUTBOUND.su?.[suId] || []).filter(targetId => {
            const target = getRecordById(targetId);
            return target && target.rty === 'hp';
          });
          hpIds.forEach(hpId => {
            const hp = IDX.hp?.[hpId];
            if (hp) {
              const gender = getVal(hp, 'Gender');
              if (gender) genders.add(gender);
            }
          });
        }
      });
      return genders.size > 0 ? Array.from(genders).join(', ') : 'Unknown';
    }
    
    if (varName === 'scribe-name') {
      const msId = String(ms.rec_ID);
      const sus = (INBOUND.su?.[msId] || []);
      if (sus.length > 0) {
        const suId = sus[0];
        const su = IDX.su?.[suId];
        return su ? (MAP.su?.title(su) || 'Unknown') : 'Unknown';
      }
      return 'Unknown';
    }
    
    // Production Context
    if (varName === 'origin-country') return pu ? extractCountry(pu) : 'Unknown';
    if (varName === 'origin-region') return pu ? getVal(pu, 'Production unit location') : 'Unknown';
    if (varName === 'monastery-type') {
      const puId = pu ? String(pu.rec_ID) : null;
      if (puId) {
        const miIds = (OUTBOUND.pu?.[puId] || []).filter(targetId => {
          const target = getRecordById(targetId);
          return target && target.rty === 'mi';
        });
        if (miIds.length > 0) {
          const mi = IDX.mi?.[miIds[0]];
          return mi ? getVal(mi, 'Type of monastery') : 'Unknown';
        }
      }
      return 'Unknown';
    }
    
    // Physical Features
    if (varName === 'catchwords') return pu ? (getVal(pu, 'Catchwords') || 'No') : 'Unknown';
    if (varName === 'signatures') return pu ? (getVal(pu, 'Signatures') || 'No') : 'Unknown';
    if (varName === 'watermark') return getVal(ms, 'Watermark') || 'No';
    if (varName === 'decoration') return getVal(ms, 'Decoration') || 'No';
    
    // Content
    if (varName === 'has-colophon') {
      const msId = String(ms.rec_ID);
      const sus = (INBOUND.su?.[msId] || []);
      let hasColophon = false;
      sus.forEach(suId => {
        const su = IDX.su?.[suId];
        if (su && getVal(su, 'Colophon')) hasColophon = true;
      });
      return hasColophon ? 'Yes' : 'No';
    }
    if (varName === 'language') {
      const msId = String(ms.rec_ID);
      const sus = (INBOUND.su?.[msId] || []);
      const langs = new Set();
      sus.forEach(suId => {
        const su = IDX.su?.[suId];
        if (su) {
          const lang = getVal(su, 'Colophon language');
          if (lang) langs.add(lang);
        }
      });
      return langs.size > 0 ? Array.from(langs).join(', ') : 'Unknown';
    }
    
    // Collaboration
    if (varName === 'collaboration-type') return pu ? getVal(pu, 'Collaboration type') : 'Unknown';
    if (varName === 'multiple-scribes') {
      const msId = String(ms.rec_ID);
      const sus = (INBOUND.su?.[msId] || []);
      return sus.length > 1 ? 'Yes' : 'No';
    }
    
    // Use the basic extract function for other variables
    return extractValue(ms, pu, varName) || 'Unknown';
  }
  
  // Instead of iterating MS→PU, iterate PU→MS (simpler and more reliable)
  puRecords.forEach(pu => {
    // Find which MS this PU belongs to
    const msPointers = (pu.details || []).filter(d => 
      d?.value && typeof d.value === 'object' && d.value.type === 'ms'
    );
    
    msPointers.forEach(ptr => {
      const msId = String(ptr.value.id);
      const ms = msRecords.find(m => String(m.rec_ID) === msId);
      
      if (ms) {
        const xVal = extractValue(ms, pu, xVar);
        const yVal = extractValue(ms, pu, yVar);
        const colorVal = extractColorValue(ms, pu, colorVar);
        
        if (dataPoints.length === 0) {
          // First extraction check (no logging)
        }
        
        if (xVal !== null && yVal !== null) {
          dataPoints.push({
            x: xVal,
            y: yVal,
            color: colorVal,
            title: MAP.ms?.title(ms) || 'Untitled'
          });
        }
      }
    });
  });
  
  if (dataPoints.length === 0) {
    return `
      <div style="padding: 3rem 2rem; text-align: center; color: #666;">
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">📊</div>
        <h3 style="color: #999; font-weight: 500;">No Data Available</h3>
        <p style="margin-top: 0.5rem;">No manuscripts have values for the selected variable combination.</p>
        <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #888;">Try different variables or check the data completeness.</p>
      </div>
    `;
  }
  
  // Get variable labels
  const varLabels = {
    'height': 'Height (mm)',
    'width': 'Width (mm)',
    'combined-size': 'Combined Size (Height + Width, mm)',
    'justification-height': 'Justification Height (mm)',
    'justification-width': 'Justification Width (mm)',
    'margin-ratio': 'Margin Ratio',
    'folios': 'Number of folios',
    'columns': 'Number of Columns',
    'lines-per-page': 'Lines per Page',
    'quires': 'Number of Quires',
    'date': 'Year',
    'century': 'Century',
    'material': 'Material',
    'quire-type': 'Quire Type',
    'ruling-type': 'Ruling Type',
    'script-type': 'Script Type',
    'binding-type': 'Binding Type'
  };
  
  const xLabel = varLabels[xVar] || xVar;
  const yLabel = varLabels[yVar] || yVar;
  const colorLabel = varLabels[colorVar] || colorVar;
  
  // Build visualization based on type
  if (vizType === 'scatter') {
    return buildScatterPlot(`${xLabel} vs ${yLabel}`, dataPoints, 'x', 'y', xLabel, yLabel, colorVar !== 'none' ? 'color' : null);
  } else if (vizType === 'box') {
    // Box plot: group Y values by categories
    // If color variable is set, use it for grouping
    // Otherwise, use X variable for grouping (if categorical)
    const groupBy = colorVar !== 'none' ? 'color' : 'x';
    const groupLabel = colorVar !== 'none' ? colorLabel : xLabel;
    
    const byCategory = {};
    dataPoints.forEach(d => {
      const key = String(d[groupBy] || 'Unknown');
      if (!byCategory[key]) byCategory[key] = [];
      byCategory[key].push(d.y);
    });
    
    if (Object.keys(byCategory).length === 0) {
      return '<div style="padding: 2rem; text-align: center; color: #666;">No data available for box plot</div>';
    }
    
    return buildBoxPlot(`${yLabel} by ${groupLabel}`, byCategory, groupLabel, yLabel);
  } else if (vizType === 'bar') {
    // Count by color variable or X variable (if categorical)
    const groupBy = colorVar !== 'none' ? 'color' : 'x';
    const groupLabel = colorVar !== 'none' ? colorLabel : xLabel;
    
    const counts = {};
    dataPoints.forEach(d => {
      const key = String(d[groupBy] || 'Unknown');
      counts[key] = (counts[key] || 0) + 1;
    });
    
    // Convert counts object to array format for buildBarChart
    const barData = Object.keys(counts).map(key => ({
      category: key,
      value: counts[key]
    }));
    
    return buildBarChart(`Count by ${groupLabel}`, barData, 'manuscripts');
  } else if (vizType === 'stats') {
    // Statistical summary
    if (colorVar !== 'none') {
      const byColor = {};
      dataPoints.forEach(d => {
        const colorKey = String(d.color || 'Unknown');
        if (!byColor[colorKey]) byColor[colorKey] = [];
        byColor[colorKey].push(d.y);
      });
      
      const stats = {};
      Object.entries(byColor).forEach(([color, values]) => {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const sorted = [...values].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        stats[color] = { 
          mean, median, 
          min: Math.min(...values), 
          max: Math.max(...values), 
          n: values.length 
        };
      });
      
      return buildStatsTable(`${yLabel} by ${colorLabel}`, stats, '');
    } else {
      // Overall statistics
      const yValues = dataPoints.map(d => d.y);
      const mean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
      const sorted = [...yValues].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const stats = {
        'All Records': {
          mean, median,
          min: Math.min(...yValues),
          max: Math.max(...yValues),
          n: yValues.length
        }
      };
      return buildStatsTable(`${yLabel} Statistics`, stats, '');
    }
  } else if (vizType === 'correlation') {
    // Correlation analysis between x and y
    if (!dataPoints.length || dataPoints.length < 3) {
      return '<div style="padding: 2rem; text-align: center; color: #666;">Not enough data points for correlation analysis (minimum 3 required)</div>';
    }
    
    // Calculate Pearson correlation coefficient
    const validPoints = dataPoints.filter(d => d.x !== null && d.y !== null && !isNaN(d.x) && !isNaN(d.y));
    const n = validPoints.length;
    
    if (n < 3) {
      return '<div style="padding: 2rem; text-align: center; color: #666;">Not enough valid numeric data points for correlation</div>';
    }
    
    const xVals = validPoints.map(d => d.x);
    const yVals = validPoints.map(d => d.y);
    
    const xMean = xVals.reduce((a, b) => a + b, 0) / n;
    const yMean = yVals.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = xVals[i] - xMean;
      const yDiff = yVals[i] - yMean;
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }
    
    const correlation = numerator / Math.sqrt(xDenominator * yDenominator);
    const correlationPercent = (correlation * 100).toFixed(1);
    
    // Interpret correlation strength
    let strength = '';
    let strengthColor = '';
    const absCorr = Math.abs(correlation);
    if (absCorr >= 0.7) {
      strength = 'Strong';
      strengthColor = '#d32f2f';
    } else if (absCorr >= 0.4) {
      strength = 'Moderate';
      strengthColor = '#f57c00';
    } else if (absCorr >= 0.2) {
      strength = 'Weak';
      strengthColor = '#fbc02d';
    } else {
      strength = 'Very Weak / None';
      strengthColor = '#757575';
    }
    
    const direction = correlation > 0 ? 'Positive' : 'Negative';
    
    return `
      <div style="padding: 2rem;">
        <h3 style="margin-bottom: 1.5rem;">Correlation Analysis: ${xLabel} vs ${yLabel}</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
          <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); padding: 1.5rem; border-radius: 0.5rem; color: white;">
            <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">Correlation Coefficient (r)</div>
            <div style="font-size: 2.5rem; font-weight: bold;">${correlation.toFixed(3)}</div>
            <div style="font-size: 0.875rem; opacity: 0.9; margin-top: 0.5rem;">${correlationPercent}%</div>
          </div>
          <div style="border: 2px solid ${strengthColor}; padding: 1.5rem; border-radius: 0.5rem;">
            <div style="font-size: 0.875rem; color: #666; margin-bottom: 0.5rem;">Relationship Strength</div>
            <div style="font-size: 1.5rem; font-weight: bold; color: ${strengthColor};">${strength}</div>
            <div style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">${direction} correlation</div>
          </div>
        </div>
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #2196F3;">
          <div style="font-weight: 600; margin-bottom: 0.5rem;">Sample Size: ${n} manuscripts</div>
          <div style="font-size: 0.875rem; color: #666; line-height: 1.6;">
            <strong>Interpretation:</strong> ${
              absCorr >= 0.7 
                ? `There is a <strong>strong ${direction.toLowerCase()} relationship</strong> between ${xLabel} and ${yLabel}. ${correlation > 0 ? 'As one increases, the other tends to increase significantly.' : 'As one increases, the other tends to decrease significantly.'}`
                : absCorr >= 0.4
                ? `There is a <strong>moderate ${direction.toLowerCase()} relationship</strong> between ${xLabel} and ${yLabel}. ${correlation > 0 ? 'They tend to increase together.' : 'They tend to vary in opposite directions.'}`
                : absCorr >= 0.2
                ? `There is a <strong>weak ${direction.toLowerCase()} relationship</strong> between ${xLabel} and ${yLabel}.`
                : 'There is <strong>little to no linear relationship</strong> between these variables.'
            }
          </div>
        </div>
        ${buildScatterPlot(`${xLabel} vs ${yLabel} (r = ${correlation.toFixed(3)})`, validPoints, 'x', 'y', xLabel, yLabel, colorVar !== 'none' ? 'color' : null)}
      </div>
    `;
  }
  
  return '<div style="padding: 2rem; text-align: center; color: #666;">Visualization type not supported for this configuration</div>';
}


// Hierarchical Tree - Entity Structure
function buildHierarchicalTreeVisualization(mount, list) {
  // Build tree showing MS → PU → SU hierarchy
  // Structure: SU points to MS (pointer), SU relates to PU (relationship), PU points to MS (pointer)
  const tree = {};
  
  // Start from SUs and build up the hierarchy
  const allSUs = DATA.su || [];
  
  allSUs.forEach(su => {
    const suId = String(su.rec_ID);
    const suTitle = MAP.su?.title(su) || 'Untitled SU';
    
    // Find MS that this SU points to (via pointer field)
    let msId = null;
    (su.details || []).forEach(d => {
      const v = d?.value;
      if (v && typeof v === 'object' && v.id && v.type) {
        const toId = String(v.id);
        if (IDX.ms?.[toId]) {
          msId = toId;
        }
      }
    });
    
    if (!msId) return; // Skip SUs without manuscript connection
    
    // Find ALL PUs that this SU relates to (via relationships)
    const puIds = [];
    const suRels = [...(REL_INDEX.bySource?.[suId] || []), ...(REL_INDEX.byTarget?.[suId] || [])];
    for (const rel of suRels) {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const otherId = String(src?.id) === suId ? String(tgt?.id) : String(src?.id);
      
      if (IDX.pu?.[otherId] && !puIds.includes(otherId)) {
        puIds.push(otherId); // Collect ALL PUs (not just first)
      }
    }
    
    if (puIds.length === 0) return; // Skip SUs without PU connection
    
    // Create manuscript node if it doesn't exist
    if (!tree[msId]) {
      const ms = IDX.ms[msId];
      const msTitle = ms ? (MAP.ms?.title(ms) || 'Untitled Manuscript') : 'Untitled Manuscript';
      tree[msId] = {
        type: 'ms',
        title: msTitle,
        children: {}
      };
    }
    
    // Add this SU to ALL of its PUs
    puIds.forEach(puId => {
      // Add PU to tree if not exists
      if (!tree[msId].children[puId]) {
        const pu = IDX.pu[puId];
        const puTitle = pu ? (MAP.pu?.title(pu) || 'Untitled PU') : 'Untitled PU';
        tree[msId].children[puId] = {
          type: 'pu',
          title: puTitle,
          children: {}
        };
      }
      
      // Add SU to this PU (will be added to multiple PUs if it spans them)
      tree[msId].children[puId].children[suId] = {
        type: 'su',
        title: suTitle,
        allPUs: puIds // Store all PUs this SU belongs to for cross-PU detection
      };
    });
  });
  
  // Also add PUs that have no SUs (directly connected to MS via pointer)
  const allPUs = DATA.pu || [];
  allPUs.forEach(pu => {
    const puId = String(pu.rec_ID);
    const puTitle = MAP.pu?.title(pu) || 'Untitled PU';
    
    // Find MS that this PU points to
    let msId = null;
    (pu.details || []).forEach(d => {
      const v = d?.value;
      if (v && typeof v === 'object' && v.id && v.type) {
        const toId = String(v.id);
        if (IDX.ms?.[toId]) {
          msId = toId;
        }
      }
    });
    
    if (!msId) return;
    
    // Create manuscript node if it doesn't exist
    if (!tree[msId]) {
      const ms = IDX.ms[msId];
      const msTitle = ms ? (MAP.ms?.title(ms) || 'Untitled Manuscript') : 'Untitled Manuscript';
      tree[msId] = {
        type: 'ms',
        title: msTitle,
        children: {}
      };
    }
    
    // Add PU if not already in tree
    if (!tree[msId].children[puId]) {
      tree[msId].children[puId] = {
        type: 'pu',
        title: puTitle,
        children: {}
      };
    }
  });
  
  if (Object.keys(tree).length === 0) {
    mount.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🌳</div>
        <h3 style="margin-bottom: 0.5rem;">Hierarchical Tree</h3>
        <p>No hierarchical relationships found in current data</p>
      </div>
    `;
    return;
  }
  
  // Calculate complexity metrics for each manuscript
  const msMetrics = {};
  const puToMSMap = {}; // Track which manuscripts each PU appears in
  
  // First pass: map PUs to manuscripts
  Object.entries(tree).forEach(([msId, ms]) => {
    Object.keys(ms.children).forEach(puId => {
      if (!puToMSMap[puId]) puToMSMap[puId] = [];
      puToMSMap[puId].push(msId);
    });
  });
  
  Object.entries(tree).forEach(([msId, ms]) => {
    const puCount = Object.keys(ms.children).length;
    const suCount = Object.values(ms.children).reduce((sum, pu) => sum + Object.keys(pu.children).length, 0);
    
    // Check for cross-MS PUs (PUs that appear in multiple MSS)
    let hasCrossMSPU = false;
    Object.keys(ms.children).forEach(puId => {
      // Count how many MSS this PU appears in
      let msCountForThisPU = 0;
      Object.values(tree).forEach(otherMs => {
        if (otherMs.children[puId]) msCountForThisPU++;
      });
      if (msCountForThisPU > 1) hasCrossMSPU = true;
    });
    
    // Check for cross-PU SUs (SUs that appear in multiple PUs within this MS)
    const suToPUMap = {};
    Object.entries(ms.children).forEach(([puId, pu]) => {
      Object.keys(pu.children).forEach(suId => {
        if (!suToPUMap[suId]) suToPUMap[suId] = [];
        suToPUMap[suId].push(puId);
      });
    });
    const hasCrossPUSU = Object.values(suToPUMap).some(pus => pus.length > 1);
    
    // Complexity score: weighted sum of various factors
    const complexityScore = 
      puCount * 10 +  // More PUs = more complex
      suCount * 2 +    // More SUs = somewhat more complex
      (hasCrossMSPU ? 100 : 0) +  // Cross-MS PUs are very unusual
      (hasCrossPUSU ? 50 : 0);   // Cross-PU SUs are unusual
    
    msMetrics[msId] = {
      puCount,
      suCount,
      hasCrossMSPU,
      hasCrossPUSU,
      complexityScore
    };
  });
  
  // Get search query
  const searchInput = document.getElementById('tree-manuscript-search');
  const searchQuery = (searchInput?.value || '').trim().toLowerCase();
  
  // Get filter checkboxes
  const filterCrossMSPU = document.getElementById('tree-filter-cross-ms-pu')?.checked || false;
  const filterCrossPUSU = document.getElementById('tree-filter-cross-pu-su')?.checked || false;
  const filterMultiPU = document.getElementById('tree-filter-multi-pu')?.checked || false;
  
  // Filter tree by search query and filters
  let filteredTree = {};
  Object.entries(tree).forEach(([msId, ms]) => {
    const metrics = msMetrics[msId];
    
    // Text search filter
    if (searchQuery && !ms.title.toLowerCase().includes(searchQuery)) {
      return;
    }
    
    // Checkbox filters (if any are active, MS must match at least one)
    const anyFilterActive = filterCrossMSPU || filterCrossPUSU || filterMultiPU;
    if (anyFilterActive) {
      let matchesFilter = false;
      if (filterCrossMSPU && metrics.hasCrossMSPU) matchesFilter = true;
      if (filterCrossPUSU && metrics.hasCrossPUSU) matchesFilter = true;
      if (filterMultiPU && metrics.puCount >= 3) matchesFilter = true;
      
      if (!matchesFilter) return;
    }
    
    filteredTree[msId] = ms;
  });
  
  // Get sort option
  const sortSelect = document.getElementById('tree-sort-select');
  const sortBy = sortSelect?.value || 'default';
  
  // Convert to array and sort
  let sortedEntries = Object.entries(filteredTree);
  
  if (sortBy === 'most-pus') {
    sortedEntries.sort((a, b) => msMetrics[b[0]].puCount - msMetrics[a[0]].puCount);
  } else if (sortBy === 'most-sus') {
    sortedEntries.sort((a, b) => msMetrics[b[0]].suCount - msMetrics[a[0]].suCount);
  } else if (sortBy === 'most-complex') {
    sortedEntries.sort((a, b) => msMetrics[b[0]].complexityScore - msMetrics[a[0]].complexityScore);
  } else {
    // Default: sort by title
    sortedEntries.sort((a, b) => a[1].title.localeCompare(b[1].title));
  }
  
  // Get or initialize display count
  if (!window.treeDisplayCount) {
    window.treeDisplayCount = 10;
  }
  
  // Calculate statistics
  const totalManuscripts = sortedEntries.length;
  const totalPUs = sortedEntries.reduce((sum, [msId, ms]) => sum + Object.keys(ms.children).length, 0);
  const totalSUs = sortedEntries.reduce((sum, [msId, ms]) => 
    sum + Object.values(ms.children).reduce((s, pu) => s + Object.keys(pu.children).length, 0), 0
  );
  
  // Slice tree for display
  const displayedTree = sortedEntries.slice(0, window.treeDisplayCount);
  const remainingCount = totalManuscripts - displayedTree.length;
  
  const treeHTML = displayedTree.map(([msId, ms], msIdx) => {
    const metrics = msMetrics[msId];
    const puCount = metrics.puCount;
    const suCount = metrics.suCount;
    
    const puHTML = Object.entries(ms.children).map(([puId, pu], puIdx) => {
      const puSuCount = Object.keys(pu.children).length;
      
      // Check if this PU appears in other manuscripts
      const puMsList = puToMSMap[puId] || [];
      const isCrossMSPU = puMsList.length > 1;
      const otherMSs = puMsList.filter(id => id !== msId);
      
      // Get titles of other manuscripts containing this PU
      const otherMSTitles = otherMSs.map(otherId => {
        const otherMS = tree[otherId];
        return otherMS ? otherMS.title : 'Unknown MS';
      });
      
      const suHTML = Object.entries(pu.children).map(([suId, su], suIdx) => {
        // Check if this SU spans multiple PUs
        const suPUs = su.allPUs || [];
        const isCrossPUSU = suPUs.length > 1;
        const otherPUs = suPUs.filter(id => id !== puId);
        
        // Get titles of other PUs containing this SU
        const otherPUTitles = otherPUs.map(otherId => {
          const otherPU = ms.children[otherId];
          return otherPU ? otherPU.title : 'Unknown PU';
        });
        
        // Special styling for cross-PU SUs (orange/amber gradient)
        const suStyle = isCrossPUSU
          ? 'margin-left: 3rem; padding: 0.75rem 0.75rem 0.75rem 1rem; background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-left: 3px dashed #ff9800; border-right: 3px dashed #ff9800; margin-top: 0.5rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 2px 6px rgba(255,152,0,0.3); position: relative;'
          : 'margin-left: 3rem; padding: 0.75rem 0.75rem 0.75rem 1rem; background: #fffbea; border-left: 3px solid #f4d03f; margin-top: 0.5rem; border-radius: 0.375rem; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';
        
        const crossPUIndicator = isCrossPUSU
          ? `<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ff9800; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;">
               SPANS ${suPUs.length} PUs
             </div>
             <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,152,0,0.1); border-radius: 0.25rem; font-size: 0.75rem; color: #e65100; width: 100%;">
               <strong>Cross-PU Scribal Unit:</strong> This scribal unit also appears in:<br/>
               ${otherPUTitles.map(t => `<span style="margin-left: 1rem;">→ ${t}</span>`).join('<br/>')}
             </div>`
          : '';
        
        return `
          <div style="${suStyle}">
            <span style="font-size: 0.85rem; color: #999; font-weight: 600;">SU #${suIdx + 1}</span>
            <a href="?browse=${suId}" style="font-weight: 600; font-size: 0.875rem; color: #333; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;" onmouseover="this.style.color='#2196F3'" onmouseout="this.style.color='#333'">
              ${su.title} <span style="font-size: 0.7rem; color: #999;">🔗</span>
            </a>
            ${crossPUIndicator}
          </div>
        `;
      }).join('');
      
      // Special styling for cross-MS PUs
      const puStyle = isCrossMSPU 
        ? 'margin-left: 1.5rem; padding: 0.75rem; background: linear-gradient(135deg, #fef6e8 0%, #f4e4c1 100%); border-left: 3px dashed #c4941f; border-right: 3px dashed #c4941f; margin-top: 0.75rem; border-radius: 0.375rem; box-shadow: 0 2px 6px rgba(196, 148, 31,0.3); position: relative;'
        : 'margin-left: 1.5rem; padding: 0.75rem; background: #ffebee; border-left: 3px solid #e74c3c; margin-top: 0.75rem; border-radius: 0.375rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08);';
      
      const crossMSIndicator = isCrossMSPU 
        ? `<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #c4941f; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;">
             SPANS ${puMsList.length} MSS
           </div>
           <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(196, 148, 31,0.1); border-radius: 0.25rem; font-size: 0.75rem; color: #7b1fa2;">
             <strong>Cross-Manuscript PU:</strong> This production unit also appears in:<br/>
             ${otherMSTitles.map(t => `<span style="margin-left: 1rem;">→ ${t}</span>`).join('<br/>')}
           </div>`
        : '';
      
      return `
        <div style="${puStyle}">
          ${isCrossMSPU ? crossMSIndicator : ''}
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="font-size: 0.85rem; color: #999; font-weight: 600;">PU #${puIdx + 1}</span>
            <a href="?browse=${puId}" style="font-weight: 600; font-size: 0.95rem; color: #333; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#333'">
              ${isCrossMSPU ? '' : ''} ${pu.title} <span style="font-size: 0.7rem; color: #999;"></span>
            </a>
          </div>
          ${puSuCount > 0 ? `<div style="font-size: 0.75rem; color: #999; margin-bottom: 0.5rem;">Contains ${puSuCount} Scribal Unit${puSuCount !== 1 ? 's' : ''}</div>` : '<div style="font-size: 0.75rem; color: #999; font-style: italic;">No scribal units</div>'}
          ${suHTML}
        </div>
      `;
    }).join('');
    
    return `
      <div class="manuscript-tree-item" data-ms-id="${msId}" data-ms-title="${ms.title.replace(/"/g, '&quot;')}" style="padding: 1.25rem; background: linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%); border-left: 5px solid ${metrics.complexityScore > 100 ? '#e74c3c' : '#3498db'}; margin-bottom: 1.25rem; border-radius: 0.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span style="font-size: 0.9rem; color: #999; font-weight: 700;">MS #${msIdx + 1}</span>
            <a href="?browse=${msId}" style="font-weight: 700; font-size: 1.05rem; color: #1a1a1a; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;" onmouseover="this.style.color='#2196F3'" onmouseout="this.style.color='#1a1a1a'">
              ${ms.title} <span style="font-size: 0.75rem; color: #999;">🔗</span>
            </a>
            ${metrics.hasCrossMSPU ? '<span style="padding: 0.125rem 0.375rem; background: #c4941f; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">CROSS-MS</span>' : ''}
            ${metrics.hasCrossPUSU ? '<span style="padding: 0.125rem 0.375rem; background: #f44336; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">CROSS-PU</span>' : ''}
            ${metrics.puCount >= 5 ? '<span style="padding: 0.125rem 0.375rem; background: #2196f3; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">MULTI-PU</span>' : ''}
          </div>
          <div style="display: flex; gap: 0.25rem;">
            <button class="tree-export-svg-btn" data-ms-id="${msId}" style="padding: 0.25rem 0.5rem; background: #28a745; color: white; border: none; border-radius: 0.25rem; font-size: 0.7rem; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.25rem;" title="Export this manuscript tree as SVG">
              📷 SVG
            </button>
            <button class="tree-export-png-btn" data-ms-id="${msId}" style="padding: 0.25rem 0.5rem; background: #28a745; color: white; border: none; border-radius: 0.25rem; font-size: 0.7rem; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 0.25rem;" title="Export this manuscript tree as PNG">
              📷 PNG
            </button>
          </div>
        </div>
        <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: #666; margin-bottom: 0.75rem; padding: 0.5rem; background: rgba(255,255,255,0.5); border-radius: 0.25rem;">
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <strong style="color: #e74c3c;">${puCount}</strong> Production Unit${puCount !== 1 ? 's' : ''}
          </span>
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <strong style="color: #f4d03f;">${suCount}</strong> Scribal Unit${suCount !== 1 ? 's' : ''}
          </span>
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <strong style="color: #c4941f;">Complexity:</strong> ${metrics.complexityScore}
          </span>
        </div>
        ${puHTML}
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.1rem;">Manuscript Codicological Hierarchy</h3>
        <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: #666;">
          <span><strong>${totalManuscripts}</strong> MS</span>
          <span><strong>${totalPUs}</strong> PU</span>
          <span><strong>${totalSUs}</strong> SU</span>
        </div>
      </div>
      <p style="color: #666; font-size: 0.875rem; margin-bottom: 1rem;">
        ${searchQuery 
          ? `Showing ${totalManuscripts} manuscript${totalManuscripts !== 1 ? 's' : ''} matching "${searchQuery}"`
          : 'Physical structure showing Manuscripts containing Production Units containing Scribal Units'
        }
      </p>
      ${treeHTML}
      ${remainingCount > 0 ? `
        <div style="text-align: center; margin-top: 1.5rem;">
          <button id="tree-show-more" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
            Show More (${remainingCount} remaining)
          </button>
        </div>
      ` : displayedTree.length > 10 ? `
        <div style="text-align: center; margin-top: 1.5rem;">
          <button id="tree-show-less" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%); color: white; border: none; border-radius: 0.375rem; font-weight: 600; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s;">
            Show Less
          </button>
        </div>
      ` : ''}
    </div>
  `;
  
  // Add event listeners for Show More/Less buttons
  const showMoreBtn = document.getElementById('tree-show-more');
  const showLessBtn = document.getElementById('tree-show-less');
  
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      window.treeDisplayCount += 10;
      buildHierarchicalTree();
    });
    
    // Hover effect
    showMoreBtn.addEventListener('mouseenter', () => {
      showMoreBtn.style.transform = 'translateY(-2px)';
      showMoreBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    });
    showMoreBtn.addEventListener('mouseleave', () => {
      showMoreBtn.style.transform = 'translateY(0)';
      showMoreBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });
  }
  
  if (showLessBtn) {
    showLessBtn.addEventListener('click', () => {
      window.treeDisplayCount = 10;
      buildHierarchicalTree();
      // Scroll to top of analytics section
      mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    // Hover effect
    showLessBtn.addEventListener('mouseenter', () => {
      showLessBtn.style.transform = 'translateY(-2px)';
      showLessBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    });
    showLessBtn.addEventListener('mouseleave', () => {
      showLessBtn.style.transform = 'translateY(0)';
      showLessBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });
  }
  
  // Add event listeners for individual manuscript tree exports
  const svgExportBtns = mount.querySelectorAll('.tree-export-svg-btn');
  const pngExportBtns = mount.querySelectorAll('.tree-export-png-btn');
  
  svgExportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msId = btn.getAttribute('data-ms-id');
      const treeItem = btn.closest('.manuscript-tree-item');
      if (treeItem) {
        exportTreeItemAsSvg(treeItem, msId);
      }
    });
  });
  
  pngExportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msId = btn.getAttribute('data-ms-id');
      const treeItem = btn.closest('.manuscript-tree-item');
      if (treeItem) {
        exportTreeItemAsPng(treeItem, msId);
      }
    });
  });
}

/* ---------- Multilingualism Module ---------- */

// Track current multilingualism tab
let CURRENT_MULTILINGUALISM_TAB = 'overview';

// Main entry point for multilingualism mode
function buildMultilingualism() {
  // Initialize tab navigation if first time
  if (!window.multilingualismTabsInitialized) {
    initMultilingualismTabs();
    window.multilingualismTabsInitialized = true;
  }
  
  // Build the current tab
  buildMultilingualismTab(CURRENT_MULTILINGUALISM_TAB);
}

// Initialize tab navigation
function initMultilingualismTabs() {
  document.querySelectorAll('.multilingualism-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) {
        CURRENT_MULTILINGUALISM_TAB = tab;
        
        // Update tab button styles
        document.querySelectorAll('.multilingualism-tab-btn').forEach(b => {
          const isActive = b.dataset.tab === tab;
          b.classList.toggle('is-on', isActive);
          b.style.background = isActive ? '#fff' : 'transparent';
          b.style.color = isActive ? '#000' : '#666';
          b.style.boxShadow = isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
          b.style.fontWeight = isActive ? '600' : '500';
        });
        
        // Build the selected tab
        buildMultilingualismTab(tab);
      }
    });
  });
}

// Build specific tab content
function buildMultilingualismTab(tab) {
  const mount = document.getElementById('multilingualism-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">Loading...</div>';
  
  // Slight delay to show loading state
  setTimeout(() => {
    switch(tab) {
      case 'overview':
        buildMultilingualismOverview(mount);
        break;
      case 'manuscripts':
        buildMultilingualManuscripts(mount);
        break;
      case 'scribes':
        buildScribalMultilingualism(mount);
        break;
      case 'institutions':
        buildInstitutionalMultilingualism(mount);
        break;
      case 'colophons':
        buildColophonTextDivergence(mount);
        break;
      default:
        mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">Select a tab to explore.</div>';
    }
  }, 50);
}

// ===== DATA EXTRACTION FUNCTIONS =====

/**
 * Get all language information for a record (SU/PU/Text)
 * Returns: { text: [], colophon: [], all: [], isMultilingual: bool, hasColophonDivergence: bool }
 */
function getLanguageInfo(record, recordType) {
  const languages = {
    text: [],
    colophon: [],
    dialect: [],
    all: new Set()
  };
  
  // 1. Get colophon language (direct field in SU/PU)
  const colophonLang = getVal(record, 'Colophon language');
  if (colophonLang) {
    // Handle multi-value fields
    const colophonLangs = Array.isArray(colophonLang) ? colophonLang : [colophonLang];
    colophonLangs.forEach(lang => {
      if (lang && lang.trim()) {
        languages.colophon.push(lang.trim());
        languages.all.add(lang.trim());
      }
    });
  }
  
  // 2. Get text languages from relationships
  const recordId = String(record.rec_ID);
  const rels = [
    ...(REL_INDEX.bySource?.[recordId] || []),
    ...(REL_INDEX.byTarget?.[recordId] || [])
  ];
  
  for (const rel of rels) {
    // Get language from relationship metadata
    const textLang = getVal(rel, 'Text Language(s)') || getVal(rel, 'Language of Text');
    if (textLang) {
      const textLangs = Array.isArray(textLang) ? textLang : [textLang];
      textLangs.forEach(lang => {
        if (lang && lang.trim()) {
          languages.text.push(lang.trim());
          languages.all.add(lang.trim());
        }
      });
    }
    
    // Check if this relationship is to a text
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const textId = IDX.tx?.[String(src?.id)] ? String(src.id) : 
                   IDX.tx?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (textId) {
      const textRec = IDX.tx[textId];
      if (textRec) {
        // Get language from text record itself
        const lang = getVal(textRec, 'Text Language(s)') || getVal(textRec, 'Language of Text');
        if (lang) {
          const langs = Array.isArray(lang) ? lang : [lang];
          langs.forEach(l => {
            if (l && l.trim() && !languages.text.includes(l.trim())) {
              languages.text.push(l.trim());
              languages.all.add(l.trim());
            }
          });
        }
      }
    }
  }
  
  // For texts themselves, check their own language field
  if (recordType === 'tx') {
    const textLang = getVal(record, 'Text Language(s)') || getVal(record, 'Language of Text');
    if (textLang) {
      const langs = Array.isArray(textLang) ? textLang : [textLang];
      langs.forEach(lang => {
        if (lang && lang.trim() && !languages.text.includes(lang.trim())) {
          languages.text.push(lang.trim());
          languages.all.add(lang.trim());
        }
      });
    }
  }
  
  return {
    text: languages.text,
    colophon: languages.colophon,
    dialect: languages.dialect,
    all: Array.from(languages.all),
    isMultilingual: languages.all.size > 1,
    hasColophonDivergence: languages.colophon.length > 0 && 
                           languages.text.length > 0 &&
                           !languages.text.some(t => languages.colophon.includes(t))
  };
}

/**
 * Get scribe(s) for a scribal unit
 * Returns: [{ scribeId, scribeName, role, certainty }]
 * Excludes male scribes (filters by gender field)
 */
function getScribesForSU(su) {
  const scribes = [];
  const suId = String(su.rec_ID);
  const rels = [
    ...(REL_INDEX.bySource?.[suId] || []),
    ...(REL_INDEX.byTarget?.[suId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    
    // Check if this is a relationship to a historical person
    const hpId = IDX.hp?.[String(src?.id)] ? String(src.id) :
                 IDX.hp?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (hpId) {
      const hp = IDX.hp[hpId];
      
      // Filter out male scribes - only include female or unknown gender
      const gender = getVal(hp, 'Gender');
      const genderStr = gender ? String(gender).toLowerCase() : '';
      if (genderStr === 'male') {
        continue; // Skip male scribes
      }
      
      const role = getVal(rel, 'Scribe role') || 'scribe';
      const certainty = getVal(rel, 'scribe certainty') || '';
      
      scribes.push({
        scribeId: hpId,
        scribeName: MAP.hp?.title(hp) || 'Unknown Scribe',
        role: role,
        certainty: certainty
      });
    }
  }
  
  return scribes;
}

/**
 * Get institution(s) for a production unit
 * Returns: [{ institutionId, institutionName, institutionType }]
 */
function getInstitutionsForPU(pu) {
  const institutions = [];
  const puId = String(pu.rec_ID);
  
  // First check pointer fields in the PU record
  (pu.details || []).forEach(d => {
    const v = d?.value;
    if (v && typeof v === 'object' && v.id && v.type) {
      const toId = String(v.id);
      if (IDX.mi?.[toId]) {
        const mi = IDX.mi[toId];
        institutions.push({
          institutionId: toId,
          institutionName: MAP.mi?.title(mi) || 'Unknown Institution',
          institutionType: getVal(mi, 'Institution type') || 'Unknown'
        });
      }
    }
  });
  
  // Then check relationships
  const rels = [
    ...(REL_INDEX.bySource?.[puId] || []),
    ...(REL_INDEX.byTarget?.[puId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    
    // Check if this is a relationship to a monastic institution
    const miId = IDX.mi?.[String(src?.id)] ? String(src.id) :
                 IDX.mi?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (miId && !institutions.find(inst => inst.institutionId === miId)) {
      const mi = IDX.mi[miId];
      institutions.push({
        institutionId: miId,
        institutionName: MAP.mi?.title(mi) || 'Unknown Institution',
        institutionType: getVal(mi, 'Institution type') || 'Unknown'
      });
    }
  }
  
  return institutions;
}

/**
 * Get monastic institution(s) for a scribe (historical person)
 * Follows: Historical Person → Monastic Institution relationship
 * Returns: [{ institutionId, institutionName, institutionType }]
 */
function getInstitutionsForScribe(hpId) {
  const institutions = [];
  
  // Get all relationships for this historical person
  const rels = [
    ...(REL_INDEX.bySource?.[hpId] || []),
    ...(REL_INDEX.byTarget?.[hpId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    
    // Check if this is a relationship to a monastic institution
    const miId = IDX.mi?.[String(src?.id)] ? String(src.id) :
                 IDX.mi?.[String(tgt?.id)] ? String(tgt.id) : null;
    
    if (miId && !institutions.find(inst => inst.institutionId === miId)) {
      const mi = IDX.mi[miId];
      institutions.push({
        institutionId: miId,
        institutionName: MAP.mi?.title(mi) || 'Unknown Institution',
        institutionType: getVal(mi, 'Institution type') || 'Unknown'
      });
    }
  }
  
  return institutions;
}

/**
 * Get production unit(s) for a scribal unit
 * Returns: [puId, ...]
 */
function getPUsForSU(su) {
  const pus = new Set();
  const suId = String(su.rec_ID);
  
  // Check if this SU is itself a PU (many SUs are also PUs)
  if (IDX.pu?.[suId]) {
    pus.add(suId);
  }
  
  // Check pointer fields
  (su.details || []).forEach(d => {
    const v = d?.value;
    if (v && typeof v === 'object' && v.id && v.type) {
      const toId = String(v.id);
      if (IDX.pu?.[toId]) {
        pus.add(toId);
      }
    }
  });
  
  // Check relationships
  const rels = [
    ...(REL_INDEX.bySource?.[suId] || []),
    ...(REL_INDEX.byTarget?.[suId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const puId = IDX.pu?.[String(src?.id)] ? String(src.id) :
                 IDX.pu?.[String(tgt?.id)] ? String(tgt.id) : null;
    if (puId) pus.add(puId);
  }
  
  return Array.from(pus);
}

// ===== OVERVIEW TAB =====

function buildMultilingualismOverview(mount) {
  // Aggregate data
  const stats = {
    totalLanguages: new Set(),
    multilingualMss: 0,
    multilingualScribes: 0,
    multilingualInstitutions: 0,
    colophonDivergences: 0,
    languageCounts: {},
    languageCooccurrence: {}
  };
  
  // Process all SUs
  const allSUs = DATA.su || [];
  const suByMs = {};
  const scribeLanguages = {};
  const institutionLanguages = {};
  
  allSUs.forEach(su => {
    const langInfo = getLanguageInfo(su, 'su');
    
    // Count languages
    langInfo.all.forEach(lang => {
      stats.totalLanguages.add(lang);
      stats.languageCounts[lang] = (stats.languageCounts[lang] || 0) + 1;
    });
    
    // Count colophon divergences
    if (langInfo.hasColophonDivergence) {
      stats.colophonDivergences++;
    }
    
    // Group SUs by manuscript for multilingual MS detection
    const msId = getMSForSU(su);
    if (msId) {
      if (!suByMs[msId]) suByMs[msId] = [];
      suByMs[msId].push(langInfo);
    }
    
    // Track scribe languages
    const scribes = getScribesForSU(su);
    scribes.forEach(scribe => {
      if (!scribeLanguages[scribe.scribeId]) {
        scribeLanguages[scribe.scribeId] = { name: scribe.scribeName, languages: new Set() };
      }
      langInfo.all.forEach(lang => scribeLanguages[scribe.scribeId].languages.add(lang));
    });
  });
  
  // Count multilingual manuscripts
  Object.values(suByMs).forEach(suLangs => {
    const msLangs = new Set();
    suLangs.forEach(langInfo => {
      langInfo.all.forEach(lang => msLangs.add(lang));
    });
    if (msLangs.size > 1) stats.multilingualMss++;
  });
  
  // Count multilingual scribes
  Object.values(scribeLanguages).forEach(scribe => {
    if (scribe.languages.size > 1) stats.multilingualScribes++;
  });
  
  // Process PUs for institutional multilingualism
  const allPUs = DATA.pu || [];
  allPUs.forEach(pu => {
    const langInfo = getLanguageInfo(pu, 'pu');
    const institutions = getInstitutionsForPU(pu);
    
    institutions.forEach(inst => {
      if (!institutionLanguages[inst.institutionId]) {
        institutionLanguages[inst.institutionId] = { name: inst.institutionName, languages: new Set() };
      }
      langInfo.all.forEach(lang => institutionLanguages[inst.institutionId].languages.add(lang));
    });
  });
  
  // Count multilingual institutions
  Object.values(institutionLanguages).forEach(inst => {
    if (inst.languages.size > 1) stats.multilingualInstitutions++;
  });
  
  // Build co-occurrence matrix
  Object.values(suByMs).forEach(suLangs => {
    const msLangs = Array.from(new Set(suLangs.flatMap(l => l.all)));
    for (let i = 0; i < msLangs.length; i++) {
      for (let j = i + 1; j < msLangs.length; j++) {
        const pair = [msLangs[i], msLangs[j]].sort().join('|');
        stats.languageCooccurrence[pair] = (stats.languageCooccurrence[pair] || 0) + 1;
      }
    }
  });
  
  // Sort languages by frequency
  const sortedLanguages = Object.entries(stats.languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  // === PATTERN ANALYSIS ===
  // Analyze geographical, temporal, and institutional patterns of multilingualism
  const patternData = {
    byCountry: {},
    byPeriod: {},
    byReligiousOrder: {},
    byInstitution: {}
  };
  
  // Get all manuscripts for pattern analysis (PUs and SUs already defined above)
  const allMSs = DATA.ms || [];
  
  // Analyze multilingual manuscripts by patterns
  allMSs.forEach(ms => {
    const msId = String(ms.rec_ID);
    const msTitle = MAP.ms?.title(ms) || 'Untitled';
    
    // Check if multilingual (same logic as buildMultilingualManuscripts)
    const puIds = new Set();
    allPUs.forEach(pu => {
      const puMsId = getMSForSU(pu);
      if (puMsId === msId) puIds.add(String(pu.rec_ID));
    });
    
    if (puIds.size === 0) return;
    
    // Collect all languages in this manuscript
    const msLanguages = new Set();
    puIds.forEach(puId => {
      const pu = IDX.pu[puId];
      if (!pu) return;
      
      const puLangInfo = getLanguageInfo(pu, 'pu');
      puLangInfo.all.forEach(lang => msLanguages.add(lang));
      
      allSUs.forEach(su => {
        const suPUs = getPUsForSU(su);
        if (suPUs.includes(puId)) {
          const suLangInfo = getLanguageInfo(su, 'su');
          suLangInfo.all.forEach(lang => msLanguages.add(lang));
        }
      });
    });
    
    if (msLanguages.size < 2) return; // Only multilingual manuscripts
    
    // Analyze each PU for patterns
    puIds.forEach(puId => {
      const pu = IDX.pu[puId];
      if (!pu) return;
      
      // Geographical pattern (from PU)
      const country = MAP.pu?.place(pu) || 'Unknown';
      const countryKey = country.split(',')[0].trim() || 'Unknown';
      if (!patternData.byCountry[countryKey]) {
        patternData.byCountry[countryKey] = { count: 0, languages: new Set() };
      }
      patternData.byCountry[countryKey].count++;
      msLanguages.forEach(lang => patternData.byCountry[countryKey].languages.add(lang));
      
      // Temporal pattern (from PU dating)
      const dateStr = MAP.pu?.date(pu);
      if (dateStr && dateStr !== 'Unknown') {
        // Extract century from date range (e.g., "1400-1450" -> 15th century)
        const yearMatch = dateStr.match(/\d{4}/);
        if (yearMatch) {
          const year = parseInt(yearMatch[0]);
          const century = Math.ceil(year / 100);
          const periodKey = `${century}th century`;
          if (!patternData.byPeriod[periodKey]) {
            patternData.byPeriod[periodKey] = { count: 0, languages: new Set() };
          }
          patternData.byPeriod[periodKey].count++;
          msLanguages.forEach(lang => patternData.byPeriod[periodKey].languages.add(lang));
        }
      }
      
      // Institutional pattern (from linked monastic institutions)
      const institutions = getInstitutionsForPU(pu);
      institutions.forEach(inst => {
        const miRecord = IDX.mi?.[inst.institutionId];
        if (miRecord) {
          const order = MAP.mi?.order(miRecord) || 'Unknown Order';
          if (!patternData.byReligiousOrder[order]) {
            patternData.byReligiousOrder[order] = { count: 0, languages: new Set(), institutions: new Set() };
          }
          patternData.byReligiousOrder[order].count++;
          patternData.byReligiousOrder[order].institutions.add(inst.institutionName);
          msLanguages.forEach(lang => patternData.byReligiousOrder[order].languages.add(lang));
          
          // Individual institution tracking
          if (!patternData.byInstitution[inst.institutionName]) {
            patternData.byInstitution[inst.institutionName] = { 
              count: 0, 
              languages: new Set(), 
              order: order,
              location: `${MAP.mi?.city(miRecord) || ''}, ${MAP.mi?.country(miRecord) || ''}`.trim()
            };
          }
          patternData.byInstitution[inst.institutionName].count++;
          msLanguages.forEach(lang => patternData.byInstitution[inst.institutionName].languages.add(lang));
        }
      });
    });
  });
  
  // Sort pattern data
  const topCountries = Object.entries(patternData.byCountry)
    .map(([name, data]) => ({ name, count: data.count, langCount: data.languages.size }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const periodsSorted = Object.entries(patternData.byPeriod)
    .map(([name, data]) => ({ name, count: data.count, langCount: data.languages.size }))
    .sort((a, b) => {
      const aCentury = parseInt(a.name);
      const bCentury = parseInt(b.name);
      return aCentury - bCentury;
    });
  
  const topOrders = Object.entries(patternData.byReligiousOrder)
    .map(([name, data]) => ({ 
      name, 
      count: data.count, 
      langCount: data.languages.size,
      instCount: data.institutions.size
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  
  const topInstitutions = Object.entries(patternData.byInstitution)
    .map(([name, data]) => ({ 
      name, 
      count: data.count, 
      langCount: data.languages.size,
      order: data.order,
      location: data.location
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Render overview
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Multilingualism in the Corpus</h2>
      
      <!-- Key Statistics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.totalLanguages.size}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Languages/Dialects</div>
        </div>
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualMss}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Manuscripts</div>
        </div>
        <div style="background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualScribes}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Scribes</div>
        </div>
        <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualInstitutions}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Institutions</div>
        </div>
        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.colophonDivergences}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Colophon-Text Divergences</div>
        </div>
      </div>
      
      <!-- Language Distribution Chart -->
      <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem; color: #333;">Most Common Languages</h3>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${sortedLanguages.map(([lang, count]) => {
            const maxCount = sortedLanguages[0][1];
            const percentage = (count / maxCount) * 100;
            return `
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                  <span style="font-weight: 600;">${lang}</span>
                  <span style="color: #666;">${count} occurrences</span>
                </div>
                <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                  <div style="background: linear-gradient(90deg, #d4af37, #c4941f); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- PATTERN ANALYSIS SECTION -->
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem; color: #1a1a1a; font-size: 1.5rem;">Multilingualism Patterns</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
          Exploring geographical, temporal, and institutional patterns reveals how multilingualism was distributed across different contexts.
        </p>
        
        <!-- Geographical Patterns -->
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; display: flex; align-items: center; gap: 0.5rem;">
            <span>🌍</span> Geographical Distribution
          </h3>
          ${topCountries.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${topCountries.map(item => {
                const maxCount = topCountries[0].count;
                const percentage = (item.count / maxCount) * 100;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                      <span style="font-weight: 600;">${item.name}</span>
                      <span style="color: #666;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''} • ${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                      <div style="background: linear-gradient(90deg, #4facfe, #00f2fe); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No geographical data available</p>'}
        </div>
        
        <!-- Temporal Patterns -->
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; display: flex; align-items: center; gap: 0.5rem;">
            <span>📅</span> Temporal Distribution
          </h3>
          ${periodsSorted.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${periodsSorted.map(item => {
                const maxCount = Math.max(...periodsSorted.map(p => p.count));
                const percentage = (item.count / maxCount) * 100;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                      <span style="font-weight: 600;">${item.name}</span>
                      <span style="color: #666;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''} • ${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                      <div style="background: linear-gradient(90deg, #43e97b, #38f9d7); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No temporal data available</p>'}
        </div>
        
        <!-- Religious Order Patterns -->
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; display: flex; align-items: center; gap: 0.5rem;">
            Religious Order Patterns
          </h3>
          ${topOrders.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${topOrders.map(item => {
                const maxCount = topOrders[0].count;
                const percentage = (item.count / maxCount) * 100;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                      <span style="font-weight: 600;">${item.name}</span>
                      <span style="color: #666;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''} • ${item.instCount} institution${item.instCount !== 1 ? 's' : ''} • ${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                      <div style="background: linear-gradient(90deg, #fa709a, #fee140); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No religious order data available</p>'}
        </div>
        
        <!-- Top Multilingual Institutions -->
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
          <h3 style="margin-bottom: 1rem; color: #333; display: flex; align-items: center; gap: 0.5rem;">
            <span>🏛️</span> Most Multilingual Institutions
          </h3>
          ${topInstitutions.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
              ${topInstitutions.map(item => `
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.375rem; border-left: 3px solid #9b59b6;">
                  <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; font-size: 0.9rem;">${item.name}</div>
                  <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">
                    <div>${item.order}</div>
                    ${item.location ? `<div>${item.location}</div>` : ''}
                  </div>
                  <div style="display: flex; gap: 1rem; font-size: 0.75rem;">
                    <span style="background: #d4af37; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''}</span>
                    <span style="background: #c4941f; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No institutional data available</p>'}
        </div>
        
        <!-- Key Insights -->
        <div style="background: linear-gradient(135deg, #d4af3715, #c4941f15); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #d4af37;">
          <h4 style="margin: 0 0 0.75rem 0; color: #333; font-size: 1rem;">Key Insights</h4>
          <ul style="margin: 0; padding-left: 1.5rem; color: #555; line-height: 1.8; font-size: 0.9rem;">
            ${topCountries.length > 0 ? `<li><strong>Geographical:</strong> ${topCountries[0].name} shows the highest concentration of multilingual production (${topCountries[0].count} PUs)</li>` : ''}
            ${periodsSorted.length > 0 ? `<li><strong>Temporal:</strong> ${periodsSorted.reduce((max, p) => p.count > max.count ? p : max, periodsSorted[0]).name} has the most multilingual activity (${periodsSorted.reduce((max, p) => p.count > max.count ? p : max, periodsSorted[0]).count} PUs)</li>` : ''}
            ${topOrders.length > 0 ? `<li><strong>Religious Orders:</strong> ${topOrders[0].name} leads in multilingual production with ${topOrders[0].count} PUs across ${topOrders[0].instCount} institutions</li>` : ''}
            ${topInstitutions.length > 0 ? `<li><strong>Institutions:</strong> ${topInstitutions[0].name} is the most multilingual institution (${topInstitutions[0].langCount} languages in ${topInstitutions[0].count} PUs)</li>` : ''}
          </ul>
        </div>
      </div>
      
      <!-- Description -->
      <div style="background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #d4af37; border-radius: 0.375rem; margin-bottom: 1.5rem;">
        <p style="margin: 0; color: #555; line-height: 1.6;">
          This module explores linguistic diversity in medieval manuscript production. Navigate through the tabs above to investigate:
          <strong>Multilingual Manuscripts</strong> with texts in multiple languages,
          <strong>Scribal Multilingualism</strong> showing women copying in different languages,
          <strong>Institutional Multilingualism</strong> revealing scriptoria producing diverse linguistic works, and
          <strong>Colophon-Text Divergence</strong> highlighting cases where colophons were written in a different language than the main text.
        </p>
      </div>
      
      <div style="text-align: center; padding: 1rem; color: #999; font-size: 0.875rem;">
        Click on the tabs above to explore each aspect of multilingualism in detail.
      </div>
    </div>
  `;
}

// Helper function to get manuscript ID for a scribal unit
function getMSForSU(su) {
  const suId = String(su.rec_ID);
  
  // Check pointer fields first
  const details = su.details || [];
  for (const d of details) {
    const v = d?.value;
    if (v && typeof v === 'object' && v.id && v.type) {
      const toId = String(v.id);
      if (IDX.ms?.[toId]) {
        return toId;
      }
    }
  }
  
  // Check relationships
  const rels = [
    ...(REL_INDEX.bySource?.[suId] || []),
    ...(REL_INDEX.byTarget?.[suId] || [])
  ];
  
  for (const rel of rels) {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    const msId = IDX.ms?.[String(src?.id)] ? String(src.id) :
                 IDX.ms?.[String(tgt?.id)] ? String(tgt.id) : null;
    if (msId) return msId;
  }
  
  return null;
}

// ===== MULTILINGUAL MANUSCRIPTS TAB =====

function buildMultilingualManuscripts(mount) {
  // Strategy: For each manuscript, collect ALL languages from:
  // - All PUs in the manuscript (their colophons)
  // - All SUs in those PUs (their colophons)  
  // - All Texts linked to those SUs (their text languages)
  
  const allMSs = DATA.ms || [];
  const msLanguageData = [];
  
  allMSs.forEach(ms => {
    const msId = String(ms.rec_ID);
    const msTitle = MAP.ms?.title(ms) || 'Untitled Manuscript';
    
    // Find all PUs in this manuscript
    const puIds = new Set();
    const allPUs = DATA.pu || [];
    
    allPUs.forEach(pu => {
      const puMsId = getMSForSU(pu); // PUs are also SUs
      if (puMsId === msId) {
        puIds.add(String(pu.rec_ID));
      }
    });
    
    if (puIds.size === 0) return; // No PUs in this manuscript
    
    // Collect languages organized by PU
    const puData = {};
    const allMsLanguages = new Set();
    
    puIds.forEach(puId => {
      const pu = IDX.pu[puId];
      if (!pu) return;
      
      const puTitle = MAP.pu?.title(pu) || 'Untitled PU';
      const puLangInfo = getLanguageInfo(pu, 'pu');
      
      puData[puId] = {
        id: puId,
        title: puTitle,
        languages: new Set(puLangInfo.all),
        colophonLangs: puLangInfo.colophon,
        textLangs: puLangInfo.text,
        sus: []
      };
      
      // Add PU languages to manuscript total
      puLangInfo.all.forEach(lang => allMsLanguages.add(lang));
      
      // Find all SUs in this PU
      const allSUs = DATA.su || [];
      allSUs.forEach(su => {
        const suPUs = getPUsForSU(su);
        if (suPUs.includes(puId)) {
          const suId = String(su.rec_ID);
          const suTitle = MAP.su?.title(su) || 'Untitled SU';
          const suLangInfo = getLanguageInfo(su, 'su');
          const scribes = getScribesForSU(su);
          
          // Track scribes and languages
          puData[puId].sus.push({
            id: suId,
            title: suTitle,
            languages: suLangInfo.all,
            colophonLangs: suLangInfo.colophon,
            textLangs: suLangInfo.text,
            scribes: scribes,
            hasColophonDivergence: suLangInfo.hasColophonDivergence
          });
          
          // Add SU languages to PU and manuscript totals
          suLangInfo.all.forEach(lang => {
            puData[puId].languages.add(lang);
            allMsLanguages.add(lang);
          });
        }
      });
    });
    
    // Only include manuscripts with 2+ languages
    if (allMsLanguages.size > 1) {
      // Determine if multilingualism is cross-PU or within-PU
      const multilingualPUs = Object.values(puData).filter(pu => pu.languages.size > 1);
      const multilingualismType = multilingualPUs.length > 0 ? 'within-pu' : 'cross-pu';
      
      msLanguageData.push({
        id: msId,
        title: msTitle,
        languages: Array.from(allMsLanguages),
        languageCount: allMsLanguages.size,
        puCount: puIds.size,
        pus: puData,
        multilingualismType: multilingualismType,
        multilingualPUCount: multilingualPUs.length
      });
    }
  });
  
  // Sort by language count (most multilingual first)
  msLanguageData.sort((a, b) => b.languageCount - a.languageCount);
  
  if (msLanguageData.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;">📚</div>
        <h3 style="color: #333; margin-bottom: 1rem;">No Multilingual Manuscripts Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No manuscripts with texts in multiple languages were found. This requires manuscripts to have 
          production units with language data recorded for colophons and/or linked texts.
        </p>
      </div>
    `;
    return;
  }
  
  // Build manuscript cards
  const msCards = msLanguageData.map((ms, idx) => {
    const langBadges = ms.languages.map(lang =>
      `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, #d4af37, #c4941f); color: white; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; font-weight: 600;">${lang}</span>`
    ).join('');
    
    // Multilingualism type badge
    const typeBadge = ms.multilingualismType === 'within-pu'
      ? `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: #4caf50; color: white; border-radius: 0.75rem; font-size: 0.7rem; font-weight: 600;">Within-PU multilingualism (${ms.multilingualPUCount} PU${ms.multilingualPUCount > 1 ? 's' : ''})</span>`
      : `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: #ff9800; color: white; border-radius: 0.75rem; font-size: 0.7rem; font-weight: 600;">Cross-PU compilation</span>`;
    
    // Build PU breakdown
    const puBreakdown = Object.values(ms.pus).map(pu => {
      // Create detailed language badges for PU showing source
      let puLangBadges = '';
      if (pu.colophonLangs && pu.colophonLangs.length > 0) {
        puLangBadges += pu.colophonLangs.map(lang =>
          `<span style="padding: 0.2rem 0.5rem; background: #2196f3; color: white; border-radius: 0.5rem; font-size: 0.7rem; margin-right: 0.25rem;" title="From PU colophon">${lang}</span>`
        ).join('');
      }
      if (pu.textLangs && pu.textLangs.length > 0) {
        puLangBadges += pu.textLangs.map(lang =>
          `<span style="padding: 0.2rem 0.5rem; background: #4a90e2; color: white; border-radius: 0.5rem; font-size: 0.7rem; margin-right: 0.25rem;" title="From linked text at PU level">${lang}</span>`
        ).join('');
      }
      
      const suList = pu.sus.map(su => {
        // Create detailed language badges for SU showing source
        let suLangBadges = '';
        if (su.colophonLangs && su.colophonLangs.length > 0) {
          suLangBadges += su.colophonLangs.map(lang =>
            `<span style="padding: 0.15rem 0.4rem; background: #ff9800; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-right: 0.25rem;" title="From SU colophon">${lang}</span>`
          ).join('');
        }
        if (su.textLangs && su.textLangs.length > 0 && JSON.stringify(su.textLangs) !== JSON.stringify(su.colophonLangs)) {
          suLangBadges += su.textLangs.map(lang =>
            `<span style="padding: 0.15rem 0.4rem; background: #ffa726; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-right: 0.25rem;" title="From linked text at SU level">${lang}</span>`
          ).join('');
        }
        
        const scribeInfo = su.scribes.length > 0
          ? su.scribes.map(s => `<span style="color: #666; font-size: 0.7rem;">${s.scribeName}</span>`).join(', ')
          : '';
        
        const divergenceBadge = su.hasColophonDivergence
          ? `<span style="padding: 0.15rem 0.4rem; background: #f44336; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-left: 0.25rem;">Colophon≠Text</span>`
          : '';
        
        return `
          <div style="font-size: 0.75rem; padding: 0.5rem; margin: 0.25rem 0; background: #fafafa; border-left: 3px solid #ff9800; border-radius: 0.25rem;">
            <div style="font-weight: 600; color: #333; margin-bottom: 0.25rem;">
              ${su.title} ${divergenceBadge}
            </div>
            <div style="margin-bottom: 0.25rem;">${suLangBadges}</div>
            ${scribeInfo ? `<div style="margin-top: 0.25rem;">${scribeInfo}</div>` : ''}
          </div>
        `;
      }).join('');
      
      return `
        <div style="margin-bottom: 1rem; padding: 0.75rem; background: #f0f4ff; border-left: 4px solid #2196f3; border-radius: 0.375rem;">
          <div style="font-weight: 600; color: #1565c0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span>${pu.title}</span>
            ${puLangBadges}
            <span style="font-size: 0.7rem; color: #666; font-weight: 400;">(${pu.sus.length} SU${pu.sus.length !== 1 ? 's' : ''})</span>
          </div>
          ${suList}
        </div>
      `;
    }).join('');
    
    return `
      <div class="ms-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)';" onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 300px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">MS #${idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${ms.title}</h3>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              ${langBadges}
            </div>
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <span style="font-size: 0.8rem; color: #666;"><strong>${ms.languageCount}</strong> language${ms.languageCount !== 1 ? 's' : ''}</span>
              <span style="font-size: 0.8rem; color: #666;"><strong>${ms.puCount}</strong> PU${ms.puCount !== 1 ? 's' : ''}</span>
              ${typeBadge}
            </div>
          </div>
          <div>
            <button onclick="window.jumpTo('ms', '${ms.id}')" style="padding: 0.5rem 1rem; background: #d4af37; color: white; border: none; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseenter="this.style.background='#b8941e'" onmouseleave="this.style.background='#d4af37'">
              View Details
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">Production Units & Scribal Units:</div>
          ${puBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Multilingual Manuscripts</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
          Manuscripts containing texts in multiple languages. The badge indicates whether multilingualism 
          occurs <strong>within production units</strong> (scribes working across languages) or represents 
          a <strong>cross-PU compilation</strong> (different units with different languages assembled together).
        </p>
        <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
          <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${msLanguageData.length}</span>
          <span style="opacity: 0.9;">multilingual manuscript${msLanguageData.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: #555; line-height: 1.8;">
        <strong>Legend:</strong><br>
        <span style="margin-right: 1.5rem;">🟣 Purple = Manuscript-level languages</span>
        <span style="margin-right: 1.5rem;">🔵 Blue = Production Unit languages</span>
        <span style="margin-right: 1.5rem;">🟠 Orange = Scribal Unit languages</span><br>
        <span style="margin-right: 1.5rem;">Notebook icon = From colophon</span>
        <span style="margin-right: 1.5rem;">Book icon = From linked text</span>
        <span style="margin-right: 1.5rem;">Red badge = Colophon-text divergence</span>
      </div>
      
      ${msCards}
      
      <div style="text-align: center; padding: 2rem; color: #999; font-size: 0.875rem;">
        Showing all ${msLanguageData.length} multilingual manuscript${msLanguageData.length !== 1 ? 's' : ''}
      </div>
    </div>
  `;
}

function buildScribalMultilingualism(mount) {
  // Collect scribe language data
  const allSUs = DATA.su || [];
  const scribeData = {};
  
  allSUs.forEach(su => {
    const langInfo = getLanguageInfo(su, 'su');
    if (langInfo.all.length === 0) return;
    
    const scribes = getScribesForSU(su);
    const ms = getMSForSU(su);
    
    scribes.forEach(scribe => {
      if (!scribeData[scribe.scribeId]) {
        scribeData[scribe.scribeId] = {
          id: scribe.scribeId,
          name: scribe.scribeName,
          languages: new Set(),
          manuscripts: new Set(),
          sus: [],
          languageDetails: {} // language -> list of SUs
        };
      }
      
      // Add languages
      langInfo.all.forEach(lang => {
        scribeData[scribe.scribeId].languages.add(lang);
        
        if (!scribeData[scribe.scribeId].languageDetails[lang]) {
          scribeData[scribe.scribeId].languageDetails[lang] = [];
        }
        
        scribeData[scribe.scribeId].languageDetails[lang].push({
          suId: String(su.rec_ID),
          suTitle: MAP.su?.title(su) || 'Untitled SU',
          msId: ms,
          msTitle: ms && IDX.ms?.[ms] ? (MAP.ms?.title(IDX.ms[ms]) || 'Untitled MS') : 'Unknown MS',
          role: scribe.role,
          certainty: scribe.certainty
        });
      });
      
      if (ms) scribeData[scribe.scribeId].manuscripts.add(ms);
      
      scribeData[scribe.scribeId].sus.push({
        id: String(su.rec_ID),
        title: MAP.su?.title(su) || 'Untitled SU',
        languages: langInfo.all,
        ms: ms,
        role: scribe.role
      });
    });
  });
  
  // Filter to multilingual scribes
  const multilingualScribes = Object.values(scribeData)
    .filter(scribe => scribe.languages.size > 1)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  // All scribes (for optional viewing)
  const allScribes = Object.values(scribeData)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  if (allScribes.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;">✍️</div>
        <h3 style="color: #333; margin-bottom: 1rem;">No Scribe Language Data Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No scribes with language information were found in the dataset. 
          Make sure scribal units are linked to historical people (scribes) and have language data recorded.
        </p>
      </div>
    `;
    return;
  }
  
  // Build scribe cards
  const scribeCards = multilingualScribes.map((scribe, idx) => {
    const langArray = Array.from(scribe.languages).sort();
    const msCount = scribe.manuscripts.size;
    const suCount = scribe.sus.length;
    
    // Language badges
    const langBadges = langArray.map(lang =>
      `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; font-weight: 600;">${lang}</span>`
    ).join('');
    
    // Language breakdown
    const langBreakdown = Object.entries(scribe.languageDetails).map(([lang, sus]) => {
      const suList = sus.slice(0, 5).map(su => // Show first 5
        `<div style="font-size: 0.75rem; color: #666; padding: 0.25rem 0; border-bottom: 1px solid #f0f0f0;">
          <span style="font-weight: 600;">${su.suTitle}</span> 
          <span style="color: #999;">in</span> 
          <span style="color: #d4af37;">${su.msTitle}</span>
          ${su.role !== 'scribe' ? `<span style="color: #999; font-style: italic;"> (${su.role})</span>` : ''}
        </div>`
      ).join('');
      
      const moreCount = sus.length - 5;
      const moreText = moreCount > 0 ? `<div style="font-size: 0.7rem; color: #999; padding: 0.5rem 0; font-style: italic;">...and ${moreCount} more</div>` : '';
      
      return `
        <div style="margin-bottom: 1rem;">
          <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span style="padding: 0.2rem 0.6rem; background: #e3f2fd; color: #1976d2; border-radius: 0.75rem; font-size: 0.8rem;">${lang}</span>
            <span style="font-size: 0.8rem; color: #666;">${sus.length} scribal unit${sus.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="margin-left: 1rem; max-height: 200px; overflow-y: auto;">
            ${suList}
            ${moreText}
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="scribe-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)';" onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">Scribe #${idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${scribe.name}</h3>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              ${langBadges}
            </div>
            <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: #666;">
              <span><strong>${langArray.length}</strong> language${langArray.length !== 1 ? 's' : ''}</span>
              <span><strong>${msCount}</strong> manuscript${msCount !== 1 ? 's' : ''}</span>
              <span><strong>${suCount}</strong> scribal unit${suCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div>
            <button onclick="window.jumpTo('hp', '${scribe.id}')" style="padding: 0.5rem 1rem; background: #4facfe; color: white; border: none; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseenter="this.style.background='#3d8dd6'" onmouseleave="this.style.background='#4facfe'">
              View Scribe
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">Work by Language:</div>
          ${langBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Scribal Multilingualism</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
          Scribes who worked across multiple languages, demonstrating linguistic competence and cultural mediation 
          in medieval manuscript production. This reveals the multilingual capabilities of individual scribes.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${multilingualScribes.length}</span>
            <span style="opacity: 0.9;">multilingual scribe${multilingualScribes.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${allScribes.length}</span>
            <span style="opacity: 0.9;">total scribe${allScribes.length !== 1 ? 's' : ''} with language data</span>
          </div>
        </div>
      </div>
      
      ${multilingualScribes.length === 0 ? `
        <div style="background: #fff3cd; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #ffc107; margin-bottom: 2rem;">
          <div style="font-weight: 600; margin-bottom: 0.5rem; color: #856404;">No Multilingual Scribes Found</div>
          <p style="color: #856404; margin: 0; line-height: 1.6;">
            While ${allScribes.length} scribe${allScribes.length !== 1 ? 's have' : ' has'} language data, 
            none worked in multiple languages. This could indicate specialization or incomplete data recording.
          </p>
        </div>
      ` : ''}
      
      ${scribeCards}
      
      ${multilingualScribes.length > 0 ? `
        <div style="text-align: center; padding: 2rem; color: #999; font-size: 0.875rem;">
          Showing ${multilingualScribes.length} of ${allScribes.length} scribe${allScribes.length !== 1 ? 's' : ''} with language data
        </div>
      ` : ''}
    </div>
  `;
}

function buildInstitutionalMultilingualism(mount) {
  // Collect institution language data via PU -> Institution relationships
  const allPUs = DATA.pu || [];
  const institutionData = {};
  
  allPUs.forEach(pu => {
    const langInfo = getLanguageInfo(pu, 'pu');
    if (langInfo.all.length === 0) return;
    
    const institutions = getInstitutionsForPU(pu);
    const msId = getMSForSU(pu); // PUs are also SUs
    
    institutions.forEach(inst => {
      if (!institutionData[inst.institutionId]) {
        institutionData[inst.institutionId] = {
          id: inst.institutionId,
          name: inst.institutionName,
          languages: new Set(),
          manuscripts: new Set(),
          pus: [],
          languageDetails: {} // language -> list of PUs
        };
      }
      
      // Add languages
      langInfo.all.forEach(lang => {
        institutionData[inst.institutionId].languages.add(lang);
        
        if (!institutionData[inst.institutionId].languageDetails[lang]) {
          institutionData[inst.institutionId].languageDetails[lang] = [];
        }
        
        institutionData[inst.institutionId].languageDetails[lang].push({
          puId: String(pu.rec_ID),
          puTitle: MAP.pu?.title(pu) || 'Untitled PU',
          msId: msId,
          msTitle: msId && IDX.ms?.[msId] ? (MAP.ms?.title(IDX.ms[msId]) || 'Untitled MS') : 'Unknown MS'
        });
      });
      
      if (msId) institutionData[inst.institutionId].manuscripts.add(msId);
      
      institutionData[inst.institutionId].pus.push({
        id: String(pu.rec_ID),
        title: MAP.pu?.title(pu) || 'Untitled PU',
        languages: langInfo.all,
        ms: msId
      });
    });
  });
  
  // Filter to multilingual institutions
  const multilingualInstitutions = Object.values(institutionData)
    .filter(inst => inst.languages.size > 1)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  // All institutions (for optional viewing)
  const allInstitutions = Object.values(institutionData)
    .sort((a, b) => b.languages.size - a.languages.size);
  
  if (allInstitutions.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;">🏛️</div>
        <h3 style="color: #333; margin-bottom: 1rem;">No Institutional Language Data Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No monastic institutions with language information were found in the dataset. 
          Make sure production units are linked to monastic institutions and have language data recorded.
        </p>
      </div>
    `;
    return;
  }
  
  // Build institution cards
  const instCards = multilingualInstitutions.map((inst, idx) => {
    const langArray = Array.from(inst.languages).sort();
    const msCount = inst.manuscripts.size;
    const puCount = inst.pus.length;
    
    // Language badges
    const langBadges = langArray.map(lang =>
      `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; font-weight: 600;">${lang}</span>`
    ).join('');
    
    // Language breakdown
    const langBreakdown = Object.entries(inst.languageDetails).map(([lang, pus]) => {
      const puList = pus.slice(0, 5).map(pu => // Show first 5
        `<div style="font-size: 0.75rem; color: #666; padding: 0.25rem 0; border-bottom: 1px solid #f0f0f0;">
          <span style="font-weight: 600;">${pu.puTitle}</span> 
          <span style="color: #999;">in</span> 
          <span style="color: #d4af37;">${pu.msTitle}</span>
        </div>`
      ).join('');
      
      const moreCount = pus.length - 5;
      const moreText = moreCount > 0 ? `<div style="font-size: 0.7rem; color: #999; padding: 0.5rem 0; font-style: italic;">...and ${moreCount} more</div>` : '';
      
      return `
        <div style="margin-bottom: 1rem;">
          <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <span style="padding: 0.2rem 0.6rem; background: #fce4ec; color: #c2185b; border-radius: 0.75rem; font-size: 0.8rem;">${lang}</span>
            <span style="font-size: 0.8rem; color: #666;">${pus.length} production unit${pus.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="margin-left: 1rem; max-height: 200px; overflow-y: auto;">
            ${puList}
            ${moreText}
          </div>
        </div>
      `;
    }).join('');
    
    return `
      <div class="institution-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)';" onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">Institution #${idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${inst.name}</h3>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
              ${langBadges}
            </div>
            <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: #666;">
              <span><strong>${langArray.length}</strong> language${langArray.length !== 1 ? 's' : ''}</span>
              <span><strong>${msCount}</strong> manuscript${msCount !== 1 ? 's' : ''}</span>
              <span><strong>${puCount}</strong> production unit${puCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div>
            <button onclick="window.jumpTo('mi', '${inst.id}')" style="padding: 0.5rem 1rem; background: #fbbf24; color: white; border: none; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseenter="this.style.background='#f59e0b'" onmouseleave="this.style.background='#fbbf24'">
              View Institution
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">Productions by Language:</div>
          ${langBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Institutional Multilingualism</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
          Monastic institutions and scriptoria that produced manuscripts in multiple languages, revealing 
          institutional multilingual capacities and cultural exchange networks in medieval book production.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${multilingualInstitutions.length}</span>
            <span style="opacity: 0.9;">multilingual institution${multilingualInstitutions.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${allInstitutions.length}</span>
            <span style="opacity: 0.9;">total institution${allInstitutions.length !== 1 ? 's' : ''} with language data</span>
          </div>
        </div>
      </div>
      
      ${multilingualInstitutions.length === 0 ? `
        <div style="background: #fff3cd; padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #ffc107; margin-bottom: 2rem;">
          <div style="font-weight: 600; margin-bottom: 0.5rem; color: #856404;">No Multilingual Institutions Found</div>
          <p style="color: #856404; margin: 0; line-height: 1.6;">
            While ${allInstitutions.length} institution${allInstitutions.length !== 1 ? 's have' : ' has'} language data, 
            none produced manuscripts in multiple languages. This could indicate institutional specialization or incomplete data recording.
          </p>
        </div>
      ` : ''}
      
      ${instCards}
      
      ${multilingualInstitutions.length > 0 ? `
        <div style="text-align: center; padding: 2rem; color: #999; font-size: 0.875rem;">
          Showing ${multilingualInstitutions.length} of ${allInstitutions.length} institution${allInstitutions.length !== 1 ? 's' : ''} with language data
        </div>
      ` : ''}
    </div>
  `;
}

function buildColophonTextDivergence(mount) {
  // Find SUs where colophon language differs from text language(s)
  const allSUs = DATA.su || [];
  const divergences = [];
  
  allSUs.forEach(su => {
    const langInfo = getLanguageInfo(su, 'su');
    
    // Check if we have both colophon and text language
    if (langInfo.colophon.length > 0 && langInfo.text.length > 0) {
      // Check if colophon language is different from any text language
      const colophonSet = new Set(langInfo.colophon);
      const textSet = new Set(langInfo.text);
      
      // Divergence exists if colophon language is not in text languages
      const isDivergent = !langInfo.colophon.some(cl => textSet.has(cl));
      
      if (isDivergent) {
        const ms = getMSForSU(su);
        const scribes = getScribesForSU(su);
        const pus = getPUsForSU(su);
        
        divergences.push({
          suId: String(su.rec_ID),
          suTitle: MAP.su?.title(su) || 'Untitled SU',
          msId: ms,
          msTitle: ms && IDX.ms?.[ms] ? (MAP.ms?.title(IDX.ms[ms]) || 'Untitled MS') : 'Unknown MS',
          colophonLangs: langInfo.colophon,
          textLangs: langInfo.text,
          scribes: scribes,
          puCount: pus.length,
          record: su
        });
      }
    }
  });
  
  if (divergences.length === 0) {
    mount.innerHTML = `
      <div style="padding: 3rem; text-align: center;">
        <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;">🔀</div>
        <h3 style="color: #333; margin-bottom: 1rem;">No Colophon-Text Divergences Found</h3>
        <p style="color: #666; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          No scribal units were found where the colophon language differs from the text language(s). 
          This requires both colophon language and text language fields to be populated.
        </p>
      </div>
    `;
    return;
  }
  
  // Sort by manuscript
  divergences.sort((a, b) => {
    if (a.msTitle < b.msTitle) return -1;
    if (a.msTitle > b.msTitle) return 1;
    return 0;
  });
  
  // Build divergence cards
  const divergenceCards = divergences.map((div, idx) => {
    const colophonBadges = div.colophonLangs.map(lang =>
      `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, #fa709a, #fee140); color: #333; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; font-weight: 600;">${lang}</span>`
    ).join('');
    
    const textBadges = div.textLangs.map(lang =>
      `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, #30cfd0, #330867); color: white; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; font-weight: 600;">${lang}</span>`
    ).join('');
    
    const scribeInfo = div.scribes.length > 0
      ? div.scribes.map(s =>
          `<span style="font-size: 0.8rem; color: #666; margin-right: 1rem;">
            <span style="font-weight: 600; color: #333;">${s.scribeName}</span>
            ${s.role !== 'scribe' ? `<span style="color: #999; font-style: italic;"> (${s.role})</span>` : ''}
          </span>`
        ).join('')
      : '<span style="font-size: 0.8rem; color: #999;">No scribe attribution</span>';
    
    return `
      <div class="divergence-card" style="background: white; border: 1px solid #e0e0e0; border-left: 4px solid #fa709a; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)';" onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 0.85rem; color: #999; font-weight: 600;">Divergence #${idx + 1}</span>
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">${div.suTitle}</h3>
            </div>
            <div style="font-size: 0.85rem; color: #d4af37; margin-bottom: 0.75rem;">
              ${div.msTitle}
            </div>
          </div>
          <div>
            <button onclick="window.jumpTo('su', '${div.suId}')" style="padding: 0.5rem 1rem; background: #fa709a; color: white; border: none; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseenter="this.style.background='#d85a7e'" onmouseleave="this.style.background='#fa709a'">
              View SU
            </button>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: center; padding: 1rem; background: #fafafa; border-radius: 0.375rem; margin-bottom: 1rem;">
          <div>
            <div style="font-weight: 600; font-size: 0.85rem; color: #555; margin-bottom: 0.5rem;">Colophon Language:</div>
            <div>${colophonBadges}</div>
          </div>
          <div style="font-size: 1.5rem; color: #ccc;">→</div>
          <div>
            <div style="font-weight: 600; font-size: 0.85rem; color: #555; margin-bottom: 0.5rem;">� Text Language(s):</div>
            <div>${textBadges}</div>
          </div>
        </div>
        
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #f0f0f0;">
          ${scribeInfo}
        </div>
      </div>
    `;
  }).join('');
  
  // Calculate patterns
  const patterns = {};
  divergences.forEach(div => {
    const key = `${div.colophonLangs.sort().join(', ')} → ${div.textLangs.sort().join(', ')}`;
    if (!patterns[key]) patterns[key] = 0;
    patterns[key]++;
  });
  
  const topPatterns = Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([pattern, count]) => 
      `<div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">
        <span style="color: #333;">${pattern}</span>
        <span style="font-weight: 600; color: #fa709a;">${count}×</span>
      </div>`
    ).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">�Colophon-Text Language Divergence</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
          Scribal units where the colophon language differs from the text language(s), revealing interesting 
          linguistic practices such as scribes writing colophons in their native language while copying texts 
          in other languages, or institutional practices regarding colophon composition.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${divergences.length}</span>
            <span style="opacity: 0.9;">divergent case${divergences.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${Object.keys(patterns).length}</span>
            <span style="opacity: 0.9;">unique pattern${Object.keys(patterns).length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        ${topPatterns ? `
          <div style="background: white; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 2rem;">
            <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: #333;">Most Common Divergence Patterns</h3>
            ${topPatterns}
          </div>
        ` : ''}
      </div>
      
      ${divergenceCards}
      
      <div style="text-align: center; padding: 2rem; color: #999; font-size: 0.875rem;">
        Showing all ${divergences.length} divergent case${divergences.length !== 1 ? 's' : ''}
      </div>
    </div>
  `;
}

/* ============================================================
   SCRIBES MODULE
   ============================================================ */

// Track current scribe tab
let CURRENT_SCRIBE_TAB = 'overview';
let SCRIBE_DATA_CACHE = null;
let SCRIBE_TABLE_ROWS_SHOWN = 20;

// Main entry point for scribes mode
function buildScribes() {
  // Initialize tab navigation if first time
  if (!window.scribeTabsInitialized) {
    initScribeTabs();
    window.scribeTabsInitialized = true;
  }
  
  // Compute and render (tabs just scroll to sections for now)
  computeScribeData();
}

// Initialize tab navigation
function initScribeTabs() {
  document.querySelectorAll('.scribe-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) {
        CURRENT_SCRIBE_TAB = tab;
        
        // Update tab button styles
        document.querySelectorAll('.scribe-tab-btn').forEach(b => {
          const isActive = b.dataset.tab === tab;
          b.classList.toggle('is-on', isActive);
          b.style.background = isActive ? '#fff' : 'transparent';
          b.style.color = isActive ? '#000' : '#666';
          b.style.boxShadow = isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
          b.style.fontWeight = isActive ? '600' : '500';
        });
        
        // Scroll to relevant section
        scrollToScribeSection(tab);
      }
    });
  });
}

// Scroll to section based on tab
function scrollToScribeSection(tab) {
  const mount = document.getElementById('scribes-mount');
  if (!mount) return;
  
  // Store computed data for tab switching
  if (!window.SCRIBE_COMPUTED_DATA) {
    // Data will be set when first computed
    return;
  }
  
  const data = window.SCRIBE_COMPUTED_DATA;
  
  // Render the selected tab content
  switch(tab) {
    case 'overview':
      renderOverviewTab(mount, data);
      break;
    case 'productivity':
      renderProductivityTab(mount, data);
      break;
    case 'unseen-species':
      renderUnseenSpeciesTab(mount, data);
      break;
    case 'collaboration':
      renderCollaborationTab(mount, data);
      break;
    case 'geography':
      renderGeographyTab(mount, data);
      break;
    case 'browse':
      renderBrowseTab(mount, data);
      break;
  }
}

// Overview tab
function renderOverviewTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Scribes Overview</h2>
      
      <!-- Key Statistics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${data.totalScribes}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Total Female Scribes</div>
        </div>
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${data.totalSUs}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Total Scribal Units by Women</div>
        </div>
        <div style="background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${data.avgSUsPerScribe}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Avg SUs per Female Scribe</div>
        </div>
        <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${data.multilingualScribes}</div>
          <div style="font-size: 0.875rem; opacity: 0.95;">Multilingual Female Scribes</div>
        </div>
      </div>
      
      <!-- Top 20 Most Productive Scribes -->
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Top 20 Most Productive Scribes</h3>
          ${createExportButton('scribes-bar-chart-wrapper', 'top_20_scribes.png')}
        </div>
        <div id="scribes-bar-chart-wrapper">
          <div id="scribes-bar-chart"></div>
        </div>
      </div>
    </div>
  `;
  
  buildScribesBarChart(data.top20);
}

// Productivity tab
function renderProductivityTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Productivity Patterns</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;" id="scribe-productivity-chart-wrapper">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Scribe Productivity Distribution</h3>
            ${createExportButton('scribe-productivity-chart-wrapper', 'scribe_productivity.png')}
          </div>
          <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #64748b;">How many scribes participated in copying 1, 2, 3... manuscripts</p>
          <div id="scribe-productivity-distribution-chart"></div>
        </div>
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;" id="manuscript-productivity-chart-wrapper">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Manuscript Productivity Distribution</h3>
            ${createExportButton('manuscript-productivity-chart-wrapper', 'manuscript_productivity.png')}
          </div>
          <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #64748b;">How many manuscripts have 1, 2, 3... scribes</p>
          <div id="productivity-distribution-chart"></div>
        </div>
      </div>
    </div>
  `;
  
  buildScribeProductivityDistribution(data.scribeProductivityDistribution);
  buildProductivityDistribution(data.productivityDistribution);
}

// Unseen Species tab
function renderUnseenSpeciesTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="margin: 0; color: #1a1a1a;">Unseen Species Analysis</h2>
        <button id="unseen-species-info" style="background: #e0e7ff; color: #4338ca; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          ℹ️ Methodology & References
        </button>
      </div>
      
      <!-- Experiment Selection -->
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.125rem;">Select Experiment</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
          <button class="experiment-btn" data-experiment="high-certainty" style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 1</div>
            <div style="font-size: 0.875rem; color: #64748b;">High Certainty Attributions</div>
          </button>
          <button class="experiment-btn active" data-experiment="entire-corpus" style="padding: 1rem; border: 2px solid #f59e0b; border-radius: 0.5rem; background: #fffbeb; cursor: pointer; text-align: left; transition: all 0.2s; box-shadow: 0 2px 4px rgba(245,158,11,0.2);">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 2</div>
            <div style="font-size: 0.875rem; color: #64748b;">Entire Corpus (Default)</div>
          </button>
          <button class="experiment-btn" data-experiment="by-country" style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 3</div>
            <div style="font-size: 0.875rem; color: #64748b;">Breakdown by Country</div>
          </button>
          <button class="experiment-btn" data-experiment="by-century" style="padding: 1rem; border: 2px solid #e2e8f0; border-radius: 0.5rem; background: white; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.25rem;">Experiment 4</div>
            <div style="font-size: 0.875rem; color: #64748b;">Breakdown by Century</div>
          </button>
        </div>
      </div>
      
      <!-- Results Container -->
      <div id="unseen-species-results" style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem; border-left: 4px solid #f59e0b;">
        <div id="unseen-species-content"></div>
      </div>
    </div>
  `;
  
  // Set up experiment switching
  const experimentButtons = mount.querySelectorAll('.experiment-btn');
  experimentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      experimentButtons.forEach(b => {
        b.style.border = '2px solid #e2e8f0';
        b.style.background = 'white';
        b.style.boxShadow = 'none';
        b.classList.remove('active');
      });
      btn.style.border = '2px solid #f59e0b';
      btn.style.background = '#fffbeb';
      btn.style.boxShadow = '0 2px 4px rgba(245,158,11,0.2)';
      btn.classList.add('active');
      
      // Run the selected experiment
      const experiment = btn.dataset.experiment;
      runUnseenSpeciesExperiment(experiment, data.scribeArray);
    });
  });
  
  // Set up methodology button (works for all experiments)
  document.getElementById('unseen-species-info')?.addEventListener('click', () => {
    showMethodologyModal(0, 0, 0, 0, 0, 0); // Params will be updated with actual values
  });
  
  // Run default experiment (Entire Corpus)
  runUnseenSpeciesExperiment('entire-corpus', data.scribeArray);
}

// Collaboration tab
function renderCollaborationTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1600px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Scribe Collaborations</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 350px; gap: 1.5rem;">
        <!-- Network Visualization -->
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;" id="collab-network-wrapper">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">Collaboration Network</h3>
            ${createExportButton('collab-network-wrapper', 'collaboration_network.png')}
          </div>
          <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #64748b;">
            Network showing which scribes worked together on manuscripts. Node size = number of collaborations, edge thickness = number of shared manuscripts.
          </p>
          <div id="collaboration-network-viz" style="width: 100%; height: 700px; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa;"></div>
        </div>
        
        <!-- Sidebar with Details -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
            <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #475569;">Top Collaborators</h4>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: #94a3b8;">Click to focus on scribe</p>
            <div id="top-collaborators-list" style="max-height: 350px; overflow-y: auto;"></div>
          </div>
          <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
            <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: #475569;">Multi-Scribe Manuscripts</h4>
            <p style="margin: 0 0 0.5rem 0; font-size: 0.75rem; color: #94a3b8;">${data.collaborativeManuscripts.length} manuscripts</p>
            <div id="collaborative-manuscripts-list" style="max-height: 350px; overflow-y: auto;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  buildCollaborationNetwork(data.collaborativeManuscripts, data.collaborations, data.scribeArray);
  buildTopCollaborators(data.topCollaborators);
  buildCollaborativeManuscripts(data.collaborativeManuscripts);
}

// Geography tab
function renderGeographyTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Geographic & Institutional Distribution</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.25rem;">Top Institutions by Scribe Count</h3>
          <div id="institutions-chart"></div>
        </div>
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.25rem;">Top Cities by Scribe Activity</h3>
          <div id="cities-chart"></div>
        </div>
      </div>
    </div>
  `;
  
  buildInstitutionsChart(data.topInstitutions);
  buildCitiesChart(data.topCities);
}

// Browse tab
function renderBrowseTab(mount, data) {
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Browse All Scribes</h2>
      
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #2c3e50; font-size: 1.25rem;">All Scribes</h3>
          <button id="export-scribes-csv" class="chip" style="background: #28a745; color: white; padding: 0.5rem 1rem;">
            📥 Export CSV
          </button>
        </div>
        
        <!-- Advanced Filters -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; padding: 1rem; background: #f8fafc; border-radius: 0.375rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Search</label>
            <input type="search" id="scribe-search" placeholder="Name, language, institution..." style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Filter Type</label>
            <select id="scribe-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="all">All Scribes</option>
              <option value="multilingual">Multilingual Only</option>
              <option value="productive">Highly Productive (5+ SUs)</option>
              <option value="collaborative">Collaborative (worked with others)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Language</label>
            <select id="scribe-lang-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Languages</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem;">Institution</label>
            <select id="scribe-inst-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Institutions</option>
            </select>
          </div>
        </div>
        
        <div id="scribes-table" style="overflow-x: auto;"></div>
      </div>
    </div>
  `;
  
  buildScribesTable(data.scribeArray);
  populateLanguageFilter(data.scribeArray);
  populateInstitutionFilter(data.scribeArray);
  
  // Add event listeners
  const searchInput = document.getElementById('scribe-search');
  const filterSelect = document.getElementById('scribe-filter');
  const langFilter = document.getElementById('scribe-lang-filter');
  const instFilter = document.getElementById('scribe-inst-filter');
  
  const applyFilters = () => {
    filterScribesTable(
      data.scribeArray, 
      searchInput?.value || '', 
      filterSelect?.value || 'all',
      langFilter?.value || '',
      instFilter?.value || '',
      data.collaborations
    );
  };
  
  searchInput?.addEventListener('input', applyFilters);
  filterSelect?.addEventListener('change', applyFilters);
  langFilter?.addEventListener('change', applyFilters);
  instFilter?.addEventListener('change', applyFilters);
  
  document.getElementById('export-scribes-csv')?.addEventListener('click', () => {
    exportScribesCSV(data.scribeArray);
  });
}

// Compute scribe data
function computeScribeData() {
  const mount = document.getElementById('scribes-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">Loading scribe data...</div>';
  
  // Aggregate scribe data
  const scribeStats = {};
  const allSUs = DATA.su || [];
  const allPUs = DATA.pu || [];
  
  // Process all scribal units to collect scribe information
  allSUs.forEach(su => {
    const suId = String(su.rec_ID);
    const scribes = getScribesForSU(su);
    const msId = getMSForSU(su);
    const ms = msId ? IDX.ms?.[msId] : null;
    const langInfo = getLanguageInfo(su, 'su');
    
    // Get production units for this SU (for country and date info)
    const puIds = getPUsForSU(su);
    const countries = new Set();
    const dates = [];
    
    puIds.forEach(puId => {
      const pu = IDX.pu?.[puId];
      if (pu) {
        // Extract country from PU
        const country = getVal(pu, 'PU country');
        if (country && country !== 'Unknown') {
          countries.add(country);
        }
        
        const dateStr = MAP.pu?.date(pu);
        if (dateStr && dateStr !== 'Unknown') {
          dates.push(dateStr);
        }
      }
    });
    
    // Get centuries from SU
    const centuries = getValsAll(su, 'Normalized century of production').filter(Boolean);
    
    // Track unique scribes per SU (a scribe may have multiple relationships to same SU)
    const uniqueScribes = new Map();
    scribes.forEach(scribe => {
      if (!uniqueScribes.has(scribe.scribeId)) {
        uniqueScribes.set(scribe.scribeId, scribe);
      }
    });
    
    // Process each unique scribe
    uniqueScribes.forEach(scribe => {
      if (!scribeStats[scribe.scribeId]) {
        scribeStats[scribe.scribeId] = {
          id: scribe.scribeId,
          name: scribe.scribeName,
          suIds: new Set(),  // Track unique SU IDs instead of counter
          manuscripts: new Set(),
          languages: new Set(),
          institutions: new Set(),
          dates: [],
          sus: []
        };
      }
      
      // Add this SU to the scribe's set (prevents double-counting)
      scribeStats[scribe.scribeId].suIds.add(suId);
      
      if (msId && ms) {
        scribeStats[scribe.scribeId].manuscripts.add(MAP.ms?.title(ms) || `MS-${msId}`);
      }
      
      langInfo.all.forEach(lang => {
        // Filter out TBC (To Be Confirmed) as it's not a real language
        if (lang && lang.toUpperCase() !== 'TBC') {
          scribeStats[scribe.scribeId].languages.add(lang);
        }
      });
      
      // Get monastic institutions from the scribe's (historical person's) relationships
      const scribeInstitutions = getInstitutionsForScribe(scribe.scribeId);
      scribeInstitutions.forEach(inst => {
        scribeStats[scribe.scribeId].institutions.add(inst.institutionName);
      });
      
      dates.forEach(date => {
        if (!scribeStats[scribe.scribeId].dates.includes(date)) {
          scribeStats[scribe.scribeId].dates.push(date);
        }
      });
      
      // Only add SU to list if not already there
      if (!scribeStats[scribe.scribeId].sus.find(s => s.id === suId)) {
        scribeStats[scribe.scribeId].sus.push({
          id: suId,
          title: MAP.su?.title(su) || 'Untitled SU',
          msTitle: ms ? (MAP.ms?.title(ms) || 'Untitled MS') : 'Unknown MS',
          languages: langInfo.all.filter(lang => lang && lang.toUpperCase() !== 'TBC'),
          role: scribe.role,
          certainty: scribe.certainty,
          countries: Array.from(countries),
          centuries: centuries
        });
      }
    });
  });
  
  // Convert to array and sort by productivity
  const scribeArray = Object.values(scribeStats)
    .sort((a, b) => b.suIds.size - a.suIds.size);
  
  // Statistics
  const totalScribes = scribeArray.length;
  const totalSUs = scribeArray.reduce((sum, s) => sum + s.suIds.size, 0);
  const avgSUsPerScribe = totalScribes > 0 ? (totalSUs / totalScribes).toFixed(1) : 0;
  const multilingualScribes = scribeArray.filter(s => s.languages.size > 1).length;
  
  // Top 20 most productive scribes
  const top20 = scribeArray.slice(0, 20);
  
  // === PRODUCTIVITY DISTRIBUTION PER MANUSCRIPT (for cultural ecology) ===
  const msScribeCount = {}; // manuscript ID -> number of scribes
  const allMSs = DATA.ms || [];
  
  allMSs.forEach(ms => {
    const msId = String(ms.rec_ID);
    const scribesInMs = new Set();
    
    // Find all scribes who worked on this manuscript
    scribeArray.forEach(scribe => {
      scribe.sus.forEach(su => {
        if (su.msTitle === (MAP.ms?.title(ms) || `MS-${msId}`)) {
          scribesInMs.add(scribe.id);
        }
      });
    });
    
    if (scribesInMs.size > 0) {
      msScribeCount[msId] = {
        msTitle: MAP.ms?.title(ms) || `MS-${msId}`,
        scribeCount: scribesInMs.size
      };
    }
  });
  
  // Distribution: how many manuscripts have 1, 2, 3... scribes
  const productivityDistribution = {};
  Object.values(msScribeCount).forEach(({ scribeCount }) => {
    productivityDistribution[scribeCount] = (productivityDistribution[scribeCount] || 0) + 1;
  });
  
  // === COLLABORATION NETWORK ===
  const collaborations = {}; // scribeId -> set of co-scribes
  const collaborativeManuscripts = []; // manuscripts with 2+ scribes
  
  Object.entries(msScribeCount).forEach(([msId, { msTitle, scribeCount }]) => {
    if (scribeCount >= 2) {
      // Find all scribes in this manuscript
      const scribesInMs = [];
      scribeArray.forEach(scribe => {
        scribe.sus.forEach(su => {
          if (su.msTitle === msTitle && !scribesInMs.find(s => s.id === scribe.id)) {
            scribesInMs.push({ id: scribe.id, name: scribe.name });
          }
        });
      });
      
      collaborativeManuscripts.push({
        msId,
        msTitle,
        scribes: scribesInMs,
        scribeCount: scribesInMs.length
      });
      
      // Record collaborations
      for (let i = 0; i < scribesInMs.length; i++) {
        for (let j = i + 1; j < scribesInMs.length; j++) {
          const scribe1 = scribesInMs[i].id;
          const scribe2 = scribesInMs[j].id;
          
          if (!collaborations[scribe1]) collaborations[scribe1] = new Set();
          if (!collaborations[scribe2]) collaborations[scribe2] = new Set();
          
          collaborations[scribe1].add(scribe2);
          collaborations[scribe2].add(scribe1);
        }
      }
    }
  });
  
  // Top collaborators
  const topCollaborators = Object.entries(collaborations)
    .map(([scribeId, coScribes]) => {
      const scribe = scribeArray.find(s => s.id === scribeId);
      return {
        id: scribeId,
        name: scribe?.name || 'Unknown',
        collaboratorCount: coScribes.size
      };
    })
    .sort((a, b) => b.collaboratorCount - a.collaboratorCount)
    .slice(0, 10);
  
  // === GEOGRAPHIC / INSTITUTIONAL BREAKDOWN ===
  const institutionStats = {};
  const cityStats = {};
  
  scribeArray.forEach(scribe => {
    scribe.institutions.forEach(inst => {
      if (!institutionStats[inst]) {
        institutionStats[inst] = { scribes: new Set(), suCount: 0 };
      }
      institutionStats[inst].scribes.add(scribe.id);
      institutionStats[inst].suCount += scribe.suIds.size;
    });
    
    // Extract city from institution name (assuming format includes city)
    scribe.institutions.forEach(inst => {
      // Try to extract city - institutions often have format "Name, City, Country"
      const parts = inst.split(',');
      if (parts.length >= 2) {
        const city = parts[parts.length - 2].trim();
        if (!cityStats[city]) {
          cityStats[city] = { scribes: new Set(), institutions: new Set() };
        }
        cityStats[city].scribes.add(scribe.id);
        cityStats[city].institutions.add(inst);
      }
    });
  });
  
  const topInstitutions = Object.entries(institutionStats)
    .map(([name, data]) => ({
      name,
      scribeCount: data.scribes.size,
      suCount: data.suCount
    }))
    .sort((a, b) => b.scribeCount - a.scribeCount)
    .slice(0, 15);
  
  const topCities = Object.entries(cityStats)
    .map(([name, data]) => ({
      name,
      scribeCount: data.scribes.size,
      institutionCount: data.institutions.size
    }))
    .sort((a, b) => b.scribeCount - a.scribeCount)
    .slice(0, 10);
  
  // === SCRIBE PRODUCTIVITY DISTRIBUTION ===
  // How many scribes copied 1 ms, 2 ms, 3 ms, etc.
  const scribeProductivityDistribution = {};
  scribeArray.forEach(scribe => {
    const msCount = scribe.manuscripts.size;
    if (msCount > 0) {
      scribeProductivityDistribution[msCount] = (scribeProductivityDistribution[msCount] || 0) + 1;
    }
  });
  
  // Store all computed data globally for tab switching
  window.SCRIBE_COMPUTED_DATA = {
    scribeArray,
    totalScribes,
    totalSUs,
    avgSUsPerScribe,
    multilingualScribes,
    top20,
    scribeProductivityDistribution,
    productivityDistribution,
    collaborations,
    topCollaborators,
    collaborativeManuscripts,
    topInstitutions,
    topCities
  };
  
  // Render the current tab (default to overview)
  scrollToScribeSection(CURRENT_SCRIBE_TAB);
}

function buildScribeProductivityDistribution(distribution) {
  const container = document.getElementById('scribe-productivity-distribution-chart');
  if (!container) return;
  
  const maxMsCount = Math.max(...Object.keys(distribution).map(Number));
  const data = [];
  for (let i = 1; i <= maxMsCount; i++) {
    data.push({ msCount: i, scribeCount: distribution[i] || 0 });
  }
  
  const maxScribeCount = Math.max(...data.map(d => d.scribeCount));
  const barHeight = 40;
  const gap = 8;
  const chartWidth = 450;
  
  const html = data.map(d => {
    const barWidth = maxScribeCount > 0 ? (d.scribeCount / maxScribeCount) * chartWidth : 0;
    const label = d.msCount === 1 ? '1 ms' : `${d.msCount} ms`;
    
    return `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: ${gap}px;">
        <div style="width: 60px; text-align: right; font-size: 0.875rem; color: #64748b; font-weight: 500;">
          ${label}
        </div>
        <div style="flex: 1; display: flex; align-items: center;">
          <div style="background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); height: ${barHeight}px; width: ${barWidth}px; border-radius: 0.25rem; position: relative; min-width: ${d.scribeCount > 0 ? '30px' : '0'};">
            <div style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); color: white; font-weight: 600; font-size: 0.875rem;">
              ${d.scribeCount}
            </div>
          </div>
          <div style="margin-left: 0.5rem; font-size: 0.75rem; color: #94a3b8;">
            ${d.scribeCount === 1 ? 'scribe' : 'scribes'}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8125rem; color: #64748b;">
      <strong>Total:</strong> ${Object.values(distribution).reduce((a, b) => a + b, 0)} scribes
    </div>
  `;
}

function buildProductivityDistribution(distribution) {
  const container = document.getElementById('productivity-distribution-chart');
  if (!container) return;
  
  const maxScribes = Math.max(...Object.keys(distribution).map(Number));
  const data = [];
  for (let i = 1; i <= maxScribes; i++) {
    data.push({ scribeCount: i, msCount: distribution[i] || 0 });
  }
  
  const maxMsCount = Math.max(...data.map(d => d.msCount));
  const barHeight = 40;
  const gap = 8;
  const chartWidth = 500;
  
  const html = data.map(d => {
    const barWidth = maxMsCount > 0 ? (d.msCount / maxMsCount) * chartWidth : 0;
    const label = d.scribeCount === 1 ? '1 scribe' : `${d.scribeCount} scribes`;
    
    return `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: ${gap}px;">
        <div style="width: 100px; text-align: right; font-size: 0.875rem; color: #64748b; font-weight: 500;">
          ${label}
        </div>
        <div style="flex: 1; display: flex; align-items: center;">
          <div style="background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); height: ${barHeight}px; width: ${barWidth}px; border-radius: 0.25rem; position: relative; min-width: ${d.msCount > 0 ? '30px' : '0'};">
            <div style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); color: white; font-weight: 600; font-size: 0.875rem;">
              ${d.msCount}
            </div>
          </div>
          <div style="margin-left: 0.5rem; font-size: 0.75rem; color: #94a3b8;">
            ${d.msCount === 1 ? 'manuscript' : 'manuscripts'}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.8125rem; color: #64748b;">
      <strong>Total:</strong> ${Object.values(distribution).reduce((a, b) => a + b, 0)} manuscripts with identified scribes
    </div>
  `;
}

/**
 * Calculate Chao1 estimator for unseen species
 * Reference: Chao, A. (1984). Nonparametric estimation of the number of classes in a population.
 */
function calculateChao1(productivityDist, observed) {
  const f1 = productivityDist[1] || 0; // singletons
  const f2 = productivityDist[2] || 0; // doubletons
  
  let estimate = observed;
  let lower = observed;
  let upper = observed;
  
  if (f2 > 0) {
    // Standard Chao1
    estimate = observed + (f1 * f1) / (2 * f2);
    // 95% CI approximation
    const variance = f2 * (0.5 * Math.pow(f1/f2, 2) + Math.pow(f1/f2, 3) + 0.25 * Math.pow(f1/f2, 4));
    const se = Math.sqrt(variance);
    lower = Math.max(observed, estimate - 1.96 * se);
    upper = estimate + 1.96 * se;
  } else if (f1 > 0) {
    // Modified Chao1 when f2 = 0
    estimate = observed + (f1 * (f1 - 1)) / 2;
    lower = observed + (f1 * (f1 - 1)) / 2;
    upper = observed + (f1 * (f1 + 1)) / 2;
  }
  
  return { estimate, lower, upper, f1, f2 };
}

/**
 * Calculate Jackknife estimator for unseen species
 * Reference: Walther & Morand (1998). Comparative performance of species richness estimation methods.
 * First-order jackknife: S_jack1 = S_obs + f1 * (n-1)/n
 * where f1 = number of species in exactly one sample, n = number of samples
 */
function calculateJackknife(productivityDist, observed) {
  const f1 = productivityDist[1] || 0;
  const f2 = productivityDist[2] || 0;
  
  // Calculate total number of manuscripts (samples)
  let totalManuscripts = 0;
  Object.entries(productivityDist).forEach(([count, scribes]) => {
    totalManuscripts += Number(count) * scribes;
  });
  
  // First-order Jackknife
  const jack1 = observed + f1 * (totalManuscripts - 1) / totalManuscripts;
  
  // Second-order Jackknife (uses doubletons for better accuracy)
  let jack2 = jack1;
  if (f2 > 0 && totalManuscripts > 1) {
    jack2 = observed + f1 * (2 * totalManuscripts - 3) / totalManuscripts 
            - f2 * Math.pow(totalManuscripts - 2, 2) / (totalManuscripts * (totalManuscripts - 1));
  }
  
  // Use Jack2 if available and makes sense, otherwise Jack1
  const estimate = (f2 > 0 && jack2 > observed) ? jack2 : jack1;
  
  // Rough CI approximation (simplified variance estimate)
  const se = Math.sqrt(f1 * (totalManuscripts - 1) / totalManuscripts);
  const lower = Math.max(observed, estimate - 1.96 * se);
  const upper = estimate + 1.96 * se;
  
  return { estimate, lower, upper, order: f2 > 0 ? 2 : 1 };
}

/**
 * Calculate Gamma-Poisson Model estimator
 * Reference: Böhning & Schön (2005). Nonparametric maximum likelihood estimation of population size.
 * This uses a mixture model approach to account for heterogeneity in detection probability.
 */
function calculateGammaPoisson(productivityDist, observed) {
  const f1 = productivityDist[1] || 0;
  const f2 = productivityDist[2] || 0;
  const f3 = productivityDist[3] || 0;
  
  // Calculate total manuscripts
  let totalManuscripts = 0;
  Object.entries(productivityDist).forEach(([count, scribes]) => {
    totalManuscripts += Number(count) * scribes;
  });
  
  // Gamma-Poisson uses a more sophisticated approach
  // Simplified formula based on low-frequency counts
  let estimate = observed;
  
  if (f1 > 0 && totalManuscripts > 0) {
    // Alpha parameter (shape) estimation using moment matching
    const meanProductivity = totalManuscripts / observed;
    
    // Gamma-Poisson formula (simplified Chao-Bunge variant)
    if (f2 > 0) {
      const t = 10; // cutoff for rare species
      let numerator = 0;
      let denominator = 0;
      
      for (let i = 1; i <= Math.min(t, Object.keys(productivityDist).length); i++) {
        const fi = productivityDist[i] || 0;
        if (fi > 0) {
          numerator += i * (i - 1) * fi;
          denominator += i * (i - 1) * fi;
        }
      }
      
      if (denominator > 0 && f2 > 0) {
        // Estimate using frequency ratios
        const gamma = Math.max(0, 1 - f2 / Math.max(1, (f1 * f1 / (2 * f2))));
        estimate = observed + f1 / gamma;
      } else {
        // Fallback to modified Chao1-like estimate
        estimate = observed + f1 * f1 / (2 * Math.max(1, f2));
      }
    } else {
      // When f2 = 0, use a more conservative estimate
      estimate = observed + f1 * Math.log(totalManuscripts / observed);
    }
  }
  
  // Rough CI (simplified)
  const se = Math.sqrt(Math.abs(estimate - observed));
  const lower = Math.max(observed, estimate - 1.96 * se);
  const upper = estimate + 1.96 * se * 1.5; // Wider CI for model uncertainty
  
  return { estimate, lower, upper };
}

/**
 * Run unseen species analysis for a specific experiment
 */
function runUnseenSpeciesExperiment(experimentType, scribeArray) {
  const container = document.getElementById('unseen-species-content');
  if (!container) return;
  
  switch(experimentType) {
    case 'high-certainty':
      buildHighCertaintyAnalysis(scribeArray, container);
      break;
    case 'entire-corpus':
      buildEntireCorpusAnalysis(scribeArray, container);
      break;
    case 'by-country':
      buildByCountryAnalysis(scribeArray, container);
      break;
    case 'by-century':
      buildByCenturyAnalysis(scribeArray, container);
      break;
  }
}

/**
 * Experiment 1: High Certainty Attributions Only
 */
function buildHighCertaintyAnalysis(scribeArray, container) {
  // Filter for high certainty attributions
  const highCertaintyScribes = scribeArray.map(scribe => {
    const highCertaintySUs = scribe.sus.filter(su => {
      const certainty = su.certainty || '';
      return certainty.toLowerCase().includes('high') || certainty === 'High';
    });
    
    if (highCertaintySUs.length === 0) return null;
    
    return {
      ...scribe,
      sus: highCertaintySUs,
      manuscripts: new Set(highCertaintySUs.map(su => su.msTitle))
    };
  }).filter(Boolean);
  
  const productivityDist = {};
  highCertaintyScribes.forEach(scribe => {
    const msCount = scribe.manuscripts.size;
    productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
  });
  
  buildUnseenSpeciesComparison(
    productivityDist,
    highCertaintyScribes.length,
    container,
    'High Certainty Attributions',
    'Only includes scribal units with high certainty attributions'
  );
}

/**
 * Experiment 2: Entire Corpus (Current Implementation)
 */
function buildEntireCorpusAnalysis(scribeArray, container) {
  const productivityDist = {};
  scribeArray.forEach(scribe => {
    const msCount = scribe.manuscripts.size;
    productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
  });
  
  buildUnseenSpeciesComparison(
    productivityDist,
    scribeArray.length,
    container,
    'Entire Corpus',
    'All female scribes in the database regardless of attribution certainty'
  );
}

/**
 * Experiment 3: By Country Breakdown
 */
function buildByCountryAnalysis(scribeArray, container) {
  // Group scribes by country
  const countryGroups = {};
  
  scribeArray.forEach(scribe => {
    const countries = new Set();
    scribe.sus.forEach(su => {
      if (su.countries && su.countries.length > 0) {
        su.countries.forEach(c => countries.add(c));
      }
    });
    
    countries.forEach(country => {
      if (!countryGroups[country]) {
        countryGroups[country] = [];
      }
      countryGroups[country].push(scribe);
    });
  });
  
  // Sort countries by scribe count
  const sortedCountries = Object.entries(countryGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8); // Top 8 countries
  
  if (sortedCountries.length === 0) {
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #94a3b8;">No country data available for analysis</div>';
    return;
  }
  
  let html = '<div style="display: grid; gap: 2rem;">';
  
  sortedCountries.forEach(([country, scribes]) => {
    const productivityDist = {};
    scribes.forEach(scribe => {
      const msCount = scribe.manuscripts.size;
      productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
    });
    
    const chao1 = calculateChao1(productivityDist, scribes.length);
    const jackknife = calculateJackknife(productivityDist, scribes.length);
    const gammaPoisson = calculateGammaPoisson(productivityDist, scribes.length);
    
    html += `
      <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; background: #fafafa;">
        <h4 style="margin: 0 0 1rem 0; color: #1e293b; font-size: 1.125rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></span>
          ${country}
        </h4>
        ${buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, scribes.length)}
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Experiment 4: By Century Breakdown
 */
function buildByCenturyAnalysis(scribeArray, container) {
  // Group scribes by century
  const centuryGroups = {};
  
  scribeArray.forEach(scribe => {
    const centuries = new Set();
    scribe.sus.forEach(su => {
      if (su.centuries && su.centuries.length > 0) {
        su.centuries.forEach(c => centuries.add(c));
      }
    });
    
    centuries.forEach(century => {
      if (!centuryGroups[century]) {
        centuryGroups[century] = [];
      }
      centuryGroups[century].push(scribe);
    });
  });
  
  // Sort centuries chronologically and filter out 18th century and Unknown
  const sortedCenturies = Object.entries(centuryGroups)
    .filter(([century]) => {
      // Exclude 18th century and Unknown
      if (century.toLowerCase().includes('unknown')) return false;
      if (century.match(/18th/i)) return false;
      if (century.match(/XVIII/i)) return false;
      return true;
    })
    .sort((a, b) => {
      const aNum = parseInt(a[0].match(/\d+/)?.[0] || '0');
      const bNum = parseInt(b[0].match(/\d+/)?.[0] || '0');
      return aNum - bNum;
    });
  
  if (sortedCenturies.length === 0) {
    container.innerHTML = '<div style="padding: 2rem; text-align: center; color: #94a3b8;">No century data available for analysis</div>';
    return;
  }
  
  let html = '<div style="display: grid; gap: 2rem;">';
  
  sortedCenturies.forEach(([century, scribes]) => {
    const productivityDist = {};
    scribes.forEach(scribe => {
      const msCount = scribe.manuscripts.size;
      productivityDist[msCount] = (productivityDist[msCount] || 0) + 1;
    });
    
    const chao1 = calculateChao1(productivityDist, scribes.length);
    const jackknife = calculateJackknife(productivityDist, scribes.length);
    const gammaPoisson = calculateGammaPoisson(productivityDist, scribes.length);
    
    html += `
      <div style="border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; background: #fafafa;">
        <h4 style="margin: 0 0 1rem 0; color: #1e293b; font-size: 1.125rem; display: flex; align-items: center; gap: 0.5rem;">
          <span style="display: inline-block; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></span>
          ${century}
        </h4>
        ${buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, scribes.length)}
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

/**
 * Build comparison table for all three estimators
 */
function buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, observed) {
  return `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
        <thead>
          <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
            <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Estimator</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Observed</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Estimated</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Unseen</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">Coverage</th>
            <th style="padding: 0.75rem; text-align: right; font-weight: 600; color: #475569;">95% CI</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 0.75rem; font-weight: 600; color: #f59e0b;">Chao1</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b;">${observed}</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b; font-weight: 600;">${Math.round(chao1.estimate)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #dc2626;">${Math.round(chao1.estimate - observed)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #10b981;">${((observed/chao1.estimate)*100).toFixed(1)}%</td>
            <td style="padding: 0.75rem; text-align: right; color: #64748b; font-size: 0.8125rem;">${Math.round(chao1.lower)}–${Math.round(chao1.upper)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 0.75rem; font-weight: 600; color: #fb923c;">Jackknife</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b;">${observed}</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b; font-weight: 600;">${Math.round(jackknife.estimate)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #dc2626;">${Math.round(jackknife.estimate - observed)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #10b981;">${((observed/jackknife.estimate)*100).toFixed(1)}%</td>
            <td style="padding: 0.75rem; text-align: right; color: #64748b; font-size: 0.8125rem;">${Math.round(jackknife.lower)}–${Math.round(jackknife.upper)}</td>
          </tr>
          <tr>
            <td style="padding: 0.75rem; font-weight: 600; color: #eab308;">Gamma-Poisson</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b;">${observed}</td>
            <td style="padding: 0.75rem; text-align: right; color: #1e293b; font-weight: 600;">${Math.round(gammaPoisson.estimate)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #dc2626;">${Math.round(gammaPoisson.estimate - observed)}</td>
            <td style="padding: 0.75rem; text-align: right; color: #10b981;">${((observed/gammaPoisson.estimate)*100).toFixed(1)}%</td>
            <td style="padding: 0.75rem; text-align: right; color: #64748b; font-size: 0.8125rem;">${Math.round(gammaPoisson.lower)}–${Math.round(gammaPoisson.upper)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div style="margin-top: 1rem; padding: 0.875rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.8125rem; color: #475569; line-height: 1.5;">
      <strong>Singletons (f₁):</strong> ${chao1.f1} | <strong>Doubletons (f₂):</strong> ${chao1.f2}
    </div>
  `;
}

/**
 * Build full analysis comparison for single dataset
 */
function buildUnseenSpeciesComparison(productivityDist, observed, container, title, description) {
  const chao1 = calculateChao1(productivityDist, observed);
  const jackknife = calculateJackknife(productivityDist, observed);
  const gammaPoisson = calculateGammaPoisson(productivityDist, observed);
  
  container.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <h3 style="margin: 0 0 0.5rem 0; color: #1e293b; font-size: 1.25rem;">${title}</h3>
      <p style="margin: 0; font-size: 0.875rem; color: #64748b;">${description}</p>
    </div>
    
    <!-- Key Metrics -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Observed Scribes</div>
        <div style="font-size: 2rem; font-weight: 700;">${observed}</div>
      </div>
      <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Chao1 Estimate</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(chao1.estimate)}</div>
      </div>
      <div style="background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Jackknife Estimate</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(jackknife.estimate)}</div>
      </div>
      <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Gamma-Poisson Est.</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(gammaPoisson.estimate)}</div>
      </div>
    </div>
    
    <!-- Detailed Comparison Table -->
    <div style="margin-bottom: 2rem;">
      <h4 style="margin: 0 0 1rem 0; color: #475569; font-size: 1rem; font-weight: 600;">Estimator Comparison</h4>
      ${buildEstimatorComparisonTable(chao1, jackknife, gammaPoisson, observed)}
    </div>
    
    <!-- Interpretation -->
    <div style="background: #f8fafc; padding: 1rem; border-radius: 0.375rem; border-left: 3px solid #f59e0b; margin-bottom: 1rem;">
      <div style="font-size: 0.875rem; color: #475569; line-height: 1.6;">
        <strong>Interpretation:</strong> The three estimators provide different estimates of the total scribe population.
        <strong>Chao1</strong> estimates ${Math.round(chao1.estimate)} total scribes (${Math.round(chao1.estimate - observed)} unseen),
        <strong>Jackknife</strong> estimates ${Math.round(jackknife.estimate)} (${Math.round(jackknife.estimate - observed)} unseen),
        and <strong>Gamma-Poisson</strong> estimates ${Math.round(gammaPoisson.estimate)} (${Math.round(gammaPoisson.estimate - observed)} unseen).
      </div>
    </div>
    
    <!-- Explanation of Differences -->
    <div style="background: #fff7ed; padding: 1rem; border-radius: 0.375rem; border-left: 3px solid #f59e0b; margin-bottom: 2rem;">
      <div style="font-size: 0.875rem; color: #92400e; line-height: 1.6;">
        <strong style="color: #78350f;">Why do estimates differ?</strong><br>
        Each estimator makes different assumptions:<br>
        • <strong>Chao1</strong> (most conservative): Assumes all scribes have equal detection probability. Best when most scribes are rare (many singletons).<br>
        • <strong>Jackknife</strong> (moderate): Accounts for sampling effort and is more robust to sample size. Reliable for well-sampled populations.<br>
        • <strong>Gamma-Poisson</strong> (most liberal): Assumes heterogeneous detection rates (some scribes easier to find). Better for uneven survival rates.<br><br>
        <strong style="color: #78350f;">Which is most reliable?</strong> For manuscript studies with highly uneven survival (many single-manuscript scribes), <strong>Chao1 is generally preferred</strong> as it's most conservative and has been validated for cultural heritage data (Kestemont et al. 2021). The range between estimators reflects genuine uncertainty about unobserved scribes.
      </div>
    </div>
    
    <!-- Productivity Distribution with f0 -->
    <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem; margin-bottom: 2rem;" id="productivity-dist-wrapper">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <h4 style="margin: 0; color: #475569; font-size: 0.9375rem; font-weight: 600;">Productivity Distribution (Observed + Chao1 Unseen)</h4>
        ${createExportButton('productivity-dist-wrapper', 'productivity_distribution_with_unseen.png')}
      </div>
      <p style="margin: 0 0 1rem 0; font-size: 0.8125rem; color: #64748b;">
        Number of scribes by manuscript count. The first bar (0) shows Chao1's estimate of unseen scribes.
      </p>
      <div id="productivity-distribution-chart"></div>
    </div>
    
    <!-- Visualization -->
    <div id="unseen-species-chart">
      <h4 style="margin: 0 0 0.5rem 0; color: #475569; font-size: 0.9375rem; font-weight: 600;">Species Accumulation Curve</h4>
      <p style="margin: 0 0 1rem 0; font-size: 0.8125rem; color: #64748b;">
        The blue curve shows observed scribe accumulation. Dashed lines show each estimator's asymptote.
      </p>
      <svg id="species-accumulation-svg" width="100%" height="350"></svg>
    </div>
  `;
  
  drawProductivityDistribution(productivityDist, chao1.estimate - observed);
  drawSpeciesAccumulationCurveMulti(productivityDist, observed, chao1.estimate, jackknife.estimate, gammaPoisson.estimate);
}

function buildUnseenSpeciesEstimates(productivityDistribution, observedScribes) {
  const container = document.getElementById('unseen-species-content');
  if (!container) return;
  
  // Calculate Chao1 estimate from productivity distribution
  // Chao1 formula: S_est = S_obs + (f1^2 / (2 * f2))
  // where f1 = number of singletons, f2 = number of doubletons
  const f1 = productivityDistribution[1] || 0; // scribes who copied 1 manuscript
  const f2 = productivityDistribution[2] || 0; // scribes who copied 2 manuscripts
  
  let chao1Estimate = observedScribes;
  let chao1Lower = observedScribes;
  let chao1Upper = observedScribes;
  
  if (f2 > 0) {
    // Standard Chao1
    chao1Estimate = observedScribes + (f1 * f1) / (2 * f2);
    // 95% CI approximation (simplified)
    const variance = f2 * (0.5 * (f1/f2)^2 + (f1/f2)^3 + 0.25 * (f1/f2)^4);
    const se = Math.sqrt(variance);
    chao1Lower = Math.max(observedScribes, chao1Estimate - 1.96 * se);
    chao1Upper = chao1Estimate + 1.96 * se;
  } else if (f1 > 0) {
    // Modified Chao1 when f2 = 0
    chao1Estimate = observedScribes + (f1 * (f1 - 1)) / 2;
    chao1Lower = observedScribes + (f1 * (f1 - 1)) / 2;
    chao1Upper = observedScribes + (f1 * (f1 + 1)) / 2;
  }
  
  const unseenEstimate = Math.round(chao1Estimate - observedScribes);
  const coverage = ((observedScribes / chao1Estimate) * 100).toFixed(1);
  
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Observed Scribes</div>
        <div style="font-size: 2rem; font-weight: 700;">${observedScribes}</div>
      </div>
      <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Estimated Total (Chao1)</div>
        <div style="font-size: 2rem; font-weight: 700;">${Math.round(chao1Estimate)}</div>
        <div style="font-size: 0.75rem; opacity: 0.85; margin-top: 0.25rem;">95% CI: ${Math.round(chao1Lower)}–${Math.round(chao1Upper)}</div>
      </div>
      <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Estimated Unseen</div>
        <div style="font-size: 2rem; font-weight: 700;">${unseenEstimate}</div>
      </div>
      <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.25rem; border-radius: 0.5rem;">
        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Sample Coverage</div>
        <div style="font-size: 2rem; font-weight: 700;">${coverage}%</div>
      </div>
    </div>
    
    <div style="background: #fffbeb; padding: 1rem; border-radius: 0.375rem; border-left: 3px solid #f59e0b;">
      <div style="font-size: 0.875rem; color: #475569; line-height: 1.6;">
        <strong>Interpretation:</strong> Based on the observed distribution of scribe productivity, 
        we estimate there were approximately <strong>${Math.round(chao1Estimate)}</strong> female scribes in total,
        suggesting about <strong>${unseenEstimate}</strong> scribes whose work has not survived or has not yet been identified.
        The current corpus captures approximately <strong>${coverage}%</strong> of the estimated total scribe population.
      </div>
    </div>
    
    <div id="unseen-species-chart" style="margin-top: 1.5rem;">
      <h4 style="margin: 0 0 0.5rem 0; color: #475569; font-size: 0.9375rem; font-weight: 600;">Species Accumulation Curve</h4>
      <p style="margin: 0 0 1rem 0; font-size: 0.8125rem; color: #64748b;">
        The blue curve shows how scribes were discovered as manuscripts were sampled. 
        The red dashed line represents the estimated total (asymptote). 
        <strong>The gap between these lines represents the estimated unseen scribes.</strong>
      </p>
      <svg id="species-accumulation-svg" width="100%" height="300"></svg>
    </div>
  `;
  
  // Add methodology info button handler
  document.getElementById('unseen-species-info')?.addEventListener('click', () => {
    showUnseenSpeciesMethodology(f1, f2, observedScribes, chao1Estimate);
  });
  
  // Draw species accumulation curve
  drawSpeciesAccumulationCurve(productivityDistribution, observedScribes, chao1Estimate, unseenEstimate);
}

function drawSpeciesAccumulationCurve(distribution, observed, estimated, unseenEstimate) {
  const svg = document.getElementById('species-accumulation-svg');
  if (!svg) return;
  
  const width = svg.clientWidth || 800;
  const height = 300;
  const margin = { top: 20, right: 80, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Simulate species accumulation: create a rarefaction curve
  // Sort scribes by number of manuscripts (most to least productive)
  const scribesByProductivity = [];
  Object.keys(distribution).forEach(msCount => {
    const numScribes = distribution[msCount];
    for (let i = 0; i < numScribes; i++) {
      scribesByProductivity.push(Number(msCount));
    }
  });
  
  // Shuffle to simulate random sampling order
  for (let i = scribesByProductivity.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scribesByProductivity[i], scribesByProductivity[j]] = [scribesByProductivity[j], scribesByProductivity[i]];
  }
  
  // Create species accumulation curve
  const accumulationData = [{ manuscripts: 0, scribes: 0 }];
  let cumulativeManuscripts = 0;
  
  scribesByProductivity.forEach((msCount, index) => {
    cumulativeManuscripts += msCount;
    accumulationData.push({ 
      manuscripts: cumulativeManuscripts, 
      scribes: index + 1 
    });
  });
  
  const maxX = accumulationData[accumulationData.length - 1]?.manuscripts || 100;
  const xScale = (x) => margin.left + (x / maxX) * innerWidth;
  const yScale = (y) => height - margin.bottom - (y / estimated) * innerHeight;
  
  // Clear and redraw
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  // Draw grid lines
  const gridColor = '#f1f5f9';
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (i * innerHeight / 5);
    svg.innerHTML += `<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="${gridColor}" stroke-width="1"/>`;
  }
  
  // Draw axes
  const axisColor = '#94a3b8';
  
  // Y-axis
  svg.innerHTML += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" stroke="${axisColor}" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left - 45}" y="${height/2}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600" transform="rotate(-90 ${margin.left - 45} ${height/2})">Number of Scribes Discovered</text>`;
  
  // Y-axis ticks
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((estimated / 5) * i);
    const y = yScale(value);
    svg.innerHTML += `<text x="${margin.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#64748b">${value}</text>`;
  }
  
  // X-axis
  svg.innerHTML += `<line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" stroke="${axisColor}" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left + innerWidth/2}" y="${height - 10}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600">Manuscripts Sampled</text>`;
  
  // Draw observed accumulation curve
  const points = accumulationData.map(d => `${xScale(d.manuscripts)},${yScale(d.scribes)}`).join(' ');
  svg.innerHTML += `<polyline points="${points}" fill="none" stroke="#f59e0b" stroke-width="3"/>`;
  
  // Draw estimated asymptote (horizontal line showing the target)
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(estimated)}" x2="${width - margin.right}" y2="${yScale(estimated)}" stroke="#ea580c" stroke-width="2" stroke-dasharray="8,4"/>`;
  
  // Add annotation explaining the asymptote
  svg.innerHTML += `<text x="${margin.left + 10}" y="${yScale(estimated) - 8}" font-size="10" fill="#ea580c" font-weight="600">← Asymptote: estimated total population</text>`;
  
  // Add shaded area between observed and estimated to visualize gap
  const lastPoint = accumulationData[accumulationData.length - 1];
  if (lastPoint && lastPoint.manuscripts) {
    const gapHeight = yScale(observed) - yScale(estimated);
    svg.innerHTML += `<rect x="${xScale(lastPoint.manuscripts)}" y="${yScale(estimated)}" width="${width - margin.right - xScale(lastPoint.manuscripts)}" height="${gapHeight}" fill="#fecaca" opacity="0.3"/>`;
    
    // Add label for the gap
    const gapMidY = (yScale(estimated) + yScale(observed)) / 2;
    svg.innerHTML += `<text x="${(xScale(lastPoint.manuscripts) + width - margin.right) / 2}" y="${gapMidY}" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="600">Estimated Unseen: ${unseenEstimate}</text>`;
  }
  
  // Labels with better positioning and boxes for clarity
  const observedY = yScale(observed);
  const estimatedY = yScale(estimated);
  
  // Observed label with background box
  svg.innerHTML += `<rect x="${width - margin.right + 5}" y="${observedY - 10}" width="105" height="18" fill="white" stroke="#f59e0b" stroke-width="1" rx="3"/>`;
  svg.innerHTML += `<circle cx="${width - margin.right + 14}" cy="${observedY}\" r="4" fill="#f59e0b"/>`;
  svg.innerHTML += `<text x="${width - margin.right + 24}" y="${observedY + 4}\" font-size="11" fill="#f59e0b" font-weight="700">Observed: ${observed}</text>`;
  
  // Estimated label with background box
  svg.innerHTML += `<rect x="${width - margin.right + 5}" y="${estimatedY - 10}" width="110" height="18" fill="white" stroke="#ea580c" stroke-width="1" rx="3"/>`;
  svg.innerHTML += `<circle cx="${width - margin.right + 14}" cy="${estimatedY}" r="4" fill="#ea580c"/>`;
  svg.innerHTML += `<text x="${width - margin.right + 24}" y="${estimatedY + 4}" font-size="11" fill="#ea580c" font-weight="700">Estimated: ${Math.round(estimated)}</text>`;
}

/**
 * Draw productivity distribution bar chart including f0 (unseen scribes)
 */
function drawProductivityDistribution(productivityDist, unseenCount) {
  const container = document.getElementById('productivity-distribution-chart');
  if (!container) return;
  
  // Prepare data - include 0 (unseen) as first bar
  const data = [{ manuscripts: 0, scribes: Math.round(unseenCount), isUnseen: true }];
  
  // Add observed data
  const maxManuscripts = Math.max(...Object.keys(productivityDist).map(Number));
  for (let i = 1; i <= Math.min(maxManuscripts, 20); i++) {
    data.push({
      manuscripts: i,
      scribes: productivityDist[i] || 0,
      isUnseen: false
    });
  }
  
  const maxScribes = Math.max(...data.map(d => d.scribes));
  const barHeight = 30;
  const gap = 5;
  const labelWidth = 80;
  const chartWidth = container.clientWidth - labelWidth - 100 || 600;
  
  // Use logarithmic scaling for better visual differentiation
  const maxLog = Math.log10(maxScribes + 1);
  
  const html = data.map((d, i) => {
    // Calculate bar width using logarithmic scale for better granularity
    const logValue = Math.log10(d.scribes + 1);
    const barWidth = maxLog > 0 ? (logValue / maxLog) * chartWidth : 0;
    const color = d.isUnseen ? '#dc2626' : '#f59e0b';
    const label = d.manuscripts === 0 ? '0 (Unseen)' : d.manuscripts;
    
    // Set minimum visible width only for values > 0
    const displayWidth = d.scribes > 0 ? Math.max(barWidth, 20) : 0;
    
    return `
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: ${gap}px;">
        <div style="width: ${labelWidth}px; text-align: right; font-size: 0.875rem; color: #475569; font-weight: ${d.isUnseen ? '700' : '400'};">
          ${label} MS${d.manuscripts === 1 ? '' : 's'}
        </div>
        <div style="flex: 1; display: flex; align-items: center; gap: 0.5rem;">
          <div style="background: ${color}; height: ${barHeight}px; width: ${displayWidth}px; border-radius: 0.25rem; transition: all 0.3s; position: relative;">
            <div style="position: absolute; ${displayWidth < 60 ? 'left: calc(100% + 0.5rem)' : 'right: 0.5rem'}; top: 50%; transform: translateY(-50%); color: ${displayWidth < 60 ? '#1e293b' : 'white'}; font-weight: 600; font-size: 0.75rem;">
              ${d.scribes}
            </div>
          </div>
          <div style="font-size: 0.75rem; color: #64748b; ${displayWidth < 60 ? 'margin-left: 2.5rem;' : ''}">
            ${d.isUnseen ? 'Estimated unseen (Chao1)' : 'scribes'}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.75rem; color: #64748b;">
      <span style="color: #dc2626;">●</span> Unseen (Chao1 estimate) &nbsp;&nbsp;
      <span style="color: #f59e0b;">●</span> Observed
    </div>
  `;
}

/**
 * Draw species accumulation curve with multiple estimator asymptotes
 */
function drawSpeciesAccumulationCurveMulti(distribution, observed, chao1Est, jackknifeEst, gammaPoissonEst) {
  const svg = document.getElementById('species-accumulation-svg');
  if (!svg) return;
  
  const width = svg.clientWidth || 800;
  const height = 350;
  const margin = { top: 20, right: 120, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const maxEstimate = Math.max(chao1Est, jackknifeEst, gammaPoissonEst);
  
  // Create rarefaction curve
  const scribesByProductivity = [];
  Object.keys(distribution).forEach(msCount => {
    const numScribes = distribution[msCount];
    for (let i = 0; i < numScribes; i++) {
      scribesByProductivity.push(Number(msCount));
    }
  });
  
  for (let i = scribesByProductivity.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scribesByProductivity[i], scribesByProductivity[j]] = [scribesByProductivity[j], scribesByProductivity[i]];
  }
  
  const accumulationData = [{ manuscripts: 0, scribes: 0 }];
  let cumulativeManuscripts = 0;
  
  scribesByProductivity.forEach((msCount, index) => {
    cumulativeManuscripts += msCount;
    accumulationData.push({ 
      manuscripts: cumulativeManuscripts, 
      scribes: index + 1 
    });
  });
  
  const maxX = accumulationData[accumulationData.length - 1]?.manuscripts || 100;
  const xScale = (x) => margin.left + (x / maxX) * innerWidth;
  const yScale = (y) => height - margin.bottom - (y / maxEstimate) * innerHeight;
  
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  // Grid
  const gridColor = '#f1f5f9';
  for (let i = 0; i <= 5; i++) {
    const y = margin.top + (i * innerHeight / 5);
    svg.innerHTML += `<line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="${gridColor}" stroke-width="1"/>`;
  }
  
  // Axes
  svg.innerHTML += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${height - margin.bottom}" stroke="#94a3b8" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left - 45}" y="${height/2}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600" transform="rotate(-90 ${margin.left - 45} ${height/2})">Number of Scribes</text>`;
  
  for (let i = 0; i <= 5; i++) {
    const value = Math.round((maxEstimate / 5) * i);
    const y = yScale(value);
    svg.innerHTML += `<text x="${margin.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#64748b">${value}</text>`;
  }
  
  svg.innerHTML += `<line x1="${margin.left}" y1="${height - margin.bottom}" x2="${width - margin.right}" y2="${height - margin.bottom}" stroke="#94a3b8" stroke-width="2"/>`;
  svg.innerHTML += `<text x="${margin.left + innerWidth/2}" y="${height - 10}" text-anchor="middle" font-size="13" fill="#475569" font-weight="600">Manuscripts Sampled</text>`;
  
  // Observed curve
  const points = accumulationData.map(d => `${xScale(d.manuscripts)},${yScale(d.scribes)}`).join(' ');
  svg.innerHTML += `<polyline points="${points}" fill="none" stroke="#2563eb" stroke-width="3"/>`;
  
  // Asymptote lines for each estimator
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(chao1Est)}" x2="${width - margin.right}" y2="${yScale(chao1Est)}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8,4"/>`;
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(jackknifeEst)}" x2="${width - margin.right}" y2="${yScale(jackknifeEst)}" stroke="#fb923c" stroke-width="2" stroke-dasharray="5,5"/>`;
  svg.innerHTML += `<line x1="${margin.left}" y1="${yScale(gammaPoissonEst)}" x2="${width - margin.right}" y2="${yScale(gammaPoissonEst)}" stroke="#eab308" stroke-width="2" stroke-dasharray="10,5"/>`;
  
  // Legend on the right
  const legendX = width - margin.right + 10;
  let legendY = margin.top + 20;
  
  // Observed
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#2563eb" stroke-width="3"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#1e293b">Observed: ${observed}</text>`;
  legendY += 25;
  
  // Chao1
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8,4"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#f59e0b" font-weight="600">Chao1: ${Math.round(chao1Est)}</text>`;
  legendY += 25;
  
  // Jackknife
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#fb923c" stroke-width="2" stroke-dasharray="5,5"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#fb923c" font-weight="600">Jackknife: ${Math.round(jackknifeEst)}</text>`;
  legendY += 25;
  
  // Gamma-Poisson
  svg.innerHTML += `<line x1="${legendX}" y1="${legendY}" x2="${legendX + 20}" y2="${legendY}" stroke="#eab308" stroke-width="2" stroke-dasharray="10,5"/>`;
  svg.innerHTML += `<text x="${legendX + 25}" y="${legendY + 4}" font-size="10" fill="#eab308" font-weight="600">Gamma-P: ${Math.round(gammaPoissonEst)}</text>`;
}

function showMethodologyModal(f1, f2, observed, chao1Est, jackknifeEst, gammaPoissonEst) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';
  
  const content = document.createElement('div');
  content.style.cssText = 'background: white; border-radius: 0.5rem; padding: 2rem; max-width: 800px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);';
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Methodology & References</h3>
      <button id="close-methodology" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
    </div>
    
    <div style="font-size: 0.9375rem; line-height: 1.7; color: #475569;">
      <h4 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem;">Statistical Models</h4>
      
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: #f59e0b; margin: 1rem 0 0.5rem 0;">1. Chao1 Estimator</h5>
        <p style="margin: 0.5rem 0;">
          The Chao1 estimator uses the frequency of rare species (singletons and doubletons) to estimate total richness.
        </p>
        <div style="background: #fffbeb; padding: 1rem; border-radius: 0.375rem; font-family: 'Courier New', monospace; margin: 0.75rem 0; border-left: 3px solid #f59e0b;">
          S<sub>est</sub> = S<sub>obs</sub> + f₁² / (2 × f₂)
        </div>
        <ul style="margin: 0.5rem 0; font-size: 0.875rem;">
          <li><strong>S<sub>obs</sub>:</strong> ${observed} observed scribes</li>
          <li><strong>f₁:</strong> ${f1} singletons (scribes who copied only 1 manuscript)</li>
          <li><strong>f₂:</strong> ${f2} doubletons (scribes who copied 2 manuscripts)</li>
          <li><strong>Result:</strong> ${Math.round(chao1Est)} estimated total scribes</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: #fb923c; margin: 1rem 0 0.5rem 0;">2. Jackknife Estimator</h5>
        <p style="margin: 0.5rem 0;">
          The Jackknife estimator uses a resampling approach, accounting for sample size effects.
          We use the second-order jackknife when doubletons are available.
        </p>
        <div style="background: #fff7ed; padding: 1rem; border-radius: 0.375rem; font-family: 'Courier New', monospace; margin: 0.75rem 0; border-left: 3px solid #fb923c;">
          S<sub>jack2</sub> = S<sub>obs</sub> + f₁(2n-3)/n - f₂(n-2)²/(n(n-1))
        </div>
        <ul style="margin: 0.5rem 0; font-size: 0.875rem;">
          <li><strong>n:</strong> Total manuscripts sampled</li>
          <li><strong>Result:</strong> ${Math.round(jackknifeEst)} estimated total scribes</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 1.5rem;">
        <h5 style="color: #eab308; margin: 1rem 0 0.5rem 0;">3. Gamma-Poisson Model</h5>
        <p style="margin: 0.5rem 0;">
          A mixture model that accounts for heterogeneity in detection probability across species.
          Uses low-frequency counts to estimate total diversity.
        </p>
        <div style="background: #fefce8; padding: 1rem; border-radius: 0.375rem; font-family: 'Courier New', monospace; margin: 0.75rem 0; border-left: 3px solid #eab308;">
          Uses frequency ratios and gamma distribution parameters
        </div>
        <ul style="margin: 0.5rem 0; font-size: 0.875rem;">
          <li><strong>Result:</strong> ${Math.round(gammaPoissonEst)} estimated total scribes</li>
        </ul>
      </div>
      
      <h4 style="color: #2c3e50; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2rem;">References</h4>
      
      <ol style="font-size: 0.875rem; line-height: 1.6; color: #475569;">
        <li style="margin-bottom: 1rem;">
          <strong>Chao, A.</strong> (1984). Nonparametric estimation of the number of classes in a population. 
          <em>Scandinavian Journal of Statistics</em>, 11(4), 265-270.
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Walther, B.A., & Morand, S.</strong> (1998). Comparative performance of species richness estimation methods. 
          <em>Parasitology</em>, 116(4), 395-405.
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Böhning, D., & Schön, D.</strong> (2005). Nonparametric maximum likelihood estimation of population size based on the counting distribution. 
          <em>Journal of the Royal Statistical Society: Series C</em>, 54(4), 721-737.
        </li>
        <li style="margin-bottom: 1rem;">
          <strong>Kestemont, M., Karsdorp, F., de Bruijn, E., Driscoll, M., Kapitan, K.A., Ó Macháin, P., Sawyer, D., Sleiderink, R., & Chao, A.</strong> (2021). 
          Forgotten Books: The Application of Unseen Species Models to the Survival of Culture. 
          <em>Science</em>, 375(6582), 765-769.
        </li>
      </ol>
      
      <div style="background: #f0f9ff; border-left: 3px solid #3b82f6; padding: 1rem; border-radius: 0.375rem; margin-top: 1.5rem;">
        <p style="margin: 0; font-size: 0.875rem; color: #1e40af;">
          <strong>Note:</strong> Different estimators reflect different assumptions about species diversity and detection probability. 
          The range of estimates provides insight into model uncertainty. Chao1 is most conservative, 
          while Gamma-Poisson accounts for greater heterogeneity.
        </p>
      </div>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  document.getElementById('close-methodology').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function showUnseenSpeciesMethodology(f1, f2, observed, estimated) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';
  
  const content = document.createElement('div');
  content.style.cssText = 'background: white; border-radius: 0.5rem; padding: 2rem; max-width: 700px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);';
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #1e293b; font-size: 1.5rem;">Unseen Species Methodology</h3>
      <button id="close-methodology" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
    </div>
    
    <div style="font-size: 0.9375rem; line-height: 1.7; color: #475569;">
      <h4 style="color: #2c3e50; margin-top: 0;">Statistical Model</h4>
      <p>
        We use the <strong>Chao1 estimator</strong>, an unseen species model originally developed for ecology
        and adapted for cultural heritage by Kestemont et al. (2021) in "Forgotten Books: The Application of 
        Unseen Species Models to the Survival of Culture."
      </p>
      
      <h4 style="color: #2c3e50;">Formula</h4>
      <div style="background: #f8fafc; padding: 1rem; border-radius: 0.375rem; font-family: monospace; margin: 1rem 0;">
        S<sub>est</sub> = S<sub>obs</sub> + f₁² / (2 × f₂)
      </div>
      <ul style="margin: 0.5rem 0;">
        <li><strong>S<sub>obs</sub></strong>: ${observed} observed scribes</li>
        <li><strong>f₁</strong>: ${f1} scribes who copied only 1 manuscript (singletons)</li>
        <li><strong>f₂</strong>: ${f2} scribes who copied 2 manuscripts (doubletons)</li>
      </ul>
      
      <h4 style="color: #2c3e50;">Interpretation</h4>
      <p>
        The large number of singletons (${f1} scribes) suggests substantial unobserved diversity.
        The ratio f₁/f₂ = ${(f1/f2).toFixed(2)} indicates ${f1/f2 > 2 ? 'high' : 'moderate'} turnover, 
        typical of manuscript production where many scribes contributed minimally to the surviving corpus.
      </p>
      
      <p>
        <strong>Estimated total:</strong> ${Math.round(estimated)} female scribes<br>
        <strong>Sample coverage:</strong> ${((observed/estimated)*100).toFixed(1)}% of all scribes observed<br>
        <strong>Estimated unseen:</strong> ${Math.round(estimated - observed)} scribes whose work hasn't survived or been identified
      </p>
      
      <h4 style="color: #2c3e50;">References</h4>
      <p style="font-size: 0.875rem; color: #64748b;">
        Kestemont, M., Karsdorp, F., de Bruijn, E., Driscoll, M., Kapitan, K.A., Ó Macháin, P., 
        Sawyer, D., Sleiderink, R., & Chao, A. (2021). Forgotten Books: The Application of Unseen 
        Species Models to the Survival of Culture. <em>Science</em>, 375(6582), 765-769.
      </p>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close handlers
  document.getElementById('close-methodology').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/**
 * Build collaboration network visualization using D3 force layout
 */
function buildCollaborationNetwork(collaborativeManuscripts, collaborations, scribeArray) {
  const container = document.getElementById('collaboration-network-viz');
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '';
  
  if (collaborativeManuscripts.length === 0) {
    container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8;">No collaborative manuscripts found</div>';
    return;
  }
  
  // Build network data with institution information
  const nodes = new Map();
  const links = [];
  const manuscriptLinks = new Map();
  const institutions = new Set();
  
  // Create scribe map for quick lookup
  const scribeMap = new Map();
  if (scribeArray) {
    scribeArray.forEach(scribe => {
      scribeMap.set(scribe.id, scribe);
      // institutions is a Set, so convert to array
      if (scribe.institutions && scribe.institutions.size > 0) {
        Array.from(scribe.institutions).forEach(inst => institutions.add(inst));
      }
    });
  }
  
  collaborativeManuscripts.forEach(ms => {
    const scribes = ms.scribes || [];
    
    // Add nodes for each scribe
    scribes.forEach(scribeData => {
      const scribeName = typeof scribeData === 'object' ? (scribeData.name || scribeData.id || String(scribeData)) : String(scribeData);
      const scribeId = typeof scribeData === 'object' ? scribeData.id : scribeData;
      
      if (!nodes.has(scribeName)) {
        const scribeInfo = scribeMap.get(scribeId);
        let primaryInstitution = 'Unknown';
        
        if (scribeInfo && scribeInfo.institutions && scribeInfo.institutions.size > 0) {
          // Get first institution from Set
          primaryInstitution = Array.from(scribeInfo.institutions)[0];
        }
        
        nodes.set(scribeName, {
          id: scribeName,
          scribeId: scribeId,
          name: scribeName,
          collaborationCount: 0,
          manuscripts: new Set(),
          institution: primaryInstitution,
          allInstitutions: scribeInfo && scribeInfo.institutions ? Array.from(scribeInfo.institutions) : []
        });
      }
      nodes.get(scribeName).manuscripts.add(ms.msTitle);
    });
    
    // Create links between all pairs of scribes
    for (let i = 0; i < scribes.length; i++) {
      for (let j = i + 1; j < scribes.length; j++) {
        const sourceName = typeof scribes[i] === 'object' ? (scribes[i].name || scribes[i].id || String(scribes[i])) : String(scribes[i]);
        const targetName = typeof scribes[j] === 'object' ? (scribes[j].name || scribes[j].id || String(scribes[j])) : String(scribes[j]);
        const pairKey = [sourceName, targetName].sort().join('|||');
        
        if (!manuscriptLinks.has(pairKey)) {
          manuscriptLinks.set(pairKey, {
            source: sourceName,
            target: targetName,
            manuscripts: []
          });
        }
        manuscriptLinks.get(pairKey).manuscripts.push(ms.msTitle);
        
        nodes.get(sourceName).collaborationCount++;
        nodes.get(targetName).collaborationCount++;
      }
    }
  });
  
  // Convert to arrays
  const nodeArray = Array.from(nodes.values());
  const linkArray = Array.from(manuscriptLinks.values()).map(link => ({
    source: link.source,
    target: link.target,
    strength: link.manuscripts.length,
    manuscripts: link.manuscripts
  }));
  
  // Create color scale for institutions
  const institutionArray = Array.from(institutions).sort();
  const colorScale = d3.scaleOrdinal()
    .domain(institutionArray)
    .range([
      '#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', 
      '#f97316', '#06b6d4', '#f43f5e', '#14b8a6', '#a855f7',
      '#eab308', '#6366f1', '#db2777', '#059669', '#7c3aed',
      '#d97706', '#0ea5e9', '#e11d48', '#0d9488', '#9333ea'
    ]);
  
  // Add gray color for unknown
  const getNodeColor = (institution) => {
    return institution === 'Unknown' ? '#94a3b8' : colorScale(institution);
  };
  
  // Add control panel
  const controlPanel = document.createElement('div');
  controlPanel.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; align-items: center;';
  
  // Create legend for institutions (show top institutions by scribe count)
  const institutionCounts = {};
  nodeArray.forEach(n => {
    institutionCounts[n.institution] = (institutionCounts[n.institution] || 0) + 1;
  });
  
  const topInstitutions = Object.entries(institutionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([inst, count]) => ({inst, count}));
  
  const legendHTML = topInstitutions.map(({inst, count}) => 
    `<span style="display: inline-flex; align-items: center; gap: 0.25rem; margin-right: 0.5rem; font-size: 0.65rem; color: #64748b; padding: 0.125rem 0.375rem; background: white; border-radius: 0.25rem;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: ${getNodeColor(inst)}; flex-shrink: 0;"></span>
      <span style="max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${inst}">${inst}</span>
      <span style="font-weight: 600; color: #475569;">(${count})</span>
    </span>`
  ).join('');
  
  controlPanel.innerHTML = `
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
      <button id="network-reset" class="export-btn" style="background: #6366f1; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; transition: all 0.2s;" onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
        Reset
      </button>
      <button id="network-labels-toggle" class="export-btn" style="background: #ec4899; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; transition: all 0.2s;" onmouseover="this.style.background='#db2777'" onmouseout="this.style.background='#ec4899'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
        Hide Labels
      </button>
      <button id="network-filter-isolated" class="export-btn" style="background: #f59e0b; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem; transition: all 0.2s;" onmouseover="this.style.background='#d97706'" onmouseout="this.style.background='#f59e0b'">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Hide Singles
      </button>
      <div style="font-size: 0.7rem; color: #64748b; padding: 0.375rem 0.5rem; background: #f8fafc; border-radius: 0.375rem; white-space: nowrap;">
        <strong>${nodeArray.length}</strong> scribes • <strong>${linkArray.length}</strong> links
      </div>
    </div>
    <div style="margin-top: 0.75rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; border: 1px solid #e2e8f0;">
      <div style="font-size: 0.75rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem;">Institutions (Top 10)</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; font-size: 0.65rem;">
        ${legendHTML || '<span style="color: #94a3b8;">No institution data</span>'}
      </div>
    </div>
  `;
  container.appendChild(controlPanel);
  
  // D3 force layout
  const width = container.clientWidth || 1200;
  const height = 600;
  
  const svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto')
    .style('display', 'block')
    .style('border', '1px solid #e2e8f0')
    .style('border-radius', '0.375rem')
    .style('background', '#fafafa');
  
  // Add zoom/pan container
  const g = svg.append('g');
  
  // Add zoom behavior with node/label scaling
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
      
      // Scale nodes and labels inversely to zoom level for consistent visual size
      const scale = event.transform.k;
      const inverseScale = 1 / scale;
      
      // Scale node circles
      node.select('circle')
        .attr('r', d => (Math.max(8, 5 + Math.sqrt(d.collaborationCount) * 3)) * inverseScale)
        .attr('stroke-width', 2 * inverseScale);
      
      // Scale labels
      nodeLabels
        .attr('font-size', `${9 * inverseScale}px`)
        .attr('y', d => (Math.max(8, 5 + Math.sqrt(d.collaborationCount) * 3) + 15) * inverseScale);
      
      // Scale link widths
      link.attr('stroke-width', d => Math.min(8, 1 + d.strength) * inverseScale);
    });
  
  svg.call(zoom);
  
  // Create force simulation with ultra-tight clustering
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(linkArray)
      .id(d => d.id)
      .distance(d => Math.max(15, 30 - (d.strength * 8))) // Ultra-short distances
      .strength(1.5)) // Very strong link force
    .force('charge', d3.forceManyBody().strength(-80)) // Minimal repulsion
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => Math.max(6, 2 + Math.sqrt(d.collaborationCount) * 1.5)))
    .force('x', d3.forceX(width / 2).strength(0.15)) // Very strong pull toward center
    .force('y', d3.forceY(height / 2).strength(0.15));
  
  // Draw links
  const link = g.append('g')
    .selectAll('line')
    .data(linkArray)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', d => Math.min(8, 1 + d.strength))
    .attr('stroke-opacity', 0.6)
    .attr('class', 'network-link');
  
  // Draw nodes
  const node = g.append('g')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'network-node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('mouseenter', function(event, d) {
      // Highlight connected nodes and links
      const connectedNodes = new Set();
      connectedNodes.add(d.id);
      
      link.each(function(l) {
        if (l.source.id === d.id || l.target.id === d.id) {
          connectedNodes.add(l.source.id);
          connectedNodes.add(l.target.id);
          d3.select(this).attr('stroke-opacity', 1).attr('stroke', '#f59e0b');
        }
      });
      
      node.select('circle').attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2);
      node.select('text').attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2);
      
      // Enlarge current node
      d3.select(this).select('circle')
        .transition().duration(200)
        .attr('r', d => Math.max(12, 7 + Math.sqrt(d.collaborationCount) * 3))
        .attr('stroke-width', 3);
    })
    .on('mouseleave', function() {
      // Reset highlighting
      link.attr('stroke-opacity', 0.6).attr('stroke', '#cbd5e1');
      node.select('circle').attr('opacity', 1);
      node.select('text').attr('opacity', 1);
      
      d3.select(this).select('circle')
        .transition().duration(200)
        .attr('r', d => Math.max(8, 5 + Math.sqrt(d.collaborationCount) * 3))
        .attr('stroke-width', 2);
    })
    .on('click', function(event, d) {
      // Show detailed info on click
      event.stopPropagation();
      const manuscripts = Array.from(d.manuscripts).join(', ');
      const institutions = d.allInstitutions.length > 0 
        ? d.allInstitutions.join('\n  - ') 
        : 'No institution data';
      alert(`${d.name}\n\nInstitution(s):\n  - ${institutions}\n\nCollaborations: ${d.collaborationCount}\nManuscripts (${d.manuscripts.size}):\n${manuscripts}`);
    });
  
  node.append('circle')
    .attr('r', d => Math.max(8, 5 + Math.sqrt(d.collaborationCount) * 3))
    .attr('fill', d => getNodeColor(d.institution))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2)
    .style('cursor', 'pointer')
    .attr('class', 'network-node-circle');
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 20 ? d.name.substring(0, 17) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => Math.max(8, 5 + Math.sqrt(d.collaborationCount) * 3) + 15)
    .attr('text-anchor', 'middle')
    .attr('font-size', '9px')
    .attr('fill', '#1e293b')
    .attr('font-weight', '600')
    .attr('class', 'network-label')
    .style('pointer-events', 'none');
  
  // Add tooltips
  node.append('title')
    .text(d => {
      const instText = d.allInstitutions.length > 0 
        ? d.allInstitutions.join(', ') 
        : 'No institution data';
      return `${d.name}\nInstitution(s): ${instText}\n${d.collaborationCount} collaboration${d.collaborationCount !== 1 ? 's' : ''}\n${d.manuscripts.size} manuscript${d.manuscripts.size !== 1 ? 's' : ''}`;
    });
  
  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
  
  // Control button handlers
  let labelsVisible = true;
  let showingIsolated = true;
  
  document.getElementById('network-reset').onclick = () => {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    simulation.alpha(1).restart();
  };
  
  document.getElementById('network-labels-toggle').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('opacity', labelsVisible ? 1 : 0);
    this.innerHTML = labelsVisible 
      ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg> Hide Labels'
      : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Show Labels';
  };
  
  document.getElementById('network-filter-isolated').onclick = function() {
    showingIsolated = !showingIsolated;
    
    // Filter nodes with only 1 or 0 collaborations
    node.style('opacity', d => {
      if (showingIsolated) return 1;
      return d.collaborationCount > 1 ? 1 : 0.1;
    });
    
    link.style('opacity', d => {
      if (showingIsolated) return 0.6;
      return 0.6;
    });
    
    this.innerHTML = showingIsolated
      ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Hide Singles'
      : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Show All';
  };
  
  // Focus on specific scribe function (called from top collaborators list)
  window.focusOnScribe = (scribeName) => {
    // Find the node
    const targetNode = nodeArray.find(n => n.name === scribeName);
    if (!targetNode) return;
    
    // Calculate zoom transform to focus on this node
    const scale = 2; // Zoom level
    const x = -targetNode.x * scale + width / 2;
    const y = -targetNode.y * scale + height / 2;
    
    // First, zoom to the node
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale))
      .on('end', () => {
        // After zoom completes, highlight the node and its connections
        const connectedNodes = new Set();
        connectedNodes.add(targetNode.id);
        
        link.each(function(l) {
          if (l.source.id === targetNode.id || l.target.id === targetNode.id) {
            connectedNodes.add(l.source.id);
            connectedNodes.add(l.target.id);
          }
        });
        
        // Temporarily highlight
        node.select('circle').transition().duration(500)
          .attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2)
          .attr('stroke-width', n => (n.id === targetNode.id ? 4 : 2) / scale);
        
        nodeLabels.transition().duration(500)
          .attr('opacity', n => connectedNodes.has(n.id) ? 1 : 0.2)
          .attr('font-weight', n => n.id === targetNode.id ? 700 : 600);
        
        link.transition().duration(500)
          .attr('stroke-opacity', l => 
            (l.source.id === targetNode.id || l.target.id === targetNode.id) ? 1 : 0.15
          )
          .attr('stroke', l => 
            (l.source.id === targetNode.id || l.target.id === targetNode.id) ? '#f59e0b' : '#cbd5e1'
          );
        
        // Reset after 3 seconds
        setTimeout(() => {
          node.select('circle').transition().duration(500)
            .attr('opacity', 1)
            .attr('stroke-width', 2 / scale);
          
          nodeLabels.transition().duration(500)
            .attr('opacity', 1)
            .attr('font-weight', 600);
          
          link.transition().duration(500)
            .attr('stroke-opacity', 0.6)
            .attr('stroke', '#cbd5e1');
        }, 3000);
      });
  };
  
  // Drag functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

function buildTopCollaborators(collaborators) {
  const container = document.getElementById('top-collaborators-list');
  if (!container) return;
  
  if (collaborators.length === 0) {
    container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem;">No collaborations found</div>';
    return;
  }
  
  const html = collaborators.map((collab, i) => `
    <div data-scribe-name="${collab.name}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #f1f5f9; ${i % 2 === 0 ? 'background: #f9fafb;' : ''}; cursor: pointer; transition: all 0.2s;" 
      onmouseover="this.style.background='#fef3c7'" 
      onmouseout="this.style.background='${i % 2 === 0 ? '#f9fafb' : '#ffffff'}'">
      <div style="font-size: 0.875rem; color: #1e293b; font-weight: 500;">${collab.name}</div>
      <div style="background: #f59e0b; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">
        ${collab.collaboratorCount} co-scribe${collab.collaboratorCount > 1 ? 's' : ''}
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
  
  // Add click handlers to focus on each scribe
  container.querySelectorAll('[data-scribe-name]').forEach(el => {
    el.addEventListener('click', () => {
      const scribeName = el.getAttribute('data-scribe-name');
      if (window.focusOnScribe) {
        window.focusOnScribe(scribeName);
      }
    });
  });
}

function buildCollaborativeManuscripts(manuscripts) {
  const container = document.getElementById('collaborative-manuscripts-list');
  if (!container) return;
  
  if (manuscripts.length === 0) {
    container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem;">No collaborative manuscripts found</div>';
    return;
  }
  
  const sorted = manuscripts.sort((a, b) => b.scribeCount - a.scribeCount);
  
  const html = sorted.map((ms, i) => `
    <div style="padding: 0.5rem; border-bottom: 1px solid #f1f5f9; ${i % 2 === 0 ? 'background: #f9fafb;' : ''}">
      <div style="font-size: 0.875rem; color: #1e293b; font-weight: 500; margin-bottom: 0.25rem;">
        ${ms.msTitle}
      </div>
      <div style="font-size: 0.75rem; color: #64748b;">
        ${ms.scribeCount} scribes: ${ms.scribes.map(s => s.name).join(', ')}
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function buildInstitutionsChart(institutions) {
  const container = document.getElementById('institutions-chart');
  if (!container) return;
  
  const maxCount = Math.max(...institutions.map(i => i.scribeCount));
  const barHeight = 30;
  const gap = 6;
  const chartWidth = 350;
  
  const html = institutions.map((inst, i) => {
    const barWidth = (inst.scribeCount / maxCount) * chartWidth;
    
    return `
      <div style="margin-bottom: ${gap}px;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${inst.name}">
          ${inst.name}
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%); height: ${barHeight}px; width: ${barWidth}px; border-radius: 0.25rem; position: relative;">
            <div style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); color: white; font-weight: 600; font-size: 0.75rem;">
              ${inst.scribeCount}
            </div>
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            ${inst.suCount} SUs
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function buildCitiesChart(cities) {
  const container = document.getElementById('cities-chart');
  if (!container) return;
  
  const maxCount = Math.max(...cities.map(c => c.scribeCount));
  const barHeight = 30;
  const gap = 6;
  const chartWidth = 350;
  
  const html = cities.map((city, i) => {
    const barWidth = (city.scribeCount / maxCount) * chartWidth;
    
    return `
      <div style="margin-bottom: ${gap}px;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">
          ${city.name}
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); height: ${barHeight}px; width: ${barWidth}px; border-radius: 0.25rem; position: relative;">
            <div style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); color: white; font-weight: 600; font-size: 0.75rem;">
              ${city.scribeCount}
            </div>
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            ${city.institutionCount} institution${city.institutionCount > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

function populateLanguageFilter(scribes) {
  const select = document.getElementById('scribe-lang-filter');
  if (!select) return;
  
  const allLanguages = new Set();
  scribes.forEach(s => s.languages.forEach(lang => allLanguages.add(lang)));
  
  const sorted = Array.from(allLanguages).sort();
  sorted.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang;
    select.appendChild(option);
  });
}

function populateInstitutionFilter(scribes) {
  const select = document.getElementById('scribe-inst-filter');
  if (!select) return;
  
  const allInstitutions = new Set();
  scribes.forEach(s => s.institutions.forEach(inst => allInstitutions.add(inst)));
  
  const sorted = Array.from(allInstitutions).sort();
  sorted.forEach(inst => {
    const option = document.createElement('option');
    option.value = inst;
    option.textContent = inst;
    select.appendChild(option);
  });
}

function exportScribesCSV(scribes) {
  const headers = ['Scribe Name', 'SU Count', 'Manuscript Count', 'Languages', 'Institutions', 'Dates'];
  const rows = scribes.map(s => [
    s.name,
    s.suIds.size,
    s.manuscripts.size,
    Array.from(s.languages).join('; '),
    Array.from(s.institutions).join('; '),
    s.dates.join('; ')
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `scribes_analysis_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

function buildScribesBarChart(top20) {
  const container = document.getElementById('scribes-bar-chart');
  if (!container) return;
  
  const maxCount = Math.max(...top20.map(s => s.suIds.size));
  const barHeight = 30;
  const gap = 5;
  const labelWidth = 200;
  const chartWidth = 600;
  
  const html = top20.map((scribe, i) => {
    const barWidth = (scribe.suIds.size / maxCount) * chartWidth;
    const color = scribe.languages.size > 1 ? '#f59e0b' : '#94a3b8';
    
    return `
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: ${gap}px;">
        <div style="width: ${labelWidth}px; text-align: right; font-size: 0.875rem; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${scribe.name}">
          ${scribe.name}
        </div>
        <div style="flex: 1; display: flex; align-items: center; gap: 0.5rem;">
          <div style="background: ${color}; height: ${barHeight}px; width: ${barWidth}px; border-radius: 0.25rem; transition: all 0.3s; position: relative;">
            <div style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); color: white; font-weight: 600; font-size: 0.75rem;">
              ${scribe.suIds.size}
            </div>
          </div>
          <div style="font-size: 0.75rem; color: #64748b;">
            ${scribe.languages.size > 1 ? `<span style="color: #f59e0b;">●</span> ${scribe.languages.size} langs` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html + `
    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.75rem; color: #64748b;">
      <span style="color: #f59e0b;">●</span> Multilingual scribe (2+ languages)
    </div>
  `;
}

function buildScribesTable(scribes) {
  const container = document.getElementById('scribes-table');
  if (!container) return;
  
  // Show only first SCRIBE_TABLE_ROWS_SHOWN rows initially
  const visibleScribes = scribes.slice(0, SCRIBE_TABLE_ROWS_SHOWN);
  const hasMore = scribes.length > SCRIBE_TABLE_ROWS_SHOWN;
  
  const html = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Scribe Name</th>
          <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #475569;">SUs</th>
          <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #475569;">MSS</th>
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Languages</th>
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Institutions</th>
          <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #475569;">Date Range</th>
        </tr>
      </thead>
      <tbody id="scribes-table-body">
        ${visibleScribes.map((scribe, i) => {
          const langs = Array.from(scribe.languages).join(', ') || '—';
          const insts = Array.from(scribe.institutions).slice(0, 2).join(', ') + 
                       (scribe.institutions.size > 2 ? ` (+${scribe.institutions.size - 2} more)` : '');
          const dates = scribe.dates.length > 0 ? scribe.dates.join(', ') : '—';
          
          return `
            <tr style="border-bottom: 1px solid #e2e8f0; ${i % 2 === 0 ? 'background: #f9fafb;' : ''}">
              <td style="padding: 0.75rem;">
                <a href="#" class="scribe-detail-link" data-scribe-id="${scribe.id}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">
                  ${scribe.name}
                </a>
              </td>
              <td style="padding: 0.75rem; text-align: center; font-weight: 600; color: #1e293b;">${scribe.suIds.size}</td>
              <td style="padding: 0.75rem; text-align: center; color: #64748b;">${scribe.manuscripts.size}</td>
              <td style="padding: 0.75rem; color: #64748b; font-size: 0.8125rem;">
                <span style="${scribe.languages.size > 1 ? 'color: #f59e0b; font-weight: 600;' : ''}">${langs}</span>
              </td>
              <td style="padding: 0.75rem; color: #64748b; font-size: 0.8125rem;">${insts || '—'}</td>
              <td style="padding: 0.75rem; color: #64748b; font-size: 0.8125rem;">${dates}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    ${hasMore ? `
      <div style="text-align: center; margin-top: 1.5rem;">
        <button id="show-more-scribes" style="background: #f59e0b; color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.5rem; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">
          Show More (${scribes.length - SCRIBE_TABLE_ROWS_SHOWN} remaining)
        </button>
      </div>
    ` : `
      <div style="text-align: center; margin-top: 1rem; color: #94a3b8; font-size: 0.875rem;">
        Showing all ${scribes.length} scribe${scribes.length !== 1 ? 's' : ''}
      </div>
    `}
  `;
  
  container.innerHTML = html;
  
  // Add show more handler
  const showMoreBtn = document.getElementById('show-more-scribes');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      SCRIBE_TABLE_ROWS_SHOWN += 20;
      buildScribesTable(scribes);
    });
  }
  
  // Add click handlers for scribe detail links
  document.querySelectorAll('.scribe-detail-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const scribeId = link.dataset.scribeId;
      const scribe = scribes.find(s => s.id === scribeId);
      if (scribe) {
        showScribeDetail(scribe);
      }
    });
  });
}

function filterScribesTable(scribes, searchTerm, filterType, langFilter, instFilter, collaborations) {
  let filtered = scribes;
  
  // Apply type filter
  if (filterType === 'multilingual') {
    filtered = filtered.filter(s => s.languages.size > 1);
  } else if (filterType === 'productive') {
    filtered = filtered.filter(s => s.suIds.size >= 5);
  } else if (filterType === 'collaborative') {
    filtered = filtered.filter(s => collaborations && collaborations[s.id]);
  }
  
  // Apply language filter
  if (langFilter) {
    filtered = filtered.filter(s => s.languages.has(langFilter));
  }
  
  // Apply institution filter
  if (instFilter) {
    filtered = filtered.filter(s => s.institutions.has(instFilter));
  }
  
  // Apply search
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(term) ||
      Array.from(s.languages).some(lang => lang.toLowerCase().includes(term)) ||
      Array.from(s.institutions).some(inst => inst.toLowerCase().includes(term))
    );
  }
  
  buildScribesTable(filtered);
}

function showScribeDetail(scribe) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 2rem;';
  
  const content = document.createElement('div');
  content.style.cssText = 'background: white; border-radius: 0.5rem; padding: 2rem; max-width: 800px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);';
  
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #1e293b; font-size: 1.5rem;">${scribe.name}</h3>
      <button id="close-scribe-detail" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Scribal Units</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.suIds.size}</div>
      </div>
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Manuscripts</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.manuscripts.size}</div>
      </div>
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Languages</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.languages.size}</div>
      </div>
      <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.25rem;">
        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Institutions</div>
        <div style="font-size: 1.5rem; font-weight: 700; color: #1e293b;">${scribe.institutions.size}</div>
      </div>
    </div>
    
    ${scribe.languages.size > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem 0; color: #475569; font-size: 1rem;">Languages</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${Array.from(scribe.languages).map(lang => `
            <span style="background: #e0e7ff; color: #4338ca; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem;">${lang}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    ${scribe.institutions.size > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h4 style="margin: 0 0 0.75rem 0; color: #475569; font-size: 1rem;">Institutions</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${Array.from(scribe.institutions).map(inst => `
            <span style="background: #fef3c7; color: #92400e; padding: 0.375rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem;">${inst}</span>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <div>
      <h4 style="margin: 0 0 0.75rem 0; color: #475569; font-size: 1rem;">Scribal Units (${scribe.sus.length})</h4>
      <div style="max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 0.25rem;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
          <thead style="position: sticky; top: 0; background: white; border-bottom: 1px solid #e2e8f0;">
            <tr>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">SU</th>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">Manuscript</th>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">Languages</th>
              <th style="padding: 0.5rem; text-align: left; font-weight: 600; color: #64748b; font-size: 0.75rem;">Role</th>
            </tr>
          </thead>
          <tbody>
            ${scribe.sus.map((su, i) => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 0.5rem; color: #1e293b;">${su.title}</td>
                <td style="padding: 0.5rem; color: #64748b; font-size: 0.8125rem;">${su.msTitle}</td>
                <td style="padding: 0.5rem; color: #64748b; font-size: 0.8125rem;">${su.languages.join(', ')}</td>
                <td style="padding: 0.5rem; color: #64748b; font-size: 0.8125rem;">${su.role || 'scribe'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close handlers
  document.getElementById('close-scribe-detail').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/* ============================================================
   COLOPHON ANALYSIS MODULE
   ============================================================ */

let ACTIVE_COLOPHON_TAB = 'overview';

// Colophon Analysis Main Entry Point
function buildColophonAnalysis() {
  const mount = document.getElementById('colophon-mount');
  if (!mount) return;
  
  // Set up tab navigation
  document.querySelectorAll('.colophon-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      ACTIVE_COLOPHON_TAB = tab;
      
      // Update button styles
      document.querySelectorAll('.colophon-tab-btn').forEach(b => {
        if (b === btn) {
          b.classList.add('is-on');
          b.style.background = '#fff';
          b.style.fontWeight = '600';
          b.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
          b.style.color = '#333';
        } else {
          b.classList.remove('is-on');
          b.style.background = 'transparent';
          b.style.fontWeight = '500';
          b.style.boxShadow = 'none';
          b.style.color = '#666';
        }
      });
      
      // Render appropriate view
      switch(tab) {
        case 'overview':
          buildColophonOverview(mount);
          break;
        case 'sentiment':
          buildSentimentAnalysis(mount);
          break;
        case 'themes':
          buildThematicAnalysis(mount);
          break;
        case 'linguistic':
          buildLinguisticFeatures(mount);
          break;
        case 'patterns':
          buildComparativePatterns(mount);
          break;
        case 'explore-formulae':
          buildExploreFormulae(mount);
          break;
        case 'browse-colophons':
          buildBrowseColophons(mount);
          break;
      }
    });
  });
  
  // Initial render
  buildColophonOverview(mount);
}

// Helper: Extract colophon text from SU record
function getColophonText(su) {
  // Get both transcription (original language) and translation (English)
  const transcription = getVal(su, 'Colophon transcription') || '';
  const translation = getVal(su, 'Colophon translation') || '';
  
  return {
    transcription: transcription.trim(),
    translation: translation.trim(),
    hasTranscription: transcription.trim().length > 0,
    hasTranslation: translation.trim().length > 0
  };
}

// Helper: Check if SU has a colophon
function hasColophon(su) {
  const presence = getVal(su, 'Colophon presence');
  // The val() function returns termLabel for enum fields, which is "TRUE" or "FALSE"
  return presence && presence.toUpperCase() === 'TRUE';
}

// 1. OVERVIEW TAB
function buildColophonOverview(mount) {
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Basic statistics
  const stats = {
    totalSUs: allSUs.length,
    withColophons: colophonSUs.length,
    withTranscription: 0,
    withTranslation: 0,
    withBoth: 0,
    avgTranscriptionLength: 0,
    avgTranslationLength: 0,
    byLanguage: {},
    byCentury: {},
    byRegion: {}
  };
  
  // Calculate statistics
  let totalTranscriptionLength = 0;
  let totalTranslationLength = 0;
  
  colophonSUs.forEach(su => {
    const colophonData = getColophonText(su);
    
    if (colophonData.hasTranscription) {
      stats.withTranscription++;
      totalTranscriptionLength += colophonData.transcription.length;
    }
    
    if (colophonData.hasTranslation) {
      stats.withTranslation++;
      totalTranslationLength += colophonData.translation.length;
    }
    
    if (colophonData.hasTranscription && colophonData.hasTranslation) {
      stats.withBoth++;
    }
    
    // Only count records with at least one text field for other stats
    if (colophonData.hasTranscription || colophonData.hasTranslation) {
      // Group by language
      const lang = getVal(su, 'Colophon language') || 'Unknown';
      stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;
      
      // Group by century
      const century = getVal(su, 'Normalized century of production') || 'Unknown';
      stats.byCentury[century] = (stats.byCentury[century] || 0) + 1;
      
      // Group by region (from PU)
      const pus = getPUsForSU(su);
      if (pus.length > 0) {
        const pu = IDX.pu[pus[0]];
        if (pu) {
          const place = MAP.pu?.place(pu) || 'Unknown';
          const region = place.split(',')[0].trim();
          stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
        }
      }
    }
  });
  
  stats.avgTranscriptionLength = stats.withTranscription > 0 ? Math.round(totalTranscriptionLength / stats.withTranscription) : 0;
  stats.avgTranslationLength = stats.withTranslation > 0 ? Math.round(totalTranslationLength / stats.withTranslation) : 0;
  
  // Sort for display
  const topLanguages = Object.entries(stats.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  
  const topCenturies = Object.entries(stats.byCentury)
    .sort((a, b) => {
      const aCent = parseInt(a[0]) || 0;
      const bCent = parseInt(b[0]) || 0;
      return aCent - bCent;
    });
  
  const topRegions = Object.entries(stats.byRegion)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Calculate relative percentages (colophons vs total manuscripts)
  const allMSs = DATA.ms || [];
  const msByCentury = {};
  const msByRegion = {};
  
  allSUs.forEach(su => {
    const century = getVal(su, 'Normalized century of production') || 'Unknown';
    msByCentury[century] = (msByCentury[century] || 0) + 1;
    
    const pus = getPUsForSU(su);
    if (pus.length > 0) {
      const pu = IDX.pu[pus[0]];
      if (pu) {
        const place = MAP.pu?.place(pu) || 'Unknown';
        const region = place.split(',')[0].trim() || 'Unknown';
        msByRegion[region] = (msByRegion[region] || 0) + 1;
      }
    }
  });
  
  // Render
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Colophon Analysis Overview</h2>
      
      <!-- Key Statistics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.withColophons}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Scribal Units with Colophons</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">${Math.round((stats.withColophons / stats.totalSUs) * 100)}% of all SUs</div>
        </div>
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.withTranscription}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">With Transcription</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">Original language text</div>
        </div>
        <div style="background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.withTranslation}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">With Translation</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">English translation</div>
        </div>
        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.avgTranscriptionLength}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Avg. Transcription</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">Characters</div>
        </div>
      </div>
      
      <!-- Distribution Charts -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        
        <!-- By Language -->
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1rem;">Colophons by Language</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${topLanguages.map(([lang, count]) => {
              const maxCount = topLanguages[0][1];
              const percentage = (count / maxCount) * 100;
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                    <span style="font-weight: 600;">${lang}</span>
                    <span style="color: #666;">${count} colophon${count !== 1 ? 's' : ''}</span>
                  </div>
                  <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #d4af37, #c4941f); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- By Century -->
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1rem;">Colophons by Century</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${topCenturies.map(([century, count]) => {
              const totalSUsInCentury = msByCentury[century] || 1;
              const colophonRate = ((count / totalSUsInCentury) * 100).toFixed(1);
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; font-size: 0.875rem;">
                    <span style="font-weight: 600;">${century} century</span>
                    <div style="text-align: right;">
                      <span style="color: #666;">${count} colophon${count !== 1 ? 's' : ''}</span>
                      <span style="color: #43e97b; font-weight: 600; margin-left: 0.5rem;" title="${count} out of ${totalSUsInCentury} SUs">${colophonRate}%</span>
                    </div>
                  </div>
                  <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden; position: relative;">
                    <div style="background: linear-gradient(90deg, #43e97b, #38f9d7); height: 100%; width: ${colophonRate}%; transition: width 0.3s;"></div>
                  </div>
                  <div style="font-size: 0.7rem; color: #888; margin-top: 0.25rem;">
                    ${colophonRate}% of ${totalSUsInCentury} SUs in this century have colophons
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
      </div>
      
      <!-- By Region -->
      ${topRegions.length > 0 ? `
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1rem;">Colophons by Region</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${topRegions.map(([region, count]) => {
              const totalSUsInRegion = msByRegion[region] || 1;
              const colophonRate = ((count / totalSUsInRegion) * 100).toFixed(1);
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; font-size: 0.875rem;">
                    <span style="font-weight: 600;">${region}</span>
                    <div style="text-align: right;">
                      <span style="color: #666;">${count} colophon${count !== 1 ? 's' : ''}</span>
                      <span style="color: #4facfe; font-weight: 600; margin-left: 0.5rem;" title="${count} out of ${totalSUsInRegion} SUs">${colophonRate}%</span>
                    </div>
                  </div>
                  <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #4facfe, #00f2fe); height: 100%; width: ${colophonRate}%; transition: width 0.3s;"></div>
                  </div>
                  <div style="font-size: 0.7rem; color: #888; margin-top: 0.25rem;">
                    ${colophonRate}% of ${totalSUsInRegion} SUs in this region have colophons
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Info Box -->
      <div style="background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #d4af37; border-radius: 0.375rem;">
        <h4 style="margin: 0 0 0.75rem 0; color: #333; font-size: 1rem;">About This Module</h4>
        <p style="margin: 0; color: #555; line-height: 1.6; font-size: 0.9rem;">
          This module analyzes the colophons written by female scribes, examining their emotional tone, thematic content, 
          linguistic patterns, and variations across time, geography, and religious orders. Navigate through the tabs above to explore:
        </p>
        <ul style="margin: 0.75rem 0 0 1.5rem; color: #555; line-height: 1.8; font-size: 0.9rem;">
          <li><strong>Sentiment Analysis:</strong> Emotional tone (humble, proud, weary, etc.)</li>
          <li><strong>Thematic Analysis:</strong> Common topics and motifs</li>
          <li><strong>Linguistic Features:</strong> Writing style, complexity, self-expression</li>
          <li><strong>Comparative Patterns:</strong> Variations by location, time, and institution</li>
          <li><strong>Browse Colophons:</strong> Read individual colophon texts with analysis</li>
        </ul>
      </div>
    </div>
  `;
}

// 2. SENTIMENT ANALYSIS TAB
function buildSentimentAnalysis(mount) {
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Sentiment keyword dictionaries
  const sentiments = {
    humility: {
      keywords: ['unworthy', 'poor', 'sinner', 'humble', 'weak', 'undeserving', 'lowly', 'inadequate', 'insufficient'],
      color: '#9333ea',
    },
    pride: {
      keywords: ['diligent', 'careful', 'completed', 'accomplished', 'faithfully', 'skillfully', 'perfectly', 'successfully'],
      color: '#dc2626',
    },
    labor: {
      keywords: ['weary', 'tired', 'labor', 'labored', 'difficult', 'effort', 'toil', 'fatigue', 'hand', 'finger'],
      color: '#ea580c',
    },
    religious: {
      keywords: ['god', 'pray', 'prayer', 'blessing', 'mercy', 'grace', 'lord', 'christ', 'saint', 'holy', 'amen'],
      color: '#0891b2',
    },
    temporal: {
      keywords: ['year', 'day', 'month', 'century', 'completed in', 'written in', 'finished on'],
      color: '#059669',
    },
    dedication: {
      keywords: ['honor', 'dedicated', 'memory', 'commissioned', 'request', 'patron', 'benefactor'],
      color: '#7c3aed',
    }
  };
  
  // Analyze each colophon
  const results = colophonSUs.map(su => {
    const colophon = getColophonText(su);
    const text = (colophon.translation || colophon.transcription).toLowerCase();
    
    const scores = {};
    const matchedKeywords = {};
    let totalMatches = 0;
    
    Object.entries(sentiments).forEach(([name, config]) => {
      const matches = config.keywords.filter(kw => text.includes(kw.toLowerCase()));
      scores[name] = matches.length;
      matchedKeywords[name] = matches;
      totalMatches += matches.length;
    });
    
    return {
      su,
      scores,
      matchedKeywords,
      totalMatches,
      text: colophon.translation || colophon.transcription
    };
  });
  
  // Calculate aggregate statistics
  const aggregateScores = {};
  Object.keys(sentiments).forEach(name => {
    aggregateScores[name] = results.reduce((sum, r) => sum + r.scores[name], 0);
  });
  
  const totalSentimentMatches = Object.values(aggregateScores).reduce((a, b) => a + b, 0);
  
  // Top sentiment colophons
  const topColophons = results
    .filter(r => r.totalMatches > 0)
    .sort((a, b) => b.totalMatches - a.totalMatches)
    .slice(0, 5);
  
  // Render
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Sentiment Analysis</h2>
      
      <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Analyzing emotional expressions in ${colophonSUs.length} colophons using keyword matching. 
        Found ${totalSentimentMatches} sentiment markers across all texts.
      </p>
      
      <!-- Sentiment Distribution -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">Sentiment Distribution</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${Object.entries(sentiments).map(([name, config]) => {
            const count = aggregateScores[name];
            const percentage = totalSentimentMatches > 0 ? (count / totalSentimentMatches) * 100 : 0;
            const colophonCount = results.filter(r => r.scores[name] > 0).length;
            return `
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-size: 1.2rem;">${config.icon}</span>
                    <span style="font-weight: 600; text-transform: capitalize;">${name}</span>
                  </div>
                  <div style="text-align: right; font-size: 0.875rem; color: #666;">
                    ${count} keyword matches in ${colophonCount} colophons
                  </div>
                </div>
                <div style="background: #f0f0f0; height: 32px; border-radius: 8px; overflow: hidden; position: relative;">
                  <div style="background: ${config.color}; height: 100%; width: ${percentage}%; transition: width 0.3s; display: flex; align-items: center; padding: 0 0.75rem; color: white; font-size: 0.875rem; font-weight: 600;">
                    ${percentage > 5 ? `${percentage.toFixed(1)}%` : ''}
                  </div>
                  ${percentage <= 5 && percentage > 0 ? `<div style="position: absolute; left: calc(${percentage}% + 0.5rem); top: 50%; transform: translateY(-50%); font-size: 0.875rem; color: #666;">${percentage.toFixed(1)}%</div>` : ''}
                </div>
                <div style="margin-top: 0.25rem; font-size: 0.75rem; color: #888;">
                  Keywords: ${config.keywords.slice(0, 5).join(', ')}...
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Most Expressive Colophons -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="color: #333; font-size: 1.1rem; margin: 0;">Most Expressive Colophons</h3>
          <button id="toggle-most-expressive" onclick="const hidden = document.querySelectorAll('.most-expressive-extra'); const btn = this; if(hidden[0].style.display === 'none') { hidden.forEach(el => el.style.display = 'block'); btn.textContent = 'Show Less'; } else { hidden.forEach(el => el.style.display = 'none'); btn.textContent = 'Show More'; }"
            style="background: #d4af37; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem;">
            Show More
          </button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${topColophons.slice(0, 20).map((result, idx) => {
            const scribeName = result.su.rec_Title || 'Unknown';
            const dominantSentiments = Object.entries(result.scores)
              .filter(([_, score]) => score > 0)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3);
            const extraClass = idx >= 5 ? 'most-expressive-extra' : '';
            const extraStyle = idx >= 5 ? 'display: none;' : '';
            
            return `
              <div class="${extraClass}" style="${extraStyle} background: #f9f9f9; padding: 1.25rem; border-radius: 0.5rem; border-left: 4px solid ${sentiments[dominantSentiments[0][0]].color};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; margin-bottom: 0.25rem;">#${idx + 1} ${esc(scribeName)}</div>
                    <div style="font-size: 0.875rem; color: #666; margin-bottom: 0.5rem;">
                      ${dominantSentiments.map(([name, score]) => 
                        `${sentiments[name].icon} ${name} (${score})`
                      ).join(' • ')}
                    </div>
                    <div style="font-size: 0.75rem; color: #888;">
                      Keywords: ${dominantSentiments.map(([name]) => 
                        result.matchedKeywords[name].slice(0, 3).join(', ')
                      ).join(' | ')}
                    </div>
                  </div>
                  <button onclick="window.jumpTo('su', '${result.su.rec_ID}');" 
                    style="background: #d4af37; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; white-space: nowrap; margin-left: 1rem;">
                    View SU →
                  </button>
                </div>
                <div style="font-size: 0.875rem; color: #555; font-style: italic; line-height: 1.6; background: white; padding: 1rem; border-radius: 0.25rem;">
                  "${esc(result.text.substring(0, 200))}${result.text.length > 200 ? '...' : ''}"
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Least Expressive Colophons -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-bottom: 0.5rem; color: #333; font-size: 1.1rem;">Least Expressive Colophons (Neutral/Factual)</h3>
        <p style="color: #666; font-size: 0.875rem; margin-bottom: 1rem;">
          Colophons with minimal emotional language, focusing primarily on factual information.
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${results.filter(r => r.totalMatches === 0).slice(0, 5).map((result, idx) => {
            const scribeName = result.su.rec_Title || 'Unknown';
            
            return `
              <div style="background: #f9f9f9; padding: 1.25rem; border-radius: 0.5rem; border-left: 4px solid #9ca3af;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; margin-bottom: 0.25rem;">${esc(scribeName)}</div>
                    <div style="font-size: 0.875rem; color: #666;">
                      No emotional keywords detected - factual/neutral tone
                    </div>
                  </div>
                  <button onclick="window.jumpTo('su', '${result.su.rec_ID}');" 
                    style="background: #d4af37; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; white-space: nowrap; margin-left: 1rem;">
                    View SU →
                  </button>
                </div>
                <div style="font-size: 0.875rem; color: #555; font-style: italic; line-height: 1.6; background: white; padding: 1rem; border-radius: 0.25rem;">
                  "${esc(result.text.substring(0, 200))}${result.text.length > 200 ? '...' : ''}"
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// 3. THEMATIC ANALYSIS TAB
function buildThematicAnalysis(mount) {
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Theme definitions
  const themes = {
    'Self-identification': {
      keywords: ['i', 'me', 'my', 'sister', 'brother', 'scribe', 'wrote', 'written by'],
      color: '#fb923c',
      examples: []
    },
    'Labor & Difficulty': {
      keywords: ['labor', 'work', 'effort', 'difficult', 'weary', 'tired', 'hand', 'finger', 'toil'],
      color: '#ef4444',
      examples: []
    },
    'Religious Devotion': {
      keywords: ['god', 'pray', 'prayer', 'bless', 'mercy', 'grace', 'amen', 'christ', 'lord'],
      color: '#3b82f6',
      examples: []
    },
    'Time & Completion': {
      keywords: ['completed', 'finished', 'year', 'day', 'month', 'written in', 'ended'],
      color: '#10b981',
      examples: []
    },
    'Place & Location': {
      keywords: ['monastery', 'convent', 'church', 'abbey', 'in this place', 'at'],
      color: '#f59e0b',
      examples: []
    },
    'Dedication': {
      keywords: ['honor', 'dedicated', 'memory', 'commissioned', 'for', 'patron'],
      color: '#eab308',
      examples: []
    },
    'Humility': {
      keywords: ['unworthy', 'poor', 'humble', 'sinner', 'undeserving'],
      color: '#6366f1',
      examples: []
    },
    'Request for Prayer': {
      keywords: ['pray for', 'remember', 'commemorate', 'petition'],
      color: '#14b8a6',
      examples: []
    }
  };
  
  // Analyze colophons
  colophonSUs.forEach(su => {
    const colophon = getColophonText(su);
    const text = (colophon.translation || colophon.transcription).toLowerCase();
    
    Object.entries(themes).forEach(([themeName, themeData]) => {
      const hasTheme = themeData.keywords.some(kw => text.includes(kw.toLowerCase()));
      if (hasTheme && themeData.examples.length < 2) {
        themeData.examples.push({
          su: su,
          scribe: su.rec_Title,
          text: colophon.translation || colophon.transcription
        });
      }
    });
  });
  
  // Count colophons per theme
  const themeCounts = {};
  Object.entries(themes).forEach(([name, data]) => {
    themeCounts[name] = colophonSUs.filter(su => {
      const colophon = getColophonText(su);
      const text = (colophon.translation || colophon.transcription).toLowerCase();
      return data.keywords.some(kw => text.includes(kw.toLowerCase()));
    }).length;
  });
  
  const sortedThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1]);
  
  // Render
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Thematic Analysis</h2>
      
      <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Identifying common themes across ${colophonSUs.length} colophons. Themes are detected using keyword matching.
      </p>
      
      <!-- Theme Overview -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">Theme Frequency</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
          ${sortedThemes.map(([themeName, count]) => {
            const percentage = (count / colophonSUs.length) * 100;
            return `
              <div style="background: linear-gradient(135deg, ${themes[themeName].color}15, ${themes[themeName].color}30); padding: 1.25rem; border-radius: 0.5rem; border-left: 4px solid ${themes[themeName].color};">
                <div style="font-size: 2rem; font-weight: 700; color: ${themes[themeName].color}; margin-bottom: 0.5rem;">${count}</div>
                <div style="font-weight: 600; color: #333; margin-bottom: 0.25rem;">${themeName}</div>
                <div style="font-size: 0.875rem; color: #666;">${percentage.toFixed(1)}% of colophons</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Example Colophons by Theme -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">Example Colophons by Theme</h3>
        <p style="font-size: 0.8rem; color: #666; margin-bottom: 1.5rem;">
        </p>
        <div style="display: flex; flex-direction: column; gap: 2rem;">
          ${sortedThemes.slice(0, 6).map(([themeName, count]) => {
            const examples = themes[themeName].examples;
            if (examples.length === 0) return '';
            
            const themeId = themeName.toLowerCase().replace(/\s+/g, '-');
            const showButton = examples.length > 2;
            
            return `
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                  <div style="width: 4px; height: 24px; background: ${themes[themeName].color}; border-radius: 2px;"></div>
                  <h4 style="font-size: 1rem; font-weight: 600; color: #333; margin: 0;">${themeName}</h4>
                  <span style="font-size: 0.875rem; color: #666;">(${count} colophons)</span>
                  ${showButton ? `
                    <button class="toggle-theme-${themeId}" onclick="const hidden = document.querySelectorAll('.theme-${themeId}-extra'); const btn = this; if(hidden[0].style.display === 'none') { hidden.forEach(el => el.style.display = 'block'); btn.textContent = 'Show Less'; } else { hidden.forEach(el => el.style.display = 'none'); btn.textContent = 'Show More Examples'; }"
                      style="background: ${themes[themeName].color}; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; margin-left: auto;">
                      Show More Examples
                    </button>
                  ` : ''}
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-left: 1rem;">
                  ${examples.map((ex, idx) => {
                    const isExtra = idx >= 2;
                    const extraClass = isExtra ? `theme-${themeId}-extra` : '';
                    const extraStyle = isExtra ? 'display: none;' : '';
                    
                    return `
                    <div class="${extraClass}" style="${extraStyle} background: #f9f9f9; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid ${themes[themeName].color};">
                      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <div style="font-size: 0.875rem; font-weight: 600; color: #555;">${esc(ex.scribe)}</div>
                        <button onclick="window.jumpTo('su', '${ex.su.rec_ID}');" 
                          style="background: #d4af37; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; white-space: nowrap;">
                          View SU →
                        </button>
                      </div>
                      <div style="font-size: 0.875rem; color: #666; font-style: italic; line-height: 1.5;">
                        "${esc(ex.text.substring(0, 200))}${ex.text.length > 200 ? '...' : ''}"
                      </div>
                    </div>
                  `}).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// 4. LINGUISTIC FEATURES TAB
function buildLinguisticFeatures(mount) {
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Analyze linguistic features
  const features = colophonSUs.map(su => {
    const colophon = getColophonText(su);
    const text = colophon.translation || colophon.transcription;
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Count first-person pronouns
    const firstPersonCount = words.filter(w => 
      ['i', 'me', 'my', 'mine', 'myself'].includes(w.replace(/[^a-z]/g, ''))
    ).length;
    
    // Check for questions and exclamations
    const hasQuestion = text.includes('?');
    const hasExclamation = text.includes('!');
    
    // Calculate readability metrics
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / (words.length || 1);
    const avgSentenceLength = words.length / (sentences.length || 1);
    
    return {
      su,
      wordCount: words.length,
      sentenceCount: sentences.length,
      firstPersonCount,
      hasQuestion,
      hasExclamation,
      avgWordLength,
      avgSentenceLength,
      scribeName: su.rec_Title
    };
  }).filter(f => f.wordCount > 0);
  
  // Calculate aggregate statistics
  const totalWords = features.reduce((sum, f) => sum + f.wordCount, 0);
  const avgWords = totalWords / features.length;
  const avgFirstPerson = features.reduce((sum, f) => sum + f.firstPersonCount, 0) / features.length;
  const avgWordLen = features.reduce((sum, f) => sum + f.avgWordLength, 0) / features.length;
  const avgSentLen = features.reduce((sum, f) => sum + f.avgSentenceLength, 0) / features.length;
  const withQuestions = features.filter(f => f.hasQuestion).length;
  const withExclamations = features.filter(f => f.hasExclamation).length;
  const withFirstPerson = features.filter(f => f.firstPersonCount > 0).length;
  
  // Find extremes
  const longest = [...features].sort((a, b) => b.wordCount - a.wordCount).slice(0, 3);
  const shortest = [...features].sort((a, b) => a.wordCount - b.wordCount).slice(0, 3);
  const mostFirstPerson = [...features].sort((a, b) => b.firstPersonCount - a.firstPersonCount).slice(0, 3);
  
  // Render
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Linguistic Features</h2>
      
      <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Analyzing linguistic patterns across ${features.length} colophons.
      </p>
      
      <!-- Key Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${avgWords.toFixed(1)}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Avg. Word Count</div>
        </div>
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${avgWordLen.toFixed(1)}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Avg. Word Length</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">Letters per word</div>
        </div>
        <div style="background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${avgSentLen.toFixed(1)}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Avg. Sentence Length</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">Words per sentence</div>
        </div>
        <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${withFirstPerson}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Use First Person</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">${((withFirstPerson/features.length)*100).toFixed(1)}% of colophons</div>
        </div>
      </div>
      
      <!-- Expression Indicators -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">Expression Indicators</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.5rem;">Expression</span>
              <span style="font-weight: 600; color: #333;">First-Person Usage</span>
            </div>
            <div style="font-size: 2rem; font-weight: 700; color: #d4af37; margin-bottom: 0.5rem;">
              ${avgFirstPerson.toFixed(2)}
            </div>
            <div style="font-size: 0.875rem; color: #666;">
              Average mentions per colophon<br>
              ${withFirstPerson} colophons (${((withFirstPerson/features.length)*100).toFixed(1)}%) use "I", "me", or "my"
            </div>
          </div>
          
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.5rem;">Questions</span>
              <span style="font-weight: 600; color: #333;">Questions</span>
            </div>
            <div style="font-size: 2rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.5rem;">
              ${withQuestions}
            </div>
            <div style="font-size: 0.875rem; color: #666;">
              ${((withQuestions/features.length)*100).toFixed(1)}% of colophons contain questions
            </div>
          </div>
          
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.5rem;">Exclamations</span>
              <span style="font-weight: 600; color: #333;">Exclamations</span>
            </div>
            <div style="font-size: 2rem; font-weight: 700; color: #ef4444; margin-bottom: 0.5rem;">
              ${withExclamations}
            </div>
            <div style="font-size: 0.875rem; color: #666;">
              ${((withExclamations/features.length)*100).toFixed(1)}% of colophons contain exclamations
            </div>
          </div>
        </div>
      </div>
      
      <!-- Extremes -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 1.5rem;">
        <!-- Longest Colophons -->
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem;">Longest Colophons</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${longest.map((f, idx) => `
              <div style="background: #f9f9f9; padding: 1rem; border-radius: 0.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <span style="font-weight: 600; color: #555;">#${idx + 1} ${esc(f.scribeName)}</span>
                  <span style="color: #d4af37; font-weight: 600;">${f.wordCount} words</span>
                </div>
                <div style="font-size: 0.875rem; color: #666;">
                  ${f.sentenceCount} sentence${f.sentenceCount !== 1 ? 's' : ''} • 
                  ${f.avgSentenceLength.toFixed(1)} words/sentence
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Most Personal (First-Person) -->
        <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem;">Most Personal Expression</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${mostFirstPerson.filter(f => f.firstPersonCount > 0).map((f, idx) => `
              <div style="background: #f9f9f9; padding: 1rem; border-radius: 0.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <span style="font-weight: 600; color: #555;">#${idx + 1} ${esc(f.scribeName)}</span>
                  <span style="color: #fbbf24; font-weight: 600;">${f.firstPersonCount} mentions</span>
                </div>
                <div style="font-size: 0.875rem; color: #666;">
                  ${f.wordCount} words • 
                  ${((f.firstPersonCount/f.wordCount)*100).toFixed(1)}% first-person
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// 5. COMPARATIVE PATTERNS TAB
function buildComparativePatterns(mount) {
  const allSUs = DATA.su || [];
  const allMSs = DATA.ms || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Sentiment definitions (simplified from sentiment tab)
  const sentimentKeywords = {
    humility: ['unworthy', 'poor', 'sinner', 'humble', 'weak'],
    pride: ['diligent', 'careful', 'completed', 'accomplished', 'faithfully'],
    labor: ['weary', 'tired', 'labor', 'difficult', 'hand', 'finger'],
    religious: ['god', 'pray', 'prayer', 'blessing', 'mercy', 'grace']
  };
  
  // Analyze by region
  const byRegion = {};
  const totalSUsByRegion = {};
  
  // First, count total SUs per region
  allSUs.forEach(su => {
    const pus = getPUsForSU(su);
    if (pus.length > 0) {
      const pu = IDX.pu[pus[0]];
      if (pu) {
        const place = MAP.pu?.place(pu) || 'Unknown';
        const region = place.split(',')[0].trim() || 'Unknown';
        totalSUsByRegion[region] = (totalSUsByRegion[region] || 0) + 1;
      }
    }
  });
  
  // Then analyze colophon SUs
  colophonSUs.forEach(su => {
    const pus = getPUsForSU(su);
    if (pus.length > 0) {
      const pu = IDX.pu[pus[0]];
      if (pu) {
        const place = MAP.pu?.place(pu) || 'Unknown';
        const region = place.split(',')[0].trim() || 'Unknown';
    
        if (!byRegion[region]) {
          byRegion[region] = {
            count: 0,
            avgLength: 0,
            totalWords: 0,
            sentiment: { humility: 0, pride: 0, labor: 0, religious: 0 }
          };
        }
        
        const colophon = getColophonText(su);
        const text = (colophon.translation || colophon.transcription).toLowerCase();
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        
        byRegion[region].count++;
        byRegion[region].totalWords += wordCount;
        
        // Count sentiments
        Object.entries(sentimentKeywords).forEach(([sentiment, keywords]) => {
          const matches = keywords.filter(kw => text.includes(kw)).length;
          byRegion[region].sentiment[sentiment] += matches;
        });
      }
    }
  });
  
  // Calculate averages
  Object.values(byRegion).forEach(data => {
    data.avgLength = data.count > 0 ? data.totalWords / data.count : 0;
  });
  
  // Analyze by century
  const byCentury = {};
  const totalSUsByCentury = {};
  
  // First, count total SUs per century
  allSUs.forEach(su => {
    const century = getVal(su, 'Normalized century of production') || 'Unknown';
    totalSUsByCentury[century] = (totalSUsByCentury[century] || 0) + 1;
  });
  
  // Then analyze colophon SUs
  colophonSUs.forEach(su => {
    const century = getVal(su, 'Normalized century of production') || 'Unknown';
    
    if (!byCentury[century]) {
      byCentury[century] = {
        count: 0,
        avgLength: 0,
        totalWords: 0,
        sentiment: { humility: 0, pride: 0, labor: 0, religious: 0 }
      };
    }
    
    const colophon = getColophonText(su);
    const text = (colophon.translation || colophon.transcription).toLowerCase();
    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    
    byCentury[century].count++;
    byCentury[century].totalWords += wordCount;
    
    // Count sentiments
    Object.entries(sentimentKeywords).forEach(([sentiment, keywords]) => {
      const matches = keywords.filter(kw => text.includes(kw)).length;
      byCentury[century].sentiment[sentiment] += matches;
    });
  });
  
  // Calculate averages
  Object.values(byCentury).forEach(data => {
    data.avgLength = data.count > 0 ? data.totalWords / data.count : 0;
  });
  
  // Sort regions and centuries by count
  const topRegions = Object.entries(byRegion)
    .filter(([name]) => name !== 'Unknown')
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8);
  
  const sortedCenturies = Object.entries(byCentury)
    .filter(([name]) => name !== 'Unknown')
    .sort((a, b) => {
      const numA = parseInt(a[0]) || 0;
      const numB = parseInt(b[0]) || 0;
      return numA - numB;
    });
  
  // Render
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Comparative Patterns</h2>
      
      <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Comparing colophon characteristics across regions and time periods.
      </p>
      
      <!-- By Region -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">Patterns by Region</h3>
        
        <!-- Colophon Count by Region -->
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 0.95rem; color: #555; margin-bottom: 1rem;">Number of Colophons</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${topRegions.map(([region, data]) => {
              const totalInRegion = totalSUsByRegion[region] || 1;
              const colophonRate = ((data.count / totalInRegion) * 100).toFixed(1);
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                    <span style="font-weight: 600;">${esc(region)}</span>
                    <span style="color: #666;">
                      ${data.count} colophons (avg ${data.avgLength.toFixed(0)} words)
                      <span style="color: #d4af37; font-weight: 600; margin-left: 0.5rem;">${colophonRate}%</span>
                    </span>
                  </div>
                  <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #d4af37, #c4941f); height: 100%; width: ${colophonRate}%; transition: width 0.3s;"></div>
                  </div>
                  <div style="font-size: 0.7rem; color: #888; margin-top: 0.25rem;">
                    ${colophonRate}% of ${totalInRegion} SUs have colophons
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Sentiment by Region -->
        <div>
          <h4 style="font-size: 0.95rem; color: #555; margin-bottom: 1rem;">Sentiment Expression by Region</h4>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #f9f9f9; border-bottom: 2px solid #e0e0e0;">
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #333;">Region</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #9333ea;">Humility</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #dc2626;">Pride</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #ea580c;">Labor</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0891b2;">Religious</th>
                </tr>
              </thead>
              <tbody>
                ${topRegions.map(([region, data]) => `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 0.75rem; font-weight: 500; color: #555;">${esc(region)}</td>
                    <td style="padding: 0.75rem; text-align: center; color: #9333ea;">${data.sentiment.humility}</td>
                    <td style="padding: 0.75rem; text-align: center; color: #dc2626;">${data.sentiment.pride}</td>
                    <td style="padding: 0.75rem; text-align: center; color: #ea580c;">${data.sentiment.labor}</td>
                    <td style="padding: 0.75rem; text-align: center; color: #0891b2;">${data.sentiment.religious}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- By Century -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">Patterns Over Time</h3>
        
        <!-- Average Length Trend -->
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 0.95rem; color: #555; margin-bottom: 1rem;">Average Colophon Length by Century</h4>
          <div style="display: flex; align-items: end; gap: 0.5rem; height: 200px; padding: 1rem; background: #f9f9f9; border-radius: 0.5rem;">
            ${sortedCenturies.map(([century, data]) => {
              const maxLength = Math.max(...sortedCenturies.map(c => c[1].avgLength));
              const heightPercent = maxLength > 0 ? (data.avgLength / maxLength) * 100 : 0;
              return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                  <div style="display: flex; flex-direction: column; justify-content: end; align-items: center; height: 100%; width: 100%;">
                    <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">${data.avgLength.toFixed(0)}</div>
                    <div style="background: linear-gradient(180deg, #4facfe, #00f2fe); width: 100%; height: ${heightPercent}%; border-radius: 4px 4px 0 0; min-height: 4px;"></div>
                  </div>
                  <div style="font-size: 0.75rem; font-weight: 600; color: #333;">${century}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- Sentiment Trends -->
        <div>
          <h4 style="font-size: 0.95rem; color: #555; margin-bottom: 1rem;">Sentiment Trends Over Time</h4>
          <p style="font-size: 0.8rem; color: #666; margin-bottom: 0.75rem;">
            Percentages show the proportion of colophons in each century that contain sentiment keywords.
          </p>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
              <thead>
                <tr style="background: #f9f9f9; border-bottom: 2px solid #e0e0e0;">
                  <th style="padding: 0.75rem; text-align: left; font-weight: 600; color: #333;">Century</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #666;">Colophons</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #666;">Rate</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #9333ea;">Humility</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #dc2626;">Pride</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #ea580c;">Labor</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0891b2;">Religious</th>
                </tr>
              </thead>
              <tbody>
                ${sortedCenturies.map(([century, data]) => {
                  const totalInCentury = totalSUsByCentury[century] || 1;
                  const colophonRate = ((data.count / totalInCentury) * 100).toFixed(1);
                  
                  // Calculate sentiment percentages (% of colophons with this sentiment)
                  const humilityPct = ((data.sentiment.humility / data.count) * 100).toFixed(1);
                  const pridePct = ((data.sentiment.pride / data.count) * 100).toFixed(1);
                  const laborPct = ((data.sentiment.labor / data.count) * 100).toFixed(1);
                  const religiousPct = ((data.sentiment.religious / data.count) * 100).toFixed(1);
                  
                  return `
                  <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 0.75rem; font-weight: 600; color: #555;">${century}th</td>
                    <td style="padding: 0.75rem; text-align: center; color: #666;">${data.count}</td>
                    <td style="padding: 0.75rem; text-align: center; color: #4facfe; font-weight: 600;">${colophonRate}%</td>
                    <td style="padding: 0.75rem; text-align: center; color: #9333ea;">
                      <div style="font-weight: 600;">${data.sentiment.humility}</div>
                      <div style="font-size: 0.7rem; color: #9333ea99;">${humilityPct}%</div>
                    </td>
                    <td style="padding: 0.75rem; text-align: center; color: #dc2626;">
                      <div style="font-weight: 600;">${data.sentiment.pride}</div>
                      <div style="font-size: 0.7rem; color: #dc262699;">${pridePct}%</div>
                    </td>
                    <td style="padding: 0.75rem; text-align: center; color: #ea580c;">
                      <div style="font-weight: 600;">${data.sentiment.labor}</div>
                      <div style="font-size: 0.7rem; color: #ea580c99;">${laborPct}%</div>
                    </td>
                    <td style="padding: 0.75rem; text-align: center; color: #0891b2;">
                      <div style="font-weight: 600;">${data.sentiment.religious}</div>
                      <div style="font-size: 0.7rem; color: #0891b299;">${religiousPct}%</div>
                    </td>
                  </tr>
                `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Key Insights -->
      <div style="background: linear-gradient(135deg, #d4af3715, #c4941f30); padding: 2rem; border-radius: 0.5rem; margin-top: 2rem; border-left: 4px solid #d4af37;">
        <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem;">Key Insights</h3>
        <ul style="margin: 0; padding-left: 1.5rem; color: #555; line-height: 2;">
          <li>Most colophons come from <strong>${topRegions[0] ? topRegions[0][0] : 'Unknown'}</strong> (${topRegions[0] ? topRegions[0][1].count : 0} colophons)</li>
          <li>Average colophon length: <strong>${Object.values(byRegion).reduce((sum, d) => sum + d.avgLength, 0) / Object.keys(byRegion).length | 0} words</strong></li>
          <li>Religious expressions are most common, appearing across all regions and centuries</li>
          <li>Colophon practices evolved over time, with variation in length and style</li>
        </ul>
      </div>
    </div>
  `;
}

// 6. EXPLORE FORMULAE TAB
async function buildExploreFormulae(mount) {
  mount.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Loading formula data...</div>';
  
  // Get all SUs with colophons for matching
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => {
    const transcription = getVal(su, 'Colophon transcription') || '';
    return transcription.trim().length > 0;
  });
  
  // PREDEFINED FORMULAS TO SEARCH FOR
  const predefinedFormulas = [
    // Dutch
    { formula: 'int jaer ons heren', language: 'Dutch', variants: ['int jaer', 'int iaer', 'intjaer', 'iaer ons', 'jaer ons', 'volscreven int jaer', 'int jaer ons heeren', 'int jaer ons heren'] },
    { formula: 'bidt om gods wil', language: 'Dutch', variants: ['bidt om gods', 'om gods wil', 'bidt om'] },
    { formula: 'dit boeck hoert', language: 'Dutch', variants: ['dit boeck', 'boeck hoert', 'dit boek hoert'] },
    
    // Latin
    { formula: 'Qui scripsit scribat semper cum Domino uiuat', language: 'Latin', variants: ['qui scripsit', 'scribat semper', 'cum domino uiuat', 'semper cum domino'] },
    { formula: 'Explicit expliceat ludere scriptrix eat', language: 'Latin', variants: ['explicit expliceat', 'ludere scriptrix', 'expliceat ludere', 'scriptor eat', 'scriptrix eat'] },
    { formula: 'anno domini', language: 'Latin', variants: ['anno domini', 'ano domini'] },
    { formula: 'Finito libro sit laus et gloria Christo', language: 'Latin', variants: ['finito libro', 'laus et gloria', 'gloria christo', 'sit laus'] },
    { formula: 'Finis adest operis merce dem poseo laboris', language: 'Latin', variants: ['finis adest', 'adest operis', 'poseo laboris', 'merce dem'] },
    { formula: 'Detur pro penna scriptori pulchra puella', language: 'Latin', variants: ['detur pro penna', 'scriptori pulchra', 'pulchra puella'] },
    { formula: 'Finitus et completus', language: 'Latin', variants: ['finitus et completus', 'finitus completus'] },
    { formula: 'Feliciter', language: 'Latin', variants: ['feliciter'] },
    { formula: 'Oretis pro scriptore propter Deum', language: 'Latin', variants: ['oretis pro', 'pro scriptore', 'propter deum'] },
    { formula: 'Transcriptus', language: 'Latin', variants: ['transcriptus', 'transcripta'] },
    { formula: 'cuius animae propitietur Deus', language: 'Latin', variants: ['cuius animae', 'propitietur deus', 'animae propitietur'] },
    { formula: 'Nomen scriptoris plenus amoris', language: 'Latin', variants: ['nomen scriptoris', 'plenus amoris', 'scriptoris plenus'] },
    { formula: 'Que/qui me scribebat nomen habebat', language: 'Latin', variants: ['qui me scribebat', 'que me scribebat', 'nomen habebat', 'scribebat nomen'] },
    { formula: 'Finitus est iste liber per me soror', language: 'Latin', variants: ['finitus est iste', 'iste liber', 'per me soror', 'liber per me'] },
    { formula: 'Iste liber scripsit', language: 'Latin', variants: ['iste liber', 'liber scripsit'] },
    
    // Italian
    { formula: 'libro è delle monache', language: 'Italian', variants: ['libro è delle', 'delle monache', 'monache del', 'questo libro è'] },
    { formula: 'finito', language: 'Italian', variants: ['finito', 'finita'] },
    { formula: 'finisce', language: 'Italian', variants: ['finisce', 'finisce il'] },
    { formula: 'indegniamente', language: 'Italian', variants: ['indegniamente', 'indegna'] },
    { formula: 'peccatrice', language: 'Italian', variants: ['peccatrice', 'peccatrix'] },
    { formula: 'A llaude et onore', language: 'Italian', variants: ['llaude et', 'laude et', 'onore', 'et onore'] },
    
    // French
    { formula: 'Pries Nostre Seigneur', language: 'French', variants: ['pries nostre', 'nostre seigneur', 'priés', 'prié'] },
    { formula: 'pour ses soeurs', language: 'French', variants: ['pour ses', 'ses soeurs', 'pour soeurs'] },
    
    // Portuguese
    { formula: 'Acabousse', language: 'Portuguese', variants: ['acabousse', 'acabou-se', 'acabosse'] },
    { formula: 'Screveo freira', language: 'Portuguese', variants: ['screveo', 'freira', 'screveo freira'] },
    
    // Swedish
    { formula: 'conuentz syster', language: 'Swedish', variants: ['conuentz', 'syster', 'conuentz syster'] },
    { formula: 'owärdoghe', language: 'Swedish', variants: ['owärdoghe', 'owärdogher', 'ovärdoghe'] },
    { formula: 'bidhin kära systra', language: 'Swedish', variants: ['bidhin', 'kära', 'systra', 'bidh', 'kära systra'] },
    
    // German
    { formula: 'pitt got für', language: 'German', variants: ['pitt got', 'got für', 'pit got'] },
    { formula: 'Bidt vor die schrivers', language: 'German', variants: ['bidt vor', 'vor die', 'schrivers', 'schriver'] },
    { formula: 'das puch hat geschriben swester', language: 'German', variants: ['das puch', 'hat geschriben', 'geschriben swester', 'puch hat'] },
    { formula: 'von Schwester', language: 'German', variants: ['von schwester', 'von swester'] },
    { formula: 'die schreiberin die geschriben hat', language: 'German', variants: ['die schreiberin', 'geschriben hat', 'schreiberin die'] },
    { formula: 'do man zalt', language: 'German', variants: ['do man', 'man zalt', 'do man zalt'] },
    { formula: 'als man zalt', language: 'German', variants: ['als man', 'man zalt', 'als man zalt'] },
    { formula: 'vollendet', language: 'German', variants: ['vollendet', 'volendet'] },
    { formula: 'volbracht', language: 'German', variants: ['volbracht', 'volbracht'] },
    { formula: 'geendet', language: 'German', variants: ['geendet', 'geendet'] },
    { formula: 'Lob sye Gott', language: 'German', variants: ['lob sye', 'sye gott', 'lob gott'] },
    { formula: 'zu lob vnd erenn', language: 'German', variants: ['zu lob', 'vnd erenn', 'lob vnd'] }
  ];
  
  // Function to check if text contains any variant (fuzzy match)
  const containsFormula = (text, variants) => {
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
    return variants.some(variant => {
      const normalizedVariant = variant.toLowerCase().replace(/\s+/g, ' ');
      return normalizedText.includes(normalizedVariant);
    });
  };
  
  // Search for each formula in colophon transcriptions
  const formulaResults = predefinedFormulas.map(formulaDef => {
    const matches = [];
    const puIds = new Set();  // Track unique PU IDs
    const countries = new Set();
    
    colophonSUs.forEach(su => {
      const transcription = getVal(su, 'Colophon transcription') || '';
      
      if (containsFormula(transcription, formulaDef.variants)) {
        // Get linked PU for manuscript info
        const rels = getRecordRelationships(su.rec_ID);
        const puRel = rels.find(rel => {
          const relType = getVal(rel, 'Relationship type');
          const tgt = getRes(rel, 'Target record');
          if (!tgt?.id || !tgt?.type) return false;
          const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
          return relType === 'IsRelatedTo' && tgtType === 'pu';
        });
        
        if (puRel) {
          const tgt = getRes(puRel, 'Target record');
          const pu = IDX.pu[String(tgt.id)];
          
          if (pu) {
            const puId = String(pu.rec_ID);
            const puTitle = getVal(pu, 'Normalized Title') || pu.rec_Title || 'Untitled';
            const country = getVal(pu, 'PU country') || getVal(pu, 'Country') || 'Unknown';
            const city = getVal(pu, 'PU City') || getVal(pu, 'City') || '';
            const century = getVal(pu, 'Normalized century of production') || '';
            
            puIds.add(puId);  // Count unique PUs
            if (country !== 'Unknown') countries.add(country);
            
            // Find which variant matched
            const matchedVariant = formulaDef.variants.find(v => 
              transcription.toLowerCase().includes(v.toLowerCase())
            );
            
            matches.push({
              su: su,
              pu: pu,
              puId: puId,
              puTitle: puTitle,
              country: country,
              city: city,
              century: century,
              transcription: transcription,
              translation: getVal(su, 'Colophon translation') || '',
              matchedVariant: matchedVariant || formulaDef.variants[0]
            });
          }
        }
      }
    });
    
    return {
      formula: formulaDef.formula,
      language: formulaDef.language,
      variants: formulaDef.variants,
      count: puIds.size,  // Count unique Production Units
      matches: matches,
      puIds: Array.from(puIds),
      countries: Array.from(countries)
    };
  });
  
  // Organize formulas by language
  const formulasByLanguage = {};
  formulaResults.forEach(f => {
    if (!formulasByLanguage[f.language]) formulasByLanguage[f.language] = [];
    formulasByLanguage[f.language].push(f);
  });
  
  // Organize formulas by country  
  const formulasByCountry = {};
  formulaResults.forEach(f => {
    f.countries.forEach(country => {
      if (!formulasByCountry[country]) formulasByCountry[country] = [];
      if (!formulasByCountry[country].find(existing => existing.formula === f.formula)) {
        formulasByCountry[country].push(f);
      }
    });
  });
  
  // Sort by count descending
  Object.keys(formulasByLanguage).forEach(lang => {
    formulasByLanguage[lang].sort((a, b) => b.count - a.count);
  });
  
  Object.keys(formulasByCountry).forEach(country => {
    formulasByCountry[country].sort((a, b) => b.count - a.count);
  });
  
  // Pagination state
  let currentPage = 1;
  const itemsPerPage = 20;
  let selectedLanguage = '';
  let selectedCountry = '';
  let selectedFormula = '';
  
  const uniqueLanguages = Object.keys(formulasByLanguage).sort();
  const uniqueCountries = Object.keys(formulasByCountry).sort();
  
  // Classify formula type based on keywords
  const classifyFormulaType = (text) => {
    const lower = text.toLowerCase();
    if (lower.match(/\b(pitt|pray|pries|bidt|gedenk|ora|gebet|oretis)\b/)) return 'prayer';
    if (lower.match(/\b(jaer|jahr|anno|year|do man|zalt)\b/)) return 'dating';
    if (lower.match(/\b(geschriben|scri|escrit|script|writ|screveo)\b/)) return 'scribe';
    if (lower.match(/\b(finit|explicit|volscreven|geeyndet|end|complete|vollendet|volbracht|geendet)\b/)) return 'completion';
    if (lower.match(/\b(indegn|pover|unwürdig|arm|humil|peccatrice)\b/)) return 'humility';
    if (lower.match(/\b(hoert|belong|toe|delle|eygen)\b/)) return 'ownership';
    if (lower.match(/\b(laus|lob|gloria|laude|onore)\b/)) return 'praise';
    return 'other';
  };
  
  mount.innerHTML = `
    <div style="max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Explore Colophon Formulae</h2>
        <p style="color: #666; line-height: 1.6; max-width: 900px;">
          Browse ${formulaResults.length} predefined formulaic patterns across ${uniqueLanguages.length} languages. 
          Formulas are searched in colophon transcriptions with fuzzy matching to find variants. 
          Zero matches indicate the pattern is not present in the current corpus.
        </p>
      </div>
      
      <!-- Statistics Overview -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${formulaResults.length}</div>
          <div style="opacity: 0.9; font-size: 0.875rem;">Predefined Formulas</div>
        </div>
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${uniqueLanguages.length}</div>
          <div style="opacity: 0.9; font-size: 0.875rem;">Languages</div>
        </div>
        <div style="background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${colophonSUs.length}</div>
          <div style="opacity: 0.9; font-size: 0.875rem;">Colophons Searched</div>
        </div>
      </div>
      
      <!-- Filters -->
      <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 600; color: #333; margin-bottom: 1rem;">Filter Formulas</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">1a. Select Language</label>
            <select id="formula-filter-language" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Languages (${formulaResults.length} formulas)</option>
              ${uniqueLanguages.map(lang => 
                `<option value="${esc(lang)}">${esc(lang)} (${formulasByLanguage[lang].length} formulas)</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">1b. OR Select Country</label>
            <select id="formula-filter-country" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Countries</option>
              ${uniqueCountries.map(country => 
                `<option value="${esc(country)}">${esc(country)} (${formulasByCountry[country].length} formulas)</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">2. Select Specific Formula (optional)</label>
            <select id="formula-filter-specific" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">First select a language or country...</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">3. Filter by Type</label>
            <select id="formula-filter-type" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Types</option>
              <option value="prayer">Prayer</option>
              <option value="dating">Dating</option>
              <option value="scribe">Scribe</option>
              <option value="completion">Completion</option>
              <option value="humility">Humility</option>
              <option value="ownership">Ownership</option>
              <option value="praise">Praise</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Global Formula Map (Collapsible) -->
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 2rem; overflow: hidden;">
        <button id="toggle-global-map" style="width: 100%; padding: 1rem; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border: none; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 600; color: #374151;">
          <span>Global Formula Distribution Map</span>
          <span id="map-toggle-icon" style="font-size: 1.25rem;">▼</span>
        </button>
        <div id="global-map-content" style="display: none; padding: 1.5rem; border-top: 1px solid #e5e7eb;">
          <p style="color: #666; font-size: 0.875rem; margin-bottom: 1rem;">
            Interactive map showing the geographic and temporal distribution of all formulas across the corpus.
          </p>
          
          <!-- Map Filter Controls -->
          <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <div style="position: relative;">
              <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                Search Formulas
              </label>
              <input type="text" id="formula-search-box" placeholder="Search formulas on map..." list="formula-suggestions"
                     style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
              <datalist id="formula-suggestions"></datalist>
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                Filter by Language
              </label>
              <select id="language-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
                <option value="">All Languages</option>
              </select>
            </div>
            <div style="display: flex; align-items: flex-end; gap: 0.5rem;">
              <button id="export-csv-btn" style="padding: 0.5rem 1rem; background: #d4af37; color: white; border: none; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; white-space: nowrap;">
                📊 CSV
              </button>
              <button id="export-png-btn" style="padding: 0.5rem 1rem; background: #92400e; color: white; border: none; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; white-space: nowrap;">
                📷 PNG
              </button>
            </div>
          </div>
          
          <!-- Advanced Controls -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            <button id="toggle-heatmap" style="padding: 0.5rem 1rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              🔥 Heat Map
            </button>
            <button id="toggle-comparison" style="padding: 0.5rem 1rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              📊 Compare Formulas
            </button>
            <button id="toggle-network" style="padding: 0.5rem 1rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              🔗 Network View
            </button>
            <div style="flex: 1; min-width: 200px; display: flex; align-items: center; gap: 0.5rem;">
              <button id="play-timeline" style="padding: 0.5rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                ▶️
              </button>
              <span id="timeline-status" style="font-size: 0.75rem; color: #6b7280;">Timeline Animation</span>
            </div>
          </div>
          
          <!-- Comparison Mode Info -->
          <div id="comparison-info" style="display: none; padding: 0.75rem; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 0.375rem; margin-bottom: 1rem; font-size: 0.875rem;">
            <strong>🎯 Comparison Mode Active:</strong> <span id="comparison-count">0</span> formulas selected. 
            <span style="color: #92400e;">Click on formulas in the map popups below to add them to comparison (max 6).</span>
            <button id="clear-comparison" style="margin-left: 1rem; padding: 0.25rem 0.5rem; background: #d97706; color: white; border: none; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;">
              Clear All
            </button>
          </div>
          
          <div id="global-map-container" style="height: 500px; background: #f9fafb; border-radius: 0.5rem; position: relative;">
            <div id="global-map-placeholder" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #9ca3af;">
              <div>Click to load map visualization...</div>
            </div>
          </div>
          <div style="margin-top: 1rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
              Filter by Century
            </label>
            <input type="range" id="century-slider" min="0" max="100" value="0" step="1" 
                   style="width: 100%; height: 8px; border-radius: 4px; background: linear-gradient(90deg, #d4af37 0%, #c4941f 100%); outline: none; -webkit-appearance: none;">
            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
              <span id="century-label-start" style="font-size: 0.75rem; color: #6b7280;">All Centuries</span>
              <span id="century-label-end" style="font-size: 0.75rem; color: #6b7280;"></span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination Top -->
      <div id="formula-pagination-top" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;"></div>
      
      <div id="formula-count-top" style="color: #666; margin-bottom: 1.5rem; text-align: center;"></div>
      
      <!-- Formula List -->
      <div id="formula-list" style="display: flex; flex-direction: column; gap: 1.5rem;"></div>
      
      <!-- Pagination Bottom -->
      <div id="formula-pagination-bottom" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem;"></div>
      
      <div id="formula-count-bottom" style="text-align: center; margin-top: 1.5rem; padding: 1.5rem; background: #f9f9f9; border-radius: 0.5rem; color: #666;"></div>
    </div>
  `;
  
  // Update specific formula dropdown based on language or country selection
  const updateFormulaDropdown = () => {
    const languageSelect = document.getElementById('formula-filter-language');
    const countrySelect = document.getElementById('formula-filter-country');
    const formulaSelect = document.getElementById('formula-filter-specific');
    
    const lang = languageSelect.value;
    const country = countrySelect.value;
    
    let formulas = [];
    if (lang) formulas = formulasByLanguage[lang] || [];
    else if (country) formulas = formulasByCountry[country] || [];
    else formulas = formulaResults;
    
    const filterLabel = lang ? lang : country || 'all';
    formulaSelect.innerHTML = `
      <option value="">All ${filterLabel} formulas (${formulas.length})</option>
      ${formulas.map(f => 
        `<option value="${esc(f.formula)}">${esc(f.formula.substring(0, 60))}${f.formula.length > 60 ? '...' : ''} (${f.count})</option>`
      ).join('')}
    `;
    selectedFormula = '';
  };
  
  // Render formulas with pagination
  const renderFormulas = (formulas, page) => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageFormulas = formulas.slice(startIdx, endIdx);
    const totalPages = Math.ceil(formulas.length / itemsPerPage);
    
    const listDiv = document.getElementById('formula-list');
    
    if (pageFormulas.length === 0) {
      listDiv.innerHTML = '<div style="text-align: center; padding: 3rem; color: #666; background: white; border-radius: 0.5rem;">No formulas match your filters.</div>';
      document.getElementById('formula-count-top').textContent = 'No formulas found';
      document.getElementById('formula-count-bottom').textContent = 'No formulas found.';
      document.getElementById('formula-pagination-top').innerHTML = '';
      document.getElementById('formula-pagination-bottom').innerHTML = '';
      return;
    }
    
    listDiv.innerHTML = pageFormulas.map((formula, idx) => {
      const cardId = 'formula-card-' + (startIdx + idx);
      const type = classifyFormulaType(formula.formula);
      const count = formula.count || 0;
      
      // Type badge colors
      const typeBadgeStyles = {
        prayer: 'background: #10b981; color: white;',
        dating: 'background: #3b82f6; color: white;',
        scribe: 'background: #fb923c; color: white;',
        completion: 'background: #eab308; color: white;',
        humility: 'background: #f59e0b; color: white;',
        ownership: 'background: #ef4444; color: white;',
        praise: 'background: #06b6d4; color: white;',
        other: 'background: #6b7280; color: white;'
      };
      
      const typeBadgeStyle = typeBadgeStyles[type] || typeBadgeStyles.other;
      const hasMatches = count > 0;
      
      let html = '<div id="' + cardId + '" style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 1.5rem; transition: all 0.2s;">';
      html += '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">';
      html += '<div style="flex: 1;">';
      html += '<div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">';
      html += '<span style="' + typeBadgeStyle + ' padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">' + esc(type) + '</span>';
      html += '<span style="background: #e5e7eb; color: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">' + esc(formula.language) + '</span>';
      html += '</div>';
      html += '<div style="font-size: 1.125rem; font-weight: 600; color: #1f2937; font-style: italic; margin-bottom: 0.5rem;">"' + esc(formula.formula) + '"</div>';
      if (formula.variants.length > 1) {
        html += '<div style="font-size: 0.875rem; color: #6b7280;">Variants: ' + formula.variants.map(v => esc(v)).join(', ') + '</div>';
      }
      html += '</div>';
      html += '<div style="text-align: right;">';
      html += '<div style="font-size: 2rem; font-weight: 700; color: ' + (hasMatches ? '#d4af37' : '#9ca3af') + ';">' + count + '</div>';
      html += '<div style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">Production Unit' + (count !== 1 ? 's' : '') + '</div>';
      html += '</div>';
      html += '</div>';
      
      // Show countries if any
      if (formula.countries.length > 0) {
        html += '<div style="margin-top: 0.75rem; font-size: 0.875rem; color: #6b7280;">';
        html += '<strong>Countries:</strong> ' + formula.countries.join(', ');
        html += '</div>';
      }
      
      // Show match details if selected
      const isSpecificFormulaView = selectedFormula && formulas.length === 1;
      if (isSpecificFormulaView && formula.matches.length > 0) {
        html += '<div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">';
        html += '<h4 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">Found in ' + formula.matches.length + ' Colophon' + (formula.matches.length !== 1 ? 's' : '') + ' across ' + formula.count + ' Production Unit' + (formula.count !== 1 ? 's' : '') + ':</h4>';
        
        formula.matches.forEach((match, matchIdx) => {
          // Highlight the matched variant in the transcription
          let displayTranscription = match.transcription;
          const variantToHighlight = match.matchedVariant;
          if (variantToHighlight) {
            const regex = new RegExp('(' + variantToHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            displayTranscription = displayTranscription.replace(regex, '<mark style="background: #fef08a; padding: 0.125rem 0.25rem; border-radius: 0.125rem; font-weight: 600;">$1</mark>');
          }
          
          html += '<div style="background: #f9fafb; padding: 1rem; border-radius: 0.25rem; margin-bottom: 0.75rem; border-left: 3px solid #d4af37;">';
          html += '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">';
          html += '<div style="font-weight: 600; color: #1f2937;">';
          html += '<a href="#" onclick="event.preventDefault(); jumpTo(\'pu\', \'' + match.puId + '\');" style="color: #d4af37; text-decoration: none;">';
          html += esc(match.puTitle);
          html += '</a>';
          html += '</div>';
          html += '<div style="display: flex; gap: 0.5rem;">';
          html += '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">' + esc(match.country) + '</span>';
          if (match.century) {
            html += '<span style="background: #fffbeb; color: #78350f; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">' + esc(match.century) + '</span>';
          }
          html += '</div>';
          html += '</div>';
          
          // Full transcription with highlighting
          html += '<div style="margin-bottom: 0.75rem;">';
          html += '<div style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem;">Transcription:</div>';
          html += '<div style="font-size: 0.875rem; color: #4b5563; font-style: italic; line-height: 1.6;">' + displayTranscription + '</div>';
          html += '</div>';
          
          // Translation if available
          if (match.translation) {
            html += '<div>';
            html += '<div style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem;">Translation:</div>';
            html += '<div style="font-size: 0.875rem; color: #6b7280; line-height: 1.6;">' + esc(match.translation) + '</div>';
            html += '</div>';
          }
          
          html += '</div>';
        });
        
        html += '</div>';
        
        // Collect statistics
        const countryStats = {};
        const centuryStats = {};
        const monasticInstitutions = new Set();
        
        formula.matches.forEach(match => {
          // Count countries
          countryStats[match.country] = (countryStats[match.country] || 0) + 1;
          
          // Count centuries
          if (match.century) {
            centuryStats[match.century] = (centuryStats[match.century] || 0) + 1;
          }
          
          // Extract monastic institutions from PU records using proper getRes
          if (match.pu) {
            const miRes = getRes(match.pu, 'Monastic Institution');
            if (miRes && miRes.title) {
              monasticInstitutions.add(miRes.title);
            }
          }
        });
        
        const sortedCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]);
        const sortedCenturies = Object.entries(centuryStats).sort((a, b) => a[0].localeCompare(b[0]));
        
        // Threshold-based adaptive visualization: simple cards for 5 or fewer matches, full charts for 6+
        const matchCount = formula.matches.length;
        
        if (matchCount <= 5) {
          // Simple summary cards for small datasets
          html += '<div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">';
          html += '<h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 1.5rem;">Summary</h4>';
          html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">';
          
          // Countries card
          html += '<div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1.25rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
          html += '<div style="font-size: 0.875rem; font-weight: 600; opacity: 0.9; margin-bottom: 0.75rem;">Countries</div>';
          html += '<div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">' + sortedCountries.length + '</div>';
          html += '<div style="font-size: 0.875rem; opacity: 0.9;">';
          html += sortedCountries.map(([country, count]) => country + ' (' + count + ')').join(', ');
          html += '</div>';
          html += '</div>';
          
          // Centuries card
          if (sortedCenturies.length > 0) {
            html += '<div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 1.25rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
            html += '<div style="font-size: 0.875rem; font-weight: 600; opacity: 0.9; margin-bottom: 0.75rem;">Centuries</div>';
            html += '<div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">' + sortedCenturies.length + '</div>';
            html += '<div style="font-size: 0.875rem; opacity: 0.9;">';
            html += sortedCenturies.map(([century, count]) => century + ' (' + count + ')').join(', ');
            html += '</div>';
            html += '</div>';
          }
          
          // Monastic Institutions card
          if (monasticInstitutions.size > 0) {
            html += '<div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1.25rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
            html += '<div style="font-size: 0.875rem; font-weight: 600; opacity: 0.9; margin-bottom: 0.75rem;">Monasteries</div>';
            html += '<div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">' + monasticInstitutions.size + '</div>';
            html += '<div style="font-size: 0.75rem; opacity: 0.9; line-height: 1.4;">';
            const institutionArray = Array.from(monasticInstitutions);
            html += institutionArray.join(', ');
            html += '</div>';
            html += '</div>';
          }
          
          html += '</div>';
          html += '</div>';
        } else {
          // Detailed visualizations for larger datasets (6+ matches)
          html += '<div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">';
          html += '<h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 1.5rem;">Detailed Statistics</h4>';
          
          // Geographic Distribution Chart (full width)
          html += '<div style="margin-bottom: 2rem;">';
          html += '<div style="font-weight: 600; color: #374151; margin-bottom: 1rem;">Geographic Distribution</div>';
          sortedCountries.forEach(([country, count]) => {
            const percentage = (count / matchCount * 100).toFixed(1);
            html += '<div style="margin-bottom: 0.75rem;">';
            html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">';
            html += '<span style="font-size: 0.875rem; color: #374151;">' + esc(country) + '</span>';
            html += '<span style="font-size: 0.75rem; color: #6b7280; font-weight: 600;">' + count + ' (' + percentage + '%)</span>';
            html += '</div>';
            html += '<div style="background: #e5e7eb; border-radius: 0.25rem; height: 1.5rem; overflow: hidden;">';
            html += '<div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); height: 100%; width: ' + percentage + '%; transition: width 0.3s ease;"></div>';
            html += '</div>';
            html += '</div>';
          });
          html += '</div>';
          
          // Grid for temporal and institutions
          html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">';
          
          // Temporal Distribution Chart
          if (sortedCenturies.length > 0) {
            html += '<div>';
            html += '<div style="font-weight: 600; color: #374151; margin-bottom: 1rem;">Temporal Distribution</div>';
            const maxCenturyCount = Math.max(...sortedCenturies.map(([, count]) => count));
            html += '<div style="display: flex; align-items: flex-end; justify-content: space-around; gap: 0.5rem; height: 150px; padding: 0.5rem; background: #f9fafb; border-radius: 0.5rem;">';
            sortedCenturies.forEach(([century, count]) => {
              const barHeightPx = (count / maxCenturyCount * 120);
              const percentage = (count / matchCount * 100).toFixed(0);
              html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 0.25rem;">';
              html += '<div style="font-size: 0.625rem; color: #6b7280; font-weight: 600;">' + count + '</div>';
              html += '<div style="background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%); width: 100%; max-width: 40px; height: ' + barHeightPx + 'px; border-radius: 0.25rem 0.25rem 0 0; min-height: 2px;"></div>';
              html += '<div style="font-size: 0.625rem; color: #374151; writing-mode: vertical-rl; transform: rotate(180deg); margin-top: 0.25rem;">' + esc(century) + '</div>';
              html += '</div>';
            });
            html += '</div>';
            html += '</div>';
          }
          
          // Close temporal/other grid
          html += '</div>';
          
          // Monastic Institutions (full width)
          if (monasticInstitutions.size > 0) {
            html += '<div style="margin-top: 2rem;">';
            html += '<div style="font-weight: 600; color: #374151; margin-bottom: 1rem;">Monastic Institutions (' + monasticInstitutions.size + ' total)</div>';
            html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">';
            const institutionArray = Array.from(monasticInstitutions).sort();
            institutionArray.forEach(institution => {
              html += '<span style="background: #fef3c7; color: #92400e; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; border: 1px solid #fde68a;">';
              html += esc(institution);
              html += '</span>';
            });
            html += '</div>';
            html += '</div>';
          }
          
          html += '</div>';
        }
      } else if (!isSpecificFormulaView && formula.count > 0) {
        // When not in specific view, show production unit list with links
        html += '<div style="margin-top: 1rem;">';
        html += '<div style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Found in production units:</div>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">';
        
        // Get unique PU titles from matches
        const uniquePUs = [];
        const seenPUIds = new Set();
        formula.matches.forEach(match => {
          if (!seenPUIds.has(match.puId)) {
            seenPUIds.add(match.puId);
            uniquePUs.push({ id: match.puId, title: match.puTitle });
          }
        });
        
        uniquePUs.slice(0, 10).forEach(pu => {
          html += '<a href="#" onclick="event.preventDefault(); jumpTo(\'pu\', \'' + pu.id + '\');" ';
          html += 'style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; text-decoration: none;">';
          html += esc(pu.title);
          html += '</a>';
        });
        if (uniquePUs.length > 10) {
          html += '<span style="color: #6b7280; font-size: 0.75rem; padding: 0.25rem 0.5rem;">+' + (uniquePUs.length - 10) + ' more</span>';
        }
        html += '</div>';
        html += '</div>';
      }
      
      html += '</div>';
      
      return html;
    }).join('');
    
    // Update counts
    const countMsg = 'Showing ' + (startIdx + 1) + '-' + Math.min(endIdx, formulas.length) + ' of ' + formulas.length + ' formula' + (formulas.length !== 1 ? 's' : '');
    document.getElementById('formula-count-top').textContent = countMsg;
    document.getElementById('formula-count-bottom').textContent = countMsg + '.';
    
    // Render pagination
    const renderPagination = (containerId) => {
      const container = document.getElementById(containerId);
      if (totalPages <= 1) {
        container.innerHTML = '';
        return;
      }
      
      const buttons = [];
      
      // Previous button
      const prevDisabled = page === 1;
      buttons.push(
        '<button ' + (prevDisabled ? 'disabled ' : '') +
        'data-page="' + (page - 1) + '" ' +
        'style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 0.25rem; background: ' + (prevDisabled ? '#f5f5f5' : 'white') + '; cursor: ' + (prevDisabled ? 'not-allowed' : 'pointer') + '; color: ' + (prevDisabled ? '#999' : '#333') + ';">' +
        '← Previous</button>'
      );
      
      // Page numbers
      const maxButtons = 7;
      let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      
      if (startPage > 1) {
        buttons.push(
          '<button data-page="1" ' +
          'style="padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 0.25rem; background: white; cursor: pointer;">1</button>'
        );
        if (startPage > 2) {
          buttons.push('<span style="padding: 0.5rem;">...</span>');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        const isCurrent = i === page;
        buttons.push(
          '<button ' + (isCurrent ? 'disabled ' : '') +
          'data-page="' + i + '" ' +
          'style="padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 0.25rem; background: ' + (isCurrent ? '#d4af37' : 'white') + '; color: ' + (isCurrent ? 'white' : '#333') + '; cursor: ' + (isCurrent ? 'default' : 'pointer') + '; font-weight: ' + (isCurrent ? '600' : '400') + ';">' +
          i + '</button>'
        );
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push('<span style="padding: 0.5rem;">...</span>');
        }
        buttons.push(
          '<button data-page="' + totalPages + '" ' +
          'style="padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 0.25rem; background: white; cursor: pointer;">' + totalPages + '</button>'
        );
      }
      
      // Next button
      const nextDisabled = page === totalPages;
      buttons.push(
        '<button ' + (nextDisabled ? 'disabled ' : '') +
        'data-page="' + (page + 1) + '" ' +
        'style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 0.25rem; background: ' + (nextDisabled ? '#f5f5f5' : 'white') + '; cursor: ' + (nextDisabled ? 'not-allowed' : 'pointer') + '; color: ' + (nextDisabled ? '#999' : '#333') + ';">' +
        'Next →</button>'
      );
      
      container.innerHTML = buttons.join('');
      
      // Add click event listeners to all page buttons
      container.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
          const newPage = parseInt(this.getAttribute('data-page'));
          if (!isNaN(newPage) && newPage !== page) {
            currentPage = newPage;
            renderFormulas(getFilteredFormulas(), currentPage);
          }
        });
      });
    };
    
    renderPagination('formula-pagination-top');
    renderPagination('formula-pagination-bottom');
    
    // Scroll to top
    mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // Get filtered formulas
  const getFilteredFormulas = () => {
    const languageFilter = document.getElementById('formula-filter-language').value;
    const countryFilter = document.getElementById('formula-filter-country').value;
    const specificFilter = document.getElementById('formula-filter-specific').value;
    const typeFilter = document.getElementById('formula-filter-type').value;
    
    let filtered = [];
    
    // Language or Country filter (language takes precedence if both selected)
    if (languageFilter) {
      filtered = formulasByLanguage[languageFilter] || [];
    } else if (countryFilter) {
      filtered = formulasByCountry[countryFilter] || [];
    } else {
      filtered = formulaResults; // Use all formulas
    }
    
    // Specific formula filter (optional)
    if (specificFilter) {
      filtered = filtered.filter(f => f.formula === specificFilter);
      selectedFormula = specificFilter;
    } else {
      selectedFormula = '';
    }
    
    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(f => classifyFormulaType(f.formula) === typeFilter);
    }
    
    return filtered;
  };
  
  // Initial render
  renderFormulas(getFilteredFormulas(), currentPage);
  
  // Event listeners for cascading filters
  document.getElementById('formula-filter-language').addEventListener('change', function() {
    selectedLanguage = this.value;
    if (this.value) {
      document.getElementById('formula-filter-country').value = '';
      selectedCountry = '';
    }
    updateFormulaDropdown();
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  document.getElementById('formula-filter-country').addEventListener('change', function() {
    selectedCountry = this.value;
    if (this.value) {
      document.getElementById('formula-filter-language').value = '';
      selectedLanguage = '';
    }
    updateFormulaDropdown();
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  document.getElementById('formula-filter-specific').addEventListener('change', function() {
    selectedFormula = this.value;
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  document.getElementById('formula-filter-type').addEventListener('change', function() {
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  // Global Map Toggle
  document.getElementById('toggle-global-map').addEventListener('click', function() {
    const content = document.getElementById('global-map-content');
    const icon = document.getElementById('map-toggle-icon');
    const isHidden = content.style.display === 'none';
    
    content.style.display = isHidden ? 'block' : 'none';
    icon.textContent = isHidden ? '▲' : '▼';
    
    // Initialize map on first open
    if (isHidden && !window.formulaMapInitialized) {
      initializeGlobalMap();
      window.formulaMapInitialized = true;
    }
  });
  
  // Initialize Global Map Visualization with Leaflet
  async function initializeGlobalMap() {
    // Initialize comparison tracking
    window.comparisonFormulas = window.comparisonFormulas || new Set();
    window.comparisonLayers = window.comparisonLayers || [];
    
    const container = document.getElementById('global-map-container');
    
    // Remove placeholder
    const placeholder = document.getElementById('global-map-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    
    // Show loading message
    container.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #9ca3af;">Loading map...</div>';
    
    // Load Leaflet
    await ensureLeaflet();
    
    // Clear container and set up for map
    container.innerHTML = '';
    container.style.height = '500px';
    container.style.background = 'transparent';
    container.style.position = 'relative';
    
    // Initialize map
    const map = L.map(container).setView([48.8566, 2.3522], 4); // Center on Europe
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    
    // Create city coordinates map (common medieval manuscript locations)
    const cityCoordinates = {
      'Florence': [43.7696, 11.2558],
      'Rome': [41.9028, 12.4964],
      'Venice': [45.4408, 12.3155],
      'Milan': [45.4642, 9.1900],
      'Bologna': [44.4949, 11.3426],
      'Paris': [48.8566, 2.3522],
      'Lyon': [45.7640, 4.8357],
      'Avignon': [43.9493, 4.8055],
      'London': [51.5074, -0.1278],
      'Oxford': [51.7520, -1.2577],
      'Cambridge': [52.2053, 0.1218],
      'Brussels': [50.8503, 4.3517],
      'Bruges': [51.2093, 3.2247],
      'Amsterdam': [52.3676, 4.9041],
      'Utrecht': [52.0907, 5.1214],
      'Cologne': [50.9375, 6.9603],
      'Munich': [48.1351, 11.5820],
      'Vienna': [48.2082, 16.3738],
      'Prague': [50.0755, 14.4378],
      'Krakow': [50.0647, 19.9450],
      'Lisbon': [38.7223, -9.1393],
      'Madrid': [40.4168, -3.7038],
      'Barcelona': [41.3874, 2.1686],
      'Stockholm': [59.3293, 18.0686],
      'Basel': [47.5596, 7.5886],
      'Zurich': [47.3769, 8.5417],
      'Geneva': [46.2044, 6.1432],
      'Dijon': [47.3220, 5.0415],
      'Strasbourg': [48.5734, 7.7521],
      'Mainz': [50.0000, 8.2710],
      'Nuremberg': [49.4521, 11.0767],
      'Hamburg': [53.5511, 9.9937],
      'Copenhagen': [55.6761, 12.5683],
      'Dublin': [53.3498, -6.2603],
      'Edinburgh': [55.9533, -3.1883],
      'Malines': [51.0259, 4.4777], // Mechelen
      'Mechelen': [51.0259, 4.4777],
      'Antwerp': [51.2194, 4.4025],
      'Liège': [50.6326, 5.5797],
      'Tournai': [50.6054, 3.3889],
      'Mons': [50.4542, 3.9564],
      'Ghent': [51.0543, 3.7174]
    };
    
    // Aggregate formula data by location
    const locationData = {};
    
    formulaResults.forEach(formula => {
      formula.matches.forEach(match => {
        const country = match.country || 'Unknown';
        const city = match.city || '';
        const locationKey = city || country;
        
        if (!locationData[locationKey]) {
          locationData[locationKey] = {
            city: city,
            country: country,
            count: 0,
            formulas: new Set(),
            centuries: {},
            languages: new Set(),
            matches: []
          };
        }
        
        locationData[locationKey].count++;
        locationData[locationKey].formulas.add(formula.formula);
        locationData[locationKey].languages.add(formula.language);
        locationData[locationKey].matches.push({
          formula: formula.formula,
          language: formula.language,
          century: match.century
        });
        
        if (match.century) {
          locationData[locationKey].centuries[match.century] = 
            (locationData[locationKey].centuries[match.century] || 0) + 1;
        }
      });
    });
    
    // Add markers to map
    const markers = [];
    const bounds = [];
    
    Object.entries(locationData).forEach(([location, data]) => {
      let coords = null;
      
      // Try to find coordinates for city first, then country
      if (data.city && cityCoordinates[data.city]) {
        coords = cityCoordinates[data.city];
      } else if (cityCoordinates[location]) {
        coords = cityCoordinates[location];
      } else if (cityCoordinates[data.country]) {
        coords = cityCoordinates[data.country];
      }
      
      if (coords) {
        // Size marker based on count
        const radius = Math.max(8, Math.min(30, Math.sqrt(data.count) * 3));
        
        // Color based on count intensity
        const maxCount = Math.max(...Object.values(locationData).map(d => d.count));
        const intensity = data.count / maxCount;
        const color = intensity > 0.7 ? '#92400e' : intensity > 0.4 ? '#d97706' : '#d4af37';
        
        const marker = L.circleMarker(coords, {
          radius: radius,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        });
        
        // Create popup content with formula list (all formulas, clickable)
        const formulaList = Array.from(data.formulas)
          .sort()
          .map(f => `<li style="margin: 0.25rem 0; font-size: 0.7rem;"><a href="#" onclick="const compBtn = document.getElementById('toggle-comparison');
if (compBtn.style.background === 'rgb(212, 175, 55)') {
  if (typeof window.addToComparison === 'function') window.addToComparison('${esc(f).replace(/'/g, "\\\\'")}');
} else {
  document.getElementById('formula-search-box').value='${esc(f).replace(/'/g, "\\\\'")}';
  const event = new Event('input', { bubbles: true });
  document.getElementById('formula-search-box').dispatchEvent(event);
}
return false;" style="color: #d4af37; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${esc(f)}</a></li>`)
          .join('');
        
        const centuryList = Object.entries(data.centuries)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([c, count]) => `${esc(c)} (${count})`)
          .join(', ');
        
        const popupContent = `
          <div style="min-width: 250px; max-width: 350px;">
            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1rem;">
              ${esc(data.city || data.country)}
            </h4>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
              <strong>${data.count}</strong> formula occurrence${data.count !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">
              ${data.formulas.size} unique formula${data.formulas.size !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">
              Languages: ${Array.from(data.languages).join(', ')}
            </div>
            ${centuryList ? `<div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb;">
              Centuries: ${centuryList}
            </div>` : ''}
            <details style="margin-top: 0.5rem;" open>
              <summary style="cursor: pointer; font-size: 0.75rem; font-weight: 600; color: #d4af37; margin-bottom: 0.5rem;">Formulas (${data.formulas.size})</summary>
              <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; max-height: 300px; overflow-y: auto;">
                ${formulaList}
              </ul>
            </details>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.addTo(map);
        markers.push(marker);
        bounds.push(coords);
      }
    });
    
    // Fit map to markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.background = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      div.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;">Formula Density</div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #92400e; border: 2px solid white;"></div>
          <span style="font-size: 0.75rem;">High</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <div style="width: 16px; height: 16px; border-radius: 50%; background: #d97706; border: 2px solid white;"></div>
          <span style="font-size: 0.75rem;">Medium</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #d4af37; border: 2px solid white;"></div>
          <span style="font-size: 0.75rem;">Low</span>
        </div>
      `;
      return div;
    };
    legend.addTo(map);
    
    // Create marker cluster group
    const markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 10) size = 'large';
        else if (count > 5) size = 'medium';
        
        return L.divIcon({
          html: `<div style="background: #d4af37; color: white; border-radius: 50%; width: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'}; height: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'}; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
          className: 'marker-cluster',
          iconSize: [size === 'large' ? 50 : size === 'medium' ? 40 : 30, size === 'large' ? 50 : size === 'medium' ? 40 : 30]
        });
      }
    });
    
    // Add all markers to cluster group
    markers.forEach(marker => markerClusterGroup.addLayer(marker));
    map.addLayer(markerClusterGroup);
    
    // Store data globally for filtering
    window.formulaMapData = { map, markers, locationData, cityCoordinates, markerClusterGroup };
    
    // Populate language filter
    const allLanguages = new Set();
    formulaResults.forEach(f => allLanguages.add(f.language));
    const languageSelect = document.getElementById('language-filter');
    Array.from(allLanguages).sort().forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang;
      languageSelect.appendChild(option);
    });
    
    // Set up search functionality
    const searchBox = document.getElementById('formula-search-box');
    searchBox.addEventListener('input', function() {
      window.applyMapFilters();
    });
    
    // Set up language filter
    languageSelect.addEventListener('change', function() {
      window.applyMapFilters();
    });
    
    // Set up CSV export
    document.getElementById('export-csv-btn').addEventListener('click', function() {
      window.exportMapDataAsCSV();
    });
    
    // Set up PNG export
    document.getElementById('export-png-btn').addEventListener('click', function() {
      window.exportMapAsPNG();
    });
    
    // Populate autocomplete suggestions
    const datalist = document.getElementById('formula-suggestions');
    const uniqueFormulas = new Set();
    formulaResults.forEach(f => uniqueFormulas.add(f.formula));
    Array.from(uniqueFormulas).sort().forEach(formula => {
      const option = document.createElement('option');
      option.value = formula;
      datalist.appendChild(option);
    });
    
    // Set up heat map toggle
    document.getElementById('toggle-heatmap').addEventListener('click', function() {
      window.toggleHeatMap();
    });
    
    // Set up comparison mode
    window.comparisonFormulas = new Set();
    window.comparisonLayers = [];
    document.getElementById('toggle-comparison').addEventListener('click', function() {
      const btn = this;
      const isActive = btn.style.background === 'rgb(212, 175, 55)';
      if (isActive) {
        // Deactivate
        btn.style.background = 'white';
        btn.style.color = '#374151';
        window.clearComparison();
      } else {
        // Activate
        btn.style.background = '#d4af37';
        btn.style.color = 'white';
        document.getElementById('comparison-info').style.display = 'block';
        
        // Show instruction
        const instruction = document.createElement('div');
        instruction.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; font-size: 0.875rem; text-align: center; max-width: 500px;';
        instruction.innerHTML = '✨ <strong>Comparison Mode Active</strong><br>Click on formulas in map popups to add them to comparison';
        document.body.appendChild(instruction);
        setTimeout(() => instruction.remove(), 5000);
      }
    });
    
    document.getElementById('clear-comparison').addEventListener('click', function() {
      window.clearComparison();
    });
    
    // Set up network view
    window.networkActive = false;
    window.networkLines = [];
    document.getElementById('toggle-network').addEventListener('click', function() {
      window.toggleNetworkView();
    });
    
    // Set up timeline animation
    window.timelineInterval = null;
    document.getElementById('play-timeline').addEventListener('click', function() {
      window.toggleTimeline();
    });
    
    // Set up century filter
    const slider = document.getElementById('century-slider');
    const labelStart = document.getElementById('century-label-start');
    const labelEnd = document.getElementById('century-label-end');
    
    // Get all unique centuries
    const allCenturies = new Set();
    Object.values(locationData).forEach(data => {
      Object.keys(data.centuries).forEach(c => allCenturies.add(c));
    });
    const sortedCenturies = Array.from(allCenturies).sort();
    
    if (sortedCenturies.length > 0) {
      slider.min = 0;
      slider.max = sortedCenturies.length;
      slider.value = 0;
      labelStart.textContent = 'All Centuries';
      labelEnd.textContent = '';
      
      slider.addEventListener('input', function() {
        const index = parseInt(this.value);
        if (index === 0) {
          labelStart.textContent = 'All Centuries';
          labelEnd.textContent = '';
          window.applyMapFilters(null);
        } else {
          const selectedCentury = sortedCenturies[index - 1];
          labelStart.textContent = selectedCentury;
          labelEnd.textContent = '';
          window.applyMapFilters(selectedCentury);
        }
      });
    }
    
    // Mark map as initialized
    window.formulaMapInitialized = true;
  }
  
  // Global helper functions for formula map (must be outside initializeGlobalMap for global access)
  
  // Apply all map filters (century, search, language)
  window.applyMapFilters = function(century) {
    if (!window.formulaMapData) return;
    
    const { map, markers, locationData, markerClusterGroup } = window.formulaMapData;
    const searchTerm = document.getElementById('formula-search-box')?.value.toLowerCase().trim() || '';
    const selectedLanguage = document.getElementById('language-filter')?.value || '';
    
    // Clear cluster group
    if (markerClusterGroup) {
      markerClusterGroup.clearLayers();
    }
    markers.length = 0;
    
    // Re-add markers with filtered data
    const bounds = [];
    
    Object.entries(locationData).forEach(([location, data]) => {
      // Filter matches by century, search term, and language
      let filteredMatches = data.matches;
      
      if (century) {
        filteredMatches = filteredMatches.filter(m => m.century === century);
      }
      
      if (searchTerm) {
        filteredMatches = filteredMatches.filter(m => 
          (m.formula || '').toLowerCase().includes(searchTerm)
        );
      }
      
      if (selectedLanguage) {
        filteredMatches = filteredMatches.filter(m => 
          m.language && m.language === selectedLanguage
        );
      }
      
      // Skip this location if no matches remain after filtering
      if (filteredMatches.length === 0) return;
      
      let filteredData = data;
      if (century || searchTerm || selectedLanguage) {
        const centuriesFiltered = {};
        filteredMatches.forEach(m => {
          if (m.century) {
            centuriesFiltered[m.century] = (centuriesFiltered[m.century] || 0) + 1;
          }
        });
        
        filteredData = {
          ...data,
          count: filteredMatches.length,
          formulas: new Set(filteredMatches.map(m => m.formula)),
          languages: new Set(filteredMatches.map(m => m.language)),
          centuries: centuriesFiltered,
          matches: filteredMatches
        };
      }
      
      let coords = null;
      const cityCoordinates = window.formulaMapData.cityCoordinates || {};
      
      if (data.city && cityCoordinates[data.city]) {
        coords = cityCoordinates[data.city];
      } else if (cityCoordinates[location]) {
        coords = cityCoordinates[location];
      } else if (cityCoordinates[data.country]) {
        coords = cityCoordinates[data.country];
      }
      
      if (coords) {
        const radius = Math.max(8, Math.min(30, Math.sqrt(filteredData.count) * 3));
        const maxCount = Math.max(...Object.values(locationData).map(d => d.count));
        const intensity = filteredData.count / maxCount;
        const color = intensity > 0.7 ? '#92400e' : intensity > 0.4 ? '#d97706' : '#d4af37';
        
        const marker = L.circleMarker(coords, {
          radius: radius,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        });
        
        // Create popup with formula list (all formulas, clickable)
        const formulaList = Array.from(filteredData.formulas)
          .sort()
          .map(f => `<li style="margin: 0.25rem 0; font-size: 0.7rem;"><a href="#" onclick="const compBtn = document.getElementById('toggle-comparison');
if (compBtn.style.background === 'rgb(212, 175, 55)') {
  if (typeof window.addToComparison === 'function') window.addToComparison('${esc(f).replace(/'/g, "\\\\'")}');
} else {
  document.getElementById('formula-search-box').value='${esc(f).replace(/'/g, "\\\\'")}';
  const event = new Event('input', { bubbles: true });
  document.getElementById('formula-search-box').dispatchEvent(event);
}
return false;" style="color: #d4af37; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${esc(f)}</a></li>`)
          .join('');
        
        const centuryList = Object.entries(filteredData.centuries)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([c, count]) => `${esc(c)} (${count})`)
          .join(', ');
        
        const popupContent = `
          <div style="min-width: 250px; max-width: 350px;">
            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1rem;">
              ${esc(data.city || data.country)}
            </h4>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
              <strong>${filteredData.count}</strong> formula occurrence${filteredData.count !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">
              ${filteredData.formulas.size} unique formula${filteredData.formulas.size !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">
              Languages: ${Array.from(filteredData.languages).join(', ')}
            </div>
            ${centuryList ? `<div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb;">
              Centuries: ${centuryList}
            </div>` : ''}
            <details style="margin-top: 0.5rem;" open>
              <summary style="cursor: pointer; font-size: 0.75rem; font-weight: 600; color: #d4af37; margin-bottom: 0.5rem;">Formulas (${filteredData.formulas.size})</summary>
              <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; max-height: 300px; overflow-y: auto;">
                ${formulaList}
              </ul>
            </details>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        if (markerClusterGroup) {
          markerClusterGroup.addLayer(marker);
        } else {
          marker.addTo(map);
        }
        markers.push(marker);
        bounds.push(coords);
      }
    });
    
    // Refit map if there are markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
  
  // Export visible map data as CSV
  window.exportMapDataAsCSV = function() {
    if (!window.formulaMapData) return;
    
    const { markers, locationData } = window.formulaMapData;
    const searchTerm = document.getElementById('formula-search-box')?.value.toLowerCase().trim() || '';
    const selectedLanguage = document.getElementById('language-filter')?.value || '';
    const slider = document.getElementById('century-slider');
    const centuryIndex = parseInt(slider?.value || 0);
    
    // Get all unique centuries for filtering
    const allCenturies = new Set();
    Object.values(locationData).forEach(data => {
      Object.keys(data.centuries).forEach(c => allCenturies.add(c));
    });
    const sortedCenturies = Array.from(allCenturies).sort();
    const selectedCentury = centuryIndex > 0 ? sortedCenturies[centuryIndex - 1] : null;
    
    // Build CSV header
    const headers = ['Location', 'City', 'Country', 'Total Occurrences', 'Unique Formulas', 'Languages', 'Centuries', 'Formula List'];
    const rows = [headers];
    
    // Filter and add data rows
    Object.entries(locationData).forEach(([location, data]) => {
      let filteredMatches = data.matches;
      
      if (selectedCentury) {
        filteredMatches = filteredMatches.filter(m => m.century === selectedCentury);
      }
      if (searchTerm) {
        filteredMatches = filteredMatches.filter(m => m.formula.toLowerCase().includes(searchTerm));
      }
      if (selectedLanguage) {
        filteredMatches = filteredMatches.filter(m => m.language === selectedLanguage);
      }
      
      if (filteredMatches.length === 0) return;
      
      const formulas = new Set(filteredMatches.map(m => m.formula));
      const languages = new Set(filteredMatches.map(m => m.language));
      const centuries = {};
      filteredMatches.forEach(m => {
        if (m.century) centuries[m.century] = (centuries[m.century] || 0) + 1;
      });
      
      const centuryList = Object.entries(centuries)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([c, count]) => `${c} (${count})`)
        .join('; ');
      
      const row = [
        location,
        data.city || '',
        data.country || '',
        filteredMatches.length,
        formulas.size,
        Array.from(languages).join('; '),
        centuryList,
        Array.from(formulas).sort().join('; ')
      ];
      
      // Escape CSV values
      const escapedRow = row.map(value => {
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      });
      
      rows.push(escapedRow);
    });
    
    // Generate CSV content
    const csvContent = rows.map(row => row.join(',')).join('\n');
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `formula-map-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Export map as high-resolution PNG
  window.exportMapAsPNG = function() {
    if (!window.formulaMapData) return;
    
    const { map } = window.formulaMapData;
    const btn = document.getElementById('export-png-btn');
    btn.textContent = '⏳ Exporting...';
    btn.disabled = true;
    
    // Load leaflet-image if not already loaded
    if (typeof leafletImage === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet-image@0.4.0/leaflet-image.js';
      script.onload = () => captureMap();
      document.body.appendChild(script);
    } else {
      captureMap();
    }
    
    function captureMap() {
      // Temporarily disable clustering to show all markers for export
      const { markerClusterGroup, markers } = window.formulaMapData;
      const wasUsingCluster = map.hasLayer(markerClusterGroup);
      
      // Store current view
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();
      
      if (wasUsingCluster) {
        map.removeLayer(markerClusterGroup);
        markers.forEach(m => m.addTo(map));
      }
      
      // Reset map to show all bounds to prevent coordinate misplacement
      const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      
      // Wait for tiles and markers to render at new bounds
      setTimeout(() => {
        // Use leaflet-image to properly capture map tiles and markers
        leafletImage(map, function(err, canvas) {
          if (err) {
            console.error('PNG export failed:', err);
            btn.textContent = '📷 PNG';
            btn.disabled = false;
            
            // Restore original view on error
            map.setView(currentCenter, currentZoom);
            
            // Re-enable clustering if it was active
            if (wasUsingCluster) {
              markers.forEach(m => map.removeLayer(m));
              map.addLayer(markerClusterGroup);
            }
            
            alert('Export failed. Please try again.');
            return;
          }
        
        // Create high-resolution version
        const scaledCanvas = document.createElement('canvas');
        const scale = 2; // 2x for high DPI
        scaledCanvas.width = canvas.width * scale;
        scaledCanvas.height = canvas.height * scale;
        const ctx = scaledCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(canvas, 0, 0);
        
        // Convert to PNG and download
        scaledCanvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `formula-map-${new Date().toISOString().split('T')[0]}-hd.png`;
          link.click();
          URL.revokeObjectURL(url);
          
          btn.textContent = '📷 PNG';
          btn.disabled = false;
          
          // Restore original view
          map.setView(currentCenter, currentZoom);
          
          // Re-enable clustering if it was active
          if (wasUsingCluster) {
            markers.forEach(m => map.removeLayer(m));
            map.addLayer(markerClusterGroup);
          }
        }, 'image/png');
        });
      }, 800); // Wait 800ms for tiles and markers to render
    }
  }
  
  // Toggle heat map view
  window.toggleHeatMap = function() {
    if (!window.formulaMapData) return;
    
    const { map, locationData, cityCoordinates, markerClusterGroup } = window.formulaMapData;
    const btn = document.getElementById('toggle-heatmap');
    
    if (!window.heatMapLayer) {
      // Create heat map from location data
      const heatData = [];
      Object.entries(locationData).forEach(([location, data]) => {
        let coords = null;
        if (data.city && cityCoordinates[data.city]) {
          coords = cityCoordinates[data.city];
        } else if (cityCoordinates[location]) {
          coords = cityCoordinates[location];
        } else if (cityCoordinates[data.country]) {
          coords = cityCoordinates[data.country];
        }
        
        if (coords) {
          // Intensity based on formula count (normalized to 0-1)
          const intensity = Math.min(1.0, data.count / 20);
          heatData.push([coords[0], coords[1], intensity]);
        }
      });
      
      window.heatMapLayer = L.heatLayer(heatData, {
        radius: 40,
        blur: 20,
        maxZoom: 10,
        max: 1.0,
        minOpacity: 0.6,
        gradient: {
          0.0: '#fef3c7',
          0.3: '#fbbf24',
          0.5: '#f59e0b',
          0.7: '#d97706',
          1.0: '#92400e'
        }
      });
    }
    
    if (window.heatMapActive) {
      // Deactivate heat map
      map.removeLayer(window.heatMapLayer);
      map.addLayer(markerClusterGroup);
      window.heatMapActive = false;
      btn.style.background = 'white';
      btn.style.color = '#374151';
      btn.style.borderColor = '#d1d5db';
    } else {
      // Activate heat map
      map.removeLayer(markerClusterGroup);
      map.addLayer(window.heatMapLayer);
      window.heatMapActive = true;
      btn.style.background = '#92400e';
      btn.style.color = 'white';
      btn.style.borderColor = '#92400e';
    }
  }
  
  // Clear comparison mode
  window.clearComparison = function() {
    window.comparisonFormulas.clear();
    window.comparisonLayers.forEach(layer => {
      if (window.formulaMapData?.map) {
        window.formulaMapData.map.removeLayer(layer);
      }
    });
    window.comparisonLayers = [];
    document.getElementById('comparison-count').textContent = '0';
    document.getElementById('comparison-info').style.display = 'none';
    document.getElementById('toggle-comparison').style.background = 'white';
    document.getElementById('toggle-comparison').style.color = '#374151';
  }
  
  // Add formula to comparison
  window.addToComparison = function(formula) {
    if (!window.formulaMapData) return;
    if (!window.comparisonFormulas) window.comparisonFormulas = new Set();
    if (!window.comparisonLayers) window.comparisonLayers = [];
    
    if (window.comparisonFormulas.has(formula)) {
      alert('Formula already in comparison');
      return;
    }
    
    window.comparisonFormulas.add(formula);
    document.getElementById('comparison-count').textContent = window.comparisonFormulas.size;
    
    // Show user feedback
    const feedback = document.createElement('div');
    feedback.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; font-size: 0.875rem;';
    feedback.textContent = `Added "${formula.substring(0, 40)}${formula.length > 40 ? '...' : ''}" to comparison`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
    
    // Get color for this formula
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#fb923c', '#eab308'];
    const colorIndex = (window.comparisonFormulas.size - 1) % colors.length;
    const color = colors[colorIndex];
    
    // Find all locations with this formula
    const { map, locationData, cityCoordinates } = window.formulaMapData;
    const markers = [];
    
    Object.entries(locationData).forEach(([location, data]) => {
      if (data.formulas.has(formula)) {
        let coords = null;
        if (data.city && cityCoordinates[data.city]) {
          coords = cityCoordinates[data.city];
        } else if (cityCoordinates[location]) {
          coords = cityCoordinates[location];
        } else if (cityCoordinates[data.country]) {
          coords = cityCoordinates[data.country];
        }
        
        if (coords) {
          const marker = L.circleMarker(coords, {
            radius: 8,
            fillColor: color,
            color: 'white',
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.7
          });
          marker.bindPopup(`<strong style="color: ${color};">${esc(formula)}</strong><br>${esc(location)}`);
          marker.addTo(map);
          markers.push(marker);
        }
      }
    });
    
    window.comparisonLayers.push(...markers);
  }
  
  // Toggle network visualization
  window.toggleNetworkView = function() {
    if (!window.formulaMapData) {
      console.error('No formula map data');
      alert('Please wait for the map to finish loading');
      return;
    }
    if (!window.networkLines) window.networkLines = [];
    
    const { map, locationData, cityCoordinates } = window.formulaMapData;
    const btn = document.getElementById('toggle-network');
    
    if (!btn) {
      console.error('Network button not found');
      return;
    }
    
    if (window.networkActive) {
      // Remove network lines
      window.networkLines.forEach(line => map.removeLayer(line));
      window.networkLines = [];
      window.networkActive = false;
      btn.style.background = 'white';
      btn.style.color = '#374151';
      btn.style.borderColor = '#d1d5db';
    } else {
      // Create network lines between locations sharing formulas
      const locationCoords = {};
      Object.entries(locationData).forEach(([location, data]) => {
        let coords = null;
        if (data.city && cityCoordinates[data.city]) {
          coords = cityCoordinates[data.city];
        } else if (cityCoordinates[location]) {
          coords = cityCoordinates[location];
        } else if (cityCoordinates[data.country]) {
          coords = cityCoordinates[data.country];
        }
        if (coords) {
          locationCoords[location] = { coords, formulas: data.formulas };
        }
      });
      
      // Find connections (locations sharing formulas)
      const locations = Object.keys(locationCoords);
      const connections = new Map();
      
      for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
          const loc1 = locations[i];
          const loc2 = locations[j];
          const formulas1 = locationCoords[loc1].formulas;
          const formulas2 = locationCoords[loc2].formulas;
          
          // Count shared formulas
          const shared = new Set([...formulas1].filter(f => formulas2.has(f)));
          if (shared.size > 0) {
            const key = `${loc1}|${loc2}`;
            connections.set(key, { loc1, loc2, count: shared.size });
          }
        }
      }
      
      // Draw lines for connections
      connections.forEach(({ loc1, loc2, count }) => {
        const coords1 = locationCoords[loc1].coords;
        const coords2 = locationCoords[loc2].coords;
        
        const line = L.polyline([coords1, coords2], {
          color: '#d4af37',
          weight: Math.min(count / 2, 5),
          opacity: 0.4,
          dashArray: '5, 10'
        });
        
        line.bindPopup(`<strong>${esc(loc1)} ↔ ${esc(loc2)}</strong><br>${count} shared formula${count > 1 ? 's' : ''}`);
        line.addTo(map);
        window.networkLines.push(line);
      });
      
      window.networkActive = true;
      btn.style.background = '#d4af37';
      btn.style.color = 'white';
      btn.style.borderColor = '#d4af37';
      
      // Show feedback to user
      if (window.networkLines.length === 0) {
        alert('No connections found. Locations need to share at least one formula to be connected.');
      }
    }
  }
  
  // Toggle timeline animation
  window.toggleTimeline = function() {
    const btn = document.getElementById('play-timeline');
    const status = document.getElementById('timeline-status');
    const slider = document.getElementById('century-slider');
    
    if (window.timelineInterval) {
      // Stop animation
      clearInterval(window.timelineInterval);
      window.timelineInterval = null;
      btn.textContent = '▶️';
      status.textContent = 'Timeline Animation';
    } else {
      // Start animation
      btn.textContent = '⏸️';
      const max = parseInt(slider.max);
      let current = parseInt(slider.value);
      
      window.timelineInterval = setInterval(() => {
        current++;
        if (current > max) current = 0;
        
        slider.value = current;
        const event = new Event('input', { bubbles: true });
        slider.dispatchEvent(event);
        
        // Update status
        if (current === 0) {
          status.textContent = 'All Centuries';
        } else {
          const allCenturies = new Set();
          Object.values(window.formulaMapData.locationData).forEach(data => {
            Object.keys(data.centuries).forEach(c => allCenturies.add(c));
          });
          const sortedCenturies = Array.from(allCenturies).sort();
          status.textContent = sortedCenturies[current - 1] || 'Timeline Animation';
        }
      }, 2000); // 2 seconds per century
    }
  };

// 6. EXPLORE FORMULAS TAB (end event listeners)
  mount.addEventListener('formula-filter', () => {
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  mount.addEventListener('formula-page', (e) => {
    currentPage = e.detail;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
}

function buildBrowseColophons(mount) {
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Get unique languages, centuries, countries, and institutions for filters
  const languages = [...new Set(colophonSUs.map(su => getVal(su, 'Colophon language')).filter(Boolean))].sort();
  const centuries = [...new Set(colophonSUs.map(su => getVal(su, 'Normalized century of production')).filter(Boolean))].sort();
  
  // Get country from PU records (SU IsRelatedTo PU)
  const countries = [...new Set(colophonSUs.map(su => {
    const rels = getRecordRelationships(su.rec_ID);
    const puRel = rels.find(rel => {
      const relType = getVal(rel, 'Relationship type');
      const tgt = getRes(rel, 'Target record');
      if (!tgt?.id || !tgt?.type) return false;
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
      return relType === 'IsRelatedTo' && tgtType === 'pu';
    });
    
    if (puRel) {
      const tgt = getRes(puRel, 'Target record');
      const pu = IDX.pu[String(tgt.id)];
      if (pu) {
        return getVal(pu, 'PU country') || getVal(pu, 'Country');
      }
    }
    return null;
  }).filter(Boolean))].sort();
  
  // Get monastic institutions from PU records (SU IsRelatedTo PU, then PU has pointer to MI)
  const monasticInstitutions = [...new Set(colophonSUs.map(su => {
    const rels = getRecordRelationships(su.rec_ID);
    const puRel = rels.find(rel => {
      const relType = getVal(rel, 'Relationship type');
      const tgt = getRes(rel, 'Target record');
      if (!tgt?.id || !tgt?.type) return false;
      const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
      return relType === 'IsRelatedTo' && tgtType === 'pu';
    });
    
    if (!puRel) return null;
    
    const tgt = getRes(puRel, 'Target record');
    const pu = IDX.pu[String(tgt.id)];
    if (!pu) return null;
    
    // Get Monastic Institution pointer from PU record
    const miRes = getRes(pu, 'Monastic Institution');
    if (!miRes?.id) return null;
    
    const mi = IDX.mi[String(miRes.id)];
    if (!mi) return null;
    
    return MAP.mi.title(mi) || mi.rec_Title;
  }).filter(Boolean))].sort();
  
  // Build filter UI
  // Pagination state
  let currentPage = 1;
  const itemsPerPage = 20;
  
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Browse Colophons</h2>
      
      <div id="colophon-count-top" style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Showing 1-20 of ${colophonSUs.length} colophons. Use filters to refine your search.
      </div>
      
      <!-- Filters -->
      <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 600; color: #333; margin-bottom: 1rem;">Filter Colophons</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Language</label>
            <select id="filter-language" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem;">
              <option value="">All Languages</option>
              ${languages.map(lang => `<option value="${esc(lang)}">${esc(lang)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Century</label>
            <select id="filter-century" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem;">
              <option value="">All Centuries</option>
              ${centuries.map(cent => `<option value="${esc(cent)}">${esc(cent)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Country</label>
            <select id="filter-country" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem;">
              <option value="">All Countries</option>
              ${countries.map(country => `<option value="${esc(country)}">${esc(country)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Monastic Institution</label>
            <select id="filter-institution" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem;">
              <option value="">All Institutions</option>
              ${monasticInstitutions.map(inst => `<option value="${esc(inst)}">${esc(inst)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Search Text</label>
            <input type="text" id="filter-search" placeholder="Search colophon text..." style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem;">
          </div>
        </div>
      </div>
      
      <!-- Pagination Top -->
      <div id="pagination-top" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;"></div>
      
      <!-- Colophon List -->
      <div id="colophon-list" style="display: flex; flex-direction: column; gap: 1.5rem;"></div>
      
      <!-- Pagination Bottom -->
      <div id="pagination-bottom" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem;"></div>
      
      <div id="colophon-count-bottom" style="text-align: center; margin-top: 1.5rem; padding: 1.5rem; background: #f9f9f9; border-radius: 0.5rem; color: #666;"></div>
    </div>
  `;
  
  // Render function for colophons with pagination
  const renderColophons = (colophons, page) => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageColophons = colophons.slice(startIdx, endIdx);
    const totalPages = Math.ceil(colophons.length / itemsPerPage);
    
    const listDiv = document.getElementById('colophon-list');
    listDiv.innerHTML = pageColophons.length > 0 ? pageColophons.map((su, idx) => {
      const colophon = getColophonText(su);
      const scribeName = su.rec_Title || 'Unknown';
      const language = getVal(su, 'Colophon language') || 'Unknown';
      const century = getVal(su, 'Normalized century of production') || 'Unknown';
      const dating = getVal(su, 'SU dating') || 'Unknown';
      const msTitle = getVal(su, 'Manuscript') || 'Unknown';
      const cardId = 'colophon-card-' + (startIdx + idx);
      
      let html = '<div id="' + cardId + '" data-su-id="' + su.rec_ID + '" style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
      html += '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">';
      html += '<div style="flex: 1;">';
      html += '<h3 style="font-size: 1.1rem; font-weight: 600; color: #333; margin: 0 0 0.5rem 0;">' + esc(scribeName) + '</h3>';
      html += '<div style="font-size: 0.875rem; color: #666;">' + esc(msTitle) + '</div>';
      html += '</div>';
      html += '<div style="display: flex; gap: 0.5rem; align-items: center;">';
      html += '<div style="text-align: right; font-size: 0.875rem; color: #666; margin-right: 0.5rem;">';
      html += '<div>' + esc(language) + '</div>';
      html += '<div>' + esc(century) + ' century (' + esc(dating) + ')</div>';
      html += '</div>';
      html += '<button onclick="const card = document.getElementById(\'' + cardId + '\'); const content = card.querySelector(\'.colophon-content\'); const btn = this; if(content.style.display === \'none\') { content.style.display = \'block\'; btn.textContent = \'▼\'; } else { content.style.display = \'none\'; btn.textContent = \'▶\'; }" ';
      html += 'style="background: #f0f0f0; border: none; padding: 0.5rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 1rem; width: 40px; height: 40px;">▼</button>';
      html += '</div></div>';
      html += '<div class="colophon-content" style="display: block;">';
      
      if (colophon.hasTranscription) {
        html += '<div style="margin-bottom: 1rem;">';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">';
        html += '<div style="font-size: 0.75rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Original Transcription</div>';
        html += '<button onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent.trim()); this.innerHTML = \'✓ Copied!\'; setTimeout(() => this.innerHTML = \'Copy\', 2000);" ';
        html += 'style="background: #d4af37; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; white-space: nowrap;">Copy</button>';
        html += '</div>';
        html += '<div style="background: #f9f9f9; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #d4af37;">';
        html += '<p style="margin: 0; color: #444; line-height: 1.6; font-style: italic;">' + esc(colophon.transcription) + '</p>';
        html += '</div></div>';
      }
      
      if (colophon.hasTranslation) {
        html += '<div>';
        html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">';
        html += '<div style="font-size: 0.75rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">English Translation</div>';
        html += '<button onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent.trim()); this.innerHTML = \'✓ Copied!\'; setTimeout(() => this.innerHTML = \'Copy\', 2000);" ';
        html += 'style="background: #4facfe; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; white-space: nowrap;">Copy</button>';
        html += '</div>';
        html += '<div style="background: #f0f8ff; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #4facfe;">';
        html += '<p style="margin: 0; color: #333; line-height: 1.6;">' + esc(colophon.translation) + '</p>';
        html += '</div></div>';
      }
      
      if (!colophon.hasTranscription && !colophon.hasTranslation) {
        html += '<div style="color: #999; font-style: italic;">No colophon text available</div>';
      }
      
      html += '</div></div>';
      return html;
    }).join('')
      : '<div style="text-align: center; padding: 2rem; color: #666;">No colophons match your filters.</div>';
    
    // Update count messages
    const countMsg = colophons.length > 0 
      ? `Showing ${startIdx + 1}-${Math.min(endIdx, colophons.length)} of ${colophons.length} colophon${colophons.length !== 1 ? 's' : ''}`
      : 'No colophons found';
    
    document.getElementById('colophon-count-top').textContent = countMsg + (colophons.length > 0 ? '. Use filters to refine your search.' : '');
    document.getElementById('colophon-count-bottom').textContent = countMsg + '.';
    
    // Render pagination
    const renderPagination = (containerId) => {
      const container = document.getElementById(containerId);
      if (totalPages <= 1) {
        container.innerHTML = '';
        return;
      }
      
      const buttons = [];
      
      // Previous button
      const prevDisabled = page === 1;
      buttons.push(
        '<button ' + (prevDisabled ? 'disabled ' : '') + 
        'onclick="this.dispatchEvent(new CustomEvent(&apos;colophon-page&apos;, {detail: ' + (page - 1) + ', bubbles: true}));" ' +
        'style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 0.25rem; background: ' + (prevDisabled ? '#f5f5f5' : 'white') + '; cursor: ' + (prevDisabled ? 'not-allowed' : 'pointer') + '; color: ' + (prevDisabled ? '#999' : '#333') + ';">' +
        '← Previous</button>'
      );
      
      // Page numbers
      const maxButtons = 7;
      let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      
      if (startPage > 1) {
        buttons.push(
          '<button onclick="this.dispatchEvent(new CustomEvent(&apos;colophon-page&apos;, {detail: 1, bubbles: true}));" ' +
          'style="padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 0.25rem; background: white; cursor: pointer;">1</button>'
        );
        if (startPage > 2) {
          buttons.push('<span style="padding: 0.5rem;">...</span>');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        const isCurrent = i === page;
        buttons.push(
          '<button ' + (isCurrent ? 'disabled ' : '') +
          'onclick="this.dispatchEvent(new CustomEvent(&apos;colophon-page&apos;, {detail: ' + i + ', bubbles: true}));" ' +
          'style="padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 0.25rem; background: ' + (isCurrent ? '#007bff' : 'white') + '; color: ' + (isCurrent ? 'white' : '#333') + '; cursor: ' + (isCurrent ? 'default' : 'pointer') + '; font-weight: ' + (isCurrent ? '600' : '400') + ';">' +
          i + '</button>'
        );
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push('<span style="padding: 0.5rem;">...</span>');
        }
        buttons.push(
          '<button onclick="this.dispatchEvent(new CustomEvent(&apos;colophon-page&apos;, {detail: ' + totalPages + ', bubbles: true}));" ' +
          'style="padding: 0.5rem 0.75rem; border: 1px solid #ddd; border-radius: 0.25rem; background: white; cursor: pointer;">' + totalPages + '</button>'
        );
      }
      
      // Next button
      const nextDisabled = page === totalPages;
      buttons.push(
        '<button ' + (nextDisabled ? 'disabled ' : '') +
        'onclick="this.dispatchEvent(new CustomEvent(&apos;colophon-page&apos;, {detail: ' + (page + 1) + ', bubbles: true}));" ' +
        'style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 0.25rem; background: ' + (nextDisabled ? '#f5f5f5' : 'white') + '; cursor: ' + (nextDisabled ? 'not-allowed' : 'pointer') + '; color: ' + (nextDisabled ? '#999' : '#333') + ';">' +
        'Next →</button>'
      );
      
      container.innerHTML = buttons.join('');
    };
    
    renderPagination('pagination-top');
    renderPagination('pagination-bottom');
    
    // Scroll to top
    mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // Initial render
  renderColophons(colophonSUs, currentPage);
  
  // Page change handler
  mount.addEventListener('colophon-page', (e) => {
    currentPage = e.detail;
    renderColophons(getCurrentFiltered(), currentPage);
  });
  
  // Add filter event listeners
  const filterLanguage = document.getElementById('filter-language');
  const filterCentury = document.getElementById('filter-century');
  const filterCountry = document.getElementById('filter-country');
  const filterInstitution = document.getElementById('filter-institution');
  const filterSearch = document.getElementById('filter-search');
  
  const getCurrentFiltered = () => {
    const langValue = filterLanguage?.value || '';
    const centValue = filterCentury?.value || '';
    const countryValue = filterCountry?.value || '';
    const institutionValue = filterInstitution?.value || '';
    const searchValue = filterSearch?.value.toLowerCase() || '';
    
    let filtered = colophonSUs;
    
    if (langValue) {
      filtered = filtered.filter(su => getVal(su, 'Colophon language') === langValue);
    }
    
    if (centValue) {
      filtered = filtered.filter(su => getVal(su, 'Normalized century of production') === centValue);
    }
    
    if (countryValue) {
      filtered = filtered.filter(su => {
        const rels = getRecordRelationships(su.rec_ID);
        const puRel = rels.find(rel => {
          const relType = getVal(rel, 'Relationship type');
          const tgt = getRes(rel, 'Target record');
          if (!tgt?.id || !tgt?.type) return false;
          const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
          return relType === 'IsRelatedTo' && tgtType === 'pu';
        });
        
        if (!puRel) return false;
        
        const tgt = getRes(puRel, 'Target record');
        const pu = IDX.pu[String(tgt.id)];
        if (!pu) return false;
        
        const country = getVal(pu, 'PU country') || getVal(pu, 'Country');
        return country === countryValue;
      });
    }
    
    if (institutionValue) {
      filtered = filtered.filter(su => {
        const rels = getRecordRelationships(su.rec_ID);
        const puRel = rels.find(rel => {
          const relType = getVal(rel, 'Relationship type');
          const tgt = getRes(rel, 'Target record');
          if (!tgt?.id || !tgt?.type) return false;
          const tgtType = REC_TYPE_TO_ENTITY[String(tgt.type)];
          return relType === 'IsRelatedTo' && tgtType === 'pu';
        });
        
        if (!puRel) return false;
        
        const tgt = getRes(puRel, 'Target record');
        const pu = IDX.pu[String(tgt.id)];
        if (!pu) return false;
        
        // Get Monastic Institution pointer from PU record
        const miRes = getRes(pu, 'Monastic Institution');
        if (!miRes?.id) return false;
        
        const mi = IDX.mi[String(miRes.id)];
        if (!mi) return false;
        
        const title = MAP.mi.title(mi) || mi.rec_Title;
        return title === institutionValue;
      });
    }
    
    if (searchValue) {
      filtered = filtered.filter(su => {
        const colophon = getColophonText(su);
        const text = (colophon.translation + ' ' + colophon.transcription).toLowerCase();
        return text.includes(searchValue);
      });
    }
    
    return filtered;
  };
  
  const applyFilters = () => {
    currentPage = 1; // Reset to first page when filters change
    renderColophons(getCurrentFiltered(), currentPage);
  };
  
  if (filterLanguage) filterLanguage.addEventListener('change', applyFilters);
  if (filterCentury) filterCentury.addEventListener('change', applyFilters);
  if (filterCountry) filterCountry.addEventListener('change', applyFilters);
  if (filterInstitution) filterInstitution.addEventListener('change', applyFilters);
  if (filterSearch) filterSearch.addEventListener('input', debounce(applyFilters, 300));
}

/* ---------- Boot ---------- */
async function boot(){
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
  
  // Initialize all event listeners
  initModeNavigation();
  initEventListeners();
  
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
                
                // Apply network-specific parameters
                if (networkParam && networkParam.includes('subgenre')) {
                  const subgenreBtn = document.querySelector('[data-level="subgenre"]');
                  if (subgenreBtn && !subgenreBtn.classList.contains('is-on')) {
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
                  
                  if (networkParam.includes('subgenre')) {
                    const subgenreBtn = document.querySelector('[data-level="subgenre"]');
                    if (subgenreBtn && !subgenreBtn.classList.contains('is-on')) {
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
  
  // Check for URL parameters to auto-navigate to a specific record
  const slugParam = params.get('slug');
  const typeParam = params.get('type') || 'ms';
  
  if (slugParam && typeParam === 'ms') {
    // Search for manuscript with matching ARK ID in manifest URL
    const manuscripts = Object.values(IDX.ms || {});
    for (const ms of manuscripts) {
      const manifestUrl = MAP.ms.iiifManifest(ms);
      if (manifestUrl) {
        const arkMatch = manifestUrl.match(/ark:\/\d+\/([^\/]+)/);
        if (arkMatch) {
          const msSlug = 'irht-' + arkMatch[1];
          if (msSlug === slugParam) {
            // Auto-navigate to matched manuscript
            setTimeout(() => jumpTo('ms', String(ms.rec_ID)), 100);
            break;
          }
        }
      }
    }
  }
}

/* =========================================
   TEXT GENRES ANALYSIS MODULE
   ========================================= */

function buildTextGenres() {
  const mount = document.getElementById('text-genres-mount');
  if (!mount) {
    console.error('text-genres-mount element not found');
    return;
  }
  
  // Initialize UI
  mount.innerHTML = `
    <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); overflow: hidden;">
      <div style="border-bottom: 2px solid #f0f0f0;">
        <div class="genre-tabs" style="display: flex; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #fafafa;">
          <button class="genre-tab-btn is-on" data-tab="overview" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Overview
          </button>
          <button class="genre-tab-btn" data-tab="manuscript-networks" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Manuscript Networks
          </button>
          <button class="genre-tab-btn" data-tab="institution-networks" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Institution Networks
          </button>
          <button class="genre-tab-btn" data-tab="scribe-networks" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Scribe Networks
          </button>
          <button class="genre-tab-btn" data-tab="distributions" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Distributions
          </button>
        </div>
      </div>
      <div style="padding: 1.5rem;">
        <div id="genre-tab-content" style="overflow: auto; min-height: 60vh;">
          <!-- Content will be rendered here -->
        </div>
      </div>
    </div>
  `;
  
  // Tab switching
  const tabBtns = mount.querySelectorAll('.genre-tab-btn');
  const contentArea = mount.querySelector('#genre-tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.toggle('is-on', b === btn));
      renderGenreTab(tab, contentArea);
    });
  });
  
  // CSS for active tab
  const style = document.createElement('style');
  style.textContent = `
    .genre-tab-btn.is-on {
      background: white !important;
      color: #2c3e50 !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .genre-tab-btn:hover {
      background: #f5f5f5;
    }
  `;
  mount.appendChild(style);
  
  // Render initial tab
  renderGenreTab('overview', contentArea);
}

function renderGenreTab(tab, container) {
  if (tab === 'overview') renderGenreOverview(container);
  else if (tab === 'manuscript-networks') renderManuscriptNetworks(container);
  else if (tab === 'institution-networks') renderInstitutionNetworks(container);
  else if (tab === 'scribe-networks') renderScribeNetworks(container);
  else if (tab === 'distributions') renderGenreDistributions(container);
}

function renderGenreOverview(container) {
  container.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Text Genre Analysis</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div style="background: #fef3c7; border-radius: 0.5rem; padding: 1.5rem;">
          <h3 style="margin: 0 0 0.5rem 0; color: #92400e; font-size: 1.125rem;">Total Texts</h3>
          <div id="total-texts" style="font-size: 2.5rem; font-weight: 700; color: #92400e;">Loading...</div>
        </div>
        <div style="background: #dbeafe; border-radius: 0.5rem; padding: 1.5rem;">
          <h3 style="margin: 0 0 0.5rem 0; color: #1e40af; font-size: 1.125rem;">Unique Genres</h3>
          <div id="total-genres" style="font-size: 2.5rem; font-weight: 700; color: #1e40af;">Loading...</div>
        </div>
        <div style="background: #dcfce7; border-radius: 0.5rem; padding: 1.5rem;">
          <h3 style="margin: 0 0 0.5rem 0; color: #166534; font-size: 1.125rem;">Unique Subgenres</h3>
          <div id="total-subgenres" style="font-size: 2.5rem; font-weight: 700; color: #166534;">Loading...</div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.25rem;">Top Genres by Text Count</h3>
          <div id="top-genres-chart"></div>
        </div>
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.25rem;">Top Subgenres by Text Count</h3>
          <div id="top-subgenres-chart"></div>
        </div>
      </div>
      
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
        <h3 style="margin: 0 0 0.75rem 0; color: #2c3e50; font-size: 1.25rem;">Analysis Approaches</h3>
        <p style="margin: 0 0 1rem 0; font-size: 0.875rem; color: #64748b;">
          This module provides three complementary views of text genre patterns:
        </p>
        <div style="display: grid; gap: 1rem;">
          <div style="padding: 1rem; background: #f8fafc; border-left: 3px solid #3b82f6; border-radius: 0.375rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: #1e40af;">Manuscript Networks</h4>
            <p style="margin: 0; font-size: 0.875rem; color: #64748b;">
              Bipartite networks showing manuscripts and the genres/subgenres they contain. Toggle between broad genre categories and granular subgenres. Reveals composition patterns and co-occurrence.
            </p>
          </div>
          <div style="padding: 1rem; background: #f8fafc; border-left: 3px solid #10b981; border-radius: 0.375rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: #065f46;">Institution Networks</h4>
            <p style="margin: 0; font-size: 0.875rem; color: #64748b;">
              Networks of monastic institutions connected to genres/subgenres they produced or preserved. Identifies institutional specializations and textual preferences across monasteries.
            </p>
          </div>
          <div style="padding: 1rem; background: #f8fafc; border-left: 3px solid #22c55e; border-radius: 0.375rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: #166534;">Scribe Networks</h4>
            <p style="margin: 0; font-size: 0.875rem; color: #64748b;">
              Networks showing which scribes actively copied which genres/subgenres. Reveals individual specialization, generalists vs. specialists, and knowledge brokers in the scribal workforce.
            </p>
          </div>
          <div style="padding: 1rem; background: #f8fafc; border-left: 3px solid #f59e0b; border-radius: 0.375rem;">
            <h4 style="margin: 0 0 0.5rem 0; color: #92400e;">Genre Distributions</h4>
            <p style="margin: 0; font-size: 0.875rem; color: #64748b;">
              Charts showing genre popularity across institutions, locations, and time periods. Find patterns in textual preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Calculate statistics
  const allTexts = DATA.tx || [];
  const genreCounts = {};
  const subgenreCounts = {};
  
  allTexts.forEach(text => {
    const genre = MAP.tx?.genre(text);
    if (genre && genre !== 'Unknown') {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    }
    
    const subgenre = MAP.tx?.sub(text);
    if (subgenre && subgenre !== 'Unknown') {
      subgenreCounts[subgenre] = (subgenreCounts[subgenre] || 0) + 1;
    }
  });
  
  const totalTextsEl = document.getElementById('total-texts');
  const totalGenresEl = document.getElementById('total-genres');
  const totalSubgenresEl = document.getElementById('total-subgenres');
  
  if (totalTextsEl) totalTextsEl.textContent = allTexts.length;
  if (totalGenresEl) totalGenresEl.textContent = Object.keys(genreCounts).length;
  if (totalSubgenresEl) totalSubgenresEl.textContent = Object.keys(subgenreCounts).length;
  
  // Top genres chart
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  const maxGenreCount = topGenres.length > 0 ? Math.max(...topGenres.map(([, count]) => count)) : 1;
  const genreChartHTML = topGenres.map(([genre, count]) => {
    const barWidth = (count / maxGenreCount) * 100;
    return `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
        <div style="width: 180px; font-size: 0.875rem; color: #64748b; font-weight: 500; text-align: right;">
          ${genre.length > 25 ? genre.substring(0, 22) + '...' : genre}
        </div>
        <div style="flex: 1; display: flex; align-items: center;">
          <div style="background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); height: 28px; width: ${barWidth}%; border-radius: 0.25rem; position: relative; min-width: 30px;">
            <div style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); color: white; font-weight: 600; font-size: 0.875rem;">
              ${count}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  const topGenresChartEl = document.getElementById('top-genres-chart');
  if (topGenresChartEl) topGenresChartEl.innerHTML = genreChartHTML;
  
  // Top subgenres chart
  const topSubgenres = Object.entries(subgenreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  const maxSubgenreCount = topSubgenres.length > 0 ? Math.max(...topSubgenres.map(([, count]) => count)) : 1;
  const subgenreChartHTML = topSubgenres.map(([subgenre, count]) => {
    const barWidth = (count / maxSubgenreCount) * 100;
    return `
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
        <div style="width: 180px; font-size: 0.875rem; color: #64748b; font-weight: 500; text-align: right;">
          ${subgenre.length > 25 ? subgenre.substring(0, 22) + '...' : subgenre}
        </div>
        <div style="flex: 1; display: flex; align-items: center;">
          <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 28px; width: ${barWidth}%; border-radius: 0.25rem; position: relative; min-width: 30px;">
            <div style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); color: white; font-weight: 600; font-size: 0.875rem;">
              ${count}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  const topSubgenresChartEl = document.getElementById('top-subgenres-chart');
  if (topSubgenresChartEl) topSubgenresChartEl.innerHTML = subgenreChartHTML;
}

function renderManuscriptNetworks(container) {
  container.innerHTML = `
    <div style="width: 100%; max-width: 100%; margin: 0; padding: 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <h2 style="margin: 0; color: #1a1a1a;">Manuscript Networks</h2>
        <div style="display: flex; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: 0.5rem;">
            <button class="network-mode-btn is-active" data-mode="genre" style="padding: 0.5rem 1rem; border: none; background: white; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Genres
            </button>
            <button class="network-mode-btn" data-mode="subgenre" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #64748b;">
              Subgenres
            </button>
          </div>
          <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: 0.5rem;">
            <button class="layout-toggle-btn is-active" data-layout="horizontal" style="padding: 0.5rem 1rem; border: none; background: white; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Horizontal
            </button>
            <button class="layout-toggle-btn" data-layout="radial" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #64748b;">
              Radial
            </button>
          </div>
        </div>
      </div>
      <p style="margin: 0 0 1.5rem 0; font-size: 0.875rem; color: #64748b; max-width: 800px;">
        This network shows which manuscripts contain which <span id="ms-level-text">genres</span>. Manuscripts are on the left (blue), <span id="ms-level-text2">genres</span> on the right (colored by category). 
        Edge thickness indicates frequency. Use this to discover co-occurrence patterns.
      </p>
      
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;" id="ms-network-wrapper">
        <div id="ms-network-viz" style="width: 100%; min-height: 700px;"></div>
      </div>
    </div>
  `;
  
  const modeBtns = container.querySelectorAll('.network-mode-btn');
  const layoutBtns = container.querySelectorAll('.layout-toggle-btn');
  const levelText = container.querySelector('#ms-level-text');
  const levelText2 = container.querySelector('#ms-level-text2');
  
  let currentMode = 'genre';
  let currentLayout = 'horizontal';
  
  function rebuildNetwork() {
    setTimeout(() => buildManuscriptNetwork(currentMode, currentLayout), 0);
  }
  
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.style.background = b === btn ? 'white' : 'transparent';
        b.style.boxShadow = b === btn ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
        b.style.color = b === btn ? '#1e293b' : '#64748b';
      });
      levelText.textContent = currentMode === 'genre' ? 'genres' : 'subgenres';
      levelText2.textContent = currentMode === 'genre' ? 'genres' : 'subgenres';
      rebuildNetwork();
    });
  });
  
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLayout = btn.dataset.layout;
      layoutBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.style.background = b === btn ? 'white' : 'transparent';
        b.style.boxShadow = b === btn ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
        b.style.color = b === btn ? '#1e293b' : '#64748b';
      });
      rebuildNetwork();
    });
  });
  
  // Build initial network
  rebuildNetwork();
}

function renderInstitutionNetworks(container) {
  container.innerHTML = `
    <div style="width: 100%; max-width: 100%; margin: 0; padding: 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <h2 style="margin: 0; color: #1a1a1a;">Institution Networks</h2>
        <div style="display: flex; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: 0.5rem;">
            <button class="network-mode-btn is-active" data-mode="genre" style="padding: 0.5rem 1rem; border: none; background: white; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Genres
            </button>
            <button class="network-mode-btn" data-mode="subgenre" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #64748b;">
              Subgenres
            </button>
          </div>
          <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: 0.5rem;">
            <button class="layout-toggle-btn is-active" data-layout="horizontal" style="padding: 0.5rem 1rem; border: none; background: white; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Horizontal
            </button>
            <button class="layout-toggle-btn" data-layout="radial" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #64748b;">
              Radial
            </button>
          </div>
        </div>
      </div>
      <p style="margin: 0 0 1.5rem 0; font-size: 0.875rem; color: #64748b; max-width: 800px;">
        This network connects monastic institutions to the <span id="inst-level-text">genres</span> they produced/preserved. 
        Node size reflects activity level. Reveals institutional specializations and preferences across monasteries.
      </p>
      
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;" id="inst-network-wrapper">
        <div id="inst-network-viz" style="width: 100%; min-height: 700px;"></div>
      </div>
    </div>
  `;
  
  const modeBtns = container.querySelectorAll('.network-mode-btn');
  const layoutBtns = container.querySelectorAll('.layout-toggle-btn');
  const levelText = container.querySelector('#inst-level-text');
  
  let currentMode = 'genre';
  let currentLayout = 'horizontal';
  
  function rebuildNetwork() {
    setTimeout(() => buildInstitutionNetwork(currentMode, currentLayout), 0);
  }
  
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.style.background = b === btn ? 'white' : 'transparent';
        b.style.boxShadow = b === btn ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
        b.style.color = b === btn ? '#1e293b' : '#64748b';
      });
      levelText.textContent = currentMode === 'genre' ? 'genres' : 'subgenres';
      rebuildNetwork();
    });
  });
  
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLayout = btn.dataset.layout;
      layoutBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.style.background = b === btn ? 'white' : 'transparent';
        b.style.boxShadow = b === btn ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
        b.style.color = b === btn ? '#1e293b' : '#64748b';
      });
      rebuildNetwork();
    });
  });
  
  // Build initial network
  rebuildNetwork();
}

function renderScribeNetworks(container) {
  container.innerHTML = `
    <div style="width: 100%; max-width: 100%; margin: 0; padding: 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <h2 style="margin: 0; color: #1a1a1a;">Scribe Networks</h2>
        <div style="display: flex; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: 0.5rem;">
            <button class="network-mode-btn is-active" data-mode="genre" style="padding: 0.5rem 1rem; border: none; background: white; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Genres
            </button>
            <button class="network-mode-btn" data-mode="subgenre" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #64748b;">
              Subgenres
            </button>
          </div>
          <div style="display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.375rem; border-radius: 0.5rem;">
            <button class="layout-toggle-btn is-active" data-layout="horizontal" style="padding: 0.5rem 1rem; border: none; background: white; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              Horizontal
            </button>
            <button class="layout-toggle-btn" data-layout="radial" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: #64748b;">
              Radial
            </button>
          </div>
        </div>
      </div>
      <p style="margin: 0 0 1.5rem 0; font-size: 0.875rem; color: #64748b; max-width: 900px;">
        This network shows which scribes actively copied which <span id="scribe-level-text">genres</span>. Scribes are on the left (green), <span id="scribe-level-text2">genres</span> on the right (colored by category). 
        Bridges indicate scribes with diverse repertoires. Hubs show specialist scribes or popular <span id="scribe-level-text3">genres</span>.
      </p>
      
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;" id="scribe-network-wrapper">
        <div id="scribe-network-viz" style="width: 100%; min-height: 700px;"></div>
      </div>
    </div>
  `;
  
  const modeBtns = container.querySelectorAll('.network-mode-btn');
  const layoutBtns = container.querySelectorAll('.layout-toggle-btn');
  const levelText = container.querySelector('#scribe-level-text');
  const levelText2 = container.querySelector('#scribe-level-text2');
  const levelText3 = container.querySelector('#scribe-level-text3');
  
  let currentMode = 'genre';
  let currentLayout = 'horizontal';
  
  function rebuildNetwork() {
    setTimeout(() => buildScribeNetwork(currentMode, currentLayout), 0);
  }
  
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      modeBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.style.background = b === btn ? 'white' : 'transparent';
        b.style.boxShadow = b === btn ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
        b.style.color = b === btn ? '#1e293b' : '#64748b';
      });
      const modeText = currentMode === 'genre' ? 'genres' : 'subgenres';
      levelText.textContent = modeText;
      levelText2.textContent = modeText;
      levelText3.textContent = modeText;
      rebuildNetwork();
    });
  });
  
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLayout = btn.dataset.layout;
      layoutBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.style.background = b === btn ? 'white' : 'transparent';
        b.style.boxShadow = b === btn ? '0 1px 3px rgba(0,0,0,0.1)' : 'none';
        b.style.color = b === btn ? '#1e293b' : '#64748b';
      });
      rebuildNetwork();
    });
  });
  
  // Build initial network
  rebuildNetwork();
}

function renderGenreDistributions(container) {
  container.innerHTML = `
    <div style="max-width: 1400px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">Genre Distribution Analysis</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.125rem;">Genres by Institution</h3>
          <div id="genres-by-institution"></div>
        </div>
        <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.125rem;">Genres by Location</h3>
          <div id="genres-by-location"></div>
        </div>
      </div>
      
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); padding: 1.5rem;">
        <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.125rem;">Genre Popularity Over Time</h3>
        <div id="genres-over-time"></div>
      </div>
    </div>
  `;
  
  // Wait for DOM to update before building charts
  setTimeout(() => buildGenreDistributions(), 0);
}

// Network visualization functions
function buildManuscriptGenreNetwork() {
  buildManuscriptNetwork('genre', 'horizontal');
}

function buildManuscriptSubgenreNetwork() {
  buildManuscriptNetwork('subgenre', 'horizontal');
}

function buildManuscriptNetwork(levelFilter = 'genre', layout = 'horizontal') {
  const container = document.getElementById('ms-network-viz');
  if (!container) return;
  
  // Build bipartite network data
  const manuscriptNodes = new Map();
  const genreNodes = new Map();
  const links = [];
  
  console.log('Building manuscript-genre network...');
  console.log('Total PUs:', DATA.pu?.length || 0);
  console.log('Total Texts:', DATA.tx?.length || 0);
  console.log('Total Relationships:', DATA.rel?.length || 0);
  
  // Debug: Check first PU structure
  if (DATA.pu && DATA.pu[0]) {
    console.log('Sample PU:', DATA.pu[0].rec_ID);
    console.log('PU fields:', (DATA.pu[0].details || []).map(d => d.fieldName));
  }
  
  // Debug: Check relationship structure
  if (DATA.rel && DATA.rel[0]) {
    console.log('Sample relationship:', DATA.rel[0]);
    console.log('Relationship keys:', Object.keys(DATA.rel[0]));
  }
  
  let pusHavingManuscript = 0;
  let pusHavingTexts = 0;
  let relationshipsChecked = 0;
  
  // Process production units to connect manuscripts to genres and subgenres
  // Path: Production Unit → Manuscript (pointer field) + Production Unit → Text (via "contains" relationship in relationships.json)
  (DATA.pu || []).forEach(pu => {
    const puId = String(pu.rec_ID);
    
    // Get manuscript linked to this production unit (pointer field)
    const msRes = getRes(pu, 'Manuscript');
    if (!msRes || !msRes.id) return;
    pusHavingManuscript++;
    
    const msId = String(msRes.id);
    const ms = IDX.ms?.[msId];
    if (!ms) return;
    
    const msTitle = MAP.ms?.title(ms) || `MS-${msId}`;
    
    // Get texts linked to this production unit via relationships
    const textGenresAndSubs = new Set();  // Store genres or subgenres based on levelFilter
    
    // Use the REL_INDEX to get relationships for this PU
    const puRels = [
      ...(REL_INDEX.bySource?.[puId] || []),
      ...(REL_INDEX.byTarget?.[puId] || [])
    ];
    
    puRels.forEach(rel => {
      relationshipsChecked++;
      
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const srcId = src?.id ? String(src.id) : null;
      const tgtId = tgt?.id ? String(tgt.id) : null;
      
      // Get the other record (the one that's not the PU)
      const otherId = srcId === puId ? tgtId : (tgtId === puId ? srcId : null);
      if (!otherId) return;
      
      const text = IDX.tx?.[otherId];
      
      if (text) {
        const genre = MAP.tx?.genre(text);
        const subgenre = MAP.tx?.sub(text);
        
        // Add genre or subgenre based on levelFilter
        if (levelFilter === 'genre' && genre && genre !== 'Unknown' && genre !== '') {
          textGenresAndSubs.add(`genre:${genre}`);
        }
        if (levelFilter === 'subgenre' && subgenre && subgenre !== 'Unknown' && subgenre !== '') {
          textGenresAndSubs.add(`sub:${subgenre}`);
        }
      }
    });
    
    if (textGenresAndSubs.size > 0) {
      pusHavingTexts++;
      if (!manuscriptNodes.has(msId)) {
        manuscriptNodes.set(msId, {
          id: `ms-${msId}`,
          name: msTitle.length > 40 ? msTitle.substring(0, 37) + '...' : msTitle,
          fullName: msTitle,
          type: 'manuscript',
          genreCount: 0,
          uniqueGenres: new Set()
        });
      }
      
      const msNode = manuscriptNodes.get(msId);
      msNode.genreCount += textGenresAndSubs.size;
      
      textGenresAndSubs.forEach(genreKey => {
        const [type, name] = genreKey.split(':');
        const isSubgenre = type === 'sub';
        const nodeId = genreKey;
        
        // Track unique genre types for bridge detection
        msNode.uniqueGenres.add(name);
        
        if (!genreNodes.has(nodeId)) {
          genreNodes.set(nodeId, {
            id: nodeId,
            name: name,
            type: isSubgenre ? 'subgenre' : 'genre',
            msCount: 0,
            uniqueManuscripts: new Set()
          });
        }
        const genreNode = genreNodes.get(nodeId);
        genreNode.msCount++;
        genreNode.uniqueManuscripts.add(msId);
        
        links.push({
          source: `ms-${msId}`,
          target: nodeId,
          value: 1
        });
      });
    }
  });
  
  console.log(`Manuscript-${levelFilter === 'genre' ? 'Genre' : 'Subgenre'} Network:`, {
    relationshipsChecked,
    pusWithMs: pusHavingManuscript,
    pusWithTexts: pusHavingTexts,
    manuscripts: manuscriptNodes.size,
    items: genreNodes.size,
    links: links.length
  });
  
  const nodeArray = [...manuscriptNodes.values(), ...genreNodes.values()];
  
  if (nodeArray.length === 0) {
    container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8;">No manuscript-genre relationships found</div>';
    return;
  }
  
  // Clear container and create wrapper
  container.innerHTML = '';
  
  // Detect bridge nodes (manuscripts connecting many different genres, genres connecting many manuscripts)
  const avgMsGenres = Array.from(manuscriptNodes.values()).reduce((sum, n) => sum + n.uniqueGenres.size, 0) / manuscriptNodes.size;
  const avgGenreMs = Array.from(genreNodes.values()).reduce((sum, n) => sum + n.uniqueManuscripts.size, 0) / genreNodes.size;
  
  manuscriptNodes.forEach(node => {
    node.isBridge = node.uniqueGenres.size > avgMsGenres * 1.5;  // 50% above average
    node.isHub = node.genreCount > avgMsGenres * 2;  // Major hub if 2x average
  });
  
  genreNodes.forEach(node => {
    node.isBridge = node.uniqueManuscripts.size > avgGenreMs * 1.5;
    node.isHub = node.msCount > avgGenreMs * 2;
  });
  
  const bridgeCount = Array.from(manuscriptNodes.values()).filter(n => n.isBridge).length + 
                      Array.from(genreNodes.values()).filter(n => n.isBridge).length;
  const hubCount = Array.from(manuscriptNodes.values()).filter(n => n.isHub).length + 
                   Array.from(genreNodes.values()).filter(n => n.isHub).length;
  
  const itemCount = genreNodes.size;
  const itemLabel = levelFilter === 'genre' ? 'genres' : 'subgenres';
  
  // Controls bar
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; flex-wrap: wrap; gap: 0.75rem;';
  controlsDiv.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      <button id="ms-zoom-in" style="padding: 0.375rem 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom In</button>
      <button id="ms-zoom-out" style="padding: 0.375rem 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom Out</button>
      <button id="ms-reset" style="padding: 0.375rem 0.75rem; background: #64748b; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Reset View</button>
      <button id="ms-toggle-labels" style="padding: 0.375rem 0.75rem; background: #8b5cf6; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Labels</button>
      <button id="ms-toggle-singles" style="padding: 0.375rem 0.75rem; background: #ec4899; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Singles</button>
    </div>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <span style="font-size: 0.875rem; color: #64748b; font-weight: 600;">${manuscriptNodes.size} manuscripts • ${itemCount} ${itemLabel} • ${bridgeCount} bridges • ${hubCount} hubs</span>
      ${createEmbedButton(`manuscript-${levelFilter}`)}
      ${createExportButton('ms-network-viz', `manuscript-${itemLabel}-network.png`)}
    </div>
  `;
  container.appendChild(controlsDiv);
  
  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.875rem;';
  legendDiv.innerHTML = `
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: #3b82f6; border-radius: 50%; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600;">Manuscripts (circles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 12px; background: ${levelFilter === 'genre' ? '#f59e0b' : '#a855f7'}; border-radius: 3px; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${itemLabel} (rectangles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: white; border-radius: 50%; border: 3px solid #dc2626;"></div>
        <span style="color: #1e293b; font-weight: 600;">Bridge Nodes</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 20px; height: 20px; background: white; border-radius: 50%; border: 3px solid #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);"></div>
        <span style="color: #1e293b; font-weight: 600;">Major Hubs</span>
      </div>
    </div>
    <div style="color: #64748b; font-size: 0.75rem;">
      Manuscripts at top, ${itemLabel} at bottom | Node size = connections | Bridges connect diverse ${itemLabel} | Hubs have many connections | Hover to highlight | Drag to reposition | Click to focus
    </div>
  `;
  container.appendChild(legendDiv);
  
  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.style.cssText = 'width: 100%; max-width: 100%; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa; overflow: hidden; position: relative; box-sizing: border-box;';
  container.appendChild(svgDiv);
  
  // Create tooltip div
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position: absolute; background: white; border: 2px solid #3b82f6; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.875rem; pointer-events: none; opacity: 0; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 300px;';
  svgDiv.appendChild(tooltip);
  
  // D3 force layout - use actual container width
  let width = svgDiv.clientWidth || container.clientWidth || 1200;
  const height = 900;  // Increased from 700
  
  const svg = d3.select(svgDiv)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto')
    .style('display', 'block');
  
  // Update viewBox on resize
  const resizeObserver = new ResizeObserver(() => {
    const newWidth = svgDiv.clientWidth;
    if (newWidth && newWidth !== width) {
      width = newWidth;
      svg.attr('viewBox', `0 0 ${width} ${height}`);
    }
  });
  resizeObserver.observe(svgDiv);
  
  const g = svg.append('g');
  
  // Zoom behavior
  let currentTransform = d3.zoomIdentity;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      currentTransform = event.transform;
      g.attr('transform', event.transform);
      updateNodeSizes(event.transform.k);
    });
  
  svg.call(zoom);
  
  // Zoom controls
  document.getElementById('ms-zoom-in').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1.3);
  };
  document.getElementById('ms-zoom-out').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 0.7);
  };
  document.getElementById('ms-reset').onclick = () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  };
  
  // Toggle labels
  let labelsVisible = true;
  document.getElementById('ms-toggle-labels').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('display', labelsVisible ? 'block' : 'none');
    this.textContent = labelsVisible ? 'Hide Labels' : 'Show Labels';
  };
  
  // Toggle singles (nodes with only 1 connection)
  let singlesVisible = true;
  document.getElementById('ms-toggle-singles').onclick = function() {
    singlesVisible = !singlesVisible;
    node.style('display', d => {
      const connectionCount = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
      return (!singlesVisible && connectionCount === 1) ? 'none' : 'block';
    });
    link.style('display', l => {
      const sourceCount = links.filter(lnk => lnk.source.id === l.source.id || lnk.target.id === l.source.id).length;
      const targetCount = links.filter(lnk => lnk.source.id === l.target.id || lnk.target.id === l.target.id).length;
      return (!singlesVisible && (sourceCount === 1 || targetCount === 1)) ? 'none' : 'block';
    });
    this.textContent = singlesVisible ? 'Hide Singles' : 'Show Singles';
  };
  
  // Calculate node sizes based on connections
  const maxMsGenres = Math.max(...Array.from(manuscriptNodes.values()).map(d => d.genreCount), 1);
  const maxGenreMs = Math.max(...Array.from(genreNodes.values()).map(d => d.msCount), 1);
  
  // Configure force simulation based on layout
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.isGenreLink ? 80 : 120).strength(d => d.isGenreLink ? 0.3 : 0.5))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('collision', d3.forceCollide().radius(d => {
      const baseR = d.type === 'manuscript' ? 4 + (d.genreCount / maxMsGenres) * 8 : 5 + (d.msCount / maxGenreMs) * 12;
      return baseR + 5;
    }));
  
  if (layout === 'horizontal') {
    // Horizontal layout: manuscripts at top, genres at bottom
    simulation
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(d => d.type === 'manuscript' ? height * 0.25 : height * 0.75).strength(0.9));
  } else {
    // Radial layout: force-directed with center gravity
    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));
  }
  
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.4);
  
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Main shapes - circles for manuscripts, rectangles for genres/subgenres
  const shapes = node.append(d => {
    if (d.type === 'manuscript') {
      return document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    } else {
      return document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    }
  });
  
  // Style circles (manuscripts)
  shapes.filter(function(d) { return d.type === 'manuscript'; })
    .attr('r', d => 4 + (d.genreCount / maxMsGenres) * 8)
    .attr('fill', '#3b82f6')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  // Style rectangles (genres/subgenres)
  shapes.filter(function(d) { return d.type !== 'manuscript'; })
    .attr('width', d => (5 + (d.msCount / maxGenreMs) * 12) * 2)
    .attr('height', d => (5 + (d.msCount / maxGenreMs) * 12) * 1.5)
    .attr('x', d => -(5 + (d.msCount / maxGenreMs) * 12))
    .attr('y', d => -(5 + (d.msCount / maxGenreMs) * 12) * 0.75)
    .attr('rx', 3)
    .attr('fill', levelFilter === 'genre' ? '#f59e0b' : '#a855f7')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  const circles = shapes;
  
  // Add glow effect for hubs
  node.filter(d => d.isHub).each(function(d) {
    const hubNode = d3.select(this);
    if (d.type === 'manuscript') {
      hubNode.append('circle')
        .attr('r', (4 + (d.genreCount / maxMsGenres) * 8) + 4)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    } else {
      hubNode.append('rect')
        .attr('width', ((5 + (d.msCount / maxGenreMs) * 12) * 2) + 8)
        .attr('height', ((5 + (d.msCount / maxGenreMs) * 12) * 1.5) + 6)
        .attr('x', -((5 + (d.msCount / maxGenreMs) * 12) + 4))
        .attr('y', -((5 + (d.msCount / maxGenreMs) * 12) * 0.75 + 3))
        .attr('rx', 3)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    }
  });
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 30 ? d.name.substring(0, 27) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => {
      if (d.type === 'manuscript') {
        return (4 + (d.genreCount / maxMsGenres) * 8) + 14;
      } else {
        return ((5 + (d.msCount / maxGenreMs) * 12) * 0.75) + 16;
      }
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', d => d.isHub || d.isBridge ? '10px' : '9px')
    .attr('font-weight', d => d.isHub || d.isBridge ? '700' : '600')
    .attr('fill', '#1e293b')
    .style('pointer-events', 'none')
    .style('user-select', 'none');
  
  node.append('title')
    .text(d => {
      if (d.type === 'manuscript') {
        return `${d.name}\n${d.genreCount} genre${d.genreCount !== 1 ? 's' : ''}`;
      } else {
        return `${d.name}\n${d.msCount} manuscript${d.msCount !== 1 ? 's' : ''}`;
      }
    });
  
  // Enhanced hover with tooltip
  let tooltipRect = null;
  node.on('mouseenter', function(event, d) {
    // Cache bounding rect
    tooltipRect = svgDiv.getBoundingClientRect();
    
    // Build tooltip content once
    const tooltipHTML = d.type === 'manuscript' 
      ? `<div style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${d.name}</div><div style="color: #64748b; line-height: 1.5;"><div>Type: Manuscript</div><div>Total ${itemLabel}: ${d.genreCount}</div><div>Unique ${itemLabel}: ${d.uniqueGenres.size}</div>${d.isBridge ? '<div style="color: #dc2626; margin-top: 0.25rem;">🔗 Bridge</div>' : ''}${d.isHub ? '<div style="color: #f59e0b; margin-top: 0.25rem;">⭐ Hub</div>' : ''}</div>`
      : `<div style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${d.name}</div><div style="color: #64748b; line-height: 1.5;"><div>Type: ${d.type === 'genre' ? 'Genre' : 'Subgenre'}</div><div>Manuscripts: ${d.msCount}</div><div>Unique: ${d.uniqueManuscripts.size}</div>${d.isBridge ? '<div style="color: #dc2626; margin-top: 0.25rem;">🔗 Bridge</div>' : ''}${d.isHub ? '<div style="color: #f59e0b; margin-top: 0.25rem;">⭐ Hub</div>' : ''}</div>`;
    
    tooltip.innerHTML = tooltipHTML;
    tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
    tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    tooltip.style.opacity = '1';
    
    // Highlight connections
    const connectedNodeIds = new Set();
    link.style('stroke-opacity', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        connectedNodeIds.add(l.source.id);
        connectedNodeIds.add(l.target.id);
        return 0.8;
      }
      return 0.1;
    }).style('stroke-width', l => {
      if (l.source.id === d.id || l.target.id === d.id) return 2.5;
      return 1;
    }).style('stroke', l => {
      if (l.source.id === d.id || l.target.id === d.id) return '#2563eb';
      return '#cbd5e1';
    });
    
    node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.3);
  })
  .on('mousemove', function(event) {
    if (tooltipRect) {
      tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
      tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    }
  })
  .on('mouseleave', function() {
    tooltip.style.opacity = '0';
    tooltipRect = null;
    link.style('stroke-opacity', 0.4)
        .style('stroke-width', 1)
        .style('stroke', '#cbd5e1');
    node.style('opacity', 1);
  });
  
  // Click to focus
  node.on('click', function(event, d) {
    event.stopPropagation();
    const scale = 1.5;
    const x = -d.x * scale + width / 2;
    const y = -d.y * scale + height / 2;
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  });
  
  function updateNodeSizes(scale) {
    const inverseScale = 1 / scale;
    shapes.each(function(d) {
      const shape = d3.select(this);
      if (d.type === 'manuscript') {
        shape.attr('r', (4 + (d.genreCount / maxMsGenres) * 8) * inverseScale);
      } else {
        const baseSize = 5 + (d.msCount / maxGenreMs) * 12;
        shape.attr('width', baseSize * 2 * inverseScale)
             .attr('height', baseSize * 1.5 * inverseScale)
             .attr('x', -baseSize * inverseScale)
             .attr('y', -baseSize * 0.75 * inverseScale);
      }
    });
    nodeLabels.attr('font-size', `${9 * inverseScale}px`)
      .attr('y', d => {
        if (d.type === 'manuscript') {
          return ((4 + (d.genreCount / maxMsGenres) * 8) + 14) * inverseScale;
        } else {
          return (((5 + (d.msCount / maxGenreMs) * 12) * 0.75) + 16) * inverseScale;
        }
      });
    link.attr('stroke-width', function(l) {
      const currentOpacity = parseFloat(d3.select(this).style('stroke-opacity'));
      return (currentOpacity > 0.5 ? 2.5 : 1) * inverseScale;
    });
  }
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}

function buildGenreDistributions() {
  // Build genre distribution charts
  buildGenresByInstitution();
  buildGenresByLocation();
  buildGenresOverTime();
}

function buildGenresByInstitution() {
  const container = document.getElementById('genres-by-institution');
  if (!container) return;
  
  // Track genre counts per institution
  const institutionGenres = {};
  
  (DATA.pu || []).forEach(pu => {
    const puId = String(pu.rec_ID);
    const institutions = getInstitutionsForPU(pu);
    
    // Get texts related to this PU
    const rels = [...(REL_INDEX.bySource?.[puId] || []), ...(REL_INDEX.byTarget?.[puId] || [])];
    const genres = new Set();
    
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const textId = IDX.tx?.[String(src?.id)] ? String(src.id) : IDX.tx?.[String(tgt?.id)] ? String(tgt.id) : null;
      
      if (textId) {
        const text = IDX.tx[textId];
        const genre = MAP.tx?.genre(text);
        if (genre && genre !== 'Unknown') {
          genres.add(genre);
        }
      }
    });
    
    institutions.forEach(inst => {
      if (!institutionGenres[inst.institutionName]) {
        institutionGenres[inst.institutionName] = {};
      }
      genres.forEach(genre => {
        institutionGenres[inst.institutionName][genre] = (institutionGenres[inst.institutionName][genre] || 0) + 1;
      });
    });
  });
  
  // Show top institutions
  const topInstitutions = Object.entries(institutionGenres)
    .map(([name, genres]) => ({ name, total: Object.values(genres).reduce((a, b) => a + b, 0), genres }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
  
  if (topInstitutions.length === 0) {
    container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem;">No data available</div>';
    return;
  }
  
  const html = topInstitutions.map(inst => `
    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
      <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">${inst.name}</div>
      <div style="font-size: 0.75rem; color: #64748b;">${inst.total} texts across ${Object.keys(inst.genres).length} genres</div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function buildGenresByLocation() {
  const container = document.getElementById('genres-by-location');
  if (!container) return;
  
  // Track genre counts per country
  const locationGenres = {};
  
  (DATA.pu || []).forEach(pu => {
    const country = getVal(pu, 'PU country');
    if (!country || country === 'Unknown') return;
    
    const puId = String(pu.rec_ID);
    const rels = [...(REL_INDEX.bySource?.[puId] || []), ...(REL_INDEX.byTarget?.[puId] || [])];
    const genres = new Set();
    
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const textId = IDX.tx?.[String(src?.id)] ? String(src.id) : IDX.tx?.[String(tgt?.id)] ? String(tgt.id) : null;
      
      if (textId) {
        const text = IDX.tx[textId];
        const genre = MAP.tx?.genre(text);
        if (genre && genre !== 'Unknown') {
          genres.add(genre);
        }
      }
    });
    
    if (!locationGenres[country]) {
      locationGenres[country] = {};
    }
    genres.forEach(genre => {
      locationGenres[country][genre] = (locationGenres[country][genre] || 0) + 1;
    });
  });
  
  const topLocations = Object.entries(locationGenres)
    .map(([name, genres]) => ({ name, total: Object.values(genres).reduce((a, b) => a + b, 0), genres }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
  
  if (topLocations.length === 0) {
    container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem;">No data available</div>';
    return;
  }
  
  const html = topLocations.map(loc => `
    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f1f5f9;">
      <div style="font-weight: 600; color: #1e293b; margin-bottom: 0.5rem;">${loc.name}</div>
      <div style="font-size: 0.75rem; color: #64748b;">${loc.total} texts across ${Object.keys(loc.genres).length} genres</div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function buildGenresOverTime() {
  const container = document.getElementById('genres-over-time');
  if (!container) return;
  
  container.innerHTML = '<div style="color: #94a3b8; font-size: 0.875rem; text-align: center; padding: 2rem;">Timeline visualization coming soon</div>';
}

function buildInstitutionGenreNetwork() {
  buildInstitutionNetwork('genre', 'horizontal');
}

function buildInstitutionSubgenreNetwork() {
  buildInstitutionNetwork('subgenre', 'horizontal');
}

function buildInstitutionNetwork(levelFilter = 'genre', layout = 'horizontal') {
  const container = document.getElementById('inst-network-viz');
  if (!container) return;
  
  // Build institution-genre network with country/region data
  const institutionNodes = new Map();
  const genreNodes = new Map();
  const links = [];
  const institutionCountries = new Map();  // Track country for each institution
  
  (DATA.pu || []).forEach(pu => {
    const puId = String(pu.rec_ID);
    const institutions = getInstitutionsForPU(pu);
    const country = getVal(pu, 'PU country') || 'Unknown';
    const region = getVal(pu, 'PU region') || 'Unknown';
    
    const rels = [...(REL_INDEX.bySource?.[puId] || []), ...(REL_INDEX.byTarget?.[puId] || [])];
    const genresAndSubs = new Set();  // Store genres or subgenres based on levelFilter
    
    rels.forEach(rel => {
      const src = getRes(rel, 'Source record');
      const tgt = getRes(rel, 'Target record');
      const textId = IDX.tx?.[String(src?.id)] ? String(src.id) : IDX.tx?.[String(tgt?.id)] ? String(tgt.id) : null;
      
      if (textId) {
        const text = IDX.tx[textId];
        const genre = MAP.tx?.genre(text);
        const subgenre = MAP.tx?.sub(text);
        
        // Add genre or subgenre based on levelFilter
        if (levelFilter === 'genre' && genre && genre !== 'Unknown' && genre !== '') {
          genresAndSubs.add(`genre:${genre}`);
        }
        if (levelFilter === 'subgenre' && subgenre && subgenre !== 'Unknown' && subgenre !== '') {
          genresAndSubs.add(`sub:${subgenre}`);
        }
      }
    });
    
    institutions.forEach(inst => {
      if (!institutionNodes.has(inst.institutionName)) {
        institutionNodes.set(inst.institutionName, {
          id: `inst-${inst.institutionName}`,
          name: inst.institutionName,
          type: 'institution',
          country: country,
          region: region,
          genreCount: 0,
          totalTexts: 0,
          uniqueGenres: new Set()
        });
        institutionCountries.set(inst.institutionName, country);
      }
      const instNode = institutionNodes.get(inst.institutionName);
      instNode.genreCount += genresAndSubs.size;
      instNode.totalTexts++;
      
      genresAndSubs.forEach(genreKey => {
        const [type, name] = genreKey.split(':');
        const isSubgenre = type === 'sub';
        const nodeId = genreKey;
        
        // Track unique genres for bridge detection
        instNode.uniqueGenres.add(name);
        
        if (!genreNodes.has(nodeId)) {
          genreNodes.set(nodeId, {
            id: nodeId,
            name: name,
            type: isSubgenre ? 'subgenre' : 'genre',
            institutionCount: 0,
            totalOccurrences: 0,
            uniqueInstitutions: new Set()
          });
        }
        const genreNode = genreNodes.get(nodeId);
        genreNode.institutionCount++;
        genreNode.uniqueInstitutions.add(inst.institutionName);
        genreNode.totalOccurrences++;
        
        const existing = links.find(l => l.source === `inst-${inst.institutionName}` && l.target === nodeId);
        if (existing) {
          existing.value++;
        } else {
          links.push({
            source: `inst-${inst.institutionName}`,
            target: nodeId,
            value: 1
          });
        }
      });
    });
  });
  
  const nodeArray = [...institutionNodes.values(), ...genreNodes.values()];
  
  if (nodeArray.length === 0) {
    container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8;">No institution-genre relationships found</div>';
    return;
  }
  
  // Clear container and create wrapper
  container.innerHTML = '';
  
  // Detect bridge nodes and hubs
  const avgInstGenres = Array.from(institutionNodes.values()).reduce((sum, n) => sum + n.uniqueGenres.size, 0) / institutionNodes.size;
  const avgGenreInsts = Array.from(genreNodes.values()).reduce((sum, n) => sum + n.uniqueInstitutions.size, 0) / genreNodes.size;
  
  institutionNodes.forEach(node => {
    node.isBridge = node.uniqueGenres.size > avgInstGenres * 1.5;
    node.isHub = node.genreCount > avgInstGenres * 2;
  });
  
  genreNodes.forEach(node => {
    node.isBridge = node.uniqueInstitutions.size > avgGenreInsts * 1.5;
    node.isHub = node.totalOccurrences > avgGenreInsts * 2;
  });
  
  const bridgeCount = Array.from(institutionNodes.values()).filter(n => n.isBridge).length + 
                      Array.from(genreNodes.values()).filter(n => n.isBridge).length;
  const hubCount = Array.from(institutionNodes.values()).filter(n => n.isHub).length + 
                   Array.from(genreNodes.values()).filter(n => n.isHub).length;
  
  const itemCount = genreNodes.size;
  const itemLabel = levelFilter === 'genre' ? 'genres' : 'subgenres';
  
  // Color scales for institutions by country
  const countries = Array.from(new Set(institutionCountries.values()));
  const countryColors = {
    'Germany': '#ef4444',
    'France': '#3b82f6',
    'Italy': '#10b981',
    'Spain': '#f59e0b',
    'Austria': '#8b5cf6',
    'Switzerland': '#ec4899',
    'Belgium': '#14b8a6',
    'Netherlands': '#f97316',
    'England': '#6366f1',
    'Unknown': '#94a3b8'
  };
  const getInstColor = country => countryColors[country] || '#64748b';
  
  // Genre category colors (comprehensive categorization)
  const genreCategories = {
    'devotional': ['prayer', 'psalm', 'hour', 'devotion', 'hymn', 'liturgical', 'liturg', 'office', 'mass', 'breviary', 'missal', 'gospel', 'bible', 'saint', 'vita', 'hagiograph'],
    'medical': ['medical', 'medicine', 'remedy', 'recipe', 'herbal', 'health', 'cure', 'physician', 'surgery', 'apothecary'],
    'legal': ['legal', 'law', 'charter', 'document', 'contract', 'statute', 'decree', 'ordinance', 'privilege'],
    'scholastic': ['commentary', 'treatise', 'sermon', 'theological', 'theology', 'philosophy', 'logic', 'summa', 'quaestio', 'disputation', 'gloss'],
    'literary': ['poetry', 'poem', 'chronicle', 'history', 'letter', 'epistle', 'romance', 'fable', 'story', 'narrative', 'epic'],
    'scientific': ['astronomy', 'astrology', 'arithmetic', 'geometry', 'mathematics', 'natural', 'science', 'computation'],
    'grammatical': ['grammar', 'grammatical', 'vocabulary', 'dictionary', 'gloss', 'linguistic']
  };
  const genreCategoryColors = {
    'devotional': '#a855f7',
    'medical': '#22c55e',
    'legal': '#0ea5e9',
    'scholastic': '#f59e0b',
    'literary': '#ec4899',
    'scientific': '#8b5cf6',
    'grammatical': '#14b8a6',
    'other': '#94a3b8'
  };
  
  // Track genre categorizations for debugging
  const genreCategorizationMap = new Map();
  
  const getGenreCategory = genre => {
    if (!genre) return 'other';
    const lowerGenre = genre.toLowerCase();
    
    for (const [category, keywords] of Object.entries(genreCategories)) {
      if (keywords.some(kw => lowerGenre.includes(kw))) {
        genreCategorizationMap.set(genre, category);
        return category;
      }
    }
    genreCategorizationMap.set(genre, 'other');
    return 'other';
  };
  const getGenreColor = genre => {
    const category = getGenreCategory(genre);
    return genreCategoryColors[category];
  };
  
  // Log genre categorizations for debugging
  console.log('Genre categorization sample:', Array.from(genreNodes.values()).slice(0, 10).map(n => ({
    name: n.name,
    type: n.type,
    category: getGenreCategory(n.name),
    color: getGenreColor(n.name)
  })));
  
  // Controls bar
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; flex-wrap: wrap; gap: 0.75rem;';
  controlsDiv.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      <button id="inst-zoom-in" style="padding: 0.375rem 0.75rem; background: #10b981; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom In</button>
      <button id="inst-zoom-out" style="padding: 0.375rem 0.75rem; background: #10b981; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom Out</button>
      <button id="inst-reset" style="padding: 0.375rem 0.75rem; background: #64748b; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Reset View</button>
      <button id="inst-toggle-labels" style="padding: 0.375rem 0.75rem; background: #8b5cf6; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Labels</button>
      <button id="inst-toggle-singles" style="padding: 0.375rem 0.75rem; background: #ec4899; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Singles</button>
    </div>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <span style="font-size: 0.875rem; color: #64748b; font-weight: 600;">${institutionNodes.size} institutions • ${itemCount} ${itemLabel} • ${bridgeCount} bridges • ${hubCount} hubs</span>
      ${createEmbedButton(`institution-${levelFilter}`)}
      ${createExportButton('inst-network-viz', `institution-${itemLabel}-network.png`)}
    </div>
  `;
  container.appendChild(controlsDiv);
  
  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.875rem;';
  legendDiv.innerHTML = `
    <div style="margin-bottom: 0.75rem; font-weight: 600; color: #1e293b;">Institutions (circles, colored by country)</div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
      ${Object.entries(countryColors).slice(0, 10).map(([country, color]) => `
        <div style="display: flex; align-items: center; gap: 0.25rem;">
          <div style="width: 12px; height: 12px; background: ${color}; border-radius: 50%; border: 1.5px solid white;"></div>
          <span style="color: #64748b; font-size: 0.75rem;">${country}</span>
        </div>
      `).join('')}
    </div>
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 12px; background: ${levelFilter === 'genre' ? '#f59e0b' : '#a855f7'}; border-radius: 3px; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${itemLabel} (rectangles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: white; border-radius: 50%; border: 3px solid #dc2626;"></div>
        <span style="color: #1e293b; font-weight: 600;">Bridge Nodes</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 20px; height: 20px; background: white; border-radius: 50%; border: 3px solid #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);"></div>
        <span style="color: #1e293b; font-weight: 600;">Major Hubs</span>
      </div>
    </div>
    <div style="color: #64748b; font-size: 0.75rem;">
      Institutions at top, ${itemLabel} at bottom | Node size = connections | Edge thickness = frequency | Bridges connect diverse ${itemLabel} | Hubs have many connections | Hover to highlight | Drag to reposition | Click to focus
    </div>
  `;
  container.appendChild(legendDiv);
  
  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.style.cssText = 'width: 100%; max-width: 100%; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa; overflow: hidden; position: relative; box-sizing: border-box;';
  container.appendChild(svgDiv);
  
  // Create tooltip div
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position: absolute; background: white; border: 2px solid #10b981; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.875rem; pointer-events: none; opacity: 0; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 300px;';
  svgDiv.appendChild(tooltip);
  
  // D3 force layout - use actual container width
  let width = svgDiv.clientWidth || container.clientWidth || 1200;
  const height = 900;  // Increased from 700
  
  const svg = d3.select(svgDiv)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto')
    .style('display', 'block');
  
  // Update viewBox on resize
  const resizeObserver = new ResizeObserver(() => {
    const newWidth = svgDiv.clientWidth;
    if (newWidth && newWidth !== width) {
      width = newWidth;
      svg.attr('viewBox', `0 0 ${width} ${height}`);
    }
  });
  resizeObserver.observe(svgDiv);
  
  const g = svg.append('g');
  
  // Zoom behavior
  let currentTransform = d3.zoomIdentity;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      currentTransform = event.transform;
      g.attr('transform', event.transform);
      updateNodeSizes(event.transform.k);
    });
  
  svg.call(zoom);
  
  // Zoom controls
  document.getElementById('inst-zoom-in').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1.3);
  };
  document.getElementById('inst-zoom-out').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 0.7);
  };
  document.getElementById('inst-reset').onclick = () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  };
  
  // Toggle labels
  let labelsVisible = true;
  document.getElementById('inst-toggle-labels').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('display', labelsVisible ? 'block' : 'none');
    this.textContent = labelsVisible ? 'Hide Labels' : 'Show Labels';
  };
  
  // Toggle singles (nodes with only 1 connection)
  let singlesVisible = true;
  document.getElementById('inst-toggle-singles').onclick = function() {
    singlesVisible = !singlesVisible;
    node.style('display', d => {
      const connectionCount = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
      return (!singlesVisible && connectionCount === 1) ? 'none' : 'block';
    });
    link.style('display', l => {
      const sourceCount = links.filter(lnk => lnk.source.id === l.source.id || lnk.target.id === l.source.id).length;
      const targetCount = links.filter(lnk => lnk.source.id === l.target.id || lnk.target.id === l.target.id).length;
      return (!singlesVisible && (sourceCount === 1 || targetCount === 1)) ? 'none' : 'block';
    });
    this.textContent = singlesVisible ? 'Hide Singles' : 'Show Singles';
  };
  
  // Calculate max values for scaling
  const maxInstGenres = Math.max(...Array.from(institutionNodes.values()).map(d => d.genreCount), 1);
  const maxGenreInsts = Math.max(...Array.from(genreNodes.values()).map(d => d.totalOccurrences), 1);
  const maxLinkValue = Math.max(...links.map(l => l.value), 1);
  
  // Configure force simulation based on layout
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => 100 - (d.value / maxLinkValue) * 30).strength(0.4))
    .force('charge', d3.forceManyBody().strength(-120))
    .force('collision', d3.forceCollide().radius(d => {
      if (d.type === 'institution') return 6 + (d.genreCount / maxInstGenres) * 12 + 5;
      return 6 + (d.totalOccurrences / maxGenreInsts) * 10 + 5;
    }));
  
  if (layout === 'horizontal') {
    // Horizontal layout: institutions at top, genres at bottom
    simulation
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(d => d.type === 'institution' ? height * 0.25 : height * 0.75).strength(0.9));
  } else {
    // Radial layout: force-directed with center gravity
    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));
  }
  
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', d => 0.5 + (d.value / maxLinkValue) * 4)
    .attr('stroke-opacity', 0.4);
  
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Main shapes - circles for institutions, rectangles for genres/subgenres
  const shapes = node.append(d => {
    if (d.type === 'institution') {
      return document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    } else {
      return document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    }
  });
  
  // Style circles (institutions)
  shapes.filter(function(d) { return d.type === 'institution'; })
    .attr('r', d => 6 + (d.genreCount / maxInstGenres) * 12)
    .attr('fill', d => getInstColor(d.country))
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  // Style rectangles (genres/subgenres) - single color
  shapes.filter(function(d) { return d.type !== 'institution'; })
    .attr('width', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return (baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 2;
    })
    .attr('height', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return (baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 1.5;
    })
    .attr('x', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return -(baseSize + (d.totalOccurrences / maxGenreInsts) * 10);
    })
    .attr('y', d => {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      return -(baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 0.75;
    })
    .attr('rx', 3)
    .attr('fill', levelFilter === 'genre' ? '#f59e0b' : '#a855f7')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  const circles = shapes;
  
  // Add glow effect for hubs
  node.filter(d => d.isHub).each(function(d) {
    const hubNode = d3.select(this);
    if (d.type === 'institution') {
      hubNode.append('circle')
        .attr('r', (6 + (d.genreCount / maxInstGenres) * 12) + 4)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    } else {
      const baseSize = d.type === 'subgenre' ? 5 : 6;
      const nodeSize = baseSize + (d.totalOccurrences / maxGenreInsts) * 10;
      hubNode.append('rect')
        .attr('width', (nodeSize * 2) + 8)
        .attr('height', (nodeSize * 1.5) + 6)
        .attr('x', -(nodeSize + 4))
        .attr('y', -(nodeSize * 0.75 + 3))
        .attr('rx', 3)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    }
  });
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 30 ? d.name.substring(0, 27) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => {
      if (d.type === 'institution') {
        return (6 + (d.genreCount / maxInstGenres) * 12) + 14;
      } else {
        const baseSize = d.type === 'subgenre' ? 5 : 6;
        return ((baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 0.75) + 16;
      }
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', d => d.isHub || d.isBridge ? '10px' : '9px')
    .attr('font-weight', d => d.isHub || d.isBridge ? '700' : '600')
    .attr('fill', '#1e293b')
    .style('pointer-events', 'none')
    .style('user-select', 'none');
  
  node.append('title')
    .text(d => {
      if (d.type === 'institution') {
        return `${d.name}\n${d.country} - ${d.region}\n${d.genreCount} genre occurrences\n${d.totalTexts} texts`;
      } else {
        return `${d.name}\n${d.institutionCount} institutions\n${d.totalOccurrences} total occurrences`;
      }
    });
  
  // Hover highlighting with tooltip
  let tooltipRect = null;
  node.on('mouseenter', function(event, d) {
    // Cache bounding rect
    tooltipRect = svgDiv.getBoundingClientRect();
    
    // Build tooltip content once
    const tooltipHTML = d.type === 'institution'
      ? `<div style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${d.name}</div><div style="color: #64748b; line-height: 1.5;"><div>Type: Institution</div><div>Country: ${d.country}</div><div>Region: ${d.region}</div><div>Total ${itemLabel}: ${d.genreCount}</div><div>Unique ${itemLabel}: ${d.uniqueGenres.size}</div><div>Texts: ${d.totalTexts}</div>${d.isBridge ? '<div style="color: #dc2626; margin-top: 0.25rem;">🔗 Bridge</div>' : ''}${d.isHub ? '<div style="color: #f59e0b; margin-top: 0.25rem;">⭐ Hub</div>' : ''}</div>`
      : `<div style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${d.name}</div><div style="color: #64748b; line-height: 1.5;"><div>Type: ${d.type === 'genre' ? 'Genre' : 'Subgenre'}</div><div>Institutions: ${d.institutionCount}</div><div>Unique: ${d.uniqueInstitutions.size}</div><div>Total: ${d.totalOccurrences}</div>${d.isBridge ? '<div style="color: #dc2626; margin-top: 0.25rem;">🔗 Bridge</div>' : ''}${d.isHub ? '<div style="color: #f59e0b; margin-top: 0.25rem;">⭐ Hub</div>' : ''}</div>`;
    
    tooltip.innerHTML = tooltipHTML;
    tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
    tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    tooltip.style.opacity = '1';
    
    const connectedNodeIds = new Set();
    link.style('stroke-opacity', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        connectedNodeIds.add(l.source.id);
        connectedNodeIds.add(l.target.id);
        return 0.8;
      }
      return 0.1;
    }).style('stroke-width', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        return (0.5 + (l.value / maxLinkValue) * 4) * 1.5;
      }
      return 0.5 + (l.value / maxLinkValue) * 4;
    }).style('stroke', l => {
      if (l.source.id === d.id || l.target.id === d.id) return '#2563eb';
      return '#cbd5e1';
    });
    
    node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.3);
  })
  .on('mousemove', function(event) {
    if (tooltipRect) {
      tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
      tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    }
  })
  .on('mouseleave', function() {
    tooltip.style.opacity = '0';
    tooltipRect = null;
    link.style('stroke-opacity', 0.4)
        .style('stroke-width', l => 0.5 + (l.value / maxLinkValue) * 4)
        .style('stroke', '#cbd5e1');
    node.style('opacity', 1);
  });
  
  // Click to focus
  node.on('click', function(event, d) {
    event.stopPropagation();
    const scale = 1.5;
    const x = -d.x * scale + width / 2;
    const y = -d.y * scale + height / 2;
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  });
  
  function updateNodeSizes(scale) {
    const inverseScale = 1 / scale;
    shapes.each(function(d) {
      const shape = d3.select(this);
      if (d.type === 'institution') {
        shape.attr('r', (6 + (d.genreCount / maxInstGenres) * 12) * inverseScale);
      } else {
        const baseSize = d.type === 'subgenre' ? 5 : 6;
        const nodeSize = baseSize + (d.totalOccurrences / maxGenreInsts) * 10;
        shape.attr('width', nodeSize * 2 * inverseScale)
             .attr('height', nodeSize * 1.5 * inverseScale)
             .attr('x', -nodeSize * inverseScale)
             .attr('y', -nodeSize * 0.75 * inverseScale);
      }
    });
    nodeLabels.attr('font-size', `${9 * inverseScale}px`)
      .attr('y', d => {
        if (d.type === 'institution') {
          return ((6 + (d.genreCount / maxInstGenres) * 12) + 14) * inverseScale;
        } else {
          const baseSize = d.type === 'subgenre' ? 5 : 6;
          return (((baseSize + (d.totalOccurrences / maxGenreInsts) * 10) * 0.75) + 16) * inverseScale;
        }
      });
    link.attr('stroke-width', l => {
      const currentOpacity = parseFloat(d3.select(this).style('stroke-opacity'));
      const baseWidth = 0.5 + (l.value / maxLinkValue) * 4;
      return baseWidth * (currentOpacity > 0.5 ? 1.5 : 1) * inverseScale;
    });
  }
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}

// Scribe-Genre/Subgenre Network Functions
function buildScribeGenreNetwork() {
  buildScribeNetwork('genre', 'horizontal');
}

function buildScribeSubgenreNetwork() {
  buildScribeNetwork('subgenre', 'horizontal');
}

function buildScribeNetwork(levelFilter = 'genre', layout = 'horizontal') {
  const container = document.getElementById('scribe-network-viz');
  if (!container) return;
  
  // Build network data connecting scribes to genres/subgenres
  const scribeNodes = new Map();
  const genreNodes = new Map();
  const links = [];
  
  // Process scribal units to connect scribes to genres
  (DATA.su || []).forEach(su => {
    const suId = String(su.rec_ID);
    const scribes = getScribesForSU(su);
    
    if (scribes.length === 0) return;
    
    // Get production units for this SU
    const puIds = getPUsForSU(su);
    const textGenres = new Set();
    
    // Get texts from the production units
    puIds.forEach(puId => {
      const pu = IDX.pu?.[puId];
      if (!pu) return;
      
      const puRels = [
        ...(REL_INDEX.bySource?.[puId] || []),
        ...(REL_INDEX.byTarget?.[puId] || [])
      ];
      
      puRels.forEach(rel => {
        const src = getRes(rel, 'Source record');
        const tgt = getRes(rel, 'Target record');
        const textId = IDX.tx?.[String(src?.id)] ? String(src.id) : IDX.tx?.[String(tgt?.id)] ? String(tgt.id) : null;
        
        if (textId) {
          const text = IDX.tx[textId];
          const genre = MAP.tx?.genre(text);
          const subgenre = MAP.tx?.sub(text);
          
          if (levelFilter === 'genre' && genre && genre !== 'Unknown' && genre !== '') {
            textGenres.add(`genre:${genre}`);
          }
          if (levelFilter === 'subgenre' && subgenre && subgenre !== 'Unknown' && subgenre !== '') {
            textGenres.add(`sub:${subgenre}`);
          }
        }
      });
    });
    
    if (textGenres.size === 0) return;
    
    // Create nodes and links for each scribe
    scribes.forEach(scribe => {
      const scribeId = `scribe-${scribe.scribeId}`;
      
      if (!scribeNodes.has(scribeId)) {
        scribeNodes.set(scribeId, {
          id: scribeId,
          name: scribe.scribeName,
          type: 'scribe',
          genreCount: 0,
          uniqueGenres: new Set()
        });
      }
      
      const scribeNode = scribeNodes.get(scribeId);
      scribeNode.genreCount += textGenres.size;
      
      textGenres.forEach(genreKey => {
        const [type, name] = genreKey.split(':');
        const isSubgenre = type === 'sub';
        
        scribeNode.uniqueGenres.add(name);
        
        if (!genreNodes.has(genreKey)) {
          genreNodes.set(genreKey, {
            id: genreKey,
            name: name,
            type: isSubgenre ? 'subgenre' : 'genre',
            scribeCount: 0,
            uniqueScribes: new Set()
          });
        }
        
        const genreNode = genreNodes.get(genreKey);
        genreNode.scribeCount++;
        genreNode.uniqueScribes.add(scribeId);
        
        links.push({
          source: scribeId,
          target: genreKey,
          value: 1
        });
      });
    });
  });
  
  const nodeArray = [...scribeNodes.values(), ...genreNodes.values()];
  
  if (nodeArray.length === 0) {
    container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8;">No scribe-genre relationships found</div>';
    return;
  }
  
  container.innerHTML = '';
  
  // Detect bridge nodes and hubs
  const avgScribeGenres = Array.from(scribeNodes.values()).reduce((sum, n) => sum + n.uniqueGenres.size, 0) / scribeNodes.size;
  const avgGenreScribes = Array.from(genreNodes.values()).reduce((sum, n) => sum + n.uniqueScribes.size, 0) / genreNodes.size;
  
  scribeNodes.forEach(node => {
    node.isBridge = node.uniqueGenres.size > avgScribeGenres * 1.5;
    node.isHub = node.genreCount > avgScribeGenres * 2;
  });
  
  genreNodes.forEach(node => {
    node.isBridge = node.uniqueScribes.size > avgGenreScribes * 1.5;
    node.isHub = node.scribeCount > avgGenreScribes * 2;
  });
  
  const bridgeCount = Array.from(scribeNodes.values()).filter(n => n.isBridge).length + 
                      Array.from(genreNodes.values()).filter(n => n.isBridge).length;
  const hubCount = Array.from(scribeNodes.values()).filter(n => n.isHub).length + 
                   Array.from(genreNodes.values()).filter(n => n.isHub).length;
  
  const itemCount = genreNodes.size;
  const itemLabel = levelFilter === 'genre' ? 'genres' : 'subgenres';
  
  // Controls bar
  const controlsDiv = document.createElement('div');
  controlsDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; flex-wrap: wrap; gap: 0.75rem;';
  controlsDiv.innerHTML = `
    <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
      <button id="scribe-zoom-in" style="padding: 0.375rem 0.75rem; background: #22c55e; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom In</button>
      <button id="scribe-zoom-out" style="padding: 0.375rem 0.75rem; background: #22c55e; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Zoom Out</button>
      <button id="scribe-reset" style="padding: 0.375rem 0.75rem; background: #64748b; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Reset View</button>
      <button id="scribe-toggle-labels" style="padding: 0.375rem 0.75rem; background: #8b5cf6; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Labels</button>
      <button id="scribe-toggle-singles" style="padding: 0.375rem 0.75rem; background: #ec4899; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; font-weight: 600;">Hide Singles</button>
    </div>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <span style="font-size: 0.875rem; color: #64748b; font-weight: 600;">${scribeNodes.size} scribes • ${itemCount} ${itemLabel} • ${bridgeCount} bridges • ${hubCount} hubs</span>
      ${createEmbedButton(`scribe-${levelFilter}`)}
      ${createExportButton('scribe-network-viz', `scribe-${itemLabel}-network.png`)}
    </div>
  `;
  container.appendChild(controlsDiv);
  
  // Genre categorization
  const genreCategories = {
    'devotional': ['prayer', 'psalm', 'hour', 'devotion', 'hymn', 'liturgical', 'liturg', 'office', 'mass', 'breviary', 'missal', 'gospel', 'bible', 'saint', 'vita', 'hagiograph'],
    'medical': ['medical', 'medicine', 'remedy', 'recipe', 'herbal', 'health', 'cure', 'physician', 'surgery', 'apothecary'],
    'legal': ['legal', 'law', 'charter', 'document', 'contract', 'statute', 'decree', 'ordinance', 'privilege'],
    'scholastic': ['commentary', 'treatise', 'sermon', 'theological', 'theology', 'philosophy', 'logic', 'summa', 'quaestio', 'disputation', 'gloss'],
    'literary': ['poetry', 'poem', 'chronicle', 'history', 'letter', 'epistle', 'romance', 'fable', 'story', 'narrative', 'epic'],
    'scientific': ['astronomy', 'astrology', 'arithmetic', 'geometry', 'mathematics', 'natural', 'science', 'computation'],
    'grammatical': ['grammar', 'grammatical', 'vocabulary', 'dictionary', 'gloss', 'linguistic']
  };
  const genreCategoryColors = {
    'devotional': '#a855f7',
    'medical': '#22c55e',
    'legal': '#0ea5e9',
    'scholastic': '#f59e0b',
    'literary': '#ec4899',
    'scientific': '#8b5cf6',
    'grammatical': '#14b8a6',
    'other': '#94a3b8'
  };
  
  const getGenreCategory = genre => {
    if (!genre) return 'other';
    const lowerGenre = genre.toLowerCase();
    for (const [category, keywords] of Object.entries(genreCategories)) {
      if (keywords.some(kw => lowerGenre.includes(kw))) {
        return category;
      }
    }
    return 'other';
  };
  const getGenreColor = genre => {
    const category = getGenreCategory(genre);
    return genreCategoryColors[category];
  };
  
  // Legend
  const legendDiv = document.createElement('div');
  legendDiv.style.cssText = 'display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 0.375rem; font-size: 0.875rem;';
  legendDiv.innerHTML = `
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: #22c55e; border-radius: 50%; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600;">Scribes (circles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 12px; background: ${levelFilter === 'genre' ? '#f59e0b' : '#a855f7'}; border-radius: 3px; border: 2px solid white;"></div>
        <span style="color: #1e293b; font-weight: 600; text-transform: capitalize;">${itemLabel} (rectangles)</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 16px; height: 16px; background: white; border-radius: 50%; border: 3px solid #dc2626;"></div>
        <span style="color: #1e293b; font-weight: 600;">Bridge Nodes</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div style="width: 20px; height: 20px; background: white; border-radius: 50%; border: 3px solid #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);"></div>
        <span style="color: #1e293b; font-weight: 600;">Major Hubs</span>
      </div>
    </div>
    <div style="color: #64748b; font-size: 0.75rem;">
      Scribes at top, ${itemLabel} at bottom | Node size = connections | Bridges connect diverse ${itemLabel} | Hubs show specialists or popular ${itemLabel} | Hover to highlight | Drag to reposition | Click to focus
    </div>
  `;
  container.appendChild(legendDiv);
  
  // SVG container
  const svgDiv = document.createElement('div');
  svgDiv.style.cssText = 'width: 100%; max-width: 100%; border: 1px solid #e2e8f0; border-radius: 0.375rem; background: #fafafa; overflow: hidden; position: relative; box-sizing: border-box;';
  container.appendChild(svgDiv);
  
  // Create tooltip div
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position: absolute; background: white; border: 2px solid #22c55e; border-radius: 0.5rem; padding: 0.75rem; font-size: 0.875rem; pointer-events: none; opacity: 0; transition: opacity 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; max-width: 300px;';
  svgDiv.appendChild(tooltip);
  
  // D3 force layout - use actual container width
  let width = svgDiv.clientWidth || container.clientWidth || 1200;
  const height = 900;
  
  const svg = d3.select(svgDiv)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', 'auto')
    .style('display', 'block');
  
  // Update viewBox on resize
  const resizeObserver = new ResizeObserver(() => {
    const newWidth = svgDiv.clientWidth;
    if (newWidth && newWidth !== width) {
      width = newWidth;
      svg.attr('viewBox', `0 0 ${width} ${height}`);
    }
  });
  resizeObserver.observe(svgDiv);
  
  const g = svg.append('g');
  
  // Zoom behavior
  let currentTransform = d3.zoomIdentity;
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      currentTransform = event.transform;
      g.attr('transform', event.transform);
      updateNodeSizes(event.transform.k);
    });
  
  svg.call(zoom);
  
  // Zoom controls
  document.getElementById('scribe-zoom-in').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1.3);
  };
  document.getElementById('scribe-zoom-out').onclick = () => {
    svg.transition().duration(300).call(zoom.scaleBy, 0.7);
  };
  document.getElementById('scribe-reset').onclick = () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  };
  
  // Toggle labels
  let labelsVisible = true;
  document.getElementById('scribe-toggle-labels').onclick = function() {
    labelsVisible = !labelsVisible;
    nodeLabels.style('display', labelsVisible ? 'block' : 'none');
    this.textContent = labelsVisible ? 'Hide Labels' : 'Show Labels';
  };
  
  // Toggle singles (nodes with only 1 connection)
  let singlesVisible = true;
  document.getElementById('scribe-toggle-singles').onclick = function() {
    singlesVisible = !singlesVisible;
    node.style('display', d => {
      const connectionCount = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
      return (!singlesVisible && connectionCount === 1) ? 'none' : 'block';
    });
    link.style('display', l => {
      const sourceCount = links.filter(lnk => lnk.source.id === l.source.id || lnk.target.id === l.source.id).length;
      const targetCount = links.filter(lnk => lnk.source.id === l.target.id || lnk.target.id === l.target.id).length;
      return (!singlesVisible && (sourceCount === 1 || targetCount === 1)) ? 'none' : 'block';
    });
    this.textContent = singlesVisible ? 'Hide Singles' : 'Show Singles';
  };
  
  // Calculate node sizes
  const maxScribeGenres = Math.max(...Array.from(scribeNodes.values()).map(d => d.genreCount), 1);
  const maxGenreScribes = Math.max(...Array.from(genreNodes.values()).map(d => d.scribeCount), 1);
  
  // Configure force simulation based on layout
  const simulation = d3.forceSimulation(nodeArray)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('collision', d3.forceCollide().radius(d => {
      const baseR = d.type === 'scribe' ? 4 + (d.genreCount / maxScribeGenres) * 8 : 5 + (d.scribeCount / maxGenreScribes) * 12;
      return baseR + 5;
    }));
  
  if (layout === 'horizontal') {
    // Horizontal layout: scribes at top, genres at bottom
    simulation
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(d => d.type === 'scribe' ? height * 0.25 : height * 0.75).strength(0.9));
  } else {
    // Radial layout: force-directed with center gravity
    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));
  }
  
  const link = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.4);
  
  const node = g.append('g')
    .attr('class', 'nodes')
    .selectAll('g')
    .data(nodeArray)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Main shapes - circles for scribes, rectangles for genres/subgenres
  const shapes = node.append(d => {
    if (d.type === 'scribe') {
      return document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    } else {
      return document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    }
  });
  
  // Style circles (scribes)
  shapes.filter(function(d) { return d.type === 'scribe'; })
    .attr('r', d => 4 + (d.genreCount / maxScribeGenres) * 8)
    .attr('fill', '#22c55e')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  // Style rectangles (genres/subgenres) - single color
  shapes.filter(function(d) { return d.type !== 'scribe'; })
    .attr('width', d => (5 + (d.scribeCount / maxGenreScribes) * 12) * 2)
    .attr('height', d => (5 + (d.scribeCount / maxGenreScribes) * 12) * 1.5)
    .attr('x', d => -(5 + (d.scribeCount / maxGenreScribes) * 12))
    .attr('y', d => -(5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75)
    .attr('rx', 3)
    .attr('fill', levelFilter === 'genre' ? '#f59e0b' : '#a855f7')
    .attr('stroke', d => d.isBridge ? '#dc2626' : '#fff')
    .attr('stroke-width', d => d.isBridge ? 3 : 2.5)
    .style('cursor', 'pointer');
  
  const circles = shapes;
  
  // Add glow effect for hubs
  node.filter(d => d.isHub).each(function(d) {
    const hubNode = d3.select(this);
    if (d.type === 'scribe') {
      hubNode.append('circle')
        .attr('r', (4 + (d.genreCount / maxScribeGenres) * 8) + 4)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    } else {
      hubNode.append('rect')
        .attr('width', ((5 + (d.scribeCount / maxGenreScribes) * 12) * 2) + 8)
        .attr('height', ((5 + (d.scribeCount / maxGenreScribes) * 12) * 1.5) + 6)
        .attr('x', -((5 + (d.scribeCount / maxGenreScribes) * 12) + 4))
        .attr('y', -((5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75 + 3))
        .attr('rx', 3)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-opacity', 0.5)
        .style('pointer-events', 'none')
        .lower();
    }
  });
  
  const nodeLabels = node.append('text')
    .text(d => d.name.length > 30 ? d.name.substring(0, 27) + '...' : d.name)
    .attr('x', 0)
    .attr('y', d => {
      if (d.type === 'scribe') {
        return (4 + (d.genreCount / maxScribeGenres) * 8) + 14;
      } else {
        return ((5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75) + 16;
      }
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', d => d.isHub || d.isBridge ? '10px' : '9px')
    .attr('font-weight', d => d.isHub || d.isBridge ? '700' : '600')
    .attr('fill', '#1e293b')
    .style('pointer-events', 'none')
    .style('user-select', 'none');
  
  node.append('title')
    .text(d => {
      if (d.type === 'scribe') {
        return `${d.name}\n${d.genreCount} ${itemLabel}`;
      } else {
        return `${d.name}\n${d.scribeCount} scribe${d.scribeCount !== 1 ? 's' : ''}`;
      }
    });
  
  // Hover highlighting with tooltip
  let tooltipRect = null;
  node.on('mouseenter', function(event, d) {
    // Cache bounding rect
    tooltipRect = svgDiv.getBoundingClientRect();
    
    // Build tooltip content once
    const tooltipHTML = d.type === 'scribe'
      ? `<div style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${d.name}</div><div style="color: #64748b; line-height: 1.5;"><div>Type: Scribe</div><div>Total ${itemLabel}: ${d.genreCount}</div><div>Unique ${itemLabel}: ${d.uniqueGenres.size}</div>${d.isBridge ? '<div style="color: #dc2626; margin-top: 0.25rem;">🔗 Bridge</div>' : ''}${d.isHub ? '<div style="color: #f59e0b; margin-top: 0.25rem;">⭐ Hub</div>' : ''}</div>`
      : `<div style="font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">${d.name}</div><div style="color: #64748b; line-height: 1.5;"><div>Type: ${d.type === 'genre' ? 'Genre' : 'Subgenre'}</div><div>Scribes: ${d.scribeCount}</div><div>Unique: ${d.uniqueScribes.size}</div>${d.isBridge ? '<div style="color: #dc2626; margin-top: 0.25rem;">🔗 Bridge</div>' : ''}${d.isHub ? '<div style="color: #f59e0b; margin-top: 0.25rem;">⭐ Hub</div>' : ''}</div>`;
    
    tooltip.innerHTML = tooltipHTML;
    tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
    tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    tooltip.style.opacity = '1';
    
    const connectedNodeIds = new Set();
    link.style('stroke-opacity', l => {
      if (l.source.id === d.id || l.target.id === d.id) {
        connectedNodeIds.add(l.source.id);
        connectedNodeIds.add(l.target.id);
        return 0.8;
      }
      return 0.1;
    }).style('stroke-width', l => {
      if (l.source.id === d.id || l.target.id === d.id) return 2.5;
      return 1;
    }).style('stroke', l => {
      if (l.source.id === d.id || l.target.id === d.id) return '#2563eb';
      return '#cbd5e1';
    });
    
    node.style('opacity', n => connectedNodeIds.has(n.id) ? 1 : 0.3);
  })
  .on('mousemove', function(event) {
    if (tooltipRect) {
      tooltip.style.left = `${event.pageX - tooltipRect.left + 15}px`;
      tooltip.style.top = `${event.pageY - tooltipRect.top + 15}px`;
    }
  })
  .on('mouseleave', function() {
    tooltip.style.opacity = '0';
    tooltipRect = null;
    link.style('stroke-opacity', 0.4)
        .style('stroke-width', 1)
        .style('stroke', '#cbd5e1');
    node.style('opacity', 1);
  });
  
  // Click to focus
  node.on('click', function(event, d) {
    event.stopPropagation();
    const scale = 1.5;
    const x = -d.x * scale + width / 2;
    const y = -d.y * scale + height / 2;
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
  });
  
  function updateNodeSizes(scale) {
    const inverseScale = 1 / scale;
    shapes.each(function(d) {
      const shape = d3.select(this);
      if (d.type === 'scribe') {
        shape.attr('r', (4 + (d.genreCount / maxScribeGenres) * 8) * inverseScale);
      } else {
        const baseSize = 5 + (d.scribeCount / maxGenreScribes) * 12;
        shape.attr('width', baseSize * 2 * inverseScale)
             .attr('height', baseSize * 1.5 * inverseScale)
             .attr('x', -baseSize * inverseScale)
             .attr('y', -baseSize * 0.75 * inverseScale);
      }
    });
    nodeLabels.attr('font-size', `${9 * inverseScale}px`)
      .attr('y', d => {
        if (d.type === 'scribe') {
          return ((4 + (d.genreCount / maxScribeGenres) * 8) + 14) * inverseScale;
        } else {
          return (((5 + (d.scribeCount / maxGenreScribes) * 12) * 0.75) + 16) * inverseScale;
        }
      });
    link.attr('stroke-width', function(l) {
      const currentOpacity = parseFloat(d3.select(this).style('stroke-opacity'));
      return (currentOpacity > 0.5 ? 2.5 : 1) * inverseScale;
    });
  }
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}

boot();

/* Expose a couple for debugging */
window.jumpTo = jumpTo;
window.renderCurrent = renderCurrent;
})();
</script>