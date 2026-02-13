import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Heart, Coffee, Star, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const PricingPage: React.FC = () => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Fair Prices, <span className="text-blue-600">Built with Love</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        We believe in accessible education and tools. No hidden fees, no corporate nonsense. Just honest pricing for honest work.
                    </motion.p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">

                    {/* Student Tier */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                                <Coffee size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Student</h3>
                        </div>
                        <p className="text-gray-500 mb-6 min-h-[50px]">Perfect for learning and building your first portfolio.</p>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                            Free <span className="text-base font-normal text-gray-500">/ forever</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-green-500" /> Access to Free Tutorials
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-green-500" /> Join our Community
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-green-500" /> Basic Project Templates
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full" onClick={() => navigate('/signup')}>Start Learning</Button>
                    </motion.div>

                    {/* Pro Tier (Highlighted) */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="relative bg-white dark:bg-gray-900 rounded-2xl border-2 border-blue-500 p-8 shadow-2xl scale-105 z-10"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                            Most Popular
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Developer</h3>
                        </div>
                        <p className="text-gray-500 mb-6 min-h-[50px]">For serious builders who want to ship faster.</p>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                            $2 <span className="text-base font-normal text-gray-500">/ project</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-blue-500" /> <span className="font-bold">Full Source Code</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-blue-500" /> Lifetime Updates
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-blue-500" /> Premium Support
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-blue-500" /> Commercial Usage Rights
                            </li>
                        </ul>
                        <Button className="w-full" onClick={() => navigate('/projects')}>Browse Projects</Button>
                    </motion.div>

                    {/* Team Tier */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Supporter</h3>
                        </div>
                        <p className="text-gray-500 mb-6 min-h-[50px]">Keep the platform alive and help us create more.</p>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                            Custom <span className="text-base font-normal text-gray-500">/ donation</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-purple-500" /> Early Access to New Projects
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-purple-500" /> Direct Access to Founders
                            </li>
                            <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                <Check size={18} className="text-purple-500" /> Your Name in Credits
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full" onClick={() => navigate('/contact')}>Contact Us</Button>
                    </motion.div>

                </div>

                {/* FAQ / Note */}
                <div className="mt-20 text-center">
                    <p className="text-gray-500 italic">
                        "We price things low because we've been students too. We know every rupee/dollar counts."
                        <br />
                        — Made with <Heart className="inline text-red-500 mx-1" size={16} fill="currentColor" /> by OURS Team
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
