import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, Printer } from 'lucide-react';
import { Code2 } from 'lucide-react';

const InvoicePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'orders', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setOrder({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;
    if (!order) return <div className="text-center py-20">Order not found.</div>;

    const printInvoice = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center text-gray-900 font-sans">
            <div className="bg-white max-w-3xl w-full p-12 shadow-md hover:shadow-xl transition-shadow print:shadow-none print:w-full print:max-w-none">

                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 mb-4">
                            <Code2 size={32} />
                            <span className="text-2xl font-bold tracking-tight text-gray-900">OURS</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                            123 Tech Avenue, Code City<br />
                            Silicon Valley, CA 94000<br />
                            support@ours-platform.com
                        </p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-light text-gray-300 mb-2">INVOICE</h1>
                        <p className="font-bold text-gray-700">#{order.paymentId?.slice(-8).toUpperCase() || order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-gray-500 text-sm mt-1">
                            Date: {order.createdAt?.toDate().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-12">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                    <p className="font-bold text-lg">{order.userEmail}</p>
                    {/* Add address if we had it */}
                </div>

                {/* Table */}
                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-gray-100">
                            <th className="text-left py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="text-right py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Rate</th>
                            <th className="text-right py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-50">
                            <td className="py-4">
                                <p className="font-bold">{order.projectTitle}</p>
                                <p className="text-sm text-gray-500">Lifetime Source Code License</p>
                            </td>
                            <td className="text-right py-4 text-gray-600">{order.currency} {order.amount.toFixed(2)}</td>
                            <td className="text-right py-4 font-bold">{order.currency} {order.amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Total */}
                <div className="flex justify-end mb-12">
                    <div className="w-64">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">{order.currency} {order.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Tax (0%)</span>
                            <span>{order.currency} 0.00</span>
                        </div>
                        <div className="flex justify-between py-4 text-xl font-bold text-blue-600">
                            <span>Total</span>
                            <span>{order.currency} {order.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
                    <p className="mb-4">Thank you for your business!</p>
                    <p>This is a computer-generated invoice and does not require a signature.</p>
                </div>

                {/* Print Button (Hidden in Print) */}
                <div className="mt-8 text-center print:hidden">
                    <button
                        onClick={printInvoice}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                    <p className="text-xs text-gray-400 mt-2">Use Ctrl+P (Cmd+P) to save as PDF</p>
                </div>

            </div>
        </div>
    );
};

export default InvoicePage;
