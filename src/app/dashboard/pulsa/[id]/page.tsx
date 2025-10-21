'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Globe, Hourglass } from 'lucide-react';
import MobileHeader from "@/component/headerMobile";
import PaymentModal from "@/component/ModalPayment";
import DesktopHeader from "@/component/headerDesktop";

interface PaketDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  image?: string;
  paket?: string;
  duration?: string;
  jenis?: string;
}

export default function PaketDetailPage() {
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [paket, setPaket] = useState<PaketDetail | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDetail() {
    const numId = Number(id)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${API_URL}/pulsa/${numId}`);
      console.log(res);
      if (!res.ok) throw new Error("Gagal mengambil detail paket");
      const data = await res.json();
      setPaket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savePaket = localStorage.getItem('user');
    if (!savePaket) {
      router.push('/login');
      return;
    }
    setPaket(JSON.parse(savePaket));
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Memuat detail paket...
      </div>
    );
  }

  if (!paket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600">Data tidak ditemukan.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <>
      <DesktopHeader/>
      <MobileHeader></MobileHeader>
      <div className="min-h-screen py-8">

        <div className=" bg-white rounded-xl shadow p-6">
          {paket.image && (
            <img
              src={paket?.image}
              alt={paket.title}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
          )}
          <h1 className="text-2xl font-bold mb-2">{paket.title}</h1>
          <p className="text-gray-700 mb-4">{paket.description}</p>

          <div className="p-2 space-y-2">
            <p className="text-lg font-bold">Rincian Paket</p>

            <div className="p-1 space-y-3">

              <div className="flex justify-between items-center">
                <div className="flex space-x-2 items-center">
                  <Globe size={20}/>
                  <span>{paket.paket} GB</span>
                </div>
                <div className="justify-self-end font-semibold">Kuota {paket.jenis}</div>
              </div>

              <div className="flex space-x-2">
                <Hourglass size={20}/>
                <span>{paket.duration}</span>
              </div>
            </div>
            <hr />
            <p className="text-lg font-semibold text-[#FF832B]">{paket.price}</p>
          </div>
          <button 
            className="p-2 rounded-xl cursor-pointer hover:bg-[#ff8935] bg-[#FF832B] w-full text-white"
            onClick={() => setShowModal(true)}>
              Beli Sekarang
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        paketId={Number(paket.id)}
        paketName={paket.title}
        price={paket.price}
      />
    </>
  );
}
