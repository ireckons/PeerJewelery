import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Upload, Sparkles, ArrowLeft, Camera,
    Image as ImageIcon, Info
} from 'lucide-react'
import useStore from '../store/store'
import './TryOnPage.css'

/* ── SVG Pose Guides ── */
function HandPoseGuide() {
    return (
        <svg viewBox="0 0 300 300" className="tryon__pose-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="296" height="296" rx="16" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
            {/* Palm */}
            <ellipse cx="150" cy="190" rx="55" ry="65" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            {/* Thumb */}
            <path d="M95 175 Q75 155 80 130 Q85 115 95 115" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            {/* Index finger */}
            <path d="M120 128 Q118 95 122 65 Q125 50 130 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            {/* Middle finger */}
            <path d="M145 125 Q143 88 145 52 Q147 38 150 38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            {/* Ring finger — highlighted */}
            <path d="M170 128 Q172 92 170 58 Q168 44 165 44" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <circle cx="170" cy="88" r="8" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" opacity="0.7" />
            <text x="195" y="92" fill="var(--color-primary)" fontSize="10" fontFamily="sans-serif" opacity="0.8">Ring here</text>
            {/* Pinky */}
            <path d="M195 135 Q198 108 195 80 Q192 68 188 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            {/* Wrist */}
            <path d="M105 250 Q150 265 195 250" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </svg>
    )
}

function NecklacePoseGuide() {
    return (
        <svg viewBox="0 0 300 300" className="tryon__pose-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="296" height="296" rx="16" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
            {/* Head */}
            <ellipse cx="150" cy="70" rx="38" ry="45" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            {/* Neck */}
            <path d="M130 112 L130 150" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <path d="M170 112 L170 150" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            {/* Shoulders */}
            <path d="M130 150 Q100 155 60 175" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            <path d="M170 150 Q200 155 240 175" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            {/* Body */}
            <path d="M60 175 L75 280" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M240 175 L225 280" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            {/* Necklace area — highlighted */}
            <path d="M120 140 Q150 170 180 140" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" strokeDasharray="4 3" />
            <circle cx="150" cy="165" r="6" fill="var(--color-primary)" opacity="0.6" />
            <text x="155" y="188" fill="var(--color-primary)" fontSize="10" fontFamily="sans-serif" opacity="0.8">Necklace area</text>
            {/* Cross-hair guides */}
            <line x1="150" y1="20" x2="150" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <line x1="145" y1="25" x2="155" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        </svg>
    )
}

function EarringPoseGuide() {
    return (
        <svg viewBox="0 0 300 300" className="tryon__pose-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="296" height="296" rx="16" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
            {/* Face outline */}
            <ellipse cx="150" cy="140" rx="65" ry="82" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            {/* Hair */}
            <path d="M85 120 Q85 60 150 55 Q215 60 215 120" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            {/* Eyes */}
            <ellipse cx="125" cy="130" rx="12" ry="5" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <ellipse cx="175" cy="130" rx="12" ry="5" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            {/* Nose */}
            <path d="M148 145 Q150 158 152 145" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Mouth */}
            <path d="M135 175 Q150 185 165 175" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            {/* Left ear — highlighted */}
            <path d="M87 120 Q72 130 75 155 Q78 170 87 170" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.8" />
            <circle cx="82" cy="172" r="5" fill="var(--color-primary)" opacity="0.6" />
            <line cx="82" cy="172" x1="82" y1="177" x2="82" y2="192" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.6" />
            <text x="30" y="200" fill="var(--color-primary)" fontSize="9" fontFamily="sans-serif" opacity="0.8">Earring</text>
            {/* Right ear — highlighted */}
            <path d="M213 120 Q228 130 225 155 Q222 170 213 170" stroke="var(--color-primary)" strokeWidth="2.5" opacity="0.8" />
            <circle cx="218" cy="172" r="5" fill="var(--color-primary)" opacity="0.6" />
            <line x1="218" y1="177" x2="218" y2="192" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.6" />
            <text x="230" y="200" fill="var(--color-primary)" fontSize="9" fontFamily="sans-serif" opacity="0.8">Earring</text>
            {/* Neck */}
            <path d="M130 220 L130 260" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
            <path d="M170 220 L170 260" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
        </svg>
    )
}

const poseGuides = {
    rings: {
        component: HandPoseGuide,
        title: 'Hand Photo Required',
        instruction: 'Hold your hand flat in front of the camera with fingers slightly spread, like this outline.',
        tip: 'Good lighting and a neutral background work best.'
    },
    necklaces: {
        component: NecklacePoseGuide,
        title: 'Passport-Style Photo Required',
        instruction: 'Stand straight facing the camera with your neck and upper chest visible — like a passport photo.',
        tip: 'Wear a simple top and keep hair away from your neck.'
    },
    earrings: {
        component: EarringPoseGuide,
        title: 'Face & Ear Photo Required',
        instruction: 'Face the camera with both ears clearly visible. A slight angle works too.',
        tip: 'Pull hair behind your ears for the best result.'
    }
}

export default function TryOnPage() {
    const { id } = useParams()
    const products = useStore((s) => s.products)
    const product = products.find((p) => p.id === id)

    const [userPhoto, setUserPhoto] = useState(null)
    const [userPhotoPreview, setUserPhotoPreview] = useState(null)

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

    const guide = poseGuides[product.category] || poseGuides.rings
    const PoseComponent = guide.component

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            setUserPhoto(reader.result)
            setUserPhotoPreview(reader.result)
        }
        reader.readAsDataURL(file)
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

                {/* Coming Soon Banner */}
                <div className="tryon__coming-soon animate-fade-in-up">
                    <Info size={18} />
                    <div>
                        <strong>AI Try-On — Coming Soon</strong>
                        <p>
                            The AI-powered virtual try-on will be available soon. For now, use the pose guide
                            below to prepare your photo so you'll be ready when the feature launches.
                        </p>
                    </div>
                </div>

                <div className="tryon__main">
                    {/* Pose Guide + Upload Section */}
                    <div className="tryon__upload animate-fade-in-up">
                        {/* Pose Guide */}
                        <div className="tryon__pose-guide">
                            <div className="tryon__pose-guide-visual">
                                <PoseComponent />
                            </div>
                            <div className="tryon__pose-guide-info">
                                <h3>{guide.title}</h3>
                                <p>{guide.instruction}</p>
                                <p className="tryon__pose-tip">💡 {guide.tip}</p>
                            </div>
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
                            disabled={true}
                        >
                            <Sparkles size={18} />
                            Generate Try-On Preview
                        </button>
                    </div>

                    {/* Result Section */}
                    <div className="tryon__result animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="tryon__placeholder">
                            <ImageIcon size={48} />
                            <h3>Your try-on preview will appear here</h3>
                            <p>Once the AI feature launches, upload your photo and generate a preview of how the jewelry looks on you.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
