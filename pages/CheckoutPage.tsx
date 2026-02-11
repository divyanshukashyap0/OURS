import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById } from '../lib/projects';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/config';
import Button from '../components/ui/Button';
import { ShieldCheck, CreditCard, Lock, Loader2, Info, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs, updateDoc, doc, increment, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendEmail } from '../lib/emailService';

const CheckoutPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState<any>(null);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [verifyingCoupon, setVerifyingCoupon] = useState(false);
    const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Derived State
    const originalPrice = project ? parseFloat(project.price.replace(/[^0-9.]/g, '') || '0') : 0;
    const isStudentEligible = user?.studentStatus === 'verified' && project?.isStudentFree;
    const finalPrice = isStudentEligible ? 0 : Math.max(0, originalPrice - discount);

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                const found = await getProjectById(id);
                if (found) {
                    setProject(found);
                } else {
                    navigate('/projects');
                }
            }
        };
        fetchProject();
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

        // Student Free Bypass
        if (finalPrice === 0 && isStudentEligible) {
            try {
                // Create Order Record in Firestore directly
                await addDoc(collection(db, 'orders'), {
                    userId: user.uid,
                    userEmail: user.email,
                    projectId: String(project.id),
                    projectTitle: project.title,
                    amount: 0,
                    currency: 'USD',
                    status: 'paid', // Auto-paid
                    paymentId: 'student_free_' + Date.now(),
                    createdAt: serverTimestamp(),
                    isStudentFreeRedemption: true
                });

                // Send Email
                await sendEmail(user.email || '', 'order_confirmation', {
                    name: user.displayName || 'Student',
                    amount: '0.00',
                    projectTitle: project.title,
                    orderId: 'STUDENT-FREE'
                });

                navigate('/order-success', {
                    state: {
                        paymentId: 'STUDENT_FREE_ACCESS',
                        projectTitle: project.title
                    }
                });
                return;
            } catch (err) {
                console.error("Student redemption error:", err);
                alert("Failed to redeem student offer.");
                setLoading(false);
                return;
            }
        }

        // 2. Create Order via Backend
        let order;

        try {
            const response = await fetch(`${API_BASE_URL}/api/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalPrice,
                    currency: 'USD',
                    // Shorten receipt ID to max 40 chars. 
                    // rcpt_ + 8 chars of timestamp + _ + 4 chars random = ~18 chars
                    receipt: `rcpt_${Date.now().toString().slice(-8)}_${Math.floor(Math.random() * 10000)}`
                })
            });

            // Robustly handle response
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                order = await response.json();
            } else {
                // Not JSON (likely HTML error page from 500/502/404)
                const text = await response.text();
                console.error("Non-JSON Response:", text);
                throw new Error(`Server returned status ${response.status} (Check console for details).`);
            }

            if (!response.ok) throw new Error(order.error || `Server Error: ${response.status}`);
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
                                amount: finalPrice, // Save original USD amount
                                currency: 'USD',
                                discountApplied: discount,
                                couponCode: appliedCoupon?.code || null
                            }
                        })
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.status === 'success') {
                        // Increment Coupon Usage
                        if (appliedCoupon) {
                            const couponRef = doc(db, 'coupons', appliedCoupon.id);
                            await updateDoc(couponRef, { usedCount: increment(1) });
                        }

                        // Send Confirmation Email
                        await sendEmail(user.email || '', 'order_confirmation', {
                            name: user.displayName || 'Customer',
                            amount: finalPrice.toFixed(2),
                            projectTitle: project.title,
                            orderId: order.id
                        });

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

    const handleVerifyCoupon = async () => {
        if (!couponCode.trim()) return;
        setVerifyingCoupon(true);
        setCouponMessage(null);

        try {
            const q = query(collection(db, 'coupons'), where('code', '==', couponCode.toUpperCase()), where('isActive', '==', true));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setCouponMessage({ type: 'error', text: 'Invalid coupon code.' });
                setDiscount(0);
                setAppliedCoupon(null);
            } else {
                const couponData = snapshot.docs[0].data();
                const couponId = snapshot.docs[0].id;

                // Check Expiry
                if (new Date(couponData.validUntil) < new Date()) {
                    setCouponMessage({ type: 'error', text: 'Coupon expired.' });
                    setVerifyingCoupon(false);
                    return;
                }

                // Check Usage Limit
                if (couponData.usedCount >= couponData.usageLimit) {
                    setCouponMessage({ type: 'error', text: 'Coupon usage limit reached.' });
                    setVerifyingCoupon(false);
                    return;
                }

                // Calculate Discount
                const originalPrice = parseFloat(project?.price.replace(/[^0-9.]/g, '') || '0');
                let discountAmount = 0;

                if (couponData.discountType === 'percentage') {
                    discountAmount = (originalPrice * couponData.discountValue) / 100;
                } else {
                    discountAmount = couponData.discountValue;
                }

                // Cap discount at total price
                discountAmount = Math.min(discountAmount, originalPrice);

                setDiscount(discountAmount);
                setAppliedCoupon({ ...couponData, id: couponId });
                setCouponMessage({ type: 'success', text: `Coupon applied! You saved $${discountAmount.toFixed(2)}` });
            }
        } catch (error) {
            console.error("Coupon verify error:", error);
            setCouponMessage({ type: 'error', text: 'Error verifying coupon.' });
        } finally {
            setVerifyingCoupon(false);
        }
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
                                {discount > 0 ? (
                                    <div className="text-right">
                                        <span className="text-sm text-gray-400 line-through mr-2">${originalPrice.toFixed(2)}</span>
                                        <span className="text-2xl font-bold text-green-600">${finalPrice.toFixed(2)}</span>
                                    </div>
                                ) : isStudentEligible ? (
                                    <div className="text-right">
                                        <span className="text-sm text-gray-400 line-through mr-2">${originalPrice.toFixed(2)}</span>
                                        <span className="text-2xl font-bold text-green-600">FREE</span>
                                        <div className="text-xs text-blue-600 font-medium mt-1">Student Benefit Unlocked!</div>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">${originalPrice.toFixed(2)}</span>
                                )}
                            </div>

                            {/* Coupon Input */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Have a coupon?</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter code"
                                        disabled={!!appliedCoupon}
                                        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-mono"
                                    />
                                    {appliedCoupon ? (
                                        <Button variant="secondary" onClick={() => { setAppliedCoupon(null); setDiscount(0); setCouponCode(''); setCouponMessage(null); }}>
                                            Remove
                                        </Button>
                                    ) : (
                                        <Button variant="outline" onClick={handleVerifyCoupon} disabled={!couponCode || verifyingCoupon}>
                                            {verifyingCoupon ? 'Checking...' : 'Apply'}
                                        </Button>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {couponMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`text-sm mt-2 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
                                        >
                                            {couponMessage.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
                            ) : isStudentEligible ? (
                                "Claim for Free"
                            ) : (
                                `Pay $${finalPrice.toFixed(2)}`
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
