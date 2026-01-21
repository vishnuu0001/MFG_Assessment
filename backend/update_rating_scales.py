import pandas as pd
from database import SessionLocal, RatingScale, Dimension
from sqlalchemy.orm import Session
import os

# Read the Rating Scales Excel sheet (without headers)
# Use absolute path from the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(backend_dir)
excel_file = os.path.join(project_root, 'frontend', 'src', 'components', 'M_M_Data', 'MM_Data.xlsx')
df = pd.read_excel(excel_file, sheet_name='Rating Scales', header=None)

# Dimension names are in row 5 (index 5)
# Rating names and descriptions start from row 9 (index 9) to row 13 (index 13) for levels 1-5
# Each dimension occupies 3 columns: dimension name, description, classification

# Extract dimension names from row 5
dimension_row = df.iloc[5]
dimensions = []
for col_idx in [0, 3, 6, 9, 12, 15, 18, 21, 24, 27]:
    if col_idx < len(dimension_row):
        dim_name = dimension_row.iloc[col_idx]
        if pd.notna(dim_name) and str(dim_name).strip() and 'Digital Maturity' not in str(dim_name):
            dimensions.append((col_idx, str(dim_name).strip()))

print(f"Found {len(dimensions)} dimensions:")
for idx, (col_idx, name) in enumerate(dimensions, 1):
    print(f"{idx}. {name} (column {col_idx})")

# Extract rating scales for each dimension
db = SessionLocal()

try:
    # Clear existing rating scales
    db.query(RatingScale).delete()
    db.commit()
    print("\n✓ Cleared existing rating scales")
    
    # Extract data for levels 1-5 (rows 9-13)
    for col_idx, dimension_name in dimensions:
        print(f"\nProcessing: {dimension_name}")
        
        for level_row_idx in range(9, 14):  # Rows 9-13 for levels 1-5
            level = level_row_idx - 8  # Convert to level 1-5
            
            # Get the rating name and description
            rating_cell = df.iloc[level_row_idx, col_idx]
            description_cell = df.iloc[level_row_idx, col_idx + 1] if col_idx + 1 < len(df.columns) else None
            
            # Business relevance is in rows 18-20 (for levels 1-3 only based on the data)
            # Row 18 = Level 1, Row 19 = Level 2, Row 20 = Level 3
            business_relevance = None
            if level <= 3:
                business_row_idx = 17 + level  # 18, 19, 20 for levels 1, 2, 3
                if business_row_idx < len(df):
                    business_cell = df.iloc[business_row_idx, col_idx + 1]
                    if pd.notna(business_cell):
                        business_relevance = str(business_cell).strip()
            
            if pd.notna(rating_cell):
                rating_name = str(rating_cell).strip()
                rating_desc = str(description_cell).strip() if pd.notna(description_cell) else ""
                
                rating_scale = RatingScale(
                    dimension_name=dimension_name,
                    level=level,
                    rating_name=rating_name[:200] if len(rating_name) > 200 else rating_name,
                    digital_maturity_description=rating_desc,
                    business_relevance=business_relevance
                )
                db.add(rating_scale)
                print(f"  Level {level}: {rating_name[:60]}...")
    
    db.commit()
    print(f"\n✓ Successfully loaded rating scales for all dimensions")
    
    # Verify the data
    count = db.query(RatingScale).count()
    print(f"✓ Total rating scale entries: {count}")
    
    # Show dimensions
    unique_dims = db.query(RatingScale.dimension_name).distinct().all()
    print(f"\n✓ Dimensions in Rating Scales:")
    for dim in unique_dims:
        print(f"  - {dim[0]}")

finally:
    db.close()
