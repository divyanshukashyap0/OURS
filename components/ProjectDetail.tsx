import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, ProjectData } from '../lib/projects';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';
import Button from './ui/Button';
import { ArrowLeft, ExternalLink, Github, Tag, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../lib/config';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [studentStatus, setStudentStatus] = useState<string | null>(null);

    // Fetch User's Student Status
    useEffect(() => {
        const fetchStudentStatus = async () => {
            console.log("AuthContext User:", user); // DEBUG
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        const status = data.studentStatus;
                        console.log("Firestore User Data:", data); // DEBUG
                        console.log("Fetched User Student Status:", status); // DEBUG
                        setStudentStatus(status);
                    } else {
                        console.log("User doc not found in Firestore for UID:", user.uid);
                    }
                } catch (error) {
                    console.error("Error fetching student status:", error);
                }
            } else {
                console.log("No user logged in (AuthContext user is null)");
            }
        };
        fetchStudentStatus();
    }, [user]);

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                try {
                    console.log("Fetching project with ID:", id); // DEBUG
                    const data = await getProjectById(id);
                    console.log("Fetched Project Data Full Object:", data); // DEBUG
                    console.log("Is Student Free Value:", data?.isStudentFree); // DEBUG
                    setProject(data);
                } catch (error) {
                    console.error("Error fetching project:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProject();
    }, [id]);

    const [hasPurchased, setHasPurchased] = React.useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const checkPurchaseStatus = async () => {
            if (!user || !project) return;
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    where('projectId', '==', String(project.id)), // Ensure ID format matches
                    where('status', '==', 'paid')
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setHasPurchased(true);
                }
            } catch (err) {
                console.error("Error checking purchase status:", err);
            }
        };

        checkPurchaseStatus();
    }, [user, project]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = () => {
        navigate(`/checkout/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
                <h2 className="text-2xl font-bold mb-4">Project not found</h2>
                <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">


            <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mb-8 pl-0 hover:bg-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 gap-2"
                    >
                        <ArrowLeft size={20} /> Back to Projects
                    </Button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 relative group">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                    {project.description}
                                </p>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                                <div className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 whitespace-pre-wrap">
                                    {project.longDescription || project.description}
                                </div>

                                {project.demoVideoUrl && (
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Video Preview</h3>
                                        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 aspect-video">
                                            <iframe
                                                src={project.demoVideoUrl.replace('watch?v=', 'embed/')}
                                                title="Project Demo"
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                {project.features && project.features.length > 0 && (
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {project.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                                                    <div className="mt-1 p-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                                        <CheckCircle size={16} />
                                                    </div>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tech Stack</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {project.technologies.map((tech, idx) => (
                                                <div key={idx} className="px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-100 dark:border-indigo-800 shadow-sm flex items-center gap-2">
                                                    <Tag size={16} />
                                                    {tech}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.gallery && project.gallery.length > 0 && (
                                    <div className="mt-12">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {project.gallery.map((image, index) => (
                                                <div key={index} className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-[1.02] transition-transform duration-300">
                                                    <img
                                                        src={image}
                                                        alt={`${project.title} screenshot ${index + 1}`}
                                                        className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-gray-500 dark:text-gray-400 font-medium">License</span>
                                    <span className="text-gray-900 dark:text-white font-bold">Standard</span>
                                </div>
                                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">{project.price}</div>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">One-time payment. Lifetime access.</p>

                                <div className="space-y-4">
                                    {hasPurchased || (user && studentStatus === 'verified' && project.isStudentFree) ? (
                                        <>
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-300 mb-2">
                                                <CheckCircle size={24} />
                                                <div className="font-medium">
                                                    {hasPurchased ? "You own this project!" : "Free Student Access Unlocked!"}
                                                </div>
                                            </div>
                                            {project.githubLink ? (
                                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                                                    <Button size="lg" className="w-full text-lg py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-xl gap-2">
                                                        <Github size={20} /> View Source Code
                                                    </Button>
                                                </a>
                                            ) : (
                                                <Button size="lg" disabled className="w-full text-lg py-6 bg-gray-400 cursor-not-allowed">
                                                    Source Code Not Available
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <Button size="lg" className="w-full text-lg py-6 shadow-blue-500/20 shadow-xl" onClick={handlePayment}>
                                            Purchase Now
                                        </Button>
                                    )}

                                    {project.previewUrl ? (
                                        <a href={project.previewUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                                            <Button variant="outline" size="lg" className="w-full gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700">
                                                <ExternalLink size={20} /> Live Preview
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button variant="outline" size="lg" disabled className="w-full gap-2 text-gray-400 border-gray-200 cursor-not-allowed">
                                            <ExternalLink size={20} /> Live Preview
                                        </Button>
                                    )}
                                </div>

                                <hr className="my-8 border-gray-100 dark:border-gray-800" />

                                <div className="space-y-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Technologies</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ProjectDetail;
