// src/components/ProductCard.js
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaEye, FaBox, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function ProductCard({ product, viewMode = 'grid' }) {
    const { addToCart } = useCart();
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    if (viewMode === 'list') {
        return (
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }}>
                {/* Stock Badge */}
                {isOutOfStock && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 2
                    }}>
                        <FaExclamationCircle /> Out of Stock
                    </div>
                )}
                {isLowStock && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        left: '1rem',
                        background: '#fef3c7',
                        color: '#d97706',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 2
                    }}>
                        <FaBox /> Only {product.stock} left
                    </div>
                )}

                {/* Image */}
                <div style={{
                    width: '180px',
                    height: '140px',
                    flexShrink: 0,
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <img
                        src={product.imageUrl || "https://placehold.co/300x200?text=Product"}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: isOutOfStock ? 0.5 : 1
                        }}
                    />
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                        <h3 style={{
                            fontSize: '1.3rem',
                            marginBottom: '0.5rem',
                            color: 'var(--text-main)',
                            fontWeight: '600'
                        }}>
                            {product.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-muted)',
                                background: '#f1f5f9',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontWeight: '500'
                            }}>
                                {product.category}
                            </span>
                            {!isOutOfStock && (
                                <span style={{
                                    fontSize: '0.85rem',
                                    color: '#10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: '600'
                                }}>
                                    <FaCheckCircle /> In Stock
                                </span>
                            )}
                        </div>
                    </div>

                    {product.specifications && (
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {product.specifications}
                        </p>
                    )}
                </div>

                {/* Price & Actions */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'flex-end',
                    minWidth: '180px'
                }}>
                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: 'var(--primary)'
                    }}>
                        ₹{product.price.toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link
                            to={`/products/${product.id}`}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: '2px solid var(--primary)',
                                background: 'white',
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--secondary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            <FaEye /> View
                        </Link>
                        <button
                            onClick={() => addToCart(product)}
                            disabled={isOutOfStock}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                border: 'none',
                                background: isOutOfStock ? '#cbd5e1' : 'var(--primary)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease',
                                opacity: isOutOfStock ? 0.6 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!isOutOfStock) e.currentTarget.style.background = 'var(--primary-dark)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isOutOfStock) e.currentTarget.style.background = 'var(--primary)';
                            }}
                        >
                            <FaShoppingCart /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transition: 'all 0.3s ease',
            position: 'relative'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.transform = 'translateY(-8px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
            {/* Image Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '240px',
                overflow: 'hidden',
                background: '#f8fafc'
            }}>
                <img
                    src={product.imageUrl || "https://placehold.co/300x200?text=Product"}
                    alt={product.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        opacity: isOutOfStock ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />

                {/* Stock Badge */}
                {isOutOfStock && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '8px 14px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <FaExclamationCircle /> Out of Stock
                    </div>
                )}
                {isLowStock && (
                    <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#fef3c7',
                        color: '#d97706',
                        padding: '8px 14px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <FaBox /> {product.stock} left
                    </div>
                )}

                {/* Category Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--primary)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {product.category}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{
                    fontSize: '1.2rem',
                    marginBottom: '0.75rem',
                    color: 'var(--text-main)',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    minHeight: '2.8rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {product.name}
                </h3>

                {/* Stock Status */}
                {!isOutOfStock && (
                    <div style={{
                        fontSize: '0.85rem',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '1rem',
                        fontWeight: '600'
                    }}>
                        <FaCheckCircle /> In Stock
                    </div>
                )}

                {/* Price */}
                <div style={{
                    fontSize: '1.6rem',
                    fontWeight: '700',
                    color: 'var(--primary)',
                    marginTop: 'auto',
                    marginBottom: '1rem'
                }}>
                    ₹{product.price.toLocaleString()}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link
                        to={`/products/${product.id}`}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '10px',
                            border: '2px solid var(--primary)',
                            background: 'white',
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            fontWeight: '600',
                            textAlign: 'center',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--secondary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                        }}
                    >
                        <FaEye /> View
                    </Link>
                    <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '10px',
                            border: 'none',
                            background: isOutOfStock ? '#cbd5e1' : 'var(--primary)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.3s ease',
                            opacity: isOutOfStock ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                            if (!isOutOfStock) {
                                e.currentTarget.style.background = 'var(--primary-dark)';
                                e.currentTarget.style.transform = 'scale(1.02)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isOutOfStock) {
                                e.currentTarget.style.background = 'var(--primary)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }
                        }}
                    >
                        <FaShoppingCart />
                    </button>
                </div>
            </div>
        </div>
    );
}
