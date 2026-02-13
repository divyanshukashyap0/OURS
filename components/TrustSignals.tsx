import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getTestimonials, Testimonial } from '../lib/testimonials';

const TrustSignals: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTestimonials = async () => {
            try {
                const data = await getTestimonials();
                setTestimonials(data);
            } catch (error) {
                console.error("Error loading testimonials:", error);
            } finally {
                setLoading(false);
            }
        };
        loadTestimonials();
    }, []);

    if (loading) return null; // Or a skeleton loader
    if (testimonials.length === 0) return null;

    return (
        <section className="bg-mono-50 dark:bg-mono-900 py-16 border-y border-mono-100 dark:border-mono-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-mono-950 dark:text-white mb-4">Trusted by Early Adopters</h2>
                    <p className="text-mono-500 dark:text-mono-400">Join a community of builders who are shipping real software.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={t.id || i} className="bg-white dark:bg-mono-950 p-6 rounded-2xl shadow-sm border border-mono-100 dark:border-mono-800">
                            <div className="flex gap-1 mb-4 text-yellow-500">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p className="text-mono-600 dark:text-mono-300 mb-6 italic">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-mono-200 dark:bg-mono-800 rounded-full flex items-center justify-center font-bold text-mono-600 dark:text-mono-400">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-mono-950 dark:text-white text-sm">{t.name}</div>
                                    <div className="text-xs text-mono-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSignals;
