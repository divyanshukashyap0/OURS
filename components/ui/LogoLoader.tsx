import React from 'react';
import { motion } from 'framer-motion';

interface LogoLoaderProps {
    className?: string;
    size?: number; // Size in pixels
}

const LogoLoader: React.FC<LogoLoaderProps> = ({ className = "", size = 48 }) => {
    return (
        <motion.div
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
            animate={{ rotate: 360 }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }}
        >
            <img
                src="/logo.png"
                alt="Loading..."
                className="w-full h-full object-contain rounded-full"
            />
        </motion.div>
    );
};

export default LogoLoader;
