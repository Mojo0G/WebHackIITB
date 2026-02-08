import React, { useEffect, useState, useRef } from 'react';
import AsteroidCard from './components/AsteroidCard';
import API_BASE_URL, { axiosInstance } from './api.config';
import { SlidersHorizontal, Radar, AlertTriangle, X, Check } from 'lucide-react';

// Import asteroid images
import asteroid1 from '/asteroid1.svg';
import asteroid2 from '/asteroid2.svg';
import asteroid3 from '/asteroid3.svg';
import asteroid4 from '/asteroid4.svg';
import asteroid5 from '/asteroid5.svg';
import asteroid6 from '/asteroid6.svg';

const asteroidImages = [asteroid1, asteroid2, asteroid3, asteroid4, asteroid5, asteroid6];

const Dashboard = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- FILTER STATES ---
  const [category, setCategory] = useState('ALL'); // ALL, HAZARDOUS
  const [showFilters, setShowFilters] = useState(false); // Toggle Panel
  const [filters, setFilters] = useState({
    minDia: 0,
    maxDia: 2000, // Default max 2km
    minRisk: 0,
    maxRisk: 100
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🌍 Frontend API Configuration:');
        console.log('  API_BASE_URL:', API_BASE_URL);
        console.log('  Full URL:', `${API_BASE_URL}/api/asteroids/feed`);
        console.log('  Attempting to fetch asteroid data...');
        
        const res = await axiosInstance.get('/api/asteroids/feed');
        console.log('✅ Asteroids fetched:', res.data.length, 'asteroids');
        console.log('Sample asteroid:', res.data[0]);
        setAsteroids(res.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ API Error Details:');
        console.error('  Error Message:', err.message);
        console.error('  Error Code:', err.code);
        console.error('  Status Code:', err.response?.status);
        console.error('  Status Text:', err.response?.statusText);
        console.error('  Response Data:', err.response?.data);
        console.error('  Response Headers:', err.response?.headers);
        console.error('  Request URL:', err.config?.url);
        console.error('  Full Error:', err);
        
        setError('Unable to establish Deep Space Network uplink. Switching to local cache.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- ADVANCED FILTER LOGIC ---
  const filteredAsteroids = asteroids.filter(ast => {
    // 1. Category Check
    if (category === 'CRITICAL' && ast.riskScore < 80) return false;
    if (category === 'HAZARDOUS' && (ast.riskScore < 50 || ast.riskScore >= 80)) return false;

    // 2. Diameter Check (safely handle missing data)
    let avgDiameter = 0;
    if (ast.estimated_diameter?.meters?.estimated_diameter_min && ast.estimated_diameter?.meters?.estimated_diameter_max) {
      avgDiameter = (ast.estimated_diameter.meters.estimated_diameter_min + ast.estimated_diameter.meters.estimated_diameter_max) / 2;
    }
    if (avgDiameter < filters.minDia || avgDiameter > filters.maxDia) return false;

    // 3. Risk Score Check
    if (ast.riskScore < filters.minRisk || ast.riskScore > filters.maxRisk) return false;

    return true;
  });

  // Reset Filters Helper
  const resetFilters = () => {
    setFilters({ minDia: 0, maxDia: 2000, minRisk: 0, maxRisk: 100 });
    setCategory('ALL');
  };

  return (
    <div className="p-6 py-10 min-h-screen relative" onClick={() => showFilters && setShowFilters(false)}> 
      
      {/* Header Section */}
      <div className="relative flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[128px] -z-10 pointer-events-none"></div>
        
        <div>
          <div className="flex items-center gap-2 text-neon-cyan mb-2 animate-pulse-slow">
              <Radar size={18} />
              <span className="text-xs font-bold tracking-widest uppercase font-rajdhani">Live Surveillance Feed</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-rajdhani font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-cyan to-neon-purple drop-shadow-md uppercase leading-tight">
            Near-Earth<br/>Objects
          </h1>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="relative z-50">
          <div className="flex items-center gap-1 bg-cosmic-glass backdrop-blur-xl p-1.5 rounded-2xl border border-cosmic-border shadow-glass-sm" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setCategory('ALL')}
              className={`px-6 py-2.5 rounded-xl font-rajdhani font-bold tracking-wider text-sm transition-all duration-300 ${category === 'ALL' ? 'bg-neon-cyan text-cosmic-950 shadow-glow-cyan' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >ALL SECTORS</button>
            <button 
              onClick={() => setCategory('HAZARDOUS')}
              className={`px-6 py-2.5 rounded-xl font-rajdhani font-bold tracking-wider text-sm transition-all duration-300 ${category === 'HAZARDOUS' ? 'bg-gradient-to-r from-hazard-medium to-hazard-critical text-white shadow-glow-critical' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >THREATS ONLY</button>
            
            <div className="w-[1px] h-8 bg-white/10 mx-2"></div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl transition ${showFilters ? 'bg-neon-purple text-white shadow-glow-purple' : 'text-neon-cyan hover:text-white hover:bg-white/10'}`}
            >
              {showFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
            </button>
          </div>

          {/* --- POPUP FILTER PANEL --- */}
          {showFilters && (
            <div className="absolute top-full right-0 mt-4 w-80 bg-cosmic-900/95 backdrop-blur-2xl border border-cosmic-border rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-2 z-50" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h3 className="text-white font-rajdhani font-bold tracking-wider flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-neon-purple" /> PARAMETERS
                  </h3>
                  <button onClick={resetFilters} className="text-[10px] text-gray-400 hover:text-neon-cyan underline font-mono">RESET</button>
               </div>

               {/* Diameter Slider */}
               <div className="mb-6">
                 <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-gray-400">DIAMETER</span>
                   <span className="text-neon-cyan">{filters.minDia}m - {filters.maxDia}m</span>
                 </div>
                 <input 
                   type="range" min="0" max="2000" step="50"
                   value={filters.maxDia}
                   onChange={(e) => setFilters({...filters, maxDia: Number(e.target.value)})}
                   className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:accent-neon-purple"
                 />
                 <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                   <span>0m</span>
                   <span>2km+</span>
                 </div>
               </div>

               {/* Risk Slider */}
               <div className="mb-6">
                 <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-gray-400">RISK INDEX</span>
                   <span className="text-hazard-critical">{filters.minRisk}% - {filters.maxRisk}%</span>
                 </div>
                 <input 
                   type="range" min="0" max="100" 
                   value={filters.minRisk}
                   onChange={(e) => setFilters({...filters, minRisk: Number(e.target.value)})}
                   className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-hazard-critical"
                 />
                 <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                   <span>Safe</span>
                   <span>Critical</span>
                 </div>
               </div>

               <button 
                 onClick={() => setShowFilters(false)}
                 className="w-full py-3 bg-white/5 hover:bg-neon-cyan hover:text-black border border-white/10 rounded-xl font-rajdhani font-bold text-sm transition-all flex items-center justify-center gap-2"
               >
                 <Check size={16} /> APPLY FILTERS
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-8">
           <div className="relative">
             <div className="w-24 h-24 border-t-4 border-b-4 border-neon-cyan rounded-full animate-spin"></div>
             <div className="absolute inset-0 w-24 h-24 border-r-4 border-l-4 border-neon-magenta rounded-full animate-spin-slow opacity-50"></div>
           </div>
           <p className="text-neon-cyan font-rajdhani text-xl tracking-[0.2em] animate-pulse">CALIBRATING SENSORS...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-hazard-critical/50 rounded-3xl bg-hazard-critical/5">
          <AlertTriangle size={48} className="text-hazard-critical mb-4" />
          <div className="text-hazard-critical font-rajdhani text-xl">{error}</div>
          <p className="text-gray-400 text-sm mt-2">Please check:</p>
          <ul className="text-gray-400 text-xs mt-1 space-y-1">
            <li>• NASA_API_KEY environment variable is set in Render</li>
            <li>• Backend service is running</li>
            <li>• Network connection is working</li>
          </ul>
        </div>
      ) : asteroids.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
          <Radar size={48} className="text-gray-600 mb-4" />
          <div className="text-gray-400 font-rajdhani text-xl">NO ASTEROID DATA RECEIVED</div>
          <p className="text-gray-400 text-sm mt-2">Ensure NASA API key is configured on the backend</p>
        </div>
      ) : filteredAsteroids.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
          <Radar size={48} className="text-gray-600 mb-4" />
          <div className="text-gray-400 font-rajdhani text-xl">NO OBJECTS MATCH FILTERS</div>
          <button onClick={resetFilters} className="mt-4 text-neon-cyan font-bold hover:underline">Reset Sensors</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAsteroids.map((ast, index) => (
            <AsteroidCard 
                key={ast.id} 
                asteroid={{
                    ...ast, 
                    image: asteroidImages[index % 6]
                }} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;