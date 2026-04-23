import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication sequence failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4 relative overflow-hidden">
      {/* Animated Orbs */}
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 50, ease: 'linear' }} className="absolute -top-40 -left-40 w-96 h-96 border-[1px] border-cyan-500/30 rounded-full border-dashed opacity-50"></motion.div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 20 }}
        className="max-w-md w-full bg-white/5 backdrop-blur-3xl rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.1)] p-10 border border-white/10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 text-cyan-400 mb-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <LogIn size={36} className="ml-1"/>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">Access Link</h2>
          <p className="text-gray-400 mt-2 font-light">Input terminal credentials to proceed.</p>
        </div>

        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm shadow-[0_0_10px_rgba(239,68,68,0.2)]">{error}</motion.div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="group">
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-cyan-400 transition-colors">Digital Identity</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 bg-black/40 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all shadow-inner"
              placeholder="operator@network.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="group">
            <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 group-focus-within:text-purple-400 transition-colors">Security Code</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-black/40 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all shadow-inner"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all active:scale-[0.98] hover:scale-[1.02]"
          >
            Authenticate
          </button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="px-4 bg-transparent text-gray-500 font-bold backdrop-blur-3xl">Or Link via</span></div>
        </div>

        <button 
          onClick={() => window.location.href = 'http://localhost:5000/api/google'}
          className="w-full py-4 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all hover:border-cyan-400/30 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Direct Uplink via Google
        </button>

        <p className="mt-10 text-center text-gray-500 text-sm">
          No profile found in mainframe? <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-all">Initialize here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
