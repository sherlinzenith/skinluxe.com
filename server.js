const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skinluxe';
let db;


console.log('=== MONGODB CONFIGURATION CHECK ===');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
    console.log('MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 20) + '...');
}
console.log('MongoDB package available:', require('mongodb') ? 'Yes' : 'No');

async function connectDB() {
    try {
        console.log(' Attempting MongoDB connection...');
        console.log('Connection string:', process.env.MONGODB_URI ? 'Present' : 'MISSING!');
        
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db('skinluxe');
        console.log('Connected to MongoDB successfully!');
        
        const collections = await db.listCollections().toArray();
        console.log(' Available collections:', collections.map(c => c.name));
        
        
        const productCount = await db.collection('products').countDocuments();
        console.log(` Products in MongoDB: ${productCount}`);
        
    } catch (error) {
        console.error(' MongoDB connection FAILED:', error.message);
        console.error('Full error:', error);
    }
}
async function initializeProducts() {
    try {
        if (!db) {
            console.log(' MongoDB not connected - skipping initialization');
            return;
        }
        
        const productCount = await db.collection('products').countDocuments();
        console.log(`📊 Current products in MongoDB: ${productCount}`);
        
        if (productCount === 0) {
            console.log('🔄 Initializing MongoDB with default products...');
            const defaultProducts = [
                {
                    name: "Hydrating Face Serum",
                    description: "Deeply moisturizing serum with hyaluronic acid",
                    fullDescription: "Our Hydrating Face Serum is specially formulated with hyaluronic acid to provide intense moisture to your skin. Perfect for all skin types, this serum helps to plump and hydrate your skin, reducing the appearance of fine lines and wrinkles.",
                    price: 1299,
                    originalPrice: 1499,
                    discount: 13,
                    image: "https://i.pinimg.com/736x/2c/08/66/2c0866e441664605b01a59c44beb7279.jpg",
                    isBestSeller: true,
                    isNew: false,
                    reviews: 86675,
                    sizes: [
                        { value: '30ml', label: '30ml' },
                        { value: '50ml', label: '50ml' },
                        { value: '100ml', label: '100ml' }
                    ],
                    features: [
                        "Contains hyaluronic acid for deep hydration",
                        "Suitable for all skin types",
                        "Non-greasy formula",
                        "Dermatologist tested",
                        "Cruelty-free"
                    ],
                    createdAt: new Date().toISOString()
                },
                {
                    name: "Vitamin C Cream",
                    description: "Brightening cream with antioxidant protection",
                    fullDescription: "Enhance your skin's radiance with our Vitamin C Cream. Packed with antioxidants, this cream helps to brighten your complexion, reduce dark spots, and protect your skin from environmental damage.",
                    price: 1599,
                    originalPrice: 1899,
                    discount: 16,
                    image: "https://i.pinimg.com/1200x/57/18/82/5718822e29549d7ef4ece3a403f0c5a8.jpg",
                    isBestSeller: true,
                    isNew: false,
                    reviews: 72345,
                    sizes: [
                        { value: '50ml', label: '50ml' },
                        { value: '100ml', label: '100ml' }
                    ],
                    features: [
                        "Brightens and evens skin tone",
                        "Rich in antioxidants",
                        "Reduces appearance of dark spots",
                        "Protects against environmental stress",
                        "Lightweight texture"
                    ],
                    createdAt: new Date().toISOString()
                },
                {
                    name: "Gentle Cleanser",
                    description: "Soothing cleanser for all skin types",
                    fullDescription: "Our Gentle Cleanser is perfect for daily use. It effectively removes dirt and impurities without stripping your skin's natural oils. Formulated with soothing ingredients, it's ideal for sensitive skin.",
                    price: 799,
                    originalPrice: 899,
                    discount: 11,
                    image: "https://i.pinimg.com/1200x/b4/37/ea/b437ea39ad177d37ca76cb3a7e25b5fa.jpg",
                    isBestSeller: false,
                    isNew: false,
                    reviews: 45678,
                    sizes: [
                        { value: '150ml', label: '150ml' },
                        { value: '250ml', label: '250ml' }
                    ],
                    features: [
                        "Gentle on sensitive skin",
                        "pH balanced formula",
                        "Removes makeup effectively",
                        "Non-drying formula",
                        "Soothing and calming"
                    ],
                    createdAt: new Date().toISOString()
                },
                {
                    name: "Night Repair Oil",
                    description: "Overnight treatment for skin regeneration",
                    fullDescription: "Wake up to rejuvenated skin with our Night Repair Oil. This intensive overnight treatment works while you sleep to repair and restore your skin's natural barrier, leaving you with a radiant glow in the morning.",
                    price: 2199,
                    originalPrice: 2599,
                    discount: 15,
                    image: "https://i.pinimg.com/736x/62/07/d7/6207d7e957dc3c58f028b60195bdbed6.jpg",
                    isBestSeller: false,
                    isNew: true,
                    reviews: 23456,
                    sizes: [
                        { value: '30ml', label: '30ml' },
                        { value: '50ml', label: '50ml' }
                    ],
                    features: [
                        "Overnight skin regeneration",
                        "Strengthens skin barrier",
                        "Reduces fine lines",
                        "Non-comedogenic",
                        "Fast absorbing"
                    ],
                    createdAt: new Date().toISOString()
                },
                {
                    name: "SPF 50 Sunscreen",
                    description: "Lightweight daily protection",
                    fullDescription: "Protect your skin from harmful UV rays with our lightweight SPF 50 Sunscreen. This non-greasy formula provides broad-spectrum protection while keeping your skin hydrated throughout the day.",
                    price: 899,
                    originalPrice: 999,
                    discount: 10,
                    image: "https://i.pinimg.com/1200x/d5/48/26/d54826343b2277addbc534c5d21fc9f0.jpg",
                    isBestSeller: false,
                    isNew: false,
                    reviews: 67890,
                    sizes: [
                        { value: '50ml', label: '50ml' },
                        { value: '100ml', label: '100ml' }
                    ],
                    features: [
                        "Broad-spectrum SPF 50 protection",
                        "Lightweight and non-greasy",
                        "Water resistant",
                        "Suitable for sensitive skin",
                        "No white cast"
                    ],
                    createdAt: new Date().toISOString()
                },
                {
                    name: "Eye Cream",
                    description: "Reduces puffiness and dark circles",
                    fullDescription: "Target the delicate eye area with our specialized Eye Cream. Formulated with caffeine and vitamin K, it helps to reduce puffiness, dark circles, and fine lines for brighter, more youthful-looking eyes.",
                    price: 1499,
                    originalPrice: 1799,
                    discount: 17,
                    image: "https://i.pinimg.com/1200x/59/58/d2/5958d2ca2f50f7f6ff13f704ab8e7344.jpg",
                    isBestSeller: false,
                    isNew: true,
                    reviews: 34567,
                    sizes: [
                        { value: '15ml', label: '15ml' },
                        { value: '30ml', label: '30ml' }
                    ],
                    features: [
                        "Reduces puffiness and dark circles",
                        "Contains caffeine and vitamin K",
                        "Suitable for sensitive eye area",
                        "Fast absorbing",
                        "Fragrance-free"
                    ],
                    createdAt: new Date().toISOString()
                }
            ];
            
            const result = await db.collection('products').insertMany(defaultProducts);
            console.log(` Added ${result.insertedCount} default products to MongoDB`);
        }
    } catch (error) {
        console.error('Error initializing products:', error);
    }
}

// Routes
app.get('/api/products', async (req, res) => {
    try {
        console.log(' GET /api/products - Fetching from MongoDB...');
        
        if (!db) {
            console.log(' MongoDB not connected - returning empty array');
            return res.json([]);
        }
        
        const products = await db.collection('products').find().toArray();
        console.log(` Found ${products.length} products in MongoDB`);
        
        res.json(products);
    } catch (error) {
        console.error(' MongoDB fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        console.log(' POST /api/products - Adding to MongoDB...');
        console.log('Request body:', req.body);
        
        if (!db) {
            console.log(' MongoDB not connected - cannot add product');
            return res.status(500).json({ error: 'Database not connected' });
        }
        
        const newProduct = {
            ...req.body,
            createdAt: new Date().toISOString()
        };
        
        const result = await db.collection('products').insertOne(newProduct);
        newProduct._id = result.insertedId;
        
        console.log(' Product added to MongoDB:', newProduct._id);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(' Error adding product to MongoDB:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        console.log(` DELETE /api/products/${req.params.id}`);
        
        if (!db) {
            console.log(' MongoDB not connected - cannot delete product');
            return res.status(500).json({ error: 'Database not connected' });
        }
        
        const result = await db.collection('products').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (result.deletedCount === 1) {
            console.log(' Product deleted from MongoDB');
            res.json({ message: 'Product deleted successfully' });
        } else {
            console.log(' Product not found in MongoDB');
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(' Error deleting product from MongoDB:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

app.get('/api/test', async (req, res) => {
    try {
        let productCount = 0;
        if (db) {
            productCount = await db.collection('products').countDocuments();
        }
        
        res.json({ 
            message: 'Server is working!', 
            productCount: productCount,
            databaseConnected: !!db,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({ 
            message: 'Server is working!', 
            productCount: 0,
            databaseConnected: false,
            timestamp: new Date().toISOString()
        });
    }
});
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        service: 'SkinLuxe API',
        databaseConnected: !!db,
        timestamp: new Date().toISOString()
    });
});
connectDB().then(() => {
    initializeProducts().then(() => {
        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
            console.log(` Products API: http://localhost:${PORT}/api/products`);
            console.log(`  Test endpoint: http://localhost:${PORT}/api/test`);
            console.log(`  Health check: http://localhost:${PORT}/health`);
            console.log(`  Database: ${db ? 'Connected' : 'Not Connected'}`);
        });
    });
});
