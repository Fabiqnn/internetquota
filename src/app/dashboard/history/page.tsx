'use client';

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Wallet, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import MobileHeader from "@/component/headerMobile";
import DesktopHeader from "@/component/headerDesktop";

interface User {
  id: number;
  name: string;
  phone: string;
  activePackageId?: number | string | null;
}

interface Transaction {
  id: number;
  userId: number;
  paketName: string;
  price: string;
  paymentMethod: string;
  status: "berhasil" | "pending" | "gagal";
  date: string;
}

interface Paket {
  id: number;
  title: string;
}

export default function TransactionHistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [activePaket, setActivePaket] = useState<Paket | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  async function fetchTransactions(userId: number) {
    try {
      const res = await fetch(`${API_URL}/transactions?userId=${userId}`);
      if (!res.ok) throw new Error("Gagal memuat riwayat transaksi");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPaket(paketId: number) {
    try {
      const res = await fetch(`${API_URL}/pulsa/${paketId}`);
      if (!res.ok) throw new Error("Gagal memuat riwayat paket");
      const data = await res.json();
      setActivePaket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchUser(userId: number) {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`);
      if (!res.ok) throw new Error("Gagal memuat user");
      const data = await res.json();
      setUser(data);

      if (data.activePackageId) {
        fetchPaket(data.activePackageId)
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const localUser = JSON.parse(savedUser);
    fetchUser(localUser.id)
    fetchTransactions(localUser.id).finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Memuat riwayat transaksi...</p>
      </div>
    );
  }

  return (
    <>
      <DesktopHeader/>
      <MobileHeader/>

      <div className="bg-white rounded-xl shadow p-4 mx-6 mt-4">
        <p className="font-semibold text-lg">{user?.name}</p>
        <p className="text-gray-600 text-lg">{user?.phone}</p>
        {activePaket ? (
          <div className="bg-blue-50 border border-blue-300 rounded-xl shadow p-4 mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe color="#2b7efe" />
              <div>
                <p className="font-semibold">{activePaket.title}</p>
                <p className="text-sm text-gray-600">Paket aktif saat ini</p>
              </div>
            </div>
            {/* <p className="text-blue-600 font-medium">{activePaket.price}</p> */}
          </div>
        ) : (
          <div className="bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl shadow p-4 mt-4">
            Tidak ada paket aktif.
          </div>
        )}
      </div>


      <div className="min-h-screen mx-6 rounded-xl bg-gray-50 p-6 mt-5">
        <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((trx) => (
              <div
                key={trx.id}
                className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
              >
                {/* Kiri */}
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Wallet size={20} color="#2b7efe" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">{trx.paketName}</h2>
                    <p className="text-sm text-gray-500">{trx.paymentMethod}</p>
                    <p className="text-sm text-gray-400">{trx.date}</p>
                  </div>
                </div>

                {/* Kanan */}
                <div className="text-right">
                  <p className="font-bold text-blue-600">{trx.price}</p>
                  <StatusBadge status={trx.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: "berhasil" | "pending" | "gagal" }) {
  const baseClass =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold";

  switch (status) {
    case "berhasil":
      return (
        <span className={`${baseClass} bg-green-100 text-green-700`}>
          <CheckCircle2 size={12} className="mr-1" /> Berhasil
        </span>
      );
    case "pending":
      return (
        <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>
          <Clock size={12} className="mr-1" /> Pending
        </span>
      );
    case "gagal":
      return (
        <span className={`${baseClass} bg-red-100 text-red-700`}>
          <XCircle size={12} className="mr-1" /> Gagal
        </span>
      );
  }
}
