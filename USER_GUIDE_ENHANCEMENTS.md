# Smart Factory Assessment - Quick User Guide

## 🎯 What's New?

### 1. Shop Unit Selection
Instead of typing a plant location, you now select from 8 predefined manufacturing units:
- Press Shop
- BIW 1, BIW 2, BIW 3
- Paint Shop 1, Paint Shop 2
- Assembly Line 1, Assembly Line 2

### 2. Dimension-Specific Assessment
You can now assess specific dimensions like:
- **Asset Connectivity & OEE** (NEW!)
- MES & System Integration
- And all other existing dimensions

### 3. Visual Evidence with Images
For each maturity level (Level 1-5):
- Click to expand the "Level X Visual Evidence" section
- Enter an image URL
- See the image preview at 75% width
- Perfect for documenting actual equipment, dashboards, or systems

### 4. Real-Time Count Tracking
Two prominent boxes show:
- **Overall Count**: Total capabilities being assessed
- **Checked Count**: Capabilities you've marked as achieved

### 5. Smart Reports with Filtering
In the Dashboard/Reports:
- Select a specific dimension to view
- See "NA" if no assessment data exists yet
- Filter by shop unit and dimension combination

---

## 📝 How to Use

### Conducting an Assessment

1. **Go to Smart Factory Assessment** (from sidebar)

2. **Fill Basic Information:**
   ```
   Plant Name: [Enter your plant name]
   Shop Unit: [Select from dropdown]
   Assessment Date: [Pick date]
   Dimension/Area: [Select specific dimension or "All Dimensions"]
   ```

3. **For Each Level (expand one at a time):**
   
   **Add Notes:**
   - Type observations in "Level X Notes & Evidence" text box
   - Document current capabilities, gaps, evidence
   
   **Add Visual Evidence (Optional):**
   - Click "Level X Visual Evidence" to expand
   - Enter image URL (e.g., screenshot from SharePoint, photo URL)
   - Image displays at 75% width automatically
   
   **Check Capabilities:**
   - Click checkboxes for capabilities your shop unit has achieved
   - Each checkbox updates the "Checked Count" in real-time

4. **Monitor Progress:**
   - **Overall Count**: Shows total capabilities (e.g., 45)
   - **Checked Count**: Shows what you've checked (e.g., 23)
   - Percentage calculated automatically

5. **Save:**
   - Click "Save & Calculate Scores" button
   - All data saved to database
   - Maturity scores calculated automatically

---

### Viewing Reports

1. **Go to Dashboard** (from sidebar)

2. **Filter Data:**
   ```
   Dimension/Area: [Select specific dimension]
   ```
   - Choose "Asset Connectivity & OEE" to see only OEE assessments
   - Choose "All Dimensions" to see everything

3. **Interpret Results:**
   - **Green checkmarks** ✓ = Capability achieved
   - **Empty boxes** ○ = Not yet achieved
   - **Progress bars** show completion percentage
   - **NA message** = No assessment data for selected dimension

---

## 🏭 Asset Connectivity & OEE Levels

### Level 1 – Basic Connectivity
**What it means:** Individual machines connected, manual tracking  
**Example:** PLCs collecting data, Excel sheets for OEE

### Level 2 – Centralized Monitoring  
**What it means:** SCADA system showing real-time data  
**Example:** Central dashboard showing line status, automated data collection

### Level 3 – Integrated OEE Analytics
**What it means:** OEE data flows into ERP/MES automatically  
**Example:** SAP showing OEE trends, KPI dashboards

### Level 4 – Predictive OEE Optimization
**What it means:** AI predicts issues before they happen  
**Example:** "Machine 5 likely to fail in 2 days" alerts

### Level 5 – Autonomous Asset Management
**What it means:** Self-healing systems, AI optimization  
**Example:** System automatically adjusts parameters to maximize OEE

---

## 💡 Pro Tips

### For Assessors:
1. **Start with Level 1** - Easier capabilities first
2. **Add photos** - Visual evidence makes reviews easier
3. **Be specific in notes** - "HMI installed on Line 3" better than "Some automation"
4. **Save frequently** - Don't lose your work
5. **Use dimension filter** - Focus on one area at a time

### For Managers:
1. **Compare shop units** - Which BIW line is most mature?
2. **Track over time** - Conduct assessments quarterly
3. **Focus improvements** - Low-scoring dimensions need attention
4. **Set targets** - Use "Overall Count" vs "Checked Count" for goals

### For Image URLs:
- **SharePoint**: Right-click image → Copy link
- **Google Drive**: Share → Get link → Use direct link
- **Local network**: Use full path (e.g., `\\server\images\machine.jpg`)
- **Screenshot tools**: Upload to image host, use URL

---

## 🚨 Troubleshooting

### "Image won't load"
- Check URL is correct and accessible
- Try opening URL in browser first
- Ensure image is shared/public if using cloud storage

### "No data available (NA)"
- You haven't assessed that dimension yet
- Go to Smart Factory Assessment and create an assessment
- Select that specific dimension

### "Counts don't match"
- Overall Count = Total capabilities in database
- Checked Count = Only items YOU checked
- They should never be equal (perfection is rare!)

---

## 📊 Example Workflow

**Scenario:** Assessing BIW 1 for Asset Connectivity & OEE

```
1. Smart Factory Assessment
   ↓
2. Plant Name: "Chakan Plant"
   Shop Unit: "BIW 1"
   Dimension: "Asset Connectivity & OEE"
   ↓
3. Level 1 (Basic Connectivity)
   - Check: "PLC installed" ✓
   - Check: "Manual OEE tracking" ✓
   - Notes: "All welding robots have PLCs"
   - Image: [URL to photo of PLC panel]
   ↓
4. Level 2 (Centralized Monitoring)
   - Check: "SCADA system installed" ✓
   - Notes: "SCADA covers 80% of line"
   - Image: [URL to SCADA screenshot]
   ↓
5. Level 3 (Integrated Analytics)
   - Uncheck: Not yet integrated with SAP
   - Notes: "Integration project planned Q2 2026"
   ↓
6. Save & Calculate
   ↓
7. Go to Dashboard
   Filter by: "Asset Connectivity & OEE"
   ↓
8. Review: BIW 1 is at Level 2.3 maturity
```

---

## 🔄 Database Update (One-Time Setup)

**Already done for you!** But if you need to reset:

```bash
# Windows
update-database.bat

# This will:
# ✓ Delete old database
# ✓ Create new schema with all fields
# ✓ Load base data
# ✓ Add Asset Connectivity & OEE dimension
```

---

## 📞 Need Help?

**Documentation:**
- Full details: `SMART_FACTORY_ENHANCEMENT.md`
- Technical guide: `IMPLEMENTATION_SUMMARY.md`
- Quick start: `QUICK_START.md`

**Common Questions:**
- Q: Can I add custom shop units?  
  A: Yes, edit `SHOP_UNITS` array in SmartFactoryChecksheet.jsx

- Q: Can I add more dimensions?  
  A: Yes, create script similar to `add_asset_connectivity_oee.py`

- Q: Where are images stored?  
  A: URLs stored in database, actual images on your server/cloud

---

**Last Updated:** January 21, 2026  
**Version:** 2.0 - Enhanced with Shop Units, Dimensions, and Visual Evidence
