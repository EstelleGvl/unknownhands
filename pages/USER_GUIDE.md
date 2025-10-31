---
layout: page
permalink: /userguide/
show_title: false
---


# 📖 Unknown Hands — User Guide

**Welcome to Unknown Hands!** This guide will help you explore and analyze our database of pre-modern female scribal production. Whether you're a researcher, student, or simply curious about medieval manuscripts, this manual will show you how to get the most out of our interactive platform.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Browse & Search](#2-browse--search)
3. [Map Visualizations](#3-map-visualizations)
4. [Timeline Analysis](#4-timeline-analysis)
5. [Network Explorer](#5-network-explorer)
6. [Analytics Tools](#6-analytics-tools)
7. [IIIF Viewer](#7-iiif-viewer)
8. [Search Transcriptions](#8-search-transcriptions)
9. [Tips & Tricks](#9-tips--tricks)
10. [FAQ](#10-frequently-asked-questions)

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

### Pagination

**Bottom of record list:**
- **Previous / Next** buttons
- Page numbers
- Shows records per page (default: 20)

---

## 3. Map Visualizations

### Accessing Map Mode

1. In **Explore Database**, click **Map** tab (top navigation)
2. Map loads showing manuscript locations

### Changing Map Views

**Map View Selector** (top of map):

**8 Different Views:**

1. **Manuscripts - Current Location**
   - Where manuscripts are held today
   - Shows holding institutions
   - Use to find MSS near you

2. **Manuscripts - Production Location**
   - Where manuscripts were created
   - Historical geography
   - See production centers

3. **Production Units - All Locations**
   - All PU geographic data
   - Country, city, monastery

4. **Production Units - By Monastery**
   - Groups PUs by monastic institution
   - See which monasteries were productive

5. **Monastic Institutions**
   - All monasteries and convents
   - Historical religious centers

6. **Holding Institutions**
   - Libraries, archives, museums
   - Plan research trips

7. **Historical People**
   - Locations associated with scribes/patrons
   - Where known, residence or activity location

8. **Combined View**
   - All entity types on one map
   - Color-coded by type
   - Overview of entire database

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

### Exporting Map Data

While viewing map:
1. Click **"Export CSV"** (if available)
2. Downloads records currently visible on map
3. Includes coordinates

---

## 4. Timeline Analysis

### Accessing Timeline Mode

1. Click **Timeline** tab in Explore Database
2. Timeline visualization loads

### Choosing Timeline Views

**Timeline View Selector:**

**4 Timeline Types:**

1. **Manuscripts Timeline**
   - Distribution of manuscripts by century
   - Based on dating in MS records

2. **Production Units Timeline**
   - When manuscripts were produced
   - More precise than MS dates
   - Uses terminus post quem and ante quem

3. **Scribal Units Timeline**
   - Scribal activity over time
   - Shows peak production periods

4. **Combined Timeline**
   - All dated records together
   - Color-coded by entity type
   - See overall temporal patterns

### Reading the Timeline

**Bar Chart:**
- **X-axis** — Centuries (e.g., 1200, 1300, 1400)
- **Y-axis** — Number of records
- **Bar height** — More records = taller bar
- **Colors** — Different entities (in combined view)

**Interactions:**
- **Hover over bar** — See exact count and century
- **Click bar** — Filters records to that century
- **Click again** — Deselects filter

### Analyzing Temporal Patterns

**Questions to explore:**
- Which centuries were most productive?
- Are there growth or decline periods?
- Do different regions have different peaks?
- How does script usage change over time?

**Combining with filters:**
1. Select timeline
2. Apply geographic or material filters (left panel)
3. See how patterns change
4. Example: "Timeline of parchment MSS in France"

### Exporting Timeline Data

- Click **"Export"** to download century counts
- Use for creating publication figures

---

## 5. Network Explorer

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

---

## 6. Analytics Tools

### Accessing Analytics Mode

1. Click **Analytics** tab
2. Choose an analysis module

### Three Analysis Modules

**1. Paleographic Analysis** — Script patterns  
**2. Gender Analysis** — Gender in scribal production  
**3. Codicological Analysis** — Material features (NEW)

---

### 6.1 Paleographic Analysis

**Purpose:** Analyze script types across time, geography, and gender

**How to Use:**

1. **Select Analysis Type:**
   - Script Distribution Over Time
   - Script vs. Geography
   - Script vs. Gender
   - Script Diversity by Region

2. **Choose Visualization:**
   - **Stats Table** — Mean, median, min, max
   - **Bar Chart** — Average values
   - **Heatmap** — Cross-tabulation
   - **Stacked Bar** — Proportions

3. **Click "Run Analysis"**

**Example Questions:**
- Which scripts were most common in the 14th century?
- Did female scribes use different scripts than male scribes?
- What scripts were popular in Italy vs. Germany?

---

### 6.2 Gender Analysis

**Purpose:** Examine gender patterns in manuscript production

**Analysis Types:**

1. **Gender Distribution**
   - How many records have female vs. male vs. unknown gender
   - Overall statistics

2. **Gender vs. Geography**
   - Where were female scribes active?
   - Regional gender patterns

3. **Gender vs. Script**
   - Did women use certain scripts more?
   - Script preferences by gender

4. **Gender Over Time**
   - Temporal patterns in female scribal production
   - When was female scribal activity highest?

**How to Use:**
1. Select analysis type
2. Choose visualization
3. Run analysis
4. Interpret results

**Visualizations:**
- **Bar charts** — Compare categories
- **Scatter plots** — Show correlations
- **Heatmaps** — Cross-tabulations (e.g., gender × region)

**Important Note:**
- Gender attributions based on historical evidence
- Certainty levels indicated when available
- "Unknown" = insufficient evidence

---

### 6.3 Codicological Analysis (NEW)

**Purpose:** Analyze physical manuscript features

**6 Analysis Types:**

#### 1. Material vs. Size
- Compare manuscript dimensions for parchment, paper, and mixed materials
- See geographic and temporal patterns
- **Question:** Were parchment MSS larger than paper MSS?

**How to Use:**
1. Select "Material vs Size"
2. Choose visualization:
   - **Stats** — Average sizes by material
   - **Box Plot** — Size distributions
   - **Scatter Plot** — Size vs. material (colored by century)
   - **Bar Chart** — Mean sizes
3. View geographic breakdown table (in Stats view)

#### 2. Size vs. Date
- Track manuscript size changes over time
- Grouped by century
- See if manuscripts got larger or smaller

**How to Use:**
1. Select "Size vs Date"
2. Choose visualization
3. See century patterns
4. Geographic filters affect results

**Question to explore:** Did manuscript sizes increase in the 15th century?

#### 3. Quire Patterns
- Analyze catchwords and signatures (quire markers)
- Correlate with size, date, material, geography

**What are catchwords/signatures?**
- Catchwords: First words of next page written at bottom
- Signatures: Letters/numbers marking quire order
- Both help binders assemble manuscripts correctly

**How to Use:**
1. Select "Quire Patterns"
2. Compare MSS with vs. without catchwords
3. See size differences
4. View temporal/geographic patterns

#### 4. Column Patterns
- Number of columns vs. manuscript features
- Single vs. multi-column layouts

**How to Use:**
1. Select "Column Patterns"
2. Analyze columns vs:
   - Size (larger MSS more columns?)
   - Date (column trends over time)
   - Material
   - Geography

#### 5. Margin Ratio
- **NEW CALCULATION:** Compares manuscript size to writing area
- Formula: (Codex size - Text block size) / Codex size × 100%
- Higher % = more margin space
- Size = height + width (sum of dimensions)

**What it shows:**
- How much space was left for margins
- Ratio of written vs. unwritten area
- Variation by material, date, location

**How to Use:**
1. Select "Margin Ratio"
2. View statistics (mean, median, range)
3. Compare by material or century
4. Scatter plots show correlations

**Interpretation:**
- High ratio (e.g., 40%) = large margins (luxury MSS?)
- Low ratio (e.g., 10%) = text filled page (utilitarian?)

#### 6. Custom Analysis
- Choose your own variables for X and Y axes
- Explore relationships not covered by preset analyses
- Advanced users can create custom queries

**How to Use:**
1. Select "Custom Multi-Variable Analysis"
2. Choose X-axis variable (dropdown)
3. Choose Y-axis variable (dropdown)
4. Select visualization type
5. Run analysis

**Variables include:**
- Size, height, width
- Material, date, country
- Columns, folios
- Text block dimensions
- And more...

---

### General Analytics Tips

**For All Analyses:**

1. **Read the data points count** — Shows how many records have the needed data
2. **Try different visualizations** — Each shows different aspects
3. **Use filters** — Narrow to specific time periods or regions
4. **Export results** — Some analyses allow CSV export
5. **Cross-reference** — Compare multiple analyses to find patterns

**Understanding Visualizations:**

**Stats Tables:**
- Mean = average
- Median = middle value
- Min/Max = range
- N = count of records

**Box Plots:**
- Box = middle 50% of values (Q1 to Q3)
- Line in box = median
- Whiskers = min/max (excluding outliers)
- Good for comparing distributions

**Scatter Plots:**
- Each dot = one record
- Position = X and Y values
- Color = third variable (e.g., century)
- Look for clusters, trends, outliers

**Heatmaps:**
- Color intensity = frequency or value
- Darker = more records or higher value
- Good for cross-tabulations

---

## 7. IIIF Viewer

### What is the IIIF Viewer?

View high-resolution manuscript images with synchronized transcriptions. Uses **Mirador 3**, a powerful IIIF viewer.

### Accessing the Viewer

**Two ways:**

1. **Direct navigation:**
   - Click "Viewer" in main navigation
   - Select manuscript from dropdown

2. **From database:**
   - Browse manuscripts
   - Click record with images
   - Click "View in IIIF Viewer" link

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

## 8. Search Transcriptions

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

### Exporting Search Results

- Click "Export" button
- Downloads CSV with all matching lines
- Use for text analysis projects

---

## 9. Tips & Tricks

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

---

## 10. Frequently Asked Questions

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
A: Currently, you can export results as CSV. Saved analysis workspaces are planned for future release.

**Q: Can I upload my own manuscripts?**
A: Not directly through the website. Contact the team if you have data to contribute.

**Q: Will there be more analysis types?**
A: Yes! We're continuously developing new analytical tools based on user feedback.

**Q: Can I compare two manuscripts side-by-side?**
A: In the Viewer, use split-screen mode. In Analytics, filter to your manuscripts and compare statistics.

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

*Unknown Hands User Guide v1.0*  
*Last updated: October 2025*  
*Estelle Guéville, Yale University*
