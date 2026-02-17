import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AdminPage from './pages/AdminPage'
import TryOnPage from './pages/TryOnPage'

export default function App() {
    return (
        <div className="app">
            <Navbar />
            <main style={{ minHeight: `calc(100vh - var(--navbar-height))` }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/catalog/:category" element={<CatalogPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/try-on/:id" element={<TryOnPage />} />
                </Routes>
            </main>
            <Footer />
            <Toast />
        </div>
    )
}
