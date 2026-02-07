import Link from 'next/link';

export default function CaraPesanPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cara Pesan di Ngendok_Farm</h1>
          <p className="text-gray-600 mb-8">
            Ikuti langkah mudah berikut untuk memesan produk segar dari Ngendok_Farm
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pilih Produk</h3>
                  <p className="text-gray-600 text-sm">
                    Klik{' '}
                    <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium underline">
                      Beranda
                    </Link>
                    {' '}lalu scroll ke bagian Produk untuk melihat daftar produk segar kami
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tambah ke Keranjang</h3>
                  <p className="text-gray-600 text-sm">
                    Pilih jumlah yang diinginkan, lalu klik tombol <strong>"+ Keranjang"</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Checkout</h3>
                  <p className="text-gray-600 text-sm">
                    Buka{' '}
                    <Link href="/cart" className="text-orange-600 hover:text-orange-700 font-medium underline">
                      Keranjang
                    </Link>
                    {' '}dan klik "Checkout" untuk melanjutkan
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Isi Data</h3>
                  <p className="text-gray-600 text-sm">
                    Lengkapi nama, nomor WhatsApp, dan alamat pengiriman
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pilih Pembayaran</h3>
                  <p className="text-gray-600 text-sm">
                    Pilih metode pembayaran: <strong>DANA</strong> atau <strong>COD</strong> (Bayar di tempat)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  6
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Upload Bukti (DANA)</h3>
                  <p className="text-gray-600 text-sm">
                    Jika pilih DANA, transfer ke <strong>0895-3264-22463</strong> lalu upload bukti transfer
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  7
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Konfirmasi Admin</h3>
                  <p className="text-gray-600 text-sm">
                    Admin akan memproses dan mengonfirmasi pesanan via WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  8
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cek Status</h3>
                  <p className="text-gray-600 text-sm">
                    Pantau status pesanan di{' '}
                    <Link href="/riwayat-pesanan" className="text-orange-600 hover:text-orange-700 font-medium underline">
                      Riwayat Pesanan
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Tips Berbelanja</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Pesan sebelum jam 15:00 untuk pengiriman hari yang sama</li>
              <li>• Produk dijamin segar dan berkualitas</li>
              <li>• Gratis ongkir untuk area Rembang Kota</li>
              <li>• Customer service siap membantu via WhatsApp</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Mulai Belanja Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}