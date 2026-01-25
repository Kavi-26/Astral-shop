// src/pages/Checkout.js
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD"); // COD, Online
    const [loading, setLoading] = useState(false);

    async function handlePlaceOrder(e) {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order
            const orderData = {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                items: cartItems,
                totalAmount: getCartTotal(),
                shippingAddress: address,
                paymentMethod,
                paymentStatus: paymentMethod === "Online" ? "Paid" : "Pending",
                status: "Ordered",
                createdAt: new Date()
            };

            const orderRef = await addDoc(collection(db, "orders"), orderData);

            // 2. Mock Payment Delay
            if (paymentMethod === "Online") {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
            }

            // 3. Stock Reduction (Enhancement)
            // Note: In production, do this with a Transaction to prevent race conditions
            for (const item of cartItems) {
                const productRef = doc(db, "products", item.id);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists()) {
                    const currentStock = productSnap.data().stock;
                    await updateDoc(productRef, { stock: currentStock - item.quantity });
                }
            }

            // 5. Mock Email Confirmation
            alert(`Order placed successfully! Confirmation email sent to ${currentUser.email}`);

            // 6. Success
            clearCart();
            navigate("/orders");

        } catch (error) {
            console.error("Order failed:", error);
            alert("Failed to place order. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container" style={{ padding: '2rem 20px', maxWidth: '800px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Checkout</h1>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <form onSubmit={handlePlaceOrder}>
                    {/* Address Section */}
                    <h3 style={{ marginBottom: '1rem' }}>Shipping Information</h3>
                    <textarea
                        required
                        placeholder="Enter full shipping address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '2rem' }}
                    />

                    {/* Payment Section */}
                    <h3 style={{ marginBottom: '1rem' }}>Payment Method</h3>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'cursor' }}>
                            <input
                                type="radio"
                                name="payment"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                            />
                            Cash on Delivery (COD)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'cursor' }}>
                            <input
                                type="radio"
                                name="payment"
                                value="Online"
                                checked={paymentMethod === "Online"}
                                onChange={() => setPaymentMethod("Online")}
                            />
                            Online Payment (Mock)
                        </label>
                    </div>

                    {/* Order Summary */}
                    <div style={{ background: 'rgba(0,0,0,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
                        <div className="flex-between">
                            <span>Total Amount</span>
                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{getCartTotal().toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '15px' }}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : `Place Order ₹${getCartTotal().toLocaleString()}`}
                    </button>
                </form>
            </div>
        </div>
    );
}
