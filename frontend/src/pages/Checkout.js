import React from "react";

function Checkout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const placeOrder = () => {
    localStorage.removeItem("cart");
    window.location.href = "/success";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {cart.map((item, i) => (
        <p key={i}>{item.name} - ₹{item.price}</p>
      ))}

      <h3>Total: ₹{total}</h3>

      <button
        onClick={placeOrder}
        style={{
          padding: "10px",
          background: "black",
          color: "white",
          borderRadius: "10px"
        }}
      >
        Place Order
      </button>
    </div>
  );
}

export default Checkout;