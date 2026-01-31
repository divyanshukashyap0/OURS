import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import { PlayCircle, Clock, Star, Users, BookOpen } from 'lucide-react';
import LogoLoader from '../components/ui/LogoLoader';
import { motion } from 'framer-motion';
import { CourseData, getCourses } from '../lib/courses';

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to load courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
                {loading ? (
                    <div className="flex justify-center py-20"><LogoLoader size={48} /></div>
                ) : (
                    <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-8 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-0 scrollbar-hide">
                        {courses.map((course, index) => (
                            <motion.div
                                key={course.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="min-w-[85vw] md:min-w-0 md:w-auto snap-center bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-200 group flex flex-col"
                            >
                                {/* Image Header */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        loading="lazy"
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

                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 gap-4">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{course.price}</span>
                                        <Button variant="primary" className="rounded-full px-6 w-full md:w-auto text-center justify-center">
                                            Enroll Now
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )
                }

            </main >
        </div >
    );
};

export default CoursesPage;
