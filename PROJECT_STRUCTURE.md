# Work Connect - Full Stack Project Structure

## Overview
A freelance marketplace platform for South Africa with ZAR currency support.

**Tech Stack:**
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- Auth: JWT tokens stored in localStorage

## Project Structure

```
work-connect-hub/
├── src/                          # Frontend React app
│   ├── pages/                    # Page components
│   │   ├── Index.tsx            # Landing page
│   │   ├── Auth.tsx             # Login/Signup
│   │   ├── Dashboard.tsx        # User dashboard
│   │   └── Map.tsx              # Map features
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Shadcn UI components
│   │   └── map/                 # Map components
│   ├── lib/
│   │   └── api.ts               # API client (replaces Supabase)
│   └── hooks/                   # Custom React hooks
│
├── server/                       # Backend Node.js app
│   ├── index.js                 # Server entry point
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Project.js           # Project model
│   │   └── Proposal.js          # Proposal model
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── profiles.js          # Profile endpoints
│   │   ├── users.js             # User endpoints
│   │   ├── projects.js          # Project endpoints
│   │   └── proposals.js         # Proposal endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   └── README.md
│
├── .env                          # Environment variables
├── package.json                  # Dependencies & scripts
└── README.md
```

## Running the Project

### Development Mode (Both Frontend & Backend)
```bash
npm run dev
```

This runs:
- Frontend on http://localhost:8080 (Vite)
- Backend on http://localhost:5000 (Express)

### Run Separately

**Frontend only:**
```bash
npm run client
```

**Backend only:**
```bash
npm run server
```

## Environment Variables

Your `.env` file should contain:

```env
# Backend
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_ORIGIN=http://localhost:8080

# Frontend
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=...
VITE_MAPBOX_TOKEN=...
VITE_OPENWEATHER_KEY=...
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `GET /api/auth/me` - Get current user

### Profiles
- `GET /api/profiles/:userId` - Get user profile
- `PUT /api/profiles/:userId` - Update profile

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project

### Proposals
- `GET /api/proposals` - List proposals
- `POST /api/proposals` - Submit proposal
- `PUT /api/proposals/:id` - Update proposal

## Database Models

### User
- email, password (hashed), fullName
- roles: ["freelancer", "client"]
- bio, skills, location, hourlyRate, profileImage

### Project
- title, description, clientId
- budgetMin, budgetMax (in ZAR)
- projectType: "fixed" | "hourly"
- status: "open" | "in_progress" | "completed" | "cancelled"
- skills[], deadline, category

### Proposal
- projectId, freelancerId
- coverLetter, bidAmount (in ZAR)
- estimatedDuration
- status: "pending" | "accepted" | "rejected" | "withdrawn"

## Authentication Flow

1. User signs up/logs in → Backend returns JWT token
2. Frontend stores token in localStorage
3. All API requests include: `Authorization: Bearer <token>`
4. Backend middleware validates token on protected routes

## Migration from Supabase

✅ Removed Supabase SDK and integrations
✅ Created new API client (`src/lib/api.ts`)
✅ Updated all pages to use new API
✅ Implemented backend with matching endpoints

See `MIGRATION_NOTES.md` for details.

## Next Steps

1. ✅ Backend API is running
2. ✅ Frontend is connected to backend
3. 🔲 Test signup/login flow
4. 🔲 Implement project creation
5. 🔲 Implement proposal submission
6. 🔲 Add payment integration (PayFast)
7. 🔲 Deploy to production
