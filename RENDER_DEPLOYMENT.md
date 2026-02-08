# Render Deployment Guide - Cosmic Watch

## Prerequisites
- Render account (https://render.com)
- GitHub repository with this code
- MongoDB Atlas cluster (for database)
- NASA API key (https://api.nasa.gov)
- Gmail App Password (for email notifications)

## Step-by-Step Deployment

### 1. Database Setup (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Create a database named `cosmic-watch`
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/cosmic-watch`

### 2. Backend Deployment

#### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub
2. Go to https://dashboard.render.com/
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and deploy both services

#### Option B: Manual Setup
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following:
   - **Name:** `cosmic-watch-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid as needed)

### 3. Environment Variables
Set these in Render Dashboard (Settings → Environment):

```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cosmic-watch
JWT_SECRET=your_secure_random_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
NASA_API_KEY=your_nasa_api_key
CLIENT_URL=https://cosmic-watch-frontend.onrender.com
```

### 4. Frontend Deployment
1. Create another Web Service for frontend
2. Configure:
   - **Name:** `cosmic-watch-frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Publish Directory:** `dist`

3. Set environment variables:
```
VITE_API_URL=https://cosmic-watch-backend.onrender.com
```

### 5. Important Notes

**Port Configuration:**
- Render automatically assigns a PORT environment variable
- Your server.js already reads: `process.env.PORT || 5000`
- No changes needed!

**Dockerfile:**
- Updated to use `npm ci` for production
- Changed from `npm run dev` to `npm start`
- Uses `node:18-alpine` for smaller image size

**.env Management:**
- Never commit `.env` file to GitHub
- Use `.env.example` as template
- Set all variables in Render Dashboard

**Build Times:**
- First deploy takes 2-5 minutes
- Subsequent builds cache dependencies

### 6. Troubleshooting

**"Cannot find module" errors:**
- Check `package.json` has all dependencies
- Render uses `npm ci` (more strict than npm install)

**Database connection fails:**
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 for Render)

**CORS errors:**
- Ensure CLIENT_URL environment variable is set correctly
- Check CORS middleware in server.js

**Email not sending:**
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail first
- Consider using SendGrid or Mailgun instead

### 7. Useful Commands for Monitoring

```bash
# View logs
render logs <service-id>

# Check deployment status
render deployments <service-id>
```

### 8. Scaling & Performance

- **Free Plan:** 0.5 CPU, 512 MB RAM
- **Standard Plan:** Recommended for production with guaranteed uptime
- Monitor resource usage in Render Dashboard

---

**Deployment Model Diagram:**
```
GitHub → Render (Blueprint) → Deploy Both Backend & Frontend
                            ↓
                    MongoDB Atlas (Database)
                            ↓
                      Production App
```

For questions, refer to: https://render.com/docs
