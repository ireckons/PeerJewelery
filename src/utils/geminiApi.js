/**
 * Gemini API integration for AI Virtual Try-On
 * Uses gemini-2.5-flash-image (Nano Banana) for image generation
 */

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-image'
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

/**
 * Check if the API is configured
 */
export function isApiConfigured() {
    return !!GEMINI_API_KEY
}

/**
 * Generate a virtual try-on image using the Gemini API
 * Sends user photo + product image → receives generated try-on image
 */
export async function generateTryOn(userPhotoBase64, productImageBase64, category, product) {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.')
    }

    const bodyPartMap = {
        rings: 'hand/finger',
        necklaces: 'neck/chest area',
        earrings: 'ears',
        bracelets: 'wrist'
    }

    const bodyPart = bodyPartMap[category] || 'appropriate body part'
    const itemName = category === 'rings' ? 'ring'
        : category === 'necklaces' ? 'necklace'
            : category === 'earrings' ? 'earring'
                : category === 'bracelets' ? 'bracelet'
                    : 'jewelry'

    const productName = product?.name || itemName
    const productDesc = product?.description || `a beautiful ${itemName}`

    const prompt = `You are a professional jewelry virtual try-on assistant.
I'm providing two images:
1. A photo of a person showing their ${bodyPart}
2. A jewelry item (${productName}: ${productDesc})

Generate a photorealistic image that shows the ${itemName} naturally placed on the person's ${bodyPart}.

CRITICAL INSTRUCTION:
- You must return an IMAGE.
- Do NOT provide a text description.
- Do NOT output any text like "Here is the image".
- Just generate the visual result.

Requirements:
- Maintain the original lighting, skin tone, and environment of the person's photo
- Scale the jewelry appropriately to fit naturally
- Add natural shadows and reflections on the jewelry
- The result should look like a real photograph, not a digital overlay
- Keep the overall composition and background of the original photo
- Make sure the jewelry blends seamlessly`

    // Remove data URL prefix
    const cleanBase64 = (b64) => b64.replace(/^data:image\/\w+;base64,/, '')

    const requestBody = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inline_data: {
                        mime_type: 'image/jpeg',
                        data: cleanBase64(userPhotoBase64)
                    }
                },
                {
                    inline_data: {
                        mime_type: 'image/jpeg',
                        data: cleanBase64(productImageBase64)
                    }
                }
            ]
        }],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
        }
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const msg = errorData.error?.message || `API request failed (${response.status})`
        throw new Error(msg)
    }

    const data = await response.json()

    // Extract generated image from response
    const candidates = data.candidates || []
    for (const candidate of candidates) {
        const parts = candidate.content?.parts || []
        for (const part of parts) {
            if (part.inline_data) {
                return `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`
            }
        }
    }


    // Check for safety ratings or text response
    const textPart = data.candidates?.[0]?.content?.parts?.find(p => p.text)?.text
    if (textPart) {
        throw new Error(`Model returned text instead of image: ${textPart.substring(0, 100)}...`)
    }

    if (data.promptFeedback?.blockReason) {
        throw new Error(`Generation blocked: ${data.promptFeedback.blockReason}`)
    }

    throw new Error('No image was generated. Please try again with a clearer photo.')
}

/**
 * Convert a file to base64
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

/**
 * Load an image URL as base64
 */
export async function imageUrlToBase64(url) {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

/**
 * Analyze hand image to get landmarks for placement
 * Using gemini-1.5-flash which is fast and supports vision
 */
export async function detectHandLandmarks(imageBase64) {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY

    if (!apiKey) {
        console.warn('No API key found for hand detection')
        return null
    }

    const prompt = `Analyze this image of a hand. Return a RAW JSON object with coordinates for jewelry placement.
    Do not use markdown.
    Structure:
    {
        "ring_finger": {
             "tip_x": number (0-1000), 
             "tip_y": number (0-1000), 
             "base_x": number (0-1000), 
             "base_y": number (0-1000), 
             "width": number (0-1000)
        },
        "wrist": {
             "center_x": number (0-1000),
             "center_y": number (0-1000),
             "width": number (0-1000)
        }
    }
    Coordinates are 0-1000 relative to image (0,0 top-left).
    If hand not clear, return null.`

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: 'image/jpeg', data: cleanBase64 } }
                    ]
                }]
            })
        })

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (!text) return null

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()
        return JSON.parse(jsonStr)

    } catch (err) {
        console.error('Hand detection failed:', err)
        return null
    }
}
