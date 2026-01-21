"""
Script to add Asset Connectivity & OEE rating scale to the database
This adds the dimension and its 5 maturity levels as specified in requirements
"""
from database import SessionLocal, RatingScale, Dimension, Area
from sqlalchemy.orm import Session

# Asset Connectivity & OEE rating scale data
ASSET_CONNECTIVITY_DATA = {
    "dimension_name": "Asset Connectivity & OEE",
    "levels": [
        {
            "level": 1,
            "rating_name": "1 – Basic Connectivity",
            "digital_maturity_description": "Assets connected at machine level only; manual OEE tracking; limited visibility",
            "business_relevance": "Foundation for data collection and basic monitoring"
        },
        {
            "level": 2,
            "rating_name": "2 – Centralized Monitoring",
            "digital_maturity_description": "Assets connected to SCADA/HMI; automated OEE capture; siloed data repositories",
            "business_relevance": "Improved visibility and automated data collection"
        },
        {
            "level": 3,
            "rating_name": "3 – Integrated OEE Analytics",
            "digital_maturity_description": "OEE data integrated with MES/ERP; standardized KPIs; historical trend analysis",
            "business_relevance": "Data-driven decision making with enterprise integration"
        },
        {
            "level": 4,
            "rating_name": "4 – Predictive OEE Optimization",
            "digital_maturity_description": "Real-time OEE dashboards; predictive analytics for downtime and performance; cross-line optimization",
            "business_relevance": "Proactive optimization and predictive maintenance"
        },
        {
            "level": 5,
            "rating_name": "5 – Autonomous Asset Management",
            "digital_maturity_description": "AI-driven OEE optimization; self-healing assets; enterprise-wide visibility across plants",
            "business_relevance": "Autonomous operations with AI-driven optimization across enterprise"
        }
    ]
}

def add_asset_connectivity_dimension():
    """Add Asset Connectivity & OEE dimension with rating scales"""
    db = SessionLocal()
    
    try:
        # Check if dimension already exists
        existing_dimension = db.query(Dimension).filter(
            Dimension.name == ASSET_CONNECTIVITY_DATA["dimension_name"]
        ).first()
        
        if not existing_dimension:
            # Get or create default area
            default_area = db.query(Area).filter(Area.name == "Operations Excellence").first()
            if not default_area:
                default_area = db.query(Area).first()
            
            if not default_area:
                print("❌ No areas found. Please load areas data first.")
                return
            
            # Create new dimension
            new_dimension = Dimension(
                name=ASSET_CONNECTIVITY_DATA["dimension_name"],
                area_id=default_area.id,
                current_level=1,
                desired_level=3
            )
            db.add(new_dimension)
            db.commit()
            print(f"✅ Created dimension: {ASSET_CONNECTIVITY_DATA['dimension_name']}")
        else:
            print(f"ℹ️  Dimension already exists: {ASSET_CONNECTIVITY_DATA['dimension_name']}")
        
        # Delete existing rating scales for this dimension
        db.query(RatingScale).filter(
            RatingScale.dimension_name == ASSET_CONNECTIVITY_DATA["dimension_name"]
        ).delete()
        db.commit()
        print(f"🗑️  Cleared existing rating scales for {ASSET_CONNECTIVITY_DATA['dimension_name']}")
        
        # Add rating scales for all 5 levels
        for level_data in ASSET_CONNECTIVITY_DATA["levels"]:
            rating_scale = RatingScale(
                dimension_name=ASSET_CONNECTIVITY_DATA["dimension_name"],
                level=level_data["level"],
                rating_name=level_data["rating_name"],
                digital_maturity_description=level_data["digital_maturity_description"],
                business_relevance=level_data["business_relevance"]
            )
            db.add(rating_scale)
        
        db.commit()
        print(f"✅ Added {len(ASSET_CONNECTIVITY_DATA['levels'])} rating scales for {ASSET_CONNECTIVITY_DATA['dimension_name']}")
        
        # Display the added data
        print("\n📊 Asset Connectivity & OEE Rating Scales:")
        print("=" * 80)
        for level_data in ASSET_CONNECTIVITY_DATA["levels"]:
            print(f"\nLevel {level_data['level']}: {level_data['rating_name']}")
            print(f"  Description: {level_data['digital_maturity_description']}")
            print(f"  Business: {level_data['business_relevance']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Adding Asset Connectivity & OEE Rating Scale...\n")
    success = add_asset_connectivity_dimension()
    if success:
        print("\n✅ Asset Connectivity & OEE rating scale added successfully!")
    else:
        print("\n❌ Failed to add Asset Connectivity & OEE rating scale")
