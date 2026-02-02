import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Reset loading state on route change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800); // Minimum loading time for logo spin

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <>
            {/* Loading Overlay with Spinning Logo */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-mono-950"
                    >
                        <motion.img
                            src="/logo.png"
                            alt="Loading..."
                            className="w-16 h-16 rounded-full shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ rotate: 360, scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            transition={{
                                rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                                scale: { duration: 0.3 },
                                opacity: { duration: 0.3 }
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Layout */}
            <div className="min-h-screen bg-mono-950 text-mono-100 transition-colors duration-400 flex flex-col no-pull-refresh">
                <Navbar />
                <motion.main
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 10 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-grow pt-24 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
                >
                    {children || <Outlet />}
                </motion.main>
                <Footer />
                <BottomNav />
            </div>
        </>
    );
};

export default Layout;
