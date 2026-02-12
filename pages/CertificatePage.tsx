import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Button from '../components/ui/Button';
import LogoLoader from '../components/ui/LogoLoader';
import { Download, ChevronLeft, Award, QrCode } from 'lucide-react';
import { CourseData } from '../lib/courses';
import { getOrCreateCertificate, CertificateData } from '../lib/certificates';

// Separated Certificate Component for reusability (Screen vs Print)
const CertificateTemplate: React.FC<{
    course: CourseData;
    certificate: CertificateData;
    isPrint?: boolean;
}> = ({ course, certificate, isPrint }) => {
    return (
        <div
            id="certificate-container"
            className={`
                bg-white text-gray-900 relative shadow-2xl overflow-hidden
                ${isPrint ? 'w-full h-full shadow-none' : 'w-[1123px] h-[794px]'}
            `}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

            {/* Background Pattern/Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className="w-[600px] h-[600px] opacity-[0.35] rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
                    <img
                        src="/maskable-icon-512x512.png"
                        alt="Background Logo"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="h-full flex flex-col p-16 relative z-10">

                {/* Header: Logo & Title */}
                <div className="flex justify-between items-start mb-16">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-gray-900">OURS</h2>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Excellence in Technology</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Certificate of Completion</h3>
                        <p className="font-mono text-xs text-gray-500">{certificate.id}</p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 flex flex-col justify-center items-start max-w-3xl">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-green-100">
                            Verified Credential
                        </span>
                        <p className="text-gray-500 text-lg mb-2">This is to certify that</p>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
                            {certificate.userName}
                        </h1>
                        <p className="text-gray-500 text-lg mb-2">has successfully completed the course requirements for</p>
                        <h2 className="text-3xl font-bold text-blue-700 mb-8 border-l-4 border-blue-600 pl-6 py-2">
                            {certificate.courseTitle}
                        </h2>
                        <p className="text-gray-600 max-w-2xl leading-relaxed">
                            This certificate acknowledges the mastery of the curriculum, including {course.chapters?.length || 'all'} modules covering
                            key concepts, practical implementations, and final assessments set forth by OURS.
                        </p>
                    </div>
                </div>

                {/* Footer: Signatures & Verification */}
                <div className="mt-auto pt-8 border-t border-gray-100 flex items-end justify-between">

                    {/* Signatures */}
                    <div className="flex gap-16">
                        <div>
                            <div className="h-16 flex items-end mb-2">
                                <div className="font-cursive text-2xl text-gray-800 italic" style={{ fontFamily: 'cursive' }}>Divyanshu Kashyap</div>
                            </div>
                            <p className="font-bold text-gray-900 text-sm">Divyanshu Kashyap</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Lead Instructor</p>
                        </div>
                        <div>
                            <div className="h-16 flex items-end mb-2">
                                <div className="font-cursive text-2xl text-gray-800 italic" style={{ fontFamily: 'cursive' }}>OURS Team</div>
                            </div>
                            <p className="font-bold text-gray-900 text-sm">Academic Director</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">OURS</p>
                        </div>
                    </div>

                    {/* Date & Seal */}
                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date of Issue</p>
                            <p className="font-bold text-gray-900">
                                {certificate.issuedAt.toDate().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        {/* Gold Seal Effect */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
                            <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 p-1 rounded-full shadow-lg flex items-center justify-center text-white"
                                style={{ boxShadow: '0 4px 10px rgba(234, 179, 8, 0.4)' }}>
                                <div className="w-[90%] h-[90%] border border-yellow-100/50 rounded-full flex flex-col items-center justify-center text-center p-1">
                                    <Award size={24} className="mb-0.5 drop-shadow-md" />
                                    <span className="text-[0.5rem] font-bold uppercase tracking-widest drop-shadow-md leading-tight">Official<br />Certified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="absolute bottom-0 w-full h-12 bg-gray-50 border-t border-gray-100 flex items-center justify-between px-16 text-[10px] text-gray-400">
                <div className="flex items-center gap-2">
                    <QrCode size={14} />
                    <span>ID: {certificate.id}</span>
                </div>
                <div>
                    Verify at: <span className="font-mono text-gray-500">https://ours2026.in/verify/{certificate.id}</span>
                </div>
            </div>
        </div>
    );
};

const CertificatePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<CourseData | null>(null);
    const [certificate, setCertificate] = useState<CertificateData | null>(null);

    useEffect(() => {
        const fetchCertificateData = async () => {
            if (!user || !id) {
                setLoading(false);
                return;
            }

            try {
                // 1. Fetch Course Details
                const courseRef = doc(db, 'courses', id);
                const courseSnap = await getDoc(courseRef);

                if (!courseSnap.exists()) {
                    setLoading(false);
                    return;
                }

                const courseData = { id: courseSnap.id, ...courseSnap.data() } as CourseData;
                setCourse(courseData);

                // 2. Check Completion & Get/Create Certificate
                const progressRef = doc(db, 'course_progress', `${user.uid}_${id}`);
                const progressSnap = await getDoc(progressRef);
                const isCompleted = (progressSnap.exists() && progressSnap.data().isCompleted) ||
                    (!courseData.chapters || courseData.chapters.length === 0);

                if (isCompleted) {
                    const cert = await getOrCreateCertificate(
                        user.uid,
                        user.displayName || user.email || 'Student',
                        id,
                        courseData.title,
                        courseData.instructor,
                        courseData.image
                    );
                    setCertificate(cert);
                }
            } catch (error) {
                console.error("Error fetching certificate data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificateData();
    }, [user, id]);

    const handleDownload = () => {
        window.print();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LogoLoader /></div>;

    if (!user || !course || !certificate) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center text-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Certificate Not Found</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">You must complete the course to view the certificate.</p>
                <Button onClick={() => navigate(`/courses/${id || ''}`)}>Back to Course</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center print:hidden">
            {/* Controls - Hidden on print */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8">
                <Button variant="ghost" onClick={() => navigate(`/courses/${id}/learn`)}>
                    <ChevronLeft size={20} className="mr-2" /> Back to Course
                </Button>
                <div className="flex gap-4">
                    <Button onClick={handleDownload}>
                        <Download size={20} className="mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Screen View of the Certificate */}
            <CertificateTemplate course={course} certificate={certificate} isPrint={false} />

            {/* Print Portal: Only visible during printing */}
            {createPortal(
                <div className="hidden print:block fixed inset-0 z-[9999] bg-white w-screen h-screen">
                    <CertificateTemplate course={course} certificate={certificate} isPrint={true} />
                </div>,
                document.body
            )}

            {/* Global Print Styles to hide the root app */}
            <style>
                {`
                    @media print {
                        /* Hide the main app root */
                        #root {
                            display: none !important;
                        }
                        /* Ensure body has no margins */
                        @page { size: landscape; margin: 0; }
                        body, html {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default CertificatePage;
