import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAnalyticsData, getDateRange, fetchPendingActions } from '../../lib/analytics';
import DateRangePicker from './analytics/DateRangePicker';
import StatsWidget from './analytics/StatsWidget';
import AnalyticsCharts from './analytics/AnalyticsCharts';
import PendingActionsWidget from './analytics/PendingActionsWidget';
import AddUserModal from './AddUserModal';

const AdminDashboard: React.FC = () => {
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'year' | 'all'>('30d');
    const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0, totalOrders: 0 });
    const [chartData, setChartData] = useState<any[]>([]);
    const [pendingActions, setPendingActions] = useState({ pendingVerifications: 0, pendingRequests: 0 });
    const [loading, setLoading] = useState(true);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch Analytics based on Date Range
                const range = getDateRange(dateRange);
                const analytics = await fetchAnalyticsData(range);

                setStats({
                    totalUsers: analytics.totalUsers,
                    totalRevenue: analytics.totalRevenue,
                    totalOrders: analytics.totalOrders
                });
                setChartData(analytics.chartData);

                // Fetch Pending Actions (Optimization: only fetch once or on mount, not every date change?)
                // For now, fetching here is fine, or move to separate useEffect
                const pending = await fetchPendingActions();
                setPendingActions(pending);

            } catch (error) {
                console.error("Dashboard load error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dateRange]);

    const handleExport = () => {
        // Implement CSV export logic using chartData
        alert("Exporting data for current view...");
        console.log("Exporting:", chartData);
        // ... (existing export logic can be adapted here)
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            Export
                        </button>
                        <button
                            onClick={() => setIsAddUserModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            <PendingActionsWidget
                pendingVerifications={pendingActions.pendingVerifications}
                pendingRequests={pendingActions.pendingRequests}
            />

            <StatsWidget stats={stats} loading={loading} />

            <AnalyticsCharts data={chartData} loading={loading} />

            <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSuccess={() => {
                    // unexpected refresh needed?
                }}
            />
        </div>
    );
};

export default AdminDashboard;
