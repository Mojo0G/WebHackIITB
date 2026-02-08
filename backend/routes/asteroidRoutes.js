const express = require('express');
const router = express.Router();
const { getFeed, watchAsteroid, getWatchlist } = require('../controllers/asteroidController');
const { protect } = require('../middleware/authMiddleware');

router.get('/feed', getFeed); // Public access
router.post('/watch', protect, watchAsteroid); // Protected
router.get('/watchlist', protect, getWatchlist); // Protected

module.exports = router;