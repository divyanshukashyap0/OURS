import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import About from '../components/About';
import TechStack from '../components/TechStack';
import Contact from '../components/Contact';

const AboutPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            <main className="flex-grow pt-20">
                <About />
                <TechStack />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
