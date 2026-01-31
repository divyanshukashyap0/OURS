require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const Razorpay = require('razorpay');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: amount * 100, // Razorpay works in subunits (paise)
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message });
    }
});

// Set Admin Privilege
app.post('/api/set-admin', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        res.json({ message: `Success! ${email} is now an admin.` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Public Stats (Users & Projects)
app.get('/api/stats', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').count().get();
        const projectsSnapshot = await db.collection('projects').count().get();

        res.json({
            users: usersSnapshot.data().count,
            projects: projectsSnapshot.data().count
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: error.message });
    }
});

// Example Admin Route: List all users (requires admin privilege logic usually)
app.get('/api/users', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers(10);
        res.json(listUsersResult.users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
