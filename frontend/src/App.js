import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// User pages
import Home from "./pages/Home";
import Results from "./pages/Results";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";

// Shop pages
import ShopLogin from "./pages/ShopLogin";
import ShopRegister from "./pages/ShopRegister";
import ShopDashboard from "./pages/ShopDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* 🏪 Shop Routes */}
        <Route path="/shop/login" element={<ShopLogin />} />
        <Route path="/shop/register" element={<ShopRegister />} />
        <Route path="/shop/dashboard" element={<ShopDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;