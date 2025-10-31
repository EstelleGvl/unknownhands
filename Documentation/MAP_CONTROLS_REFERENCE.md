# Map Controls - Visual Reference

## Control Panel Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Map — Manuscript Production (fallback: Holding Institution)             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ ☑ Clustering  ☐ Connection Lines  ☐ Heatmap  ☐ Show Routes  [Reset View]│
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│ Time Period: All dates                                        [Clear]   │
│ [800 |═══════════════════════════════════════════════════════| 1600]   │
│ [800 |═══════════════════════════════════════════════════════| 1600]   │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                          [MAP VISUALIZATION AREA]                        │
│                                                                          │
│        • • •  (42)                                                       │
│                              •                                           │
│                 (15)                                                     │
│            • • •                      • •                                │
│                                     •   •                                │
│                                                                          │
│    [Zoom Controls]                                                       │
│        [+]                                                               │
│        [-]                                                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Feature Toggle Controls (Top Bar)

### Visual States

#### Clustering (Default: ON)
```
☑ Clustering  →  Markers group into clusters with counts
☐ Clustering  →  Individual markers shown (can overlap)
```

#### Connection Lines (Default: OFF)
```
☐ Connection Lines  →  No lines drawn
☑ Connection Lines  →  Orange dashed lines: Production -----> Holding
```

#### Heatmap (Default: OFF)
```
☐ Heatmap  →  No overlay
☑ Heatmap  →  Color gradient overlay showing density
```

#### Show Routes (Default: OFF)
```
☐ Show Routes  →  No route paths
☑ Show Routes  →  Purple lines with numbered markers
```

#### Reset View Button
```
[Reset View]  →  Click to zoom/pan to fit all visible markers
```

---

## Time Filter Controls (Bottom Bar)

### Display

```
Time Period: 1200–1400                                          [Clear]
```

Shows current selected range. Updates in real-time as you drag sliders.

Possible states:
- `All dates` - When sliders are at 800 and 1600 (full range)
- `1200–1400` - When range is narrowed
- `1000–1050` - Any custom range

### Dual Sliders

```
Start Date:  [800 |═══════●══════════════════════════════════════| 1600]
End Date:    [800 |═══════════════════════════════════●══════════| 1600]
```

#### Start Date Slider (Top)
- Drag to set earliest date to show
- Range: 800-1600
- Increments: 10 years
- Cannot exceed end date (auto-adjusts)

#### End Date Slider (Bottom)
- Drag to set latest date to show
- Range: 800-1600
- Increments: 10 years
- Cannot go below start date (auto-adjusts)

### Clear Button

```
[Clear]  →  Resets both sliders to 800 and 1600 (full range)
```

---

## Map Features Visual Examples

### 1. Markers Without Clustering

```
Simple circular markers:
   ●  Individual manuscript
   ●  Individual production unit
   ●  Individual institution

All markers visible, may overlap in dense areas
```

### 2. Markers With Clustering (Default)

```
Cluster (small group, 2-9):
   ┌───┐
   │ 5 │  ← Number of markers
   └───┘

Cluster (medium group, 10-99):
   ┌───┐
   │42 │
   └───┘

Cluster (large group, 100+):
   ┌────┐
   │156 │
   └────┘

Individual marker (when zoomed in):
   ●
```

### 3. Connection Lines

```
Production Location          Holding Institution
       ●  - - - - - - - - - - - - >  ●
       
Orange dashed line (stroke-dasharray: 5,5)
Shows manuscript movement from creation to current location
Click line to see popup with details
```

### 4. Heatmap Overlay

```
Color Gradient (intensity):

🔵 Blue    = Low density (1-2 records)
🟢 Cyan    = Low-medium density
🟡 Lime    = Medium density
🟠 Yellow  = High density
🔴 Red     = Very high density (hotspot)

Example visualization:
             🔵
         🔵 🟢 🔵
        🔵 🟢🟡🟢 🔵
           🟢🟡🔴🟡🟢
            🟡🟡🟡
             🟢

Larger, more intense spots = more records in that area
```

### 5. Route Visualization

```
Production ═══════════════════════> Current Location
    ①                                      ②
    
Purple solid line (weight: 3)
Numbered purple circle markers at each stop
Shows manuscript journey/provenance path

Click route or markers for popup:
┌──────────────────────────┐
│ Manuscript Title         │
│ Route: Production →      │
│        Current Location  │
└──────────────────────────┘
```

---

## Popup Windows

### Marker Popup (When clicking a point)

```
┌──────────────────────────────────┐
│ Florence, Biblioteca Laurenziana │
│ MS Plut. 1.1                     │
│                                  │
│        [Open in results]         │
└──────────────────────────────────┘
```

### Connection Line Popup

```
┌──────────────────────────────────┐
│ Paris, BnF fr. 580               │
│ Production → Holding             │
└──────────────────────────────────┘
```

### Route Popup (When clicking route line)

```
┌──────────────────────────────────┐
│ Admont, Stiftsbibliothek MS 58  │
│ Route: Production →              │
│        Current Location          │
└──────────────────────────────────┘
```

### Route Marker Popup (When clicking numbered marker)

```
┌──────────────────────────────────┐
│ Production                       │
│ Step 1 of 2                      │
└──────────────────────────────────┘
```

---

## Interaction Examples

### Example 1: Enable All Features

```
Step 1: Current state (default)
☑ Clustering  ☐ Connection Lines  ☐ Heatmap  ☐ Show Routes
Map shows: Clustered markers only

Step 2: Enable Connection Lines
☑ Clustering  ☑ Connection Lines  ☐ Heatmap  ☐ Show Routes
Map shows: Clustered markers + Orange dashed lines

Step 3: Enable Heatmap
☑ Clustering  ☑ Connection Lines  ☑ Heatmap  ☐ Show Routes
Map shows: Clustered markers + Orange lines + Color overlay

Step 4: Enable Routes
☑ Clustering  ☑ Connection Lines  ☑ Heatmap  ☑ Show Routes
Map shows: All features combined (may be busy!)

Tip: Don't enable all at once - select features based on research question
```

### Example 2: Time Filter Workflow

```
Step 1: Default state
Time Period: All dates
[800 |═══════════════════════════════════════════════════════| 1600]
[800 |═══════════════════════════════════════════════════════| 1600]
Shows all records regardless of date

Step 2: Drag start slider to 1200
Time Period: 1200–1600
[800 |═══════════════●═══════════════════════════════════════| 1600]
[800 |═══════════════════════════════════════════════════════| 1600]
Shows only records from 1200 onwards

Step 3: Drag end slider to 1400
Time Period: 1200–1400
[800 |═══════════════●═══════════════════════════════════════| 1600]
[800 |═══════════════════════════●═══════════════════════════| 1600]
Shows only records from 1200-1400 (13th-14th century)

Step 4: Click [Clear]
Time Period: All dates
[800 |═══════════════════════════════════════════════════════| 1600]
[800 |═══════════════════════════════════════════════════════| 1600]
Back to all dates
```

### Example 3: Clustering Toggle

```
With Clustering (Dense City View):
Florence area:
     ┌────┐
     │ 58 │  ← All Florence manuscripts in one cluster
     └────┘

Without Clustering (Dense City View):
Florence area:
   ● ● ● ● ●
   ● ● ● ● ●
   ● ● ● ● ●  ← 58 individual markers (overlapping!)
   ● ● ● ●

Recommendation: Keep clustering ON for dense cities
```

---

## Color Scheme Reference

### Markers
- **Default**: `#3388ff` (blue)
- **Fill Opacity**: 0.7
- **Border**: White, 1px

### Connection Lines
- **Color**: `#ff7800` (orange)
- **Weight**: 2px
- **Opacity**: 0.6
- **Style**: Dashed (5, 5)

### Routes
- **Color**: `#9333ea` (purple)
- **Weight**: 3px
- **Opacity**: 0.7
- **Style**: Solid

### Route Markers
- **Fill**: `#9333ea` (purple)
- **Border**: White, 2px
- **Radius**: 8px
- **Fill Opacity**: 0.8

### Heatmap Gradient
```
0.4 = blue    rgb(0, 0, 255)
0.6 = cyan    rgb(0, 255, 255)
0.7 = lime    rgb(0, 255, 0)
0.8 = yellow  rgb(255, 255, 0)
1.0 = red     rgb(255, 0, 0)
```

### Clusters
- **Small** (2-9): Green, 40px diameter
- **Medium** (10-99): Yellow, 50px diameter
- **Large** (100+): Red, 60px diameter

---

## Responsive Behavior

### Desktop (Recommended)
- All features work smoothly
- Precise slider control
- Hover states visible
- Full popup functionality

### Tablet
- Touch-friendly controls
- Sliders may be less precise
- Clustering recommended (harder to tap small markers)
- Pinch to zoom works

### Mobile
- Basic functionality
- Sliders harder to use (consider using keyboard input in future)
- Clustering essential (too hard to tap individual markers)
- May need to zoom more to see details

---

## Keyboard Shortcuts (Future Enhancement)

*Not yet implemented, but planned:*

- `C` - Toggle clustering
- `L` - Toggle connection lines
- `H` - Toggle heatmap
- `R` - Toggle routes
- `T` - Focus time slider
- `Esc` - Clear time filter
- `Space` - Reset view
- `+` / `-` - Zoom in/out

---

## Accessibility Notes

### Current Implementation
- ✅ Semantic HTML (checkboxes, labels)
- ✅ Keyboard accessible controls
- ✅ Clear visual feedback
- ✅ High contrast colors

### Future Improvements
- ⚠️ Add ARIA labels to sliders
- ⚠️ Add screen reader descriptions for map features
- ⚠️ Keyboard navigation within map
- ⚠️ Alternative text-based view option

---

**Document Version**: 1.0  
**Last Updated**: October 30, 2025  
**Purpose**: Visual reference for map control panel
