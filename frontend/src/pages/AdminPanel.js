import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [masterPass, setMasterPass] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', category: '', image: '', stock: '', isEdit: false, id: null });

    const fetchData = async () => {
        try {
            const prodRes = await axios.get("http://localhost:10000/products");
            const orderRes = await axios.get("http://localhost:10000/orders");
            setProducts(prodRes.data);
            setOrders(orderRes.data);
        } catch (err) { console.log("Backend connection error"); }
    };

    useEffect(() => {
        if (isAuthenticated) fetchData();
    }, [isAuthenticated]);

    const handleLogin = () => {
        if (masterPass === "DriftBoss786") setIsAuthenticated(true);
        else alert("Wrong Password!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.isEdit) {
                await axios.put(`http://localhost:10000/products/${form.id}`, form);
                alert("Updated! ✅");
            } else {
                await axios.post("http://localhost:10000/products", form);
                alert("Added! ➕");
            }
            setForm({ name: '', price: '', category: '', image: '', stock: '', isEdit: false });
            fetchData();
        } catch (err) { alert("Error saving data"); }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Delete this product?")) {
            await axios.delete(`http://localhost:10000/products/${id}`);
            fetchData();
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={styles.loginOverlay}>
                <div style={styles.loginBox}>
                    <h1 style={styles.logo}>Drift<span>Panel</span></h1>
                    <input type="password" placeholder="Master Password" style={styles.input} onChange={(e) => setMasterPass(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
                    <button onClick={handleLogin} style={styles.mainBtn}>Unlock Access</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.dashboard}>
            <header style={styles.header}>
                <h1 style={styles.logo}>Drift<span>Kart</span> Admin</h1>
                <div style={styles.tabGroup}>
                    <button onClick={() => setActiveTab('inventory')} style={activeTab === 'inventory' ? styles.activeTab : styles.tab}>Inventory</button>
                    <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? styles.activeTab : styles.tab}>Live Orders ({orders.length})</button>
                    <button onClick={() => setIsAuthenticated(false)} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <main style={styles.container}>
                {activeTab === 'inventory' ? (
                    <>
                        <div style={styles.card}>
                            <h3 style={{ marginTop: 0 }}>{form.isEdit ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
                            <form onSubmit={handleSubmit} style={styles.formGrid}>
                                <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} required />
                                <input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={styles.input} required />
                                <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input} required />
                                <input placeholder="Image Link (URL)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={styles.input} />
                                <button type="submit" style={styles.addBtn}>{form.isEdit ? 'Update Product' : 'Save to Stock'}</button>
                            </form>
                        </div>

                        <div style={styles.listContainer}>
                            {products.map(p => (
                                <div key={p._id} style={styles.itemRow}>
                                    <img src={p.image || 'https://via.placeholder.com/50'} alt={p.name} style={styles.thumb} />
                                    <div style={{ flex: 1, marginLeft: '15px' }}>
                                        <div style={{ fontWeight: '800' }}>{p.name}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>₹{p.price} • {p.category}</div>
                                    </div>
                                    <button onClick={() => setForm({ ...p, isEdit: true, id: p._id })} style={styles.iconBtn}>✏️</button>
                                    <button onClick={() => deleteProduct(p._id)} style={styles.iconBtn}>🗑️</button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={styles.ordersList}>
                        {orders.map(o => (
                            <div key={o._id} style={styles.orderCard}>
                                <div style={styles.orderHeader}>
                                    <strong>ORDER #{o._id.slice(-5).toUpperCase()}</strong>
                                    <span style={styles.statusBadge}>NEW</span>
                                </div>
                                <div style={styles.orderContent}>
                                    <div style={{ marginBottom: '10px' }}>📍 <strong>Address:</strong> {o.address.house}, {o.address.area}</div>
                                    <div style={styles.orderItemsList}>
                                        {o.items.map((item, idx) => (
                                            <div key={idx} style={styles.miniItem}>
                                                <img src={item.image} style={styles.miniThumb} alt="" />
                                                <span>{item.name} (x1)</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={styles.orderTotal}>Total Bill: ₹{o.total}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    dashboard: { fontFamily: 'Inter, sans-serif', backgroundColor: '#F4F4F4', minHeight: '100vh' },
    header: { backgroundColor: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
    logo: { fontSize: '22px', fontWeight: '900', margin: 0 },
    tabGroup: { display: 'flex', gap: '10px' },
    tab: { padding: '8px 15px', border: 'none', cursor: 'pointer', fontWeight: '700', borderRadius: '8px', background: '#eee' },
    activeTab: { padding: '8px 15px', border: 'none', cursor: 'pointer', fontWeight: '700', borderRadius: '8px', background: '#E23744', color: '#fff' },
    container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '20px' },
    formGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '12px', border: '1px solid #eee', borderRadius: '10px', outline: 'none' },
    addBtn: { padding: '15px', backgroundColor: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' },
    itemRow: { backgroundColor: '#fff', padding: '12px', borderRadius: '15px', display: 'flex', alignItems: 'center', marginBottom: '10px', border: '1px solid #eee' },
    thumb: { width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #f0f0f0' },
    iconBtn: { padding: '10px', border: 'none', background: '#f9f9f9', borderRadius: '8px', marginLeft: '5px', cursor: 'pointer' },
    orderCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '15px', borderLeft: '6px solid #E23744' },
    orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' },
    statusBadge: { backgroundColor: '#FFF5F6', color: '#E23744', padding: '4px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: '900' },
    orderItemsList: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' },
    miniItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' },
    miniThumb: { width: '30px', height: '30px', borderRadius: '5px', objectFit: 'cover' },
    orderTotal: { fontSize: '18px', fontWeight: '900', color: '#1A1A1A' },
    loginOverlay: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#1A1A1A' },
    loginBox: { padding: '40px', background: '#fff', borderRadius: '30px', textAlign: 'center', width: '320px' },
    mainBtn: { width: '100%', padding: '15px', background: '#E23744', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', marginTop: '15px' },
    logoutBtn: { background: '#f0f0f0', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }
};

export default AdminPanel;