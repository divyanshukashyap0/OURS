import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import Button from './ui/Button';

const InstallPWA: React.FC = () => {
    const [supportsPWA, setSupportsPWA] = useState(false);
    const [promptInstall, setPromptInstall] = useState<any>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);

            // Delay showing the prompt by 3 seconds
            setTimeout(() => {
                setShowBanner(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!promptInstall) return;

        promptInstall.prompt();
        promptInstall.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setShowBanner(false);
        });
    };

    const handleDismiss = () => {
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-700 p-4 rounded-2xl shadow-2xl z-[200]"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-mono-950 dark:bg-white rounded-xl flex items-center justify-center">
                            <Smartphone size={24} className="text-white dark:text-mono-950" />
                        </div>
                        <div>
                            <h4 className="font-bold text-mono-950 dark:text-white">Install OURS</h4>
                            <p className="text-xs text-mono-500 dark:text-mono-400">Get the full app experience</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-mono-400 hover:text-mono-950 dark:hover:text-white p-1 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Benefits */}
                <div className="flex gap-2 text-xs text-mono-500 dark:text-mono-400 mb-4">
                    <span className="bg-mono-100 dark:bg-mono-800 px-2 py-1 rounded-full">Offline</span>
                    <span className="bg-mono-100 dark:bg-mono-800 px-2 py-1 rounded-full">Fast</span>
                    <span className="bg-mono-100 dark:bg-mono-800 px-2 py-1 rounded-full">Push Alerts</span>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleDismiss}
                        variant="secondary"
                        className="flex-1 text-sm py-2.5"
                    >
                        Later
                    </Button>
                    <Button
                        onClick={handleInstallClick}
                        variant="primary"
                        leftIcon={<Download size={16} />}
                        className="flex-1 text-sm py-2.5"
                    >
                        Install
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPWA;
