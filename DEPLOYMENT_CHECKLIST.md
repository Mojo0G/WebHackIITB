# Render Deployment Checklist - Cosmic Watch

## Pre-Deployment Requirements

### ✅ Backend Setup
- [ ] `backend/package.json` - all dependencies listed
- [ ] `backend/server.js` - configured for environment variables
- [ ] `backend/Dockerfile` - updated for production (`npm start`)
- [ ] `backend/.env.example` - created with all required variables
- [ ] MongoDB connection string ready
- [ ] JWT secret generated

### ✅ Frontend Setup
- [ ] `frontend/package.json` - build script configured
- [ ] `frontend/Dockerfile` - multi-stage build for production
- [ ] `frontend/nginx.conf` - properly configured
- [ ] API endpoint environment variable ready

### ✅ Repository Setup
- [ ] Code pushed to GitHub
- [ ] `.gitignore` created (excludes `.env`, `node_modules/`)
- [ ] `render.yaml` at root directory
- [ ] `RENDER_DEPLOYMENT.md` for reference

### ✅ Required Services

#### MongoDB Atlas
- [ ] Create account at https://mongodb.com/cloud
- [ ] Create cluster
- [ ] Create database user
- [ ] Whitelist IP: 0.0.0.0/0 (for Render)
- [ ] Get connection string

#### Gmail/Email Service
- [ ] Enable 2FA on Gmail
- [ ] Generate App Password
- [ ] Have email ready for notifications

#### NASA API
- [ ] Get API key from https://api.nasa.gov
- [ ] Free tier includes 50 requests/hour

### ✅ Render Setup
- [ ] Render account created
- [ ] GitHub account connected to Render
- [ ] Repository authorized for Render access

## Environment Variables Required

### Backend (cosmic-watch-backend)
```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cosmic-watch
JWT_SECRET=<generate-secure-random-string>
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<app-password-from-gmail>
NASA_API_KEY=<from-nasa-api>
CLIENT_URL=https://cosmic-watch-frontend.onrender.com
```

### Frontend (cosmic-watch-frontend)
```
VITE_API_URL=https://cosmic-watch-backend.onrender.com
```

## Deployment Steps

### 1. Connect GitHub Repository to Render
- [ ] Go to https://dashboard.render.com/
- [ ] Click "New +" → "Blueprint"
- [ ] Select "Connect repository"
- [ ] Choose your GitHub repository

### 2. Review and Deploy render.yaml
- [ ] Verify both services are listed
- [ ] Review environment variable names
- [ ] Click "Deploy" button

### 3. Configure Environment Variables
For **Backend Service**:
- [ ] Click on service → Settings → Environment
- [ ] Add all required environment variables
- [ ] Save changes

For **Frontend Service**:
- [ ] Click on service → Settings → Environment
- [ ] Add `VITE_API_URL` variable
- [ ] Save changes

### 4. Verify Deployments
- [ ] Backend shows "Live" status
- [ ] Frontend shows "Live" status
- [ ] Both services have public URLs assigned
- [ ] View logs for any errors

## Post-Deployment Verification

### Backend Tests
- [ ] [ ] Health check: GET `/` or test endpoint
- [ ] [ ] Auth endpoint working: POST `/api/auth/register`
- [ ] [ ] Database connection verified in logs
- [ ] [ ] Socket.io connection working
- [ ] [ ] NASA API integration working

### Frontend Tests
- [ ] [ ] Page loads successfully
- [ ] [ ] Can navigate between pages
- [ ] [ ] Login/Register forms functional
- [ ] [ ] Backend API calls successful
- [ ] [ ] Real-time notifications working

### Database Verification
- [ ] [ ] Users table has test data
- [ ] [ ] Collections created properly
- [ ] [ ] MongoDB Atlas shows connections

## Troubleshooting Commands

### View Logs
```bash
# In Render Dashboard: Services → [Service Name] → Logs
# Or use Render CLI
render logs cosmic-watch-backend
```

### Check Connectivity
- Backend URL: `https://cosmic-watch-backend.onrender.com`
- Frontend URL: `https://cosmic-watch-frontend.onrender.com`

### Common Issues
- **502 Bad Gateway**: Check if backend service is active in logs
- **CORS errors**: Verify CLIENT_URL env variable is set
- **Database errors**: Check MONGO_URI and IP whitelist
- **Build failures**: Check `npm ci` output in build logs

## Performance Tips

### For Free Tier
- App spins down after 15 minutes of inactivity
- Cold start takes ~30 seconds on first request
- Upgrade to Standard plan for always-on service

### Optimization
- Use CDN for static assets (frontend)
- Monitor database query performance
- Setup Render alerts for downtime

## Next Steps After Deployment

1. [ ] Test all features thoroughly
2. [ ] Setup monitoring/alerts
3. [ ] Consider upgrading to paid plan for production
4. [ ] Setup GitHub Actions for automated deployments
5. [ ] Monitor logs regularly
6. [ ] Plan scaling as user base grows

---

**Useful Links:**
- Render Dashboard: https://dashboard.render.com/
- Documentation: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- NASA API: https://api.nasa.gov/

Last updated: February 8, 2026
