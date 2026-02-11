import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, LogOut, Menu, X, BookOpen, FileText, Tag, Mail, MessageSquare, Home, School, Video } from 'lucide-react';
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
        { path: '/admin/emails', icon: Mail, label: 'Emails' },
        { path: '/admin/requests', icon: MessageSquare, label: 'Requests' },
        { path: '/admin/students', icon: School, label: 'Students' },
        { path: '/admin/tutorials', icon: Video, label: 'Tutorials' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
            {/* ... Sidebar code skipped for brevity, it's fine ... */}

            {/* Sidebar */}
            <motion.aside
                className={`fixed md:sticky top-0 h-screen z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
                    }`}
            >
                {/* ... */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    <div className={`font-bold text-xl text-blue-600 truncate ${!isSidebarOpen && 'md:hidden'}`}>
                        OURS Admin
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
                                <span className={`whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {!isSidebarOpen && (
                                    <div className="hidden md:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                        <Home size={20} />
                        <span className={`whitespace-nowrap ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>Exit Admin</span>
                    </Link>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={20} />
                        <span className={`whitespace-nowrap ${!isSidebarOpen ? 'md:hidden' : 'block'}`}>Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="ml-auto flex items-center gap-4">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Admin" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                                {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                        )}
                    </div>
                </header>
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
