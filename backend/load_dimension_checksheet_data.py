"""
Load dimension-specific Smart Factory CheckSheet data from Excel
Each dimension column in the Excel has its own set of maturity level items
"""
import os
import pandas as pd
from sqlalchemy.orm import Session
from database import SessionLocal, MaturityLevel, Dimension

def clear_existing_data(db: Session):
    """Clear existing maturity levels"""
    db.query(MaturityLevel).delete()
    db.commit()
    print("Cleared existing maturity levels")

def load_dimension_specific_checksheet():
    """
    Load Smart Factory CheckSheet data from Excel with dimension-specific items
    The Excel structure has:
    - Row 2: Dimension names (columns 2-9)
    - Row 3: Level 1 header
    - Row 4+: Maturity items
    """
    
    # Build path to Excel file
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    excel_path = os.path.join(project_root, 'frontend', 'src', 'components', 'M_M_Data', 'MM_Data.xlsx')
    
    print(f"Reading Excel file: {excel_path}")
    
    # Read the Excel sheet without headers
    df = pd.read_excel(excel_path, sheet_name='Smart Factory CheckSheet', header=None)
    
    print(f"Excel shape: {df.shape}")
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        clear_existing_data(db)
        
        # Get dimension names from row 2 (index 2), columns 2-9
        dimension_row = df.iloc[2]
        dimension_columns = {}  # Map column index to dimension name
        
        for col_idx in range(2, 10):  # Columns 2-9
            dim_name = str(dimension_row[col_idx]).strip() if pd.notna(dimension_row[col_idx]) else None
            if dim_name and dim_name != 'nan':
                dimension_columns[col_idx] = dim_name
                print(f"Column {col_idx}: {dim_name}")
        
        # Get dimension objects from database
        dimension_map = {}  # Map dimension name to dimension ID
        for dim_name in dimension_columns.values():
            dimension = db.query(Dimension).filter(Dimension.name == dim_name).first()
            if dimension:
                dimension_map[dim_name] = dimension.id
                print(f"Mapped '{dim_name}' to dimension ID {dimension.id}")
            else:
                print(f"WARNING: Dimension '{dim_name}' not found in database")
        
        # Parse each dimension column
        loaded_count = 0
        
        for col_idx, dim_name in dimension_columns.items():
            if dim_name not in dimension_map:
                print(f"Skipping column {col_idx} - dimension not in database")
                continue
            
            dimension_id = dimension_map[dim_name]
            current_level = None
            current_level_name = None
            current_category = None
            
            print(f"\nProcessing dimension: {dim_name} (column {col_idx})")
            
            # Parse rows (starting from row 4, index 3)
            for row_idx in range(3, len(df)):
                # Column 0 has the sub_level (1.1, 1.1a, etc.)
                # Column 1 has the description/category
                # Column col_idx has dimension-specific text (if any)
                
                sub_level_val = str(df.iloc[row_idx, 0]).strip() if pd.notna(df.iloc[row_idx, 0]) else ""
                description = str(df.iloc[row_idx, 1]).strip() if pd.notna(df.iloc[row_idx, 1]) else ""
                
                # Skip empty rows
                if not sub_level_val and not description:
                    continue
                
                # Check if this is a level header (e.g., starts with "Level")
                if description.startswith("Level "):
                    # Extract level number
                    level_parts = description.split(":")
                    if len(level_parts) >= 1:
                        level_num_str = level_parts[0].replace("Level", "").strip()
                        try:
                            current_level = int(level_num_str)
                            current_level_name = level_parts[1].strip() if len(level_parts) > 1 else ""
                            print(f"  Found Level {current_level}: {current_level_name}")
                        except ValueError:
                            pass
                    continue
                
                # Check if this is a category header (e.g., "1.1")
                if sub_level_val and not any(c.isalpha() for c in sub_level_val):
                    # This is a category (e.g., "1.1", "2.2")
                    current_category = description
                    print(f"    Category {sub_level_val}: {current_category}")
                    continue
                
                # This is an actual item (e.g., "1.1a", "1.1b")
                if sub_level_val and current_level and current_category:
                    # Create the maturity level entry
                    maturity_level = MaturityLevel(
                        dimension_id=dimension_id,
                        level=current_level,
                        name=current_level_name,
                        sub_level=sub_level_val,
                        category=current_category,
                        description=description
                    )
                    db.add(maturity_level)
                    loaded_count += 1
                    print(f"      Added {sub_level_val}: {description[:50]}...")
        
        db.commit()
        print(f"\n✓ Successfully loaded {loaded_count} maturity level items across {len(dimension_map)} dimensions")
        
        # Show summary by dimension
        for dim_name, dim_id in dimension_map.items():
            count = db.query(MaturityLevel).filter(MaturityLevel.dimension_id == dim_id).count()
            print(f"  {dim_name}: {count} items")
        
    except Exception as e:
        db.rollback()
        print(f"Error loading data: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    load_dimension_specific_checksheet()
