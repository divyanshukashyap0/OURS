import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { sendEmail } from '../lib/emailService';
import Section from './Section';
import Button from './ui/Button';

const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setStatus('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setStatus('');
    try {
      // Check if already subscribed
      const q = query(collection(db, 'subscribers'), where('email', '==', email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setStatus('You are already subscribed!');
        setLoading(false);
        return;
      }

      // 1. Save to Firestore
      await addDoc(collection(db, 'subscribers'), {
        email,
        createdAt: serverTimestamp(),
        source: 'homepage_cta'
      });

      // 2. Send Welcome Email
      await sendEmail(email, 'welcome', {
        name: 'Developer',
        projectTitle: 'OURS Platform'
      });

      setStatus('Success! You are now subscribed.');
      setEmail('');
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" center>
      <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 md:p-16 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden transition-colors">

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your journey?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of developers who are building the future with OURS.
            Get access to free tutorials and updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white dark:bg-white/90"
            />
            <Button
              variant="primary"
              className="bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-70 dark:bg-black dark:hover:bg-gray-900"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          {status && (
            <p className={`mt-4 text-sm font-medium ${status.includes('Success') ? 'text-green-200' : 'text-red-200'}`}>
              {status}
            </p>
          )}
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl -ml-16 -mb-16"></div>
      </div>
    </Section>
  );
};

export default Contact;