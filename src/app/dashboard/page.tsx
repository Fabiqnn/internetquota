'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileHeader from '@/component/headerMobile';
import HorizontalCardScroll from '@/component/horizontalCardScroll';
import DesktopHeader from '@/component/headerDesktop';

interface PulsaItem {
    id: number;
    title: string;
    price: string;
    image?: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [pulsaItems, setPulsaItem] = useState<PulsaItem[]>([]);
    const router = useRouter();

    async function fetchData() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        try {
            const res = await fetch(`${API_URL}/pulsa`);
            const data = await res.json();
            setPulsaItem(data);
        } catch (err) {
            console.error("Data tidak dapat diakses")
        }

    }

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
            router.push("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(savedUser);
            if (!parsedUser || !parsedUser.phone) {
                localStorage.removeItem("user");
                router.push("/login");
                return;
            }
            console.log("Saved user:", savedUser);
            setUser(parsedUser);
            fetchData();
        } catch (err) {
            console.error("User data corrupted:", err);
            localStorage.removeItem("user");
            router.push("/login");
        }
    }, [router]);

    return (
        <>
            <DesktopHeader/>
            <MobileHeader></MobileHeader>
            <div className="min-h-screen p-10 ">
                <h1 className='font-bold text-xl'>Paket Harian</h1>
                <HorizontalCardScroll items={pulsaItems}></HorizontalCardScroll>
            </div>
        </>
    );
}
