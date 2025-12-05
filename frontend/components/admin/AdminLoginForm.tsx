'use client';

import React, { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const AdminLoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Login gagal');
      }

      window.location.href = '/admin/produk';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 max-w-sm rounded-xl bg-white p-6 shadow"
    >
      <h1 className="text-lg font-bold text-gray-900">
        Login Admin SI PANLEMI
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Masuk untuk mengelola produk Ngendok_Farm.
      </p>

      {error && (
        <p className="mt-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  );
};

export default AdminLoginForm;