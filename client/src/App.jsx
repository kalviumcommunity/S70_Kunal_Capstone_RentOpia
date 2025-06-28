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
  );
}

export default App;