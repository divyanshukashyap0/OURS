import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CourseData, getCourseById } from '../lib/courses';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Lock, Menu, ChevronLeft, ChevronRight, PlayCircle, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import LogoLoader from '../components/ui/LogoLoader';
import ReactMarkdown from 'react-markdown';

const CourseReaderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Progress State
    const [completedChapterIds, setCompletedChapterIds] = useState<string[]>([]);
    const [isCourseCompleted, setIsCourseCompleted] = useState(false);

    useEffect(() => {
        const fetchCourseAndAccess = async () => {
            if (!id) return;
            try {
                // 1. Fetch Course
                const courseData = await getCourseById(id);
                if (courseData) {
                    setCourse(courseData);
                } else {
                    setLoading(false);
                    navigate('/courses'); // Redirect if course not found
                    return;
                }

                if (user) {
                    // 2. Check Access
                    const q = query(collection(db, 'orders'), where('userId', '==', user.uid), where('courseId', '==', id), where('status', 'in', ['paid', 'success']));
                    const snapshot = await getDocs(q);

                    if (!snapshot.empty) {
                        setHasAccess(true);

                        // 3. Fetch Progress
                        const progressRef = doc(db, 'course_progress', `${user.uid}_${id}`);
                        const progressSnap = await getDoc(progressRef);
                        let isCompleted = false;
                        let completedChapterIds: string[] = [];

                        if (progressSnap.exists()) {
                            const data = progressSnap.data();
                            completedChapterIds = data.completedChapterIds || [];
                            isCompleted = data.isCompleted || false;

                            // Optional: Restore last read chapter
                            if (data.lastReadChapterId && courseData.chapters) {
                                const lastReadIndex = courseData.chapters.findIndex(c => c.id === data.lastReadChapterId);
                                if (lastReadIndex !== -1) setActiveChapterIndex(lastReadIndex);
                            }
                        }

                        // Special Case: 0 Chapters = Auto Complete
                        if (!isCompleted && (!courseData.chapters || courseData.chapters.length === 0)) {
                            await setDoc(progressRef, {
                                userId: user.uid,
                                courseId: id,
                                completedChapterIds: [],
                                isCompleted: true,
                                completedAt: serverTimestamp(),
                                updatedAt: serverTimestamp()
                            }, { merge: true });
                            isCompleted = true;
                        }

                        setCompletedChapterIds(completedChapterIds);
                        setIsCourseCompleted(isCompleted);
                    }
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndAccess();
    }, [id, user, navigate]);

    const markChapterComplete = async (chapterId: string) => {
        if (!user || !course || !id) return;

        let newCompletedIds = completedChapterIds;
        if (!completedChapterIds.includes(chapterId)) {
            newCompletedIds = [...completedChapterIds, chapterId];
            setCompletedChapterIds(newCompletedIds);
        }

        const allChapters = course.chapters || [];
        const allChaptersCompleted = allChapters.length > 0 && allChapters.every(c => newCompletedIds.includes(c.id));

        if (allChaptersCompleted) {
            setIsCourseCompleted(true);
        }

        // Save to Firestore
        const progressRef = doc(db, 'course_progress', `${user.uid}_${id}`);
        await setDoc(progressRef, {
            userId: user.uid,
            courseId: id,
            completedChapterIds: newCompletedIds,
            isCompleted: allChaptersCompleted || false,
            completedAt: allChaptersCompleted ? serverTimestamp() : null,
            lastReadChapterId: chapterId,
            updatedAt: serverTimestamp()
        }, { merge: true });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><LogoLoader /></div>;

    if (!course) return <div className="p-8 text-center">Course not found</div>;

    if (!hasAccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 text-center">
                <Lock size={48} className="text-gray-400 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You need to purchase this course to access the content.</p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate('/courses')}>Back to Courses</Button>
                    <Button onClick={() => navigate(`/checkout/${course.id}?type=course`)}>Buy Now for {course.price}</Button>
                </div>
            </div>
        );
    }

    const currentChapter = course.chapters?.[activeChapterIndex];
    const chapters = course.chapters || [];

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">

            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col flex-shrink-0 h-screen overflow-hidden`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="font-bold truncate" title={course.title}>{course.title}</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/courses/${id}`)} title="Back to Details">
                        <ArrowLeft size={16} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {chapters.map((chapter, index) => {
                        const isCompleted = completedChapterIds.includes(chapter.id);
                        const isActive = index === activeChapterIndex;
                        return (
                            <div
                                key={chapter.id}
                                onClick={() => setActiveChapterIndex(index)}
                                className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 text-sm transition-colors ${isActive ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                            >
                                <div className={`flex-shrink-0 ${isCompleted ? 'text-green-500' : isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {isCompleted ? <CheckCircle size={16} /> : <PlayCircle size={16} />}
                                </div>
                                <span className={`flex-1 ${isActive ? 'font-medium' : ''}`}>{chapter.title}</span>
                                <span className="text-xs text-gray-400">{chapter.duration}</span>
                            </div>
                        );
                    })}
                    {chapters.length === 0 && (
                        <div className="text-sm text-gray-500 text-center py-8">No chapters available yet.</div>
                    )}
                </div>

                {isCourseCompleted && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-green-50 dark:bg-green-900/10">
                        <div className="text-center mb-3">
                            <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-2">
                                <Award size={24} />
                            </div>
                            <h3 className="font-bold text-green-800 dark:text-green-300 text-sm">Course Completed!</h3>
                        </div>
                        <Button
                            className="w-full justify-center bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => navigate(`/courses/${id}/certificate`)}
                        >
                            View Certificate
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 justify-between bg-white dark:bg-gray-950 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <Menu size={20} />
                        </button>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                            Chapter {activeChapterIndex + 1} of {chapters.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            disabled={activeChapterIndex === 0}
                            onClick={() => setActiveChapterIndex(prev => prev - 1)}
                        >
                            <ChevronLeft size={16} /> Previous
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                if (currentChapter) {
                                    markChapterComplete(currentChapter.id);
                                }
                                if (activeChapterIndex < chapters.length - 1) {
                                    setActiveChapterIndex(prev => prev + 1);
                                }
                            }}
                        >
                            {activeChapterIndex === chapters.length - 1 ? 'Finish Course' : 'Next Chapter'} <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        {currentChapter ? (
                            <div className="prose dark:prose-invert max-w-none">
                                <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">{currentChapter.title}</h1>

                                <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                    {currentChapter.content ? (
                                        <ReactMarkdown>{currentChapter.content}</ReactMarkdown>
                                    ) : (
                                        <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center text-gray-400">
                                            Content placeholder. This chapter has no content yet.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-12 flex justify-center py-8 border-t border-gray-100 dark:border-gray-800">
                                    {!completedChapterIds.includes(currentChapter.id) ? (
                                        <Button size="lg" onClick={() => markChapterComplete(currentChapter.id)}>
                                            <CheckCircle size={20} className="mr-2" /> Mark as Complete
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col items-center text-green-500 gap-2">
                                            <CheckCircle size={32} />
                                            <span className="font-medium">Chapter Completed</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                {isCourseCompleted && chapters.length === 0 ? (
                                    <div className="max-w-md p-8 bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl">
                                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Award size={40} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Completed!</h2>
                                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                                            Congratulations! You have completed this course (or it has no required chapters). You can now view and download your certificate.
                                        </p>
                                        <Button
                                            size="lg"
                                            className="w-full justify-center"
                                            onClick={() => navigate(`/courses/${id}/certificate`)}
                                        >
                                            View Certificate
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Select a chapter to start reading.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseReaderPage;
