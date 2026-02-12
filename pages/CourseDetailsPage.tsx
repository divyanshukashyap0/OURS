import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseData, getCourses } from '../lib/courses';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import LogoLoader from '../components/ui/LogoLoader';
import Button from '../components/ui/Button';
import { Clock, Users, Star, BookOpen, CheckCircle, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCourse = async () => {
            if (!id) return;
            try {
                // First try to fetch specific doc
                const docRef = doc(db, 'courses', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCourse({ id: docSnap.id, ...docSnap.data() } as CourseData);
                } else {
                    // Fallback or 404
                    console.error("Course not found");
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><LogoLoader /></div>;

    if (!course) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Course not found</h2>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            {/* Navbar is transparent usually, but we might want a background here if needed, or rely on global layout if this is nested */}
            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/courses')}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
                >
                    <ChevronLeft size={20} /> Back to Courses
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                    ${course.level === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {course.level}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                    <span>{course.rating}</span>
                                    <Star size={14} fill="currentColor" />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300">
                                        {course.instructor.charAt(0)}
                                    </div>
                                    <span>Created by <strong className="text-gray-900 dark:text-white">{course.instructor}</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>{course.students} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen size={16} />
                                    {/* Assuming tags count as 'lessons' or just a metric */}
                                    <span>{course.tags.length} Modules</span>
                                </div>
                            </div>
                        </div>

                        {/* What you'll learn */}
                        {course.whatYouLearn && course.whatYouLearn.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What you'll learn</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.whatYouLearn.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Videos */}
                        {course.videos && course.videos.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Videos</h2>
                                <div className="space-y-4">
                                    {course.videos.map((video, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{video.title}</h3>
                                                <Button size="sm" variant="outline" onClick={() => window.open(video.url, '_blank')}>
                                                    Watch Video
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Audio Files */}
                        {course.audioFiles && course.audioFiles.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Audio Resources</h2>
                                <div className="space-y-4">
                                    {course.audioFiles.map((audio, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                                    <Users size={20} /> {/* Reusing icon for now, ideally Music/Mic */}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{audio.title}</span>
                                            </div>
                                            <audio controls src={audio.url} className="h-8" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Study Materials */}
                        {course.studyMaterials && course.studyMaterials.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Study Materials</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {course.studyMaterials.map((file, idx) => (
                                        <a
                                            key={idx}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-500 transition-colors"
                                        >
                                            <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg">
                                                <BookOpen size={20} />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white flex-1 truncate">{file.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        {course.gallery && course.gallery.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {course.gallery.map((imgUrl, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                                            <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* What you get */}
                        {course.whatYouGet && course.whatYouGet.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">This course includes:</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {course.whatYouGet.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <BookOpen size={20} />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Sticky Card */}
                    <div className="relative">
                        <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{course.price}</span>
                                    {/* <span className="text-gray-400 line-through">$99.99</span> */}
                                </div>

                                <Button size="lg" className="w-full justify-center text-lg py-4">
                                    Enroll Now
                                </Button>

                                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    30-Day Money-Back Guarantee
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Instructor</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{course.instructor}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Duration</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{course.duration}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Level</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{course.level}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
