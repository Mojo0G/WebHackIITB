import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import API_BASE_URL from './api.config';
import { ArrowLeft, Activity, Ruler, Globe2, Crosshair, AlertTriangle } from 'lucide-react';
import EarthOrbit from './components/EarthOrbit';
import ChatSidebar from './components/ChatSidebar';

const AsteroidDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [asteroid, setAsteroid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/asteroids/feed`);
        const found = res.data.find(a => a.id === id);
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
      await axios.post(`${API_BASE_URL}/api/asteroids/watch`, {
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
          {/* 3D Container */}
          <EarthOrbit asteroidData={asteroid} />

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