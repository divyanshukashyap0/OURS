import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Terminal, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import Button from './ui/Button';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { heroTitle, heroSubtitle } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-mono-950 font-sans pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full perspective-[1000px]">
        {/* Moving Grid */}
        <div className="absolute inset-x-[-50%] inset-y-[-50%] w-[200%] h-[200%] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] animate-float [transform-style:preserve-3d] [transform:rotateX(60deg)] origin-center opacity-30"></div>

        {/* Radial Gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-cyan/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-violet/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen animate-pulse-glow delay-1000"></div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 container mx-auto px-6 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-neon-cyan text-xs font-bold mb-8 uppercase tracking-widest hover:border-neon-cyan/50 transition-colors cursor-default"
          >
            <Sparkles size={12} className="text-neon-cyan" />
            <span>Futuristic Learning Ecosystem</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.9] mb-8 tracking-tighter">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              BUILD.
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-violet animate-pulse-glow">
              SHIP.
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              SCALE.
            </span>
          </h1>

          <p className="text-xl text-mono-400 mb-10 max-w-lg leading-relaxed border-l-2 border-neon-cyan/50 pl-6 bg-gradient-to-r from-neon-cyan/5 to-transparent py-2">
            The ultimate resource for developers to master modern tech stacks.
            <span className="block text-neon-cyan/80 text-sm mt-3 font-mono">
              &gt; initializing_success_protocol...
            </span>
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="lg"
              className="bg-neon-cyan text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] border-none"
              onClick={() => navigate('/courses')}
            >
              Start Learning
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 hover:border-white"
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
          </div>
        </motion.div>

        {/* Right Content: 3D Glitch Card */}
        <div className="relative hidden lg:block perspective-[2000px]">
          <motion.div
            initial={{ opacity: 0, rotateY: -30, rotateX: 20, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: -15, rotateX: 10, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05 }}
            className="relative z-10 bg-black/60 backdrop-blur-3xl rounded-3xl border border-white/10 p-8 shadow-2xl shadow-neon-violet/20 group"
          >
            {/* Glossy Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl pointer-events-none"></div>

            {/* Content */}
            <div className="font-mono text-sm space-y-6 relative z-20">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-white/30 text-xs">premium_dev_env</div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-3">
                  <span className="text-neon-cyan">➜</span>
                  <span className="text-white">git clone</span>
                  <span className="text-neon-violet">https://ours.io/future</span>
                </div>
                <div className="text-white/50 pl-6 text-xs">Cloning into 'future'...</div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/5 group-hover:border-neon-cyan/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neon-cyan/20 rounded-lg text-neon-cyan">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">Full Stack Mastery</div>
                    <div className="text-white/50 text-xs">Next.js • React • Node</div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet"
                  ></motion.div>
                </div>
              </div>

              <div className="animate-pulse flex gap-2">
                <span className="text-neon-cyan">➜</span>
                <span className="w-2 h-5 bg-white block"></span>
              </div>
            </div>

            {/* Glowing Orbs around card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-cyan/30 blur-[50px] rounded-full animate-float"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-neon-violet/30 blur-[50px] rounded-full animate-float delay-1000"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};
export default Hero;