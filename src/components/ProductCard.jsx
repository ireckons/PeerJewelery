import { Link } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'
import useStore from '../store/store'
import './ProductCard.css'

export default function ProductCard({ product }) {
    const addToCart = useStore((s) => s.addToCart)
    const toggleWishlist = useStore((s) => s.toggleWishlist)
    const isInWishlist = useStore((s) => s.isInWishlist)
    const showToast = useStore((s) => s.showToast)

    const wishlisted = isInWishlist(product.id)

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product)
        showToast(`${product.name} added to cart`)
    }

    const handleToggleWishlist = (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(product)
        showToast(wishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`)
    }

    return (
        <Link to={`/product/${product.id}`} className="product-card" id={`product-${product.id}`}>
            <div className="product-card__image-wrap">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                />
                {product.discount > 0 && (
                    <span className="product-card__badge">-{product.discount}%</span>
                )}
                <div className="product-card__overlay">
                    <button className="product-card__action" onClick={handleAddToCart} title="Add to cart">
                        <ShoppingBag size={18} />
                    </button>
                    <button
                        className={`product-card__action ${wishlisted ? 'product-card__action--active' : ''}`}
                        onClick={handleToggleWishlist}
                        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
            <div className="product-card__info">
                <h3 className="product-card__name">{product.name}</h3>
                <div className="product-card__pricing">
                    <span className="product-card__price">${product.price.toLocaleString()}</span>
                    {product.discount > 0 && (
                        <span className="product-card__original-price">
                            ${product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
                {product.stock <= 3 && product.stock > 0 && (
                    <span className="product-card__stock-low">Only {product.stock} left</span>
                )}
            </div>
        </Link>
    )
}

