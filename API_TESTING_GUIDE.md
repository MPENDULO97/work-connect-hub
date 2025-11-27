# Work Connect API Testing Guide

## Quick Start

### 1. Import Postman Collection
Import `postman_collection.json` into Postman to get all API endpoints ready to test.

### 2. Start the Server
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173).

## cURL Examples

### Authentication

#### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "roles": ["client", "freelancer"]
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save the token from response for authenticated requests**

#### Get Session
```bash
curl -X GET http://localhost:5000/api/auth/session \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -b cookies.txt
```

#### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -b cookies.txt
```

---

## Jobs API

### Get All Jobs
```bash
curl -X GET http://localhost:5000/api/jobs
```

### Filter Jobs by Category
```bash
curl -X GET "http://localhost:5000/api/jobs?category=Plumbing"
```

### Search Jobs
```bash
curl -X GET "http://localhost:5000/api/jobs?q=garden"
```

### Get Job by ID
```bash
curl -X GET http://localhost:5000/api/jobs/JOB_ID_HERE
```

### Create Job - Plumbing
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Fix leaking kitchen tap",
    "description": "Kitchen tap is leaking and needs urgent repair",
    "category": "Plumbing",
    "location": "Johannesburg, Sandton",
    "price": 350,
    "currency": "ZAR"
  }'
```

### Create Job - Gardening
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Lawn mowing - 2 hours",
    "description": "Need someone to mow lawn and trim hedges",
    "category": "Gardening",
    "location": "Pretoria",
    "price": 200,
    "currency": "ZAR"
  }'
```

### Create Job - Cleaning
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "House cleaning - 3 bedroom apartment",
    "description": "Deep cleaning needed for 3 bedroom apartment",
    "category": "Cleaning",
    "location": "Cape Town",
    "price": 500,
    "currency": "ZAR"
  }'
```

### Create Job - Delivery
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Grocery delivery from Checkers",
    "description": "Pick up groceries and deliver to my address",
    "category": "Delivery",
    "location": "Durban",
    "price": 100,
    "currency": "ZAR"
  }'
```

### Update Job
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "price": 400,
    "description": "Updated description"
  }'
```

### Delete Job (Deactivate)
```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Projects API

### Get All Projects
```bash
curl -X GET http://localhost:5000/api/projects
```

### Filter Projects by Status
```bash
curl -X GET "http://localhost:5000/api/projects?status=open"
```

### Get Project by ID
```bash
curl -X GET http://localhost:5000/api/projects/PROJECT_ID_HERE
```

### Create Project - Fixed Price
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Build E-commerce Website",
    "description": "Need full-stack developer for e-commerce site",
    "projectType": "fixed",
    "budgetMin": 10000,
    "budgetMax": 15000,
    "skillsRequired": ["React", "Node.js", "MongoDB"],
    "status": "open",
    "deadline": "2025-03-01T00:00:00.000Z"
  }'
```

### Create Project - Hourly
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Mobile App Development",
    "description": "React Native developer needed",
    "projectType": "hourly",
    "hourlyRate": 500,
    "skillsRequired": ["React Native", "TypeScript"],
    "status": "open"
  }'
```

### Update Project
```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "in_progress",
    "budgetMax": 18000
  }'
```

### Delete Project
```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Proposals API

### Get All Proposals
```bash
curl -X GET http://localhost:5000/api/proposals \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Proposals by Project
```bash
curl -X GET "http://localhost:5000/api/proposals?projectId=PROJECT_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Proposal
```bash
curl -X POST http://localhost:5000/api/proposals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "projectId": "PROJECT_ID_HERE",
    "coverLetter": "I am experienced in React and Node.js...",
    "bidAmount": 12000,
    "estimatedDuration": "6 weeks"
  }'
```

### Update Proposal
```bash
curl -X PUT http://localhost:5000/api/proposals/PROPOSAL_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "bidAmount": 11000,
    "estimatedDuration": "5 weeks"
  }'
```

---

## Testing Workflow

### 1. Sign Up & Login
```bash
# Sign up
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User","roles":["client"]}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### 2. Create Multiple Jobs
```bash
# Plumbing job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Fix pipe","description":"Leaking pipe","category":"Plumbing","location":"JHB","price":300}'

# Gardening job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Mow lawn","description":"Weekly lawn service","category":"Gardening","location":"PTA","price":150}'
```

### 3. List All Jobs
```bash
curl -X GET http://localhost:5000/api/jobs | json_pp
```

---

## Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Troubleshooting

### MongoDB Not Connected
Ensure MongoDB is running:
```bash
# Local MongoDB
mongod

# Or check if MongoDB Atlas connection string is correct in .env
```

### Token Issues
- Token expires after 7 days
- Get a new token by logging in again
- Check Authorization header format: `Bearer YOUR_TOKEN`

### CORS Errors
- Ensure CLIENT_ORIGIN in .env matches your frontend URL
- Default: http://localhost:5173
