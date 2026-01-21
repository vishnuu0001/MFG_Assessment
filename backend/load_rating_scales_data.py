"""
Data loader for CheckSheetData.xlsx - RatingScales tab
Parses the dimension rating scales for Smart Factory Assessment
"""
import pandas as pd
from pathlib import Path
from database import SessionLocal, RatingScale

def load_rating_scales_data():
    """
    Load rating scales data from CheckSheetData.xlsx (RatingScales tab)
    Parses the 10+ dimensions with Level 1-5 maturity descriptions
    """
    db = SessionLocal()
    
    try:
        # Get the Excel file path - try both locations
        excel_paths = [
            Path(__file__).parent.parent / 'frontend' / 'src' / 'components' / 'M_M_Data' / 'CheckSheetData.xlsx',
            Path(__file__).parent.parent / 'docs' / 'CheckSheetData.xlsx'
        ]
        
        excel_path = None
        for path in excel_paths:
            if path.exists():
                excel_path = path
                break
        
        if not excel_path:
            print("CheckSheetData.xlsx not found in expected locations")
            return
        
        print(f"Loading RatingScales data from: {excel_path}")
        
        # Read the RatingScales tab
        df = pd.read_excel(excel_path, sheet_name='RatingScales', header=None)
        
        # Delete existing records
        db.query(RatingScale).delete()
        db.commit()
        
        print(f"Cleared existing rating scales")
        
        # The structure has dimensions in columns
        # Row 0: Dimension names (Strategy and Governance, Asset Connectivity and OEE, etc.)
        # Row 1: "Digital Maturity" or similar
        # Row 2: Column headers (Rating, Description, etc.)
        # Rows 3-7: Level data (Basic/Medium/Advanced/Leading/Nirvana or Level 1-5)
        
        # Extract dimension names from row 0
        dimensions = {}
        current_dim = None
        
        for col_idx in range(len(df.columns)):
            cell_value = str(df.iloc[0, col_idx]).strip() if pd.notna(df.iloc[0, col_idx]) else ""
            if cell_value and cell_value != "nan" and not cell_value.startswith("Unnamed"):
                current_dim = cell_value
                dimensions[col_idx] = current_dim
            elif current_dim:
                # Multi-column dimensions - associate this column with current dimension
                dimensions[col_idx] = current_dim
        
        print(f"\nFound {len(set(dimensions.values()))} dimensions:")
        for dim in sorted(set(dimensions.values())):
            print(f"  - {dim}")
        
        # Level mapping from row text to level number
        level_mapping = {
            'Basic': 1,
            'Medium': 2,
            'Advanced': 3,
            'Leading': 4,
            'Nirvana': 5,
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5
        }
        
        # Process rows 3-7 (or until we run out of level data)
        records_added = 0
        
        for row_idx in range(3, min(10, len(df))):  # Process up to row 10
            # Get the level indicator from first column
            level_text = str(df.iloc[row_idx, 0]).strip() if pd.notna(df.iloc[row_idx, 0]) else ""
            
            if not level_text or level_text == "nan":
                continue
            
            # Determine level number
            level_num = None
            for key, val in level_mapping.items():
                if key in level_text or level_text.startswith(key):
                    level_num = val
                    break
            
            if not level_num:
                continue
            
            # Process each dimension column
            for col_idx, dim_name in dimensions.items():
                # Skip the first column (level indicator)
                if col_idx == 0:
                    continue
                
                # Get the description for this dimension at this level
                description = str(df.iloc[row_idx, col_idx]).strip() if pd.notna(df.iloc[row_idx, col_idx]) else ""
                
                # Skip empty or "Rating" header cells
                if not description or description == "nan" or description == "Rating":
                    continue
                if "Classification Standard" in description or "Details" in description:
                    continue
                
                # For the rating column, extract the rating name from the next column
                rating_name = None
                
                # Check if this looks like a rating indicator column (e.g., "1 – Basic Connectivity")
                if "–" in description or "-" in description:
                    rating_name = description
                    # Try to get more detailed description from next column if available
                    if col_idx + 1 < len(df.columns):
                        next_desc = str(df.iloc[row_idx, col_idx + 1]).strip() if pd.notna(df.iloc[row_idx, col_idx + 1]) else ""
                        if next_desc and next_desc != "nan" and len(next_desc) > len(description):
                            description = next_desc
                else:
                    rating_name = f"Level {level_num}"
                
                # Create rating scale record
                rating_scale = RatingScale(
                    dimension_name=dim_name,
                    level=level_num,
                    rating_name=rating_name,
                    digital_maturity_description=description
                )
                db.add(rating_scale)
                records_added += 1
        
        # Commit all changes
        db.commit()
        print(f"\n✅ RatingScales data loaded successfully - {records_added} records added")
        
        # Print summary by dimension
        print(f"\nSummary by dimension:")
        for dim_name in sorted(set(dimensions.values())):
            count = db.query(RatingScale).filter(RatingScale.dimension_name == dim_name).count()
            print(f"  {dim_name}: {count} levels")
        
    except Exception as e:
        print(f"Error loading rating scales data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_rating_scales_data()
