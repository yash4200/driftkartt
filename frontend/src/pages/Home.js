import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://driftkart-backend.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading DriftKart... 🚀</div>;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header style={{ padding: '15px', position: 'sticky', top: 0, background: '#fff', boxShadow: '0 2px 5px #eee' }}>
        <h1 style={{ margin: 0 }}>DriftKart</h1>
        <input
          style={{ width: '90%', padding: '10px', marginTop: '10px', borderRadius: '10px', border: '1px solid #ddd' }}
          placeholder="Search products..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {filtered.map(p => (
          <div key={p._id} style={{ border: '1px solid #eee', borderRadius: '15px', overflow: 'hidden' }}>
            <img src={p.image} style={{ width: '100%', height: '120px', objectFit: 'cover' }} alt="" />
            <div style={{ padding: '10px' }}>
              <h4 style={{ margin: 0 }}>{p.name}</h4>
              <p style={{ color: 'red', fontWeight: 'bold' }}>₹{p.price}</p>
              <button style={{ width: '100%', background: '#E23744', color: '#fff', border: 'none', padding: '5px', borderRadius: '5px' }}>ADD</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;