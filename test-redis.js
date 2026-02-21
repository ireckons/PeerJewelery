import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const testRedis = async () => {
    try {
        const client = createClient({ url: process.env.REDIS_URL });
        client.on('error', (err) => console.log('Redis error:', err));
        await client.connect();
        console.log('Successfully connected to Redis!');
        const keys = await client.keys('peerjewlery:*');
        console.log('Keys in QA DB:', keys);
        if (keys.includes('peerjewlery:products')) {
            const data = await client.get('peerjewlery:products');
            const products = JSON.parse(data);
            console.log(`Successfully fetched ${products.length} products!`);
        }
        await client.quit();
    } catch (e) {
        console.error('Test failed:', e);
    }
}

testRedis();
