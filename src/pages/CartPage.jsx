import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react'
import useStore from '../store/store'
import './CartPage.css'

export default function CartPage() {
    const cart = useStore((s) => s.cart)
    const removeFromCart = useStore((s) => s.removeFromCart)
    const updateQuantity = useStore((s) => s.updateQuantity)
    const getCartTotal = useStore((s) => s.getCartTotal)
    const clearCart = useStore((s) => s.clearCart)

    const subtotal = getCartTotal()
    const tax = subtotal * 0.18
    const total = subtotal + tax

    if (cart.length === 0) {
        return (
            <div className="cart" style={{ paddingTop: 'var(--navbar-height)' }}>
                <div className="container empty-state" style={{ paddingTop: '4rem' }}>
                    <ShoppingBag size={64} />
                    <h3>Your cart is empty</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Discover our exquisite collections and find something you love.
                    </p>
                    <Link to="/catalog" className="btn btn-primary">
                        Browse Collections <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="cart" style={{ paddingTop: 'var(--navbar-height)' }}>
            <div className="container">
                <div className="cart__header animate-fade-in-up">
                    <div>
                        <p className="section-label">Shopping</p>
                        <h1 className="section-title">Your Cart</h1>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={clearCart}>
                        Clear All
                    </button>
                </div>

                <div className="cart__layout">
                    {/* Cart Items */}
                    <div className="cart__items animate-fade-in-up">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                                <Link to={`/product/${item.id}`} className="cart-item__image-wrap">
                                    <img src={item.images[0]} alt={item.name} />
                                </Link>
                                <div className="cart-item__info">
                                    <Link to={`/product/${item.id}`} className="cart-item__name">
                                        {item.name}
                                    </Link>
                                    <p className="cart-item__category">
                                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                    </p>
                                    <div className="cart-item__bottom">
                                        <div className="cart-item__quantity">
                                            <button
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <span className="cart-item__price">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </span>
                                        <button
                                            className="cart-item__remove"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Remove"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="cart__summary animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                        <h3 className="cart__summary-title">Order Summary</h3>
                        <div className="cart__summary-row">
                            <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="cart__summary-row">
                            <span>Tax (18%)</span>
                            <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="cart__summary-row">
                            <span>Shipping</span>
                            <span className="cart__free-shipping">Free</span>
                        </div>
                        <div className="cart__summary-divider" />
                        <div className="cart__summary-row cart__summary-total">
                            <span>Total</span>
                            <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <button className="btn btn-primary btn-lg cart__checkout-btn">
                            Proceed to Checkout
                        </button>
                        <Link to="/catalog" className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
