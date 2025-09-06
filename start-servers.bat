@echo off
echo Starting Backend Server...
start cmd /k "cd E:\xampp\htdocs\mindwareindia-react\backend && node basic-server.js"
timeout /t 3 > NUL
echo Starting Frontend Server...
start cmd /k "cd E:\xampp\htdocs\mindwareindia-react\frontend && npm start"
echo Both servers are starting. Please wait a moment.
echo.
echo Admin Panel URL: http://localhost:3000/admin
echo Email: admin@mindwareindia.com
echo Password: admin123
echo.
echo Backend API: http://localhost:5000/api/health
echo.
pause
