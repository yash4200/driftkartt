import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Pages Import
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Results from './pages/Results';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Signup from './pages/Signup';
import Listing from './pages/Listing';
import ShopDetail from './pages/ShopDetail'; // 🚩 1. Shop Detail Page Import kiya

// 🛡️ Protected Route Logic
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// 💡 Auto-Scroll to top on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* 🔓 PUBLIC ZONE */}
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🚩 2. See All / Category Grid Route */}
        <Route path="/listing" element={<Listing />} />

        {/* 🚩 3. Shop Detail Route (Dynamic ID ke saath) */}
        <Route path="/shop/:shopId" element={<ShopDetail />} />

        {/* 🔒 PROTECTED CUSTOMER ZONE */}
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* ⚙️ ADMIN SECRET PORTAL */}
        <Route path="/admin-portal-access" element={<AdminPanel />} />

        {/* ⚠️ 404: Professional Error Page */}
        <Route path="*" element={
          <div style={styles.errorPage}>
            <h1 style={{ fontSize: '100px', margin: 0, color: '#E23744', fontWeight: '900' }}>404</h1>
            <p style={{ fontSize: '20px', color: '#666', fontWeight: '500' }}>Bhai, galat raste aa gaye! 😂</p>
            <p style={{ color: '#999', marginBottom: '30px' }}>This page doesn't exist.</p>
            <a href="/" style={styles.backHome}>Go to Home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

const styles = {
  errorPage: {
    textAlign: 'center',
    padding: '120px 20px',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh'
  },
  backHome: {
    display: 'inline-block',
    padding: '16px 35px',
    backgroundColor: '#1A1A1A',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '14px',
    fontWeight: '800',
    fontSize: '14px',
    transition: '0.3s ease'
  }
};

export default App;