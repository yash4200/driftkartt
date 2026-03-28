import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({ house: '', area: '', type: 'Home' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    if (savedCart.length === 0) navigate('/');
  }, [navigate]);

  const total = cart.reduce((a, b) => a + Number(b.price), 0);
  const deliveryCharge = total > 200 ? 0 : 25;
  const grandTotal = total + deliveryCharge;

  const handleOrder = async () => {
    // 🛡️ Validation
    if (!address.house.trim() || !address.area.trim()) {
      alert("Please enter your full delivery address!");
      return;
    }

    setLoading(true);
    const orderData = {
      items: cart,
      total: grandTotal,
      address: address,
      status: 'Pending',
      createdAt: new Date()
    };

    try {
      // 🚀 Sending order to Backend
      await axios.post("http://localhost:10000/orders", orderData);

      // Success: Clear cart and move to success page
      localStorage.setItem('cart', '[]');
      navigate('/success');
    } catch (err) {
      console.error(err);
      alert("Server Error: Could not place order. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>←</button>
        <h2 style={styles.headerTitle}>Checkout</h2>
      </header>

      <main style={styles.main}>
        {/* Address Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Delivery Address 📍</h3>
          <div style={styles.typeRow}>
            {['Home', 'Work', 'Other'].map(t => (
              <button
                key={t}
                onClick={() => setAddress({ ...address, type: t })}
                style={{
                  ...styles.typeBtn,
                  border: address.type === t ? '2px solid #E23744' : '1px solid #eee',
                  color: address.type === t ? '#E23744' : '#666'
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            placeholder="Flat / House No. / Floor"
            style={styles.input}
            value={address.house}
            onChange={(e) => setAddress({ ...address, house: e.target.value })}
          />
          <input
            placeholder="Area / Locality / Landmark"
            style={styles.input}
            value={address.area}
            onChange={(e) => setAddress({ ...address, area: e.target.value })}
          />
        </div>

        {/* Bill Summary */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Bill Summary 🛒</h3>
          {cart.map((item, i) => (
            <div key={i} style={styles.billRow}>
              <span>{item.name}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <hr style={styles.hr} />
          <div style={styles.billRow}><span>Item Total</span><span>₹{total}</span></div>
          <div style={styles.billRow}><span>Delivery Fee</span><span>₹{deliveryCharge}</span></div>
          <div style={{ ...styles.billRow, fontWeight: '900', fontSize: '18px', marginTop: '10px' }}>
            <span>Total Payable</span><span>₹{grandTotal}</span>
          </div>
        </div>

        {/* Payment Option */}
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700' }}>Cash on Delivery</span>
            <div style={styles.radioActive}></div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInfo}>
          <p style={{ margin: 0, fontSize: '10px', color: '#888' }}>PAYING VIA CASH</p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>₹{grandTotal}</p>
        </div>
        <button onClick={handleOrder} style={styles.payBtn} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order →"}
        </button>
      </footer>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#F4F4F4', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  header: { padding: '15px 20px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #eee' },
  backBtn: { border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' },
  headerTitle: { fontSize: '18px', fontWeight: '800', margin: 0 },
  main: { padding: '15px', paddingBottom: '100px' },
  card: { backgroundColor: '#fff', borderRadius: '15px', padding: '20px', marginBottom: '15px' },
  cardTitle: { fontSize: '15px', fontWeight: '800', marginBottom: '15px' },
  typeRow: { display: 'flex', gap: '10px', marginBottom: '15px' },
  typeBtn: { padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fff', fontSize: '12px', fontWeight: '600' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', marginBottom: '10px', boxSizing: 'border-box' },
  billRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
  hr: { border: '0.5px solid #f0f0f0', margin: '15px 0' },
  radioActive: { width: '16px', height: '16px', borderRadius: '50%', border: '5px solid #E23744' },
  footer: { position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#fff', padding: '15px 25px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box', alignItems: 'center' },
  payBtn: { backgroundColor: '#1C1C1C', color: '#fff', padding: '15px 30px', borderRadius: '12px', border: 'none', fontWeight: '800', fontSize: '15px', cursor: 'pointer' },
  footerInfo: { display: 'flex', flexDirection: 'column' }
};

export default Checkout;