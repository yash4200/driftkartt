import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Toast from "../../components/shop/Toast";
import Navbar from "../../components/shop/Navbar";
import "./ProfileAccount.css";

export default function ProfilePage() {
  const { user, fetchUserProfile, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/user/profile", { name, email });
      setToast({ msg: "Profile updated successfully", type: "success" });
      fetchUserProfile();
    } catch (err) {
      setToast({ msg: "Failed to update profile", type: "error" });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/user/password", { oldPassword, newPassword });
      setToast({ msg: "Password updated successfully", type: "success" });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Failed to update password", type: "error" });
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="account-wrapper">
      <Navbar />
      
      <div className="account-container">
        
        {/* SIDEBAR FOR DESKTOP & MOBILE */}
        <aside className="account-sidebar">
          <div className="account-user-card">
            <div className="account-avatar">{userInitial}</div>
            <div className="account-user-name">{user?.name || "User"}</div>
            <div className="account-user-email">{user?.email || ""}</div>
          </div>
          <nav className="account-nav">
            <Link to="/profile" className="account-nav-link active">
              <span>👤</span> Profile Details
            </Link>
            <Link to="/orders" className="account-nav-link">
              <span>📦</span> My Orders
            </Link>
            <button 
              onClick={logout} 
              className="account-nav-link" 
              style={{background: 'transparent', border: 'none', cursor: 'pointer', outline: 'none', width: '100%', textAlign: 'left', color: '#ef4444', marginTop: 'var(--space-4)'}}
            >
              <span>🚪</span> Logout
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="account-content">
          <h1 className="account-content-header">Personal Information</h1>
          <p style={{color: 'var(--text-muted)', marginBottom: 'var(--space-2)'}}>Update your account details and manage your security settings.</p>

          <div className="profile-blocks-grid">
            
            <form className="premium-card" onSubmit={handleProfileUpdate}>
              <h3><span>📝</span> General Info</h3>
              
              <div className="floating-input-group" style={{marginBottom: 'var(--space-4)'}}>
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
              
              <div className="floating-input-group" style={{marginBottom: 'var(--space-6)'}}>
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
              
              <button type="submit" className="hero-btn-primary ripple-btn" style={{width: '100%', padding: '0.8rem'}}>
                Save Changes
              </button>
            </form>

            <form className="premium-card" onSubmit={handlePasswordUpdate}>
              <h3><span>🔒</span> Security</h3>
              
              <div className="floating-input-group" style={{marginBottom: 'var(--space-4)'}}>
                <input 
                  type="password" 
                  className="floating-input"
                  placeholder=" "
                  required 
                  value={oldPassword} 
                  onChange={e => setOldPassword(e.target.value)} 
                />
                <label className="floating-label">Current Password</label>
              </div>
              
              <div className="floating-input-group" style={{marginBottom: 'var(--space-6)'}}>
                <input 
                  type="password" 
                  className="floating-input"
                  placeholder=" "
                  required 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                />
                <label className="floating-label">New Password</label>
              </div>
              
              <button type="submit" className="hero-btn-secondary ripple-btn" style={{width: '100%', padding: '0.8rem', borderColor: 'var(--primary)', color: 'var(--primary)'}}>
                Update Password
              </button>
            </form>

          </div>
        </main>
      </div>
      
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
