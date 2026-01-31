import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export interface SiteConfig {
    appName: string;
    heroTitle: string;
    heroSubtitle: string;
    contactEmail: string;
    socials: {
        github: string;
        twitter: string;
        linkedin: string;
    };
}

const defaultConfig: SiteConfig = {
    appName: 'OURS.',
    heroTitle: 'Welcome to OURS.',
    heroSubtitle: 'The platform for developers to build, learn, and grow.',
    contactEmail: 'support@urs.com',
    socials: {
        github: '',
        twitter: '',
        linkedin: ''
    }
};

const SiteContext = createContext<SiteConfig>(defaultConfig);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<SiteConfig>(defaultConfig);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
            if (doc.exists()) {
                setConfig({ ...defaultConfig, ...doc.data() as Partial<SiteConfig> });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <SiteContext.Provider value={config}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => useContext(SiteContext);
