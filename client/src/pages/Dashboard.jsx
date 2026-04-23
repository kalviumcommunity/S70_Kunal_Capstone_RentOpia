import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2, Cpu, Upload, Loader2, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SkeletonLoader from '../components/SkeletonLoader';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('inventory');
    const [uploading, setUploading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '', description: '', price: '', pricingBasis: '/day', location: '', category: 'Vehicles', images: [] 
    });

    // React Query: Fetch Dashboard Data
    const { data: dashboardData, isLoading: fetchLoading } = useQuery({
        queryKey: ['dashboard', user?.id],
        queryFn: async () => {
            const [listingRes, incomingRes, rentalRes] = await Promise.all([
                axios.get('/listings'),
                user.role === 'owner' ? axios.get('/bookings/incoming') : Promise.resolve({ data: [] }),
                axios.get('/bookings/my-rentals')
            ]);

            const mine = listingRes.data.listings.filter(p => 
                typeof p.owner === 'object' ? p.owner._id === user.id : p.owner === user.id
            );

            return {
                myListings: mine,
                incomingBookings: incomingRes.data,
                myRentals: rentalRes.data
            };
        },
        enabled: !!user
    });

    // Mutations
    const addListingMutation = useMutation({
        mutationFn: (newData) => axios.post('/listings', newData),
        onSuccess: () => {
            queryClient.invalidateQueries(['dashboard']);
            setShowAddForm(false);
            setFormData({ title: '', description: '', price: '', pricingBasis: '/day', location: '', category: 'Vehicles', images: [] });
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => axios.patch(`/bookings/${id}/status`, { status }),
        onSuccess: () => queryClient.invalidateQueries(['dashboard'])
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(`/listings/${id}`),
        onSuccess: () => queryClient.invalidateQueries(['dashboard'])
    });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        try {
            const res = await axios.post('/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setFormData(prev => ({ ...prev, images: [res.data.path] }));
        } catch (err) { 
            console.error(err);
            alert("Upload failed. Error: " + (err.response?.data?.error || err.message)); 
        } finally { setUploading(false); }
    };

    if (authLoading) return null;
    if (!user) return <div className="pt-32 text-center text-cyan-400 font-mono">UNAUTHORIZED.</div>;

    const { myListings = [], incomingBookings = [], myRentals = [] } = dashboardData || {};

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12 p-8 glass rounded-3xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-[var(--text-main)] mb-2 tracking-tighter">Mainframe Hub</h1>
                            <p className="text-[var(--primary)] font-mono text-[10px] uppercase tracking-widest">Operator: {user.name} // Access Protocol Active</p>
                        </div>
                        {user.role === 'owner' && (
                             <div className="flex glass p-1 rounded-2xl">
                                {['inventory', 'handshakes'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[var(--primary)] text-black shadow-lg shadow-[var(--primary)]/20' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}>
                                        {tab} {tab === 'handshakes' && incomingBookings.length > 0 && `(${incomingBookings.length})`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                <div className="space-y-12">
                    {/* Inventory/Handshake Section */}
                    {user.role === 'owner' ? (
                        activeTab === 'inventory' ? (
                            <section>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2 uppercase tracking-widest"><Cpu size={20} className="text-[var(--primary)]"/> My Deployed Inventory</h2>
                                    <button onClick={() => setShowAddForm(!showAddForm)} className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                        {showAddForm ? 'Abort' : 'Deploy Asset'}
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showAddForm && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="glass rounded-3xl p-8 mb-12 overflow-hidden shadow-2xl">
                                            <form onSubmit={(e)=>{ e.preventDefault(); addListingMutation.mutate({...formData, price: Number(formData.price)}); }} className="grid md:grid-cols-2 gap-6 font-mono">
                                                <input type="text" placeholder="Designation" className="bg-[var(--bg-deep)]/40 border border-[var(--border-alpha)] p-4 rounded-xl text-[var(--text-main)] outline-none focus:border-[var(--primary)] text-xs" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} required />
                                                <select className="bg-[var(--bg-deep)]/40 border border-[var(--border-alpha)] p-4 rounded-xl text-[var(--text-main)] outline-none focus:border-[var(--primary)] text-xs" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})}>
                                                    {['Vehicles', 'Real Estate', 'Electronics', 'Furniture', 'Tools'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <div className="md:col-span-2">
                                                    <label className="flex items-center justify-center border-2 border-dashed border-[var(--border-alpha)] rounded-2xl p-6 bg-[var(--bg-deep)]/20 cursor-pointer hover:border-[var(--primary)]/30 transition-all">
                                                        {uploading ? <Loader2 className="animate-spin text-[var(--primary)]" /> : formData.images.length > 0 ? <img src={formData.images[0]} className="w-20 h-20 object-cover rounded-lg" alt="Preview"/> : <div className="text-center font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest"><Upload className="mx-auto mb-2 opacity-50"/> Link Visual Matrix</div>}
                                                        <input type="file" className="hidden" onChange={handleFileUpload} />
                                                    </label>
                                                </div>
                                                <input type="number" placeholder="Credits" className="bg-[var(--bg-deep)]/40 border border-[var(--border-alpha)] p-4 rounded-xl text-[var(--text-main)] outline-none focus:border-[var(--primary)] text-xs" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} required />
                                                <input type="text" placeholder="Sector" className="bg-[var(--bg-deep)]/40 border border-[var(--border-alpha)] p-4 rounded-xl text-[var(--text-main)] outline-none focus:border-[var(--primary)] text-xs" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
                                                <textarea placeholder="Data Specs" className="md:col-span-2 bg-[var(--bg-deep)]/40 border border-[var(--border-alpha)] p-4 rounded-xl text-[var(--text-main)] h-24 outline-none focus:border-[var(--primary)] text-xs" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
                                                <button type="submit" disabled={addListingMutation.isLoading} className="md:col-span-2 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] hover:brightness-110 text-white py-4 rounded-xl font-black uppercase tracking-[0.3em] text-[10px] shadow-lg transition-all">Execute Uplink Sequence</button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {fetchLoading ? (
                                    <SkeletonLoader count={3} />
                                ) : (
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {myListings.length === 0 && <p className="text-[var(--text-dim)] italic text-xs py-10 font-mono tracking-widest">IDLE. NO DEPLOYED ASSETS DETECTED.</p>}
                                        {myListings.map(item => (
                                            <div key={item._id} className="glass p-4 rounded-3xl hover:bg-[var(--bg-card)] transition-all group shadow-xl">
                                                <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative bg-black">
                                                    <img src={item.images?.[0] || 'https://via.placeholder.com/400'} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={item.title}/>
                                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.category}</div>
                                                </div>
                                                <h4 className="text-[var(--text-main)] font-bold text-sm truncate mb-1">{item.title}</h4>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-cyan-400 font-mono text-xs font-bold tracking-tighter">${item.price}<span className="text-[10px] text-gray-600 font-normal">{item.pricingBasis}</span></p>
                                                    <button onClick={()=>deleteMutation.mutate(item._id)} className="p-2 text-red-500/30 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ) : (
                            <section>
                                <h2 className="text-xl font-bold text-[var(--text-main)] mb-8 uppercase tracking-widest flex items-center gap-2"><Clock size={20} className="text-[var(--secondary)]"/> Sync Requests</h2>
                                {fetchLoading ? (
                                    <div className="space-y-4">
                                        {[1,2,3].map(i => <div key={i} className="h-24 glass rounded-2xl animate-pulse" />)}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {incomingBookings.length === 0 && <p className="text-[var(--text-dim)] font-mono py-12 text-center text-[10px] uppercase tracking-widest border border-dashed border-[var(--border-alpha)] rounded-3xl">Standby. No active signals.</p>}
                                        {incomingBookings.map(b => (
                                            <div key={b._id} className="glass p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 hover:border-[var(--secondary)]/30 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-[var(--border-alpha)]">
                                                        <img src={b.listing?.images?.[0]} className="w-full h-full object-cover" alt="asset" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[var(--text-main)] font-bold text-sm">{b.listing?.title}</h4>
                                                        <p className="text-[9px] text-[var(--text-dim)] font-mono uppercase tracking-tighter">Origin: {b.renter?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-[9px] text-[var(--text-dim)] font-bold uppercase tracking-tighter"><Calendar className="inline mr-1" size={10}/> {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                                                        <p className="text-[var(--primary)] font-black text-lg font-mono">${b.totalPrice}</p>
                                                    </div>
                                                    {b.status === 'pending' ? (
                                                        <div className="flex gap-2 font-mono">
                                                            <button onClick={()=>statusMutation.mutate({id: b._id, status: 'confirmed'})} className="bg-[var(--primary)] text-black px-4 py-1.5 rounded-lg text-[9px] font-black uppercase hover:brightness-110 transition-all">Settle</button>
                                                            <button onClick={()=>statusMutation.mutate({id: b._id, status: 'cancelled'})} className="border border-red-500/50 text-red-500 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase hover:bg-red-500/10 transition-all">Void</button>
                                                        </div>
                                                    ) : (
                                                        <span className={`text-[8px] font-black uppercase border px-3 py-1 rounded-full tracking-widest ${b.status === 'confirmed' ? 'border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/10' : 'border-red-500 text-red-400 bg-red-400/10'}`}>{b.status}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )
                    ) : null}

                    {/* Rental History Card */}
                    <section>
                        <h2 className="text-xl font-bold text-[var(--text-main)] mb-8 uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={20} className="text-indigo-400"/> Current Uplinks</h2>
                        {fetchLoading ? (
                             <div className="grid md:grid-cols-2 gap-6">
                                {[1,2].map(i => <div key={i} className="h-40 glass rounded-[2rem] animate-pulse" />)}
                             </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {myRentals.length === 0 && <div className="col-span-full border border-dashed border-[var(--border-alpha)] py-12 text-center text-[10px] text-[var(--text-dim)] font-mono tracking-widest rounded-3xl">NULL LINKAGE DETECTED. EXPLORE THE GRID TO COMMENCE.</div>}
                                {myRentals.map(b => (
                                    <div key={b._id} className="bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-deep)] border border-[var(--border-alpha)] p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:border-[var(--accent)]/30 transition-all">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                            <Zap size={40} className="text-[var(--accent)]" />
                                        </div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-lg font-bold text-[var(--text-main)] mb-1 tracking-tight">{b.listing?.title}</h4>
                                                <p className="text-[9px] text-[var(--text-dim)] font-mono uppercase tracking-widest">Node Node: {b.owner?.name}</p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border tracking-widest ${b.status === 'confirmed' ? 'text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]' : b.status === 'pending' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-400/30' : 'text-red-500 bg-red-500/10 border-red-500/30'}`}>{b.status}</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <p className="text-[9px] text-[var(--text-dim)] flex items-center gap-2 font-mono uppercase tracking-tighter"><Calendar size={12} className="text-[var(--accent)]"/> {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                                            <p className="text-2xl font-black text-[var(--primary)] font-mono tracking-tighter">${b.totalPrice}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
