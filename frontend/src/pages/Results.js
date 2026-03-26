import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ LOCAL STORAGE CART
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query");

  // 🔄 FETCH PRODUCTS
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    axios.get("https://driftkartt.onrender.com/products")
      .then(res => setProducts(res.data))
      .catch(err => {
        console.log(err);
        setError("Failed to fetch products");
      })
      .finally(() => setLoading(false));
  }, [query]);

  // 💾 SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 💰 MIN PRICE
  const prices = products.map(p => Number(p.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  // 🛒 ADD
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  // ❌ REMOVE
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // 💰 TOTAL
  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      
      <h2 style={{ textAlign: "center" }}>Results for: {query}</h2>

      {/* 🛒 CART */}
      <div style={{
        marginBottom: "20px",
        background: "white",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h3>🛒 Cart ({cart.length})</h3>

        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>{item.name} - ₹{item.price}</span>
              <button
                onClick={() => removeFromCart(i)}
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "3px 8px",
                  cursor: "pointer"
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}

        <hr />
        <h3>Total: ₹{total}</h3>

        {/* ✅ CHECKOUT BUTTON */}
        <button
          onClick={() => navigate("/checkout")}
          disabled={cart.length === 0}
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: cart.length === 0 ? "#ccc" : "green",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            fontSize: "16px"
          }}
        >
          Checkout
        </button>
      </div>

      {/* 🛍️ PRODUCTS */}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {!loading && products.length === 0 && (
        <p style={{ textAlign: "center" }}>No products found</p>
      )}
      {!loading && products.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {products.map((item, index) => {
            const isBest = Number(item.price) === minPrice;

            return (
              <div
                key={index}
                style={{
                  width: "250px",
                  margin: "15px",
                  padding: "15px",
                  borderRadius: "15px",
                  backgroundColor: isBest ? "#d4edda" : "white",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  textAlign: "center"
                }}
              >
                <h3>{item.name}</h3>
                <p style={{ color: "gray" }}>{item.shop}</p>
                <h2>₹{item.price}</h2>

                {isBest && <p style={{ color: "green" }}>🔥 Best Deal</p>}

                <button
                  onClick={() => addToCart(item)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 15px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "black",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Results;