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
                    padding: '0.5rem',
                    borderRadius: '16px',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    border: '1px solid #f0f0f0',
                    maxWidth: '800px',
                    margin: '0 auto 2.5rem'
                }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <FaSearch style={{
                            position: 'absolute',
                            left: '20px',
                            color: search ? 'var(--primary)' : '#94a3b8',
                            fontSize: '1.2rem',
                            transition: 'color 0.3s ease',
                            zIndex: 1
                        }} />
                        <div style={{ position: 'relative', width: '100%' }}>
                            <input
                                id="search-input"
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 55px',
                                    borderRadius: '12px',
                                    border: '2px solid transparent',
                                    fontSize: '1.1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    background: '#f8fafc',
                                    color: '#1e293b',
                                    fontWeight: '500'
                                }}
                                onFocus={(e) => {
                                    e.target.style.background = 'white';
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(0, 86, 179, 0.1)';
                                }}
                                onBlur={(e) => {
                                    if (!search) e.target.style.background = '#f8fafc';
                                    e.target.style.borderColor = 'transparent';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <label
                                htmlFor="search-input"
                                style={{
                                    position: 'absolute',
                                    left: '55px',
                                    top: search ? '-10px' : '50%',
                                    transform: search ? 'scale(0.85) translateY(0)' : 'translateY(-50%)',
                                    background: search ? 'white' : 'transparent',
                                    padding: '0 6px',
                                    color: search ? 'var(--primary)' : '#94a3b8',
                                    fontSize: '1rem',
                                    pointerEvents: 'none',
                                    transition: 'all 0.25s ease',
                                    fontWeight: search ? '600' : '400',
                                    borderRadius: '4px'
                                }}
                            >
                                Search for products...
                            </label>
                        </div>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                style={{
                                    position: 'absolute',
                                    right: '15px',
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#64748b',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#e2e8f0';
                                    e.currentTarget.style.color = '#ef4444';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f1f5f9';
                                    e.currentTarget.style.color = '#64748b';
                                }}
                            >
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth > 968 ? '280px 1fr' : '1fr',
                    gap: '2.5rem',
                    position: 'relative',
                    alignItems: 'start'
                }}>
                    {/* Desktop Sidebar */}
                    {window.innerWidth > 968 && (
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <FilterSidebar />
                        </div>
                    )}

                    {/* Products Section */}
                    <div>
                        {/* Toolbar */}
                        <div style={{
                            marginBottom: '2rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        }}>
                            {/* Results Count */}
                            <div style={{
                                fontSize: '1rem',
                                color: 'var(--text-muted)',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '2px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '700'
                                }}>
                                    {filteredProducts.length}
                                </span>
                                Products Found
                            </div>

                            {/* Right Side Controls */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                {/* Sort Dropdown */}
                                <div style={{ position: 'relative' }}>
                                    <FaSortAmountDown style={{
                                        position: 'absolute',
                                        left: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--primary)',
                                        pointerEvents: 'none'
                                    }} />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{
                                            padding: '10px 16px 10px 36px',
                                            borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '0.9rem',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            fontWeight: '600',
                                            color: 'var(--text-main)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                            appearance: 'none',
                                            minWidth: '180px'
                                        }}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="priceLowToHigh">Price: Low to High</option>
                                        <option value="priceHighToLow">Price: High to Low</option>
                                        <option value="nameAZ">Name: A to Z</option>
                                        <option value="nameZA">Name: Z to A</option>
                                    </select>
                                    <FaChevronRight style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%) rotate(90deg)',
                                        fontSize: '0.7rem',
                                        color: '#94a3b8',
                                        pointerEvents: 'none'
                                    }} />
                                </div>

                                {/* View Mode Toggle */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.25rem',
                                    background: 'white',
                                    padding: '4px',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: viewMode === 'grid' ? '#eff6ff' : 'transparent',
                                            color: viewMode === 'grid' ? 'var(--primary)' : '#94a3b8',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex'
                                        }}
                                    >
                                        <FaTh size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: viewMode === 'list' ? '#eff6ff' : 'transparent',
                                            color: viewMode === 'list' ? 'var(--primary)' : '#94a3b8',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex'
                                        }}
                                    >
                                        <FaList size={16} />
                                    </button>
                                </div>

                                {/* Mobile Filter Button */}
                                {window.innerWidth <= 968 && (
                                    <button
                                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 20px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            boxShadow: '0 4px 12px rgba(0, 86, 179, 0.2)'
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
                                display: 'grid',
                                gridTemplateColumns: viewMode === 'grid'
                                    ? 'repeat(auto-fill, minmax(280px, 1fr))'
                                    : '1fr',
                                gap: '1.5rem'
                            }}>
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '1px solid #f1f5f9',
                                        overflow: 'hidden',
                                        height: viewMode === 'grid' ? '400px' : '200px'
                                    }}>
                                        <div style={{
                                            height: viewMode === 'grid' ? '240px' : '100%',
                                            width: viewMode === 'grid' ? '100%' : '240px',
                                            background: '#f1f5f9',
                                            animation: 'shimmer 1.5s infinite linear',
                                            backgroundSize: '200% 100%',
                                            backgroundImage: 'linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)'
                                        }}></div>
                                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                                            <div style={{ height: '24px', background: '#f1f5f9', borderRadius: '4px', width: '80%' }}></div>
                                            <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '4px', width: '40%' }}></div>
                                            <div style={{ marginTop: 'auto', height: '32px', background: '#f1f5f9', borderRadius: '4px', width: '30%' }}></div>
                                        </div>
                                    </div>
                                ))}
                                <style>{`
                                    @keyframes shimmer {
                                        0% { background-position: -200% 0; }
                                        100% { background-position: 200% 0; }
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
                                padding: '5rem 2rem',
                                background: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1.5rem',
                                    color: '#94a3b8',
                                    fontSize: '3rem'
                                }}>
                                    <FaSearch />
                                </div>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--text-main)',
                                    marginBottom: '0.5rem',
                                    fontWeight: '700'
                                }}>
                                    No products found
                                </h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px', lineHeight: '1.6' }}>
                                    We couldn't find any products matching your search. Try different keywords or filters.
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAllFilters}
                                        style={{
                                            padding: '12px 28px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(0, 86, 179, 0.25)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 86, 179, 0.35)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 86, 179, 0.25)';
                                        }}
                                    >
                                        <FaTimes /> Clear All Filters
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
