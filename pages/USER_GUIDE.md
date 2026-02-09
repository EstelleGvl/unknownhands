---
layout: page
permalink: /userguide/
show_title: false
banner:
  image: "pizan.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---


# *Unknown Hands* - User Guide

**Welcome to *Unknown Hands*!** This guide will help you explore and analyze our database of pre-modern female scribal production. Whether you're a researcher, student, or simply curious about medieval manuscripts, this manual will show you how to get the most out of our interactive platform.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Browse & Search](#2-browse--search)
3. [Analytics Tools](#3-analytics-tools)
4. [Map Visualizations](#4-map-visualizations)
5. [Hierarchical Tree Explorer](#5-hierarchical-tree-explorer)
6. [Network Explorer](#6-network-explorer)
7. [Scribes Mode](#7-scribes-mode)
8. [Multilingualism Analysis](#8-multilingualism-analysis)
9. [Text Genres Network Analysis](#9-text-genres-network-analysis)
10. [Colophon Analysis](#10-colophon-analysis)
11. [IIIF Viewer & Mirador](#11-iiif-viewer--mirador)
12. [Search Transcriptions](#12-search-transcriptions)
13. [Tips & Tricks](#13-tips--tricks)
14. [FAQ](#14-frequently-asked-questions)

---

<details markdown="1" id="1-getting-started">
<summary><strong>1. Getting Started</strong></summary>

### What is *Unknown Hands*?

Unknown Hands is a digital research platform documenting the work of female scribes before 1600. Our database includes:
1. **Scribal Units (SU)** — The core unit of analysis in the database. A specific manuscript section written by a scribe.
2. **Manuscripts (MS)** — Physical codices (books) at least partially written by or associated with women.
3. **Production Units (PU)** — Manufacturing contexts of specific manuscript sections (where/when/how manuscripts were made).
4. **Holding Institutions (HI)** — Libraries and archives holding these manuscripts.
5. **Monastic Institutions (MI)** — Historical production locations (monasteries, convents).
6. **Historical People (HP)** — Scribes, authors, patrons, owners.
7. **Texts (TX)** — Literary works contained in manuscripts.

### Navigating the Site

**Main Navigation Bar** (top of page):
- **[About](/unknownhands/about/)** — Learn about the project.
- **[Explore Database](/unknownhands/explore-database/)** — Interactive data explorer (this guide's focus).
- **[Viewer](/unknownhands/viewer/)** — View manuscript images with transcriptions.
- **[Search Transcriptions](/unknownhands/search-transcriptions/)** — Full-text search across all transcribed manuscripts.
- **[Team](/unknownhands/team/)** - The people behind the project.
- **[Publications](/unknownhands/publications/)** - Scholarly articles and books based on the project.
- **[Participate](/unknownhands/participate/)** — How to get involved in the project.

</details>

---

<details markdown="1" id="2-browse--search">
<summary><strong>2. Browse & Search</strong></summary>

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
4. You can apply multiple filters at once to narrow results. Example: Filter Scribal Units by "Scribe role (from relationships)" = "Main scribe" AND "Text language (from relationships)" = "Latin"
5. You can unselect filters by clicking them again to broaden results


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

</details>

---

<details markdown="1" id="3-analytics-tools">
<summary><strong>3. Analytics Tools</strong></summary>

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
- **Export:** Save dashboard as high-resolution image (PNG, 300 DPI) suitable for publications

**Use Cases:**
- Understanding corpus composition
- Identifying geotemporal patterns
- Finding gaps in the data
- Dataset completeness analysis
- Identifying trends across entity types

</details>

---

<details markdown="1" id="4-map-visualizations">
<summary><strong>4. Map Visualizations</strong></summary>

### Accessing Map Mode

1. In **Explore Database**, click **Map** tab (top navigation)
2. Map loads showing manuscript locations across all database records

### Map View Options

**Map View Selector** (dropdown menu at top):

**5 Different Views:**

1. **Manuscripts - Current Location (Holdings)**
   - Shows where manuscripts are held today
   - Each blue marker represents a manuscript at its current holding institution
   - Use to find manuscripts near a specific location

2. **Manuscripts - Movement (Production → Current)**
   - Visualizes manuscript movement from production location to current holding.
   - Shows only manuscripts where BOTH production and current locations are known AND different.
   - Routes connect production site to current location.
   - Orange markers indicate manuscripts that have moved.
   - Red markers indicate current location and green markers indicate production location.
   - Reveals historical migration patterns and manuscript circulation.

3. **Production Units - All Locations**
   - Maps all Production Units at their creation locations.
   - Orange markers indicate production locations.
   - Shows where manuscript sections were actually made.
   - If linked to a monastery, the monastery name appears in the subtitle
   - Time period filter allows you to see production locations active during specific times.

4. **Production Units - By Monastery**
   - Groups Production Units by their associated monastic institution
   - Each marker represents a monastery with one or more Production Units
   - Shows count of Production Units created at each monastery
   - Reveals which monasteries were most productive
   - Time period filter allows you to see production locations active during specific times.


5. **Monastic Institutions**
   - Maps all monasteries and convents in the database
   - Green markers indicate monastic locations
   - Shows count of linked Production Units (if any)
   - Reveals the geographic distribution of female religious houses

**Note:** Map views show all data from the entire database, regardless of current filters/search in other modes.

### Map Controls & Features

**Display Options:**

- **Clustering** (checkbox, enabled by default)
  - Groups nearby markers into numbered clusters
  - Click clusters to zoom in and see individual markers
  - Disable to show all individual markers at once

- **Connection Lines** (checkbox)
  - Available in Movement view
  - Draws lines between connected locations
  - Shows relationships between production and holding sites

- **Heatmap** (checkbox)
  - Displays density visualization overlay
  - Brighter colors indicate higher concentration of records
  - Useful for identifying geographic patterns

- **Show Routes** (checkbox)
  - Available in Movement view
  - Draws curves connecting production to current locations
  - Animates manuscript migration paths

**Time Period Filter:**

- **Dual range sliders** control start and end years (800-1600)
- Filters markers by manuscript/production dates
- **Current range** displayed above sliders
- **Clear button** resets to full date range
- Only shows records with known dates within selected period

**Color Legend:**

- Displayed below controls
- Shows marker colors for different entity types
- Updates based on selected map view

### Using the Map

**Navigation:**
- **Zoom:** Mouse wheel, +/- buttons, or double-click
- **Pan:** Click and drag map
- **Reset View:** Click "Reset View" button to fit all visible markers

**Markers:**
- **Numbered clusters** — Multiple records at similar location (click to expand)
- **Individual markers** — Single record (color indicates entity type)
- **Click marker** — Opens popup with record details

**Popups:**
- Show record title and location
- Click record name to view full details page
- Click "Open in results" to see in Browse mode

### Exporting Maps

**Export as Image:**
1. Click **"📷 Export PNG"** button (green button at top right)
2. High-resolution PNG image (300 DPI) downloads automatically
3. Captures current view, including:
   - Visible area and zoom level
   - Active markers and clusters
   - Heatmap (if enabled)
   - Routes/connections (if enabled)
   - Color legend

</details>

---

<details markdown="1" id="5-hierarchical-tree-explorer">
<summary><strong>5. Hierarchical Tree Explorer</strong></summary>

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
- Exports current tree view as high-resolution PNG (300 DPI)
- Suitable for publications and presentations

</details>

---

<details markdown="1" id="6-network-explorer">
<summary><strong>6. Network Explorer</strong></summary>

### Accessing Network Mode

1. Click **Network** tab in Explore Database
2. Network visualization loads with search interface

### Two Network Views

**Network View Selector** (dropdown at top):

1. **Search & Explore from Record** (Recommended)
   - Search for any manuscript, scribe, institution, or text
   - Select a record to explore its network
   - Shows relationships radiating from chosen starting point
   - Ideal for focused exploration

2. **Cluster View by Entity Type**
   - Shows broader overview of entity relationships
   - Visualizes overall database structure
   - Groups related entities together

### Building Your Network (Search Mode)

**Step 1: Search for a Record**
- Type in the search box: manuscript name, scribe, institution, or text
- Results appear as you type
- Click any result to select it as your starting point

**Step 2: Configure Network**

**Depth Control:**
- Set **Depth** (1-3) to control how many relationship levels to show
- Depth 1: Shows only direct connections
- Depth 2: Shows connections and their connections (recommended)
- Depth 3: Shows extended network (may be very large)

**Color Options:**
- **Entity Type** — Color by record type (manuscripts, scribes, institutions)
- **Century** — Color by date of production
- **Region** — Color by geographic origin
- **Religious Order** — Color by monastic affiliation

### Network Controls & Features

**Display Options:**
- **Labels** (checkbox) — Show/hide node labels
- **Dark Mode** (checkbox) — Toggle dark background for better visibility
- **Link Density** (slider) — Adjust how many connections are visible (0-100%)
  - Lower values hide weaker connections
  - Higher values show all relationships

**Entity Type Filters:**
Show/hide specific entity types:
- Scribal Units (yellow)
- Manuscripts (blue)
- Production Units (red)
- Holding Institutions (green)
- Monastic Institutions (purple)
- Historical People (orange)
- Texts (teal)

**Click "Filters" button** to access advanced filtering panel

### Navigation & Interaction

**Map Controls:**
- **Zoom In/Out** — Buttons or mouse wheel
- **Reset View** — Return to default zoom (100%)
- **Fit to Screen** — Auto-zoom to show entire network
- **Pan** — Click and drag background
- **Move nodes** — Click and drag individual nodes

**Exploring Connections:**
- **Click a node** — Shows details panel with record information
- **Node details panel** appears at top-left with:
  - Record title and type
  - Key metadata
  - "View Scribal Unit" or "View Full Record" button
- **Link lines** connect related records
- **Color legend** appears at top-right showing what colors mean

**Rebuild Network:**
- Click **"Rebuild Network"** button after changing filters
- Network regenerates with new settings

### Use Cases

**Finding Related Records:**
- Search for a manuscript
- See which scribal units it contains
- Trace to production units and monasteries
- Find other manuscripts from same scriptorium

**Identifying Hubs:**
- Larger nodes = more connections
- Identifies important manuscripts, productive monasteries, prolific scribes

**Pattern Discovery:**
- Clusters reveal closely related groups
- Isolated nodes show unique records
- Dense areas indicate production centers
- Color patterns reveal temporal or geographic groupings

### Exporting Networks

**Visual Exports:**
- **📷 Export SVG** — Vector format, infinitely scalable, ideal for academic publications
- **📷 Export PNG** — High-resolution raster (300 DPI), suitable for presentations

**Data Exports:**
- **Export Data dropdown** menu offers:
  - **Gephi (2 CSV files)** — Nodes and edges files for Gephi network analysis software
  - **R (CSV + script)** — Network data plus R script for statistical analysis

**What Gets Exported:**
- Current visible network (respects filters)
- Node positions and relationships
- All metadata for further analysis
- Color scheme and labels (in image exports)

### Network Statistics

**Filter Feedback** (bottom of filters panel):
- **Node count** — Number of records in current network
- **Link count** — Number of connections shown
- Updates in real-time as you change filters

**Reset All Filters** button clears all filters and returns to full view

</details>

---

<details markdown="1" id="7-scribes-mode">
<summary><strong>7. Scribes Mode</strong></summary>

### Accessing Scribes Mode

1. In **Explore Database**, click **Scribes** tab (top navigation)
2. View loads showing scribal analysis interface with six tabs

### What is Scribes Mode?

Explore female scribes through comprehensive statistical analyses, network visualizations, and detailed data. This mode focuses specifically on the women who copied medieval manuscripts, their productivity patterns, collaborations, and geographic distribution.

### Six Analysis Tabs

Select a tab at the top to explore different aspects:

#### 1. Overview

**Purpose:** Get a comprehensive snapshot of female scribal activity

**Key Statistics:**
- **Total Female Scribes** — Number of identified female scribes in the database
- **Total Scribal Units by Women** — Number of manuscript sections attributed to female scribes
- **Average SUs per Female Scribe** — Mean productivity across all scribes
- **Multilingual Female Scribes** — Scribes who worked in multiple languages

**Visualization:**
- **Top 20 Most Productive Scribes** — Bar chart showing scribes ranked by number of scribal units produced
- Hover over bars to see scribe details
- Click "Export PNG" to download chart (300 DPI)

**Use this to:** 
- Understand the overall scope of female scribal activity
- Identify the most prolific female scribes at a glance
- Compare productivity across the dataset

#### 2. Productivity Patterns

**Purpose:** Analyze patterns in scribal and manuscript production

**Two Distribution Charts:**

**Scribe Productivity Distribution:**
- Shows how many scribes produced 1, 2, 3+ scribal units
- Reveals that most scribes produced few units, while a few were highly productive
- X-axis: Number of scribal units | Y-axis: Number of scribes

**Manuscript Productivity Distribution:**
- Shows how many manuscripts have 1, 2, 3+ scribes
- Reveals collaboration patterns in manuscript production
- X-axis: Number of scribes per manuscript | Y-axis: Number of manuscripts

**Export:** Both charts can be exported as high-resolution PNG (300 DPI)

**Use this to:**
- Study scribal productivity patterns
- Understand the distribution of labor
- Identify manuscripts with multiple scribes
- Compare individual vs. collaborative production

#### 3. Unseen Species Analysis

**Purpose:** Estimate how many female scribes remain undiscovered using cultural ecology methods

**What is Unseen Species Analysis?**

Applies biodiversity estimation techniques to manuscript data. Just as ecologists estimate total species from sampling, this analysis projects the likely total population of female scribes based on observed patterns.

**Four Experiments:**

**Experiment 1: High Certainty Attributions**
- Uses only scribes with highest attribution confidence
- Most conservative estimate
- Minimizes false positives

**Experiment 2: Entire Corpus (Default)**
- Analyzes all scribes in the database
- Balanced approach between comprehensiveness and accuracy
- Recommended for general understanding

**Experiment 3: Breakdown by Country**
- Separate estimates for each geographic region
- Reveals where more scribes likely remain to be found
- Identifies regional gaps in current knowledge

**Experiment 4: Breakdown by Century**
- Temporal distribution of estimates
- Shows which periods have more undiscovered scribes
- Identifies chronological gaps in the data

**Results Display:**
- **Observed Scribes:** Current count in database
- **Estimated Total:** Projected total population (with confidence intervals)
- **Unseen Species:** Estimated number yet to be discovered
- **Discovery Curve:** Visualization of accumulation pattern
- **Statistical Metrics:** Chao1 estimator, confidence intervals

**Methodology Button:** Click "ℹ️ Methodology & References" to see detailed explanation of statistical methods and academic sources

**Use this to:**
- Assess completeness of current knowledge
- Understand scale of undiscovered female scribal activity
- Identify where more research is needed
- Support grant proposals and research planning

#### 4. Collaborations

**Purpose:** Explore which scribes worked together on manuscripts

**Features:**

**Collaboration Network Visualization:**
- Interactive network graph showing scribe-to-scribe connections
- **Nodes (circles):** Individual scribes
- **Node size:** Number of collaborations (larger = more collaborative)
- **Edges (lines):** Shared manuscripts
- **Edge thickness:** Number of manuscripts worked on together
- Zoom, pan, and hover to explore
- Click nodes to see scribe details

**Top Collaborators Panel:**
- List of scribes ranked by number of collaborations
- Click any scribe to focus network view on them
- Shows collaboration partners and shared manuscripts

**Multi-Scribe Manuscripts Panel:**
- Lists all manuscripts with 2+ female scribes
- Click to see which scribes worked together
- Reveals collaborative production workshops

**Export:** Network can be exported as high-resolution PNG (300 DPI)

**Use this to:**
- Identify scribal workshops and partnerships
- Find scribes who frequently collaborated
- Study patterns of collaborative manuscript production
- Understand scribal communities

#### 5. Geography

**Purpose:** Explore geographic and institutional distribution of scribes

**Two Charts:**

**Top Institutions by Scribe Count:**
- Bar chart showing monasteries/convents with most female scribes
- Ranked by number of scribes associated with each institution
- Reveals major centers of female scribal activity

**Top Cities by Scribe Activity:**
- Bar chart showing cities with most scribal production
- Ranked by total scribal activity
- Maps geographic centers of female book production

**Use this to:**
- Identify major scriptoria and production centers
- Compare institutional productivity
- Study geographic distribution of female scribes
- Find regional patterns in scribal activity

#### 6. Browse All

**Purpose:** Search, filter, and export the complete scribe dataset

**Advanced Filtering:**

**Search Box:**
- Search by scribe name, language, or institution
- Real-time filtering as you type

**Filter Type Dropdown:**
- **All Scribes** — Show everyone
- **Multilingual Only** — Scribes who worked in 2+ languages
- **Highly Productive (5+ SUs)** — Most prolific scribes
- **Collaborative** — Scribes who worked with others

**Language Filter:**
- Filter by specific language (Latin, French, German, etc.)
- Shows scribes who worked in that language

**Institution Filter:**
- Filter by monastery/convent
- Shows scribes associated with specific institutions

**Table Display:**
- Sortable columns: Name, Languages, Institution, SU Count, etc.
- Click any scribe row to view full details
- Responsive design for easy browsing

**Export CSV:**
- Click "📥 Export CSV" button to download full dataset
- Includes all scribe data and metadata
- Respects current filters
- Suitable for statistical analysis in Excel, R, Python, etc.

**Use this to:**
- Find specific scribes
- Generate custom filtered lists
- Export data for further analysis
- Conduct systematic research across all scribes

### General Tips

**Navigation:**
- Use tabs to switch between different analytical perspectives
- Charts and visualizations are interactive — hover and click to explore
- Export buttons preserve current view with high quality (300 DPI)

**Comparison Strategy:**
- Start with **Overview** to understand the big picture
- Use **Productivity Patterns** to see distribution patterns
- Explore **Unseen Species** to assess data completeness
- Examine **Collaborations** to find networks
- Check **Geography** for regional patterns
- Use **Browse All** for detailed investigation

### Exporting Data & Visualizations

**Chart Exports:**
- Click "Export PNG" button on any visualization
- Downloads high-resolution image (300 DPI)
- Suitable for publications, presentations, and reports

**Data Export:**
- Use **Browse All** tab → **Export CSV** button
- Downloads complete dataset with current filters applied
- Compatible with Excel, R, Python, Gephi, and other analysis tools

</details>

---

<details markdown="1" id="8-multilingualism-analysis">
<summary><strong>8. Multilingualism Analysis</strong></summary>

### Accessing Multilingualism Mode

1. In **Explore Database**, click **Multilingualism** tab (top navigation)
2. View loads showing the Multilingualism Explorer with five tab options
3. Select a tab to explore different aspects of linguistic diversity

### What is Multilingualism Analysis?

Explore language patterns and linguistic diversity across manuscripts, scribes, and institutions. Examine how scribes worked with multiple languages and when they code-switched between languages in colophons versus texts. This mode tracks languages from all sources: production unit colophons, scribal unit colophons, text languages, and scribe attributions.

### Five Analysis Tabs

#### 1. Overview

**Purpose:** Get a comprehensive snapshot of linguistic diversity across the entire corpus

**Five Key Statistics (Stat Cards):**
- **Languages/Dialects:** Total count of unique languages and dialects in the database
- **Multilingual Manuscripts:** Number of manuscripts containing 2+ languages
- **Multilingual Scribes:** Number of scribes who worked in 2+ languages
- **Multilingual Institutions:** Number of institutions that produced texts in 2+ languages
- **Colophon-Text Divergences:** Count of cases where colophon language ≠ text language

**Language Distribution Chart:**
- Bar chart showing the 15 most common languages
- Each bar shows occurrence count (from colophons, texts, and all sources)
- Gold gradient bars with language names and counts

**Pattern Analysis Section (4 Subsections):**

**1. Geographical Distribution**
- Top 10 countries by multilingual production units
- Shows count of multilingual PUs and number of unique languages per country
- Blue gradient bars

**2. Temporal Distribution** 
- Multilingual production organized by century
- Shows count and language diversity for each time period
- Green gradient bars
- Sorted chronologically

**3. Religious Order Patterns**
- Top 8 religious orders by multilingual manuscript production
- Shows PU count, language diversity, and institution count per order
- Purple/pink gradient bars

**4. Top Institutions**
- Top 10 individual institutions by multilingual activity
- Shows multilingual PU count, languages used, religious order, and location
- Orange gradient bars

**Use this to:** 
- Understand the overall linguistic composition of the collection
- Identify geographical, temporal, and institutional patterns in multilingualism
- See which regions, periods, and religious orders were most linguistically diverse
- Get oriented before exploring specific manuscripts, scribes, or institutions

#### 2. Multilingual Manuscripts

**Purpose:** Find and analyze manuscripts containing two or more languages

**What Counts as Multilingual:**
A manuscript is classified as multilingual if it contains **2 or more languages** from ANY of these sources:
- Production unit colophon languages
- Scribal unit colophon languages
- Text languages from manuscript contents
- Combined languages across all PUs and SUs within the manuscript

**Multilingualism Types Detected:**
- **Within-PU Multilingualism:** At least one production unit contains multiple languages (e.g., Latin text with vernacular colophon within same PU)
- **Cross-PU Multilingualism:** Languages differ across production units (e.g., one PU entirely in Latin, another entirely in German)

**Display Format:**
- Manuscript cards showing:
  - Manuscript title and ID
  - All languages present (colored language badges)
  - Language count and PU count
  - Multilingualism type indicator
  - Number of multilingual PUs

**Expandable Breakdown:**
- Click to expand and see detailed PU-by-PU breakdown
- Each PU shows:
  - PU title
  - Languages in that PU
  - Colophon languages vs. text languages
  - Associated scribal units
  - Scribe attributions (if available)

**Filtering & Search:**
- **Language dropdown:** Filter to manuscripts containing a specific language
- **Century filter:** Filter by time period
- **Region filter:** Filter by geographic location
- **Text search:** Search manuscript titles

**Sorting:**
- Sort by manuscript name
- Sort by number of languages (most multilingual first)

**Use this to:**
- Find manuscripts in specific language combinations
- Identify the most linguistically diverse manuscripts
- Study language co-occurrence patterns (e.g., Latin + vernacular pairings)
- Compare within-PU vs. cross-PU multilingualism
- Trace how language use changed within a single manuscript

#### 3. Scribal Multilingualism

**Purpose:** Examine scribes who worked in multiple languages and analyze their linguistic practices

**What is Tracked:**
- **Scribes** (historical persons) and the languages they used across all their work
- Distinction between **colophon language** (language of the scribe's note) and **text language** (language of content copied)
- Multilingual scribes (those who worked in 2+ languages) are highlighted

**Display Format:**
- **Scribe cards** (colored language badges showing all languages used)
- Sorted by language diversity (most multilingual scribes first)

**Information Shown:**
- **Scribe name and ID**
- **Language count** (how many different languages the scribe used)
- **Language badges** (blue gradient badges for each language)
- **Manuscript count** (how many different manuscripts the scribe worked on)
- **Scribal Unit count** (total SUs attributed to this scribe)

**Expandable Language Breakdown:**
- Click to expand each scribe card
- See which specific SUs used which languages
- Each language section shows:
  - Scribal units in that language
  - Associated manuscripts
  - Scribe role (if specified)
  - Certainty level (if available)

**Focus on Multilingual Scribes:**
- Tab prioritizes scribes with 2+ languages
- Shows versatile scribes who code-switched or worked across linguistic boundaries
- Reveals individual linguistic abilities and specialization patterns

**Filtering & Search:**
- **Language filter:** Show only scribes who used a specific language
- **Minimum languages:** Filter by linguistic diversity level
- **Text search:** Search scribe names
- **Institution filter:** Filter scribes by associated institution (if linked)

**Use this to:**
- Find scribes who worked in multiple languages (knowledge brokers)
- Identify cases where colophon language differs from text language
- Study individual scribal linguistic abilities
- Compare multilingual vs. monolingual scribes
- Discover which scribe worked in the most languages
- Analyze whether scribes switched languages between different manuscripts or within the same manuscript

#### 4. Institutional Multilingualism

**Purpose:** Comprehensively analyze linguistic diversity by monastery/convent

**What is Tracked:**

The platform tracks institutional multilingualism through multiple sources to provide the most complete picture possible. An institution is considered multilingual if it has **2 or more languages** from ANY of these sources:

**Language Sources:**
1. **Production Unit Colophon Languages:** Languages appearing in PU colophons
2. **Scribal Unit Colophon Languages:** Languages appearing in SU colophons
3. **Text Languages:** Languages of manuscript contents (from relationship data)
4. **Scribe Languages:** Languages used by scribes working at the institution
5. **Manuscript Languages:** All languages aggregated from manuscripts produced at the institution

**Three Types of Multilingualism:**

1. **Multilingual Manuscripts:** Manuscripts containing texts in multiple languages (any format: main text in multiple languages, main text in one language and colophon in another, colophons in multiple languages, etc.)

2. **Multilingual Scribes:** Individual scribes who wrote in multiple languages across their work, even if each individual manuscript section is monolingual

3. **Institutional Specialization:** Institutions producing manuscripts in different languages even when each manuscript is monolingual (languages diverse at institutional level, not individual manuscript level)

**Display Format:**

**Institution Cards** showing:
- **Institution name** and ID
- **All languages used** (colored language badges)
- **Language count** (total unique languages)
- **Manuscript count** (manuscripts produced at the institution)
- **Scribe count** (scribes working at the institution)
- **Multilingualism type indicators** (which of the three types apply)

**Expandable Language Breakdown:**
- Click to expand any institution card
- See **language-by-language breakdown** showing:
  - Which specific production units use each language
  - Which scribal units use each language
  - Which manuscripts contain each language
  - Which scribes worked in each language
- Organized by language with source details (PU/SU/manuscript level)

**Example:**
A monastery might be multilingual because:
- It has one manuscript with Latin text and German colophon (multilingual manuscript)
- It has a scribe who wrote in both Latin and French across different manuscripts (multilingual scribe)
- It produced some manuscripts entirely in Latin and others entirely in German (institutional specialization)

**Filtering & Search:**
- **Language filter:** Show only institutions using a specific language
- **Minimum languages:** Filter by linguistic diversity level
- **Religious order filter:** Filter by monastic order (Benedictine, Cistercian, etc.)
- **Country/region filter:** Filter by geographic location
- **Text search:** Search institution names

**Sorting:**
- Sort by institution name
- Sort by language diversity (institutions with most languages first)
- Sort by manuscript count
- Sort by scribe count

**Use this to:**
- Find centers of multilingual manuscript production with complete data
- Compare linguistic diversity across religious institutions
- Identify all three types of institutional multilingualism (multilingual manuscripts, multilingual scribes, institutional specialization)
- Understand the full scope of language use at medieval scriptoria
- Study regional patterns in institutional linguistic practices
- Discover which institutions were the most linguistically diverse
- Compare monasteries vs. convents in terms of linguistic diversity

#### 5. Colophon-Text Divergence

**Purpose:** Specialized analysis of language code-switching between colophons and texts

**What It Shows:**
Cases where **colophon language ≠ text language**—when scribes wrote their notes/signatures in one language but copied the main text in a different language.

**Examples of Divergence:**
- Latin text with vernacular (German, French, Italian) colophon
- Vernacular text with Latin colophon
- Any case where scribe's personal note language differs from the content they copied

**Divergence Detection:**
- System compares colophon language field vs. text language field for each scribal unit
- Divergence is identified when colophon language is NOT in the set of text languages
- Requires both colophon language and text language to be recorded

**Display Format:**

**Divergence Cards** (one per divergent scribal unit):
- **Card border:** Pink/rose left accent border
- **Card header:**
  - Divergence number (for reference)
  - Scribal unit title
  - Associated manuscript title (in gold)
- **Visual language comparison:**
  - **Colophon Language:** Pink/yellow gradient badges
  - **Text Language(s):** Purple/blue gradient badges
  - Arrow symbol (→) showing the divergence direction
- **Scribe information:** Scribe name(s), role, certainty level (if available)
- **View SU button:** Jump directly to the scribal unit record for details

**Information Shown:**
- Scribal unit ID and title
- Manuscript ID and title
- Colophon language(s) with colored badges
- Text language(s) with different colored badges
- Scribe attribution(s)
- Production unit count

**Sorting:**
- Sorted alphabetically by manuscript title
- Groups divergences from the same manuscript together

**Interactive Features:**
- **Hover effect:** Cards lift and shadow increases on hover
- **View SU button:** Click to jump to the full scribal unit record
- **Expandable details:** See full context for each divergence

**Use this to:**
- Study language choices and code-switching in medieval scribal practice
- Understand when scribes used vernacular vs. Latin in their personal notes
- Identify patterns in scribal language selection (did they use their native language for colophons even when copying Latin texts?)
- Compare colophon language preferences across regions, time periods, or institutions
- Find cases where scribe's linguistic identity differs from the text they were copying
- Discover whether certain text types prompted more divergence (e.g., religious vs. secular)

**Research Questions:**
- Did scribes prefer to write colophons in their vernacular even when copying Latin texts?
- Were certain languages more common in colophons vs. main texts?
- Did divergence patterns change over time or vary by region?
- Which institutions had more colophon-text divergence?
- Were female scribes more or less likely to code-switch in colophons?

### General Tips

**Start with Overview:** Tab 1 provides orientation—see the big picture before diving into specific manuscripts, scribes, or institutions

**Understand the Three Types:** Multilingualism can occur at manuscript level (within-manuscript), scribe level (individual scribes working in multiple languages), or institutional level (languages diverse across an institution's production)

**Use Filters Strategically:** Each tab has specific filters—use them to narrow down to your research focus (e.g., filter to a specific language, century, or religious order)

**Expand for Details:** All tabs with cards (Manuscripts, Scribes, Institutions, Divergences) have expandable sections—click to see detailed breakdowns

**Compare Across Tabs:** Cross-reference findings—see which institutions had multilingual scribes, which manuscripts they produced, and whether colophon-text divergence was common

**Check Both Colophon and Text Languages:** Pay attention to the distinction—colophon language reveals scribe's personal linguistic choice, while text language shows what they were copying

**Look for Patterns:** Use the Pattern Analysis in Tab 1 to identify geographical, temporal, and institutional trends before exploring individual records

### Exporting Data & Visualizations

**No Direct Export from Multilingualism Mode:**
- Multilingualism tabs display data as interactive cards (not charts)
- No built-in PNG/SVG export buttons in this mode

**Alternative Export Options:**

**1. Export via Browse All Mode:**
- Switch to **Browse All** mode
- Use filters to select:
  - Manuscripts by language
  - Scribes by language
  - Institutions by language
- Click **Download CSV** to export filtered results with language data

**2. Export Colophon Data:**
- In Browse All, filter to records with colophon language values
- Export as CSV to analyze colophon-text relationships in external tools

**3. Manual Data Collection:**
- Use "View SU" or "View MS" buttons to jump to specific records
- Export individual records or collections from Browse All mode

**4. Statistical Analysis:**
- Copy data from Overview tab (language counts, pattern statistics)
- Use the displayed numbers for reports and publications
- Screenshot the Pattern Analysis charts if needed (browser screenshot tools)

**For Publications:**
- Take screenshots of multilingualism cards for visual examples
- Export underlying data via Browse All mode for statistical analysis
- Cite specific divergence cases or multilingual scribes using record IDs

### Research Questions Addressed

- Were manuscripts from Italy more multilingual than those from Germany?
- Did multilingualism increase in the 15th century?
- Which monasteries had the most linguistic diversity?
- How common was it for scribes to use different languages in colophons vs. texts?
- Which language combinations were most common?
- Were certain religious orders more linguistically diverse?
- Did female scribes show different patterns of multilingualism compared to male scribes?
- Which individual scribes were the most linguistically versatile?
- Was colophon-text divergence more common in certain regions or time periods?
- Were multilingual manuscripts more common in border regions or cosmopolitan centers?

</details>

---

<details markdown="1" id="9-text-genres-network-analysis">
<summary><strong>9. Text Genres Network Analysis</strong></summary>

### Accessing Text Genres Mode

1. In **Explore Database**, click **Text Genres** tab (top navigation)
2. View loads showing the tab selector
3. Select a tab to explore different aspects of text genre patterns

### What is Text Genres Analysis?

The Text Genres mode reveals how texts of different genres circulated through manuscripts, institutions, and scribes. Using bipartite network visualizations and statistical summaries, this mode helps identify patterns of textual specialization, diversity, and co-occurrence across the medieval manuscript ecosystem.

### Five Analysis Tabs

#### 1. Overview

**Purpose:** Get a comprehensive snapshot of text genre distribution in the database

**Statistics Provided:**
- **Total Texts:** Number of text records in the database
- **Unique Genres:** Count of distinct genre categories
- **Unique Subgenres:** Count of specific subgenre classifications

**Visualizations:**
- **Top Genres by Text Count:** Bar chart (orange gradient) showing the 15 most common genres
- **Top Subgenres by Text Count:** Bar chart (green gradient) showing the 15 most common subgenres
- **Analysis Approaches:** Four info cards explaining the purpose of each network tab

**Use this to:** 
- Understand the overall composition of texts and genres in the database
- See which genres and subgenres are most represented
- Choose which analysis approach to explore next

#### 2. Manuscript Networks

**Purpose:** Show which manuscripts contain which genres/subgenres through bipartite network visualization

**Network Structure:**
- **Left side (blue circles):** Manuscripts
- **Right side (colored rectangles):** Genres or subgenres (colored by category)
- **Edges:** Connections showing which manuscripts contain which genres/subgenres (thickness indicates frequency)

**Mode Controls:**
- **Genres / Subgenres Toggle:** Switch between viewing broad genre categories or granular subgenres
- **Horizontal / Radial Toggle:** Change network layout style

**Visualizations:**
- Bipartite network with manuscripts on left, genres/subgenres on right
- Bridge nodes (manuscripts connecting many different genres, or genres appearing in many manuscripts)
- Hub nodes (major hubs with 2x average connections)
- Network statistics displayed: manuscript count, genre/subgenre count, bridge count, hub count

**Interactive Controls:**
- Zoom In / Zoom Out buttons
- Reset View button
- Hide Labels toggle
- Hide Singles toggle (remove nodes with only one connection)
- Export button for PNG export
- Embed button for full-screen view

**Use this to:**
- Find all manuscripts containing a specific genre
- Identify manuscripts with diverse genre content (bridge manuscripts)
- See genre co-occurrence patterns across manuscripts
- Discover which genres appear together frequently
- Study manuscript compilation patterns

#### 3. Institution Networks

**Purpose:** Show which monastic institutions produced or preserved which genres/subgenres

**Network Structure:**
- **Institutions:** Connected to the genres/subgenres they produced or preserved
- **Node size:** Reflects activity level (larger = more texts or greater genre diversity)
- **Edges:** Show institutional connections to specific genres/subgenres

**Mode Controls:**
- **Genres / Subgenres Toggle:** Switch between viewing broad genre categories or granular subgenres
- **Horizontal / Radial Toggle:** Change network layout style

**Visualizations:**
- Bipartite network connecting institutions to genres/subgenres
- Bridge nodes indicate institutions with diverse genre production or genres produced across many institutions
- Hub nodes indicate major centers of production or widely produced genres
- Network statistics displayed

**Interactive Controls:**
- Zoom In / Zoom Out buttons
- Reset View button
- Hide Labels toggle
- Hide Singles toggle
- Export button for PNG export
- Embed button for full-screen view

**Use this to:**
- Identify institutional specializations in specific genres/subgenres
- Find which monasteries produced particular text types
- Map institutional patterns in genre production
- Compare genre diversity across institutions
- Discover connections between monastic orders and textual preferences

#### 4. Scribe Networks

**Purpose:** Show which scribes actively copied which genres/subgenres

**Network Structure:**
- **Left side (green):** Scribes
- **Right side (colored by category):** Genres or subgenres
- **Edges:** Show which scribes copied which genres/subgenres (connections indicate active copying)

**Mode Controls:**
- **Genres / Subgenres Toggle:** Switch between viewing broad genre categories or granular subgenres
- **Horizontal / Radial Toggle:** Change network layout style

**Visualizations:**
- Bipartite network with scribes on left, genres/subgenres on right
- Bridge nodes reveal "knowledge brokers" (scribes with diverse repertoires connecting different genres)
- Hub nodes show specialist scribes or popular genres
- Distinguishes generalists (scribes working across many genres) from specialists (focused on few genres)

**Interactive Controls:**
- Zoom In / Zoom Out buttons
- Reset View button
- Hide Labels toggle
- Hide Singles toggle
- Export button for PNG export
- Embed button for full-screen view

**Use this to:**
- Find scribes specialized in particular genres
- Identify versatile scribes working across multiple genres (knowledge brokers)
- Discover which genres were most commonly copied
- Study scribal specialization vs. generalist patterns
- Map relationships between individual scribes and text types

#### 5. Distributions

**Purpose:** Statistical summaries of genre distributions across institutions, locations, and time periods

**Three Information Panels:**

**1. Genres by Institution (Top 10)**
- Lists top 10 institutions by text count
- Shows total texts and genre count for each institution
- Reveals which institutions had the most textual activity

**2. Genres by Location (Top 10)**
- Lists top 10 countries by text count
- Shows total texts and genre count for each country
- Reveals geographic concentrations of text production

**3. Genre Popularity Over Time**
- Placeholder: "Timeline visualization coming soon"
- Not yet implemented

**Use this to:**
- Identify which institutions had the most diverse genre collections
- Compare genre activity across different countries
- See concentrations of textual production by institution and location

**Note:** This tab provides simple statistical summaries (not interactive visualizations). For data export of distributions, use the **Browse All** mode to filter by genre and export CSV.

### Layout Options (Tabs 2, 3, 4)

The network tabs (Manuscript Networks, Institution Networks, Scribe Networks) offer two layout styles:

#### Horizontal Bipartite Layout
- **Structure:** Two columns with entities on left, genres/subgenres on right
- **Advantages:** Clear visual separation, easy to trace individual connections
- **Best for:** Detailed analysis of specific connections and patterns

#### Radial Layout
- **Structure:** Entities arranged in circle with genres/subgenres radiating from center
- **Advantages:** Compact visualization, emphasizes clustering and hub-and-spoke patterns
- **Best for:** Overview of network structure and identifying central genres

### Understanding Network Patterns

**Bridge Nodes (marked with red outline):** Entities connecting many different genres, or genres appearing across many entities—these are "knowledge brokers" or widely distributed texts

**Hub Nodes (marked with orange outline + glow):** Major hubs with 2x the average number of connections—indicates prolific scribes, major institutions, or extremely popular genres

**Dense Connections:** Genres connected to many entities indicate widespread production or copying

**Isolated Nodes:** Rare genres or specialized scribes/institutions

**Clusters:** Groups of entities sharing similar genre interests

### Exporting Data & Visualizations

**Network Visualizations (Tabs 2, 3, 4):**
- Click the **📷 Export** button in the top-right corner of any network visualization
- Exports current view as a PNG file with filename matching the network type
- Export preserves current zoom level, visible labels, and filtered view
- Suitable for inclusion in publications and presentations

**Distribution Data (Tab 5):**
- Tab 5 shows simple lists (no export button)
- To export genre distribution data as CSV: use **Browse All** mode → filter by genre → click **Download CSV**

**General Data Export:**
- For comprehensive genre data: go to **Browse All** mode
- Use filters to select specific texts, genres, or entities
- Click **Download CSV** to export filtered results

### General Tips

**Start with Overview:** Tab 1 provides orientation—see which genres are most common before exploring networks

**Use Mode Toggles:** Switch between "Genres" (broad categories) and "Subgenres" (granular classifications) to adjust detail level

**Try Both Layouts:** Horizontal layout shows clear two-column structure; Radial layout reveals clustering patterns

**Look for Bridges:** Bridge nodes (red outline) are key—they connect different parts of the network and reveal versatile manuscripts, institutions, or scribes

**Hide Singles for Clarity:** If the network is cluttered, click "Hide Singles" to remove nodes with only one connection

**Combine with Other Modes:** Use Text Genres networks to identify patterns, then switch to **Browse All** to see detailed records

### Research Questions Addressed

- Which genres were most widely produced across the collection?
- Did certain institutions specialize in particular genres or subgenres?
- Which scribes worked across multiple genres vs. specializing in one or two?
- How diverse were individual manuscripts in genre content?
- What genre combinations frequently appear together in manuscripts?
- Which subgenres characterize specific monastic scriptoria?
- Are there regional or institutional patterns in genre production?
- Who were the "knowledge brokers" (scribes or institutions working across many genres)?

</details>

---

<details markdown="1" id="10-colophon-analysis">
<summary><strong>10. Colophon Analysis</strong></summary>

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
- **Visualizations:** All charts can be exported as high-resolution PNG images (300 DPI)
- **Filtered Results:** Export through main Browse mode for CSV

#### 6. Explore Formulae Tab

**Purpose:** Discover and analyze standardized formulaic patterns in colophons across languages and regions

**What are Colophon Formulae?**

Standardized phrases, expressions, and linguistic patterns that scribes commonly used in their colophons. These recurring formulas reveal:
- Traditional scribal practices and conventions
- Regional and linguistic patterns
- Cross-cultural influences and transmission of scribal culture
- Common themes in medieval self-expression

Formulae can be complete phrases ("Qui scripsit scribat semper cum Domino vivat") or shorter fragments ("anno domini", "finito libro").

**Features:**
- Pattern detection across all colophons
- Frequency analysis of common formulae
- Identification of Latin vs. vernacular patterns
- Regional distribution of specific formulae
- Examples of each formula in context

**Use this to:**
- Identify standardized scribal conventions
- Study the transmission of formulaic expressions
- Compare Latin and vernacular formulaic traditions
- Find regional variations in scribal self-presentation

#### 7. Browse Colophons Tab

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
- **Visualizations:** All charts can be exported as high-resolution PNG images (300 DPI)
- **Filtered Results:** Export through main Browse mode for CSV

</details>

---

<details markdown="1" id="11-iiif-viewer--mirador">
<summary><strong>11. IIIF Viewer & Mirador</strong></summary>

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

</details>

---

<details markdown="1" id="12-search-transcriptions">
<summary><strong>12. Search Transcriptions</strong></summary>

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

</details>

---

<details markdown="1" id="13-tips--tricks">
<summary><strong>13. Tips & Tricks</strong></summary>

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

</details>

---

<details markdown="1" id="14-frequently-asked-questions">
<summary><strong>14. Frequently Asked Questions</strong></summary>

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

**Q: What's the difference between Scribes Mode and the Network Explorer?**
A: Scribes Mode focuses specifically on scribal networks and statistics. It shows scribe-scribe connections (scribes who worked together or in the same monasteries) and provides detailed statistics about scribal productivity, collaboration patterns, and institutional affiliations. The Network Explorer is more general-purpose and allows you to build custom networks between any entity types.

**Q: How do the Text Genres networks work?**
A: The Text Genres module visualizes relationships between manuscripts, institutions, scribes, and text genres through three different bipartite networks. You can see which manuscripts contain which genres, which institutions specialized in which subgenres, and which scribes copied which genres. Each network is interactive with zoom, pan, filtering, and export capabilities.

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
*Last updated: February 2026*  
*Estelle Guéville, Yale University*

</details>
