const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asteroidId: { type: String, required: true },
  asteroidName: { type: String },
  alertThreshold: { type: Number }, // e.g., Alert if closer than X km
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Watchlist', watchlistSchema);