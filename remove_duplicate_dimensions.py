import sys
import os
# Change to backend directory
os.chdir('backend')
from database import SessionLocal, Dimension

db = SessionLocal()

# Get all dimensions
all_dims = db.query(Dimension).all()
print(f'Total dimensions before cleanup: {len(all_dims)}')

# Track unique dimension names and IDs to keep
seen_names = {}
dims_to_delete = []

for dim in all_dims:
    if dim.name not in seen_names:
        # First occurrence - keep it
        seen_names[dim.name] = dim.id
        print(f'Keeping: {dim.id} - {dim.name}')
    else:
        # Duplicate - mark for deletion
        dims_to_delete.append(dim.id)
        print(f'Will delete: {dim.id} - {dim.name} (duplicate of {seen_names[dim.name]})')

# Delete duplicates
if dims_to_delete:
    print(f'\nDeleting {len(dims_to_delete)} duplicate dimensions...')
    db.query(Dimension).filter(Dimension.id.in_(dims_to_delete)).delete(synchronize_session=False)
    db.commit()
    print('✓ Duplicates removed')
else:
    print('\nNo duplicates found')

# Verify
remaining = db.query(Dimension).all()
print(f'\nTotal dimensions after cleanup: {len(remaining)}')
for dim in remaining:
    print(f'  {dim.id}: {dim.name}')

db.close()
