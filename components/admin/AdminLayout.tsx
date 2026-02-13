import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Menu, X, BookOpen, FileText, Tag, Mail, MessageSquare, Home, School, Video, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const { user } = useAuth();

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/projects', icon: Package, label: 'Projects' },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { path: '/admin/blogs', icon: FileText, label: 'Blogs' },
        { path: '/admin/coupons', icon: Tag, label: 'Coupons' },
        { path: '/admin/certificates', icon: Award, label: 'Certificates' },
        { path: '/admin/emails', icon: Mail, label: 'Emails' },
        { path: '/admin/requests', icon: MessageSquare, label: 'Requests' },
        { path: '/admin/students', icon: School, label: 'Students' },
        { path: '/admin/tutorials', icon: Video, label: 'Tutorials' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex transition-colors duration-300 font-sans">
            {/* Sidebar */}
            <motion.aside
                className={`fixed md:sticky top-0 h-screen z-50 w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col transition-all duration-300 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
                    }`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className={`font-bold text-xl text-blue-600 truncate tracking-tight ${!isSidebarOpen && 'md:hidden'}`}>
                        OURS Admin
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-blue-600/10 text-blue-700 dark:text-blue-400 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'} />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {!isSidebarOpen && (
                                    <div className="hidden md:group-hover:block absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Home size={20} />
                        <span className={`whitespace-nowrap ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>Exit Admin</span>
                    </Link>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={20} />
                        <span className={`whitespace-nowrap ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-950">
                <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.displayName || 'Admin'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</div>
                        </div>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Admin" className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-800" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
                                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                        )}
                    </div>
                </header>
                <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
