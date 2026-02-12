import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Tag } from 'lucide-react';
import Button from '../ui/Button';

import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface Project {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    tags: string[];
    githubLink?: string;
    previewUrl?: string;
    gallery?: string[];
    isStudentFree?: boolean;
    isTrending?: boolean;
}

const ProductManager: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        description: '',
        price: '',
        image: '',
        tags: [],
        githubLink: '',
        previewUrl: '',
        gallery: [],
        isStudentFree: false,
        isTrending: false,
        features: [],
        technologies: [],
        demoVideoUrl: '',
        longDescription: ''
    });
    const [tagInput, setTagInput] = useState('');
    const [galleryInput, setGalleryInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [techInput, setTechInput] = useState('');

    // Real-time Data Subscription
    React.useEffect(() => {
        const q = query(collection(db, 'projects')); // Use appropriate ordering if needed
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedProjects = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as Project[];
            setProjects(fetchedProjects);
        }, (error) => {
            console.error("Error fetching projects:", error);
        });

        return () => unsubscribe();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteDoc(doc(db, 'projects', id));
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Failed to delete.");
            }
        }
    };

    const handleOpenModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData(project);
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                image: '',
                tags: [],
                githubLink: '',
                previewUrl: '',
                gallery: [],
                isStudentFree: false,
                isTrending: false,
                features: [],
                technologies: [],
                demoVideoUrl: '',
                longDescription: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSave = {
                title: formData.title || '',
                description: formData.description || '',
                price: formData.price || '',
                image: formData.image || '',
                tags: Array.isArray(formData.tags) ? formData.tags : [],
                githubLink: formData.githubLink || '',
                previewUrl: formData.previewUrl || '',
                gallery: Array.isArray(formData.gallery) ? formData.gallery : [],
                isStudentFree: formData.isStudentFree || false,
                isTrending: formData.isTrending || false,
                features: Array.isArray(formData.features) ? formData.features : [],
                technologies: Array.isArray(formData.technologies) ? formData.technologies : [],
                demoVideoUrl: formData.demoVideoUrl || '',
                longDescription: formData.longDescription || ''
            };

            console.log("SANITIZED PAYLOAD:", dataToSave);

            if (editingProject) {
                const projectRef = doc(db, 'projects', editingProject.id);
                await updateDoc(projectRef, dataToSave);
            } else {
                await addDoc(collection(db, 'projects'), {
                    ...dataToSave,
                    createdAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("FULL ERROR OBJECT:", error);
            console.error("PAYLOAD:", formData);
            if (editingProject) console.error("EDIT ID:", editingProject.id);
            alert(`Failed to save project: ${error.message}`);
        }
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({ ...prev, tags: prev.tags?.filter((_, i) => i !== index) }));
    };

    const addGalleryImage = () => {
        if (galleryInput.trim()) {
            setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), galleryInput.trim()] }));
            setGalleryInput('');
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({ ...prev, gallery: prev.gallery?.filter((_, i) => i !== index) }));
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({ ...prev, features: [...(prev.features || []), featureInput.trim()] }));
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({ ...prev, features: prev.features?.filter((_, i) => i !== index) }));
    };

    const addTech = () => {
        if (techInput.trim()) {
            setFormData(prev => ({ ...prev, technologies: [...(prev.technologies || []), techInput.trim()] }));
            setTechInput('');
        }
    };

    const removeTech = (index: number) => {
        setFormData(prev => ({ ...prev, technologies: prev.technologies?.filter((_, i) => i !== index) }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Manager</h1>
                <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={18} />}>
                    Add Project
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Tags</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {filteredProjects.map((project) => (
                                    <motion.tr
                                        layout
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => handleOpenModal(project)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {project.image && (
                                                    <img src={project.image} alt={project.title} className="w-10 h-10 rounded-lg object-cover" />
                                                )}
                                                <div className="font-medium text-gray-900 dark:text-white max-w-xs truncate">
                                                    {project.title}
                                                    {project.isStudentFree && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                            Student Free
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{project.price}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {project.tags?.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(project.tags?.length || 0) > 3 && (
                                                    <span className="text-xs text-gray-500">+{project.tags!.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredProjects.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No projects found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                                        <input
                                            required
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                        <input
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Repository Link (Secret)</label>
                                    <input
                                        value={formData.githubLink || ''}
                                        onChange={e => setFormData({ ...formData, githubLink: e.target.value })}
                                        placeholder="https://github.com/username/repo"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-blue-600"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Visible only to users who have purchased this project.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview Website URL</label>
                                    <input
                                        value={formData.previewUrl || ''}
                                        onChange={e => setFormData({ ...formData, previewUrl: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Long Description (Markdown / Detailed)</label>
                                    <textarea
                                        rows={6}
                                        value={formData.longDescription || ''}
                                        onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
                                        placeholder="# Key Details..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Demo Video URL</label>
                                    <input
                                        value={formData.demoVideoUrl || ''}
                                        onChange={e => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* Features Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features (Key Selling Points)</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={featureInput}
                                            onChange={e => setFeatureInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Add feature..."
                                        />
                                        <Button type="button" onClick={addFeature} variant="secondary"><Plus size={18} /></Button>
                                    </div>
                                    <ul className="space-y-1">
                                        {formData.features?.map((feature, index) => (
                                            <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-sm">
                                                <span>{feature}</span>
                                                <button type="button" onClick={() => removeFeature(index)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Technologies Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technologies (Tech Stack)</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={techInput}
                                            onChange={e => setTechInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Add technology..."
                                        />
                                        <Button type="button" onClick={addTech} variant="secondary"><Plus size={18} /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.technologies?.map((tech, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-sm text-indigo-700 dark:text-indigo-300">
                                                {tech}
                                                <button type="button" onClick={() => removeTech(index)} className="hover:text-red-500"><X size={14} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Gallery Images */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gallery Images</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={galleryInput}
                                            onChange={e => setGalleryInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Add image URL..."
                                        />
                                        <Button type="button" onClick={addGalleryImage} variant="secondary"><Plus size={18} /></Button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {formData.gallery?.map((url, index) => (
                                            <div key={index} className="relative group aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                                                <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(index)}
                                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={e => setTagInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Add tag..."
                                        />
                                        <Button type="button" onClick={addTag} variant="secondary"><Plus size={18} /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags?.map((tag, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(index)} className="hover:text-red-500"><X size={14} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isStudentFree"
                                        checked={formData.isStudentFree || false}
                                        onChange={e => setFormData({ ...formData, isStudentFree: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="isStudentFree" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Free for Students
                                    </label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isTrending"
                                        checked={formData.isTrending || false}
                                        onChange={e => setFormData({ ...formData, isTrending: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="isTrending" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Set as Trending Project
                                    </label>
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-8">
                                    <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">{editingProject ? 'Save Changes' : 'Create Project'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManager;
