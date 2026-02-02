import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import Hero from './Hero';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), limit(6));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const featuredProject = projects.length > 0 ? projects[0] : null;
  const secondaryProject = projects.length > 1 ? projects[1] : null;
  const recentProjects = projects.length > 2 ? projects.slice(2, 6) : [];

  return (
    <div className="bg-white dark:bg-mono-950 transition-colors">
      {/* Hero Section */}
      <Hero />

      {/* Bento Grid Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-mono-50 dark:bg-mono-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

            {/* 1. Intro Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-1 md:col-span-2 row-span-1 bg-mono-950 dark:bg-white rounded-2xl p-6 flex flex-row items-center justify-between text-white dark:text-mono-950 relative overflow-hidden group"
            >
              <div className="z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 dark:bg-mono-950/20 backdrop-blur-sm p-1.5 rounded-lg">
                    <Code2 className="text-white dark:text-mono-950" size={20} />
                  </div>
                  <span className="font-bold text-mono-300 dark:text-mono-600 text-sm tracking-wider uppercase">Platform</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
                  Build better software.
                </h1>
                <p className="text-mono-400 dark:text-mono-500 text-sm max-w-xs mb-4 hidden md:block">
                  Access premium full-stack projects and source code.
                </p>
                <button
                  onClick={() => navigate('/projects')}
                  className="bg-white dark:bg-mono-950 text-mono-950 dark:text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors inline-flex items-center gap-2"
                >
                  Explore Projects <ArrowRight size={16} />
                </button>
              </div>
              <div className="hidden md:block absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
                <Code2 size={180} />
              </div>
            </motion.div>

            {/* 2. Request Project Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-1 md:col-span-2 bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-white rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors"
              onClick={() => navigate('/request-project')}
            >
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 flex flex-row justify-between items-center h-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Newspaper size={16} className="text-mono-500 dark:text-mono-400" />
                    <span className="text-xs font-mono text-mono-500 dark:text-mono-400 tracking-widest uppercase">The Builder's Codex</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">Need a Unique Project?</h3>
                  <p className="text-mono-600 dark:text-mono-300 text-sm max-w-sm mb-4">
                    Manual instructions to request a custom build or mentorship.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold bg-mono-950/10 dark:bg-white/10 w-fit px-3 py-2 rounded-full">
                    <span>WRITE PROTOCOL</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
                <div className="hidden sm:block opacity-80 group-hover:scale-110 transition-transform duration-500 rotate-[-10deg]">
                  <div className="w-24 h-32 bg-white dark:bg-mono-900 rounded-lg p-3 shadow-lg flex flex-col gap-2">
                    <div className="w-12 h-2 bg-mono-200 dark:bg-mono-700 rounded"></div>
                    <div className="w-full h-16 bg-mono-50 dark:bg-mono-800 rounded border-2 border-dashed border-mono-200 dark:border-mono-600"></div>
                    <div className="w-16 h-2 bg-mono-200 dark:bg-mono-700 rounded mt-auto"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. Featured Project */}
            {featuredProject ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => navigate(`/project/${featuredProject.id}`)}
                className="col-span-1 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mono-950/90 via-mono-950/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-mono-950 dark:bg-white text-white dark:text-mono-950 text-xs font-bold px-2 py-1 rounded-full">FEATURED</span>
                    <span className="bg-mono-800/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full">{featuredProject.price}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{featuredProject.title}</h3>
                  <p className="text-mono-300 line-clamp-2 max-w-md">{featuredProject.description}</p>
                </div>
              </motion.div>
            ) : (
              <div className="col-span-1 md:col-span-2 row-span-2 bg-mono-100 dark:bg-mono-800 rounded-2xl animate-pulse"></div>
            )}

            {/* 4. Secondary/Trending Project */}
            {secondaryProject ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onClick={() => navigate(`/project/${secondaryProject.id}`)}
                className="col-span-1 md:col-span-2 row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={secondaryProject.image}
                  alt={secondaryProject.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mono-950/90 via-mono-950/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-mono-600 text-white text-xs font-bold px-2 py-1 rounded-full">TRENDING</span>
                    <span className="bg-mono-800/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full">{secondaryProject.price}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{secondaryProject.title}</h3>
                  <p className="text-mono-300 line-clamp-2 max-w-md">{secondaryProject.description}</p>
                </div>
              </motion.div>
            ) : (
              <div className="col-span-1 md:col-span-2 row-span-2 bg-mono-100 dark:bg-mono-800 rounded-2xl animate-pulse"></div>
            )}

            {/* 5. Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="col-span-1 md:col-span-4 bg-white dark:bg-mono-800 border border-mono-100 dark:border-mono-700 rounded-2xl p-8"
            >
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-mono-950 dark:text-white">Recent Projects</h3>
                  <p className="text-mono-500 dark:text-mono-400">Fresh from the lab.</p>
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-mono-950 dark:text-white font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recentProjects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden bg-mono-100 dark:bg-mono-700 mb-3 relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-mono-950 dark:text-white truncate group-hover:text-mono-600 dark:group-hover:text-mono-300 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-mono-500 dark:text-mono-400">
                      {(project.tags && project.tags[0]) || 'Project'} • {project.price}
                    </p>
                  </div>
                ))}
                {recentProjects.length === 0 && !featuredProject && (
                  <div className="col-span-4 text-center text-mono-400 py-10">Loading projects...</div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
