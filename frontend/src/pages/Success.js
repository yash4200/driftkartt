import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  // 🚩 CSS Injection: Taaki keyframes code ke andar hi chalein
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes drive {
        0% { left: 5%; opacity: 1; }
        90% { left: 85%; opacity: 1; }
        100% { left: 90%; opacity: 0; }
      }
      @keyframes pop {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes confetti {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
      }
    `;
    document.head.appendChild(styleSheet);
  }, []);

  return (
    <div style={styles.successPage}>
      {/* 🎉 Confetti Effect */}
      <div style={styles.confettiWrap}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ ...styles.dot, left: `${i * 10}%`, animationDelay: `${i * 0.2}s` }}>✨</div>
        ))}
      </div>

      <div style={styles.animContainer}>
        <div style={styles.road}>
          <div style={styles.shopIcon}>🏪 Store</div>
          {/* 🚚 Delivery Boy Animation Loop */}
          <div style={styles.deliveryBoy}>🛵💨</div>
          <div style={styles.homeIcon}>🏠 Home</div>
        </div>
      </div>

      <div style={styles.textCard}>
        <h2 style={styles.successText}>Order Confirmed! 🎉</h2>
        <p style={styles.subText}>
          <b>Neel</b>, your delivery partner is on the way to pick up your items.
        </p>
        <div style={styles.timer}>Arriving in <b>18-22 mins</b></div>
      </div>

      <button onClick={() => navigate('/')} style={styles.homeBtn}>Back to Home</button>

      <p style={{ fontSize: '10px', color: '#aaa', marginTop: '40px' }}>
        Order ID: #DK-{Math.floor(1000 + Math.random() * 9000)}
      </p>
    </div>
  );
};

const styles = {
  successPage: {
    textAlign: 'center',
    padding: '80px 20px',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#fff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  confettiWrap: { position: 'absolute', top: 0, width: '100%', height: '100px', overflow: 'hidden', pointerEvents: 'none' },
  dot: { position: 'absolute', fontSize: '20px', animation: 'confetti 2s linear infinite' },
  animContainer: { width: '100%', maxWidth: '400px', margin: '40px 0' },
  road: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', position: 'relative',
    borderBottom: '2px dashed #eee', paddingBottom: '25px'
  },
  shopIcon: { fontSize: '18px', fontWeight: '800' },
  homeIcon: { fontSize: '18px', fontWeight: '800' },
  deliveryBoy: {
    fontSize: '40px', position: 'absolute', left: '0',
    animation: 'drive 3s linear infinite',
    zIndex: 2
  },
  textCard: { animation: 'pop 0.5s ease-out' },
  successText: { fontSize: '26px', fontWeight: '900', color: '#1c1c1c', margin: '10px 0' },
  subText: { fontSize: '14px', color: '#666', lineHeight: '1.5', maxWidth: '280px', margin: '0 auto' },
  timer: {
    backgroundColor: '#f3f3f3',
    display: 'inline-block',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '12px',
    marginTop: '20px',
    border: '1px solid #eee'
  },
  homeBtn: {
    backgroundColor: '#E23744',
    color: '#fff',
    border: 'none',
    padding: '16px 40px',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '16px',
    marginTop: '40px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(226, 55, 68, 0.3)'
  }
};

export default Success;