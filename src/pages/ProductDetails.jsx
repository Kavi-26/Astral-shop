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
            <div className="container" style={{ padding: '2rem 20px', maxWidth: '1100px' }}>
                {/* Back Button */}
                <Link
                    to="/products"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '1.5rem',
                        padding: '8px 18px',
                        background: 'white',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: 'var(--primary)',
                        fontWeight: '600',
                        border: '2px solid var(--primary)',
                        transition: 'all 0.3s ease',
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
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
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2rem',
                        padding: '2rem'
                    }}>
                        {/* Image Section */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'relative',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: '#f8fafc',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                aspectRatio: '1 / 1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            padding: '24px',
                                            display: 'block',
                                            opacity: isOutOfStock ? 0.6 : 1
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '10px',
                                        color: '#94a3b8'
                                    }}>
                                        <FaTags style={{ fontSize: '3rem' }} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>No Image Available</span>
                                    </div>
                                )}

                                {/* Stock Badge on Image */}
                                {isOutOfStock && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        padding: '8px 16px',
                                        borderRadius: '25px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
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
                                        padding: '8px 16px',
                                        borderRadius: '25px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
                                    }}>
                                        <FaBox /> Only {product.stock} Left
                                    </div>
                                )}

                                {/* Category Badge */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '1rem',
                                    left: '1rem',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    color: 'var(--primary)',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
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
                            {/* Top Badges Row */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: 'rgba(0, 86, 179, 0.08)',
                                    color: 'var(--primary)',
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {product.category}
                                </span>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: '#dcfce7',
                                    color: '#16a34a',
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.78rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    <FaShieldAlt /> 2 Years Warranty
                                </span>
                            </div>

                            {/* Product Name */}
                            <h1 style={{
                                fontSize: '2rem',
                                marginBottom: '1rem',
                                color: 'var(--text-main)',
                                fontWeight: '700',
                                lineHeight: '1.25'
                            }}>
                                {product.name}
                            </h1>

                            {/* Stock Status */}
                            <div style={{ marginBottom: '1rem' }}>
                                {!isOutOfStock ? (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: '#dcfce7',
                                        color: '#166534',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700'
                                    }}>
                                        <FaCheckCircle /> In Stock ({product.stock} units available)
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: '700'
                                    }}>
                                        <FaExclamationCircle /> Out of Stock
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div style={{
                                fontSize: '2.5rem',
                                color: 'var(--primary)',
                                fontWeight: '700',
                                marginBottom: '1.25rem',
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '0.4rem'
                            }}>
                                ₹{hasVariants ? stabilizerOptions[selectedVariant].price.toLocaleString() : product.price.toLocaleString()}
                                <span style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: '500'
                                }}>
                                    per unit
                                </span>
                            </div>

                            {/* Variants List */}
                            {hasVariants && (
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                                        Select Capacity & Application
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {stabilizerOptions.map((opt, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedVariant(idx)}
                                                style={{
                                                    padding: '12px 14px',
                                                    border: selectedVariant === idx ? '2px solid var(--primary)' : '1px solid #e2e8f0',
                                                    borderRadius: '10px',
                                                    background: selectedVariant === idx ? '#f0f4f8' : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.2s',
                                                    boxShadow: selectedVariant === idx ? '0 2px 8px rgba(0,86,179,0.1)' : 'none'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '18px', height: '18px', borderRadius: '50%',
                                                        border: selectedVariant === idx ? '5px solid var(--primary)' : '2px solid #cbd5e1',
                                                        transition: 'all 0.2s'
                                                    }}></div>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{opt.capacity}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.application}</span>
                                                    </div>
                                                </div>
                                                <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>₹{opt.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Specifications */}
                            {product.specifications && (
                                <div style={{
                                    marginBottom: '1.25rem',
                                    padding: '1rem 1.25rem',
                                    background: '#f8fafc',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <h3 style={{
                                        fontSize: '1.05rem',
                                        marginBottom: '0.5rem',
                                        color: 'var(--text-main)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <FaInfoCircle style={{ color: 'var(--primary)' }} />
                                        Specifications
                                    </h3>
                                    <ul style={{
                                        marginTop: '0.25rem',
                                        paddingLeft: '20px',
                                        lineHeight: '1.7',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem'
                                    }}>
                                        {product.specifications.split(',').map((spec, i) => (
                                            <li key={i} style={{ marginBottom: '0.25rem' }}>
                                                {spec.trim()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Quantity + Add to Cart Row */}
                            {!isOutOfStock && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px 0 0 10px',
                                                border: '2px solid #e2e8f0',
                                                borderRight: 'none',
                                                background: 'white',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                color: 'var(--primary)',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#f1f5f9';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'white';
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
                                                width: '50px',
                                                height: '40px',
                                                textAlign: 'center',
                                                fontSize: '1rem',
                                                fontWeight: '700',
                                                border: '2px solid #e2e8f0',
                                                borderLeft: 'none',
                                                borderRight: 'none',
                                                outline: 'none',
                                                borderRadius: '0'
                                            }}
                                        />
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '0 10px 10px 0',
                                                border: '2px solid #e2e8f0',
                                                borderLeft: 'none',
                                                background: 'white',
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                                                color: 'var(--primary)',
                                                opacity: quantity >= product.stock ? 0.5 : 1,
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (quantity < product.stock) {
                                                    e.currentTarget.style.background = '#f1f5f9';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'white';
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        style={{
                                            padding: '10px 28px',
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 6px rgba(0, 86, 179, 0.3)',
                                            height: '44px'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--primary-dark)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 86, 179, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'var(--primary)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 86, 179, 0.3)';
                                        }}
                                    >
                                        <FaShoppingCart />
                                        Add {quantity} to Cart
                                    </button>
                                </div>
                            )}

                            {isOutOfStock && (
                                <button
                                    disabled
                                    style={{
                                        padding: '14px 32px',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        background: '#cbd5e1',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'not-allowed',
                                        opacity: 0.6
                                    }}
                                >
                                    <FaShoppingCart /> Out of Stock
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
