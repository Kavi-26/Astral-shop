import { Link } from "react-router-dom";
import { FaBolt, FaShieldAlt, FaShippingFast, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import heroEngineer from "../assets/hero-engineer.png";

export default function Home() {
    return (
        <div>
            {/* Hero Section */}
            <header style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                padding: '4rem 2rem',
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center',
                clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative blobs */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '300px', height: '300px', background: 'rgba(0,168,204,0.12)', borderRadius: '50%', filter: 'blur(50px)' }}></div>

                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{ textAlign: 'left' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            letterSpacing: '1.5px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            display: 'inline-block'
                        }}>
                            RELIABLE POWER SOLUTIONS
                        </span>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '1.5rem 0', lineHeight: '1.1', color: 'white' }}>
                            Powering Your <br />
                            <span style={{ color: 'var(--accent)' }}>Future Today</span>
                        </h1>
                        <p style={{ fontSize: '1.15rem', opacity: 0.9, marginBottom: '2.5rem', lineHeight: '1.7', maxWidth: '500px' }}>
                            Astral provides top-tier power electronics including Stabilizers, UPS, and Inverters. Engineered for industrial performance and home safety.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link to="/products" className="btn-primary" style={{
                                backgroundColor: 'white', color: 'var(--primary)',
                                background: 'white',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                textDecoration: 'none', fontSize: '1rem', padding: '14px 32px'
                            }}>
                                Explore Products <FaArrowRight size={14} />
                            </Link>
                            <Link to="/register" className="btn-secondary" style={{
                                borderColor: 'rgba(255,255,255,0.6)', color: 'white',
                                textDecoration: 'none', padding: '14px 32px', fontSize: '1rem'
                            }}>
                                Contact Sales
                            </Link>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '400px', height: '400px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '50%', zIndex: -1
                            }}></div>
                            <img
                                src={heroEngineer}
                                alt="Professional Electrical Engineer"
                                style={{
                                    width: '100%', height: 'auto', objectFit: 'contain',
                                    filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Services Section */}
            <section className="container" style={{ padding: '5rem 20px', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{
                        color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '3px',
                        fontSize: '0.8rem', fontWeight: '700', display: 'block', marginBottom: '0.8rem'
                    }}>Our Expertise</span>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Premium Power Services</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                        We don't just sell products; we provide complete power assurance. From installation to maintenance.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <ServiceCard icon={<FaBolt />} title="Voltage Suspension" desc="Protect your appliances from sudden voltage spikes and drops with our servo stabilizers." color="#f59e0b" bg="#fffbeb" />
                    <ServiceCard icon={<FaShieldAlt />} title="Industrial Safety" desc="Heavy-duty protection for industrial machinery ensuring zero downtime." color="#10b981" bg="#ecfdf5" />
                    <ServiceCard icon={<FaShippingFast />} title="Logistics & Delivery" desc="Fast, secure, and insured delivery across the nation within 3-5 business days." color="#6366f1" bg="#eef2ff" />
                </div>
            </section>

            {/* Why Choose Us */}
            <section style={{ background: 'var(--bg-section)', padding: '5rem 20px' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem', fontWeight: '700' }}>Why Us</span>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', marginTop: '0.5rem' }}>Why Choose Astral?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <BenefitRow title="24/7 Customer Support" desc="Our team is always online to help you with technical queries." />
                            <BenefitRow title="ISO 9001:2015 Certified" desc="We adhere to global quality standards for all manufacturing." />
                            <BenefitRow title="5-Year Warranty" desc="Comprehensive warranty coverage on all premium transformers." />
                        </div>
                    </div>
                    <div style={{
                        height: '400px',
                        background: 'linear-gradient(135deg, #0056b3 0%, #00a8cc 100%)',
                        borderRadius: '20px',
                        boxShadow: '0 20px 50px -10px rgba(0, 86, 179, 0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }}></div>
                        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '5rem', fontWeight: '800', lineHeight: 1 }}>10k+</div>
                            <div style={{ fontSize: '1.3rem', marginTop: '0.5rem', opacity: 0.9, fontWeight: '500' }}>Happy Customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                textAlign: 'center', padding: '6rem 20px',
                background: 'linear-gradient(180deg, #ffffff 0%, var(--bg-section) 100%)'
            }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Secure Your Power?</h2>
                    <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
                        Get a consultation today and find the perfect power backup solution for your needs.
                    </p>
                    <Link to="/products" className="btn-primary" style={{
                        textDecoration: 'none', padding: '16px 44px', fontSize: '1.05rem',
                        display: 'inline-flex', alignItems: 'center', gap: '10px'
                    }}>
                        View Catalog <FaArrowRight size={14} />
                    </Link>
                </div>
            </section>
        </div>
    );
}

function ServiceCard({ icon, title, desc, color, bg }) {
    return (
        <div className="service-card" style={{ cursor: 'default' }}>
            <div style={{
                width: '65px', height: '65px', background: bg,
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color, fontSize: '1.5rem', marginBottom: '1.5rem',
                boxShadow: `0 4px 12px ${color}20`
            }}>
                {icon}
            </div>
            <h3 style={{ marginBottom: '0.8rem', fontSize: '1.25rem', color: 'var(--text-main)' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>{desc}</p>
        </div>
    );
}

function BenefitRow({ title, desc }) {
    return (
        <div style={{
            display: 'flex', gap: '1rem', padding: '1rem',
            borderRadius: '12px', transition: 'background 0.2s',
        }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
            <div style={{
                width: '36px', height: '36px', background: '#e6f0fa',
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', fontSize: '1rem', flexShrink: 0, marginTop: '2px'
            }}>
                <FaCheckCircle />
            </div>
            <div>
                <h4 style={{ marginBottom: '0.2rem', fontSize: '1.05rem', color: 'var(--text-main)' }}>{title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{desc}</p>
            </div>
        </div>
    );
}
