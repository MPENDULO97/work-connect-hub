# Work Connect - Freelance Marketplace

A modern freelance marketplace platform connecting clients with skilled freelancers in South Africa. Built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

### 🎯 Core Features
- **Projects**: Post and manage freelance projects (fixed-price or hourly)
- **Proposals**: Freelancers submit proposals with bids and timelines
- **Dual Roles**: Users can be both clients and freelancers
- **Escrow Payments**: Secure payment system with milestone-based releases
- **Real-time Chat**: Direct messaging between clients and freelancers
- **Reviews & Ratings**: Two-way review system after project completion

### 👥 User Roles
- **Freelancers**: Browse projects, submit proposals, track earnings
- **Clients**: Post projects, review proposals, manage hired freelancers
- **Dual Role**: Switch seamlessly between client and freelancer modes

### 🚀 Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT tokens with bcrypt password hashing
- **State**: React Query (TanStack Query)
- **Currency**: South African Rand (ZAR)

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd work-connect-hub
npm install
```

### 2. Configure Environment
Create a `.env` file with:
```env
# Backend
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_ORIGIN=http://localhost:8080

# Frontend
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start Development
```bash
npm run dev
```

This starts:
- Frontend at http://localhost:8080
- Backend at http://localhost:5000

### 4. Create Account
1. Open http://localhost:8080
2. Click "Get Started" or "Sign Up"
3. Fill in your details and select your role (Freelancer, Client, or both)
4. Start using the platform!

## Project Structure

```
work-connect-hub/
├── src/                  # Frontend React app
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── map/         # Map components
│   ├── pages/           # Page components
│   │   ├── Index.tsx    # Landing page
│   │   ├── Auth.tsx     # Login/Signup
│   │   ├── Dashboard.tsx # User dashboard
│   │   └── Map.tsx      # Map view
│   ├── lib/             # Utilities
│   │   ├── api.ts       # API client
│   │   └── utils.ts     # General utilities
│   └── main.tsx         # App entry point
├── server/              # Backend Node.js app
│   ├── index.js         # Server entry point
│   ├── config/          # Configuration
│   │   └── db.js        # MongoDB connection
│   ├── models/          # Mongoose models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Proposal.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── proposals.js
│   └── middleware/      # Express middleware
│       └── auth.js      # JWT authentication
└── package.json
```

See `PROJECT_STRUCTURE.md` for detailed documentation.

## Database Schema (MongoDB)

### Collections
- **users**: User accounts with authentication (email, password, fullName, roles[])
- **projects**: Freelance projects with budgets and requirements
- **proposals**: Freelancer proposals for projects
- **milestones**: Project milestones for fixed-price projects (coming soon)
- **time_entries**: Time tracking for hourly projects (coming soon)
- **messages**: Real-time chat between clients and freelancers (coming soon)
- **transactions**: Payment and escrow transactions (coming soon)
- **reviews**: Ratings and reviews after project completion (coming soon)

## Security Features

- JWT-based authentication with secure token storage
- Bcrypt password hashing
- Role-based access control (freelancer, client)
- Input validation with Zod schema validation
- Protected API routes with authentication middleware
- CORS configuration for secure cross-origin requests

## Environment Variables

Required variables in `.env`:

**Backend:**
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLIENT_ORIGIN` - Frontend URL for CORS

**Frontend:**
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_MAPBOX_TOKEN` - Mapbox token
- `VITE_OPENWEATHER_KEY` - OpenWeather API key

## Scripts

```bash
npm run dev        # Start both frontend and backend
npm run client     # Start frontend only (Vite)
npm run server     # Start backend only (Express)
npm run build      # Build frontend for production
npm run preview    # Preview production build
```

## Key Features Implementation

### Authentication
- Email/password authentication with JWT tokens
- Secure password hashing with bcrypt
- Token storage in localStorage
- Protected routes requiring authentication
- 7-day token expiration

### Projects & Proposals
- Clients create projects (fixed-price or hourly)
- Freelancers browse and submit proposals
- Milestone-based payments for fixed-price projects
- Time tracking for hourly projects

### Payments (Escrow)
- Clients fund project escrow before work begins
- Milestone-based releases for fixed-price work
- Hourly payment approvals by clients
- All transactions in South African Rands (ZAR)

### Communication (Coming Soon)
- Real-time chat using Socket.IO
- File sharing in messages
- Notifications for new messages and proposals

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT License - feel free to use for personal or commercial projects

## Roadmap

- [x] User authentication and profiles
- [x] Project posting and browsing
- [x] Proposal system
- [x] MongoDB backend migration
- [x] JWT authentication
- [ ] Real-time messaging (Socket.IO)
- [ ] Payment integration (PayFast for South Africa)
- [ ] Email notifications
- [ ] File uploads for project attachments
- [ ] Advanced search and filters
- [ ] Portfolio showcase for freelancers
- [ ] Contract management
- [ ] Dispute resolution system
- [ ] Milestone tracking
- [ ] Time tracking for hourly projects

## Documentation

- `PROJECT_STRUCTURE.md` - Detailed project structure
- `MIGRATION_NOTES.md` - Supabase to MongoDB migration details
- `TEST_API.md` - API testing guide
- `server/README.md` - Backend documentation

---

Built for South Africa 🇿🇦 with React, TypeScript, Node.js, Express, and MongoDB
