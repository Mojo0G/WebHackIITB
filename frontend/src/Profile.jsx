import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import API_BASE_URL from './api.config';
import { User, Shield, Activity, Trash2, Radar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/asteroids/watchlist`);
        setWatchlist(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load watchlist", err);
        setLoading(false);
      }
    };
    if (user) fetchWatchlist();
  }, [user]);

  // Remove Logic (Optional: requires backend endpoint DELETE /api/asteroids/watch/:id)
  const removeFromWatchlist = (id) => {
    // For MVP demo, we just filter it out locally to show UI interaction
    setWatchlist(watchlist.filter(item => item._id !== id));
    alert("Tracking stopped for object.");
  };

  if (!user) return <div className="p-10 text-center text-neon-cyan">Access Denied. Please Login.</div>;

  return (
    <div className="p-6 md:p-10 min-h-screen">
      
      {/* Page Header */}
      <h1 className="text-4xl font-rajdhani font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-white mb-8">
        COMMAND PROFILE
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-cosmic-glass backdrop-blur-xl border border-cosmic-border p-8 rounded-3xl shadow-glass-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-[60px] rounded-full -z-10"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-blue p-1 mb-4 shadow-glow-cyan">
                <div className="w-full h-full rounded-full bg-cosmic-900 flex items-center justify-center">
                  <User size={40} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-rajdhani font-bold text-white">{user.name}</h2>
              <p className="text-neon-cyan/70 font-mono text-sm">{user.email}</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs uppercase font-bold">Clearance Level</span>
                  <span className="text-neon-cyan font-bold font-rajdhani">ALPHA</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                   <span className="text-gray-400 text-xs uppercase font-bold">Active Tracks</span>
                   <span className="text-white font-bold">{watchlist.length}</span>
                </div>
              </div>

              <button 
                onClick={logout}
                className="mt-8 w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl font-rajdhani font-bold transition"
              >
                TERMINATE SESSION
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Watchlist */}
        <div className="lg:col-span-2">
          <div className="bg-cosmic-glass backdrop-blur-xl border border-cosmic-border rounded-3xl shadow-glass-lg overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-rajdhani font-bold text-white flex items-center gap-2">
                <Shield className="text-neon-cyan" size={20} /> ACTIVE WATCHLIST
              </h3>
              <span className="text-xs font-mono text-gray-400 animate-pulse">LIVE UPDATES ACTIVE</span>
            </div>

            <div className="p-6 overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="text-center text-neon-cyan animate-pulse">Loading Surveillance Data...</div>
              ) : watchlist.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed border-white/10 rounded-2xl">
                  <Radar size={48} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400 font-rajdhani">No objects currently under surveillance.</p>
                  <button onClick={() => navigate('/')} className="mt-4 text-neon-cyan hover:underline font-bold">Go to Dashboard</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {watchlist.map((item) => (
                    <div key={item._id} className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold shadow-glow-cyan">
                           <Activity size={18} />
                        </div>
                        <div>
                          <h4 className="font-rajdhani font-bold text-white text-lg">{item.asteroidName}</h4>
                          <p className="text-xs text-gray-400 font-mono">ID: {item.asteroidId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                           <p className="text-[10px] text-gray-500 uppercase font-bold">Alert Threshold</p>
                           <p className="text-neon-cyan font-bold font-mono">{(item.alertThreshold / 1000000).toFixed(1)}M km</p>
                        </div>
                        
                        <button 
                          onClick={() => removeFromWatchlist(item._id)}
                          className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition"
                          title="Stop Tracking"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
