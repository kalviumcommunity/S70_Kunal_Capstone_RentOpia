import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, MapPin, ChevronRight as ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import SkeletonLoader from '../components/SkeletonLoader';

const Properties = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const categories = ['Real Estate', 'Vehicles', 'Furniture', 'Electronics', 'Utensils', 'Tools', 'Other'];

  // React Query for data fetching & caching
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['listings', category, page, search],
    queryFn: async () => {
      const res = await axios.get(`/listings`, {
        params: { search, category, page, limit: 6 }
      });
      return res.data;
    },
    keepPreviousData: true, // Replaced by placeholderData in v5, but for v4 it's keepPreviousData
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filter Bar */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Explore The <span className="text-cyan-400 glow-text-cyan">Grid</span></h1>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Interface: Accessing Global Assets</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search modules..." 
                className="bg-black/40 border border-white/5 text-white pl-10 pr-4 py-2.5 rounded-xl focus:border-cyan-400 outline-none w-64 transition-all"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select 
              className="bg-black/40 border border-white/5 text-white px-4 py-2.5 rounded-xl focus:border-purple-400 outline-none cursor-pointer appearance-none min-w-[150px]"
              value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] min-w-[100px]">
              Query
            </button>
          </form>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
            <SkeletonLoader count={6} />
        ) : isError ? (
            <div className="text-center py-20 text-red-500 font-mono">CONNECTION ERROR: ACCESS DENIED.</div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {data?.listings.length === 0 && (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-gray-500 font-mono tracking-widest text-lg">NO MATCHING DATA PACKETS FOUND.</p>
                </div>
              )}
              
              {data?.listings.map((item, index) => (
                <motion.div
                  key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }} whileHover={{ y: -8 }}
                  className="group bg-[#111827]/60 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all shadow-xl"
                >
                  <Link to={`/properties/${item._id}`}>
                    <div className="relative h-64 overflow-hidden">
                       <img 
                        src={item.images?.[0] || 'https://via.placeholder.com/800'} 
                        alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/20 text-cyan-400 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{item.category}</div>
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#111827] to-transparent"></div>
                    </div>

                    <div className="p-6 relative">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-2">{item.title}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 uppercase tracking-wider font-mono">
                        <MapPin size={12} className="text-cyan-500/50" /> {item.location || 'Global Sector'}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                         <div>
                            <span className="text-[10px] uppercase text-gray-400 block mb-1">Access Credit</span>
                            <div className="text-xl font-black text-white">${item.price}<span className="text-sm font-normal text-gray-500">{item.pricingBasis}</span></div>
                         </div>
                         <div className="bg-cyan-500/10 text-cyan-400 p-3 rounded-2xl group-hover:bg-cyan-500 group-hover:text-black transition-all">
                            <ArrowRight size={20} />
                         </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {data?.pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-3">
                <button 
                  disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {[...Array(data.pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1} onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-bold transition-all border ${
                        page === i + 1 
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                          : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={page === data.pagination.pages} onClick={() => setPage(p => p + 1)}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-20 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
