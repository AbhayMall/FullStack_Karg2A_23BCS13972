# Environment Setup Script for Gamified Learning Tracker
# Run this script to set up your environment variables

Write-Host "🚀 Setting up Gamified Learning Tracker Environment..." -ForegroundColor Green

# Set environment variables for current session
$env:MONGODB_URI = "mongodb://localhost:27017/gamified_learning"
$env:JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production"
$env:SPRING_PROFILES_ACTIVE = "dev"

Write-Host "✅ Environment variables set for current session:" -ForegroundColor Green
Write-Host "   MONGODB_URI: $env:MONGODB_URI" -ForegroundColor Yellow
Write-Host "   JWT_SECRET: [HIDDEN]" -ForegroundColor Yellow
Write-Host "   SPRING_PROFILES_ACTIVE: $env:SPRING_PROFILES_ACTIVE" -ForegroundColor Yellow

Write-Host ""
Write-Host "📝 To make these permanent, add them to your system environment variables:" -ForegroundColor Cyan
Write-Host "   1. Open System Properties > Advanced > Environment Variables" -ForegroundColor White
Write-Host "   2. Add the variables listed above" -ForegroundColor White
Write-Host ""
Write-Host "🔗 If using MongoDB Atlas, replace MONGODB_URI with your Atlas connection string" -ForegroundColor Cyan

Write-Host ""
Write-Host "✨ Ready to start the application!" -ForegroundColor Green