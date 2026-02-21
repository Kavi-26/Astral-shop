// src/pages/Cart.js
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrash, FaArrowRight, FaMinus, FaPlus, FaShoppingCart, FaShieldAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, cartCount } = useCart();
    const navigate = useNavigate();
    const [freshStock, setFreshStock] = useState({});

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
            {/* Page Header */}
            <div className="page-header" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                    <FaShoppingCart style={{ fontSize: '1.6rem' }} />
                    <h1 style={{ margin: 0 }}>Shopping Cart</h1>
                </div>
                {cartItems.length > 0 && (
                    <p style={{ margin: '0.5rem 0 0', position: 'relative', zIndex: 1 }}>
                        {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '4rem 2rem',
                    background: 'white', borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    maxWidth: '550px', margin: '0 auto',
                    border: '1px solid #f1f5f9'
                }}>
                    <div style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem', color: 'var(--primary)', fontSize: '2rem'
                    }}>
                        <FaShoppingCart />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.5rem' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1rem' }}>Looks like you haven't added any power electronics yet.</p>
                    <Link to="/products" className="btn-primary" style={{
                        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '14px 32px', fontSize: '1rem'
                    }}>
                        Browse Products <FaArrowRight size={14} />
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center' }}>
                    {/* Cart Items */}
                    <div style={{ flex: '1 1 600px', maxWidth: '800px' }}>
                        <div style={{
                            background: 'white', borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                            overflow: 'hidden', border: '1px solid #f1f5f9'
                        }}>
                            {cartItems.map((item, index) => {
                                const realStock = freshStock[item.id] !== undefined ? freshStock[item.id] : (item.stock || 100);
                                const isMaxed = item.quantity >= realStock;

                                return (
                                    <div key={item.id} style={{
                                        display: 'flex', gap: '1.5rem', padding: '1.5rem 2rem',
                                        borderBottom: index !== cartItems.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        alignItems: 'center', flexWrap: 'wrap',
                                        transition: 'background 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#fafbfc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{
                                            width: '90px', height: '90px', borderRadius: '14px',
                                            overflow: 'hidden', background: '#f8fafc',
                                            border: '1px solid #e2e8f0', flexShrink: 0
                                        }}>
                                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>

                                        <div style={{ flex: '1 1 200px' }}>
                                            <h3 style={{ fontSize: '1.05rem', marginBottom: '6px', color: 'var(--text-main)', fontWeight: '600' }}>{item.name}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                                ₹{Number(item.price).toLocaleString()} each
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center',
                                                border: '2px solid #e2e8f0', borderRadius: '12px',
                                                background: '#fff', overflow: 'hidden'
                                            }}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                                                    padding: '10px 14px', background: 'transparent', border: 'none',
                                                    cursor: 'pointer', color: 'var(--primary)', transition: 'background 0.2s',
                                                    fontSize: '0.8rem'
                                                }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span style={{
                                                    padding: '0 14px', fontWeight: '700', minWidth: '35px',
                                                    textAlign: 'center', fontSize: '1rem', color: 'var(--text-main)'
                                                }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => { if (!isMaxed) updateQuantity(item.id, item.quantity + 1); }}
                                                    disabled={isMaxed}
                                                    style={{
                                                        padding: '10px 14px', background: 'transparent', border: 'none',
                                                        cursor: isMaxed ? 'not-allowed' : 'pointer',
                                                        color: isMaxed ? 'var(--text-muted)' : 'var(--primary)',
                                                        opacity: isMaxed ? 0.4 : 1, transition: 'background 0.2s',
                                                        fontSize: '0.8rem'
                                                    }}
                                                    onMouseEnter={(e) => { if (!isMaxed) e.currentTarget.style.background = 'var(--secondary)' }}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                            {isMaxed && (
                                                <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '600' }}>
                                                    Max ({realStock})
                                                </span>
                                            )}
                                        </div>

                                        <div style={{
                                            textAlign: 'right', minWidth: '110px',
                                            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'
                                        }}>
                                            <p style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--text-main)', margin: 0 }}>
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </p>
                                            <button onClick={() => removeFromCart(item.id)} style={{
                                                background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                                                fontSize: '0.8rem', padding: '6px 12px', borderRadius: '8px',
                                                fontWeight: '600', transition: 'all 0.2s'
                                            }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1)'; }}
                                            >
                                                <FaTrash size={11} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div style={{ flex: '1 1 300px', maxWidth: '380px' }}>
                        <div style={{
                            background: 'white', padding: '2rem', borderRadius: '20px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                            position: 'sticky', top: '100px', border: '1px solid #f1f5f9'
                        }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', color: 'var(--text-main)' }}>Order Summary</h2>

                            <div className="flex-between" style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                <span>Subtotal</span>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{subtotal.toLocaleString()}</span>
                            </div>

                            {isDiscountEligible ? (
                                <div className="flex-between" style={{
                                    marginBottom: '1rem', color: '#15803d',
                                    background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
                                    padding: '12px 14px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600'
                                }}>
                                    <span>🎉 Bulk Discount (10%)</span>
                                    <span>- ₹{discountAmount.toLocaleString()}</span>
                                </div>
                            ) : (
                                <div style={{
                                    marginBottom: '1rem', fontSize: '0.85rem', color: '#6366f1',
                                    textAlign: 'center', background: '#eef2ff', padding: '10px 12px',
                                    borderRadius: '10px', fontWeight: '500'
                                }}>
                                    Add <strong>{10 - cartCount}</strong> more items for 10% Discount!
                                </div>
                            )}

                            <div className="flex-between" style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '0.9rem' }}>Free ✓</span>
                            </div>

                            <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--primary), var(--accent))', margin: '1.5rem 0', borderRadius: '1px', opacity: 0.3 }}></div>

                            <div className="flex-between" style={{
                                marginBottom: '2rem', fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)'
                            }}>
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString()}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-primary"
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '10px', padding: '15px', fontSize: '1.05rem', fontWeight: '700'
                                }}
                            >
                                Proceed to Checkout <FaArrowRight />
                            </button>

                            <p style={{
                                textAlign: 'center', marginTop: '1.2rem', fontSize: '0.8rem',
                                color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '6px'
                            }}>
                                <FaShieldAlt size={12} /> Secure Checkout · 100% Satisfaction
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
