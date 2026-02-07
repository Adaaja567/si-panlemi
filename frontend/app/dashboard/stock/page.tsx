'use client';

import React, { useEffect, useState } from 'react';
import { fetchStockNotifications, fetchStockSummary, restockProduct } from '@/lib/api';

interface StockNotification {
    id: string;
    name: string;
    unit: string;
    stock: number;
    status: string;
    category: string;
    type: 'low_stock' | 'out_of_stock';
    message: string;
}

interface StockSummary {
    summary: {
        totalProducts: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
    };
    topLowStock: Array<{
        _id: string;
        name: string;
        stock: number;
        unit: string;
        category: string;
    }>;
}

export default function StockNotificationsPage() {
    const [notifications, setNotifications] = useState<StockNotification[]>([]);
    const [summary, setSummary] = useState<StockSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [restockModal, setRestockModal] = useState<{
        show: boolean;
        product: StockNotification | null;
        quantity: number;
        action: 'add' | 'set';
    }>({
        show: false,
        product: null,
        quantity: 0,
        action: 'add'
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [notifData, summaryData] = await Promise.all([
                fetchStockNotifications(),
                fetchStockSummary()
            ]);

            setNotifications(notifData.notifications || []);
            setSummary(summaryData);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRestock = async () => {
        if (!restockModal.product || restockModal.quantity <= 0) return;

        try {
            await restockProduct(restockModal.product.id, restockModal.quantity, restockModal.action);
            setRestockModal({ show: false, product: null, quantity: 0, action: 'add' });
            loadData(); // Reload data
        } catch (err: any) {
            setError(err.message);
        }
    };

    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifikasi Stock</h1>
                    <p className="text-gray-600">Monitor dan kelola stock produk</p>
                </div>
                <button
                    onClick={loadData}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Produk</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(summary.summary.totalProducts)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Stock Aman</p>
                                <p className="text-2xl font-bold text-green-600">{formatNumber(summary.summary.inStock)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Stock Rendah</p>
                                <p className="text-2xl font-bold text-yellow-600">{formatNumber(summary.summary.lowStock)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Stock Habis</p>
                                <p className="text-2xl font-bold text-red-600">{formatNumber(summary.summary.outOfStock)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Notifikasi Stock ({notifications.length})
                    </h2>
                </div>

                {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-green-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Semua Stock Aman!</h3>
                        <p className="text-gray-600">Tidak ada produk dengan stock rendah atau habis.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="p-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg ${notification.type === 'out_of_stock' ? 'bg-red-100' : 'bg-yellow-100'
                                        }`}>
                                        {notification.type === 'out_of_stock' ? (
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-sm font-medium text-gray-900">{notification.name}</h3>
                                        <p className={`text-sm ${notification.type === 'out_of_stock' ? 'text-red-600' : 'text-yellow-600'
                                            }`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Kategori: {notification.category} • Stock: {notification.stock} {notification.unit}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setRestockModal({
                                        show: true,
                                        product: notification,
                                        quantity: 10,
                                        action: 'add'
                                    })}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Restock
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Restock Modal */}
            {restockModal.show && restockModal.product && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Restock {restockModal.product.name}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock Saat Ini
                                </label>
                                <p className="text-sm text-gray-600">
                                    {restockModal.product.stock} {restockModal.product.unit}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Aksi
                                </label>
                                <select
                                    value={restockModal.action}
                                    onChange={(e) => setRestockModal(prev => ({
                                        ...prev,
                                        action: e.target.value as 'add' | 'set'
                                    }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="add">Tambah Stock</option>
                                    <option value="set">Set Stock Baru</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Jumlah ({restockModal.product.unit})
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={restockModal.quantity}
                                    onChange={(e) => setRestockModal(prev => ({
                                        ...prev,
                                        quantity: parseInt(e.target.value) || 0
                                    }))}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-600">
                                    <strong>Preview:</strong> Stock akan menjadi{' '}
                                    <span className="font-medium text-gray-900">
                                        {restockModal.action === 'add'
                                            ? restockModal.product.stock + restockModal.quantity
                                            : restockModal.quantity
                                        } {restockModal.product.unit}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setRestockModal({ show: false, product: null, quantity: 0, action: 'add' })}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleRestock}
                                disabled={restockModal.quantity <= 0}
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                Update Stock
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}