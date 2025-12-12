"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

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

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState<number | null>(null);

    // Load Snap JS sekali saja
    const loadSnapScript = () => {
        if (document.getElementById("midtrans-script")) return;

        const script = document.createElement("script");
        script.id = "midtrans-script";
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute(
            "data-client-key",
            `${API_BASE_URL}/invoices`
        );
        document.body.appendChild(script);
    };

    useEffect(() => {
        loadSnapScript();
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/invoices`
            );
            const data = await res.json();
            console.log("Invoices data:", data); // Debugging

            if (Array.isArray(data)) {
                setInvoices(data);
            } else if (data && Array.isArray(data.data)) {
                // Handle case where data is wrapped in { data: [...] }
                setInvoices(data.data);
            } else {
                console.error("Data invoices format invalid:", data);
                setInvoices([]);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setInvoices([]); // Ensure it remains an array on error
        }
        setLoading(false);
    };

    const handlePay = async (invoiceId: number) => {
        setLoadingId(invoiceId);

        try {
            const res = await fetch(
                `${API_BASE_URL}/invoices/${invoiceId}/snap-token`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data = await res.json();
            const snapToken = data.snap_token;

            if (!snapToken) {
                alert("Gagal mendapatkan token pembayaran");
                setLoadingId(null);
                return;
            }

            window.snap.pay(snapToken, {
                onSuccess: function () {
                    alert("Pembayaran berhasil!");
                    fetchInvoices();
                },
                onPending: function () {
                    alert("Menunggu pembayaran...");
                    fetchInvoices();
                },
                onError: function () {
                    alert("Pembayaran gagal");
                },
                onClose: function () {
                    console.log("Popup closed");
                },
            });
        } catch (err) {
            console.error("Payment error:", err);
        }

        setLoadingId(null);
    };

    if (loading) return <p>Loading invoice...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Daftar Invoice</h1>

            {invoices.length === 0 && <p>Tidak ada invoice ditemukan.</p>}

            {invoices.map((inv) => (
                <div
                    key={inv.id}
                    style={{
                        marginBottom: "16px",
                        padding: "12px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                    }}
                >
                    <p><b>{inv.description}</b></p>
                    <p>Nominal: Rp {inv.amount.toLocaleString()}</p>
                    <p>Status:
                        <b style={{ color: inv.status === "PAID" ? "green" : "red" }}>
                            {inv.status}
                        </b>
                    </p>

                    {inv.status !== "PAID" && (
                        <button
                            onClick={() => handlePay(inv.id)}
                            disabled={loadingId === inv.id}
                            style={{
                                background: "#0099ff",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {loadingId === inv.id ? "Memproses..." : "Bayar Sekarang"}
                        </button>
                    )}

                    {inv.status === "PAID" && (
                        <button
                            style={{
                                background: "green",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                            }}
                            disabled
                        >
                            Lunas
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
