const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const BG_MODEL = 'gemini-2.5-flash-image';
const BG_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${BG_MODEL}:generateContent`;

async function test() {
    console.log("Testing generation with key:", GEMINI_API_KEY.substring(0, 5) + "...");
    const requestBody = {
        contents: [{
            parts: [
                { text: "Generate a solid blue 100x100 square image." }
            ]
        }],
        generationConfig: {
            responseModalities: ['TEXT', 'IMAGE']
        }
    };

    try {
        const response = await fetch(`${BG_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await response.json();
        if (!response.ok) {
            console.error("API Error:", JSON.stringify(data, null, 2));
        } else {
            console.log("Success! Generated image parts count:", data.candidates[0]?.content?.parts?.length);
            console.log("Mime type:", data.candidates[0]?.content?.parts?.[0]?.inline_data?.mime_type);
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
test();
