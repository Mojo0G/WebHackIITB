import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { KeyRound, Mail, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('🔐 Attempting login with email:', email);
      await login(email, password);
      console.log('✅ Login successful, redirecting...');
      navigate('/');
    } catch (err) {
      console.error('❌ Login error:', err);
      
      let errorMsg = 'Authentication failed';
      if (err.response?.status === 401) {
        errorMsg = 'Invalid email or password';
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[150px] -z-10"></div>
      
      {/* Glass Form Container */}
      <div className="bg-cosmic-glass backdrop-blur-2xl p-10 rounded-3xl border border-cosmic-border w-full max-w-md shadow-glass-lg relative overflow-hidden animate-float">
        
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple"></div>
        
        <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-neon-cyan/10 rounded-full border border-neon-cyan/50 shadow-glow-cyan">
                    <ShieldCheck size={32} className="text-neon-cyan" />
                </div>
            </div>
          <h2 className="text-4xl font-rajdhani font-bold text-white tracking-wider">IDENTITY VERIFICATION</h2>
          <p className="text-neon-blue/80 mt-2 font-rajdhani tracking-wide">Enter secure credentials to proceed.</p>
        </div>
        
        {error && (
          <div className="bg-hazard-critical/20 text-hazard-critical p-4 rounded-xl mb-6 border border-hazard-critical/50 font-bold">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 text-sm bg-hazard-critical/30 hover:bg-hazard-critical/50 px-3 py-2 rounded-lg transition w-full justify-center font-semibold"
            >
              Create Account Instead
              <ArrowRight size={16} />
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-neon-cyan mb-2 text-xs font-bold uppercase tracking-widest font-rajdhani">Cosmic ID</label>
            <div className="relative flex items-center">
                <Mail className="absolute left-4 text-gray-400 group-focus-within:text-neon-cyan transition" size={18} />
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-cosmic-border p-4 pl-12 rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:bg-black/40 focus:shadow-glow-cyan outline-none transition-all font-inter"
                placeholder="pilot@cosmic.watch"
                />
            </div>
          </div>

          <div className="group">
             <label className="block text-neon-cyan mb-2 text-xs font-bold uppercase tracking-widest font-rajdhani">Access Key</label>
             <div className="relative flex items-center">
                <KeyRound className="absolute left-4 text-gray-400 group-focus-within:text-neon-cyan transition" size={18} />
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-cosmic-border p-4 pl-12 rounded-xl text-white placeholder-gray-500 focus:border-neon-cyan focus:bg-black/40 focus:shadow-glow-cyan outline-none transition-all font-inter"
                placeholder="••••••••"
                />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-cosmic-950 font-bold font-rajdhani text-lg rounded-xl hover:shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative relative z-10 tracking-widest">
                 {loading ? 'AUTHENTICATING...' : 'INITIATE UPLINK'}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm font-rajdhani tracking-wide">
            New to the initiative?{' '}
            <Link to="/register" className="text-neon-magenta hover:text-white hover:underline font-bold transition">
              Register Clearance
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;