@echo off
echo Cleaning up old dev servers...

REM Kill any existing Node processes on ports 5173-5175
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5173') DO taskkill /F /PID %%P 2>nul
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5174') DO taskkill /F /PID %%P 2>nul
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5175') DO taskkill /F /PID %%P 2>nul

echo Cleaning Vite cache...
rmdir /s /q node_modules\.vite 2>nul

echo Starting fresh dev server...
npm run dev
