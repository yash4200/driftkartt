import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Results from './pages/Results';
import AdminPanel from './pages/AdminPanel'; // Naya Admin Page link kiya

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* Admin Page (Tumhare Liye) */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;