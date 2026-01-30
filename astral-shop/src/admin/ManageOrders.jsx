import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { FaCheck, FaChartLine, FaBoxOpen, FaShoppingCart, FaUsers, FaFileAlt } from "react-icons/fa";

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching orders:", error);
            // Fallback
            if (error.code === 'failed-precondition') {
                const snap = await getDocs(collection(db, "orders"));
                setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id, newStatus) {
        try {
            await updateDoc(doc(db, "orders", id), { status: newStatus });
            // Update local state to reflect change immediately
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    const statuses = ["Ordered", "Packed", "Shipped", "Delivered"];

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            {/* Sidebar */}
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
                <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaChartLine /> Dashboard
                </Link>
                <Link to="/admin/products" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaBoxOpen /> Products
                </Link>
                <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--secondary)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    <FaShoppingCart /> Orders
                </Link>
                <Link to="/admin/customers" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaUsers /> Customers
                </Link>
                <Link to="/admin/reports" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaFileAlt /> Reports
                </Link>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'var(--text-main)' }}>Manage Orders</h1>

                {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Orders...</div> : (
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: 'var(--text-main)', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Order ID & Date</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Customer</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Order Summary</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Total & Pay</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={order.id} style={{ borderBottom: index !== orders.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfcfc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                            <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                                <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>#{order.id.slice(0, 8)}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "Just now"}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{order.userEmail?.split('@')[0]}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.userEmail}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '180px', lineHeight: '1.4' }}>
                                                    {order.shippingAddress}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                                {order.items && order.items.length > 0 ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        {order.items.slice(0, 3).map((item, i) => (
                                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                                <span style={{ fontWeight: '600', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{item.quantity}x</span>
                                                                <span style={{ color: 'var(--text-main)' }}>{item.name}</span>
                                                            </div>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                                                + {order.items.length - 3} more items...
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No items</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-main)' }}>₹{order.totalAmount?.toLocaleString() || "0"}</div>
                                                <span style={{
                                                    padding: '2px 8px', borderRadius: '6px',
                                                    background: order.paymentMethod === 'Online' ? '#dcfce7' : '#ffedd5',
                                                    color: order.paymentMethod === 'Online' ? '#166534' : '#9a3412',
                                                    fontSize: '0.75rem', fontWeight: '600', display: 'inline-block', marginTop: '6px'
                                                }}>
                                                    {order.paymentMethod || "COD"}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                                <div style={{ position: 'relative', width: '140px' }}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                        style={{
                                                            padding: '8px 10px',
                                                            borderRadius: '8px',
                                                            border: '1px solid #e2e8f0',
                                                            background: 'white',
                                                            fontSize: '0.85rem',
                                                            cursor: 'pointer',
                                                            width: '100%',
                                                            fontWeight: '500',
                                                            outline: 'none',
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                        }}
                                                    >
                                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    {/* Visual indicator of current status color */}
                                                    <div style={{
                                                        marginTop: '8px',
                                                        fontSize: '0.75rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontWeight: '600',
                                                        color: order.status === 'Delivered' ? '#16a34a' : order.status === 'Shipped' ? '#2563eb' : 'var(--text-muted)'
                                                    }}>
                                                        {order.status === 'Delivered' && <FaCheck size={10} />}
                                                        Latest: {order.status}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
