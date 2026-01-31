const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Check if already initialized to avoid error
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const initialProducts = [
    { name: 'Premium Glasses', category: 'Eyewear', price: '$299.99', stock: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281e960?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sunglasses Classic', category: 'Eyewear', price: '$159.99', stock: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800' },
    { name: 'Lens Cleaning Kit', category: 'Accessories', price: '$19.99', stock: 120, status: 'Active', image: 'https://plus.unsplash.com/premium_photo-1675806652671-33104e13da3e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Blue Light Blockers', category: 'Eyewear', price: '$89.99', stock: 5, status: 'Active', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800' },
];

async function seed() {
    console.log("Seeding products...");
    const batch = db.batch();

    for (const product of initialProducts) {
        const ref = db.collection('products').doc();
        batch.set(ref, product);
    }

    await batch.commit();
    console.log("Successfully added products!");
}

seed().catch(console.error);
