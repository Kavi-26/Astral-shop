import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaChartLine, FaArrowRight } from "react-icons/fa";
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

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Dashboard...</div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 20px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Admin Dashboard</h1>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {statCards.map((stat, idx) => (
                    <div key={idx} style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        border: '1px solid #f0f0f0'
                    }} className="animate-slide-up">
                        <div style={{ padding: '1rem', borderRadius: '10px', background: stat.bg, color: stat.color, fontSize: '1.5rem', display: 'flex' }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{stat.title}</p>
                            <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text-main)' }}>{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                {/* Analytics Chart */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f0f0f0' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Revenue Analytics (Last 7 Days)</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ background: '#1e293b', borderRadius: '8px', border: 'none', color: 'white' }}
                                />
                                <Bar dataKey="sales" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders Preview */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f0f0f0' }}>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Recent Orders</h3>
                        <Link to="/admin/orders" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: '600' }}>
                            View All <FaArrowRight size={12} />
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentOrders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No recent orders.</p> : recentOrders.map(order => (
                            <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <div>
                                    <p style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '2px' }}>{order.userEmail?.split('@')[0] || "User"}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.id.slice(0, 8)}...</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold' }}>₹{order.totalAmount?.toLocaleString()}</p>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        background: order.status === 'Delivered' ? '#dcfce7' : '#fee2e2',
                                        color: order.status === 'Delivered' ? '#166534' : '#991b1b'
                                    }}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Link to="/admin/products" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none', padding: '1rem' }}>Manage Products</Link>
                <Link to="/admin/orders" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none', padding: '1rem' }}>Manage Orders</Link>
                <Link to="/admin/customers" className="btn-secondary" style={{ textAlign: 'center', textDecoration: 'none', padding: '1rem' }}>View Customers</Link>
            </div>
        </div>
    );
}
