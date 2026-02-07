import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Ngendok_Farm</div>
          <div className="flex gap-4">
            <Link href="/produk" className="hover:text-emerald-800">Produk</Link>
            <Link href="/cara-pesan" className="hover:text-emerald-800">Cara Pesan</Link>
            <Link href="/kontak" className="hover:text-emerald-800">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}