import React, { useState } from 'react';
import { Mail, Terminal, Send, MapPin, Phone } from 'lucide-react';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate API call
        setTimeout(() => setStatus('sent'), 1500);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-950 font-mono">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block p-3 rounded-full bg-tech-primary/10 text-tech-primary mb-4">
                        <Terminal size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Init <span className="text-tech-primary">Handshake</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
                        Have a bug to report? Or just want to talk about the Singularity?
                        We respond faster than a Redis cache hit.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                    <div className="p-8 bg-tech-darker text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div>
                            <h3 className="text-2xl font-bold mb-6">Transmission Channels</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-tech-primary">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">SMTP Endpoint</p>
                                        <p className="font-medium">ours.system26@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-tech-accent">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Voice Protocol</p>
                                        <p className="font-medium">+91 8005343226</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-purple-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Physical Node</p>
                                        <p className="font-medium">Everywhere in world, IN</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <p className="text-sm text-gray-500 font-mono">
                                // We promise not to sell your data to Skynet.
                            </p>
                        </div>
                    </div>

                    <div className="p-8">
                        {status === 'sent' ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Send size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Packet Sent!</h3>
                                <p className="text-gray-500">We've received your transmission. Expect an ACK shortly.</p>
                                <Button className="mt-6" onClick={() => setStatus('idle')}>Send Another</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User Identity</label>
                                    <input type="text" required className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-tech-primary outline-none transition-all" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comms Channel</label>
                                    <input type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-tech-primary outline-none transition-all" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payload</label>
                                    <textarea required rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-tech-primary outline-none transition-all resize-none" placeholder="Describe your inquiry..."></textarea>
                                </div>
                                <Button type="submit" disabled={status === 'sending'} className="w-full bg-tech-primary hover:bg-sky-600 text-white py-3">
                                    {status === 'sending' ? 'Transmitting...' : 'Send Transmission'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
