import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Results() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    axios
      .get(`https://driftkartt.onrender.com/products?query=${query}`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, [query]);

  const prices = products.map(p => Number(p.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Results for: {query}</h2>

      {products.map((item, index) => {
        const isBest = Number(item.price) === minPrice;

        return (
          <div
            key={index}
            style={{
              border: "2px solid",
              margin: "10px",
              padding: "10px",
              backgroundColor: isBest ? "lightgreen" : "white"
            }}
          >
            <p><b>{item.name}</b></p>
            <p>{item.shop}</p>
            <p>₹{item.price}</p>

            {isBest && <h3>🔥 BEST DEAL</h3>}

            {/* 🔥 Add to Cart */}
            <button
              onClick={() => addToCart(item)}
              style={{
                padding: "5px",
                background: "blue",
                color: "white",
                border: "none",
                marginTop: "5px"
              }}
            >
              Add to Cart
            </button>
          </div>
        );
      })}

      {/* 🔥 Go to Checkout */}
      {products.length > 0 && (
        <button
          onClick={() => navigate("/checkout")}
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "green",
            color: "white",
            border: "none"
          }}
        >
          Go to Checkout
        </button>
      )}
    </div>
  );
}

export default Results;