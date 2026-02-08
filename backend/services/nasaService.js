const axios = require('axios');
// REMOVED: const { mockAsteroids } = require('./mockData'); 

const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

let feedCache = {};
const CACHE_TTL = 3600 * 1000; // 1 Hour Cache

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

exports.fetchAsteroidFeed = async () => {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 5); // CHANGED: 7 days -> 5 days

  const endDate = formatDate(today);
  const startDate = formatDate(pastDate);
  
  const cacheKey = `${startDate}-${endDate}`;

  // 1. Check Cache (We keep this to prevent unnecessary API calls)
  if (feedCache[cacheKey] && (Date.now() - feedCache[cacheKey].timestamp < CACHE_TTL)) {
    console.log('✅ Serving from Cache (No API call needed)');
    return feedCache[cacheKey].data;
  }

  // 2. Fetch from NASA (NO FALLBACK)
  try {
    console.log(`🚀 Contacting NASA API...`);
    console.log(`📅 Date Range: ${startDate} to ${endDate}`);
    console.log(`🔑 Key Status: ${API_KEY === 'DEMO_KEY' ? 'USING DEMO_KEY (Low Limits)' : 'USING CUSTOM KEY'}`);
    
    const response = await axios.get(`${BASE_URL}/feed`, {
      params: { 
        start_date: startDate, 
        end_date: endDate, 
        api_key: API_KEY 
      }
    });

    console.log(`✅ NASA API Success! Found ${response.data.element_count} objects.`);

    // NASA returns an object with dates as keys. Flatten into one array.
    const asteroids = Object.values(response.data.near_earth_objects).flat();
    
    // Sort by Miss Distance (Closest first)
    asteroids.sort((a, b) => 
      parseFloat(a.close_approach_data[0].miss_distance.kilometers) - 
      parseFloat(b.close_approach_data[0].miss_distance.kilometers)
    );

    // Save to Cache
    feedCache[cacheKey] = { data: asteroids, timestamp: Date.now() };

    return asteroids;

  } catch (error) {
    // 3. DETAILED ERROR LOGGING
    console.error('❌ NASA API REQUEST FAILED');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(`⚠️ Status Code: ${error.response.status}`);
      console.error(`⚠️ Error Details:`, JSON.stringify(error.response.data, null, 2));

      if (error.response.status === 429) {
        console.error('🛑 REASON: RATE LIMIT EXCEEDED. You have made too many requests with the DEMO_KEY.');
        console.error('👉 FIX: Get a free API key at https://api.nasa.gov/ and put it in docker-compose.yml');
      }
      if (error.response.status === 403) {
        console.error('🛑 REASON: INVALID API KEY. Check your docker-compose.yml file.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('🛑 REASON: NETWORK ERROR. Could not reach api.nasa.gov. Check your internet connection.');
    } else {
      console.error('🛑 REASON:', error.message);
    }

    // Re-throw the error so the frontend sees the failure
    throw new Error('Failed to fetch NASA Data');
  }
};