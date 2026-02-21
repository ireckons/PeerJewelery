/**
 * Gemini API integration for AI Virtual Try-On
 * Uses gemini-2.5-flash-image (Nano Banana) for image generation
 */

const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'
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
I am providing two distinct image parts in this multimodal request:
1. user_hand_photo: A photo of a person's hand or body part (${bodyPart}).
2. jewelry_product_image: A jewelry item (${productName}: ${productDesc}).

Action: Perform a realistic 'In-painting' operation. Do not simply place the jewelry image on top.

Realism Constraints: Generate the output so the jewelry physically wraps around the finger (or appropriate body part), following the curvature. Ensure the lighting, reflections, and shadows on the jewelry match the skin tone and environment of the user's hand/photo.

Placement Hint: Use 'accurate scale' and 'correct proportion.' Specifically, align the ring to the base of the ring finger on the uploaded hand.

Output: The final result must be a single, merged photorealistic image where the jewelry looks worn naturally.`

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
 * Generate a new background for a product image using the Gemini API
 */
export async function generateBackground(productImageBase64, stylePrompt) {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.')
    }

    const prompt = `You are a professional jewelry product photography AI.
I am providing a raw image of a jewelry product.

Action: Perfectly extract the jewelry item from its current background and place it onto a new background according to the styling instructions below. Ensure the lighting, reflections, and shadows look highly realistic and match the new environment perfectly. Do not alter the jewelry itself.

Styling Instructions:
${stylePrompt}

Output: A single, polished photorealistic image of the product on its new background. No text.`

    const cleanBase64 = (b64) => b64.replace(/^data:image\/\w+;base64,/, '')

    const imageToProcess = productImageBase64.startsWith('data:')
        ? productImageBase64
        : await imageUrlToBase64(productImageBase64);

    const BG_MODEL = 'gemini-2.5-flash-image';
    const BG_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${BG_MODEL}:generateContent`;

    const requestBody = {
        contents: [{
            parts: [
                { text: prompt },
                {
                    inline_data: {
                        mime_type: 'image/jpeg',
                        data: cleanBase64(imageToProcess)
                    }
                }
            ]
        }],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
        }
    }

    const response = await fetch(`${BG_API_URL}?key=${GEMINI_API_KEY}`, {
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
            const inlineData = part.inlineData || part.inline_data;
            if (inlineData) {
                const mimeType = inlineData.mimeType || inlineData.mime_type || 'image/jpeg';
                return `data:${mimeType};base64,${inlineData.data}`;
            }
        }
    }

    if (data.promptFeedback?.blockReason) {
        throw new Error(`Generation blocked: ${data.promptFeedback.blockReason}`)
    }

    throw new Error('No background was generated. Please try again.')
}

