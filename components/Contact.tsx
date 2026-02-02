import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { sendEmail } from '../lib/emailService';
import Section from './Section';
import Button from './ui/Button';
import { motion } from 'framer-motion';

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
      const q = query(collection(db, 'subscribers'), where('email', '==', email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setStatus('You are already subscribed!');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'subscribers'), {
        email,
        createdAt: serverTimestamp(),
        source: 'homepage_cta'
      });

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
    <Section id="contact" center className="bg-white dark:bg-mono-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-mono-950 dark:bg-white rounded-2xl p-8 md:p-16 text-center max-w-4xl mx-auto"
      >
        <h2 className="text-white dark:text-mono-950 mb-4">
          Ready to start your journey?
        </h2>
        <p className="text-mono-400 dark:text-mono-600 mb-10 max-w-2xl mx-auto text-lg">
          Join thousands of developers who are building the future with OURS.
          Get access to free tutorials and updates.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-5 py-3.5 rounded-full bg-white dark:bg-mono-950 text-mono-950 dark:text-white border border-mono-200 dark:border-mono-700 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-mono-950 transition-all"
          />
          <Button
            variant="primary"
            className="bg-white text-mono-950 hover:bg-mono-100 dark:bg-mono-950 dark:text-white dark:hover:bg-mono-800"
            onClick={handleSubscribe}
            isLoading={loading}
          >
            Subscribe
          </Button>
        </div>

        {status && (
          <p className={`mt-4 text-sm font-medium ${status.includes('Success') ? 'text-green-400 dark:text-green-600' : 'text-red-400 dark:text-red-600'}`}>
            {status}
          </p>
        )}
      </motion.div>
    </Section>
  );
};

export default Contact;