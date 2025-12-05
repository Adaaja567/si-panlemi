'use client';

import React from 'react';
import WhatsAppButton from './WhatsAppButton';
import { Product } from '@/lib/types';

const statusLabel: Record<string, string> = {
  available: 'Tersedia',
  preorder: 'Pre-order',
  out_of_stock: 'Habis',
};

const statusColor: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  preorder: 'bg-yellow-100 text-yellow-700',
  out_of_stock: 'bg-red-100 text-red-700',
};

interface ProductCardProps {
  product: Product;
  waPhone: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, waPhone }) => {
  const message = `Halo Ngendok_Farm, saya mau pesan ${product.name} 1 ${product.unit}.
Nama: 
Alamat: 
Catatan: `;

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm overflow-hidden">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900">
            {product.name}
          </h3>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[product.status]}`}
          >
            {statusLabel[product.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">
          {product.description}
        </p>
        <div className="mt-3 text-sm font-bold text-orange-600">
          Rp {product.price.toLocaleString('id-ID')}
          <span className="font-normal text-gray-600"> {product.unit}</span>
        </div>
        <div className="mt-4">
          <WhatsAppButton
            phone={waPhone}
            message={message}
            className="w-full"
          >
            Pesan via WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;