---
layout: page
permalink: /explore-database/
show_title: false
---

<div class="explore-fullwidth">
  <h1 class="mb-3" style="text-align:center;">Explore the Database</h1>

  <!-- Main Navigation Tabs -->
  <div class="main-nav-tabs" id="main-nav-tabs" aria-label="Main Navigation">
    <button class="main-nav-btn is-on" data-mode="browse">🔍 Browse & Search</button>
    <button class="main-nav-btn" data-mode="map">🗺️ Map</button>
    <button class="main-nav-btn" data-mode="timeline">📈 Timeline</button>
    <button class="main-nav-btn" data-mode="network">🔗 Network</button>
    <button class="main-nav-btn" data-mode="analytics">📊 Analytics</button>
    <button class="main-nav-btn" data-mode="multilingualism">🌍 Multilingualism</button>
    <button class="main-nav-btn" data-mode="colophon-analysis">📜 Colophon Analysis</button>
  </div>

  <div class="db-shell">
    <!-- BROWSE MODE -->
    <div id="mode-browse" class="mode-container" aria-hidden="false">
      <!-- FACETS (left) -->
      <aside class="db-facets" aria-label="Filters">
        <div class="entity-switcher">
          <div class="entity-switcher-title">Record type</div>
          <div class="entity-switcher-list" id="entity-switch">
            <button class="entity-btn is-on" data-entity="su">Scribal Units</button>
            <button class="entity-btn" data-entity="ms">Manuscripts</button>
            <button class="entity-btn" data-entity="pu">Production Units</button>
            <button class="entity-btn" data-entity="hi">Holding Institutions</button>
            <button class="entity-btn" data-entity="mi">Monastic Institutions</button>
            <button class="entity-btn" data-entity="hp">Historical People</button>
            <button class="entity-btn" data-entity="tx">Texts</button>
          </div>
        </div>

        <div id="facet-mount"></div>
      </aside>

      <!-- MAIN (center) -->
      <section class="db-main">
        <!-- Controls -->
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

        <!-- Results list -->
        <div id="pane-results" class="db-results-wrap">
          <div id="db-status" class="db-status" role="status" aria-live="polite"></div>
          <div id="db-results" class="db-grid"></div>
          <div id="db-pager" class="db-pager" hidden>
            <button id="db-prev" disabled>Previous</button>
            <span id="db-page">Page 1 / 1</span>
            <button id="db-next" disabled>Next</button>
          </div>
        </div>
      </section>

      <!-- DETAILS (right) -->
      <aside id="db-viz" class="db-viz">
        <div id="details-wrap"></div>
      </aside>
    </div>

    <!-- MAP MODE -->
    <div id="mode-map" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span id="map-title">🗺️ Map Visualization</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Exploring all entities across space</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Map view selector -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 500; font-size: 0.875rem;">
              Map View:
              <select id="map-view-selector" style="flex: 1; padding: 0.25rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; background: white;">
                <option value="ms-current">Manuscripts - Current Location (Holdings)</option>
                <option value="ms-production">Manuscripts - Production Location</option>
                <option value="pu-location">Production Units - All Locations</option>
                <option value="pu-monastery">Production Units - By Monastery</option>
                <option value="mi-all">Monastic Institutions</option>
                <option value="scribes-female">Female Scribes - Work Locations</option>
                <option value="scribes-all">All Scribes - Work Locations</option>
              </select>
            </label>
            <div id="map-view-hint" style="font-size: 0.75rem; color: #666; margin-top: 0.25rem;">
              💡 Tip: Map views show all data from the entire database.
            </div>
          </div>
          <!-- Map controls -->
          <div style="padding: 0.5rem 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-clusters" checked>
              <span style="font-size: 0.875rem;">Clustering</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-connections">
              <span style="font-size: 0.875rem;">Connection Lines</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-heatmap">
              <span style="font-size: 0.875rem;">Heatmap</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.25rem; margin: 0;">
              <input type="checkbox" id="map-show-routes">
              <span style="font-size: 0.875rem;">Show Routes</span>
            </label>
            <button class="chip" id="map-reset-view" style="margin-left: auto;">Reset View</button>
            <button class="chip" id="map-export-image" style="background: #28a745; color: white;">📷 Export PNG</button>
          </div>
          <!-- Time slider -->
          <div style="padding: 0.5rem 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
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
          <div id="map-mount"></div>
        </div>
      </div>
    </div>

    <!-- TIMELINE MODE -->
    <div id="mode-timeline" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span id="timeline-title">📈 Timeline Visualization</span>
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
          <span>🔗 Network Visualization</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Exploring relationships between entities</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Network View Selector with practical options -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 500; font-size: 0.875rem;">
              Network View:
              <select id="network-view-selector" style="flex: 1; padding: 0.25rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; background: white;">
                <option value="search">🔍 Search & Explore from Record (Recommended)</option>
                <option value="sample">🎲 Random Sample of Connected Entities</option>
                <option value="hubs">⭐ Top Connected Entities (Hubs)</option>
                <option value="clusters">📊 Cluster View by Entity Type</option>
              </select>
            </label>
          </div>
          
          <!-- Search panel (primary interface) -->
          <div id="network-search-panel" style="padding: 0.75rem; background: #fff; border-bottom: 1px solid #dee2e6;">
            <label style="display: block; font-weight: 500; font-size: 0.875rem; margin-bottom: 0.5rem;">
              🔍 Search for a record to explore its network:
            </label>
            <input type="search" id="network-search-input" placeholder="Type manuscript name, scribe, institution, text..." style="width: 100%; padding: 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; margin-bottom: 0.5rem;">
            <div id="network-search-results" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; border-radius: 0.25rem;"></div>
          </div>
          
          <div class="viz-controls" style="padding:.5rem .75rem;border-bottom:1px solid #eee;">
            <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;margin-bottom:.5rem;">
              <label style="display:flex;gap:.5rem;align-items:center;">
                Depth: <input type="number" id="network-depth" min="1" max="3" value="2" style="width:4rem;padding:.25rem .5rem;border:1px solid #ddd;border-radius:.25rem;">
              </label>
              <label style="display:flex;gap:.5rem;align-items:center;">
                <input type="checkbox" id="network-show-labels" checked> Show labels
              </label>
              <button id="network-filters-toggle" class="chip" style="padding:.25rem .5rem;">⚙️ Filters</button>
              <button id="network-zoom-in" class="chip" style="padding:.25rem .5rem;">🔍+ Zoom In</button>
              <button id="network-zoom-out" class="chip" style="padding:.25rem .5rem;">🔍− Zoom Out</button>
              <button id="network-zoom-reset" class="chip" style="padding:.25rem .5rem;">↺ Reset View</button>
              <button id="network-zoom-fit" class="chip" style="padding:.25rem .5rem;">⛶ Fit to Screen</button>
              <button id="network-refresh" class="chip" style="padding:.25rem .5rem;">Refresh</button>
              <button id="network-export-svg" class="chip" style="padding:.25rem .5rem;background:#28a745;color:white;">📷 Export SVG</button>
              <button id="network-export-png" class="chip" style="padding:.25rem .5rem;background:#28a745;color:white;">📷 Export PNG</button>
              <select id="network-export-format" style="padding:.25rem .5rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;cursor:pointer;">
                <option value="">📊 Export Data...</option>
                <option value="gephi">Gephi (2 CSV files)</option>
                <option value="r">R (CSV + script)</option>
              </select>
            </div>
            
            <!-- Advanced Filters Panel (collapsible) -->
            <div id="network-filters-panel" style="display:none;margin-top:.75rem;padding:.75rem;background:#f8f9fa;border-radius:.25rem;border:1px solid #dee2e6;">
              
              <!-- Filter Tabs -->
              <div style="display:flex;gap:.5rem;margin-bottom:.75rem;border-bottom:2px solid #dee2e6;padding-bottom:.5rem;">
                <button class="filter-tab active" data-tab="entity-types" style="padding:.35rem .75rem;border:none;background:transparent;cursor:pointer;font-weight:600;font-size:.85rem;color:#666;border-bottom:2px solid transparent;margin-bottom:-2px;">
                  📦 Entity Types
                </button>
                <button class="filter-tab" data-tab="general" style="padding:.35rem .75rem;border:none;background:transparent;cursor:pointer;font-weight:600;font-size:.85rem;color:#666;border-bottom:2px solid transparent;margin-bottom:-2px;">
                  🔍 General
                </button>
                <button class="filter-tab" data-tab="manuscripts" style="padding:.35rem .75rem;border:none;background:transparent;cursor:pointer;font-weight:600;font-size:.85rem;color:#666;border-bottom:2px solid transparent;margin-bottom:-2px;">
                  📜 Manuscripts
                </button>
                <button class="filter-tab" data-tab="scribal" style="padding:.35rem .75rem;border:none;background:transparent;cursor:pointer;font-weight:600;font-size:.85rem;color:#666;border-bottom:2px solid transparent;margin-bottom:-2px;">
                  ✍️ Scribal Units
                </button>
                <button class="filter-tab" data-tab="people" style="padding:.35rem .75rem;border:none;background:transparent;cursor:pointer;font-weight:600;font-size:.85rem;color:#666;border-bottom:2px solid transparent;margin-bottom:-2px;">
                  👤 People
                </button>
              </div>
              
              <!-- Entity Types Tab -->
              <div class="filter-tab-content" data-tab="entity-types" style="display:block;">
                <div style="font-weight:600;font-size:.9rem;margin-bottom:.5rem;">Select which entity types to include in the network:</div>
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
              
              <!-- General Filters Tab -->
              <div class="filter-tab-content" data-tab="general" style="display:none;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">🌍 Country</label>
                    <select id="network-filter-country" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any country</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Production Units, Institutions</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">📅 Century</label>
                    <select id="network-filter-century" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any century</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Production date (Scribal/Production Units)</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">📍 Production Location</label>
                    <input type="text" id="network-filter-production-location" placeholder="e.g., Paris, Bologna..." style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Production Units (free text search)</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">🗣️ Language (colophon)</label>
                    <select id="network-filter-language" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any language</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Scribal Units</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">📚 Genre</label>
                    <select id="network-filter-genre" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any genre</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Texts</div>
                  </div>
                </div>
              </div>
              
              <!-- Manuscripts Tab -->
              <div class="filter-tab-content" data-tab="manuscripts" style="display:none;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">📄 Material</label>
                    <select id="network-filter-material" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any material</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Writing support material</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">🏛️ Current Location</label>
                    <input type="text" id="network-filter-shelfmark" placeholder="e.g., BnF, Bodleian..." style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Search in shelfmark/location (free text)</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">📏 Size (folios)</label>
                    <div style="display:flex;gap:.5rem;">
                      <input type="number" id="network-filter-folios-min" placeholder="Min" style="width:50%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <input type="number" id="network-filter-folios-max" placeholder="Max" style="width:50%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                    </div>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Number of folios range</div>
                  </div>
                </div>
              </div>
              
              <!-- Scribal Units Tab -->
              <div class="filter-tab-content" data-tab="scribal" style="display:none;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">✒️ Script Type</label>
                    <select id="network-filter-script" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any script</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Script classification</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">🎨 Decoration</label>
                    <select id="network-filter-decoration" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any</option>
                      <option value="yes">With decoration</option>
                      <option value="no">Without decoration</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Presence of decoration</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">📖 Folios Range</label>
                    <div style="display:flex;gap:.5rem;">
                      <input type="text" id="network-filter-folio-start" placeholder="Start (e.g., 1r)" style="width:50%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <input type="text" id="network-filter-folio-end" placeholder="End (e.g., 23v)" style="width:50%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                    </div>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Folio range (free text)</div>
                      <input type="text" id="network-filter-folio-end" placeholder="End" style="width:50%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                    </div>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Folio range (e.g., 1r, 23v)</div>
                  </div>
                </div>
              </div>
              
              <!-- People Tab -->
              <div class="filter-tab-content" data-tab="people" style="display:none;">
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;">
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">👔 Role</label>
                    <select id="network-filter-role" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any role</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Person's role or function</div>
                  </div>
                  <div>
                    <label style="display:block;font-size:.85rem;margin-bottom:.25rem;color:#666;font-weight:500;">⚧️ Gender</label>
                    <select id="network-filter-gender" style="width:100%;padding:.4rem .6rem;border:1px solid #ddd;border-radius:.25rem;font-size:.85rem;">
                      <option value="">Any</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="unknown">Unknown</option>
                    </select>
                    <div style="font-size:.75rem;color:#999;margin-top:.2rem;">Historical person's gender</div>
                  </div>
                </div>
              </div>
              
              <!-- Clear Filters Button -->
              <div style="margin-top:.75rem;padding-top:.75rem;border-top:1px solid #dee2e6;text-align:right;">
                <button id="network-clear-filters" style="padding:.4rem 1rem;background:#dc3545;color:white;border:none;border-radius:.25rem;font-size:.85rem;cursor:pointer;font-weight:500;">
                  🗑️ Clear All Filters
                </button>
              </div>
              
            </div>
          </div>
          <div style="position:relative;">
            <div id="network-mount" style="cursor: grab;"></div>
            <div id="network-legend" style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.95);border:1px solid #ddd;border-radius:.5rem;padding:.75rem;font-size:.85rem;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
              <div style="font-weight:600;margin-bottom:.5rem;">Entity Types</div>
              <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
                <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e6b800;display:inline-block;"></span> Scribal Units</div>
                <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#3498db;display:inline-block;"></span> Manuscripts</div>
                <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#e74c3c;display:inline-block;"></span> Production Units</div>
                <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#2ecc71;display:inline-block;"></span> Holding Institutions</div>
                <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#9b59b6;display:inline-block;"></span> Monastic Institutions</div>
                <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#f39c12;display:inline-block;"></span> Historical People</div>
                <div style="display:flex;align-items:center;gap:.5rem;"><span style="width:12px;height:12px;border-radius:50%;background:#1abc9c;display:inline-block;"></span> Texts</div>
              </div>
              <div style="font-weight:600;margin-bottom:.5rem;padding-top:.5rem;border-top:1px solid #eee;">Interactions</div>
              <div style="display:flex;flex-direction:column;gap:.35rem;margin-bottom:.75rem;">
                <div style="font-size:.8rem;color:#666;">
                  <strong style="color:#333;">Click</strong> nodes to view details
                </div>
                <div style="font-size:.8rem;color:#666;">
                  <strong style="color:#333;">Drag</strong> nodes to rearrange
                </div>
                <div style="font-size:.8rem;color:#666;">
                  <strong style="color:#333;">Scroll</strong> to zoom in/out
                </div>
              </div>
              <div style="font-weight:600;margin-bottom:.5rem;padding-top:.5rem;border-top:1px solid #eee;">Connection Types</div>
              <div style="display:flex;flex-direction:column;gap:.35rem;">
                <div style="display:flex;align-items:center;gap:.5rem;">
                  <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="#999" stroke-width="2"/></svg>
                  <span style="font-size:.8rem;">Relationships</span>
                </div>
                <div style="display:flex;align-items:center;gap:.5rem;">
                  <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="#bbb" stroke-width="1.5" stroke-dasharray="3,3"/></svg>
                  <span style="font-size:.8rem;">Pointer fields</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ANALYTICS MODE -->
    <div id="mode-analytics" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span>📊 Analytics Dashboard</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Statistical insights across the entire database</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Analytics controls -->
          <div style="padding: 0.75rem; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
            <div style="display: flex; gap: 0.75rem; margin-bottom: 0.5rem;">
              <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 500; font-size: 0.875rem; flex: 1;">
                Visualization Type:
                <select id="analytics-viz-type" style="flex: 1; padding: 0.375rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; background: white; font-size: 0.875rem;">
                  <option value="dashboard">Statistical Dashboard</option>
                  <option value="codicology">Codicological Analysis</option>
                  <option value="sankey">Sankey Diagram (Entity Flows)</option>
                  <option value="matrix">Matrix Visualization (Connection Grid)</option>
                  <option value="chord">Chord Diagram (Circular Relationships)</option>
                  <option value="tree">Hierarchical Tree (Entity Structure)</option>
                </select>
              </label>
            </div>
            <!-- Entity filter (only visible for Statistical Dashboard) -->
            <div id="entity-filter-panel" style="margin-bottom: 0.5rem;">
              <label style="display: block; margin-bottom: 0.25rem; font-weight: 500; font-size: 0.875rem;">
                📊 Filter by Entity Type:
                <select id="entity-filter-select" style="margin-left: 0.5rem; padding: 0.375rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                  <option value="all">All Entities</option>
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
            <!-- Tree search panel (only visible when tree is selected) -->
            <div id="tree-search-panel" style="display: none; margin-bottom: 0.5rem; padding: 0.75rem; background: white; border: 1px solid #dee2e6; border-radius: 0.25rem;">
              <div style="display: flex; gap: 0.75rem; margin-bottom: 0.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 500; font-size: 0.875rem; flex: 2;">
                  🔍 Search:
                  <input type="text" id="tree-manuscript-search" placeholder="Type manuscript title or shelfmark..." style="flex: 1; padding: 0.375rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                  <button id="tree-search-clear" style="padding: 0.375rem 0.75rem; background: #6c757d; color: white; border: none; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem;">Clear</button>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0; font-weight: 500; font-size: 0.875rem; flex: 1;">
                  📊 Sort by:
                  <select id="tree-sort-select" style="flex: 1; padding: 0.375rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                    <option value="default">Title (A-Z)</option>
                    <option value="most-pus">Most Production Units</option>
                    <option value="most-sus">Most Scribal Units</option>
                    <option value="most-complex">Most Complex Structure</option>
                  </select>
                </label>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                  <input type="checkbox" id="tree-filter-interleaved" style="cursor: pointer;">
                  🔀 Interleaved Units
                </label>
                <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                  <input type="checkbox" id="tree-filter-cross-ms-pu" style="cursor: pointer;">
                  📚 PUs Across Multiple MSS
                </label>
                <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                  <input type="checkbox" id="tree-filter-cross-pu-su" style="cursor: pointer;">
                  ✍️ SUs Across Multiple PUs
                </label>
                <label style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; cursor: pointer;">
                  <input type="checkbox" id="tree-filter-multi-pu" style="cursor: pointer;">
                  📖 3+ Production Units
                </label>
              </div>
            </div>
            <!-- Codicological Analysis panel (only visible when codicology is selected) -->
            <div id="codicology-panel" style="display: none; margin-bottom: 0.5rem; padding: 0.75rem; background: white; border: 1px solid #dee2e6; border-radius: 0.25rem;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <label style="display: flex; flex-direction: column; gap: 0.25rem; font-weight: 500; font-size: 0.875rem;">
                  📊 Analysis Type:
                  <select id="codic-analysis-type" style="padding: 0.375rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                    <option value="material-size">Material vs Size (with Geography/Date)</option>
                    <option value="size-date">Size vs Date (with Geography)</option>
                    <option value="quire-patterns">Quire Patterns (vs Size/Date/Material/Country)</option>
                    <option value="column-patterns">Column Patterns (vs Size/Date/Material/Country)</option>
                    <option value="margin-ratio">Margin Ratio (Codex Size vs Justification)</option>
                    <option value="custom">Custom Multi-Variable</option>
                  </select>
                </label>
                <label style="display: flex; flex-direction: column; gap: 0.25rem; font-weight: 500; font-size: 0.875rem;">
                  📈 Visualization:
                  <select id="codic-viz-type" style="padding: 0.375rem 0.5rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.875rem;">
                    <option value="scatter">Scatter Plot</option>
                    <option value="box">Box Plot</option>
                    <option value="bar">Bar Chart</option>
                    <option value="heatmap">Correlation Heatmap</option>
                    <option value="stats">Statistical Summary</option>
                  </select>
                </label>
              </div>
              <div id="codic-custom-panel" style="display: none; margin-top: 0.75rem; padding: 0.75rem; background: #f8f9fa; border-radius: 0.25rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <label style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem;">
                    X-Axis Variable:
                    <select id="codic-x-var" style="padding: 0.25rem 0.375rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.75rem;">
                      <option value="size">Size (Height)</option>
                      <option value="width">Width</option>
                      <option value="folios">Folios</option>
                      <option value="date">Date</option>
                      <option value="justification-height">Justification Height</option>
                      <option value="justification-width">Justification Width</option>
                      <option value="columns">Number of Columns</option>
                    </select>
                  </label>
                  <label style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem;">
                    Y-Axis Variable:
                    <select id="codic-y-var" style="padding: 0.25rem 0.375rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.75rem;">
                      <option value="size">Size (Height)</option>
                      <option value="width">Width</option>
                      <option value="folios">Folios</option>
                      <option value="date">Date</option>
                      <option value="justification-height">Justification Height</option>
                      <option value="justification-width">Justification Width</option>
                      <option value="columns">Number of Columns</option>
                    </select>
                  </label>
                </div>
                <label style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.75rem;">
                  Color By:
                  <select id="codic-color-var" style="padding: 0.25rem 0.375rem; border: 1px solid #ced4da; border-radius: 0.25rem; font-size: 0.75rem;">
                    <option value="none">None</option>
                    <option value="gender">Gender</option>
                    <option value="material">Material</option>
                    <option value="quire-type">Quire Type</option>
                    <option value="catchwords">Has Catchwords</option>
                    <option value="signatures">Has Signatures</option>
                    <option value="colophon">Has Colophon</option>
                    <option value="watermark">Has Watermark</option>
                    <option value="ruling">Ruling Type</option>
                    <option value="collaboration">Collaboration Type</option>
                    <option value="language">Language</option>
                    <option value="origin">Origin</option>
                  </select>
                </label>
              </div>
            </div>
            <div id="analytics-description" style="padding: 0.5rem; background: #e7f3ff; border-left: 3px solid #2196F3; font-size: 0.8rem; color: #555; border-radius: 0.25rem;">
              <strong>Statistical Dashboard:</strong> Provides quantitative overview of the corpus including record counts, date ranges, and key attributes by entity type. Helps identify dataset completeness, temporal distribution, and notable characteristics. Essential for understanding corpus composition and identifying trends or gaps in the data.
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
              <button class="chip" id="analytics-export-svg" style="background:#28a745;color:white;">📷 Export SVG</button>
              <button class="chip" id="analytics-export-png" style="background:#28a745;color:white;">📷 Export PNG</button>
            </div>
          </div>

          <!-- Analytics mount point -->
          <div id="analytics-mount" style="padding: 1rem; overflow: auto;">
            <!-- Visualization will be rendered here -->
          </div>
        </div>
      </div>
    </div>

    <!-- MULTILINGUALISM MODE -->
    <div id="mode-multilingualism" class="mode-container mode-fullwidth" aria-hidden="true">
      <div class="viz-card is-on">
        <div class="viz-head">
          <span id="multilingualism-title">🌍 Multilingualism Explorer</span>
          <span style="font-size: 0.875rem; font-weight: 400; color: #666; margin-left: 1rem;">Exploring linguistic diversity in medieval manuscript production</span>
        </div>
        <div class="viz-body" style="padding: 0;">
          <!-- Sub-navigation tabs -->
          <div style="display: flex; gap: 0.5rem; padding: 1rem; border-bottom: 2px solid #e0e0e0; background: #f8f9fa; flex-wrap: wrap;">
            <button class="multilingualism-tab-btn is-on" data-tab="overview" style="padding: 0.5rem 1rem; border: none; background: #fff; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              📊 Overview
            </button>
            <button class="multilingualism-tab-btn" data-tab="manuscripts" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              📚 Multilingual Manuscripts
            </button>
            <button class="multilingualism-tab-btn" data-tab="scribes" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              ✍️ Scribal Multilingualism
            </button>
            <button class="multilingualism-tab-btn" data-tab="institutions" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              🏛️ Institutional Multilingualism
            </button>
            <button class="multilingualism-tab-btn" data-tab="colophons" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              🔀 Colophon-Text Divergence
            </button>
          </div>

          <!-- Mount point for multilingualism visualizations -->
          <div id="multilingualism-mount" style="padding: 1rem; overflow: auto; min-height: 60vh;">
            <!-- Visualization will be rendered here -->
          </div>
        </div>
      </div>
    </div>

    <!-- COLOPHON ANALYSIS MODE -->
    <div id="mode-colophon-analysis" class="mode-container mode-fullwidth" aria-hidden="true">
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.08); overflow: hidden;">
        <div style="border-bottom: 2px solid #f0f0f0;">
          <div class="colophon-tabs" style="display: flex; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #fafafa;">
            <button class="colophon-tab-btn is-on" data-tab="overview" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              📊 Overview
            </button>
            <button class="colophon-tab-btn" data-tab="sentiment" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              💭 Sentiment Analysis
            </button>
            <button class="colophon-tab-btn" data-tab="themes" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              🏷️ Thematic Analysis
            </button>
            <button class="colophon-tab-btn" data-tab="linguistic" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              📝 Linguistic Features
            </button>
            <button class="colophon-tab-btn" data-tab="patterns" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              🔍 Comparative Patterns
            </button>
            <button class="colophon-tab-btn" data-tab="browse-colophons" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
              📖 Browse Colophons
            </button>
          </div>
        </div>
        <div style="padding: 1.5rem;">
          <div id="colophon-mount" style="overflow: auto; min-height: 60vh;">
            <!-- Analysis will be rendered here -->
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

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
<dialog id="path-dialog" style="max-width:680px;border:1px solid #ddd;border-radius:.75rem;padding:1rem;">
  <form method="dialog">
    <h3 style="margin:.25rem 0 .75rem;">Find Connection</h3>
    <p class="muted" style="margin-top:-.25rem">Find paths between the current record and another record.</p>
    
    <div id="path-from" style="padding:.75rem;background:#f9f9f9;border-radius:.5rem;margin:.75rem 0;"></div>
    
    <div style="margin:.75rem 0;">
      <label style="display:block;font-weight:600;margin-bottom:.5rem;">Search for target record:</label>
      <input type="search" id="path-search" placeholder="Type to search..." 
        style="width:100%;padding:.5rem .75rem;border:1px solid #ddd;border-radius:.5rem;margin-bottom:.5rem;">
      <div id="path-results" style="max-height:200px;overflow:auto;border:1px solid #eee;border-radius:.5rem;"></div>
    </div>
    
    <div style="margin:.75rem 0;">
      <label style="display:flex;gap:.5rem;align-items:center;">
        Max depth: <input type="number" id="path-depth" min="1" max="5" value="4" style="width:4rem;padding:.25rem .5rem;border:1px solid #ddd;border-radius:.25rem;">
      </label>
    </div>
    
    <div id="path-display" style="margin:1rem 0;"></div>
    
    <div style="display:flex;gap:.5rem;justify-content:flex-end;">
      <button type="button" class="chip" onclick="this.closest('dialog').close()">Close</button>
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
    background: #667eea;
    color: white;
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  /* === Mode Containers === */
  .mode-container {
    display: none;
  }
  
  /* Browse mode: 3-column layout (facets | results | details) */
  /* Facets=280px | Results=flexible | Details=2x Results width */
  #mode-browse[aria-hidden="false"] {
    display: grid;
    grid-template-columns: 280px minmax(400px, 1fr) minmax(800px, 2fr);
    gap: 2rem;
    align-items: start;
  }
  
  /* Responsive: stack on smaller screens */
  @media (max-width: 1400px) {
    #mode-browse[aria-hidden="false"] {
      grid-template-columns: 1fr 1fr 2fr;
      gap: 1.5rem;
    }
  }
  
  @media (max-width: 1200px) {
    #mode-browse[aria-hidden="false"] {
      grid-template-columns: 1fr 2fr;
      gap: 1rem;
    }
    #db-viz {
      display: none; /* Hide details on smaller screens, or make it a modal */
    }
  }
  
  /* Visualization modes: full-width (Map, Timeline, Network, Analytics, Multilingualism, Colophon Analysis) */
  /* These need to break out of the .explore-fullwidth padding, then add it back */
  #mode-map[aria-hidden="false"],
  #mode-timeline[aria-hidden="false"],
  #mode-network[aria-hidden="false"],
  #mode-analytics[aria-hidden="false"],
  #mode-multilingualism[aria-hidden="false"],
  #mode-colophon-analysis[aria-hidden="false"] {
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
    font-weight:700;text-decoration:none;cursor:pointer;line-height:inherit;font:inherit;border-radius:0; }
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
const REL_ENDPOINT = "/assets/data/relationships.json";
const BASE = "{{ site.baseurl | default: '' }}";

/* ---------- DOM ---------- */
const $mount   = document.getElementById('facet-mount');
const $results = document.getElementById('db-results');
const $status  = document.getElementById('db-status');
const $pager   = document.getElementById('db-pager');
const $prev    = document.getElementById('db-prev');
const $next    = document.getElementById('db-next');
const $page    = document.getElementById('db-page');
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
const flat = rec => { const bits=[rec.rec_Title||'']; (rec.details||[]).forEach(d=>{ if (d.termLabel) bits.push(d.termLabel); if (typeof d.value==='string') bits.push(d.value); if (d.value && typeof d.value==='object' && d.value.title) bits.push(d.value.title); }); return bits.join(' ').toLowerCase(); };
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
// All details for a field name
const getDetailsAll = (rec, name) => (rec?.details || []).filter(d => d.fieldName === name);

// Convert a detail to displayable string (you already have val(d))
const detailToString = d => val(d);

// All values (strings) for a field, flattening multi-valued terms
const getValsAll = (rec, field) =>
  getDetailsAll(rec, field).map(detailToString).filter(Boolean);


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

/* ---------- Facets config ---------- */
const FACETS = {
  su: [
    { key:'su_dating', label:'SU dating', type:'text', field:'SU dating' },
    { key:'century', label:'Normalized century of production', type:'century', field:'Normalized century of production' },
    { key:'post', label:'Terminus post quem', type:'year-range', field:'Normalized terminus post quem' },
    { key:'ante', label:'Terminus ante quem', type:'year-range', field:'Normalized terminus ante quem' },
    { key:'script', label:'Normalized script(s)', type:'enum-multi', field:'Normalised script(s)' },
    { key:'colophon_presence', label:'Colophon presence', type:'enum', field:'Colophon presence' },
    { key:'colophon_language', label:'Colophon language', type:'enum-multi', field:'Colophon language' },
    { key:'manuscript', label:'Manuscript', type:'resource', field:'Manuscript' },
    { key:'scribe_comments', label:'Scribe Comments', type:'text', field:'Scribe Comments' },
    { key:'text_comments', label:'Text(s) comments', type:'text', field:'Text(s) comments' },
    { key:'pu_comments', label:'PU Comments', type:'text', field:'PU Comments' },
  ],
  ms: [
    { key:'holding', label:'Holding Institution', type:'resource', field:'Holding Institution' },
    { key:'callno', label:'Call number', type:'text', field:'Call number' },
    { key:'ms_date', label:'Ms Dating (YYYY ok)', type:'year-range', field:'Ms Dating' },
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
    { key:'colophon_presence', label:'Colophon presence', type:'enum-search', field:'Colophon presence' },
    { key:'colophon_language', label:'Colophon language', type:'enum-multi', field:'Colophon language' },
    { key:'Watermark', label:'Watermark Present', type:'enum-search', field:'Watermark Present' },
    { key:'manuscript', label:'Manuscript', type:'resource', field:'Manuscript' },
    { key:'folios', label:'Folios', type:'num-range', field:'Number of Folios' },
    { key:'text_h', label:'Text block height', type:'num-range', field:'Text block height' },
    { key:'text_w', label:'Text block width',  type:'num-range', field:'Text block width' },
    { key:'ruling', label:'Ruling',  type:'enum', field:'Ruling' },
    { key:'catchwords', label:'Ruling',  type:'enum-search', field:'catchwords' },
    { key:'signatures', label:'Ruling',  type:'enum-search', field:'signatures' },
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
    { key:'ptype',   label:'Person type', type:'enum', field:'Person type' },
     { key:'activity',   label:'Century of Activity', type:'century', field:'Century of Activity' },
  ],
  tx: [
    { key:'genre',   label:'Genre', type:'enum', field:'Genre' },
    { key:'subgenre',label:'Subgenre', type:'enum-search', field:'Subgenre' },
    { key:'ntitle',  label:'Normalized Title', type:'enum-search', field:'Normalized Title' },
    { key:'author',  label:'Author', type:'enum-search', field:'Creator' },
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
      const counts={}; records.forEach(r=>{ const v=getVal(r,f.field); if (!v||v==='—') return; counts[v]=(counts[v]||0)+1; });
      const wrap=document.createElement('div'); wrap.className='chip-list';
      Object.keys(counts).sort().forEach(v=>{
        const b=document.createElement('button'); b.type='button'; b.className='chip';
        b.dataset.fkey=f.key; b.dataset.value=v;
        b.textContent = `${v} (${counts[v]||0})`;
        if (prevState[f.key]?.values?.has(v)) b.classList.add('is-on');
        wrap.appendChild(b);
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
      const onChips=[...document.querySelectorAll(`.chip[data-fkey="${f.key}"].is-on`)].map(n=>n.dataset.value);
      st[f.key]={type:f.type, values:new Set(onChips)};
    } else if (f.type==='enum-multi' || f.type==='century'){
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
        const v=getVal(rec,f.field);
        if (s.values.size && !s.values.has(v)) return false;
      } else if (f.type==='enum-multi' || f.type==='century'){
        const values = (f.type==='century')
          ? getValsAll(rec, 'Normalized century of production')
          : getValsAll(rec, f.field);
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
  
  switchEntity(type);
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
  // add hi / mi / hp / tx as needed
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
    if (d.value && typeof d.value === 'object' && (d.value.title || d.value.id)){
      const tEnt = REC_TYPE_TO_ENTITY[String(d.value.type)] || null;
      const tId  = String(d.value.id || '');
      if (tEnt && IDX[tEnt] && IDX[tEnt][tId]) return linkTo(tEnt, tId, d.value.title || tId);
      return esc(d.value.title || tId);
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
    const relType = getVal(r, 'Relationship type') || 'Related to';
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
   NETWORK DIAGRAM VISUALIZATION
   ============================================================ */
function buildNetworkDiagram(centerRec, centerType, depth = 2, relTypeFilter = null) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  // Get UI controls
  const showLabels = document.getElementById('network-show-labels')?.checked !== false;
  
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
  
  // Store network data for export
  CURRENT_NETWORK_DATA = { nodes: nodes.map(n => ({...n})), links: links.map(l => ({...l})) };
  
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
  
  // Store zoom for reset button
  svg.datum({ zoom, initialTransform: d3.zoomIdentity });
  
  // Color scale by record type
  const colorScale = d3.scaleOrdinal()
    .domain(['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx'])
    .range(['#e6b800', '#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c']);
  
  // Force simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(35));
  
  // Draw links
  const link = g.append('g')
    .selectAll('line')
    .data(links)
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
  
  // Draw nodes
  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', d => d.level === 0 ? 15 : 10)
    .attr('fill', d => colorScale(d.type))
    .attr('stroke', d => d.level === 0 ? '#000' : '#fff')
    .attr('stroke-width', d => d.level === 0 ? 3 : 2)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));
  
  // Add labels
  const label = g.append('g')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .text(d => {
      const maxLen = d.level === 0 ? 30 : 20;
      return d.label.length > maxLen ? d.label.substring(0, maxLen) + '...' : d.label;
    })
    .attr('font-size', d => d.level === 0 ? 12 : 10)
    .attr('font-weight', d => d.level === 0 ? 'bold' : 'normal')
    .attr('dx', 15)
    .attr('dy', 4)
    .style('display', showLabels ? 'block' : 'none');
  
  // Click handler
  node.on('click', (event, d) => {
    const [type, id] = d.id.split(':');
    // Stay on network view but update to the clicked record
    jumpTo(type, id);
    // Rebuild network with new center
    const clickedRec = IDX[type]?.[String(id)];
    if (clickedRec) {
      NETWORK_CURRENT_REC = clickedRec;
      NETWORK_CURRENT_TYPE = type;
      buildNetworkView();
    }
  });
  
  // Tooltip
  node.append('title')
    .text(d => `${d.label} (${d.type.toUpperCase()})\nClick to view`);
  
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
  
  let html = '<div class="section"><strong>Connection Paths Found</strong>';
  paths.slice(0, 5).forEach((path, i) => {
    html += `<div style="margin:.75rem 0;padding:.5rem;background:#f9f9f9;border-radius:.5rem;">`;
    html += `<div style="font-weight:600;margin-bottom:.35rem;">Path ${i + 1} (${path.length - 1} step${path.length > 2 ? 's' : ''}):</div>`;
    html += `<div style="margin-left:.5rem;line-height:1.6;">`;
    
    path.forEach((node, j) => {
      if (j > 0) {
        html += ` <span class="muted">${node.direction} (${esc(node.via)})</span> `;
      }
      html += linkTo(node.type, node.id, node.title);
      if (j < path.length - 1) html += ' ';
    });
    
    html += '</div></div>';
  });
  
  if (paths.length > 5) {
    html += `<div class="muted" style="margin-top:.5rem;">...and ${paths.length - 5} more path${paths.length > 6 ? 's' : ''}</div>`;
  }
  
  html += '</div>';
  
  return html;
}

function renderRelationships(rec, type) {
  const recId = String(rec.rec_ID);
  const outgoing = REL_INDEX.bySource[recId] || [];
  const incoming = REL_INDEX.byTarget[recId] || [];
  
  let html = '';
  
  // Outgoing relationships (this record → other records)
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
        
        // Add metadata if present
        const meta = getRelationshipMetadata(r);
        if (meta) html += ` <span class="muted" style="font-size:.9rem">(${esc(meta)})</span>`;
        html += `</div>`;
      });
      html += '</div>';
    }
    html += '</div>';
  }
  
  // Incoming relationships (other records → this record)
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
        
        // Add metadata if present
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
      const viewerHref = `${BASE}/viewer/?manifest=${encodeURIComponent(manifestUrl)}`;
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
    <button class="chip" id="btn-find-connection" style="padding:.5rem .75rem;">🔗 Find Connection to...</button>
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
  const list = computeList();
  buildFacets(list, cfg, prevState);
  render(list, ENTITY);
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
  const modes = ['browse', 'map', 'timeline', 'network', 'analytics', 'multilingualism', 'colophon-analysis'];
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
  if (mode === 'multilingualism') buildMultilingualism();
  if (mode === 'colophon-analysis') buildColophonAnalysis();
}

function initModeNavigation() {
  console.log('🔧 Setting up mode navigation listeners...');
  // Set up main navigation listeners
  document.querySelectorAll('.main-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      console.log('🖱️ Mode button clicked:', mode);
      if (mode) setMode(mode);
    });
  });
  console.log('✓ Mode navigation listeners attached');
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

// Suggest appropriate map view based on current entity
function getSuggestedMapView(entity) {
  const suggestions = {
    'ms': 'ms-current',          // Manuscripts → Current Location
    'pu': 'pu-location',         // Production Units → All Locations
    'mi': 'mi-all',              // Monastic Institutions → All
    'su': 'scribes-all',         // Scribal Units → All Scribes
    'hi': 'ms-current',          // Holding Institutions → show manuscripts there
    'hp': 'ms-current',          // Historical People → default to manuscripts
    'tx': 'ms-current'           // Texts → default to manuscripts
  };
  return suggestions[entity] || 'ms-current';
}

async function buildMap(){
  console.log('🗺️ buildMap() called');
  await ensureLeaflet();

  // Get selected map view - default to 'ms-current'
  const viewSelector = document.getElementById('map-view-selector');
  if (!MAP_CURRENT_VIEW) {
    MAP_CURRENT_VIEW = 'ms-current';
    if (viewSelector) viewSelector.value = 'ms-current';
  }
  
  MAP_CURRENT_VIEW = viewSelector?.value || 'ms-current';

  // Update title based on view
  const viewTitles = {
    'ms-current': 'Map — Manuscripts by Current Location (Holdings)',
    'ms-production': 'Map — Manuscripts by Production Location',
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
      hintEl.textContent = `💡 Tip: Viewing ${ENTITY.toUpperCase()} records, but map shows related geographic data. Change "Map View" above to explore different aspects.`;
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
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution:'© OpenStreetMap' }).addTo(map);

  // Collect marker data based on selected view
  MAP_MARKERS_DATA = collectMapData(MAP_CURRENT_VIEW);
  
  // Initial render
  renderMapLayers();
  
  // Setup event handlers
  setupMapControls();
  
  // Fit bounds
  if (MAP_MARKERS_DATA.length) {
    const bounds = L.latLngBounds(MAP_MARKERS_DATA.map(m => [m.pt.lat, m.pt.lng]));
    map.fitBounds(bounds.pad(0.2));
  } else {
    map.setView([47,8],4);
    mount.insertAdjacentHTML('beforeend','<div class="muted" style="padding:.75rem">No mappable coordinates for this view.</div>');
  }
}

// Collect map data based on selected view
function collectMapData(viewType) {
  const markers = [];
  
  const getYear = s => {
    if (!s) return null;
    const m = String(s).match(/(^|[^0-9])([0-9]{3,4})(?![0-9])/);
    if (!m) return null;
    const y = parseInt(m[2], 10);
    return (y >= 1 && y <= 2100) ? y : null;
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
      // Manuscripts by production location
      DATA.ms.forEach(rec => {
        const prodPt = coordsFromProduction(rec);
        const holdPt = coordsFromHoldingInstitution(rec);
        const pt = prodPt || holdPt;
        if (!pt) return;
        
        const year = getYear(getDetail(rec,'Normalized terminus post quem')?.value) || 
                     getYear(getDetail(rec,'Normalized terminus ante quem')?.value);
        const id = String(rec.rec_ID);
        const title = (MAP.ms.title(rec) || 'Untitled').replace(/"/g,'&quot;');
        
        markers.push({
          rec, pt, prodPt, holdPt, year, id, title,
          entity: 'ms',
          subtitle: prodPt ? 'Production location' : 'Holding location (fallback)',
          category: 'manuscript'
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
        
        const year = getYear(getDetail(rec,'PU Date terminus post quem')?.value) ||
                     getYear(getDetail(rec,'PU Date terminus ante quem')?.value);
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
      
    case 'scribes-female':
    case 'scribes-all':
      // Scribes by their work locations (via manuscripts)
      const filterFemale = (viewType === 'scribes-female');
      const scribeLocations = {};
      
      DATA.su.forEach(su => {
        // Filter by gender if needed
        if (filterFemale) {
          const gender = getDetail(su,'Gender')?.value;
          if (!gender || !String(gender).toLowerCase().includes('female')) return;
        }
        
        const suId = String(su.rec_ID);
        const suTitle = (MAP.su?.title(su) || 'Unnamed Scribe').replace(/"/g,'&quot;');
        
        // Find manuscripts this scribe worked on via relationships
        const relatedManuscripts = [];
        
        // Check relationships where SU is source or target
        const sourceRels = REL_INDEX.bySource[suId] || [];
        const targetRels = REL_INDEX.byTarget[suId] || [];
        
        [...sourceRels, ...targetRels].forEach(rel => {
          const sourceId = String(getRes(rel, 'Source record')?.id);
          const targetId = String(getRes(rel, 'Target record')?.id);
          
          // Check if either end is a manuscript
          if (sourceId !== suId && IDX.ms[sourceId]) {
            relatedManuscripts.push(IDX.ms[sourceId]);
          }
          if (targetId !== suId && IDX.ms[targetId]) {
            relatedManuscripts.push(IDX.ms[targetId]);
          }
        });
        
        // Also check pointer fields in manuscripts pointing to this SU
        DATA.ms.forEach(ms => {
          const details = ms.details || [];
          details.forEach(d => {
            if (d.value && typeof d.value === 'object' && String(d.value.id) === suId) {
              if (!relatedManuscripts.some(m => String(m.rec_ID) === String(ms.rec_ID))) {
                relatedManuscripts.push(ms);
              }
            }
          });
        });
        
        // For each manuscript, get its location(s)
        relatedManuscripts.forEach(ms => {
          const prodPt = coordsFromProduction(ms);
          const holdPt = coordsFromHoldingInstitution(ms);
          const pts = [];
          if (prodPt) pts.push({pt: prodPt, type: 'production', ms});
          if (holdPt && (!prodPt || (prodPt.lat !== holdPt.lat || prodPt.lng !== holdPt.lng))) {
            pts.push({pt: holdPt, type: 'holding', ms});
          }
          
          pts.forEach(({pt, type, ms}) => {
            const key = `${suId}-${pt.lat.toFixed(4)}-${pt.lng.toFixed(4)}`;
            if (!scribeLocations[key]) {
              scribeLocations[key] = {
                su,
                pt,
                manuscripts: [],
                title: suTitle,
                id: suId,
                locationType: type
              };
            }
            if (!scribeLocations[key].manuscripts.some(m => String(m.rec_ID) === String(ms.rec_ID))) {
              scribeLocations[key].manuscripts.push(ms);
            }
          });
        });
      });
      
      // Convert to markers
      Object.values(scribeLocations).forEach(loc => {
        const gender = getDetail(loc.su,'Gender')?.value || 'Unknown';
        const msCount = loc.manuscripts.length;
        markers.push({
          rec: loc.su,
          pt: loc.pt,
          year: null, // Scribes don't have dates directly
          id: loc.id,
          title: loc.title,
          entity: 'su',
          subtitle: `${msCount} manuscript${msCount !== 1 ? 's' : ''} (${loc.locationType})`,
          gender,
          manuscriptCount: msCount,
          manuscripts: loc.manuscripts,
          category: 'scribe'
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
    'production': '#ff7800',      // Orange
    'monastery': '#9333ea',       // Purple
    'monastery-pu': '#c026d3',    // Magenta
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
    if (!m.year) return true; // Include records without dates
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
          btn.addEventListener('click', ()=>{ setView('results'); jumpTo(m.entity, m.id); });
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
          btn.addEventListener('click', ()=>{ setView('results'); jumpTo(m.entity, m.id); });
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
      // Manuscripts: production → holding
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
  console.log('📈 buildTimeline() called');
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
      
      // Debug: log what we're getting
      if (lang && Math.random() < 0.01) { // Log 1% of items to avoid spam
        console.log('Language value:', lang, 'for entity:', item.entity, 'recID:', item.rec.rec_ID);
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
        'Hebrew': '#ec4899',
        'Greek': '#8b5cf6',
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
      
      // Debug: log what we're getting
      if (script && Math.random() < 0.01) { // Log 1% of items to avoid spam
        console.log('Script value:', script, 'for entity:', item.entity, 'recID:', item.rec.rec_ID);
      }
      
      if (!script) return '#6b7280';
      const scriptStr = String(script).trim();
      
      const scriptColors = {
        'Gothic': '#dc2626',
        'Caroline': '#2563eb',
        'Carolingian': '#2563eb',
        'Humanistic': '#16a34a',
        'Uncial': '#ca8a04',
        'Beneventan': '#9333ea',
        'Insular': '#ec4899',
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
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ec4899; border-radius: 50%;"></span> Hebrew</span>
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #8b5cf6; border-radius: 50%;"></span> Greek</span>
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
      <span style="display: flex; align-items: center; gap: 0.25rem;"><span style="display: inline-block; width: 12px; height: 12px; background: #ec4899; border-radius: 50%;"></span> Insular</span>
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
  console.log(`Setting up click handlers for ${items.length} timeline items`);
  
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const recID = item.getAttribute('data-recid'); // Keep as string
      console.log('Timeline item clicked:', recID, 'Currently selected:', TIMELINE_SELECTED);
      
      if (TIMELINE_SELECTED === recID) {
        // Deselect if clicking same item
        TIMELINE_SELECTED = null;
        console.log('Deselected');
      } else {
        // Select new item
        TIMELINE_SELECTED = recID;
        console.log('Selected new item:', recID);
        
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
        console.log('Background clicked, deselecting');
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
  console.log('🔗 buildNetworkView() called');
  
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
      if (mount) mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#666;">👆 Search for a record above to explore its network</div>';
      return;
    }
    // If we have a record, show its network
    buildRecordNetwork(NETWORK_CURRENT_REC, NETWORK_CURRENT_TYPE);
  } else if (networkView === 'sample') {
    buildSampledNetwork(getActiveEntityFilters(), 100);
  } else if (networkView === 'hubs') {
    buildHubsNetwork(getActiveEntityFilters(), 50);
  } else if (networkView === 'clusters') {
    buildClusterView();
  }
}

// Get active entity type filters
// Get active entity type filters
function getActiveEntityFilters() {
  const checkboxes = document.querySelectorAll('.network-entity-filter:checked');
  const selected = Array.from(checkboxes).map(cb => cb.value);
  
  // If none are checked, show nothing (not all)
  if (selected.length === 0) {
    console.log('⚠️ No entity types selected');
    return [];
  }
  
  console.log('🔍 Active entity types:', selected);
  return selected;
}

// Populate filter dropdowns with unique values from data
function populateFilterDropdowns() {
  console.log('📋 Populating filter dropdowns...');
  
  // Helper to extract unique values
  const getUniqueValues = (entityType, fieldName, useGetValsAll = false) => {
    const values = new Set();
    if (!DATA[entityType]) return values;
    DATA[entityType].forEach(rec => {
      if (useGetValsAll) {
        const vals = getValsAll(rec, fieldName);
        vals.forEach(v => { if (v) values.add(v.trim()); });
      } else {
        const val = getVal(rec, fieldName);
        if (val) values.add(val.trim());
      }
    });
    return Array.from(values).sort();
  };
  
  // Country (PU, HI, MI)
  const countries = new Set([
    ...getUniqueValues('pu', 'PU country'),
    ...getUniqueValues('hi', 'Country'),
    ...getUniqueValues('mi', 'Country')
  ]);
  populateDropdown('network-filter-country', Array.from(countries).sort(), 'Any country');
  
  // Century (SU, PU)
  const centuries = new Set([
    ...getUniqueValues('su', 'Normalized century of production', true),
    ...getUniqueValues('pu', 'Normalized century of production', true)
  ]);
  populateDropdown('network-filter-century', Array.from(centuries).sort(), 'Any century');
  
  // Language (SU)
  const languages = getUniqueValues('su', 'Colophon language');
  populateDropdown('network-filter-language', languages, 'Any language');
  
  // Genre (TX)
  const genres = getUniqueValues('tx', 'Genre');
  populateDropdown('network-filter-genre', genres, 'Any genre');
  
  // Script (SU)
  const scripts = getUniqueValues('su', 'Script');
  populateDropdown('network-filter-script', scripts, 'Any script');
  
  // Material (MS)
  const materials = getUniqueValues('ms', 'Material');
  populateDropdown('network-filter-material', materials, 'Any material');
  
  // Role (HP)
  const roles = getUniqueValues('hp', 'Role', true);
  populateDropdown('network-filter-role', roles, 'Any role');
  
  console.log('✅ Filter dropdowns populated');
}

// Helper to populate a dropdown
function populateDropdown(elementId, values, placeholder = 'Any') {
  const select = document.getElementById(elementId);
  if (!select) {
    console.warn('⚠️ Dropdown element not found:', elementId);
    return;
  }
  
  select.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value.toLowerCase();
    option.textContent = value;
    select.appendChild(option);
  });
}

// Get active field filters
function getActiveFieldFilters() {
  const filters = {
    // General filters
    genre: document.getElementById('network-filter-genre')?.value || null,
    language: document.getElementById('network-filter-language')?.value || null,
    century: document.getElementById('network-filter-century')?.value || null,
    country: document.getElementById('network-filter-country')?.value || null,
    productionLocation: document.getElementById('network-filter-production-location')?.value.trim().toLowerCase() || null,
    
    // Manuscript filters
    material: document.getElementById('network-filter-material')?.value || null,
    shelfmark: document.getElementById('network-filter-shelfmark')?.value.trim().toLowerCase() || null,
    foliosMin: parseInt(document.getElementById('network-filter-folios-min')?.value) || null,
    foliosMax: parseInt(document.getElementById('network-filter-folios-max')?.value) || null,
    
    // Scribal unit filters
    script: document.getElementById('network-filter-script')?.value || null,
    decoration: document.getElementById('network-filter-decoration')?.value || null,
    folioStart: document.getElementById('network-filter-folio-start')?.value.trim().toLowerCase() || null,
    folioEnd: document.getElementById('network-filter-folio-end')?.value.trim().toLowerCase() || null,
    
    // People filters
    role: document.getElementById('network-filter-role')?.value || null,
    gender: document.getElementById('network-filter-gender')?.value || null
  };
  
  // Log active filters for debugging
  const activeFilters = Object.entries(filters).filter(([k, v]) => v !== null && v !== '');
  if (activeFilters.length > 0) {
    console.log('🔍 Active field filters:', Object.fromEntries(activeFilters));
  }
  
  return filters;
}

// Check if a record matches field filters
function recordMatchesFilters(rec, type) {
  const filters = getActiveFieldFilters();
  
  // If no filters are active, match everything
  const hasAnyFilter = Object.values(filters).some(v => v !== null);
  if (!hasAnyFilter) return true;
  
  // Debug: Log first few filter checks
  if (window.filterDebugCount === undefined) window.filterDebugCount = 0;
  const shouldLog = window.filterDebugCount < 3;
  if (shouldLog) {
    console.log(`🔍 Checking record (${window.filterDebugCount + 1}/3):`, { type, id: rec.rec_ID, filters });
  }
  
  // === GENERAL FILTERS ===
  
  // Genre filter (texts only)
  if (filters.genre && type === 'tx') {
    const genre = (getVal(rec, 'Genre') || '').toLowerCase();
    if (!genre.includes(filters.genre)) {
      if (shouldLog) console.log('  ❌ Genre mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Language filter (scribal units - colophon language)
  if (filters.language && type === 'su') {
    const lang = (getVal(rec, 'Colophon language') || '').toLowerCase();
    if (!lang.includes(filters.language)) {
      if (shouldLog) console.log('  ❌ Language mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Century filter (scribal units, production units)
  if (filters.century && (type === 'su' || type === 'pu')) {
    const centuries = getValsAll(rec, 'Normalized century of production');
    const match = centuries.some(c => c && c.toLowerCase().includes(filters.century));
    if (!match) {
      if (shouldLog) console.log('  ❌ Century mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Country filter (production units, institutions)
  if (filters.country && (type === 'pu' || type === 'hi' || type === 'mi')) {
    let country = '';
    if (type === 'pu') country = getVal(rec, 'PU country') || '';
    else if (type === 'hi' || type === 'mi') country = getVal(rec, 'Country') || '';
    if (!country.toLowerCase().includes(filters.country)) {
      if (shouldLog) console.log('  ❌ Country mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Production location filter (production units)
  if (filters.productionLocation && type === 'pu') {
    const location = (getVal(rec, 'Production location') || '').toLowerCase();
    if (!location.includes(filters.productionLocation)) {
      if (shouldLog) console.log('  ❌ Production location mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // === MANUSCRIPT FILTERS ===
  
  // Material filter (manuscripts)
  if (filters.material && type === 'ms') {
    const material = (getVal(rec, 'Material') || '').toLowerCase();
    if (!material.includes(filters.material)) {
      if (shouldLog) console.log('  ❌ Material mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Shelfmark filter (manuscripts)
  if (filters.shelfmark && type === 'ms') {
    const shelfmark = (getVal(rec, 'MS shelfmark') || '').toLowerCase();
    if (!shelfmark.includes(filters.shelfmark)) {
      if (shouldLog) console.log('  ❌ Shelfmark mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Folios range filter (manuscripts)
  if ((filters.foliosMin !== null || filters.foliosMax !== null) && type === 'ms') {
    const folios = parseInt(getVal(rec, 'Number of folios')) || 0;
    if (filters.foliosMin !== null && folios < filters.foliosMin) {
      if (shouldLog) console.log('  ❌ Below minimum folios');
      window.filterDebugCount++;
      return false;
    }
    if (filters.foliosMax !== null && folios > filters.foliosMax) {
      if (shouldLog) console.log('  ❌ Above maximum folios');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // === SCRIBAL UNIT FILTERS ===
  
  // Script type filter (scribal units)
  if (filters.script && type === 'su') {
    const script = (getVal(rec, 'Script') || '').toLowerCase();
    if (!script.includes(filters.script)) {
      if (shouldLog) console.log('  ❌ Script mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Decoration filter (scribal units)
  if (filters.decoration && type === 'su') {
    const hasDecoration = (getVal(rec, 'Decoration') || '').toLowerCase();
    const wantDecoration = filters.decoration === 'yes';
    const hasIt = hasDecoration && hasDecoration !== 'none' && hasDecoration !== 'no';
    if (wantDecoration !== hasIt) {
      if (shouldLog) console.log('  ❌ Decoration mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Folio range filter (scribal units)
  if ((filters.folioStart || filters.folioEnd) && type === 'su') {
    const start = (getVal(rec, 'Start folio') || '').toLowerCase();
    const end = (getVal(rec, 'End folio') || '').toLowerCase();
    if (filters.folioStart && !start.includes(filters.folioStart)) {
      if (shouldLog) console.log('  ❌ Folio start mismatch');
      window.filterDebugCount++;
      return false;
    }
    if (filters.folioEnd && !end.includes(filters.folioEnd)) {
      if (shouldLog) console.log('  ❌ Folio end mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // === PEOPLE FILTERS ===
  
  // Role filter (historical people)
  if (filters.role && type === 'hp') {
    const roles = getValsAll(rec, 'Role');
    const match = roles.some(r => r && r.toLowerCase().includes(filters.role));
    if (!match) {
      if (shouldLog) console.log('  ❌ Role mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  // Gender filter (historical people)
  if (filters.gender && type === 'hp') {
    const gender = (getVal(rec, 'Gender') || '').toLowerCase();
    if (!gender.includes(filters.gender)) {
      if (shouldLog) console.log('  ❌ Gender mismatch');
      window.filterDebugCount++;
      return false;
    }
  }
  
  if (shouldLog) {
    console.log('  ✅ PASSED all filters');
    window.filterDebugCount++;
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
      ⚠️ Full database network contains ${nodes.length} nodes and would be too complex to visualize effectively.<br>
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
        <h3 style="margin-top:0;">📊 ${subset.label}</h3>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;margin:1rem 0;">
          <div style="font-size:0.875rem;color:#666;margin-bottom:0.5rem;">Network Statistics:</div>
          <div style="font-size:2rem;font-weight:700;color:#667eea;margin-bottom:0.25rem;">${totalNodes.toLocaleString()}</div>
          <div style="font-size:0.875rem;color:#666;">total entities in this network</div>
        </div>
        
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:0.5rem;padding:1rem;margin:1rem 0;">
          <div style="font-weight:600;margin-bottom:0.5rem;">⚠️ Network too large to visualize</div>
          <div style="font-size:0.875rem;color:#666;">
            Visualizing ${totalNodes.toLocaleString()} nodes would overwhelm your browser.
          </div>
        </div>
        
        <div style="margin-top:1.5rem;">
          <div style="font-weight:600;margin-bottom:0.75rem;">💡 Recommended approaches:</div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <button id="network-sample-btn" class="chip" style="padding:0.75rem;text-align:left;background:#fff;display:flex;align-items:center;gap:0.5rem;width:100%;">
              <span style="font-size:1.2rem;">🎲</span>
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
            
            <button id="network-search-mode-btn" class="chip" style="padding:0.75rem;text-align:left;background:#667eea;color:white;display:flex;align-items:center;gap:0.5rem;width:100%;">
              <span style="font-size:1.2rem;">🔍</span>
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
  
  // Reset debug counter for filtering logs
  window.filterDebugCount = 0;
  console.log('🔬 Starting buildSampledNetwork with:', { entityTypes, sampleSize });
  
  // Handle entity type filtering
  let types;
  if (entityTypes === null || entityTypes === undefined) {
    types = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx']; // No filter = all types
  } else if (Array.isArray(entityTypes) && entityTypes.length === 0) {
    // Empty array = nothing selected, show message
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">⚠️ No entity types selected. Check at least one entity type in the filters.</div>';
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
  
  console.log(`📊 Indexed ${nodeInfo.size} nodes after filtering`);
  
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
  
  console.log(`Sample network: ${nodes.length} nodes, ${links.length} links`);
  renderD3Network(mount, nodes, links);
}

// Build hubs network - most connected entities with their neighborhoods
function buildHubsNetwork(entityTypes, topN) {
  const mount = document.getElementById('network-mount');
  if (!mount) return;
  
  mount.innerHTML = '<div style="padding:1rem;text-align:center;color:#666;">Finding most connected entities...</div>';
  
  // Reset debug counter for filtering logs
  window.filterDebugCount = 0;
  console.log('🔬 Starting buildHubsNetwork with:', { entityTypes, topN });
  
  // Handle entity type filtering
  let types;
  if (entityTypes === null || entityTypes === undefined) {
    types = ['su', 'ms', 'pu', 'hi', 'mi', 'hp', 'tx']; // No filter = all types
  } else if (Array.isArray(entityTypes) && entityTypes.length === 0) {
    // Empty array = nothing selected, show message
    mount.innerHTML = '<div style="padding:2rem;text-align:center;color:#999;">⚠️ No entity types selected. Check at least one entity type in the filters.</div>';
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
  
  console.log(`📊 Indexed ${nodeData.size} nodes after filtering`);
  
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
  
  console.log('Top hubs:', topHubs.map(h => `${MAP[h.type].title(h.rec)} (${h.connectionCount} connections)`));
  
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
  
  console.log(`Hub network: ${nodes.length} nodes (${topHubs.length} hubs), ${links.length} links`);
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
  
  // Store zoom object for button controls
  svg.zoomBehavior = zoom;
  mount._d3Svg = svg;
  mount._d3Transform = d3.zoomIdentity;
  
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
  
  // Store zoom object for button controls
  svg.zoomBehavior = zoom;
  mount._d3Svg = svg;
  mount._d3Transform = d3.zoomIdentity;
  
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

/* Network control event handlers - MOVED TO initEventListeners()
document.getElementById('network-refresh')?.addEventListener('click', () => {
  if (ACTIVE_MODE === 'network') buildNetworkView();
});

document.getElementById('network-show-labels')?.addEventListener('change', () => {
  if (ACTIVE_MODE === 'network') buildNetworkView();
});

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

document.getElementById('network-reset-layout')?.addEventListener('click', () => {
  const svg = d3.select('#network-mount svg');
  const data = svg.datum();
  if (data && data.zoom) {
    svg.transition().duration(750).call(data.zoom.transform, d3.zoomIdentity);
  }
});

document.getElementById('network-export')?.addEventListener('click', () => {
  if (!NETWORK_CURRENT_REC || !NETWORK_CURRENT_TYPE) return;
  exportNetworkForAnalysis(NETWORK_CURRENT_REC, NETWORK_CURRENT_TYPE);
});
*/

// Export current network for analysis
// Export current network view
let CURRENT_NETWORK_DATA = { nodes: [], links: [] }; // Store current network data

function exportCurrentNetwork(format) {
  if (!CURRENT_NETWORK_DATA.nodes || CURRENT_NETWORK_DATA.nodes.length === 0) {
    alert('⚠️ No network to export\n\nPlease generate a network first (Random Sample, Top Hubs, or search for a record).');
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
            `📄 ${filename}_nodes.csv (${CURRENT_NETWORK_DATA.nodes.length} nodes)\n` +
            `📄 ${filename}_edges.csv (${CURRENT_NETWORK_DATA.links.length} edges)\n\n` +
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
            `📄 ${filename}.csv (${CURRENT_NETWORK_DATA.links.length} edges)\n` +
            `📄 ${filename}.R (analysis script)\n\n` +
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
    alert('⚠️ No visualization to export');
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
    alert('⚠️ No visualization to export');
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
    alert('⚠️ Failed to export PNG. Please try SVG export instead.');
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
    alert('⚠️ No map to export');
    return;
  }
  
  // Show loading indicator
  const originalCursor = mapElement.style.cursor;
  mapElement.style.cursor = 'wait';
  
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
    }, 'image/png');
  }).catch(error => {
    console.error('Map export error:', error);
    mapElement.style.cursor = originalCursor;
    alert('⚠️ Failed to export map. Please try again or use a screenshot tool.');
  });
}

/**
 * Export analytics visualization (handles multiple viz types)
 * @param {string} format - 'svg' or 'png'
 */
function exportAnalyticsVisualization(format) {
  const analyticsMount = document.getElementById('analytics-mount');
  
  if (!analyticsMount) {
    alert('⚠️ No analytics visualization to export');
    return;
  }
  
  // Try to find SVG element (most analytics use D3 SVG)
  const svgElement = analyticsMount.querySelector('svg');
  
  if (!svgElement) {
    // If no SVG, might be a complex HTML viz, use html2canvas
    if (format === 'png') {
      analyticsMount.style.cursor = 'wait';
      html2canvas(analyticsMount, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 3,
        logging: false
      }).then(canvas => {
        canvas.toBlob(function(blob) {
          const vizType = document.getElementById('analytics-viz-type')?.value || 'dashboard';
          const filename = `unknownhands-analytics-${vizType}-${Date.now()}.png`;
          downloadFile(blob, filename, 'image/png');
          analyticsMount.style.cursor = '';
        }, 'image/png');
      }).catch(error => {
        console.error('Analytics export error:', error);
        analyticsMount.style.cursor = '';
        alert('⚠️ Failed to export visualization. Please try again.');
      });
    } else {
      alert('⚠️ This visualization type does not support SVG export. Please use PNG export.');
    }
    return;
  }
  
  // Export SVG
  const vizType = document.getElementById('analytics-viz-type')?.value || 'dashboard';
  const filename = `unknownhands-analytics-${vizType}-${Date.now()}.${format}`;
  
  if (format === 'svg') {
    exportSvgAsSvg(svgElement, filename);
  } else if (format === 'png') {
    exportSvgAsPng(svgElement, filename, 3);
  }
}

/**
 * Export individual manuscript tree item as SVG using foreignObject
 * @param {HTMLElement} treeItem - The manuscript tree item div
 * @param {string} msId - The manuscript ID for filename
 */
function exportTreeItemAsSvg(treeItem, msId) {
  if (!treeItem) {
    alert('⚠️ No tree item to export');
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
    alert('⚠️ No tree item to export');
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
    alert('⚠️ Failed to export tree. Please try again.');
  });
}

/* Network refresh button - MOVED TO initEventListeners()
document.getElementById('network-refresh')?.addEventListener('click', () => {
  if (ACTIVE_VIEW === 'network') buildNetworkView();
});
*/

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
  console.log('🔧 Setting up event listeners...');
  
  // Entity switching
  const entitySwitch = document.getElementById('entity-switch');
  if (entitySwitch) {
    entitySwitch.addEventListener('click', (e)=>{
      const btn = e.target.closest('.entity-btn'); if (!btn) return;
      console.log('🖱️ Entity button clicked:', btn.dataset.entity);
      switchEntity(btn.dataset.entity);
    });
  } else {
    console.error('❌ entity-switch not found');
  }
  
  // Pagination
  if ($prev) $prev.addEventListener('click',()=>{ page=Math.max(1,page-1); renderCurrent(); updateAvailableViews(); });
  if ($next) $next.addEventListener('click',()=>{ page=page+1; renderCurrent(); updateAvailableViews(); });
  
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
  
  // Filter tab switching
  const filterTabs = document.querySelectorAll('.filter-tab');
  console.log('🔧 Setting up', filterTabs.length, 'filter tabs');
  
  // Add CSS for tabs dynamically
  const tabStyle = document.createElement('style');
  tabStyle.textContent = `
    .filter-tab { transition: all 0.2s ease; }
    .filter-tab:hover { color: #333 !important; background: rgba(0,0,0,0.03) !important; }
    .filter-tab.active { color: #007bff !important; border-bottom-color: #007bff !important; }
    .filter-tab-content { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(tabStyle);
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      console.log('🖱️ Tab clicked:', targetTab);
      // Update active tab styling
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Show/hide content
      document.querySelectorAll('.filter-tab-content').forEach(content => {
        content.style.display = content.dataset.tab === targetTab ? 'block' : 'none';
      });
    });
  });
  
  // Network entity type filters
  document.querySelectorAll('.network-entity-filter').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      if (ACTIVE_MODE === 'network') buildNetworkView();
    });
  });
  
  // Network field filters
  // Dropdown filters (immediate rebuild on change)
  const dropdownFilters = [
    'network-filter-country', 'network-filter-century', 'network-filter-language', 
    'network-filter-genre', 'network-filter-script', 'network-filter-material',
    'network-filter-role', 'network-filter-decoration', 'network-filter-gender'
  ];
  console.log('🔧 Setting up', dropdownFilters.length, 'dropdown filters');
  dropdownFilters.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', () => {
        console.log('🔄 Dropdown changed:', id, '=', el.value);
        if (ACTIVE_MODE === 'network') buildNetworkView();
      });
    } else {
      console.warn('⚠️ Dropdown filter element not found:', id);
    }
  });
  
  // Text field filters (debounced)
  const textFilters = [
    'network-filter-production-location', 'network-filter-shelfmark',
    'network-filter-folio-start', 'network-filter-folio-end'
  ];
  console.log('🔧 Setting up', textFilters.length, 'text field filters');
  textFilters.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', debounce(() => {
        if (ACTIVE_MODE === 'network') buildNetworkView();
      }, 500));
    } else {
      console.warn('⚠️ Text filter element not found:', id);
    }
  });
  
  // Numeric filters (folios range)
  ['network-filter-folios-min', 'network-filter-folios-max'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', debounce(() => {
        if (ACTIVE_MODE === 'network') buildNetworkView();
      }, 500));
    } else {
      console.warn('⚠️ Numeric filter element not found:', id);
    }
  });
  
  // Clear all filters
  document.getElementById('network-clear-filters')?.addEventListener('click', () => {
    console.log('🗑️ Clearing all filters');
    // Reset entity type checkboxes
    document.querySelectorAll('.network-entity-filter').forEach(cb => cb.checked = true);
    // Reset ALL filters (dropdowns and text inputs)
    const allFilterIds = [
      'network-filter-genre', 'network-filter-language', 'network-filter-century', 'network-filter-country',
      'network-filter-production-location', 'network-filter-material', 'network-filter-shelfmark',
      'network-filter-script', 'network-filter-role',
      'network-filter-folio-start', 'network-filter-folio-end', 'network-filter-folios-min', 
      'network-filter-folios-max', 'network-filter-decoration', 'network-filter-gender'
    ];
    allFilterIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    // Rebuild
    if (ACTIVE_MODE === 'network') buildNetworkView();
  });
  
  // Network zoom controls
  document.getElementById('network-zoom-in')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._d3Svg) {
      const svg = mount._d3Svg;
      const zoom = svg.zoomBehavior;
      svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    }
  });
  
  document.getElementById('network-zoom-out')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._d3Svg) {
      const svg = mount._d3Svg;
      const zoom = svg.zoomBehavior;
      svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    }
  });
  
  document.getElementById('network-zoom-reset')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._d3Svg) {
      const svg = mount._d3Svg;
      const zoom = svg.zoomBehavior;
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    }
  });
  
  document.getElementById('network-zoom-fit')?.addEventListener('click', () => {
    const mount = document.getElementById('network-mount');
    if (mount && mount._d3Svg) {
      const svg = mount._d3Svg;
      const zoom = svg.zoomBehavior;
      const g = svg.select('g');
      
      // Get bounds of all nodes
      try {
        const bounds = g.node().getBBox();
        const width = mount.clientWidth || 800;
        const height = mount.clientHeight || 600;
        
        const dx = bounds.width;
        const dy = bounds.height;
        const x = bounds.x + bounds.width / 2;
        const y = bounds.y + bounds.height / 2;
        
        const scale = Math.min(0.9 / Math.max(dx / width, dy / height), 3);
        const translate = [width / 2 - scale * x, height / 2 - scale * y];
        
        const transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
        svg.transition().duration(750).call(zoom.transform, transform);
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
      alert('⚠️ No network visualization to export\n\nPlease generate a network first.');
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
      alert('⚠️ No network visualization to export\n\nPlease generate a network first.');
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
      alert('⚠️ No timeline visualization to export\n\nPlease switch to Timeline view first.');
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
      alert('⚠️ No timeline visualization to export\n\nPlease switch to Timeline view first.');
    }
  });
  
  // Analytics SVG export
  document.getElementById('analytics-export-svg')?.addEventListener('click', () => {
    exportAnalyticsVisualization('svg');
  });
  
  // Analytics PNG export
  document.getElementById('analytics-export-png')?.addEventListener('click', () => {
    exportAnalyticsVisualization('png');
  });
  
  console.log('✓ All event listeners attached');
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
  
  // Display source record
  $pathFrom.innerHTML = `<strong>From:</strong> ${linkTo(type, rec.rec_ID, MAP[type].title(rec))} (${type.toUpperCase()})`;
  
  // Clear search
  $pathSearch.value = '';
  $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;">Type to search for a target record...</div>';
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
    $pathResults.innerHTML = '<div class="muted" style="padding:.75rem;">No results found</div>';
    return;
  }
  
  let html = '<div style="padding:.5rem;">';
  top.forEach(({ rec, type, title }) => {
    html += `<div style="padding:.5rem;cursor:pointer;border-radius:.25rem;" 
      class="path-result-item" 
      data-type="${type}" 
      data-id="${rec.rec_ID}"
      onmouseover="this.style.background='#f0f0f0'" 
      onmouseout="this.style.background='transparent'">
      ${esc(title)} <span class="muted" style="font-size:.9rem;">(${type.toUpperCase()})</span>
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
  
  $pathDisplay.innerHTML = '<div class="muted" style="padding:.75rem;">Searching for paths...</div>';
  
  // Run path finding (with a small delay to show searching message)
  setTimeout(() => {
    const paths = findPaths(source.type, source.rec.rec_ID, target.type, target.rec.rec_ID, depth);
    
    let html = `<div style="margin:.75rem 0;padding:.75rem;background:#e9f3ff;border-radius:.5rem;">
      <strong>Target:</strong> ${linkTo(target.type, target.rec.rec_ID, MAP[target.type].title(target.rec))} (${target.type.toUpperCase()})
    </div>`;
    
    if (paths.length === 0) {
      html += '<div class="muted" style="padding:.75rem;">No paths found within depth ' + depth + '. Try increasing the max depth.</div>';
    } else {
      html += displayPaths(paths);
      
      // Add export option
      html += `<div style="margin-top:1rem;">
        <button class="chip" id="export-paths-gephi" style="padding:.5rem .75rem;">📊 Export for Gephi</button>
        <button class="chip" id="export-paths-r" style="padding:.5rem .75rem;">📊 Export for R</button>
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
  
  const vizType = document.getElementById('analytics-viz-type')?.value || 'dashboard';
  
  // Reset tree display count when switching away from tree view
  if (vizType !== 'tree' && window.treeDisplayCount) {
    window.treeDisplayCount = 10;
  }
  
  // Always use all entities for analytics visualizations
  let list = [];
  Object.keys(DATA).forEach(entityType => {
    if (DATA[entityType] && Array.isArray(DATA[entityType])) {
      DATA[entityType].forEach(record => {
        list.push({ ...record, rty: entityType }); // Ensure rty is set
      });
    }
  });

  // Show/hide tree search panel
  const treeSearchPanel = document.getElementById('tree-search-panel');
  if (treeSearchPanel) {
    treeSearchPanel.style.display = vizType === 'tree' ? 'block' : 'none';
  }

  // Clear mount
  mount.innerHTML = '';

  // Build selected visualization
  switch (vizType) {
    case 'dashboard':
      buildStatisticalDashboard(mount, list);
      break;
    case 'codicology':
      buildCodicologicalAnalysis(mount, list);
      break;
    case 'sankey':
      buildSankeyDiagram(mount, list);
      break;
    case 'matrix':
      buildMatrixVisualization(mount, list);
      break;
    case 'chord':
      buildChordDiagram(mount, list);
      break;
    case 'tree':
      buildHierarchicalTree(mount, list);
      break;
  }
}

// Update description text when visualization type changes
const analyticsVizSelect = document.getElementById('analytics-viz-type');
const analyticsDescription = document.getElementById('analytics-description');
const entityFilterPanel = document.getElementById('entity-filter-panel');
const treeSearchPanel = document.getElementById('tree-search-panel');

if (analyticsVizSelect && analyticsDescription) {
  analyticsVizSelect.addEventListener('change', () => {
    const vizType = analyticsVizSelect.value;
    const descriptions = {
      dashboard: '<strong>Statistical Dashboard:</strong> Provides quantitative overview of the corpus including record counts, date ranges, and key attributes by entity type. Helps identify dataset completeness, temporal distribution, and notable characteristics. Essential for understanding corpus composition and identifying trends or gaps in the data.',
      codicology: '<strong>Codicological Analysis:</strong> Quantitative analysis of manuscript physical features including size, material, quire structure, ruling, and scribal practices. Explore correlations between variables like gender and size, material and dimensions, catchwords and quire types, etc. Statistical tests help identify significant patterns in manuscript production practices across different contexts.',
      sankey: '<strong>Sankey Diagram:</strong> Visualizes relationship flows between entity types, showing how different entities connect throughout the corpus (e.g., Manuscripts → Production Units → Scribal Units → Historical People). Flow width represents connection frequency. Reveals collaboration patterns, manuscript production networks, and entity co-occurrence. Top 15 flows displayed, with filtering by relationship type.',
      matrix: '<strong>Matrix Visualization:</strong> Heatmap displaying connection density between all entity type pairs. Color intensity indicates relationship strength. Useful for identifying highly connected entity types, discovering unexpected relationships, and understanding the overall network structure of the corpus. Reveals which entity types most frequently connect.',
      chord: '<strong>Chord Diagram:</strong> Circular visualization highlighting proportional entity connections across the corpus. Arc size represents total connections per entity type. Shows network centrality and relative importance of each entity type in the relationship network. Helps identify hub entities and connection distribution patterns.',
      tree: '<strong>Hierarchical Tree:</strong> Displays manuscript structure hierarchy (Manuscripts → Production Units → Scribal Units) showing physical codicological relationships. Reveals composite manuscript structure, production unit organization, and scribal hand distribution. Useful for understanding manuscript complexity and codicological makeup. Search for specific manuscripts or view all with "Show More".'
    };
    analyticsDescription.innerHTML = descriptions[vizType] || '';
    
    // Show/hide entity filter (only for dashboard)
    if (entityFilterPanel) {
      entityFilterPanel.style.display = (vizType === 'dashboard') ? 'block' : 'none';
    }
    
    // Show/hide codicology panel (only for codicology)
    const codicologyPanel = document.getElementById('codicology-panel');
    if (codicologyPanel) {
      codicologyPanel.style.display = (vizType === 'codicology') ? 'block' : 'none';
    }
    
    // Show/hide tree search (only for tree)
    if (treeSearchPanel) {
      treeSearchPanel.style.display = (vizType === 'tree') ? 'block' : 'none';
    }
    
    buildAnalytics();
  });
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
const treeFilterInterleaved = document.getElementById('tree-filter-interleaved');
const treeFilterCrossMSPU = document.getElementById('tree-filter-cross-ms-pu');
const treeFilterCrossPUSU = document.getElementById('tree-filter-cross-pu-su');
const treeFilterMultiPU = document.getElementById('tree-filter-multi-pu');

if (treeSearchInput) {
  treeSearchInput.addEventListener('input', () => {
    buildAnalytics();
  });
}

if (treeSearchClear) {
  treeSearchClear.addEventListener('click', () => {
    if (treeSearchInput) {
      treeSearchInput.value = '';
      buildAnalytics();
    }
  });
}

if (treeSortSelect) {
  treeSortSelect.addEventListener('change', () => {
    buildAnalytics();
  });
}

// Add event listeners for filter checkboxes
[treeFilterInterleaved, treeFilterCrossMSPU, treeFilterCrossPUSU, treeFilterMultiPU].forEach(checkbox => {
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      buildAnalytics();
    });
  }
});

// Codicological analysis controls
const codicAnalysisType = document.getElementById('codic-analysis-type');
const codicVizType = document.getElementById('codic-viz-type');
const codicCustomPanel = document.getElementById('codic-custom-panel');

if (codicAnalysisType) {
  codicAnalysisType.addEventListener('change', (e) => {
    // Show/hide custom panel
    if (codicCustomPanel) {
      codicCustomPanel.style.display = (e.target.value === 'custom') ? 'block' : 'none';
    }
    buildAnalytics();
  });
}

if (codicVizType) {
  codicVizType.addEventListener('change', () => {
    buildAnalytics();
  });
}

// Custom variable selectors
['codic-x-var', 'codic-y-var', 'codic-color-var'].forEach(id => {
  const select = document.getElementById(id);
  if (select) {
    select.addEventListener('change', () => {
      buildAnalytics();
    });
  }
});

// Statistical Dashboard
function buildStatisticalDashboard(mount, list) {
  // Get selected entity filter
  const entityFilter = document.getElementById('entity-filter-select')?.value || 'all';
  
  // Build statistics cards based on entity type
  let statsCards = [];
  
  if (entityFilter === 'all') {
    // All entities view
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('Entity Types', getUniqueCount(list, 'rty'), '🏛️'),
      buildStatsCard('Date Range', getDateRange(list), '📅'),
      buildStatsCard('With Dates', getRecordsWithDates(list), '⏰')
    ];
  } else if (entityFilter === 'su') {
    // Scribal Units
    const withDates = getRecordsWithDates(list);
    const withScript = getCountByFieldExists(list, 'Normalised script(s)');
    const withLanguage = getCountByFieldExists(list, 'Colophon language');
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('Date Range', getDateRange(list), '📅'),
      buildStatsCard('With Script', withScript, '✍️'),
      buildStatsCard('With Language', withLanguage, '🗣️')
    ];
  } else if (entityFilter === 'ms') {
    // Manuscripts
    const avgFolios = getAverageFolios(list);
    const withDigitization = getCountByFieldExists(list, 'Digitization Status');
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('Date Range', getDateRange(list), '📅'),
      buildStatsCard('Avg Folios', avgFolios, '📄'),
      buildStatsCard('Digitized', withDigitization, '💻')
    ];
  } else if (entityFilter === 'pu') {
    // Production Units
    const withLocation = getCountByFieldExists(list, 'Production unit location');
    const withCountry = getCountByFieldExists(list, 'PU country');
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('Date Range', getDateRange(list), '📅'),
      buildStatsCard('With Location', withLocation, '📍'),
      buildStatsCard('With Country', withCountry, '🌍')
    ];
  } else if (entityFilter === 'hp') {
    // Historical People
    const withGender = getCountByFieldExists(list, 'Gender');
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('Date Range', getDateRange(list), '📅'),
      buildStatsCard('With Gender', withGender, '👤'),
      buildStatsCard('With Dates', getRecordsWithDates(list), '⏰')
    ];
  } else if (entityFilter === 'tx') {
    // Texts
    const withGenre = getCountByFieldExists(list, 'Genre');
    const withSubgenre = getCountByFieldExists(list, 'Subgenre');
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('With Genre', withGenre, '📚'),
      buildStatsCard('With Subgenre', withSubgenre, '📖'),
      buildStatsCard('Date Range', getDateRange(list), '📅')
    ];
  } else if (entityFilter === 'hi') {
    // Holding Institutions
    const withType = getCountByFieldExists(list, 'Institution type');
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('With Type', withType, '🏛️'),
      buildStatsCard('Countries', getUniqueFieldCount(list, 'Country'), '🌍'),
      buildStatsCard('Cities', getUniqueFieldCount(list, 'City'), '🏙️')
    ];
  } else if (entityFilter === 'mi') {
    // Monastic Institutions
    const withOrder = getCountByFieldExists(list, 'Religious order');
    const withType = getCountByFieldExists(list, 'Type of monastery');
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('With Order', withOrder, '⛪'),
      buildStatsCard('With Type', withType, '🏰'),
      buildStatsCard('Countries', getUniqueFieldCount(list, 'Country'), '�')
    ];
  } else {
    // Default fallback
    statsCards = [
      buildStatsCard('Total Records', list.length, '📊'),
      buildStatsCard('Date Range', getDateRange(list), '📅'),
      buildStatsCard('With Dates', getRecordsWithDates(list), '⏰')
    ];
  }
  
  let chartsHtml = '';
  
  // Entity Distribution - only show for "all entities"
  if (entityFilter === 'all') {
    chartsHtml += `
      <div style="margin-top: 1.5rem;">
        <h3 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Entity Distribution</h3>
        ${buildEntityDistributionChart(list)}
      </div>
    `;
  }
  
  // Temporal Distribution - only for entities with dates (su, pu, all)
  if (entityFilter === 'all' || entityFilter === 'su' || entityFilter === 'pu' || entityFilter === 'ms' || entityFilter === 'hp' || entityFilter === 'tx') {
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

function buildStatsCard(label, value, icon) {
  return `
    <div style="background: linear-gradient(135deg, #d4af37 0%, #c4941f 100%); color: white; padding: 1.25rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="font-size: 2rem; margin-bottom: 0.25rem;">${icon}</div>
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

function getCountByFieldExists(list, fieldName) {
  return list.filter(r => {
    const val = getVal(r, fieldName);
    return val && val !== '—' && val !== '';
  }).length;
}

function getCountByField(list, fieldName, values) {
  return list.filter(r => {
    const val = getVal(r, fieldName);
    return val && values.includes(val);
  }).length;
}

function getUniqueFieldCount(list, fieldName) {
  return new Set(list.map(r => r[field])).size;
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
          <div style="width: ${width}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
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
          <div style="width: ${width}%; height: 100%; background: ${color}; transition: width 0.3s;"></div>
        </div>
      </div>
    `;
  }).join('');
  
  const moreInfo = sortedEntries.length > 10 ? 
    `<p style="color: #666; font-size: 0.8rem; margin-top: 0.5rem; font-style: italic;">Showing top 10 of ${sortedEntries.length} values</p>` : '';
  
  return `<div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem;">${bars}${moreInfo}</div>`;
}

function buildTemporalChart(list) {
  // Extract years and create histogram
  const years = [];
  list.forEach(r => {
    const tpq = getVal(r, 'Normalized terminus post quem');
    const taq = getVal(r, 'Normalized terminus ante quem');
    const dateStr = tpq || taq;
    if (dateStr) {
      const match = String(dateStr).match(/(\d{3,4})/);
      if (match) {
        const year = parseInt(match[1]);
        if (year >= 800 && year <= 1800) years.push(year);
      }
    }
  });
  
  if (years.length === 0) {
    return '<p style="color: #666; font-style: italic;">No temporal data available</p>';
  }
  
  // Create century bins
  const bins = {};
  years.forEach(year => {
    const century = Math.floor(year / 100) * 100;
    bins[century] = (bins[century] || 0) + 1;
  });
  
  const sortedCenturies = Object.keys(bins).map(Number).sort((a, b) => a - b);
  const maxCount = Math.max(...Object.values(bins));
  
  const bars = sortedCenturies.map(century => {
    const count = bins[century];
    const height = (count / maxCount) * 200;
    const pct = Math.round((count / years.length) * 100);
    
    return `
      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
        <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">${count}</div>
        <div style="width: 80%; min-height: ${height}px; background: linear-gradient(to top, #d4af37, #f4d03f); border-radius: 4px 4px 0 0; transition: min-height 0.3s;" title="${century}s: ${count} records (${pct}%)"></div>
        <div style="font-size: 0.875rem; font-weight: 500; margin-top: 0.5rem;">${century}s</div>
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
  const analysisType = document.getElementById('codic-analysis-type')?.value || 'material-size';
  const vizType = document.getElementById('codic-viz-type')?.value || 'scatter';
  
  // Filter to relevant entity types
  const msRecords = list.filter(r => r.rty === 'ms');
  const suRecords = list.filter(r => r.rty === 'su');
  const puRecords = list.filter(r => r.rty === 'pu');
  
  let html = '';
  
  switch (analysisType) {
    case 'material-size':
      html = analyzeMaterialVsSize(msRecords, puRecords, vizType);
      break;
    case 'size-date':
      html = analyzeSizeVsDate(msRecords, puRecords, vizType);
      break;
    case 'quire-patterns':
      html = analyzeQuirePatterns(msRecords, puRecords, vizType);
      break;
    case 'column-patterns':
      html = analyzeColumnPatterns(msRecords, puRecords, vizType);
      break;
    case 'margin-ratio':
      html = analyzeMarginRatio(msRecords, puRecords, vizType);
      break;
    case 'custom':
      html = analyzeCustomVariables(msRecords, puRecords, vizType);
      break;
    default:
      html = '<div style="padding: 2rem; text-align: center; color: #666;">Select an analysis type</div>';
  }
  
  mount.innerHTML = html;
}

// Helper function to calculate manuscript size as height + width
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

// Helper function to extract width from size string or codex width field
function extractWidth(rec) {
  // Try to get Codex width field directly
  let width = getVal(rec, 'Codex width');
  if (width && width !== '—') {
    const num = parseFloat(width);
    if (!isNaN(num)) return num;
  }
  
  // Fallback to parsing size string
  const sizeStr = getVal(rec, 'Size');
  if (!sizeStr) return null;
  const match = String(sizeStr).match(/×\s*(\d+)/);
  return match ? parseInt(match[1]) : null;
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

// Analysis 6: Custom Multi-Variable
function analyzeCustomVariables(msRecords, puRecords, vizType) {
  // Get custom variable selections
  const xVar = document.getElementById('codic-x-var')?.value || 'size';
  const yVar = document.getElementById('codic-y-var')?.value || 'date';
  const colorVar = document.getElementById('codic-color-var')?.value || 'none';
  
  const dataPoints = [];
  
  // Helper to extract value by variable name
  function extractValue(ms, pu, varName) {
    if (varName === 'size') return extractSize(ms);
    if (varName === 'width') return extractWidth(ms);
    if (varName === 'folios') {
      const folios = getVal(ms, 'Number of Folios');
      return folios ? parseInt(folios) : null;
    }
    if (varName === 'date') return pu ? extractDate(pu) : null;
    if (varName === 'justification-height') return pu ? extractJustificationHeight(pu) : null;
    if (varName === 'justification-width') return pu ? extractJustificationWidth(pu) : null;
    if (varName === 'columns') return pu ? extractColumns(pu) : null;
    if (varName === 'material') return pu ? getMaterialFromPU(pu) : null;
    if (varName === 'country') return pu ? extractCountry(pu) : null;
    return null;
  }
  
  msRecords.forEach(ms => {
    const msId = String(ms.rec_ID);
    const pus = (INBOUND.pu?.[msId] || []);
    
    if (pus.length > 0) {
      pus.forEach(puId => {
        const pu = IDX.pu?.[puId];
        const xVal = extractValue(ms, pu, xVar);
        const yVal = extractValue(ms, pu, yVar);
        const colorVal = colorVar !== 'none' ? extractValue(ms, pu, colorVar) : null;
        
        if (xVal !== null && yVal !== null) {
          dataPoints.push({
            x: xVal,
            y: yVal,
            color: colorVal,
            title: MAP.ms?.title(ms) || 'Untitled'
          });
        }
      });
    } else {
      // MS without PU - try without PU data
      const xVal = extractValue(ms, null, xVar);
      const yVal = extractValue(ms, null, yVar);
      const colorVal = colorVar !== 'none' ? extractValue(ms, null, colorVar) : null;
      
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
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No data available for selected variables</div>';
  }
  
  // Get variable labels
  const varLabels = {
    size: 'Height (mm)',
    width: 'Width (mm)',
    date: 'Year',
    folios: 'Number of Folios',
    material: 'Material',
    columns: 'Columns',
    country: 'Country',
    'justification-height': 'Justification Height (mm)',
    'justification-width': 'Justification Width (mm)'
  };
  
  const xLabel = varLabels[xVar] || xVar;
  const yLabel = varLabels[yVar] || yVar;
  
  let html = '<div style="margin-bottom: 1rem;"><h3 style="color: #856404;">Custom Multi-Variable Analysis</h3>';
  html += `<p style="font-size: 0.875rem; color: #666;">Total data points: ${dataPoints.length}</p></div>`;
  
  if (vizType === 'scatter') {
    html += buildScatterPlot(`${xLabel} vs ${yLabel}`, dataPoints, 'x', 'y', xLabel, yLabel, colorVar !== 'none' ? 'color' : null);
  } else if (vizType === 'stats') {
    // Group by color variable if present
    if (colorVar !== 'none' && colorVar) {
      const byColor = {};
      dataPoints.forEach(d => {
        const key = String(d.color || 'Unknown');
        if (!byColor[key]) byColor[key] = [];
        byColor[key].push(d.y);
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
      
      html += buildStatsTable(`${yLabel} by ${varLabels[colorVar] || colorVar}`, stats, '');
    } else {
      html += '<div style="padding: 1rem; background: #f8f9fa; border-radius: 0.25rem;">Select a "Color By" variable to see grouped statistics</div>';
    }
  } else {
    html += '<div>Visualization type not fully supported for custom variables. Try scatter plot or stats table.</div>';
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
  const xValues = dataPoints.map(d => d[xVar]);
  const yValues = dataPoints.map(d => d[yVar]);
  const xMin = Math.min(...yValues);
  const xMax = Math.max(...yValues);
  const yMin = Math.min(...yValues.filter(v => v !== null));
  const yMax = Math.max(...yValues.filter(v => v !== null));
  
  const width = 600;
  const height = 400;
  const padding = 40;
  
  const xScale = (width - 2 * padding) / (xMax - xMin);
  const yScale = (height - 2 * padding) / (yMax - yMin);
  
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
  const colorMap = {};
  let colorIndex = 0;
  
  const points = dataPoints.map(d => {
    let color = '#d4af37';
    if (colorVar && d[colorVar]) {
      if (!colorMap[d[colorVar]]) {
        colorMap[d[colorVar]] = colors[colorIndex % colors.length];
        colorIndex++;
      }
      color = colorMap[d[colorVar]];
    }
    
    return `<circle cx="${padding + (d[yVar] - yMin) * yScale}" cy="${height - padding - (d[yVar] - yMin) * yScale}" r="4" fill="${color}" fill-opacity="0.6" stroke="white" stroke-width="1"><title>${d.msTitle || ''}: ${d[yVar]}</title></circle>`;
  }).join('');
  
  return `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">${title}</h3>
      <svg width="${width}" height="${height}" style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#ccc" stroke-width="2"/>
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#ccc" stroke-width="2"/>
        ${points}
        <text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-size="12" fill="#666">${yLabel}</text>
        <text x="10" y="${height / 2}" text-anchor="middle" font-size="12" fill="#666" transform="rotate(-90, 10, ${height / 2})">${yLabel}</text>
      </svg>
      <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">n=${dataPoints.length} manuscripts</p>
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

function analyzeCustomVariables(msRecords, suRecords, vizType) {
  // Get custom variable selections
  const xVar = document.getElementById('codic-x-var')?.value || 'size';
  const yVar = document.getElementById('codic-y-var')?.value || 'date';
  const colorVar = document.getElementById('codic-color-var')?.value || 'none';
  
  const dataPoints = [];
  
  // Helper to extract value by variable name
  function extractValue(rec, varName) {
    if (varName === 'size') return extractSize(rec);
    if (varName === 'width') return extractWidth(rec);
    if (varName === 'date') return extractDate(rec);
    if (varName === 'folios') {
      const details = rec.details || [];
      for (const d of details) {
        if (d.fieldName === 'Number of folios' && d.value) {
          return parseFloat(d.value);
        }
      }
    }
    if (varName === 'material') {
      // For MS, find PU materials
      if (rec.details) {
        const msId = String(rec.rec_ID);
        const pus = (INBOUND.pu?.[msId] || []);
        const materials = [];
        pus.forEach(puId => {
          const pu = IDX.pu?.[puId];
          if (pu) {
            const mat = getMaterialFromPU(pu);
            if (mat) materials.push(mat);
          }
        });
        return materials.length > 0 ? materials[0] : null;
      }
    }
    if (varName === 'columns') {
      const details = rec.details || [];
      for (const d of details) {
        if (d.fieldName === 'Number of columns' && d.value) {
          return parseFloat(d.value);
        }
      }
    }
    return null;
  }
  
  msRecords.forEach(ms => {
    const xVal = extractValue(ms, xVar);
    const yVal = extractValue(ms, yVar);
    const colorVal = colorVar !== 'none' ? extractValue(ms, colorVar) : null;
    
    if (xVal !== null && yVal !== null) {
      dataPoints.push({
        x: xVal,
        y: yVal,
        color: colorVal,
        title: MAP.ms?.title(ms) || 'Untitled'
      });
    }
  });
  
  if (dataPoints.length === 0) {
    return '<div style="padding: 2rem; text-align: center; color: #666;">No data available for selected variables</div>';
  }
  
  // Get variable labels
  const varLabels = {
    size: 'Height (mm)',
    width: 'Width (mm)',
    date: 'Year',
    folios: 'Number of Folios',
    material: 'Material',
    columns: 'Columns'
  };
  
  const xLabel = varLabels[xVar] || xVar;
  const yLabel = varLabels[yVar] || yVar;
  
  if (vizType === 'scatter') {
    return buildScatterPlot(`${xLabel} vs ${yLabel}`, dataPoints, 'x', 'y', xLabel, yLabel, colorVar !== 'none' ? 'color' : null);
  } else if (vizType === 'stats') {
    // Group by color variable if present
    if (colorVar !== 'none' && colorVar) {
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
      
      return buildStatsTable(`${yLabel} by ${varLabels[colorVar]}`, stats, '');
    }
  }
  
  return '<div>Visualization type not supported for this configuration</div>';
}

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
  const xValues = dataPoints.map(d => d[xVar]);
  const yValues = dataPoints.map(d => d[yVar]);
  const xMin = Math.min(...yValues);
  const xMax = Math.max(...yValues);
  const yMin = Math.min(...yValues.filter(v => v !== null));
  const yMax = Math.max(...yValues.filter(v => v !== null));
  
  const width = 600;
  const height = 400;
  const padding = 40;
  
  const xScale = (width - 2 * padding) / (xMax - xMin);
  const yScale = (height - 2 * padding) / (yMax - yMin);
  
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
  const colorMap = {};
  let colorIndex = 0;
  
  const points = dataPoints.map(d => {
    let color = '#d4af37';
    if (colorVar && d[colorVar]) {
      if (!colorMap[d[colorVar]]) {
        colorMap[d[colorVar]] = colors[colorIndex % colors.length];
        colorIndex++;
      }
      color = colorMap[d[colorVar]];
    }
    
    return `<circle cx="${padding + (d[yVar] - yMin) * yScale}" cy="${height - padding - (d[yVar] - yMin) * yScale}" r="4" fill="${color}" fill-opacity="0.6" stroke="white" stroke-width="1"><title>${d.msTitle || ''}: ${d[yVar]}</title></circle>`;
  }).join('');
  
  return `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">${title}</h3>
      <svg width="${width}" height="${height}" style="background: white; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#ccc" stroke-width="2"/>
        <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#ccc" stroke-width="2"/>
        ${points}
        <text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-size="12" fill="#666">${yLabel}</text>
        <text x="10" y="${height / 2}" text-anchor="middle" font-size="12" fill="#666" transform="rotate(-90, 10, ${height / 2})">${yLabel}</text>
      </svg>
      <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">n=${dataPoints.length} manuscripts</p>
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
  // data format: { category1: { subcategory1: count, subcategory2: count }, ... }
  // totals: { category1: total, category2: total, ... }
  
  const categories = Object.keys(data);
  const subCategories = new Set();
  categories.forEach(cat => {
    Object.keys(data[cat]).forEach(sub => subCategories.add(sub));
  });
  const subCatsArray = Array.from(subCategories);
  
  // Color palette for subcategories
  const colors = [
    'rgba(218, 165, 32, 0.8)',   // Gold
    'rgba(184, 134, 11, 0.8)',   // Dark gold
    'rgba(255, 215, 0, 0.8)',    // Light gold
    'rgba(169, 169, 169, 0.8)',  // Gray
    'rgba(128, 128, 128, 0.8)'   // Dark gray
  ];
  
  let html = `
    <div style="padding: 1.5rem;">
      <h3 style="margin-bottom: 1rem;">${title}</h3>
  `;
  
  // Legend
  html += '<div style="margin-bottom: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">';
  subCatsArray.forEach((sub, idx) => {
    const color = colors[idx % colors.length];
    html += `<div style="display: flex; align-items: center; gap: 0.3rem;">
      <div style="width: 20px; height: 20px; background: ${color}; border: 1px solid #ccc;"></div>
      <span>${sub}</span>
    </div>`;
  });
  html += '</div>';
  
  // Bars
  categories.forEach(cat => {
    const total = totals[cat] || 0;
    html += `<div style="margin-bottom: 1rem;">
      <div style="margin-bottom: 0.3rem; font-weight: bold;">${cat} (n=${total})</div>
      <div style="display: flex; height: 30px; border: 1px solid #ddd; overflow: hidden;">
    `;
    
    subCatsArray.forEach((sub, idx) => {
      const count = data[cat][sub] || 0;
      const percentage = total > 0 ? (count / total * 100) : 0;
      const color = colors[idx % colors.length];
      if (percentage > 0) {
        html += `<div style="width: ${percentage}%; background: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem; font-weight: bold;" title="${sub}: ${count} (${percentage.toFixed(1)}%)">${percentage.toFixed(1)}%</div>`;
      }
    });
    
    html += '</div></div>';
  });
  
  html += '</div>';
  return html;
}

// Sankey Diagram - Entity Flow Visualization
function buildSankeyDiagram(mount, list) {
  // Collect entity relationships from REL_INDEX
  const links = [];
  const nodeSet = new Set();
  const listIds = new Set(list.map(r => String(r.rec_ID)));
  
  // Use REL_INDEX to find relationships between entities in the current list
  list.forEach(rec => {
    const recId = String(rec.rec_ID);
    
    // Check outgoing relationships (this record as source)
    const outgoing = REL_INDEX.bySource[recId] || [];
    outgoing.forEach(rel => {
      const tgt = getRes(rel, 'Target record');
      if (!tgt) return;
      const tgtId = String(tgt.id);
      
      // Find source and target entity types
      let sourceType = null, targetType = null;
      for (const et of ['ms', 'su', 'pu', 'mi', 'hi', 'hp', 'tx']) {
        if (IDX[et]?.[recId]) sourceType = et;
        if (IDX[et]?.[tgtId]) targetType = et;
      }
      
      if (sourceType && targetType) {
        const sourceNode = `${sourceType}:${recId}`;
        const targetNode = `${targetType}:${tgtId}`;
        nodeSet.add(sourceNode);
        nodeSet.add(targetNode);
        links.push({
          source: sourceNode,
          target: targetNode,
          value: 1
        });
      }
    });
    
    // Check incoming relationships (this record as target)
    const incoming = REL_INDEX.byTarget[recId] || [];
    incoming.forEach(rel => {
      const src = getRes(rel, 'Source record');
      if (!src) return;
      const srcId = String(src.id);
      
      // Only count if source is also in our current list (to avoid duplicates)
      if (!listIds.has(srcId)) return;
      
      // Find source and target entity types
      let sourceType = null, targetType = null;
      for (const et of ['ms', 'su', 'pu', 'mi', 'hi', 'hp', 'tx']) {
        if (IDX[et]?.[srcId]) sourceType = et;
        if (IDX[et]?.[recId]) targetType = et;
      }
      
      if (sourceType && targetType) {
        const sourceNode = `${sourceType}:${srcId}`;
        const targetNode = `${targetType}:${recId}`;
        nodeSet.add(sourceNode);
        nodeSet.add(targetNode);
        links.push({
          source: sourceNode,
          target: targetNode,
          value: 1
        });
      }
    });
  });
  
  // Aggregate by entity type pairs with relationship details
  const flowCounts = {};
  const flowDetails = {};
  links.forEach(link => {
    const sourceType = link.source.split(':')[0];
    const targetType = link.target.split(':')[0];
    const key = `${sourceType}→${targetType}`;
    flowCounts[key] = (flowCounts[key] || 0) + 1;
    if (!flowDetails[key]) {
      flowDetails[key] = { connections: [], sourceIds: new Set(), targetIds: new Set() };
    }
    flowDetails[key].connections.push(link);
    flowDetails[key].sourceIds.add(link.source);
    flowDetails[key].targetIds.add(link.target);
  });
  
  if (Object.keys(flowCounts).length === 0) {
    mount.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🌊</div>
        <h3 style="margin-bottom: 0.5rem;">Sankey Diagram</h3>
        <p>No relationship flows found in current filtered data</p>
      </div>
    `;
    return;
  }
  
  // Calculate statistics
  const totalFlows = Object.values(flowCounts).reduce((sum, count) => sum + count, 0);
  const uniqueFlowTypes = Object.keys(flowCounts).length;
  
  // Build simplified Sankey visualization with bars
  const sortedFlows = Object.entries(flowCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
  const maxFlow = Math.max(...sortedFlows.map(f => f[1]));
  
  const flowBars = sortedFlows.map(([flow, count], idx) => {
    const [source, target] = flow.split('→');
    const width = (count / maxFlow) * 100;
    const percentage = ((count / totalFlows) * 100).toFixed(1);
    const sourceColor = {ms: '#3498db', su: '#e6b800', pu: '#e74c3c', mi: '#9b59b6', hi: '#2ecc71', hp: '#f39c12', tx: '#1abc9c'}[source] || '#95a5a6';
    const targetColor = {ms: '#3498db', su: '#e6b800', pu: '#e74c3c', mi: '#9b59b6', hi: '#2ecc71', hp: '#f39c12', tx: '#1abc9c'}[target] || '#95a5a6';
    
    const details = flowDetails[flow];
    const uniqueSources = details.sourceIds.size;
    const uniqueTargets = details.targetIds.size;
    
    return `
      <div style="margin-bottom: 1rem; padding: 0.75rem; background: white; border-radius: 0.5rem; border: 1px solid #e0e0e0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-weight: 700; color: #999; font-size: 0.75rem; width: 25px;">#${idx + 1}</span>
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${sourceColor};"></span>
            <span style="font-weight: 500; font-size: 0.875rem;">${MAP[source]?.name || source}</span>
            <span style="color: #999; font-size: 1.2rem;">→</span>
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ${targetColor};"></span>
            <span style="font-weight: 500; font-size: 0.875rem;">${MAP[target]?.name || target}</span>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: #333; font-size: 0.9rem;">${count} connections</div>
            <div style="font-size: 0.7rem; color: #999;">${percentage}% of total</div>
          </div>
        </div>
        <div style="width: 100%; height: 24px; background: #f0f0f0; border-radius: 12px; overflow: hidden; margin-bottom: 0.5rem;">
          <div style="width: ${width}%; height: 100%; background: linear-gradient(90deg, ${sourceColor}, ${targetColor}); transition: width 0.3s;"></div>
        </div>
        <div style="display: flex; gap: 1rem; font-size: 0.7rem; color: #666;">
          <span>📤 ${uniqueSources} unique sources</span>
          <span>📥 ${uniqueTargets} unique targets</span>
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.1rem;">Entity Relationship Flows</h3>
        <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: #666;">
          <span><strong>${totalFlows}</strong> total connections</span>
          <span><strong>${uniqueFlowTypes}</strong> flow types</span>
        </div>
      </div>
      <p style="font-size: 0.875rem; color: #666; margin-bottom: 1rem;">Top 15 most frequent relationship flows</p>
      ${flowBars}
    </div>
  `;
}

// Matrix Visualization - Connection Heatmap
function buildMatrixVisualization(mount, list) {
  // Build connection matrix between entity types
  const entityTypes = ['ms', 'su', 'pu', 'mi', 'hi', 'hp', 'tx'];
  const matrix = {};
  
  // Initialize matrix
  entityTypes.forEach(source => {
    matrix[source] = {};
    entityTypes.forEach(target => {
      matrix[source][target] = 0;
    });
  });
  
  // Count connections from relationships
  DATA.rel?.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    // Find entity types
    let sourceType = null, targetType = null;
    for (const et of entityTypes) {
      if (IDX[et]?.[String(src.id)]) sourceType = et;
      if (IDX[et]?.[String(tgt.id)]) targetType = et;
    }
    
    if (sourceType && targetType) {
      matrix[sourceType][targetType]++;
      matrix[targetType][sourceType]++; // Symmetric
    }
  });
  
  // Find max value for color scaling
  let maxValue = 0;
  let totalConnections = 0;
  const rowTotals = {};
  const colTotals = {};
  
  entityTypes.forEach(source => {
    rowTotals[source] = 0;
    colTotals[source] = 0;
    entityTypes.forEach(target => {
      const val = matrix[source][target];
      if (val > maxValue) maxValue = val;
      totalConnections += val;
      rowTotals[source] += val;
      colTotals[target] += val;
    });
  });
  
  // Adjust for double counting (symmetric matrix)
  totalConnections = totalConnections / 2;
  
  if (maxValue === 0) {
    mount.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">▦</div>
        <h3 style="margin-bottom: 0.5rem;">Matrix Visualization</h3>
        <p>No connections found between entities</p>
      </div>
    `;
    return;
  }
  
  // Build matrix HTML with enhanced styling
  const cellSize = 65;
  const labelWidth = 130;
  
  let matrixHTML = '<table style="border-collapse: collapse; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">';
  
  // Header row
  matrixHTML += '<tr><th style="width: ' + labelWidth + 'px; background: #f8f9fa;"></th>';
  entityTypes.forEach(type => {
    matrixHTML += `<th style="text-align: center; padding: 0.5rem; font-size: 0.75rem; font-weight: 700; color: #333; background: #f8f9fa; border-bottom: 2px solid #dee2e6;">${MAP[type]?.name || type}</th>`;
  });
  matrixHTML += '<th style="text-align: center; padding: 0.5rem; font-size: 0.7rem; font-weight: 700; color: #666; background: #f8f9fa; border-bottom: 2px solid #dee2e6;">Total</th>';
  matrixHTML += '</tr>';
  
  // Data rows
  entityTypes.forEach(sourceType => {
    matrixHTML += '<tr>';
    matrixHTML += `<td style="text-align: right; padding-right: 0.75rem; font-size: 0.75rem; font-weight: 700; color: #333; background: #f8f9fa; border-right: 2px solid #dee2e6;">${MAP[sourceType]?.name || sourceType}</td>`;
    
    entityTypes.forEach(targetType => {
      const value = matrix[sourceType][targetType];
      const intensity = maxValue > 0 ? value / maxValue : 0;
      const bgColor = value > 0 ? `rgba(212, 175, 55, ${0.15 + intensity * 0.85})` : '#fafafa';
      const textColor = intensity > 0.6 ? '#fff' : '#333';
      const borderColor = sourceType === targetType ? '#d4af37' : '#e0e0e0';
      const borderWidth = sourceType === targetType ? '2px' : '1px';
      
      matrixHTML += `
        <td style="
          width: ${cellSize}px; 
          height: ${cellSize}px; 
          text-align: center;
          vertical-align: middle; 
          background: ${bgColor}; 
          border: ${borderWidth} solid ${borderColor};
          font-weight: 700;
          color: ${textColor};
          font-size: 0.9rem;
          cursor: ${value > 0 ? 'pointer' : 'default'};
          transition: all 0.2s;
        " 
        onmouseover="this.style.transform='scale(1.1)'; this.style.zIndex='10'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)';"
        onmouseout="this.style.transform='scale(1)'; this.style.zIndex='1'; this.style.boxShadow='none';"
        title="${MAP[sourceType]?.name || sourceType} ↔ ${MAP[targetType]?.name || targetType}: ${value} connections${sourceType === targetType ? ' (self-references)' : ''}">
          ${value > 0 ? value : '—'}
        </td>
      `;
    });
    
    // Row total
    matrixHTML += `<td style="text-align: center; padding: 0.5rem; font-weight: 700; color: #333; background: #f8f9fa; border-left: 2px solid #dee2e6; font-size: 0.8rem;">${rowTotals[sourceType]}</td>`;
    matrixHTML += '</tr>';
  });
  
  // Column totals row
  matrixHTML += '<tr>';
  matrixHTML += `<td style="text-align: right; padding-right: 0.75rem; font-size: 0.7rem; font-weight: 700; color: #666; background: #f8f9fa; border-top: 2px solid #dee2e6;">Total</td>`;
  entityTypes.forEach(type => {
    matrixHTML += `<td style="text-align: center; padding: 0.5rem; font-weight: 700; color: #333; background: #f8f9fa; border-top: 2px solid #dee2e6; font-size: 0.8rem;">${colTotals[type]}</td>`;
  });
  matrixHTML += `<td style="text-align: center; padding: 0.5rem; font-weight: 700; color: #d4af37; background: #fffbf0; border-top: 2px solid #dee2e6; border-left: 2px solid #dee2e6; font-size: 0.8rem;">${totalConnections}</td>`;
  matrixHTML += '</tr>';
  
  matrixHTML += '</table>';
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; overflow: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.1rem;">Entity Connection Matrix</h3>
        <div style="font-size: 0.85rem; color: #666;">
          <strong>${totalConnections}</strong> total connections
        </div>
      </div>
      <p style="text-align: center; color: #666; font-size: 0.875rem; margin-bottom: 1.5rem;">Symmetric heatmap showing bidirectional relationships. Diagonal shows self-references. Hover cells for details.</p>
      ${matrixHTML}
      <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 1.5rem; font-size: 0.75rem; color: #666;">
        <span>Low density</span>
        <div style="display: flex; gap: 2px;">
          ${[0.15, 0.35, 0.55, 0.75, 1.0].map(v => `<div style="width: 24px; height: 24px; background: rgba(212, 175, 55, ${v}); border: 1px solid #ddd;"></div>`).join('')}
        </div>
        <span>High density</span>
      </div>
    </div>
  `;
}

// Chord Diagram - Circular Relationship Visualization
function buildChordDiagram(mount, list) {
  // Similar to matrix but circular representation
  const entityTypes = ['ms', 'su', 'pu', 'mi', 'hi', 'hp', 'tx'];
  const connections = {};
  
  entityTypes.forEach(type => connections[type] = 0);
  
  // Count total connections per entity type
  DATA.rel?.forEach(rel => {
    const src = getRes(rel, 'Source record');
    const tgt = getRes(rel, 'Target record');
    if (!src || !tgt) return;
    
    for (const et of entityTypes) {
      if (IDX[et]?.[String(src.id)]) connections[et]++;
      if (IDX[et]?.[String(tgt.id)]) connections[et]++;
    }
  });
  
  const totalConnections = Object.values(connections).reduce((a, b) => a + b, 0);
  
  if (totalConnections === 0) {
    mount.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #666;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⭕</div>
        <h3 style="margin-bottom: 0.5rem;">Chord Diagram</h3>
        <p>No entity connections found</p>
      </div>
    `;
    return;
  }
  
  // Create circular visualization with segments
  const sortedEntities = Object.entries(connections)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  
  const radius = 150;
  const centerX = 200;
  const centerY = 200;
  const colors = {
    ms: '#3498db', su: '#e6b800', pu: '#e74c3c', 
    mi: '#9b59b6', hi: '#2ecc71', hp: '#f39c12', tx: '#1abc9c'
  };
  
  let currentAngle = 0;
  const segments = sortedEntities.map(([type, count]) => {
    const percentage = count / totalConnections;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    // Calculate arc path
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    // Label position
    const labelAngle = (startAngle + angle / 2 - 90) * Math.PI / 180;
    const labelRadius = radius + 30;
    const labelX = centerX + labelRadius * Math.cos(labelAngle);
    const labelY = centerY + labelRadius * Math.sin(labelAngle);
    
    return {
      path: pathData,
      color: colors[type] || '#95a5a6',
      label: MAP[type]?.name || type,
      count,
      percentage: Math.round(percentage * 100),
      labelX,
      labelY,
      textAnchor: labelX > centerX ? 'start' : 'end'
    };
  });
  
  const svgSegments = segments.map((seg, idx) => `
    <g>
      <path d="${seg.path}" fill="${seg.color}" opacity="0.85" stroke="#fff" stroke-width="3"
        style="cursor: pointer; transition: opacity 0.2s;"
        onmouseover="this.style.opacity='1'; this.style.filter='drop-shadow(0 2px 4px rgba(0,0,0,0.3))';"
        onmouseout="this.style.opacity='0.85'; this.style.filter='none';">
        <title>${seg.label}: ${seg.count} connections (${seg.percentage}%)</title>
      </path>
    </g>
  `).join('');
  
  const svgLabels = segments.map((seg, idx) => `
    <g>
      <text x="${seg.labelX}" y="${seg.labelY}" text-anchor="${seg.textAnchor}" font-size="13" font-weight="700" fill="#333">
        ${seg.label}
      </text>
      <text x="${seg.labelX}" y="${seg.labelY + 16}" text-anchor="${seg.textAnchor}" font-size="11" font-weight="600" fill="${seg.color}">
        ${seg.count}
      </text>
      <text x="${seg.labelX}" y="${seg.labelY + 28}" text-anchor="${seg.textAnchor}" font-size="9" fill="#999">
        ${seg.percentage}%
      </text>
    </g>
  `).join('');
  
  // Generate legend
  const legendItems = sortedEntities.map(([type, count]) => `
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0;">
      <div style="width: 16px; height: 16px; background: ${colors[type] || '#95a5a6'}; border-radius: 3px;"></div>
      <span style="font-size: 0.85rem; font-weight: 500;">${MAP[type]?.name || type}</span>
      <span style="font-size: 0.75rem; color: #999; margin-left: auto;">${count} (${Math.round((count / totalConnections) * 100)}%)</span>
    </div>
  `).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3 style="margin: 0; font-size: 1.1rem;">Entity Connection Distribution</h3>
        <div style="font-size: 0.85rem; color: #666;">
          <strong>${totalConnections}</strong> total connections
        </div>
      </div>
      <p style="text-align: center; color: #666; font-size: 0.875rem; margin-bottom: 1rem;">
        Circular visualization showing proportional connection frequency per entity type
      </p>
      <div style="display: flex; gap: 2rem; align-items: flex-start; justify-content: center;">
        <svg width="420" height="420" style="flex-shrink: 0;">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
          </defs>
          ${svgSegments}
          ${svgLabels}
        </svg>
        <div style="min-width: 200px; padding: 1rem; background: #f9fafb; border-radius: 0.5rem; border: 1px solid #e0e0e0;">
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.9rem; color: #333;">Entity Breakdown</h4>
          ${legendItems}
        </div>
      </div>
    </div>
  `;
}

// Hierarchical Tree - Entity Structure
function buildHierarchicalTree(mount, list) {
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
    
    // Check for interleaved units (multiple PUs with overlapping SU ranges)
    // This is a simplified heuristic: if there are multiple PUs and cross-PU SUs
    const hasInterleaved = puCount > 1 && hasCrossPUSU;
    
    // Complexity score: weighted sum of various factors
    const complexityScore = 
      puCount * 10 +  // More PUs = more complex
      suCount * 2 +    // More SUs = somewhat more complex
      (hasCrossMSPU ? 100 : 0) +  // Cross-MS PUs are very unusual
      (hasCrossPUSU ? 50 : 0) +   // Cross-PU SUs are unusual
      (hasInterleaved ? 75 : 0);  // Interleaving is complex
    
    msMetrics[msId] = {
      puCount,
      suCount,
      hasCrossMSPU,
      hasCrossPUSU,
      hasInterleaved,
      complexityScore
    };
  });
  
  // Get search query
  const searchInput = document.getElementById('tree-manuscript-search');
  const searchQuery = (searchInput?.value || '').trim().toLowerCase();
  
  // Get filter checkboxes
  const filterInterleaved = document.getElementById('tree-filter-interleaved')?.checked || false;
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
    const anyFilterActive = filterInterleaved || filterCrossMSPU || filterCrossPUSU || filterMultiPU;
    if (anyFilterActive) {
      let matchesFilter = false;
      if (filterInterleaved && metrics.hasInterleaved) matchesFilter = true;
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
               🔗 SPANS ${suPUs.length} PUs
             </div>
             <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,152,0,0.1); border-radius: 0.25rem; font-size: 0.75rem; color: #e65100; width: 100%;">
               <strong>⚠️ Cross-PU Scribal Unit:</strong> This scribal unit also appears in:<br/>
               ${otherPUTitles.map(t => `<span style="margin-left: 1rem;">→ ${t}</span>`).join('<br/>')}
             </div>`
          : '';
        
        return `
          <div style="${suStyle}">
            <span style="font-size: 0.85rem; color: #999; font-weight: 600;">SU #${suIdx + 1}</span>
            <span style="font-weight: 600; font-size: 0.875rem; color: #333;">📝 ${su.title}</span>
            ${crossPUIndicator}
          </div>
        `;
      }).join('');
      
      // Special styling for cross-MS PUs
      const puStyle = isCrossMSPU 
        ? 'margin-left: 1.5rem; padding: 0.75rem; background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border-left: 3px dashed #9c27b0; border-right: 3px dashed #9c27b0; margin-top: 0.75rem; border-radius: 0.375rem; box-shadow: 0 2px 6px rgba(156,39,176,0.3); position: relative;'
        : 'margin-left: 1.5rem; padding: 0.75rem; background: #ffebee; border-left: 3px solid #e74c3c; margin-top: 0.75rem; border-radius: 0.375rem; box-shadow: 0 1px 3px rgba(0,0,0,0.08);';
      
      const crossMSIndicator = isCrossMSPU 
        ? `<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #9c27b0; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;">
             🔗 SPANS ${puMsList.length} MSS
           </div>
           <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(156,39,176,0.1); border-radius: 0.25rem; font-size: 0.75rem; color: #7b1fa2;">
             <strong>⚠️ Cross-Manuscript PU:</strong> This production unit also appears in:<br/>
             ${otherMSTitles.map(t => `<span style="margin-left: 1rem;">→ ${t}</span>`).join('<br/>')}
           </div>`
        : '';
      
      return `
        <div style="${puStyle}">
          ${isCrossMSPU ? crossMSIndicator : ''}
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="font-size: 0.85rem; color: #999; font-weight: 600;">PU #${puIdx + 1}</span>
            <span style="font-weight: 600; font-size: 0.95rem; color: #333;">${isCrossMSPU ? '🔗' : '📦'} ${pu.title}</span>
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
            <span style="font-weight: 700; font-size: 1.05rem; color: #1a1a1a;">📚 ${ms.title}</span>
            ${metrics.hasInterleaved ? '<span style="padding: 0.125rem 0.375rem; background: #ff9800; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">🔀 INTERLEAVED</span>' : ''}
            ${metrics.hasCrossMSPU ? '<span style="padding: 0.125rem 0.375rem; background: #9c27b0; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">📚 CROSS-MS</span>' : ''}
            ${metrics.hasCrossPUSU ? '<span style="padding: 0.125rem 0.375rem; background: #f44336; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">✍️ CROSS-PU</span>' : ''}
            ${metrics.puCount >= 5 ? '<span style="padding: 0.125rem 0.375rem; background: #2196f3; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">📦 MULTI-PU</span>' : ''}
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
            <strong style="color: #9c27b0;">Complexity:</strong> ${metrics.complexityScore}
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
          <span>📚 <strong>${totalManuscripts}</strong> MS</span>
          <span>📦 <strong>${totalPUs}</strong> PU</span>
          <span>📝 <strong>${totalSUs}</strong> SU</span>
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
      buildAnalytics();
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
      buildAnalytics();
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
  console.log('🌍 Building multilingualism view, tab:', CURRENT_MULTILINGUALISM_TAB);
  
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
  console.log('📊 Building multilingualism overview...');
  console.log('Mount element:', mount);
  console.log('Available DATA:', Object.keys(DATA || {}));
  console.log('SU count:', DATA.su?.length || 0);
  console.log('PU count:', DATA.pu?.length || 0);
  
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
  
  console.log('🔍 Checking first 3 SUs for language data...');
  allSUs.slice(0, 3).forEach((su, idx) => {
    const langInfo = getLanguageInfo(su, 'su');
    console.log(`  SU #${idx + 1} (${su.rec_ID}):`, {
      title: MAP.su?.title(su),
      colophonLangs: langInfo.colophon,
      textLangs: langInfo.text,
      allLangs: langInfo.all,
      hasColophonDivergence: langInfo.hasColophonDivergence,
      detailCount: su.details?.length || 0
    });
  });
  
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
  
  console.log('📊 Overview stats:', {
    totalLanguages: stats.totalLanguages.size,
    multilingualMss: stats.multilingualMss,
    multilingualScribes: stats.multilingualScribes,
    multilingualInstitutions: stats.multilingualInstitutions,
    colophonDivergences: stats.colophonDivergences,
    languageCount: Object.keys(stats.languageCounts).length,
    topLanguages: sortedLanguages.slice(0, 5)
  });
  
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
  
  console.log('🔍 Pattern Analysis:', {
    countries: topCountries.length,
    periods: periodsSorted.length,
    orders: topOrders.length,
    institutions: topInstitutions.length
  });
  
  // Render overview
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">🌍 Multilingualism in the Corpus</h2>
      
      <!-- Key Statistics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.totalLanguages.size}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Languages/Dialects</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualMss}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Manuscripts</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.multilingualScribes}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Multilingual Scribes</div>
        </div>
        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
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
        <h3 style="margin-bottom: 1rem; color: #333;">📊 Most Common Languages</h3>
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
                  <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- PATTERN ANALYSIS SECTION -->
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 1rem; color: #1a1a1a; font-size: 1.5rem;">🔍 Multilingualism Patterns</h2>
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
            <span>⛪</span> Religious Order Patterns
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
                    ${item.location ? `<div>📍 ${item.location}</div>` : ''}
                  </div>
                  <div style="display: flex; gap: 1rem; font-size: 0.75rem;">
                    <span style="background: #667eea; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">${item.count} multilingual PU${item.count !== 1 ? 's' : ''}</span>
                    <span style="background: #764ba2; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: 600;">${item.langCount} language${item.langCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '<p style="color: #999; font-style: italic;">No institutional data available</p>'}
        </div>
        
        <!-- Key Insights -->
        <div style="background: linear-gradient(135deg, #667eea15, #764ba215); padding: 1.5rem; border-radius: 0.5rem; border-left: 4px solid #667eea;">
          <h4 style="margin: 0 0 0.75rem 0; color: #333; font-size: 1rem;">💡 Key Insights</h4>
          <ul style="margin: 0; padding-left: 1.5rem; color: #555; line-height: 1.8; font-size: 0.9rem;">
            ${topCountries.length > 0 ? `<li><strong>Geographical:</strong> ${topCountries[0].name} shows the highest concentration of multilingual production (${topCountries[0].count} PUs)</li>` : ''}
            ${periodsSorted.length > 0 ? `<li><strong>Temporal:</strong> ${periodsSorted.reduce((max, p) => p.count > max.count ? p : max, periodsSorted[0]).name} has the most multilingual activity (${periodsSorted.reduce((max, p) => p.count > max.count ? p : max, periodsSorted[0]).count} PUs)</li>` : ''}
            ${topOrders.length > 0 ? `<li><strong>Religious Orders:</strong> ${topOrders[0].name} leads in multilingual production with ${topOrders[0].count} PUs across ${topOrders[0].instCount} institutions</li>` : ''}
            ${topInstitutions.length > 0 ? `<li><strong>Institutions:</strong> ${topInstitutions[0].name} is the most multilingual institution (${topInstitutions[0].langCount} languages in ${topInstitutions[0].count} PUs)</li>` : ''}
          </ul>
        </div>
      </div>
      
      <!-- Description -->
      <div style="background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #667eea; border-radius: 0.375rem; margin-bottom: 1.5rem;">
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
  console.log('📚 Building multilingual manuscripts view...');
  
  // Strategy: For each manuscript, collect ALL languages from:
  // - All PUs in the manuscript (their colophons)
  // - All SUs in those PUs (their colophons)  
  // - All Texts linked to those SUs (their text languages)
  
  const allMSs = DATA.ms || [];
  const msLanguageData = [];
  
  console.log('🔍 Total manuscripts to check:', allMSs.length);
  
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
    
    console.log(`📖 MS "${msTitle}" has ${puIds.size} PUs`);
    
    // Collect languages organized by PU
    const puData = {};
    const allMsLanguages = new Set();
    
    puIds.forEach(puId => {
      const pu = IDX.pu[puId];
      if (!pu) return;
      
      const puTitle = MAP.pu?.title(pu) || 'Untitled PU';
      const puLangInfo = getLanguageInfo(pu, 'pu');
      
      console.log(`  📄 PU "${puTitle}":`, {
        colophonLangs: puLangInfo.colophon,
        textLangs: puLangInfo.text,
        allLangs: puLangInfo.all
      });
      
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
          
          console.log(`    📝 SU "${suTitle}":`, {
            colophonLangs: suLangInfo.colophon,
            textLangs: suLangInfo.text,
            allLangs: suLangInfo.all,
            scribes: scribes.map(s => s.scribeName)
          });
          
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
      
      console.log(`✅ Found multilingual MS: "${msTitle}" with ${allMsLanguages.size} languages`);
      
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
  
  console.log('📊 Found', msLanguageData.length, 'multilingual manuscripts');
  
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
      `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; font-weight: 600;">${lang}</span>`
    ).join('');
    
    // Multilingualism type badge
    const typeBadge = ms.multilingualismType === 'within-pu'
      ? `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: #4caf50; color: white; border-radius: 0.75rem; font-size: 0.7rem; font-weight: 600;">🔬 Within-PU multilingualism (${ms.multilingualPUCount} PU${ms.multilingualPUCount > 1 ? 's' : ''})</span>`
      : `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: #ff9800; color: white; border-radius: 0.75rem; font-size: 0.7rem; font-weight: 600;">📦 Cross-PU compilation</span>`;
    
    // Build PU breakdown
    const puBreakdown = Object.values(ms.pus).map(pu => {
      // Create detailed language badges for PU showing source
      let puLangBadges = '';
      if (pu.colophonLangs && pu.colophonLangs.length > 0) {
        puLangBadges += pu.colophonLangs.map(lang =>
          `<span style="padding: 0.2rem 0.5rem; background: #2196f3; color: white; border-radius: 0.5rem; font-size: 0.7rem; margin-right: 0.25rem;" title="From PU colophon">📝 ${lang}</span>`
        ).join('');
      }
      if (pu.textLangs && pu.textLangs.length > 0) {
        puLangBadges += pu.textLangs.map(lang =>
          `<span style="padding: 0.2rem 0.5rem; background: #4a90e2; color: white; border-radius: 0.5rem; font-size: 0.7rem; margin-right: 0.25rem;" title="From linked text at PU level">📖 ${lang}</span>`
        ).join('');
      }
      
      const suList = pu.sus.map(su => {
        // Create detailed language badges for SU showing source
        let suLangBadges = '';
        if (su.colophonLangs && su.colophonLangs.length > 0) {
          suLangBadges += su.colophonLangs.map(lang =>
            `<span style="padding: 0.15rem 0.4rem; background: #ff9800; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-right: 0.25rem;" title="From SU colophon">📝 ${lang}</span>`
          ).join('');
        }
        if (su.textLangs && su.textLangs.length > 0 && JSON.stringify(su.textLangs) !== JSON.stringify(su.colophonLangs)) {
          suLangBadges += su.textLangs.map(lang =>
            `<span style="padding: 0.15rem 0.4rem; background: #ffa726; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-right: 0.25rem;" title="From linked text at SU level">📖 ${lang}</span>`
          ).join('');
        }
        
        const scribeInfo = su.scribes.length > 0
          ? su.scribes.map(s => `<span style="color: #666; font-size: 0.7rem;">✍️ ${s.scribeName}</span>`).join(', ')
          : '';
        
        const divergenceBadge = su.hasColophonDivergence
          ? `<span style="padding: 0.15rem 0.4rem; background: #f44336; color: white; border-radius: 0.5rem; font-size: 0.65rem; margin-left: 0.25rem;">🔀 Colophon≠Text</span>`
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
            <span>📄 ${pu.title}</span>
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
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">📚 ${ms.title}</h3>
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
            <button onclick="window.jumpTo('ms', '${ms.id}')" style="padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseenter="this.style.background='#5568d3'" onmouseleave="this.style.background='#667eea'">
              View Details
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">📖 Production Units & Scribal Units:</div>
          ${puBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">📚 Multilingual Manuscripts</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
          Manuscripts containing texts in multiple languages. The badge indicates whether multilingualism 
          occurs <strong>within production units</strong> (scribes working across languages) or represents 
          a <strong>cross-PU compilation</strong> (different units with different languages assembled together).
        </p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
          <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${msLanguageData.length}</span>
          <span style="opacity: 0.9;">multilingual manuscript${msLanguageData.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 1rem; border-radius: 0.375rem; margin-bottom: 1.5rem; font-size: 0.875rem; color: #555; line-height: 1.8;">
        <strong>Legend:</strong><br>
        <span style="margin-right: 1.5rem;">🟣 Purple = Manuscript-level languages</span>
        <span style="margin-right: 1.5rem;">🔵 Blue = Production Unit languages</span>
        <span style="margin-right: 1.5rem;">🟠 Orange = Scribal Unit languages</span><br>
        <span style="margin-right: 1.5rem;">📝 Notebook icon = From colophon</span>
        <span style="margin-right: 1.5rem;">📖 Book icon = From linked text</span>
        <span style="margin-right: 1.5rem;">🔀 Red badge = Colophon-text divergence</span>
      </div>
      
      ${msCards}
      
      <div style="text-align: center; padding: 2rem; color: #999; font-size: 0.875rem;">
        Showing all ${msLanguageData.length} multilingual manuscript${msLanguageData.length !== 1 ? 's' : ''}
      </div>
    </div>
  `;
}

function buildScribalMultilingualism(mount) {
  console.log('✍️ Building scribal multilingualism view...');
  
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
          <span style="color: #667eea;">${su.msTitle}</span>
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
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">✍️ ${scribe.name}</h3>
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
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">📖 Work by Language:</div>
          ${langBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">✍️ Scribal Multilingualism</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
          Scribes who worked across multiple languages, demonstrating linguistic competence and cultural mediation 
          in medieval manuscript production. This reveals the multilingual capabilities of individual scribes.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${multilingualScribes.length}</span>
            <span style="opacity: 0.9;">multilingual scribe${multilingualScribes.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
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
  console.log('🏛️ Building institutional multilingualism view...');
  
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
      `<span style="display: inline-block; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, #f093fb, #f5576c); color: white; border-radius: 1rem; font-size: 0.75rem; margin-right: 0.5rem; margin-bottom: 0.5rem; font-weight: 600;">${lang}</span>`
    ).join('');
    
    // Language breakdown
    const langBreakdown = Object.entries(inst.languageDetails).map(([lang, pus]) => {
      const puList = pus.slice(0, 5).map(pu => // Show first 5
        `<div style="font-size: 0.75rem; color: #666; padding: 0.25rem 0; border-bottom: 1px solid #f0f0f0;">
          <span style="font-weight: 600;">${pu.puTitle}</span> 
          <span style="color: #999;">in</span> 
          <span style="color: #667eea;">${pu.msTitle}</span>
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
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">🏛️ ${inst.name}</h3>
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
            <button onclick="window.jumpTo('mi', '${inst.id}')" style="padding: 0.5rem 1rem; background: #f093fb; color: white; border: none; border-radius: 0.375rem; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: background 0.2s;" onmouseenter="this.style.background='#d078dc'" onmouseleave="this.style.background='#f093fb'">
              View Institution
            </button>
          </div>
        </div>
        
        <div style="border-top: 1px solid #f0f0f0; padding-top: 1rem;">
          <div style="font-weight: 600; font-size: 0.9rem; color: #555; margin-bottom: 0.75rem;">📚 Productions by Language:</div>
          ${langBreakdown}
        </div>
      </div>
    `;
  }).join('');
  
  mount.innerHTML = `
    <div style="padding: 1.5rem; max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">🏛️ Institutional Multilingualism</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
          Monastic institutions and scriptoria that produced manuscripts in multiple languages, revealing 
          institutional multilingual capacities and cultural exchange networks in medieval book production.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${multilingualInstitutions.length}</span>
            <span style="opacity: 0.9;">multilingual institution${multilingualInstitutions.length !== 1 ? 's' : ''}</span>
          </div>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
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
  console.log('🔀 Building colophon-text divergence view...');
  
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
            ✍️ <span style="font-weight: 600; color: #333;">${s.scribeName}</span>
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
              <h3 style="margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700;">🔀 ${div.suTitle}</h3>
            </div>
            <div style="font-size: 0.85rem; color: #667eea; margin-bottom: 0.75rem;">
              📖 ${div.msTitle}
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
            <div style="font-weight: 600; font-size: 0.85rem; color: #555; margin-bottom: 0.5rem;">📝 Colophon Language:</div>
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
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">�🔀 Colophon-Text Language Divergence</h2>
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
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; display: inline-block;">
            <span style="font-size: 1.5rem; font-weight: 700; margin-right: 0.5rem;">${Object.keys(patterns).length}</span>
            <span style="opacity: 0.9;">unique pattern${Object.keys(patterns).length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        ${topPatterns ? `
          <div style="background: white; border: 1px solid #e0e0e0; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 2rem;">
            <h3 style="margin-top: 0; margin-bottom: 1rem; font-size: 1rem; color: #333;">📊 Most Common Divergence Patterns</h3>
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
   COLOPHON ANALYSIS MODULE
   ============================================================ */

let ACTIVE_COLOPHON_TAB = 'overview';

// Colophon Analysis Main Entry Point
function buildColophonAnalysis() {
  const mount = document.getElementById('colophon-mount');
  if (!mount) return;
  
  console.log('📜 Building Colophon Analysis...');
  
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
  console.log('📊 Building Colophon Overview...');
  
  const allSUs = DATA.su || [];
  
  // Debug: Check first few SUs
  console.log('🔍 First SU sample:', allSUs[0]);
  console.log('🔍 Colophon presence value for first SU:', getVal(allSUs[0], 'Colophon presence'));
  
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  console.log('✅ Found', colophonSUs.length, 'SUs with colophons');
  
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
  
  console.log('📊 Colophon stats:', stats);
  
  // Calculate relative percentages (colophons vs total manuscripts)
  const allMSs = DATA.ms || [];
  const msByCentury = {};
  const msByRegion = {};
  
  allSUs.forEach(su => {
    const century = getVal(su, 'Normalized century of production');
    if (century) {
      msByCentury[century] = (msByCentury[century] || 0) + 1;
    }
    
    const pus = getPUsForSU(su);
    if (pus.length > 0) {
      const pu = IDX.pu[pus[0]];
      if (pu) {
        const place = MAP.pu?.place(pu) || '';
        const region = place.split(',')[0].trim();
        if (region) {
          msByRegion[region] = (msByRegion[region] || 0) + 1;
        }
      }
    }
  });
  
  // Render
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">📜 Colophon Analysis Overview</h2>
      
      <!-- Key Statistics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.withColophons}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Scribal Units with Colophons</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">${Math.round((stats.withColophons / stats.totalSUs) * 100)}% of all SUs</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem;">${stats.withTranscription}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">With Transcription</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">Original language text</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
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
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1rem;">🗣️ Colophons by Language</h3>
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
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <!-- By Century -->
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1rem;">📅 Colophons by Century</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${topCenturies.map(([century, count]) => {
              const maxCount = Math.max(...topCenturies.map(c => c[1]));
              const barPercentage = (count / maxCount) * 100;
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
                    <div style="background: linear-gradient(90deg, #43e97b, #38f9d7); height: 100%; width: ${barPercentage}%; transition: width 0.3s;"></div>
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
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1rem;">🌍 Colophons by Region</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${topRegions.map(([region, count]) => {
              const maxCount = topRegions[0][1];
              const barPercentage = (count / maxCount) * 100;
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
                    <div style="background: linear-gradient(90deg, #4facfe, #00f2fe); height: 100%; width: ${barPercentage}%; transition: width 0.3s;"></div>
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
      <div style="background: #f8f9fa; padding: 1.5rem; border-left: 4px solid #667eea; border-radius: 0.375rem;">
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
  console.log('💭 Building Sentiment Analysis...');
  
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Sentiment keyword dictionaries
  const sentiments = {
    humility: {
      keywords: ['unworthy', 'poor', 'sinner', 'humble', 'weak', 'undeserving', 'lowly', 'inadequate', 'insufficient'],
      color: '#9333ea',
      icon: '🙏'
    },
    pride: {
      keywords: ['diligent', 'careful', 'completed', 'accomplished', 'faithfully', 'skillfully', 'perfectly', 'successfully'],
      color: '#dc2626',
      icon: '✨'
    },
    labor: {
      keywords: ['weary', 'tired', 'labor', 'labored', 'difficult', 'effort', 'toil', 'fatigue', 'hand', 'finger'],
      color: '#ea580c',
      icon: '💪'
    },
    religious: {
      keywords: ['god', 'pray', 'prayer', 'blessing', 'mercy', 'grace', 'lord', 'christ', 'saint', 'holy', 'amen'],
      color: '#0891b2',
      icon: '✝️'
    },
    temporal: {
      keywords: ['year', 'day', 'month', 'century', 'completed in', 'written in', 'finished on'],
      color: '#059669',
      icon: '📅'
    },
    dedication: {
      keywords: ['honor', 'dedicated', 'memory', 'commissioned', 'request', 'patron', 'benefactor'],
      color: '#7c3aed',
      icon: '💝'
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
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">💭 Sentiment Analysis</h2>
      
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
            style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem;">
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
                  <button onclick="selectSU(${result.su.rec_ID});" 
                    style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; white-space: nowrap; margin-left: 1rem;">
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
                  <button onclick="selectSU(${result.su.rec_ID});" 
                    style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem; white-space: nowrap; margin-left: 1rem;">
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
  console.log('🏷️ Building Thematic Analysis...');
  
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Theme definitions
  const themes = {
    'Self-identification': {
      keywords: ['i', 'me', 'my', 'sister', 'brother', 'scribe', 'wrote', 'written by'],
      color: '#8b5cf6',
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
      color: '#ec4899',
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
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">🏷️ Thematic Analysis</h2>
      
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
          Click "Show More Examples" to see additional colophons for each theme.
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
                        <button onclick="selectSU(${ex.su.rec_ID});" 
                          style="background: #667eea; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; white-space: nowrap;">
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
  console.log('📝 Building Linguistic Features...');
  
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
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">📝 Linguistic Features</h2>
      
      <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Analyzing linguistic patterns across ${features.length} colophons.
      </p>
      
      <!-- Key Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${avgWords.toFixed(1)}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Avg. Word Count</div>
        </div>
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">${avgWordLen.toFixed(1)}</div>
          <div style="font-size: 0.875rem; opacity: 0.9;">Avg. Word Length</div>
          <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">Letters per word</div>
        </div>
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
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
              <span style="font-size: 1.5rem;">💬</span>
              <span style="font-weight: 600; color: #333;">First-Person Usage</span>
            </div>
            <div style="font-size: 2rem; font-weight: 700; color: #667eea; margin-bottom: 0.5rem;">
              ${avgFirstPerson.toFixed(2)}
            </div>
            <div style="font-size: 0.875rem; color: #666;">
              Average mentions per colophon<br>
              ${withFirstPerson} colophons (${((withFirstPerson/features.length)*100).toFixed(1)}%) use "I", "me", or "my"
            </div>
          </div>
          
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
              <span style="font-size: 1.5rem;">❓</span>
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
              <span style="font-size: 1.5rem;">❗</span>
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
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem;">📏 Longest Colophons</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${longest.map((f, idx) => `
              <div style="background: #f9f9f9; padding: 1rem; border-radius: 0.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <span style="font-weight: 600; color: #555;">#${idx + 1} ${esc(f.scribeName)}</span>
                  <span style="color: #667eea; font-weight: 600;">${f.wordCount} words</span>
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
          <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem;">💬 Most Personal Expression</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${mostFirstPerson.filter(f => f.firstPersonCount > 0).map((f, idx) => `
              <div style="background: #f9f9f9; padding: 1rem; border-radius: 0.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <span style="font-weight: 600; color: #555;">#${idx + 1} ${esc(f.scribeName)}</span>
                  <span style="color: #f093fb; font-weight: 600;">${f.firstPersonCount} mentions</span>
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
  console.log('🔍 Building Comparative Patterns...');
  
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
    const ms = getMSForSU(su);
    const region = ms ? (getVal(ms, 'Region of origin') || 'Unknown') : 'Unknown';
    totalSUsByRegion[region] = (totalSUsByRegion[region] || 0) + 1;
  });
  
  // Then analyze colophon SUs
  colophonSUs.forEach(su => {
    const ms = getMSForSU(su);
    const region = ms ? (getVal(ms, 'Region of origin') || 'Unknown') : 'Unknown';
    
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
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">🔍 Comparative Patterns</h2>
      
      <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Comparing colophon characteristics across regions and time periods.
      </p>
      
      <!-- By Region -->
      <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">🌍 Patterns by Region</h3>
        
        <!-- Colophon Count by Region -->
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 0.95rem; color: #555; margin-bottom: 1rem;">Number of Colophons</h4>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${topRegions.map(([region, data]) => {
              const maxCount = topRegions[0][1].count;
              const barPercentage = (data.count / maxCount) * 100;
              const totalInRegion = totalSUsByRegion[region] || 1;
              const colophonRate = ((data.count / totalInRegion) * 100).toFixed(1);
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem; font-size: 0.875rem;">
                    <span style="font-weight: 600;">${esc(region)}</span>
                    <span style="color: #666;">
                      ${data.count} colophons (avg ${data.avgLength.toFixed(0)} words)
                      <span style="color: #667eea; font-weight: 600; margin-left: 0.5rem;">${colophonRate}%</span>
                    </span>
                  </div>
                  <div style="background: #f0f0f0; height: 24px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${barPercentage}%; transition: width 0.3s;"></div>
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
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #9333ea;">🙏 Humility</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #dc2626;">✨ Pride</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #ea580c;">💪 Labor</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0891b2;">✝️ Religious</th>
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
        <h3 style="margin-bottom: 1.5rem; color: #333; font-size: 1.1rem;">📅 Patterns Over Time</h3>
        
        <!-- Average Length Trend -->
        <div style="margin-bottom: 2rem;">
          <h4 style="font-size: 0.95rem; color: #555; margin-bottom: 1rem;">Average Colophon Length by Century</h4>
          <div style="display: flex; align-items: end; gap: 0.5rem; height: 200px; padding: 1rem; background: #f9f9f9; border-radius: 0.5rem;">
            ${sortedCenturies.map(([century, data]) => {
              const maxLength = Math.max(...sortedCenturies.map(c => c[1].avgLength));
              const height = (data.avgLength / maxLength) * 100;
              return `
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                  <div style="display: flex; flex-direction: column; justify-content: end; align-items: center; height: 100%; width: 100%;">
                    <div style="font-size: 0.75rem; color: #666; margin-bottom: 0.25rem;">${data.avgLength.toFixed(0)}</div>
                    <div style="background: linear-gradient(180deg, #4facfe, #00f2fe); width: 100%; height: ${height}%; border-radius: 4px 4px 0 0; min-height: 4px;"></div>
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
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #9333ea;">🙏 Humility</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #dc2626;">✨ Pride</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #ea580c;">💪 Labor</th>
                  <th style="padding: 0.75rem; text-align: center; font-weight: 600; color: #0891b2;">✝️ Religious</th>
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
      <div style="background: linear-gradient(135deg, #667eea15, #764ba230); padding: 2rem; border-radius: 0.5rem; margin-top: 2rem; border-left: 4px solid #667eea;">
        <h3 style="margin-bottom: 1rem; color: #333; font-size: 1.1rem;">💡 Key Insights</h3>
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

// 6. BROWSE COLOPHONS TAB
function buildBrowseColophons(mount) {
  console.log('📖 Building Browse Colophons...');
  
  const allSUs = DATA.su || [];
  const colophonSUs = allSUs.filter(su => hasColophon(su));
  
  // Get unique languages and centuries for filters
  const languages = [...new Set(colophonSUs.map(su => getVal(su, 'Colophon language')).filter(Boolean))].sort();
  const centuries = [...new Set(colophonSUs.map(su => getVal(su, 'Normalized century of production')).filter(Boolean))].sort();
  
  // Initial display (first 20)
  const displayColophons = colophonSUs.slice(0, 20);
  
  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 1.5rem; color: #1a1a1a;">📖 Browse Colophons</h2>
      
      <p style="color: #666; margin-bottom: 2rem; line-height: 1.6;">
        Showing ${displayColophons.length} of ${colophonSUs.length} colophons. 
        Use filters to refine your search.
      </p>
      
      <!-- Filters -->
      <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem;">
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
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">Search Text</label>
            <input type="text" id="filter-search" placeholder="Search colophon text..." style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem;">
          </div>
        </div>
      </div>
      
      <!-- Colophon List -->
      <div id="colophon-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${displayColophons.map((su, idx) => {
          const colophon = getColophonText(su);
          const scribeName = su.rec_Title || 'Unknown';
          const language = getVal(su, 'Colophon language') || 'Unknown';
          const century = getVal(su, 'Normalized century of production') || 'Unknown';
          const dating = getVal(su, 'SU dating') || 'Unknown';
          const msTitle = getVal(su, 'Manuscript') || 'Unknown';
          const cardId = 'colophon-card-' + idx;
          
          return `
            <div id="${cardId}" data-su-id="${su.rec_ID}" style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">
                <div style="flex: 1;">
                  <h3 style="font-size: 1.1rem; font-weight: 600; color: #333; margin: 0 0 0.5rem 0;">${esc(scribeName)}</h3>
                  <div style="font-size: 0.875rem; color: #666;">
                    📜 ${esc(msTitle)}
                  </div>
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <div style="text-align: right; font-size: 0.875rem; color: #666; margin-right: 0.5rem;">
                    <div>🗣️ ${esc(language)}</div>
                    <div>📅 ${esc(century)} century (${esc(dating)})</div>
                  </div>
                  <button onclick="const card = document.getElementById('${cardId}'); const content = card.querySelector('.colophon-content'); const btn = this; if(content.style.display === 'none') { content.style.display = 'block'; btn.textContent = '▼'; } else { content.style.display = 'none'; btn.textContent = '▶'; }" 
                    style="background: #f0f0f0; border: none; padding: 0.5rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 1rem; width: 40px; height: 40px;">
                    ▼
                  </button>
                </div>
              </div>
              
              <!-- Collapsible Content -->
              <div class="colophon-content" style="display: block;">
                <!-- Transcription (Original) -->
                ${colophon.hasTranscription ? `
                  <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <div style="font-size: 0.75rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
                        Original Transcription
                      </div>
                      <button onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent.trim()); this.innerHTML = '✓ Copied!'; setTimeout(() => this.innerHTML = '📋 Copy', 2000);" 
                        style="background: #667eea; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; white-space: nowrap;">
                        📋 Copy
                      </button>
                    </div>
                    <div style="background: #f9f9f9; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #667eea;">
                      <p style="margin: 0; color: #444; line-height: 1.6; font-style: italic;">
                        ${esc(colophon.transcription)}
                      </p>
                    </div>
                  </div>
                ` : ''}
                
                <!-- Translation (English) -->
                ${colophon.hasTranslation ? `
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <div style="font-size: 0.75rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">
                        English Translation
                      </div>
                      <button onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent.trim()); this.innerHTML = '✓ Copied!'; setTimeout(() => this.innerHTML = '📋 Copy', 2000);" 
                        style="background: #4facfe; color: white; border: none; padding: 0.375rem 0.75rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.75rem; white-space: nowrap;">
                        📋 Copy
                      </button>
                    </div>
                    <div style="background: #f0f8ff; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #4facfe;">
                      <p style="margin: 0; color: #333; line-height: 1.6;">
                        ${esc(colophon.translation)}
                      </p>
                    </div>
                  </div>
                ` : ''}
                
                ${!colophon.hasTranscription && !colophon.hasTranslation ? `
                  <div style="color: #999; font-style: italic;">No colophon text available</div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      
      ${colophonSUs.length > 20 ? `
        <div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: #f9f9f9; border-radius: 0.5rem;">
          <p style="color: #666; margin: 0;">
            Showing 20 of ${colophonSUs.length} colophons. Use filters to refine your search.
          </p>
        </div>
      ` : ''}
    </div>
  `;
  
  // Add filter event listeners
  const filterLanguage = document.getElementById('filter-language');
  const filterCentury = document.getElementById('filter-century');
  const filterSearch = document.getElementById('filter-search');
  
  const applyFilters = () => {
    const langValue = filterLanguage?.value || '';
    const centValue = filterCentury?.value || '';
    const searchValue = filterSearch?.value.toLowerCase() || '';
    
    let filtered = colophonSUs;
    
    if (langValue) {
      filtered = filtered.filter(su => getVal(su, 'Colophon language') === langValue);
    }
    
    if (centValue) {
      filtered = filtered.filter(su => getVal(su, 'Normalized century of production') === centValue);
    }
    
    if (searchValue) {
      filtered = filtered.filter(su => {
        const colophon = getColophonText(su);
        const text = (colophon.translation + ' ' + colophon.transcription).toLowerCase();
        return text.includes(searchValue);
      });
    }
    
    const listDiv = document.getElementById('colophon-list');
    const displayFiltered = filtered.slice(0, 50); // Show up to 50 results
    
    listDiv.innerHTML = displayFiltered.length > 0 ? displayFiltered.map(su => {
      const colophon = getColophonText(su);
      const scribeName = su.rec_Title || 'Unknown';
      const language = getVal(su, 'Colophon language') || 'Unknown';
      const century = getVal(su, 'Normalized century of production') || 'Unknown';
      const dating = getVal(su, 'SU dating') || 'Unknown';
      const msTitle = getVal(su, 'Manuscript') || 'Unknown';
      
      return `
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid #f0f0f0;">
            <div style="flex: 1;">
              <h3 style="font-size: 1.1rem; font-weight: 600; color: #333; margin: 0 0 0.5rem 0;">${esc(scribeName)}</h3>
              <div style="font-size: 0.875rem; color: #666;">📜 ${esc(msTitle)}</div>
            </div>
            <div style="text-align: right; font-size: 0.875rem; color: #666;">
              <div>🗣️ ${esc(language)}</div>
              <div>📅 ${esc(century)} century (${esc(dating)})</div>
            </div>
          </div>
          
          ${colophon.hasTranscription ? `
            <div style="margin-bottom: 1rem;">
              <div style="font-size: 0.75rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Original Transcription</div>
              <div style="background: #f9f9f9; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #667eea;">
                <p style="margin: 0; color: #444; line-height: 1.6; font-style: italic;">${esc(colophon.transcription)}</p>
              </div>
            </div>
          ` : ''}
          
          ${colophon.hasTranslation ? `
            <div>
              <div style="font-size: 0.75rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">English Translation</div>
              <div style="background: #f0f8ff; padding: 1rem; border-radius: 0.5rem; border-left: 3px solid #4facfe;">
                <p style="margin: 0; color: #333; line-height: 1.6;">${esc(colophon.translation)}</p>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('') : '<div style="text-align: center; padding: 2rem; color: #666;">No colophons match your filters.</div>';
    
    // Update count message
    const countMsg = filtered.length > 50 
      ? `Showing 50 of ${filtered.length} filtered colophons` 
      : `Showing ${filtered.length} colophon${filtered.length !== 1 ? 's' : ''}`;
    
    const existingMsg = mount.querySelector('p[style*="margin-bottom: 2rem"]');
    if (existingMsg) {
      existingMsg.textContent = countMsg + '. Use filters to refine your search.';
    }
  };
  
  if (filterLanguage) filterLanguage.addEventListener('change', applyFilters);
  if (filterCentury) filterCentury.addEventListener('change', applyFilters);
  if (filterSearch) filterSearch.addEventListener('input', debounce(applyFilters, 300));
}

/* ---------- Boot ---------- */
async function boot(){
  console.log('🚀 Boot function started');
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
  
  console.log('📊 Data loaded. Initializing event listeners...');
  
  // Initialize all event listeners
  initModeNavigation();
  initEventListeners();
  
  // Populate filter dropdowns after data is loaded
  populateFilterDropdowns();
  
  console.log('✅ Event listeners initialized');
  
  buildFacets(DATA.su, FACETS.su);
  render(DATA.su, 'su');
  updateAvailableViews();
  $status.textContent='';
  
  console.log('✨ Boot complete! Page ready.');
}
boot();

/* Expose a couple for debugging */
window.jumpTo = jumpTo;
window.renderCurrent = renderCurrent;
})();
</script>