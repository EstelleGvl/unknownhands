---
layout: page
permalink: /userguide/
show_title: false
banner:
  image: "BnFfrançais603_81v.jpg"
  y: "50%"
  clickable: yes
  height: '500px'
  caption: "Christine of Pizan writing at her desk. BnF, français 603, f. 81v"
---

# Unknown Hands: User Guide

*Unknown Hands* brings together manuscripts, scribal contributions, institutions, texts, and evidence of female scribal production in pre-modern Europe. The catalogue records both named scribes and attributed anonymous hands. Attribution and dating can remain uncertain.

## Contents

- [Records and evidence](#records-and-evidence)
- [Browse & Search](#browse--search)
- [Advanced Search](#advanced-search)
- [Overview](#overview)
- [Manuscript Structure](#manuscript-structure)
- [Scribes](#scribes)
- [Multilingualism](#multilingualism)
- [Colophons](#colophons)
- [Textual Genres](#textual-genres)
- [Manuscript images and transcriptions](#manuscript-images-and-transcriptions)
- [Handwriting samples](#handwriting-samples)
- [Text analysis](#text-analysis)
- [Colophon questions](#colophon-questions)
- [Exports, links, and interpretation](#exports-links-and-interpretation)

## Records and evidence

| Record type | Meaning |
| --- | --- |
| Manuscript | A physical manuscript associated with the catalogue’s scribal evidence |
| Production Unit | A coherent part of manuscript production, with its own material, date, place, and physical features |
| Scribal Unit | A contribution attributed to a particular hand within a manuscript |
| Historical Person | A scribe, author, owner, patron, or another recorded person |
| Holding Institution | A library, archive, or other institution holding a manuscript |
| Monastic Institution | An institution associated with production or a recorded person |
| Text | A work contained in a manuscript or one of its units |
| Relationship | A recorded connection, sometimes with details such as role, language, folios, or attribution certainty |

A manuscript can contain several Production Units and several Scribal Units. Counts of these records describe different things and should not be treated as interchangeable.

## Browse & Search

The [Explore Database]({{ '/explore-database/' | relative_url }}) opens in Browse & Search. Record-type buttons select the list to browse. Filters appear on the left, results in the centre, and record details on the right.

1. Select a record type.
2. Enter a name, shelfmark, place, or other term in the search box. The field selector limits the search to a particular field.
3. Select filters to narrow the list. Standard filter results change automatically.
4. Select a result card to read its details. Linked names lead to connected records; relationship details provide attribution, folio, language, and role evidence where recorded.
5. Use the sorting and page controls to move through the results.

Search is case-insensitive and accepts partial words. Standard filters can be combined. **Clear all filters** resets the browsing filters and active advanced search.

**Export CSV** opens a field-selection panel and exports the matching records. The export is not restricted to the visible page of cards.

## Advanced Search

Advanced Search follows a path through the catalogue. Each step represents a particular record; conditions on that step describe that same record.

1. Open **Advanced Search** and choose a result type under **Return**.
2. Add field conditions to the starting record, or leave it unrestricted.
3. Select a field link or named relationship and press **Follow relationship**.
4. Add conditions at the connected-record step. Further steps can follow further relationships, without a fixed step limit.
5. Press **Apply advanced search**. Apply again after editing a path or condition.

**All conditions** and **Any condition** combine field conditions within one step. If a step has several branches, every branch must match. Conditions on a branch remain attached to its parent record.

### Example: manuscripts containing a devotional text by a female author

- Return **Manuscripts**.
- Follow the **Manuscript** field in the **target → source** direction to **Production Units**.
- At that step, a condition such as **catchwords equals TRUE** limits the Production Unit.
- Follow **Contains**, **source → target**, to **Texts**.
- Set **Subgenre equals Devotional Literature**.
- Follow **author of**, **source → target**, to **Historical People**.
- Set **Gender equals Female**, then apply the search.

The catchwords belong to the same Production Unit that contains the devotional text. The female person must be linked to that text through authorship; a female scribe or owner alone does not satisfy the author condition.

### Direction and relationship details

**Source → target** follows the link as stored in the catalogue. **Target → source** follows it in reverse. Some catalogue labels reflect database conventions; the direction and destination record type help identify the intended link.

Relationship records can also form steps. For example, a path through a relationship record can require a particular attribution certainty before continuing to its source or target.

Fields with recorded category values offer those values for an **equals** condition. Text conditions accept words or fragments. **Is present** and **is empty** test whether a field has a recorded value. A missing value is not evidence of historical absence. Date conditions accept years or year ranges; they are not a substitute for examining uncertain catalogue dating.

**Clear advanced search** removes the path’s active restrictions. Switching the result record type starts a path for that type. The expandable explanation beside the builder provides a short reminder of the controls.

## Overview

**Summary** presents record counts, distributions, and coverage. **Map** shows recorded production or holding locations, depending on the selected view. Clustering and heatmap controls change the display. **Export PNG** captures the visible map extent.

**Network** displays relationships between records. Nodes represent records; lines represent recorded connections. Available controls adjust the displayed records, links, and labels. Links and map points reflect catalogue coverage, rather than a complete account of manuscript survival or movement.

## Manuscript Structure

This section separates the structural record hierarchy from codicological comparisons. Topic tabs contain focused sub-tabs, with one chart or table shown at a time.

### Structure Explorer

The tree follows **Manuscript → Production Unit → Scribal Unit**. Shelfmark search, structure filters, sorting, and the display controls select the manuscripts shown. Markers identify units connected to several manuscripts or several Production Units.

**View data table** lists all filtered connections, including manuscripts beyond the initial display limit. Each row is a connection between records; a manuscript or unit can appear in several rows. **Download CSV** exports the complete filtered table.

### Century selection

The codicological topics share a **Period** line:

- **All centuries** includes the available dated and undated units.
- **14th–16th centuries** limits the sample to those recorded centuries.
- **Choose individual centuries** opens the century checkboxes beside the period buttons.

The sample count and chart change with the selection. Period selection carries across the codicological topics. It does not change the Structure Explorer’s separate controls.

### Materials

- **Materials over time:** the share of each known material within each selected century.
- **Material distribution:** known materials across the selected sample.
- **Materials by country:** material composition by recorded production country.
- **Text subgenres:** the proportion of units with each subgenre within each material.
- **Colophons:** colophon presence among units with an explicit presence or absence observation.

A unit with several subgenres can contribute to several subgenre rows. Those percentages need not sum to 100%.

### Quire Construction

**Quires over time**, **Quire types**, **Quires by country**, **Quires by material**, and **Text subgenres** compare the recorded quire classifications. Mixed or multi-valued descriptions are grouped as **Varia**. The unit of analysis is the Production Unit.

### Page Size & Layout

- **Page size by material** and **Page size by country** compare height plus width using box plots.
- **Height & width** plots manuscript dimensions. Point details identify the source manuscript; colour can show century, country, or monastic order.
- **Margins by material** estimates the share of page area outside the recorded writing area.
- **Writing area** and **Writing area by material** group the recorded share of the page occupied by text.

Box plots show the median and the middle half of observations. The whiskers show the observed minimum and maximum. The accompanying tables give the numerical summaries.

The height-and-width plot represents each manuscript once. Comparisons of page measurements with production features use Production Units; several units from one manuscript can therefore share its page dimensions. These comparisons exclude units without one unambiguous manuscript link. The margin estimate also requires writing-area measurements that fit inside the page. The writing-area views retain observations occupying 10%–90% of page area.

### Production Practices

**Ruling over time**, **Ruling methods**, **Catchwords over time**, **Signatures over time**, and **Catchwords & signatures** compare recorded production features. Presence rates use explicit TRUE/FALSE observations; unknown values are excluded from that denominator. Coverage and prevalence answer separate questions: how often a feature is recorded, and how often it is present among the recorded observations.

### Tables and downloads

Every Manuscript Structure view has a data table. **View data table** expands the values behind a chart; where the view itself is a table, the values remain visible. **Download CSV** exports the table. **Export PNG** downloads the chart.

Uncertain centuries and countries can contribute to several groups. A Production Unit is counted once within each comparison cell. Sample sizes, missing values, and the stated counting unit are essential to interpretation.

## Scribes

**Overview** and **Productivity Patterns** describe recorded scribal activity. **Collaborations** examines manuscripts with several scribal contributions and their recorded roles. **Geography** uses recorded places; **Browse All** provides paginated records.

{% unless site.explore_hidden_tabs.scribes contains 'unseen-species' %}
**Unseen Species Analysis** estimates how many scribes might be absent from the recorded sample using the distribution of observed activity. These are model-based estimates, not identified people. Their assumptions and the catalogue’s uneven coverage require attention.
{% endunless %}

## Multilingualism

The module contains **Overview**, **Multilingual Manuscripts**, **Scribal Multilingualism**, **Institutional Multilingualism**, and **Colophon-Text Divergence**.

Language relationships connect texts, scribal contributions, and institutions. A multilingual manuscript does not necessarily establish that each contributing scribe worked in every language. Colophon language and copied-text language are separate observations.

## Colophons

- **Overview & Method** describes coverage and the recorded evidence.
- **Browse & Read** provides available transcriptions and translations, including repeated colophon fields as separate readable entries.
{% unless site.explore_hidden_tabs['colophon-analysis'] contains 'formulae' %}
- **Formulae** groups recurring expressions.
{% endunless %}
- **Contexts** compares recorded languages, places, dates, and other catalogue features.

An English translation is a reading aid rather than the manuscript wording. Formulaic language and contextual interpretation should be checked against the transcription and images. The module does not treat translation punctuation, sentiment, or translation length as measurements of medieval scribal behaviour.

## Textual Genres

The module connects texts and genres with manuscripts, institutions, and scribes. Network views support the examination of recorded associations. Distribution views compare subgenres by institutions, countries, and centuries. Counts and proportions use the denominators stated beside each view.

Texts can carry several classifications, and manuscripts can contain several texts. The number of genre connections can exceed the number of manuscripts or scribes.

## Manuscript images and transcriptions

The [IIIF Viewer]({{ '/viewer/' | relative_url }}) loads images from institutional image services. Zoom, page navigation, available annotations, and transcription controls support comparison with the manuscript. Access depends on the holding institution’s image and manifest services.

[Search Transcriptions]({{ '/search-transcriptions/' | relative_url }}) searches indexed transcription text. Results link to manuscript pages where a reliable image-page mapping is available. Only indexed manuscripts are included. Transcriptions derived from handwriting recognition can contain errors; an unsuccessful search does not establish that a word or passage is absent from the manuscript.

## Handwriting samples

[Scribal Fingerprints]({{ '/scribal-fingerprints/' | relative_url }}) groups attributed handwriting crops with source links. Grapheme views compare examples of particular letters, while profile pages provide catalogue and manuscript context.

Samples require a reliable manuscript attribution and, for a manuscript with several scribes, a mappable folio range. Generic unidentified hands and ambiguous ranges are excluded from the public sample set. Crops are selected from transcription coordinates and require checking against the source image.

## Text analysis

The [Text Analysis]({{ '/text-analysis/' | relative_url }}) page compares selected transcription samples in the browser. Available inputs include attributed scribal segments, manuscript text bodies, and supplied text files.

1. Select samples and add them to the comparison corpus.
2. Choose the analysis method and its settings.
3. Run the analysis and inspect the plotted results and tables.
4. Check the sample lengths, folio boundaries, transcription quality, and source records.

Word or character frequency comparisons, principal component plots, clustering, and rolling comparisons identify patterns in transcription text. Similarity can reflect genre, language, exemplar, spelling, recognition errors, or sample length. These results do not establish scribal identity without independent evidence.

The method notes on that page describe individual measurements. The research reference used for the stylometric methods is retained with the repository’s literature.

## Colophon questions

The [colophon question service]({{ '/chatbot/' | relative_url }}) retrieves selected indexed passages and uses an automated language model to produce a referenced response. The index covers colophons, not every manuscript field. Responses can omit evidence or contain errors and require verification against the cited passages and catalogue records.

Exact counts and exhaustive record searches belong in Browse & Search or a CSV export. The question service is not an alternative database-counting method.

## Exports, links, and interpretation

- **CSV** preserves tabular results for further analysis. The table’s counting unit and exclusions remain part of the result.
- **PNG** records the displayed chart or map. Print suitability depends on image dimensions and intended reproduction size.
- Primary modes and topic tabs are recorded in the page URL. Century selection, individual chart choices, and advanced search paths are not encoded in those links.
- Unknown and TBC values are omitted from known-category charts but remain part of the catalogue where recorded.
- Low counts, uneven survival, inconsistent cataloguing, and uncertain attribution limit comparisons. A missing field is not a negative observation.
- Source-image reuse is governed by the holding institution’s terms. Project and manuscript references belong with published analyses.

Questions about records, corrections, or source access can be directed through the [Contact]({{ '/contact/' | relative_url }}) page. Technical setup and validation commands are in the [repository README](https://github.com/EstelleGvl/unknownhands#readme).
