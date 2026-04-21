import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Filter, ArrowRight, Tags } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Properties = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', location: '', maxPrice: '', category: '' });

  const fetchListings = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.category) queryParams.append('category', filters.category);

      const res = await axios.get(`/listings?${queryParams.toString()}`);
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity:0, x: -50 }} animate={{ opacity:1, x:0 }}
          className="text-5xl font-extrabold text-white mb-8 tracking-tighter"
        >
          Explore <span className="text-cyan-400 glow-text-cyan">Rentals</span>
        </motion.h1>
        
        {/* Filter Bar */}
        <motion.div 
          initial={{ opacity:0, y: 20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-12 border border-white/10"
        >
          <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-3.5 text-cyan-400/60 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input type="text" placeholder="Search parameters..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all" />
            </div>
            
            <div className="flex-1 relative group">
               <Tags className="absolute left-4 top-3.5 text-purple-400/60 group-focus-within:text-purple-400 transition-colors" size={20} />
               <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition-all appearance-none cursor-pointer">
                  <option value="" className="bg-gray-900">Global Directive (All)</option>
                  <option value="Real Estate" className="bg-gray-900">Habitat</option>
                  <option value="Vehicles" className="bg-gray-900">Transport</option>
                  <option value="Furniture" className="bg-gray-900">Furniture</option>
                  <option value="Electronics" className="bg-gray-900">Electronics</option>
                  <option value="Utensils" className="bg-gray-900">Utensils</option>
                  <option value="Tools" className="bg-gray-900">Tools</option>
                  <option value="Other" className="bg-gray-900">Other</option>
               </select>
            </div>

            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-3.5 text-cyan-400/60 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <input type="text" placeholder="Coordinates..." value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all" />
            </div>
            
            <button type="submit" className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-extrabold px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
               <Filter size={20} /> Initialize
            </button>
          </form>
        </motion.div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div></div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {listings.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500 text-lg border border-dashed border-white/10 rounded-2xl">
                No signals found matching your parameters.
              </div>
            ) : (
              <AnimatePresence>
                {listings.map(item => (
                  <motion.div 
                    key={item._id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-[#111827]/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col group relative hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-colors"
                  >
                    <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                       {item.category}
                    </div>
                    <div className="relative h-64 overflow-hidden bg-black/50">
                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-700 mix-blend-luminosity hover:mix-blend-normal" />
                      <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/30">
                        ${item.price}<span className="text-sm font-normal text-purple-200">{item.pricingBasis}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col relative z-20 bg-gradient-to-t from-[#0B0F19] to-transparent">
                      {item.location && (
                         <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
                           <MapPin size={14} className="text-cyan-500"/> {item.location}
                         </div>
                      )}
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{item.title}</h3>
                      <p className="text-gray-400 mb-6 flex-grow line-clamp-2 font-light text-sm">{item.description}</p>
                      
                      <Link to={`/properties/${item._id}`} className="mt-auto px-6 py-3 bg-white/5 hover:bg-cyan-500/10 text-cyan-400 border border-white/10 hover:border-cyan-500/30 font-bold rounded-xl flex items-center justify-between transition-all group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        Access Data <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Properties;
