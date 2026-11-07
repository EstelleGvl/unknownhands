# Transcription text analysis

The `/text-analysis/` page performs text comparisons in the browser. Its calculations and interface are in `pages/text-analysis.md`; `assets/analysis/scribe-text-index.json` supplies attributed text segments. Manuscript text comes from `assets/search/manuscripts/`.

The page provides word and character frequency comparisons, principal component plots, clustering, repeated-clustering summaries, and rolling comparisons with two reference samples. Controls select features, sample lengths, distance measures, and other settings. The page’s method notes describe the calculations.

## Building the scribal text index

```bash
python3 scripts/analysis/build_scribe_text_index.py
```

The script reads:

- `data/paleography/scribe_to_manuscript_v2.json`;
- `assets/search/manuscripts/index.json` and manuscript transcription files;
- `data/annos/` for page mappings;
- `data/manifests.yml` and `data/manuscripts.csv` for manuscript labels and image references.

The output joins catalogue folio ranges to image-page labels and transcription page IDs. Ambiguous boundaries are excluded from attributed text segments. A missing source or an unmatched folio range affects sample availability.

## Standalone frequency experiment

`tfidf.py` is a separate local experiment for the Wessobrunn manuscript samples. It is not called by the website. The `BASE` directory, manuscript labels, and folio limits in its configuration must match the available local transcription files.

```bash
python3 -m pip install -r scripts/analysis/requirements.txt
python3 scripts/analysis/tfidf.py
```

The experiment includes frequency-based classification and plots. Its configured inputs and sample labels are part of the research method; results are not catalogue assertions.

## Interpretation

Transcription similarity can reflect language, text, exemplar, spelling, sample length, transcription conventions, or recognition errors. Attributed scribal comparisons require reliable manuscript and folio evidence. Plots support the examination of hypotheses rather than automatic identification of scribes.

The [project README](../../README.md) describes site setup and data preparation. The [user guide](../../pages/USER_GUIDE.md#text-analysis) describes the browser interface. Research literature is retained in `references/` and excluded from the website build.
