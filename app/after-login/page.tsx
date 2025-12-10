import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { API_BASE_URL } from "@/lib/constants";

export default async function AfterLogin() {
    const session = await auth();

    if (!session?.user?.email) {
        return redirect("/");
    }

    // @ts-ignore
    const googleToken = session.user.id_token;

    const res = await fetch(`${API_BASE_URL}/walimurid/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            google_token: googleToken,
        }),
    });

    if (res.status === 200) {
        return redirect("/dashboard");
    }

    if (res.status === 404) {
        return redirect("/register");
    }

    // fallback kalau API error
    return (
        <div className="p-10 text-center">
            <h1>Terjadi Kesalahan</h1>
            <p>Silakan coba beberapa saat lagi.</p>
        </div>
    );
}
