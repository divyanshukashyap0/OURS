import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Shield, Key, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const ResetPasswordSecurityPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    const [questions, setQuestions] = useState<{ question: string }[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/get-security-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch security questions');
            }

            setUid(data.uid);
            setQuestions(data.questions);
            setAnswers(new Array(data.questions.length).fill(''));
            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswersSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (answers.some(a => !a.trim())) {
            setError('Please answer the question.');
            setLoading(false);
            return;
        }

        const formattedAnswers = questions.map((q, i) => ({
            question: q.question,
            answer: answers[i]
        }));

        try {
            const response = await fetch('http://localhost:5000/api/verify-security-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, answers: formattedAnswers }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const formattedAnswers = questions.map((q, i) => ({
            question: q.question,
            answer: answers[i]
        }));

        try {
            const response = await fetch('http://localhost:5000/api/verify-security-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid,
                    answers: formattedAnswers,
                    newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Password reset failed');
            }

            setSuccess(true);

            // Auto login logic could go here if we wanted, but explicit login is safer/clearer
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h3>
                    <p className="text-gray-500 dark:text-gray-400">Your password has been updated successfully. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Recovery</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {step === 1 && "Enter your email to get started"}
                        {step === 2 && "Answer your security question"}
                        {step === 3 && "Create a new password"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full py-3 flex items-center justify-center gap-2">
                            {loading ? 'Checking...' : (
                                <>
                                    Continue <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 mt-4"
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleAnswersSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {questions.map((q, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                        {q.question}
                                    </label>
                                    <input
                                        type="text"
                                        value={answers[index]}
                                        onChange={(e) => {
                                            const newAnswers = [...answers];
                                            newAnswers[index] = e.target.value;
                                            setAnswers(newAnswers);
                                        }}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Your answer"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <Button type="submit" disabled={loading} className="flex-1 py-3">
                                {loading ? 'Verifying...' : 'Verify Answer'}
                            </Button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full py-3">
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordSecurityPage;
