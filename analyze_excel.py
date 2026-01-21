import pandas as pd

df = pd.read_excel('frontend/src/components/M_M_Data/MM_Data.xlsx', sheet_name='Smart Factory CheckSheet', header=None)

print("Excel structure analysis:")
print("=" * 80)
print("\nRow 2 (Dimension headers):")
for col in range(2, 10):
    val = df.iloc[2, col]
    if pd.notna(val):
        print(f"  Column {col}: {val}")

print("\n" + "=" * 80)
print("\nChecking rows 4-10 to see if content differs by column:")
print("=" * 80)

for row_idx in range(4, 10):
    sub_level = df.iloc[row_idx, 0]
    desc = df.iloc[row_idx, 1]
    
    print(f"\nRow {row_idx}: {sub_level} - {str(desc)[:60] if pd.notna(desc) else 'N/A'}")
    
    # Check columns 2-9 for this row
    has_content = False
    for col in range(2, 10):
        val = df.iloc[row_idx, col]
        if pd.notna(val) and str(val).strip() != '':
            print(f"    Column {col} ({df.iloc[2, col]}): {str(val)[:80]}")
            has_content = True
    
    if not has_content:
        print("    (No dimension-specific content in any column)")
