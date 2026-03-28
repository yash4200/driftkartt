import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🚩 IMPORT CHECK: Bas ye confirm kar lo ki ye files isi folder mein hain
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Root Path (Sabse pehle Home dikhna chahiye) */}
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />

        {/* 2. Other Pages */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* 3. Secret Admin Path (Isko / se alag rakha hai) */}
        <Route path="/admin-portal-access" element={<AdminPanel />} />

        {/* 4. Safety Net: Agar koi random URL daale toh Home par bhej do */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;