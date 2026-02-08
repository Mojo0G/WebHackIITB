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
