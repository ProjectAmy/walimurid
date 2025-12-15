
import { auth, signOut } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import Navlink from "./navlink";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-4">

          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/LogoYiss.png"
                alt="Logo YISS"
                width={50}
                height={50}
                priority
                className="w-auto h-12"
              />
            </Link>
            <span className="hidden md:block text-xl text-gray-900">
              Wali Murid
            </span>
          </div>

          {/* Navigation Links */}
          <Navlink />

          {/* User Profile and Sign Out */}
          {session?.user && (
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 leading-none">
                    {session?.user?.name}
                  </span>
                  <span className="text-xs text-gray-500">Wali Murid</span>
                </div>
              </div>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
