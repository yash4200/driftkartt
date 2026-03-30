import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // 🚩 REAL LOCAL STORES LOGIC
  const [localStore, setLocalStore] = useState({ name: 'Sharma Grocery Store', dist: '0.8 km' });
  const navigate = useNavigate();

  useEffect(() => {
    // Local Shop Moto: Neighbourhood stores list
    const stores = [
      { name: 'Sharma Grocery & Daily Needs', dist: '0.6 km' },
      { name: 'All In One General Store', dist: '1.2 km' },
      { name: 'Gupta Ji Supermart', dist: '0.9 km' }
    ];
    setLocalStore(stores[Math.floor(Math.random() * stores.length)]);

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

  const addToCart = (product) => {
    localStorage.setItem('cartItem', JSON.stringify(product));
    navigate('/checkout');
  };

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
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.headerMain}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>
            Drift<span style={{ color: '#E23744' }}>Kart</span>
          </h1>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search local products..."
              style={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.headerIcons}>
            <div style={styles.iconItem} onClick={() => navigate('/login')}>👤 Login</div>
            <div style={styles.iconItem} onClick={() => navigate('/checkout')}>
              🛒 Cart <span style={styles.cartBadge}>{products.length > 0 ? '1' : '0'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 🚩 UPDATED: LOCAL SHOP SECTION (Supporting Neighborhood Shops) */}
      <div style={styles.storeSection}>
        <div style={styles.storeCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.storeIconCircle}>🏪</div>
            <div>
              <p style={styles.storeLabel}>Delivering from Local Partner</p>
              <h4 style={styles.storeName}>{localStore.name} • <span style={{ color: '#2E7D32' }}>{localStore.dist}</span></h4>
              <p style={{ margin: 0, fontSize: '10px', color: '#999' }}>Empowering local retailers nearby</p>
            </div>
          </div>
          <div style={styles.blinkitBadge}>⚡ 12 MINS</div>
        </div>
      </div>

      {/* --- CATEGORIES --- */}
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
        <div style={styles.grid}>
          {filteredProducts.map((p) => (
            <div key={p._id} style={styles.card} onClick={() => addToCart(p)}>
              <div style={styles.imgWrapper}>
                <div style={styles.timeTag}>⚡ 12 MINS</div>
                {p.originalPrice && (
                  <span style={styles.discountBadge}>
                    {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
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
                  <button
                    style={styles.addBtn}
                    onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#F4F6F8', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { backgroundColor: '#fff', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #eee' },
  headerMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' },
  logo: { fontSize: '20px', fontWeight: '900', cursor: 'pointer', margin: 0, color: '#000' },
  searchContainer: { flexGrow: 1, maxWidth: '500px' },
  searchBar: { width: '100%', padding: '10px 15px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#F0F2F5', fontSize: '13px', outline: 'none' },
  headerIcons: { display: 'flex', gap: '15px', alignItems: 'center' },
  iconItem: { position: 'relative', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  cartBadge: { backgroundColor: '#E23744', color: '#fff', fontSize: '9px', padding: '2px 5px', borderRadius: '10px', marginLeft: '3px' },

  storeSection: { padding: '10px 20px', backgroundColor: '#fff' },
  storeCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', backgroundColor: '#F8F9FB', borderRadius: '12px', border: '1px solid #EDF2F7' },
  storeIconCircle: { fontSize: '20px', backgroundColor: '#fff', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  storeLabel: { fontSize: '10px', color: '#888', fontWeight: '800', textTransform: 'uppercase', margin: 0 },
  storeName: { fontSize: '13px', fontWeight: '700', margin: 0 },
  blinkitBadge: { backgroundColor: '#000', color: '#fff', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900' },

  categoryScroll: { display: 'flex', gap: '8px', padding: '10px 20px', overflowX: 'auto', backgroundColor: '#fff', borderBottom: '1px solid #eee' },
  chip: { padding: '6px 14px', borderRadius: '18px', border: '1px solid #ddd', backgroundColor: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  chipActive: { padding: '6px 14px', borderRadius: '18px', backgroundColor: '#000', color: '#fff', fontSize: '12px', fontWeight: '600' },

  main: { padding: '15px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0', cursor: 'pointer' },
  imgWrapper: { position: 'relative', height: '150px', padding: '15px', textAlign: 'center' },
  img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },

  timeTag: { position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: '800', border: '1px solid #eee' },
  discountBadge: { position: 'absolute', top: '10px', left: '10px', backgroundColor: '#3182CE', fontSize: '9px', fontWeight: '900', padding: '2px 5px', borderRadius: '4px', color: '#fff' },

  info: { padding: '12px', paddingTop: 0 },
  pName: { fontSize: '13px', fontWeight: '600', margin: '0 0 8px 0', height: '32px', overflow: 'hidden' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  priceContainer: { display: 'flex', flexDirection: 'column' },
  price: { fontSize: '15px', fontWeight: '800' },
  oldPrice: { fontSize: '10px', color: '#aaa', textDecoration: 'line-through' },
  addBtn: { backgroundColor: '#fff', color: '#E23744', border: '1px solid #E23744', padding: '5px 15px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' },

  loaderContainer: { padding: '20px' },
  headerDummy: { height: '50px', backgroundColor: '#fff', borderRadius: '8px', marginBottom: '15px' },
  skeletonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' },
  skeletonCard: { backgroundColor: '#fff', height: '220px', borderRadius: '16px', padding: '10px' },
  skeletonImg: { height: '130px', backgroundColor: '#eee', borderRadius: '10px', marginBottom: '10px' },
  skeletonTextLarge: { height: '12px', backgroundColor: '#eee', width: '70%', borderRadius: '4px' }
};

export default Home;