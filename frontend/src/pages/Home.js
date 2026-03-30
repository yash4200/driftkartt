import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 🚩 1. Request Location Permission
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => { }, () => { });
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    localStorage.setItem('cartItem', JSON.stringify(product));
    navigate('/checkout');
  };

  // 🚩 SECTION RENDERER: Filter based on Category from Seed.js
  const renderSection = (title, categoryName, icon) => {
    const sectionProducts = products.filter(p =>
      p.category?.toLowerCase() === categoryName.toLowerCase()
    );

    if (sectionProducts.length === 0) return null;

    return (
      <div key={title} style={styles.sectionWrapper}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{icon} {title}</h2>
          <span style={styles.seeAll} onClick={() => navigate('/products')}>See all</span>
        </div>
        <div style={styles.horizontalScroll}>
          {sectionProducts.map((p) => (
            <div key={p._id} style={styles.smallCard} onClick={() => addToCart(p)}>
              <div style={styles.timeTagSmall}>⚡ 12 MINS</div>
              <div style={styles.smallImgWrapper}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={styles.smallImg}
                  onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/1162/1162456.png"; }}
                />
              </div>
              <p style={styles.smallName}>{p.name}</p>
              <p style={styles.smallShopName}>{p.shopName || "Local Partner"}</p>
              <div style={styles.smallPriceRow}>
                <div>
                  <span style={styles.smallPrice}>₹{p.price}</span>
                  {p.originalPrice && <span style={styles.smallOldPrice}>₹{p.originalPrice}</span>}
                </div>
                <button style={styles.smallAddBtn} onClick={(e) => { e.stopPropagation(); addToCart(p); }}>ADD</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div style={styles.loader}>⚡ Bringing the market to you...</div>;

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
              placeholder="Search local stores & products..."
              style={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* --- QUICK STATS SECTION --- */}
      <div style={styles.quickNav}>
        <div style={styles.storeBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏪</span>
            <div>
              <p style={styles.bannerLabel}>SHOP FROM NEIGHBORHOOD</p>
              <h4 style={styles.bannerTitle}>Serving Your Area • <span style={{ color: '#2E7D32' }}>Nearby</span></h4>
            </div>
          </div>
          <div style={styles.deliveryBadge}>⚡ 12 MINS</div>
        </div>
      </div>

      <main style={styles.main}>
        {/* 🚩 SECTIONS Mapped to your Seed.js Categories */}
        {renderSection("Grocery & Kitchen", "Grocery", "🥦")}
        {renderSection("Snacks & Drinks", "Snacks", "🥤")}
        {renderSection("Beauty & Personal Care", "Beauty", "💄")}

        {/* Stores Spotlight Banner */}
        <div style={styles.spotlightBanner}>
          <h3 style={{ margin: 0, fontSize: '15px' }}>Stores in Spotlight 🔦</h3>
          <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>Verified local merchants</p>
        </div>

        {renderSection("Pure and Organic", "Organic", "🍃")}
        {renderSection("Cool Off Frozen Dessert", "Frozen", "🍦")}
        {renderSection("Sneakerheads Corner", "Shoes", "👟")}
        {renderSection("Sweet Munching Delights", "Sweets", "🍫")}
        {renderSection("From School to Business", "Stationery", "📚")}
        {renderSection("Daily Needs", "Daily Needs", "🧺")}
      </main>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { backgroundColor: '#fff', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #eee' },
  headerMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' },
  logo: { fontSize: '22px', fontWeight: '900', cursor: 'pointer', margin: 0 },
  searchContainer: { flexGrow: 1, maxWidth: '600px' },
  searchBar: { width: '100%', padding: '10px 15px', borderRadius: '10px', border: 'none', backgroundColor: '#F0F2F5', fontSize: '13px', outline: 'none' },

  quickNav: { padding: '10px 20px' },
  storeBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#F8F9FB', borderRadius: '16px', border: '1px solid #EDF2F7' },
  bannerLabel: { fontSize: '9px', color: '#888', fontWeight: '800', margin: 0, letterSpacing: '0.5px' },
  bannerTitle: { fontSize: '13px', fontWeight: '700', margin: 0 },
  deliveryBadge: { backgroundColor: '#000', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900' },

  main: { paddingBottom: '60px' },
  sectionWrapper: { padding: '25px 0 0 20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', paddingRight: '20px', marginBottom: '15px', alignItems: 'center' },
  sectionTitle: { fontSize: '17px', fontWeight: '800', margin: 0, color: '#1a1a1a' },
  seeAll: { color: '#E23744', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },

  horizontalScroll: { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' },
  smallCard: { minWidth: '150px', maxWidth: '150px', border: '1px solid #f2f2f2', borderRadius: '16px', padding: '12px', position: 'relative', cursor: 'pointer', backgroundColor: '#fff' },
  smallImgWrapper: { height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' },
  smallImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  smallName: { fontSize: '12px', fontWeight: '700', margin: '0 0 4px 0', height: '32px', overflow: 'hidden', color: '#333', lineHeight: '1.2' },
  smallShopName: { fontSize: '10px', color: '#999', margin: '0 0 10px 0', fontWeight: '500' },
  smallPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  smallPrice: { fontSize: '14px', fontWeight: '800', color: '#000' },
  smallOldPrice: { fontSize: '10px', color: '#aaa', textDecoration: 'line-through', marginLeft: '5px' },
  smallAddBtn: { backgroundColor: '#fff', border: '1px solid #E23744', color: '#E23744', borderRadius: '6px', padding: '5px 12px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' },
  timeTagSmall: { position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px', fontSize: '8px', fontWeight: '900', border: '1px solid #eee', zIndex: 1 },

  spotlightBanner: { margin: '20px', padding: '20px', backgroundColor: '#FFF5F5', borderRadius: '18px', border: '1px solid #FED7D7', textAlign: 'left' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '700', color: '#E23744' }
};

export default Home;