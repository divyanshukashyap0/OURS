import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
    children: React.ReactNode;
    minLoadTime?: number; // Minimum time to show loader in ms
}

const PageLoader: React.FC<PageLoaderProps> = ({ children, minLoadTime = 800 }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate minimum load time to show the spinning logo
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, minLoadTime);

        return () => clearTimeout(timer);
    }, [minLoadTime]);

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-mono-950"
                    >
                        <motion.img
                            src="/logo.png"
                            alt="Loading..."
                            className="w-16 h-16 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                {children}
            </motion.div>
        </>
    );
};

export default PageLoader;
