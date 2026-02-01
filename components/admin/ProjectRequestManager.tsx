import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ProjectRequest } from '../../types';
import { Search, Filter, AlertCircle, Clock, CheckCircle, MoreVertical, Mail, X } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectRequestManager: React.FC = () => {
    const [requests, setRequests] = useState<ProjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ProjectRequest['status'] | 'all'>('all');
    const [selectedRequest, setSelectedRequest] = useState<ProjectRequest | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'project_requests'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const fetchedRequests = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ProjectRequest[];
            setRequests(fetchedRequests);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: ProjectRequest['status']) => {
        try {
            await updateDoc(doc(db, 'project_requests', id), {
                status: newStatus
            });
            // Optimistic update
            setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
            if (selectedRequest && selectedRequest.id === id) {
                setSelectedRequest({ ...selectedRequest, status: newStatus });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'contacted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'in_progress': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading requests...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage incoming build inquiries.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by project name or email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Budget</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Requested</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredRequests.map((req) => (
                                <tr
                                    key={req.id}
                                    onClick={() => setSelectedRequest(req)}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(req.status)} capitalize`}>
                                            {req.status?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {req.projectName}
                                        {req.status === 'pending' && <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block" />}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Mail size={14} /> {req.contactEmail}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">${req.budget}</td>
                                    <td className="px-6 py-4">
                                        {req.priority === 'rush' ? (
                                            <span className="flex items-center gap-1 text-red-500 font-bold text-xs uppercase">
                                                <AlertCircle size={14} /> Rush
                                            </span>
                                        ) : (
                                            <span className="text-gray-500 text-xs uppercase">Standard</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {req.createdAt?.toDate().toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No requests found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedRequest(null)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                    {selectedRequest.projectName}
                                </h2>
                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span>From: {selectedRequest.contactEmail}</span>
                                    <span>•</span>
                                    <span>{selectedRequest.createdAt?.toDate().toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Budget</label>
                                    <div className="font-semibold text-gray-900 dark:text-white">${selectedRequest.budget}</div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Priority</label>
                                    <div className={`font-semibold ${selectedRequest.priority === 'rush' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                        {selectedRequest.priority.toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">The Vision</label>
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {selectedRequest.description}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">Core Features</label>
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {selectedRequest.features}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <label className="text-sm font-bold text-gray-900 dark:text-white mb-3 block">Update Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'contacted', 'in_progress', 'completed'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedRequest.id, status as any)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${selectedRequest.status === status
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500'
                                                }`}
                                        >
                                            {status.replace('_', ' ').toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                            <a
                                href={`mailto:${selectedRequest.contactEmail}?subject=Re: Project Inquiry - ${selectedRequest.projectName}`}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2"
                            >
                                <Mail size={16} /> Reply via Email
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProjectRequestManager;
