import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import AdminPanel from './pages/AdminPanel'; // 👈 Check matching import
import Success from './pages/Success';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* 🚩 Is path ko browser mein kholo login ke liye */}
        <Route path="/admin-portal-access" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;