# Supabase to MongoDB Migration - Frontend Changes

## What Was Done

### 1. Removed Supabase
- Uninstalled `@supabase/supabase-js` package
- Deleted `src/integrations/supabase/` folder
- Removed Supabase environment variables from `.env`

### 2. Created API Utility (`src/lib/api.ts`)
A new centralized API utility that handles all backend communication:

**Features:**
- JWT token management (stored in localStorage)
- Authenticated requests with Bearer token
- API endpoints for:
  - Authentication (signup, login, logout, session)
  - User profiles
  - User roles
  - Projects
  - Proposals

### 3. Updated Pages
All pages now use the new API utility instead of Supabase:

- **Auth.tsx**: Uses `authAPI` for signup/login
- **Dashboard.tsx**: Uses `authAPI`, `profileAPI`, `rolesAPI`, `projectsAPI`, `proposalsAPI`
- **Index.tsx**: Uses `authAPI` for session checking

## Backend Requirements

Your Node.js backend needs to implement these API endpoints:

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user (returns JWT token)
- `GET /api/auth/me` - Get current user info (requires auth)

### Profiles
- `GET /api/profiles/:userId` - Get user profile
- `PUT /api/profiles/:userId` - Update user profile

### Roles
- `GET /api/users/:userId/roles` - Get user roles

### Projects
- `GET /api/projects` - Get all projects (optional userId query param)
- `GET /api/projects/:projectId` - Get single project
- `POST /api/projects` - Create new project

### Proposals
- `GET /api/proposals` - Get all proposals (optional userId query param)
- `POST /api/proposals` - Create new proposal

## Environment Variables

Make sure your `.env` has:
```
VITE_API_BASE_URL="http://localhost:5000"
```

## Authentication Flow

1. User logs in → Backend returns JWT token
2. Token stored in localStorage as 'authToken'
3. All subsequent requests include: `Authorization: Bearer <token>`
4. On logout, token is removed from localStorage

## Next Steps

1. Implement the backend API endpoints listed above
2. Ensure your backend validates JWT tokens on protected routes
3. Test the authentication flow
4. Update any additional pages/components that need API calls
