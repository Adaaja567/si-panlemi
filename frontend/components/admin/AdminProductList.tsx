'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const AdminProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        credentials: 'include',
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError('Gagal memuat produk admin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Gagal menghapus');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Gagal menghapus produk');
    }
  };

  if (loading) return <p className="mt-4 text-gray-500">Memuat...</p>;
  if (error) return <p className="mt-4 text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Manajemen Produk</h1>
        <button className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          + Tambah Produk Baru
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Kategori</th>
              <th className="px-3 py-2">Harga</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">
                  Rp {p.price.toLocaleString('id-ID')} {p.unit}
                </td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2 space-x-2">
                  <button className="text-xs text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id!)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-4 text-center text-gray-500"
                >
                  Belum ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;