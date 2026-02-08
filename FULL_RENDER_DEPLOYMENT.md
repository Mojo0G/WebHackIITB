# Complete Render Deployment Guide - Cosmic Watch

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Setup](#pre-deployment-setup)
3. [GitHub Repository Preparation](#github-repository-preparation)
4. [Render Deployment](#render-deployment)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [ ] **GitHub Account** - https://github.com (free)
- [ ] **Render Account** - https://render.com (free)
- [ ] **MongoDB Atlas Account** - https://mongodb.com/cloud (free)
- [ ] **Gmail Account** - For email notifications
- [ ] **NASA API Key** - https://api.nasa.gov (free)

### System Requirements
- Git installed on your machine
- Node.js >= 16 (for testing locally - optional)
- Internet connection

---

## Pre-Deployment Setup

### Step 1: Prepare MongoDB Atlas Database

#### 1.1 Create MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start free"
3. Create account with email
4. Verify email

#### 1.2 Create a Cluster
1. Click "Create a Deployment"
2. Select **M0 (Free)** tier
3. Choose your cloud provider (AWS preferred)
4. Select region closest to you
5. Click "Create Deployment"
6. **Wait 3-5 minutes for cluster to initialize**

#### 1.3 Create Database User
1. Go to "Security" → "Quickstart"
2. Choose "Username and Password"
3. Create username: `cosmicwatch`
4. Create password: **Save this securely** (e.g., `P@ssw0rd123`)
5. Click "Create User"

#### 1.4 Allow Network Access
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere"
4. Click "Confirm"
5. **Note:** This allows Render to connect

#### 1.5 Get Connection String
1. Go to "Deployment" → "Database"
2. Click "Connect"
3. Select "Drivers"
4. Choose Node.js as driver
5. Copy connection string
6. Replace `<username>` and `<password>` with your credentials
7. **Example:** 
   ```
   mongodb+srv://cosmicwatch:P@ssw0rd123@cluster0.xxxxx.mongodb.net/cosmic-watch?retryWrites=true&w=majority
   ```
8. **Save this - you'll need it in Render**

---

### Step 2: Setup Gmail for Email Notifications

#### 2.1 Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/
2. Select "Security" from left menu
3. Scroll to "How you sign in to Google"
4. Enable "2-Step Verification"
5. Follow prompts

#### 2.2 Generate App Password
1. Go back to Security settings
2. Scroll to "App passwords"
3. Select "Mail" and "Windows Computer"
4. Google generates a 16-character password
5. **Copy and save this password** - you'll use it in Render
6. **Example:** `abcd efgh ijkl mnop`

---

### Step 3: Get NASA API Key

1. Go to https://api.nasa.gov/
2. Scroll down to "Generate API Key"
3. Enter your email
4. Click "Signup"
5. Copy your API key from the confirmation email or page
6. **Save this - you'll need it in Render**

---

## GitHub Repository Preparation

### Step 4: Initialize Git Repository Locally

Open PowerShell in your `WebHackIITB` directory:

```powershell
cd D:\DevFiles\DevDev\WebHackIITB

# Initialize git if not already done
git init

# Configure git (if first time)
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"

# Check status
git status
```

### Step 5: Setup .gitignore

✅ **Already created** - Verify it exists at root:
```
WebHackIITB/
├── .gitignore          ✅
├── render.yaml         ✅
├── backend/
│   └── .env.example    ✅
└── frontend/
```

### Step 6: Create GitHub Repository

1. Go to https://github.com/new
2. Enter Repository name: `cosmic-watch` (or your choice)
3. Select **Public** (required for Render's free tier)
4. Click "Create Repository"
5. **Copy the repository URL** (e.g., `https://github.com/yourname/cosmic-watch.git`)

### Step 7: Push Code to GitHub

In PowerShell:

```powershell
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Cosmic Watch deployment setup"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/cosmic-watch.git

# Push to GitHub
git branch -M main
git push -u origin main

# Verify
git status
```

**Output should show:** "Your branch is up to date with 'origin/main'."

---

## Render Deployment

### Step 8: Connect GitHub to Render

#### 8.1 Create Render Account
1. Go to https://render.com
2. Click "Get started for free"
3. Sign up with GitHub (recommended - automatic connection!)
4. Authorize Render to access your GitHub account
5. Go to https://dashboard.render.com/

#### 8.2 Deploy Backend

**Method: Using render.yaml (Automatic)**

1. In Render Dashboard, click **"New +"** → **"Blueprint"**
2. Select **"Public Git repository"**
3. Paste your repository URL: `https://github.com/YOUR_USERNAME/cosmic-watch.git`
4. Click **"Connect"**
5. Click **"Apply"** to create services from render.yaml
6. **Wait 2-3 minutes** - Both services will start deploying

✅ **render.yaml automatically deploys:**
- Backend service (Node.js)
- Frontend service (Docker/Nginx)

### Step 9: Configure Environment Variables

This is **CRITICAL** - without these, services won't work!

#### 9.1 Backend Environment Variables

1. In Render Dashboard, click **"cosmic-watch-backend"**
2. Go to **"Settings"** → **"Environment"**
3. Click **"Add Environment Variable"** and add each (one at a time):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb+srv://cosmicwatch:P@ssw0rd123@cluster0.xxxxx.mongodb.net/cosmic-watch?retryWrites=true&w=majority` |
| `JWT_SECRET` | Generate random: `your-secure-random-string-min-32-chars` |
| `EMAIL_USER` | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Your 16-char app password (without spaces) |
| `NASA_API_KEY` | Your NASA API key |
| `CLIENT_URL` | Will be assigned after frontend deployment |

**How to generate JWT_SECRET:**
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char](Get-Random -Minimum 33 -Maximum 127))} -join '')))
```

Or use any 32+ character random string.

#### 9.2 Frontend Environment Variables

1. In Render Dashboard, click **"cosmic-watch-frontend"**
2. Go to **"Settings"** → **"Environment"**
3. Add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://cosmic-watch-backend.onrender.com` |

### Step 10: Get Your Service URLs

After deployment completes:

1. **Backend URL:** 
   - Go to "cosmic-watch-backend" service
   - Copy URL from top (e.g., `https://cosmic-watch-backend.onrender.com`)
   - Add this to Frontend's `VITE_API_URL`

2. **Frontend URL:**
   - Go to "cosmic-watch-frontend" service
   - Copy URL from top (e.g., `https://cosmic-watch-frontend.onrender.com`)
   - Add this to Backend's `CLIENT_URL`

### Step 11: Update Environment Variables with URLs

**In Backend Service:**
1. Go to Settings → Environment
2. Find `CLIENT_URL`
3. Set to: `https://cosmic-watch-frontend.onrender.com`
4. Click **Save**
5. Service will auto-redeploy

**In Frontend Service:**
1. Go to Settings → Environment
2. Find `VITE_API_URL`
3. Set to: `https://cosmic-watch-backend.onrender.com`
4. Click **Save**
5. Service will auto-redeploy

---

## Post-Deployment Verification

### Step 12: Verify Backend

1. Go to Backend service URL: `https://cosmic-watch-backend.onrender.com`
2. Try these tests:

**Check Logs:**
- In Render Dashboard → "cosmic-watch-backend" → "Logs"
- Should see: `MongoDB Connected: Cosmic Watch`
- Should see: `Server running on port 5000`

**Test API Endpoint:**
```powershell
# Test if server is running
curl https://cosmic-watch-backend.onrender.com/

# Should return something (not 404)
```

**Test Registration:**
```powershell
curl -X POST https://cosmic-watch-backend.onrender.com/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Step 13: Verify Frontend

1. Go to Frontend service URL: `https://cosmic-watch-frontend.onrender.com`
2. Check:
   - [ ] Page loads without errors
   - [ ] Can see login/register page
   - [ ] CSS is styled (Tailwind loaded)
   - [ ] No console errors (open DevTools F12)

3. In Render Dashboard → "cosmic-watch-frontend" → "Logs"
   - Should show successful nginx startup

### Step 14: Test Complete User Flow

1. Go to frontend URL
2. Click "Register"
3. Create test account with:
   - Username: `testuser`
   - Email: `your-test-email@gmail.com`
   - Password: `TestPassword123!`
4. Click Register
5. Should redirect to login (check for success message)
6. Try Login with credentials
7. Should see dashboard

### Step 15: Monitor for Errors

**Check Backend Logs for:**
```
✅ MongoDB Connected: Cosmic Watch
✅ Server running on port 5000
✅ No "Cannot find module" errors
❌ If errors appear, note them for troubleshooting
```

**Check Frontend Logs for:**
```
✅ nginx started successfully
✅ No build errors
❌ If errors appear, likely build issue
```

---

## Troubleshooting

### Issue: "Application failed to start"

**Solution:**
1. Go to service → Logs
2. Look for error messages
3. Most common causes:

```
ERROR: MongoDB Connection Failed
→ Check MONGO_URI environment variable
→ Verify MongoDB Atlas IP whitelist
→ Test connection string locally

ERROR: Cannot find module 'express'
→ Check package.json has all dependencies
→ Delete render.yaml, redeploy
→ Force rebuild in Render Dashboard

ERROR: CORS error
→ Check CLIENT_URL environment variable
→ Ensure it matches frontend URL exactly
```

### Issue: Frontend shows "Cannot connect to API"

**Check:**
1. Backend service is running (status = "Live")
2. `VITE_API_URL` matches backend URL exactly
3. No typos in URL
4. Frontend logs show correct API URL

**Fix:**
```
In Frontend Environment Variables:
VITE_API_URL should be exactly:
https://cosmic-watch-backend.onrender.com
(no trailing slash)
```

### Issue: Email notifications not sending

**Check:**
1. `EMAIL_USER` is correct Gmail
2. `EMAIL_PASSWORD` is 16-character app password (no spaces)
3. 2FA enabled on Gmail
4. Check backend logs for nodemailer errors

**Test locally first:**
```powershell
npm install
# Create .env file with email credentials
npm run dev
# Try triggering email notification
```

### Issue: Database operations failing

**Check:**
1. `MONGO_URI` is correct format
2. Username and password are correct
3. Special characters in password are URL-encoded (e.g., @ = %40)
4. MongoDB Atlas IP whitelist includes 0.0.0.0/0
5. Database `cosmic-watch` exists in MongoDB Atlas

**Test connection:**
```powershell
# Install MongoDB tools
npm install -g mongosh

# Connect to your database
mongosh "mongodb+srv://cosmicwatch:password@cluster.mongodb.net/cosmic-watch"
```

### Issue: Services keep crashing or redeploying

**Solution:**
1. Check logs for repeated errors
2. Verify all environment variables are set
3. Check `package.json` for correct start script
4. Verify memory isn't exceeded (Free tier has 512MB limit)

### Issue: Cold start takes too long

**Normal behavior:**
- Free tier: 30-60 second cold start after inactivity
- Standard tier: Always-on (recommended for production)

**Solution:**
- Upgrade to Standard plan for production
- Or accept cold start delay

---

## Summary: Quick Reference URLs

After successful deployment, you'll have:

| Service | URL | Status |
|---------|-----|--------|
| Backend API | `https://cosmic-watch-backend.onrender.com` | Check in Render Dashboard |
| Frontend App | `https://cosmic-watch-frontend.onrender.com` | Check in Render Dashboard |
| MongoDB | `mongodb+srv://...` | Check in MongoDB Atlas |

---

## Next Steps for Production

### Security
- [ ] Store all API keys in environment variables (not in code)
- [ ] Rotate JWT_SECRET periodically
- [ ] Use HTTPS (Render provides automatically)
- [ ] Implement rate limiting
- [ ] Add input validation/sanitization

### Performance
- [ ] Setup CDN for frontend assets
- [ ] Optimize database indexes
- [ ] Monitor API response times
- [ ] Setup caching strategies

### Monitoring
- [ ] Enable Render alerts for service downtime
- [ ] Monitor database usage
- [ ] Check error logs daily
- [ ] Setup email alerts for critical errors

### Scaling
- [ ] Monitor if services hit resource limits
- [ ] Plan upgrade to Standard plan
- [ ] Consider horizontal scaling if needed

### Backup & Recovery
- [ ] Setup MongoDB Atlas backup
- [ ] Document recovery procedures
- [ ] Test recovery process quarterly
- [ ] Keep local backup of .env variables

---

## Support & Resources

| Issue | Resource |
|-------|----------|
| Render Help | https://render.com/docs |
| MongoDB Help | https://docs.mongodb.com |
| Express.js Help | https://expressjs.com/docs |
| React/Vite Help | https://vitejs.dev/guide/ |

---

## Deployment Checklist - Final

Before going live:

- [ ] Database connected and tested
- [ ] All environment variables set correctly
- [ ] Backend service is "Live"
- [ ] Frontend service is "Live"
- [ ] Can create user account
- [ ] Can login to account
- [ ] API calls working properly
- [ ] Email notifications sending
- [ ] No console errors in frontend
- [ ] No errors in backend logs
- [ ] Real-time socket connections working

**Congratulations! Your Cosmic Watch app is deployed! 🚀**

---

**Last Updated:** February 8, 2026
**Application:** Cosmic Watch - Asteroid Monitoring System
**Deployment Platform:** Render
