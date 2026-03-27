import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Total price calculate karne ke liye
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");

    // Order place hone par cart khali kar dena
    setCart([]);
    navigate("/success");
  };

  const styles = {
    wrapper: {
      padding: "40px 5%",
      maxWidth: "1100px",
      margin: "0 auto",
      fontFamily: "'Inter', sans-serif",
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gap: "40px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#2d3436",
    },
    card: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    },
    cartItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 0",
      borderBottom: "1px solid #eee",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #dfe6e9",
      boxSizing: "border-box",
      fontSize: "1rem",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
      paddingTop: "20px",
      borderTop: "2px solid #2d3436",
      fontSize: "1.2rem",
      fontWeight: "800",
    },
    orderBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#00b894",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      marginTop: "20px",
      transition: "background 0.3s ease",
    },
    emptyState: {
      textAlign: "center",
      padding: "100px 20px",
      gridColumn: "1 / -1",
    }
  };

  // Agar cart khali hai
  if (cart.length === 0) {
    return (
      <div style={styles.emptyState}>
        <h2>Your cart is empty 🛍️</h2>
        <p>Go back and find some amazing deals!</p>
        <button
          onClick={() => navigate("/")}
          style={{ ...styles.orderBtn, width: "auto", padding: "12px 30px" }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Left Side: Order Details */}
      <div>
        <h2 style={styles.sectionTitle}>Order Summary</h2>
        <div style={styles.card}>
          {cart.map((item, index) => (
            <div key={index} style={styles.cartItem}>
              <div>
                <div style={{ fontWeight: "600" }}>{item.name}</div>
                <div style={{ fontSize: "0.85rem", color: "#636e72" }}>{item.shop}</div>
              </div>
              <div style={{ fontWeight: "700" }}>₹{item.price}</div>
            </div>
          ))}

          <div style={styles.totalRow}>
            <span>Total Amount</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Right Side: Shipping Form */}
      <div>
        <h2 style={styles.sectionTitle}>Shipping Details</h2>
        <form style={styles.card} onSubmit={handlePlaceOrder}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#636e72" }}>Full Name</label>
          <input type="text" placeholder="John Doe" style={styles.input} required />

          <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#636e72" }}>Phone Number</label>
          <input type="tel" placeholder="+91 98765 43210" style={styles.input} required />

          <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "#636e72" }}>Delivery Address</label>
          <textarea
            placeholder="Street name, Landmark, City..."
            style={{ ...styles.input, height: "100px", resize: "none" }}
            required
          />

          <button
            type="submit"
            style={styles.orderBtn}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#00947a")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#00b894")}
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;