import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const context = useContext(CartContext);
  const navigate = useNavigate();

  if (!context) {
    return <h2>Error: Cart not found</h2>;
  }

  const { cart, setCart } = context;

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const placeOrder = () => {
    setCart([]); // clear cart
    localStorage.removeItem("cart");
    navigate("/success");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map((item, i) => (
          <p key={i}>
            {item.name} - ₹{item.price}
          </p>
        ))
      )}

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
        Place Order  //yasj
      </button>
    </div>
  );
}

export default Checkout;