import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoLoader from './ui/LogoLoader';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireSecurityQuestions?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireSecurityQuestions = true }) => {
    const { user, loading, hasSecurityQuestions } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <LogoLoader size={50} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireSecurityQuestions && !hasSecurityQuestions) {
        return <Navigate to="/security-questions" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
