'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { createOrder } from '@/lib/api';
import { detectAreaFromAddress, getAddressGuidance, formatShippingFee } from '@/lib/locationUtils';

const formatPrice = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);

type LocalUserInfo = {
    token?: string;
    role?: string;
    name?: string;
    phone?: string;
    address?: string;
};

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
    const [showCheckout, setShowCheckout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'dana' | 'cod'>('dana');
    const [note, setNote] = useState('');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    // Shipping calculation state
    const [detectedArea, setDetectedArea] = useState<string>('');
    const [shippingDistance, setShippingDistance] = useState<number>(0);
    const [shippingFee, setShippingFee] = useState<number>(0);
    const [showAddressGuidance, setShowAddressGuidance] = useState(false);

    useEffect(() => {
        // Load user info if logged in
        if (typeof window !== 'undefined') {
            try {
                const userInfo = localStorage.getItem('userInfo');

                if (userInfo) {
                    const user = JSON.parse(userInfo) as LocalUserInfo;
                    // Cek apakah user adalah regular user (bukan admin)
                    if (user.role === 'user') {
                        setCustomerName(user.name || '');
                        setCustomerPhone(user.phone || '');
                        setCustomerAddress(user.address || '');
                        setIsUserLoggedIn(true);
                    } else {
                        setIsUserLoggedIn(false);
                    }
                } else {
                    setIsUserLoggedIn(false);
                }
            } catch (error) {
                console.error('Error loading user info:', error);
                setIsUserLoggedIn(false);
            }
        }
    }, []);

    // Function to calculate shipping based on address
    const calculateShipping = (address: string) => {
        if (!address.trim()) {
            setDetectedArea('');
            setShippingDistance(0);
            setShippingFee(0);
            return;
        }

        const detection = detectAreaFromAddress(address);
        if (detection) {
            setDetectedArea(detection.area);
            setShippingDistance(detection.distance);
            setShippingFee(detection.fee);
        } else {
            // Area tidak dikenal, anggap jauh (ongkir 15rb)
            setDetectedArea('Area tidak dikenal');
            setShippingDistance(15);
            setShippingFee(15000);
        }
    };

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
            setError('Nama, nomor WA, dan alamat wajib diisi.');
            return;
        }

        if (paymentMethod === 'dana' && !paymentProof) {
            setError('Bukti transfer DANA wajib diupload.');
            return;
        }

        if (items.length === 0) {
            setError('Keranjang kosong. Tambahkan produk terlebih dahulu.');
            return;
        }

        setLoading(true);
        try {
            const orderItems = items.map(item => ({
                productId: item.product._id,
                name: item.product.name,
                unit: item.product.unit,
                price: item.product.price,
                quantity: item.quantity,
            }));

            await createOrder({
                customerName: customerName.trim(),
                customerPhone: customerPhone.trim(),
                customerAddress: customerAddress.trim(),
                paymentMethod,
                deliveryArea: detectedArea,
                note,
                items: orderItems,
            }, paymentProof || undefined);

            alert('Pesanan berhasil dibuat!');
            clearCart();
            setShowCheckout(false);
            // Reset form hanya untuk note dan payment proof, data user tetap ada jika masih login
            setPaymentMethod('dana');
            setNote('');
            setPaymentProof(null);

            // Reload user data jika masih login
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const user = JSON.parse(userInfo);
                if (user.role === 'user') {
                    setCustomerName(user.name || '');
                    setCustomerPhone(user.phone || '');
                    setCustomerAddress(user.address || '');
                } else {
                    // Jika bukan user biasa, reset semua
                    setCustomerName('');
                    setCustomerPhone('');
                    setCustomerAddress('');
                }
            } else {
                // Jika tidak ada user info, reset semua
                setCustomerName('');
                setCustomerPhone('');
                setCustomerAddress('');
            }
        } catch (err: any) {
            setError(err.message || 'Gagal membuat pesanan');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center">
                        <div className="mb-8">
                            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Keranjang Kosong</h1>
                        <p className="text-gray-600 mb-8">Belum ada produk di keranjang Anda. Yuk, mulai belanja!</p>
                        <Link
                            href="/#produk"
                            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Lihat Produk
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Keranjang Pesanan</h1>
                    <p className="text-gray-600 mt-2">Review pesanan Anda sebelum checkout</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Produk ({items.length})</h2>

                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.product._id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={item.product.imageUrl || '/images/placeholder-product.svg'}
                                                    alt={item.product.name}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-lg object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        if (target.src !== '/images/placeholder-product.svg') {
                                                            target.src = '/images/placeholder-product.svg';
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                                                <p className="text-sm text-gray-600">{item.product.unit}</p>
                                                <p className="text-lg font-bold text-orange-600 mt-1">
                                                    {formatPrice(item.product.price)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.product._id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Hapus dari keranjang"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>

                            <div className="space-y-3 mb-6">
                                {items.map((item) => (
                                    <div key={item.product._id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.product.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium">
                                            {formatPrice(item.product.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 mb-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                                    </div>
                                    {customerAddress.trim() && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Ongkir ({detectedArea})</span>
                                            <span className="font-medium text-orange-600">
                                                {formatShippingFee(shippingFee)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-orange-600">
                                            {formatPrice(getTotalPrice() + (customerAddress.trim() ? shippingFee : 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCheckout(true)}
                                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Checkout
                            </button>

                            <Link
                                href="/#produk"
                                className="block w-full text-center text-gray-600 hover:text-orange-600 py-2 mt-3 transition-colors"
                            >
                                Lanjut Belanja
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Checkout Modal */}
                {showCheckout && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold text-gray-900">Checkout Pesanan</h2>
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleCheckout} className="space-y-4">
                                    {isUserLoggedIn && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm text-green-800 font-medium">
                                                    Data Anda sudah terisi otomatis
                                                </span>
                                            </div>
                                            <p className="text-xs text-green-700 mt-1">
                                                Anda dapat mengubah data jika diperlukan
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nomor WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="contoh: 62812xxxxxxx"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                        {isUserLoggedIn && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                💡 Data dari akun Anda, dapat diubah jika diperlukan
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Alamat Lengkap
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                value={customerAddress}
                                                onChange={(e) => setCustomerAddress(e.target.value)}
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="Contoh: Jl. Merdeka No. 123, Rembang Kota, Rembang"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressGuidance(!showAddressGuidance)}
                                                className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 text-xs"
                                            >
                                                ❓ Bantuan
                                            </button>
                                        </div>

                                        {showAddressGuidance && (
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                                                {getAddressGuidance().map((line, index) => (
                                                    <div key={index} className={line.startsWith('•') ? 'ml-2 text-blue-700' : line.startsWith('💡') ? 'font-medium text-blue-800 mt-2' : line.startsWith('📍') ? 'font-medium text-blue-800' : 'text-blue-600'}>
                                                        {line}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Shipping Detection Result */}
                                        {customerAddress.trim() && (
                                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            📍 Area: {detectedArea}
                                                        </p>
                                                        {shippingDistance > 0 && (
                                                            <p className="text-xs text-gray-600">
                                                                Jarak: ~{shippingDistance}km dari Ngendok Farm
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-orange-600">
                                                            Ongkir: {formatShippingFee(shippingFee)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {shippingFee === 0 && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        🎉 Selamat! Anda mendapat gratis ongkir
                                                    </p>
                                                )}

                                                {detectedArea === 'Area tidak dikenal' && (
                                                    <p className="text-xs text-orange-600 mt-1">
                                                        ⚠️ Area belum dikenal, ongkir dihitung berdasarkan estimasi
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {isUserLoggedIn && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                💡 Data dari akun Anda, dapat diubah jika diperlukan
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Metode Pembayaran
                                        </label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value as 'dana' | 'cod')}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="dana">DANA</option>
                                            <option value="cod">COD (Bayar di tempat)</option>
                                        </select>
                                    </div>

                                    {/* Upload Bukti Transfer - hanya muncul jika pilih DANA */}
                                    {paymentMethod === 'dana' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Bukti Transfer DANA <span className="text-red-500">*</span>
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            // Validasi ukuran file (max 5MB)
                                                            if (file.size > 5 * 1024 * 1024) {
                                                                setError('Ukuran file maksimal 5MB');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            setPaymentProof(file);
                                                            setError(null);
                                                        }
                                                    }}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    required={paymentMethod === 'dana'}
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Upload screenshot bukti transfer DANA (JPG, PNG, max 5MB)
                                                </p>
                                                {paymentProof && (
                                                    <p className="text-xs text-green-600 mt-1">
                                                        ✓ File terpilih: {paymentProof.name}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Info DANA */}
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-800 font-medium">📱 Transfer ke DANA:</p>
                                                <p className="text-sm text-blue-700">
                                                    <strong>0895-3264-22463</strong> (a.n. Ngendok Farm)
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Setelah transfer, upload bukti screenshot di atas
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Catatan (opsional)
                                        </label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            rows={2}
                                            placeholder="Catatan khusus untuk pesanan..."
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Subtotal:</span>
                                                <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Ongkir:</span>
                                                <span className="font-medium text-orange-600">
                                                    {formatShippingFee(shippingFee)}
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between">
                                                <span className="text-sm font-bold text-gray-700">Total Pesanan:</span>
                                                <span className="text-lg font-bold text-orange-600">
                                                    {formatPrice(getTotalPrice() + shippingFee)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowCheckout(false)}
                                            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                                        >
                                            {loading ? 'Memproses...' : 'Pesan Sekarang'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}