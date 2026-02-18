import { useState } from 'react'
import {
    Package, Plus, Pencil, Trash2, Image, X, RotateCcw,
    DollarSign, Tag, Archive, Save, Users, Mail, Phone, Calendar
} from 'lucide-react'
import useStore from '../store/store'
import './AdminPage.css'

const emptyProduct = {
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: 0,
    category: 'rings',
    stock: '',
    images: [],
    featured: false
}

export default function AdminPage() {
    const products = useStore((s) => s.products)
    const addProduct = useStore((s) => s.addProduct)
    const updateProduct = useStore((s) => s.updateProduct)
    const deleteProduct = useStore((s) => s.deleteProduct)
    const resetProducts = useStore((s) => s.resetProducts)
    const requests = useStore((s) => s.requests)
    const clearRequests = useStore((s) => s.clearRequests)
    const showToast = useStore((s) => s.showToast)

    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [form, setForm] = useState(emptyProduct)
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const openAdd = () => {
        setEditingProduct(null)
        setForm(emptyProduct)
        setShowModal(true)
    }

    const openEdit = (product) => {
        setEditingProduct(product)
        setForm({
            ...product,
            price: product.price.toString(),
            originalPrice: product.originalPrice.toString(),
            stock: product.stock.toString()
        })
        setShowModal(true)
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        const promises = files.map(
            (file) =>
                new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve(reader.result)
                    reader.readAsDataURL(file)
                })
        )
        Promise.all(promises).then((images) => {
            setForm((f) => ({ ...f, images: [...f.images, ...images] }))
        })
    }

    const removeImage = (index) => {
        setForm((f) => ({
            ...f,
            images: f.images.filter((_, i) => i !== index)
        }))
    }

    const handleSave = () => {
        const price = parseFloat(form.price)
        const originalPrice = parseFloat(form.originalPrice) || price
        const stock = parseInt(form.stock, 10) || 0
        const discount = originalPrice > price
            ? Math.round(((originalPrice - price) / originalPrice) * 100)
            : 0

        const productData = {
            name: form.name,
            description: form.description,
            price,
            originalPrice,
            discount,
            category: form.category,
            stock,
            images: form.images.length > 0 ? form.images : ['/products/ring-1.svg'],
            featured: form.featured
        }

        if (editingProduct) {
            updateProduct(editingProduct.id, productData)
            showToast('Product updated successfully')
        } else {
            addProduct(productData)
            showToast('Product added successfully')
        }

        setShowModal(false)
        setForm(emptyProduct)
    }

    const handleDelete = (id) => {
        deleteProduct(id)
        setDeleteConfirm(null)
        showToast('Product deleted')
    }

    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

    return (
        <div className="admin" style={{ paddingTop: 'var(--navbar-height)' }}>
            <div className="container">
                <div className="admin__header animate-fade-in-up">
                    <div>
                        <p className="section-label">Management</p>
                        <h1 className="section-title">Admin Dashboard</h1>
                    </div>
                    <div className="admin__header-actions">
                        <button className="btn btn-ghost btn-sm" onClick={resetProducts}>
                            <RotateCcw size={14} /> Reset Data
                        </button>
                        <button className="btn btn-primary" onClick={openAdd}>
                            <Plus size={16} /> Add Product
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="admin__stats animate-fade-in-up">
                    <div className="admin__stat">
                        <Package size={20} />
                        <div>
                            <span className="admin__stat-value">{products.length}</span>
                            <span className="admin__stat-label">Products</span>
                        </div>
                    </div>
                    <div className="admin__stat">
                        <Archive size={20} />
                        <div>
                            <span className="admin__stat-value">{totalStock}</span>
                            <span className="admin__stat-label">Total Stock</span>
                        </div>
                    </div>
                    <div className="admin__stat">
                        <DollarSign size={20} />
                        <div>
                            <span className="admin__stat-value">${totalValue.toLocaleString()}</span>
                            <span className="admin__stat-label">Inventory Value</span>
                        </div>
                    </div>
                    <div className="admin__stat">
                        <Tag size={20} />
                        <div>
                            <span className="admin__stat-value">
                                {products.filter((p) => p.discount > 0).length}
                            </span>
                            <span className="admin__stat-label">On Sale</span>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="admin__table-wrap animate-fade-in-up">
                    <table className="admin__table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Stock</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="admin__product-cell">
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="admin__product-thumb"
                                            />
                                            <span className="admin__product-name">{product.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin__category-tag">{product.category}</span>
                                    </td>
                                    <td>${product.price.toLocaleString()}</td>
                                    <td>
                                        {product.discount > 0 ? (
                                            <span className="admin__discount-tag">-{product.discount}%</span>
                                        ) : (
                                            <span className="admin__no-discount">—</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={product.stock <= 3 ? 'admin__low-stock' : ''}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td>{product.featured ? '⭐' : '—'}</td>
                                    <td>
                                        <div className="admin__actions">
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => openEdit(product)}
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => setDeleteConfirm(product.id)}
                                                title="Delete"
                                                style={{ color: '#ef4444' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Customer Requests Section */}
                <div className="admin__requests animate-fade-in-up" style={{ marginTop: 'var(--space-2xl)' }}>
                    <div className="admin__requests-header">
                        <div>
                            <h2 className="admin__requests-title">
                                <Users size={20} /> Customer Requests
                            </h2>
                            <p className="admin__requests-subtitle">
                                {requests.length} {requests.length === 1 ? 'inquiry' : 'inquiries'} received
                            </p>
                        </div>
                        {requests.length > 0 && (
                            <button className="btn btn-ghost btn-sm" onClick={() => {
                                clearRequests()
                                showToast('All requests cleared')
                            }}>
                                <Trash2 size={14} /> Clear All
                            </button>
                        )}
                    </div>

                    {requests.length === 0 ? (
                        <div className="admin__requests-empty">
                            <Mail size={32} />
                            <p>No customer inquiries yet. Requests will appear here when customers submit them from their cart.</p>
                        </div>
                    ) : (
                        <div className="admin__requests-list">
                            {requests.map((request) => (
                                <div key={request.id} className="admin__request-card">
                                    <div className="admin__request-header">
                                        <div className="admin__request-buyer">
                                            <strong>{request.buyerName}</strong>
                                            <span className="admin__request-status">{request.status}</span>
                                        </div>
                                        <div className="admin__request-contact">
                                            <span><Mail size={12} /> {request.buyerEmail}</span>
                                            {request.buyerPhone && <span><Phone size={12} /> {request.buyerPhone}</span>}
                                            <span><Calendar size={12} /> {new Date(request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <div className="admin__request-items">
                                        {request.items.map((item, idx) => (
                                            <div key={idx} className="admin__request-item">
                                                {item.image && <img src={item.image} alt={item.name} className="admin__request-item-img" />}
                                                <div className="admin__request-item-info">
                                                    <span className="admin__request-item-name">{item.name}</span>
                                                    <span className="admin__request-item-meta">{item.category} · Qty: {item.quantity}</span>
                                                </div>
                                                <span className="admin__request-item-price">${(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="admin__request-total">
                                        <span>Estimated Total</span>
                                        <span>${request.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Diamond Solitaire Ring"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="A stunning piece..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    placeholder="9999"
                                />
                            </div>
                            <div className="form-group">
                                <label>Original Price ($)</label>
                                <input
                                    type="number"
                                    value={form.originalPrice}
                                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                                    placeholder="12000"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                >
                                    <option value="rings">Rings</option>
                                    <option value="necklaces">Necklaces</option>
                                    <option value="earrings">Earrings</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    placeholder="10"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ marginBottom: 'var(--space-sm)' }}>
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                    style={{ marginRight: '8px', width: 'auto' }}
                                />
                                Featured Product
                            </label>
                        </div>

                        {/* Image Upload */}
                        <div className="form-group">
                            <label>Product Images</label>
                            <div className="admin__image-upload">
                                <label className="admin__upload-btn">
                                    <Image size={20} />
                                    <span>Upload Images</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                </label>
                                {form.images.length > 0 && (
                                    <div className="admin__image-preview">
                                        {form.images.map((img, i) => (
                                            <div key={i} className="admin__preview-item">
                                                <img src={img} alt={`Preview ${i + 1}`} />
                                                <button
                                                    className="admin__preview-remove"
                                                    onClick={() => removeImage(i)}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal__footer">
                            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={!form.name || !form.price}
                            >
                                <Save size={14} />
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <h2>Delete Product?</h2>
                        <p style={{ color: 'var(--color-text-secondary)', margin: 'var(--space-md) 0 var(--space-xl)' }}>
                            This action cannot be undone.
                        </p>
                        <div className="modal__footer">
                            <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
