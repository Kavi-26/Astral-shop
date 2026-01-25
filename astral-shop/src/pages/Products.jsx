// src/pages/Products.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [priceRange, setPriceRange] = useState("All");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(items);
                setFilteredProducts(items);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        // Search Filter
        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Category Filter
        if (category !== "All") {
            result = result.filter(p => p.category === category);
        }

        // Price Filter
        if (priceRange !== "All") {
            switch (priceRange) {
                case "under10k": result = result.filter(p => p.price < 10000); break;
                case "10k-50k": result = result.filter(p => p.price >= 10000 && p.price <= 50000); break;
                case "above50k": result = result.filter(p => p.price > 50000); break;
                default: break;
            }
        }

        setFilteredProducts(result);
    }, [search, category, priceRange, products]);

    const categories = ["All", "Stabilizer", "UPS", "CVT", "Servo Stabilizer", "Transformers"];

    return (
        <div className="container" style={{ padding: '2rem 20px' }}>
            <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Product Catalog</h1>

            {/* Search & Filters */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '10px', opacity: 0.5 }} />
                    <input
                        type="text"
                        placeholder="Search product..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <select
                        value={priceRange}
                        onChange={(e) => setPriceRange(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    >
                        <option value="All">All Prices</option>
                        <option value="under10k">Under ₹10,000</option>
                        <option value="10k-50k">₹10,000 - ₹50,000</option>
                        <option value="above50k">Above ₹50,000</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading products...</p>
            ) : filteredProducts.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center', opacity: 0.6 }}>No products found matching your criteria.</p>
            )}
        </div>
    );
}
