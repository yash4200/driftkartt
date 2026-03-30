import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 🚩 Request Location (Backend logic)
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

  // 🚩 STEP 1: SECTION RENDERER LOGIC (Same UI Structure)
  const renderHorizontalSection = (title, categoryKeywords, icon) => {
    // Keywords matching for easy backend mapping
    const sectionProducts = products.filter(p =>
      categoryKeywords.some(key => p.category?.toLowerCase().includes(key.toLowerCase()) || p.name?.toLowerCase().includes(key.toLowerCase()))
    );

    if (sectionProducts.length === 0) return null;

    return (
      <div key={title} style={styles.sectionWrapper}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{icon} {title}</h2>
          {/* 🚩 2. SEE ALL CLICK PAR US CATEGORY PE NAVIGATE */}
          <span style={styles.seeAll} onClick={() => navigate(`/category/${categoryKeywords[0]}`)}>
            See all
          </span>
        </div>
        <div style={styles.horizontalScroll}>
          {sectionProducts.map((p) => (
            <div key={p._id} style={styles.smallCard} onClick={() => addToCart(p)}>
              <div style={styles.timeTagSmall}>⚡ 12 MINS</div>
              <div style={styles.smallImgWrapper}>
                {/* 🚩 3. DYNAMIC IMAGE & FALLBACK */}
                <img
                  src={p.image}
                  alt={p.name}
                  style={styles.smallImg}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Agar real image nahi load hui, tabhi monitor placeholder dikhe
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/1162/1162456.png";
                  }}
                />
              </div>
              <p style={styles.smallName}>{p.name}</p>
              <p style={styles.smallShopName}>{p.shopName || "Local Partner"}</p>
              <div style={styles.smallPriceRow}>
                <span style={styles.smallPrice}>₹{p.price}</span>
                <button style={styles.smallAddBtn} onClick={(e) => { e.stopPropagation(); addToCart(p); }}>ADD</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div style={styles.loader}>Getting DriftKart ready...</div>;

  return (
    <div style={styles.container}>
      {/* --- HEADER (Same as your UI) --- */}
      <header style={styles.header}>
        <div style={styles.headerMain}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>Drift<span style={{ color: '#E23744' }}>Kart</span></h1>
          <div style={styles.searchContainer}>
            <input type="text" placeholder="Search local stores..." style={styles.searchBar} />
          </div>
        </div>
      </header>

      {/* --- QUICK STATS (Same as your UI) --- */}
      <div style={styles.quickNav}>
        <div style={styles.storeBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🏪</span>
            <div>
              <p style={styles.bannerLabel}>SHOP FROM NEIGHBORHOOD</p>
              <h4 style={styles.bannerTitle}>Serving Your Area • Nearby</h4>
            </div>
          </div>
          <div style={styles.deliveryBadge}>⚡ 12 MINS</div>
        </div>
      </div>

      <main style={styles.main}>
        {/* --- DYNAMIC SECTIONS with your keywords --- */}
        {renderHorizontalSection("Grocery & Kitchen", ["grocery", "atta", "oil"], "🥦")}
        {renderHorizontalSection("Snacks & Drinks", ["snacks", "maggi", "drinks"], "🥤")}
        {renderHorizontalSection("Beauty & Personal Care", ["beauty", "soap", "shampoo"], "💄")}
      </main>
    </div>
  );
};

const styles = {
  // 🚩 TERI WAHI CLEAN UI BINA KISI CHANGE KE
  container: { backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { backgroundColor: '#fff', padding: '10px 20px', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #f0f0f0' },
  headerMain: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' },
  logo: { fontSize: '22px', fontWeight: '900', cursor: 'pointer', margin: 0 },
  searchContainer: { flexGrow: 1, maxWidth: '600px' },
  searchBar: { width: '100%', padding: '10px 15px', borderRadius: '10px', border: 'none', backgroundColor: '#F3F5F7', fontSize: '13px', outline: 'none' },
  quickNav: { padding: '15px 20px' },
  storeBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', backgroundColor: '#F8F9FB', borderRadius: '14px', border: '1px solid #EDF2F7' },
  bannerLabel: { fontSize: '9px', color: '#888', fontWeight: '800', margin: 0, letterSpacing: '0.5px' },
  bannerTitle: { fontSize: '13px', fontWeight: '700', margin: 0 },
  deliveryBadge: { backgroundColor: '#000', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900' },
  main: { paddingBottom: '40px' },
  sectionWrapper: { padding: '20px 0 0 20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', paddingRight: '20px', marginBottom: '15px', alignItems: 'center' },
  sectionTitle: { fontSize: '16px', fontWeight: '800', margin: 0, color: '#1a1a1a' },
  seeAll: { color: '#E23744', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  horizontalScroll: { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' },
  smallCard: { minWidth: '135px', maxWidth: '135px', border: '1px solid #f2f2f2', borderRadius: '16px', padding: '10px', position: 'relative', cursor: 'pointer', backgroundColor: '#fff' },
  smallImgWrapper: { height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' },
  smallImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  smallName: { fontSize: '11px', fontWeight: '700', margin: '0 0 3px 0', height: '28px', overflow: 'hidden', color: '#333' },
  smallShopName: { fontSize: '9px', color: '#aaa', margin: '0 0 10px 0', fontWeight: '500' },
  smallPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  smallPrice: { fontSize: '13px', fontWeight: '800', color: '#000' },
  smallAddBtn: { backgroundColor: '#fff', border: '1px solid #E23744', color: '#E23744', borderRadius: '6px', padding: '4px 10px', fontSize: '10px', fontWeight: '800', cursor: 'pointer' },
  timeTagSmall: { position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '2px 5px', borderRadius: '4px', fontSize: '8px', fontWeight: '900', border: '1px solid #f2f2f2', zIndex: 1 },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '700', color: '#E23744' }
};

export default Home;