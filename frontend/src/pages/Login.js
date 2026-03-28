import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        localStorage.setItem('userLoggedIn', 'true');
        // Sends user back to Checkout if they came from there
        navigate(-1);
    };

    return (
        <div style={styles.container}>
            <div style={styles.hero}>
                <h1 style={styles.logo}>Drift<span>Kart</span></h1>
                <p>Fastest Grocery Delivery in Town</p>
            </div>

            <div style={styles.card}>
                <h2 style={{ margin: '0 0 10px 0' }}>Login or Signup</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>Enter your details to sync your cart and orders</p>

                <div style={styles.inputGroup}>
                    <span style={{ fontWeight: 'bold', borderRight: '1px solid #ddd', paddingRight: '10px' }}>+91</span>
                    <input
                        type="number"
                        placeholder="Mobile Number"
                        style={styles.input}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <button style={styles.mainBtn} onClick={() => setShowOtp(true)}>Continue</button>

                <div style={styles.orRow}>
                    <div style={styles.line}></div>
                    <span style={{ padding: '0 10px', color: '#999', fontSize: '12px' }}>OR</span>
                    <div style={styles.line}></div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={styles.altBtn} onClick={handleLogin}>
                        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" width="18" alt="g" /> Google
                    </button>
                    <button style={styles.altBtn} onClick={handleLogin}>
                        <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" width="18" alt="e" /> Email
                    </button>
                </div>

                {showOtp && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <h3>Verify OTP</h3>
                            <input type="number" placeholder="Enter 123456" style={styles.otpInput} />
                            <button style={styles.mainBtn} onClick={handleLogin}>Login Now</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' },
    hero: { flex: 1, backgroundColor: '#E23744', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    logo: { fontSize: '40px', fontWeight: '900', margin: 0 },
    card: { flex: 1.5, backgroundColor: '#fff', marginTop: '-30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '40px 30px' },
    inputGroup: { display: 'flex', alignItems: 'center', border: '1.5px solid #eee', borderRadius: '12px', padding: '15px', gap: '15px', marginBottom: '20px' },
    input: { border: 'none', outline: 'none', fontSize: '16px', width: '100%' },
    mainBtn: { width: '100%', padding: '18px', backgroundColor: '#1c1c1c', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
    orRow: { display: 'flex', alignItems: 'center', margin: '30px 0' },
    line: { flex: 1, height: '1px', backgroundColor: '#eee' },
    altBtn: { flex: 1, padding: '12px', border: '1px solid #eee', borderRadius: '12px', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer' },
    modal: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end' },
    modalContent: { backgroundColor: '#fff', width: '100%', padding: '40px 30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px' },
    otpInput: { width: '100%', padding: '15px', border: '1.5px solid #eee', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', letterSpacing: '5px' }
};

export default Login;