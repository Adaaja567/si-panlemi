// frontend/lib/types.ts

export type ProductCategory =
  | 'ayam'
  | 'lele_fresh'
  | 'lele_marinasi'
  | 'telur'
  | 'minyak'
  | 'sayuran'
  | 'bumbu'
  | 'beras'
  | string; // Allow custom categories

export type ProductStatus = 'available' | 'preorder' | 'out_of_stock';

export interface Product {
  _id: string; // pastikan BUKAN optional

  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  unit: string;
  stock: number; // Required stock field
  status: ProductStatus;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;

  // tambahan: resep / cara pakai / info asal minyak, opsional
  usage: string;
}