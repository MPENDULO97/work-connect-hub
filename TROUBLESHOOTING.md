# Troubleshooting Guide

## Login/Signup Buttons Not Working

### Issue Fixed ✅
The signup button was missing `setIsLoading(true)` at the start of the function. This has been fixed.

### How to Test

1. **Start the backend:**
```bash
npm run server
```

2. **Start the frontend:**
```bash
npm run client
```

3. **Test Login:**
   - Go to http://localhost:8080/auth
   - Click "Login" tab
   - Enter email and password
   - Click "Sign In" button
   - Should show loading spinner and redirect to dashboard

4. **Test Signup:**
   - Go to http://localhost:8080/auth
   - Click "Sign Up" tab
   - Enter full name, email, password
   - Check at least one role (Freelancer or Client)
   - Click "Create Account" button
   - Should show loading spinner and redirect to dashboard

### Common Issues

#### 1. Buttons Not Clickable

**Possible Causes:**
- CSS z-index issues
- Overlapping elements
- Disabled state stuck

**Solutions:**
- Check browser console for errors
- Inspect element to see if anything is covering the button
- Verify `isLoading` state is working correctly

#### 2. Backend Not Running

**Symptoms:**
- Network errors in console
- "Failed to fetch" errors
- Buttons click but nothing happens

**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000/

# If not running, start it
npm run server
```

#### 3. CORS Errors

**Symptoms:**
- "CORS policy" errors in console
- Requests blocked

**Solution:**
- Verify `CLIENT_ORIGIN` in `.env` matches your frontend URL
- Default should be `http://localhost:8080`

#### 4. Form Validation Errors

**Symptoms:**
- Toast error messages appear
- Form doesn't submit

**Common Validation Rules:**
- Email must be valid format
- Password must be at least 6 characters
- Full name is required for signup
- At least one role must be selected for signup

#### 5. API Errors

**Symptoms:**
- "User already exists" error
- "Invalid credentials" error

**Solutions:**
- For "User already exists": Try logging in instead
- For "Invalid credentials": Check email/password are correct
- Check backend logs for detailed error messages

### Debug Steps

1. **Open Browser DevTools** (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for API requests
   - Look for failed requests (red)

2. **Check Backend Logs**
   - Look at terminal running `npm run server`
   - Check for error messages
   - Verify MongoDB connection

3. **Test API Directly**
```bash
# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","roles":["freelancer"]}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

4. **Check State**
   - Add console.log in handleSignIn/handleSignUp
   - Verify form values are being captured
   - Check if isLoading state changes

### Quick Fixes

#### Clear Browser Cache
```
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```

#### Restart Everything
```bash
# Stop all processes (Ctrl+C)
# Then restart
npm run dev
```

#### Check Environment Variables
```bash
# Verify .env file has:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_ORIGIN=http://localhost:8080
VITE_API_BASE_URL=http://localhost:5000
```

### Still Not Working?

1. **Check this file for updates:** `src/pages/Auth.tsx`
2. **Verify backend is running:** http://localhost:5000
3. **Check browser console** for specific error messages
4. **Review backend logs** for API errors
5. **Test with different browser** (Chrome, Firefox, Edge)

### Contact Support

If issues persist:
1. Note the exact error message
2. Check browser console
3. Check backend logs
4. Review the steps above
5. Check if MongoDB is connected

---

Last Updated: December 1, 2025
