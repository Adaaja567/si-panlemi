'use client';

import React, { useEffect, useState } from 'react';
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

const WA_PHONE = '6281234567890'; // ganti dengan nomor WA asli

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (loading) {
    return <p className="text-center text-gray-500">Memuat produk...</p>;
  }

  return (
    <section id="produk" className="py-10 bg-orange-50">
      <div className="mx-auto max-w-6xl px-4">
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
              className={`rounded-full px-3 py-1 text-sm border ${
                activeCategory === cat.key
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              waPhone={WA_PHONE}
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              Belum ada produk di kategori ini.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductList;