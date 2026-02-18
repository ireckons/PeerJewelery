import { Link } from 'react-router-dom'
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import useStore from '../store/store'
import './WishlistPage.css'

export default function WishlistPage() {
    const wishlist = useStore((s) => s.wishlist)
    const removeFromWishlist = useStore((s) => s.removeFromWishlist)
    const addToCart = useStore((s) => s.addToCart)
    const showToast = useStore((s) => s.showToast)

    const handleAddToCart = (item) => {
        addToCart(item)
        showToast(`${item.name} added to cart`)
    }

    if (wishlist.length === 0) {
        return (
            <div className="wishlist" style={{ paddingTop: 'var(--navbar-height)' }}>
                <div className="container empty-state" style={{ paddingTop: '4rem' }}>
                    <Heart size={64} />
                    <h3>Your wishlist is empty</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Save your favorite pieces to revisit them later.
                    </p>
                    <Link to="/catalog" className="btn btn-primary">
                        Browse Collections <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="wishlist" style={{ paddingTop: 'var(--navbar-height)' }}>
            <div className="container">
                <div className="wishlist__header animate-fade-in-up">
                    <div>
                        <p className="section-label">Saved</p>
                        <h1 className="section-title">Your Wishlist</h1>
                    </div>
                    <span className="wishlist__count">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div className="wishlist__grid stagger">
                    {wishlist.map((item) => (
                        <div key={item.id} className="wishlist-card animate-fade-in-up">
                            <Link to={`/product/${item.id}`} className="wishlist-card__image-wrap">
                                <img src={item.images[0]} alt={item.name} />
                            </Link>
                            <div className="wishlist-card__info">
                                <Link to={`/product/${item.id}`} className="wishlist-card__name">
                                    {item.name}
                                </Link>
                                <p className="wishlist-card__category">
                                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                </p>
                                <span className="wishlist-card__price">
                                    ${item.price.toLocaleString()}
                                </span>
                                <div className="wishlist-card__actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleAddToCart(item)}
                                    >
                                        <ShoppingBag size={14} /> Add to Cart
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-sm wishlist-card__remove"
                                        onClick={() => {
                                            removeFromWishlist(item.id)
                                            showToast(`${item.name} removed from wishlist`)
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
