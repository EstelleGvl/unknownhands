# 🕯 Unknown Hands — Technical Documentation# 🕯 Unknown Hands — Technical Architecture Overview



> **Unknown Hands** is a digital humanities research platform for documenting, analyzing, and visualizing the work of pre-modern female scribes (before 1600). The platform integrates structured metadata, IIIF-compliant manuscript images, machine-readable transcriptions, and interactive data exploration tools.> *Unknown Hands* is a digital research and publication ecosystem designed to document, analyze, and visualize the work of pre-modern female scribes (before 1600).  

> It integrates structured metadata (Heurist), manuscript images and IIIF manifests, machine-readable transcriptions, and searchable interfaces.

---

---

## Table of Contents

## 1. System Overview

1. [System Architecture](#1-system-architecture)    +---------------------------+

2. [Technology Stack](#2-technology-stack)    |        Heurist DB         |

3. [Data Pipeline](#3-data-pipeline)    | (research data model)     |

4. [Website Structure](#4-website-structure)    |  - Scribal Units          |

5. [Key Features](#5-key-features)    |  - Production Units       |

6. [Development Setup](#6-development-setup)    |  - Manuscripts            |

7. [Standards & Interoperability](#7-standards--interoperability)    +------------+--------------+

8. [Deployment](#8-deployment)                 |

       CSV/JSON Export

---                 ↓

    +---------------------------+

## 1. System Architecture    |    Python Data Pipeline    |

    |---------------------------|

```    | setup_manuscripts.py      | → creates folders, manifest registry

┌─────────────────────────────────────────────────────────────┐    | pagexml_to_iiif.py        | → converts PAGE-XML → IIIF Annotation JSON

│                      DATA SOURCES                            │    | build_search_index.py     | → builds full-text search index

├─────────────────────────────────────────────────────────────┤    +------------+--------------+

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

├─────────────────────────────────────────────────────────────┤### 🧩 Heurist Database

│  • Liquid templating                                         │- Central research model defining entities and relationships:

│  • Markdown content pages                                    │  - *Scribal Unit*, *Production Unit*, *Manuscript*, *Text*, *Person*, *Language*, *Institution*.

│  • SASS/SCSS compilation                                     │- Exports periodically as CSV/JSON to feed the static site.

│  • Asset pipeline                                            │- Serves as **authoritative metadata** and **relational backbone**.

└──────────┬──────────────────────────────────────────────────┘

           │### ⚙️ Python Scripts

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



## 2. Technology Stack### 🌐 Jekyll Website

A modular static site using:

### Backend (Build-Time)- **Jekyll** for content and layout

- **Ruby 3.2+** with Jekyll 4.3- **JavaScript** for dynamic functionality

- **Python 3.8+** for data processing scripts- **Mirador 3** for IIIF viewing

- **Bundler** for Ruby gem management

- **pip/conda** for Python package management#### Main pages:

| Page | Function | Linked Data |

### Frontend|------|-----------|--------------|

- **HTML5/CSS3** with responsive design| `/explore-database/` | Browse Heurist records with facets and filters. | `data/records.json` |

- **JavaScript (ES6+)** for interactive features| `/viewer/` | View digitized manuscript images with synchronized transcriptions. | IIIF manifest + `mapping.json` |

- **Bootstrap 4** for UI components| `/search-transcriptions/` | Search across all transcriptions, show folio and viewer link. | `data/search_index.json` |

- **D3.js** for data visualizations

- **Mirador 3** for IIIF image viewing---

- **OpenSeadragon** for deep zoom

- **ElasticLunr.js** for client-side search## 3. Data Flow Summary



### Data Formats1. **Heurist** → exports structured records.

- **IIIF Presentation API** (v2/v3)2. **eScriptorium** → exports transcriptions as PAGE-XML.

- **Web Annotation Data Model**3. **Python scripts** → normalize and transform both into standardized IIIF-compliant JSON.

- **PAGE-XML** (PRImA format)4. **Static site build** → Jekyll + JavaScript use these data files to create interactive interfaces.

- **JSON/YAML** for data interchange

- **CSV** for database exports---



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

## 4. Website Structure

### 4.1 Page Types

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
- 5 visualization modes:
  1. **Browse & Search** — Grid view with filters
  2. **Map** — Geographic distribution (8 view modes)
  3. **Timeline** — Temporal analysis (4 view modes)
  4. **Network** — Entity relationships
  5. **Analytics** — Statistical analyses (3 modules)

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
- **7 Entity Types:** Scribal Units, Manuscripts, Production Units, Holding Institutions, Monastic Institutions, Historical People, Texts
- **Dynamic Facets:** Auto-generated filters based on record type
- **Search Options:** Full-text search across all fields or specific field search
- **Sorting:** Multiple sort criteria (title, date, etc.)
- **Pagination:** Configurable results per page
- **Export:** CSV download of filtered results
- **Details Panel:** Click any record to see full metadata

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
- Interactive Leaflet maps with clustering
- Click markers for record details
- Color-coded by entity type
- Zoom to fit all markers
- Export visible data as CSV

#### Timeline Mode (4 Views)
1. **Manuscripts Timeline:** Distribution over centuries
2. **Production Units Timeline:** PU dating patterns
3. **Scribal Units Timeline:** SU temporal distribution
4. **Combined Timeline:** All dated records

**Features:**
- Interactive bar charts (D3.js)
- Hover for counts and details
- Click bars to filter records
- Export timeline data

#### Network Mode
- **Entity Relationships:** Visualizes connections between records
- **Interactive Graph:** Drag nodes, zoom, pan
- **Relationship Types:** Shows connection labels (e.g., "Produced by", "Contains")
- **Click Nodes:** View record details
- **Filters:** Show/hide relationship types

#### Analytics Mode (5 Modules)

**Paleographic Analysis**
- Script distribution across time periods
- Script correlations with geography/gender
- Visualization: stats tables, bar charts, heatmaps

**Gender Analysis**
- Gender distribution in scribal production
- Gender vs. geography patterns
- Gender vs. script correlations
- Temporal gender patterns

**Codicological Analysis**
- Material vs. Size: Parchment/paper size comparisons
- Size vs. Date: Manuscript dimensions over time
- Quire Patterns: Catchwords and signatures analysis
- Column Patterns: Column layouts vs. dimensions
- Margin Ratio: Codex size vs. writing space ratio
- Custom Analysis: User-defined variable comparisons

**Multilingualism Module** *(NEW)*
- Overview: Distribution of languages across manuscripts and scribal units
- Manuscripts Tab: Language patterns per manuscript with filtering
- Scribes Tab: Language attribution at scribal unit level (colophon vs. text language)
- Institutions Tab: Linguistic diversity by monastic institution
- Colophon-Text Divergence: Analysis of cases where colophon and text languages differ
- Pattern Analysis: Geographical, temporal, and religious order correlations
- Icons: 📝 (colophon language) and 📖 (text language) for clear attribution

**Colophon Analysis Module** *(NEW)*
- Overview: Statistical summary of colophon presence and characteristics
- Sentiment Analysis: Emotional tone detection (humility, pride, labor, religious, temporal, dedication)
  - Most/Least Expressive Colophons with expandable lists
  - Matched keyword display for transparency
  - "View SU" buttons for quick navigation
- Thematic Analysis: 8 themes (religious devotion, scribal identity, labor & completion, temporal markers, institutional context, dedication & patronage, personal expression, mistakes & corrections)
  - Expandable example colophons per theme
- Linguistic Features: Word count, sentence complexity, first-person usage analysis
- Comparative Patterns: Regional and temporal variations with sentiment percentages
- Browse Colophons: Filterable colophon viewer with expand/collapse cards and copy-to-clipboard functionality

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

**Export Capabilities:**
- Export visualizations as high-quality PNG (300 DPI)
- Export statistical data as CSV
- Export network graphs as SVG
- Copy colophon texts to clipboard

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

**Add a manuscript:**
1. Add entry to `/data/manuscripts.csv`
2. Create IIIF manifest (or link to existing)
3. Run `python scripts/setup_manuscripts.py`
4. Add PAGE-XML transcriptions to appropriate folder
5. Run `python scripts/pagexml_to_iiif.py <slug>`
6. Rebuild search index: `python scripts/build_search_index.py`
7. Rebuild site: `bundle exec jekyll build`

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

## 9. Contributing

### Code Contributions
1. Fork the repository
2. Create feature branch
3. Follow existing code style
4. Test thoroughly
5. Submit pull request with description

### Data Contributions
- Suggest new manuscripts via GitHub issues
- Report errors in existing data
- Share transcription improvements
- Propose new analytical features

---

## 10. License & Credits

**Code License:** MIT License (see LICENSE.txt)

**Content License:** CC BY-NC 4.0 (Attribution-NonCommercial)

**Built With:**
- [Jekyll](https://jekyllrb.com/) — Static site generator
- [Wax](https://minicomp.github.io/wax/) — Minimal computing framework
- [IIIF](https://iiif.io/) — Image interoperability
- [Mirador](https://projectmirador.org/) — IIIF viewer
- [D3.js](https://d3js.org/) — Data visualization
- [Leaflet](https://leafletjs.com/) — Interactive maps
- [Bootstrap](https://getbootstrap.com/) — UI framework

**Project Team:**
- **Director:** Estelle Guéville, Yale University
- **Research:** Medieval Studies, Digital Humanities
- **Focus:** Pre-modern female scribal production

---

## 11. Contact & Links

**Project Website:** https://estellegvl.github.io/unknownhands/

**Repository:** https://github.com/EstelleGvl/unknownhands

**User Guide:** See `/documentation/USER_GUIDE.md`

**Report Issues:** https://github.com/EstelleGvl/unknownhands/issues

---

*Last updated: November 2025*
