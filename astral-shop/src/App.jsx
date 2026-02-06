// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import Orders from "./pages/Orders";
import Profile from "./pages/Profile";



// Admin Pages
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageProducts from "./admin/ManageProducts";
import ManageOrders from "./admin/ManageOrders";
import CustomerManagement from "./admin/CustomerManagement";
import Reports from "./admin/Reports";

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-light)', color: 'var(--text-light)' }}>
                        <Navbar />
                        <main style={{ flex: 1 }}>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/products/:id" element={<ProductDetails />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/admin/login" element={<AdminLogin />} />

                                {/* Protected User Routes */}
                                <Route path="/checkout" element={
                                    <ProtectedRoute>
                                        <Checkout />
                                    </ProtectedRoute>
                                } />
                                <Route path="/orders" element={
                                    <ProtectedRoute>
                                        <Orders />
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />

                                {/* Protected Admin Routes */}
                                <Route path="/admin/dashboard" element={
                                    <ProtectedRoute adminOnly={true}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/products" element={
                                    <ProtectedRoute adminOnly={true}>
                                        <ManageProducts />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/orders" element={
                                    <ProtectedRoute adminOnly={true}>
                                        <ManageOrders />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/customers" element={
                                    <ProtectedRoute adminOnly={true}>
                                        <CustomerManagement />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/reports" element={
                                    <ProtectedRoute adminOnly={true}>
                                        <Reports />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
