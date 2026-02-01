import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';
import Footer from './Footer';
import Button from './ui/Button';
import { ArrowLeft, ExternalLink, Github, Tag, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../lib/config';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    // Initialize with static data logic, but allow state update
    const [project, setProject] = React.useState<Project | undefined>(
        PROJECTS.find((p) => p.id === Number(id))
    );

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                try {
                    const docRef = doc(db, 'projects', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const dbData = docSnap.data();
                        setProject(prev => ({
                            ...prev,
                            ...dbData,
                            id: docSnap.id,
                            // Ensure tags are arrays
                            tags: Array.isArray(dbData.tags) ? dbData.tags : (prev?.tags || [])
                        } as Project));
                    }
                } catch (error) {
                    console.error("Error fetching project:", error);
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
                <div className="max-w-6xl mx-auto">
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
                            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            <div className="prose dark:prose-invert max-w-none">
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{project.title}</h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                    {project.description}
                                </p>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Description</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> High performance and optimized for speed.</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Responsive design looking great on all devices.</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Built with modern technologies and best practices.</li>
                                    <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Easy to customize and extend.</li>
                                </ul>
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
                                    {hasPurchased ? (
                                        <>
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-300 mb-2">
                                                <CheckCircle size={24} />
                                                <div className="font-medium">You own this project!</div>
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
                </div>
            </main>
        </div>
    );
};

export default ProjectDetail;
