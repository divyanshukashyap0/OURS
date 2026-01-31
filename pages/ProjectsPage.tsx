import React, { useEffect } from 'react';
import Projects from '../components/Projects';

const ProjectsPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            <main className="flex-grow pt-20">
                <Projects />
            </main>
        </div>
    );
};

export default ProjectsPage;
