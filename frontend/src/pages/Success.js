import React from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#fdfdfd",
      fontFamily: "'Inter', sans-serif",
      textAlign: "center",
      padding: "20px",
    },
    iconCircle: {
      width: "100px",
      height: "100px",
      backgroundColor: "#e3faf3",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
      fontSize: "50px",
      animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },
    card: {
      maxWidth: "400px",
      padding: "40px",
      backgroundColor: "white",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
    },
    heading: {
      color: "#2d3436",
      fontSize: "2rem",
      margin: "0 0 10px 0",
      fontWeight: "800",
    },
    text: {
      color: "#636e72",
      lineHeight: "1.6",
      marginBottom: "30px",
    },
    homeBtn: {
      padding: "14px 28px",
      borderRadius: "12px",
      border: "none",
      backgroundColor: "#00b894",
      color: "white",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 15px rgba(0, 184, 148, 0.2)",
    }
  };

  return (
    <div style={styles.container}>
      {/* Animation keyframes style tag mein dal sakte hain ya CSS file mein */}
      <style>
        {`
          @keyframes popIn {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.card}>
        <center>
          <div style={styles.iconCircle}>✅</div>
        </center>

        <h1 style={styles.heading}>Order Placed!</h1>
        <p style={styles.text}>
          Thank you for shopping with **DriftKart**. Your order has been confirmed and is being processed by the local shops.
        </p>

        <button
          style={styles.homeBtn}
          onClick={() => navigate("/")}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 12px 20px rgba(0, 184, 148, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 15px rgba(0, 184, 148, 0.2)";
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Success;