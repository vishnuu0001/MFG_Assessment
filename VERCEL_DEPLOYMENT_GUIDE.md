# Vercel Deployment Guide
## Mahindra & Mahindra Digital Maturity Tool

**Updated:** January 2026

This guide provides complete instructions for deploying both frontend and backend to Vercel serverless.

---

## 🎯 Overview

This application uses a **dual serverless deployment** architecture:
- **Frontend**: React app deployed to Vercel
- **Backend**: FastAPI deployed to Vercel as serverless functions
- **Database**: SQLite (development) or PostgreSQL (production recommended)

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [x] GitHub account with your repository pushed
- [x] Vercel account (free tier is sufficient)
- [x] All recent code changes committed and pushed to GitHub
- [x] Database initialized locally (for testing)

---

## 🚀 Part 1: Backend Deployment

### Step 1.1: Prepare Backend for Deployment

The backend is already configured for Vercel serverless! Verify these files exist:

**Essential Files:**
```
api/
  └── index.py                 # Serverless entry point
vercel.json                    # Vercel configuration
requirements.txt               # Python dependencies (root level)
backend/
  ├── main.py                  # FastAPI application
  ├── database.py              # Database models
  ├── requirements.txt         # Backend dependencies
  └── MM_Data.xlsx            # Data source
```

**Key Configuration (already done):**

1. **`api/index.py`** - Serverless wrapper:
```python
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Import FastAPI app
from main import app

# Vercel serverless handler
handler = app
```

2. **`vercel.json`** - Deployment config:
```json
{
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
```

3. **Database** - Uses ephemeral `/tmp` on Vercel:
```python
# backend/database.py
if os.environ.get('VERCEL'):
    DATABASE_URL = "sqlite:////tmp/manufacturing.db"
else:
    DATABASE_URL = "sqlite:///./manufacturing.db"
```

⚠️ **CRITICAL**: On Vercel, `/tmp` storage is **ephemeral** which means:
- **Data resets** on every new deployment
- **Data resets** when serverless instances restart (cold starts)
- **User-created assessments WILL BE LOST** between restarts
- **Seed data auto-reloads** but user data does not persist

✅ **Solution**: For production use, migrate to PostgreSQL (see Part 4) to ensure data persistence.

### Step 1.2: Deploy Backend to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Create New Project**
   - Click **"Add New"** → **"Project"**
   - Click **"Import"** next to your repository
   - If not listed, click **"Adjust GitHub App Permissions"**

3. **Configure Backend Project**
   - **Project Name**: `mahindra-backend` (or your preferred name)
   - **Framework Preset**: **Other**
   - **Root Directory**: Leave as **`.` (root)**
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: Leave as default

4. **Environment Variables** (Optional for PostgreSQL - see Part 4)
   - Click **"Environment Variables"**
   - Add variables if using PostgreSQL (skip for now)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for deployment to complete
   - Copy your backend URL: `https://mahindraservicesapi.vercel.app/`

6. **Verify Backend Deployment**
   - Visit: `https://your-backend-url.vercel.app/docs`
   - You should see FastAPI Swagger documentation
   - Test endpoint: `https://your-backend-url.vercel.app/api/mm/areas`

---

## 🎨 Part 2: Frontend Deployment

### Step 2.1: Prepare Frontend

The frontend is already configured! Key files:

**`frontend/src/config.js`**:
```javascript
const isDevelopment = process.env.NODE_ENV === 'development';
export const API_BASE_URL = isDevelopment 
  ? '' 
  : (import.meta.env.VITE_API_URL || '');

export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;
```

### Step 2.2: Deploy Frontend to Vercel

1. **Create Frontend Project**
   - Click **"Add New"** → **"Project"**
   - Import the **same repository** (Vercel allows multiple projects per repo)

2. **Configure Frontend Project**
   - **Project Name**: `mahindra-frontend` (or your preferred name)
   - **Framework Preset**: **Vite** (auto-detected)
   - **Root Directory**: **`frontend`** ⚠️ Important!
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables** ⚠️ CRITICAL
   - Click **"Environment Variables"**
   - Add the following:
     
     | Name | Value | Environments |
     |------|-------|--------------|
     | `VITE_API_URL` | `https://mahindraservicesapi.vercel.app/` | Production, Preview |
   
   - Replace with YOUR actual backend URL from Step 1.2
   - ⚠️ **Must start with `VITE_` for Vite to expose it**
   - ⚠️ **Include trailing slash**

4. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Frontend will be at: `https://mahindra-frontend.vercel.app`

### Step 2.3: Verify Frontend Deployment

1. **Visit your frontend URL**
2. **Check API Diagnostics**:
   - Go to: `https://your-frontend-url.vercel.app/?diagnostics`
   - Verify all API connections show ✅ green

3. **Verify Data Loaded**:
   - Navigate to "Smart Factory CheckSheet"
   - **Data should already be there!** ✨ (auto-loaded from seed_data.py)
   - If empty, click **"Refresh Simulated Data"** as fallback
   - Navigate to "Reports" - areas and dimensions should be visible

---

## 🔄 Part 3: Data Management

**✅ AUTOMATIC**: Seed data is now loaded automatically on first deployment!

### Automatic Seed Data Loading

The application now automatically loads seed data when the database is empty:

**On Vercel (Serverless):**
- `api/index.py` checks if database is empty on cold start
- Automatically loads seed data from `seed_data.py`
- No manual intervention needed

**On Local Development:**
- Backend startup event checks database on server start
- Auto-loads seed data if areas, dimensions, or maturity levels are missing
- Transparent to users

**Seed Data Includes:**
- 3 Manufacturing Areas (Press Shop, Assembly Area, Machine Shop 1)
- 26 Dimensions across all areas
- 60+ Maturity Level capabilities (L1-L5)
- Rating scale definitions for all dimensions

### Initial Data Load (Automatic)

After deploying to Vercel:

1. **Visit your frontend URL**
   - Example: `https://mahindra-frontend.vercel.app`
   
2. **Navigate to any page**
   - Smart Factory CheckSheet
   - Reports
   - Rating Scales

3. **Data is already there!** ✨
   - No "Refresh" buttons needed
   - Seed data loaded automatically
   - Ready to create assessments

### Manual Data Refresh (Optional)

If you need to reload data from Excel files:

1. **Smart Factory CheckSheet**
   - Click **"Refresh Simulated Data"** button
   - Reloads maturity levels from `MM_Data.xlsx`

2. **Reports**
   - Click **"Refresh"** button
   - Reloads areas and dimensions from Excel

3. **Rating Scales**
   - Click **"Refresh"** button
   - Reloads dimension rating scales from Excel

4. **All Data at Once**
   - Use API endpoint: `POST /api/mm/refresh-all-data`
   - Refreshes all three data sources

### Data Persistence Notes

**Vercel Deployment (SQLite with `/tmp`):**
- Database stored in `/tmp` directory (ephemeral storage)
- ⚠️ **CRITICAL LIMITATION**: 
  - **All data resets** on deployment or serverless restart
  - **User assessments are NOT preserved** between restarts
  - Only **seed data** (areas, dimensions, maturity levels) auto-reloads
  - **User-created data is LOST**: assessments, selections, notes
- ✅ **Seed data auto-reloads**: System automatically repopulates base data
- 💡 **For Production**: **MUST migrate to PostgreSQL** to preserve user data (see Part 4 below)

**Local Development (SQLite):**
- Database: `backend/manufacturing.db` (file-based storage)
- ✅ **Fully Persistent**: All data survives server restarts
- ✅ **Auto-seeding**: Only loads seed data if database is empty
- ✅ **User data preserved**: Assessments and selections persist

**⚠️ IMPORTANT FOR PRODUCTION**:
If you need to preserve user assessments and data, you **MUST** use PostgreSQL (Part 4). The SQLite `/tmp` approach is only suitable for:
- Development/testing
- Demos and prototypes
- Environments where data loss is acceptable

---

## 🗄️ Part 4: Production Database (REQUIRED for Data Persistence)

⚠️ **CRITICAL**: SQLite on Vercel `/tmp` loses all user data on restart. For production use, you **MUST** migrate to PostgreSQL.

**Why PostgreSQL is Required:**
- ✅ Data persists across deployments and restarts
- ✅ User assessments are preserved permanently
- ✅ No data loss on application updates
- ✅ Better performance for concurrent users
- ✅ Suitable for production workloads

For production deployment, migrate from SQLite to PostgreSQL for permanent data persistence.

### Option A: Neon (Recommended - Free Tier)

1. **Create Neon Account**
   - Visit https://neon.tech
   - Sign up (free tier: 1 project, 10 databases)

2. **Create Database**
   - Click **"Create Project"**
   - Name: `mahindra-manufacturing`
   - Region: Choose closest to your users
   - Copy **Connection String**

3. **Update Backend Environment Variables**
   - Go to Vercel backend project → **Settings** → **Environment Variables**
   - Add:
     | Name | Value |
     |------|-------|
     | `DATABASE_URL` | `postgresql://user:pass@host/dbname?sslmode=require` |
   
4. **Update `backend/database.py`**:
   ```python
   import os
   
   DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///./manufacturing.db')
   
   engine = create_engine(
       DATABASE_URL,
       connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
   )
   ```

5. **Redeploy Backend**
   - Go to **Deployments** → Latest deployment → **"..."** → **Redeploy**

6. **Initialize Database**
   - ✅ **Automatic**: Database tables and seed data load automatically on first request
   - Visit your backend URL to trigger initialization: `https://your-backend-url.vercel.app/docs`
   - Or make any API call to auto-create tables and load data

### Option B: Supabase (Alternative)

1. Visit https://supabase.com
2. Create new project
3. Get connection string from **Settings** → **Database**
4. Follow same steps as Neon above

### Option C: PlanetScale (MySQL)

1. Visit https://planetscale.com
2. Create database
3. Install `pymysql`: Add to `requirements.txt`
4. Update connection string format

---

## ⚙️ Part 5: Advanced Configuration

### Custom Domain

1. **Add Domain to Frontend Project**
   - Go to Vercel frontend project → **Settings** → **Domains**
   - Add your domain (e.g., `maturity.mahindra.com`)
   - Follow DNS configuration instructions

2. **Add Domain to Backend Project**
   - Go to Vercel backend project → **Settings** → **Domains**
   - Add subdomain (e.g., `api.maturity.mahindra.com`)

3. **Update Frontend Environment Variable**
   - Update `VITE_API_URL` to `https://api.maturity.mahindra.com`
   - Redeploy frontend

### Environment-Specific Settings

Create different configurations for preview and production:

**Frontend Environment Variables:**
```
VITE_API_URL (Production) = https://mahindraservicesapi.vercel.app/
VITE_API_URL (Preview) = https://mahindraservicesapi-preview.vercel.app/
VITE_API_URL (Development) = http://localhost:8000
```

### CORS Configuration

Already configured in `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**For production**, restrict to specific domains:
```python
origins = [
    "https://maturity.mahindra.com",
    "https://mahindra-frontend.vercel.app",
]
```

---

## 🔧 Part 6: Troubleshooting

### Issue: "Failed to fetch" errors

**Cause**: Frontend can't reach backend  
**Solution**:
1. Verify `VITE_API_URL` is set correctly
2. Check backend URL is accessible: `https://your-backend-url.vercel.app/docs`
3. Redeploy frontend after changing environment variables

### Issue: "Database not found" or empty data

**Cause**: Database resets on deployment/restart (SQLite in `/tmp`)  
**Solution**:
1. **Seed data**: Auto-reloads automatically (areas, dimensions, maturity levels)
2. **User assessments**: Lost on restart - use PostgreSQL for persistence
3. For temporary testing: Click "Refresh" buttons to reload seed data
4. **For production**: Migrate to PostgreSQL (Part 4) - **REQUIRED**

### Issue: "Module not found" errors in backend

**Cause**: Missing dependencies in `requirements.txt`  
**Solution**:
1. Check `requirements.txt` in root has all packages
2. Verify versions match `backend/requirements.txt`
3. Redeploy backend

### Issue: Build fails with "Command failed"

**Frontend:**
- Check `frontend/package.json` has correct scripts
- Verify build command is `npm run build`
- Check for TypeScript/syntax errors

**Backend:**
- Verify `api/index.py` exists
- Check `vercel.json` configuration
- Ensure `requirements.txt` is in root directory

### Issue: CORS errors

**Solution**:
1. Check backend CORS settings allow frontend domain
2. Verify frontend is using correct API URL
3. Test API endpoint directly in browser

### Issue: Slow cold starts

**Cause**: Vercel serverless functions sleep when inactive  
**Solution**:
1. Upgrade to Vercel Pro for faster cold starts
2. OR implement a keep-alive ping service
3. OR use Railway/Render for always-on backend

---

## 📊 Part 7: Monitoring & Logs

### View Deployment Logs

**Vercel Dashboard:**
1. Go to project → **Deployments**
2. Click on a deployment
3. View build logs and runtime logs

**Runtime Logs:**
1. Go to project → **Logs**
2. Filter by time range
3. Search for specific errors

### Monitor Performance

**Vercel Analytics** (Pro plan):
- Real user monitoring
- Performance metrics
- Error tracking

**Alternative**: Use Sentry for error tracking:
1. Install: `npm install @sentry/react`
2. Configure in frontend
3. Monitor errors in Sentry dashboard

---

## 🔄 Part 8: Continuous Deployment

### Automatic Deployments

**Already configured!** Vercel auto-deploys on Git push:

1. **Production**: Deploys from `main` branch
2. **Preview**: Deploys from other branches/PRs
3. **Each commit** triggers new deployment

### Deployment Workflow

```bash
# Make changes locally
git add .
git commit -m "Feature: Add new assessment field"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests (if configured)
# 4. Deploys to production
# 5. Sends notification
```

### Rollback Deployments

1. Go to **Deployments**
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

---

## ✅ Deployment Checklist

### Before Deploying

- [ ] All code committed and pushed to GitHub
- [ ] Database initialized locally
- [ ] Excel data files (`MM_Data.xlsx`) present
- [ ] `requirements.txt` up to date
- [ ] Frontend builds locally without errors
- [ ] Backend runs locally without errors

### Backend Deployment

- [ ] Backend project created on Vercel
- [ ] Framework preset set to "Other"
- [ ] Root directory is `.` (root)
- [ ] Deployment successful
- [ ] `/docs` endpoint accessible
- [ ] API endpoints return data

### Frontend Deployment

- [ ] Frontend project created on Vercel
- [ ] Framework preset set to "Vite"
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_URL` environment variable set
- [ ] Build successful
- [ ] Application loads without errors
- [ ] API diagnostics show green checks

### Post-Deployment

- [ ] ✅ **Data automatically loaded** (seed data)
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] ⚠️ **For Production**: PostgreSQL migration complete (REQUIRED to preserve user data)
- [ ] Custom domain configured (if applicable
- [ ] Custom domain configured (if applicable)
- [ ] PostgreSQL migration complete (for production)

---

## 📚 Additional Resources

### Official Documentation
- **Vercel**: https://vercel.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

### Database Providers
- **Neon**: https://neon.tech/docs
- **Supabase**: https://supabase.com/docs
- **PlanetScale**: https://planetscale.com/docs

### Project Documentation
- **Main README**: `README.md`
- **Database Guide**: `docs/DATABASE.md`
- **Quick Start**: `QUICK_START.md`
- **Implementation Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Intelligent Assessment System**: `INTELLIGENT_ASSESSMENT_SYSTEM.md` ✨ NEW

---

## 🆘 Need Help?

### Common Questions

**Q: How muon Vercel**: ⚠️ **NO** - Resets on every deployment and restart
  - Seed data (areas, dimensions, maturity levels) auto-reloads
  - **User assessments and selections are LOST**
  - Only suitable for testing/demos
- **SQLite (Local)**: ✅ **YES** - Persists across restarts
- **PostgreSQL (Production)**: ✅ **YES** - Full persistence, **REQUIRED for production**

**Q: What happens to my assessment data when Vercel restarts?**  
A: With SQLite on Vercel:
- **Lost**: All user-created assessments, checksheet selections, and notes
- **Preserved**: Seed data (auto-reloaded from seed_data.py)
- **Solution**: Use PostgreSQL for production to preserve all data permanently

**Q: Do I need to manually load data after deployment?**  
A: 
- **Seed data**: **No** ✨ Auto-loads on first request
- **User assessments**: These are lost on restart (use PostgreSQL to preserve)

**Q: Will my data persist?**  
A: 
- **SQLite (Vercel)**: Resets on deployment, but seed data auto-reloads ✨
- **SQLite (Local)**: Persists across restarts
- **PostgreSQL**: Full persistence - recommended for production

**Q: Do I need to manually load data after deployment?**  
A: **No!** ✨ Seed data now loads automatically on first request. The system is smart enough to detect an empty database and populate it.

**Q: Can I use a different backend host?**  
A: Yes! Deploy backend to Render/Railway and update `VITE_API_URL`.

**Q: How do I update my deployed app?**  
A: Just push to GitHub - Vercel auto-deploys.

**Q: How does the intelligent scoring work?**  
A: When you save an assessment, the system:
1. Validates entered data (plant name, location, etc.)
2. Analyzes checksheet selections
3. Calculates achieved maturity level
4. Updates dimension scores automatically
5. Reflects changes in Reports page immediately

See `INTELLIGENT_ASSESSMENT_SYSTEM.md` for full details.

### Support Channels

1. **Project Issues**: Create GitHub issue
2. **Vercel Support**: https://vercel.com/support
3. **Community**: Vercel Discord/Forum

---

## 🎉 Success!

Your Mahindra & Mahindra Digital Maturity Tool is now deployed!

**Frontend**: `https://your-frontend.vercel.app`  
**Backend**: `https://your-backend.vercel.app`  
**API Docs**: `https://your-backend.vercel.app/docs`

### ✨ New Features (January 2026)

**Automatic Seed Data Loading:**
- No manual "Refresh" buttons needed on first launch
- Data automatically populated from `seed_data.py`
- Works on both local development and Vercel deployments

**Intelligent Assessment Scoring:**
- System validates all entered data
- Automatically calculates maturity levels from checksheet selections
- Updates dimension scores in real-time
- Reports page shows current vs desired levels immediately

**Enhanced Data Capture:**
- Plant location field
- Level-specific notes (L1-L5) for evidence documentation
- Timestamps for audit trails
- Full SQLite persistence (local) / Auto-reload (Vercel)

### Test the Complete Workflow:

1. **Open Smart Factory CheckSheet**
   - ✅ Data already loaded (no refresh needed!)
   
2. **Create Assessment**
   - Add plant information (name, location, date)
   - Expand Level 1-5 sections
   - Add notes in "Level X Notes & Evidence" text areas
   - Select applicable maturity capabilities (checkboxes)

3. **Save & Calculate**
   - Click "Save & Calculate Scores"
   - System validates data
   - Calculates achieved maturity level
   - Updates all dimension scores

4. **View Results in Reports**
   - Navigate to Reports page
   - See updated current levels (automatically calculated)
   - Review gaps between current and desired
   - Check priorities (High/Medium/Low)

5. **Export Data**
   - Download CSV for analysis
   - Generate HTML report

---

**Deployment Guide Version**: 2.1 (January 2026)  
**Last Updated**: Includes intelligent scoring, automatic seed data, and enhanced assessment fields
