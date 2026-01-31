import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, PlayCircle, User, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { heroTitle, heroSubtitle } = useSite();

  const buttons = [
    { label: 'Projects', icon: <PlayCircle size={20} />, path: '/projects', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Blog', icon: <Newspaper size={20} />, path: '/blog', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'About', icon: <User size={20} />, path: '/about', color: 'bg-teal-600 hover:bg-teal-700' },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Impressive Background */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-gray-900"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          // ... existing motion props
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
            <Code2 size={48} className="text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 tracking-tight leading-tight mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {buttons.map((btn, index) => (
            <motion.button
              key={btn.label}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(btn.path)}
              className={`${btn.color} text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all flex items-center gap-3 backdrop-blur-sm bg-opacity-90`}
            >
              {btn.icon}
              {btn.label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>
    </section>
  );
};

export default Hero;