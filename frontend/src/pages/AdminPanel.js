import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '', price: '', storeName: '', distance: '1.0 km', category: 'Grocery'
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        const res = await axios.get('https://driftkartt.onrender.com/products');
        setProducts(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://driftkartt.onrender.com/products/add', formData);
            alert("✅ Product Added!");
            setFormData({ name: '', price: '', storeName: '', distance: '1.0 km', category: 'Grocery' });
            fetchInventory(); // List refresh karo
        } catch (err) { alert("❌ Error!"); }
    };

    const deleteItem = async (id) => {
        if (window.confirm("Delete kar dein?")) {
            await axios.delete(`https://driftkartt.onrender.com/products/${id}`);
            fetchInventory();
        }
    };

    return (
        <div style={styles.adminPage}>
            {/* --- Sidebar --- */}
            <nav style={styles.sidebar}>
                <h2 style={styles.sideLogo}>Drift<span>Admin</span></h2>
                <ul style={styles.navList}>
                    <li style={styles.navItemActive}>📊 Dashboard</li>
                    <li style={styles.navItem}>📦 Inventory</li>
                    <li style={styles.navItem}>🚚 Orders</li>
                </ul>
            </nav>

            {/* --- Main Content --- */}
            <main style={styles.mainContent}>
                <header style={styles.topBar}>
                    <h3>Store Management</h3>
                    <div style={styles.adminProfile}>Admin Mode ⚡</div>
                </header>

                {/* Quick Stats */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}><h4>Total Items</h4><p>{products.length}</p></div>
                    <div style={styles.statCard}><h4>Live Stores</h4><p>5</p></div>
                    <div style={styles.statCard}><h4>Status</h4><p style={{ color: '#4CAF50' }}>Online</p></div>
                </div>

                <div style={styles.contentGrid}>
                    {/* Add Product Form */}
                    <section style={styles.formSection}>
                        <h4>Add New Inventory 📝</h4>
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <input type="text" placeholder="Item Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={styles.input} required />
                            <input type="number" placeholder="Price (₹)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={styles.input} required />
                            <input type="text" placeholder="Store Name" value={formData.storeName} onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} style={styles.input} required />
                            <button type="submit" style={styles.submitBtn}>Add to Live App</button>
                        </form>
                    </section>

                    {/* Inventory Table */}
                    <section style={styles.tableSection}>
                        <h4>Recent Products</h4>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr><th>Name</th><th>Price</th><th>Store</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {products.slice(0, 8).map(p => (
                                        <tr key={p._id}>
                                            <td>{p.name}</td>
                                            <td>₹{p.price}</td>
                                            <td>{p.storeName}</td>
                                            <td><button onClick={() => deleteItem(p._id)} style={styles.delBtn}>🗑️</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

// --- Dashboard UI Styles ---
const styles = {
    adminPage: { display: 'flex', height: '100vh', backgroundColor: '#F0F2F5', fontFamily: 'sans-serif' },
    sidebar: { width: '240px', backgroundColor: '#1C252E', color: 'white', padding: '20px' },
    sideLogo: { color: '#6366F1', marginBottom: '40px', fontSize: '22px' },
    navList: { listStyle: 'none', padding: 0 },
    navItemActive: { padding: '12px', backgroundColor: '#333F4A', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' },
    navItem: { padding: '12px', color: '#919EAB', cursor: 'pointer' },

    mainContent: { flex: 1, padding: '30px', overflowY: 'auto' },
    topBar: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' },
    adminProfile: { backgroundColor: '#E3F2FD', padding: '8px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#1976D2' },

    statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statCard: { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },

    contentGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' },
    formSection: { backgroundColor: 'white', padding: '20px', borderRadius: '15px', height: 'fit-content' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
    submitBtn: { padding: '12px', backgroundColor: '#6366F1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },

    tableSection: { backgroundColor: 'white', padding: '20px', borderRadius: '15px' },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', textAlign: 'left' },
    delBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }
};

export default AdminPanel;