"use client";

import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";
import { useState } from "react";
import clsx from "clsx";

const Navlink = () => {
    const [open, setOpen] = useState(false);
  return (
    <>
        <button onClick={()=>setOpen(!open)} className='inline-flex items-center p-2 justify-center text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100'>
            {!open ? <IoMenu className="size-8" /> : <IoClose className="size-8" />}
        </button>
        <div className={clsx("w-full md:block md:w-auto", { "hidden": !open })}>
            <ul className="flex flex-col text-sm upparcase p-4 mt-4 rounded-sm bg-gray-50 md:flex-row md:items-center md:space-x-10 md:p-0 md:mt-0 md:border-0 md:bg-white">
                <li>
                    <Link href="/dashboard" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0">
                        Dasboard
                    </Link>
                </li>
                <li>
                    <Link href="/murid" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0">
                        Murid
                    </Link>
                </li>
                <li>
                    <Link href="/invoices" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0">
                        Invoice
                    </Link>
                </li>
                <li>
                    <Link href="/about" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded-sm md:hover:bg-transparent md:p-0">
                        About
                    </Link>
                </li>
            </ul>
        </div>
    </>
  )
}

export default Navlink
