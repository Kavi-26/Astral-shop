import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

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
        <div className="container animate-fade-in" style={{ padding: '2rem 20px' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Registered Customers</h1>

            {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Loading Users...</div> : (
                <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #f0f0f0' }}>

                    {/* Header Stats */}
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '2rem', background: '#f8fafc' }}>
                        <div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Users</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{users.length}</div>
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: 'var(--secondary)', color: 'var(--text-main)', textAlign: 'left' }}>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>User</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Contact Info</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Role</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Joined Date</th>
                                    <th style={{ padding: '1.2rem', fontWeight: '600' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id} style={{ borderBottom: index !== users.length - 1 ? '1px solid #f0f0f0' : 'none', transition: 'background 0.2s' }}>
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
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {user.id.slice(0, 6)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.9rem' }}>
                                                <FaEnvelope style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} /> {user.email}
                                            </div>
                                            {user.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                    <FaPhone style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} /> {user.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px',
                                                fontSize: '0.85rem', fontWeight: '500',
                                                background: user.role === 'admin' ? '#fee2e2' : '#dbeafe',
                                                color: user.role === 'admin' ? '#991b1b' : '#1e40af'
                                            }}>
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <FaCalendarAlt />
                                                {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "N/A"}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.9rem' }}>Active</span>
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
