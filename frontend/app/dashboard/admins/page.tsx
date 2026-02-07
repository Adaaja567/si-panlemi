'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  adminMe,
  fetchSuperAdminAdmins,
  createSuperAdminAdmin,
  updateSuperAdminAdmin,
  deleteSuperAdminAdmin,
} from '@/lib/api';

type AdminRow = {
  _id?: string;
  id?: string;
  username?: string;
  role?: 'admin' | 'super_admin';
  isActive?: boolean;
  createdAt?: string;
};

export default function DashboardAdminsPage() {
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState('');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'super_admin'>('admin');

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const me = await adminMe();
      setRole(me.user.role);

      const data = await fetchSuperAdminAdmins();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e.message || 'Gagal memuat admin');
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return admins.filter((a) => {
      if (!k) return true;
      const u = String(a.username || '').toLowerCase();
      const id = String(a._id || a.id || '').toLowerCase();
      return u.includes(k) || id.includes(k);
    });
  }, [admins, q]);

  const createAdmin = async () => {
    setErr(null);
    try {
      const payload = {
        username: newUsername.trim(),
        password: newPassword,
        role: newRole,
      };
      const created = await createSuperAdminAdmin(payload);
      setAdmins((prev) => [created as any, ...prev]);
      setNewUsername('');
      setNewPassword('');
      setNewRole('admin');
    } catch (e: any) {
      setErr(e.message || 'Gagal membuat admin');
    }
  };

  const toggleActive = async (a: AdminRow) => {
    setErr(null);
    const id = String(a._id || a.id || '');
    if (!id) return;

    try {
      const next = !(a.isActive ?? true);
      const updated = await updateSuperAdminAdmin(id, { isActive: next });
      setAdmins((prev) =>
        prev.map((x) => (String(x._id || x.id || '') === id ? (updated as any) : x))
      );
    } catch (e: any) {
      setErr(e.message || 'Gagal update admin');
    }
  };

  const changeRole = async (a: AdminRow, nextRole: 'admin' | 'super_admin') => {
    setErr(null);
    const id = String(a._id || a.id || '');
    if (!id) return;

    try {
      const updated = await updateSuperAdminAdmin(id, { role: nextRole });
      setAdmins((prev) =>
        prev.map((x) => (String(x._id || x.id || '') === id ? (updated as any) : x))
      );
    } catch (e: any) {
      setErr(e.message || 'Gagal update role');
    }
  };

  const resetPassword = async (a: AdminRow) => {
    setErr(null);
    const id = String(a._id || a.id || '');
    if (!id) return;

    const pw = window.prompt(`Set password baru untuk ${a.username}:`);
    if (!pw) return;

    try {
      const updated = await updateSuperAdminAdmin(id, { password: pw });
      setAdmins((prev) =>
        prev.map((x) => (String(x._id || x.id || '') === id ? (updated as any) : x))
      );
    } catch (e: any) {
      setErr(e.message || 'Gagal reset password');
    }
  };

  const remove = async (a: AdminRow) => {
    setErr(null);
    const id = String(a._id || a.id || '');
    if (!id) return;

    const ok = window.confirm(`Hapus admin ${a.username}?`);
    if (!ok) return;

    try {
      await deleteSuperAdminAdmin(id);
      setAdmins((prev) => prev.filter((x) => String(x._id || x.id || '') !== id));
    } catch (e: any) {
      setErr(e.message || 'Gagal menghapus admin');
    }
  };

  if (loading) return <div>Memuat admin...</div>;

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
          <h1 className="text-lg font-bold">Kelola Admin</h1>
          <p className="text-xs text-gray-600">Buat admin, ubah role, aktif/nonaktif.</p>
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
        <div className="mb-2 text-sm font-semibold">Tambah Admin</div>
        <div className="grid gap-2 md:grid-cols-4">
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="username"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="password"
            type="password"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as any)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
          <button
            onClick={createAdmin}
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
          >
            Buat
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari: username / id"
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
              <th className="px-3 py-2">Username</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Aktif</th>
              <th className="px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => {
              const id = String(a._id || a.id || idx);
              const isActive = a.isActive ?? true;
              return (
                <tr key={id} className="border-t align-top">
                  <td className="px-3 py-2 font-medium">{a.username || '-'}</td>
                  <td className="px-3 py-2">
                    <select
                      value={a.role || 'admin'}
                      onChange={(e) => changeRole(a, e.target.value as any)}
                      className="rounded-lg border px-2 py-1 text-xs"
                    >
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-3 py-1 text-xs ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => toggleActive(a)}
                      className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50"
                    >
                      {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                    <button
                      onClick={() => resetPassword(a)}
                      className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50"
                    >
                      Reset PW
                    </button>
                    <button
                      onClick={() => remove(a)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan={4} className="px-3 py-10 text-center text-sm text-gray-500">
                  Tidak ada admin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}