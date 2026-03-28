import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel';
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website */}
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* Secret Admin Access */}
        <Route path="/admin-portal-access" element={<AdminPanel />} />

        {/* 🛡️ Safety Net: Agar koi galat link daale toh Home par bhej do */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;