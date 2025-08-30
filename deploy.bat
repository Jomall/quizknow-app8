@echo off
echo 🚀 Starting QuizKnow deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo 📦 Building and starting containers...
docker-compose up -d --build

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if the application is running
curl -f http://localhost:5000/api/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ Deployment successful! QuizKnow is running at http://localhost:5000
    echo 📊 MongoDB is running at localhost:27017
) else (
    echo ❌ Deployment failed. Check the logs with: docker-compose logs
    pause
    exit /b 1
)

echo 🎉 Deployment complete!
pause
