import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import "./Navbar.css"; // Switching from Components.css to specific Navbar.css

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartWiggle, setCartWiggle] = useState(false);

  // Trigger bounce animation when cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartWiggle(true);
      const timer = setTimeout(() => setCartWiggle(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Handle sticky scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${search}`);
  };

  const getUserInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      <nav className={`site-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="logo-icon">🏎️</span>
            <h2>DriftKart</h2>
          </Link>
          
          <form className="navbar-search" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">🔍</button>
          </form>

          <div className="navbar-links">
            <Link to="/shop" className="nav-link">Shop</Link>
            
            <Link to="/cart" className="nav-link cart-icon-wrapper">
              🛒 <span className={`cart-badge ${cartWiggle ? 'bounce' : ''}`}>{cartCount}</span>
            </Link>
            
            {user ? (
              <div className="nav-dropdown">
                <span className="nav-link user-greeting">
                  <div className="user-avatar-circle">{getUserInitial()}</div>
                  Hi, {user.name.split(" ")[0]} ▾
                </span>
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <Link to="/orders">My Orders</Link>
                  {user.isAdmin && <Link to="/admin">Admin Panel</Link>}
                  <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nav-btn-login ripple-btn">Login / Register</Link>
            )}
          </div>

          {/* Mobile specific elements */}
          <div className="mobile-tools">
            <Link to="/cart" className="cart-icon-wrapper-mobile">
              🛒 <span className={`cart-badge ${cartWiggle ? 'bounce' : ''}`}>{cartCount}</span>
            </Link>
            <div 
              className={`navbar-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>

      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        {user ? (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/orders" className="nav-link">My Orders</Link>
            {user.isAdmin && <Link to="/admin" className="nav-link">Admin Panel</Link>}
            <button 
              className="nav-btn-login ripple-btn" 
              style={{ marginTop: '20px' }}
              onClick={() => { logout(); navigate("/"); }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-btn-login ripple-btn">Login / Register</Link>
        )}
      </div>
    </>
  );
}
