const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Health check for auth service
router.get('/health', (req, res) => {
  res.json({ 
    status: 'Auth service healthy',
    timestamp: new Date().toISOString()
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;