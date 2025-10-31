# Timeline Enhancements - Complete Guide

## Overview
The timeline visualization has been completely rebuilt with advanced interactive features for exploring temporal patterns in medieval manuscript data. This guide explains all features and their purposes.

---

## 🎯 Key Improvements

### 1. **Interactive Brushing & Zoom**
**Feature**: Click and drag on the timeline to zoom into specific time periods.

**How it works**:
- Click and hold anywhere on the timeline
- Drag to create a selection rectangle
- Release to zoom into the selected date range
- Click "Reset Zoom" to return to the full timeline

**Use cases**:
- Focus on a specific century (e.g., zoom to 1200-1300)
- Examine tight clusters of manuscripts
- Investigate production patterns during specific historical periods
- Compare activity levels across different time windows

---

### 2. **Multiple Stacked Bands**
**Feature**: Show all entity types simultaneously on separate horizontal bands.

**How it works**:
- **Checked** (default): Shows 4 bands:
  - Manuscripts (blue) - top band
  - Scribal Units (green) - second band
  - Production Units (orange) - third band
  - Monastic Institutions (purple) - bottom band
- **Unchecked**: Shows single band for currently selected entity type

**Use cases**:
- Compare temporal distribution across entity types
- Identify relationships between manuscript creation and monastic activity
- See which entity types are most active in different periods
- Cross-reference temporal patterns

**Band Labels**:
- Each band shows the entity type name and count on the left
- Bands have independent baselines with vertical jitter for overlapping items

---

### 3. **Uncertainty Visualization**
**Feature**: Show date ranges as semi-transparent horizontal bars with dots at midpoint.

**How it works**:
- **Date ranges** (terminus post quem → terminus ante quem):
  - Displayed as very transparent horizontal bars (opacity: 0.15)
  - Dot placed at **midpoint** of range for better positioning
  - Bar shows the full uncertainty window
  - Tooltip displays: "Title\n1250–1300 (midpoint: 1275)"
- **Exact dates**: 
  - Displayed as single dots
  - No uncertainty bar

**Why midpoint?**: 
- Your question: *"How is a point calculated since most records have a range?"*
- **Answer**: For records with ranges, the dot is positioned at the **midpoint** between terminus post quem and terminus ante quem
- Example: A manuscript dated 1250-1300 appears at year 1275
- This provides better visual balance and more accurate temporal representation
- Single dates (no range) use the exact year

**Bar transparency**:
- Normal state: Very transparent (opacity 0.15) - so bars don't overwhelm the view
- Selected: More visible (opacity 0.4)
- Connected to selection: Medium (opacity 0.3)
- Unrelated when something selected: Nearly invisible (opacity 0.05)

**Toggle behavior**:
- **Show Ranges checked** (default): Displays bars + midpoint dots
- **Show Ranges unchecked**: Collapses to dots only (midpoint or exact date)

---

### 4. **Century Markers & Period Shading**
**Feature**: Add temporal context with century markers and medieval period highlighting.

**How it works**:
- **Century lines**: Vertical dashed lines every 100 years
- **Century labels**: Year numbers at bottom (800, 900, 1000, etc.)
- **Medieval Period shading**: Gray background from 500-1500 CE
  - Labeled "Medieval Period" at top
  - Only shown if timeline overlaps this range
  
**Use cases**:
- Quickly identify which century a manuscript belongs to
- Understand historical context (medieval vs. early modern periods)
- Align manuscript dates with major historical transitions
- Compare activity before/during/after medieval period

---

### 5. **Color Coding System**
**Feature**: Color dots/bars by different metadata fields to reveal patterns.

**Your question**: *"I don't understand how the colours are handled and what's the point of them?"*

**Answer**: Colors help you **visually identify patterns and correlations** in your data. Here's what each mode reveals:

#### **Entity Type** (default)
- 🔵 Blue = Manuscripts
- 🟢 Green = Scribal Units
- 🟠 Orange = Production Units
- 🟣 Purple = Monastic Institutions

**Purpose**: Distinguish entity types when viewing multiple bands
**Research questions**:
- Which entity types dominate different centuries?
- Are production units earlier or later than manuscripts?

#### **Language**
- 🔴 Red = Latin
- 🔵 Blue = French
- 🟢 Green = Italian
- 🟡 Yellow = German
- 🟣 Purple = English
- ⚪ Gray = Other/Unknown

**Purpose**: See temporal distribution of languages
**Research questions**:
- When did vernacular languages become common in manuscripts?
- Are certain languages clustered in specific centuries?
- Did Latin remain dominant throughout the medieval period?

**Example insights**:
- If you see mostly red (Latin) in early centuries, then blue/green (French/Italian) appearing in later centuries, this reveals the rise of vernacular manuscript production

#### **Script Type**
- 🔴 Red = Gothic
- 🔵 Blue = Caroline (Carolingian)
- 🟢 Green = Humanistic
- 🟡 Yellow = Uncial
- ⚪ Gray = Other/Unknown

**Purpose**: Track paleographic transitions over time
**Research questions**:
- When did Gothic script replace Caroline?
- When did Humanistic script emerge?
- Are certain scripts limited to specific centuries?

**Example insights**:
- Gothic appears in 12th-15th centuries
- Humanistic scripts cluster in 15th-16th centuries (Renaissance)
- This helps validate dating and identify script transitions

#### **Date Certainty**
- 🔵 Blue = Exact date (no range)
- 🟢 Green = High certainty (≤10 years range)
- 🟡 Yellow = Medium certainty (11-50 years range)
- 🔴 Red = Low certainty (>50 years range)

**Purpose**: Assess data quality and dating precision
**Research questions**:
- Which periods have more precisely dated manuscripts?
- Are older manuscripts less precisely dated?
- Which entity types have better dating information?

**Example insights**:
- If early manuscripts (800-1000) are mostly red/yellow, but later ones (1400-1500) are green/blue, this shows improving dating precision in later periods

---

### 6. **Interactive Selection & Connection Highlighting**
**Feature**: Click any dot to see its connections across all bands.

**Your question**: *"When clicking on a dot in one of the lines (a record), can it highlight in the other timelines the records that are linked to it?"*

**Answer**: YES! This works just like the network view. Here's how:

**How it works**:
1. **Click a dot/bar**: Select a record
2. **Visual changes**:
   - Selected item: **Larger** (radius 5→6), **black outline**, **full opacity**
   - Connected items (in ANY band): **Full opacity**, highlighted
   - Unconnected items: **Faded** (opacity 0.2), pushed to background
3. **Click again**: Deselect (return to normal view)
4. **Click background**: Clear selection

**What counts as "connected"?**
- Relationship records (from relationships.json)
- Pointer fields (e.g., "Production unit" in manuscripts)
- Works bidirectionally (inbound + outbound)

**Example scenario**:
1. You're viewing multiple bands
2. You click a **Scribal Unit** dot (green, middle band)
3. Timeline highlights:
   - The **manuscript** containing that scribal unit (blue, top band)
   - The **production unit** that created it (orange, third band)
   - The **monastic institution** where it was produced (purple, bottom band)
4. All unrelated items fade away
5. You can now see the **temporal relationships** at a glance

**Use cases**:
- Trace manuscript production chains across time
- See if related records cluster in the same period
- Identify temporal relationships between entities
- Validate dating consistency across related records

**Record details**:
- Clicking a dot also shows the record in the sidebar (if not already visible)
- Tooltip shows full title and date information on hover

---

## 🎨 Visual Legend

The legend updates dynamically based on your "Color by" selection:

- **Always visible** below controls
- Shows color meanings for current mode
- Includes usage hints: "Click a dot to highlight connections • Drag to zoom"

---

## 📊 Data Quality Notes

### Date Extraction Logic
The timeline uses these fields (in order of preference):

**Manuscripts**:
1. Normalized terminus post quem / ante quem (for ranges)
2. Ms Dating (for single dates)

**Scribal Units**:
1. Normalized terminus post quem / ante quem (for ranges)
2. SU dating (fallback)

**Production Units**:
1. PU Date terminus post quem / ante quem (for ranges)
2. PU dating (fallback)

**Monastic Institutions**:
1. Creation date (institution founded)
2. Suppression date (institution dissolved)
3. Both dates create a range if both exist

### Year Range Filter
- Only years between **800-1800** are displayed
- Records outside this range are ignored
- This focuses on medieval and early modern periods

---

## 🔬 Research Workflows

### Workflow 1: Investigating a Specific Manuscript's Context
1. Select "Manuscripts" entity type
2. Enable "Multiple Bands" to see related entities
3. Click a manuscript dot
4. See its scribal units, production unit, and monastery highlighted
5. Check if dates are consistent across related records
6. Use "Date Certainty" color mode to assess reliability

### Workflow 2: Language Evolution Study
1. Enable "Multiple Bands"
2. Select "Color by: Language"
3. Look for red (Latin) dominance in early centuries
4. Identify when vernacular languages (blue/green) appear
5. Zoom into transition periods (e.g., 1200-1400)
6. Click individual dots to see which monasteries produced vernacular texts

### Workflow 3: Script Transition Analysis
1. Select "Color by: Script Type"
2. Look for the Caroline → Gothic transition (~1100-1200)
3. Find Humanistic script emergence (~1400s)
4. Zoom into transition periods
5. Use connection highlighting to see if certain monasteries pioneered new scripts

### Workflow 4: Temporal Network Analysis
1. Enable "Multiple Bands"
2. Zoom to a specific century
3. Click dots to see which records are interconnected
4. Identify temporal clusters (active production periods)
5. Compare with "Century Markers" to align with historical events

---

## 🐛 Troubleshooting

### "No dates in current results"
- Current filter has no records with valid dates
- Try resetting filters in the results pane
- Check that records have date fields populated

### Items appear stacked/overlapping
- This is normal - jitter algorithm spreads items vertically within bands
- Zoom in to spread items horizontally
- Use connection highlighting to isolate specific records

### Colors all gray
- Selected color mode has no data for current records
- Example: "Language" mode shows gray if language fields are empty
- Try "Entity Type" mode (always works)

### Selection not working
- Make sure you're clicking on dots/bars (not empty space)
- Check browser console for JavaScript errors
- Try refreshing the page

---

## 🚀 Performance Notes

- Timeline handles **thousands of records** efficiently
- SVG rendering is static (no DOM manipulation during pan/zoom)
- Brush interaction uses native mouse events (smooth on all devices)
- Connection highlighting rebuilds entire timeline (takes ~100ms for large datasets)

---

## 💡 Tips & Best Practices

1. **Start broad, zoom narrow**: Begin with full timeline, then zoom into interesting clusters
2. **Combine filters**: Use results pane filters + timeline zoom for targeted analysis
3. **Color for hypotheses**: Choose color modes based on your research question
4. **Multiple bands for context**: Always show related entity types when investigating connections
5. **Use certainty mode**: Identify well-dated vs. uncertain records before drawing conclusions
6. **Export findings**: Use browser screenshot tools to capture interesting patterns

---

## 🔄 Integration with Other Views

### Network View
- Click timeline dot → shows connections
- Switch to Network → see same connections as graph
- Use both for different perspectives (temporal vs. structural)

### Map View
- Timeline shows *when* manuscripts were created
- Map shows *where* they are now
- Use together: Filter by century in timeline → see geographic distribution in map

### Results Pane
- Timeline reflects current results/filters
- Clicking dot shows full record in sidebar
- Use sidebar to access detailed transcriptions/metadata

---

## 📈 Future Enhancement Ideas
(Not yet implemented, for reference)

1. **Animated playback**: Play through time period by period
2. **Comparison mode**: Show two different filters side-by-side
3. **Export to CSV**: Download visible timeline data
4. **Heatmap overlay**: Show density of activity over time
5. **Custom date ranges**: User-defined zoom with text input

---

## Technical Implementation Notes

### Key Variables
```javascript
TIMELINE_ZOOM = null; // {minYear, maxYear} for current zoom
TIMELINE_SELECTED = null; // Record ID of selected item
```

### Functions
- `buildTimeline()`: Main rendering function
- `getLinkedRecords(rec, entity)`: Finds connected records
- `setupTimelineBrushing()`: Handles drag-to-zoom
- `setupTimelineItemClicks()`: Handles dot selection
- `updateTimelineLegend(colorBy)`: Updates legend HTML

### Date Calculation
- Ranges use **midpoint**: `Math.round((tpq + taq) / 2)`
- Single dates use exact year
- Tooltip shows full range + midpoint

### Transparency Levels
- Normal bars: 0.15 (very subtle)
- Normal dots: 0.8
- Selected: 1.0
- Connected: 0.8-1.0
- Unrelated: 0.2 (faded)
- Unrelated bars: 0.05 (nearly invisible)

---

## Questions & Support

For technical questions or feature requests, refer to:
- Main roadmap: `VISUALIZATION_ROADMAP.md`
- Phase 2 completion: This implementation
- Network documentation: `NETWORK_VISUALIZATION_GUIDE.md`
- Map documentation: `MAP_ENHANCEMENTS_GUIDE.md`

Last updated: Phase 2 Implementation - Timeline Enhancements Complete
