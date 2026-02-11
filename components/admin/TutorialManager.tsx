import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Tutorial } from '../../types';
import { TUTORIALS } from '../../lib/videoData'; // Import for seeding
import { Plus, Edit2, Trash2, Search, X, Save, Video, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const TutorialManager: React.FC = () => {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Tutorial>>({
        title: '',
        description: '',
        thumbnail: '',
        videoUrl: '',
        duration: '',
        difficulty: 'Beginner',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        fetchTutorials();
    }, []);

    const fetchTutorials = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'tutorials'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tutorial[];
            setTutorials(fetchedData);
        } catch (error) {
            console.error("Error fetching tutorials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeedData = async () => {
        if (!confirm("This will add default tutorials to Firestore. Continue?")) return;
        setLoading(true);
        try {
            for (const t of TUTORIALS) {
                // Check if already exists (simple check by title for this demo)
                // In production, simpler to just add
                await addDoc(collection(db, 'tutorials'), {
                    ...t,
                    createdAt: serverTimestamp()
                });
            }
            alert("Seeding complete!");
            fetchTutorials();
        } catch (error) {
            console.error("Error seeding:", error);
            alert("Failed to seed data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tutorial?")) return;
        try {
            await deleteDoc(doc(db, 'tutorials', id));
            setTutorials(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
        }
    };

    const openModal = (tutorial?: Tutorial) => {
        if (tutorial) {
            setEditingTutorial(tutorial);
            setFormData(tutorial);
        } else {
            setEditingTutorial(null);
            setFormData({
                title: '',
                description: '',
                thumbnail: '',
                videoUrl: '',
                duration: '',
                difficulty: 'Beginner',
                tags: []
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingTutorial) {
                // Update
                const docRef = doc(db, 'tutorials', editingTutorial.id);
                await updateDoc(docRef, { ...formData });
            } else {
                // Create
                await addDoc(collection(db, 'tutorials'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
            fetchTutorials();
        } catch (error) {
            console.error("Error saving:", error);
            alert("Failed to save tutorial.");
        } finally {
            setSaving(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tagToRemove) });
    };

    const filteredTutorials = tutorials.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tutorials</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage video learning content.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSeedData} className="border-gray-300 dark:border-gray-600">
                        Seed Default Data
                    </Button>
                    <Button onClick={() => openModal()} className="flex items-center gap-2">
                        <Plus size={18} /> Add Tutorial
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search tutorials..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading tutorials...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTutorials.map((tutorial) => (
                        <motion.div
                            key={tutorial.id}
                            layout
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm group"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => openModal(tutorial)}
                                        className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40 transition-colors"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tutorial.id)}
                                        className="p-2 bg-red-500/80 backdrop-blur rounded-full text-white hover:bg-red-600/90 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                                    {tutorial.duration}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{tutorial.title}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${tutorial.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            tutorial.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                        }`}>
                                        {tutorial.difficulty}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl relative z-10 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold dark:text-white">
                                    {editingTutorial ? 'Edit Tutorial' : 'New Tutorial'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Video URL (Embed/Direct)</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            value={formData.videoUrl}
                                            onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail URL</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            value={formData.thumbnail}
                                            onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 5h 30m"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                                        <select
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add a tag..."
                                            value={tagInput}
                                            onChange={e => setTagInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                        />
                                        <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags?.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-sm flex items-center gap-1">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900 dark:hover:text-blue-200"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" disabled={saving}>
                                        {saving ? <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</> : 'Save Tutorial'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TutorialManager;
