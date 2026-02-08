const nasaService = require('./nasaService');
const emailService = require('./emailService');
const Notification = require('../models/Notification');

// --- SAFETY THRESHOLDS ---
const THRESHOLDS = {
  DISTANCE_KM: 5000000,    // Alert if closer than 5M km
  DIAMETER_M: 100,         // Alert if bigger than 100m
  VELOCITY_KPH: 50000      // Alert if faster than 50k km/h
};

// Keep track of alerts sent today so we don't spam
let alertCache = new Set();

const startSentinel = (io) => {
  console.log('👀 Sentinel AI Online: Monitoring deep space telemetry...');

  // Run scan every 60 seconds
  setInterval(async () => {
    try {
      const asteroids = await nasaService.fetchAsteroidFeed();

      asteroids.forEach(async (ast) => {
        // Prevent duplicate alerts
        if (alertCache.has(ast.id)) return;

        const distance = parseFloat(ast.close_approach_data[0].miss_distance.kilometers);
        const diameter = ast.estimated_diameter.meters.estimated_diameter_max;
        const velocity = parseFloat(ast.close_approach_data[0].relative_velocity.kilometers_per_hour);
        const isHazardous = ast.is_potentially_hazardous_asteroid;

        let alertReason = null;

        // CHECK 1: Is it officially Hazardous?
        if (isHazardous) alertReason = "OFFICIAL HAZARD CLASSIFICATION";
        
        // CHECK 2: Is it too close AND big?
        else if (distance < THRESHOLDS.DISTANCE_KM && diameter > THRESHOLDS.DIAMETER_M) {
          alertReason = `PROXIMITY WARNING (<${(distance/1000000).toFixed(1)}M km)`;
        }

        // CHECK 3: Is it extremely fast and close?
        else if (velocity > THRESHOLDS.VELOCITY_KPH && distance < THRESHOLDS.DISTANCE_KM) {
           alertReason = `HIGH VELOCITY APPROACH`;
        }

        // --- TRIGGER ALERT ---
        if (alertReason) {
          console.log(`🚨 THREAT DETECTED: ${ast.name} - ${alertReason}`);
          
          // 1. Save to DB
          const newNotif = await Notification.create({
             type: 'CRITICAL',
             message: `${ast.name}: ${alertReason}`,
             asteroidId: ast.id
          });

          // 2. Send Socket Event (Website Popup)
          io.emit('global_alert', newNotif);

          // 3. Send Email
          await emailService.sendAlertEmail(ast, alertReason);

          // Mark as handled
          alertCache.add(ast.id);
        }
      });

    } catch (err) {
      console.error('Sentinel Scan Error:', err.message);
    }
  }, 60000); // Check every 60s
};

module.exports = { startSentinel };