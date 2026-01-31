import React from 'react';
import { motion } from 'framer-motion';
import LogoLoader from './LogoLoader';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <LogoLoader size={128} />
        </div>
    );
};

export default LoadingScreen;
