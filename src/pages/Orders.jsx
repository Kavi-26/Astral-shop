// src/pages/Orders.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { FaBoxOpen, FaShippingFast, FaCheckCircle, FaClipboardList, FaFileDownload, FaReceipt } from "react-icons/fa";
import { jsPDF } from "jspdf";
import astralLogo from "../assets/astral-logo.png";

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

    async function downloadInvoice(order) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;

        // --- Header Section ---

        // Load Logo Image
        const imgNode = new Image();
        imgNode.src = astralLogo;
        await new Promise((resolve) => {
            imgNode.onload = resolve;
            imgNode.onerror = resolve;
        });

        // Add Logo to PDF
        // Original text logo was x=margin, y=15, w=55, h=25. The new logo is likely wider.
        // We'll use width 45, height 18 to fit nicely.
        doc.addImage(imgNode, 'PNG', margin, 15, 45, 18);

        // Company Name
        doc.setTextColor(15, 60, 115); // Dark Blue text
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("ASTRAL ELECTRONICS", margin + 65, 24);

        // Manufacturer Tagline
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Manufacturers of: STABILIZER, UPS, CVT, SERVO STABILIZER, STEP-UP TRANSFORMERS", margin + 65, 29);

        // GSTIN
        doc.setFont("helvetica", "bold");
        doc.text("GSTIN: 33AZVPM9083H1ZN", margin + 65, 33);

        // Address
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("1224, Mettupalayam Road, Saibaba Kovil,", margin + 65, 39);
        doc.text("Coimbatore-641 011", margin + 65, 44);

        // Header Top/Bottom Lines
        doc.setDrawColor(15, 60, 115); // Blue lines
        doc.setLineWidth(1.5);
        doc.line(margin, 52, pageWidth - margin, 52); // Top border

        // --- Date ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const orderDate = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric'
        }) : new Date().toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
        doc.text(orderDate, pageWidth - margin, 65, { align: 'right' });

        // --- To Address ---
        let startY = 75;
        doc.setFont("helvetica", "bold");
        doc.text("To,", margin, startY);

        startY += 8;
        doc.setFont("helvetica", "normal");

        // Parse Name and Address
        // Default values to prevent undefined errors
        const customerName = order.userName || "Customer";
        const customerEmail = order.userEmail || "";
        const shippingAddress = order.shippingAddress || "";

        const addressLines = [
            customerName,
            customerEmail,
            ...doc.splitTextToSize(shippingAddress, 80)
        ].filter(line => line.trim() !== "");

        addressLines.forEach(line => {
            doc.text(line, margin, startY);
            startY += 6;
        });

        // --- Subject ---
        startY += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Subject: Tax Invoice / Bill of Supply", margin, startY);

        // --- Body / Items Table ---
        startY += 12;
        doc.setFont("helvetica", "normal");
        doc.text("Respected Sir/Madam,", margin, startY);

        startY += 10;
        const introText = `The company Astral Electronics acknowledges the purchase order #${order.id.slice(0, 8)} made via the Astral Shop digital platform. Below are the details of the products ordered:`;
        const splitIntro = doc.splitTextToSize(introText, pageWidth - (margin * 2));
        doc.text(splitIntro, margin, startY);

        startY += (splitIntro.length * 6) + 5;

        // Table Header
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, startY, pageWidth - (margin * 2), 10, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.1);
        doc.rect(margin, startY, pageWidth - (margin * 2), 10, 'S');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("S.No", margin + 3, startY + 6.5);
        doc.text("Product Description", margin + 20, startY + 6.5);
        doc.text("Qty", pageWidth - 80, startY + 6.5, { align: "center" });
        doc.text("Price", pageWidth - 55, startY + 6.5, { align: "center" });
        doc.text("Total", pageWidth - margin - 3, startY + 6.5, { align: "right" });

        // Table Rows
        let tableY = startY + 10;
        doc.setFont("helvetica", "normal");

        if (order.items && order.items.length > 0) {
            order.items.forEach((item, index) => {
                if (tableY > 230) {
                    doc.addPage();
                    tableY = 20; // reset on new page
                }

                doc.text(`${index + 1}`, margin + 5, tableY + 6);

                const splitDesc = doc.splitTextToSize(item.name, 90);
                doc.text(splitDesc, margin + 20, tableY + 6);

                doc.text(`${item.quantity}`, pageWidth - 80, tableY + 6, { align: "center" });
                doc.text(`Rs. ${item.price.toLocaleString()}`, pageWidth - 55, tableY + 6, { align: "center" });

                const total = item.quantity * item.price;
                doc.text(`Rs. ${total.toLocaleString()}`, pageWidth - margin - 3, tableY + 6, { align: "right" });

                const rowHeight = Math.max(10, splitDesc.length * 6 + 4);

                // Draw row borders
                doc.rect(margin, tableY, pageWidth - (margin * 2), rowHeight, 'S');

                tableY += rowHeight;
            });
        }

        // Totals Row
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total:", pageWidth - 45, tableY + 7, { align: "right" });
        doc.text(`Rs. ${order.totalAmount?.toLocaleString() || "0"}`, pageWidth - margin - 3, tableY + 7, { align: "right" });
        doc.rect(margin, tableY, pageWidth - (margin * 2), 10, 'S');

        tableY += 20;

        // --- Outro / Signoff ---
        if (tableY > 250) {
            doc.addPage();
            tableY = 20;
        }

        doc.setFont("helvetica", "normal");
        const outroText = "Thank you for choosing Astral Electronics. We appreciate your business and look forward to serving you again.";
        const splitOutro = doc.splitTextToSize(outroText, pageWidth - (margin * 2));
        doc.text(splitOutro, margin, tableY);

        tableY += (splitOutro.length * 6) + 15;
        doc.text("Regards,", margin, tableY);

        tableY += 20;
        doc.setFont("helvetica", "bold");
        doc.text("Authorized Signatory", margin, tableY);
        doc.text("ASTRAL ELECTRONICS", margin, tableY + 5);

        // --- Footer Lines ---
        doc.setDrawColor(15, 60, 115);
        doc.setLineWidth(1.5);
        doc.line(margin, 275, pageWidth - margin, 275);
        doc.setLineWidth(0.5);
        doc.line(margin, 277, pageWidth - margin, 277);

        // Footer Contact
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);

        // Simulating icons with text for jsPDF
        doc.text("(Phone) 98422 54817 / 0422 4383817", margin + 30, 285);
        doc.text("(Email) aaajarjun@gmail.com", pageWidth / 2 + 10, 285);

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
