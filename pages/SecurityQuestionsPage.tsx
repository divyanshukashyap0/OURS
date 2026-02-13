import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecurityQuestionsForm from '../components/auth/SecurityQuestionsForm';
import { useAuth } from '../context/AuthContext';

const SecurityQuestionsPage: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-8">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
                <SecurityQuestionsForm />
            </div>
        </div>
    );
};

export default SecurityQuestionsPage;
