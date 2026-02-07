'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Logo from '../Logo';

type Role = 'user' | 'admin' | 'super_admin';
type UserInfo = { token?: string; role?: Role; name?: string; username?: string };

const navLinkClass =
  'rounded-full px-3 py-1 text-sm font-medium text-gray-700 ' +
  'hover:bg-orange-100 hover:text-orange-700 hover:shadow-sm ' +
  'transition-colors transition-shadow';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  const loadUser = () => {
    const raw = localStorage.getItem('userInfo');
    if (!raw) return setUser(null);

    try {
      setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    const handler = () => loadUser();
    window.addEventListener('userInfoUpdated', handler as EventListener);
    return () => window.removeEventListener('userInfoUpdated', handler as EventListener);
  }, []);

  const isLoggedIn = Boolean(user?.role);
  const role = user?.role;

  const isAdminLike = role === 'admin' || role === 'super_admin';
  const dashboardHref = role === 'user' ? '/my-orders' : '/dashboard/orders';
  const dashboardLabel = role === 'user' ? 'Pesanan Saya' : 'Dashboard';

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    window.dispatchEvent(new Event('userInfoUpdated'));
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Logo />

        <nav className="hidden gap-3 md:flex">
          {!isAdminLike && (
            <>
              <Link href="/#beranda" className={navLinkClass}>Beranda</Link>
              <Link href="/#produk" className={navLinkClass}>Produk</Link>
              <Link href="/#cara-pesan" className={navLinkClass}>Cara Pesan</Link>
              <Link href="/#kontak" className={navLinkClass}>Kontak</Link>
            </>
          )}

          {isLoggedIn && (
            <Link href={dashboardHref} className={navLinkClass}>
              {dashboardLabel}
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!isAdminLike && (
            <a
              href="https://wa.me/6289532642246"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
            >
              Pesan via WhatsApp
            </a>
          )}

          {isLoggedIn ? (
            <>
              <span className="text-xs font-semibold text-gray-700">
                Halo, {user?.name || user?.username || 'User'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-orange-400 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-50"
            >
              Login
            </Link>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 py-2 text-sm text-gray-700 md:hidden">
          <div className="flex flex-col gap-2">
            {!isAdminLike && (
              <>
                <Link href="/#beranda" onClick={() => setOpen(false)}>Beranda</Link>
                <Link href="/#produk" onClick={() => setOpen(false)}>Produk</Link>
                <Link href="/#cara-pesan" onClick={() => setOpen(false)}>Cara Pesan</Link>
                <Link href="/#kontak" onClick={() => setOpen(false)}>Kontak</Link>
              </>
            )}

            {isLoggedIn ? (
              <>
                <Link href={dashboardHref} onClick={() => setOpen(false)}>{dashboardLabel}</Link>
                <button onClick={logout} className="text-left">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}