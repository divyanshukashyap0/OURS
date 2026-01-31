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
// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        let amountInPaise;
        let currencyCode = currency;

        if (currency === 'USD') {
            const conversionRate = 86; // 1 USD = 86 INR (approx)
            const amountInINR = amount * conversionRate;
            amountInPaise = Math.round(amountInINR * 100);
            currencyCode = 'INR'; // Razorpay processes in INR
        } else {
            amountInPaise = Math.round(amount * 100);
        }

        const options = {
            amount: amountInPaise,
            currency: currencyCode,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message });
    }
});

// Verify Payment & Save Order (Secure)
app.post('/api/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        // Payment is legit, save to Firestore
        try {
            await db.collection('orders').add({
                ...orderData,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                status: 'paid',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.json({ status: 'success', message: 'Payment verified and order saved' });
        } catch (error) {
            console.error("Error saving order:", error);
            res.status(500).json({ error: 'Payment verified but failed to save order' });
        }
    } else {
        res.status(400).json({ status: 'failure', message: 'Invalid signature' });
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
