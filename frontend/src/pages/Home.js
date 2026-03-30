import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [userCity, setUserCity] = useState("Your Market");
  const navigate = useNavigate();

  useEffect(() => {
    // 📍 Location Access (Context: Swiggy Style)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          setUserCity(res.data.address.suburb || res.data.address.city || "Nearby");
        } catch (e) { setUserCity("Nearby"); }
      });
    }

    const fetchAllMarketProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
      } catch (err) { console.log("API Error"); }
    };
    fetchAllMarketProducts();
  }, []);

  // 🔍 Comparison Engine: Filters and Sorts by Price (Low to High)
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDeals([]);
    } else {
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      // 🔥 THE MAGIC: Sort by price to show "Best Deal" first
      const sorted = [...matches].sort((a, b) => a.price - b.price);
      setFilteredDeals(sorted);
    }
  }, [searchTerm, products]);

  const handleSelectDeal = (item) => {
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
      {/* --- PREMIUM MARKET HEADER --- */}
      <header style={styles.header}>
        <div style={styles.locRow}>
          <p style={styles.locLabel}>COMPARING SHOPS IN</p>
          <h2 style={styles.locName}>📍 {userCity}</h2>
        </div>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search for any product to compare prices..."
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main style={styles.main}>
        {searchTerm === "" ? (
          <div style={styles.hero}>
            <h1 style={styles.heroText}>Stop Paying More. <br /><span style={{ color: '#E23744' }}>Compare Local Prices.</span></h1>
            <p style={styles.heroSub}>Find which local shop is offering the best deal today. ✨</p>
          </div>
        ) : (
          <div style={styles.resultsArea}>
            <h3 style={styles.resultsTitle}>Found {filteredDeals.length} options for "{searchTerm}"</h3>

            {filteredDeals.map((item, index) => (
              <div key={item._id} style={index === 0 ? styles.bestDealCard : styles.normalDealCard}>
                {index === 0 && <div style={styles.bestTag}>🏆 BEST DEAL</div>}

                <div style={styles.cardContent}>
                  <img src={item.image} alt={item.name} style={styles.prodImg} />
                  <div style={styles.info}>
                    <h4 style={styles.prodName}>{item.name}</h4>
                    <p style={styles.shopName}>Sold by: <b>{item.shopName || "Local Merchant"}</b></p>
                    <p style={styles.distTag}>• 1.2 km away</p>
                  </div>
                  <div style={styles.priceSection}>
                    <span style={styles.price}>₹{item.price}</span>
                    <button
                      style={index === 0 ? styles.buyBtnBest : styles.buyBtn}
                      onClick={() => handleSelectDeal(item)}
                    >
                      ORDER
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#F7F9FC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { backgroundColor: '#fff', padding: '20px', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 },
  locLabel: { fontSize: '10px', fontWeight: '800', color: '#888', margin: 0 },
  locName: { fontSize: '16px', margin: '2px 0 15px 0', fontWeight: '900' },
  searchBar: { width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #F3F5F7', backgroundColor: '#F3F5F7', fontSize: '14px', outline: 'none', fontWeight: '600' },
  main: { padding: '20px' },
  hero: { textAlign: 'center', marginTop: '50px' },
  heroText: { fontSize: '28px', fontWeight: '900', lineHeight: '1.2' },
  heroSub: { color: '#666', fontSize: '14px' },
  resultsArea: { display: 'flex', flexDirection: 'column', gap: '15px' },
  resultsTitle: { fontSize: '14px', fontWeight: '700', color: '#444' },

  // Best Deal Highlighting
  bestDealCard: { backgroundColor: '#fff', borderRadius: '16px', border: '2px solid #E23744', padding: '15px', position: 'relative', boxShadow: '0 4px 15px rgba(226, 55, 68, 0.1)' },
  normalDealCard: { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eee', padding: '15px' },
  bestTag: { position: 'absolute', top: '-10px', left: '15px', backgroundColor: '#E23744', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '20px' },

  cardContent: { display: 'flex', alignItems: 'center', gap: '15px' },
  prodImg: { width: '60px', height: '60px', objectFit: 'contain' },
  info: { flex: 1 },
  prodName: { fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0' },
  shopName: { fontSize: '12px', margin: 0, color: '#555' },
  distTag: { fontSize: '11px', color: '#888', margin: '2px 0 0 0' },
  priceSection: { textAlign: 'right' },
  price: { fontSize: '20px', fontWeight: '900', display: 'block', marginBottom: '5px' },
  buyBtnBest: { backgroundColor: '#E23744', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' },
  buyBtn: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }
};

export default Home;