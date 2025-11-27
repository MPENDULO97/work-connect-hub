# MongoDB Setup Guide for Work Connect

## Option 1: Local MongoDB (Recommended for Development)

### Install MongoDB

#### Windows
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service
5. Install MongoDB Compass (GUI tool)

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Verify Installation
```bash
mongosh
# Should connect to mongodb://localhost:27017
```

### Update .env
```env
MONGO_URI="mongodb://localhost:27017/workconnect"
```

---

## Option 2: MongoDB Atlas (Cloud - Free Tier)

### Setup Steps

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `workconnect`
   - Password: Generate secure password
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password

### Update .env
```env
MONGO_URI="mongodb+srv://workconnect:<password>@cluster0.xxxxx.mongodb.net/workconnect?retryWrites=true&w=majority"
```

---

## Start the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Edit `.env` file with your MongoDB connection string

### 3. Start Server
```bash
npm run dev
```

This starts:
- Backend API on http://localhost:5000
- Frontend on http://localhost:5173

### 4. Verify Connection
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Database Structure

The application will automatically create these collections:

### users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  fullName: String,
  roles: [String],
  profile: {
    bio: String,
    avatarUrl: String,
    hourlyRate: Number,
    location: String,
    skills: [String],
    portfolioUrl: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### jobs
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  location: String,
  price: Number,
  currency: String,
  poster: ObjectId (ref: User),
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### projects
```javascript
{
  _id: ObjectId,
  clientId: ObjectId (ref: User),
  freelancerId: ObjectId (ref: User),
  title: String,
  description: String,
  projectType: String,
  budgetMin: Number,
  budgetMax: Number,
  hourlyRate: Number,
  skillsRequired: [String],
  status: String,
  escrowAmount: Number,
  deadline: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### proposals
```javascript
{
  _id: ObjectId,
  projectId: ObjectId (ref: Project),
  freelancerId: ObjectId (ref: User),
  coverLetter: String,
  bidAmount: Number,
  estimatedDuration: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Seed Sample Data (Optional)

Create `server/seed.js`:
```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Clear existing data
  await Job.deleteMany({});
  
  // Create sample user
  const user = await User.findOne({ email: 'test@example.com' });
  
  if (user) {
    // Create sample jobs
    const jobs = [
      {
        title: 'Lawn mowing - 2 hours',
        description: 'Need lawn mowed and hedges trimmed',
        category: 'Gardening',
        location: 'Johannesburg',
        price: 200,
        poster: user._id
      },
      {
        title: 'Fix leaking tap',
        description: 'Kitchen tap needs repair',
        category: 'Plumbing',
        location: 'Pretoria',
        price: 350,
        poster: user._id
      }
    ];
    
    await Job.insertMany(jobs);
    console.log('✅ Sample data created');
  }
  
  process.exit();
}

seed();
```

Run seed:
```bash
node server/seed.js
```

---

## MongoDB GUI Tools

### MongoDB Compass (Official)
- Download: https://www.mongodb.com/products/compass
- Connect using your MONGO_URI
- Visual interface for browsing collections

### Studio 3T (Advanced)
- Download: https://studio3t.com/
- Free for non-commercial use
- Advanced query builder

---

## Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Authentication Failed (Atlas)
```
Error: Authentication failed
```
**Solution**: 
- Check username/password in connection string
- Ensure user has correct permissions
- Verify IP whitelist includes your IP

### Database Not Found
MongoDB creates databases automatically when you insert data. No action needed.

---

## Production Considerations

1. **Security**
   - Use strong passwords
   - Restrict IP whitelist
   - Enable authentication
   - Use environment variables

2. **Performance**
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Monitor query performance

3. **Backup**
   - MongoDB Atlas: Automatic backups
   - Local: Use `mongodump` and `mongorestore`

4. **Scaling**
   - MongoDB Atlas: Easy vertical/horizontal scaling
   - Consider sharding for large datasets
