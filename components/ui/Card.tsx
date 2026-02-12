import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'glass-dark' | 'neon';
    hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    hoverEffect = false,
    className = '',
    ...props
}) => {
    const variants = {
        default: "bg-white dark:bg-mono-900 border border-mono-100 dark:border-mono-800",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg",
        "glass-dark": "bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl",
        neon: "bg-mono-950 border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]",
    };

    const hoverStyles = hoverEffect
        ? "hover:scale-[1.01] hover:shadow-xl transition-all duration-300 ease-out"
        : "";

    return (
        <motion.div
            className={`rounded-2xl p-6 overflow-hidden ${variants[variant]} ${hoverStyles} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
