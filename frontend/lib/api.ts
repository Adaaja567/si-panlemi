'use client';

// Import types from types.ts to avoid duplication
import type { Product } from '@/lib/types';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Helper function to safely parse JSON responses
async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ---------------- PRODUCTS ----------------
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error((data as any).message || 'Gagal memuat produk');
  }

  return data.products || data || [];
}

// ---------------- ORDERS ----------------
export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: 'cod' | 'dana';
  deliveryArea?: string;
  note?: string;
}

export async function createOrder(payload: CreateOrderPayload, paymentProof?: File) {
  const formData = new FormData();
  
  // Add order data
  formData.append('items', JSON.stringify(payload.items));
  formData.append('customerName', payload.customerName);
  formData.append('customerPhone', payload.customerPhone);
  formData.append('customerAddress', payload.customerAddress);
  formData.append('paymentMethod', payload.paymentMethod);
  
  if (payload.deliveryArea) {
    formData.append('deliveryArea', payload.deliveryArea);
  }
  
  if (payload.note) {
    formData.append('note', payload.note);
  }
  
  // Add payment proof if provided
  if (paymentProof) {
    formData.append('paymentProof', paymentProof);
  }

  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new Error((data as any).error || (data as any).message || `Gagal membuat pesanan (${res.status})`);
  }

  return data;
}

// ---------------- USER AUTH (pelanggan) ----------------
export interface UserLoginPayload {
  phone: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserRegisterPayload {
  name: string;
  phone: string;
  address: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserAuthResponse {
  message?: string;
  token?: string;
  user: {
    id: string;
    role: 'user';
    name: string;
    phone: string;
    address: string;
  };
}

export async function userMe(): Promise<UserAuthResponse> {
  const res = await fetch(`${API_URL}/api/users/me`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Belum login');
  return data as UserAuthResponse;
}

export async function userLogin(payload: UserLoginPayload): Promise<UserAuthResponse> {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal login');

  return data as UserAuthResponse;
}

export async function userRegister(payload: UserRegisterPayload): Promise<UserAuthResponse> {
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal registrasi');

  return data as UserAuthResponse;
}

export async function userLogout() {
  const res = await fetch(`${API_URL}/api/users/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal logout');
  return data;
}

// ---------------- USER: MY ORDERS ----------------
export async function getMyOrders() {
  const res = await fetch(`${API_URL}/api/my-orders`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat pesanan');

  return data;
}

export async function cancelMyOrder(orderId: string) {
  const res = await fetch(`${API_URL}/api/my-orders/${orderId}/cancel`, {
    method: 'PUT',
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal membatalkan pesanan');

  return data;
}

// ---------------- ADMIN AUTH (admin & super admin) ----------------
export interface AdminLoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminLoginResponse {
  message?: string;
  token?: string;
  user: {
    id: string;
    role: 'admin' | 'super_admin';
    username: string;
  };
}

export async function adminMe(): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Belum login admin');

  return data as AdminLoginResponse;
}

export async function adminLogin(payload: AdminLoginPayload): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal login admin');

  return data as AdminLoginResponse;
}

export async function adminLogout() {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal logout admin');
  return data;
}

// ---------------- ADMIN: ORDERS ----------------
export async function fetchAdminOrders() {
  const res = await fetch(`${API_URL}/api/admin/orders`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat pesanan admin');

  return data;
}

export async function updateAdminOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal update status pesanan');

  return data;
}

export async function verifyPaymentProof(orderId: string, status: 'approved' | 'rejected') {
  const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/payment/verify`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal verifikasi pembayaran');

  return data;
}

// ---------------- ADMIN: PRODUCTS ----------------
export async function fetchAdminProducts() {
  const res = await fetch(`${API_URL}/api/admin/products`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat produk admin');

  return data;
}

export async function createAdminProduct(payload: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) {
  const res = await fetch(`${API_URL}/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal membuat produk');

  return data;
}

export async function updateAdminProduct(id: string, payload: Partial<Product>) {
  const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal update produk');

  return data;
}

export async function deleteAdminProduct(id: string) {
  const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal menghapus produk');

  return data;
}

// ---------------- UPLOAD ----------------
export async function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/api/upload/product`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal upload gambar');

  return data;
}

export async function deleteProductImage(filename: string) {
  const res = await fetch(`${API_URL}/api/upload/product/${filename}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal menghapus gambar');

  return data;
}

// ---------------- RESET PASSWORD ----------------
export async function requestPasswordReset(phone: string) {
  const res = await fetch(`${API_URL}/api/reset-password/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal mengirim kode verifikasi');

  return data;
}

export async function verifyPasswordReset(phone: string, verificationCode: string, newPassword: string) {
  const res = await fetch(`${API_URL}/api/reset-password/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, verificationCode, newPassword }),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal reset password');

  return data;
}

// ---------------- STOCK NOTIFICATIONS ----------------
export async function fetchStockNotifications() {
  const res = await fetch(`${API_URL}/api/stock/notifications`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat notifikasi stock');

  return data;
}

export async function restockProduct(productId: string, quantity: number, action: 'add' | 'set' = 'add') {
  const res = await fetch(`${API_URL}/api/stock/restock/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ quantity, action }),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal update stock');

  return data;
}

export async function fetchStockSummary() {
  const res = await fetch(`${API_URL}/api/stock/summary`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat summary stock');

  return data;
}

// ---------------- SUPER ADMIN: ANALYTICS ----------------
export async function fetchSuperAdminAnalytics(days = 30) {
  const res = await fetch(
    `${API_URL}/api/super-admin/analytics?days=${encodeURIComponent(String(days))}`,
    { credentials: 'include' }
  );

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat analytics');

  return data;
}

// ---------------- SUPER ADMIN: ADMINS CRUD ----------------
export async function fetchSuperAdminAdmins() {
  const res = await fetch(`${API_URL}/api/super-admin/admins`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat admin');

  return data;
}

export async function createSuperAdminAdmin(payload: {
  username: string;
  password: string;
  role?: 'admin' | 'super_admin';
}) {
  const res = await fetch(`${API_URL}/api/super-admin/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal membuat admin');

  return data;
}

export async function updateSuperAdminAdmin(
  id: string,
  payload: { role?: 'admin' | 'super_admin'; isActive?: boolean; password?: string }
) {
  const res = await fetch(`${API_URL}/api/super-admin/admins/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal update admin');

  return data;
}

export async function deleteSuperAdminAdmin(id: string) {
  const res = await fetch(`${API_URL}/api/super-admin/admins/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal menghapus admin');

  return data;
}

// ---------------- SUPER ADMIN: USERS ----------------
export async function fetchSuperAdminUsers() {
  const res = await fetch(`${API_URL}/api/super-admin/users`, {
    credentials: 'include',
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal memuat user');

  return data;
}

export async function setSuperAdminUserActive(id: string, isActive: boolean) {
  const res = await fetch(`${API_URL}/api/super-admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ isActive }),
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) throw new Error((data as any).message || 'Gagal update user');

  return data;
}