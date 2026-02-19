import { create } from 'zustand'

const initialProducts = [

    {
        id: '10',
        name: 'Marquise Cut Solitaire',
        description: 'An elegant marquise-cut diamond that elongates the finger, maximizing carat weight brilliance.',
        price: 10500,
        originalPrice: 10500,
        discount: 0,
        category: 'rings',
        stock: 4,
        images: ['/products/rings/marquise-cut-solitaire/1.jpg', '/products/rings/marquise-cut-solitaire/2.jpg', '/products/rings/marquise-cut-solitaire/3.jpg'],
        featured: true
    },
    {
        id: '11',
        name: 'Three-Stone Trilogy Ring',
        description: 'Symbolizing the past, present, and future, this trilogy ring features three perfectly matched diamonds.',
        price: 13200,
        originalPrice: 15000,
        discount: 12,
        category: 'rings',
        stock: 3,
        images: ['/products/ring-11.svg'],
        featured: true
    },
    {
        id: '12',
        name: 'Oval Cut Double Band Ring',
        description: 'A stunning oval diamond set on a unique double band for a modern yet timeless architectural look.',
        price: 11800,
        originalPrice: 11800,
        discount: 0,
        category: 'rings',
        stock: 5,
        images: ['/products/rings/oval-cut-double-band-ring/1.jpg', '/products/rings/oval-cut-double-band-ring/2.jpg', '/products/rings/oval-cut-double-band-ring/3.jpg', '/products/rings/oval-cut-double-band-ring/4.jpg'],
        featured: true
    },
    {
        id: '13',
        name: 'Three-Stone Oval Ring',
        description: 'A magnificent center oval diamond flanked by two side stones, creating a wall of brilliance.',
        price: 14500,
        originalPrice: 16500,
        discount: 12,
        category: 'rings',
        stock: 2,
        images: ['/products/rings/three-stone-oval-ring/1.jpg', '/products/rings/three-stone-oval-ring/2.jpg', '/products/rings/three-stone-oval-ring/3.jpg', '/products/rings/three-stone-oval-ring/4.jpg'],
        featured: true
    },
    {
        id: '14',
        name: 'Solitaire Split Shank Ring',
        description: 'A brilliant solitaire diamond perched on a graceful split shank band that draws the eye to the center stone.',
        price: 9200,
        originalPrice: 9200,
        discount: 0,
        category: 'rings',
        stock: 6,
        images: ['/products/rings/solitaire-split-shank-ring/1.jpg', '/products/rings/solitaire-split-shank-ring/2.jpg', '/products/rings/solitaire-split-shank-ring/3.jpg', '/products/rings/solitaire-split-shank-ring/4.jpg'],
        featured: true
    },
    {
        id: '15',
        name: 'Full Eternity Band',
        description: 'A continuous circle of brilliance, this full eternity band features precision-set diamonds symbolizing never-ending love.',
        price: 7200,
        originalPrice: 8000,
        discount: 10,
        category: 'bracelets',
        stock: 6,
        images: ['/products/ring-15.svg'],
        featured: true
    },
    {
        id: '16',
        name: 'Stacked Eternity Bands',
        description: 'A curated stack of diamond eternity bands, perfect for wearing together for maximum sparkle or individually.',
        price: 8800,
        originalPrice: 9500,
        discount: 7,
        category: 'bracelets',
        stock: 4,
        images: ['/products/bracelets/stacked-eternity-bands/1.jpg', '/products/bracelets/stacked-eternity-bands/2.jpg', '/products/bracelets/stacked-eternity-bands/3.jpg', '/products/bracelets/stacked-eternity-bands/4.jpg', '/products/bracelets/stacked-eternity-bands/5.jpg'],
        featured: true
    },
    {
        id: '17',
        name: 'Diamond Tennis Bracelets',
        description: 'A stack of exquisite diamond tennis bracelets in varying carat weights, the ultimate statement of luxury.',
        price: 18500,
        originalPrice: 22000,
        discount: 16,
        category: 'bracelets',
        stock: 5,
        images: ['/products/bracelets/diamond-tennis-bracelets/1.jpg', '/products/bracelets/diamond-tennis-bracelets/2.jpg', '/products/bracelets/diamond-tennis-bracelets/3.jpg'],
        featured: true
    },
    {
        id: '18',
        name: 'Diamond Stud Earrings',
        description: 'Classic and timeless, these brilliant-cut diamond studs are the perfect everyday luxury essential.',
        price: 4500,
        originalPrice: 4800,
        discount: 6,
        category: 'earrings',
        stock: 8,
        images: ['/products/earring-1.svg'],
        featured: true
    },
    {
        id: '19',
        name: 'Halo Drop Earrings',
        description: 'Elegant drop earrings featuring a dazzling center stone surrounded by a halo of smaller diamonds.',
        price: 6800,
        originalPrice: 7500,
        discount: 9,
        category: 'earrings',
        stock: 5,
        images: ['/products/earring-2.svg'],
        featured: true
    },
    {
        id: '20',
        name: 'Chandelier Diamond Earrings',
        description: 'Statement chandelier earrings cascading with diamonds, designed to catch the light from every angle.',
        price: 12000,
        originalPrice: 14000,
        discount: 14,
        category: 'earrings',
        stock: 2,
        images: ['/products/earring-3.svg'],
        featured: true
    },
    {
        id: '21',
        name: 'Solitaire Diamond Pendant',
        description: 'A single, perfectly cut diamond suspended from a delicate chain, embodying understated elegance.',
        price: 5500,
        originalPrice: 5500,
        discount: 0,
        category: 'necklaces',
        stock: 6,
        images: ['/products/necklace-1.svg'],
        featured: true
    },
    {
        id: '22',
        name: 'Tennis Necklace',
        description: 'A breathtaking continuous strand of diamonds that sits beautifully on the collarbone for ultimate glamour.',
        price: 25000,
        originalPrice: 30000,
        discount: 16,
        category: 'necklaces',
        stock: 2,
        images: ['/products/necklace-2.svg'],
        featured: true
    },
    {
        id: '23',
        name: 'Diamond Station Necklace',
        description: 'Delicate diamonds spaced along a fine chain, creating a "diamonds by the yard" look that layers perfectly.',
        price: 8200,
        originalPrice: 8900,
        discount: 8,
        category: 'necklaces',
        stock: 7,
        images: ['/products/necklace-3.svg'],
        featured: true
    }
]

// Bump this version whenever initialProducts data changes
const PRODUCTS_VERSION = '15'

// Load from localStorage or use defaults
const loadProducts = () => {
    try {
        const savedVersion = localStorage.getItem('peer-products-version')
        if (savedVersion !== PRODUCTS_VERSION) {
            // Version mismatch — reset to defaults
            localStorage.setItem('peer-products', JSON.stringify(initialProducts))
            localStorage.setItem('peer-products-version', PRODUCTS_VERSION)
            return initialProducts
        }
        const saved = localStorage.getItem('peer-products')
        return saved ? JSON.parse(saved) : initialProducts
    } catch {
        return initialProducts
    }
}

const loadCart = () => {
    try {
        const saved = localStorage.getItem('peer-cart')
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const loadWishlist = () => {
    try {
        const saved = localStorage.getItem('peer-wishlist')
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const loadRequests = () => {
    try {
        const saved = localStorage.getItem('peer-requests')
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const useStore = create((set, get) => ({
    // ── Products ──
    products: loadProducts(),

    addProduct: (product) => {
        const newProduct = { ...product, id: Date.now().toString() }
        set((state) => {
            const updated = [...state.products, newProduct]
            localStorage.setItem('peer-products', JSON.stringify(updated))
            return { products: updated }
        })
    },

    updateProduct: (id, updates) => {
        set((state) => {
            const updated = state.products.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            )
            localStorage.setItem('peer-products', JSON.stringify(updated))
            return { products: updated }
        })
    },

    deleteProduct: (id) => {
        set((state) => {
            const updated = state.products.filter((p) => p.id !== id)
            localStorage.setItem('peer-products', JSON.stringify(updated))
            return { products: updated }
        })
    },

    resetProducts: () => {
        localStorage.setItem('peer-products', JSON.stringify(initialProducts))
        set({ products: initialProducts })
    },

    // ── Cart ──
    cart: loadCart(),

    addToCart: (product) => {
        set((state) => {
            const existing = state.cart.find((item) => item.id === product.id)
            let updated
            if (existing) {
                updated = state.cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            } else {
                updated = [...state.cart, { ...product, quantity: 1 }]
            }
            localStorage.setItem('peer-cart', JSON.stringify(updated))
            return { cart: updated }
        })
    },

    removeFromCart: (productId) => {
        set((state) => {
            const updated = state.cart.filter((item) => item.id !== productId)
            localStorage.setItem('peer-cart', JSON.stringify(updated))
            return { cart: updated }
        })
    },

    updateQuantity: (productId, quantity) => {
        set((state) => {
            if (quantity <= 0) {
                const updated = state.cart.filter((item) => item.id !== productId)
                localStorage.setItem('peer-cart', JSON.stringify(updated))
                return { cart: updated }
            }
            const updated = state.cart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
            localStorage.setItem('peer-cart', JSON.stringify(updated))
            return { cart: updated }
        })
    },

    clearCart: () => {
        localStorage.setItem('peer-cart', JSON.stringify([]))
        set({ cart: [] })
    },

    getCartTotal: () => {
        const { cart } = get()
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },

    getCartCount: () => {
        const { cart } = get()
        return cart.reduce((sum, item) => sum + item.quantity, 0)
    },

    // ── Toast ──
    toast: null,
    showToast: (message) => {
        set({ toast: message })
        setTimeout(() => set({ toast: null }), 3000)
    },

    // ── Wishlist ──
    wishlist: loadWishlist(),

    toggleWishlist: (product) => {
        set((state) => {
            const exists = state.wishlist.find((item) => item.id === product.id)
            let updated
            if (exists) {
                updated = state.wishlist.filter((item) => item.id !== product.id)
            } else {
                updated = [...state.wishlist, { ...product }]
            }
            localStorage.setItem('peer-wishlist', JSON.stringify(updated))
            return { wishlist: updated }
        })
    },

    removeFromWishlist: (productId) => {
        set((state) => {
            const updated = state.wishlist.filter((item) => item.id !== productId)
            localStorage.setItem('peer-wishlist', JSON.stringify(updated))
            return { wishlist: updated }
        })
    },

    isInWishlist: (productId) => {
        const { wishlist } = get()
        return wishlist.some((item) => item.id === productId)
    },

    getWishlistCount: () => {
        const { wishlist } = get()
        return wishlist.length
    },

    // ── Customer Requests ──
    requests: loadRequests(),

    submitRequest: ({ buyerName, buyerEmail, buyerPhone, items }) => {
        set((state) => {
            const newRequest = {
                id: Date.now().toString(),
                buyerName,
                buyerEmail,
                buyerPhone,
                items: items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    category: item.category,
                    image: item.images?.[0] || ''
                })),
                total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
                date: new Date().toISOString(),
                status: 'pending'
            }
            const updated = [newRequest, ...state.requests]
            localStorage.setItem('peer-requests', JSON.stringify(updated))
            // Clear cart after submission
            localStorage.setItem('peer-cart', JSON.stringify([]))
            return { requests: updated, cart: [] }
        })
    },

    clearRequests: () => {
        localStorage.setItem('peer-requests', JSON.stringify([]))
        set({ requests: [] })
    }
}))

export default useStore
