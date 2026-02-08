const nasaService = require('../services/nasaService');
const riskService = require('../services/riskService');
const WatchedAsteroid = require('../models/WatchedAsteroid');

exports.getFeed = async (req, res) => {
  try {
    const rawAsteroids = await nasaService.fetchAsteroidFeed();
    

    const enrichedAsteroids = rawAsteroids.map(asteroid => {
      const riskScore = riskService.calculateRiskScore(asteroid);
      return {
        ...asteroid,
        riskScore,
        riskColor: riskService.getRiskColor(riskScore)
      };
    });

    res.json(enrichedAsteroids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch asteroid feed' });
  }
};

exports.watchAsteroid = async (req, res) => {
  const { asteroidId, asteroidName, alertThreshold } = req.body;

  try {
  
    const exists = await WatchedAsteroid.findOne({ 
      userId: req.user._id, 
      asteroidId 
    });

    if (exists) {
      return res.status(400).json({ message: 'Asteroid already in watchlist' });
    }

    const watchItem = await WatchedAsteroid.create({
      userId: req.user._id,
      asteroidId,
      asteroidName,
      alertThreshold
    });

    res.status(201).json(watchItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await WatchedAsteroid.find({ userId: req.user._id });
    res.json(watchlist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};