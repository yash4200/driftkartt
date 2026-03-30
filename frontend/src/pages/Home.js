import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState("Your Neighborhood");
  const navigate = useNavigate();

  useEffect(() => {
    // 🚩 Real-time Location Fetch (City Name)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          setUserCity(res.data.address.city || res.data.address.suburb || "Nearby");
        } catch (e) { console.log("Location Name Error"); }
      });
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    localStorage.setItem('cartItem', JSON.stringify(product));
    navigate('/checkout');
  };

  const renderHorizontalSection = (title, categoryKeywords, icon) => {
    const sectionProducts = products.filter(p =>
      categoryKeywords.some(key => p.category?.toLowerCase().includes(key.toLowerCase()))
    );

    if (sectionProducts.length === 0) return null;

    return (
      <div key={title} style={styles.sectionWrapper}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{icon} {title}</h2>
          {/* 🚩 FIX: Iska path App.js ke '/listing' se match kar diya hai ab 404 nahi aayega */}
          <span style={styles.seeAll} onClick={() => navigate(`/listing?cat=${categoryKeywords[0]}`)}>
            See all
          </span>
        </div>
        <div style={styles.horizontalScroll}>
          {sectionProducts.map((p) => {
            const discount = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
            return (
              <div key={p._id} style={styles.smallCard} onClick={() => addToCart(p)}>
                {discount > 0 && <div style={styles.discountBadge}>{discount}% OFF</div>}
                <div style={styles.timeTagSmall}>⚡ 12 MINS</div>
                <div style={styles.smallImgWrapper}>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={styles.smallImg}
                    loading="lazy" // Instant loading optimization
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/3081/3081840.png"; // Cute Grocery Icon as fallback
                    }}
                  />
                </div>
                <p style={styles.smallName}>{p.name}</p>
                {/* 🚩 Dynamic Shop Name Display */}
                <p style={styles.smallShopName}>📍 {p.shopName || "Local Store"}</p>
                <div style={styles.smallPriceRow}>
                  <span style={styles.smallPrice}>₹{p.price}</span>
                  <button style={styles.smallAddBtn}>ADD</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <div style={styles.loader}>Setting up DriftKart for you...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerMain}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>Drift<span style={{ color: '#E23744' }}>Kart</span></h1>
          <div style={styles.searchContainer}>
            <input type="text" placeholder={`Search in ${userCity}...`} style={styles.searchBar} />
          </div>
        </div>
      </header>

      <div style={styles.quickNav}>
        <div style={styles.storeBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🏠</span>
            <div>
              <p style={styles.bannerLabel}>DELIVERING TO</p>
              <h4 style={styles.bannerTitle}>{userCity} • Neighborhood</h4>
            </div>
          </div>
          <div style={styles.deliveryBadge}>⚡ 12 MINS</div>
        </div>
      </div>

      <main style={styles.main}>
        {renderHorizontalSection("Grocery & Kitchen", ["grocery", "atta"], "🥦")}
        {renderHorizontalSection("Snacks & Drinks", ["snacks", "maggi", "drinks"], "🥤")}
        {renderHorizontalSection("Personal Care", ["beauty", "personal"], "💄")}
      </main>
    </div>
  );
};

const styles = {
  // --- Sab Styles Same Hain, Bas Discount aur Location Tag Add Kiya Hai ---
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
  smallCard: { minWidth: '145px', maxWidth: '145px', border: '1px solid #f2f2f2', borderRadius: '16px', padding: '10px', position: 'relative', cursor: 'pointer', backgroundColor: '#fff' },
  smallImgWrapper: { height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' },
  smallImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  smallName: { fontSize: '12px', fontWeight: '700', margin: '0 0 3px 0', height: '32px', overflow: 'hidden', color: '#333' },
  smallShopName: { fontSize: '10px', color: '#E23744', margin: '0 0 10px 0', fontWeight: '600' },
  smallPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  smallPrice: { fontSize: '14px', fontWeight: '800', color: '#000' },
  smallAddBtn: { backgroundColor: '#fff', border: '1px solid #E23744', color: '#E23744', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' },
  timeTagSmall: { position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 5px', borderRadius: '4px', fontSize: '8px', fontWeight: '900', border: '1px solid #f0f0f0', zIndex: 1 },
  discountBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#2563EB', color: '#fff', padding: '2px 8px', borderBottomLeftRadius: '10px', borderTopRightRadius: '16px', fontSize: '9px', fontWeight: '900', zIndex: 2 },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '700', color: '#E23744' }
};

export default Home;