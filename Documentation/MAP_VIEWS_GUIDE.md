# Map Views Guide

## Overview

The map visualization now includes **7 specialized map views** that let you explore different aspects of the Unknown Hands database geographically. Each view shows a different slice of the data, crossing entity types and relationships.

---

## Map Views

### 1. Manuscripts - Current Location (Holdings) 🔵

**What it shows:** Where manuscripts are currently preserved/held

**Data source:** 
- Holding Institution coordinates
- Links: Manuscripts → Holding Institutions

**Use cases:**
- See which institutions hold the most manuscripts
- Identify major manuscript collections
- Plan research visits

**Marker color:** Blue  
**Example:** "Florence, Biblioteca Laurenziana holds MS Plut. 1.1"

---

### 2. Manuscripts - Production Location 🔵

**What it shows:** Where manuscripts were originally produced/created

**Data source:**
- Production Unit coordinates (primary)
- Holding Institution coordinates (fallback)
- Links: Manuscripts → Production Units

**Use cases:**
- See centers of manuscript production
- Identify scriptoria locations
- Compare production vs preservation geography

**Marker color:** Blue  
**Connection lines:** Shows production → current holding (orange dashed)  
**Example:** "MS produced in Paris, now held in London"

---

### 3. Production Units - All Locations 🟠

**What it shows:** All production units at their specific locations

**Data source:**
- Production Unit coordinates
- Optional: Linked Monastic Institution names

**Use cases:**
- See all production activities geographically
- Identify production clusters
- Explore individual production contexts

**Marker color:** Orange  
**Popup shows:** Associated monastery name (if linked)  
**Connection lines:** Monastery → Production Unit (purple dotted)  
**Example:** "Production Unit at Abbey of Saint-Denis"

---

### 4. Production Units - By Monastery 💜

**What it shows:** Production units grouped by their monastic institution

**Data source:**
- Monastic Institution coordinates
- Aggregated Production Units per monastery
- Links: Production Units → Monastic Institutions

**Use cases:**
- See which monasteries were most productive
- Compare monastic production patterns
- Identify major scriptoria

**Marker color:** Magenta  
**Marker size:** Reflects number of production units  
**Popup shows:** List of production units at each monastery  
**Example:** "Abbey of Cluny: 15 Production Units"

---

### 5. Monastic Institutions 💜

**What it shows:** All monastic institutions with their locations

**Data source:**
- Monastic Institution coordinates
- Count of linked production units

**Use cases:**
- Map monastic network across Europe
- See distribution of religious institutions
- Identify potential scriptoria (those with production units)

**Marker color:** Purple  
**Popup shows:** Number of linked production units  
**Example:** "Abbey of Monte Cassino (8 Production Units)"

---

### 6. Female Scribes - Work Locations 💚

**What it shows:** Where female scribes worked (based on manuscripts they produced)

**Data source:**
- Scribal Units filtered by Gender = "Female"
- Manuscript locations (production or holding)
- Links: Scribal Units → Manuscripts → Production Units/Holdings

**Use cases:**
- Map female scribal activity
- Identify centers of female scribal work
- Research women's participation in manuscript production

**Marker color:** Green  
**Popup shows:** Scribe name, gender, manuscript count, location type  
**Example:** "Diemud of Wessobrunn: 3 manuscripts (production location)"

**Note:** A scribe may appear at multiple locations if they worked on manuscripts in different places.

---

### 7. All Scribes - Work Locations 💚

**What it shows:** Where all scribes worked (male, female, unknown gender)

**Data source:**
- All Scribal Units
- Manuscript locations (production or holding)
- Links: Scribal Units → Manuscripts → Production Units/Holdings

**Use cases:**
- Map complete scribal network
- See all scribal activity centers
- Compare patterns across genders

**Marker color:** Green  
**Popup shows:** Scribe name, gender, manuscript count, location type  
**Can filter by time:** Shows scribes whose manuscripts date to selected period

---

## Using Map Views

### Switching Views

1. Open the **Map** tab
2. At the top, find the **"Map View:"** dropdown
3. Select your desired view
4. The map will rebuild with new data

```
Map View: [Manuscripts - Current Location (Holdings) ▼]
```

### Combining with Features

All map views work with the standard map features:

**✅ Clustering** - Groups nearby markers (recommended for dense areas)  
**✅ Heatmap** - Shows density overlay (great for identifying centers)  
**✅ Time Filter** - Filters by date (where applicable)  
**✅ Connection Lines** - Shows relationships (context-dependent)  
**✅ Routes** - Shows movement paths (for manuscripts)

### Connection Lines by View

Connection lines adapt to the selected view:

| View | Connection Type | Color | What it Shows |
|------|----------------|-------|---------------|
| Manuscripts - Production | Production → Holding | 🟠 Orange dashed | Manuscript movement |
| Production Units - All | Monastery → PU | 💜 Purple dotted | Institutional links |
| Other views | (not applicable) | - | - |

---

## Research Workflows

### Workflow 1: Compare Production vs Preservation

```
1. Select "Manuscripts - Production Location"
2. Enable Heatmap to see production centers
3. Note the patterns (e.g., Italy, France, Germany)
4. Switch to "Manuscripts - Current Location (Holdings)"
5. Compare heatmap - see how manuscripts moved
6. Enable Connection Lines to see individual movements
```

**Question answered:** Where were manuscripts produced vs where they ended up?

---

### Workflow 2: Explore Monastic Networks

```
1. Select "Monastic Institutions"
2. Enable Clustering (many monasteries in dense areas)
3. Note distribution across Europe
4. Switch to "Production Units - By Monastery"
5. See which monasteries had scriptoria
6. Click markers to see specific production units
```

**Question answered:** Which monasteries were centers of book production?

---

### Workflow 3: Map Female Scribal Activity

```
1. Select "Female Scribes - Work Locations"
2. Enable Heatmap to see concentrations
3. Use Time Filter to focus on specific century
4. Click markers to see individual scribes
5. Switch to "All Scribes - Work Locations"
6. Compare patterns (male vs female scribal geography)
```

**Question answered:** Where did female scribes work? How does it compare to overall scribal activity?

---

### Workflow 4: Trace Manuscript Production Chains

```
1. Select "Production Units - All Locations"
2. Enable Connection Lines (shows monastery links)
3. Filter by time period (e.g., 1200-1300)
4. Click on production units to see details
5. Switch to "Manuscripts - Production Location"
6. See the actual manuscripts produced at those locations
```

**Question answered:** What was the production chain from monastery to manuscript?

---

## Data Notes

### What Gets Mapped

Each view shows **only records with valid coordinates**:

- ✅ **Included:** Records with Latitude/Longitude fields
- ❌ **Excluded:** Records without location data
- ⚠️ **Fallback:** Some views use fallback locations (e.g., MS production → holding)

### Counting and Grouping

- **Production Units by Monastery:** One marker per monastery, size reflects PU count
- **Scribes - Work Locations:** One marker per unique location-scribe combination
- **All other views:** One marker per record

### Relationships Used

The views leverage multiple relationship types:

1. **Pointer fields:** Direct links (e.g., MS → Holding Institution)
2. **Relationship records:** Explicit relationships in relationships.json
3. **Reverse lookups:** Finding what points to a record (e.g., PUs → Monastery)

---

## Color Legend

| Color | Category | Views |
|-------|----------|-------|
| 🔵 Blue | Manuscripts | Current Location, Production Location |
| 🟠 Orange | Production Units | All Locations |
| 💜 Purple | Monastic Institutions | Monastic Institutions |
| 🔴 Magenta | Monastery+PUs | By Monastery (grouped) |
| 💚 Green | Scribes | Female Scribes, All Scribes |

---

## Performance Tips

### For Best Performance

1. **Enable Clustering** for views with many markers (especially scribes, manuscripts)
2. **Use Time Filter** to reduce marker count
3. **Disable Heatmap** if map becomes sluggish (rare)
4. **Zoom in** before disabling clustering

### Expected Marker Counts

| View | Typical Count | With Clustering |
|------|---------------|-----------------|
| Manuscripts - Current | 500-1000 | ✅ Recommended |
| Manuscripts - Production | 300-800 | ✅ Recommended |
| Production Units - All | 200-500 | ⚠️ Optional |
| Production Units - Monastery | 50-150 | ❌ Not needed |
| Monastic Institutions | 100-300 | ⚠️ Optional |
| Female Scribes | 20-100 | ❌ Not needed |
| All Scribes | 100-500 | ✅ Recommended |

---

## Troubleshooting

### "No mappable coordinates for this view"

**Cause:** No records in current view have valid coordinates  
**Solutions:**
- Try a different view
- Check if entity type has location data
- Verify data has been loaded (refresh page)

### Few or no markers for scribes

**Cause:** Scribes need to be linked to manuscripts with locations  
**Solutions:**
- Check relationship records exist
- Verify manuscripts have production/holding locations
- Try "All Scribes" instead of just female

### Markers overlap even with clustering

**Cause:** Many records at exact same coordinates  
**Solutions:**
- Click cluster to expand (spiderfy effect)
- Zoom in further
- Check if data has sufficient coordinate precision

### Connection lines not appearing

**Cause:** Only some views support connection lines  
**Solutions:**
- Use "Manuscripts - Production Location" for MS connections
- Use "Production Units - All Locations" for monastery connections
- Ensure records have both endpoint locations

---

## Future Enhancements

### Planned Features

1. **Color by metadata** - Color scribes by gender, manuscripts by language, etc.
2. **Custom marker icons** - Different shapes for different entity types
3. **Animated timeline** - Watch geography change over centuries
4. **Export view** - Save current map as image or coordinates as CSV
5. **Split view** - Compare two map views side-by-side

### Potential New Views

- **Texts - Geographic Distribution** - Where specific texts appear
- **Historical People - Activity Locations** - Where people worked/lived
- **Languages - Geographic Distribution** - Map language usage
- **Script Types - Production Centers** - Where script types originated

---

## FAQ

**Q: Can I see multiple views at once?**  
A: Not currently. Switch between views using the dropdown. (Split view planned for future)

**Q: Why do some manuscripts appear in both production and holding maps?**  
A: They're the same manuscripts, just shown at different locations (where made vs where kept).

**Q: Can I filter the map by entity-level filters?**  
A: Map views are independent of entity selection. They show ALL relevant data. Use time filter to narrow results.

**Q: Why don't all scribes appear on the map?**  
A: Scribes only appear if (1) they're linked to manuscripts, and (2) those manuscripts have location data.

**Q: Can I see where a specific manuscript traveled?**  
A: Use "Manuscripts - Production Location" with Connection Lines enabled. Each line shows production → current holding.

**Q: What's the difference between "Production Units - All" vs "By Monastery"?**  
A: "All" shows each PU at its specific location. "By Monastery" groups all PUs by their monastery, showing one marker per monastery with PU count.

---

## Examples & Use Cases

### Example 1: Research Female Scribes in 12th Century

```
1. Map View: "Female Scribes - Work Locations"
2. Time Filter: 1100-1200
3. Enable: Heatmap
4. Result: See concentration in Germany (Diemud, etc.)
5. Click markers for individual scribes
```

### Example 2: Track Florence's Manuscript Production

```
1. Map View: "Manuscripts - Production Location"
2. Zoom to Florence region
3. Disable Clustering (see individual manuscripts)
4. Enable Connection Lines
5. Result: See manuscripts produced in Florence and where they traveled
```

### Example 3: Identify Major Monastic Scriptoria

```
1. Map View: "Production Units - By Monastery"
2. Enable Heatmap
3. Look for large numbers (10+ PUs)
4. Result: Cluny, Saint-Denis, Monte Cassino, etc.
5. Click to see specific production units
```

---

**Document Version:** 1.0  
**Last Updated:** October 30, 2025  
**Status:** Complete - All 7 views implemented  

For technical implementation details, see `MAP_IMPLEMENTATION_COMPLETE.md`
