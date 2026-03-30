import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCity] = useState("Your Area");
  const navigate = useNavigate();

  useEffect(() => {
    // 🚩 1 & 5. Real-time Location Access Logic
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse Geocoding to get the city name in English
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const city = res.data.address.city || res.data.address.suburb || res.data.address.town || "Nearby";
          setUserCity(city);
        } catch (e) {
          console.log("Location Error");
          setUserCity("Nearby");
        }
      }, () => {
        setUserCity("Nearby");
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

  // 🔍 3. Live Search Logic (Filters through name, category, and shop)
  useEffect(() => {
    const results = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  // 🛡️ 2 & 4. Login Guard & English Alert
  const handleAddToCart = (product) => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

    if (!isLoggedIn) {
      // 🚩 Alert in English with a cute tone
      alert("Wait a second! ✨ Please log in to your account to start shopping. 🛒");
      navigate('/login');
    } else {
      localStorage.setItem('cartItem', JSON.stringify(product));
      navigate('/checkout');
    }
  };

  if (loading) return <div style={styles.loader}>Getting DriftKart ready for you... ✨</div>;

  return (
    <div style={styles.container}>
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.headerMain}>
          <h1 style={styles.logo} onClick={() => setSearchTerm("")}>Drift<span style={{ color: '#E23744' }}>Kart</span></h1>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder={`Search essentials in ${userCity}...`}
              style={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div onClick={() => navigate('/login')} style={styles.profileIcon}>👤</div>
        </div>
      </header>

      <main style={styles.main}>
        {searchTerm !== "" ? (
          // 🔍 SEARCH RESULTS VIEW
          <div style={{ padding: '20px' }}>
            <h2 style={styles.sectionTitle}>Yay! We found these:</h2>
            <div style={styles.searchGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => <ProductCard key={p._id} p={p} onAdd={handleAddToCart} />)
              ) : (
                <p style={styles.noResult}>Oops! No products match your search. 🌸</p>
              )}
            </div>
          </div>
        ) : (
          // 🏠 HOME SECTIONS VIEW
          <>
            <div style={styles.quickNav}>
              <div style={styles.storeBanner}>
                <div>
                  <p style={styles.bannerLabel}>DELIVERING TO</p>
                  <h4 style={styles.bannerTitle}>📍 {userCity} • Neighborhood</h4>
                </div>
                <div style={styles.deliveryBadge}>⚡ 12 MINS</div>
              </div>
            </div>
            {renderSection("Grocery & Kitchen", ["grocery", "atta", "oil"], "🥦", products, handleAddToCart, navigate)}
            {renderSection("Snacks & Drinks", ["snacks", "maggi", "drinks"], "🥤", products, handleAddToCart, navigate)}
            {renderSection("Beauty & Personal Care", ["beauty", "soap", "shampoo"], "💄", products, handleAddToCart, navigate)}
          </>
        )}
      </main>
    </div>
  );
};

// --- HELPER: SECTION RENDERER ---
const renderSection = (title, keys, icon, products, onAdd, navigate) => {
  const items = products.filter(p => keys.some(k => p.category?.toLowerCase().includes(k)));
  if (items.length === 0) return null;
  return (
    <div style={styles.sectionWrapper}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{icon} {title}</h2>
        <span style={styles.seeAll} onClick={() => navigate(`/listing?cat=${keys[0]}`)}>See all</span>
      </div>
      <div style={styles.horizontalScroll}>
        {items.map(p => <ProductCard key={p._id} p={p} onAdd={onAdd} />)}
      </div>
    </div>
  );
};

// --- HELPER: PRODUCT CARD (UI PROTECTED) ---
const ProductCard = ({ p, onAdd }) => (
  <div style={styles.smallCard} onClick={() => onAdd(p)}>
    <div style={styles.timeTagSmall}>12 MINS</div>
    <div style={styles.smallImgWrapper}>
      <img
        src={p.image}
        alt={p.name}
        style={styles.smallImg}
        loading="lazy"
        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/3081/3081840.png"}
      />
    </div>
    <p style={styles.smallName}>{p.name}</p>
    <p style={styles.smallShopName}>📍 {p.shopName || "Local Partner"}</p>
    <div style={styles.smallPriceRow}>
      <span style={styles.smallPrice}>₹{p.price}</span>
      <button style={styles.smallAddBtn}>ADD</button>
    </div>
  </div>
);

const styles = {
  container: { backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { padding: '12px 20px', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 100 },
  headerMain: { display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'space-between' },
  logo: { fontSize: '22px', fontWeight: '900', margin: 0, cursor: 'pointer' },
  profileIcon: { cursor: 'pointer', fontSize: '22px', color: '#333' },
  searchContainer: { flex: 1, maxWidth: '500px' },
  searchBar: { width: '100%', padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#F3F5F7', fontSize: '14px', outline: 'none' },
  main: { paddingBottom: '30px' },
  sectionWrapper: { padding: '20px 0 0 20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', paddingRight: '20px', marginBottom: '12px', alignItems: 'center' },
  sectionTitle: { fontSize: '17px', fontWeight: '800', margin: 0 },
  seeAll: { color: '#E23744', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
  horizontalScroll: { display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', scrollbarWidth: 'none' },
  smallCard: { minWidth: '145px', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '12px', position: 'relative', cursor: 'pointer' },
  smallImgWrapper: { height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  smallImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  smallName: { fontSize: '13px', fontWeight: '700', height: '34px', overflow: 'hidden', marginTop: '10px', color: '#333' },
  smallShopName: { fontSize: '10px', color: '#E23744', margin: '6px 0', fontWeight: '600' },
  smallPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  smallPrice: { fontWeight: '800', fontSize: '15px' },
  smallAddBtn: { border: '1px solid #E23744', color: '#E23744', background: '#fff', padding: '5px 14px', borderRadius: '8px', fontWeight: '800', fontSize: '11px' },
  timeTagSmall: { position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '5px', fontSize: '9px', fontWeight: '900', border: '1px solid #eee' },
  searchGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: '15px' },
  noResult: { color: '#888', textAlign: 'center', marginTop: '40px', width: '100%' },
  quickNav: { padding: '15px 20px' },
  storeBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F9FB', padding: '15px', borderRadius: '15px', border: '1px solid #eee' },
  bannerLabel: { fontSize: '9px', color: '#888', fontWeight: '800', margin: 0 },
  bannerTitle: { fontSize: '14px', fontWeight: '700', margin: 0 },
  deliveryBadge: { background: '#000', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '900' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '16px', fontWeight: '700', color: '#E23744' }
};

export default Home;