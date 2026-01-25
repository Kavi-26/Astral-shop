// src/admin/AdminLogin.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserShield, FaLock } from "react-icons/fa";

export default function AdminLogin() {
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
            // In a real app, we check if role is admin here or loop back to main route which handles redirect
            // For now, assume login success -> redirect to dashboard (ProtectedRoute will handle ejection if not admin)
            navigate("/admin/dashboard");
        } catch {
            setError("Failed to log in as Admin.");
        }
    }

    return (
        <div className="container flex-center" style={{ minHeight: '80vh' }}>
            <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '400px', borderTop: '4px solid var(--secondary)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <FaUserShield size={40} color="var(--secondary)" />
                    <h2 style={{ marginTop: '1rem' }}>Admin Portal</h2>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <FaUserShield style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10px', color: '#9ca3af' }} />
                        <input
                            type="email"
                            placeholder="Admin Email"
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

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', background: 'var(--secondary)' }}>Login to Dashboard</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <Link to="/" style={{ color: 'var(--text-light)', opacity: 0.6, textDecoration: 'none' }}>← Back to Shop</Link>
                </div>
            </div>
        </div>
    );
}
