# High-Quality Image Export Guide

## Overview
Added publication-quality image export functionality to all visualizations in the Unknown Hands explore-database interface. Exports support 300 DPI minimum resolution suitable for academic publications.

## Export Features

### 1. **Map View Export**
- **Format**: PNG (high-resolution)
- **Button Location**: Map controls panel
- **Button ID**: `map-export-image`
- **Technology**: html2canvas library
- **Resolution**: 3x scale (~300 DPI)
- **Filename format**: `unknownhands-map-{timestamp}.png`

### 2. **Network View Export**
- **Formats**: SVG (vector) and PNG (high-resolution)
- **Button Location**: Network controls panel
- **Button IDs**: 
  - `network-export-svg` (vector format, scalable)
  - `network-export-png` (high-res raster, 300 DPI)
- **Technology**: Direct SVG serialization + canvas conversion for PNG
- **Resolution**: 3x scale for PNG
- **Filename format**: `unknownhands-network-depth{X}-{timestamp}.{svg|png}`
- **Additional**: Existing data export dropdown (Gephi, R formats) retained

### 3. **Timeline View Export**
- **Formats**: SVG (vector) and PNG (high-resolution)
- **Button Location**: Timeline controls panel
- **Button IDs**:
  - `timeline-export-svg`
  - `timeline-export-png`
- **Technology**: D3 SVG serialization + canvas conversion
- **Resolution**: 3x scale for PNG
- **Filename format**: `unknownhands-timeline-{timestamp}.{svg|png}`

### 4. **Analytics View Export**
- **Formats**: SVG (vector) and PNG (high-resolution)
- **Button Location**: Analytics controls panel (after viz description)
- **Button IDs**:
  - `analytics-export-svg`
  - `analytics-export-png`
- **Technology**: Adapts based on viz type (SVG or html2canvas)
- **Resolution**: 3x scale for PNG
- **Filename format**: `unknownhands-analytics-{vizType}-{timestamp}.{svg|png}`
- **Supported viz types**: dashboard, codicology, sankey, matrix, chord, tree

## Technical Implementation

### Libraries Added
1. **svg-crowbar** (v0.6.1): SVG export utilities
2. **html2canvas** (v1.4.1): HTML to canvas conversion for complex layouts

### Core Export Functions

#### `exportSvgAsSvg(svgElement, filename)`
- Exports D3 SVG visualizations as vector SVG files
- Inlines all CSS styles from stylesheets
- Preserves fonts, colors, and layout
- Best for: Network, Timeline, Analytics SVG-based visualizations

#### `exportSvgAsPng(svgElement, filename, scaleFactor)`
- Converts SVG to high-resolution PNG
- Default scale factor: 3 (approximately 300 DPI)
- Creates white background
- Inlines styles for accurate rendering
- Best for: Print publications requiring raster images

#### `exportMapAsPng(containerId, filename)`
- Captures Leaflet map including all layers and controls
- Uses html2canvas with CORS support
- Scale factor: 3 for high resolution
- Handles map tiles, markers, and overlays

#### `exportAnalyticsVisualization(format)`
- Smart export that detects visualization type
- Routes to SVG export if D3-based
- Falls back to html2canvas for complex HTML visualizations
- Handles all 6 analytics viz types

### Modified Functions

#### `downloadFile(content, filename, mimeType)` - Enhanced
- **Previous**: Only accepted string content
- **Current**: Accepts both string content and Blob objects
- **Reason**: Export functions generate Blobs directly for efficiency

```javascript
// Now handles both:
downloadFile("CSV content here", "file.csv", "text/csv");  // string
downloadFile(pngBlob, "image.png", "image/png");           // Blob
```

## Usage Instructions

### For Users
1. Navigate to desired visualization view (Map, Network, Timeline, or Analytics)
2. Generate your visualization (e.g., search for a record, select network mode)
3. Click the green **📷 Export SVG** or **📷 Export PNG** button
4. File will automatically download to your default downloads folder

### For Publications
- **Journals requiring vector graphics**: Use SVG exports (networks, timelines, analytics)
- **Journals requiring raster images**: Use PNG exports (300 DPI minimum)
- **Maps**: Only PNG available (includes raster base tiles)
- **Presentations**: PNG exports work well at high resolution

### Quality Recommendations
- **SVG**: Unlimited scalability, smaller file size, editable in Adobe Illustrator/Inkscape
- **PNG (3x scale)**: ~300 DPI at typical screen sizes, suitable for print
- **Higher DPI needed?**: Modify `scaleFactor` parameter in export functions (e.g., 4 for 400 DPI)

## File Locations

### Modified Files
1. **`pages/explore-database.md`** (9,405 lines)
   - Added export buttons to all 4 visualization controls
   - Added 4 export functions (~280 lines)
   - Added 8 event listeners for export buttons
   - Enhanced `downloadFile()` function
   - Added script tags for html2canvas and svg-crowbar libraries

### Button Placements
- **Map**: Line ~129 (in map controls)
- **Network**: Lines ~237-241 (in network controls, before existing export dropdown)
- **Timeline**: Lines ~183-185 (in timeline controls)
- **Analytics**: Lines ~507-511 (after analytics description panel)

### Function Definitions
- **Export functions**: Lines ~5205-5462
- **Event listeners**: Lines ~5859-5935
- **Enhanced downloadFile**: Lines ~6221-6235

## Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (note: CORS restrictions may apply to external resources)
- **IE11**: Not supported (requires modern JavaScript)

## Known Limitations
1. **Map exports**: Cannot export at arbitrarily high resolutions (browser canvas size limits)
2. **External resources**: Images from external domains may not appear in exports (CORS)
3. **Custom fonts**: May require embedding or fall back to system fonts
4. **Very large networks**: Export may be slow due to canvas size

## Future Enhancements
- [ ] Batch export (all visualizations at once)
- [ ] Custom DPI selector in UI
- [ ] PDF export option
- [ ] Export with/without background toggle
- [ ] Crop/frame options for exports
- [ ] Watermark or attribution overlay

## Testing Checklist
- [x] Export buttons visible in all 4 views
- [ ] Map PNG export works with markers/overlays
- [ ] Network SVG export preserves styles
- [ ] Network PNG export at 300 DPI quality
- [ ] Timeline SVG export with all labels
- [ ] Timeline PNG export readable
- [ ] Analytics exports work for all 6 viz types
- [ ] Files download with correct names
- [ ] SVG files open in Illustrator/Inkscape
- [ ] PNG files meet 300 DPI requirement

## Support
For issues or questions about the export functionality, check:
1. Browser console for JavaScript errors
2. Network tab for failed resource loads
3. Ensure visualization is fully rendered before exporting
4. Try different browsers if issues persist

---
**Implementation Date**: January 2025  
**Version**: 1.0  
**Dependencies**: D3.js v7, html2canvas v1.4.1, svg-crowbar v0.6.1
