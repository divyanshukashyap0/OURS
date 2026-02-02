import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  center?: boolean;
  dark?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = '',
  title,
  subtitle,
  center = true,
  dark = false
}) => {
  return (
    <section
      id={id}
      className={`
        py-24 md:py-32 lg:py-40 px-6 lg:px-8
        ${dark
          ? 'bg-mono-950 text-white'
          : 'bg-white dark:bg-mono-950 text-mono-950 dark:text-white'
        }
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`mb-16 ${center ? 'text-center' : 'text-left'}`}
          >
            {title && (
              <h2 className="mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`
                text-lg text-mono-500 dark:text-mono-400 leading-relaxed
                ${center ? 'max-w-2xl mx-auto' : ''}
              `}>
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;