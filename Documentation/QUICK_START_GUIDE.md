# Quick Start Guide: Network Visualization & Path Finding

## 🎯 Quick Links to New Features

### 1. Network Diagram (Visual Relationship Explorer)
**Where**: View tabs → "Network" button
**What**: Interactive graph showing how records connect
**Best for**: Exploring complex relationship patterns

### 2. Path Finder (Connection Discovery)
**Where**: Details panel → "🔗 Find Connection to..." button  
**What**: Discovers paths between any two records
**Best for**: Understanding indirect relationships

### 3. Export Tools
**Where**: Path finder dialog → Export buttons
**What**: Download data for Gephi or R analysis
**Best for**: Advanced network analysis and statistics

---

## 🚀 Getting Started in 3 Minutes

### Quick Demo: Explore a Scribe's Network

1. **Go to the database explorer**: `/explore-database/`

2. **Select "Historical People"** in the Record type switcher (left sidebar)

3. **Click on any scribe** in the results

4. **Click the "Network" tab** (top of results area)
   - You'll see the scribe at the center
   - Connected records around them (manuscripts, texts, institutions)
   - Each node is color-coded by type

5. **Interact with the network**:
   - **Drag** nodes to reorganize
   - **Zoom** with mouse wheel
   - **Click** any node to view that record
   - **Adjust depth** slider and click Refresh to see more/fewer connections

### Quick Demo: Find a Connection

1. **Select any record** (e.g., a Scribal Unit)

2. **Scroll down** in the details panel (right side)

3. **Click "🔗 Find Connection to..."** button

4. **Search** for another record (e.g., type "monastery" to find institutions)

5. **Click a search result** to find paths

6. **View all discovered paths** showing how the records connect

7. **Optional**: Click export buttons to download for Gephi/R

---

## 📊 Use Cases by Research Question

### "Which scribes worked together?"
1. Select Historical Person (scribe)
2. Network tab → See connected manuscripts
3. Look for other Historical People connected to same manuscripts
4. Click those people to explore their networks

### "How did this text travel?"
1. Select a Text
2. Network tab → See which manuscripts contain it
3. For each manuscript, check its production unit and location
4. Export for Gephi to visualize transmission patterns

### "What's the connection between Record A and Record B?"
1. Select Record A
2. Click "Find Connection to..."
3. Search for Record B
4. View all paths between them
5. Click records in paths to trace the route

### "Analyze production networks statistically"
1. For multiple records, use "Find Connection to..."
2. Export each path set for R
3. Run provided R script for statistics
4. Analyze patterns across multiple networks

---

## 🎨 Understanding the Network Diagram

### Node Colors
- 🟡 **Gold** = Scribal Units
- 🔵 **Blue** = Manuscripts
- 🔴 **Red** = Production Units
- 🟢 **Green** = Holding Institutions
- 🟣 **Purple** = Monastic Institutions
- 🟠 **Orange** = Historical People
- 🔷 **Teal** = Texts

### Node Sizes
- **Large with thick border** = Your selected record (center)
- **Medium with thin border** = Connected records

### Arrows
- Show direction of relationships
- **Source → Target**

### Depth Levels
- **Depth 1**: Immediate connections only (fast, simple)
- **Depth 2**: Connections + their connections (recommended default)
- **Depth 3**: Extended network (may be dense for popular records)

---

## 🔍 Path Finding Tips

### Adjust Max Depth
- Start with **4** (default) for most cases
- Increase to **5** for distant connections
- Decrease to **2-3** for records you know are closely related

### Interpreting Results
- **Multiple paths** = Different routes between records
- **Shorter paths** = More direct relationships
- **Common nodes** in paths = Important connectors

### Export Options

#### For Gephi (Visual Network Analysis)
**What you get**: 2 CSV files (nodes + edges)
**What to do**:
1. Open Gephi
2. Import nodes CSV (Data Laboratory → Import Spreadsheet)
3. Import edges CSV (as edges/connections)
4. Apply layout (ForceAtlas2 works well)
5. Color by Type attribute
6. Analyze and visualize

**Use for**: Creating publication-quality network diagrams, identifying clusters, finding central nodes

#### For R (Statistical Analysis)
**What you get**: CSV data + R script template
**What to do**:
1. Place both files in same folder
2. Open R or RStudio
3. Run: `source("r_analysis_xxx.R")`
4. Script loads data, creates graph, shows statistics, plots network

**Use for**: Quantitative analysis, path length distribution, centrality measures, statistical comparisons

---

## ⚡ Performance Tips

### Network Diagram
- **Records with many connections?** → Use depth 1-2
- **Specific record with few connections?** → Can use depth 3
- **Slow to load?** → Reduce depth and refresh
- **Too cluttered?** → Zoom in and drag nodes apart

### Path Finding
- **No paths found?** → Increase max depth
- **Too many paths?** → Consider if records are common connectors
- **Want faster results?** → Decrease max depth to 2-3

---

## 🐛 Troubleshooting

### Network tab shows "No relationships to display"
**Cause**: Selected record has no relationships in the database
**Solution**: Select a different record or check if relationships exist for this record type

### Path finder says "No connection found"
**Cause**: Records are not connected within the max depth
**Solution**: 
- Increase max depth (try 5)
- Check if a connection exists at all
- Try searching for an intermediate record

### Export files not downloading
**Cause**: Browser blocking downloads
**Solution**: Check browser popup blocker settings and allow downloads from this site

### Network diagram not showing
**Cause**: D3.js library not loading
**Solution**: Check internet connection (D3 loads from CDN) or check browser console for errors

---

## 💡 Pro Tips

1. **Combine views**: Use Results → Network → Details workflow
   - Search/filter in Results
   - Explore connections in Network
   - Read details in Details panel

2. **Save interesting paths**: Use browser screenshot or export to Gephi to save network discoveries

3. **Compare networks**: Open multiple browser tabs to compare networks of different records side-by-side

4. **Depth strategy**: Start at 2, increase if needed
   - Keeps interface responsive
   - Prevents overwhelming displays
   - Easy to increase if you need more

5. **Export workflow**: 
   - Use path finder for quick exploration
   - Export to Gephi for presentation
   - Export to R for statistics
   - Combine with existing CSV export for complete dataset

---

## 📚 Additional Resources

- `ADVANCED_RELATIONSHIP_FEATURES.md` - Detailed technical documentation
- `IMPLEMENTATION_COMPLETE.md` - Complete feature list and testing checklist
- `RELATIONSHIP_INTEGRATION_PROPOSAL.md` - Original proposal and roadmap

---

## ❓ Common Questions

**Q: Can I export the entire network diagram?**  
A: Not directly, but you can:
- Screenshot the browser window
- Export paths and import to Gephi for publication-quality diagrams

**Q: Why are some paths longer than expected?**  
A: The algorithm finds all paths, not just the shortest. Longer paths show alternative routes that may be historically meaningful.

**Q: Can I filter the network diagram?**  
A: Currently no, but you can:
- Use Results filters first, then view network of filtered records
- Export to Gephi for advanced filtering

**Q: How do I find all records connected to X?**  
A: 
- Select record X
- Network tab with depth 2-3
- All visible nodes are connected

**Q: Can I see relationship metadata in the network?**  
A: Relationship types are visible in the path finder. For full metadata, click nodes to view in Details panel.

---

## 🎓 Learning Path

### Beginner (5 minutes)
1. Open database explorer
2. Select any record
3. Click Network tab
4. Explore by clicking nodes

### Intermediate (15 minutes)
1. Choose a research question
2. Use Record type filters
3. Explore networks of filtered results
4. Try path finder between interesting records

### Advanced (30 minutes)
1. Export paths for a research question
2. Import to Gephi and explore layout algorithms
3. Run R script to calculate statistics
4. Combine with your research workflow

---

## 🚦 Getting Help

If you encounter issues or have questions:

1. **Check documentation**: Review the files mentioned above
2. **Browser console**: Press F12 to check for error messages
3. **Report issues**: Document what you were trying to do, what you expected, what happened instead

---

**Ready to explore?** Head to `/explore-database/` and start discovering connections in the Unknown Hands database!
