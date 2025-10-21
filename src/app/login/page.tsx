'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone.trim()) {
            setError("Nomor telepon tidak boleh kosong!");
            return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        try {
            console.log(`Fetching: ${API_URL}/users?phone=${phone}`);
            const res = await fetch(`${API_URL}/users?phone=${phone}`);
            const data = await res.json();

            if (data.length === 0) {
                setError("Nomor telepon tidak terdaftar!");
                return;
            }

            // Simpan hanya jika user valid
            localStorage.setItem("user", JSON.stringify(data[0]));
            router.push("/dashboard");
        } catch (error) {
            console.error("Gagal login:", error);
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white h-90 p-10 w-full max-w-[500px] rounded-xl shadow-md">
                <form onSubmit={handleLogin} className="flex flex-col justify-center w-full h-full">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold">Masuk</h1>
                        <h2 className="text-gray-600">Masukkan Nomor Telepon Anda</h2>
                    </div>

                    <div className="flex flex-col gap-5">
                        <input
                            type="tel"
                            placeholder="Nomor Telepon"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            className="ring p-3 rounded"
                        />
                        {error && <p className="text-red-500 text-sm mb-3 inline-block">{error}</p>}

                        <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                            Masuk
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}