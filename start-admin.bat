@echo off
echo Starting Mindware India Admin Panel...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "node basic-server.js"
cd ..

echo Starting Frontend Server...
cd frontend
start "Frontend Server" cmd /k "npm start"
cd ..

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin Panel: http://localhost:3000/admin
echo.
echo Login Credentials:
echo Email: admin@mindwareindia.com
echo Password: admin123
echo.
echo Press any key to exit...
pause
