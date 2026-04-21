import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, loading } = useContext(AuthContext);
    const [myListings, setMyListings] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);

    // Form state for adding a listing
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '', description: '', price: '', pricingBasis: '/day', location: '', category: 'Vehicles' 
    });

    useEffect(() => {
        if (user?.role === 'owner') {
            fetchMyListings();
        }
    }, [user]);

    const fetchMyListings = async () => {
        setFetchLoading(true);
        try {
            const res = await axios.get('/listings');
            const mine = res.data.filter(p => typeof p.owner === 'object' ? p.owner._id === user.id : p.owner === user.id);
            setMyListings(mine);
        } catch (err) {
            console.error(err);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const numPrice = Number(formData.price) || 0;
            await axios.post('/listings', { ...formData, price: numPrice });
            setShowAddForm(false);
            setFormData({ title: '', description: '', price: '', pricingBasis: '/day', location: '', category: 'Vehicles' });
            fetchMyListings();
        } catch (err) {
            console.error(err);
            alert("Failed to add listing");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('WARNING: Deleting module. Are you sure?')) {
            try {
                await axios.delete(`/listings/${id}`);
                fetchMyListings();
            } catch(e) { console.error(e); }
        }
    }

    if (loading) return null;

    if (!user) {
        return <div className="text-center pt-32 text-xl font-bold font-mono text-cyan-400">UNAUTHORIZED ACCESS. PLEASE AUTHENTICATE.</div>;
    }

    return (
        <div className="min-h-screen pt-28 pb-10 px-4 relative">
            <div className="absolute inset-0 bg-[#0B0F19] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div 
                    initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
                    className="mb-12 p-10 bg-gradient-to-r from-[#1e1b4b] to-[#172554] border border-indigo-500/30 rounded-3xl text-white shadow-[0_0_40px_rgba(79,70,229,0.15)] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Cpu size={150}/>
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Mainframe Access: <span className="text-cyan-400 glow-text-cyan">{user.name || 'User'}</span></h1>
                        <p className="text-indigo-200 text-lg flex items-center gap-3">
                             Clearance: <span className="bg-indigo-500/20 border border-indigo-400/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-300">{user.role}</span>
                        </p>
                    </div>
                </motion.div>

                {user.role === 'owner' ? (
                    <div>
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl font-bold text-white">Active Modules</h2>
                            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                                <PlusCircle size={20}/> {showAddForm ? 'Abort' : 'Deploy Module'}
                            </button>
                        </div>

                        <AnimatePresence>
                            {showAddForm && (
                               <motion.div 
                                    initial={{ opacity:0, height: 0 }} 
                                    animate={{ opacity:1, height: 'auto' }} 
                                    exit={{ opacity:0, height: 0 }}
                                    className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/10 mb-12 overflow-hidden"
                                >
                                   <h3 className="text-2xl font-bold mb-8 text-cyan-400 flex items-center gap-2"><Cpu /> Deploy New Asset</h3>
                                   <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="text" placeholder="Designation Title" required className="bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
                                        
                                        <select className="bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none cursor-pointer appearance-none" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                                            <option value="Vehicles" className="bg-gray-900">Vehicles</option>
                                            <option value="Real Estate" className="bg-gray-900">Real Estate</option>
                                            <option value="Furniture" className="bg-gray-900">Furniture</option>
                                            <option value="Electronics" className="bg-gray-900">Electronics</option>
                                            <option value="Utensils" className="bg-gray-900">Utensils</option>
                                            <option value="Tools" className="bg-gray-900">Tools</option>
                                            <option value="Other" className="bg-gray-900">Other</option>
                                        </select>

                                        <input type="text" placeholder="Sector (Location)" className="bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
                                        
                                        <div className="flex gap-4">
                                            <input type="number" placeholder="Credits" required className="bg-black/50 border border-white/10 text-white p-4 rounded-xl flex-grow focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} />
                                            <select className="bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:border-cyan-400 outline-none w-32 cursor-pointer appearance-none" value={formData.pricingBasis} onChange={e=>setFormData({...formData, pricingBasis: e.target.value})}>
                                                <option value="/day" className="bg-gray-900">/ Day</option>
                                                <option value="/week" className="bg-gray-900">/ Week</option>
                                                <option value="/mo" className="bg-gray-900">/ Month</option>
                                            </select>
                                        </div>

                                        <textarea placeholder="Data Log (Description)" required className="bg-black/50 border border-white/10 text-white p-4 rounded-xl md:col-span-2 h-32 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}></textarea>
                                        <button type="submit" className="md:col-span-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black p-4 rounded-xl font-bold text-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-transform active:scale-[0.98]">Uplink Asset to Grid</button>
                                   </form>
                               </motion.div>
                            )}
                        </AnimatePresence>

                        {fetchLoading ? (
                             <p className="text-cyan-400 animate-pulse font-mono flex items-center justify-center py-20">FETCHING DATABANKS...</p>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {myListings.length === 0 ? <p className="col-span-full border border-dashed border-white/10 p-10 text-center rounded-2xl text-gray-500">No assets currently deployed.</p> : null}
                                {myListings.map(p => (
                                    <motion.div whileHover={{ y: -5 }} key={p._id} className="bg-[#111827]/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex flex-col shadow-lg group hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{p.category}</div>
                                            <div className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">${p.price}<span className="text-xs text-cyan-200">{p.pricingBasis}</span></div>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">{p.title}</h4>
                                        <p className="text-gray-500 mb-6 text-sm">{p.location || 'Global Sector'}</p>
                                        <div className="mt-auto flex gap-3 pt-4 border-t border-white/5">
                                            <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-xl font-bold text-gray-300 transition-colors flex items-center justify-center gap-2 text-sm"><Edit size={16}/> Modify</button>
                                            <button onClick={() => handleDelete(p._id)} className="flex-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 py-2 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-colors"><Trash2 size={16}/> Purge</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/5 backdrop-blur-xl p-12 rounded-[2rem] border border-white/10 text-center mt-10 shadow-2xl">
                        <h2 className="text-3xl font-extrabold mb-4 text-white">No Active Data Links</h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">Your rental sequence is empty. Traverse the grid to find available modules.</p>
                        <Link to="/properties" className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-bold inline-block shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-transform">Explore The Grid</Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
