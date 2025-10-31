# Visualization Enhancement Roadmap

## Overview
This document outlines the step-by-step implementation plan for enhancing visualizations in the Unknown Hands database.

---

## Phase 1: Map Enhancements ✅ COMPLETE

### 1.1 Clustering for Dense Areas ✅ COMPLETE
**Status**: Implemented
**Time**: 1 hour
**Description**: Group nearby markers into clusters that show the number of records. Click to expand.
**Technology**: Leaflet.markercluster plugin
**Benefit**: Makes dense cities (Florence, Paris, etc.) navigable
**Features**:
- Automatic clustering with configurable radius (50px)
- Spiderfy on max zoom
- Click to expand clusters
- Shows count on cluster icon
- Smooth zoom transitions

### 1.2 Connection Lines ✅ COMPLETE
**Status**: Implemented
**Time**: 1.5 hours
**Description**: Draw lines between related locations
**Use Cases**:
- Manuscripts: production location → current holding location
**Controls**: Toggle on/off with checkbox
**Visual**: Orange dashed lines (5,5 pattern)
**Features**:
- Click line to see connection details
- Popup shows manuscript title and connection type
- Only shown when both endpoints have coordinates

### 1.3 Heatmap Layer ✅ COMPLETE
**Status**: Implemented
**Time**: 1 hour
**Description**: Density visualization showing concentration of scribal activity
**Technology**: Leaflet.heat plugin
**Controls**: Toggle on/off with checkbox
**Benefit**: Quickly identify centers of manuscript production
**Features**:
- Custom gradient: blue → cyan → lime → yellow → red
- Radius: 25px, Blur: 15
- Updates with time filter
- Adjusts with zoom level

### 1.4 Time Filter Slider ✅ COMPLETE
**Status**: Implemented
**Time**: 1.5 hours
**Description**: Interactive dual slider to filter map by date range
**Features**:
- Dual handles (start/end date: 800-1600)
- Shows century coverage
- Updates map in real-time
- Works with current facet filters
- Displays current range: "800–1600" or "All dates"
- Clear button to reset range
- Sliders prevent invalid ranges (start > end)
**Benefit**: See geographic shifts over centuries
**Date Sources**:
- Manuscripts: Normalized terminus post/ante quem
- Production Units: PU Date terminus post/ante quem
- Monastic Institutions: Creation date

### 1.5 Route Visualization ✅ COMPLETE
**Status**: Implemented
**Time**: 1 hour
**Description**: Trace manuscript movement through production/ownership
**Features**:
- Purple polylines showing manuscript journey
- Numbered markers for each location (Step 1, 2, etc.)
- Production → Current holding location
- Click route for details
- Popup shows route sequence
**Benefit**: Understand manuscript provenance visually
**Note**: Currently shows production → holding. Future versions may include intermediate ownership from provenance records.

**Total Phase 1**: ~6 hours ✅ COMPLETE

**Documentation**: See MAP_ENHANCEMENTS_GUIDE.md for complete user guide

---

## Implementation Notes

### What Was Built

All 5 map features are now live:

1. **Clustering** - Uses Leaflet.markercluster with 50px radius, spiderfy enabled
2. **Connection Lines** - Orange dashed lines for production→holding (manuscripts only)
3. **Heatmap** - Blue-to-red gradient showing density, radius 25, blur 15
4. **Time Filter** - Dual sliders (800-1600) with real-time filtering, clear button
5. **Routes** - Purple lines with numbered markers showing manuscript movement

### Technical Implementation

**Global State Variables**:
- `MAP_INSTANCE`: Current Leaflet map object
- `MAP_MARKERS_LAYER`: Simple marker layer (no clustering)
- `MAP_CLUSTER_LAYER`: Clustered marker layer
- `MAP_HEATMAP_LAYER`: Heat layer
- `MAP_CONNECTIONS_LAYER`: Connection lines layer
- `MAP_ROUTES_LAYER`: Route visualization layer
- `MAP_MARKERS_DATA`: Array of marker data with coordinates, dates, connections

**Functions**:
- `buildMap()`: Main map builder, collects data and initializes
- `renderMapLayers()`: Renders/updates all layers based on control states and time filter
- `setupMapControls()`: Attaches event handlers to checkboxes and sliders
- `ensureLeaflet()`: Loads Leaflet + plugins (markercluster, heat)

**Control Panel**:
- Top row: 4 checkboxes (Clustering, Connections, Heatmap, Routes) + Reset View button
- Bottom row: Time period label + dual sliders + Clear button

**Data Flow**:
1. User changes control → Event handler fires
2. Event handler calls `renderMapLayers()`
3. Function clears old layers
4. Function filters markers by time range
5. Function creates new layers based on checkbox states
6. Function adds layers to map

### Performance Optimizations

- Layer caching: Only recreate when needed
- Time filter: Filters data array, doesn't reload from source
- Clustering: Handles 1000+ markers smoothly
- Heatmap: Max 2000 points before performance degrades

---

## Phase 2: Timeline Enhancements

### 2.1 Interactive Brushing & Zoom
**Time**: 2 hours
**Description**: Click-drag to zoom into specific time periods
**Features**:
- Brush selection on timeline
- Zoom to selected period
- Reset zoom button
- Show selected date range

### 2.2 Uncertainty Bars (Date Ranges)
**Time**: 2 hours
**Description**: Show terminus post/ante quem as horizontal bars instead of dots
**Visual**:
```
Certain date:  •
Date range:    ├────────┤
Uncertain:     ├- - - - -┤
```
**Fields used**:
- Normalized terminus post quem
- Normalized terminus ante quem
- Dating precision indicators

### 2.3 Multi-Band Timeline
**Time**: 3 hours
**Description**: Stack different entity types on separate bands
**Layout**:
```
Manuscripts     ●  ●    ●     ●
Production      ●     ●   ●
Scribal Units     ●  ●  ●    ●
People            ●         ●
```
**Features**:
- Color coded by type
- Hover shows connections
- Click to filter

### 2.4 Century Markers & Period Shading
**Time**: 1 hour
**Description**: Add context with historical periods
**Elements**:
- Century divider lines
- Period labels (11th C, 12th C, etc.)
- Optional: Shaded regions for historical events
- Medieval period highlight

### 2.5 Color Coding by Metadata
**Time**: 1.5 hours
**Description**: Color timeline dots by metadata values
**Options**:
- Language (Latin, French, Italian, etc.)
- Script type
- Attribution certainty
- Production type (monastic vs secular)
**Control**: Dropdown to select coloring scheme

**Total Phase 2**: ~9.5 hours

---

## Phase 3: Sankey Diagram (Flow Visualization)

### 3.1 Basic Sankey Implementation
**Time**: 3 hours
**Description**: Show flow between entity types
**Example Flow**:
```
Monastic Institutions ══════╗
                            ║
Historical People ═════════╬═══> Manuscripts ═══> Holdings
                            ║
Texts ═════════════════════╝
```

### 3.2 Interactive Sankey
**Time**: 2 hours
**Features**:
- Hover to highlight paths
- Click to filter
- Show flow volumes
- Adjust by time period

### 3.3 Multiple Sankey Views
**Time**: 2 hours
**Preset Views**:
- Text transmission (Texts → Manuscripts → Holdings)
- Scribal networks (Scribes → Manuscripts → Monasteries)
- Production flow (Monasteries → Productions → Manuscripts)
- Language flow (Languages → Texts → Manuscripts)

**Total Phase 3**: ~7 hours

---

## Phase 4: Matrix Visualization

### 4.1 Co-occurrence Matrix
**Time**: 3 hours
**Description**: Grid showing which entities co-occur
**Examples**:
- Scribes × Manuscripts (who worked on what)
- Texts × Manuscripts (which texts appear together)
- Monasteries × Scribes (institutional networks)

### 4.2 Interactive Matrix
**Time**: 2 hours
**Features**:
- Hover shows details
- Click to filter
- Sortable rows/columns
- Color intensity by frequency

**Total Phase 4**: ~5 hours

---

## Phase 5: Statistical Dashboard

### 5.1 Summary Statistics
**Time**: 2 hours
**Widgets**:
- Total counts by entity type
- Date range coverage
- Geographic distribution
- Language distribution

### 5.2 Interactive Charts
**Time**: 3 hours
**Chart Types**:
- Bar: Manuscripts per century
- Line: Production over time
- Pie: Distribution by country
- Donut: Language breakdown
- Histogram: Date precision

### 5.3 Comparison View
**Time**: 2 hours
**Features**:
- Select two filters
- Compare statistics side-by-side
- Highlight differences

**Total Phase 5**: ~7 hours

---

## Phase 6: UI/UX Improvements

### 6.1 Split View Mode
**Time**: 3 hours
**Description**: Show two visualizations simultaneously
**Layouts**:
- Map + Timeline (horizontal split)
- Network + Details (vertical split)
- Map + List (side by side)

### 6.2 Comparison Mode
**Time**: 4 hours
**Features**:
- Select multiple records
- Compare networks side-by-side
- Overlay timelines
- Compare metadata tables

### 6.3 Bookmarks & Sharing
**Time**: 3 hours
**Features**:
- Save current view state
- Generate shareable URLs
- Export current view as image
- Save to browser localStorage

### 6.4 Guided Tours
**Time**: 4 hours
**Tours**:
1. "Follow a Text through Time"
2. "Explore a Scribe's Career"
3. "Monastic Production Patterns"
4. "Geographic Spread of a Text"

**Total Phase 6**: ~14 hours

---

## Phase 7: Advanced Features

### 7.1 Chord Diagram
**Time**: 4 hours
**Description**: Circular relationship visualization
**Use cases**:
- Inter-monastery connections
- Language co-occurrence
- Scribe collaboration networks

### 7.2 Hierarchical Tree View
**Time**: 3 hours
**Description**: Containment hierarchy
**Structure**:
```
Manuscript
├── Production Unit 1
│   ├── Scribal Unit 1
│   └── Scribal Unit 2
└── Production Unit 2
```

### 7.3 Word Cloud
**Time**: 2 hours
**Visualizations**:
- Most common locations
- Frequent scribe names
- Popular text genres
- Script types

**Total Phase 7**: ~9 hours

---

## Implementation Priority

### Must Have (Phase 1)
✅ Map clustering - Immediate usability improvement
✅ Connection lines - Research value
✅ Heatmap - Quick insights
✅ Time slider - Core filtering feature
✅ Route visualization - Provenance tracking

### Should Have (Phases 2-3)
- Timeline uncertainty bars - Better data representation
- Multi-band timeline - Comparison capability
- Sankey diagram - Pattern discovery

### Nice to Have (Phases 4-7)
- Matrix visualization - Advanced analysis
- Statistical dashboard - Overview
- Split view - Power users
- Chord diagram - Specialized use
- Guided tours - Onboarding

---

## Technical Dependencies

### New Libraries Needed

**Phase 1 (Maps)**:
- Leaflet.markercluster (clustering)
- Leaflet.heat (heatmap)
- noUiSlider or similar (time slider)
- Leaflet.polyline (connection lines)

**Phase 2 (Timeline)**:
- D3.js brush (already have D3)
- Maybe: Plotly.js for advanced timeline

**Phase 3 (Sankey)**:
- d3-sankey plugin

**Phase 4 (Matrix)**:
- D3.js (already have)

**Phase 5 (Dashboard)**:
- Chart.js or Plotly.js

**Phase 6 (UI)**:
- html2canvas (for image export)
- No new libraries for split view

**Phase 7 (Advanced)**:
- D3.js (already have for chord/tree)
- WordCloud2.js

---

## Testing Checklist

### Map Enhancements
- [ ] Clusters form correctly in dense areas
- [ ] Cluster expansion works on click
- [ ] Connection lines draw correctly
- [ ] Heatmap intensity is appropriate
- [ ] Time slider updates map smoothly
- [ ] Route animation is smooth
- [ ] Works with existing filters

### Timeline Enhancements
- [ ] Date ranges display correctly
- [ ] Brushing works smoothly
- [ ] Multi-band layout is readable
- [ ] Century markers align properly
- [ ] Color coding is clear

### Other Visualizations
- [ ] Sankey flows are logical
- [ ] Matrix is sortable
- [ ] Charts update with filters
- [ ] All visualizations export correctly

### Performance
- [ ] Large datasets (2000+ records) load quickly
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks on view switching
- [ ] Mobile responsive (where applicable)

---

## Success Metrics

### Usability
- Reduce clicks needed to find related records
- Decrease time to identify patterns
- Increase exploration depth (pages per session)

### Research Value
- Enable new types of questions
- Faster hypothesis testing
- Better presentation of findings

### User Feedback
- "Helped me discover X pattern"
- "Made my research faster"
- "Beautiful and useful"

---

## Next Steps

1. ✅ **Start with Phase 1: Map Enhancements** (now)
   - Implement all 5 map features
   - Test with real data
   - Get user feedback

2. **Phase 2: Timeline Enhancements**
   - Begin with uncertainty bars (most impactful)
   - Add interactive brushing
   - Multi-band if time permits

3. **Phase 3: Sankey Diagram**
   - Create basic flow visualization
   - Add interactivity
   - Create preset views

4. **Evaluate and Iterate**
   - Gather feedback on Phases 1-3
   - Prioritize remaining phases based on usage
   - Consider custom requests

---

## Estimated Total Time

- Phase 1 (Maps): **6 hours** ← STARTING NOW
- Phase 2 (Timeline): 9.5 hours
- Phase 3 (Sankey): 7 hours
- Phase 4 (Matrix): 5 hours
- Phase 5 (Dashboard): 7 hours
- Phase 6 (UI/UX): 14 hours
- Phase 7 (Advanced): 9 hours

**Grand Total**: ~57.5 hours of development

**Realistic Schedule**:
- Week 1: Phase 1 (Maps) ✅
- Week 2: Phase 2 (Timeline)
- Week 3: Phase 3 (Sankey)
- Week 4: Phases 4-5 (Matrix & Dashboard)
- Week 5: Phase 6 (UI/UX)
- Week 6: Phase 7 (Advanced) + Polish

---

## Resources & References

### Leaflet Plugins
- Clustering: https://github.com/Leaflet/Leaflet.markercluster
- Heatmap: https://github.com/Leaflet/Leaflet.heat
- Polylines: Built into Leaflet

### D3.js Examples
- Sankey: https://observablehq.com/@d3/sankey
- Chord: https://observablehq.com/@d3/chord-diagram
- Matrix: https://bost.ocks.org/mike/miserables/

### Similar Projects
- Mapping the Republic of Letters: http://republicofletters.stanford.edu/
- Palladio: https://hdlab.stanford.edu/palladio/
- Nodegoat: https://nodegoat.net/

---

**Document Version**: 1.0
**Last Updated**: October 30, 2025
**Status**: Phase 1 in progress
