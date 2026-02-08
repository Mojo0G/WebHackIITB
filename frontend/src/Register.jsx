import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/'); // Redirect to Dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center p-4">
      <div className="bg-space-800 p-8 rounded-xl border border-space-700 w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-cyan to-purple-600"></div>

        <h2 className="text-3xl font-orbitron text-white text-center mb-2">NEW RECRUIT</h2>
        <p className="text-gray-400 text-center mb-6 text-sm">Join the Cosmic Watch Initiative</p>
        
        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-brand-cyan mb-1 text-xs font-bold uppercase tracking-wider">Pilot Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-space-900 border border-space-700 p-3 rounded text-white focus:border-brand-cyan outline-none transition"
              placeholder="Cmdr. Shepard"
            />
          </div>

          <div>
            <label className="block text-brand-cyan mb-1 text-xs font-bold uppercase tracking-wider">Cosmic ID (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-space-900 border border-space-700 p-3 rounded text-white focus:border-brand-cyan outline-none transition"
              placeholder="pilot@cosmic.watch"
            />
          </div>

          <div>
            <label className="block text-brand-cyan mb-1 text-xs font-bold uppercase tracking-wider">Access Key</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-space-900 border border-space-700 p-3 rounded text-white focus:border-brand-cyan outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-3 mt-4 bg-brand-cyan text-black font-bold font-orbitron rounded hover:bg-brand-cyan/80 transition disabled:opacity-50"
          >
            {loading ? 'INITIALIZING...' : 'GRANT CLEARANCE'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have clearance?{' '}
            <Link to="/login" className="text-brand-cyan hover:underline font-bold">
              Access Terminal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;