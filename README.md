# 🕯 Unknown Hands — Technical Architecture Overview

> *Unknown Hands* is a digital research and publication ecosystem designed to document, analyze, and visualize the work of pre-modern female scribes (before 1600).  
> It integrates structured metadata (Heurist), manuscript images and IIIF manifests, machine-readable transcriptions, and searchable interfaces.

---

## 1. System Overview
    +---------------------------+
    |        Heurist DB         |
    | (research data model)     |
    |  - Scribal Units          |
    |  - Production Units       |
    |  - Manuscripts            |
    +------------+--------------+
                 |
       CSV/JSON Export
                 ↓
    +---------------------------+
    |    Python Data Pipeline    |
    |---------------------------|
    | setup_manuscripts.py      | → creates folders, manifest registry
    | pagexml_to_iiif.py        | → converts PAGE-XML → IIIF Annotation JSON
    | build_search_index.py     | → builds full-text search index
    +------------+--------------+
                 |
          Derived Data
                 ↓
    +---------------------------+
    |         Data Layer         |
    |----------------------------|
    | /data/manifests.yml        |
    | /data/records.json         |
    | /data/annos/<slug>/*.json  |
    | /data/search_index.json    |
    +------------+--------------+
                 |
         Static Site Build
                 ↓
    +---------------------------+
    |  Jekyll + JavaScript Site  |
    |----------------------------|
    | /explore-database/  → Browse Heurist data
    | /viewer/            → View IIIF + transcriptions
    | /search-transcriptions/ → Full-text/fuzzy search
    +---------------------------+


    ---

## 2. Core Components

### 🧩 Heurist Database
- Central research model defining entities and relationships:
  - *Scribal Unit*, *Production Unit*, *Manuscript*, *Text*, *Person*, *Language*, *Institution*.
- Exports periodically as CSV/JSON to feed the static site.
- Serves as **authoritative metadata** and **relational backbone**.

### ⚙️ Python Scripts
| Script | Role |
|--------|------|
| `setup_manuscripts.py` | Reads `data/manuscripts.csv`, creates annotation folders, and registers manifests in `data/manifests.yml`. |
| `pagexml_to_iiif.py` | Converts eScriptorium PAGE-XML exports into IIIF Web Annotations (`p1.ap.json`, `p2.ap.json`, …) and builds a `mapping.json` linking canvases to annotations. |
| `build_search_index.py` | Aggregates all annotation texts into a searchable JSON index used by the “Search Transcriptions” page. |

### 📁 Data Layer
- **`/data/manifests.yml`** — master registry linking manuscript slugs to manifest URLs.
- **`/data/annos/<slug>/`** — holds per-manuscript annotation pages and mapping files.
- **`/data/search_index.json`** — global text index for fuzzy/full-text search.
- **`/data/records.json`** — exported Heurist dataset for the database explorer.

### 🌐 Jekyll Website
A modular static site using:
- **Jekyll** for content and layout
- **JavaScript** for dynamic functionality
- **Mirador 3** for IIIF viewing

#### Main pages:
| Page | Function | Linked Data |
|------|-----------|--------------|
| `/explore-database/` | Browse Heurist records with facets and filters. | `data/records.json` |
| `/viewer/` | View digitized manuscript images with synchronized transcriptions. | IIIF manifest + `mapping.json` |
| `/search-transcriptions/` | Search across all transcriptions, show folio and viewer link. | `data/search_index.json` |

---

## 3. Data Flow Summary

1. **Heurist** → exports structured records.
2. **eScriptorium** → exports transcriptions as PAGE-XML.
3. **Python scripts** → normalize and transform both into standardized IIIF-compliant JSON.
4. **Static site build** → Jekyll + JavaScript use these data files to create interactive interfaces.

---

## 4. Interoperability & Standards

| Standard | Use |
|-----------|-----|
| **IIIF Presentation API (v2/v3)** | Access to manuscript images and metadata. |
| **Web Annotation Data Model** | Structuring line-level transcription data. |
| **PAGE-XML (PRImA format)** | Input from HTR models (eScriptorium). |
| **JSON / YAML** | Interchange and storage for local data. |
| **CSV** | Simple import/export bridge with Heurist. |

---

## 5. Sustainability

- Entire system runs on **static files** (no server required).
- Compatible with **GitHub Pages** hosting.
- Reproducible data pipeline (Heurist + Python + IIIF standards).
- Modular: each manuscript or dataset can be regenerated independently.

---

## 6. Integration Diagram
Heurist DB ──┬──► Exported Metadata (CSV)
│
├──► Python Setup Scripts ──► data/manifests.yml
│                             data/annos//
│                             data/search_index.json
│
eScriptorium ─┘──► PAGE-XML ──► IIIF Annotation JSON
│
▼
Jekyll + JS Website
├─ /explore-database/
├─ /viewer/
└─ /search-transcriptions/



---

## 7. Key Principles

- **Transparency:** All transformations are documented and reproducible.
- **Interoperability:** Uses IIIF and Web Annotation standards.
- **Humanistic grounding:** Every digital layer remains connected to codicological and historical evidence.
- **Scalability:** New manuscripts and transcriptions can be added incrementally.
- **Accessibility:** Designed for open access and reuse in the field of medieval studies.

---

## 8. Future Extensions

- Dynamic linkage back to Heurist entries via API.
- IIIF Highlights for line selection within Mirador.
- Integration with text-mining and stylistic analysis modules.
- Persistent identifiers for manuscripts and scribes.

---

*Maintained by:*  
**Estelle Guéville** — Yale University, Medieval Studies  
Director of the *Unknown Hands* project.