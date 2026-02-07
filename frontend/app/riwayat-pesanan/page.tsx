'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStatusLabel, getStatusColor, getPaymentMethodLabel } from '@/lib/statusHelper';

type LocalUserInfo = {
    token?: string;
    role?: string;
    name?: string;
    phone?: string;
    address?: string;
};

export default function RiwayatPesananPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [loggedUserPhone, setLoggedUserPhone] = useState('');

    useEffect(() => {
        // Check if user is logged in
        if (typeof window !== 'undefined') {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const user = JSON.parse(userInfo) as LocalUserInfo;
                    // Check if user is regular user (not admin)
                    if (user.role === 'user' && user.phone) {
                        setIsUserLoggedIn(true);
                        setLoggedUserPhone(user.phone);
                        setPhoneNumber(user.phone);
                        // Automatically search for logged user's orders
                        searchOrders(user.phone);
                    }
                }
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        }
    }, []);

    const searchOrders = async (phone: string) => {
        console.log('🔍 Starting search for:', phone);
        setLoading(true);
        setError(null);

        try {
            const url = `http://localhost:4000/api/orders/search?phone=${encodeURIComponent(phone)}`;
            console.log('📡 Fetching:', url);

            const response = await fetch(url);
            console.log('📊 Response status:', response.status);
            console.log('📊 Response ok:', response.ok);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Data received:', data);
            console.log('✅ Data type:', typeof data);
            console.log('✅ Is array:', Array.isArray(data));

            setOrders(data || []);
            setShowForm(false);

        } catch (err: any) {
            console.error('❌ Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.trim()) {
            searchOrders(phoneNumber.trim());
        }
    };

    const formatPrice = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (showForm && !isUserLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-md mx-auto px-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Riwayat Pesanan</h1>
                        <p className="text-gray-600 mb-6">
                            Masukkan nomor WhatsApp untuk melihat riwayat pesanan Anda
                        </p>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nomor WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="contoh: 0895387353499"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !phoneNumber.trim()}
                                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Mencari...' : 'Cari Pesanan'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                Error: {error}
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm underline">
                                ← Kembali ke Beranda
                            </Link>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Tips:</strong> Jika Anda sudah memiliki akun,
                                <Link href="/login" className="text-blue-600 hover:text-blue-700 underline ml-1">
                                    login terlebih dahulu
                                </Link> untuk melihat riwayat pesanan secara otomatis.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
                        {isUserLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-green-600 font-medium">Akun Anda</span>
                                </div>
                                <span className="text-gray-600">• {loggedUserPhone}</span>
                            </div>
                        ) : (
                            <p className="text-gray-600">Nomor: {phoneNumber}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {!isUserLoggedIn && (
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setOrders([]);
                                    setError(null);
                                }}
                                className="text-orange-600 hover:text-orange-700 text-sm underline"
                            >
                                Cari Nomor Lain
                            </button>
                        )}
                        <Link
                            href="/"
                            className="text-gray-600 hover:text-gray-700 text-sm underline"
                        >
                            ← Beranda
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat riwayat pesanan...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
                        <p className="text-gray-600 mb-4">Error: {error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                if (isUserLoggedIn) {
                                    searchOrders(loggedUserPhone);
                                } else {
                                    setShowForm(true);
                                }
                            }}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Pesanan</h3>
                        <p className="text-gray-600 mb-4">
                            {isUserLoggedIn
                                ? "Anda belum pernah melakukan pesanan."
                                : "Nomor WhatsApp ini belum pernah melakukan pesanan."
                            }
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            ID: <span className="font-mono">{order._id}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="font-medium text-gray-900 mb-2">Detail Pesanan:</h3>
                                    <div className="space-y-2">
                                        {order.items.map((item: any, index: number) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-700">
                                                    {item.name} ({item.unit}) × {item.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-600">
                                            <div>Pembayaran: {getPaymentMethodLabel(order.paymentMethod)}</div>
                                            {order.note && <div>Catatan: {order.note}</div>}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-600">Total</div>
                                            <div className="text-lg font-bold text-orange-600">
                                                {formatPrice(order.totalAmount)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}