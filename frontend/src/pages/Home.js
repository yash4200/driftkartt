/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Locating...");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // 1. Get Real Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          setLocationName(`${res.data.city || res.data.locality}`);
        } catch (err) { setLocationName("India"); }
      }, () => { setLocationName("Location Off"); });
    }
  }, []);

  // 2. Fetch Products
  useEffect(() => {
    fetchProducts();
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      // API call with query parameter
      const res = await axios.get(`https://driftkartt.onrender.com/products?query=${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
    setLoading(false);
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalPrice = cart.reduce((total, item) => total + Number(item.price), 0);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.navMain}>
          <h1 style={styles.logo} onClick={() => window.location.reload()}>Drift<span>Kart</span></h1>
          <div style={styles.deliveryInfo}>
            <span style={{ fontSize: '20px' }}>📍</span>
            <div>
              <b style={{ display: 'block', fontSize: '10px', color: '#E23744' }}>DELIVERING TO</b>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{locationName}</span>
            </div>
          </div>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search for groceries, vegetables..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); fetchProducts(e.target.value); }}
            style={styles.searchBar}
          />
        </div>
      </header>

      <main style={styles.main}>
        <h2 style={styles.sectionTitle}>Fresh Items Near You ⚡</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
            Searching fresh products...
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((item) => (
              <div key={item._id} style={styles.card}>
                <div style={styles.imageBox}>
                  <img
                    src={`https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400&q=${item.name}`}
                    alt={item.name}
                    style={styles.img}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506617424151-74f5699c4463?q=80&w=400" }}
                  />
                  <div style={styles.timeTag}>10-15 MINS</div>
                </div>

                <div style={styles.details}>
                  <h4 style={styles.name}>{item.name}</h4>
                  <p style={styles.store}>{item.storeName} • {item.distance}</p>
                  <div style={styles.footer}>
                    <span style={styles.price}>₹{item.price}</span>
                    <button onClick={() => addToCart(item)} style={styles.addBtn}>ADD +</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Strip */}
      {cart.length > 0 && (
        <div style={styles.cartStrip} onClick={() => navigate('/checkout')}>
          <div style={styles.cartInfo}>
            <span>{cart.length} ITEM{cart.length > 1 ? 'S' : ''} ADDED</span>
            <p style={{ margin: 0, fontWeight: 'bold' }}>₹{totalPrice} plus taxes</p>
          </div>
          <div style={styles.viewCart}>View Cart 🛒</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', paddingBottom: '80px' },
  header: { padding: '15px 20px', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1000, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  navMain: { display: 'flex', alignItems: 'center', gap: '30px', maxWidth: '1200px', margin: '0 auto' },
  logo: { fontSize: '26px', color: '#E23744', fontWeight: '900', cursor: 'pointer' },
  deliveryInfo: { display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #ddd', paddingLeft: '15px' },
  searchWrapper: { maxWidth: '700px', margin: '15px auto 0' },
  searchBar: { width: '100%', padding: '12px 20px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#F3F3F3', outline: 'none' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  sectionTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '25px' },
  card: { borderRadius: '15px', overflow: 'hidden' },
  imageBox: { position: 'relative', height: '160px', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#f9f9f9' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  timeTag: { position: 'absolute', bottom: '8px', left: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' },
  details: { padding: '8px 2px' },
  name: { margin: '0', fontSize: '16px', fontWeight: '700' },
  store: { color: '#777', fontSize: '12px', margin: '4px 0' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '16px', fontWeight: '800' },
  addBtn: { backgroundColor: '#fff', color: '#E23744', border: '1px solid #E23744', padding: '4px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  cartStrip: {
    position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
    width: '90%', maxWidth: '500px', backgroundColor: '#60B246', color: 'white',
    padding: '12px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', zIndex: 2000
  },
  cartInfo: { fontSize: '13px' },
  viewCart: { fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px' }
};

export default Home;