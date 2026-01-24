import Image from "next/image";
import { LoginGoogleButton } from "@/components/login-button";


export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams.error;

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="bg-white w-96 mx-auto rounded-sm shadow p-8 my-8">

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

        {error === "EmailTidakTerdaftar" && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Login Gagal!</strong>
            <span className="block sm:inline"> Email anda tidak terdaftar.</span>
          </div>
        )}

        <div className="py-4 text-center">
          <LoginGoogleButton />
        </div>
      </div>
    </div>
  );
}
