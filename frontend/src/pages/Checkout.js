import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://driftkartt.onrender.com";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    city: 'Bhubaneswar',
    zip: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🚩 Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // 🚩 Get item from localStorage (Jo Home se select kiya tha)
    const item = JSON.parse(localStorage.getItem('cartItem'));
    if (!item) {
      navigate('/');
    } else {
      setCartItem(item);
    }
  }, [navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      shopId: cartItem.shopId,
      shopName: cartItem.shopName,
      items: [{
        productId: cartItem._id,
        name: cartItem.name,
        price: cartItem.price,
        quantity: 1
      }],
      totalAmount: cartItem.price,
      customerName: "Neel (thetecnil)", // Yahan auth se naam le sakte ho
      customerPhone: address.phone,
      shippingAddress: {
        street: address.street,
        city: address.city,
        zipCode: address.zip
      }
    };

    try {
      await axios.post(`${API_URL}/orders`, orderData);
      alert("🎉 Order Placed Successfully! Your deal is on the way.");
      localStorage.removeItem('cartItem');
      navigate('/');
    } catch (err) {
      alert("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItem) return null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>←</button>
        <h2 style={styles.title}>Checkout</h2>
      </header>

      <div style={styles.container}>
        {/* 📦 Order Summary Card */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div style={styles.itemRow}>
            <img src={cartItem.image} alt="" style={styles.itemImg} />
            <div style={styles.itemInfo}>
              <p style={styles.itemName}>{cartItem.name}</p>
              <p style={styles.shopDetail}>Sold by: <b>{cartItem.shopName}</b></p>
            </div>
            <p style={styles.itemPrice}>₹{cartItem.price}</p>
          </div>
        </section>

        {/* 📍 Delivery Details Form */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Delivery Details</h3>
          <form onSubmit={handlePlaceOrder}>
            <input
              type="text" placeholder="Flat / Street / Landmark" required
              style={styles.input} onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
            <div style={styles.row}>
              <input
                type="text" placeholder="ZIP Code" required
                style={{ ...styles.input, flex: 1 }} onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              />
              <input
                type="text" placeholder="Bhubaneswar" disabled
                style={{ ...styles.input, flex: 1, backgroundColor: '#f9f9f9' }}
              />
            </div>
            <input
              type="tel" placeholder="Phone Number" required
              style={styles.input} onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />

            <div style={styles.footer}>
              <div style={styles.totalArea}>
                <span style={styles.totalLabel}>Total to Pay</span>
                <span style={styles.totalAmount}>₹{cartItem.price}</span>
              </div>
              <button type="submit" style={styles.placeOrderBtn} disabled={loading}>
                {loading ? "Placing Order..." : "CONFIRM ORDER"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#F7F7F7', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  header: { backgroundColor: '#fff', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee' },
  backBtn: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  title: { fontSize: '18px', fontWeight: '800', margin: 0 },
  container: { padding: '15px' },
  card: { backgroundColor: '#fff', borderRadius: '15px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: '14px', fontWeight: '800', marginBottom: '15px', color: '#666', textTransform: 'uppercase' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  itemImg: { width: '50px', height: '50px', objectFit: 'contain' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '14px', fontWeight: '700', margin: 0 },
  shopDetail: { fontSize: '11px', color: '#888', margin: '2px 0 0 0' },
  itemPrice: { fontWeight: '900', fontSize: '16px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '12px', fontSize: '14px', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '10px' },
  footer: { marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '15px' },
  totalArea: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  totalLabel: { fontWeight: '600', color: '#666' },
  totalAmount: { fontWeight: '900', fontSize: '20px', color: '#1c1c1c' },
  placeOrderBtn: { width: '100%', backgroundColor: '#E23744', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }
};

export default Checkout;