import Image from "next/image"
import Link from "next/link"
import Navlink from "@/components/navbar/navlink"

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full bg-white shadow-sm z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
        <Link href="/" >
          <Image
            src="/LogoYiss.png"
            alt="Logo YISS"
            width={70}
            height={70}
            priority
          />
        </Link>
        <Navlink />
      </div>
    </div>
  )
}

export default Navbar
