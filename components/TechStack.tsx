import React from 'react';
import Section from './Section';
import { TECH_STACK } from '../constants';

const TechStack: React.FC = () => {
  return (
    <Section 
      id="tech" 
      className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800"
    >
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Technologies you will learn</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-80">
        {TECH_STACK.map((tech) => (
          <div
            key={tech.name}
            className="flex flex-col items-center gap-2 group cursor-pointer hover:opacity-100 transition-opacity"
          >
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 group-hover:shadow-md transition-shadow">
              <tech.icon size={32} className="text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{tech.name}</span>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default TechStack;