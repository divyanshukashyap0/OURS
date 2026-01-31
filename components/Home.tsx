import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Users, Newspaper, ExternalLink, Github, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { BLOG_POSTS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch recent projects
        const q = query(collection(db, 'projects'), limit(5)); // Get 5 projects (1 featured + 4 recent)
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

  // Use fetched projects or empty placeholders if loading
  const featuredProject = projects.length > 0 ? projects[0] : null;
  const recentProjects = projects.length > 1 ? projects.slice(1, 5) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

      {/* 1. Intro Card (Compact) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="col-span-1 md:col-span-2 row-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 flex flex-row items-center justify-between text-white relative overflow-hidden group shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-500"></div>
        <div className="z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
              <Code2 className="text-white" size={20} />
            </div>
            <span className="font-bold text-blue-100 text-sm tracking-wider uppercase">Platform</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
            Build better software.
          </h1>
          <p className="text-blue-100 text-sm max-w-xs mb-4 hidden md:block">
            Access premium full-stack projects and source code.
          </p>
          <button onClick={() => navigate('/projects')} className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
            Explore Projects <ArrowRight size={16} />
          </button>
        </div>
        {/* Abstract decorative element for visual balance */}
        <div className="hidden md:block absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12">
          <Code2 size={180} />
        </div>
      </motion.div>

      {/* 2. Interview Prep (High Utility) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="col-span-1 md:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-5 flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:shadow-lg transition-all"
        onClick={() => alert("Opening Interview Question #42...")}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
            <Code2 size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Daily Prep</span>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">React Hooks</h4>
          <p className="text-xs text-gray-500 mb-3">Explain the dependency array in useEffect.</p>
        </div>
        <div className="mt-auto">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            Practice Now <ArrowRight size={12} />
          </span>
        </div>
      </motion.div>

      {/* 3. Dev Cheatsheets (Resource Library) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
        className="col-span-1 md:col-span-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        onClick={() => navigate('/resources')}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 dark:text-white">Cheatsheets</h3>
          <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {['Git', 'React', 'CSS', 'Linux'].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-900 p-2 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 text-center border border-gray-100 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-shadow">
              {item}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3.5 The "Manual" (Unique Project Request) - NEW REQUEST */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="col-span-1 md:col-span-2 bg-indigo-600 text-white rounded-3xl p-6 relative overflow-hidden group cursor-pointer"
        onClick={() => {
          // Placeholder: could open a modal or navigate
          alert("Protocol Initiated: Describe your unique vision in the next step.");
        }}
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="relative z-10 flex flex-row justify-between items-center h-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Newspaper size={16} className="text-indigo-200" />
              <span className="text-xs font-mono text-indigo-200 tracking-widest uppercase">The Builder's Codex</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">Need a Unique Project?</h3>
            <p className="text-indigo-100 text-sm max-w-sm mb-4">
              Manual instructions to request a custom build or mentorship.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
              <span>READ PROTOCOL</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Visual: Documentation/Blueprint Icon */}
          <div className="hidden sm:block opacity-80 group-hover:scale-110 transition-transform duration-500 rotate-[-10deg]">
            <div className="w-24 h-32 bg-white text-indigo-900 rounded-lg p-3 shadow-2xl flex flex-col gap-2">
              <div className="w-12 h-2 bg-indigo-200 rounded"></div>
              <div className="w-full h-16 bg-indigo-50 rounded border-2 border-dashed border-indigo-200"></div>
              <div className="w-16 h-2 bg-indigo-200 rounded mt-auto"></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Featured Project (Large Image) */}
      {featuredProject ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
          onClick={() => navigate(`/project/${featuredProject.id}`)}
          className="col-span-1 md:col-span-2 row-span-2 relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg"
        >
          <img
            src={featuredProject.image}
            alt={featuredProject.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">FEATURED</span>
              <span className="bg-gray-800/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-md">{featuredProject.price}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{featuredProject.title}</h3>
            <p className="text-gray-300 line-clamp-2 max-w-md">{featuredProject.description}</p>
          </div>
        </motion.div>
      ) : (
        // Placeholder skeleton if no projects yet
        <div className="col-span-1 md:col-span-2 row-span-2 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
      )}




      {/* 7. Quick Links list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
        className="col-span-1 md:col-span-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm"
      >
        <div className="flex justify-between items-end mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Projects</h3>
            <p className="text-gray-500">Fresh from the lab.</p>
          </div>
          <button onClick={() => navigate('/projects')} className="text-blue-600 font-semibold hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {recentProjects.map(project => (
            <div key={project.id} onClick={() => navigate(`/project/${project.id}`)} className="group cursor-pointer">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3 relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{project.title}</h4>
              <p className="text-xs text-gray-500">{(project.tags && project.tags[0]) || 'Project'} • {project.price}</p>
            </div>
          ))}
          {recentProjects.length === 0 && !featuredProject && (
            <div className="col-span-4 text-center text-gray-400 py-10">Loading projects...</div>
          )}
        </div>
      </motion.div>

    </div>
  );
};

export default Home;
