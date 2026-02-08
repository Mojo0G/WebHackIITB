import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import API_BASE_URL, { axiosInstance } from './api.config';
import { ArrowLeft, Activity, Ruler, Globe2, Crosshair, AlertTriangle, Circle } from 'lucide-react';
import EarthOrbit from './components/EarthOrbit';
import ChatSidebar from './components/ChatSidebar';

// Import asteroid images
import asteroid1 from '/asteroid1.svg';
import asteroid2 from '/asteroid2.svg';
import asteroid3 from '/asteroid3.svg';
import asteroid4 from '/asteroid4.svg';
import asteroid5 from '/asteroid5.svg';
import asteroid6 from '/asteroid6.svg';

const asteroidImages = [asteroid1, asteroid2, asteroid3, asteroid4, asteroid5, asteroid6];

const AsteroidDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [asteroid, setAsteroid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get('/api/asteroids/feed');
        const asteroidIndex = res.data.findIndex(a => a.id === id);
        const found = res.data[asteroidIndex];
        
        if (found) {
          // Add image based on asteroid index
          found.image = asteroidImages[asteroidIndex % 6];
        }
        
        setAsteroid(found);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
  }, [id]);

  const handleWatch = async () => {
    if (!token) { navigate('/login'); return; }
    try {
      await axiosInstance.post('/api/asteroids/watch', {
        asteroidId: asteroid.id,
        asteroidName: asteroid.name,
        alertThreshold: 5000000 
      });
      alert("PROTOCOL INITIATED: Sentinel is now tracking this object.");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "System Failure"));
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neon-cyan font-rajdhani text-xl animate-pulse tracking-widest">ESTABLISHING UPLINK...</div>;
  if (!asteroid) return <div className="min-h-screen flex items-center justify-center text-hazard-critical font-rajdhani text-xl">SIGNAL LOST: OBJECT NOT FOUND</div>;

  return (
    <div className="p-6 md:p-10 min-h-screen">
      {/* Back Nav */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-neon-cyan/70 hover:text-neon-cyan mb-8 transition font-rajdhani font-bold tracking-wide group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" /> RETURN TO GRID
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-8">
        {/* 3D Container + Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3D Visualization */}
            <EarthOrbit asteroidData={asteroid} />
            
            {/* Asteroid Image */}
            <div className="bg-cosmic-glass backdrop-blur-xl p-6 rounded-3xl border border-cosmic-border shadow-glass-lg relative overflow-hidden h-min">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-cyan/10 blur-[60px] rounded-full pointer-events-none"></div>
              
              <h3 className="text-sm font-rajdhani font-bold text-neon-cyan uppercase tracking-widest mb-4 relative z-10">Visual Representation</h3>
              
              <div className="relative z-10 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-black h-64 flex items-center justify-center border border-white/10">
                {asteroid.image ? (
                  <img 
                    src={asteroid.image}
                    alt={asteroid.name}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-500"
                  />
                ) : (
                  <Circle 
                    size={100} 
                    className="text-slate-600 opacity-60"
                    fill="currentColor"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="bg-cosmic-glass backdrop-blur-xl p-8 rounded-3xl border border-cosmic-border shadow-glass-lg relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start mb-8 relative z-10">
              <div>
                <h1 className="text-4xl font-rajdhani font-bold text-white mb-2 drop-shadow-md">{asteroid.name}</h1>
                <p className="text-neon-cyan/60 font-mono text-sm tracking-widest flex items-center gap-2">
                   <Crosshair size={14} /> ID: {asteroid.id}
                </p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Impact Probability</span>
                <span className={`text-4xl font-rajdhani font-bold ${asteroid.riskScore > 50 ? 'text-hazard-critical drop-shadow-glow-critical' : 'text-neon-cyan drop-shadow-glow-cyan'}`}>
                  {asteroid.riskScore}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Miss Distance', val: `${parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km`, icon: Globe2, color: 'text-neon-blue' },
                { label: 'Velocity', val: `${parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h`, icon: Activity, color: 'text-neon-magenta' },
                { label: 'Diameter', val: `${Math.round(asteroid.estimated_diameter.meters.estimated_diameter_max)} meters`, icon: Ruler, color: 'text-neon-cyan' },
                { label: 'Hazard Status', val: asteroid.is_potentially_hazardous_asteroid ? 'CONFIRMED' : 'NEGATIVE', icon: AlertTriangle, color: asteroid.is_potentially_hazardous_asteroid ? 'text-hazard-critical' : 'text-hazard-safe' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                  <div className={`mb-2 ${stat.color}`}><stat.icon size={20} /></div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-rajdhani">{stat.label}</p>
                  <p className="text-white font-bold font-inter text-sm">{stat.val}</p>
                </div>
              ))}
            </div>

            <button 
                onClick={handleWatch}
                className="mt-8 w-full py-4 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border border-neon-cyan/50 text-neon-cyan font-bold font-rajdhani text-lg rounded-2xl hover:bg-neon-cyan hover:text-black hover:shadow-glow-cyan transition-all tracking-widest uppercase relative overflow-hidden group"
            >
                <span className="relative z-10">Initiate Sentinel Tracking Protocol</span>
                <div className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="lg:col-span-1">
          <ChatSidebar asteroidId={id} />
        </div>

      </div>
    </div>
  );
};

export default AsteroidDetail;