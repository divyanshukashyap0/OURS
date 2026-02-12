import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
        transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation
    `;

    const variants = {
        primary: `
            bg-mono-950 text-white
            hover:bg-mono-800
            focus:ring-mono-950 dark:focus:ring-offset-mono-950
            dark:bg-white dark:text-mono-950 dark:hover:bg-mono-100
        `,
        secondary: `
            bg-transparent text-mono-950 border border-mono-300
            hover:border-mono-950
            focus:ring-mono-400 dark:focus:ring-offset-mono-950
            dark:text-white dark:border-mono-700 dark:hover:border-white
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
            dark:text-mono-400 dark:hover:bg-mono-800 dark:hover:text-white
        `,
    };

    const sizes = {
        sm: "px-5 py-2 text-sm gap-1.5 min-h-[36px]",
        md: "px-7 py-3 text-sm gap-2 min-h-[44px]",
        lg: "px-8 py-4 text-base gap-2.5 min-h-[52px]",
    };

    const content = (
        <>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && leftIcon}
            {children}
            {!isLoading && rightIcon}
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
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            {...props}
        >
            {content}
        </motion.button>
    );
};

export default Button;
