from backend.database import SessionLocal, Dimension

db = SessionLocal()
dims = db.query(Dimension).all()

print(f'Total dimensions: {len(dims)}\n')
for d in dims:
    print(f'{d.id}: {d.name}')

db.close()
