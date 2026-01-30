// src/admin/ManageProducts.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [editId, setEditId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "", category: "Stabilizer", price: "", stock: "", specifications: "", imageUrl: ""
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteDoc(doc(db, "products", id));
            fetchProducts();
        }
    }

    function handleEdit(product) {
        setFormData({
            name: product.name || "",
            category: product.category || "Stabilizer",
            price: product.price || "",
            stock: product.stock || "",
            specifications: product.specifications || "",
            imageUrl: product.imageUrl || ""
        });
        setEditId(product.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            if (editId) {
                // Update existing product
                await updateDoc(doc(db, "products", editId), productData);
                setEditId(null);
            } else {
                // Add new product
                await addDoc(collection(db, "products"), productData);
            }

            setShowForm(false);
            setFormData({ name: "", category: "Stabilizer", price: "", stock: "", specifications: "", imageUrl: "" });
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
        }
    }

    const categories = ["Stabilizer", "UPS", "CVT", "Servo Stabilizer", "Transformers"];

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 20px' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient">Manage Products</h1>
                <button onClick={() => {
                    setShowForm(!showForm);
                    if (!showForm) {
                        setEditId(null);
                        setFormData({ name: "", category: "Stabilizer", price: "", stock: "", specifications: "", imageUrl: "" });
                    }
                }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaPlus /> {showForm ? "Close Form" : "Add New Product"}
                </button>
            </div>

            {showForm && (
                <div className="glass-card animate-zoom-in" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>{editId ? "Edit Product" : "Add New Product"}</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Product Name</label>
                            <input type="text" placeholder="Ex: Vertical Servo Stabilizer" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Price (₹)</label>
                            <input type="number" placeholder="0" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Stock Quantity</label>
                            <input type="number" placeholder="0" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Image URL</label>
                            <input type="text" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Specifications</label>
                            <textarea placeholder="Product details..." value={formData.specifications} onChange={e => setFormData({ ...formData, specifications: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '100px' }} />
                        </div>

                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>{editId ? "Update Product" : "Save Product"}</button>
                    </form>
                </div>
            )}

            {/* Product List Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'var(--secondary)', color: 'var(--text-main)' }}>
                                <th style={{ padding: '1.2rem', fontWeight: '600', textAlign: 'left' }}>Product Details</th>
                                <th style={{ padding: '1.2rem', fontWeight: '600', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '1.2rem', fontWeight: '600', textAlign: 'center' }}>Price</th>
                                <th style={{ padding: '1.2rem', fontWeight: '600', textAlign: 'center' }}>Stock Status</th>
                                <th style={{ padding: '1.2rem', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>No products found.</div>
                                        <button onClick={() => setShowForm(true)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                                            Add your first product
                                        </button>
                                    </td>
                                </tr>
                            ) : products.map((product, index) => (
                                <tr key={product.id} style={{ borderBottom: index !== products.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '50px', height: '50px', borderRadius: '8px',
                                                overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {product.imageUrl ? (
                                                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>No Img</span>
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-main)' }}>
                                                    {product.name || <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Unnamed Product</span>}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                    ID: {product.id.slice(0, 6)}...
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                                        <span style={{
                                            background: '#eff6ff', padding: '6px 12px',
                                            borderRadius: '20px', fontSize: '0.85rem', color: '#1d4ed8', fontWeight: '500'
                                        }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-main)' }}>
                                            ₹{product.price !== undefined && product.price !== null && product.price !== ""
                                                ? Number(product.price).toLocaleString()
                                                : "0"}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: product.stock < 5 ? '#fef2f2' : '#f0fdf4' }}>
                                            <span style={{
                                                width: '6px', height: '6px', borderRadius: '50%',
                                                background: product.stock < 5 ? '#ef4444' : '#16a34a'
                                            }}></span>
                                            <span style={{
                                                fontWeight: '600', fontSize: '0.9rem',
                                                color: product.stock < 5 ? '#b91c1c' : '#15803d'
                                            }}>
                                                {product.stock} Units
                                            </span>
                                        </div>
                                        {product.stock < 5 && <div style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '4px' }}>Low Stock!</div>}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="btn-icon"
                                                style={{
                                                    color: '#2563eb', border: '1px solid #dbeafe',
                                                    background: 'white', cursor: 'pointer',
                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}
                                                title="Edit Product"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="btn-icon"
                                                style={{
                                                    color: '#ef4444', border: '1px solid #fee2e2',
                                                    background: 'white', cursor: 'pointer',
                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                }}
                                                title="Delete Product"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
