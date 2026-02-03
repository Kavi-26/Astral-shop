import { Link } from "react-router-dom";
import { FaBolt, FaShieldAlt, FaShippingFast, FaCheckCircle, FaHeadset } from "react-icons/fa";
import heroEngineer from "../assets/hero-engineer.png";

export default function Home() {
    return (
        <div>
            {/* Corporate Hero Section */}
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
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{ textAlign: 'left' }}>
                        <span style={{
                            background: 'rgba(255,255,255,0.2)',
                            padding: '5px 15px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            letterSpacing: '1px'
                        }}>
                            RELIABLE POWER SOLUTIONS
                        </span>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '1.5rem 0', lineHeight: '1.1', color: 'white' }}>
                            Powering Your <br />
                            <span style={{ color: 'var(--accent)' }}>Future Today</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem', lineHeight: '1.6', maxWidth: '500px' }}>
                            Astral provides top-tier power electronics including Stabilizers, UPS, and Inverters. Engineered for industrial performance and home safety.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/products" className="btn-primary" style={{ backgroundColor: 'white', color: 'var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                                Explore Products
                            </Link>
                            <Link to="/register" className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
                                Contact Sales
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image Section */}
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '450px',
                        }}>
                            {/* Decorative Circle behind image */}
                            <div style={{
                                position: 'absolute',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '400px', height: '400px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '50%',
                                zIndex: -1
                            }}></div>

                            <img
                                src={heroEngineer}
                                alt="Professional Electrical Engineer"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Services Section */}
            <section className="container" style={{ padding: '5rem 20px', marginTop: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h4 style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Our Expertise</h4>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Premium Power Services</h2>
                    <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
                        We don't just sell products; we provide complete power assurance. From installation to maintenance.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div><ServiceCard icon={<FaBolt />} title="Voltage Suspension" desc="Protect your appliances from sudden voltage spikes and drops with our servo stabilizers." /></div>
                    <div><ServiceCard icon={<FaShieldAlt />} title="Industrial Safety" desc="Heavy-duty protection for industrial machinery ensuring zero downtime." /></div>
                    <div><ServiceCard icon={<FaShippingFast />} title="Logistics & Delivery" desc="Fast, secure, and insured delivery across the nation within 3-5 business days." /></div>
                </div>
            </section>

            {/* Why Choose Us - Split Section */}
            <section style={{ background: 'var(--bg-section)', padding: '5rem 20px' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Choose Astral?</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <BenefitRow title="24/7 Customer Support" desc="Our team is always online to help you with technical queries." />
                            <BenefitRow title="ISO 9001:2015 Certified" desc="We adhere to global quality standards for all manufacturing." />
                            <BenefitRow title="5-Year Warranty" desc="Comprehensive warranty coverage on all premium transformers." />
                        </div>
                    </div>
                    <div style={{
                        height: '400px',
                        background: 'linear-gradient(to right, #0056b3, #00a8cc)',
                        borderRadius: '8px',
                        boxShadow: '0 20px 40px -10px rgba(0, 86, 179, 0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '5rem', fontWeight: 'bold' }}>10k+</div>
                            <div style={{ fontSize: '1.5rem' }}>Happy Customers</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ textAlign: 'center', padding: '6rem 20px' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Secure Your Power?</h2>
                    <p style={{ marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Get a consultation today and find the perfect power backup solution for your needs.
                    </p>
                    <Link to="/products" className="btn-primary" style={{ textDecoration: 'none', padding: '15px 40px', fontSize: '1rem' }}>
                        View Catalog
                    </Link>
                </div>
            </section>
        </div>
    );
}

function ServiceCard({ icon, title, desc }) {
    return (
        <div className="service-card">
            <div style={{
                width: '60px', height: '60px', background: 'var(--secondary)',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', fontSize: '1.5rem', marginBottom: '1.5rem'
            }}>
                {icon}
            </div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function BenefitRow({ title, desc }) {
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: 'var(--accent)', fontSize: '1.2rem', marginTop: '2px' }}>
                <FaCheckCircle />
            </div>
            <div>
                <h4 style={{ marginBottom: '0.2rem', fontSize: '1.1rem' }}>{title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>{desc}</p>
            </div>
        </div>
    );
}
