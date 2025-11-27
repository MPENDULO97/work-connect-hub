# 🚨 Quick Fix: "Failed to Fetch" on Signup

## The Problem
You're getting "Failed to fetch" when trying to sign up.

## ✅ Quick Solution (90% of cases)

### 1. Make Sure MongoDB is Running

**Check your terminal for:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**If you see MongoDB connection error:**

#### Option A: Use MongoDB Atlas (Fastest - 5 minutes)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster
4. Get connection string
5. Update `.env`:
```env
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/workconnect"
```
6. Restart server: `npm run dev`

**Full guide:** `SETUP_MONGODB_ATLAS.md`

#### Option B: Install MongoDB Locally
1. Download: https://www.mongodb.com/try/download/community
2. Install as Windows Service
3. Restart server: `npm run dev`

**Full guide:** `INSTALL_MONGODB_WINDOWS.md`

### 2. Restart the Dev Server

```bash
# Press Ctrl+C to stop
# Then start again:
npm run dev
```

**You should see BOTH:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/

✅ Connected to MongoDB
🚀 Server running on port 5000
```

### 3. Test the Backend

Open browser and go to:
```
http://localhost:5000/api/health
```

**Should show:**
```json
{"status":"ok","message":"Server is running"}
```

### 4. Clear Browser Cache

1. Press `Ctrl + Shift + Delete`
2. Clear "Cached images and files"
3. Refresh page (`Ctrl + F5`)

### 5. Try Signup Again

Go to http://localhost:5173 and try signing up.

## 🔍 Still Not Working?

### Check Browser Console

1. Press `F12`
2. Go to "Console" tab
3. Try signup
4. Look for error message

**Send me the exact error message you see!**

## 📞 Need Help?

Provide:
1. Screenshot of browser console error
2. Terminal output (copy the text)
3. Your `.env` MONGO_URI (hide password)

---

**Most likely issue:** MongoDB not connected. Follow Option A above (MongoDB Atlas) - it's the fastest! 🚀
