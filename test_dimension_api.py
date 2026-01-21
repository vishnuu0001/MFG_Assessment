import requests

print("Testing dimension-filtered maturity levels API...")
print("=" * 50)

# Test 1: Get all maturity levels
r1 = requests.get("http://localhost:8000/api/mm/maturity-levels")
print(f"\n1. All maturity levels: Status {r1.status_code}, Count: {len(r1.json())}")

# Test 2: Get maturity levels for dimension 1 (Asset connectivity & OEE)
r2 = requests.get("http://localhost:8000/api/mm/maturity-levels?dimension_id=1")
data2 = r2.json()
print(f"\n2. Dimension 1 (Asset connectivity & OEE): Status {r2.status_code}, Count: {len(data2)}")
if data2:
    print(f"   First 3 items: {[item['sub_level'] for item in data2[:3]]}")

# Test 3: Get maturity levels for dimension 2 (MES & system integration)
r3 = requests.get("http://localhost:8000/api/mm/maturity-levels?dimension_id=2")
data3 = r3.json()
print(f"\n3. Dimension 2 (MES & system integration): Status {r3.status_code}, Count: {len(data3)}")
if data3:
    print(f"   First 3 items: {[item['sub_level'] for item in data3[:3]]}")

# Test 4: Get dimensions
r4 = requests.get("http://localhost:8000/api/mm/dimensions")
dims = r4.json()
print(f"\n4. Dimensions: Status {r4.status_code}, Count: {len(dims)}")
for dim in dims:
    print(f"   {dim['id']}: {dim['name']}")

print("\n" + "=" * 50)
print("✓ All tests completed!")
