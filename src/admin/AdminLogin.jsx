// src/admin/AdminLogin.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserShield, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaStore } from "react-icons/fa";

export default function AdminLogin() {
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
            navigate("/admin/dashboard");
        } catch {
            setError("Failed to log in as Admin. Please check your credentials.");
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

                .admin-login-container {
                    animation: slideUp 0.6s ease-out;
                }

                .floating-shapes-admin {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 0;
                }

                .shape-admin {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.08);
                    animation: floatAdmin 20s infinite ease-in-out;
                }

                .shape-admin:nth-child(1) {
                    width: 80px;
                    height: 80px;
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .shape-admin:nth-child(2) {
                    width: 120px;
                    height: 120px;
                    top: 70%;
                    left: 80%;
                    animation-delay: 2s;
                }

                .shape-admin:nth-child(3) {
                    width: 60px;
                    height: 60px;
                    top: 40%;
                    left: 5%;
                    animation-delay: 4s;
                }

                .shape-admin:nth-child(4) {
                    width: 100px;
                    height: 100px;
                    top: 20%;
                    left: 85%;
                    animation-delay: 1s;
                }

                @keyframes floatAdmin {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2027 50%, #203a43 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative'
            }}>
                {/* Floating Background Shapes */}
                <div className="floating-shapes-admin">
                    <div className="shape-admin"></div>
                    <div className="shape-admin"></div>
                    <div className="shape-admin"></div>
                    <div className="shape-admin"></div>
                </div>

                <div className="admin-login-container" style={{
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
                        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
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
                            background: 'rgba(255, 255, 255, 0.08)',
                            filter: 'blur(40px)'
                        }}></div>
                        <div style={{
                            position: 'absolute',
                            bottom: '-30px',
                            left: '-30px',
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            filter: 'blur(40px)'
                        }}></div>

                        <div style={{
                            width: '90px',
                            height: '90px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            backdropFilter: 'blur(10px)',
                            border: '3px solid rgba(255, 255, 255, 0.25)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <FaUserShield style={{ fontSize: '2.5rem' }} />
                        </div>
                        <h1 style={{
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.5px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            Admin Portal
                        </h1>
                        <p style={{
                            fontSize: '1.05rem',
                            opacity: 0.9,
                            fontWeight: '400',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            Secure access to the management dashboard
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
                                    Admin Email
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <FaUserShield style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        left: '18px',
                                        color: '#94a3b8',
                                        fontSize: '1.1rem'
                                    }} />
                                    <input
                                        type="email"
                                        placeholder="Enter admin email"
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
                                            e.target.style.borderColor = '#2c5364';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(44, 83, 100, 0.1)';
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
                                            e.target.style.borderColor = '#2c5364';
                                            e.target.style.boxShadow = '0 0 0 4px rgba(44, 83, 100, 0.1)';
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
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#2c5364'}
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
                                    background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #0f2027 0%, #2c5364 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: loading ? 'none' : '0 8px 16px rgba(15, 32, 39, 0.3)',
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
                                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(15, 32, 39, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(15, 32, 39, 0.3)';
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
                                        Login to Dashboard
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
                            <div style={{
                                paddingTop: '1.5rem',
                                borderTop: '1px solid #e2e8f0'
                            }}>
                                <Link
                                    to="/"
                                    style={{
                                        color: '#64748b',
                                        fontSize: '0.9rem',
                                        textDecoration: 'none',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '600',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#2c5364';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#64748b';
                                    }}
                                >
                                    <FaStore /> Back to Shop
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
