import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'renter' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration sequence aborted.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)] px-4 py-20 relative overflow-hidden transition-colors duration-500">
      {/* Background Orbs */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[var(--secondary)]/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[var(--primary)]/20 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="max-w-xl w-full glass rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.05)] p-10 md:p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] mb-6 border border-[var(--secondary)]/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <UserPlus size={36} className="pr-1"/>
          </div>
          <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tight">Construct Profile</h2>
          <p className="text-[var(--text-dim)] mt-2 font-light">Establish your presence in the network.</p>
        </div>

        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">{error}</motion.div>}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs uppercase tracking-widest font-bold text-[var(--text-dim)] mb-2 group-focus-within:text-[var(--secondary)] transition-colors">Designation</label>
                <input 
                  type="text" required
                  className="w-full px-5 py-4 bg-[var(--bg-deep)]/40 rounded-xl border border-[var(--border-alpha)] text-[var(--text-main)] placeholder-[var(--text-dim)]/40 focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] outline-none transition-all shadow-inner"
                  placeholder="Operator Name"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="group">
                <label className="block text-xs uppercase tracking-widest font-bold text-[var(--text-dim)] mb-2 group-focus-within:text-[var(--secondary)] transition-colors">Network ID</label>
                <input 
                  type="email" required
                  className="w-full px-5 py-4 bg-[var(--bg-deep)]/40 rounded-xl border border-[var(--border-alpha)] text-[var(--text-main)] placeholder-[var(--text-dim)]/40 focus:border-[var(--secondary)] focus:ring-1 focus:ring-[var(--secondary)] outline-none transition-all shadow-inner"
                  placeholder="you@grid.io"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
          </div>
          <div className="group">
            <label className="block text-xs uppercase tracking-widest font-bold text-[var(--text-dim)] mb-2 group-focus-within:text-[var(--primary)] transition-colors">Passphrase</label>
            <input 
              type="password" required
              className="w-full px-5 py-4 bg-[var(--bg-deep)]/40 rounded-xl border border-[var(--border-alpha)] text-[var(--text-main)] placeholder-[var(--text-dim)]/40 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none transition-all shadow-inner"
              placeholder="••••••••"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          
          <div className="pt-2">
            <label className="block text-xs uppercase tracking-widest font-bold text-[var(--text-dim)] mb-4 text-center">Select Operating Class</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'renter'})}
                className={`py-4 px-4 rounded-xl border font-black uppercase tracking-widest text-sm transition-all shadow-lg ${formData.role === 'renter' ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-[var(--border-alpha)] text-[var(--text-dim)] bg-[var(--bg-deep)]/40 hover:border-[var(--primary)]/30 hover:text-[var(--text-main)]'}`}
              >
                Renter
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, role: 'owner'})}
                className={`py-4 px-4 rounded-xl border font-black uppercase tracking-widest text-sm transition-all shadow-lg ${formData.role === 'owner' ? 'border-[var(--secondary)] bg-[var(--secondary)]/10 text-[var(--secondary)] shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-[var(--border-alpha)] text-[var(--text-dim)] bg-[var(--bg-deep)]/40 hover:border-[var(--secondary)]/30 hover:text-[var(--text-main)]'}`}
              >
                Owner
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-5 mt-6 bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] hover:brightness-110 text-white font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-[0.98] hover:scale-[1.02]"
          >
            Construct
          </button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-alpha)]"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="px-4 bg-transparent text-[var(--text-dim)] font-bold backdrop-blur-3xl">Or Construct via</span></div>
        </div>

        <button 
          onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/google`}
          className="w-full py-4 flex items-center justify-center gap-3 glass hover:bg-[var(--bg-card)] text-[var(--text-main)] font-bold rounded-xl transition-all hover:border-[var(--secondary)]/30 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Initialize via Google
        </button>

        <p className="mt-10 text-center text-[var(--text-dim)] text-sm">
          Link established already? <Link to="/login" className="text-[var(--secondary)] font-bold hover:brightness-110 hover:underline transition-all">Authenticate</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
