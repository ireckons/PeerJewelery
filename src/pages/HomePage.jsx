import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react'
import useStore from '../store/store'
import ProductCard from '../components/ProductCard'
import './HomePage.css'

export default function HomePage() {
    const products = useStore((s) => s.products)
    const featured = products.filter((p) => p.featured).slice(0, 4)

    const categories = [
        {
            name: 'Rings',
            slug: 'rings',
            description: 'Timeless symbols of commitment',
            image: '/products/Ring Preview Page Banner.png'
        },
        {
            name: 'Necklaces',
            slug: 'necklaces',
            description: 'Elegant statements of grace',
            image: '/products/Necklace homepage preview.png'
        },
        {
            name: 'Earrings',
            slug: 'earrings',
            description: 'Sparkling accents of beauty',
            image: '/products/Earrings Homepage preview image.png'
        }
    ]

    return (
        <div className="home">
            {/* ── Global Animated Background ── */}
            <div className="home__bg">
                <div className="home__gradient" />
                <div className="home__particles">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="home__particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }} />
                    ))}
                </div>
            </div>

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero__content container animate-fade-in-up">
                    <p className="hero__label">✦ Est. 2024 — Luxury Reimagined</p>
                    <h1 className="hero__title">
                        <span className="hero__title-line">PEER</span>
                        <span className="hero__title-line hero__title-line--accent">JEWELRY</span>
                    </h1>
                    <p className="hero__slogan">סיפור אהבה. בפאר.</p>
                    <p className="hero__subtitle">A love story. In luxury.</p>
                    <div className="hero__actions">
                        <Link to="/catalog" className="btn btn-primary btn-lg">
                            Explore Collections <ArrowRight size={18} />
                        </Link>
                        <Link to="/catalog/rings" className="btn btn-outline btn-lg">
                            Shop Rings
                        </Link>
                    </div>
                </div>
                <div className="hero__scroll-indicator">
                    <div className="hero__scroll-line" />
                </div>
            </section>

            {/* ── Features ── */}
            <section className="features section">
                <div className="features__grid container">
                    <div className="feature">
                        <Sparkles size={28} className="feature__icon" />
                        <h3>Handcrafted Excellence</h3>
                    </div>
                    <div className="feature">
                        <Shield size={28} className="feature__icon" />
                        <h3>Certified Diamonds</h3>
                    </div>
                    <div className="feature">
                        <Truck size={28} className="feature__icon" />
                        <h3>Worldwide Delivery</h3>
                    </div>
                </div>
            </section>

            {/* ── Categories ── */}
            <section className="categories section">
                <div className="container">
                    <div className="section-header">
                        <p className="section-label">Curated For You</p>
                        <h2 className="section-title">Shop by Category</h2>
                    </div>
                    <div className="categories__grid stagger">
                        {categories.map((cat) => (
                            <Link to={`/catalog/${cat.slug}`} key={cat.slug} className="category-card">
                                <div className="category-card__image-wrap">
                                    <img src={cat.image} alt={cat.name} className="category-card__image" />
                                    <div className="category-card__overlay" />
                                </div>
                                <div className="category-card__content">
                                    <h3>{cat.name}</h3>
                                    <p>{cat.description}</p>
                                    <span className="category-card__link">
                                        Explore <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="featured section">
                <div className="container">
                    <div className="section-header">
                        <p className="section-label">Exceptional Pieces</p>
                        <h2 className="section-title">Featured Collection</h2>
                    </div>
                    <div className="featured__grid stagger">
                        {featured.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="featured__cta">
                        <Link to="/catalog" className="btn btn-outline">
                            View All Collections <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Brand Story ── */}
            <section className="brand-story section">
                <div className="container">
                    <div className="brand-story__inner">
                        <div className="brand-story__text">
                            <p className="section-label">Our Story</p>
                            <h2 className="section-title">Where Artistry Meets Emotion</h2>
                            <p className="brand-story__desc">
                                At Peer Jewelry, we believe that every piece of jewelry tells a story — a story of love,
                                of milestones, of moments that define a lifetime. Our master jewelers pour decades of
                                expertise into each creation, ensuring that every diamond sparkles with the intensity
                                of the emotions it represents.
                            </p>
                            <p className="brand-story__desc">
                                From the shores of the Mediterranean to the hands of our artisans, each piece is a
                                testament to the enduring beauty of craftsmanship and the timeless power of love.
                            </p>
                            <Link to="/catalog" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                                Discover Our Craft <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
