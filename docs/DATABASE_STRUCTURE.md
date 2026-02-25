# Database Structure - Heurist Data Model

## Entity Relationships

```
Manuscript (manuscripts.json)
    ↓ has
Production Unit (production_units.json)
    ↓ created at
Monastic Institution (monastic_institutions.json)
    ↓ located in  
City / Country

Production Unit
    ↓ contains (via relationships.json)
Scribal Unit (scribal_units.json)
    ↓ copied by
Historical Person (historical_people.json)
```

## Key Fields by Entity

### Manuscripts (manuscripts.json)
- `rec_ID`: unique ID
- `rec_Title`: "Holding Institution, Shelfmark"
- **No dates or location** - these are in Production Units!

### Production Units (production_units.json)
**Relationships:**
- `Manuscript` (resource): `{id, type, title}` → points to manuscript
- `Monastic Institution` (resource): `{id, type, title}` → where it was made

**Dates:**
- `PU dating`: human-readable (e.g., "1454", "second half of 12th century")
- `Normalized terminus post quem`: YYYY-MM-DD (earliest possible date)
- `Normalized terminus ante quem`: YYYY-MM-DD (latest possible date)
- `Normalized century of production`: term ID (e.g., 9755 = 15th century)

**Location:**
- `PU country`: record ID
- `PU City`: record ID  
- `PU region`: record ID

**Physical:**
- `Number of Folios`: int
- `Number of Columns`: int
- `Material`: term ID
- `Watermark Present`: bool
- `Colophon Presence`: bool

**Content:**
- `Colophon transcription`: text
- `Colophon translation`: text
- `Codicology comments`: text

### Monastic Institutions (monastic_institutions.json)
- `Monastery name`: string
- `Country`: record ID
- `City`: record ID
- `Religious order`: term ID (e.g., 24196)
- `Type of monastery`: term ID
- `Creation date`: YYYY
- `Suppression date`: YYYY
- `Other names`: string

### Holding Institutions (holding_institutions.json)
- `Institution name`: string
- `Institution City`: string
- `City`: record ID (term?)
- `Country`: record ID
- `Latitude/Longitude`: geo coordinates

### Historical People (historical_people.json)
- Names, roles, associated manuscripts
- (need to examine structure)

### Texts (texts.json)
- Titles, authors, genres
- (need to examine structure)

### Relationships (relationships.json)
```json
{
  "Source record": {"id": "2652", "type": "114", "title": "Person name"},
  "Relationship type": 22065,  // term ID
  "Target record": {"id": "32382", "type": "115", "title": "Monastery"}
}
```

## Search Strategy

### Query: "Manuscripts from 15th century"
1. Filter `production_units` where:
   - `Normalized terminus post quem` <= 1499-12-31
   - `Normalized terminus ante quem` >= 1400-01-01
2. Extract `Manuscript.id` from filtered production units
3. Fetch manuscripts by IDs
4. Display results

###Query: "Manuscripts from Deventer"
1. Find City record where title = "Deventer" → get city_id
2. Filter `production_units` where `PU City` = city_id
3. Extract `Manuscript.id`
4. Fetch manuscripts by IDs
5. Display results

### Query: "Cistercian monasteries"
1. Find Religious order term where label = "Cistercian" → get term_id
2. Filter `monastic_institutions` where `Religious order` = term_id
3. Display results

### Query: "Manuscripts with colophons"
1. Filter `production_units` where `Colophon Presence` = TRUE
2. Extract `Manuscript.id`
3. Fetch manuscripts by IDs
4. Display with colophon transcriptions

## Implementation Needs

1. **Load all entity files** (done: manuscripts, institutions, monastics, people, texts)
2. **Load relationships.json** (TODO)
3. **Build lookup maps:**
   - Production Unit ID → Manuscript ID
   - City/Country IDs → Names
   - Term IDs → Labels
4. **Filtering logic:**
   - Date range filtering on production units
   - Location filtering via lookups
   - Text search on colophons/comments
5. **Result aggregation:**
   - Group by entity type
   - Show relationship context (e.g., "made at X monastery in Y city")

## Data Loading Priority

1. ✅ Load all JSON files
2. ✅ Build production_unit → manuscript map  
3. ❌ Build city/country ID → name lookups
4. ❌ Build term ID → label lookups
5. ❌ Parse relationships for scribal units
