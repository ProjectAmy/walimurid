"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

export default function Register() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "", // Keep for display
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (session?.user) {
            setFormData((prev) => ({
                ...prev,
                fullname: session.user?.name || "",
                email: session.user?.email || "",
            }));
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // @ts-ignore - session type is extended in auth.ts but typescript might not know it here without global declaration
            const google_token = session?.user?.id_token;

            if (!google_token) {
                alert("Authentication error: Missing Google token.");
                return;
            }

            const payload = {
                google_token,
                fullname: formData.fullname,
                phone: formData.phone,
                address: formData.address,
            };

            const url = `${API_BASE_URL}/auth/register`;
            console.log("Sending payload to:", url, payload);

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                const errorData = await res.json().catch(() => null);
                console.error("Registration failed response:", res.status, errorData);
                alert(`Registration failed: ${errorData?.message || "Unknown error"} (Status: ${res.status}). Check console for details.`);
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading")
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                Loading...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Lengkapi Data Anda
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Silahkan lengkapi data diri anda untuk melanjutkan
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="fullname"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nama Lengkap
                            </label>
                            <div className="mt-1">
                                <input
                                    id="fullname"
                                    name="fullname"
                                    type="text"
                                    required
                                    value={formData.fullname}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fullname: e.target.value })
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    readOnly
                                    value={formData.email}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nomor Handphone (WhatsApp)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    required
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    placeholder="081234567890"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Alamat
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="address"
                                    name="address"
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
