# Database Schema Update Guide

## Changes Made

### New Assessment Fields Added:
1. **plant_location** (String) - Capture plant location information
2. **level1_notes** through **level5_notes** (Text) - Level-specific notes and evidence
3. **created_at** (DateTime) - Timestamp when assessment was created
4. **updated_at** (DateTime) - Timestamp when assessment was last updated

## Files Modified

### Backend:
- ✅ `backend/database.py` - Updated Assessment model with new fields
- ✅ `backend/main.py` - Updated Pydantic models (AssessmentCreate, AssessmentResponse)
- ✅ `backend/main.py` - Added PUT endpoint for updating assessments

### Frontend:
- ✅ `frontend/src/components/M_M/SmartFactoryChecksheet.jsx`
  - Added Plant Location input field
  - Added level-specific notes text areas (L1-L5)
  - Updated save functionality to persist all data
  - Updated initializeAssessment to load existing notes

## Database Migration Steps

### Option 1: Quick Reinitialize (Recommended for Development)

**IMPORTANT**: Stop all running servers before proceeding!

```bash
# Stop backend server if running (Ctrl+C in terminal)

# Navigate to backend directory
cd backend

# Delete old database
del manufacturing.db

# Create new database with updated schema
python -c "from database import init_db; init_db()"

# Restart backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then use the UI **Refresh** buttons to load data from Excel files.

### Option 2: Production Migration with Data Preservation

If you have important assessment data to preserve:

1. **Export existing data** (before deleting database):
```python
# Run this in Python console from backend directory
from database import SessionLocal, Assessment
from datetime import datetime
import json

db = SessionLocal()
assessments = db.query(Assessment).all()

data = []
for a in assessments:
    data.append({
        'plant_name': a.plant_name,
        'assessor_name': a.assessor_name,
        'notes': a.notes,
        'assessment_date': str(a.assessment_date)
    })

with open('backup_assessments.json', 'w') as f:
    json.dump(data, f, indent=2)

print(f"✅ Backed up {len(data)} assessments")
```

2. **Reinitialize database** (follow Option 1 steps above)

3. **Manually recreate** important assessments through the UI with the new fields

## Testing the Changes

### 1. Start the Application
```bash
# Use the unified launcher
start-dev.bat
```

### 2. Test Plant Location Field
- Open Smart Factory CheckSheet
- Enter plant name: "Test Plant"
- Enter plant location: "Mumbai, India"
- Enter assessment date
- Save the assessment

### 3. Test Level Notes
- Expand each level (L1-L5)
- Add notes in the "Level X Notes & Evidence" text area
- Example notes:
  - L1: "Basic manual processes observed"
  - L2: "Some automation in packaging line"
  - L3: "Digital monitoring systems in place"
  - etc.

### 4. Verify Persistence
- Click "Save & Calculate Scores"
- Refresh the page
- Verify that:
  - Plant location is still filled in
  - Level notes are preserved (expand each level to check)
  - Checksheet selections are maintained

## UI Changes

### Assessment Information Section
Now displays **3 columns** instead of 2:
- Plant Name (existing)
- **Plant Location** (new)
- Assessment Date (existing)

### Level Sections
Each level now includes:
1. **Level Notes & Evidence** text area (highlighted in blue)
   - Appears at the top of each expanded level
   - Placeholder: "Add observations, evidence, or notes for Level X capabilities..."
   - 3 rows high for comfortable typing

2. **Capability Checkboxes** (existing)
   - Below the notes area
   - Same functionality as before

## API Changes

### New Endpoint
**PUT `/api/mm/assessments/{assessment_id}`**
- Updates assessment information including level notes
- Request body: Same as POST (AssessmentCreate schema)
- Response: Updated assessment object

### Updated Endpoints
- **POST `/api/mm/assessments`** - Now accepts plant_location and level notes
- **GET `/api/mm/assessments/{assessment_id}`** - Returns plant_location and level notes

## Database Schema

```python
class Assessment(Base):
    __tablename__ = 'assessments'
    
    # Existing fields
    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer, ForeignKey('areas.id'), nullable=False)
    plant_name = Column(String)
    assessor_name = Column(String)
    notes = Column(Text)
    assessment_date = Column(DateTime)
    
    # NEW FIELDS
    plant_location = Column(String)         # Plant location
    level1_notes = Column(Text)              # L1 notes
    level2_notes = Column(Text)              # L2 notes
    level3_notes = Column(Text)              # L3 notes
    level4_notes = Column(Text)              # L4 notes
    level5_notes = Column(Text)              # L5 notes
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## SQLite Persistence Confirmed

The project is configured to use **persistent SQLite** database:

### Local Development
- Database location: `backend/manufacturing.db`
- File-based, persists across server restarts
- NOT using `/tmp` directory

### Vercel Deployment
- Uses ephemeral `/tmp/manufacturing.db` (by design for serverless)
- Automatically detected via `VERCEL` environment variable
- Data refreshed from Excel files on each cold start

See `backend/database.py` lines 8-13 for the configuration logic.

## Troubleshooting

### Issue: "Database is locked"
**Cause**: Backend server is still running
**Solution**: Stop the backend server (Ctrl+C), then retry database operations

### Issue: "No module named 'sqlalchemy'"
**Cause**: Python environment not configured or dependencies not installed
**Solution**: 
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Data not persisting
**Cause**: Using old database schema
**Solution**: Follow "Database Migration Steps" above to reinitialize database

### Issue: Frontend not showing new fields
**Cause**: Frontend build is cached
**Solution**: 
```bash
cd frontend
rm -rf node_modules/.cache
npm start
```

## Next Steps

After successful database update:

1. ✅ Test the new fields thoroughly
2. ✅ Document any assessment workflows that need updating
3. ✅ Train users on the new level notes feature
4. ✅ Update any API documentation
5. ✅ Update `.github/copilot-instructions.md` if needed

## Support

If you encounter issues:
1. Check the terminal output for error messages
2. Verify backend server is running: `http://localhost:8000/docs`
3. Check browser console for frontend errors
4. Review `backend/manufacturing.db` file exists and has recent timestamp
5. Use API diagnostics: `http://localhost:3000/?diagnostics`
