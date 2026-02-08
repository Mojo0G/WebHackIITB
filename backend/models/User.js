const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  alertNotifications: {
    enableEmail: { type: Boolean, default: true },
    enableInApp: { type: Boolean, default: true },
    riskThreshold: { type: Number, default: 50 }, // Alert when risk score >= this value
    distanceThreshold: { type: Number, default: 5000000 } // Alert when distance <= this value (km)
  },
  createdAt: { type: Date, default: Date.now }
});

// Method to verify password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

module.exports = mongoose.model('User', userSchema);