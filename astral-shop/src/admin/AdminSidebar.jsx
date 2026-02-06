import { Link, useLocation } from "react-router-dom";
import { FaChartLine, FaBoxOpen, FaShoppingCart, FaUsers, FaFileAlt } from "react-icons/fa";

export default function AdminSidebar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: isActive(path) ? '600' : '500',
        color: isActive(path) ? 'var(--primary)' : 'var(--text-main)',
        background: isActive(path) ? 'var(--secondary)' : 'transparent',
        transition: 'background 0.2s',
        marginBottom: '0.5rem'
    });

    return (
        <div style={{
            width: '260px',
            background: 'white',
            borderRight: '1px solid #e2e8f0',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            position: 'sticky',
            top: '80px',
            height: 'calc(100vh - 80px)'
        }}>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                Main Menu
            </div>

            <Link to="/admin/dashboard" style={linkStyle('/admin/dashboard')}
                onMouseEnter={e => !isActive('/admin/dashboard') && (e.target.style.background = '#f1f5f9')}
                onMouseLeave={e => !isActive('/admin/dashboard') && (e.target.style.background = 'transparent')}>
                <FaChartLine /> Dashboard
            </Link>

            <Link to="/admin/products" style={linkStyle('/admin/products')}
                onMouseEnter={e => !isActive('/admin/products') && (e.target.style.background = '#f1f5f9')}
                onMouseLeave={e => !isActive('/admin/products') && (e.target.style.background = 'transparent')}>
                <FaBoxOpen /> Products
            </Link>

            <Link to="/admin/orders" style={linkStyle('/admin/orders')}
                onMouseEnter={e => !isActive('/admin/orders') && (e.target.style.background = '#f1f5f9')}
                onMouseLeave={e => !isActive('/admin/orders') && (e.target.style.background = 'transparent')}>
                <FaShoppingCart /> Orders
            </Link>

            <Link to="/admin/customers" style={linkStyle('/admin/customers')}
                onMouseEnter={e => !isActive('/admin/customers') && (e.target.style.background = '#f1f5f9')}
                onMouseLeave={e => !isActive('/admin/customers') && (e.target.style.background = 'transparent')}>
                <FaUsers /> Customers
            </Link>

            <Link to="/admin/reports" style={linkStyle('/admin/reports')}
                onMouseEnter={e => !isActive('/admin/reports') && (e.target.style.background = '#f1f5f9')}
                onMouseLeave={e => !isActive('/admin/reports') && (e.target.style.background = 'transparent')}>
                <FaFileAlt /> Reports
            </Link>
        </div>
    );
}
