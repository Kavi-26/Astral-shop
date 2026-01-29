// src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaUser, FaPowerOff, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import astralLogo from "../assets/astral-logo.png";

export default function Navbar() {
    const { currentUser, userRole, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '1rem 0',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #f0f0f0'
        }}>
            <div className="container flex-between">
                {/* Logo */}
                <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <img src={astralLogo} alt="ASTRAL" style={{ height: '60px', objectFit: 'contain' }} />
                </Link>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none' }}>
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>

                {/* Links */}
                <div className={`nav-links flex-center ${menuOpen ? 'active' : ''}`} style={{ gap: '2rem' }}>
                    <Link to="/" className="nav-item" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>Home</Link>
                    <Link to="/products" className="nav-item" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>Shop</Link>


                    {userRole === 'admin' && (
                        <Link to="/admin/dashboard" className="nav-item" style={{ textDecoration: 'none', color: 'var(--secondary)', fontWeight: '600' }}>Admin Panel</Link>
                    )}

                    {currentUser ? (
                        <>
                            {userRole !== 'admin' && (
                                <Link to="/profile" className="nav-item" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>My Profile</Link>
                            )}
                            <div className="flex-center" style={{ gap: '1rem' }}>
                                <Link to="/cart" className="nav-item" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500', position: 'relative' }}>
                                    Cart
                                    {cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-8px', right: '-15px',
                                            background: 'var(--secondary)', color: 'white', borderRadius: '50%',
                                            width: '18px', height: '18px', fontSize: '10px', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <FaPowerOff /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-center" style={{ gap: '1rem' }}>
                            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
