import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItem, setCartItem] = useState(null);
  const [payMethod, setPayMethod] = useState('cod');
  const navigate = useNavigate();

  useEffect(() => {
    const item = localStorage.getItem('cartItem');
    if (item) setCartItem(JSON.parse(item));
  }, []);

  const handlePlaceOrder = () => {
    alert("Order Placed Successfully!");
    localStorage.removeItem('cartItem'); // Order ke baad cart saaf
    navigate('/success');
  };

  if (!cartItem) return (
    <div style={styles.emptyCart}>
      <h2>Your cart is empty! 🛒</h2>
      <button style={styles.homeBtn} onClick={() => navigate('/')}>Go Back to Shopping</button>
    </div>
  );

  return (
    <div style={styles.container}>
      <header style={styles.miniHeader}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>Drift<span style={{ color: '#E23744' }}>Kart</span></h1>
        <span style={styles.stepTitle}>Secure Checkout</span>
      </header>

      <main style={styles.main}>
        {/* --- PRODUCT SUMMARY --- */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          <div style={styles.itemCard}>
            <img src={cartItem.image} alt={cartItem.name} style={styles.itemImg} />
            <div style={styles.itemDetails}>
              <p style={styles.itemName}>{cartItem.name}</p>
              <p style={styles.itemPrice}>₹{cartItem.price} <span style={styles.itemOldPrice}>₹{cartItem.originalPrice}</span></p>
            </div>
          </div>
        </section>

        {/* --- ADDRESS SECTION --- */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Delivery Address</h3>
          <input type="text" placeholder="Full Name" style={styles.input} />
          <input type="text" placeholder="Flat / House No. / Building" style={styles.input} />
          <input type="text" placeholder="Area / Sector / Locality" style={styles.input} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Pincode" style={styles.input} />
            <input type="text" placeholder="City" style={styles.input} />
          </div>
        </section>

        {/* --- PAYMENT OPTIONS --- */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Payment Method</h3>
          <div
            style={payMethod === 'cod' ? styles.payActive : styles.payOption}
            onClick={() => setPayMethod('cod')}
          >
            <span>💵 Cash on Delivery (COD)</span>
            <div style={payMethod === 'cod' ? styles.radioOn : styles.radioOff}></div>
          </div>
          <div
            style={payMethod === 'upi' ? styles.payActive : styles.payOption}
            onClick={() => setPayMethod('upi')}
          >
            <span>📱 UPI / Google Pay</span>
            <div style={payMethod === 'upi' ? styles.radioOn : styles.radioOff}></div>
          </div>
        </section>

        {/* --- TOTAL & BUTTON --- */}
        <div style={styles.footer}>
          <div style={styles.totalRow}>
            <span>Grand Total</span>
            <span style={styles.totalAmount}>₹{cartItem.price}</span>
          </div>
          <button style={styles.placeOrderBtn} onClick={handlePlaceOrder}>
            PLACE ORDER
          </button>
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  miniHeader: { backgroundColor: '#fff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' },
  logo: { fontSize: '20px', fontWeight: '900', cursor: 'pointer' },
  stepTitle: { fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase' },
  main: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  section: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
  sectionTitle: { fontSize: '15px', fontWeight: '800', marginBottom: '15px', color: '#333' },
  itemCard: { display: 'flex', gap: '15px', alignItems: 'center' },
  itemImg: { width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  itemName: { fontSize: '14px', fontWeight: '600', margin: '0 0 5px 0' },
  itemPrice: { fontSize: '16px', fontWeight: '800', margin: 0 },
  itemOldPrice: { fontSize: '12px', color: '#aaa', textDecoration: 'line-through', fontWeight: '400' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', marginBottom: '10px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fafafa' },
  payOption: { display: 'flex', justifyContent: 'space-between', padding: '15px', borderRadius: '10px', border: '1px solid #eee', marginBottom: '10px', cursor: 'pointer', fontSize: '14px' },
  payActive: { display: 'flex', justifyContent: 'space-between', padding: '15px', borderRadius: '10px', border: '1.5px solid #E23744', backgroundColor: '#FFF5F6', marginBottom: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  radioOff: { width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #ddd' },
  radioOn: { width: '18px', height: '18px', borderRadius: '50%', border: '5px solid #E23744' },
  footer: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: '20px', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalAmount: { fontSize: '20px', fontWeight: '900', color: '#E23744' },
  placeOrderBtn: { backgroundColor: '#E23744', color: '#fff', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer' },
  emptyCart: { textAlign: 'center', padding: '50px' },
  homeBtn: { backgroundColor: '#E23744', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', marginTop: '20px', cursor: 'pointer' }
};

export default Checkout;