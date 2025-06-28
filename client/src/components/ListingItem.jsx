import React from "react";

const ListingItem = ({ item, onUpdate, onDelete }) => {
  return (
    <div className="listing-card">
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <button onClick={() => onUpdate(item)}>Edit</button>
      <button onClick={() => onDelete(item._id)}>Delete</button>
    </div>
  );
};

export default ListingItem;
