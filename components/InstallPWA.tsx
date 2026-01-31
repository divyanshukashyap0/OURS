import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
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

            // Delay showing the prompt by 3 seconds as requested
            setTimeout(() => {
                // Check if user has already dismissed it recently (optional optimization, skipping for now to strict requirements)
                setShowBanner(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!promptInstall) {
            return;
        }
        promptInstall.prompt();
        promptInstall.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
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
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-4"
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Download size={20} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Install App</h4>
                            <p className="text-xs text-gray-400">Add to Home Screen for the best experience.</p>
                        </div>
                    </div>
                    <button onClick={handleDismiss} className="text-gray-500 hover:text-white p-1">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleDismiss} variant="outline" className="flex-1 text-xs py-2 h-auto">
                        Maybe Later
                    </Button>
                    <Button onClick={handleInstallClick} className="flex-1 text-xs py-2 h-auto bg-indigo-600 hover:bg-indigo-500 text-white">
                        Install Now
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPWA;
