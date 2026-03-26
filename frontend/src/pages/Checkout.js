import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} style={{ margin: "10px" }}>
              <p>{item.name} - ₹{item.price}</p>
            </div>
          ))}

          <h3>Total: ₹{total}</h3>

          <button
            onClick={() => navigate("/success")}
            style={{
              padding: "10px",
              background: "green",
              color: "white"
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