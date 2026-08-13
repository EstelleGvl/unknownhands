# IIIF and Transcription Audit

Generated: 2026-08-05 14:25:02 +0200

## Summary

- Registry manifests: 373
- Valid/reachable manifests: 349
- Unresolved manifests: 24
  - Rate-limited after direct and proxy retries: 14
  - Missing manifest URL: 2
  - Provider or endpoint failure: 8
- Manifests verified through the deployed proxy: 10
- Successful representative image probes: 348
- Failed representative image probes: 1
- Manuscripts with annotation mappings: 127
- Manuscripts with deployed transcription corpora: 131
- Annotation pages checked: 49618
- Annotation lines checked: 2173900
- Corpus lines checked: 2278894

## Records requiring attention

| Manuscript | Remote issues | Local issues |
|---|---|---|
| Bloomington, Indiana University, Ricketts 198 (`ms-15415`) | manifest_fetch_failed: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'iiif.archivelab.org'. (_ssl.c:1077)> | — |
| Vienna, Österreichische Nationalbibliothek, cvp Ser. n. 3614 (`ms-15443`) | manifest_cors_missing: Access-Control-Allow-Origin is absent; image_cors_missing: Access-Control-Allow-Origin is absent | — |
| Boulogne-sur-Mer, Bibliothèque municipale, Ms.74 (82) (`ms-15504`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Chantilly, Bibliothèque et Archives du Château, Ms. 617 (`ms-15601`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Colmar, Bibliothèque des Dominicains, Ms. 717 II (`ms-15603`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Arras, Bibliothèque de la Ville, 742 (`ms-15636`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Dublin, Trinity College, Ms.81 (`ms-15670`) | manifest_fetch_failed: Expecting value: line 1 column 1 (char 0) | — |
| Admont Stiftsbibliothek, Admont Ms.16 (`ms-15735`) | image_cors_missing: Access-Control-Allow-Origin is absent | — |
| Hamburg, Staats-und Universitätsbibliothek, Ms. 209 in scrin. (`ms-15833`) | manifest_fetch_failed: HTTP Error 500: Unknown Reason | — |
| Hamburg, Staats-und Universitätsbibliothek, Ms. 210 in scrin. (`ms-15834`) | manifest_fetch_failed: HTTP Error 500: Unknown Reason | — |
| Harvard University, Houghton Library, Ms.Riant 91 (`ms-15842`) | manifest_fetch_failed: Expecting value: line 1 column 1 (char 0) | — |
| Admont Stiftsbibliothek, Admont Ms.17 (`ms-15846`) | image_cors_missing: Access-Control-Allow-Origin is absent | — |
| Autun, Bibliothèque municipale, Autun, Bm 20 (`ms-15858`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| San Marino, Huntington Library, Art Museum, and Botanical Gardens, mssHM 26068 (`ms-15860`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Karlsruhe, Badische Landesbibliothek, Lichtent. 105 (`ms-15862`) | manifest_url_missing: No IIIF manifest URL | — |
| Lawrence (Kansas), University of Kansas, Kenneth Spencer Research Library, Ms.C66 (`ms-15910`) | manifest_fetch_failed: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: Hostname mismatch, certificate is not valid for 'iiif.archivelab.org'. (_ssl.c:1077)> | — |
| London, British Library, Harley 3099 (`ms-15952`) | manifest_url_missing: No IIIF manifest URL | — |
| Admont Stiftsbibliothek, Admont Ms.292 (`ms-15957`) | image_cors_missing: Access-Control-Allow-Origin is absent | — |
| Admont Stiftsbibliothek, Admont Ms.58 (`ms-16068`) | image_cors_missing: Access-Control-Allow-Origin is absent | — |
| Nijmegen, Universiteitsbibliotheek, Ms.306 (`ms-16109`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Admont Stiftsbibliothek, Admont Ms.650 (`ms-16179`) | image_cors_missing: Access-Control-Allow-Origin is absent | — |
| Paris, Bibliothèque nationale de France, Français 24786 (`ms-16258`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 24864 (`ms-16259`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 342 (`ms-16260`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 580 (`ms-16261`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 817 (`ms-16262`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 835 (`ms-16263`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 10399 (`ms-16264`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 10400 (`ms-16265`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 12207 (`ms-16267`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 12238 (`ms-16269`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 12240 (`ms-16270`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 12241 (`ms-16271`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 12243 (`ms-16272`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 12949 (`ms-16273`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 1564 (`ms-16274`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Latin 7193 (`ms-16283`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | mapping_has_no_text: Mapped annotation pages contain no transcription text |
| Paris, Bibliothèque nationale de France, Latin 7560 (`ms-16284`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, NAL 348 (`ms-16285`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, NAL 667 (`ms-16286`) | manifest_direct_rate_limited: HTTP Error 429: Too Many Requests | — |
| Rome, Biblioteca Nazionale Centrale, Vittorio Emanuele 1335 (`ms-16355`) | manifest_cors_missing: Access-Control-Allow-Origin is absent; image_probe_failed: HTTP Error 404:  | — |
| Strasbourg, Bibliothèque du Grand Séminaire, Ms. 37 (`ms-16447`) | manifest_fetch_failed: HTTP Error 404: Not Found | — |
| Strasbourg, Bibliothèque universitaire, Ms. 1.989 (`ms-16448`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Strasbourg, Bibliothèque universitaire, Ms. 2.930 (`ms-16451`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Strasbourg, Bibliothèque universitaire, Ms. 306 (`ms-16452`) | manifest_fetch_failed: HTTP Error 502: Bad Gateway | — |
| Paris, Bibliothèque nationale de France, français 54 (`ms-29073`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Saint-Omer. Bibliothèque d'agglomération, Ms. 414 (`ms-29163`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Colmar, Bibliothèque des Dominicains, Ms. 495 (`ms-31802`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Paris, Bibliothèque nationale de France, NAF 4792 (`ms-33091`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 5025 (`ms-33100`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 1179 (`ms-35232`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Paris, Bibliothèque nationale de France, Français 12779 (`ms-35481`) | manifest_fetch_failed: direct: HTTP Error 429: Too Many Requests; proxy: HTTP Error 429: Too Many Requests | — |
| Chantilly, Bibliothèque et Archives du Château, Ms. 294 (`ms-35552`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Chantilly, Bibliothèque et Archives du Château, Ms. 492 (`ms-35557`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
| Chantilly, Bibliothèque et Archives du Château, Ms. 493 (`ms-35562`) | manifest_cors_missing: Access-Control-Allow-Origin is absent | — |
