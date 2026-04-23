import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Calendar, CreditCard, ChevronLeft, ShieldCheck, Zap, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import SkeletonLoader from '../components/SkeletonLoader';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchItem();
    fetchReviews();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await axios.get(`/listings/${id}`);
      setItem(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmittingReview(true);
    try {
      await axios.post('/reviews', { listingId: id, rating, comment });
      setComment(''); setRating(5); fetchReviews();
    } catch (err) {
      alert(err.response?.data?.error || "Only confirmed renters can leave reviews.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    if (!startDate || !endDate) { alert("Select cycles."); return; }
    setBookingLoading(true);
    try {
      const days = calculateDays();
      await axios.post('/bookings', { listingId: item._id, startDate, endDate, totalPrice: days * item.price });
      setBookingSuccess(true);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to initiate handshake.");
    } finally { setBookingLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen pt-32 px-4 bg-[#0B0F19]">
      <SkeletonLoader type="details" />
    </div>
  );

  if (!item) return <div className="pt-32 text-center text-red-500 font-mono">ASSET OFFLINE.</div>;

  const days = calculateDays();
  const totalCost = days * item.price;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-[#0B0F19]">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-8 transition-colors font-mono uppercase text-[10px] tracking-widest">
           <ChevronLeft size={14}/> Back to Grid
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Visual Asset */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-black">
               <img 
                src={item.images?.[0] || 'https://via.placeholder.com/800'} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                  <span className="text-gray-500 text-[9px] uppercase font-bold tracking-widest block mb-1">Ownership Node</span>
                  <p className="text-white font-bold text-sm tracking-tight">{item.owner?.name}</p>
               </div>
               <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                  <span className="text-gray-500 text-[9px] uppercase font-bold tracking-widest block mb-1">Trust Frequency</span>
                  <p className="text-cyan-400 font-bold flex items-center gap-1 text-sm"><Star size={14} fill="currentColor"/> 4.9/5.0</p>
               </div>
            </div>

            <div className="mt-12 bg-white/5 rounded-3xl p-8 border border-white/5 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 uppercase tracking-widest text-xs font-black"><MessageSquare className="text-cyan-400" size={18} /> Comm Logs</h3>
                <div className="space-y-6 mb-8">
                    {reviews.length === 0 ? <p className="text-gray-600 italic text-[10px] uppercase font-mono tracking-widest">No entries found in this sector.</p> : null}
                    {reviews.map(r => (
                        <div key={r._id} className="border-l-2 border-cyan-500/20 pl-4 py-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white text-[10px] font-bold uppercase">{r.renter?.name}</span>
                                <div className="flex text-cyan-400 opacity-50">
                                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">"{r.comment}"</p>
                        </div>
                    ))}
                </div>

                {user && user.role === 'renter' && (
                    <form onSubmit={handleReviewSubmit} className="pt-6 border-t border-white/10 space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Integrity:</span>
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(num => (
                                    <button 
                                        key={num} type="button" onClick={() => setRating(num)}
                                        className={`p-1 transition-colors ${rating >= num ? 'text-cyan-400' : 'text-gray-800'}`}
                                    >
                                        <Star size={16} fill={rating >= num ? "currentColor" : "none"}/>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input 
                            type="text" placeholder="Synchronize feedback..." 
                            className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white text-xs focus:border-cyan-400 outline-none font-mono"
                            value={comment} onChange={e => setComment(e.target.value)}
                        />
                        <button disabled={submittingReview} type="submit" className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500 hover:text-cyan-400 transition-colors">Record Transaction Data</button>
                    </form>
                )}
            </div>
          </div>

          {/* Right: Handshake Card */}
          <div className="flex flex-col">
            <div className="mb-10">
              <div className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4">{item.category}</div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter glow-text-white">{item.title}</h1>
              <p className="text-cyan-500/70 flex items-center gap-2 mb-4 font-mono text-[10px] uppercase tracking-[0.3em] font-bold">{item.location || 'Global Sector'}</p>
            </div>

            <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
               <h3 className="text-white font-bold mb-8 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]"><Calendar size={18} className="text-purple-500"/> Cycle configuration</h3>
               {bookingSuccess ? (
                 <div className="text-center py-10 bg-cyan-500/5 rounded-[2rem] border border-cyan-500/20">
                    <ShieldCheck size={54} className="text-cyan-400 mx-auto mb-4 animate-pulse shadow-lg" />
                    <h4 className="text-white font-black text-xl mb-2 tracking-tight uppercase tracking-widest">Handshake Initiated</h4>
                    <button onClick={() => navigate('/dashboard')} className="mt-4 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] hover:glow-cyan">Enter Mainframe hub</button>
                 </div>
               ) : (
                 <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Start cycle</label>
                          <input type="date" className="w-full bg-black/60 border border-white/10 text-white p-4 rounded-2xl text-xs focus:border-cyan-400 outline-none color-scheme-dark font-mono" value={startDate} onChange={e => setStartDate(e.target.value)} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">End cycle</label>
                          <input type="date" className="w-full bg-black/60 border border-white/10 text-white p-4 rounded-2xl text-xs focus:border-purple-400 outline-none color-scheme-dark font-mono" value={endDate} onChange={e => setEndDate(e.target.value)} />
                       </div>
                    </div>
                    <div className="flex justify-between items-center py-5 px-8 bg-black/40 rounded-3xl border border-white/5">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total cost</span>
                        <span className="text-3xl font-black text-cyan-400 font-mono tracking-tighter glow-text-cyan">${totalCost}</span>
                    </div>
                    <button 
                      onClick={handleBooking} disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 py-6 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {bookingLoading ? 'SYNCHRONIZING...' : 'Initiate Handshake'}
                    </button>
                 </div>
               )}
            </div>

            <div className="mt-12 space-y-6">
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2"><Zap className="text-cyan-400" size={18}/> Data Extraction</h3>
               <p className="text-gray-400 font-light leading-relaxed text-lg">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
