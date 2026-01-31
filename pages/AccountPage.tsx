import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, BookOpen, School, Calendar, Save, Loader2, Camera, LayoutDashboard, Package, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

interface UserProfile {
    displayName: string;
    email: string;
    photoURL: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    dob: string;
    qualification: string;
    college: string;

    mobile: string;
    role?: string;
}

interface Project {
    id: string;
    title: string;
    githubLink?: string;
}

interface Order {
    id: string;
    projectId: string;
    projectTitle: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: any;
    paymentId: string;
    githubLink?: string;
}

const AccountPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [age, setAge] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'personal' | 'payment' | 'orders'>('personal');
    const [orders, setOrders] = useState<Order[]>([]);

    const [profile, setProfile] = useState<UserProfile>({
        displayName: '',
        email: '',
        photoURL: '',
        gender: '',
        dob: '',
        qualification: '',
        college: '',

        mobile: '',
        role: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile({ ...profile, ...docSnap.data() as Partial<UserProfile> });
                } else {
                    // Fallback to Auth defaults if no Firestore doc (shouldn't happen with our sync)
                    setProfile(prev => ({
                        ...prev,
                        displayName: user.displayName || '',
                        email: user.email || '',
                        photoURL: user.photoURL || ''
                    }));
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    // Calculate Age when DOB changes
    useEffect(() => {
        if (profile.dob) {
            const birthDate = new Date(profile.dob);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                calculatedAge--;
            }
            setAge(calculatedAge);
        } else {
            setAge(null);
        }
    }, [profile.dob]);

    // Fetch Orders & Projects
    useEffect(() => {
        if (activeTab === 'orders' && user) {
            const fetchData = async () => {
                try {
                    // 1. Fetch Orders
                    const ordersQ = query(
                        collection(db, 'orders'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const ordersSnapshot = await getDocs(ordersQ);
                    const fetchedOrders = ordersSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Order[];

                    // 2. Fetch Projects (to get GitHub links)
                    const projectsSnapshot = await getDocs(collection(db, 'projects'));
                    const fetchedProjects = projectsSnapshot.docs.map(doc => doc.data() as Project);

                    // 3. Merge GitHub Link into Orders
                    const ordersWithLinks = fetchedOrders.map(order => {
                        const matchedProject = fetchedProjects.find(p => p.title === order.projectTitle);
                        return {
                            ...order,
                            githubLink: matchedProject?.githubLink
                        };
                    });

                    setOrders(ordersWithLinks);
                } catch (error: any) {
                    console.error("Error fetching orders:", error);
                    if (error.code === 'failed-precondition') {
                        console.error("Missing/Insufficient permissions or INDEX MISSING. Check console for index creation link.");
                        alert("System Notice: The Order History query requires a database index. Open the browser console (F12) to see the link to create it.");
                    }
                }
            };
            fetchData();
        }
    }, [activeTab, user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        try {
            // Update Firestore
            const docRef = doc(db, 'users', user.uid);
            await updateDoc(docRef, { ...profile });

            // Sync with Firebase Auth Profile
            await updateProfile(user, {
                displayName: profile.displayName,
                photoURL: profile.photoURL
            });

            // Force reload user to reflect changes immediately in Navbar if needed
            // But usually updateProfile triggers a state change in recent SDKs or we can rely on local state if we had it.
            // For now, the AuthContext listener might pick it up or we might need to trigger a refresh.

            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    const TabButton = ({ id, label }: { id: typeof activeTab, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === id
                ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/5 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User Card */}
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                        <img
                            src={profile.photoURL || "/default-avatar.png"}
                            onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hello,</p>
                            <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{profile.displayName || 'User'}</h3>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/10">
                            <User size={20} />
                            <span>Account Settings</span>
                        </div>
                        <div className="p-0">
                            <TabButton id="personal" label="Personal Information" />

                            <TabButton id="orders" label="My Orders" />
                            <TabButton id="payment" label="Payment Options" />

                            {/* Admin Dashboard Link */}
                            {profile.role === 'admin' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 border-transparent flex items-center gap-2"
                                >
                                    <LayoutDashboard size={16} />
                                    Admin Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8"
                    >
                        {activeTab === 'personal' && (
                            <>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h1>
                                <form onSubmit={handleSave} className="space-y-8">
                                    {/* Personal Details Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={profile.displayName}
                                                onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">My Profile Pic</label>
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={profile.photoURL || "/default-avatar.png"}
                                                    onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
                                                    alt="Preview"
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500 mb-2">Upload a new avatar</p>
                                                    <input
                                                        type="file"
                                                        id="avatar-upload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    setProfile({ ...profile, photoURL: reader.result as string });
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        type="button"
                                                        leftIcon={<Camera size={14} />}
                                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                                    >
                                                        Change
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gender & DOB */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                                            <div className="flex gap-6 mt-2">
                                                {['Male', 'Female', 'Other'].map((g) => (
                                                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="gender"
                                                            value={g}
                                                            checked={profile.gender === g}
                                                            onChange={e => setProfile({ ...profile, gender: e.target.value as any })}
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <span className="text-gray-700 dark:text-gray-300">{g}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex-1">
                                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                    <input
                                                        type="date"
                                                        value={profile.dob}
                                                        onChange={e => setProfile({ ...profile, dob: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                                {age !== null && (
                                                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-lg font-bold text-lg whitespace-nowrap min-w-[80px] text-center">
                                                        {age} Yrs
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100 dark:border-gray-800" />

                                    {/* Education */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Highest Qualification</label>
                                            <div className="relative">
                                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. B.Tech Computer Science"
                                                    value={profile.qualification}
                                                    onChange={e => setProfile({ ...profile, qualification: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">College / University</label>
                                            <div className="relative">
                                                <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. IIT Delhi"
                                                    value={profile.college}
                                                    onChange={e => setProfile({ ...profile, college: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={saving} className="px-8 py-3" leftIcon={<Save size={18} />}>
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}



                        {activeTab === 'orders' && (
                            <>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">My Orders</h1>
                                <div className="space-y-4">
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Package size={32} />
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Orders Yet</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't purchased any projects yet.</p>
                                            <Button onClick={() => navigate('/')}>Browse Projects</Button>
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order.id} className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-blue-300 dark:hover:border-blue-700">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                                        <Package size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.projectTitle}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {order.paymentId}</p>
                                                        <div className="flex items-center gap-3 mt-2 text-sm">
                                                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded font-medium uppercase text-xs">
                                                                {order.status}
                                                            </span>
                                                            <span className="text-gray-500">•</span>
                                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                                {order.currency} {order.amount.toFixed(2)}
                                                            </span>
                                                            <span className="text-gray-500">•</span>
                                                            <span className="text-gray-500">
                                                                {order.createdAt?.toDate().toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {order.githubLink && (
                                                        <a href={order.githubLink} target="_blank" rel="noopener noreferrer">
                                                            <Button size="sm" className="gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-transparent hover:bg-gray-800 dark:hover:bg-gray-100">
                                                                <div className="w-4 h-4"><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></div>
                                                                Source Code
                                                            </Button>
                                                        </a>
                                                    )}
                                                    <Link to={`/invoice/${order.id}`} target="_blank">
                                                        <Button variant="outline" size="sm" className="gap-2">
                                                            Invoice
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/project/${order.projectId}`}>
                                                        <Button variant="outline" size="sm" className="gap-2">
                                                            View Project <ExternalLink size={14} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                ))
                                    )}
                            </div>
                    </>
                        )}

                    {activeTab === 'payment' && (
                        <>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Options</h1>
                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Saved Payment Methods</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-6">You can save your cards and UPI details during checkout for faster payments.</p>
                                <Button variant="outline">Add New Card</Button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
        </div >
    );
};

export default AccountPage;
