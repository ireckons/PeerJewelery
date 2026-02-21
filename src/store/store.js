import { create } from 'zustand'

const API_URL = 'http://localhost:5000/api/products'

// Load from localStorage or use defaults
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
    products: [],
    loading: false,

    fetchProducts: async () => {
        set({ loading: true });
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            set({ products: data, loading: false });
        } catch (err) {
            console.error('Failed to fetch products:', err);
            set({ loading: false });
        }
    },

    // ── Categories ──
    categories: [],

    fetchCategories: async () => {
        try {
            const res = await fetch('http://localhost:5000/api/categories');
            if (res.ok) {
                const data = await res.json();
                set({ categories: data });
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            // Fallback for UI resilience
            set({ categories: ["rings", "necklaces", "earrings", "bracelets"] });
        }
    },

    addCategory: async (name) => {
        try {
            const res = await fetch('http://localhost:5000/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                const data = await res.json();
                set({ categories: data.categories });
                return { success: true };
            } else {
                const errData = await res.json();
                return { success: false, error: errData.error };
            }
        } catch (err) {
            console.error('Failed to add category:', err);
            return { success: false, error: 'Network error' };
        }
    },

    deleteCategory: async (name) => {
        try {
            const res = await fetch(`http://localhost:5000/api/categories/${name}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                const data = await res.json();
                set({ categories: data.categories });
            }
        } catch (err) {
            console.error('Failed to delete category:', err);
        }
    },

    addProduct: async (product) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product),
            });
            if (res.ok) {
                const newProduct = await res.json();
                set((state) => ({ products: [...state.products, newProduct] }));
            }
        } catch (err) {
            console.error('Failed to add product:', err);
        }
    },

    updateProduct: async (id, updates) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const updatedProduct = await res.json();
                set((state) => ({
                    products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
                }));
            }
        } catch (err) {
            console.error('Failed to update product:', err);
        }
    },

    deleteProduct: async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                set((state) => ({
                    products: state.products.filter((p) => p.id !== id),
                }));
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    },

    reorderProduct: async (id, direction, category) => {
        try {
            const res = await fetch(`${API_URL}/${id}/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direction, category })
            });
            if (res.ok) {
                // Refresh the whole product list to get the new order
                get().fetchProducts();
            }
        } catch (err) {
            console.error('Failed to reorder product:', err);
        }
    },

    reorderCategoryList: async (category, orderedIds) => {
        try {
            // Optimistically update local state for snappier UI
            set((state) => {
                const isAll = category === 'All';
                const categoryProducts = state.products.filter((p) => isAll || p.category === category);

                const reorderedCategoryProducts = [];
                orderedIds.forEach(id => {
                    const product = categoryProducts.find(p => p.id === id);
                    if (product) reorderedCategoryProducts.push(product);
                });

                // Add any missing
                categoryProducts.forEach(p => {
                    if (!orderedIds.includes(p.id)) reorderedCategoryProducts.push(p);
                });

                const newProducts = [...state.products];
                const positions = newProducts.map((p, index) => (isAll || p.category === category) ? index : -1).filter(index => index !== -1);

                positions.forEach((globalIndex, i) => {
                    if (reorderedCategoryProducts[i]) {
                        newProducts[globalIndex] = reorderedCategoryProducts[i];
                    }
                });

                return { products: newProducts };
            });

            const res = await fetch(`http://localhost:5000/api/products/reorder-category`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category, orderedIds })
            });

            if (!res.ok) {
                console.error('Failed to persist reorder, reverting...');
                get().fetchProducts(); // Revert on failure
            }
        } catch (err) {
            console.error('Failed to reorder category list:', err);
            get().fetchProducts(); // Revert on failure
        }
    },

    resetProducts: async () => {
        // Resetting on a live backend would require a specific route, 
        // for now we'll just alert since the file is the source of truth.
        alert("Resetting data is disabled when using the backend. Modify products.json directly if needed.");
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
