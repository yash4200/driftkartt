import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault(); // Form submit handle karne ke liye
    if (search.trim()) {
      navigate(`/results?q=${search}`);
    }
  };

  // Inline Styles (Modern CSS approach)
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      fontFamily: "'Inter', sans-serif",
      color: "#2d3436",
    },
    card: {
      background: "rgba(255, 255, 255, 0.9)",
      padding: "40px",
      borderRadius: "24px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      textAlign: "center",
      width: "90%",
      maxWidth: "450px",
      backdropFilter: "blur(10px)",
    },
    title: {
      fontSize: "2.5rem",
      marginBottom: "8px",
      fontWeight: "800",
      letterSpacing: "-1px",
    },
    subtitle: {
      color: "#636e72",
      marginBottom: "30px",
      fontSize: "1.1rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "15px 20px",
      borderRadius: "12px",
      border: "2px solid #dfe6e9",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.3s ease",
      width: "100%",
      boxSizing: "border-box",
    },
    button: {
      padding: "15px",
      borderRadius: "12px",
      border: "none",
      backgroundColor: "#0984e3",
      color: "white",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "transform 0.2s, background-color 0.2s",
      boxShadow: "0 4px 12px rgba(9, 132, 227, 0.3)",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title}>🛒 DriftKart</div>
        <p style={styles.subtitle}>Smart local price comparison</p>

        <form onSubmit={handleSearch} style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Search for products, brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#0984e3")}
            onBlur={(e) => (e.target.style.borderColor = "#dfe6e9")}
          />

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#074fa1")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#0984e3")}
          >
            Find Best Deals
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;