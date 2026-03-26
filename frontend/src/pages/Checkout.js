import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart } = useContext(CartContext) || {};
  const navigate = useNavigate();

  const safeCart = cart || [];

  const total = safeCart.reduce((sum, item) => {
    return sum + (Number(item.price) || 0);
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {safeCart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {safeCart.map((item, index) => (
            <div key={index}>
              <p>{item.name} - ₹{item.price}</p>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          <button
            onClick={() => navigate("/success")}
            style={{
              padding: "10px",
              background: "green",
              color: "white",
              border: "none"
            }}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;