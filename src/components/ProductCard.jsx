import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
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
                {product.images[0]?.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                        src={product.images[0]}
                        className="product-card__image"
                        muted loop autoPlay playsInline
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-card__image"
                        loading="lazy"
                    />
                )}
                {product.discount > 0 && (
                    <span className="product-card__badge">-{product.discount}%</span>
                )}
                <button
                    className={`product-card__favorite ${wishlisted ? 'product-card__favorite--active' : ''}`}
                    onClick={handleToggleWishlist}
                    title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
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
                <button
                    className="product-card__add-btn"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            </div>
        </Link>
    )
}

