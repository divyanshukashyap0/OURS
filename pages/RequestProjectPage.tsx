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

    const formRef = React.useRef<HTMLFormElement>(null);

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

            // 2. Submit Form Programmatically to FormSubmit
            if (formRef.current) {
                formRef.current.submit();
            }
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Connection interrupted. Please try again.");
            setLoading(false);
        }
    };

    // Single Page Layout (Responsive Form)
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <div className="max-w-4xl mx-auto px-6 py-8 md:py-12">

                {/* Header / Intro Section */}
                <div className="mb-12 text-center md:text-left">
                    <button
                        onClick={() => navigate('/')}
                        className="mb-6 text-gray-500 hover:text-white flex items-center justify-center md:justify-start gap-2 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg rotate-3 shrink-0">
                            <Code size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                                The Builder's Protocol
                            </h1>
                            <p className="text-gray-400 max-w-xl mx-auto md:mx-0">
                                Initiate a custom build request. We transform your raw idea into a fully functional, production-ready application in <strong className="text-white">MAX 7 days</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Feature Pills (Responsive Grid) */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
                            <Clock className="text-indigo-400 shrink-0" size={20} />
                            <div className="text-left">
                                <h3 className="font-bold text-sm text-white">7-Day Sprint</h3>
                                <p className="text-[10px] text-gray-400">Rapid development cycle.</p>
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
                            <ShieldCheck className="text-indigo-400 shrink-0" size={20} />
                            <div className="text-left">
                                <h3 className="font-bold text-sm text-white">Full Ownership</h3>
                                <p className="text-[10px] text-gray-400">100% source code ownership.</p>
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex items-center gap-3">
                            <Mail className="text-indigo-400 shrink-0" size={20} />
                            <div className="text-left">
                                <h3 className="font-bold text-sm text-white">Auto-Connect</h3>
                                <p className="text-[10px] text-gray-400">Direct engineering line.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <form
                        ref={formRef}
                        action="https://formsubmit.co/optistyle.india@gmail.com"
                        method="POST"
                        onSubmit={handleSubmit}
                        className="space-y-6 md:space-y-8"
                    >
                        {/* Hidden Configuration for FormSubmit */}
                        <input type="hidden" name="_subject" value={`[NEW PROJECT] ${formData.projectName} - ${formData.priority.toUpperCase()}`} />
                        <input type="hidden" name="_template" value="table" />
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_next" value="https://ours-platform.vercel.app/" />

                        {/* Section 1: Identity */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
                                <span className="bg-indigo-500/20 w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Budget Range</label>
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

                        {/* Section 2: Specs */}
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
                                <span className="bg-indigo-500/20 w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                                Technical Specs
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">The Vision</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={4}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="Describe what you want to build. What problem does it solve?"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Core Features</label>
                                    <textarea
                                        name="features"
                                        required
                                        rows={3}
                                        className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
                                        placeholder="- Feature 1&#10;- Feature 2&#10;- Feature 3"
                                        value={formData.features}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Urgency</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all ${formData.priority === 'standard' ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                                            <input type="radio" name="priority" value="standard" className="hidden" onChange={handleChange} />
                                            <span className="font-bold">Standard</span>
                                            <span className="text-xs text-gray-400">14-21 Days Turnaround</span>
                                        </label>
                                        <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-2 transition-all ${formData.priority === 'rush' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                                            <input type="radio" name="priority" value="rush" className="hidden" onChange={handleChange} />
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-red-400">Rush Protocol</span>
                                                <span className="bg-red-500/20 text-red-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Fast</span>
                                            </div>
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
