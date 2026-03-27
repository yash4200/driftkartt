import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
    padding: "15px 8%",
    backgroundColor: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "1px solid #eee"
  }}>
    <Link to="/" style={{ textDecoration: "none", fontSize: "1.6rem", fontWeight: "900", color: "#1a1a1a" }}>
      🛒 <span style={{ color: "#0984e3" }}>Drift</span>Kart
    </Link>
    <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#2d3436", fontWeight: "600" }}>Home</Link>
      <Link to="/checkout" style={{
        textDecoration: "none",
        color: "white",
        backgroundColor: "#1a1a1a",
        padding: "10px 22px",
        borderRadius: "12px",
        fontWeight: "600",
        transition: "all 0.3s ease"
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
        <main style={{ minHeight: "80vh" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>
        <footer style={{ textAlign: "center", padding: "40px", color: "#636e72", borderTop: "1px solid #eee" }}>
          © 2026 <strong>DriftKart</strong> • Built for smart shoppers
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;