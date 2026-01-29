"use client";

import { useState, useEffect } from "react";
import { FiCreditCard, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "@/lib/constants";
import { clsx } from "clsx";

declare global {
    interface Window {
        snap: any;
    }
}

interface Invoice {
    id: number;
    description: string;
    amount: number;
    status: string;
}

interface InvoiceCardProps {
    invoice: Invoice;
    token: string;
    onPaymentSuccess?: () => void;
}

export default function InvoiceCard({ invoice, token, onPaymentSuccess }: InvoiceCardProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const scriptId = "midtrans-script";
        if (document.getElementById(scriptId)) return;

        const script = document.createElement("script");
        script.id = scriptId;
        const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
        script.src = isProduction
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
        document.body.appendChild(script);
    }, []);

    const handlePay = async () => {
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/invoices/${invoice.id}/snap-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const data = await res.json();
            const snapToken = data.snap_token;

            if (!snapToken) {
                alert("Gagal mendapatkan token pembayaran");
                setLoading(false);
                return;
            }

            window.snap.pay(snapToken, {
                onSuccess: function () {
                    onPaymentSuccess?.();
                    setLoading(false);
                },
                onPending: function () {
                    onPaymentSuccess?.();
                    setLoading(false);
                },
                onError: function () {
                    alert("Pembayaran gagal");
                    setLoading(false);
                },
                onClose: function () {
                    setLoading(false);
                },
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const isPaid = ["PAID", "SETTLED"].includes(invoice.status.toUpperCase());
    const isUnpaid = invoice.status.toUpperCase() === "UNPAID";
    const isPending = invoice.status.toUpperCase() === "PENDING";

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className={clsx(
                    "p-4 rounded-xl flex-shrink-0",
                    isPaid ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" :
                        isPending ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" :
                            isUnpaid ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                                "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                )}>
                    {isPaid ? <FiCheckCircle className="w-8 h-8" /> :
                        isPending ? <FiClock className="w-8 h-8" /> :
                            isUnpaid ? <FiCreditCard className="w-8 h-8" /> :
                                <FiAlertCircle className="w-8 h-8" />
                    }
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-tight">{invoice.description}</h3>
                    <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">Rp {invoice.amount.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex flex-col items-end gap-3 min-w-[160px]">
                <span className={clsx(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                    isPaid ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400" :
                        isPending ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400" :
                            isUnpaid ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400" :
                                "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                )}>
                    {invoice.status}
                </span>

                {!isPaid && (
                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses
                            </>
                        ) : "Bayar Sekarang"}
                    </button>
                )}
            </div>
        </div>
    );
}
