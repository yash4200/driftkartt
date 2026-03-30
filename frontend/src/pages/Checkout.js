import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://driftkartt.onrender.com";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState({ street: '', zip: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) { navigate('/login'); return; }

    const items = JSON.parse(localStorage.getItem('driftCart')) || [];
    if (items.length === 0) { navigate('/'); }
    setCartItems(items);
  }, [navigate]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  const handlePaymentSelect = (method) => {
    if (method !== 'cod') {
      alert("⚠️ Sorry! Currently only Cash on Delivery (COD) is available. Online payment will be active soon.");
      setPaymentMethod('cod');
    } else {
      setPaymentMethod('cod');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    const orderData = {
      customerName: "Neel",
      phone: address.phone,
      address: `${address.street}, ${address.zip}`,
      items: cartItems,
      totalAmount: total,
      paymentMethod: 'COD'
    };

    try {
      await axios.post(`${API_URL}/orders`, orderData);
      localStorage.removeItem('driftCart');
      navigate('/success');
    } catch (err) {
      alert("Order failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>←</button>
        <h2 style={styles.title}>Checkout</h2>
      </header>

      <div style={styles.container}>
        {/* 1. Items List */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item._id} style={styles.itemRow}>
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemQty}>x {item.quantity}</span>
              </div>
              <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* 2. Coupon Section */}
        <div style={styles.card}>
          <div style={styles.flexRow}>
            <span style={{ fontSize: '14px', fontWeight: '700' }}>🎟️ Use Coupons</span>
            <span style={{ color: '#E23744', fontWeight: '800', fontSize: '12px' }}>SEE ALL</span>
          </div>
        </div>

        {/* 3. Donation Section (Feeding India) */}
        <div style={{ ...styles.card, border: '1px solid #dcfce7', backgroundColor: '#f0fdf4' }}>
          <div style={styles.flexRow}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <img src="https://logowik.com/content/uploads/images/feeding-india9442.jpg" alt="NGO" style={{ width: '30px', height: '30px', borderRadius: '4px' }} />
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '800' }}>Feeding India</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#166534' }}>Donate ₹2 to help someone in need</p>
              </div>
            </div>
            <a href="https://www.feedingindia.org/" target="_blank" rel="noreferrer" style={styles.donateLink}>Visit Site</a>
          </div>
        </div>

        {/* 4. Delivery Address Form */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Delivery Details</h3>
          <input type="text" placeholder="House No. / Street" style={styles.input} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
          <input type="text" placeholder="PIN Code" style={styles.input} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
          <input type="tel" placeholder="Mobile Number" style={styles.input} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
        </div>

        {/* 5. Payment Methods */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Payment Method</h3>
          <div style={styles.payOption} onClick={() => handlePaymentSelect('upi')}>
            <span>📱 Google Pay / PhonePe / UPI</span>
            <div style={styles.radioOff}></div>
          </div>
          <div style={styles.payOption} onClick={() => handlePaymentSelect('card')}>
            <span>💳 Credit / Debit / ATM Cards</span>
            <div style={styles.radioOff}></div>
          </div>
          <div style={styles.payOption} onClick={() => handlePaymentSelect('cod')}>
            <span>💵 Cash on Delivery (COD)</span>
            <div style={paymentMethod === 'cod' ? styles.radioOn : styles.radioOff}></div>
          </div>
        </div>

        {/* 6. Final Bill & Order Button */}
        <div style={styles.card}>
          <div style={styles.billRow}><span>Item Total</span><span>₹{subtotal}</span></div>
          <div style={styles.billRow}><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
          <div style={styles.totalRow}><span>Grand Total</span><span>₹{total}</span></div>

          <button onClick={handlePlaceOrder} style={styles.placeBtn} disabled={loading}>
            {loading ? "Processing..." : `PLACE ORDER - ₹${total}`}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#F4F4F6', minHeight: '100vh', fontFamily: 'Inter' },
  header: { backgroundColor: '#fff', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', position: 'sticky', top: 0, zIndex: 10 },
  backBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  title: { fontSize: '18px', fontWeight: '900', margin: 0 },
  container: { padding: '15px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '16px', marginBottom: '12px' },
  sectionTitle: { fontSize: '12px', fontWeight: '800', color: '#999', marginBottom: '12px', textTransform: 'uppercase' },
  itemRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  itemName: { fontSize: '14px', fontWeight: '600' },
  itemQty: { fontSize: '12px', color: '#888', marginLeft: '5px' },
  itemPrice: { fontSize: '14px', fontWeight: '700' },
  flexRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  donateLink: { fontSize: '11px', color: '#E23744', fontWeight: '800', textDecoration: 'none', border: '1px solid #E23744', padding: '4px 8px', borderRadius: '6px' },
  input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', marginBottom: '10px', fontSize: '14px', boxSizing: 'border-box' },
  payOption: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f9f9f9', cursor: 'pointer' },
  radioOff: { width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #ccc' },
  radioOn: { width: '18px', height: '18px', borderRadius: '50%', border: '5px solid #E23744' },
  billRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '6px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' },
  placeBtn: { width: '100%', backgroundColor: '#E23744', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '16px', marginTop: '15px', cursor: 'pointer' }
};

export default Checkout;