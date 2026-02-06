import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaChartLine, FaArrowRight, FaFileAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        orders: 0,
        users: 0,
        lowStock: 0,
        revenue: 0
    });
    const [chartData, setChartData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Real-time listener for Orders
        const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubOrders = onSnapshot(qOrders, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Calculate Stats
            const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

            // Calculate Chart Data (Revenue per day - Last 7 days)
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();

            const salesMap = {};
            orders.forEach(order => {
                const date = order.createdAt?.toDate ? order.createdAt.toDate().toISOString().split('T')[0] : "";
                if (date && last7Days.includes(date)) {
                    salesMap[date] = (salesMap[date] || 0) + (Number(order.totalAmount) || 0);
                }
            });

            const newChartData = last7Days.map(date => ({
                name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                sales: salesMap[date] || 0
            }));

            setStats(prev => ({ ...prev, orders: orders.length, revenue: totalRevenue }));
            setChartData(newChartData);
            setRecentOrders(orders.slice(0, 5));
        });

        // Real-time listener for Users
        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            setStats(prev => ({ ...prev, users: snapshot.size }));
        });

        // Real-time listener for Products (Low Stock)
        const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
            const products = snapshot.docs.map(doc => doc.data());
            const lowStockCount = products.filter(p => Number(p.stock) < 5).length;
            setStats(prev => ({ ...prev, lowStock: lowStockCount }));
            setLoading(false);
        });

        return () => {
            unsubOrders();
            unsubUsers();
            unsubProducts();
        };
    }, []);

    const statCards = [
        { title: "Total Orders", value: stats.orders, icon: <FaShoppingCart />, color: "var(--primary)", bg: "var(--secondary)" },
        { title: "Total Users", value: stats.users, icon: <FaUsers />, color: "#10b981", bg: "#d1fae5" },
        { title: "Low Stock Items", value: stats.lowStock, icon: <FaBoxOpen />, color: "#ef4444", bg: "#fee2e2" },
        { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <FaChartLine />, color: "#8b5cf6", bg: "#ede9fe" }
    ];

    // Active Tab State for Sidebar Navigation logic (simulated for now, or using real routing if preferred, staying simple with current routing structure)
    // For a cleaner approach, sidebar links will just be standard Links to separate pages. 
    // Ideally, we would have a layout wrapper, but we can style this page to look like a full panel.

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            {/* Sidebar (Visual separation) */}
            <div style={{
                width: '260px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'sticky',
                top: '80px',
                height: 'calc(100vh - 80px)'
            }}>
                <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                    Main Menu
                </div>
                <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--secondary)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    <FaChartLine /> Dashboard
                </Link>
                <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaBoxOpen /> Products
                </Link>
                <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaShoppingCart /> Orders
                </Link>
                <Link to="/admin/customers" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaUsers /> Customers
                </Link>
                <Link to="/admin/reports" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaFileAlt /> Reports
                </Link>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'var(--text-main)' }}>Dashboard Overview</h1>

                {/* Overview Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {statCards.map((stat, idx) => (
                        <div key={idx} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div style={{
                                padding: '1rem', borderRadius: '12px',
                                background: stat.bg, color: stat.color,
                                fontSize: '1.5rem', display: 'flex',
                                boxShadow: '0 4px 6px -2px rgba(0,0,0,0.05)'
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px', fontWeight: '500' }}>{stat.title}</p>
                                <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-main)', fontWeight: '700' }}>{stat.value}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '2rem' }}>
                    {/* Analytics Chart */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ marginBottom: '2rem', color: 'var(--text-main)' }}>Revenue Trends</h3>
                        <div style={{ height: '320px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} dy={10} style={{ fontSize: '0.8rem' }} />
                                    <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} style={{ fontSize: '0.8rem' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ background: '#1e293b', borderRadius: '8px', border: 'none', color: 'white', fontSize: '0.9rem' }}
                                    />
                                    <Bar dataKey="sales" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Orders Preview */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' }}>
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Recent Orders</h3>
                            <Link to="/admin/orders" style={{
                                color: 'var(--primary)', textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.85rem', fontWeight: '600',
                                background: 'var(--secondary)', padding: '6px 12px', borderRadius: '20px'
                            }}>
                                View All <FaArrowRight size={10} />
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {recentOrders.length === 0 ? <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>No recent orders.</p> : recentOrders.map(order => (
                                <div key={order.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px', borderRadius: '10px',
                                    transition: 'background 0.2s', border: '1px solid transparent'
                                }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                            <FaBoxOpen size={14} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '2px', color: 'var(--text-main)' }}>{order.userEmail?.split('@')[0] || "User"}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{order.id.slice(0, 6)}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>₹{order.totalAmount?.toLocaleString()}</p>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Shipped' ? '#e0f2fe' : '#fee2e2',
                                            color: order.status === 'Delivered' ? '#166534' : order.status === 'Shipped' ? '#0369a1' : '#991b1b',
                                            fontWeight: '600'
                                        }}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
