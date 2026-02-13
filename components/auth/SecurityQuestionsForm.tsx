import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

const QUESTIONS = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was the name of your first school?",
    "What is your favorite food?",
    "What comes to your mind when you hear 'Blue'?",
    "Where were you born?",
    "What is your favorite movie?",
    "What is the name of your favorite teacher?",
];

interface SecurityQuestionsFormProps {
    onComplete?: () => void;
}

const SecurityQuestionsForm: React.FC<SecurityQuestionsFormProps> = ({ onComplete }) => {
    const { user, checkSecurityStatus } = useAuth();
    const navigate = useNavigate();
    const [selection, setSelection] = useState({ question: QUESTIONS[0], answer: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!selection.answer.trim()) {
            setError('Please answer the question.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/save-security-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: user?.uid,
                    questionsAndAnswers: [selection] // Send as array for backend compatibility
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save security question');
            }

            await checkSecurityStatus(); // Refresh context to update hasSecurityQuestions
            setSuccess(true);
            setTimeout(() => {
                if (onComplete) {
                    onComplete();
                } else {
                    navigate('/');
                }
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All Set!</h3>
                <p className="text-gray-500 dark:text-gray-400">Your security question has been saved.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Question</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Set up a security question to recover your account if you forget your password.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select a Question
                    </label>
                    <select
                        value={selection.question}
                        onChange={(e) => setSelection({ ...selection, question: e.target.value })}
                        className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    >
                        {QUESTIONS.map((q) => (
                            <option key={q} value={q}>
                                {q}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={selection.answer}
                        onChange={(e) => setSelection({ ...selection, answer: e.target.value })}
                        placeholder="Your answer..."
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        required
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full py-3">
                {loading ? 'Saving...' : 'Save Security Question'}
            </Button>
        </form>
    );
};

export default SecurityQuestionsForm;
