import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Results() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);

    // Render Backend API Call
    axios
      .get(`https://driftkartt.onrender.com/products?query=${query}`)
      .then((res) => {
        setProducts(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Unable to fetch deals. Please check your connection.");
        setLoading(false);
      });
  }, [query]);

  // Logic to find the cheapest product
  const prices = products.map((p) => Number(p.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  const styles = {
    wrapper: {
      padding: "50px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#fdfdfd",
      minHeight: "100vh",
    },
    headerSection: {
      textAlign: "center",
      marginBottom: "40px",
    },
    headerText: {
      fontSize: "2rem",
      fontWeight: "800",
      color: "#1a1a1a",
      margin: "0",
    },
    subText: {
      color: "#636e72",
      fontSize: "1rem",
      marginTop: "5px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "25px",
      marginTop: "20px",
    },
    card: (isBest) => ({
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "24px",
      position: "relative",
      boxShadow: isBest
        ? "0 20px 40px rgba(46, 204, 113, 0.15)"
        : "0 10px 20px rgba(0,0,0,0.05)",
      border: isBest ? "2px solid #2ecc71" : "1px solid #f1f1f1",
      transition: "all 0.3s ease",
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
    }),
    badge: {
      position: "absolute",
      top: "-15px",
      left: "20px",
      backgroundColor: "#2ecc71",
      color: "white",
      padding: "6px 16px",
      borderRadius: "50px",
      fontSize: "0.8rem",
      fontWeight: "700",
      boxShadow: "0 4px 12px rgba(46, 204, 113, 0.3)",
      zIndex: "10",
    },
    shopInfo: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    shopBadge: {
      backgroundColor: "#f0f2f5",
      padding: "4px 10px",
      borderRadius: "8px",
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "#555",
      textTransform: "uppercase",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#2d3436",
      lineHeight: "1.4",
      height: "55px",
      overflow: "hidden",
      marginBottom: "15px",
    },
    priceRow: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      marginTop: "auto",
    },
    currency: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#0984e3",
    },
    amount: {
      fontSize: "2rem",
      fontWeight: "900",
      color: "#0984e3",
    },
    btn: {
      marginTop: "20px",
      padding: "14px",
      borderRadius: "12px",
      border: "none",
      backgroundColor: "#1a1a1a",
      color: "white",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    checkoutBtn: {
      position: "fixed",
      bottom: "40px",
      right: "40px",
      padding: "18px 35px",
      borderRadius: "100px",
      backgroundColor: "#00b894",
      color: "white",
      fontSize: "1.1rem",
      fontWeight: "700",
      border: "none",
      boxShadow: "0 15px 30px rgba(0, 184, 148, 0.4)",
      cursor: "pointer",
      zIndex: "1000",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    }
  };

  if (loading) return (
    <div style={styles.wrapper}>
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2 style={{ color: "#0984e3" }}>🚀 Scouting the best prices...</h2>
        <p>Checking Amazon, Flipkart and more for "{query}"</p>
      </div>
    </div>
  );

  if (error) return (
    <div style={styles.wrapper}>
      <div style={{ textAlign: "center", padding: "50px", backgroundColor: "#fff5f5", borderRadius: "20px" }}>
        <h2 style={{ color: "#ff4757" }}>{error}</h2>
        <button onClick={() => window.location.reload()} style={styles.btn}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerSection}>
        <h2 style={styles.headerText}>Smart Comparison</h2>
        <p style={styles.subText}>Found {products.length} deals for <strong>"{query}"</strong></p>
      </div>

      <div style={styles.grid}>
        {products.map((item, index) => {
          const isBest = Number(item.price) === minPrice;
          return (
            <div
              key={index}
              style={styles.card(isBest)}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-10px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {isBest && <div style={styles.badge}>🏆 BEST VALUE</div>}

              <div style={styles.shopInfo}>
                <span style={styles.shopBadge}>{item.shop}</span>
                {isBest && <span style={{ color: '#2ecc71', fontSize: '0.8rem', fontWeight: 'bold' }}>Save ₹{Math.max(...prices) - minPrice}</span>}
              </div>

              <h3 style={styles.title}>{item.name}</h3>

              <div style={styles.priceRow}>
                <span style={styles.currency}>₹</span>
                <span style={styles.amount}>{item.price}</span>
              </div>

              <button
                style={styles.btn}
                onClick={() => addToCart(item)}
                onMouseOver={(e) => e.target.style.backgroundColor = "#333"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#1a1a1a"}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      {products.length > 0 && (
        <button style={styles.checkoutBtn} onClick={() => navigate("/checkout")}>
          View Cart & Checkout 🛒
        </button>
      )}
    </div>
  );
}

export default Results;