# Comparison Feature - User Guide

## 🎯 Overview

The transcription search now includes a **comparison feature** that allows you to select multiple search results and view them side-by-side. This is particularly useful for:

- Comparing different manuscript versions of the same text
- Analyzing spelling variations across scribes
- Examining paleographic differences
- Studying textual transmission

## 🚀 How to Use

### Step 1: Search for Text
1. Enter your search term in the search box (e.g., "dieu", "mater", "pater")
2. Adjust fuzzy distance if needed (0 = exact match)
3. Click "Search" or press Enter

### Step 2: Select Results
- Each result card now has a checkbox in the top-right corner
- Click checkboxes to select 2 or more results you want to compare
- The comparison toolbar shows your selection count in real-time
- Example: "3 selected"

### Step 3: Compare
- Click the **"Compare Selected"** button (enabled when you have 2+ selections)
- A modal window opens showing all selected results in a grid layout
- Each item displays:
  - Manuscript title
  - Page number (if available)
  - Full transcription text
  - Context lines (if "Show context" was enabled)

### Step 4: Analyze
- Scroll through the comparison grid to examine differences
- Results are displayed in columns (responsive grid layout)
- Context lines (if shown) appear below each main text
- Modal has:
  - Clean white background
  - Gold accents for headers
  - Easy-to-read typography

### Step 5: Clear or Close
- Click **"Clear Selection"** to uncheck all and start over
- Click **"Close"** button in modal to return to search results
- Click anywhere outside the modal to close it

## 💡 Pro Tips

### Maximize Comparison Value
1. **Enable "Show context"** before searching to see surrounding lines in comparison
2. **Select similar passages** - compare the same phrase across different manuscripts
3. **Use grouping** - Group by manuscript first, then select one result from each MS
4. **Sort by manuscript** - Makes it easier to pick one result per manuscript

### Efficient Workflow
```
1. Search term → "nostredieu"
2. Enable "Group by manuscript"
3. Enable "Show context"
4. Select one result from each manuscript (2-4 MSS)
5. Click "Compare Selected"
6. Analyze spelling differences, context, page locations
7. Take screenshots or notes
8. Clear selection and repeat with different term
```

### Keyboard Shortcuts
- `Enter` in search box = Search
- Click checkbox = Toggle selection
- Modal appears over search results (doesn't navigate away)

## 📊 Example Use Cases

### Use Case 1: Spelling Variations
**Goal**: Compare how "nostre dame" is spelled across different manuscripts

1. Search: `nostre dame` (fuzzy = 0)
2. Select 4 results from different manuscripts
3. Compare to see:
   - "nostre dame" vs "notre dame" vs "nostredam"
   - Different abbreviations
   - Regional spelling differences

### Use Case 2: Textual Transmission
**Goal**: Track how a prayer formula appears in different scribal traditions

1. Search: `dieu le pere` (with context enabled)
2. Select examples from German vs. French manuscripts
3. Compare context to see:
   - Different prayer structures
   - Added/omitted phrases
   - Translation differences

### Use Case 3: Paleographic Study
**Goal**: Examine same phrase in different hands

1. Search: `amen` (very common term)
2. Group by manuscript, sort by page number
3. Select 3-4 examples from different dates
4. Compare to study chronological changes

## 🔧 Technical Details

### Selection Limits
- **Minimum**: 2 results (button disabled below this)
- **Maximum**: No hard limit, but 2-6 results recommended for readability
- **Persistent**: Selection survives re-sorts and grouping changes
- **Cleared**: Selection reset when you run a new search

### Modal Features
- **Responsive grid**: Automatically adjusts columns based on screen width
- **Scrollable**: Can handle many results without breaking layout
- **Accessible**: Can be closed with Close button or click outside
- **Preserves context**: Shows context lines if they were enabled

### Data Displayed
For each selected result:
- Full manuscript title (cleaned of "(intégral)")
- Page number (extracted from annotation ID)
- Complete transcription line
- ±2 context lines (if "Show context" was checked)
- All text properly escaped (safe from HTML injection)

## 🎨 Visual Design

- **Selection badges**: Checkbox in top-right of each card
- **Toolbar**: Gold-themed bar with count and buttons
- **Count badge**: Shows number in gold circle
- **Modal header**: Gold border-bottom with title
- **Grid layout**: Auto-fit columns (min 300px width)
- **Item borders**: Light gray with rounded corners

## 🐛 Troubleshooting

**"Compare Selected" button is disabled**
- Solution: Select at least 2 results first

**Checkboxes don't appear**
- Solution: Refresh page, ensure JavaScript loaded

**Modal doesn't show context**
- Solution: Enable "Show context" checkbox before searching

**Selection count shows wrong number**
- Solution: Click "Clear Selection" and start over

**Modal covers my results**
- Solution: Click Close button or outside modal to dismiss

## 📝 Future Enhancements (Possible)

- Export comparison as table (CSV/TSV)
- Print comparison view
- Bookmark/share specific comparisons
- Highlight differences automatically
- Add manuscript metadata to comparison
- Include thumbnail images (if thumbnails re-enabled)

## 🆘 Support

Questions or issues with the comparison feature?
1. Check this README first
2. Review TRANSCRIPTION_SEARCH_STATUS.md for technical details
3. Contact the project maintainers
4. Open a GitHub issue

## 📚 Related Documentation

- `TRANSCRIPTION_SEARCH_STATUS.md` - Complete feature status
- `TRANSCRIPTION_ENHANCEMENTS_PLAN.md` - Technical implementation details
- `pages/search-transcriptions.md` - Search interface code
- `scripts/build_transcription_corpus.py` - Index builder script

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-XX  
**Feature Status**: ✅ Fully Implemented & Tested
