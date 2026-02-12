import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyCertificate, CertificateData } from '../lib/certificates';
import Button from '../components/ui/Button';
import LogoLoader from '../components/ui/LogoLoader';
import { Search, CheckCircle, XCircle, Award, Calendar, User, BookOpen } from 'lucide-react';

const CertificateVerificationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState(id || '');
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (id) {
            handleVerify(id);
        }
    }, [id]);

    const handleVerify = async (certId: string) => {
        setLoading(true);
        setError('');
        setCertificate(null);
        setSearched(true);

        try {
            const cert = await verifyCertificate(certId);
            if (cert) {
                setCertificate(cert);
            } else {
                setError('Certificate not found. Please check the ID and try again.');
            }
        } catch (err) {
            setError('An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/verify/${searchId.trim()}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center pt-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="w-full max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Certificate Verification
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Verify the authenticity of a certificate issued by Ours Academy.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 dark:border-gray-800">
                    <form onSubmit={handleSubmit} className="flex gap-4 flex-col sm:flex-row">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Enter Certificate ID (e.g., CERT-ABCD-1234)"
                                className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out sm:text-lg"
                            />
                        </div>
                        <Button type="submit" size="lg" className="sm:w-auto w-full justify-center py-4 text-lg">
                            Verify
                        </Button>
                    </form>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <LogoLoader />
                    </div>
                )}

                {/* Result Section */}
                {!loading && searched && (
                    <div className="animate-fade-in-up">
                        {certificate ? (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-green-100 dark:border-green-900/30">
                                <div className="bg-green-50 dark:bg-green-900/20 p-6 flex items-center gap-4 border-b border-green-100 dark:border-green-900/30">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-green-800 dark:text-green-400">Valid Certificate</h2>
                                        <p className="text-green-600 dark:text-green-300 text-sm">This certificate is authentic and issued by Ours Academy.</p>
                                    </div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Student Name</h3>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <User size={20} className="text-blue-500" />
                                                {certificate.userName}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Issue Date</h3>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <Calendar size={20} className="text-blue-500" />
                                                {certificate.issuedAt.toDate().toLocaleDateString(undefined, { dateStyle: 'long' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Course Completed</h3>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                                <BookOpen size={24} />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">{certificate.courseTitle}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Instructor: {certificate.instructor}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300 font-mono">
                                            <Award size={16} />
                                            Certificate ID: {certificate.id}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-red-100 dark:border-red-900/30 p-8 text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <XCircle size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invalid Certificate</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                                <Button variant="outline" onClick={() => setSearchId('')}>Try Another ID</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificateVerificationPage;
