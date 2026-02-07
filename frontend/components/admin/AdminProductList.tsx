'use client';

import React, { useEffect, useMemo, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Product = {
  _id: string;
  name: string;
  category?: string;
  unit?: string;
  price: number;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

async function parseJsonSafe(res: Response) {
  return res.json().catch(() => ({}));
}

export default function AdminProductList() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState('');

  // form tambah/edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('');
    setUnit('kg');
    setPrice(0);
    setImageUrl('');
    setIsActive(true);
  };

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        credentials: 'include',
      });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.message || 'Gagal memuat produk');
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e.message || 'Gagal memuat produk');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items;
    return items.filter((p) => {
      const a = String(p.name || '').toLowerCase();
      const b = String(p.category || '').toLowerCase();
      const c = String(p._id || '').toLowerCase();
      return a.includes(k) || b.includes(k) || c.includes(k);
    });
  }, [items, q]);

  const startEdit = (p: Product) => {
    setEditingId(p._id);
    setName(p.name || '');
    setCategory(p.category || '');
    setUnit(p.unit || 'kg');
    setPrice(Number(p.price || 0));
    setImageUrl(p.imageUrl || '');
    setIsActive(p.isActive ?? true);
  };

  const submit = async () => {
    setErr(null);

    const payload = {
      name: String(name || '').trim(),
      category: String(category || '').trim(),
      unit: String(unit || '').trim(),
      price: Number(price),
      imageUrl: String(imageUrl || '').trim(),
      isActive: Boolean(isActive),
    };

    if (!payload.name) return setErr('Nama produk wajib diisi.');
    if (!Number.isFinite(payload.price) || payload.price < 0) return setErr('Harga tidak valid.');

    try {
      const isEdit = Boolean(editingId);
      const url = isEdit
        ? `${API_URL}/api/admin/products/${editingId}`
        : `${API_URL}/api/admin/products`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan produk');

      if (isEdit) {
        setItems((prev) => prev.map((x) => (x._id === editingId ? data : x)));
      } else {
        setItems((prev) => [data, ...prev]);
      }

      resetForm();
    } catch (e: any) {
      setErr(e.message || 'Gagal menyimpan produk');
    }
  };

  const remove = async (id: string) => {
    setErr(null);
    const ok = window.confirm('Hapus produk ini?');
    if (!ok) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.message || 'Gagal menghapus produk');

      setItems((prev) => prev.filter((x) => x._id !== id));
    } catch (e: any) {
      setErr(e.message || 'Gagal menghapus produk');
    }
  };

  if (loading) return <div>Memuat produk...</div>;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">Produk</h1>
          <p className="text-xs text-gray-600">Tambah, edit, dan hapus produk.</p>
        </div>
        <button onClick={load} className="rounded-lg border px-3 py-1.5 text-xs">
          Refresh
        </button>
      </div>

      {err && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {err}
        </div>
      )}

      <div className="mb-4 rounded-xl border bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">{editingId ? 'Edit Produk' : 'Tambah Produk'}</div>
          {editingId && (
            <button onClick={resetForm} className="rounded-lg border px-3 py-1.5 text-xs">
              Batal
            </button>
          )}
        </div>

        <div className="grid gap-2 md:grid-cols-6">
          <input
            className="rounded-lg border px-3 py-2 text-sm md:col-span-2"
            placeholder="Nama produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2 text-sm md:col-span-1"
            placeholder="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2 text-sm md:col-span-1"
            placeholder="Satuan (kg/pcs)"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
          <input
            className="rounded-lg border px-3 py-2 text-sm md:col-span-1"
            placeholder="Harga"
            type="number"
            min={0}
            value={Number.isFinite(price) ? price : 0}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <label className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm md:col-span-1">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Aktif
          </label>

          <input
            className="rounded-lg border px-3 py-2 text-sm md:col-span-5"
            placeholder="Image URL (opsional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <button
            onClick={submit}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white md:col-span-1"
          >
            {editingId ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari: nama / kategori / id"
          className="w-full rounded-lg border px-3 py-2 text-sm md:w-72"
        />
        <div className="ml-auto self-center text-xs text-gray-500">
          Total: <b>{filtered.length}</b>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-600">
            <tr>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Kategori</th>
              <th className="px-3 py-2">Harga</th>
              <th className="px-3 py-2">Satuan</th>
              <th className="px-3 py-2">Aktif</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-t align-top">
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-xs text-gray-700">{p.category || '-'}</td>
                <td className="px-3 py-2 font-semibold">{new Intl.NumberFormat('id-ID').format(p.price || 0)}</td>
                <td className="px-3 py-2 text-xs">{p.unit || '-'}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-3 py-1 text-xs ${(p.isActive ?? true) ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {(p.isActive ?? true) ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">
                  Tidak ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}