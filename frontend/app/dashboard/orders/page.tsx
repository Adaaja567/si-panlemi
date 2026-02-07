'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminMe, fetchAdminOrders, updateAdminOrderStatus } from '@/lib/api';
import { getStatusLabel, getStatusColor, getPaymentMethodLabel } from '@/lib/statusHelper';
import OrderCardMobile from '@/components/OrderCardMobile';

type OrderItem = { name: string; unit: string; price: number; quantity: number };

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod?: string;
  paymentProofUrl?: string;
  note?: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  items: OrderItem[];
};

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

const formatDate = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID');
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const [me, data] = await Promise.all([adminMe(), fetchAdminOrders()]);
      setRole(me.user.role);
      console.log('📊 Orders data:', data); // Debug log
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e.message || 'Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id: string, status: string) => {
    setErr(null);
    try {
      const updated = await updateAdminOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));

      // Tampilkan notifikasi sukses di sistem
      if (status === 'dikonfirmasi') {
        setNotification({
          message: `✅ Pesanan ${updated.customerName} telah dikonfirmasi! Customer akan menerima notifikasi otomatis.`,
          type: 'success'
        });
      } else if (status === 'dikirim') {
        setNotification({
          message: `🚚 Pesanan ${updated.customerName} telah dikirim! Customer akan menerima notifikasi otomatis.`,
          type: 'success'
        });
      } else if (status === 'selesai') {
        setNotification({
          message: `🎉 Pesanan ${updated.customerName} telah selesai! Terima kasih telah melayani customer.`,
          type: 'success'
        });
      } else {
        setNotification({
          message: `✅ Status pesanan ${updated.customerName} berhasil diubah ke "${getStatusLabel(status)}"`,
          type: 'info'
        });
      }

      // Auto hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } catch (e: any) {
      setErr(e.message || 'Gagal update status');
    }
  };

  const sendWhatsAppNotification = (order: Order, message: string) => {
    const phone = order.customerPhone.startsWith('0')
      ? '62' + order.customerPhone.slice(1)
      : order.customerPhone;

    const fullMessage = `Halo ${order.customerName},\n\n${message}\n\nDetail Pesanan:\n- ID: ${order._id}\n- Total: ${formatPrice(order.totalAmount)}\n- Status: ${getStatusLabel(order.status)}\n\nNgendok_Farm\nFresh & Ready to Cook`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(fullMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return orders.filter((o) => {
      const okStatus = statusFilter === 'all' ? true : o.status === statusFilter;
      const okQ =
        !keyword ||
        o.customerName?.toLowerCase().includes(keyword) ||
        o.customerPhone?.toLowerCase().includes(keyword) ||
        String(o._id).toLowerCase().includes(keyword);
      return okStatus && okQ;
    });
  }, [orders, q, statusFilter]);

  const allowedStatuses =
    role === 'super_admin'
      ? ['menunggu', 'dikonfirmasi', 'dibayar', 'dikirim', 'selesai', 'dibatalkan']
      : ['menunggu', 'dikonfirmasi', 'dikirim', 'selesai'];

  if (loading) return <div>Memuat pesanan...</div>;

  return (
    <div>
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-800' : 'bg-blue-100 border border-blue-400 text-blue-800'
          }`}>
          <div className="flex items-start gap-3">
            <div className="flex-1 text-sm">
              {notification.message}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">Pesanan Masuk</h1>
          <p className="text-xs text-gray-600">Tampilan tabel ringkas. Klik “Detail” untuk lihat alamat & item.</p>
        </div>
        <button onClick={load} className="rounded-lg border px-3 py-1.5 text-xs">
          Refresh
        </button>
      </div>

      {err && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">{err}</div>}

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari: nama / WA / id"
          className="w-full rounded-lg border px-3 py-2 text-sm md:w-72"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">Semua status</option>
          <option value="menunggu">Menunggu</option>
          <option value="dikonfirmasi">Dikonfirmasi</option>
          {role === 'super_admin' && <option value="dibayar">Dibayar</option>}
          <option value="dikirim">Dikirim</option>
          <option value="selesai">Selesai</option>
          {role === 'super_admin' && <option value="dibatalkan">Dibatalkan</option>}
        </select>

        <div className="ml-auto self-center text-xs text-gray-500">
          Total: <b>{filtered.length}</b>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gray-50 text-left text-xs text-gray-600">
            <tr>
              <th className="px-3 py-2">Waktu</th>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">WA</th>
              <th className="px-3 py-2">Bayar</th>
              <th className="px-3 py-2">Bukti</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Detail</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o._id} className="border-t align-top">
                <td className="px-3 py-2 text-xs text-gray-600">{formatDate(o.createdAt)}</td>
                <td className="px-3 py-2 font-medium">{o.customerName}</td>
                <td className="px-3 py-2">{o.customerPhone}</td>
                <td className="px-3 py-2 text-xs">{getPaymentMethodLabel(o.paymentMethod || '-')}</td>
                <td className="px-3 py-2">
                  {o.paymentProofUrl ? (
                    <button
                      onClick={() => window.open(`http://localhost:4000${o.paymentProofUrl}`, '_blank')}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Lihat Bukti
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="px-3 py-2 font-semibold">{formatPrice(o.totalAmount)}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>
                    {getStatusLabel(o.status)}
                  </span>
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o._id, e.target.value)}
                    className="mt-1 w-full rounded-lg border px-2 py-1 text-xs"
                  >
                    {allowedStatuses.map((s) => (
                      <option key={s} value={s}>{getStatusLabel(s)}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <details className="text-xs">
                    <summary className="cursor-pointer select-none underline">Detail</summary>
                    <div className="mt-2 rounded-lg border bg-gray-50 p-2">
                      <div className="mb-1 text-[11px] text-gray-600"><b>ID:</b> {o._id}</div>
                      <div className="mb-1 text-[11px]"><b>Alamat:</b> {o.customerAddress}</div>
                      {o.note ? <div className="mb-1 text-[11px]"><b>Catatan:</b> {o.note}</div> : null}
                      {o.paymentProofUrl && (
                        <div className="mb-1 text-[11px]">
                          <b>Bukti Transfer:</b>{' '}
                          <button
                            onClick={() => window.open(`http://localhost:4000${o.paymentProofUrl}`, '_blank')}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Lihat Gambar
                          </button>
                        </div>
                      )}
                      <div className="mt-2 text-[11px] font-semibold">Items:</div>
                      <ul className="list-disc pl-5 text-[11px]">
                        {(o.items || []).map((it, idx) => (
                          <li key={idx}>
                            {it.name} — {it.quantity} x {formatPrice(it.price)} / {it.unit}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 pt-2 border-t flex gap-2">
                        <button
                          onClick={() => sendWhatsAppNotification(o, `Update pesanan: Status saat ini adalah "${getStatusLabel(o.status)}". Terima kasih!`)}
                          className="text-[11px] bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          📱 Kirim WA Manual
                        </button>
                        <span className="text-[10px] text-gray-500 self-center">
                          (Opsional - untuk komunikasi tambahan)
                        </span>
                      </div>
                    </div>
                  </details>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-sm text-gray-500">
                  Tidak ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filtered.map((o) => (
          <OrderCardMobile
            key={o._id}
            order={o}
            allowedStatuses={allowedStatuses}
            onStatusChange={changeStatus}
            onSendWhatsApp={sendWhatsAppNotification}
          />
        ))}

        {!filtered.length && (
          <div className="bg-white rounded-lg border p-8 text-center text-sm text-gray-500">
            Tidak ada pesanan.
          </div>
        )}
      </div>
    </div>
  );
}