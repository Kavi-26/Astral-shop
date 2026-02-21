import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { FaBoxOpen, FaUsers, FaShoppingCart, FaChartLine, FaArrowRight } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ orders: 0, users: 0, lowStock: 0, revenue: 0 });
    const [chartData, setChartData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const qOrders = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubOrders = onSnapshot(qOrders, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

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

        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            setStats(prev => ({ ...prev, users: snapshot.size }));
        });

        const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
            const products = snapshot.docs.map(doc => doc.data());
            const lowStockCount = products.filter(p => Number(p.stock) < 5).length;
            setStats(prev => ({ ...prev, lowStock: lowStockCount }));
            setLoading(false);
        });

        return () => { unsubOrders(); unsubUsers(); unsubProducts(); };
    }, []);

    const statCards = [
        { title: "Total Orders", value: stats.orders, icon: <FaShoppingCart />, color: "var(--primary)", bg: "linear-gradient(135deg, var(--secondary) 0%, #dbeafe 100%)" },
        { title: "Total Users", value: stats.users, icon: <FaUsers />, color: "#10b981", bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)" },
        { title: "Low Stock", value: stats.lowStock, icon: <FaBoxOpen />, color: "#ef4444", bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)" },
        { title: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: <FaChartLine />, color: "#8b5cf6", bg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)" }
    ];

    if (loading) return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            <AdminSidebar />
            <div className="flex-center" style={{ flex: 1 }}><div className="loader"></div></div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            <AdminSidebar />

            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <h1 style={{ marginBottom: '0.3rem', fontSize: '2rem', color: 'var(--text-main)' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Welcome back! Here's what's happening today.</p>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {statCards.map((stat, idx) => (
                        <div key={idx} style={{
                            background: 'white', padding: '1.5rem', borderRadius: '16px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            display: 'flex', alignItems: 'center', gap: '1.2rem',
                            border: '1px solid #f1f5f9', transition: 'all 0.3s ease',
                            cursor: 'default'
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(0,0,0,0.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                        >
                            <div style={{
                                padding: '1rem', borderRadius: '14px',
                                background: stat.bg, color: stat.color,
                                fontSize: '1.5rem', display: 'flex'
                            }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px', fontWeight: '500' }}>{stat.title}</p>
                                <h2 style={{ fontSize: '1.7rem', margin: 0, color: 'var(--text-main)', fontWeight: '800' }}>{stat.value}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '2rem' }}>
                    {/* Chart */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>Revenue Trends</h3>
                        <div style={{ height: '320px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} style={{ fontSize: '0.8rem' }} />
                                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} style={{ fontSize: '0.8rem' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ background: '#1e293b', borderRadius: '12px', border: 'none', color: 'white', fontSize: '0.9rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                                    />
                                    <Bar dataKey="sales" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={45} />
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '20px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
                    }}>
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>Recent Orders</h3>
                            <Link to="/admin/orders" style={{
                                color: 'var(--primary)', textDecoration: 'none',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                fontSize: '0.85rem', fontWeight: '600',
                                background: 'var(--secondary)', padding: '6px 14px', borderRadius: '20px',
                                transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                            >
                                View All <FaArrowRight size={10} />
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {recentOrders.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>No recent orders.</p>
                            ) : recentOrders.map(order => (
                                <div key={order.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px', borderRadius: '12px',
                                    transition: 'background 0.2s'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '12px',
                                            background: '#f1f5f9', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', color: 'var(--text-muted)'
                                        }}>
                                            <FaBoxOpen size={14} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '2px', color: 'var(--text-main)' }}>
                                                {order.userEmail?.split('@')[0] || "User"}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                #{order.id.slice(0, 6)}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                            ₹{order.totalAmount?.toLocaleString()}
                                        </p>
                                        <span style={{
                                            fontSize: '0.7rem', padding: '3px 10px', borderRadius: '8px',
                                            fontWeight: '600',
                                            background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Shipped' ? '#e0f2fe' : order.status === 'Packed' ? '#ede9fe' : '#fef3c7',
                                            color: order.status === 'Delivered' ? '#166534' : order.status === 'Shipped' ? '#0369a1' : order.status === 'Packed' ? '#5b21b6' : '#92400e'
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
