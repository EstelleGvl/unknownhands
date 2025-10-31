# Map Now Available for All Entity Types

## What Changed

The map visualization is now **always available**, regardless of which entity type you're viewing. Previously, the map was only accessible when viewing Manuscripts, Production Units, or Holding Institutions. Now it's available for ALL entity types.

---

## Why This Makes Sense

The new map views are **independent of entity selection**:

- **Female Scribes map** shows scribes regardless of which entity you're viewing
- **Monastic Institutions map** shows monasteries regardless of entity
- **Manuscripts maps** show manuscripts from multiple perspectives
- Each view displays **all relevant data**, not just filtered results

This means you can:
- Be viewing Texts (tx) and still see the manuscript map
- Be viewing Historical People (hp) and explore monastic institutions
- Be viewing any entity and access all 7 map views

---

## Smart Defaults

When you first open the map, the system now **suggests an appropriate view** based on your current entity:

| Current Entity | Suggested Map View | Reason |
|----------------|-------------------|---------|
| Manuscripts (ms) | Current Location | Most common use case |
| Production Units (pu) | All Locations | Direct mapping |
| Monastic Institutions (mi) | All Institutions | Direct mapping |
| Scribal Units (su) | All Scribes | Shows scribe work locations |
| Holding Institutions (hi) | Manuscripts - Current | Shows manuscripts at holdings |
| Texts (tx) | Manuscripts - Current | Default view |
| Historical People (hp) | Manuscripts - Current | Default view |

**You can always change the view** using the dropdown selector!

---

## UI Changes

### 1. Map Tab Always Visible

```
Before: [Results] [Timeline] [Network]      ← No map tab for some entities
After:  [Results] [Map] [Timeline] [Network] ← Always visible
```

### 2. Helpful Hint

When viewing entity types without direct geographic representation (like Texts or Historical People), a helpful hint appears:

```
💡 Tip: Viewing TX records, but map shows related geographic data. 
Change "Map View" above to explore different aspects.
```

This reminds users that:
- Map views are independent of entity selection
- They can explore any geographic aspect via the dropdown
- The map shows ALL relevant data, not filtered results

---

## How It Works

### Technical Changes

1. **`supportsMap(entity)` now returns `true` for all entities**
   ```javascript
   // Before:
   function supportsMap(entity){ return ['hi','ms','pu'].includes(entity); }
   
   // After:
   function supportsMap(entity){ return true; }
   ```

2. **Smart view suggestion**
   ```javascript
   function getSuggestedMapView(entity) {
     const suggestions = {
       'ms': 'ms-current',
       'pu': 'pu-location',
       'mi': 'mi-all',
       'su': 'scribes-all',
       // ... etc
     };
     return suggestions[entity] || 'ms-current';
   }
   ```

3. **Contextual hint display**
   - Shows hint only for entities without direct map (tx, hp)
   - Explains that map views are independent
   - Encourages exploration via dropdown

---

## User Experience

### Scenario 1: Viewing Manuscripts
```
1. User selects Manuscripts entity
2. Map tab is visible
3. User clicks Map tab
4. Map opens with "Manuscripts - Current Location" (suggested view)
5. No hint shown (manuscripts have direct map representation)
6. User can switch to other views via dropdown
```

### Scenario 2: Viewing Texts
```
1. User selects Texts entity
2. Map tab is visible (NEW!)
3. User clicks Map tab
4. Map opens with "Manuscripts - Current Location" (default)
5. Hint appears: "💡 Viewing TX records, but map shows related data..."
6. User understands they can explore different geographic aspects
7. User can switch to any view (Female Scribes, Monasteries, etc.)
```

### Scenario 3: Viewing Scribal Units
```
1. User selects Scribal Units entity
2. Map tab is visible
3. User clicks Map tab
4. Map opens with "All Scribes - Work Locations" (suggested view)
5. No hint shown (scribes have direct map representation)
6. Perfect match between entity and map view!
```

---

## Benefits

### 1. **Consistent Navigation**
- Map tab always in same position
- No confusion about when map is available
- Predictable interface

### 2. **Cross-Entity Exploration**
- View manuscripts while browsing texts
- Explore monasteries while researching people
- See female scribes from any starting point

### 3. **Better Discovery**
- Users find map views they might not have known existed
- Encourages exploration of different perspectives
- Hints guide users to understand map independence

### 4. **Workflow Flexibility**
```
Example workflow:
1. Start with Texts entity (researching a specific text)
2. Click Map tab
3. Select "Manuscripts - Current Location"
4. See where manuscripts containing that text are held
5. Switch to "Production Units - By Monastery"
6. See which monasteries produced those manuscripts
7. All without leaving the map or changing entity!
```

---

## What Users Should Know

### Map Views Are Independent

**Important:** Map views show **ALL data** in the database, not just filtered results.

- If you've filtered Manuscripts to show only 13th century → map still shows ALL manuscripts
- To filter map by time, use the **Time Filter slider** within the map
- To filter by entity, use the faceted search, then note which locations appear

### Entity Selection vs Map View

```
┌──────────────────────────────────────────────────────┐
│ Entity Selection (left panel)                        │
│   ↓                                                  │
│   Controls RESULTS view (list of records)           │
│   Does NOT control MAP view                          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Map View Dropdown (in map controls)                  │
│   ↓                                                  │
│   Controls what appears on MAP                       │
│   Independent of entity selection                    │
│   Shows ALL relevant data                            │
└──────────────────────────────────────────────────────┘
```

### Best Practice

1. **Use entity selection** to narrow down records in Results view
2. **Use faceted search** to filter by attributes
3. **Use Map View dropdown** to choose geographic perspective
4. **Use Map Time Filter** to narrow map by date range

---

## Examples

### Example 1: Research Female Scribes (Starting from Any Entity)

```
Current Entity: Texts (tx)
1. Click Map tab
2. Dropdown: Select "Female Scribes - Work Locations"
3. Map shows all female scribes and where they worked
4. Use Time Filter to focus on 12th century
5. Click markers to see individual scribes
```

### Example 2: Compare Manuscript Locations (While Viewing People)

```
Current Entity: Historical People (hp)
1. Click Map tab
2. Hint appears (people don't have direct geography)
3. Dropdown: Select "Manuscripts - Production Location"
4. Enable Heatmap → see production centers
5. Dropdown: Switch to "Manuscripts - Current Location"
6. Compare production vs preservation patterns
```

### Example 3: Explore Monastic Network (From Manuscripts)

```
Current Entity: Manuscripts (ms)
1. Click Map tab (opens with "Current Location" suggested)
2. Dropdown: Switch to "Monastic Institutions"
3. Map shows all monasteries
4. Enable Clustering (many monasteries close together)
5. Click to see which have scriptoria (production units)
6. Dropdown: Switch to "Production Units - By Monastery"
7. See production activity per monastery
```

---

## FAQ

**Q: Why does the map show all manuscripts when I've filtered to show only 13th century?**  
A: Map views are independent of entity filters. Use the Map Time Filter sliders to filter by date.

**Q: I'm viewing Texts but the map shows manuscripts. Is this a bug?**  
A: No! Map views are independent. Texts don't have direct coordinates, so the map shows related geographic data (manuscripts). Use the dropdown to explore different views.

**Q: Can I see a map of ONLY the records in my current filtered results?**  
A: Not directly. The map shows all data to give you the complete geographic picture. However, you can use Map Time Filter + entity knowledge to approximate your filter.

**Q: What's the difference between entity selection and map view?**  
A: Entity selection controls the Results list (left panel). Map View controls what appears on the map (independent of entity).

**Q: Should I change entity to match my desired map view?**  
A: No need! Just use the Map View dropdown. Entity selection is for filtering the Results list.

**Q: When would I see the hint message?**  
A: When viewing entity types without direct geography (Texts, Historical People). It reminds you that map views are independent.

---

## Summary

✅ **Map tab now visible for ALL entity types**  
✅ **Smart default view based on current entity**  
✅ **Helpful hint for entities without direct geography**  
✅ **Full flexibility to explore any geographic view**  
✅ **No confusion about when map is available**  

The map is now a **universal geographic exploration tool** that transcends entity boundaries!

---

**Document Version:** 1.0  
**Last Updated:** October 30, 2025  
**Status:** Complete - Map available for all entities
