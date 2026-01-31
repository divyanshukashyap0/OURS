import React from 'react';
import Section from './Section';
import { PROJECTS } from '../constants';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
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
      <div className="grid md:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`)}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
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
    </Section>
  );
};

export default Projects;