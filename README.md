# Unknown Hands — Technical Documentation

> *Unknown Hands* is a digital research and publication ecosystem designed to document, analyze, and visualize the work of pre-modern female scribes (before 1600).  
> It integrates structured metadata (Heurist), IIIF-compliant manuscript images, machine-readable transcriptions, and interactive data exploration tools.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Data Pipeline](#3-data-pipeline)
4. [Transcription System](#4-transcription-system)
5. [Website Structure](#5-website-structure)
6. [Key Features](#6-key-features)
7. [Development Setup](#7-development-setup)
8. [Standards & Interoperability](#8-standards--interoperability)
9. [Deployment](#9-deployment)

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DATA SOURCES                            │
├─────────────────────────────────────────────────────────────┤

│  Heurist Database          eScriptorium         IIIF APIs    │                 |

│  (structured metadata)     (transcriptions)     (images)     │          Derived Data

└──────────┬──────────────────────┬─────────────────┬─────────┘                 ↓

           │                      │                 │    +---------------------------+

           ▼                      ▼                 ▼    |         Data Layer         |

┌─────────────────────────────────────────────────────────────┐    |----------------------------|

│                   PYTHON DATA PIPELINE                       │    | /data/manifests.yml        |

├─────────────────────────────────────────────────────────────┤    | /data/records.json         |

│  • setup_manuscripts.py    → folder structure, manifests    │    | /data/annos/<slug>/*.json  |

│  • pagexml_to_iiif.py      → PAGE-XML to IIIF annotations   │    | /data/search_index.json    |

│  • build_search_index.py   → full-text search index         │    +------------+--------------+

└──────────┬──────────────────────────────────────────────────┘                 |

           │         Static Site Build

           ▼                 ↓

┌─────────────────────────────────────────────────────────────┐    +---------------------------+

│                    DATA LAYER (Static)                       │    |  Jekyll + JavaScript Site  |

├─────────────────────────────────────────────────────────────┤    |----------------------------|

│  /data/manifests.yml       → manuscript registry            │    | /explore-database/  → Browse Heurist data

│  /data/manuscripts.csv     → Heurist export                 │    | /viewer/            → View IIIF + transcriptions

│  /assets/data/manuscripts.json → processed records          │    | /search-transcriptions/ → Full-text/fuzzy search

│  /data/annos/<slug>/       → per-manuscript annotations     │    +---------------------------+

│  /data/search_index.json   → transcription search index     │

└──────────┬──────────────────────────────────────────────────┘

           │    ---

           ▼

┌─────────────────────────────────────────────────────────────┐## 2. Core Components

│              JEKYLL STATIC SITE GENERATOR                    │

├─────────────────────────────────────────────────────────────┤### Heurist Database

│  • Liquid templating                                         │- Central research model defining entities and relationships:

│  • Markdown content pages                                    │  - *Scribal Unit*, *Production Unit*, *Manuscript*, *Text*, *Person*, *Language*, *Institution*.

│  • SASS/SCSS compilation                                     │- Exports periodically as CSV/JSON to feed the static site.

│  • Asset pipeline                                            │- Serves as **authoritative metadata** and **relational backbone**.

└──────────┬──────────────────────────────────────────────────┘

           │### Python Scripts

           ▼| Script | Role |

┌─────────────────────────────────────────────────────────────┐|--------|------|

│                    STATIC WEBSITE                            │| `setup_manuscripts.py` | Reads `data/manuscripts.csv`, creates annotation folders, and registers manifests in `data/manifests.yml`. |

├─────────────────────────────────────────────────────────────┤| `pagexml_to_iiif.py` | Converts eScriptorium PAGE-XML exports into IIIF Web Annotations (`p1.ap.json`, `p2.ap.json`, …) and builds a `mapping.json` linking canvases to annotations. |

│  HTML + CSS + JavaScript                                     │| `build_search_index.py` | Aggregates all annotation texts into a searchable JSON index used by the “Search Transcriptions” page. |

│  No server-side processing required                          │

│  Hostable on GitHub Pages, Netlify, etc.                    │### 📁 Data Layer

└─────────────────────────────────────────────────────────────┘- **`/data/manifests.yml`** — master registry linking manuscript slugs to manifest URLs.

```- **`/data/annos/<slug>/`** — holds per-manuscript annotation pages and mapping files.

- **`/data/search_index.json`** — global text index for fuzzy/full-text search.

---- **`/data/records.json`** — exported Heurist dataset for the database explorer.



## 2. Technology Stack

### Backend (Build-Time)

- **Ruby 3.2+** with Jekyll 4.3
- **Python 3.8+** for data processing scripts
- **Bundler** for Ruby gem management
- **pip/conda** for Python package management

### Frontend

- **HTML5/CSS3** with responsive design
- **JavaScript (ES6+)** for interactive features
- **Bootstrap 4** for UI components and responsive grid
- **D3.js v7** for all data visualizations:
  - Force-directed network graphs (Scribes, Network Explorer, Text Genres)
  - Hierarchical tree layouts (Production Unit trees)
  - Geographic maps (Leaflet integration)
  - Bar charts and statistical visualizations
  - Bipartite graph layouts (Text Genres networks)
- **Mirador 3** for IIIF image viewing
- **OpenSeadragon** for deep zoom in IIIF viewer
- **ElasticLunr.js** for client-side full-text search
- **html2canvas** for high-resolution PNG export (300 DPI)
- **Papa Parse** for CSV import/export with UTF-8 support
- **Leaflet** with Leaflet.markercluster for interactive maps
- **jQuery 3.2.1** for DOM manipulation

### Data Formats

- **IIIF Presentation API** (v2/v3)
- **Web Annotation Data Model**
- **PAGE-XML** (PRImA format)
- **JSON/YAML** for data interchange
- **CSV** for database exports

---

## 3. Data Flow Summary

1. **Heurist** → exports structured records.
2. **eScriptorium** → exports transcriptions as PAGE-XML.
3. **Python scripts** → normalize and transform both into standardized IIIF-compliant JSON.
4. **Static site build** → Jekyll + JavaScript use these data files to create interactive interfaces.

---



---## 4. Interoperability & Standards



## 3. Data Pipeline| Standard | Use |

|-----------|-----|

### 3.1 Heurist Export| **IIIF Presentation API (v2/v3)** | Access to manuscript images and metadata. |

**Source:** Heurist database (https://heurist.huma-num.fr/)| **Web Annotation Data Model** | Structuring line-level transcription data. |

| **PAGE-XML (PRImA format)** | Input from HTR models (eScriptorium). |

**Process:**| **JSON / YAML** | Interchange and storage for local data. |

1. Export structured data as CSV from Heurist| **CSV** | Simple import/export bridge with Heurist. |

2. Place in `/data/manuscripts.csv`

3. Contains entities: Manuscripts, Production Units, Scribal Units, Texts, People, Institutions---



**Fields include:**## 5. Sustainability

- Manuscript dimensions (Codex height, Codex width)

- Material, dating, provenance- Entire system runs on **static files** (no server required).

- Holding institution, call numbers- Compatible with **GitHub Pages** hosting.

- Relationships between entities- Reproducible data pipeline (Heurist + Python + IIIF standards).

- Modular: each manuscript or dataset can be regenerated independently.

### 3.2 Manuscript Setup

**Script:** `scripts/setup_manuscripts.py`---



**Functions:**## 6. Integration Diagram

- Creates folder structure: `/data/annos/<manuscript-slug>/`Heurist DB ──┬──► Exported Metadata (CSV)

- Generates manifest registry: `/data/manifests.yml`│

- Links manuscript slugs to IIIF manifest URLs├──► Python Setup Scripts ──► data/manifests.yml

- Prepares annotation directories│                             data/annos//

│                             data/search_index.json

**Usage:**│

```basheScriptorium ─┘──► PAGE-XML ──► IIIF Annotation JSON

python scripts/setup_manuscripts.py│

```▼

Jekyll + JS Website

### 3.3 Transcription Processing├─ /explore-database/

**Script:** `scripts/pagexml_to_iiif.py`├─ /viewer/

└─ /search-transcriptions/

**Process:**

1. Reads PAGE-XML exports from eScriptorium

2. Converts to IIIF Web Annotation format

3. Creates per-page annotation files: `p1.ap.json`, `p2.ap.json`, etc.---

4. Generates `mapping.json` linking canvases to annotations

## 7. Key Principles

**Output:** `/data/annos/<manuscript-slug>/`

- **Transparency:** All transformations are documented and reproducible.

**Usage:**- **Interoperability:** Uses IIIF and Web Annotation standards.

```bash- **Humanistic grounding:** Every digital layer remains connected to codicological and historical evidence.

python scripts/pagexml_to_iiif.py <manuscript-slug>- **Scalability:** New manuscripts and transcriptions can be added incrementally.

```- **Accessibility:** Designed for open access and reuse in the field of medieval studies.



### 3.4 Search Index Building---

**Script:** `scripts/build_search_index.py`

## 8. Future Extensions

**Process:**

1. Aggregates all transcription texts from annotation files- Dynamic linkage back to Heurist entries via API.

2. Creates searchable index with metadata- IIIF Highlights for line selection within Mirador.

3. Includes manuscript, folio, line-level information- Integration with text-mining and stylistic analysis modules.

4. Outputs `/data/search_index.json`- Persistent identifiers for manuscripts and scribes.



**Usage:**---

```bash

python scripts/build_search_index.py*Maintained by:*  

```**Estelle Guéville** — Yale University, Medieval Studies  

Director of the *Unknown Hands* project.
### 3.5 Jekyll Data Processing
**Built-in:** Jekyll reads data files during build

**Process:**
1. `_data/` folder YAML/JSON files loaded automatically
2. `assets/data/` files loaded via JavaScript fetch
3. Liquid templates process data at build time
4. JavaScript handles runtime data manipulation

---

## 4. Transcription System

The platform provides full-text searchable transcriptions of manuscript pages, integrated with the IIIF viewer.

### 4.1 Workflow Overview

```
1. Transcribe in eScriptorium → Export PAGE-XML
2. Convert PAGE-XML → IIIF Annotations (pagexml_to_iiif.py)
3. Build search index (build_transcription_corpus.py)
4. View in Mirador + Search across all manuscripts
```

### 4.2 Data Structure

```
data/
├── annos/                    # Annotation storage
│   ├── ms-423/              # One folder per manuscript (slug)
│   │   ├── p1.ap.json       # Page 1 annotations
│   │   ├── p2.ap.json       # Page 2 annotations
│   │   ├── ...
│   │   └── mapping.json     # Canvas → Annotation mapping
│   ├── ms-65/
│   └── ...
│
├── transcriptions/           # Alternative location (Arras manuscript)
│   └── irht-fr1dgmfio4zw/
│       ├── annotations/
│       │   ├── p1.json
│       │   └── ...
│       └── mapping.json
│
├── manifests.yml             # Manuscript registry (slug → manifest URL → annos path)
├── manuscripts.csv           # Manuscript metadata
└── manifest-annos-map.json   # Generated: manifest URL → annos path (for viewer)

assets/search/
└── transcriptions.json       # Full-text search index (31MB, 88K+ lines)
```

### 4.3 File Formats

**Annotation Page (`p1.ap.json`)**:
```json
{
  "id": "data/annos/ms-423/p1.ap.json",
  "type": "AnnotationPage",
  "items": [
    {
      "id": "https://...canvas/1#anno-1",
      "type": "Annotation",
      "motivation": "supplementing",
      "body": {
        "type": "TextualBody",
        "value": "Transcribed text here",
        "format": "text/plain"
      },
      "target": {
        "source": "https://...canvas/1",
        "selector": {
          "type": "FragmentSelector",
          "value": "xywh=1205,726,1556,101"
        }
      }
    }
  ]
}
```

**Mapping File (`mapping.json`)**:
```json
{
  "manifest": "https://institution.org/iiif/manifest",
  "items": [
    {
      "canvas": "https://institution.org/iiif/canvas/1",
      "annotationPage": "/data/annos/ms-423/p1.ap.json"
    }
  ]
}
```

### 4.4 Adding New Transcriptions

**Prerequisites:**
1. Manuscript is in `data/manuscripts.csv` with IIIF manifest URL
2. Pre-existing empty folder in `data/annos/<slug>/`
3. PAGE-XML export from eScriptorium

**Steps:**

1. **Find the correct slug**:
   ```bash
   ls data/annos/ | grep -i "<manuscript-name>"
   ```

2. **Get manifest URL from manuscripts.csv**:
   ```bash
   grep "<manuscript-name>" data/manuscripts.csv
   ```

3. **Convert PAGE-XML to IIIF annotations**:
   ```bash
   python scripts/pagexml_to_iiif.py \
     <MANIFEST_URL> \
     <PATH_TO_PAGEXML_FOLDER> \
     ./data/annos \
     <SLUG>
   ```
   
   Example:
   ```bash
   python scripts/pagexml_to_iiif.py \
     https://bibliotheque-numerique.ville-laon.fr/iiif/1465/manifest \
     ~/Downloads/LaonBibliothequemunicipaleMs423/ \
     ./data/annos \
     ms-423
   ```

4. **Fix paths in annotation files** (if needed):
   ```bash
   find data/annos/<slug> -name "*.ap.json" -exec sed -i '' 's|wrong-path|correct-path|g' {} \;
   ```

5. **Rebuild search index**:
   ```bash
   python scripts/build_transcription_corpus.py
   ```
   This creates `assets/search/transcriptions.json` with all transcriptions.

6. **Update manifest map** (for viewer links):
   ```bash
   python scripts/generate_manifest_map.py
   ```
   This creates `data/manifest-annos-map.json`.

7. **Rebuild Jekyll site**:
   ```bash
   bundle exec jekyll build
   ```

### 4.5 Search Implementation

- **Frontend**: `/pages/search-transcriptions.md` with Lunr.js for full-text search
- **Index**: `assets/search/transcriptions.json` (pre-built, loaded on first search)
- **Features**: Fuzzy search (0-2 edits), sort by relevance/manuscript/folio, group by manuscript, export results
- **Performance**: Lazy loading (31MB index only loads when user searches), suitable for ~230 manuscripts

### 4.6 Viewer Integration

The IIIF viewer (Mirador 3) displays transcriptions alongside manuscript images:

1. **Database page** generates viewer links with `annos` parameter:
   ```
   /viewer/?manifest=<MANIFEST_URL>&annos=/data/annos/ms-423/mapping.json
   ```

2. **Viewer loads** manifest and mapping.json

3. **For each canvas**, viewer fetches the corresponding annotation page

4. **Transcriptions overlay** on images with coordinates from xywh selectors

**Configuration**: `data/manifest-annos-map.json` maps all manifest URLs to their annotation paths, loaded by both database and viewer pages.

---

## 5. Website Structure

### 5.1 Page Types

#### Static Content Pages (Markdown)
- `/pages/about.md` → About the project
- `/pages/team.md` → Team members
- `/pages/participate.md` → How to contribute
- `/pages/publications.md` → Related publications
- `/pages/credits.md` → Acknowledgments

#### Interactive Application Pages (Markdown + JavaScript)

**Explore Database** (`/pages/explore-database.md`)
- Multi-entity database browser with 7 record types
- Faceted filtering and full-text search
- Dynamic facet system with type-aware rendering (enum, enum-multi, enum-search, year-range, num-range, text, resource, relationship-enum-multi)
- Entity switching with automatic facet DOM clearing to prevent state persistence bugs
- 9 visualization modes:
  1. **Browse & Search** — Grid view with filters
  2. **Analytics** — Statistical dashboard with entity filtering
  3. **Map** — Geographic distribution (8 view modes)
  4. **Hierarchical Tree** — Production unit hierarchies within manuscripts
  5. **Network** — Custom entity relationship networks
  6. **Scribes** — Scribal network analysis and statistics
  7. **Multilingualism** — Language analysis across 5 dimensions
  8. **Text Genres** — Genre relationships via bipartite networks
  9. **Colophon Analysis** — Sentiment, thematic, and linguistic analysis

**Viewer** (`/pages/viewer.md`)
- IIIF image viewer using Mirador 3
- Synchronized transcription display
- Line-by-line navigation
- Multi-manuscript comparison

**Search Transcriptions** (`/pages/search-transcriptions.md`)
- Full-text and fuzzy search across all transcriptions
- Results show manuscript, folio, and line context
- Direct links to viewer

### 4.2 Layouts (`_layouts/`)
- `default.html` — Base layout with navigation
- `page.html` — Standard content pages
- `exhibit.html` — Exhibition-style pages
- `generic_collection_item.html` — Collection item display
- `scribe_item.html` — Scribe-specific display

### 4.3 Includes (`_includes/`)
- `header.html` — Site navigation and logo
- `footer.html` — Footer with credits
- `head.html` — Meta tags, CSS, fonts
- `search_box.html` — Search component
- `collection_gallery.html` — Image gallery
- `osd_iiif_image_viewer.html` — OpenSeadragon viewer
- `item_metadata.html` — Metadata display tables

### 4.4 Assets

**Stylesheets** (`assets/` and `_sass/`)
- `styles.scss` — Main stylesheet (compiles to CSS)
- `_bootstrap.scss` — Bootstrap customizations
- `_wax.scss` — Wax theme overrides
- Custom CSS for each major feature

**JavaScript** (`assets/`)
- `search-ui.js` — Search functionality
- `jquery-3.2.1.min.js` — jQuery library
- `popper.min.js` — Tooltip/popover positioning
- `elasticlunr.min.js` — Client-side search
- `bootstrap/` — Bootstrap JS components
- `datatables/` — Table sorting/filtering
- `openseadragon/` — IIIF image viewer

**Data** (`assets/data/`)
- `manuscripts.json` — Processed Heurist export (all records)
- `scribal_units.json` — Scribal unit records
- `search-index.json` — Transcription search index

---

## 5. Key Features

### 5.1 Database Explorer (Explore Database Page)

#### Browse & Search Mode
- **7 Entity Types:** Scribal Units (SU), Manuscripts (MS), Production Units (PU), Holding Institutions (HI), Monastic Institutions (MI), Historical People (HP), Texts (TX)
- **Dynamic Facet System:** 
  - Auto-generated filters based on record type and field metadata
  - Type-aware rendering: `enum` (single select), `enum-multi` (checkboxes), `enum-search` (searchable dropdown), `year-range` (dual slider), `num-range` (min/max inputs), `text` (input), `resource` (entity links), `relationship-enum-multi` (related entity multiselect)
  - Facet state management with URL parameter serialization
  - Entity switching triggers facet DOM clearing to prevent checkbox persistence bugs
- **Search Options:** 
  - Full-text search across all entity fields
  - Field-specific search with dropdown selector
  - Search combines with active facet filters (AND logic)
- **Sorting:** Multiple sort criteria (title, date, relevance)
- **Pagination:** Configurable results per page (10/25/50/100)
- **Export:** CSV download of filtered results with field selection
- **Details Panel:** Click any record to see full metadata, relationships, and navigation links

**Technical Implementation:**
- Client-side filtering with indexed data structures for performance
- Facet computation via `computeList()` function that tracks unique values and counts
- `recompute(clearFacets=false)` function handles filter state updates
- `switchEntity(newType)` clears facet DOM before recomputation to prevent type conflicts (e.g., PU and MS both having "Watermark" facet with different types)

#### Map Mode (8 Views)
1. **Manuscripts - Current Location:** Where manuscripts are held today
2. **Manuscripts - Production Location:** Where manuscripts were created
3. **Production Units - All Locations:** All PU geographic data
4. **Production Units - By Monastery:** PUs grouped by monastic institution
5. **Monastic Institutions:** All monasteries
6. **Holding Institutions:** All libraries/archives
7. **Historical People:** People with location data
8. **Combined View:** All entity types on one map

**Features:**
- Interactive Leaflet maps with Leaflet.markercluster plugin
- Click markers for record details in popup
- Color-coded by entity type with custom icons
- Zoom to fit all markers automatically
- Export visible data as CSV
- Export map as PNG (300 DPI)

#### Timeline Mode (4 Views)
1. **Manuscripts Timeline:** Distribution over centuries
2. **Production Units Timeline:** PU dating patterns
3. **Scribal Units Timeline:** SU temporal distribution
4. **Combined Timeline:** All dated records

**Features:**
- Interactive bar charts (D3.js)
- Hover for counts and details
- Click bars to filter records to that time period
- Export timeline visualization as PNG (300 DPI)
- Export timeline data as CSV

#### Network Explorer Mode

**Custom Multi-Entity Network Builder**
- User selects entity types to include (any combination of 7 entity types)
- User selects relationship types to visualize
- Dynamic force-directed graph generation with D3.js

**Interactive Features:**
- Drag nodes to reposition
- Zoom and pan with mouse wheel and drag
- Hover nodes for tooltip with metadata
- Click nodes for full record details
- Relationship labels on edges (e.g., "Produced by", "Contains", "Written by")
- Filter panel to show/hide specific relationship types
- Color coding by entity type
- Node sizing by connection count or custom metric

**Export Options:**
- PNG (300 DPI)
- SVG vector format

**Use Cases:**
- Visualize manuscript production networks (PUs → Manuscripts → Institutions)
- Trace scribe relationships (Scribes → SUs → Manuscripts → Monasteries)
- Explore text transmission (Texts → Manuscripts → Scribes)
- Discover historical people connections (People → Institutions → Manuscripts)

#### Analytics Mode

**Statistical Dashboard**
- Entity-specific analytics with filter dropdown
- Distribution charts and temporal patterns
- Interactive visualizations with D3.js
- Export as high-resolution PNG (300 DPI)

#### Hierarchical Tree Mode

**Production Unit Hierarchy Visualization**
- D3.js hierarchical tree layout showing manuscript structure
- Expandable/collapsible nodes for production units
- Visual representation of parent-child relationships
- Click nodes for detailed metadata
- Export tree as PNG (300 DPI)

**Technical Implementation:**
- Builds tree from parent_id relationships in production units
- Handles multiple root nodes (manuscripts with multiple top-level PUs)
- Dynamic layout with automatic spacing

#### Scribes Mode *(NEW)*

**Scribal Network & Statistics**
- Force-directed network graph (D3.js) showing scribe-scribe connections
- Connection criteria: scribes who worked together (same manuscripts or monasteries)
- Node properties:
  - Size: proportional to manuscript/SU count
  - Color: entity type differentiation
  - Label: scribe name/identifier
- Interactive features: zoom, pan, drag nodes, hover tooltips
- Statistical overview panel:
  - Total scribes count
  - Network connectivity metrics
  - Collaboration patterns
  - Institutional distribution
- Export: PNG (300 DPI), SVG, CSV

**Use Cases:**
- Identify scribal collaboration networks
- Discover scribes who worked at multiple institutions
- Map scribal workshop relationships
- Analyze geographical distribution of scribal activity

#### Text Genres Network Analysis *(NEW)*

**Three Bipartite Network Visualizations:**

1. **Manuscript-Genre Network**
   - Left nodes: Manuscripts
   - Right nodes: Genres
   - Edges: "manuscript contains genre" relationships
   - Reveals genre co-occurrence patterns within manuscripts

2. **Institution-Subgenre Network**
   - Left nodes: Monastic/Holding Institutions
   - Right nodes: Text Subgenres
   - Edges: "institution produced subgenre" relationships
   - Shows institutional specialization patterns

3. **Scribe-Genre Network**
   - Left nodes: Scribes (Scribal Units)
   - Right nodes: Genres
   - Edges: "scribe copied genre" relationships
   - Identifies scribe genre specialization vs. versatility

**Layout Options:**
- **Horizontal Bipartite:** Two-column layout with clear entity separation
- **Radial:** Circular arrangement with central genre nodes

**Interactive Features:**
- D3.js force simulation with collision detection
- Zoom/pan with d3-zoom
- Node hover: highlight connected edges and nodes
- Link hover: emphasize specific connections
- Click nodes: display metadata tooltips
- Dynamic filtering by entity or genre

**Export Options:**
- **PNG:** 300 DPI high-resolution images for publication
- **SVG:** Vector format for further editing
- **Embed Codes:** Iframe snippets for external websites

**Technical Implementation:**
- Builds bipartite graphs from entity-genre relationships in dataset
- Force layout with custom positioning for bipartite structure
- Optional radial transformation using polar coordinates
- Debounced rendering for performance with large networks

#### Multilingualism Analysis Module

**Comprehensive Language Tracking**

5 analytical tabs providing multi-dimensional linguistic analysis:

**1. Overview Tab**
- Statistical summary of language distribution across corpus
- Multilingual manuscript count (manuscripts with 2+ languages from ANY source)
- Language frequency charts
- Temporal and geographic patterns
- PU-based manuscript counting for consistency with other tabs

**2. Multilingual Manuscripts Tab**
- Lists all manuscripts containing multiple languages
- Sources include: Production Unit colophons, Scribal Unit colophons, Text languages, Scribe languages
- Expandable cards showing language breakdown per manuscript
- Language attribution icons: 📝 (colophon) / 📖 (text)
- Filtering by language, date range, institution
- Count consistent with Overview tab (PU-based grouping)

**3. Scribal Multilingualism Tab**
- Individual scribes who wrote in multiple languages
- Tracks languages across a scribe's entire body of work
- Distinguishes colophon language from text language
- Shows language diversity even when individual SUs are monolingual
- Scribe name, all languages used, SU count

**4. Institutional Multilingualism Tab**
- **Most comprehensive implementation:** tracks ALL language sources
  - Production Unit colophon languages
  - Scribal Unit colophon languages  
  - Text languages from manuscript relationships
  - Scribe languages (all scribes working at institution)
  - Manuscript-level language aggregation
- **Multilingualism Types:**
  - Multilingual manuscripts count (MSS with 2+ languages)
  - Multilingual scribes count (scribes using 2+ languages)
  - Institutional specialization (institution produces 2+ languages across corpus)
- **Display:** Institution name, all languages, MS count, scribe count, multilingualism type indicators
- **Detailed breakdown:** Expandable production-by-language view
- **Sorting:** By name or language diversity

**5. Colophon-Text Divergence Tab**
- Cases where colophon language ≠ text language
- Code-switching analysis
- Geographical and temporal patterns
- Religious order correlations

**Technical Implementation:**
- Language sourcing from multiple entity types with deduplication
- Set-based language aggregation for accuracy
- Multilingual manuscript detection: `languages.size >= 2`
- Comprehensive institutional tracking: merges PU, SU, text, scribe, and manuscript languages
- Production-by-language grouping for institutional detail view
- Consistent counting logic across all tabs (PU-based for manuscripts)

#### Colophon Analysis Module

**7 Analytical Tabs:**

**1. Overview Tab**
- Statistical summary: colophon presence, average length, language distribution
- Corpus-wide metrics

**2. Sentiment Analysis Tab**
- Keyword-based emotional tone detection
- 6 sentiment categories: humility, pride, labor, religious, temporal, dedication
- Most/least expressive colophons with expandable detail cards
- Matched keyword display for methodological transparency
- Sentiment score calculation and distribution charts
- "View SU" navigation buttons

**3. Thematic Analysis Tab**
- 8 colophon themes with example excerpts
- Themes: religious devotion, scribal identity, labor & completion, temporal markers, institutional context, dedication & patronage, personal expression, mistakes & corrections
- Expandable colophon examples per theme
- Theme co-occurrence patterns

**4. Linguistic Features Tab**
- Word count distribution
- Sentence complexity metrics
- First-person pronoun usage analysis
- Comparative statistics by region/period

**5. Comparative Patterns Tab**
- Regional sentiment variations
- Temporal patterns in colophon expression
- Religious order correlations
- Gender-based analysis
- Sentiment percentage breakdowns

**6. Browse Colophons Tab**
- Filterable colophon viewer (by language, date, institution, sentiment)
- Expandable/collapsible cards
- Copy-to-clipboard for transcriptions and translations
- Full-text search within colophons
- Direct links to viewer for manuscript context

**7. Explore Formulae Tab**
- Standardized formulaic pattern discovery
- Cross-linguistic formula comparison
- Regional and temporal formula distribution
- Formula frequency analysis

**Technical Implementation:**
- Keyword dictionaries for sentiment detection with weighted scoring
- Text parsing and tokenization for linguistic metrics
- Regex-based formula extraction
- Interactive D3.js visualizations for pattern analysis

**Visualization Types:**
- Statistics tables (mean, median, min, max)
- Box plots (distribution comparisons)
- Scatter plots (correlations)
- Bar charts (averages)
- Heatmaps (cross-tabulations)
- Stacked bar charts (proportions)
- Sentiment distribution charts
- Language distribution pie/bar charts
- Interactive expandable lists

**Export Capabilities Across All Modes:**
- **PNG Export:** All visualizations export as 300 DPI high-resolution images suitable for publication (maps, networks, trees, charts, analytics dashboards)
- **SVG Export:** Vector format for network graphs and select visualizations
- **CSV Export:** Statistical data tables, filtered record lists, search results
- **Embed Codes:** Iframe snippets for Text Genres networks (with query parameters preserving network type and filters)
- **Copy to Clipboard:** Colophon transcriptions, translations, and metadata

**Technical Implementation:**
- PNG export via `html2canvas` library with scale factor 3.125 (300 DPI at standard screen resolution)
- SVG export via DOM serialization of D3.js-generated elements
- CSV export via JavaScript `Papa.unparse()` with UTF-8 BOM for Excel compatibility
- Embed code generation with URL parameter encoding

**Gender Analysis**
- Gender distribution in scribal production
- Gender vs. geography patterns
- Gender vs. script correlations
- Temporal gender patterns

### 5.2 IIIF Viewer

**Features:**
- Mirador 3 integration for IIIF image viewing
- Synchronized transcription sidebar
- Line-by-line navigation
- Deep zoom on manuscript images
- Multiple viewing layouts
- Annotation layer toggle

**Workflow:**
1. Select manuscript from dropdown
2. Images load from IIIF manifest
3. Transcriptions load from annotation files
4. Click lines to highlight on image
5. Navigate page by page

### 5.3 Transcription Search

**Features:**
- Full-text search across all transcriptions
- Fuzzy matching for variant spellings
- Results include manuscript, folio, line number
- Context snippets with highlighting
- Direct links to viewer with line selection
- Export search results

**Technical:**
- ElasticLunr.js for client-side search
- Indexed on: transcription text, manuscript title, folio
- Fast (all data in browser, no server calls)

---

## 6. Development Setup

### 6.1 Prerequisites

Install required software:

```bash
# Ruby (via rbenv, rvm, or system)
ruby --version  # Should be 3.2+

# Bundler
gem install bundler

# Python (via conda or system)
python --version  # Should be 3.8+

# Jekyll dependencies
bundle install

# Python dependencies
pip install -r requirements.txt  # if exists
# or individually:
pip install lxml beautifulsoup4 pyyaml
```

### 6.2 Local Development

**Build site:**
```bash
bundle exec jekyll build
```

**Serve site locally:**
```bash
bundle exec jekyll serve
# Site available at: http://localhost:4000/unknownhands/
```

**Watch mode (auto-rebuild):**
```bash
bundle exec jekyll serve --watch
# or use --livereload for browser auto-refresh
bundle exec jekyll serve --livereload
```

**Build for production:**
```bash
JEKYLL_ENV=production bundle exec jekyll build
```

### 6.3 Project Configuration

**`_config.yml`** — Main Jekyll configuration
- Site title, description, author
- URL structure and baseurl
- Build settings and exclusions
- Plugin configuration

**`_config_dev.yml`** — Development overrides
```bash
# Use for local development:
bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

### 6.4 Adding New Content

**Add a static page:**
1. Create Markdown file in `/pages/`
2. Add front matter with layout and title
3. Write content in Markdown
4. Rebuild site

**Update database records:**
1. Export new CSV from Heurist
2. Replace `/data/manuscripts.csv`
3. Re-run Python scripts if needed
4. Rebuild site

---

## 7. Standards & Interoperability

### IIIF (International Image Interoperability Framework)
- **Presentation API 2.1/3.0:** Manuscript manifests
- **Image API:** Deep zoom image serving
- **Web Annotations:** Line-level transcriptions

### Web Standards
- **Linked Data:** RDF-compatible entity relationships
- **Schema.org:** Structured metadata for manuscripts
- **Dublin Core:** Basic descriptive metadata
- **TEI (Text Encoding Initiative):** Compatible with TEI exports

### Data Exchange
- **CSV:** Human-readable bulk import/export
- **JSON:** Machine-readable structured data
- **YAML:** Configuration and registry files
- **PAGE-XML:** HTR/transcription interchange format

---

## 8. Deployment

### 8.1 GitHub Pages (Recommended)

**Setup:**
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select branch (usually `main` or `gh-pages`)
4. Site builds automatically

**Custom domain:**
1. Add `CNAME` file with domain name
2. Configure DNS with your provider
3. Enable HTTPS in GitHub settings

### 8.2 Netlify

**Setup:**
1. Connect GitHub repository
2. Configure build settings:
   - Build command: `bundle exec jekyll build`
   - Publish directory: `_site`
3. Deploy automatically on push

**Environment variables:**
```
JEKYLL_ENV=production
```

### 8.3 Manual Deployment

**Build locally:**
```bash
JEKYLL_ENV=production bundle exec jekyll build
```

**Upload `_site/` folder to:**
- Apache/Nginx web server
- Amazon S3 + CloudFront
- Any static hosting service

---

## 10. License & Credits

**Code License:** MIT License (see LICENSE.txt)

**Content License:** CC BY-NC 4.0 (Attribution-NonCommercial)

**Built With:**
- [Jekyll](https://jekyllrb.com/) — Static site generator
- [Wax](https://minicomp.github.io/wax/) — Minimal computing framework
- [IIIF](https://iiif.io/) — Image interoperability standard
- [Mirador 3](https://projectmirador.org/) — IIIF viewer for manuscript images and transcriptions
- [D3.js v7](https://d3js.org/) — Data visualization (networks, trees, charts)
- [Leaflet](https://leafletjs.com/) — Interactive maps with clustering
- [Bootstrap 4](https://getbootstrap.com/) — UI framework and responsive design
- [ElasticLunr.js](http://elasticlunr.com/) — Client-side search engine
- [html2canvas](https://html2canvas.hertzen.com/) — High-resolution image export
- [Papa Parse](https://www.papaparse.com/) — CSV parsing and generation
- [jQuery](https://jquery.com/) — DOM manipulation library

**Project Team:**
- **Director:** Estelle Guéville, Yale University, Medieval Studies, Digital Humanities
- **Focus:** Pre-modern female scribal production

---

## 11. Contact & Links

**Project Website:** https://estellegvl.github.io/unknownhands/

**Repository:** https://github.com/EstelleGvl/unknownhands

**User Guide:** See `/documentation/USER_GUIDE.md`

**Report Issues:** https://github.com/EstelleGvl/unknownhands/issues

---

*Last updated: February 2026*
