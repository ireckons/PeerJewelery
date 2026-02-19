import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_FILE = path.join(__dirname, '../src/store/store.js');
const PUBLIC_PRODUCTS_DIR = path.join(__dirname, '../public/products');

// Helper to ensure directory exists
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
    }
};

const setupFolders = () => {
    if (!fs.existsSync(STORE_FILE)) {
        console.error('Store file not found!');
        return;
    }

    const content = fs.readFileSync(STORE_FILE, 'utf-8');

    // Robust Extraction Logic
    const products = [];
    const productBlockRegex = /\{[\s\S]*?id:[\s\S]*?\}/g;
    let blockMatch;

    while ((blockMatch = productBlockRegex.exec(content)) !== null) {
        const block = blockMatch[0];
        const idMatch = /id:\s*'(\d+)'/.exec(block);
        const nameMatch = /name:\s*'([^']+)'/.exec(block);
        const categoryMatch = /category:\s*'([^']+)'/.exec(block);

        if (idMatch && nameMatch && categoryMatch) {
            products.push({
                id: idMatch[1],
                name: nameMatch[1],
                category: categoryMatch[1]
            });
        }
    }

    console.log(`Found ${products.length} products in store.js`);

    products.forEach(p => {
        // Sanitize name for folder use: "Marquise Cut Solitaire" -> "marquise-cut-solitaire"
        const safeName = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const productDir = path.join(PUBLIC_PRODUCTS_DIR, p.category, safeName);

        ensureDir(productDir);

        // Check for old ID-based folder
        const oldIdDir = path.join(PUBLIC_PRODUCTS_DIR, p.id);
        if (fs.existsSync(oldIdDir)) {
            console.log(`Note: Old ID folder exists for ${p.name}: ${oldIdDir}`);
            // We won't move files automatically to be safe, but we log it.
        }
    });

    console.log('Category/Name folder structure created.');
};

setupFolders();
