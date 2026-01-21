from database import SessionLocal, MaturityLevel

db = SessionLocal()

# Check dimension_id distribution
print("Checking dimension_id for maturity levels:\n")
for dim_id in range(1, 9):
    count = db.query(MaturityLevel).filter(MaturityLevel.dimension_id == dim_id).count()
    if count > 0:
        first = db.query(MaturityLevel).filter(MaturityLevel.dimension_id == dim_id).first()
        print(f"Dimension {dim_id}: {count} items - First: {first.sub_level} - {first.category}")

db.close()
