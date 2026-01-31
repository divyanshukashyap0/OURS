import React from 'react';
import { motion } from 'framer-motion';

interface GenericPageProps {
    title: string;
    description: string;
}

const GenericPage: React.FC<GenericPageProps> = ({ title, description }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-32 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full text-center space-y-8"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {description}
                </p>
                <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-500 italic">This page is under construction. Check back soon!</p>
                </div>
            </motion.div>
        </div>
    );
};

export default GenericPage;
