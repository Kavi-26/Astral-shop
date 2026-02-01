import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaUser, FaPowerOff, FaBars, FaTimes, FaBoxOpen, FaUserCircle, FaShoppingCart, FaChevronDown, FaHome, FaStore } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import astralLogo from "../assets/astral-logo.png";

export default function Navbar() {
    const { currentUser, userRole, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef(null);

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <>
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .nav-item {
                    position: relative;
                    transition: all 0.3s ease;
                }

                .nav-item::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    width: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #0056b3, #003d82);
                    border-radius: 2px;
                    transition: width 0.3s ease;
                }

                .nav-item:hover::after {
                    width: 100%;
                }

                .nav-item:hover {
                    color: #0056b3 !important;
                }

                .dropdown-menu {
                    animation: slideDown 0.3s ease-out;
                }

                .dropdown-item {
                    transition: all 0.2s ease;
                }

                .dropdown-item:hover {
                    background: linear-gradient(90deg, #f8fafc, #e0f2fe) !important;
                    padding-left: 28px !important;
                    color: #0056b3 !important;
                }
            `}</style>

            <nav style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                padding: scrolled ? '0.8rem 0' : '1.2rem 0',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)',
                borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid #f0f0f0',
                transition: 'all 0.3s ease'
            }}>
                <div className="container flex-between">
                    {/* Logo */}
                    <Link to="/" className="logo" style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'transform 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img src={astralLogo} alt="ASTRAL" style={{
                            height: scrolled ? '45px' : '50px',
                            objectFit: 'contain',
                            transition: 'height 0.3s ease'
                        }} />
                    </Link>

                    {/* Mobile Toggle */}
                    <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} style={{
                        display: 'none',
                        cursor: 'pointer',
                        color: '#0056b3',
                        fontSize: '1.5rem',
                        padding: '8px',
                        borderRadius: '8px',
                        transition: 'background 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </div>

                    {/* Links */}
                    <div className={`nav-links flex-center ${menuOpen ? 'active' : ''}`} style={{ gap: '2.5rem' }}>

                        {/* Common Links */}
                        <Link to="/" className="nav-item" style={{
                            textDecoration: 'none',
                            color: '#1e293b',
                            fontWeight: '600',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <FaHome size={16} />
                            Home
                        </Link>

                        {/* User Only Links */}
                        {userRole !== 'admin' && (
                            <Link to="/products" className="nav-item" style={{
                                textDecoration: 'none',
                                color: '#1e293b',
                                fontWeight: '600',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <FaStore size={16} />
                                Shop
                            </Link>
                        )}

                        {/* Admin Link */}
                        {userRole === 'admin' && (
                            <Link to="/admin/dashboard" className="nav-item" style={{
                                textDecoration: 'none',
                                color: '#0056b3',
                                fontWeight: '700',
                                fontSize: '1rem',
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                                borderRadius: '10px',
                                transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)';
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 86, 179, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)';
                                    e.currentTarget.style.color = '#0056b3';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Admin Panel
                            </Link>
                        )}

                        {currentUser ? (
                            <div className="flex-center" style={{ gap: '1.5rem' }}>
                                {/* Cart Link (User Only) */}
                                {userRole !== 'admin' && (
                                    <Link to="/cart" style={{
                                        textDecoration: 'none',
                                        color: '#1e293b',
                                        fontWeight: '600',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '10px 18px',
                                        borderRadius: '12px',
                                        background: '#f8fafc',
                                        border: '2px solid #e2e8f0',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#0056b3';
                                            e.currentTarget.style.background = '#e0f2fe';
                                            e.currentTarget.style.color = '#0056b3';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.background = '#f8fafc';
                                            e.currentTarget.style.color = '#1e293b';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <FaShoppingCart size={18} />
                                        <span>Cart</span>
                                        {cartCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-6px',
                                                right: '-6px',
                                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                fontSize: '0.7rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '700',
                                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                                                border: '2px solid white'
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
                                                background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
                                                border: '2px solid #e2e8f0',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                padding: '10px 18px',
                                                borderRadius: '12px',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#0056b3';
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <FaUserCircle size={22} color="#0056b3" />
                                            <span>Account</span>
                                            <FaChevronDown size={12} style={{
                                                transition: 'transform 0.3s',
                                                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)'
                                            }} />
                                        </button>

                                        {dropdownOpen && (
                                            <div className="dropdown-menu" style={{
                                                position: 'absolute',
                                                top: '120%',
                                                right: 0,
                                                background: 'white',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                                borderRadius: '16px',
                                                border: '1px solid #e2e8f0',
                                                width: '240px',
                                                padding: '0.75rem 0',
                                                zIndex: 1001,
                                                overflow: 'hidden'
                                            }}>
                                                <Link to="/profile" onClick={() => setDropdownOpen(false)} className="dropdown-item" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '14px 20px',
                                                    textDecoration: 'none',
                                                    color: '#1e293b',
                                                    fontSize: '0.95rem',
                                                    fontWeight: '500'
                                                }}>
                                                    <FaUser size={16} color="#64748b" /> My Profile
                                                </Link>
                                                <Link to="/orders" onClick={() => setDropdownOpen(false)} className="dropdown-item" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '14px 20px',
                                                    textDecoration: 'none',
                                                    color: '#1e293b',
                                                    fontSize: '0.95rem',
                                                    fontWeight: '500'
                                                }}>
                                                    <FaBoxOpen size={16} color="#64748b" /> My Orders
                                                </Link>
                                                <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 0' }}></div>
                                                <button onClick={handleLogout} className="dropdown-item" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '14px 20px',
                                                    width: '100%',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#ef4444',
                                                    fontSize: '0.95rem',
                                                    textAlign: 'left',
                                                    fontWeight: '600'
                                                }}>
                                                    <FaPowerOff size={16} /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Admin standalone logout */}
                                {userRole === 'admin' && (
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '0.95rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                            color: '#dc2626',
                                            border: '2px solid #fecaca',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '700',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                                            e.currentTarget.style.color = 'white';
                                            e.currentTarget.style.borderColor = '#dc2626';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
                                            e.currentTarget.style.color = '#dc2626';
                                            e.currentTarget.style.borderColor = '#fecaca';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <FaPowerOff /> Logout
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex-center" style={{ gap: '1rem' }}>
                                <Link
                                    to="/login"
                                    style={{
                                        textDecoration: 'none',
                                        padding: '10px 24px',
                                        borderRadius: '12px',
                                        border: '2px solid #0056b3',
                                        color: '#0056b3',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.3s ease',
                                        background: 'white',
                                        letterSpacing: '0.3px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#e0f2fe';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    LOGIN
                                </Link>
                                <Link
                                    to="/register"
                                    style={{
                                        textDecoration: 'none',
                                        padding: '10px 24px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(0, 86, 179, 0.3)',
                                        border: 'none',
                                        letterSpacing: '0.3px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 86, 179, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 86, 179, 0.3)';
                                    }}
                                >
                                    REGISTER
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
