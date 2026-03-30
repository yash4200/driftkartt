import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    // Randomly calculate distance between 1.5 to 4.5 km
    const dist = (Math.random() * (4.5 - 1.5) + 1.5).toFixed(1);
    setDistance(dist);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* --- Animated Icon Section --- */}
        <div style={styles.animationIcon}>
          <div style={styles.scooterAnim}>🛵💨</div>
        </div>

        <h1 style={styles.thankYou}>Order Placed!</h1>
        <p style={styles.subtitle}>Arriving in <span style={{ color: '#2E7D32', fontWeight: '800' }}>12 Mins</span></p>

        {/* --- Blinkit Style Store Info --- */}
        <div style={styles.storeCard}>
          <div style={styles.storeInfo}>
            <span style={styles.storeIcon}>🏬</span>
            <div>
              <p style={styles.storeLabel}>Preparing at Store</p>
              <p style={styles.storeName}>DriftKart Dark Store - Near You</p>
            </div>
          </div>
          <div style={styles.distanceBadge}>{distance} km away</div>
        </div>

        <div style={styles.detailsBox}>
          <p style={styles.detailText}>A notification will be sent when your rider is nearby.</p>
        </div>

        <button onClick={() => navigate('/orders')} style={styles.trackBtn}>
          Track Order Live
        </button>

        <p onClick={() => navigate('/')} style={styles.goHome}>Continue Shopping</p>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F5F9', fontFamily: 'Inter, sans-serif', padding: '20px' },
  card: { backgroundColor: '#fff', width: '100%', maxWidth: '400px', padding: '40px 30px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,0,0,0.05)' },
  animationIcon: { fontSize: '60px', marginBottom: '20px', overflow: 'hidden', height: '80px' },
  scooterAnim: { animation: 'drive 2s infinite linear' },
  thankYou: { fontSize: '26px', fontWeight: '900', color: '#1A1A1A', margin: '0 0 10px 0' },
  subtitle: { fontSize: '16px', color: '#666', marginBottom: '30px' },
  storeCard: { backgroundColor: '#F8F9FA', padding: '15px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', border: '1px solid #eee' },
  storeInfo: { display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' },
  storeIcon: { fontSize: '24px' },
  storeLabel: { fontSize: '10px', color: '#888', fontWeight: '700', textTransform: 'uppercase', margin: 0 },
  storeName: { fontSize: '13px', fontWeight: '700', margin: 0, color: '#333' },
  distanceBadge: { backgroundColor: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: '1px solid #ddd' },
  detailsBox: { marginBottom: '30px' },
  detailText: { fontSize: '12px', color: '#999', lineHeight: '1.5' },
  trackBtn: { width: '100%', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#E23744', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(226, 55, 68, 0.2)' },
  goHome: { marginTop: '20px', fontSize: '13px', color: '#888', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }
};

// CSS Animation for Scooter (Add this to your index.css)
/*
@keyframes drive {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(100px); }
}
*/

export default Success;