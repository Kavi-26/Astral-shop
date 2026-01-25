// src/admin/AdminDashboard.js
import { Link } from "react-router-dom";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
    // Mock Data for Analytics (In real app, fetch from Orders collection)
    const data = [
        { name: 'Mon', sales: 4000 },
        { name: 'Tue', sales: 3000 },
        { name: 'Wed', sales: 2000 },
        { name: 'Thu', sales: 2780 },
        { name: 'Fri', sales: 1890 },
        { name: 'Sat', sales: 2390 },
        { name: 'Sun', sales: 3490 },
    ];

    const stats = [
        { title: "Total Orders", value: "124", icon: <FaShoppingCart />, color: "blue" },
        { title: "Total Users", value: "45", icon: <FaUsers />, color: "green" },
        { title: "Low Stock Items", value: "3", icon: <FaBoxOpen />, color: "red" },
        { title: "Revenue", value: "₹5.2L", icon: <FaChartLine />, color: "purple" }
    ];

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Dashboard</h1>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '1rem', borderRadius: '50%', background: `var(--glass-bg)`, color: stat.color, fontSize: '1.5rem' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{stat.title}</p>
                            <h2 style={{ fontSize: '1.8rem' }}>{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Chart */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Sales Analytics</h2>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="name" stroke="var(--text-light)" />
                            <YAxis stroke="var(--text-light)" />
                            <Tooltip
                                contentStyle={{ background: 'rgba(255,255,255,0.8)', borderRadius: '8px', border: 'none' }}
                            />
                            <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Link to="/admin/products" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>Manage Products</Link>
                <Link to="/admin/orders" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', background: 'var(--secondary)' }}>Manage Orders</Link>
                <Link to="/admin/customers" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>View Customers</Link>
            </div>
        </div>
    );
}
