import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseData, getCourses } from '../lib/courses';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import LogoLoader from '../components/ui/LogoLoader';
import Button from '../components/ui/Button';
import { Clock, Users, Star, BookOpen, CheckCircle, ChevronLeft, Lock, PlayCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchCourseAndAccess = async () => {
            if (!id) return;
            try {
                // 1. Fetch Course
                const docRef = doc(db, 'courses', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setCourse({ id: docSnap.id, ...docSnap.data() } as CourseData);
                } else {
                    console.error("Course not found");
                    setLoading(false);
                    return;
                }

                // 2. Check Access
                if (user) {
                    const q = query(
                        collection(db, 'orders'),
                        where('userId', '==', user.uid),
                        where('courseId', '==', id),
                        where('status', '==', 'paid')
                    );
                    const snapshot = await getDocs(q);

                    // Also check for 'success' status
                    const q2 = query(
                        collection(db, 'orders'),
                        where('userId', '==', user.uid),
                        where('courseId', '==', id),
                        where('status', '==', 'success')
                    );
                    const snapshot2 = await getDocs(q2);

                    if (!snapshot.empty || !snapshot2.empty) {
                        setHasAccess(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndAccess();
    }, [id, user]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><LogoLoader /></div>;

    if (!course) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-4">Course not found</h2>
            <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
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
                                    <span>{course.chapters?.length || 0} Chapters</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Content / Chapters */}
                        {(course.chapters && course.chapters.length > 0) ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Content</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.chapters.length} chapters • Self-paced</p>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {course.chapters.map((chapter, idx) => {
                                        const isUnlocked = hasAccess || chapter.isFreePreview;
                                        return (
                                            <div
                                                key={chapter.id}
                                                className={`p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isUnlocked ? 'cursor-pointer' : 'opacity-70'}`}
                                                onClick={() => {
                                                    if (isUnlocked) {
                                                        navigate(`/courses/${id}/learn`);
                                                    }
                                                }}
                                            >
                                                <div className={`p-2 rounded-full flex-shrink-0 ${isUnlocked ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'}`}>
                                                    {isUnlocked ? <PlayCircle size={20} /> : <Lock size={20} />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {idx + 1}. {chapter.title}
                                                        </span>
                                                        {chapter.isFreePreview && !hasAccess && (
                                                            <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
                                                                Free Preview
                                                            </span>
                                                        )}
                                                    </div>
                                                    {chapter.duration && (
                                                        <p className="text-xs text-gray-500">{chapter.duration}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : hasAccess ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Completed!</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">This course has no chapters to read. You can claim your certificate immediately.</p>
                                <Button onClick={() => navigate(`/courses/${id}/certificate`)}>
                                    View Certificate
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 text-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Content</h2>
                                <p className="text-gray-500 dark:text-gray-400">Content is being uploaded. Check back soon!</p>
                            </div>
                        )}


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

                        {/* Public Assets (Videos/Files that are strictly public/promotional) 
                            Assuming mapped assets are part of the 'preview' or public assets. 
                            If these are paid content, we should hide them or gate them too. 
                            The requirement didn't specify gating these, but typically 'Study Materials' are paid.
                            For now, I'll leave them as is, or maybe wrap in check. 
                            Actually, let's gate them if they are considered premium assets. 
                            But usually 'Course Videos' on the landing page are previews. 
                            If they are full course videos, they should be in 'Chapters'. 
                            Let's assume these lists are additional resources. 
                            I'll leave them visible for now as the schema had them before chapters.
                        */}
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
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {hasAccess ? "Enrolled" : course.price}
                                    </span>
                                </div>

                                {hasAccess ? (
                                    <Button size="lg" className="w-full justify-center text-lg py-4" onClick={() => navigate(course.chapters && course.chapters.length > 0 ? `/courses/${id}/learn` : `/courses/${id}/certificate`)}>
                                        {course.chapters && course.chapters.length > 0 ? "Continue Learning" : "View Certificate"}
                                    </Button>
                                ) : (
                                    <Button size="lg" className="w-full justify-center text-lg py-4" onClick={() => navigate(`/checkout/${id}?type=course`)}>
                                        {(course.price === '0' || course.price?.toLowerCase() === 'free' || course.price?.includes('$0')) ? 'Enroll for Free' : 'Enroll Now'}
                                    </Button>
                                )}

                                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                                    {hasAccess ? "Welcome back!" : "30-Day Money-Back Guarantee"}
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
