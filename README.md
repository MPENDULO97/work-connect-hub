# Work Connect - Freelance & Jobs Platform

A full-stack platform connecting freelancers with clients for both long-term projects and daily jobs. Built with React, TypeScript, Express, and MongoDB.

## Features

### 🎯 Dual System
- **Projects**: Long-term freelance work with proposals, milestones, and escrow
- **Jobs**: Quick daily tasks (Plumbing, Cleaning, Gardening, Delivery, etc.)

### 👥 User Roles
- **Freelancers**: Browse projects, submit proposals, find daily jobs
- **Clients**: Post projects, hire freelancers, post job listings
- **Dual Role**: Users can be both freelancer and client

### 💼 Jobs Feature (26+ Categories)
- Cleaning, Gardening, Plumbing, Electrical
- Delivery, Laundry, Ironing, Cooking
- Babysitting, Pet Care, Tutoring
- Handyman, Carpentry, Painting
- And many more daily services

### 🚀 Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT with httpOnly cookies
- **State**: React Query (TanStack Query)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd work-connect-hub
npm install
```

### 2. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Server
# Windows: Download from mongodb.com
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

#### Option B: MongoDB Atlas (Cloud - Free)
1. Create account at mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string

### 3. Configure Environment
Edit `.env` file:
```env
# MongoDB
MONGO_URI="mongodb://localhost:27017/workconnect"
# Or Atlas: mongodb+srv://user:pass@cluster.mongodb.net/workconnect

# JWT Secret (change this!)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN="http://localhost:5173"

# Frontend
VITE_API_BASE_URL="http://localhost:5000"
```

### 4. Start Development
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

### 5. Create Account
1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill in details and select role(s)
4. Start using the platform!

## Project Structure

```
work-connect-hub/
├── server/                 # Backend (Express + MongoDB)
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Project.js
│   │   └── Proposal.js
│   ├── controllers/       # Route controllers
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── index.js          # Server entry
├── src/                   # Frontend (React + TypeScript)
│   ├── components/       # UI components
│   ├── pages/           # Page components
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   └── Jobs.tsx
│   ├── lib/             # Utilities
│   │   ├── api.ts       # API client
│   │   └── auth.ts      # Auth service
│   └── main.tsx         # App entry
├── .env                  # Environment variables
└── package.json
```

## API Documentation

### Authentication
```bash
POST /api/auth/signup    # Create account
POST /api/auth/login     # Login
POST /api/auth/logout    # Logout
GET  /api/auth/session   # Get current user
```

### Jobs
```bash
GET    /api/jobs              # List all jobs
GET    /api/jobs?category=X   # Filter by category
GET    /api/jobs?q=search     # Search jobs
GET    /api/jobs/:id          # Get job details
POST   /api/jobs              # Create job (auth)
PUT    /api/jobs/:id          # Update job (auth)
DELETE /api/jobs/:id          # Delete job (auth)
```

### Projects
```bash
GET    /api/projects           # List projects
GET    /api/projects?status=X  # Filter by status
GET    /api/projects/:id       # Get project
POST   /api/projects           # Create project (auth)
PUT    /api/projects/:id       # Update project (auth)
DELETE /api/projects/:id       # Delete project (auth)
```

### Proposals
```bash
GET  /api/proposals                    # List proposals (auth)
GET  /api/proposals?projectId=X        # Filter by project
POST /api/proposals                    # Create proposal (auth)
PUT  /api/proposals/:id                # Update proposal (auth)
```

## Testing the API

### Using Postman
1. Import `postman_collection.json`
2. Run "Sign Up" or "Login"
3. Token auto-saves for authenticated requests
4. Test all endpoints

### Using cURL
See `API_TESTING_GUIDE.md` for complete examples.

Quick test:
```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User","roles":["client"]}'

# List jobs
curl http://localhost:5000/api/jobs
```

## Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  fullName: String,
  roles: ['freelancer', 'client', 'admin'],
  profile: {
    bio, avatarUrl, hourlyRate, location, skills, portfolioUrl
  }
}
```

### Jobs Collection
```javascript
{
  title: String,
  description: String,
  category: Enum (26 categories),
  location: String,
  price: Number,
  currency: String,
  poster: ObjectId (ref: User),
  active: Boolean
}
```

### Projects Collection
```javascript
{
  clientId: ObjectId (ref: User),
  freelancerId: ObjectId (ref: User),
  title: String,
  description: String,
  projectType: 'fixed' | 'hourly',
  budgetMin, budgetMax, hourlyRate: Number,
  skillsRequired: [String],
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
}
```

### Proposals Collection
```javascript
{
  projectId: ObjectId (ref: Project),
  freelancerId: ObjectId (ref: User),
  coverLetter: String,
  bidAmount: Number,
  estimatedDuration: String,
  status: 'pending' | 'accepted' | 'rejected'
}
```

## Scripts

```bash
npm run dev        # Start both frontend & backend
npm run client     # Start frontend only
npm run server     # Start backend only
npm run build      # Build for production
npm run preview    # Preview production build
```

## Environment Variables

### Backend (.env)
```env
MONGO_URI          # MongoDB connection string
JWT_SECRET         # JWT signing secret
PORT               # Server port (default: 5000)
NODE_ENV           # development | production
CLIENT_ORIGIN      # Frontend URL for CORS
```

### Frontend (.env)
```env
VITE_API_BASE_URL  # Backend API URL
```

## Deployment

### Backend (Render, Railway, Heroku)
1. Set environment variables
2. Ensure MongoDB Atlas connection
3. Deploy from GitHub

### Frontend (Vercel, Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set `VITE_API_BASE_URL` to production API

## Security

- Passwords hashed with bcrypt
- JWT tokens with httpOnly cookies
- CORS configured for specific origins
- Input validation on all endpoints
- MongoDB injection protection via Mongoose

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# Or verify Atlas connection string in .env
```

### CORS Errors
- Ensure `CLIENT_ORIGIN` in .env matches frontend URL
- Check browser console for specific error

### Token Issues
- Tokens expire after 7 days
- Clear cookies and login again
- Check Authorization header format

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT License - feel free to use for personal or commercial projects

## Support

- Documentation: See `MONGODB_SETUP.md` and `API_TESTING_GUIDE.md`
- Issues: Open GitHub issue
- Questions: Contact support

## Roadmap

- [ ] Real-time messaging between users
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] File uploads for job attachments
- [ ] Rating and review system
- [ ] Advanced search and filters
- [ ] Mobile app (React Native)

---

Built with ❤️ using React, TypeScript, Express, and MongoDB
