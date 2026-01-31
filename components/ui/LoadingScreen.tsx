import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="relative w-32 h-32 md:w-40 md:h-40"
            >
                <img
                    src="/logo-circle.png"
                    alt="Loading..."
                    className="w-full h-full object-contain"
                />
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
