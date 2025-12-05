'use client';

import Hero from '@/components/Hero';
import ProductList from '@/components/ProductList';
import HowToOrder from '@/components/HowToOrder';
import ContactSection from '@/components/ContactSection';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProductList />
        <HowToOrder />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}