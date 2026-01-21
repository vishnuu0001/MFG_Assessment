# Mahindra & Mahindra Digital Maturity Tool

A comprehensive digital transformation assessment and reporting tool for smart factory initiatives.

## 🚀 Quick Deploy

Your application is **ready to deploy** to Vercel! Follow the [QUICK_START.md](QUICK_START.md) guide.

**TL;DR:**
1. Deploy backend to Vercel → Get URL
2. Set `VITE_API_URL` in frontend Vercel project
3. Redeploy frontend
4. Done! 🎉

For detailed guides, see the [`/docs`](./docs) folder:
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Complete deployment instructions
- **[DATABASE.md](./docs/DATABASE.md)** - PostgreSQL migration guide
- **[NETWORK_SETUP.md](./docs/NETWORK_SETUP.md)** - Local network access setup

## 📋 Features

### M&M Digital Maturity Suite
- **📊 Reports** - Digital maturity analytics with live data
- **✅ Smart Factory Checksheet** - Comprehensive maturity assessment tool
- **⭐ Rating Scales** - Dimension-based maturity rating framework
- **🔢 Matrices** - Operations, quality, and asset performance metrics

### Technical Highlights
- ✅ **Serverless Architecture** - Scales automatically
- ✅ **FastAPI Backend** - Modern Python REST API
- ✅ **React Frontend** - Responsive, modern UI
- ✅ **Real-time Data** - Live updates and simulations
- ✅ **Global Deployment** - Works anywhere via Vercel

## 🏗️ Architecture

```
Frontend (Vercel)          Backend (Vercel Serverless)
┌─────────────────┐       ┌──────────────────────────┐
│  React + Vite   │ ────> │  FastAPI + SQLAlchemy    │
│  Tailwind CSS   │ HTTPS │  SQLite (or PostgreSQL)  │
└─────────────────┘       └──────────────────────────┘
        │                            │
        │                            │
    Users Access                 API Routes
  Anywhere 🌍              /api/mm/reports, etc.
```

## 📁 Project Structure

```
Mahindra_Mahindra/
├── api/
│   └── index.py              # Vercel serverless entry point
├── backend/
│   ├── main.py               # FastAPI application
│   ├── database.py           # SQLAlchemy models & DB config
│   ├── load_simulated_data.py
│   ├── load_reports_data.py
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── M_M/          # Mahindra components
│   │   │   ├── BASF/         # BASF components
│   │   │   └── shared/       # Shared components
│   │   ├── config.js         # API configuration
│   │   └── App.jsx           # Main app
│   ├── .env                  # Environment variables
│   └── package.json
├── docs/
│   ├── DEPLOYMENT.md        # Deployment instructions
│   ├── DATABASE.md          # Database configuration
│   └── NETWORK_SETUP.md     # Network access guide
├── vercel.json               # Vercel configuration
├── requirements.txt          # Root Python dependencies
├── QUICK_START.md           # 5-minute deployment guide
├── README.md                # This file
└── start-dev.bat            # Development server launcher
```

## 🛠️ Local Development

### Quick Start (Windows)
Double-click `start-dev.bat` to launch both servers with one command!

Or manually:

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # Windows
source .venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000  
API Docs: http://localhost:8000/docs

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## 🌐 Deployment

### Option 1: Vercel Serverless (Recommended)
✅ **Already configured!** Just follow [QUICK_START.md](QUICK_START.md)

- Automatic scaling
- Zero configuration
- Free tier available
- Global CDN

### Option 2: Traditional Hosting
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Render.com
- Railway.app
- Heroku

## 📊 Database

### Current: SQLite
- ✅ Perfect for development
- ✅ Auto-initializes with seed data
- ⚠️ Resets on serverless deployments

### Production: PostgreSQL
- ✅ Persistent data
- ✅ Better performance
- ✅ Concurrent users
- 📖 Migration guide: [POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)

## 🔧 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000  # Development
# VITE_API_URL=https://your-backend.vercel.app  # Production
```

### Backend (Vercel)
```bash
DATABASE_URL=postgresql://...  # Optional: PostgreSQL connection string
```

## 📚 API Documentation

Once deployed, visit:
- Production: `https://your-backend.vercel.app/docs`
- Local: `http://localhost:8000/docs`

### Key Endpoints
- `GET /api/mm/areas` - Get all areas with dimensions
- `GET /api/mm/maturity-levels` - Get maturity assessment levels
- `GET /api/mm/rating-scales` - Get rating scales
- `POST /api/mm/refresh-reports-data` - Refresh simulated data
- `POST /api/mm/calculate-dimension-scores` - Calculate scores

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library

### Backend
- **FastAPI** - Web framework
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **Pandas** - Data processing
- **SQLite/PostgreSQL** - Database

### DevOps
- **Vercel** - Hosting & deployment
- **GitHub** - Version control
- **Git** - Source control

## 🔒 Security

- ✅ CORS properly configured
- ✅ Environment variables for secrets
- ✅ Input validation with Pydantic
- ✅ SQL injection protection via ORM

## 📈 Performance

- ⚡ Serverless auto-scaling
- 🌍 Global CDN distribution
- 💾 Optimized database queries
- 🎯 Lazy loading components

## 🧪 Testing

### Test Backend Locally
```bash
cd backend
python test_api.py
```

### Test API Endpoints
Visit http://localhost:8000/docs and try the interactive API documentation.

## 📝 License

Proprietary - Mahindra & Mahindra

## 👥 Support

For issues or questions:
1. Check deployment guides in this repository
2. Review Vercel deployment logs
3. Test API at `/docs` endpoint

---

**Ready to deploy?** → [QUICK_START.md](QUICK_START.md)  
**Need details?** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)  
**Going production?** → [POSTGRESQL_MIGRATION.md](POSTGRESQL_MIGRATION.md)
