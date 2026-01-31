import React, { useEffect } from 'react';
import { Github, Lock, Unlock, ExternalLink, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const repositories = [
    { id: 1, name: 'ours-platform', status: 'Private', language: 'TypeScript', stars: 128, updated: '2 days ago' },
    { id: 2, name: 'react-shadcn-starter', status: 'Public', language: 'TypeScript', stars: 450, updated: '1 week ago' },
    { id: 3, name: 'netflix-clone-v2', status: 'Public', language: 'JavaScript', stars: 890, updated: '3 weeks ago' },
    { id: 4, name: 'ai-image-generator', status: 'Premium', language: 'Python', stars: 56, updated: '1 day ago' },
    { id: 5, name: 'ecommerce-dashboard', status: 'Premium', language: 'Vue', stars: 89, updated: '5 days ago' },
];

const SourceCode: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-5xl mx-auto min-h-[60vh]">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Source Code Repositories</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Access the complete source code for our projects. Premium members get instant access to private repositories.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800">
                    {repositories.map((repo, index) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={repo.id}
                            className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${repo.status === 'Public' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                        repo.status === 'Premium' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    <Github size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                        {repo.name}
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${repo.status === 'Public' ? 'border-green-200 text-green-700 dark:border-green-800 dark:text-green-400' :
                                                repo.status === 'Premium' ? 'border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400' :
                                                    'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400'
                                            }`}>
                                            {repo.status}
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> {repo.language}</span>
                                        <span className="flex items-center gap-1"><Star size={12} /> {repo.stars}</span>
                                        <span>Updated {repo.updated}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Issues
                                </button>
                                <button className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${repo.status === 'Private' ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600' :
                                        'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20'
                                    }`}>
                                    {repo.status === 'Private' ? <Lock size={16} /> : <Unlock size={16} />}
                                    {repo.status === 'Private' ? 'No Access' : 'Access Code'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SourceCode;
