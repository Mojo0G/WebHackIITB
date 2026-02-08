const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  type: { type: String, enum: ['CRITICAL', 'WARNING', 'INFO'], default: 'INFO' },
  message: { type: String, required: true },
  asteroidId: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);