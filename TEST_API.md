# API Testing Guide

Quick guide to test your Work Connect API endpoints.

## Prerequisites

Make sure the backend is running:
```bash
npm run server
```

## Test Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/
```

Expected: `{"message":"Work Connect API is running"}`

### 2. Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"fullName\":\"Test User\",\"roles\":[\"freelancer\",\"client\"]}"
```

Expected: Returns token and user object

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Expected: Returns token and user object

### 4. Get Current User (Protected)
```bash
# Replace YOUR_TOKEN with the token from login/signup
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Returns user object without password

### 5. Create Project (Protected)
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"Build a Website\",\"description\":\"Need a modern website\",\"budgetMin\":5000,\"budgetMax\":10000,\"projectType\":\"fixed\",\"skills\":[\"React\",\"Node.js\"]}"
```

Expected: Returns created project

### 6. Get All Projects (Protected)
```bash
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Returns array of projects

## Using PowerShell (Windows)

For PowerShell, use `Invoke-RestMethod`:

### Sign Up
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
    fullName = "Test User"
    roles = @("freelancer", "client")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
```

### Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.token
```

### Get Current User
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers $headers
```

## Testing with Frontend

1. Start both frontend and backend:
```bash
npm run dev
```

2. Open http://localhost:8080

3. Try signing up with a new account

4. Check the browser console for API requests

5. Verify you're redirected to dashboard after login

## Common Issues

**CORS Error**: Make sure `CLIENT_ORIGIN` in `.env` matches your frontend URL

**MongoDB Connection Error**: Verify `MONGO_URI` in `.env` is correct

**Token Invalid**: Token expires after 7 days, login again to get a new one

**Port Already in Use**: Change `PORT` in `.env` or kill the process using that port
