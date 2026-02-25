# Complete Heurist Database Structure Analysis

Generated: 2026-02-24

## Summary

- **manuscripts**: 2205 records, 20 fields
- **production_units**: 5161 records, 39 fields
- **scribal_units**: 15162 records, 17 fields
- **texts**: 2575 records, 7 fields
- **historical_people**: 2417 records, 7 fields
- **holding_institutions**: 230 records, 10 fields
- **monastic_institutions**: 3674 records, 12 fields
- **relationships**: 9465 records, 15 fields

---

## MANUSCRIPTS

**Total Records:** 2205

**Fields:** 20

| Field Name | Type | Example Values |
|------------|------|----------------|
| Call number | freetext | AG 2.38 • Ms. 277 |
| Catalogue Record Link(s) | freetext | https://www.handschriftencensus.de/10781 • https://calm.abdn.ac.uk/archives/Record.aspx?src=CalmView.Catalog&id=MS+277 |
| Cataloguing | enum | 9729 • 9731 |
| Codex height | float | 215 • 305 |
| Codex width | float | 145 • 95 |
| Codicology comments | blocktext | Bound together from three different parts. New foliation 1–97.
Fols. 1 and 97 are parchment. |
| Comments | blocktext | Wieland Schmidt, Die vierundzwanzig Alten Ottos von Passau (Palaestra 212), Leipzig 1938 (Nachdruck  • Wilhelm Wattenbach, Reise nach Österreich in den Jahren 1847, 1848, 1849 [Verzeichniß der auf dieser |
| Dating Comments | blocktext | Part I: around 1500, Part II: 1459 (fol. 50v, 180v), Part III: end of the 15th century (Schneider p. |
| Digitization Status | enum | 5442 • 5442 |
| Digitization Type | enum | 9725 • 9725 |
| Digitization link(s) | freetext | https://manuscripta.at/diglit/AT1000-16/0001 • https://manuscripta.at/diglit/AT1000-17/0001 |
| Holding Institution | resource | {'id': '22', 'type': '113', 'title': 'Aargau Cantonal Library', 'hhash': None} • {'id': '111', 'type': '113', 'title': 'Aberdeen University', 'hhash': None} |
| IIIF Manifest Link(s) | freetext | https://manuscripta.at/diglit/iiif/AT1000-16/manifest.json • https://manuscripta.at/diglit/iiif/AT1000-17/manifest.json |
| IIIF Status | enum | 5442 • 5442 |
| Identification comments | blocktext | p.133 • Auckland. Auckland Libraries, Med. MS G. 119 |
| Ms Dating | freetext | 1454 • 1600 |
| Number of folios | float | 285 • 342 |
| Seen in Person | enum | 5442 • 5442 |
| Watermark Identification | freetext | To be identified • To be identified |
| watermark | enum | 5444 • 5444 |

## PRODUCTION UNITS

**Total Records:** 5161

**Fields:** 39

| Field Name | Type | Example Values |
|------------|------|----------------|
| Cataloguing | enum | 9729 • 9729 |
| Codicology comments | blocktext | Needs to be seen in person • One parchment bifolio in the second quire. |
| Colophon Presence | enum | 5444 • 5442 |
| Colophon comments | blocktext | f.279v: durch die ersamen und geistlichen frowen fro Sophyen Swartzmurerin closterfrow ze Hermanschw • f.140v: Cum tibi verborum fructum quis colligis horum,
Hic ut aratoris vescens messorque satoris,
Ut |
| Colophon language | enum | 471 • 9595 |
| Colophon transcription | blocktext | durch die ersamen und geistlichen frowen fro Sophyen Swartzmurerin closterfrow ze Hermanschwil • Cum tibi verborum fructum quis colligis horum,
Hic ut aratoris vescens messorque satoris,
Ut sis scr |
| Colophon translation | blocktext | By the honorable and spiritual lady, Lady Sophie Swartzmurer, nun at the convent of Hermanswil.” • When you, who gather the fruit of these words,
Feed here like the reaper and sower of the ploughman, |
| Decoration Comments | blocktext | Decorated initials • An offset with painted decoration on fol. 13r indicates that a miniature or painted print was added  |
| Decoration Presence | enum | 5443 • 5444 |
| Extent | freetext | Full manuscript • Full manuscript |
| Extent comments | blocktext | Aargau Cantonal Library, AG 2.38, Formerly Dep. 001 Q 1
The manuscript is partly cited in the litera • Admont Stiftsbibliothek, Admont Ms.16 |
| Manuscript | resource | {'id': '15369', 'type': '118', 'title': 'Aargau Cantonal Library, AG 2.38', 'hhash': None} • {'id': '15624', 'type': '118', 'title': 'Aberdeen University, Ms. 277', 'hhash': None} |
| Material | enum | 9598 • 9599 |
| Monastic Institution | resource | {'id': '13083', 'type': '115', 'title': 'Hermetschwil Abbey, Cistercian, Hermetschwil-Staffeln, Swit • {'id': '10532', 'type': '115', 'title': 'Admont Abbey, Benedictine, Admont, Austria, 1054', 'hhash': |
| Musical Notation Comments | blocktext | Writing area 7.2–9 × 5.2–6 cm.
9–10 lines per text page.

Melodies on ff. 1r–15v and 24r–76v, writte • Black square musical notation on staff. |
| Musical Notation Presence | enum | 5443 • 5442 |
| Normalized century of production | enum | 9755 • 9756 |
| Normalized terminus ante quem | date | 1454-12-31 • 1600-12-31 |
| Normalized terminus post quem | date | 1454-01-01 • 1501-01-01 |
| Number of Columns | float | 1 • 2 |
| Number of Folios | float | 285 • 342 |
| Number of Quires | float | 18 • 14 |
| PU City | enum | 25596 • 10540 |
| PU Latitude | geo | {'geo': {'type': 'p', 'wkt': 'POINT(8.827108 47.3948686)'}} • {'geo': {'type': 'p', 'wkt': 'POINT(14.4615721 47.573782)'}} |
| PU Longitude | geo | {'geo': {'type': 'p', 'wkt': 'POINT(8.827108 47.3948686)'}} • {'geo': {'type': 'p', 'wkt': 'POINT(14.4615721 47.573782)'}} |
| PU country | enum | 388 • 217 |
| PU dating | freetext | 1454 • 1600 |
| PU region | enum | 25474 • 25538 |
| Quire types | enum | 25455 • 25455 |
| Watermark Identification | freetext | To be identified • To be identified |
| Watermark Present | enum | 5444 • 5442 |
| catchwords | enum | 22019 • 22019 |
| collation | blocktext | Analysis based on signatures on the digitization. • 1(10-1), 2-3(8), 4(10-1), 5(8), 6(8-1), 7-13(8), 14(4). |
| justification : height (mm) | freetext | 160 • 180 |
| justification : width (mm) | freetext | 95 • 130 |
| max_lines | float | 32 • 40 |
| min_lines | float | 29 • 40 |
| ruling_type | enum | 24358 • 24358 |
| signatures | enum | 22019 • 22019 |

## SCRIBAL UNITS

**Total Records:** 15162

**Fields:** 17

| Field Name | Type | Example Values |
|------------|------|----------------|
| Cataloguing | enum | 9729 • 9729 |
| Colophon comments | blocktext | achterin: "Item dit boec heeft ghescreven Suster Aef Heynricxdochter van Haerlem, bid voer haer om G • f.71v: Abirhilt |
| Colophon language | enum | 467 • 9595 |
| Colophon presence | enum | 5442 • 5444 |
| Colophon transcription | blocktext | Item dit boec heeft ghescreven Suster Aef Heynricxdochter van Haerlem, bid voer haer om Gods willen. • Abirhilt |
| Colophon translation | blocktext | Also, this book was written by Sister Aef Heynricxdochter from Haarlem, pray for her for God's sake. • Abirhilt |
| Extent | freetext | Full manuscript • Full manuscript |
| Manuscript | resource | {'id': '15994', 'type': '118', 'title': 'Munich, Bayerische Staatsbibliothek, Cgm 4478', 'hhash': No • {'id': '15638', 'type': '118', 'title': 'Darmstadt, Hessische Landes- und Hochschulbibliothek, 1912' |
| Normalised script(s) | enum | 24356 • 24356 |
| Normalized century of production | enum | 9756 • 9755 |
| Normalized terminus ante quem | date | 1510-12-31 • 1490-12-31 |
| Normalized terminus post quem | date | 1510-01-01 • 1490-01-01 |
| PU Comments | blocktext | Darmstadt, Hessische Landes- und Hochschulbibliothek, 1912 • Würzburg Universitätsbibliothek, M.p.th.f.45, Several hands. The last scribe Abirhilt gives her name |
| SU dating | freetext | 1510 • ca 1490 |
| Scribe Comments | blocktext | On 305v initials (?): A.H., possibly the scribe or an owner; in the Pütrich convent at this time onl • Aaf Hendrikdsr van Haarlem, Brussels, Colophon, High |
| Script Comments | blocktext | Anglo-Saxon minuscule • Anglo-Saxon minuscule |
| Text(s) comments | blocktext | 1. 1r–158r: St. Trudperter Hohes Lied
2. 162r–245v: Myrrh-Bundle Treatise on the Passion of Christ
3 • Dietrich of Apolda. Legends, Dutch, Middle-Dutch |

## TEXTS

**Total Records:** 2575

**Fields:** 7

| Field Name | Type | Example Values |
|------------|------|----------------|
| Cataloguing | enum | 9729 • 9729 |
| Genre | enum | 24378 • 24378 |
| Genre Comments | blocktext | Theological Treatises • Doctrinal / Dogmatic Texts |
| Identification comments | blocktext | Adelheid of Lich • Adolf of Essen |
| Normalized Title | enum | 25166 • 25287 |
| Subgenre | enum | 24399 • 24381 |
| other titles | freetext | Unser Vrowen Wen Mariae Rosengertlin • De dignitate et utilitate psalterii virginis Mariae |

## HISTORICAL PEOPLE

**Total Records:** 2417

**Fields:** 7

| Field Name | Type | Example Values |
|------------|------|----------------|
| Cataloguing | enum | 9730 • 9730 |
| Gender | enum | 415 • 415 |
| Gender certainty | enum | 9734 • 9733 |
| Name of Person | freetext | A. Brunner • A.H. (Sister Anna Honoldin?), Munich |
| Person type | enum | 5434 • 5434 |
| Personal Data Comments | blocktext | abbess of Heggbach 1480–1509 • Agnes von Mülheim: Prioress of Strasbourg Dominican convent of St. Margaret and St. Agnes,Strasbourg |
| Religious or Lay Status | enum | 22022 • 22022 |

## HOLDING INSTITUTIONS

**Total Records:** 230

**Fields:** 10

| Field Name | Type | Example Values |
|------------|------|----------------|
| Cataloguing | enum | 9728 • 9728 |
| City | enum | 9943 • 10540 |
| Country | enum | 388 • 388 |
| Institution City | freetext | Aargau • Aarau |
| Institution name | freetext | Aargau Cantonal Library • Aberdeen University |
| Institution type | enum | 10957 • 10960 |
| Latitude | geo | {'geo': {'type': 'p', 'wkt': 'POINT(8.0449158 47.3896982)'}} • {'geo': {'type': 'p', 'wkt': 'POINT(8.0457015 47.390434)'}} |
| Longitude | geo | {'geo': {'type': 'p', 'wkt': 'POINT(8.0449158 47.3896982)'}} • {'geo': {'type': 'p', 'wkt': 'POINT(8.0444448 47.3927146)'}} |
| Name Comments | blocktext | Colmar, Bibliothèque des Dominicains • Cologne, Schnutgen-Museum |
| Website link | freetext | https://www.ag.ch/kantonsbibliothek/ • https://stiftadmont.at/en/ueber-die-stiftsbibliothek/ |

## MONASTIC INSTITUTIONS

**Total Records:** 3674

**Fields:** 12

| Field Name | Type | Example Values |
|------------|------|----------------|
| Cataloguing | enum | 9730 • 9730 |
| City | enum | 23489 • 22087 |
| Country | enum | 182 • 195 |
| Creation date | date | 1220 • 1403-01-01 |
| Monastery name | freetext | Aachen-Burtscheid • Aalborg Abbey (Abbey of Our Lady, Aalborg) |
| Monastic Matrix link | freetext | https://arts.st-andrews.ac.uk/monasticmatrix/monasticon/aachen-burtscheid • https://arts.st-andrews.ac.uk/monasticmatrix/monasticon/mont-notre-dame-les-provins https://arts.st- |
| Other names | freetext | Porcetum • Abbaye de Moorsel |
| Reform date | date | 1536-01-01 • 1503-01-01 |
| Religious order | enum | 24196 • 24085 |
| Scriptorium Comments | blocktext | further research necessary • Benedictine |
| Suppression date | date | 1803 • 1789-01-01 |
| Type of monastery | enum | 24348 • 415 |

## RELATIONSHIPS

**Total Records:** 9465

**Fields:** 15

| Field Name | Type | Example Values |
|------------|------|----------------|
| Expression | freetext | Dietrich of Apolda. Legends • Homiliae in evangelia |
| Folio range | freetext | Full manuscript • Unclear |
| Folio range in PU | freetext | Full manuscript • Full manuscript |
| Function of Copying | enum | 22028 • 22028 |
| Production info | freetext | Initials and attribution • Colophon |
| Relationship type | relationtype | 22065 • 3108 |
| Scribe Comments | blocktext | A.H., Munich, , • On 305v initials (?): A.H., possibly the scribe or an owner; in the Pütrich convent at this time onl |
| Scribe role | enum | 22035 • 22035 |
| Source record | resource | {'id': '2652', 'type': '114', 'title': 'A.H. (Sister Anna Honoldin?), Munich, Female', 'hhash': None • {'id': '21755', 'type': '119', 'title': 'A.H., Munich, Female, Munich, Bayerische Staatsbibliothek,  |
| Style | enum | 24370 • 24370 |
| Target record | resource | {'id': '32382', 'type': '115', 'title': 'Pütrich convent, Munich, Germany', 'hhash': None} • {'id': '2652', 'type': '114', 'title': 'A.H. (Sister Anna Honoldin?), Munich, Female', 'hhash': None |
| Text Dialect(s) | enum | 25375 |
| Text Language(s) | enum | 467 • 9595 |
| Text(s) comments | blocktext | Gregory the Great, Homiliae in evangelia, Latin
Homilies on the Gospels • 1r - 12v : Paul <Apostle>: Epistle to the Romans
12v - 23v : Paul <Apostle>: 1 Corinthians
23v - 30v |
| scribe certainty | enum | 9735 • 9733 |

