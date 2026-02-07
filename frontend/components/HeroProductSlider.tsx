"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  src: string;
  alt: string;
};

const productImages: ProductImage[] = [
  { src: "/images/4.png", alt: "Telur" },
  { src: "/images/2.png", alt: "Lele fresh" },
  { src: "/images/3.png", alt: "Lele marinasi" },
  { src: "/images/1.png", alt: "Ayam Ungkep" },
  { src: "/images/5.png", alt: "Minyak goreng" },
];

export default function HeroProductSlider() {
  const [index, setIndex] = useState(0);
  const current = productImages[index];

  const next = () =>
    setIndex((i) => (i + 1) % productImages.length);

  const prev = () =>
    setIndex((i) => (i - 1 + productImages.length) % productImages.length);

  return (
    <>
      {/* FOTO FULL DI KOTAK */}
      <div className="relative h-full w-full">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 486px"
          className="object-cover"
        />
      </div>

      {/* Tombol kiri */}
      <button
        type="button"
        onClick={prev}
        aria-label="Produk sebelumnya"
        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-orange-500 text-lg shadow-md ring-1-orange-300 hover:bg-orange/500 hover:text-white transition"
      >
        &#10094;
      </button>

      {/* Tombol kanan */}
      <button
        type="button"
        onClick={next}
        aria-label="Produk berikutnya"
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-orange-500 text-lg shadow-md ring-1 ring-0range-300 hover:text-white transition"
      >
        &#10095;
      </button>
    </>
  );
}