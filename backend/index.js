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
    res.json({
        status: 'OK',
        message: 'Backend is running',
        razorpayConfigured: !!process.env.RAZORPAY_KEY_ID
    });
});

// Create Razorpay Order
// Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error("Razorpay API Keys are missing in Server Environment");
        }
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
        // Razorpay errors often differ in structure. 
        // We try to grab the most useful info.
        const errorMessage = error.error?.description || error.description || error.message || JSON.stringify(error);
        res.status(500).json({ error: errorMessage });
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

// --- Admin: Add User (Create Auth + Firestore) ---
app.post('/api/admin/add-user', async (req, res) => {
    const { email, password, displayName, role = 'user' } = req.body;

    if (!email || !password || !displayName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Create User in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
            emailVerified: true // Auto-verify since admin created it
        });

        // 2. Set Custom Claims (if role is admin)
        if (role === 'admin') {
            await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
        }

        // 3. Create User Document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            displayName,
            role,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            hasSecurityQuestions: false // New user created by admin needs to set these up
        });

        res.status(201).json({ message: 'User created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- Admin: Export Users (CSV Data) ---
app.get('/api/admin/export-users', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];

        usersSnapshot.forEach(doc => {
            const data = doc.data();
            users.push({
                uid: doc.id,
                email: data.email || '',
                displayName: data.displayName || '',
                role: data.role || 'user',
                createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : ''
            });
        });

        res.json(users);
    } catch (error) {
        console.error("Error exporting users:", error);
        res.status(500).json({ error: error.message });
    }
});

// Security Questions: Save (Hashed)
app.post('/api/save-security-questions', async (req, res) => {
    const { uid, questionsAndAnswers } = req.body; // Expects array of { question, answer }

    if (!uid || !questionsAndAnswers || !Array.isArray(questionsAndAnswers)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    try {
        const crypto = require('crypto');
        const hashedQuestions = questionsAndAnswers.map(qa => {
            const hash = crypto.createHash('sha256');
            hash.update(qa.answer.toLowerCase().trim()); // Normalize answer
            return {
                question: qa.question,
                answerHash: hash.digest('hex')
            };
        });

        await db.collection('users').doc(uid).set({
            securityQuestions: hashedQuestions,
            hasSecurityQuestions: true
        }, { merge: true });

        res.json({ message: 'Security questions saved successfully' });
    } catch (error) {
        console.error("Error saving security questions:", error);
        res.status(500).json({ error: error.message });
    }
});

// Security Questions: Get Questions (No Answers)
app.post('/api/get-security-questions', async (req, res) => {
    const { email } = req.body;

    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        const userDoc = await db.collection('users').doc(userRecord.uid).get();

        if (!userDoc.exists || !userDoc.data().hasSecurityQuestions) {
            return res.status(404).json({ error: 'User has not set up security questions.' });
        }

        const questions = userDoc.data().securityQuestions.map(q => ({
            question: q.question
        }));

        res.json({ uid: userRecord.uid, questions });
    } catch (error) {
        // Don't reveal if user exists or not for security, but for now we need to valid flow
        console.error("Error fetching security questions:", error);
        res.status(404).json({ error: 'User not found or no security questions set.' });
    }
});

// Security Questions: Verify & Reset Password
app.post('/api/verify-security-questions', async (req, res) => {
    const { uid, answers, newPassword } = req.body; // answers: { question: string, answer: string }[]

    try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const storedQuestions = userDoc.data().securityQuestions;
        const crypto = require('crypto');

        let allCorrect = true;

        if (answers.length !== storedQuestions.length) {
            return res.status(400).json({ error: 'Incorrect number of answers provided.' });
        }

        for (let i = 0; i < storedQuestions.length; i++) {
            const storedQ = storedQuestions[i];
            const providedA = answers.find(a => a.question === storedQ.question);

            if (!providedA) {
                allCorrect = false;
                break;
            }

            const hash = crypto.createHash('sha256');
            hash.update(providedA.answer.toLowerCase().trim());
            const providedHash = hash.digest('hex');

            if (providedHash !== storedQ.answerHash) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            if (newPassword) {
                await admin.auth().updateUser(uid, {
                    password: newPassword
                });
                res.json({ message: 'Password reset successfully!' });
            } else {
                res.json({ message: 'Answers correct' });
            }
        } else {
            res.status(400).json({ error: 'Incorrect answers.' });
        }

    } catch (error) {
        console.error("Error verifying security questions:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
