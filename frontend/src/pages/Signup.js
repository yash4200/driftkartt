import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', pass: '' });
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h1 style={styles.logo}>Drift<span style={{ color: '#E23744' }}>Kart</span></h1>
                <h2 style={styles.title}>Create your account</h2>
                <p style={styles.subtitle}>Join us for a better shopping experience</p>

                <form onSubmit={handleSignup} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input type="text" placeholder="John Doe" style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input type="email" placeholder="name@example.com" style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number</label>
                        <input type="tel" placeholder="+91 00000 00000" style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Create Password</label>
                        <input type="password" placeholder="••••••••" style={styles.input} required />
                    </div>
                    <button type="submit" style={styles.loginBtn}>Sign Up</button>
                </form>

                <div style={styles.footer}>
                    <span>Already have an account? </span>
                    <span style={styles.link} onClick={() => navigate('/login')}>Login here</span>
                </div>
            </div>
        </div>
    );
};

// Styles same as Login.js
const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', fontFamily: 'Inter, sans-serif' },
    loginBox: { width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' },
    logo: { fontSize: '28px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' },
    title: { fontSize: '20px', fontWeight: '700', color: '#222', marginBottom: '8px' },
    subtitle: { fontSize: '13px', color: '#888', marginBottom: '30px' },
    form: { textAlign: 'left' },
    inputGroup: { marginBottom: '15px' }, // Slightly less margin for more fields
    label: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '8px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    loginBtn: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#E23744', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
    footer: { marginTop: '25px', fontSize: '13px', color: '#666' },
    link: { color: '#E23744', fontWeight: '700', cursor: 'pointer' }
};

export default Signup;