// src/admin/CustomerManagement.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FaUser } from "react-icons/fa";

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
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Registered Customers</h1>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {users.map(user => (
                        <div key={user.id} className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'var(--bg-dark)', color: 'white', padding: '1rem', borderRadius: '50%' }}>
                                <FaUser size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{user.name || "Unnamed User"}</h3>
                                <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>{user.email}</p>
                                <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>Role: <span style={{ fontWeight: 'bold' }}>{user.role}</span></p>
                                <p style={{ fontSize: '0.8rem' }}>Phone: {user.phone || "N/A"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
