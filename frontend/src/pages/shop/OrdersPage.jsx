import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/shop/Navbar";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import "./ProfileAccount.css";

export default function OrdersPage() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders/my");
        setOrders(res.data);
      } catch (err) {
        setToast({ msg: "Failed to load orders", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    window.scrollTo(0, 0);
  }, []);

  const handleCancel = async (id) => {
    try {
      await axios.put(`/api/orders/${id}/cancel`);
      setToast({ msg: "Order cancelled", type: "success" });
      setOrders(orders.map(o => o._id === id ? { ...o, status: "cancelled" } : o));
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Failed to cancel order", type: "error" });
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
            <Link to="/profile" className="account-nav-link">
              <span>👤</span> Profile Details
            </Link>
            <Link to="/orders" className="account-nav-link active">
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
          <h1 className="account-content-header">Order History</h1>
          <p style={{color: 'var(--text-muted)', marginBottom: 'var(--space-2)'}}>Track, return, or buy items again.</p>

          {loading ? (
            <div style={{display:'flex', justifyContent:'center', padding:'4rem 0'}}><Loader /></div>
          ) : orders.length === 0 ? (
            <div style={{textAlign:'center', padding:'4rem 0', background:'var(--surface)', borderRadius:'var(--radius-lg)', border:'1px dashed var(--border)'}}>
               <div style={{fontSize:'3rem', marginBottom:'1rem'}}>📦</div>
               <h2 style={{fontFamily:'var(--font-display)', marginBottom:'0.5rem'}}>No orders found</h2>
               <p style={{color:'var(--text-muted)', marginBottom:'1.5rem'}}>Looks like you haven't placed an order yet.</p>
               <Link to="/shop" className="hero-btn-primary ripple-btn" style={{display:'inline-block'}}>Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list-wrapper">
              {orders.map(order => (
                <div className="order-premium-card" key={order._id}>
                  <div className="order-info-col">
                    <div className="order-number">Order #{order._id.substring(16, 24).toUpperCase()}</div>
                    <div className="order-date-text">
                      Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div style={{marginTop: '0.5rem'}}>
                       <span className={`order-status-badge status-${order.status}`}>{order.status}</span>
                    </div>
                    <div style={{color:'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem'}}>
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="order-action-col">
                    <div className="order-total-price">₹{order.totalAmount}</div>
                    
                    <div style={{display:'flex', gap:'var(--space-3)', marginTop:'var(--space-2)'}}>
                      <Link to={`/order/${order._id}`} className="btn-view-order ripple-btn">
                        View Details
                      </Link>
                      {order.status === 'pending' && (
                        <button onClick={() => handleCancel(order._id)} className="btn-cancel-order ripple-btn">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
