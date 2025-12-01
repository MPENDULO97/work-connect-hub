# Work Connect - Freelance Marketplace

A modern freelance marketplace platform connecting clients with skilled freelancers in South Africa. Built with React, TypeScript, and Supabase.

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
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime, Edge Functions)
- **Auth**: Supabase Auth with email/password
- **State**: React Query (TanStack Query)

## Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd work-connect-hub
npm install
```

### 2. Start Development
```bash
npm run dev
```

This starts the frontend at http://localhost:5173

### 3. Create Account
1. Open http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Fill in your details and select your role (Freelancer, Client, or both)
4. Start using the platform!

## Project Structure

```
work-connect-hub/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── map/         # Map components
│   ├── pages/           # Page components
│   │   ├── Index.tsx    # Landing page
│   │   ├── Auth.tsx     # Login/Signup
│   │   ├── Dashboard.tsx # User dashboard
│   │   └── Map.tsx      # Map view
│   ├── lib/             # Utilities
│   │   ├── format.ts    # Formatting helpers (ZAR currency, dates)
│   │   ├── utils.ts     # General utilities
│   │   └── supabase.ts  # Supabase client
│   ├── integrations/    # Third-party integrations
│   │   └── supabase/    # Supabase types & client
│   └── main.tsx         # App entry point
├── supabase/            # Supabase configuration
│   ├── config.toml      # Supabase project config
│   └── migrations/      # Database migrations
└── package.json
```

## Database Schema

### Tables
- **profiles**: User profile information (name, bio, skills, hourly rate)
- **user_roles**: User role assignments (freelancer, client, admin)
- **projects**: Freelance projects with budgets and requirements
- **proposals**: Freelancer proposals for projects
- **milestones**: Project milestones for fixed-price projects
- **time_entries**: Time tracking for hourly projects
- **messages**: Real-time chat between clients and freelancers
- **transactions**: Payment and escrow transactions
- **reviews**: Ratings and reviews after project completion

## Security Features

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- Role-based access control
- Input validation with Zod schema validation
- Protected API routes

## Environment Variables

The `.env` file is automatically managed by Lovable Cloud and includes:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Key Features Implementation

### Authentication
- Email/password authentication via Supabase Auth
- Auto-confirm email enabled for development
- Session persistence with localStorage
- Protected routes requiring authentication

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

### Communication
- Real-time chat using Supabase Realtime
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
- [ ] Real-time messaging
- [ ] Payment integration (PayFast for South Africa)
- [ ] Email notifications
- [ ] File uploads for project attachments
- [ ] Advanced search and filters
- [ ] Portfolio showcase for freelancers
- [ ] Contract management
- [ ] Dispute resolution system

---

Built for South Africa 🇿🇦 with React, TypeScript, and Supabase
