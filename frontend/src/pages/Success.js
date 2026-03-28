import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>✓</div>
        <h1 style={styles.title}>Order Placed!</h1>
        <p style={styles.text}>Your DriftKart delivery is on its way.</p>

        <div style={styles.trackingCard}>
          <div style={styles.trackRow}>
            <div style={styles.activeDot}></div>
            <p>Order Confirmed (10:30 AM)</p>
          </div>
          <div style={styles.line}></div>
          <div style={styles.trackRow}>
            <div style={styles.inactiveDot}></div>
            <p style={{ color: '#999' }}>Delivery in 15 mins</p>
          </div>
        </div>

        <button onClick={() => navigate('/')} style={styles.btn}>Back to Shopping</button>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#60B246', padding: '20px' },
  card: { backgroundColor: '#fff', padding: '40px 30px', borderRadius: '30px', textAlign: 'center', width: '100%', maxWidth: '400px', animation: 'popIn 0.5s ease-out' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: '#60B246', color: '#fff', borderRadius: '50%', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'pulse 2s infinite' },
  title: { fontSize: '24px', fontWeight: '900', margin: 0 },
  text: { color: '#666', fontSize: '14px', margin: '10px 0 30px' },
  trackingCard: { backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: 'left', marginBottom: '30px' },
  trackRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: '600' },
  activeDot: { width: '10px', height: '10px', backgroundColor: '#60B246', borderRadius: '50%' },
  inactiveDot: { width: '10px', height: '10px', backgroundColor: '#ddd', borderRadius: '50%' },
  line: { width: '2px', height: '20px', backgroundColor: '#eee', marginLeft: '4px' },
  btn: { width: '100%', padding: '15px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: '700', cursor: 'pointer' }
};

export default Success;