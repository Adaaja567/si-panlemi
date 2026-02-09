'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { userLogin } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFromRegistration = searchParams.get('registered') === 'true';

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isFromRegistration) {
      setSuccessMessage("Registrasi berhasil! Silakan login dengan akun yang baru dibuat.");
    }
  }, [isFromRegistration]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await userLogin({ phone, password, rememberMe });

      // Store user info and token properly
      localStorage.setItem('userInfo', JSON.stringify({
        role: 'user',
        name: data.user.name,
        phone: data.user.phone,
        address: data.user.address
      }));

      if (data.token) {
        localStorage.setItem('userToken', data.token);
      }

      window.dispatchEvent(new Event('userInfoUpdated'));

      // Redirect to home page instead of non-existent /produk
      router.replace("/");
    } catch (err: any) {
      setError(err?.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-lime-100">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-emerald-200/60 bg-white/75 p-7 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-emerald-300">
              <Image
                src="/images/logo.png"
                alt="Ngendok Farm Logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-emerald-900">Ngendok_Farm</div>
              <div className="text-xs text-emerald-800/70">
                Login untuk menyimpan data & melihat pesanan.
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Login</h1>
            <p className="mt-1 text-sm text-slate-600">
              Masukkan nomor WhatsApp dan kata sandi.
            </p>
          </div>

          {successMessage && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-800">Nomor WhatsApp</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="contoh: 62812xxxxxxx"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-800">Kata Sandi</label>
              <div className="mt-2 relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
                />
                Ingat saya
              </label>

              <Link href="/lupa-password" className="text-sm font-semibold text-emerald-800 hover:underline">
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

            <div className="pt-2 text-center text-sm text-slate-700">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-emerald-800 hover:underline">
                Daftar Sekarang
              </Link>
            </div>

            <div className="text-center text-xs text-slate-600">
              Admin?{" "}
              <Link href="/admin-login" className="font-semibold text-slate-800 hover:underline">
                Login Admin
              </Link>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="relative h-[360px] w-[360px] overflow-hidden rounded-full shadow-[0_18px_60px_rgba(16,24,40,0.18)] ring-1 ring-emerald-200/70 bg-white p-10 flex items-center justify-center">
            <div className="relative h-48 w-48 overflow-hidden rounded-full ring-4 ring-emerald-300">
              <Image
                src="/images/logo.png"
                alt="Ngendok Farm Logo"
                fill
                sizes="192px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M10.6 10.6A2.5 2.5 0 0 0 12 14.5a2.5 2.5 0 0 0 2.4-3.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.5 6.8C4.1 8.6 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.5 4.8-1.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 5.4C10 5.1 11 5 12 5c6 0 9.5 7 9.5 7a17.2 17.2 0 0 1-3.2 4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-lime-100 flex items-center justify-center">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}