import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="p-4">
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Search for properties..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => onSearch(query)}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;