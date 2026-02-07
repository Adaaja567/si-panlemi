'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderFooter =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/admin-login' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/dashboard');

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}