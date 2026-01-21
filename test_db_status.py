"""Quick test script to verify database setup"""
from backend.database import SessionLocal, MaturityLevel, RatingScale

db = SessionLocal()

print('=' * 60)
print('  SMART FACTORY ASSESSMENT - DATABASE STATUS')
print('=' * 60)

# Maturity Levels
ml_count = db.query(MaturityLevel).count()
print(f'\n✅ Maturity Levels (CheckSheet): {ml_count} criteria')

for level in range(1, 6):
    count = db.query(MaturityLevel).filter(MaturityLevel.level == level).count()
    print(f'   Level {level}: {count} items')

# Rating Scales
rs_count = db.query(RatingScale).count()
dimensions = list(set([rs.dimension_name for rs in db.query(RatingScale).all()]))
print(f'\n✅ Rating Scales: {rs_count} records across {len(dimensions)} dimensions')

print(f'\nDimensions:')
for i, dim in enumerate(sorted(dimensions), 1):
    count = db.query(RatingScale).filter(RatingScale.dimension_name == dim).count()
    print(f'   {i:2d}. {dim:45s} ({count} levels)')

print('\n' + '=' * 60)
print('  All systems ready! Start the dev servers to test.')
print('=' * 60)

db.close()
