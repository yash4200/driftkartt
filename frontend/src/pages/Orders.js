import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Local storage se order data uthao (Checkout page se jo save hua tha)
        const savedOrder = localStorage.getItem('lastOrder');
        if (savedOrder) {
            setOrders([JSON.parse(savedOrder)]); // Array mein wrap kiya taaki list jaisa dikhe
        }
    }, []);

    return (
        <div style={styles.container}>
            {/* --- MINI HEADER --- */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <button onClick={() => navigate('/')} style={styles.backBtn}>←</button>
                    <h1 style={styles.headerTitle}>My Orders</h1>
                </div>
            </header>

            <main style={styles.main}>
                {orders.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={{ fontSize: '50px' }}>📦</div>
                        <h3>No orders yet!</h3>
                        <p>Seems like you haven't ordered anything yet.</p>
                        <button onClick={() => navigate('/')} style={styles.shopBtn}>Start Shopping</button>
                    </div>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} style={styles.orderCard}>
                            <div style={styles.orderTop}>
                                <div style={styles.statusBadge}>Arriving Soon</div>
                                <span style={styles.orderId}>ID: #DK-{Math.floor(1000 + Math.random() * 9000)}</span>
                            </div>

                            <div style={styles.productInfo}>
                                <img src={order.image} alt={order.name} style={styles.productImg} />
                                <div style={styles.details}>
                                    <h4 style={styles.pName}>{order.name}</h4>
                                    <p style={styles.pPrice}>₹{order.price}</p>
                                    <p style={styles.pQty}>Qty: 1</p>
                                </div>
                            </div>

                            <hr style={styles.divider} />

                            <div style={styles.orderBottom}>
                                <div style={styles.timeline}>
                                    <div style={styles.stepActive}></div>
                                    <div style={styles.line}></div>
                                    <div style={styles.step}></div>
                                    <div style={styles.line}></div>
                                    <div style={styles.step}></div>
                                </div>
                                <div style={styles.timelineLabels}>
                                    <span>Placed</span>
                                    <span>Shipped</span>
                                    <span>Delivered</span>
                                </div>
                            </div>

                            <button style={styles.trackBtn}>Track Shipment</button>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

const styles = {
    container: { backgroundColor: '#F7F8FA', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
    header: { backgroundColor: '#fff', padding: '15px 20px', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #eee' },
    headerContent: { display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '600px', margin: '0 auto' },
    backBtn: { border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' },
    headerTitle: { fontSize: '18px', fontWeight: '800', margin: 0 },
    main: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
    orderCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' },
    orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    statusBadge: { backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' },
    orderId: { fontSize: '12px', color: '#aaa', fontWeight: '600' },
    productInfo: { display: 'flex', gap: '15px', alignItems: 'center' },
    productImg: { width: '70px', height: '70px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#f9f9f9' },
    details: { flex: 1 },
    pName: { fontSize: '15px', fontWeight: '700', margin: '0 0 5px 0', color: '#333' },
    pPrice: { fontSize: '16px', fontWeight: '800', margin: 0, color: '#000' },
    pQty: { fontSize: '12px', color: '#888', margin: '5px 0 0 0' },
    divider: { border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' },
    orderBottom: { marginBottom: '20px' },
    timeline: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' },
    stepActive: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#E23744', boxShadow: '0 0 0 4px rgba(226, 55, 68, 0.2)' },
    step: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ddd' },
    line: { flex: 1, height: '2px', backgroundColor: '#eee', margin: '0 5px' },
    timelineLabels: { display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#888', fontWeight: '600' },
    trackBtn: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: '0.2s' },
    emptyState: { textAlign: 'center', marginTop: '100px' },
    shopBtn: { backgroundColor: '#E23744', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', marginTop: '20px', fontWeight: '700', cursor: 'pointer' }
};

export default Orders;