"""
Load simulated Reports data from Excel into database
"""
import os
import pandas as pd
import random
from sqlalchemy.orm import Session
from database import SessionLocal, Area, Dimension

def load_reports_simulated_data():
    """Load Reports sheet data from Excel into Areas and Dimensions"""
    
    # Build path to Excel file
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_path = os.path.join(project_root, 'frontend', 'src', 'components', 'M_M_Data', 'MM_Data.xlsx')
    
    print(f"Reading Excel file: {excel_path}")
    
    # Read the Reports sheet
    df = pd.read_excel(excel_path, sheet_name='Reports', header=None)
    
    print(f"Excel shape: {df.shape}")
    
    db = SessionLocal()
    
    try:
        # Clear existing areas and dimensions
        db.query(Dimension).delete()
        db.query(Area).delete()
        db.commit()
        print("Cleared existing areas and dimensions")
        
        current_area = None
        area_obj = None
        dimension_count = 0
        
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
                    description=f"{current_area} Digital Maturity",
                    desired_level=desired_level
                )
                db.add(area_obj)
                db.flush()  # Get the ID
                print(f"\nCreated Area: {current_area} (Desired Level: {desired_level})")
                
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
                    print(f"  Added dimension: {dimension_name} (Current: {current_level}, Desired: {desired_level})")
                continue
            
            # Check if this is a dimension row (no area name, but has dimension name in column 1)
            dimension_name = col1_value
            
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
                print(f"  Added dimension: {dimension_name} (Current: {current_level}, Desired: {area_obj.desired_level})")
        
        db.commit()
        print(f"\n✅ Successfully loaded {dimension_count} dimensions across areas")
        return dimension_count
        
    except Exception as e:
        print(f"Error loading reports data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    load_reports_simulated_data()
