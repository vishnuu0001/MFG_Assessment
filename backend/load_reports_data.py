"""
Load Reports data from Excel into database with unique dimensions
"""
import os
import pandas as pd
import random
from sqlalchemy.orm import Session
from database import SessionLocal, Area, Dimension

def load_reports_simulated_data():
    """Load Reports sheet data with unique dimensions (no duplicates)"""
    
    # Build path to Excel file
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_path = os.path.join(project_root, 'frontend', 'src', 'components', 'M_M_Data', 'MM_Data.xlsx')
    
    print(f"Reading Excel file: {excel_path}")
    
    # Read the Reports sheet
    df = pd.read_excel(excel_path, sheet_name='Reports', header=None)
    
    print(f"Excel shape: {df.shape}")
    
    db = SessionLocal()
    
    try:
        # Clear existing dimensions and areas
        db.query(Dimension).delete()
        db.query(Area).delete()
        db.commit()
        print("Cleared existing areas and dimensions\n")
        
        # Create a default "Operations Excellence" area
        default_area = Area(
            name="Operations Excellence",
            description="Smart Factory Digital Maturity Assessment",
            desired_level=3
        )
        db.add(default_area)
        db.flush()
        print(f"Created default area: {default_area.name}\n")
        
        dimension_names = set()  # Track unique dimension names
        dimension_count = 0
        
        # Parse the data to extract unique dimension names
        for idx, row in df.iterrows():
            if idx < 3:  # Skip header rows
                continue
            
            col1_value = str(row[1]) if pd.notna(row[1]) else ""
            
            # Check if this is a dimension name
            if col1_value and col1_value != "nan" and col1_value != "Dimension" and col1_value.strip():
                dimension_name = col1_value.strip()
                
                # Only add if not already seen (ensure uniqueness)
                if dimension_name not in dimension_names:
                    dimension_names.add(dimension_name)
                    
                    # Create dimension with random current level for simulation
                    current_level = random.randint(1, 3)
                    desired_level = random.randint(3, 4)
                    
                    dimension = Dimension(
                        name=dimension_name,
                        area_id=default_area.id,
                        current_level=current_level,
                        desired_level=desired_level
                    )
                    db.add(dimension)
                    dimension_count += 1
                    print(f"✓ Added dimension: {dimension_name} (Current: {current_level}, Desired: {desired_level})")
        
        db.commit()
        print(f"\n✅ Successfully loaded {dimension_count} unique dimensions")
        return dimension_count
        
    except Exception as e:
        print(f"❌ Error loading reports data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    load_reports_simulated_data()
