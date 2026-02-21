import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { FaCheck } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchOrders(); }, []);

    async function fetchOrders() {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching orders:", error);
            if (error.code === 'failed-precondition') {
                const snap = await getDocs(collection(db, "orders"));
                setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } finally { setLoading(false); }
    }

    async function updateStatus(id, newStatus) {
        try {
            await updateDoc(doc(db, "orders", id), { status: newStatus });
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (error) { console.error("Error updating status:", error); }
    }

    const statuses = ["Ordered", "Packed", "Shipped", "Delivered"];

    function getStatusColor(status) {
        switch (status) {
            case "Ordered": return { bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
            case "Packed": return { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' };
            case "Shipped": return { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
            case "Delivered": return { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' };
            default: return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
        }
    }

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            <AdminSidebar />

            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>Manage Orders</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{orders.length} orders total</p>
                </div>

                {loading ? (
                    <div className="flex-center" style={{ padding: '4rem' }}><div className="loader"></div></div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const statusColor = getStatusColor(order.status);
                                        return (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                            >
                                                <td style={{ padding: '1.2rem' }}>
                                                    <div style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>#{order.id.slice(0, 8)}</div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                                                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "Just now"}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>{order.userEmail?.split('@')[0]}</div>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{order.userEmail}</div>
                                                    {order.shippingAddress && (
                                                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '180px', lineHeight: '1.4' }}>
                                                            📍 {order.shippingAddress}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    {order.items && order.items.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {order.items.slice(0, 3).map((item, i) => (
                                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                                    <span style={{ fontWeight: '700', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--primary)' }}>{item.quantity}x</span>
                                                                    <span style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{item.name}</span>
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>+{order.items.length - 3} more</div>
                                                            )}
                                                        </div>
                                                    ) : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No items</span>}
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>₹{order.totalAmount?.toLocaleString() || "0"}</div>
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: '8px', fontSize: '0.73rem', fontWeight: '600',
                                                        display: 'inline-block', marginTop: '4px',
                                                        background: order.paymentMethod === 'Online' ? '#dcfce7' : '#fff7ed',
                                                        color: order.paymentMethod === 'Online' ? '#166534' : '#9a3412',
                                                        border: `1px solid ${order.paymentMethod === 'Online' ? '#bbf7d0' : '#fed7aa'}`
                                                    }}>{order.paymentMethod || "COD"}</span>
                                                </td>
                                                <td style={{ padding: '1.2rem' }}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                                        style={{
                                                            padding: '9px 12px', borderRadius: '12px',
                                                            border: `2px solid ${statusColor.border}`,
                                                            background: statusColor.bg, color: statusColor.color,
                                                            fontSize: '0.85rem', cursor: 'pointer', width: '140px',
                                                            fontWeight: '700', outline: 'none', fontFamily: 'inherit',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px rgba(0,86,179,0.1)'}
                                                        onBlur={(e) => e.target.style.boxShadow = 'none'}
                                                    >
                                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    {order.status === 'Delivered' && (
                                                        <div style={{ marginTop: '6px', fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: '#16a34a' }}>
                                                            <FaCheck size={10} /> Completed
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
