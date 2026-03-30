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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]); // 🛒 Cart State
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Load existing cart from local storage
    const savedCart = JSON.parse(localStorage.getItem('driftCart')) || [];
    setCart(savedCart);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          setUserCity(res.data.address.suburb || res.data.address.city || "Nearby Market");
        } catch (e) { setUserCity("Local Market"); }
      });
    }

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

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDeals([]);
    } else {
      const results = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const sorted = [...results].sort((a, b) => a.price - b.price);
      setFilteredDeals(sorted);
    }
  }, [searchTerm, products]);

  // 🔥 UPDATED: Multi-Item Add Logic
  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
      alert("Please login first! 🛒");
      navigate('/login');
      return;
    }

    let currentCart = [...cart];
    const existingItemIndex = currentCart.findIndex(i => i._id === item._id);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...item, quantity: 1 });
    }

    setCart(currentCart);
    localStorage.setItem('driftCart', JSON.stringify(currentCart));
  };

  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.topRow}>
          <div style={styles.locRow}>
            <span style={styles.locLabel}>ORDERING FROM</span>
            <h3 style={styles.locName}>📍 {userCity}</h3>
          </div>
          <div style={styles.profileIcon} onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}>
            {isLoggedIn ? <div style={styles.userInitial}>N</div> : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search 'Milk', 'Atta' or 'Maggi' to compare..."
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main style={styles.main}>
        {searchTerm === "" ? (
          <>
            <h2 style={styles.sectionTitle}>Top Brands for you</h2>
            <div style={styles.shopScroll}>
              {shops.map(shop => (
                /* 🚩 Added onClick here to navigate to shop detail page */
                <div key={shop._id} style={{ ...styles.shopCard, cursor: 'pointer' }} onClick={() => navigate(`/shop/${shop.name}`)}>
                  <img src={shop.image} alt={shop.name} style={styles.shopCircle} />
                  <p style={styles.shopNameText}>{shop.name}</p>
                  <div style={styles.shopBadge}>
                    <span style={styles.ratingBox}>⭐ {shop.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={styles.sectionTitle}>Daily Essentials</h2>
            <div style={styles.grid}>
              {products.slice(0, 8).map(item => (
                <ProductCard key={item._id} item={item} onAdd={handleAddToCart} />
              ))}
            </div>
          </>
        ) : (
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
            )) : <p style={{ textAlign: 'center', marginTop: '20px' }}>No local shops found.</p>}
          </div>
        )}
      </main>

      {/* 🚩 FLOATING VIEW CART BAR (Zomato Style) */}
      {cart.length > 0 && (
        <div style={styles.floatingCart} onClick={() => navigate('/checkout')}>
          <div style={styles.cartInfo}>
            <span style={styles.cartCount}>{totalItemsInCart} ITEM{totalItemsInCart > 1 ? 'S' : ''}</span>
            <span style={styles.cartSub}>Items added from local shops</span>
          </div>
          <div style={styles.viewCartBtn}>
            View Cart 🛒
          </div>
        </div>
      )}
    </div>
  );
};

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

const styles = {
  container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '80px' },
  header: { padding: '20px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 100, borderBottom: '1px solid #f2f2f2' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  locLabel: { fontSize: '10px', fontWeight: '800', color: '#828282' },
  locName: { margin: '2px 0 15px 0', color: '#1c1c1c', fontSize: '16px' },
  profileIcon: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  userInitial: { color: '#E23744', fontWeight: '900', fontSize: '18px' },
  searchContainer: { backgroundColor: '#f3f3f3', borderRadius: '12px', padding: '12px' },
  searchBar: { width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '600' },
  main: { padding: '20px' },
  sectionTitle: { fontSize: '18px', fontWeight: '850', marginBottom: '15px' },
  shopScroll: { display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '20px', scrollbarWidth: 'none' },
  shopCard: { minWidth: '100px', textAlign: 'center' },
  shopCircle: { width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e8e8e8' },
  shopNameText: { fontSize: '12px', fontWeight: '700', marginTop: '8px' },
  ratingBox: { backgroundColor: '#257E3E', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  pCard: { border: '1px solid #f2f2f2', borderRadius: '15px', padding: '10px' },
  pImg: { width: '100%', height: '80px', objectFit: 'contain' },
  pName: { fontSize: '13px', fontWeight: '700', margin: '8px 0 2px 0' },
  pShop: { fontSize: '10px', color: '#888' },
  pFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  pPrice: { fontWeight: '900', fontSize: '15px' },
  pAdd: { border: '1px solid #E23744', background: '#fff', color: '#E23744', borderRadius: '6px', padding: '4px 12px', fontWeight: '800' },
  bestCard: { border: '2px solid #E23744', borderRadius: '16px', padding: '15px', marginBottom: '12px', position: 'relative' },
  normalCard: { border: '1px solid #e8e8e8', borderRadius: '16px', padding: '15px', marginBottom: '12px' },
  dealTag: { position: 'absolute', top: '-10px', left: '15px', backgroundColor: '#E23744', color: '#fff', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: '900' },
  cardFlex: { display: 'flex', alignItems: 'center', gap: '15px' },
  dealImg: { width: '50px', height: '50px', objectFit: 'contain' },
  dealInfo: { flex: 1 },
  dealTitle: { fontSize: '14px', fontWeight: '800', margin: 0 },
  dealShopName: { fontSize: '11px', color: '#4f4f4f' },
  distText: { fontSize: '10px', color: '#9c9c9c' },
  dealPriceArea: { textAlign: 'right' },
  dealPrice: { fontSize: '18px', fontWeight: '900' },
  btnBest: { backgroundColor: '#E23744', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 15px', fontWeight: '800' },
  btnNormal: { backgroundColor: '#1c1c1c', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 15px', fontWeight: '800' },

  floatingCart: {
    position: 'fixed', bottom: '20px', left: '15px', right: '15px',
    backgroundColor: '#E23744', padding: '12px 20px', borderRadius: '12px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 8px 20px rgba(226, 55, 68, 0.3)', cursor: 'pointer', zIndex: 1000
  },
  cartInfo: { display: 'flex', flexDirection: 'column' },
  cartCount: { color: '#fff', fontWeight: '900', fontSize: '14px' },
  cartSub: { color: 'rgba(255,255,255,0.8)', fontSize: '10px', fontWeight: '600' },
  viewCartBtn: { color: '#fff', fontWeight: '800', fontSize: '14px' }
};

export default Home;