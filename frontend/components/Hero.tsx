import React from 'react';
import WhatsAppButton from './WhatsAppButton';

const WA_PHONE = '6281234567890'; // ganti nomor WA

const Hero: React.FC = () => {
  const message =
    'Halo Ngendok_Farm, saya tertarik dengan produk ayam ungkep, lele, telur, dan minyak. Mohon info lebih lanjut.';

  return (
    <section className="bg-orange-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-10 md:flex-row md:py-16">
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            Bahan Masakan Rumahan – Fresh, Halal, Siap Goreng.
          </h1>
          <p className="mt-3 text-sm text-gray-700 sm:text-base">
            Ayam ungkep bumbu rumahan, lele fresh & marinasi, telur, dan
            minyak goreng untuk dapur dan usaha kuliner rumahan Anda. Praktis,
            higienis, dan terjangkau.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <a
              href="#produk"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-orange-600"
            >
              Lihat Menu
            </a>
            <WhatsAppButton
              phone={WA_PHONE}
              message={message}
              className="sm:w-auto w-full"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative h-56 w-full rounded-2xl bg-white shadow md:h-72">
            <div className="absolute inset-4 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-700">
              <div className="rounded-xl bg-orange-100 px-3 py-2">
                Ayam Ungkep
              </div>
              <div className="rounded-xl bg-green-100 px-3 py-2">
                Lele Fresh
              </div>
              <div className="rounded-xl bg-red-100 px-3 py-2">
                Lele Marinasi Pedas
              </div>
              <div className="rounded-xl bg-yellow-100 px-3 py-2">
                Telur Ayam
              </div>
              <div className="rounded-xl bg-amber-100 px-3 py-2">
                Minyak Goreng
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;