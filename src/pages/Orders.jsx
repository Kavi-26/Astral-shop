// src/pages/Orders.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaClipboardList, FaFileDownload, FaReceipt } from "react-icons/fa";
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
                    orderBy("createdAt", "desc")
                );
                const querySnapshot = await getDocs(q);
                const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
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

    function getStatusStyle(status) {
        switch (status) {
            case "Ordered": return { color: '#d97706', bg: '#fffbeb', border: '#fef3c7', icon: <FaClipboardList /> };
            case "Packed": return { color: '#2563eb', bg: '#eff6ff', border: '#dbeafe', icon: <FaBoxOpen /> };
            case "Shipped": return { color: '#7c3aed', bg: '#f5f3ff', border: '#ede9fe', icon: <FaShippingFast /> };
            case "Delivered": return { color: '#059669', bg: '#ecfdf5', border: '#d1fae5', icon: <FaCheckCircle /> };
            default: return { color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', icon: <FaClipboardList /> };
        }
    }

    function downloadInvoice(order) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;

        // --- Header ---
        // Header background
        doc.setFillColor(15, 23, 42); // slate-900 (Dark blue/gray)
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Brand Name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("ASTRAL SHOP", margin, 25);

        // Invoice Title
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text("TAX INVOICE", pageWidth - margin, 25, { align: "right" });

        // Reset text color for body
        doc.setTextColor(30, 41, 59); // slate-800

        // --- Invoice Info ---
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Invoice Details:", margin, 55);

        doc.setFont("helvetica", "normal");
        doc.text(`Order ID: #${order.id}`, margin, 62);
        doc.text(`Date: ${order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}`, margin, 68);
        doc.text(`Status: ${order.status || 'Processed'}`, margin, 74);
        doc.text(`Payment: ${order.paymentMethod || 'COD'}`, margin, 80);

        // --- Customer Info ---
        doc.setFont("helvetica", "bold");
        doc.text("Billed To:", pageWidth / 2, 55);

        doc.setFont("helvetica", "normal");
        doc.text(`${order.userEmail}`, pageWidth / 2, 62);
        if (order.shippingAddress) {
            // Split long addresses so they don't run off page
            const splitAddress = doc.splitTextToSize(order.shippingAddress, (pageWidth / 2) - margin);
            doc.text(splitAddress, pageWidth / 2, 68);
        }

        // --- Table Header ---
        let startY = 95;
        doc.setFillColor(241, 245, 249); // slate-100
        doc.rect(margin, startY, pageWidth - (margin * 2), 10, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Sl.", margin + 2, startY + 7);
        doc.text("Description", margin + 15, startY + 7);
        doc.text("Qty", pageWidth - 70, startY + 7, { align: "center" });
        doc.text("Unit Price", pageWidth - 45, startY + 7, { align: "center" });
        doc.text("Total", pageWidth - 15, startY + 7, { align: "right" });

        // --- Table Body ---
        doc.setFont("helvetica", "normal");
        let y = startY + 18;

        if (order.items && order.items.length > 0) {
            order.items.forEach((item, index) => {
                // Check page break
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }

                doc.text(`${index + 1}`, margin + 2, y);

                // Handle long item descriptions
                const splitName = doc.splitTextToSize(item.name, 90);
                doc.text(splitName, margin + 15, y);

                doc.text(`${item.quantity}`, pageWidth - 70, y, { align: "center" });
                doc.text(`Rs. ${item.price.toLocaleString()}`, pageWidth - 45, y, { align: "center" });

                const total = item.quantity * item.price;
                doc.text(`Rs. ${total.toLocaleString()}`, pageWidth - 15, y, { align: "right" });

                y += (splitName.length * 5) + 5; // adjust y based on lines

                // Draw a light bottom border for row
                doc.setDrawColor(226, 232, 240); // slate-200
                doc.line(margin, y - 3, pageWidth - margin, y - 3);
            });
        }

        // --- Totals Section ---
        y += 10;
        if (y > 250) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", pageWidth - 50, y, { align: "right" });
        doc.text(`Rs. ${order.totalAmount?.toLocaleString() || "0"}`, pageWidth - 15, y, { align: "right" });

        y += 7;
        doc.text("Shipping:", pageWidth - 50, y, { align: "right" });
        doc.text("Free", pageWidth - 15, y, { align: "right" });

        y += 4;
        doc.setDrawColor(15, 23, 42); // slate-900
        doc.setLineWidth(0.5);
        doc.line(pageWidth - 85, y, pageWidth - margin, y);

        y += 7;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Total Amount:", pageWidth - 50, y, { align: "right" });
        doc.text(`Rs. ${order.totalAmount?.toLocaleString() || "0"}`, pageWidth - 15, y, { align: "right" });

        // --- Footer ---
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text("Thank you for choosing ASTRAL SHOP!", pageWidth / 2, 280, { align: "center" });
        doc.text("This is a computer generated invoice and does not require a physical signature.", pageWidth / 2, 285, { align: "center" });

        doc.save(`Invoice_ASTRAL_${order.id.slice(0, 8)}.pdf`);
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 20px', maxWidth: '1000px' }}>
            {/* Page Header */}
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <FaReceipt style={{ fontSize: '1.4rem' }} />
                    <h1 style={{ margin: 0 }}>My Orders</h1>
                </div>
                <p>Track and manage your purchases</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            background: 'white', borderRadius: '20px', padding: '2rem',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{ width: '120px', height: '16px', background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px' }}></div>
                                <div style={{ width: '80px', height: '16px', background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px' }}></div>
                            </div>
                            <div style={{ width: '60%', height: '14px', background: 'linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '8px' }}></div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: 'white', borderRadius: '20px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
                }}>
                    <div style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem', color: '#94a3b8', fontSize: '2rem'
                    }}>
                        <FaBoxOpen />
                    </div>
                    <h2 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No orders yet</h2>
                    <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => {
                        const statusStyle = getStatusStyle(order.status);
                        return (
                            <div key={order.id} style={{
                                background: 'white', borderRadius: '20px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                overflow: 'hidden', transition: 'all 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)'}
                                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'}
                            >
                                {/* Order Header */}
                                <div className="flex-between" style={{
                                    background: '#fafbfc', padding: '1.2rem 2rem',
                                    borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '1rem'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '2px' }}>Order Placed</div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '2px' }}>Total</div>
                                        <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>₹{order.totalAmount?.toLocaleString() ?? "0"}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', marginBottom: '2px' }}>Order ID</div>
                                        <div style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem' }}>#{order.id.slice(0, 8)}</div>
                                    </div>
                                </div>

                                {/* Order Body */}
                                <div style={{ padding: '1.5rem 2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
                                        {/* Items */}
                                        <div style={{ flex: '1 1 400px' }}>
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map((item, idx) => (
                                                    <div key={idx} style={{
                                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                                        marginBottom: '0.8rem', padding: '8px',
                                                        borderRadius: '12px', transition: 'background 0.2s'
                                                    }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <div style={{
                                                            width: '50px', height: '50px', borderRadius: '12px',
                                                            background: '#f1f5f9', display: 'flex', alignItems: 'center',
                                                            justifyContent: 'center', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0
                                                        }}>
                                                            {item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <FaBoxOpen color="#cbd5e1" />}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</div>
                                                        </div>
                                                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                                            ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No item details available.</p>
                                            )}
                                        </div>

                                        {/* Status & Actions */}
                                        <div style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            <div style={{
                                                padding: '1rem', borderRadius: '14px',
                                                background: statusStyle.bg, border: `1px solid ${statusStyle.border}`,
                                                display: 'flex', alignItems: 'center', gap: '10px'
                                            }}>
                                                <div style={{ fontSize: '1.3rem', color: statusStyle.color }}>{statusStyle.icon}</div>
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: statusStyle.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</div>
                                                    <div style={{ fontSize: '1rem', fontWeight: '800', color: statusStyle.color }}>{order.status}</div>
                                                </div>
                                            </div>

                                            <button onClick={() => downloadInvoice(order)} style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                gap: '8px', width: '100%', padding: '10px 16px',
                                                borderRadius: '12px', border: '2px solid #e2e8f0',
                                                background: 'white', color: 'var(--text-main)',
                                                fontWeight: '600', fontSize: '0.85rem',
                                                cursor: 'pointer', transition: 'all 0.3s ease',
                                                fontFamily: 'inherit'
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                                    e.currentTarget.style.color = 'var(--primary)';
                                                    e.currentTarget.style.background = 'var(--secondary)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                                    e.currentTarget.style.color = 'var(--text-main)';
                                                    e.currentTarget.style.background = 'white';
                                                }}
                                            >
                                                <FaFileDownload /> Download Invoice
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
