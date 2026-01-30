// src/admin/ManageOrders.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, orderBy, query } from "firebase/firestore";
import { FaCheck } from "react-icons/fa";

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
        <div className="container animate-fade-in" style={{ padding: '2rem 20px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Manage Orders</h1>

            {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Orders...</div> : (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr style={{ background: 'var(--secondary)', color: 'var(--text-main)', textAlign: 'left' }}>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Order ID</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Customer</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Order Details</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Total & Pay</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => (
                                    <tr key={order.id} style={{ borderBottom: index !== orders.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                        <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.id}</span>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : "Just now"}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                            <div style={{ fontWeight: '600' }}>{order.userEmail}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '200px' }}>
                                                {order.shippingAddress}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                            <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.9rem' }}>
                                                {order.items.map((item, i) => (
                                                    <li key={i} style={{ marginBottom: '4px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>₹{order.totalAmount.toLocaleString()}</div>
                                            <span style={{
                                                padding: '2px 8px', borderRadius: '4px',
                                                background: order.paymentMethod === 'Online' ? '#dcfce7' : '#ffedd5',
                                                color: order.paymentMethod === 'Online' ? '#166534' : '#9a3412',
                                                fontSize: '0.75rem', fontWeight: '600', display: 'inline-block', marginTop: '6px'
                                            }}>
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem', verticalAlign: 'top' }}>
                                            <div style={{ position: 'relative' }}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #cbd5e1',
                                                        background: 'white',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer',
                                                        width: '100%',
                                                        fontWeight: '500'
                                                    }}
                                                >
                                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                {/* Visual indicator of current status color */}
                                                <div style={{
                                                    marginTop: '8px',
                                                    fontSize: '0.8rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    color: order.status === 'Delivered' ? '#16a34a' : order.status === 'Shipped' ? '#2563eb' : 'var(--text-muted)'
                                                }}>
                                                    {order.status === 'Delivered' && <FaCheck />}
                                                    Current: <span style={{ fontWeight: '600' }}>{order.status}</span>
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
    );
}
