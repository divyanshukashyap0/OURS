import React, { useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { PlayCircle, Clock, Star, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const COURSES = [
    {
        id: 1,
        title: 'React.js Masterclass: Zero to Hero',
        instructor: 'Alex Johnson',
        duration: '12h 45m',
        rating: 4.9,
        students: '12.5k',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: ['React', 'Frontend', 'Hooks'],
        price: '$49.99'
    },
    {
        id: 2,
        title: 'Advanced Next.js Pattern & Performance',
        instructor: 'Sarah Smith',
        duration: '8h 30m',
        rating: 4.8,
        students: '8.2k',
        image: 'https://images.unsplash.com/photo-1649180556628-9ba704115795?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: ['Next.js', 'SSR', 'Performance'],
        price: '$59.99'
    },
    {
        id: 3,
        title: 'Fullstack MERN Bootcamp',
        instructor: 'Mike Brown',
        duration: '24h 15m',
        rating: 4.9,
        students: '20k+',
        image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: ['MongoDB', 'Express', 'React', 'Node'],
        price: '$89.99'
    },
    {
        id: 4,
        title: 'Python for Data Science',
        instructor: 'Emily Davis',
        duration: '18h 00m',
        rating: 4.7,
        students: '15k',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: ['Python', 'Data Science', 'Pandas'],
        price: '$39.99'
    },
    {
        id: 5,
        title: 'UI/UX Design Principles',
        instructor: 'Jessica Lee',
        duration: '6h 20m',
        rating: 4.8,
        students: '5k',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: ['Design', 'Figma', 'UI/UX'],
        price: '$29.99'
    },
    {
        id: 6,
        title: 'Docker & Kubernetes Mastery',
        instructor: 'David Wilson',
        duration: '10h 50m',
        rating: 4.9,
        students: '9.8k',
        image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tags: ['DevOps', 'Docker', 'Kubernetes'],
        price: '$69.99'
    }
];

const CoursesPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">Master New Skills</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        High-quality courses taught by industry experts. From frontend to backend, design to devops.
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COURSES.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            {/* Image Header */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 dark:bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-gray-900 dark:text-white">
                                        {course.tags[0]}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    <div className="flex items-center gap-1">
                                        <BookOpen size={14} />
                                        <span>{course.tags.length} Lessons</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{course.duration}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    by <span className="text-gray-900 dark:text-gray-200 font-medium">{course.instructor}</span>
                                </p>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                        <span className="text-gray-900 dark:text-white">{course.rating}</span>
                                        <Star size={14} fill="currentColor" />
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        ({course.students} students)
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{course.price}</span>
                                    <Button variant="primary" className="rounded-full px-6">
                                        Enroll
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default CoursesPage;
