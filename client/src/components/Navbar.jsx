import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">RentOpia</h1>
      <ul className="flex gap-4">
        <li>Home</li>
        <li>Properties</li>
        <li>Contact</li>
      </ul>
    </nav>
  );
};

export default Navbar;