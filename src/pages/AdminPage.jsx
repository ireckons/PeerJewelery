import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
    Package, Plus, Pencil, Trash2, Image, X, RotateCcw,
    DollarSign, Tag, Archive, Save, Users, Mail, Phone, Calendar,
    ChevronLeft, ChevronRight, Menu, Settings, Star, Sparkles, Loader2
} from 'lucide-react'
import { generateBackground } from '../utils/geminiApi'
import useStore from '../store/store'
import './AdminPage.css'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const AI_STYLE_PROMPTS = [
    { label: 'Soft Gradient Luxury (Blue)', value: 'Place the jewelry product on a smooth soft blue background (#A7C7E7) with gentle gradients and subtle shadows. Keep lighting elegant and highlight gemstone brilliance.' },
    { label: 'Curved Paper Fold', value: 'Display the jewelry on a curled sheet of soft blue paper with smooth curves and highlights, creating a refined luxury backdrop.' },
    { label: 'Velvet Texture', value: 'Showcase the jewelry on a soft blue velvet-textured surface with delicate lighting, emphasizing elegance and sparkle.' },
    { label: 'Geometric Blocks', value: 'Present the jewelry on stacked geometric blocks in soft blue tones with subtle glow edges, giving a modern luxury feel.' }
];

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

function SortableRow({ product, openEdit, setDeleteConfirm, selectedCategory, updateProduct, isManualSort }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1, // Make the dragged row distinctly transparent
        backgroundColor: isDragging ? 'var(--color-bg-secondary)' : 'transparent',
        // Ensure zIndex is applied so it floats above others if needed
        position: isDragging ? 'relative' : undefined,
        zIndex: isDragging ? 100 : undefined,
    };

    return (
        <tr ref={setNodeRef} style={style}>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isManualSort && (
                        <div
                            {...attributes}
                            {...listeners}
                            style={{ cursor: 'grab', display: 'flex', padding: '4px' }}
                            title="Drag to reorder"
                        >
                            <Menu size={16} color="var(--color-text-secondary)" />
                        </div>
                    )}
                    <div className="admin__product-cell">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="admin__product-thumb"
                        />
                        <span className="admin__product-name">{product.name}</span>
                    </div>
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
            <td>
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => updateProduct(product.id, { ...product, featured: !product.featured })}
                    title={product.featured ? "Unfeature Product" : "Feature Product"}
                    style={{ color: product.featured ? '#fbbf24' : 'var(--color-text-tertiary)', padding: '4px' }}
                >
                    <Star size={16} fill={product.featured ? '#fbbf24' : 'none'} />
                </button>
            </td>
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
    );
}

export default function AdminPage() {
    const products = useStore((s) => s.products)
    const categories = useStore((s) => s.categories)
    const addCategory = useStore((s) => s.addCategory)
    const deleteCategory = useStore((s) => s.deleteCategory)
    const addProduct = useStore((s) => s.addProduct)
    const updateProduct = useStore((s) => s.updateProduct)
    const deleteProduct = useStore((s) => s.deleteProduct)
    const reorderCategoryList = useStore((s) => s.reorderCategoryList)
    const resetProducts = useStore((s) => s.resetProducts)
    const requests = useStore((s) => s.requests)
    const clearRequests = useStore((s) => s.clearRequests)
    const showToast = useStore((s) => s.showToast)

    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [form, setForm] = useState(emptyProduct)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedCategory = searchParams.get('category') || 'All'
    const setSelectedCategory = (cat) => setSearchParams({ category: cat })
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')
    const [isGeneratingBg, setIsGeneratingBg] = useState(false)
    const [aiStyle, setAiStyle] = useState(AI_STYLE_PROMPTS[0].value)
    const [customAiStyle, setCustomAiStyle] = useState('')
    const [previewMedia, setPreviewMedia] = useState(null)
    const [aiSourceIndex, setAiSourceIndex] = useState(0)
    const [sortBy, setSortBy] = useState('manual')

    const handleGenerateBackground = async () => {
        if (!form.images.length) return;
        setIsGeneratingBg(true);
        try {
            const rawImage = form.images[aiSourceIndex];
            const promptToUse = aiStyle === 'custom' ? customAiStyle : aiStyle;
            if (aiStyle === 'custom' && !customAiStyle.trim()) {
                throw new Error("Please enter a custom prompt.");
            }
            const newImage = await generateBackground(rawImage, promptToUse);
            setForm({ ...form, images: [...form.images, newImage] });
            showToast('AI background generated successfully!');
        } catch (error) {
            console.error('AI Gen Error:', error);
            showToast(error.message || 'Failed to generate AI background');
        } finally {
            setIsGeneratingBg(false);
        }
    }

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        const res = await addCategory(newCategoryName);
        if (res?.success) {
            setNewCategoryName('');
            showToast('Category added successfully');
        } else {
            showToast(res?.error || 'Failed to add category');
        }
    }

    const handleDeleteCategory = async (name) => {
        if (window.confirm(`Are you sure you want to delete the "${name}" category? Products won't be deleted, but may need reassignment.`)) {
            await deleteCategory(name);
            showToast('Category deleted');
            if (selectedCategory === name) setSelectedCategory('All');
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        if (sortBy !== 'manual') return; // Disable drop reordering if dynamically sorted

        const { active, over } = event;

        if (over && active.id !== over.id) {
            const isAll = selectedCategory === 'All';
            const filteredArray = products.filter(p => isAll || p.category === selectedCategory);
            const oldIndex = filteredArray.findIndex((p) => p.id === active.id);
            const newIndex = filteredArray.findIndex((p) => p.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newOrder = arrayMove(filteredArray, oldIndex, newIndex).map(p => p.id);
                reorderCategoryList(selectedCategory, newOrder);
            }
        }
    }

    const openAdd = () => {
        setEditingProduct(null)
        setForm(emptyProduct)
        setAiSourceIndex(0)
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
        setAiSourceIndex(0)
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

    const moveImage = (index, direction) => {
        setForm((f) => {
            const newImages = [...f.images]
            if (direction === 'left' && index > 0) {
                const temp = newImages[index]
                newImages[index] = newImages[index - 1]
                newImages[index - 1] = temp
            } else if (direction === 'right' && index < newImages.length - 1) {
                const temp = newImages[index]
                newImages[index] = newImages[index + 1]
                newImages[index + 1] = temp
            }
            return { ...f, images: newImages }
        })
    }

    const handleSave = async () => {
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
            const res = await updateProduct(editingProduct.id, productData)
            if (res?.success) {
                showToast('Product updated successfully')
                setShowModal(false)
                setForm(emptyProduct)
            } else {
                showToast(res?.error || 'Failed to update product')
            }
        } else {
            const res = await addProduct(productData)
            if (res?.success) {
                showToast('Product added successfully')
                setShowModal(false)
                setForm(emptyProduct)
                // Automatically switch to the category of the new product so the user sees it
                if (selectedCategory !== 'All' && selectedCategory !== productData.category) {
                    setSelectedCategory('All')
                }
                // Optional: Scroll to bottom could be added if needed
            } else {
                showToast(res?.error || 'Failed to add product')
            }
        }
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

                {/* Category Filters & Sorting */}
                <div className="admin__filters animate-fade-in-up" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                            className={`btn btn-sm ${selectedCategory === 'All' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setSelectedCategory('All')}
                        >All Categories</button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setSelectedCategory(cat)}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            className="admin__input"
                            style={{ margin: 0, padding: '4px 8px', fontSize: '0.85rem', width: 'auto', minWidth: '150px' }}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="manual">Sort: Manual</option>
                            <option value="recent">Recently Added</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="category-asc">Jewelry Type</option>
                            <option value="price-asc">Price (Low - High)</option>
                            <option value="price-desc">Price (High - Low)</option>
                            <option value="demand-high">Most Demanded</option>
                            <option value="demand-low">Least Demanded</option>
                        </select>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => setShowCategoryModal(true)}
                            title="Manage Categories"
                        >
                            <Settings size={16} /> <span className="hide-mobile" style={{ marginLeft: '6px' }}>Manage Categories</span>
                        </button>
                    </div>
                </div>

                {/* Products Table */}
                <div className="admin__table-wrap animate-fade-in-up">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
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
                                <SortableContext
                                    items={
                                        (() => {
                                            let filtered = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
                                            if (sortBy !== 'manual') {
                                                filtered = [...filtered].sort((a, b) => {
                                                    switch (sortBy) {
                                                        case 'recent': return parseInt(b.id || 0) - parseInt(a.id || 0); // Assuming IDs are timestamps from Date.now()
                                                        case 'name-asc': return a.name.localeCompare(b.name);
                                                        case 'name-desc': return b.name.localeCompare(a.name);
                                                        case 'category-asc': return a.category.localeCompare(b.category);
                                                        case 'price-asc': return a.price - b.price;
                                                        case 'price-desc': return b.price - a.price;
                                                        case 'demand-high': return a.stock - b.stock;
                                                        case 'demand-low': return b.stock - a.stock;
                                                        default: return 0;
                                                    }
                                                });
                                            }
                                            return filtered.map(p => p.id);
                                        })()
                                    }
                                    strategy={verticalListSortingStrategy}
                                >
                                    {(() => {
                                        let filtered = products.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
                                        if (sortBy !== 'manual') {
                                            filtered = [...filtered].sort((a, b) => {
                                                switch (sortBy) {
                                                    case 'recent': return parseInt(b.id || 0) - parseInt(a.id || 0);
                                                    case 'name-asc': return a.name.localeCompare(b.name);
                                                    case 'name-desc': return b.name.localeCompare(a.name);
                                                    case 'category-asc': return a.category.localeCompare(b.category);
                                                    case 'price-asc': return a.price - b.price;
                                                    case 'price-desc': return b.price - a.price;
                                                    case 'demand-high': return a.stock - b.stock;
                                                    case 'demand-low': return b.stock - a.stock;
                                                    default: return 0;
                                                }
                                            });
                                        }
                                        return filtered.map((product) => (
                                            <SortableRow
                                                key={product.id}
                                                product={product}
                                                openEdit={openEdit}
                                                setDeleteConfirm={setDeleteConfirm}
                                                selectedCategory={selectedCategory}
                                                updateProduct={updateProduct}
                                                isManualSort={sortBy === 'manual'}
                                            />
                                        ));
                                    })()}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
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
                                    style={{ textTransform: 'capitalize' }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>{cat}</option>
                                    ))}
                                    {form.category && !categories.includes(form.category) && (
                                        <option value={form.category} style={{ textTransform: 'capitalize' }}>{form.category} (Deleted)</option>
                                    )}
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

                        {/* Image/Video Upload */}
                        <div className="form-group">
                            <label>Product Media</label>
                            <div className="admin__image-upload">
                                <label className="admin__upload-btn">
                                    <Image size={20} />
                                    <span>Upload Media</span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        hidden
                                    />
                                </label>
                                {form.images.length > 0 && (
                                    <div className="admin__image-preview">
                                        {form.images.map((img, i) => {
                                            const isVideo = img.startsWith('data:video/') || img.match(/\.(mp4|webm|ogg)$/i);
                                            return (
                                                <div key={i} className="admin__preview-item" style={{ position: 'relative', overflow: 'hidden' }}>
                                                    {isVideo ? (
                                                        <video
                                                            src={img}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                                            muted loop autoPlay playsInline
                                                            onClick={(e) => { e.stopPropagation(); setPreviewMedia(img); }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={img}
                                                            alt={`Preview ${i + 1}`}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={(e) => { e.stopPropagation(); setPreviewMedia(img); }}
                                                        />
                                                    )}
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            gap: '4px',
                                                            background: 'rgba(0,0,0,0.6)',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        {i > 0 && (
                                                            <button type="button" onClick={() => moveImage(i, 'left')} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '2px' }}>
                                                                <ChevronLeft size={14} />
                                                            </button>
                                                        )}
                                                        <button type="button" onClick={() => removeImage(i)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}>
                                                            <X size={14} />
                                                        </button>
                                                        {i < form.images.length - 1 && (
                                                            <button type="button" onClick={() => moveImage(i, 'right')} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '2px' }}>
                                                                <ChevronRight size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* AI Background Generation UI */}
                        {form.images.length > 0 && (
                            <div className="form-group" style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Sparkles size={16} color="var(--color-primary)" />
                                    AI Background Generation
                                </label>
                                {form.images.length > 1 && (
                                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <label style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Source Image:</label>
                                        <select
                                            className="admin__input"
                                            value={aiSourceIndex}
                                            onChange={(e) => setAiSourceIndex(parseInt(e.target.value))}
                                            style={{ padding: '6px 12px', width: 'auto', minWidth: '120px', margin: 0, fontSize: '0.85rem' }}
                                            disabled={isGeneratingBg}
                                        >
                                            {form.images.map((img, idx) => (
                                                <option key={idx} value={idx}>
                                                    Image {idx + 1} {idx === 0 ? '(Cover)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <select
                                        className="admin__input"
                                        value={aiStyle}
                                        onChange={(e) => setAiStyle(e.target.value)}
                                        style={{ flex: 1, margin: 0 }}
                                        disabled={isGeneratingBg}
                                    >
                                        {AI_STYLE_PROMPTS.map((prompt, idx) => (
                                            <option key={idx} value={prompt.value}>
                                                {prompt.label}
                                            </option>
                                        ))}
                                        <option value="custom">Custom Prompt...</option>
                                    </select>
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={handleGenerateBackground}
                                        disabled={isGeneratingBg}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {isGeneratingBg ? (
                                            <>
                                                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                Generate
                                            </>
                                        )}
                                    </button>
                                </div>
                                {aiStyle === 'custom' && (
                                    <textarea
                                        className="admin__input"
                                        style={{ marginTop: '12px', resize: 'vertical', minHeight: '80px' }}
                                        placeholder="Enter your custom styling instructions (e.g., 'Place the ring on a rustic wooden table with soft morning sunlight...')"
                                        value={customAiStyle}
                                        onChange={(e) => setCustomAiStyle(e.target.value)}
                                        disabled={isGeneratingBg}
                                    />
                                )}
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                                    Uses the selected image as the product source to generate a photorealistic background.
                                </p>
                            </div>
                        )}

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

            {/* Category Management Modal */}
            {showCategoryModal && (
                <div className="modal-backdrop" onClick={() => setShowCategoryModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className="modal__header">
                            <h2>Manage Categories</h2>
                            <button className="btn btn-ghost" onClick={() => setShowCategoryModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="form-group" style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-xl)' }}>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="New category name..."
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                style={{ flex: 1 }}
                            />
                            <button className="btn btn-primary" onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
                                Add
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {categories.length === 0 ? (
                                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>No categories found.</p>
                            ) : (
                                categories.map(cat => (
                                    <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                        <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{cat}</span>
                                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteCategory(cat)} title="Delete Category" style={{ color: '#ef4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="modal__footer" style={{ marginTop: 'var(--space-2xl)' }}>
                            <button className="btn btn-secondary" onClick={() => setShowCategoryModal(false)} style={{ width: '100%' }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Preview Modal */}
            {previewMedia && (
                <div className="modal-backdrop" onClick={() => setPreviewMedia(null)} style={{ zIndex: 1000 }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90vw', padding: '1rem', background: 'var(--color-bg-primary)' }}>
                        <div className="modal__header" style={{ marginBottom: '1rem' }}>
                            <h2>Media Preview</h2>
                            <button className="btn btn-ghost" onClick={() => setPreviewMedia(null)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxHeight: '70vh', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                            {previewMedia.startsWith('data:video/') || previewMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video src={previewMedia} controls autoPlay style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
                            ) : (
                                <img src={previewMedia} alt="Expanded Preview" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
