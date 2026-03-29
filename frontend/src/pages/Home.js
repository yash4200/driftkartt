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
    <div style={styles.loader}>
      <div className="spinner"></div>
      <p>Fetching Fresh Products... 🚀</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* --- STICKY HEADER --- */}
      <header style={styles.header}>
        <div style={styles.navTop}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>
            Drift<span style={{ color: '#E23744' }}>Kart</span>
          </h1>
          <div style={styles.cartIcon} onClick={() => navigate('/checkout')}>
            🛒 <span style={styles.cartBadge}>{products.length > 0 ? '2' : '0'}</span>
          </div>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for 'Maggi' or 'Stationery'..."
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* --- CATEGORY CHIPS --- */}
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
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {activeCategory === 'All' ? 'Everything You Need' : `${activeCategory} Specials`}
          </h2>
          <span style={styles.itemCount}>{filteredProducts.length} Items</span>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div style={styles.grid}>
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              style={styles.card}
              onClick={() => navigate(`/checkout`)} // Yahan product detail page ka link dal sakte ho
            >
              <div style={styles.imgWrapper}>
                <span style={styles.categoryBadge}>{p.category}</span>
                <img src={p.image} alt={p.name} style={styles.img} />
              </div>
              <div style={styles.info}>
                <p style={styles.shopName}>{p.shopName || 'Local Store'}</p>
                <h3 style={styles.pName}>{p.name}</h3>
                <div style={styles.priceRow}>
                  <div>
                    <span style={styles.price}>₹{p.price}</span>
                    {p.originalPrice && <span style={styles.oldPrice}>₹{p.originalPrice}</span>}
                  </div>
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

// --- MODERN STYLING (Premium Feel) ---
const styles = {
  container: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: {
    backgroundColor: '#fff',
    padding: '15px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  navTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  logo: { fontSize: '24px', fontWeight: '900', letterSpacing: '-1px', cursor: 'pointer' },
  cartIcon: { position: 'relative', fontSize: '22px', cursor: 'pointer' },
  cartBadge: {
    position: 'absolute', top: '-5px', right: '-8px',
    backgroundColor: '#E23744', color: '#fff',
    fontSize: '10px', padding: '2px 6px', borderRadius: '10px'
  },
  searchBar: {
    width: '100%', padding: '12px 15px', borderRadius: '12px',
    border: '1px solid #eee', backgroundColor: '#f1f3f5', fontSize: '14px',
    outline: 'none'
  },
  categoryScroll: {
    display: 'flex', gap: '10px', padding: '15px 20px',
    overflowX: 'auto', whiteSpace: 'nowrap', backgroundColor: '#fff'
  },
  chip: {
    padding: '8px 18px', borderRadius: '20px', border: '1px solid #eee',
    backgroundColor: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  chipActive: {
    padding: '8px 18px', borderRadius: '20px', border: '1px solid #E23744',
    backgroundColor: '#E23744', color: '#fff', fontSize: '13px', fontWeight: '600'
  },
  main: { padding: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: '800', color: '#222' },
  itemCount: { fontSize: '12px', color: '#888', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' },
  card: {
    backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)', transition: 'transform 0.2s'
  },
  imgWrapper: { position: 'relative', height: '150px', padding: '15px', textAlign: 'center' },
  img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  categoryBadge: {
    position: 'absolute', top: '10px', left: '10px',
    backgroundColor: '#f8f9fa', fontSize: '9px', fontWeight: '800',
    padding: '3px 8px', borderRadius: '5px', color: '#555', textTransform: 'uppercase'
  },
  info: { padding: '15px', paddingTop: '0' },
  shopName: { fontSize: '10px', color: '#E23744', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' },
  pName: { fontSize: '14px', fontWeight: '700', margin: '0 0 10px 0', height: '34px', overflow: 'hidden' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '16px', fontWeight: '800' },
  oldPrice: { fontSize: '11px', color: '#aaa', textDecoration: 'line-through', marginLeft: '5px' },
  addBtn: {
    backgroundColor: '#fff', color: '#E23744', border: '1px solid #E23744',
    padding: '5px 15px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', cursor: 'pointer'
  },
  loader: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#888' }
};

export default Home;