'use client';

import Link from 'next/link';
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link href="/" className="text-lg font-extrabold text-orange-600">
          Ngendok_Farm
          <span className="ml-1 text-xs font-normal text-gray-500">
            (SI PANLEMI)
          </span>
        </Link>
        <nav className="hidden gap-4 text-sm font-medium text-gray-700 md:flex">
          <Link href="/" className="hover:text-orange-600">
            Beranda
          </Link>
          <a href="#produk" className="hover:text-orange-600">
            Produk
          </a>
          <a href="#cara-pesan" className="hover:text-orange-600">
            Cara Pesan
          </a>
          <a href="#kontak" className="hover:text-orange-600">
            Kontak
          </a>
        </nav>
        <div className="hidden md:block">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
          >
            Pesan via WhatsApp
          </a>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">Toggle menu</span>
          ☰
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-4 py-2 text-sm text-gray-700 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/" onClick={() => setOpen(false)}>
              Beranda
            </Link>
            <a href="#produk" onClick={() => setOpen(false)}>
              Produk
            </a>
            <a href="#cara-pesan" onClick={() => setOpen(false)}>
              Cara Pesan
            </a>
            <a href="#kontak" onClick={() => setOpen(false)}>
              Kontak
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 rounded-lg bg-green-500 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-green-600"
            >
              Pesan via WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;