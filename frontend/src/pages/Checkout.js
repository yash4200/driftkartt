import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cart.reduce((acc, item) => acc + Number(item.price), 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setCart([]);
    navigate("/success");
  };

  const styles = {
    wrapper: {
      padding: "60px 8%",
      maxWidth: "1200px",
      margin: "0 auto",
      fontFamily: "'Poppins', sans-serif",
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr",
      gap: "50px",
      background: "#fdfdfd",
    },
    card: {
      background: "white",
      padding: "35px",
      borderRadius: "24px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
      border: "1px solid #f1f1f1",
    },
    item: {
      display: "flex",
      justifyContent: "space-between",
      padding: "20px 0",
      borderBottom: "1px dashed #ddd",
    },
    input: {
      width: "100%",
      padding: "14px",
      marginBottom: "20px",
      borderRadius: "12px",
      border: "1px solid #eee",
      fontSize: "0.95rem",
      backgroundColor: "#f9f9f9",
    },
    totalBox: {
      marginTop: "30px",
      padding: "20px",
      backgroundColor: "#1a1a1a",
      color: "white",
      borderRadius: "15px",
      textAlign: "center",
    }
  };

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h1>Your Cart is Empty 🛒</h1>
      <button onClick={() => navigate("/")} style={{ padding: '12px 30px', borderRadius: '10px', cursor: 'pointer' }}>Go Shopping</button>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div>
        <h2 style={{ fontWeight: '800', marginBottom: '30px' }}>Order Summary</h2>
        <div style={styles.card}>
          {cart.map((item, i) => (
            <div key={i} style={styles.item}>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
                <p style={{ margin: '5px 0', color: '#636e72' }}>{item.shop}</p>
              </div>
              <span style={{ fontWeight: '700', color: '#0984e3' }}>₹{item.price}</span>
            </div>
          ))}
          <div style={styles.totalBox}>
            <span style={{ fontSize: '1.1rem', opacity: '0.8' }}>Grand Total: </span>
            <span style={{ fontSize: '1.8rem', fontWeight: '900', marginLeft: '10px' }}>₹{totalPrice}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 style={{ fontWeight: '800', marginBottom: '30px' }}>Delivery Info</h2>
        <form style={styles.card} onSubmit={handlePlaceOrder}>
          <input type="text" placeholder="Full Name" style={styles.input} required />
          <input type="tel" placeholder="Mobile Number" style={styles.input} required />
          <textarea placeholder="Full Address" style={{ ...styles.input, height: '120px' }} required />
          <button type="submit" style={{ width: '100%', padding: '18px', background: '#00b894', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
            Place Order Now 🛍️
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;