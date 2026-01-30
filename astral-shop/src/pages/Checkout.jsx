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
            // Sanitize items to ensure only necessary data is saved
            const sanitizedItems = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                imageUrl: item.imageUrl || ""
            }));

            // 1. Create Order
            const orderData = {
                userId: currentUser.uid,
                userEmail: currentUser.email,
                items: sanitizedItems,
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

            // 3. Stock Reduction
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

    const subtotal = getCartTotal();
    const isDiscountEligible = cartItems.reduce((acc, item) => acc + item.quantity, 0) >= 10;
    const discountAmount = isDiscountEligible ? subtotal * 0.10 : 0;
    const finalTotal = subtotal - discountAmount;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 20px', minHeight: '80vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: 'var(--text-main)' }}>Checkout</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'center', alignItems: 'flex-start' }}>
                {/* Left Column: Forms */}
                <div style={{ flex: '1 1 600px', maxWidth: '700px' }}>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9' }}>
                        <form id="checkout-form" onSubmit={handlePlaceOrder}>
                            {/* Address Section */}
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                1. Shipping Information
                            </h3>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-muted)' }}>Full Address</label>
                                <textarea
                                    required
                                    placeholder="House No, Street, City, Pincode..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    style={{
                                        width: '100%', minHeight: '120px', padding: '16px', borderRadius: '12px',
                                        border: '1px solid #cbd5e1', fontSize: '1rem', fontFamily: 'inherit',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                />
                            </div>

                            {/* Payment Section */}
                            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                                2. Payment Method
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                                    border: paymentMethod === "COD" ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                                    padding: '1.5rem', borderRadius: '12px', background: paymentMethod === "COD" ? 'var(--secondary)' : 'white',
                                    transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")}
                                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontWeight: '600', color: paymentMethod === "COD" ? 'var(--primary)' : 'var(--text-main)' }}>Cash on Delivery</span>
                                </label>

                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                                    border: paymentMethod === "Online" ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                                    padding: '1.5rem', borderRadius: '12px', background: paymentMethod === "Online" ? 'var(--secondary)' : 'white',
                                    transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Online"
                                        checked={paymentMethod === "Online"}
                                        onChange={() => setPaymentMethod("Online")}
                                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontWeight: '600', color: paymentMethod === "Online" ? 'var(--primary)' : 'var(--text-main)' }}>Online Payment</span>
                                </label>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                                🔒 Transactions are secure and encrypted.
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div style={{ flex: '1 1 350px', maxWidth: '400px' }}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '16px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0',
                        position: 'sticky', top: '100px'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', color: 'var(--text-main)' }}>Order Summary</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto' }}>
                            {cartItems.map(item => (
                                <div key={item.id} className="flex-between" style={{ fontSize: '0.95rem' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={item.imageUrl} alt="" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', background: '#f1f5f9' }} />
                                            <span style={{
                                                position: 'absolute', top: '-5px', right: '-5px',
                                                background: 'var(--text-muted)', color: 'white',
                                                borderRadius: '50%', width: '20px', height: '20px',
                                                fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{item.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div className="flex-between" style={{ color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {isDiscountEligible && (
                                <div className="flex-between" style={{ color: '#16a34a' }}>
                                    <span>Bulk Discount (10%)</span>
                                    <span>- ₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex-between" style={{ color: 'var(--text-muted)' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#16a34a', fontWeight: '500' }}>Free</span>
                            </div>
                            <div className="flex-between" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.5rem' }}>
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '2rem', padding: '14px', fontSize: '1.1rem' }}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : `Place Order`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
