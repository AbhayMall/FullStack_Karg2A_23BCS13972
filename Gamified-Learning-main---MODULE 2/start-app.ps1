# Complete Startup Script for Gamified Learning Tracker
# This script will start both backend and frontend servers

param(
    [switch]$SetupOnly,
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

Write-Host "🎯 Gamified Learning Tracker Startup Script" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Cyan

$javaExists = Test-CommandExists "java"
$mvnExists = Test-CommandExists "mvn"
$nodeExists = Test-CommandExists "node"
$npmExists = Test-CommandExists "npm"

Write-Host "   Java: $(if ($javaExists) { '✅ Installed' } else { '❌ Missing' })" -ForegroundColor $(if ($javaExists) { 'Green' } else { 'Red' })
Write-Host "   Maven: $(if ($mvnExists) { '✅ Installed' } else { '❌ Missing' })" -ForegroundColor $(if ($mvnExists) { 'Green' } else { 'Red' })
Write-Host "   Node.js: $(if ($nodeExists) { '✅ Installed' } else { '❌ Missing' })" -ForegroundColor $(if ($nodeExists) { 'Green' } else { 'Red' })
Write-Host "   npm: $(if ($npmExists) { '✅ Installed' } else { '❌ Missing' })" -ForegroundColor $(if ($npmExists) { 'Green' } else { 'Red' })

if (-not $javaExists -or -not $mvnExists -or -not $nodeExists -or -not $npmExists) {
    Write-Host ""
    Write-Host "❌ Missing prerequisites! Please install:" -ForegroundColor Red
    if (-not $javaExists) { Write-Host "   - Java 17+: winget install Microsoft.OpenJDK.17" -ForegroundColor Yellow }
    if (-not $mvnExists) { Write-Host "   - Maven: winget install Apache.Maven" -ForegroundColor Yellow }
    if (-not $nodeExists) { Write-Host "   - Node.js: winget install OpenJS.NodeJS" -ForegroundColor Yellow }
    Write-Host ""
    Write-Host "After installation, restart your terminal and run this script again." -ForegroundColor Cyan
    exit 1
}

# Setup environment
Write-Host ""
Write-Host "🔧 Setting up environment..." -ForegroundColor Cyan
if (-not $env:MONGODB_URI) { $env:MONGODB_URI = "mongodb://localhost:27017/gamified_learning" }
if (-not $env:JWT_SECRET) { $env:JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production" }
if (-not $env:SPRING_PROFILES_ACTIVE) { $env:SPRING_PROFILES_ACTIVE = "dev" }

Write-Host "   ✅ Environment variables configured" -ForegroundColor Green

if ($SetupOnly) {
    Write-Host ""
    Write-Host "🎯 Setup complete! Environment is ready." -ForegroundColor Green
    Write-Host "Run './start-app.ps1' to start the application." -ForegroundColor Cyan
    exit 0
}

# Install frontend dependencies
if (-not $BackendOnly) {
    Write-Host ""
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
    Push-Location frontend
    try {
        npm install
        Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green
    }
    catch {
        Write-Host "   ❌ Failed to install frontend dependencies" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

# Build backend (optional - will happen automatically on first run)
if (-not $FrontendOnly) {
    Write-Host ""
    Write-Host "🔨 Preparing backend..." -ForegroundColor Cyan
    Push-Location backend
    try {
        mvn clean compile -q
        Write-Host "   ✅ Backend compiled successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "   ⚠️  Backend compilation had issues (will try to run anyway)" -ForegroundColor Yellow
    }
    Pop-Location
}

# Start the applications
Write-Host ""
Write-Host "🚀 Starting applications..." -ForegroundColor Green
Write-Host ""

if ($BackendOnly) {
    Write-Host "🖥️  Starting backend server on http://localhost:8080" -ForegroundColor Cyan
    Set-Location backend
    mvn spring-boot:run
}
elseif ($FrontendOnly) {
    Write-Host "🌐 Starting frontend server on http://localhost:3000" -ForegroundColor Cyan
    Set-Location frontend
    npm start
}
else {
    Write-Host "🖥️  Backend will start on: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "🌐 Frontend will start on: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Starting both servers..." -ForegroundColor Yellow
    Write-Host "   - Backend starting first (this may take 30-60 seconds)" -ForegroundColor White
    Write-Host "   - Frontend will start automatically after backend is ready" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 To stop both servers: Press Ctrl+C in both terminal windows" -ForegroundColor Yellow
    Write-Host ""
    
    # Start backend in new window
    Write-Host "Opening backend server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🖥️ Starting Backend Server...' -ForegroundColor Green; mvn spring-boot:run"
    
    # Wait a moment, then start frontend
    Write-Host "Waiting 10 seconds before starting frontend..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host "Opening frontend server..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🌐 Starting Frontend Server...' -ForegroundColor Green; npm start"
    
    Write-Host ""
    Write-Host "✨ Both servers are starting in separate windows!" -ForegroundColor Green
    Write-Host "🌐 Open http://localhost:3000 in your browser once both servers are ready" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 Startup complete! Happy learning! 🎯" -ForegroundColor Magenta