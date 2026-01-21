# Quick Start Guide - Smart Factory Assessment
## Post-Login Landing Page & CheckSheetData Integration

## 🚀 Quick Test (5 Minutes)

### 1. Start Servers
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 2. Test Flow
1. Open http://localhost:3000
2. Click "Get Started"
3. Login with any credentials
4. **SEE NEW**: 4-card landing page
5. Click "Rating Scales" card
6. **VERIFY**: Shows 11 dimensions with 5 levels each
7. Click "Home" tab to return to cards
8. Click "Smart Factory Assessment" card
9. **VERIFY**: Shows Level 1-5 checksheet criteria

## ✅ What's New

### 1. Landing Page After Login
- 4 beautiful cards with hover effects
- Blue (Smart Factory Assessment)
- Green (Dashboard)  
- Purple (Rating Scales)
- Red (Matrices)

### 2. Rating Scales Page
- **OLD**: 3 hardcoded levels per dimension
- **NEW**: 11 dimensions from Excel with 5 levels each
- Expandable dimension cards
- Refresh button to reload data

### 3. Smart Factory Checksheet
- Already working perfectly
- Shows 47 criteria across 5 levels
- Integrated with CheckSheetData.xlsx

## 📊 Data Summary

**CheckSheet**: 47 maturity criteria
- Level 1: 7 items (Connected & Visible)
- Level 2: 10 items (Integrated & Data-Driven)
- Level 3: 10 items (Predictive & Optimized)
- Level 4: 10 items (Flexible, Agile Factory)
- Level 5: 10 items (Autonomous, Human-Centric)

**RatingScales**: 120 records, 11 dimensions
1. Strategy and Governance
2. Asset Connectivity and OEE
3. MES & System Integration
4. Traceability and Quality
5. Maintenance and Reliability
6. Logistics and Supply Chain
7. Workforce and User Experience
8. Sustainability & Energy
9. Multi-Plant Orchestration
10. Cyber Security and Data Governance
11. Utility Areas

## 🔧 Troubleshooting

### Empty Data?
Run data loaders:
```bash
python backend/load_checksheet_data.py
python backend/load_rating_scales_data.py
```

### Check Database Status
```bash
python test_db_status.py
```

### Reset Database
```bash
cd backend
rm manufacturing.db
python -c "from database import init_db; init_db()"
python load_checksheet_data.py
python load_rating_scales_data.py
```

## 📁 Key Files

**New Files:**
- `frontend/src/components/shared/HomePage.jsx` - 4-card landing
- `backend/load_checksheet_data.py` - CheckSheet loader
- `backend/load_rating_scales_data.py` - RatingScales loader
- `test_db_status.py` - Database verification script

**Modified Files:**
- `frontend/src/App.jsx` - Added HomePage routing
- `backend/main.py` - Updated refresh endpoints
- `frontend/src/components/M_M/RatingScales.jsx` - API integration

**Data Source:**
- `frontend/src/components/M_M_Data/CheckSheetData.xlsx`
  - "CheckSheet" tab → Maturity Levels
  - "RatingScales" tab → Rating Scales

## 🎯 Test Checklist

- [ ] Landing page shows 4 cards after login
- [ ] Clicking cards navigates to modules
- [ ] Rating Scales shows 11 dimensions
- [ ] Each dimension has 5 levels (1-5)
- [ ] Smart Factory Assessment shows 47 criteria
- [ ] Criteria grouped by Level 1-5
- [ ] "Home" tab returns to card selection
- [ ] Refresh buttons work
- [ ] No console errors

## 📸 Expected UI Flow

```
Landing Page → Login → 🆕 4-Card HomePage → Module Pages
                              ↓
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
              Assessment  Dashboard  Rating Scales  Matrices
```

## 🎉 Success Indicators

✅ **Backend**: 47 maturity levels + 120 rating scales loaded  
✅ **Frontend**: 4-card landing page displays correctly  
✅ **API**: All endpoints return data  
✅ **Navigation**: Seamless flow between pages  
✅ **Data**: Real Excel data (not hardcoded)  

## 📞 Support

For issues:
1. Check `LANDING_PAGE_IMPLEMENTATION.md` for detailed documentation
2. Run `test_db_status.py` to verify database
3. Check browser console for errors
4. Verify both servers are running

---

**Implementation Date**: January 21, 2026  
**Status**: ✅ Complete & Ready for Testing
