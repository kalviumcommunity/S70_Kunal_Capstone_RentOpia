import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingItem from "./ListingItem";

const Listings = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/api/listings").then((res) => {
      setItems(res.data);
    });
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/listings/${id}`);
    setItems(items.filter((item) => item._id !== id));
  };

  const handleUpdateClick = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updated = await axios.put(
      `http://localhost:5000/api/listings/${editingItem._id}`,
      formData
    );
    setItems(
      items.map((item) =>
        item._id === editingItem._id ? updated.data : item
      )
    );
    setEditingItem(null);
    setFormData({ title: "", description: "" });
  };

  return (
    <div>
      <h1>My Listings</h1>
      {items.map((item) => (
        <ListingItem
          key={item._id}
          item={item}
          onUpdate={handleUpdateClick}
          onDelete={handleDelete}
        />
      ))}

      {editingItem && (
        <form onSubmit={handleFormSubmit}>
          <h2>Edit Listing</h2>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default Listings;
