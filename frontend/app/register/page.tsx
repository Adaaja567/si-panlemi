'use client';

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { userRegister } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const ILLUSTRATION_SRC = "/images/register-illustration.png";

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await userRegister({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        password,
        rememberMe,
      });

      // Jangan langsung login, arahkan ke halaman login
      // Hapus semua data login yang mungkin ada
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      localStorage.removeItem('customerInfo');

      // Redirect ke halaman login dengan pesan sukses
      router.replace("/login?registered=true");
    } catch (e: any) {
      setErr(e?.message || "Gagal registrasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-100 to-lime-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[340px_1fr] lg:gap-10 lg:items-stretch">
        <div className="w-full rounded-3xl border border-emerald-200/60 bg-white/75 p-6 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur">
          <div className="relative overflow-hidden rounded-2xl bg-white h-[420px] lg:h-[520px]">
            <Image
              src={ILLUSTRATION_SRC}
              alt="Ilustrasi register"
              fill
              sizes="(max-width: 768px) 100vw, 340px"
              className="object-contain p-6"
              priority
            />
          </div>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-blue-500/25" />
        </div>

        <div className="w-full rounded-3xl border border-emerald-200/60 bg-white/75 p-6 shadow-[0_10px_30px_rgba(16,24,40,0.08)] backdrop-blur">
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
                Daftar untuk menyimpan data & melihat pesanan.
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Daftar Sekarang</h1>
            <p className="mt-1 text-sm text-slate-600">Lengkapi data di bawah untuk membuat akun.</p>
          </div>

          {err && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-800">Nama</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                />
              </div>

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

              <div className="md:col-span-1">
                <label className="text-sm font-medium text-slate-800">Alamat</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Alamat lengkap (jalan, RT/RW, desa/kel, kec, kab/kota)"
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                />
              </div>

              <div className="md:col-span-1">
                <label className="text-sm font-medium text-slate-800">Password</label>
                <div className="relative mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-500">Minimal 6 karakter.</p>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="flex items-start gap-3 pt-1 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
                  />
                  <span>Ingat saya</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                  {loading ? "Memproses..." : "Daftar"}
                </button>

                <div className="text-center text-sm text-slate-700">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="font-semibold text-emerald-800 hover:underline">
                    Login
                  </Link>
                </div>

                <div className="text-center text-xs text-slate-600">
                  Admin?{" "}
                  <Link href="/admin-login" className="font-semibold text-slate-800 hover:underline">
                    Login Admin
                  </Link>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}