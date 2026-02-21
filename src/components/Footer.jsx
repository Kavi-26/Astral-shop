// src/components/Footer.js
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import astralLogo from "../assets/astral-logo.png";

export default function Footer() {
    const socialLinks = [
        { icon: <FaFacebook />, color: '#1877f2' },
        { icon: <FaTwitter />, color: '#1da1f2' },
        { icon: <FaInstagram />, color: '#e4405f' },
        { icon: <FaLinkedin />, color: '#0a66c2' }
    ];

    return (
        <footer style={{
            marginTop: 'auto',
            background: 'linear-gradient(180deg, #0b2038 0%, #061526 100%)',
            color: '#ffffff', position: 'relative', overflow: 'hidden'
        }}>
            {/* Gradient top border */}
            <div style={{
                height: '4px',
                background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--primary))'
            }}></div>

            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '3rem', padding: '4rem 20px 3rem'
            }}>
                {/* Brand */}
                <div>
                    <img src={astralLogo} alt="ASTRAL" style={{ height: '45px', objectFit: 'contain', marginBottom: '1.2rem' }} />
                    <p style={{ opacity: 0.7, lineHeight: '1.7', fontSize: '0.9rem', maxWidth: '280px' }}>
                        Premium power electronics solutions for homes and industries since 2005.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                        {socialLinks.map((social, idx) => (
                            <a key={idx} href="#" style={{
                                width: '40px', height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(255,255,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1.1rem', textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = social.color;
                                    e.currentTarget.style.color = 'white';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = `0 4px 12px ${social.color}40`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white', letterSpacing: '0.5px' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/products', label: 'Products' },
                            { to: '/login', label: 'Login' },
                            { to: '/register', label: 'Register' }
                        ].map((link, idx) => (
                            <li key={idx} style={{ marginBottom: '0.8rem' }}>
                                <Link to={link.to} style={{
                                    color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                                    fontSize: '0.9rem', transition: 'all 0.3s ease',
                                    display: 'inline-block'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white', letterSpacing: '0.5px' }}>Contact Us</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <FaMapMarkerAlt style={{ color: 'var(--accent)', marginTop: '3px', flexShrink: 0 }} />
                            <span style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: '1.6' }}>
                                1224, Mettupalayam Road, Saibaba Kovil, Coimbatore-641 011
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <FaEnvelope style={{ color: 'var(--accent)', flexShrink: 0 }} />
                            <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>aaajarjun@gmail.com</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <FaPhone style={{ color: 'var(--accent)', flexShrink: 0 }} />
                            <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>+91 98422 54817</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                textAlign: 'center', padding: '1.5rem 20px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)'
            }}>
                © {new Date().getFullYear()} ASTRAL Power Electronics. All rights reserved.
            </div>
        </footer>
    );
}
