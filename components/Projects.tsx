import React from 'react';
import Section from './Section';
import { PROJECTS } from '../constants';
import { ExternalLink, Github, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Section
      id="projects"
      title="Latest Projects"
      subtitle="Hands-on coding projects to help you practice and build your portfolio."
      className="bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="relative group/carousel">
        <button
          onClick={() => {
            const container = document.getElementById('projects-scroll-container');
            if (container) {
              const scrollAmount = container.clientWidth * 0.85;
              container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white -ml-4 md:-ml-5 hover:scale-110 transition-all duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => {
            const container = document.getElementById('projects-scroll-container');
            if (container) {
              const scrollAmount = container.clientWidth * 0.85;
              container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white -mr-4 md:-mr-5 hover:scale-110 transition-all duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>

        <div
          id="projects-scroll-container"
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-8 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide"
        >
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="group min-w-[85vw] md:min-w-0 md:w-auto snap-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-1 active:scale-95 flex flex-col"
            >
              <div className="relative h-56">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold flex items-center gap-2">
                    View Details <ArrowRight size={20} />
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow h-full">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <Button variant="outline" className="w-full justify-center md:hidden group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10">
                  View Project
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Projects;