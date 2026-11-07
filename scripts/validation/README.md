# Validation

Commands run from the repository root. Catalogue exports are read from `data/heurist/`. Validation does not alter source records.

```bash
python3 scripts/validation/check_catalogue.py
node scripts/validation/check_explore_search.cjs
node scripts/validation/check_explore_map_export.cjs
node scripts/validation/check_codicology_research.cjs
bundle exec rake site:check_explore_cards
bundle exec jekyll build
```

| Check | Coverage |
| --- | --- |
| `check_catalogue.py` | Distinct records by type, unresolved pointers, manuscript links, and recorded colophon coverage |
| `check_explore_search.cjs` | Explicit search paths, direction, same-record conditions, branching, long paths, and catalogue link discovery |
| `check_explore_map_export.cjs` | Viewport preservation, a single capture, vector-overlay positions, and cursor restoration |
| `check_codicology_research.cjs` | Century filters, category counts, repeated text links, denominators, measurements, numerical summaries, and data-table coverage |
| `check_explore_card_styles.rb` | Shared chart and card markup conventions |

Unresolved pointers and missing observations are reported as coverage information. They can reflect records outside the public export. The catalogue summary does not assume a fixed expected record count or treat every missing field as an error.

`build_vocabulary.py` is a data-preparation utility rather than a test. It reads Heurist category labels and writes vocabulary files; execution changes generated data.

Browser verification covers topic and sub-tab navigation, period controls, table/chart agreement, downloads, manuscript images, keyboard operation, and narrow-screen layouts. External image-service availability requires a separate access check through `scripts/audit_iiif_transcriptions.py`.
