import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:10000/products")
      .then(res => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch(err => console.log("Error loading products"));
  }, []);

  // 🔍 Search & Category Filter Logic
  useEffect(() => {
    let result = products;
    if (activeCat !== 'All') {
      result = result.filter(p => p.category === activeCat);
    }
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredProducts(result);
  }, [searchTerm, activeCat, products]);

  const addToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const categories = ['All', 'Grocery', 'Stationery', 'Daily Needs', 'Personal Care'];

  return (
    <div style={styles.container}>
      {/* 🏁 Header with Search */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Drift<span>Kart</span></h1>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search 'Atta', 'Pen' or 'Milk'..."
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={() => navigate('/checkout')} style={styles.cartBtn}>
          🛒 Cart ({cart.length})
        </button>
      </header>

      {/* 🏷️ Category Strip */}
      <div style={styles.categoryStrip}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={activeCat === cat ? styles.catBtnActive : styles.catBtn}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🛍️ Product Grid */}
      <main style={styles.grid}>
        {filteredProducts.length > 0 ? filteredProducts.map(p => (
          <div key={p._id} style={styles.card}>
            <div style={styles.imageBox}>
              <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} style={styles.img} />
            </div>
            <div style={styles.details}>
              <p style={styles.shopTag}>🏪 {p.shopName || "Local Store"}</p>
              <h4 style={styles.title}>{p.name}</h4>
              <div style={styles.priceRow}>
                <div>
                  <span style={styles.price}>₹{p.price}</span>
                  <span style={styles.mrp}>₹{p.originalPrice}</span>
                </div>
                <button onClick={() => addToCart(p)} style={styles.addBtn}>ADD</button>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888' }}>
            ❌ No products found for "{searchTerm}"
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#F8F9FA', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  header: { padding: '15px 20px', backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #eee', gap: '15px' },
  logo: { fontSize: '20px', fontWeight: '900', margin: 0, color: '#1A1A1A' },
  searchBox: { flex: 1, maxWidth: '500px' },
  searchInput: { width: '100%', padding: '12px 20px', borderRadius: '12px', border: '1px solid #eee', backgroundColor: '#F3F4F6', outline: 'none', fontSize: '14px' },
  cartBtn: { backgroundColor: '#E23744', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  categoryStrip: { display: 'flex', gap: '10px', padding: '15px 20px', overflowX: 'auto', backgroundColor: '#fff' },
  catBtn: { padding: '8px 18px', borderRadius: '20px', border: '1px solid #eee', background: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '600' },
  catBtnActive: { padding: '8px 18px', borderRadius: '20px', border: '1px solid #E23744', background: '#FFF5F6', color: '#E23744', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '800' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px', padding: '15px' },
  card: { backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' },
  imageBox: { height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' },
  img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  details: { padding: '12px' },
  shopTag: { fontSize: '10px', color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', fontWeight: '700' },
  title: { fontSize: '13px', fontWeight: '700', margin: '0 0 10px 0', height: '32px', overflow: 'hidden' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '15px', fontWeight: '900', color: '#000' },
  mrp: { fontSize: '11px', color: '#999', textDecoration: 'line-through', marginLeft: '5px' },
  addBtn: { border: '1px solid #E23744', background: '#fff', color: '#E23744', padding: '5px 15px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }
};

export default Home;