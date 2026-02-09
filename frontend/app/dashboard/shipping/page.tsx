'use client';

import React, { useState, useEffect } from 'react';

interface ShippingSetting {
  _id: string;
  areaName: string;
  keywords: string[];
  distanceKm: number;
  shippingFee: number;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

export default function ShippingSettingsPage() {
  const [settings, setSettings] = useState<ShippingSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Placeholder - shipping settings API belum tersedia
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-4">Memuat pengaturan ongkir...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pengaturan Ongkir</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
        <p className="font-medium mb-2">📦 Fitur Pengaturan Ongkir</p>
        <p className="text-sm">
          Halaman ini akan menampilkan pengaturan ongkos kirim berdasarkan area pengiriman.
          Saat ini menggunakan pengaturan default dari backend.
        </p>
      </div>

      <div className="mt-6 bg-white border rounded-lg p-4">
        <h2 className="font-semibold mb-3">Aturan Ongkir Saat Ini:</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Rembang Kota:</strong> Gratis ongkir (dalam radius 3 km dari toko)</li>
          <li>• <strong>Luar Kota:</strong> Rp 10.000</li>
          <li>• Semua area bisa menggunakan COD atau Transfer DANA</li>
        </ul>
      </div>
    </div>
  );
}