import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [userCity, setUserCity] = useState("Detecting...");
  const navigate = useNavigate();

  useEffect(() => {
    // 📍 Real-time Location Detection
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          setUserCity(res.data.address.suburb || res.data.address.city || "Nearby Market");
        } catch (e) { setUserCity("Local Market"); }
      });
    }

    // Fetch Shops & Products (Backend se data khichna)
    const fetchData = async () => {
      try {
        const [shopRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/shops`),
          axios.get(`${API_URL}/products`)
        ]);
        setShops(shopRes.data);
        setProducts(prodRes.data);
      } catch (err) { console.log("Fetch Error", err); }
    };
    fetchData();
  }, []);

  // 🔥 THE COMPARISON ENGINE: Price filter logic
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDeals([]);
    } else {
      const results = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Sabse sasta (Lowest Price) sabse upar
      const sorted = [...results].sort((a, b) => a.price - b.price);
      setFilteredDeals(sorted);
    }
  }, [searchTerm, products]);

  const handleAddToCart = (item) => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
      alert("Wait a second! ✨ Please log in to grab this deal. 🛒");
      navigate('/login');
    } else {
      localStorage.setItem('cartItem', JSON.stringify(item));
      navigate('/checkout');
    }
  };

  return (
    <div style={styles.container}>
      {/* 📍 Header: Zomato Style Location & Search */}
      <header style={styles.header}>
        <div style={styles.locRow}>
          <span style={styles.locLabel}>ORDERING FROM</span>
          <h3 style={styles.locName}>📍 {userCity}</h3>
        </div>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search 'Milk', 'Atta' or 'Maggi' to compare prices..."
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main style={styles.main}>
        {searchTerm === "" ? (
          <>
            {/* 🏢 Section 1: Top Local Brands (Shops) */}
            <h2 style={styles.sectionTitle}>Top Brands for you</h2>
            <div style={styles.shopScroll}>
              {shops.map(shop => (
                <div key={shop._id} style={styles.shopCard}>
                  <img src={shop.image} alt={shop.name} style={styles.shopCircle} />
                  <p style={styles.shopNameText}>{shop.name}</p>
                  <div style={styles.shopBadge}>
                    <span style={styles.ratingBox}>⭐ {shop.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 📦 Section 2: Popular Items */}
            <h2 style={styles.sectionTitle}>Daily Essentials</h2>
            <div style={styles.grid}>
              {products.slice(0, 8).map(item => (
                <ProductCard key={item._id} item={item} onAdd={handleAddToCart} />
              ))}
            </div>
          </>
        ) : (
          /* ⚖️ Section 3: The Comparison View (Best Deal Engine) */
          <div style={styles.comparisonResults}>
            <h2 style={styles.sectionTitle}>Best Deals for "{searchTerm}"</h2>
            {filteredDeals.length > 0 ? filteredDeals.map((item, index) => (
              <div key={item._id} style={index === 0 ? styles.bestCard : styles.normalCard}>
                {index === 0 && <span style={styles.dealTag}>🏆 BEST PRICE</span>}
                <div style={styles.cardFlex}>
                  <img src={item.image} alt="" style={styles.dealImg} />
                  <div style={styles.dealInfo}>
                    <h4 style={styles.dealTitle}>{item.name}</h4>
                    <p style={styles.dealShopName}>Sold by: <b>{item.shopName}</b></p>
                    <p style={styles.distText}>• 1.2 km away</p>
                  </div>
                  <div style={styles.dealPriceArea}>
                    <span style={styles.dealPrice}>₹{item.price}</span>
                    <button
                      style={index === 0 ? styles.btnBest : styles.btnNormal}
                      onClick={() => handleAddToCart(item)}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            )) : <p style={{ textAlign: 'center', marginTop: '20px' }}>No local shops found for this item.</p>}
          </div>
        )}
      </main>
    </div>
  );
};

// --- Sub-Component: Product Card ---
const ProductCard = ({ item, onAdd }) => (
  <div style={styles.pCard}>
    <img src={item.image} alt="" style={styles.pImg} />
    <h4 style={styles.pName}>{item.name}</h4>
    <p style={styles.pShop}>{item.shopName}</p>
    <div style={styles.pFooter}>
      <span style={styles.pPrice}>₹{item.price}</span>
      <button style={styles.pAdd} onClick={() => onAdd(item)}>ADD</button>
    </div>
  </div>
);

// --- Styles (Zomato UI Vibes) ---
const styles = {
  container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', minHeight: '100vh' },
  header: { padding: '20px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 100, borderBottom: '1px solid #f2f2f2' },
  locLabel: { fontSize: '10px', fontWeight: '800', color: '#828282' },
  locName: { margin: '2px 0 15px 0', color: '#1c1c1c' },
  searchContainer: { backgroundColor: '#f3f3f3', borderRadius: '12px', padding: '12px' },
  searchBar: { width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '600' },
  main: { padding: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: '850', marginBottom: '15px', color: '#1c1c1c' },

  // Shop Circle Scroll
  shopScroll: { display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '20px', scrollbarWidth: 'none' },
  shopCard: { minWidth: '100px', textAlign: 'center' },
  shopCircle: { width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e8e8e8' },
  shopNameText: { fontSize: '12px', fontWeight: '700', marginTop: '8px', marginBottom: '2px' },
  ratingBox: { backgroundColor: '#257E3E', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' },

  // Grid Style
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  pCard: { border: '1px solid #f2f2f2', borderRadius: '15px', padding: '10px' },
  pImg: { width: '100%', height: '100px', objectFit: 'contain' },
  pName: { fontSize: '13px', fontWeight: '700', margin: '8px 0 2px 0' },
  pShop: { fontSize: '10px', color: '#888' },
  pFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  pPrice: { fontWeight: '900', fontSize: '15px' },
  pAdd: { border: '1px solid #E23744', background: '#fff', color: '#E23744', borderRadius: '6px', padding: '4px 12px', fontWeight: '800', fontSize: '11px' },

  // Comparison Logic Cards
  bestCard: { border: '2px solid #E23744', borderRadius: '16px', padding: '15px', marginBottom: '12px', position: 'relative', boxShadow: '0 4px 12px rgba(226, 55, 68, 0.1)' },
  normalCard: { border: '1px solid #e8e8e8', borderRadius: '16px', padding: '15px', marginBottom: '12px' },
  dealTag: { position: 'absolute', top: '-10px', left: '15px', backgroundColor: '#E23744', color: '#fff', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: '900' },
  cardFlex: { display: 'flex', alignItems: 'center', gap: '15px' },
  dealImg: { width: '55px', height: '55px', objectFit: 'contain' },
  dealInfo: { flex: 1 },
  dealTitle: { fontSize: '15px', fontWeight: '800', margin: 0 },
  dealShopName: { fontSize: '12px', color: '#4f4f4f', margin: '2px 0' },
  distText: { fontSize: '10px', color: '#9c9c9c', margin: 0 },
  dealPriceArea: { textAlign: 'right' },
  dealPrice: { fontSize: '20px', fontWeight: '900', display: 'block' },
  btnBest: { backgroundColor: '#E23744', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: '800', marginTop: '5px' },
  btnNormal: { backgroundColor: '#1c1c1c', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 18px', fontWeight: '800', marginTop: '5px' }
};

export default Home;