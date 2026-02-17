import { useParams } from 'react-router-dom'
import useStore from '../store/store'
import ProductCard from '../components/ProductCard'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useState, useMemo } from 'react'
import './CatalogPage.css'

export default function CatalogPage() {
    const { category } = useParams()
    const products = useStore((s) => s.products)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('name')
    const [activeCategory, setActiveCategory] = useState(category || 'all')

    // Sync URL param
    useMemo(() => {
        if (category) setActiveCategory(category)
        else setActiveCategory('all')
    }, [category])

    const categories = ['all', 'rings', 'necklaces', 'earrings']

    const filtered = useMemo(() => {
        let result = products

        if (activeCategory !== 'all') {
            result = result.filter((p) => p.category === activeCategory)
        }

        if (search) {
            const q = search.toLowerCase()
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
            )
        }

        switch (sort) {
            case 'price-asc':
                result = [...result].sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                result = [...result].sort((a, b) => b.price - a.price)
                break
            case 'name':
            default:
                result = [...result].sort((a, b) => a.name.localeCompare(b.name))
                break
        }

        return result
    }, [products, activeCategory, search, sort])

    return (
        <div className="catalog" style={{ paddingTop: 'var(--navbar-height)' }}>
            <div className="container">
                {/* Header */}
                <div className="catalog__header animate-fade-in-up">
                    <div>
                        <p className="section-label">Our Collection</p>
                        <h1 className="section-title">
                            {activeCategory === 'all'
                                ? 'All Jewelry'
                                : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                        </h1>
                    </div>
                    <p className="catalog__count">{filtered.length} pieces</p>
                </div>

                {/* Filters */}
                <div className="catalog__filters animate-fade-in-up">
                    <div className="catalog__tabs">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`catalog__tab ${activeCategory === cat ? 'catalog__tab--active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="catalog__controls">
                        <div className="catalog__search">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search jewelry..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="catalog__sort">
                            <SlidersHorizontal size={14} />
                            <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <option value="name">Sort by Name</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="catalog__grid stagger">
                        {filtered.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Search size={48} />
                        <h3>No jewelry found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
