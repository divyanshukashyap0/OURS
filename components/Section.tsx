import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  center?: boolean;
}

const Section: React.FC<SectionProps> = ({ id, children, className = '', title, subtitle, center = true }) => {
  return (
    <section id={id} className={`py-20 md:py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`mb-12 ${center ? 'text-center' : 'text-left'}`}
          >
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
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