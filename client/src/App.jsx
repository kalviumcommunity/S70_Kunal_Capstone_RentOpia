<<<<<<< HEAD
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Placeholder imports for pages we are going to create
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#0B0F19] text-gray-100 font-sans selection:bg-cyan-500/30">
          <Navbar />
          <main className="flex-grow pb-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
=======
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// ✅ Import your frontend components
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import PropertyCard from './components/PropertyCard';
import Footer from './components/Footer';

function App() {
  const [query, setQuery] = useState('');

  const handleSearch = (searchValue) => {
    setQuery(searchValue);
    console.log('Searching for:', searchValue);
  };

  const sampleProperty = {
    title: 'Luxury Studio Apartment',
    location: 'Bangalore, India',
    price: '₹20,000/month',
    image: 'https://via.placeholder.com/400x300',
  };

  return (
    <div className="font-sans">
      {/* ✅ Your original heading stays */}
      <h1>🏠 RentOpia</h1>
      <p>Find your next rental home easily.</p>

      {/* ✅ Components start below */}
      <Navbar />
      <SearchBar onSearch={handleSearch} />

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <PropertyCard {...sampleProperty} />
        <PropertyCard {...sampleProperty} />
        <PropertyCard {...sampleProperty} />
      </div>

      <Footer />
    </div>
>>>>>>> 9b57c68bcf5a6bfea5297597331253d304fdca61
  );
}

export default App;