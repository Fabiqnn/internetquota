'use client';

import React, { useState } from "react";
import { X, CreditCard, Wallet, Smartphone } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paketId: number;
  paketName?: string;
  price?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, paketName, price, paketId }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  if (!isOpen) return null;

  const paymentMethods = [
    { id: "gpay", label: "Google Pay", icon: <CreditCard size={18} color="#2b7efe" /> },
    { id: "dana", label: "DANA", icon: <Wallet size={18} color="#0A74DA" /> },
    { id: "spay", label: "ShopeePay", icon: <Smartphone size={18} color="#EF4A25" /> },
    { id: "ovo", label: "OVO", icon: <Wallet size={18} color="#6B3FA0" /> },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!user) {
      alert("User tidak ditemukan. Silahkan login ulang");
      return;
    }

    const newTransaction = {
      userId: Number(user.id),
      paketId, 
      paketName,
      price,
      paymentMethod: selectedMethod.toUpperCase(),
      status: "berhasil",
      date: new Date().toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta"}),
    };

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify(newTransaction)
      });

      if (!res.ok) throw new Error("Gagal menyimpan transaksi");

      await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({ activePackageId: paketId})
      });
      
      alert(`Pembayaran berhasil disimpan untuk ${user.name}`);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan transaksi");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal Card */}
      <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative animate-fadeIn">
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={20} />
        </button>

        {/* Judul */}
        <h2 className="text-xl font-semibold mb-2">Konfirmasi Pembayaran</h2>
        <p className="text-gray-600 text-sm mb-4">Pilih metode pembayaran untuk melanjutkan.</p>

        {/* Detail Paket */}
        <div className="border rounded-lg p-3 mb-4 bg-gray-50">
          <h3 className="font-semibold">{paketName}</h3>
          <p className="text-blue-600 font-medium">{price}</p>
        </div>

        {/* Pilihan Metode */}
        <div className="flex flex-col space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex items-center justify-between border rounded-lg p-3 transition ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                {method.icon}
                <span className="font-medium">{method.label}</span>
              </div>
              <input
                type="radio"
                checked={selectedMethod === method.id}
                onChange={() => setSelectedMethod(method.id)}
                className="accent-blue-500"
              />
            </button>
          ))}
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedMethod}
            className="px-4 py-2 disabled:bg-gray-200 disabled:text-gray-700 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
