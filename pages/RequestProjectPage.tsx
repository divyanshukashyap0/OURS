import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Code, Clock, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import LogoLoader from '../components/ui/LogoLoader';

const RequestProjectPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'intro' | 'form' | 'success'>('intro');

    // Form State
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        features: '',
        budget: '500-1000',
        priority: 'standard', // 'standard' or 'rush'
        contactEmail: currentUser?.email || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Save to Firestore
            await addDoc(collection(db, 'project_requests'), {
                ...formData,
                userId: currentUser?.uid || 'anonymous',
                createdAt: serverTimestamp(),
                status: 'pending'
            });

            // 2. Prepare Email (Mailto fallback)
            const subject = `[NEW PROJECT] ${formData.projectName} - ${formData.priority.toUpperCase()}`;
            const body = `
PROJECT REQUEST (The Builder's Protocol)
----------------------------------------
User: ${formData.contactEmail}
Project Name: ${formData.projectName}
Budget Range: $${formData.budget}
Timeline Priority: ${formData.priority.toUpperCase()}

THE VISION:
${formData.description}

CORE FEATURES:
${formData.features}

----------------------------------------
Sent via Ours. Platform.
            `;

            // Open user's email client
            const mailtoLink = `mailto:optistyle.india@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;

            setStep('success');
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Connection interrupted. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Intro Screen (The "Protocol" Vibe)
    if (step === 'intro') {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full bg-gray-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 text-center"
                >
                    <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform">
                        <Code size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        The Builder's Protocol
                    </h1>
                    <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg mx-auto">
                        Initiate a custom build request. We transform your raw idea into a fully functional, production-ready application in <strong className="text-white">MAX 7 days</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <Clock className="text-indigo-400 mb-2" size={24} />
                            <h3 className="font-bold text-white mb-1">7-Day Sprint</h3>
                            <p className="text-xs text-gray-400">Rapid development cycle. No delays.</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <ShieldCheck className="text-indigo-400 mb-2" size={24} />
                            <h3 className="font-bold text-white mb-1">Full Ownership</h3>
                            <p className="text-xs text-gray-400">You own 100% of the source code.</p>
                        </div>
                        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                            <Mail className="text-indigo-400 mb-2" size={24} />
                            <h3 className="font-bold text-white mb-1">Auto-Connect</h3>
                            <p className="text-xs text-gray-400">Direct line to our engineering team.</p>
                        </div>
                    </div>

                    <Button onClick={() => setStep('form')} className="w-full md:w-auto px-12 py-4 text-lg bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-lg shadow-indigo-600/20">
                        Initiate Protocol <ArrowRight size={20} className="ml-2 inline" />
                    </Button>
                </motion.div>

                <button
                    onClick={() => navigate('/')}
                    className="mt-8 text-gray-500 hover:text-white flex items-center gap-2 transition-colors relative z-10"
                >
                    <ArrowLeft size={16} /> Return to Dashboard
                </button>
            </div>
        );
    }

    // Success Screen
    if (step === 'success') {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-500/10 p-6 rounded-full mb-6"
                >
                    <Send size={48} className="text-green-500" />
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">Protocol Initiated.</h1>
                <p className="text-gray-400 max-w-md mb-8">
                    Your request has been secured in our database and the email client has been triggered. Please ensure you hit <strong>"Send"</strong> in your email app to finalize the connection.
                </p>
                <Button onClick={() => navigate('/')} variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    Return to Mission Control
                </Button>
            </div>
        );
    }

    // Main Form
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500/30">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                <button
                    onClick={() => setStep('intro')}
                    className="mb-8 text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Project Parameters</h2>
                    <p className="text-gray-400 mb-8">Define your specifications clearly for maximum velocity.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Section 1: Identity */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
                                <span className="bg-indigo-500/20 w-6 h-6 rounded flex items-center justify-center text-xs">1</span>
                                Identity
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Name / Codename</label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        required
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="e.g. Project Orion"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Your Contact Email</label>
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        required
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range (USD)</label>
                                    <select
                                        name="budget"
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all appearance-none"
                                        value={formData.budget}
                                        onChange={handleChange}
                                    >
                                        <option value="500-1000">$500 - $1,000</option>
                                        <option value="1000-2500">$1,000 - $2,500</option>
                                        <option value="2500-5000">$2,500 - $5,000</option>
                                        <option value="5000+">$5,000+</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Validations */}
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
                                <span className="bg-indigo-500/20 w-6 h-6 rounded flex items-center justify-center text-xs">2</span>
                                Specs
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">The Vision (Detailed Description)</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Describe what you want to build. Who is it for? What problem does it solve?"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Core Features (Non-Negotiables)</label>
                                    <textarea
                                        name="features"
                                        required
                                        rows={3}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="- User Authentication&#10;- Stripe Payment Integration&#10;- Admin Dashboard"
                                        value={formData.features}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Urgency / Priority</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all ${formData.priority === 'standard' ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                                            <input type="radio" name="priority" value="standard" className="hidden" onChange={handleChange} />
                                            <span className="font-bold">Standard</span>
                                            <span className="text-xs text-gray-400">14-21 Days Turnaround</span>
                                        </label>
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all ${formData.priority === 'rush' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                                            <input type="radio" name="priority" value="rush" className="hidden" onChange={handleChange} />
                                            <span className="font-bold text-red-400">Rush Protocol</span>
                                            <span className="text-xs text-gray-400">7-Day MAX Guarantee</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-10 py-4 text-base bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/20"
                            >
                                {loading ? <LogoLoader size={24} color="white" /> : 'Submit & Initialize Protocol'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default RequestProjectPage;
