import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Upload, Sparkles, ArrowLeft, Camera, Key,
    Image as ImageIcon, Loader2, AlertTriangle, Download
} from 'lucide-react'
import useStore from '../store/store'
import {
    generateTryOn, getApiKey, setApiKey, fileToBase64,
    imageUrlToBase64
} from '../utils/geminiApi'
import './TryOnPage.css'

export default function TryOnPage() {
    const { id } = useParams()
    const products = useStore((s) => s.products)
    const product = products.find((p) => p.id === id)

    const [apiKeyInput, setApiKeyInput] = useState(getApiKey())
    const [userPhoto, setUserPhoto] = useState(null)
    const [userPhotoPreview, setUserPhotoPreview] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (!product) {
        return (
            <div className="tryon" style={{ paddingTop: 'var(--navbar-height)' }}>
                <div className="container empty-state" style={{ paddingTop: '4rem' }}>
                    <h3>Product not found</h3>
                    <Link to="/catalog" className="btn btn-outline" style={{ marginTop: '1rem' }}>
                        Back to Catalog
                    </Link>
                </div>
            </div>
        )
    }

    const bodyPartInstructions = {
        rings: {
            title: 'Upload a Hand Photo',
            description: 'Take a clear photo of your hand with fingers visible for the best ring preview.',
            icon: '✋'
        },
        necklaces: {
            title: 'Upload a Neck/Upper Body Photo',
            description: 'Take a photo showing your neck and upper chest area for a necklace preview.',
            icon: '👤'
        },
        earrings: {
            title: 'Upload a Face/Ear Photo',
            description: 'Take a clear photo showing your face and ears for an earring preview.',
            icon: '👂'
        }
    }

    const instructions = bodyPartInstructions[product.category] || bodyPartInstructions.rings

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setError(null)
        setResultImage(null)

        const base64 = await fileToBase64(file)
        setUserPhoto(base64)
        setUserPhotoPreview(base64)
    }

    const handleGenerate = async () => {
        if (!userPhoto) {
            setError('Please upload a photo first.')
            return
        }

        if (!apiKeyInput) {
            setError('Please enter your Gemini API key.')
            return
        }

        setApiKey(apiKeyInput)
        setLoading(true)
        setError(null)
        setResultImage(null)

        try {
            // Get the product image as base64
            const productImageBase64 = await imageUrlToBase64(product.images[0])

            // Call Gemini API
            const result = await generateTryOn(
                userPhoto,
                productImageBase64,
                product.category,
                apiKeyInput
            )

            setResultImage(result)
        } catch (err) {
            setError(err.message || 'Failed to generate try-on image. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!resultImage) return
        const link = document.createElement('a')
        link.href = resultImage
        link.download = `peer-jewelry-tryon-${product.id}.png`
        link.click()
    }

    return (
        <div className="tryon" style={{ paddingTop: 'var(--navbar-height)' }}>
            <div className="container">
                {/* Header */}
                <div className="tryon__header animate-fade-in-up">
                    <Link to={`/product/${product.id}`} className="tryon__back">
                        <ArrowLeft size={16} /> Back to Product
                    </Link>
                    <div>
                        <p className="section-label">AI Virtual Try-On</p>
                        <h1 className="section-title">Try Before You Buy</h1>
                    </div>
                </div>

                {/* Product Info */}
                <div className="tryon__product animate-fade-in-up">
                    <img src={product.images[0]} alt={product.name} className="tryon__product-img" />
                    <div>
                        <h3 className="tryon__product-name">{product.name}</h3>
                        <p className="tryon__product-price">${product.price.toLocaleString()}</p>
                    </div>
                </div>

                {/* API Key */}
                <div className="tryon__api-key animate-fade-in-up">
                    <div className="tryon__api-key-header">
                        <Key size={16} />
                        <span>Gemini API Key</span>
                    </div>
                    <input
                        type="password"
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="Enter your Gemini API key..."
                        className="tryon__api-input"
                    />
                    <p className="tryon__api-hint">
                        Your key is stored locally and never sent to our servers.{' '}
                        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                            Get a free key →
                        </a>
                    </p>
                </div>

                <div className="tryon__main">
                    {/* Upload Section */}
                    <div className="tryon__upload animate-fade-in-up">
                        <div className="tryon__instructions">
                            <span className="tryon__instructions-icon">{instructions.icon}</span>
                            <h3>{instructions.title}</h3>
                            <p>{instructions.description}</p>
                        </div>

                        {userPhotoPreview ? (
                            <div className="tryon__preview">
                                <img src={userPhotoPreview} alt="Your photo" />
                                <label className="tryon__change-photo">
                                    <Camera size={14} />
                                    Change Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        hidden
                                    />
                                </label>
                            </div>
                        ) : (
                            <label className="tryon__dropzone">
                                <Upload size={32} />
                                <span className="tryon__dropzone-title">Upload Your Photo</span>
                                <span className="tryon__dropzone-subtitle">
                                    Click or drag & drop • JPG, PNG up to 10MB
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    hidden
                                />
                            </label>
                        )}

                        <button
                            className="btn btn-primary btn-lg tryon__generate-btn"
                            onClick={handleGenerate}
                            disabled={loading || !userPhoto || !apiKeyInput}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate Try-On Preview
                                </>
                            )}
                        </button>
                    </div>

                    {/* Result Section */}
                    <div className="tryon__result animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {loading && (
                            <div className="tryon__loading">
                                <div className="spinner" />
                                <h3>Creating your preview...</h3>
                                <p>Our AI is blending the jewelry onto your photo. This may take a moment.</p>
                            </div>
                        )}

                        {error && (
                            <div className="tryon__error">
                                <AlertTriangle size={24} />
                                <h3>Something went wrong</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {resultImage && !loading && (
                            <div className="tryon__result-image">
                                <img src={resultImage} alt="AI Try-On Result" />
                                <button className="btn btn-outline btn-sm tryon__download" onClick={handleDownload}>
                                    <Download size={14} /> Download Image
                                </button>
                            </div>
                        )}

                        {!resultImage && !loading && !error && (
                            <div className="tryon__placeholder">
                                <ImageIcon size={48} />
                                <h3>Your try-on preview will appear here</h3>
                                <p>Upload your photo and click "Generate" to see how the jewelry looks on you.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
