// src/pages/Cart.js
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrash, FaArrowRight, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, cartCount } = useCart();
    const navigate = useNavigate();
    const [freshStock, setFreshStock] = useState({});

    // Fetch up-to-date stock for items in cart
    useEffect(() => {
        async function fetchStock() {
            const stockData = {};
            for (const item of cartItems) {
                try {
                    const docRef = doc(db, "products", item.id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        stockData[item.id] = docSnap.data().stock;
                    }
                } catch (error) {
                    console.error("Error fetching stock for", item.name, error);
                }
            }
            setFreshStock(stockData);
        }
        if (cartItems.length > 0) {
            fetchStock();
        }
    }, [cartItems]);

    const subtotal = getCartTotal();
    const isDiscountEligible = cartCount >= 10;
    const discountAmount = isDiscountEligible ? subtotal * 0.10 : 0;
    const finalTotal = subtotal - discountAmount;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 20px', minHeight: '80vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: 'var(--text-main)' }}>Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ fontSize: '4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }}>
                        <FaShoppingCart />
                    </div>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Looks like you haven't added any power electronics yet.</p>
                    <Link to="/products" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 24px' }}>Browse Products</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center' }}>
                    {/* Cart Items List */}
                    <div style={{ flex: '1 1 600px', maxWidth: '800px' }}>
                        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', fontWeight: '600', color: 'var(--text-muted)', background: '#f8fafc' }}>
                                {cartItems.length} Items in Cart
                            </div>

                            {cartItems.map((item, index) => {
                                const realStock = freshStock[item.id] !== undefined ? freshStock[item.id] : (item.stock || 100);
                                const isMaxed = item.quantity >= realStock;

                                return (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        padding: '1.5rem',
                                        borderBottom: index !== cartItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        alignItems: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        <div style={{ flex: '1 1 200px' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: '600' }}>{item.name}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Unit Price: <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{Number(item.price).toLocaleString()}</span></p>
                                        </div>

                                        <div className="flex-center" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', transition: 'background 0.2s' }}>
                                                    <FaMinus size={10} />
                                                </button>
                                                <span style={{ padding: '0 10px', fontWeight: '600', minWidth: '30px', textAlign: 'center', fontSize: '1rem' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        if (!isMaxed) updateQuantity(item.id, item.quantity + 1);
                                                    }}
                                                    disabled={isMaxed}
                                                    style={{
                                                        padding: '10px 14px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: isMaxed ? 'not-allowed' : 'pointer',
                                                        color: isMaxed ? 'var(--text-muted)' : 'var(--text-main)',
                                                        opacity: isMaxed ? 0.5 : 1
                                                    }}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                            {isMaxed && (
                                                <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    Max limit reached ({realStock})
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ textAlign: 'right', minWidth: '120px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                                            <button onClick={() => removeFromCart(item.id)} style={{
                                                background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                                                fontSize: '0.85rem', padding: '6px 12px', borderRadius: '6px',
                                                fontWeight: '500', transition: 'all 0.2s'
                                            }}>
                                                <FaTrash size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div style={{ flex: '1 1 300px', maxWidth: '380px' }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', position: 'sticky', top: '100px', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', color: 'var(--text-main)' }}>Order Summary</h2>

                            <div className="flex-between" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>

                            {/* Discount Section */}
                            {isDiscountEligible ? (
                                <div className="flex-between" style={{ marginBottom: '1rem', color: '#15803d', background: '#dcfce7', padding: '10px 12px', borderRadius: '8px', fontSize: '0.95rem' }}>
                                    <span>Bulk Discount (10%)</span>
                                    <span>- ₹{discountAmount.toLocaleString()}</span>
                                </div>
                            ) : (
                                <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#6366f1', textAlign: 'center', background: '#e0e7ff', padding: '8px', borderRadius: '6px' }}>
                                    Add <strong>{10 - cartCount}</strong> more items for <br /> 10% Discount!
                                </div>
                            )}

                            <div className="flex-between" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                <span>Shipping Estimate</span>
                                <span style={{ color: '#16a34a', fontWeight: '600' }}>Free</span>
                            </div>

                            <div style={{ height: '1px', background: '#e2e8f0', margin: '1.5rem 0' }}></div>

                            <div className="flex-between" style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-primary"
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '10px', padding: '12px', fontSize: '1.1rem', borderRadius: '8px', fontWeight: '600'
                                }}
                            >
                                Proceed to Checkout <FaArrowRight />
                            </button>

                            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                🔒 Secure Checkout · 100% Satisfaction
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
