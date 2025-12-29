"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { API_BASE_URL } from "@/lib/constants";
import { FiUser, FiCalendar, FiBook, FiAward, FiAlertCircle, FiBookmark } from "react-icons/fi";
import { clsx } from "clsx";

interface Student {
    id: number;
    fullname: string;
    nis: string;
    classroom_name?: string; // Adjust based on actual API response
    grade?: string;
    status?: string;
    photo_url?: string;
}

export default function StudentPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            fetchStudents();
        } else if (status === "unauthenticated") {
            // Optional: redirect or just let it be handled by middleware/layout
            window.location.href = "/login";
        }
    }, [status]);

    const getToken = () => {
        // @ts-ignore
        return session?.user?.backendToken;
    };

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_BASE_URL}/students`, {
                headers: headers
            });

            if (!res.ok) {
                if (res.status === 401) {
                    window.location.href = "/login"; // Redirect if unauthorized
                    return;
                }
                throw new Error(`Gagal mengambil data (${res.status})`);
            }

            const data = await res.json();

            // Handle various likely response structures
            if (Array.isArray(data)) {
                setStudents(data);
            } else if (data && Array.isArray(data.data)) {
                setStudents(data.data);
            } else {
                setStudents([]);
            }
        } catch (error: any) {
            console.error("Error fetching students:", error);
            setError(error.message || "Terjadi kesalahan saat memuat data.");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl w-full mx-auto px-4 py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <FiAlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchStudents}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Siswa</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Daftar siswa yang berada di bawah asuhan Anda.</p>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.length === 0 ? (
                    <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center bg-gray-50 rounded-full mb-4">
                            <FiUser className="w-6 h-6" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada siswa</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Belum ada data siswa yang terhubung dengan akun Anda.
                        </p>
                    </div>
                ) : (
                    students.map((student) => (
                        <div
                            key={student.id}
                            className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                                <div className="absolute -bottom-10 left-6">
                                    <div className="w-20 h-20 rounded-xl bg-white p-1 shadow-md">
                                        {student.photo_url ? (
                                            <img
                                                src={student.photo_url}
                                                alt={student.fullname}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                <FiUser className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-12 p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                    {student.fullname}
                                </h3>

                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <div className="w-8 flex-shrink-0 text-center text-indigo-500">
                                            <FiAward className="w-4 h-4 mx-auto" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-500">Nomor Induk</p>
                                            <p className="font-medium">{student.nis}</p>
                                        </div>
                                    </div>

                                    {student.classroom_name && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <div className="w-8 flex-shrink-0 text-center text-purple-500">
                                                <FiBook className="w-4 h-4 mx-auto" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">Kelas</p>
                                                <p className="font-medium">{student.classroom_name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {student.grade && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <div className="w-8 flex-shrink-0 text-center text-orange-500">
                                                <FiBookmark className="w-4 h-4 mx-auto" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">Kelas</p>
                                                <p className="font-medium">{student.grade}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Additional info placeholders if needed */}
                                    {student.status && (
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <div className="w-8 flex-shrink-0 text-center text-green-500">
                                                <FiCheckCircle className="w-4 h-4 mx-auto" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">Status</p>
                                                <span className={clsx(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                                    student.status === 'Active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                )}>
                                                    {student.status}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Helper icon
function FiCheckCircle(props: any) {
    return <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
}
