import { db } from './firebase';
import { collection, query, where, getDocs, Timestamp, orderBy, getCountFromServer } from 'firebase/firestore';

export interface DateRange {
    startDate: Date;
    endDate: Date;
    label: string;
}

export const getDateRange = (range: '7d' | '30d' | '90d' | 'year' | 'all'): DateRange => {
    const end = new Date();
    const start = new Date();

    switch (range) {
        case '7d':
            start.setDate(end.getDate() - 7);
            break;
        case '30d':
            start.setDate(end.getDate() - 30);
            break;
        case '90d':
            start.setDate(end.getDate() - 90);
            break;
        case 'year':
            start.setFullYear(end.getFullYear() - 1);
            break;
        case 'all':
            start.setFullYear(2020); // Arbitrary old date
            break;
    }
    return { startDate: start, endDate: end, label: range };
};

export const fetchAnalyticsData = async (dateRange: DateRange) => {
    const { startDate, endDate } = dateRange;
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    try {
        // 1. Fetch Orders (Revenue)
        const ordersQuery = query(
            collection(db, 'orders'),
            where('createdAt', '>=', startTimestamp),
            where('createdAt', '<=', endTimestamp),
            orderBy('createdAt', 'asc')
        );
        const ordersSnap = await getDocs(ordersQuery);

        // 2. Fetch Users (Growth)
        const usersQuery = query(
            collection(db, 'users'),
            where('createdAt', '>=', startTimestamp),
            where('createdAt', '<=', endTimestamp),
            orderBy('createdAt', 'asc')
        );
        const usersSnap = await getDocs(usersQuery);

        // Process Data for Charts
        const revenueMap: { [key: string]: number } = {};
        const userGrowthMap: { [key: string]: number } = {};

        let totalRevenue = 0;

        ordersSnap.docs.forEach(doc => {
            const data = doc.data();
            const date = data.createdAt.toDate().toLocaleDateString(); // Group by day
            const amount = Number(data.amount) || 0;

            revenueMap[date] = (revenueMap[date] || 0) + amount;
            totalRevenue += amount;
        });

        usersSnap.docs.forEach(doc => {
            const data = doc.data();
            const date = data.createdAt.toDate().toLocaleDateString();
            userGrowthMap[date] = (userGrowthMap[date] || 0) + 1;
        });

        // Merge keys for combined chart data if needed, or separate
        // For now, let's return processed daily data
        const allDates = Array.from(new Set([...Object.keys(revenueMap), ...Object.keys(userGrowthMap)])).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const chartData = allDates.map(date => ({
            date,
            revenue: revenueMap[date] || 0,
            users: userGrowthMap[date] || 0
        }));

        return {
            totalRevenue,
            totalUsers: usersSnap.size, // This is New Users in period
            totalOrders: ordersSnap.size,
            chartData
        };

    } catch (error) {
        console.error("Error fetching analytics:", error);
        return { totalRevenue: 0, totalUsers: 0, totalOrders: 0, chartData: [] };
    }
};

export const fetchPendingActions = async () => {
    try {
        // Example: Fetch users with 'verificationStatus' === 'pending'
        // You might need to adjust based on your actual schema
        const pendingUsersQuery = query(collection(db, 'users'), where('idCardStatus', '==', 'pending')); // Assuming 'idCardStatus'
        const pendingUsersSnap = await getCountFromServer(pendingUsersQuery);

        // Example: Fetch project requests
        // const requestsQuery = query(collection(db, 'projectRequests'), where('status', '==', 'pending'));
        // const requestsSnap = await getCountFromServer(requestsQuery);

        return {
            pendingVerifications: pendingUsersSnap.data().count,
            pendingRequests: 0 // Placeholder until collection exists
        };
    } catch (error) {
        console.error("Error fetching pending actions:", error);
        return { pendingVerifications: 0, pendingRequests: 0 };
    }
};
