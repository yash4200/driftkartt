import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "https://driftkartt.onrender.com";

const ShopDetail = () => {
    const { shopName } = useParams(); // URL se dukan ka naam nikalne ke liye
    const navigate = useNavigate();
    const [shopProducts, setShopProducts] = useState([]);
    const [shopSearch, setShopSearch] = useState("");
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('driftCart')) || [];
        setCart(savedCart);

        const fetchShopData = async () => {
            try {
                const res = await axios.get(`${API_URL}/products`);
                // Sirf iss shop ke products filter karo
                const filtered = res.data.filter(p => p.shopName === shopName);
                setShopProducts(filtered);
            } catch (err) { console.log(err); }
        };
        fetchShopData();
    }, [shopName]);

    const handleAddToCart = (item) => {
        let currentCart = [...cart];
        const index = currentCart.findIndex(i => i._id === item._id);
        if (index > -1) { currentCart[index].quantity += 1; }
        else { currentCart.push({ ...item, quantity: 1 }); }
        setCart(currentCart);
        localStorage.setItem('driftCart', JSON.stringify(currentCart));
    };

    // 🔍 Search inside this shop only
    const displayedProducts = shopProducts.filter(p =>
        p.name.toLowerCase().includes(shopSearch.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <button onClick={() => navigate('/')} style={styles.backBtn}>←</button>
                <div style={{ flex: 1 }}>
                    <h2 style={styles.shopTitle}>{shopName}</h2>
                    <p style={styles.shopStatus}>Open now • Delivery in 20 mins</p>
                </div>
            </header>

            <div style={styles.searchWrap}>
                <input
                    type="text"
                    placeholder={`Search items in ${shopName}...`}
                    style={styles.shopSearch}
                    onChange={(e) => setShopSearch(e.target.value)}
                />
            </div>

            <main style={styles.list}>
                {displayedProducts.map(item => (
                    <div key={item._id} style={styles.productRow}>
                        <div style={{ flex: 1 }}>
                            <h4 style={styles.pName}>{item.name}</h4>
                            <p style={styles.pPrice}>₹{item.price}</p>
                        </div>
                        <div style={styles.imgContainer}>
                            <img src={item.image} style={styles.pImg} />
                            <button style={styles.addBtn} onClick={() => handleAddToCart(item)}>ADD</button>
                        </div>
                    </div>
                ))}
            </main>

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <div style={styles.cartBar} onClick={() => navigate('/checkout')}>
                    <span>{cart.length} Items Added</span>
                    <span>View Cart →</span>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', minHeight: '100vh' },
    header: { padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #f2f2f2' },
    backBtn: { fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer' },
    shopTitle: { margin: 0, fontSize: '20px', fontWeight: '900' },
    shopStatus: { margin: 0, fontSize: '11px', color: '#257E3E', fontWeight: '700' },
    searchWrap: { padding: '15px' },
    shopSearch: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', outline: 'none' },
    list: { padding: '0 20px' },
    productRow: { display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #f2f2f2' },
    pName: { margin: '0 0 5px 0', fontSize: '15px', fontWeight: '700' },
    pPrice: { margin: 0, fontWeight: '800' },
    imgContainer: { position: 'relative', width: '80px', textAlign: 'center' },
    pImg: { width: '80px', height: '80px', borderRadius: '10px', objectFit: 'contain' },
    addBtn: { position: 'absolute', bottom: '-5px', left: '10px', right: '10px', background: '#fff', border: '1px solid #E23744', color: '#E23744', borderRadius: '5px', fontWeight: '900', padding: '3px' },
    cartBar: { position: 'fixed', bottom: '20px', left: '20px', right: '20px', background: '#E23744', color: '#fff', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '800' }
};

export default ShopDetail;