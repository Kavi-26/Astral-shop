import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FaDownload, FaCalendarAlt, FaMoneyBillWave, FaShoppingBag } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

export default function Reports() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('daily'); // daily, monthly, yearly
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAtDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
            }));
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders for reports:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredOrders = orders.filter(order => {
        const orderDate = order.createdAtDate;
        if (filterType === 'daily') {
            return orderDate.toISOString().split('T')[0] === selectedDate;
        } else if (filterType === 'monthly') {
            const orderMonth = orderDate.toISOString().slice(0, 7);
            return orderMonth === selectedMonth;
        } else if (filterType === 'yearly') {
            return orderDate.getFullYear().toString() === selectedYear;
        }
        return true;
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    const totalOrders = filteredOrders.length;

    const downloadCSV = () => {
        const headers = ["Order ID", "Date", "Customer Email", "Items", "Total Amount", "Status", "Payment Method"];
        const rows = filteredOrders.map(order => [
            order.id,
            order.createdAtDate.toLocaleDateString(),
            order.userEmail,
            order.items.map(i => `${i.quantity}x ${i.name}`).join(" | "),
            order.totalAmount,
            order.status,
            order.paymentMethod
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `report_${filterType}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            <AdminSidebar />

            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-main)' }}>Sales Reports</h1>
                    <button onClick={downloadCSV} disabled={filteredOrders.length === 0} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: filteredOrders.length === 0 ? 0.5 : 1 }}>
                        <FaDownload /> Download Report
                    </button>
                </div>

                {/* Filters */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Report Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '150px' }}
                        >
                            <option value="daily">Daily Report</option>
                            <option value="monthly">Monthly Report</option>
                            <option value="yearly">Yearly Report</option>
                        </select>
                    </div>

                    {filterType === 'daily' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Select Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    )}

                    {filterType === 'monthly' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Select Month</label>
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                    )}

                    {filterType === 'yearly' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Select Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '100px' }}
                            >
                                {[2024, 2025, 2026, 2027].map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Revenue</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>₹{totalRevenue.toLocaleString()}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '8px' }}><FaMoneyBillWave size={20} /></div>
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Orders</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{totalOrders}</div>
                            </div>
                            <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px', color: 'var(--text-main)' }}><FaShoppingBag size={20} /></div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', color: 'var(--text-main)', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Order ID</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Customer</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Items</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Amount</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No orders found for this period.
                                        </td>
                                    </tr>
                                ) : filteredOrders.map((order, index) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', color: 'var(--text-main)' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>#{order.id.slice(0, 8)}</td>
                                        <td style={{ padding: '1rem' }}>{order.createdAtDate.toLocaleDateString()} {order.createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td style={{ padding: '1rem' }}>{order.userEmail}</td>
                                        <td style={{ padding: '1rem', maxWidth: '300px' }}>
                                            <div style={{ fontSize: '0.9rem' }}>
                                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.totalAmount}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                                                background: order.status === 'Delivered' ? '#dcfce7' : '#e0f2fe',
                                                color: order.status === 'Delivered' ? '#166534' : '#0369a1'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
