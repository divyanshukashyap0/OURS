import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Layers, User, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Courses', icon: BookOpen, path: '/courses' },
        { label: 'Projects', icon: Layers, path: '/projects' },
        { label: 'Request', icon: Code, path: '/request-project' },
        { label: 'Account', icon: User, path: '/account' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 dark:bg-mono-950/90 backdrop-blur-xl border-t border-mono-100 dark:border-mono-800 pb-safe">
            <nav className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center flex-1 h-full py-2 touch-manipulation active:scale-95 transition-transform"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-mono-950 dark:bg-white rounded-b-full"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className={`relative transition-colors duration-200 ${isActive
                                    ? 'text-mono-950 dark:text-white'
                                    : 'text-mono-400 dark:text-mono-500'
                                }`}>
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium mt-1 transition-colors duration-200 ${isActive
                                    ? 'text-mono-950 dark:text-white'
                                    : 'text-mono-400 dark:text-mono-500'
                                }`}>
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNav;
