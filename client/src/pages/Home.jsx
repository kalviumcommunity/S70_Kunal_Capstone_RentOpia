import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, MapPin, Repeat, Zap, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  // Framer Motion Variants
  const textVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };
  
  const cardContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex flex-col relative w-full overflow-hidden bg-slate-950 grid-bg">
      
      {/* Background Floating Orbs */}
      <div className="absolute top-0 w-full h-[150vh] overflow-hidden pointer-events-none z-0">
         <motion.div style={{ y: y1 }} className="absolute top-20 left-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl opacity-50 mix-blend-screen" />
         <motion.div style={{ y: y2 }} className="absolute top-80 right-20 w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-3xl opacity-40 mix-blend-screen" />
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden z-10 pt-20">
        <div className="absolute inset-0 bg-slate-950/80 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529733-0e670560f8e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-luminosity opacity-20 z-0" />
        
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={textVariant}
          className="relative z-20 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block px-5 py-2 bg-purple-500/10 border border-purple-500/30 backdrop-blur-md rounded-full text-purple-300 font-bold mb-8 text-sm uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
             The Neon Network
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tighter">
            Rent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 glow-text-cyan underline decoration-cyan-500/30 underline-offset-8">Anything.</span><br/>Anytime.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Jack into the grid. From hyper-cars and electronics to luxury apartments and tools. Everything is connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/properties" className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-300 rounded-xl font-bold text-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:bg-cyan-400/10 flex items-center justify-center gap-2 relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 -translate-x-[150%] skew-x-[-30deg] group-hover:block transition-all duration-700 ease-out group-hover:translate-x-[150%]"></span>
              <Search size={22}/> Browse Network
            </Link>
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-xl border border-white/10 font-bold text-lg transition-all shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2">
              <Zap size={22}/> Initialize Item
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Categories Section (Sliding in on scroll) */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative z-10 border-t border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textVariant}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">Mainframe <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Categories</span></h2>
          <p className="text-cyan-200/60 text-lg uppercase tracking-widest font-bold">Access the global inventory</p>
        </motion.div>
        
        <motion.div 
          variants={cardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8 p-4"
        >
          {/* Card 1 */}
          <motion.div variants={cardVariant} className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:-translate-y-4 transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] flex flex-col items-center text-center group cursor-pointer">
            <div className="bg-cyan-500/10 w-24 h-24 rounded-full flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-500 group-hover:glow-cyan">
              <MapPin size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Habitat</h3>
            <p className="text-gray-400 font-light">Secure apartments, mega-buildings, and commercial hubs globally.</p>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div variants={cardVariant} className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-purple-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:-translate-y-4 transition-all duration-500 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col items-center text-center group cursor-pointer">
             <div className="bg-purple-500/10 w-24 h-24 rounded-full flex items-center justify-center text-purple-400 mb-8 border border-purple-500/30 group-hover:scale-110 transition-transform duration-500 group-hover:glow-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9a2 2 0 0 0-2 2v6h2M6 16a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Transport</h3>
            <p className="text-gray-400 font-light">Rent hover-cars, bikes, and trucks per cycle directly from independent owners.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={cardVariant} className="bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-pink-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:-translate-y-4 transition-all duration-500 hover:border-pink-400/60 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] flex flex-col items-center text-center group cursor-pointer">
             <div className="bg-pink-500/10 w-24 h-24 rounded-full flex items-center justify-center text-pink-400 mb-8 border border-pink-500/30 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <Package size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Hardware</h3>
            <p className="text-gray-400 font-light">From cybernetic electronics to heavy construction machinery.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Scroll-triggered Parallax CTA */}
      <section className="relative py-32 px-4 overflow-hidden border-t border-cyan-900/30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-bl from-purple-900/40 to-cyan-900/40 backdrop-blur-3xl border border-cyan-500/30 rounded-[3rem] p-16 text-center shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden flex flex-col items-center text-center"
        >
           <ShieldCheck className="text-cyan-500/20 absolute -bottom-10 -left-10 w-64 h-64" />
           <Repeat className="text-purple-500/20 absolute -top-10 -right-10 w-64 h-64" />
           
           <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">Monetize Your <span className="text-cyan-400 glow-text-cyan">Inventory</span></h2>
           <p className="text-gray-300 text-xl font-light mb-10 relative z-10 max-w-2xl">Join the decentralized node of owners maximizing the credit value of their unused assets securely and seamlessly.</p>
           
           <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black py-4 px-12 rounded-2xl text-xl shadow-[0_0_40px_rgba(34,211,238,0.2)] relative z-10 hover:scale-105 transition-all outline outline-1 outline-cyan-400/30">
             Initialize Profile sequence
           </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
