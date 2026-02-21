// src/pages/Checkout.js
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaLock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function Checkout() {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);

    async function handlePlaceOrder(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const sanitizedItems = cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                imageUrl: item.imageUrl || ""
            }));

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

            await addDoc(collection(db, "orders"), orderData);

            if (paymentMethod === "Online") {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            for (const item of cartItems) {
                const productRef = doc(db, "products", item.id);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists()) {
                    const currentStock = productSnap.data().stock;
                    await updateDoc(productRef, { stock: currentStock - item.quantity });
                }
            }

            alert(`Order placed successfully! Confirmation email sent to ${currentUser.email}`);
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
            {/* Page Header */}
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <FaLock style={{ fontSize: '1.4rem' }} />
                    <h1 style={{ margin: 0 }}>Secure Checkout</h1>
                </div>
                <p>Complete your order in a few simple steps</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center', alignItems: 'flex-start' }}>
                {/* Left Column: Forms */}
                <div style={{ flex: '1 1 600px', maxWidth: '700px' }}>
                    <div style={{
                        background: 'white', padding: '2.5rem', borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9'
                    }}>
                        <form id="checkout-form" onSubmit={handlePlaceOrder}>
                            {/* Address Section */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                marginBottom: '1.5rem', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9'
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'var(--secondary)', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: 'var(--primary)', fontSize: '0.9rem'
                                }}>
                                    <FaTruck />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>Shipping Information</h3>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{
                                    display: 'block', marginBottom: '8px', fontWeight: '700',
                                    color: '#1e293b', fontSize: '0.9rem', letterSpacing: '0.3px'
                                }}>Full Address</label>
                                <textarea
                                    required
                                    placeholder="House No, Street, City, Pincode..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    style={{
                                        width: '100%', minHeight: '120px', padding: '16px',
                                        borderRadius: '12px', border: '2px solid #e2e8f0',
                                        fontSize: '0.95rem', fontFamily: 'inherit',
                                        transition: 'all 0.3s ease', background: '#f8fafc',
                                        fontWeight: '500', outline: 'none', resize: 'vertical'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary)';
                                        e.target.style.boxShadow = '0 0 0 4px rgba(0, 86, 179, 0.1)';
                                        e.target.style.background = 'white';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.boxShadow = 'none';
                                        e.target.style.background = '#f8fafc';
                                    }}
                                />
                            </div>

                            {/* Payment Section */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                marginBottom: '1.5rem', paddingBottom: '12px', borderBottom: '2px solid #f1f5f9'
                            }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: '#ede9fe', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: '#7c3aed', fontSize: '0.9rem'
                                }}>
                                    <FaCreditCard />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>Payment Method</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                    cursor: 'pointer', padding: '1.5rem 1rem', borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    border: paymentMethod === "COD" ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                    background: paymentMethod === "COD" ? 'linear-gradient(135deg, var(--secondary) 0%, #dbeafe 100%)' : 'white',
                                    boxShadow: paymentMethod === "COD" ? '0 4px 12px rgba(0, 86, 179, 0.12)' : 'none'
                                }}>
                                    <FaMoneyBillWave size={24} style={{ color: paymentMethod === "COD" ? 'var(--primary)' : '#94a3b8' }} />
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")} style={{ display: 'none' }} />
                                    <span style={{ fontWeight: '700', color: paymentMethod === "COD" ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.9rem' }}>
                                        Cash on Delivery
                                    </span>
                                    {paymentMethod === "COD" && <FaCheckCircle style={{ color: 'var(--primary)', fontSize: '0.9rem' }} />}
                                </label>

                                <label style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                    cursor: 'pointer', padding: '1.5rem 1rem', borderRadius: '16px',
                                    transition: 'all 0.3s ease',
                                    border: paymentMethod === "Online" ? '2px solid var(--primary)' : '2px solid #e2e8f0',
                                    background: paymentMethod === "Online" ? 'linear-gradient(135deg, var(--secondary) 0%, #dbeafe 100%)' : 'white',
                                    boxShadow: paymentMethod === "Online" ? '0 4px 12px rgba(0, 86, 179, 0.12)' : 'none'
                                }}>
                                    <FaCreditCard size={24} style={{ color: paymentMethod === "Online" ? 'var(--primary)' : '#94a3b8' }} />
                                    <input type="radio" name="payment" value="Online" checked={paymentMethod === "Online"}
                                        onChange={() => setPaymentMethod("Online")} style={{ display: 'none' }} />
                                    <span style={{ fontWeight: '700', color: paymentMethod === "Online" ? 'var(--primary)' : 'var(--text-main)', fontSize: '0.9rem' }}>
                                        Online Payment
                                    </span>
                                    {paymentMethod === "Online" && <FaCheckCircle style={{ color: 'var(--primary)', fontSize: '0.9rem' }} />}
                                </label>
                            </div>

                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '0.85rem', color: 'var(--text-muted)',
                                background: '#f8fafc', padding: '12px 16px', borderRadius: '12px',
                                border: '1px solid #f1f5f9'
                            }}>
                                <FaShieldAlt style={{ color: '#10b981' }} />
                                Transactions are secure and encrypted.
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div style={{ flex: '1 1 350px', maxWidth: '400px' }}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9',
                        position: 'sticky', top: '100px'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', color: 'var(--text-main)' }}>Order Summary</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                            {cartItems.map(item => (
                                <div key={item.id} className="flex-between" style={{ fontSize: '0.9rem', padding: '6px 0' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={item.imageUrl} alt="" style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', background: '#f1f5f9' }} />
                                            <span style={{
                                                position: 'absolute', top: '-6px', right: '-6px',
                                                background: 'var(--primary)', color: 'white',
                                                borderRadius: '50%', width: '20px', height: '20px',
                                                fontSize: '0.7rem', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontWeight: '700'
                                            }}>
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>₹{item.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div className="flex-between" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                <span>Subtotal</span>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {isDiscountEligible && (
                                <div className="flex-between" style={{
                                    color: '#15803d', fontSize: '0.9rem', fontWeight: '600',
                                    background: '#dcfce7', padding: '8px 12px', borderRadius: '10px'
                                }}>
                                    <span>🎉 Bulk Discount</span>
                                    <span>- ₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex-between" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#16a34a', fontWeight: '700' }}>Free ✓</span>
                            </div>

                            <div style={{
                                height: '2px', background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                                margin: '0.5rem 0', borderRadius: '1px', opacity: 0.3
                            }}></div>

                            <div className="flex-between" style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            className="btn-primary"
                            style={{
                                width: '100%', marginTop: '1.5rem', padding: '15px',
                                fontSize: '1.05rem', fontWeight: '700',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span style={{
                                        width: '18px', height: '18px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTop: '2px solid white',
                                        borderRadius: '50%', animation: 'spin 0.8s linear infinite'
                                    }}></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Place Order <FaArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
