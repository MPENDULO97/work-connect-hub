# ✅ How to Start the App Correctly

## The Problem
Your frontend (Vite) is not running! That's why you get "Failed to fetch".

## ✅ Solution: Start Both Servers

### Step 1: Stop Everything

Press `Ctrl + C` in your terminal to stop any running processes.

### Step 2: Start the App

```bash
npm run dev
```

### Step 3: Verify Both Servers Started

You should see **BOTH** of these in your terminal:

```
VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Important:** You need to see BOTH:
- ✅ Vite running on port 5173 (frontend)
- ✅ Server running on port 5000 (backend)

### Step 4: Open Browser

Go to: http://localhost:5173

Now try signing up!

## 🔍 Troubleshooting

### If You Only See Backend Running

```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

But NO Vite message, then:

**Solution:** The `concurrently` package might not be working.

**Try this instead:**

#### Terminal 1 (Backend):
```bash
npm run server
```

#### Terminal 2 (Frontend):
```bash
npm run client
```

Now you'll have both running in separate terminals.

### If Port 5173 is Already in Use

```
Error: Port 5173 is already in use
```

**Solution:**

```bash
# Find what's using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Try again
npm run dev
```

### If Port 5000 is Already in Use

```
Error: Port 5000 is already in use
```

**Solution:**

```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Try again
npm run dev
```

## ✅ Quick Test

After starting the app, test both servers:

### Test Frontend (Vite)
Open browser: http://localhost:5173
- Should show your Work Connect homepage

### Test Backend (API)
Open browser: http://localhost:5000/api/health
- Should show: `{"status":"ok","message":"Server is running"}`

## 🎯 Common Mistakes

### ❌ Wrong: Starting Only Backend
```bash
node server/index.js  # This only starts backend!
```

### ❌ Wrong: Starting Only Frontend
```bash
vite  # This only starts frontend!
```

### ✅ Correct: Start Both
```bash
npm run dev  # This starts BOTH frontend and backend!
```

## 📋 Checklist

Before trying to sign up:

- [ ] Ran `npm run dev`
- [ ] See "VITE ready" message
- [ ] See "Server running on port 5000" message
- [ ] See "Connected to MongoDB" message
- [ ] http://localhost:5173 loads in browser
- [ ] http://localhost:5000/api/health works

If all checked, signup should work! ✅

---

**TL;DR:** Run `npm run dev` and make sure you see BOTH Vite and Server messages!
