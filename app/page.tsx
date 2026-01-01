import { Metadata } from "next";
import Image from "next/image";
import { LoginGoogleButton } from "@/components/login-button";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // if (session) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="bg-white w-96 mx-auto rounded-sm shadow p-8 my-8">
        {session && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">
            Debug: Session Detected on Page (Server Component).
            <br />triggered: {session.user?.email}
          </div>
        )}
        <div className="flex justify-center mb-4">
          <Image
            src="/LogoYiss.png"
            alt="Logo YISS"
            width={200}
            height={200}
            className="w-auto h-auto"
            priority
          />
        </div>
        <h1 className="text-4xl font-medium mb-1 text-center">Wali Murid</h1>
        <p className="font-medium mb-5 text-gray-500 text-center">
          Silahkan login ke akun anda
        </p>
        <div className="py-4 text-center">
          <LoginGoogleButton />
        </div>
      </div>
    </div>
  );
}
