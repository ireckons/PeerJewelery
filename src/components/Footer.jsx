import { Link } from 'react-router-dom'
import { Gem, Instagram, Facebook, Mail } from 'lucide-react'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner container">
                <div className="footer__top">
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <Gem size={28} />
                            <div>
                                <div className="footer__logo-name">PEER</div>
                                <div className="footer__logo-sub">JEWELRY</div>
                            </div>
                        </Link>
                        <p className="footer__slogan">סיפור אהבה. בפאר.</p>
                        <p className="footer__slogan-en">A love story. In luxury.</p>
                    </div>

                    <div className="footer__nav">
                        <h4>Collections</h4>
                        <Link to="/catalog/rings">Rings</Link>
                        <Link to="/catalog/necklaces">Necklaces</Link>
                        <Link to="/catalog/earrings">Earrings</Link>
                        <Link to="/catalog">View All</Link>
                    </div>

                    <div className="footer__nav">
                        <h4>Company</h4>
                        <Link to="/">About Us</Link>
                        <Link to="/">Our Craft</Link>
                        <Link to="/">Sustainability</Link>
                        <Link to="/">Contact</Link>
                    </div>

                    <div className="footer__nav">
                        <h4>Connect</h4>
                        <div className="footer__socials">
                            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                            <a href="#" aria-label="Email"><Mail size={18} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© {new Date().getFullYear()} Peer Jewelry. All rights reserved.</p>
                    <div className="footer__bottom-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/accessibility">Accessibility</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
