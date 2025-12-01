# Quick test script for Work Connect API
Write-Host "Testing Work Connect API..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Testing health check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
    Write-Host "✓ Health check passed: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Signup
Write-Host "`n2. Testing user signup..." -ForegroundColor Yellow
$signupBody = @{
    email = "testuser_$(Get-Random)@example.com"
    password = "password123"
    fullName = "Test User"
    roles = @("freelancer", "client")
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $signupBody -ContentType "application/json"
    Write-Host "✓ Signup successful!" -ForegroundColor Green
    Write-Host "  User ID: $($signupResponse.user.id)" -ForegroundColor Gray
    Write-Host "  Email: $($signupResponse.user.email)" -ForegroundColor Gray
    Write-Host "  Token received: $($signupResponse.token.Substring(0, 20))..." -ForegroundColor Gray
    
    $token = $signupResponse.token
    $userId = $signupResponse.user.id
} catch {
    Write-Host "✗ Signup failed: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Get Current User
Write-Host "`n3. Testing authenticated request..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $currentUser = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers $headers -Method Get
    Write-Host "✓ Authenticated request successful!" -ForegroundColor Green
    Write-Host "  Full Name: $($currentUser.fullName)" -ForegroundColor Gray
    Write-Host "  Roles: $($currentUser.roles -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "✗ Authenticated request failed: $_" -ForegroundColor Red
    exit 1
}

# Test 4: Create Project
Write-Host "`n4. Testing project creation..." -ForegroundColor Yellow
$projectBody = @{
    title = "Build a Test Website"
    description = "This is a test project"
    budgetMin = 5000
    budgetMax = 10000
    projectType = "fixed"
    skills = @("React", "Node.js")
} | ConvertTo-Json

try {
    $project = Invoke-RestMethod -Uri "http://localhost:5000/api/projects" -Headers $headers -Method Post -Body $projectBody -ContentType "application/json"
    Write-Host "✓ Project created successfully!" -ForegroundColor Green
    Write-Host "  Project ID: $($project._id)" -ForegroundColor Gray
    Write-Host "  Title: $($project.title)" -ForegroundColor Gray
    Write-Host "  Budget: R$($project.budgetMin) - R$($project.budgetMax)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Project creation failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ All tests passed! Your API is working correctly." -ForegroundColor Green
Write-Host "`nYou can now:" -ForegroundColor Cyan
Write-Host "  1. Start the frontend: npm run client" -ForegroundColor White
Write-Host "  2. Open http://localhost:8080" -ForegroundColor White
Write-Host "  3. Sign up and start using the platform" -ForegroundColor White
