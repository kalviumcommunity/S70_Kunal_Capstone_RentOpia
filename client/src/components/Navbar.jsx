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
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[#0B0F19]/80 backdrop-blur-xl border-cyan-500/20 shadow-[0_4px_30px_rgba(34,211,238,0.1)]' 
          : 'bg-transparent border-transparent'
      } text-sm font-medium`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-cyan-400 to-purple-500 text-[#0B0F19] p-2 rounded-xl group-hover:glow-cyan transition-all shadow-md">
               <Home size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tight glow-text-cyan group-hover:text-cyan-300 transition-all">
              RentOpia
            </span>
          </Link>

          {/* Links */}
          <ul className="hidden md:flex items-center gap-8 text-gray-300">
            <li><Link to="/" className="hover:text-cyan-400 hover:glow-text-cyan transition-all">Home</Link></li>
            <li><Link to="/properties" className="hover:text-cyan-400 hover:glow-text-cyan transition-all">Explore Rentals</Link></li>
            {user && (
              <li><Link to="/dashboard" className="hover:text-purple-400 hover:glow-text-purple transition-all">Dashboard</Link></li>
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