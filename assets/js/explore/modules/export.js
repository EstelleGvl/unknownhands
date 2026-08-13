window.ExploreExport = (function(){
function init(Core) {

/* ---------- PNG Export Utilities ---------- */
/**
 * Convert an HTML element to PNG and download
 * @param {HTMLElement} element - The element to convert
 * @param {string} filename - Name for the downloaded file
 */
async function exportElementToPNG(element, filename) {
  try {
    // Find all export buttons and hide them temporarily
    const exportButtons = element.querySelectorAll('[id^="export-"], .export-btn');
    exportButtons.forEach(btn => btn.style.visibility = 'hidden');
    
    // Check if element contains an SVG and adjust viewBox if needed
    const svgElement = element.querySelector('svg');
    let originalViewBox = null;
    let originalPreserveAspectRatio = null;
    let originalTransform = null;
    let zoomInstance = null;
    
    if (svgElement) {
      // Store original values
      originalViewBox = svgElement.getAttribute('viewBox');
      originalPreserveAspectRatio = svgElement.getAttribute('preserveAspectRatio');
      
      // Get and store the zoom instance to reset it
      const gElement = svgElement.querySelector('g');
      if (gElement) {
        originalTransform = gElement.getAttribute('transform');
        
        // Reset zoom to identity (no transform)
        try {
          const d3Svg = d3.select(svgElement);
          if (d3Svg.node().__zoom) {
            // Store zoom state to restore later
            zoomInstance = { ...d3Svg.node().__zoom };
            // Reset to no transform
            d3Svg.call(d3.zoom().transform, d3.zoomIdentity);
          }
        } catch (e) {
        }
      }
      
      // Wait for transform reset to take effect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Calculate bounds from node positions (D3 uses transform on g elements, not cx/cy)
      // Only do this for collaboration network
      const isCollabNetwork = element.id === 'collab-network-wrapper' || element.closest('#collab-network-wrapper');
      if (isCollabNetwork) {
        try {
          const nodeGroups = svgElement.querySelectorAll('.network-node');
          if (nodeGroups.length > 0) {
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            
            nodeGroups.forEach(nodeGroup => {
              const transform = nodeGroup.getAttribute('transform');
              if (transform) {
                const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
                if (match) {
                  const x = parseFloat(match[1]);
                  const y = parseFloat(match[2]);
                  
                  // Get radius from child circle
                  const circle = nodeGroup.querySelector('circle');
                  const r = circle ? parseFloat(circle.getAttribute('r')) || 10 : 10;
                  
                  // Get label height
                  const label = nodeGroup.querySelector('.network-label');
                  const labelY = label ? parseFloat(label.getAttribute('y')) || 20 : 20;
                  
                  if (!isNaN(x) && !isNaN(y)) {
                    // Account for node radius, label position, and text width
                    minX = Math.min(minX, x - r - 60); // Extra space for text width
                    maxX = Math.max(maxX, x + r + 60);
                    minY = Math.min(minY, y - r - 10);
                    maxY = Math.max(maxY, y + labelY + 10);
                  }
                }
              }
            });
            
            if (minX !== Infinity && maxX !== -Infinity) {
              // Add generous padding around the content
              const padding = 300;
              minX -= padding;
              minY -= padding;
              const width = (maxX - minX) + (padding * 2);
              const height = (maxY - minY) + (padding * 2);
              
              // Set new viewBox to encompass all content
              svgElement.setAttribute('viewBox', `${minX} ${minY} ${width} ${height}`);
              svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
              
              // Set explicit dimensions for html2canvas to properly capture
              // Use the viewBox aspect ratio to calculate appropriate export dimensions
              const exportWidth = Math.min(width, 3000); // Cap at 3000px width
              const exportHeight = (exportWidth * height) / width;
              svgElement.style.width = `${exportWidth}px`;
              svgElement.style.height = `${exportHeight}px`;
              svgElement.style.minHeight = 'unset';
            }
          }
        } catch (e) {
        }
      }
    }
    
    // Find the title element (h3 or h4 within the element or its wrapper)
    let titleText = '';
    let titleElement = element.querySelector('h3, h4');
    
    // If not found in element, look in parent wrapper
    if (!titleElement) {
      const wrapper = element.closest('[id$="-wrapper"]');
      if (wrapper) {
        titleElement = wrapper.querySelector('h3, h4');
      }
    }
    
    if (titleElement) {
      titleText = titleElement.textContent.trim();
    }
    
    // Create a container with title
    const exportContainer = document.createElement('div');
    exportContainer.style.padding = '20px';
    exportContainer.style.backgroundColor = '#ffffff';
    
    if (titleText) {
      const titleDiv = document.createElement('div');
      titleDiv.textContent = titleText;
      titleDiv.style.fontSize = '18px';
      titleDiv.style.fontWeight = '700';
      titleDiv.style.marginBottom = '15px';
      titleDiv.style.color = '#1e293b';
      exportContainer.appendChild(titleDiv);
    }
    
    const clonedElement = element.cloneNode(true);
    // Remove title and buttons from cloned content
    const clonedTitle = clonedElement.querySelector('h3, h4');
    if (clonedTitle) clonedTitle.remove();
    const clonedButtons = clonedElement.querySelectorAll('[id^="export-"]');
    clonedButtons.forEach(btn => btn.remove());
    
    exportContainer.appendChild(clonedElement);
    
    document.body.appendChild(exportContainer);
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    document.body.removeChild(exportContainer);
    
    // Restore original SVG attributes and zoom state
    if (svgElement) {
      if (originalViewBox !== null) {
        svgElement.setAttribute('viewBox', originalViewBox);
      }
      if (originalPreserveAspectRatio !== null) {
        svgElement.setAttribute('preserveAspectRatio', originalPreserveAspectRatio);
      }
      
      // Restore original style dimensions
      // Only apply collaboration network specific styles if this is the collaboration network
      const isCollabNetwork = element.id === 'collab-network-wrapper' || element.closest('#collab-network-wrapper');
      if (isCollabNetwork) {
        svgElement.style.width = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.minHeight = '800px';
      } else {
        // For other charts, restore standard dimensions
        svgElement.style.width = '';
        svgElement.style.height = '';
        svgElement.style.minHeight = '';
      }
      
      // Restore zoom transform
      if (zoomInstance) {
        try {
          const d3Svg = d3.select(svgElement);
          d3Svg.node().__zoom = zoomInstance;
          const gElement = svgElement.querySelector('g');
          if (gElement && originalTransform) {
            gElement.setAttribute('transform', originalTransform);
          }
        } catch (e) {
        }
      }
    }
    
    // Restore button visibility
    exportButtons.forEach(btn => btn.style.visibility = 'visible');
    
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    // Restore button visibility on error
    const exportButtons = element.querySelectorAll('[id^="export-"], .export-btn');
    exportButtons.forEach(btn => btn.style.visibility = 'visible');
    alert('Failed to export image. Please try again.');
  }
}

// Keep the delegated export controls working for views rendered or restored
// after this module has initialized.
try { window.exportElementToPNG = exportElementToPNG; } catch (e) {}

/**
 * Create a download button for PNG export
 * @param {string} elementId - ID of element to export
 * @param {string} filename - Filename for download
 * @returns {string} HTML for the button
 */
function createExportButton(elementId, filename) {
  const btnId = `export-${elementId}`;
  return `<button type="button" id="${btnId}" class="explore-export-btn export-btn" data-export-target="${elementId}" data-export-filename="${filename}">Export PNG</button>`;
}

/**
 * Creates an embed button that shows embed code in a modal
 * @param {string} networkType - e.g., 'manuscript-genre', 'institution-subgenre', 'scribe-genre'
 * @returns {string} HTML for the button
 */
function createEmbedButton(networkType) {
  const btnId = `embed-${networkType.replace(/[^a-z0-9]/g, '-')}`;
  setTimeout(() => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.onclick = () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const activeMode = document.querySelector('.main-nav-btn.is-on');
        const isTextGenresMode = activeMode && activeMode.dataset.mode === 'text-genres';
        const isScribesMode = activeMode && activeMode.dataset.mode === 'scribes';

        let embedUrl;
        if (isTextGenresMode) {
          const activeTab = document.querySelector('.genre-tab-btn.is-on');
          const tabName = activeTab ? activeTab.dataset.tab : 'manuscript-networks';
          embedUrl = `${baseUrl}?embed=true&mode=text-genres&tab=${tabName}&network=${networkType}`;
        } else if (isScribesMode) {
          const activeTab = document.querySelector('.scribe-tab-btn.is-on');
          const tabName = activeTab ? activeTab.dataset.tab : 'overview';
          embedUrl = `${baseUrl}?embed=true&mode=scribes&tab=${tabName}`;
        } else {
          embedUrl = `${baseUrl}?embed=true&network=${networkType}`;
        }
        
        const iframeCode = `<iframe src="${embedUrl}" width="100%" height="900px" frameborder="0" style="border: none;"></iframe>`;
        
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 1rem;';
        modal.innerHTML = `
          <div style="background: white; border-radius: 0.5rem; padding: 2rem; max-width: 600px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <h3 style="margin: 0; color: #1e293b; font-size: 1.25rem;">Embed Network</h3>
              <button id="close-embed-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b; padding: 0; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 0.25rem;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='none'">×</button>
            </div>
            <div style="margin-bottom: 1rem; padding: 0.75rem; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 0.375rem;">
              <p style="margin: 0; font-size: 0.875rem; color: #92400e; line-height: 1.5;">
                <strong>Note:</strong> All interactive features are preserved in embed mode:
                <br>• Hover tooltips with metadata
                <br>• Hide Labels & Hide Singles buttons
                <br>• Zoom controls
              </p>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #475569; font-size: 0.875rem;">Embed URL</label>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="embed-url-input" value="${embedUrl}" readonly style="flex: 1; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; font-family: monospace; font-size: 0.875rem; background: #f8fafc;">
                <button id="copy-url-btn" class="explore-action-btn explore-action-btn--compact">Copy</button>
              </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #475569; font-size: 0.875rem;">iframe Code</label>
              <div style="display: flex; gap: 0.5rem;">
                <textarea id="embed-code-input" readonly style="flex: 1; padding: 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; font-family: monospace; font-size: 0.75rem; background: #f8fafc; resize: vertical; min-height: 80px;">${iframeCode}</textarea>
                <button id="copy-code-btn" class="explore-action-btn explore-action-btn--compact" style="align-self:flex-start;">Copy</button>
              </div>
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <a href="${embedUrl}" target="_blank" style="flex: 1; padding: 0.625rem 1rem; background: #10b981; color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600; text-align: center; text-decoration: none; font-size: 0.875rem;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">Preview Embed</a>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal handlers
        modal.querySelector('#close-embed-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        // Copy handlers
        modal.querySelector('#copy-url-btn').onclick = () => {
          const input = modal.querySelector('#embed-url-input');
          input.select();
          navigator.clipboard.writeText(embedUrl);
          const btn = modal.querySelector('#copy-url-btn');
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        };
        
        modal.querySelector('#copy-code-btn').onclick = () => {
          const input = modal.querySelector('#embed-code-input');
          input.select();
          navigator.clipboard.writeText(iframeCode);
          const btn = modal.querySelector('#copy-code-btn');
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        };
      };
    }
  }, 100);
  
  return `<button id="${btnId}" style="background: #8b5cf6; color: white; border: none; padding: 0.5rem 0.875rem; border-radius: 0.375rem; font-size: 0.8125rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.375rem; box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08); transition: all 0.2s ease;" onmouseover="this.style.background='#7c3aed'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)';" onmouseout="this.style.background='#8b5cf6'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)';">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 12h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/>
    </svg>
    Embed
  </button>`;
}

// Preserve the public helpers used by dynamically rendered module views.
window.createExportButton = createExportButton;
window.createEmbedButton = createEmbedButton;

if (!window.__exploreExportDelegationInstalled) {
  window.__exploreExportDelegationInstalled = true;
  document.addEventListener('click', event => {
    const button = event.target.closest('.export-btn[data-export-target]');
    if (!button) return;
    const element = document.getElementById(button.dataset.exportTarget);
    if (element) {
      exportElementToPNG(element, button.dataset.exportFilename || 'visualization.png');
    }
  });
}

return {
  exportElementToPNG,
  createExportButton,
  createEmbedButton
};
}
return { init };
})();
