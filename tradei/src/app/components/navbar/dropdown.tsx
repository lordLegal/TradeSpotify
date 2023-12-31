"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

import { AiOutlineHome } from 'react-icons/ai'
import { FcStatistics } from 'react-icons/fc'
import { FaExchangeAlt } from 'react-icons/fa'


export default function DropdownMenu({
    params,
}: {
    params: { user: any, coins: string };
}) {
    const user = params.user;
    const coins = params.coins;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="relative h-10 w-10 mr-10">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 cursor-pointer h-full w-full" aria-haspopup="true" aria-expanded={dropdownOpen}>
                <Image width='40' height='40' src={user?.image as string} alt="Account" className="rounded-full h-full w-full"></Image>
                <span className="text-white text-lg font-semibold hover:text-gray-200">{user?.name}</span>
            </button>

            {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-green-700 ring-1 ring-black ring-opacity-5 font-bold text-base " role="menu">
                    <div role="menuitem">
                        <div className="  flex flex-col md:hidden  px-4 py-2 ">

                            <Link href="/" className="flex flex-row items-center justify-start text-white  font-bold "><AiOutlineHome className="mr-2 stroke-2" />Home</Link>
                            <Link href="/statics" className="flex flex-row items-center justify-start text-white  font-bold "><FcStatistics className="mr-2 stroke-2" />Statistics</Link>
                            <Link href="/trade" className="flex flex-row items-center justify-start text-white  font-bold "><FaExchangeAlt className="mr-2 stroke-1" />Trade</Link>
                        </div>
                        <hr className="block md:hidden"></hr>
                        <p className="block px-4 py-2 text-sm text-white hover:text-gray-200 hover:bg-green-700 " >Coins: <span className="font-bold">{coins}</span></p>
                        <hr className="block"></hr>
                        <Link href="/api/auth/signout" className="block px-4 py-2 text-sm text-white hover:text-gray-200 hover:bg-green-700">Logout</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
