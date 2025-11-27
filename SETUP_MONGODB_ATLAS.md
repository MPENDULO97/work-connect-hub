# Setup MongoDB Atlas (Cloud Database) - 5 Minutes

No installation required! Get a free cloud database in 5 minutes.

## Step 1: Create Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google account

## Step 2: Create Free Cluster

1. After login, click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
   - 512 MB storage
   - Shared RAM
   - Perfect for development
3. Select cloud provider: **AWS** (recommended)
4. Select region: Choose closest to you
   - For South Africa: `eu-west-1` (Ireland) or `ap-south-1` (Mumbai)
5. Cluster Name: Leave as default or name it `workconnect`
6. Click "Create Cluster"
7. Wait 3-5 minutes for cluster to deploy

## Step 3: Create Database User

1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `workconnect`
5. Password: Click "Autogenerate Secure Password" (copy it!)
   - Or create your own strong password
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

## Step 4: Whitelist IP Address

1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
   - This adds `0.0.0.0/0` (for development only)
   - For production, add specific IPs
4. Click "Confirm"

## Step 5: Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string:

```
mongodb+srv://workconnect:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Update .env File

1. Open your `.env` file
2. Replace the MONGO_URI line with your connection string
3. Replace `<password>` with your actual password
4. Add database name after `.net/`:

```env
MONGO_URI="mongodb+srv://workconnect:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/workconnect?retryWrites=true&w=majority"
```

**Example:**
```env
MONGO_URI="mongodb+srv://workconnect:MyP@ssw0rd123@cluster0.abc123.mongodb.net/workconnect?retryWrites=true&w=majority"
```

## Step 7: Start Your App

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

## Verify Connection

### Check in Terminal
Look for successful connection message:
```
✅ Connected to MongoDB
```

### Test API
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"ok","message":"Server is running"}
```

### View Data in Atlas

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. After creating users/jobs, you'll see:
   - `workconnect` database
   - Collections: `users`, `jobs`, `projects`, `proposals`

## Common Issues

### Authentication Failed
```
MongoServerError: bad auth : Authentication failed
```

**Solution:**
- Check username and password in connection string
- Ensure password doesn't contain special characters (or URL encode them)
- Verify user was created in Database Access

### Network Error
```
MongoNetworkError: connection timed out
```

**Solution:**
- Check Network Access whitelist includes `0.0.0.0/0`
- Check your internet connection
- Try different region if connection is slow

### Database Name Missing
```
MongoError: no database specified
```

**Solution:**
- Add `/workconnect` after `.mongodb.net` in connection string:
```
mongodb+srv://user:pass@cluster.mongodb.net/workconnect?retryWrites=true
```

## Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

- `USERNAME`: Your database user (e.g., `workconnect`)
- `PASSWORD`: Your database password
- `CLUSTER`: Your cluster address (e.g., `cluster0.abc123`)
- `DATABASE`: Database name (e.g., `workconnect`)

## Special Characters in Password

If your password contains special characters, URL encode them:

| Character | Encoded |
|-----------|---------|
| @         | %40     |
| :         | %3A     |
| /         | %2F     |
| ?         | %3F     |
| #         | %23     |
| [         | %5B     |
| ]         | %5D     |

**Example:**
- Password: `P@ss:word#123`
- Encoded: `P%40ss%3Aword%23123`

## Free Tier Limits

MongoDB Atlas Free Tier (M0):
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ No credit card required
- ✅ Perfect for development
- ✅ Automatic backups
- ✅ 100 max connections

## Upgrade Later

When ready for production:
- M2: $9/month (2 GB storage)
- M5: $25/month (5 GB storage)
- Dedicated clusters available

## Benefits of Atlas

✅ No installation required
✅ Automatic backups
✅ Built-in monitoring
✅ Easy scaling
✅ Global deployment
✅ Free tier forever
✅ Works from anywhere

---

🎉 **You're all set!** Your app is now connected to MongoDB Atlas.

Start building: `npm run dev`
