import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Button from '../ui/Button';
import { Save, Globe, Type, Share2, Mail } from 'lucide-react';
import { SiteConfig } from '../../context/SiteContext';

const AdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<SiteConfig>({
        appName: '',
        heroTitle: '',
        heroSubtitle: '',
        contactEmail: '',
        socials: { github: '', twitter: '', linkedin: '' }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, 'settings', 'general');
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                setSettings(snap.data() as SiteConfig);
            } else {
                // Initialize with defaults if empty
                setSettings({
                    appName: 'OURS.',
                    heroTitle: 'Welcome to OURS.',
                    heroSubtitle: 'The platform for developers to build, learn, and grow.',
                    contactEmail: '',
                    socials: { github: '', twitter: '', linkedin: '' }
                });
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (field: keyof SiteConfig, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (platform: keyof SiteConfig['socials'], value: string) => {
        setSettings(prev => ({
            ...prev,
            socials: { ...prev.socials, [platform]: value }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, 'settings', 'general'), settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Failed to save settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h1>
                <Button onClick={handleSave} disabled={loading} className="gap-2">
                    <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Globe size={20} className="text-blue-500" /> Branding & Hero
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">App Name (Navbar)</label>
                        <input
                            value={settings.appName}
                            onChange={(e) => handleChange('appName', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Contact Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={settings.contactEmail}
                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hero Title</label>
                    <input
                        value={settings.heroTitle}
                        onChange={(e) => handleChange('heroTitle', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hero Subtitle</label>
                    <textarea
                        rows={2}
                        value={settings.heroSubtitle}
                        onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                    <Share2 size={20} className="text-purple-500" /> Social Links
                </h2>
                <div className="space-y-4">
                    {['github', 'twitter', 'linkedin'].map((platform) => (
                        <div key={platform}>
                            <label className="block text-sm font-medium mb-1 capitalize dark:text-gray-300">{platform} URL</label>
                            <input
                                value={settings.socials?.[platform as keyof typeof settings.socials] || ''}
                                onChange={(e) => handleSocialChange(platform as any, e.target.value)}
                                placeholder={`https://${platform}.com/username`}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-blue-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
