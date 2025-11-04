const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const products = [
    {
        id: 1,
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
        ]
    },
    {
        id: 2,
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
        ]
    },
    {
        id: 3,
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
        ]
    },
    {
        id: 4,
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
        ]
    },
    {
        id: 5,
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
        ]
    },
    {
        id: 6,
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
        ]
    }
];
app.get('/api/products', (req, res) => {
    res.json(products);
});
app.post('/api/products', (req, res) => {
    res.json({ 
        message: 'Product management handled by frontend localStorage',
        status: 'success'
    });
});

app.delete('/api/products/:id', (req, res) => {
    res.json({ 
        message: 'Product management handled by frontend localStorage',
        status: 'success'
    });
});

app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Server is working perfectly!',
        products: products.length,
        storage: 'localStorage (frontend) + In-memory (backend)'
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        service: 'SkinLuxe API',
        products: products.length,
        database: 'None - Using localStorage + In-memory',
        timestamp: new Date().toISOString()
    });
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(' SkinLuxe Server running on port ' + PORT);
    console.log(' Website: http://localhost:' + PORT);
    console.log(' Products API: http://localhost:' + PORT + '/api/products');
    console.log(' Health Check: http://localhost:' + PORT + '/health');
    console.log(' ' + products.length + ' products loaded in memory');
    console.log(' Database: None - Using localStorage for user data');
});
