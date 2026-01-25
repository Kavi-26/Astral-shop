// src/pages/ProductDetails.js
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "../context/CartContext";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ padding: '2rem' }}>Product not found.</div>;

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2rem', textDecoration: 'none', color: 'var(--text-light)' }}>
                <FaArrowLeft /> Back to Products
            </Link>

            <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', padding: '2rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <img
                        src={product.imageUrl || "https://placehold.co/500x400?text=Product+Image"}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>{product.name}</h1>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1.5rem', textTransform: 'uppercase', fontSize: '0.9rem' }}>{product.category}</p>

                    <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>₹{product.price.toLocaleString()}</h2>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3>Specifications:</h3>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '20px', lineHeight: '1.6' }}>
                            {/* Parse specs string as bullets if possible, else just show text */}
                            {product.specifications ? (
                                product.specifications.split(',').map((spec, i) => <li key={i}>{spec.trim()}</li>)
                            ) : <li>No specific details available.</li>}
                        </ul>
                    </div>

                    <p style={{ marginBottom: '2rem', color: product.stock > 0 ? 'green' : 'red' }}>
                        Status: <strong>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</strong> ({product.stock} units left)
                    </p>

                    <button
                        onClick={() => addToCart(product)}
                        className="btn-primary"
                        style={{ padding: '15px 30px', fontSize: '1.1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        disabled={product.stock <= 0}
                    >
                        <FaShoppingCart /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}