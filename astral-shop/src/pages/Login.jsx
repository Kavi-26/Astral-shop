// src/pages/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            await login(email, password);
            navigate("/");
        } catch {
            setError("Failed to log in. Check your credentials.");
        }
    }

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <FaEnvelope style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10px', color: '#9ca3af' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaLock style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10px', color: '#9ca3af' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Login</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <p>Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link></p>
                    <div style={{ margin: '1rem 0', opacity: 0.5 }}>OR</div>
                    <button className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaGoogle /> Login with Google
                    </button>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Link to="/admin/login" style={{ color: 'var(--text-light)', opacity: 0.6, fontSize: '0.8rem', textDecoration: 'none' }}>Admin Access</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
