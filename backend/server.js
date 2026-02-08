const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import Routes & Services
const authRoutes = require('./routes/authRoutes');
const asteroidRoutes = require('./routes/asteroidRoutes');
const { startSentinel } = require('./services/sentinelService');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NASA_API_KEY: process.env.NASA_API_KEY ? '✅ SET' : '❌ MISSING',
      MONGO_URI: process.env.MONGO_URI ? '✅ SET' : '❌ MISSING',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING'
    }
  });
});

// Test endpoint to see asteroid data
app.get('/api/test-asteroids', async (req, res) => {
  try {
    const nasaService = require('./services/nasaService');
    const riskService = require('./services/riskService');
    
    const asteroids = await nasaService.fetchAsteroidFeed();
    console.log(`📊 Test: Fetched ${asteroids.length} asteroids from NASA`);
    
    const enriched = asteroids.slice(0, 3).map(a => ({
      id: a.id,
      name: a.name,
      riskScore: riskService.calculateRiskScore(a),
      diameter: a.estimated_diameter?.meters?.estimated_diameter_avg || 'N/A',
      isPotentiallyHazardous: a.is_potentially_hazardous_asteroid
    }));
    
    res.json({
      totalCount: asteroids.length,
      sampleAsteroids: enriched,
      message: 'Sample of asteroid data from NASA API'
    });
  } catch (error) {
    console.error('🔴 Test endpoint error:', error.message);
    res.status(500).json({
      error: error.message,
      hint: 'Check NASA_API_KEY in environment variables'
    });
  }
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected: Cosmic Watch'))
  .catch(err => console.error('MongoDB Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/asteroids', asteroidRoutes);

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  // User joins their own private room for personal notifications
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

// Start The Sentinel (Pass IO instance so it can alert users)
startSentinel(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
