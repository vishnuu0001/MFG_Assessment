"""
Load simulated data from Smart Factory CheckSheet Excel into database
"""
import os
import pandas as pd
from sqlalchemy.orm import Session
from database import engine, MaturityLevel, RatingScale, SessionLocal

def clear_existing_data(db: Session):
    """Clear existing maturity levels"""
    db.query(MaturityLevel).delete()
    db.commit()
    print("Cleared existing maturity levels")

def load_smart_factory_data():
    """Load Smart Factory CheckSheet data from Excel"""
    
    # Build path to Excel file
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_path = os.path.join(project_root, 'frontend', 'src', 'components', 'M_M_Data', 'MM_Data.xlsx')
    
    print(f"Reading Excel file: {excel_path}")
    
    # Read the Excel sheet
    df = pd.read_excel(excel_path, sheet_name='Smart Factory CheckSheet', header=None)
    
    print(f"Excel shape: {df.shape}")
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        clear_existing_data(db)
        
        # Parse the data structure
        # Row 3 has column headers (dimensions)
        # Rows 4+ have level headers and capabilities
        
        current_level = None
        current_level_name = None
        
        loaded_count = 0
        
        for idx, row in df.iterrows():
            if idx < 3:  # Skip header rows
                continue
            
            # Check if this is a level header (e.g., "Level 1: Connected & Visible")
            first_col = str(row[1]) if pd.notna(row[1]) else ""
            
            if "Level" in first_col and ":" in first_col:
                # Extract level number and name
                parts = first_col.split(":")
                level_part = parts[0].strip()
                level_num = int(level_part.replace("Level", "").strip())
                level_name = parts[1].strip() if len(parts) > 1 else f"Level {level_num}"
                
                current_level = level_num
                current_level_name = level_name
                print(f"\nProcessing Level {current_level}: {current_level_name}")
                continue
            
            # Check if this is a sub-level indicator (e.g., "1.1", "1.2", etc.)
            sub_level_col = str(row[0]) if pd.notna(row[0]) else ""
            description_col = str(row[1]) if pd.notna(row[1]) else ""
            
            # Skip if SUV marker or empty rows
            if description_col == "SUV" or description_col == "nan" or not description_col:
                continue
            
            # Check if this is a capability description
            if sub_level_col and sub_level_col != "nan":
                # This is a specific capability (e.g., 1.1a, 1.2b, etc.)
                sub_level = sub_level_col
                description = description_col
                
                # Determine category based on which column has data
                category = None
                for col_idx in range(2, 11):  # Columns 2-10 are dimension columns
                    if pd.notna(row[col_idx]) and str(row[col_idx]).strip():
                        # Map column index to dimension name
                        dimension_map = {
                            2: "Asset connectivity & OEE",
                            3: "MES & system integration",
                            4: "Traceability & quality",
                            5: "Maintenance & reliability",
                            6: "Logistics & supply chain",
                            7: "Workforce & UX",
                            8: "Sustainability & energy",
                            9: "Multi-plant orchestration"
                        }
                        category = dimension_map.get(col_idx, "General")
                        break
                
                if current_level and description:
                    maturity_level = MaturityLevel(
                        level=current_level,
                        name=current_level_name or f"Level {current_level}",
                        sub_level=sub_level,
                        category=category,
                        description=description.strip()
                    )
                    db.add(maturity_level)
                    loaded_count += 1
                    print(f"  Added: {sub_level} - {category} - {description[:50]}...")
        
        db.commit()
        print(f"\n✅ Successfully loaded {loaded_count} maturity level items")
        return loaded_count
        
    except Exception as e:
        print(f"Error loading data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    load_smart_factory_data()
