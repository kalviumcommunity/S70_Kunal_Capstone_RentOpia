import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, DollarSign, ArrowLeft, CheckCircle, Calendar, Package, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`/listings/${id}`);
                setItem(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="min-h-screen pt-28 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div></div>;
    if (!item) return <div className="text-center pt-40 min-h-screen text-2xl font-bold text-gray-400">Object Not Found in DB.</div>;

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-20 left-0 w-full h-[50vh] bg-purple-900/10 blur-[100px] pointer-events-none"></div>

            {/* Image Header */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                className="w-full h-[60vh] relative border-b border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1555529733-0e670560f8e1?auto=format&fit=crop&w=1600&q=80'} alt={item.title} className="w-full h-full object-cover mix-blend-luminosity opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-10">
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Link to="/properties" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 mb-6 font-medium transition-colors hover:glow-text-cyan w-fit">
                            <ArrowLeft size={20} /> Abort to Grid
                        </Link>
                        <div className="inline-block border border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-4 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                           {item.category}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2 leading-tight tracking-tighter drop-shadow-2xl">{item.title}</h1>
                        {item.location && <p className="text-xl text-gray-400 flex items-center gap-2 mt-4"><MapPin size={22} className="text-cyan-500"/> {item.location}</p>}
                    </motion.div>
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur-xl border border-cyan-500/30 px-10 py-6 rounded-3xl shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col items-center justify-center min-w-[200px]">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Cycle Rate</span>
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center drop-shadow-lg"><DollarSign size={32} className="text-cyan-400"/>{item.price}<span className="text-xl font-normal text-gray-500 ml-1">{item.pricingBasis}</span></span>
                    </motion.div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-20">
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#111827]/60 backdrop-blur-md p-10 rounded-[2rem] border border-white/5 shadow-xl">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-white"><Package className="text-purple-500"/> Data Log</h2>
                        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-light">{item.description}</p>
                    </motion.div>

                    {/* Features */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#111827]/60 backdrop-blur-md p-10 rounded-[2rem] border border-white/5 shadow-xl">
                        <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3"><Zap className="text-cyan-500"/> Specs</h2>
                        {item.features?.length > 0 ? (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {item.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-gray-300 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                                        <CheckCircle className="text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full" size={20}/> {feature}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic p-6 bg-black/40 border border-white/5 rounded-2xl text-center">No structural specs declared.</p>
                        )}
                    </motion.div>
                </div>

                {/* Sidebar */}
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="space-y-6">
                    <div className="bg-gradient-to-b from-[#111827]/90 to-[#0B0F19] p-8 rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-purple-500/20 sticky top-28">
                        <h3 className="text-2xl font-bold mb-8 text-center text-white">Initiate Handshake</h3>
                        
                        <div className="flex bg-black/50 p-4 rounded-xl items-center gap-5 mb-8 border border-white/5">
                             <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 text-[#0B0F19] rounded-xl flex items-center justify-center font-bold text-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                 {item.owner?.name ? item.owner.name.charAt(0).toUpperCase() : 'O'}
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Listed by Node</p>
                                 <p className="font-extrabold text-gray-200 text-lg">{item.owner?.name || 'Verified Owner'}</p>
                             </div>
                        </div>

                        <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-wider">
                             <Calendar size={22}/> Request Sync
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-6 leading-relaxed">Encrypted transaction sequence. No credits extracted until confirmation.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PropertyDetails;
