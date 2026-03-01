import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaEye, FaBox, FaCheckCircle, FaExclamationCircle, FaImage, FaShieldAlt } from "react-icons/fa";

export default function ProductCard({ product, viewMode = 'grid' }) {
    const { addToCart } = useCart();
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const hasVariants = product?.name === "Digital Electronic Voltage Stabilizer" || product?.id === "xq86sjSY5XUl3atipbPI";

    // Helper for image rendering
    const ProductImage = () => (
        <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {product.imageUrl ? (
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '16px',
                        transition: 'transform 0.5s ease',
                        opacity: isOutOfStock ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (viewMode === 'grid') e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        if (viewMode === 'grid') e.currentTarget.style.transform = 'scale(1)';
                    }}
                />
            ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#94a3b8'
                }}>
                    <FaImage size={24} style={{ opacity: 0.5 }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>No Image</span>
                </div>
            )}

            {/* Badges Overlay */}
            <div style={{
                position: 'absolute',
                top: '0.8rem',
                left: '0.8rem',
                right: '0.8rem',
                display: 'flex',
                justifyContent: 'space-between',
                pointerEvents: 'none',
                zIndex: 2
            }}>
                {isOutOfStock && (
                    <span style={{
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Out of Stock
                    </span>
                )}
                {!isOutOfStock && isLowStock && (
                    <span style={{
                        background: 'rgba(245, 158, 11, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        Low Stock: {product.stock}
                    </span>
                )}
            </div>
        </div>
    );

    if (viewMode === 'list') {
        return (
            <div style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f1f5f9',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(0, 86, 179, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#f1f5f9';
                }}>

                {/* Image */}
                <div style={{
                    width: '200px',
                    height: '150px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9'
                }}>
                    <ProductImage />
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary)',
                            background: 'rgba(0, 86, 179, 0.08)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {product.category}
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            color: '#16a34a',
                            background: '#dcfce7',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <FaShieldAlt /> 2 Yrs Warranty
                        </span>
                    </div>

                    <h3 style={{
                        fontSize: '1.25rem',
                        color: '#1e293b',
                        fontWeight: '700',
                        lineHeight: '1.4'
                    }}>
                        {product.name}
                    </h3>

                    {product.specifications && (
                        <p style={{
                            fontSize: '0.9rem',
                            color: '#64748b',
                            lineHeight: '1.6',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            maxWidth: '600px'
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
                    paddingLeft: '1.5rem',
                    borderLeft: '1px solid #f1f5f9',
                    minWidth: '200px'
                }}>
                    <div style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        color: '#0f172a'
                    }}>
                        {hasVariants ? <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: '600' }}>From </span> : null}₹{hasVariants ? '2,500' : product.price.toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                        <Link
                            to={`/products/${product.id}`}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                background: 'white',
                                color: '#64748b',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary)';
                                e.currentTarget.style.color = 'var(--primary)';
                                e.currentTarget.style.background = 'rgba(0, 86, 179, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.color = '#64748b';
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            <FaEye /> View
                        </Link>
                        {hasVariants ? (
                            <Link
                                to={`/products/${product.id}`}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textDecoration: 'none',
                                    gap: '6px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 6px rgba(0, 86, 179, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 86, 179, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 86, 179, 0.2)';
                                }}
                            >
                                Select Option
                            </Link>
                        ) : (
                            <button
                                onClick={() => addToCart(product)}
                                disabled={isOutOfStock}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: isOutOfStock ? '#e2e8f0' : 'var(--primary)',
                                    color: isOutOfStock ? '#94a3b8' : 'white',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: isOutOfStock ? 'none' : '0 4px 6px rgba(0, 86, 179, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isOutOfStock) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 86, 179, 0.3)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isOutOfStock) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 86, 179, 0.2)';
                                    }
                                }}
                            >
                                <FaShoppingCart /> Add
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(0, 86, 179, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#f1f5f9';
            }}>

            {/* Image Container */}
            <div style={{
                height: '220px',
                width: '100%',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <ProductImage />
            </div>

            {/* Content */}
            <div style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '1rem'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {product.category}
                        </span>
                        <span style={{
                            fontSize: '0.7rem',
                            color: '#16a34a',
                            background: '#dcfce7',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            <FaShieldAlt /> 2 Yrs Warranty
                        </span>
                    </div>
                    <h3 style={{
                        fontSize: '1.1rem',
                        marginTop: '4px',
                        color: '#1e293b',
                        fontWeight: '700',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '3.1rem'
                    }}>
                        {product.name}
                    </h3>
                </div>

                {/* Price & Stock */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        color: '#0f172a'
                    }}>
                        {hasVariants ? <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '600' }}>From </span> : null}₹{hasVariants ? '2,500' : product.price.toLocaleString()}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link
                        to={`/products/${product.id}`}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        title="View Details"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                            e.currentTarget.style.color = 'var(--primary)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                    >
                        <FaEye size={18} />
                    </Link>
                    {hasVariants ? (
                        <Link
                            to={`/products/${product.id}`}
                            style={{
                                flex: 1,
                                height: '40px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'var(--primary)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 6px rgba(0, 86, 179, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary-dark)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 86, 179, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--primary)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 86, 179, 0.2)';
                            }}
                        >
                            Select Option
                        </Link>
                    ) : (
                        <button
                            onClick={() => addToCart(product)}
                            disabled={isOutOfStock}
                            style={{
                                flex: 1,
                                height: '40px',
                                borderRadius: '10px',
                                border: 'none',
                                background: isOutOfStock ? '#e2e8f0' : 'var(--primary)',
                                color: isOutOfStock ? '#94a3b8' : 'white',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                boxShadow: isOutOfStock ? 'none' : '0 4px 6px rgba(0, 86, 179, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isOutOfStock) {
                                    e.currentTarget.style.background = 'var(--primary-dark)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 86, 179, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isOutOfStock) {
                                    e.currentTarget.style.background = 'var(--primary)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 86, 179, 0.2)';
                                }
                            }}
                        >
                            <FaShoppingCart size={16} />
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
