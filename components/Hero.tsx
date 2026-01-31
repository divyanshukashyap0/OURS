import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, PlayCircle, User, Newspaper, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

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
    { label: 'Start Learning', icon: <Terminal size={18} />, path: '/courses', color: 'bg-tech-primary hover:bg-sky-600 text-white' },
    { label: 'View Projects', icon: <Code2 size={18} />, path: '/projects', color: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-tech-darker font-mono">
      {/* Tech Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2]"></div>

      {/* Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-tech-primary/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tech-card border border-tech-primary/30 text-tech-primary text-xs font-bold mb-6 tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            v2.0 System Online
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {text}
            </span>
            <span className="animate-blink text-tech-primary">_</span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed border-l-2 border-tech-primary/50 pl-6">
            // {heroSubtitle || "The ultimate resource for developers to learn, build, and grow."}
            <br />
            <span className="text-tech-accent text-sm mt-2 block"> await load_resources(success=True);</span>
          </p>

          <div className="flex flex-wrap gap-4">
            {buttons.map((btn) => (
              <motion.button
                key={btn.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(btn.path)}
                className={`${btn.color} px-8 py-3.5 rounded-lg font-medium shadow-lg transition-all flex items-center gap-3`}
              >
                {btn.icon}
                {btn.label}
              </motion.button>
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
          <div className="bg-tech-card rounded-xl border border-gray-700 shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-90">
            {/* Terminal Header */}
            <div className="bg-gray-800/50 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-xs text-gray-500 font-mono">bash — 80x24</span>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="flex gap-2">
                <span className="text-tech-accent">user@ours:~$</span>
                <span className="text-white">npm install skills-upgrade</span>
              </div>
              <div className="text-gray-400 pl-4">
                <p>Installing dependencies...</p>
                <p>+ React Mastery <span className="text-tech-primary">Done</span></p>
                <p>+ Backend Logic <span className="text-tech-primary">Done</span></p>
                <p>+ System Design <span className="text-tech-primary">Done</span></p>
                <p className="text-tech-accent mt-2">Success! You are now ready to build.</p>
              </div>

              <div className="flex gap-2">
                <span className="text-tech-accent">user@ours:~$</span>
                <span className="text-white">./start-career.sh</span>
              </div>
              <div className="pl-4 border-l-2 border-dashed border-gray-600 ml-1">
                <div className="flex items-center gap-4 bg-gray-800/50 p-3 rounded border border-gray-700 mt-2">
                  <div className="bg-blue-500/20 p-2 rounded text-blue-400"><Code2 size={20} /></div>
                  <div>
                    <h4 className="text-white font-bold">Full Stack Course</h4>
                    <p className="text-xs text-gray-400">Next.js, Node, PostgreSQL</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 animate-pulse">
                <span className="text-tech-accent">user@ours:~$</span>
                <span className="w-2 h-4 bg-white block"></span>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-6 -right-6 bg-tech-accent text-tech-darker px-4 py-2 rounded-lg font-bold shadow-xl border border-white/20"
          >
            100% Practical
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;