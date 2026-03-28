import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkart-backend.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter Logic for Search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={styles.loader}>Loading DriftKart... 🚀</div>;

  return (
    <div style={styles.container}>
      {/* --- HEADER & SEARCH --- */}
      <header style={styles.header}>
        <h1 style={styles.logo}>Drift<span>Kart</span></h1>
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for groceries, snacks..."
            style={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <div style={styles.hero}>
        <h2 style={{ margin: 0 }}>Superfast Delivery ⚡</h2>
        <p style={{ opacity: 0.8, fontSize: '14px' }}>Fresh items from nearby shops to your doorstep.</p>
      </div>

      {/* --- PRODUCT GRID --- */}
      <main style={styles.main}>
        <h3 style={styles.sectionTitle}>All Products ({filteredProducts.length})</h3>
        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <div key={product._id} style={styles.card} onClick={() => navigate('/checkout')}>
              <div style={styles.imgWrapper}>
                <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} style={styles.img} />
                <span style={styles.categoryBadge}>{product.category}</span>
              </div>
              <div style={styles.info}>
                <h4 style={styles.pName}>{product.name}</h4>
                <p style={styles.pShop}>📍 {product.shopName}</p>
                <div style={styles.priceRow}>
                  <span style={styles.price}>₹{product.price}</span>
                  <button style={styles.addBtn}>ADD</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- MODERN UI STYLES ---
const styles = {
  container: { fontFamily: "'Inter', sans-serif", backgroundColor: '#fff', minHeight: '100vh' },
  header: { padding: '15px 20px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  logo: { fontSize: '24px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-1px' },
  searchBar: { backgroundColor: '#F3F4F6', borderRadius: '12px', padding: '10px 15px', display: 'flex' },
  searchInput: { border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  hero: { background: 'linear-gradient(90deg, #E23744 0%, #FF525F 100%)', color: '#fff', padding: '30px 20px', borderRadius: '0 0 30px 30px' },
  main: { padding: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' },
  card: { border: '1px solid #f0f0f0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: '0.2s' },
  imgWrapper: { position: 'relative', height: '140px', backgroundColor: '#f9f9f9' },
  img: { width: '100%', height: '100%', objectFit: 'contain' },
  categoryBadge: { position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' },
  info: { padding: '12px' },
  pName: { margin: '0 0 4px 0', fontSize: '14px', fontWeight: '700' },
  pShop: { margin: '0 0 10px 0', fontSize: '11px', color: '#666' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontWeight: '900', fontSize: '16px' },
  addBtn: { border: '1px solid #E23744', color: '#E23744', background: '#fff', padding: '4px 12px', borderRadius: '6px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800' }
};

export default Home;