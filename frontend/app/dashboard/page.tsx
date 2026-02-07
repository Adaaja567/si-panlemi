'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { fetchAdminOrders, fetchProducts, fetchSuperAdminAnalytics } from '@/lib/api';

type OrderItem = { name: string; price: number; quantity: number; unit: string };
type Order = {
  _id: string;
  status: string;
  paymentStatus?: 'paid' | 'unpaid';
  paidAt?: string | null;
  createdAt?: string;
  paymentMethod?: 'transfer_bank' | 'e_wallet' | 'cod' | string;
  totalAmount?: number;
  items: OrderItem[];
};

function getRole(): string | null {
  try {
    const u = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return u?.role || null;
  } catch {
    return null;
  }
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

function todayKeyUTC() {
  // backend series pakai YYYY-MM-DD dari paidAt; aman pakai UTC key biar match
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardHome() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productsCount, setProductsCount] = useState<number>(0);

  const [analytics, setAnalytics] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const role = useMemo(() => (typeof window !== 'undefined' ? getRole() : null), []);

  const load = async () => {
    setErr(null);
    setLoading(true);

    try {
      const [ordersData, productsData] = await Promise.all([
        fetchAdminOrders(),
        fetchProducts().catch(() => []), // kalau produk public gagal, tetap jalan
      ]);

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProductsCount(Array.isArray(productsData) ? productsData.length : 0);

      // analytics hanya untuk super_admin
      if (role === 'super_admin') {
        const a = await fetchSuperAdminAnalytics(30);
        setAnalytics(a);
      } else {
        setAnalytics(null);
      }
    } catch (e: any) {
      setErr(e.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const computed = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'menunggu').length;

    // anggap paid jika paymentStatus paid atau status paid (fallback)
    const paidOrders = orders.filter((o) => o.paymentStatus === 'sudah_bayar' || o.status === 'dibayar');

    // hitung barang terjual = total qty dari order paid
    const totalItemsSold = paidOrders.reduce((sum, o) => {
      const itemsQty = (o.items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0);
      return sum + itemsQty;
    }, 0);

    // hari ini (UTC) supaya cocok dengan series backend
    const today = todayKeyUTC();

    const paidToday = paidOrders.filter((o) => {
      const key = (o.paidAt ? String(o.paidAt).slice(0, 10) : null) || (o.createdAt ? String(o.createdAt).slice(0, 10) : null);
      return key === today;
    });

    const cashInvoicesToday = paidToday.filter((o) => o.paymentMethod === 'cod').length;

    // omset hari ini: kalau ada analytics.series pakai itu, kalau tidak hitung dari orders paidToday
    const todayRevenueFromOrders = paidToday.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    let todayRevenue = todayRevenueFromOrders;
    if (analytics?.series?.length) {
      const row = analytics.series.find((x: any) => x._id === today);
      if (row) todayRevenue = Number(row.revenue || 0);
    }

    // top produk: dari analytics jika ada
    const topProducts = Array.isArray(analytics?.topProducts) ? analytics.topProducts : [];

    return {
      pending,
      totalItemsSold,
      cashInvoicesToday,
      todayRevenue,
      topProducts,
    };
  }, [orders, analytics]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <button onClick={load} className="rounded-lg border px-3 py-2 text-sm">
          Refresh
        </button>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div>Memuat...</div>
      ) : (
        <>
          {/* Big cards */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-teal-600 p-4 text-white">
              <div className="text-3xl font-extrabold">{formatPrice(computed.todayRevenue)}</div>
              <div className="mt-1 text-sm opacity-90">Penjualan Hari ini</div>
              <div className="mt-3 text-xs opacity-80">
                (diambil dari analytics jika super_admin, fallback dari order)
              </div>
            </div>

            <div className="rounded-xl bg-yellow-500 p-4 text-white">
              <div className="text-3xl font-extrabold">{computed.cashInvoicesToday}</div>
              <div className="mt-1 text-sm opacity-90">Order COD Hari ini</div>
              <div className="mt-3 text-xs opacity-80">(sementara dianggap “invoice cash”)</div>
            </div>
          </div>

          {/* Small cards */}
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Total Barang Terjual</div>
              <div className="mt-2 text-2xl font-bold">{computed.totalItemsSold}</div>
              <div className="mt-1 text-[11px] text-slate-400">dari order paid</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Jumlah Produk</div>
              <div className="mt-2 text-2xl font-bold">{productsCount}</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Total Order</div>
              <div className="mt-2 text-2xl font-bold">{orders.length}</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Total Produk</div>
              <div className="mt-2 text-2xl font-bold">{productsCount}</div>
              <Link href="/dashboard/products" className="mt-2 inline-block text-xs text-blue-600 underline">
                Kelola produk
              </Link>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="text-xs text-slate-500">Pesanan Pending</div>
              <div className="mt-2 text-2xl font-bold">{computed.pending}</div>
              <Link href="/dashboard/orders" className="mt-2 inline-block text-xs text-blue-600 underline">
                Lihat pesanan
              </Link>
            </div>
          </div>

          {/* Tables */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-4">
              <div className="mb-2 text-sm font-semibold text-slate-800">Produk Terlaris</div>

              {role !== 'super_admin' ? (
                <div className="text-sm text-slate-500">
                  (Hanya super_admin yang melihat data ini)
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-left text-xs text-slate-600">
                      <tr>
                        <th className="px-3 py-2">No</th>
                        <th className="px-3 py-2">Nama</th>
                        <th className="px-3 py-2">Terjual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(computed.topProducts || []).slice(0, 5).map((p: any, idx: number) => (
                        <tr key={String(p._id)} className="border-t">
                          <td className="px-3 py-2">{idx + 1}</td>
                          <td className="px-3 py-2">{p.name}</td>
                          <td className="px-3 py-2 font-semibold">{p.qty}</td>
                        </tr>
                      ))}

                      {!computed.topProducts?.length && (
                        <tr className="border-t">
                          <td className="px-3 py-2 text-slate-500" colSpan={3}>
                            Belum ada data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="mb-2 text-sm font-semibold text-slate-800">Catatan</div>
              <div className="text-sm text-slate-600">
                Bagian “stok terkecil” aku hilangkan dulu karena model produk kamu belum punya field stok.
                Kalau nanti kamu tambah `stock`, kita bisa tampilkan tabel stok terkecil di sini.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}