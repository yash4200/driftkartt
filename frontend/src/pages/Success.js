import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>✅</div>
        <h2 style={styles.title}>Order Placed Successfully!</h2>
        <p style={styles.msg}>Your items are on the way. You will receive a confirmation shortly.</p>

        <div style={styles.orderId}>Order ID: #DK-{Math.floor(Math.random() * 90000) + 10000}</div>

        <button style={styles.homeBtn} onClick={() => navigate('/')}>Continue Shopping</button>
        <button style={styles.orderBtn} onClick={() => navigate('/orders')}>View My Orders</button>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', fontFamily: 'Inter, sans-serif', padding: '20px' },
  card: { maxWidth: '450px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: '#e6fffa', color: '#38a169', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', margin: '0 auto 20px' },
  title: { fontSize: '22px', fontWeight: '800', color: '#222', marginBottom: '10px' },
  msg: { fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '25px' },
  orderId: { backgroundColor: '#f1f3f5', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#444', marginBottom: '30px' },
  homeBtn: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', backgroundColor: '#E23744', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' },
  orderBtn: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fff', color: '#555', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }
};

export default Success;