# Embed Mode Implementation Code - LATEST VERSION (WITH ZOOM TRANSFORM FIX)

This document contains all the code related to embed mode functionality for the explore-database page.

## 🔧 CRITICAL FIX: Network Offset = Persisted Zoom Transform

**The Real Problem:** The network graph is shifted to the right because the `<g>` element containing the network has a persisted zoom/pan transform (e.g., `translate(450, 0)`). When embed-mode changes the container width, the CSS updates but the D3 zoom transform on the `<g>` stays the same, keeping the graph offset.

**Why CSS changes didn't fix it:** We were updating viewBox and force simulation center, but the `g.attr('transform', event.transform)` from d3.zoom() was never being reset. That old transform keeps the graph positioned according to the original coordinate system.

**The Solution:** 
1. Force resize events AFTER embed CSS is injected
2. **CRITICAL:** Reset the zoom transform in `resizeAndRecenter()` 
3. Add `fitToView()` function that computes proper centering/scaling based on actual graph bounding box
4. Call `fitToView()` after simulation stabilizes and on Reset View button

## DEBUGGING CHECKLIST

Before anything else, verify these in browser console:

1. **Check embed mode is active:**
   ```javascript
   document.documentElement.classList.contains('embed-mode')
   // Should return: true
   ```

2. **Check console logs:**
   - You should see: "Embed detection: {isEmbed: true/false, inIframe: true/false, willActivate: true/false}"
   - You should see: "embed-mode class added to html element"

3. **Check URL parameters:**
   ```javascript
   window.location.search
   // Should include: ?embed=true
   ```

4. **If embed mode is NOT activating:**
   - Make sure your iframe src includes `?embed=true`
   - Example: `https://estellegueville.com/unknownhands/explore-database/?embed=true&mode=text-genres&tab=manuscript-networks`

5. **If network is offset to right even after CSS is fixed:**
   ```javascript
   const el = document.querySelector('#ms-network-viz');
   console.log('Container dimensions:', el.getBoundingClientRect());
   // Check if the network is using these actual dimensions or old cached values
   ```

## 1. Inline Embed Detection Script (Lines 13-160)

**LATEST VERSION** - This script runs immediately when the page loads, before any rendering happens. It detects if the page is in an iframe or has `?embed=true` parameter, then adds the `embed-mode` class and styles.

```javascript
<script>
// Immediately check for embed mode and hide elements BEFORE page renders
(function() {
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get('embed') === 'true';
  const inIframe = window.self !== window.top;
  
  // Debug logging
  console.log("Embed detection:", { isEmbed, inIframe, willActivate: isEmbed || inIframe });
  
  if (isEmbed || inIframe) {
    document.documentElement.classList.add('embed-mode');
    console.log("embed-mode class added to html element");
    
    // Add styles immediately
    const style = document.createElement('style');
    style.textContent = `
      .embed-mode header,
      .embed-mode footer,
      .embed-mode nav,
      .embed-mode .page-header,
      .embed-mode .site-header,
      .embed-mode .page-banner,
      .embed-mode [class*="banner"],
      .embed-mode .site-title,
      .embed-mode .site-nav {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }
      
      .embed-mode * {
        box-sizing: border-box !important;
      }
      
      html.embed-mode body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }
      
      html.embed-mode .explore-fullwidth {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        transform: none !important;
        padding: 0 !important;
      }
      
      html.embed-mode .db-shell,
      html.embed-mode .mode-container,
      html.embed-mode .viz-card,
      html.embed-mode .viz-body {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      
      html.embed-mode #text-genres-mount {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      html.embed-mode #text-genres-mount > div {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
      }
      
      html.embed-mode #genre-tab-content {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        height: calc(100vh - 120px) !important;
        min-height: 0 !important;
      }
      
      html.embed-mode #genre-tab-content > div {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
      }
      
      html.embed-mode #ms-network-wrapper,
      html.embed-mode #inst-network-wrapper,
      html.embed-mode #scribe-network-wrapper {
        padding: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        height: 100% !important;
      }
      
      html.embed-mode #ms-network-viz,
      html.embed-mode #inst-network-viz,
      html.embed-mode #scribe-network-viz {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
        min-height: 0 !important;
      }
      
      html.embed-mode svg {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        display: block !important;
      }
    `;
    document.head.appendChild(style);
    
    // Force layout recalculation AFTER embed CSS is applied
    // Multiple dispatches catch delayed network renders from navigation timeouts
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
      setTimeout(() => window.dispatchEvent(new Event('resize')), 800);
    });
  }
})();
</script>
```

**KEY CHANGES FROM PREVIOUS VERSION:**
- ✅ Added console.log debug messages
- ✅ Changed selectors from `.embed-mode` to `html.embed-mode` for higher specificity
- ✅ Changed `max-width: 100%` to `max-width: none` to defeat any max-width constraints
- ✅ Added `overflow: hidden` to body (was `overflow-x: hidden`)
- ✅ Added explicit `height: calc(100vh - 120px)` to #genre-tab-content
- ✅ Made network containers `height: 100%`
- ✅ Changed SVG from `height: auto` to `height: 100%`
- ✅ **CRITICAL:** Added resize event dispatching after CSS injection to force network re-centering

## 2. CSS Override in Style Block (Around Line 1169-1190)

**LATEST VERSION** - This CSS comes AFTER the normal `.explore-fullwidth` styling and overrides it for embed mode. This is critical because the normal styling has `margin-left: 50%; transform: translateX(-50%);` which centers full-width content on normal pages but breaks in iframes.

```css
.explore-fullwidth{width:100vw;max-width:100vw;margin-left:50%;transform:translateX(-50%);padding:0 4vw;}

/* Override explore-fullwidth for embed mode - use html.embed-mode for higher specificity */
html.embed-mode .explore-fullwidth {
  width: 100% !important;
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  transform: none !important;
  padding: 0 !important;
}

html.embed-mode .db-shell,
html.embed-mode .mode-container {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
```

**KEY CHANGES:**
- ✅ Changed from `.embed-mode` to `html.embed-mode` for higher CSS specificity
- ✅ Changed `max-width: 100%` to `max-width: none` to override any max-width constraints
- ✅ Added explicit overrides for .db-shell and .mode-container

## 3. Conditional Rendering in buildTextGenres() (Lines 19379-19412)

The buildTextGenres function detects embed mode and conditionally applies different inline styles to avoid padding/backgrounds in embeds.

```javascript
function buildTextGenres() {
  const mount = document.getElementById('text-genres-mount');
  if (!mount) {
    console.error('text-genres-mount element not found');
    return;
  }
  
  // Check if we're in embed mode
  const isEmbedMode = document.documentElement.classList.contains('embed-mode');
  
  // Initialize UI with conditional styling based on embed mode
  mount.innerHTML = `
    <div style="background: ${isEmbedMode ? 'transparent' : 'white'}; border-radius: ${isEmbedMode ? '0' : '0.5rem'}; box-shadow: ${isEmbedMode ? 'none' : '0 2px 4px rgba(0,0,0,0.08)'}; overflow: hidden;">
      <div style="border-bottom: 2px solid #f0f0f0;">
        <div class="genre-tabs" style="display: flex; gap: 0.5rem; padding: 0.75rem ${isEmbedMode ? '0' : '1.5rem'}; background: #fafafa;">
          <button class="genre-tab-btn is-on" data-tab="overview" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Overview
          </button>
          <button class="genre-tab-btn" data-tab="manuscript-networks" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Manuscript Networks
          </button>
          <button class="genre-tab-btn" data-tab="institution-networks" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Institution Networks
          </button>
          <button class="genre-tab-btn" data-tab="scribe-networks" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Scribe Networks
          </button>
          <button class="genre-tab-btn" data-tab="distributions" style="padding: 0.5rem 1rem; border: none; background: transparent; border-radius: 0.375rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: #666;">
            Distributions
          </button>
        </div>
      </div>
      <div style="padding: ${isEmbedMode ? '0' : '1.5rem'};">
        <div id="genre-tab-content" style="overflow: auto; min-height: 60vh;">
          <!-- Content will be rendered here -->
        </div>
      </div>
    </div>
  `;
  
  // ... rest of function
}
```

## 4. Network Resize & Recenter Logic (CRITICAL ZOOM TRANSFORM FIX)

**LATEST VERSION** - Each network function now properly resets the zoom transform when container resizes. This is THE fix for the "network shifted to right" issue.

### The fitToView() Function

Added to all three networks (manuscript, institution, scribe). This computes the actual bounding box of the network and centers/scales it properly within the container.

```javascript
// Fit network to view - centers and scales to fit container
function fitToView() {
  const { w, h } = getSize(svgDiv);
  if (w <= 1 || h <= 1) return;
  
  try {
    const bbox = g.node().getBBox();
    if (!bbox.width || !bbox.height) return;
    
    const pad = 40;
    const scale = Math.min(
      (w - pad) / bbox.width,
      (h - pad) / bbox.height,
      1.5  // Don't zoom in too much
    );
    
    const tx = (w / 2) - scale * (bbox.x + bbox.width / 2);
    const ty = (h / 2) - scale * (bbox.y + bbox.height / 2);
    
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  } catch (e) {
    // If bbox fails, just reset to identity
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  }
}
```

### Updated Reset View Button

Changed from resetting to identity to calling fitToView():

```javascript
document.getElementById('ms-reset').onclick = () => {
  fitToView();  // Was: svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
};
```

### Updated resizeAndRecenter()

**CRITICAL CHANGE:** Now resets zoom transform before fitting to view:

```javascript
function resizeAndRecenter() {
  const { w, h } = getSize(svgDiv);
  if (w <= 1 || h <= 1) return;
  if (w === width && h === height) return;
  
  width = w;
  height = h;
  svg.attr('viewBox', `0 0 ${width} ${height}`);
  
  // Update force center positions based on layout
  if (layout === 'horizontal') {
    simulation
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(d => d.type === 'manuscript' ? height * 0.25 : height * 0.75).strength(0.9));
  } else {
    simulation
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.03))
      .force('y', d3.forceY(height / 2).strength(0.03));
  }
  simulation.alpha(0.3).restart();
  
  // ✅ CRITICAL: Reset zoom transform to fix offset issue
  svg.transition().duration(0).call(zoom.transform, d3.zoomIdentity);
  setTimeout(() => fitToView(), 100);
}

window.addEventListener('resize', resizeAndRecenter);
new ResizeObserver(resizeAndRecenter).observe(svgDiv);
```

### Auto-fit After Simulation Stabilizes

Added to end of each network function:

```javascript
simulation.on('tick', () => {
  link
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
  
  node.attr('transform', d => `translate(${d.x},${d.y})`);
});

// ✅ Fit to view after simulation stabilizes
simulation.on('end', () => {
  setTimeout(() => fitToView(), 100);
});
```

### Fixed Dimension Fallback

Changed from fake 1800x900 to reasonable 1200x700:

```javascript
// OLD (bad):
if (width === 1 || height === 1) {
  width = 1800;
  height = 900;
}

// NEW (better):
if (width <= 50 || height <= 50) {
  width = 1200;
  height = 700;
}
```

**Why This ACTUALLY Fixes the Offset:**
- OLD: Zoom transform persisted from old container width, keeping graph offset
- NEW: `resizeAndRecenter()` explicitly resets zoom transform with `zoom.transform, d3.zoomIdentity`
- THEN: `fitToView()` computes proper centering based on actual graph bounding box
- RESULT: Graph is always centered and properly scaled regardless of container size changes

**This applies to all three network types:**
- Manuscript-Genre Networks  
- Institution-Genre Networks
- Scribe-Genre Networks

## 5. Embed Boot Logic (Lines ~19156-19280)

This code handles URL parameters to automatically navigate to the correct mode/tab/network when an embed URL is loaded.

Example embed URLs:
- Text Genres: `?embed=true&mode=text-genres&tab=manuscript-networks&network=manuscript-genre`
- Scribes: `?embed=true&mode=scribes&tab=collaboration`
- Network: `?embed=true&network=manuscript-genre`

```javascript
// Handle embed mode navigation
const params = new URLSearchParams(window.location.search);
if (params.get('embed') === 'true') {
  const modeParam = params.get('mode');
  const networkParam = params.get('network');
  const tabParam = params.get('tab');
  const layoutParam = params.get('layout');
  
  if (modeParam === 'text-genres') {
    // Navigate to Text Genres mode
    const modeBtn = document.querySelector('[data-mode="text-genres"]');
    if (modeBtn) {
      modeBtn.click();
      
      // Navigate to specific tab if provided
      if (tabParam) {
        setTimeout(() => {
          const tabBtn = document.querySelector(`.genre-tab-btn[data-tab="${tabParam}"]`);
          if (tabBtn) {
            tabBtn.click();
            
            // If network parameter is provided, switch to that network type
            if (networkParam) {
              setTimeout(() => {
                const networkMode = networkParam.includes('subgenre') ? 'subgenre' : 'genre';
                const modeToggle = document.querySelector(`.network-mode-btn[data-mode="${networkMode}"]`);
                if (modeToggle) modeToggle.click();
                
                // Handle layout parameter
                if (layoutParam) {
                  setTimeout(() => {
                    const layoutToggle = document.querySelector(`.layout-toggle-btn[data-layout="${layoutParam}"]`);
                    if (layoutToggle) layoutToggle.click();
                  }, 100);
                }
              }, 100);
            }
          }
        }, 200);
      }
    }
  } else if (modeParam === 'scribes') {
    // Navigate to Scribes mode
    const modeBtn = document.querySelector('[data-mode="scribes"]');
    if (modeBtn) {
      modeBtn.click();
      
      if (tabParam) {
        setTimeout(() => {
          const tabBtn = document.querySelector(`.scribe-tab-btn[data-tab="${tabParam}"]`);
          if (tabBtn) {
            tabBtn.click();
            
            // Handle layout parameter for collaboration network
            if (tabParam === 'collaboration' && layoutParam) {
              setTimeout(() => {
                const layoutToggle = document.querySelector(`.layout-toggle-btn[data-layout="${layoutParam}"]`);
                if (layoutToggle) layoutToggle.click();
              }, 300);
            }
          }
        }, 200);
      }
    }
  } else if (networkParam === 'scribe-collaborations') {
    // Legacy fallback for scribe-collaborations
    const modeBtn = document.querySelector('[data-mode="scribes"]');
    if (modeBtn) {
      modeBtn.click();
      setTimeout(() => {
        const tabBtn = document.querySelector('.scribe-tab-btn[data-tab="collaboration"]');
        if (tabBtn) {
          tabBtn.click();
          
          if (layoutParam) {
            setTimeout(() => {
              const layoutToggle = document.querySelector(`.layout-toggle-btn[data-layout="${layoutParam}"]`);
              if (layoutToggle) layoutToggle.click();
            }, 300);
          }
        }
      }, 200);
    }
  } else if (networkParam) {
    // Navigate to Network mode for other networks
    const modeBtn = document.querySelector('[data-mode="network"]');
    if (modeBtn) {
      modeBtn.click();
      setTimeout(() => {
        const networkBtns = {
          'manuscript-genre': '[data-network="manuscript-genre"]',
          'manuscript-subgenre': '[data-network="manuscript-subgenre"]',
          'institution-genre': '[data-network="institution-genre"]',
          'institution-subgenre': '[data-network="institution-subgenre"]',
          'scribe-genre': '[data-network="scribe-genre"]',
          'scribe-subgenre': '[data-network="scribe-subgenre"]'
        };
        const selector = networkBtns[networkParam];
        if (selector) {
          const networkBtn = document.querySelector(selector);
          if (networkBtn) networkBtn.click();
        }
      }, 200);
    }
  }
}
```

## KEY TROUBLESHOOTING STEPS

### Step 1: Verify Embed Mode is Activated

Open browser DevTools (F12) on the embedded page and run:

```javascript
// Check if embed-mode class exists
document.documentElement.classList.contains('embed-mode')
// Expected: true

// Check what the console logged
// You should see two messages:
// "Embed detection: {isEmbed: true/false, inIframe: true/false, willActivate: true}"
// "embed-mode class added to html element"
```

**If you DON'T see the console logs:**
- The script isn't running (cached file, wrong page, build error)
- Clear cache and hard reload (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

**If console shows `willActivate: false`:**
- Your URL is missing `?embed=true` parameter
- Make sure iframe src is: `...explore-database/?embed=true&mode=text-genres&tab=manuscript-networks`

### Step 2: Check If Headers Are Hidden

If embed-mode is active but headers still show:

```javascript
// Check header visibility
const header = document.querySelector('header');
if (header) {
  console.log('Header display:', getComputedStyle(header).display);
  console.log('Header visibility:', getComputedStyle(header).visibility);
}
// Expected: display: "none", visibility: "hidden"
```

### Step 3: Check .explore-fullwidth Transform

If content is still offset to left/right:

```javascript
const fw = document.querySelector('.explore-fullwidth');
if (fw) {
  const styles = getComputedStyle(fw);
  console.log({
    width: styles.width,
    maxWidth: styles.maxWidth,
    marginLeft: styles.marginLeft,
    transform: styles.transform,
    padding: styles.padding
  });
}
// Expected: width: "100%", maxWidth: "none", marginLeft: "0px", transform: "none", padding: "0px"
```

**If transform is NOT "none":**
- The CSS override isn't being applied
- Check that the override comes AFTER the normal .explore-fullwidth definition
- The `html.embed-mode` selector should have higher specificity

### Step 4: Check Network Container Height

If network is cut off/cropped:

```javascript
const networkViz = document.querySelector('#ms-network-viz');
if (networkViz) {
  console.log({
    height: networkViz.offsetHeight,
    parent: networkViz.parentElement.offsetHeight,
    computed: getComputedStyle(networkViz).height
  });
}
// Expected: All should be substantial heights (not 0 or very small)
```

### Step 5: Adjust the Viewport Height Calculation

The `calc(100vh - 120px)` assumes 120px for headers/controls. If your controls are taller/shorter:

1. Measure the actual height:
```javascript
const controls = document.querySelector('.genre-tabs')?.parentElement;
const heading = document.querySelector('h2');
const totalHeight = (controls?.offsetHeight || 0) + (heading?.offsetHeight || 0) + 40; // 40px margin
console.log('Controls height:', totalHeight, 'px');
```

2. Update the CSS to use this value instead of 120px

### Common Issues and Fixes

**Issue: Header still visible**
- ✅ Check URL has `?embed=true`
- ✅ Check console for "embed-mode class added"
- ✅ Verify `document.documentElement.classList.contains('embed-mode')` returns true

**Issue: Content offset to right/left**
- ✅ Verify `.explore-fullwidth` has `transform: none`
- ✅ Check `margin-left` is 0px not 50%
- ✅ Ensure CSS override comes after normal definition

**Issue: Network graph shifted to the right (but controls/title are fine)**
- ✅ **This is NOT a CSS issue - it's a D3 simulation centering issue**
- ✅ Check that resize events are being dispatched after embed CSS loads
- ✅ Verify network is using `getBoundingClientRect()` not fixed width
- ✅ Confirm ResizeObserver is calling `resizeAndRecenter()` function
- ✅ Test manually: Run `window.dispatchEvent(new Event('resize'))` in console - does network recenter?

**Issue: Network cropped/cut off**
- ✅ Check #genre-tab-content has explicit height
- ✅ Verify #ms-network-viz height is 100%
- ✅ Check SVG height is 100% not auto
- ✅ Adjust the 120px offset if needed

**Issue: White space on right**
- ✅ Check all containers have `max-width: none` not `100%`
- ✅ Verify no containers have padding
- ✅ Check body has `overflow: hidden`
