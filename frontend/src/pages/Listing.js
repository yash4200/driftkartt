import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = "https://driftkartt.onrender.com";

const Listing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { search } = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(search).get('cat'); // URL se category uthayega

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/products`);
                // Agar category URL mein hai toh filter karo, nahi toh saare dikhao
                const filtered = query
                    ? res.data.filter(p => p.category?.toLowerCase().includes(query.toLowerCase()))
                    : res.data;
                setProducts(filtered);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [query]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading {query} items...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
            <button onClick={() => navigate('/')} style={styles.backBtn}>← Back to Home</button>
            <h2 style={{ textTransform: 'capitalize', marginBottom: '20px' }}>{query || "All Products"} ({products.length})</h2>

            <div style={styles.grid}>
                {products.map((p) => {
                    const discount = p.originalPrice > p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                    return (
                        <div key={p._id} style={styles.card} onClick={() => { localStorage.setItem('cartItem', JSON.stringify(p)); navigate('/checkout'); }}>
                            {discount > 0 && <div style={styles.discount}>{discount}% OFF</div>}
                            <div style={styles.imgBox}><img src={p.image} alt={p.name} style={styles.img} /></div>
                            <p style={styles.name}>{p.name}</p>
                            <p style={styles.shop}>{p.shopName}</p>
                            <div style={styles.priceRow}>
                                <span style={styles.price}>₹{p.price}</span>
                                <button style={styles.addBtn}>ADD</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    backBtn: { border: 'none', background: '#f0f0f0', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', marginBottom: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' },
    card: { border: '1px solid #eee', borderRadius: '12px', padding: '12px', position: 'relative', cursor: 'pointer' },
    discount: { position: 'absolute', top: 0, left: 0, background: '#2563EB', color: '#fff', fontSize: '10px', padding: '2px 8px', borderBottomRightRadius: '8px', borderTopLeftRadius: '12px', fontWeight: 'bold' },
    imgBox: { height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
    name: { fontSize: '13px', fontWeight: '700', height: '35px', overflow: 'hidden', margin: '10px 0 5px' },
    shop: { fontSize: '10px', color: '#999', marginBottom: '10px' },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontWeight: '800' },
    addBtn: { background: '#fff', border: '1px solid #E23744', color: '#E23744', padding: '4px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }
};

export default Listing;