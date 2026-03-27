import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Success = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1 style={{ color: '#28a745' }}>🎉 Order Successful!</h1>
      <p>Bhai, tera order confirm ho gaya hai.</p>
      {orderId && (
        <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', display: 'inline-block' }}>
          <strong>Order ID:</strong> <span style={{ color: '#007bff' }}>{orderId}</span>
        </div>
      )}
      <br /><br />
      <Link to="/" style={{ textDecoration: 'none', color: 'white', background: '#333', padding: '10px 20px', borderRadius: '5px' }}>
        Back to Shopping
      </Link>
    </div>
  );
};

export default Success;