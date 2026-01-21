from contextlib import closing
from pathlib import Path
import sqlite3
from typing import Dict, List, Optional
from datetime import datetime
import random
import os
import json

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, Area, Dimension, MaturityLevel, RatingScale, Assessment, DimensionAssessment, ChecksheetSelection, SessionLocal
from database import init_db as init_sqlalchemy_db

app = FastAPI(title="Mahindra and Mahindra WP1 Simulation Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup (only for local development)
# For serverless (Vercel), initialization happens in api/index.py
if not os.environ.get('VERCEL'):
    @app.on_event("startup")
    async def startup_event():
        """Initialize database and load seed data if database is empty"""
        init_sqlalchemy_db()
        
        # Check if seed data needs to be loaded
        db = SessionLocal()
        try:
            area_count = db.query(Area).count()
            dimension_count = db.query(Dimension).count()
            maturity_count = db.query(MaturityLevel).count()
            
            # If database is empty, load seed data automatically
            if area_count == 0 or dimension_count == 0 or maturity_count == 0:
                print("📊 Database is empty. Loading seed data...")
                from seed_data import load_seed_data
                load_seed_data()
                print("✅ Seed data loaded successfully!")
        except Exception as e:
            print(f"⚠️ Error checking/loading seed data: {e}")
        finally:
            db.close()

# Root endpoint - API status
@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Mahindra and Mahindra Digital Maturity API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "areas": "/api/mm/areas",
            "maturity_levels": "/api/mm/maturity-levels",
            "rating_scales": "/api/mm/rating-scales",
            "assessments": "/api/mm/assessments"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/api/mm/refresh-all-data")
def refresh_all_data(db: Session = Depends(get_db)):
    """Master endpoint to refresh ALL data: reports, rating scales, and maturity levels"""
    results = {}
    errors = []
    
    try:
        # 1. Refresh Reports Data (Areas and Dimensions)
        reports_result = refresh_reports_data(db)
        results['reports'] = reports_result
    except Exception as e:
        errors.append(f"Reports: {str(e)}")
        results['reports'] = {"status": "error", "message": str(e)}
    
    try:
        # 2. Refresh Rating Scales
        rating_result = refresh_rating_scales(db)
        results['rating_scales'] = rating_result
    except Exception as e:
        errors.append(f"Rating Scales: {str(e)}")
        results['rating_scales'] = {"status": "error", "message": str(e)}
    
    try:
        # 3. Refresh Maturity Levels (Checksheet)
        maturity_result = refresh_simulated_data(db)
        results['maturity_levels'] = maturity_result
    except Exception as e:
        errors.append(f"Maturity Levels: {str(e)}")
        results['maturity_levels'] = {"status": "error", "message": str(e)}
    
    if errors:
        return {
            "status": "partial_success",
            "message": f"Completed with {len(errors)} error(s)",
            "errors": errors,
            "results": results
        }
    else:
        return {
            "status": "success",
            "message": "All data refreshed successfully",
            "results": results
        }


# Old SQLite DB_PATH - only used for legacy functions if needed
# In Vercel serverless, use /tmp directory
if os.environ.get('VERCEL'):
    DB_PATH = Path("/tmp/app.db")
else:
    DB_PATH = Path(__file__).with_name("app.db")


class AppMetrics(BaseModel):
    dc: int
    tf: int
    dr: int
    der: int
    er: int
    gross: float


def calculate_confidence(metrics: AppMetrics):
    avg_score = metrics.dc + metrics.tf + metrics.dr + metrics.der + metrics.er
    conf_pct = (avg_score / 25) * 100

    if conf_pct >= 75:
        band = "High (Committable)"
    elif conf_pct >= 50:
        band = "Medium (Conditional)"
    else:
        band = "Low (Aspirational)"

    weighted = (conf_pct / 100) * metrics.gross
    return round(conf_pct, 1), band, round(weighted, 2)


def get_connection() -> sqlite3.Connection:
    """Legacy SQLite connection - prefer using SQLAlchemy database"""
    if os.environ.get('VERCEL'):
        # In Vercel, /tmp is the only writable directory
        db_path = Path("/tmp/app.db")
    else:
        db_path = DB_PATH
        db_path.parent.mkdir(parents=True, exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_old_sqlite_db() -> None:
    """Legacy init function - NOT USED in current version"""
    # This function is kept for backward compatibility but not called
    # SQLAlchemy database.py handles all database initialization now
    pass
    schema = """
    CREATE TABLE IF NOT EXISTS segments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS apps (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        segment_id INTEGER NOT NULL,
        gross REAL NOT NULL,
        dc INTEGER NOT NULL,
        tf INTEGER NOT NULL,
        dr INTEGER NOT NULL,
        der INTEGER NOT NULL,
        er INTEGER NOT NULL,
        strategy TEXT NOT NULL,
        FOREIGN KEY(segment_id) REFERENCES segments(id)
    );

    CREATE TABLE IF NOT EXISTS app_findings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        app_id TEXT NOT NULL,
        detail TEXT NOT NULL,
        FOREIGN KEY(app_id) REFERENCES apps(id)
    );

    CREATE TABLE IF NOT EXISTS governance_raci (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        ddo TEXT NOT NULL,
        it TEXT NOT NULL,
        board TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS governance_gates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gate TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS change_plan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        week TEXT NOT NULL,
        title TEXT NOT NULL,
        desc TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stakeholders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        impact TEXT NOT NULL,
        focus TEXT NOT NULL,
        strategy TEXT NOT NULL
    );
    """

    with closing(get_connection()) as conn:
        cur = conn.cursor()
        cur.executescript(schema)

        segments = [
            "Finance & GBS",
            "Supply Chain & Logistics",
            "R&D & Innovation",
            "Operations & Manufacturing",
        ]
        cur.executemany("INSERT OR IGNORE INTO segments(name) VALUES (?)", [(s,) for s in segments])

        app_seed = [
            {
                "id": "A-101",
                "name": "Legacy Finance Reporting Tool",
                "segment": "Finance & GBS",
                "gross": 1.10,
                "dc": 5,
                "tf": 5,
                "dr": 4,
                "der": 5,
                "er": 4,
                "strategy": "Elimination First",
                "findings": [
                    "Redundant with Target Architecture 2030",
                    "High manual data reconciliation",
                    "License expires Q3 2026",
                ],
            },
            {
                "id": "A-699",
                "name": "Shadow IT Collaboration Tool",
                "segment": "Finance & GBS",
                "gross": 0.38,
                "dc": 5,
                "tf": 5,
                "dr": 5,
                "der": 4,
                "er": 5,
                "strategy": "Elimination",
                "findings": [
                    "Duplicate of standard MS Teams",
                    "Security non-compliant",
                    "High data leakage risk",
                ],
            },
            {
                "id": "A-214",
                "name": "Custom Procurement Workflow",
                "segment": "Supply Chain & Logistics",
                "gross": 0.95,
                "dc": 4,
                "tf": 4,
                "dr": 3,
                "der": 4,
                "er": 3,
                "strategy": "Migration",
                "findings": [
                    "Move to BASF SAP Core",
                    "Technical debt > 40%",
                    "Process standardization required",
                ],
            },
            {
                "id": "A-387",
                "name": "R&D Lab Data Tracker",
                "segment": "R&D & Innovation",
                "gross": 0.85,
                "dc": 3,
                "tf": 3,
                "dr": 2,
                "der": 3,
                "er": 2,
                "strategy": "Retain & Modernize",
                "findings": [
                    "Niche functionality not in global ERP",
                    "Low integration readiness",
                    "User adoption key challenge",
                ],
            },
            {
                "id": "A-512",
                "name": "Plant Maintenance Desktop App",
                "segment": "Operations & Manufacturing",
                "gross": 1.20,
                "dc": 4,
                "tf": 2,
                "dr": 2,
                "der": 3,
                "er": 2,
                "strategy": "Re-platform",
                "findings": [
                    "Legacy OS dependency (Win7)",
                    "Critical for shift handover",
                    "High latency issues",
                ],
            },
        ]

        for app_row in app_seed:
            segment_id = cur.execute(
                "SELECT id FROM segments WHERE name = ?", (app_row["segment"],)
            ).fetchone()[0]

            cur.execute(
                """
                INSERT OR REPLACE INTO apps (id, name, segment_id, gross, dc, tf, dr, der, er, strategy)
                VALUES (:id, :name, :segment_id, :gross, :dc, :tf, :dr, :der, :er, :strategy)
                """,
                {
                    **app_row,
                    "segment_id": segment_id,
                },
            )

            cur.execute("DELETE FROM app_findings WHERE app_id = ?", (app_row["id"],))
            cur.executemany(
                "INSERT INTO app_findings (app_id, detail) VALUES (?, ?)",
                [(app_row["id"], finding) for finding in app_row["findings"]],
            )

        if cur.execute("SELECT COUNT(1) FROM governance_raci").fetchone()[0] == 0:
            cur.executemany(
                "INSERT INTO governance_raci (task, ddo, it, board) VALUES (?, ?, ?, ?)",
                [
                    ("Scope Decision", "X", "Y", "Y"),
                    ("Savings Approval", "X", "Y", "X"),
                    ("Data Quality Sign-off", "Y", "X", "Y"),
                    ("Phase-Gate Readiness", "Y", "Y", "X"),
                ],
            )

        if cur.execute("SELECT COUNT(1) FROM governance_gates").fetchone()[0] == 0:
            cur.executemany(
                "INSERT INTO governance_gates (gate) VALUES (?)",
                [
                    ("Minimum data completeness threshold met",),
                    ("Cost allocation logic agreed",),
                    ("Stakeholder alignment workshops completed",),
                    ("Target Architecture 2030 alignment baseline established",),
                ],
            )

        if cur.execute("SELECT COUNT(1) FROM change_plan").fetchone()[0] == 0:
            cur.executemany(
                "INSERT INTO change_plan (week, title, desc) VALUES (?, ?, ?)",
                [
                    ("W1", "Mobilization", "Kickoff & Success Criteria"),
                    ("W2", "Standards", "Arch Alignment & Guardrails"),
                    ("W3", "Readiness", "Segment Onboarding"),
                    ("W4", "Go-Live", "Sprint 0 & Dashboard Validation"),
                ],
            )

        if cur.execute("SELECT COUNT(1) FROM stakeholders").fetchone()[0] == 0:
            cur.executemany(
                "INSERT INTO stakeholders (name, impact, focus, strategy) VALUES (?, ?, ?, ?)",
                [
                    (
                        "Board of Directors",
                        "High",
                        "Strategic Oversight",
                        "Executive readouts & portfolio steering",
                    ),
                    (
                        "DDO & Architecture",
                        "Critical",
                        "Future Readiness",
                        "Architecture alignment workshops",
                    ),
                    (
                        "Information Managers",
                        "Critical",
                        "Data Integrity",
                        "Process stewardship & validation",
                    ),
                ],
            )

        conn.commit()


# Legacy startup event removed - database initialization now handled by SQLAlchemy
# in database.py and api/index.py for serverless


@app.get("/api/v1/portfolio")
async def get_portfolio_simulation():
    with closing(get_connection()) as conn:
        cur = conn.cursor()

        segments = cur.execute("SELECT id, name FROM segments ORDER BY id").fetchall()
        portfolio: List[Dict] = []

        for seg in segments:
            apps_for_segment = cur.execute(
                "SELECT * FROM apps WHERE segment_id = ? ORDER BY id", (seg["id"],)
            ).fetchall()

            app_payload = []
            for app_row in apps_for_segment:
                findings = [
                    row["detail"]
                    for row in cur.execute(
                        "SELECT detail FROM app_findings WHERE app_id = ? ORDER BY id",
                        (app_row["id"],),
                    ).fetchall()
                ]

                confidence, band, weighted = calculate_confidence(
                    AppMetrics(
                        dc=app_row["dc"],
                        tf=app_row["tf"],
                        dr=app_row["dr"],
                        der=app_row["der"],
                        er=app_row["er"],
                        gross=app_row["gross"],
                    )
                )

                app_payload.append(
                    {
                        "id": app_row["id"],
                        "name": app_row["name"],
                        "gross": app_row["gross"],
                        "dc": app_row["dc"],
                        "tf": app_row["tf"],
                        "dr": app_row["dr"],
                        "der": app_row["der"],
                        "er": app_row["er"],
                        "strategy": app_row["strategy"],
                        "findings": findings,
                        "confidence": confidence,
                        "band": band,
                        "weighted": weighted,
                    }
                )

            portfolio.append(
                {
                    "segment": seg["name"],
                    "apps": app_payload,
                    "total_weighted": round(sum(app["weighted"] for app in app_payload), 2),
                }
            )

        governance = {
            "raci": [
                {
                    "task": row["task"],
                    "ddo": row["ddo"],
                    "it": row["it"],
                    "board": row["board"],
                }
                for row in cur.execute("SELECT task, ddo, it, board FROM governance_raci ORDER BY id")
            ],
            "gates": [row["gate"] for row in cur.execute("SELECT gate FROM governance_gates ORDER BY id")],
        }

        change_management = {
            "comms_plan": [
                {
                    "week": row["week"],
                    "title": row["title"],
                    "desc": row["desc"],
                }
                for row in cur.execute("SELECT week, title, desc FROM change_plan ORDER BY id")
            ],
            "stakeholders": [
                {
                    "name": row["name"],
                    "impact": row["impact"],
                    "focus": row["focus"],
                    "strategy": row["strategy"],
                }
                for row in cur.execute(
                    "SELECT name, impact, focus, strategy FROM stakeholders ORDER BY id"
                )
            ],
        }

        return {"portfolio": portfolio, "governance": governance, "change_management": change_management}


# ==================== M&M Digital Maturity APIs ====================

# Pydantic models
class DimensionResponse(BaseModel):
    id: int
    name: str
    current_level: int
    desired_level: int
    updated_at: datetime
    
    class Config:
        orm_mode = True

class AreaResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    desired_level: Optional[int]
    dimensions: List[DimensionResponse]
    
    class Config:
        orm_mode = True

class MaturityLevelResponse(BaseModel):
    id: int
    dimension_id: Optional[int]
    level: int
    name: str
    sub_level: Optional[str]
    category: Optional[str]
    description: str
    
    class Config:
        orm_mode = True

class RatingScaleResponse(BaseModel):
    id: int
    dimension_name: str
    level: int
    rating_name: str
    digital_maturity_description: str
    business_relevance: Optional[str] = None
    
    class Config:
        orm_mode = True

class DimensionUpdate(BaseModel):
    current_level: int
    desired_level: Optional[int]

class AssessmentCreate(BaseModel):
    plant_name: Optional[str] = None
    shop_unit: Optional[str] = None
    dimension_id: Optional[int] = None
    assessor_name: Optional[str] = None
    notes: Optional[str] = None
    level1_notes: Optional[str] = None
    level2_notes: Optional[str] = None
    level3_notes: Optional[str] = None
    level4_notes: Optional[str] = None
    level5_notes: Optional[str] = None
    level1_image: Optional[str] = None
    level2_image: Optional[str] = None
    level3_image: Optional[str] = None
    level4_image: Optional[str] = None
    level5_image: Optional[str] = None
    overall_count: Optional[int] = 0
    checked_count: Optional[int] = 0

class AssessmentResponse(BaseModel):
    id: int
    plant_name: Optional[str] = None
    shop_unit: Optional[str] = None
    dimension_id: Optional[int] = None
    assessment_date: datetime
    assessor_name: Optional[str] = None
    notes: Optional[str] = None
    level1_notes: Optional[str] = None
    level2_notes: Optional[str] = None
    level3_notes: Optional[str] = None
    level4_notes: Optional[str] = None
    level5_notes: Optional[str] = None
    level1_image: Optional[str] = None
    level2_image: Optional[str] = None
    level3_image: Optional[str] = None
    level4_image: Optional[str] = None
    level5_image: Optional[str] = None
    overall_count: Optional[int] = 0
    checked_count: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class ChecksheetSelectionCreate(BaseModel):
    assessment_id: Optional[int] = None
    maturity_level_id: int
    is_selected: bool
    evidence: Optional[str] = None

class ChecksheetSelectionResponse(BaseModel):
    id: int
    assessment_id: Optional[int] = None
    maturity_level_id: int
    is_selected: bool
    evidence: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# API Endpoints
@app.get("/api/mm/areas", response_model=List[AreaResponse])
def get_areas(db: Session = Depends(get_db)):
    """Get all manufacturing areas with their dimensions"""
    areas = db.query(Area).all()
    return areas

@app.get("/api/mm/dimensions")
def get_dimensions(db: Session = Depends(get_db)):
    """Get all dimensions across all areas for assessment filtering"""
    dimensions = db.query(Dimension).all()
    return [{"id": dim.id, "name": dim.name, "area_id": dim.area_id} for dim in dimensions]

@app.post("/api/mm/refresh-reports-data")
def refresh_reports_data(db: Session = Depends(get_db)):
    """Refresh Reports data (Areas and Dimensions) from Excel file"""
    try:
        import os
        import pandas as pd
        import random
        
        # Build path to Excel file in backend directory
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        excel_path = os.path.join(backend_dir, 'MM_Data.xlsx')
        
        if not os.path.exists(excel_path):
            raise HTTPException(status_code=404, detail=f"Excel file not found at {excel_path}")
        
        # Clear existing areas and dimensions
        db.query(Dimension).delete()
        db.query(Area).delete()
        db.commit()
        
        # Read the Reports sheet
        df = pd.read_excel(excel_path, sheet_name='Reports', header=None)
        
        current_area = None
        area_obj = None
        dimension_count = 0
        area_count = 0
        
        # Parse the data
        for idx, row in df.iterrows():
            if idx < 3:  # Skip header rows
                continue
            
            area_name = str(row[0]) if pd.notna(row[0]) else ""
            col1_value = str(row[1]) if pd.notna(row[1]) else ""
            col8_value = row[8] if pd.notna(row[8]) else None
            
            # Check if this is an area header (has area name in column 0)
            if area_name and area_name != "nan":
                current_area = area_name
                
                # Get desired level from the first row of the area
                if col8_value and str(col8_value) != "nan":
                    try:
                        desired_level = int(float(col8_value))
                    except:
                        desired_level = 3
                else:
                    desired_level = 3
                
                # Create Area
                area_obj = Area(
                    name=current_area,
                    description=f"{current_area} Digital Maturity Assessment",
                    desired_level=desired_level
                )
                db.add(area_obj)
                db.flush()
                area_count += 1
                
                # Also add the first dimension from this row
                if col1_value and col1_value != "nan" and col1_value != "Dimension":
                    dimension_name = col1_value
                    current_level = random.randint(max(1, desired_level - 2), min(desired_level + 1, 5))
                    
                    dimension = Dimension(
                        name=dimension_name,
                        area_id=area_obj.id,
                        current_level=current_level,
                        desired_level=desired_level
                    )
                    db.add(dimension)
                    dimension_count += 1
                continue
            
            # Check if this is a dimension row
            dimension_name = str(row[1]) if pd.notna(row[1]) else ""
            
            if area_obj and dimension_name and dimension_name != "nan" and dimension_name != "Dimension":
                # Assign current level (simulated with randomization)
                current_level = random.randint(max(1, area_obj.desired_level - 2), min(area_obj.desired_level + 1, 5))
                
                dimension = Dimension(
                    name=dimension_name,
                    area_id=area_obj.id,
                    current_level=current_level,
                    desired_level=area_obj.desired_level
                )
                db.add(dimension)
                dimension_count += 1
        
        db.commit()
        return {
            "status": "success",
            "message": f"Successfully loaded {area_count} areas with {dimension_count} dimensions",
            "area_count": area_count,
            "dimension_count": dimension_count
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error refreshing reports data: {str(e)}")

@app.get("/api/mm/areas/{area_id}", response_model=AreaResponse)
def get_area(area_id: int, db: Session = Depends(get_db)):
    """Get specific area with dimensions"""
    area = db.query(Area).filter(Area.id == area_id).first()
    if not area:
        raise HTTPException(status_code=404, detail="Area not found")
    return area

@app.put("/api/mm/dimensions/{dimension_id}")
def update_dimension(dimension_id: int, update: DimensionUpdate, db: Session = Depends(get_db)):
    """Update dimension current/desired level"""
    dimension = db.query(Dimension).filter(Dimension.id == dimension_id).first()
    if not dimension:
        raise HTTPException(status_code=404, detail="Dimension not found")
    
    dimension.current_level = update.current_level
    if update.desired_level is not None:
        dimension.desired_level = update.desired_level
    dimension.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(dimension)
    return {"status": "success", "dimension": dimension}

@app.get("/api/mm/maturity-levels", response_model=List[MaturityLevelResponse])
def get_maturity_levels(dimension_id: int = None, db: Session = Depends(get_db)):
    """Get maturity level definitions, optionally filtered by dimension"""
    query = db.query(MaturityLevel)
    if dimension_id:
        query = query.filter(MaturityLevel.dimension_id == dimension_id)
    levels = query.order_by(MaturityLevel.level, MaturityLevel.sub_level).all()
    return levels

@app.post("/api/mm/assessments", response_model=AssessmentResponse)
def create_assessment(assessment: AssessmentCreate, db: Session = Depends(get_db)):
    """Create a new assessment session"""
    # For now, create a simple assessment linked to first area (we can enhance this later)
    first_area = db.query(Area).first()
    if not first_area:
        raise HTTPException(status_code=404, detail="No areas found. Please load data first.")
    
    new_assessment = Assessment(
        area_id=first_area.id,
        dimension_id=assessment.dimension_id,
        plant_name=assessment.plant_name,
        shop_unit=assessment.shop_unit,
        assessor_name=assessment.assessor_name,
        notes=assessment.notes,
        level1_notes=assessment.level1_notes,
        level2_notes=assessment.level2_notes,
        level3_notes=assessment.level3_notes,
        level4_notes=assessment.level4_notes,
        level5_notes=assessment.level5_notes,
        level1_image=assessment.level1_image,
        level2_image=assessment.level2_image,
        level3_image=assessment.level3_image,
        level4_image=assessment.level4_image,
        level5_image=assessment.level5_image,
        overall_count=assessment.overall_count,
        checked_count=assessment.checked_count,
        assessment_date=datetime.utcnow()
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return new_assessment

@app.get("/api/mm/assessments", response_model=List[AssessmentResponse])
def get_all_assessments(db: Session = Depends(get_db)):
    """Get all assessments"""
    assessments = db.query(Assessment).order_by(Assessment.created_at.desc()).all()
    return assessments

@app.get("/api/mm/assessments/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Get assessment by ID"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@app.put("/api/mm/assessments/{assessment_id}", response_model=AssessmentResponse)
def update_assessment(assessment_id: int, assessment: AssessmentCreate, db: Session = Depends(get_db)):
    """Update assessment information including level notes"""
    existing_assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not existing_assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    # Update fields
    if assessment.plant_name is not None:
        existing_assessment.plant_name = assessment.plant_name
    if assessment.shop_unit is not None:
        existing_assessment.shop_unit = assessment.shop_unit
    if assessment.dimension_id is not None:
        existing_assessment.dimension_id = assessment.dimension_id
    if assessment.assessor_name is not None:
        existing_assessment.assessor_name = assessment.assessor_name
    if assessment.notes is not None:
        existing_assessment.notes = assessment.notes
    if assessment.level1_notes is not None:
        existing_assessment.level1_notes = assessment.level1_notes
    if assessment.level2_notes is not None:
        existing_assessment.level2_notes = assessment.level2_notes
    if assessment.level3_notes is not None:
        existing_assessment.level3_notes = assessment.level3_notes
    if assessment.level4_notes is not None:
        existing_assessment.level4_notes = assessment.level4_notes
    if assessment.level5_notes is not None:
        existing_assessment.level5_notes = assessment.level5_notes
    if assessment.level1_image is not None:
        existing_assessment.level1_image = assessment.level1_image
    if assessment.level2_image is not None:
        existing_assessment.level2_image = assessment.level2_image
    if assessment.level3_image is not None:
        existing_assessment.level3_image = assessment.level3_image
    if assessment.level4_image is not None:
        existing_assessment.level4_image = assessment.level4_image
    if assessment.level5_image is not None:
        existing_assessment.level5_image = assessment.level5_image
    if assessment.overall_count is not None:
        existing_assessment.overall_count = assessment.overall_count
    if assessment.checked_count is not None:
        existing_assessment.checked_count = assessment.checked_count
    
    existing_assessment.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(existing_assessment)
    return existing_assessment

@app.post("/api/mm/checksheet-selections")
def save_checksheet_selections(selections: List[ChecksheetSelectionCreate], db: Session = Depends(get_db)):
    """Save multiple checksheet selections"""
    try:
        saved_count = 0
        for selection_data in selections:
            # Check if selection already exists
            existing = db.query(ChecksheetSelection).filter(
                ChecksheetSelection.assessment_id == selection_data.assessment_id,
                ChecksheetSelection.maturity_level_id == selection_data.maturity_level_id
            ).first()
            
            if existing:
                # Update existing selection
                existing.is_selected = selection_data.is_selected
                existing.evidence = selection_data.evidence
                existing.updated_at = datetime.utcnow()
            else:
                # Create new selection
                new_selection = ChecksheetSelection(
                    assessment_id=selection_data.assessment_id,
                    maturity_level_id=selection_data.maturity_level_id,
                    is_selected=selection_data.is_selected,
                    evidence=selection_data.evidence
                )
                db.add(new_selection)
            saved_count += 1
        
        db.commit()
        return {
            "status": "success",
            "message": f"Saved {saved_count} selections",
            "count": saved_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving selections: {str(e)}")

@app.get("/api/mm/checksheet-selections/{assessment_id}", response_model=List[ChecksheetSelectionResponse])
def get_checksheet_selections(assessment_id: int, db: Session = Depends(get_db)):
    """Get all checksheet selections for an assessment"""
    selections = db.query(ChecksheetSelection).filter(
        ChecksheetSelection.assessment_id == assessment_id
    ).all()
    return selections

@app.get("/api/mm/checksheet-selections")
def get_all_checksheet_selections(db: Session = Depends(get_db)):
    """Get all checksheet selections (for demo/testing)"""
    selections = db.query(ChecksheetSelection).all()
    return selections
    
    new_assessment = Assessment(
        area_id=first_area.id,
        plant_name=assessment.plant_name,
        assessor_name=assessment.assessor_name,
        notes=assessment.notes,
        assessment_date=datetime.utcnow()
    )
    db.add(new_assessment)
    db.commit()
    db.refresh(new_assessment)
    return new_assessment

@app.get("/api/mm/assessments/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    """Get assessment by ID"""
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@app.post("/api/mm/checksheet-selections")
def save_checksheet_selections(selections: List[ChecksheetSelectionCreate], db: Session = Depends(get_db)):
    """Save multiple checksheet selections"""
    try:
        saved_count = 0
        for selection_data in selections:
            # Check if selection already exists
            existing = db.query(ChecksheetSelection).filter(
                ChecksheetSelection.assessment_id == selection_data.assessment_id,
                ChecksheetSelection.maturity_level_id == selection_data.maturity_level_id
            ).first()
            
            if existing:
                # Update existing selection
                existing.is_selected = selection_data.is_selected
                existing.evidence = selection_data.evidence
                existing.updated_at = datetime.utcnow()
            else:
                # Create new selection
                new_selection = ChecksheetSelection(
                    assessment_id=selection_data.assessment_id,
                    maturity_level_id=selection_data.maturity_level_id,
                    is_selected=selection_data.is_selected,
                    evidence=selection_data.evidence
                )
                db.add(new_selection)
            saved_count += 1
        
        db.commit()
        return {
            "status": "success",
            "message": f"Saved {saved_count} selections",
            "count": saved_count
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving selections: {str(e)}")

@app.get("/api/mm/checksheet-selections/{assessment_id}", response_model=List[ChecksheetSelectionResponse])
def get_checksheet_selections(assessment_id: int, db: Session = Depends(get_db)):
    """Get all checksheet selections for an assessment"""
    selections = db.query(ChecksheetSelection).filter(
        ChecksheetSelection.assessment_id == assessment_id
    ).all()
    return selections

@app.get("/api/mm/checksheet-selections")
def get_all_checksheet_selections(db: Session = Depends(get_db)):
    """Get all checksheet selections (for demo/testing)"""
    selections = db.query(ChecksheetSelection).all()
    return selections

@app.post("/api/mm/calculate-dimension-scores")
def calculate_dimension_scores(assessment_id: int, db: Session = Depends(get_db)):
    """Calculate dimension scores based on checksheet selections and update dimension assessments"""
    try:
        # Get the assessment
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        # Get all selected capabilities for this assessment
        selections = db.query(ChecksheetSelection).filter(
            ChecksheetSelection.assessment_id == assessment_id,
            ChecksheetSelection.is_selected == True
        ).all()
        
        if not selections:
            return {
                "status": "info",
                "message": "No capabilities selected yet",
                "dimensions_updated": 0,
                "calculated_level": 0
            }
        
        # Calculate the achieved maturity level based on selections
        # Logic: The highest level where ALL required capabilities are selected
        level_counts = {}
        for selection in selections:
            ml = db.query(MaturityLevel).get(selection.maturity_level_id)
            if ml:
                level = ml.level
                if level not in level_counts:
                    level_counts[level] = 0
                level_counts[level] += 1
        
        # Determine achieved level - highest level with at least some selections
        # In a real scenario, you'd check if ALL required capabilities for a level are met
        calculated_level = max(level_counts.keys()) if level_counts else 1
        
        # Get all dimensions for this assessment's area
        dimensions = db.query(Dimension).filter(Dimension.area_id == assessment.area_id).all()
        
        if not dimensions:
            # If no dimensions exist, create default ones for all areas
            dimensions = db.query(Dimension).all()
        
        updated_count = 0
        
        for dimension in dimensions:
            # Check if dimension assessment exists
            dim_assessment = db.query(DimensionAssessment).filter(
                DimensionAssessment.assessment_id == assessment_id,
                DimensionAssessment.dimension_id == dimension.id
            ).first()
            
            if dim_assessment:
                # Update existing
                if dim_assessment.current_level != calculated_level:
                    dim_assessment.current_level = calculated_level
                    dim_assessment.updated_at = datetime.utcnow()
                    updated_count += 1
            else:
                # Create new dimension assessment
                dim_assessment = DimensionAssessment(
                    assessment_id=assessment_id,
                    dimension_id=dimension.id,
                    current_level=calculated_level,
                    evidence=f"Calculated from checksheet selections (Level {calculated_level})"
                )
                db.add(dim_assessment)
                updated_count += 1
            
            # Also update the base dimension current level for reporting
            if dimension.current_level != calculated_level:
                dimension.current_level = calculated_level
                dimension.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {
            "status": "success",
            "message": f"Calculated dimension scores based on {len(selections)} selected capabilities",
            "selected_count": len(selections),
            "calculated_level": calculated_level,
            "dimensions_updated": updated_count,
            "assessment_id": assessment_id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error calculating scores: {str(e)}")

@app.post("/api/mm/refresh-simulated-data")
def refresh_simulated_data(db: Session = Depends(get_db)):
    """Refresh CheckSheet maturity levels data from CheckSheetData.xlsx"""
    try:
        # Use the new load_checksheet_data function
        from load_checksheet_data import load_checksheet_data
        
        # Close the database connection before calling the loader
        # (the loader creates its own session)
        load_checksheet_data()
        
        # Get count of loaded records
        count = db.query(MaturityLevel).count()
        
        return {
            "status": "success",
            "message": f"CheckSheet data refreshed successfully - {count} maturity criteria loaded",
            "records_loaded": count
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error refreshing checksheet data: {str(e)}")

@app.post("/api/mm/refresh-rating-scales")
def refresh_rating_scales(db: Session = Depends(get_db)):
    """Refresh Rating Scales data from CheckSheetData.xlsx"""
    try:
        # Use the new load_rating_scales_data function
        from load_rating_scales_data import load_rating_scales_data
        
        # Close the database connection before calling the loader
        # (the loader creates its own session)
        load_rating_scales_data()
        
        # Get count of loaded records
        count = db.query(RatingScale).count()
        
        return {
            "status": "success",
            "message": f"Rating Scales data refreshed successfully - {count} records loaded",
            "records_loaded": count
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error refreshing rating scales: {str(e)}")

@app.post("/api/mm/generate-report")
def generate_report(db: Session = Depends(get_db)):
    """Generate PDF report of maturity assessment"""
    try:
        from io import BytesIO
        from datetime import datetime
        from fastapi.responses import StreamingResponse
        
        # Get all areas with dimensions
        areas = db.query(Area).all()
        
        # Create HTML report
        html_content = f"""
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Mahindra & Mahindra - Digital Maturity Assessment Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background: #fff; }}
                h1 {{ color: #004A96; border-bottom: 4px solid #0066CC; padding-bottom: 10px; }}
                h2 {{ color: #0066CC; margin-top: 30px; }}
                h3 {{ color: #004A96; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th {{ background: #004A96; color: white; padding: 12px; text-align: left; }}
                td {{ padding: 10px; border: 1px solid #ddd; }}
                .level-1 {{ background: #fee; }}
                .level-2 {{ background: #fed; }}
                .level-3 {{ background: #ffc; }}
                .level-4 {{ background: #cef; }}
                .level-5 {{ background: #cfc; }}
                .summary {{ background: #f0f8ff; padding: 20px; margin: 20px 0; border-left: 4px solid #0066CC; }}
                .footer {{ margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; }}
            </style>
        </head>
        <body>
            <h1>📊 Digital Maturity Assessment Report</h1>
            <div class="summary">
                <h3>Report Details</h3>
                <p><strong>Organization:</strong> Mahindra & Mahindra</p>
                <p><strong>Assessment Date:</strong> {datetime.now().strftime('%B %d, %Y')}</p>
                <p><strong>Total Areas:</strong> {len(areas)}</p>
                <p><strong>Total Dimensions:</strong> {sum(len(area.dimensions) for area in areas)}</p>
            </div>
        """
        
        # Add each area
        for area in areas:
            html_content += f"""
            <h2>🎯 {area.name}</h2>
            <p><strong>Description:</strong> {area.description}</p>
            <p><strong>Target Level:</strong> Level {area.desired_level}</p>
            <table>
                <thead>
                    <tr>
                        <th>Dimension</th>
                        <th>Current Level</th>
                        <th>Target Level</th>
                        <th>Gap</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
            """
            
            for dim in area.dimensions:
                gap = dim.desired_level - dim.current_level
                status = "✅ On Track" if gap <= 0 else "⚠️ Below Target" if gap <= 2 else "❌ Critical Gap"
                
                html_content += f"""
                    <tr class="level-{dim.current_level}">
                        <td>{dim.name}</td>
                        <td>Level {dim.current_level}</td>
                        <td>Level {dim.desired_level}</td>
                        <td>{gap} levels</td>
                        <td>{status}</td>
                    </tr>
                """
            
            html_content += """
                </tbody>
            </table>
            """
        
        html_content += f"""
            <div class="footer">
                <p>Generated by Mahindra & Mahindra Digital Maturity Assessment System</p>
                <p>Report Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        </body>
        </html>
        """
        
        # Convert HTML to bytes
        pdf_bytes = BytesIO(html_content.encode('utf-8'))
        pdf_bytes.seek(0)
        
        # Return as downloadable file (HTML format for now)
        # For actual PDF, you would need a library like ReportLab or WeasyPrint
        return StreamingResponse(
            pdf_bytes,
            media_type="text/html",
            headers={
                "Content-Disposition": f"attachment; filename=Mahindra_Assessment_Report_{datetime.now().strftime('%Y%m%d')}.html"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")

@app.get("/api/mm/rating-scales", response_model=List[RatingScaleResponse])
def get_rating_scales(db: Session = Depends(get_db)):
    """Get all rating scale definitions"""
    print("DEBUG: Fetching rating scales...")  # DEBUG
    scales = db.query(RatingScale).order_by(RatingScale.dimension_name, RatingScale.level).all()
    print(f"DEBUG: Found {len(scales)} scales")  # DEBUG
    return scales

@app.get("/api/mm/rating-scales/{dimension_name}")
def get_rating_scale_by_dimension(dimension_name: str, db: Session = Depends(get_db)):
    """Get rating scales for a specific dimension"""
    scales = db.query(RatingScale).filter(RatingScale.dimension_name == dimension_name).order_by(RatingScale.level).all()
    if not scales:
        raise HTTPException(status_code=404, detail="Rating scales not found for this dimension")
    return scales

@app.post("/api/mm/simulate-update/{dimension_id}")
def simulate_dimension_update(dimension_id: int, db: Session = Depends(get_db)):
    """Simulate a random level change for streaming data demo"""
    dimension = db.query(Dimension).filter(Dimension.id == dimension_id).first()
    if not dimension:
        raise HTTPException(status_code=404, detail="Dimension not found")
    
    # Simulate improvement or regression
    change = random.choice([-1, 0, 1])
    new_level = max(1, min(5, dimension.current_level + change))
    
    dimension.current_level = new_level
    dimension.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(dimension)
    
    return {
        "status": "updated",
        "dimension_id": dimension_id,
        "old_level": dimension.current_level - change,
        "new_level": new_level,
        "timestamp": dimension.updated_at
    }

@app.get("/api/mm/reports/summary")
def get_reports_summary(db: Session = Depends(get_db)):
    """Get summary statistics for all areas"""
    areas = db.query(Area).all()
    summary = []
    
    for area in areas:
        dimensions = area.dimensions
        if dimensions:
            avg_current = sum(d.current_level for d in dimensions) / len(dimensions)
            on_track = sum(1 for d in dimensions if d.current_level >= d.desired_level - 1)
            completed = sum(1 for d in dimensions if d.current_level >= d.desired_level)
        else:
            avg_current = 0
            on_track = 0
            completed = 0
        
        summary.append({
            "area_id": area.id,
            "area_name": area.name,
            "desired_level": area.desired_level,
            "avg_current_level": round(avg_current, 1),
            "total_dimensions": len(dimensions),
            "on_track_count": on_track,
            "completed_count": completed,
            "needs_attention": len(dimensions) - on_track
        })
    
    return summary
