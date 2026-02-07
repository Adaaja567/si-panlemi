'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

// Mapping foto yang benar
const imageMapping: { [key: string]: string } = {
  'Ayam Ungkep 1kg': '/images/1.png',
  'Ayam Ungkep 0.5kg': '/images/1.png',
  'Lele Fresh 1kg': '/images/2.png',
  'Lele Fresh 0.5kg': '/images/2.png',
  'Lele Marinasi 1kg': '/images/3.png',
  'Lele Marinasi 0.5kg': '/images/3.png',
  'Telur Ayam Segar': '/images/4.png',
  'Minyak Goreng': '/images/5.png'
};

function getCorrectImageUrl(product: Product): string {
  // Prioritas: mapping berdasarkan nama → imageUrl dari database → placeholder
  return imageMapping[product.name] || product.imageUrl || '/images/placeholder-product.svg';
}

interface ProductCardProps {
  product: Product;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [openImage, setOpenImage] = useState(false);
  const { addToCart } = useCart();

  const increment = () => setQty((q) => q + 1);
  const decrement = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    // Cek stock availability
    if (product.stock === 0 || product.status === 'out_of_stock') {
      alert('Maaf, produk ini sedang habis stok.');
      return;
    }

    if (qty > product.stock) {
      alert(`Maaf, stock hanya tersedia ${product.stock} ${product.unit}.`);
      setQty(product.stock);
      return;
    }

    addToCart(product, qty);
    setQty(1); // Reset quantity after adding to cart

    // Show success feedback (optional)
    const button = document.activeElement as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Ditambahkan!';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    }
  };

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={getCorrectImageUrl(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform group-hover:scale-110 cursor-pointer"
            onClick={() => setOpenImage(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('placeholder-product.svg')) {
                target.src = '/images/placeholder-product.svg';
              }
            }}
          />

          {/* Status Badge */}
          {product.status !== 'available' && (
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.status === 'preorder'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {product.status === 'preorder' ? 'Pre-order' : 'Stok Habis'}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-base font-bold text-orange-600">
                {formatPrice(product.price)}
              </div>
              <div className="text-xs text-gray-500">
                {product.unit}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium ${product.stock === 0 ? 'text-red-600' :
                product.stock <= 5 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                Stock: {product.stock}
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={decrement}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                disabled={product.status === 'out_of_stock' || product.stock === 0}
              >
                -
              </button>
              <span className="px-2 py-1 text-sm font-medium min-w-[30px] text-center">
                {qty}
              </span>
              <button
                onClick={increment}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                disabled={product.status === 'out_of_stock' || product.stock === 0 || qty >= product.stock}
              >
                +
              </button>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <div className="text-xs text-yellow-600 font-medium">
                Stok terbatas!
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.status === 'out_of_stock' || product.stock === 0}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${product.status === 'out_of_stock' || product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
              }`}
          >
            {product.status === 'out_of_stock' || product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {openImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setOpenImage(false)}
        >
          <div className="relative max-w-3xl max-h-[90vh] w-full h-full">
            <Image
              src={getCorrectImageUrl(product)}
              alt={product.name}
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('placeholder-product.svg')) {
                  target.src = '/images/placeholder-product.svg';
                }
              }}
            />
            <button
              onClick={() => setOpenImage(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;