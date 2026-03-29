import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Results from './pages/Results';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';

// 🛡️ Protected Route: Sirf Checkout/Success jaise pages ke liye
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
        {/* 🔓 PUBLIC ZONE: Ye bina login ke khulega */}
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 PROTECTED CUSTOMER ZONE: Inke liye login chahiye */}
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />

        {/* ⚙️ ADMIN SECRET PORTAL: Iska apna alag login hai jo humne AdminPanel mein banaya hai */}
        <Route path="/admin-portal-access" element={<AdminPanel />} />

        {/* ⚠️ 404: Professional Error Page */}
        <Route path="*" element={
          <div style={styles.errorPage}>
            <h1 style={{ fontSize: '80px', margin: 0, color: '#E23744' }}>404</h1>
            <p style={{ fontSize: '18px', color: '#666' }}>Bhai, ye page toh stock mein nahi hai! 😂</p>
            <a href="/" style={styles.backHome}>Wapas Home Chalo</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

const styles = {
  errorPage: { textAlign: 'center', padding: '100px 20px', fontFamily: 'Inter, sans-serif' },
  backHome: {
    display: 'inline-block', marginTop: '20px', padding: '15px 30px',
    backgroundColor: '#1A1A1A', color: '#fff', textDecoration: 'none',
    borderRadius: '12px', fontWeight: 'bold'
  }
};

export default App;