'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';
import { fetchProducts } from '@/lib/api';

const categories = [
  { key: 'all', label: 'Semua' },
  { key: 'ayam', label: 'Ayam' },
  { key: 'lele_fresh', label: 'Lele Fresh' },
  { key: 'lele_marinasi', label: 'Lele Marinasi' },
  { key: 'telur', label: 'Telur' },
  { key: 'minyak', label: 'Minyak' },
];

// samakan format kategori dari DB -> key filter
function normalizeCategory(input: any): string {
  const s = String(input || '').trim().toLowerCase();

  // dukung beberapa variasi umum
  if (s === 'lele fresh' || s === 'lele-fresh') return 'lele_fresh';
  if (s === 'lele marinasi' || s === 'lele-marinasi') return 'lele_marinasi';

  // default: spasi jadi underscore
  return s.replace(/\s+/g, '_');
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => normalizeCategory((p as any).category) === activeCategory);
  }, [products, activeCategory]);

  if (loading) {
    return (
      <section id="produk" className="bg-orange-50 py-12 scroll-mt-24">
        <p className="text-center text-gray-500">Memuat produk...</p>
      </section>
    );
  }

  return (
    <section id="produk" className="bg-orange-50 py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Daftar Produk Ngendok_Farm
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Pilih bahan masakan rumahan favorit Anda.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`rounded-full px-4 py-2 text-sm border transition-all ${activeCategory === cat.key
                ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={(product as any)._id} product={product} />
          ))}

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-8">
              Belum ada produk di kategori ini.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;