// src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaUser, FaPowerOff, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { currentUser, userRole, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <nav className="glass sticky-top" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
            <div className="container flex-between">
                {/* Logo */}
                <Link to="/" className="logo" style={{ textDecoration: 'none', fontSize: '1.8rem', fontWeight: '800', letterSpacing: '2px' }}>
                    <span className="text-gradient">ASTRAL</span>
                </Link>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none' }}>
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>

                {/* Links */}
                <div className={`nav-links flex-center ${menuOpen ? 'active' : ''}`} style={{ gap: '2rem' }}>
                    <Link to="/" className="nav-item" style={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}>Home</Link>
                    <Link to="/products" className="nav-item" style={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}>Shop</Link>
                    <Link to="/compare" className="nav-item" style={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}>Compare</Link>

                    <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.2rem' }}>
                        {darkMode ? <FaSun /> : <FaMoon />}
                    </button>

                    {userRole === 'admin' && (
                        <Link to="/admin/dashboard" className="nav-item" style={{ textDecoration: 'none', color: 'var(--secondary)', fontWeight: '600' }}>Admin Panel</Link>
                    )}

                    {currentUser ? (
                        <>
                            <Link to="/orders" className="nav-item" style={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}>My Orders</Link>
                            <div className="flex-center" style={{ gap: '1rem' }}>
                                <Link to="/cart" style={{ position: 'relative', color: 'inherit' }}>
                                    <FaShoppingCart size={20} />
                                    {cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-10px', right: '-10px',
                                            background: 'var(--secondary)', color: 'white', borderRadius: '50%',
                                            width: '18px', height: '18px', fontSize: '12px', display: 'flex',
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
