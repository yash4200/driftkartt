import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 🚩 Render URL - Make sure this is correct!
const API_URL = "https://driftkart-backend.onrender.com";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPass, setMasterPass] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // Added for UX
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '', shopName: '', isEdit: false, id: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/orders`).catch(() => ({ data: [] })) // Fallback if orders route isn't ready
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error("Backend unreachable. Check Render logs.");
    } finally {
      setLoading(false);
    }
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
        await axios.put(`${API_URL}/products/${form.id}`, form);
        alert("Product Updated! ✏️");
      } else {
        await axios.post(`${API_URL}/products`, form);
        alert("New Product Added! ➕");
      }
      // Reset Form
      setForm({ name: '', price: '', category: '', image: '', shopName: '', isEdit: false, id: null });
      fetchData();
    } catch (err) {
      alert("Action failed. Check your Backend routes.");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure? This item will be removed from DriftKart.")) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        fetchData();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  // --- UI RENDERING ---
  if (!isAuthenticated) {
    return (
      <div style={styles.loginOverlay}>
        <div style={styles.loginBox}>
          <h1 style={styles.logo}>Drift<span>Panel</span></h1>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>Security Level: Master</p>
          <input type="password" placeholder="Enter Master Key" style={styles.input}
            onChange={(e) => setMasterPass(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} style={styles.mainBtn}>Unlock Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Drift<span>Kart</span> Admin</h1>
        <div style={styles.tabGroup}>
          <button onClick={() => setActiveTab('inventory')} style={activeTab === 'inventory' ? styles.activeTab : styles.tab}>Stock</button>
          <button onClick={() => setActiveTab('orders')} style={activeTab === 'orders' ? styles.activeTab : styles.tab}>Orders ({orders.length})</button>
          <button onClick={() => setIsAuthenticated(false)} style={styles.logoutBtn}>Exit</button>
        </div>
      </header>

      <main style={styles.container}>
        {loading && <p style={{ textAlign: 'center', fontSize: '12px' }}>Connecting to DriftKart Cloud...</p>}

        {activeTab === 'inventory' ? (
          <>
            <div style={styles.card}>
              <h3 style={{ marginTop: 0 }}>{form.isEdit ? 'Modify Item' : 'Add to Collection'}</h3>
              <form onSubmit={handleSubmit} style={styles.formGrid}>
                <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} required />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={{ ...styles.input, flex: 1 }} required />
                  <input placeholder="Shop / Branch Name" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} style={{ ...styles.input, flex: 1 }} required />
                </div>
                <input placeholder="Category (e.g. Beverages, Snacks)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input} required />
                <input placeholder="Image URL (Direct link)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={styles.input} />
                <button type="submit" style={styles.addBtn}>{form.isEdit ? 'Save Changes' : 'Publish Product'}</button>
              </form>
            </div>

            <div style={styles.listContainer}>
              <h3 style={styles.sectionTitle}>Inventory Control</h3>
              {products.map(p => (
                <div key={p._id} style={styles.itemRow}>
                  <img src={p.image || 'https://via.placeholder.com/50'} alt="" style={styles.thumb} />
                  <div style={{ flex: 1, marginLeft: '15px' }}>
                    <div style={{ fontWeight: '800' }}>{p.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>₹{p.price} | {p.shopName}</div>
                  </div>
                  <button onClick={() => setForm({ ...p, isEdit: true, id: p._id })} style={styles.iconBtn}>✏️</button>
                  <button onClick={() => deleteProduct(p._id)} style={styles.iconBtn}>🗑️</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.ordersList}>
            <h3 style={styles.sectionTitle}>Live Incoming Orders</h3>
            {orders.length > 0 ? orders.map(o => (
              <div key={o._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <strong>#{o._id.slice(-6).toUpperCase()}</strong>
                  <span style={styles.statusBadge}>ACTIVE</span>
                </div>
                <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                  📍 {o.address?.house}, {o.address?.area}
                </div>
                <div style={styles.orderItemsList}>
                  {o.items?.map((item, idx) => (
                    <div key={idx} style={styles.miniItem}>• {item.name} (x1)</div>
                  ))}
                </div>
                <div style={styles.orderTotal}>Total: ₹{o.total}</div>
              </div>
            )) : <p style={{ textAlign: 'center', color: '#999' }}>Waiting for orders...</p>}
          </div>
        )}
      </main>
    </div>
  );
};

// --- STYLES (Keep exactly as you designed) ---
const styles = {
  dashboard: { fontFamily: "'Inter', sans-serif", backgroundColor: '#F8F9FA', minHeight: '100vh' },
  header: { backgroundColor: '#fff', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' },
  logo: { fontSize: '20px', fontWeight: '900', margin: 0 },
  tabGroup: { display: 'flex', gap: '10px', alignItems: 'center' },
  tab: { padding: '8px 16px', border: 'none', cursor: 'pointer', fontWeight: '700', borderRadius: '10px', background: '#f0f0f0' },
  activeTab: { padding: '8px 16px', border: 'none', cursor: 'pointer', fontWeight: '700', borderRadius: '10px', background: '#E23744', color: '#fff' },
  container: { padding: '20px', maxWidth: '700px', margin: '0 auto' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '25px' },
  formGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '14px', border: '1px solid #eee', borderRadius: '12px', outline: 'none', backgroundColor: '#F9F9F9' },
  addBtn: { padding: '16px', backgroundColor: '#1A1A1A', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', marginTop: '10px' },
  itemRow: { backgroundColor: '#fff', padding: '12px 18px', borderRadius: '18px', display: 'flex', alignItems: 'center', marginBottom: '10px', border: '1px solid #f0f0f0' },
  thumb: { width: '45px', height: '45px', borderRadius: '10px', objectFit: 'cover' },
  iconBtn: { padding: '8px', border: 'none', background: '#f5f5f5', borderRadius: '8px', marginLeft: '8px', cursor: 'pointer' },
  sectionTitle: { fontSize: '18px', fontWeight: '800', marginBottom: '15px', color: '#333' },
  orderCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '20px', marginBottom: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderLeft: '5px solid #E23744' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  statusBadge: { backgroundColor: '#FFF5F6', color: '#E23744', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' },
  orderItemsList: { padding: '10px 0', borderTop: '1px solid #f9f9f9', borderBottom: '1px solid #f9f9f9', marginBottom: '10px' },
  miniItem: { fontSize: '14px', color: '#555', marginBottom: '4px' },
  orderTotal: { fontSize: '18px', fontWeight: '900' },
  loginOverlay: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#111' },
  loginBox: { padding: '40px', background: '#fff', borderRadius: '32px', textAlign: 'center', width: '340px' },
  mainBtn: { width: '100%', padding: '16px', background: '#E23744', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '800', marginTop: '15px', cursor: 'pointer' },
  logoutBtn: { background: 'none', border: '1px solid #eee', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }
};

export default AdminPanel;