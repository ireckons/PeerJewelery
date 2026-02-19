import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORE_FILE = path.join(__dirname, '../src/store/store.js');
const PUBLIC_PRODUCTS_DIR = path.join(__dirname, '../public/products');

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.webp'];

const updateStore = () => {
    let content = fs.readFileSync(STORE_FILE, 'utf-8');

    // We need to parse product data to know WHERE to look (Category + Name)
    // Then replace the 'images: []' part.

    // Since replacing via regex inside a loop on file content is tricky (positions shift),
    // we'll rebuild the products array string or use a specific regex replacement strategy.

    // Strategy: Find each product block, extract ID/Name/Category, look for images, construct new images string, replace in block.

    const productBlockRegex = /(\{\s*id:\s*'(\d+)',[\s\S]*?name:\s*'([^']+)',[\s\S]*?category:\s*'([^']+)',[\s\S]*?images:\s*\[)([\s\S]*?)(\])/g;

    let updatedContent = content.replace(productBlockRegex, (match, prefix, id, name, category, currentImages, suffix) => {
        // match: full block up to closing bracket of images array? 
        // Logic:
        // Group 1: Prefix up to `images: [`
        // Group 2: ID
        // Group 3: Name
        // Group 4: Category
        // Group 5: Content inside `images: [...]`
        // Group 6: `]`

        // This regex assumes a specific order (id, name, ... category ... images). 
        // store.js seems consistent.

        const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const productDir = path.join(PUBLIC_PRODUCTS_DIR, category, safeName);

        if (fs.existsSync(productDir)) {
            let files = fs.readdirSync(productDir)
                .filter(file => EXTENSIONS.includes(path.extname(file).toLowerCase()));

            if (files.length > 0) {
                // Sort files numerically if possible (1.jpg, 2.jpg, 10.jpg)
                files.sort((a, b) => {
                    const numA = parseInt(a);
                    const numB = parseInt(b);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                    }
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });

                const newImages = files.map(f => `'/products/${category}/${safeName}/${f}'`).join(', ');
                console.log(`Updated ${name} (${category}): Found ${files.length} images.`);
                return `${prefix}${newImages}${suffix}`;
            }
        } else {
            // Check ID folder fallback?
            const idDir = path.join(PUBLIC_PRODUCTS_DIR, id);
            if (fs.existsSync(idDir)) {
                let files = fs.readdirSync(idDir)
                    .filter(file => EXTENSIONS.includes(path.extname(file).toLowerCase()));
                if (files.length > 0) {
                    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
                    const newImages = files.map(f => `'/products/${id}/${f}'`).join(', ');
                    console.log(`Updated ${name} (ID fallback): Found ${files.length} images.`);
                    return `${prefix}${newImages}${suffix}`;
                }
            }
        }

        return match; // No changes
    });

    // Also handle cases where keys might be in different order? 
    // The previous regex imposed an order. Let's try a more robust approach if no changes detected.
    // Actually, store.js is consistent.

    if (content !== updatedContent) {
        // Auto-bump version to force browser cache refresh
        const versionRegex = /const\s+PRODUCTS_VERSION\s*=\s*'(\d+)'/;
        const versionMatch = updatedContent.match(versionRegex);

        if (versionMatch) {
            const currentVersion = parseInt(versionMatch[1]);
            const newVersion = currentVersion + 1;
            updatedContent = updatedContent.replace(versionRegex, `const PRODUCTS_VERSION = '${newVersion}'`);
            console.log(`Bumped PRODUCTS_VERSION to '${newVersion}' to force cache refresh.`);
        }

        fs.writeFileSync(STORE_FILE, updatedContent, 'utf-8');
        console.log('store.js updated successfully!');
    } else {
        console.log('No changes detected in store.js.');
    }
};

updateStore();
