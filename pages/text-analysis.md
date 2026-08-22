---
layout: page
title: Text Analysis
permalink: /text-analysis/
show_title: false
---

<style>
.analysis-container { width: min(96vw, 1800px); max-width: none; margin-left: 50%; transform: translateX(-50%); padding: 0 0.5rem 2rem; color: #273142; }
.analysis-container, .analysis-container *, .analysis-container *::before, .analysis-container *::after { box-sizing: border-box; }
.card { background: white; border: 0; border-radius: 0; padding: 0; margin-bottom: 1rem; box-shadow: none; }
.card h3 { margin-top: 0; margin-bottom: 0.4rem; color: #333; font-family: inherit; font-size: 1.25rem; }
.card h4 { margin: 0.5rem 0 0.4rem 0; font-size: 0.95rem; }
#site-main .analysis-container .card h3 { margin-top: 0; margin-bottom: 0.4rem; color: #303847; font-family: inherit; font-size: 1.25rem; letter-spacing: 0; }
#site-main .analysis-container .card h4 { color: #293447; font-family: inherit; font-size: 1rem; letter-spacing: 0; text-transform: none; }
.config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1rem 0; }
.form-group { margin-bottom: 0.4rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.2rem; color: #555; font-size: 0.85rem; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.55rem; border: 1px solid #ccd4df; border-radius: 5px; font-family: inherit; font-size: 0.85rem; }
.form-group textarea { min-height: 100px; font-family: monospace; }
.btn { padding: 0.5rem 1rem; border: 1px solid #d8d2c5; border-radius: 3px; background:#fff; color:#3f3a31; cursor: pointer; font-weight: 600; transition: background-color 0.15s, border-color 0.15s; font-size: 0.85rem; }
.btn-primary { background: #a67c00; border-color:#a67c00; color: white; }
.btn-primary:hover { background: #8a6500; border-color:#8a6500; }
.btn-secondary { background: #fff; border-color:#a67c00; color: #725500; }
.btn-secondary:hover { background: #f8f4e9; border-color:#8a6500; }
.btn-danger { background: #fff; border-color:#b75b5b; color: #8d3434; }
.btn-danger:hover { background: #fbf2f2; border-color:#8d3434; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.corpus-item { background: transparent; padding: 0.65rem 0; border-radius: 0; margin-bottom: 0.3rem; border-bottom: 1px solid #e4e7ec; }
.corpus-item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
.corpus-item-label { font-weight: 600; color: #333; font-size: 0.9rem; }
.corpus-item-info { font-size: 0.8rem; color: #666; }
.results-section { margin-top: 1rem; }
.results-section h4, #tfidf-results-container > h4 { color: #293447; font-family: inherit; font-size: 1rem; text-transform: none; letter-spacing: 0; }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; margin: 0.5rem 0; }
.stat-card { background: transparent !important; color: #303847; padding: 0.9rem 0.6rem; border: 0; border-top: 1px solid #b9a46c; border-bottom: 1px solid #e4e1db; border-radius: 0; box-shadow: none; text-align: center; }
.stat-card-value { color: #725500; font-size: 1.4rem; font-weight: 700; margin-bottom: 0.2rem; }
.stat-card-label { color: #626976; font-size: 0.75rem; opacity: 1; }
.error-message { background: #fed7d7; color: #c53030; padding: 0.5rem; border-radius: 3px; margin: 0.4rem 0; font-size: 0.85rem; }
.success-message { background: #c6f6d5; color: #2f855a; padding: 0.5rem; border-radius: 3px; margin: 0.4rem 0; font-size: 0.85rem; }
.loading { text-align: center; padding: 0.8rem; }
.spinner { border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; width: 35px; height: 35px; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.tabs { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 0.5rem; }
.tab { padding: 0.5rem 1.2rem; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; transition: all 0.2s; font-size: 0.9rem; }
.tab:hover { background: #f7fafc; }
.tab.active { color: #667eea; border-bottom-color: #667eea; }
.tab-content { display: none; }
.tab-content.active { display: block; }
#plot-container { min-height: 550px; }
.feature-table { width: 100%; border-collapse: collapse; margin-top: 0.4rem; font-size: 0.85rem; }
.feature-table th, .feature-table td { padding: 0.4rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
.feature-table th { background: #f7fafc; font-weight: 600; color: #555; }
.feature-table tr:hover { background: #f7fafc; }
.manuscript-list { max-height: 360px; overflow-y: auto; border: 1px solid #d8dee8; border-radius: 2px; padding: 0.5rem; background: #fff; }
.manuscript-checkbox { display: flex; align-items: center; padding: 0.3rem; margin-bottom: 0.25rem; }
.manuscript-checkbox:hover { background: #f7fafc; }
.manuscript-checkbox input { margin-right: 0.4rem; }
.analysis-section { display: none; }
.analysis-section.active { display: block; }
.analysis-workspace { display: grid; grid-template-columns: minmax(200px, 220px) minmax(0, 1fr); gap: 1.5rem; align-items: start; margin-top: 1rem; }
.analysis-method-panel { grid-column: 1; align-self: start; position: sticky; top: 1rem; padding: 1rem; border: 1px solid #eee; border-radius: 0.75rem; background: #fff; }
.analysis-method-title { margin-bottom: 0.75rem; color: #333; font-size: 1.05rem; font-weight: 700; }
.analysis-method-tabs { display: flex; flex-direction: column; gap: 0.4rem; margin: 0; border: 0; }
.analysis-method-tabs .tab { padding: 0.6rem 0.9rem; border: 2px solid #ccc; border-radius: 0.25rem; color: #3f3a31; font-size: 0.85rem; font-weight: 500; text-align: left; }
.analysis-method-tabs .tab:hover { background: #f5f5f5; border-color: #999; }
.analysis-method-tabs .tab.active { background: #a67c00; border-color: #a67c00; color: #fff; font-weight: 600; }
.analysis-method-hint { margin: 1rem 0 0; padding-top: 1rem; border-top: 2px solid #ddd; color: #626b78; font-size: 0.75rem; line-height: 1.5; }
.corpus-ledger { margin-top: 1rem; padding-top: 0.9rem; border-top: 2px solid #ddd; }
.corpus-ledger-heading { display: flex; justify-content: space-between; gap: 0.5rem; align-items: baseline; margin-bottom: 0.5rem; }
.corpus-ledger-heading strong { font-size: 0.88rem; }
.corpus-ledger-heading span { color: #626b78; font-size: 0.7rem; }
.corpus-ledger-remove { width: 100%; margin: 0 0 0.45rem; padding: 0.35rem 0.45rem; border: 1px solid #b75b5b; border-radius: 2px; background: #fff; color: #8d3434; cursor: pointer; font: inherit; font-size: 0.68rem; font-weight: 600; }
.corpus-ledger-list { display: grid; gap: 0.3rem; max-height: 260px; overflow: auto; }
.corpus-ledger-item { width: 100%; padding: 0.42rem 0.5rem; border: 1px solid #dfe3e9; border-radius: 2px; background: #fff; color: #303847; cursor: pointer; font: inherit; font-size: 0.7rem; line-height: 1.35; text-align: left; }
.corpus-ledger-item:hover, .corpus-ledger-item.is-focused { border-color: #a67c00; background: #f8f4e9; }
.corpus-ledger-role { display: block; color: #725500; font-size: 0.62rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.corpus-ledger-empty { margin: 0; color: #737b88; font-size: 0.7rem; line-height: 1.4; }
.analysis-workspace > .analysis-section { grid-column: 2; min-width: 0; }
.analysis-workspace > .analysis-section.active { display: block; }
.analysis-workspace > .analysis-section > .card { display: grid; grid-template-columns: minmax(560px, 1fr) minmax(560px, 1fr); gap: 1.5rem; align-items: start; margin: 0; }
.analysis-control-panel, .analysis-output-panel { min-width: 0; padding: 1rem; border: 1px solid #eee; border-radius: 0.75rem; background: #fff; }
.analysis-output-panel { position: sticky; top: 1rem; max-height: calc(100vh - 2rem); overflow-y: auto; scrollbar-gutter: stable; }
.workspace-panel-label { margin-bottom: 0.8rem; padding-bottom: 0.55rem; border-bottom: 1px solid #e2e6ec; color: #626b78; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
#tab-tfidf-results, #tab-rolling-results, #tab-cluster-results { display: block !important; }
.notice {
  margin: 1rem 0;
  padding: 0.8rem 0;
  border: 0;
  border-top: 1px solid #cfd4dc;
  border-bottom: 1px solid #e4e7ec;
  border-radius: 0;
  background: transparent;
  color: #4b5260;
  font-size: 0.86rem;
  line-height: 1.55;
}
.notice strong:first-child {
  margin-right: 0.35rem;
  color: #303847;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.055em;
  text-transform: uppercase;
}
.notice-warning { border-top-color: #b9a46c; }
.notice-info { border-top-color: #9ca8ba; }
.method-guide { margin-top: 1rem; border-top: 1px solid #e2e8f0; padding-top: 0.7rem; font-size: 0.86rem; line-height: 1.55; }
.method-guide summary { cursor: pointer; font-weight: 700; color: #3c4f73; }
.method-sheet { margin: 0.7rem 0; border-top: 1px solid #dfe3e9; border-bottom: 1px solid #e4e7ec; }
.method-sheet > summary { padding: 0.55rem 0; cursor: pointer; color: #303847; font-size: 0.8rem; font-weight: 700; }
.method-sheet dl { display: grid; grid-template-columns: minmax(90px, 125px) 1fr; gap: 0.35rem 0.8rem; margin: 0 0 0.7rem; font-size: 0.75rem; line-height: 1.45; }
.method-sheet dt { color: #303847; font-weight: 700; }
.method-sheet dd { margin: 0; color: #626b78; }
.start-here { margin: 0.8rem 0; padding: 0.8rem 0; border-top: 1px solid #b9a46c; border-bottom: 1px solid #e4e1db; }
.start-here-heading { margin: 0 0 0.55rem; color: #303847; font-size: 0.82rem; font-weight: 700; }
.start-here p { margin: 0 0 0.65rem; color: #586170; font-size: 0.78rem; line-height: 1.5; }
.start-here .form-group { max-width: 430px; margin: 0; }
.advanced-settings { margin-top: 0.75rem; border-top: 1px solid #dfe3e9; border-bottom: 1px solid #e4e7ec; }
.advanced-settings > summary { padding: 0.65rem 0; cursor: pointer; color: #303847; font-size: 0.82rem; font-weight: 700; }
.result-actions { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 0.7rem 0; }
.source-column { border: 0; border-top: 1px solid #cfd4dc; border-bottom: 1px solid #e4e7ec; border-radius: 0; padding: 0.9rem 0; background: transparent; }
.search-input { margin-bottom: 0.5rem; }
.metadata-chip { display: inline-block; background: #f2efe7; border:1px solid #d8d2c5; border-radius: 2px; padding: 0.12rem 0.4rem; margin: 0.15rem 0.2rem 0 0; font-size: 0.72rem; color: #574a2a; }
.scribe-browser { border-top: 1px solid #c8ced8; border-bottom: 1px solid #dfe3e9; margin-top: 1rem; }
.scribe-browser h4 { margin: 0; padding-top: 0.85rem; font-family: inherit; font-size: 1rem; text-transform: none; letter-spacing: 0; }
.scribe-toolbar { display: grid; grid-template-columns: minmax(280px, 720px) auto; gap: 1rem; align-items: center; padding: 0.8rem 0; }
.scribe-toolbar .search-input { width: 100%; margin: 0; padding: 0.65rem 0.75rem; border: 1px solid #bfc7d2; border-radius: 2px; }
.scribe-filter { display: flex; align-items: center; gap: 0.45rem; color: #4f5968; font-size: 0.85rem; white-space: nowrap; }
.scribe-list { max-height: 520px; overflow: auto; border-top: 1px solid #e2e6ec; }
.scribe-group { margin: 0; padding: 0; border: 0; border-bottom: 1px solid #e2e6ec; background: #fff; }
.scribe-group:hover { margin: 0; padding: 0; border: 0; border-bottom: 1px solid #e2e6ec; }
.scribe-group[hidden] { display: none; }
.scribe-group > summary { display: grid; grid-template-columns: auto minmax(260px, 1fr) minmax(220px, 360px); gap: 0.35rem; align-items: center; margin: 0; padding: 0.65rem 0.55rem; cursor: pointer; list-style: none; color: #293447; font-family: inherit; font-size: 0.9rem; font-weight: 400; line-height: 1.35; text-transform: none; letter-spacing: 0; }
.scribe-group > summary::-webkit-details-marker { display: none; }
.scribe-group > summary:hover { background: #f8f8f6; }
.scribe-group > summary::before { content: "›"; display: inline-block; width: 1rem; margin-right: 0.35rem; color: #8a6500; font-family: inherit; font-size: 0.9rem; transform: none; }
.scribe-group[open] > summary::before { content: "⌄"; transform: none; }
.scribe-group-name { display: inline; font-family: inherit; font-size: 0.95rem; font-weight: 700; color: #293447; }
.scribe-group-counts { color: #626b78; font-size: 0.78rem; text-align: right; }
.scribe-segments { padding: 0 0.55rem 0.65rem 1.9rem; }
.scribe-segment { display: grid; grid-template-columns: auto minmax(260px, 1fr) minmax(220px, auto); gap: 0.75rem; align-items: start; padding: 0.7rem 0; border-top: 1px solid #eceff3; }
.scribe-segment input { margin-top: 0.25rem; }
.scribe-segment-title { display: block; color: #2f394a; font-weight: 600; font-size: 0.88rem; }
.scribe-segment-meta { display: block; color: #626b78; font-size: 0.78rem; margin-top: 0.2rem; line-height: 1.45; }
.scribe-segment-evidence { color: #626b78; font-size: 0.75rem; line-height: 1.45; text-align: right; }
.scribe-segment-evidence a { white-space: nowrap; }
.scribe-browser-status { padding: 0.55rem 0; color: #626b78; font-size: 0.8rem; }
.corpus-selection-header { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; margin-top: 0.85rem; padding-top: 0.8rem; border-top: 1px solid #c8ced8; }
.corpus-selection-header h4 { margin: 0 !important; }
.corpus-selection-header p { margin: 0; color: #626b78; font-size: 0.76rem; line-height: 1.4; text-align: right; }
.corpus-selection-header + .scribe-browser { margin-top: 0.35rem; border-top: 0; }
.source-picker-search { width: 100%; margin-bottom: 0.4rem; padding: 0.5rem 0.6rem; border: 1px solid #c8ced8; border-radius: 2px; background: #fff; color: #303847; font: inherit; font-size: 0.8rem; }
.source-secondary-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 2rem; margin-top: 1.5rem; }
.source-secondary { margin: 0; padding: 0.8rem 0 0; border: 0; border-top: 1px solid #cfd4dc; }
.source-secondary:hover { margin: 0; padding: 0.8rem 0 0; border: 0; border-top: 1px solid #cfd4dc; }
.source-secondary > summary { margin: 0; padding: 0.2rem 0; cursor: pointer; color: #303847; font-family: inherit; font-size: 0.9rem; font-weight: 700; line-height: 1.4; text-transform: none; letter-spacing: 0; }
.source-secondary > summary::before { font-family: inherit; font-size: 0.8rem; transform: none; }
.source-secondary[open] > summary::before { transform: rotate(90deg); }
.selection-actions { position: sticky; bottom: 0; display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.75rem 0; background: rgba(255,255,255,0.96); border-top: 1px solid #dfe3e9; }
.corpus-scribe-group { border-top: 1px solid #cfd4dc; margin-top: 0.75rem; }
.corpus-scribe-heading { display: flex; justify-content: space-between; gap: 1rem; padding-top: 0.65rem; color: #303847; }
.pca-layout { border-top: 1px solid #dfe3e9; margin-top: 0.7rem; padding-top: 0.5rem; }
.pca-figure-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; padding: 0.25rem 0.35rem; }
.pca-figure-heading h4 { margin: 0; color: #293447; font-family: inherit; font-size: 1rem; text-transform: none; letter-spacing: 0; }
.pca-figure-heading p { margin: 0; color: #626b78; font-size: 0.78rem; }
.pca-plot { width: 100%; min-width: 0; height: 520px; }
.pca-key { margin: 0; padding: 0; border: 0; border-top: 1px solid #dfe3e9; }
.pca-key:hover { margin: 0; padding: 0; border: 0; border-top: 1px solid #dfe3e9; }
.pca-key > summary { margin: 0; padding: 0.65rem 0.35rem; color: #303847; font-family: inherit; font-size: 0.82rem; font-weight: 700; line-height: 1.4; text-transform: none; letter-spacing: 0; }
.pca-key > summary::before { font-family: inherit; font-size: 0.75rem; transform: none; }
.pca-key[open] > summary::before { transform: rotate(90deg); }
.pca-key-body { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem 1.25rem; max-height: 260px; overflow: auto; padding: 0.2rem 0.35rem 0.8rem; }
.pca-key-group { margin: 0; }
.pca-key-scribe { display: flex; align-items: center; gap: 0.45rem; font-weight: 700; font-size: 0.82rem; }
.pca-key-swatch { width: 0.7rem; height: 0.7rem; flex: 0 0 auto; }
.pca-key-sample { margin: 0.3rem 0 0 1.15rem; color: #626b78; font-size: 0.74rem; line-height: 1.4; }
.rolling-source-list { display: grid; gap: 0; margin-top: 0.8rem; border-top: 1px solid #c8ced8; }
.rolling-source-row { display: grid; grid-template-columns: minmax(105px, 0.35fr) minmax(0, 1fr) minmax(120px, 0.45fr); gap: 0.7rem 0.8rem; align-items: start; padding: 1rem 0; border-bottom: 1px solid #dfe3e9; }
.rolling-source-row > * { min-width: 0; }
.rolling-role { grid-column: 1; grid-row: 1 / 4; }
.rolling-role + .form-group { grid-column: 2; grid-row: 1; }
.rolling-role + .form-group + .form-group { grid-column: 2 / 4; grid-row: 2; }
.rolling-role h4 { margin: 0; color: #293447; font-family: inherit; font-size: 0.95rem; text-transform: none; letter-spacing: 0; }
.rolling-role p { margin: 0.25rem 0 0; color: #626b78; font-size: 0.76rem; line-height: 1.4; }
.rolling-source-select { width: 100%; height: 150px; padding: 0.35rem; border: 1px solid #c8ced8; border-radius: 2px; background: #fff; color: #303847; font-family: inherit; font-size: 0.8rem; }
#cluster-source { height: 390px; }
.rolling-source-actions { grid-column: 3; grid-row: 1; display: grid; gap: 0.45rem; }
.rolling-source-actions .btn { width: 100%; }
.rolling-status { grid-column: 2 / 4; grid-row: 3; margin-top: -0.25rem; color: #626b78; font-size: 0.76rem; line-height: 1.4; }
.rolling-custom { margin: 0; padding: 0; border: 0; }
.rolling-custom:hover { margin: 0; padding: 0; border: 0; }
.rolling-custom > summary { margin: 0; padding: 0.4rem 0; color: #574a2a; font-family: inherit; font-size: 0.76rem; font-weight: 700; line-height: 1.3; text-transform: none; letter-spacing: 0; }
.rolling-custom > summary::before { font-family: inherit; font-size: 0.7rem; transform: none; }
.rolling-custom[open] > summary::before { transform: rotate(90deg); }
.rolling-custom textarea { min-height: 90px; margin-top: 0.35rem; }
.rolling-result-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; border-top: 1px solid #dfe3e9; margin-top: 1rem; padding-top: 0.7rem; }
.rolling-result-heading h4 { margin: 0; color: #293447; font-family: inherit; font-size: 1rem; text-transform: none; letter-spacing: 0; }
.rolling-result-heading p { margin: 0; color: #626b78; font-size: 0.78rem; }
.rolling-reference-key { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem 1.5rem; margin: 0.8rem 0; font-size: 0.78rem; }
.rolling-reference-item { display: grid; grid-template-columns: 1.25rem 1fr; gap: 0.45rem; align-items: start; }
.rolling-reference-mark { width: 0.8rem; height: 0.8rem; margin-top: 0.15rem; border-radius: 50%; }
.rolling-plot { width: 100%; min-width: 0; height: 480px; }
.cluster-config { border-top: 1px solid #cfd4dc; margin-top: 1rem; padding-top: 0.8rem; }
.cluster-config h4 { margin: 0 0 0.25rem; }
.cluster-results { border-top: 1px solid #dfe3e9; margin-top: 1.2rem; padding-top: 0.8rem; }
.cluster-results-heading { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; }
.cluster-results-heading h4 { margin: 0; }
.cluster-results-heading p { margin: 0; color: #626b78; font-size: 0.78rem; }
.cluster-plot { width: 100%; min-width: 0; min-height: 380px; }
.cluster-scribe-key { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.5rem 1rem; margin: 0.7rem 0 1rem; padding: 0.65rem 0; border-top: 1px solid #dfe3e9; border-bottom: 1px solid #e4e7ec; }
.cluster-scribe-key-item { display: grid; grid-template-columns: 0.8rem 1fr; gap: 0.45rem; align-items: start; color: #4f5968; font-size: 0.78rem; }
.cluster-scribe-key-item span:first-child { width: 0.72rem; height: 0.72rem; margin-top: 0.18rem; }
.metric-guide { margin: 0.8rem 0 0; padding: 0; border: 0; border-top: 1px solid #dfe3e9; }
.metric-guide:hover { margin: 0.8rem 0 0; padding: 0; border: 0; border-top: 1px solid #dfe3e9; }
.metric-guide > summary { margin: 0; padding: 0.65rem 0; color: #303847; font-family: inherit; font-size: 0.82rem; font-weight: 700; line-height: 1.4; text-transform: none; letter-spacing: 0; }
.metric-guide > summary::before { font-family: inherit; font-size: 0.75rem; transform: none; }
.metric-guide[open] > summary::before { transform: rotate(90deg); }
.metric-guide dl { display: grid; grid-template-columns: minmax(130px, 190px) 1fr; gap: 0.45rem 1rem; margin: 0.2rem 0 0.8rem; font-size: 0.8rem; line-height: 1.45; }
.metric-guide dt { font-weight: 700; color: #303847; }
.metric-guide dd { margin: 0; color: #586170; }
.loading-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0; 
  background: rgba(0, 0, 0, 0.7); 
  display: none; 
  justify-content: center; 
  align-items: center; 
  z-index: 9999;
  flex-direction: column;
  gap: 1rem;
}
.loading-overlay.active { display: flex; }
.loading-spinner { 
  border: 5px solid #f3f3f3; 
  border-top: 5px solid #667eea; 
  border-radius: 50%; 
  width: 60px; 
  height: 60px; 
  animation: spin 1s linear infinite; 
}
.loading-text { 
  color: white; 
  font-size: 1.2rem; 
  font-weight: 600; 
  text-align: center;
  max-width: 400px;
}
.loading-subtext {
  color: #e2e8f0;
  font-size: 0.9rem;
  text-align: center;
}
@media (max-width: 1550px) {
  .analysis-workspace > .analysis-section > .card { grid-template-columns: minmax(0, 1fr); }
  .analysis-output-panel { position: static; max-height: none; overflow: visible; }
}
@media (max-width: 1100px) {
  .analysis-workspace { grid-template-columns: minmax(0, 1fr); gap: 1rem; }
  .analysis-method-panel, .analysis-workspace > .analysis-section { grid-column: 1; }
  .analysis-method-panel { position: static; }
  .analysis-method-tabs { flex-direction: row; overflow-x: auto; }
  .analysis-method-tabs .tab { flex: 0 0 auto; white-space: nowrap; }
  .analysis-method-hint { display: none; }
}
@media (max-width: 900px) {
  .analysis-container { width: 100%; margin-left: 0; transform: none; padding-inline: 0.25rem; }
  .analysis-input-grid { grid-template-columns: 1fr !important; }
  .source-secondary-grid { grid-template-columns: 1fr; }
  .scribe-toolbar { grid-template-columns: 1fr; }
  .scribe-segment { grid-template-columns: auto 1fr; }
  .scribe-segment-evidence { grid-column: 2; text-align: left; }
  .pca-figure-heading { align-items: flex-start; flex-direction: column; gap: 0.2rem; }
  .pca-plot { height: 430px; }
  .rolling-source-row { grid-template-columns: 1fr; }
  .rolling-source-row > * { grid-column: 1 !important; grid-row: auto !important; }
  .rolling-status { grid-column: 1; margin-top: 0; }
  .rolling-reference-key { grid-template-columns: 1fr; }
  .rolling-result-heading { align-items: flex-start; flex-direction: column; gap: 0.2rem; }
  .corpus-selection-header { align-items: flex-start; flex-direction: column; gap: 0.2rem; }
  .corpus-selection-header p { text-align: left; }
  .rolling-plot { height: 430px; }
  .cluster-results-heading { align-items: flex-start; flex-direction: column; gap: 0.2rem; }
  .metric-guide dl { grid-template-columns: 1fr; gap: 0.15rem; }
  .tabs { overflow-x: auto; }
  .tab { white-space: nowrap; }
}
</style>

<!-- Loading Overlay -->
<div id="loading-overlay" class="loading-overlay">
  <div class="loading-spinner"></div>
  <div class="loading-text" id="loading-text">Processing...</div>
  <div class="loading-subtext" id="loading-subtext">Please wait</div>
</div>

<div class="analysis-container">
  <h1 style="font-size: 1.65rem; margin: 0.8rem 0 0.3rem;">Text Analysis</h1>
  <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.8rem;">
    Explore patterns and changes in the project’s available manuscript transcriptions. All processing happens in your browser.
  </p>
  <div class="notice notice-warning">
    <strong>Transcription comparability:</strong> the corpus combines transcriptions produced through different HTR models and workflows. Their conventions are not consistently diplomatic or normalized. Apparent differences may therefore reflect transcription practice or recognition error as well as language, text, exemplar, place, date, or scribe.
  </div>

  <div class="analysis-workspace">
    <aside class="analysis-method-panel" aria-label="Analysis methods">
      <div class="analysis-method-title">Analysis method</div>
      <div class="tabs analysis-method-tabs">
        <div class="tab active" data-analysis-type="tfidf-pca" onclick="switchAnalysisType('tfidf-pca')">PCA</div>
        <div class="tab" data-analysis-type="rolling-stylo" onclick="switchAnalysisType('rolling-stylo')">Rolling stylometry</div>
        <div class="tab" data-analysis-type="cluster-consensus" onclick="switchAnalysisType('cluster-consensus')">Cluster &amp; consensus</div>
      </div>
      <p class="analysis-method-hint">Choose a method, assemble its corpus, and adjust the experiment in the centre panel. Results remain visible on the right.</p>
      <section class="corpus-ledger" aria-live="polite">
        <div class="corpus-ledger-heading"><strong>Corpus ledger</strong><span id="corpus-ledger-count">0 items</span></div>
        <button id="corpus-ledger-remove" class="corpus-ledger-remove" type="button" onclick="removeFocusedCorpusItem()" hidden>Remove focused item</button>
        <div id="corpus-ledger-list" class="corpus-ledger-list"><p class="corpus-ledger-empty">The active method’s corpus will remain visible here.</p></div>
      </section>
    </aside>

  <!-- ========================================================================= -->
  <!-- TF-IDF / PCA ANALYSIS -->
  <!-- ========================================================================= -->
  <div id="analysis-tfidf-pca" class="analysis-section active">
    <div class="card">
      <section class="analysis-control-panel">
      <div class="workspace-panel-label">Experiment</div>
      <h3>Explore similarity with n-grams and PCA</h3>
      <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.8rem;">
        Compare chunks from at least two texts or scribal segments. PCA shows the strongest axes of variation in the selected feature matrix; proximity is exploratory evidence, not proof of scribal identity or authorship.
      </p>
      <details class="method-sheet"><summary>Method sheet</summary><dl>
        <dt>Question</dt><dd>Which selected text chunks share the strongest frequency patterns?</dd>
        <dt>Unit</dt><dd>Equal-length word chunks drawn from mapped scribal samples or manuscript text bodies.</dd>
        <dt>Output</dt><dd>A new PCA coordinate system calculated from the current corpus; map distance is exploratory.</dd>
        <dt>Main risk</dt><dd>Genre, exemplar, language, transcription practice, and unequal sampling can structure the axes.</dd>
        <dt>Reference</dt><dd>Eder, Rybicki, and Kestemont (2016), “Stylometry with R: A Package for Computational Text Analysis.”</dd>
      </dl></details>
      
      <!-- Sub-tabs for TF-IDF/PCA workflow -->
      <div class="tabs" style="font-size: 0.85rem;">
        <div class="tab active" data-tab-group="tfidf" data-tab-name="select-corpus" onclick="switchTab('tfidf', 'select-corpus')">1. Select Corpus</div>
        <div class="tab" data-tab-group="tfidf" data-tab-name="configure" onclick="switchTab('tfidf', 'configure')">2. Configure</div>
      </div>

      <!-- TF-IDF: Select Corpus -->
      <div id="tab-tfidf-select-corpus" class="tab-content active">
        <div class="corpus-selection-header">
          <h4>Corpus selection</h4>
          <p>Choose mapped scribal samples, manuscript text bodies, or custom text.</p>
        </div>
        <section class="scribe-browser" aria-labelledby="scribe-browser-heading">
          <h4 id="scribe-browser-heading">Scribal samples</h4>
          <div class="scribe-toolbar">
            <input id="tfidf-scribe-search" class="search-input" type="search" placeholder="Search scribes, manuscripts, folios, places, or scripts…" oninput="filterScribeList()">
            <label class="scribe-filter"><input id="tfidf-multiple-samples-only" type="checkbox" onchange="filterScribeList()"> Show only scribes with multiple samples</label>
          </div>
          <div id="tfidf-scribe-summary" class="scribe-browser-status">Loading available samples…</div>
          <div id="tfidf-scribe-list" class="scribe-list"><div class="loading">Loading scribal samples…</div></div>
          <div class="selection-actions">
            <small>Samples are grouped by attributed scribe. Open a heading to inspect its scribal units and mapped folios.</small>
            <button class="btn btn-secondary" onclick="loadSelectedScribesTFIDF()">Add selected samples</button>
          </div>
        </section>
        <p class="notice notice-info"><strong>Canvas matching:</strong> Every project text is restricted through its IIIF canvas sequence. Whole-text and “main text” records begin at f. 1r—or at page 1 in a repository’s explicitly numbered body sequence—and end on the last transcribed foliated canvas. Scribal ranges are restricted further to their attributed folios. Shared or mixed-hand pages are excluded when page-level IIIF or ALTO text cannot distinguish the hands.</p>

        <div class="source-secondary-grid">
          <!-- Database Manuscripts -->
          <details class="source-secondary">
            <summary>Manuscript text bodies</summary>
            <h4 style="margin-bottom: 0.6rem;">Browse by manuscript</h4>
            <p style="font-size:.78rem;color:#626b78;">Only manuscripts whose foliated body can be bounded from the IIIF canvas sequence are listed.</p>
            <div id="tfidf-manuscript-list" class="manuscript-list">
              <div class="loading">Loading manuscripts...</div>
            </div>
            <div class="form-group" style="margin-top: 0.6rem; padding: 0.5rem; background: #f7fafc; border-radius: 4px;">
              <label style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; display: block;">
                Manuscript Granularity
              </label>
              <div style="display: flex; gap: 1rem;">
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.85rem;">
                  <input type="radio" name="tfidf-granularity" value="manuscript" checked style="margin-right: 0.3rem;">
                  Entire manuscript
                </label>
                <label style="display: flex; align-items: center; cursor: pointer; font-size: 0.85rem;">
                  <input type="radio" name="tfidf-granularity" value="page" style="margin-right: 0.3rem;">
                  Each page separately
                </label>
              </div>
              <small style="color: #666; font-size: 0.75rem; display: block; margin-top: 0.3rem;">
                Page-level points can help locate variation, but page length and layout can dominate short samples.
              </small>
            </div>
            <button class="btn btn-secondary" onclick="loadSelectedManuscriptsTFIDF()" style="margin-top: 0.6rem; width: 100%;">
              Add selected manuscripts
            </button>
          </details>

          <!-- Upload Custom Text -->
          <details class="source-secondary">
            <summary>Custom text</summary>
            <h4 style="margin-bottom: 0.6rem;">Paste or upload text</h4>
            <div class="form-group">
              <label>Text Label (use metadata: ms_pages_location_date)</label>
              <input type="text" id="tfidf-custom-label" placeholder="e.g., ms456_300pp_italy_1475">
            </div>
            <div class="form-group">
              <label>Text Content</label>
              <textarea id="tfidf-custom-text" placeholder="Paste or type your text here..."></textarea>
            </div>
            <button class="btn btn-secondary" onclick="addCustomTextTFIDF()" style="width: 100%;">
              Add text
            </button>
            <div style="margin-top: 0.6rem;">
              <label class="form-group" style="display: flex; align-items: center; cursor: pointer;">
                <input type="file" id="tfidf-file-upload" accept=".txt" multiple style="display: none;">
                <button class="btn btn-primary" onclick="document.getElementById('tfidf-file-upload').click()" style="width: 100%;">
                  Upload .txt files
                </button>
              </label>
            </div>
          </details>
        </div>

        <!-- Current Corpus -->
        <div style="margin-top: 1rem;">
          <h4>Current corpus (<span id="tfidf-corpus-count">0</span> texts) — at least 2 required; 3+ recommended</h4>
          <div id="tfidf-corpus-list"></div>
        </div>

        <button class="btn btn-primary" onclick="switchTab('tfidf', 'configure')" style="margin-top: 0.8rem;">
          Next: Configure Analysis →
        </button>
      </div>

      <!-- TF-IDF: Configure -->
      <div id="tab-tfidf-configure" class="tab-content">
        <section class="start-here">
          <div class="start-here-heading">Start here</div>
          <p>Use Surface patterns for an initial comparison of spelling, abbreviation, punctuation, and other transcribed character patterns. Use Broader lexical similarity when vocabulary and content are more relevant.</p>
          <div class="form-group">
            <label>Starting Preset</label>
            <select id="tfidf-config-preset" onchange="applyAnalysisPreset(this.value)">
              <option value="surface">Surface patterns (recommended)</option>
              <option value="lexical">Broader lexical similarity</option>
              <option value="custom">Custom settings</option>
            </select>
            <small style="color:#666;">Presets remain fully editable.</small>
          </div>
        </section>
        <details class="advanced-settings">
          <summary>Advanced settings</summary>
          <div class="config-grid" style="margin-top: 0.2rem;">
            <div class="form-group">
            <label>N-gram Type</label>
            <select id="tfidf-config-ngram-type" onchange="markPresetCustom()">
              <option value="char">Character n-grams</option>
              <option value="word">Word n-grams</option>
            </select>
            <small style="color: #666; font-size: 0.75rem;">Character n-grams capture surface patterns, including HTR and transcription conventions.</small>
            </div>

          <div class="form-group">
            <label>N-gram Size</label>
            <input type="number" id="tfidf-config-ngram-size" value="3" min="1" max="10" onchange="markPresetCustom()">
            <small style="color: #666; font-size: 0.75rem;">3-5 for characters, 1-3 for words</small>
          </div>

          <div class="form-group">
            <label>Min Document Frequency</label>
            <input type="number" id="tfidf-config-min-df" value="2" min="1" onchange="markPresetCustom()">
            <small style="color: #666; font-size: 0.75rem;">Ignore rare features (< N docs)</small>
          </div>

          <div class="form-group">
            <label>Max Document Frequency</label>
            <input type="number" id="tfidf-config-max-df" value="1" min="0" max="1" step="0.05" onchange="markPresetCustom()">
            <small style="color: #666; font-size: 0.75rem;">Ignore common features (> N%)</small>
          </div>

          <div class="form-group">
            <label>Chunk Size (words)</label>
            <input type="number" id="tfidf-config-chunk-size" value="2000" min="250" step="250" onchange="markPresetCustom()">
            <small style="color: #666; font-size: 0.75rem;">Equal word windows improve comparability; short final tails are omitted.</small>
          </div>

          <div class="form-group">
            <label>Feature Weighting</label>
            <select id="tfidf-config-weighting" onchange="markPresetCustom()">
              <option value="relative">Relative frequency</option>
              <option value="tfidf">TF-IDF</option>
            </select>
            <small style="color:#666;">Relative frequency suits common stylistic patterns; TF-IDF emphasizes features unevenly distributed across chunks.</small>
          </div>

          <div class="form-group">
            <label>Maximum Features</label>
            <input type="number" id="tfidf-config-max-features" value="1000" min="50" max="2000" step="50" onchange="markPresetCustom()">
            <small style="color:#666;">Features are ranked by corpus frequency after document-frequency filtering.</small>
          </div>

          <div class="form-group">
            <label>PCA Components</label>
            <input type="number" id="tfidf-config-n-components" value="2" min="2" max="3" onchange="markPresetCustom()">
            <small style="color: #666; font-size: 0.75rem;">2D or 3D visualization</small>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="tfidf-config-lowercase" onchange="markPresetCustom()"> Convert to lowercase
            </label>
            <small style="color: #666; display: block; margin-top: 0.3rem; font-size: 0.75rem;">
              Usually disabled for stylometry
            </small>
          </div>
          </div>
        </details>

        <details class="method-guide">
          <summary>How choices change the result</summary>
          <p><strong>Character n-grams</strong> retain spelling, abbreviation, punctuation, and HTR artefacts. <strong>Word n-grams</strong> lean more toward vocabulary, content, and genre. Lowercasing removes case differences. Smaller chunks provide more local points but noisier estimates; larger chunks are more stable but may hide internal change. PCA axes are recalculated for every selection, so plots from different runs are not directly comparable.</p>
        </details>

        <div style="display: flex; gap: 0.6rem; margin-top: 1rem;">
          <button class="btn btn-secondary" onclick="switchTab('tfidf', 'select-corpus')">
            ← Back
          </button>
          <button class="btn btn-primary" onclick="runTFIDFAnalysis()" id="tfidf-run-btn">
            Run Analysis
          </button>
        </div>
      </div>

      </section>

      <!-- TF-IDF: Results -->
      <aside class="analysis-output-panel">
      <div class="workspace-panel-label">Results</div>
      <div id="tab-tfidf-results" class="tab-content">
        <div id="tfidf-results-container">
          <p style="color: #666;">Run an analysis to see results here.</p>
        </div>
      </div>
      </aside>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- ROLLING STYLOMETRY ANALYSIS -->
  <!-- ========================================================================= -->
  <div id="analysis-rolling-stylo" class="analysis-section" style="display: none;">
    <div class="card">
      <section class="analysis-control-panel">
      <div class="workspace-panel-label">Experiment</div>
      <h3>Explore change with rolling distances</h3>
      <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.8rem;">
        Slide a word window through one text and compare each window with two reference corpora. The curves show relative distance under the chosen feature representation.
      </p>
      <details class="method-sheet"><summary>Method sheet</summary><dl>
        <dt>Question</dt><dd>Where does a test text move closer to one of two reference profiles?</dd>
        <dt>Unit</dt><dd>Overlapping windows from one test text, compared with precisely two reference corpora.</dd>
        <dt>Output</dt><dd>A signed contrast and two absolute distance curves over word position.</dd>
        <dt>Main risk</dt><dd>Adjacent windows are dependent; reference imbalance and confounded content can dominate the comparison.</dd>
        <dt>Reference</dt><dd>Eder, Rybicki, and Kestemont (2016), rolling stylometry and Delta-family distances.</dd>
      </dl></details>

      <!-- Sub-tabs for Rolling Stylo workflow -->
      <div class="tabs" style="font-size: 0.85rem;">
        <div class="tab active" data-tab-group="rolling" data-tab-name="setup" onclick="switchTab('rolling', 'setup')">1. Setup Corpora</div>
        <div class="tab" data-tab-group="rolling" data-tab-name="configure" onclick="switchTab('rolling', 'configure')">2. Configure</div>
      </div>

      <!-- Rolling: Setup -->
      <div id="tab-rolling-setup" class="tab-content active">
        <div class="corpus-selection-header">
          <h4>Corpus selection</h4>
          <p>Assign mapped samples or text bodies to the two references and test text.</p>
        </div>
        <div class="notice notice-info"><strong>Three roles:</strong> References A and B are comparison profiles. The test text is divided into overlapping windows and compared with both. Select multiple samples to combine them within a reference.</div>
        <div class="rolling-source-list">
          <section class="rolling-source-row">
            <div class="rolling-role"><h4>Reference A</h4><p>First comparison corpus</p></div>
            <div class="form-group"><label for="rolling-corpus-a-label">Display label</label><input type="text" id="rolling-corpus-a-label" placeholder="e.g., Scribe A" value="Reference A" oninput="renderCorpusLedger()"></div>
            <div class="form-group"><label for="rolling-corpus-a-source">Scribal samples or manuscript text bodies</label><input class="source-picker-search" type="search" placeholder="Filter by scribe, manuscript, institution, or folio…" oninput="filterSourceSelect('rolling-corpus-a-source', this.value)"><select id="rolling-corpus-a-source" class="rolling-source-select" size="6" multiple></select></div>
            <div class="rolling-source-actions">
              <button class="btn btn-secondary" onclick="loadManuscriptRolling('a')">Use selection</button>
              <details class="rolling-custom"><summary>Use pasted text</summary><textarea id="rolling-corpus-a-text" placeholder="Paste reference text A…"></textarea><button class="btn btn-secondary" onclick="addCustomCorpusRolling('a')">Use pasted text</button></details>
            </div>
            <div id="rolling-corpus-a-status" class="rolling-status">No reference loaded.</div>
          </section>

          <section class="rolling-source-row">
            <div class="rolling-role"><h4>Reference B</h4><p>Second comparison corpus</p></div>
            <div class="form-group"><label for="rolling-corpus-b-label">Display label</label><input type="text" id="rolling-corpus-b-label" placeholder="e.g., Scribe B" value="Reference B" oninput="renderCorpusLedger()"></div>
            <div class="form-group"><label for="rolling-corpus-b-source">Scribal samples or manuscript text bodies</label><input class="source-picker-search" type="search" placeholder="Filter by scribe, manuscript, institution, or folio…" oninput="filterSourceSelect('rolling-corpus-b-source', this.value)"><select id="rolling-corpus-b-source" class="rolling-source-select" size="6" multiple></select></div>
            <div class="rolling-source-actions">
              <button class="btn btn-secondary" onclick="loadManuscriptRolling('b')">Use selection</button>
              <details class="rolling-custom"><summary>Use pasted text</summary><textarea id="rolling-corpus-b-text" placeholder="Paste reference text B…"></textarea><button class="btn btn-secondary" onclick="addCustomCorpusRolling('b')">Use pasted text</button></details>
            </div>
            <div id="rolling-corpus-b-status" class="rolling-status">No reference loaded.</div>
          </section>

          <section class="rolling-source-row">
            <div class="rolling-role"><h4>Test text</h4><p>Text examined by window</p></div>
            <div class="form-group"><label for="rolling-test-label">Display label</label><input type="text" id="rolling-test-label" placeholder="e.g., Disputed text" value="Test text" oninput="renderCorpusLedger()"></div>
            <div class="form-group"><label for="rolling-test-source">One scribal sample or manuscript text body</label><input class="source-picker-search" type="search" placeholder="Filter by scribe, manuscript, institution, or folio…" oninput="filterSourceSelect('rolling-test-source', this.value)"><select id="rolling-test-source" class="rolling-source-select" size="6"></select></div>
            <div class="rolling-source-actions">
              <button class="btn btn-secondary" onclick="loadManuscriptRolling('test')">Use selection</button>
              <details class="rolling-custom"><summary>Use pasted text</summary><textarea id="rolling-test-text" placeholder="Paste the test text…"></textarea><button class="btn btn-secondary" onclick="addCustomCorpusRolling('test')">Use pasted text</button></details>
            </div>
            <div id="rolling-test-status" class="rolling-status">No test text loaded.</div>
          </section>
        </div>

        <button class="btn btn-primary" onclick="switchTab('rolling', 'configure')" style="margin-top: 0.8rem;">
          Next: Configure Analysis →
        </button>
      </div>

      <!-- Rolling: Configure -->
      <div id="tab-rolling-configure" class="tab-content">
        <section class="start-here">
          <div class="start-here-heading">Start here</div>
          <p>Begin with 5,000-word windows, a 500-word step, character 4-grams, and Burrows’ Classic Delta. References should contain at least two separate samples each and be reasonably balanced.</p>
          <button class="btn btn-secondary" type="button" onclick="applyRollingStarter()">Apply recommended settings</button>
        </section>
        <details class="advanced-settings">
          <summary>Advanced settings</summary>
          <div class="config-grid" style="margin-top: 0.2rem;">
          <div class="form-group">
            <label>Window Size (words)</label>
            <input type="number" id="rolling-config-window-size" value="5000" min="1000" step="500">
            <small style="color: #666; font-size: 0.75rem;">Size of sliding window</small>
          </div>

          <div class="form-group">
            <label>Step Size (words)</label>
            <input type="number" id="rolling-config-step-size" value="500" min="100" step="100">
            <small style="color: #666; font-size: 0.75rem;">How far to move window each step</small>
          </div>

          <div class="form-group">
            <label>N-gram Type</label>
            <select id="rolling-config-ngram-type">
              <option value="char">Character n-grams</option>
              <option value="word">Word n-grams</option>
            </select>
            <small style="color: #666; font-size: 0.75rem;">Feature type for comparison</small>
          </div>

          <div class="form-group">
            <label>N-gram Size</label>
            <input type="number" id="rolling-config-ngram-size" value="4" min="1" max="10">
            <small style="color: #666; font-size: 0.75rem;">3-5 for characters, 1-3 for words</small>
          </div>

          <div class="form-group">
            <label>Number of retained features</label>
            <input type="number" id="rolling-config-mfw" value="100" min="50" max="1000" step="50">
            <small style="color: #666; font-size: 0.75rem;">Most frequent words or character n-grams across the two balanced reference profiles</small>
          </div>

          <div class="form-group">
            <label>Distance Metric</label>
            <select id="rolling-config-distance">
              <option value="classic-delta">Burrows’ Classic Delta</option>
              <option value="eder-delta">Eder’s Delta</option>
              <option value="argamon-delta">Argamon’s Linear Delta</option>
              <option value="eders-simple">Eder’s Simple</option>
              <option value="cosine">Cosine distance</option>
              <option value="canberra">Canberra distance</option>
              <option value="manhattan">Manhattan distance</option>
              <option value="euclidean">Euclidean distance</option>
            </select>
            <small style="color: #666; font-size: 0.75rem;">Classic Delta is Burrows’ Delta; these are two names for the same measure.</small>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" id="rolling-config-lowercase" checked> Convert to lowercase
            </label>
            <small style="color: #666; display: block; margin-top: 0.3rem; font-size: 0.75rem;">
              Recommended for word-based analysis
            </small>
          </div>
          </div>
        </details>

        <details class="metric-guide">
          <summary>How the rolling distance metrics differ</summary>
          <dl>
            <dt>Burrows’ Classic Delta</dt><dd>Mean absolute difference after each feature is divided by its standard deviation across the loaded A and B reference profiles. One reference in each role is sufficient; adding further samples changes the estimated feature variation.</dd>
            <dt>Eder’s Delta</dt><dd>Modifies Classic Delta by weighting high-frequency features more strongly and suppressing unstable rare features; it was designed with highly inflected languages in mind.</dd>
            <dt>Argamon’s Linear Delta</dt><dd>A Euclidean-style Delta on standardized frequencies. Larger standardized departures have more influence than under Classic Delta.</dd>
            <dt>Eder’s Simple</dt><dd>Manhattan distance after square-root transformation. It reduces the dominance of very frequent features and does not depend on corpus standard deviations.</dd>
            <dt>Cosine</dt><dd>Compares profile direction. It emphasizes proportional pattern rather than vector magnitude.</dd>
            <dt>Canberra</dt><dd>Scales each feature difference by the two observed values. It is highly sensitive to rare features and transcription noise.</dd>
            <dt>Manhattan</dt><dd>Adds absolute feature-by-feature differences. Numerous small departures accumulate directly.</dd>
            <dt>Euclidean</dt><dd>Uses straight-line distance, giving relatively more influence to a few large feature differences.</dd>
          </dl>
        </details>

        <div style="display: flex; gap: 0.6rem; margin-top: 1rem;">
          <button class="btn btn-secondary" onclick="switchTab('rolling', 'setup')">
            ← Back
          </button>
          <button class="btn btn-primary" onclick="runRollingStyloAnalysis()" id="rolling-run-btn">
            Run analysis
          </button>
        </div>
      </div>

      </section>

      <!-- Rolling: Results -->
      <aside class="analysis-output-panel">
      <div class="workspace-panel-label">Results</div>
      <div id="tab-rolling-results" class="tab-content">
        <div id="rolling-results-container">
          <p style="color: #666;">Run an analysis to see results here.</p>
        </div>
      </div>
      </aside>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- HIERARCHICAL CLUSTERING / BOOTSTRAP CONSENSUS -->
  <!-- ========================================================================= -->
  <div id="analysis-cluster-consensus" class="analysis-section" style="display: none;">
    <div class="card">
      <section class="analysis-control-panel">
      <div class="workspace-panel-label">Experiment</div>
      <h3>Compare samples with hierarchical clustering</h3>
      <p style="font-size:0.85rem;color:#666;margin-bottom:0.8rem;">Build a distance tree from complete sample profiles, then test which groupings persist across overlapping frequency bands.</p>
      <details class="method-sheet"><summary>Method sheet</summary><dl>
        <dt>Question</dt><dd>Which complete samples repeatedly form groups under changing feature-band settings?</dd>
        <dt>Unit</dt><dd>One complete mapped scribal sample or manuscript text body per leaf.</dd>
        <dt>Output</dt><dd>A distance dendrogram and, when possible, a majority-rule consensus topology.</dd>
        <dt>Main risk</dt><dd>Topology depends on the corpus, distance, linkage, feature range, and transcription comparability.</dd>
        <dt>Reference</dt><dd>Eder, Rybicki, and Kestemont (2016), cluster analysis and bootstrap consensus.</dd>
      </dl></details>
      <div class="tabs" style="font-size:0.85rem;">
        <div class="tab active" data-tab-group="cluster" data-tab-name="select" onclick="switchTab('cluster', 'select')">1. Select corpus</div>
        <div class="tab" data-tab-group="cluster" data-tab-name="configure" onclick="switchTab('cluster', 'configure')">2. Configure</div>
      </div>
      <div id="tab-cluster-select" class="tab-content active">
        <div class="corpus-selection-header">
          <h4>Corpus selection</h4>
          <p>Choose mapped scribal samples or manuscript text bodies.</p>
        </div>
        <section class="scribe-browser" aria-labelledby="cluster-scribe-browser-heading">
          <h4 id="cluster-scribe-browser-heading">Scribal samples</h4>
          <div class="scribe-toolbar">
            <input id="cluster-scribe-search" class="search-input" type="search" placeholder="Search scribes, manuscripts, folios, places, or scripts…" oninput="filterClusterScribeList()">
            <label class="scribe-filter"><input id="cluster-multiple-samples-only" type="checkbox" onchange="filterClusterScribeList()"> Show only scribes with multiple samples</label>
          </div>
          <div id="cluster-scribe-summary" class="scribe-browser-status">Loading available samples…</div>
          <div id="cluster-scribe-list" class="scribe-list"><div class="loading">Loading scribal samples…</div></div>
          <div class="selection-actions cluster-selection-actions">
            <small>Samples are grouped by attributed scribe. Clustering uses each selected sample as one complete profile.</small>
            <button id="cluster-add-scribes" class="btn btn-secondary" onclick="loadSelectedClusterSamples()">Add selected samples</button>
          </div>
        </section>
        <div class="notice notice-info"><strong>Sample unit:</strong> Clustering uses complete samples, not PCA chunks. Select at least three samples; four or more are needed for a useful consensus analysis.</div>
        <div class="source-secondary-grid" style="grid-template-columns:minmax(0,1fr);">
          <details class="source-secondary">
            <summary>Manuscript text bodies</summary>
            <div class="form-group">
              <label for="cluster-source">Browse by manuscript</label>
              <input class="source-picker-search" type="search" placeholder="Filter by manuscript, institution, or folio…" oninput="filterSourceSelect('cluster-source', this.value)">
              <select id="cluster-source" class="rolling-source-select" size="8" multiple></select>
            </div>
            <button class="btn btn-secondary" onclick="loadSelectedClusterSamples()">Add selected manuscripts</button>
          </details>
        </div>
        <h4 style="margin-top:1rem;">Current corpus (<span id="cluster-corpus-count">0</span> samples)</h4>
        <div id="cluster-corpus-list"><p style="color:#666;">No samples selected.</p></div>
        <button class="btn btn-primary" onclick="switchTab('cluster', 'configure')" style="margin-top:0.8rem;">Next: Configure analysis →</button>
      </div>
      <div id="tab-cluster-configure" class="tab-content">
        <section class="start-here">
          <div class="start-here-heading">Start here</div>
          <p>Begin with the 500 most frequent words, Burrows’ Classic Delta, average linkage, and a 50% consensus threshold. Interpret stable groupings before comparing small branch-length differences.</p>
          <button class="btn btn-secondary" type="button" onclick="applyClusterStarter()">Apply recommended settings</button>
        </section>
        <details class="advanced-settings">
          <summary>Advanced settings</summary>
          <div class="config-grid">
          <div class="form-group"><label for="cluster-config-ngram-type">Feature type</label><select id="cluster-config-ngram-type"><option value="word">Words</option><option value="char">Character n-grams</option></select></div>
          <div class="form-group"><label for="cluster-config-ngram-size">N-gram size</label><input type="number" id="cluster-config-ngram-size" value="1" min="1" max="10"></div>
          <div class="form-group"><label for="cluster-config-max-features">Maximum features</label><input type="number" id="cluster-config-max-features" value="500" min="50" max="2000" step="50"></div>
          <div class="form-group"><label for="cluster-config-distance">Distance</label><select id="cluster-config-distance"><option value="classic-delta">Burrows’ Classic Delta</option><option value="eder-delta">Eder’s Delta</option><option value="argamon-delta">Argamon’s Linear Delta</option><option value="eders-simple">Eder’s Simple</option><option value="cosine">Cosine distance</option><option value="canberra">Canberra distance</option><option value="manhattan">Manhattan distance</option><option value="euclidean">Euclidean distance</option></select></div>
          <div class="form-group"><label for="cluster-config-linkage">Linkage</label><select id="cluster-config-linkage"><option value="average">Average</option><option value="complete">Complete</option><option value="single">Single</option></select></div>
          <div class="form-group"><label for="cluster-config-consensus-min">Consensus MFW minimum</label><input type="number" id="cluster-config-consensus-min" value="100" min="25" max="2000" step="25"><small style="color:#666;">First cumulative feature-list size.</small></div>
          <div class="form-group"><label for="cluster-config-consensus-step">MFW increment</label><input type="number" id="cluster-config-consensus-step" value="100" min="10" max="500" step="10"><small style="color:#666;">Added to the cumulative feature list for each tree.</small></div>
          <div class="form-group"><label for="cluster-config-culling-min">Culling minimum (%)</label><input type="number" id="cluster-config-culling-min" value="0" min="0" max="100" step="10"></div>
          <div class="form-group"><label for="cluster-config-culling-max">Culling maximum (%)</label><input type="number" id="cluster-config-culling-max" value="0" min="0" max="100" step="10"></div>
          <div class="form-group"><label for="cluster-config-culling-step">Culling increment</label><input type="number" id="cluster-config-culling-step" value="20" min="1" max="100" step="5"></div>
          <div class="form-group"><label for="cluster-config-consensus-threshold">Consensus threshold</label><input type="number" id="cluster-config-consensus-threshold" value="0.5" min="0.5" max="1" step="0.05"></div>
          <div class="form-group"><label><input type="checkbox" id="cluster-config-lowercase" checked> Convert to lowercase</label></div>
          </div>
        </details>
        <details class="metric-guide"><summary>Distance and linkage guidance</summary><dl>
          <dt>Delta family</dt><dd>Classic, Eder, and Argamon variants depend on feature standard deviations across this selected corpus. Results therefore change when samples are added or removed.</dd>
          <dt>Other distances</dt><dd>Eder’s Simple, cosine, Canberra, Manhattan, and Euclidean use transformed or relative-frequency profiles without corpus z-scores.</dd>
          <dt>Linkage</dt><dd>Average compares all cross-cluster pairs; complete uses the most distant pair and favours compact groups; single uses the closest pair and can form chains.</dd>
          <dt>Consensus</dt><dd>As in <em>stylo</em>, repeated trees use cumulative lists from the MFW minimum to the maximum, optionally repeated across culling levels. Retained splits meet the selected consensus strength; they are stability results, not authorship probabilities.</dd>
        </dl></details>
        <div style="display:flex;gap:0.6rem;margin-top:1rem;"><button class="btn btn-secondary" onclick="switchTab('cluster', 'select')">← Back</button><button class="btn btn-primary" id="cluster-run-btn" onclick="runClusterAnalysis()">Run clustering</button></div>
      </div>
      </section>
      <aside class="analysis-output-panel">
      <div class="workspace-panel-label">Results</div>
      <div id="tab-cluster-results" class="tab-content"><div id="cluster-results-container"><p style="color:#666;">Run an analysis to see results here.</p></div></div>
      </aside>
    </div>
  </div>
  </div>

  <div class="card method-guide">
    <h3>Method, interpretation, and limits</h3>
    <p>This laboratory is designed for hypothesis generation. It measures patterns in transcribed character or word sequences. Results can combine effects from textual content, genre, exemplar or textual tradition, dialect, chronology, scribal language, layout, transcription conventions, and HTR error.</p>
    <p>Scribe selections use only manuscript ranges that can be mapped to transcribed pages. Certainty and range information remain visible in the corpus list. Where several samples assigned to one scribe come from the same manuscript, they are not independent witnesses; any future supervised validation must hold out entire manuscripts rather than random chunks.</p>
    <p><strong>Relation to <em>stylo</em>:</strong> PCA, rolling comparison, hierarchical clustering, and frequency-band consensus follow workflows described by Eder, Rybicki, and Kestemont. They are implemented locally in JavaScript and are not calls to the R package, so defaults and numerical details should not be assumed to reproduce a particular <em>stylo</em> version exactly.</p>
    <p><strong>Delta terminology:</strong> Burrows’ Delta and Classic Delta name the same measure.</p>
    <details>
      <summary><strong>Selected scholarly references</strong></summary>
      <ul>
        <li>John Burrows, “Delta: a Measure of Stylistic Difference and a Guide to Likely Authorship” (2002), <a href="https://academic.oup.com/dsh/article-abstract/17/3/267/929277" target="_blank" rel="noopener">Digital Scholarship in the Humanities</a>.</li>
        <li>Maciej Eder, Jan Rybicki, and Mike Kestemont, “Stylometry with R: a package for computational text analysis” (2016), <a href="https://journal.r-project.org/articles/RJ-2016-007/index.html" target="_blank" rel="noopener">The R Journal</a>.</li>
        <li>Jean-Baptiste Camps, Thibault Clérice, and Ariane Pinche, “Noisy medieval data, from digitized manuscript to stylometric analysis” (2021), <a href="https://academic.oup.com/dsh/article/36/Supplement_2/ii49/6421789" target="_blank" rel="noopener">Digital Scholarship in the Humanities</a>.</li>
        <li>Maciej Eder, “Does size matter? Authorship attribution, small samples, big problem” (2015), <a href="https://doi.org/10.1093/llc/fqt066" target="_blank" rel="noopener">Digital Scholarship in the Humanities</a>.</li>
        <li>Marwa Altakrori et al., “The Topic Confusion Task: A Novel Evaluation Scenario for Authorship Attribution” (2021), <a href="https://aclanthology.org/2021.findings-emnlp.359/" target="_blank" rel="noopener">Findings of EMNLP</a>.</li>
        <li>Greta Franzini et al., “Attributing Authorship in the Noisy Digitized Correspondence of Jacob and Wilhelm Grimm” (2018), <a href="https://www.frontiersin.org/journals/digital-humanities/articles/10.3389/fdigh.2018.00004/full" target="_blank" rel="noopener">Frontiers in Digital Humanities</a>.</li>
        <li>Estelle Guéville and David Joseph Wrisley, “Everyone Leaves a Trace: Exploring Transcriptions of Medieval Manuscripts with Computational Methods,” <em>Digital Studies in Language and Literature</em> 1, nos. 1–2 (2024): 36–54, <a href="https://doi.org/10.1515/dsll-2024-0012" target="_blank" rel="noopener">https://doi.org/10.1515/dsll-2024-0012</a>.</li>
        <li>Estelle Guéville and David Joseph Wrisley, “Transcribing Medieval Manuscripts for Machine Learning,” <em>Journal of Data Mining &amp; Digital Humanities</em>, “On the Way to the Future of Digital Manuscript Studies” (July 2024), <a href="https://doi.org/10.46298/jdmdh.9805" target="_blank" rel="noopener">https://doi.org/10.46298/jdmdh.9805</a>.</li>

        <li>Wouter Haverals and Mike Kestemont, “From Exemplar to Copy: The Scribal Appropriation of a Hadewijch Manuscript Computationally Explored,” <em>Journal of Data Mining &amp; Digital Humanities</em>, “On the Way to the Future of Digital Manuscript Studies: Experiences and Challenges” (April 2023): 10206, <a href="https://doi.org/10.46298/jdmdh.10206" target="_blank" rel="noopener">https://doi.org/10.46298/jdmdh.10206</a>.</li>
        <li>Wouter Haverals and Mike Kestemont, “Silent Voices: A Digital Study of the Herne Charterhouse Scribal Community (ca. 1350–1400),” <em>Queeste</em> 27, no. 2 (2020): 186–95, <a href="https://doi.org/10.5117/QUE2020.2.006.HAVE" target="_blank" rel="noopener">https://doi.org/10.5117/QUE2020.2.006.HAVE</a>.</li>
        <li>Mike Kestemont, <em>A Computational Analysis of the Scribal Profiles in Two of the Oldest Manuscripts of Hadewijch’s Letters</em> (2015).</li>
        <li>Mike Kestemont, Sara Moens, and Jeroen Deploige, “Collaborative Authorship in the Twelfth Century: A Stylometric Study of Hildegard of Bingen and Guibert of Gembloux,” <em>Digital Scholarship in the Humanities</em> 30, no. 2 (2015): 199–224, <a href="https://doi.org/10.1093/llc/fqt063" target="_blank" rel="noopener">https://doi.org/10.1093/llc/fqt063</a>.</li>
        <li>Mike Kestemont and Thorsten Ries, “A Computational Approach to Authorship Verification of Johann Wolfgang Goethe’s Contributions to the <em>Frankfurter Gelehrte Anzeigen</em> (1772–73),” <em>Journal of European Periodical Studies</em> 4, no. 1 (2019), <a href="https://doi.org/10.21825/jeps.v4i1.10188" target="_blank" rel="noopener">https://doi.org/10.21825/jeps.v4i1.10188</a>.</li>
        <li>Eveline Leclercq and Mike Kestemont, “Advances in Distant Diplomatics: A Stylometric Approach to Medieval Charters,” <em>Interfaces: A Journal of Medieval European Literatures</em>, no. 8 (December 2021): 214–44, <a href="https://doi.org/10.54103/interfaces-08-10" target="_blank" rel="noopener">https://doi.org/10.54103/interfaces-08-10</a>.</li>
        <li>David Joseph Wrisley and Estelle Guéville, <em>Medieval Manuscripts and the Computational Humanities: Big Data, Scribes, and the “Paris Bible”</em> (Arc Humanities Press, 2026), <a href="https://doi.org/10.17302/MFSK1586" target="_blank" rel="noopener">https://doi.org/10.17302/MFSK1586</a>.</li>
      </ul>
    </details>
  </div>

</div>

<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
<script>
const BASE_URL = '{{ site.baseurl }}' || '';
const MANUSCRIPT_INDEX_URL = `${BASE_URL}/assets/search/manuscripts/index.json`;
const MANUSCRIPT_DATA_URL = `${BASE_URL}/assets/search/manuscripts/`;
const SCRIBE_TEXT_INDEX_URL = `${BASE_URL}/assets/analysis/scribe-text-index.json`;
const MAX_BROWSER_PCA_FEATURES = 2000;
const PCA_COLORS = [
  '#356f9f', '#a4512b', '#3f7d5b', '#875f91', '#9a6b08', '#397f84',
  '#9b4f66', '#5e6f99', '#68733f', '#765746', '#4f7772', '#7d5b78'
];

// ============================================================================
// GLOBAL STATE
// ============================================================================
let tfidfCorpus = [];
let rollingCorpusA = null;
let rollingCorpusB = null;
let rollingTestText = null;
let rollingReferenceSamplesA = [];
let rollingReferenceSamplesB = [];
let rollingTestSamples = [];
let clusterCorpus = [];
let tfidfResults = null;
let rollingResults = null;
let clusterResults = null;
let manuscriptIndex = null;
let scribeTextIndex = null;
let sourceSelectorCatalog = [];
let activeAnalysisType = 'tfidf-pca';
let focusedCorpusKey = null;
const manuscriptCache = new Map();
const scribeSegmentMap = new Map();
const manuscriptBodyMap = new Map();

// ============================================================================
// LOADING OVERLAY FUNCTIONS
// ============================================================================

function showLoading(mainText = 'Processing...', subText = 'Please wait') {
  const overlay = document.getElementById('loading-overlay');
  const textEl = document.getElementById('loading-text');
  const subTextEl = document.getElementById('loading-subtext');

  if (textEl) textEl.textContent = mainText;
  if (subTextEl) subTextEl.textContent = subText;
  if (overlay) overlay.classList.add('active');
}

function updateLoading(mainText, subText) {
  const textEl = document.getElementById('loading-text');
  const subTextEl = document.getElementById('loading-subtext');

  if (textEl) textEl.textContent = mainText;
  if (subText && subTextEl) subTextEl.textContent = subText;
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.remove('active');
}

function showSuccessMessage(message, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'success-message';
  msgDiv.textContent = message;
  container.parentNode.insertBefore(msgDiv, container.nextSibling);

  setTimeout(() => msgDiv.remove(), 3000);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function fetchJSON(url, description) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${description} (HTTP ${response.status})`);
  }
  return response.json();
}

async function getManuscriptIndex() {
  if (!manuscriptIndex) {
    manuscriptIndex = await fetchJSON(MANUSCRIPT_INDEX_URL, 'the manuscript index');
  }
  return manuscriptIndex;
}

async function getManuscriptData(slug) {
  if (!manuscriptCache.has(slug)) {
    const promise = fetchJSON(
      `${MANUSCRIPT_DATA_URL}${encodeURIComponent(slug)}.json`,
      `manuscript ${slug}`
    ).catch(error => {
      manuscriptCache.delete(slug);
      throw error;
    });
    manuscriptCache.set(slug, promise);
  }
  return manuscriptCache.get(slug);
}

async function getScribeTextIndex() {
  if (!scribeTextIndex) {
    scribeTextIndex = await fetchJSON(SCRIBE_TEXT_INDEX_URL, 'the scribe-to-text index');
    Object.entries(scribeTextIndex.manuscript_bodies || {}).forEach(([slug, body]) => manuscriptBodyMap.set(slug, body));
    (scribeTextIndex.scribes || []).forEach(scribe => {
      (scribe.segments || []).forEach(segment => scribeSegmentMap.set(segment.id, { scribe, segment }));
    });
  }
  return scribeTextIndex;
}

function getDocsForSegment(manuscriptData, segment) {
  const docs = manuscriptData.docs || [];
  if (!segment.page_ids) return docs;
  const allowed = new Set(segment.page_ids.map(String));
  return docs.filter(line => allowed.has(String(line.id || '').split('::')[1]));
}

function getDocsForManuscriptBody(manuscriptData, slug) {
  const body = manuscriptBodyMap.get(slug);
  if (!body?.page_ids?.length) {
    throw new Error(`${slug} has no reliable IIIF boundary for the foliated text body.`);
  }
  return getDocsForSegment(manuscriptData, body);
}

function getSegmentViewerURL(segment) {
  if (!segment?.manifest || !segment?.first_canvas) return '';
  const params = new URLSearchParams({
    ms: segment.manuscript_slug,
    manifest: segment.manifest,
    canvas: segment.first_canvas
  });
  if (segment.annos) params.set('annos', segment.annos);
  return `${BASE_URL}/viewer/?${params.toString()}`;
}

function manuscriptCatalogueLabel(item) {
  const institution = String(item?.institution || '').trim();
  const callNumber = String(item?.call_number || '').trim();
  if (institution && callNumber) return `${institution}, ${callNumber}`;
  return institution || callNumber || item?.manuscript_title || item?.manuscript || item?.manuscript_slug || item?.label || 'Manuscript';
}

function mappedRangeLabel(segment) {
  if (segment.mapped_first_label && segment.mapped_last_label) {
    const mapped = segment.mapped_first_label === segment.mapped_last_label
      ? segment.mapped_first_label
      : `${segment.mapped_first_label}–${segment.mapped_last_label}`;
    return segment.whole_manuscript ? `Text body ${mapped}` : mapped;
  }
  if (segment.whole_manuscript) return 'Foliated text body';
  return segment.folio_range || 'Full manuscript';
}

async function loadScribeSegment(segmentId) {
  await getScribeTextIndex();
  const record = scribeSegmentMap.get(segmentId);
  if (!record) throw new Error(`Unknown scribal segment: ${segmentId}`);
  const { scribe, segment } = record;
  const manuscriptData = await getManuscriptData(segment.manuscript_slug);
  const pageMap = groupLinesByPage(getDocsForSegment(manuscriptData, segment));
  const text = Array.from(pageMap.values()).map(lines => lines.join(' ')).join('\n');
  if (!text.trim()) throw new Error(`No transcription text was found for ${scribe.name}, ${segment.manuscript_slug}.`);
  const range = segment.folio_range ? `, ${segment.folio_range}` : '';
  const manuscriptLabel = manuscriptCatalogueLabel(segment);
  return {
    label: `${scribe.name} — ${manuscriptLabel}${range}`,
    short_label: `${manuscriptLabel} · ${mappedRangeLabel(segment)}`,
    text,
    source: 'scribe attribution',
    transcription_sources: segment.sources || [],
    scribe_id: scribe.id,
    scribe: scribe.name,
    manuscript: segment.manuscript_slug,
    manuscript_title: segment.manuscript_title,
    institution: segment.institution,
    call_number: segment.call_number,
    scribal_unit_id: segment.scribal_unit_id,
    folio_range: segment.folio_range,
    mapped_range: mappedRangeLabel(segment),
    certainty: segment.certainty,
    role: segment.role,
    page_count: pageMap.size,
    excluded_shared_pages: segment.excluded_shared_pages || 0,
    viewer_url: getSegmentViewerURL(segment),
    warnings: segment.warnings || [],
    segment_id: segment.id
  };
}

function groupLinesByPage(docs) {
  const pages = new Map();
  docs.forEach(line => {
    if (!line.id || !line.text) return;
    const idParts = line.id.split('::');
    if (idParts.length < 2) return;
    const pageId = `${idParts[0]}::${idParts[1]}`;
    if (!pages.has(pageId)) pages.set(pageId, []);
    pages.get(pageId).push(line.text);
  });
  return pages;
}

function formatFileSize(sizeInKB) {
  if (!Number.isFinite(sizeInKB)) return '';
  return sizeInKB >= 1024
    ? `${(sizeInKB / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(sizeInKB))} KB`;
}

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

// Switch between analysis types (TF-IDF/PCA, Rolling Stylo, etc.)
function switchAnalysisType(type) {
  activeAnalysisType = type;
  focusedCorpusKey = null;
  document.querySelectorAll('.analysis-method-tabs .tab').forEach(t => t.classList.remove('active'));
  const selectedTab = document.querySelector(`.analysis-method-tabs [data-analysis-type="${type}"]`);
  if (selectedTab) selectedTab.classList.add('active');

  // Hide all analysis sections
  document.querySelectorAll('.analysis-section').forEach(s => {
    s.style.display = 'none';
    s.classList.remove('active');
  });
  
  // Show selected section
  const section = document.getElementById(`analysis-${type}`);
  if (section) {
    section.style.display = 'block';
    section.classList.add('active');
    requestAnimationFrame(() => {
      if (type === 'tfidf-pca' && tfidfResults) renderTFIDFPlot();
      if (type === 'rolling-stylo' && rollingResults) renderRollingPlot();
      if (type === 'cluster-consensus' && clusterResults) renderClusterPlots();
    });
  }
  renderCorpusLedger();
}

function corpusLedgerEntries() {
  if (activeAnalysisType === 'rolling-stylo') {
    return [
      rollingCorpusA && { key: 'a', role: 'Reference A', label: document.getElementById('rolling-corpus-a-label')?.value || 'Reference A', text: rollingCorpusA },
      rollingCorpusB && { key: 'b', role: 'Reference B', label: document.getElementById('rolling-corpus-b-label')?.value || 'Reference B', text: rollingCorpusB },
      rollingTestText && { key: 'test', role: 'Test text', label: document.getElementById('rolling-test-label')?.value || 'Test text', text: rollingTestText }
    ].filter(Boolean);
  }
  const corpus = activeAnalysisType === 'cluster-consensus' ? clusterCorpus : tfidfCorpus;
  return corpus.map((item, index) => ({
    key: corpusItemKey(item, index),
    role: item.scribe || (activeAnalysisType === 'cluster-consensus' ? 'Sample' : 'Text'),
    label: item.sample_label || item.short_label || item.label || `Sample ${index + 1}`,
    text: item.text || ''
  }));
}

function corpusItemKey(item, index = 0) {
  return String(item?.id || item?.segment_id || item?.label || index);
}

function renderCorpusLedger() {
  const list = document.getElementById('corpus-ledger-list');
  const count = document.getElementById('corpus-ledger-count');
  const removeButton = document.getElementById('corpus-ledger-remove');
  if (!list || !count) return;
  const entries = corpusLedgerEntries();
  count.textContent = `${entries.length} item${entries.length === 1 ? '' : 's'}`;
  if (removeButton) removeButton.hidden = !focusedCorpusKey || !entries.some(entry => entry.key === focusedCorpusKey);
  if (!entries.length) {
    list.innerHTML = '<p class="corpus-ledger-empty">The active method’s corpus will remain visible here.</p>';
    return;
  }
  list.innerHTML = entries.map(entry => {
    const words = entry.text.split(/\s+/).filter(Boolean).length;
    return `<button class="corpus-ledger-item${focusedCorpusKey === entry.key ? ' is-focused' : ''}" type="button" onclick="focusCorpusItem(${escapeHTML(JSON.stringify(entry.key))})"><span class="corpus-ledger-role">${escapeHTML(entry.role)}</span>${escapeHTML(entry.label)} · ${words.toLocaleString()} words</button>`;
  }).join('');
}

function focusCorpusItem(key) {
  focusedCorpusKey = String(key);
  renderCorpusLedger();
  if (activeAnalysisType === 'tfidf-pca' && tfidfResults) renderTFIDFPlot();
  if (activeAnalysisType === 'cluster-consensus' && clusterResults) renderClusterPlots();
}

function invalidateMethodResults(method) {
  if (method === 'tfidf-pca') {
    tfidfResults = null;
    const container = document.getElementById('tfidf-results-container');
    if (container) container.innerHTML = '<p style="color:#666;">The corpus changed. Run the PCA again to update the results.</p>';
  } else if (method === 'cluster-consensus') {
    clusterResults = null;
    const container = document.getElementById('cluster-results-container');
    if (container) container.innerHTML = '<p style="color:#666;">The corpus changed. Run clustering again to update the results.</p>';
  } else if (method === 'rolling-stylo') {
    rollingResults = null;
    const container = document.getElementById('rolling-results-container');
    if (container) container.innerHTML = '<p style="color:#666;">One of the three roles changed. Run rolling stylometry again to update the results.</p>';
  }
}

function removeFocusedCorpusItem() {
  if (!focusedCorpusKey) return;
  if (activeAnalysisType === 'tfidf-pca') {
    const index = tfidfCorpus.findIndex((item, itemIndex) => corpusItemKey(item, itemIndex) === focusedCorpusKey);
    if (index >= 0) tfidfCorpus.splice(index, 1);
    invalidateMethodResults(activeAnalysisType);
    focusedCorpusKey = null;
    updateCorpusListTFIDF();
    return;
  }
  if (activeAnalysisType === 'cluster-consensus') {
    const index = clusterCorpus.findIndex((item, itemIndex) => corpusItemKey(item, itemIndex) === focusedCorpusKey);
    if (index >= 0) clusterCorpus.splice(index, 1);
    invalidateMethodResults(activeAnalysisType);
    focusedCorpusKey = null;
    updateClusterCorpusList();
    return;
  }
  if (activeAnalysisType === 'rolling-stylo') {
    if (focusedCorpusKey === 'a') { rollingCorpusA = null; rollingReferenceSamplesA = []; }
    if (focusedCorpusKey === 'b') { rollingCorpusB = null; rollingReferenceSamplesB = []; }
    if (focusedCorpusKey === 'test') { rollingTestText = null; rollingTestSamples = []; }
    const statusId = focusedCorpusKey === 'test' ? 'rolling-test-status' : `rolling-corpus-${focusedCorpusKey}-status`;
    const status = document.getElementById(statusId);
    if (status) status.textContent = focusedCorpusKey === 'test' ? 'No test text loaded.' : 'No reference loaded.';
    invalidateMethodResults(activeAnalysisType);
    focusedCorpusKey = null;
    renderCorpusLedger();
  }
}

function textFingerprint(text = '') {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function reproducibleInput(item, role = null) {
  const stableId = item.id || item.segment_id || (item.source === 'database' && item.manuscript
    ? `ms:${item.manuscript}${item.page ? `:page:${item.page}` : ''}`
    : null);
  const text = item.text || '';
  const record = {
    id: stableId,
    role,
    label: item.sample_label || item.short_label || item.label || role || 'Text',
    scribe: item.scribe || null,
    manuscript: item.manuscript || null,
    mapped_range: item.mapped_range || item.folio_range || null,
    word_count: text.split(/\s+/).filter(Boolean).length,
    text_fingerprint: textFingerprint(text)
  };
  if (!stableId) record.embedded_text = text;
  return record;
}

function buildExperimentRecord(method) {
  const common = {
    schema: 'unknown-hands-text-analysis-experiment/v1',
    created_at: new Date().toISOString(),
    page: window.location.href.split('#')[0],
    implementation: 'Unknown Hands browser text analysis'
  };
  if (method === 'pca' && tfidfResults) return {
    ...common,
    method: 'pca',
    corpus: tfidfCorpus.map(item => reproducibleInput(item)),
    configuration: tfidfResults.config,
    output_summary: { chunks: tfidfResults.chunks.length, retained_features: tfidfResults.features.total, variance_explained: tfidfResults.variance_explained }
  };
  if (method === 'cluster' && clusterResults) return {
    ...common,
    method: 'hierarchical-cluster-and-consensus',
    corpus: clusterCorpus.map(item => reproducibleInput(item)),
    configuration: clusterResults.config,
    output_summary: { samples: clusterResults.samples.length, retained_features: clusterResults.features.length, consensus_runs: clusterResults.consensus?.runs || 0 }
  };
  if (method === 'rolling' && rollingResults) return {
    ...common,
    method: 'rolling-stylometry',
    corpus: [
      ...rollingReferenceSamplesA.map(item => reproducibleInput(item, 'reference-a')),
      ...rollingReferenceSamplesB.map(item => reproducibleInput(item, 'reference-b')),
      ...rollingTestSamples.map(item => reproducibleInput(item, 'test-text'))
    ],
    configuration: rollingResults.config,
    labels: rollingResults.labels,
    output_summary: { windows: rollingResults.results.length, test_word_count: rollingResults.testWordCount }
  };
  return null;
}

function downloadExperimentRecord(method) {
  const record = buildExperimentRecord(method);
  if (!record) return alert('Run the analysis before downloading an experiment record.');
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `unknown-hands-${method}-experiment-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

// Switch between sub-tabs within an analysis type
function switchTab(analysisType, tabName) {
  const prefix = `${analysisType}-`;
  
  // Update tab buttons within this analysis section
  const sectionIds = { tfidf: 'analysis-tfidf-pca', rolling: 'analysis-rolling-stylo', cluster: 'analysis-cluster-consensus' };
  const analysisSection = document.getElementById(sectionIds[analysisType]);
  if (!analysisSection) return;

  // Results occupy the persistent right-hand panel. On narrow layouts, move
  // the viewport to that panel after a run without hiding the active controls.
  if (tabName === 'results') {
    if (window.innerWidth <= 1550) analysisSection.querySelector('.analysis-output-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  
  analysisSection.querySelectorAll(`[data-tab-group="${analysisType}"]`).forEach(t => t.classList.remove('active'));
  const selectedTab = analysisSection.querySelector(
    `[data-tab-group="${analysisType}"][data-tab-name="${tabName}"]`
  );
  if (selectedTab) selectedTab.classList.add('active');

  // Update tab content
  analysisSection.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  const targetTab = document.getElementById(`tab-${prefix}${tabName}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
}

// ============================================================================
// TF-IDF/PCA ANALYSIS FUNCTIONS
// ============================================================================

// Load available manuscripts for TF-IDF
async function loadManuscriptsTFIDF() {
  try {
    const [data, bodyData] = await Promise.all([getManuscriptIndex(), getScribeTextIndex()]);
    const bodies = bodyData.manuscript_bodies || {};
    const manuscriptList = (data.manuscripts || []).filter(ms => bodies[ms.slug]?.page_ids?.length);
    const listEl = document.getElementById('tfidf-manuscript-list');
    if (manuscriptList.length === 0) {
      listEl.innerHTML = '<p style="color: #666;">No transcriptions available.</p>';
      return;
    }

    listEl.innerHTML = manuscriptList.map(ms => {
      const slug = escapeHTML(ms.slug);
      const body = bodies[ms.slug];
      const catalogueLabel = escapeHTML(manuscriptCatalogueLabel(body));
      const mapped = body.mapped_first_label === body.mapped_last_label
        ? body.mapped_first_label
        : `${body.mapped_first_label}–${body.mapped_last_label}`;
      return `
      <div class="manuscript-checkbox">
        <input type="checkbox" id="tfidf-ms-${slug}" value="${slug}">
        <label for="tfidf-ms-${slug}" style="cursor: pointer; flex: 1;">
          <strong>${catalogueLabel}</strong>
          <span style="color: #666; font-size: 0.8rem;"><br>Text body ${escapeHTML(mapped)} · ${Number(body.page_count).toLocaleString()} pages · ${Number(body.word_count).toLocaleString()} words</span>
        </label>
      </div>
    `;
    }).join('');
  } catch (error) {
    console.error('Error loading manuscripts:', error);
    document.getElementById('tfidf-manuscript-list').innerHTML = `
      <div class="error-message">
        Could not load manuscripts. Error: ${error.message}
      </div>
    `;
  }
}

async function loadScribesTFIDF() {
  const listEl = document.getElementById('tfidf-scribe-list');
  try {
    const data = await getScribeTextIndex();
    const scribes = [...(data.scribes || [])].sort((a, b) =>
      (Number(b.sample_count || b.segments?.length) - Number(a.sample_count || a.segments?.length)) ||
      a.name.localeCompare(b.name)
    );
    listEl.innerHTML = scribes.map(scribe => {
      const segments = scribe.segments || [];
      const search = [
        scribe.name,
        ...segments.flatMap(segment => [
          segment.manuscript_slug, segment.manuscript_title, segment.call_number,
          segment.folio_range, segment.scribal_unit_title, segment.script,
          segment.place, ...(segment.languages || [])
        ])
      ].filter(Boolean).join(' ').toLowerCase();
      const segmentRows = segments.map(segment => {
        const viewerUrl = getSegmentViewerURL(segment);
        const certainty = segment.certainty ? ` · ${escapeHTML(segment.certainty)} certainty` : '';
        const role = segment.role ? ` · ${escapeHTML(segment.role)}` : '';
        const source = (segment.sources || []).map(value => value === 'alto' ? 'ALTO' : 'IIIF annotations').join(' + ');
        const mapped = mappedRangeLabel(segment);
        const excluded = segment.excluded_shared_pages
          ? `<br>${segment.excluded_shared_pages} shared page${segment.excluded_shared_pages === 1 ? '' : 's'} excluded`
          : '';
        return `<div class="scribe-segment">
          <input type="checkbox" id="scribe-${escapeHTML(segment.id)}" value="${escapeHTML(segment.id)}" onchange="updateScribeSelectionStatus()">
          <label for="scribe-${escapeHTML(segment.id)}" style="cursor:pointer;">
            <span class="scribe-segment-title">${escapeHTML(manuscriptCatalogueLabel(segment))}</span>
            <span class="scribe-segment-meta">Scribal unit ${escapeHTML(segment.scribal_unit_id || 'not recorded')} · catalogue range ${escapeHTML(segment.folio_range || 'Full manuscript')}${certainty}${role}<br>${Number(segment.word_count).toLocaleString()} words · ${Number(segment.page_count).toLocaleString()} transcribed pages</span>
          </label>
          <span class="scribe-segment-evidence">Used text: ${escapeHTML(mapped)}<br>${escapeHTML(source || 'project transcription')}${excluded}${viewerUrl ? `<br><a href="${escapeHTML(viewerUrl)}" target="_blank" rel="noopener">Inspect first included page</a>` : ''}</span>
        </div>`;
      }).join('');
      return `<details class="scribe-group" data-search="${escapeHTML(search)}" data-sample-count="${segments.length}">
        <summary>
          <span class="scribe-summary-main"><span class="scribe-group-name">${escapeHTML(scribe.name)}</span></span>
          <span class="scribe-group-counts">${segments.length} sample${segments.length === 1 ? '' : 's'} · ${Number(scribe.manuscript_count || 0)} manuscript${Number(scribe.manuscript_count || 0) === 1 ? '' : 's'} · ${Number(scribe.total_words).toLocaleString()} words</span>
        </summary>
        <div class="scribe-segments">${segmentRows}</div>
      </details>`;
    }).join('') || '<p>No mapped scribal samples are available.</p>';
    const multipleCount = scribes.filter(scribe => Number(scribe.sample_count || scribe.segments?.length) > 1).length;
    const skipped = data.summary?.skipped || {};
    const unavailable = Object.entries(skipped).reduce((sum, [reason, count]) => reason === 'generic_scribe' ? sum : sum + Number(count || 0), 0);
    const baseSummary = `${scribes.length} scribes · ${data.summary?.segments || 0} samples · ${multipleCount} scribes with multiple samples${unavailable ? ` · ${unavailable} attribution records omitted because their range or text could not be mapped` : ''}`;
    document.getElementById('tfidf-scribe-summary').dataset.baseSummary = baseSummary;
    const clusterList = document.getElementById('cluster-scribe-list');
    const clusterSummary = document.getElementById('cluster-scribe-summary');
    if (clusterList && clusterSummary) {
      clusterList.innerHTML = listEl.innerHTML;
      clusterList.querySelectorAll('input[type="checkbox"]').forEach(input => {
        const originalId = input.id;
        input.id = `cluster-${originalId}`;
        input.nextElementSibling?.setAttribute('for', input.id);
        input.setAttribute('onchange', 'updateClusterScribeSelectionStatus()');
      });
      clusterSummary.dataset.baseSummary = baseSummary;
    }
    filterScribeList();
    filterClusterScribeList();
  } catch (error) {
    listEl.innerHTML = `<div class="error-message">Could not load scribal segments: ${escapeHTML(error.message)}</div>`;
    const clusterList = document.getElementById('cluster-scribe-list');
    if (clusterList) clusterList.innerHTML = `<div class="error-message">Could not load scribal segments: ${escapeHTML(error.message)}</div>`;
  }
}

function filterScribeList() {
  const needle = (document.getElementById('tfidf-scribe-search')?.value || '').trim().toLowerCase();
  const multipleOnly = document.getElementById('tfidf-multiple-samples-only')?.checked;
  let visible = 0;
  document.querySelectorAll('#tfidf-scribe-list .scribe-group').forEach(group => {
    const matches = (!needle || group.dataset.search.includes(needle)) && (!multipleOnly || Number(group.dataset.sampleCount) > 1);
    group.hidden = !matches;
    if (matches) visible++;
    if (needle && matches) group.open = true;
  });
  const summary = document.getElementById('tfidf-scribe-summary');
  if (summary) {
    const base = summary.dataset.baseSummary || '';
    summary.textContent = needle || multipleOnly ? `${visible} matching scribes · ${base}` : base;
  }
  updateScribeSelectionStatus();
}

function updateScribeSelectionStatus() {
  const selected = document.querySelectorAll('#tfidf-scribe-list input[type="checkbox"]:checked').length;
  const button = document.querySelector('#tab-tfidf-select-corpus .selection-actions .btn');
  if (button) button.textContent = selected ? `Add ${selected} selected sample${selected === 1 ? '' : 's'}` : 'Add selected samples';
}

function filterClusterScribeList() {
  const needle = (document.getElementById('cluster-scribe-search')?.value || '').trim().toLowerCase();
  const multipleOnly = document.getElementById('cluster-multiple-samples-only')?.checked;
  let visible = 0;
  document.querySelectorAll('#cluster-scribe-list .scribe-group').forEach(group => {
    const matches = (!needle || group.dataset.search.includes(needle)) && (!multipleOnly || Number(group.dataset.sampleCount) > 1);
    group.hidden = !matches;
    if (matches) visible++;
    if (needle && matches) group.open = true;
  });
  const summary = document.getElementById('cluster-scribe-summary');
  if (summary) {
    const base = summary.dataset.baseSummary || '';
    summary.textContent = needle || multipleOnly ? `${visible} matching scribes · ${base}` : base;
  }
  updateClusterScribeSelectionStatus();
}

function updateClusterScribeSelectionStatus() {
  const selected = document.querySelectorAll('#cluster-scribe-list input[type="checkbox"]:checked').length;
  const button = document.getElementById('cluster-add-scribes');
  if (button) button.textContent = selected ? `Add ${selected} selected sample${selected === 1 ? '' : 's'}` : 'Add selected samples';
}

async function loadSelectedScribesTFIDF() {
  const checked = Array.from(document.querySelectorAll('#tfidf-scribe-list input:checked'));
  if (!checked.length) return alert('Select at least one scribal sample.');
  showLoading('Loading scribal samples…', 'Applying mapped folio ranges');
  try {
    let added = 0;
    for (const checkbox of checked) {
      updateLoading('Loading scribal sample…', checkbox.value);
      if (tfidfCorpus.some(item => item.segment_id === checkbox.value)) continue;
      tfidfCorpus.push(await loadScribeSegment(checkbox.value));
      added++;
    }
    updateCorpusListTFIDF();
    checked.forEach(input => { input.checked = false; });
    updateScribeSelectionStatus();
    hideLoading();
    showSuccessMessage(`Added ${added} scribal sample${added === 1 ? '' : 's'}`, 'tfidf-scribe-list');
  } catch (error) {
    hideLoading();
    alert('Failed to load scribal segments: ' + error.message);
  }
}

// Load selected manuscripts for TF-IDF
async function loadSelectedManuscriptsTFIDF() {
  const checked = document.querySelectorAll('#tfidf-manuscript-list input:checked');
  if (checked.length === 0) {
    alert('Please select at least one manuscript');
    return;
  }
  
  // Check granularity option
  const granularity = document.querySelector('input[name="tfidf-granularity"]:checked').value;
  const isPageLevel = granularity === 'page';
  
  // Show loading
  showLoading('Loading manuscripts...', 'Fetching transcription data');
  
  try {
    let addedCount = 0;

    for (const checkbox of checked) {
      const slug = checkbox.value;
      updateLoading(`Loading ${slug}...`, 'Fetching selected manuscript');
      await getScribeTextIndex();
      const manuscriptData = await getManuscriptData(slug);
      const body = manuscriptBodyMap.get(slug);
      const pageMap = groupLinesByPage(getDocsForManuscriptBody(manuscriptData, slug));
      
      if (isPageLevel) {
        // Add each page as a separate document
        updateLoading(`Processing ${slug}...`, `Adding ${pageMap.size} pages separately`);
        
        pageMap.forEach((lines, pageId) => {
          // Extract page number from pageId (manuscript::pageNum)
          const pageNum = pageId.split('::')[1];
          const label = `${slug}_page_${pageNum}`;
          
          // Check if already loaded
          if (!tfidfCorpus.find(c => c.label === label)) {
            const text = lines.join(' ');
            if (text.trim()) {
              tfidfCorpus.push({
                label: label,
                short_label: `${manuscriptCatalogueLabel(body)} · transcription page ${pageNum}`,
                text: text,
                source: 'database',
                manuscript: slug,
                manuscript_title: body?.manuscript_title,
                institution: body?.institution,
                call_number: body?.call_number,
                page: pageNum
              });
              addedCount++;
            }
          }
        });
      } else {
        // Add entire manuscript as one document
        if (tfidfCorpus.find(c => c.label === slug)) {
          continue; // Already loaded
        }
        
        updateLoading(`Processing ${slug}...`, 'Concatenating the bounded text body');
        
        // Concatenate the IIIF-bounded text body (page lines joined with spaces).
        const text = Array.from(pageMap.values())
          .map(lines => lines.join(' '))
          .join('\n');
        
        if (text.trim()) {
          tfidfCorpus.push({
            label: slug,
            short_label: `${manuscriptCatalogueLabel(body)} · Text body ${body.mapped_first_label}–${body.mapped_last_label}`,
            text: text,
            source: 'database',
            manuscript: slug,
            manuscript_title: body?.manuscript_title,
            institution: body?.institution,
            call_number: body?.call_number,
            page_count: pageMap.size,
            mapped_range: body?.mapped_first_label && body?.mapped_last_label
              ? `Text body ${body.mapped_first_label}–${body.mapped_last_label}`
              : 'Foliated text body'
          });
          addedCount++;
        }
      }
    }
    
    updateCorpusListTFIDF();
    checked.forEach(cb => cb.checked = false);
    
    hideLoading();
    
    if (addedCount > 0) {
      const unit = isPageLevel ? 'page(s)' : 'manuscript(s)';
      showSuccessMessage(`Added ${addedCount} ${unit} to corpus`, 'tfidf-manuscript-list');
    }
  } catch (error) {
    hideLoading();
    console.error('Error loading manuscripts:', error);
    alert('Failed to load manuscripts: ' + error.message);
  }
}

// Add custom text to TF-IDF corpus
function addCustomTextTFIDF() {
  const label = document.getElementById('tfidf-custom-label').value.trim();
  const text = document.getElementById('tfidf-custom-text').value.trim();
  
  if (!label || !text) {
    alert('Please provide both a label and text content');
    return;
  }
  if (tfidfCorpus.some(item => item.label === label)) {
    alert('Please use a unique label for each text');
    return;
  }
  
  tfidfCorpus.push({ label, text, source: 'custom' });
  document.getElementById('tfidf-custom-label').value = '';
  document.getElementById('tfidf-custom-text').value = '';
  updateCorpusListTFIDF();
}

// Handle file upload for TF-IDF
function handleFileUploadTFIDF(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (text && text.trim()) {
        const baseLabel = file.name.replace(/\.txt$/i, '');
        let label = baseLabel;
        let suffix = 2;
        while (tfidfCorpus.some(item => item.label === label)) {
          label = `${baseLabel} (${suffix++})`;
        }
        tfidfCorpus.push({
          label,
          text: text,
          source: 'upload'
        });
        updateCorpusListTFIDF();
      }
    };
    reader.onerror = (e) => {
      console.error('Error reading file:', file.name, e);
      alert(`Failed to read file: ${file.name}`);
    };
    reader.readAsText(file, 'UTF-8');
  });
  event.target.value = ''; // Reset input
}

// Update corpus list display for TF-IDF
function updateCorpusListTFIDF() {
  if (tfidfResults) invalidateMethodResults('tfidf-pca');
  document.getElementById('tfidf-corpus-count').textContent = tfidfCorpus.length;
  renderCorpusLedger();
  
  const listEl = document.getElementById('tfidf-corpus-list');
  if (tfidfCorpus.length === 0) {
    listEl.innerHTML = '<p style="color: #666;">No texts added yet.</p>';
    return;
  }
  
  const groups = new Map();
  tfidfCorpus.forEach((item, idx) => {
    const groupName = item.scribe || (item.source === 'database' ? 'Manuscript text bodies' : 'Custom texts');
    if (!groups.has(groupName)) groups.set(groupName, []);
    groups.get(groupName).push({ item, idx });
  });

  listEl.innerHTML = Array.from(groups.entries()).map(([groupName, entries]) => {
    const groupWords = entries.reduce((sum, entry) => sum + entry.item.text.split(/\s+/).filter(Boolean).length, 0);
    const items = entries.map(({ item, idx }) => {
    const pageInfo = item.page_count ? ` | ${item.page_count} pages` : '';
    const wordCount = item.text.split(/\s+/).filter(Boolean).length;
    const label = escapeHTML(item.short_label || item.label);
    const source = escapeHTML(item.source);
    const metadata = [
      item.certainty ? `certainty: ${item.certainty}` : '',
      item.role ? `role: ${item.role}` : '',
      item.folio_range ? `catalogue range: ${item.folio_range}` : '',
      item.mapped_range ? `used text: ${item.mapped_range}` : '',
      item.scribal_unit_id ? `scribal unit: ${item.scribal_unit_id}` : ''
    ].filter(Boolean).map(value => `<span class="metadata-chip">${escapeHTML(value)}</span>`).join('');
    const warnings = (item.warnings || []).length
      ? `<div class="notice notice-warning" style="margin:.4rem 0 0;padding:.4rem .6rem;">${item.warnings.map(escapeHTML).join(' ')}</div>`
      : '';
    return `
    <div class="corpus-item">
      <div class="corpus-item-header">
        <span class="corpus-item-label">${label}</span>
        <button class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;" onclick="removeFromCorpusTFIDF(${idx})">
          Remove
        </button>
      </div>
      <div class="corpus-item-info">
        Source: ${source}${pageInfo} | ${wordCount.toLocaleString()} words
      </div>
      ${metadata ? `<div>${metadata}</div>` : ''}${item.viewer_url ? `<div style="margin-top:.3rem;"><a href="${escapeHTML(item.viewer_url)}" target="_blank" rel="noopener">Inspect included pages</a></div>` : ''}${warnings}
    </div>
  `;
    }).join('');
    return `<section class="corpus-scribe-group">
      <div class="corpus-scribe-heading"><strong>${escapeHTML(groupName)}</strong><span>${entries.length} sample${entries.length === 1 ? '' : 's'} · ${groupWords.toLocaleString()} words</span></div>
      ${items}
    </section>`;
  }).join('');
}

function removeFromCorpusTFIDF(idx) {
  tfidfCorpus.splice(idx, 1);
  invalidateMethodResults('tfidf-pca');
  updateCorpusListTFIDF();
}

function markPresetCustom() {
  const preset = document.getElementById('tfidf-config-preset');
  if (preset) preset.value = 'custom';
}

function applyAnalysisPreset(name) {
  if (name === 'custom') return;
  const settings = name === 'lexical'
    ? { type: 'word', size: 1, weighting: 'tfidf', minDf: 2, maxDf: 0.95, maxFeatures: 1000, lowercase: true, chunk: 2000 }
    : { type: 'char', size: 3, weighting: 'relative', minDf: 2, maxDf: 1, maxFeatures: 1000, lowercase: false, chunk: 2000 };
  document.getElementById('tfidf-config-ngram-type').value = settings.type;
  document.getElementById('tfidf-config-ngram-size').value = settings.size;
  document.getElementById('tfidf-config-weighting').value = settings.weighting;
  document.getElementById('tfidf-config-min-df').value = settings.minDf;
  document.getElementById('tfidf-config-max-df').value = settings.maxDf;
  document.getElementById('tfidf-config-max-features').value = settings.maxFeatures;
  document.getElementById('tfidf-config-lowercase').checked = settings.lowercase;
  document.getElementById('tfidf-config-chunk-size').value = settings.chunk;
}

function applyRollingStarter() {
  document.getElementById('rolling-config-window-size').value = 5000;
  document.getElementById('rolling-config-step-size').value = 500;
  document.getElementById('rolling-config-ngram-type').value = 'char';
  document.getElementById('rolling-config-ngram-size').value = 4;
  document.getElementById('rolling-config-mfw').value = 100;
  document.getElementById('rolling-config-distance').value = 'classic-delta';
  document.getElementById('rolling-config-lowercase').checked = true;
}

function applyClusterStarter() {
  document.getElementById('cluster-config-ngram-type').value = 'word';
  document.getElementById('cluster-config-ngram-size').value = 1;
  document.getElementById('cluster-config-max-features').value = 500;
  document.getElementById('cluster-config-distance').value = 'classic-delta';
  document.getElementById('cluster-config-linkage').value = 'average';
  document.getElementById('cluster-config-consensus-min').value = 100;
  document.getElementById('cluster-config-consensus-step').value = 100;
  document.getElementById('cluster-config-culling-min').value = 0;
  document.getElementById('cluster-config-culling-max').value = 0;
  document.getElementById('cluster-config-culling-step').value = 20;
  document.getElementById('cluster-config-consensus-threshold').value = 0.5;
  document.getElementById('cluster-config-lowercase').checked = true;
}

// Run TF-IDF Analysis
async function runTFIDFAnalysis() {
  if (tfidfCorpus.length < 2) {
    alert('Please add at least 2 texts to analyze');
    return;
  }
  
  const btn = document.getElementById('tfidf-run-btn');
  btn.disabled = true;
  
  showLoading('Starting analysis...', 'Initializing');
  
  try {
    const config = {
      ngram_type: document.getElementById('tfidf-config-ngram-type').value,
      ngram_size: parseInt(document.getElementById('tfidf-config-ngram-size').value),
      min_df: parseInt(document.getElementById('tfidf-config-min-df').value),
      max_df: parseFloat(document.getElementById('tfidf-config-max-df').value),
      weighting: document.getElementById('tfidf-config-weighting').value,
      max_features: parseInt(document.getElementById('tfidf-config-max-features').value),
      lowercase: document.getElementById('tfidf-config-lowercase').checked,
      chunk_size: parseInt(document.getElementById('tfidf-config-chunk-size').value),
      n_components: parseInt(document.getElementById('tfidf-config-n-components').value)
    };
    if (!Number.isInteger(config.ngram_size) || config.ngram_size < 1 || config.ngram_size > 10) {
      throw new Error('N-gram size must be between 1 and 10.');
    }
    if (!Number.isInteger(config.min_df) || config.min_df < 1) {
      throw new Error('Minimum document frequency must be at least 1.');
    }
    if (!Number.isFinite(config.max_df) || config.max_df <= 0 || config.max_df > 1) {
      throw new Error('Maximum document frequency must be greater than 0 and no more than 1.');
    }
    if (!Number.isInteger(config.chunk_size) || config.chunk_size < 250) {
      throw new Error('Chunk size must be at least 250 words.');
    }
    if (!Number.isInteger(config.max_features) || config.max_features < 50 || config.max_features > MAX_BROWSER_PCA_FEATURES) {
      throw new Error(`Maximum features must be between 50 and ${MAX_BROWSER_PCA_FEATURES}.`);
    }
    if (!Number.isInteger(config.n_components) || config.n_components < 2 || config.n_components > 3) {
      throw new Error('PCA components must be 2 or 3.');
    }
    
    console.log('Starting TF-IDF analysis...', config);
    
    // Prepare corpus - chunk texts
    updateLoading('Preparing corpus...', `Processing ${tfidfCorpus.length} documents`);
    await sleep(50); // Allow UI to update
    
    const chunks = [];
    const chunkMetadata = [];
    
    tfidfCorpus.forEach((item, docIdx) => {
      updateLoading('Chunking texts...', `Processing ${item.label} (${docIdx + 1}/${tfidfCorpus.length})`);
      
      let text = item.text;
      if (config.lowercase) text = text.toLowerCase();
      
      const textChunks = chunkTextByWords(text, config.chunk_size);
      textChunks.forEach((chunk, idx) => {
        chunks.push(chunk);
        chunkMetadata.push({
          label: item.label,
          short_label: item.short_label || item.label,
          scribe: item.scribe || '',
          scribe_id: item.scribe_id || '',
          manuscript: item.manuscript || '',
          mapped_range: item.mapped_range || item.folio_range || '',
          chunk_idx: idx,
          text: chunk
        });
      });
    });
    
    console.log(`Prepared ${chunks.length} chunks from ${tfidfCorpus.length} documents`);
    if (chunks.length < 2) {
      throw new Error('The selected texts did not produce enough chunks for analysis. Add more text or reduce the chunk size.');
    }
    if (config.min_df > chunks.length) {
      throw new Error(`Minimum document frequency (${config.min_df}) exceeds the number of text chunks (${chunks.length}).`);
    }
    
    updateLoading('Building feature matrix...', `Analyzing ${chunks.length} text chunks`);
    await sleep(50);
    
    const { matrix, features, eligibleFeatureCount } = calculateFeatureMatrix(chunks, config);
    console.log(`Feature matrix: ${matrix.length} × ${features.length}`);
    
    // Calculate PCA
    updateLoading('Computing PCA...', 'Dimensionality reduction in progress');
    await sleep(50);
    
    let actualComponents = Math.min(config.n_components, matrix.length - 1, features.length);
    const pca = calculatePCA(matrix, actualComponents);
    actualComponents = pca.transformed[0].length;
    console.log(`PCA complete: ${actualComponents} components`);
    
    // Build results
    updateLoading('Building results...', 'Preparing visualization');
    await sleep(50);
    
    tfidfResults = {
      chunks: [],
      pages: [],
      features: {
        total: features.length,
        eligible: eligibleFeatureCount,
        top_features: []
      },
      config,
      variance_explained: pca.explained_variance,
      total_variance: pca.total_variance
    };
    
    // Per-chunk results
    chunkMetadata.forEach((meta, i) => {
      const point = {
        label: meta.label,
        short_label: meta.short_label,
        scribe: meta.scribe,
        scribe_id: meta.scribe_id,
        manuscript: meta.manuscript,
        mapped_range: meta.mapped_range,
        chunk_idx: meta.chunk_idx,
        text_preview: meta.text.substring(0, 200) + (meta.text.length > 200 ? '...' : '')
      };
      for (let j = 0; j < actualComponents; j++) {
        point[`PC${j+1}`] = pca.transformed[i][j];
      }
      tfidfResults.chunks.push(point);
    });
    
    // Per-document (average of chunks)
    const docData = {};
    chunkMetadata.forEach((meta, i) => {
      if (!docData[meta.label]) {
        docData[meta.label] = {
          points: [], label: meta.label, short_label: meta.short_label,
          scribe: meta.scribe, scribe_id: meta.scribe_id,
          manuscript: meta.manuscript, mapped_range: meta.mapped_range
        };
      }
      docData[meta.label].points.push(pca.transformed[i]);
    });
    
    Object.values(docData).forEach(doc => {
      const avgPoint = {};
      avgPoint.label = doc.label;
      avgPoint.short_label = doc.short_label;
      avgPoint.scribe = doc.scribe;
      avgPoint.scribe_id = doc.scribe_id;
      avgPoint.manuscript = doc.manuscript;
      avgPoint.mapped_range = doc.mapped_range;
      for (let j = 0; j < actualComponents; j++) {
        const sum = doc.points.reduce((s, p) => s + p[j], 0);
        avgPoint[`PC${j+1}`] = sum / doc.points.length;
      }
      tfidfResults.pages.push(avgPoint);
    });
    
    // Find most distinctive features (highest variance)
    const featureVariances = features.map((feature, idx) => {
      const values = matrix.map(row => row[idx]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      return { feature, variance };
    });
    
    featureVariances.sort((a, b) => b.variance - a.variance);
    const totalFeatureVariance = featureVariances.reduce((sum, feature) => sum + feature.variance, 0);
    tfidfResults.features.top_features = featureVariances.slice(0, 25).map(f => ({
      feature: f.feature,
      variance: f.variance,
      variance_share: totalFeatureVariance > 0 ? f.variance / totalFeatureVariance : 0
    }));

    console.log('Analysis complete!', tfidfResults);
    
    hideLoading();
    displayTFIDFResults();
    switchTab('tfidf', 'results');
    
  } catch (error) {
    console.error('Analysis failed:', error);
    hideLoading();
    alert('Analysis failed: ' + error.message + '\n\nCheck browser console (F12) for details.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Run Analysis';
  }
}

// Helper function to allow UI updates
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Display TF-IDF results
function displayTFIDFResults() {
  const container = document.getElementById('tfidf-results-container');
  
  if (!tfidfResults) {
    container.innerHTML = '<div class="error-message">No results to display.</div>';
    return;
  }
  
  console.log('Displaying TF-IDF results...');
  
  // Calculate variance represented by the displayed components
  const varExplained = tfidfResults.variance_explained || [0, 0, 0];
  const totalVar3D = varExplained.slice(0, 3).reduce((a, b) => a + b, 0) * 100;
  const plotDimensions = Math.min(3, varExplained.length);
  
  // Statistics
  let html = '<div class="stat-grid">';
  html += `
    <div class="stat-card">
      <div class="stat-card-value">${tfidfResults.features.total}</div>
      <div class="stat-card-label">Retained features</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${tfidfResults.chunks.length}</div>
      <div class="stat-card-label">Text chunks</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${tfidfResults.pages.length}</div>
      <div class="stat-card-label">Samples</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${totalVar3D.toFixed(1)}%</div>
      <div class="stat-card-label">Displayed variance</div>
    </div>
  `;
  html += '</div>';
  html += '<div class="result-actions"><button class="btn btn-secondary" type="button" onclick="downloadExperimentRecord(\'pca\')">Download experiment record (.json)</button></div>';
  const config = tfidfResults.config || {};
  const transcriptionSources = new Set(tfidfCorpus.map(item => item.source));
  const chunkCounts = {};
  tfidfResults.chunks.forEach(chunk => { chunkCounts[chunk.label] = (chunkCounts[chunk.label] || 0) + 1; });
  const counts = Object.values(chunkCounts);
  const imbalance = counts.length > 1 && Math.max(...counts) >= 3 * Math.max(1, Math.min(...counts));
  html += `<div class="notice notice-info"><strong>Analysis record:</strong> ${escapeHTML(config.ngram_type || '')} ${Number(config.ngram_size) || ''}-grams · ${escapeHTML(config.weighting || '')} weighting · ${Number(config.chunk_size).toLocaleString()}-word chunks · ${tfidfResults.features.total.toLocaleString()} of ${Number(tfidfResults.features.eligible || tfidfResults.features.total).toLocaleString()} eligible features retained.</div>`;
  if (imbalance) html += '<div class="notice notice-warning"><strong>Uneven sampling:</strong> one text contributes at least three times as many chunks as another. Dense texts can influence the PCA axes more strongly; consider balancing sample lengths.</div>';
  if (transcriptionSources.has('scribe attribution')) html += '<div class="notice notice-warning">Scribe labels describe catalogue/profile attributions to text-bearing ranges. The analysis still measures transcription strings, not handwriting, and does not validate those attributions.</div>';
  
  // PCA Plot
  const pcaLabel = `${plotDimensions >= 3 ? '3D' : plotDimensions === 2 ? '2D' : '1D'} PCA map`;
  html += `<div class="pca-layout"><div class="pca-figure-heading"><h4>${pcaLabel}</h4><p>Dots represent chunks; diamonds mark sample centres. Click either to focus its sample in the corpus ledger.</p></div><div id="tfidf-plot-3d" class="pca-plot"></div>${buildPCAKeyHTML()}</div>`;

  // Top features
  if (tfidfResults.features.top_features.length > 0) {
    html += '<h4 style="margin-top: 1rem;">Highest-variance retained features</h4>';
    html += '<p style="color:#626b78;font-size:.78rem;">Variance is calculated across the normalized chunk vectors used for this PCA. The share gives each feature’s contribution to the total variance across all retained features. In character features, ␠ marks a space.</p>';
    html += '<table class="feature-table"><thead><tr><th>Feature</th><th>Variance across chunks</th><th>Share of retained-feature variance</th></tr></thead><tbody>';
    tfidfResults.features.top_features.slice(0, 15).forEach(f => {
      const share = f.variance_share > 0 && f.variance_share < 0.0001
        ? '&lt;0.01%'
        : `${(f.variance_share * 100).toFixed(2)}%`;
      html += `<tr><td><code>${escapeHTML(String(f.feature).replaceAll(' ', '␠'))}</code></td><td>${Number(f.variance).toExponential(3)}</td><td>${share}</td></tr>`;
    });
    html += '</tbody></table>';
  }
  
  container.innerHTML = html;
  
  // Render 3D plot after DOM update
  setTimeout(() => {
    renderTFIDFPlot();
  }, 100);
}

function pcaGroupKey(item) {
  return item.scribe ? `scribe:${item.scribe_id || item.scribe}` : `sample:${item.label}`;
}

function pcaGroupLabel(item) {
  return item.scribe || item.label;
}

function pcaColorMap() {
  const keys = [];
  tfidfCorpus.forEach(item => {
    const key = pcaGroupKey(item);
    if (!keys.includes(key)) keys.push(key);
  });
  return Object.fromEntries(keys.map((key, index) => [key, PCA_COLORS[index % PCA_COLORS.length]]));
}

function buildPCAKeyHTML() {
  const colors = pcaColorMap();
  const groups = new Map();
  tfidfCorpus.forEach(item => {
    const key = pcaGroupKey(item);
    if (!groups.has(key)) groups.set(key, { label: pcaGroupLabel(item), items: [] });
    groups.get(key).items.push(item);
  });
  const body = Array.from(groups.entries()).map(([key, group]) => `
    <div class="pca-key-group">
      <div class="pca-key-scribe"><span class="pca-key-swatch" style="background:${colors[key]}"></span>${escapeHTML(group.label)}</div>
      ${group.items.map(item => `<div class="pca-key-sample">${escapeHTML(item.short_label || item.label)} · ${item.text.split(/\s+/).filter(Boolean).length.toLocaleString()} words</div>`).join('')}
    </div>`).join('');
  return `<details class="pca-key"><summary>Sample key · ${groups.size} group${groups.size === 1 ? '' : 's'} · ${tfidfCorpus.length} sample${tfidfCorpus.length === 1 ? '' : 's'}</summary><div class="pca-key-body">${body}</div></details>`;
}

function renderTFIDFPlot() {
  if (!tfidfResults || !tfidfResults.chunks || tfidfResults.chunks.length === 0) {
    console.error('No PCA results to display');
    return;
  }
  
  const plotDiv = document.getElementById('tfidf-plot-3d');
  if (!plotDiv) {
    console.error('Plot container not found');
    return;
  }
  
  console.log('Rendering PCA plot with', tfidfResults.chunks.length, 'chunks and', tfidfResults.pages.length, 'documents');
  
  const uniqueLabels = [...new Set(tfidfResults.chunks.map(c => c.label))];
  const corpusByLabel = new Map(tfidfCorpus.map(item => [item.label, item]));
  const groupColors = pcaColorMap();
  
  const data = [];
  const dimensions = Math.min(3, (tfidfResults.variance_explained || []).length);
  const is3D = dimensions >= 3;
  
  // Plot individual chunks (smaller, semi-transparent)
  uniqueLabels.forEach(label => {
    const points = tfidfResults.chunks.filter(c => c.label === label);
    const corpusItem = corpusByLabel.get(label) || { label };
    const corpusKey = corpusItemKey(corpusItem);
    const dimmed = focusedCorpusKey && focusedCorpusKey !== corpusKey;
    const color = groupColors[pcaGroupKey(corpusItem)] || PCA_COLORS[0];
    const trace = {
      x: points.map(p => p.PC1),
      y: points.map(p => dimensions >= 2 ? p.PC2 : 0),
      text: points.map(p => `${escapeHTML(p.scribe || p.label)}<br>${escapeHTML(p.short_label || p.label)}<br>Chunk ${p.chunk_idx + 1}<br>${escapeHTML(p.text_preview)}`),
      customdata: points.map(() => corpusKey),
      mode: 'markers',
      marker: {
        size: 5,
        color,
        opacity: dimmed ? 0.09 : 0.42,
        line: { width: 0 }
      },
      name: `${label} (chunks)`,
      type: is3D ? 'scatter3d' : 'scatter',
      showlegend: false,
      hoverinfo: 'text',
      legendgroup: label
    };
    if (is3D) trace.z = points.map(p => p.PC3);
    data.push(trace);
  });
  
  // Plot document centers (larger, opaque) with text labels
  uniqueLabels.forEach(label => {
    const docPoint = tfidfResults.pages.find(p => p.label === label);
    if (docPoint) {
      const corpusItem = corpusByLabel.get(label) || { label };
      const corpusKey = corpusItemKey(corpusItem);
      const dimmed = focusedCorpusKey && focusedCorpusKey !== corpusKey;
      const color = groupColors[pcaGroupKey(corpusItem)] || PCA_COLORS[0];
      const trace = {
        x: [docPoint.PC1],
        y: [dimensions >= 2 ? docPoint.PC2 : 0],
        text: [`${escapeHTML(docPoint.scribe || label)}<br>${escapeHTML(docPoint.short_label || label)}<br>Sample center`],
        customdata: [corpusKey],
        mode: 'markers',
        marker: {
          size: 13,
          color,
          opacity: dimmed ? 0.22 : 1,
          line: { width: 2, color: '#ffffff' },
          symbol: 'diamond'
        },
        name: `${label} (center)`,
        type: is3D ? 'scatter3d' : 'scatter',
        hoverinfo: 'text',
        showlegend: false,
        legendgroup: label
      };
      if (is3D) trace.z = [docPoint.PC3];
      data.push(trace);
    }
  });
  
  // Calculate variance explained percentages
  const varExplained = tfidfResults.variance_explained || [0, 0, 0];
  const pc1Var = ((varExplained[0] || 0) * 100).toFixed(1);
  const pc2Var = ((varExplained[1] || 0) * 100).toFixed(1);
  const pc3Var = ((varExplained[2] || 0) * 100).toFixed(1);
  
  const layout = {
    height: 520,
    autosize: true,
    margin: is3D ? { l: 0, r: 0, t: 10, b: 0 } : { l: 72, r: 30, t: 20, b: 62 },
    showlegend: false,
    hovermode: 'closest',
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };

  if (is3D) {
    layout.scene = {
      xaxis: {
        title: `PC1 (${pc1Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      yaxis: {
        title: `PC2 (${pc2Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      zaxis: {
        title: `PC3 (${pc3Var}% var)`,
        backgroundcolor: '#f7fafc',
        gridcolor: '#cbd5e0',
        showbackground: true
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.3 }
      }
    };
  } else {
    layout.xaxis = { title: `PC1 (${pc1Var}% var)`, gridcolor: '#e2e8f0', automargin: true, zerolinecolor: '#9ca8ba' };
    layout.yaxis = {
      title: dimensions >= 2 ? `PC2 (${pc2Var}% var)` : '',
      gridcolor: '#e2e8f0',
      zeroline: true,
      zerolinecolor: '#9ca8ba',
      automargin: true
    };
  }
  
  const config = {
    responsive: true,
    displayModeBar: 'hover',
    modeBarButtonsToRemove: ['toImage'],
    displaylogo: false
  };
  
  Plotly.newPlot('tfidf-plot-3d', data, layout, config).then(() => {
    plotDiv.removeAllListeners?.('plotly_click');
    plotDiv.on?.('plotly_click', event => {
      const key = event.points?.[0]?.customdata;
      if (key != null) focusCorpusItem(key);
    });
  });
}

function dendrogramGeometry(tree) {
  const x = [];
  const y = [];
  const tickValues = [];
  const tickLabels = [];
  const tickSampleIndices = [];
  const annotations = [];
  let leafIndex = 0;
  const visit = (node, isRoot = false) => {
    if (!node.children?.length) {
      const leafY = leafIndex++;
      tickValues.push(leafY);
      const label = String(node.label || 'Sample');
      tickLabels.push(label.length > 62 ? `${label.slice(0, 59)}…` : label);
      tickSampleIndices.push(node.sampleIndex);
      return { x: 0, y: leafY };
    }
    const children = node.children.map(child => visit(child));
    const nodeY = children.reduce((sum, child) => sum + child.y, 0) / children.length;
    const nodeX = Number(node.height) || 0;
    children.forEach(child => {
      x.push(child.x, nodeX, null);
      y.push(child.y, child.y, null);
    });
    x.push(nodeX, nodeX, null);
    y.push(Math.min(...children.map(child => child.y)), Math.max(...children.map(child => child.y)), null);
    if (!isRoot && Number.isFinite(node.support)) {
      annotations.push({
        x: nodeX,
        y: nodeY,
        text: `${Math.round(node.support * 100)}%`,
        showarrow: false,
        xanchor: 'left',
        yshift: 9,
        font: { size: 10, color: '#725500' }
      });
    }
    return { x: nodeX, y: nodeY };
  };
  visit(tree, true);
  return { x, y, tickValues, tickLabels, tickSampleIndices, annotations, leaves: leafIndex };
}

function clusterScribeColorMap(samples = []) {
  const keys = [];
  samples.forEach(sample => {
    const key = sample.scribe_id || sample.scribe || 'unattributed';
    if (!keys.includes(key)) keys.push(key);
  });
  return Object.fromEntries(keys.map((key, index) => [key, PCA_COLORS[index % PCA_COLORS.length]]));
}

function buildClusterScribeKeyHTML(samples) {
  const colors = clusterScribeColorMap(samples);
  const groups = new Map();
  samples.forEach(sample => {
    const key = sample.scribe_id || sample.scribe || 'unattributed';
    if (!groups.has(key)) groups.set(key, { name: sample.scribe || 'Unattributed', count: 0 });
    groups.get(key).count += 1;
  });
  return `<div class="cluster-scribe-key" aria-label="Scribe colour key">${Array.from(groups.entries()).map(([key, group]) => `<div class="cluster-scribe-key-item"><span style="background:${colors[key]}"></span><span><strong>${escapeHTML(group.name)}</strong> · ${group.count} sample${group.count === 1 ? '' : 's'}</span></div>`).join('')}</div>`;
}

function renderDendrogram(elementId, tree, samples = []) {
  const plotDiv = document.getElementById(elementId);
  if (!plotDiv || !tree) return;
  const geometry = dendrogramGeometry(tree);
  const height = Math.max(380, Math.min(820, geometry.leaves * 34 + 110));
  const compact = window.innerWidth < 700;
  const colors = clusterScribeColorMap(samples);
  const tickLabels = compact
    ? geometry.tickLabels.map(label => label.length > 28 ? `${label.slice(0, 25)}…` : label)
    : geometry.tickLabels;
  plotDiv.style.height = `${height}px`;
  const trace = {
    x: geometry.x,
    y: geometry.y,
    mode: 'lines',
    line: { color: '#46556b', width: 1.6 },
    hoverinfo: 'skip',
    showlegend: false
  };
  const leafTrace = {
    x: geometry.tickValues.map(() => 0),
    y: geometry.tickValues,
    customdata: geometry.tickSampleIndices.map(index => corpusItemKey(samples[index], index)),
    mode: 'markers',
    marker: {
      size: 8,
      color: geometry.tickSampleIndices.map(index => {
        const sample = samples[index] || {};
        const key = sample.scribe_id || sample.scribe || 'unattributed';
        return colors[key] || '#303847';
      }),
      line: { color: '#fff', width: 1 }
    },
    text: geometry.tickSampleIndices.map(index => `${escapeHTML(samples[index]?.scribe || 'Unattributed')}<br>${escapeHTML(samples[index]?.sample_label || samples[index]?.label || 'Sample')}`),
    hoverinfo: 'text',
    showlegend: false
  };
  const layout = {
    autosize: true,
    height,
    margin: { l: compact ? 155 : 330, r: 35, t: 20, b: 55 },
    xaxis: {
      title: 'Cluster distance',
      gridcolor: '#e2e8f0',
      zeroline: false,
      showticklabels: true,
      automargin: true
    },
    yaxis: {
      tickmode: 'array',
      tickvals: geometry.tickValues,
      ticktext: geometry.tickValues.map(() => ''),
      showgrid: false,
      zeroline: false,
      automargin: true
    },
    annotations: tickLabels.map((label, index) => {
      const sample = samples[geometry.tickSampleIndices[index]] || {};
      const key = sample.scribe_id || sample.scribe || 'unattributed';
      const corpusKey = corpusItemKey(sample, geometry.tickSampleIndices[index]);
      const color = focusedCorpusKey && focusedCorpusKey !== corpusKey ? '#aeb5c0' : (colors[key] || '#303847');
      return { x: 0, y: geometry.tickValues[index], text: escapeHTML(label), showarrow: false, xanchor: 'right', xshift: -8, font: { size: compact ? 10 : 12, color } };
    }),
    paper_bgcolor: 'white',
    plot_bgcolor: 'white',
    showlegend: false
  };
  Plotly.react(plotDiv, [trace, leafTrace], layout, {
    responsive: true,
    displayModeBar: 'hover',
    modeBarButtonsToRemove: ['select2d', 'lasso2d'],
    displaylogo: false
  }).then(() => {
    Plotly.Plots.resize(plotDiv);
    plotDiv.removeAllListeners?.('plotly_click');
    plotDiv.on?.('plotly_click', event => {
      const key = event.points?.[0]?.customdata;
      if (key != null) focusCorpusItem(key);
    });
  });
}

function radialConsensusGeometry(tree) {
  const leaves = [];
  const collect = node => {
    if (!node.children?.length) leaves.push(node);
    else node.children.forEach(collect);
  };
  collect(tree);
  const angles = new Map(leaves.map((leaf, index) => [leaf.sampleIndex, (2 * Math.PI * index / leaves.length) - Math.PI / 2]));
  const maxDepth = Math.max(1, ...leaves.map(leaf => {
    let found = 0;
    const walk = (node, depth) => {
      if (node === leaf) found = depth;
      (node.children || []).forEach(child => walk(child, depth + 1));
    };
    walk(tree, 0);
    return found;
  }));
  const edges = { x: [], y: [] };
  const supports = [];
  const positions = new Map();
  const place = (node, depth = 0) => {
    if (!node.children?.length) {
      const angle = angles.get(node.sampleIndex);
      const point = { x: Math.cos(angle), y: Math.sin(angle), angle, node };
      positions.set(node, point);
      return point;
    }
    const children = node.children.map(child => place(child, depth + 1));
    const unitX = children.reduce((sum, child) => sum + Math.cos(child.angle), 0);
    const unitY = children.reduce((sum, child) => sum + Math.sin(child.angle), 0);
    const angle = Math.atan2(unitY, unitX);
    const radius = depth === 0 ? 0 : Math.min(0.82, depth / maxDepth * 0.72);
    const point = { x: radius * Math.cos(angle), y: radius * Math.sin(angle), angle, node };
    positions.set(node, point);
    children.forEach(child => {
      edges.x.push(point.x, child.x, null);
      edges.y.push(point.y, child.y, null);
      if (Number.isFinite(child.node.support)) supports.push({ x: (point.x + child.x) / 2, y: (point.y + child.y) / 2, support: child.node.support });
    });
    return point;
  };
  place(tree);
  return { leaves: leaves.map(leaf => positions.get(leaf)), edges, supports };
}

function renderConsensusTree(elementId, consensus, samples = []) {
  const plotDiv = document.getElementById(elementId);
  if (!plotDiv || !consensus?.tree) return;
  const geometry = radialConsensusGeometry(consensus.tree);
  const colors = clusterScribeColorMap(samples);
  const height = Math.max(620, Math.min(980, samples.length * 25));
  plotDiv.style.height = `${height}px`;
  const branchTrace = { x: geometry.edges.x, y: geometry.edges.y, mode: 'lines', line: { color: '#46556b', width: 1.25 }, hoverinfo: 'skip', showlegend: false };
  const leafTraces = samples.map((sample, index) => {
    const point = geometry.leaves.find(leaf => leaf.node.sampleIndex === index);
    const key = sample.scribe_id || sample.scribe || 'unattributed';
    return { x: [point.x], y: [point.y], customdata: [corpusItemKey(sample, index)], mode: 'markers', marker: { size: 7, color: colors[key], line: { color: '#fff', width: 1 } }, text: [`${escapeHTML(sample.scribe)}<br>${escapeHTML(sample.sample_label)}`], hoverinfo: 'text', showlegend: false };
  });
  const labelAnnotations = geometry.leaves.map(point => {
    const sample = samples[point.node.sampleIndex] || {};
    const key = sample.scribe_id || sample.scribe || 'unattributed';
    const outwardX = 1.08 * Math.cos(point.angle);
    const outwardY = 1.08 * Math.sin(point.angle);
    const label = sample.sample_label || sample.label || 'Sample';
    return { x: outwardX, y: outwardY, text: escapeHTML(label.length > 48 ? `${label.slice(0, 45)}…` : label), showarrow: false, xanchor: outwardX >= 0 ? 'left' : 'right', yanchor: 'middle', font: { size: 10, color: colors[key] || '#303847' } };
  });
  const supportAnnotations = geometry.supports.filter(item => item.support < 0.9995).map(item => ({ x: item.x, y: item.y, text: `${Math.round(item.support * 100)}%`, showarrow: false, font: { size: 9, color: '#725500' }, bgcolor: 'rgba(255,255,255,.75)' }));
  Plotly.react(plotDiv, [branchTrace, ...leafTraces], {
    autosize: true, height, margin: { l: 150, r: 150, t: 30, b: 30 },
    xaxis: { visible: false, range: [-1.5, 1.5], scaleanchor: 'y', scaleratio: 1 },
    yaxis: { visible: false, range: [-1.35, 1.35] },
    annotations: [...labelAnnotations, ...supportAnnotations],
    paper_bgcolor: 'white', plot_bgcolor: 'white', showlegend: false, hovermode: 'closest'
  }, { responsive: true, displayModeBar: 'hover', modeBarButtonsToRemove: ['select2d', 'lasso2d'], displaylogo: false }).then(() => {
    Plotly.Plots.resize(plotDiv);
    plotDiv.removeAllListeners?.('plotly_click');
    plotDiv.on?.('plotly_click', event => {
      const key = event.points?.[0]?.customdata;
      if (key != null) focusCorpusItem(key);
    });
  });
}

function renderClusterPlots() {
  if (!clusterResults) return;
  renderDendrogram('cluster-hca-plot', clusterResults.tree, clusterResults.samples);
  if (clusterResults.consensus) renderConsensusTree('cluster-consensus-plot', clusterResults.consensus, clusterResults.samples);
}

function updateClusterCorpusList() {
  if (clusterResults) invalidateMethodResults('cluster-consensus');
  const count = document.getElementById('cluster-corpus-count');
  const list = document.getElementById('cluster-corpus-list');
  if (count) count.textContent = clusterCorpus.length;
  renderCorpusLedger();
  if (!list) return;
  if (!clusterCorpus.length) {
    list.innerHTML = '<p style="color:#666;">No samples selected.</p>';
    return;
  }
  list.innerHTML = clusterCorpus.map((item, index) => `<div class="corpus-item"><div class="corpus-item-header"><span class="corpus-item-label">${escapeHTML(item.scribe)} — ${escapeHTML(item.sample_label || item.label)}</span><button class="btn btn-danger" onclick="removeClusterSample(${index})">Remove</button></div><div class="corpus-item-info">${item.text.split(/\s+/).filter(Boolean).length.toLocaleString()} words</div></div>`).join('');
}

function removeClusterSample(index) {
  clusterCorpus.splice(index, 1);
  invalidateMethodResults('cluster-consensus');
  updateClusterCorpusList();
}

async function loadSelectedClusterSamples() {
  const checked = Array.from(document.querySelectorAll('#cluster-scribe-list input[type="checkbox"]:checked'));
  const select = document.getElementById('cluster-source');
  const options = Array.from(select?.selectedOptions || []);
  const selections = [...new Set([
    ...checked.map(input => `scribe:${input.value}`),
    ...options.map(option => option.value)
  ])];
  if (!selections.length) return alert('Select at least one sample.');
  showLoading('Loading cluster corpus…', `Processing ${selections.length} selection${selections.length === 1 ? '' : 's'}`);
  try {
    for (const selection of selections) {
      const [kind, id] = selection.split(/:(.+)/);
      let item;
      if (kind === 'scribe') {
        const segment = await loadScribeSegment(id);
        item = {
          id: `scribe:${id}`,
          label: segment.short_label || segment.label,
          sample_label: segment.short_label || segment.label,
          scribe: segment.scribe || 'Unattributed',
          scribe_id: segment.scribe_id || segment.scribe || 'unattributed',
          text: segment.text
        };
      } else {
        await getScribeTextIndex();
        const manuscriptData = await getManuscriptData(id);
        const body = manuscriptBodyMap.get(id);
        const pageMap = groupLinesByPage(getDocsForManuscriptBody(manuscriptData, id));
        const label = manuscriptCatalogueLabel(body);
        item = { id: `ms:${id}`, label, sample_label: label, scribe: 'Unattributed manuscript body', scribe_id: 'unattributed-body', text: Array.from(pageMap.values()).map(lines => lines.join(' ')).join('\n') };
      }
      if (item.text.trim() && !clusterCorpus.some(existing => existing.id === item.id)) clusterCorpus.push(item);
    }
    checked.forEach(input => { input.checked = false; });
    options.forEach(option => { option.selected = false; });
    updateClusterScribeSelectionStatus();
    updateClusterCorpusList();
  } catch (error) {
    console.error(error);
    alert(`Could not load the selected samples: ${error.message}`);
  } finally {
    hideLoading();
  }
}

async function runClusterAnalysis() {
  if (clusterCorpus.length < 3) return alert('Add at least three samples for hierarchical clustering.');
  const button = document.getElementById('cluster-run-btn');
  button.disabled = true;
  showLoading('Building distance tree…', 'Preparing complete-sample profiles');
  try {
    const config = {
      ngram_type: document.getElementById('cluster-config-ngram-type').value,
      ngram_size: parseInt(document.getElementById('cluster-config-ngram-size').value),
      max_features: parseInt(document.getElementById('cluster-config-max-features').value),
      cluster_distance: document.getElementById('cluster-config-distance').value,
      cluster_linkage: document.getElementById('cluster-config-linkage').value,
      consensus_mfw_min: parseInt(document.getElementById('cluster-config-consensus-min').value),
      consensus_step: parseInt(document.getElementById('cluster-config-consensus-step').value),
      consensus_threshold: parseFloat(document.getElementById('cluster-config-consensus-threshold').value),
      culling_min: parseInt(document.getElementById('cluster-config-culling-min').value),
      culling_max: parseInt(document.getElementById('cluster-config-culling-max').value),
      culling_step: parseInt(document.getElementById('cluster-config-culling-step').value),
      lowercase: document.getElementById('cluster-config-lowercase').checked
    };
    if (!Number.isInteger(config.ngram_size) || config.ngram_size < 1 || config.ngram_size > 10) throw new Error('N-gram size must be between 1 and 10.');
    if (!Number.isInteger(config.max_features) || config.max_features < 50 || config.max_features > 2000) throw new Error('Maximum features must be between 50 and 2,000.');
    if (!Number.isInteger(config.consensus_mfw_min) || config.consensus_mfw_min < 25 || config.consensus_mfw_min > config.max_features) throw new Error('Consensus MFW minimum must be at least 25 and no greater than the maximum features.');
    if (!Number.isInteger(config.consensus_step) || config.consensus_step < 1) throw new Error('MFW increment must be positive.');
    if (!Number.isFinite(config.consensus_threshold) || config.consensus_threshold < 0.5 || config.consensus_threshold > 1) throw new Error('Consensus threshold must be between 0.50 and 1.00.');
    if (![config.culling_min, config.culling_max].every(value => Number.isInteger(value) && value >= 0 && value <= 100) || config.culling_max < config.culling_min) throw new Error('Culling values must be between 0 and 100, with maximum no lower than minimum.');
    if (!Number.isInteger(config.culling_step) || config.culling_step < 1) throw new Error('Culling increment must be positive.');
    await sleep(30);
    const counts = clusterCorpus.map(item => extractNgrams(config.lowercase ? item.text.toLowerCase() : item.text, config.ngram_size, config.ngram_type));
    const corpusFrequency = {};
    counts.forEach(profile => Object.entries(profile).forEach(([feature, value]) => { corpusFrequency[feature] = (corpusFrequency[feature] || 0) + value; }));
    const features = Object.keys(corpusFrequency).sort((a, b) => corpusFrequency[b] - corpusFrequency[a] || a.localeCompare(b)).slice(0, config.max_features);
    if (features.length < 2) throw new Error('Too few usable features remain for clustering.');
    const samples = clusterCorpus.map((item, index) => {
      const vector = features.map(feature => counts[index][feature] || 0);
      const total = vector.reduce((sum, value) => sum + value, 0) || 1;
      return {
        id: item.id,
        label: `${item.scribe} — ${item.sample_label || item.label}`,
        sample_label: item.sample_label || item.label,
        scribe: item.scribe,
        scribe_id: item.scribe_id,
        vector: vector.map(value => value / total)
      };
    });
    const tree = hierarchicalCluster(buildSampleDistanceMatrix(samples.map(sample => sample.vector), config.cluster_distance), samples, config.cluster_linkage);
    const consensus = buildStyloConsensus(samples, config);
    clusterResults = { samples, features, tree, consensus, config };
    displayClusterResults();
    switchTab('cluster', 'results');
  } catch (error) {
    console.error(error);
    alert(`Clustering failed: ${error.message}`);
  } finally {
    hideLoading();
    button.disabled = false;
  }
}

function displayClusterResults() {
  const container = document.getElementById('cluster-results-container');
  if (!container || !clusterResults) return;
  const { samples, features, consensus, config } = clusterResults;
  const metricNames = { 'classic-delta': 'Burrows’ Classic Delta', 'eder-delta': 'Eder’s Delta', 'argamon-delta': 'Argamon’s Linear Delta', 'eders-simple': 'Eder’s Simple', cosine: 'cosine', canberra: 'Canberra', manhattan: 'Manhattan', euclidean: 'Euclidean' };
  let html = `<div class="stat-grid"><div class="stat-card"><div class="stat-card-value">${samples.length}</div><div class="stat-card-label">Samples</div></div><div class="stat-card"><div class="stat-card-value">${features.length}</div><div class="stat-card-label">Retained features</div></div><div class="stat-card"><div class="stat-card-value">${consensus?.runs || 0}</div><div class="stat-card-label">Consensus runs</div></div></div>`;
  html += '<div class="result-actions"><button class="btn btn-secondary" type="button" onclick="downloadExperimentRecord(\'cluster\')">Download experiment record (.json)</button></div>';
  html += `<div class="notice notice-info"><strong>Analysis record:</strong> ${escapeHTML(metricNames[config.cluster_distance] || config.cluster_distance)} · ${escapeHTML(config.cluster_linkage)} linkage · ${escapeHTML(config.ngram_type)} ${config.ngram_size}-grams · complete-sample relative-frequency profiles.</div>`;
  html += buildClusterScribeKeyHTML(samples);
  html += '<section class="cluster-results"><div class="cluster-results-heading"><h4>Hierarchical cluster analysis</h4><p>Horizontal branch length records cluster distance. Click a leaf to focus its sample in the corpus ledger.</p></div><div id="cluster-hca-plot" class="cluster-plot"></div></section>';
  if (consensus) html += `<section class="cluster-results"><div class="cluster-results-heading"><h4>Bootstrap consensus tree</h4><p>${consensus.runs} cumulative-MFW/culling trees · ${(consensus.threshold * 100).toFixed(0)}% consensus strength</p></div><div class="notice notice-info"><strong>Stylo-style consensus:</strong> unrooted majority-rule topology from ${consensus.mfwMin}–${consensus.mfwMax} MFW in increments of ${consensus.mfwStep}, with culling ${consensus.cullingMin}–${consensus.cullingMax}%. Percentages mark retained splits; branch lengths are diagrammatic.</div><div id="cluster-consensus-plot" class="cluster-plot"></div></section>`;
  else html += '<div class="notice notice-info"><strong>Consensus unavailable:</strong> use at least four samples and choose an MFW minimum below the retained-feature maximum so that at least two cumulative trees can be compared.</div>';
  container.innerHTML = html;
  requestAnimationFrame(() => requestAnimationFrame(renderClusterPlots));
}

// ============================================================================
// ROLLING STYLOMETRY FUNCTIONS
// ============================================================================

function renderSourceSelect(selectId, query = '') {
  const selectEl = document.getElementById(selectId);
  if (!selectEl) return;
  const selected = new Set(Array.from(selectEl.selectedOptions || []).map(option => option.value));
  const needle = query.trim().toLowerCase();
  const catalog = selectId === 'cluster-source'
    ? sourceSelectorCatalog.filter(group => group.label === 'Manuscript text bodies')
    : sourceSelectorCatalog;
  const groups = catalog.map(group => {
    const groupMatch = !needle || group.search.includes(needle);
    const options = group.options.filter(option => groupMatch || option.search.includes(needle) || selected.has(option.value));
    if (!options.length) return '';
    return `<optgroup label="${escapeHTML(group.label)}">${options.map(option =>
      `<option value="${escapeHTML(option.value)}"${selected.has(option.value) ? ' selected' : ''}>${escapeHTML(option.label)}</option>`
    ).join('')}</optgroup>`;
  }).join('');
  selectEl.innerHTML = groups || '<option disabled>No matching samples</option>';
}

function filterSourceSelect(selectId, query) {
  renderSourceSelect(selectId, query);
}

async function loadManuscriptsRolling() {
  try {
    const [data, scribalData] = await Promise.all([getManuscriptIndex(), getScribeTextIndex()]);
    const bodies = scribalData.manuscript_bodies || {};
    const manuscriptList = (data.manuscripts || []).filter(ms => bodies[ms.slug]?.page_ids?.length);
    const scribalGroups = [...(scribalData.scribes || [])]
      .sort((a, b) => (Number(b.sample_count) - Number(a.sample_count)) || a.name.localeCompare(b.name))
      .map(scribe => ({
        label: `${scribe.name} — ${scribe.segments.length} sample${scribe.segments.length === 1 ? '' : 's'}`,
        search: `${scribe.name} ${(scribe.segments || []).map(segment => [segment.manuscript_title, segment.call_number, segment.folio_range, segment.place].filter(Boolean).join(' ')).join(' ')}`.toLowerCase(),
        options: (scribe.segments || []).map(segment => {
          const label = `${manuscriptCatalogueLabel(segment)} · ${mappedRangeLabel(segment)} · ${Number(segment.word_count).toLocaleString()} words`;
          return { value: `scribe:${segment.id}`, label, search: `${scribe.name} ${label} ${segment.place || ''} ${segment.script || ''}`.toLowerCase() };
        })
      }));
    const manuscriptOptions = manuscriptList.map(ms => {
      const body = bodies[ms.slug];
      const label = `${manuscriptCatalogueLabel(body)} · text body ${body.mapped_first_label}–${body.mapped_last_label} · ${Number(body.word_count).toLocaleString()} words`;
      return { value: `ms:${ms.slug}`, label, search: `${label} ${body.place || ''}`.toLowerCase() };
    });
    sourceSelectorCatalog = [...scribalGroups];
    if (manuscriptOptions.length) sourceSelectorCatalog.push({
      label: 'Manuscript text bodies',
      search: `manuscript text bodies ${manuscriptOptions.map(option => option.search).join(' ')}`,
      options: manuscriptOptions
    });

    // Populate rolling roles and the independent clustering corpus selector.
    const selects = ['rolling-corpus-a-source', 'rolling-corpus-b-source', 'rolling-test-source', 'cluster-source'];
    selects.forEach(selectId => {
      const selectEl = document.getElementById(selectId);
      if (!selectEl) return;

      if (sourceSelectorCatalog.length === 0) {
        selectEl.innerHTML = '<option disabled>No mapped samples available</option>';
        return;
      }
      renderSourceSelect(selectId);
    });
  } catch (error) {
    console.error('Error loading manuscripts for rolling stylometry:', error);
    const message = `<option>${escapeHTML(error.message)}</option>`;
    ['rolling-corpus-a-source', 'rolling-corpus-b-source', 'rolling-test-source', 'cluster-source'].forEach(id => {
      const selectEl = document.getElementById(id);
      if (selectEl) selectEl.innerHTML = message;
    });
  }
}

async function loadManuscriptRolling(type) {
  const fieldPrefix = type === 'test' ? 'rolling-test' : `rolling-corpus-${type}`;
  const selectId = `${fieldPrefix}-source`;
  const statusId = `${fieldPrefix}-status`;

  const selectEl = document.getElementById(selectId);
  if (!selectEl) {
    alert('The selected corpus control is unavailable. Please refresh the page.');
    return;
  }
  const selectedOptions = Array.from(selectEl.selectedOptions);

  if (selectedOptions.length === 0) {
    alert('Please select at least one scribal sample or manuscript text body.');
    return;
  }
  
  showLoading('Loading manuscript...', 'Processing text data');
  
  try {
    let combinedText = '';
    const loadedLabels = [];
    const loadedSamples = [];
    
    for (const option of selectedOptions) {
      const [kind, id] = option.value.split(/:(.+)/);
      updateLoading(`Loading ${id}...`, kind === 'scribe' ? 'Applying scribal page range' : 'Fetching selected manuscript');
      let text = '';
      if (kind === 'scribe') {
        const item = await loadScribeSegment(id);
        text = item.text;
        loadedLabels.push(item.label);
        loadedSamples.push({ id: `scribe:${id}`, label: item.short_label || item.label, text: item.text });
      } else {
        await getScribeTextIndex();
        const manuscriptData = await getManuscriptData(id);
        const body = manuscriptBodyMap.get(id);
        const pageMap = groupLinesByPage(getDocsForManuscriptBody(manuscriptData, id));
        text = Array.from(pageMap.values()).map(lines => lines.join(' ')).join('\n');
        const label = manuscriptCatalogueLabel(body);
        loadedLabels.push(label);
        loadedSamples.push({ id: `ms:${id}`, label, text });
      }
      
      if (text.trim()) {
        combinedText += (combinedText ? '\n\n' : '') + text;
      }
    }
    if (!combinedText.trim()) {
      throw new Error('The selected manuscript records contain no transcription text.');
    }
    
    // Store in appropriate corpus
    if (rollingResults) invalidateMethodResults('rolling-stylo');
    if (type === 'a') {
      rollingCorpusA = combinedText;
      rollingReferenceSamplesA = loadedSamples;
    } else if (type === 'b') {
      rollingCorpusB = combinedText;
      rollingReferenceSamplesB = loadedSamples;
    } else if (type === 'test') {
      rollingTestText = combinedText;
      rollingTestSamples = loadedSamples;
    }
    
    // Update status
    const wordCount = combinedText.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = combinedText.length;
    const statusEl = document.getElementById(statusId);
    const labelEl = document.getElementById(`${fieldPrefix}-label`);
    if (selectedOptions.length === 1 && labelEl && /^(Corpus [AB]|Reference [AB]|Test Text|Test text)$/.test(labelEl.value.trim())) {
      labelEl.value = loadedLabels[0];
    }
    if (statusEl) {
      statusEl.innerHTML = `<span style="color: #2f855a;">Loaded: ${wordCount.toLocaleString()} words, ${charCount.toLocaleString()} characters</span><br><span style="color:#666;">${escapeHTML(loadedLabels.join('; '))}</span>`;
    }
    renderCorpusLedger();
    
    hideLoading();
  } catch (error) {
    hideLoading();
    console.error('Error loading manuscript:', error);
    alert('Failed to load manuscript: ' + error.message);
  }
}

function addCustomCorpusRolling(type) {
  const textId = `rolling-${type === 'test' ? 'test' : `corpus-${type}`}-text`;
  const statusId = `rolling-${type === 'test' ? 'test' : `corpus-${type}`}-status`;
  
  const textEl = document.getElementById(textId);
  const text = textEl.value.trim();
  
  if (!text) {
    alert('Please paste some text first');
    return;
  }
  
  // Store in appropriate corpus
  if (rollingResults) invalidateMethodResults('rolling-stylo');
  if (type === 'a') {
    rollingCorpusA = text;
    rollingReferenceSamplesA = [{ label: document.getElementById('rolling-corpus-a-label').value || 'Reference A', text }];
  } else if (type === 'b') {
    rollingCorpusB = text;
    rollingReferenceSamplesB = [{ label: document.getElementById('rolling-corpus-b-label').value || 'Reference B', text }];
  } else if (type === 'test') {
    rollingTestText = text;
    rollingTestSamples = [{ label: document.getElementById('rolling-test-label').value || 'Test text', text }];
  }
  
  // Update status
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;
  const statusEl = document.getElementById(statusId);
  if (statusEl) {
    statusEl.innerHTML = `<span style="color: #48bb78;">Loaded: ${wordCount.toLocaleString()} words, ${charCount.toLocaleString()} characters</span>`;
  }
  renderCorpusLedger();
  
  // Clear textarea
  textEl.value = '';
}

async function runRollingStyloAnalysis() {
  // Check if all corpora are loaded
  if (!rollingCorpusA || !rollingCorpusB || !rollingTestText) {
    alert('Please load all three texts: Reference Corpus A, Reference Corpus B, and Test Text');
    return;
  }
  
  const btn = document.getElementById('rolling-run-btn');
  btn.disabled = true;
  showLoading('Starting rolling stylometry...', 'Initializing analysis');
  
  try {
    // Get configuration
    const config = {
      windowSize: parseInt(document.getElementById('rolling-config-window-size').value),
      stepSize: parseInt(document.getElementById('rolling-config-step-size').value),
      ngramType: document.getElementById('rolling-config-ngram-type').value,
      ngramSize: parseInt(document.getElementById('rolling-config-ngram-size').value),
      mfw: parseInt(document.getElementById('rolling-config-mfw').value),
      distance: document.getElementById('rolling-config-distance').value,
      lowercase: document.getElementById('rolling-config-lowercase').checked
    };
    if (!Number.isInteger(config.windowSize) || config.windowSize < 1) {
      throw new Error('Window size must be a positive whole number.');
    }
    if (!Number.isInteger(config.stepSize) || config.stepSize < 1) {
      throw new Error('Step size must be a positive whole number.');
    }
    if (!Number.isInteger(config.ngramSize) || config.ngramSize < 1 || config.ngramSize > 10) {
      throw new Error('N-gram size must be between 1 and 10.');
    }
    if (!Number.isInteger(config.mfw) || config.mfw < 1) {
      throw new Error('Number of features must be a positive whole number.');
    }
    
    const labelA = document.getElementById('rolling-corpus-a-label').value || 'Corpus A';
    const labelB = document.getElementById('rolling-corpus-b-label').value || 'Corpus B';
    const labelTest = document.getElementById('rolling-test-label').value || 'Test Text';
    const deltaMetrics = new Set(['classic-delta', 'eder-delta', 'argamon-delta']);
    if (deltaMetrics.has(config.distance) && (rollingReferenceSamplesA.length + rollingReferenceSamplesB.length < 2)) {
      throw new Error('Delta-family distances require two reference profiles in total: one in A and one in B.');
    }
    
    console.log('Rolling stylometry config:', config);
    
    // Prepare texts
    updateLoading('Preparing texts...', 'Converting to lowercase if needed');
    await sleep(50);
    
    let textA = config.lowercase ? rollingCorpusA.toLowerCase() : rollingCorpusA;
    let textB = config.lowercase ? rollingCorpusB.toLowerCase() : rollingCorpusB;
    let testText = config.lowercase ? rollingTestText.toLowerCase() : rollingTestText;
    
    // Split test text into words for windowing
    updateLoading('Tokenizing test text...', 'Creating sliding windows');
    await sleep(50);
    
    const testWords = testText.split(/\s+/).filter(w => w.length > 0);
    console.log(`Test text: ${testWords.length} words`);
    
    if (testWords.length < config.windowSize) {
      throw new Error(`Test text (${testWords.length} words) is shorter than window size (${config.windowSize} words). Please reduce window size.`);
    }
    
    // Extract n-grams from reference corpora
    updateLoading('Extracting features from reference corpora...', 'Computing n-gram frequencies');
    await sleep(50);
    
    const ngramsA = extractNgrams(textA, config.ngramSize, config.ngramType);
    const ngramsB = extractNgrams(textB, config.ngramSize, config.ngramType);
    
    // Get most frequent n-grams across both corpora
    const allNgrams = {};
    const allCountA = Object.values(ngramsA).reduce((sum, count) => sum + count, 0);
    const allCountB = Object.values(ngramsB).reduce((sum, count) => sum + count, 0);
    Object.keys(ngramsA).forEach(ng => {
      allNgrams[ng] = (allNgrams[ng] || 0) + ngramsA[ng] / (allCountA || 1);
    });
    Object.keys(ngramsB).forEach(ng => {
      allNgrams[ng] = (allNgrams[ng] || 0) + ngramsB[ng] / (allCountB || 1);
    });
    
    const sortedNgrams = Object.entries(allNgrams)
      .sort((a, b) => b[1] - a[1])
      .slice(0, config.mfw)
      .map(([ng, _]) => ng);
    
    console.log(`Using ${sortedNgrams.length} most frequent features`);
    
    // Create feature vectors for reference corpora
    updateLoading('Creating feature vectors...', 'Building reference profiles');
    await sleep(50);
    
    const vectorA = sortedNgrams.map(ng => ngramsA[ng] || 0);
    const vectorB = sortedNgrams.map(ng => ngramsB[ng] || 0);
    
    // Normalize vectors (relative frequencies)
    const totalA = vectorA.reduce((a, b) => a + b, 0);
    const totalB = vectorB.reduce((a, b) => a + b, 0);
    if (sortedNgrams.length === 0 || totalA === 0 || totalB === 0) {
      throw new Error('The reference corpora do not contain enough shared usable features for this configuration.');
    }
    const normVectorA = vectorA.map(v => v / totalA);
    const normVectorB = vectorB.map(v => v / totalB);
    const normalizeReferenceSample = sample => {
      const source = config.lowercase ? sample.text.toLowerCase() : sample.text;
      const counts = extractNgrams(source, config.ngramSize, config.ngramType);
      const vector = sortedNgrams.map(feature => counts[feature] || 0);
      const total = vector.reduce((sum, value) => sum + value, 0) || 1;
      return vector.map(value => value / total);
    };
    const referenceVectorsA = rollingReferenceSamplesA.map(normalizeReferenceSample);
    const referenceVectorsB = rollingReferenceSamplesB.map(normalizeReferenceSample);
    const allReferenceVectors = referenceVectorsA.concat(referenceVectorsB);
    const featureScale = sortedNgrams.map((_, featureIndex) => {
      const values = allReferenceVectors.map(vector => vector[featureIndex]);
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, values.length - 1);
      return Math.sqrt(variance);
    });
    if (deltaMetrics.has(config.distance) && !featureScale.some(scale => scale > 1e-15)) {
      throw new Error('Reference A and Reference B have no varying retained features. Choose different references or adjust the feature settings.');
    }
    const metricContext = { featureScale, featureCount: sortedNgrams.length };
    
    // Slide window through test text
    updateLoading('Sliding window through test text...', 'Computing distances at each position');
    await sleep(50);
    
    const results = [];
    const numWindows = Math.floor((testWords.length - config.windowSize) / config.stepSize) + 1;
    
    for (let i = 0; i < numWindows; i++) {
      const startIdx = i * config.stepSize;
      const endIdx = startIdx + config.windowSize;
      
      if (endIdx > testWords.length) break;
      
      if (i % 5 === 0) {
        updateLoading('Analyzing windows...', `Processing window ${i + 1}/${numWindows}`);
        await sleep(10);
      }
      
      // Extract window text
      const windowWords = testWords.slice(startIdx, endIdx);
      const windowText = windowWords.join(' ');
      
      // Extract n-grams from window
      const windowNgrams = extractNgrams(windowText, config.ngramSize, config.ngramType);
      
      // Create feature vector for window
      const windowVector = sortedNgrams.map(ng => windowNgrams[ng] || 0);
      const totalWindow = windowVector.reduce((a, b) => a + b, 0);
      const normWindowVector = windowVector.map(v => v / (totalWindow || 1));
      
      // Calculate distances to both corpora
      const distA = calculateDistance(normWindowVector, normVectorA, config.distance, metricContext);
      const distB = calculateDistance(normWindowVector, normVectorB, config.distance, metricContext);
      
      results.push({
        position: startIdx,
        endPosition: endIdx,
        distanceToA: distA,
        distanceToB: distB,
        closerReference: distA < distB ? 'A' : 'B'
      });
    }
    
    console.log(`Analyzed ${results.length} windows`);
    
    // Store results
    rollingResults = {
      results: results,
      config: config,
      labels: { a: labelA, b: labelB, test: labelTest },
      testWordCount: testWords.length
    };
    
    hideLoading();
    displayRollingResults();
    switchTab('rolling', 'results');
    
  } catch (error) {
    hideLoading();
    console.error('Rolling stylometry failed:', error);
    alert('Analysis failed: ' + error.message + '\n\nCheck browser console (F12) for details.');
  } finally {
    btn.disabled = false;
  }
}

function displayRollingResults() {
  const container = document.getElementById('rolling-results-container');
  
  if (!rollingResults) {
    container.innerHTML = '<div class="error-message">No results to display.</div>';
    return;
  }
  
  console.log('Displaying rolling stylometry results...');
  
  const { results, config, labels, testWordCount } = rollingResults;
  const safeLabelA = escapeHTML(labels.a);
  const safeLabelB = escapeHTML(labels.b);
  const metricNames = {
    'classic-delta': 'Burrows’ Classic Delta', 'eder-delta': 'Eder’s Delta',
    'argamon-delta': 'Argamon’s Linear Delta', 'eders-simple': 'Eder’s Simple',
    cosine: 'cosine', canberra: 'Canberra', manhattan: 'Manhattan', euclidean: 'Euclidean'
  };
  
  // Statistics
  let html = '<div class="stat-grid">';
  
  const aCount = results.filter(r => r.closerReference === 'A').length;
  const bCount = results.filter(r => r.closerReference === 'B').length;
  const aPercent = ((aCount / results.length) * 100).toFixed(1);
  const bPercent = ((bCount / results.length) * 100).toFixed(1);
  
  html += `
    <div class="stat-card">
      <div class="stat-card-value">${results.length}</div>
      <div class="stat-card-label">Overlapping windows</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${aPercent}%</div>
      <div class="stat-card-label">Closer to reference A</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${bPercent}%</div>
      <div class="stat-card-label">Closer to reference B</div>
    </div>
    <div class="stat-card">
      <div class="stat-card-value">${testWordCount.toLocaleString()}</div>
      <div class="stat-card-label">Words in test text</div>
    </div>
  `;
  html += '</div>';
  html += '<div class="result-actions"><button class="btn btn-secondary" type="button" onclick="downloadExperimentRecord(\'rolling\')">Download experiment record (.json)</button></div>';

  html += `<div class="rolling-reference-key">
    <div class="rolling-reference-item"><span class="rolling-reference-mark" style="background:#356f9f"></span><span><strong>A</strong> — ${safeLabelA}</span></div>
    <div class="rolling-reference-item"><span class="rolling-reference-mark" style="background:#a4512b"></span><span><strong>B</strong> — ${safeLabelB}</span></div>
  </div>`;
  html += `<div class="notice notice-info"><strong>Analysis record:</strong> ${config.ngramType} ${config.ngramSize}-grams · ${config.mfw} most frequent retained features · ${escapeHTML(metricNames[config.distance] || config.distance)} · ${config.windowSize.toLocaleString()}-word window · ${config.stepSize.toLocaleString()}-word step.</div>`;
  html += `<div class="notice notice-warning">The percentages count only which reference has the lower distance in each overlapping window. They are descriptive, not probabilities or confidence estimates. Adjacent windows share text and are not independent observations.</div>`;
  html += '<div class="rolling-result-heading"><h4>Relative distance over the test text</h4><p>Points are windows; the dark line is a short moving average. Below zero: closer to A. Above zero: closer to B. Click a window to focus the test text in the ledger.</p></div>';
  html += '<div id="rolling-contrast-plot" class="rolling-plot"></div>';
  html += '<div class="rolling-result-heading"><h4>Distance to each reference</h4><p>Each line is the distance from the same test windows to one reference. At any position, the lower line is the closer reference.</p></div>';
  html += '<div id="rolling-distance-plot" class="rolling-plot"></div>';
  
  container.innerHTML = html;
  
  // Render only after the results tab is visible and has a stable width.
  requestAnimationFrame(() => requestAnimationFrame(() => renderRollingPlot()));
}

function renderRollingPlot() {
  if (!rollingResults || !rollingResults.results) {
    console.error('No rolling results to plot');
    return;
  }
  const contrastDiv = document.getElementById('rolling-contrast-plot');
  const distanceDiv = document.getElementById('rolling-distance-plot');
  if (!contrastDiv || !distanceDiv) return;

  const { results } = rollingResults;
  const positions = results.map(result => result.position);
  const differences = results.map(result => result.distanceToA - result.distanceToB);
  const smoothingSpan = Math.min(9, Math.max(3, Math.floor(results.length / 80) * 2 + 1));
  const radius = Math.floor(smoothingSpan / 2);
  const smoothed = differences.map((_, index) => {
    const start = Math.max(0, index - radius);
    const end = Math.min(differences.length, index + radius + 1);
    return differences.slice(start, end).reduce((sum, value) => sum + value, 0) / (end - start);
  });

  const rawTrace = {
    x: positions,
    y: differences,
    customdata: results.map(result => [result.endPosition, result.distanceToA, result.distanceToB]),
    mode: 'lines+markers',
    line: { color: '#aeb6c2', width: 1 },
    marker: {
      size: 4,
      opacity: 0.55,
      color: differences.map(value => value <= 0 ? '#356f9f' : '#a4512b')
    },
    hovertemplate: 'Words %{x:,}–%{customdata[0]:,}<br>A − B: %{y:.4f}<br>Distance to A: %{customdata[1]:.4f}<br>Distance to B: %{customdata[2]:.4f}<extra></extra>',
    showlegend: false
  };
  const smoothTrace = {
    x: positions,
    y: smoothed,
    mode: 'lines',
    line: { color: '#303847', width: 2.25 },
    hoverinfo: 'skip',
    showlegend: false
  };
  const data = [rawTrace, smoothTrace];
  
  const layout = {
    autosize: true,
    xaxis: {
      title: 'Word position in test text',
      gridcolor: '#e2e8f0',
      automargin: true,
      rangemode: 'tozero'
    },
    yaxis: {
      title: 'Distance to A − distance to B',
      gridcolor: '#e2e8f0',
      zeroline: true,
      zerolinecolor: '#303847',
      zerolinewidth: 1.5,
      automargin: true
    },
    height: 480,
    margin: { l: 82, r: 30, t: 20, b: 65 },
    showlegend: false,
    hovermode: 'closest',
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };
  
  const config = {
    responsive: true,
    displayModeBar: 'hover',
    modeBarButtonsToRemove: ['select2d', 'lasso2d'],
    displaylogo: false
  };
  
  Plotly.react(contrastDiv, data, layout, config).then(() => {
    Plotly.Plots.resize(contrastDiv);
    contrastDiv.removeAllListeners?.('plotly_click');
    contrastDiv.on?.('plotly_click', () => focusCorpusItem('test'));
  });

  const distanceData = [
    {
      x: positions,
      y: results.map(result => result.distanceToA),
      customdata: results.map(result => result.endPosition),
      mode: 'lines',
      line: { color: '#356f9f', width: 1.8 },
      name: 'Reference A',
      hovertemplate: 'Words %{x:,}–%{customdata:,}<br>Distance to A: %{y:.5f}<extra></extra>'
    },
    {
      x: positions,
      y: results.map(result => result.distanceToB),
      customdata: results.map(result => result.endPosition),
      mode: 'lines',
      line: { color: '#a4512b', width: 1.8 },
      name: 'Reference B',
      hovertemplate: 'Words %{x:,}–%{customdata:,}<br>Distance to B: %{y:.5f}<extra></extra>'
    }
  ];
  const distanceLayout = {
    autosize: true,
    height: 480,
    margin: { l: 82, r: 30, t: 20, b: 65 },
    xaxis: { title: 'Word position in test text', gridcolor: '#e2e8f0', automargin: true, rangemode: 'tozero' },
    yaxis: { title: 'Distance (lower is closer)', gridcolor: '#e2e8f0', automargin: true, rangemode: 'tozero' },
    showlegend: false,
    hovermode: 'x unified',
    paper_bgcolor: 'white',
    plot_bgcolor: 'white'
  };
  Plotly.react(distanceDiv, distanceData, distanceLayout, config).then(() => {
    Plotly.Plots.resize(distanceDiv);
    distanceDiv.removeAllListeners?.('plotly_click');
    distanceDiv.on?.('plotly_click', () => focusCorpusItem('test'));
  });
}

// Calculate distance between two vectors
function calculateDistance(vec1, vec2, metric = 'cosine', context = {}) {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length');
  }
  
  const usable = vec1.map((_, index) => index).filter(index => !context.featureScale || context.featureScale[index] > 1e-15);
  if (metric === 'classic-delta') {
    if (!context.featureScale) throw new Error('Classic Delta requires reference-corpus feature scales.');
    return usable.reduce((sum, index) => sum + Math.abs(vec1[index] - vec2[index]) / context.featureScale[index], 0) / Math.max(1, usable.length);
  } else if (metric === 'eder-delta') {
    if (!context.featureScale) throw new Error('Eder’s Delta requires reference-corpus feature scales.');
    const n = context.featureCount || vec1.length;
    return usable.reduce((sum, index) => {
      const rankWeight = (n - index) / n;
      return sum + (Math.abs(vec1[index] - vec2[index]) / context.featureScale[index]) * rankWeight;
    }, 0) / Math.max(1, usable.length);
  } else if (metric === 'argamon-delta') {
    if (!context.featureScale) throw new Error('Argamon’s Linear Delta requires reference-corpus feature scales.');
    const sumSquares = usable.reduce((sum, index) => sum + ((vec1[index] - vec2[index]) / context.featureScale[index]) ** 2, 0);
    return Math.sqrt(sumSquares / Math.max(1, usable.length));
  } else if (metric === 'eders-simple') {
    return vec1.reduce((sum, value, index) => sum + Math.abs(Math.sqrt(Math.max(0, value)) - Math.sqrt(Math.max(0, vec2[index]))), 0);
  } else if (metric === 'canberra') {
    return vec1.reduce((sum, value, index) => {
      const denominator = Math.abs(value) + Math.abs(vec2[index]);
      return sum + (denominator ? Math.abs(value - vec2[index]) / denominator : 0);
    }, 0);
  } else if (metric === 'cosine') {
    // Cosine distance = 1 - cosine similarity
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) return 1;
    
    const cosineSim = dotProduct / (mag1 * mag2);
    return 1 - cosineSim;
    
  } else if (metric === 'manhattan') {
    // Manhattan distance (L1)
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.abs(vec1[i] - vec2[i]);
    }
    return sum;
    
  } else if (metric === 'euclidean') {
    // Euclidean distance (L2)
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      const diff = vec1[i] - vec2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }
  
  return 0;
}

// ============================================================================
// SHARED HELPER FUNCTIONS
// ============================================================================

// Split into comparable word-count samples. Retain a final tail only if it is
// at least 60% of the requested size; short texts remain usable as one sample.
function chunkTextByWords(text, chunkSize = 2000, minTailRatio = 0.6) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  if (words.length <= chunkSize) return [words.join(' ')];
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize);
    if (i + chunkSize < words.length || chunk.length >= Math.floor(minTailRatio * chunkSize)) {
      chunks.push(chunk.join(' '));
    }
  }
  return chunks;
}

// Helper: extract n-grams
function extractNgrams(text, n, type = 'char') {
  const ngrams = {};
  if (type === 'char') {
    for (let i = 0; i <= text.length - n; i++) {
      const ngram = text.substring(i, i + n);
      ngrams[ngram] = (ngrams[ngram] || 0) + 1;
    }
  } else if (type === 'word') {
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    for (let i = 0; i <= words.length - n; i++) {
      const ngram = words.slice(i, i + n).join(' ');
      ngrams[ngram] = (ngrams[ngram] || 0) + 1;
    }
  }
  return ngrams;
}

function buildSampleDistanceMatrix(vectors, metric) {
  const featureCount = vectors[0]?.length || 0;
  const featureScale = Array.from({ length: featureCount }, (_, feature) => {
    const mean = vectors.reduce((sum, vector) => sum + vector[feature], 0) / vectors.length;
    const variance = vectors.reduce((sum, vector) => sum + (vector[feature] - mean) ** 2, 0) / Math.max(1, vectors.length - 1);
    return Math.sqrt(variance);
  });
  const context = { featureScale, featureCount };
  return vectors.map((vector, row) => vectors.map((other, column) => {
    if (row === column) return 0;
    return calculateDistance(vector, other, metric, context);
  }));
}

function hierarchicalCluster(distanceMatrix, samples, linkage = 'average') {
  let clusters = samples.map((sample, index) => ({
    members: [index],
    children: [],
    height: 0,
    label: sample.label,
    sampleIndex: index
  }));
  const between = (left, right) => {
    const distances = left.members.flatMap(a => right.members.map(b => distanceMatrix[a][b]));
    if (linkage === 'single') return Math.min(...distances);
    if (linkage === 'complete') return Math.max(...distances);
    return distances.reduce((sum, value) => sum + value, 0) / distances.length;
  };
  while (clusters.length > 1) {
    let best = { left: 0, right: 1, distance: Infinity };
    for (let left = 0; left < clusters.length; left++) {
      for (let right = left + 1; right < clusters.length; right++) {
        const distance = between(clusters[left], clusters[right]);
        if (distance < best.distance - 1e-15) best = { left, right, distance };
      }
    }
    const leftCluster = clusters[best.left];
    const rightCluster = clusters[best.right];
    const merged = {
      members: [...leftCluster.members, ...rightCluster.members].sort((a, b) => a - b),
      children: [leftCluster, rightCluster],
      height: best.distance
    };
    clusters = clusters.filter((_, index) => index !== best.left && index !== best.right);
    clusters.push(merged);
  }
  return clusters[0];
}

function treeClades(tree, sampleCount) {
  const clades = [];
  const visit = node => {
    if (node.children?.length) {
      if (node.members.length > 1 && node.members.length < sampleCount) {
        clades.push([...node.members].sort((a, b) => a - b));
      }
      node.children.forEach(visit);
    }
  };
  visit(tree);
  return clades;
}

// Convert rooted hclust clades into root-independent phylogenetic splits. We
// orient every split away from sample 0 so the majority-rule consensus can be
// represented as a rooted data structure and drawn as an unrooted tree.
function treeConsensusSplits(tree, sampleCount, rootSample = 0) {
  const allMembers = Array.from({ length: sampleCount }, (_, index) => index);
  const splits = [];
  const visit = node => {
    if (node.children?.length) {
      let side = [...node.members];
      if (side.includes(rootSample)) side = allMembers.filter(member => !side.includes(member));
      side.sort((a, b) => a - b);
      if (side.length >= 2 && side.length <= sampleCount - 2) splits.push(side);
      node.children.forEach(visit);
    }
  };
  visit(tree);
  return splits;
}

function compatibleClades(left, right) {
  const a = new Set(left);
  const b = new Set(right);
  const intersection = left.filter(value => b.has(value)).length;
  return intersection === 0 || intersection === a.size || intersection === b.size;
}

function buildConsensusTree(samples, supportedClades) {
  const allMembers = samples.map((_, index) => index);
  const buildNode = (members, support = 1) => {
    const proper = supportedClades.filter(clade =>
      clade.members.length < members.length && clade.members.every(member => members.includes(member))
    );
    const maximal = proper.filter(clade => !proper.some(other =>
      other !== clade && other.members.length > clade.members.length && clade.members.every(member => other.members.includes(member))
    ));
    const covered = new Set(maximal.flatMap(clade => clade.members));
    const children = maximal.map(clade => buildNode(clade.members, clade.support));
    members.filter(member => !covered.has(member)).forEach(member => children.push({
      members: [member], children: [], height: 0, label: samples[member].label, sampleIndex: member
    }));
    return {
      members: [...members],
      children,
      height: children.length ? 1 + Math.max(...children.map(child => child.height)) : 0,
      support
    };
  };
  return buildNode(allMembers, 1);
}

function buildStyloConsensus(samples, config) {
  const featureCount = samples[0]?.vector.length || 0;
  if (samples.length < 4 || featureCount < config.consensus_mfw_min) return null;
  const cullingLevels = [];
  for (let culling = config.culling_min; culling <= config.culling_max; culling += config.culling_step) cullingLevels.push(culling);
  if (!cullingLevels.includes(config.culling_max)) cullingLevels.push(config.culling_max);
  const iterations = [];
  cullingLevels.forEach(culling => {
    const eligible = Array.from({ length: featureCount }, (_, index) => index).filter(index => {
      const occurrence = samples.filter(sample => sample.vector[index] > 0).length / samples.length * 100;
      return occurrence + 1e-12 >= culling;
    });
    const maximum = Math.min(config.max_features, eligible.length);
    for (let mfw = config.consensus_mfw_min; mfw <= maximum; mfw += config.consensus_step) {
      iterations.push({ culling, mfw, featureIndices: eligible.slice(0, mfw) });
    }
    if (maximum >= config.consensus_mfw_min && !iterations.some(run => run.culling === culling && run.mfw === maximum)) {
      iterations.push({ culling, mfw: maximum, featureIndices: eligible.slice(0, maximum) });
    }
  });
  if (iterations.length > 80) throw new Error(`Consensus settings would require ${iterations.length} trees. Increase the MFW or culling increment to keep this at 80 or fewer.`);
  if (iterations.length < 2) return null;
  const counts = new Map();
  iterations.forEach(iteration => {
    const bandVectors = samples.map(sample => {
      const band = iteration.featureIndices.map(index => sample.vector[index]);
      const total = band.reduce((sum, value) => sum + value, 0) || 1;
      return band.map(value => value / total);
    });
    const distances = buildSampleDistanceMatrix(bandVectors, config.cluster_distance);
    const tree = hierarchicalCluster(distances, samples, config.cluster_linkage);
    treeConsensusSplits(tree, samples.length).forEach(members => {
      const key = members.join(',');
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  const candidates = Array.from(counts.entries())
    .map(([key, count]) => ({ members: key.split(',').map(Number), support: count / iterations.length }))
    .filter(clade => clade.support + 1e-12 >= config.consensus_threshold)
    .sort((a, b) => b.support - a.support || b.members.length - a.members.length);
  const compatible = [];
  candidates.forEach(candidate => {
    if (compatible.every(existing => compatibleClades(candidate.members, existing.members))) compatible.push(candidate);
  });
  return {
    tree: buildConsensusTree(samples, compatible),
    runs: iterations.length,
    mfwMin: config.consensus_mfw_min,
    mfwMax: Math.max(...iterations.map(iteration => iteration.mfw)),
    mfwStep: config.consensus_step,
    cullingMin: config.culling_min,
    cullingMax: config.culling_max,
    cullingStep: config.culling_step,
    threshold: config.consensus_threshold,
    retainedClades: compatible.length
  };
}

function calculateFeatureMatrix(documents, config) {
  const { ngram_type, ngram_size, min_df, max_df } = config;
  const docNgrams = documents.map(doc => extractNgrams(doc, ngram_size, ngram_type));
  const N = documents.length;
  const df = {};
  const corpusCounts = {};
  docNgrams.forEach(ngrams => {
    Object.keys(ngrams).forEach(ngram => {
      df[ngram] = (df[ngram] || 0) + 1;
      corpusCounts[ngram] = (corpusCounts[ngram] || 0) + ngrams[ngram];
    });
  });
  const eligible = Object.keys(df).filter(ngram => {
    const docFreq = df[ngram];
    return docFreq >= min_df && docFreq / N <= max_df;
  }).sort((a, b) => corpusCounts[b] - corpusCounts[a] || a.localeCompare(b));
  const features = eligible.slice(0, config.max_features);
  if (features.length === 0) {
    throw new Error('No features remain after filtering. Lower minimum document frequency or raise maximum document frequency.');
  }
  const matrix = docNgrams.map(ngrams => {
    const vector = features.map(feature => {
      const count = ngrams[feature] || 0;
      return config.weighting === 'tfidf'
        ? count * (Math.log((N + 1) / ((df[feature] || 0) + 1)) + 1)
        : count;
    });
    const norm = config.weighting === 'tfidf'
      ? Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0))
      : vector.reduce((sum, value) => sum + value, 0);
    return norm > 0 ? vector.map(value => value / norm) : vector;
  });
  return { matrix, features, eligibleFeatureCount: eligible.length };
}

// Dual PCA: eigendecompose the sample Gram matrix rather than a potentially
// much larger feature covariance matrix. Iteration is deterministic and each
// component is re-orthogonalized on every pass.
function calculatePCA(matrix, nComponents = 3) {
  const n = matrix.length;
  const m = matrix[0].length;
  const means = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      means[j] += matrix[i][j];
    }
  }
  for (let j = 0; j < m; j++) means[j] /= n;
  
  const centered = matrix.map(row => row.map((value, j) => value - means[j]));
  const gram = Array.from({ length: n }, () => new Array(n).fill(0));
  let totalVariance = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let dot = 0;
      for (let k = 0; k < m; k++) dot += centered[i][k] * centered[j][k];
      const value = dot / Math.max(1, n - 1);
      gram[i][j] = value;
      gram[j][i] = value;
      if (i === j) totalVariance += value;
    }
  }
  if (totalVariance <= 1e-15) throw new Error('The retained feature vectors have no variance. Try different texts or settings.');

  const eigenvectors = [];
  const eigenvalues = [];
  const maxComponents = Math.min(nComponents, n - 1, m);
  for (let component = 0; component < maxComponents; component++) {
    let vector = Array.from({ length: n }, (_, i) => Math.sin((i + 1) * (component + 1) * 1.61803398875));
    for (let iteration = 0; iteration < 200; iteration++) {
      let next = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) next[i] += gram[i][j] * vector[j];
      }
      for (const previous of eigenvectors) {
        let projection = 0;
        for (let i = 0; i < n; i++) projection += next[i] * previous[i];
        for (let i = 0; i < n; i++) next[i] -= projection * previous[i];
      }
      const norm = Math.sqrt(next.reduce((sum, value) => sum + value * value, 0));
      if (norm <= 1e-15) break;
      next = next.map(value => value / norm);
      const change = Math.min(
        Math.sqrt(next.reduce((sum, value, i) => sum + (value - vector[i]) ** 2, 0)),
        Math.sqrt(next.reduce((sum, value, i) => sum + (value + vector[i]) ** 2, 0))
      );
      vector = next;
      if (change < 1e-10) break;
    }
    let eigenvalue = 0;
    for (let i = 0; i < n; i++) {
      let rowProduct = 0;
      for (let j = 0; j < n; j++) rowProduct += gram[i][j] * vector[j];
      eigenvalue += vector[i] * rowProduct;
    }
    if (eigenvalue <= 1e-12) break;
    eigenvectors.push(vector);
    eigenvalues.push(eigenvalue);
  }
  if (!eigenvectors.length) throw new Error('PCA could not identify a non-zero component.');
  const transformed = Array.from({ length: n }, () => new Array(eigenvectors.length).fill(0));
  eigenvectors.forEach((vector, component) => {
    const scale = Math.sqrt(Math.max(0, (n - 1) * eigenvalues[component]));
    for (let i = 0; i < n; i++) transformed[i][component] = vector[i] * scale;
  });
  return {
    transformed,
    explained_variance: eigenvalues.map(value => value / totalVariance),
    total_variance: totalVariance
  };
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  renderCorpusLedger();
  // Load manuscripts for TF-IDF tab
  loadManuscriptsTFIDF();
  loadScribesTFIDF();
  
  // Attach file upload handler for TF-IDF
  const fileInput = document.getElementById('tfidf-file-upload');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUploadTFIDF);
  }
  
  // Load manuscripts for Rolling Stylometry
  loadManuscriptsRolling();
});
</script>
