import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Orders from "./Orders";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Profile() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            if (currentUser) {
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProfile(docSnap.data());
                    } else {
                        console.log("No such profile!");
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

    if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading user profile...</div>;

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>My Profile</h1>

            <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                    {/* User Details */}
                    <div>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--primary)', paddingBottom: '0.5rem' }}>Personal Details</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="btn-secondary" style={{ padding: '10px', borderRadius: '50%' }}><FaUser /></div>
                            <div>
                                <small style={{ opacity: 0.7 }}>Full Name</small>
                                <p style={{ fontWeight: 'bold' }}>{profile?.name || "N/A"}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="btn-secondary" style={{ padding: '10px', borderRadius: '50%' }}><FaEnvelope /></div>
                            <div>
                                <small style={{ opacity: 0.7 }}>Email Address</small>
                                <p style={{ fontWeight: 'bold' }}>{currentUser?.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div className="btn-secondary" style={{ padding: '10px', borderRadius: '50%' }}><FaPhone /></div>
                            <div>
                                <small style={{ opacity: 0.7 }}>Phone Number</small>
                                <p style={{ fontWeight: 'bold' }}>{profile?.phone || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--primary)', paddingBottom: '0.5rem' }}>Shipping Address</h3>
                        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                            <div className="btn-secondary" style={{ padding: '10px', borderRadius: '50%' }}><FaMapMarkerAlt /></div>
                            <div>
                                <small style={{ opacity: 0.7 }}>Primary Address</small>
                                <p style={{ fontWeight: 'bold', lineHeight: '1.6' }}>{profile?.address || "No address provided."}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Reuse Orders Component */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '2rem' }}>
                <Orders />
            </div>
        </div>
    );
}
