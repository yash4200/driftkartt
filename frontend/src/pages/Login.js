import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Yahan login logic aayega
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <div style={styles.loginBox}>
                <h1 style={styles.logo}>Drift<span style={{ color: '#E23744' }}>Kart</span></h1>
                <h2 style={styles.title}>Login to your account</h2>
                <p style={styles.subtitle}>Enter your details to continue shopping</p>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            style={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            style={styles.input}
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" style={styles.loginBtn}>Login</button>
                </form>

                <div style={styles.footer}>
                    <span>New to DriftKart? </span>
                    <span style={styles.link} onClick={() => navigate('/signup')}>Create an account</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', fontFamily: 'Inter, sans-serif' },
    loginBox: { width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' },
    logo: { fontSize: '28px', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' },
    title: { fontSize: '20px', fontWeight: '700', color: '#222', marginBottom: '8px' },
    subtitle: { fontSize: '13px', color: '#888', marginBottom: '30px' },
    form: { textAlign: 'left' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '8px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    loginBtn: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#E23744', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '10px' },
    footer: { marginTop: '25px', fontSize: '13px', color: '#666' },
    link: { color: '#E23744', fontWeight: '700', cursor: 'pointer' }
};

export default Login;