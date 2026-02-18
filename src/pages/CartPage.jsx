import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Send, User, Mail, Phone } from 'lucide-react'
import useStore from '../store/store'
import './CartPage.css'

export default function CartPage() {
    const cart = useStore((s) => s.cart)
    const removeFromCart = useStore((s) => s.removeFromCart)
    const updateQuantity = useStore((s) => s.updateQuantity)
    const getCartTotal = useStore((s) => s.getCartTotal)
    const clearCart = useStore((s) => s.clearCart)
    const submitRequest = useStore((s) => s.submitRequest)
    const showToast = useStore((s) => s.showToast)

    const [showInquiryForm, setShowInquiryForm] = useState(false)
    const [buyerName, setBuyerName] = useState('')
    const [buyerEmail, setBuyerEmail] = useState('')
    const [buyerPhone, setBuyerPhone] = useState('')

    const subtotal = getCartTotal()

    const handleSubmitInquiry = (e) => {
        e.preventDefault()
        if (!buyerName || !buyerEmail) return

        submitRequest({
            buyerName,
            buyerEmail,
            buyerPhone,
            items: cart
        })

        setShowInquiryForm(false)
        setBuyerName('')
        setBuyerEmail('')
        setBuyerPhone('')
        showToast('Your inquiry has been submitted! We will contact you shortly.')
    }

    if (cart.length === 0) {
        return (
            <div className="cart" style={{ paddingTop: 'var(--navbar-height)' }}>
                <div className="container empty-state" style={{ paddingTop: '4rem' }}>
                    <ShoppingBag size={64} />
                    <h3>Your request list is empty</h3>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                        Browse our collections and add items you're interested in.
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
                        <p className="section-label">Inquiry</p>
                        <h1 className="section-title">Your Request List</h1>
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

                    {/* Request Summary */}
                    <div className="cart__summary animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                        <h3 className="cart__summary-title">Request Summary</h3>
                        <div className="cart__summary-row">
                            <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="cart__summary-note">
                            <p>
                                Prices are indicative. Our team will contact you with final pricing,
                                availability, and customization options.
                            </p>
                        </div>
                        <div className="cart__summary-divider" />
                        <div className="cart__summary-row cart__summary-total">
                            <span>Estimated Total</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-lg cart__checkout-btn"
                            onClick={() => setShowInquiryForm(true)}
                        >
                            <Send size={18} />
                            Submit Inquiry
                        </button>
                        <Link to="/catalog" className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
                            Continue Browsing
                        </Link>
                    </div>
                </div>
            </div>

            {/* Inquiry Form Modal */}
            {showInquiryForm && (
                <div className="modal-backdrop" onClick={() => setShowInquiryForm(false)}>
                    <div className="modal cart__inquiry-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2>Submit Your Inquiry</h2>
                            <button className="btn btn-ghost" onClick={() => setShowInquiryForm(false)}>
                                ✕
                            </button>
                        </div>
                        <p className="cart__inquiry-desc">
                            Fill in your contact details and we'll reach out to discuss your selections,
                            finalize pricing, and arrange your purchase.
                        </p>
                        <form onSubmit={handleSubmitInquiry}>
                            <div className="form-group">
                                <label>
                                    <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={buyerName}
                                    onChange={(e) => setBuyerName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={buyerEmail}
                                    onChange={(e) => setBuyerEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>
                                    <Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                                    Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    value={buyerPhone}
                                    onChange={(e) => setBuyerPhone(e.target.value)}
                                    placeholder="+1 234 567 8900"
                                />
                            </div>

                            <div className="cart__inquiry-items">
                                <h4>Your Selections ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h4>
                                {cart.map((item) => (
                                    <div key={item.id} className="cart__inquiry-item">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="modal__footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowInquiryForm(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!buyerName || !buyerEmail}
                                >
                                    <Send size={14} /> Send Inquiry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
