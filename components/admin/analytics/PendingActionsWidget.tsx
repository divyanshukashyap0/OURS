import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingActionsProps {
    pendingVerifications: number;
    pendingRequests: number;
}

const PendingActionsWidget: React.FC<PendingActionsProps> = ({ pendingVerifications, pendingRequests }) => {
    const navigate = useNavigate();

    if (pendingVerifications === 0 && pendingRequests === 0) {
        return null; // Don't show if nothing pending
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6"
        >
            <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 dark:text-amber-400 mt-1" size={20} />
                <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200">Action Required</h4>
                    <div className="mt-2 space-y-2">
                        {pendingVerifications > 0 && (
                            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                <Clock size={14} />
                                <span>{pendingVerifications} Student Verification Request{pendingVerifications > 1 ? 's' : ''}</span>
                                <button
                                    onClick={() => navigate('/admin/students')}
                                    className="text-amber-900 dark:text-amber-100 underline hover:no-underline font-medium ml-2"
                                >
                                    Review
                                </button>
                            </div>
                        )}
                        {/* 
                        {pendingRequests > 0 && (
                            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                <Clock size={14} />
                                <span>{pendingRequests} Project Request{pendingRequests > 1 ? 's' : ''}</span>
                                <button className="text-amber-900 dark:text-amber-100 underline hover:no-underline font-medium ml-2">Review</button>
                            </div>
                        )} 
                        */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PendingActionsWidget;
