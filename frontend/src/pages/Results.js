import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Results() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://driftkartt.onrender.com/products?query=${query}`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [query]);

  const prices = products.map((p) => Number(p.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  const styles = {
    wrapper: {
      padding: "40px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    header: {
      fontSize: "1.8rem",
      fontWeight: "700",
      marginBottom: "24px",
      color: "#2d3436",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
    },
    card: (isBest) => ({
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "20px",
      position: "relative",
      boxShadow: isBest
        ? "0 10px 20px rgba(46, 204, 113, 0.15)"
        : "0 4px 6px rgba(0,0,0,0.05)",
      border: isBest ? "2px solid #2ecc71" : "1px solid #eee",
      transition: "transform 0.2s ease",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }),
    badge: {
      position: "absolute",
      top: "-12px",
      right: "20px",
      backgroundColor: "#2ecc71",
      color: "white",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "bold",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    shopName: {
      fontSize: "0.85rem",
      color: "#636e72",
      textTransform: "uppercase",
      letterSpacing: "1px",
      marginBottom: "5px",
    },
    productName: {
      fontSize: "1.2rem",
      fontWeight: "600",
      margin: "0 0 10px 0",
      color: "#2d3436",
    },
    priceTag: {
      fontSize: "1.5rem",
      fontWeight: "800",
      color: "#0984e3",
    },
    addToCartBtn: {
      marginTop: "15px",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#2d3436",
      color: "white",
      fontWeight: "600",
      cursor: "pointer",
      transition: "opacity 0.2s",
    },
    checkoutFab: {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      padding: "15px 30px",
      borderRadius: "50px",
      backgroundColor: "#00b894",
      color: "white",
      border: "none",
      fontWeight: "bold",
      boxShadow: "0 10px 20px rgba(0, 184, 148, 0.3)",
      cursor: "pointer",
      zIndex: 100,
    }
  };

  if (loading) return <div style={styles.wrapper}>Loading best deals...</div>;

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.header}>Showing results for "{query}"</h2>

      <div style={styles.grid}>
        {products.map((item, index) => {
          const isBest = Number(item.price) === minPrice;
          return (
            <div key={index} style={styles.card(isBest)}>
              {isBest && <div style={styles.badge}>🔥 CHEAPEST</div>}

              <div>
                <span style={styles.shopName}>{item.shop}</span>
                <h3 style={styles.productName}>{item.name}</h3>
                <div style={styles.priceTag}>₹{item.price}</div>
              </div>

              <button
                style={styles.addToCartBtn}
                onClick={() => addToCart(item)}
                onMouseOver={(e) => (e.target.style.opacity = "0.8")}
                onMouseOut={(e) => (e.target.style.opacity = "1")}
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>

      {products.length > 0 && (
        <button
          style={styles.checkoutFab}
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout 🛒
        </button>
      )}
    </div>
  );
}

export default Results;