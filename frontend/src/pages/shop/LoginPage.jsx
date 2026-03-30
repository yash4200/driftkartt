import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-layout-split">
      <div className="auth-panel-left">
        <div className="auth-brand-info">
          <h1>DriftKart</h1>
          <p>Your premium marketplace for world-class gear.</p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600" 
          alt="Mockup" 
          className="auth-mockup"
        />
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrapper">
          <h2>Welcome Back</h2>
          
          {error && <div className="auth-alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="floating-input-group">
              <input 
                type="email" 
                className="floating-input"
                placeholder=" "
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
              <label className="floating-label">Email Address</label>
            </div>
            
            <div className="floating-input-group password-input-wrap">
              <input 
                type={showPassword ? "text" : "password"} 
                className="floating-input"
                placeholder=" "
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <label className="floating-label">Password</label>
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>

            <div className="auth-extra-links">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/login" onClick={(e) => { e.preventDefault(); alert("Feature coming soon!"); }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-submit-btn ripple-btn">Log In</button>

            <div className="auth-social-divider">Or continue with</div>
            <div className="social-btns">
              <button type="button" className="btn-social">
                <span style={{color: '#db4437'}}>G</span> Google
              </button>
              <button type="button" className="btn-social">
                <span style={{color: '#4267B2'}}>f</span> Facebook
              </button>
            </div>

            <p className="auth-extra-links" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              Don't have an account? <Link to="/register" style={{ marginLeft: '5px' }}>Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
