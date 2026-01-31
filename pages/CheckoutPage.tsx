import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/config';
import Button from '../components/ui/Button';
import { ShieldCheck, CreditCard, Lock, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const CheckoutPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        const found = PROJECTS.find(p => p.id === Number(id));
        if (found) {
            setProject(found);
        } else {
            navigate('/projects');
        }
    }, [id, navigate]);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/checkout/${id}` } });
            return;
        }

        setLoading(true);

        // 1. Load Razorpay SDK
        const res = await loadRazorpay();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        // 2. Create Order via Backend
        let order;
        const priceValue = parseFloat(project?.price.replace(/[^0-9.]/g, '') || '0');
        try {
            const response = await fetch(`${API_BASE_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: priceValue,
                    currency: 'USD',
                    receipt: `receipt_${user.uid}_${project.id}_${Date.now()}`
                })
            });
            order = await response.json();
            if (!response.ok) throw new Error(order.error || 'Server error');
        } catch (error: any) {
            console.error(error);
            alert(`Failed to initiate payment: ${error.message}`);
            setLoading(false);
            return;
        }

        // 3. Open Razorpay Options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "OURS Platform",
            description: `Payment for ${project.title}`,
            image: "/OURS.png", // Or project image
            order_id: order.id,
            handler: async function (response: any) {
                // 4. Verify Payment on Backend
                try {
                    const verifyRes = await fetch(`${API_BASE_URL}/api/verify-payment`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData: {
                                userId: user.uid,
                                userEmail: user.email,
                                projectId: String(project.id),
                                projectTitle: project.title,
                                amount: priceValue, // Save original USD amount
                                currency: 'USD',
                            }
                        })
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.status === 'success') {
                        navigate('/order-success', {
                            state: {
                                paymentId: response.razorpay_payment_id,
                                projectTitle: project.title
                            }
                        });
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                } catch (error) {
                    console.error("Verification error:", error);
                    alert("Payment successful but verification failed. Please contact support.");
                }
            },
            prefill: {
                name: user.displayName || "",
                email: user.email || "",
                contact: "" // Can be added to user profile
            },
            theme: {
                color: "#2563eb"
            }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
        setLoading(false);
    };

    if (!project) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Product Summary */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{project.description}</p>
                            <div className="flex justify-between items-center py-4 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{project.price}</span>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                                <Info size={18} className="shrink-0 mt-0.5" />
                                <p>You will get lifetime access to the source code and documentation immediately after payment.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Payment Action */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-green-500" /> Secure Payment
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Credit/Debit Card, UPI</p>
                                <p className="text-xs text-gray-500">Secured by Razorpay</p>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            By clicking below, you agree to our Terms of Service and Privacy Policy.
                        </div>

                        <Button
                            className="w-full h-14 text-lg font-bold shadow-blue-500/20 shadow-xl"
                            onClick={handlePayment}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" /> Processing...
                                </>
                            ) : (
                                `Pay ${project.price}`
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-500 font-medium">
                            <ShieldCheck size={14} />
                            100% Secure & Encrypted Transaction
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
