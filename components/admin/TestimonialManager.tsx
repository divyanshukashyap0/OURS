import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, MessageSquare, Star, X } from 'lucide-react';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, Testimonial } from '../../lib/testimonials';

const TestimonialManager: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({ rating: 5 });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        setLoading(true);
        const data = await getTestimonials();
        setTestimonials(data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!currentTestimonial.name || !currentTestimonial.text) return;

        try {
            if (isEditing && currentTestimonial.id) {
                await updateTestimonial(currentTestimonial.id, currentTestimonial);
            } else {
                await addTestimonial(currentTestimonial as any);
            }
            setIsModalOpen(false);
            setCurrentTestimonial({ rating: 5 });
            setIsEditing(false);
            loadTestimonials();
        } catch (error) {
            console.error("Error saving testimonial:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this testimonial?")) {
            try {
                await deleteTestimonial(id);
                loadTestimonials();
            } catch (error) {
                console.error("Error deleting testimonial:", error);
            }
        }
    };

    const openEditModal = (testimonial: Testimonial) => {
        setCurrentTestimonial(testimonial);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentTestimonial({ rating: 5 });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage customer feedback and reviews.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add Testimonial
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading testimonials...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-1 text-yellow-500">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(t)} className="text-gray-400 hover:text-blue-500 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-gray-500 dark:text-gray-400">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</div>
                                    <div className="text-xs text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">No testimonials found. Add one!</div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {isEditing ? 'Edit Testimonial' : 'Add Testimonial'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.name || ''}
                                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={currentTestimonial.role || ''}
                                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Software Engineer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                    <textarea
                                        value={currentTestimonial.text || ''}
                                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, text: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Great experience..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                                    <select
                                        value={currentTestimonial.rating || 5}
                                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, rating: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {[1, 2, 3, 4, 5].map(r => (
                                            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    {isEditing ? 'Save Changes' : 'Create Testimonial'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TestimonialManager;
