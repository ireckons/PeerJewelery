import { create } from 'zustand'

const initialProducts = [
    {
        id: '1',
        name: 'Riviera Tennis Bracelet Set',
        description: 'Exquisite diamond tennis bracelets in varying widths, set in 18K white gold. A timeless collection that radiates elegance from every angle.',
        price: 12500,
        originalPrice: 15000,
        discount: 17,
        category: 'rings',
        stock: 5,
        images: ['/products/ring-1.svg'],
        featured: true
    },
    {
        id: '2',
        name: 'Marquise Solitaire Diamond Ring',
        description: 'A stunning marquise-cut diamond set on a delicate pavé band. The elongated silhouette creates an illusion of greater size and sophistication.',
        price: 8900,
        originalPrice: 8900,
        discount: 0,
        category: 'rings',
        stock: 3,
        images: ['/products/ring-2.svg'],
        featured: true
    },
    {
        id: '3',
        name: 'Pear & Round Cluster Ring',
        description: 'A breathtaking cluster of pear and round brilliant diamonds, creating a floral motif that captures light from every direction.',
        price: 15800,
        originalPrice: 18000,
        discount: 12,
        category: 'rings',
        stock: 2,
        images: ['/products/pear-cluster-1.jpg', '/products/pear-cluster-2.jpg', '/products/pear-cluster-3.jpg', '/products/pear-cluster-4.jpg'],
        featured: false
    },
    {
        id: '4',
        name: 'Oval Halo Engagement Ring',
        description: 'A magnificent oval diamond surrounded by a delicate halo of micro-pavé diamonds, set on a split-shank band for added brilliance.',
        price: 11200,
        originalPrice: 11200,
        discount: 0,
        category: 'rings',
        stock: 4,
        images: ['/products/ring-4.svg'],
        featured: true
    },
    {
        id: '5',
        name: 'Floral Diamond Statement Ring',
        description: 'An extraordinary floral-inspired ring featuring precisely arranged diamonds that bloom into a captivating centerpiece.',
        price: 19500,
        originalPrice: 22000,
        discount: 11,
        category: 'rings',
        stock: 1,
        images: ['/products/ring-5.svg'],
        featured: false
    },
    {
        id: '6',
        name: 'Classic Round Solitaire Ring',
        description: 'The quintessential engagement ring — a brilliant round diamond elevated on a sleek six-prong setting. Pure and timeless.',
        price: 9800,
        originalPrice: 9800,
        discount: 0,
        category: 'rings',
        stock: 7,
        images: ['/products/ring-6.svg'],
        featured: true
    },
    {
        id: '7',
        name: 'Emerald Eternity Band',
        description: 'A full eternity band featuring emerald-cut diamonds set in a shared prong setting. Each stone perfectly aligned for continuous sparkle.',
        price: 7600,
        originalPrice: 8500,
        discount: 11,
        category: 'rings',
        stock: 6,
        images: ['/products/ring-7.svg'],
        featured: false
    },
    {
        id: '8',
        name: 'Double-Row Diamond Band',
        description: 'Two rows of brilliant round diamonds set in a micro-pavé arrangement, creating a band of uninterrupted light.',
        price: 6400,
        originalPrice: 7200,
        discount: 11,
        category: 'rings',
        stock: 8,
        images: ['/products/ring-8.svg'],
        featured: false
    },
    {
        id: '9',
        name: 'Multi-Row Diamond Ring Set',
        description: 'A versatile set of diamond bands that can be worn stacked or individually. The ultimate expression of layered luxury.',
        price: 13500,
        originalPrice: 16000,
        discount: 16,
        category: 'rings',
        stock: 3,
        images: ['/products/ring-9.svg'],
        featured: true
    }
]

// Load from localStorage or use defaults
const loadProducts = () => {
    try {
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
