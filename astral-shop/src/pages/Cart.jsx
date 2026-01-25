// src/pages/Cart.js
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaTrash, FaArrowRight } from "react-icons/fa";

export default function Cart() {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <h2>Your cart is empty</h2>
                    <p style={{ margin: '1rem 0' }}>Looks like you haven't added any power electronics yet.</p>
                    <Link to="/products" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Products</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div style={{ flex: 2, minWidth: '300px' }}>
                        <div className="glass-card" style={{ padding: '1rem' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(0,0,0,0.1)', alignItems: 'center' }}>
                                    <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
                                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>₹{item.price.toLocaleString()}</p>
                                    </div>

                                    <div className="flex-center" style={{ gap: '10px' }}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn-secondary" style={{ padding: '5px 10px' }}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn-secondary" style={{ padding: '5px 10px' }}>+</button>
                                    </div>

                                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                        <p style={{ fontWeight: 'bold' }}>₹{(item.price * item.quantity).toLocaleString()}</p>
                                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', marginTop: '5px' }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                            <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <span>Subtotal</span>
                                <span>₹{getCartTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex-between" style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                                <span>Total</span>
                                <span>₹{getCartTotal().toLocaleString()}</span>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                Proceed to Checkout <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
