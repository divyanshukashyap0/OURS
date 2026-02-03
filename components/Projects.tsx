import React, { useState, useEffect } from 'react';
import { getProjects } from '../lib/projects';
import Section from './Section';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Projects: React.FC = () => {
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Section
      id="projects"
      title="Latest Projects"
      subtitle="Hands-on coding projects to help you practice and build your portfolio."
      className="bg-mono-50 dark:bg-mono-900"
    >
      <div className="relative group/carousel">
        {/* Nav Buttons */}
        <button
          onClick={() => {
            const container = document.getElementById('projects-scroll-container');
            if (container) {
              container.scrollBy({ left: -container.clientWidth * 0.85, behavior: 'smooth' });
            }
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-mono-800 p-3 rounded-full shadow-lg border border-mono-100 dark:border-mono-700 text-mono-700 dark:text-white -ml-4 hover:scale-105 transition-all duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => {
            const container = document.getElementById('projects-scroll-container');
            if (container) {
              container.scrollBy({ left: container.clientWidth * 0.85, behavior: 'smooth' });
            }
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-mono-800 p-3 rounded-full shadow-lg border border-mono-100 dark:border-mono-700 text-mono-700 dark:text-white -mr-4 hover:scale-105 transition-all duration-300"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        <div
          id="projects-scroll-container"
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-8 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              variants={fadeInUp}
              onClick={() => navigate(`/project/${project.id}`)}
              className="group min-w-[85vw] md:min-w-0 snap-center bg-white dark:bg-mono-800 rounded-2xl border border-mono-100 dark:border-mono-700 overflow-hidden hover:shadow-xl transition-all duration-400 cursor-pointer hover:-translate-y-1 active:scale-[0.98] flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-mono-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2">
                    View Details <ArrowRight size={18} />
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-mono-950 dark:text-white mb-2 group-hover:text-mono-600 dark:group-hover:text-mono-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-mono-500 dark:text-mono-400 text-sm mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  {project.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-mono-100 dark:bg-mono-700 text-mono-600 dark:text-mono-300 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button variant="outline" className="w-full justify-center md:hidden">
                  View Project
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Projects;