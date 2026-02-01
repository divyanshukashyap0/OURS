import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Button from '../ui/Button';
import { Save, Globe, Type, Share2, Mail } from 'lucide-react';
import { SiteConfig } from '../../context/SiteContext';
import { PROJECTS } from '../../constants';
import { Database, UploadCloud } from 'lucide-react';

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

    const handleSyncProjects = async () => {
        if (!confirm('This will upload all static projects (from code) to the database. Existing projects with the same ID will be overwritten. Continue?')) return;

        setLoading(true);
        try {
            let count = 0;
            for (const project of PROJECTS) {
                // Use String(project.id) as the doc ID
                const docRef = doc(db, 'projects', String(project.id));
                await setDoc(docRef, {
                    ...project,
                    // Ensure ID is stored as string in data too if we want consistency, 
                    // though types.ts allows number | string.
                    // Storing as is from constant.
                    updatedAt: new Date(),
                    isStatic: true // Marker for debugging
                }, { merge: true });
                count++;
            }
            alert(`Successfully synced ${count} projects to database.`);
        } catch (error) {
            console.error("Error syncing projects:", error);
            alert("Failed to sync projects.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">General Settings</h1>
                <Button onClick={handleSave} disabled={loading} className="gap-2" size="sm">
                    <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    <h2 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Globe size={18} className="text-blue-500" /> Branding
                    </h2>
                    <div>
                        <label className="block text-xs font-medium mb-1 dark:text-gray-300">App Name</label>
                        <input
                            value={settings.appName}
                            onChange={(e) => handleChange('appName', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1 dark:text-gray-300">Contact Email</label>
                        <input
                            value={settings.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    <h2 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Type size={18} className="text-orange-500" /> Content
                    </h2>
                    <div>
                        <label className="block text-xs font-medium mb-1 dark:text-gray-300">Hero Title</label>
                        <input
                            value={settings.heroTitle}
                            onChange={(e) => handleChange('heroTitle', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1 dark:text-gray-300">Hero Subtitle</label>
                        <textarea
                            rows={2}
                            value={settings.heroSubtitle}
                            onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                    <h2 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Share2 size={18} className="text-purple-500" /> Social Links
                    </h2>
                    <div className="space-y-3">
                        {['github', 'twitter', 'linkedin', 'instagram', 'youtube'].map((platform) => (
                            <div key={platform} className="flex items-center gap-2">
                                <span className="w-20 text-xs capitalize text-gray-500">{platform}</span>
                                <input
                                    value={settings.socials?.[platform as keyof typeof settings.socials] || ''}
                                    onChange={(e) => handleSocialChange(platform as any, e.target.value)}
                                    placeholder={`URL...`}
                                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                        <h2 className="text-base font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                            <Database size={18} className="text-green-500" /> Data Management
                        </h2>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="font-medium text-sm text-gray-900 dark:text-white">Sync Static Projects</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Upload built-in projects to DB.</p>
                            </div>
                            <Button onClick={handleSyncProjects} disabled={loading} variant="outline" size="sm" className="gap-2">
                                <UploadCloud size={16} /> Sync
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
