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

        <p className="mt-10 text-center text-gray-500 text-sm">
          No profile found in mainframe? <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-all">Initialize here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
