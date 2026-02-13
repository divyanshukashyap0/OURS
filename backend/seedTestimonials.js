const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const testimonials = [
    {
        name: "Alex Doe",
        role: "Frontend Dev",
        text: "OURS helped me land my first job. The projects are real-world relevant.",
        rating: 5
    },
    {
        name: "Sarah Smith",
        role: "UX Designer",
        text: "The best platform to learn by doing. Highly recommended!",
        rating: 5
    },
    {
        name: "James Lee",
        role: "Full Stack",
        text: "Finally, a place that teaches how to build, not just syntax.",
        rating: 5
    }
];

async function seed() {
    console.log("Seeding testimonials...");
    try {
        for (const t of testimonials) {
            await db.collection('testimonials').add({
                ...t,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`Added: ${t.name}`);
        }
        console.log("Seeding complete.");
    } catch (error) {
        console.error("Error seeding:", error);
    }
    process.exit();
}

seed();
