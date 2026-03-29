import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 🚩 TERA SAHI BACKEND URL
const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
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

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div style={styles.loaderContainer}>
      <div style={styles.headerDummy}></div>
      <div style={styles.skeletonGrid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={styles.skeletonCard}>
            <div style={styles.skeletonImg}></div>
            <div style={styles.skeletonTextLarge}></div>
            <div style={styles.skeletonTextSmall}></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* --- DEODAP STYLE HEADER (Clean & Premium) --- */}
      <header style={styles.header}>
        <div style={styles.headerMain}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>
            Drift<span style={{ color: '#E23744' }}>Kart</span>

          </h1>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search for 'Maggi', 'Bottle', or 'Stationery'..."
              style={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.headerIcons}>
            <div style={styles.iconItem} onClick={() => navigate('/login')}>
              👤 <span>Login</span>
            </div>
            <div style={styles.iconItem} onClick={() => navigate('/checkout')}>
              🛒 <span>Cart</span>
              <span style={styles.cartBadge}>{products.length > 0 ? '2' : '0'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- SCROLLABLE CATEGORY CHIPS --- */}
      <div style={styles.categoryScroll}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={activeCategory === cat ? styles.chipActive : styles.chip}
          >
            {cat}
          </button>
        ))}
      </div>

      <main style={styles.main}>
        {/* --- PRODUCT GRID (DEODAP Card Style) --- */}
        <div style={styles.grid}>
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              style={styles.card}
              onClick={() => navigate(`/checkout`)}
            >
              <div style={styles.imgWrapper}>
                {p.originalPrice && (
                  <span style={styles.discountBadge}>
                    -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                  </span>
                )}
                <img src={p.image} alt={p.name} style={styles.img} />
              </div>
              <div style={styles.info}>
                <h3 style={styles.pName}>{p.name}</h3>
                <div style={styles.priceRow}>
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>₹{p.price}</span>
                    {p.originalPrice && <span style={styles.oldPrice}>₹{p.originalPrice}</span>}
                  </div>
                  <button style={styles.addBtn}>ADD +</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- MODERN STYLING (Inspired by Deodap.in) ---
const styles = {
  container: { backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: {
    backgroundColor: '#fff',
    padding: '10px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 5px rgba(0,0,0,0.05)'
  },
  headerMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' },
  logo: { fontSize: '22px', fontWeight: '900', letterSpacing: '-1px', cursor: 'pointer', margin: 0, textDecoration: 'none', color: '#000' },
  searchContainer: { flexGrow: 1, maxWidth: '600px' },
  searchBar: {
    width: '100%', padding: '10px 15px', borderRadius: '8px',
    border: '1px solid #ddd', backgroundColor: '#fcfcfc', fontSize: '13px',
    outline: 'none', boxSizing: 'border-box'
  },
  headerIcons: { display: 'flex', gap: '20px', alignItems: 'center' },
  iconItem: { position: 'relative', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#555', cursor: 'pointer', fontWeight: '600' },
  cartBadge: {
    position: 'absolute', top: '-10px', right: '-10px',
    backgroundColor: '#E23744', color: '#fff',
    fontSize: '9px', padding: '2px 5px', borderRadius: '10px'
  },
  categoryScroll: {
    display: 'flex', gap: '8px', padding: '12px 20px',
    overflowX: 'auto', whiteSpace: 'nowrap', backgroundColor: '#fff',
    borderTop: '1px solid #eee'
  },
  chip: {
    padding: '6px 15px', borderRadius: '20px', border: '1px solid #ddd',
    backgroundColor: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.1s'
  },
  chipActive: {
    padding: '6px 15px', borderRadius: '20px', border: '1px solid #E23744',
    backgroundColor: '#E23744', color: '#fff', fontSize: '12px', fontWeight: '600'
  },
  main: { padding: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' },
  card: {
    backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'transform 0.1s', cursor: 'pointer'
  },
  imgWrapper: { position: 'relative', height: '160px', padding: '10px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' },
  img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  discountBadge: {
    position: 'absolute', top: '10px', right: '10px',
    backgroundColor: '#E23744', fontSize: '10px', fontWeight: '800',
    padding: '3px 6px', borderRadius: '5px', color: '#fff', textTransform: 'uppercase'
  },
  info: { padding: '12px' },
  pName: { fontSize: '13px', fontWeight: '600', margin: '0 0 10px 0', height: '32px', overflow: 'hidden', color: '#333' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  priceContainer: { display: 'flex', alignItems: 'baseline', gap: '3px' },
  price: { fontSize: '16px', fontWeight: '800', color: '#222' },
  oldPrice: { fontSize: '11px', color: '#aaa', textDecoration: 'line-through' },
  addBtn: {
    backgroundColor: '#E23744', color: '#fff', border: 'none',
    padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer'
  },
  // --- SKELETON LOADER STYLES ---
  loaderContainer: { padding: '20px' },
  headerDummy: { height: '60px', backgroundColor: '#fff', marginBottom: '20px', borderRadius: '8px' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' },
  skeletonCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '10px', height: '260px' },
  skeletonImg: { height: '160px', backgroundColor: '#e0e0e0', marginBottom: '10px', borderRadius: '8px' },
  skeletonTextLarge: { height: '15px', backgroundColor: '#e0e0e0', width: '80%', marginBottom: '8px', borderRadius: '4px' },
  skeletonTextSmall: { height: '10px', backgroundColor: '#f0f0f0', width: '50%', borderRadius: '4px' }
};

export default Home;