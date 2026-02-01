import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Mail, FileCode } from 'lucide-react';
import Button from '../ui/Button';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { EmailTemplate } from '../../types';
import EmailSenderModal from './EmailSenderModal';

const EmailManager: React.FC = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSenderOpen, setIsSenderOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<EmailTemplate>>({
        name: '',
        subject: '',
        body: '',
        type: 'custom'
    });

    useEffect(() => {
        const q = query(collection(db, 'email_templates'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTemplates = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as EmailTemplate[];
            setTemplates(fetchedTemplates);
        }, (error) => {
            console.error("Error fetching templates:", error);
        });

        return () => unsubscribe();
    }, []);

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            try {
                await deleteDoc(doc(db, 'email_templates', id));
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Failed to delete.");
            }
        }
    };

    const handleOpenModal = (template?: EmailTemplate) => {
        if (template) {
            setEditingTemplate(template);
            setFormData(template);
        } else {
            setEditingTemplate(null);
            setFormData({
                name: '',
                subject: '',
                body: '<p>Hello {{name}},</p>\n<p>Thank you for your order!</p>',
                type: 'custom'
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

            if (editingTemplate) {
                const docRef = doc(db, 'email_templates', editingTemplate.id);
                await updateDoc(docRef, dataToSave);
            } else {
                await addDoc(collection(db, 'email_templates'), {
                    ...dataToSave,
                    createdAt: serverTimestamp()
                });
            }
            setIsModalOpen(false);
        } catch (error: any) {
            alert(`Failed to save template: ${error.message}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsSenderOpen(true)} leftIcon={<Mail size={18} />}>
                        Send Email
                    </Button>
                    <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={18} />}>
                        New Template
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search templates..."
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
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {filteredTemplates.map((template) => (
                                    <motion.tr
                                        layout
                                        key={template.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => handleOpenModal(template)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{template.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{template.subject}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 capitalize">
                                                {template.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(template.id); }}
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

            {/* Modal */}
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
                            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">{editingTemplate ? 'Edit Template' : 'New Template'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. Order Confirmation"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="custom">Custom</option>
                                            <option value="order_confirmation">Order Confirmation</option>
                                            <option value="welcome">Welcome Email</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Line</label>
                                    <input
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Thanks for your order!"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Body (HTML)</label>
                                    <div className="relative">
                                        <textarea
                                            rows={12}
                                            value={formData.body}
                                            onChange={e => setFormData({ ...formData, body: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                        />
                                        <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border dark:border-gray-700">
                                            Supported variables: {"{{name}}"}, {"{{orderId}}"}, {"{{amount}}"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-8">
                                    <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">{editingTemplate ? 'Save Changes' : 'Create Template'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <EmailSenderModal
                isOpen={isSenderOpen}
                onClose={() => setIsSenderOpen(false)}
                templates={templates}
            />
        </div>
    );
};


