import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Upload, Sparkles, ArrowLeft, Camera,
    Download, RotateCcw, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react'
import useStore from '../store/store'
import { imageUrlToBase64, isApiConfigured } from '../utils/geminiApi'
import { generateJewelryTryOn } from '../utils/try-on'
import './TryOnPage.css'

/* ── SVG Templates ── */

function RingTemplate1() {
    return (
        <svg viewBox="0 0 400 500" className="tryon__svg-template" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hand upright – palm facing forward */}
            <ellipse cx="200" cy="310" rx="70" ry="85" stroke="currentColor" strokeWidth="1.5" />
            {/* Thumb */}
            <path d="M130 290 Q105 260 110 220 Q115 200 125 195" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Index */}
            <path d="M160 228 Q158 180 162 130 Q165 110 170 108" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Middle */}
            <path d="M195 222 Q193 168 195 108 Q197 88 200 86" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Ring finger – highlighted */}
            <path d="M228 228 Q230 175 228 118 Q226 100 222 98" stroke="#b08d57" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="229" cy="170" rx="10" ry="6" stroke="#b08d57" strokeWidth="1.5" fill="none" />
            {/* Pinky */}
            <path d="M258 240 Q262 198 258 152 Q255 136 250 134" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Wrist */}
            <path d="M140 390 Q200 410 260 390" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="140" y1="390" x2="128" y2="470" stroke="currentColor" strokeWidth="1.5" />
            <line x1="260" y1="390" x2="272" y2="470" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    )
}

function RingTemplate2() {
    return (
        <svg viewBox="0 0 400 500" className="tryon__svg-template" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hand relaxed – drooping fingers */}
            <path d="M280 120 Q260 130 240 180 Q230 210 225 260" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Index */}
            <path d="M220 270 Q210 310 200 350 Q195 370 190 380" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Middle */}
            <path d="M235 275 Q228 320 220 365 Q216 385 212 395" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Ring – highlighted */}
            <path d="M248 268 Q244 318 238 370 Q235 392 232 402" stroke="#b08d57" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="244" cy="320" rx="10" ry="6" stroke="#b08d57" strokeWidth="1.5" fill="none" />
            {/* Pinky */}
            <path d="M258 260 Q256 300 252 348 Q250 368 248 378" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Thumb */}
            <path d="M200 265 Q180 310 175 350 Q173 365 170 375" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Palm shape */}
            <path d="M195 265 Q225 250 265 265 Q270 300 255 260" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Wrist / arm line */}
            <path d="M280 120 Q310 105 340 100" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function BraceletTemplate() {
    return (
        <svg viewBox="0 0 400 500" className="tryon__svg-template" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Forearm horizontal */}
            <path d="M50 220 Q120 215 200 220 Q280 225 350 230" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M50 280 Q120 285 200 280 Q280 275 350 270" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Wrist area – highlighted */}
            <ellipse cx="200" cy="250" rx="30" ry="40" stroke="#b08d57" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            {/* Hand */}
            <path d="M350 230 Q370 225 385 210 Q395 198 398 190" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M350 270 Q370 278 382 290 Q390 300 392 310" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Fingers */}
            <path d="M395 195 Q400 170 395 155" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M388 200 Q398 165 396 145" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M380 208 Q392 172 392 152" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M375 218 Q385 190 385 170" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            {/* Thumb */}
            <path d="M388 280 Q400 300 395 320" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
    )
}

function NecklaceTemplate1() {
    return (
        <svg viewBox="0 0 400 500" className="tryon__svg-template" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head – front view */}
            <ellipse cx="200" cy="110" rx="65" ry="80" stroke="currentColor" strokeWidth="1.5" />
            {/* Eyes */}
            <ellipse cx="175" cy="100" rx="10" ry="5" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="225" cy="100" rx="10" ry="5" stroke="currentColor" strokeWidth="1" />
            {/* Nose */}
            <path d="M197 115 Q200 125 203 115" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* Mouth */}
            <path d="M187 138 Q200 146 213 138" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* Neck */}
            <line x1="178" y1="188" x2="175" y2="250" stroke="currentColor" strokeWidth="1.5" />
            <line x1="222" y1="188" x2="225" y2="250" stroke="currentColor" strokeWidth="1.5" />
            {/* Shoulders */}
            <path d="M175 250 Q140 258 80 285" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M225 250 Q260 258 320 285" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Collarbone – highlighted necklace area */}
            <path d="M120 275 Q200 295 280 275" stroke="#b08d57" strokeWidth="2" strokeDasharray="6 4" />
            {/* Body */}
            <line x1="80" y1="285" x2="95" y2="470" stroke="currentColor" strokeWidth="1.5" />
            <line x1="320" y1="285" x2="305" y2="470" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    )
}

function NecklaceTemplate2() {
    return (
        <svg viewBox="0 0 400 500" className="tryon__svg-template" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head – three-quarter */}
            <ellipse cx="210" cy="110" rx="60" ry="78" stroke="currentColor" strokeWidth="1.5" transform="rotate(-5 210 110)" />
            {/* Eyes */}
            <ellipse cx="190" cy="100" rx="9" ry="4.5" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="230" cy="98" rx="8" ry="4" stroke="currentColor" strokeWidth="1" />
            {/* Nose */}
            <path d="M205 115 Q210 128 215 118" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* Neck */}
            <line x1="185" y1="186" x2="182" y2="248" stroke="currentColor" strokeWidth="1.5" />
            <line x1="230" y1="184" x2="232" y2="245" stroke="currentColor" strokeWidth="1.5" />
            {/* Shoulders */}
            <path d="M182 248 Q145 255 72 282" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M232 245 Q268 252 335 278" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* V-neckline + necklace area */}
            <path d="M140 270 Q200 310 265 270" stroke="#b08d57" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="200" cy="305" r="6" stroke="#b08d57" strokeWidth="1.5" fill="none" />
            {/* Body */}
            <line x1="72" y1="282" x2="90" y2="470" stroke="currentColor" strokeWidth="1.5" />
            <line x1="335" y1="278" x2="315" y2="470" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    )
}

function EarringTemplate1() {
    return (
        <svg viewBox="0 0 400 500" className="tryon__svg-template" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head – side profile */}
            <path d="M240 60 Q280 55 300 80 Q320 110 315 160 Q312 200 290 230 Q270 255 250 265 Q230 275 210 270 Q195 268 185 260 Q170 248 168 240" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Forehead to nose */}
            <path d="M240 60 Q210 65 195 85 Q180 105 175 130 Q168 155 160 170 Q155 180 150 185 Q158 192 168 190 Q172 200 168 215 Q165 228 168 240" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            {/* Ear – highlighted */}
            <path d="M288 130 Q305 135 308 160 Q310 180 300 195 Q290 205 280 200 Q275 192 278 175 Q280 155 285 140" stroke="#b08d57" strokeWidth="2" />
            {/* Earring drop indicator */}
            <line x1="290" y1="200" x2="290" y2="230" stroke="#b08d57" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="290" cy="235" r="5" stroke="#b08d57" strokeWidth="1.5" fill="none" />
            {/* Neck */}
            <path d="M250 265 Q245 290 240 330" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M210 270 Q215 295 220 330" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function EarringTemplate2() {
    return (
        <svg viewBox="0 0 400 500" className="tryon__svg-template" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head – front view, hair pulled back */}
            <ellipse cx="200" cy="130" rx="72" ry="88" stroke="currentColor" strokeWidth="1.5" />
            {/* Hairline */}
            <path d="M130 108 Q200 60 270 108" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Eyes */}
            <ellipse cx="175" cy="122" rx="10" ry="5" stroke="currentColor" strokeWidth="1" />
            <ellipse cx="225" cy="122" rx="10" ry="5" stroke="currentColor" strokeWidth="1" />
            {/* Nose */}
            <path d="M197 138 Q200 148 203 138" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* Mouth */}
            <path d="M188 162 Q200 170 212 162" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            {/* Left ear + earring */}
            <path d="M128 120 Q115 130 113 150 Q112 165 120 175" stroke="#b08d57" strokeWidth="2" />
            <line x1="116" y1="170" x2="116" y2="200" stroke="#b08d57" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="116" cy="206" r="5" stroke="#b08d57" strokeWidth="1.5" fill="none" />
            {/* Right ear + earring */}
            <path d="M272 120 Q285 130 287 150 Q288 165 280 175" stroke="#b08d57" strokeWidth="2" />
            <line x1="284" y1="170" x2="284" y2="200" stroke="#b08d57" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="284" cy="206" r="5" stroke="#b08d57" strokeWidth="1.5" fill="none" />
            {/* Neck */}
            <line x1="182" y1="216" x2="178" y2="290" stroke="currentColor" strokeWidth="1.5" />
            <line x1="218" y1="216" x2="222" y2="290" stroke="currentColor" strokeWidth="1.5" />
            {/* Shoulders */}
            <path d="M178 290 Q140 298 80 320" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M222 290 Q260 298 320 320" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

/* ── Template configs per category ── */
const CATEGORY_TEMPLATES = {
    rings: [
        { component: RingTemplate1, title: 'Palm facing forward', instruction: 'Hold your hand up with fingers spread, showing the ring finger clearly.' },
        { component: RingTemplate2, title: 'Hand relaxed downward', instruction: 'Let your hand hang relaxed with fingers gently curved.' },
    ],
    bracelets: [
        { component: BraceletTemplate, title: 'Show your wrist', instruction: 'Extend your arm with the wrist visible and slightly turned.' },
    ],
    necklaces: [
        { component: NecklaceTemplate1, title: 'Front view – neck & chest', instruction: 'Face the camera showing your neck and collarbone area.' },
        { component: NecklaceTemplate2, title: 'Slight angle – pendant area', instruction: 'Turn slightly to show the necklace area with a V-neckline.' },
    ],
    earrings: [
        { component: EarringTemplate1, title: 'Side profile', instruction: 'Turn to show your profile with the ear visible.' },
        { component: EarringTemplate2, title: 'Front view – both ears', instruction: 'Face forward with hair pulled back to show both ears.' },
    ],
}

export default function TryOnPage() {
    const { id } = useParams()
    const products = useStore((s) => s.products)
    const product = products.find((p) => p.id === id)

    // State
    const [step, setStep] = useState('template')
    const [templateIdx, setTemplateIdx] = useState(0)
    const [captureMode, setCaptureMode] = useState(null)
    const [userPhoto, setUserPhoto] = useState(null)
    const [userPhotoPreview, setUserPhotoPreview] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [error, setError] = useState(null)
    const [cameraStream, setCameraStream] = useState(null)

    const videoRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => { window.scrollTo(0, 0) }, [])

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(t => t.stop())
            }
        }
    }, [cameraStream])

    if (!product) {
        return (
            <div className="tryon" style={{ paddingTop: 'var(--navbar-height)' }}>
                <div className="container empty-state" style={{ paddingTop: '4rem' }}>
                    <h3>Product not found</h3>
                    <Link to="/catalog" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Catalog</Link>
                </div>
            </div>
        )
    }

    const templates = CATEGORY_TEMPLATES[product.category] || CATEGORY_TEMPLATES.rings
    const currentTemplate = templates[templateIdx] || templates[0]
    const TemplateComponent = currentTemplate.component
    const apiReady = isApiConfigured()

    /* ── Handlers ── */

    const nextTemplate = () => setTemplateIdx((i) => (i + 1) % templates.length)
    const prevTemplate = () => setTemplateIdx((i) => (i - 1 + templates.length) % templates.length)

    const handleUploadChoice = () => { setCaptureMode('upload'); setStep('capture') }

    const handleCameraChoice = async () => {
        setCaptureMode('camera')
        setStep('capture')
        setError(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            })
            setCameraStream(stream)
            if (videoRef.current) videoRef.current.srcObject = stream
        } catch {
            setError('Camera access denied. Please allow permission or upload a photo instead.')
            setCaptureMode('upload')
        }
    }

    const handleVideoRef = useCallback((node) => {
        videoRef.current = node
        if (node && cameraStream) node.srcObject = cameraStream
    }, [cameraStream])

    const handleCapturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return
        const v = videoRef.current, c = canvasRef.current
        c.width = v.videoWidth; c.height = v.videoHeight
        c.getContext('2d').drawImage(v, 0, 0)
        const dataUrl = c.toDataURL('image/jpeg', 0.9)
        setUserPhoto(dataUrl); setUserPhotoPreview(dataUrl)
        if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null) }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => { setUserPhoto(reader.result); setUserPhotoPreview(reader.result) }
        reader.readAsDataURL(file)
    }

    const handleGenerate = async () => {
        if (!userPhoto) return
        setStep('generating'); setError(null); setResultImage(null)
        try {
            const productImageBase64 = await imageUrlToBase64(product.images[0])

            const cleanUserPhoto = userPhoto.replace(/^data:image\/\w+;base64,/, '')
            const cleanProductPhoto = productImageBase64.replace(/^data:image\/\w+;base64,/, '')
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY

            const result = await generateJewelryTryOn(apiKey, cleanUserPhoto, cleanProductPhoto, product.category, product.name)
            setResultImage(result); setStep('result')
        } catch (err) {
            console.error('API Try-on failed:', err)
            setError(err.message || 'Something went wrong. Please try again.')
            setStep('capture')
        }
    }

    const handleDownload = () => {
        if (!resultImage) return
        const link = document.createElement('a')
        link.href = resultImage
        link.download = `tryon-${product.name.replace(/\s+/g, '-').toLowerCase()}.png`
        link.click()
    }

    const handleReset = () => {
        setStep('template'); setCaptureMode(null); setUserPhoto(null)
        setUserPhotoPreview(null); setResultImage(null); setError(null)
        if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null) }
    }

    const handleRetake = () => {
        setUserPhoto(null); setUserPhotoPreview(null); setError(null)
        if (captureMode === 'camera') handleCameraChoice()
    }

    /* ── Render ── */
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

                {/* ══ STEP 1: Template ══ */}
                {step === 'template' && (
                    <div className="tryon__template-section animate-fade-in-up">
                        <div className="tryon__template-card">
                            {/* Template carousel */}
                            <div className="tryon__template-carousel">
                                {templates.length > 1 && (
                                    <button className="tryon__carousel-btn tryon__carousel-btn--prev" onClick={prevTemplate}>
                                        <ChevronLeft size={20} />
                                    </button>
                                )}
                                <div className="tryon__template-display">
                                    <TemplateComponent />
                                </div>
                                {templates.length > 1 && (
                                    <button className="tryon__carousel-btn tryon__carousel-btn--next" onClick={nextTemplate}>
                                        <ChevronRight size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Dots */}
                            {templates.length > 1 && (
                                <div className="tryon__carousel-dots">
                                    {templates.map((_, i) => (
                                        <button
                                            key={i}
                                            className={`tryon__carousel-dot ${i === templateIdx ? 'active' : ''}`}
                                            onClick={() => setTemplateIdx(i)}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="tryon__template-info">
                                <h3>{currentTemplate.title}</h3>
                                <p>{currentTemplate.instruction}</p>
                            </div>
                        </div>

                        <div className="tryon__choice">
                            <h3 className="tryon__choice-title">Would you like to upload a photo or take one?</h3>
                            <div className="tryon__choice-buttons">
                                <button className="tryon__choice-btn" onClick={handleUploadChoice}>
                                    <Upload size={28} />
                                    <span className="tryon__choice-btn-title">Upload Photo</span>
                                    <span className="tryon__choice-btn-desc">Choose from your gallery</span>
                                </button>
                                <button className="tryon__choice-btn" onClick={handleCameraChoice}>
                                    <Camera size={28} />
                                    <span className="tryon__choice-btn-title">Take Photo</span>
                                    <span className="tryon__choice-btn-desc">Use your camera</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ STEP 2: Capture ══ */}
                {step === 'capture' && (
                    <div className="tryon__capture-section animate-fade-in-up">
                        <button className="tryon__step-back" onClick={handleReset}>
                            <ArrowLeft size={14} /> Change method
                        </button>

                        {captureMode === 'camera' && !userPhotoPreview && (
                            <div className="tryon__camera-wrap">
                                <div className="tryon__camera-viewfinder">
                                    <video ref={handleVideoRef} autoPlay playsInline muted className="tryon__camera-video" />
                                    <div className="tryon__camera-svg-overlay">
                                        <TemplateComponent />
                                    </div>
                                </div>
                                <button className="btn btn-primary btn-lg tryon__capture-btn" onClick={handleCapturePhoto}>
                                    <Camera size={18} /> Capture Photo
                                </button>
                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </div>
                        )}

                        {captureMode === 'upload' && !userPhotoPreview && (
                            <label className="tryon__dropzone">
                                <Upload size={32} />
                                <span className="tryon__dropzone-title">Upload Your Photo</span>
                                <span className="tryon__dropzone-subtitle">Click to browse • JPG, PNG up to 10MB</span>
                                <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                            </label>
                        )}

                        {userPhotoPreview && (
                            <div className="tryon__photo-preview">
                                <img src={userPhotoPreview} alt="Your photo" />
                                <div className="tryon__photo-actions">
                                    <button className="btn btn-outline" onClick={handleRetake}>
                                        <RotateCcw size={16} /> Retake
                                    </button>
                                    <button className="btn btn-primary btn-lg" onClick={handleGenerate} disabled={!apiReady}>
                                        <Sparkles size={18} /> Generate Try-On
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && <div className="tryon__error-msg"><p>{error}</p></div>}
                    </div>
                )}

                {/* ══ STEP 3: Generating ══ */}
                {step === 'generating' && (
                    <div className="tryon__generating animate-fade-in-up">
                        <Loader2 size={48} className="tryon__spinner" />
                        <h3>Creating your try-on preview…</h3>
                        <p>The AI is generating a realistic image. This may take 15–30 seconds.</p>
                    </div>
                )}

                {/* ══ STEP 4: Result ══ */}
                {step === 'result' && resultImage && (
                    <div className="tryon__result-section animate-fade-in-up">
                        <div className="tryon__result-grid">
                            <div className="tryon__compare-card">
                                <span className="tryon__compare-label">Your Photo</span>
                                <img src={userPhotoPreview} alt="Original" />
                            </div>
                            <div className="tryon__compare-card tryon__compare-card--result">
                                <span className="tryon__compare-label tryon__compare-label--ai">
                                    <Sparkles size={12} /> AI Generated
                                </span>
                                <img src={resultImage} alt="AI Try-On Preview" />
                            </div>
                        </div>
                        <div className="tryon__result-actions">
                            <button className="btn btn-primary" onClick={handleDownload}>
                                <Download size={16} /> Download Result
                            </button>
                            <button className="btn btn-outline" onClick={handleReset}>
                                <RotateCcw size={16} /> Try Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

