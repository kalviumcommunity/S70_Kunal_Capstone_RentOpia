import React from 'react';

const PropertyCard = ({ title, price, location, image }) => {
  return (
    <div className="border rounded-xl shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-gray-600">{location}</p>
        <p className="text-blue-600 font-bold">{price}</p>
      </div>
    </div>
  );
};

export default PropertyCard;