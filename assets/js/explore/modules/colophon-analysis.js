window.ExploreColophonAnalysis = (function() {
  return {
    init: function(Core) {
      const {
        val, getVal, getDetail, getRes, getDetailsAll, getValsAll, getControlledValsAll, esc,
        $panes, $tabs, $mapTitle, exportMapAsPng, TimelineModule, ensureLeaflet
      } = Core;
      const REC_TYPE_TO_ENTITY = Core.REC_TYPE_TO_ENTITY || {};
      const isKnownCategory = Core.isKnownCategory;

      const getRecordRelationships = (recId) => {
        const id = String(recId);
        const outgoing = Core.REL_INDEX?.bySource?.[id] || [];
        const incoming = Core.REL_INDEX?.byTarget?.[id] || [];
        return [...outgoing, ...incoming];
      };

      const getTIMELINE_SELECTED = () => null;

      const debounce = (fn, ms) => {
        let t;
        return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
      };

      /**
       * Get production unit(s) for a scribal unit
       * Returns: [puId, ...]
       */
      function getPUsForSU(su) {
        const pus = new Set();
        const suId = String(su.rec_ID);

        // If this SU is itself a PU
        if (Core.IDX.pu?.[suId]) {
          pus.add(suId);
        }

        // Check pointer fields on the SU
        (su.details || []).forEach(d => {
          const v = d?.value;
          if (v && typeof v === 'object' && v.id && v.type) {
            const toId = String(v.id);
            if (Core.IDX.pu?.[toId]) {
              pus.add(toId);
            }
          }
        });

        // Check relationships for linked PUs
        const rels = [
          ...((Core.REL_INDEX || {}).bySource?.[suId] || []),
          ...((Core.REL_INDEX || {}).byTarget?.[suId] || [])
        ];

        for (const rel of rels) {
          const src = getRes(rel, 'Source record');
          const tgt = getRes(rel, 'Target record');
          const puId = Core.IDX.pu?.[String(src?.id)] ? String(src.id) :
                       Core.IDX.pu?.[String(tgt?.id)] ? String(tgt.id) : null;
          if (puId) pus.add(puId);
        }

        return Array.from(pus);
      }

/* ============================================================
   COLOPHON ANALYSIS MODULE
   ============================================================ */

let ACTIVE_COLOPHON_TAB = 'overview';
let COLOPHON_TABS_INITIALIZED = false;
const COLOPHON_TAB_ALIASES = {
  sentiment: 'overview',
  themes: 'overview',
  linguistic: 'overview',
  'content-expression': 'overview',
  patterns: 'contexts',
  'explore-formulae': 'formulae',
  'browse-colophons': 'browse'
};

function normalizeColophonTab(tab) {
  return COLOPHON_TAB_ALIASES[tab] || tab || 'overview';
}

// Colophon Analysis Main Entry Point
function buildColophonAnalysis() {
  const mount = document.getElementById('colophon-mount');
  if (!mount) return;
  
  // Set up tab navigation once; visual state comes from the shared tab styles.
  if (!COLOPHON_TABS_INITIALIZED) {
    const tabList = document.querySelector('.colophon-tabs');
    Core.enhanceExploreTabList(tabList, mount);

    document.querySelectorAll('.colophon-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = normalizeColophonTab(btn.dataset.tab);
        ACTIVE_COLOPHON_TAB = tab;

        document.querySelectorAll('.colophon-tab-btn').forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('is-on', isActive);
        });
        Core.syncExploreTabList(tabList, btn, mount);
        Core.updateExploreUrl('colophon-analysis', tab);

        renderColophonTab(tab, mount);
      });
    });
    COLOPHON_TABS_INITIALIZED = true;
  }
  
  // Restore the current view when returning to the module.
  renderColophonTab(ACTIVE_COLOPHON_TAB, mount);
}

function renderColophonTab(tab, mount) {
  const normalizedTab = normalizeColophonTab(tab);
  ACTIVE_COLOPHON_TAB = normalizedTab;
  switch(normalizedTab) {
    case 'overview': buildColophonOverview(mount); break;
    case 'browse': buildBrowseColophons(mount); break;
    case 'formulae': buildExploreFormulae(mount); break;
    case 'contexts': buildComparativePatterns(mount); break;
    default: buildColophonOverview(mount); break;
  }
}

// Helper: Extract colophon text from SU record
function getColophonText(su) {
  // Get both transcription (original language) and translation (English)
  const transcription = getVal(su, 'Colophon transcription') || '';
  const translation = getVal(su, 'Colophon translation') || '';
  
  return {
    transcription: transcription.trim(),
    translation: translation.trim(),
    hasTranscription: transcription.trim().length > 0,
    hasTranslation: translation.trim().length > 0
  };
}

// Helper: Check if SU has a colophon
function hasColophon(su) {
  const presence = getVal(su, 'Colophon presence');
  // The val() function returns termLabel for enum fields, which is "TRUE" or "FALSE"
  return presence && presence.toUpperCase() === 'TRUE';
}

function hasReadableColophon(su) {
  if (!hasColophon(su)) return false;
  const text = getColophonText(su);
  return text.hasTranscription || text.hasTranslation;
}

function getColophonContext(su) {
  const productionUnits = getPUsForSU(su).map(id => Core.IDX.pu?.[String(id)]).filter(Boolean);
  const countries = new Set();
  const cities = new Set();
  const institutions = new Set();

  productionUnits.forEach(pu => {
    const puCountries = getControlledValsAll(pu, 'PU country');
    const fallbackCountries = getControlledValsAll(pu, 'Country');
    (puCountries.length ? puCountries : fallbackCountries).forEach(country => countries.add(country));
    const puCities = getControlledValsAll(pu, 'PU City');
    const fallbackCities = getControlledValsAll(pu, 'City');
    (puCities.length ? puCities : fallbackCities).forEach(city => cities.add(city));

    const miRes = getRes(pu, 'Monastic Institution');
    const mi = miRes?.id ? Core.IDX.mi?.[String(miRes.id)] : null;
    const institution = mi ? (Core.MAP.mi?.title(mi) || mi.rec_Title) : '';
    if (isKnownCategory(institution)) institutions.add(institution);
  });

  const centuries = getControlledValsAll(su, 'Normalized century of production');

  return {
    productionUnits,
    countries: Array.from(countries),
    cities: Array.from(cities),
    institutions: Array.from(institutions),
    centuries,
    century: centuries[0] || '',
    dating: isKnownCategory(getVal(su, 'SU dating')) ? getVal(su, 'SU dating') : '',
    manuscript: isKnownCategory(getVal(su, 'Manuscript')) ? getVal(su, 'Manuscript') : ''
  };
}

function getColophonInstances(su) {
  const fieldValues = field => getDetailsAll(su, field).map(detail => String(val(detail) || '').trim());
  const transcriptions = fieldValues('Colophon transcription');
  const translations = fieldValues('Colophon translation');
  const languages = fieldValues('Colophon language');
  const comments = fieldValues('Colophon comments');
  const instanceCount = Math.max(transcriptions.length, translations.length);
  if (instanceCount === 0) return [];

  const context = getColophonContext(su);
  return Array.from({ length: instanceCount }, (_, index) => {
    const transcription = transcriptions[index] || '';
    const translation = translations[index] || '';
    const language = languages[index] || (languages.length === 1 ? languages[0] : '');
    const comment = comments[index] || (comments.length === 1 ? comments[0] : '');
    return {
      id: `${su.rec_ID}-colophon-${index + 1}`,
      ordinal: index + 1,
      su,
      transcription,
      translation,
      language: isKnownCategory(language) ? language : '',
      comment,
      context,
      hasTranscription: Boolean(transcription),
      hasTranslation: Boolean(translation)
    };
  }).filter(instance => instance.hasTranscription || instance.hasTranslation);
}

function getAllColophonInstances() {
  return (Core.DATA.su || []).flatMap(getColophonInstances);
}

function buildColophonOverview(mount) {
  const allSUs = Core.DATA.su || [];
  const flaggedSUs = allSUs.filter(hasColophon);
  const instances = getAllColophonInstances();
  const readableSUs = flaggedSUs.filter(su => getColophonInstances(su).length > 0);
  const transcriptionSUs = flaggedSUs.filter(su => getDetailsAll(su, 'Colophon transcription').some(d => String(val(d) || '').trim()));
  const translationSUs = flaggedSUs.filter(su => getDetailsAll(su, 'Colophon translation').some(d => String(val(d) || '').trim()));
  const multipleSUs = flaggedSUs.filter(su => getColophonInstances(su).length > 1);
  const flagOnlySUs = flaggedSUs.filter(su => getColophonInstances(su).length === 0);
  const transcriptionInstances = instances.filter(instance => instance.hasTranscription).length;
  const translationInstances = instances.filter(instance => instance.hasTranslation).length;
  const bothInstances = instances.filter(instance => instance.hasTranscription && instance.hasTranslation).length;

  const languageCounts = {};
  instances.forEach(instance => {
    if (instance.language) languageCounts[instance.language] = (languageCounts[instance.language] || 0) + 1;
  });
  const knownLanguageTotal = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);
  const languages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);
  const coverageRows = [
    ['Readable text', readableSUs.length, '#d4af37'],
    ['At least one transcription', transcriptionSUs.length, '#10b981'],
    ['At least one translation', translationSUs.length, '#3b82f6']
  ];

  mount.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 0.75rem; color: #1a1a1a;">Colophon Corpus: Overview &amp; Method</h2>
      <div class="explore-metric-grid" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; margin-bottom:2rem;">
        <div class="explore-metric-card"><div style="font-size:2rem;font-weight:700;">${flaggedSUs.length}</div><div>Scribal units flagged with colophons</div></div>
        <div class="explore-metric-card"><div style="font-size:2rem;font-weight:700;">${instances.length}</div><div>Readable colophon instances</div></div>
        <div class="explore-metric-card"><div style="font-size:2rem;font-weight:700;">${multipleSUs.length}</div><div>Scribal units with multiple instances</div></div>
        <div class="explore-metric-card"><div style="font-size:2rem;font-weight:700;">${flagOnlySUs.length}</div><div>Flagged units without readable text</div></div>
      </div>

      <div id="colophon-coverage-chart" class="explore-visualization-card" style="margin-bottom:2rem;">
        <div class="explore-viz-card-header"><h3 style="margin:0;">Text availability in flagged scribal units</h3>${createExportButton('colophon-coverage-chart', 'colophon-corpus-coverage.png')}</div>
        <p style="color:#666;font-size:.875rem;">Bars use ${flaggedSUs.length} flagged scribal units as the denominator.</p>
        ${coverageRows.map(([label, count, color]) => {
          const percentage = flaggedSUs.length ? count / flaggedSUs.length * 100 : 0;
          return `<div style="margin:.9rem 0;"><div style="display:flex;justify-content:space-between;gap:1rem;margin-bottom:.3rem;"><strong>${label}</strong><span>${count}/${flaggedSUs.length} · ${percentage.toFixed(1)}%</span></div><div style="height:1.4rem;background:#eef0f2;border-radius:.3rem;overflow:hidden;"><div style="height:100%;width:${percentage}%;background:${color};"></div></div></div>`;
        }).join('')}
      </div>

      <div id="colophon-instance-availability" class="explore-visualization-card" style="margin-bottom:2rem;">
        <div class="explore-viz-card-header"><h3 style="margin:0;">Readable instance coverage</h3>${createExportButton('colophon-instance-availability', 'colophon-instance-coverage.png')}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;text-align:center;">
          <div><strong style="font-size:1.7rem;">${transcriptionInstances}</strong><div>with transcription</div></div>
          <div><strong style="font-size:1.7rem;">${translationInstances}</strong><div>with translation</div></div>
          <div><strong style="font-size:1.7rem;">${bothInstances}</strong><div>with both</div></div>
          <div><strong style="font-size:1.7rem;">${instances.length - knownLanguageTotal}</strong><div>without known language</div></div>
        </div>
      </div>

      <div id="colophon-language-coverage" class="explore-visualization-card" style="margin-bottom:2rem;">
        <div class="explore-viz-card-header"><h3 style="margin:0;">Readable instances by known language</h3>${createExportButton('colophon-language-coverage', 'colophon-language-coverage.png')}</div>
        <p style="color:#666;font-size:.875rem;">Shares use ${knownLanguageTotal} instances with a known language; unknown and provisional labels are excluded.</p>
        ${languages.map(([language, count]) => {
          const percentage = knownLanguageTotal ? count / knownLanguageTotal * 100 : 0;
          return `<div style="margin:.75rem 0;"><div style="display:flex;justify-content:space-between;gap:1rem;margin-bottom:.25rem;"><strong>${esc(language)}</strong><span>${count} · ${percentage.toFixed(1)}%</span></div><div style="height:1.25rem;background:#eef0f2;border-radius:.3rem;overflow:hidden;"><div style="height:100%;width:${percentage}%;background:#d4af37;"></div></div></div>`;
        }).join('')}
      </div>

      <div class="editorial-note">
        <h3 style="margin:0 0 .75rem;color:#333;font-size:1rem;">Unit of analysis and exclusions</h3>
        <ul style="margin:0;padding-left:1.25rem;">
          <li>The canonical source is the <strong>scribal-unit record</strong>; linked production-unit fields provide geographic and institutional context only.</li>
          <li>Repeated transcription and translation fields are represented as separate numbered <strong>colophon instances</strong>. A single language or comment value is applied to all instances in that scribal unit.</li>
          <li>Flagged units without readable text are included in coverage statistics but excluded from Browse &amp; Read and text-based formula matching.</li>
          <li>Unknown and TBC values are excluded from categorical visualizations. Every rate states its numerator and denominator.</li>
          <li>Translation-dependent linguistic, punctuation, sentiment, and rhetorical measurements are not used.</li>
        </ul>
      </div>
    </div>`;
}

function buildComparativePatterns(mount) {
  const allSUs = Core.DATA.su || [];
  const instances = getAllColophonInstances();

  const byCentury = {};
  allSUs.forEach(su => {
    getControlledValsAll(su, 'Normalized century of production').forEach(century => {
      if (!byCentury[century]) byCentury[century] = { total: 0, flagged: 0 };
      byCentury[century].total++;
      if (hasColophon(su)) byCentury[century].flagged++;
    });
  });
  const centuries = Object.entries(byCentury).sort((a, b) => (parseInt(a[0]) || 0) - (parseInt(b[0]) || 0));

  const byCountry = {};
  allSUs.forEach(su => {
    const countries = new Set(getColophonContext(su).countries);
    countries.forEach(country => {
      if (!byCountry[country]) byCountry[country] = { total: 0, flagged: 0 };
      byCountry[country].total++;
      if (hasColophon(su)) byCountry[country].flagged++;
    });
  });
  const countries = Object.entries(byCountry)
    .filter(([, data]) => data.total > 0)
    .sort((a, b) => b[1].flagged - a[1].flagged || b[1].total - a[1].total)
    .slice(0, 12);

  const languageTotals = {};
  const languageByCentury = {};
  instances.forEach(instance => {
    const { language } = instance;
    const centuries = instance.context.centuries;
    if (!language || !centuries.length) return;
    languageTotals[language] = (languageTotals[language] || 0) + 1;
    centuries.forEach(century => {
      if (!languageByCentury[century]) languageByCentury[century] = {};
      languageByCentury[century][language] = (languageByCentury[century][language] || 0) + 1;
    });
  });
  const leadingLanguages = Object.entries(languageTotals).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([language]) => language);

  const prevalenceRows = (entries, labelFormatter = value => value) => entries.map(([label, data]) => {
    const percentage = data.total ? data.flagged / data.total * 100 : 0;
    return `<div style="margin:.8rem 0;"><div style="display:flex;justify-content:space-between;gap:1rem;align-items:baseline;margin-bottom:.25rem;"><strong>${esc(labelFormatter(label))}</strong><span>${data.flagged}/${data.total} scribal units · ${percentage.toFixed(1)}%</span></div><div style="height:1.35rem;background:#eef0f2;border-radius:.15rem;overflow:hidden;"><div style="height:100%;width:${percentage}%;background:#b88912;"></div></div></div>`;
  }).join('');

  mount.innerHTML = `
    <div style="max-width:1200px;margin:0 auto;">
      <h2 style="margin-bottom:.75rem;color:#1a1a1a;">Structured Contexts</h2>
      <div class="editorial-note"><strong>Denominators:</strong> prevalence charts compare scribal units flagged with colophons against all scribal units with the same known context. Language composition uses readable colophon instances with both a known language and century. Scribal units linked to more than one country are counted once in each relevant country.</div>

      <div id="colophon-century-context" class="explore-visualization-card" style="margin-bottom:2rem;">
        <div class="explore-viz-card-header"><h3 style="margin:0;">Colophon prevalence by century</h3>${createExportButton('colophon-century-context', 'colophon-prevalence-by-century.png')}</div>
        ${prevalenceRows(centuries, century => `${century}th century`)}
      </div>

      <div id="colophon-country-context" class="explore-visualization-card" style="margin-bottom:2rem;">
        <div class="explore-viz-card-header"><h3 style="margin:0;">Colophon prevalence by production country</h3>${createExportButton('colophon-country-context', 'colophon-prevalence-by-country.png')}</div>
        <p style="color:#666;font-size:.875rem;">The twelve countries with the most flagged scribal units are shown.</p>
        ${prevalenceRows(countries)}
      </div>

      <div id="colophon-language-century-context" class="explore-visualization-card">
        <div class="explore-viz-card-header"><h3 style="margin:0;">Language composition by century</h3>${createExportButton('colophon-language-century-context', 'colophon-language-by-century.png')}</div>
        <p style="color:#666;font-size:.875rem;">Counts and row percentages are shown for the six most frequent known colophon languages. Percentages use all known-language instances in that century, including languages outside the six displayed columns.</p>
        <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:.875rem;">
          <thead><tr style="border-bottom:2px solid #ddd;"><th style="padding:.7rem;text-align:left;">Century</th><th style="padding:.7rem;text-align:center;">Known-language n</th>${leadingLanguages.map(language => `<th style="padding:.7rem;text-align:center;">${esc(language)}</th>`).join('')}</tr></thead>
          <tbody>${centuries.map(([century]) => {
            const counts = languageByCentury[century] || {};
            const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
            if (!total) return '';
            return `<tr style="border-bottom:1px solid #eee;"><th style="padding:.7rem;text-align:left;">${esc(century)}th</th><td style="padding:.7rem;text-align:center;">${total}</td>${leadingLanguages.map(language => { const count = counts[language] || 0; const percentage = count / total * 100; return `<td style="padding:.7rem;text-align:center;">${count}<br><small>${percentage.toFixed(1)}%</small></td>`; }).join('')}</tr>`;
          }).join('')}</tbody>
        </table></div>
      </div>
    </div>`;
}

// 6. FORMULAE TAB
async function buildExploreFormulae(mount) {
  mount.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">Loading formula data...</div>';
  
  // Get all SUs with colophons for matching
  const allSUs = Core.DATA.su || [];
  const colophonSUs = allSUs.filter(su => {
    const transcription = getVal(su, 'Colophon transcription') || '';
    return transcription.trim().length > 0;
  });
  
  // PREDEFINED FORMULAS TO SEARCH FOR
  const predefinedFormulas = [
    // Dutch
    { formula: 'int jaer ons heren', language: 'Dutch', variants: ['int jaer', 'int iaer', 'intjaer', 'iaer ons', 'jaer ons', 'volscreven int jaer', 'int jaer ons heeren', 'int jaer ons heren'] },
    { formula: 'bidt om gods wil', language: 'Dutch', variants: ['bidt om gods', 'om gods wil', 'bidt om'] },
    { formula: 'dit boeck hoert', language: 'Dutch', variants: ['dit boeck', 'boeck hoert', 'dit boek hoert'] },
    
    // Latin
    { formula: 'Qui scripsit scribat semper cum Domino uiuat', language: 'Latin', variants: ['qui scripsit', 'scribat semper', 'cum domino uiuat', 'semper cum domino'] },
    { formula: 'Explicit expliceat ludere scriptrix eat', language: 'Latin', variants: ['explicit expliceat', 'ludere scriptrix', 'expliceat ludere', 'scriptor eat', 'scriptrix eat'] },
    { formula: 'anno domini', language: 'Latin', variants: ['anno domini', 'ano domini'] },
    { formula: 'Finito libro sit laus et gloria Christo', language: 'Latin', variants: ['finito libro', 'laus et gloria', 'gloria christo', 'sit laus'] },
    { formula: 'Finis adest operis merce dem poseo laboris', language: 'Latin', variants: ['finis adest', 'adest operis', 'poseo laboris', 'merce dem'] },
    { formula: 'Detur pro penna scriptori pulchra puella', language: 'Latin', variants: ['detur pro penna', 'scriptori pulchra', 'pulchra puella'] },
    { formula: 'Finitus et completus', language: 'Latin', variants: ['finitus et completus', 'finitus completus'] },
    { formula: 'Feliciter', language: 'Latin', variants: ['feliciter'] },
    { formula: 'Oretis pro scriptore propter Deum', language: 'Latin', variants: ['oretis pro', 'pro scriptore', 'propter deum'] },
    { formula: 'Transcriptus', language: 'Latin', variants: ['transcriptus', 'transcripta'] },
    { formula: 'cuius animae propitietur Deus', language: 'Latin', variants: ['cuius animae', 'propitietur deus', 'animae propitietur'] },
    { formula: 'Nomen scriptoris plenus amoris', language: 'Latin', variants: ['nomen scriptoris', 'plenus amoris', 'scriptoris plenus'] },
    { formula: 'Que/qui me scribebat nomen habebat', language: 'Latin', variants: ['qui me scribebat', 'que me scribebat', 'nomen habebat', 'scribebat nomen'] },
    { formula: 'Finitus est iste liber per me soror', language: 'Latin', variants: ['finitus est iste', 'iste liber', 'per me soror', 'liber per me'] },
    { formula: 'Iste liber scripsit', language: 'Latin', variants: ['iste liber', 'liber scripsit'] },
    
    // Italian
    { formula: 'libro è delle monache', language: 'Italian', variants: ['libro è delle', 'delle monache', 'monache del', 'questo libro è'] },
    { formula: 'finito', language: 'Italian', variants: ['finito', 'finita'] },
    { formula: 'finisce', language: 'Italian', variants: ['finisce', 'finisce il'] },
    { formula: 'indegniamente', language: 'Italian', variants: ['indegniamente', 'indegna'] },
    { formula: 'peccatrice', language: 'Italian', variants: ['peccatrice', 'peccatrix'] },
    { formula: 'A llaude et onore', language: 'Italian', variants: ['llaude et', 'laude et', 'onore', 'et onore'] },
    
    // French
    { formula: 'Pries Nostre Seigneur', language: 'French', variants: ['pries nostre', 'nostre seigneur', 'priés', 'prié'] },
    { formula: 'pour ses soeurs', language: 'French', variants: ['pour ses', 'ses soeurs', 'pour soeurs'] },
    
    // Portuguese
    { formula: 'Acabousse', language: 'Portuguese', variants: ['acabousse', 'acabou-se', 'acabosse'] },
    { formula: 'Screveo freira', language: 'Portuguese', variants: ['screveo', 'freira', 'screveo freira'] },
    
    // Swedish
    { formula: 'conuentz syster', language: 'Swedish', variants: ['conuentz', 'syster', 'conuentz syster'] },
    { formula: 'owärdoghe', language: 'Swedish', variants: ['owärdoghe', 'owärdogher', 'ovärdoghe'] },
    { formula: 'bidhin kära systra', language: 'Swedish', variants: ['bidhin', 'kära', 'systra', 'bidh', 'kära systra'] },
    
    // German
    { formula: 'pitt got für', language: 'German', variants: ['pitt got', 'got für', 'pit got'] },
    { formula: 'Bidt vor die schrivers', language: 'German', variants: ['bidt vor', 'vor die', 'schrivers', 'schriver'] },
    { formula: 'das puch hat geschriben swester', language: 'German', variants: ['das puch', 'hat geschriben', 'geschriben swester', 'puch hat'] },
    { formula: 'von Schwester', language: 'German', variants: ['von schwester', 'von swester'] },
    { formula: 'die schreiberin die geschriben hat', language: 'German', variants: ['die schreiberin', 'geschriben hat', 'schreiberin die'] },
    { formula: 'do man zalt', language: 'German', variants: ['do man', 'man zalt', 'do man zalt'] },
    { formula: 'als man zalt', language: 'German', variants: ['als man', 'man zalt', 'als man zalt'] },
    { formula: 'vollendet', language: 'German', variants: ['vollendet', 'volendet'] },
    { formula: 'volbracht', language: 'German', variants: ['volbracht', 'volbracht'] },
    { formula: 'geendet', language: 'German', variants: ['geendet', 'geendet'] },
    { formula: 'Lob sye Gott', language: 'German', variants: ['lob sye', 'sye gott', 'lob gott'] },
    { formula: 'zu lob vnd erenn', language: 'German', variants: ['zu lob', 'vnd erenn', 'lob vnd'] }
  ];
  
  // Function to check if text contains any variant (fuzzy match)
  const containsFormula = (text, variants) => {
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
    return variants.some(variant => {
      const normalizedVariant = variant.toLowerCase().replace(/\s+/g, ' ');
      return normalizedText.includes(normalizedVariant);
    });
  };
  
  // Search for each formula in colophon transcriptions
  const formulaResults = predefinedFormulas.map(formulaDef => {
    const matches = [];
    const puIds = new Set();  // Track unique PU IDs
    const countries = new Set();
    
    colophonSUs.forEach(su => {
      const transcription = getVal(su, 'Colophon transcription') || '';
      
      if (containsFormula(transcription, formulaDef.variants)) {
        // Get linked PU for manuscript info
        const rels = getRecordRelationships(su.rec_ID);
        const puRel = rels.find(rel => {
          const relType = getVal(rel, 'Relationship type');
          const tgt = getRes(rel, 'Target record');
          if (!tgt?.id || !tgt?.type) return false;
          const tgtType = (REC_TYPE_TO_ENTITY || {})[String(tgt.type)];
          return relType === 'IsRelatedTo' && tgtType === 'pu';
        });
        
        if (puRel) {
          const tgt = getRes(puRel, 'Target record');
          const pu = Core.IDX.pu[String(tgt.id)];
          
          if (pu) {
            const puId = String(pu.rec_ID);
            const puTitle = getVal(pu, 'Normalized Title') || pu.rec_Title || 'Untitled';
            const country = getVal(pu, 'PU country') || getVal(pu, 'Country') || '';
            const city = getVal(pu, 'PU City') || getVal(pu, 'City') || '';
            const century = getVal(pu, 'Normalized century of production') || '';
            
            puIds.add(puId);  // Count unique PUs
            if (isKnownCategory(country)) countries.add(country);
            
            // Find which variant matched
            const matchedVariant = formulaDef.variants.find(v => 
              transcription.toLowerCase().includes(v.toLowerCase())
            );
            
            matches.push({
              su: su,
              pu: pu,
              puId: puId,
              puTitle: puTitle,
              country: country,
              city: city,
              century: century,
              transcription: transcription,
              translation: getVal(su, 'Colophon translation') || '',
              matchedVariant: matchedVariant || formulaDef.variants[0]
            });
          }
        }
      }
    });
    
    return {
      formula: formulaDef.formula,
      language: formulaDef.language,
      variants: formulaDef.variants,
      count: puIds.size,  // Count unique Production Units
      matches: matches,
      puIds: Array.from(puIds),
      countries: Array.from(countries)
    };
  });
  
  // Organize formulas by language
  const formulasByLanguage = {};
  formulaResults.forEach(f => {
    if (!formulasByLanguage[f.language]) formulasByLanguage[f.language] = [];
    formulasByLanguage[f.language].push(f);
  });
  
  // Organize formulas by country  
  const formulasByCountry = {};
  formulaResults.forEach(f => {
    f.countries.forEach(country => {
      if (!formulasByCountry[country]) formulasByCountry[country] = [];
      if (!formulasByCountry[country].find(existing => existing.formula === f.formula)) {
        formulasByCountry[country].push(f);
      }
    });
  });
  
  // Sort by count descending
  Object.keys(formulasByLanguage).forEach(lang => {
    formulasByLanguage[lang].sort((a, b) => b.count - a.count);
  });
  
  Object.keys(formulasByCountry).forEach(country => {
    formulasByCountry[country].sort((a, b) => b.count - a.count);
  });
  
  // Pagination state
  let currentPage = 1;
  const itemsPerPage = 20;
  let selectedLanguage = '';
  let selectedCountry = '';
  let selectedFormula = '';
  
  const uniqueLanguages = Object.keys(formulasByLanguage).sort();
  const uniqueCountries = Object.keys(formulasByCountry).sort();
  
  // Classify formula type based on keywords
  const classifyFormulaType = (text) => {
    const lower = text.toLowerCase();
    if (lower.match(/\b(pitt|pray|pries|bidt|gedenk|ora|gebet|oretis)\b/)) return 'prayer';
    if (lower.match(/\b(jaer|jahr|anno|year|do man|zalt)\b/)) return 'dating';
    if (lower.match(/\b(geschriben|scri|escrit|script|writ|screveo)\b/)) return 'scribe';
    if (lower.match(/\b(finit|explicit|volscreven|geeyndet|end|complete|vollendet|volbracht|geendet)\b/)) return 'completion';
    if (lower.match(/\b(indegn|pover|unwürdig|arm|humil|peccatrice)\b/)) return 'humility';
    if (lower.match(/\b(hoert|belong|toe|delle|eygen)\b/)) return 'ownership';
    if (lower.match(/\b(laus|lob|gloria|laude|onore)\b/)) return 'praise';
    return 'other';
  };
  
  mount.innerHTML = `
    <div style="max-width: 1400px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="margin-bottom: 0.5rem; color: #1a1a1a;">Formulae</h2>These views use catalogued dates
      </div>
      
      <!-- Statistics Overview -->
      <div class="explore-metric-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        <div class="explore-metric-card">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${formulaResults.length}</div>
          <div style="opacity: 0.9; font-size: 0.875rem;">Predefined Formulas</div>
        </div>
        <div class="explore-metric-card">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${uniqueLanguages.length}</div>
          <div style="opacity: 0.9; font-size: 0.875rem;">Languages</div>
        </div>
        <div class="explore-metric-card">
          <div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem;">${colophonSUs.length}</div>
          <div style="opacity: 0.9; font-size: 0.875rem;">Colophons Searched</div>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="explore-panel-card" style="margin-bottom: 2rem;">
        <h3 style="font-size: 1rem; font-weight: 600; color: #333; margin-bottom: 1rem;">Filter Formulas</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">1a. Select Language</label>
            <select id="formula-filter-language" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Languages (${formulaResults.length} formulas)</option>
              ${uniqueLanguages.map(lang => 
                `<option value="${esc(lang)}">${esc(lang)} (${formulasByLanguage[lang].length} formulas)</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">1b. OR Select Country</label>
            <select id="formula-filter-country" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Countries</option>
              ${uniqueCountries.map(country => 
                `<option value="${esc(country)}">${esc(country)} (${formulasByCountry[country].length} formulas)</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">2. Select Specific Formula (optional)</label>
            <select id="formula-filter-specific" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">First select a language or country...</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #333; margin-bottom: 0.5rem;">3. Filter by Type</label>
            <select id="formula-filter-type" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 0.25rem; font-size: 0.875rem;">
              <option value="">All Types</option>
              <option value="prayer">Prayer</option>
              <option value="dating">Dating</option>
              <option value="scribe">Scribe</option>
              <option value="completion">Completion</option>
              <option value="humility">Humility</option>
              <option value="ownership">Ownership</option>
              <option value="praise">Praise</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- Global Formula Map (Collapsible) -->
      <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 2rem; overflow: hidden;">
        <button id="toggle-global-map" style="width:100%;padding:1rem;background:#f7f7f5;border:0;border-bottom:1px solid #e4e1db;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-weight:600;color:#374151;">
          <span>Global Formula Distribution Map</span>
          <span id="map-toggle-icon" style="font-size: 1.25rem;">▼</span>
        </button>
        <div id="global-map-content" style="display: none; padding: 1.5rem; border-top: 1px solid #e5e7eb;">
          <p style="color: #666; font-size: 0.875rem; margin-bottom: 1rem;">
            Interactive map showing the geographic and temporal distribution of all formulas across the corpus.
          </p>
          
          <!-- Map Filter Controls -->
          <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; margin-bottom: 1rem;">
            <div style="position: relative;">
              <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                Search Formulas
              </label>
              <input type="text" id="formula-search-box" placeholder="Search formulas on map..." list="formula-suggestions"
                     style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
              <datalist id="formula-suggestions"></datalist>
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
                Filter by Language
              </label>
              <select id="language-filter" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 0.875rem;">
                <option value="">All Languages</option>
              </select>
            </div>
            <div style="display: flex; align-items: flex-end; gap: 0.5rem;">
              <button id="export-csv-btn" class="explore-action-btn">
                Export CSV
              </button>
              <button id="export-png-btn" class="explore-export-btn">
                Export PNG
              </button>
            </div>
          </div>
          
          <!-- Advanced Controls -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
            <button id="toggle-heatmap" style="padding: 0.5rem 1rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              Heat Map
            </button>
            <button id="toggle-comparison" style="padding: 0.5rem 1rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              Compare Formulas
            </button>
            <button id="toggle-network" style="padding: 0.5rem 1rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              Network View
            </button>
            <div style="flex: 1; min-width: 200px; display: flex; align-items: center; gap: 0.5rem;">
              <button id="play-timeline" style="padding: 0.5rem; background: white; color: #374151; border: 2px solid #d1d5db; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                Play
              </button>
              <span id="timeline-status" style="font-size: 0.75rem; color: #6b7280;">Timeline Animation</span>
            </div>
          </div>
          
          <!-- Comparison Mode Info -->
          <div id="comparison-info" class="editorial-note" style="display:none;">
            <strong>Comparison Mode Active:</strong> <span id="comparison-count">0</span> formulas selected.
            <span style="color: #92400e;">Click on formulas in the map popups below to add them to comparison (max 6).</span>
            <button id="clear-comparison" style="margin-left: 1rem; padding: 0.25rem 0.5rem; background: #d97706; color: white; border: none; border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer;">
              Clear All
            </button>
          </div>
          
          <div id="global-map-container" style="height: 500px; background: #f9fafb; border-radius: 0.5rem; position: relative;">
            <div id="global-map-placeholder" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #9ca3af;">
              <div>Click to load map visualization...</div>
            </div>
          </div>
          <div style="margin-top: 1rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
              Filter by Century
            </label>
            <input type="range" id="century-slider" min="0" max="100" value="0" step="1" 
                   style="width:100%;height:8px;border-radius:2px;background:#b88912;outline:none;-webkit-appearance:none;">
            <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
              <span id="century-label-start" style="font-size: 0.75rem; color: #6b7280;">All Centuries</span>
              <span id="century-label-end" style="font-size: 0.75rem; color: #6b7280;"></span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination Top -->
      <div id="formula-pagination-top" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;"></div>
      
      <div id="formula-count-top" style="color: #666; margin-bottom: 1.5rem; text-align: center;"></div>
      
      <!-- Formula List -->
      <div id="formula-list" style="display: flex; flex-direction: column; gap: 1.5rem;"></div>
      
      <!-- Pagination Bottom -->
      <div id="formula-pagination-bottom" style="display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem;"></div>
      
      <div id="formula-count-bottom" style="text-align: center; margin-top: 1.5rem; padding: 1.5rem; background: #f9f9f9; border-radius: 0.5rem; color: #666;"></div>
    </div>
  `;
  
  // Update specific formula dropdown based on language or country selection
  const updateFormulaDropdown = () => {
    const languageSelect = document.getElementById('formula-filter-language');
    const countrySelect = document.getElementById('formula-filter-country');
    const formulaSelect = document.getElementById('formula-filter-specific');
    
    const lang = languageSelect.value;
    const country = countrySelect.value;
    
    let formulas = [];
    if (lang) formulas = formulasByLanguage[lang] || [];
    else if (country) formulas = formulasByCountry[country] || [];
    else formulas = formulaResults;
    
    const filterLabel = lang ? lang : country || 'all';
    formulaSelect.innerHTML = `
      <option value="">All ${filterLabel} formulas (${formulas.length})</option>
      ${formulas.map(f => 
        `<option value="${esc(f.formula)}">${esc(f.formula.substring(0, 60))}${f.formula.length > 60 ? '...' : ''} (${f.count})</option>`
      ).join('')}
    `;
    selectedFormula = '';
  };
  
  // Render formulas with pagination
  const renderFormulas = (formulas, page) => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageFormulas = formulas.slice(startIdx, endIdx);
    const totalPages = Math.ceil(formulas.length / itemsPerPage);
    
    const listDiv = document.getElementById('formula-list');
    
    if (pageFormulas.length === 0) {
      listDiv.innerHTML = '<div style="text-align: center; padding: 3rem; color: #666; background: white; border-radius: 0.5rem;">No formulas match your filters.</div>';
      document.getElementById('formula-count-top').textContent = 'No formulas found';
      document.getElementById('formula-count-bottom').textContent = 'No formulas found.';
      document.getElementById('formula-pagination-top').innerHTML = '';
      document.getElementById('formula-pagination-bottom').innerHTML = '';
      return;
    }
    
    listDiv.innerHTML = pageFormulas.map((formula, idx) => {
      const cardId = 'formula-card-' + (startIdx + idx);
      const type = classifyFormulaType(formula.formula);
      const count = formula.count || 0;
      
      // Type badge colors
      const typeBadgeStyles = {
        prayer: 'background: #10b981; color: white;',
        dating: 'background: #3b82f6; color: white;',
        scribe: 'background: #fb923c; color: white;',
        completion: 'background: #eab308; color: white;',
        humility: 'background: #f59e0b; color: white;',
        ownership: 'background: #ef4444; color: white;',
        praise: 'background: #06b6d4; color: white;',
        other: 'background: #6b7280; color: white;'
      };
      
      const typeBadgeStyle = typeBadgeStyles[type] || typeBadgeStyles.other;
      const hasMatches = count > 0;
      
      let html = '<div id="' + cardId + '" class="explore-panel-card">';
      html += '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">';
      html += '<div style="flex: 1;">';
      html += '<div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">';
      html += '<span style="' + typeBadgeStyle + ' padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">' + esc(type) + '</span>';
      html += '<span style="background: #e5e7eb; color: #374151; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">' + esc(formula.language) + '</span>';
      html += '</div>';
      html += '<div style="font-size: 1.125rem; font-weight: 600; color: #1f2937; font-style: italic; margin-bottom: 0.5rem;">"' + esc(formula.formula) + '"</div>';
      if (formula.variants.length > 1) {
        html += '<div style="font-size: 0.875rem; color: #6b7280;">Variants: ' + formula.variants.map(v => esc(v)).join(', ') + '</div>';
      }
      html += '</div>';
      html += '<div style="text-align: right;">';
      html += '<div style="font-size: 2rem; font-weight: 700; color: ' + (hasMatches ? '#d4af37' : '#9ca3af') + ';">' + count + '</div>';
      html += '<div style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase;">Production Unit' + (count !== 1 ? 's' : '') + '</div>';
      html += '</div>';
      html += '</div>';
      
      // Show countries if any
      if (formula.countries.length > 0) {
        html += '<div style="margin-top: 0.75rem; font-size: 0.875rem; color: #6b7280;">';
        html += '<strong>Countries:</strong> ' + formula.countries.join(', ');
        html += '</div>';
      }
      
      // Show match details if selected
      const isSpecificFormulaView = selectedFormula && formulas.length === 1;
      if (isSpecificFormulaView && formula.matches.length > 0) {
        html += '<div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb;">';
        html += '<h4 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">Found in ' + formula.matches.length + ' Colophon' + (formula.matches.length !== 1 ? 's' : '') + ' across ' + formula.count + ' Production Unit' + (formula.count !== 1 ? 's' : '') + ':</h4>';
        
        formula.matches.forEach((match, matchIdx) => {
          // Highlight the matched variant in the transcription
          let displayTranscription = match.transcription;
          const variantToHighlight = match.matchedVariant;
          if (variantToHighlight) {
            const regex = new RegExp('(' + variantToHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            displayTranscription = displayTranscription.replace(regex, '<mark style="background: #fef08a; padding: 0.125rem 0.25rem; border-radius: 0.125rem; font-weight: 600;">$1</mark>');
          }
          
          html += '<div style="background: #f9fafb; padding: 1rem; border-radius: 0.25rem; margin-bottom: 0.75rem; border-left: 3px solid #d4af37;">';
          html += '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">';
          html += '<div style="font-weight: 600; color: #1f2937;">';
          html += '<a href="#" onclick="event.preventDefault(); jumpTo(\'pu\', \'' + match.puId + '\');" style="color: #d4af37; text-decoration: none;">';
          html += esc(match.puTitle);
          html += '</a>';
          html += '</div>';
          html += '<div style="display: flex; gap: 0.5rem;">';
          html += '<span style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">' + esc(match.country) + '</span>';
          if (match.century) {
            html += '<span style="background: #fffbeb; color: #78350f; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600;">' + esc(match.century) + '</span>';
          }
          html += '</div>';
          html += '</div>';
          
          // Full transcription with highlighting
          html += '<div style="margin-bottom: 0.75rem;">';
          html += '<div style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem;">Transcription:</div>';
          html += '<div style="font-size: 0.875rem; color: #4b5563; font-style: italic; line-height: 1.6;">' + displayTranscription + '</div>';
          html += '</div>';
          
          // Translation if available
          if (match.translation) {
            html += '<div>';
            html += '<div style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.25rem;">Translation:</div>';
            html += '<div style="font-size: 0.875rem; color: #6b7280; line-height: 1.6;">' + esc(match.translation) + '</div>';
            html += '</div>';
          }
          
          html += '</div>';
        });
        
        html += '</div>';
        
        // Collect statistics
        const countryStats = {};
        const centuryStats = {};
        const monasticInstitutions = new Set();
        
        formula.matches.forEach(match => {
          // Count countries
          countryStats[match.country] = (countryStats[match.country] || 0) + 1;
          
          // Count centuries
          if (match.century) {
            centuryStats[match.century] = (centuryStats[match.century] || 0) + 1;
          }
          
          // Extract monastic institutions from PU records using proper getRes
          if (match.pu) {
            const miRes = getRes(match.pu, 'Monastic Institution');
            if (miRes && miRes.title) {
              monasticInstitutions.add(miRes.title);
            }
          }
        });
        
        const sortedCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]);
        const sortedCenturies = Object.entries(centuryStats).sort((a, b) => a[0].localeCompare(b[0]));
        
        // Threshold-based adaptive visualization: simple cards for 5 or fewer matches, full charts for 6+
        const matchCount = formula.matches.length;
        
        if (matchCount <= 5) {
          // Simple summary cards for small datasets
          html += '<div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">';
          html += '<h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 1.5rem;">Summary</h4>';
          html += '<div class="explore-metric-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">';
          
          // Countries card
          html += '<div class="explore-metric-card">';
          html += '<div style="font-size: 0.875rem; font-weight: 600; opacity: 0.9; margin-bottom: 0.75rem;">Countries</div>';
          html += '<div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">' + sortedCountries.length + '</div>';
          html += '<div style="font-size: 0.875rem; opacity: 0.9;">';
          html += sortedCountries.map(([country, count]) => country + ' (' + count + ')').join(', ');
          html += '</div>';
          html += '</div>';
          
          // Centuries card
          if (sortedCenturies.length > 0) {
            html += '<div class="explore-metric-card">';
            html += '<div style="font-size: 0.875rem; font-weight: 600; opacity: 0.9; margin-bottom: 0.75rem;">Centuries</div>';
            html += '<div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">' + sortedCenturies.length + '</div>';
            html += '<div style="font-size: 0.875rem; opacity: 0.9;">';
            html += sortedCenturies.map(([century, count]) => century + ' (' + count + ')').join(', ');
            html += '</div>';
            html += '</div>';
          }
          
          // Monastic Institutions card
          if (monasticInstitutions.size > 0) {
            html += '<div class="explore-metric-card">';
            html += '<div style="font-size: 0.875rem; font-weight: 600; opacity: 0.9; margin-bottom: 0.75rem;">Monasteries</div>';
            html += '<div style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">' + monasticInstitutions.size + '</div>';
            html += '<div style="font-size: 0.75rem; opacity: 0.9; line-height: 1.4;">';
            const institutionArray = Array.from(monasticInstitutions);
            html += institutionArray.join(', ');
            html += '</div>';
            html += '</div>';
          }
          
          html += '</div>';
          html += '</div>';
        } else {
          // Detailed visualizations for larger datasets (6+ matches)
          const formulaChartKey = startIdx + idx;
          const geographyChartId = 'formula-geography-chart-' + formulaChartKey;
          const temporalChartId = 'formula-temporal-chart-' + formulaChartKey;
          html += '<div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">';
          html += '<h4 style="font-size: 1rem; font-weight: 600; color: #374151; margin-bottom: 1.5rem;">Detailed Statistics</h4>';
          
          // Geographic Distribution Chart (full width)
          html += '<div id="' + geographyChartId + '" class="explore-visualization-card" style="margin-bottom: 2rem;">';
          html += '<div class="explore-viz-card-header" style="margin-bottom: 1rem;">';
          html += '<div style="font-weight: 600; color: #374151;">Geographic Distribution</div>';
          html += createExportButton(geographyChartId, 'formula-geographic-distribution-' + formulaChartKey + '.png');
          html += '</div>';
          sortedCountries.forEach(([country, count]) => {
            const percentage = (count / matchCount * 100).toFixed(1);
            html += '<div style="margin-bottom: 0.75rem;">';
            html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">';
            html += '<span style="font-size: 0.875rem; color: #374151;">' + esc(country) + '</span>';
            html += '<span style="font-size: 0.75rem; color: #6b7280; font-weight: 600;">' + count + ' (' + percentage + '%)</span>';
            html += '</div>';
            html += '<div style="background: #e5e7eb; border-radius: 0.25rem; height: 1.5rem; overflow: hidden;">';
            html += '<div style="background:#b88912;height:100%;width:' + percentage + '%;transition:width 0.3s ease;"></div>';
            html += '</div>';
            html += '</div>';
          });
          html += '</div>';
          
          // Grid for temporal and institutions
          html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">';
          
          // Temporal Distribution Chart
          if (sortedCenturies.length > 0) {
            html += '<div id="' + temporalChartId + '" class="explore-visualization-card">';
            html += '<div class="explore-viz-card-header" style="margin-bottom: 1rem;">';
            html += '<div style="font-weight: 600; color: #374151;">Temporal Distribution</div>';
            html += createExportButton(temporalChartId, 'formula-temporal-distribution-' + formulaChartKey + '.png');
            html += '</div>';
            html += '<div style="display: flex; align-items: flex-end; justify-content: space-around; gap: 0.5rem; height: 150px; padding: 0.5rem; background: #f9fafb; border-radius: 0.5rem;">';
            sortedCenturies.forEach(([century, count]) => {
              const percentage = (count / matchCount * 100).toFixed(0);
              const barHeightPx = (count / matchCount * 120);
              html += '<div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 0.25rem;">';
              html += '<div style="font-size: 0.625rem; color: #6b7280; font-weight: 600;">' + count + '</div>';
              html += '<div style="background:#b88912;width:100%;max-width:40px;height:' + barHeightPx + 'px;border-radius:0.15rem 0.15rem 0 0;min-height:2px;"></div>';
              html += '<div style="font-size: 0.625rem; color: #374151; writing-mode: vertical-rl; transform: rotate(180deg); margin-top: 0.25rem;">' + esc(century) + '</div>';
              html += '</div>';
            });
            html += '</div>';
            html += '</div>';
          }
          
          // Close temporal/other grid
          html += '</div>';
          
          // Monastic Institutions (full width)
          if (monasticInstitutions.size > 0) {
            html += '<div style="margin-top: 2rem;">';
            html += '<div style="font-weight: 600; color: #374151; margin-bottom: 1rem;">Monastic Institutions (' + monasticInstitutions.size + ' total)</div>';
            html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">';
            const institutionArray = Array.from(monasticInstitutions).sort();
            institutionArray.forEach(institution => {
              html += '<span style="background: #fef3c7; color: #92400e; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; border: 1px solid #fde68a;">';
              html += esc(institution);
              html += '</span>';
            });
            html += '</div>';
            html += '</div>';
          }
          
          html += '</div>';
        }
      } else if (!isSpecificFormulaView && formula.count > 0) {
        // When not in specific view, show production unit list with links
        html += '<div style="margin-top: 1rem;">';
        html += '<div style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">Found in production units:</div>';
        html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">';
        
        // Get unique PU titles from matches
        const uniquePUs = [];
        const seenPUIds = new Set();
        formula.matches.forEach(match => {
          if (!seenPUIds.has(match.puId)) {
            seenPUIds.add(match.puId);
            uniquePUs.push({ id: match.puId, title: match.puTitle });
          }
        });
        
        uniquePUs.slice(0, 10).forEach(pu => {
          html += '<a href="#" onclick="event.preventDefault(); jumpTo(\'pu\', \'' + pu.id + '\');" ';
          html += 'style="background: #fef3c7; color: #92400e; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; text-decoration: none;">';
          html += esc(pu.title);
          html += '</a>';
        });
        if (uniquePUs.length > 10) {
          html += '<span style="color: #6b7280; font-size: 0.75rem; padding: 0.25rem 0.5rem;">+' + (uniquePUs.length - 10) + ' more</span>';
        }
        html += '</div>';
        html += '</div>';
      }
      
      html += '</div>';
      
      return html;
    }).join('');
    
    // Update counts
    const countMsg = 'Showing ' + (startIdx + 1) + '-' + Math.min(endIdx, formulas.length) + ' of ' + formulas.length + ' formula' + (formulas.length !== 1 ? 's' : '');
    document.getElementById('formula-count-top').textContent = countMsg;
    document.getElementById('formula-count-bottom').textContent = countMsg + '.';
    
    // Render pagination
    const renderPagination = (containerId) => {
      const container = document.getElementById(containerId);
      if (totalPages <= 1) {
        container.innerHTML = '';
        return;
      }
      
      const buttons = [];
      
      // Previous button
      const prevDisabled = page === 1;
      buttons.push(
        '<button class="explore-action-btn explore-pagination-btn" ' + (prevDisabled ? 'disabled ' : '') +
        'data-page="' + (page - 1) + '">' +
        '← Previous</button>'
      );
      
      // Page numbers
      const maxButtons = 7;
      let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      
      if (startPage > 1) {
        buttons.push(
          '<button class="explore-action-btn explore-pagination-btn" data-page="1">1</button>'
        );
        if (startPage > 2) {
          buttons.push('<span style="padding: 0.5rem;">...</span>');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        const isCurrent = i === page;
        buttons.push(
          '<button class="explore-action-btn explore-pagination-btn' + (isCurrent ? ' is-current' : '') + '" ' + (isCurrent ? 'disabled ' : '') +
          'data-page="' + i + '">' +
          i + '</button>'
        );
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push('<span style="padding: 0.5rem;">...</span>');
        }
        buttons.push(
          '<button class="explore-action-btn explore-pagination-btn" data-page="' + totalPages + '">' + totalPages + '</button>'
        );
      }
      
      // Next button
      const nextDisabled = page === totalPages;
      buttons.push(
        '<button class="explore-action-btn explore-pagination-btn" ' + (nextDisabled ? 'disabled ' : '') +
        'data-page="' + (page + 1) + '">' +
        'Next →</button>'
      );
      
      container.innerHTML = buttons.join('');
      
      // Add click event listeners to all page buttons
      container.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
          const newPage = parseInt(this.getAttribute('data-page'));
          if (!isNaN(newPage) && newPage !== page) {
            currentPage = newPage;
            renderFormulas(getFilteredFormulas(), currentPage);
          }
        });
      });
    };
    
    renderPagination('formula-pagination-top');
    renderPagination('formula-pagination-bottom');
    
    // Scroll to top
    mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // Get filtered formulas
  const getFilteredFormulas = () => {
    const languageFilter = document.getElementById('formula-filter-language').value;
    const countryFilter = document.getElementById('formula-filter-country').value;
    const specificFilter = document.getElementById('formula-filter-specific').value;
    const typeFilter = document.getElementById('formula-filter-type').value;
    
    let filtered = [];
    
    // Language or Country filter (language takes precedence if both selected)
    if (languageFilter) {
      filtered = formulasByLanguage[languageFilter] || [];
    } else if (countryFilter) {
      filtered = formulasByCountry[countryFilter] || [];
    } else {
      filtered = formulaResults; // Use all formulas
    }
    
    // Specific formula filter (optional)
    if (specificFilter) {
      filtered = filtered.filter(f => f.formula === specificFilter);
      selectedFormula = specificFilter;
    } else {
      selectedFormula = '';
    }
    
    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(f => classifyFormulaType(f.formula) === typeFilter);
    }
    
    return filtered;
  };
  
  // Initial render
  renderFormulas(getFilteredFormulas(), currentPage);
  
  // Event listeners for cascading filters
  document.getElementById('formula-filter-language').addEventListener('change', function() {
    selectedLanguage = this.value;
    if (this.value) {
      document.getElementById('formula-filter-country').value = '';
      selectedCountry = '';
    }
    updateFormulaDropdown();
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  document.getElementById('formula-filter-country').addEventListener('change', function() {
    selectedCountry = this.value;
    if (this.value) {
      document.getElementById('formula-filter-language').value = '';
      selectedLanguage = '';
    }
    updateFormulaDropdown();
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  document.getElementById('formula-filter-specific').addEventListener('change', function() {
    selectedFormula = this.value;
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  document.getElementById('formula-filter-type').addEventListener('change', function() {
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  // Global Map Toggle
  document.getElementById('toggle-global-map').addEventListener('click', function() {
    const content = document.getElementById('global-map-content');
    const icon = document.getElementById('map-toggle-icon');
    const isHidden = content.style.display === 'none';
    
    content.style.display = isHidden ? 'block' : 'none';
    icon.textContent = isHidden ? '▲' : '▼';
    
    // Initialize map on first open
    if (isHidden && !window.formulaMapInitialized) {
      initializeGlobalMap();
      window.formulaMapInitialized = true;
    }
  });
  
  // Initialize Global Map Visualization with Leaflet
  async function initializeGlobalMap() {
    // Initialize comparison tracking
    window.comparisonFormulas = window.comparisonFormulas || new Set();
    window.comparisonLayers = window.comparisonLayers || [];
    
    const container = document.getElementById('global-map-container');
    
    // Remove placeholder
    const placeholder = document.getElementById('global-map-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    
    // Show loading message
    container.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #9ca3af;">Loading map...</div>';
    
    // Load Leaflet
    await ensureLeaflet();
    
    // Clear container and set up for map
    container.innerHTML = '';
    container.style.height = '500px';
    container.style.background = 'transparent';
    container.style.position = 'relative';
    
    // Initialize map
    const map = L.map(container).setView([48.8566, 2.3522], 4); // Center on Europe
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    
    // Create city coordinates map (common medieval manuscript locations)
    const cityCoordinates = {
      'Florence': [43.7696, 11.2558],
      'Rome': [41.9028, 12.4964],
      'Venice': [45.4408, 12.3155],
      'Milan': [45.4642, 9.1900],
      'Bologna': [44.4949, 11.3426],
      'Paris': [48.8566, 2.3522],
      'Lyon': [45.7640, 4.8357],
      'Avignon': [43.9493, 4.8055],
      'London': [51.5074, -0.1278],
      'Oxford': [51.7520, -1.2577],
      'Cambridge': [52.2053, 0.1218],
      'Brussels': [50.8503, 4.3517],
      'Bruges': [51.2093, 3.2247],
      'Amsterdam': [52.3676, 4.9041],
      'Utrecht': [52.0907, 5.1214],
      'Cologne': [50.9375, 6.9603],
      'Munich': [48.1351, 11.5820],
      'Vienna': [48.2082, 16.3738],
      'Prague': [50.0755, 14.4378],
      'Krakow': [50.0647, 19.9450],
      'Lisbon': [38.7223, -9.1393],
      'Madrid': [40.4168, -3.7038],
      'Barcelona': [41.3874, 2.1686],
      'Stockholm': [59.3293, 18.0686],
      'Basel': [47.5596, 7.5886],
      'Zurich': [47.3769, 8.5417],
      'Geneva': [46.2044, 6.1432],
      'Dijon': [47.3220, 5.0415],
      'Strasbourg': [48.5734, 7.7521],
      'Mainz': [50.0000, 8.2710],
      'Nuremberg': [49.4521, 11.0767],
      'Hamburg': [53.5511, 9.9937],
      'Copenhagen': [55.6761, 12.5683],
      'Dublin': [53.3498, -6.2603],
      'Edinburgh': [55.9533, -3.1883],
      'Malines': [51.0259, 4.4777], // Mechelen
      'Mechelen': [51.0259, 4.4777],
      'Antwerp': [51.2194, 4.4025],
      'Liège': [50.6326, 5.5797],
      'Tournai': [50.6054, 3.3889],
      'Mons': [50.4542, 3.9564],
      'Ghent': [51.0543, 3.7174]
    };
    
    // Aggregate formula data by location
    const locationData = {};
    
    formulaResults.forEach(formula => {
      formula.matches.forEach(match => {
        const country = match.country || '';
        const city = match.city || '';
        const locationKey = city || country;
        if (!isKnownCategory(locationKey)) return;
        
        if (!locationData[locationKey]) {
          locationData[locationKey] = {
            city: city,
            country: country,
            count: 0,
            formulas: new Set(),
            centuries: {},
            languages: new Set(),
            matches: []
          };
        }
        
        locationData[locationKey].count++;
        locationData[locationKey].formulas.add(formula.formula);
        locationData[locationKey].languages.add(formula.language);
        locationData[locationKey].matches.push({
          formula: formula.formula,
          language: formula.language,
          century: match.century
        });
        
        if (match.century) {
          locationData[locationKey].centuries[match.century] = 
            (locationData[locationKey].centuries[match.century] || 0) + 1;
        }
      });
    });
    
    // Add markers to map
    const markers = [];
    const bounds = [];
    
    Object.entries(locationData).forEach(([location, data]) => {
      let coords = null;
      
      // Try to find coordinates for city first, then country
      if (data.city && cityCoordinates[data.city]) {
        coords = cityCoordinates[data.city];
      } else if (cityCoordinates[location]) {
        coords = cityCoordinates[location];
      } else if (cityCoordinates[data.country]) {
        coords = cityCoordinates[data.country];
      }
      
      if (coords) {
        // Size marker based on count
        const radius = Math.max(8, Math.min(30, Math.sqrt(data.count) * 3));
        
        // Color based on count intensity
        const maxCount = Math.max(...Object.values(locationData).map(d => d.count));
        const intensity = data.count / maxCount;
        const color = intensity > 0.7 ? '#92400e' : intensity > 0.4 ? '#d97706' : '#d4af37';
        
        const marker = L.circleMarker(coords, {
          radius: radius,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        });
        
        // Create popup content with formula list (all formulas, clickable)
        const formulaList = Array.from(data.formulas)
          .sort()
          .map(f => `<li style="margin: 0.25rem 0; font-size: 0.7rem;"><a href="#" onclick="const compBtn = document.getElementById('toggle-comparison');
if (compBtn.style.background === 'rgb(212, 175, 55)') {
  if (typeof window.addToComparison === 'function') window.addToComparison('${esc(f).replace(/'/g, "\\\\'")}');
} else {
  document.getElementById('formula-search-box').value='${esc(f).replace(/'/g, "\\\\'")}';
  const event = new Event('input', { bubbles: true });
  document.getElementById('formula-search-box').dispatchEvent(event);
}
return false;" style="color: #d4af37; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${esc(f)}</a></li>`)
          .join('');
        
        const centuryList = Object.entries(data.centuries)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([c, count]) => `${esc(c)} (${count})`)
          .join(', ');
        
        const popupContent = `
          <div style="min-width: 250px; max-width: 350px;">
            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1rem;">
              ${esc(data.city || data.country)}
            </h4>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
              <strong>${data.count}</strong> formula occurrence${data.count !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">
              ${data.formulas.size} unique formula${data.formulas.size !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">
              Languages: ${Array.from(data.languages).join(', ')}
            </div>
            ${centuryList ? `<div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb;">
              Centuries: ${centuryList}
            </div>` : ''}
            <details style="margin-top: 0.5rem;" open>
              <summary style="cursor: pointer; font-size: 0.75rem; font-weight: 600; color: #d4af37; margin-bottom: 0.5rem;">Formulas (${data.formulas.size})</summary>
              <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; max-height: 300px; overflow-y: auto;">
                ${formulaList}
              </ul>
            </details>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.addTo(map);
        markers.push(marker);
        bounds.push(coords);
      }
    });
    
    // Fit map to markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.background = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      div.innerHTML = `
        <div style="font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;">Formula Density</div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <div style="width: 20px; height: 20px; border-radius: 50%; background: #92400e; border: 2px solid white;"></div>
          <span style="font-size: 0.75rem;">High</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <div style="width: 16px; height: 16px; border-radius: 50%; background: #d97706; border: 2px solid white;"></div>
          <span style="font-size: 0.75rem;">Medium</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #d4af37; border: 2px solid white;"></div>
          <span style="font-size: 0.75rem;">Low</span>
        </div>
      `;
      return div;
    };
    legend.addTo(map);
    
    // Create marker cluster group
    const markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        let size = 'small';
        if (count > 10) size = 'large';
        else if (count > 5) size = 'medium';
        
        return L.divIcon({
          html: `<div style="background: #d4af37; color: white; border-radius: 50%; width: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'}; height: ${size === 'large' ? '50px' : size === 'medium' ? '40px' : '30px'}; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count}</div>`,
          className: 'marker-cluster',
          iconSize: [size === 'large' ? 50 : size === 'medium' ? 40 : 30, size === 'large' ? 50 : size === 'medium' ? 40 : 30]
        });
      }
    });
    
    // Add all markers to cluster group
    markers.forEach(marker => markerClusterGroup.addLayer(marker));
    map.addLayer(markerClusterGroup);
    
    // Store data globally for filtering
    window.formulaMapData = { map, markers, locationData, cityCoordinates, markerClusterGroup };
    
    // Populate language filter
    const allLanguages = new Set();
    formulaResults.forEach(f => allLanguages.add(f.language));
    const languageSelect = document.getElementById('language-filter');
    Array.from(allLanguages).sort().forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang;
      languageSelect.appendChild(option);
    });
    
    // Set up search functionality
    const searchBox = document.getElementById('formula-search-box');
    searchBox.addEventListener('input', function() {
      window.applyMapFilters();
    });
    
    // Set up language filter
    languageSelect.addEventListener('change', function() {
      window.applyMapFilters();
    });
    
    // Set up CSV export
    document.getElementById('export-csv-btn').addEventListener('click', function() {
      window.exportMapDataAsCSV();
    });
    
    // Set up PNG export
    document.getElementById('export-png-btn').addEventListener('click', function() {
      window.exportMapAsPNG();
    });
    
    // Populate autocomplete suggestions
    const datalist = document.getElementById('formula-suggestions');
    const uniqueFormulas = new Set();
    formulaResults.forEach(f => uniqueFormulas.add(f.formula));
    Array.from(uniqueFormulas).sort().forEach(formula => {
      const option = document.createElement('option');
      option.value = formula;
      datalist.appendChild(option);
    });
    
    // Set up heat map toggle
    document.getElementById('toggle-heatmap').addEventListener('click', function() {
      window.toggleHeatMap();
    });
    
    // Set up comparison mode
    window.comparisonFormulas = new Set();
    window.comparisonLayers = [];
    document.getElementById('toggle-comparison').addEventListener('click', function() {
      const btn = this;
      const isActive = btn.style.background === 'rgb(212, 175, 55)';
      if (isActive) {
        // Deactivate
        btn.style.background = 'white';
        btn.style.color = '#374151';
        window.clearComparison();
      } else {
        // Activate
        btn.style.background = '#d4af37';
        btn.style.color = 'white';
        document.getElementById('comparison-info').style.display = 'block';
        
        // Show instruction
        const instruction = document.createElement('div');
        instruction.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #3b82f6; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; font-size: 0.875rem; text-align: center; max-width: 500px;';
        instruction.innerHTML = '<strong>Comparison Mode Active</strong><br>Click on formulas in map popups to add them to comparison';
        document.body.appendChild(instruction);
        setTimeout(() => instruction.remove(), 5000);
      }
    });
    
    document.getElementById('clear-comparison').addEventListener('click', function() {
      window.clearComparison();
    });
    
    // Set up network view
    window.networkActive = false;
    window.networkLines = [];
    document.getElementById('toggle-network').addEventListener('click', function() {
      window.toggleNetworkView();
    });
    
    // Set up timeline animation
    window.timelineInterval = null;
    document.getElementById('play-timeline').addEventListener('click', function() {
      window.toggleTimeline();
    });
    
    // Set up century filter
    const slider = document.getElementById('century-slider');
    const labelStart = document.getElementById('century-label-start');
    const labelEnd = document.getElementById('century-label-end');
    
    // Get all unique centuries
    const allCenturies = new Set();
    Object.values(locationData).forEach(data => {
      Object.keys(data.centuries).forEach(c => allCenturies.add(c));
    });
    const sortedCenturies = Array.from(allCenturies).sort();
    
    if (sortedCenturies.length > 0) {
      slider.min = 0;
      slider.max = sortedCenturies.length;
      slider.value = 0;
      labelStart.textContent = 'All Centuries';
      labelEnd.textContent = '';
      
      slider.addEventListener('input', function() {
        const index = parseInt(this.value);
        if (index === 0) {
          labelStart.textContent = 'All Centuries';
          labelEnd.textContent = '';
          window.applyMapFilters(null);
        } else {
          const selectedCentury = sortedCenturies[index - 1];
          labelStart.textContent = selectedCentury;
          labelEnd.textContent = '';
          window.applyMapFilters(selectedCentury);
        }
      });
    }
    
    // Mark map as initialized
    window.formulaMapInitialized = true;
  }
  
  // Global helper functions for formula map (must be outside initializeGlobalMap for global access)
  
  // Apply all map filters (century, search, language)
  window.applyMapFilters = function(century) {
    if (!window.formulaMapData) return;
    
    const { map, markers, locationData, markerClusterGroup } = window.formulaMapData;
    const searchTerm = document.getElementById('formula-search-box')?.value.toLowerCase().trim() || '';
    const selectedLanguage = document.getElementById('language-filter')?.value || '';
    
    // Clear cluster group
    if (markerClusterGroup) {
      markerClusterGroup.clearLayers();
    }
    markers.length = 0;
    
    // Re-add markers with filtered data
    const bounds = [];
    
    Object.entries(locationData).forEach(([location, data]) => {
      // Filter matches by century, search term, and language
      let filteredMatches = data.matches;
      
      if (century) {
        filteredMatches = filteredMatches.filter(m => m.century === century);
      }
      
      if (searchTerm) {
        filteredMatches = filteredMatches.filter(m => 
          (m.formula || '').toLowerCase().includes(searchTerm)
        );
      }
      
      if (selectedLanguage) {
        filteredMatches = filteredMatches.filter(m => 
          m.language && m.language === selectedLanguage
        );
      }
      
      // Skip this location if no matches remain after filtering
      if (filteredMatches.length === 0) return;
      
      let filteredData = data;
      if (century || searchTerm || selectedLanguage) {
        const centuriesFiltered = {};
        filteredMatches.forEach(m => {
          if (m.century) {
            centuriesFiltered[m.century] = (centuriesFiltered[m.century] || 0) + 1;
          }
        });
        
        filteredData = {
          ...data,
          count: filteredMatches.length,
          formulas: new Set(filteredMatches.map(m => m.formula)),
          languages: new Set(filteredMatches.map(m => m.language)),
          centuries: centuriesFiltered,
          matches: filteredMatches
        };
      }
      
      let coords = null;
      const cityCoordinates = window.formulaMapData.cityCoordinates || {};
      
      if (data.city && cityCoordinates[data.city]) {
        coords = cityCoordinates[data.city];
      } else if (cityCoordinates[location]) {
        coords = cityCoordinates[location];
      } else if (cityCoordinates[data.country]) {
        coords = cityCoordinates[data.country];
      }
      
      if (coords) {
        const radius = Math.max(8, Math.min(30, Math.sqrt(filteredData.count) * 3));
        const maxCount = Math.max(...Object.values(locationData).map(d => d.count));
        const intensity = filteredData.count / maxCount;
        const color = intensity > 0.7 ? '#92400e' : intensity > 0.4 ? '#d97706' : '#d4af37';
        
        const marker = L.circleMarker(coords, {
          radius: radius,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        });
        
        // Create popup with formula list (all formulas, clickable)
        const formulaList = Array.from(filteredData.formulas)
          .sort()
          .map(f => `<li style="margin: 0.25rem 0; font-size: 0.7rem;"><a href="#" onclick="const compBtn = document.getElementById('toggle-comparison');
if (compBtn.style.background === 'rgb(212, 175, 55)') {
  if (typeof window.addToComparison === 'function') window.addToComparison('${esc(f).replace(/'/g, "\\\\'")}');
} else {
  document.getElementById('formula-search-box').value='${esc(f).replace(/'/g, "\\\\'")}';
  const event = new Event('input', { bubbles: true });
  document.getElementById('formula-search-box').dispatchEvent(event);
}
return false;" style="color: #d4af37; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${esc(f)}</a></li>`)
          .join('');
        
        const centuryList = Object.entries(filteredData.centuries)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([c, count]) => `${esc(c)} (${count})`)
          .join(', ');
        
        const popupContent = `
          <div style="min-width: 250px; max-width: 350px;">
            <h4 style="margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1rem;">
              ${esc(data.city || data.country)}
            </h4>
            <div style="font-size: 0.875rem; margin-bottom: 0.5rem;">
              <strong>${filteredData.count}</strong> formula occurrence${filteredData.count !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.25rem;">
              ${filteredData.formulas.size} unique formula${filteredData.formulas.size !== 1 ? 's' : ''}
            </div>
            <div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">
              Languages: ${Array.from(filteredData.languages).join(', ')}
            </div>
            ${centuryList ? `<div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e5e7eb;">
              Centuries: ${centuryList}
            </div>` : ''}
            <details style="margin-top: 0.5rem;" open>
              <summary style="cursor: pointer; font-size: 0.75rem; font-weight: 600; color: #d4af37; margin-bottom: 0.5rem;">Formulas (${filteredData.formulas.size})</summary>
              <ul style="margin: 0.5rem 0 0 0; padding-left: 1.25rem; max-height: 300px; overflow-y: auto;">
                ${formulaList}
              </ul>
            </details>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        if (markerClusterGroup) {
          markerClusterGroup.addLayer(marker);
        } else {
          marker.addTo(map);
        }
        markers.push(marker);
        bounds.push(coords);
      }
    });
    
    // Refit map if there are markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
  
  // Export visible map data as CSV
  window.exportMapDataAsCSV = function() {
    if (!window.formulaMapData) return;
    
    // Track CSV export from formula map
    if (window.plausible) {
      plausible('Export', { props: { type: 'Formula Map', format: 'CSV' } });
    }
    
    const { markers, locationData } = window.formulaMapData;
    const searchTerm = document.getElementById('formula-search-box')?.value.toLowerCase().trim() || '';
    const selectedLanguage = document.getElementById('language-filter')?.value || '';
    const slider = document.getElementById('century-slider');
    const centuryIndex = parseInt(slider?.value || 0);
    
    // Get all unique centuries for filtering
    const allCenturies = new Set();
    Object.values(locationData).forEach(data => {
      Object.keys(data.centuries).forEach(c => allCenturies.add(c));
    });
    const sortedCenturies = Array.from(allCenturies).sort();
    const selectedCentury = centuryIndex > 0 ? sortedCenturies[centuryIndex - 1] : null;
    
    // Build CSV header
    const headers = ['Location', 'City', 'Country', 'Total Occurrences', 'Unique Formulas', 'Languages', 'Centuries', 'Formula List'];
    const rows = [headers];
    
    // Filter and add data rows
    Object.entries(locationData).forEach(([location, data]) => {
      let filteredMatches = data.matches;
      
      if (selectedCentury) {
        filteredMatches = filteredMatches.filter(m => m.century === selectedCentury);
      }
      if (searchTerm) {
        filteredMatches = filteredMatches.filter(m => m.formula.toLowerCase().includes(searchTerm));
      }
      if (selectedLanguage) {
        filteredMatches = filteredMatches.filter(m => m.language === selectedLanguage);
      }
      
      if (filteredMatches.length === 0) return;
      
      const formulas = new Set(filteredMatches.map(m => m.formula));
      const languages = new Set(filteredMatches.map(m => m.language));
      const centuries = {};
      filteredMatches.forEach(m => {
        if (m.century) centuries[m.century] = (centuries[m.century] || 0) + 1;
      });
      
      const centuryList = Object.entries(centuries)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([c, count]) => `${c} (${count})`)
        .join('; ');
      
      const row = [
        location,
        data.city || '',
        data.country || '',
        filteredMatches.length,
        formulas.size,
        Array.from(languages).join('; '),
        centuryList,
        Array.from(formulas).sort().join('; ')
      ];
      
      // Escape CSV values
      const escapedRow = row.map(value => {
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      });
      
      rows.push(escapedRow);
    });
    
    // Generate CSV content
    const csvContent = rows.map(row => row.join(',')).join('\n');
    
    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `formula-map-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Export map as high-resolution PNG
  window.exportMapAsPNG = function() {
    if (!window.formulaMapData) return;
    
    // Track formula map PNG export
    if (window.plausible) {
      plausible('Export', { props: { type: 'Formula Map', format: 'PNG' } });
    }
    
    const { map } = window.formulaMapData;
    const btn = document.getElementById('export-png-btn');
    btn.textContent = '⏳ Exporting...';
    btn.disabled = true;
    
    // Load leaflet-image if not already loaded
    if (typeof leafletImage === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet-image@0.4.0/leaflet-image.js';
      script.onload = () => captureMap();
      document.body.appendChild(script);
    } else {
      captureMap();
    }
    
    function captureMap() {
      // Temporarily disable clustering to show all markers for export
      const { markerClusterGroup, markers } = window.formulaMapData;
      const wasUsingCluster = map.hasLayer(markerClusterGroup);
      
      // Store current view
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();
      
      if (wasUsingCluster) {
        map.removeLayer(markerClusterGroup);
        markers.forEach(m => m.addTo(map));
      }
      
      // Reset map to show all bounds to prevent coordinate misplacement
      const bounds = L.latLngBounds(markers.map(m => m.getLatLng()));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
      
      // Wait for tiles and markers to render at new bounds
      setTimeout(() => {
        // Use leaflet-image to properly capture map tiles and markers
        leafletImage(map, function(err, canvas) {
          if (err) {
            btn.textContent = 'PNG';
            btn.disabled = false;
            
            // Restore original view on error
            map.setView(currentCenter, currentZoom);
            
            // Re-enable clustering if it was active
            if (wasUsingCluster) {
              markers.forEach(m => map.removeLayer(m));
              map.addLayer(markerClusterGroup);
            }
            
            alert('Export failed. Please try again.');
            return;
          }
        
        // Create high-resolution version
        const scaledCanvas = document.createElement('canvas');
        const scale = 2; // 2x for high DPI
        scaledCanvas.width = canvas.width * scale;
        scaledCanvas.height = canvas.height * scale;
        const ctx = scaledCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(canvas, 0, 0);
        
        // Convert to PNG and download
        scaledCanvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `formula-map-${new Date().toISOString().split('T')[0]}-hd.png`;
          link.click();
          URL.revokeObjectURL(url);
          
          btn.textContent = 'PNG';
          btn.disabled = false;
          
          // Restore original view
          map.setView(currentCenter, currentZoom);
          
          // Re-enable clustering if it was active
          if (wasUsingCluster) {
            markers.forEach(m => map.removeLayer(m));
            map.addLayer(markerClusterGroup);
          }
        }, 'image/png');
        });
      }, 800); // Wait 800ms for tiles and markers to render
    }
  }
  
  // Toggle heat map view
  window.toggleHeatMap = function() {
    if (!window.formulaMapData) return;
    
    const { map, locationData, cityCoordinates, markerClusterGroup } = window.formulaMapData;
    const btn = document.getElementById('toggle-heatmap');
    
    if (!window.heatMapLayer) {
      // Create heat map from location data
      const heatData = [];
      Object.entries(locationData).forEach(([location, data]) => {
        let coords = null;
        if (data.city && cityCoordinates[data.city]) {
          coords = cityCoordinates[data.city];
        } else if (cityCoordinates[location]) {
          coords = cityCoordinates[location];
        } else if (cityCoordinates[data.country]) {
          coords = cityCoordinates[data.country];
        }
        
        if (coords) {
          // Intensity based on formula count (normalized to 0-1)
          const intensity = Math.min(1.0, data.count / 20);
          heatData.push([coords[0], coords[1], intensity]);
        }
      });
      
      window.heatMapLayer = L.heatLayer(heatData, {
        radius: 40,
        blur: 20,
        maxZoom: 10,
        max: 1.0,
        minOpacity: 0.6,
        gradient: {
          0.0: '#fef3c7',
          0.3: '#fbbf24',
          0.5: '#f59e0b',
          0.7: '#d97706',
          1.0: '#92400e'
        }
      });
    }
    
    if (window.heatMapActive) {
      // Deactivate heat map
      map.removeLayer(window.heatMapLayer);
      map.addLayer(markerClusterGroup);
      window.heatMapActive = false;
      btn.style.background = 'white';
      btn.style.color = '#374151';
      btn.style.borderColor = '#d1d5db';
    } else {
      // Activate heat map
      map.removeLayer(markerClusterGroup);
      map.addLayer(window.heatMapLayer);
      window.heatMapActive = true;
      btn.style.background = '#92400e';
      btn.style.color = 'white';
      btn.style.borderColor = '#92400e';
    }
  }
  
  // Clear comparison mode
  window.clearComparison = function() {
    window.comparisonFormulas.clear();
    window.comparisonLayers.forEach(layer => {
      if (window.formulaMapData?.map) {
        window.formulaMapData.map.removeLayer(layer);
      }
    });
    window.comparisonLayers = [];
    document.getElementById('comparison-count').textContent = '0';
    document.getElementById('comparison-info').style.display = 'none';
    document.getElementById('toggle-comparison').style.background = 'white';
    document.getElementById('toggle-comparison').style.color = '#374151';
  }
  
  // Add formula to comparison
  window.addToComparison = function(formula) {
    if (!window.formulaMapData) return;
    if (!window.comparisonFormulas) window.comparisonFormulas = new Set();
    if (!window.comparisonLayers) window.comparisonLayers = [];
    
    if (window.comparisonFormulas.has(formula)) {
      alert('Formula already in comparison');
      return;
    }
    
    window.comparisonFormulas.add(formula);
    document.getElementById('comparison-count').textContent = window.comparisonFormulas.size;
    
    // Show user feedback
    const feedback = document.createElement('div');
    feedback.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; font-size: 0.875rem;';
    feedback.textContent = `Added "${formula.substring(0, 40)}${formula.length > 40 ? '...' : ''}" to comparison`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
    
    // Get color for this formula
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#fb923c', '#eab308'];
    const colorIndex = (window.comparisonFormulas.size - 1) % colors.length;
    const color = colors[colorIndex];
    
    // Find all locations with this formula
    const { map, locationData, cityCoordinates } = window.formulaMapData;
    const markers = [];
    
    Object.entries(locationData).forEach(([location, data]) => {
      if (data.formulas.has(formula)) {
        let coords = null;
        if (data.city && cityCoordinates[data.city]) {
          coords = cityCoordinates[data.city];
        } else if (cityCoordinates[location]) {
          coords = cityCoordinates[location];
        } else if (cityCoordinates[data.country]) {
          coords = cityCoordinates[data.country];
        }
        
        if (coords) {
          const marker = L.circleMarker(coords, {
            radius: 8,
            fillColor: color,
            color: 'white',
            weight: 2,
            opacity: 0.9,
            fillOpacity: 0.7
          });
          marker.bindPopup(`<strong style="color: ${color};">${esc(formula)}</strong><br>${esc(location)}`);
          marker.addTo(map);
          markers.push(marker);
        }
      }
    });
    
    window.comparisonLayers.push(...markers);
  }
  
  // Toggle network visualization
  window.toggleNetworkView = function() {
    if (!window.formulaMapData) {
      alert('Please wait for the map to finish loading');
      return;
    }
    if (!window.networkLines) window.networkLines = [];
    
    const { map, locationData, cityCoordinates } = window.formulaMapData;
    const btn = document.getElementById('toggle-network');
    
    if (!btn) {
      return;
    }
    
    if (window.networkActive) {
      // Remove network lines
      window.networkLines.forEach(line => map.removeLayer(line));
      window.networkLines = [];
      window.networkActive = false;
      btn.style.background = 'white';
      btn.style.color = '#374151';
      btn.style.borderColor = '#d1d5db';
    } else {
      // Create network lines between locations sharing formulas
      const locationCoords = {};
      Object.entries(locationData).forEach(([location, data]) => {
        let coords = null;
        if (data.city && cityCoordinates[data.city]) {
          coords = cityCoordinates[data.city];
        } else if (cityCoordinates[location]) {
          coords = cityCoordinates[location];
        } else if (cityCoordinates[data.country]) {
          coords = cityCoordinates[data.country];
        }
        if (coords) {
          locationCoords[location] = { coords, formulas: data.formulas };
        }
      });
      
      // Find connections (locations sharing formulas)
      const locations = Object.keys(locationCoords);
      const connections = new Map();
      
      for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
          const loc1 = locations[i];
          const loc2 = locations[j];
          const formulas1 = locationCoords[loc1].formulas;
          const formulas2 = locationCoords[loc2].formulas;
          
          // Count shared formulas
          const shared = new Set([...formulas1].filter(f => formulas2.has(f)));
          if (shared.size > 0) {
            const key = `${loc1}|${loc2}`;
            connections.set(key, { loc1, loc2, count: shared.size });
          }
        }
      }
      
      // Draw lines for connections
      connections.forEach(({ loc1, loc2, count }) => {
        const coords1 = locationCoords[loc1].coords;
        const coords2 = locationCoords[loc2].coords;
        
        const line = L.polyline([coords1, coords2], {
          color: '#d4af37',
          weight: Math.min(count / 2, 5),
          opacity: 0.4,
          dashArray: '5, 10'
        });
        
        line.bindPopup(`<strong>${esc(loc1)} ↔ ${esc(loc2)}</strong><br>${count} shared formula${count > 1 ? 's' : ''}`);
        line.addTo(map);
        window.networkLines.push(line);
      });
      
      window.networkActive = true;
      btn.style.background = '#d4af37';
      btn.style.color = 'white';
      btn.style.borderColor = '#d4af37';
      
      // Show feedback to user
      if (window.networkLines.length === 0) {
        alert('No connections found. Locations need to share at least one formula to be connected.');
      }
    }
  }
  
  // Toggle timeline animation
  window.toggleTimeline = function() {
    const btn = document.getElementById('play-timeline');
    const status = document.getElementById('timeline-status');
    const slider = document.getElementById('century-slider');
    
    if (window.timelineInterval) {
      // Stop animation
      clearInterval(window.timelineInterval);
      window.timelineInterval = null;
      btn.textContent = '▶️';
      status.textContent = 'Timeline Animation';
    } else {
      // Start animation
      btn.textContent = '⏸️';
      const max = parseInt(slider.max);
      let current = parseInt(slider.value);
      
      window.timelineInterval = setInterval(() => {
        current++;
        if (current > max) current = 0;
        
        slider.value = current;
        const event = new Event('input', { bubbles: true });
        slider.dispatchEvent(event);
        
        // Update status
        if (current === 0) {
          status.textContent = 'All Centuries';
        } else {
          const allCenturies = new Set();
          Object.values(window.formulaMapData.locationData).forEach(data => {
            Object.keys(data.centuries).forEach(c => allCenturies.add(c));
          });
          const sortedCenturies = Array.from(allCenturies).sort();
          status.textContent = sortedCenturies[current - 1] || 'Timeline Animation';
        }
      }, 2000); // 2 seconds per century
    }
  };

// 6. EXPLORE FORMULAS TAB (end event listeners)
  mount.addEventListener('formula-filter', () => {
    currentPage = 1;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
  
  mount.addEventListener('formula-page', (e) => {
    currentPage = e.detail;
    renderFormulas(getFilteredFormulas(), currentPage);
  });
}

function buildBrowseColophons(mount) {
  const instances = getAllColophonInstances().map(instance => ({
    ...instance,
    scribeName: isKnownCategory(instance.su.rec_Title) ? instance.su.rec_Title : `Scribal unit ${instance.su.rec_ID}`
  }));
  const unique = values => [...new Set(values.filter(isKnownCategory))].sort();
  const languages = unique(instances.map(instance => instance.language));
  const centuries = unique(instances.flatMap(instance => instance.context.centuries));
  const countries = unique(instances.flatMap(instance => instance.context.countries));
  const institutions = unique(instances.flatMap(instance => instance.context.institutions));
  const itemsPerPage = 20;
  let currentPage = 1;

  mount.innerHTML = `
    <div style="max-width:1200px;margin:0 auto;">
      <h2 style="margin-bottom:.75rem;color:#1a1a1a;">Browse &amp; Read</h2>
      <div id="colophon-count-top" style="color:#666;margin-bottom:1.5rem;"></div>
      <div class="explore-visualization-card" style="margin-bottom:1.5rem;">
        <h3 style="font-size:1rem;margin:0 0 1rem;">Filter readable colophons</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1rem;">
          <label>Language<select id="filter-language" style="width:100%;margin-top:.35rem;"><option value="">All known and unassigned</option>${languages.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label>
          <label>Century<select id="filter-century" style="width:100%;margin-top:.35rem;"><option value="">All centuries</option>${centuries.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label>
          <label>Country<select id="filter-country" style="width:100%;margin-top:.35rem;"><option value="">All countries</option>${countries.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label>
          <label>Institution<select id="filter-institution" style="width:100%;margin-top:.35rem;"><option value="">All institutions</option>${institutions.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label>
          <label>Text search<input id="filter-search" type="search" placeholder="Transcription, translation, or note" style="width:100%;margin-top:.35rem;"></label>
        </div>
      </div>
      <div id="pagination-top" style="display:flex;justify-content:center;gap:.5rem;align-items:center;margin-bottom:1.25rem;"></div>
      <div id="colophon-list" style="display:flex;flex-direction:column;gap:1.25rem;"></div>
      <div id="pagination-bottom" style="display:flex;justify-content:center;gap:.5rem;align-items:center;margin-top:1.5rem;"></div>
    </div>`;

  const getFiltered = () => {
    const language = document.getElementById('filter-language')?.value || '';
    const century = document.getElementById('filter-century')?.value || '';
    const country = document.getElementById('filter-country')?.value || '';
    const institution = document.getElementById('filter-institution')?.value || '';
    const query = (document.getElementById('filter-search')?.value || '').trim().toLowerCase();
    return instances.filter(instance => {
      if (language && instance.language !== language) return false;
      if (century && !instance.context.centuries.includes(century)) return false;
      if (country && !instance.context.countries.includes(country)) return false;
      if (institution && !instance.context.institutions.includes(institution)) return false;
      if (query && !`${instance.transcription} ${instance.translation} ${instance.comment} ${instance.scribeName}`.toLowerCase().includes(query)) return false;
      return true;
    });
  };

  const renderPagination = (container, totalPages) => {
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    container.innerHTML = `<button type="button" class="explore-action-btn explore-pagination-btn" data-colophon-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>Previous</button><span>Page ${currentPage} of ${totalPages}</span><button type="button" class="explore-action-btn explore-pagination-btn" data-colophon-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
  };

  const render = () => {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);
    document.getElementById('colophon-count-top').textContent = filtered.length ? `Showing ${start + 1}–${Math.min(start + itemsPerPage, filtered.length)} of ${filtered.length} readable colophon instances.` : 'No readable colophon instances match these filters.';

    document.getElementById('colophon-list').innerHTML = pageItems.map(instance => {
      const repeated = getColophonInstances(instance.su).length > 1;
      const transcriptionId = `transcription-${instance.id}`;
      const translationId = `translation-${instance.id}`;
      return `<article class="explore-visualization-card" data-colophon-instance="${instance.id}">
        <div style="display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;flex-wrap:wrap;border-bottom:1px solid #eee;padding-bottom:1rem;margin-bottom:1rem;">
          <div><h3 style="font-size:1.05rem;margin:0 0 .35rem;">${esc(instance.scribeName)}${repeated ? ` — colophon ${instance.ordinal}` : ''}</h3><div style="color:#666;font-size:.875rem;">${esc(instance.context.manuscript)}</div></div>
          <div style="text-align:right;font-size:.85rem;color:#666;">${instance.language ? `<div>${esc(instance.language)}</div>` : ''}${instance.context.centuries.length ? `<div>${instance.context.centuries.map(century => `${esc(century)}th`).join(' / ')} century</div>` : ''}</div>
        </div>
        ${instance.context.countries.length || instance.context.institutions.length ? `<div style="font-size:.85rem;color:#666;margin-bottom:1rem;">${instance.context.countries.length ? `<strong>Production country:</strong> ${instance.context.countries.map(esc).join(', ')}` : ''}${instance.context.countries.length && instance.context.institutions.length ? '<br>' : ''}${instance.context.institutions.length ? `<strong>Institution:</strong> ${instance.context.institutions.map(esc).join('; ')}` : ''}</div>` : ''}
        ${instance.hasTranscription ? `<section style="margin-bottom:1rem;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;"><strong style="font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;">Original transcription</strong><button type="button" class="explore-action-btn explore-action-btn--compact" data-copy-target="${transcriptionId}">Copy</button></div><div id="${transcriptionId}" style="background:#faf8f1;border-left:3px solid #d4af37;padding:1rem;line-height:1.65;">${esc(instance.transcription)}</div></section>` : ''}
        ${instance.hasTranslation ? `<section style="margin-bottom:1rem;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem;"><strong style="font-size:.78rem;text-transform:uppercase;letter-spacing:.04em;">English translation</strong><button type="button" class="explore-action-btn explore-action-btn--compact" data-copy-target="${translationId}">Copy</button></div><div id="${translationId}" style="background:#f4f8fb;border-left:3px solid #4facfe;padding:1rem;line-height:1.65;">${esc(instance.translation)}</div></section>` : ''}
        ${instance.comment ? `<details style="margin-bottom:1rem;"><summary>Source note or colophon comment</summary><div style="padding:.75rem 0;color:#555;line-height:1.6;">${esc(instance.comment)}</div></details>` : ''}
        <button type="button" class="explore-action-btn explore-action-btn--primary" onclick="window.jumpTo('su','${instance.su.rec_ID}')">View source scribal unit</button>
      </article>`;
    }).join('');

    renderPagination(document.getElementById('pagination-top'), totalPages);
    renderPagination(document.getElementById('pagination-bottom'), totalPages);
    mount.querySelectorAll('[data-colophon-page]').forEach(button => button.addEventListener('click', () => { currentPage = Number(button.dataset.colophonPage); render(); mount.scrollIntoView({ block: 'start' }); }));
    mount.querySelectorAll('[data-copy-target]').forEach(button => button.addEventListener('click', async () => {
      const text = document.getElementById(button.dataset.copyTarget)?.textContent || '';
      await navigator.clipboard.writeText(text.trim());
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    }));
  };

  const applyFilters = () => { currentPage = 1; render(); };
  ['filter-language', 'filter-century', 'filter-country', 'filter-institution'].forEach(id => document.getElementById(id)?.addEventListener('change', applyFilters));
  document.getElementById('filter-search')?.addEventListener('input', debounce(applyFilters, 250));
  render();
}


      return { buildColophonAnalysis };
    }
  };
})();
