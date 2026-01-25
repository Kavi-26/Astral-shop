// src/pages/Compare.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function Compare() {
    const [products, setProducts] = useState([]);
    const [selectedProduct1, setSelectedProduct1] = useState("");
    const [selectedProduct2, setSelectedProduct2] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            const snap = await getDocs(collection(db, "products"));
            setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
        fetchProducts();
    }, []);

    const p1 = products.find(p => p.id === selectedProduct1);
    const p2 = products.find(p => p.id === selectedProduct2);

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Product Comparison</h1>

            <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    <select onChange={(e) => setSelectedProduct1(e.target.value)} style={{ padding: '10px', flex: 1, borderRadius: '8px' }}>
                        <option value="">Select Product 1</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select onChange={(e) => setSelectedProduct2(e.target.value)} style={{ padding: '10px', flex: 1, borderRadius: '8px' }}>
                        <option value="">Select Product 2</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.05)' }}>
                            <th style={{ padding: '1rem', width: '20%' }}>Feature</th>
                            <th style={{ padding: '1rem', width: '40%' }}>{p1 ? p1.name : "Product 1"}</th>
                            <th style={{ padding: '1rem', width: '40%' }}>{p2 ? p2.name : "Product 2"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Image</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                {p1 && <img src={p1.imageUrl} alt={p1.name} style={{ width: '100px', borderRadius: '8px' }} />}
                            </td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                {p2 && <img src={p2.imageUrl} alt={p2.name} style={{ width: '100px', borderRadius: '8px' }} />}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Price</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', color: 'var(--primary)', fontWeight: 'bold' }}>
                                {p1 ? `₹${p1.price}` : "-"}
                            </td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', color: 'var(--primary)', fontWeight: 'bold' }}>
                                {p2 ? `₹${p2.price}` : "-"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Category</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{p1 ? p1.category : "-"}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{p2 ? p2.category : "-"}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Stock</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                {p1 ? (p1.stock > 0 ? <span style={{ color: 'green' }}><FaCheck /> In Stock</span> : <span style={{ color: 'red' }}><FaTimes /> Out</span>) : "-"}
                            </td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                {p2 ? (p2.stock > 0 ? <span style={{ color: 'green' }}><FaCheck /> In Stock</span> : <span style={{ color: 'red' }}><FaTimes /> Out</span>) : "-"}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Specs</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>{p1 ? p1.specifications : "-"}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>{p2 ? p2.specifications : "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
