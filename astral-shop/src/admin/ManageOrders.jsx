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
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Manage Orders</h1>

            {loading ? <p>Loading...</p> : (
                <div className="glass-card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.05)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>User</th>
                                <th style={{ padding: '1rem' }}>Items</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Payment</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{order.id}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{order.userEmail}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{order.shippingAddress}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <ul style={{ paddingLeft: '15px', margin: 0 }}>
                                            {order.items.map((item, i) => (
                                                <li key={i} style={{ fontSize: '0.9rem' }}>{item.quantity}x {item.name}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td style={{ padding: '1rem' }}>₹{order.totalAmount.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px',
                                            background: order.paymentMethod === 'Online' ? '#dcfce7' : '#ffedd5',
                                            color: order.paymentMethod === 'Online' ? '#166534' : '#9a3412',
                                            fontSize: '0.8rem'
                                        }}>
                                            {order.paymentMethod}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
