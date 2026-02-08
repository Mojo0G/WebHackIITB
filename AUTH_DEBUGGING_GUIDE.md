# Authentication Debugging Guide

## Overview
This guide helps you test and debug the login/signup authentication system.

## What Was Fixed

### Frontend (Login & Register Pages)
✅ **Login.jsx Improvements:**
- Specific error messages (not found vs wrong password vs network error)
- **"Create Account Instead" button** when login fails
- Console logging of all auth attempts
- Error category detection

✅ **Register.jsx Improvements:**
- Input validation (all fields required, password 6+ chars)
- Success message with auto-redirect
- Better error messages
- Disabled inputs during loading
- Styling consistent with Login

✅ **AuthContext.jsx:**
- Proper error throwing so components can catch them
- Console logging for auth flow
- Request/response interceptors with logging

### Backend (Node.js/Express)
✅ **authController.js:**
- Detailed logging for every auth attempt
- Validation of required fields
- Specific error messages
- Error categorization in logs

✅ **authRoutes.js:**
- New `/api/auth/health` endpoint for service status
- All endpoints log requests

## Testing Steps

### 1. **Test Registration**

#### Scenario 1: Successful Registration
```
1. Go to https://<frontend-url>/register
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "Password123"
3. Click "GRANT CLEARANCE"

Expected Result:
✅ Shows "Account created successfully! Redirecting..."
✅ Redirects to Dashboard after 2 seconds
✅ Console shows: "📝 Attempting registration with email: test@example.com"
✅ Console shows: "✅ Registration successful, redirecting..."
```

Backend should log:
```
📝 Register attempt: test@example.com
✅ User registered successfully: <USER_ID>
📍 POST /api/auth/register
📤 Response: 201
```

#### Scenario 2: User Already Exists
```
1. Try to register with same email again
2. Enter: "test@example.com" (same as before)

Expected Result:
❌ Shows error: "User already exists with this email"
❌ Stays on Register page
```

Backend should log:
```
📝 Register attempt: test@example.com
⚠️  User already exists: test@example.com
📍 POST /api/auth/register
📤 Response: 400
```

#### Scenario 3: Missing Fields
```
1. Leave one field empty
2. Click "GRANT CLEARANCE"

Expected Result:
❌ Shows error: "All fields are required" (if browser validation passes)
```

#### Scenario 4: Weak Password
```
1. Enter password: "123"
2. Click "GRANT CLEARANCE"

Expected Result:
❌ Shows error: "Password must be at least 6 characters"
```

### 2. **Test Login**

#### Scenario 1: Successful Login
```
1. Go to https://<frontend-url>/login
2. Fill in:
   - Email: "test@example.com" (from registration)
   - Password: "Password123"
3. Click "INITIATE UPLINK"

Expected Result:
✅ Logs in successfully
✅ Redirects to Dashboard
✅ User sees asteroid cards
✅ Console shows: "🔑 Attempting login with email: test@example.com"
✅ Console shows: "✅ Login successful, redirecting..."
```

Backend should log:
```
🔑 Login attempt: test@example.com
✅ Login successful: <USER_ID>
📍 POST /api/auth/login
📤 Response: 200
```

#### Scenario 2: Wrong Password
```
1. Enter correct email but wrong password
2. Click "INITIATE UPLINK"

Expected Result:
❌ Shows error: "Invalid email or password"
❌ Shows button: "Create Account Instead"
❌ User can click to go to register
```

Backend should log:
```
🔑 Login attempt: test@example.com
⚠️  Invalid password for user: test@example.com
📍 POST /api/auth/login
📤 Response: 401
```

#### Scenario 3: User Not Found
```
1. Enter email that doesn't exist: "novuser@test.com"
2. Enter any password
3. Click "INITIATE UPLINK"

Expected Result:
❌ Shows error: "Invalid email or password"
❌ Shows button: "Create Account Instead"
```

Backend should log:
```
🔑 Login attempt: novuser@test.com
⚠️  User not found: novuser@test.com
📍 POST /api/auth/login
📤 Response: 401
```

#### Scenario 4: Network Error
```
If backend is offline or unreachable:

Expected Result:
❌ Shows error: "Network error - backend unreachable"
❌ Shows button: "Create Account Instead"
```

Frontend console should show:
```
Error Code: ECONNREFUSED or Network Error
```

### 3. **Check Backend Logs**

#### Access Logs on Render
1. Go to https://dashboard.render.com/
2. Select your backend service
3. Click "Logs"
4. Look for auth endpoint activity:

```
📍 [2026-02-09T10:30:45.123Z] POST /api/auth/login
   Body: { email: "test@example.com", password: "..." }
🔑 Login attempt: test@example.com
✅ Login successful: <USER_ID>
📤 Response: 200 (45ms)
```

### 4. **Check Frontend Console Logging**

Open Browser DevTools (F12) and check Console tab:

#### On Registration
```
🔧 API Configuration Loaded:
   Environment: production
   VITE_API_URL: https://cosmic-watch-backend.onrender.com
   API_BASE_URL: https://cosmic-watch-backend.onrender.com

🚀 Axios Request:
   method: post
   url: /api/auth/register
   fullURL: https://cosmic-watch-backend.onrender.com/api/auth/register

📝 Attempting registration with email: test@example.com

✅ Axios Response:
   status: 201
   statusText: Created
   dataLength: 4

✅ Registration successful, redirecting...
```

#### On Login
```
🔑 Attempting login with email: test@example.com

🚀 Axios Request:
   method: post
   url: /api/auth/login
   fullURL: https://cosmic-watch-backend.onrender.com/api/auth/login

🔓 Authorization token set

✅ Login successful, redirecting...
```

#### On Error
```
❌ Response Error:
   message: "Error: Request failed with status code 401"
   code: "ERR_BAD_REQUEST"
   status: 401
   statusText: "Unauthorized"
   url: /api/auth/login
   data: { message: "Invalid email or password" }
```

## Troubleshooting

### Problem: "Network error - backend unreachable"
**Check:**
1. Is backend running on Render?
2. Is frontend using correct API_BASE_URL?
   - Local: `http://localhost:5000`
   - Render: `https://cosmic-watch-backend.onrender.com`
3. Check Render backend logs for crashes

### Problem: "User not found" for new signup
**Check:**
1. Is MongoDB connection working?
2. Check backend logs for "User registered successfully"
3. Try a different email address

### Problem: "Invalid email or password" after successful signup
**Check:**
1. Are you using exact same email and password?
2. Check password is 6+ characters
3. Check for accidental spaces in email/password
4. Try registering with different email

### Problem: No console logs showing
**Check:**
1. Browser DevTools is open (F12)
2. Console tab is selected
3. No filters hiding logs
4. Try hardRefresh (Ctrl+Shift+R)

## API Endpoints Reference

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/register` | POST | Create new user | ❌ |
| `/api/auth/login` | POST | Login user | ❌ |
| `/api/auth/health` | GET | Check auth service status | ❌ |
| `/api/asteroids/feed` | GET | Get asteroid list | ✅ (JWT) |

## Request/Response Examples

### Register Request
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123"
}
```

### Register Response (201)
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Test User",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login Request
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123"
}
```

### Login Response (200)
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "name": "Test User",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response (401)
```json
{
  "message": "Invalid email or password"
}
```

## Success Criteria

✅ All tests pass when:
1. Registration creates new users in MongoDB
2. Login retrieves users from MongoDB
3. Errors show appropriate messages
4. Buttons navigate to signup/login as needed
5. Console logs show request/response flow
6. Backend logs show auth attempts
7. JWT tokens are generated and stored
8. User can access protected routes after login

## Next Steps

After deployment recompiles (2-5 minutes):
1. Open frontend in browser
2. Go to `/register` page
3. Create a test account
4. Check browser console for logs
5. Check Render backend logs for database activity
6. Try logging in
7. Verify access to Dashboard

If issues persist, check:
- MongoDB Atlas connection string in .env
- Environment variables set in Render
- Network connectivity between services
- Browser console and backend logs
