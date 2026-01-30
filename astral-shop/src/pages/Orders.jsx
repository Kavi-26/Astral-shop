// src/pages/Orders.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaClipboardList, FaFileDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";

export default function Orders() {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", currentUser.uid),
                    orderBy("createdAt", "desc") // Requires Index in Firestore
                );
                const querySnapshot = await getDocs(q);
                const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                // Fallback if index is missing (client-side sort)
                if (error.code === 'failed-precondition') {
                    const q2 = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
                    const snap = await getDocs(q2);
                    const unsorted = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setOrders(unsorted.sort((a, b) => b.createdAt - a.createdAt));
                }
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [currentUser]);

    function getStatusColor(status) {
        switch (status) {
            case "Ordered": return "orange";
            case "Packed": return "blue";
            case "Shipped": return "purple";
            case "Delivered": return "green";
            default: return "gray";
        }
    }

    function getStatusIcon(status) {
        switch (status) {
            case "Ordered": return <FaClipboardList />;
            case "Packed": return <FaBoxOpen />;
            case "Shipped": return <FaShippingFast />;
            case "Delivered": return <FaCheckCircle />;
            default: return <FaClipboardList />;
        }
    }

    function downloadInvoice(order) {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("ASTRAL - Invoice", 10, 20);
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 10, 30);
        doc.text(`Date: ${order.createdAt?.toDate ? order.createdAt.toDate().toDateString() : new Date().toDateString()}`, 10, 40);
        doc.text(`Customer: ${order.userEmail}`, 10, 50);

        let y = 70;
        doc.setFontSize(14);
        doc.text("Items:", 10, 60);
        doc.setFontSize(12);

        order.items.forEach((item, index) => {
            doc.text(`${item.quantity}x ${item.name} - ₹${item.price.toLocaleString()}`, 10, y);
            y += 10;
        });

        doc.line(10, y, 200, y);
        y += 10;
        doc.setFontSize(14);
        doc.text(`Total: ₹${order.totalAmount.toLocaleString()}`, 10, y);

        doc.save(`Invoice_${order.id}.pdf`);
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 20px', maxWidth: '1000px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '3rem' }}>My Orders</h1>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                </div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }}><FaBoxOpen /></div>
                    <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>No orders found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {orders.map(order => (
                        <div key={order.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                            {/* Order Header */}
                            <div className="flex-between" style={{ background: '#f8fafc', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Placed</div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                        {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</div>
                                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{order.totalAmount?.toLocaleString() ?? "0"}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</div>
                                    <div style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>#{order.id.slice(0, 8)}</div>
                                </div>
                            </div>

                            {/* Order Body */}
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
                                    {/* Items List */}
                                    <div style={{ flex: '1 1 500px' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Items</h3>
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                                        {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FaBoxOpen color="#cbd5e1" />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</div>
                                                    </div>
                                                    <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                                                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No items details available.</p>
                                        )}
                                    </div>

                                    {/* Status & Actions */}
                                    <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{
                                            padding: '1rem', borderRadius: '8px',
                                            background: '#f0fdf4', border: '1px solid #dcfce7',
                                            display: 'flex', alignItems: 'center', gap: '10px'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', color: '#16a34a' }}>{getStatusIcon(order.status)}</div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '600' }}>Status</div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#16a34a' }}>{order.status}</div>
                                            </div>
                                        </div>

                                        <button onClick={() => downloadInvoice(order)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                                            <FaFileDownload /> Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
