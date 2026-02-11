import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Code2, X, ChevronRight, Zap, Trophy, Rocket } from 'lucide-react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Tutorial } from '../types';
import Button from '../components/ui/Button';

const TutorialsPage: React.FC = () => {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null);
    const [activeTab, setActiveTab] = useState<'beginner' | 'builder' | 'pro'>('beginner');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const q = query(collection(db, 'tutorials'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tutorial[];
                setTutorials(fetchedData);
            } catch (error) {
                console.error("Error fetching tutorials:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTutorials();
    }, []);

    // Group tutorials
    const tabs = [
        { id: 'beginner', label: 'Beginner', icon: Rocket, color: 'text-green-500' },
        { id: 'builder', label: 'Builder', icon: Code2, color: 'text-blue-500' },
        { id: 'pro', label: 'Pro', icon: Trophy, color: 'text-purple-500' }
    ];

    const filteredTutorials = tutorials.filter(t => {
        if (activeTab === 'beginner') return t.difficulty === 'Beginner';
        if (activeTab === 'builder') return t.difficulty === 'Intermediate';
        return t.difficulty === 'Advanced';
    });

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Master <span className="text-blue-600">Real-World</span> Development
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Project-based learning paths to take you from hello world to senior engineer.
                    </motion.p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm inline-flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : tab.color} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-500 bg-gray-100 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-400">
                                <Clock size={40} />
                            </div>
                            <p>Loading tutorials...</p>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredTutorials.length > 0 ? (
                            filteredTutorials.map((tutorial, idx) => (
                                <motion.div
                                    key={tutorial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col group cursor-pointer"
                                    onClick={() => setSelectedVideo(tutorial)}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            src={tutorial.thumbnail}
                                            alt={tutorial.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                                                <Play fill="currentColor" size={32} />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                                            <Clock size={12} /> {tutorial.duration}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-semibold
                                                ${tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    tutorial.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                }`}>
                                                {tutorial.difficulty}
                                            </span>
                                            {tutorial.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {tutorial.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                                            {tutorial.description}
                                        </p>

                                        <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                                            Start Tutorial
                                        </Button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-gray-500 bg-gray-100 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-400">
                                        <Code2 size={40} />
                                    </div>
                                    <p>No tutorials found for this level yet.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Video Modal */}
                <AnimatePresence>
                    {selectedVideo && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setSelectedVideo(null)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl relative z-10"
                            >
                                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-4">
                                        {selectedVideo.title}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="aspect-video bg-black relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`${selectedVideo.videoUrl}?autoplay=1`}
                                        title={selectedVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="absolute inset-0"
                                    />
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedVideo.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {selectedVideo.description}
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TutorialsPage;
