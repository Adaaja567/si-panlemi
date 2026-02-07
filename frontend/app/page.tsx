'use client';

import Hero from '@/components/Hero';
import ProductList from '@/components/ProductList';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-orange-50">
      <Hero />
      <ProductList />
    </div>
  );
}