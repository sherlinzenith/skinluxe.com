const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skinluxe';
let db;
let client;

async function connectDB() {
    try {
        console.log('🔄 Attempting MongoDB connection...');
        
        if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/skinluxe') {
            console.log('❌ MONGODB_URI not configured. Please set MONGODB_URI environment variable.');
            return false;
        }

        client = new MongoClient(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        db = client.db();
        console.log('✅ Connected to MongoDB successfully!');
        
        // Test the connection
        await db.command({ ping: 1 });
        console.log('📊 MongoDB ping successful');
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        return false;
    }
}

// Initialize with sample products
async function initializeProducts() {
    try {
        if (!db) {
            console.log('📝 MongoDB not connected - skipping initialization');
            return;
        }

        // Create products collection if it doesn't exist
        const collections = await db.listCollections().toArray();
        const productsCollectionExists = collections.some(c => c.name === 'products');
        
        if (!productsCollectionExists) {
            await db.createCollection('products');
            console.log('📁 Created products collection');
        }

        const productCount = await db.collection('products').countDocuments();
        console.log(`📊 Current products in database: ${productCount}`);

        if (productCount === 0) {
            console.log('🔄 Initializing database with sample products...');
            
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
                    createdAt: new Date(),
                    updatedAt: new Date()
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
                    createdAt: new Date(),
                    updatedAt: new Date()
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
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            const result = await db.collection('products').insertMany(defaultProducts);
            console.log(`✅ Added ${result.insertedCount} sample products to database`);
        } else {
            console.log('✅ Database already contains products');
        }
    } catch (error) {
        console.error('❌ Error initializing products:', error);
    }
}

// Routes
app.get('/api/products', async (req, res) => {
    try {
        console.log('📦 Fetching products from database...');
        
        if (!db) {
            console.log('❌ Database not connected');
            return res.status(500).json({ 
                error: 'Database not available',
                fallback: true 
            });
        }
        
        const products = await db.collection('products')
            .find()
            .sort({ createdAt: -1 })
            .toArray();
        
        console.log(`✅ Found ${products.length} products`);
        res.json(products);
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        res.status(500).json({ 
            error: 'Failed to fetch products',
            fallback: true 
        });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        console.log('➕ Adding new product to database...');
        
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const newProduct = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Validate required fields
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return res.status(400).json({ error: 'Name, price, and image are required' });
        }

        const result = await db.collection('products').insertOne(newProduct);
        const insertedProduct = { ...newProduct, _id: result.insertedId };

        console.log('✅ Product added successfully:', result.insertedId);
        res.status(201).json(insertedProduct);
    } catch (error) {
        console.error('❌ Error adding product:', error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const productId = req.params.id;
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(productId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        console.log(`🗑️ Deleting product: ${req.params.id}`);
        
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const result = await db.collection('products').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log('✅ Product deleted successfully');
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Test endpoints
app.get('/api/test', async (req, res) => {
    try {
        let productCount = 0;
        let databaseStatus = 'disconnected';
        
        if (db) {
            databaseStatus = 'connected';
            productCount = await db.collection('products').countDocuments();
        }

        res.json({ 
            message: 'SkinLuxe API Server is running!',
            database: databaseStatus,
            productCount: productCount,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        res.json({ 
            message: 'Server is running but database has issues',
            database: 'error',
            productCount: 0,
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/health', async (req, res) => {
    try {
        let dbStatus = 'disconnected';
        if (db) {
            await db.command({ ping: 1 });
            dbStatus = 'connected';
        }

        res.status(200).json({ 
            status: 'OK',
            service: 'SkinLuxe API',
            database: dbStatus,
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR',
            service: 'SkinLuxe API',
            database: 'disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
async function startServer() {
    const dbConnected = await connectDB();
    
    if (dbConnected) {
        await initializeProducts();
    } else {
        console.log('⚠️ Starting server without database connection');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Products API: http://localhost:${PORT}/api/products`);
        console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        console.log(`📊 Database: ${db ? 'Connected ✅' : 'Not Connected ❌'}`);
        
        if (!db) {
            console.log('💡 To enable database features:');
            console.log('   1. Set MONGODB_URI environment variable');
            console.log('   2. Restart the server');
        }
    });
}

startServer().catch(console.error);
