import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/shop/Navbar";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import "./ProfileAccount.css";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, logout } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setToast({ msg: "Failed to load order details", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    window.scrollTo(0, 0);
  }, [id]);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  if (loading) return <div className="account-wrapper"><Navbar /><div style={{display:'flex',justifyContent:'center',padding:'5rem 0'}}><Loader /></div></div>;
  if (!order) return <div className="account-wrapper"><Navbar /><div className="account-container"><h2 style={{textAlign:'center', marginTop:'3rem', width:'100%'}}>Order not found</h2></div></div>;

  // Determine Stepper State
  const statuses = ["pending", "processing", "shipped", "delivered"];
  const currentStatusIndex = statuses.indexOf(order.status);
  
  const getStepClass = (index) => {
    if (order.status === 'cancelled') return 'cancelled';
    if (index < currentStatusIndex) return 'completed';
    if (index === currentStatusIndex) return 'active';
    return '';
  };

  return (
    <div className="account-wrapper">
      <Navbar />
      <div className="account-container">
        
        {/* SIDEBAR */}
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
          <div>
            <Link to="/orders" style={{color:'var(--primary)', textDecoration:'none', fontWeight:600, display:'inline-block', marginBottom:'var(--space-2)'}}>
              &larr; Back to Orders
            </Link>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', borderBottom:'1px solid var(--border)', paddingBottom:'var(--space-4)'}}>
              <div>
                <h1 style={{margin:0, fontFamily:'var(--font-display)', fontSize:'2rem'}}>Order Details</h1>
                <span style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>ID: #{order._id.toUpperCase()}</span>
              </div>
              <span className={`order-status-badge status-${order.status}`} style={{fontSize:'1rem', padding:'6px 16px'}}>{order.status}</span>
            </div>
          </div>

          {order.status !== 'cancelled' && (
            <div className="tracking-stepper">
              <div className={`tracking-step ${getStepClass(0)}`}>
                <div className="step-icon">📄</div>
                <div className="step-label">Pending</div>
              </div>
              <div className={`tracking-step ${getStepClass(1)}`}>
                <div className="step-icon">⚙️</div>
                <div className="step-label">Processing</div>
              </div>
              <div className={`tracking-step ${getStepClass(2)}`}>
                <div className="step-icon">🚚</div>
                <div className="step-label">Shipped</div>
              </div>
              <div className={`tracking-step ${getStepClass(3)}`}>
                <div className="step-icon">✅</div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
          )}
          
          {order.status === 'cancelled' && (
            <div style={{background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontWeight: 'bold', margin: '1rem 0'}}>
              ⚠️ This order has been cancelled.
            </div>
          )}

          <div className="order-detail-grid">
            
            {/* ITEMS LIST */}
            <div>
              <h3 style={{marginTop:0, fontFamily:'var(--font-display)', fontSize:'1.3rem', marginBottom:'var(--space-4)'}}>Items in your order</h3>
              <div className="order-items-wrapper">
                {order.items.map(item => (
                  <div className="order-detail-item" key={item._id}>
                    <img src={item.product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} alt={item.product?.name} className="order-detail-item-img" />
                    
                    <div style={{flex: 1}}>
                      <Link to={`/product/${item.product?._id}`} style={{textDecoration:'none', color:'var(--text)', fontWeight:600, fontSize:'1.1rem'}}>
                        {item.product?.name || "Deleted Product"}
                      </Link>
                      <div style={{color:'var(--text-muted)', marginTop:'0.25rem', fontSize:'0.9rem'}}>
                        Qty: {item.quantity} × ₹{item.price}
                      </div>
                    </div>
                    
                    <div style={{fontWeight:700, fontSize:'1.2rem', color:'var(--text)'}}>
                      ₹{item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY TIGHT PANEL */}
            <div style={{display:'flex', flexDirection:'column', gap:'var(--space-6)'}}>
              
              <div className="premium-card" style={{padding: 'var(--space-6)'}}>
                <h3 style={{margin:0, marginBottom:'var(--space-4)', paddingBottom:'var(--space-3)', borderBottom:'1px solid var(--border)'}}>Order Summary</h3>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'var(--space-3)', color:'var(--text)'}}>
                  <span>Items Subtotal</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'var(--space-3)', color:'var(--text)'}}>
                  <span>Shipping</span>
                  <span style={{color: '#10b981', fontWeight:600}}>FREE</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:'var(--space-4)', paddingTop:'var(--space-4)', borderTop:'1px dashed var(--border)', fontSize:'1.3rem', fontWeight:700, color:'var(--accent)'}}>
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                
                <div style={{marginTop:'var(--space-4)', paddingTop:'var(--space-4)', borderTop:'1px solid var(--border)'}}>
                  <h4 style={{margin:'0 0 0.5rem 0', fontSize:'0.9rem', color:'var(--text)'}}>Payment Method</h4>
                  <div style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>{order.paymentMethod}</div>
                </div>
              </div>

              <div className="premium-card" style={{padding: 'var(--space-6)'}}>
                <h3 style={{margin:0, marginBottom:'var(--space-4)', paddingBottom:'var(--space-3)', borderBottom:'1px solid var(--border)'}}>Shipping Address</h3>
                <div style={{color:'var(--text-muted)', lineHeight:1.6, fontSize:'0.95rem'}}>
                  <strong style={{color:'var(--text)'}}>{user?.name}</strong><br />
                  {order.shippingAddress?.street}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                  {order.shippingAddress?.pincode}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
