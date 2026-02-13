import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Filter, CheckCircle, XCircle, MoreVertical, Shield, FileText, Check, X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import FilterBar from './content/FilterBar';

interface Student {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: string;
    studentStatus?: 'pending' | 'verified' | 'rejected' | null;
    idCardUrl?: string;
    enrolledCourses?: string[];
    createdAt?: any;
}

const StudentManager: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedStudents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Student[];
            setStudents(fetchedStudents);
        });

        return () => unsubscribe();
    }, []);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all'
                ? true
                : statusFilter === 'pending'
                    ? student.studentStatus === 'pending'
                    : student.studentStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [students, searchTerm, statusFilter]);

    const handleVerification = async (studentId: string, status: 'verified' | 'rejected') => {
        try {
            const response = await fetch('http://localhost:5000/api/admin/update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: studentId,
                    data: {
                        studentStatus: status,
                        isStudent: status === 'verified'
                    }
                })
            });

            if (!response.ok) throw new Error('Failed to update status');

            if (selectedStudent?.id === studentId) {
                setSelectedStudent(null);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Check console.");
        }
    };

    const handleRoleChange = async (studentId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        try {
            const response = await fetch('http://localhost:5000/api/admin/update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid: studentId,
                    data: { role: newRole }
                })
            });

            if (!response.ok) throw new Error('Failed to change role');
        } catch (error) {
            console.error("Error changing role:", error);
            alert("Failed to change role. Check console.");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student & User Manager</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <FilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search users by name or email..."
                    filters={[
                        {
                            label: 'Verification Status',
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { label: 'All Users', value: 'all' },
                                { label: 'Pending Verification', value: 'pending' },
                                { label: 'Verified', value: 'verified' },
                                { label: 'Rejected', value: 'rejected' }
                            ]
                        }
                    ]}
                />

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Verification</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                {student.photoURL ? (
                                                    <img src={student.photoURL} alt={student.displayName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={14} className="text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{student.displayName || 'Unknown'}</div>
                                                <div className="text-xs text-gray-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${student.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                            {student.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            {/* Status Badge */}
                                            {student.studentStatus === 'verified' && (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
                                                    <CheckCircle size={12} /> Verified
                                                </span>
                                            )}
                                            {student.studentStatus === 'rejected' && (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full w-fit">
                                                    <XCircle size={12} /> Rejected
                                                </span>
                                            )}
                                            {student.studentStatus === 'pending' && (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full w-fit">
                                                    Pending
                                                </span>
                                            )}
                                            {!student.studentStatus && <span className="text-gray-400 text-xs">-</span>}

                                            {/* Actions Row */}
                                            <div className="flex items-center gap-2">
                                                {student.idCardUrl && (
                                                    <button
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        title="View ID Card"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleVerification(student.id, 'verified')}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>

                                                <button
                                                    onClick={() => handleVerification(student.id, 'rejected')}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {student.createdAt?.toDate ? student.createdAt.toDate().toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleRoleChange(student.id, student.role === 'admin' ? 'student' : 'admin')}
                                            className="text-gray-400 hover:text-blue-600"
                                            title="Toggle Role"
                                        >
                                            <Shield size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudent(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
                        >
                            <h2 className="text-xl font-bold mb-4">Verify Student Identity</h2>

                            <div className="mb-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Student: <span className="text-gray-900 dark:text-white font-medium">{selectedStudent.displayName}</span></p>
                                <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                    {selectedStudent.idCardUrl ? (
                                        <img src={selectedStudent.idCardUrl} alt="ID Card" className="max-w-full max-h-full" />
                                    ) : (
                                        <div className="text-gray-400">No ID Card Uploaded</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleVerification(selectedStudent.id, 'rejected')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStudent.studentStatus === 'rejected'
                                            ? 'bg-red-100 text-red-800 cursor-default ring-2 ring-offset-1 ring-red-500'
                                            : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/20'
                                            }`}
                                    >
                                        {selectedStudent.studentStatus === 'rejected' ? 'Rejected' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleVerification(selectedStudent.id, 'verified')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStudent.studentStatus === 'verified'
                                            ? 'bg-green-100 text-green-800 cursor-default ring-2 ring-offset-1 ring-green-500'
                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-600/20'
                                            }`}
                                    >
                                        {selectedStudent.studentStatus === 'verified' ? 'Verified' : 'Approve'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentManager;
