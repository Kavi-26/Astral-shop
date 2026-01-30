import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaChartLine, FaBoxOpen, FaShoppingCart, FaUsers, FaFileAlt } from "react-icons/fa";

export default function CustomerManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

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
                <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaShoppingCart /> Orders
                </Link>
                <Link to="/admin/customers" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--secondary)', color: 'var(--primary)', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    <FaUsers /> Customers
                </Link>
                <Link to="/admin/reports" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', color: 'var(--text-main)', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#f1f5f9'} onMouseLeave={e => e.target.style.background = 'transparent'}>
                    <FaFileAlt /> Reports
                </Link>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'var(--text-main)' }}>Registered Customers</h1>

                {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Users...</div> : (
                    <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>

                        {/* Header Stats */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '3rem', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '10px', background: '#dbeafe', borderRadius: '8px', color: '#1d4ed8' }}><FaUsers size={20} /></div>
                                <div>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Users</span>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{users.length}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: 'var(--text-main)', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>User Profile</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Contact Details</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Role</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Date Joined</th>
                                        <th style={{ padding: '1.2rem', fontWeight: '600' }}>Active Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user.id} style={{ borderBottom: index !== users.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfcfc'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px',
                                                        borderRadius: '50%', background: '#e0f2fe',
                                                        color: 'var(--primary)', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center'
                                                    }}>
                                                        <FaUser />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name || "Unnamed User"}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{user.id.slice(0, 6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                                    <FaEnvelope style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                        <FaPhone style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} /> {user.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px',
                                                    fontSize: '0.85rem', fontWeight: '500',
                                                    background: user.role === 'admin' ? '#fee2e2' : '#eff6ff',
                                                    color: user.role === 'admin' ? '#991b1b' : '#1e40af',
                                                    border: user.role === 'admin' ? '1px solid #fecaca' : '1px solid #bfdbfe'
                                                }}>
                                                    {user.role || 'User'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FaCalendarAlt size={12} />
                                                    {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "N/A"}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: '600', fontSize: '0.9rem' }}>
                                                    <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }}></span>
                                                    Active
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
