// src/pages/ProductDetails.js
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaArrowLeft, FaBox, FaCheckCircle, FaExclamationCircle, FaTags, FaInfoCircle, FaShieldAlt } from "react-icons/fa";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const { addToCart } = useCart();

    const stabilizerOptions = [
        { capacity: "2KV", application: "for xerox machines", price: 2500 },
        { capacity: "3KV", application: "for freezer", price: 3000 },
        { capacity: "4KV", application: "for motors", price: 3500 },
        { capacity: "5KV", application: "for advance heavy motors", price: 4000 }
    ];

    const hasVariants = product?.name === "Digital Electronic Voltage Stabilizer" || product?.id === "xq86sjSY5XUl3atipbPI";

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
            let productToAdd = { ...product };
            if (hasVariants && selectedVariant !== null) {
                const variant = stabilizerOptions[selectedVariant];
                productToAdd.id = `${product.id}-${variant.capacity}`;
                productToAdd.name = `${product.name} (${variant.capacity})`;
                productToAdd.price = variant.price;
            }
            for (let i = 0; i < quantity; i++) {
                addToCart(productToAdd);
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
                        background: '#f8fafc',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        color: '#64748b',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.color = 'var(--primary)';
                        e.currentTarget.style.transform = 'translateX(-4px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.transform = 'translateX(0)';
                    }}
                >
                    <FaArrowLeft /> Back to Products
                </Link>

                {/* Main Product Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9'
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
                                borderRadius: '24px',
                                overflow: 'hidden',
                                background: 'white',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                                border: '1px solid #f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '400px',
                                padding: '2rem'
                            }}>
                                <img
                                    src={product.imageUrl || "https://placehold.co/600x500?text=Product+Image"}
                                    alt={product.name}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '400px',
                                        objectFit: 'contain',
                                        display: 'block',
                                        opacity: isOutOfStock ? 0.6 : 1,
                                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

                            </div>
                        </div>

                        {/* Details Section */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {product.category}
                                </span>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#dcfce7',
                                    color: '#16a34a',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    <FaShieldAlt /> 2 Years Warranty
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1.5rem',
                                color: '#0f172a',
                                fontWeight: '800',
                                lineHeight: '1.2',
                                letterSpacing: '-0.5px'
                            }}>
                                {product.name}
                            </h1>

                            {/* Variants List */}
                            {hasVariants && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '1rem' }}>
                                        Select Capacity & Application
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {stabilizerOptions.map((opt, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedVariant(idx)}
                                                style={{
                                                    padding: '14px 18px',
                                                    border: selectedVariant === idx ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    background: selectedVariant === idx ? '#f0f4f8' : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s',
                                                    boxShadow: selectedVariant === idx ? '0 2px 8px rgba(0,86,179,0.1)' : 'none'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <div style={{
                                                        width: '20px', height: '20px', borderRadius: '50%',
                                                        border: selectedVariant === idx ? '6px solid var(--primary)' : '2px solid #cbd5e1',
                                                        transition: 'all 0.2s'
                                                    }}></div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>{opt.capacity}</span>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{opt.application}</span>
                                                    </div>
                                                </div>
                                                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>₹{opt.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                fontWeight: '800',
                                marginBottom: '2rem',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '0.5rem',
                                letterSpacing: '-1px'
                            }}>
                                ₹{hasVariants ? stabilizerOptions[selectedVariant].price.toLocaleString() : product.price.toLocaleString()}
                                <span style={{
                                    fontSize: '1rem',
                                    color: '#94a3b8',
                                    fontWeight: '600',
                                    letterSpacing: 'normal'
                                }}>
                                    per unit
                                </span>
                            </div>

                            {/* Specifications */}
                            <div style={{
                                marginBottom: '2.5rem',
                                padding: '2rem',
                                background: '#f8fafc',
                                borderRadius: '20px',
                                border: '1px solid #f1f5f9'
                            }}>
                                <h3 style={{
                                    fontSize: '1.2rem',
                                    marginBottom: '1.2rem',
                                    color: '#0f172a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontWeight: '700'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '8px' }}>
                                        <FaInfoCircle size={16} />
                                    </span>
                                    Specifications
                                </h3>
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: '5px',
                                    lineHeight: '1.8',
                                    color: '#475569',
                                    listStyleType: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '10px'
                                }}>
                                    {product.specifications ? (
                                        product.specifications.split(',').map((spec, i) => (
                                            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                                <span style={{ color: '#4f46e5', marginTop: '4px' }}>•</span>
                                                <span>{spec.trim()}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li style={{ color: '#94a3b8', fontStyle: 'italic' }}>No specific details available.</li>
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
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '50px', padding: '5px', border: '1px solid #f1f5f9', width: 'fit-content' }}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: 'white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                fontSize: '1.2rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                color: '#64748b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease',
                                                userSelect: 'none'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
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
                                                width: '60px',
                                                height: '40px',
                                                textAlign: 'center',
                                                fontSize: '1.2rem',
                                                fontWeight: '700',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#0f172a',
                                                outline: 'none',
                                                appearance: 'textfield',
                                                MozAppearance: 'textfield'
                                            }}
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                background: 'white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                fontSize: '1.2rem',
                                                fontWeight: '700',
                                                cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                                                color: '#64748b',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s ease',
                                                opacity: quantity >= product.stock ? 0.4 : 1,
                                                userSelect: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (quantity < product.stock) {
                                                    e.currentTarget.style.color = 'var(--primary)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (quantity < product.stock) {
                                                    e.currentTarget.style.color = '#64748b';
                                                }
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
