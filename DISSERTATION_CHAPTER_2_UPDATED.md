# Chapter 2. Building the Unknown Hands Digital Ecosystem

## 2.1 Introduction: Infrastructure as Scholarly Method

The Unknown Hands project was conceived not only as a corpus of female scribes' manuscripts but also as a digital architecture capable of representing, querying, and visualizing their work across space, language, and medium. The infrastructure that supports this corpus—from data modeling in Heurist to public dissemination via a IIIF-integrated website—forms the core of a new methodological approach to female scribal production in pre-modern Europe.

The starting point of Unknown Hands was the absence of a unified framework to study women's contributions to manuscript culture. While individual convents and collections have been catalogued, the field lacked a relational infrastructure that could model the relationships among scribes, texts, languages, and manuscripts at scale. My objective was twofold: to create the first normalized dataset of pre-1600 female scribes in Christian Europe, and to build a digital environment that allows both scholars and the public to interact with that data meaningfully.

The ecosystem thus serves as both a research instrument and a publication medium: it enables my own analytical work (on multilingualism, collaboration, and unseen scribal diversity) and provides a durable platform for future researchers to explore, reuse, and expand the data. From the start, this required an infrastructure able to represent both the material complexity of medieval manuscripts and the social complexity of women's authorship, labor, and collaboration.

Existing databases and catalogues (such as Manuscripta Medievalia, e-codices, or BVMM) offered isolated metadata but not the conceptual relationships I needed: how scribes, convents, and manuscripts intersect across languages, texts, centuries, and regions. Nor did they allow the integration of new transcriptional evidence emerging from handwritten text recognition (HTR) platforms like eScriptorium or Transkribus. Consequently, I developed Unknown Hands as an integrated ecosystem combining three types of data:

1. **Structured scholarly metadata**, modeled relationally in Heurist
2. **Digital surrogates of manuscripts**, accessed through IIIF manifests
3. **Textual transcriptions**, encoded as Web Annotations aligned to IIIF canvases

The resulting system is both a database and an interface—a research environment that allows scholars to move fluidly between quantitative analysis, close reading, and codicological description. This chapter details the conception, architecture, and implementation of this ecosystem, emphasizing its openness, standardization, and usability.

---

## 2.2 From Heurist to Data Model: Relational Foundations

At the foundation of the ecosystem is the **Heurist database**, a relational research environment developed by the University of Sydney for humanities data modeling, which encodes the scholarly model of the project described in the previous chapter. Within Heurist, I designed a relational schema centered on the concept of the **Scribal Unit**—a discrete instance of copying activity by a woman or group of women—linked to Production Units (codicological entities), Historical Persons, Texts, Monastic Institutions, and Holding Institutions. Each entity includes normalized temporal, geographic, and linguistic data, ensuring future interoperability with external vocabularies (e.g., VIAF, GeoNames, ISO language codes).

### 2.2.1 Why Heurist?

Heurist acts as the semantic backbone of the project. It is where every observation, from palaeographic identification to codicological structure, is structured according to repeatable fields and relationships. Periodic exports of this data in JSON formats feed the web ecosystem, where they are transformed into public-facing components.

Heurist provides a no-code interface for creating complex ontologies, meaning one can design new entities ("record types"), define relationships between them ("pointer fields"), and control vocabularies ("terms"). This flexibility makes it ideal for projects like Unknown Hands, where existing cataloging standards (such as MARC, TEI, or Dublin Core) cannot easily express the nuances of scribal production, collaboration, and uncertainty.

### 2.2.2 The Unknown Hands Data Model

My schema revolves around the following **seven record types**:

| Record Type | Description | Key Fields |
|-------------|-------------|------------|
| **Scribal Unit** (su) | A discrete instance of copying activity, whether individual or collaborative | Scribe name, certainty level, language(s), script type, manuscript folios, dating |
| **Manuscript** (ms) | A physical codex | Call number, holding institution, IIIF manifest URL, material composition |
| **Production Unit** (pu) | A codicological section within a manuscript | Quire structure, foliation range, linked Scribal Units, production date/place |
| **Holding Institution** (hi) | Repository holding manuscripts | Library name, city, country, coordinates |
| **Monastic Institution** (mi) | Convent or monastery where scribes worked | Name, location, order, date range of activity |
| **Historical Person** (hp) | Individual scribe, patron, or author | Name, dates, gender, role(s), biographical notes |
| **Text** (tx) | Work copied in manuscripts | Title, author, language, genre, textual tradition |

Relationships between these entities form a **graph structure**: a Scribal Unit "produced" a Production Unit that is "contained in" a Manuscript that "belongs to" an Institution. Each relationship can be qualified—for instance, the certainty of attribution or the nature of collaboration (shared task, alternating hands, supervision, etc.).

This model allows queries that would be impossible in a flat catalogue: for example, "List all manuscripts copied by nuns using Swabian dialects between 1450 and 1500." Such queries rely on Heurist's relational engine and controlled vocabularies. More importantly, they operationalize research questions about gendered networks of literacy into formal data structures.

### 2.2.3 Data Export and Transformation

Heurist can export data as CSV or JSON, preserving record IDs and relationships. These exports are used downstream in the **Explore the Database** interface, allowing the web version of the database to mirror the internal Heurist schema. Whenever the Heurist data evolve—as new manuscripts or scribes are added—an export can regenerate the corresponding web data files (`/data/records.json` and related tables).

This export-based workflow ensures that the authoritative data remain in Heurist (where scholarly work happens) while the website serves as a read-only, publicly accessible view of that data.

---

## 2.3 Data Transformation: Python as an Intermediary Layer

Between Heurist and the website lies a suite of **Python scripts** that translate scholarly records into interoperable web formats. This intermediary layer connecting the database to the public interface ensures that all data conform to open standards and remain independent of any specific platform.

### 2.3.1 Input Sources

The pipeline processes two principal input sources:

1. **Heurist Exports (metadata)**: CSV/JSON files containing manuscripts, scribes, and associated data
2. **eScriptorium Exports (transcriptions)**: PAGE-XML files (one per page) exported from HTR processing

**PAGE-XML** (Page Analysis and Ground-truth Elements) is a standard developed by the PRImA Research Lab for representing page layout, regions, lines, and textual content. It is machine-readable and captures coordinates (x, y, w, h) for each text region—essential for linking text and image.

### 2.3.2 The Transformation Scripts

Three Python modules handle transformation and integration:

#### `setup_manuscripts.py`
Reads the master list of manuscripts (in CSV) and performs initialization:
- Creates a standardized directory tree under `/data/annos/<slug>/`
- Generates a YAML registry (`data/manifests.yml`) linking each slug to its IIIF manifest
- Ensures consistency in file naming and manifest references

**Example `manifests.yml` entry:**
```yaml
- slug: ms-65
  title: Cologne, Erzbischöfliche Diözesan- und Dombibliothek, Ms. 65
  call_number: '65'
  date: '15th century'
  manifest: https://digital.dombibliothek-koeln.de/hs/i3f/v20/276608/manifest
  annos: /data/annos/ms-65/mapping.json
```

#### `pagexml_to_iiif.py`
Converts each PAGE-XML file into an **IIIF Web Annotation Page** (`p1.ap.json`, `p2.ap.json`, etc.). Each annotation corresponds to a transcription line and includes:

```json
{
  "target": {
    "source": "<canvas_id>",
    "selector": {
      "type": "FragmentSelector",
      "value": "xywh=x,y,w,h"
    }
  },
  "body": {
    "type": "TextualBody",
    "value": "Transcribed text line",
    "language": "deu"
  }
}
```

The script:
- Orders annotations by reading order (top-to-bottom, left-to-right)
- Outputs one annotation page per IIIF canvas
- Generates a `mapping.json` file linking each canvas to its annotation page

**Current corpus size**: 14 manuscripts with transcriptions, totaling 200,122 transcribed lines across 2,653 pages.

#### `build_transcription_corpus.py`
Aggregates text from all annotation pages into a global search index (`assets/search/transcriptions.json`) used for full-text and fuzzy search. Each entry contains:
- Manuscript slug and title
- Folio/canvas identifier
- Transcription text (original and normalized)
- IIIF canvas reference for linking back to viewer

**Output**: ~31MB JSON file containing all searchable text with metadata.

### 2.3.3 Data Flow Diagram

```
┌────────────────────────┐
│        HEURIST         │
│  Relational metadata   │
│  (Scribal Units, etc.) │
└──────────┬─────────────┘
           │  CSV / JSON export
           ▼
┌────────────────────────┐
│     PYTHON PIPELINE    │
│ setup_manuscripts.py   │
│ pagexml_to_iiif.py     │
│ build_search_corpus.py │
└──────────┬─────────────┘
           │  IIIF / JSON / YAML
           ▼
┌────────────────────────┐
│       DATA LAYER       │
│ /data/annos/<slug>/    │
│ /data/manifests.yml    │
│ /assets/search/        │
└──────────┬─────────────┘
           │  Static files
           ▼
┌────────────────────────┐
│    JEKYLL WEBSITE      │
│  explore-database/     │
│  viewer/               │
│  search-transcriptions/│
└────────────────────────┘
```

*Figure 2.1: Data Flow in the Unknown Hands Ecosystem. This diagram summarizes the full workflow from metadata creation to public visualization. Heurist serves as the relational database defining entities. Data exported from Heurist and eScriptorium are processed by Python scripts that normalize formats (CSV, PAGE-XML) and output interoperable IIIF annotation data. These are consumed by the static Jekyll site to power the three main interfaces.*

---

## 2.4 The Website as Scholarly Interface

The public website, hosted on GitHub Pages and built with Jekyll and JavaScript, serves as the visual and interactive layer of Unknown Hands. It is both a dissemination platform and an analytical environment. It includes **three primary modules** that together embody different facets of the project's epistemology: browsing, viewing, and searching.

| Interface | URL | Data Source | Mode of Engagement |
|-----------|-----|-------------|-------------------|
| **Explore the Database** | `/explore-database/` | Heurist metadata (JSON) | Relational exploration—"Who, where, when?" |
| **Viewer** | `/viewer/` | IIIF manifests + Web Annotations | Material encounter—"How does this text look and flow?" |
| **Search Transcriptions** | `/search-transcriptions/` | Aggregated search corpus | Textual discovery—"What words/phrases recur across scribes?" |

The site thus acts as an **analytical interface** rather than a mere display: it enables both close reading and large-scale exploration, mirroring the dual methodologies of digital palaeography.

---

## 2.5 Explore the Database: Multi-Modal Data Visualization

The **Explore the Database** interface (`/explore-database/`) is the primary entry point for users to browse, filter, search, and visualize the structured dataset exported from Heurist. It offers **eight integrated modules**, each providing a different analytical lens on the corpus:

### 2.5.1 Architecture and Interface Design

The page is a Jekyll template that loads exported data (typically `/data/records.json`) and renders it client-side using vanilla JavaScript. A **main navigation bar** at the top allows users to switch between eight modes:

1. 🔍 **Browse & Search**
2. 📊 **Analytics**
3. 🗺️ **Map**
4. 📖 **Codicology**
5. 🌳 **Hierarchical Tree**
6. 🔗 **Network**
7. 🌍 **Multilingualism**
8. 📜 **Colophon Analysis**

All filtering and searching occur **client-side**, meaning the site remains fully static yet interactive. Data are loaded as JSON objects, filtered through JavaScript, and re-rendered instantly—no server or database query is required. This approach ensures:
- **Fast interaction**: No network delays for filtering
- **Offline capability**: Works without internet after initial load
- **Cost-effectiveness**: No server infrastructure needed
- **Transparency**: All data accessible via browser developer tools

### 2.5.2 Module 1: Browse & Search

**Purpose**: Primary interface for exploring records with faceted filtering and search

**Layout**:
- **Left panel**: Facets and filters
- **Center panel**: Search results displayed as cards
- **Right panel**: Detailed view of selected record

**Key Features**:

#### Entity Type Switching
Users can toggle between the seven record types (Scribal Units, Manuscripts, Production Units, Holding Institutions, Monastic Institutions, Historical People, Texts). The facet panel and result cards dynamically update based on the selected entity.

#### Dynamic Faceted Filtering
The facet panel generates filters based on the active entity:
- **Scribal Units**: Filter by language, script type, century, certainty level, production place
- **Manuscripts**: Filter by holding institution, date, material, dimensions
- **Production Units**: Filter by quire structure, foliation, dating method
- **Institutions**: Filter by country, city, order/type
- **Texts**: Filter by language, genre, author, textual tradition

Filters update in real-time as users select or deselect options. Active filters are displayed as removable "chips" with a "Clear all filters" button for reset.

#### Full-Text Search
A search bar allows queries across all fields or specific fields (title, date, manuscript, holding institution, place, comments). Search implements:
- Case-insensitive matching
- Partial word matching
- Multi-field search with field selector dropdown

#### Sorting Options
Results can be sorted by:
- Default (relevance/ID order)
- Title A→Z / Z→A
- Date ascending/descending

#### Result Cards
Each card displays:
- **Title** and subtitle (based on entity type)
- **Key metadata** (dates, locations, languages)
- **Thumbnail** or icon
- **Related entities** count (e.g., "3 manuscripts, 12 scribal units")
- Click to expand full details in right panel

#### Detail Panel
Clicking a card opens a comprehensive view showing:
- All metadata fields
- **Relationships** to other entities with clickable links
- Links to external resources (Heurist record, IIIF manifest, catalog entry)
- For manuscripts: "Open in Viewer" button

#### Export Functionality
Users can export filtered results as CSV, choosing which fields to include. This enables:
- Custom dataset creation for external analysis
- Citation and data reuse
- Integration with statistical tools (R, Python, Excel)

**Scholarly Value**: This module externalizes the database model—it makes the ontology of Unknown Hands visible and explorable. It functions both as a public catalog and a visualization of the analytical categories.

### 2.5.3 Module 2: Analytics Dashboard

**Purpose**: Statistical overview and quantitative analysis of the corpus

**Visualizations**:

#### Century Distribution Chart
- **Histogram** showing number of records by century
- **Interactive bars**: Click to filter records by time period
- Shows temporal concentration of female scribal activity
- Reveals gaps in documentation (e.g., early medieval underrepresentation)

#### Geographic Distribution
- **Bar chart** of manuscripts/scribes by country
- **Interactive**: Click country to filter
- Reveals geographic clusters (Germany, Netherlands, France dominate)
- Highlights understudied regions

#### Language Diversity
- **Pie chart** of manuscripts by primary language
- Categories: Latin, Middle High German, Middle Dutch, Old French, Middle English, Italian, Spanish, etc.
- Highlights multilingual corpus
- Shows proportion of vernacular vs. Latin production

#### Script Type Analysis
- **Distribution** of script types (Gothic, Textualis, Cursiva, Bastarda, Humanistic, etc.)
- Shows evolution of female scribal hands
- Reveals regional preferences

#### Entity Relationship Overview
- **Network statistics**: Total entities, connections, average degree
- **Relationship counts**: How many scribes per manuscript, how many manuscripts per institution
- Quantifies collaborative patterns

**Use Cases**:
- Identify research gaps (underrepresented regions/periods)
- Generate quantitative arguments about scribal diversity
- Support statistical claims in publications
- Guide future data collection priorities

### 2.5.4 Module 3: Map Visualization

**Purpose**: Geographic exploration of manuscripts, scribes, and institutions

**Map Views** (selectable dropdown):
1. **Current Locations**: Where manuscripts are held today
2. **Production Locations**: Where manuscripts were created
3. **Institutional Networks**: Connections between convents and libraries

**Features**:

#### Interactive Leaflet Map
- **Clustering**: Groups nearby points for readability
- **Tooltips**: Hover for quick info
- **Popups**: Click for detailed information and links
- **Zoom/pan**: Explore regions in detail

#### Temporal Filtering
- **Timeline slider** at top of map
- Filter by century or custom date range
- Watch geographic distribution shift over time
- Reveals migration patterns of manuscripts

#### Layer Controls
- Toggle between different map views
- Show/hide entity types (manuscripts, institutions, production sites)
- Customize visualization density

#### Coordinate Data
- Institutions have precise GPS coordinates (from GeoNames)
- Production places use city-level coordinates
- Current locations use library coordinates

**Scholarly Applications**:
- Visualize **diaspora** of manuscripts from convents to modern libraries
- Map **regional scribal networks**
- Identify **geographic clusters** of female literary production
- Study **post-Reformation dispersal** patterns
- Support spatial humanities arguments

### 2.5.5 Module 4: Codicology Analysis

**Purpose**: Examine material characteristics and codicological patterns

**Sub-Tabs**:

#### Material Composition
- **Charts** showing parchment vs. paper usage over time
- Ink types and colors
- Binding styles
- Correlation with dating and region

#### Quire Structure
- **Visualization** of quire patterns (e.g., "regular quaternions," "mixed quinternions and sexternions")
- Analysis of irregularities
- Correlation with production units
- Evidence of collaborative work

#### Manuscript Dimensions
- **Scatter plots** of height x width
- Distribution by region and period
- Format analysis (folio, quarto, octavo)
- Relationship to text types (liturgical vs. devotional vs. educational)

#### Condition Reports
- Aggregated data on preservation state
- Missing folios and lacunae
- Evidence of later interventions
- Conservation priorities

**Research Value**: Supports codicological arguments about female scribal practices, workshop organization, and material resources available to convents.

### 2.5.6 Module 5: Hierarchical Tree View

**Purpose**: Visualize hierarchical relationships between entities

**Tree Structures**:

#### Manuscript → Production Unit → Scribal Unit
Shows the **codicological decomposition** of manuscripts:
```
Manuscript: Cologne, Ms. 65
├── Production Unit 1: Folios 1r-48v (ca. 1450)
│   ├── Scribal Unit A: Folios 1r-24v (German, Textualis)
│   └── Scribal Unit B: Folios 25r-48v (Latin, Bastarda)
└── Production Unit 2: Folios 49r-120v (ca. 1460)
    └── Scribal Unit C: Folios 49r-120v (German, Cursiva)
```

#### Institution → Manuscripts → Scribes
Shows **institutional collections**:
```
Holding Institution: Herzog August Bibliothek, Wolfenbüttel
├── Manuscript 1: Cod. Guelf. 204 Helmst.
│   └── Scribal Units: 3 identified hands
├── Manuscript 2: Cod. Guelf. 502 Helmst.
│   └── Scribal Units: 1 identified hand
```

#### Monastic Institution → Historical Persons → Scribal Units
Shows **convent communities**:
```
Monastic Institution: St. Katherine's Convent, Nuremberg
├── Person: Dorothea Schurstabin
│   └── Scribal Units: 4 manuscripts copied
├── Person: Ursula Heiligin
│   └── Scribal Units: 2 manuscripts copied
```

**Features**:
- **Expandable/collapsible** nodes
- Color-coded by entity type
- Click any node to view details
- Filter tree by date, location, language

**Scholarly Use**: Clarifies complex multi-unit manuscripts, reveals collaborative patterns within convents, traces individual scribes across multiple projects.

### 2.5.7 Module 6: Network Visualization

**Purpose**: Explore relationships as an interactive force-directed graph

**Implementation**: Uses **D3.js** force simulation for dynamic network layout

**Network Types**:

#### Scribe-Manuscript Network
- **Nodes**: Scribes (blue circles) and Manuscripts (red squares)
- **Edges**: "copied" relationships
- **Size**: Node size = number of connections
- **Use**: Identify prolific scribes, collaborative projects

#### Institution-Manuscript Network
- **Nodes**: Institutions and Manuscripts
- **Edges**: "holds" (current) or "produced" (origin)
- **Reveals**: Migration patterns from convents to libraries

#### Text-Manuscript Network
- **Nodes**: Texts and Manuscripts
- **Edges**: "contains" relationships
- **Reveals**: Textual circulation, popular works among female scribes

**Interactive Features**:
- **Drag nodes** to rearrange layout
- **Zoom/pan** to explore large networks
- **Hover** for node information
- **Click node** to highlight connected nodes
- **Filter** by entity type, date range, language
- **Path finding**: Click two nodes to show shortest path
- **Community detection**: Color-codes clusters

**Scholarly Applications**:
- Identify **scribal networks** and collaborative patterns
- Visualize **textual traditions** and manuscript families
- Discover **hidden connections** between convents
- Support **social network analysis** of female literacy

### 2.5.8 Module 7: Multilingualism Analysis

**Purpose**: Examine language diversity within manuscripts and scribes

**Visualizations**:

#### Language Co-occurrence Matrix
- **Heatmap** showing which languages appear together in manuscripts
- Rows/columns: Languages (Latin, German, Dutch, French, etc.)
- Cell color intensity: Frequency of co-occurrence
- Reveals common **code-switching** patterns

#### Multilingual Manuscripts
- **List view** of manuscripts with 2+ languages
- Percentage of corpus that is multilingual
- Common language combinations (e.g., Latin + Middle High German in devotional texts)

#### Scribal Language Competencies
- **Scribes** who worked in multiple languages
- Evidence of **bilingualism** or **trilingualism**
- Correlation with institutional affiliation and education

#### Language by Region and Period
- **Geographic distribution** of languages
- **Temporal evolution** (e.g., rise of vernacular in 15th century)
- Regional linguistic preferences

**Research Contributions**: Quantifies multilingual competence among female scribes, challenges assumptions about linguistic limitations, provides evidence for educational practices in convents.

### 2.5.9 Module 8: Colophon Analysis

**Purpose**: Systematic study of scribal colophons and self-identification

**Features**:

#### Colophon Text Collection
- **Searchable database** of extracted colophon texts
- Original text and English translation
- Linked to manuscript and scribe records

#### Linguistic Patterns
- **Formulaic phrases** (e.g., "scripsit," "explicit," "ora pro scriptore")
- **Self-identification** patterns ("I, Sister X, wrote this book")
- **Dating formulas**
- **Devotional language**

#### Sentiment and Tone Analysis
- **Humility topoi** ("worthless hand")
- **Assertions of authority**
- **Requests for prayers**
- Gender-specific language patterns

#### Metadata Extraction
- Automatically extracted **dates** from colophons
- **Names** and **places** mentioned
- **Patron dedications**

**Scholarly Value**: Provides textual evidence of female scribal identity, labor, and self-representation. Enables computational text analysis of scribal voice.

---

## 2.6 The Viewer: Image-Text Synchronization via IIIF

**Purpose**: Display digitized manuscript images alongside corresponding transcriptions, maintaining alignment between text and image

**URL**: `/viewer/`

### 2.6.1 Technical Implementation

The viewer uses **Mirador 3**, an open-source IIIF viewer built on React. The page loads dynamically based on URL parameters:

```
/viewer/?manifest=<MANIFEST_URL>&annos=/data/annos/<slug>/mapping.json
```

### 2.6.2 Layout and Interface

The viewer employs a **two-panel responsive layout**:

**Left Panel: Mirador IIIF Viewer**
- **Zoomable, pannable** high-resolution images
- **Page navigation**: Thumbnails, page selector, keyboard shortcuts
- **Image manipulation**: Brightness, contrast, rotation
- **Full-screen mode**
- Supports IIIF Image API for deep zoom

**Right Panel: Transcription Pane**
- Displays text lines corresponding to **current canvas**
- Automatically updates when user changes pages
- Shows line-by-line transcriptions
- Optional **bounding box highlights** on image
- Copyable text for reuse

**Toolbar Features**:
- ☐ **Toggle bounding boxes**: Show/hide text region overlays on image
- 📄 **Navigate pages**: Previous/next canvas
- 📋 **Copy all text**: Copy full page transcription to clipboard
- 🔗 **Share link**: Generate permanent link to current page

### 2.6.3 Synchronization Mechanism

The transcription pane updates automatically through the following process:

1. Mirador fires event when canvas changes
2. Event listener extracts current canvas ID
3. Script looks up canvas in `mapping.json`:
   ```json
   {
     "https://example.org/iiif/ms-65/canvas/p001": "/data/annos/ms-65/p1.ap.json"
   }
   ```
4. Fetches corresponding annotation page (`p1.ap.json`)
5. Parses Web Annotations:
   ```json
   {
     "target": {
       "source": "canvas_id",
       "selector": {"value": "xywh=100,200,800,50"}
     },
     "body": {"value": "Transcribed text line"}
   }
   ```
6. Renders text lines in order with optional coordinates

**Status Messages**:
- "Loading transcription..." (during fetch)
- "12 lines found" (success)
- "No transcription available" (if annotation page missing)

### 2.6.4 Manuscript Search and Selection

A **manuscript search bar** above the viewer allows users to:
- Type manuscript title, shelf mark, or city
- Filter from dropdown list of available manuscripts
- Select manuscript to load its IIIF manifest and annotations
- Preserves URL state for bookmarking

**Current Corpus**: 14 fully transcribed manuscripts with synchronized IIIF-annotation pairs:
- Cologne MSS 63, 65, 67, 69
- Munich Clm 22016, 22044
- Wolfenbüttel Cod. Guelf. 204 Helmst.
- Leiden B.P.L. 46 A
- Bruges MS 321
- Arras Bibliothèque de la Ville 742
- Paris Arsenal MS 1189
- Boulogne-sur-Mer MS 74 (82)
- San Marino Huntington mssHM 26068
- Others in progress

### 2.6.5 Responsive Design

**Desktop** (>980px):
- Side-by-side panels with **resizable splitter**
- Drag splitter to adjust proportions
- Maintains aspect ratio for both panes

**Mobile/Tablet** (<980px):
- **Stacked layout**: Image above, transcription below
- Touch-friendly controls
- Scrollable transcription pane

### 2.6.6 UX Refinements

- **Clean header/footer**: Preserves site navigation while maximizing viewing space
- **Loading feedback**: Clear status indicators at each step
- **Keyboard accessibility**: Tab navigation, Enter to activate
- **Screen reader support**: Mirador includes ARIA labels
- **Error handling**: Graceful fallbacks if manifest or annotations unavailable

### 2.6.7 IIIF Annotation Workflow

```
eScriptorium export (PAGE-XML)
        │
        ▼
  pagexml_to_iiif.py
        │
        ▼
  p1.ap.json, p2.ap.json, ... (Web Annotations)
        │
        ▼
   mapping.json ─→ linked to IIIF manifest
        │
        ▼
   Viewer interface loads and synchronizes
```

*Figure 2.2: IIIF Annotation Workflow. Each PAGE-XML file exported from eScriptorium describes a manuscript page's layout, including line coordinates (x, y, w, h) and transcribed text. The script `pagexml_to_iiif.py` converts each PAGE-XML into a IIIF-compliant Web Annotation Page that links each line's bounding box to the corresponding IIIF canvas. A generated `mapping.json` connects all annotation pages to the manifest, enabling the viewer to synchronize image and text.*

### 2.6.8 Conceptual Value

This viewer concretizes the **relationship between materiality and scribal activity**. It allows users to engage directly with a scribe's hand, script, and text simultaneously—a digital re-enactment of the reading and copying process itself. By placing image and transcription side by side, it:

- **Reclaims female copying** as legible and central
- Enables **paleographic analysis** by comparing letter forms
- Supports **diplomatic transcription verification**
- Makes **scribal labor visible** through spatial alignment
- Facilitates **teaching** medieval manuscript studies

---

## 2.7 Search Transcriptions: Corpus-Level Discovery

**Purpose**: Enable full-text and fuzzy search across all transcribed manuscripts

**URL**: `/search-transcriptions/`

### 2.7.1 Technical Architecture

The page loads a global search index (`assets/search/transcriptions.json`) containing all transcription lines with metadata. Currently **200,122 lines** across 14 manuscripts.

**Search Implementation**:
- Client-side search using **Lunr.js** (fuzzy search library)
- Supports exact phrase matching, approximate matches, case-insensitive filtering
- **Edit distance threshold** (0, 1, or 2 character differences)

### 2.7.2 Search Interface

**Search Controls**:
- **Query input**: Text field for search terms
- **Manuscript filter**: Dropdown to search within specific manuscript
- **Fuzzy level**: Slider (0 = exact, 1-2 = allow typos/variants)
- **Sort options**: Relevance, date, manuscript title
- **Group by manuscript**: Toggle to organize results
- **Show context**: Display surrounding lines

**Advanced Features**:

#### Saved Searches
- Save frequently used queries with name and filters
- Stored in browser localStorage
- Quick reload of previous searches
- Maximum 20 saved searches

#### Result Comparison
- Select multiple results with checkboxes
- "Compare Selected" button opens modal
- Side-by-side view of selected transcription lines
- Useful for identifying **textual variants** or **formulaic language**

#### Export Results
- Copy results to clipboard as TSV (tab-separated values)
- Paste directly into Excel/Google Sheets
- Download as `.tsv` file
- Includes manuscript, page number, and text

### 2.7.3 Search Results Display

Each result card shows:
- **Manuscript title** (cleaned, without "(intégral)" suffix)
- **Page number** (extracted from annotation ID)
- **Transcribed text** with **highlighted search terms**
- **Open in Viewer** button linking to exact canvas
- Optional **context** (2 lines before/after)

**Grouping by Manuscript**:
When enabled, results are organized under collapsible manuscript headers showing:
- Manuscript title
- Total hits in that manuscript
- Expandable list of individual results

### 2.7.4 Integration with Viewer

The critical feature is **seamless integration**: each "Open in Viewer" link constructs a URL:

```
/viewer/?manifest=<MANIFEST_URL>&annos=<ANNOS_PATH>&canvas=<CANVAS_ID>
```

This:
1. Opens the viewer
2. Loads the correct manuscript
3. Navigates to the exact page containing the search result
4. Highlights the transcription line

**Implementation**: The search page loads `manifests.yml` on page load to get correct manifest URLs and annotation paths for each manuscript, ensuring links work for manuscripts hosted on different IIIF servers (IRHT, Cologne Digital Library, etc.).

### 2.7.5 Performance Optimization

**Challenge**: The original 31MB corpus file caused 10-30 second load times.

**Solution Implemented**: Lazy loading system:
1. **Metadata-first**: Load 3KB index file listing manuscripts
2. **On-demand loading**: When user filters by manuscript, load only that manuscript's data (~5MB)
3. **Progressive loading**: For "all manuscripts" searches, load files incrementally with progress indicator

**Performance Gains**:
- Initial page load: **3KB** (instant) instead of 31MB
- Filtered search: **~5MB** download (90% reduction!)
- Time to first search: 2-3 seconds instead of 10-30 seconds

**Future Enhancement**: Migration to Elasticsearch backend for sub-second searches (see ELASTICSEARCH_IMPLEMENTATION_PLAN.md).

### 2.7.6 Transcription Corpus Statistics

| Manuscript | Pages | Lines | Script Languages |
|------------|-------|-------|-----------------|
| Cologne MS 65 | 538 | 24,889 | Latin, German |
| Leiden B.P.L. 46 A | 204 | 27,423 | Latin, French |
| Wolfenbüttel Cod. Guelf. 204 Helmst. | 391 | 29,880 | Latin, German |
| Munich Clm 22016 | 376 | 24,986 | Latin, German |
| Munich Clm 22044 | 548 | 17,302 | Latin, German |
| Arras Bibliothèque 742 | (varies) | 18,748 | Latin, French |
| Cologne MS 67 | 424 | 15,318 | Latin, German |
| Bruges MS 321 | 376 | 11,638 | Latin, Dutch |
| Cologne MS 69 | 424 | 14,096 | Latin, German |
| Cologne MS 63 | 538 | 4,959 | Latin |
| *Others* | 145 | 10,883 | Various |
| **TOTAL** | **2,653** | **200,122** | 7+ languages |

### 2.7.7 HTR Models Used

Transcriptions were generated using **eScriptorium** with the following models:

**For Latin, French, Italian, Spanish**:
- CATMUS Medieval 1.6.0

**For German manuscripts**:
- TRIDIS v2: HTR model for Medieval & Early Modern Documentary Manuscripts

**For specialized cases**:
- McCATMuS: Multilingual model (French, Latin, Spanish, English, German, Italian, Occitan)
- Generic CREMMA Model: Latin and Old French, 8th-15th century
- Burchard's Dekret models: 11th-century graphematic and expanded transcriptions

All models trained on Kraken, producing line-level transcriptions with confidence scores.

### 2.7.8 Search Pipeline Diagram

```
[Annotation Pages (.ap.json)]
        │
        ▼
 build_transcription_corpus.py
        │
        ▼
 assets/search/transcriptions.json
 (200,122 lines, ~31MB)
        │
        ▼
 search-transcriptions/ page
   → Lunr.js indexing
   → Query results
   → "Open in Viewer" link
        │
        ▼
   /viewer/?manifest=...&canvas=...
```

*Figure 2.3: Search and Discovery Pipeline. All transcription lines from the annotation pages are aggregated into a global JSON index using `build_transcription_corpus.py`. This index powers the full-text and fuzzy search interface. Each search result displays the snippet of text, manuscript reference, folio number, and a direct "Open in Viewer" link leading to the corresponding IIIF canvas.*

### 2.7.9 Scholarly Contribution

This component transforms the corpus into a **linguistic dataset**. It supports research into:
- **Scribal vocabulary** and orthographic variation
- **Dialectal features** across regions
- **Textual reuse** and formulaic language
- **Code-switching** patterns in multilingual manuscripts
- **Computational philology** and distant reading

The search interface extends the project's reach beyond manuscript studies into **medieval linguistics, textual criticism, and digital philology**.

---

## 2.8 Interoperability and Standards

A key principle guiding the design of Unknown Hands is **interoperability**—the ability for data and tools to communicate across platforms, repositories, and institutions. This ensures that the system can evolve alongside new technologies and remain compatible with broader initiatives in digital manuscript studies.

### 2.8.1 Why Interoperability Matters

In the fragmented landscape of digitization projects, interoperability is both a technical and scholarly challenge. Each library hosts its own IIIF repository, each project defines slightly different metadata schemas, and transcription systems (e.g., Transkribus, eScriptorium, T-PEN) export in incompatible formats.

Without interoperability, **data reuse is effectively impossible**. Unknown Hands responds to this problem by embracing open standards designed precisely to allow cross-institutional linking and layering of data. This means that Unknown Hands transcription layers can be displayed directly over any institutional IIIF viewer, or vice versa.

### 2.8.2 Implemented Standards

| Layer | Standard | Description | Reference |
|-------|----------|-------------|-----------|
| Manuscript images | **IIIF Presentation API v2/v3** | JSON format for describing digitized manuscripts, their canvases, and metadata | https://iiif.io |
| Transcription alignment | **W3C Web Annotation Data Model** | Encodes line-level text linked to coordinates (xywh) on a IIIF canvas | https://www.w3.org/TR/annotation-model |
| Transcription source | **PAGE-XML** (PRImA) | Input format exported from eScriptorium and HTR tools | https://www.primaresearch.org |
| Metadata transport | **JSON, YAML, CSV** | Lightweight serialization for Heurist exports and website ingestion | — |
| Database modeling | **Heurist** | Customizable relational schema for humanities data | https://heuristnetwork.org |
| Geographic data | **GeoNames API** | Standardized place names and coordinates | https://www.geonames.org |
| Authority control | **VIAF** | Virtual International Authority File for person/institution disambiguation | https://viaf.org |

### 2.8.3 Data Conversion and Validation

To maintain integrity across standards, each Python script performs lightweight **schema validation**:

- When converting PAGE-XML to Web Annotations, line coordinates are checked for validity (positive integers, within image bounds)
- Annotation pages are verified against IIIF manifest canvases
- JSON files are normalized (UTF-8, no trailing commas) to ensure compatibility with static hosting

This means the Unknown Hands corpus is not only **human-readable** but also **machine-actionable**: it can be parsed, indexed, and re-used in other projects, from stylometric pipelines to IIIF aggregators like Biblissima or Gallica Studio.

### 2.8.4 Cross-Platform Compatibility

The adherence to these standards guarantees **long-term accessibility**. For example:

- A Unknown Hands annotation file (`p1.ap.json`) can be opened in **any IIIF viewer** (Universal Viewer, Mirador, Annona) without modification
- Manuscript manifests can be loaded in **institutional viewers** (e.g., Gallica, Cologne Digital Library)
- Transcription data can be imported into **TEI XML editors** or **computational text analysis tools**
- Metadata can be harvested by **library discovery systems** and **digital humanities repositories**

---

## 2.9 Sustainability, Openness, and Data Stewardship

Digital projects are often fragile: dependencies break, repositories vanish, and data formats decay. For Unknown Hands, **sustainability** has been integral from the beginning.

### 2.9.1 Static, Reproducible, and Transparent

The entire website and data layer are **static**, meaning they consist of files (HTML, JSON, YAML) that can be hosted anywhere—GitHub Pages, institutional servers, or even local machines. This minimizes the "maintenance burden" common in database-driven projects.

Every transformation is **documented and reproducible**:
- Heurist exports are versioned and timestamped
- Python scripts are open source and documented in GitHub
- Generated data are stored under `/data/`, ensuring transparency
- Git version control preserves past states

In essence, the project's "backend" is a **reproducible pipeline** rather than a hidden server.

### 2.9.2 Data Provenance and Versioning

Each data artifact contains metadata about its origin:
- JSON files store a `"source"` field referencing the original IIIF manifest
- Annotation files include `"creator"` and `"created"` timestamps
- The project's **Git history** functions as a version-control system
- **Zenodo DOIs** can be minted for major dataset releases

This approach aligns with the **FAIR principles** (Findable, Accessible, Interoperable, Reusable), ensuring that Unknown Hands is not only open access but **open infrastructure**.

### 2.9.3 Long-Term Stewardship

Because the project uses only **open formats**, migration is trivial:
- JSON can be ingested by any database or visualization tool
- IIIF manifests are institutionally hosted and maintained
- Heurist provides XML/JSON exports for archiving
- Static HTML can be preserved in web archives (Wayback Machine, Perma.cc)

**Institutional Commitment**:
- Data deposited at Yale University institutional repository
- Mirrored at Data for History consortium
- Registered with IIIF Commons
- Archived via Software Heritage

**Expected Lifespan**: 10+ years with minimal maintenance, indefinite with format migration.

---

## 2.10 Interpretation and Method: Infrastructure as Argument

The Unknown Hands ecosystem is not merely a support system for the dissertation—it **embodies its central argument**. Each design decision translates conceptual questions about gendered authorship, collective labor, and material culture into a digital form.

### 2.10.1 Feminist Digital Humanities and Infrastructural Visibility

One of the recurring critiques in digital humanities—articulated by scholars like Lauren Klein (2015) and Catherine D'Ignazio & Lauren F. Klein in *Data Feminism* (2020)—is that **infrastructure itself is often invisible**, and that this invisibility perpetuates historical exclusions.

By constructing a **transparent, traceable data ecosystem**, Unknown Hands applies feminist principles to infrastructure: it foregrounds process, collaboration, and attribution. The system's architecture mirrors the very labor it studies: dispersed, often anonymous, but structurally essential.

In this sense, the technical model becomes a **historiographical metaphor**—making visible what was hidden in both archives and systems.

### 2.10.2 The Database as Hermeneutic Form

Databases are not neutral containers but **interpretive frameworks** (Berman 2018). The Heurist schema encodes interpretive decisions:
- What constitutes a **Scribal Unit**?
- How to classify **uncertainty** in attribution?
- How to represent **multilingualism** or **collaboration**?

Each pointer field or controlled vocabulary reflects a theoretical stance on the ontology of scribal activity.

Similarly, the IIIF viewer embodies a **theory of reading**: by placing image and transcription side by side, it re-enacts the materiality of manuscript study and reclaims the act of female copying as legible and central.

### 2.10.3 Quantitative and Qualitative Synergy

Because Unknown Hands integrates both structured and unstructured data, it enables a **continuum between close and distant reading**:

- **Macro level**: Analyze aggregate patterns (Chao1 estimates of unseen scribes, TF-IDF features by region, multilingualism rates)
- **Micro level**: Zoom into a single folio to examine a scribe's ductus or orthography

This dual capability reflects a methodological conviction: **quantitative analysis should not abstract away from the manuscript but return to it**. By designing a system where metadata, images, and texts coexist, the project bridges statistical inference and paleographical interpretation.

### 2.10.4 The Ecosystem as Scholarly Method

Finally, this ecosystem demonstrates that **building a digital architecture can itself be a form of scholarship**. It materializes a research method—**modeling as interpretation** (McCarty 2005)—where the act of encoding relationships is a way of thinking about them.

In practice, this means:
- The **Heurist database** expresses the interpretive framework
- The **Python pipeline** expresses methodological rigor and reproducibility
- The **IIIF viewer** expresses hermeneutic concern for materiality
- The **Search interface** expresses philological curiosity and corpus-building
- The **Explore interface** expresses relational thinking about social networks

Together, they constitute a **digital argument** about how to study women's textual production in a distributed, transnational, multilingual context.

---

## 2.11 Unknown Hands as Scholarly API

The Unknown Hands ecosystem operates not only as a digital corpus and research platform, but as a **scholarly API**—an open, standards-based infrastructure designed for reuse, interoperability, and methodological transparency.

### 2.11.1 Architecture as API

At a technical level, the project serves structured data through **static, machine-readable files** (JSON, YAML, CSV) conforming to widely recognized standards. These files, exposed at predictable URLs within the project's `/data/` directory, function much like **REST endpoints**: they can be fetched, parsed, and integrated directly into external research workflows without mediation by a server.

**Example API-like endpoints**:
```
GET /data/records.json          # All manuscript/scribe metadata
GET /data/manifests.yml         # IIIF manifest registry
GET /data/annos/ms-65/p1.ap.json # Line-level transcriptions
GET /assets/search/transcriptions.json # Full search corpus
```

### 2.11.2 Use Cases for External Integration

Scholars, students, or institutions can programmatically:
- **Query manuscript metadata** for quantitative studies
- **Download transcription mappings** for linguistic analysis
- **Import annotation data** into their own IIIF-compatible environments
- **Federate** with other repositories (Biblissima, Gallica Studio, e-Codices)
- **Build custom visualizations** using the network data
- **Train NLP models** on the transcription corpus

### 2.11.3 Political and Practical Gesture

The decision to build the project as a **static, transparent API** is both a practical and a political gesture:

**Practical Benefits**:
- No server costs or maintenance
- Works offline after initial load
- Can be mirrored and preserved easily
- No proprietary dependencies

**Political Statement**:
- Resists **opacity** of proprietary systems
- Resists **fragility** of database-dependent platforms
- Enacts **feminist principle of infrastructural care**
- Data are not merely published, but **shared in ways that encourage reinterpretation, collaboration, and accountability**

### 2.11.4 Towards a Digital Commons

By turning a dissertation into a **sustainable API**, Unknown Hands extends the reach of scholarly work beyond traditional publication. It becomes a **living platform** for discovery and contribution—a digital commons through which future researchers can continue to study, visualize, and annotate the work of women scribes across centuries.

In this sense, Unknown Hands models what an **equitable digital humanities infrastructure** can be—one that does not only represent underrecognized historical subjects but is itself shaped by the ethics of inclusion, transparency, and reuse.

---

## 2.12 Conclusion: From Database to Method

The Unknown Hands ecosystem is thus both a **product and a method**. It embodies a form of digital hermeneutics in which technical design decisions—from the choice of relational fields to the mapping of IIIF annotations—encode scholarly arguments about visibility, attribution, and collaboration.

By building a system that can represent the **collective authorship** of women scribes, I am also redefining how authorship itself can be modeled in digital humanities. This technical architecture, far from being ancillary, forms an integral chapter of the dissertation's argument: that studying women's manuscript production requires infrastructures capable of **modeling complexity, embracing uncertainty, and making hidden labor visible**.

The Unknown Hands digital ecosystem transforms a set of individual case studies into a **unified, extensible research infrastructure**. By combining:
- Heurist's relational modeling
- IIIF's visual standardization
- eScriptorium's transcriptional automation
- The transparency of static web technologies

...it provides both a technical architecture and a hermeneutic model for future work on gender and textual production.

This architecture is not a mere tool but a **scholarly object in itself**. It enacts a feminist and historical argument through design: that the labor of female scribes, once dispersed and anonymous, can be reassembled through **infrastructures of care, precision, and openness**.

In making this work visible—both in the database and in its underlying code—Unknown Hands redefines what it means to do **digital palaeography in the twenty-first century**.
