import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, where, orderBy, getDoc } from 'firebase/firestore';
import { StudentRequest } from '../../types';

const StudentRequestManager: React.FC = () => {
    const [requests, setRequests] = useState<StudentRequest[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Fetch requests
    useEffect(() => {
        const q = query(
            collection(db, 'student_requests'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedRequests = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as StudentRequest[];
            setRequests(fetchedRequests);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (request: StudentRequest) => {
        if (!confirm(`Approve student status for ${request.email}?`)) return;

        try {
            // 1. Update User Profile
            const userRef = doc(db, 'users', request.userId);
            await updateDoc(userRef, {
                isStudent: true,
                studentStatus: 'verified'
            });

            // 2. Update Request Status
            const requestRef = doc(db, 'student_requests', request.id);
            await updateDoc(requestRef, {
                status: 'approved'
            });

            alert(`Approved ${request.email}`);
        } catch (error) {
            console.error("Error approving:", error);
            alert("Failed to approve.");
        }
    };

    const handleReject = async (request: StudentRequest) => {
        if (!confirm(`Reject request for ${request.email}?`)) return;

        try {
            const requestRef = doc(db, 'student_requests', request.id);
            await updateDoc(requestRef, {
                status: 'rejected'
            });

            // Optional: Update user status to 'rejected' if needed, or just leave as is
            const userRef = doc(db, 'users', request.userId);
            await updateDoc(userRef, {
                studentStatus: 'rejected'
            });

        } catch (error) {
            console.error("Error rejecting:", error);
            alert("Failed to reject.");
        }
    };

    const filteredRequests = requests.filter(r =>
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Verification Requests</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">ID Card</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{request.displayName || 'Unknown'}</div>
                                        <div className="text-gray-500">{request.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedImage(request.idCardUrl)}
                                            className="text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            <FileText size={16} /> View ID
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {request.createdAt?.toDate ? request.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {request.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" onClick={() => handleApprove(request)} className="bg-green-600 hover:bg-green-700 text-white">
                                                    <Check size={16} />
                                                </Button>
                                                <Button size="sm" onClick={() => handleReject(request)} className="bg-red-600 hover:bg-red-700 text-white">
                                                    <X size={16} />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage}
                            alt="Student ID"
                            className="relative max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                        />
                        <button className="absolute top-4 right-4 text-white hover:text-gray-300">
                            <X size={32} />
                        </button>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentRequestManager;
