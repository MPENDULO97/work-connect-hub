# Testing Signup Issue - "Failed to Fetch"

## ✅ Backend is Working!

The API test shows the backend is working correctly:
- ✅ Server running on port 5000
- ✅ MongoDB connected
- ✅ CORS configured for http://localhost:5173
- ✅ Signup endpoint working (tested successfully)

## 🔍 Troubleshooting Steps

### Step 1: Check Browser Console

1. Open your browser (Chrome/Edge)
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Try to sign up again
5. Look for error messages

**Common errors:**

#### CORS Error
```
Access to fetch at 'http://localhost:5000/api/auth/signup' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:** Backend CORS is already configured correctly. This shouldn't happen.

#### Network Error
```
Failed to fetch
TypeError: Failed to fetch
```

**Possible causes:**
- Backend not running
- Wrong API URL
- Browser blocking request

### Step 2: Check Network Tab

1. Open Developer Tools (`F12`)
2. Go to "Network" tab
3. Try to sign up
4. Look for the request to `/api/auth/signup`
5. Check:
   - Status code (should be 200 or 201)
   - Response body
   - Request headers

### Step 3: Verify Frontend is Running

Make sure you started the app with:
```bash
npm run dev
```

You should see BOTH:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/

✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Step 4: Check .env File

Verify your `.env` has:
```env
VITE_API_BASE_URL="http://localhost:5000"
```

**Important:** After changing `.env`, you must restart the dev server!

```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### Step 5: Test API Directly

Open a new browser tab and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"Server is running"}
```

If this doesn't work, the backend isn't running.

### Step 6: Clear Browser Cache

Sometimes the browser caches old API URLs:

1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page (`Ctrl + F5`)

### Step 7: Try Different Browser

Test in:
- Chrome
- Edge
- Firefox

If it works in one browser but not another, it's a browser-specific issue.

## 🔧 Quick Fixes

### Fix 1: Restart Everything

```bash
# Stop the dev server (Ctrl+C)

# Clear node modules cache
npm run dev
```

### Fix 2: Check if Both Servers are Running

You need BOTH servers running:

**Terminal should show:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/

✅ Connected to MongoDB
🚀 Server running on port 5000
```

If you only see one, the other isn't running.

### Fix 3: Verify MongoDB is Connected

Look for this in terminal:
```
✅ Connected to MongoDB
```

If you see:
```
❌ MongoDB connection error
```

Then MongoDB isn't running. Follow:
- `SETUP_MONGODB_ATLAS.md` (cloud - recommended)
- OR `INSTALL_MONGODB_WINDOWS.md` (local)

### Fix 4: Check Firewall/Antivirus

Sometimes Windows Firewall or antivirus blocks localhost connections:

1. Temporarily disable antivirus
2. Try signup again
3. If it works, add exception for Node.js

## 🧪 Manual Test

Open browser console (`F12`) and paste this:

```javascript
fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test2@example.com',
    password: 'test123',
    fullName: 'Test User',
    roles: ['client']
  })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

**Expected result:**
```javascript
Success: {
  user: { id: "...", email: "test2@example.com", ... },
  token: "eyJhbG..."
}
```

**If you get an error:**
- Check the error message
- It will tell you exactly what's wrong

## 📋 Checklist

Before asking for help, verify:

- [ ] Backend running (see "🚀 Server running on port 5000")
- [ ] Frontend running (see "Local: http://localhost:5173/")
- [ ] MongoDB connected (see "✅ Connected to MongoDB")
- [ ] `.env` has correct `VITE_API_BASE_URL`
- [ ] Restarted dev server after changing `.env`
- [ ] Browser console shows no errors
- [ ] http://localhost:5000/api/health works in browser
- [ ] Tried different browser
- [ ] Cleared browser cache

## 🆘 Still Not Working?

If you've tried everything above, provide:

1. **Browser console error** (exact message)
2. **Network tab screenshot** (showing the failed request)
3. **Terminal output** (both frontend and backend logs)
4. **Browser and version** (e.g., Chrome 120)

---

**Most Common Solution:** Restart the dev server after updating `.env`!

```bash
# Stop server (Ctrl+C)
npm run dev
```
