import React, { useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import "./ProductCard.css";

export default function ProductCard({ product, onAddToCart }) {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (added || product.stock <= 0) return;
    
    await onAddToCart(product._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    setWishlist(!wishlist);
  };

  const isDiscounted = product.discountedPrice && product.discountedPrice < product.price;
  const displayPrice = isDiscounted ? product.discountedPrice : product.price;

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <Link to={`/product/${product._id}`}>
          <img 
            src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} 
            alt={product.name} 
            className="card-image"
          />
        </Link>
        <div className="card-badge">{product.category || "General"}</div>
        <button 
          className={`wishlist-btn ${wishlist ? 'active' : ''}`}
          onClick={toggleWishlist}
          aria-label="Toggle Wishlist"
        >
          <span className="wishlist-icon">{wishlist ? "❤️" : "🤍"}</span>
        </button>
      </div>

      <div className="card-content">
        <Link to={`/product/${product._id}`} className="card-title">
          {product.name}
        </Link>
        
        <div className="card-meta">
          <StarRating rating={product.avgRating || 0} readonly />
          <span className="review-count">({product.numReviews || 0})</span>
        </div>

        <div className="card-price-row">
          <div className="price-container">
            <span className="price-current">₹{displayPrice}</span>
            {isDiscounted && <span className="price-original">₹{product.price}</span>}
          </div>
          
          <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <button 
          className={`btn-add-cart-new ripple-btn ${added ? "success" : ""}`} 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {added ? "Added ✓" : product.stock > 0 ? "🛍️ Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
