
import { auth } from "@/auth";
import { API_BASE_URL } from "@/lib/constants";
import InvoiceCard from "@/components/invoice-card";

interface Invoice {
    id: number;
    description: string;
    amount: number;
    status: string;
}

export default async function Dashboard() {
    const session = await auth();

    // @ts-ignore
    const userProfile = session?.user?.walimurid_profile;
    // @ts-ignore
    const token = session?.user?.backendToken;

    let unpaidInvoices: Invoice[] = [];
    try {
        const res = await fetch(`${API_BASE_URL}/invoices`, {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { revalidate: 30 }
        });
        const data = await res.json();
        const invoices: Invoice[] = Array.isArray(data) ? data : (data?.data || []);
        unpaidInvoices = invoices.filter(i => i.status === "UNPAID");
    } catch (error) {
        console.error("Failed to fetch invoices", error);
    }

    let greetingName = session?.user?.name;
    if (userProfile?.shortname) {
        greetingName = userProfile.call_name
            ? `${userProfile.call_name} ${userProfile.shortname}`
            : userProfile.shortname;
    }

    return (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                    </div>
                    <h1 className="text-3xl text-gray-900 dark:text-white mb-2 font-bold font-display">
                        Ahlan wa Sahlan, {greetingName}!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
                        Selamat datang di portal wali murid Yayasan Islam Syarif Syahid. Pantau administrasi dan perkembangan siswa dengan mudah di sini.
                    </p>
                </div>

                {/* Invoices Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Informasi Tagihan
                            {unpaidInvoices.length > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                    Penting
                                </span>
                            )}
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-800">
                        {unpaidInvoices.length > 0 ? (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                    <p className="font-semibold text-lg">
                                        Ada {unpaidInvoices.length} invoice yang belum terbayar
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {unpaidInvoices.map((inv) => (
                                        <InvoiceCard key={inv.id} invoice={inv} token={token || ""} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-green-600 dark:text-green-400 py-2">
                                <svg className="w-6 h-6 border-2 border-current rounded-full p-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <p className="font-semibold text-lg">Tidak ada invoice baru</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
