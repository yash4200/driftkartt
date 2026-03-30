import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import ProductCard from "../../components/shop/ProductCard";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import "./HomePage.css";

// Hook to animate numbers
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, nodeRef };
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [toast, setToast] = useState(null);

  // Stats
  const productsCount = useCountUp(500);
  const customersCount = useCountUp(10000);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("/api/products?featured=true&limit=8"),
          axios.get("/api/products/categories")
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
      } catch (err) {
        setToast({ msg: "Failed to load shop data", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleAddToCart = async (id) => {
    const res = await addToCart(id, 1);
    if (res.error) setToast({ msg: res.error, type: "error" });
    else setToast({ msg: "Added to cart!", type: "success" });
  };

  const headline = "Gear Up Your Life with DriftKart".split(" ");

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <section className="hero-extended">
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
          <div className="hero-content">
            <h1 className="word-reveal">
              {headline.map((word, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.1}s`, marginRight: '10px' }}>
                  {word}
                </span>
              ))}
            </h1>
            <p>Discover the finest selection of premium products, unbeatable prices, and lightning-fast delivery.</p>
            <div className="hero-ctas">
              <Link to="/shop" className="hero-btn-primary ripple-btn">Shop Now</Link>
              <Link to="/profile" className="hero-btn-secondary ripple-btn">Join Now</Link>
            </div>
          </div>
          <div className="hero-visual">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" 
              alt="Premium Headphones" 
              className="hero-floating-img" 
            />
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item" ref={productsCount.nodeRef}>
            <div className="stat-num">{productsCount.count}+</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat-item" ref={customersCount.nodeRef}>
            <div className="stat-num">{customersCount.count.toLocaleString()}+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">Free</div>
            <div className="stat-label">Fast Shipping</div>
          </div>
        </div>
      </section>

      <div className="container">
        {loading ? <Loader /> : (
          <>
            <h2 className="section-title">Shop by Category</h2>
            <div className="category-chips-wrapper">
              <div className="category-chips">
                <Link to="/shop" className="chip active ripple-btn">All</Link>
                {categories.map(cat => (
                  <Link to={`/shop?category=${cat}`} key={cat} className="chip ripple-btn">{cat}</Link>
                ))}
              </div>
            </div>

            <h2 className="section-title">Featured Products</h2>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </>
        )}
      </div>

      <section className="newsletter-strip">
        <div className="newsletter-content">
          <h2>Stay in the loop</h2>
          <p>Get the latest updates on new products and upcoming sales.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); setToast({ msg: "Subscribed!", type: "success" }); }}>
            <input type="email" placeholder="Enter your email address" required />
            <button type="submit" className="ripple-btn">Subscribe</button>
          </form>
        </div>
      </section>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
