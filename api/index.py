"""
Vercel Serverless Entry Point for FastAPI Backend
This file adapts the FastAPI application to work with Vercel's serverless functions.
"""
import sys
import os
from pathlib import Path

# Set the VERCEL environment variable
os.environ['VERCEL'] = '1'

# Add the backend directory to the path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

# Import the FastAPI app
try:
    from main import app
    print("✅ FastAPI app imported successfully")
except Exception as e:
    print(f"❌ Error importing FastAPI app: {e}")
    raise

# Initialize database tables and load seed data if needed
try:
    from database import Base, engine, SessionLocal, Area, Dimension, MaturityLevel, RatingScale
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Auto-load seed data if database is empty (for Vercel deployments)
    db = SessionLocal()
    try:
        area_count = db.query(Area).count()
        dimension_count = db.query(Dimension).count()
        maturity_count = db.query(MaturityLevel).count()
        rating_count = db.query(RatingScale).count()
        
        if area_count == 0 or dimension_count == 0 or maturity_count == 0 or rating_count == 0:
            print("📊 Vercel deployment: Database is empty. Loading all data...")
            
            # Load base seed data
            from seed_data import load_seed_data
            load_seed_data()
            print("✅ Base seed data loaded")
            
            # Load maturity levels (checksheet data)
            try:
                from load_simulated_data import load_simulated_data
                load_simulated_data()
                print("✅ Maturity levels data loaded")
            except Exception as e:
                print(f"⚠️ Maturity levels loading error: {e}")
            
            # Load rating scales
            try:
                from update_rating_scales import update_rating_scales
                update_rating_scales()
                print("✅ Rating scales data loaded")
            except Exception as e:
                print(f"⚠️ Rating scales loading error: {e}")
            
            # Load reports data (areas/dimensions)
            try:
                from load_reports_data import load_reports_data
                load_reports_data()
                print("✅ Reports data loaded")
            except Exception as e:
                print(f"⚠️ Reports data loading error: {e}")
            
            print("✅ All data loaded for Vercel deployment!")
    except Exception as seed_error:
        print(f"⚠️ Seed data loading error: {seed_error}")
    finally:
        db.close()
        
except Exception as e:
    print(f"⚠️ Database initialization warning: {e}")

# The app is now available for Vercel to call
