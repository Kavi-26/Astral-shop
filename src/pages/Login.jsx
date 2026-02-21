// src/pages/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaShoppingBag, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate("/");
        } catch {
            setError("Failed to log in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                .login-container {
                    animation: slideUp 0.6s ease-out;
                }

                .floating-shapes {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 0;
                }

                .shape {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    animation: float 20s infinite ease-in-out;
                }

                .shape:nth-child(1) {
                    width: 80px;
                    height: 80px;
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .shape:nth-child(2) {
                    width: 120px;
                    height: 120px;
                    top: 70%;
                    left: 80%;
                    animation-delay: 2s;
                }

                .shape:nth-child(3) {
                    width: 60px;
                    height: 60px;
                    top: 40%;
                    left: 5%;
                    animation-delay: 4s;
                }

                .shape:nth-child(4) {
                    width: 100px;
                    height: 100px;
                    top: 20%;
                    left: 85%;
                    animation-delay: 1s;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative'
            }}>
                {/* Floating Background Shapes */}
                <div className="floating-shapes">
                    <div className="shape"></div>
                    <div className="shape"></div>
                    <div className="shape"></div>
                    <div className="shape"></div>
                </div>

                <div className="login-container" style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    maxWidth: '480px',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Header Section */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)',
                        padding: '3.5rem 2rem',
                        textAlign: 'center',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative circles */}
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)'
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            bottom: '-30px',
                            left: '-30px',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            filter: 'blur(40px)'
                        }}></div>

                        <div style={{
                            width: '90px',
                            height: '90px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            backdropFilter: 'blur(10px)',
                            border: '3px solid rgba(255, 255, 255, 0.3)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <FaShoppingBag style={{ fontSize: '2.5rem' }} />
                        </div>
                        <h1 style={{
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.5px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            Welcome Back!
                        </h1>
                        <p style={{
                            fontSize: '1.05rem',
                            opacity: 0.95,
                            fontWeight: '400',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            Sign in to continue your shopping journey
                        </p>
                    </div>

                    {/* Form Section */}
                    <div style={{ padding: '2.5rem' }}>
                        {error && (
                            <div style={{
                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                color: '#dc2626',
                                padding: '14px 18px',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                border: '1px solid #fecaca',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                boxShadow: '0 4px 6px rgba(220, 38, 38, 0.1)'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.75rem'
                        }}>
                            {/* Email Input */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.6rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    letterSpacing: '0.3px'
                                }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <FaEnvelope style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        left: '18px',
                                        color: '#94a3b8',
                                        fontSize: '1.1rem'
                                    }} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{
                                            width: '83%',
                                            padding: '15px 18px 15px 52px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                            background: '#f8fafc',
                                            fontWeight: '500'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#0056b3';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(0, 86, 179, 0.1)';
                                            e.target.style.background = 'white';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e2e8f0';
                                            e.target.style.boxShadow = 'none';
                                            e.target.style.background = '#f8fafc';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.6rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    letterSpacing: '0.3px'
                                }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <FaLock style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        left: '18px',
                                        color: '#94a3b8',
                                        fontSize: '1.1rem'
                                    }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{
                                            width: '75%',
                                            padding: '15px 52px 15px 52px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                            background: '#f8fafc',
                                            fontWeight: '500'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#0056b3';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(0, 86, 179, 0.1)';
                                            e.target.style.background = 'white';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#e2e8f0';
                                            e.target.style.boxShadow = 'none';
                                            e.target.style.background = '#f8fafc';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            right: '18px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#64748b',
                                            fontSize: '1.1rem',
                                            padding: '4px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#0056b3'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: loading ? 'none' : '0 8px 16px rgba(0, 86, 179, 0.3)',
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 86, 179, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 86, 179, 0.3)';
                                    }
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '3px solid rgba(255,255,255,0.3)',
                                            borderTop: '3px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div style={{
                            marginTop: '2.5rem',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#64748b',
                                marginBottom: '1.5rem',
                                fontWeight: '500'
                            }}>
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    style={{
                                        color: '#0056b3',
                                        textDecoration: 'none',
                                        fontWeight: '700',
                                        transition: 'all 0.3s ease',
                                        borderBottom: '2px solid transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderBottomColor = '#0056b3';
                                        e.currentTarget.style.color = '#003d82';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderBottomColor = 'transparent';
                                        e.currentTarget.style.color = '#0056b3';
                                    }}
                                >
                                    Create Account
                                </Link>
                            </p>

                            <div style={{
                                paddingTop: '1.5rem',
                                borderTop: '1px solid #e2e8f0'
                            }}>
                                <Link
                                    to="/admin/login"
                                    style={{
                                        color: '#64748b',
                                        fontSize: '0.85rem',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '600',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#0056b3';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#64748b';
                                    }}
                                >
                                    🔐 Admin Access
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
