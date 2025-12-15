import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./navbar/navbar";

const Header = async () => {
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
                        <span className="text-xl text-gray-900 font-medium">
                            Wali Murid
                        </span>
                    </div>

                    {/* Conditional Navbar (Menu & Profile) */}
                    {session?.user && <Navbar session={session} />}
                </div>
            </div>
        </nav>
    );
};

export default Header;
