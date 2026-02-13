import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, ShoppingBag, Activity, TrendingUp } from 'lucide-react';

interface StatsWidgetProps {
    stats: {
        totalUsers: number;
        totalRevenue: number;
        totalOrders: number;
        conversionRate?: number; // Optional if we implement it later
    };
    loading: boolean;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ stats, loading }) => {
    const statItems = [
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
        { label: 'New Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'blue' },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'purple' },
        // { label: 'Conversion Rate', value: 'N/A', icon: TrendingUp, color: 'orange' }, 
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 h-32 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statItems.map((stat, index) => (
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
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default StatsWidget;
