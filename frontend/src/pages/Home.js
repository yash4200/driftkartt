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
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
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

  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
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
      {/* 🚩 TOP NAV: Logo & Location */}
      <header style={styles.header}>
        <div style={styles.topRow}>
          <div style={styles.logoGroup}>
            <h1 style={styles.mainLogo} onClick={() => navigate('/')}>Drift<span>Kart</span></h1>
            <div style={styles.locRow}>
              <span style={styles.locName}>📍 {userCity}</span>
            </div>
          </div>
          <div style={styles.profileIcon} onClick={() => navigate(isLoggedIn ? '/profile' : '/login')}>
            {isLoggedIn ? <div style={styles.userInitial}>N</div> : "👤"}
          </div>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search 'Maggi', 'Atta' or 'Coke' to compare..."
            style={styles.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <main style={styles.main}>
        {searchTerm === "" ? (
          <>
            {/* 🚩 SECTION: Stores Near You */}
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Stores near you</h2>
              <span style={styles.seeAll}>See all</span>
            </div>
            <div style={styles.shopScroll}>
              {shops.map(shop => (
                <div key={shop._id} style={styles.shopCard} onClick={() => navigate(`/shop/${shop._id}`)}>
                  <div style={styles.shopImgWrapper}>
                    <img src={shop.image} alt={shop.name} style={styles.shopCircle} />
                    <div style={styles.ratingBadge}>⭐ {shop.rating}</div>
                  </div>
                  <p style={styles.shopNameText}>{shop.name}</p>
                  <p style={styles.shopTime}>20-25 mins</p>
                </div>
              ))}
            </div>

            {/* 🚩 SECTION: Daily Essentials (Mixed Variety) */}
            <h2 style={styles.sectionTitle}>Daily Essentials</h2>
            <div style={styles.grid}>
              {/* Diversity Logic: Brand wise unique items dikhayega */}
              {products.filter((p, index, self) =>
                index === self.findIndex((t) => t.brand === p.brand)
              ).slice(0, 8).map(item => (
                <ProductCard key={item._id} item={item} onAdd={handleAddToCart} />
              ))}
            </div>
          </>
        ) : (
          /* Search Comparison Results */
          <div style={styles.comparisonResults}>
            <h2 style={styles.sectionTitle}>Best deals for "{searchTerm}"</h2>
            {filteredDeals.map((item, index) => (
              <div key={item._id} style={index === 0 ? styles.bestCard : styles.normalCard}>
                {index === 0 && <span style={styles.dealTag}>🏆 CHEAPEST OPTION</span>}
                <div style={styles.cardFlex}>
                  <img src={item.image} alt="" style={styles.dealImg} />
                  <div style={styles.dealInfo}>
                    <h4 style={styles.dealTitle}>{item.name}</h4>
                    <p style={styles.dealShopName}>at <b>{item.shopName}</b></p>
                    <p style={styles.distText}>• Lowest price found</p>
                  </div>
                  <div style={styles.dealPriceArea}>
                    <span style={styles.dealPrice}>₹{item.price}</span>
                    <button style={index === 0 ? styles.btnBest : styles.btnNormal} onClick={() => handleAddToCart(item)}>ADD</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🚩 ZOMATO STYLE FLOATING BAR */}
      {cart.length > 0 && (
        <div style={styles.floatingCart} onClick={() => navigate('/checkout')}>
          <div style={styles.cartInfo}>
            <span style={styles.cartCount}>{totalItemsInCart} ITEM{totalItemsInCart > 1 ? 'S' : ''} ADDED</span>
            <span style={styles.cartSub}>Multiple shops comparison active</span>
          </div>
          <div style={styles.viewCartBtn}>View Cart →</div>
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ item, onAdd }) => (
  <div style={styles.pCard}>
    <div style={styles.cardOffer}>OFFER</div>
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
  container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '100px' },
  header: { padding: '15px 20px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  logoGroup: { display: 'flex', flexDirection: 'column' },
  mainLogo: { margin: 0, fontSize: '22px', fontWeight: '900', color: '#1c1c1c', letterSpacing: '-0.5px', cursor: 'pointer' },
  locName: { fontSize: '11px', fontWeight: '700', color: '#E23744', marginTop: '2px' },
  profileIcon: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' },
  userInitial: { color: '#E23744' },
  searchContainer: { backgroundColor: '#F3F4F6', borderRadius: '12px', padding: '12px 15px' },
  searchBar: { width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', fontWeight: '600' },
  main: { padding: '20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  sectionTitle: { fontSize: '19px', fontWeight: '900', color: '#1c1c1c' },
  seeAll: { color: '#E23744', fontSize: '13px', fontWeight: '700' },
  shopScroll: { display: 'flex', overflowX: 'auto', gap: '20px', paddingBottom: '10px', scrollbarWidth: 'none' },
  shopCard: { minWidth: '85px', textAlign: 'center' },
  shopImgWrapper: { position: 'relative', width: '75px', height: '75px', margin: '0 auto' },
  shopCircle: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f8f8f8' },
  ratingBadge: { position: 'absolute', bottom: '-5px', left: '15px', right: '15px', backgroundColor: '#257E3E', color: '#fff', fontSize: '9px', fontWeight: '800', borderRadius: '4px', padding: '2px' },
  shopNameText: { fontSize: '12px', fontWeight: '800', marginTop: '12px', color: '#333' },
  shopTime: { fontSize: '10px', color: '#888' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  pCard: { border: '1px solid #f2f2f2', borderRadius: '18px', padding: '12px', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  cardOffer: { position: 'absolute', top: '10px', left: '10px', background: '#2563EB', color: '#fff', fontSize: '8px', fontWeight: '900', padding: '2px 6px', borderRadius: '4px' },
  pImg: { width: '100%', height: '90px', objectFit: 'contain', margin: '10px 0' },
  pName: { fontSize: '13px', fontWeight: '700', height: '32px', overflow: 'hidden' },
  pShop: { fontSize: '10px', color: '#999', margin: '4px 0' },
  pFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
  pPrice: { fontWeight: '900', fontSize: '15px' },
  pAdd: { border: '1px solid #E23744', background: '#fff', color: '#E23744', borderRadius: '8px', padding: '4px 14px', fontWeight: '800', fontSize: '12px' },
  floatingCart: { position: 'fixed', bottom: '25px', left: '15px', right: '15px', backgroundColor: '#E23744', padding: '14px 20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 20px rgba(226, 55, 68, 0.3)', cursor: 'pointer', zIndex: 1000 },
  cartInfo: { color: '#fff' },
  cartCount: { display: 'block', fontWeight: '900', fontSize: '14px' },
  cartSub: { fontSize: '10px', opacity: 0.8 },
  viewCartBtn: { color: '#fff', fontWeight: '900', fontSize: '14px' },
  bestCard: { border: '2px solid #E23744', borderRadius: '16px', padding: '15px', marginBottom: '12px', position: 'relative', backgroundColor: '#fff9f9' },
  normalCard: { border: '1px solid #eee', borderRadius: '16px', padding: '15px', marginBottom: '12px' },
  dealTag: { position: 'absolute', top: '-10px', left: '15px', backgroundColor: '#E23744', color: '#fff', fontSize: '10px', padding: '3px 10px', borderRadius: '20px', fontWeight: '900' },
  cardFlex: { display: 'flex', alignItems: 'center', gap: '15px' },
  dealImg: { width: '50px', height: '50px', objectFit: 'contain' },
  dealInfo: { flex: 1 },
  dealTitle: { fontSize: '14px', fontWeight: '800', margin: 0 },
  dealShopName: { fontSize: '11px', color: '#666' },
  distText: { fontSize: '10px', color: '#257E3E', fontWeight: '700' },
  dealPriceArea: { textAlign: 'right' },
  dealPrice: { fontSize: '18px', fontWeight: '900', display: 'block' },
  btnBest: { backgroundColor: '#E23744', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 15px', fontWeight: '800' },
  btnNormal: { backgroundColor: '#1c1c1c', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 15px', fontWeight: '800' }
};

export default Home;