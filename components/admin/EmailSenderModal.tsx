import React, { useState, useEffect } from 'react';
import { Mail, ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
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
    context
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
                    '{{name}}': context?.name || 'User',
                    '{{projectTitle}}': context?.projectTitle || 'Project',
                    '{{amount}}': context?.amount || '0.00',
                    '{{orderId}}': context?.orderId || 'N/A'
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
                    className="relative w-full max-w-lg bg-white dark:bg-mono-900 rounded-2xl shadow-2xl p-6 border border-mono-200 dark:border-mono-800"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-mono-950 dark:text-white flex items-center gap-2">
                            <Mail size={24} className="text-neon-cyan" />
                            Quick Reply
                        </h3>
                        <button onClick={onClose} className="text-mono-500 hover:text-mono-700 dark:hover:text-mono-300">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Input
                                label="To"
                                type="email"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="recipient@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-mono-700 dark:text-mono-300 mb-1 ml-1">Select Template</label>
                            <div className="relative">
                                <select
                                    value={selectedTemplateId}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-mono-200 dark:border-mono-700 bg-mono-50 dark:bg-mono-900 focus:ring-2 focus:ring-neon-cyan/50 outline-none text-mono-950 dark:text-white appearance-none"
                                >
                                    <option value="">-- Choose a canned response --</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-mono-400">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {selectedTemplateId && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-neon-cyan/5 p-4 rounded-xl border border-neon-cyan/20"
                            >
                                <div className="mb-2">
                                    <span className="text-xs font-bold text-neon-cyan uppercase">Subject</span>
                                    <p className="text-sm font-medium text-mono-800 dark:text-mono-200">{subject}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-neon-cyan uppercase">Preview</span>
                                    <p className="text-sm text-mono-600 dark:text-mono-300 whitespace-pre-wrap max-h-40 overflow-y-auto">{body}</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-end pt-4 gap-3">
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            <Button
                                onClick={handleOpenGmail}
                                disabled={!selectedTemplateId}
                                className="bg-red-600 hover:bg-red-700 text-white border-none"
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
