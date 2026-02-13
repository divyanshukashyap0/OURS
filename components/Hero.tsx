import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import Button from './ui/Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { heroTitle, heroSubtitle } = useSite();
  const [text, setText] = React.useState('');
  const fullText = heroTitle || "Build. Ship. Scale.";
  const [index, setIndex] = React.useState(0);

  // Typewriter effect
  React.useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index));
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  const buttons = [
    { label: 'Browse Courses', icon: <Terminal size={18} />, path: '/courses', primary: true },
    { label: 'Explore Projects', icon: <Code2 size={18} />, path: '/projects', primary: false },
  ];

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-white dark:bg-mono-950 font-sans">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 dark:opacity-30"></div>

      {/* Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-mono-200/50 dark:bg-mono-700/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mono-100 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 text-mono-600 dark:text-mono-400 text-xs font-bold mb-6 tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mono-400 dark:bg-mono-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mono-500 dark:bg-mono-400"></span>
            </span>
            v2.0 System Online
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-mono-950 dark:text-white leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mono-950 to-mono-600 dark:from-white dark:to-mono-400">
              {text}
            </span>
            <span className="animate-pulse text-mono-400 dark:text-mono-500">_</span>
          </h1>

          <p className="text-lg text-mono-500 dark:text-mono-400 mb-8 max-w-lg leading-relaxed border-l-2 border-mono-300 dark:border-mono-600 pl-6">
            // {heroSubtitle || "The ultimate resource for developers to learn, build, and grow."}
            <br />
            <span className="text-mono-400 dark:text-mono-500 text-sm mt-2 block font-mono">
              await load_resources(success=True);
            </span>
          </p>

          <div className="flex flex-wrap gap-4">
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                variant={btn.primary ? 'primary' : 'secondary'}
                size="lg"
                leftIcon={btn.icon}
                onClick={() => navigate(btn.path)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Right Content: Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="bg-white dark:bg-mono-800 rounded-xl border border-mono-200 dark:border-mono-700 shadow-2xl overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-mono-50 dark:bg-mono-900 px-4 py-3 flex items-center gap-2 border-b border-mono-200 dark:border-mono-700">
              <div className="w-3 h-3 rounded-full bg-mono-300 dark:bg-mono-600"></div>
              <div className="w-3 h-3 rounded-full bg-mono-300 dark:bg-mono-600"></div>
              <div className="w-3 h-3 rounded-full bg-mono-300 dark:bg-mono-600"></div>
              <span className="ml-4 text-xs text-mono-400 dark:text-mono-500 font-mono">bash — 80x24</span>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm space-y-4 bg-white dark:bg-mono-800">
              <div className="flex gap-2">
                <span className="text-mono-500 dark:text-mono-400">user@ours:~$</span>
                <span className="text-mono-950 dark:text-white">npm install skills-upgrade</span>
              </div>
              <div className="text-mono-500 dark:text-mono-400 pl-4">
                <p>Installing dependencies...</p>
                <p>+ React Mastery <span className="text-mono-950 dark:text-white">Done</span></p>
                <p>+ Backend Logic <span className="text-mono-950 dark:text-white">Done</span></p>
                <p>+ System Design <span className="text-mono-950 dark:text-white">Done</span></p>
                <p className="text-mono-600 dark:text-mono-300 mt-2">Success! You are now ready to build.</p>
              </div>

              <div className="flex gap-2">
                <span className="text-mono-500 dark:text-mono-400">user@ours:~$</span>
                <span className="text-mono-950 dark:text-white">./start-career.sh</span>
              </div>
              <div className="pl-4 border-l-2 border-dashed border-mono-300 dark:border-mono-600 ml-1">
                <div className="flex items-center gap-4 bg-mono-50 dark:bg-mono-700 p-3 rounded border border-mono-200 dark:border-mono-600 mt-2">
                  <div className="bg-mono-200 dark:bg-mono-600 p-2 rounded text-mono-600 dark:text-mono-300"><Code2 size={20} /></div>
                  <div>
                    <h4 className="text-mono-950 dark:text-white font-bold">Full Stack Course</h4>
                    <p className="text-xs text-mono-500 dark:text-mono-400">Next.js, Node, PostgreSQL</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 animate-pulse">
                <span className="text-mono-500 dark:text-mono-400">user@ours:~$</span>
                <span className="w-2 h-4 bg-mono-950 dark:bg-white block"></span>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-6 bg-mono-950 dark:bg-white text-white dark:text-mono-950 px-4 py-2 rounded-full font-bold shadow-xl"
          >
            100% Practical
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;