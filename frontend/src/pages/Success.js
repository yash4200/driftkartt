import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  // 🎉 Triggered when order is successful
  useEffect(() => {
    // Optional: Trigger a sound or haptic here
    console.log("Order Placed Successfully!");
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* ✅ Success Icon Animation Area */}
        <div style={styles.successIconBox}>
          <div style={styles.checkCircle}>✓</div>
        </div>

        <h1 style={styles.title}>Order Placed!</h1>
        <p style={styles.subtitle}>Your groceries from <span style={{ fontWeight: '700', color: '#1a1a1a' }}>DriftKart</span> are being packed.</p>

        {/* 🛵 Live Tracking Timeline */}
        <div style={styles.timeline}>
          <div style={styles.step}>
            <div style={{ ...styles.dot, backgroundColor: '#60B246' }}></div>
            <div style={styles.stepText}>
              <span style={styles.stepTitle}>Order Confirmed</span>
              <span style={styles.stepTime}>Just now</span>
            </div>
          </div>
          <div style={styles.line}></div>
          <div style={styles.step}>
            <div style={{ ...styles.dot, backgroundColor: '#ddd' }}></div>
            <div style={styles.stepText}>
              <span style={{ ...styles.stepTitle, color: '#999' }}>Out for Delivery</span>
              <span style={styles.stepTime}>Expected in 12 mins</span>
            </div>
          </div>
        </div>

        {/* 🏠 Delivery Details */}
        <div style={styles.infoCard}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Order ID</span>
            <span style={styles.value}>#DK-{Math.floor(Math.random() * 90000) + 10000}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Delivery to</span>
            <span style={styles.value}>Home</span>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <button onClick={() => navigate('/')} style={styles.homeBtn}>Back to Home</button>
        <p style={styles.supportText}>Need help? Contact Support</p>
      </footer>

      <style>{`
                @keyframes scaleIn {
                    0% { transform: scale(0); opacity: 0; }
                    80% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
    </div>
  );
};

const styles = {
  container: { height: '100vh', backgroundColor: '#fff', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' },
  mainContent: { flex: 1, padding: '60px 30px', textAlign: 'center' },
  successIconBox: { display: 'flex', justifyContent: 'center', marginBottom: '30px' },
  checkCircle: {
    width: '80px', height: '80px', backgroundColor: '#60B246', color: '#fff',
    borderRadius: '50%', fontSize: '40px', display: 'flex', justifyContent: 'center',
    alignItems: 'center', animation: 'scaleIn 0.5s ease-out'
  },
  title: { fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-1px' },
  subtitle: { fontSize: '15px', color: '#666', lineHeight: '1.5', marginBottom: '40px' },
  timeline: { textAlign: 'left', backgroundColor: '#F9F9F9', padding: '20px', borderRadius: '20px', marginBottom: '25px' },
  step: { display: 'flex', gap: '15px', alignItems: 'center' },
  dot: { width: '12px', height: '12px', borderRadius: '50%' },
  line: { width: '2px', height: '30px', backgroundColor: '#eee', marginLeft: '5px' },
  stepText: { display: 'flex', flexDirection: 'column' },
  stepTitle: { fontSize: '14px', fontWeight: '700' },
  stepTime: { fontSize: '11px', color: '#999' },
  infoCard: { border: '1.5px solid #eee', borderRadius: '20px', padding: '20px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  label: { color: '#888', fontSize: '13px' },
  value: { fontWeight: '700', fontSize: '13px' },
  footer: { padding: '30px', borderTop: '1px solid #eee' },
  homeBtn: {
    width: '100%', padding: '18px', backgroundColor: '#1A1A1A', color: '#fff',
    border: 'none', borderRadius: '15px', fontWeight: '800', fontSize: '16px',
    cursor: 'pointer', marginBottom: '15px'
  },
  supportText: { fontSize: '12px', color: '#E23744', fontWeight: '700', textAlign: 'center', cursor: 'pointer' }
};

export default Success;