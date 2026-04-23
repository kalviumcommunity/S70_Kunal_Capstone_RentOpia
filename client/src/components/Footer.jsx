import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-deep)] text-[var(--text-dim)] py-16 border-t border-[var(--border-alpha)] shadow-[0_-10px_30px_rgba(34,211,238,0.05)] relative overflow-hidden transition-colors duration-500">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[50px] bg-[var(--primary)]/10 blur-[50px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2 space-y-4">
           <Link to="/" className="flex items-center gap-2 group mb-4 inline-flex">
            <div className="bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] text-black p-1.5 rounded-lg transition-all">
               <Home size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] tracking-tight hover:brightness-110 transition-all">
              RentOpia
            </span>
          </Link>
          <p className="text-[var(--text-dim)] max-w-sm font-light">
            Empowering operators and nodes with a cyber-secure, decentralized, and seamless access grid. 
          </p>
        </div>

        {/* Links */}
        <div>
           <h4 className="text-[var(--primary)] font-bold mb-4 uppercase tracking-[0.2em] text-xs">Access Points</h4>
           <ul className="space-y-3">
             <li><Link to="/properties" className="hover:text-[var(--primary)] transition-colors text-[var(--text-dim)] font-light">Search Grid</Link></li>
             <li><Link to="/dashboard" className="hover:text-[var(--secondary)] transition-colors text-[var(--text-dim)] font-light">Mainframe</Link></li>
             <li><Link to="/login" className="hover:text-[var(--primary)] transition-colors text-[var(--text-dim)] font-light">Authenticate</Link></li>
           </ul>
        </div>

        {/* Contact */}
        <div>
           <h4 className="text-[var(--secondary)] font-bold mb-4 uppercase tracking-[0.2em] text-xs">Uplink</h4>
           <ul className="space-y-3 text-sm font-light text-[var(--text-dim)]">
             <li className="hover:text-[var(--secondary)] transition-colors cursor-pointer">Comms: link@rentopia.net</li>
             <li className="hover:text-[var(--secondary)] transition-colors cursor-pointer">Protocol: 1-800-SYNTH-NET</li>
             <li className="pt-6 text-xs text-gray-600 font-mono tracking-widest">© {new Date().getFullYear()} RENTOPIA CORP.</li>
           </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;