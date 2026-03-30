import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { cartItems, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
    window.scrollTo(0, 0);
  }, [cartItems, navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      // Save address implicitly
      await axios.post("/api/user/address", address);

      // Create Order in DB (status: pending, isPaid: false)
      const res = await axios.post("/api/orders", {
        shippingAddress: address,
        paymentMethod
      });
      const orderId = res.data._id;

      if (paymentMethod === "Online") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          setToast({ msg: "Razorpay SDK failed to load. Are you online?", type: "error" });
          setPlacingOrder(false);
          return;
        }

        // Generate Razorpay Order
        const rzpOrder = await axios.post("/api/payment/create-order", {
          amount: calculateSubtotal()
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || rzpOrder.data.key,
          amount: rzpOrder.data.amount,
          currency: rzpOrder.data.currency,
          name: "DriftKart",
          description: "Premium Racing Gear",
          order_id: rzpOrder.data.orderId,
          handler: async function (response) {
            try {
              // Verify Payment
              await axios.post("/api/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                driftkartOrderId: orderId
              });
              
              await fetchCart();
              navigate(`/order/${orderId}`);
            } catch (verifyErr) {
              setToast({ msg: "Payment Verification Failed", type: "error" });
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone || ""
          },
          theme: { color: "#f97316" }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
          setToast({ msg: "Payment Failed or Canceled", type: "error" });
        });
        paymentObject.open();
        
      } else {
        // COD Route
        await fetchCart();
        navigate(`/order/${orderId}`);
      }
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Failed to place order", type: "error" });
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-wrapper">
      <Navbar />
      
      <div className="checkout-container">
        <h1 className="checkout-header">Secure Checkout</h1>
        <p className="checkout-subtitle">Please review your shipping and payment details.</p>
        
        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-grid">
            
            {/* LEFT PANELS */}
            <div className="checkout-panels">
              
              <div className="checkout-card">
                <h3><span className="checkout-card-icon">1</span> Shipping Details</h3>
                
                <div className="address-grid">
                  <div className="floating-input-group address-full">
                    <input 
                      type="text" 
                      className="floating-input"
                      placeholder=" "
                      required 
                      value={address.street} 
                      onChange={e => setAddress({...address, street: e.target.value})} 
                    />
                    <label className="floating-label">Street Address</label>
                  </div>
                  
                  <div className="floating-input-group">
                    <input 
                      type="text" 
                      className="floating-input"
                      placeholder=" "
                      required 
                      value={address.city} 
                      onChange={e => setAddress({...address, city: e.target.value})} 
                    />
                    <label className="floating-label">City</label>
                  </div>
                  
                  <div className="floating-input-group">
                    <input 
                      type="text" 
                      className="floating-input"
                      placeholder=" "
                      required 
                      value={address.state} 
                      onChange={e => setAddress({...address, state: e.target.value})} 
                    />
                    <label className="floating-label">State</label>
                  </div>
                  
                  <div className="floating-input-group">
                    <input 
                      type="text" 
                      className="floating-input"
                      placeholder=" "
                      required 
                      value={address.pincode} 
                      onChange={e => setAddress({...address, pincode: e.target.value})} 
                    />
                    <label className="floating-label">Pincode / ZIP</label>
                  </div>
                </div>
              </div>

              <div className="checkout-card">
                <h3><span className="checkout-card-icon">2</span> Payment Method</h3>
                
                <div className="payment-methods-grid">
                  <div 
                    className={`payment-method-card ${paymentMethod === 'COD' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <div className="payment-icon">🚚</div>
                    <div className="payment-label">Cash on Delivery</div>
                    <div className="payment-desc">Pay when you receive the order</div>
                  </div>
                  
                  <div 
                    className={`payment-method-card ${paymentMethod === 'Online' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('Online')}
                  >
                    <div className="payment-icon">💳</div>
                    <div className="payment-label">Online Payment</div>
                    <div className="payment-desc">Secure payment gateway mock</div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT SUMMARY */}
            <div className="checkout-summary">
              <h3>Order Summary</h3>
              
              <div style={{marginBottom: 'var(--space-4)', maxHeight: '250px', overflowY: 'auto', paddingRight: '10px'}}>
                {cartItems.map(item => (
                  <div key={item.product._id} className="checkout-summary-item">
                    <strong>{item.quantity} x {item.product.name}</strong>
                    <span>₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="checkout-summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{color: '#10b981', fontWeight: 600}}>FREE</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span className="summary-total-val">₹{calculateSubtotal()}</span>
              </div>
              
              <button type="submit" className="btn-place-order ripple-btn" disabled={placingOrder}>
                {placingOrder ? "Processing Order..." : "Confirm & Pay"}
              </button>
              
              <div style={{textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </div>
            </div>

          </div>
        </form>
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
