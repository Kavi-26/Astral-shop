// src/admin/ManageProducts.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

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

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const newProduct = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };
            await addDoc(collection(db, "products"), newProduct);
            setShowForm(false);
            setFormData({ name: "", category: "Stabilizer", price: "", stock: "", specifications: "", imageUrl: "" });
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    }

    const categories = ["Stabilizer", "UPS", "CVT", "Servo Stabilizer", "Transformers"];

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient">Manage Products</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaPlus /> Add New Product
                </button>
            </div>

            {showForm && (
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Add Product</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input type="text" placeholder="Product Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />

                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <input type="number" placeholder="Price (₹)" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        <input type="number" placeholder="Stock Quantity" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />

                        <input type="text" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', gridColumn: 'span 2' }} />
                        <textarea placeholder="Specifications" value={formData.specifications} onChange={e => setFormData({ ...formData, specifications: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', gridColumn: 'span 2', minHeight: '80px' }} />

                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Item Save</button>
                    </form>
                </div>
            )}

            {/* Product List Table */}
            <div className="glass-card" style={{ padding: '1rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.05)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>Stock</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                                <td style={{ padding: '1rem' }}>{product.name}</td>
                                <td style={{ padding: '1rem' }}>{product.category}</td>
                                <td style={{ padding: '1rem' }}>₹{product.price}</td>
                                <td style={{ padding: '1rem', color: product.stock < 5 ? 'red' : 'inherit', fontWeight: product.stock < 5 ? 'bold' : 'normal' }}>
                                    {product.stock} {product.stock < 5 && "(Low!)"}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => handleDelete(product.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
