import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { cartItems, updateQuantity, removeCartItem, clearCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);
  const [removingIds, setRemovingIds] = useState([]); // Track items being removed for animation

  const handleQtyChange = async (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) return setToast({ msg: `Only ${stock} units available`, type: "error" });
    
    const res = await updateQuantity(productId, newQty);
    if (res.error) setToast({ msg: res.error, type: "error" });
  };

  const handleRemove = async (productId) => {
    // Start animation
    setRemovingIds(prev => [...prev, productId]);
    
    // Wait for animation to finish before actually removing
    setTimeout(async () => {
      const res = await removeCartItem(productId);
      if (!res.error) setToast({ msg: "Item removed", type: "success" });
      setRemovingIds(prev => prev.filter(id => id !== productId));
    }, 300);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
  };

  return (
    <div className="cart-page-wrapper">
      <Navbar />
      
      {cartItems.length === 0 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet. Discover our premium selection of gear and upgrade your lifestyle.</p>
          <Link to="/shop" className="hero-btn-primary ripple-btn" style={{ display: 'inline-block' }}>Start Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* LEFT: ITEMS */}
          <div className="cart-items-section">
            <div className="cart-header-actions">
              <h1>Shopping Cart</h1>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear All
              </button>
            </div>

            {cartItems.map(item => {
              const prod = item.product;
              if (!prod) return null; // Edge case
              const isRemoving = removingIds.includes(prod._id);
              
              return (
                <div className={`cart-item-modern ${isRemoving ? 'removing' : ''}`} key={prod._id}>
                  <div className="cart-item-img-wrapper">
                    <img 
                      src={prod.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} 
                      alt={prod.name} 
                    />
                  </div>
                  
                  <div className="cart-item-details">
                    <Link to={`/product/${prod._id}`} className="cart-item-title">
                      {prod.name}
                    </Link>
                    <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-2)'}}>
                      Category: {prod.category}
                    </div>
                    
                    <div className="cart-item-price">₹{prod.price}</div>
                    
                    <div className="cart-item-bottom">
                      <div className="qty-control" style={{transform: 'scale(0.9)', transformOrigin: 'left center'}}>
                        <button className="qty-btn" onClick={() => handleQtyChange(prod._id, item.quantity - 1, prod.stock)}>-</button>
                        <input 
                          type="number" 
                          value={item.quantity} 
                          readOnly 
                        />
                        <button className="qty-btn" onClick={() => handleQtyChange(prod._id, item.quantity + 1, prod.stock)}>+</button>
                      </div>

                      <button className="btn-remove-item" onClick={() => handleRemove(prod._id)} title="Remove Item">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="cart-summary-sticky">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((a,c)=>a+c.quantity, 0)} items)</span>
              <span>₹{calculateSubtotal()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping Estimate</span>
              <span style={{color: '#10b981', fontWeight: 600}}>FREE</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (Included)</span>
              <span>₹0</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span className="summary-total-val">₹{calculateSubtotal()}</span>
            </div>
            
            <Link to="/checkout" className="checkout-btn-primary ripple-btn">
              Proceed to Secure Checkout
            </Link>
            
            <div style={{textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
              🔒 Secure payment processing. All prices include VAT where applicable.
            </div>
          </div>
        </div>
      )}

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
