// src/pages/Products.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import { FaSearch, FaFilter, FaTh, FaList, FaTags, FaSortAmountDown, FaHome, FaChevronRight, FaTimes } from "react-icons/fa";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [priceRange, setPriceRange] = useState("All");
    const [sortBy, setSortBy] = useState("featured");
    const [stockFilter, setStockFilter] = useState("all");

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
            result = result.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
            );
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

        // Stock Filter
        if (stockFilter === "inStock") {
            result = result.filter(p => p.stock > 0);
        } else if (stockFilter === "outOfStock") {
            result = result.filter(p => p.stock <= 0);
        }

        // Sorting
        switch (sortBy) {
            case "priceLowToHigh":
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case "priceHighToLow":
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case "nameAZ":
                result = [...result].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "nameZA":
                result = [...result].sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [search, category, priceRange, sortBy, stockFilter, products]);

    const categories = ["All", "Stabilizer", "UPS", "CVT", "Servo Stabilizer", "Transformers"];

    const clearAllFilters = () => {
        setSearch("");
        setCategory("All");
        setPriceRange("All");
        setStockFilter("all");
        setSortBy("featured");
    };

    const hasActiveFilters = search || category !== "All" || priceRange !== "All" || stockFilter !== "all";

    // Sidebar Filters Component
    const FilterSidebar = () => (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            position: 'sticky',
            top: '100px'
        }}>
            {/* Filter Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid #e2e8f0'
            }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <FaFilter /> Filters
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-main)'
                }}>
                    Category
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {categories.map(cat => (
                        <label
                            key={cat}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '6px',
                                transition: 'background 0.2s',
                                background: category === cat ? 'var(--secondary)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (category !== cat) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                                if (category !== cat) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={category === cat}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                            />
                            <span style={{
                                fontSize: '0.95rem',
                                color: category === cat ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: category === cat ? '600' : '400'
                            }}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-main)'
                }}>
                    Price Range
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { value: "All", label: "All Prices" },
                        { value: "under10k", label: "Under ₹10,000" },
                        { value: "10k-50k", label: "₹10,000 - ₹50,000" },
                        { value: "above50k", label: "Above ₹50,000" }
                    ].map(option => (
                        <label
                            key={option.value}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '6px',
                                transition: 'background 0.2s',
                                background: priceRange === option.value ? 'var(--secondary)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (priceRange !== option.value) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                                if (priceRange !== option.value) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <input
                                type="radio"
                                name="priceRange"
                                value={option.value}
                                checked={priceRange === option.value}
                                onChange={(e) => setPriceRange(e.target.value)}
                                style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                            />
                            <span style={{
                                fontSize: '0.95rem',
                                color: priceRange === option.value ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: priceRange === option.value ? '600' : '400'
                            }}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Stock Availability */}
            <div>
                <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'var(--text-main)'
                }}>
                    Availability
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { value: "all", label: "All Products" },
                        { value: "inStock", label: "In Stock" },
                        { value: "outOfStock", label: "Out of Stock" }
                    ].map(option => (
                        <label
                            key={option.value}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '6px',
                                transition: 'background 0.2s',
                                background: stockFilter === option.value ? 'var(--secondary)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (stockFilter !== option.value) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                                if (stockFilter !== option.value) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <input
                                type="radio"
                                name="stockFilter"
                                value={option.value}
                                checked={stockFilter === option.value}
                                onChange={(e) => setStockFilter(e.target.value)}
                                style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                            />
                            <span style={{
                                fontSize: '0.95rem',
                                color: stockFilter === option.value ? 'var(--primary)' : 'var(--text-main)',
                                fontWeight: stockFilter === option.value ? '600' : '400'
                            }}>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
            <div className="container" style={{ padding: '2rem 20px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Breadcrumb */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)'
                }}>
                    <FaHome />
                    <span>Home</span>
                    <FaChevronRight style={{ fontSize: '0.7rem' }} />
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Products</span>
                </div>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        marginBottom: '0.5rem'
                    }}>
                        All Products
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-muted)'
                    }}>
                        Browse our complete range of electrical equipment
                    </p>
                </div>

                {/* Search Bar */}
                <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ position: 'relative' }}>
                        <FaSearch style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            left: '16px',
                            color: 'var(--text-muted)',
                            fontSize: '1.1rem'
                        }} />
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px 16px 14px 50px',
                                borderRadius: '10px',
                                border: '2px solid #e2e8f0',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 768 ? '280px 1fr' : '1fr',
                    gap: '2rem',
                    position: 'relative'
                }}>
                    {/* Desktop Sidebar */}
                    {window.innerWidth > 768 && (
                        <div>
                            <FilterSidebar />
                        </div>
                    )}

                    {/* Products Section */}
                    <div>
                        {/* Toolbar */}
                        <div style={{
                            background: 'white',
                            padding: '1rem 1.5rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0'
                        }}>
                            {/* Results Count */}
                            <div style={{
                                fontSize: '0.95rem',
                                color: 'var(--text-main)',
                                fontWeight: '500'
                            }}>
                                Showing <strong style={{ color: 'var(--primary)' }}>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
                            </div>

                            {/* Right Side Controls */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                {/* Sort Dropdown */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaSortAmountDown style={{ color: 'var(--text-muted)' }} />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '2px solid #e2e8f0',
                                            fontSize: '0.9rem',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="priceLowToHigh">Price: Low to High</option>
                                        <option value="priceHighToLow">Price: High to Low</option>
                                        <option value="nameAZ">Name: A to Z</option>
                                        <option value="nameZA">Name: Z to A</option>
                                    </select>
                                </div>

                                {/* View Mode Toggle */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    background: '#f8fafc',
                                    padding: '4px',
                                    borderRadius: '8px'
                                }}>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                                            color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <FaTh />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                                            color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <FaList />
                                    </button>
                                </div>

                                {/* Mobile Filter Button */}
                                {window.innerWidth <= 768 && (
                                    <button
                                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: '2px solid var(--primary)',
                                            background: 'white',
                                            color: 'var(--primary)',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <FaFilter /> Filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Products Grid/List */}
                        {loading ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '4rem',
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                                    Loading products...
                                </p>
                                <style>{`
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                `}</style>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: viewMode === 'grid'
                                    ? 'repeat(auto-fill, minmax(280px, 1fr))'
                                    : '1fr',
                                gap: '1.5rem'
                            }}>
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '4rem',
                                background: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: '1rem',
                                    opacity: 0.3
                                }}>
                                    🔍
                                </div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--text-main)',
                                    marginBottom: '0.5rem'
                                }}>
                                    No products found
                                </h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    Try adjusting your search or filter criteria
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAllFilters}
                                        style={{
                                            padding: '12px 24px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'flex-end'
                }}
                    onClick={() => setShowMobileFilters(false)}
                >
                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxHeight: '80vh',
                        borderRadius: '20px 20px 0 0',
                        padding: '1.5rem',
                        overflowY: 'auto'
                    }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Filters</h3>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <FilterSidebar />
                        <button
                            onClick={() => setShowMobileFilters(false)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                marginTop: '1.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
