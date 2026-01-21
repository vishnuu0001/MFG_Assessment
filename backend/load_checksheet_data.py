"""
Data loader for CheckSheetData.xlsx - CheckSheet tab
Parses the smart factory maturity assessment checksheet with Level 1-5 criteria
"""
import pandas as pd
from pathlib import Path
from database import SessionLocal, MaturityLevel

def load_checksheet_data():
    """
    Load checksheet data from CheckSheetData.xlsx (CheckSheet tab)
    Parses Level 1-5 smart factory maturity criteria
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
        
        print(f"Loading CheckSheet data from: {excel_path}")
        
        # Read the CheckSheet tab without headers
        df = pd.read_excel(excel_path, sheet_name='CheckSheet', header=None)
        
        # Delete existing records
        db.query(MaturityLevel).delete()
        db.commit()
        
        print(f"Cleared existing maturity levels")
        
        # Parse the data structure
        # Column 0: Level indicators (1.1, 1.1a, 2.1, etc.)
        # Column 1: Category or criteria description
        # Column 2: Score (if present)
        # Column 3: Remarks/evidence
        
        current_level = None
        current_category = None
        current_main_level = None
        
        for idx, row in df.iterrows():
            col0 = str(row[0]).strip() if pd.notna(row[0]) else ""
            col1 = str(row[1]).strip() if pd.notna(row[1]) else ""
            col2 = str(row[2]).strip() if pd.notna(row[2]) else ""
            col3 = str(row[3]).strip() if pd.notna(row[3]) else ""
            
            # Skip header rows and empty rows
            if not col0 and not col1:
                continue
            if "Check Sheet for Smart Factory" in col0:
                continue
            if "Plant:" in col0 or "Date:" in col0:
                continue
            if col1 == "Remarks" or col2 == "Press Shop":
                continue
            
            # Detect level headers (e.g., "Level 1: Connected & Visible")
            if "Level" in col1 and ":" in col1:
                level_text = col1
                # Extract level number
                if "Level 1" in level_text:
                    current_level = 1
                elif "Level 2" in level_text:
                    current_level = 2
                elif "Level 3" in level_text:
                    current_level = 3
                elif "Level 4" in level_text:
                    current_level = 4
                elif "Level 5" in level_text:
                    current_level = 5
                
                # Extract level name (after colon)
                level_name = level_text.split(":", 1)[1].strip() if ":" in level_text else level_text
                
                # Create a level header record
                maturity_level = MaturityLevel(
                    level=current_level,
                    name=level_name,
                    sub_level=None,
                    category=None,
                    description=f"Level {current_level}: {level_name}"
                )
                db.add(maturity_level)
                print(f"Added Level {current_level} header: {level_name}")
                continue
            
            # Detect main level categories (e.g., 1.1, 2.1, 3.1)
            if col0 and not any(c.isalpha() for c in col0):  # Pure numeric format like "1.1"
                try:
                    parts = col0.split('.')
                    if len(parts) == 2:
                        main_num = int(parts[0])
                        sub_num = int(parts[1])
                        current_main_level = col0
                        current_category = col1
                        
                        # Create category record
                        if current_category:
                            maturity_level = MaturityLevel(
                                level=main_num,
                                name=current_category,
                                sub_level=current_main_level,
                                category=current_category,
                                description=current_category
                            )
                            db.add(maturity_level)
                            print(f"Added category {current_main_level}: {current_category}")
                        continue
                except (ValueError, IndexError):
                    pass
            
            # Detect sub-level criteria (e.g., 1.1a, 2.1b)
            if col0 and any(c.isalpha() for c in col0):  # Format like "1.1a"
                try:
                    # Extract level number from format like "1.1a"
                    base = col0.rstrip('abcdefghijklmnopqrstuvwxyz')
                    parts = base.split('.')
                    if len(parts) == 2:
                        main_num = int(parts[0])
                        
                        # Description is in col1
                        description = col1
                        
                        # Score might be in col2
                        score = None
                        try:
                            score = float(col2) if col2 and col2 != 'nan' else None
                        except (ValueError, TypeError):
                            pass
                        
                        # Remarks/evidence in col3
                        evidence = col3 if col3 and col3 != 'nan' else None
                        
                        # Create criteria record
                        if description:
                            maturity_level = MaturityLevel(
                                level=main_num,
                                name=description[:100] if len(description) > 100 else description,  # Truncate name
                                sub_level=col0,
                                category=current_category,
                                description=description
                            )
                            db.add(maturity_level)
                            print(f"Added criterion {col0}: {description[:80]}...")
                except (ValueError, IndexError) as e:
                    print(f"Error parsing row {idx}: {e}")
                    continue
        
        # Commit all changes
        db.commit()
        print(f"\n✅ CheckSheet data loaded successfully")
        
        # Print summary
        total_count = db.query(MaturityLevel).count()
        level_counts = {}
        for i in range(1, 6):
            count = db.query(MaturityLevel).filter(MaturityLevel.level == i).count()
            level_counts[i] = count
        
        print(f"\nSummary:")
        print(f"Total maturity criteria: {total_count}")
        for level, count in level_counts.items():
            print(f"  Level {level}: {count} items")
        
    except Exception as e:
        print(f"Error loading checksheet data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_checksheet_data()
