const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const BG_MODEL = 'gemini-2.5-flash-image';
const BG_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${BG_MODEL}:generateContent`;

async function test() {
    const requestBody = {
        contents: [{
            parts: [
                { text: "Generate a solid red 10x10 square image." }
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
        const parts = data.candidates[0].content.parts;
        for (let i = 0; i < parts.length; i++) {
            console.log(`Part ${i} keys:`, Object.keys(parts[i]));
            if (parts[i].inlineData) {
                console.log(`Part ${i} inlineData keys:`, Object.keys(parts[i].inlineData));
            }
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
test();
