import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import Button from '../ui/Button';
import LogoLoader from '../ui/LogoLoader';
import { Search, Trash2, ExternalLink, Award, User, Calendar, AlertCircle } from 'lucide-react';
import { CertificateData } from '../../lib/certificates';

const CertificateManager: React.FC = () => {
    const [certificates, setCertificates] = useState<CertificateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const q = query(collection(db, 'certificates'), orderBy('issuedAt', 'desc'));
            const snapshot = await getDocs(q);
            const certs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CertificateData));
            setCertificates(certs);
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to revoke this certificate? This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            await deleteDoc(doc(db, 'certificates', id));
            setCertificates(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error revoking certificate:", error);
            alert("Failed to revoke certificate.");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredCertificates = certificates.filter(cert =>
        cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-12"><LogoLoader /></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="text-blue-500" /> Certificate Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        View and manage issued certificates.
                    </p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search certificates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                <th className="p-4 font-semibold">Certificate ID</th>
                                <th className="p-4 font-semibold">Student</th>
                                <th className="p-4 font-semibold">Course</th>
                                <th className="p-4 font-semibold">Issued Date</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredCertificates.length > 0 ? (
                                filteredCertificates.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4">
                                            <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                                                {cert.id}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                                                <User size={16} className="text-gray-400" />
                                                {cert.userName}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            {cert.courseTitle}
                                        </td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {cert.issuedAt?.toDate().toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <a
                                                href={`/verify/${cert.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="View Certificate"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(cert.id)}
                                                disabled={deletingId === cert.id}
                                                className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                title="Revoke Certificate"
                                            >
                                                {deletingId === cert.id ? <LogoLoader size="sm" /> : <Trash2 size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                <AlertCircle className="text-gray-400" size={24} />
                                            </div>
                                            <p>No certificates found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CertificateManager;
