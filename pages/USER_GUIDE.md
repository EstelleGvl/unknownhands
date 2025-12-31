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
10. [IIIF Viewer & Mirador](#10-iiif-viewer--mirador)
11. [Search Transcriptions](#11-search-transcriptions)
12. [Tips & Tricks](#12-tips--tricks)
13. [FAQ](#13-frequently-asked-questions)

---

## 1. Getting Started

### What is Unknown Hands?

Unknown Hands is a digital research platform documenting the work of female scribes who created manuscripts before 1600. Our database includes:
1. **Scribal Units (SU)** — The core unit of analysis in the database. A specific manuscript section written by a scribe.
2. **Manuscripts (MS)** — Physical codices (books) at least partially written by or associated with women.
3. **Production Units (PU)** — Manufacturing contexts of specific manuscript sections(where/when/how manuscripts were made)
4. **Holding Institutions (HI)** — Libraries and archives holding these manuscripts
5. **Monastic Institutions (MI)** — Historical production locations (monasteries, convents)
6. **Historical People (HP)** — Scribes, patrons, owners
7. **Texts (TX)** — Literary works contained in manuscripts

### Navigating the Site

**Main Navigation Bar** (top of page):
- **[About](/unknownhands/about/)** — Learn about the project
- **[Explore Database](/unknownhands/explore-database/)** — Interactive data explorer (this guide's focus)
- **[Viewer](/unknownhands/viewer/)** — View manuscript images with transcriptions
- **[Search Transcriptions](/unknownhands/search-transcriptions/)** — Full-text search across all transcribed manuscripts
- **[Team](/unknownhands/team/)**, **[Publications](/unknownhands/publications/)**, - **[Participate](/unknownhands/participate/)** — Project information

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
- Click buttons to switch between record types: Scribal Units, Manuscripts, Production Units, Holding Institutions, Monastic Institutions, Historical People, Texts
- Each type has different filters and fields

### Using Filters (Facets)

Filters appear on the left side and change based on record type.

**Filter Types:**
- **Text Filters** Type keywords. 
- **Dropdown Filters** Select one option.  
- **Multi-Select Filters** Choose multiple options. 
- **Number Range Filters**: Set min/max values. 
- **Year Range Filters**: Set date ranges. 

**How to Apply Filters:**
1. Select or enter filter values
2. Results update automatically
3. Click **"Clear all filters"** to reset

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
- Links to related records (clickable) and relationships (clickable)
- Links to images and IIIF manifests (if available) with a button to open in Mirador

**Related Records:**
- Click gold linked names to navigate
- Example: Click a manuscript name in a Scribal Unit to see the full Manuscript record

### Exporting Data

**Export Button** (top right):
1. Apply filters/search to get desired records
2. Click **"Export CSV"**
3. Choose the fields to include
4. Downloads spreadsheet with visible results
5. Opens in Excel, Google Sheets, etc. to use for your own analysis

### Searching by Relationships

The database includes **relationship data** that connects entities and provides rich contextual metadata:

**What Are Relationships?**
- Connections between entities in the database with associated metadata
- Examples: 
  - Scribal Units linked to texts (with language, style, expression details)
  - Scribal Units linked to historical people (with scribe role, certainty level)
  - Manuscripts linked to holding institutions (current locations)

**How Relationships Display:**

**In the Detail View (Right Panel):**
When you click a record, relationships appear at the bottom of the detail panel:
- **Relationships** — Entities this record points to (e.g., the Manuscript a Scribal Unit belongs to)
- **Expandable Details** — Click the ▶ button next to any relationship to see full metadata (scribe role, certainty, language, style, etc.)
- **Clickable Links** — Gold-colored entity names are clickable to navigate to that record
- **Filtered Entities** — If a related entity is filtered out, it appears as gray italic text (not clickable)

**In the Filters (Left Panel):**
Some entity types have **relationship-based filters** that pull values from connected records:
- **Scribal Units:**
  - Scribe certainty (from relationships)
  - Scribe role (from relationships)
  - Function of copying (from relationships)
  - Text language (from relationships)
  - Style (from relationships)
  
- **Production Units:**
  - Text language (from relationships)
  - Style (from relationships)
  
- **Historical People:**
  - Scribe role (from relationships)
  
- **Texts:**
  - Expression (from relationships)

These filters allow you to search based on metadata stored in the relationships themselves, not just the entity's direct fields.

**How to Use Relationships:**

**1. Browse Related Entities:**
- Click any record to see its detail view
- Scroll to the bottom to see all relationships
- Click linked entity names to navigate between connected records
- Example: Click a Scribal Unit → see its Manuscript → see other Scribal Units in that Manuscript

**2. Filter by Relationship Metadata:**
- Use relationship-based filters in the left panel
- Example: Filter Scribal Units by "Scribe role (from relationships)" = "Main scribe"
- These filters search metadata attached to the relationships, not just the entities

**3. Full-Text Search Includes Relationships:**
- When you search, all relationship metadata is automatically included
- Search for "main scribe" to find Scribal Units with that role in relationships
- Search for a monastery name to find Production Units linked to it

**4. Visual Exploration:**
- Switch to the **Network Explorer** tab for interactive graph visualization
- See all relationships as lines connecting nodes
- Click nodes to highlight connections
- Filter by entity type to focus on specific relationship patterns

**Example Workflow:**
1. Search for "Latin" in Scribal Units
2. Results include units where Latin appears in text language (from relationships)
3. Click a result to see detail view
4. Expand relationship details (▶ button) to see full metadata
5. Click linked manuscript name to navigate to that record
6. See all other Scribal Units in that manuscript
7. Switch to Network view to visualize the full relationship network

### Pagination

**Bottom of record list:**
- **Previous / Next** buttons
- Page numbers
- Go to specific page
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
- **Entity Filter:** Select specific entity types (Manuscripts, Scribal Units, etc.)
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
   - Shows historical migration patterns and helps understand manuscript circulation and collection history
   - Arrows connect origin to current location

4. **Production Units - All Locations**
   - All Production Unit geographic data

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
- **Heatmap** option available for density visualization

**Interactions:**
- **Zoom:** Mouse wheel or +/- buttons
- **Pan:** Click and drag
- **Click cluster:** Zooms in to show individual markers
- **Click marker:** Opens popup with record details
- **Popup:** Click record name to view full details and "Open in results" button to see details in results view.
- **Reset view:** Zoom to fit button
- 

### Exporting Maps

**Export as Image:**
1. Click **"Export PNG"** button (top right of map)
2. High-resolution PNG image downloads
3. Use in presentations, publications, or reports

---

## 5. Codicological Analysis (Not currently available)


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
- **Interleaved Units** — Non-sequential Production Unit arrangements
- **Production Units Across Multiple Manuscripts** — Production units spanning multiple manuscripts
- **Scribal Units Across Multiple Production Units** — Scribes working across production units

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
- "Produced by" — Production Unit → Monastic Institution (monastery)
- "Contains" — Manuscript → Scribal Unit
- "Is part of" — Scribal Unit → Production Unit
- "Held by" — Manuscript → Holding Institution
- And more...

### Interacting with the Network

**Navigation:**
- **Zoom:** Mouse wheel
- **Pan:** Click and drag background
- **Move nodes:** Click and drag individual nodes
- **Reset view:** Zoom to fit button

**Exploring Connections:**
1. **Click a node** — Highlights that record and its immediate connections, opens a pop-up with details and a link to view full records in Browse mode.
2. **Relationship labels** — Hover over lines to see relationship type

**Filtering:**
- Click on filters to select which entity types to show:
  - Manuscripts
  - Scribal Units
  - Production Units
  - Holding Institutions
  - Monastic Institutions
  - Historical People
  - Texts
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
- **Language Distribution:** Top languages with manuscript/Scribal Unit counts
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
- **Display:** Institution name, location, languages used, Scribal Unit count
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

### Seven Analysis Tabs

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
- **"View Scribal Unit" Button:** Quick navigation to full scribal unit record

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
- **"View Scribal Unit" Buttons:** Navigate to full records
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
- **"View Scribal Unit" Button:** Navigate to full scribal unit record
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

#### 7. 📖 Explore Formulae Tab

**Purpose:** Discover and analyze standardized formulaic patterns in colophons across languages and regions

**Accessing:**
- Click the **Explore Formulae** sub-tab within Colophon Analysis

**What are Colophon Formulae?**

Standardized phrases, expressions, and linguistic patterns that scribes commonly used in their colophons. These recurring formulas reveal:
- Traditional scribal practices and conventions
- Regional and linguistic patterns
- Cross-cultural influences and transmission of scribal culture
- Common themes in medieval self-expression

Formulae can be complete phrases ("Qui scripsit scribat semper cum Domino vivat") or shorter fragments ("anno domini", "finito libro").

**Overview Statistics:**

The interface displays three key metrics:
- **Predefined Formulas:** Total number of formulaic patterns being searched
- **Languages:** Number of languages represented in the formula collection
- **Colophons Searched:** Total colophons in the database searched for matches

**Filter Options:**

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

**Formula Display:**

Each formula card shows:
- **Formula Text:** The main formula in its original language
- **Language:** Language of the formula
- **Match Count:** Number of unique manuscripts containing this formula
- **Variants:** Accepted spelling variations and fragments (e.g., "int jaer", "int iaer", "intjaer")
- **Formula Type Badge:** Color-coded category (Prayer, Dating, Scribe, etc.)

**Viewing Matching Examples:**

Expand Formula Cards:
- Click "Show Examples" to view colophons containing the formula
- Displays up to 20 matching examples per page
- Each example shows:
  - **Manuscript title** and shelfmark
  - **Country** and **Century** of production
  - **Matched variant:** Which specific variant was found
  - **Full colophon transcription:** Original text (first 200 characters)
  - **English translation** (if available)
  - **View Scribal Unit button:** Navigate to full scribal unit record

**Pagination:**
- Navigate through multiple pages of examples if more than 20 matches exist
- Page counter shows current page and total pages

**Global Formula Distribution Map:**

Expand to see:
- Geographic spread of all formulas in the corpus
- Interactive map showing locations where formulas appear
- Click markers to see which formulas are found in each region
- Visual representation of formula transmission and regional patterns

**Example Formulas by Language:**

Latin Formulas:
- "Qui scripsit scribat semper cum Domino vivat" (May the one who wrote always live with the Lord)
- "Finito libro sit laus et gloria Christo" (The book finished, let there be praise and glory to Christ)
- "Explicit expliceat ludere scriptrix eat" (The end is unfolded, let the female scribe go play)
- "Detur pro penna scriptori pulchra puella" (Let a beautiful girl be given to the scribe for his pen)

Dutch Formulas:
- "int jaer ons heren" (in the year of our Lord)
- "bidt om gods wil" (pray for God's sake)
- "dit boeck hoert" (this book belongs)

German Formulas:
- "pitt got für" (pray to God for)
- "das puch hat geschriben swester" (the book was written by sister)
- "do man zalt" / "als man zalt" (when one counts [dating formulas])
- "Lob sye Gott" (Praise be to God)

Italian Formulas:
- "libro è delle monache" (the book belongs to the nuns)
- "A llaude et onore" (To praise and honor)
- "peccatrice" (sinner [female])

Other Languages:
- **French:** "Pries Nostre Seigneur" (Pray to Our Lord)
- **Portuguese:** "Acabousse" (It was finished); "Screveo freira" (The nun wrote)
- **Swedish:** "bidhin kära systra" (pray dear sisters); "owärdoghe" (unworthy)

**Use Cases and Research Questions:**

Formula Distribution:
- Which formulas were most widespread across Europe?
- Are certain formulas region-specific or pan-European?
- How did formulas spread across linguistic boundaries?

Temporal Patterns:
- Did certain formulas become more or less common over time?
- When did particular formulas first appear in the corpus?
- Are there chronological patterns in formula usage?

Linguistic Analysis:
- Which languages have the most diverse formula traditions?
- How do formulas in Latin differ from vernacular languages?
- Are there translation patterns between Latin and vernacular formulas?

Cultural Transmission:
- Do formulas cluster geographically?
- Which institutions shared formula traditions?
- How did formulas travel between convents and scriptoria?

Gender-Specific Formulas:
- Are there formulas unique to female scribes?
- How do female scribes adapt traditionally masculine formulas?
- What does formula usage reveal about female scribal identity?

**Tips for Using Explore Formulae:**

1. Start broad by viewing all formulas to understand the full scope
2. Filter strategically using language or country filters to focus on specific traditions
3. Compare variants to notice how the same formula appears with different spellings
4. Always expand formula cards to see real examples in context
5. Use the "View Scribal Unit" button to explore full records and related data
6. Track patterns by noting which formulas appear in multiple countries or time periods
7. Consider zero matches as indicators of patterns not yet found in the corpus

**Formula Search Technology:**
- Fuzzy matching with flexible pattern recognition for variants
- Accounts for spelling variations, spacing differences, and abbreviations
- Case-insensitive matching ensures comprehensive coverage
- Each formula includes predefined variants based on scholarly research
- Captures common abbreviations and alternative spellings
- Recognizes partial matches (formula fragments)

### Export Features

- **Copy to Clipboard:** Any colophon text (transcription or translation)
- **Visualizations:** All charts can be exported as images
- **Filtered Results:** Export through main Browse mode for CSV

---

## 10. IIIF Viewer & Mirador

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

## 11. Search Transcriptions

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

## 12. Tips & Tricks

### Power User Techniques

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
3. From Scribal Unit, see Production Units
4. From Production Unit, see Manuscripts
5. From Manuscript, see Holding Institution
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
- Site works on tablets and phones but is overall optimized for desktop


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

3. **Hierarchical Tree:**
   - Click **"Export as Image"** button
   - Captures full tree structure
   - Filename: `unknownhands-tree-{timestamp}.png`
   - **Resolution:** 3x scale (~300 DPI)

4. **Network Visualization:**
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

**Colophon Transcriptions and translations:**
- In Colophon Analysis Browse tab
- Click copy-to-clipboard button
- Each colophon has "Copy" buttons
- Separate buttons for transcription and translation
- Click to copy to clipboard
- Paste into your documents for citation
- Button shows "Copied!" confirmation

**Transcription Search Results:**
- Export search results as TSV
- Includes manuscript name, page, line number, and full text
- Export filtered datasets to focus on your research corpus

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

---

## 13. Frequently Asked Questions

### General Questions

**Q: Is the data complete?**
A: The database is continuously growing. We're adding manuscripts and transcriptions regularly. Current counts shown on homepage.

**Q: Can I download the entire database?**
A: Yes, in Browse mode, with no filters, click "Export CSV" to download all records of current entity type. Repeat for each type.

**Q: How do I cite the Unknown Hands database?**
A: See the [Credits](/unknownhands/credits) page for citation information.

**Q: Who created the data?**
A: Project team led by Estelle Guéville. See [Team](/unknownhands/team) page.

### Data Questions

**Q: Why do some manuscripts not have images?**
A: Not all manuscripts have been digitized. We link to IIIF manifests when available. Check "Digitization Status" and "IIIF status"fields.

**Q: What is a "Production Unit"?**
A: A Production Unit represents the context of manuscript creation: where, when, how, with what materials. One Manuscript can have multiple Production Units if created in stages.

**Q: What is a "Scribal Unit"?**
A: A Scribal Unit is the work of one scribe on a specific portion of a manuscript. Represents the core evidence of scribal activity.

**Q: How are dates formatted?**
A: Dates use terminus post quem (earliest possible) and terminus ante quem (latest possible). Many manuscripts can only be dated to a range (e.g., 1300-1350).

**Q: What does "normalized" mean?**
A: Normalized fields have standardized values for analysis. Example: "Normalized script" uses controlled vocabulary, while original descriptions may vary.

### Technical Questions

**Q: Which browsers are supported?**
A: Modern browsers: Chrome, Firefox, Safari, Edge. Latest versions recommended.

**Q: Why is the map/timeline loading slowly?**
A: Large datasets take time. Try filtering to a subset. Clear browser cache if persistent.

**Q: Can I use the data in my research?**
A: Yes! Data is open access. Please cite appropriately. See license information on [Credits](/unknownhands/credits) page.

**Q: How do I report an error?**
A: Contact project team (see [Contact](/unknownhands/contact) page).

**Q: Is there an API?**
A: Currently, data is available via CSV export and JSON files. We're exploring API options for future releases.

### Feature Questions

**Q: Can I save my analyses?**
A: Currently, you can export results as CSV and visualizations as high-quality images. Saved analysis workspaces are planned for future release.

**Q: Can I upload my own manuscripts?**
A: Not directly through the website. Contact the team if you have data to contribute ([Contact](/unknownhands/contact)).

**Q: Will there be more analysis types?**
A: Yes! We're continuously developing new analytical tools based on user feedback.

**Q: What is sentiment analysis in colophons?**
A: Our sentiment analysis uses keyword matching to detect emotional tones in colophon texts. It identifies 6 categories (humility, pride, labor, religious, temporal, dedication) and shows which keywords were matched for transparency.

**Q: How accurate is the colophon sentiment analysis?**
A: The analysis is keyword-based and designed for exploratory research. It identifies potential emotional content but should be verified by reading the full colophon text. All matched keywords are displayed for transparency.

**Q: What does 📝 and 📖 mean in the Multilingualism module?**
A: 📝 indicates colophon language (the language of the scribe's note), while 📖 indicates text language (the language of the main content being copied). This distinction helps identify code-switching.

**Q: How do I export a visualization for my publication?**
A: Click the "Export" button on any visualization. It will download as a high-quality PNG (300 DPI) suitable for publication. Available for maps, timelines, networks, and all analytics charts. Please cite appropriately.

**Q: Can I see the raw colophon text?**
A: Yes! Use the Colophon Analysis module's "Browse Colophons" tab. Each colophon shows both the original transcription and English translation, with copy-to-clipboard buttons for citation.

**Q: Why do some colophons show as "Least Expressive"?**
A: These are colophons with minimal emotional language, typically containing only factual information (names, dates, places). They represent a more neutral scribal voice compared to emotionally expressive colophons.

---

## Need More Help?

### Resources

- **Technical Documentation:** See `README.md` in GitHub repository
- **Contact Form:** [Contact](/unknownhands/contact)
- **Report Issues:** [Contact](/unknownhands/contact)
- **Email:** estelle.gueville@yale.edu

### Tutorials

- **Video Tutorials:** [Coming soon]
- **Workshops:** Check website for announcements
- **Publications:** See [Publications](/unknownhands/publications) page

---

## Acknowledgments

This platform is the result of collaboration between medievalists, digital humanists, librarians, and software developers. Thank you for exploring the *Unknown Hands* database!

---

*Unknown Hands User Guide v2.0*  
*Last updated: December 2025*  
*Estelle Guéville, Yale University*
