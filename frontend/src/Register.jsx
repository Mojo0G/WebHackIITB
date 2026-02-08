import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { AlertTriangle, ArrowRight, User as UserIcon, Mail, KeyRound, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Validation
    if (!name || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      console.log('📝 Attempting registration with email:', email);
      await register(name, email, password);
      console.log('✅ Registration successful, redirecting...');
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('❌ Registration error:', err);
      
      let errorMsg = 'Registration failed';
      if (err.response?.status === 400) {
        errorMsg = err.response.data?.message || 'User already exists or invalid data';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        errorMsg = 'Network error - backend unreachable';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-magenta/20 rounded-full blur-[150px] -z-10"></div>
      
      {/* Glass Form Container */}
      <div className="bg-cosmic-glass backdrop-blur-2xl p-10 rounded-3xl border border-cosmic-border w-full max-w-md shadow-glass-lg relative overflow-hidden animate-float">
        
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-magenta via-neon-purple to-neon-cyan"></div>
        
        <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-neon-magenta/10 rounded-full border border-neon-magenta/50 shadow-glow-magenta">
                    <ShieldCheck size={32} className="text-neon-magenta" />
                </div>
            </div>
          <h2 className="text-4xl font-rajdhani font-bold text-white tracking-wider">GRANT CLEARANCE</h2>
          <p className="text-neon-magenta/80 mt-2 font-rajdhani tracking-wide">Join the Cosmic Watch Initiative</p>
        </div>
        
        {error && (
          <div className="bg-hazard-critical/20 text-hazard-critical p-4 rounded-xl mb-6 border border-hazard-critical/50 font-bold">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/20 text-green-400 p-4 rounded-xl mb-6 border border-green-500/50 font-bold text-center">
            ✅ {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-neon-magenta mb-2 text-xs font-bold uppercase tracking-widest font-rajdhani">Pilot Name</label>
            <div className="relative flex items-center">
                <UserIcon className="absolute left-4 text-gray-400 group-focus-within:text-neon-magenta transition" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 border border-cosmic-border p-4 pl-12 rounded-xl text-white placeholder-gray-500 focus:border-neon-magenta focus:bg-black/40 focus:shadow-glow-magenta outline-none transition-all font-inter"
                  placeholder="Cmdr. Shepard"
                  disabled={loading}
                />
            </div>
          </div>

          <div className="group">
            <label className="block text-neon-magenta mb-2 text-xs font-bold uppercase tracking-widest font-rajdhani">Cosmic ID (Email)</label>
            <div className="relative flex items-center">
                <Mail className="absolute left-4 text-gray-400 group-focus-within:text-neon-magenta transition" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-cosmic-border p-4 pl-12 rounded-xl text-white placeholder-gray-500 focus:border-neon-magenta focus:bg-black/40 focus:shadow-glow-magenta outline-none transition-all font-inter"
                  placeholder="pilot@cosmic.watch"
                  disabled={loading}
                />
            </div>
          </div>

          <div className="group">
             <label className="block text-neon-magenta mb-2 text-xs font-bold uppercase tracking-widest font-rajdhani">Access Key (6+ chars)</label>
             <div className="relative flex items-center">
                <KeyRound className="absolute left-4 text-gray-400 group-focus-within:text-neon-magenta transition" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-cosmic-border p-4 pl-12 rounded-xl text-white placeholder-gray-500 focus:border-neon-magenta focus:bg-black/40 focus:shadow-glow-magenta outline-none transition-all font-inter"
                  placeholder="••••••••"
                  disabled={loading}
                />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-neon-magenta to-neon-purple text-cosmic-950 font-bold font-rajdhani text-lg rounded-xl hover:shadow-glow-magenta transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 tracking-widest">
                 {loading ? 'INITIALIZING...' : 'GRANT CLEARANCE'}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm font-rajdhani tracking-wide">
            Already have clearance?{' '}
            <Link to="/login" className="text-neon-cyan hover:text-white hover:underline font-bold transition">
              Access Terminal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;