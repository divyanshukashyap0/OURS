import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import Button from '../ui/Button';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { BlogPost } from '../../types';

const BlogManager: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const q = query(collection(db, 'blogs'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[]; // Type casting for flexibility
            setPosts(fetchedPosts);
        }, (error) => {
            console.error("Error fetching blogs:", error);
        });

        return () => unsubscribe();
    }, []);

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: number | string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await deleteDoc(doc(db, 'blogs', String(id)));
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Failed to delete.");
            }
        }
    };

    const handleOpenModal = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData(post);
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                image: '',
                category: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSave = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (editingPost) {
                const docRef = doc(db, 'blogs', String(editingPost.id));
                await updateDoc(docRef, dataToSave);
            } else {
                await addDoc(collection(db, 'blogs'), {
                    ...dataToSave,
                    createdAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
        } catch (error: any) {
            alert(`Failed to save post: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Manager</h1>
                <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={18} />}>
                    Add Post
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Post</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {filteredPosts.map((post) => (
                                    <motion.tr
                                        key={post.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => handleOpenModal(post)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {post.image && (
                                                    <img src={post.image} alt={post.title} className="w-10 h-10 rounded-lg object-cover" />
                                                )}
                                                <div className="font-medium text-gray-900 dark:text-white max-w-xs truncate">{post.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{post.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                        <input
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                    <input
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                                    <textarea
                                        rows={2}
                                        value={formData.excerpt}
                                        onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown supported)</label>
                                    <textarea
                                        rows={8}
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-8">
                                    <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">{editingPost ? 'Save Changes' : 'Create Post'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlogManager;
