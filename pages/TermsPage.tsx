import React from 'react';
import { AlertTriangle, FileText, Lock } from 'lucide-react';

const TermsPage: React.FC = () => {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-950 font-mono">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-tech-card p-8 border-b border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="text-tech-primary" size={32} />
                        <h1 className="text-3xl font-bold text-white">Terms of <span className="text-red-500 line-through decoration-2">Service</span> Surrender</h1>
                    </div>
                    <p className="text-gray-400">
                        Last Updated: When the coffee ran out.
                    </p>
                </div>

                <div className="p-8 space-y-8 text-gray-700 dark:text-gray-300">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 rounded-r-lg">
                        <div className="flex gap-3">
                            <AlertTriangle className="text-yellow-600 shrink-0" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200 italic">
                                <strong>Warning:</strong> By scrolling past this pixel, you agree to buy the developers a pizza if you ever meet them in person. This is a legally binding pizza contract.
                            </p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. The "Tabs vs Spaces" Protocol</h2>
                        <p className="mb-2">We use <strong>Spaces</strong>. If you submit a pull request with Tabs, our CI/CD pipeline is legally authorized to reject your code and publicly shame you on Twitter.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Section 404: Liability Not Found</h2>
                        <p>If our service goes down, do not panic. It is likely a feature, not a bug. We are not liable for any loss of data, loss of sanity, or keyboards destroyed in frustration.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. The Zombie Clause</h2>
                        <p>In the unlikely event of a zombie apocalypse:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
                            <li>All subscriptions are automatically cancelled.</li>
                            <li>Our office becomes a designated safe zone (bring your own crossbow).</li>
                            <li>This website will redirect to a survival guide.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Intellectual Property</h2>
                        <p>You own your code. We own the platform. Similar to how you own your car, but the government owns the roads... except we are cooler than the government and have better dark mode support.</p>
                    </section>

                    <div className="pt-8 text-center text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800">
                        <p>By clicking "I Agree" (which is imaginary, you implicitly agreed by being born), you surrender all rights to complain about CSS centering issues.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
