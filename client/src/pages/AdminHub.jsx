import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Shield, Users, Package, Clock, Trash2, Search, ExternalLink, Info, AlertTriangle, X, Database, Repeat, Eye, Zap, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminHub = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalOwners: 0, totalRenters: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    
    // Activity Detail State
    const [selectedUserActivity, setSelectedUserActivity] = useState(null);
    const [activityLoading, setActivityLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading) {
            if (user && user.role === 'admin') {
                fetchUsers();
            } else if (user?.role !== 'admin') {
                navigate('/dashboard');
            }
        }
    }, [user, authLoading]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/users');
            if (Array.isArray(res.data)) {
                setUsers(res.data);
                const owners = res.data.filter(u => u.role === 'owner').length;
                const renters = res.data.filter(u => u.role === 'renter').length;
                setStats({ totalUsers: res.data.length, totalOwners: owners, totalRenters: renters });
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserActivity = async (id) => {
        setActivityLoading(true);
        try {
            const res = await axios.get(`/users/${id}/activity`);
            setSelectedUserActivity(res.data);
        } catch (err) {
            alert("Security Breach: Failed to retrieve node activity.");
        } finally {
            setActivityLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('CATASTROPHIC ACTION: Purge user and ALL associated grid data (listings, bookings)? This action is irreversible.')) {
            try {
                await axios.delete(`/users/${id}`);
                fetchUsers();
            } catch (err) {
                alert("Purge sequence failed.");
            }
        }
    };

    const handleDeleteListing = async (listingId) => {
        if (window.confirm('EXECUTIVE OVERRIDE: Purge this particular asset from the grid?')) {
            try {
                await axios.delete(`/listings/${listingId}`);
                // Refresh activity
                fetchUserActivity(selectedUserActivity.user._id);
            } catch (err) {
                alert("Override failed: " + (err.response?.data?.error || err.message));
            }
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading) return <div className="pt-32 text-center text-[var(--primary)] font-mono animate-pulse uppercase tracking-[0.25em]">Authenticating Executive Credentials...</div>;

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 bg-[var(--bg-deep)] grid-bg transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="mb-12 p-10 glass rounded-[3rem] relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Shield size={120} className="text-[var(--primary)]" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h1 className="text-5xl font-black text-[var(--text-main)] mb-2 flex items-center gap-4 tracking-tighter">
                                <div className="p-3 bg-[var(--primary)]/10 rounded-2xl border border-[var(--primary)]/20"><Shield className="text-[var(--primary)]" /></div> Executive Terminal
                            </h1>
                            <p className="text-[var(--primary)]/50 font-mono text-[10px] uppercase tracking-[0.4em] font-bold">Secure Node Protocol // Superuser: {user?.name || 'Administrator'}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center px-6 py-3 glass rounded-2xl">
                                <span className="block text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">Users</span>
                                <span className="text-xl font-black text-[var(--text-main)]">{stats.totalUsers}</span>
                            </div>
                            <div className="text-center px-6 py-3 glass rounded-2xl">
                                <span className="block text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">Owners</span>
                                <span className="text-xl font-black text-[var(--secondary)]">{stats.totalOwners}</span>
                            </div>
                            <div className="text-center px-6 py-3 glass rounded-2xl">
                                <span className="block text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">Renters</span>
                                <span className="text-xl font-black text-[var(--primary)]">{stats.totalRenters}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-3xl flex items-center gap-4 font-mono text-sm">
                        <AlertTriangle className="flex-shrink-0" />
                        <p>{error}</p>
                    </motion.div>
                )}

                {/* Search */}
                <div className="mb-8 flex justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={18} />
                        <input 
                            type="text" 
                            placeholder="Query by name or email..." 
                            className="w-full glass text-[var(--text-main)] pl-12 pr-4 py-3 rounded-2xl focus:border-[var(--primary)] outline-none transition-all font-mono text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchUsers} className="text-[10px] font-bold text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all uppercase tracking-widest">Re-Sync Node Directory</button>
                </div>

                {/* User Matrix */}
                <div className="glass rounded-[2rem] overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border-alpha)] border-b border-[var(--border-alpha)]">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)]">Node</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)]">Uplink</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)]">Protocol</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-alpha)]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => <tr key={i} className="animate-pulse h-20 bg-[var(--border-alpha)]" />)
                            ) : (
                                filteredUsers.map((u, i) => (
                                    <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[var(--border-alpha)] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${u.role === 'admin' ? 'bg-red-500' : u.role === 'owner' ? 'bg-[var(--secondary)]' : 'bg-[var(--primary)]'} text-white`}>{u.name?.charAt(0) || '?'}</div>
                                                <div>
                                                    <div className="text-[var(--text-main)] font-bold text-sm">{u.name}</div>
                                                    <div className="text-[9px] text-[var(--text-dim)] font-mono">ID: {u._id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[var(--text-dim)] font-mono text-xs">{u.email}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'text-red-400 bg-red-400/10' : u.role === 'owner' ? 'text-[var(--secondary)] bg-[var(--secondary)]/10' : 'text-[var(--primary)] bg-[var(--primary)]/10'}`}>{u.role}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => fetchUserActivity(u._id)} className="text-[var(--primary)]/60 hover:text-[var(--primary)] flex items-center gap-1 text-[10px] font-bold uppercase transition-all">
                                                    <Eye size={16} /> View Activity
                                                </button>
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-500/50 hover:text-red-500 transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Activity Modal */}
                <AnimatePresence>
                    {selectedUserActivity && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUserActivity(null)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-[var(--bg-deep)] border border-[var(--border-alpha)] w-full max-w-5xl max-h-[85vh] overflow-hidden rounded-[3rem] shadow-[0_0_100px_rgba(34,211,238,0.1)] flex flex-col"
                            >
                                <div className="p-8 border-b border-[var(--border-alpha)] flex justify-between items-center bg-[var(--bg-card)]">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[var(--primary)]/10 p-3 rounded-2xl text-[var(--primary)]"><Database size={24}/></div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">{selectedUserActivity.user.name} Node Analysis</h2>
                                            <p className="text-[10px] text-[var(--text-dim)] font-mono uppercase tracking-[0.2em]">{selectedUserActivity.user.email} // Clearance: {selectedUserActivity.user.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedUserActivity(null)} className="p-2 hover:bg-[var(--border-alpha)] rounded-full text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all"><X size={24}/></button>
                                </div>

                                <div className="flex-grow overflow-y-auto p-10 space-y-12">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="bg-[var(--bg-deep)] border border-[var(--border-alpha)] p-6 rounded-3xl shadow-inner">
                                            <Package className="text-[var(--secondary)] mb-2" size={20} />
                                            <span className="block text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">Assets Deployed</span>
                                            <span className="text-3xl font-black text-[var(--text-main)]">{selectedUserActivity.stats.listingsCount}</span>
                                        </div>
                                        <div className="bg-[var(--bg-deep)] border border-[var(--border-alpha)] p-6 rounded-3xl shadow-inner">
                                            <ExternalLink className="text-[var(--primary)] mb-2" size={20} />
                                            <span className="block text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">Renter History</span>
                                            <span className="text-3xl font-black text-[var(--text-main)]">{selectedUserActivity.stats.rentalsCount}</span>
                                        </div>
                                        <div className="bg-[var(--bg-deep)] border border-[var(--border-alpha)] p-6 rounded-3xl shadow-inner">
                                            <Repeat className="text-[var(--accent)] mb-2" size={20} />
                                            <span className="block text-[10px] text-[var(--text-dim)] font-bold uppercase tracking-widest mb-1">Management Logs</span>
                                            <span className="text-3xl font-black text-[var(--text-main)]">{selectedUserActivity.stats.incomingHandshakesCount}</span>
                                        </div>
                                    </div>

                                    {/* Assets Section */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-[var(--secondary)] rounded-full" /> Hardware Inventory & Performance
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {selectedUserActivity.listings.length === 0 && <p className="text-[var(--text-dim)] font-mono text-[10px] italic">No hardware signals detected on this node.</p>}
                                            {selectedUserActivity.listings.map(l => (
                                                <div key={l._id} className="glass p-5 rounded-3xl group relative hover:border-[var(--primary)]/30 transition-all">
                                                    <button 
                                                        onClick={() => handleDeleteListing(l._id)}
                                                        className="absolute top-4 right-4 text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Purge Asset"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <div className="flex items-start gap-4">
                                                        <img src={l.images?.[0] || 'https://via.placeholder.com/100'} className="w-16 h-16 object-cover rounded-2xl bg-black" alt="" />
                                                        <div className="flex-grow">
                                                            <div className="text-[var(--text-main)] font-bold text-sm mb-2">{l.title}</div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[8px] text-[var(--text-dim)] font-bold uppercase">Requests</span>
                                                                    <span className="text-[var(--primary)] font-mono font-black flex items-center gap-1 text-[10px]"><TrendingUp size={10}/> {l.rentCount}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[8px] text-[var(--text-dim)] font-bold uppercase">Settled</span>
                                                                    <span className="text-[var(--secondary)] font-mono font-black flex items-center gap-1 text-[10px]"><Zap size={10}/> {l.successfulRentCount}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* History Section */}
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-[var(--text-main)] uppercase tracking-[0.3em] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full" /> Grid Access Log
                                        </h3>
                                        <div className="glass rounded-[2rem] overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-[var(--border-alpha)] border-b border-[var(--border-alpha)]">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase text-[var(--text-dim)]">Engagement ID</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase text-[var(--text-dim)]">Asset</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase text-[var(--text-dim)]">Cycle</th>
                                                        <th className="px-6 py-4 text-[9px] font-black uppercase text-[var(--text-dim)] text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[var(--border-alpha)]">
                                                    {selectedUserActivity.bookingsAsRenter.map(b => (
                                                        <tr key={b._id} className="hover:bg-[var(--border-alpha)]">
                                                            <td className="px-6 py-4 font-mono text-[9px] text-[var(--text-dim)] tracking-tighter">#{b._id.slice(-6)}</td>
                                                            <td className="px-6 py-4 text-[var(--text-main)] font-bold">{b.listing?.title || 'Purged Asset'}</td>
                                                            <td className="px-6 py-4 text-[var(--text-dim)]">{new Date(b.startDate).toLocaleDateString()}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${b.status === 'confirmed' ? 'text-[var(--primary)] bg-[var(--primary)]/10' : 'text-[var(--text-dim)] bg-[var(--bg-deep)]'}`}>{b.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-[var(--bg-card)] border-t border-[var(--border-alpha)] flex justify-end">
                                    <button onClick={() => setSelectedUserActivity(null)} className="px-8 py-3 bg-[var(--primary)] hover:brightness-110 text-black font-bold rounded-2xl transition-all uppercase text-[10px] tracking-widest">Close Uplink</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminHub;
