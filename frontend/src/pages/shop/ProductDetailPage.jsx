import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/shop/Navbar";
import StarRating from "../../components/shop/StarRating";
import Loader from "../../components/shop/Loader";
import Toast from "../../components/shop/Toast";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import "./ProductDetailPage.css";

// Reusable Accordion Component
const AccordionItem = ({ title, children, open = false }) => {
  const [isOpen, setIsOpen] = useState(open);
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className="accordion-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const fetchProduct = async () => {
    try {
      const [pRes, rRes] = await Promise.all([
        axios.get(`/api/products/${id}`),
        axios.get(`/api/reviews/${id}`)
      ]);
      setProduct(pRes.data);
      setReviews(rRes.data || []);
    } catch (err) {
      setToast({ msg: "Failed to load product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !product.product) return;
    const res = await addToCart(product.product._id, parseInt(qty));
    if (res.error) setToast({ msg: res.error, type: "error" });
    else setToast({ msg: "Added to cart successfully!", type: "success" });
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return setToast({ msg: "Please login to review", type: "error" });
    try {
      await axios.post("/api/reviews", { productId: id, rating, comment });
      setToast({ msg: "Review submitted!", type: "success" });
      setComment("");
      setRating(5);
      fetchProduct();
    } catch (err) {
      setToast({ msg: err.response?.data?.message || "Error submitting review", type: "error" });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      setToast({ msg: "Review deleted", type: "success" });
      fetchProduct();
    } catch (err) {
      setToast({ msg: "Error deleting review", type: "error" });
    }
  };

  if (loading) return <div className="page-wrapper"><Navbar /><Loader /></div>;
  if (!product || !product.product) return <div className="page-wrapper"><Navbar /><h2 style={{textAlign:'center', marginTop:'3rem'}}>Product not found</h2></div>;

  const { product: prod, avgRating, numReviews } = product;
  const isDiscounted = prod.discountedPrice && prod.discountedPrice < prod.price;
  const displayPrice = isDiscounted ? prod.discountedPrice : prod.price;

  // We only have one image usually, but if there's an array, map over it. We'll simulate 3 thumbnails for premium feel if only 1 image.
  const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image, prod.image, prod.image].filter(Boolean);

  return (
    <div className="product-page-wrapper">
      <Navbar />
      
      <div className="detail-container">
        <div className="product-detail-layout">
          
          {/* LEFT: GALLERY */}
          <div className="product-gallery">
            <div className="main-image-wrapper">
              <img 
                src={images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30"} 
                alt={prod.name} 
                className="main-image" 
              />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-row">
                {images.map((img, idx) => (
                  <button key={idx} className={`thumbnail-btn ${idx === 0 ? 'active' : ''}`}>
                    <img src={img} alt={`Thumb ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="product-info">
            <div className="breadcrumb-nav">
              <Link to="/">Home</Link> <span>/</span> <Link to={`/shop?category=${prod.category}`}>{prod.category}</Link> <span>/</span> {prod.name}
            </div>
            
            <h1 className="product-detail-title">{prod.name}</h1>
            
            <div className="product-meta-row">
              <StarRating rating={avgRating} readonly />
              <span className="review-count">({numReviews} Verified Reviews)</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>SKU: {prod._id.slice(-6).toUpperCase()}</span>
            </div>

            <div className="product-price-block">
              <span className="price-current-lg">₹{displayPrice}</span>
              {isDiscounted && <span className="price-original" style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.2rem' }}>₹{prod.price}</span>}
            </div>

            {prod.stock > 0 ? (
              <div className="status-badge status-in">
                <span style={{fontSize: '10px'}}>●</span> In Stock ({prod.stock} Ready to Ship)
              </div>
            ) : (
              <div className="status-badge status-out">
                <span style={{fontSize: '10px'}}>●</span> Currently Unavailable
              </div>
            )}

            <div className="action-box">
              <label style={{ fontWeight: 600, color: 'var(--text)' }}>Quantity</label>
              <div className="qty-control">
                <button 
                  className="qty-btn" 
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1 || prod.stock === 0}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max={prod.stock} 
                  value={qty} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQty(Math.min(Math.max(1, val), prod.stock));
                  }} 
                  disabled={prod.stock === 0}
                />
                <button 
                  className="qty-btn" 
                  onClick={() => setQty(q => Math.min(prod.stock, q + 1))}
                  disabled={qty >= prod.stock || prod.stock === 0}
                >
                  +
                </button>
              </div>

              <button 
                className={`btn-add-primary ripple-btn ${prod.stock === 0 ? 'disabled' : ''}`}
                onClick={handleAddToCart}
                disabled={prod.stock === 0}
              >
                {prod.stock > 0 ? "🛍️ Add to Cart Now" : "Out of Stock"}
              </button>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span title="Free Standard Shipping on orders over ₹500">🚚 Free Delivery</span>
                <span>🛡️ 30-Day Returns</span>
                <span>🔒 Secure Checkout</span>
              </div>
            </div>

            <div className="accordion">
              <AccordionItem title="Product Description" open={true}>
                {prod.description}
              </AccordionItem>
              <AccordionItem title="Features & Specifications">
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>Premium craftsmanship and materials.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Exclusive design from DriftKart.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Full manufacturer warranty included.</li>
                </ul>
              </AccordionItem>
              <AccordionItem title="Shipping Information">
                Orders are usually processed within 24 hours. Standard shipping takes 3-5 business days. Express shipping is available at checkout.
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* BOTTOM: REVIEWS */}
        <div className="reviews-section">
          <div className="reviews-header">
            <div>
              <h2>Customer Reviews</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <StarRating rating={avgRating} readonly />
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Based on {numReviews} reviews</span>
              </div>
            </div>
          </div>

          <div className="review-list">
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <h3>No reviews yet</h3>
                <p>Be the first to share your experience with this product!</p>
              </div>
            ) : (
              reviews.map(rev => {
                const initial = (rev.user?.name || "U")[0].toUpperCase();
                return (
                  <div key={rev._id} className="review-card">
                    <div className="review-card-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">{initial}</div>
                        <div>
                          <div className="reviewer-name">{rev.user?.name || "Unknown User"}</div>
                          <StarRating rating={rev.rating} readonly />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="review-date">{new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        {(user?._id === rev.user?._id || user?.isAdmin) && (
                          <button onClick={() => handleDeleteReview(rev._id)} className="btn-icon" title="Delete Review">
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="review-body">
                      {rev.comment}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {user ? (
            <form className="write-review-form" onSubmit={handleAddReview}>
              <h3>Write a Review</h3>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Your Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} />
              </div>
              <textarea 
                className="review-textarea"
                rows="4" 
                placeholder="Share your thoughts about this product..." 
                required 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="hero-btn-primary ripple-btn" style={{ border: 'none' }}>
                Submit Review
              </button>
            </form>
          ) : (
            <div className="write-review-form" style={{ textAlign: 'center' }}>
              <h3>Want to leave a review?</h3>
              <p style={{ margin: '1rem 0' }}>Please log in to share your experience.</p>
              <Link to="/login" className="hero-btn-secondary ripple-btn" style={{ textDecoration: 'none', display: 'inline-block', color: 'var(--primary)', borderColor: 'var(--border)' }}>
                Login to Review
              </Link>
            </div>
          )}
        </div>
      </div>

      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
