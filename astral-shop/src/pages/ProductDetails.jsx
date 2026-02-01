// src/pages/ProductDetails.js
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaArrowLeft, FaBox, FaCheckCircle, FaExclamationCircle, FaTags, FaInfoCircle } from "react-icons/fa";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                setError(null);
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setError("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
                setError("Failed to load product. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product && product.stock > 0) {
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }
        }
    };

    const isOutOfStock = product?.stock <= 0;
    const isLowStock = product?.stock > 0 && product?.stock <= 5;

    // Loading State
    if (loading) {
        return (
            <div style={{
                background: '#f8fafc',
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #e2e8f0',
                        borderTop: '4px solid var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Loading product details...</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // Error State
    if (error || !product) {
        return (
            <div style={{
                background: '#f8fafc',
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
                    <h2 style={{
                        fontSize: '1.8rem',
                        color: 'var(--text-main)',
                        marginBottom: '1rem'
                    }}>
                        {error || "Product Not Found"}
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        marginBottom: '2rem',
                        fontSize: '1.1rem'
                    }}>
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <Link
                        to="/products"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
                    >
                        <FaArrowLeft /> Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
            <div className="container" style={{ padding: '3rem 20px' }}>
                {/* Back Button */}
                <Link
                    to="/products"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '2rem',
                        padding: '10px 20px',
                        background: 'white',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        border: '2px solid var(--primary)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--secondary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                    }}
                >
                    <FaArrowLeft /> Back to Products
                </Link>

                {/* Main Product Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: '3rem',
                        padding: '3rem'
                    }}>
                        {/* Image Section */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'relative',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: '#f8fafc',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }}>
                                <img
                                    src={product.imageUrl || "https://placehold.co/600x500?text=Product+Image"}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        opacity: isOutOfStock ? 0.6 : 1
                                    }}
                                />

                                {/* Stock Badge on Image */}
                                {isOutOfStock && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        padding: '12px 20px',
                                        borderRadius: '25px',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
                                    }}>
                                        <FaExclamationCircle /> Out of Stock
                                    </div>
                                )}
                                {isLowStock && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1.5rem',
                                        right: '1.5rem',
                                        background: '#fef3c7',
                                        color: '#d97706',
                                        padding: '12px 20px',
                                        borderRadius: '25px',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.15)'
                                    }}>
                                        <FaBox /> Only {product.stock} Left
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '1.5rem',
                                    left: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '10px 18px',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    fontWeight: '700',
                                    color: 'var(--primary)',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <FaTags /> {product.category}
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* Product Name */}
                            <h1 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem',
                                color: 'var(--text-main)',
                                fontWeight: '700',
                                lineHeight: '1.2'
                            }}>
                                {product.name}
                            </h1>

                            {/* Stock Status */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                {!isOutOfStock ? (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#dcfce7',
                                        color: '#166534',
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        fontSize: '0.95rem',
                                        fontWeight: '700'
                                    }}>
                                        <FaCheckCircle /> In Stock ({product.stock} units available)
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        padding: '10px 18px',
                                        borderRadius: '10px',
                                        fontSize: '0.95rem',
                                        fontWeight: '700'
                                    }}>
                                        <FaExclamationCircle /> Out of Stock
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div style={{
                                fontSize: '3rem',
                                color: 'var(--primary)',
                                fontWeight: '700',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '0.5rem'
                            }}>
                                ₹{product.price.toLocaleString()}
                                <span style={{
                                    fontSize: '1rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: '500'
                                }}>
                                    per unit
                                </span>
                            </div>

                            {/* Specifications */}
                            <div style={{
                                marginBottom: '2rem',
                                padding: '1.5rem',
                                background: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <h3 style={{
                                    fontSize: '1.3rem',
                                    marginBottom: '1rem',
                                    color: 'var(--text-main)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <FaInfoCircle style={{ color: 'var(--primary)' }} />
                                    Specifications
                                </h3>
                                <ul style={{
                                    marginTop: '0.5rem',
                                    paddingLeft: '20px',
                                    lineHeight: '1.8',
                                    color: 'var(--text-main)'
                                }}>
                                    {product.specifications ? (
                                        product.specifications.split(',').map((spec, i) => (
                                            <li key={i} style={{ marginBottom: '0.5rem' }}>
                                                {spec.trim()}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No specific details available.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Quantity Selector */}
                            {!isOutOfStock && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.75rem',
                                        fontWeight: '600',
                                        color: 'var(--text-main)',
                                        fontSize: '1rem'
                                    }}>
                                        Quantity
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '10px',
                                                border: '2px solid #e2e8f0',
                                                background: 'white',
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                color: 'var(--primary)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--secondary)';
                                                e.currentTarget.style.borderColor = 'var(--primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'white';
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                            }}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.stock}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                                            style={{
                                                width: '80px',
                                                height: '45px',
                                                textAlign: 'center',
                                                fontSize: '1.2rem',
                                                fontWeight: '600',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '10px',
                                                outline: 'none'
                                            }}
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                            style={{
                                                width: '45px',
                                                height: '45px',
                                                borderRadius: '10px',
                                                border: '2px solid #e2e8f0',
                                                background: 'white',
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                                                color: 'var(--primary)',
                                                opacity: quantity >= product.stock ? 0.5 : 1,
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (quantity < product.stock) {
                                                    e.currentTarget.style.background = 'var(--secondary)';
                                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'white';
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                style={{
                                    padding: '18px 32px',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    background: isOutOfStock ? '#cbd5e1' : 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isOutOfStock ? 'none' : '0 4px 6px rgba(0, 86, 179, 0.3)',
                                    opacity: isOutOfStock ? 0.6 : 1
                                }}
                                onMouseEnter={(e) => {
                                    if (!isOutOfStock) {
                                        e.currentTarget.style.background = 'var(--primary-dark)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 86, 179, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isOutOfStock) {
                                        e.currentTarget.style.background = 'var(--primary)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 86, 179, 0.3)';
                                    }
                                }}
                            >
                                <FaShoppingCart />
                                {isOutOfStock ? 'Out of Stock' : `Add ${quantity} to Cart`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
