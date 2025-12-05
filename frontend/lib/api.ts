import { Product } from './types';

// SEMENTARA: pakai base URL hardcode
const API_BASE = 'http://localhost:4000';

console.log('API_BASE di frontend (hardcode):', API_BASE);

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Gagal memuat produk');
  }

  return res.json();
}