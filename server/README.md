# Work Connect Backend

Node.js + Express + MongoDB backend for Work Connect platform.

## Setup

1. Make sure MongoDB connection string is in `.env`:
```
MONGO_URI=mongodb+srv://MpenduloGule:Mpesh@cluster0.loelwhi.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
CLIENT_ORIGIN=http://localhost:8080
```

2. Install dependencies (already done at root level)

3. Start the server:
```bash
npm run server
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Profiles
- `GET /api/profiles/:userId` - Get user profile
- `PUT /api/profiles/:userId` - Update user profile

### Users
- `GET /api/users/:userId/roles` - Get user roles

### Projects
- `GET /api/projects` - Get all projects (optional ?userId=xxx)
- `GET /api/projects/:projectId` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:projectId` - Update project

### Proposals
- `GET /api/proposals` - Get all proposals (optional ?userId=xxx)
- `POST /api/proposals` - Create new proposal
- `PUT /api/proposals/:proposalId` - Update proposal

## Models

### User
- email, password, fullName, roles[], bio, skills[], location, hourlyRate, profileImage

### Project
- title, description, clientId, budgetMin, budgetMax, projectType, status, skills[], deadline, category

### Proposal
- projectId, freelancerId, coverLetter, bidAmount, estimatedDuration, status

## Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Token is returned on signup/login and stored in localStorage by frontend.
