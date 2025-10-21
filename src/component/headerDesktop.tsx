'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { History, MessageCircleQuestionMark, SearchSlash, LogOut } from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: "Riwayat", href: "/dashboard/history", icon: <History size={18} /> },
    { label: "Tentang", href: "/about", icon: <SearchSlash size={18} /> },
    { label: "Bantuan", href: "/contact", icon: <MessageCircleQuestionMark size={18} /> },
];

const DesktopHeader: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <header className="hidden md:flex items-center justify-between bg-white shadow-md px-10 py-4 sticky top-0 z-50">
            <Link href="/dashboard" className="font-bold text-2xl text-[#1192e8]">
                buyMe
            </Link>

            <nav className="flex items-center space-x-8">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors  cursor-pointer"
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                ))}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
                >
                    <LogOut size={18} />
                    Keluar
                </button>
            </nav>

        </header>
    );
};

export default DesktopHeader;
