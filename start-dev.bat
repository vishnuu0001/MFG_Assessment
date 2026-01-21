@echo off
cd /d "%~dp0"
set "PATH=%~dp0node_modules\.bin;%PATH%"
node "%~dp0node_modules\react-scripts\bin\react-scripts.js" start
