// Helper untuk status bahasa Indonesia

export const statusLabels: Record<string, string> = {
  'menunggu': 'Menunggu Konfirmasi',
  'dikonfirmasi': 'Dikonfirmasi',
  'dibayar': 'Dibayar',
  'dikirim': 'Dikirim',
  'selesai': 'Selesai',
  'dibatalkan': 'Dibatalkan',
  // Legacy support
  'pending': 'Menunggu Konfirmasi',
  'confirmed': 'Dikonfirmasi',
  'paid': 'Dibayar',
  'shipped': 'Dikirim',
  'completed': 'Selesai',
  'cancelled': 'Dibatalkan'
};

export const statusColors: Record<string, string> = {
  'menunggu': 'bg-yellow-100 text-yellow-800',
  'dikonfirmasi': 'bg-blue-100 text-blue-800',
  'dibayar': 'bg-green-100 text-green-800',
  'dikirim': 'bg-purple-100 text-purple-800',
  'selesai': 'bg-gray-100 text-gray-800',
  'dibatalkan': 'bg-red-100 text-red-800',
  // Legacy
  'pending': 'bg-yellow-100 text-yellow-800',
  'confirmed': 'bg-blue-100 text-blue-800',
  'paid': 'bg-green-100 text-green-800',
  'shipped': 'bg-purple-100 text-purple-800',
  'completed': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800'
};

export const paymentStatusLabels: Record<string, string> = {
  'belum_bayar': 'Belum Bayar',
  'sudah_bayar': 'Sudah Bayar',
  // Legacy
  'unpaid': 'Belum Bayar',
  'paid': 'Sudah Bayar'
};

export const paymentMethodLabels: Record<string, string> = {
  'cod': 'Bayar di Tempat (COD)',
  'dana': 'DANA',
  'transfer_bank': 'Transfer Bank',
  'e_wallet': 'E-Wallet'
};

export function getStatusLabel(status: string): string {
  return statusLabels[status] || status;
}

export function getStatusColor(status: string): string {
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusLabel(status: string): string {
  return paymentStatusLabels[status] || status;
}

export function getPaymentMethodLabel(method: string): string {
  return paymentMethodLabels[method] || method;
}
