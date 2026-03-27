import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/results?q=${search}`);
    }
  };

  const styles = {
    container: {
      minHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at top right, #eef2f3, #8e9eab)",
      fontFamily: "'Poppins', sans-serif",
    },
    card: {
      background: "rgba(255, 255, 255, 0.85)",
      padding: "60px 40px",
      borderRadius: "30px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
      textAlign: "center",
      width: "90%",
      maxWidth: "500px",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255,255,255,0.3)",
      animation: "fadeIn 1s ease-out",
    },
    logo: {
      fontSize: "3.5rem",
      marginBottom: "10px",
      fontWeight: "900",
      background: "linear-gradient(to right, #0984e3, #00b894)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      color: "#636e72",
      marginBottom: "40px",
      fontSize: "1.2rem",
      fontWeight: "400",
    },
    input: {
      padding: "18px 25px",
      borderRadius: "15px",
      border: "2px solid #eee",
      fontSize: "1.1rem",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      transition: "all 0.3s ease",
      marginBottom: "20px",
    },
    button: {
      width: "100%",
      padding: "18px",
      borderRadius: "15px",
      border: "none",
      background: "linear-gradient(45deg, #0984e3, #074fa1)",
      color: "white",
      fontSize: "1.1rem",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(9, 132, 227, 0.3)",
      transition: "transform 0.2s ease",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>DriftKart</div>
        <p style={styles.subtitle}>Stop Overpaying. Start Comparing.</p>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="What are you looking for today?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#0984e3")}
            onBlur={(e) => (e.target.style.borderColor = "#eee")}
          />
          <button type="submit" style={styles.button}>
            Find Best Deals 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;