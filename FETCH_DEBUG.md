# 🔍 Debugging "Failed to Fetch"

## Current Status

✅ Backend is running on port 5000  
✅ MongoDB is connected  
✅ CORS is configured for port 8081  
❌ Frontend still getting "Failed to fetch"  

## What I've Added

### 1. Enhanced Logging
The AuthSimple page now logs:
- API URL being used
- Email being sent
- Full error details
- Backend connection test on page load

### 2. Backend Connection Test
When you load the auth page, it will automatically test the backend connection and log the result.

## How to Debug

### Step 1: Open Browser Console
1. Press F12
2. Go to Console tab
3. Refresh the page (Ctrl+R)
4. Look for these messages:
   - "Backend test: {message: 'Work Connect API is running'}" ✅ Good
   - "Backend connection failed: ..." ❌ Problem

### Step 2: Try Logging In
1. Enter email and password
2. Click "Sign In"
3. Check console for:
   - "LOGIN CLICKED!"
   - "API URL: http://localhost:5000"
   - "Calling authAPI.signIn..."
   - Error details

### Step 3: Check Network Tab
1. In DevTools, go to Network tab
2. Try logging in
3. Look for request to `/api/auth/login`
4. Check:
   - Status code
   - Response
   - Headers

## Common Causes

### 1. Backend Not Running
**Check:**
```bash
curl http://localhost:5000/
```

**Should return:**
```json
{"message":"Work Connect API is running"}
```

### 2. Wrong Port
**Check browser console for:**
```
API URL: http://localhost:5000
```

If it shows a different port, the env variable isn't loaded.

### 3. CORS Issue
**Check Network tab:**
- Look for CORS error in console
- Check response headers include `Access-Control-Allow-Origin`

### 4. Firewall/Antivirus
- Windows Firewall might be blocking
- Antivirus might be blocking localhost connections
- Try temporarily disabling

### 5. Browser Extension
- Ad blocker
- Privacy extension
- Security extension

**Test:** Open in Incognito mode

## Manual Test

Try this in browser console:

```javascript
// Test 1: Can we reach the backend?
fetch('http://localhost:5000/')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Failed:', e));

// Test 2: Can we call the login endpoint?
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test123' })
})
  .then(r => r.json())
  .then(d => console.log('Login response:', d))
  .catch(e => console.error('Login failed:', e));
```

## What to Report

After trying the above, tell me:

1. **Backend test result:** What does console show when page loads?
2. **API URL:** What URL is being used?
3. **Network tab:** Do you see the request? What's the status?
4. **Manual test:** Do the fetch commands in console work?
5. **Browser:** Which browser are you using?

## Quick Fixes to Try

### 1. Hard Refresh
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### 2. Clear Site Data
1. F12 → Application tab
2. Clear storage
3. Refresh

### 3. Try Different Browser
- Chrome
- Firefox  
- Edge

### 4. Check Hosts File
Make sure localhost resolves:
```bash
ping localhost
```

Should show `127.0.0.1`

### 5. Restart Backend
The backend is running. If needed:
```bash
# Stop: Ctrl+C
# Start: npm run server
```

---

**Open browser console and check what errors you see!**
