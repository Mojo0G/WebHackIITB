const mongoose = require('mongoose');

const watchedAsteroidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asteroidId: { type: String, required: true }, // NASA NEO ID
  asteroidName: { type: String }, // Store name for easier display
  alertThreshold: { type: Number, required: true }, // Distance in KM
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WatchedAsteroid', watchedAsteroidSchema);