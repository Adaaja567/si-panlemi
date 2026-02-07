'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type Role = 'user' | 'admin' | 'super_admin';
type UserInfo = { token?: string; role?: Role; username?: string; name?: string };

function readUserInfo(): UserInfo | null {
  try {
    const raw = localStorage.getItem('userInfo');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cx(...x: Array<string | false | undefined>) {
  return x.filter(Boolean).join(' ');
}

// simple svg icons
const Icon = {
  Dashboard: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 13h8V4H4v9Zm0 7h8v-5H4v5Zm10 0h6V11h-6v9Zm0-18v7h6V2h-6Z" fill="currentColor" />
    </svg>
  ),
  Orders: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h10v2H7V4Zm-2 4h14v12H5V8Zm2 2v8h10v-8H7Z" fill="currentColor" />
    </svg>
  ),
  Products: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M21 8l-9-5-9 5 9 5 9-5Zm-9 7L3 10v9l9 5 9-5v-9l-9 5Z" fill="currentColor" />
    </svg>
  ),
  Analytics: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 19h16v2H4v-2Zm2-2h2V9H6v8Zm5 0h2V5h-2v12Zm5 0h2v-6h-2v6Z" fill="currentColor" />
    </svg>
  ),
  Stock: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16l-1 10H5L4 7Zm0 0L2 3h2m0 4h16M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Settings: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" fill="currentColor" />
    </svg>
  ),
  Users: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0-0.001-8A4 4 0 0 0 12 12Zm-7 9c0-3.314 2.686-6 6-6h2c3.314 0 6 2.686 6 6H5Z" fill="currentColor" />
    </svg>
  ),
  Admins: () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 4 5v6c0 5 3.2 9.4 8 11 4.8-1.6 8-6 8-11V5l-8-3Zm0 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm-4.5 12c.6-2 2.4-3.5 4.5-3.5s3.9 1.5 4.5 3.5H7.5Z" fill="currentColor" />
    </svg>
  ),
  Menu: () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  // sidebar state
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const u = readUserInfo();
    console.log('🔍 Dashboard auth check:', u);

    // Perbaiki: cek role saja, tidak perlu token untuk admin
    const ok = u?.role === 'admin' || u?.role === 'super_admin';
    console.log('✅ Auth result:', { user: u, isAuthorized: ok });

    if (!ok) {
      console.log('❌ Not authorized, redirecting to admin login');
      router.replace('/admin-login'); // login admin terpisah
      return;
    }

    console.log('✅ Authorized, setting user state');
    setUser(u);
    setChecked(true);
  }, [router, pathname]);

  const role = user?.role;
  const isSuper = role === 'super_admin';
  const displayName = user?.name || user?.username || 'Admin';

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    window.dispatchEvent(new Event('userInfoUpdated'));
    router.replace('/admin-login');
  };

  const nav = useMemo(() => {
    const base = [
      { href: '/dashboard', label: 'Dashboard', icon: <Icon.Dashboard /> },
      { href: '/dashboard/orders', label: 'Pesanan', icon: <Icon.Orders /> },
      { href: '/dashboard/products', label: 'Produk', icon: <Icon.Products /> },
      { href: '/dashboard/stock', label: 'Stok', icon: <Icon.Stock /> },
      { href: '/dashboard/settings', label: 'Pengaturan', icon: <Icon.Settings /> },
    ];

    const superOnly = [
      { href: '/dashboard/analytics', label: 'Analitik', icon: <Icon.Analytics /> },
      { href: '/dashboard/admins', label: 'Kelola Admin', icon: <Icon.Admins /> },
      { href: '/dashboard/users', label: 'Data Pengguna', icon: <Icon.Users /> },
    ];

    return isSuper ? [...base, { section: 'SUPER ADMIN' } as any, ...superOnly] : base;
  }, [isSuper]);

  // Jangan render shell sebelum cek localStorage agar tidak misleading
  if (!checked) return <div className="min-h-screen bg-slate-100" />;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="h-9 w-9 rounded-lg bg-orange-500 text-white grid place-items-center font-bold">
          NF
        </div>
        {!sidebarCollapsed && (
          <div className="leading-tight">
            <div className="text-sm font-bold text-white">Ngendok_Farm</div>
            <div className="text-[11px] text-slate-300">Dashboard</div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="mx-3 mb-3 rounded-xl bg-slate-700/40 px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-slate-600 text-white grid place-items-center font-bold">
            {String(displayName || 'A').slice(0, 1).toUpperCase()}
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">{displayName}</div>
              <div className="text-[11px] text-slate-300">
                {isSuper ? 'super_admin' : 'admin'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2">
        {nav.map((item: any, idx: number) => {
          if (item.section) {
            return (
              <div key={`sec-${idx}`} className="mt-3 px-3 text-[11px] font-semibold text-slate-400">
                {!sidebarCollapsed ? item.section : '•'}
              </div>
            );
          }

          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx(
                'mx-2 my-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
                active ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5'
              )}
            >
              <span className="text-slate-100">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-3">
        <button
          onClick={() => setSidebarCollapsed((v) => !v)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 hover:bg-white/10"
        >
          {sidebarCollapsed ? '>> Expand' : '<< Collapse'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile overlay */}
      {sidebarOpenMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpenMobile(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cx(
          'fixed z-40 h-screen bg-slate-800 md:translate-x-0',
          sidebarCollapsed ? 'w-[84px]' : 'w-[260px]',
          sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full',
          'transition-transform md:transition-none'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className={cx('md:pl-[260px]', sidebarCollapsed && 'md:pl-[84px]')}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border px-2 py-2 text-slate-700 md:hidden"
                onClick={() => setSidebarOpenMobile(true)}
                aria-label="Open menu"
              >
                <Icon.Menu />
              </button>

              <div className="text-sm font-semibold text-slate-800">
                Pusat <span className="text-slate-400">/</span> Dashboard
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-700 md:inline">
                Halo, <b>{displayName}</b> {isSuper ? <span className="text-xs text-slate-400">(super)</span> : null}
              </span>

              {/* Tombol ini opsional: “Pindah Cabang” */}
              <button style={{ display: 'none' }} className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 md:inline">
                Pindah Cabang
              </button>

              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </div>
    </div>
  );
}