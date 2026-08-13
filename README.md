# Unknown Hands

Digital edition and research website for pre-modern female scribes.

This repository combines:
- A custom Jekyll static site
- Heurist-derived datasets and exports
- IIIF viewers and interactive visualizations
- Python scripts for analysis and data preparation

## Quick Start

### 1) Install Ruby dependencies

```bash
BUNDLE_IGNORE_CONFIG=1 bundle install
```

### 2) Run locally (development config)

```bash
bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

If local Bundler configuration ever points at `vendor/bundle`, ignore it for verification:

```bash
BUNDLE_IGNORE_CONFIG=1 bundle exec jekyll build
```

### 3) Run checks

```bash
bundle exec rake site:build
```

## Project Structure

### Core website
- `pages/` - main authored pages (including Explore)
- `_includes/` - reusable HTML partials
- `_layouts/` - Jekyll layouts
- `assets/` - CSS, JS, images, front-end libraries
- `search/`, `viewer/` - feature-specific front-end assets/routes

### Data
- `data/` - manifests, heurist exports, transcriptions
- `exports/` - manuscript export directories
- `_data/` - Jekyll data files used at build time

### Scripts and tooling
- `scripts/` - Python scripts for ETL, analysis, validation
- `scripts/analysis/start-analysis-api.sh` - analysis API launcher
- `netlify/functions/` - Netlify serverless functions

## Documentation Guide

The `docs/` folder contains technical documentation and implementation notes:

- **Application Architecture**
  - [EXPLORE_ARCHITECTURE.md](docs/EXPLORE_ARCHITECTURE.md) - Overall modular architecture and data flow for the Javascript/visual interface in Explore page.

- **Data Model Documentation**
  - [DATABASE_STRUCTURE.md](docs/DATABASE_STRUCTURE.md) - Heurist database structure and entity relationships
  - [QUERY_STRATEGIES.md](docs/QUERY_STRATEGIES.md) - Query implementation strategies and filtering logic

- **Chatbot Documentation**
  - [RAG_CHATBOT_DOCUMENTATION.md](docs/RAG_CHATBOT_DOCUMENTATION.md) - Current documentation for the semantic RAG chatbot architecture, capabilities, limits, and scholarly context
  - [CHATBOT_REBUILD_SUMMARY.md](docs/archive/CHATBOT_REBUILD_SUMMARY.md) - Archived implementation notes for the chatbot rebuild
  - [CHATBOT_SETUP.md](docs/archive/CHATBOT_SETUP.md) - Netlify setup notes for the Gemini-powered chatbot
  - [CHATBOT_VISION.md](docs/archive/CHATBOT_VISION.md) - Archived vision and design principles for the chatbot


## Explore Database Architecture (current)

- `pages/explore-database.md` - thin page shell and script includes
- `_includes/explore/explore-database-markup.html` - extracted Explore UI markup
- `assets/css/explore.css` - Explore styles
- `assets/js/explore/app.js` - orchestrator
- `assets/js/explore/modules/` - feature modules (map, network, timeline, etc.)
- `assets/js/explore/config.js` - centralized UI configuration

### Browse & Search: Advanced Search

The Browse & Search interface includes a graph-aware **Advanced Search** panel. Unlike the standard facets, which mostly filter the currently selected entity type, Advanced Search lets users choose a result type and combine conditions from any loaded public entity type:

- Manuscripts
- Production Units
- Scribal Units
- Holding Institutions
- Monastic Institutions
- Historical People
- Texts
- Relationship Metadata

The query engine follows direct pointers, inbound references, and `relationships.json` links up to three graph steps from each candidate record. This makes searches such as "return Scribal Units where the script is textualis, the linked Production Unit is paper, and catchwords are present" possible from the browser without a backend database query.

Advanced Search fields are generated from the loaded Heurist-derived data. Fields backed by controlled terms, resource pointers, or short enumerated value sets display their existing vocabulary values as dropdown choices. Open-ended fields such as comments, transcriptions, translations, URLs, identifiers, and date fields remain free-text inputs.

### Explore navigation and research modules

The current primary navigation is:

`Browse & Search | Overview | Manuscript Structure | Scribes | Multilingualism | Colophons | Textual Genres`

Overview groups the three general corpus views—Summary, Map, and Network—under a secondary tab row. The research modules retain their own focused subtabs:

- **Manuscript Structure:** Structure Explorer, Materials & Format, Quire Construction, Page Layout, and Production Practices. Codicological analyses are generated dynamically from the public JSON exports; production-package research outputs are not published. Manuscript dimensions remain Manuscript-level, while justification and other production features remain Production-Unit-level. Material views include colophon and subgenre relationships, and collaboration links to Scribes → Collaborations.
- **Scribes:** Overview, Productivity Patterns, Unseen Species Analysis, Collaborations, Geography, and Browse All.
- **Multilingualism:** Overview, Multilingual Manuscripts, Scribal Multilingualism, Institutional Multilingualism, and Colophon-Text Divergence.
- **Colophons:** Overview & Method, Browse & Read, Formulae, and Contexts. Repeated colophon fields are treated as distinct readable instances; translation-dependent rhetoric, punctuation, sentiment, and length measurements are excluded. Contextual views use structured catalogue fields and explicit denominators.
- **Textual Genres:** Overview, Manuscript Networks, Institution Networks, Scribe Networks, and proportional subgenre distributions by institution and country. Subgenre Popularity Over Time is an all-subgenre century heatmap with counts, within-century shares, and visible sample sizes.

The selected primary mode and module subtab are written to the page URL, so a specific analytical view can be bookmarked or shared. The interface restores the selected subtab when its module is reopened. Tabs use button semantics, active-state attributes, keyboard focus styles, and horizontally scrollable or wrapping layouts on narrow screens.

### Explore data presentation and exports

The Explore modules share a common visual system in `assets/css/explore.css`:

- module shells, visualization cards, summary cards, metric cards, tab rows, export controls, spacing, borders, and typography are consistent across modules;
- visualization cards use the available content width, while summary cards are equal-sized and centered;
- heavily skewed horizontal distributions use full-width stacked cards so small categories have more usable drawing space;
- categorical bar lengths represent each category's share of the relevant known total rather than scaling the largest category to an artificial 100%;
- labels matching `Unknown` or `TBC` (including common qualified forms) are excluded from visual aggregations through the shared `isKnownCategory` helper;
- large record-card views are paginated, including Scribes Browse All and the manuscript, scribe, institution, and divergence lists in Multilingualism;
- every rendered visualization has a local export control in its own card. There is no module-level “download the whole view” button. PNG is the common card export format; Map, Network, Timeline, and manuscript-tree views retain their applicable PNG/SVG or data exports;
- export controls are hidden during image capture, so they do not appear in downloaded graphics.

The Multilingualism overview is cached after its first construction and restored without rebuilding all of its aggregates. Export controls use delegated event handling so they continue to work when cached or dynamically rendered module content is remounted.

Public interface copy uses text labels and SVG controls rather than decorative emoji characters.

## ALTO Transcription and IIIF Annotation Pipeline

The transcription system is now ALTO-first. Manuscript metadata comes from `data/manuscripts.csv`; ALTO exports are dropped into `exports/alto/ms-<HeuristID>/`; generated IIIF annotation pages are written to `data/annos/ms-<HeuristID>/`.

Current searchable transcription coverage:

- 131 manuscript search chunks generated from available ALTO transcriptions
- 2,278,894 searchable transcription lines
- Per-manuscript search chunks in `assets/search/manuscripts/`
- 373 IIIF manuscript registry entries in `data/manifests.yml`

Refresh workflow after adding ALTO exports:

```bash
BUNDLE_IGNORE_CONFIG=1 bundle exec rake data:refresh_all
```

The task above runs the full refresh: manuscript registry, ALTO-to-IIIF annotations, transcription search indexes, scribal fingerprint mapping, generated scribe profiles, and a Jekyll build.

Equivalent manual steps:

```bash
python3 scripts/setup_manuscripts.py data/manuscripts.csv
/opt/anaconda3/bin/python scripts/pagexml_to_iiif.py --all
/opt/anaconda3/bin/python scripts/build_transcription_corpus.py
/opt/anaconda3/bin/python scripts/split_search_corpus.py
/opt/anaconda3/bin/python scripts/paleography_pipeline/map_scribes_to_manuscripts_v2.py
/opt/anaconda3/bin/python scripts/paleography_pipeline/generate_scribe_profiles_v4.py
/opt/anaconda3/bin/python scripts/paleography_pipeline/export_fingerprint_crops.py
BUNDLE_IGNORE_CONFIG=1 bundle exec jekyll build
```

`scripts/setup_manuscripts.py` regenerates `data/manifests.yml` from the CSV and creates any missing ALTO drop folders. `scripts/pagexml_to_iiif.py --all` discovers every `exports/alto/ms-<id>/` folder containing ALTO XML, reads the manuscript's IIIF manifest, matches ALTO pages to canvases, writes annotation pages, updates `data/manifest-annos-map.json`, and continues past individual manifest failures so one bad endpoint does not block the full refresh.

Known manifest issues from the June 2026 refresh:

- `ms-15828` did not return parseable IIIF JSON during conversion.
- `ms-15912` did not return parseable IIIF JSON during conversion.
- `ms-16244` uses `https://gallica.bnf.fr/view3if/ga/ark:/12148/btv1b52520423n`, which did not parse as a direct IIIF JSON manifest during conversion.
- `ms-16316` returned a 404 for its IIIF manifest URL.

These folders have ALTO exports, but they are not included in the searchable manuscript set until their manifest URLs are corrected or the converter is adapted for those endpoints.

## Scribal Fingerprints Pipeline

The scribal fingerprints module uses the same ALTO and IIIF infrastructure. A manuscript is eligible only when it has exactly one production unit and one of the following scribal configurations:

- exactly one scribal unit, treated as a full-manuscript match
- multiple scribal units, but only for scribal units with a precise, parseable folio range

Multi-scribe manuscripts are handled at scribal-unit level: when a scribal unit has a parseable folio range and the IIIF mapping exposes matching canvas labels, crop extraction is restricted to that segment so samples are not mixed across hands. Scribal units without precise ranges, or manifests whose canvas labels cannot be matched to those ranges, are deliberately skipped.

Refresh workflow:

```bash
python3 scripts/paleography_pipeline/map_scribes_to_manuscripts_v2.py
/opt/anaconda3/bin/python scripts/paleography_pipeline/generate_scribe_profiles_v4.py
```

The generator samples up to 10 examples per grapheme per manuscript, skips a percentage of opening and closing pages, filters to the central text area, and prefers ALTO glyph coordinates over ALTO word coordinates. Grapheme crops are grouped by manuscript on each scribe profile, with links back to the IIIF viewer and Explore Database records.

Generic low-attribution labels containing `unidentified` are excluded from public fingerprint generation. Named women and curated inferred identities, such as scholarly numbered nun-scribes or scriptrix-group labels, remain eligible when their manuscript, scribal-unit, and folio evidence satisfies the rules above.

Current June 2026 fingerprint coverage:

- 73 conservative public scribe profiles
- 127 ALTO+annotation manuscript folders available for fingerprint extraction
- 97 manuscript slugs represented in the exported crop index
- 15,694 exported crop records
- Target graphemes currently exported: `a`, `b`, `c`, `d`, `e`, `g`, `h`, `l`, `o`, `p`, `q`, `r`, `s`, `t`
- Multi-scribe manuscripts without parseable folio ranges or matching IIIF canvas labels are skipped
- Each multi-scribe profile displays the source folio range used for extraction

## Semantic RAG Chatbot

The site includes a semantic AI chatbot at `/chatbot/`. It is designed for natural-language, analytical questions about the *Unknown Hands* colophon corpus rather than exact boolean counting.

The chatbot uses Retrieval-Augmented Generation (RAG):

- `scripts/rag_pipeline/extract_colophons.py` builds enriched text chunks from Heurist-derived records and relationship data.
- `scripts/rag_pipeline/generate_embeddings.py` generates vector embeddings for those chunks.
- `data/rag_data/colophon_embeddings.json` stores the static embedding corpus.
- `netlify/functions/rag.js` performs serverless retrieval and answer synthesis.
- `pages/chatbot.md` provides the public chat interface.

At query time, the Netlify function embeds the user's question, retrieves the top 30 semantically relevant colophon contexts with cosine similarity, and sends those contexts to Gemini for a grounded synthesis. Responses include referenced manuscript/source badges where available.

Current deployment pattern:

- The public static site may be served from GitHub Pages/custom domain at `https://estellegueville.com/unknownhands/`.
- The private RAG backend is served by Netlify at `https://unknownhands.netlify.app/.netlify/functions/rag`.
- `pages/chatbot.md` uses the same-origin Netlify function path when opened on Netlify or localhost, and otherwise calls the absolute Netlify function URL. This keeps `GEMINI_API_KEY` out of the browser while allowing the GitHub Pages site to use the serverless backend.

Important limits:

- The embedding corpus is static and must be regenerated when the underlying Heurist export changes.
- The chatbot is semantic, not exhaustive; use Browse, Advanced Search, or CSV export for exact counts.
- All AI-generated interpretations should be checked against the referenced manuscripts and database records.

Operational notes:

- Netlify requires `GEMINI_API_KEY`, `RUBY_VERSION=3.2.6`, and `NODE_VERSION=20` in project environment variables.
- Do not commit `.bundle/` or `vendor/bundle/`. Netlify must install Ruby gems on its Linux build image so native extensions match the deployment platform.
- `Gemfile.lock` includes `x86_64-linux` for Netlify compatibility.

## Root Files: Keep, Move, Delete

### Keep in root (expected by ecosystem)
- `_config.yml`, `_config_dev.yml` - Jekyll configs
- `Gemfile`, `Gemfile.lock` - Ruby dependencies
- `Rakefile` - project build and data refresh tasks
- `Dockerfile` - container build
- `netlify.toml` - Netlify deployment config
- `vocabulary.json` - currently consumed at site root path

## Repository Updates (August 2026)

The codebase has recently undergone significant optimization:

- **Explore Page Refactor**: The previously massive `explore-database-markup.html` and `explore.js` files have been divided into smaller, specialized modules.
  - HTML logic is now in `_includes/explore/explore-database-markup.html`.
  - JS logic is now strictly modularized under `assets/js/explore/modules/` with `app.js` serving as the core orchestrator.
  - Custom styles and utilities have been fully moved natively into `assets/css/explore.css`, replacing heavy inline styles.
- **Repository Cleanup**: Obsolete documentation, data exports, and testing markups have been archived or removed to ensure better maintainability.
- **Explore Information Architecture**: General views are grouped under Overview, while Manuscript Structure and the four thematic research modules have stable first-level navigation entries.
- **State and Accessibility**: Primary modes and subtabs support direct URLs, state restoration, keyboard focus, active-state attributes, and narrow-screen tab navigation.
- **Visualization Consistency**: Shared responsive cards, centered summary metrics, full-width skewed distributions, accurate total-based ratios, and per-visualization export buttons now apply across the analytical modules.
- **Data Quality in Visualizations**: Unknown and TBC categories are omitted from visual summaries, maps, networks, trees, and charts through a shared category check.
- **Codicological Analysis**: Dynamic material, format, quire, layout, ruling, catchword, signature, colophon, and subgenre views now share explicit units and denominators. Uncertain normalized dates and places contribute to every represented value, and multi-valued quire types are classified as Varia.
- **Large Result Sets**: Long record-oriented module views use client-side pagination.
- **Multilingualism Performance**: The expensive overview aggregation is cached and reused when returning to the module.
- **Interface Styling**: Decorative emoji characters were removed from public interface labels in favor of plain text and SVG-based controls.

## Deployment

- Static site build: Jekyll
- CI checks: `bundle exec jekyll build` and JavaScript syntax validation
- Netlify config: `netlify.toml`
- Netlify build command: `bundle exec jekyll build`
- Netlify publish directory: `_site`
- Netlify functions directory: `netlify/functions`
- If a Netlify deploy fails after dependency changes, use **Clear cache and deploy site**.

## License

See `LICENSE.txt`.
