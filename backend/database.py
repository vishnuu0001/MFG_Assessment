from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from pathlib import Path

# For serverless, use /tmp directory for SQLite database
if os.environ.get('VERCEL'):
    # Vercel serverless environment
    DB_PATH = "/tmp/manufacturing.db"
else:
    # Local development
    DB_PATH = "./manufacturing.db"

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Area(Base):
    __tablename__ = "areas"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    desired_level = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    dimensions = relationship("Dimension", back_populates="area")
    assessments = relationship("Assessment", back_populates="area")

class Dimension(Base):
    __tablename__ = "dimensions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    area_id = Column(Integer, ForeignKey("areas.id"))
    current_level = Column(Integer, default=1)
    desired_level = Column(Integer, default=3)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    area = relationship("Area", back_populates="dimensions")
    assessments = relationship("DimensionAssessment", back_populates="dimension")

class MaturityLevel(Base):
    __tablename__ = "maturity_levels"
    
    id = Column(Integer, primary_key=True, index=True)
    level = Column(Integer, index=True)
    name = Column(String)
    sub_level = Column(String, nullable=True)  # e.g., "1.1a", "2.3b"
    category = Column(String, nullable=True)  # e.g., "Instrumented Assets & Lines"
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class RatingScale(Base):
    __tablename__ = "rating_scales"
    
    id = Column(Integer, primary_key=True, index=True)
    dimension_name = Column(String, index=True)
    level = Column(Integer)
    rating_name = Column(String)  # e.g., "1 – Basic Connectivity"
    digital_maturity_description = Column(Text)
    business_relevance = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer, ForeignKey("areas.id"), nullable=True)
    plant_name = Column(String, nullable=True)
    plant_location = Column(String, nullable=True)
    assessment_date = Column(DateTime, default=datetime.utcnow)
    assessor_name = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    # Level-specific notes for Smart Factory Checksheet
    level1_notes = Column(Text, nullable=True)
    level2_notes = Column(Text, nullable=True)
    level3_notes = Column(Text, nullable=True)
    level4_notes = Column(Text, nullable=True)
    level5_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    area = relationship("Area", back_populates="assessments")
    dimension_assessments = relationship("DimensionAssessment", back_populates="assessment")

class DimensionAssessment(Base):
    __tablename__ = "dimension_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    dimension_id = Column(Integer, ForeignKey("dimensions.id"))
    current_level = Column(Integer)
    evidence = Column(Text, nullable=True)
    gaps = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    assessment = relationship("Assessment", back_populates="dimension_assessments")
    dimension = relationship("Dimension", back_populates="assessments")

class ChecksheetSelection(Base):
    __tablename__ = "checksheet_selections"
    
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=True)
    maturity_level_id = Column(Integer, ForeignKey("maturity_levels.id"))
    is_selected = Column(Boolean, default=False)
    evidence = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    maturity_level = relationship("MaturityLevel")

# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
