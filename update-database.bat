@echo off
echo ========================================
echo Mahindra ^& Mahindra Database Update
echo ========================================
echo.
echo This script will:
echo 1. Delete the existing database
echo 2. Reinitialize the database schema
echo 3. Load unique dimensions from Excel (NO DUPLICATES)
echo 4. Load maturity levels and rating scales
echo 5. Add Asset Connectivity ^& OEE dimension
echo.
pause

cd backend

echo.
echo [1/5] Deleting existing database...
if exist manufacturing.db (
    del manufacturing.db
    echo ✓ Database deleted
) else (
    echo ℹ No existing database found
)

echo.
echo [2/5] Initializing database schema...
python -c "from database import init_db; init_db(); print('✓ Database schema created')"

echo.
echo [3/5] Loading unique dimensions from Excel...
python load_reports_data.py

echo.
echo [4/5] Loading maturity levels and rating scales...
python load_simulated_data.py
python update_rating_scales.py

echo.
echo [5/5] Adding Asset Connectivity ^& OEE dimension...
python add_asset_connectivity_oee.py

echo.
echo ========================================
echo ✅ Database update complete!
echo ========================================
echo.
echo ℹ  Dimensions are now UNIQUE (no duplicates)
echo ℹ  All data loaded from MM_Data.xlsx
echo.
echo You can now start the application with:
echo   - Backend: cd backend ^&^& uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo   - Frontend: cd frontend ^&^& npm run dev
echo.
pause
