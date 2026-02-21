import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const CATEGORIES_FILE = path.join(__dirname, 'data', 'categories.json');

// Initialize Redis Client
const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();
console.log('Connected to Redis DB QA');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Helper to read products from Redis
const getProducts = async () => {
    try {
        const data = await redisClient.get('peerjewlery:products');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('Error reading products from Redis:', err);
        return [];
    }
};

// Helper to write products to Redis
const saveProducts = async (products) => {
    try {
        await redisClient.set('peerjewlery:products', JSON.stringify(products));
        return true;
    } catch (err) {
        console.error('Error saving products to Redis:', err);
        return false;
    }
};

// Helper to read categories from Redis
const getCategories = async () => {
    try {
        const data = await redisClient.get('peerjewlery:categories');
        return data ? JSON.parse(data) : ["rings", "necklaces", "earrings", "bracelets"];
    } catch (err) {
        console.error('Error reading categories from Redis:', err);
        return ["rings", "necklaces", "earrings", "bracelets"];
    }
};

// Helper to write categories to Redis
const saveCategories = async (categories) => {
    try {
        await redisClient.set('peerjewlery:categories', JSON.stringify(categories));
        return true;
    } catch (err) {
        console.error('Error saving categories to Redis:', err);
        return false;
    }
};

// Migration Logic
const migrateDataToRedis = async () => {
    try {
        const productsEmpty = !(await redisClient.exists('peerjewlery:products'));
        const categoriesEmpty = !(await redisClient.exists('peerjewlery:categories'));

        if (productsEmpty && fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            await redisClient.set('peerjewlery:products', data);
            console.log('Migrated products.json to Redis.');
        }

        if (categoriesEmpty && fs.existsSync(CATEGORIES_FILE)) {
            const data = fs.readFileSync(CATEGORIES_FILE, 'utf8');
            await redisClient.set('peerjewlery:categories', data);
            console.log('Migrated categories.json to Redis.');
        }
    } catch (error) {
        console.error('Error during data migration:', error);
    }
}
await migrateDataToRedis();

// --- API ROUTES ---

// GET all products
app.get('/api/products', async (req, res) => {
    const products = await getProducts();
    res.json(products);
});

// POST a new product
app.post('/api/products', async (req, res) => {
    const newProduct = req.body;
    const products = await getProducts();

    // Ensure ID is a string
    if (!newProduct.id) {
        newProduct.id = Date.now().toString();
    }

    // Auto-folder image handling
    if (newProduct.images && Array.isArray(newProduct.images)) {
        const slugifiedName = newProduct.name ? newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : newProduct.id;
        const categoryFolder = newProduct.category ? newProduct.category.toLowerCase() : 'uncategorized';
        // Unique string to avoid folder collisions
        const uniqueSuffix = Date.now().toString().slice(-6);
        const productFolderName = `${slugifiedName}-${uniqueSuffix}`;

        const relativeFolderPath = `/products/${categoryFolder}/${productFolderName}`;
        const absoluteFolderPath = path.join(__dirname, 'public', 'products', categoryFolder, productFolderName);

        let folderCreated = false;

        newProduct.images = newProduct.images.map((img, index) => {
            // Check if the image is a base64 data URL
            if (typeof img === 'string' && img.startsWith('data:')) {
                if (!folderCreated) {
                    fs.mkdirSync(absoluteFolderPath, { recursive: true });
                    folderCreated = true;
                }

                // Extract base64 data and extension for image or video
                const matches = img.match(/^data:(image|video)\/([a-zA-Z0-9]+);base64,(.+)$/);

                if (matches && matches.length === 4) {
                    let type = matches[1]; // image or video
                    let ext = matches[2];
                    // Convert jpeg to jpg for cleaner filenames
                    if (ext === 'jpeg') ext = 'jpg';

                    const base64Data = matches[3];
                    const buffer = Buffer.from(base64Data, 'base64');

                    const filename = `${index + 1}.${ext}`;
                    const absoluteFilePath = path.join(absoluteFolderPath, filename);

                    try {
                        fs.writeFileSync(absoluteFilePath, buffer);
                        // Return the web path to replace the base64 string in JSON
                        return `${relativeFolderPath}/${filename}`;
                    } catch (err) {
                        console.error(`Failed to save ${type}:`, err);
                        // If save fails, fallback to base64
                        return img;
                    }
                }
            }
            // If not base64 or extraction failed, keep original
            return img;
        });
    }

    products.unshift(newProduct);

    if (await saveProducts(products)) {
        res.status(201).json(newProduct);
    } else {
        res.status(500).json({ error: 'Failed to save product' });
    }
});

// PUT (update) an existing product
app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    let products = await getProducts();

    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Auto-folder image handling for updates
    if (updates.images && Array.isArray(updates.images)) {
        const slugifiedName = updates.name ? updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : id;
        const categoryFolder = updates.category ? updates.category.toLowerCase() : 'uncategorized';
        // Unique string to avoid folder collisions
        const uniqueSuffix = Date.now().toString().slice(-6);

        // Let's try to infer if a folder already exists based on old images, or create a new one
        let productFolderName = `${slugifiedName}-${uniqueSuffix}`;
        let relativeFolderPath = `/products/${categoryFolder}/${productFolderName}`;

        // Try to find an existing valid image path to reuse its folder
        const existingValidImage = products[index].images?.find(img => typeof img === 'string' && img.startsWith('/products/'));
        if (existingValidImage) {
            // e.g. /products/earrings/pearl-drop-123/1.jpg
            const parts = existingValidImage.split('/');
            if (parts.length >= 4) {
                relativeFolderPath = parts.slice(0, parts.length - 1).join('/');
            }
        }

        const absoluteFolderPath = path.join(__dirname, 'public', ...relativeFolderPath.split('/').filter(Boolean));
        let folderCreated = false;

        updates.images = updates.images.map((img, i) => {
            // Check if it is a base64 data URL
            if (typeof img === 'string' && img.startsWith('data:')) {
                if (!folderCreated && !fs.existsSync(absoluteFolderPath)) {
                    fs.mkdirSync(absoluteFolderPath, { recursive: true });
                    folderCreated = true;
                }

                // Extract base64 data and extension
                const matches = img.match(/^data:(image|video)\/([a-zA-Z0-9]+);base64,(.+)$/);

                if (matches && matches.length === 4) {
                    let type = matches[1];
                    let ext = matches[2];
                    // Convert jpeg to jpg for cleaner filenames
                    if (ext === 'jpeg') ext = 'jpg';

                    const base64Data = matches[3];
                    const buffer = Buffer.from(base64Data, 'base64');

                    // Generate a unique filename to avoid overwrites
                    const filename = `new_${Date.now()}_${i}.${ext}`;
                    const absoluteFilePath = path.join(absoluteFolderPath, filename);

                    try {
                        fs.writeFileSync(absoluteFilePath, buffer);
                        // Return the web path to replace the base64 string in JSON
                        return `${relativeFolderPath}/${filename}`;
                    } catch (err) {
                        console.error(`Failed to save ${type} during update:`, err);
                        // If save fails, fallback to base64
                        return img;
                    }
                }
            }
            // If not base64 or extraction failed, keep original
            return img;
        });
    }

    // Merge updates
    products[index] = { ...products[index], ...updates, id }; // Keep original ID

    if (await saveProducts(products)) {
        res.json(products[index]);
    } else {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// PATCH (reorder) a product
app.patch('/api/products/:id/reorder', async (req, res) => {
    const { id } = req.params;
    const { direction, category } = req.body;
    let products = await getProducts();

    if (!category || (direction !== 'up' && direction !== 'down')) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    // Find all products in this category to determine visual order
    const categoryProducts = products.filter(p => p.category === category);

    // Find the specific product's index *within its category*
    const currentCatIndex = categoryProducts.findIndex(p => p.id === id);
    if (currentCatIndex === -1) {
        return res.status(404).json({ error: 'Product not found in this category' });
    }

    // Determine target index within the category array
    let targetCatIndex = -1;
    if (direction === 'up' && currentCatIndex > 0) {
        targetCatIndex = currentCatIndex - 1;
    } else if (direction === 'down' && currentCatIndex < categoryProducts.length - 1) {
        targetCatIndex = currentCatIndex + 1;
    }

    // If we can't move it, just return success (no-op)
    if (targetCatIndex === -1) {
        return res.json({ success: true, message: 'Already at the edge' });
    }

    // Now find their actual indices in the main, full products array
    const productAMainIndex = products.findIndex(p => p.id === categoryProducts[currentCatIndex].id);
    const productBMainIndex = products.findIndex(p => p.id === categoryProducts[targetCatIndex].id);

    // Swap them in the main array
    const temp = products[productAMainIndex];
    products[productAMainIndex] = products[productBMainIndex];
    products[productBMainIndex] = temp;

    if (await saveProducts(products)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to reorder products' });
    }
});

// PATCH (reorder full category)
app.patch('/api/products/reorder-category', async (req, res) => {
    const { category, orderedIds } = req.body;
    let products = await getProducts();

    if (!category || !Array.isArray(orderedIds)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    const isAll = category === 'All';

    // Isolate products in this category and others
    const categoryProducts = products.filter(p => isAll || p.category === category);

    // Reorder the category products based on the provided IDs
    const reorderedCategoryProducts = [];

    // First, add products in the order specified by orderedIds
    orderedIds.forEach(id => {
        const product = categoryProducts.find(p => p.id === id);
        if (product) {
            reorderedCategoryProducts.push(product);
        }
    });

    // Then, append any products that might have been missed in orderedIds (safety net)
    categoryProducts.forEach(p => {
        if (!orderedIds.includes(p.id)) {
            reorderedCategoryProducts.push(p);
        }
    });

    // Combine them back together. 
    // To preserve original global ordering somewhat, we can replace the elements in-place or append.
    // Given the structure, rebuilding the array by replacing category items in their original slots is best.

    // Identify positions of the original category products
    const positions = products.map((p, index) => (isAll || p.category === category) ? index : -1).filter(index => index !== -1);

    // Insert the newly ordered products back into those positions
    positions.forEach((globalIndex, i) => {
        if (reorderedCategoryProducts[i]) {
            products[globalIndex] = reorderedCategoryProducts[i];
        }
    });

    if (await saveProducts(products)) {
        res.json({ success: true, products: reorderedCategoryProducts });
    } else {
        res.status(500).json({ error: 'Failed to reorder products' });
    }
});

// DELETE a product
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    let products = await getProducts();

    const initialLength = products.length;
    products = products.filter((p) => p.id !== id);

    if (products.length === initialLength) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (await saveProducts(products)) {
        res.status(204).send();
    } else {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// --- CATEGORIES API ---

// GET all categories
app.get('/api/categories', async (req, res) => {
    const categories = await getCategories();
    res.json(categories);
});

// POST a new category
app.post('/api/categories', async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Category name is required' });
    }

    const categories = await getCategories();
    const normalizedName = name.trim().toLowerCase();

    if (categories.includes(normalizedName)) {
        return res.status(400).json({ error: 'Category already exists' });
    }

    categories.push(normalizedName);

    if (await saveCategories(categories)) {
        res.status(201).json({ success: true, category: normalizedName, categories });
    } else {
        res.status(500).json({ error: 'Failed to save category' });
    }
});

// DELETE a category
app.delete('/api/categories/:name', async (req, res) => {
    const { name } = req.params;
    let categories = await getCategories();

    const normalizedName = name.trim().toLowerCase();

    if (!categories.includes(normalizedName)) {
        return res.status(404).json({ error: 'Category not found' });
    }

    categories = categories.filter(c => c !== normalizedName);

    if (await saveCategories(categories)) {
        res.json({ success: true, categories });
    } else {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// Initialize server
app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
    console.log(`Data is synced with Redis DB QoS.`);
});
