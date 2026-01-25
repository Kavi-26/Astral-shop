// src/pages/Register.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: ""
    });
    const [error, setError] = useState("");
    const { signup } = useAuth();
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            await signup(formData.email, formData.password, {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            });
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create an account.");
        }
    }

    const inputStyle = { width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' };
    const iconStyle = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10px', color: '#9ca3af' };

    return (
        <div className="container flex-center" style={{ minHeight: '90vh', padding: '2rem 0' }}>
            <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>

                {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>

                    <div style={{ position: 'relative' }}>
                        <FaUser style={iconStyle} />
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaEnvelope style={iconStyle} />
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaLock style={iconStyle} />
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaLock style={iconStyle} />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaPhone style={iconStyle} />
                        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaMapMarkerAlt style={iconStyle} />
                        <textarea name="address" placeholder="Shipping Address" value={formData.address} onChange={handleChange} required style={{ ...inputStyle, paddingLeft: '35px', minHeight: '80px', fontFamily: 'inherit' }} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Sign Up</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link></p>
                </div>
            </div>
        </div>
    );
}
