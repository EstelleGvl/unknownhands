window.ExploreCodicology = (function() {
  function init(Core) {
    const COLORS = [
      '#0f766e', '#2563eb', '#c2410c', '#7c3aed', '#15803d', '#be123c',
      '#0369a1', '#a16207', '#6d28d9', '#047857', '#b91c1c', '#4f46e5',
      '#b45309', '#0e7490', '#9333ea', '#166534', '#9f1239', '#1d4ed8',
      '#854d0e', '#0f766e', '#6b21a8', '#3f6212', '#be185d', '#075985'
    ];
    const MISSING = /^(?:unknown|tbc|no data|none|nan|not known|to be (?:confirmed|completed|identified))$/i;
    let dimensionColorMode = 'century';

    const esc = Core.esc || (value => String(value ?? '').replace(/[&<>\"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;' }[char])));
    const details = (record, field) => (record?.details || []).filter(detail => detail.fieldName === field);
    const known = value => {
      const text = String(value ?? '').replace(/\s+/g, ' ').trim();
      return Boolean(text) && !MISSING.test(text) && Core.isKnownCategory(text);
    };
    const controlled = (record, fields) => {
      const names = Array.isArray(fields) ? fields : [fields];
      return [...new Set(names.flatMap(field => details(record, field))
        .map(detail => detail.termLabel)
        .filter(known)
        .map(value => String(value).trim()))];
    };
    const numeric = (record, field) => {
      const value = details(record, field).map(detail => Number.parseFloat(detail.value)).find(Number.isFinite);
      return Number.isFinite(value) ? value : null;
    };
    const plainValue = (record, field) => {
      const detail = details(record, field)[0];
      if (!detail) return '';
      if (known(detail.termLabel)) return String(detail.termLabel).trim();
      return typeof detail.value === 'string' && known(detail.value) ? detail.value.trim() : '';
    };
    const resource = (record, field) => {
      const value = details(record, field).map(detail => detail.value).find(item => item && typeof item === 'object' && item.id);
      return value || null;
    };
    const median = values => {
      const sorted = values.filter(Number.isFinite).slice().sort((a, b) => a - b);
      if (!sorted.length) return null;
      const middle = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    };
    const formatNumber = value => Number.isFinite(value) ? new Intl.NumberFormat('en').format(Math.round(value * 10) / 10) : 'No data';
    const countBy = values => {
      const counts = new Map();
      values.filter(known).forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
      return counts;
    };
    const sortedEntries = counts => [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    function centuries(record) {
      return [...new Set(controlled(record, 'Normalized century of production').flatMap(value =>
        String(value).match(/\b(?:[8-9]|1[0-8])\b/g) || []
      ).map(Number))].sort((a, b) => a - b);
    }

    function countries(record) {
      return [...new Set(controlled(record, 'PU country').flatMap(value =>
        value.split(/\s+(?:or|and\/or)\s+|\s*;\s*/i).map(part => part.trim()).filter(known)
      ))];
    }

    function materials(record) {
      return controlled(record, 'Material').map(value => {
        const normalized = value.toLowerCase();
        if (normalized === 'paper') return 'Paper';
        if (normalized === 'parchment') return 'Parchment';
        if (normalized === 'parchment and paper' || normalized === 'paper and parchment') return 'Hybrid';
        return null;
      }).filter(Boolean);
    }

    function quireTypes(record) {
      const values = controlled(record, 'Quire types');
      if (values.length > 1 || values.some(value => /\b(?:and|mixed|various)\b|[,;/]/i.test(value))) return ['Varia'];
      return values;
    }

    function explicitBoolean(record, fields) {
      const values = controlled(record, fields).map(value => value.toUpperCase());
      const hasTrue = values.includes('TRUE');
      const hasFalse = values.includes('FALSE');
      if (hasTrue === hasFalse) return null;
      if (hasTrue) return true;
      if (hasFalse) return false;
      return null;
    }

    function relatedTexts(record) {
      const id = String(record.rec_ID);
      const relationships = [
        ...(Core.REL_INDEX.bySource?.[id] || []),
        ...(Core.REL_INDEX.byTarget?.[id] || [])
      ];
      const texts = new Map();
      relationships.forEach(rel => {
        const source = Core.getRes(rel, 'Source record');
        const target = Core.getRes(rel, 'Target record');
        [source, target].forEach(endpoint => {
          const text = endpoint?.id ? Core.IDX.tx?.[String(endpoint.id)] : null;
          if (text) texts.set(String(text.rec_ID), text);
        });
      });
      return [...texts.values()];
    }

    const chartHeader = (id, title, filename) => `
      <div class="explore-viz-card-header">
        <h3>${esc(title)}</h3>
        ${Core.createExportButton(id, filename)}
      </div>`;

    function card(id, title, filename, content, note = '') {
      return `<section class="explore-visualization-card codicology-card" id="${id}">
        ${chartHeader(id, title, filename)}
        ${note ? `<p class="explore-chart-note">${esc(note)}</p>` : ''}
        ${content}
      </section>`;
    }

    function metricGrid(items) {
      return `<div class="explore-metric-grid codicology-metrics">${items.map(item => `
        <div class="explore-metric-card">
          <div class="stat-value">${esc(item.value)}</div>
          <div>${esc(item.label)}</div>
          ${item.note ? `<small>${esc(item.note)}</small>` : ''}
        </div>`).join('')}</div>`;
    }

    function distribution(counts, total, label = 'records') {
      const entries = sortedEntries(counts);
      if (!entries.length || !total) return '<p class="explore-empty-state">No known controlled values are available.</p>';
      return `<div class="codicology-bars">${entries.map(([name, count], index) => {
        const pct = count / total * 100;
        return `<div class="codicology-bar-row">
          <div class="codicology-bar-heading"><strong>${esc(name)}</strong><span>${count} · ${pct.toFixed(1)}%</span></div>
          <div class="explore-proportion-track" aria-label="${esc(name)}: ${count} ${esc(label)}, ${pct.toFixed(1)} percent">
            <span style="width:${pct}%;background:${COLORS[index % COLORS.length]}"></span>
          </div>
        </div>`;
      }).join('')}</div>`;
    }

    function stackedRows(rows, categories, rowUnit) {
      if (!rows.length) return '<p class="explore-empty-state">No known controlled values are available.</p>';
      const color = new Map(categories.map((category, index) => [category, COLORS[index % COLORS.length]]));
      return `<div class="codicology-stacked">
        <div class="codicology-legend">${categories.map(category => `<span><i style="background:${color.get(category)}"></i>${esc(category)}</span>`).join('')}</div>
        ${rows.map(row => {
          const total = categories.reduce((sum, category) => sum + (row.counts.get(category) || 0), 0);
          return `<div class="codicology-stacked-row">
            <div class="codicology-stacked-label"><strong>${esc(row.label)}</strong><span>n=${total} ${esc(rowUnit)}</span></div>
            <div class="codicology-stack" aria-label="${esc(row.label)}, ${total} ${esc(rowUnit)}">
              ${categories.map(category => {
                const count = row.counts.get(category) || 0;
                const pct = total ? count / total * 100 : 0;
                return count ? `<span style="width:${pct}%;background:${color.get(category)}" title="${esc(category)}: ${count} (${pct.toFixed(1)}%)"></span>` : '';
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }

    function matrix(rows, columns, values, unit) {
      const max = Math.max(1, ...values.values());
      return `<div class="codicology-table-wrap"><table class="codicology-matrix">
        <thead><tr><th scope="col">${esc(unit)}</th>${columns.map(column => `<th scope="col">${esc(column)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(row => `<tr><th scope="row">${esc(row)}</th>${columns.map(column => {
          const count = values.get(`${row}\u0000${column}`) || 0;
          const alpha = count ? 0.14 + (count / max * 0.72) : 0;
          return `<td style="background:rgba(15,118,110,${alpha})" title="${esc(row)} / ${esc(column)}: ${count}">${count || '—'}</td>`;
        }).join('')}</tr>`).join('')}</tbody>
      </table></div>`;
    }

    function methodIntro(title, description, unit) {
      return `<header class="codicology-intro">
        <h2>${esc(title)}</h2>
        <p>${esc(description)}</p>
        <div class="codicology-method"><strong>Unit of analysis:</strong> ${esc(unit)} Unknown and TBC values are excluded. Uncertain normalized dates and places contribute once to every plausible controlled value.</div>
      </header>`;
    }

    function byMembership(records, rowValues, categoryValues) {
      const rows = new Map();
      records.forEach(record => {
        const rowMemberships = rowValues(record);
        const categories = categoryValues(record);
        rowMemberships.forEach(row => {
          if (!rows.has(row)) rows.set(row, new Map());
          categories.forEach(category => rows.get(row).set(category, (rows.get(row).get(category) || 0) + 1));
        });
      });
      return [...rows.entries()].map(([label, counts]) => ({ label, counts }));
    }

    function prevalenceBy(records, groupValues, outcome, labels) {
      const groups = new Map();
      records.forEach(record => {
        const result = outcome(record);
        if (result === null) return;
        groupValues(record).forEach(group => {
          const item = groups.get(group) || { true: 0, false: 0 };
          item[result ? 'true' : 'false'] += 1;
          groups.set(group, item);
        });
      });
      const rows = [...groups.entries()].sort((a, b) => (b[1].true + b[1].false) - (a[1].true + a[1].false));
      return `<div class="codicology-bars">${rows.map(([group, values]) => {
        const observed = values.true + values.false;
        const pct = observed ? values.true / observed * 100 : 0;
        return `<div class="codicology-bar-row">
          <div class="codicology-bar-heading"><strong>${esc(group)}</strong><span>${values.true}/${observed} · ${pct.toFixed(1)}%</span></div>
          <div class="explore-proportion-track"><span style="width:${pct}%;background:#0f766e"></span></div>
        </div>`;
      }).join('')}</div><p class="explore-chart-note">Denominators contain only explicit TRUE/FALSE observations for ${esc(labels)}.</p>`;
    }

    function buildMaterialSubgenreMatrix(pus) {
      const values = new Map();
      const subgenreTotals = new Map();
      pus.forEach(pu => materials(pu).forEach(material => relatedTexts(pu).forEach(text =>
        controlled(text, 'Subgenre').forEach(subgenre => {
          values.set(`${material}\u0000${subgenre}`, (values.get(`${material}\u0000${subgenre}`) || 0) + 1);
          subgenreTotals.set(subgenre, (subgenreTotals.get(subgenre) || 0) + 1);
        })
      )));
      const subgenres = sortedEntries(subgenreTotals).slice(0, 12).map(([name]) => name);
      return matrix(['Paper', 'Parchment', 'Hybrid'], subgenres, values, 'Material');
    }

    function bindDimensionScatter(mount) {
      const wrapper = mount.querySelector('.codicology-scatter-wrap');
      const tooltip = wrapper?.querySelector('.codicology-scatter-tooltip');
      if (!wrapper || !tooltip) return;

      const describe = point => {
        const manuscript = Core.IDX.ms?.[String(point.dataset.recordId)];
        const title = manuscript?.rec_Title || `Manuscript ${point.dataset.recordId}`;
        const shelfmark = plainValue(manuscript, 'Call number');
        const holding = resource(manuscript, 'Holding Institution')?.title || '';
        const width = Number(point.dataset.width);
        const height = Number(point.dataset.height);
        const area = width * height / 100;
        const colourValues = String(point.dataset.colourValues || '').split('|').filter(Boolean);
        const colourLabel = wrapper.dataset.colorMode === 'century'
          ? 'Century'
          : wrapper.dataset.colorMode === 'country'
            ? 'Production country'
            : wrapper.dataset.colorMode === 'order'
              ? 'Monastic order'
              : '';
        tooltip.innerHTML = `
          <strong>${esc(title)}</strong>
          ${shelfmark && !title.includes(shelfmark) ? `<span>${esc(shelfmark)}</span>` : ''}
          ${holding && !title.includes(holding) ? `<span>${esc(holding)}</span>` : ''}
          <span>${formatNumber(height)} × ${formatNumber(width)} mm (height × width) · ${formatNumber(area)} cm²</span>
          ${colourLabel && colourValues.length ? `<span>${esc(colourLabel)}: ${esc(colourValues.join(', '))}</span>` : ''}
          <span>Database record ${esc(point.dataset.recordId)}</span>`;
      };

      const position = (point, clientX, clientY) => {
        const wrapperRect = wrapper.getBoundingClientRect();
        const pointRect = point.getBoundingClientRect();
        const x = Number.isFinite(clientX) ? clientX - wrapperRect.left : pointRect.left + pointRect.width / 2 - wrapperRect.left;
        const y = Number.isFinite(clientY) ? clientY - wrapperRect.top : pointRect.top - wrapperRect.top;
        const boundedX = Math.max(8, Math.min(wrapperRect.width - 8, x));
        const horizontalShift = boundedX < 180 ? '0' : boundedX > wrapperRect.width - 180 ? '-100%' : '-50%';
        const verticalShift = y < 105 ? '0.7rem' : 'calc(-100% - 0.7rem)';
        tooltip.style.left = `${boundedX}px`;
        tooltip.style.transform = `translate(${horizontalShift}, ${verticalShift})`;
        tooltip.style.top = `${Math.max(8, y)}px`;
      };

      const show = (point, event = {}) => {
        describe(point);
        tooltip.hidden = false;
        position(point, event.clientX, event.clientY);
        point.classList.add('is-active');
      };
      const hide = point => {
        tooltip.hidden = true;
        point?.classList.remove('is-active');
      };

      wrapper.addEventListener('pointerover', event => {
        const point = event.target.closest('.codicology-scatter-point');
        if (point) show(point, event);
      });
      wrapper.addEventListener('pointermove', event => {
        const point = event.target.closest('.codicology-scatter-point');
        if (point && !tooltip.hidden) position(point, event.clientX, event.clientY);
      });
      wrapper.addEventListener('pointerout', event => {
        const point = event.target.closest('.codicology-scatter-point');
        if (point) hide(point);
      });
      wrapper.addEventListener('focusin', event => {
        const point = event.target.closest('.codicology-scatter-point');
        if (point) show(point);
      });
      wrapper.addEventListener('focusout', event => {
        const point = event.target.closest('.codicology-scatter-point');
        if (point) hide(point);
      });
      wrapper.addEventListener('keydown', event => {
        const point = event.target.closest('.codicology-scatter-point');
        if (point && event.key === 'Escape') {
          hide(point);
          point.blur();
        }
      });

      mount.querySelector('.codicology-scatter-colour-select')?.addEventListener('change', event => {
        dimensionColorMode = event.target.value;
        renderMaterials(mount);
      });
    }

    function renderMaterials(mount) {
      const pus = Core.DATA.pu || [];
      const manuscripts = Core.DATA.ms || [];
      const materialValues = pus.flatMap(materials);
      const dimensions = manuscripts.map(ms => ({ record: ms, width: numeric(ms, 'Codex width'), height: numeric(ms, 'Codex height') }))
        .filter(item => item.width && item.height);
      const materialRows = byMembership(pus, centuries, materials)
        .filter(row => row.label >= 8 && row.label <= 16).sort((a, b) => a.label - b.label);
      const categories = sortedEntries(countBy(materialValues)).map(([name]) => name);
      const scatter = dimensions;
      const maxH = Math.max(1, ...scatter.map(item => item.height));
      const maxW = Math.max(1, ...scatter.map(item => item.width));
      const pusByManuscript = new Map();
      pus.forEach(pu => {
        const manuscript = resource(pu, 'Manuscript');
        if (!manuscript?.id) return;
        const id = String(manuscript.id);
        if (!pusByManuscript.has(id)) pusByManuscript.set(id, []);
        pusByManuscript.get(id).push(pu);
      });
      const dimensionCategories = item => {
        const relatedPUs = pusByManuscript.get(String(item.record.rec_ID)) || [];
        if (dimensionColorMode === 'century') {
          return [...new Set(relatedPUs.flatMap(centuries).map(value => `${value}th`))].sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));
        }
        if (dimensionColorMode === 'country') {
          return [...new Set(relatedPUs.flatMap(countries))].sort();
        }
        if (dimensionColorMode === 'order') {
          return [...new Set(relatedPUs.flatMap(pu => {
            const institution = resource(pu, 'Monastic Institution');
            const record = institution?.id ? Core.IDX.mi?.[String(institution.id)] : null;
            return record ? controlled(record, 'Religious order') : [];
          }))].sort();
        }
        return [];
      };
      scatter.forEach(item => { item.colourCategories = dimensionCategories(item); });
      const colourCounts = countBy(scatter.flatMap(item => item.colourCategories));
      const colourCategories = dimensionColorMode === 'century'
        ? sortedEntries(colourCounts).map(([name]) => name).sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')))
        : sortedEntries(colourCounts).map(([name]) => name);
      const colourMap = new Map(colourCategories.map((name, index) => [name, COLORS[index % COLORS.length]]));
      const gradientDefinitions = [];
      const pointFill = (item, index) => {
        if (dimensionColorMode === 'none') return '#0f766e';
        if (!item.colourCategories.length) return '#cbd5e1';
        if (item.colourCategories.length === 1) return colourMap.get(item.colourCategories[0]);
        const id = `codicology-dimension-gradient-${index}`;
        const step = 100 / item.colourCategories.length;
        gradientDefinitions.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${item.colourCategories.map((name, categoryIndex) => {
          const start = categoryIndex * step;
          const end = (categoryIndex + 1) * step;
          const color = colourMap.get(name);
          return `<stop offset="${start}%" stop-color="${color}"/><stop offset="${end}%" stop-color="${color}"/>`;
        }).join('')}</linearGradient>`);
        return `url(#${id})`;
      };
      const pointMarkup = scatter.map((item, index) => {
        const fill = pointFill(item, index);
        return `<circle class="codicology-scatter-point" data-record-id="${esc(item.record.rec_ID)}" data-width="${item.width}" data-height="${item.height}" data-colour-values="${esc(item.colourCategories.join('|'))}" tabindex="0" role="img" aria-label="${esc(item.record.rec_Title || `Manuscript ${item.record.rec_ID}`)}: ${formatNumber(item.height)} by ${formatNumber(item.width)} millimetres, height by width${item.colourCategories.length ? `; ${item.colourCategories.join(', ')}` : ''}" cx="${55 + item.height / maxH * 610}" cy="${315 - item.width / maxW * 285}" r="3" style="fill:${fill}"><title>${esc(item.record.rec_Title || `Manuscript ${item.record.rec_ID}`)} — ${formatNumber(item.height)} × ${formatNumber(item.width)} mm (height × width)${item.colourCategories.length ? ` — ${item.colourCategories.join(', ')}` : ''}</title></circle>`;
      }).join('');
      mount.innerHTML = `
        ${methodIntro('Materials & Format', 'Material choices, manuscript page format, and their relationships with colophons and textual contents.', 'Production Units for material analyses; Manuscripts for page dimensions. A manuscript linked to several Production Units is intentionally represented once in each Production-Unit context when dimensions and production features are compared.')}
        ${metricGrid([
          { value: materialValues.length, label: 'Production Units with known material', note: `${(materialValues.length / Math.max(1, pus.length) * 100).toFixed(1)}% coverage` },
          { value: dimensions.length, label: 'Manuscripts with height and width', note: `${(dimensions.length / Math.max(1, manuscripts.length) * 100).toFixed(1)}% coverage` },
          { value: `${formatNumber(median(dimensions.map(item => item.height)))} × ${formatNumber(median(dimensions.map(item => item.width)))} mm`, label: 'Median manuscript page size' }
        ])}
        <div class="codicology-grid">
          ${card('codicology-material-distribution', 'Known material distribution', 'codicology-material-distribution.png', distribution(countBy(materialValues), materialValues.length, 'Production Units'), 'Bar length is the share of all Production Units with a known controlled material value.')}
          ${card('codicology-material-century', 'Materials by century', 'codicology-materials-by-century.png', stackedRows(materialRows, categories, 'Production Units'), 'Each bar shows the composition of known material observations within that century; uncertain date labels contribute to every plausible century.')}
        </div>
        ${card('codicology-format-scatter', 'Manuscript page dimensions', 'codicology-manuscript-dimensions.png', `<div class="codicology-scatter-controls"><label for="codicology-scatter-colour">Colour points by</label><select id="codicology-scatter-colour" class="codicology-scatter-colour-select"><option value="century"${dimensionColorMode === 'century' ? ' selected' : ''}>Century</option><option value="country"${dimensionColorMode === 'country' ? ' selected' : ''}>Production country</option><option value="order"${dimensionColorMode === 'order' ? ' selected' : ''}>Monastic order</option><option value="none"${dimensionColorMode === 'none' ? ' selected' : ''}>Single colour</option></select></div>
          ${dimensionColorMode !== 'none' ? `<div class="codicology-legend codicology-scatter-legend">${colourCategories.map(name => `<span><i style="background:${colourMap.get(name)}"></i>${esc(name)} (${colourCounts.get(name)})</span>`).join('')}</div><p class="explore-chart-note">Striped points represent manuscripts associated with more than one controlled ${dimensionColorMode === 'century' ? 'century' : dimensionColorMode === 'country' ? 'production country' : 'monastic order'}. Neutral points have no controlled value for the selected colour dimension.</p>` : ''}
          <div class="codicology-scatter-wrap" data-color-mode="${dimensionColorMode}"><svg class="codicology-scatter" viewBox="0 0 700 360" role="img" aria-label="Interactive scatter plot of manuscript height and width in millimetres. Focus or hover over a point for manuscript details.">
            <defs>${gradientDefinitions.join('')}</defs>
            <line x1="55" y1="315" x2="680" y2="315"/><line x1="55" y1="20" x2="55" y2="315"/>
            ${pointMarkup}
            <text x="365" y="350">Height (mm)</text><text x="18" y="175" transform="rotate(-90 18 175)">Width (mm)</text>
          </svg><div class="codicology-scatter-tooltip" role="status" hidden></div></div>`, 'Each point is one Manuscript with known controlled numerical dimensions; dimensions are not inferred from Production Units. Hover over a point, or focus it with the keyboard, to inspect possible outliers.')}
        <div class="codicology-grid">
          ${card('codicology-colophon-material', 'Colophon prevalence by material', 'codicology-colophons-by-material.png', prevalenceBy(pus, materials, pu => explicitBoolean(pu, ['Colophon Presence', 'Colophon presence']), 'colophon presence'), 'This relationship belongs to codicology because it compares an explicitly coded textual feature with physical material.')}
          ${card('codicology-subgenre-material', 'Subgenres by material', 'codicology-subgenres-by-material.png', buildMaterialSubgenreMatrix(pus), 'Counts are distinct linked Production Unit–Text assignments with known controlled material and subgenre. The twelve most frequent known subgenres are displayed.')}
        </div>`;
      bindDimensionScatter(mount);
    }

    function renderQuires(mount) {
      const pus = Core.DATA.pu || [];
      const values = pus.flatMap(quireTypes);
      const categories = sortedEntries(countBy(values)).map(([name]) => name);
      const centuryRows = byMembership(pus, centuries, quireTypes).filter(row => row.label >= 8 && row.label <= 16).sort((a, b) => a.label - b.label);
      const countryRows = byMembership(pus, countries, quireTypes).sort((a, b) => {
        const total = row => [...row.counts.values()].reduce((sum, value) => sum + value, 0);
        return total(b) - total(a);
      }).slice(0, 10);
      const matrixValues = new Map();
      const subgenreTotals = new Map();
      pus.forEach(pu => quireTypes(pu).forEach(quire => relatedTexts(pu).forEach(text => controlled(text, 'Subgenre').forEach(subgenre => {
        matrixValues.set(`${quire}\u0000${subgenre}`, (matrixValues.get(`${quire}\u0000${subgenre}`) || 0) + 1);
        subgenreTotals.set(subgenre, (subgenreTotals.get(subgenre) || 0) + 1);
      }))));
      const subgenres = sortedEntries(subgenreTotals).slice(0, 12).map(([name]) => name);
      mount.innerHTML = `
        ${methodIntro('Quire Construction', 'The distribution and historical context of controlled quire classifications.', 'Production Units. Multi-valued or explicitly mixed quire descriptions are classified as Varia; the controlled Varia category is retained.')}
        ${metricGrid([{ value: values.length, label: 'Production Units with known quire type', note: `${(values.length / Math.max(1, pus.length) * 100).toFixed(1)}% coverage` }, { value: countBy(values).get('Varia') || 0, label: 'Varia classifications' }])}
        <div class="codicology-grid">
          ${card('codicology-quire-distribution', 'Known quire-type distribution', 'codicology-quire-distribution.png', distribution(countBy(values), values.length, 'Production Units'))}
          ${card('codicology-quire-country', 'Quire construction by production country', 'codicology-quires-by-country.png', stackedRows(countryRows, categories, 'country memberships'), 'The ten countries with the most known quire observations are shown. Uncertain places contribute to each plausible country.')}
        </div>
        ${card('codicology-quire-century', 'Quire construction by century', 'codicology-quires-by-century.png', stackedRows(centuryRows, categories, 'Production Units'), 'Bars show within-century composition, rather than scaling each century against the largest category.')}
        ${card('codicology-quire-subgenre', 'Subgenres and quire construction', 'codicology-subgenres-by-quire.png', matrix(categories, subgenres, matrixValues, 'Quire type'), 'Counts are linked Production Unit–Text assignments. The twelve most frequent known subgenres are shown; genre remains available in the Textual Genres networks.')}`;
    }

    function renderLayout(mount) {
      const pus = Core.DATA.pu || [];
      const manuscripts = Core.DATA.ms || [];
      const msDimensions = new Map(manuscripts.map(ms => [String(ms.rec_ID), {
        height: numeric(ms, 'Codex height'), width: numeric(ms, 'Codex width')
      }]));
      const observations = pus.map(pu => {
        const manuscript = resource(pu, 'Manuscript');
        const page = manuscript?.id ? msDimensions.get(String(manuscript.id)) : null;
        const height = numeric(pu, 'justification : height (mm)');
        const width = numeric(pu, 'justification : width (mm)');
        const ratio = page?.height && page?.width && height && width ? (height * width) / (page.height * page.width) : null;
        return { pu, height, width, ratio };
      });
      const knownJustification = observations.filter(item => item.height && item.width);
      const knownRatios = observations.filter(item => Number.isFinite(item.ratio) && item.ratio >= 0.1 && item.ratio <= 0.9);
      const ratioBands = countBy(knownRatios.map(item => item.ratio < .4 ? 'Under 40%' : item.ratio < .55 ? '40–54%' : item.ratio < .7 ? '55–69%' : '70% and over'));
      const materialMatrix = new Map();
      knownRatios.forEach(item => materials(item.pu).forEach(material => {
        const band = item.ratio < .4 ? 'Under 40%' : item.ratio < .55 ? '40–54%' : item.ratio < .7 ? '55–69%' : '70% and over';
        materialMatrix.set(`${material}\u0000${band}`, (materialMatrix.get(`${material}\u0000${band}`) || 0) + 1);
      }));
      const bands = ['Under 40%', '40–54%', '55–69%', '70% and over'];
      mount.innerHTML = `
        ${methodIntro('Page Layout', 'Manuscript page dimensions and Production-Unit-level writing-area measurements are kept distinct.', 'Manuscripts for page dimensions; Production Units for justification and occupied-page ratios. Page dimensions may correctly recur when a Manuscript contains multiple Production Units with different justification.')}
        ${metricGrid([
          { value: knownJustification.length, label: 'Production Units with justification height and width', note: `${(knownJustification.length / Math.max(1, pus.length) * 100).toFixed(1)}% coverage` },
          { value: `${formatNumber(median(knownJustification.map(item => item.height)))} × ${formatNumber(median(knownJustification.map(item => item.width)))} mm`, label: 'Median justification size' },
          { value: `${formatNumber(median(knownRatios.map(item => item.ratio * 100)))}%`, label: 'Median page area occupied', note: `n=${knownRatios.length} linked Production Units` }
        ])}
        <div class="codicology-grid">
          ${card('codicology-layout-ratio', 'Writing-area share of manuscript page', 'codicology-writing-area-share.png', distribution(ratioBands, knownRatios.length, 'Production Units'), 'The ratio is justification area divided by manuscript page area. Values require all four controlled numerical measurements.')}
          ${card('codicology-layout-material', 'Writing-area share by material', 'codicology-writing-area-by-material.png', matrix(['Paper', 'Parchment', 'Hybrid'], bands, materialMatrix, 'Material'), 'Counts are Production Units; manuscript dimensions are joined to each Production Unit by design.')}
        </div>`;
    }

    function renderPractices(mount) {
      const pus = Core.DATA.pu || [];
      const rulingValues = pus.flatMap(pu => controlled(pu, ['ruling_type', 'Ruling']));
      const rulingObserved = pus.filter(pu => controlled(pu, ['ruling_type', 'Ruling']).length > 0).length;
      const rulingCategories = sortedEntries(countBy(rulingValues)).map(([name]) => name);
      const rulingRows = byMembership(pus, centuries, pu => controlled(pu, ['ruling_type', 'Ruling']))
        .filter(row => row.label >= 8 && row.label <= 16).sort((a, b) => a.label - b.label);
      const booleanStats = ['Catchwords', 'Signatures'].map(label => {
        const field = label === 'Catchwords' ? 'catchwords' : 'signatures';
        const observations = pus.map(pu => explicitBoolean(pu, field)).filter(value => value !== null);
        const present = observations.filter(Boolean).length;
        return { label, field, present, observed: observations.length };
      });
      const booleanTable = booleanStats.map(item => {
        const { label, present, observed } = item;
        return `<tr><th scope="row">${label}</th><td>${present}</td><td>${observed}</td><td>${observed ? (present / observed * 100).toFixed(1) : '0.0'}%</td><td>${(observed / Math.max(1, pus.length) * 100).toFixed(1)}%</td></tr>`;
      }).join('');
      mount.innerHTML = `
        ${methodIntro('Production Practices', 'Explicitly coded production features, with observation coverage kept separate from prevalence.', 'Production Units. TRUE/FALSE rates exclude unknown values from both numerator and denominator.')}
        ${metricGrid([
          ...booleanStats.map(item => ({
            value: `${item.observed} / ${pus.length}`,
            label: `${item.label} coverage`,
            note: `${(item.observed / Math.max(1, pus.length) * 100).toFixed(1)}% observed; present in ${item.present} of ${item.observed}`
          })),
          {
            value: `${rulingObserved} / ${pus.length}`,
            label: 'Ruling coverage',
            note: `${(rulingObserved / Math.max(1, pus.length) * 100).toFixed(1)}% with a known controlled method`
          }
        ])}
        <div class="codicology-grid">
          ${card('codicology-production-presence', 'Catchwords and signatures', 'codicology-catchwords-signatures.png', `<div class="codicology-table-wrap"><table class="codicology-matrix"><thead><tr><th>Feature</th><th>Present</th><th>Observed</th><th>Present rate</th><th>Coverage</th></tr></thead><tbody>${booleanTable}</tbody></table></div>`, 'Coverage is the share of all Production Units with an explicit TRUE or FALSE value.')}
          ${card('codicology-ruling-distribution', 'Known ruling-method distribution', 'codicology-ruling-distribution.png', distribution(countBy(rulingValues), rulingValues.length, 'Production Units'))}
        </div>
        ${card('codicology-ruling-century', 'Ruling methods by century', 'codicology-ruling-by-century.png', stackedRows(rulingRows, rulingCategories, 'Production Units'), 'Each bar shows the composition of known ruling observations in that century.')}
        <aside class="codicology-crosslink"><h3>Scribal collaboration</h3><p>Collaboration and collaboration-sequence typologies remain in the Scribes research theme because their primary unit is scribal participation. They are linked here as a complementary production context.</p><a class="explore-action-btn explore-action-btn--primary" href="?mode=scribes&amp;tab=collaboration">Open Scribes → Collaborations</a></aside>`;
    }

    function render(tab, mount) {
      if (!mount) return;
      if (tab === 'materials') renderMaterials(mount);
      else if (tab === 'quires') renderQuires(mount);
      else if (tab === 'layout') renderLayout(mount);
      else if (tab === 'practices') renderPractices(mount);
    }

    return { render };
  }

  return { init };
})();
