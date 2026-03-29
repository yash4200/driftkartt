import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://driftkartt.onrender.com";

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '', originalPrice: '' });

    const handleLogin = () => {
        if (password === "DriftBoss786") {
            setIsLoggedIn(true);
        } else {
            alert("Wrong Password! ❌");
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchProducts();
        }
    }, [isLoggedIn]);

    const fetchProducts = async () => {
        const res = await axios.get(`${API_URL}/products`);
        setProducts(res.data);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/products`, newProduct);
        setNewProduct({ name: '', price: '', category: '', image: '', originalPrice: '' });
        fetchProducts();
        alert("Product Added! ✅");
    };

    const deleteProduct = async (id) => {
        await axios.delete(`${API_URL}/products/${id}`);
        fetchProducts();
    };

    if (!isLoggedIn) {
        return (
            <div style={styles.loginCont}>
                <div style={styles.card}>
                    <h2 style={{ marginBottom: '20px' }}>Admin Secure Login</h2>
                    <input
                        type="password"
                        placeholder="Enter Admin Password"
                        style={styles.input}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin} style={styles.btn}>Access Panel</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={{ margin: 0 }}>DriftKart <span style={{ color: '#E23744' }}>Admin</span></h1>
                <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
            </header>

            <div style={styles.content}>
                <div style={styles.card}>
                    <h3>Add New Product</h3>
                    <form onSubmit={handleAddProduct}>
                        <input type="text" placeholder="Product Name" style={styles.input} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                        <input type="number" placeholder="Price" style={styles.input} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                        <input type="number" placeholder="Original Price (MRP)" style={styles.input} onChange={e => setNewProduct({ ...newProduct, originalPrice: e.target.value })} />
                        <input type="text" placeholder="Category" style={styles.input} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} required />
                        <input type="text" placeholder="Image URL" style={styles.input} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} required />
                        <button type="submit" style={styles.btn}>Add Product to Store</button>
                    </form>
                </div>

                <div style={styles.listCard}>
                    <h3>Current Inventory ({products.length})</h3>
                    <div style={styles.tableHead}>
                        <span>Item</span>
                        <span>Category</span>
                        <span>Price</span>
                        <span>Action</span>
                    </div>
                    {products.map(p => (
                        <div key={p._id} style={styles.itemRow}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={p.image} width="30" height="30" style={{ objectFit: 'contain' }} alt="" />
                                <span>{p.name}</span>
                            </div>
                            <span>{p.category}</span>
                            <span style={{ fontWeight: 'bold' }}>₹{p.price}</span>
                            <button onClick={() => deleteProduct(p._id)} style={styles.delBtn}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    header: { backgroundColor: '#fff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    loginCont: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
    content: { padding: '40px', maxWidth: '1000px', margin: '0 auto' },
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' },
    listCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#E23744', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
    logoutBtn: { padding: '8px 15px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    tableHead: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '10px', borderBottom: '2px solid #eee', fontWeight: 'bold', fontSize: '14px', color: '#888' },
    itemRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '15px 10px', borderBottom: '1px solid #f9f9f9', alignItems: 'center', fontSize: '14px' },
    delBtn: { backgroundColor: '#fff', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }
};

export default AdminPanel;