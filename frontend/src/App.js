import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// FIX: Folder name small 'context' rakha hai as per industry standard
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";
import Results from "./pages/Results";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";

const Navbar = () => (
  <nav style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 5%",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Inter', sans-serif"
  }}>
    <Link to="/" style={{ textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold", color: "#2d3436" }}>
      🛒 <span style={{ color: "#0984e3" }}>Drift</span>Kart
    </Link>
    <div style={{ display: "flex", gap: "25px" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#636e72", fontWeight: "500" }}>Home</Link>
      <Link to="/checkout" style={{
        textDecoration: "none",
        color: "white",
        backgroundColor: "#2d3436",
        padding: "8px 16px",
        borderRadius: "8px",
        fontWeight: "500",
        fontSize: "0.9rem"
      }}>
        Cart 🛍️
      </Link>
    </div>
  </nav>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main style={{
          minHeight: "calc(100vh - 140px)",
          background: "#f8f9fa",
          paddingBottom: "40px"
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <footer style={{
          textAlign: "center",
          padding: "30px",
          color: "#b2bec3",
          fontSize: "0.85rem",
          borderTop: "1px solid #eee",
          backgroundColor: "white"
        }}>
          © 2026 DriftKart • Comparing Local Prices for You
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;