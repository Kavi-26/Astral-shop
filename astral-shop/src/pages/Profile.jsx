import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Orders from "./Orders";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCamera, FaTimes, FaSave } from "react-icons/fa";

export default function Profile() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        async function fetchProfile() {
            if (currentUser) {
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProfile(data);
                        setEditForm({
                            name: data.name || '',
                            phone: data.phone || '',
                            address: data.address || ''
                        });
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
            await updateDoc(docRef, {
                name: editForm.name,
                phone: editForm.phone,
                address: editForm.address
            });
            setProfile(editForm);
            setIsEditing(false);
            // Optional: Show success toast
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    if (loading) return (
        <div className="container flex-center" style={{ minHeight: '60vh' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
    );

    return (
        <div className="container animate-fade-in" style={{ padding: '3rem 20px' }}>

            {/* Header */}
            <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', margin: 0 }}>My Account</h1>
                <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FaEdit /> Edit Profile
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>

                {/* Profile Card */}
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    textAlign: 'center',
                    border: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'var(--secondary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem auto',
                        fontSize: '3rem',
                        color: 'var(--primary)',
                        position: 'relative'
                    }}>
                        {profile.name ? profile.name.charAt(0).toUpperCase() : <FaUser />}
                        <div style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            background: 'white',
                            borderRadius: '50%',
                            padding: '8px',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            color: 'var(--text-main)'
                        }}>
                            <FaCamera />
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{profile.name || "User"}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{currentUser?.email}</p>

                    <div style={{
                        background: 'var(--bg-section)',
                        padding: '1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                        <div>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>Active</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</span>
                        </div>
                        <div style={{ width: '1px', background: '#ddd' }}></div>
                        <div>
                            <span style={{ display: 'block', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>Standard</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Plan</span>
                        </div>
                    </div>
                </div>

                {/* Details Card */}
                <div style={{
                    background: 'white',
                    padding: '2.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: '1px solid #f0f0f0'
                }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem', borderLeft: '4px solid var(--primary)', paddingLeft: '10px' }}>Contact Information</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <InfoRow icon={<FaUser />} label="Full Name" value={profile.name || "Not set"} />
                        <InfoRow icon={<FaEnvelope />} label="Email Address" value={currentUser?.email} />
                        <InfoRow icon={<FaPhone />} label="Phone Number" value={profile.phone || "Not set"} />
                        <InfoRow icon={<FaMapMarkerAlt />} label="Shipping Address" value={profile.address || "Not set"} />
                    </div>
                </div>
            </div>

            {/* Orders Section embedded seamlessly */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{ padding: '2rem 2rem 0 2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0' }}>Recent Orders</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Track and manage your recent purchases.</p>
                </div>
                <Orders />
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        background: 'white', padding: '2.5rem', borderRadius: '12px', width: '90%', maxWidth: '500px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)', position: 'relative'
                    }} className="animate-zoom-in">
                        <button
                            onClick={() => setIsEditing(false)}
                            style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <FaTimes />
                        </button>

                        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Edit Profile</h2>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Phone Number</label>
                                <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Shipping Address</label>
                                <textarea
                                    value={editForm.address}
                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Enter your full address"
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaSave /> Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
                width: '50px',
                height: '50px',
                background: 'var(--secondary)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontSize: '1.2rem',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <small style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</small>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)' }}>{value}</div>
            </div>
        </div>
    );
}
