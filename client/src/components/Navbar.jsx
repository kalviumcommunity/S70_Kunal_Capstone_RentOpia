import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-slate-950/80 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
          : 'bg-transparent border-transparent'
      } text-xs font-bold tracking-widest uppercase`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 text-white p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
               <Home size={22} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter group-hover:text-cyan-400 transition-colors">
              Rent<span className="text-cyan-400">Opia</span>
            </span>
          </Link>

          {/* Links */}
          <ul className="hidden md:flex items-center gap-8 text-gray-300">
            <li><Link to="/" className="hover:text-cyan-400 hover:glow-text-cyan transition-all">Home</Link></li>
            <li><Link to="/properties" className="hover:text-cyan-400 hover:glow-text-cyan transition-all">Explore Rentals</Link></li>
            {user && (
              <li><Link to="/dashboard" className="hover:text-purple-400 hover:glow-text-purple transition-all">Dashboard</Link></li>
            )}
            {user && user.role === 'admin' && (
              <li><Link to="/admin" className="text-red-400 hover:text-red-300 font-black uppercase tracking-tighter transition-all hover:glow-text-red border border-red-500/20 px-3 py-1 rounded-lg bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]">Registry</Link></li>
            )}
          </ul>

          {/* Auth Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                 <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    <User size={16}/> <span className="font-bold">{user.name || 'User'}</span>
                 </div>
                 <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-xl font-bold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                 >
                   <LogOut size={18}/> Logout
                 </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-cyan-400 font-bold px-4 py-2 transition-all hover:glow-text-cyan">Sign in</Link>
                <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all active:scale-95 border border-cyan-400/50">
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;