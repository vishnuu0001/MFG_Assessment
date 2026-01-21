# Deployment Guide - Mahindra and Mahindra Tool

## Issue
The application deployed on Vercel (https://mahindra-mahindra.vercel.app/) cannot access data because the frontend is trying to connect to `localhost:8000`, which only works on your local machine.

## Solution
The code has been updated to use environment variables for the API URL. Now you need to:

### 1. Deploy the Backend

Your backend needs to be accessible from the internet. Here are some free/easy options:

#### Option A: Render (Recommended)
1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: mahindra-backend (or any name)
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click "Create Web Service"
6. Once deployed, copy your backend URL (e.g., `https://mahindra-backend.onrender.com`)

#### Option B: Railway
1. Go to https://railway.app and sign up
2. Create new project from GitHub repo
3. Select the backend folder
4. Railway will auto-detect Python and deploy
5. Copy your backend URL

#### Option C: Vercel Serverless (✅ CONFIGURED - RECOMMENDED)

**Your backend is now configured to deploy on Vercel as serverless functions!**

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as default (root)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
5. Click "Deploy"
6. Once deployed, your backend will be at: `https://your-project-name.vercel.app`

**Important Notes:**
- The database will reset on each deployment (serverless limitation)
- For production, consider using a persistent database like:
  - **Neon** (PostgreSQL - free tier): https://neon.tech
  - **PlanetScale** (MySQL - free tier): https://planetscale.com
  - **Supabase** (PostgreSQL - free tier): https://supabase.com

**What was configured:**
- Created `api/index.py` - Serverless entry point
- Created `vercel.json` - Vercel configuration
- Updated `database.py` - Uses `/tmp` for SQLite in serverless
- Updated `main.py` - Conditional startup for serverless
- Created `.vercelignore` - Excludes unnecessary files
- Created `requirements.txt` in root - Python dependencies

### 2. Configure Frontend Environment Variable

#### For Vercel Serverless Backend:
1. Go to your Vercel **frontend** project dashboard (mahindra-mahindra)
2. Go to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-project-name.vercel.app` (your backend Vercel URL)
   - **Environment**: Production (and Preview if needed)
4. Click **Save**
5. Go to **Deployments** → Click the three dots on latest deployment → **Redeploy**

#### For Render/Railway Backend:

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your deployed backend URL (e.g., `https://mahindra-backend.onrender.com`)
   - **Environment**: Production (and Preview if needed)
4. Click **Save**
5. Go to **Deployments** → Click the three dots on latest deployment → **Redeploy**

### 3. Local Development

For local development, the `.env` file is already configured to use `http://localhost:8000`.

To run locally:
```bash
# Terminal 1 - Backend
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## Code Changes Made

1. **Created** `api/index.py` - Serverless entry point for Vercel
2. **Created** `vercel.json` - Vercel deployment configuration
3. **Created** `requirements.txt` (root) - Python dependencies for Vercel
4. **Created** `.vercelignore` - Excludes unnecessary files from deployment
5. **Updated** `backend/database.py` - Uses `/tmp` for SQLite in serverless environment
6. **Updated** `backend/main.py` - Conditional startup event for serverless
7. **Created** `frontend/src/config.js` - Centralized API configuration
8. **Updated** All M&M components to use `apiUrl()` helper function instead of hardcoded URLs
9. **Created** `.env` and `.env.example` files for environment variables
10. **Backend CORS** - Already configured to allow all origins

## Files Changed

### Backend Serverless Setup:
- `api/index.py` (new) - Serverless entry point
- `vercel.json` (new) - Vercel configuration
- `requirements.txt` (new, root) - Python dependencies
- `.vercelignore` (new) - Deployment exclusions
- `backend/database.py` (modified) - Serverless database handling
- `backend/ma - QUICK DEPLOY (Recommended)

### Option 1: Deploy Backend to Vercel Serverless (EASIEST)

1. **Deploy Backend to Vercel:**
   - Go to https://vercel.com
   - Click "Add New" → "Project" → Import your GitHub repo
   - Deploy (it will auto-detect the configuration)
   - Copy your backend URL (e.g., `https://mahindra-backend.vercel.app`)

2. **Update Frontend Environment Variable:**
   - Go to your frontend Vercel project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.vercel.app`
   - Redeploy frontend

3. **Done!** Test at https://mahindra-mahindra.vercel.app/

**Note:** Database resets on each deployment. For production, migrate to PostgreSQL (see below).

### Option 2: Deploy Backend to Render/Railway

Follow the original instructions for Render or Railway, then set the environment variable as described above.
- `frontend/.env.example` (new)
- `frontend/.gitignore` (new)

## Next Steps

1. **Deploy the backend** using one of the options above
2. **Set the environment variable** on Vercel
3. **Redeploy the frontend** on Vercel
4. Test the application at https://mahindra-mahindra.vercel.app/

The application should now work from any device/location!
