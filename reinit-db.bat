@echo off
echo ========================================
echo Database Reinitialization Script
echo ========================================
echo.
echo WARNING: This will delete the existing database and create a fresh one!
echo.
pause

cd backend

echo.
echo [1/3] Deleting old database...
if exist manufacturing.db (
    del manufacturing.db
    echo ✓ Old database deleted
) else (
    echo No existing database found
)

echo.
echo [2/3] Creating new database with updated schema...
python -c "from database import init_db; init_db(); print('✓ Database initialized with new schema')"

echo.
echo [3/3] Loading initial data...
python seed_data.py

echo.
echo ========================================
echo Database reinitialization complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start the backend server: cd backend ^&^& uvicorn main:app --reload
echo 2. Use the "Refresh" buttons in the UI to load data from Excel
echo.
pause
