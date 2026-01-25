// src/pages/Home.js
import { Link } from "react-router-dom";
import { FaBolt, FaLayerGroup, FaServer, FaMicrochip } from "react-icons/fa";

export default function Home() {
    const categories = [
        { title: "Stabilizers", icon: <FaBolt size={40} />, desc: "Protect your appliances" },
        { title: "UPS Systems", icon: <FaServer size={40} />, desc: "Uninterrupted power" },
        { title: "Inverters", icon: <FaLayerGroup size={40} />, desc: "Efficient power backup" },
        { title: "Transformers", icon: <FaMicrochip size={40} />, desc: "Voltage regulation" }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--bg-dark), #1e1b4b)',
                color: 'white',
                padding: '100px 0',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 className="animate-fade-in" style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem' }}>
                        Power Your World with <span className="text-gradient">ASTRAL</span>
                    </h1>
                    <p className="animate-fade-in" style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Premium Power Electronics Shopping System. Reliable, Efficient, and Smart Solutions for your Home and Industry.
                    </p>
                    <Link to="/products" className="btn-primary animate-fade-in" style={{ textDecoration: 'none', padding: '15px 30px', fontSize: '1.1rem' }}>
                        Shop Now
                    </Link>
                </div>

                {/* Abstract Background Element */}
                <div style={{
                    position: 'absolute', top: '-50%', right: '-10%',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                    opacity: 0.2, borderRadius: '50%'
                }}></div>
            </section>

            {/* Categories Section */}
            <section className="container" style={{ padding: '4rem 20px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Our Categories</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {categories.map((cat, index) => (
                        <div key={index} className="glass-card" style={{ padding: '2rem', textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{cat.icon}</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{cat.title}</h3>
                            <p style={{ opacity: 0.7 }}>{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Section */}
            <section style={{ background: 'var(--card-light)', padding: '4rem 0' }}>
                <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '2rem' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Why Choose Astral?</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ Real-time Stock Availability</li>
                            <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ Secure Payment Integration</li>
                            <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ Fast Delivery & Tracking</li>
                            <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ 24/7 Customer Support</li>
                        </ul>
                    </div>
                    <div className="glass" style={{ flex: 1, minWidth: '300px', height: '300px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h3 style={{ opacity: 0.5 }}>Featured Image / Illustration</h3>
                    </div>
                </div>
            </section>
        </div>
    );
}
