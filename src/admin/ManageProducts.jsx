// src/admin/ManageProducts.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaTrash, FaEdit, FaPlus, FaTimes, FaSave, FaBoxOpen } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ name: "", category: "Stabilizer", price: "", stock: "", specifications: "", imageUrl: "" });

    useEffect(() => { fetchProducts(); }, []);

    async function fetchProducts() {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) { console.error("Error fetching products:", error); }
        finally { setLoading(false); }
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteDoc(doc(db, "products", id));
            fetchProducts();
        }
    }

    function handleEdit(product) {
        setFormData({ name: product.name || "", category: product.category || "Stabilizer", price: product.price || "", stock: product.stock || "", specifications: product.specifications || "", imageUrl: product.imageUrl || "" });
        setEditId(product.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const productData = { ...formData, price: Number(formData.price), stock: Number(formData.stock) };
            if (editId) { await updateDoc(doc(db, "products", editId), productData); setEditId(null); }
            else { await addDoc(collection(db, "products"), productData); }
            setShowForm(false);
            setFormData({ name: "", category: "Stabilizer", price: "", stock: "", specifications: "", imageUrl: "" });
            fetchProducts();
        } catch (error) { console.error("Error saving product:", error); }
    }

    const categories = ["Stabilizer", "UPS", "CVT", "Servo Stabilizer", "Transformers"];

    const inputStyle = {
        width: '100%', padding: '13px 16px', borderRadius: '12px',
        border: '2px solid #e2e8f0', fontSize: '0.95rem', outline: 'none',
        transition: 'all 0.3s ease', background: '#f8fafc', fontWeight: '500', fontFamily: 'inherit'
    };

    const handleFocus = (e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px rgba(0,86,179,0.1)'; e.target.style.background = 'white'; };
    const handleBlur = (e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f8fafc' }}>
            <AdminSidebar />

            <div style={{ flex: 1, padding: '2rem 3rem' }}>
                <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.3rem' }}>Manage Products</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{products.length} products total</p>
                    </div>
                    <button onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) { setEditId(null); setFormData({ name: "", category: "Stabilizer", price: "", stock: "", specifications: "", imageUrl: "" }); }
                    }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {showForm ? <><FaTimes /> Close Form</> : <><FaPlus /> Add Product</>}
                    </button>
                </div>

                {showForm && (
                    <div className="animate-zoom-in" style={{
                        background: 'white', padding: '2.5rem', marginBottom: '2.5rem',
                        borderRadius: '20px', border: '1px solid #f1f5f9',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontSize: '1.3rem' }}>
                            {editId ? "Edit Product" : "Add New Product"}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Product Name</label>
                                <input type="text" placeholder="Ex: Vertical Servo Stabilizer" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Price (₹)</label>
                                <input type="number" placeholder="0" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Stock Quantity</label>
                                <input type="number" placeholder="0" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Image URL</label>
                                <input type="text" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Specifications</label>
                                <textarea placeholder="Product details..." value={formData.specifications} onChange={e => setFormData({ ...formData, specifications: e.target.value })} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} onFocus={handleFocus} onBlur={handleBlur} />
                            </div>
                            <button type="submit" className="btn-primary" style={{
                                gridColumn: 'span 2', marginTop: '0.5rem', padding: '14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem'
                            }}>
                                <FaSave /> {editId ? "Update Product" : "Save Product"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Product Table */}
                <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product</th>
                                    <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                                    <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                                    <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock</th>
                                    <th style={{ padding: '1rem 1.2rem', fontWeight: '700', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}>
                                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#94a3b8', fontSize: '1.5rem' }}>
                                                <FaBoxOpen />
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem' }}>No products found</div>
                                            <button onClick={() => setShowForm(true)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                                                + Add your first product
                                            </button>
                                        </td>
                                    </tr>
                                ) : products.map((product, index) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fafbfc'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ padding: '1rem 1.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    {product.imageUrl ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} /> : <FaBoxOpen style={{ color: '#cbd5e1' }} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{product.name || <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Unnamed</span>}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{product.id.slice(0, 6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.2rem' }}>
                                            <span style={{ background: '#eff6ff', padding: '5px 14px', borderRadius: '20px', fontSize: '0.83rem', color: '#1d4ed8', fontWeight: '600' }}>{product.category}</span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
                                            {product?.name === "Digital Electronic Voltage Stabilizer" || product?.id === "xq86sjSY5XUl3atipbPI" ? (
                                                <><span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>From</span><br />₹2,500</>
                                            ) : (
                                                `₹${product.price !== undefined && product.price !== null && product.price !== "" ? Number(product.price).toLocaleString() : "0"}`
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                padding: '5px 14px', borderRadius: '20px',
                                                background: product.stock < 5 ? '#fef2f2' : '#f0fdf4',
                                                border: `1px solid ${product.stock < 5 ? '#fecaca' : '#bbf7d0'}`
                                            }}>
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: product.stock < 5 ? '#ef4444' : '#16a34a' }}></span>
                                                <span style={{ fontWeight: '600', fontSize: '0.85rem', color: product.stock < 5 ? '#b91c1c' : '#15803d' }}>{product.stock}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                                <button onClick={() => handleEdit(product)} title="Edit" style={{
                                                    color: '#2563eb', border: '1px solid #dbeafe', background: 'white',
                                                    cursor: 'pointer', width: '36px', height: '36px', borderRadius: '10px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
                                                ><FaEdit size={14} /></button>
                                                <button onClick={() => handleDelete(product.id)} title="Delete" style={{
                                                    color: '#ef4444', border: '1px solid #fee2e2', background: 'white',
                                                    cursor: 'pointer', width: '36px', height: '36px', borderRadius: '10px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'scale(1)'; }}
                                                ><FaTrash size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
