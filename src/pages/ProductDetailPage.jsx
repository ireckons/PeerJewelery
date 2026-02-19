import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import {
    ShoppingBag, Heart, Sparkles, ArrowLeft, Package,
    Check, Truck, Shield
} from 'lucide-react'
import useStore from '../store/store'
import ProductCard from '../components/ProductCard'

import './ProductDetailPage.css'

export default function ProductDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const products = useStore((s) => s.products)
    const addToCart = useStore((s) => s.addToCart)
    const toggleWishlist = useStore((s) => s.toggleWishlist)
    const isInWishlist = useStore((s) => s.isInWishlist)
    const showToast = useStore((s) => s.showToast)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const product = products.find((p) => p.id === id)
    const related = products.filter((p) => p.id !== id && p.category === product?.category).slice(0, 4)
    const wishlisted = product ? isInWishlist(product.id) : false

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    if (!product) {
        return (
            <div className="pdp" style={{ paddingTop: 'var(--navbar-height)' }}>
                <div className="container empty-state">
                    <h3>Product not found</h3>
                    <Link to="/catalog" className="btn btn-outline" style={{ marginTop: '1rem' }}>
                        Back to Catalog
                    </Link>
                </div>
            </div>
        )
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
        showToast(`${product.name} added to cart`)
    }

    return (
        <div className="pdp" style={{ paddingTop: 'var(--navbar-height)' }}>
            <div className="container">
                {/* Breadcrumb */}
                <nav className="pdp__breadcrumb animate-fade-in">
                    <Link to="/catalog">Collections</Link>
                    <span>/</span>
                    <Link to={`/catalog/${product.category}`}>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </Link>
                    <span>/</span>
                    <span className="pdp__breadcrumb-current">{product.name}</span>
                </nav>

                <div className="pdp__main">
                    {/* Image Gallery */}
                    <div className="pdp__gallery animate-fade-in-up">
                        <div className="pdp__main-image">
                            <img
                                src={product.images[selectedImage || 0]}
                                alt={`${product.name} view ${(selectedImage || 0) + 1}`}
                                className="pdp__slide-img"
                            />
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        className="pdp__nav-btn pdp__nav-btn--prev"
                                        onClick={() => setSelectedImage((prev) => (prev || 0) > 0 ? (prev || 0) - 1 : product.images.length - 1)}
                                    >‹</button>
                                    <button
                                        className="pdp__nav-btn pdp__nav-btn--next"
                                        onClick={() => setSelectedImage((prev) => (prev || 0) < product.images.length - 1 ? (prev || 0) + 1 : 0)}
                                    >›</button>
                                </>
                            )}
                        </div>

                        {product.images.length > 1 && (
                            <div className="pdp__thumbs">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`pdp__thumb-btn ${(selectedImage || 0) === i ? 'pdp__thumb-btn--active' : ''}`}
                                        onClick={() => setSelectedImage(i)}
                                    >
                                        <img src={img} alt={`Thumb ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="pdp__info animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="pdp__category-tag">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </div>

                        <h1 className="pdp__name">{product.name}</h1>

                        <div className="pdp__pricing">
                            <span className="pdp__price">${product.price.toLocaleString()}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="pdp__original-price">
                                        ${product.originalPrice.toLocaleString()}
                                    </span>
                                    <span className="pdp__discount">-{product.discount}%</span>
                                </>
                            )}
                        </div>

                        <p className="pdp__description">{product.description}</p>

                        <div className="pdp__meta">
                            <div className="pdp__meta-item">
                                <Package size={16} />
                                <span>
                                    {product.stock > 0
                                        ? `${product.stock} in stock`
                                        : 'Out of stock'}
                                </span>
                            </div>
                            <div className="pdp__meta-item">
                                <Truck size={16} />
                                <span>Free shipping</span>
                            </div>
                            <div className="pdp__meta-item">
                                <Shield size={16} />
                                <span>Lifetime warranty</span>
                            </div>
                        </div>

                        {/* Quantity & Add to cart */}
                        <div className="pdp__actions">
                            <div className="pdp__quantity">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="pdp__qty-btn"
                                >
                                    −
                                </button>
                                <span className="pdp__qty-value">{quantity}</span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                                    className="pdp__qty-btn"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="btn btn-primary btn-lg pdp__add-to-cart"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <ShoppingBag size={18} />
                                Add to Cart
                            </button>
                            <button
                                className={`btn btn-outline btn-lg pdp__wishlist-btn ${wishlisted ? 'pdp__wishlist-btn--active' : ''}`}
                                onClick={() => {
                                    toggleWishlist(product)
                                    showToast(wishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`)
                                }}
                                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Try-On Button */}
                        {(product.category === 'rings' || product.category === 'necklaces' || product.category === 'earrings') && (
                            <button
                                className="btn btn-outline btn-lg pdp__try-on"
                                onClick={() => navigate(`/try-on/${product.id}`)}
                            >
                                <Sparkles size={18} />
                                Try Preview — AI Virtual Try-On
                            </button>
                        )}

                        {/* Perks */}
                        <div className="pdp__perks">
                            <div className="pdp__perk">
                                <Check size={14} />
                                <span>GIA Certified Diamonds</span>
                            </div>
                            <div className="pdp__perk">
                                <Check size={14} />
                                <span>30-Day Returns</span>
                            </div>
                            <div className="pdp__perk">
                                <Check size={14} />
                                <span>Ethically Sourced</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="pdp__related section">
                        <div className="section-header">
                            <p className="section-label">You May Also Like</p>
                            <h2 className="section-title">Similar Pieces</h2>
                        </div>
                        <div className="pdp__related-grid stagger">
                            {related.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
