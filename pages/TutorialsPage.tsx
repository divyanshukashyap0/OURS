import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Video, Users, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const TutorialsPage: React.FC = () => {
    const navigate = useNavigate();

    const tracks = [
        {
            title: "The Beginner's Path",
            description: "Start here if you've never written a line of code. We'll hold your hand (metaphorically).",
            icon: <BookOpen className="text-green-500" size={32} />,
            color: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900",
            modules: ["HTML & CSS Basics", "JavaScript for Humans", "Your First Website"]
        },
        {
            title: "The Builder's Path",
            description: " You know the basics. Now let's build stuff that actually works and looks cool.",
            icon: <Code className="text-blue-500" size={32} />,
            color: "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900",
            modules: ["React.js Fundamentals", "Tailwind CSS Styling", "Working with APIs"]
        },
        {
            title: "The Pro's Path",
            description: "Deep dives into backend, databases, and deploying scalable apps.",
            icon: <Video className="text-purple-500" size={32} />,
            color: "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900",
            modules: ["Node.js & Express", "Firebase & Databases", "Payment Integration"]
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Learn by <span className="text-blue-600">Doing</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        No boring lectures. No 10-hour theory videos. Just practical, hands-on guides to help you build your dreams.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tracks.map((track, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`rounded-2xl border p-8 ${track.color} relative overflow-hidden`}
                        >
                            <div className="mb-6">{track.icon}</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{track.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 min-h-[80px]">{track.description}</p>

                            <div className="space-y-3 mb-8">
                                {track.modules.map((mod, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                                        <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-bold shadow-sm">
                                            {i + 1}
                                        </div>
                                        {mod}
                                    </div>
                                ))}
                            </div>

                            <Button
                                className="w-full gap-2"
                                variant={idx === 1 ? 'primary' : 'outline'}
                                onClick={() => navigate('/courses')}
                            >
                                Start Path <ArrowRight size={16} />
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Community Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 bg-gray-900 dark:bg-gray-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <Users className="text-blue-400 mx-auto mb-6" size={48} />
                        <h2 className="text-3xl font-bold text-white mb-4">Never Learn Alone</h2>
                        <p className="text-gray-300 max-w-xl mx-auto mb-8">
                            Stuck on a bug? Need code review? Our Discord community is full of friendly folks who love to help.
                            We have a "no stupid questions" policy (seriously).
                        </p>
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
                            Join Discord Community
                        </Button>
                    </div>

                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </motion.div>
            </div>
        </div>
    );
};

export default TutorialsPage;
