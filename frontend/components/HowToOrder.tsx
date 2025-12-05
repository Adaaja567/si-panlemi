import React from 'react';

const steps = [
  {
    title: 'Pilih Produk',
    desc: 'Lihat daftar produk Ngendok_Farm dan tentukan kebutuhan Anda.',
  },
  {
    title: 'Klik Pesan',
    desc: 'Tekan tombol "Pesan via WhatsApp" atau isi form pemesanan.',
  },
  {
    title: 'Konfirmasi',
    desc: 'Kami konfirmasi harga, stok, dan waktu kirim melalui WhatsApp.',
  },
  {
    title: 'Pembayaran',
    desc: 'Bayar secara COD atau transfer sesuai kesepakatan.',
  },
];

const HowToOrder: React.FC = () => (
  <section id="cara-pesan" className="bg-white py-10">
    <div className="mx-auto max-w-4xl px-4">
      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Cara Pesan di Ngendok_Farm
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Langkah sederhana untuk memesan bahan masakan rumahan.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="flex h-full flex-col rounded-xl border border-orange-100 bg-orange-50/60 p-4"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                {idx + 1}
              </span>
              <h3 className="text-sm font-semibold text-gray-900">
                {step.title}
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-700">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowToOrder;