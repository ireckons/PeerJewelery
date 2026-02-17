/**
 * Gemini API integration for AI Virtual Try-On
 * Uses gemini-2.5-flash-preview-image-generation for cost-efficient image generation
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent'

/**
 * Generate a virtual try-on image using the Gemini API
 * @param {string} userPhotoBase64 - Base64 encoded user photo
 * @param {string} productImageBase64 - Base64 encoded product/jewelry image
 * @param {string} itemType - Type of jewelry: 'ring', 'necklace', or 'earring'
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<string>} - Base64 encoded result image
 */
export async function generateTryOn(userPhotoBase64, productImageBase64, itemType, apiKey) {
    const bodyPartMap = {
        rings: 'hand/finger',
        necklaces: 'neck/chest area',
        earrings: 'ears'
    }

    const bodyPart = bodyPartMap[itemType] || 'appropriate body part'

    const prompt = `You are a professional jewelry virtual try-on assistant. 
I'm providing two images:
1. A photo of a person showing their ${bodyPart}
2. A jewelry item (${itemType.slice(0, -1)})

Please generate a photorealistic image that shows the jewelry naturally placed on the person's ${bodyPart}. 
Requirements:
- Maintain the original lighting conditions and environment of the person's photo
- Scale the jewelry appropriately to fit the person
- Ensure natural shadows and reflections on the jewelry
- The result should look like a real photograph, not a digital overlay
- Preserve the original skin tone and texture
- Make the jewelry blend seamlessly with the existing scene`

    // Remove data URL prefix if present
    const cleanBase64 = (b64) => b64.replace(/^data:image\/\w+;base64,/, '')

    const requestBody = {
        contents: [
            {
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
            }
        ],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
        }
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Extract the generated image from the response
    const candidates = data.candidates || []
    for (const candidate of candidates) {
        const parts = candidate.content?.parts || []
        for (const part of parts) {
            if (part.inline_data) {
                return `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`
            }
        }
    }

    throw new Error('No image was generated. Please try again with a clearer photo.')
}

/**
 * Get the stored Gemini API key from localStorage
 */
export function getApiKey() {
    return localStorage.getItem('peer-gemini-api-key') || ''
}

/**
 * Save the Gemini API key to localStorage
 */
export function setApiKey(key) {
    localStorage.setItem('peer-gemini-api-key', key)
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
