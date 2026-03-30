import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (password.length === 0) setStrength("");
    else if (password.length < 6) setStrength("weak");
    else if (password.length < 10) setStrength("medium");
    else setStrength("strong");
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-layout-split">
      <div className="auth-panel-left">
        <div className="auth-brand-info">
          <h1>Join DriftKart</h1>
          <p>Unlock exclusive deals and priority shipping.</p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600" 
          alt="Mockup" 
          className="auth-mockup"
        />
      </div>

      <div className="auth-panel-right">
        <div className="auth-form-wrapper">
          <h2>Create Account</h2>
          
          {error && <div className="auth-alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="floating-input-group">
              <input 
                type="text" 
                className="floating-input"
                placeholder=" "
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
              <label className="floating-label">Full Name</label>
            </div>

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
            
            <div className="floating-input-group password-input-wrap" style={{ marginBottom: 0 }}>
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
            
            {password.length > 0 && (
              <div className="password-strength">
                <div className={`strength-bar ${strength}`}></div>
              </div>
            )}

            <button type="submit" className="auth-submit-btn ripple-btn" style={{ marginTop: '1.5rem' }}>
              Register
            </button>

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
              Already have an account? <Link to="/login" style={{ marginLeft: '5px' }}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
