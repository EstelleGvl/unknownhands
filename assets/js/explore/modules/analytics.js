window.ExploreAnalytics = (function() {
  return {
    init: function(Core) {
      const getDATA = () => Core.DATA;
      const getIDX = () => Core.IDX;
      const getREL_INDEX = () => Core.REL_INDEX;
      const MAP = Core.MAP;
      const getVal = Core.getVal;
      const getRes = Core.getRes;
      const getControlledValsAll = Core.getControlledValsAll;
      const isKnownCategory = Core.isKnownCategory;

      function buildAnalytics() {
        const mount = document.getElementById('analytics-mount');
        if (!mount) return;

        const records = [];
        Object.entries(getDATA() || {}).forEach(([entityType, entityRecords]) => {
          if (!Array.isArray(entityRecords)) return;
          entityRecords.forEach(record => records.push({ ...record, rty: entityType }));
        });

        buildStatisticalDashboard(mount, records);
      }

      document.getElementById('entity-filter-select')?.addEventListener('change', buildAnalytics);

      function buildStatisticalDashboard(mount, records) {
        const entityFilter = document.getElementById('entity-filter-select')?.value || 'su';
        const list = records.filter(record => record.rty === entityFilter);
        let cards = [];

        if (entityFilter === 'su') {
          cards = [
            buildStatsCard('Total Records', list.length),
            buildStatsCard('Date Range', getDateRange(list)),
            buildStatsCard('With Script', countKnown(list, 'Normalised script(s)')),
            buildStatsCard('High-certainty Attributions', countHighCertaintyScribes(list))
          ];
        } else if (entityFilter === 'ms') {
          const folioStats = getFolioStatistics(list);
          cards = [
            buildStatsCard('Total Records', list.length),
            buildStatsCard('Mean Folios', formatNumber(folioStats.mean)),
            buildStatsCard('Median Folios', formatNumber(folioStats.median)),
            buildStatsCard('Folio Sample Size', folioStats.n),
            buildStatsCard('With Digitization Data', countKnown(list, 'Digitization Status'))
          ];
        } else if (entityFilter === 'pu') {
          cards = [
            buildStatsCard('Total Records', list.length),
            buildStatsCard('Date Range', getDateRange(list)),
            buildStatsCard('With Country', countKnown(list, 'PU country'))
          ];
        } else if (entityFilter === 'hp') {
          cards = [
            buildStatsCard('Total Records', list.length),
            buildStatsCard('With Gender Data', countKnown(list, 'Gender'))
          ];
        } else if (entityFilter === 'tx') {
          cards = [
            buildStatsCard('Total Records', list.length),
            buildStatsCard('With Genre', countKnown(list, 'Genre')),
            buildStatsCard('With Subgenre', countKnown(list, 'Subgenre'))
          ];
        } else if (entityFilter === 'hi') {
          cards = [
            buildStatsCard('Total Records', list.length),
            buildStatsCard('With Type', countKnown(list, 'Institution type')),
            buildStatsCard('Countries', uniqueKnownCount(list, 'Country')),
            buildStatsCard('Cities', uniqueKnownCount(list, 'City'))
          ];
        } else if (entityFilter === 'mi') {
          cards = [
            buildStatsCard('Total Records', list.length),
            buildStatsCard('With Order', countKnown(list, 'Religious order')),
            buildStatsCard('With Type', countKnown(list, 'Type of monastery')),
            buildStatsCard('Countries', uniqueKnownCount(list, 'Country'))
          ];
        }

        const charts = [];
        if (entityFilter === 'su' || entityFilter === 'pu') {
          charts.push(chartCard(entityFilter, 'Temporal Distribution', buildTemporalChart(list), 'temporal-distribution'));
        }
        if (entityFilter === 'su') {
          charts.push(chartCard(entityFilter, 'Script Distribution', buildFieldDistributionChart(list, 'Normalised script(s)'), 'script-distribution'));
          charts.push(chartCard(entityFilter, 'Colophon Language Distribution', buildFieldDistributionChart(list, 'Colophon language'), 'colophon-language-distribution'));
        } else if (entityFilter === 'ms') {
          charts.push(chartCard(entityFilter, 'Folio-count Distribution', buildFolioDistributionChart(list), 'folio-count-distribution'));
          charts.push(chartCard(entityFilter, 'Holding Institution Distribution', buildFieldDistributionChart(list, 'Holding Institution', true), 'holding-institution-distribution'));
          charts.push(chartCard(entityFilter, 'Digitization Status', buildFieldDistributionChart(list, 'Digitization Status'), 'digitization-status'));
        } else if (entityFilter === 'hp') {
          charts.push(chartCard(entityFilter, 'Gender Distribution', buildFieldDistributionChart(list, 'Gender'), 'gender-distribution'));
        } else if (entityFilter === 'tx') {
          charts.push(chartCard(entityFilter, 'Genre Distribution', buildFieldDistributionChart(list, 'Genre'), 'genre-distribution'));
          charts.push(chartCard(entityFilter, 'Subgenre Distribution', buildFieldDistributionChart(list, 'Subgenre'), 'subgenre-distribution'));
        } else if (entityFilter === 'pu') {
          charts.push(chartCard(entityFilter, 'Country Distribution', buildFieldDistributionChart(list, 'PU country'), 'country-distribution'));
          charts.push(chartCard(entityFilter, 'Material Distribution', buildFieldDistributionChart(list, 'Material'), 'material-distribution'));
        } else if (entityFilter === 'hi') {
          charts.push(chartCard(entityFilter, 'Country Distribution', buildFieldDistributionChart(list, 'Country'), 'country-distribution'));
          charts.push(chartCard(entityFilter, 'Institution Type Distribution', buildFieldDistributionChart(list, 'Institution type'), 'institution-type-distribution'));
        } else if (entityFilter === 'mi') {
          charts.push(chartCard(entityFilter, 'Country Distribution', buildFieldDistributionChart(list, 'Country'), 'country-distribution'));
          charts.push(chartCard(entityFilter, 'Religious Order Distribution', buildFieldDistributionChart(list, 'Religious order'), 'religious-order-distribution'));
        }

        mount.innerHTML = `
          <div class="explore-metric-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1rem;margin-bottom:1.5rem;">
            ${cards.join('')}
          </div>
          ${charts.join('')}`;
      }

      function chartCard(entityType, title, content, slug) {
        const id = `analytics-${entityType}-${slug}`;
        return `
          <section id="${id}" class="explore-visualization-card" style="margin-top:1.5rem;padding:1rem;">
            <div class="explore-viz-card-header" style="margin-bottom:.75rem;">
              <h3 style="margin:0;font-size:1.1rem;">${title}</h3>
              ${createExportButton(id, `${id}.png`)}
            </div>
            ${content}
          </section>`;
      }

      function buildStatsCard(label, value) {
        return `
          <div class="explore-metric-card">
            <div style="font-size:2rem;font-weight:700;margin-bottom:.25rem;">${value}</div>
            <div style="font-size:.875rem;">${label}</div>
          </div>`;
      }

      function countKnown(list, fieldName) {
        return list.filter(record => getControlledValsAll(record, fieldName).length > 0).length;
      }

      function uniqueKnownCount(list, fieldName) {
        return new Set(list.flatMap(record => getControlledValsAll(record, fieldName))).size;
      }

      function getDateRange(list) {
        const years = [];
        list.forEach(record => {
          ['Normalized terminus post quem', 'Normalized terminus ante quem'].forEach(field => {
            const value = getVal(record, field);
            if (!isKnownCategory(value)) return;
            const matches = String(value).match(/\d{3,4}/g) || [];
            matches.map(Number).filter(year => year >= 700 && year <= 1700).forEach(year => years.push(year));
          });
        });
        return years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '—';
      }

      function getFolioStatistics(list) {
        const values = list.map(record => Number.parseFloat(getVal(record, 'Number of folios')))
          .filter(value => Number.isFinite(value) && value > 0);
        return {
          n: values.length,
          mean: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
          median: median(values)
        };
      }

      function median(values) {
        if (!values.length) return null;
        const sorted = [...values].sort((a, b) => a - b);
        const midpoint = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[midpoint] : (sorted[midpoint - 1] + sorted[midpoint]) / 2;
      }

      function formatNumber(value) {
        if (!Number.isFinite(value)) return '—';
        return Number.isInteger(value) ? String(value) : value.toFixed(1);
      }

      function countHighCertaintyScribes(list) {
        return list.filter(record => {
          const relationships = getREL_INDEX().bySource?.[String(record.rec_ID)] || [];
          return relationships.some(relationship => {
            const type = String(getVal(relationship, 'Relationship type') || '').toLowerCase();
            const certainty = String(getVal(relationship, 'scribe certainty') || '').toLowerCase();
            return type.includes('scribe') && certainty === 'high';
          });
        }).length;
      }

      function collectFieldCounts(list, fieldName, isResource) {
        const counts = new Map();
        list.forEach(record => {
          let values = [];
          if (isResource) {
            const resource = getRes(record, fieldName);
            values = resource ? [resource.title] : [];
          } else {
            values = getControlledValsAll(record, fieldName);
          }
          values.filter(isKnownCategory).forEach(value => {
            const key = String(value).trim();
            counts.set(key, (counts.get(key) || 0) + 1);
          });
        });
        return counts;
      }

      function buildFieldDistributionChart(list, fieldName, isResource = false) {
        const counts = collectFieldCounts(list, fieldName, isResource);
        const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
        if (!entries.length) return '<p class="explore-empty-state">No known data available.</p>';
        const total = entries.reduce((sum, entry) => sum + entry[1], 0);
        const visible = entries.slice(0, 12);
        const rows = visible.map(([label, count]) => {
          const percentage = (count / total) * 100;
          return `
            <div class="analytics-distribution-row">
              <div class="analytics-distribution-label"><span>${Core.esc(label)}</span><span>${count.toLocaleString()} · ${percentage.toFixed(1)}%</span></div>
              <div class="analytics-distribution-track"><div class="analytics-distribution-fill" style="width:${percentage}%;"></div></div>
            </div>`;
        }).join('');
        const remainder = entries.length > visible.length ? `<p class="explore-chart-note">Showing 12 of ${entries.length} known categories.</p>` : '';
        return `<div class="analytics-distribution-chart">${rows}${remainder}</div>`;
      }

      function buildFolioDistributionChart(list) {
        const values = list.map(record => Number.parseFloat(getVal(record, 'Number of folios')))
          .filter(value => Number.isFinite(value) && value > 0);
        if (!values.length) return '<p class="explore-empty-state">No known folio counts are available.</p>';
        const bins = [
          ['1–49', 1, 49], ['50–99', 50, 99], ['100–199', 100, 199],
          ['200–299', 200, 299], ['300–499', 300, 499], ['500+', 500, Infinity]
        ];
        const rows = bins.map(([label, min, max]) => {
          const count = values.filter(value => value >= min && value <= max).length;
          const percentage = (count / values.length) * 100;
          return `
            <div class="analytics-distribution-row">
              <div class="analytics-distribution-label"><span>${label} folios</span><span>${count} · ${percentage.toFixed(1)}%</span></div>
              <div class="analytics-distribution-track"><div class="analytics-distribution-fill" style="width:${percentage}%;"></div></div>
            </div>`;
        }).join('');
        return `<div class="analytics-distribution-chart">${rows}<p class="explore-chart-note">n=${values.length}; unknown and non-positive values are excluded.</p></div>`;
      }

      function parseCenturies(value) {
        if (!isKnownCategory(value)) return [];
        const text = String(value).replace(/[–—]/g, '-');
        const range = text.match(/(\d{1,2})\s*(?:st|nd|rd|th)?\s*-\s*(\d{1,2})/i);
        if (range) {
          const start = Number(range[1]);
          const end = Number(range[2]);
          if (start <= end && end - start <= 20) return Array.from({ length: end - start + 1 }, (_, index) => start + index);
        }
        return [...new Set((text.match(/\d{1,2}/g) || []).map(Number))];
      }

      function buildTemporalChart(list) {
        const counts = new Map();
        list.forEach(record => {
          const centuries = getControlledValsAll(record, 'Normalized century of production')
            .flatMap(parseCenturies).filter(century => century >= 8 && century <= 16);
          [...new Set(centuries)].forEach(century => counts.set(century, (counts.get(century) || 0) + 1));
        });
        const entries = [...counts.entries()].sort((a, b) => a[0] - b[0]);
        if (!entries.length) return '<p class="explore-empty-state">No known century data available.</p>';
        const total = entries.reduce((sum, entry) => sum + entry[1], 0);
        const rows = entries.map(([century, count]) => {
          const percentage = (count / total) * 100;
          return `
            <div class="analytics-distribution-row">
              <div class="analytics-distribution-label"><span>${century}th century</span><span>${count} · ${percentage.toFixed(1)}%</span></div>
              <div class="analytics-distribution-track"><div class="analytics-distribution-fill" style="width:${percentage}%;"></div></div>
            </div>`;
        }).join('');
        return `<div class="analytics-distribution-chart">${rows}<p class="explore-chart-note">Uncertain multi-century dates contribute once to every stated century; unknown dates are excluded.</p></div>`;
      }

      return { buildAnalytics };
    }
  };
})();
