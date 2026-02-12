import React, { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}, ref) => {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label className="text-sm font-medium text-mono-700 dark:text-mono-300 ml-1">
                    {label}
                </label>
            )}

            <div className="relative group">
                {leftIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mono-400 group-focus-within:text-neon-cyan transition-colors">
                        {leftIcon}
                    </div>
                )}

                <input
                    ref={ref}
                    disabled={disabled}
                    className={`
                        w-full bg-mono-50 dark:bg-mono-900 
                        border border-mono-200 dark:border-mono-700 
                        rounded-xl py-3 px-4
                        text-mono-950 dark:text-white 
                        placeholder:text-mono-400 dark:placeholder:text-mono-500
                        transition-all duration-200 ease-out
                        focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${leftIcon ? 'pl-11' : ''}
                        ${rightIcon ? 'pr-11' : ''}
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}
                    `}
                    {...props}
                />

                {rightIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-mono-400">
                        {rightIcon}
                    </div>
                )}

                {/* Animated bottom border effect */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-neon-cyan transition-all duration-300 group-focus-within:w-full rounded-b-xl" />
            </div>

            {error && (
                <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-500 ml-1 font-medium"
                >
                    {error}
                </motion.span>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
