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
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>My Orders</h1>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.6 }}>
                    <h2>No orders found.</h2>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="glass-card" style={{ padding: '2rem' }}>
                            <div className="flex-between" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Order ID: {order.id}</p>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Date: {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: getStatusColor(order.status), fontWeight: 'bold' }}>
                                        {getStatusIcon(order.status)} {order.status}
                                    </div>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '5px' }}>₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div style={{ paddingLeft: '1rem' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>{item.quantity}x</span>
                                        <span>{item.name}</span>
                                        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>₹{item.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <button onClick={() => downloadInvoice(order)} className="btn-secondary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaFileDownload /> Download Invoice
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
