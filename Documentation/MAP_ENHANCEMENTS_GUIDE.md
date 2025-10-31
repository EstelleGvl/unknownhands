# Map Enhancements Guide

## Overview

The map visualization has been enhanced with five powerful features to help you explore geographic patterns in the Unknown Hands database. These features work together to reveal spatial relationships, temporal changes, and manuscript movement patterns.

---

## Features

### 1. Clustering for Dense Areas ✅

**What it does:**
- Automatically groups nearby markers into clusters
- Shows the number of items in each cluster
- Expands to individual markers when you click or zoom in
- Makes dense cities (Florence, Paris, etc.) much more navigable

**How to use:**
- Toggle on/off with the "Clustering" checkbox (on by default)
- Click a cluster to zoom in and see individual markers
- Clusters automatically adjust as you zoom

**Benefits:**
- No more overlapping markers in dense areas
- Easier to see overall distribution patterns
- Faster map loading with many records

---

### 2. Connection Lines ✅

**What it does:**
- Draws lines between related locations
- For manuscripts: shows production location → current holding location
- Helps visualize manuscript movement and provenance

**How to use:**
- Toggle on/off with the "Connection Lines" checkbox
- Orange dashed lines connect related locations
- Click a line to see details about the connection
- Works best with manuscripts (shows production → holding)

**Visual:**
```
Production Location -----(dashed orange line)-----> Holding Institution
```

**Use cases:**
- See where manuscripts have traveled
- Identify patterns in manuscript movement
- Understand geographic relationships between production and preservation

---

### 3. Heatmap Layer ✅

**What it does:**
- Shows density of records by region
- Uses color gradient to indicate concentration
- Blue (low) → Cyan → Lime → Yellow → Red (high)

**How to use:**
- Toggle on/off with the "Heatmap" checkbox
- Adjust zoom level to see patterns at different scales
- Works with time filter to show temporal density changes

**Benefits:**
- Quickly identify centers of scribal activity
- See regional patterns at a glance
- Discover unexpected concentrations

**Color Scale:**
- 🔵 Blue: Low activity (few records)
- 🟢 Green/Lime: Moderate activity
- 🟡 Yellow: High activity
- 🔴 Red: Very high activity (hotspots)

---

### 4. Time Filter Slider ✅

**What it does:**
- Filters map by date range using dual sliders
- Shows only records from selected time period
- Updates all map layers (markers, heatmap, connections, routes) in real-time

**How to use:**
- Drag the left slider to set start date (800-1600)
- Drag the right slider to set end date (800-1600)
- The sliders automatically prevent invalid ranges (start > end)
- Current range is displayed above: "800–1600" or "All dates"
- Click "Clear" to reset to full range (800-1600)

**Time Periods:**
- 800-900: Carolingian period
- 900-1000: Late Carolingian/Ottonian
- 1000-1100: Romanesque (11th century)
- 1100-1200: Romanesque (12th century)
- 1200-1300: Gothic (13th century)
- 1300-1400: Gothic (14th century)
- 1400-1500: Late Gothic/Early Renaissance
- 1500-1600: Renaissance

**Use cases:**
- See how geographic distribution changed over centuries
- Identify when specific regions became active
- Track expansion/contraction of scribal activity
- Compare early vs late medieval patterns

**Example queries:**
- "Show manuscripts from 1200-1300" → See 13th century production centers
- "Show 11th century only" → Early Romanesque patterns
- "Show 1400-1600" → Late medieval to Renaissance shift

---

### 5. Route Visualization ✅

**What it does:**
- Traces manuscript journey from production to current location
- Shows numbered route points
- Uses purple lines with route markers
- Animates the path between locations

**How to use:**
- Toggle on/off with the "Show Routes" checkbox
- Purple lines show manuscript routes
- Click line or markers for details
- Numbers indicate sequence (Step 1, Step 2, etc.)

**Visual:**
```
1 Production Location ═══(purple line)═══> 2 Current Location
```

**Benefits:**
- Understand manuscript provenance visually
- See movement patterns across regions
- Identify common routes between locations

**Note:** Currently shows production → holding. Future versions may include intermediate ownership locations from provenance records.

---

## Control Panel

### Top Row (Feature Toggles)
```
☑ Clustering    ☐ Connection Lines    ☐ Heatmap    ☐ Show Routes    [Reset View]
```

- **Clustering**: Group nearby markers (recommended for dense areas)
- **Connection Lines**: Show relationships between locations
- **Heatmap**: Density visualization overlay
- **Show Routes**: Manuscript movement paths
- **Reset View**: Zoom to fit all visible markers

### Bottom Row (Time Filter)
```
Time Period: 800–1600                                           [Clear]
[800 ←─────────────────────────────────────────────→ 1600]
[800 ←─────────────────────────────────────────────→ 1600]
```

- **First slider**: Start date (left boundary)
- **Second slider**: End date (right boundary)
- **Clear button**: Reset to full date range

---

## Combining Features

### Research Workflows

#### 1. Trace Manuscript Movement
1. ✅ Enable "Connection Lines"
2. ✅ Enable "Show Routes"
3. Click on individual manuscripts to see their journey
4. Look for patterns in manuscript travel

#### 2. Explore Temporal Patterns
1. Adjust time sliders to specific century
2. ✅ Enable "Heatmap" to see density
3. Compare different time periods to see shifts
4. Note new centers of activity over time

#### 3. Find Production Centers
1. ✅ Enable "Heatmap"
2. Set time filter to period of interest
3. Red/yellow areas indicate major centers
4. Click clusters to explore individual manuscripts

#### 4. Dense City Navigation
1. ✅ Enable "Clustering" (default)
2. Zoom into dense cities (Florence, Paris)
3. Clusters expand automatically
4. Click individual markers for details

---

## Data Sources

### Location Data

**Manuscripts:**
- Primary: Production location (from Production Units)
- Fallback: Holding Institution location
- Both used for connection lines and routes

**Production Units:**
- PU Latitude/Longitude fields
- Links to associated manuscripts

**Holding Institutions:**
- Institution Latitude/Longitude fields
- Current location of manuscripts

### Date Data

**Manuscripts:**
- Normalized terminus post quem (earliest date)
- Normalized terminus ante quem (latest date)
- Uses first available date for filtering

**Production Units:**
- PU Date terminus post quem
- PU Date terminus ante quem

**Monastic Institutions:**
- Creation date
- Suppression date

---

## Technical Details

### Libraries Used

1. **Leaflet 1.9.4**: Base mapping library
   - Interactive pan/zoom
   - Tile layers (OpenStreetMap)
   - Marker/popup management

2. **Leaflet.markercluster 1.5.3**: Clustering plugin
   - Automatic grouping of nearby markers
   - Spiderfy on max zoom
   - Custom cluster styles

3. **Leaflet.heat 0.2.0**: Heatmap plugin
   - Density visualization
   - Customizable gradients
   - Intensity calculation

### Performance

- **Clustering**: Handles 1000+ markers smoothly
- **Heatmap**: Optimized for up to 2000 points
- **Time filtering**: Real-time updates with debouncing
- **Layer management**: Only active layers are rendered

### Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile: Basic functionality (touch gestures work)

---

## Tips & Best Practices

### Getting the Most from the Map

1. **Start with clustering ON**
   - Gives you overview of distribution
   - Click clusters to drill down
   - Turn off only if you need to see exact locations

2. **Use time filter strategically**
   - Start with full range to see overall patterns
   - Narrow down to explore specific periods
   - Watch heatmap change as you adjust time

3. **Combine heatmap + time slider**
   - Reveals temporal shifts in geography
   - Shows rise and fall of centers
   - Identifies new production areas

4. **Enable routes for provenance research**
   - See manuscript movement paths
   - Identify common routes
   - Understand acquisition patterns

5. **Connection lines for manuscripts**
   - Shows production vs preservation locations
   - Reveals manuscript dispersal patterns
   - Identifies major acquiring institutions

### Common Workflows

**Workflow 1: Explore a Region**
```
1. Zoom to region of interest (e.g., Italy)
2. Enable clustering to see distribution
3. Enable heatmap to see concentration
4. Adjust time slider to see changes over centuries
```

**Workflow 2: Track Manuscript Movement**
```
1. Select manuscripts entity type
2. Enable connection lines
3. Enable routes
4. Click individual manuscripts to see their journey
5. Look for patterns in movement directions
```

**Workflow 3: Compare Time Periods**
```
1. Set time slider to early period (e.g., 900-1100)
2. Note heatmap patterns
3. Take screenshot or mental note
4. Adjust to later period (e.g., 1300-1500)
5. Compare changes in geographic distribution
```

**Workflow 4: Dense City Exploration**
```
1. Zoom into Florence, Paris, or other dense city
2. Clustering automatically expands
3. Click individual markers for details
4. Use time filter to see temporal patterns within city
```

---

## Known Limitations

### Current Version

1. **Routes**: Currently only shows production → holding
   - Future: May include intermediate ownership/locations from provenance records
   
2. **Date Filtering**: Uses first available date
   - Some records without dates are always visible
   - Date ranges may be uncertain (inherent to medieval manuscripts)

3. **Connection Types**: Currently limited to production-holding
   - Future: Could show scribe movement, text transmission routes

4. **Mobile**: Basic functionality only
   - Clustering works but less smooth
   - Sliders harder to use on small screens

### Data Quality Notes

- Not all records have coordinates (records without location data won't appear)
- Not all manuscripts have both production AND holding locations
- Date precision varies (some manuscripts have century-level precision only)
- Some location data may be inferred or approximate

---

## Future Enhancements (Roadmap)

### Phase 1.5 (Potential Next Steps)

1. **Layer Control Panel**
   - Organize toggles into collapsible panel
   - Add opacity sliders for heatmap
   - Color picker for different layers

2. **Advanced Routes**
   - Include provenance/ownership history
   - Animated path drawing
   - Timeline scrubbing

3. **Custom Markers**
   - Different icons by entity type
   - Size based on importance/date certainty
   - Color by metadata (language, script, etc.)

4. **Export Map**
   - Download as image (PNG/SVG)
   - Export coordinates as CSV
   - Share current view URL

5. **Minimap & Overview**
   - Small inset map for navigation
   - Overview of all records
   - Context while zoomed

---

## Troubleshooting

### Map not loading?
- Check browser console for errors
- Ensure internet connection (loads tiles from OpenStreetMap)
- Try clearing browser cache

### Markers not appearing?
- Check if records have location data (coordinates)
- Verify time filter isn't too restrictive
- Try "Reset View" button

### Clustering not working?
- Ensure "Clustering" checkbox is checked
- Try zooming out to see if clusters form
- Refresh page if clusters seem stuck

### Heatmap not visible?
- Zoom out to see broader patterns
- Ensure enough markers are visible
- Try adjusting time filter to include more records

### Sliders not responding?
- Click directly on slider track
- Try dragging from handle
- Clear and start over if stuck

---

## FAQ

**Q: Can I see scribes on the map?**
A: Currently, scribal units don't have direct coordinates. You can see manuscripts they worked on (which have production locations) or institutions they were associated with.

**Q: Why do some manuscripts show connections and others don't?**
A: Connection lines require BOTH production location AND holding location data. Manuscripts with only one location won't have a connecting line.

**Q: Can I export the map?**
A: Not yet in current version. Planned for Phase 1.5. You can take screenshots for now.

**Q: What do the cluster numbers mean?**
A: The number indicates how many individual markers are grouped in that cluster. Click to expand.

**Q: Can I see multiple entity types on one map?**
A: Not currently. Switch between entity types using the main navigation. Future versions may support overlays.

**Q: Why doesn't the time filter affect my view?**
A: Make sure your selected entity type has date fields. Also, records without dates are always visible.

**Q: Can I see text transmission routes?**
A: Not directly yet. You can see manuscripts containing texts, which gives indirect transmission patterns.

---

## Credits & References

### Technology
- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) - Marker clustering
- [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) - Heatmap layer
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles

### Similar Projects
- [Mapping the Republic of Letters](http://republicofletters.stanford.edu/) - Scholarly correspondence networks
- [DARIAH Geobrowser](https://geobrowser.de.dariah.eu/) - Historical place visualization
- [Pelagios](https://pelagios.org/) - Linked ancient places

---

## Support

For questions, issues, or feature requests:
1. Check this guide first
2. Consult the main VISUALIZATION_ROADMAP.md
3. Contact the development team

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Implementation Status**: ✅ Complete

All five map enhancements are now live and ready to use!
