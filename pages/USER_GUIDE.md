---
layout: page
permalink: /userguide/
show_title: false
---


# Unknown Hands — User Guide

**Welcome to Unknown Hands!** This guide will help you explore and analyze our database of pre-modern female scribal production. Whether you're a researcher, student, or simply curious about medieval manuscripts, this manual will show you how to get the most out of our interactive platform.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Browse & Search](#2-browse--search)
3. [Analytics Tools](#3-analytics-tools)
4. [Map Visualizations](#4-map-visualizations)
5. [Codicological Analysis](#5-codicological-analysis)
6. [Hierarchical Tree Explorer](#6-hierarchical-tree-explorer)
7. [Network Explorer](#7-network-explorer)
8. [Multilingualism Analysis](#8-multilingualism-analysis)
9. [Colophon Analysis](#9-colophon-analysis)
10. [Explore Formulae](#10-explore-formulae)
11. [IIIF Viewer & Mirador](#11-iiif-viewer--mirador)
12. [Search Transcriptions](#12-search-transcriptions)
13. [Tips & Tricks](#13-tips--tricks)
14. [FAQ](#14-frequently-asked-questions)

---

## 1. Getting Started

### What is Unknown Hands?

Unknown Hands is a digital research platform documenting the work of female scribes who created manuscripts before 1600. Our database includes:

- **Manuscripts** — Codices written by or associated with women
- **Production Units** — Information about when and where manuscripts were made
- **Scribal Units** — Details about the scribes themselves
- **Institutions** — Libraries and archives holding these manuscripts
- **Texts, People, and more** — Comprehensive relational data

### Navigating the Site

**Main Navigation Bar** (top of page):
- **About** — Learn about the project
- **Explore Database** — Interactive data explorer (this guide's focus)
- **Viewer** — View manuscript images with transcriptions
- **Search Transcriptions** — Full-text search across all transcribed manuscripts
- **Team, Publications, Participate** — Project information

### Understanding Record Types

The database contains **7 types of records**:

1. **Scribal Units (SU)** — The core production unit: a scribe working on a specific manuscript section
2. **Manuscripts (MS)** — Physical codices (books)
3. **Production Units (PU)** — Manufacturing contexts (where/when/how manuscripts were made)
4. **Holding Institutions (HI)** — Current location (libraries, archives)
5. **Monastic Institutions (MI)** — Historical production locations (monasteries, convents)
6. **Historical People (HP)** — Scribes, patrons, owners
7. **Texts (TX)** — Literary works contained in manuscripts

---

## 2. Browse & Search

### Accessing Browse Mode

1. Click **"Explore Database"** in the main navigation
2. The default view is **Browse & Search**
3. You'll see three panels:
   - **Left:** Filters (facets)
   - **Center:** Record list
   - **Right:** Detail view (when you select a record)

### Switching Record Types

**Entity Switcher** (top left):
- Click buttons to switch between record types: SU, MS, PU, HI, MI, HP, TX
- Each type has different filters and fields

### Using Filters (Facets)

Filters appear on the left side and change based on record type.

**Filter Types:**

**Text Filters** — Type keywords:
- Example: SU Dating, Call number

**Dropdown Filters** — Select one option:
- Example: Material (Parchment, Paper, Mixed)

**Multi-Select Filters** — Choose multiple options:
- Example: Scripts, Genres

**Number Range Filters**:
- Set min/max values
- Example: Codex height (150-400 mm)

**Year Range Filters**:
- Set date ranges
- Example: Terminus post quem (1200-1500)

**How to Apply Filters:**
1. Select or enter filter values
2. Results update automatically
3. Active filters show at the top
4. Click **"Clear all filters"** to reset

### Searching Records

**Search Box** (top center):

**Full-Text Search:**
1. Type your query in the search box
2. Press Enter or wait for auto-search
3. Searches across all fields

**Field-Specific Search:**
1. Select a field from the dropdown next to search box
2. Options: Title, Date, Manuscript, Holding Institution, Place, Comments
3. Type query and search

**Search Tips:**
- Use partial words (e.g., "franc" finds "France", "Francia", "Francfort")
- Case-insensitive
- Combines with filters (search + filter = powerful queries)

### Sorting Results

**Sort Dropdown** (top center):
- Default — Database order
- Title A→Z / Z→A — Alphabetical
- Date ↑ / ↓ — Chronological

### Viewing Record Details

**Click any record** in the center panel:
- Details appear on the right
- Shows all metadata fields
- Links to related records (clickable)
- Images (if available)

**Related Records:**
- Click blue linked names to navigate
- Example: Click a manuscript name in a Scribal Unit to see the full MS record

### Exporting Data

**Export Button** (top right):
1. Apply filters/search to get desired records
2. Click **"Export CSV"**
3. Downloads spreadsheet with visible results
4. Opens in Excel, Google Sheets, etc.

**CSV Contents:**
- All fields for filtered records
- Use for your own analysis
- Import into statistical software

### Searching by Relationships

The database now includes **relationship data** that is fully searchable:

**What Are Relationships?**
- Connections between entities in the database
- Examples: scribes working at institutions, manuscripts produced at locations, texts contained in manuscripts

**How to Use:**
- Relationship data is automatically included in full-text searches
- When you search, results include records with matching relationship metadata
- Use the Network Explorer tab for visual exploration of relationships

### Pagination

**Bottom of record list:**
- **Previous / Next** buttons
- Page numbers
- Shows records per page (default: 20)

---

## 3. Analytics Tools

### Accessing Analytics Mode

1. In **Explore Database**, click **Analytics** tab (top navigation)
2. View loads showing the Statistical Dashboard

### Statistical Dashboard

**Purpose:**
- Quantitative overview of the entire corpus
- Record counts by entity type
- Date ranges and temporal distribution
- Key attributes and characteristics

**Features:**
- **Entity Filter:** Select specific entity types (Manuscripts, Scribal Units, etc.) or view all
- **Interactive Visualizations:** Statistical charts and graphs
- **Export:** Save dashboard as image (PNG) for presentations or publications

**Use Cases:**
- Understanding corpus composition
- Identifying temporal patterns
- Finding gaps in the data
- Dataset completeness analysis
- Identifying trends across entity types

---

## 4. Map Visualizations

### Accessing Map Mode

1. In **Explore Database**, click **Map** tab (top navigation)
2. Map loads showing manuscript locations

### Changing Map Views

**Map View Selector** (top of map):

**6 Different Views:**

1. **Manuscripts - Current Location (Holdings)**
   - Where manuscripts are held today
   - Shows holding institutions
   - Use to find MSS near you

2. **Manuscripts - Production Location**
   - Where manuscripts were created
   - Historical geography
   - See production centers

3. **Manuscripts - Movement (Production → Current)**
   - Visualizes manuscript movement from production location to current holding
   - Shows historical migration patterns
   - Arrows connect origin to current location
   - Helps understand manuscript circulation and collection history

4. **Production Units - All Locations**
   - All PU geographic data
   - Country, city, monastery

5. **Production Units - By Monastery**
   - Groups PUs by monastic institution
   - See which monasteries were productive

6. **Monastic Institutions**
   - All monasteries and convents
   - Historical religious centers

### Using the Map

**Markers:**
- **Circles with numbers** — Clusters (multiple records in same location)
- **Individual icons** — Single records
- **Colors** — Different entity types

**Interactions:**
- **Zoom:** Mouse wheel or +/- buttons
- **Pan:** Click and drag
- **Click cluster:** Zooms in to show individual markers
- **Click marker:** Opens popup with record details
- **Popup:** Click record name to view full details

**Map Controls:**
- **Zoom In/Out** — + and - buttons (top left)
- **Zoom to Fit** — Shows all markers
- **Layers** — Toggle different data overlays

### Exporting Maps

**Export as Image:**
1. Click **"Export PNG"** button (top right of map)
2. High-resolution PNG image downloads
3. Use in presentations, publications, or reports

---

## 5. Codicological Analysis

### Accessing Codicology Mode

1. In **Explore Database**, click **Codicology** tab (top navigation)
2. View loads showing codicological analysis tools

### What is Codicological Analysis?

Explore relationships between manuscript physical features through interactive visualizations. Analyze correlations, distributions, and patterns across the corpus by selecting any two variables.

### Quick Start Presets

**Try These Combinations:**
- **Material vs Size** — See how parchment and paper manuscripts differ in dimensions
- **Date vs Folios** — Explore temporal changes in manuscript length
- **Quire Type vs Material** — Analyze structural variations by material

Click preset buttons to quickly load interesting analyses, or select variables manually.

### Selecting Variables

**Three-Step Process:**

1. **X-Axis Variable** — Choose from:
   - **Dimensions:** Height, Width, Justification measurements, Margin ratio
   - **Structure:** Folios, Columns, Lines per page, Quires
   - **Temporal:** Date, Century
   - **Categorical:** Material, Quire type, Ruling type, Script type, Binding type

2. **Y-Axis Variable** — Same options as X-axis

3. **Color/Group By** (optional) — Add a third dimension:
   - **People & Gender:** Gender, Scribe name
   - **Production Context:** Material, Origin country/region, Monastery type
   - **Physical Features:** Quire type, Catchwords, Signatures, Watermark, Ruling type, Columns
   - **Content:** Has colophon, Language, Script type, Decoration
   - **Collaboration:** Collaboration type, Multiple scribes
### Filtering Data

**Active Filters Panel:**
- **Century:** Select one or more centuries (hold Cmd/Ctrl for multiple)
- **Material:** Filter by Parchment, Paper, or both
- **Region:** Select specific geographic regions

**Filter Status:** Shows how many manuscripts match your criteria

**Clear Filters:** Click Clear Filters button to reset

### Visualization Types

Choose from multiple visualization methods:

1. **Scatter Plot** — Best for continuous variables (height vs width, date vs folios)
   - See correlations and outliers
   - Color points by grouping variable

2. **Box Plot** — Compare distributions across categories
   - Shows median, quartiles, and outliers
   - Good for comparing groups

3. **Bar Chart** — Count occurrences of categorical variables
   - Compare frequencies
   - See which combinations are most common

4. **Correlation Analysis** — Statistical relationships
   - Quantify strength of relationships
   - Identify significant patterns

5. **Statistical Summary** — Descriptive statistics
   - Mean, median, standard deviation
   - Range and quartile values

### Comparison Feature

**Build Multi-Panel Comparisons:**

1. Configure your first analysis (variables, filters, viz type)
2. Click **"Add to Comparison"**
3. Configure additional analyses
4. Click **"View Comparisons"** to see all side-by-side
5. Export combined view as image

**Use Cases:**
- Compare same variables across different centuries
- Test multiple hypotheses simultaneously
- Create comprehensive publication figures

### Exporting

**Export as Image:**
- Click **"Export as Image"** button
- High-resolution PNG downloads
- Include in papers, presentations, or reports

---

## 6. Hierarchical Tree Explorer

### Accessing Hierarchical Tree Mode

1. In **Explore Database**, click **Hierarchical Tree** tab (top navigation)
2. Interactive tree visualization loads

### What is the Hierarchical Tree?

Explore the complete structural hierarchy of manuscripts, showing relationships between:
- **Manuscripts** (top level)
- **Production Units** (sections of manuscripts)
- **Scribal Units** (individual scribes' work)
- **Texts** (content within units)

This visualization reveals the complex internal structure of medieval manuscripts and how scribes collaborated.

### Searching Manuscripts

**Search Bar:**
1. Type manuscript title, shelfmark, or ID
2. Results highlight matching manuscripts in the tree
3. Click **"Clear"** to reset search

### Filtering by Structure

**Filter by Structure Panel:**

Check boxes to show only manuscripts with specific characteristics:

- **3+ Production Units** — Complex composite manuscripts
- **Interleaved Units** — Non-sequential PU arrangements
- **PUs Across Multiple MSS** — Production units spanning multiple manuscripts
- **SUs Across Multiple PUs** — Scribes working across production units

**Use Cases:**
- Find manuscripts with complex codicological history
- Identify collaboration patterns
- Study manuscript assembly practices

### Sorting Options

**Sort by:**
- **Alphabetical** (default) — Manuscript titles A-Z
- **Production Units (Most)** — Manuscripts with most PUs first
- **Scribal Units (Most)** — Manuscripts with most SUs first
- **Structural Complexity (Highest)** — Most intricate hierarchies first

### Reading the Tree

**Tree Structure:**
- **Top level:** Manuscript names
- **Second level:** Production Units (sections)
- **Third level:** Scribal Units (scribes)
- **Fourth level:** Texts (content)

**Interactions:**
- **Click nodes** to expand/collapse
- **Hover** for quick details
- **Navigate** through nested structures

### Exporting

**Export as Image:**
- Click **"Export as Image"** button
- Exports current tree view as PNG
- Useful for presenting manuscript structure

---

## 7. Network Explorer

### Accessing Network Mode

1. Click **Network** tab
2. Network graph loads (may take a moment for large datasets)

### Understanding the Network

**What You See:**
- **Nodes (circles)** — Individual records
- **Lines (edges)** — Relationships between records
- **Colors** — Entity types
- **Node size** — Can represent number of connections

**Relationship Types:**
- "Produced by" — PU → MI (monastery)
- "Contains" — MS → SU
- "Is part of" — SU → PU
- "Held by" — MS → HI
- And more...

### Interacting with the Network

**Navigation:**
- **Zoom:** Mouse wheel
- **Pan:** Click and drag background
- **Move nodes:** Click and drag individual nodes
- **Reset view:** Zoom to fit button

**Exploring Connections:**
1. **Click a node** — Highlights that record and its immediate connections
2. **Details panel** — Shows record information
3. **Relationship labels** — Hover over lines to see relationship type

**Filtering:**
- Use **left panel filters** to show only certain entity types
- Network updates to show filtered relationships
- Example: Show only MSS and holding institutions

### Use Cases

**Finding Related Records:**
- Start with one manuscript
- See which scribal units it contains
- Trace to production units
- Find other MSS from same monastery

**Identifying Hubs:**
- Large nodes = highly connected records
- Important manuscripts, productive monasteries
- Key figures in network

**Pattern Discovery:**
- Clusters = closely related groups
- Isolated nodes = unique records
- Dense areas = production centers

### Searching by Relationships

The Network mode includes a **Relationships** filter that allows you to explore connections between entities. Relationship data is indexed and searchable, making it easy to find records based on their connections to other entities.

### Exporting Network Visualizations

**Export Options:**
- **Export SVG** — Vector format, scalable without quality loss, ideal for publications
- **Export PNG** — Raster image format, good for presentations and web use

Click the appropriate export button to download your current network view.

---

## 8. Multilingualism Analysis

### Accessing Multilingualism Mode

1. In **Explore Database**, click **Multilingualism** tab (top navigation)
2. View loads showing the Multilingualism Explorer

### What is Multilingualism Analysis?

Explore language patterns and linguistic diversity across manuscripts, scribal units, and institutions. Examine how scribes worked with multiple languages and when they code-switched between languages in colophons versus texts.

### Five Analysis Tabs

#### 1. Overview Tab

**Purpose:** Get a quick snapshot of linguistic diversity

**Features:**
- **Total Language Count:** Number of unique languages in the database
- **Language Distribution:** Top languages with manuscript/SU counts
- **Key Statistics:** Overall linguistic diversity metrics
- **Visualization:** Bar chart showing language frequency

**Use this to:** Understand the overall linguistic composition of the collection

#### 2. Multilingual Manuscripts Tab

**Purpose:** Find and analyze manuscripts containing multiple languages

**Features:**
- View all multilingual manuscripts in the database
- See which languages appear in each manuscript
- **Filtering Options:**
  - Filter by specific language (dropdown)
  - Filter by century
  - Filter by region
  - Text search for manuscript names
- **Display:** Manuscript title, languages present, century, region
- **Sort:** By manuscript name or number of languages

**Use this to:**
- Find manuscripts in specific languages
- Identify the most linguistically diverse manuscripts
- Study language combinations (e.g., Latin + vernacular)

#### 3. Scribal Multilingualism Tab

**Purpose:** Examine language use at the scribal unit level

**Key Distinction:**
- **Colophon language** — Language of the scribe's note/signature
- **Text language** — Language of the main content copied

**Features:**
- Shows scribal units with their attributed languages
- Distinguish between colophon and text languages
- **Filters:** Language, century, region, text search
- Identify scribes who worked in multiple languages

**Use this to:**
- Find scribes who worked in multiple languages
- Identify cases where colophon language differs from text language
- Study individual scribal linguistic abilities

#### 4. Institutional Multilingualism Tab

**Purpose:** Analyze linguistic diversity by monastery/convent

**Features:**
- See which institutions had multilingual production
- Count of unique languages per institution
- **Display:** Institution name, location, languages used, SU count
- **Sort:** By name or language diversity score

**Use this to:**
- Find centers of multilingual manuscript production
- Compare linguistic diversity across religious institutions
- Identify regional patterns in institutional multilingualism

#### 5. Colophon-Text Divergence Tab

**Purpose:** Specialized analysis of language code-switching

**What It Shows:**
- Cases where **colophon language ≠ text language**
- Scribes who wrote notes in one language but copied texts in another
- Examples: Latin text with vernacular colophon, or vice versa

**Features:**
- List of all divergent cases
- Context: Century, region, institution
- Percentage of colophons showing divergence
- Regional and temporal patterns

**Use this to:**
- Study language choices and code-switching in medieval scribal practice
- Understand when scribes used vernacular vs. Latin
- Identify patterns in scribal language selection

### Example Research Questions

- Were manuscripts from Italy more multilingual than those from Germany?
- Did multilingualism increase in the 15th century?
- Which monasteries had the most linguistic diversity?
- How common was it for scribes to use different languages in colophons vs. texts?
- Which language combinations were most common?
- Were certain religious orders more linguistically diverse?

---

## 9. Colophon Analysis

### Accessing Colophon Analysis Mode

1. In **Explore Database**, click **Colophon Analysis** tab (top navigation)
2. View loads showing the Colophon Analysis interface

### What is a Colophon?

A colophon is a note written by the scribe, typically at the end of a manuscript section, providing information about:
- The copying process
- The scribe's name and identity
- The date of completion
- Requests for prayers
- Expressions of emotion (fatigue, pride, humility)
- Dedication to patrons

Colophons are invaluable for understanding medieval scribal culture and self-expression.

### Six Analysis Tabs

#### 1. Overview Tab

**Purpose:** Understand overall colophon prevalence patterns

**Statistics Provided:**
- **Total Colophons:** Number of colophons in the database
- **Colophon Rate:** Percentage of scribal units with colophons
- **Average Length:** Mean colophon length (words)

**Geographic & Temporal Distribution:**
- **By Century:** Colophon rates over time (shows when colophons were most common)
- **By Region:** Geographic patterns (where colophons were most prevalent)

**Key Insights:**
- Which periods had more colophons?
- Which regions had stronger colophon traditions?

**Use this to:** Get a quantitative overview of colophon presence across the corpus

#### 2. Sentiment Analysis Tab

**Purpose:** Detect emotional tone and attitudes in colophons

**Six Sentiment Categories:**
- **Humility** — unworthy, poor, sinner, humble, weak
- **Pride** — diligent, careful, completed, accomplished
- **Labor** — weary, tired, labor, difficult, hand, finger
- **Religious** — god, pray, prayer, blessing, mercy
- **Temporal** — finished, completed, ended, year, day
- **Dedication** — patron, gift, love, honor

**Features:**
- **Most Expressive Colophons:** Shows colophons with highest emotional content (expandable from 5 to 20)
- **Least Expressive Colophons:** Shows neutral/factual colophons (dates, names only)
- **Sentiment Distribution:** Visual breakdown of sentiment frequency
- **Matched Keywords Display:** See exactly which words triggered each sentiment
- **"View SU" Button:** Quick navigation to full scribal unit record

**Use this to:**
- Find emotionally expressive colophons
- Compare scribal attitudes and emotions
- Identify patterns in how scribes represented themselves
- Study regional or temporal variations in emotional expression

#### 3. Thematic Analysis Tab

**Purpose:** Identify major topics and themes in colophons

**Eight Major Themes:**
1. **Religious Devotion** — References to God, prayers, blessings
2. **Scribal Identity** — Name, role, self-description
3. **Labor & Completion** — Work process, finishing statements
4. **Temporal Markers** — Dates, times, feast days
5. **Institutional Context** — Monastery, scriptorium mentions
6. **Dedication & Patronage** — Patrons, recipients, gifts
7. **Personal Expression** — Emotions, thoughts, experiences
8. **Mistakes & Corrections** — Apologies, error acknowledgments

**Features:**
- **Theme Distribution Chart:** Visual overview of theme frequency
- **Example Colophons by Theme:** Shows 2-20 examples per theme (expandable)
- **"View SU" Buttons:** Navigate to full records
- **Original Text Preserved:** Up to 200 characters shown

**Use this to:**
- Find colophons about specific topics
- Study what scribes chose to document
- Compare thematic emphasis across time and geography
- Identify common colophon conventions

#### 4. Linguistic Features Tab

**Purpose:** Analyze colophon length, complexity, and style

**Analyses Provided:**

**Word Count Analysis:**
- Average words per colophon
- Longest and shortest colophons
- Distribution visualization

**Sentence Complexity:**
- Average sentence length
- Average word length
- Complexity metrics

**First-Person Usage:**
- Frequency of "I", "me", "my" pronouns
- Most personal colophons
- Percentage of colophons using first person

**Questions & Exclamations:**
- Colophons with rhetorical questions
- Colophons with exclamatory statements
- Emotional intensity markers

**Use this to:**
- Compare colophon length and complexity over time
- Study personal vs. impersonal expression styles
- Find particularly detailed or brief colophons
- Identify regional linguistic patterns

#### 5. Comparative Patterns Tab

**Purpose:** Compare colophon characteristics across regions and centuries

**By Region:**
- Colophon rates by geographic area (8 top regions)
- Sentiment distribution by region
- Average length by location
- Regional comparison charts

**By Century:**
- Temporal trends in colophon characteristics
- Average length over time
- Sentiment changes across centuries
- **Sentiment Percentages:** Shows what % of colophons in each century contain each sentiment type

**Trends Over Time Table:**
- Century-by-century breakdown
- Colophon count and rate (% of all SUs)
- Sentiment counts with percentages
- Format: "15 mentions (23.5%)" showing both absolute and relative frequency

**Use this to:**
- Identify regional scribal practices
- Track changes in colophon style over time
- Compare sentiment expression across contexts
- Find patterns in colophon conventions
- Answer questions like: "Did 15th-century colophons express more labor/fatigue than 13th-century ones?"

#### 6. Browse Colophons Tab

**Purpose:** Read, search, and filter colophons in detail

**Filterable Colophon Viewer:**
- Filter by language (Latin, vernacular, etc.)
- Filter by century
- Text search across all colophons
- Real-time filtering updates

**Display Features:**
- **Expandable Cards:** ▶/▼ toggle to expand/collapse
- **Original Transcription:** Shows colophon in original language
- **English Translation:** Shows translated text
- **Copy-to-Clipboard Buttons:** For both transcription and translation
- **"View SU" Button:** Navigate to full scribal unit record
- **Manuscript Context:** Shows manuscript information

**Results:**
- Shows 20 colophons initially
- Can expand to 50 with filters
- Responsive filtering

**Use this to:**
- Read colophons in detail
- Find specific colophon texts
- Copy colophon text for citation in your research
- Browse colophons by language or period
- Collect examples for analysis

### Example Research Questions

- Which regions had the most humble colophons?
- Did colophon length increase over time?
- Were 15th-century colophons more personal than 13th-century ones?
- What percentage of colophons express labor/fatigue?
- Which scribes wrote the longest colophons?
- How did religious sentiment vary by century and region?
- Are there gender differences in colophon expression?

### Export Features

- **Copy to Clipboard:** Any colophon text (transcription or translation)
- **Visualizations:** All charts can be exported as images
- **Filtered Results:** Export through main Browse mode for CSV

---

## 10. Explore Formulae

### Accessing Explore Formulae Mode

1. In **Explore Database**, click **Colophon Analysis** tab (top navigation)
2. Click the **Explore Formulae** sub-tab
3. View loads showing predefined formulaic patterns found across the corpus

### What are Colophon Formulae?

Colophon formulae are standardized phrases, expressions, and linguistic patterns that scribes commonly used in their colophons. These recurring formulas reveal:
- Traditional scribal practices and conventions
- Regional and linguistic patterns
- Cross-cultural influences and transmission of scribal culture
- Common themes in medieval self-expression

Formulae can be complete phrases ("Qui scripsit scribat semper cum Domino vivat") or shorter fragments ("anno domini", "finito libro").

### Overview Statistics

The interface displays three key metrics:
- **Predefined Formulas:** Total number of formulaic patterns being searched
- **Languages:** Number of languages represented in the formula collection
- **Colophons Searched:** Total colophons in the database searched for matches

### Filter Options

**Four-Step Filtering System:**

**1a. Select Language**
- Filter formulas by language (Latin, Dutch, German, Italian, French, Portuguese, Swedish, etc.)
- Shows count of formulas available per language
- Example: "Latin (20 formulas)" or "Dutch (3 formulas)"

**1b. OR Select Country**
- Alternative filter by geographic region
- Shows formulas found in manuscripts from specific countries
- Example: "Germany (15 formulas)" or "Netherlands (8 formulas)"

**2. Select Specific Formula (optional)**
- Once a language or country is selected, this dropdown populates with specific formulas
- Allows drilling down to individual formula patterns
- Shows the exact text of each formula

**3. Filter by Type**
- Classify formulas by thematic category:
  - **Prayer:** Requests for prayers ("bidt om gods wil", "oretis pro scriptore")
  - **Dating:** Temporal references ("anno domini", "int jaer ons heren")
  - **Scribe:** Scribe identification ("qui scripsit", "die schreiberin")
  - **Completion:** Finishing statements ("finitus et completus", "explicit")
  - **Humility:** Self-deprecating expressions ("peccatrice", "indegniamente")
  - **Ownership:** Possession statements ("dit boeck hoert", "libro è delle monache")
  - **Praise:** Religious praise ("laus et gloria Christo", "lob sye gott")
  - **Other:** Miscellaneous formulas

### Formula Display

**Each formula card shows:**
- **Formula Text:** The main formula in its original language
- **Language:** Language of the formula
- **Match Count:** Number of unique manuscripts containing this formula
- **Variants:** Accepted spelling variations and fragments (e.g., "int jaer", "int iaer", "intjaer")
- **Formula Type Badge:** Color-coded category (Prayer, Dating, Scribe, etc.)

### Viewing Matching Examples

**Expand Formula Cards:**
- Click "Show Examples" to view colophons containing the formula
- Displays up to 20 matching examples per page
- Each example shows:
  - **Manuscript title** and shelfmark
  - **Country** and **Century** of production
  - **Matched variant:** Which specific variant was found
  - **Full colophon transcription:** Original text (first 200 characters)
  - **English translation** (if available)
  - **View SU button:** Navigate to full scribal unit record

**Pagination:**
- Navigate through multiple pages of examples if more than 20 matches exist
- Page counter shows current page and total pages

### Global Formula Distribution Map

Expand the **Global Formula Distribution Map** to see:
- Geographic spread of all formulas in the corpus
- Interactive map showing locations where formulas appear
- Click markers to see which formulas are found in each region
- Visual representation of formula transmission and regional patterns

### Example Formulas by Language

**Latin Formulas:**
- "Qui scripsit scribat semper cum Domino vivat" (May the one who wrote always live with the Lord)
- "Finito libro sit laus et gloria Christo" (The book finished, let there be praise and glory to Christ)
- "Explicit expliceat ludere scriptrix eat" (The end is unfolded, let the female scribe go play)
- "Detur pro penna scriptori pulchra puella" (Let a beautiful girl be given to the scribe for his pen)

**Dutch Formulas:**
- "int jaer ons heren" (in the year of our Lord)
- "bidt om gods wil" (pray for God's sake)
- "dit boeck hoert" (this book belongs)

**German Formulas:**
- "pitt got für" (pray to God for)
- "das puch hat geschriben swester" (the book was written by sister)
- "do man zalt" / "als man zalt" (when one counts [dating formulas])
- "Lob sye Gott" (Praise be to God)

**Italian Formulas:**
- "libro è delle monache" (the book belongs to the nuns)
- "A llaude et onore" (To praise and honor)
- "peccatrice" (sinner [female])

**Other Languages:**
- **French:** "Pries Nostre Seigneur" (Pray to Our Lord)
- **Portuguese:** "Acabousse" (It was finished); "Screveo freira" (The nun wrote)
- **Swedish:** "bidhin kära systra" (pray dear sisters); "owärdoghe" (unworthy)

### Use Cases and Research Questions

**Formula Distribution:**
- Which formulas were most widespread across Europe?
- Are certain formulas region-specific or pan-European?
- How did formulas spread across linguistic boundaries?

**Temporal Patterns:**
- Did certain formulas become more or less common over time?
- When did particular formulas first appear in the corpus?
- Are there chronological patterns in formula usage?

**Linguistic Analysis:**
- Which languages have the most diverse formula traditions?
- How do formulas in Latin differ from vernacular languages?
- Are there translation patterns between Latin and vernacular formulas?

**Cultural Transmission:**
- Do formulas cluster geographically?
- Which institutions shared formula traditions?
- How did formulas travel between convents and scriptoria?

**Gender-Specific Formulas:**
- Are there formulas unique to female scribes?
- How do female scribes adapt traditionally masculine formulas?
- What does formula usage reveal about female scribal identity?

### Tips for Using Explore Formulae

1. **Start Broad:** Begin by viewing all formulas to understand the full scope
2. **Filter Strategically:** Use language or country filters to focus on specific traditions
3. **Compare Variants:** Notice how the same formula appears with different spellings
4. **Check Examples:** Always expand formula cards to see real examples in context
5. **Cross-Reference:** Use the "View SU" button to explore full records and related data
6. **Track Patterns:** Note which formulas appear in multiple countries or time periods
7. **Consider Zero Matches:** Formulas with zero matches indicate patterns not yet found in the corpus

### Formula Search Technology

**Fuzzy Matching:**
- The system uses flexible pattern matching to find formula variants
- Accounts for spelling variations, spacing differences, and abbreviations
- Case-insensitive matching ensures comprehensive coverage

**Variant Recognition:**
- Each formula includes predefined variants based on scholarly research
- Captures common abbreviations and alternative spellings
- Recognizes partial matches (formula fragments)

---

## 11. IIIF Viewer & Mirador

### What is the IIIF Viewer?

View high-resolution manuscript images with synchronized transcriptions. Uses **Mirador 3**, a powerful IIIF viewer.

### Accessing the Viewer

**Two ways:**

1. **Direct navigation:**
   - Click "Viewer" in main navigation
   - Select manuscript from dropdown

2. **From database:**
   - Browse manuscripts
   - Click manuscript record with images
   - Click "Open in Mirador (new tab)" button

### Viewer Interface

**Main Components:**

1. **Image Panel** (left/center)
   - High-resolution manuscript images
   - Deep zoom capability

2. **Transcription Panel** (right)
   - Line-by-line transcriptions
   - Synchronized with images

3. **Controls** (top)
   - Manuscript selector
   - Page navigation
   - Zoom controls
   - Layout options

### Viewing Images

**Navigation:**
- **Next/Previous page:** Arrow buttons or keyboard arrows
- **Zoom in/out:** + / - buttons or mouse wheel
- **Pan:** Click and drag
- **Fit to window:** Home button
- **Full screen:** Full screen button

**Image Quality:**
- Start at low resolution
- Zoom in for details
- Images load progressively (IIIF magic!)

### Reading Transcriptions

**Transcription Display:**
- Each line appears in order
- Line numbers shown
- Original spelling preserved

**Synchronization:**
- Click a line of transcription
- Corresponding area highlights on image
- Or vice versa: click image region to see transcription

**Features:**
- Toggle transcriptions on/off
- Adjust text size (browser zoom)
- Copy text for notes

### Advanced Features

**Comparing Pages:**
- Split screen view
- View two pages side by side
- Useful for comparing folios

**Annotation Layers:**
- Toggle visibility of transcription annotations
- See raw images without overlays

**Download:**
- Export individual images (right-click)
- Download manifest URL for use in other IIIF viewers

---

## 12. Search Transcriptions

### Accessing Transcription Search

Click **"Search Transcriptions"** in main navigation

### How It Works

**Full-Text Search:**
- Searches all transcribed manuscripts
- Finds words and phrases
- Fuzzy matching for variant spellings

### Performing a Search

1. **Type query** in search box
2. **Press Enter** or click search button
3. **Results appear below**

**Search Features:**
- **Case-insensitive** — "lord" finds "Lord", "LORD"
- **Partial matching** — "trans" finds "transcription", "translation"
- **Fuzzy search** — Tolerates spelling variations

### Understanding Results

**Each result shows:**
- **Manuscript name** — Which codex
- **Folio number** — Which page
- **Line number** — Specific line
- **Context snippet** — Text before and after match
- **Highlighted term** — Your search term in bold

**Result actions:**
- **Click result** — Opens viewer to that exact line
- **View more context** — Expand to see surrounding lines

### Advanced Search Tips

**Phrase Search:**
- Use quotes: `"divine office"`
- Finds exact phrase

**Multiple Terms:**
- Space between words: `prayer psalter`
- Finds either word (OR logic)

**Wildcards** (if supported):
- `*` for multiple characters: `tran*` finds "transcription", "translation"

### Comparing Transcriptions

**Side-by-Side Comparison Feature:**

The transcription search includes a comparison tool for analyzing multiple results together.

**How to Use:**

1. **Select Results:**
   - Each search result has a checkbox in the top-right corner
   - Check 2 or more results you want to compare
   - Selection count updates in real-time (e.g., "3 selected")

2. **Compare:**
   - Click **"Compare Selected"** button (enabled when 2+ selected)
   - Modal window opens showing all selected results side-by-side
   - Each result displays:
     - Manuscript title
     - Page number
     - Full transcription line
     - Context lines (if "Show context" was enabled before searching)

3. **Analyze:**
   - Scroll through the grid to examine differences
   - Results displayed in responsive columns
   - Easy comparison of spelling, abbreviations, and text variations

4. **Clear Selection:**
   - Click **"Clear Selection"** to uncheck all and start over
   - Click **"Close"** in modal to return to results

**Best Practices:**
- **Enable "Show context"** before searching to see surrounding lines in comparison
- **Group by manuscript** first, then select one result from each manuscript
- **Select 2-6 results** for optimal readability
- Compare same phrase across different manuscripts to study:
  - Spelling variations (e.g., "nostre dame" vs "notre dame")
  - Regional differences
  - Textual transmission
  - Paleographic patterns

**Example Workflow:**
```
1. Search: "dieu" with "Show context" enabled
2. Enable "Group by manuscript"
3. Select one result from 3-4 different manuscripts
4. Click "Compare Selected"
5. Analyze differences in context and spelling
6. Take notes or screenshots
7. Clear selection and search for another term
```

### Exporting Search Results

**Export Options:**
- Click **"Export"** button above results
- Downloads CSV with all matching lines
- Includes manuscript metadata and page numbers
- Use for text analysis, concordances, or further research

---

## 13. Tips & Tricks

### Power User Techniques

#### Combining Filters and Modes

**Example Workflow:**

1. **Start in Browse mode**
   - Filter to: Material = Parchment, Country = Germany
   - See which MSS match

2. **Switch to Map**
   - Filters persist
   - See geographic distribution of filtered MSS

3. **Switch to Timeline**
   - Still filtered
   - See temporal distribution

4. **Switch to Analytics**
   - Run Codicological Analysis
   - Results show only filtered MSS

**Result:** Deep dive into German parchment manuscripts across multiple views

#### Research Workflows

**Finding Manuscripts to Study:**
1. Filter by location (Holding Institution)
2. Filter by digitization status (IIIF available)
3. Export list for research trip planning

**Comparative Analysis:**
1. Filter to specific date range (e.g., 1400-1450)
2. Filter to specific region (e.g., Italy)
3. Run multiple analytics to characterize corpus
4. Export data for publication

**Following Relationships:**
1. Find a scribe (Historical Person)
2. Click to see their Scribal Units
3. From SU, see Production Units
4. From PU, see Manuscripts
5. From MS, see Holding Institution
6. Plan to view manuscripts in person

### Keyboard Shortcuts

**In Viewer:**
- **Arrow keys:** Next/previous page
- **+ / -:** Zoom in/out
- **Home:** Fit to window
- **F:** Full screen

**In Database:**
- **Ctrl+F (Cmd+F):** Browser search within page
- **Tab:** Navigate between filter fields
- **Enter:** Submit search

### Mobile Use

**Responsive Design:**
- Site works on tablets and phones
- Some features optimized for desktop
- Map and Timeline best on larger screens

**Mobile Tips:**
- Use portrait mode for Browse
- Use landscape for Viewer
- Pinch to zoom on maps

### Bookmarking Searches

**Save Your Work:**
1. Apply filters and search
2. Copy URL from address bar
3. Bookmark or save link
4. Return to exact same filtered view later

**Share Searches:**
- Send URLs to colleagues
- Include in publications
- Cite specific subsets of data

### Exporting Data and Visualizations

The platform provides multiple export options for data and visualizations suitable for research, presentations, and publications.

#### CSV Data Export

**Browse Mode:**
- Click **"Export CSV"** button (top-right)
- Downloads filtered results as spreadsheet
- Includes all metadata fields for selected entity type
- Opens in Excel, Google Sheets, or any CSV reader

**What's Included:**
- All visible columns
- All filtered records (not just current page)
- Clean, structured data ready for analysis
- Column headers for easy reference

**Use Cases:**
- Statistical analysis in R, Python, SPSS
- Create custom visualizations
- Build research datasets
- Cite specific subsets in publications

#### High-Resolution Image Export

**Publication-Quality Exports:**
All visualizations support high-resolution export at ~300 DPI minimum, suitable for academic publications and presentations.

**Available Formats:**
- **PNG** — High-resolution raster image (300 DPI)
- **SVG** — Scalable vector graphics (where applicable)

**Export by Tab:**

1. **Map Visualizations:**
   - Click **"Export PNG"** button
   - Captures entire map with all markers and layers
   - Filename: `unknownhands-map-{timestamp}.png`
   - **Resolution:** 3x scale (~300 DPI)

2. **Analytics Dashboard:**
   - Click **"Export as Image"** button
   - Captures current statistical visualization
   - Filename: `unknownhands-analytics-{timestamp}.png`
   - **Resolution:** 3x scale (~300 DPI)

3. **Codicology Analysis:**
   - Click **"Export as Image"** button
   - Exports scatter plots, box plots, bar charts, etc.
   - Filename: `unknownhands-codicology-{timestamp}.png`
   - **Resolution:** 3x scale (~300 DPI)
   - **Comparison mode:** Export entire comparison grid

4. **Hierarchical Tree:**
   - Click **"Export as Image"** button
   - Captures full tree structure
   - Filename: `unknownhands-tree-{timestamp}.png`
   - **Resolution:** 3x scale (~300 DPI)

5. **Network Visualization:**
   - **SVG export:** Click **"Export SVG"** (vector format, infinitely scalable)
   - **PNG export:** Click **"Export PNG"** (raster format, 300 DPI)
   - Filename: `unknownhands-network-{timestamp}.{svg|png}`
   - **Additional:** Data export dropdown for Gephi or R formats

**Tips for Best Quality:**
- **For journal articles:** Use PNG exports (widely accepted, high quality)
- **For editing in Illustrator/Inkscape:** Use SVG exports (fully editable vectors)
- **For presentations:** PNG exports work perfectly
- **For web use:** PNG exports are ready to use
- All exports have transparent or white backgrounds

#### Text Export

**Colophon Transcriptions:**
- In Colophon Analysis Browse tab
- Click copy-to-clipboard button
- Copies transcription or translation
- Paste directly into your research notes or documents

**Transcription Search Results:**
- Export search results as CSV
- Includes manuscript name, page, line number, and full text
- Export filtered datasets to focus on your research corpus

#### Multi-Format Export Strategy

**For Research Papers:**
1. Export filtered CSV data from Browse mode
2. Create custom visualizations in R/Python
3. Export high-res PNGs from platform for supplementary figures
4. Cite data subsets with bookmarked URLs

**For Presentations:**
1. Export PNG images from all visualization tabs
2. Use in PowerPoint/Keynote at full quality
3. No need to resize (already high resolution)

**For Posters:**
1. Export SVG from Network (edit in Illustrator if needed)
2. Export PNG from Maps, Trees, Codicology
3. All exports meet 300 DPI minimum for printing

**Technical Details:**
- **PNG Resolution:** 3x scale factor (~300 DPI at typical display sizes)
- **SVG:** True vector format (no resolution limit)
- **Browser Compatibility:** Works in Chrome, Firefox, Safari, Edge
- **File Sizes:** PNGs typically 500KB-5MB depending on visualization complexity
  - Map views (all 8 map types)
  - Timeline charts
  - Network graphs (SVG format)
  - All analytics visualizations
  - Hierarchical tree views (per-manuscript export)

**Copy Colophon Text:**
- In Colophon Analysis Browse tab
- Each colophon has "Copy" buttons
- Separate buttons for transcription and translation
- Click to copy to clipboard
- Paste into your documents for citation
- Button shows "Copied!" confirmation

**Statistical Dashboard Export:**
- Export statistical summaries from Analytics tabs
- Useful for recording analysis parameters
- Can be imported into other tools (Excel, R, etc.)

**Best Practices:**
- Export filtered datasets to focus on your research corpus
- Use high-DPI exports for publications
- Keep track of filter parameters used for reproducibility
- Cite Unknown Hands database in your work (see Credits page)

---

## 14. Frequently Asked Questions

### General Questions

**Q: Is the data complete?**
A: The database is continuously growing. We're adding manuscripts and transcriptions regularly. Current counts shown on homepage.

**Q: Can I download the entire database?**
A: Yes, in Browse mode, with no filters, click "Export CSV" to download all records of current entity type. Repeat for each type.

**Q: How do I cite the Unknown Hands database?**
A: See the "Credits" page for citation information.

**Q: Who created the data?**
A: Project team led by Estelle Guéville. Data sourced from Heurist database, incorporating research from multiple scholars. See "Team" page.

### Data Questions

**Q: What does "—" mean in a field?**
A: Data not available or not applicable for that record.

**Q: Why do some manuscripts not have images?**
A: Not all manuscripts have been digitized. We link to IIIF manifests when available. Check "Digitization Status" field.

**Q: What is a "Production Unit"?**
A: A PU represents the context of manuscript creation: where, when, by whom, with what materials. One MS can have multiple PUs if created in stages.

**Q: What is a "Scribal Unit"?**
A: An SU is the work of one scribe on a specific portion of a manuscript. Represents the core evidence of scribal activity.

**Q: How are dates formatted?**
A: Dates use terminus post quem (earliest possible) and terminus ante quem (latest possible). Many manuscripts can only be dated to a range (e.g., 1300-1350).

**Q: What does "normalized" mean?**
A: Normalized fields have standardized values for analysis. Example: "Normalized script" uses controlled vocabulary, while original descriptions may vary.

### Technical Questions

**Q: Which browsers are supported?**
A: Modern browsers: Chrome, Firefox, Safari, Edge. Latest versions recommended.

**Q: Why is the map/timeline loading slowly?**
A: Large datasets take time. Try filtering to a subset first. Clear browser cache if persistent.

**Q: Can I use the data in my research?**
A: Yes! Data is open access. Please cite appropriately. See license information on Credits page.

**Q: How do I report an error?**
A: Use GitHub issues (link in footer) or contact project team (see Contact page).

**Q: Is there an API?**
A: Currently, data is available via CSV export and JSON files. We're exploring API options for future releases.

### Feature Questions

**Q: Can I save my analyses?**
A: Currently, you can export results as CSV and visualizations as high-quality images. Saved analysis workspaces are planned for future release.

**Q: Can I upload my own manuscripts?**
A: Not directly through the website. Contact the team if you have data to contribute.

**Q: Will there be more analysis types?**
A: Yes! We're continuously developing new analytical tools based on user feedback.

**Q: Can I compare two manuscripts side-by-side?**
A: In the Viewer, use split-screen mode. In Analytics, filter to your manuscripts and compare statistics.

**Q: What is sentiment analysis in colophons?**
A: Our sentiment analysis uses keyword matching to detect emotional tones in colophon texts. It identifies 6 categories (humility, pride, labor, religious, temporal, dedication) and shows which keywords were matched for transparency.

**Q: How accurate is the colophon sentiment analysis?**
A: The analysis is keyword-based and designed for exploratory research. It identifies potential emotional content but should be verified by reading the full colophon text. All matched keywords are displayed for transparency.

**Q: What does 📝 and 📖 mean in the Multilingualism module?**
A: 📝 indicates colophon language (the language of the scribe's note), while 📖 indicates text language (the language of the main content being copied). This distinction helps identify code-switching.

**Q: How do I export a visualization for my publication?**
A: Click the "Export" button on any visualization. It will download as a high-quality PNG (300 DPI) suitable for publication. Available for maps, timelines, networks, and all analytics charts.

**Q: Can I see the raw colophon text?**
A: Yes! Use the Colophon Analysis module's "Browse Colophons" tab. Each colophon shows both the original transcription and English translation, with copy-to-clipboard buttons for citation.

**Q: Why do some colophons show as "Least Expressive"?**
A: These are colophons with minimal emotional language, typically containing only factual information (names, dates, places). They represent a more neutral scribal voice compared to emotionally expressive colophons.

---

## Need More Help?

### Resources

- **Technical Documentation:** See `README.md` in GitHub repository
- **Contact Form:** [Link to contact page]
- **Report Issues:** [Link to GitHub issues]
- **Email:** [Project email]

### Tutorials

- **Video Tutorials:** [Coming soon]
- **Workshops:** Check website for announcements
- **Publications:** See Publications page for case studies

---

## Acknowledgments

This platform is the result of collaboration between medievalists, digital humanists, librarians, and software developers. Thank you for exploring the Unknown Hands database!

**Happy researching!**

---

*Unknown Hands User Guide v2.0*  
*Last updated: December 2025*  
*Estelle Guéville, Yale University*
