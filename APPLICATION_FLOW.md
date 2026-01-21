# Application Flow Diagram
## Updated with Post-Login Landing Page

```
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION FLOW                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Landing Page    │  
│  (Marketing)     │  ← User arrives here
│                  │
│  [Get Started]   │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Login Page      │
│                  │  ← Authenticate user
│  [Username]      │
│  [Password]      │
│  [Login Button]  │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────────────────────────┐
│              🆕 HOME PAGE (4 CARDS)                       │
│  ┌─────────────────┐  ┌──────────────────┐              │
│  │  Smart Factory  │  │   Dashboard      │              │
│  │   Assessment    │  │                  │              │
│  │   [Blue Card]   │  │  [Green Card]    │              │
│  └────────┬────────┘  └────────┬─────────┘              │
│                                                          │
│  ┌─────────────────┐  ┌──────────────────┐              │
│  │  Rating Scales  │  │    Matrices      │              │
│  │                 │  │                  │              │
│  │  [Purple Card]  │  │   [Red Card]     │              │
│  └────────┬────────┘  └────────┬─────────┘              │
└──────────┼────────────┼─────────┼────────────┼──────────┘
           │            │         │            │
           ↓            ↓         ↓            ↓
    ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐
    │ Smart    │  │Dashboard│  │ Rating   │  │Matrices │
    │ Factory  │  │ (Reports│  │ Scales   │  │         │
    │Assessment│  │  View)  │  │          │  │         │
    └──────────┘  └─────────┘  └──────────┘  └─────────┘


┌─────────────────────────────────────────────────────────────────┐
│                  NAVIGATION STRUCTURE                            │
└─────────────────────────────────────────────────────────────────┘

After selecting a card, user sees navigation header:

┌───────────────────────────────────────────────────────────────┐
│  [M] Mahindra & Mahindra                    [Back to Home]    │
│      Digital Maturity Assessment                              │
├───────────────────────────────────────────────────────────────┤
│ [🏠 Home] [🏭 Smart Factory] [📊 Dashboard] [⭐ Scales] [⊞ Matrices] │
└───────────────────────────────────────────────────────────────┘
      ↑
   Click to return to 4-card HomePage


┌─────────────────────────────────────────────────────────────────┐
│                  DATA FLOW ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────┘

Excel File (CheckSheetData.xlsx)
         │
         ├─── CheckSheet Tab
         │         │
         │         ↓
         │    load_checksheet_data.py
         │         │
         │         ↓
         │    maturity_levels table (47 records)
         │         │
         │         ↓
         │    API: /api/mm/maturity-levels
         │         │
         │         ↓
         │    SmartFactoryChecksheet.jsx
         │
         └─── RatingScales Tab
                   │
                   ↓
              load_rating_scales_data.py
                   │
                   ↓
              rating_scales table (120 records)
                   │
                   ↓
              API: /api/mm/rating-scales
                   │
                   ↓
              RatingScales.jsx


┌─────────────────────────────────────────────────────────────────┐
│              SMART FACTORY ASSESSMENT VIEW                       │
└─────────────────────────────────────────────────────────────────┘

Level 1: Connected & Visible (7 items)
  ├─ 1.1 Instrumented Assets & Lines
  │   ├─ 1.1a Machines with sensors...
  │   └─ 1.1b Digital andon/OEE dashboards...
  └─ 1.2 Basic Digital Material & Quality Tracking
      ├─ 1.2a Barcode/RFID tracking...
      └─ 1.2b Digital NC logging...

Level 2: Integrated & Data-Driven (10 items)
Level 3: Predictive & Optimized (10 items)
Level 4: Flexible, Agile Factory (10 items)
Level 5: Autonomous, Human-Centric (10 items)


┌─────────────────────────────────────────────────────────────────┐
│                  RATING SCALES VIEW                              │
└─────────────────────────────────────────────────────────────────┘

Strategy and Governance [▼]
  ├─ Level 1: 1 – Connected & Visible
  ├─ Level 2: 2 – Integrated & Data Driven
  ├─ Level 3: 3 – Predictive & Optimized
  ├─ Level 4: 4 – Flexible, Agile Factory
  └─ Level 5: 5 – Autonomous, Human‑Centric

Asset Connectivity and OEE [▶]
MES & System Integration [▶]
Traceability and Quality [▶]
... (11 dimensions total)


┌─────────────────────────────────────────────────────────────────┐
│                  COLOR CODING SCHEME                             │
└─────────────────────────────────────────────────────────────────┘

HOME PAGE CARDS:
  • Smart Factory Assessment → Blue gradient
  • Dashboard               → Green gradient
  • Rating Scales           → Purple gradient
  • Matrices                → Red gradient

MATURITY LEVELS:
  • Level 1 → Red badge
  • Level 2 → Orange badge
  • Level 3 → Yellow badge
  • Level 4 → Blue badge
  • Level 5 → Green badge

DIMENSIONS (Rating Scales):
  • Each dimension gets unique gradient color
  • Auto-assigned from 17-color palette
```

## Key Features

### 🆕 New Components
1. **HomePage.jsx** - Post-login card selection interface
2. **Updated App.jsx** - New routing with HomePage state
3. **New RatingScales.jsx** - API-driven, expandable dimensions

### 🔄 Data Integration
- **CheckSheetData.xlsx** is now the single source of truth
- **Automated loaders** parse Excel and populate database
- **API endpoints** serve dynamic data to frontend
- **Refresh buttons** allow re-loading data without restart

### ✨ User Experience
- **Intuitive navigation** with visual card selection
- **Color-coded levels** for quick visual assessment
- **Expandable sections** to manage information density
- **Responsive design** works on all screen sizes
- **Smooth transitions** between views

### 🎯 Assessment Flow
1. User logs in
2. Sees 4 module cards
3. Selects desired module
4. Interacts with module features
5. Can return home via "Home" tab
6. Can refresh data as needed
