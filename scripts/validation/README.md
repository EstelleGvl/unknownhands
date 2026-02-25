# Validation Scripts

This folder contains Python scripts used during development for data validation, exploration, and quality assurance. These scripts were used to verify data integrity and explore the Heurist database structure.

## Scripts

### Data Analysis
- **analyze_complete.py** - Complete data analysis across all entity types
- **analyze_data.py** - Sample data exploration for holding/monastic institutions
- **analyze_relationships.py** - Relationship traversal analysis

### Data Validation
- **check_colophons.py** - Verify colophon presence flags vs actual transcriptions
- **check_counts.py** - Count validation for production units
- **check_correct_counts.py** - Verify correct record counts
- **check_pu_ms_links.py** - Validate production unit ↔ manuscript linkages
- **verify_colophons.py** - Additional colophon validation

### Data Processing
- **build_vocabulary.py** - Build term vocabulary mappings (generates vocabulary.json)
- **colophon_manuscript_overlap.py** - Analyze colophon-manuscript relationships

## Usage

These scripts were primarily used during development for data exploration and quality checks. Most require the Heurist JSON data files in `assets/data/`.

**Note**: These scripts are kept for reference but are not part of the active build pipeline. For active data processing scripts, see the parent [scripts/](../) folder.
