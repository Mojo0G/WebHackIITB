const mongoose = require('mongoose');

const alertLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asteroidId: { type: String, required: true },
  eventType: { type: String, enum: ['PROXIMITY_ALERT', 'SYSTEM'], default: 'PROXIMITY_ALERT' },
  notificationStatus: { type: String, enum: ['SENT', 'FAILED'], default: 'SENT' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AlertLog', alertLogSchema);