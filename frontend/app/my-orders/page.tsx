'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cancelMyOrder, getMyOrders } from '@/lib/api';

type Order = {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  items: { name: string; unit: string; price: number; quantity: number }[];
};

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(v);

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e.message || 'Gagal memuat pesanan');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id: string) => {
    setErr(null);
    try {
      const updated = await cancelMyOrder(id);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch (e: any) {
      setErr(e.message || 'Gagal membatalkan');
    }
  };

  if (loading) return <div className="p-4">Memuat pesanan saya...</div>;

  const unauthorized =
    (err || '').toLowerCase().includes('unauthorized') ||
    (err || '').toLowerCase().includes('akses') ||
    (err || '').toLowerCase().includes('token');

  if (unauthorized) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm font-semibold">Silakan login untuk melihat pesanan.</div>
          <div className="mt-3">
            <Link
              href="/login"
              className="inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Pesanan Saya</h1>
        <button onClick={load} className="rounded-lg border px-3 py-2 text-xs">
          Refresh
        </button>
      </div>

      {err && <div className="mb-3 text-xs text-red-600">{err}</div>}

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="rounded-xl border bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">
                #{o._id}{' '}
                {o.createdAt ? (
                  <span className="text-xs font-normal text-gray-500">
                    {new Date(o.createdAt).toLocaleString('id-ID')}
                  </span>
                ) : null}
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                {o.status}
              </span>
            </div>

            <div className="mt-2 text-xs">
              <ul className="list-disc pl-5">
                {(o.items || []).map((it, idx) => (
                  <li key={idx}>
                    {it.name} — {it.quantity} x {formatPrice(it.price)} / {it.unit}
                  </li>
                ))}
              </ul>

              <div className="mt-2 font-semibold">
                Total: {formatPrice(o.totalAmount)}
              </div>
            </div>

            {o.status === 'pending' && (
              <button
                onClick={() => cancel(o._id)}
                className="mt-3 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white"
              >
                Batalkan Pesanan
              </button>
            )}
          </div>
        ))}

        {!orders.length && (
          <div className="text-sm text-gray-600">Belum ada pesanan.</div>
        )}
      </div>
    </div>
  );
}