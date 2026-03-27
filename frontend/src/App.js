import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

// Components (Assuming you have these imported)
import Home from "./pages/Home";
import Results from "./pages/Results";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";

// Ek simple modern Navbar jo har page par rahegi
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
    <div style={{ display: "flex", gap: "20px" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#636e72", fontWeight: "500" }}>Home</Link>
      <Link to="/checkout" style={{ textDecoration: "none", color: "#636e72", fontWeight: "500" }}>Cart 🛍️</Link>
    </div>
  </nav>
);

function App() {
  return (
    <CartProvider>
      <Router>
        {/* Navbar ko yahan rakhne se ye har page par dikhegi */}
        <Navbar />

        {/* Main Content Area with global styling */}
        <main style={{ minHeight: "calc(100vh - 70px)", background: "#f8f9fa" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </main>

        {/* Footer (Optional but looks professional) */}
        <footer style={{ textAlign: "center", padding: "20px", color: "#b2bec3", fontSize: "0.9rem" }}>
          © 2026 DriftKart - Comparing Local Prices for You
        </footer>
      </Router>
    </CartProvider>
  );
}

export default App;