import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Satellite, LogOut, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-cosmic-glass backdrop-blur-xl border-b border-cosmic-border shadow-glass-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
            <Satellite className="relative text-neon-cyan group-hover:rotate-12 transition duration-500" size={28} />
          </div>
          <h1 className="font-rajdhani font-bold text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-neon-cyan">
            COSMIC WATCH
          </h1>
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Profile Link */}
              <Link to="/profile" className="hidden md:flex items-center gap-2 pl-4 border-l border-cosmic-border group">
                <UserCircle className="text-neon-purple group-hover:text-neon-cyan transition" size={24} />
                <div className="flex flex-col">
                  <span className="font-rajdhani font-bold text-sm tracking-wide text-white group-hover:text-neon-cyan transition">{user.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">CMD ACCESS GRANTED</span>
                </div>
              </Link>
              
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-rajdhani font-bold text-neon-magenta border border-neon-magenta/30 rounded-lg hover:bg-neon-magenta/10 hover:shadow-glow-magenta transition-all"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">DECOUPLE</span>
              </button>
            </>
          ) : (
             <Link to="/login" className="px-6 py-2 text-sm font-rajdhani font-bold bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/50 text-neon-cyan rounded-lg hover:shadow-glow-cyan transition-all">
               IDENTIFY
             </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;