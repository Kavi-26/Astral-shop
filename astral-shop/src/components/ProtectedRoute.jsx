// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div className="container flex-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && userRole !== 'admin') {
        return <Navigate to="/" />;
    }

    return children;
}
