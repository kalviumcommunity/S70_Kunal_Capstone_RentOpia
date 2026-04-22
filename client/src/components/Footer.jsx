import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0B0F19] text-gray-300 py-16 border-t border-cyan-500/20 shadow-[0_-10px_30px_rgba(34,211,238,0.05)] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[50px] bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2 space-y-4">
           <Link to="/" className="flex items-center gap-2 group mb-4 inline-flex">
            <div className="bg-gradient-to-br from-purple-500 to-cyan-500 text-black p-1.5 rounded-lg group-hover:glow-cyan transition-all">
               <Home size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tight glow-text-cyan hover:text-cyan-300 transition-colors">
              RentOpia
            </span>
          </Link>
          <p className="text-gray-400 max-w-sm font-light">
            Empowering operators and nodes with a cyber-secure, decentralized, and seamless access grid. 
          </p>
        </div>

        {/* Links */}
        <div>
           <h4 className="text-cyan-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">Access Points</h4>
           <ul className="space-y-3">
             <li><Link to="/properties" className="hover:text-cyan-300 transition-colors text-gray-400 font-light hover:glow-text-cyan">Search Grid</Link></li>
             <li><Link to="/dashboard" className="hover:text-purple-300 transition-colors text-gray-400 font-light hover:glow-text-purple">Mainframe</Link></li>
             <li><Link to="/login" className="hover:text-cyan-300 transition-colors text-gray-400 font-light hover:glow-text-cyan">Authenticate</Link></li>
           </ul>
        </div>

        {/* Contact */}
        <div>
           <h4 className="text-purple-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">Uplink</h4>
           <ul className="space-y-3 text-sm font-light text-gray-400">
             <li className="hover:text-purple-300 transition-colors cursor-pointer">Comms: link@rentopia.net</li>
             <li className="hover:text-purple-300 transition-colors cursor-pointer">Protocol: 1-800-SYNTH-NET</li>
             <li className="pt-6 text-xs text-gray-600 font-mono tracking-widest">© {new Date().getFullYear()} RENTOPIA CORP.</li>
           </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;