"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { AiOutlineHome } from 'react-icons/ai'
import { LiaStackExchange } from 'react-icons/lia'
import { FaExchangeAlt } from 'react-icons/fa'

export default function Sidebar({
    params,
}: {
    params: { user: any, coins: string, session: any };
}) {
    const user = params.user;
    const coins = params.coins;
    const session = params.session;
    

    const [isVisible, setIsVisible] = useState(true);

    return (
        <>
            {/* Open Sidebar Button (only visible when sidebar is closed) */}
            <button
                onClick={() => setIsVisible(true)}
                className={` mt-20 fixed top-4 left-4 z-50 bg-green-900 text-white p-2 rounded ${isVisible ? 'hidden' : 'block'}`}
            >
                <FiArrowRight />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed w-64 h-screen bg-green-700 p-4 transform transition-transform duration-300 ${isVisible ? 'translate-x-0' : '-translate-x-64'}`}
            >
                <div className="flex flex-col justify-center items-center text-white">
                    {/* Close Sidebar Button */}
                    <button type='button' title='Close'
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 bg-green-900 text-white p-2 rounded"
                    >
                        <FiArrowLeft />
                    </button>

                    <Image width='1000' height='1000' src={user?.image as string} alt="Account" className="h-24 w-24 rounded-full"></Image>
                    <p className="font-bold text-3xl">{session?.user?.name}</p>
                    <p className="text-xl">Coins: <span className="font-bold">{coins}</span></p>
                    <div className='w-full items-start justify-start' >

                        <Link href="/trade" className="flex flex-row items-center justify-start text-white text-xl font-bold mt-4"><FaExchangeAlt className="mr-2" />Trade</Link>
                        <Link href="/trade/portfolio" className="flex flex-row items-center justify-start text-white text-xl font-bold mt-4"><LiaStackExchange className="mr-2" />Portfolio</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
