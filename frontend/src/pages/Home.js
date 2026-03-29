import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://driftkart-backend.onrender.com";

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("driftAdminAuth") === "true");
  const [masterPass, setMasterPass] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '', shopName: '', isEdit: false, id: null });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const handleLogin = () => {
    if (masterPass === "DriftBoss786") {
      setIsAuthenticated(true);
      localStorage.setItem("driftAdminAuth", "true");
    } else { alert("❌ Incorrect Key"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = { name: form.name, price: form.price, category: form.category, image: form.image, shopName: form.shopName };
    try {
      if (form.isEdit) {
        await axios.put(`${API_URL}/products/${form.id}`, data);
      } else {
        await axios.post(`${API_URL}/products`, data);
      }
      setForm({ name: '', price: '', category: '', image: '', shopName: '', isEdit: false, id: null });
      fetchData();
    } catch (err) { alert("Error saving product"); }
    finally { setIsSubmitting(false); }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this item?")) {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchData();
    }
  };

  if (!isAuthenticated) return (
    <div style={styles.loginOverlay}>
      <div style={styles.loginBox}>
        <h1 style={styles.logo}>Drift<span>Panel</span></h1>
        <input type="password" placeholder="Master Passkey" style={styles.input} onChange={(e) => setMasterPass(e.target.value)} />
        <button onClick={handleLogin} style={styles.mainBtn}>Unlock Dashboard</button>
      </div>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Drift<span>Kart</span> Admin</h1>
        <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem("driftAdminAuth"); }} style={styles.tab}>Logout</button>
      </header>
      <main style={styles.container}>
        <div style={styles.card}>
          <h3>{form.isEdit ? '📝 Edit Product' : '📦 Add New Product'}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={styles.input} required />
            <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={styles.input} required />
            <input placeholder="Shop Name" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} style={styles.input} />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input} required />
            <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} style={styles.input} />
            <button type="submit" disabled={isSubmitting} style={styles.addBtn}>{isSubmitting ? 'Saving...' : 'Save Product'}</button>
          </form>
        </div>

        <div style={styles.listContainer}>
          {products.map(p => (
            <div key={p._id} style={styles.itemRow}>
              <div style={{ flex: 1 }}>
                <strong>{p.name}</strong> <br /> <small>₹{p.price} | {p.shopName}</small>
              </div>
              <button onClick={() => setForm({ ...p, isEdit: true, id: p._id })} style={styles.iconBtn}>✏️</button>
              <button onClick={() => deleteProduct(p._id)} style={styles.iconBtn}>🗑️</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  loginOverlay: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' },
  loginBox: { padding: '40px', background: '#fff', borderRadius: '20px', textAlign: 'center' },
  dashboard: { fontFamily: "'Inter', sans-serif", background: '#f4f4f4', minHeight: '100vh' },
  header: { background: '#fff', padding: '15px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd' },
  logo: { fontSize: '22px', fontWeight: '900', margin: 0 },
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  card: { background: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '20px' },
  formGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  addBtn: { padding: '12px', background: '#E23744', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  itemRow: { background: '#fff', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  iconBtn: { marginLeft: '10px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' },
  mainBtn: { width: '100%', padding: '12px', background: '#E23744', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '15px' }
};

export default AdminPanel;