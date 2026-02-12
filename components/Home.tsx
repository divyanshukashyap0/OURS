import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Newspaper, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProjects } from '../lib/projects';
import Hero from './Hero';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const featuredProject = projects.length > 0 ? projects[0] : null;

  // Logic for Trending/Secondary Project
  const manuallyTrending = projects.find(p => p.isTrending);
  const secondaryProject = manuallyTrending && manuallyTrending.id !== featuredProject?.id
    ? manuallyTrending
    : (projects.length > 1 ? projects[1] : null);

  const recentProjects = projects
    .filter(p => p.id !== featuredProject?.id && p.id !== secondaryProject?.id)
    .slice(0, 4);

  return (
    <div className="bg-mono-950 transition-colors">
      {/* Hero Section */}
      <Hero />

      {/* Bento Grid Section */}
      <section className="py-24 px-6 lg:px-8 bg-mono-950 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neon-violet/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-end justify-between"
          >
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Editor's Picks</h2>
              <p className="text-mono-400">Curated high-performance resources.</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(250px,auto)]">

            {/* 1. Intro Card - Glass */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="col-span-1 md:col-span-2 row-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:border-neon-cyan/50 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-32 bg-neon-cyan/10 blur-[60px] rounded-full group-hover:bg-neon-cyan/20 transition-all duration-500"></div>

              <div className="z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-neon-cyan/10 p-2 rounded-lg">
                    <Code2 className="text-neon-cyan" size={24} />
                  </div>
                  <span className="font-bold text-neon-cyan text-sm tracking-wider uppercase">Premium Platform</span>
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight mb-2">Build faster.</h3>
                <p className="text-mono-400 max-w-xs">Access production-ready source code.</p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neon-cyan transition-colors flex items-center gap-2 group/btn"
                >
                  Explore <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* 2. Request Project Card - Neon Border */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="col-span-1 md:col-span-2 bg-gradient-to-br from-mono-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:shadow-[0_0_30px_rgba(112,0,255,0.2)]"
              onClick={() => navigate('/request-project')}
            >
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #7000ff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-neon-violet" />
                    <span className="text-xs font-bold text-neon-violet tracking-widest uppercase">Custom Request</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">Need a custom build?</h3>
                </div>

                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md group-hover:border-neon-violet/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-mono-300 text-sm">Initiate Protocol</span>
                    <ArrowRight className="text-neon-violet" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. Featured Project - Immersive Image */}
            {featuredProject ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                onClick={() => navigate(`/project/${featuredProject.id}`)}
                className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden cursor-pointer group border border-white/10"
              >
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mono-950 via-mono-950/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-neon-cyan text-black text-xs font-bold px-3 py-1 rounded-full">FEATURED</span>
                    <span className="bg-black/50 backdrop-blur border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">{featuredProject.price}</span>
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">{featuredProject.title}</h3>
                  <p className="text-mono-300 line-clamp-2">{featuredProject.description}</p>
                </div>
              </motion.div>
            ) : (
              <div className="col-span-1 md:col-span-2 row-span-2 bg-white/5 animate-pulse rounded-3xl"></div>
            )}

            {/* 4. Secondary/Trending Project */}
            {secondaryProject ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                onClick={() => navigate(`/project/${secondaryProject.id}`)}
                className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden cursor-pointer group border border-white/10"
              >
                <img
                  src={secondaryProject.image}
                  alt={secondaryProject.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neon-violet/20 via-mono-950/40 to-mono-950/80"></div>
                <div className="absolute top-0 left-0 p-8 w-full z-10">
                  <span className="text-neon-violet font-bold tracking-widest text-xs border border-neon-violet/50 px-3 py-1 rounded-full bg-neon-violet/10">TRENDING</span>
                </div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-neon-violet transition-colors">{secondaryProject.title}</h3>
                  <p className="text-mono-300 line-clamp-2">{secondaryProject.description}</p>
                </div>
              </motion.div>
            ) : (
              <div className="col-span-1 md:col-span-2 row-span-2 bg-white/5 animate-pulse rounded-3xl"></div>
            )}

            {/* 5. Recent Projects List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="col-span-1 md:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8"
            >
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">Fresh Drops</h3>
                  <p className="text-mono-400 text-sm">Just added to the repository.</p>
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-neon-cyan font-bold hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recentProjects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="group cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-colors"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-mono-800 mb-4 relative border border-white/5 group-hover:border-neon-cyan/50 transition-colors">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-white truncate group-hover:text-neon-cyan transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-mono-400 mt-1">
                      {project.price}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
