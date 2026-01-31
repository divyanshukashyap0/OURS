import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const OrderSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { paymentId, projectTitle } = location.state || {}; // Expect data passed from navigation

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800"
            >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Successful!</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    Thank you for your purchase. You can now access your project files.
                </p>

                {paymentId && (
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 text-left space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Payment ID</span>
                            <span className="font-mono font-medium text-gray-900 dark:text-white">{paymentId}</span>
                        </div>
                        {projectTitle && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Project</span>
                                <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{projectTitle}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <Button
                        className="w-full h-12 text-lg gap-2"
                        onClick={() => navigate('/account')}
                    >
                        <Package size={20} /> View My Orders
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full h-12 text-gray-500 dark:text-gray-400 hover:bg-transparent hover:text-gray-900 dark:hover:text-white"
                        onClick={() => navigate('/')}
                    >
                        <Home size={18} className="mr-2" /> Return to Home
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccessPage;
