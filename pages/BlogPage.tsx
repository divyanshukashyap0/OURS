import React, { useEffect } from 'react';
import Blog from '../components/Blog';

const BlogPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            <main className="flex-grow pt-20">
                <Blog />
            </main>
        </div>
    );
};

export default BlogPage;
