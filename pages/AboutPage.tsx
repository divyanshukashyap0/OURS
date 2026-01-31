import React, { useEffect } from 'react';

import About from '../components/About';
import TechStack from '../components/TechStack';
import Contact from '../components/Contact';

const AboutPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <About />
            <TechStack />
            <Contact />
        </>
    );
};

export default AboutPage;
