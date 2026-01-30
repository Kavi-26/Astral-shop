import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaUser, FaPowerOff, FaBars, FaTimes, FaBoxOpen, FaUserCircle, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import astralLogo from "../assets/astral-logo.png";

export default function Navbar() {
    const { currentUser, userRole, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '1rem 0',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #f0f0f0'
        }}>
            <div className="container flex-between">
                {/* Logo */}
                <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <img src={astralLogo} alt="ASTRAL" style={{ height: '50px', objectFit: 'contain' }} />
                </Link>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>

                {/* Links */}
                {/* Links */}
                <div className={`nav-links flex-center ${menuOpen ? 'active' : ''}`} style={{ gap: '2rem' }}>

                    {/* Common Links */}
                    <Link to="/" className="nav-item" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '1rem' }}>Home</Link>

                    {/* User Only Links */}
                    {userRole !== 'admin' && (
                        <Link to="/products" className="nav-item" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600', fontSize: '1rem' }}>Shop</Link>
                    )}

                    {/* Admin Link */}
                    {userRole === 'admin' && (
                        <Link to="/admin/dashboard" className="nav-item" style={{ textDecoration: 'none', color: 'var(--primary)', fontWeight: '700' }}>Admin Panel</Link>
                    )}

                    {currentUser ? (
                        <div className="flex-center" style={{ gap: '1.5rem' }}>
                            {/* Cart Link (User Only) */}
                            {userRole !== 'admin' && (
                                <Link to="/cart" className="nav-item" style={{
                                    textDecoration: 'none',
                                    color: 'var(--text-main)',
                                    fontWeight: '600',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <FaShoppingCart size={18} />
                                    <span>Cart</span>
                                    {cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-8px', right: '-12px',
                                            background: 'var(--primary)', color: 'white', borderRadius: '50%',
                                            width: '20px', height: '20px', fontSize: '0.75rem', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* User Dropdown */}
                            {userRole !== 'admin' && (
                                <div style={{ position: 'relative' }} ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: 'var(--text-main)',
                                            fontWeight: '600',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <FaUserCircle size={22} color="var(--primary)" />
                                        <span>Account</span>
                                        <FaChevronDown size={12} style={{ transition: 'transform 0.3s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                                    </button>

                                    {/* Dropdown content... (omitted for brevity in replacement, but logically here) */}
                                    {dropdownOpen && (
                                        <div style={{
                                            position: 'absolute', top: '120%', right: 0, background: 'white',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid #f0f0f0',
                                            width: '200px', padding: '0.5rem 0', animation: 'fadeIn 0.2s ease-out', zIndex: 1001
                                        }}>
                                            <Link to="/profile" onClick={() => setDropdownOpen(false)} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.95rem'
                                            }}>
                                                <FaUser size={14} color="var(--text-muted)" /> My Profile
                                            </Link>
                                            <Link to="/orders" onClick={() => setDropdownOpen(false)} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.95rem'
                                            }}>
                                                <FaBoxOpen size={14} color="var(--text-muted)" /> My Orders
                                            </Link>
                                            <div style={{ height: '1px', background: '#f0f0f0', margin: '0.5rem 0' }}></div>
                                            <button onClick={handleLogout} style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#e63946', fontSize: '0.95rem'
                                            }}>
                                                <FaPowerOff size={14} /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Admin standalone logout */}
                            {userRole === 'admin' && (
                                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '5px 15px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FaPowerOff /> Logout
                                </button>
                            )}
                        </div>
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
