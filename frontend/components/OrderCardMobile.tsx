import React from 'react';
import { getStatusLabel, getStatusColor, getPaymentMethodLabel } from '@/lib/statusHelper';

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

interface OrderCardMobileProps {
    order: Order;
    allowedStatuses: string[];
    onStatusChange: (id: string, status: string) => void;
    onSendWhatsApp: (order: Order, message: string) => void;
}

export default function OrderCardMobile({ order, allowedStatuses, onStatusChange, onSendWhatsApp }: OrderCardMobileProps) {
    return (
        <div className="bg-white rounded-lg border p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="font-semibold text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                    <div className="text-xs text-gray-500">WhatsApp</div>
                    <div className="font-medium">{order.customerPhone}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-semibold text-orange-600">{formatPrice(order.totalAmount)}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Pembayaran</div>
                    <div className="text-xs">{getPaymentMethodLabel(order.paymentMethod || '-')}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Bukti</div>
                    {order.paymentProofUrl ? (
                        <button
                            onClick={() => window.open(`http://localhost:4000${order.paymentProofUrl}`, '_blank')}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                            Lihat
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400">-</span>
                    )}
                </div>
            </div>

            {/* Status Selector */}
            <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">Ubah Status</label>
                <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                    {allowedStatuses.map((s) => (
                        <option key={s} value={s}>{getStatusLabel(s)}</option>
                    ))}
                </select>
            </div>

            {/* Details Accordion */}
            <details className="text-sm">
                <summary className="cursor-pointer select-none text-blue-600 font-medium">
                    Lihat Detail Lengkap
                </summary>
                <div className="mt-3 pt-3 border-t space-y-2">
                    <div>
                        <div className="text-xs text-gray-500">ID Pesanan</div>
                        <div className="text-xs font-mono break-all">{order._id}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Alamat Pengiriman</div>
                        <div className="text-xs">{order.customerAddress}</div>
                    </div>
                    {order.note && (
                        <div>
                            <div className="text-xs text-gray-500">Catatan</div>
                            <div className="text-xs">{order.note}</div>
                        </div>
                    )}
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Item Pesanan</div>
                        <ul className="space-y-1">
                            {(order.items || []).map((it, idx) => (
                                <li key={idx} className="text-xs bg-gray-50 p-2 rounded">
                                    <div className="font-medium">{it.name}</div>
                                    <div className="text-gray-600">
                                        {it.quantity} x {formatPrice(it.price)} / {it.unit}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={() => onSendWhatsApp(order, `Update pesanan: Status saat ini adalah "${getStatusLabel(order.status)}". Terima kasih!`)}
                        className="w-full mt-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                        📱 Kirim Notifikasi WA
                    </button>
                </div>
            </details>
        </div>
    );
}
