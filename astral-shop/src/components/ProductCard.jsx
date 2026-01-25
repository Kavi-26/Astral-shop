// src/components/ProductCard.js
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <img
                src={product.imageUrl || "https://placehold.co/300x200?text=Product"}
                alt={product.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }}
            />

            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', flex: 1 }}>{product.name}</h3>
            <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{product.category}</p>

            <div className="flex-between" style={{ marginTop: 'auto' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{product.price.toLocaleString()}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/products/${product.id}`} className="btn-secondary" style={{ padding: '8px', textDecoration: 'none' }}>View</Link>
                    <button
                        onClick={() => addToCart(product)}
                        className="btn-primary"
                        style={{ padding: '8px' }}
                        disabled={product.stock <= 0}
                    >
                        <FaShoppingCart />
                    </button>
                </div>
            </div>
            {product.stock <= 0 && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>Out of Stock</p>}
        </div>
    );
}
