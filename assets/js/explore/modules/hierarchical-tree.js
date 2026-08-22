window.ExploreHierarchicalTree = (function() {
  return {
    init: function(Core) {
      const getDATA = () => Core.DATA;
      const getIDX = () => Core.IDX;
      const getREL_INDEX = () => Core.REL_INDEX;
      const MAP = Core.MAP;
      const getRes = Core.getRes || ((rec, field) => null);
      const exportTreeItemAsSvg = Core.exportTreeItemAsSvg;
      const exportTreeItemAsPng = Core.exportTreeItemAsPng;
      const isKnownCategory = Core.isKnownCategory;
      const Codicology = window.ExploreCodicology?.init(Core);
      let tabsInitialized = false;

      function renderStructureTree() {
        const mount = document.getElementById('tree-mount');
        if (!mount) return;

        // Build tree showing MS -> PU -> SU hierarchy.
        const tree = {};
        const allSUs = getDATA().su || [];

        allSUs.forEach(su => {
          const suId = String(su.rec_ID);
          const suTitle = MAP.su?.title(su) || 'Untitled SU';
          if (!isKnownCategory(suTitle)) return;

          let msId = null;
          (su.details || []).forEach(d => {
            const v = d?.value;
            if (v && typeof v === 'object' && v.id && v.type) {
              const toId = String(v.id);
              if (getIDX().ms?.[toId]) msId = toId;
            }
          });

          if (!msId) return;

          const puIds = [];
          const suRels = [...(getREL_INDEX().bySource?.[suId] || []), ...(getREL_INDEX().byTarget?.[suId] || [])];
          for (const rel of suRels) {
            const src = getRes(rel, 'Source record');
            const tgt = getRes(rel, 'Target record');
            const otherId = String(src?.id) === suId ? String(tgt?.id) : String(src?.id);
            if (getIDX().pu?.[otherId] && !puIds.includes(otherId)) puIds.push(otherId);
          }

          if (!puIds.length) return;

          if (!tree[msId]) {
            const ms = getIDX().ms[msId];
            const msTitle = ms ? (MAP.ms?.title(ms) || 'Untitled Manuscript') : 'Untitled Manuscript';
            if (!isKnownCategory(msTitle)) return;
            tree[msId] = {
              type: 'ms',
              title: msTitle,
              children: {}
            };
          }

          puIds.forEach(puId => {
            if (!tree[msId].children[puId]) {
              const pu = getIDX().pu[puId];
              const puTitle = pu ? (MAP.pu?.title(pu) || 'Untitled PU') : 'Untitled PU';
              if (!isKnownCategory(puTitle)) return;
              tree[msId].children[puId] = {
                type: 'pu',
                title: puTitle,
                children: {}
              };
            }

            tree[msId].children[puId].children[suId] = {
              type: 'su',
              title: suTitle,
              allPUs: puIds
            };
          });
        });

        const allPUs = getDATA().pu || [];
        allPUs.forEach(pu => {
          const puId = String(pu.rec_ID);
          const puTitle = MAP.pu?.title(pu) || 'Untitled PU';
          if (!isKnownCategory(puTitle)) return;

          let msId = null;
          (pu.details || []).forEach(d => {
            const v = d?.value;
            if (v && typeof v === 'object' && v.id && v.type) {
              const toId = String(v.id);
              if (getIDX().ms?.[toId]) msId = toId;
            }
          });

          if (!msId) return;

          if (!tree[msId]) {
            const ms = getIDX().ms[msId];
            const msTitle = ms ? (MAP.ms?.title(ms) || 'Untitled Manuscript') : 'Untitled Manuscript';
            if (!isKnownCategory(msTitle)) return;
            tree[msId] = {
              type: 'ms',
              title: msTitle,
              children: {}
            };
          }

          if (!tree[msId].children[puId]) {
            tree[msId].children[puId] = {
              type: 'pu',
              title: puTitle,
              children: {}
            };
          }
        });

        if (!Object.keys(tree).length) {
          mount.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666;">
              <h3 style="margin-bottom: 0.5rem;">Manuscript Structure</h3>
              <p>No hierarchical relationships found in current data</p>
            </div>
          `;
          return;
        }

        const msMetrics = {};
        const puToMSMap = {};

        Object.entries(tree).forEach(([msId, ms]) => {
          Object.keys(ms.children).forEach(puId => {
            if (!puToMSMap[puId]) puToMSMap[puId] = [];
            puToMSMap[puId].push(msId);
          });
        });

        Object.entries(tree).forEach(([msId, ms]) => {
          const puCount = Object.keys(ms.children).length;
          const suCount = Object.values(ms.children).reduce((sum, pu) => sum + Object.keys(pu.children).length, 0);

          let hasCrossMSPU = false;
          Object.keys(ms.children).forEach(puId => {
            let msCountForThisPU = 0;
            Object.values(tree).forEach(otherMs => {
              if (otherMs.children[puId]) msCountForThisPU++;
            });
            if (msCountForThisPU > 1) hasCrossMSPU = true;
          });

          const suToPUMap = {};
          Object.entries(ms.children).forEach(([puId, pu]) => {
            Object.keys(pu.children).forEach(suId => {
              if (!suToPUMap[suId]) suToPUMap[suId] = [];
              suToPUMap[suId].push(puId);
            });
          });
          const hasCrossPUSU = Object.values(suToPUMap).some(pus => pus.length > 1);

          const complexityScore = puCount * 10 + suCount * 2 + (hasCrossMSPU ? 100 : 0) + (hasCrossPUSU ? 50 : 0);

          msMetrics[msId] = { puCount, suCount, hasCrossMSPU, hasCrossPUSU, complexityScore };
        });

        const searchInput = document.getElementById('tree-manuscript-search');
        const searchQuery = (searchInput?.value || '').trim().toLowerCase();
        const filterCrossMSPU = document.getElementById('tree-filter-cross-ms-pu')?.checked || false;
        const filterCrossPUSU = document.getElementById('tree-filter-cross-pu-su')?.checked || false;
        const filterMultiPU = document.getElementById('tree-filter-multi-pu')?.checked || false;

        let filteredTree = {};
        Object.entries(tree).forEach(([msId, ms]) => {
          const metrics = msMetrics[msId];
          if (searchQuery && !ms.title.toLowerCase().includes(searchQuery)) return;
          const anyFilterActive = filterCrossMSPU || filterCrossPUSU || filterMultiPU;
          if (anyFilterActive) {
            let matchesFilter = false;
            if (filterCrossMSPU && metrics.hasCrossMSPU) matchesFilter = true;
            if (filterCrossPUSU && metrics.hasCrossPUSU) matchesFilter = true;
            if (filterMultiPU && metrics.puCount >= 3) matchesFilter = true;
            if (!matchesFilter) return;
          }
          filteredTree[msId] = ms;
        });

        const sortSelect = document.getElementById('tree-sort-select');
        const sortBy = sortSelect?.value || 'default';
        let sortedEntries = Object.entries(filteredTree);

        if (sortBy === 'most-pus') {
          sortedEntries.sort((a, b) => msMetrics[b[0]].puCount - msMetrics[a[0]].puCount);
        } else if (sortBy === 'most-sus') {
          sortedEntries.sort((a, b) => msMetrics[b[0]].suCount - msMetrics[a[0]].suCount);
        } else if (sortBy === 'most-complex') {
          sortedEntries.sort((a, b) => msMetrics[b[0]].complexityScore - msMetrics[a[0]].complexityScore);
        } else {
          sortedEntries.sort((a, b) => a[1].title.localeCompare(b[1].title));
        }

        if (!window.treeDisplayCount) window.treeDisplayCount = 10;

        const totalManuscripts = sortedEntries.length;
        const totalPUs = sortedEntries.reduce((sum, [, ms]) => sum + Object.keys(ms.children).length, 0);
        const totalSUs = sortedEntries.reduce((sum, [, ms]) => sum + Object.values(ms.children).reduce((s, pu) => s + Object.keys(pu.children).length, 0), 0);

        const displayedTree = sortedEntries.slice(0, window.treeDisplayCount);
        const remainingCount = totalManuscripts - displayedTree.length;

        const treeHTML = displayedTree.map(([msId, ms], msIdx) => {
          const metrics = msMetrics[msId];
          const puCount = metrics.puCount;
          const suCount = metrics.suCount;

          const puHTML = Object.entries(ms.children).map(([puId, pu], puIdx) => {
            const puSuCount = Object.keys(pu.children).length;
            const puMsList = puToMSMap[puId] || [];
            const isCrossMSPU = puMsList.length > 1;
            const otherMSs = puMsList.filter(id => id !== msId);
            const otherMSTitles = otherMSs.map(otherId => {
              const otherMS = tree[otherId];
              return otherMS ? otherMS.title : `Manuscript ${otherId}`;
            });

            const suHTML = Object.entries(pu.children).map(([suId, su], suIdx) => {
              const suPUs = su.allPUs || [];
              const isCrossPUSU = suPUs.length > 1;
              const otherPUs = suPUs.filter(id => id !== puId);
              const otherPUTitles = otherPUs.map(otherId => {
                const otherPU = ms.children[otherId];
                return otherPU ? otherPU.title : `Production unit ${otherId}`;
              });

              const suStyle = isCrossPUSU
                ? 'margin-left: 3rem; padding: 0.75rem 0.75rem 0.75rem 1rem; background: #fff8eb; border-left: 3px dashed #ff9800; border-right: 3px dashed #ff9800; margin-top: 0.5rem; border-radius: 0.2rem; display: flex; align-items: center; gap: 0.5rem; position: relative;'
                : 'margin-left: 3rem; padding: 0.75rem 0.75rem 0.75rem 1rem; background: #fffbea; border-left: 3px solid #f4d03f; margin-top: 0.5rem; border-radius: 0.2rem; display: flex; align-items: center; gap: 0.5rem;';

              const crossPUIndicator = isCrossPUSU
                ? `<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #ff9800; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;">SPANS ${suPUs.length} PUs</div>
                   <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,152,0,0.1); border-radius: 0.25rem; font-size: 0.75rem; color: #e65100; width: 100%;"><strong>Cross-PU Scribal Unit:</strong> This scribal unit also appears in:<br/>${otherPUTitles.map(t => `<span style="margin-left: 1rem;">→ ${t}</span>`).join('<br/>')}</div>`
                : '';

              return `
                <div style="${suStyle}">
                  <span style="font-size: 0.85rem; color: #999; font-weight: 600;">SU #${suIdx + 1}</span>
                  <a href="?mode=browse&type=su&id=${suId}" style="font-weight: 600; font-size: 0.875rem; color: #333; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;" onmouseover="this.style.color='#2196F3'" onmouseout="this.style.color='#333'">
                    ${su.title}
                  </a>
                  ${crossPUIndicator}
                </div>
              `;
            }).join('');

            const puStyle = isCrossMSPU
              ? 'margin-left: 1.5rem; padding: 0.75rem; background: #faf6ec; border-left: 3px dashed #c4941f; border-right: 3px dashed #c4941f; margin-top: 0.75rem; border-radius: 0.2rem; position: relative;'
              : 'margin-left: 1.5rem; padding: 0.75rem; background: #ffebee; border-left: 3px solid #e74c3c; margin-top: 0.75rem; border-radius: 0.2rem;';

            const crossMSIndicator = isCrossMSPU
              ? `<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #c4941f; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 0.25rem;">SPANS ${puMsList.length} MSS</div>
                 <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(196, 148, 31,0.1); border-radius: 0.25rem; font-size: 0.75rem; color: #7b1fa2;"><strong>Cross-Manuscript PU:</strong> This production unit also appears in:<br/>${otherMSTitles.map(t => `<span style="margin-left: 1rem;">→ ${t}</span>`).join('<br/>')}</div>`
              : '';

            return `
              <div style="${puStyle}">
                ${isCrossMSPU ? crossMSIndicator : ''}
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <span style="font-size: 0.85rem; color: #999; font-weight: 600;">PU #${puIdx + 1}</span>
                  <a href="?mode=browse&type=pu&id=${puId}" style="font-weight: 600; font-size: 0.95rem; color: #333; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;" onmouseover="this.style.color='#e74c3c'" onmouseout="this.style.color='#333'">
                    ${pu.title} <span style="font-size: 0.7rem; color: #999;"></span>
                  </a>
                </div>
                ${puSuCount > 0 ? `<div style="font-size: 0.75rem; color: #999; margin-bottom: 0.5rem;">Contains ${puSuCount} Scribal Unit${puSuCount !== 1 ? 's' : ''}</div>` : '<div style="font-size: 0.75rem; color: #999; font-style: italic;">No scribal units</div>'}
                ${suHTML}
              </div>
            `;
          }).join('');

          return `
            <div class="manuscript-tree-item" data-ms-id="${msId}" data-ms-title="${ms.title.replace(/"/g, '&quot;')}" style="padding: 1.25rem; background: #f7f9fb; border-left: 3px solid ${metrics.complexityScore > 100 ? '#e74c3c' : '#3498db'}; margin-bottom: 1.25rem; border-radius: 0.2rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span style="font-size: 0.9rem; color: #999; font-weight: 700;">MS #${msIdx + 1}</span>
                  <a href="?mode=browse&type=ms&id=${msId}" style="font-weight: 700; font-size: 1.05rem; color: #1a1a1a; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;" onmouseover="this.style.color='#2196F3'" onmouseout="this.style.color='#1a1a1a'">
                    ${ms.title}
                  </a>
                  ${metrics.hasCrossMSPU ? '<span style="padding: 0.125rem 0.375rem; background: #c4941f; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">CROSS-MS</span>' : ''}
                  ${metrics.hasCrossPUSU ? '<span style="padding: 0.125rem 0.375rem; background: #f44336; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">CROSS-PU</span>' : ''}
                  ${metrics.puCount >= 5 ? '<span style="padding: 0.125rem 0.375rem; background: #2196f3; color: white; border-radius: 0.25rem; font-size: 0.65rem; font-weight: 600;">MULTI-PU</span>' : ''}
                </div>
                <div style="display: flex; gap: 0.25rem;">
                  <button class="explore-export-btn tree-export-svg-btn" data-ms-id="${msId}" title="Export this manuscript tree as SVG">Export SVG</button>
                  <button class="explore-export-btn tree-export-png-btn" data-ms-id="${msId}" title="Export this manuscript tree as PNG">Export PNG</button>
                </div>
              </div>
              <div style="display: flex; gap: 1.5rem; font-size: 0.8rem; color: #666; margin-bottom: 0.75rem; padding: 0.5rem; background: rgba(255,255,255,0.5); border-radius: 0.25rem;">
                <span style="display: flex; align-items: center; gap: 0.25rem;"><strong style="color: #e74c3c;">${puCount}</strong> Production Unit${puCount !== 1 ? 's' : ''}</span>
                <span style="display: flex; align-items: center; gap: 0.25rem;"><strong style="color: #f4d03f;">${suCount}</strong> Scribal Unit${suCount !== 1 ? 's' : ''}</span>
                <span style="display: flex; align-items: center; gap: 0.25rem;"><strong style="color: #c4941f;">Complexity:</strong> ${metrics.complexityScore}</span>
              </div>
              ${puHTML}
            </div>
          `;
        }).join('');

        mount.innerHTML = `
          <div style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h3 style="margin: 0; font-size: 1.1rem;">Manuscript Codicological Hierarchy</h3>
              <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: #666;">
                <span><strong>${totalManuscripts}</strong> MS</span>
                <span><strong>${totalPUs}</strong> PU</span>
                <span><strong>${totalSUs}</strong> SU</span>
              </div>
            </div>
            <p style="color: #666; font-size: 0.875rem; margin-bottom: 1rem;">
              ${searchQuery ? `Showing ${totalManuscripts} manuscript${totalManuscripts !== 1 ? 's' : ''} matching "${searchQuery}"` : 'Physical structure showing Manuscripts containing Production Units containing Scribal Units'}
            </p>
            ${treeHTML}
            ${remainingCount > 0 ? `
              <div style="text-align: center; margin-top: 1.5rem;">
                <button id="tree-show-more" class="explore-action-btn explore-action-btn--primary">Show More (${remainingCount} remaining)</button>
              </div>
            ` : displayedTree.length > 10 ? `
              <div style="text-align: center; margin-top: 1.5rem;">
                <button id="tree-show-less" class="explore-action-btn">Show Less</button>
              </div>
            ` : ''}
          </div>
        `;

        const showMoreBtn = document.getElementById('tree-show-more');
        const showLessBtn = document.getElementById('tree-show-less');

        if (showMoreBtn) {
          showMoreBtn.addEventListener('click', () => {
            window.treeDisplayCount += 10;
            renderStructureTree();
          });
          showMoreBtn.addEventListener('mouseenter', () => {
            showMoreBtn.style.transform = 'translateY(-2px)';
            showMoreBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          });
          showMoreBtn.addEventListener('mouseleave', () => {
            showMoreBtn.style.transform = 'translateY(0)';
            showMoreBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          });
        }

        if (showLessBtn) {
          showLessBtn.addEventListener('click', () => {
            window.treeDisplayCount = 10;
            renderStructureTree();
            mount.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          showLessBtn.addEventListener('mouseenter', () => {
            showLessBtn.style.transform = 'translateY(-2px)';
            showLessBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          });
          showLessBtn.addEventListener('mouseleave', () => {
            showLessBtn.style.transform = 'translateY(0)';
            showLessBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          });
        }

        const svgExportBtns = mount.querySelectorAll('.tree-export-svg-btn');
        const pngExportBtns = mount.querySelectorAll('.tree-export-png-btn');

        svgExportBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const msId = btn.getAttribute('data-ms-id');
            const treeItem = btn.closest('.manuscript-tree-item');
            if (treeItem && typeof exportTreeItemAsSvg === 'function') {
              exportTreeItemAsSvg(treeItem, msId);
            }
          });
        });

        pngExportBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const msId = btn.getAttribute('data-ms-id');
            const treeItem = btn.closest('.manuscript-tree-item');
            if (treeItem && typeof exportTreeItemAsPng === 'function') {
              exportTreeItemAsPng(treeItem, msId);
            }
          });
        });
      }

      function activeTab() {
        return document.querySelector('.tree-tab-btn.is-on')?.dataset.tab || 'structure';
      }

      function renderTab(tab) {
        const structurePanel = document.getElementById('tree-structure-panel');
        const analysisMount = document.getElementById('codicology-mount');
        if (!structurePanel || !analysisMount) return;
        const showStructure = tab === 'structure';
        structurePanel.hidden = !showStructure;
        analysisMount.hidden = showStructure;
        if (showStructure) renderStructureTree();
        else Codicology?.render(tab, analysisMount);
      }

      function initializeTabs() {
        if (tabsInitialized) return;
        const tabList = document.querySelector('#mode-tree .tree-tabs');
        const panel = document.getElementById('codicology-mount');
        Core.enhanceExploreTabList(tabList);
        document.querySelectorAll('.tree-tab-btn').forEach(button => {
          button.addEventListener('click', () => {
            const tab = button.dataset.tab || 'structure';
            document.querySelectorAll('.tree-tab-btn').forEach(candidate => candidate.classList.toggle('is-on', candidate === button));
            Core.syncExploreTabList(tabList, button, tab === 'structure' ? document.getElementById('tree-structure-panel') : panel);
            Core.updateExploreUrl('tree', tab);
            renderTab(tab);
          });
        });
        const selected = document.querySelector('.tree-tab-btn.is-on');
        if (selected) {
          Core.syncExploreTabList(tabList, selected, selected.dataset.tab === 'structure' ? document.getElementById('tree-structure-panel') : panel);
        }
        tabsInitialized = true;
      }

      function buildHierarchicalTree() {
        initializeTabs();
        renderTab(activeTab());
      }

      return { buildHierarchicalTree };
    }
  };
})();
