import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Layers, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Home', icon: <Home size={22} />, path: '/' },
        { label: 'Courses', icon: <BookOpen size={22} />, path: '/courses' },
        { label: 'Projects', icon: <Layers size={22} />, path: '/projects' },
        { label: 'Account', icon: <User size={22} />, path: '/account' },
    ];

    // Only show on mobile
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-gray-950/80 backdrop-blur-xl border-t border-gray-800 pb-safe pt-2 px-2 shadow-2xl">
            <nav className="flex justify-around items-center h-16 max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `
                                relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200
                                ${isActive ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute -top-2 w-10 h-1 bg-blue-500 rounded-b-lg shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className="relative">
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNav;
