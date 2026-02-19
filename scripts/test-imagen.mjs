import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_FILE = path.join(__dirname, '../.env');

// Read .env
const envContent = fs.readFileSync(ENV_FILE, 'utf-8');
const keyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
const API_KEY = keyMatch ? keyMatch[1].trim() : null;

if (!API_KEY) {
    console.error('API Key not found in .env');
    process.exit(1);
}

console.log('Testing Imagen with Key:', API_KEY.substring(0, 10) + '...');

// Function to make request
const testModel = (modelName, payload) => {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${modelName}:predict?key=${API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(body || '{}') });
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
};

/* 
 * Try standard Imagen structure for Vertex (often works for AI Studio if enabled)
 * Body: { instances: [{ prompt: "..." }], parameters: ... }
 */
const run = async () => {
    const payload = {
        instances: [
            { prompt: "A photorealistic image of a diamond ring on a table." }
        ],
        parameters: {
            sampleCount: 1
        }
    };

    console.log('--- Testing imagen-3.0-generate-001 ---');
    try {
        const res = await testModel('imagen-3.0-generate-001', payload);
        console.log('Status:', res.status);
        if (res.status === 200) {
            console.log('Success! Image generated.');
            // console.log(JSON.stringify(res.body, null, 2));
        } else {
            console.log('Error:', JSON.stringify(res.body, null, 2));
        }
    } catch (e) {
        console.error('Request failed:', e);
    }
};

run();
