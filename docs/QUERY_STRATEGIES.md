# Complete Database Relationship Map & Query Strategies

## Entity Summary

| Entity | Count | Key Purpose |
|--------|-------|-------------|
| **Manuscripts** | 2,205 | Physical codices (held in libraries) |
| **Production Units** | 5,161 | Codicological units (where/when made) |
| **Scribal Units** | 15,162 | Copying units (who wrote what) |
| **Texts** | 2,575 | Works copied in manuscripts |
| **Historical People** | 2,417 | Scribes, authors, patrons |
| **Holding Institutions** | 230 | Libraries/archives |
| **Monastic Institutions** | 3,674 | Monasteries/convents where books were made |
| **Relationships** | 9,465 | Connections between entities |

## Entity Relationships

```
Manuscript
   ↓ [Holding Institution] (resource pointer)
Holding Institution (city, country, type)

Manuscript
   ↑ [Manuscript] (resource pointer from Production Unit)
Production Unit (dates, location, colophon, material)
   ↓ [Monastic Institution] (resource pointer)
Monastic Institution (city, country, order, creation date)

Manuscript
   ↑ [Manuscript] (resource pointer from Scribal Unit)  
Scribal Unit (dates, script, colophon)
   ↔ [Relationships]
Historical Person (name, gender, role)

Scribal Unit
   ↔ [Relationships]
Text (title, genre, language)
```

## Key Fields for Searching

### DATE QUERIES
**Source:** Production Units & Scribal Units
- `Normalized terminus post quem`: earliest date (YYYY-MM-DD)
- `Normalized terminus ante quem`: latest date (YYYY-MM-DD)
- `Normalized century of production`: term ID (9752=12th, 9755=15th, 9756=16th)
- `PU dating` / `SU dating`: human-readable text

**Query Strategy:**
1. Filter production_units/scribal_units by date range
2. Extract linked manuscript IDs
3. Display manuscripts with date context

### LOCATION QUERIES (where made)
**Source:** Production Units
- `PU country`: term/record ID
- `PU City`: term/record ID  
- `PU region`: term/record ID

**Source:** Monastic Institutions (via production unit link)
- `City`: term ID
- `Country`: term ID
- `Monastery name`: text

**Query Strategy:**
1. Lookup city/country ID from term name
2. Filter production_units by PU City/country
3. OR filter monastic_institutions, then find production_units linked to them
4. Extract manuscript IDs

### LOCATION QUERIES (where held)
**Source:** Manuscripts → Holding Institutions
- Manuscript.`Holding Institution`: resource pointer
- HoldingInstitution.`City`: term ID
- HoldingInstitution.`Country`: term ID
- HoldingInstitution.`Institution City`: text string

**Query Strategy:**
1. Filter holding_institutions by city/country
2. Find manuscripts linked to them
3. Display

### CONTENT QUERIES (what texts)
**Source:** Relationships
- `Source record`: Text entity
- `Target record`: Scribal Unit entity
- `Expression`: text title string
- `Text Language(s)`: language term
- `Folio range`: where in manuscript

**Query Strategy:**
1. Search texts by title/genre
2. Find relationships where source = text
3. Get target scribal units
4. Get linked manuscripts

### PEOPLE QUERIES (who copied)
**Source:** Relationships
- `Source record`: Historical Person
- `Target record`: Could be Monastery, Scribal Unit, etc.
- `Relationship type`: defines the relationship
- `Scribe role`: scribe, illuminator, patron, etc.
- `Scribe Comments`: additional info

**Query Strategy:**
1. Search historical_people by name/gender
2. Find relationships where source = person
3. Identify relationship type
4. Get connected entities (monasteries, scribal units)
5. Traverse to manuscripts

### COLOPHON QUERIES
**Source:** Production Units & Scribal Units
- `Colophon Presence`: boolean
- `Colophon transcription`: full text
- `Colophon translation`: English text
- `Colophon language`: language term

**Query Strategy:**
1. Filter PU/SU where Colophon Presence = TRUE
2. Full-text search in transcription/translation
3. Get linked manuscripts
4. Show colophon text with results

### MATERIAL/PHYSICAL QUERIES
**Source:** Production Units
- `Material`: parchment/paper term
- `Watermark Present`: boolean
- `Number of Folios`: int
- `Number of Columns`: int
- `Decoration Presence`: boolean

**Source:** Manuscripts
- `Codex height/width`: float (mm)
- `watermark`: boolean

**Query Strategy:**
1. Filter production_units by material/physical features
2. Get manuscripts

### DIGITIZATION QUERIES
**Source:** Manuscripts
- `Digitization Status`: boolean term
- `IIIF Status`: boolean term
- `Digitization link(s)`: URL
- `IIIF Manifest Link(s)`: URL

**Query Strategy:**
1. Filter manuscripts where digitization status = TRUE
2. Display with links

## Complex Query Examples

### "Manuscripts from 15th century Deventer"
1. Lookup city "Deventer" → get city_id
2. Filter production_units where:
   - `PU City` = city_id
   - `Normalized terminus post quem` <= 1499-12-31
   - `Normalized terminus ante quem` >= 1400-01-01
3. Extract manuscript IDs
4. Display with production unit details

### "Cistercian manuscripts with colophons"
1. Lookup order "Cistercian" → get order_id
2. Filter monastic_institutions where `Religious order` = order_id
3. Get monastery IDs
4. Filter production_units where:
   - `Monastic Institution` in monastery IDs
   - `Colophon Presence` = TRUE
5. Extract manuscript IDs
6. Display with monastery name, colophon text

### "Women scribes in Munich"
1. Lookup city "Munich" → get city_id
2. Filter historical_people where `Gender` = Female
3. Find relationships where:
   - Source = person
   - Relationship type = scribe
4. Get target entities (scribal units, monasteries)
5. Filter for Munich connection
6. Get manuscripts

### "Prayer texts in Middle Dutch"
1. Lookup genre "Prayer" and language "Middle Dutch"
2. Filter texts where genre = prayer
3. Find relationships linking texts to scribal units
4. Filter by language
5. Get manuscripts

## Implementation Roadmap

### Phase 1: Basic Filtering ✅ NEEDED FIRST
- [x] Load all 8 JSON files
- [ ] Build ID → entity lookup maps
- [ ] Build term ID → label maps (for city names, etc.)
- [ ] Implement date range filtering
- [ ] Implement location filtering via IDs
- [ ] Traverse manuscript ← production unit relationship

### Phase 2: Advanced Traversal
- [ ] Parse relationships.json
- [ ] Build relationship type mappings
- [ ] Implement person → manuscript queries
- [ ] Implement text → manuscript queries
- [ ] Show rich context (monastery names, dates, locations)

### Phase 3: Full-Text Search
- [ ] Index colophon transcriptions/translations
- [ ] Implement keyword search on colophons
- [ ] Combine with filters (e.g., "colophons mentioning God in 15th century")

### Phase 4: AI Analysis
- [ ] Detect analytical vs factual queries
- [ ] For analytical: retrieve relevant passages
- [ ] Send to Gemini for analysis
- [ ] Display AI-generated insights with citations
