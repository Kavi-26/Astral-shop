import { Link, useLocation } from "react-router-dom";
import { FaChartLine, FaBoxOpen, FaShoppingCart, FaUsers, FaFileAlt } from "react-icons/fa";

const navLinks = [
    { to: '/admin/dashboard', icon: <FaChartLine />, label: 'Dashboard' },
    { to: '/admin/products', icon: <FaBoxOpen />, label: 'Products' },
    { to: '/admin/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { to: '/admin/customers', icon: <FaUsers />, label: 'Customers' },
    { to: '/admin/reports', icon: <FaFileAlt />, label: 'Reports' }
];

export default function AdminSidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div style={{
            width: '260px',
            background: 'white',
            borderRight: '1px solid #f1f5f9',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)'
        }}>
            <div style={{
                fontSize: '0.75rem', textTransform: 'uppercase',
                color: 'var(--text-muted)', fontWeight: '700',
                marginBottom: '1rem', letterSpacing: '1.5px', paddingLeft: '12px'
            }}>
                Admin Panel
            </div>

            {navLinks.map(link => (
                <Link
                    key={link.to}
                    to={link.to}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '11px 14px', borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: isActive(link.to) ? '700' : '500',
                        fontSize: '0.92rem',
                        color: isActive(link.to) ? 'var(--primary)' : 'var(--text-muted)',
                        background: isActive(link.to) ? 'linear-gradient(135deg, var(--secondary) 0%, #dbeafe 100%)' : 'transparent',
                        transition: 'all 0.2s ease',
                        border: isActive(link.to) ? '1px solid #bfdbfe' : '1px solid transparent',
                        boxShadow: isActive(link.to) ? '0 2px 8px rgba(0, 86, 179, 0.08)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                        if (!isActive(link.to)) {
                            e.currentTarget.style.background = '#f8fafc';
                            e.currentTarget.style.color = 'var(--text-main)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActive(link.to)) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }
                    }}
                >
                    <span style={{ fontSize: '1rem' }}>{link.icon}</span>
                    {link.label}
                </Link>
            ))}
        </div>
    );
}
