# Chatbot Vision & Example Questions

## Two Modes

### 1. **SEARCH MODE** (What we're building now)
Filter database → show matching records

**Example Questions:**
- "Show me manuscripts from the 15th century"
- "Which manuscripts are held in Canterbury?"
- "Manuscripts copied in Deventer"
- "Show me manuscripts with watermarks"
- "Benedictine monasteries in Germany"

### 2. **ANALYSIS MODE** (Future enhancement)
Retrieve relevant text → AI analyzes → answer questions

**Example Questions:**
- "How do women describe themselves in colophons?"
- "What themes appear in transcriptions about prayer?"
- "Compare how different scribes talk about their work"
- "Summarize the religious themes in 15th century manuscripts"
- "What do colophons reveal about women's education?"
- "How often are women mentioned as patrons?"

## Cool Research Questions

### Identity & Self-Representation
- "How do female scribes identify themselves compared to male scribes?"
- "What titles and roles do women use in colophons?"
- "Do women scribes mention their education or training?"

### Networks & Relationships
- "Which monasteries had the most female scribes?"
- "Are there connections between specific convents and text types?"
- "What cities had the most active scriptoria with women?"

### Textual Production
- "What types of texts did women copy most frequently?"
- "Which authors appear most in women's manuscripts?"
- "Are certain text types associated with specific time periods?"

### Material Culture
- "How does manuscript size vary by region?"
- "What percentage of manuscripts have digitization?"
- "Which manuscripts have IIIF available?"

## Technical Implementation

### Phase 1 (Current): Search Mode
✅ Gemini parses natural language → structured filters  
✅ Filter manuscripts/monasteries/people by date, location, etc.  
✅ Display results with metadata

### Phase 2: Analysis Mode
◻️ Detect question type (search vs analysis)  
◻️ For analysis: keyword search transcriptions → find relevant passages  
◻️ Send passages to Gemini with user's question  
◻️ Display AI-generated answer with source citations

## Data Fields Available

### Manuscripts
- rec_Title (holding institution + shelfmark)
- Digitization Status/Type
- IIIF Status
- Comments (bibliographic info)
- watermark
- Codex height/width
- Date (need to find field ID)
- City/Country (need to find field IDs)

### Monastic Institutions
- Location (city, country)
- Religious order
- Time period

### Historical People
- Names
- Roles
- Associated manuscripts

### Texts
- Titles
- Authors
- Genres/topics
