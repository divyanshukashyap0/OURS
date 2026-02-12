import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
    href?: string;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    href,
    disabled,
    ...props
}) => {
    const baseStyles = `
        inline-flex items-center justify-center rounded-full font-medium
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation relative overflow-hidden group
    `;

    const variants = {
        primary: `
            bg-mono-950 text-white
            hover:bg-mono-800
            focus:ring-mono-950 dark:focus:ring-offset-mono-950
            dark:bg-white dark:text-mono-950 dark:hover:bg-mono-200
        `,
        secondary: `
            bg-transparent text-mono-950 border border-mono-300
            hover:border-mono-950 hover:bg-mono-50
            focus:ring-mono-400 dark:focus:ring-offset-mono-950
            dark:text-white dark:border-mono-700 dark:hover:border-white dark:hover:bg-white/5
        `,
        outline: `
            bg-transparent border border-mono-200 text-mono-700
            hover:border-mono-400 hover:text-mono-950
            focus:ring-mono-400 dark:focus:ring-offset-mono-950
            dark:border-mono-700 dark:text-mono-300 dark:hover:border-mono-500 dark:hover:text-white
        `,
        ghost: `
            bg-transparent text-mono-600
            hover:bg-mono-100 hover:text-mono-950
            focus:ring-mono-400 dark:focus:ring-offset-mono-950
            dark:text-mono-400 dark:hover:bg-mono-900/50 dark:hover:text-white
        `,
        neon: `
            bg-neon-cyan text-mono-950 border border-transparent
            hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:border-white/20
            focus:ring-neon-cyan dark:focus:ring-offset-mono-950
        `,
        glass: `
            bg-white/10 backdrop-blur-md border border-white/10 text-white
            hover:bg-white/20 hover:border-white/30
            focus:ring-white/50 dark:focus:ring-offset-mono-950
        `
    };

    const sizes = {
        sm: "px-4 py-2 text-xs gap-1.5 min-h-[32px]",
        md: "px-6 py-2.5 text-sm gap-2 min-h-[40px]",
        lg: "px-8 py-3.5 text-base gap-2.5 min-h-[48px]",
    };

    const content = (
        <>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && leftIcon}
            <span className="relative z-10">{children}</span>
            {!isLoading && rightIcon}
            {variant === 'neon' && (
                <div className="absolute inset-0 rounded-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            )}
        </>
    );

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.replace(/\s+/g, ' ').trim();

    if (href) {
        return (
            <motion.a
                href={href}
                className={combinedClassName}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                {...(props as any)}
            >
                {content}
            </motion.a>
        );
    }

    return (
        <motion.button
            className={combinedClassName}
            disabled={disabled || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {content}
        </motion.button>
    );
};

export default Button;
