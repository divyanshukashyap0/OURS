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

      {/* 1. Intro Card (Large) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="col-span-1 md:col-span-2 row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col justify-between text-white relative overflow-hidden group shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors duration-500"></div>
        <div>
          <div className="bg-white/20 backdrop-blur-sm p-2 w-fit rounded-lg mb-4">
            <Code2 className="text-white" size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Build better <br />software, faster.
          </h1>
          <p className="text-blue-100 text-lg max-w-sm">
            Access premium full-stack projects, source code, and master modern web development.
          </p>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={() => navigate('/projects')} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
            Explore Projects <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>



      {/* 3. Latest Blog (Simple) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        onClick={() => navigate('/blog')}
        className="col-span-1 md:col-span-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
      >
        <div className="absolute top-4 right-4">
          <ExternalLink size={18} className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
        </div>
        <div className="h-full flex flex-col justify-between">
          <div className="bg-purple-100 dark:bg-purple-900/30 w-fit p-2 rounded-lg text-purple-600 dark:text-purple-400 mb-4">
            <Newspaper size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Latest Read</p>
            <h4 className="font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">{BLOG_POSTS[0]?.title}</h4>
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


      {/* 6. Socials / About */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
        className="col-span-1 md:col-span-1 bg-gray-900 dark:bg-black text-white rounded-3xl p-6 flex flex-col justify-between border border-gray-800"
      >
        <div>
          <h4 className="font-bold text-lg mb-1">Connect</h4>
          <p className="text-gray-400 text-sm">Join our community.</p>
        </div>
        <div className="flex gap-4 mt-4">
          <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Github size={20} /></a>
          <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Twitter size={20} /></a>
          <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={20} /></a>
        </div>
      </motion.div>

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
