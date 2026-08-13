---
layout: page
permalink: /documentation/
title: Documentation Hub
show_title: true
---

# Documentation Hub

Welcome to the Unknown Hands documentation. Choose the guide that fits your needs:

---

## What's New? (June 2026)

The transcription, viewer, search, and scribal-fingerprint systems now use an ALTO-first workflow. See the [Technical README](https://github.com/EstelleGvl/unknownhands#alto-transcription-and-iiif-annotation-pipeline) for the current pipeline commands and implementation notes.

- 131 manuscript search chunks are generated from available ALTO transcriptions.
- The transcription search index contains 2,278,894 searchable lines.
- The manuscript registry now contains 373 IIIF entries generated from `data/manuscripts.csv`.
- Search data is split into per-manuscript JSON files for faster loading.
- Scribal fingerprint profiles now use ALTO glyph/word coordinates, central text-area filtering, manuscript-level sample grouping, strict single-production-unit eligibility, multi-scribe folio-range segmentation, and profile links back to the viewer and database.
- 45 conservative public scribal fingerprint profiles are currently generated from the converted ALTO corpus, after excluding generic low-attribution `unidentified` hands.
- Four ALTO folders are waiting on corrected manifest URLs before conversion: `ms-15828`, `ms-15912`, `ms-16244`, and `ms-16316`.

---

## Available Documents

### [User Guide](/userguide/)

**Audience:** Researchers, students, general users

**Contents:**
- Getting started with the platform
- Complete guide to Browse & Search (with manuscript linking to transcriptions)
- Map, Timeline, and Network visualizations
- Statistical overview, Manuscript Structure, Scribes, Multilingualism, Colophons, and Textual Genres
- **IIIF Viewer tutorial** (viewing manuscripts with transcriptions)
- **Transcription search** (full-text search with manuscript comparison feature)
- Export features (CSV, high-res images, colophon text)
- Tips, tricks and FAQ

**Use this when:** You want to learn how to use the Explore Database page, view transcriptions, or search across manuscripts.

---

### [Transcription and Fingerprint Pipeline](https://github.com/EstelleGvl/unknownhands#alto-transcription-and-iiif-annotation-pipeline)

**Audience:** Researchers adding new transcriptions, project maintainers

**Contents:**
- System architecture for transcriptions
- Step-by-step workflow to add new transcriptions
- Converting ALTO XML to IIIF annotations
- Building search indexes
- Updating scribal fingerprint profiles from ALTO and Heurist data
- Troubleshooting common issues
- Performance optimization tips

**Use this when:** You need to add newly transcribed manuscripts to the platform.

---

### [Technical README](https://github.com/EstelleGvl/unknownhands/blob/main/README.md) (Project Root)

**Audience:** Developers, technical users, contributors

**Contents:**
- System architecture
- Technology stack
- Data pipeline
- Transcription system overview
- Website structure
- Development setup
- Deployment instructions
- Standards and interoperability

**Use this when:** You want to understand how the website is built, contribute code, or set up a development environment.

---

## Quick Links

- **Project Website:** https://estellegvl.github.io/unknownhands/
- **GitHub Repository:** https://github.com/EstelleGvl/unknownhands
- **Report Issues:** https://github.com/EstelleGvl/unknownhands/issues

---

*Last updated: June 2026*
