@echo off
echo ========================================
echo Updating Database for Dimension-Specific Checksheet
echo ========================================
echo.

cd backend

echo Step 1: Deleting old database...
if exist manufacturing.db (
    del manufacturing.db
    echo ✓ Old database deleted
) else (
    echo ! No existing database found
)
echo.

echo Step 2: Creating new database schema...
..\venv\Scripts\python.exe -c "from database import init_db; init_db(); print('✓ Database initialized')"
echo.

echo Step 3: Loading seed data (areas and dimensions)...
..\..venv\Scripts\python.exe seed_data.py
echo.

echo Step 4: Loading dimension-specific checksheet data...
..\.venv\Scripts\python.exe load_dimension_checksheet_data.py
echo.

echo Step 5: Loading rating scales...
..\.venv\Scripts\python.exe update_rating_scales.py
echo.

echo ========================================
echo Database Update Complete!
echo ========================================
echo.
pause
