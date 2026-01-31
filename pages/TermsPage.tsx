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
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-r-lg">
                        <div className="flex gap-3">
                            <AlertTriangle className="text-blue-600 shrink-0" />
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>tl;dr:</strong> Be nice, write good code, and don't blame us if you copy-paste a bug from StackOverflow.
                            </p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Code of Conduct</h2>
                        <p className="mb-2">We respect all developers, regardless of their preferred IDE or indentation style. However, discrimination, harassment, or deploying breaking changes on a Friday evening will result in immediate termination of your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Limitation of Liability</h2>
                        <p>OURS provides this platform "as is". We are not responsible for:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
                            <li>Data loss caused by accidental `rm -rf /` commands.</li>
                            <li>Bugs introduced by copying code directly from our tutorials without reading the comments.</li>
                            <li>Imposter syndrome induced by viewing our advanced projects.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Service Availability</h2>
                        <p>We aim for 99.9% uptime. The remaining 0.1% is reserved for:</p>
                        <ul className="list-disc pl-6 space-y-1 mt-2 text-sm">
                            <li>Critical security patches.</li>
                            <li>Database migrations that sounded easy in the meeting.</li>
                            <li>Unforeseeable cosmic ray events flipping bits in our servers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Intellectual Property</h2>
                        <p>You retain full ownership of the code you write. We retain ownership of the platform, the brand, and the cool CSS gradients. By using OURS, you grant us a non-exclusive license to showcase your public projects as examples of "What Awesome Looks Like."</p>
                    </section>

                    <div className="pt-8 text-center text-xs text-gray-400 border-t border-gray-200 dark:border-gray-800">
                        <p>By continuing to use OURS, you acknowledge that you have read `README.md` and agree to merge these terms into your lifestyle.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
