'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminMe, fetchSuperAdminUsers, setSuperAdminUserActive } from '@/lib/api';

type UserRow = {
  _id?: string;
  id?: string;
  name?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
  passwordInfo?: {
    hasCustomPassword: boolean;
    lastChanged: string;
    status: string;
    hint: string;
  };
};

export default function DashboardUsersPage() {
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState('');

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const me = await adminMe();
      setRole(me.user.role);

      const data = await fetchSuperAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e.message || 'Gagal memuat user');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return users.filter((u) => {
      if (!k) return true;
      const name = String(u.name || '').toLowerCase();
      const phone = String(u.phone || '').toLowerCase();
      const id = String(u._id || u.id || '').toLowerCase();
      return name.includes(k) || phone.includes(k) || id.includes(k);
    });
  }, [users, q]);

  const toggleActive = async (u: UserRow) => {
    setErr(null);
    const id = String(u._id || u.id || '');
    if (!id) return;

    try {
      const next = !(u.isActive ?? true);
      const updated = await setSuperAdminUserActive(id, next);

      setUsers((prev) =>
        prev.map((x) => {
          const xid = String(x._id || x.id || '');
          return xid === id ? (updated as any) : x;
        })
      );
    } catch (e: any) {
      setErr(e.message || 'Gagal update user');
    }
  };

  if (loading) return <div>Memuat user...</div>;

  if (role !== 'super_admin') {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm">
        Akses ditolak. Halaman ini hanya untuk <b>super admin</b>.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">Data User</h1>
          <p className="text-xs text-gray-600">Kelola status aktif/nonaktif user.</p>
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

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari: nama / WA / id"
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
              <th className="px-3 py-2">WA</th>
              <th className="px-3 py-2">Alamat</th>
              <th className="px-3 py-2">Password Info</th>
              <th className="px-3 py-2">Aktif</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, idx) => {
              const id = String(u._id || u.id || idx);
              const isActive = u.isActive ?? true;
              return (
                <tr key={id} className="border-t align-top">
                  <td className="px-3 py-2 font-medium">{u.name || '-'}</td>
                  <td className="px-3 py-2">{u.phone || '-'}</td>
                  <td className="px-3 py-2 text-xs text-gray-700">{u.address || '-'}</td>
                  <td className="px-3 py-2">
                    <div className="text-xs">
                      {u.passwordInfo ? (
                        <div className={`px-2 py-1 rounded ${u.passwordInfo.hasCustomPassword
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                          }`}>
                          <div><strong>Status:</strong> {u.passwordInfo.status}</div>
                          <div className="mt-1 text-xs opacity-75">{u.passwordInfo.hint}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-3 py-1 text-xs ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => toggleActive(u)}
                      className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50"
                    >
                      {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-gray-500">
                  Tidak ada user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}