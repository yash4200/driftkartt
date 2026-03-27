import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();

  // 1. State for Form Inputs
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: ''
  });

  // 2. Dummy Cart Data (Baad mein isse Context/Redux se connect karenge)
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const handleOrder = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      items: cart,
      totalAmount: totalPrice,
      orderDate: new Date()
    };

    try {
      // Backend Route check kar lena (server.js mein humne /api/orders rakha tha)
      const res = await axios.post('https://driftkartt.onrender.com/api/orders', orderData);

      if (res.data.success) {
        alert("🎉 Order Successful!");
        localStorage.removeItem('cart'); // Cart saaf karo
        navigate('/success'); // Success page par bhejo
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("❌ Order fail ho gaya. Dobara try karein.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Secure Checkout 💳</h2>

      <div style={styles.summary}>
        <h4>Order Summary</h4>
        <p>Total Items: {cart.length}</p>
        <p><strong>Amount to Pay: ₹{totalPrice}</strong></p>
      </div>

      <form onSubmit={handleOrder} style={styles.form}>
        <input
          type="text"
          placeholder="Apna Naam Likhein"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Poora Address (House No, Street, Landmark)"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>Place Order (Cash on Delivery)</button>
      </form>
    </div>
  );
};

// --- Professional UI Styles ---
const styles = {
  container: { maxWidth: '500px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#1A237E', marginBottom: '20px' },
  summary: { backgroundColor: '#F8F9FA', padding: '15px', borderRadius: '10px', marginBottom: '20px', borderLeft: '5px solid #3949AB' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', minHeight: '80px' },
  button: { padding: '15px', backgroundColor: '#3949AB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }
};

export default Checkout;