# Unknown Hands

Research website and catalogue of manuscripts associated with female scribes in pre-modern Europe. The site combines Heurist catalogue exports, manuscript images served through IIIF, transcriptions, and tools for examining scribal production.

## Local development

Ruby requirements are specified in `.ruby-version`, `Gemfile`, and `Gemfile.lock`. Node.js is required for JavaScript checks. Python 3 supports data preparation.

```bash
bundle install
bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

The development site is served at `http://127.0.0.1:4000/`. The development configuration has an empty base path; the production base path is `/unknownhands`.

```bash
bundle exec jekyll build
bundle exec rake site:check_explore_cards
node scripts/validation/check_explore_search.cjs
node scripts/validation/check_explore_map_export.cjs
node scripts/validation/check_codicology_research.cjs
```

`BUNDLE_IGNORE_CONFIG=1` bypasses machine-specific Bundler settings if `.bundle/config` points to an incompatible gem installation. These checks exercise search paths, map capture, codicological calculations, and table coverage. They do not replace browser checks of layout, interaction, external images, and downloads.

## Repository layout

| Location | Contents |
| --- | --- |
| `pages/` | Research interfaces, user guide, and project pages |
| `_includes/`, `_layouts/`, `_sass/` | Page templates, shared markup, and styles |
| `assets/js/explore/` | Catalogue browsing, search, and research modules |
| `pages/text-analysis.md` | Browser text-analysis calculations and interface |
| `assets/css/` | Site and research-interface styles |
| `data/heurist/` | Heurist exports, including catalogue relationships |
| `data/manuscripts.csv`, `data/manifests.yml` | Manuscript registry and IIIF manifest locations |
| `assets/search/manuscripts/` | Searchable transcription files and their index |
| `data/paleography/`, `assets/data/`, `_scribes/` | Scribal mappings, handwriting crops, and profile pages |
| `assets/analysis/` | Index connecting scribal text samples to transcription pages |
| `data/rag_data/` | Colophon retrieval data for the chatbot |
| `_data/` | Jekyll collection metadata and image sources |
| `scripts/` | Data preparation and validation |
| `netlify/functions/` | IIIF proxy, fingerprint reports, and colophon retrieval service |
| `reports/` | Manuscript access and transcription audit results |
| `references/` | Research literature retained outside the published site |

Local ALTO source files belong in `exports/alto/ms-<HeuristID>/`. `exports/`, generated annotation pages under `data/annos/`, Python environments, installed gems, local deployment settings, and Jekyll output are excluded from version control. They are distinct from the catalogue and browser indexes required by the website.

## Research interfaces

The [user guide](pages/USER_GUIDE.md) describes the public controls and interpretation limits. The site menu is configured in `_config.yml`; research routes can also be opened directly.

| Route | Purpose |
| --- | --- |
| `/explore-database/` | Browse & Search, Overview, Manuscript Structure, Scribes, Multilingualism, Colophons, and Textual Genres |
| `/viewer/` | Manuscript images and available transcription annotations |
| `/search-transcriptions/` | Search across indexed manuscript transcriptions |
| `/scribal-fingerprints/` | Attributed handwriting samples and profile links |
| `/text-analysis/` | Comparisons of selected transcription samples |
| `/chatbot/` | Questions about indexed colophon passages, with source references |
| `/userguide/` | Research-interface instructions |

### Catalogue and search

The catalogue separates Manuscripts, Production Units, Scribal Units, Holding Institutions, Monastic Institutions, Historical People, Texts, and relationship records. A Production Unit describes a coherent part of manuscript production; a Scribal Unit identifies a scribal contribution. The same manuscript can contain several units.

`pages/explore-database.md` loads the page markup from `_includes/explore/explore-database-markup.html`. `assets/js/explore/app.js` loads and indexes records, manages browsing and navigation, and supplies shared functions to `assets/js/explore/modules/`.

Advanced Search follows explicit paths through catalogue fields and named relationships. `assets/js/explore/components/relationship-paths.js` indexes links in both directions and evaluates each chosen step. There is no fixed path-length limit. Conditions within a step apply to the same record; all branches from a step must match. All/Any controls combine field conditions within that step. Relationship records can be followed to constrain attribution, language, or other recorded details.

For example, a manuscript search can follow its Production Units, then `Contains` to a Text, and `author of` to a Historical Person with Gender equal to Female. A condition on the Production Unit remains attached to the same unit that contains that text. Advanced Search uses the complete loaded catalogue, including authors outside the default scribe browse list.

Fields and available values are read from the exports. Missing endpoints cannot form a traversable link. Search results describe recorded catalogue evidence, rather than proving that unrecorded features are absent.

### Manuscript Structure

Structure Explorer displays manuscript, production-unit, and scribal-unit connections. The remaining topics use a shared century selection and focused sub-tabs:

| Topic | Views |
| --- | --- |
| Materials | Materials over time, Material distribution, Materials by country, Text subgenres, Colophons |
| Quire Construction | Quires over time, Quire types, Quires by country, Quires by material, Text subgenres |
| Page Size & Layout | Page size by material, Page size by country, Height & width, Margins by material, Writing area, Writing area by material |
| Production Practices | Ruling over time, Ruling methods, Catchwords over time, Signatures over time, Catchwords & signatures |

Each view includes a data table and CSV download. Tables already used as the main display remain visible. Structure Explorer exports all filtered connections, including manuscripts beyond the initial display limit. The height-and-width scatterplot uses one row per manuscript; most comparisons use Production Units.

`codicology.js` contains the topic organisation and individual chart/table renderers. `codicology-research.js` provides shared period selection, categorical comparisons, numerical summaries, and exports.

Counting and measurement rules:

- Unknown and TBC categories are excluded from known-value summaries. Source records remain available in Browse & Search.
- A Production Unit contributes once per comparison cell. Several plausible centuries, places, or categories can place it in several cells.
- Text-subgenre percentages use distinct Production Units with a recorded subgenre within each material. A unit can have several subgenres; percentages across subgenres need not sum to 100%.
- Catchword, signature, and colophon rates use explicit TRUE/FALSE observations. Missing observations do not count as absence.
- Page size is height plus width. Numerical comparisons require positive measurements and an unambiguous manuscript link. Manuscript measurements can recur across several Production Units.
- Blank-page fraction estimates the share outside the recorded writing area. Text height and width must fit within the page. The writing-area distribution retains ratios between 10% and 90% of page area.
- Box plots show quartiles and the median, with minimum-to-maximum whiskers. Numerical summaries accompany the plots.

### Navigation and graphics

Primary modes and topic tabs are represented in the page URL. The century selection and individual chart selection are held in the browser session; they are not encoded in shared links. The `tree&tab=research` route resolves to Materials.

Chart cards provide local PNG export. Map export preserves the visible viewport and places vector overlays at their measured positions. Network, tree, and other modules retain the export formats shown by their controls. Image quality depends on the chart dimensions and export scale; a PNG export does not imply a fixed print resolution.

### Transcriptions and IIIF

ALTO XML supplies page, line, word, and glyph information. `scripts/setup_manuscripts.py` reads the manuscript CSV and builds the IIIF registry. `scripts/pagexml_to_iiif.py` matches exported pages to IIIF canvases and creates annotation pages. The transcription scripts build the search corpus and split it into manuscript files.

```bash
PYTHON=python3 bundle exec rake data:refresh_transcriptions
```

The Python executable is selected by `PYTHON`; the Rakefile default is `/opt/anaconda3/bin/python`. Data-preparation dependencies are listed in `scripts/requirements.txt`:

```bash
python3 -m pip install -r scripts/requirements.txt
```

The converter continues across individual manuscript failures. Unavailable manifests, unmatched canvas labels, and image-service restrictions affect coverage. `scripts/audit_iiif_transcriptions.py` produces access and coverage reports in `reports/`; those reports are observations from an audit run rather than permanent statements about external services.

### Scribal fingerprints and text samples

```bash
PYTHON=python3 bundle exec rake data:refresh_fingerprints
python3 scripts/paleography_pipeline/export_fingerprint_crops.py
python3 scripts/analysis/build_scribe_text_index.py
```

`map_scribes_to_manuscripts_v2.py` maps catalogue evidence to manuscript segments. `generate_scribe_profiles_v4.py` builds profiles from eligible mappings. The numbered filenames are the entry points used by the build tasks.

Eligibility requires one Production Unit per manuscript and either one Scribal Unit or a precise, mappable folio range for each selected Scribal Unit. Generic unidentified hands are excluded from public profiles; named and bibliographically attributed identities remain eligible. Samples use ALTO glyph or word coordinates and the central text area. Multi-scribe segments without reliable page boundaries are excluded from attributed comparisons.

`build_scribe_text_index.py` connects eligible scribal segments to transcription pages. Browser text analysis uses that index and the manuscript search files. It provides word/character frequency comparisons, principal component plots, clustering, repeated-clustering summaries, and rolling comparisons. Results can reflect textual content, language, transcription conventions, and recognition errors as well as scribal differences. The page performs its calculations without a Python analysis server. Further details are in [scripts/analysis/README.md](scripts/analysis/README.md).

The combined preparation task is:

```bash
PYTHON=python3 bundle exec rake data:refresh_all
```

Crop export and the scribal text index remain separate commands, as shown above.

### Colophon question service

The chatbot uses a generated index of colophon passages. `scripts/rag_pipeline/extract_colophons.py` prepares the passages; `generate_embeddings.py` prepares numerical representations for retrieval. `netlify/functions/rag.js` selects relevant passages and calls Gemini to produce a referenced response. The corpus must be regenerated when its catalogue sources change.

This service retrieves selected passages, not exhaustive database results. Catalogue counts belong in Browse & Search or a data export. Automated responses require checking against the cited records.

The function requires `GEMINI_API_KEY`, held in the server environment. `.env.example` documents configuration names. Credentials must not be committed. The static page calls the same-origin function on Netlify and the configured Netlify endpoint from the GitHub Pages deployment.

## Validation and deployment

[Validation instructions](scripts/validation/README.md) describe the catalogue and browser-calculation checks. GitHub Actions builds Jekyll, checks JavaScript syntax, and runs the Explore regression checks.

`netlify.toml` defines the build command, `_site` output directory, and serverless-function directory. GitHub Pages uses the configured `/unknownhands` base path. The public build excludes scripts, research references, audit reports, source exports, and local environments.

A deployment review includes the build and regression checks, followed by browser checks of catalogue search, topic navigation, century selection, chart/table agreement, CSV/PNG downloads, manuscript images, and narrow-screen layouts. Availability of external IIIF services is independent of the static build.

## Licence

Project terms are recorded in [LICENSE.txt](LICENSE.txt). Manuscript images and catalogue references remain subject to the terms of their source institutions.
