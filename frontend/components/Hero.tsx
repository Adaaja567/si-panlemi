import HeroProductSlider from "./HeroProductSlider";
import React from "react";
import WhatsAppButton from "./WhatsAppButton";

const WA_PHONE = "6289532642246"; // Nomor WA Ngendok Farm

const Hero: React.FC = () => {
  const message =
    "Halo Ngendok_Farm, saya tertarik dengan produk ayam ungkep, lele, telur, dan minyak. Mohon info lebih lanjut.";

  return (
    // Section hero utama
    <section id="beranda" className="bg-[#FFF7EC] scroll-mt-24">
      <div
        className="
          mx-auto flex max-w-6xl flex-col items-center gap-8
          px-4 py-10 md:flex-row md:py-16
          min-h-[calc(100vh-72px)]
        "
      >
        {/* KIRI */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            Serasa punya asisten dapur pribadi yang selalu siap, tanpa harus membayar
            gaji setiap bulan.
          </h1>
          <p className="mt-3 text-sm text-gray-700 sm:text-base">
            Telur, ayam ungkep, lele fresh dan marinasi, serta minyak goreng kami
            siapkan dalam kondisi bersih, higienis, dan siap olah. Ibu tidak perlu lagi
            repot belanja, membersihkan bahan, memotong, dan mengulek bumbu dari awal.
            Tinggal menyalakan kompor dan mengolah sebentar, lauk hangat sudah siap
            disajikan untuk keluarga di rumah maupun pelanggan usaha makanan rumahan.
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
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* KANAN: slider (dibesarkan) */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div
            className="
      relative h-72 w-full max-w-[520px]
      overflow-hidden rounded-3xl
      border-[5px] border-orange-400
      shadow-sm
      md:h-80
    "
          >
            <HeroProductSlider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;