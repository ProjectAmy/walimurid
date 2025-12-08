
import { auth } from "@/auth";

export default async function Dashboard() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-xl font-bold">
                                Wali Murid Dashboard
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                {session?.user?.image && (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                                    />
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                    {session?.user?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Welcome Card */}
                    <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Selamat Datang, {session?.user?.name}!
                        </h1>
                        <p className="text-gray-500">
                            Berikut adalah ringkasan aktivitas siswa Anda hari ini.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Kehadiran</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">95%</p>
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <span>+2%</span> <span className="text-gray-400">dari bulan lalu</span>
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Tugas</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">12</p>
                        <p className="text-sm text-gray-500 mt-2">
                            4 tugas perlu dikumpulkan
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="font-semibold text-gray-900">Nilai Rata-rata</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">88.5</p>
                        <p className="text-sm text-green-600 mt-2">
                            Sangat Baik
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
