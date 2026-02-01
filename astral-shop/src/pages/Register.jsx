// src/pages/Register.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaEye, FaEyeSlash, FaCheckCircle, FaArrowRight } from "react-icons/fa";

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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

        if (formData.password.length < 6) {
            return setError("Password must be at least 6 characters long");
        }

        try {
            setError("");
            setLoading(true);
            await signup(formData.email, formData.password, {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            });
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create an account.");
        } finally {
            setLoading(false);
        }
    }

    const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

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

                .register-container {
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

                @keyframes spin {
                    to { transform: rotate(360deg); }
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

                <div className="register-container" style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    maxWidth: '580px',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Header Section */}
                    <div style={{
                        background: 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)',
                        padding: '3rem 2rem',
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
                            width: '80px',
                            height: '80px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.2rem',
                            backdropFilter: 'blur(10px)',
                            border: '3px solid rgba(255, 255, 255, 0.3)',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <FaShoppingBag style={{ fontSize: '2rem' }} />
                        </div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.5px',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            Create Account
                        </h1>
                        <p style={{
                            fontSize: '1rem',
                            opacity: 0.95,
                            fontWeight: '400',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            Join us and start shopping today
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
                            display: 'grid',
                            gap: '1.5rem'
                        }}>
                            {/* Full Name */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    letterSpacing: '0.3px'
                                }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <FaUser style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        left: '16px',
                                        color: '#94a3b8',
                                        fontSize: '1rem'
                                    }} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '13px 16px 13px 46px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '0.95rem',
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

                            {/* Email */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem',
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
                                        left: '16px',
                                        color: '#94a3b8',
                                        fontSize: '1rem'
                                    }} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '13px 16px 13px 46px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '0.95rem',
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

                            {/* Password */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem',
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
                                        left: '16px',
                                        color: '#94a3b8',
                                        fontSize: '1rem'
                                    }} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '13px 46px 13px 46px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '0.95rem',
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
                                            right: '16px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#64748b',
                                            fontSize: '1rem',
                                            padding: '4px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#0056b3'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div style={{
                                        marginTop: '0.6rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem'
                                    }}>
                                        <div style={{
                                            flex: 1,
                                            height: '5px',
                                            background: '#e2e8f0',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '66%' : '33%',
                                                background: passwordStrength === 'strong' ? 'linear-gradient(90deg, #10b981, #059669)' : passwordStrength === 'medium' ? 'linear-gradient(90deg, #f59e0b, #d97706)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                                                transition: 'all 0.3s ease',
                                                borderRadius: '3px'
                                            }}></div>
                                        </div>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: passwordStrength === 'strong' ? '#10b981' : passwordStrength === 'medium' ? '#f59e0b' : '#ef4444',
                                            minWidth: '60px'
                                        }}>
                                            {passwordStrength === 'strong' ? '✓ Strong' : passwordStrength === 'medium' ? 'Medium' : 'Weak'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    letterSpacing: '0.3px'
                                }}>
                                    Confirm Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <FaLock style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        left: '16px',
                                        color: '#94a3b8',
                                        fontSize: '1rem'
                                    }} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '13px 46px 13px 46px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '0.95rem',
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
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            right: '16px',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#64748b',
                                            fontSize: '1rem',
                                            padding: '4px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = '#0056b3'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            right: '48px',
                                            color: '#10b981',
                                            fontSize: '1.1rem'
                                        }}>
                                            <FaCheckCircle />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    letterSpacing: '0.3px'
                                }}>
                                    Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <FaPhone style={{
                                        position: 'absolute',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        left: '16px',
                                        color: '#94a3b8',
                                        fontSize: '1rem'
                                    }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '13px 16px 13px 46px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '0.95rem',
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

                            {/* Address */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    letterSpacing: '0.3px'
                                }}>
                                    Shipping Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <FaMapMarkerAlt style={{
                                        position: 'absolute',
                                        top: '18px',
                                        left: '16px',
                                        color: '#94a3b8',
                                        fontSize: '1rem'
                                    }} />
                                    <textarea
                                        name="address"
                                        placeholder="Enter your complete address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        style={{
                                            width: '100%',
                                            padding: '13px 16px 13px 46px',
                                            borderRadius: '12px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: loading ? '#cbd5e1' : 'linear-gradient(135deg, #0056b3 0%, #003d82 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1.05rem',
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
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <FaArrowRight />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div style={{
                            marginTop: '2rem',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#64748b',
                                fontWeight: '500'
                            }}>
                                Already have an account?{' '}
                                <Link
                                    to="/login"
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
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
