# Debug Embed Mode Network Centering

## Issue
Network is still offset (too far right) in embed mode even after multiple fixes.

## Debug Steps

1. **Open the embedded page in browser** with console open (F12)
   URL: `https://estellegueville.com/unknownhands/explore-database/?embed=true&mode=text-genres&tab=manuscript-networks&network=manuscript-genre`

2. **Check Console Logs** - You should see:
   ```
   Embed detection: {isEmbed: true, inIframe: false, willActivate: true}
   embed-mode class added to html element
   [MS Network] Building network with levelFilter: genre layout: horizontal
   [MS Network] Container found, building network...
   [MS Network] Initial container size: {width: XXX, height: YYY}
   [MS Network] resizeAndRecenter called: {w: XXX, h: YYY, currentWidth: XXX, currentHeight: YYY}
   ```

3. **Check Actual Container Width**:
   ```javascript
   const el = document.querySelector('#ms-network-viz');
   console.log('Container rect:', el.getBoundingClientRect());
   console.log('Parent rect:', el.parentElement.getBoundingClientRect());
   console.log('Full width container:', document.querySelector('.explore-fullwidth').getBoundingClientRect());
   ```

4. **Check SVG ViewBox vs Container**:
   ```javascript
   const svg = document.querySelector('#ms-network-viz svg');
   console.log('SVG viewBox:', svg.getAttribute('viewBox'));
   console.log('Container width:', el.getBoundingClientRect().width);
   ```

5. **Check Zoom Transform**:
   ```javascript
   const g = document.querySelector('#ms-network-viz svg > g');
   console.log('g transform:', g.getAttribute('transform'));
   ```

6. **Manual Test - Trigger Resize**:
   ```javascript
   window.dispatchEvent(new Event('resize'));
   // Check console logs to see if resizeAndRecenter is called
   ```

7. **Manual Test - Check if Reset Works**:
   Click the "Reset View" button - does the network center?

## Expected Behavior

- Container should have full width of viewport (minus any padding)
- SVG viewBox should match container dimensions
- `g` transform should be either `null` or `translate(0,0) scale(1)` after resize
- After clicking Reset View, network should be centered

## Common Issues

### If container width is narrow (like 100px):
- CSS isn't being applied correctly
- Check `document.documentElement.classList.contains('embed-mode')` returns `true`
- Check `.explore-fullwidth` computed styles show `max-width: none`

### If container width is correct but network still offset:
- Check the `g` transform - if it has a translate value, that's the problem
- The zoom transform isn't being reset properly

### If resize events aren't firing:
- The embed detection script might not be running
- Check for JavaScript errors in console

### If getBoundingClientRect() returns different width than expected:
- There might be parent containers with width constraints
- Check all parent elements up to body

## Quick Fix Commands

```javascript
// Force reset everything:
const svg = d3.select('#ms-network-viz svg');
const zoom = d3.zoom();
svg.call(zoom.transform, d3.zoomIdentity);

// Force recalculate:
window.dispatchEvent(new Event('resize'));
```
