@echo off
echo Starting QuizKnow App4...
echo.

:: Check if MongoDB is running
echo Checking MongoDB connection...
netstat -an | findstr :27017 >nul
if %errorlevel% neq 0 (
    echo WARNING: MongoDB might not be running on port 27017
    echo Please start MongoDB service first
    pause
)

:: Start backend server
echo Starting backend server on port 5000 (using mongodb-memory-server)...
start cmd /k "cd /d %~dp0 && npm install && node server-test.js"

:: Wait for backend to start
timeout /t 5 /nobreak >nul

:: Start frontend
echo Starting frontend on port 3000...
start cmd /k "cd /d %~dp0\client && npm install && npm start"

echo.
echo ========================================
echo QuizKnow App4 is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to open the application in browser...
pause >nul

:: Open browser
start http://localhost:3000

echo Application opened in browser!
pause
