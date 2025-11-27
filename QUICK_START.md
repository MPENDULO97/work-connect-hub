# 🚀 Quick Start Guide - Work Connect

Get your Work Connect platform running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed (local) OR MongoDB Atlas account (cloud)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup MongoDB

### Option A: Local MongoDB (Easiest for Development)

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install and run as a service
3. MongoDB will run on `mongodb://localhost:27017`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (for development)
6. Get connection string

## Step 3: Configure Environment

Your `.env` file is already set up. Just update if needed:

```env
# For Local MongoDB (default)
MONGO_URI="mongodb://localhost:27017/workconnect"

# OR for MongoDB Atlas
# MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/workconnect"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server Config
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN="http://localhost:5173"

# Frontend API URL
VITE_API_BASE_URL="http://localhost:5000"
```

## Step 4: Start the Application

```bash
npm run dev
```

This starts:
- ✅ Backend API on http://localhost:5000
- ✅ Frontend on http://localhost:5173

## Step 5: Create Your Account

1. Open http://localhost:5173 in your browser
2. Click "Sign Up"
3. Fill in:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Select role: Freelancer, Client, or both
4. Click "Create Account"

## Step 6: Explore Features

### Post a Job
1. Navigate to "Jobs" in the menu
2. Click "Post Job"
3. Fill in job details:
   - Title (e.g., "Fix leaking tap")
   - Category (e.g., "Plumbing")
   - Location (e.g., "Johannesburg")
   - Price (e.g., 350)
   - Description
4. Click "Post Job"

### Browse Jobs
- Filter by 26+ categories
- Search by keywords
- View job details

### Projects (Coming Soon)
- Post long-term projects
- Submit proposals
- Track milestones

## Verify Installation

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Expected: {"status":"ok","message":"Server is running"}
```

### Test Database Connection
Check your terminal for:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

## Common Issues

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Or verify your MONGO_URI in .env
```

### CORS Errors
- Ensure `CLIENT_ORIGIN` in .env matches your frontend URL
- Default: `http://localhost:5173`

## Available Scripts

```bash
npm run dev        # Start both frontend & backend
npm run client     # Start frontend only
npm run server     # Start backend only
npm run build      # Build for production
```

## API Endpoints

### Authentication
```
POST /api/auth/signup    # Create account
POST /api/auth/login     # Login
POST /api/auth/logout    # Logout
GET  /api/auth/session   # Get current user
```

### Jobs
```
GET    /api/jobs              # List all jobs
GET    /api/jobs?category=X   # Filter by category
GET    /api/jobs?q=search     # Search jobs
POST   /api/jobs              # Create job (requires auth)
PUT    /api/jobs/:id          # Update job (requires auth)
DELETE /api/jobs/:id          # Delete job (requires auth)
```

### Projects
```
GET    /api/projects          # List projects
POST   /api/projects          # Create project (requires auth)
PUT    /api/projects/:id      # Update project (requires auth)
DELETE /api/projects/:id      # Delete project (requires auth)
```

### Proposals
```
GET  /api/proposals           # List proposals (requires auth)
POST /api/proposals           # Create proposal (requires auth)
PUT  /api/proposals/:id       # Update proposal (requires auth)
```

## Testing with Postman

1. Import `postman_collection.json`
2. Run "Sign Up" or "Login" request
3. Token auto-saves for authenticated requests
4. Test all endpoints

## Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User",
    "roles": ["client"]
  }'

# List jobs
curl http://localhost:5000/api/jobs

# Create job (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Fix leaking tap",
    "description": "Kitchen tap needs repair",
    "category": "Plumbing",
    "location": "Johannesburg",
    "price": 350
  }'
```

## Job Categories (26+)

- Cleaning, Gardening, Plumbing, Electrical
- Delivery, Laundry, Ironing, Cooking
- Babysitting, Pet Care, Tutoring
- Handyman, Carpentry, Painting
- Car Wash, Grocery Shopping, House Sitting
- Appliance Repair, Locksmith, Pest Control
- Window Cleaning, Gutter Cleaning, Furniture Assembly
- Moving, Errands, and more!

## Next Steps

1. ✅ Create your account
2. ✅ Post your first job
3. ✅ Browse available jobs
4. ✅ Explore the dashboard
5. ✅ Test the API with Postman

## Need Help?

- **README.md** - Complete documentation
- **MONGODB_SETUP.md** - Detailed MongoDB setup
- **API_TESTING_GUIDE.md** - API examples
- **MIGRATION_COMPLETE.md** - Migration details

## Production Deployment

### Backend (Render, Railway, Heroku)
1. Push code to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel, Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set `VITE_API_BASE_URL` to production API URL

### Database (MongoDB Atlas)
1. Use MongoDB Atlas for production
2. Update `MONGO_URI` in production environment
3. Whitelist production server IPs

---

🎉 **You're all set!** Start building your freelance platform.

**Questions?** Check the documentation files or open an issue on GitHub.
