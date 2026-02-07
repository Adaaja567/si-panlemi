'use client';

import React, { useState } from 'react';
import PasswordField from '@/components/PasswordField';
import { adminLogin } from '@/lib/api';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!username.trim() || !password) {
      setErr('Username dan password wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      console.log('🔐 Attempting login with:', { username: username.trim(), passwordLength: password.length });

      const data = await adminLogin({ username: username.trim(), password, rememberMe });
      console.log('✅ Login response:', data);

      // ✅ simpan info untuk UI saja
      const userInfo = {
        role: data.user.role,
        username: data.user.username,
        name: data.user.username,
      };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.removeItem('userToken');
      window.dispatchEvent(new Event('userInfoUpdated'));

      console.log('✅ Redirecting to dashboard...');
      // Redirect ke dashboard utama
      window.location.replace('/dashboard');
    } catch (e: any) {
      console.error('❌ Login error:', e);
      setErr(e.message || 'Gagal login admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF7EC] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md">
        <h1 className="mb-2 text-xl font-bold text-gray-900">Login Admin</h1>
        <p className="mb-4 text-xs text-gray-600">Untuk admin & super admin.</p>

        {err && <p className="mb-2 text-xs text-red-600">{err}</p>}

        <form onSubmit={onLogin} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700">Username</label>
            <input
              className="mt-1 w-full rounded-lg border px-2 py-1.5 text-xs"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-700">Password</label>
            <PasswordField value={password} onChange={setPassword} />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Ingat saya
          </label>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </main>
  );
}