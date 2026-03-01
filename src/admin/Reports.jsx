import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FaDownload, FaMoneyBillWave, FaShoppingBag, FaFilter } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

export default function Reports() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    useEffect(() => { fetchOrders(); }, []);

    async function fetchOrders() {
        try {
            const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setOrders(querySnapshot.docs.map(doc => ({
                id: doc.id, ...doc.data(),
                createdAtDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
            })));
        } catch (error) { console.error("Error fetching orders for reports:", error); }
        finally { setLoading(false); }
    }

    const filteredOrders = orders.filter(order => {
        const d = order.createdAtDate;
        if (filterType === 'daily') return d.toISOString().split('T')[0] === selectedDate;
        if (filterType === 'monthly') return d.toISOString().slice(0, 7) === selectedMonth;
        if (filterType === 'yearly') return d.getFullYear().toString() === selectedYear;
        return true;
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    const totalOrders = filteredOrders.length;

    const downloadCSV = () => {
        const headers = ["Order ID", "Date", "Customer Email", "Items", "Total Amount", "Status", "Payment Method"];
        const rows = filteredOrders.map(order => [
            order.id, order.createdAtDate.toLocaleDateString(), order.userEmail,
            order.items.map(i => `${i.quantity}x ${i.name}`).join(" | "),
            order.totalAmount, order.status, order.paymentMethod
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `report_${filterType}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const inputStyle = {
        padding: '10px 14px', borderRadius: '12px', border: '2px solid #e2e8f0',
        fontSize: '0.9rem', fontWeight: '500', outline: 'none', transition: 'all 0.3s ease',
        background: '#f8fafc', minWidth: '150px', fontFamily: 'inherit'
    };
    const handleFocus = (e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,86,179,0.1)'; e.target.style.background = 'white'; };
    const handleBlur = (e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            <AdminSidebar />

            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>Sales Reports</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Analyze your business performance</p>
                    </div>
                    <button onClick={downloadCSV} disabled={filteredOrders.length === 0} className="btn-primary" style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        opacity: filteredOrders.length === 0 ? 0.5 : 1,
                        cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer'
                    }}>
                        <FaDownload /> Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div style={{
                    background: 'white', padding: '1.5rem 2rem', borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '2rem',
                    display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap',
                    border: '1px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', marginRight: '0.5rem' }}>
                        <FaFilter size={14} /> Filters
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Report Type</label>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    {filterType === 'daily' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    )}
                    {filterType === 'monthly' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Month</label>
                            <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                        </div>
                    )}
                    {filterType === 'yearly' && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year</label>
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
                                {[2024, 2025, 2026, 2027].map(year => <option key={year} value={year}>{year}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white',
                        padding: '1.8rem', borderRadius: '18px', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.25)',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px',
                            borderRadius: '50%', background: 'rgba(255,255,255,0.1)'
                        }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '6px', fontWeight: '500' }}>Total Revenue</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800' }}>₹{totalRevenue.toLocaleString()}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}><FaMoneyBillWave size={22} /></div>
                        </div>
                    </div>

                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '18px',
                        border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px',
                            borderRadius: '50%', background: '#f1f5f9'
                        }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '500' }}>Total Orders</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>{totalOrders}</div>
                            </div>
                            <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px', color: 'var(--text-main)' }}><FaShoppingBag size={22} /></div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                                    {['Order ID', 'Date', 'Customer', 'Items', 'Amount', 'Status'].map(h => (
                                        <th key={h} style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: h === 'Amount' ? 'right' : 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                                            <div style={{ fontSize: '1rem', fontWeight: '500' }}>No orders found for this period</div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ padding: '1rem 1.2rem', fontFamily: 'monospace', fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>#{order.id.slice(0, 8)}</td>
                                        <td style={{ padding: '1rem 1.2rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                            {order.createdAtDate.toLocaleDateString()}
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.2rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>{order.userEmail}</td>
                                        <td style={{ padding: '1rem 1.2rem', maxWidth: '280px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                                        </td>
                                        <td style={{ padding: '1rem 1.2rem', fontWeight: '800', textAlign: 'right', color: 'var(--text-main)', fontSize: '0.95rem' }}>₹{Number(order.totalAmount).toLocaleString()}</td>
                                        <td style={{ padding: '1rem 1.2rem' }}>
                                            <span style={{
                                                padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                                                background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Shipped' ? '#e0f2fe' : order.status === 'Packed' ? '#ede9fe' : '#fef3c7',
                                                color: order.status === 'Delivered' ? '#166534' : order.status === 'Shipped' ? '#0369a1' : order.status === 'Packed' ? '#5b21b6' : '#92400e'
                                            }}>{order.status}</span>
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
