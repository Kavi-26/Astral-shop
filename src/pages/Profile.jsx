import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Orders from "./Orders";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaTimes, FaSave, FaUserCircle } from "react-icons/fa";

export default function Profile() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' });

    useEffect(() => {
        async function fetchProfile() {
            if (currentUser) {
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfile(data);
                        setEditForm({ name: data.name || '', phone: data.phone || '', address: data.address || '' });
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchProfile();
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const docRef = doc(db, "users", currentUser.uid);
            await updateDoc(docRef, { name: editForm.name, phone: editForm.phone, address: editForm.address });
            setProfile(editForm);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    if (loading) return (
        <div className="container flex-center" style={{ minHeight: '60vh' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 20px' }}>
            {/* Page Header */}
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <FaUserCircle style={{ fontSize: '1.6rem' }} />
                    <h1 style={{ margin: 0 }}>My Account</h1>
                </div>
                <p>Manage your profile and track orders</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {/* Profile Card */}
                <div style={{
                    background: 'white', padding: '2.5rem 2rem', borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'center',
                    border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden'
                }}>
                    {/* Gradient top strip */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
                    }}></div>

                    <div style={{
                        width: '110px', height: '110px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '20px auto 1.5rem', fontSize: '2.8rem', color: 'white',
                        fontWeight: '800', position: 'relative', zIndex: 1,
                        border: '4px solid white', boxShadow: '0 8px 20px rgba(0, 86, 179, 0.25)'
                    }}>
                        {profile.name ? profile.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>

                    <h2 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>{profile.name || "User"}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{currentUser?.email}</p>

                    <div style={{
                        background: '#f8fafc', padding: '1rem', borderRadius: '14px',
                        display: 'flex', justifyContent: 'space-around', border: '1px solid #f1f5f9'
                    }}>
                        <div>
                            <span style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', color: '#10b981' }}>Active</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Status</span>
                        </div>
                        <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                        <div>
                            <span style={{ display: 'block', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>Standard</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Plan</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn-primary"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '8px', width: '100%', marginTop: '1.5rem', padding: '12px'
                        }}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                </div>

                {/* Details Card */}
                <div style={{
                    background: 'white', padding: '2.5rem', borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
                }}>
                    <h3 style={{
                        marginBottom: '2rem', fontSize: '1.15rem', color: 'var(--text-main)',
                        display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <div style={{
                            width: '4px', height: '24px', borderRadius: '2px',
                            background: 'linear-gradient(180deg, var(--primary), var(--accent))'
                        }}></div>
                        Contact Information
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                        <InfoRow icon={<FaUser />} label="Full Name" value={profile.name || "Not set"} color="var(--primary)" bg="var(--secondary)" />
                        <InfoRow icon={<FaEnvelope />} label="Email Address" value={currentUser?.email} color="#7c3aed" bg="#f5f3ff" />
                        <InfoRow icon={<FaPhone />} label="Phone Number" value={profile.phone || "Not set"} color="#059669" bg="#ecfdf5" />
                        <InfoRow icon={<FaMapMarkerAlt />} label="Shipping Address" value={profile.address || "Not set"} color="#d97706" bg="#fffbeb" />
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            <div style={{
                background: 'white', borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                overflow: 'hidden', border: '1px solid #f1f5f9'
            }}>
                <div style={{ padding: '2rem 2rem 0 2rem' }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>Recent Orders</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track and manage your recent purchases.</p>
                </div>
                <Orders />
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, padding: '1rem'
                }}>
                    <div className="animate-zoom-in" style={{
                        background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                            padding: '2rem', textAlign: 'center', color: 'white', position: 'relative'
                        }}>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{
                                    position: 'absolute', top: '16px', right: '16px',
                                    background: 'rgba(255,255,255,0.2)', border: 'none',
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    cursor: 'pointer', color: 'white', fontSize: '1rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <FaTimes />
                            </button>
                            <FaEdit style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }} />
                            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'white' }}>Edit Profile</h2>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '2rem' }}>
                            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>Full Name</label>
                                    <input
                                        type="text" value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        style={{
                                            width: '100%', padding: '13px 16px', borderRadius: '12px',
                                            border: '2px solid #e2e8f0', fontSize: '0.95rem',
                                            outline: 'none', transition: 'all 0.3s ease',
                                            background: '#f8fafc', fontWeight: '500', fontFamily: 'inherit'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,86,179,0.1)'; e.target.style.background = 'white'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>Phone Number</label>
                                    <input
                                        type="tel" value={editForm.phone}
                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        placeholder="Enter your phone number"
                                        style={{
                                            width: '100%', padding: '13px 16px', borderRadius: '12px',
                                            border: '2px solid #e2e8f0', fontSize: '0.95rem',
                                            outline: 'none', transition: 'all 0.3s ease',
                                            background: '#f8fafc', fontWeight: '500', fontFamily: 'inherit'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,86,179,0.1)'; e.target.style.background = 'white'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>Shipping Address</label>
                                    <textarea
                                        value={editForm.address}
                                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                        placeholder="Enter your full address"
                                        style={{
                                            width: '100%', padding: '13px 16px', borderRadius: '12px',
                                            border: '2px solid #e2e8f0', fontSize: '0.95rem',
                                            outline: 'none', transition: 'all 0.3s ease',
                                            background: '#f8fafc', fontWeight: '500', fontFamily: 'inherit',
                                            minHeight: '100px', resize: 'vertical'
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,86,179,0.1)'; e.target.style.background = 'white'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
                                    />
                                </div>
                                <button type="submit" className="btn-primary" style={{
                                    marginTop: '0.5rem', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '8px', padding: '14px', fontSize: '1rem'
                                }}>
                                    <FaSave /> Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ icon, label, value, color, bg }) {
    return (
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <div style={{
                width: '48px', height: '48px', background: bg,
                borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: color, fontSize: '1.1rem', flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <small style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '2px', fontSize: '0.78rem', fontWeight: '600', letterSpacing: '0.3px' }}>{label}</small>
                <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-main)' }}>{value}</div>
            </div>
        </div>
    );
}
