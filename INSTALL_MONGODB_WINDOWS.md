# Install MongoDB on Windows

## Quick Installation Steps

### 1. Download MongoDB Community Server

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### 2. Install MongoDB

1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **Important:** Check "Install MongoDB as a Service"
4. **Important:** Check "Install MongoDB Compass" (GUI tool)
5. Click "Next" and "Install"
6. Wait for installation to complete

### 3. Verify Installation

Open PowerShell or Command Prompt and run:

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Should show:
# Status   Name               DisplayName
# ------   ----               -----------
# Running  MongoDB            MongoDB Server
```

### 4. Test Connection

```powershell
# Try connecting (if mongosh is installed)
mongosh

# Or check if MongoDB is listening on port 27017
Test-NetConnection localhost -Port 27017
```

### 5. Start Your App

```bash
npm run dev
```

## Troubleshooting

### MongoDB Service Not Running

```powershell
# Start MongoDB service
net start MongoDB

# Or using Services
# 1. Press Win + R
# 2. Type: services.msc
# 3. Find "MongoDB Server"
# 4. Right-click → Start
```

### Port 27017 Already in Use

```powershell
# Check what's using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### MongoDB Not Found

If MongoDB didn't install correctly:

1. Uninstall MongoDB
2. Delete folder: `C:\Program Files\MongoDB`
3. Reinstall following steps above

## Alternative: Use MongoDB Atlas (Cloud)

If you don't want to install MongoDB locally, use MongoDB Atlas (free cloud database):

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Whitelist IP: `0.0.0.0/0`
6. Get connection string
7. Update `.env`:

```env
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/workconnect"
```

## Quick Test

After installation, test if MongoDB is working:

```powershell
# Test connection
Test-NetConnection localhost -Port 27017

# Expected output:
# ComputerName     : localhost
# RemoteAddress    : ::1
# RemotePort       : 27017
# TcpTestSucceeded : True
```

---

Once MongoDB is installed and running, your app will start successfully! 🚀
