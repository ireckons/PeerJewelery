import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, Menu, X, Gem } from 'lucide-react'
import useStore from '../store/store'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const cartCount = useStore((s) => s.getCartCount())
    const wishlistCount = useStore((s) => s.getWishlistCount())

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [location])

    return (
        <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
            <div className="navbar__inner container">
                <Link to="/" className="navbar__logo">
                    <div className="navbar__logo-icon">
                        <Gem size={24} />
                    </div>
                    <div className="navbar__brand">
                        <span className="navbar__brand-name">PEER</span>
                        <span className="navbar__brand-sub">JEWELRY</span>
                    </div>
                </Link>

                <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>
                        Home
                    </Link>
                    <Link to="/catalog" className={`navbar__link ${location.pathname.startsWith('/catalog') ? 'active' : ''}`}>
                        Collections
                    </Link>
                    <Link to="/catalog/rings" className={`navbar__link ${location.pathname === '/catalog/rings' ? 'active' : ''}`}>
                        Rings
                    </Link>
                    <Link to="/catalog/necklaces" className={`navbar__link ${location.pathname === '/catalog/necklaces' ? 'active' : ''}`}>
                        Necklaces
                    </Link>
                    <Link to="/catalog/earrings" className={`navbar__link ${location.pathname === '/catalog/earrings' ? 'active' : ''}`}>
                        Earrings
                    </Link>
                    <Link to="/admin" className={`navbar__link ${location.pathname === '/admin' ? 'active' : ''}`}>
                        Admin
                    </Link>
                </div>

                <div className="navbar__actions">
                    <Link to="/wishlist" className="navbar__cart" id="nav-wishlist" title="Wishlist">
                        <Heart size={20} />
                        {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                    </Link>
                    <Link to="/cart" className="navbar__cart" id="nav-cart" title="Cart">
                        <ShoppingBag size={22} />
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </Link>
                    <button
                        className="navbar__menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}
