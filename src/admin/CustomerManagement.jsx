import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaUsers } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

export default function CustomerManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) { console.error("Error fetching users:", error); }
            finally { setLoading(false); }
        }
        fetchUsers();
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            <AdminSidebar />

            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>Customer Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{users.length} registered users</p>
                </div>

                {loading ? (
                    <div className="flex-center" style={{ padding: '4rem' }}><div className="loader"></div></div>
                ) : (
                    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                        {/* Header Stats */}
                        <div style={{
                            padding: '1.5rem 2rem', borderBottom: '2px solid #f1f5f9',
                            display: 'flex', gap: '3rem', background: '#fafbfc'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    padding: '12px', background: 'linear-gradient(135deg, var(--secondary) 0%, #dbeafe 100%)',
                                    borderRadius: '14px', color: 'var(--primary)', fontSize: '1.2rem'
                                }}>
                                    <FaUsers />
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Users</span>
                                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>{users.length}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Joined</th>
                                        <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                        >
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                                        color: 'white', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', fontWeight: '800', fontSize: '1rem'
                                                    }}>
                                                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUser size={14} />}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{user.name || "Unnamed"}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{user.id.slice(0, 6)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                                    <FaEnvelope style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }} /> {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        <FaPhone style={{ fontSize: '0.75rem' }} /> {user.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <span style={{
                                                    padding: '5px 14px', borderRadius: '20px', fontSize: '0.83rem', fontWeight: '600',
                                                    background: user.role === 'admin' ? '#fef2f2' : '#eff6ff',
                                                    color: user.role === 'admin' ? '#991b1b' : '#1e40af',
                                                    border: `1px solid ${user.role === 'admin' ? '#fecaca' : '#bfdbfe'}`
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
                                                <div style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                    padding: '5px 14px', borderRadius: '20px',
                                                    background: '#f0fdf4', border: '1px solid #bbf7d0'
                                                }}>
                                                    <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }}></span>
                                                    <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.85rem' }}>Active</span>
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
