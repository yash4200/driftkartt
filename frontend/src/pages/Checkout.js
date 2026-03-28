import React, { useState } from 'react';

const Checkout = () => {
  // 1. Payment Method ke liye State banayi
  const [payMethod, setPayMethod] = useState('cod');

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>Payment Method</h3>

      {/* --- UPI OPTION --- */}
      <div
        style={payMethod === 'upi' ? styles.payOptionActive : styles.payOption}
        onClick={() => setPayMethod('upi')}
      >
        <div style={{ display: 'flex', gap: '10px' }}><span>📱</span> UPI (GPay/PhonePe)</div>
        <div style={payMethod === 'upi' ? styles.radioActive : styles.radioInactive}></div>
      </div>

      {/* --- CARD OPTION --- */}
      <div
        style={payMethod === 'card' ? styles.payOptionActive : styles.payOption}
        onClick={() => setPayMethod('card')}
      >
        <div style={{ display: 'flex', gap: '10px' }}><span>💳</span> Credit/Debit Card</div>
        <div style={payMethod === 'card' ? styles.radioActive : styles.radioInactive}></div>
      </div>

      {/* --- COD OPTION --- */}
      <div
        style={payMethod === 'cod' ? styles.payOptionActive : styles.payOption}
        onClick={() => setPayMethod('cod')}
      >
        <div style={{ display: 'flex', gap: '10px' }}><span>💵</span> Cash on Delivery</div>
        <div style={payMethod === 'cod' ? styles.radioActive : styles.radioInactive}></div>
      </div>

      {/* --- PLACE ORDER BUTTON --- */}
      <button style={styles.orderBtn}>
        Confirm Order {payMethod === 'cod' ? '(Pay on Delivery)' : ''}
      </button>
    </div>
  );
};

// --- STYLES (Thode aur polish kiye hain) ---
const styles = {
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '20px', fontFamily: 'Inter, sans-serif' },
  cardTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '15px' },
  payOption: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px', border: '1px solid #eee', borderRadius: '12px',
    marginBottom: '10px', cursor: 'pointer', transition: '0.3s'
  },
  payOptionActive: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px', border: '2px solid #E23744', backgroundColor: '#fff5f6',
    borderRadius: '12px', marginBottom: '10px', cursor: 'pointer'
  },
  radioActive: {
    width: '12px', height: '12px', borderRadius: '50%',
    backgroundColor: '#E23744', border: '3px solid #fff',
    boxShadow: '0 0 0 1px #E23744'
  },
  radioInactive: { width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #ddd' },
  orderBtn: {
    width: '100%', padding: '15px', backgroundColor: '#1A1A1A',
    color: '#fff', border: 'none', borderRadius: '12px',
    fontWeight: '800', marginTop: '10px', cursor: 'pointer'
  }
};

export default Checkout; 