---
layout: page
permalink: /userguide/
show_title: false
banner:
  image: "BnFfrançais603_81v.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---


# *Unknown Hands* - User Guide

**Welcome to *Unknown Hands*!** This guide will help you explore and analyze our database of pre-modern female scribal production. Whether you're a researcher, student, or simply curious about medieval manuscripts, this manual will show you how to get the most out of our interactive platform.

---

## Quick Start Guide

**New to *Unknown Hands*?** Start here for a 5-minute introduction to the platform.

### What You'll Find Here

*Unknown Hands* documents the work of **female scribes before 1600**, bringing together manuscripts, scribes, institutions, texts, and production contexts into a rich, interconnected database with powerful analytical tools.

### Your First Steps

**1. Browse the Data (Start Here!)**
- Click **[Explore Database](/unknownhands/explore-database/)** in the top navigation
- You'll land in **Browse & Search** mode showing all Scribal Units
- Try clicking on a record card to see detailed information
- Use the **entity switcher** (top left) to explore Manuscripts, Scribes, or other record types

**2. Try These Key Features**
- **Search:** Use the search box at the top to find specific manuscripts, scribes, or locations
- **Overview:** Use **Summary**, **Map**, and **Network** to explore the corpus from three general perspectives
- **Chatbot:** Use the [AI Chatbot](/unknownhands/chatbot/) for natural-language questions about colophons and thematic patterns

**3. Specialized Analysis Modes**

Once you're comfortable browsing, try these advanced features:
- **Scribes Mode** — Deep dive into scribe productivity, collaborations, and geographic distribution
- **Multilingualism** — Analyze manuscripts produced in multiple languages
- **Textual Genres** — Explore what kinds of texts female scribes were copying
- **Colophons** — Study scribal colophons (signatures) in detail

### Tips for Success

- **Start broad, then filter:** Begin by browsing all records, then narrow down using filters on the left
- **Export your findings:** Every visualization has its own export control; PNG is standard, with SVG or data formats available where applicable
- **Check the detail panel:** Click any record to see full information in the right panel
- **Use the entity switcher:** Different perspectives (manuscripts vs. scribes vs. institutions) reveal different insights
- **Share a specific view:** The page URL updates as you change modes and subtabs, so you can bookmark or copy a link to the exact view
- **On smaller screens:** Swipe or horizontally scroll the tab row to reach additional modes and subtabs

### Common Explore Behavior

- **Stable navigation:** The primary tabs are Browse & Search, Overview, Manuscript Structure, Scribes, Multilingualism, Colophons, and Textual Genres. Overview contains Summary, Map, and Network as secondary views.
- **Remembered subtabs:** When you return to a research module, its most recently selected subtab is restored.
- **Shareable views:** Primary modes and subtabs are reflected in the URL. Copy the current address to link directly to the same view.
- **Accessible tabs:** Tab controls expose their selected state, support keyboard focus, and remain reachable on narrower screens through wrapping or horizontal scrolling.
- **Known-data visualizations:** Categories labelled Unknown or TBC are omitted from charts, maps, networks, and other visual summaries. They may still remain available as source records in Browse & Search.
- **Accurate proportions:** Horizontal bars show each category's percentage of the relevant known total. The largest category is not automatically presented as 100% unless it genuinely represents the entire total.
- **Local exports:** Export buttons belong to individual visualization cards. There is no single export button for an entire module page, and the button itself is hidden from the downloaded image.
- **Responsive cards:** Charts use the full available content width when that improves readability; summary cards share the same centered dimensions and visual treatment.
- **Paginated results:** Large result-oriented tabs show manageable pages with Previous and Next controls rather than rendering every record at once.

### Using This Guide

- **Full documentation:** Read the detailed sections below for comprehensive guides to each feature
- **Questions?** Check the [FAQ](#15-frequently-asked-questions) section at the bottom

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Browse & Search](#2-browse--search)
3. [Overview: Summary](#3-analytics-tools)
4. [Overview: Map](#4-map-visualizations)
5. [Manuscript Structure](#5-hierarchical-tree-explorer)
6. [Overview: Network](#6-network-explorer)
7. [Scribes Mode](#7-scribes-mode)
8. [Multilingualism Analysis](#8-multilingualism-analysis)
9. [Textual Genres](#9-text-genres-network-analysis)
10. [Colophons](#10-colophon-analysis)
11. [IIIF Viewer & Mirador](#11-iiif-viewer--mirador)
12. [Search Transcriptions](#12-search-transcriptions)
13. [Semantic RAG Chatbot](#13-semantic-rag-chatbot)
14. [Tips & Tricks](#14-tips--tricks)
15. [FAQ](#15-frequently-asked-questions)

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
- **About** — Project background and the team.
- **Explore** — The public data page and project roadmap.
- **Resources** — Publications and bibliography.
- **Contact** — Participation and contact information.

The research interfaces documented below are under active development and are therefore not currently listed in the public menu.

</details>

---

<details markdown="1" id="2-browse--search">
<summary><strong>2. Browse & Search</strong></summary>

### Accessing Browse Mode

1. Open the **Explore the Database** research interface directly; it is not currently listed in the public navigation
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

### Advanced Search

Use **Advanced Search** when you want to combine information from more than one part of the database. Standard filters are useful for narrowing the record type you are currently browsing; Advanced Search can cross-reference connected entities at the same time.

**How Advanced Search Works:**
1. Click **Advanced Search** above the results list
2. Choose what kind of records you want to return, such as Scribal Units, Manuscripts, Production Units, Historical People, or Texts
3. Choose whether the search should match **all conditions** or **any condition**
4. Add one or more condition rows
5. For each condition, choose:
   - The entity type to search
   - The field to search
   - The operator, such as contains, equals, is present, date before, date after, or date between
   - The value to search for
6. Click **Apply advanced search**

**Controlled Vocabularies:**
- Fields with controlled vocabularies show existing values in a dropdown, so you can choose a value that is actually present in the data.
- This applies to Heurist term fields, linked record fields, and short enumerated value sets.
- Open fields such as comments, transcriptions, translations, URLs, identifiers, and date fields remain free text.

**Example Query:**
To find scribal units written in a particular script and connected to production units with specific codicological features:
1. Set **Return** to **Scribal Units**
2. Add condition: **Scribal Units** → **Script(s)** → **contains** → choose the script value
3. Add condition: **Production Units** → **Material** → **equals** → choose the material value
4. Add condition: **Production Units** → **Catchwords** → **equals** or **is present**
5. Set **Match** to **all conditions**
6. Click **Apply advanced search**

**Clearing Advanced Search:**
- Click **Clear advanced search** to remove advanced conditions while keeping the rest of the Browse page available.
- Click **Clear all filters** to reset the standard filters, search box, sorting, and active advanced search.

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
<summary><strong>3. Overview: Summary</strong></summary>

### Accessing the Summary

1. In **Explore Database**, click **Overview**, then **Summary**
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
- **Export:** Each statistical visualization has its own Export PNG button

**Use Cases:**
- Understanding corpus composition
- Identifying geotemporal patterns
- Finding gaps in the data
- Dataset completeness analysis
- Identifying trends across entity types

</details>

---

<details markdown="1" id="4-map-visualizations">
<summary><strong>4. Overview: Map</strong></summary>

### Accessing Map Mode

1. In **Explore Database**, click **Overview**, then **Map**
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

**Export PNG:**
1. Click **"Export PNG"** in the map controls
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
<summary><strong>5. Manuscript Structure</strong></summary>

### Accessing Manuscript Structure

1. In **Explore Database**, click **Manuscript Structure** in the top navigation
2. Choose **Structure Explorer**, **Materials & Format**, **Quire Construction**, **Page Layout**, or **Production Practices**

### What is Manuscript Structure?

Explore the complete structural hierarchy of manuscripts, showing relationships between:
- **Manuscripts** (top level)
- **Production Units** (sections of manuscripts)
- **Scribal Units** (individual scribes' work)

This visualization reveals the complex internal structure of medieval manuscripts and how scribes collaborated.

The other subtabs provide live codicological analyses calculated from the same
JSON exports used by Browse & Search:

- **Materials & Format** separates Production-Unit material observations from Manuscript-level page dimensions and includes colophons and subgenres by material.
- **Quire Construction** retains the controlled quire vocabulary, treating mixed or multi-valued classifications as **Varia**, and compares quire types by century, country, and subgenre.
- **Page Layout** keeps Manuscript-level page dimensions distinct from Production-Unit-level justification measurements. When one Manuscript contains several Production Units, its page size intentionally recurs in each relevant Production-Unit comparison.
- **Production Practices** reports ruling, catchwords, and signatures. Presence rates use only explicit TRUE/FALSE observations and show coverage separately.

All codicological charts exclude unknown and TBC values. Uncertain normalized
dates and places contribute once to every plausible century or country. Each
visualization has its own PNG export control. Collaboration and
collaboration-sequence analysis remain under **Scribes → Collaborations**, with
a cross-link from Production Practices.

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

**Export PNG or SVG:**
- Use the **Export PNG** or **Export SVG** button on an individual manuscript tree
- Exports that manuscript's current tree view
- Suitable for publications and presentations

</details>

---

<details markdown="1" id="6-network-explorer">
<summary><strong>6. Overview: Network</strong></summary>

### Accessing Network Mode

1. In **Explore Database**, click **Overview**, then **Network**
2. Network visualization loads with search interface

### Three Network Views

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

3. **Reproducible Connected Sample**
   - Displays a connected sample of up to 100 entities
   - Uses a deterministic seed stored in the page URL
   - Opening the same URL reproduces the same sample, provided the underlying data export has not changed

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
- **Export SVG** — Vector format, infinitely scalable, ideal for academic publications
- **Export PNG** — High-resolution raster, suitable for presentations

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
- Click "Export CSV" to download the full dataset
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
- Downloads that visualization as a high-resolution image
- Suitable for publications, presentations, and reports

**Chart Layout and Scaling:**
- Productivity and geography distributions use full-width cards to provide additional drawing space for highly skewed data
- Bar lengths remain proportional to the known total; the widest bar is not normalized to 100% unless its value is the full total
- Export controls stay in the upper-right corner of each visualization card

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

**Visualization Exports:**
- The Overview charts for language, geography, time, and religious-order patterns each have an Export PNG button
- The Colophon-Text Divergence pattern visualization has its own Export PNG button
- Record-oriented manuscript, scribe, institution, and divergence lists are paginated rather than treated as images

**Data Export Options:**

**1. Export via Browse & Search:**
- Switch to **Browse & Search**
- Use filters to select:
  - Manuscripts by language
  - Scribes by language
  - Institutions by language
- Click **Export CSV** to export filtered results with language data

**2. Export Colophon Data:**
- In Browse & Search, filter to records with colophon language values
- Export as CSV to analyze colophon-text relationships in external tools

**3. Record-Level Investigation:**
- Use "View SU" or "View MS" buttons to jump to specific records
- Export individual records or filtered collections from Browse & Search

**4. Statistical Analysis:**
- Export the relevant Overview visualization as PNG
- Use Browse & Search CSV exports when you need the underlying records and values

**For Publications:**
- Export individual Multilingualism visualizations as PNG
- Export underlying data via Browse & Search for statistical analysis
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
<summary><strong>9. Textual Genres</strong></summary>

### Accessing Textual Genres

1. In **Explore Database**, click **Textual Genres** in the top navigation
2. View loads showing the tab selector
3. Select a tab to explore different aspects of text genre patterns

### What can you explore in Textual Genres?

Textual Genres reveals how texts of different subgenres circulated through manuscripts, institutions, and scribes. The module consistently uses subgenres because broad genre totals are dominated by religious texts and conceal much of the corpus's meaningful variation.

### Five Analysis Tabs

#### 1. Overview

**Purpose:** Get a comprehensive snapshot of text subgenre distribution in the database

**Statistics Provided:**
- **Total Texts:** Number of text records in the database
- **Texts with Known Subgenre:** Number of text records included in subgenre analysis
- **Unique Subgenres:** Count of specific subgenre classifications

**Visualizations:**
- **Top Subgenres by Text Count:** Color-coded proportional bars showing the 15 most common subgenres
- **Analysis Approaches:** Four info cards explaining the purpose of each network tab

**Use this to:** 
- Understand the overall composition of texts and subgenres in the database
- See which subgenres are most represented
- Choose which analysis approach to explore next

#### 2. Manuscript Networks

**Purpose:** Show which manuscripts contain which genres or subgenres through bipartite network visualization

**Network Structure:**
- **Left side (blue circles):** Manuscripts
- **Right side (colored rectangles):** Genres or subgenres (colored by category)
- **Edges:** Connections showing which manuscripts contain which genres or subgenres (thickness indicates frequency)

**Mode and Layout Controls:**
- **Genres / Subgenres:** Switch between broad categories and detailed subgenres
- **Horizontal / Radial Toggle:** Change network layout style

**Visualizations:**
- Bipartite network with manuscripts on the left and genres or subgenres on the right
- Bridge nodes (manuscripts connecting many different categories, or categories appearing in many manuscripts)
- Hub nodes (major hubs with 2x average connections)
- Network statistics displayed: manuscript count, genre or subgenre count, bridge count, hub count

**Interactive Controls:**
- Zoom In / Zoom Out buttons
- Reset View button
- Hide Labels toggle
- Hide Singles toggle (remove nodes with only one connection)
- Export button for PNG export
- Embed button for full-screen view

**Use this to:**
- Find all manuscripts containing a specific subgenre
- Identify manuscripts with diverse subgenre content (bridge manuscripts)
- See subgenre co-occurrence patterns across manuscripts
- Discover which subgenres appear together frequently
- Study manuscript compilation patterns

#### 3. Institution Networks

**Purpose:** Show which monastic institutions produced or preserved which genres or subgenres

**Network Structure:**
- **Institutions:** Connected to the genres or subgenres they produced or preserved
- **Node size:** Reflects activity level (larger = more texts or greater category diversity)
- **Edges:** Show institutional connections to specific genres or subgenres

**Mode and Layout Controls:**
- **Genres / Subgenres:** Switch between broad categories and detailed subgenres
- **Horizontal / Radial Toggle:** Change network layout style

**Visualizations:**
- Bipartite network connecting institutions to subgenres
- Bridge nodes indicate institutions with diverse subgenre production or subgenres produced across many institutions
- Hub nodes indicate major centers of production or widely produced subgenres
- Network statistics displayed

**Interactive Controls:**
- Zoom In / Zoom Out buttons
- Reset View button
- Hide Labels toggle
- Hide Singles toggle
- Export button for PNG export
- Embed button for full-screen view

**Use this to:**
- Identify institutional specializations in specific subgenres
- Find which monasteries produced particular text types
- Map institutional patterns in subgenre production
- Compare subgenre diversity across institutions
- Discover connections between monastic orders and textual preferences

#### 4. Scribe Networks

**Purpose:** Show which scribes actively copied which genres or subgenres

**Network Structure:**
- **Left side (green):** Scribes
- **Right side (colored by category):** Genres or subgenres
- **Edges:** Show which scribes copied which genres or subgenres (connections indicate active copying)

**Mode and Layout Controls:**
- **Genres / Subgenres:** Switch between broad categories and detailed subgenres
- **Horizontal / Radial Toggle:** Change network layout style

**Visualizations:**
- Bipartite network with scribes on the left and genres or subgenres on the right
- Bridge nodes reveal "knowledge brokers" (scribes with diverse repertoires connecting different categories)
- Hub nodes show specialist scribes or popular genres/subgenres
- Distinguishes generalists from specialists at either classification level

**Interactive Controls:**
- Zoom In / Zoom Out buttons
- Reset View button
- Hide Labels toggle
- Hide Singles toggle
- Export button for PNG export
- Embed button for full-screen view

**Use this to:**
- Find scribes specialized in particular subgenres
- Identify versatile scribes working across multiple subgenres (knowledge brokers)
- Discover which subgenres were most commonly copied
- Study scribal specialization vs. generalist patterns
- Map relationships between individual scribes and text types

#### 5. Distributions

**Purpose:** Statistical summaries of subgenre distributions across institutions, locations, and time periods

**Three Information Panels:**

**1. Subgenres by Institution (Top 10)**
- Bar length shows each institution's share of all known text–institution assignments with a subgenre
- Colored segments divide that bar proportionally among the institution's constituent subgenres
- Labels report the assignment count, percentage, and number of subgenres; the six leading subgenres are identified beneath each institution

**2. Subgenres by Location (Top 10)**
- Bar length shows each country's share of all known text–country assignments with a subgenre, while colored segments show its proportional subgenre composition
- Unknown places are excluded; uncertain places contribute to every stated country
- Labels report the assignment count, percentage, subgenre diversity, and leading subgenres

**3. Subgenre Popularity Over Time**
- Heatmap showing every known subgenre from the 8th through 16th centuries
- Rows are subgenres and columns are centuries; each cell gives both the assignment count and its percentage of that century's known assignments
- Darker cells indicate a larger within-century share, and sample sizes remain visible in the century headings
- Uncertain date ranges contribute once to every plausible century
- The scrollable table can be downloaded with its **Export PNG** button

**Use this to:**
- Identify which institutions had the most diverse genre collections
- Compare genre activity across different countries
- See concentrations of textual production by institution and location
- Compare changes in subgenre representation while retaining century-level sample sizes

**Unit of analysis:** These distributions use distinct text–production-unit assignments with known structured metadata. Unknown subgenre, place, institution, and date values are excluded from the relevant denominator.

### Layout Options (Tabs 2, 3, 4)

The network tabs (Manuscript Networks, Institution Networks, Scribe Networks) offer two layout styles:

#### Horizontal Bipartite Layout
- **Structure:** Two columns with entities on left and subgenres on right
- **Advantages:** Clear visual separation, easy to trace individual connections
- **Best for:** Detailed analysis of specific connections and patterns

#### Radial Layout
- **Structure:** Entities arranged in a circle with subgenres radiating from the center
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
- Click **Export PNG** in the controls for the network visualization
- Exports current view as a PNG file with filename matching the network type
- Export preserves current zoom level, visible labels, and filtered view
- Suitable for inclusion in publications and presentations

**Distribution Data (Tab 5):**
- The institution and location distribution visualizations each have their own Export PNG button
- To export the underlying genre records as CSV, use **Browse & Search**, filter by genre, and click **Export CSV**

**General Data Export:**
- For comprehensive genre data: go to **Browse All** mode
- Use filters to select specific texts, genres, or entities
- Click **Export CSV** to export filtered results

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
<summary><strong>10. Colophons</strong></summary>

### Accessing Colophons

1. In **Explore Database**, click **Colophons** in the top navigation
2. The Colophons interface loads

### What is a Colophon?

A colophon is a note written by the scribe, typically at the end of a manuscript section, providing information about:
- The copying process
- The scribe's name and identity
- The date of completion
- Requests for prayers
- Expressions of emotion (fatigue, pride, humility)
- Dedication to patrons

Colophons are invaluable for understanding medieval scribal culture and self-expression.

### Four Colophon Views

The current navigation is **Overview & Method**, **Browse & Read**, **Formulae**, and **Contexts**.

#### Overview & Method

This view documents corpus coverage before presenting distributions. It distinguishes scribal units flagged with colophons from readable colophon instances, reports transcription and translation availability, identifies records containing multiple instances, and explains exclusions.

The scribal-unit record is the canonical source. Repeated transcription and translation fields are displayed as separate numbered colophon instances. Linked production units supply geographic and institutional context only. Flagged units without readable text remain in coverage statistics but are not treated as readable colophons.

#### Browse & Read

This evidence-first view provides filters for language, century, production country, institution, and text search. Each transcription, translation, and available source note is displayed with a link to its source scribal-unit record. Multiple colophons recorded in one scribal unit are shown separately.

#### Formulae

This view currently retains the existing original-language formula search and displays matched passages in context. Its classification and visualization design will be revised separately.

#### Contexts

This view is limited to structured catalogue data:

- Colophon prevalence by century
- Colophon prevalence by production country
- Known colophon-language composition by century

Prevalence is calculated as scribal units flagged with colophons divided by all scribal units with the same known context. Language composition uses readable instances with a known language and century. Unknown and TBC categories are excluded, and counts and denominators are displayed.

The module does not calculate sentiment, rhetorical character, first-person expression, questions, exclamations, sentence length, or translation-based colophon length.


</details>

---

<details markdown="1" id="11-iiif-viewer--mirador">
<summary><strong>11. IIIF Viewer & Mirador</strong></summary>

### What is the IIIF Viewer?

View high-resolution manuscript images with synchronized transcriptions. Uses **Mirador 3**, a powerful IIIF viewer, with line-level annotations generated from ALTO exports when transcriptions are available.

### Accessing the Viewer

**Two ways:**

1. **Direct navigation:**
   - Open the IIIF Viewer directly; it is not currently listed in the public navigation
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
- Transcriptions are generated from ALTO HTR exports and linked to IIIF canvases through local annotation files

**Synchronization:**
- Click a line of transcription
- Corresponding area highlights on image
- Or vice versa: click image region to see transcription

**Features:**
- Toggle transcriptions on/off
- Use **Show regions** to inspect ALTO line regions on the manuscript image
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

Open the transcription search directly. This development tool is not currently listed in the public navigation.

### How It Works

**Full-Text Search:**
- Searches all manuscripts that have been converted from ALTO into local IIIF annotation pages
- Finds words and phrases
- Fuzzy matching for variant spellings
- Current corpus: 131 manuscript search chunks and 2,278,894 searchable transcription lines

The search index is split by manuscript, so the page loads a small metadata index first and then fetches only the manuscript chunks needed for a search or filter.

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

<details markdown="1" id="13-semantic-rag-chatbot">
<summary><strong>13. Semantic RAG Chatbot</strong></summary>

### Accessing the Chatbot

Click **[AI Chatbot](/unknownhands/chatbot/)** to ask natural-language questions about the *Unknown Hands* colophon corpus.

### What the Chatbot Is For

The chatbot is designed for semantic and interpretive questions, especially questions about themes, formulas, language, and patterns in colophons.

Good examples include:
- "How do female scribes express humility?"
- "What kinds of prayer requests appear in the colophons?"
- "Do scribes writing on paper use different language from those writing on parchment?"
- "Summarize how scribes describe labor, obedience, or sin."

### How It Works

The chatbot uses **Retrieval-Augmented Generation (RAG)**. Instead of asking a language model to answer from general knowledge, the system first searches a prepared corpus of enriched *Unknown Hands* colophon records. These records include colophon transcriptions, translations, and related metadata drawn from manuscripts, scribal units, production units, people, texts, and institutions.

When you ask a question:
1. Your question is converted into a vector representation
2. The system retrieves the most semantically relevant colophon records, currently up to 30 records per question
3. The language model receives only those retrieved contexts
4. The response is generated from that evidence and includes referenced manuscript/source badges where available

The public website sends the question to a secure Netlify backend before it reaches Gemini. This means the Gemini API key is not exposed in the browser.

### What It Can Do Well

- Summarize themes across colophons
- Compare language and formulae across groups of records
- Connect colophon language with metadata such as date, material, institution, or scribal role when that context is present in the embedded data
- Help generate exploratory research questions for follow-up in Browse, Advanced Search, or CSV exports

### Limits and Verification

- The chatbot is **semantic**, not exhaustive. It is not the best tool for exact counts.
- The embedding corpus is static. If the database has recently changed, the chatbot may need its embeddings regenerated before it reflects the newest data.
- The chatbot may miss relevant records if they are phrased very differently from the question or fall outside the retrieved context window.
- AI-generated conclusions may contain errors or overgeneralizations.
- Always verify important claims against the referenced manuscripts, Browse records, colophon transcriptions, and exported data.

### When to Use Another Tool

- Use **Browse & Search** or **Advanced Search** for exact filtering and cross-entity queries.
- Use **Export CSV** for quantitative analysis.
- Use **Search Transcriptions** for exact word or phrase searches in manuscript transcriptions.
- Use the chatbot for exploratory synthesis, thematic comparison, and interpretive leads.

</details>

---

<details markdown="1" id="14-tips--tricks">
<summary><strong>14. Tips & Tricks</strong></summary>

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
- Primary and secondary tab rows wrap or scroll horizontally when needed
- Visualization grids collapse to one column, export controls remain attached to their cards, and proportion labels use compact responsive sizing
- Dense maps and networks remain easiest to inspect on a larger screen


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

**Visualization-Specific Exports:**
Every visualization provides its own export control. Export the chart, map, network, or tree you need rather than capturing an entire module page. Export controls are hidden while the image is generated.

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
   - Click **"Export PNG"** on the individual statistical visualization
   - Captures only that visualization card

3. **Hierarchical Tree:**
   - Click **PNG** or **SVG** on the individual manuscript tree
   - Captures that manuscript's tree structure

4. **Network Visualization:**
   - **SVG export:** Click **"Export SVG"** (vector format, infinitely scalable)
   - **PNG export:** Click **"Export PNG"** (raster format, 300 DPI)
   - Filename: `unknownhands-network-{timestamp}.{svg|png}`
   - **Additional:** Data export dropdown for Gephi or R formats

5. **Thematic Modules:**
   - Scribes, Multilingualism, Colophons, and Textual Genres place an **Export PNG** button inside every visualization card
   - Heavily skewed bar charts use full-width cards while preserving true total-based proportions
   - Record lists use CSV export where provided rather than image export

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

<details markdown="1" id="15-frequently-asked-questions">
<summary><strong>15. Frequently Asked Questions</strong></summary>

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

**Q: Does the Colophons module perform sentiment or rhetorical analysis?**
A: No. Translation-dependent expression, punctuation, sentence-length, and sentiment measurements were removed because they could reflect translation and editorial practice rather than the historical text. Use Browse & Read to inspect the primary evidence.

**Q: What is counted as a colophon?**
A: The scribal-unit record is the canonical source. Repeated transcription or translation fields are represented as separate readable colophon instances. Production-unit fields provide context but are not counted as a second colophon source.

**Q: How do the Text Genres networks work?**
A: The Text Genres module visualizes relationships between manuscripts, institutions, scribes, and text genres through three different bipartite networks. You can see which manuscripts contain which genres, which institutions specialized in which subgenres, and which scribes copied which genres. Each network is interactive with zoom, pan, filtering, and export capabilities.

**Q: How do I export a visualization for my publication?**
A: Click the "Export" button on any visualization. It will download as a high-quality PNG (300 DPI) suitable for publication. Available for maps, timelines, networks, and all analytics charts. Please cite appropriately.

**Q: Can I see the raw colophon text?**
A: Yes. Use the Colophons module's **Browse & Read** tab. Each colophon shows the available original transcription and English translation, with copy-to-clipboard controls.

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

*Unknown Hands User Guide v3.0*
*Last updated: August 2026*
*Estelle Guéville, Yale University*

</details>
