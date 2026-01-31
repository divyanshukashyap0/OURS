import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, ShoppingBag, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { db } from '../../lib/firebase';
import { collection, getCountFromServer, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState([
        { label: 'Total Users', value: '0', change: '0%', icon: Users, color: 'blue' },
        { label: 'Revenue', value: '$0', change: '0%', icon: DollarSign, color: 'green' },
        { label: 'Products', value: '0', change: '0', icon: ShoppingBag, color: 'purple' },
        { label: 'Orders', value: '0', change: '0%', icon: Activity, color: 'orange' },
    ]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Counts
                const usersSnap = await getCountFromServer(collection(db, 'users'));
                const projectsSnap = await getCountFromServer(collection(db, 'projects'));
                // const productsSnap = await getCountFromServer(collection(db, 'products')); // Optional if you have products

                // 2. Fetch Orders for Revenue Calculation
                const ordersSnap = await getDocs(collection(db, 'orders'));
                let totalRevenue = 0;
                let orderCount = ordersSnap.size;

                // Process orders for chart data (group by month)
                const monthlyRevenue: { [key: string]: number } = {};

                ordersSnap.docs.forEach(doc => {
                    const data = doc.data();
                    totalRevenue += Number(data.amount) || 0;

                    // Chart Data grouping
                    if (data.createdAt) {
                        const date = data.createdAt.toDate();
                        const month = date.toLocaleString('default', { month: 'short' });
                        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (Number(data.amount) || 0);
                    }
                });

                // Format Chart Data
                const chartData = Object.keys(monthlyRevenue).map(month => ({
                    name: month,
                    revenue: monthlyRevenue[month],
                    users: Math.floor(Math.random() * 100) // Placeholder for users per month as we don't track that yet
                }));

                // Update Stats State
                setStats([
                    { label: 'Total Users', value: usersSnap.data().count.toString(), change: '+100%', icon: Users, color: 'blue' },
                    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+100%', icon: DollarSign, color: 'green' },
                    { label: 'Products', value: projectsSnap.data().count.toString(), change: '+0', icon: ShoppingBag, color: 'purple' },
                    { label: 'Orders', value: orderCount.toString(), change: '+100%', icon: Activity, color: 'orange' },
                ]);

                setRevenueData(chartData.length > 0 ? chartData : [{ name: 'No Data', revenue: 0, users: 0 }]);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                        Export Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Add User
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Analytics</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Users Chart (Placeholder/Basic Order Data for now) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User/Order Growth</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                />
                                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
