# Quick Start - Assessment Data Capture Update

## What Changed?
Added **plant location** field and **level-specific notes** (L1-L5) to Smart Factory CheckSheet assessments with SQLite persistence.

## How to Apply Changes

### Step 1: Stop Servers (REQUIRED)
Press `Ctrl+C` in all terminal windows running:
- Backend server (uvicorn)
- Frontend server (npm start)

### Step 2: Update Database
```bash
cd backend
del manufacturing.db
python -c "from database import init_db; init_db()"
```

### Step 3: Restart Application
```bash
# From project root
start-dev.bat
```

### Step 4: Load Data
Open `http://localhost:3000` and click **Refresh** buttons in:
- Smart Factory CheckSheet → "Refresh Simulated Data"
- Reports → "Refresh"
- Rating Scales → "Refresh"

## How to Use New Features

### 1. Plant Location
- Open Smart Factory CheckSheet
- Fill in the **Plant Location** field (new field next to Plant Name)
- Example: "Mumbai Manufacturing Plant"

### 2. Level Notes (L1-L5)
- Expand any level (Level 1 through Level 5)
- Find the blue **"Level X Notes & Evidence"** text box at the top
- Add observations, evidence, or notes for that level
- Example L1 note: "Basic manual data entry observed in production line"

### 3. Save Everything
- Click **"Save & Calculate Scores"** button
- All data is saved to SQLite database:
  - Plant name
  - Plant location
  - Assessment date
  - All level notes (L1-L5)
  - Checkbox selections

### 4. Verify Persistence
- Refresh the page (F5)
- Data should still be there:
  - Plant location filled in
  - Level notes preserved (expand each level to verify)
  - Checkboxes still selected

## New UI Elements

### Assessment Information Section
```
┌─────────────────────────────────────────────────────────┐
│ ASSESSMENT INFORMATION                                  │
├─────────────────┬─────────────────┬────────────────────┤
│ Plant Name      │ Plant Location  │ Assessment Date    │
│ [Input field]   │ [Input field]   │ [Date picker]      │
└─────────────────┴─────────────────┴────────────────────┘
```

### Level Section (Example: Level 1)
```
┌─────────────────────────────────────────────────────────┐
│ ▼ LEVEL 1: INITIAL (Expanded)                          │
├─────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────┐   │
│ │ Level 1 Notes & Evidence                          │   │
│ │ [Text area - 3 rows]                              │   │
│ │ Add observations, evidence, or notes...           │   │
│ └───────────────────────────────────────────────────┘   │
│                                                         │
│ ☐ Capability 1 description                             │
│ ☐ Capability 2 description                             │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Database is Locked
**Problem:** Can't delete manufacturing.db  
**Solution:** Stop backend server first (Ctrl+C)

### Module Not Found Error
**Problem:** Python can't find sqlalchemy/pandas  
**Solution:** 
```bash
cd backend
pip install -r requirements.txt
```

### Data Not Persisting
**Problem:** Changes disappear after refresh  
**Solution:** Run database update steps (Step 2 above)

### Frontend Not Updating
**Problem:** Don't see new fields  
**Solution:** Clear browser cache or hard refresh (Ctrl+Shift+R)

## Files to Review

- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Full Migration Guide:** `DATABASE_UPDATE_GUIDE.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING_EMPTY_DATA.md`

## Need Help?

1. Check API status: `http://localhost:8000/docs`
2. Run diagnostics: `http://localhost:3000/?diagnostics`
3. Review console errors in browser (F12)
4. Check terminal output for backend errors

---

**Total Time to Apply:** ~5 minutes (including data refresh)
