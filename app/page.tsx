import { Metadata } from "next";
import {LoginGoogleButton} from "@/components/login-button";

export default function Home() {
  return (
      <div >
        <div className="min-h-screen flex items-center">
          <div className="bg-white w-96 mx-auto rounded-sm shadow p-8">
            <h1 className="text-4xl font-medium mb-1 text-center">Sign In</h1>
            <p className="font-medium mb-5 text-gray-500 text-center">
              Silahkan login ke akun anda
            </p>
            <div className="py-4 text-center">
              <LoginGoogleButton />
            </div>
          </div>
        </div>
      </div>
  );
}
