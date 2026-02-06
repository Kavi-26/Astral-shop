// src/components/Footer.js
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import astralLogo from "../assets/astral-logo.png";

export default function Footer() {
    return (
        <footer style={{ marginTop: 'auto', padding: '4rem 0', background: '#0b2038', color: '#ffffff' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                {/* Brand */}
                <div>
                    <img src={astralLogo} alt="ASTRAL" style={{ height: '50px', objectFit: 'contain', marginBottom: '1rem' }} />
                    <p style={{ opacity: 0.8 }}>
                        1224, Mettupalayam Road, Saibaba Kovil, Coimbatore-641 011
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Quick Links</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Products</a></li>
                        <li style={{ marginBottom: '0.5rem' }}><a href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Login</a></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Contact Us</h3>
                    <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Email: aaajarjun@gmail.com  </p>
                    <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Phone: +91 98422 54817</p>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <FaFacebook size={24} cursor="pointer" />
                        <FaTwitter size={24} cursor="pointer" />
                        <FaInstagram size={24} cursor="pointer" />
                        <FaLinkedin size={24} cursor="pointer" />
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.6, fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} ASTRAL Power Electronics. All rights reserved.
            </div>
        </footer>
    );
}
