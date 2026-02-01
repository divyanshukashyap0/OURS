import React, { useState, useEffect } from 'react';
import { Mail, ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { EmailTemplate } from '../../types';

interface EmailSenderModalProps {
    isOpen: boolean;
    onClose: () => void;
    templates: EmailTemplate[];
    defaultRecipient?: string;
    context?: {
        name?: string;
        projectTitle?: string;
        amount?: string;
        orderId?: string;
    };
}

const EmailSenderModal: React.FC<EmailSenderModalProps> = ({
    isOpen,
    onClose,
    templates,
    defaultRecipient = '',
    context = {}
}) => {
    const [recipient, setRecipient] = useState(defaultRecipient);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRecipient(defaultRecipient);
        }
    }, [isOpen, defaultRecipient]);

    useEffect(() => {
        if (selectedTemplateId) {
            const template = templates.find(t => t.id === selectedTemplateId);
            if (template) {
                // Perform replacements
                let filledSubject = template.subject;
                let filledBody = template.body;

                const replacements: Record<string, string> = {
                    '{{name}}': context.name || 'User',
                    '{{projectTitle}}': context.projectTitle || 'Project',
                    '{{amount}}': context.amount || '0.00',
                    '{{orderId}}': context.orderId || 'N/A'
                };

                for (const [key, value] of Object.entries(replacements)) {
                    filledSubject = filledSubject.replace(new RegExp(key, 'g'), value);
                    filledBody = filledBody.replace(new RegExp(key, 'g'), value);
                }

                setSubject(filledSubject);
                setBody(filledBody);
            }
        }
    }, [selectedTemplateId, templates, context]);

    const handleOpenGmail = () => {
        // Construct Gmail Compose URL
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Mail size={24} className="text-blue-500" />
                            Quick Reply
                        </h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
                            <input
                                type="email"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Template</label>
                            <select
                                value={selectedTemplateId}
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">-- Choose a canned response --</option>
                                {templates.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedTemplateId && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50"
                            >
                                <div className="mb-2">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Subject</span>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{subject}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Preview</span>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">{body}</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-end pt-4 gap-3">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button
                                onClick={handleOpenGmail}
                                disabled={!selectedTemplateId}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                leftIcon={<ArrowUpRight size={18} />}
                            >
                                Open in Gmail
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EmailSenderModal;
