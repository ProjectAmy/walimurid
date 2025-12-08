
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

export default function AuthCheck() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            if (status === "authenticated" && session?.user?.email) {
                try {
                    const res = await fetch(`${API_BASE_URL}/walimurid/check?email=${encodeURIComponent(session.user.email)}`);
                    if (res.status === 200) {
                        router.push("/dashboard");
                    } else if (res.status === 404) {
                        router.push("/register");
                    } else {
                        // Fallback for other errors, maybe still register or error page
                        console.error("Unexpected status check user:", res.status);
                        router.push("/register");
                    }
                } catch (error) {
                    console.error("Error checking user:", error);
                    // If api is down, what to do? Maybe stay here or show error? 
                    // For now, let's assume it's a network error and try to register (or show error)
                    // Showing error might be safer.
                }
            } else if (status === "unauthenticated") {
                router.push("/");
            }
        };

        checkUser();
    }, [session, status, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Memeriksa data anda...</h2>
        </div>
    );
}
